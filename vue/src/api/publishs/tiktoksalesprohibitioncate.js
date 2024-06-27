import request from '@/utils/request';
// 新增禁售类目
export const addProhibitCate = (data) => {
  return request({
    url: '/lms/prodCateTiktokProhibit/addProhibitCate',
    method: 'POST',
    params: data
  });
};
// 获取创建人列表
export const getAllCreators = () => {
  return request({
    url: '/lms/prodCateTiktokProhibit/getAllCreators',
    method: 'GET'
  });
};
// 查询禁售类目
export const queryPage = (data) => {
  return request({
    url: '/lms/prodCateTiktokProhibit/queryPage',
    method: 'POST',
    data: data
  });
};
// 批量删除禁售类目
export const batchRemoveProhibitCate = (data) => {
  return request({
    url: '/lms/prodCateTiktokProhibit/batchRemoveProhibitCate',
    method: 'DELETE',
    params: data
  });
};
// 修改备注
export const updateRemarkById = (data) => {
  return request({
    url: '/lms/prodCateTiktokProhibit/updateRemarkById',
    method: 'PUT',
    params: data
  });
};
// 获取创建人列表
export const getAllCreatorsWhitelist = () => {
  return request({
    url: '/lms/tiktokCateWhitelist/getAllCreators',
    method: 'GET'
  });
};
// 白名单查询
export const queryPageWhitelist = (data) => {
  return request({
    url: '/lms/tiktokCateWhitelist/queryPage',
    method: 'POST',
    data: data
  });
};
// 批量删除白名单类目
export const batchRemoveWhitelistCate = (data) => {
  return request({
    url: '/lms/tiktokCateWhitelist/batchRemoveWhitelistCate',
    method: 'DELETE',
    params: data
  });
};
