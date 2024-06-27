<template>
  <el-tabs
    v-model="activeSaleSite"
    class="asideLeftMenuTab"
    @tab-click="handleClick"
  >
    <el-tab-pane v-for="saleItem in salesSite" :key="saleItem" :name="saleItem">
      <!-- 查询框 -->
      <el-row class="sessionSearch">
        <el-form :inline="true" @submit.prevent>
          <el-col :span="15" style="margin-bottom: 10px">
            <el-input
              v-model="searchInput"
              placeholder="请输入内容"
              :prefix-icon="Search"
              @keyup.enter="searchInputFunc"
            >
            </el-input>
          </el-col>
          <el-col :span="9" style="padding: 5px 0 0 5px">
            <el-checkbox v-model="searchChecked" @change="searchCheckedAndMark"
              >只看未回复</el-checkbox
            >
            <el-checkbox v-model="searchMark" @change="searchCheckedAndMark"
              >只看标星</el-checkbox
            >
          </el-col>
        </el-form>
      </el-row>
      <template #label>
        <span v-if="saleSiteCount != null">
          <el-badge
            :value="
              saleSiteCount[saleItem].unreadCount <= 0
                ? ''
                : saleSiteCount[saleItem].unreadCount
            "
            :max="99"
            class="item"
            >{{ saleItem }}</el-badge
          >
        </span>
      </template>
      <div
        class="infinite-list-wrapper"
        style="overflow-y: auto; overflow-x: hidden"
        :style="{ height: divHeight + 'px' }"
      >
        <ul
          v-infinite-scroll="load"
          class="list"
          infinite-scroll-disabled="disabled"
        >
          <el-row
            v-for="(item, index) in showSessionList"
            :key="index"
            :style="[
              enterVal == index ? active : '',
              clickIndex == index ? clickActive : ''
            ]"
            style="padding: 10px 5px; height: 90px; overflow: hidden"
          >
            <div
              :index="item.id"
              @mouseenter="mouseEnter(index)"
              @mouseleave="mouseLeave"
              @click="toChat(item, index)"
            >
              <el-col :span="5">
                <img :src="item.headUrl" width="50" />
              </el-col>
              <el-col :span="15">
                <el-row>
                  <el-col
                    :span="20"
                    style="font-weight: bold; height: 17px; overflow: hidden"
                    >{{ item.title }}</el-col
                  >
                  <el-col :span="4" style="text-align: right">
                    <el-badge
                      :value="item.unreadCount <= 0 ? '' : item.unreadCount"
                      :max="99"
                    ></el-badge>
                  </el-col>
                </el-row>
                <el-row style="">
                  <div
                    style="
                      color: #bbb;
                      height: 36px;
                      overflow: hidden;
                      width: 250px;
                    "
                  >
                    {{ item.summary }}
                  </div>
                  <span v-if="item.tags">
                    <el-tag type="danger" size="small">{{ item.tags }}</el-tag>
                  </span>
                  <el-tag
                    v-if="item.fromAccountType == 1 && item.unreadCount == 0"
                    type="warning"
                    size="small"
                    >已读未回复</el-tag
                  >
                </el-row>
              </el-col>
              <el-col :span="4" style="text-align: right">
                <el-row v-if="item.lastMessageTime">{{
                  currentTime ==
                  util.formatDate.format(
                    new Date(item.lastMessageTime),
                    'MM-dd'
                  )
                    ? util.formatDate.format(
                        new Date(item.lastMessageTime),
                        'hh:mm'
                      )
                    : util.formatDate.format(
                        new Date(item.lastMessageTime),
                        'MM-dd'
                      )
                }}</el-row>
                <el-row v-if="item.mark">
                  <img
                    src="@/components/lazada/images/wujiaoxing-huang.png"
                    width="20"
                  />
                </el-row>
              </el-col>
            </div>
          </el-row>
        </ul>
        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import { defineComponent, computed } from 'vue';
  import { isEmpty } from 'lodash-es';
  import { getItem, removeItem } from '@/utils/storage';
  import lazadaChat from '@/store/lazadaChat/store';
  import { Search } from '@element-plus/icons-vue';

  import {
    getCurrentStoreSessionList,
    searchSessionByBuyerNameAndStoreId,
    readSession,
    queryIsFans,
    listQueryMessage
  } from '@/api/lazada/index';

  // import VirtualList from '@/components/lazada/VirtualList.vue';

  export default defineComponent({
    // components: {
    //   VirtualList: VirtualList
    // },
    props: {
      asideLeftMenu: {
        type: Object,
        default: () => {}
      }
    },
    setup() {
      const { state } = lazadaChat(); // 引入 useStore 类似 vue2 的 this.state

      const stateMessage = computed(() => {
        // 使用计算属性来监听数据的变化
        return state.message;
      });
      return {
        // 返回出去供 template 模板访问
        Search,
        state,
        stateMessage
      };
    },
    data() {
      return {
        unanswered: -1, // 已读未回复标签
        searchChecked: false, // 只看未回复
        searchMark: false, // 只看标星
        searchInput: '', // 搜索框
        activeSaleSite: 'MY', // 选中的站点
        activeStoreName: '', // 选中的店铺名
        currentStoreAcctId: -1, // 店铺id
        showSessionList: [], // 显示的回话列表
        allSessionList: [], // 所有的回话列表
        active: {}, // 选中会话列表的样式
        enterVal: '', // 鼠标移入
        clickActive: {}, // 选中的会话列表
        clickIndex: '', // 选中的会话列表的索引
        loading: false, // 懒加载loading
        curPage: 1, // 懒加载当前页
        divHeight: 0,
        saleSiteCount: null,
        salesSite: ['MY', 'SG', 'VN', 'TH', 'PH', 'ID'] // 当前站点
      };
    },
    computed: {
      noMore() {
        return this.showSessionList.length >= this.allSessionList.length;
      },
      disabled() {
        return this.loading || this.noMore;
      },
      currentTime() {
        return this.util.formatDate.format(new Date(), 'MM-dd');
      }
    },
    watch: {
      'state.showsalesSiteListData': function (val) {
        if (val.length !== 0) {
          // 获取当前站点下面的会话列表
          // val: 当前店铺下面所有站点的未读数
          this.handleSessionListData(val);
        }
      },
      'state.showSessionListData': function (val) {
        this.showSessionList = val.slice(0, 30);
      },
      'state.divHeight': function (val) {
        this.divHeight = val;
      },
      // 已读未回复
      'state.unanswered': function (val) {
        this.unanswered = val;
      }
    },
    mounted() {
      this.showSessionList = this.allSessionList.slice(0, 30);
    },
    activated: function () {
      let detail = getItem('lazadacustomerlazadachat');
      this.$nextTick(() => {
        setTimeout(async () => {
          if (!isEmpty(detail)) {
            console.log(detail);
            this.activeSaleSite = detail.siteId;
            this.state.currentSalesSite = detail.siteId;
            this.state.currentStoreAcctId = detail.storeAcctId;
            this.saleSiteCount[this.activeSaleSite].storeAcctId =
              detail.storeAcctId;
            this.activeStoreName = detail.storeAcct;
            searchSessionByBuyerNameAndStoreId(
              '' + detail.buyerNameFirst + detail.buyerNameLast,
              detail.storeAcctId,
              detail.orderId,
              detail.buyerId
            ).then((res) => {
              // this.searchInput =
              //   '' + detail.buyerNameFirst + detail.buyerNameLast;
              if (res.code === '0000') {
                this.allSessionList = res.data;
                // 当前站點所有會話
                this.state.showSessionListData = res.data;
                this.showSessionList = this.allSessionList.slice(0, 30);
                this.searchCheckedAndMark();
              } else {
                this.$message.error(res.msg);
              }
            });
            await removeItem('lazadacustomerlazadachat');
          }
        }, 2000);
      });
    },
    methods: {
      // 回车搜索
      searchInputFunc() {
        // 如果没有选择店铺组
        if (this.saleSiteCount[this.activeSaleSite].storeAcctId === -1) {
          this.$message.error('请选择店铺');
          return false;
        }
        searchSessionByBuyerNameAndStoreId(
          this.searchInput,
          this.saleSiteCount[this.activeSaleSite].storeAcctId,
          '',
          ''
        ).then((res) => {
          if (res.code === '0000') {
            this.allSessionList = res.data;
            // 当前站點所有會話
            this.state.showSessionListData = res.data;
            this.showSessionList = this.allSessionList.slice(0, 30);
            this.searchCheckedAndMark();
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      // 标星&未回复
      searchCheckedAndMark() {
        if (this.searchMark && !this.searchChecked) {
          // 只看标星
          this.allSessionList = this.state.showSessionListData.filter(
            (item) => item.mark
          );
        } else if (this.searchChecked && !this.searchMark) {
          // 只看未回复
          this.allSessionList = this.state.showSessionListData.filter(
            (item) => item.fromAccountType !== 2
          );
        } else if (this.searchChecked && this.searchMark) {
          // 标星&未回复
          this.allSessionList = this.state.showSessionListData.filter(
            (item) => item.fromAccountType !== 2 && item.mark
          );
        } else {
          this.allSessionList = this.state.showSessionListData;
        }
        this.showSessionList = this.allSessionList.slice(0, 30);
      },
      // 获取当前站点下面的会话列表
      handleSessionListData(SessionListArr) {
        // 获取对话框menu可视区域高度
        window.screenHeight = document.body.clientHeight;
        this.divHeight = window.screenHeight - 150;
        // 只看未回复设置为不选中
        this.searchChecked = false;
        // 只看标星为不选中
        this.searchMark = false;
        // 查询输入框清空
        this.searchInput = '';
        this.saleSiteCount = {
          // 每个站点消息未读数
          MY: { storeAcctId: -1, unreadCount: 0 },
          SG: { storeAcctId: -1, unreadCount: 0 },
          VN: { storeAcctId: -1, unreadCount: 0 },
          TH: { storeAcctId: -1, unreadCount: 0 },
          PH: { storeAcctId: -1, unreadCount: 0 },
          ID: { storeAcctId: -1, unreadCount: 0 }
        };
        // 匹配当前站点，以及当前站点的未读消息数
        SessionListArr.forEach((item) => {
          // 循环匹配未读消息数
          this.saleSiteCount[item.salesSite].unreadCount = item.unreadCount;
          if (item.salesSite === this.activeSaleSite) {
            // 获取当前店铺id
            this.saleSiteCount[item.salesSite].storeAcctId = item.storeAcctId;
            this.activeStoreName = item.storeAcct;
          }
        });
        // 存入当前站点的未读消息数
        this.state.salesUnreadSiteCount =
          this.saleSiteCount[this.activeSaleSite].unreadCount;
        // 当前站点
        this.state.currentSalesSite = this.activeSaleSite;
        // 当前店铺id
        this.state.currentStoreAcctId =
          this.saleSiteCount[this.activeSaleSite].storeAcctId;
        // 根据店铺id，当前店铺组下面的会话，默认my站点
        getCurrentStoreSessionList(
          this.saleSiteCount[this.activeSaleSite].storeAcctId
        ).then((res) => {
          if (res.code === '0000') {
            // 清空当前点击的样式
            this.clickIndex = '';
            this.clickActive = null;
            // 赋值
            this.allSessionList = res.data;
            // 当前站點所有會話
            // console.log(res.data);
            this.state.showSessionListData = res.data;
            this.showSessionList = this.allSessionList.slice(0, 30);
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      // 监听tab切换
      handleClick(obj) {
        this.activeSaleSite = obj.paneName;
        // 获取当前站点下面的会话列表
        this.handleSessionListData(this.state.showsalesSiteListData);
      },
      // 点击聊天对话框，传入买家名字和店铺
      toChat(obj, index) {
        this.state.unanswered = index;
        this.saleSiteCount[this.activeSaleSite].unreadCount =
          this.state.salesUnreadSiteCount - obj.unreadCount;
        this.state.salesUnreadSiteCount =
          this.saleSiteCount[this.activeSaleSite].unreadCount;
        this.state.showsalesSiteListData.forEach((item) => {
          if (item.salesSite === this.activeSaleSite) {
            item.unreadCount =
              this.saleSiteCount[this.activeSaleSite].unreadCount;
          }
        });
        // 存入当前会话的未读消息数
        this.state.sessionUnreadCount = obj.unreadCount;

        obj.unreadCount = 0;
        let _this = this;
        _this.clickIndex = index;
        _this.clickActive = {
          'background-color': '#ecf5ff'
        };
        Promise.all([
          listQueryMessage(obj.sessionId),
          queryIsFans({
            buyerIds: obj.buyerId,
            // storeAcctId: this.saleSiteCount[obj.siteId].storeAcctId,
            storeAcctId: this.state.currentStoreAcctId,
            salesSite: obj.siteId
          })
        ])
          .then((res) => {
            _this.state.message = {
              name: obj.title,
              headUrl: obj.headUrl,
              sessionId: obj.sessionId,
              // storeAcctId: this.saleSiteCount[this.activeSaleSite].storeAcctId,
              storeAcctId: this.state.currentStoreAcctId,
              storeAcct: this.activeStoreName,
              messageList: res[0].data,
              buyerId: obj.buyerId,
              mark: obj.mark,
              followFlag: JSON.parse(res[1].data[0]).followFlag
            };

            // 当前sessionId
            this.state.currentSession = obj.sessionId;
          })
          .catch();
        // 消息已读
        readSession({
          sessionId: obj.sessionId, // 会话Id
          lastReadMessageId: obj.lastMessageId, // 最后一条消息Id
          storeAcctId: this.saleSiteCount[this.activeSaleSite].storeAcctId, // 店铺Id
          salesSite: this.activeSaleSite // 站点
        }).then((res) => {
          if (res.code !== '0000') {
            this.$message.error(res.msg);
          }
        });
      },
      // 鼠标移入
      mouseEnter(index) {
        this.enterVal = index;
        this.active = {
          'background-color': '#ecf5ff',
          cursor: 'pointer'
        };
      },
      // 鼠标移出
      mouseLeave() {
        this.enterVal = '';
        this.active = '';
      },
      // 懒加载
      load() {
        this.loading = true;
        setTimeout(() => {
          this.curPage += 1;
          this.showSessionList = this.allSessionList.slice(
            0,
            30 + 10 * this.curPage
          );
          this.loading = false;
        }, 100);
      }
    }
  });
</script>
<style scoped lang="scss">
  @import url('@/components/lazada/css/common.css');
  :deep(.el-input__inner:focus) {
    border-color: #c0c4cc;
  }
  .infinite-list-wrapper {
    height: 80%;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  :deep(.el-tabs__item) {
    padding: 0 17px;
  }
  :deep(.el-tabs__nav) {
    height: 80px;
    line-height: 80px;
  }
  :deep(.el-tabs__item) {
    text-align: center;
  }
  :deep(.el-input--small .el-input__inner) {
    height: 56px;
  }
  .item {
    height: 10px;
  }
  :deep(.el-tabs__nav-scroll) {
    display: flex;
    justify-content: center;
  }
  :deep(.el-badge__content.is-fixed) {
    top: 20px;
  }
</style>
