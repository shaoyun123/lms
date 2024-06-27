// 公共指令
// import Vue from 'vue';
import move from './move'; // 拖拽指令
import leftMove from './leftMove'; // 拖拽指令
import { permission, toolTip, clickOutside, notPermission } from './permission';

export const directives = {
  move,
  leftMove,
  permission,
  toolTip,
  clickOutside,
  notPermission
  // more ...
};

// for (const k in directives) {
//   // if (directives.hasOwnProperty(k)) {
//   Vue.directive(k, directives[k]);
//   // }
// }
