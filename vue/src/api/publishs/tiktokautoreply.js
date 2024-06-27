import request from '@/utils/request';
import qs from 'qs';

// 初始化
export const initApi = () =>
  request({
    url: '/chat/tiktok/autoReplyRule/init',
    loading: true
  });

// 列表查询
export const queryListApi = (data) =>
  request({
    url: '/chat/tiktok/autoReplyRule/query',
    method: 'post',
    data
  });

// 添加规则
export const addRuleApi = (data) =>
  request({
    url: '/chat/tiktok/autoReplyRule/addRule',
    method: 'post',
    data
  });

// 修改
export const updateApi = (data) =>
  request({
    url: '/chat/tiktok/autoReplyRule/updateAutoReplyRule',
    method: 'post',
    data
  });

// 开关策略
export const updateRuleStatusApi = (data) =>
  request({
    url: '/chat/tiktok/autoReplyRule/updateRuleStatus',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });

// 删除自动回复策略
export const delRuleApi = (data) =>
  request({
    url: '/chat/tiktok/autoReplyRule/deleteAutoReplyRuleByIds',
    method: 'DELETE',
    data
  });

// 根据策略id 站点 店铺名 查询策略关联店铺，结果仅展示操作用户拥有权限的店铺
export const listStoreAcctByRuleIdApi = (data) =>
  request({
    url: `/chat/tiktok/autoReplyRule/listStoreAcctByRuleId?ruleId=${data.ruleId}&salesSite=${data.salesSite}&storeAcct=${data.storeAcct}`,
    loading: true
  });

// 修改开启策略的店铺，由于与权限有关，需要传入原该用户拥有权限开启该策略的
export const updateShopRefApi = (data) =>
  request({
    url: '/chat/tiktok/autoReplyRule/updateShopRef',
    method: 'post',
    data: qs.stringify(data)
  });
