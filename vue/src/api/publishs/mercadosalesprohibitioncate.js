import request from '@/utils/request';

// 查询
export const queryList = (data) => {
  return request({
    url: '/lms/prodCateProhibit/queryList',
    method: 'POST',
    data: data
  });
};
// 删除
export const merDelete = (data) => {
  return request({
    url: '/lms/prodCateProhibit/delete',
    method: 'POST',
    data: data
  });
};
// 创建人查询
export const getCreatorList = (data) => {
  return request({
    url: '/lms/prodCateProhibit/getCreatorList',
    method: 'GET',
    data: data
  });
};
