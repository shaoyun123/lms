<template>
  <el-form label-width="120px" label-position="left">
    <el-form-item label-width="10px">
      <el-checkbox v-model="showBorder" @change="handleShowBorder">
        显示表格框线
      </el-checkbox>
    </el-form-item>
    <template v-for="(item, key) in formData" :key="key">
      <el-form-item v-if="item.value !== undefined" label-width="10px">
        <el-checkbox
          v-model="item.value"
          :true-label="item.trueLabel"
          false-label="none"
          @change="change('display', $event, key)"
          >{{ item.text }}
        </el-checkbox>
      </el-form-item>
      <el-form-item
        v-for="(attr, attrKey) in item.attrs"
        :key="attrKey"
        :label="attr.text"
      >
        <el-select
          v-model="attr.value"
          :disabled="item.value === 'none'"
          @change="change(attrKey, $event, key)"
        >
          <el-option
            v-for="option in attr.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            ><RenderVnode :v-node="option.text || option.label"></RenderVnode
          ></el-option>
        </el-select>
      </el-form-item>
    </template>
    <el-form-item v-if="isTwoPage" label="第一页SKU行数">
      <ZInputNumber
        v-model="lineEnd"
        placeholder="请输入大于0的数字"
        :min="1"
        @blur="changeTableLine"
      />
    </el-form-item>
    <ResetDelBtns @del="emits('del')" @handle-reset="handleReset" />
  </el-form>
</template>

