import request from '@/utils/request';

// 同步店铺
export function syncByStoreApi(data) {
  return request({
    url: '/lms/shopee/addOneDeal/syncByStoreAcctIdList',
    method: 'post',
    data
  });
}

// 同步活动
export function syncByActivityApi(data) {
  return request({
    url: '/lms/shopee/addOneDeal/batchSync',
    method: 'post',
    data
  });
}

// 查询列表
export function queryPageApi(data) {
  return request({
    url: '/lms/shopee/addOneDeal/list',
    method: 'post',
    data
  });
}

// 创建人 修改人 userType:1 创建人  2 修改人
export function getUserListApi(userType) {
  return request({
    url: `/lms/shopee/addOneDeal/userList/${userType}`
  });
}

// 改变活动类型
export function updateAutoRenewApi(voucherId, autoRenew) {
  return request({
    url: `/lms/shopee/voucher/autoRenewSetting?voucherId=${voucherId}&autoRenew=${autoRenew}`,
    needWrongMsg: true
  });
}

// 操作日志
export function viewLogListApi(page, limit) {
  return request({
    url: `/lms/shopee/addOneDeal/queryImportOperateLog/?page=${page}&limit=${limit}`
  });
}

// 新增addOn
export function addNewApi(data) {
  return request({
    url: '/lms/shopee/addOneDeal/new',
    method: 'post',
    data
  });
}

// 更新addOn
export function updateApi(data) {
  return request({
    url: '/lms/shopee/addOneDeal/update',
    method: 'PUT',
    data
  });
}

// 查询单个addOn
export function queryInfoApi(addOnDealId) {
  return request({
    url: `/lms/shopee/addOneDeal/one/${addOnDealId}`
  });
}

// 根据modelId即variId查询商品价格和itemId
export function queryListInfoApi(data) {
  return request({
    url: '/lms/shopee/addOneDeal/listItemInfo',
    method: 'post',
    data
  });
}

// 批量删除 addon
export function delAddOnApi(data) {
  return request({
    url: '/lms/shopee/addOneDeal/deleteAddOnDeal',
    method: 'DELETE',
    data
  });
}

// 批量终止 addon
export function endAddOnApi(data) {
  return request({
    url: '/lms/shopee/addOneDeal/endAddOnDeal',
    method: 'DELETE',
    data
  });
}

// 通过毛利率 计算促销价
export function getPriceByGrossProfitRateApi(data) {
  return request({
    url: `/lms/shopee/shopeeIsEnableProduct/v2/calDiscountPriceByGrossProfitRate`,
    method: 'post',
    data
  });
}
