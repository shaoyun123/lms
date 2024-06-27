/*
 * @Author: ztao
 * @Date: 2023-03-17 17:31:44
 * @LastEditTime: 2024-04-28 14:50:57
 * @Description: 自定义指令
 */
import usePermissionStore from '@/store/modules/permission';
export const permission = {
  // 绑定元素的父组件被挂载时调用
  mounted(el, binding) {
    // console.log('mounted', binding);
    const { value } = binding;
    const { permissionBtns } = usePermissionStore();
    const permissionBtn = permissionBtns;
    // 判断用户使用自定义指令，是否使用正确:存在且是一个数组
    if (value && Array.isArray(value) && value.length > 0) {
      const permissionArr = value;
      //判断传递进来的按钮权限，用户是否拥有
      //Array.some(), 数组中有一个结果是true返回true，剩下的元素不会再检测
      const hasPermission = permissionBtn.some((role) => {
        return permissionArr.includes(role);
      });
      // 当用户没有这个按钮权限时，设置隐藏这个按钮
      if (!hasPermission) {
        el.style.display = 'none';
      }
    } else {
      throw new Error("need roles! Like v-permission=\"['admin','editor']\"");
    }
  }
};
export const notPermission = {
  // 绑定元素的父组件被挂载时调用
  mounted(el, binding) {
    // console.log('mounted', binding);
    const { value } = binding;
    const { permissionBtns } = usePermissionStore();
    const permissionBtn = permissionBtns;
    // 判断用户使用自定义指令，是否使用正确:存在且是一个数组
    if (value && Array.isArray(value) && value.length > 0) {
      const permissionArr = value;
      //判断传递进来的按钮权限，用户是否拥有
      //Array.some(), 数组中有一个结果是true返回true，剩下的元素不会再检测
      const hasPermission = permissionBtn.some((role) => {
        return permissionArr.includes(role);
      });
      // 当用户有这个按钮权限时，设置隐藏这个按钮
      if (hasPermission) {
        el.style.display = 'none';
      }
    } else {
      throw new Error(
        "need roles! Like v-not-permission=\"['admin','editor']\""
      );
    }
  }
};
export const clickOutside = {
  mounted(el, bindings) {
    document.addEventListener('click', (e) => {
      if (e.target === el || el.contains(e.target)) {
        return;
      }
      bindings.value(); // 点击非自己、或者不是自己的儿子就关闭元素
    });
  }
};

export const toolTip = {
  mounted(el) {
    el.title = el.scrollWidth > el.offsetWidth ? el.innerText : '';
  }
};
