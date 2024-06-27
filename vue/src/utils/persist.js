/*
 * @Author: ztao
 * @Date: 2023-03-07 20:01:14
 * @LastEditTime: 2023-03-07 20:01:32
 * @Description:
 */
const piniaPersistConfig = (key, paths) => {
  const persist = {
    key,
    storage: window.localStorage,
    // storage: window.sessionStorage,
    paths
  };
  return persist;
};

export default piniaPersistConfig;
