import request from '@/utils/request';

// 查询
export const queryList = (data) =>
  request({
    url: '/lms/lazadaNewCampaign/list',
    method: 'POST',
    loading: true,
    data
  });
// 获取活动类型
export const listCampaignType = () =>
  request({
    url: '/lms/lazadaNewCampaign/listCampaignType',
    loading: true,
    method: 'GET'
  });
// 修改折扣
export const modifyDiscount = (data) =>
  request({
    url: '/lms/lazadaNewCampaign/modifyDiscount',
    loading: true,
    method: 'POST',
    params: data
  });
// 提交活动
export const commitCampaign = (data) =>
  request({
    url: '/lms/lazadaNewCampaign/commitCampaign',
    loading: true,
    method: 'POST',
    params: data
  });
