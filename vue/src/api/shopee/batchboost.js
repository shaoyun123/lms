import request from '@/utils/request';

export function batchResetBoostItemsApi(data) {
  return request({
    url: `/lms/shopee/shopeeIsEnableProduct/batchResetBoostItems`,
    method: 'post',
    loading: true,
    data
  });
}
export function batchSetBoostItemsApi(data) {
  return request({
    url: `/lms/shopee/shopeeIsEnableProduct/batchSetBoostItems`,
    method: 'post',
    loading: true,
    data
  });
}
