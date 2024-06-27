import $ from 'jquery';
import sheetEditorStore from '@/store/modules/sheetEditor';
import { storeToRefs } from 'pinia';
/* eslint-disable */
const useDom = () => {
  const handleClearTpl = () => {
    $('#editor').empty();
  };

  const removeActive = () => {
    $('#editor')
      .find('.dropitem')
      .each(function () {
        $(this).removeClass('active');
      });
  };

  const deleteActive = () => {
    $('#editor').find('.dropitem.active').remove();
  };

  const setEditorHtml = (html) => {
    $('#editor').html(html);
  };

  const appendEditorHtml = (html) => {
    $('#editor').append(html);
  };

  const getEditorHtml = () => {
    return $('#editor').html();
  };

  const findLastDropItem = () => {
    return $('#editor').find('.dropitem').last();
  };

  const mousedownEditor = (fn) => {
    $(document).on('mousedown', '#editor .dropitem', function (e) {
      const node = getParentNodes(e.target);
      fn(e, node, $(node));
    });
  };

  const getParentNodes = (e) => {
    let node = e;
    let flag = true;
    while (flag) {
      if (node.parentNode.className.includes('dropitem')) {
        node = node.parentNode;
        flag = false;
      } else if (node.className.includes('dropitem')) {
        flag = false;
      } else {
        node = node.parentNode;
      }
    }
    return node;
  };

  const clickEditor = (fn) => {
    $(document).on('click', function (e) {
      e.stopPropagation();
      // 点击配置区域，不进行该操作
      let rightPart = $(e.target).closest('.middle_right');
      // e.target.nodeName === 'svg'  输入框的清除符号
      if (
        $(e.target).closest('.dropitem').length <= 0 &&
        rightPart.length <= 0 &&
        e.target.nodeName !== 'svg'
      ) {
        removeActive();
        fn();
      }
    });
  };

  const resizeElement = (fn) => {
    $(document).on('mousedown', '.resize', function (e) {
      const classList = $(this).attr('class').split(' ');
      fn(e, classList);
    });
  };

  const setBarCodeImgHeight = (dom) => {
    const spanTextHeight = $(dom).find('span').css('height');
    const barCodeHeight = $(dom).css('height');
    const imgHeight = parseInt(barCodeHeight) - parseInt(spanTextHeight);
    $(dom)
      .find('img')
      .css('height', imgHeight + 'px');
  };

  const resizeColumn = (fn) => {
    const store = sheetEditorStore();
    const { realZoomVal } = storeToRefs(store);
    let dict = {};
    $(document)
      .on('mousemove', '#editor thead th', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const othis = $(this);
        const oLeft = othis.offset().left;
        const pLeft = e.clientX / realZoomVal.value - oLeft;
        if (dict.resizeStart) return;

        dict.allowResize = othis.width() - pLeft <= 20 / realZoomVal.value; // 是否处于拖拽允许区域
        if (dict.allowResize) {
          $('#editor thead').addClass('resize-column');
          $('body').css({ cursor: 'col-resize' });
        } else {
          $('#editor thead').removeClass('resize-column');
          $('body').css({ cursor: '' });
        }
      })
      .on('mouseleave', '#editor thead th', function () {
        $('#editor thead').removeClass('resize-column');
        $('body').css({ cursor: '' });
        dict.resizeStart = false;
      })
      .on('mousedown', '#editor thead th', function (e) {
        const othis = $(this);
        if (dict.allowResize) {
          e.preventDefault();
          dict.resizeStart = true; // 开始拖拽
          dict.offset = [e.clientX, e.clientY]; // 记录初始坐标
          dict.width = parseFloat(othis.outerWidth());
        }
      })
      .on('mousemove', '#editor thead th', function (e) {
        fn(e, dict);
      })
      .on('mouseup', '#editor thead th', function (e) {
        if (dict.resizeStart) {
          dict = {};
          $('body').css('cursor', '');
        }
      });
  };

  return {
    handleClearTpl,
    clickEditor,
    removeActive,
    setEditorHtml,
    appendEditorHtml,
    findLastDropItem,
    mousedownEditor,
    resizeElement,
    deleteActive,
    getEditorHtml,
    setBarCodeImgHeight,
    resizeColumn
  };
};

export default useDom;
