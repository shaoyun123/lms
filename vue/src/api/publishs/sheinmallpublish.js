import request from '@/utils/request';
import qs from 'qs';
// 生成店铺商品
export const generateStoreProduct = (data) =>
  request({
    url: `/lms/shein/publish/generateStoreProduct?prodPId=${data.prodPId}&storeAcctId=${data.storeAcctId}`,
    method: 'POST'
  });
// 生成店铺商品--查看详情
export const getDetailInfo = (listingId) =>
  request({
    url: `/lms/shein/publish/getDetailInfo?listingId=${listingId}`,
    method: 'POST'
  });

// 获取商品数量
export const getProductCountApi = (data) =>
  request({
    url: '/lms/shein/listing/countAll',
    method: 'POST',
    data: data
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
    url: '/lms/shein/listing/list',
    method: 'POST',
    data: data
  });
// 类目同步
export const syncCateApi = (data) =>
  request({
    url: '/lms/shein/publish/syncSheinMallCate',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
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
    url: '/lms/shein/publish/deleteStoreProducts',
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

//查看参考信息是否需要必填
export const getFillInStandardApi = (storeAcctId) =>
  request({
    url: `/lms/shein/publish/queryPublishFillInStandard/${storeAcctId}`
  });
