/*
 * @Author: ztao
 * @Date: 2022-10-06 16:58:48
 * @LastEditTime: 2022-11-28 14:37:42
 * @Description: 封装localstorage存储函数
 */
/**
 * 存储数据,注意点: 仅能存储字符串,引用类型需转换成基本类型
 */
export const setItem = (key, value, type = 'localStorage') => {
  // 将数组、对象类型的数据转化为 JSON 字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  window[type].setItem(key, value);
};

/**
 * 获取数据
 */
export const getItem = (key, type = 'localStorage') => {
  const data = window[type].getItem(key);
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

/**
 * 删除数据
 */
export const removeItem = (key, type = 'localStorage') => {
  window[type].removeItem(key);
};

/**
 * 删除所有数据,这个谨慎使用
 */
export const removeAllItem = () => {
  window.localStorage.clear();
  window.sessionStorage.clear();
};
