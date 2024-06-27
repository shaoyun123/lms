import request from '@/utils/request';
import qs from 'qs';

// 查询
export function queryMiraviaProduct(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/listOnlineProduct',
    method: 'POST',
    data: data
  });
}

export function getPersonAndOrgsByRole(data) {
  return request({
    url: '/lms/sys/getPersonAndOrgsByRole.html',
    method: 'POST',
    data: qs.stringify(data)
  });
}

// 查询导出表头数据
export const getExportHeader = () => {
  return request({
    url: '/lms/miraviaOnlineProduct/getExportPropertiesEnum',
    method: 'get',
    loading: true
  });
};

export function getPlatCategoryTreeApi(data) {
  return request({
    url: `lms/prodcate/getPlatCategoryTree?code=${data.platCode}`,
    method: 'get'
  });
}

export function adjustStockBatchApi(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/adjustStockBatch',
    method: 'POST',
    data
  });
}
// 批量同步接口
export function batchSyncApi(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/syncItemList',
    method: 'POST',
    data
  });
}

// 批量导出接口
export function batchExportApi(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/exportSelectedItem',
    method: 'POST',
    data
  });
}

// 查看日志
export function listListingOperationLog(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/listListingOperationLog',
    method: 'POST',
    data
  });
}

// 批量上架
export function batchSetOnlineApi(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/batchSetOnline',
    method: 'POST',
    data,
    loading: true
  });
}

// 批量下架
export function batchSetOfflineApi(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/batchSetOffline',
    method: 'POST',
    data,
    loading: true
  });
}

// 导出失败原因
export function exportFailLogByBatchNo(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/exportFailLogByBatchNo',
    method: 'POST',
    data
  });
}

// 查询批量调价商品
export const batchModifyPriceQuery = (data) => {
  return request({
    url: '/lms/miraviaOnlineProduct/batchModifyPriceQuery',
    method: 'post',
    data
  });
};

// 提交批量调价
export const batchModifyPriceSubmit = (data) => {
  return request({
    url: '/lms/miraviaOnlineProduct/batchModifyPrice',
    method: 'post',
    data
  });
};

// 提交之后 查询操作结果
export function getAdjustPriceLogByBatchNo(batchNo) {
  return request({
    url:
      `/lms/miraviaOnlineProduct/getAdjustPriceLogByBatchNo?batchNo=` + batchNo,
    method: 'get'
  });
}

// 搜索条件 获取物流属性option
export function getListHazmatOptionsApi() {
  return request({
    url: '/lms/enums/listHazmatOptions',
    method: 'get'
  });
}

// 获取商品标签option
export function getProdsTagsOptionsApi() {
  return request({
    url: '/lms/product/getProdTags.html',
    method: 'get'
  });
}

// 查询批量修改物流属性 勾选的数据列表详情
export function getHazmatDetail(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/editHazmatPage',
    method: 'post',
    data
  });
}

// 批量修改物流属性 保存
export function submitHazmatDetail(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/editHazmat',
    method: 'post',
    data
  });
}

// 批量查询勾选标题/描述信息
export function batchQueryBasicInfo(data) {
  return request({
    url: `/lms/miraviaOnlineProduct/batchQueryBasicInfo?type=` + data.type,
    method: 'post',
    data: data.params
  });
}

// 批量保存勾选标题/描述信息
export function batchModifyBasicInfo(data) {
  return request({
    url: `/lms/miraviaOnlineProduct/batchModifyBasicInfo?type=` + data.type,
    method: 'post',
    data: data.params
  });
}

// 查询修改标题结果
export function getBatchModifyBasicResult(data) {
  return request({
    url: `/lms/miraviaOnlineProduct/getBatchModifyBasicInfo?type=${data.type}&batchNo=${data.batchNo}`,
    method: 'get'
  });
}

// 批量重新生成标题
export function batchGetProductTitle(data) {
  return request({
    url: '/lms/miraviaListing/batchGetProductTitle',
    method: 'post',
    data
  });
}

// 批量修改图片详情
export function batcheditPictureDetail(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/editPicturePage',
    method: 'post',
    data
  });
}

// 批量修改图片提交
export function batcheditPictureSubmit(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/editPicture',
    method: 'post',
    data
  });
}

/**
 * 批量修改变种信息
 * */

// 获取批量变种信息
export function batchQueryVariantInfo(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/batchQueryVariantInfo',
    method: 'post',
    data
  });
}

// 提交保存批量变种信息
export function batchModifyVariantInfo(data) {
  return request({
    url: '/lms/miraviaOnlineProduct/batchModifyVariantInfo',
    method: 'post',
    data
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

// 新增变种
export const addProdSSkuInfosApi = (data) =>
  request({
    url: '/lms/miraviaOnlineProduct/addProdSSkuInfos',
    data,
    loading: true,
    method: 'post'
  });

// 上传视频
export const uploadVideoApi = (data) =>
  request({
    url: '/lms/miraviaOnlineProduct/batchUploadVideo',
    data,
    loading: true,
    method: 'post'
  });

// 查询批量修改同步列表数据
export const batchUpdateStockPageApi = (data) =>
  request({
    url: '/lms/miraviaOnlineProduct/batchUpdateStockPage',
    data,
    loading: true,
    method: 'post'
  });

// 获取listing标签
export function getMiraviaListingTagApi() {
  return request({
    url: '/lms/sysdict/getMiraviaListingTag',
    method: 'get'
  });
}

// 保存listing标签修改
export const batchUpdateMiraviaListingTagApi = (data) =>
  request({
    url: '/lms/miravia/product/tag/save',
    data,
    loading: true,
    method: 'post'
  });

// 获取miravia 平台下架原因枚举
export const getListByBizTypeApi = (data) =>
  request({
    url: `/lms/dynamicEnum/listByBizType?bizType=${data.bizType}`,
    method: 'get'
  });
