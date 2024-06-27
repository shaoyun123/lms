import { defineStore } from 'pinia';
import {
  getCurMsgListApi,
  createNewChatApi,
  unPinConversationApi,
  pinConversationApi
} from '@/api/shopee/chat';
import { isEmpty, cloneDeep, forIn } from 'lodash-es';
import { ElMessage } from 'element-plus';
import { sendWebsocket } from '@/utils/websocket';

const useShopeeChatStore = defineStore('shopeeChat', {
  state: () => ({
    storeAcctList: [], //店铺列表
    searchLoading: false,
    statusList: [
      { label: '未读', status: 'UNREAD', checked: true, count: null },
      { label: '未处理', status: 'UN_HANDLED', checked: true, count: null },
      { label: '未回复', status: 'UN_ANSWERED', checked: true, count: null },
      { label: '已标记', status: 'PINNED', checked: false, count: null },
      {
        label: '黑名单用户',
        status: 'INBLACKLIST',
        checked: false,
        count: null
      },
      {
        label: '待处理议价',
        status: 'PENDING_OFFER',
        checked: false,
        count: null
      }
    ],
    userList: [], //
    userPage: 1,
    activeUserId: null,
    visibleUser: true, // 买家列表默认显示user
    userInfo: {}, // 选中的用户信息
    isCheckedStatus: false,
    checkAll: false,
    total: null,
    isLoadUserList: true, //
    loadingBuyerList: false, // 加载buyerlist的loading
    searchList: [],
    activeSearchIndex: null,
    searchTimeStamp: null,
    cacheSearchList: [],
    tabLoading: false,
    messageList: [],
    messageListLoading: false,
    middleComponentsRef: null //中间模块的ref
  }),
  getters: {},
  actions: {
    // 置空 卖家列表，聊天信息，
    reset() {
      this.storeAcctList = []; //店铺列表
      this.searchLoading = false;
      this.userList = []; //
      this.userPage = 1;
      this.activeUserId = null;
      this.visibleUser = true; // 买家列表默认显示user
      this.userInfo = {}; // 选中的用户信息
      this.isCheckedStatus = false;
      this.checkAll = false;
      this.total = null;
      this.isLoadUserList = true; //
      this.loadingBuyerList = false; // 加载buyerlist的loading
      this.searchList = [];
      this.activeSearchIndex = null;
      this.searchTimeStamp = null;
      this.cacheSearchList = [];
      this.tabLoading = false;
      this.messageList = [];
      this.messageListLoading = false;
      this.middleComponentsRef = null;
    },
    //
    handleBeginCheck() {
      this.isCheckedStatus = !this.isCheckedStatus;
    },

    setUserPage() {
      this.userPage++;
    },
    setLoadingBuyerList(val) {
      this.loadingBuyerList = val;
    },
    chooseStatus(index) {
      const curObj = cloneDeep(this.statusList[index]);
      this.statusList[index].checked = !curObj.checked;
    },
    // 获取买家列表
    async getUserList(
      {
        page,
        conversationStatusList,
        keyword,
        keywordQueryType,
        storeAcctIdList
      } = {
        page: 2,
        conversationStatusList: [],
        keyword: '',
        keywordQueryType: '',
        storeAcctIdList: []
      }
    ) {
      this.searchLoading = true;
      this.changerVisibleUser(!keyword);
      this.searchTimeStamp = new Date().getTime();
      sendWebsocket(
        JSON.stringify({
          type: 'query',
          data: {
            storeAcctIdList,
            limit: 30,
            page,
            conversationStatusList,
            keyword,
            keywordQueryType
          },
          requestId: this.searchTimeStamp
        }),
        this.msgCallBack
      );
    },
    msgCallBack(e) {
      this.searchLoading = false;
      this.loadingBuyerList = false;
      const { data, code } = e;
      if (code === '0000') {
        // if (this.searchTimeStamp != data.requestId) return;
        if (data.type === 'PUSH_COUNT') {
          // 数量
          if (!isEmpty(data.conversationStatusCount)) {
            this.statusList.forEach((item) => {
              item.count = data.conversationStatusCount[item.status];
            });
          }
        } else if (data.type === 'QUERY_COMMON') {
          // 查询列表
          if (Array.isArray(data.conversations)) {
            // 剔除重复数据
            const _existUserListObj = {};
            this.userList.forEach((item) => {
              _existUserListObj[item.conversationId] = item.storeAcctId;
            });
            const _list = data.conversations
              .filter(
                (item) =>
                  _existUserListObj[item.conversationId] != item.storeAcctId
              )
              .map((item) => ({
                ...item,
                isCheckedStatus: this.isCheckedStatus
              }));
            this.userList.push(..._list);
          }
          if (data.errMsg) {
            this.isLoadUserList = false;
          }
        } else if (data.type === 'QUERY_KEYWORD') {
          const {
            buyer = [],
            message = [],
            orderSn = []
          } = data.keywordQueryResults;
          this.cacheSearchList = [buyer, message, orderSn];
          this.searchList = [
            buyer.slice(0, 5),
            message.slice(0, 5),
            orderSn.slice(0, 5)
          ];
        } else if (data.type === 'PUSH_MESSAGE') {
          // 买家发的消息
          // type: 2自己发 1是推送
          const { message } = data;
          if (message?.type === 1) {
            // console.log("接受成功", e.data)
            const { conversationId: cId, storeAcctId: sId } = this.userInfo;
            if (message.conversationId === cId && message.storeAcctId === sId) {
              this.messageList = this.messageList.map((item) => ({
                ...item,
                readStatus: true
              }));
              this.messageList.push(message);
              // 当前聊天窗口的滚动条滑倒最低
              this.middleComponentsRef.scrollToBottom();
            }
            this.changeUserListByMsg(
              { ...data.message, ...data.conversation },
              1,
              data.conversation
            );
            // 待议价
            if (
              message?.messageType === 'offer' &&
              message?.offer?.offerStatus === 1
            ) {
              this.changeOfferCount({ type: 'add' });
            }
          } else {
            const lastMsg = this.messageList.pop();
            if (!!lastMsg && lastMsg.msgStatus === 'sending') {
              const _lastMsg = {
                ...lastMsg,
                msgStatus: 'succ'
              };
              this.changeUserListByMsg({ ...lastMsg, ...message }, 2);
              this.messageList.push({
                ..._lastMsg,
                ...message
              });
            }
          }
        } else if (data.type === 2) {
          this.changeLastMsgStatus(e, 'succ');
        }
      } else {
        if (data?.type === 'PUSH_MESSAGE') {
          const lastMsg = this.messageList.pop();
          if (!!lastMsg && lastMsg.msgStatus === 'sending') {
            const _lastMsg = {
              ...lastMsg,
              msgStatus: 'fail'
            };
            let _message = data?.message || {};
            const newMessage = { ..._lastMsg, ..._message };
            this.messageList.push(newMessage);
            this.changeUserListByMsg(newMessage, 2);
          }
        } else if (!isEmpty(this.userInfo)) {
          this.changeLastMsgStatus(e, 'fail');
        } else if (data?.type === 2) {
          this.changeLastMsgStatus(e, 'fail');
        }
        e.msg && ElMessage.error(e.msg);
      }
    },
    changeLastMsgStatus(e, msgStatus) {
      const lastMsg = this.messageList.pop();
      if (!!lastMsg && lastMsg.msgStatus === 'sending') {
        const _lastMsg = {
          ...lastMsg,
          msgStatus
        };
        let statusObj = {};
        if (e.data && e.data.conversationStatus) {
          statusObj = { ...e.data };
        }
        const newMessage = {
          ..._lastMsg,
          ...statusObj
        };
        this.messageList.push(newMessage);
        this.changeUserListByMsg(newMessage, 2);
      }
    },
    changerVisibleUser(status) {
      this.visibleUser = status;
    },
    // 改变所有买家某一状态
    async changeUserList(obj) {
      this.userList = this.userList.map((item) => ({ ...item, ...obj }));
    },
    // 改变买家某key
    async changeUserListKey(obj, index) {
      this.userList[index] = { ...this.userList[index], ...obj };
    },
    changeUserListStatus({
      conversationStatus,
      conversationIdList,
      conversationStatusList
    }) {
      const checkedStatus = conversationStatusList;
      const isInstatus = checkedStatus.includes(conversationStatus);
      // 如果在状态里，就改变状态。不在就删除
      if (isInstatus) {
        this.userList.forEach((item, index) => {
          if (conversationIdList.includes(item.conversationId)) {
            this.userList[index].conversationStatus = conversationStatus;
          }
        });
      } else {
        this.userList = this.userList.filter(
          (item) => !conversationIdList.includes(item.conversationId)
        );
      }
    },
    handleCheckUser(index) {
      const obj = this.userList[index];
      this.userList.splice(index, 1, { ...obj, checked: !obj.checked });
      const unChecked = this.userList.filter((item) => !item.checked);
      if (!unChecked.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    handleCheckAll() {
      this.checkAll = !this.checkAll;
      this.userList = this.userList.map((item) => ({
        ...item,
        checked: this.checkAll
      }));
    },
    delConverSation(curObj) {
      this.userList.forEach((elem, elemIndex) => {
        if (elem.conversationId === curObj.item.conversationId) {
          // 将该条会话删除
          this.userList.splice(elemIndex, 1);
          // 若当前打开了这条会话，需要将userinfo置空
          if (curObj.item.id === curObj.active) {
            this.fetchMessage();
          }
          // 该店铺未读数减去该用户的未读数
          //  curObj && this.$emit("storeReduceNum", { storeAcctId, unreadCount });
        }
      });
    },
    // 获取消息列表
    async fetchMessage(obj = {}, type = 'userCard', index, objKey) {
      this.userInfo = obj;
      const { conversationId, storeAcctId } = obj;
      if (conversationId) {
        // 先读取再查询会话列表
        this.messageListLoading = true;
        try {
          const { data } = await getCurMsgListApi(conversationId, storeAcctId);
          this.messageList = data || [];
        } catch (err) {
          this.messageList = [];
          console.log('err :>> ', err);
        }
        this.messageListLoading = false;
        // 将数据存储
        if (type === 'userCard') {
          this.userList[index].messageList = this.messageList;
        } else {
          this.searchList[objKey][index].messageList = this.messageList;
        }
      }
    },
    // 发消息
    async sendMessage({ messageType, params, showData = {} }) {
      const { toId, storeAcctId, conversationId } = this.userInfo;
      const basicParams = {
        toId: toId,
        storeAcctId,
        messageType,
        conversationId
      };
      const sendData = {
        ...basicParams,
        content: { ...params }
      };
      let addOwnData = {};
      if (['order', 'item'].includes(messageType) && !isEmpty(showData)) {
        addOwnData = {
          buyerOrSeller: 2,
          ...params,
          ...basicParams,
          ...showData,
          createTime: new Date().getTime(),
          msgStatus: 'sending'
        };
      } else {
        addOwnData = {
          buyerOrSeller: 2,
          ...params,
          ...basicParams,
          createTime: new Date().getTime(),
          msgStatus: 'sending'
        };
      }
      this.messageList.push(addOwnData);
      if (conversationId) {
        this.searchTimeStamp = new Date().getTime();
        sendWebsocket(
          JSON.stringify({
            type: 'send',
            data: sendData,
            requestId: this.searchTimeStamp
          }),
          this.msgCallBack
        );
      } else {
        try {
          // 新创建的会话需要带上订单号,目前仅搜索内容为订单号才会创建新会话
          const indexList = this.activeSearchIndex.split('_');
          sendData.content.orderSn =
            this.cacheSearchList[indexList[0]][indexList[1]].orderSn;
          const { data } = await createNewChatApi(sendData);
          (this.cacheSearchList?.buyer || []).forEach((item, index) => {
            if (item.toId === sendData.toId) {
              this.cacheSearchList.buyer[index] = {
                ...item,
                conversationId: data.response.conversationId
              };
            }
          });
          (this.cacheSearchList?.orderSn || []).forEach((item, index) => {
            if (item.toId === sendData.toId) {
              this.cacheSearchList.orderSn[index] = {
                ...item,
                conversationId: data.response.conversationId
              };
            }
          });
          this.userInfo.conversationId = data.response.conversationId;
          this.msgCallBack({
            code: '0000',
            data: {
              type: 'PUSH_MESSAGE',
              message: {
                type: 2,
                ...data.response
              }
            }
          });
        } catch (err) {
          console.log('err :>> ', err);
          this.msgCallBack({ code: '9999' });
        }
        // this.sendMessage({ messageType, params, showData });
      }
      // 滚动条滑动最下面
      this.middleComponentsRef.scrollToBottom();
    },
    // 判断推送消息的会话组是否是当前打开组
    //    不是：组+1
    //  是：判断推送消息的站点是都是当前打开的站点
    //     不是：组+1，站点+1
    // 	  是：判断推送消息的会话是否是当前打开的会话
    // 	    不是：组+1，站点+1，会话+1
    // 		  是：显示消息，已读
    // type: 2自己发 1是推送
    changeUserListByMsg(params, type, conversationObj) {
      // 物品号
      if (params.messageType === 'item') {
        params.messageType = 'product';
      }
      // 收到的消息处于searchCard列表里
      if (!this.visibleUser) {
        let messageList = [];
        let isNotInActiveFirst = false;
        // 如果是当前对话，直接使用当前的聊天列表就可以了
        if (
          this.userInfo.storeAcctId === params.storeAcctId &&
          this.userInfo.conversationId === params.conversationId
        ) {
          messageList = cloneDeep(this.messageList);
        } else {
          isNotInActiveFirst = true;
        }
        forIn(this.searchList, function (value) {
          (value || []).forEach((item) => {
            if (
              item.conversationId === params.conversationId &&
              params.storeAcctId === item.storeAcctId
            ) {
              // 接受的消息不是当前聊天，但是messageList长度大于0；
              if (item.messageList?.length && isNotInActiveFirst) {
                messageList = item.messageList.concat(params);
                // 存在多个相同的对话，用其中一个messageList就可以了
                isNotInActiveFirst = false;
              }
              // 改变这条发送状态，
              item.messageList = messageList;
              item.unreadCount = params.unreadCount;
              item.conversationStatus = params.conversationStatus;
              item.latestMessageType = params.messageType;
              item.latestMessageContent = params.text || '';
              item.lastMessageTimestamp = params.createTime;
              if (type === 2) {
                // 改变这条发送状态
                const _messageList = cloneDeep(item.messageList);
                _messageList.pop();
                item.messageList = _messageList.concat(params);
              }
            }
          });
        });
      } else {
        const curIndex = this.userList.findIndex(
          (item) =>
            item.conversationId === params.conversationId &&
            params.storeAcctId === item.storeAcctId
        );
        const temp = this.userList[curIndex];
        let _temp = {};
        if (type == 1 && curIndex === -1) {
          // 推送消息，但userList里没这个对话，往userList头部添加
          _temp = {
            ...conversationObj,
            ...params,
            lastMessageTimestamp: params.createTime,
            latestMessageType: params.messageType,
            latestMessageContent: params.text || '',
            unreadCount: (params.unreadCount || 0) + 1
          };
          this.userList.unshift(_temp);
          return;
        } else if (type == 1 && curIndex !== -1) {
          // 推送消息，但userList里有这个对话，把这个对话位置移到第一位，改变相应的状态
          _temp = {
            ...temp,
            unreadCount: (params.unreadCount || temp.unreadCount || 0) + 1,
            conversationStatus: params.conversationStatus,
            latestMessageType: params.messageType,
            latestMessageContent: params.text || '',
            lastMessageTimestamp: params.createTime
          };
          if (temp.messageList?.length) {
            // 如果是已经打开过的会话，就把该推送消息放进去
            _temp.messageList = temp.messageList.concat(params);
          }
          this.userList.splice(curIndex, 1);
          this.userList.unshift(_temp);
        } else if (type == 2 && curIndex === -1) {
          // 接收消息，但userList里没有这个对话，，这种情况应该不存在
          return;
        } else {
          // 接收消息，但userList里有这个对话，把这个对话位置移到第一位，改变相应的状态
          // 改变这条发送状态，
          _temp = {
            ...temp,
            unreadCount: params.unreadCount,
            conversationStatus: params.conversationStatus,
            latestMessageType: params.messageType,
            latestMessageContent: params.text || '',
            lastMessageTimestamp: params.createTime
          };
          // 如果是已经打开过的会话，就把该推送消息放进去
          if (temp.messageList?.length) {
            // 改变这条发送状态
            const _messageList = cloneDeep(temp.messageList);
            _messageList.pop();
            _temp.messageList = _messageList.concat(params);
          }
          this.userList.splice(curIndex, 1);
          this.userList.unshift(_temp);
        }
      }
    },
    async handlePinned(pinnedStatus) {
      let fetchPin = pinnedStatus ? pinConversationApi : unPinConversationApi;
      const { conversationId, storeAcctId } = this.userInfo;
      try {
        await fetchPin({ conversationId, storeAcctId });
        this.userInfo.pinned = pinnedStatus;
        this.userList.some((item) => {
          if (
            item.conversationId === conversationId &&
            storeAcctId === item.storeAcctId
          ) {
            item.pinned = pinnedStatus;
            return true;
          }
        });
        return false;
      } catch (err) {
        console.log('err :>> ', err);
      }
    }
  }
});
export default useShopeeChatStore;
