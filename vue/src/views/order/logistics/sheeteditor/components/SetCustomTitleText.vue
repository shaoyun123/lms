<template>
  <el-form label-width="110px">
    <template v-for="(v, vKey) in formData" :key="vKey">
      <template v-for="(item, key) in v" :key="key">
        <el-form-item v-if="item.component === 'el-input'" :label="item.text">
          <el-input
            v-model="item.value"
            v-bind="item.extraProps"
            @change="changeStyle(vKey, key, $event)"
          />
        </el-form-item>
        <el-form-item v-if="item.component === 'el-select'" :label="item.text">
          <el-select
            v-model="item.value"
            @change="changeStyle(vKey, key, $event)"
          >
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
        <el-form-item
          v-if="item.component === 'el-checkbox'"
          label-width="110px"
        >
          <el-checkbox
            v-model="item.value"
            v-bind="item.extraProps"
            @change="changeStyle(vKey, key, $event)"
          >
            {{ item.text }}
          </el-checkbox>
        </el-form-item>
      </template>
    </template>
    <ResetDelBtns
      :show-copy-btn="showCopyBtn"
      @del="emits('del')"
      @copy="emits('copy')"
      @handle-reset="handleReset"
    />
  </el-form>
</template>

<script setup>
  /* eslint-disable */
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

  defineProps({
    showCopyBtn: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(['del', 'changeFontSize', 'copy']);

  const init = () => {
    const { dom, style, type } = curComponent.value;
    formData.value = cloneDeep(styleToMap[type]);
    for (let key in style) {
      if (formData.value?.whole[key]) {
        formData.value.whole[key].value = JSON.parse(
          JSON.stringify(style[key])
        );
      }
    }
    // 字体大小
    if (formData.value?.whole?.fontSize) {
      const scale = $(dom).css('transform');
      if (scale !== 'none') {
        // 获取的scale是个矩阵
        const _scale = scale.replace(/[^0-9\-,]/g, '').split(',')[0];
        let multiple = 1;
        // 如果是0开头，表示是小数
        if (_scale.substr(0, 1) === '0') {
          multiple = pow(10, _scale.length - 1);
        }
        formData.value.whole.fontSize.value =
          round((_scale * 12) / multiple) + 'px';
      }
    }
    // 行距
    if (formData.value?.whole?.lineHeight) {
      formData.value.whole.lineHeight.value =
        parseInt(style.lineHeight || 12) / parseInt(style?.fontSize || 12);
    }
    //  文本标题
    formData.value.title.text.value = $(dom).find('.title').text();
    //  文本内容
    formData.value.detail.text.value = $(dom).find('.detail').text();
    //  文本标题
    formData.value.title.fontWeight.value = $(dom)
      .find('.title')
      .css('fontWeight');
    //  文本内容
    formData.value.detail.fontWeight.value = $(dom)
      .find('.detail')
      .css('fontWeight');
  };
  defineExpose({ init });

  const changeStyle = (part, key, val) => {
    const curDom = $(curComponent.value.dom);

    if (key === 'lineHeight') {
      const fontSize = parseInt(formData.value[part].fontSize.value);
      const _lineHeight = (fontSize < 12 ? 12 : fontSize) * val;
      curDom.css(key, _lineHeight + 'px');
    } else if (key === 'fontSize') {
      // 小于12px 设置缩放  transform-origin也需要设置
      emits('changeFontSize', {
        val,
        textAlign: formData.value?.[part].textAlign?.value || 'left',
        curDom: curDom,
        parentDom: curDom
      });
    } else if (key === 'textAlign') {
      if (formData.value?.[part].fontSize?.value) {
        const fontSize = parseInt(formData.value?.[part].fontSize?.value);
        if (fontSize < 12) {
          curDom.css('transformOrigin', `${val} top`);
        }
        curDom.css(key, val);
      }
    } else if (key === 'whiteSpace') {
      curDom.css(key, val);
      curDom.css('overflow', val === 'normal' ? 'unset' : 'hidden');
    } else if (key === 'text') {
      //文本
      $(curDom).find(`.${part}`).text(formData.value[part].text.value);
    } else if (key === 'fontWeight') {
      //加粗
      $(curDom)
        .find(`.${part}`)
        .css(key, formData.value[part].fontWeight.value);
    } else {
      curDom.css(key, val);
    }
  };
  watch(
    () => formData.value?.whole.fontSize?.value,
    (val) => {
      const { lineHeight } = formData.value?.whole;
      if (lineHeight) {
        const curDom = $(curComponent.value.dom);
        const intVal = parseInt(val);
        const _lineHeight = (intVal < 12 ? 12 : intVal) * lineHeight.value;
        curDom.css('line-height', _lineHeight + 'px');
      }
    }
  );

  const handleReset = () => {
    const { type, dom } = curComponent.value;
    formData.value = cloneDeep(styleToMap[type]);
    for (let v in formData.value) {
      for (let key in formData.value[v]) {
        const curVal = formData.value[v][key].value;
        if (key === 'text') {
          //文本
          $(dom).find(`.${v}`).text(formData.value[v].text.value);
        } else if (key === 'fontWeight') {
          //加粗
          $(dom).find(`.${v}`).css(key, formData.value[v].fontWeight.value);
        } else if (key === 'lineHeight') {
          // 行距
          const fontSizeVal = formData.value[v].fontSize.value;
          const lineHeightVal = curVal * parseInt(fontSizeVal || 12) + 'px';
          $(dom).css(key, lineHeightVal);
        } else if (key === 'whiteSpace') {
          $(dom).css(key, curVal);
          $(dom).css('overflow', curVal === 'normal' ? 'unset' : 'hidden');
        } else {
          $(dom).css(key, curVal);
        }
      }
    }
    $(dom).css('transform', '').css('transform-origin', '');
  };
</script>

<style lang="scss" scoped></style>
