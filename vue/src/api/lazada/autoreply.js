import request from '@/utils/request';

// 美客多在线商品删除
export const deleteProducts = () =>
  request({
    url: '/lms/lazada/autoReplyRule/getCreators',
    method: 'GET'
  });
// 获取lazada站点
export const getAllSite = () =>
  request({
    url: '/lms/onlineProductLazada/getAllSite.html',
    method: 'GET'
  });
// lazada店铺
export const listStoreForRenderHpStoreCommonComponent = (data) =>
  request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    params: data
  });
//   获取创建人列表
export const getCreators = () =>
  request({
    url: '/chat/lazada/autoReplyRule/getCreators',
    method: 'GET'
  });
//   获取自动回复类型枚举
export const listAutoReplyType = () =>
  request({
    url: '/chat/lazada/autoReplyRule/listAutoReplyType',
    method: 'GET'
  });
//   查询自动回复策略
export const listAutoReplyRule = (data) =>
  request({
    url: '/chat/lazada/autoReplyRule/listAutoReplyRule',
    method: 'POST',
    data: data
  });
//   新增或修改一条自动回复策略
export const addOrUpdateRule = (data) =>
  request({
    url: '/chat/lazada/autoReplyRule/addOrUpdateRule',
    method: 'POST',
    data: data
  });
//   获取仓库订单状态
export const getWarehouseOrderStatus = () =>
  request({
    url: '/chat/lazada/autoReplyRule/getWarehouseOrderStatus',
    method: 'GET'
  });
//   获取平台订单状态
export const getLazadaPlatOrderStatus = () =>
  request({
    // url: '/chat/lazada/autoReplyRule/getLazadaPlatOrderStatus',
    url: '/lms/platorder/listThirtyDaysPlatOrderStatus?platCode=lazada',
    method: 'GET'
  });
//   设置规则绑定店铺
// export const updateShopRef = (data) =>
//   request({
//     url: '/chat/lazada/autoReplyRule/updateShopRef',
//     method: 'POST',
//     params: data
//   });
//   规则中按店铺查询
export const getAllStoresByRuleIdAndStoreName = (data) =>
  request({
    url: '/chat/lazada/autoReplyRule/getAllStoresByRuleIdAndStoreName',
    method: 'POST',
    data: data
  });
//   根据规则id查找绑定的店铺
export const getBindingStoresByRuleId = (ruleId) =>
  request({
    url: '/chat/lazada/autoReplyRule/getBindingStoresByRuleId?ruleId=' + ruleId,
    method: 'GET'
  });
//   删除and批量删除自动回复规则
export const removeAutoReplyRule = (ids) =>
  request({
    url: '/chat/lazada/autoReplyRule/removeAutoReplyRule?ids=' + ids,
    method: 'DELETE'
  });
//   批量开启、关闭规则
export const batchUpdateStatus = (data) =>
  request({
    url: '/chat/lazada/autoReplyRule/batchUpdateStatus',
    method: 'POST',
    params: data
  });
