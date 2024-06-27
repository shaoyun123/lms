import qs from 'qs';
import request from '@/utils/request';

/**
 * 获取客服专业 列表
 * @param {Object} data 传入 {"roleNames":"shopee专员"}
 */
export function getCustomersApi(data) {
  return request({
    method: 'post',
    url: '/lms/sys/getPersonAndOrgsByRole.html',
    data: qs.stringify(data)
  });
}

/**
 * 销售/客服/站点联动查询当前用户权限店铺
 * @param {Object} dat
 */
export function getStoresApi(data) {
  return request({
    method: 'POST',
    url: `/lms/shopee/shop/listStore4ChatBySalespersonsAndCustomers`,
    data
  });
}

/**
 * 关键词查询类型枚举
 * @param {Object} dat
 */
export const getKeywordTypeApi = () =>
  request({
    url: `/chat/shopee/conversation/listKeywordQueryTypeEnum`
  });

/**
 * 获取议价未处理的条数
 */
export function getOfferCountApi() {
  return request({
    url: `/chat/shopee/conversation/getOfferCount`,
    loading: false
  });
}

/**
 * 获取站点
 */
export function getSiteListApi() {
  return request({
    method: 'POST',
    url: `/lms/shopee/onlineProductShopee/getShopeeOnlineEnum.html`
  });
}

/**
 * 获取店铺消息列表
 *  @param {data} region,salespersonIds,storeAcctIdList 传入 店铺Id , 必传
 */
export function getStoreChatListApi(data) {
  return request({
    method: 'post',
    url: `/chat/shopee/conversation/listShopConversationSummary`,
    data
  });
}

/**
 * 查询店铺实时的未读数量
 *  @param {data} storeAcctIdList 店铺id list
 */
export function getStoreUnreadApi(data) {
  return request({
    method: 'post',
    url: `/chat/shopee/conversation/getUnreadCountMapByStoreAcctIdList`,
    loading: false,
    data: qs.stringify(data)
  });
}

/**
 * 获取买家消息列表
 * storeAcctId 店铺OA id
 *  readNoReply  为true时查询已读未回复的会话，默认为空或false
 */
export function getUserInfoApi(data) {
  return request({
    method: 'POST',
    url: `/chat/shopee/conversation/listConversationListByStoreAcctId`,
    data
  });
}

/**
 * 关键字查询会话获取消息列表
 * storeAcctId 店铺OA id
 * queryKeyword 查询关键字，订单编号仅含（大写字母和数字）
 */
export function getSearchListApi(data) {
  return request({
    method: 'post',
    url: `/chat/shopee/conversation/queryConversationByKeyword`,
    data
  });
}

/**
 * 对没有会话的发消息创建会话
 * da ta
 */
export function createNewChatApi(data) {
  return request({
    method: 'post',
    url: `/chat/shopee/msg/createANewConversationBySendMessage`,
    data
  });
}

/**
 * 获取当前用户消息列表
 * conversationId
 */
export function getCurMsgListApi(conversationId, storeAcctId) {
  return request({
    method: 'GET',
    url: `/chat/shopee/msg/listQueryMsg?conversationId=${conversationId}&storeAcctId=${storeAcctId}`
  });
}

/**
 * 星标当前用户聊天
 * @param {data} conversationId,storeAcctId
 */
export function pinConversationApi(data) {
  return request({
    method: 'post',
    url: '/chat/shopee/conversation/pinConversation',
    data
  });
}

/**
 * 取消星标当前用户聊天
 * @param {data} conversationId,storeAcctId
 */
export function unPinConversationApi(data) {
  return request({
    method: 'post',
    url: '/chat/shopee/conversation/unPinConversation',
    data
  });
}

/**
 * 读取会话
 * conversationId,storeAcctId,lastReadMessageId
 */
export function readConversationApi(data) {
  return request({
    method: 'post',
    url: `/chat/shopee/conversation/readConversation?conversationId=${data.conversationId}&storeAcctId=${data.storeAcctId}&lastReadMessageId=${data.latestMessageId}`
  });
}

/**
 * 修改聊天会话状态
 * conversationId,storeAcctId,conversationStatus
 */
export function updateConversationStatusApi(data) {
  return request({
    method: 'PUT',
    url: `/chat/shopee/conversation/updateConversationStatus`,
    data
  });
}

/**
 * 批量修改会话状态
 */
export function batchDealWithConversationStatusApi(data) {
  return request({
    method: 'post',
    url: `/chat/shopee/conversation/batchDealWithConversationStatus/${data.conversationStatus}`,
    data: data.arr
  });
}
/**
 * 添加shopee用户到聊天黑名单
 */
export function addBlackListApi(storeAcctId, toId) {
  return request({
    url: `/chat/shopee/chat/shop/blacklist/new/${storeAcctId}/${toId}`
  });
}

/**
 * 从聊天黑名单删除shopee用户
 */
export function delBlackListApi(storeAcctId, toId) {
  return request({
    method: 'delete',
    url: `/chat/shopee/chat/shop/blacklist/delete/${storeAcctId}/${toId}`
  });
}

/**
 * 根据会话id删除会话
 * storeAcctId,conversationId
 */
export function deleteConversationApi(storeAcctId, conversationId) {
  return request({
    method: 'delete',
    url: `/chat/shopee/conversation/deleteConversation/${storeAcctId}/${conversationId}`
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
 * 查询该店铺的优惠券
 */
export function listVoucherForChatApi(data) {
  return request({
    method: 'POST',
    url: `/chat/shopee/conversation/listVouchers`,
    loading: false,
    data
  });
}

/**
 * 查询该店铺的订单
 * buyerId:用户名
 */
export function tradeInfoApi(data) {
  return request({
    url: `/chat/shopee/conversation/listOrder?storeAcctId=${data.storeAcctId}&buyerUserName=${data.buyerUserName}&buyerUserId=${data.buyerUserId}&size=${data.size}`,
    loading: false,
    data
  });
}

/**
 * 物流接口
 * @param {Object} obj 传入
 */
export function listOrderTraceApi(obj) {
  return request({
    url: `/chat/shopee/conversation/getLogisticsTrackInfo/${obj.storeAcctId}/${obj.platOrderId}`
  });
}

/**
 * 处理议价申请
 * storeAcctId,offerId,messageId,agree
 */
export function handleOfferApi(data) {
  return request({
    method: 'POST',
    url: `/chat/shopee/conversation/handleOffer`,
    loading: false,
    data
  });
}

/**
 * 忽略议价
 */
export function handleIgnoreOfferApi(id) {
  return request({
    url: `/chat/shopee/msg/offerIgnore?id=${id}`,
    loading: false
  });
}

/**
 *  根据站点获取语言
 */
export function getLanguageBySiteApi(data) {
  return request({
    method: 'POST',
    url: '/chat/shopee/msg/customizeValues',
    loading: true,
    params: data
  });
}
