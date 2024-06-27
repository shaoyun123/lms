import request from '@/utils/request';

export const queryProdList = (data) =>
  request({
    url: '/lms/mercadoListing/queryProdList',
    method: 'POST',
    data: data
  });
export const generalStoreProd = (data) =>
  request({
    url: '/lms/mercadoListing/generalStoreProd',
    method: 'POST',
    data: data
  });
export const delStoreProd = (data) =>
  request({
    url: '/lms/mercadoListing/delStoreProd?listingIds=' + data,
    method: 'POST'
  });
export const mercadoPublishListing = (data) =>
  request({
    url: '/lms/mercadoListing/mercadoPublishListing',
    method: 'POST',
    data: data
  });
// 刊登详情
export const getMercadoPublishDetail = (id) =>
  request({
    url: `/lms/mercadoListing/getMercadoPublishDetail/${id}`,
    method: 'GET'
  });
// 刊登详情--保存
export const updateMercadoPublishDetail = (data) =>
  request({
    url: `/lms/mercadoListing/updateMercadoPublishDetail`,
    method: 'POST',
    data: data
  });
// 定时刊登
export const updateListingTiming = (data) =>
  request({
    url: '/lms/mercadoListing/updateListingTiming',
    method: 'POST',
    data: data
  });
// 取消定时刊登
export const cancelListingTiming = (data) =>
  request({
    url: '/lms/mercadoListing/cancelListingTiming?idList=' + data,
    method: 'POST'
  });
// 基础商品详情弹窗
export const getTplDetail = (data) =>
  request({
    url: '/lms/prodTpl/getTplDetail.html',
    method: 'POST',
    data: data
  });
// 基础商品详情弹窗-视频
export const queryAliexpressVideoInfo = (data) =>
  request({
    url: '/lms/aliexpressVideo/queryAliexpressVideoInfo',
    method: 'POST',
    data: data
  });
// 基础商品详情弹窗-操作日志
export const getTplOperLog = (data) =>
  request({
    url: '/lms/prodTpl/getTplOperLog.html',
    method: 'POST',
    data: data
  });
// 转待刊登
export const changeToWaitingForListing = (data) =>
  request({
    url: '/lms/mercadoListing/changeToWaitingForListing',
    method: 'POST',
    data: data
  });
// 单个刊登
export const mercadoPublishListingOne = (data) =>
  request({
    url: '/lms/mercadoListing/mercadoPublishListingOne',
    method: 'POST',
    data: data
  });
// mercado 修改重量日志查询
export const mercadoWeightConfigLog = () =>
  request({
    url: '/lms/mercadoListing/mercadoWeightConfigLog',
    method: 'GET'
  });
// mercado 修改重量参数
export const mercadoWeightConfig = (data) =>
  request({
    url: '/lms/mercadoListing/mercadoWeightConfig',
    method: 'POST',
    data: data
  });
// 创建人
export const mercadoCreators = () =>
  request({
    url: '/lms/mercadoListing/mercadoCreators',
    method: 'GET'
  });
