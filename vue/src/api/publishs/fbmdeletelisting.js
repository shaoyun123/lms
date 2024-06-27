import request from '@/utils/request';
import qs from 'qs';

// 列表查询
export const queryListApi = (data) =>
  request({
    url: '/lms/amazon/autoEndListingRule/queryPage',
    method: 'post',
    data
  });

// 新增或编辑
export const saveOrEdit = (data) =>
  request({
    url: '/lms/amazon/autoEndListingRule/saveOrEdit',
    method: 'post',
    data
  });

// 查询日志
export const searchRuleLog = (params) =>
  request({
    url: '/lms/amazon/autoEndListingRule/searchRuleLog',
    method: 'get',
    params
  });

// 开关
export const enableOrDisableRule = (data) =>
  request({
    url: '/lms/fyndiqAutoDelete/enableOrDisableRule',
    method: 'post',
    data
  });

// 检查规则命中的item数量
export const checkRuleHitNum = (data) =>
  request({
    url: '/lms/amazon/autoEndListingRule/checkRuleHitNum',
    method: 'post',
    data
  });

// 查询店铺
export const getStoreListApi = (data = {}) => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    data: qs.stringify({
      roleNames: 'amazon专员',
      orgId: data.orgId,
      salePersonId: data.salePersonId,
      platCode: 'amazon'
    })
  });
};

// 查询站点
export const getFBMSiteListApi = (data) => {
  return request({
    url: '/lms/salesplat/filterAmzonSiteByStoreAcctIdList',
    method: 'POST',
    data
  });
};
