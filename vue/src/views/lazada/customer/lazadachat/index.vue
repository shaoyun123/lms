<template>
  <el-row class="container" style="margin-top: 45px">
    <el-col :span="24" class="main">
      <aside class="menu-expanded">
        <el-row class="aside_header">Lazada Chat</el-row>
        <!-- 最左侧menu -->
        <!-- :default-active="1-0" -->
        <el-menu>
          <!-- 查询框 -->
          <el-row class="">
            <el-form :inline="true" style="padding: 10px">
              <el-select
                v-model="customerListValue"
                filterable
                placeholder="lazada客服专员"
                size="small"
                style="margin-bottom: 10px; width: 220px"
                @change="customerListChange"
              >
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.userName"
                  @click="getStoreAcctListByCustomerId(item.id)"
                >
                </el-option>
              </el-select>
              <div style="display: flex">
                <el-select
                  v-model="storeAcctRequestParams"
                  filterable
                  value-key="id"
                  multiple
                  style="width: 220px"
                  placeholder="店铺多选"
                  size="small"
                >
                  <el-option
                    v-for="item in storeAcctList"
                    :key="item.id"
                    :label="item.storeAcct"
                    :value="item"
                  >
                  </el-option>
                </el-select>
                <el-button
                  type="danger"
                  size="small"
                  style="margin-left: 10px"
                  @click="getSameGroupStoreSessionList()"
                  >查询</el-button
                >
              </div>
            </el-form>
          </el-row>
          <!-- 店铺menu，懒加载 -->
          <div class="infinite-list-wrapper" style="overflow: auto">
            <ul
              v-infinite-scroll="load"
              class="list"
              infinite-scroll-disabled="disabled"
            >
              <!-- <template> -->
              <el-menu-item
                v-for="(item, index) in showStoreAcctListData"
                :key="item.storeAcctId.toString()"
                style="padding-left: 20px"
                :index="item.storeAcctId.toString()"
                @click="leftMenu1Func(item, index)"
              >
                <!-- :index="'1-' + index" -->
                <div style="width: 220px">{{ item.storeAcct }}</div>
                <el-badge
                  :value="item.unreadCount <= 0 ? '' : item.unreadCount"
                  :max="99"
                  style="line-height: 20px"
                >
                </el-badge>
              </el-menu-item>
              <!-- </template> -->
            </ul>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </div>
        </el-menu>
      </aside>
      <!--对话列表menu-->
      <aside class="menu-expanded">
        <aside-left-menu :aside-left-menu="asideLeftMenu"></aside-left-menu>
      </aside>
      <!-- 对话框chat -->
      <section
        class="content-container"
        style="
          border-style: none solid none solid;
          border-width: 1px;
          border-color: #e6e6e6;
        "
      >
        <chat></chat>
      </section>
      <!-- 公告 -->
      <aside class="menu-expanded-right">
        <aside-right-menu></aside-right-menu>
      </aside>
    </el-col>
  </el-row>
</template>

