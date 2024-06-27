<template>
  <div>
    <div id="editor" :ref="drop"></div>
  </div>
  <!-- 
    <div class="resizers">
      <div class="resize top-left"></div>
      <div class="resize top-right"></div>
      <div class="resize right"></div>
      <div class="resize bottom-left"></div>
      <div class="resize bottom-right"></div>
      <div class="resize bottom"></div>
    </div>
  </div> -->
</template>

<script setup>
  /* eslint-disable */
  import { nextTick, onMounted, inject, computed } from 'vue';
  import { useDrop } from 'vue3-dnd';
  import { without } from 'lodash-es';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import { min } from 'mathjs';
  import { positionHtmlObj } from './constant';
  import { ElMessage } from 'element-plus';

  const removeActive = inject('removeActive');
  const findLastDropItem = inject('findLastDropItem');
  const appendEditorHtml = inject('appendEditorHtml');
  const mousedownEditor = inject('mousedownEditor');
  const clickEditor = inject('clickEditor');
  const resizeElement = inject('resizeElement');
  const setBarCodeImgHeight = inject('setBarCodeImgHeight');
  const isExistTwoPageTable = inject('isExistTwoPageTable');
  const resizeColumn = inject('resizeColumn');

  //传值给父组件
  const emits = defineEmits(['table-dom']);
  const [, drop] = useDrop({
    accept: ['BOX'],
    drop: (item, monitor) => {
      const { x, y } = monitor.getClientOffset();
      const { type, itemHtml } = item;
      const container = document.getElementById('editor');
      const {
        top: containerTop,
        left: containerLeft,
        width: containerWidth,
        height: containerHeight
      } = container.getBoundingClientRect();

      removeActive();
      const newHtml = itemHtml.slice(0, -6) + positionHtmlObj[type] + '</div>';
      appendEditorHtml(newHtml);

      const curDom = findLastDropItem();
      let left = x / realZoomVal.value - containerLeft - 50 + 'px';
      let top = y / realZoomVal.value - containerTop - 15 + 'px';
      // 横线，表格初始宽度为100%，
      if (['x-line', 'table'].includes(type)) {
        left = '0px';
        curDom.css('width', containerWidth + 'px');
        // 已存在了一个分页的table。皆不能再添加了
        if (type === 'table') {
          if (!isExistTwoPageTable.value) {
            // curDom加一个属性 two-page="true" 分页
            const twoPage = curDom.attr('two-page');
            if (twoPage === 'true') {
              emits('table-dom', newHtml);
            }
          } else {
            curDom.remove();
            ElMessage.warning('分页表格已存在');
            return undefined;
          }
        }
      }
      // 横线，表格初始高度为100%，
      if (['y-line'].includes(type)) {
        top = '0px';
        curDom.css('height', containerHeight + 'px');
      }
      // 条形码默认高度50px
      if (['barcode'].includes(type)) {
        // curDom.css('height')
        let barcodeHeight = curDom.css('height');
        curDom.css('height', barcodeHeight);
        curDom.find('img').css('width', '100%');
      }
      // 不超出边界
      const curDomWidth = parseFloat(curDom.css('width'));
      const curDomHeight = parseFloat(curDom.css('height'));
      if (parseFloat(left) < 0) {
        left = '0px';
      } else if (containerWidth < curDomWidth + parseFloat(left)) {
        left = containerWidth - curDomWidth + 'px';
      }
      if (parseFloat(top) < 0) {
        top = '0px';
      } else if (containerHeight < curDomHeight + parseFloat(top)) {
        top = containerHeight - curDomHeight + 'px';
      }

      curDom.css('left', left);
      curDom.css('top', top);
      curDom.addClass('active');
      setComponent(curDom);
      return undefined;
    }
  });

  const store = sheetEditorStore();
  const { curComponent, realZoomVal } = storeToRefs(store);
  const { setComponent } = store;
  // 拖拽和放大缩小中的100表示可以移到面板以外的100px
  const extendPx = 100;
  onMounted(async () => {
    await nextTick();
    // 点击
    // 拖拽
    mousedownEditor((e, node, nodeDom) => {
      setActive(nodeDom);
      startMove(e, node);
    });
    // // 放大缩小
    resizeElement((e, classList) => {
      startResize(without(classList, 'resize')[0], e);
    });
    // 点击非画板元素，去除选中
    clickEditor(() => {
      setComponent(null);
    });
    // 拖拽表格列
    resizeColumn((e, dict) => {
      resizeTableColumn(e, dict);
    });
  });

  // 选中元素
  const setActive = (dom = null) => {
    if (!dom.hasClass('active')) {
      removeActive();
      dom.addClass('active');
      setComponent(dom);
    }
  };

  // 拖拽
  const calculateMovePosition = (e, gap) => {
    const container = document.getElementById('editor');
    const {
      top: containerTop,
      left: containerLeft,
      width,
      height
    } = container.getBoundingClientRect();
    let left = e.clientX / realZoomVal.value - gap.x - containerLeft;
    let top = e.clientY / realZoomVal.value - gap.y - containerTop;
    // 拖拽不超出边界
    if (left > width + extendPx - gap.width) {
      left = width + extendPx - gap.width;
    } else if (left < -extendPx) {
      left = -extendPx;
    }
    if (top > height + extendPx - gap.height) {
      top = height + extendPx - gap.height;
    } else if (top < -extendPx) {
      top = -extendPx;
    }

    return { left, top };
  };
  const whiteList = ['TH'];
  // 移动
  const startMove = (e, currenElement) => {
    const { tagName } = e.target;
    if (
      tagName &&
      whiteList.includes(tagName) &&
      document.body.style.cursor === 'col-resize'
    )
      return;
    const gap = { x: 0, y: 0, width: 0, height: 0 };
    let isMoving = false;
    // let currenElement = e.target;
    if (currenElement) {
      const { left, top, width, height } =
        currenElement.getBoundingClientRect();
      gap.x = e.clientX / realZoomVal.value - left;
      gap.y = e.clientY / realZoomVal.value - top;
      gap.width = width;
      gap.height = height;
    }
    const handleMove = (e) => {
      isMoving = true;
      const { left, top } = calculateMovePosition(e, gap);
      if (currenElement) {
        currenElement.style.left = left + 'px';
        currenElement.style.top = top + 'px';
        if (curComponent.value.type === 'table') {
          // 如果是表格的话，更新第二页
          updateSecondTable();
        }
      }
    };
    const handleMouseUp = () => {
      // if (isMoving) {
      // }
      document.removeEventListener('mousemove', handleMove);
      nextTick(() => {
        document.removeEventListener('mouseup', handleMouseUp);
      });
      isMoving = false;
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 放大缩小元素
  const calculateSize = (direction, e, position) => {
    const { pageX, pageY } = e;
    const { left, top, right, bottom } = position;
    const container = document.getElementById('editor');
    const rightWidth = pageX / realZoomVal.value - left;
    const bottomHeight = pageY / realZoomVal.value - top;
    const topHeight = bottom - pageY / realZoomVal.value;
    const leftWidth = right - pageX / realZoomVal.value;
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();
    const topOffset =
      pageY / realZoomVal.value - containerTop + container.scrollTop;
    const leftOffset = pageX / realZoomVal.value - containerLeft;
    // 放大不超出边界
    switch (direction) {
      case 'top-left':
        return {
          width:
            leftOffset < -extendPx
              ? right + extendPx - containerLeft
              : leftWidth,
          height:
            topOffset < -extendPx
              ? bottom + extendPx - containerTop
              : topHeight,
          top: topOffset < -extendPx ? -extendPx : topOffset,
          left: leftOffset < -extendPx ? -extendPx : leftOffset
        };
      case 'top-right':
        return {
          width: rightWidth,
          height:
            topOffset < -extendPx
              ? bottom + extendPx - containerTop
              : topHeight,
          top: topOffset < -extendPx ? -extendPx : topOffset
        };
      case 'right':
        return {
          width: rightWidth
        };
      case 'bottom-left':
        return {
          width:
            leftOffset < -extendPx
              ? right + extendPx - containerLeft
              : leftWidth,
          height: bottomHeight,
          left: leftOffset < -extendPx ? -extendPx : leftOffset
        };
      case 'bottom-right':
        return {
          width: rightWidth,
          height: bottomHeight
        };
      case 'bottom':
        return {
          height: bottomHeight
        };
    }
  };
  // 放大缩小
  const startResize = (direction, e) => {
    e.stopPropagation();
    // 获取editor的长宽
    const container = document.getElementById('editor');
    const { width: editorWidth, height: editorHeight } =
      container.getBoundingClientRect();
    let currenElement = e.target.parentNode.parentNode;

    const { left, top, right, bottom } = currenElement.getBoundingClientRect();

    // 正方形，圆形宽和长同时变化
    const { type } = curComponent.value;
    let isSameResize = false;
    if (['circular'].includes(type)) {
      isSameResize = true;
    }

    const handleStartResizeMove = (e) => {
      let size = calculateSize(direction, e, { left, top, right, bottom });
      const { style } = currenElement;
      if (size) {
        if (size.top) {
          style.top = size.top + 'px';
        }
        if (size.left) {
          style.left = size.left + 'px';
        }
        if (direction === 'bottom' && isSameResize) {
          size.width = size.height;
        }
        if (direction === 'right' && isSameResize) {
          size.height = size.width;
        }
        if (size.width) {
          const _width = min(
            size.width,
            editorWidth + extendPx - parseFloat(style.left)
          );
          style.width = _width + 'px';
        }
        if (size.height) {
          const _height = min(
            size.height,
            editorHeight + extendPx - parseFloat(style.top)
          );
          style.height = _height + 'px';
        }
      }
      if (curComponent.value.type === 'barcode') {
        setBarCodeImgHeight(curComponent.value.dom);
      }
      if (curComponent.value.type === 'table') {
        // 如果是表格的话，更新第二页
        updateSecondTable();
      }
    };
    const handleStartResizeMouseUp = () => {
      document.removeEventListener('mousemove', handleStartResizeMove);
      nextTick(() => {
        document.removeEventListener('mouseup', handleStartResizeMouseUp);
      });
    };
    document.addEventListener('mousemove', handleStartResizeMove);
    document.addEventListener('mouseup', handleStartResizeMouseUp);
  };

  // 表格列的拖拽
  const resizeTableColumn = (e, dict) => {
    if (dict.resizeStart) {
      e.preventDefault();
      if (dict.width) {
        var setWidth =
          dict.width + e.clientX / realZoomVal.value - dict.offset[0];
      }
      e.target.style.width = setWidth + 'px';
      // 若存在第二页，更新第二页
      updateSecondTable();
    }
  };
  // 若存在第二页，更新第二页;若存在第二页，editor里的table只会有一个
  const updateSecondTable = () => {
    if (isExistTwoPageTable.value) {
      // curDom加一个属性
      const newHtml =
        document.querySelectorAll('#editor table')[0].parentNode.outerHTML;
      emits('table-dom', newHtml, false);
    }
  };
  // mounted(el, binding) {
  //   el.onmousedown = function (e) {
  //     const init = e.clientX;
  //     const initWidth = el.offsetWidth;
  //     document.onmousemove = function (e) {
  //       const end = e.clientX;
  //       const newWidth = init - end + initWidth;
  //       if (newWidth > binding.value) {
  //         el.style.width = newWidth + 'px';
  //       }
  //     };
  //     document.onmouseup = function () {
  //       document.onmousemove = document.onmouseup = null;
  //     };
  //   };
  // }
</script>

<style src="@/styles/sheetEditor.css"></style>
<style lang="scss">
  #editor {
    border: 1px solid #e0e0e0;

    .dropitem {
      &:hover {
        cursor: move;
      }
      .resize-column {
        cursor: col-resize;
      }
    }
    .dropitem.active {
      -webkit-box-shadow: 0 0 2px 1px #63d3e9;
      box-shadow: 0 0 2px 1px #63d3e9;
    }
    .dropitem.active .resizers {
      display: block !important;
      .resize {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        opacity: 0;
      }

      .top-left {
        top: -10px;
        left: -10px;
        cursor: nwse-resize;
      }
      .top-right {
        top: -10px;
        right: -10px;
        cursor: nesw-resize;
      }
      .right {
        z-index: 90;
        cursor: e-resize;
        width: 9px;
        right: -5px;
        top: 0;
        height: 100%;
      }
      .bottom-left {
        bottom: -10px;
        left: -10px;
        cursor: nesw-resize;
      }
      .bottom-right {
        bottom: -10px;
        right: -10px;
        cursor: nwse-resize;
      }
      .bottom {
        z-index: 90;
        cursor: s-resize;
        height: 9px;
        width: 100%;
        bottom: -5px;
        left: 0;
      }
    }
  }
</style>
