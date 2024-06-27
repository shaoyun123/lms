import request from '@/utils/request';
import qs from 'qs';

// 开发专员
export const getBizzOwnerList = (salePersonId) =>
  request({
    url: '/lms/aliexpresslisting/listdevelopuser.html',
    method: 'POST',
    loading: true,
    data: { salePersonId }
  });
export const getListingCreatorApi = () =>
  request({
    url: '/lms/aliexpressFullmanage/listing/listCreator',
    loading: true
  });

// 查询列表
export const queryListApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/queryList',
    method: 'POST',
    loading: true,
    data
  });
// 修改销售信息
//prodPId: 231400
// saleNote:
export const updateSalenoteApi = (data) =>
  request({
    url: '/lms/aliexpresslisting/updatesalenote.html',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
// 编辑销售信息
// 刊登信息查询详情
// aliexpressTplId
// prodListingId
// storeAcctId
export const getInfoApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/getPublishInfo',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });

// 标题随机
export const getRandomTitleApi = (prodPId) =>
  request({
    url: `/lms/aliexpress/template/regentitle.html?prodPId=${prodPId}`,
    loading: true
  });

// 获取类目属性
export const getCateAttrApi = (data) =>
  request({
    url: `/lms/aliexpress/template/listcateattr.html?smtCategoryId=${data.smtCategoryId}&storeAcctId=${data.storeAcctId}`,
    loading: true
  });

// 同步品牌
export const syncBrandAttrApi = (data) =>
  request({
    url: `/lms/aliexpress/template/manualSyncCategoryBrand.html?smtCategoryId=${data.smtCategoryId}&storeAcctId=${data.storeAcctId}&productType=${data.productType}`,
    loading: true
  });

// 估算价格
export const calculatePriceApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/calculatePrice',
    method: 'POST',
    loading: true,
    data
  });

// 保存
export const savePublishInfoApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/savePublishInfo',
    method: 'POST',
    loading: true,
    data
  });

// 保存并发布
export const saveAndPublishListingApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/saveAndPublishListing',
    method: 'POST',
    loading: true,
    data
  });

// 删除
export const delPublishInfoApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/delete',
    method: 'POST',
    loading: true,
    data
  });
// 立即刊登
export const publishNowApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/publishListing',
    method: 'POST',
    loading: true,
    data
  });

// 定时刊登
export const timingPublishApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/timingPublish',
    method: 'POST',
    loading: true,
    data
  });
// 取消定时刊登
export const cancelTimingPublishNowApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/cancelTimingPublish',
    method: 'POST',
    loading: true,
    data
  });

//信息模块同步
// storeAcctId, isSync
export const listdetailmoduleApi = (data) =>
  request({
    url: `/lms/aliexpress/publish/listdetailmodule.html?storeAcctId=${data.storeAcctId}&isSync=${data.isSync}`,
    loading: true
  });

// 上传图片，控制大小
export const uploadSizeApi = (data) => {
  return request({
    url: '/lms/publish/smt/uploadPic',
    method: 'POST',
    loading: true,
    data
  });
};

// 视频中心模块
// 基础商品详情弹窗-视频
export const queryAliexpressVideoInfo = (data) =>
  request({
    url: '/lms/aliexpressVideo/queryAliexpressVideoInfo',
    method: 'POST',
    data: data
  });
// 从媒体中心查询视频
export const searchVideo = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/listing/searchVideo',
    method: 'POST',
    loading: true,
    data
  });
};
// 获取媒体中心的信息
export const getMediaCenterInfo = (storeAcctId) => {
  return request({
    url: `/lms/aliexpressFullmanage/listing/getMediaCenterInfo/${storeAcctId}`,
    method: 'GET',
    loading: true
  });
};

// 一键添加sku
export const aePublishAddSkuApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/addSku',
    method: 'POST',
    loading: true,
    data
  });

// 批量去*核查
export const removeSkuStarCheckApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/removeSkuStarCheck',
    method: 'POST',
    loading: true,
    data
  });

// 批量去*
export const removeSkuStarApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/listing/removeSkuStar',
    method: 'POST',
    loading: true,
    data
  });

// 获取商品资质
export const getQualificationsByStoreAcctIdAndCategoryId = (data) =>
  request({
    url:
      '/lms/aliexpress/category/getQualificationsByStoreAcctIdAndCategoryId?categoryId=' +
      data.categoryId +
      '&storeAcctId=' +
      data.storeAcctId,
    method: 'POST',
    loading: true
  });
// 获取商品资质
export const syncOneEuResponsibleByStoreAcctIdAndCategoryId = (data) =>
  request({
    url:
      '/lms/aliexpressFullmanage/category/syncOneEuResponsibleByStoreAcctIdAndCategoryId?categoryId=' +
      data.categoryId +
      '&storeAcctId=' +
      data.storeAcctId,
    method: 'POST',
    loading: true
  });

// 修改商品资质默认图
export const getDefaultQualificationImage = (data) => {
  return request({
    url: '/lms/aliexpressFullManageQualifications/getDefaultQualificationImage',
    loading: true,
    method: 'post',
    data
  });
};

// 获取欧盟责任人
export const getListEuResponsiblePersonsByStoreAcctIdsApi = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/category/getByStoreAcctIds',
    loading: true,
    method: 'post',
    data
  });
};

// 同步
export const syncOneEuResponsibleByStoreAcctIdAndCategoryIdApi = (data) => {
  return request({
    url: `/lms/aliexpressFullmanage/category/syncOneEuResponsibleByStoreAcctIdAndCategoryId?categoryId=${data.categoryId}&storeAcctId=${data.storeAcctId}`,
    loading: true,
    method: 'post'
  });
};

// 批量生成 立即刊登
export const batchSaveOrPublishListingApi = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/listing/batchSaveOrPublishListing',
    loading: true,
    method: 'post',
    data
  });
};
