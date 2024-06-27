import request from '@/utils/request';
// import qs from 'qs';

// amazon 类目
export const querAmazonCate = (data) => {
  return request({
    url: '/lms/prodcate/getAmazonCateTreeBySalesSite',
    method: 'get',
    params: data
  });
};

// 平台佣金弹框查询
export const queryCommisionRuleList = (data) => {
  return request({
    url: '/lms/fba/commisionRule/search',
    method: 'post',
    data: data
  });
};

export const getFbaPriceConfigHomePage = () => {
  return request({
    url: '/lms/fba/fbaPriceConfig/getFbaPriceConfigHomePage',
    method: 'get',
    loading: true
  });
};

export const listFbaPriceConfigTypeEnum = () => {
  return request({
    url: '/lms/fba/fbaPriceConfig/listFbaPriceConfigTypeEnum',
    method: 'get'
  });
};

export const getAllAmazonSite = () => {
  return request({
    url: '/lms/onlineProductAmazon/getAllAmazonSite.html',
    method: 'get'
  });
};

// 保存或者编辑
export const saveOrEdit = (data) => {
  return request({
    url: '/lms/fba/commisionRule/saveOrEdit',
    method: 'post',
    data: data,
    loading: true
  });
};

// 删除
export const deleteByParentRuleId = (data) => {
  return request({
    url: '/lms/fba/commisionRule/deleteByParentRuleId',
    method: 'get',
    params: data
  });
};

// 日志
export const getOperLog = (data) => {
  return request({
    url: '/lms/fba/fbaPriceConfig/getOperLog',
    method: 'get',
    params: data
  });
};
