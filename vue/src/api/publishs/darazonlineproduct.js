import request from '@/utils/request';

// 查询
export function getProducts(data) {
  return request({
    url: '/lms/daraz/product/getProducts',
    method: 'POST',
    data: data,
    loading: true
  });
}

// 日志
export function getLogApi(data) {
  return request({
    url: `/lms/daraz/product/getLogs?storeAcctId=${data.storeAcctId}&itemId=${data.itemId}`,
    loading: true
  });
}

// 批量删除或下架获取数据
export function getIsEnableProductApi(data) {
  return request({
    url: `/lms/darazBatch/getIsEnableProduct.html`,
    method: 'post',
    loading: true,
    data
  });
}

// 批量删除或下架
export function batchIsEnableProductApi(data) {
  return request({
    url: `/lms/darazBatch/batchIsEnableProduct.html`,
    method: 'post',
    loading: true,
    data
  });
}
// 批量调整原价和促销价
export function updatePriceAndPromotionPrice(data) {
  return request({
    url: `/lms/daraz/product/updatePriceAndPromotionPrice`,
    method: 'post',
    loading: true,
    data
  });
}
// 批量调价
export function updatePriceAndPromotionPriceApi(data) {
  return request({
    url: `/lms/daraz/product/updatePriceAndPromotionPriceApi`,
    method: 'post',
    loading: true,
    data
  });
}

// 批量同步
export function bacthUpdateApi(data) {
  return request({
    url: `/lms/daraz/product/updateBatchItem`,
    method: 'post',
    loading: true,
    needWrongMsg: true,
    data
  });
}

// 批量查询商品库存
export function batchGetDarazStockInfo(data) {
  return request({
    url: `/lms/darazBatch/batchGetStockInfo`,
    method: 'post',
    loading: true,
    data
  });
}
// 批量调整库存
export function batchUpdateStockApi(data) {
  return request({
    url: `/lms/darazBatch/batchUpdateStock`,
    method: 'post',
    loading: true,
    data
  });
}

// 获取批量操作结果
export function getBatchUpdateResultApi(data) {
  return request({
    url: `/lms/darazBatch/getBatchUpdateResult`,
    method: 'get',
    params: data
  });
}
