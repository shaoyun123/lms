import request from '@/utils/request';
import qs from 'qs';
// 获取图片--公共
export const getOriginImageApi = (data) => {
  return request({
    url: '/lms/prodTpl/getTemplateImagesForNewUI',
    method: 'POST',
    data: data
  });
};
// 将base64转为图片链接
export const transferBase64 = (data) => {
  return request({
    url: '/lms/imageProcess/imageTranslateByBase64',
    method: 'POST',
    data: data
  });
};
// 上传图片
export const tansferImageApi = (data) => {
  return request({
    url: '/lms/prodTpl/uploadPicV2',
    method: 'POST',
    data: data
  });
};
// 生成店铺商品
export const generateStoreProduct = (data) =>
  request({
    url: `/lms/shein/publish/generateStoreProduct?prodPId=${data.prodPId}&storeAcctId=${data.storeAcctId}&isMall=false`,
    method: 'POST'
  });
// 生成店铺商品--查看详情
export const getDetailInfo = (listingId) =>
  request({
    url: `/lms/sheinSelfListing/getDetailInfo?listingId=${listingId}`,
    method: 'POST'
  });
// 生成店铺商品--保存
export const saveStoreProduct = (data) =>
  request({
    url: '/lms/shein/publish/saveStoreProduct',
    method: 'POST',
    data: data
  });
// 选择分类
export const getSheinCateList = (data) =>
  request({
    url: '/lms/shein/common/getSheinCateList',
    method: 'POST',
    params: data
  });
// 类目属性和规格查询
export const getCateAttrAndValues = (data) =>
  request({
    url: '/lms/shein/common/getCateAttrAndValues',
    method: 'POST',
    params: data
  });
// 查询
export const queryProdList = (data) =>
  request({
    url: '/lms/sheinSelfListing/querySelfProdList',
    method: 'POST',
    data: data
  });
// 立即刊登
export const publishNows = (data) =>
  request({
    url: '/lms/shein/publish/publishNow',
    method: 'POST',
    params: data
  });
// 定时刊登&重新发布
export const timingPublish = (data) =>
  request({
    url: '/lms/shein/publish/timingPublish',
    method: 'POST',
    params: data
  });
// 取消定时刊登
export const cancelListTiming = (data) =>
  request({
    url: '/lms/shein/publish/cancelListTiming',
    method: 'POST',
    params: data
  });
// 删除店铺商品
export const deleteStoreProducts = (data) =>
  request({
    url: '/lms/sheinSelfListing/deleteStoreProducts',
    method: 'POST',
    params: data
  });
// 获取品牌
export const getStoreBrandList = (data) =>
  request({
    url: '/lms/shein/common/getStoreBrandList',
    method: 'POST',
    params: data
  });

// 获取图片--公共--fba
export const getOriginFbaImageApi = (data) => {
  return request({
    url: '/lms/shein/publish/getFbaImgeUrl',
    method: 'POST',
    data: qs.stringify(data)
  });
};
// 同步类目
export const syncSheinCate = (storeAcctId) => {
  return request({
    url: `/lms/sheinSelfListing/syncSheinCate?storeAcctId=${storeAcctId}&isMall=false`,
    method: 'POST'
  });
};

// 新增或更新标签
export const saveOrUpdateLables = (data) => {
  return request({
    url: '/lms/sheinSelfListing/saveOrUpdateLables',
    method: 'POST',
    data
  });
};
// 获取标签
export const getLablesById = () => {
  return request({
    url: '/lms/sheinSelfListing/getLablesById',
    method: 'GET'
  });
};
// 提交人
export const getListingLimitUserList = () => {
  return request({
    url: '/lms/sheinSelfListing/getListingLimitUserList',
    method: 'GET'
  });
};
// 根据店铺，获取店铺可用额度
export const getStoreAcctListingLimit = (storeAcctId) => {
  return request({
    url: '/lms/sheinSelfListing/getStoreAcctListingLimit/' + storeAcctId,
    method: 'GET'
  });
};
