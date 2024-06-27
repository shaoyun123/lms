/*
 * @Author: lys
 * @Date: 2024-02-23 14:41:27
 * @LastEditTime: 2024-02-23 14:41:27
 * @Description:
 */
import request from '@/utils/request';

// 获取列表
export const queryAllPlatWhShipmentExpressApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/queryAllPlatWhShipmentExpress',
    method: 'post',
    data
  });

// 表格内单个单击修改
export const editPlatWhShipmentExpressApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/editPlatWhShipmentExpress',
    method: 'post',
    data
  });
