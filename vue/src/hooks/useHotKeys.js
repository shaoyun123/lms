import hotkeys from 'hotkeys-js';
import { onMounted, onUnmounted } from 'vue';

const useHotKeys = (keys, options, callback) => {
  onMounted(() => {
    hotkeys(keys, options, callback);
  });
  onUnmounted(() => {
    hotkeys.unbind(keys, callback);
  });
};

export default useHotKeys;
