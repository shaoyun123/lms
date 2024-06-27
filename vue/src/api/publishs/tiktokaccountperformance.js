import request from '@/utils/request';
// import qs from 'qs';
// 获取枚举数据
export const initEnumApi = () =>
  request({
    url: '/lms/tiktok/accountPerformance/init',
    loading: true
  });

export const queryListApi = (data) =>
  request({
    url: '/lms/tiktok/accountPerformance/list',
    method: 'post',
    loading: true,
    data
  });

// 违规记录初始化
export const initPerformanceApi = () =>
  request({
    url: '/lms/tiktok/accountPerformance/init',
    method: 'get'
  });

export const querViolationListApi = (data) =>
  request({
    url: '/lms/tiktok/accountPerformance/listViolationRecord',
    method: 'post',
    loading: true,
    data
  });

// 获取白名单弹窗列表
export const listTortWhiteListApi = () =>
  request({
    url: '/lms/tiktok/accountPerformance/listTortWhiteList',
    method: 'get',
    loading: true
  });

// 新增侵权白名单
export const addTortWhiteListApi = (data) =>
  request({
    url: '/lms/tiktok/accountPerformance/addTortWhiteList',
    method: 'post',
    loading: true,
    data
  });

// 批量删除侵权白名单
export const deleteByIdApi = (data) =>
  request({
    url: '/lms/tiktok/accountPerformance/deleteById',
    method: 'post',
    loading: true,
    data
  });

// 单个修改备注
export const updateTortWhiteListRemarkApi = (data) =>
  request({
    url: `/lms/tiktok/accountPerformance/updateTortWhiteListRemark?id=${data.id}&remark=${data.remark}`,
    method: 'get',
    loading: true
  });

// 白名单所有创建人
export const listTortWhiteListCreatorApi = () =>
  request({
    url: '/lms/tiktok/accountPerformance/listTortWhiteListCreator',
    method: 'get',
    loading: true
  });
