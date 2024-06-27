import request from '@/utils/request';

// 列表查询
export const searchPageApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/searchPage',
    method: 'POST',
    data
  });

// 下载备货需求模板
export const downloadExcelTemplatApi = () =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/downloadExcelTemplat',
    method: 'get',
    loading: true
  });

// 导入备货需求
export const importOrderByExcelApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/importOrderByExcel',
    method: 'POST',
    loading: true,
    data
  });

// 获取平台下拉
export const getSupportPlatApi = () =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/getSupportPlat',
    method: 'get'
  });

// 获取所有tab的列表条数
export const getSearchTabCountApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/getSearchTabCount',
    method: 'post',
    data
  });

// 导出
export const exportExcelApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/exportExcel',
    method: 'post',
    data
  });

// 日志
export const platStockUpOrderLogApi = (data) =>
  request({
    url: `/lms/PlatWh/PlatStockUpOrder/log/page/${data.orderId}`,
    method: 'post',
    data: data.page
  });

// 取消采购单
export const cancelOrderApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/cancelOrder',
    method: 'post',
    data,
    loading: true
  });

// 销售确认
export const salespersonConfirmApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/salespersonConfirm',
    method: 'post',
    data,
    loading: true
  });

// 销售确认采购
export const buyerConfirmApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/buyerConfirm',
    method: 'post',
    data,
    loading: true
  });

// 删除备货单
export const deleteOrderApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/deleteOrder',
    method: 'post',
    data,
    loading: true
  });

// 修改采购单
export const updateOrderApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/updateOrder',
    method: 'post',
    data,
    loading: true
  });

// 获取调拨采购列表
export const searchTransferAndPurOrderApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/searchTransferAndPurOrder',
    method: 'post',
    data,
    loading: true
  });

// 提交调拨数据
export const transferAndPurOrderApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/transferAndPurOrder',
    method: 'post',
    data,
    loading: true
  });

// 转代采购确认
export const cancelToBuyerConfirm = (data) =>
  request({
    url: '/lms/PlatWh/PlatStockUpOrder/cancelToBuyerConfirm',
    method: 'post',
    data,
    loading: true
  });
