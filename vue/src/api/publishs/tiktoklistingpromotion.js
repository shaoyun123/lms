import request from '@/utils/request';
import qs from 'qs';

// 获取枚举数据
export const initEnumApi = () => {
  return request({
    url: '/lms/tiktok/promotion/init'
  });
};

// 查询列表
export const queryListApi = (data) => {
  return request({
    url: '/lms/tiktok/promotion/queryPage',
    method: 'POST',
    data
  });
};

// 创建或修改促销
export const saveOrUpdateApi = (data) => {
  return request({
    url: '/lms/tiktok/promotion/saveOrUpdate',
    method: 'POST',
    data
  });
};

// 批量终止
export const stopPromotionApi = (data) => {
  return request({
    url: '/lms/tiktok/promotion/batchStop',
    method: 'POST',
    data: qs.stringify(data)
  });
};

// 店铺同步
export const syncStoreApi = (data) => {
  return request({
    url: '/lms/tiktok/promotion/syncByStoreAcctIdList',
    method: 'POST',
    data
  });
};

// 活动同步
export const syncPromotionApi = (data) => {
  return request({
    url: '/lms/tiktok/promotion/syncByPromotionId',
    method: 'POST',
    data
  });
};

// 查询店铺
export const getStoreListApi = () => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    data: qs.stringify({
      roleNames: 'tiktok专员',
      orgId: '',
      salePersonId: '',
      platCode: 'tiktok'
    })
  });
};