<script setup>
  import { ref } from 'vue';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import { cloneDeep, mapValues, round } from 'lodash-es';
  import $ from 'jquery';
  import { tableDefaultStyle } from './constant';
  import { pow } from 'mathjs';
  import ResetDelBtns from './ResetDelBtns.vue';
  import RenderVnode from './RenderVnode';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';

  const emits = defineEmits(['del', 'changeFontSize']);

  const store = sheetEditorStore();
  const { curComponent } = storeToRefs(store);

  const toHump = (name) => {
    // eslint-disable-next-line no-useless-escape
    return name.replace(/\-(\w)/g, function (_, letter) {
      return letter.toUpperCase();
    });
  };
  const formData = ref();
  const Label_ENUM = {
    thead: 'th',
    tbody: 'tr',
    tfoot: 'td'
  };

  const getFontSize = (dom, label) => {
    const scale = $(dom).find(Label_ENUM[label]).css('transform');
    if (scale !== 'none' && !!scale) {
      // 获取的scale是个矩阵
      const _scale = scale.replace(/[^0-9\-,]/g, '').split(',')[0];
      let multiple = 1;
      // 如果是0开头，表示是小数
      if (_scale.substr(0, 1) === '0') {
        multiple = pow(10, _scale.length - 1);
      }
      formData.value[label].attrs.fontSize.value =
        round((_scale * 12) / multiple) + 'px';
    }
  };

  // 样式
  const init = () => {
    const tableDom = $(curComponent.value.dom).find('table');
    formData.value = cloneDeep(tableDefaultStyle);
    for (let key in formData.value) {
      const item = formData.value[key];
      const styles = {};
      const dom = tableDom.find(`${key}`);
      if (dom.attr('style')) {
        dom
          .attr('style')
          .split(';')
          .forEach((item) => {
            const keyVal = item.split(':').map((item) => item.replace(' ', ''));
            if (keyVal[0]) {
              styles[toHump(keyVal[0])] = keyVal[1];
            }
          });
      }

      if (styles.display === 'none') {
        item.value = 'none';
      }
      item.attrs = mapValues(item.attrs, (attr, attrKey) => ({
        ...attr,
        value: styles[attrKey] || attr.value
      }));

      getFontSize(dom, key);
    }
    if (tableDom.hasClass('no-tdborder')) {
      showBorder.value = false;
    }
    // sku行数
    if ($(curComponent.value.dom).attr('two-page') === 'true') {
      isTwoPage.value = true;
      // 获取行数
      lineEnd.value = Number(tableDom.find('tbody').attr('data-line-end')) + 1;
    }
  };
  defineExpose({ init });

  const showBorder = ref(true);
  const handleShowBorder = (e) => {
    const tableDom = $(curComponent.value.dom).find('table');
    if (e) {
      tableDom.removeClass('no-tdborder');
    } else {
      tableDom.addClass('no-tdborder');
    }
    // 第二分页table
    const secondTableDom = $('.table_content_second_container').find('table');
    if (secondTableDom.length) {
      if (e) {
        secondTableDom.removeClass('no-tdborder');
      } else {
        secondTableDom.addClass('no-tdborder');
      }
    }
  };

  const change = (key, curVal, label) => {
    // 主表格
    changeSpecific($(curComponent.value.dom), key, curVal, label);
    // showFiled($(curComponent.value.dom), key, curVal, true);
    // 第二页表格
    const secondTableDom = $('.table_content_second_container').find(
      '.dropitem'
    );
    if (secondTableDom.length) {
      changeSpecific(secondTableDom, key, curVal, label);
    }
  };

  // 封装下改变样式的操作
  const changeSpecific = ($curDom, key, curVal, label) => {
    const dom = $curDom.find(`table ${label}`);
    if (key === 'fontSize') {
      // 小于12px 设置缩放  transform-origin也需要设置,fontSize设置为12px
      const intVal = parseInt(curVal);
      const cellDom = dom.find(Label_ENUM[label]);
      emits('changeFontSize', {
        val: curVal,
        textAlign: formData?.value[label]?.attrs?.textAlign?.value || 'right',
        curDom: cellDom,
        parentDom: cellDom
      });
      if (intVal < 12) {
        dom.css(key, '12px');
        dom.css('lineHeight', '12px');
      } else {
        dom.css(key, curVal);
        dom.css('lineHeight', curVal);
      }
    } else if (key === 'textAlign') {
      const intVal = parseInt(formData.value[label].attrs.fontSize.value);
      if (intVal < 12) {
        dom.find(Label_ENUM[label]).css('transform-origin', curVal);
      }
      dom.css(key, curVal);
    } else {
      dom.css(key, curVal);
    }
  };

  // #region sku行数
  const isTwoPage = ref(false);
  const defaultLineEnd = 5;
  const lineEnd = ref(defaultLineEnd);
  // const lineEndList = ref([2, 3, 4, 5, 6]);
  const changeTableLine = () => {
    if (curComponent.value) {
      const tableDom = $(curComponent.value.dom).find('table');
      const tbodyDom = tableDom.find('tbody');
      // 第一个表格
      tbodyDom.attr('data-line-end', lineEnd.value - 1);
      // 第二个表格
      const secondTbodyDom = $('#sheetEditorMiddle')
        .find('.table_content_second')
        .find('tbody');
      secondTbodyDom.attr('data-line-start', lineEnd.value);
      secondTbodyDom.removeAttr('data-line-end');
      const trDomList = tbodyDom.find('tr');
      // 相差行数
      const differLine = lineEnd.value - trDomList.length;
      if (differLine < 0) {
        //删除多余行数
        trDomList.each(function (index) {
          if (index > lineEnd.value - 1) {
            $(this).remove();
          }
        });
      } else if (differLine > 0) {
        //添加行数
        const trDomHtml = trDomList.eq(0).prop('outerHTML');
        for (let i = 0; i < differLine; i++) {
          tbodyDom.append(trDomHtml);
        }
        // 设置高度
        const curComponentHeight = $(curComponent.value.dom).height();
        const tabletHeight = tableDom.height();
        if (curComponentHeight < tabletHeight) {
          $(curComponent.value.dom).height(tabletHeight);
        }
      }
    }
  };
  // #endregion sku行数

  const handleReset = () => {
    // 主表格
    reset($(curComponent.value.dom));
    // 第二页表格
    const secondTableDom = $('.table_content_second_container').find(
      '.dropitem'
    );
    if (secondTableDom.length) {
      reset(secondTableDom);
    }
  };
  // 封装下重置的操作
  const reset = ($dom) => {
    const tableDom = $dom.find('table');
    // 显示表格框线
    showBorder.value = true;
    tableDom.removeClass('no-tdborder');
    formData.value = cloneDeep(tableDefaultStyle);
    // 改样式
    for (let key in formData.value) {
      const item = formData.value[key];
      const dom = tableDom.find(`${key}`);
      $(dom).css('display', item.trueLabel);
      $(dom).css('lineHeight', item.attrs.fontSize.value);
      for (let attrKey in item.attrs) {
        if (attrKey === 'fontSize') {
          const cellDom = $(dom).find(Label_ENUM[key]);
          cellDom.css('fontSize', item.attrs[attrKey].value);
        } else {
          $(dom).css(attrKey, item.attrs[attrKey].value);
        }
      }
      $(dom)
        .find(Label_ENUM[key])
        .css('transform-origin', '')
        .css('transform', '');
    }
    // 改sku行数
    if (isTwoPage.value) {
      lineEnd.value = defaultLineEnd;
      changeTableLine();
    }
  };
</script>

<style lang="scss" scoped>
  :deep(.el-form-item) {
    display: block;
    margin-left: 10px;
  }
  :deep(.el-form-item--small) {
    margin-bottom: 4px;
  }
  :deep(.el-form-item + .el-form-item) {
    margin-top: 10px;
  }
</style>
