import request from '@/utils/request';
// import qs from 'qs';

// 修改人
export function queryModifier() {
  return request({
    url: '/lms/shopee/shopeeCateMapping/listAllModifier'
  });
}

// cnsc类目
export function queryCnscCategory() {
  return request({
    url: '/lms/shopee/shopeeCate/cnscCategoryTree'
  });
}

// 分页查询
export function queryList(data) {
  return request({
    url: '/lms/shopee/shopeeCateMapping/queryPage',
    method: 'post',
    data
  });
}

// 更新类目映射
export function updateCate(params) {
  return request({
    url: '/lms/shopee/shopeeCateMapping/updateMapping',
    method: 'get',
    params
  });
}

// 批量修改在线listing类目
export function batchUpdateItemCateApi(data) {
  return request({
    url: '/lms/shopee/shopeeCateMapping/batchUpdateItemCate',
    method: 'post',
    data
  });
}
