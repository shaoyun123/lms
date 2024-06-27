/*
 * @Author: ztao
 * @Date: 2023-02-11 16:29:29
 * @LastEditTime: 2023-02-11 16:46:06
 * @Description: 用来处理注入mock文件做拦截处理
 */
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

// 逐一导入您的mock.js文件
// 可以使用 import.meta.glob功能来进行全部导入
import user from '../mock/user';
export function setupProdMockServer() {
  createProdMockServer([...user]);
}
