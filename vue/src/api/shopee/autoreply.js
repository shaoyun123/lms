import request from '@/utils/request';
import qs from 'qs';

// 查询列表
export const queryPageApi = (data) =>
  request({
    url: '/chat/shopee/autoReplyRule/listAutoReplyRule',
    method: 'post',
    data
  });

// 延迟订单状态
export const listDelayShipOrderStatusApi = () =>
  request({
    url: '/chat/shopee/autoReplyRule/listDelayShipOrderStatus'
  });

// 换货状态
export const listChangeProductOrderStatusApi = () =>
  request({
    url: '/chat/shopee/autoReplyRule/listChangeProductOrderStatus'
  });

// OA订单状态
export const listOAOrderStatusApi = () =>
  request({
    url: '/lms/unauditorder/listenum.html'
  });

// 类型
export const listAutoReplyTypeApi = () =>
  request({
    url: '/chat/shopee/autoReplyRule/listAutoReplyType'
  });

// 平台订单物流状态
export const listPlatLogisticsStatusApi = () =>
  request({
    url: '/chat/shopee/autoReplyRule/listPlatLogisticsStatus'
  });

// 平台订单状态
export const listPlatOrderStatusApi = () =>
  request({
    url: '/chat/shopee/autoReplyRule/listPlatOrderStatus'
  });

// 初始化
export const initApi = () =>
  request({
    url: '/chat/shopee/autoReplyRule/init'
  });

// 创建人
export const getCreatorApi = () =>
  request({
    url: '/chat/shopee/autoReplyRule/listAllCreator'
  });

// 新增
export const addRuleApi = (data) =>
  request({
    url: '/chat/shopee/autoReplyRule/addNewRule',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });
// 更新
export const updateRuleApi = (data) =>
  request({
    url: '/chat/shopee/autoReplyRule/updateAutoReplyRule',
    method: 'post',
    loading: true,
    data
  });

// 更新状态
export const updateRuleStatusApi = (data) =>
  request({
    url: '/chat/shopee/autoReplyRule/updateRuleStatus',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });

// 搜索店铺
export const listStoreAcctByRuleIdApi = (ruleId, salesSite, storeAcct = '') =>
  request({
    url: `/chat/shopee/autoReplyRule/listStoreAcctByRuleId?ruleId=${ruleId}&salesSite=${salesSite}&storeAcct=${storeAcct}`
  });

// 保存匹配的店铺
export const updateShopRefApi = (data) =>
  request({
    url: '/chat/shopee/autoReplyRule/updateShopRef',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });

// 删除
export const deleteApi = (data) =>
  request({
    url: '/chat/shopee/autoReplyRule/deleteAutoReplyRuleByIds',
    method: 'delete',
    loading: true,
    data
  });

// 自动回复规则查询
export const autoReplyExecuteRuleApi = (autoType) =>
  request({
    url: `/chat/shopee/autoReplyExecuteRule/one/${autoType}`,
    method: 'POST',
    loading: true
  });
// 自动回复规则保存
export const saveRuleApi = (data) =>
  request({
    url: '/chat/shopee/autoReplyExecuteRule/saveRule',
    method: 'POST',
    loading: true,
    data
  });
