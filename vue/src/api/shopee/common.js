import request from '@/utils/request';
import qs from 'qs';

// 站点
export function getSiteListApi() {
  return request({
    url: '/lms/shopee/onlineProductShopee/getShopeeOnlineEnum.html'
  });
}

// 查询shopee总店铺
export const getStoreListApi = (data) => {
  const orgId = data?.orgId || '';
  const salePersonId = data?.salePersonId || '';
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    data: qs.stringify({
      roleNames: 'shopee专员',
      orgId,
      salePersonId,
      platCode: 'shopee'
    })
  });
};

// cnsc类目
export function queryCnscCategoryApi() {
  return request({
    url: '/lms/shopee/shopeeCate/cnscCategoryTree'
  });
}

// 获取GP名称
export function listAllMerchantNameApi() {
  return request({
    url: '/lms/salesplat/listAllMerchantName'
  });
}

// shopee的发货仓库
export function getShopeeShippingWarehousesApi() {
  return request({
    url: '/lms/shopee/shop/getShopeeShippingWarehouses',
    loading: true
  });
}

// 所有的发货仓库
export function getAuthedProdWarehouseApi() {
  return request({
    url: '/lms/prodWarehouse/getAuthedProdWarehouse.html',
    loading: true
  });
}
