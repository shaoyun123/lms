import request from '@/utils/request';
// import qs from 'qs';

export function updateWaterMarkApi(data) {
  return request({
    url: `/lms/shopee/shoppeWatermark/updateWaterMark`,
    method: 'post',
    data
  });
}
