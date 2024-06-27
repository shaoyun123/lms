<template>
  <el-form label-width="100px">
    <el-form-item label-width="20px">
      <el-checkbox v-model="formData.showTitle" @change="handleShowTitle"
        >显示标题</el-checkbox
      >
    </el-form-item>
    <el-form-item label="标题文本">
      <el-input
        v-model="formData.text"
        :disabled="disabled"
        @change="handleChangeTitle"
      />
    </el-form-item>
    <el-form-item label-width="20px">
      <el-checkbox
        v-model="formData.display"
        true-label="block"
        false-label="inline-block"
        :disabled="disabled"
        @change="changeStyle('display', $event)"
        >标题整行显示</el-checkbox
      >
    </el-form-item>
    <el-form-item v-if="formData.display === 'block'" label="标题对齐方式">
      <el-select
        v-model="formData.textAlign"
        :disabled="disabled"
        @change="changeStyle('textAlign', $event)"
      >
        <el-option
          v-for="item in optionList.textAlign"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option
      ></el-select>
    </el-form-item>
    <el-form-item v-if="formData.display === 'block'" label="标题与内容间距">
      <el-select
        v-model="formData.paddingBottom"
        :disabled="disabled"
        @change="changeStyle('paddingBottom', $event)"
      >
        <el-option
          v-for="item in optionList.paddingBottom"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option
      ></el-select>
    </el-form-item>
    <el-form-item label="标题文字字体">
      <el-select
        v-model="formData.fontFamily"
        :disabled="disabled"
        @change="changeStyle('fontFamily', $event)"
      >
        <el-option
          v-for="item in optionList.fontFamily"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        >
          <span
            :style="{
              fontFamily: item.value
            }"
            >{{ item.label }}</span
          ></el-option
        ></el-select
      >
    </el-form-item>
    <el-form-item label="标题文字尺寸">
      <el-select
        v-model="formData.fontSize"
        :disabled="disabled"
        @change="changeStyle('fontSize', $event)"
      >
        <el-option
          v-for="item in optionList.fontSize"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option
      ></el-select>
    </el-form-item>
    <el-form-item label="标题行距">
      <el-select
        v-model="formData.lineHeight"
        :disabled="disabled"
        @change="changeStyle('lineHeight', $event)"
      >
        <el-option
          v-for="item in optionList.lineHeight"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option
      ></el-select>
    </el-form-item>
    <el-form-item label-width="20px">
      <el-checkbox
        v-model="formData.fontWeight"
        :true-label="700"
        :false-label="400"
        :disabled="disabled"
        @change="changeStyle('fontWeight', $event)"
      >
        标题文字加粗
      </el-checkbox>
    </el-form-item>
    <ResetDelBtns @del="emits('del')" @handle-reset="handleReset" />
  </el-form>
</template>

<script setup>
  import { computed, watch, ref } from 'vue';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import { cloneDeep, mapValues, round } from 'lodash-es';
  import { pow } from 'mathjs';
  import $ from 'jquery';
  import { optionList } from './constant';
  import ResetDelBtns from './ResetDelBtns.vue';

  const store = sheetEditorStore();
  const { curComponent } = storeToRefs(store);

  const emits = defineEmits(['del', 'changeFontSize']);

  const toHump = (name) => {
    // eslint-disable-next-line no-useless-escape
    return name.replace(/\-(\w)/g, function (_, letter) {
      return letter.toUpperCase();
    });
  };
  let formData = ref({});
  const defaultValue = {
    showTitle: true,
    text: '',
    fontSize: '12px',
    display: 'inline-block',
    paddingBottom: '0px',
    textAlign: 'left',
    fontFamily: '微软雅黑',
    lineHeight: 1,
    fontWeight: 400
  };

  const disabled = computed(() => !formData.value.showTitle);
  // 样式
  const init = () => {
    const styles = {};
    const { dom } = curComponent.value;
    const titleDom = $(dom).find('.title');
    titleDom
      .attr('style')
      .split(';')
      .forEach((item) => {
        const keyVal = item.split(':').map((item) => item.replace(' ', ''));
        if (keyVal[0]) {
          styles[toHump(keyVal[0])] = keyVal[1];
        }
      });
    formData.value = mapValues(
      defaultValue,
      (item, index) => styles[index] || item
    );
    formData.value.text = titleDom.text();
    // 字体大小
    if (formData.value?.fontSize) {
      const scale = titleDom.css('transform');
      if (scale !== 'none') {
        // 获取的scale是个矩阵
        const _scale = scale.replace(/[^0-9\-,]/g, '').split(',')[0];
        let multiple = 1;
        // 如果是0开头，表示是小数
        if (_scale.substr(0, 1) === '0') {
          multiple = pow(10, _scale.length - 1);
        }
        formData.value.fontSize = round((_scale * 12) / multiple) + 'px';
      }
    }
    if (styles.display === 'none') {
      formData.value.showTitle = false;
    }
    if (styles.lineHeight) {
      formData.value.lineHeight =
        parseInt(styles.lineHeight || 12) / parseInt(styles.fontSize || 12);
    }
  };
  defineExpose({ init });

  const handleChangeTitle = (e) => {
    const titleDom = $(curComponent.value.dom).find('.title');
    titleDom.text(e);
  };

  const handleShowTitle = (e) => {
    const titleDom = $(curComponent.value.dom).find('.title');
    if (!e) {
      titleDom.css('display', 'none');
    } else {
      if (formData.value.display === 'block') {
        titleDom.css('display', 'block');
      } else {
        titleDom.css('display', 'inline-block');
      }
    }
  };

  const changeStyle = (valueProp, curVal) => {
    const titleDom = $(curComponent.value.dom).find('.title');
    if (valueProp === 'lineHeight') {
      const fontSize = parseInt(formData.value.fontSize);
      curVal = curVal * (fontSize < 12 ? 12 : fontSize) + 'px';
      titleDom.css(valueProp, curVal);
    } else if (valueProp === 'fontSize') {
      emits('changeFontSize', {
        val: curVal,
        textAlign:
          formData.value.display === 'block'
            ? formData.value.textAlign
            : 'left',
        curDom: titleDom,
        parentDom: titleDom
      });
    } else if (valueProp === 'textAlign') {
      const fontSize = parseInt(formData.value.fontSize);
      if (fontSize < 12) {
        titleDom.css('transform-origin', curVal);
      }
      titleDom.css(valueProp, curVal);
    } else {
      titleDom.css(valueProp, curVal);
      if (curVal === 'inline-block') {
        titleDom.css('textAlign', formData.value.textAlign);
      }
    }
  };
  watch(
    () => formData.value?.fontSize,
    (val) => {
      const titleDom = $(curComponent.value.dom).find('.title');
      const intVal = parseInt(val);
      const _lineHeight =
        (intVal < 12 ? 12 : intVal) * formData.value.lineHeight;
      titleDom.css('line-height', _lineHeight + 'px');
    }
  );

  const handleReset = () => {
    formData.value = cloneDeep(defaultValue);
    const title = $(curComponent.value.dom).data('title');
    formData.value.text = title;
    const titleDom = $(curComponent.value.dom).find('.title');
    for (let key in defaultValue) {
      const curVal = defaultValue[key];
      if (key === 'text') {
        titleDom.text(title);
      } else if (key !== 'showTitle') {
        titleDom.css(key, curVal);
      }
    }
    titleDom.css('transform', '').css('transform-origin', '');
  };
</script>

<style lang="scss" scoped>
  :deep(.el-form-item--small) {
    margin-bottom: 4px;
  }
  :deep(.el-form-item + .el-form-item) {
    margin-top: 10px;
  }
</style>
