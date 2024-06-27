import request from '@/utils/request';

// 查询规则
export const searchMercadoAutoListingRuleList = (data) => {
  return request({
    url: '/lms/MercadoAutoListingRuleController/searchMercadoAutoListingRuleList.html',
    method: 'POST',
    loading: true,
    data
  });
};
// 新增规则
export const insertMercadoAutoListingRule = (data) =>
  request({
    url: '/lms/MercadoAutoListingRuleController/insertMercadoAutoListingRule.html',
    method: 'POST',
    loading: true,
    data: data
  });
// 修改规则
export const updateMercadoAutoListingRule = (data) =>
  request({
    url: '/lms/MercadoAutoListingRuleController/updateMercadoAutoListingRule.html',
    method: 'PUT',
    loading: true,
    data: data
  });
// 查询规则详情
export const getMercadoAutoListingRuleById = (id) =>
  request({
    url:
      '/lms/MercadoAutoListingRuleController/getMercadoAutoListingRuleById?id=' +
      id,
    loading: true,
    method: 'GET'
  });
// 新增规则店铺
export const insertMercadoAutoRuleStores = (data) =>
  request({
    url: '/lms/MercadoAutoListingRuleController/insertMercadoAutoRuleStores.html',
    method: 'POST',
    loading: true,
    data: data
  });
// 查询规则店铺
export const searchMercadoAutoListingRuleStoreList = (data) =>
  request({
    url: '/lms/MercadoAutoListingRuleController/searchMercadoAutoListingRuleStoreList',
    method: 'GET',
    loading: true,
    params: data
  });
// 删除规则店铺
export const deleteMercadoAutoListingRuleStoreById = (ids) =>
  request({
    url:
      '/lms/MercadoAutoListingRuleController/deleteMercadoAutoListingRuleStoreById?ids=' +
      ids,
    loading: true,
    method: 'DELETE'
  });
// 修改规则店铺信息
export const updateMercadoAutoListingRuleStore = (data) =>
  request({
    url: '/lms/MercadoAutoListingRuleController/updateMercadoAutoListingRuleStore',
    method: 'PUT',
    loading: true,
    data: data
  });
// 修改规则状态
export const updateMercadoAutoListingRuleStatus = (params) =>
  request({
    url: '/lms/MercadoAutoListingRuleController/updateMercadoAutoListingRuleStatus.html',
    method: 'PUT',
    loading: true,
    params
  });
// 删除规则
export const deleteMercadoAutoListingRuleById = (ids) =>
  request({
    url:
      '/lms/MercadoAutoListingRuleController/deleteMercadoAutoListingRuleById?ids=' +
      ids,
    method: 'DELETE',
    loading: true
  });

// 创建人
export const listAllUser = () =>
  request({
    url: '/lms/sys/listAllUser.html',
    method: 'POST',
    loading: true
  });

// 查看日志
export const getRuleModifyLogs = (ruleId) =>
  request({
    url:
      '/lms/MercadoAutoListingRuleController/getRuleModifyLogs?ruleId=' +
      ruleId,
    method: 'GET',
    loading: true
  });
