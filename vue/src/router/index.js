/*
 * @Author: ztao
 * @Date: 2023-02-12 15:59:56
 * @LastEditTime: 2023-08-01 14:50:52
 * @Description: 路由文件
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import { shallowRef } from 'vue';

import Layout from '@/layout/index.vue';

/** 常驻路由 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/modify',
    component: shallowRef(Layout),
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/modify/password',
        component: () => import('@/views/modify/password/index.vue'),
        name: 'modifyPassword',
        meta: {
          title: '修改密码',
          keepAlive: true
        }
      },
      {
        path: '/modify/profile',
        component: () => import('@/views/modify/profile/index.vue'),
        name: 'modifyProfile',
        meta: {
          title: '个人信息',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true
    },
    alias: '/:pathMatch(.*)*'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/order/logistics/editor',
    name: 'orderlogisticseditor',
    component: () => import('@/views/order/logistics/sheeteditor/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/order/logistics/previewprinttpl',
    name: 'orderlogisticspreviewprinttpl',
    component: () =>
      import('@/views/order/logistics/previewprinttpl/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/publishs/aefullyhosted/publishpreviewdesc',
    name: 'publishsaefullyhostedpublishpreviewdesc',
    component: () =>
      import('@/views/publishs/aefullyhosted/publishpreviewdesc/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/',
    component: shallowRef(Layout),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'dashboard',
        meta: {
          title: '首页',
          svgIcon: 'dashboard',
          iframeId: 'dashboard',
          affix: true,
          hidden: false,
          keepAlive: true,
          isVue: 1
        }
      }
    ],
    meta: {
      hidden: true,
      title: '首页',
      keepAlive: true
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...constantRoutes]
});

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route;
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name);
      }
    });
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload();
  }
}

export default router;
