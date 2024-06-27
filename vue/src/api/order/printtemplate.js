/*
 * @Author: ztao
 * @Date: 2023-08-22 10:52:56
 * @LastEditTime: 2024-01-08 16:24:23
 * @Description:
 */
import request from '@/utils/request';

// 获取模板类型枚举
export const getTemplateTypeApi = () => {
  return request({
    url: '/lms/enum/print/templateType'
  });
};

// 查询全部面板
export const getTplListApi = (data) => {
  return request({
    url: `/lms/printTemplate/list?templateName=${data.templateName}&templateType=${data.templateType}&status=${data.status}&limit=${data.limit}&page=${data.page}`
  });
};

// 修改备注remark，状态status
export const updateApi = (data) => {
  return request({
    url: '/lms/printTemplate/update',
    method: 'post',
    data
  });
};
//修改名称name
export const updateNameApi = (data) => {
  return request({
    url: '/lms/printTemplate/updateNameById',
    method: 'post',
    data,
    loading: true
  });
};

// 新建面单模板
// 参数: templateName=模板名称 非空
// templateType=模板类型 非空
// width=宽 mm height=高 mm 宽高非空
// remark=备注 可空
// sourcePrintTemplateId=来源模板id，可空（复制面单模板时传值）
export const createApi = (data) => {
  return request({
    url: '/lms/printTemplate/create',
    method: 'post',
    data
  });
};

// 获取面单模板详情
export const getTplInfoApi = (id) => {
  return request({
    url: `/lms/printTemplate/detail?id=${id}`
  });
};

// 获取模板适用的组件列表
export const getTplTypeApi = (templateType) => {
  return request({
    url: `/lms/printTemplateItem/listByType?templateType=${templateType}`
  });
};

// 预览模板
export const previewTplApi = (id) => {
  return request({
    url: `/lms/printTemplate/unLogin/preview?id=${id}`
  });
};

// 保存模板 id=模板id templateHtml=模板html
export const saveTplApi = (data) => {
  return request({
    url: '/lms/printTemplate/updateTpl',
    method: 'post',
    data
  });
};

// 增加保存预设图片
export const addPreImg = (data) => {
  return request({
    url: `/lms/printTemplateItem/addPreImg`,
    method: 'post',
    loading: true,
    data
  });
};

// 添加本地图片或网络图片后先调用接口判断文件类型
export const validateImgApi = (url) => {
  return request({
    url: `/lms/printTemplateItem/validateImg`,
    method: 'post',
    loading: true,
    data: { imgData: url }
  });
};

// 该面单的有权限用户列表
export const getPermissionListApi = (data) =>
  request({
    url: `/lms/sysPermissionCommon/queryUserNameAndOrgNameByResourceVal`,
    method: 'post',
    loading: true,
    data
  });

// 增加该用户对该面单的使用权限
export const addPermissionApi = (data) =>
  request({
    url: `/lms/sysPermissionCommon/multipleMasterValAddSinglePermission`,
    method: 'post',
    loading: true,
    data
  });

// 取消该用户对该面单的使用权限
export const cancelPermissionApi = (data) =>
  request({
    url: `/lms/sysPermissionCommon/cancelPermission`,
    method: 'post',
    loading: true,
    data
  });
