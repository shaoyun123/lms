/*
 * @Author: ztao
 * @Date: 2023-03-19 18:09:30
 * @LastEditTime: 2023-03-19 18:09:45
 * @Description:
 */
import request from '@/utils/request';

// 获取列表
export const queryList = (data) =>
  request({
    url: '/lms/whaeReplOrder/queryList',
    method: 'post',
    data
  });
// 更新列表
export const updateList = (data) =>
  request({
    url: '/lms/whaeReplOrder/updateList',
    method: 'post',
    data
  });
// 提交采购
export const submitToPurchase = (data) =>
  request({
    url: '/lms/whaePurConfirm/submitToPurchase',
    method: 'post',
    data
  });
// 需要发货数量
export const updateDetailList = (data) =>
  request({
    url: '/lms/whaeReplOrder/updateDetailList',
    method: 'post',
    data
  });
