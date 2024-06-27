import request from '@/utils/request';
import qs from 'qs';
// 新增和修改删除任务
export function saveDeleteTask(data) {
  return request({
    url: `/lms/deleteTaskManage/saveDeleteTask`,
    method: 'POST',
    loading: true,
    params: data
  });
}
// 查询删除任务
export function searchDeleteTask(data) {
  return request({
    url: `/lms/deleteTaskManage/searchDeleteTask`,
    method: 'POST',
    loading: true,
    data
  });
}
// 查询所有创建人
export function getCreators() {
  return request({
    url: `/lms/deleteTaskManage/getCreators`,
    loading: true,
    method: 'GET'
  });
}
// 添加店铺
export function addStores(data) {
  return request({
    url: `/lms/deleteTaskManage/addStores`,
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
}
// 删除和批量删除任务绑定的店铺
export function removeRuleStore(ids) {
  // return request({
  //   url: `/lms/deleteTaskManage/removeRuleStore?ids=` + ids,
  //   loading: true,
  //   method: 'DELETE'
  // });
  return request({
    url: `/lms/deleteTaskManage/removeRuleStore`,
    loading: true,
    method: 'POST',
    data: qs.stringify(ids)
  });
}
// 根据任务查询该任务绑定的店铺
export function getStores(ruleId) {
  return request({
    url: `/lms/deleteTaskManage/getStores?ruleId=` + ruleId,
    loading: true,
    method: 'GET'
  });
}
// 修改任务状态
export function modifyStatus(ruleId) {
  return request({
    url: `/lms/deleteTaskManage/modifyStatus?ruleId=` + ruleId,
    loading: true,
    method: 'POST'
  });
}
// 修改and批量修改（全部修改）删除数量限制
export function modifyDeleteLimit(data) {
  return request({
    url: `/lms/deleteTaskManage/modifyDeleteLimit`,
    loading: true,
    method: 'POST',
    data: qs.stringify(data)
  });
}
// 查询日志
export function getLogs(ruleId) {
  return request({
    url: `/lms/deleteTaskManage/getLogs?ruleId=` + ruleId,
    method: 'GET'
  });
}
// 立即执行
export function manualTask(ruleId) {
  return request({
    url: `/lms/deleteTaskManage/manualTask?ruleId=` + ruleId,
    loading: true,
    method: 'POST'
  });
}
//获取要执行的数量接口
export function getTaskCount(ruleId) {
  return request({
    url: `/lms/deleteTaskManage/getTaskCount?ruleId=` + ruleId,
    loading: true,
    method: 'GET'
  });
}
//获取要执行的数量接口
export function getSuspendedStatus() {
  return request({
    url: `/lms/deleteTaskManage/getSuspendedStatus`,
    loading: true,
    method: 'GET'
  });
}

//获取listing状态下拉枚举
export function getProductStatusApi() {
  return request({
    url: `/lms/onlineProductLazada/getProductStatus`,
    loading: true
  });
}
