/*
 * @Author: ztao
 * @Date: 2023-03-19 17:34:56
 * @LastEditTime: 2023-03-19 17:35:05
 * @Description:
 */
import request from '@/utils/request';

// 条件查询采购确认
export const queryPageData = (data) =>
  request({
    url: '/lms/whaePurConfirm/queryWhAePurConfirmList',
    method: 'post',
    data
  });

// 采购确认
export const purchaseConfirm = (data) =>
  request({
    url: '/lms/whaePurConfirm/purchaseConfirm',
    method: 'post',
    data
  });

// 编辑采购确认单
export const editPurchaseConfirm = (data) =>
  request({
    url: '/lms/whaePurConfirm/editPurchaseConfirm',
    method: 'post',
    data
  });

// 取消采购确认单
export const cancelAePurConfirm = (data) =>
  request({
    url: '/lms/whaePurConfirm/cancelAePurConfirm',
    method: 'post',
    data
  });

// 销售确认
export const sellerConfirm = (data) =>
  request({
    url: '/lms/whaePurConfirm/sellerConfirm',
    method: 'post',
    data
  });

// 一件采购
export const fastCreatePurOrder = (data) =>
  request({
    url: '/lms/whaePurConfirm/fastCreatePurOrder',
    method: 'post',
    data
  });

// 导出
export const exportSSkuList = (data) =>
  request({
    url: '/lms/whaePurConfirm/exportSSkuList',
    method: 'post',
    data,
    responseType: 'blob',
    needWrongMsg: true
  });

// 查询供应商
export const searchSupplier = (data) =>
  request({
    url: '/lms/prodSupplier/searchSupplier.html',
    method: 'post',
    data,
    needWrongMsg: true
  });
// 转待采购确认
export const turnOffCancelConfirm = (data) =>
  request({
    url: '/lms/whaePurConfirm/turnOffCancelConfirm',
    method: 'post',
    data
  });
