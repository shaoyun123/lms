export default {
  mounted(el, binding) {
    el.onmousedown = function (e) {
      // 判断是输入框 不执行滑动
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      const init = e.clientX;
      const initWidth = el.offsetWidth;
      document.onmousemove = function (e) {
        const end = e.clientX;
        const newWidth = end - init + initWidth;
        if (newWidth > binding.value) {
          el.style.width = newWidth + 'px';
        }
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    };
  }
};
