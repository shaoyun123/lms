import request from '@/utils/request';
import qs from 'qs';

export function queryStoreListApi(data) {
  return request({
    url: '/lms/salesplatnew/salesPlatAccountDtoPage.html',
    method: 'post',
    data: qs.stringify(data),
    loading: true
  });
}

export function getPersonAndOrgApi(params) {
  return request({
    url: '/lms/sys/getPersonAndOrg',
    method: 'get',
    params
  });
}

export function getPersonAndOrgNewApi(data) {
  return request({
    url: '/lms/sys/listuserbyrole.html',
    method: 'post',
    data: qs.stringify(data)
  });
}

export function getStoreListApi(params) {
  return request({
    url: '/lms/sys/orderliststorebyplatcode.html',
    method: 'get',
    params
  });
}

export function getStoreListByOrgApi(data) {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'post',
    data: qs.stringify(data)
  });
}

export function updateStoreApi(data) {
  return request({
    url: '/lms/salesplatnew/updateSalesInfo.html',
    method: 'post',
    data: qs.stringify(data),
    loading: true
  });
}

export function createStoreApi(data) {
  return request({
    url: '/lms/salesplatnew/addSalesInfo.html',
    method: 'post',
    data: qs.stringify(data),
    loading: true
  });
}

export function getStoreHeaderInfoList(data) {
  return request({
    url: '/lms/salesplatnew/getTitles.html',
    method: 'post',
    data: qs.stringify(data)
  });
}

export const storeExportExcelApi = (data) => {
  return request({
    url: '/lms/salesplatnew/exportStoreList.html',
    method: 'post',
    data: qs.stringify(data),
    responseType: 'blob',
    needWrongMsg: true
  });
};

export function batchUpdateStoreApi(data) {
  return request({
    url: '/lms/salesplatnew/updateStoreList.html',
    method: 'post',
    data: qs.stringify(data)
  });
}

// daraz api授权
export function apiAuthApi(data) {
  return request({
    url: '/lms/darazAuth/authSaveByCode',
    method: 'get',
    params: data
  });
}

// 拼多多 api授权
export function generateAccessTokenApi(data) {
  return request({
    url: '/lms/pinduoduoAuthorization/generateAccessToken',
    method: 'get',
    params: data
  });
}

// 获取币种
export function getCurrencyApi(data) {
  return request({
    url: '/lms/sys/getLogisRates',
    method: 'get',
    params: data
  });
}

// 获取daraz授权的url
export const getAddressListApi = (params) => {
  return request({
    url: `/lms/darazAuth/getAuthUrl`,
    method: 'GET',
    params
  });
};

// 获取拼多多授权的url
export const getPddAuthUrlApi = () => {
  return request({
    url: '/lms/pinduoduoAuthorization/getAuthUrl',
    method: 'GET'
  });
};
