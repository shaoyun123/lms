import request from '@/utils/request';
import qs from 'qs';

// 获取创建人
export const getCreatorListApi = () =>
  request({
    url: '/lms/aliexpressHalf/getCreatorList',
    loading: true
  });

// 查询列表
export const queryListApi = (data) =>
  request({
    url: '/lms/aliexpressHalf/getAliexpressHalfAutoListingList',
    method: 'POST',
    loading: true,
    data
  });

// 创建规则
export const addNewRuleApi = (data) =>
  request({
    url: '/lms/aliexpressHalf/addNewRule',
    method: 'POST',
    loading: true,
    data
  });

// 修改规则
export const editRuleApi = (data) =>
  request({
    url: '/lms/aliexpressHalf/editRule',
    method: 'POST',
    loading: true,
    data
  });

// 删除规则 规则id的数组
export const deleteRuleApi = (data) =>
  request({
    url: '/lms/aliexpressHalf/deleteRuleList',
    method: 'POST',
    loading: true,
    data
  });

// 批量开启/关闭规则
export const batchUpdateStatusApi = (data) =>
  request({
    url: '/lms/aliexpressHalf/ruleIdList',
    method: 'POST',
    loading: true,
    params: data
  });

// 查询规则店铺
export const queryRuleShopsApi = (ruleId) =>
  request({
    url: `/lms/aliexpressHalf/getRuleStoreList/${ruleId}`,
    loading: true
  });

// 添加规则店铺
export const addRuleShopApi = (data) =>
  request({
    url: '/lms/aliexpressHalf/addNewRuleStore',
    method: 'POST',
    loading: true,
    data
  });

// 修改店铺
export const editRuleShopApi = (data) =>
  request({
    url: '/lms/aliexpressHalf/editRuleStore',
    method: 'POST',
    loading: true,
    data
  });

// 删除规则 规则店铺 id, 非storeAcctId字段的数组
export const deleteRuleShopApi = (data) =>
  request({
    url: '/lms/aliexpressHalf/deleteStoreList',
    method: 'POST',
    loading: true,
    data
  });

// 查询AE半托管店铺
export const getAllStoreListApi = () => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    loading: true,
    data: qs.stringify({
      roleNames: 'AE半托管专员',
      platCode: 'AE半托管'
    })
  });
};

// 查看日志
export const getRuleModifyLogs = (params) =>
  request({
    url: '/lms/aliexpressHalf/getRuleModifyLogs',
    method: 'GET',
    loading: true,
    params
  });
