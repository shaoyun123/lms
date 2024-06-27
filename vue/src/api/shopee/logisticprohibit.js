import request from '@/utils/request';
import qs from 'qs';

// 页面查询
export const queryPageApi = (data) =>
  request({
    url: '/lms/shopee/logistic/listCategoryLogisticProhibitInfos',
    method: 'post',
    loading: true,
    data
  });

// 创建人
export const getCreatorListApi = () =>
  request({
    url: '/lms/shopee/logistic/listCategoryLogisticProhibitCreators',
    loading: true
  });

// 修改人
export const getModifierListApi = () =>
  request({
    url: '/lms/shopee/logistic/listCategoryLogisticProhibitModifiers',
    loading: true
  });

// 修改状态
export const modifyRuleStatusApi = (data) =>
  request({
    url: '/lms/shopee/logistic/modifyRuleStatus',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });

//   根据站点查物流方式
export const getLogisticChanelBySalesSiteApi = (saleSite) =>
  request({
    url: `/lms/shopee/logistic/listLogisticChanelBySalesSite/${saleSite}`,
    loading: true
  });
// 新增
export const addNewApi = (data) =>
  request({
    url: '/lms/shopee/logistic/newLogisticProhibitInfo',
    method: 'post',
    loading: true,
    data
  });
// 修改
export const updateApi = (data) =>
  request({
    url: '/lms/shopee/logistic/updateLogisticProhibitInfo',
    method: 'post',
    loading: true,
    data
  });
