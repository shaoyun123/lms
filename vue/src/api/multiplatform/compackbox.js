import request from '@/utils/request';

// 获取列表
export const queryPage = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/queryPlatWhComBox',
    method: 'post',
    data
  });
