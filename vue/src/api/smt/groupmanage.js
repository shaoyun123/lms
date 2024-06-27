import request from '@/utils/request';

// 查询列表
export const queryByParams = (data) =>
  request({
    url: '/lms/aliexpress/group/queryByParams',
    method: 'POST',
    loading: true,
    data
  });
// 批量同步分组信息
export function batchSyncGroupByStoreAcctIdList(data) {
  return request({
    url: '/lms/aliexpress/group/batchSyncGroupByStoreAcctIdList',
    method: 'POST',
    loading: true,
    data
  });
}
// 更新分组和类目的映射关系
export function updateGroupAndCategoryMapping(data) {
  return request({
    url: '/lms/aliexpress/group/updateGroupAndCategoryMapping',
    method: 'POST',
    loading: true,
    data
  });
}
export function getCateTreeByStoreAcctId(storeAcctId) {
  return request({
    url:
      '/lms/aliexpressFullmanage/listing/getCateTreeByStoreAcctId?storeAcctId=' +
      storeAcctId,
    method: 'GET',
    loading: false
    // 不使用全局loading，悬浮框内loading
  });
}
