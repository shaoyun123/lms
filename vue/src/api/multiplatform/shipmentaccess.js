import request from '@/utils/request';

// 获取列表
export const queryPage = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/shipmentAccess',
    method: 'post',
    data
  });

// 获取框子占用和总计数量
export const getFrameUseAndTotal = () =>
  request({
    url: '/lms/PlatWh/PlatWhFrameInfo/getFrameUseAndTotal',
    method: 'post'
  });

// 修改仓库备注
export const updatestoreRemark = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/saveStoreRemark',
    method: 'post',
    data
  });

// 获取仓库名称接口
export const getRepoName = () =>
  request({
    url: '/lms/PlatWh/PlatWhFrameInfo/getAllWareHouseName',
    method: 'get'
  });
