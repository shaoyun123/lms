/*
 * @Author: ztao
 * @Date: 2023-03-13 11:34:47
 * @LastEditTime: 2023-04-12 13:48:38
 * @Description: 处理iframe的pinia模块
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { isNull } from '@/utils/validate';
import CacheKey from '@/constant/index';
import { isExternal } from '@/utils/validate';

//需要单独处理的外链
const externalLinkTitle = CacheKey.externalLinkTitle;

const useIframesStore = defineStore('iframes', () => {
  const IFRAME_BOX_STATE = ref(false); //iframe盒子的状态
  let iframesObj = ref({}); //iframe列表对象

  // 生成iframe结构对象: 把路由name和iframe地址映射出来
  const routesToIframes = function (routes, obj = {}) {
    let originUrl = import.meta.env.VITE_APP_ORIGIN_LMS;
    let basicUrl = originUrl + '/lms/index.html/#/route';
    routes.forEach((item) => {
      //不存在name&icon,或者title='查看',过滤掉
      if (isNull(item.name) || item.name === '查看') return;
      // 部分name会没值
      if (!externalLinkTitle.includes(item.meta.title)) {
        if (!item.redirect) {
          if (item.meta && item.meta.isVue == 1) {
            obj[item.name.toLocaleUpperCase()] = {
              name: item.name,
              src: isExternal(item.meta.link)
                ? item.meta.link
                : basicUrl + item.path
            };
          }
        }
      }
      if (item.children && item.children.length > 0) {
        routesToIframes(item.children, obj);
      }
    });
    obj['DASHBOARD'] = {
      name: 'dashboard',
      src: `${originUrl}/lms/index.html`
    };
    return obj;
  };

  //给iframesObj映射函数,增加id,enable,show,params等属性
  const changeIframesObj = function (iframes) {
    for (const key in iframes) {
      // eslint-disable-next-line
      if (iframes.hasOwnProperty(key)) {
        iframes[key].id = key;
        iframes[key].params = '';
        iframes[key].enable = false;
        iframes[key].show = false;
      }
    }
    iframesObj.value = iframes;
  };

  //创建iframe页面
  const createdPage = function (obj) {
    // console.log('调用create', obj);
    let targetObj = iframesObj.value[obj.id];
    if (obj.params) {
      targetObj['params'] = obj.params;
    }
    targetObj['enable'] = true; //enable=true
    targetObj['show'] = true; //show=true
    IFRAME_BOX_STATE.value = true; //iframe盒子的状态
  };

  //创建前销毁iframe页面
  const beforeDestroyPage = function (id) {
    // console.log('摧毁Destroy', id);
    let targetObj = iframesObj.value[id];
    IFRAME_BOX_STATE.value = false; //iframe盒子的状态
    targetObj['enable'] = false;
  };

  //激活iframe页面
  const activatedPage = function (id) {
    // console.log('激活activated', id);
    let targetObj = iframesObj.value[id];
    if (targetObj.show) return;
    targetObj['show'] = true; //show=true
    IFRAME_BOX_STATE.value = true; //iframe盒子的状态
  };

  //关闭iframe页面
  const deactivatedPage = function (id) {
    // console.log('失活deactivated', id);
    let targetObj = iframesObj.value[id];
    if (!targetObj.show) return;
    IFRAME_BOX_STATE.value = false; //iframe盒子的状态
    targetObj['show'] = false; //show=false
  };

  //修改iframe参数
  const changeParams = function (obj) {
    let targetObj = iframesObj.value[obj.id];
    targetObj['params'] = obj.params;
  };

  let iframesArr = computed(() => {
    let arr = [];
    for (let key in iframesObj.value) {
      if (iframesObj.value[key].enable) {
        arr.push(iframesObj.value[key]);
      }
    }
    return arr;
  });

  return {
    IFRAME_BOX_STATE,
    routesToIframes,
    changeIframesObj,
    iframesObj,
    createdPage,
    beforeDestroyPage,
    activatedPage,
    deactivatedPage,
    changeParams,
    iframesArr
  };
});

export default useIframesStore;
