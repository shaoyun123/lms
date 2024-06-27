import request from '@/utils/request';
// 获取提交人
export const getOzonListingSubmiters = () =>
  request({
    url: '/lms/ozon/listing/getOzonListingSubmiters',
    loading: true
  });

// 查询列表
export const queryOzonList = (data) =>
  request({
    url: '/lms/ozon/listing/getOzonListingList',
    method: 'POST',
    loading: true,
    data
  });

// ozon立即刊登
export function ozonPublishListing(data) {
  return request({
    url: '/lms/ozon/listing/ozonPublishListing',
    method: 'POST',
    data: data,
    loading: true
  });
}
// ozon生成待刊登
export function saveOzonListing(data) {
  return request({
    url: '/lms/ozon/listing/saveOzonListing',
    method: 'POST',
    data: data,
    loading: true
  });
}
// ozon删除刊登数据
export function deleteOzonListing(data) {
  return request({
    url: '/lms/ozon/listing/deleteOzonListing',
    method: 'POST',
    loading: true,
    data: data
  });
}
// ozon修改刊登详情
export function updateOzonPublishDetail(data) {
  return request({
    url: '/lms/ozon/listing/updateOzonPublishDetail',
    method: 'POST',
    loading: true,
    data: data
  });
}
// ozon刊登详情查看
export function getOzonPublishDetail(id) {
  return request({
    url: `/lms/ozon/listing/getOzonPublishDetail/${id}`,
    method: 'GET',
    loading: true
  });
}
// ozon定时刊登
export function ozonUpdateListingTiming(data) {
  return request({
    url: `/lms/ozon/listing/ozonUpdateListingTiming`,
    method: 'POST',
    data,
    loading: true
  });
}
// 取消定时刊登
export function cancelListingTiming(data) {
  return request({
    url: `/lms/ozon/listing/cancelListingTiming`,
    method: 'POST',
    data,
    loading: true
  });
}
