/*
 * @Author: ztao
 * @Date: 2023-03-08 09:57:34
 * @LastEditTime: 2023-07-11 19:06:20
 * @Description:
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getToken } from '@/utils/cookies';
import { resetRouter } from '@/router';
import { loginApi, getUserInfoApi, logoutApi } from '@/api/user';
import useTagsViewStore from './tags-view';
import { removeAllItem, setItem } from '@/utils/storage';

const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || ''); //把cookie当成token

  const { delAllCachedViews, delAllVisitedViews } = useTagsViewStore();

  let userInfo = ref({
    id: '',
    loginName: '',
    userName: ''
  });

  /** 登录 */
  const login = (loginData) => {
    return new Promise((resolve, reject) => {
      // 区分浏览器 图片上传校验
      let browserInfo = getBrowser();
      let fingerprint;
      fingerprint = browserInfo + '$' + uuid();
      window.localStorage.fingerprint = fingerprint;
      loginApi({
        username: loginData.username,
        password: loginData.password,
        machineCode: fingerprint
      })
        .then((res) => {
          token.value = res.data;
          localStorage.setItem('loginCookie', res.data);
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  /** 获取用户信息 */
  const getInfo = () => {
    return new Promise((resolve, reject) => {
      getUserInfoApi()
        .then((res) => {
          userInfo.value = { ...res.data };
          setItem('loginName', userInfo.value.loginName);
          setItem('loginId', userInfo.value.id);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  /** 登出 */
  const logout = () => {
    console.log('。。logout');
    removeAllItem();
    token.value = '';
    userInfo.value = {};
    resetRouter(); //重置路由
    delAllCachedViews(); //删除所有缓存的路由
    delAllVisitedViews(); //删除所有访问过的路由
    logoutApi()
      .then(() => {
        // removeToken();
        // removeAllItem();
        // token.value = '';
        // userInfo.value = {};
        // resetRouter(); //重置路由
        // delAllCachedViews(); //删除所有缓存的路由
        // delAllVisitedViews(); //删除所有访问过的路由
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 获取/生成指纹
  const uuid = () => {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for (let i = 0; i < 32; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23];
    return s.join('');
  };
  //360浏览器（极速内核）
  const check360 = () => {
    let result = false;
    for (let key in navigator.plugins) {
      // np-mswmp.dll只在360浏览器下存在
      if (navigator.plugins[key].filename == 'internal-nacl-plugin') {
        return !result;
      }
    }
    return result;
  };

  //获取当前的浏览器
  const getBrowser = () => {
    // 获取浏览器 userAgent
    let ua = navigator.userAgent.toLowerCase();
    console.log(ua);
    // 是否为 Opera
    let isOpera = ua.indexOf('opr') > -1;
    // 返回结果
    if (isOpera) {
      return 'Opera';
    }

    // 是否为 IE
    let isIE =
      ua.indexOf('compatible') > -1 && ua.indexOf('msie') > -1 && !isOpera;
    let isIE11 = ua.indexOf('trident') > -1 && ua.indexOf('rv:11.0') > -1;
    // 返回结果
    if (isIE11) {
      return 'IE11';
    } else if (isIE) {
      // 检测是否匹配
      let re = new RegExp('msie (\\d+\\.\\d+);');
      re.test(ua);
      // 获取版本
      let ver = parseFloat(RegExp['$1']);
      // 返回结果
      if (ver == 7) {
        return 'IE7';
      } else if (ver == 8) {
        return 'IE8';
      } else if (ver == 9) {
        return 'IE9';
      } else if (ver == 10) {
        return 'IE10';
      } else {
        return 'IE';
      }
    }

    //console.log(ua);
    // 是否为 Edge
    let isEdge = ua.indexOf('edg') > -1;
    // 返回结果
    if (isEdge) {
      return 'Edge';
    }

    // 是否为 Firefox
    let isFirefox = ua.indexOf('firefox') > -1;
    // 返回结果
    if (isFirefox) {
      return 'Firefox';
    }

    // 是否为 Safari
    let isSafari = ua.indexOf('safari') > -1 && ua.indexOf('chrome') == -1;
    // 返回结果
    if (isSafari) {
      return 'Safari';
    }

    // 是否为 QQ
    let isQQ = ua.indexOf('qqbrowser') > -1;
    // 返回结果
    if (isQQ) {
      return 'QQBrowser';
    }

    // 是否为搜狗浏览器
    let isMaxthon = ua.indexOf('se 2.x') > -1;
    // 返回结果
    if (isMaxthon) {
      return 'sogou';
    }

    // 是否为2345浏览器
    let is2345Explorer = ua.includes('2345explorer');
    // 返回结果
    if (is2345Explorer) {
      return '2345Browser';
    }

    // 是否为UC浏览器
    let isubrowser = ua.includes('ubrowser');
    // 返回结果
    if (isubrowser) {
      return 'UCBrowser';
    }
    let is360 = check360() && ua.indexOf('safari') > -1;
    if (is360) {
      return '360Browser';
    }

    // 是否为 Chrome
    let isChrome =
      ua.indexOf('chrome') > -1 &&
      ua.indexOf('safari') > -1 &&
      ua.indexOf('edge') == -1 &&
      ua.indexOf('qqbrowser') == -1 &&
      ua.indexOf('2345explorer') == -1 &&
      check360() == false;
    // 返回结果
    if (isChrome) {
      return 'Chrome';
    }
    // 都不是
    return '';
  };

  return { token, userInfo, login, getInfo, logout };
});

export default useUserStore;
