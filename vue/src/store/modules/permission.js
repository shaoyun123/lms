/*
 * @Author: ztao
 * @Date: 2023-03-08 15:03:05
 * @LastEditTime: 2023-12-26 17:58:41
 * @Description: 处理权限路由
 */
import { ref, shallowRef } from 'vue';
import { defineStore } from 'pinia';
import { isExternal, isNull } from '@/utils/validate';
import Layout from '@/layout/index.vue';
import { getUserMenusApi } from '@/api/user';
import { constantRoutes } from '@/router';
import CacheKey from '@/constant/index';

/**
 * @description: 创建动态路由,通过接口返回的菜单
 * @param {*} menus
 * @return {*} route结构菜单
 */

const modules = import.meta.glob('@/views/**/*.vue');

const { externalLinkTitle, externalLinkArr } = CacheKey;

//从数组中根据name获取path
function getPathByName(name) {
  let result = '';
  externalLinkArr.forEach((item) => {
    if (item.name == name) {
      result = item.path;
    }
  });
  return result;
}
//从链接中提取域名
function domainPattern(url) {
  let result = '';
  const domainReg = /https?:\/\/(?:www\.)?([\w.-]+)/;
  const domain = url.match(domainReg);
  if (domain) {
    result = domain[1];
  }
  return result.split('.')[0];
}

//创建动态路由
function createDynamicRoutes(menus) {
  const result = [];
  menus.forEach((item) => {
    //不存在name,或者title=查看,或者没有uri,或者是按钮,都过滤掉
    if (
      isNull(item.name) ||
      item.name === '查看' ||
      item.menuType == 2 ||
      isNull(item.uri)
    )
      return;
    //定义好变量
    //自定义生成code
    let splitArr =
      (item.uri && !isExternal(item.uri) && item.uri.split('/')) || [];
    let itemCode = '';
    if (splitArr.length == 2) {
      itemCode = splitArr[1];
    } else if (splitArr.length == 3) {
      itemCode = splitArr[1] + splitArr[2];
    } else if (splitArr.length == 4) {
      itemCode = splitArr[1] + splitArr[2] + splitArr[3];
    }
    //定义好变量
    let route = {
      name: isExternal(item.uri) ? domainPattern(item.uri) : itemCode,
      // path: item.uri,
      path: externalLinkTitle.includes(item.alias)
        ? getPathByName(item.alias)
        : isExternal(item.uri)
        ? `/iframes/${domainPattern(item.uri)}`
        : item.uri,
      meta: {
        title: item.alias || '',
        tabName: item.tabName || '',
        icon: item.icon || '',
        iframe: true,
        iframeId: isExternal(item.uri) ? domainPattern(item.uri) : itemCode,
        isVue: item.sourceType, //1表示是jsp,2表示是vue
        keepAlive: true,
        link: isExternal(item.uri) ? item.uri : ''
      },
      children: item.sub || []
    };
    //存在子节点,根据节点的pid判断是否父节点
    if (item.sub && item.sub.length > 0) {
      if (item.pid == 0) {
        //最上级父节点
        route.component = shallowRef(Layout);
      } else {
        //中间层级节点
        if (isExternal(item.uri)) {
          route.component =
            modules[`/src/views/Iframes/${domainPattern(item.uri)}.vue`];
        } else {
          route.component = modules[`/src/views${item.uri}/index.vue`];
        }
      }
      route.redirect = item.sub[0].uri;
      route.children = createDynamicRoutes(item.sub);
    } else {
      if (isExternal(item.uri)) {
        route.component =
          modules[`/src/views/Iframes/${domainPattern(item.uri)}.vue`];
      } else {
        route.component = modules[`/src/views${item.uri}/index.vue`];
      }
    }
    result.push(route);
  });
  return result;
}
//获取权限按钮
export function getPermissionBtn(menus) {
  let result = [];
  menus.forEach((item) => {
    if (item.menuType == 2 && item.name != '查看') {
      result.push(item.code);
    }
    if (item.sub && item.sub.length > 0) {
      result = result.concat(getPermissionBtn(item.sub));
    }
  });
  return result;
}

