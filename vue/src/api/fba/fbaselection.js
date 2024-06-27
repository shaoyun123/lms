import request from '@/utils/request';

// 查询基础模板
export const queryChooseItemsTemplate = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/queryChooseItemsTemplate',
    method: 'POST',
    data
  });
};
// 查询FBA选品
export const queryFbaChooseItemsTemplate = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/queryFbaChooseItemsTemplate',
    method: 'POST',
    data
  });
};
// 计算预估售价
export const calculatePredictPrice = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/calculatePredictPrice',
    method: 'POST',
    data: data
  });
};
// 计算销售方式
export const calculateSalesType = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/calculateSalesType',
    method: 'POST',
    data: data
  });
};
// 提交选品
export const saveFbaChooseItems = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/saveFbaChooseItems',
    method: 'POST',
    data
  });
};
// 选品审核
export const updateChooseItemsAudit = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/updateChooseItemsAudit',
    method: 'POST',
    data
  });
};
// 刊登审核
export const updateChooseItemsPublishStatus = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/updateChooseItemsPublishStatus',
    method: 'POST',
    data
  });
};
// 提交刊登
export const publishAsin = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/publishAsin',
    method: 'POST',
    data
  });
};
// 选品人
export const getPersonAndOrgsByRole = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/sys/getPersonAndOrgsByRole.html',
    method: 'POST',
    data
  });
};

// 查询PSKU是否重复
export const checkRepeatProdPID = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/checkRepeatProdPID',
    method: 'POST',
    data
  });
};
// 查询FBA选品信息详情
export const queryFbaChooseItemsDtoById = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/queryFbaChooseItemsDtoById',
    method: 'POST',
    data
  });
};
// FBA选品编辑保存
export const reEditFbaChooseItems = (data) => {
  delete data.profitList;
  return request({
    url: '/lms/fba/chooseItems/reEditFbaChooseItems',
    method: 'POST',
    data
  });
};

// 操作日志
export const getOperateLogs = (data) => {
  return request({
    url: '/lms/fba/chooseItems/listLog',
    method: 'POST',
    data
  });
};

// 常用备注
export const getUsualRemark = () => {
  return request({
    url: '/lms/sysdict/getBizDictByCode?headCode=FBA_SELECTION_COMMON_REMARK',
    method: 'GET'
  });
};
