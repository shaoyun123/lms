import request from '@/utils/request';

// 查询导出店铺表头
export function getExportAeFullManageStoreHeaderApi() {
  return request({
    url: '/lms/salesplat/getExportAeFullManageStoreHeader',
    method: 'get'
  });
}