const usePermissionStore = defineStore('permission', () => {
  const routes = ref([]);
  const filterRoutes = ref([]);
  const permissionBtns = ref([]);
  const TOOL_MENU_LIST = [
    {
      id: 99,
      pid: 0,
      name: '虚拟菜单',
      alias: '虚拟菜单',
      code: '',
      uri: '/virturl',
      menuType: 1,
      sort: 999,
      sub: [
        {
          id: 999,
          pid: 998,
          name: '小工具',
          alias: '小工具',
          uri: '/virturl/tool',
          menuType: 1,
          sort: 1,
          sub: [
            {
              id: 9996,
              pid: 67,
              name: '换行逗号转换',
              alias: '换行逗号转换',
              code: '',
              uri: '/virturl/tool/spacetransform',
              menuType: 1,
              sort: 52,
              sourceType: 1
            },
            {
              id: 9997,
              pid: 67,
              name: '抠图',
              alias: '抠图',
              code: '',
              uri: '/virturl/tool/mattingpic',
              menuType: 1,
              sort: 53,
              sourceType: 1
            },
            {
              id: 9998,
              pid: 67,
              name: '采集图片模块',
              alias: '采集图片模块',
              code: '',
              uri: '/virturl/tool/collectimg',
              menuType: 1,
              sort: 54,
              sourceType: 1
            },
            {
              id: 9999,
              pid: 67,
              name: '以图搜图',
              alias: '以图搜图',
              code: '',
              uri: '/virturl/tool/searchimg',
              menuType: 1,
              sort: 55,
              sourceType: 1
            },
            {
              id: 10000,
              pid: 67,
              name: '定价工具',
              alias: '定价工具',
              code: '',
              uri: '/virturl/tool/setprice',
              menuType: 1,
              sort: 56,
              sourceType: 1
            },
            {
              id: 10001,
              pid: 67,
              name: '批量以图搜图',
              alias: '批量以图搜图',
              code: '',
              uri: '/virturl/tool/batchsearchimg',
              menuType: 1,
              sort: 57,
              sourceType: 2
            },
            {
              id: 10002,
              pid: 67,
              name: '美图秀秀',
              alias: '美图秀秀',
              code: '',
              uri: '/virturl/tool/meitu',
              menuType: 1,
              sort: 58,
              sourceType: 2
            }
          ]
        }
      ]
    }
  ];

  //获取当前登录用户菜单
  const getUserMenus = () => {
    return new Promise((resolve, reject) => {
      getUserMenusApi()
        .then((res) => {
          //获取动态路由[暂时只取第一组数据来做渲染]
          // addElement(res.data, '其他', TOOL_MENU_LIST);
          res.data = res.data.concat(...TOOL_MENU_LIST);
          let dynamicRoutes = createDynamicRoutes(res.data);
          let permissionBtn = getPermissionBtn(res.data);
          permissionBtns.value = [...permissionBtn];
          routes.value = [
            ...constantRoutes,
            ...dynamicRoutes,
            {
              path: '/:pathMatch(.*)*', //必须将 'ErrorPage' 路由放在最后
              redirect: '/404',
              name: 'ErrorPage',
              meta: {
                hidden: true
              }
            }
          ];
          resolve(dynamicRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // const addElement = (array, name, newElement) => {
  //   array?.forEach((item) => {
  //     if (item.name === name) {
  //       item.sub.push(...newElement);
  //       return;
  //     }
  //     if (item.sub) {
  //       addElement(item.sub, name, newElement); // 递归处理下一层
  //     }
  //   });
  // };
  /**
   * @description: 处理用户路由: 1.meta.hidden不渲染
   * @return {*} 返回可渲染路由
   */
  const filterRouter = (routes) => {
    let result = [];
    routes.forEach((route) => {
      let r = { ...route };
      if (!r.meta.hidden) {
        if (r.children && r.children.length > 0) {
          r.children = filterRouter(r.children);
        }
        result.push(r);
      }
    });
    filterRoutes.value = result;
    return result;
  };

  return { routes, getUserMenus, filterRouter, filterRoutes, permissionBtns };
});

export default usePermissionStore;
