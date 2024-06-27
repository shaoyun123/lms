/*
 * @Author: Cisy.Wang
 * @Date: 2022-11-16 14:34:07
 * @LastEditTime: 2023-03-19 16:28:22
 * @Description:
 */
import request from '@/utils/request';

// 搜索
export const searchItem = (data) => {
  return request({
    url: '/lms/shopee/sbsItem/queryShopeeSbsItemDto',
    method: 'POST',
    data: data
  });
};

// 模板下载
export const downloadTemp = (fileName) => {
  return request({
    url:
      '/lms/shopee/file/template/downloadShopeeExcelTemplateByFileName?fileName=' +
      fileName,
    method: 'get'
  });
};

// 修改标签
export const updateLabelName = (data) => {
  return request({
    url: '/lms/shopee/sbsItem/updateLabel',
    method: 'post',
    data
  });
};

// 修改销售状态
export const updateSaleStatus = (data) => {
  return request({
    url: '/lms/shopee/sbsItem/updateSaleStatus',
    method: 'post',
    data
  });
};

// 修改包装备注
export const updatePackDesc = (data) => {
  return request({
    url: '/lms/shopee/sbsItem/updatePackDesc',
    method: 'post',
    data
  });
};

// 创建货件计划
export const createShipment = (data) => {
  return request({
    url: '/lms/shopee/sbsItem/createPlatWhShipment',
    method: 'post',
    data
  });
};

// 新增商品
export const addSku = (data) => {
  return request({
    url: '/lms/shopee/sbsItem/lsit4CreatePlatWhShipment',
    method: 'post',
    data
  });
};

// 获取 shopee 站点
export const getOnlineEnum = (data) => {
  return request({
    url: '/lms/shopee/onlineProductShopee/getShopeeOnlineEnum.html',
    method: 'post',
    data
  });
};
