/*
 * @Author: ztao
 * @Date: 2023-08-22 10:52:56
 * @LastEditTime: 2023-12-27 15:43:34
 * @Description:
 */
import request from '@/utils/request';

// 获取钉钉jobhandler list
export function queryListApi(data) {
  return request({
    url: '/lms/dingtalk/robotJobHandlerConfig/list',
    method: 'post',
    data
  });
}

// 获取钉钉机器人list
export function getRobotListApi() {
  return request({
    url: '/lms/dingtalk/robotConfig/list'
  });
}

// 删除任务配置
export function delApi(data) {
  return request({
    url: `/lms/dingtalk/robotJobHandlerConfig/delete/${
      data.robotCode
    }/${decodeURI(data.businessType)}`,
    method: 'delete'
  });
}

// 新增机器人任务配置
export function addNewApi(data) {
  return request({
    url: '/lms/dingtalk/robotJobHandlerConfig/new',
    method: 'post',
    data
  });
}

// SendMessageBusinessType
export function sendMsgTypeApi() {
  return request({
    url: '/lms/enum/getDingTalkSendMessageBusinessTypeEnum'
  });
}
//编辑备注
export function remarkApi(data) {
  return request({
    url: `/lms/dingtalk/updateRemark`,
    method: 'get',
    params: data,
    loading: true
  });
}
