import request from '@/utils/request';

// 新增压价数据
export function handleAddPriceCut(data) {
  return request({
    url: '/lms/purchasePriceCut/savePriceCut',
    method: 'post',
    data: data
  });
}

// 编辑压价数据
export function handleEditPriceCut(data) {
  return request({
    url: '/lms/purchasePriceCut/editPriceCut',
    method: 'post',
    data: data
  });
}

// 删除压价
export function deletePurPriceCut(data) {
  return request({
    url: '/lms/purchasePriceCut/deletePurPriceCut',
    method: 'post',
    data: data
  });
}

// 查询子sku
export function getSSkuList(data) {
  return request({
    url: '/lms/purchasePriceCut/queryProdSSkuByPSku',
    method: 'post',
    data: data
  });
}

// 压价数据列表查询
export function queryPurPriceCut(data) {
  return request({
    url: '/lms/purchasePriceCut/queryPurPriceCut',
    method: 'post',
    data: data
  });
}

// 查询半年内录入人
export function queryLast180DayCreator(data) {
  return request({
    url: '/lms/purchasePriceCut/getLast180DayCreatorPersonAndOrgs',
    method: 'post',
    data: data
  });
}

// 导出模板
export function downloadPurPriceCutTemplate(data) {
  return request({
    url: '/lms/static/templet/purPriceCutImportTemplate.xlsx',
    method: 'get',
    data: data,
    responseType: 'blob',
    needWrongMsg: true
  });
}
