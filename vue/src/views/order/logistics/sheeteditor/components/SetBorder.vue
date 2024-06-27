<template>
  <el-form label-width="80px">
    <template v-for="item in borderList" :key="item.valueProp">
      <el-form-item label-width="20px">
        <el-checkbox
          v-model="formData[item.valueProp]"
          @change="changeShow($event, item)"
          >{{ item.title }}</el-checkbox
        >
      </el-form-item>
      <template v-for="sonElem in item.list" :key="sonElem.valueProp">
        <el-form-item :label="sonElem.title">
          <el-select
            v-model="formData[sonElem.valueProp]"
            @change="changeStyle($event, sonElem)"
          >
            <el-option
              v-for="optionItem in options"
              :key="optionItem"
              :label="optionItem"
              :value="optionItem"
              :disabled="!formData[item.valueProp]"
            />
          </el-select>
        </el-form-item>
      </template>
    </template>
  </el-form>
</template>

<script setup>
  import { ref } from 'vue';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import { borderList } from './constant';
  import $ from 'jquery';
  const store = sheetEditorStore();
  const { curComponent } = storeToRefs(store);

  const options = ['0px', '1px', '2px', '3px', '4px', '5px'];

  const formData = ref({});

  // 赋值
  const init = () => {
    const { style } = curComponent.value;
    borderList.forEach((item) => {
      formData.value[item.valueProp] = item.list.some(
        (elem) => style[elem.valueProp] && style[elem.valueProp] !== '0px'
      );
      item.list.forEach((elem) => {
        formData.value[elem.valueProp] = style[elem.valueProp] || elem.value;
      });
    });
  };
  defineExpose({ init });

  // 如果checkbox没选中，他相关的选项值为0px
  const changeShow = (val, item) => {
    item.list.forEach((elem, index) => {
      let _val = val && !index ? '1px' : '0px';
      formData.value[elem.valueProp] = _val;
      $(curComponent.value.dom).css(elem.valueProp, _val);
    });
  };

  const changeStyle = (value, sonElem) => {
    $(curComponent.value.dom).css(sonElem.valueProp, value);
  };
</script>

<style lang="scss" scoped>
  :deep(.el-form-item--small) {
    margin-bottom: 4px;
  }
  :deep(.el-form-item + .el-form-item) {
    margin-top: 10px;
  }
  .label_set_btns {
    text-align: center;
    margin-top: 10px;
  }
</style>
