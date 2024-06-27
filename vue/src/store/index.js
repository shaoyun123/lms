/*
 * @Author: ztao
 * @Date: 2023-03-07 19:55:46
 * @LastEditTime: 2023-03-17 16:30:55
 * @Description:
 */
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const store = createPinia();

// 将插件提供给store实例
store.use(piniaPluginPersistedstate);

export default store;
