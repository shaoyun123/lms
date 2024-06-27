import request from '@/utils/request';
import qs from 'qs';

// 获取创建人
export const getCreatorListApi = () =>
  request({
    url: '/lms/ozonAutoListingRule/getOzonRuleCreates',
    loading: true
  });

// 查询列表
export const queryListApi = (data) =>
  request({
    url: '/lms/ozonAutoListingRule/searchOzonAutoListingRuleList.html',
    method: 'POST',
    loading: true,
    data
  });

// 创建规则
export const addNewRuleApi = (data) =>
  request({
    url: '/lms/ozonAutoListingRule/insertOzonAutoListingRule.html',
    method: 'POST',
    loading: true,
    data
  });

// 修改规则
export const editRuleApi = (data) =>
  request({
    url: '/lms/ozonAutoListingRule/updateOzonAutoListingRule.html',
    method: 'PUT',
    loading: true,
    data
  });

// 删除规则 规则id的数组
export const deleteRuleApi = (id) =>
  request({
    url: '/lms/ozonAutoListingRule/deleteOzonAutoListingRuleById/' + id,
    method: 'DELETE',
    loading: true
  });

// 批量开启/关闭规则
export const batchUpdateStatusApi = (data) =>
  request({
    url: '/lms/ozonAutoListingRule/updateOzonAutoListingRuleForPartAttributes.html',
    method: 'PUT',
    loading: true,
    data
  });

// 查询规则店铺
export const queryRuleShopsApi = (ruleId) =>
  request({
    url: `/lms/ozonAutoListingRuleStore/searchOzonAutoListingRuleStoreList/${ruleId}`,
    loading: true
  });

// 根据id查询规则信息
export const getOzonAutoListingRuleById = (ruleId) =>
  request({
    url: `/lms/ozonAutoListingRule/getOzonAutoListingRuleById/${ruleId}`,
    loading: true
  });

// 根据id查询店铺信息
export const getOzonAutoListingRuleStoreById = (id) =>
  request({
    url: `/lms/ozonAutoListingRuleStore/getOzonAutoListingRuleStoreById/${id}`,
    loading: true
  });

// 添加规则店铺
export const addRuleShopApi = (data) =>
  request({
    url: '/lms/ozonAutoListingRuleStore/insertOzonAutoListingRuleStore.html',
    method: 'POST',
    loading: true,
    data
  });

// 修改店铺
export const editRuleShopApi = (data) =>
  request({
    url: '/lms/ozonAutoListingRuleStore/updateOzonAutoListingRuleStore.html',
    method: 'PUT',
    loading: true,
    data
  });

// 删除规则 规则店铺 id, 非storeAcctId字段的数组
export const deleteRuleShopApi = (ids) =>
  request({
    url:
      '/lms/ozonAutoListingRuleStore/deleteOzonAutoListingRuleStoreById/' + ids,
    method: 'DELETE',
    loading: true
  });

// 查询ozon店铺
export const getAllStoreListApi = () => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    loading: true,
    data: qs.stringify({
      roleNames: 'ozon专员',
      platCode: 'ozon'
    })
  });
};

// // 查看日志
// export const getRuleModifyLogs = (params) =>
//   request({
//     url: '/lms/amazonAutoListingRule/logs',
//     method: 'GET',
//     loading: true,
//     params
//   });
