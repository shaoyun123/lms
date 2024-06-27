import request from '@/utils/request';

export const getOrderAllWareHouse = () =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/getOrderAllWareHouse',
    method: 'get'
  });

export const getOutboundOrderNo = () =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/queryLast6MonthOutboundOrderNo',
    method: 'get'
  });

export const queryProdUnsoldStockCleanProcess = (data) =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/queryProdUnsoldStockCleanProcess',
    method: 'post',
    data: data,
    loading: true
  });

// 采购处理
export const purchaseDeal = (data) =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/purchaseDeal',
    method: 'post',
    data: data,
    loading: true
  });

// 采购处理批量
export const purchaseDealBatch = (data) =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/purchaseBatchDeal',
    method: 'post',
    data: data,
    loading: true
  });

// 审核
export const auditProcess = (data) =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/auditProcess',
    method: 'post',
    data: data,
    loading: true
  });

// 删除
export const deleteProcess = (data) =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/batchDeleteProcess',
    method: 'post',
    data: data,
    loading: true
  });

// 创建出库单
export const createOutboundOrder = (data) =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/batchCreatePurOtherStorageOut',
    method: 'post',
    data: data,
    loading: true
  });

// 调整折扣
export const changeDiscount = (data) =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/changeDiscount',
    method: 'post',
    data: data,
    loading: true
  });

// 清空出库单
export const cleanOutboundOrderNo = (data) =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/cleanOutboundOrderNo',
    method: 'post',
    data: data,
    loading: true
  });

// 获取采购专员
export const queryPurchasingAgentList = () =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/queryPurchasingAgentList',
    method: 'get'
  });

// 获取跟单专员
export const queryFollowOrderUserList = () =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/queryFollowOrderUserList',
    method: 'get'
  });

// 获取清仓方式
export const queryCleanStockWayEnum = () =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/queryCleanStockWayEnum',
    method: 'get'
  });

// 获取供应商
export const querySupplierList = (data) =>
  request({
    url: '/lms/prodSupplier/searchSupplier.html',
    method: 'post',
    data,
    needWrongMsg: true
  });
