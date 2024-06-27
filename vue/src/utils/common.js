/*
 * @Author: Cisy.Wang
 * @Date: 2022-10-26 15:41:53
 * @LastEditTime: 2024-04-11 15:50:23
 * @Description:
 */
import * as $math from 'mathjs';
import { ElMessage } from 'element-plus';
import CacheKey from '@/constant/index';
// 时间戳转换成时间
export const transferDate = (str, isTime = true, type = '-') => {
  if (!str) return;
  let date = new Date(str),
    year = date.getFullYear(), //年
    month = date.getMonth() + 1, //月
    day = date.getDate(), //日
    hour = date.getHours(), //时
    min = date.getMinutes(), //分
    sen = date.getSeconds(), //秒
    time = '';
  if (isTime) {
    time =
      year +
      type +
      getZero(month) +
      type +
      getZero(day) +
      ' ' +
      getZero(hour) +
      ':' +
      getZero(min) +
      ':' +
      getZero(sen);
  } else {
    time = year + type + getZero(month) + type + getZero(day);
  }

  return time;
};

// 补0操作
function getZero(num) {
  if (parseInt(num) < 10) {
    num = '0' + num;
  }
  return num;
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

//处理文件流下载
export function download(content, fileName) {
  const blob = new Blob([content]); //创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
  const url = window.URL.createObjectURL(blob); //URL.createObjectURL(object)表示生成一个File对象或Blob对象
  let dom = document.createElement('a'); //设置一个隐藏的a标签，href为输出流，设置download
  dom.style.display = 'none';
  dom.href = url;
  dom.setAttribute('download', fileName); //指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
  document.body.appendChild(dom);
  dom.click();
}

// js 运算 防止精度丢失
export const math = {
  add() {
    return comp('add', arguments);
  },
  subtract() {
    return comp('subtract', arguments);
  },
  multiply() {
    return comp('multiply', arguments);
  },
  divide() {
    return comp('divide', arguments);
  }
};

function comp(_func, args) {
  let t = $math.chain($math.bignumber(args[0]));
  for (let i = 1; i < args.length; i++) {
    t = t[_func]($math.bignumber(args[i]));
  }
  // 防止超过6位使用科学计数法
  return parseFloat(t.done());
}

// 点击复制
export function copy(value, element = 'input', tip = '复制成功') {
  var input = document.createElement(element); // 创建input对象
  input.value = value; // 设置复制内容
  document.body.appendChild(input); // 添加临时实例
  input.select(); // 选择实例内容
  document.execCommand('Copy'); // 执行复制
  document.body.removeChild(input); // 删除临时实例
  ElMessage.success(tip);
}

// 部门和销售  转为树结构
export function comOrgPersonTree(data) {
  let arr = [];
  const mapChooseDepart = (arr, orgTree, userList) => {
    orgTree.forEach((item, index) => {
      arr.push({
        ...item,
        name: item.org_name || item.name,
        childOrgList: []
      });
      if (item.childOrgList?.length) {
        mapChooseDepart(arr[index].childOrgList, item.childOrgList, userList);
      }
      const curSale = userList.filter((v) => item.id === v.org_id);
      if (curSale.length) {
        curSale.forEach((v) => {
          item.childOrgList.push({ ...v, name: v.user_name });
        });
        arr[index].childOrgList = item.childOrgList;
      }
    });
  };

  mapChooseDepart(arr, data.orgTree, data.userList);

  return arr;
}

export function addQueryParamToUrl(url, paramName, paramValue) {
  const urlObj = new URL(url);
  urlObj.searchParams.set(paramName, paramValue);
  return urlObj.href;
}

// 在特定的域名下使用缩略图
export const comGetThumbnailUrl = (url = '', width = 80, height = 80) => {
  const { THUMBNAIL_URL_ENUM } = CacheKey;
  let newUrl = url || '';
  const isThumbnailUrl = THUMBNAIL_URL_ENUM.some((item) =>
    newUrl.includes(item)
  );
  if (isThumbnailUrl) {
    const _width = parseInt(width);
    const _height = parseInt(height);
    newUrl = `${newUrl}!size=${_width}x${_height}`;
  }
  return newUrl;
};

// 根据时候是当天 展示不同格式的时间
export function formatTimestampByIsToday(timestamp) {
  const today = new Date();
  const date = new Date(timestamp); // 将时间戳转换为日期对象

  // 比较年、月、日是否相等
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    // 是当天，返回时:分格式
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return hours + ':' + minutes;
  } else {
    // 不是当天，返回月日/月格式
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return day + '/' + month;
  }
}

// 不展示domRef下的popover
export const comHidePopover = (domRef, popClass = '.el-popover') => {
  const elements = domRef.value.querySelectorAll(popClass);
  Array.prototype.forEach.call(elements, function (elem) {
    elem.style.display = 'none';
  });
};

// 获取主页面table的高度
export const comGetTableHeight = (
  searchCardRef,
  hasPagination = false,
  hasTab = false
) => {
  const clientHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight ||
    919;
  const searchCardHeight = searchCardRef?.value?.$el?.clientHeight;
  const paginationHeight = hasPagination ? 34 : 0;
  const tabHeight = hasTab ? 41 : 0;
  const height =
    clientHeight - 83 - searchCardHeight - paginationHeight - tabHeight;
  return height;
};

/**
 * @description: 通过运算符计算
 * @param {*} calculType 运算符
 * @param {*} calculNum 填写的值
 * @param {*} originVal 基础值
 * @return {*}
 */
export const calculateBasicOperator = (calculType, calculNum, originVal) => {
  if (calculType === '+') {
    return originVal + calculNum;
  } else if (calculType === '-') {
    return originVal - calculNum;
  } else if (calculType === '*') {
    return originVal * calculNum;
  } else if (calculType === '=') {
    return calculNum;
  } else if (calculType === '/') {
    return originVal / calculNum;
  }
};

// 递归获取级联列表最后一级的所有value值
export const getAllLeafValues = (options) => {
  let leafValues = [];
  const traverse = (options) => {
    options.forEach((item) => {
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      } else {
        leafValues.push(item.value);
      }
    });
  };
  traverse(options);
  return leafValues;
};

// 通过URL后缀确定文件类型
export const getFileType = (url) => {
  const extension = url.split('.').pop().toLowerCase();

  if (
    extension === 'jpg' ||
    extension === 'jpeg' ||
    extension === 'png' ||
    extension === 'gif'
  ) {
    return 'image';
  } else if (extension === 'doc' || extension === 'docx') {
    return 'word';
  } else if (extension === 'xls' || extension === 'xlsx') {
    return 'excel';
  } else if (extension === 'pdf') {
    return 'pdf';
  } else {
    return 'unknown';
  }
};
