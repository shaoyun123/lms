import request from '@/utils/request';
import qs from 'qs';

// 列表查询
export const queryListApi = (data) =>
  request({
    url: '/lms/fyndiqAutoDelete/searchRule',
    method: 'post',
    data
  });

// 新增或编辑
export const saveOrEdit = (data) =>
  request({
    url: '/lms/fyndiqAutoDelete/saveOrEdit',
    method: 'post',
    data
  });

// 查询日志
export const searchRuleLog = (data) =>
  request({
    url: '/lms/fyndiqAutoDelete/searchRuleLog',
    method: 'post',
    data
  });

// 开关
export const enableOrDisableRule = (data) =>
  request({
    url: '/lms/fyndiqAutoDelete/enableOrDisableRule',
    method: 'post',
    data
  });

// 操作类型枚举
export const getAutoDeleteListingRuleOperType = () =>
  request({
    url: '/lms/fyndiqAutoDelete/getFyndiqAutoDeleteListingRuleOperType',
    method: 'get'
  });

// 检查规则命中的item数量
export const checkRuleHitNum = (data) =>
  request({
    url: '/lms/fyndiqAutoDelete/checkRuleHitNum',
    method: 'post',
    data
  });

// 查询店铺
export const getStoreListApi = (data = {}) => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    data: qs.stringify({
      roleNames: 'fyndiq专员',
      orgId: data.orgId,
      salePersonId: data.salePersonId,
      platCode: 'fyndiq'
    })
  });
};
