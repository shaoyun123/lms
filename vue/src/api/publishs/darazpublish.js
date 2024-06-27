import request from '@/utils/request';

// 查询
export function queryDarazList(data) {
  return request({
    url: '/lms/darazListing/list',
    method: 'POST',
    data: data
  });
}
// 生成商品
export function createProd(data) {
  return request({
    url: '/lms/darazListing/genStoreListing',
    method: 'POST',
    data: data,
    needWrongMsg: true
  });
}
// 删除生成的刊登记录
export function deleteRecord(data) {
  return request({
    url: '/lms/darazListing/deleteListingRecordList',
    method: 'POST',
    data: data
  });
}
