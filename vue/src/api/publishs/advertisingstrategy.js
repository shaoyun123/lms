import request from '@/utils/request';
// 查询区域定价列表
export const getRegionPrice = (data) =>
  request({
    url: `/lms/aliexpressHalfManage/product/regionPrice?productId=${data.productId}`,
    method: 'get'
  });

// 查询列表
export const getListStrategyCampaignApi = (data) =>
  request({
    url: '/lms/amazon/advertising/bid/rule/listStrategyCampaign',
    method: 'POST',
    loading: true,
    data
  });

// 获取站点
export const getAllAmazonSiteApi = (data) =>
  request({
    url: '/lms/onlineProductAmazon/getAllAmazonSite.html',
    method: 'POST',
    data
  });

// 新增广告活动
export const saveOrUpdateApi = (data) =>
  request({
    url: '/lms/amazon/advertising/bid/rule/saveOrUpdate',
    method: 'POST',
    loading: true,
    data
  });

// 状态开启关闭
export const enableOrDisableApi = (data) =>
  request({
    url: '/lms/amazon/advertising/bid/rule/enableOrDisable',
    method: 'POST',
    loading: true,
    data
  });

// 批量编辑ACOS
export const batchSetAcosApi = (data) =>
  request({
    url: '/lms/amazon/advertising/bid/rule/batchSetAcos',
    method: 'POST',
    loading: true,
    data
  });
