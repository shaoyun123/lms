import request from '@/utils/request';
import qs from 'qs';

// 查询
export function queryOrgTreeApi() {
  return request({
    url: '/lms/sys/getAllOrgTree'
  });
}

// 搜索用户  参考配置-用户-组织用户的搜索接口
// page: 1
// limit: 100
// orgId: 144
// loginName:
// companyName:
// roleName:
// status:
export function queryUserApi(data) {
  return request({
    url: '/lms/sys/userPage.html',
    method: 'post',
    data: qs.stringify(data)
  });
}

// 查询同步进度的定时任务
export function getSyncProcessByBatchNoApi(data) {
  return request({
    url: '/lms/syncItem/getSyncProcessByBatchNo.html',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });
}

// 店铺级联缓存手动刷新
export function refreshStoreCascaderoApi(platCode) {
  return request({
    url: `/lms/sys/refreshStoreCascader/${platCode}`,
    needWrongMsg: true,
    loading: true
  });
}
