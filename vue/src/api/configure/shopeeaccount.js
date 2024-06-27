import request from '@/utils/request';
import qs from 'qs';

// 查询
export function queryPageApi(data) {
  return request({
    url: '/lms/salesplat/salesPlatAccountDtoPage.html?platCode=shopee',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });
}

// 查询某店铺具体信息
export function getStoreInfoApi(id) {
  return request({
    url: `/lms/salesplat/getStoreConfig?storeAcctId=${id}`,
    loading: true
  });
}

// 更新某店铺信息
export function updateStoreInfoApi(data) {
  return request({
    url: '/lms/salesplat/saveOrUpdateStoreConfig',
    method: 'post',
    loading: true,
    data
  });
}

// 获取预售信息
export function getPreOrderConfigApi(id) {
  return request({
    url: `/lms/shopee/autoPreOrderConfig/one/${id}`,
    loading: true
  });
}

// 新建预售
export function createPreOrderConfigApi(data) {
  return request({
    url: `/lms/shopee/autoPreOrderConfig/new`,
    method: 'post',
    loading: true,
    data
  });
}
// 更新预售
export function updatePreOrderConfigApi(data) {
  return request({
    url: `/lms/shopee/autoPreOrderConfig/update`,
    method: 'put',
    loading: true,
    data
  });
}

// 真正执行取消预售
export function cancelPreOrderApi(storeAcctId) {
  return request({
    url: `/lms/shopee/onlineProductShopee/cancelPreOrderItemByStoreAcctId/${storeAcctId}`,
    loading: true
  });
}

// 设置自动刊登函数
export function setAutoDeleteOrPublishApi(data) {
  return request({
    url: `/lms/salesplat/setAutoDeleteOrPublish`,
    method: 'put',
    loading: true,
    data
  });
}

// 批量修改 人员信息
export const updatePersonInfoStoreApi = (data) => {
  return request({
    url: '/lms/salesplat/editSalesPerson.html',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
};

// 获取店铺账号信息
export const getSalesPlatAccountBaseInfoApi = (id) => {
  return request({
    url: '/lms/salesplat/getSalesPlatAccountBaseAndDetailInfo.html',
    method: 'POST',
    loading: true,
    needWrongMsg: true,
    data: qs.stringify({ id })
  });
};

// 新增或更新店铺账号信息
export const addOrUpdateSalesPlatAccountBaseInfoApi = (data) => {
  return request({
    url: '/lms/salesplat/addSalesPlatAccountBaseAndDetailInfo.html',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
};

// 停用店铺
export const deleteSalesPlatAccountApi = (id) => {
  return request({
    url: `/lms/salesplat/deleteSalesPlatAccount.html?id=${id}`,
    loading: true
  });
};

// 启用店铺
export const openSalesPlatAccountApi = (id) => {
  return request({
    url: `/lms/salesplat/openSalesPlatAccount.html?id=${id}`,
    loading: true
  });
};

// 批量启用店铺 批量停用店铺
export const batchUpdateAcctStatusApi = (data) => {
  return request({
    url: '/lms/salesplat/batchUpdateAcctStatus.html',
    method: 'POST',
    loading: true,
    data
  });
};

// 店铺授权 地址
export const getStoreAuthUrlApi = (storeAcctId) => {
  return request({
    url: `/lms/shopee/shopeeAuth/getAuthUrl?storeAcctId=${storeAcctId}`,
    loading: true
  });
};

// chat授权 地址
export const getChatAuthUrlApi = () => {
  return request({
    url: `/chat/shopee/auth/getAuthUrl`,
    loading: true
  });
};

// 广告账户授权 地址
export const getAdsAuthUrlApi = () => {
  return request({
    url: `/lms/shopee/shopeeAuth/getAdsAuthUrl`,
    loading: true
  });
};

// 批量更新店铺标签
export const batchUpdateStoreTagApi = (data) => {
  return request({
    url: `/lms/salesplat/batchUpdateStoreTag`,
    loading: true,
    method: 'post',
    data
  });
};

// 单个更新店铺标签
export const saveOrUpdateStoreTagApi = (data) => {
  return request({
    url: `/lms/salesplat/saveOrUpdateStoreTag`,
    loading: true,
    method: 'post',
    data
  });
};

// 批量 同步boost
export const batchSyncItemBoostApi = (data) => {
  return request({
    url: `/lms/shopee/shopeeIsEnableProduct/batchSyncItemBoost.html`,
    loading: true,
    method: 'post',
    data
  });
};

// 同步listing
export const batchSyncPlatListingApi = (data) => {
  return request({
    url: `/lms/shopee/syncItem/batchSyncPlatListing.html`,
    loading: true,
    method: 'post',
    data: qs.stringify(data)
  });
};

// 复制亿品token
export const getTokenFromEpProdApi = (id) => {
  return request({
    url: `/lms/shopee/test/getTokenFromEpProdByStoreAcctId/${id}`,
    loading: true
  });
};

// 同步促销
export const syncItemShopeeDiscountApi = (data) => {
  return request({
    url: '/lms/shopee/syncItem/getShopeeDiscount.html',
    loading: true,
    method: 'post',
    data
  });
};
