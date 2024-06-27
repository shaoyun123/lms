import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import $ from 'jquery';
import { isEmpty, cloneDeep } from 'lodash-es';
import useEditorDom from '@/hooks/useEditorDom';

const sheetEditorStore = defineStore('sheetEditor', () => {
  // 拖拽到画布
  const addDragElement = ref(null);
  const updateDragComponent = (obj) => {
    addDragElement.value = obj;
  };

  // 画布上的元素
  const curComponent = ref({});
  const setComponent = (dom) => {
    if (dom) {
      const curTimeStamp = new Date().getTime();
      curComponent.value = {
        type: dom.data('type'),
        title: dom.data('title'),
        text: dom.data('text'),
        showPostCode: showPostCodeSetting(dom),
        id: curTimeStamp,
        style: getStyle(dom),
        dom
      };
    } else {
      curComponent.value = null;
    }
  };

  // 复制
  const copiedComponent = ref();
  const copyComponent = (dom) => {
    copiedComponent.value = dom;
  };

  // 粘贴
  const pasteCopiedComponent = () => {
    if (copiedComponent.value) {
      const cloneHtml = cloneDeep(copiedComponent.value);
      const { appendEditorHtml, removeActive, findLastDropItem } =
        useEditorDom();
      appendEditorHtml(cloneHtml.prop('outerHTML'));
      removeActive();
      const lastItemDom = findLastDropItem();
      copiedComponent.value = lastItemDom;
      setComponent(lastItemDom);
      const oldTop = parseInt($(lastItemDom).css('top'));
      const oldLeft = parseInt($(lastItemDom).css('left'));
      $(lastItemDom)
        .css('top', oldTop + 10 + 'px')
        .css('left', oldLeft + 10 + 'px')
        .addClass('active');
    }
  };

  // 移动
  const moveComponent = (data) => {
    if (curComponent.value) {
      const oldTop = parseInt($(curComponent.value.dom).css('top'));
      const oldLeft = parseInt($(curComponent.value.dom).css('left'));
      const { direction, amount } = data;
      switch (direction) {
        case 'Up': {
          const newValue = oldTop - amount + 'px';
          curComponent.value.dom.css('top', newValue);
          break;
        }
        case 'Down': {
          const newValue = oldTop + amount + 'px';
          curComponent.value.dom.css('top', newValue);

          break;
        }
        case 'Left': {
          const newValue = oldLeft - amount + 'px';
          curComponent.value.dom.css('left', newValue);

          break;
        }
        case 'Right': {
          const newValue = oldLeft + amount + 'px';
          curComponent.value.dom.css('left', newValue);
          break;
        }
        default:
          break;
      }
    }
  };

  const toHump = (name) => {
    // eslint-disable-next-line no-useless-escape
    return name.replace(/\-(\w)/g, function (_, letter) {
      return letter.toUpperCase();
    });
  };
  const getStyle = (dom) => {
    const style = {};
    dom
      .attr('style')
      .split(';')
      .forEach((item) => {
        const keyVal = item.split(':').map((item) => item.replace(' ', ''));
        if (keyVal[0]) {
          style[toHump(keyVal[0])] = keyVal[1];
        }
      });
    return style;
  };
  const showPostCodeSetting = () => {
    let temp = '';
    // $(dom)
    //   .find('span')
    //   .each(function () {
    //     const curDom = $(this);
    //     if (curDom.data('text') === 'postcode') {
    //       curDom
    //         .attr('style')
    //         ?.split(';')
    //         .forEach((item) => {
    //           const keyVal = item
    //             .split(':')
    //             .map((item) => item.replace(' ', ''));
    //           if (keyVal[0] === 'text-transform' && keyVal[1] === 'uppercase') {
    //             temp = 'uppercase';
    //           }
    //         });
    //     }
    //   });
    return temp;
  };
  const updateComponent = (e, dom = null) => {
    if (!isEmpty(e)) {
      $(curComponent.value.dom).css(e.key, e.value);
    }
    if (dom) {
      setComponent(dom);
    }
  };

  // 放大缩小
  const zoomValue = ref(100);
  const realZoomVal = computed(() => zoomValue.value / 100);
  const handleIncrese = () => {
    zoomValue.value = zoomValue.value + 25;
  };
  const handleDecrese = () => {
    zoomValue.value = zoomValue.value - 25;
  };

  return {
    addDragElement,
    updateDragComponent,
    curComponent,
    setComponent,
    updateComponent,
    copyComponent,
    copiedComponent,
    pasteCopiedComponent,
    moveComponent,
    zoomValue,
    realZoomVal,
    handleIncrese,
    handleDecrese
  };
});

export default sheetEditorStore;
