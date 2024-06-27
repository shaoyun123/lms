/*
 * @Author: ztao
 * @Date: 2023-02-13 14:46:13
 * @LastEditTime: 2023-03-23 14:04:38
 * @Description:
 */
export const isExternal = (path) => {
  const reg = /^(https?:|mailto:|tel:)/;
  return reg.test(path);
};

export const isArray = (arg) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
};

export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true;
  }
  return false;
}

export const isValidURL = (url) => {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
};

/**
 * 判断数据是否为空值
 */
export function isNull(data) {
  if (!data) return true;
  if (JSON.stringify(data) === '{}') return true;
  if (JSON.stringify(data) === '[]') return true;
  return false;
}

/**
 * 判断数据是否为空值
 */
export function isEmptyNotObject(data) {
  if (data === undefined) return true;
  if (data === '') return true;
  if (data === null) return true;
  return false;
}

//写一个函数,判断输入的是否是邮箱
export function isEmail(str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  return reg.test(str);
}

//写一个函数,判断输入的是否是手机号
export function isPhone(str) {
  const reg = /^1[3456789]\d{9}$/;
  return reg.test(str);
}
