import request from '@/utils/request';

// 获取列表
export const queryList = (data) =>
  request({
    url: '/lms/whaeReplOrder/queryWhAeReplOrderByCondition',
    method: 'post',
    data
  });

// 获取快递单信息
export const queryExpress = (data) =>
  request({
    url: '/lms/whaeReplOrder/queryWhAeExpress',
    method: 'post',
    data
  });

// 修改物流单号
export const editExpress = (data) =>
  request({
    url: '/lms/whaeReplOrder/editAeExpress',
    method: 'post',
    data
  });

// 取消
export const cancelOrder = (data) =>
  request({
    url: '/lms/whaeReplOrder/cancelWhAeReplOrder',
    method: 'post',
    data
  });

// 发货
export const deliverOrder = (data) =>
  request({
    url: '/lms/whaeReplOrder/addAeExpress',
    method: 'post',
    data
  });

// 剩余不发
export const notDeliverOrder = (data) =>
  request({
    url: '/lms/whaeReplOrder/expressAnyway',
    method: 'post',
    data
  });

// 下载导入快递费模板
export const downloadTemp = () =>
  request({
    url: '/lms/whaeReplOrder/downAETemplate.html',
    method: 'get'
  });

// 导入快递费
export const importFee = (data) =>
  request({
    url: '/lms/whaeReplOrder/importAETemplate',
    method: 'post',
    data
  });

// 打印货品条码
export const printCode = (data) =>
  request({
    url: '/lms/whaeReplOrder/printAEProductLabel',
    method: 'post',
    data
  });
