/*
 * @Author: ztao
 * @Date: 2022-05-28 22:56:51
 * @LastEditTime: 2023-07-11 18:35:24
 * @Description: 登录 获取菜单等操作
 */
import request from '@/utils/request';
import qs from 'qs';
/**
 * 登录接口
 * @param {obj} data 账户密码集合
 * @returns 登录状态
 */
export const loginApi = (data) => {
  return request({
    url: '/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(data)
  });
};

//获取菜单
export const getMenusApi = () => {
  return request({
    url: '/lms/menu.html',
    method: 'get'
  });
};

//退出登录
export const logoutApi = () => {
  return request({
    url: '/logout',
    method: 'post'
  });
};
//用户菜单接口
export const getUserMenusApi = () => {
  return request({
    url: '/lms/sysresourcenew/user/resource/combtree',
    method: 'get'
  });
};

//用户信息接口
export const getUserInfoApi = () => {
  return request({
    url: '/lms/sysuser/getMyUserInfo.html',
    method: 'post'
  });
};
//修改用户信息
export const modifyUserInfoApi = (obj) => {
  const { gender, birthdayStr, mobile, email } = obj;
  return request({
    url: '/lms/sysuser/modifyMyUserInfo.html',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify({
      gender,
      birthdayStr,
      mobile,
      email
    })
  });
};
//修改密码
export const modifyPwdApi = (obj) => {
  const { oldPassword, password, repassword } = obj;
  return request({
    url: '/lms/sysuser/modifypwd.html',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify({
      oldPassword,
      password,
      repassword
    })
  });
};
// //  包装等环节展示个人及排名数据
// export const getRankingData = () =>
//   request({
//     url: '/lms/platorder/getRankingData',
//     loading: true,
//     method: 'GET'
//   });
