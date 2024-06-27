/*
 * @Author: Cisy.Wang
 * @Date: 2022-11-11 10:23:52
 * @LastEditTime: 2023-05-25 11:38:09
 * @Description:
 */
import request from '@/utils/request';

// 商品标签
export const listdict = () => {
  let formData = new FormData();
  formData.append('headCode', 'prod_tag');
  return request({
    url: '/lms/sys/listdict.html',
    method: 'POST',
    data: formData
  });
};
// 另一个标签
export const getLabelList = () => {
  return request({
    url: '/lms/sysdict/getBizDictByCode?headCode=TEMU_ITEM_MANAGE_LABEL',
    method: 'POST'
  });
};
// 导入货件计划
export const importPlatWhShipment = (data) => {
  return request({
    url: '/lms/temu/fbm/importPlatWhShipment',
    method: 'POST',
    data: data
  });
};
// 根据店铺和打印编码查询商品
export const queryByPrintCodesForPlatWhShipment = (data) => {
  return request({
    url: '/lms/temu/fbm/queryByPrintCodesForPlatWhShipment',
    method: 'POST',
    data: data
  });
};
// 创建货件计划
export const savePlatWhShipment = (data) => {
  return request({
    url: '/lms/temu/fbm/savePlatWhShipment',
    method: 'POST',
    data: data
  });
};
// 搜索
export const searchItem = (data) => {
  return request({
    url: '/lms/temu/fbm/searchItem',
    method: 'POST',
    data: data
  });
};
// 销售状态
export const batchUpdateSaleStatus = (data) => {
  return request({
    url: '/lms/temu/fbm/batchUpdateSaleStatus',
    method: 'POST',
    data: data
  });
};
// 设置标签
export const batchUpdateLabelName = (data) => {
  return request({
    url: '/lms/temu/fbm/batchUpdateLabelName',
    method: 'POST',
    data: data
  });
};
// 包装备注
export const batchUpdatePackDesc = (data) => {
  return request({
    url: '/lms/temu/fbm/batchUpdatePackDesc',
    method: 'POST',
    data: data
  });
};
// 获取收货地址
export const getAddress = (data) => {
  return request({
    url: '/lms/PlatWh/searchPlatWhReceiveAddress',
    method: 'POST',
    data
  });
};

// 获取站点信息
export const getSite = (params) => {
  return request({
    url: '/lms/salesplat/getSalesSiteByPlatCode',
    method: 'get',
    params
  });
};

// 删除商品
export const deleteItem = (data) => {
  return request({
    url: '/lms/temu/fbm/deleteItem',
    method: 'post',
    data
  });
};

// 删除水洗唛
export const deleteWaterMark = (data) => {
  return request({
    url: '/lms/temu/fbm/deleteWateringMark',
    method: 'post',
    data
  });
};

// 删除英文标签
export const deleteEnglishLabel = (data) => {
  return request({
    url: '/lms/temu/fbm/deleteEnglishLabel',
    method: 'post',
    data
  });
};

// 导出商品
export const exportItem = (data) => {
  return request({
    url: '/lms/temu/fbm/exportSelectedItem',
    method: 'post',
    data,
    responseType: 'blob',
    needWrongMsg: true
  });
};

// 申请备货
export const applyQuantity = (data) => {
  return request({
    url: '/lms/temu/fbm/batchApplyPurchaseQuantity',
    method: 'post',
    data
  });
};

// 修改单个销售备注
export const updateSalespersonRemarkApi = (data) => {
  return request({
    url: '/lms/temu/fbm/updateSalespersonRemark',
    method: 'post',
    data
  });
};

// 查询商品销量
export const getSalesCountApi = (params) => {
  return request({
    url: '/lms/temu/fbm/getSalesCount',
    method: 'get',
    params
  });
};

// 查询导出表头数据
export const getExportHeader = (params) => {
  return request({
    url: '/lms/temu/fbm/getExportHeader',
    method: 'get',
    params
  });
};

// 查询日志
export const getBySellerSkuApi = (data) => {
  return request({
    url: '/lms/temu/fbm/log/getBySellerSku',
    method: 'post',
    data
  });
};

// 打印食品标签
export const setPrintFoodLabelApi = (data) => {
  return request({
    url: '/lms/temu/cats/setPrintFoodLabel',
    method: 'post',
    data
  });
};

// 申请采购备货
export const listByStockUpApi = (data) => {
  return request({
    url: '/lms/temu/fbm/listByStockUp',
    method: 'post',
    data
  });
};

// 提交采购备货
export const saveOrderApi = (data) => {
  return request({
    url: '/lms/temu/fbm/saveOrder',
    method: 'post',
    data
  });
};
