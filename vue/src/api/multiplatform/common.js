import request from '@/utils/request';

// 通用的获取打印信息接口
// temu 商品标签  "tplName": "TEMU商品标签","printTplType": "PLAT_PROD_LABEL"为固定传参
export const commonGetPrintInfoApi = (data) =>
  request({
    url: '/lms/printTemplate/common/getPrintInfo',
    method: 'post',
    loading: true,
    data
  });

// 通用的获取打印信息接口,和接口返回信息
export const commonGetPrintInfoAndWrongMsgApi = (data) =>
  request({
    url: '/lms/printTemplate/common/getPrintInfo',
    method: 'post',
    loading: true,
    needWrongMsg: true,
    data
  });
