/*
 * @Author: ztao
 * @Date: 2023-03-13 17:05:42
 * @LastEditTime: 2023-03-13 20:06:43
 * @Description: hooks-处理iframe引入问题
 */
import { onActivated, onDeactivated, onBeforeUnmount, ref } from 'vue';
import useIframesStore from '@/store/modules/iframes';

//导出一个iframe的hook函数
export default function iframesHooks(PAGE_ID, PARAMS = '') {
  const {
    iframesObj,
    createdPage,
    changeParams,
    activatedPage,
    deactivatedPage,
    beforeDestroyPage
  } = useIframesStore();
  let MISSING_ID = ref(false); //默认无iframe-id
  //获取iframe页面列表
  if (PAGE_ID === null || iframesObj[PAGE_ID] == null) {
    MISSING_ID.value = false;
    console.error('缺少 PAGE_ID 参数');
    return;
  }
  const obj = { id: PAGE_ID };
  if (PARAMS) obj.params = PARAMS;
  createdPage(obj);
  //当组件被插入到 DOM 中时,调用,也就是激活调用
  onActivated(() => {
    if (MISSING_ID.value) return;
    const params = iframesObj[PAGE_ID].params;
    if (params != null && PARAMS != null && params !== PARAMS) {
      changeParams({
        id: PAGE_ID,
        params: PARAMS
      });
    }
    activatedPage(PAGE_ID);
  });
  //当组件从 DOM 中被移除时,调用
  onDeactivated(() => {
    if (MISSING_ID.value) return;
    deactivatedPage(PAGE_ID);
  });
  //在卸载组件实例之前，调用
  onBeforeUnmount(() => {
    if (MISSING_ID.value) return;
    beforeDestroyPage(PAGE_ID);
  });
}
