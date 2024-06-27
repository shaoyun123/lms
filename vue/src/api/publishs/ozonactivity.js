import request from '@/utils/request';
// import qs from 'qs';

// ozon活动查询
export const queryListApi = (data) =>
  request({
    url: '/lms/ozon/action/queryActions',
    method: 'POST',
    loading: true,
    data
  });
// 管理活动弹窗查询
export const queryActionProdApi = (data) =>
  request({
    url: '/lms/ozon/action/queryActionProd',
    method: 'POST',
    loading: true,
    data
  });
// 批量编辑/添加活动商品
export const batchActivateActionProd = (storeAcctId, data) =>
  request({
    url: '/lms/ozon/action/batchActivateActionProd?storeAcctId=' + storeAcctId,
    method: 'POST',
    loading: true,
    data
  });
// 批量移除活动商品
export const batchDeactivateActionProd = (data) =>
  request({
    url: '/lms/ozon/action/batchDeactivateActionProd',
    method: 'POST',
    loading: true,
    data
  });
// 导出失败商品
export const exportFailProducts = (data) =>
  request({
    url: '/lms/ozon/action/exportFailProducts',
    method: 'POST',
    loading: true,
    data
  });
