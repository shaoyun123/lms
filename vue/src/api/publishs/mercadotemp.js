import request from '@/utils/request';

// 美客多模板---start
// oa新类目&美客多类目
export const searchCates = (data) => {
  return request({
    url: '/lms/prodCateOaMapping/searchCates',
    method: 'POST',
    data: data
  });
};
// 美客多类目
export const searchLazadaCate = (data) => {
  return request({
    url: '/lms/lazada/searchLazadaCate.html',
    method: 'POST',
    data: data
  });
};
// 开发专员
export const listuserbyrole = (data) => {
  return request({
    url: '/lms/sys/listuserbyrole.html',
    method: 'POST',
    data: data
  });
};
// 模板创建人
export const getModelCreatorList = () => {
  return request({
    url: '/lms/mercadoModel/getModelCreatorList',
    method: 'POST'
  });
};
// 开发类型
export const getPreProdDevTypeEnum = (data) => {
  return request({
    url: '/lms/enum/getPreProdDevTypeEnum.html',
    method: 'POST',
    data: data
  });
};
// 商品标签
export const listdict = (data) => {
  return request({
    url: '/lms/sys/listdict.html',
    method: 'POST',
    data: data
  });
};
// 物流属性
export const getLogisAttrEnum = (data) => {
  return request({
    url: '/lms/enum/getLogisAttrEnum.html',
    method: 'POST',
    data: data
  });
};
// 基础模板查询
export const getMercadoBaseModelList = (data) => {
  return request({
    url: '/lms/mercadoModel/getMercadoBaseModelList',
    method: 'POST',
    data: data
  });
};
// 美客多模板查询
export const getMercadoModelList = (data) => {
  return request({
    url: '/lms/mercadoModel/getMercadoModelList',
    method: 'POST',
    data: data
  });
};
// 基础模板信息查询
export const getAllColumnByPId = (prodPId) => {
  return request({
    url: '/lms/mercadoModel/getAllColumnByPId?prodPId=' + prodPId,
    method: 'POST'
  });
};
// 根据美客多类目查询变种属性
export const queryForCreate = (data) => {
  return request({
    url: '/lms/mercadoModel/queryForCreate',
    method: 'POST',
    data: data
  });
};
// 美客多模板编辑回显
export const queryForEdit = (modelPId) => {
  return request({
    url: '/lms/mercadoModel/queryForEdit?modelPId=' + modelPId,
    method: 'POST'
  });
};
// 美客多模板编辑保存
export const addMercadoModel = (data) => {
  return request({
    url: '/lms/mercadoModel/addMercadoModel',
    method: 'POST',
    data: data
  });
};
// 美客多模板新增保存
export const editMercadoModel = (data) => {
  return request({
    url: '/lms/mercadoModel/editMercadoModel',
    method: 'POST',
    data: data
  });
};
// 美客多模板删除
export const delMercadoModel = (id) => {
  return request({
    url: '/lms/mercadoModel/delMercadoModel?modelPId=' + id,
    method: 'POST'
  });
};

// 美客多模板--批量删除
export const batchDelMercadoModel = (modelPIds) => {
  console.log(modelPIds);
  return request({
    url: `/lms/mercadoModel/batchDelMercadoModel?modelPIds=` + modelPIds,
    method: 'DELETE'
  });
};

// 美客多模板--查询mercado类目不存在模板
export const geNoPlatCatetModel = () => {
  return request({
    url: `/lms/mercadoModel/geNoPlatCatetModel`,
    method: 'GET'
  });
};
// 美客多模板---end
