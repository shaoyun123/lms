import request from '@/utils/request';
import qs from 'qs';
// 聊天公共部分
/**
 * 查询模板类型
 */
export function getTplTypeListApi(platCode) {
  return request({
    method: 'POST',
    url: '/lms/sys/email/listTemplateType',
    loading: true,
    data: qs.stringify({ platCode })
  });
}

/**
 * 获取模板消息
 * @param {Object} obj 传入
 */
export function getTplNameListApi(data) {
  return request({
    method: 'POST',
    url: '/lms/sys/email/listTemplateName',
    loading: true,
    data
  });
}

/**
 * 获取模板消息详情
 */
export function getTplContentApi(id) {
  return request({
    method: 'POST',
    url: '/lms/sys/email/getEmailContent',
    loading: true,
    data: qs.stringify({ id })
  });
}
