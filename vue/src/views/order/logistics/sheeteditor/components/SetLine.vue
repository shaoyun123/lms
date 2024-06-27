<template>
  <el-form label-width="120px">
    <el-form-item>
      <el-button type="primary" @click="setMaxLength">设为100%</el-button>
    </el-form-item>
    <el-form-item v-if="formData.type === 'x-line'" label="线条长度(单位：px)">
      <div>
        <el-input-number
          v-model="formData.width"
          :precision="0"
          :step="1"
          :min="15"
          @change="changeStyle('width', $event)"
        />
      </div>
    </el-form-item>
    <el-form-item v-if="formData.type === 'y-line'" label="线条高度(单位：px)">
      <el-input-number
        v-model="formData.height"
        :precision="0"
        :step="1"
        :min="15"
        @change="changeStyle('height', $event)"
      />
    </el-form-item>
    <el-form-item label="线条类型">
      <el-select
        v-model="formData.borderStyle"
        @change="changeStyle('borderStyle', $event)"
      >
        <el-option
          v-for="item in optionList.borderStyle"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option
      ></el-select>
    </el-form-item>
    <el-form-item label="线条厚度">
      <el-select
        v-model="formData.borderWidth"
        @change="changeStyle('borderWidth', $event)"
      >
        <el-option
          v-for="item in optionList.borderWidth"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option
      ></el-select>
    </el-form-item>
    <!-- <el-form-item label-width="100px">
      <el-checkbox
        v-model="lineBold"
        :true-label="defaultLineBold"
        @change="changeBold"
      >
        线段加粗
      </el-checkbox>
    </el-form-item> -->
    <ResetDelBtns
      :show-copy-btn="showCopyBtn"
      @del="emits('del')"
      @copy="emits('copy')"
      @handle-reset="handleReset"
    />
  </el-form>
</template>

<script setup>
  import { ref } from 'vue';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import $ from 'jquery';
  import { optionList } from './constant';
  import ResetDelBtns from './ResetDelBtns.vue';

  defineProps({
    showCopyBtn: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(['del', 'copy']);

  const store = sheetEditorStore();
  const { curComponent } = storeToRefs(store);
  const formData = ref({});
  // const lineBold = ref('');
  // const defaultLineBold = '3px';
  const borderDirectionObj = {
    'x-line': 'borderTop',
    'y-line': 'borderLeft'
  };

  const borderKey = ref('borderLeft');
  const init = () => {
    const { type, style } = curComponent.value;
    if (['x-line', 'y-line'].includes(type)) {
      // 获取editor的长宽
      // const container = document.getElementById('editor');
      // const { width: editorWidth, height: editorHeight } =
      //   container.getBoundingClientRect();

      formData.value.type = type;
      formData.value.width = parseInt(style.width);
      formData.value.height = parseInt(style.height);
      borderKey.value = borderDirectionObj[type];

      // if (style.width === '100%') {
      //   formData.value.width = editorWidth;
      // }
      // if (style.height === '100%') {
      //   formData.value.height = editorHeight;
      // }

      const borderList = style[borderKey.value].split(' ');
      formData.value.borderStyle = borderList[1];
      formData.value.borderWidth = borderList[0];
      // if (formData.value.borderWidth === defaultLineBold) {
      //   lineBold.value = defaultLineBold;
      // } else {
      //   lineBold.value = '';
      // }
    }
  };
  defineExpose({ init });

  const changeStyle = (key, curVal) => {
    if (key === 'borderStyle') {
      const _val = [formData.value.borderWidth, curVal, 'rgb(0, 0, 0)'].join(
        ' '
      );
      $(curComponent.value.dom).css(borderKey.value, _val);
    } else if (key === 'borderWidth') {
      const _val = [curVal, formData.value.borderStyle, 'rgb(0, 0, 0)'].join(
        ' '
      );
      const _temp = formData.value.type === 'x-line' ? 'height' : 'width';
      $(curComponent.value.dom).css(borderKey.value, _val);
      $(curComponent.value.dom).css(_temp, curVal);
      // if (curVal === defaultLineBold) {
      //   lineBold.value = defaultLineBold;
      // } else {
      //   lineBold.value = '';
      // }
    } else {
      $(curComponent.value.dom).css(key, curVal);
    }
  };
  const setMaxLength = () => {
    // 获取editor的长宽
    const container = document.getElementById('editor');
    const { width: editorWidth, height: editorHeight } =
      container.getBoundingClientRect();
    if (formData.value.type === 'x-line') {
      $(curComponent.value.dom).css('width', editorWidth + 'px');
      formData.value.width = editorWidth;
    } else if (formData.value.type === 'y-line') {
      $(curComponent.value.dom).css('height', editorHeight + 'px');
      formData.value.height = editorHeight;
    }
  };

  // const changeBold = (val) => {
  //   const { borderStyle, type } = formData.value;
  //   if (val === defaultLineBold) {
  //     formData.value.borderWidth = defaultLineBold;
  //   } else {
  //     formData.value.borderWidth = '2px';
  //   }
  //   const _val = [formData.value.borderWidth, borderStyle, 'rgb(0, 0, 0)'].join(
  //     ' '
  //   );
  //   const _temp = type === 'x-line' ? 'height' : 'width';
  //   $(curComponent.value.dom).css(borderKey.value, _val);
  //   $(curComponent.value.dom).css(_temp, val);
  // };

  const handleReset = () => {
    const { type, dom } = curComponent.value;
    if (['x-line', 'y-line'].includes(type)) {
      // 获取editor的长宽
      const container = document.getElementById('editor');
      const { width: editorWidth, height: editorHeight } =
        container.getBoundingClientRect();

      formData.value.type = type;
      borderKey.value = borderDirectionObj[type];
      // 改数值
      if (type === 'x-line') {
        formData.value.width = editorWidth;
        $(dom).css('width', editorWidth);
        formData.value.height = '2px';
      }
      if (type === 'y-line') {
        formData.value.height = editorHeight;
        $(dom).css('height', editorWidth);
        formData.value.width = '2px';
      }
      formData.value.borderStyle = 'solid';
      // lineBold.value = '';
      formData.value.borderWidth = '2px';
      // 改样式
      const _val = ['2px', 'solid', 'rgb(0, 0, 0)'].join(' ');
      $(dom).css(borderKey.value, _val);
    }
  };
</script>

<style lang="scss" scoped>
  .btn {
    margin: 0 0 10px 20px;
  }
</style>
