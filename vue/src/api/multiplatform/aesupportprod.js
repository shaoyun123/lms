/*
 * @Author: ztao
 * @Date: 2023-03-19 17:34:19
 * @LastEditTime: 2023-03-19 17:34:34
 * @Description:
 */
import request from '@/utils/request';
// 查询
export const getProducts = (data) =>
  request({
    url: '/lms/whaeProduct/getProducts',
    method: 'POST',
    data
  });
// 更新表格数据
export const updateProduct = (data) =>
  request({
    url: '/lms/whaeProduct/updateProduct',
    method: 'POST',
    data
  });
// 更新表格数据
export const exportBarCodePDF = (data) =>
  request({
    url: '/lms/whaeProduct/exportBarCodePDF',
    method: 'POST',
    data
  });
// 另一个标签
export const getLabelList = () => {
  return request({
    url: '/lms/sysdict/getBizDictByCode?headCode=WH_AE_PRODUCT_LABEL',
    method: 'POST'
  });
};
// 删除
export const deleteProduct = (data) => {
  return request({
    url: '/lms/whaeProduct/deleteProduct?id=' + data,
    method: 'DELETE'
  });
};

// // 导入
// export const importAEProducts = (data) =>
//   request({
//     url: '/lms/whaeProduct/importAEProducts',
//     method: 'POST',
//     data
//   });

//  enableUser = {};//在职人员
//  purchasingAgentList = {};//采购专员
//  preprodDevList = {};//开发专员
//  intergationList = {};//整合人员
export const getSysUserList = () =>
  request({
    url: '/lms/msgPreprodBuyer/getSysUserList.html',
    method: 'POST'
  });

// 销售员
export const getPersonAndOrgsByRole = (data) =>
  request({
    url: '/lms/sys/getPersonAndOrgsByRole.html',
    method: 'POST',
    data
  });

// //   供应商
// export const searchSupplier = (data) =>
//   request({
//     url: '/lms/prodSupplier/searchSupplier.html',
//     method: 'POST',
//     data
//   });

// 批量获取标题和描述
export const batchGetTitleAndDetail = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/product/batchGetTitleAndDetail',
    loading: true,
    method: 'post',
    data
  });
};

// 批量修改标题
export const batchEditTitle = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/product/batchEditTitle',
    loading: true,
    method: 'post',
    data
  });
};

// 批量修改描述
export const batchEditTDetail = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/product/batchEditDetail',
    loading: true,
    method: 'post',
    data
  });
};

// 查询修改标题、修改描述、欧盟责任人、商品资质的结果
export function getBatchResult(data) {
  return request({
    method: 'GET',
    url: `/lms/aliexpressFullmanage/product/getBatchResult?batchNo=${data.batchNo}&type=${data.type}`
  });
}

// 获取欧盟责任人枚举
export function getEUCategory(data) {
  return request({
    method: 'GET',
    loading: true,
    url: `/lms/aliexpressFullmanage/category?storeAcctId=${data.storeAcctId}`
  });
}

// 同步
export function synchronizationEU(data) {
  return request({
    method: 'post',
    loading: true,
    url: `/lms/aliexpressFullmanage/category/syncEuResponsible?storeAcctId=${data.storeAcctId}`,
    data: data.leafCategoryIdList
  });
}

// 获取欧盟责任人列表
export const batchGetMsrEuList = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/product/batchGetMsrEu',
    loading: true,
    method: 'post',
    data
  });
};

// 批量修改欧盟责任人
export const batchEditMsrEu = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/product/batchEditMsrEu',
    loading: true,
    method: 'post',
    data
  });
};

// 查询欧盟资质信息
export const getQualificationsInfo = (data) => {
  return request({
    url: `/lms/aliexpress/category/getQualificationsByStoreAcctIdAndCategoryId?categoryId=${data.categoryId}&storeAcctId=${data.storeAcctId}`,
    loading: true,
    method: 'post',
    data
  });
};

// 修改商品资质信息
export const batchEditQualifications = (data) => {
  return request({
    url: '/lms/aliexpressFullmanage/product/batchEditQualifications',
    loading: true,
    method: 'post',
    data
  });
};

// 修改商品资质默认图
export const getDefaultQualificationImage = (data) => {
  return request({
    url: '/lms/aliexpressFullManageQualifications/getDefaultQualificationImage',
    loading: true,
    method: 'post',
    data
  });
};
