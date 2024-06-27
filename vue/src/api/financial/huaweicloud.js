import request from '@/utils/request';

// 获取手机号接口
export const getPhoneNumberApi = (data) => {
  return request({
    url: '/lms/Dyjiema/getPhone',
    method: 'POST',
    data
  });
};

// 获取短信
export const getMessageApi = (data) => {
  return request({
    url: '/lms/Dyjiema/getMsg',
    method: 'POST',
    data
  });
};