<script name="lazadacustomerlazadachat">
  import { defineComponent, computed } from 'vue';
  import { isEmpty } from 'lodash-es';
  import { getItem } from '@/utils/storage';
  import lazadaChat from '@/store/lazadaChat/store';
  import {
    getAllLazadaCustomers,
    getSameGroupStoreAllUnReadCount,
    getSameGroupStoreDetailUnReadCount,
    getSalesAcctListByCustomer
  } from '@/api/lazada/index';
  import SockJS from 'sockjs-client/dist/sockjs.min.js';
  import Stomp from 'stompjs';

  import asideRightMenu from '@/components/lazada/AsideRightMenu.vue';
  import asideLeftMenu from '@/components/lazada/AsideLeftMenu.vue';
  import chat from '@/components/lazada/Chat.vue';

  export default defineComponent({
    // eslint-disable-next-line vue/component-definition-name-casing
    name: 'lazadacustomerlazadachat',
    components: {
      asideRightMenu,
      asideLeftMenu,
      chat
    },
    setup() {
      const { state } = lazadaChat(); // 引入 useStore 类似 vue2 的 this.$store

      const stateMessage = computed(() => {
        // 使用计算属性来监听数据的变化
        return state.message;
      });
      return {
        // 返回出去供 template 模板访问
        state,
        stateMessage
      };
    },
    data() {
      return {
        customerList: [], // lazada客服专员下拉值
        storeAcctList: [], // 店铺多选下拉值
        customerListValue: '', // lazada客服专员选中的值
        storeAcctRequestParams: [], // 店铺多选选中的值
        sameStoreRequestParams: { salesAcctList: [] },
        circleUrl:
          'http://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        showStoreAcctListData: [], // 同组店铺会话列表-当前展示的店铺
        storeAcctListData: [], // 同组店铺会话列表-所有店铺
        curPage: 1,
        loading: false,
        asideLeftMenu: [],
        lockReconnect: false
      };
    },
    computed: {
      // 懒加载计算
      noMore() {
        return (
          this.showStoreAcctListData.length >= this.storeAcctListData.length
        );
      },
      disabled() {
        return this.loading || this.noMore;
      }
    },
    watch: {
      'state.salesUnreadSiteCount': function () {
        // 店铺组所有数据
        let showStoreAcctListData = this.state.showStoreAcctListData;
        // 当前店铺组索引
        let index = this.state.storeUnreadCount;
        // 修改当前店铺组的未读数
        showStoreAcctListData[index].unreadCount =
          showStoreAcctListData[index].unreadCount -
          this.state.sessionUnreadCount;
        // 将修改后的店铺组的所有数据放到store里
        this.state.showStoreAcctListData = showStoreAcctListData;
      },
      // 当前店铺的所有站点
      'state.showStoreAcctListData': function (val) {
        this.storeAcctListData = val;
        this.showStoreAcctListData = val.slice(0, 30);
      },
      divHeight(val) {
        // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
        if (!this.timer) {
          // 一旦监听到的divHeight值改变，就将其重新赋给data里的divHeight
          this.divHeight = val;
          this.timer = true;
          let that = this;
          setTimeout(function () {
            // 打印screenWidth变化的值
            that.timer = false;
          }, 500);
        }
      }
    },
    mounted() {
      // 获取lazada客服专员列表
      getAllLazadaCustomers({ roleList: ['lazada客服专员'] }).then((res) => {
        if (res.code === '0000') {
          this.customerList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });

      const _this = this;
      window.onresize = () => {
        return (() => {
          window.screenHeight = document.body.clientHeight;
          _this.divHeight = window.screenHeight - 150;
          this.state.divHeight = window.screenHeight - 150;
        })();
      };
      // 连接
      this.connection();
    },
    activated: function () {
      let detail = getItem('lazadacustomerlazadachat');
      this.$nextTick(() => {
        setTimeout(async () => {
          if (!isEmpty(detail)) {
            // 店铺回显
            this.state.showStoreAcctListData = [
              {
                storeAcctId: detail.storeAcctId,
                storeAcct: detail.storeAcct,
                unreadCount: -1
              }
            ];
            // 点击店铺调用的接口
            this.leftMenu1Func(
              {
                storeAcctId: detail.storeAcctId,
                storeAcct: detail.storeAcct
              },
              0
            );
            // await removeItem('lazadacustomerlazadachat');
          }
        }, 1000);
      });
    },
    // 销毁页面之前，断开连接
    beforeUnmount: function () {
      // 页面离开时断开连接,清除定时器
      this.disconnect();
      clearInterval(this.timer);
    },
    methods: {
      // 监听客服人员改变
      customerListChange() {
        this.showStoreAcctListData = []; // 同组店铺会话列表-当前展示的店铺
        this.storeAcctListData = []; // 同组店铺会话列表-所有店铺
        this.storeAcctListData = [];
        this.storeAcctRequestParams = []; // 店铺多选
        this.state.showStoreAcctListData = [];
        this.state.currentSalesSite = '';
        this.state.currentStoreAcctId = '';
        this.state.currentStoreId = '';
        this.state.showsalesSiteListData = []; // 会话列表
      },
      // 店铺menu懒加载
      load: function () {
        this.loading = true;
        this.curPage += 1;
        this.showStoreAcctListData = this.storeAcctListData.slice(
          0,
          30 + 10 * this.curPage
        );
        this.loading = false;
      },
      // 点击店铺显示对话列表
      leftMenu1Func(obj, index) {
        // 存入当前店铺组的未读消息数
        this.state.storeUnreadCount = index;
        // this.$store.commit('SETSTOREUNREADCOUNT', index);
        // 当前店铺的唯一标识
        this.state.currentStoreId = obj.email;
        // this.$store.commit('currentStoreId', obj.email);
        // 获取当前店铺会话列表
        getSameGroupStoreDetailUnReadCount(obj.storeAcctId).then((res) => {
          if (res.code === '0000') {
            this.asideLeftMenu = res.data;
            // 获取每个站点的未读消息数
            // if (res.data.length == 0) {
            //   this.state.showsalesSiteListData = [
            //     {
            //       storeAcctId: 25420,
            //       storeAcct: '来赞达SX27菲律宾',
            //       salesSite: 'PH',
            //       unreadCount: 0
            //     },
            //     {
            //       storeAcctId: 25421,
            //       storeAcct: '来赞达SX27泰国',
            //       salesSite: 'TH',
            //       unreadCount: 0
            //     },
            //     {
            //       storeAcctId: 25422,
            //       storeAcct: '来赞达SX27新加坡',
            //       salesSite: 'SG',
            //       unreadCount: 0
            //     },
            //     {
            //       storeAcctId: 25423,
            //       storeAcct: '来赞达SX27越南',
            //       salesSite: 'VN',
            //       unreadCount: 0
            //     }
            //   ];
            // } else {
            this.state.showsalesSiteListData = res.data;
            // }
            // this.$store.commit('showsalesSiteListData', res.data);
          } else {
            this.$message.error(res.msg);
          }
        });
      },

      // 获取客服专员和登录人店铺交集
      getStoreAcctListByCustomerId(customerId) {
        getSalesAcctListByCustomer(customerId)
          .then((res) => {
            if (res.code === '0000') {
              this.storeAcctList = res.data;
              // 存当前客服专员下面的店铺
              this.state.showStoreAcctListClick = res.data;
              // this.$store.commit('showStoreAcctListClick', res.data);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch();
      },

      // 获取同组店铺会话列表
      getSameGroupStoreSessionList() {
        if (this.customerListValue === '') {
          this.$message.error('请选择客服人员');
          return false;
        }
        this.sameStoreRequestParams.salesAcctList = this.storeAcctRequestParams; // 店铺多选选中的值

        // this.$nextTick(function () {
        // 如果没有选择店铺 则传所有的交集店铺
        if (this.storeAcctRequestParams.length === 0) {
          if (this.storeAcctList.length === 0) {
            // 交集店铺也为null
            this.storeAcctListData = [];
            this.$message({
              message: '交集店铺为空',
              type: 'warning'
            });
            this.state.showStoreAcctListData = [];
            // this.$store.commit('showStoreAcctListData', []);
            return false;
          }
          this.sameStoreRequestParams.salesAcctList = this.storeAcctList;
        }

        // 调用接口,查询
        getSameGroupStoreAllUnReadCount(this.sameStoreRequestParams)
          .then((res) => {
            if (res.code === '0000') {
              // email是唯一标识
              this.storeAcctListData = res.data.groupStoreSessionList;
              this.state.showStoreAcctListData = this.storeAcctListData;
              // this.$store.commit(
              //   'showStoreAcctListData',
              //   this.storeAcctListData
              // );
              // 存当前客服专员下面的店铺
              this.state.showStoreAcctListClick = this.storeAcctListData;
              // this.$store.commit(
              //   'showStoreAcctListClick',
              //   this.storeAcctListData
              // );
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch();
        // })
      },
      // 建立连接
      connection() {
        // 建立连接对象
        // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
        let _this = this;
        // 后台服务ip和port
        _this.socket = new SockJS('/chat/chatWebsocket');
        // 获取STOMP子协议的客户端对象
        _this.stompClient = Stomp.over(_this.socket);
        // 向服务器发起websocket连接
        _this.stompClient.connect(
          {},
          function (frame) {
            console.log('Connected: ' + frame);
            // 订阅服务端提供的某个topic
            _this.stompClient.subscribe(
              '/user/lazada/simple',
              function (greeting) {
                console.log(greeting);
                if (JSON.parse(greeting.body).code === '0000') {
                  _this.getWebSocketData(JSON.parse(greeting.body).data);
                } else {
                  _this.reconnect();
                }
              },
              () => {
                _this.reconnect();
              }
            );
          },
          function () {
            _this.reconnect();
          }
        );
      },
      // 手动关闭连接，页面销毁前关闭
      disconnect() {
        if (this.stompClient != null) {
          this.stompClient.disconnect();
        }
      },
      reconnect() {
        if (this.lockReconnect) {
          return false;
        }
        this.lockReconnect = true;
        let self = this;
        // 没连上会一直重连，设置延迟避免请求过多
        this.wsCreatHander && clearTimeout(this.wsCreatHander);
        this.wsCreatHander = setTimeout(function () {
          console.log('重连');
          self.connection();
          self.lockReconnect = false;
          console.log('重连成功');
        }, 500000);
      },
      // 判断推送消息的会话组是否是当前打开组
      //    不是：组+1
      //  是：判断推送消息的站点是都是当前打开的站点
      //     不是：组+1，站点+1
      // 	  是：判断推送消息的会话是否是当前打开的会话
      // 	    不是：组+1，站点+1，会话+1
      // 		  是：显示消息，已读
      getWebSocketData(data) {
        // data={message:{sessionId:'100567987_2_310014864176_1_103',messageId:'2l0BTPN0BtlVZ23712',siteId:'MY',content:'{"txt":"哈哈哈哈"}',fromAccountId:'310014231819',fromAccountType:1,sendTime:1639635493407,templateId:1,toAccountType:2,toAccountId:'100567987',type:1,processMsg:'',messageStatus:0,autoReply:false,nextStartTime:-1,lastMessageId:'',readStatus:false,remark:'',status:true,createTime:1639635494206,creatorId:-1,creator:'system',modifyTime:1639635494206,modifierId:-1,modifier:'system',sellerId:'1000328702'},session:{summary:'快快快',sessionId:'100567987_2_310014864176_1_103',title:'lihui',headUrl:'https://sg-live.slatic.net/original/ebf238e7aa294b55f5198f2a709efa42.png',lastMessageId:'2l0BftB0BEINj27110',lastMessageTime:1639635338271,buyerId:310014231819,unreadCount:1,tags:[''],siteId:'MY',fromAccountType:1,mark:false},salesSiteUnreadCount:[{storeAcctId:29783,storeAcct:'lazada3894-菲律宾',salesSite:'PH',unreadCount:0},{salesSite:'MY',unreadCount:1,storeAcctId:25419,storeAcct:'来赞达SX27马来'},{storeAcctId:29785,storeAcct:'lazada3894-泰国',salesSite:'TH',unreadCount:3},{storeAcctId:29786,storeAcct:'lazada3894-新加坡',salesSite:'SG',unreadCount:9},{storeAcctId:29787,storeAcct:'lazada3894-印尼',salesSite:'ID',unreadCount:0},{storeAcctId:29788,storeAcct:'lazada3894-越南',salesSite:'VN',unreadCount:0}],storeInfo:{storeAcctId:25419,storeAcct:'来赞达SX27马来',unreadCount:13,email:'lazadasx27@epean.com.cn'}};
        // 判断推送消息的会话组是否是当前打开组
        if (this.state.currentStoreId !== data.storeInfo.email) {
          //  判断当前店铺组是否已存在，存在直接unshift，不存在新增一条数据
          this.addStoreData(data);
          return false;
        }
        // 判断推送消息的站点是否是当前打开的站点
        if (this.state.currentSalesSite !== data.session.siteId) {
          // 店铺组+1
          this.addStoreData(data);
          // 站点+1
          this.addSalesSiteData(data);
          return false;
        }
        // 判断推送消息的会话是否是当前打开的会话
        if (this.state.currentSession !== data.session.sessionId) {
          this.addStoreData(data);
          this.addSalesSiteData(data);
          return false;
        }
        let messageList = this.state.message.messageList;
        messageList.push(data.message);
        // 当前打开会话即推送消息，直接显示，已读
        this.state.message = {
          name: this.state.message.name,
          headUrl: this.state.message.headUrl,
          sessionId: this.state.message.sessionId,
          storeAcctId: this.state.message.storeAcctId,
          storeAcct: this.state.message.storeAcct,
          messageList: messageList,
          buyerId: this.state.message.buyerId,
          mark: this.state.message.mark,
          followFlag: this.state.message.followFlag
        };
        // this.$store.commit('SETMESSAGE', {
        //   name: this.state.message.name,
        //   headUrl: this.state.message.headUrl,
        //   sessionId: this.state.message.sessionId,
        //   storeAcctId: this.state.message.storeAcctId,
        //   storeAcct: this.state.message.storeAcct,
        //   messageList: messageList,
        //   buyerId: this.state.message.buyerId,
        //   mark: this.state.message.mark,
        //   followFlag: this.state.message.followFlag
        // });
        // 当前的所有会话信息的这一条也需要更新
        this.state.showSessionListData.forEach((item) => {
          if (item.sessionId === data.session.sessionId) {
            // 这里应该是直接替换的！！
            // item.summary = data.session.summary
            item.fromAccountType = data.message.fromAccountType;
          }
        });
        // this.$store.commit('showSessionListData', showSessionListData);
      },
      // 数组去重
      unique(arr1) {
        const res = new Map();
        return arr1.filter(
          (item) => !res.has(item.email) && res.set(item.email, 1)
        );
      },
      // 判断当前店铺组是否存在，存在未读数+1，不存在新增一条数据
      addStoreData(data) {
        console.log('addStoreData');
        // 先判断是否选择客服专员，
        // 如果选择再判断，推送消息的店铺组，是否是当前客服专员下面的店铺组
        // 如果没选择再判断，全推
        if (this.state.showStoreAcctListClick.length !== 0) {
          // 说明已经选择客服专员
          // 当前客服专员下面的所有店铺，根据email去重
          let uniqueEmail = this.unique(this.state.showStoreAcctListClick);
          // 判断推送的消息是否是当前客服专员下面的店铺，根据去重后的email匹配
          let filteruniqueEmail = uniqueEmail.filter(
            (item) => item.email === data.storeInfo.email
          );
          // 如果存在，则显示消息，不存在，丢弃
          if (filteruniqueEmail.length === 0) {
            return false;
          }
          // 说明是当前客服专员下面的店铺，推送
          // 再判断当前是否显示店铺栏，如果显示，判断是否有当前推送的这个店铺，如果有，删掉推送的这个店铺信息，把当前推送的这个店铺置顶
          let isStoreInfo = this.state.showStoreAcctListData.filter(
            (item, index) => {
              // 如果存在，直接替换未读消息数
              if (data.storeInfo.email === item.email) {
                this.state.showStoreAcctListData[index].unreadCount =
                  data.storeInfo.unreadCount;
                // 更新store
                // this.$store.commit(
                //   'showStoreAcctListData',
                //   this.state.showStoreAcctListData
                // );
              }
              // 返回存在的数据
              return data.storeInfo.email === item.email;
            }
          );
          // 如果不存在，新增一条数据
          if (isStoreInfo.length === 0) {
            this.state.showStoreAcctListData =
              this.state.showStoreAcctListData.unshift(data.storeInfo);
            // this.$store.commit(
            //   'showStoreAcctListData',
            //   this.state.showStoreAcctListData
            // );
          }
        } else if (
          this.state.showStoreAcctListClick.length === 0 &&
          this.customerListValue !== ''
        ) {
          // 选中客服专员，但是客服专员下面没有店铺
          return false;
        } else {
          // 没有选中客服专员
          // 存在已有数据，推到最前面
          // 过滤，过滤掉已存在的那条数据，然后把新推送的数据放到顶部
          // this.state.showStoreAcctListData =
          //   this.state.showStoreAcctListData.filter(
          //     (item) => item.email !== data.storeInfo.email
          //   )
          // this.state.showStoreAcctListData.unshift(data.storeInfo)
          // this.$store.commit(
          //   'showStoreAcctListData',
          //   this.state.showStoreAcctListData
          // )
          // 20230320修改 [3988 lazada进入chat页面取消默认展示当前登陆人授权店铺]，没有点击查询，就不显示数据
          return false;
        }
      },
      addSalesSiteData(data) {
        this.state.showsalesSiteListData = data.salesSiteUnreadCount;
        // this.$store.commit('showsalesSiteListData', data.salesSiteUnreadCount);
      }
    }
  });
</script>

<style scoped lang="scss">
  @import url('@/components/lazada/css/common.css');

  .infinite-list-wrapper {
    height: 80%;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;

    .main {
      display: flex;
      position: absolute;
      top: 0px;
      bottom: 0px;
      overflow: hidden;
      background: #fff;

      aside {
        flex: 0 0 230px;
        width: 230px;

        .el-menu {
          height: 100%;
          // overflow: scroll;
        }
      }

      .aside_header {
        height: 80px;
        background-color: #d9001b;
        color: #fff;
        font-size: 20px;
        justify-content: center;
        // text-align: center;
        line-height: 80px;
      }

      .menu-expanded {
        flex: 0 0 300px;
        width: 330px;
      }

      .menu-expanded-right {
        flex: 0 0 470px;
        width: 500px;
      }

      .content-container {
        flex: 1;
      }
    }
  }
</style>
