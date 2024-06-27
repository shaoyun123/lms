import request from '@/utils/request';

// 获取店铺数据交运偏好和发货地址
export const getStoreList = (params) => {
  return request({
    url: '/logistics/edisEbay/listStoreAcct',
    method: 'get',
    params
  });
};

// 同步
export const syncStore = (data) => {
  return request({
    url: '/logistics/edisEbay/addressIdsAndConsignIds',
    method: 'post',
    data
  });
};

// 批量保存
export const saveStore = (data) => {
  return request({
    url: '/logistics/edisEbay/batchSaveAddressIdAndConsignId',
    method: 'put',
    data
  });
};
