/*
 * @Author: Cisy.Wang
 * @Date: 2022-10-26 10:37:16
 * @LastEditTime: 2022-10-26 15:37:21
 * @Description:
 */
import request from '@/utils/request';
import qs from 'qs';

// 获取营收列表数据
export const getPaymentsData = (data) => {
  return request({
    url: '/lms/ebayFinancesPaymentFinalController/queryAll',
    method: 'post',
    data: data
  });
};

// 获取部门和销售人员信息
export const getDepartData = (data) => {
  return request({
    url: '/lms/sys/getPersonAndOrgsByRole.html',
    method: 'post',
    data: qs.stringify(data)
  });
};

// 获取店铺信息
export const getStoreInfo = (data) => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'post',
    data: qs.stringify(data)
  });
};

// 同步店铺
export const syncStore = (params) => {
  return request({
    url: '/lms/ebayFinancesPaymentFinalController/syncOneStore',
    method: 'get',
    params
  });
};
