// 主要用于需要 页面window.open等打开_blank的页面，需要刷新页面, 依旧在当前页

import { defineStore } from 'pinia';

const useRouteRefreshStore = defineStore('routerrefresh', {
  state: () => ({
    // 需要跳转打开的页面 如：自定义面单编辑面单页面
    // name 为页面路径
    linkRouteBlank: [
      {
        name: '/order/logistics/editor',
        saveKey: 'route_link_logistic_editor'
      },
      {
        name: '/publishs/aefullyhosted/publishpreviewdesc',
        saveKey: 'route_link_temu_desc'
      }
    ]
  })
});
export default useRouteRefreshStore;
