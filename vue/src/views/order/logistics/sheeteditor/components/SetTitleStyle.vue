<template>
  <el-form label-width="110px">
    <template v-for="(item, key) in formData" :key="key">
      <el-form-item v-if="item.component === 'el-input'" :label="item.text">
        <el-input
          v-model="item.value"
          v-bind="item.extraProps"
          @change="changeStyle(key, $event)"
        />
      </el-form-item>
      <el-form-item v-if="item.component === 'el-select'" :label="item.text">
        <el-select v-model="item.value" @change="changeStyle(key, $event)">
          <el-option
            v-for="elem in optionList[key]"
            :key="elem.value"
            :value="elem.value"
            :label="elem.label"
            ><RenderVnode
              :v-node="elem.text || elem.label"
            ></RenderVnode></el-option
        ></el-select>
      </el-form-item>
      <el-form-item v-if="item.component === 'el-checkbox'" label-width="20px">
        <el-checkbox
          v-model="item.value"
          v-bind="item.extraProps"
          @change="changeStyle(key, $event)"
        >
          {{ item.text }}
        </el-checkbox>
      </el-form-item>
    </template>
    <ResetDelBtns @del="emits('del')" @handle-reset="handleReset" />
  </el-form>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { optionList, styleToMap } from './constant';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import { cloneDeep, round } from 'lodash-es';
  import $ from 'jquery';
  import RenderVnode from './RenderVnode';
  import { pow } from 'mathjs';
  import ResetDelBtns from './ResetDelBtns.vue';

  const store = sheetEditorStore();
  const { curComponent } = storeToRefs(store);
  const formData = ref();

  const emits = defineEmits(['del', 'changeFontSize']);

  const toHump = (name) => {
    // eslint-disable-next-line no-useless-escape
    return name.replace(/\-(\w)/g, function (_, letter) {
      return letter.toUpperCase();
    });
  };

  const init = () => {
    const { style, dom, type } = curComponent.value;
    formData.value = cloneDeep(styleToMap[type]);
    const detailDom = $(dom).find('.detail');
    const styles = {};
    formData.value.textAlign.value = style.textAlign || 'left';
    formData.value.whiteSpace.value = style.whiteSpace || 'normal';
    detailDom
      .attr('style')
      ?.split(';')
      ?.forEach((item) => {
        const keyVal = item.split(':').map((item) => item.replace(' ', ''));
        if (keyVal[0]) {
          styles[toHump(keyVal[0])] = keyVal[1];
        }
      });
    for (let key in styles) {
      if (formData.value?.[key]) {
        formData.value[key].value = JSON.parse(JSON.stringify(styles[key]));
      }
    }
    // 字体大小
    if (formData.value?.fontSize) {
      const scale = detailDom.css('transform');
      if (scale !== 'none') {
        // 获取的scale是个矩阵
        const _scale = scale.replace(/[^0-9\-,]/g, '').split(',')[0];
        let multiple = 1;
        // 如果是0开头，表示是小数
        if (_scale.substr(0, 1) === '0') {
          multiple = pow(10, _scale.length - 1);
        }
        formData.value.fontSize.value = round((_scale * 12) / multiple) + 'px';
      }
    }
    // 行距
    if (formData.value?.lineHeight) {
      formData.value.lineHeight.value =
        parseInt(styles.lineHeight || 12) / parseInt(styles?.fontSize || 12);
    }
    // //  文本
    // if (formData.value?.text) {
    //   formData.value.text.value = detailDom.text();
    // }
    //  邮编默认大写
    // if (formData.value.textTransform) {
    //   formData.value.textTransform.value = showPostCode;
    // }
  };
  defineExpose({ init });

  const changeStyle = (key, val) => {
    const curDom = $(curComponent.value.dom).find('.detail');
    if (key === 'text') {
      curDom.text(val);
    } else if (key === 'lineHeight') {
      const fontSize = parseInt(formData.value.fontSize.value);
      const _lineHeight = (fontSize < 12 ? 12 : fontSize) * val;
      curDom.css(key, _lineHeight + 'px');
    } else if (key === 'fontSize') {
      // 小于12px 设置缩放  transform-origin也需要设置
      emits('changeFontSize', {
        val,
        textAlign: formData.value?.textAlign?.value || 'left',
        curDom,
        parentDom: curDom
      });
    } else if (key === 'textAlign') {
      $(curComponent.value.dom).css(key, val);
      const fontSize = parseInt(formData.value.fontSize.value);
      if (fontSize < 12) {
        curDom.css('transform-origin', val);
      }
    } else if (key === 'whiteSpace') {
      $(curComponent.value.dom).css(key, val);
      if (val === 'normal') {
        $(curComponent.value.dom).css('overflow', 'unset');
      } else {
        $(curComponent.value.dom).css('overflow', 'hidden');
      }
    } else {
      curDom.css(key, val);
    }
  };
  watch(
    () => formData.value?.fontSize?.value,
    (val) => {
      if (formData.value?.lineHeight) {
        const curDom = $(curComponent.value.dom).find('.detail');
        const intVal = parseInt(val);
        const _lineHeight =
          (intVal < 12 ? 12 : intVal) * formData.value.lineHeight.value;
        curDom.css('line-height', _lineHeight + 'px');
      }
    }
  );

  const handleReset = () => {
    const { type, dom } = curComponent.value;
    const detailDom = $(dom).find('.detail');
    formData.value = cloneDeep(styleToMap[type]);
    for (let key in formData.value) {
      const curVal = formData.value[key].value;
      if (key === 'text') {
        //文本
        detailDom.find('.detail').text(formData.value.text.value);
      } else if (key === 'lineHeight') {
        // 行距
        const fontSizeVal = formData.value.fontSize.value;
        const lineHeightVal = curVal * parseInt(fontSizeVal || 12) + 'px';
        detailDom.css(key, lineHeightVal);
      } else if (key === 'textAlign') {
        $(dom).css(key, curVal);
      } else if (key === 'whiteSpace') {
        $(dom).css(key, curVal);
        $(dom).css('overflow', 'hidden');
      } else {
        detailDom.css(key, curVal);
      }
    }
    detailDom.css('transform', '').css('transform-origin', '');
  };
</script>

<style lang="scss" scoped></style>
