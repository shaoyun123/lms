// import Vue from 'vue';
// import Vuex from 'vuex';
// import mutations from './mutations';
// import shopeechat from './modules/shopeechat';
// import actions from './actions';

// Vue.use(Vuex);

// // 应用初始状态
// const state = {
//   message: {}, // 会话列表信息，比如会话session，买家头像，买家姓名等
//   order: {}, // 订单
//   commodity: {}, // 商品
//   voucher: {}, // 优惠券
//   // 当前消息未读数（storeCount店铺未读数，salesSiteCount站点未读数，sessionCount会话未读数）
//   storeUnreadCount: 0,
//   salesUnreadSiteCount: 0,
//   sessionUnreadCount: 0,
//   // 当前店铺id
//   currentStoreAcctId: -1,
//   // 所有店铺的信息，包括未读消息数
//   showStoreAcctListData: [],
//   // 所有站点的信息，包括未读消息数
//   showsalesSiteListData: [],
//   // 所有会话的数据，包括未读消息数
//   showSessionListData: [],
//   // 当前会话的所有message
//   // currSessionListData: {},
//   // 当前店铺组唯一标识
//   currentStoreId: null,
//   // 当前站点
//   currentSalesSite: null,
//   // 当前会话session
//   currentSession: null,
//   // 当前窗口的高度
//   divHeight: 0,
//   // 已读未回复
//   unanswered: 0,
//   // 点击查询的数据
//   showStoreAcctListClick: []
// };

// // 创建 store 实例
// export default new Vuex.Store({
//   actions,
//   state,
//   mutations,
//   modules: {
//     shopeechat
//   }
// });

import { defineStore } from 'pinia';
import { ref } from 'vue';

const lazadaChat = defineStore('lazadaChat', () => {
  let state = ref({
    message: {}, // 会话列表信息，比如会话session，买家头像，买家姓名等
    order: {}, // 订单
    commodity: {}, // 商品
    voucher: {}, // 优惠券
    // 当前消息未读数（storeCount店铺未读数，salesSiteCount站点未读数，sessionCount会话未读数）
    storeUnreadCount: 0,
    salesUnreadSiteCount: 0,
    sessionUnreadCount: 0,
    // 当前店铺id
    currentStoreAcctId: -1,
    // 所有店铺的信息，包括未读消息数
    showStoreAcctListData: [],
    // 所有站点的信息，包括未读消息数
    showsalesSiteListData: [],
    // 所有会话的数据，包括未读消息数
    showSessionListData: [],
    // 当前会话的所有message
    // currSessionListData: {},
    // 当前店铺组唯一标识
    currentStoreId: null,
    // 当前站点
    currentSalesSite: null,
    // 当前会话session
    currentSession: null,
    // 当前窗口的高度
    divHeight: 0,
    // 已读未回复
    unanswered: 0,
    // 点击查询的数据
    showStoreAcctListClick: []
  });

  return { state };
});

export default lazadaChat;
