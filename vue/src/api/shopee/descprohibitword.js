import request from '@/utils/request';
import qs from 'qs';

// 页面查询
export const queryPageApi = (data) =>
  request({
    url: '/lms/shopee/prohibit/query',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });

// 新增
export const addNewApi = (data) =>
  request({
    url: '/lms/shopee/prohibit/addShopeeListingDescriptionProhibit',
    method: 'post',
    loading: true,
    data
  });

// 修改
export const updateApi = (data) =>
  request({
    url: '/lms/shopee/prohibit/updateShopeeListingDescriptionProhibit',
    method: 'post',
    loading: true,
    data
  });

// 删除
export const delApi = (data) =>
  request({
    url: '/lms/shopee/prohibit/deleteShopeeListingDescriptionProhibit',
    method: 'post',
    loading: true,
    data
  });
