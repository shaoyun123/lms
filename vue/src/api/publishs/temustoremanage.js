import request from '@/utils/request';
import qs from 'qs';

// 查询店铺
export const queryStoreData = (data) => {
  return request({
    url: '/lms/salesplat/searchTemuPlatAccount',
    method: 'POST',
    data: data
  });
};
// 获取开发者账号
export const getDevAccount = () => {
  return request({
    url: '/lms/temu/devaccount/list',
    method: 'POST'
  });
};

// 获取销售员 和 客服专员 数据
export const querySalersData = (data) => {
  return request({
    url: '/lms/sys/listuserbyrole.html',
    method: 'POST',
    data: qs.stringify(data)
  });
};

// 获取销售主管 数据
export const queryLeadersData = (data) => {
  return request({
    url: '/lms/sys/getPersonAndOrgsByRole.html',
    method: 'POST',
    data: qs.stringify(data)
  });
};

// 批量修改
export const updateStore = (data) => {
  return request({
    url: '/lms/salesplat/editSalesPerson.html',
    method: 'POST',
    data: data
  });
};

// 新增/修改店铺
export const editStore = (params) => {
  return request({
    url: '/lms/salesplat/addSalesPlatAccountBaseAndDetailInfo.html',
    method: 'get',
    params: params
  });
};

// 开启/关闭订单下载
export const switchOrder = (data) => {
  return request({
    url: '/lms/salesplat/batchUpdateOrderStatus.html',
    method: 'POST',
    data: qs.stringify(data)
  });
};

// 启用店铺
export const switchStore = (data) => {
  return request({
    url: '/lms/salesplat/batchUpdateAcctStatus.html',
    method: 'POST',
    data: data
  });
};

// 店铺授权
export const authStore = (data) => {
  return request({
    url: '/lms/salesplat/temuAuth/setAccessToken',
    method: 'POST',
    data: data
  });
};
