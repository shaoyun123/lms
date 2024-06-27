import request from '@/utils/request';

// 调价数据列表查询
export function searchPurPriceChange(data) {
  return request({
    url: '/lms/purchasePriceChange/searchPurPriceChange',
    method: 'post',
    data: data
  });
}

// 新增压价数据
export function savePurPriceChange(data) {
  return request({
    url: '/lms/purchasePriceChange/savePurPriceChange',
    method: 'post',
    data: data
  });
}

// 编辑压价数据
export function editPurPriceChange(data) {
  return request({
    url: '/lms/purchasePriceChange/editPurPriceChange',
    method: 'post',
    data: data
  });
}

// 删除价格变动记录
export function deletePurPriceChange(data) {
  return request({
    url: '/lms/purchasePriceChange/deletePurPriceChange',
    method: 'post',
    data: data
  });
}

// 查询半年内录入人
export function queryLast180DayCreator(data) {
  return request({
    url: '/lms/purchasePriceChange/queryLast180DayCreator',
    method: 'post',
    data: data
  });
}

// 查询涨价原因枚举
export function queryReasonType(data) {
  return request({
    url: '/lms/purchasePriceChange/queryReasonType',
    method: 'post',
    data: data
  });
}

// 批量标记为已处理
export function markAsDealPurPriceChange(data) {
  return request({
    url: '/lms/purchasePriceChange/markAsDealPurPriceChange',
    method: 'post',
    data: data
  });
}

// 批量调价
export function dealPurPriceChange(data) {
  return request({
    url: '/lms/purchasePriceChange/dealPurPriceChange',
    method: 'post',
    data: data
  });
}

// 导出模板
export function downloadAdjustPriceTemplate(data) {
  return request({
    url: '/lms/static/templet/purPriceChangeImprotTemplate.xlsx',
    method: 'get',
    data: data,
    responseType: 'blob',
    needWrongMsg: true
  });
}
