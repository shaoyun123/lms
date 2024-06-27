import request from '@/utils/request';
import qs from 'qs';

// 更新
export function updateApi(data) {
  return request({
    url: '/lms/dingtalk/updateDingTalkUser',
    method: 'post',
    data
  });
}

// 查询
export function queryListApi(data) {
  return request({
    url: '/lms/dingtalk/queryDingTalkUser',
    method: 'post',
    data: qs.stringify(data)
  });
}
