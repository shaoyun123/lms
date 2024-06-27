import request from '@/utils/request';
import qs from 'qs';
// cnsc类目
export function queryCnscCategoryApi() {
  return request({
    url: '/lms/shopee/shopeeCate/cnscCategoryTree'
  });
}

// 查询
export function queryPageApi(data) {
  return request({
    url: '/lms/shopee/shopeeAutoListingRuleController/rule/queryPage',
    method: 'post',
    loading: true,
    data
  });
}

// 创建人
export function getUserListApi() {
  return request({
    url: '/lms/shopee/shopeeAutoListingRuleController/rule/createUserList'
  });
}

// 属性
export function manageListApi() {
  return request({
    url: `lms/fyndiq/new/listing/manage.html`
  });
}

// 新增规则
export function addNewApi(data) {
  return request({
    url: '/lms/shopee/shopeeAutoListingRuleController/rule/addRule',
    method: 'post',
    data
  });
}

// 复制新增
export function copyAddApi(data) {
  return request({
    url: '/lms/shopee/shopeeAutoListingRuleController/rule/addCopy',
    method: 'post',
    data
  });
}

// 修改规则
export function editRuleApi(data) {
  return request({
    url: '/lms/shopee/shopeeAutoListingRuleController/rule/editInfo',
    method: 'post',
    data
  });
}

// 删除规则
export function delRuleApi(id) {
  return request({
    url: `/lms/shopee/shopeeAutoListingRuleController/rule/delete/${id}`,
    method: 'delete'
  });
}

// 修改规则状态
export function updateStatusApi(obj) {
  return request({
    url: `/lms/shopee/shopeeAutoListingRuleController/rule/updateStatus/${obj.id}`,
    method: 'put',
    data: qs.stringify({
      status: obj.status
    })
  });
}

// 规则  批量关闭/开启
export function batchUpdateStatusApi(obj) {
  return request({
    url: `/lms/shopee/shopeeAutoListingRuleController/rule/batchUpdate?ids=${obj.ids}&status=${obj.status}`
  });
}

// 查询该规则下的店铺信息
export function getStoreInfoByRuleApi(obj) {
  return request({
    url: `/lms/shopee/shopeeAutoListingRuleStoreController/store/list/${obj.ruleId}`
  });
}

// 店铺 批量保存
export function batchSaveStoreApi(data) {
  return request({
    url: '/lms/shopee/shopeeAutoListingRuleStoreController/store/editStoreInfoList',
    method: 'post',
    data
  });
}
// 店铺  设置
export function addStoreApi(data) {
  return request({
    url: '/lms/shopee/shopeeAutoListingRuleStoreController/store/setStoreForRule',
    method: 'post',
    data
  });
}

// 店铺  编辑
export function editStoreApi(data) {
  return request({
    url: '/lms/shopee/shopeeAutoListingRuleStoreController/store/editStoreInfo',
    method: 'post',
    data
  });
}

// 店铺  删除
export function delStoreApi(id) {
  return request({
    url: `/lms/shopee/shopeeAutoListingRuleStoreController/store/delete/${id}`,
    method: 'delete'
  });
}

// 店铺  批量移除删除
export function batchDelStoreApi(data) {
  return request({
    url: `/lms/shopee/shopeeAutoListingRuleStoreController/store/batchRemoveStores`,
    method: 'delete',
    data
  });
}

// 查询shopee店铺
export const getStoreListApi = (salePersonId) => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    data: qs.stringify({
      roleNames: 'shopee专员',
      orgId: '',
      salePersonId,
      platCode: 'shopee'
    })
  });
};

// 批量修改刊登规则属性枚举
export function getBatchEditParamEnumApi() {
  return request({
    url: `/lms/shopee/shopeeAutoListingRuleController/rule/getBatchEditParamEnum`
  });
}

// 批量修改自动刊登规则
export function batchEditApi(data) {
  return request({
    url: '/lms/shopee/shopeeAutoListingRuleController/rule/batchEdit',
    method: 'post',
    data
  });
}

// 获取shopee已配置的发货仓库
export function getShopeeShippingWarehouses() {
  return request({
    url: '/lms/shopee/shop/getShopeeShippingWarehouses',
    method: 'get'
  });
}

// 查看日志
export const queryModifyLogsApi = ({ ruleId, platCode }) =>
  request({
    url: `/lms/shopee/shopeeAutoListingRuleController/rule/queryModifyLogs?platCode=${platCode}&ruleId=${ruleId}`,
    loading: true
  });
