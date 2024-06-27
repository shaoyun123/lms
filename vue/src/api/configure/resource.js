/*
 * @Author: ztao
 * @Date: 2022-10-23 18:16:06
 * @LastEditTime: 2023-12-27 15:36:31
 * @Description:
 */
import request from '@/utils/request';

export function getResourceList() {
  // 配置-资源-获取资源列表树
  return request({
    url: '/lms/sysresourcenew/resource/tree',
    method: 'get'
  });
}

export function getResourceDetail(id) {
  // 配置-资源-获取资源列详情
  return request({
    url: '/lms/sysresourcenew/resource/get',
    method: 'get',
    params: { id: id }
  });
}

export function modifyResource(data) {
  // 配置-资源-新增资源
  return request({
    url: '/lms/sysresourcenew/resource/save',
    method: 'post',
    params: data
  });
}

export function deleteResource(id) {
  // 配置-资源-删除资源
  return request({
    url: '/lms/sysresourcenew/resource/delete',
    method: 'get',
    params: { id: id }
  });
}
