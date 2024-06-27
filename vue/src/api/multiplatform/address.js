import request from '@/utils/request';

// 获取列表
export const queryPage = (data) =>
  request({
    url: '/lms/PlatWh/searchPlatWhReceiveAddress',
    method: 'post',
    data
  });

// 新增
export const addAddress = (data) =>
  request({
    url: '/lms/PlatWh/savePlatWhReceiveAddress',
    method: 'post',
    data
  });

// 修改
export const updateAddress = (data) =>
  request({
    url: '/lms/PlatWh/updatePlatWhReceiveAddress',
    method: 'post',
    data
  });
