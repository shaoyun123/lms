import request from '@/utils/request';
// 查询
export const getShenAccountPerList = (data) => {
  return request({
    url: '/lms/sheinAccountPer/getShenAccountPerList',
    method: 'POST',
    data: data
  });
};
// 根据销售，选店铺
export const listStoreForRenderHpStoreCommonComponent = (data) => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    params: data
  });
};
// 更新当前可用额度
export const updateSheinAcctPerData = (data) => {
  return request({
    url: '/lms/sheinAccountPer/updateSheinAcctPerData',
    method: 'POST',
    data: data
  });
};
