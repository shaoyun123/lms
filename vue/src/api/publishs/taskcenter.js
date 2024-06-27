import request from '@/utils/request';

// 任务中心业务枚举（任务名称）
export function getBusinessTypeEnum() {
  return request({
    url: `/lms/taskCenter/businessTypeEnum`,
    method: 'GET'
  });
}

// 任务中心列表查询
export function getShopeeTaskCenter(data) {
  return request({
    url: `/lms/taskCenter/query`,
    method: 'post',
    data
  });
}

// 查询所有操作人
export function getAllCreatorApi(data) {
  return request({
    url: `/lms/taskCenter/getAllCreator`,
    method: 'GET',
    data
  });
}

// 查询所有的业务模块
export function getAllBusinessModuleApi(data) {
  return request({
    url: `/lms/taskCenter/getAllBusinessModule`,
    method: 'GET',
    data
  });
}

// 任务结果枚举
export function getTaskStatusApi() {
  return request({
    url: `/lms/taskCenter/taskStatusEnum`,
    method: 'GET'
  });
}
