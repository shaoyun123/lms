/*
 * @Author: Cisy.Wang
 * @Date: 2022-11-01 13:37:04
 * @LastEditTime: 2023-03-21 10:50:31
 * @Description:
 */
import request from '@/utils/request';
import qs from 'qs';

// 获取采购专员 整合专员 开发专员
// type  采购专员1 整合专员2 开发专员3
export function getAssignUser(data) {
  return request({
    url: '/lms/prodCutPriceNotice/query/assign/user',
    method: 'post',
    data: qs.stringify(data)
  });
}

// 获取取消订单列表
export function getCancelOrder(data) {
  return request({
    url: '/lms/purchases/CancelOrder/getCancelOrderInfo',
    method: 'post',
    data: data
  });
}

// 配置参数
export function settingParams(data) {
  return request({
    url: '/lms/purchases/CancelOrder/updateCancelOrderConfig',
    method: 'post',
    data: data
  });
}

// 查询配置参数
export function getSettingParams() {
  return request({
    url: '/lms/purchases/CancelOrder/getCancelInfoConfig',
    method: 'post'
  });
}

// 处理取消订单
export function handleCancelOrder(data) {
  return request({
    url: '/lms/purchases/CancelOrder/updateCancelOrderInfo',
    method: 'post',
    data: data
  });
}
