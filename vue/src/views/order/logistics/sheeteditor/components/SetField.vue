<template>
  <el-form label-width="20px">
    <el-form>
      <template v-for="(filed, index) in filedList" :key="filed.text">
        <el-form-item label-width="20">
          <el-checkbox
            v-model="filed.checked"
            @change="change($event, filed, index)"
          >
            显示{{ filed.title }}
          </el-checkbox>
        </el-form-item>
        <template v-if="filed.children.length">
          <el-form-item
            v-for="sonFiled in filed.children"
            :key="sonFiled.text"
            label-width="40"
          >
            <el-checkbox
              v-model="sonFiled.checked"
              @change="changeSonFiled($event, sonFiled, index)"
            >
              显示{{ sonFiled.title }}
            </el-checkbox></el-form-item
          >
        </template>
      </template>
    </el-form>
    <div>
      <div class="field_title">字段换行设置:</div>
      <el-form-item>
        <el-checkbox v-model="wrapVal" @change="changeWrap">
          单字段换行
        </el-checkbox>
      </el-form-item>
    </div>
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

  const filedList = ref({});
  // 字段换行设置
  const wrapVal = ref(false);
  const changeWrap = (val) => {
    let detailDom = $(curComponent.value.dom).find('.detail');
    if (val) {
      detailDom.addClass('block');
    } else {
      detailDom.removeClass('block');
    }
  };

  const init = () => {
    let temp = [];
    const detailDom = $(curComponent.value.dom).find('.detail');
    wrapVal.value = detailDom.hasClass('block');
    detailDom.children().each(function () {
      const that = this;
      let spanChildren = $(that).find('span');
      let sonTemp = {
        children: [],
        title: $(that).data('title'),
        text: $(that).data('text'),
        checked: $(that).css('display') !== 'none'
      };
      if (spanChildren.length) {
        spanChildren.each(function () {
          if ($(this).data('title')) {
            sonTemp.children.push({
              title: $(this).data('title'),
              text: $(this).data('text'),
              checked: $(this).css('display') !== 'none'
            });
          }
        });
      }
      if (sonTemp.title) {
        temp.push(sonTemp);
      }
    });

    filedList.value = temp;
  };
  defineExpose({ init });

  // 字段显示隐藏
  const changeDom = (val, filed) => {
    const detailDom = $(curComponent.value.dom).find('.detail');
    detailDom
      .find(`span[data-text=${filed.text}]`)
      .css('display', val ? '' : 'none');
  };

  const change = (val, filed, index) => {
    changeDom(val, filed);
    // 改变子
    if (filedList.value[index]?.children.length) {
      for (let sonIndex in filedList.value[index]?.children) {
        let sonItem = filedList.value[index]?.children[sonIndex];
        changeDom(val, sonItem);
        sonItem.checked = val;
      }
    }
  };

  const changeSonFiled = (val, filed, index) => {
    changeDom(val, filed);
    // 改变父数据
    if (val) {
      changeDom(true, filedList.value[index]);
      filedList.value[index].checked = true;
    } else {
      if (filedList.value[index]?.children?.length) {
        const isAllunChecked = !filedList.value[index].children.some(
          (item) => item.checked
        );
        if (isAllunChecked) {
          changeDom(false, filedList.value[index]);
          filedList.value[index].checked = false;
        }
      }
    }
  };

  const handleReset = () => {
    let temp = [];
    const detailDom = $(curComponent.value.dom).find('.detail');
    wrapVal.value = detailDom.removeClass('block');
    wrapVal.value = false;
    detailDom.children().each(function () {
      const that = this;
      let spanChildren = $(that).find('span');
      let sonTemp = {
        children: [],
        title: $(that).data('title'),
        text: $(that).data('text'),
        checked: true
      };
      $(that).css('display', '');
      if (spanChildren.length) {
        spanChildren.each(function () {
          if ($(this).data('title')) {
            sonTemp.children.push({
              title: $(this).data('title'),
              text: $(this).data('text'),
              checked: true
            });
            $(this).css('display', '');
          }
        });
      }
      if (sonTemp.title) {
        temp.push(sonTemp);
      }
    });

    filedList.value = temp;
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
