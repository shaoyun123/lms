import request from '@/utils/request';

// 获取所有站点
export const allSite = () =>
  request({
    url: '/lms/lazada/voucher/get/lazada/site/all',
    method: 'GET'
  });

// // 根据站点筛选店铺
// export const siteFilterStore = (site) =>
//   request({
//     url: '/lms/lazada/voucher/get/lazada/store/site/' + site,
//     method: 'GET'
//   });

// 查询
export const getPlatformProducts = (data) =>
  request({
    url: '/lms/lazadafbl/getPlatformProducts',
    method: 'GET',
    params: data
  });
export const updatePlatformProducts = (data) =>
  request({
    url: '/lms/lazadafbl/updatePlatformProducts',
    method: 'POST',
    data
  });
