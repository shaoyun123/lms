import request from '@/utils/request';

//余额表格查询
export const getWfBalanceApi = (data) => {
  return request({
    url: '/lms/wfBalance/queryPage',
    method: 'POST',
    data
  });
};

// 同步余额
export const syncBalanceApi = (data) => {
  return request({
    url: '/lms/wfBalance/syncBalance',
    method: 'POST',
    data
  });
};

// 页面初始化配置
export const wfTransactionConfig = () => {
  return request({
    url: '/lms/wfTransaction/pageConfig',
    method: 'POST'
  });
};

// 页面查询
export const wfTransactionQuery = (data) => {
  return request({
    url: '/lms/wfTransaction/queryPage',
    method: 'POST',
    data
  });
};

// 查看关联交易
export const queryRelationTransactionApi = (data) => {
  return request({
    url: '/lms/wfTransaction/queryRelationTransaction',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    data
  });
};
