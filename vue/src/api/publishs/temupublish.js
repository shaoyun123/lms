import request from '@/utils/request';
import qs from 'qs';

// 查询列表数据
export const queryPublishData = (data) => {
  return request({
    url: '/lms/temuListing/list',
    method: 'POST',
    data: data
  });
};

// 删除刊登记录
export const deletePublishData = (data) => {
  return request({
    url: '/lms/temuListing/deleteListingRecordList',
    method: 'POST',
    data: data
  });
};

// 立即刊登 重新发布
export const startPublish = (data) => {
  return request({
    url: '/lms/temuListing/publishListingNow',
    method: 'POST',
    data: data
  });
};

// 定时刊登
export const publishTiming = (data) => {
  return request({
    url: '/lms/temuListing/publishListingTiming',
    method: 'POST',
    data: data
  });
};

// 获取生成商品信息
export const getCreateInfo = (params) => {
  return request({
    url: '/lms/temuListing/openGenStoreListingDialog',
    method: 'get',
    params
  });
};

// 生成商品时生成产品标题
export const getProductName = (params) => {
  return request({
    url: '/lms/temuListing/getTemuProductName',
    method: 'get',
    params
  });
};

// 查询刊登详情
export const getPublishDetail = (params) => {
  return request({
    url: '/lms/temuListing/getListingDetailPage',
    method: 'get',
    params
  });
};

// 查询类目属性
export const getCatList = (params) => {
  return request({
    url: '/lms/temu/cats/listCatAttr',
    method: 'get',
    params
  });
};

// 敏感类型
export const getSensitive = () => {
  return request({
    url: '/lms/temuListing/listTemuSensitiveTypeEnum',
    method: 'get'
  });
};

// 获取平台类目
export const getSubCat = (data) => {
  return request({
    url: '/lms/temu/cats/listSubCats',
    method: 'post',
    data
  });
};

// 根据平台类目查询产品属性
export const getProductValue = (data) => {
  return request({
    url: '/lms/temu/cats/listProdListingTemuProperty',
    method: 'post',
    data
  });
};

// 更新刊登详情
export const updateDetail = (data) => {
  return request({
    url: '/lms/temuListing/updateListingDetail',
    method: 'post',
    data
  });
};

// 模板图片
export const getTempImgs = (data) => {
  return request({
    url: '/lms/publish/getprodImg.html',
    method: 'post',
    data: qs.stringify(data)
  });
};

// 生成店铺刊登商品
export const createPublish = (data) => {
  return request({
    url: '/lms/temuListing/genStoreListing',
    method: 'post',
    data: data
  });
};

// 新增商品子Sku
export const addProdSSkuInfos = (data) => {
  return request({
    url: '/lms/temuListing/addProdSSkuInfos',
    method: 'post',
    data: data,
    needWrongMsg: true
  });
};

// 获取类目
export const getCateTree = () => {
  return request({
    url: '/lms/temu/cats/listCateTree',
    method: 'get'
  });
};

// 同步类目
export const syncCate = (params) => {
  return request({
    url: '/lms/prodCateTemu/syncCateAttrByCateId',
    method: 'get',
    params
  });
};

// 获取尺码表模板
export const getSizeTemplate = (params) => {
  return request({
    url: '/lms/temuListing/listAvaliableSizeCharts',
    method: 'get',
    params
  });
};

// 手动同步尺码模板
export const syncSizeTemplate = (params) => {
  return request({
    url: '/lms/temuListing/syncAvaliableSizeCharts',
    method: 'get',
    params
  });
};

// 检查尺码模板
export const checkTemplate = (data) => {
  return request({
    url: '/lms/temuListing/checkAndProcessSizeChartsContent',
    method: 'post',
    data
  });
};

// 刊登获取父规格
export const getTemuGoodsParentSpec = (params) => {
  return request({
    url: '/lms/temuListing/getTemuGoodsParentSpec',
    method: 'get',
    params
  });
};

// 查询temu平台有开发者账号的店铺
export const getListTemuValidStore = (data) => {
  return request({
    url: '/lms/temuListing/listTemuValidStore',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });
};

// 批量刊登
export const batchGenListingApi = (data) => {
  return request({
    url: '/lms/temuListing/batchGenListing',
    method: 'post',
    loading: true,
    data
  });
};

// 根据标题获取推荐类目
export const getRecommendCateByTitleApi = (data) => {
  return request({
    url: '/lms/temuListing/getRecommendCateByTitle',
    method: 'post',
    loading: true,
    data,
    needWrongMsg: true
  });
};
