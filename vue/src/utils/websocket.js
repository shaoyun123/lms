import { isFunction } from '@/utils/is';
import { ElMessage } from 'element-plus';
let socket = '';
let lockReconnect = false; // 是否真正建立连接
let timeout = 20 * 1000; // 20秒一次心跳
let timeoutObj = null; // 心跳心跳倒计时
let serverTimeoutObj = null; // 心跳倒计时
let timeoutnum = null;
let globalCallback = null;
let weburl = '';

export const sendWebsocket = function (agentData, callback) {
  globalCallback = callback;
  if (socket.readyState === 1) {
    socketOnSend(agentData);
  } else {
    globalCallback({ code: '9999' });
  }
};

/**
 * 关闭websocket函数
 */
export const closeWebsocket = function () {
  if (socket) {
    socket.close();
  }
  clearTimeout(timeoutObj);
  clearTimeout(serverTimeoutObj);
};

export const initWebSocket = function (url) {
  if (url) {
    weburl = url;
  }
  if (!window.WebSocket) {
    ElMessage.error('您的浏览器不支持websocket,请升级或更换浏览器！');
    return;
  }
  // if (!socket) {
  try {
    socket = new WebSocket(weburl);
    socketOnOpen();
    socketOnClose();
    socketOnError();
    socketOnMessage();
  } catch (err) {
    console.log('err :>> ', err);
  }
  // }
};

function reconnect() {
  if (lockReconnect) {
    return;
  }
  lockReconnect = true;
  // 没连接上会一直重连，设置延迟避免请求过多
  timeoutnum && clearTimeout(timeoutnum);
  timeoutnum = setTimeout(function () {
    // 新连接
    initWebSocket();
    console.log('socket重连连接成功');
    lockReconnect = false;
  }, 5000);
}
// 重置心跳
function reset() {
  // 清除时间
  clearTimeout(timeoutObj);
  clearTimeout(serverTimeoutObj);
  // 重启心跳
  start();
}
// 开启心跳
function start() {
  // console.log('start :>> ')
  timeoutObj && clearTimeout(timeoutObj);
  serverTimeoutObj && clearTimeout(serverTimeoutObj);
  timeoutObj = setTimeout(function () {
    // 这里发送一个心跳，后端收到后，返回一个心跳消息，
    // console.log('判断 :>> ', socket.readyState)
    if (socket.readyState === 1) {
      // 如果连接正常
      // socket.send('{"toUserId":"hk"}')
      reset();
    } else {
      // 否则重连
      console.log('重连中');
      reconnect();
    }
    serverTimeoutObj = setTimeout(function () {
      // 超时关闭
      // socket.close()
    }, timeout);
  }, timeout);
}

function socketOnOpen() {
  socket.onopen = () => {
    console.log('socket连接成功');
    start();
  };
}

function socketOnClose() {
  socket.onclose = () => {
    console.log('socket已经关闭');
  };
}

function socketOnSend(data) {
  // 数据发送
  socket.send(data);
}

function socketOnError() {
  socket.onerror = () => {
    reconnect();
  };
}

function socketOnMessage() {
  socket.onmessage = (e) => {
    // console.log('接收消息 :>> ', socket.readyState, e.data)
    if (isFunction(globalCallback)) {
      globalCallback(JSON.parse(e.data));
    }
    reset();
  };
}
