import request from '@/utils/request';
import qs from 'qs';

export const aefullyhostedSearchAjax = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/product/list',
    method: 'POST',
    loading: true,
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

// 获取导出列表可选字段
export const getExportHeader = () =>
  request({
    url: '/lms/aliexpressFullmanage/product/getExportHeader',
    method: 'GET'
  });

// // 导出列表
// export const exportList = (data) =>
//   request({
//     url: '/lms/aliexpressFullmanage/product/exportList',
//     method: 'POST',
//     data
//   });
// 已保存的配置列表
export const searchConditionConfigList = (data) =>
  request({
    url: '/lms/common/searchConditionConfig/list',
    method: 'POST',
    data
  });
// 保存配置信息
export const searchConditionConfigNew = (data) =>
  request({
    url: '/lms/common/searchConditionConfig/new',
    method: 'POST',
    data
  });
// 删除配置信息
export const searchConditionConfigDel = (id) =>
  request({
    url: '/lms/common/searchConditionConfig/delete/' + id,
    method: 'DELETE'
  });

// 批量预约加入查详情
export const listPreSelectedInfoApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/listPreSelectedInfo',
    method: 'POST',
    loading: true,
    data
  });

// 批量预约 点击提交
export const batchPreSelectSubmitApi = (data) =>
  request({
    url: '/lms/aliexpressHalfManage/product/batchPreSelectSubmit',
    method: 'POST',
    loading: true,
    data
  });

// 获取预约加入操作结果
export const getBatchUpdateResultApi = (data) =>
  request({
    url: `/lms/aliexpressHalfManage/product/getBatchUpdateResult?batchNo=${data.batchNo}&type=${data.type} `,
    method: 'GET'
  });

// 查询操作人
export const getAllOperatorApi = () =>
  request({
    url: '/lms/aliexpressFullmanage/product/getAllOperator',
    method: 'GET'
  });

// 查询操作类型
export const getOperateTypeEnumApi = () =>
  request({
    url: '/lms/aliexpressFullmanage/product/getOperTypeEnum',
    method: 'GET'
  });

// 查询
export const searchOnlineLogApi = (data) =>
  request({
    url: '/lms/aliexpressFullmanage/product/searchOnlineLog',
    method: 'POST',
    loading: true,
    data
  });

// 点击一键复制
export const batchCopyList = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/product/batchCopyList',
    method: 'post',
    data,
    loading: true
  });
};
