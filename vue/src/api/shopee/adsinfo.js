import request from '@/utils/request';

export function getAdsListApi(data) {
  return request({
    url: '/lms/shopee/ads/list',
    method: 'post',
    loading: true,
    data
  });
}

// 广告导出字段枚举
export function getAdsExportFieldsApi() {
  return request({
    url: '/lms/shopee/ads/getExportEnums',
    loading: true
  });
}

// 广告导出
export function adsExportApi(data) {
  return request({
    url: '/lms/shopee/ads/export',
    method: 'post',
    loading: true,
    data
  });
}
