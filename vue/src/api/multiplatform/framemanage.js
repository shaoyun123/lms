/*
 * @Author: ztao
 * @Date: 2023-03-16 20:17:27
 * @LastEditTime: 2023-07-07 14:16:05
 * @Description:
 */
import request from '@/utils/request';

// 获取列表
export const queryPage = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhFrameInfo/queryPage.html',
    method: 'post',
    data
  });

// 添加
export const batchCreate = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhFrameInfo/batchCreate',
    method: 'post',
    data
  });

// 删除
export const del = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhFrameInfo/delete.html',
    method: 'post',
    data
  });

// 批量修改
export const batchEdit = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhFrameInfo/modifySizeByIdList.html',
    method: 'post',
    data
  });

// 获取仓库名称接口
export const getRepoName = () =>
  request({
    url: '/lms/PlatWh/PlatWhFrameInfo/getAllWareHouseName',
    method: 'get'
  });
