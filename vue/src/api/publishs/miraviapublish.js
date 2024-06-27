import request from '@/utils/request';

// 获取刊登标题
export function queryMiraviaPublishTitle(params) {
  return request({
    url: '/lms/miraviaListing/getProductTitle?prodPId=' + params,
    method: 'GET'
  });
}

// 根据类目查询类目属性
export function queryCateAttr(data) {
  return request({
    url: '/lms/prodCateMiravia/listCateAttrByCategoryId',
    method: 'POST',
    data
  });
}

// 查询类目
export function queryCateList(data) {
  return request({
    url: '/lms/prodCateMiravia/listCateByCategoryId',
    method: 'POST',
    data
  });
}

// 生成商品 初始化
export function initMiraviaProduct(params) {
  return request({
    url: '/lms/miraviaListing/openGenStoreListingDialog',
    method: 'GET',
    params
  });
}

// 获取海关描述
export function queryHsCodeAndText(data) {
  return request({
    url: '/lms/miraviaListing/getHsCodeAndText',
    method: 'POST',
    data
  });
}

// 生成子sku
export function addSkuInfo(data) {
  return request({
    url: '/lms/miraviaListing/addProdSSkuInfos',
    method: 'POST',
    data
  });
}

// 生成待刊登
export function handleCreate(data) {
  return request({
    url: '/lms/miraviaListing/genStoreListing',
    method: 'POST',
    data
  });
}

// 保存刊登详情
export function handleUpdate(data) {
  return request({
    url: '/lms/miraviaListing/updateListingDetail',
    method: 'POST',
    data
  });
}

// 查询列表
export function handleQueryList(data) {
  return request({
    url: '/lms/miraviaListing/list',
    method: 'POST',
    data
  });
}

// 删除刊登记录
export function handleRemoveList(data) {
  return request({
    url: '/lms/miraviaListing/deleteListingRecordList',
    method: 'POST',
    data
  });
}

// 立即刊登 重新发布
export function startPublish(data) {
  return request({
    url: '/lms/miraviaListing/publishListingNow',
    method: 'POST',
    data
  });
}

// 获取刊登详情
export function getDetail(params) {
  return request({
    url: '/lms/miraviaListing/getListingDetail',
    method: 'GET',
    params
  });
}

// 分类属性同步
export function syncCateAttr(params) {
  return request({
    url: '/lms/prodCateMiravia/syncCateAttr',
    method: 'GET',
    params
  });
}

// 物流属性
export function getLogisAttrEnum() {
  return request({
    url: '/lms/enum/getLogisAttrEnum.html',
    method: 'GET'
  });
}

// 物流属性与miravia危险品选项的映射关系
export function getBizDictByCode() {
  return request({
    url: '/lms/sysdict/getBizDictByCode?headCode=miravia_dangerous_goods',
    method: 'GET'
  });
}

// 定价
export const reCountPriceApi = (data) =>
  request({
    url: '/lms/miraviaOnlineProduct/reCountPrice',
    data,
    loading: true,
    method: 'post'
  });
// miravia生成店铺刊登商品 并立即刊登或 定时刊登
export const genStoreListingAndPublish = (data) =>
  request({
    url: '/lms/miraviaListing/genStoreListingAndPublish',
    data,
    loading: true,
    method: 'post'
  });
// 批量修改定时刊登时间
export const updateProdListTiming = (data) =>
  request({
    url: '/lms/miraviaListing/updateProdListTiming',
    data,
    loading: true,
    method: 'post'
  });
// 批量取消定时刊登时间
export const cancelProdListTiming = (data) =>
  request({
    url: '/lms/miraviaListing/cancelProdListTiming',
    data,
    loading: true,
    method: 'post'
  });
