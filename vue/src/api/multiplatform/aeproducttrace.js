import request from '@/utils/request';

// 平台类目
export const queryPlatCateListApi = () =>
  request({
    url: '/lms/prodcate/getPlatCategoryTree?code=aliexpress'
  });

// 获取列表
export const queryPageApi = (data) =>
  request({
    url: '/lms/aliexpress/sourcing/queryPage',
    method: 'post',
    data
  });

export const updateApi = (data) =>
  request({
    url: '/lms/aliexpress/sourcing/update',
    method: 'post',
    data
  });

// 获取sku的详细
export const getSkuInfoApi = (prodSSku) =>
  request({
    url: `/lms/aliexpress/sourcing/getSkuInfo?prodSSku=${prodSSku}`
  });
