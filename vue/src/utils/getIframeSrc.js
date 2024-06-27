/*
 * @Author: ztao
 * @Date: 2023-06-26 09:56:37
 * @LastEditTime: 2023-07-04 11:57:04
 * @Description: 获取路由的src路径
 */
import { isExternal, isNull } from '@/utils/validate';
import CacheKey from '@/constant/index';
//需要单独处理的外链
const externalLinkTitle = CacheKey.externalLinkTitle;

// 根据路由获取iframe的src
export const getIframeSrc = function (route) {
  let src = '';
  let originUrl = import.meta.env.VITE_APP_ORIGIN_LMS;
  let basicUrl = originUrl + '/lms/index.html/#/route';
  //不存在name&icon,或者title='查看',过滤掉
  if (isNull(route.name) || route.name === '查看') return;
  //首页
  if (route.name === 'Dashboard') {
    src = `${originUrl}/lms/index.html`;
  }
  // 部分name会没值
  if (!externalLinkTitle.includes(route.meta.title)) {
    if (!route.redirect) {
      if (route.meta && route.meta.isVue == 1) {
        src = isExternal(route.meta.link)
          ? route.meta.link
          : basicUrl + route.path;
      }
    }
  }
  return src;
};
