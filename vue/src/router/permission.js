/*
 * @Author: ztao
 * @Date: 2023-03-07 19:35:27
 * @LastEditTime: 2024-05-14 11:25:41
 * @Description: 路由前置守卫
 */
import router from '@/router';
import usePermissionStore from '@/store/modules/permission';
import useUserStore from '@/store/modules/user';
import useRouteRefreshStore from '@/store/modules/routeRefresh';
import useIframesStore from '@/store/modules/iframes';
import { ElMessage, ElLoading } from 'element-plus';
import { getToken } from '@/utils/cookies';

// 白名单
const whiteList = ['/login'];

// 记录路由
let hasRoles = true;

let loading = null;

router.beforeEach(async (to, _from, next) => {
  // console.log('hasRoles', hasRoles);
  loading = ElLoading.service({
    text: '加载中,请稍候'
  });
  const permissionStore = usePermissionStore();
  const userStore = useUserStore();
  const iframesStore = useIframesStore();
  // 判断该用户是否登录
  // console.log('getToken()', getToken());
  if (getToken()) {
    if (to.path === '/login') {
      // 如果已经登录，并准备进入 Login 页面，则重定向到主页
      console.log('/login');
      sessionStorage.setItem('last_router_link', '/dashboard');
      next({ path: '/' });
      loading.close();
    } else {
      // console.log('hasRoles', hasRoles);
      if (hasRoles) {
        try {
          await userStore.getInfo(); // 获取用户信息
          await permissionStore.getUserMenus();
          let routes = permissionStore.routes;
          //处理渲染菜单需要的路由
          permissionStore.filterRouter(routes);
          //添加动态路由
          routes.forEach((route) => {
            router.addRoute(route);
          });
          //添加iframe路由
          let iframes = iframesStore.routesToIframes(routes);
          await iframesStore.changeIframesObj(iframes);
          hasRoles = false;

          const { linkRouteBlank } = useRouteRefreshStore();
          let routeList = linkRouteBlank?.map((item) => item.name);
          let link = '';
          if (routeList?.includes(to.path)) {
            // 页面为跳转的新页面 根据 useRouteRefreshStore 配置获取到页面路径
            let saveKey =
              linkRouteBlank?.filter((item) => item.name === to.path)[0]
                ?.saveKey || '';
            link = sessionStorage.getItem(saveKey);
          } else {
            // 普通页面
            link = sessionStorage.getItem('router_link');
          }
          // 线上环境 iframe 二次触发beforeEach
          if (
            sessionStorage.getItem('router_link') !== '/dashboard' &&
            to.path === '/dashboard'
          ) {
            // 不是首页，但是to.path为首页, 该情况为二次触发 beforeEach 时发生
            // 记录首次触发 beforeEach 时的正确 to.path，并且跳转
            let lastLink = sessionStorage.getItem('last_router_link');
            next(lastLink || '/dashboard');
          } else {
            // 当页面刷新 或者 window.open 跳转到新页面时，_from.name 为 undefined
            if (!_from.name && link) {
              if (link?.split('?')[0] === to.path) {
                // 重定向到指定页面
                sessionStorage.setItem('last_router_link', link);
                next(link);
              } else {
                next(to.fullPath);
              }
            } else {
              sessionStorage.setItem('last_router_link', to.fullPath);
              next({ ...to, replace: true });
            }
          }
          // next({ ...to, replace: true });
        } catch (err) {
          await userStore.logout();
          ElMessage.error(err.message || '路由守卫过程发生错误');
          next(`/login?redirect=${to.path}`);
        }
      } else {
        // console.log('else-to', to);
        next();
      }
    }
  } else {
    // 如果没有 Token
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果在免登录的白名单中，则直接进入
      next();
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      next('/login');
      loading.close();
    }
  }
});

router.afterEach((to, from) => {
  let toPath = to.fullPath;
  // 避免afterEach 重复调用执行 带来的问题
  const { linkRouteBlank } = useRouteRefreshStore();
  let routeList = linkRouteBlank?.map((item) => item.name);
  let savepath = sessionStorage.getItem('router_link');
  if (
    savepath !== toPath &&
    !routeList.includes(to.path) &&
    to.path !== from.path
  ) {
    console.log('after each');
    sessionStorage.setItem('router_link', toPath);
  }
  loading.close();
});
