import request from '@/utils/request';

// 搜索
export const getProducts = (data) =>
  request({
    url: '/lms/sheinProducts/getProducts',
    method: 'POST',
    data: data
  });
// 修改标签
export const updateLabelName = (data) =>
  request({
    url: '/lms/sheinProducts/editProd',
    method: 'post',
    data
  });
// 获取商品层次
export const getAllProductLevel = () =>
  request({
    url: '/lms/sheinProducts/getAllProductLevel',
    method: 'POST'
  });
// 删除1水洗唛；2环保贴；3眼睛贴
export const updateEmpty = (type, data) =>
  request({
    url: '/lms/sheinProducts/updateEmpty/' + type,
    method: 'POST',
    data
  });
// 上传1水洗唛；2环保贴；3眼睛贴
export const uploads = (data) =>
  request({
    url: '/lms/sheinProducts/upload',
    method: 'POST',
    data
  });
// 修改销售员
export const editSales = (data) =>
  request({
    url: '/lms/sheinProducts/editSales',
    method: 'POST',
    params: data
  });
