import request from '@/utils/request';

/**
 * 平台销售/客服/站点联动查询店铺
 * @param {Object} dat
 */
export function getStoresTreeApi(data) {
  return request({
    method: 'POST',
    url: `/lms/salesplat/listStoreTreeByPlatCodeAndSalespersonsAndCustomers`,
    data
  });
}

/**
 * 关键词查询类型枚举
 * @param {Object} dat
 */
export const getKeywordTypeApi = () =>
  request({
    url: '/chat/tiktok/conversation/listKeywordQueryTypeEnum'
  });

/**
 * 更新会话状态
 * conversationId,storeAcctId,conversationStatus
 */
export function updateConversationStatusApi(data) {
  return request({
    method: 'POST',
    url: '/chat/tiktok/conversation/updateConversationStatus',
    loading: false,
    data
  });
}

/**
 * 批量更新会话状态
 */
export function batchUpdateConversationStatusApi(data) {
  return request({
    method: 'POST',
    url: '/chat/tiktok/conversation/batchUpdateConversationStatus',
    loading: false,
    data
  });
}

/**
 * 查询该店铺的商品
 */
export function listProductApi(data) {
  return request({
    method: 'POST',
    url: `/chat/shopee/conversation/listItems`,
    loading: false,
    data
  });
}
/**
 * 查询该店铺的订单
 *
 */
export function listTkOrdersApi(data) {
  return request({
    method: 'POST',
    url: '/chat/tiktok/conversation/listOrders',
    loading: false,
    data
  });
}

/**
 * 查询该店铺的商品
 *
 */
export function listTkProductsApi(data) {
  return request({
    method: 'POST',
    url: '/chat/tiktok/conversation/listProducts',
    loading: false,
    data
  });
}

/**
 * tk枚举项
 */
export function handleTkInitEnumApi() {
  return request({
    url: '/chat/tiktok/conversation/init',
    loading: false
  });
}

/**
 * tk聊天 右侧订单列表 搜索项映射
 */
export function tiktokOrderStatusApi() {
  return request({
    url: '/chat/tiktok/conversation/tiktokOrderStatus',
    loading: false
  });
}

/**
 * tk聊天 订单tab点击查看物流状态
 */
export function getTkLogisticsStatus(data) {
  return request({
    url: `/lms/tiktok/logistics/getLogisticsStatus?storeAcctId=${data.storeAcctId}&platOrderId=${data.platOrderId}`,
    loading: false,
    data
  });
}

/**
 *  点击单项获取会话消息
 */
export function getMsgContentById(data) {
  return request({
    method: 'POST',
    url: '/chat/tiktok/msg/listQueryMsg',
    loading: false,
    params: data
  });
}

/**
 * 根据会话id删除会话
 * storeAcctId,conversationId
 */
export function deleteConversationItem(storeAcctId, conversationId) {
  return request({
    method: 'delete',
    url: `/chat/tiktok/conversation/deleteConversation/${storeAcctId}`,
    loading: true,
    data: conversationId
  });
}

/**
 *  根据平台获取模板类型
 */
export function getlistTemplateType(data) {
  return request({
    method: 'POST',
    url: '/chat/lazadaMessage/listTemplateType',
    loading: true,
    params: data
  });
}

// /**
//  * 根据站点初始化语言
//  * @param {Object} obj 传入
//  */
// export function getLanguage(obj) {
//   return request({
//     method: 'GET',
//     url: `/chat/lazadaMessage/getLanguage?salesSite=${obj.salesSite}`
//   });
// }

// /**
//  * 查询模板名称
//  * @param {Object} obj 传入
//  */
// export function listTemplateName(obj) {
//   return request({
//     method: 'POST',
//     url: '/chat/lazadaMessage/listTemplateName',
//     data: obj
//   });
// }

// /**
//  * 获取模板内容
//  * @param {Object} obj 传入
//  */
// export function getEmailContent(obj) {
//   return request({
//     method: 'POST',
//     url: '/chat/lazadaMessage/getEmailContent',
//     params: obj
//   });
// }

/**
 * 星标收藏和取消 当前用户聊天
 * @param {data} conversationId,storeAcctId
 */
export function setConversationPinned(data) {
  return request({
    method: 'post',
    url: '/chat/tiktok/conversation/setConversationPinned',
    params: data
  });
}

/**
 * 读取会话
 * conversationId,storeAcctId
 */
export function readConversationItemApi(data) {
  return request({
    method: 'post',
    url: `/chat/tiktok/conversation/readConversation?convShortId=${data.convShortId}&storeAcctId=${data.storeAcctId}`
  });
}

/**
 * 创建新会话
 * conversationId,storeAcctId
 */
export function createANewConversationApi(data) {
  return request({
    method: 'post',
    url: `/chat/tiktok/conversation/createANewConversation?storeAcctId=${data.storeAcctId}&buyerId=${data.buyerId}`
  });
}

// 售后发送消息
export function batchSendMessage(data) {
  return request({
    url: '/chat/tiktok/msg/batchSendMsg',
    data,
    needWrongMsg: true,
    method: 'post',
    loading: true
  });
}

/**
 *  根据站点获取语言
 */
export function getLanguageBySiteApi(data) {
  return request({
    method: 'POST',
    url: '/chat/tiktok/msg/customizeValues',
    loading: true,
    params: data
  });
}

/**
 *  点击翻译按钮
 */
export function getTranslateFromBaiduOrGoogleApi(data) {
  return request({
    method: 'POST',
    url: '/chat/tiktok/msg/getTranslateFromBaiduOrGoogle',
    loading: false,
    data
  });
}
