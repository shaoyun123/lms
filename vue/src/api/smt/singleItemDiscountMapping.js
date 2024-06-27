import request from '@/utils/request';
// import qs from 'qs';

// 查询列表
export const getSmtDiscountActivityRateList = (data) =>
  request({
    url: '/lms/aliexpress/discountActivityRate/getAliexpressDiscountActivityRateList',
    method: 'POST',
    loading: true,
    data
  });
// 更新优惠幅度
export function updateSmtDiscountActivityRate(data) {
  return request({
    url: `/lms/aliexpress/discountActivityRate/updateAliexpressDiscountActivityRate`,
    method: 'POST',
    loading: true,
    data
  });
}
// 获取 活动状态枚举
export function getAliexpressPromotionsListStatus() {
  return request({
    url: `/lms/aliexpress/discountActivityRate/getAliexpressPromotionsListStatus`,
    method: 'GET',
    loading: true
  });
}
