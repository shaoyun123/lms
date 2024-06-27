import request from '@/utils/request';

// 查询所有站点
export const queryChooseItemsTemplate = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/queryChooseItemsTemplate',
    method: 'POST',
    data
  });
};

export const queryWeekSaleData = (data) => {
  return request({
    url: '/lms/fba/weekSales/list',
    method: 'POST',
    data
  });
};

// 每周数据导出
export const exportWeekSaleData = (data) => {
  return request({
    url: '/lms/fba/weekSales/export',
    method: 'POST',
    data,
    responseType: 'blob',
    needWrongMsg: true
  });
};
