import request from '@/utils/request';
import qs from 'qs';

// 查询
export function salesPlatAccountDtoPage(data) {
  return request({
    url: `/lms/salesplat/salesPlatAccountDtoPage.html?platCode=AE全托管`,
    method: 'POST',
    data: qs.stringify(data)
  });
}

// 切换店铺状态
export function toggleStoreApi(data) {
  return request({
    url: '/lms/salesplat/batchUpdateAcctStatus.html',
    method: 'post',
    data
  });
}
// 切换店铺状态
export function getAcctRoleUserMap(data) {
  return request({
    url: '/lms/salesplat/getAcctRoleUserMap',
    method: 'post',
    params: data
  });
}
