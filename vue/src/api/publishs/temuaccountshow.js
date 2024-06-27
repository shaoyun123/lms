import request from '@/utils/request';

// 查询列表
export const getManifestApi = (data) => {
  return request({
    url: '/lms/temu/account/manifest',
    method: 'POST',
    data: data
  });
};
