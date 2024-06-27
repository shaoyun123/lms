/*
 * @Author: ztao
 * @Date: 2023-05-24 14:03:45
 * @LastEditTime: 2023-05-29 15:56:00
 * @Description:
 */
import request from '@/utils/request';
import qs from 'qs';

//获取平台接口
export const getPlatform = () => {
  return request({
    url: '/lms/enum/getSalesPlatEnum.html',
    method: 'get',
    loading: true
  });
};
//根据平台获取店铺,接口/lms/emailConfig/queryStoreAcct.html
export const getStore = (platCode) => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: qs.stringify({
      platCode: platCode,
      roleNames: `${platCode}专员`
    }),
    loading: true
  });
};
//根据查询条件获取标零补货配置列表,接口/lms/sysTimingTaskNew/getSysTimingTaskParamNew,post请求
export const getSysTimingTaskParamNew = (data) => {
  return request({
    url: '/lms/sysTimingTaskNew/getSysTimingTaskParamNew',
    method: 'post',
    data: data,
    loading: true
  });
};
//删除标零补货规则,delete请求,接口/lms/sysTimingTaskNew/deleteSysTimingTaskParamNew/{id}
export const deleteSysTimingTaskParamNew = (id) => {
  return request({
    url: `/lms/sysTimingTaskNew/deleteSysTimingTaskParamNew/${id}`,
    method: 'delete',
    loading: true
  });
};
//设置标零补货 默认规则,post请求,接口/lms/sysTimingTaskNew/setDefaultRule
export const setDefaultRule = (data) => {
  return request({
    url: '/lms/sysTimingTaskNew/setDefaultRule',
    method: 'post',
    data: data,
    loading: true
  });
};
//匹配店铺查询,post请求,接口/lms/sysTimingTaskNew/getMatchStore
export const getMatchStore = (data) => {
  return request({
    url: '/lms/sysTimingTaskNew/getMatchStore',
    method: 'post',
    data: data,
    loading: true
  });
};
//匹配店铺保存,post请求,接口/lms/sysTimingTaskNew/setMatchStore
export const setMatchStore = (data) => {
  return request({
    url: '/lms/sysTimingTaskNew/setMatchStore',
    method: 'post',
    data: data,
    loading: true
  });
};

//保存标零补货规则,post请求,接口/lms/sysTimingTaskNew/saveOrUpdateSysTimingTaskParamNew
export const saveOrUpdateSysTimingTaskParamNew = (data) => {
  return request({
    url: '/lms/sysTimingTaskNew/saveOrUpdateSysTimingTaskParamNew',
    method: 'post',
    data: data,
    loading: true
  });
};
//获取所有的仓库,post请求,无参数,接口/lms/prodWarehouse/getAuthedProdWarehouse.html
export const getAllWarehouses = () => {
  return request({
    url: '/lms/prodWarehouse/getAuthedProdWarehouse.html',
    method: 'post',
    loading: true
  });
};
//查询标零或补货的不处理条件,post请求,接口/lms/sysTimingFilterNew/getIgnoreParam
export const getIgnoreParam = (data) => {
  return request({
    url: '/lms/sysTimingFilterNew/getIgnoreParam',
    method: 'post',
    data: data,
    loading: true
  });
};
//获取商品标签,get请求,接口/lms/sys/listdict.html?headCode=prod_tag
export const getProdtags = () => {
  return request({
    url: '/lms/sys/listdict.html?headCode=prod_tag',
    method: 'get',
    loading: true
  });
};
//ebay/lazada/amazon三个平台需要请求站点,接口/lms/sysTiming/getSiteInfo.html,post请求
export const getSiteInfo = (platCode) => {
  return request({
    url: '/lms/sysTiming/getSiteInfo.html',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: qs.stringify({
      plat_code: platCode
    }),
    loading: true
  });
};
//修改或更新不处理条件,post请求,接口/lms/sysTimingFilterNew/setIgnoreParam
export const setIgnoreParam = (data) => {
  return request({
    url: '/lms/sysTimingFilterNew/setIgnoreParam',
    method: 'post',
    data: data,
    loading: true
  });
};

//删除不处理条件,delete请求,接口/lms/sysTimingFilterNew/deleteIgnoreParamById/{id}
export const deleteIgnoreParamById = (id) => {
  return request({
    url: `/lms/sysTimingFilterNew/deleteIgnoreParamById/${id}`,
    method: 'delete',
    loading: true
  });
};

// 查看日志
export const getLogListApi = (data) => {
  return request({
    url: `/lms/sysTimingTaskNew/getOperLog/${data.ruleId}`,
    method: 'post',
    data: data.pageInfo,
    loading: true
  });
};
// 查看日志
export const getFilterLogListApi = (data) => {
  return request({
    url: `/lms/sysTimingFilterNew/getOperLog/${data.ruleId}`,
    method: 'post',
    data: data.pageInfo,
    loading: true
  });
};
