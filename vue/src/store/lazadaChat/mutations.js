export default {
  SETMESSAGE(state, message) {
    state.message = message;
  },
  // // 发送订单信息
  // SETORDERITEM (state, order) {
  //     state.order = order
  // },
  // // 发送商品信息
  // SETCOMMODITYITEM (state, commodity) {
  //     state.commodity = commodity
  // },
  // // 发送优惠券信息
  // SETVOUCHERITEM (state, voucher) {
  //     state.voucher = voucher
  // },
  // 未读数
  SETSTOREUNREADCOUNT(state, storeUnreadCount) {
    state.storeUnreadCount = storeUnreadCount;
  },
  SETSALESUNREADSITECOUNT(state, salesUnreadSiteCount) {
    state.salesUnreadSiteCount = salesUnreadSiteCount;
  },
  SETSESSIONUNREADCOUNT(state, sessionUnreadCount) {
    state.sessionUnreadCount = sessionUnreadCount;
  },
  // obj
  showStoreAcctListData(state, showStoreAcctListData) {
    state.showStoreAcctListData = showStoreAcctListData;
  },
  showsalesSiteListData(state, showsalesSiteListData) {
    state.showsalesSiteListData = showsalesSiteListData;
  },
  showSessionListData(state, showSessionListData) {
    state.showSessionListData = showSessionListData;
  },
  // obj
  currentStoreId(state, currentStoreId) {
    state.currentStoreId = currentStoreId;
  },
  currentSalesSite(state, currentSalesSite) {
    state.currentSalesSite = currentSalesSite;
  },
  currentSession(state, currentSession) {
    state.currentSession = currentSession;
  },
  currentStoreAcctId(state, currentStoreAcctId) {
    state.currentStoreAcctId = currentStoreAcctId;
  },
  divHeight(state, divHeight) {
    state.divHeight = divHeight;
  },
  unanswered(state, unanswered) {
    state.unanswered = unanswered;
  },
  showStoreAcctListClick(state, showStoreAcctListClick) {
    state.showStoreAcctListClick = showStoreAcctListClick;
  }
};
