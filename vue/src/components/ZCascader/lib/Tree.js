/*
 * @Author: ztao
 * @Date: 2023-11-15 19:30:15
 * @LastEditTime: 2023-12-11 09:45:41
 * @Description:
 */
import Node from './Node.js';
export default class TreeStore {
  constructor(options) {
    for (let option in options) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }
    this.nodesMap = {};
    this.nodeList = [];
    this.selectedIds = [];
    this.maxLevel = 0;
    this.root = new Node({
      cascaderData: this.cascaderData,
      store: this
    });
  }
}
