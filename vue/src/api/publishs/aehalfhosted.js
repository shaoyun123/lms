import request from '@/utils/request';
import qs from 'qs';

export const aefullyhostedSearchAjax = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/page',
    method: 'POST',
    data: data
  });

// 枚举值
export const initDataApi = () =>
  request({
    url: '/lms/aliexpressFullmanage/product/init',
    loading: true
  });

//pCateId: 0 ;storeAcctIds: 2030
export const getSmtCateByApi = (data) => {
  return request({
    url: '/lms/smtPublishModelProduct/getSmtCateListByStoreAcctId',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
};

// 获取库存数据
export const getStockListApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/product/list4AdjustStock',
    method: 'POST',
    loading: true,
    data
  });

// 批量修改库存
export const adjustStockBatchApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/product/adjustStockBatch',
    method: 'POST',
    loading: true,
    data
  });

// 批量同步
export const batchSyncApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/product/syncItemList',
    method: 'POST',
    loading: true,
    data
  });

// 批量导出
export const batchExportApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/product/exportList',
    method: 'POST',
    loading: true,
    data
  });

// 查看日志
export const getOnlineLogApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/product/searchOnlineLog',
    method: 'POST',
    loading: true,
    data
  });

// 获取审核失败枚举
export const getAuditFailureTypeEnumApi = () =>
  request({
    url: '/lms/aliexpressFullmanage/product/getAuditFailureTypeEnum',
    loading: true
  });

// 特殊商品类型枚举
export const getSpecialGoodsEnumType = () =>
  request({
    url: '/lms/aliexpressFullmanage/product/enumType',
    method: 'get',
    loading: true
  });

// 获取批量修改特殊商品类型详情
export const getEditSpecialProductTypeInfo = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/product/getEditSpecialProductTypeInfo',
    method: 'POST',
    data
  });

// 提交修改批量修改特殊商品类型
export const editSpecialProductType = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/product/editSpecialProductType',
    method: 'POST',
    data
  });

// 查询区域定价列表
export const getRegionPrice = (data) =>
  request({
    url: `/lms/aliexpressHalfManage/product/regionPrice?productId=${data.productId}`,
    method: 'get'
  });

// 同步更新
export const getProductSyncApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/sync',
    method: 'POST',
    loading: true,
    data
  });

// 查询日志
export const getAEHalfLogApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/log',
    method: 'POST',
    loading: true,
    data
  });

// 获取修改库存弹窗详情列表
export const getBatchGetStockApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/batchGetStock',
    method: 'POST',
    loading: true,
    data
  });

// 批量修改提交
export const batchUpdateStockApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/batchUpdateStock',
    method: 'POST',
    loading: true,
    data
  });

// 修改操作结果
export function getBatchUpdateResultApi(data) {
  return request({
    url: `/lms/aliexpressHalfManage/product/getBatchUpdateResult?batchNo=${data.batchNo}&type=${data.type}`,
    method: 'get',
    loading: true
  });
}

// 查询批量修改库存列表
export const batchGetLogisInfoApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/batchGetLogisInfo',
    method: 'POST',
    loading: true,
    data
  });

// 批量修改库存列表 提交
export const batchUpdateLogisInfoApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/batchUpdateLogisInfo',
    method: 'POST',
    loading: true,
    data
  });

// 查询批量修改价格列表
export const batchGetPriceInfoApi = (data) =>
  request({
    url: '/lms/common/price/searchPriceInfo',
    method: 'POST',
    loading: true,
    data
  });

// 批量提交修改价格
export const batchModifyPriceApi = (data) =>
  request({
    url: `/lms/common/price/batchModifyPrice?platCode=${data.platCode}`,
    method: 'POST',
    loading: true,
    data: data.checkedList
  });

// 查询改价结果
export const getModifyResultApi = (data) => {
  return request({
    url: `/lms/common/price/getModifyResult?batchNo=${data.batchNo}&platCode=${data.platCode}`,
    method: 'get'
  });
};

// 查询AE半托管商品状态枚举
export const getProductStatusEnumApi = () =>
  request({
    url: '/lms/aliexpressHalfManage/product/getProductStatusEnum',
    method: 'get'
  });

// 已加入页签导出查询表头
export const getExportHeaderApi = () =>
  request({
    url: '/lms/aliexpressHalfManage/product/getExportHeader',
    method: 'get'
  });

// 已加入页签导出商品信息
export const exportOnlineSkuApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/exportOnlineSku',
    method: 'POST',
    loading: true,
    data
  });

// 批量修改重量 查询弹窗列表
export const editWeightPageApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/batch/editWeightPage',
    method: 'POST',
    loading: true,
    data
  });

// 批量修改重量 提交
export const editWeightApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/batch/editWeight',
    method: 'POST',
    loading: true,
    data
  });

// 立即加入 获取列表
export const listSelectedInfoApi = (data) =>
  request({
    url: `/lms/aliexpressHalfManage/product/listSelectedInfo/${data.type}`,
    method: 'POST',
    loading: true,
    data: data.params
  });

// 批量立即加入 提交
export const batchSelectSubmitApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/batchSelectSubmit',
    method: 'POST',
    loading: true,
    data
  });

// 半托管批量修改重量 详情
export const aeHalfEditWeightPageApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/editWeightPage',
    method: 'POST',
    loading: true,
    data
  });

// 半托管批量修改重量 提交
export const aeHalfEditWeightApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/editWeight',
    method: 'POST',
    loading: true,
    data
  });

// 查询操作人
export const getAllOperatorApi = () =>
  request({
    url: '/lms/aliexpressHalfManage/product/getAllOperator',
    method: 'GET'
  });

// 查询操作类型
export const getOperateTypeEnumApi = () =>
  request({
    url: '/lms/aliexpressHalfManage/product/getOperTypeEnum',
    method: 'GET'
  });
// 点击一键复制
export const batchCopyList = (data) => {
  return request({
    url: '/lms/aliexpressHalfManage/product/batchCopyList',
    method: 'post',
    data,
    loading: true
  });
};
