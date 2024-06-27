import request from '@/utils/request';
import qs from 'qs';

// 查询店铺
export const getStoreListApi = (data = {}) => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    data: qs.stringify({
      roleNames: 'tiktok专员',
      orgId: data.orgId,
      salePersonId: data.salePersonId,
      platCode: 'tiktok'
    })
  });
};

// 开发专员
export const getDevelopUserListApi = (salePersonId) => {
  return request({
    url: '/lms/aliexpresslisting/listdevelopuser.html',
    method: 'POST',
    data: qs.stringify({ salePersonId })
  });
};

// 枚举值 侵权状态
export const getInitEnumApi = () => {
  return request({
    url: '/lms/tiktok/listing/init'
  });
};

// 查询列表
export const queryPageApi = (data) => {
  return request({
    url: '/lms/tiktok/listing/queryPublishList',
    method: 'POST',
    data
  });
};

export const getLogisAttrEnumApi = (data) => {
  return request({
    url: '/lms/enum/getLogisAttrEnum.html',
    method: 'POST',
    data
  });
};

// 获取今天剩余可刊登数量
export const getTodayPublishCountApi = (params) => {
  return request({
    url: '/lms/tiktok/listing/countTodayPublishAndPendingQuantity',
    method: 'GET',
    params
  });
};

// 生成待刊登信息
export const genListingApi = (data) => {
  return request({
    url: '/lms/tiktok/listing/genListing',
    method: 'POST',
    needWrongMsg: true,
    data
  });
};

// 生成并刊登
export const getListingPublishApi = (data) => {
  return request({
    url: '/lms/tiktok/listing/genListingAndPublish',
    method: 'POST',
    data
  });
};

// 发布商品
export const publishListingApi = (data) => {
  return request({
    url: `/lms/tiktok/listing/publishListing`,
    method: 'post',
    data
  });
};

// 获取类目具体属性
export const getCateInfoApi = (platCateId) => {
  return request({
    url: `/lms/tiktok/listing/getPlatAttrListByPlatCateId?platCateId=${platCateId}`
  });
};

// 修改待刊登详情中输入子sku生成新的子商品
export const generateSkuByProdSSkuApi = (data) => {
  return request({
    url: `/lms/tiktok/listing/generateSkuByProdSSku`,
    method: 'post',
    data: qs.stringify(data)
  });
};

// 保存 编辑详情
export const editListingApi = (data) => {
  return request({
    url: `/lms/tiktok/listing/editListing`,
    method: 'post',
    data
  });
};

/**
 * @description:删除刊登
 * @param {*} data: listingIdList:listingId,deleteGlobalProduct是否删除全球商品
 * @return {*}
 */
export const delListingApi = (listingIdList, deleteGlobalProduct) => {
  return request({
    url: `/lms/tiktok/listing/deleteListing`,
    method: 'post',
    data: qs.stringify({ listingIdList, deleteGlobalProduct })
  });
};

// 批量设置定时刊登
export const listTimingApi = (data) => {
  return request({
    url: `/lms/tiktok/listing/listTiming`,
    method: 'post',
    data
  });
};

// 批量取消定时刊登
export const cancelListTimingApi = (data) => {
  return request({
    url: `/lms/tiktok/listing/cancelListTiming`,
    method: 'post',
    data
  });
};

// 获取尺码表信息
export const getCategoryInfoApi = (categoryId) => {
  return request({
    url: `/lms/tiktok/listing/getCategory?categoryId=${categoryId}`,
    loading: true
  });
};

// 导出美国站点的待刊登数据
export const exportUsApi = (data) => {
  return request({
    url: `/lms/tiktok/listing/exportUs`,
    method: 'post',
    data
  });
};

// 标记成功标签
export const manualMarkingListingApi = (data) => {
  return request({
    url: `/lms/tiktok/listing/manualMarkingListing`,
    method: 'post',
    data
  });
};

// 根据平台code+店铺id 查询水印
export const listByStoreAcctIdAndPlatCode = (data) => {
  return request({
    url: `/lms/plat/platWatermark/listByStoreAcctIdAndPlatCode`,
    method: 'post',
    loading: true,
    data
  });
};

// 批量首图加水印
export const batchFirstImageAddWatermark = (data) => {
  return request({
    url: `/lms/tiktok/product/batchFirstImageAddWatermark`,
    method: 'post',
    loading: true,
    data
  });
};
