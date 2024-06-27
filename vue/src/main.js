/*
 * @Author: ztao
 * @Date: 2023-02-08 15:29:31
 * @LastEditTime: 2024-04-30 11:45:44
 * @Description:
 */
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from '@/App.vue';
import VXETable from 'vxe-table';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import router from './router';
import store from './store';
import '@/router/permission';
// import { permission } from '@/directives/permission';
import { directives } from '@/directives/index';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'element-plus/dist/index.css';
import '@/styles/index.scss';
import 'vxe-table/lib/style.css';
import { ElMessageBox } from 'element-plus';
import util from '@/components/lazada/js/util.js';
import screenShort from 'vue-web-screen-shot';
import { setItem } from '@/utils/storage';
// vue virtual scroller
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'; // 引入它的 css
import VueVirtualScroller from 'vue-virtual-scroller'; // 引入它

const app = createApp(App);

// 全局工具类
app.config.globalProperties.util = util;

//图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  if (key == 'Menu') {
    app.component('IconMenu', component);
  } else {
    app.component(key, component);
  }
}

function receiveMessageFromIframePage(event) {
  if (event.origin == import.meta.env.VITE_APP_ORIGIN_LMS) {
    // console.log('iframe信息传递', event);
    let obj = {};
    //如果是同步失败就传递同步失败的状态
    let syncStatus = event.data.syncStatus;
    if (syncStatus) {
      obj = {
        syncStatus: syncStatus
      };
    }
    //如果是七天内到期域名就传递到期时间
    let searchType = event.data.searchType;
    if (searchType) {
      obj = {
        searchType: searchType
      };
    }
    //如果是七天内到期token就传递到期时间
    let time = event.data.time;
    let sevenTime = event.data.sevenTime;
    let ebayVersion = event.data.ebayVersion;
    let status = event.data.status;
    if (time && sevenTime) {
      obj = {
        time: time,
        sevenTime: sevenTime
      };
      if (ebayVersion) {
        obj.ebayVersion = ebayVersion;
      }
      if (status) {
        obj.status = status;
      }
    }
    //token过期就传递token过期时间
    if (time && !sevenTime) {
      obj = {
        time: time
      };
      if (ebayVersion) {
        obj.ebayVersion = ebayVersion;
      }
      if (status) {
        obj.status = status;
      }
    }

    // 从lms订单页面跳转到聊天页面
    const chatPageItemNameList = [
      'shopeecustomerchat',
      'publishstiktokchat',
      'lazadacustomerlazadachat'
    ];

    if (event.data.name === 'publishssheinmallsheinmallpublish') {
      setItem('publishssheinmallsheinmallpublish', event.data.res);
    } else if (chatPageItemNameList.includes(event.data.name)) {
      setItem(event.data.name, event.data.params);
    } else if (event.data.name === 'configurestoreshopeeaccount') {
      setItem(event.data.name, obj);
    }
    if (purcahsePageName.includes(event.data.name)) {
      obj = receivePurchaseMessageFromIframePage(event.data);
    }
    if (event.data.name === 'commoditytemplateprohibitconf') {
      obj = {
        inableConfIds: event.data.inableConfIds
      };
    }
    //ztt20231212-全部订单页面跳转
    if (event.data.name === 'orderauditDespathOrderallStatusOrder') {
      obj = {
        id: event.data.id
      };
    }
    router.push({
      name: event.data.name,
      query: { ...obj }
    });
  }
}

// 采购超时未处理跳转参数
let purcahsePageName = [
  'commodityprocessoutofstock',
  'purchasespurchasespurchaseOrder',
  'purchasespurchasesloweringNotice',
  'warehouseprocessfeedback'
];
const receivePurchaseMessageFromIframePage = (data) => {
  let { name } = data;
  let params = {};
  if (name === 'commodityprocessoutofstock') {
    let { ifManager, isSale, findSupplyType, expectedArrivalTimeType } = data;
    params = {
      ifManager,
      isSale,
      findSupplyType,
      expectedArrivalTimeType
    };
  }
  if (name === 'purchasespurchasespurchaseOrder') {
    let { ifManager, order, searchOrderNoType } = data;
    params = {
      ifManager,
      order,
      searchOrderNoType
    };
  }
  if (name === 'purchasespurchasesloweringNotice') {
    let { ifManager, isSale } = data;
    params = {
      ifManager,
      isSale
    };
  }
  if (name === 'warehouseprocessfeedback') {
    let { ifManager, isSale, issueType, isHandle } = data;
    params = {
      ifManager,
      issueType,
      isHandle,
      isSale
    };
  }
  return params;
};

window.addEventListener('message', receiveMessageFromIframePage, false);
// 监听同源 storage 改变
window.addEventListener('storage', function (e) {
  if (e.key === 'loginName' && e.oldValue !== e.newValue) {
    ElMessageBox.alert('登录信息已更新，请刷新页面', '提示', {
      type: 'error',
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showConfirmButton: false,
      center: true
    });
  } else if (!window.localStorage.length) {
    router.push('/login');
  }
});

// 注册一个全局自定义指令 `v-permission`
// app.directive('permission', permission);

for (const k in directives) {
  app.directive(k, directives[k]);
}

app.use(VueVirtualScroller); // use 它

VXETable.setup({
  size: 'mini'
});

app
  .use(ElementPlus, {
    locale: zhCn,
    zIndex: 3000,
    size: 'small'
  })
  .use(VXETable)
  .use(router)
  .use(store)
  .use(screenShort, {
    enableWebRtc: true,
    enableCORS: true
  });
app.mount('#app');
