import request from '@/utils/request';

// ozon模板---start

// 基础模板查询&ozon模板查询
export const getOzonModelList = (data) => {
  return request({
    url: '/lms/ozonModel/getOzonModelList',
    method: 'POST',
    loading: true,
    data: data
  });
};
// oa新类目&ozon类目
export const searchCates = (data) => {
  return request({
    url: '/lms/prodCateOaMapping/searchCates',
    method: 'POST',
    loading: true,
    data: data
  });
};
// 开发专员
export const listuserbyrole = (data) => {
  return request({
    url: '/lms/sys/listuserbyrole.html',
    method: 'POST',
    loading: true,
    data: data
  });
};
// // 模板创建人
// export const getModelCreatorList = () => {
//   return request({
//     url: '/lms/mercadoModel/getModelCreatorList',
//     method: 'POST'
//   });
// };
// 开发类型
export const getPreProdDevTypeEnum = (data) => {
  return request({
    url: '/lms/enum/getPreProdDevTypeEnum.html',
    method: 'POST',
    loading: true,
    data: data
  });
};
// 商品标签
export const listdict = (data) => {
  return request({
    url: '/lms/sys/listdict.html',
    method: 'POST',
    loading: true,
    data: data
  });
};
// 物流属性
export const getLogisAttrEnum = (data) => {
  return request({
    url: '/lms/enum/getLogisAttrEnum.html',
    method: 'POST',
    loading: true,
    data: data
  });
};
// 基础模板信息查询
export const getAllColumnByPId = (prodPId) => {
  return request({
    url: '/lms/ozonModel/getAllColumnByPId?prodPId=' + prodPId,
    loading: true,
    method: 'POST'
  });
};
// 根据ozon类目查询变种属性
export const queryForCreateOzon = (data) => {
  return request({
    url: '/lms/ozonModel/queryForCreate',
    method: 'POST',
    loading: true,
    data: data
  });
};
// ozon模板编辑回显
export const queryForEdit = (modelPId) => {
  return request({
    url: '/lms/ozonModel/queryForEdit?modelPId=' + modelPId,
    loading: true,
    method: 'POST'
  });
};
// ozon模板新增保存
export const addOzonModel = (data) => {
  return request({
    url: '/lms/ozonModel/addOzonModel',
    loading: true,
    method: 'POST',
    data: data
  });
};
// ozon模板编辑保存
export const editOzonModel = (data) => {
  return request({
    url: '/lms/ozonModel/editOzonModel',
    loading: true,
    method: 'POST',
    data: data
  });
};
// ozon模板删除
export const deleteOzonModelListing = (data) => {
  return request({
    url: '/lms/ozonModel/deleteOzonModelListing',
    loading: true,
    method: 'POST',
    data: data
  });
};

// 新建模板/编辑模板,新增变种
export const getAddVariation = (data) => {
  return request({
    url: '/lms/ozonModel/getAddVariation',
    loading: true,
    method: 'POST',
    params: data
  });
};
// 获取ozon模板部分角色用户列表
export const getOzonModelOperator = (userType) => {
  return request({
    url: '/lms/ozonModel/getOzonModelOperator?userType=' + userType,
    loading: true,
    method: 'GET'
  });
};
// // ozon模板--批量删除
// export const batchDelMercadoModel = (modelPIds) => {
//   console.log(modelPIds);
//   return request({
//     url: `/lms/mercadoModel/batchDelMercadoModel?modelPIds=` + modelPIds,
//     method: 'DELETE'
//   });
// };
// // ozon模板--查询mercado类目不存在模板
// export const geNoPlatCatetModel = () => {
//   return request({
//     url: `/lms/mercadoModel/geNoPlatCatetModel`,
//     method: 'GET'
//   });
// };
// ozon模板---end
