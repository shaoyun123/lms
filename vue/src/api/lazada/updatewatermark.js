import request from '@/utils/request';
// import qs from 'qs';

export function updateWatermarkByStore(data) {
  return request({
    url: `/lms/lazadaWatermark/updateWatermarkByStore`,
    method: 'post',
    data
  });
}
