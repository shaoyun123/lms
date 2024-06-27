import request from '@/utils/request';
// import qs from 'qs';

// 商品类目必填项 查询
export const queryCateReqiuredListApi = (data) => {
  return request({
    url: '/lms/tiktok/categoryRequired/query',
    method: 'POST',
    loading: true,
    data
  });
};

// 商品类目必填项 添加或者修改
export const updateCateReqiuredApi = (data) => {
  return request({
    url: '/lms/tiktok/categoryRequired/updateOrAddProdCateAttr',
    method: 'POST',
    data
  });
};

// 查询
export const queryApi = (data) => {
  return request({
    url: '/lms/tiktok/tiktokExtraInfo/pageQuery',
    method: 'POST',
    loading: true,
    data
  });
};

// 初始化
export const initApi = () => {
  return request({
    url: '/lms/tiktok/tiktokExtraInfo/init',
    loading: true
  });
};

// 删除
export const deleteApi = (ids) => {
  return request({
    url: `/lms/tiktok/tiktokExtraInfo/deleteByIds?ids=${ids}`,
    loading: true
  });
};

// 批量修改补充信息
export const batchSaveOrUpdateApi = (data) => {
  return request({
    url: `/lms/tiktok/tiktokExtraInfo/batchSaveOrUpdate`,
    method: 'post',
    loading: true,
    data
  });
};

// 获取当前类目的类目必填项
export const getDefaultValApi = (categoryId) => {
  return request({
    url: `/lms/tiktok/tiktokExtraInfo/getDefaultMandatoryAttrValue?categoryId=${categoryId}`,
    loading: true
  });
};

// 修改在线listing类目
export const updateCategoryApi = (data) => {
  return request({
    url: `/lms/tiktok/tiktokExtraInfo/updateCategory`,
    loading: true,
    method: 'post',
    data
  });
};
