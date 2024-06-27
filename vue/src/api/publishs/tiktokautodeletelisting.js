import request from '@/utils/request';

// 列表查询
export const queryListApi = (data) =>
  request({
    url: '/lms/tiktokAutoDeleteListingRule/searchRule',
    method: 'post',
    data,
    timeout: 'disabled'
  });

// 新增或编辑
export const saveOrEdit = (data) =>
  request({
    url: '/lms/tiktokAutoDeleteListingRule/saveOrEdit',
    method: 'post',
    data
  });

// 查询日志
export const searchRuleLog = (data) =>
  request({
    url: '/lms/tiktokAutoDeleteListingRule/searchRuleLog',
    method: 'post',
    data
  });

// 开关
export const enableOrDisableRule = (data) =>
  request({
    url: '/lms/tiktokAutoDeleteListingRule/enableOrDisableRule',
    method: 'post',
    data
  });

// 操作类型枚举
export const getTiktokAutoDeleteListingRuleOperType = () =>
  request({
    url: '/lms/tiktokAutoDeleteListingRule/getTiktokAutoDeleteListingRuleOperType',
    method: 'get'
  });

// 删除商品平台状态枚举
export const getTkProdPlatStatusEnum = () =>
  request({
    url: '/lms/tiktokAutoDeleteListingRule/getProdPlatStatusEnum',
    method: 'get'
  });

// 检查规则命中的item数量
export const checkRuleHitNum = (data) =>
  request({
    url: '/lms/tiktokAutoDeleteListingRule/checkRuleHitNum',
    method: 'post',
    data
  });
