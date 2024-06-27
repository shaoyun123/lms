/*
 * @Author: ztao
 * @Date: 2023-04-03 16:46:03
 * @LastEditTime: 2023-06-21 11:11:32
 * @Description:
 */
import request from '@/utils/request';

// 获取部门&销售员
export function getPersonAndOrgsByRole(data) {
  return request({
    url: '/lms/sys/getPersonAndOrgsByRole.html',
    method: 'POST',
    data
  });
}
// 修改信息--销售员-销售主管-客服
export function listuserbyrole(data) {
  return request({
    url: '/lms/sys/listuserbyrole.html',
    method: 'POST',
    data
  });
}
// 修改信息--保存
export function editSalesPerson(data) {
  return request({
    url: '/lms/salesplat/editSalesPerson.html',
    method: 'POST',
    data
  });
}
// 授权保存
export function saveAuthInfo(data) {
  return request({
    url: '/lms/salesplat/getMercadoToken.html',
    method: 'POST',
    data
  });
}
// 添加&编辑保存
export function addSalesPlatAccountBaseAndDetailInfo(data) {
  return request({
    url: '/lms/salesplat/addSalesPlatAccountBaseAndDetailInfo.html',
    method: 'POST',
    data
  });
}
// 查询
export function salesPlatAccountDtoPage(data) {
  return request({
    url: '/lms/salesplat/salesPlatAccountDtoPage.html?platCode=mercado',
    method: 'POST',
    data
  });
}
// 单个----订单开启&关闭
export function updateOrderStatusById(data) {
  return request({
    url: '/lms/salesplat/updateOrderStatusById.html',
    method: 'POST',
    data
  });
}
// 批量----订单开启&关闭
export function batchUpdateOrderStatus(data) {
  return request({
    url: '/lms/salesplat/batchUpdateOrderStatus.html',
    method: 'POST',
    data
  });
}
// 批量----店铺状态开启&关闭
export function batchUpdateAcctStatus(data) {
  return request({
    url: '/lms/salesplat/batchUpdateAcctStatus.html',
    method: 'POST',
    data
  });
}
// 同步listing
export function SyncMercadoProduct(data) {
  return request({
    url: '/lms/mercadoStoreManage/SyncMercadoProduct',
    method: 'POST',
    data
  });
}

//获取授权链接
export function getMercadoAuthLink() {
  return request({
    url: '/lms/mercadoStoreManage/getMercadoAuthorizedURL',
    method: 'GET'
  });
}
