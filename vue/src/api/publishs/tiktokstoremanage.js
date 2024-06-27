/*
 * @Author: ztao
 * @Date: 2023-08-22 10:52:56
 * @LastEditTime: 2024-01-10 18:37:37
 * @Description:
 */
import request from '@/utils/request';
import qs from 'qs';

// 查询
export function salesPlatAccountDtoPage(data) {
  return request({
    url: '/lms/salesplat/salesPlatAccountDtoPage.html?platCode=tiktok',
    method: 'POST',
    data: qs.stringify(data)
  });
}

// 获取所有的创建人
export function getCreator(params) {
  return request({
    url: '/lms/salesplat/getCreator',
    method: 'get',
    params
  });
}

// 获取所有的客服
export function getServicer(data) {
  return request({
    url: '/lms/sys/listuserbyrole.html',
    method: 'post',
    data: qs.stringify(data)
  });
}

// 授权
export function handleAuth(storeAcctId) {
  return request({
    url: `/lms/tiktok/auth/getAuthUrl?storeAcctId=${storeAcctId}`,
    needWrongMsg: true
  });
}

// 新增/修改店铺
export const editStore = (data) => {
  return request({
    url: '/lms/salesplat/addSalesPlatAccountBaseAndDetailInfo.html',
    method: 'post',
    data: qs.stringify(data)
  });
};

// 批量修改
export const updateTiktokStore = (data) => {
  return request({
    url: '/lms/salesplat/editSalesPersonForTiktok',
    method: 'POST',
    data: data
  });
};

// 获取店铺配置
export const getStoreConfigApi = (id) => {
  return request({
    url: `/lms/salesplat/getStoreConfig?storeAcctId=${id}`
  });
};

// 保存店铺配置
export const saveStoreConfigApi = (data) => {
  return request({
    url: '/lms/salesplat/saveOrUpdateStoreConfig',
    method: 'post',
    data
  });
};
// 批量添加店铺性感图片过滤类目
export const batchAddImageFilterCate = (data) => {
  return request({
    url: '/lms/salesplat/batchAddImageFilterCate',
    method: 'post',
    data
  });
};
//ztt20231206-导出功能
export const exportStore = (params) => {
  return request({
    url: '/lms/salesplat/exportTiktokSalesPlatAccountDtoPage?platCode=tiktok',
    method: 'post',
    data: params,
    loading: true,
    responseType: 'blob'
  });
};

// chat 授权
export function chatAuthApi(storeAcctId) {
  return request({
    url: `/chat/tiktok/auth/getAuthUrl?storeAcctId=${storeAcctId}`,
    needWrongMsg: true,
    loading: true
  });
}

// 获取销售组长对应人员列表
export function listValidUserByRoleApi(data) {
  return request({
    url: `/lms/sys/listValidUserByRole?role=${data.role}&platCode=${data.platCode}`,
    method: 'get'
  });
}
