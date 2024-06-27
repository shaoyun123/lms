import request from '@/utils/request';
import qs from 'qs';

export function querypage(data) {
  return request({
    url: '/lms/shopee/returns/list.html',
    method: 'post',
    data: qs.stringify(data)
  });
}

// 详情
export function queryDetail(id) {
  return request({
    url: `/lms/shopee/returns/detail.html?id=${id}`
  });
}

// 枚举
export function queryInitList() {
  return request({
    url: '/lms/shopee/returns/init.html'
  });
}

// 发送消息
export function batchSendMessage(data) {
  return request({
    url: '/chat/shopee/msg/batchSendMessage4Orders',
    data,
    needWrongMsg: true,
    method: 'post',
    loading: true
  });
}

// 同步
export function syncOrder(ids) {
  return request({
    url: `/lms/shopee/returns/refresh.html?ids=${ids}`
  });
}

// 备注
export function updateRemark(id, remark) {
  return request({
    url: `/lms/shopee/returns/add_remark.html?id=${id}&remark=${remark}`
  });
}

// 批量备注
export function batchUpdateRemark(data) {
  return request({
    url: `/lms/shopee/returns/batchAddRemark`,
    loading: true,
    method: 'post',
    data
  });
}

// 批量退款
export function batchConfirmRefund(data) {
  return request({
    url: `/lms/shopee/returns/batchConfirm`,
    loading: true,
    method: 'post',
    data
  });
}

// 上传图片
// export function uploadImg(data) {
//   return request({
//     url: `/lms/preProdDev/getBase64Img.html`,
//     method: 'post',
//     // data: qs.stringify(data)
//     data
//   });
// }

// 申诉
export function dispute(data) {
  return request({
    url: `/lms/shopee/returns/dispute.html`,
    method: 'post',
    data: qs.stringify(data)
  });
}

// 同意退款
export function confirmRefund(data) {
  return request({
    url: `/lms/shopee/returns/confirm.html`,
    method: 'post',
    data: qs.stringify(data)
  });
}

// 已完成
export function mark2CompletedApi(data) {
  return request({
    url: `/lms/shopee/returns/mark2Completed`,
    loading: true,
    method: 'post',
    data
  });
}

/**
 *  根据站点获取语言
 */
export function getLanguageBySiteApi(data) {
  return request({
    method: 'POST',
    url: '/chat/shopee/msg/customizeValues',
    loading: true,
    params: data
  });
}
