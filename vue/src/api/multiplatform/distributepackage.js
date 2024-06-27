/*
 * @Author: ztao
 * @Date: 2022-11-15 10:02:44
 * @LastEditTime: 2023-07-07 15:11:10
 * @Description: 配货包装页面相关接口
 */
import request from '@/utils/request';

//导出呆滞库存
export const exportUnSendStock = () => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/exportUnSendStock',
    responseType: 'blob',
    loading: true
  });
};
//查询接口
export const queryPackableBySku = (obj) => {
  return request({
    url: '/lms/PlatWh/distribute/queryPackableBySku',
    method: 'post',
    data: obj
  });
};
//未存框货品
export const queryUnSaveGoods = () => {
  return request({
    url: '/lms/PlatWh/distribute/queryUnSaveGoods',
    method: 'post',
    data: {}
  });
};
//可配单品
export const queryPackableSingle = (data) => {
  return request({
    url: '/lms/PlatWh/distribute/queryPackableSingle',
    method: 'post',
    data
  });
};

//可配组合品
export const queryPackableMulti = (data) => {
  return request({
    url: '/lms/PlatWh/distribute/queryPackableMulti',
    method: 'post',
    data
  });
};
//标记已发货
export const markDistributed = (obj) => {
  return request({
    url: 'lms/PlatWh/distribute/markDistributed',
    method: 'post',
    data: obj
  });
};

//已包装
export const packShipmentDetail = (obj) => {
  return request({
    url: 'lms/PlatWh/distribute/packShipmentDetail',
    method: 'post',
    data: obj
  });
};
// 批次号list
export const queryLatestUnMatchBatchNo = (data) => {
  return request({
    url: 'lms/PlatWh/distribute/queryLatestUnMatchBatchNo',
    method: 'post',
    data
  });
};
// 生成批次号
export const createPDABatchNo = (data) => {
  return request({
    url: 'lms/PlatWh/distribute/createPDABatchNo',
    method: 'post',
    data
  });
};

// 取消批次
export const cancelSkuTransferBatch = (data) => {
  return request({
    url: 'lms/PlatWh/PlatWhShipment/cancelSkuTransferBatch',
    method: 'post',
    data
  });
};

// 获取仓库名称接口
export const getRepoName = () =>
  request({
    url: '/lms/PlatWh/PlatWhFrameInfo/getAllWareHouseName',
    method: 'get'
  });
