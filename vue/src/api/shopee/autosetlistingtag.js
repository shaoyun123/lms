import request from '@/utils/request';
import qs from 'qs';

// 页面查询
export function queryPageApi(data) {
  return request({
    url: '/lms/shopee/shopeeIsEnableProduct/listAllListingTagAutoSetConfig',
    method: 'post',
    loading: true,
    data
  });
}

// 保存、更新 单个标签配置
export function saveApi(data) {
  return request({
    url: '/lms/shopee/shopeeIsEnableProduct/saveOneListingTagAutoSetConfig',
    method: 'post',
    loading: true,
    data
  });
}

// shopee listing标签
export function getShopeeListingTagApi() {
  return request({
    url: '/lms/sysdict/getShopeeListingTag',
    loading: true
  });
}

// 自动标签相关类型枚举
export function getConfigEnumsApi() {
  return request({
    url: '/lms/shopee/shopeeIsEnableProduct/listingTagAutoSetConfigEnums',
    loading: true
  });
}

// 不处理类型
export function getprodFilterListingTypeApi() {
  return request({
    url: '/lms/shopee/shopeeIsEnableProduct/getProdFilterListingType',
    loading: true
  });
}

// 发开通知类型
export function getDevelopDictApi() {
  return request({
    url: '/lms/msgDevelopmentNotice/getDevelopDict.html',
    loading: true
  });
}

// 批量移除自动标签配置
export function batchRemoveApi(data) {
  return request({
    url: '/lms/shopee/shopeeIsEnableProduct/batchDeleteListingTagAutoConfig',
    loading: true,
    method: 'post',
    data
  });
}

// 批量开启自动标签配置
export function batchOnApi(data) {
  return request({
    url: '/lms/shopee/shopeeIsEnableProduct/batchEnableListingTagAutoConfig',
    loading: true,
    method: 'post',
    data
  });
}

// 批量关闭自动标签配置
export function batchCloseApi(data) {
  return request({
    url: '/lms/shopee/shopeeIsEnableProduct/batchCloseListingTagAutoConfig',
    loading: true,
    method: 'post',
    data
  });
}

//  自动标签配置处理在线listing
export function onlineProductsAutoSetTagApi(data) {
  return request({
    url: '/lms/shopee/shopeeIsEnableProduct/handlerOnlineProductsAutoSetTag',
    loading: true,
    method: 'post',
    data
  });
}

//  查询店铺
export function getCheckedStoreApi(data) {
  return request({
    url: '/lms/shopee/shopeeIsEnableProduct/listListingTagAutoSetShopByConfigId',
    loading: true,
    method: 'post',
    data: qs.stringify(data)
  });
}
