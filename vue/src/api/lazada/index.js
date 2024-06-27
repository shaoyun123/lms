import request from '@/utils/request';

/**
 * 获取lazada客服专业 列表
 * @param {Object} data 传入 {"roleList":["lazada客服专员"]}
 */
export function getAllLazadaCustomers(data) {
  return request({
    method: 'post',
    loading: true,
    url: '/chat/getAllLazadaCustomers',
    data: data
  });
}

/**
 * 获取当前客服拥有的店铺（考虑当前登录人被授权的店铺）
 * @param {Number} customerId 传入 客服id（可不传，不传则查询所有客服和当前登录人的店铺交集）
 */
export function getSalesAcctListByCustomer(customerId) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/getSalesAcctListByCustomer?customerId=${customerId}`
  });
}

/**
 * 同组店铺所有未读数
 * @param {}
 */
export function getSameGroupStoreAllUnReadCount(data) {
  return request({
    method: 'POST',
    loading: true,
    url: '/chat/getSameGroupStoreAllUnReadCount',
    data: data
  });
}

/**
 * 当前店铺和其他同组店铺各自的未读数
 * @param storeAcctId
 * @returns {*|AxiosPromise}
 */
export function getSameGroupStoreDetailUnReadCount(storeAcctId) {
  return request({
    method: 'POST',
    loading: true,
    url: `/chat/getSameGroupStoreDetailUnReadCount?storeAcctId=${storeAcctId}`
  });
}

/**
 * 当前店铺会话列表
 * @param {Number} storeAcctId 传入 店铺Id , 必传
 */
export function getCurrentStoreSessionList(storeAcctId) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/getCurrentStoreSessionList?storeAcctId=${storeAcctId}`
  });
}

/**
 * Search栏搜索买家信息
 * @param {String} buyerName 传入 买家用户名
 * @param {Number} storeAcctId 传入 店铺id
 */
export function searchSessionByBuyerNameAndStoreId(
  buyerName,
  storeAcctId,
  orderId,
  buyerId
) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/searchSessionByBuyerNameAndStoreId?buyerName=${buyerName}&storeAcctId=${storeAcctId}&orderId=${orderId}&buyerId=${buyerId}`
  });
}

/**
 * 查询消息
 * @param {String} sessionId 传入 sessionId
 */
export function listQueryMessage(sessionId) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/lazadaMessage/listQueryMessage?sessionId=${sessionId}`
  });
}

/**
 * 发送消息
 * @param {Object} obj 传入
 */
export function sendMessage(obj) {
  return request({
    method: 'POST',
    loading: true,
    url: `/chat/lazadaMessage/sendMessage`,
    data: obj
  });
}

/**
 * 撤回消息
 * @param {Object} obj 传入
 */
export function recallMessage(obj) {
  return request({
    method: 'POST',
    loading: true,
    url: `/chat/lazadaMessage/recallMessage`,
    data: obj
  });
}

/**
 * 查询商品
 * @param {Object} obj 传入
 */
export function listProduct(obj) {
  return request({
    method: 'POST',
    loading: true,
    url: `/chat/lazadaMessage/listProduct`,
    data: obj
  });
}

/**
 * 查询订单
 * @param {Object} obj 传入
 */
export function tradeInfo(obj) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/lazadaMessage/tradeInfo?buyerId=${obj.buyerId}&storeAcctId=${obj.storeAcctId}&size=${obj.size}`
  });
}

/**
 * 查询优惠券
 * @param {Object} obj 传入
 */
export function listVoucherForChat(obj) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/lazadaMessage/listVoucherForChat?voucherStatus=${obj.voucherStatus}&storeAcctId=${obj.storeAcctId}`
  });
}

/**
 * 图片上传服务器
 * @param {Object} obj 传入imageFile
 */
export function getImgPath(obj) {
  return request({
    method: 'POST',
    loading: true,
    url: `/chat/lazadaMessage/getImgPath`,
    data: obj
  });
}

/**
 * 消息已读
 * @param {Object} obj 传入
 */
export function readSession(obj) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/readSession?sessionId=${obj.sessionId}&lastReadMessageId=${obj.lastReadMessageId}&storeAcctId=${obj.storeAcctId}&salesSite=${obj.salesSite}`
  });
}

/**
 * 物流接口
 * @param {Object} obj 传入
 */
export function listOrderTrace(obj) {
  return request({
    method: 'POST',
    // loading: true,
    url: `/chat/lazadaMessage/listOrderTrace?orderId=${obj.orderId}&storeAcctId=${obj.storeAcctId}&salesSite=${obj.salesSite}`
  });
}

/**
 * 获取买家是否是店铺粉丝状态
 * @param {Object} obj 传入
 */
export function queryIsFans(obj) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/queryIsFans?buyerIds=${obj.buyerIds}&storeAcctId=${obj.storeAcctId}&salesSite=${obj.salesSite}`
  });
}

/**
 * 更改标记
 * @param {Object} obj 传入
 */
export function updateMark(obj) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/updateMark?sessionId=${obj.sessionId}&mark=${obj.mark}`
  });
}

// /**
//  * 普源订单状态枚举
//  * @param {Object} obj 传入
//  */
//  export function allRootOrderProcessEnum (code) {
//     return request({
//         method: 'GET',
//         url: `/chat/allRootOrderProcessEnum?code=${code}`
//     })
// }

/**
 * 根据站点初始化语言
 * @param {Object} obj 传入
 */
export function getLanguage(obj) {
  return request({
    method: 'GET',
    loading: true,
    url: `/chat/lazadaMessage/getLanguage?salesSite=${obj.salesSite}`
  });
}

/**
 * 查询模板类型
 * @param {Object} obj 传入
 */
export function listTemplateType(obj) {
  return request({
    method: 'POST',
    loading: true,
    url: `/chat/lazadaMessage/listTemplateType?platCode=${obj.platCode}`
  });
}
/**
 * 查询模板名称
 * @param {Object} obj 传入
 */
export function listTemplateName(obj) {
  return request({
    method: 'POST',
    loading: true,
    url: `/chat/lazadaMessage/listTemplateName`,
    data: obj
  });
}
/**
 * 根据站点初始化语言
 * @param {Object} obj 传入
 */
export function getEmailContent(obj) {
  return request({
    method: 'POST',
    loading: true,
    url: `/chat/lazadaMessage/getEmailContent?id=${obj.id}`
  });
}

/**
 * 翻译
 */
export function lazadaTransactionContent(obj) {
  return request({
    method: 'GET',
    loading: true,
    url: `/lms/ChatGPT35/lazadaTransactionContent?salesSite=${obj.salesSite}&content=${obj.content}`
  });
}
