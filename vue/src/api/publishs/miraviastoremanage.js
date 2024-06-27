import request from '@/utils/request';
import qs from 'qs';

// 查询
export function salesPlatAccountDtoPage(data) {
  return request({
    url: '/lms/salesplat/salesPlatAccountDtoPage.html?platCode=miravia',
    method: 'POST',
    data: qs.stringify(data)
  });
}

// 同步店铺
export function syncStore() {
  return request({
    url: '/lms/miravia/store/syncStore',
    method: 'get'
  });
}

// 切换店铺状态
export function toggleStore(data) {
  return request({
    url: '/lms/salesplat/batchUpdateAcctStatus.html',
    method: 'post',
    data
  });
}
