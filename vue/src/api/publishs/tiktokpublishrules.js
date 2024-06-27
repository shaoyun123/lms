import request from '@/utils/request';
import qs from 'qs';

// 获取创建人
export const getCreatorListApi = () =>
  request({
    url: '/lms/tiktok/autoListingRule/listAllCreator',
    loading: true
  });

// 查询列表
export const queryListApi = (data) =>
  request({
    url: '/lms/tiktok/autoListingRule/queryAutoListingRule',
    method: 'POST',
    loading: true,
    data
  });

// 创建规则
export const addNewRuleApi = (data) =>
  request({
    url: '/lms/tiktok/autoListingRule/addNewRule',
    method: 'POST',
    loading: true,
    data
  });

// 修改规则
export const editRuleApi = (data) =>
  request({
    url: '/lms/tiktok/autoListingRule/editRule',
    method: 'POST',
    loading: true,
    data
  });

// 删除规则 规则id的数组
export const deleteRuleApi = (data) =>
  request({
    url: '/lms/tiktok/autoListingRule/deleteRule',
    method: 'POST',
    loading: true,
    data
  });

// 批量开启/关闭规则
export const batchUpdateStatusApi = (data) =>
  request({
    url: '/lms/tiktok/autoListingRule/batchEditStatus',
    method: 'POST',
    loading: true,
    data
  });

// 查询规则店铺
export const queryRuleShopsApi = (ruleId) =>
  request({
    url: `/lms/tiktok/autoListingRule/queryRuleShops?ruleId=${ruleId}`,
    loading: true
  });

// 添加规则店铺
export const addRuleShopApi = (data) =>
  request({
    url: '/lms/tiktok/autoListingRule/addRuleShop',
    method: 'POST',
    loading: true,
    data
  });

// 修改店铺
export const editRuleShopApi = (data) =>
  request({
    url: '/lms/tiktok/autoListingRule/editRuleShop',
    method: 'POST',
    loading: true,
    data
  });

// 删除规则 规则店铺 id, 非storeAcctId字段的数组
export const deleteRuleShopApi = (data) =>
  request({
    url: '/lms/tiktok/autoListingRule/deleteRuleShop',
    method: 'POST',
    loading: true,
    data
  });

// 查询tiktok店铺
export const getAllStoreListApi = () => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    loading: true,
    data: qs.stringify({
      roleNames: 'tiktok专员',
      platCode: 'tiktok'
    })
  });
};

// 查看日志
export const getRuleModifyLogs = (params) =>
  request({
    url: '/lms/amazonAutoListingRule/logs',
    method: 'GET',
    loading: true,
    params
  });

// 批量修改规则
export const batchEditApi = (data) =>
  request({
    url: '/lms/tiktok/autoListingRule/rule/batchEdit',
    method: 'POST',
    loading: true,
    data
  });

// 操作日志
export const listExecuteLogApi = (data) =>
  request({
    url: `/lms/tiktok/autoListingRule/listExecuteLog?ruleId=${data.id}&page=${data.page}&limit=${data.limit}`,
    method: 'get',
    loading: true
  });
