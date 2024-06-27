import request from '@/utils/request';
import qs from 'qs';

// 获取枚举数据
export const initEnumApi = () => {
  return request({
    url: '/lms/tiktok/reserve/init'
  });
};

// 查询列表
export const queryListApi = (data) => {
  return request({
    url: '/lms/tiktok/reserve/list',
    method: 'POST',
    data
  });
};

// 同步
export const syncApi = (data) => {
  return request({
    url: '/lms/tiktok/reserve/syncReverseOrder',
    method: 'POST',
    data,
    loading: true
  });
};
// 同意
export const confirmReverseApi = (data) => {
  return request({
    url: `/lms/tiktok/reserve/confirmReverse?storeAcctId=${data.storeAcctId}&reverseOrderId=${data.reverseOrderId}`
  });
};

// 批量同意
export const batchConfirmReverseApi = (data) => {
  return request({
    url: '/lms/tiktok/reserve/batchConfirmReverse',
    method: 'POST',
    data,
    loading: true,
    needWrongMsg: true
  });
};

// 批量拒绝
export const batchRejectReverse = (data) => {
  return request({
    url: '/lms/tiktok/reserve/batchRejectReverse',
    method: 'POST',
    data,
    loading: true,
    needWrongMsg: true
  });
};

// 获取拒绝理由
export const getRejectReasonListApi = (data) => {
  return request({
    url: `/lms/tiktok/reserve/getRejectReasonList?storeAcctId=${data.storeAcctId}&reverseType=${data.reverseType}&reasonType=${data.reasonType}&fulfillmentStatus=`
  });
};

// 拒绝售后请求
export const rejectReverseApi = (data) => {
  return request({
    url: '/lms/tiktok/reserve/rejectReverse',
    method: 'POST',
    data: qs.stringify(data)
  });
};

// 备注
export const editRemarkApi = (data) => {
  return request({
    url: '/lms/tiktok/reserve/editRemark',
    method: 'POST',
    data: qs.stringify(data)
  });
};
