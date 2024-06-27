<template>
  <el-form label-width="20px">
    <!-- 修改表头 -->
    <!-- <el-form-item
      v-for="(val, key) in formData"
      :key="key"
      :label="val.title + '表头文字:'"
    >
      <el-input
        v-model="val.text"
        clearable
        @change="handleChangeTitle(key, $event)"
      />
    </el-form-item> -->
    <el-form-item v-for="(val, key) in formData" :key="val">
      <el-checkbox v-model="val.display" @change="handleShowField(key, $event)"
        >显示{{ val.text }}</el-checkbox
      ></el-form-item
    >
    <ResetDelBtns @del="emits('del')" @handle-reset="handleReset" />
  </el-form>
</template>

<script setup>
  import { ref } from 'vue';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import $ from 'jquery';
  import ResetDelBtns from './ResetDelBtns.vue';

  const store = sheetEditorStore();
  const { curComponent } = storeToRefs(store);

  const emits = defineEmits(['del']);

  const formData = ref({});
  const footColSpan = ref(0);

  // 样式
  const init = () => {
    const thDoms = $(curComponent.value.dom).find('table thead th');
    formData.value = {};
    footColSpan.value = 0;
    thDoms.each(function () {
      const text = $(this).data('text');
      const title = $(this).data('title');
      const display = $(this).css('display');
      formData.value[text] = {};
      formData.value[text].title = title;
      formData.value[text].text = $(this).text();
      formData.value[text].display = display === 'none' ? false : true;
      if (display !== 'none') {
        footColSpan.value++;
      }
    });
  };
  defineExpose({ init });
  //   修改表头
  //   const handleChangeTitle = (key, curVal) => {
  //     const thDoms = $(curComponent.value.dom).find('table thead th');
  //     thDoms.each(function () {
  //       const text = $(this).data('text');
  //       if (key === text) {
  //         $(this).text(curVal);
  //       }
  //     });
  //   };

  const handleShowField = (key, curVal) => {
    // 主表格
    showFiled($(curComponent.value.dom), key, curVal, true);
    // 第二页表格
    const secondTableDom = $('.table_content_second_container').find(
      '.dropitem'
    );
    if (secondTableDom.length) {
      showFiled(secondTableDom, key, curVal, false);
    }
  };
  const showFiled = ($dom, key, curVal, usefulFoot = true) => {
    const thDoms = $dom.find('table thead th');
    thDoms.each(function () {
      const _text = $(this).data('text');
      if (_text === key) {
        $(this).css('display', curVal ? '' : 'none');
      }
    });
    const tdDoms = $dom.find('table tbody td');
    tdDoms.each(function () {
      const _text = $(this).data('text');
      if (_text === key) {
        $(this).css('display', curVal ? '' : 'none');
      }
    });
    if (usefulFoot) {
      if (curVal) {
        footColSpan.value = footColSpan.value + 1;
      } else {
        footColSpan.value = footColSpan.value - 1;
      }
      const tfootDom = $dom.find('table tfoot');
      tfootDom.find('td').attr('colspan', footColSpan.value);
    }
  };
  const handleReset = () => {
    // 主表格
    resetTable($(curComponent.value.dom));
    // 第二页表格
    const secondTableDom = $('.table_content_second_container').find(
      '.dropitem'
    );
    if (secondTableDom.length) {
      resetTable(secondTableDom, false);
    }
  };
  const resetTable = ($dom, usefulFoot = true) => {
    const thDoms = $dom.find('table thead th');
    footColSpan.value = thDoms.length;
    thDoms.each(function () {
      const text = $(this).data('text');
      $(this).css('display', '');
      formData.value[text].display = true;
    });
    const tdDoms = $dom.find('table tbody td');
    tdDoms.each(function () {
      $(this).css('display', '');
    });
    if (usefulFoot) {
      const tfootDom = $dom.find('table tfoot');
      tfootDom.find('td').attr('colspan', footColSpan.value);
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
