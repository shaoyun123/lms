<template>
  <el-form>
    <template v-for="(item, key) in formData" :key="key">
      <el-form-item v-if="item.component === 'el-select'" :label="item.text">
        <el-select
          v-model="item.value"
          v-bind="item.extraProps"
          :disabled="item.showDisabled && disabled"
          @change="changeStyle(key, $event)"
        >
          <el-option
            v-for="elem in optionList[key]"
            :key="elem.value"
            :value="elem.value"
            :label="elem.label"
          ></el-option
        ></el-select>
      </el-form-item>
      <el-form-item
        v-else-if="item.component === 'el-checkbox'"
        label-width="20px"
      >
        <el-checkbox
          v-model="item.value"
          v-bind="item.extraProps"
          :disabled="item.showDisabled && disabled"
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
  import { computed, ref } from 'vue';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import { cloneDeep, isEmpty, round } from 'lodash-es';
  import { pow } from 'mathjs';
  import $ from 'jquery';
  import { optionList, styleToMap } from './constant';
  import ResetDelBtns from './ResetDelBtns.vue';

  const emits = defineEmits(['del', 'changeFontSize']);

  const store = sheetEditorStore();
  const { curComponent } = storeToRefs(store);

  const toHump = (name) => {
    // eslint-disable-next-line no-useless-escape
    return name.replace(/\-(\w)/g, function (_, letter) {
      return letter.toUpperCase();
    });
  };
  const formData = ref({});

  const init = () => {
    const { dom, type } = curComponent.value;
    formData.value = cloneDeep(styleToMap[type]);
    const styles = {};
    const imgDom = $(dom).find('img');
    const spanDom = $(dom).find('span');
    spanDom
      .attr('style')
      ?.split(';')
      ?.forEach((item) => {
        const keyVal = item.split(':').map((item) => item.replace(' ', ''));
        if (keyVal[0]) {
          styles[toHump(keyVal[0])] = keyVal[1];
        }
      });
    if (!isEmpty(styles)) {
      for (let key in formData.value) {
        if (!isEmpty(styles[key])) {
          formData.value[key].value = styles[key];
        }
      }
    }
    // 字体大小
    if (formData.value?.fontSize?.value) {
      const scale = $(dom).find('span').css('transform');
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
    if (type === 'barcode') {
      formData.value.codeFormat.value = imgDom.attr('code-format') || 'code128';
    }
  };
  defineExpose({ init });

  const disabled = computed(() => formData.value.display.value === 'none');

  const changeStyle = (valueProp, e) => {
    const spanDom = $(curComponent.value.dom).find('span');
    if (valueProp === 'codeFormat') {
      const imgDom = $(curComponent.value.dom).find('img');
      imgDom.attr('code-format', e);
    } else if (valueProp === 'fontSize') {
      // 小于12px 设置缩放  transform-origin也需要设置
      emits('changeFontSize', {
        val: e,
        textAlign: formData.value?.textAlign?.value || 'left',
        curDom: spanDom,
        parentDom: spanDom
      });
      spanDom.css('line-height', parseInt(e) < 12 ? '12px' : e);
    } else if (valueProp === 'textAlign') {
      const fontSize = parseInt(formData.value?.fontSize?.value);
      if (fontSize < 12) {
        spanDom.css('transform-origin', e);
      }
      spanDom.css(valueProp, e);
    } else {
      spanDom.css(valueProp, e);
    }
  };

  const handleReset = () => {
    const { dom, type } = curComponent.value;
    formData.value = cloneDeep(styleToMap[type]);
    const spanDom = $(dom).find('span');
    for (let key in formData.value) {
      const keyVal = formData.value[key];
      if (key === 'codeFormat') {
        const imgDom = $(curComponent.value.dom).find('img');
        imgDom.attr('code-format', keyVal.value);
      } else if (key === 'fontSize') {
        spanDom.css('transform', '').css('transform-origin', '');
      } else {
        spanDom.css(key, keyVal.value);
      }
    }
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
