import request from '@/utils/request';
import qs from 'qs';

// 查询列表
export const queryAmazonVioList = (data) =>
  request({
    url: '/lms/smt/violation/query',
    method: 'POST',
    loading: true,
    data
  });
// 获取去重侵权类型
export function listViolationTypes() {
  return request({
    url: '/lms/smt/violation/listViolationTypes',
    method: 'GET',
    loading: true
  });
}
// 获取sku图片
export function getSkuImageMap(params) {
  return request({
    url: '/lms/smt/violation/getSkuImageMap',
    method: 'GET',
    loading: true,
    params
  });
}
// 编辑侵权信息
export function editViolationInfo(data) {
  return request({
    url: `/lms/smt/violation/editViolationInfo`,
    method: 'POST',
    loading: true,
    data
  });
}
// 开发建议
export function devSug(data) {
  return request({
    url: `/lms/smt/violation/devSug`,
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
}
// 销售处理
export function saleHandle(data) {
  return request({
    url: `/lms/smt/violation/saleHandle`,
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
}
// 同步侵权库
export function syncViolation(data) {
  return request({
    url: `/lms/smt/violation/syncTort`,
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });
}
// 编辑备注
export function editRemark(data) {
  return request({
    url: `/lms/smt/violation/editRemark`,
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
}
// 获取一键复制的枚举
export function getBatchCopyEnum() {
  return request({
    url: `/lms/smt/violation/getBatchCopyEnum`,
    method: 'GET',
    loading: true
  });
}
// 获取一键复制的枚举
export function batchCopyList(data) {
  return request({
    url: `/lms/smt/violation/batchCopyList`,
    method: 'POST',
    loading: true,
    data
  });
}
