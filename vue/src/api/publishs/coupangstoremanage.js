import request from '@/utils/request';
import qs from 'qs';

// 查询
export function salesPlatAccountDtoPage(data) {
  return request({
    url: '/lms/salesplat/salesPlatAccountDtoPage.html?platCode=coupang',
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
export function handleAuth(data) {
  return request({
    url: '/lms/salesplat/authCoupang',
    method: 'post',
    data: data
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
