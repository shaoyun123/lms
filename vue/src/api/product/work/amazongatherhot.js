import request from '@/utils/request';

export const getInitData = (data) =>
  request({
    url: '/lms/amazon/prodHotSale/init',
    method: 'POST',
    data: data
  });

// 部门和开发下拉框
export const getOrgDevData = () =>
  request({
    url: '/lms/amazon/prodHotSale/getPersonAndOrg',
    method: 'get'
  });

// 查询
export const queryList = (data) =>
  request({
    url: '/lms/amazon/prodHotSale/list',
    method: 'post',
    data
  });

// 统计所有页签数量
export const queryTabCount = (data) =>
  request({
    url: '/lms/amazon/prodHotSale/countAllTab',
    method: 'post',
    data
  });

// 分配开发 和自动匹配开发
export const assignDeveloper = (data, devloperId) =>
  request({
    url: '/lms/amazon/prodHotSale/assignDeveloper?devloperId=' + devloperId,
    method: 'post',
    data
  });

// 查询操作日志
export const getOperateLogs = (params) =>
  request({
    url: '/lms/amazon/prodHotSale/listOperLog',
    method: 'get',
    params
  });

// 更新商品状态并留下备注
export const changeStatusAndRemark = (data) =>
  request({
    url: '/lms/amazon/prodHotSale/changeProcessStatusAndRemark',
    method: 'post',
    data
  });
