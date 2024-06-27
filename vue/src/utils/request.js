/*
 * @Author: ztao
 * @Date: 2022-05-28 22:33:19
 * @LastEditTime: 2024-01-29 19:46:19
 * @Description: axios封装
 */
import axios from 'axios';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
// import { AxiosCanceler } from './axiosCancel';

// const axiosCanceler = new AxiosCanceler();
let requestCount = 0;
let loadingInstance; // loading实例
function showLoading() {
  if (requestCount === 0) {
    loadingInstance = ElLoading.service({
      text: '拼命请求中...',
      target: document.querySelector('.app-main'),
      customClass: 'loading-main'
    });
  }
  requestCount++;
}
function hideLoading() {
  requestCount = 0;
  if (requestCount <= 0 && loadingInstance) {
    loadingInstance.close(); // 隐藏loading，根据实际情况调用loading库的隐藏方法
  }
}
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 600000, //10分钟
  withCredentials: true //携带身份认证文件cookie
});

service.interceptors.request.use(
  (config) => {
    if (config.loading) {
      showLoading();
    }
    if (config.timeout === 'disabled') {
      service.defaults.timeout = 0; // 禁用超时
    }
    // * 将当前请求添加到 pending 中
    // axiosCanceler.addPending(config);
    return config; //必须返回配置
  },
  (error) => {
    // 请求错误的处理
    if (loadingInstance) hideLoading();
    ElMessage.error(error.message);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data;
    const { responseType, needWrongMsg } = response.config;
    if (loadingInstance) hideLoading();
    if (responseType == 'blob') {
      return response.data;
    }
    //要根据code决定下面的操作
    if (code == '0000' || needWrongMsg) {
      return response.data;
    } else {
      //业务错误

      ElMessageBox.alert(msg || '请求失败', '错误信息', {
        confirmButtonText: '确认',
        type: 'error',
        dangerouslyUseHTMLString: true,
        customClass: 'messageOverflow'
      });

      // ElMessage.error(msg || '请求失败'); //提示错误信息
      return Promise.reject(new Error(msg || '请求失败'));
    }
  },
  (error) => {
    if (loadingInstance) hideLoading();
    const wrongCodeList = [401, 503, 502];
    if (wrongCodeList.includes(error.response.status)) {
      window.location.reload();
      console.log('错误信息', error.response.status);
    }
    ElMessage.error(error || error.message);
    return Promise.reject(error);
  }
);

export default service;
