<template>
  <div v-if="!isEmpty(curComponent)">
    <div class="title">
      {{ curComponent.title }}
    </div>
    <div class="set_wrapper">
      <template v-if="curComponent.type === 'single-text'">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="标题" name="first">
            <SetTitle
              ref="setTitleRef"
              @del="handleDel"
              @change-font-size="changeFontSize"
            />
          </el-tab-pane>
          <el-tab-pane label="内容" name="second">
            <SetTitleStyle
              ref="setTitleStyleRef"
              @del="handleDel"
              @change-font-size="changeFontSize"
            />
          </el-tab-pane>

          <!-- <el-tab-pane label="边框" name="third">
            <SetBorder />
          </el-tab-pane> -->
        </el-tabs>
      </template>
      <template v-if="curComponent.type === 'multiple-text'">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="字段" name="first">
            <SetField ref="setFieldRef" @del="handleDel" />
          </el-tab-pane>
          <el-tab-pane label="内容" name="second">
            <SetStyle
              ref="setStyleRef"
              @del="handleDel"
              @change-font-size="changeFontSize"
            />
          </el-tab-pane>

          <!-- <el-tab-pane label="边框" name="third">
            <SetBorder />
          </el-tab-pane> -->
        </el-tabs>
      </template>
      <template v-if="['barcode', 'qrcode'].includes(curComponent.type)">
        <SetBarCode
          ref="setBarCodeRef"
          @del="handleDel"
          @change-font-size="changeFontSize"
        />
      </template>
      <template v-if="curComponent.type === 'table'">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="字段" name="first">
            <SetTableField ref="setTableFieldRef" @del="handleDel" />
          </el-tab-pane>
          <el-tab-pane label="表格" name="second">
            <SetTableStyle
              ref="setTableStyleRef"
              @del="handleDel"
              @change-font-size="changeFontSize"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
      <template v-if="curComponent.type === 'custom-img'">
        <el-tabs v-model="activeName" class="demo-tabs">
          <!-- <el-tab-pane label="图片" name="first"> -->
          <SetImage
            ref="setImageRef"
            @del="handleDel"
            @handle-add-pre-img="handleAddPreImg"
          />
          <!-- </el-tab-pane> -->
          <!-- <el-tab-pane label="边框" name="second">
            <SetBorder />
          </el-tab-pane> -->
        </el-tabs>
      </template>
      <template v-if="['circular', 'square'].includes(curComponent.type)">
        <SetStyle
          ref="setStyleRef"
          :show-copy-btn="true"
          @del="handleDel"
          @copy="handleCopy"
          @change-font-size="changeFontSize"
        />
      </template>
      <template v-if="['x-line', 'y-line'].includes(curComponent.type)">
        <SetLine
          ref="setLineRef"
          :show-copy-btn="true"
          @del="handleDel"
          @copy="handleCopy"
        />
      </template>
      <template v-if="['custom-text'].includes(curComponent.type)">
        <SetStyle
          ref="setStyleRef"
          :show-copy-btn="true"
          @del="handleDel"
          @copy="handleCopy"
          @change-font-size="changeFontSize"
        />
      </template>
      <template v-if="['custom-title-text'].includes(curComponent.type)">
        <SetCustomTitleText
          ref="setCustomTitleTextRef"
          :show-copy-btn="true"
          @del="handleDel"
          @copy="handleCopy"
          @change-font-size="changeFontSize"
        />
      </template>
      <template v-if="['pre-img'].includes(curComponent.type)">
        <SetImage
          ref="setPresetImgRef"
          :show-copy-btn="true"
          @del="handleDel"
          @copy="handleCopy"
        />
      </template>

      <!-- <div class="label_set_btns">
        <el-button type="success" @click="handleCopy">复制</el-button>
        <el-button type="success" @click="handleReset">重置</el-button>
        <el-button type="danger" @click="handleDel">删除</el-button>
      </div> -->
    </div>
  </div>
</template>

<script setup>
  import { nextTick, onMounted, ref, watch, inject } from 'vue';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import { isEmpty, throttle } from 'lodash-es';
  import SetTitle from './SetTitle.vue';
  import SetTitleStyle from './SetTitleStyle.vue';
  import SetStyle from './SetStyle.vue';
  // import SetBorder from './SetBorder.vue';
  import SetField from './SetField.vue';
  import SetBarCode from './SetBarCode.vue';
  import SetTableField from './SetTableField.vue';
  import SetTableStyle from './SetTableStyle.vue';
  import SetImage from './SetImage.vue';
  import SetLine from './SetLine.vue';
  import SetCustomTitleText from './SetCustomTitleText.vue';
  import { ElMessage } from 'element-plus';
  import { positionHtmlObj } from './constant';
  import { addPreImg } from '@/api/order/printtemplate';

  const store = sheetEditorStore();
  const { curComponent } = storeToRefs(store);
  const { setComponent, copyComponent, pasteCopiedComponent } = store;

  const activeName = ref('first');
  onMounted(() => {
    activeName.value = 'first';
  });
  const setStyleRef = ref();
  const setTitleRef = ref();
  const setTitleStyleRef = ref();
  const setFieldRef = ref();
  const setBarCodeRef = ref();
  const setTableFieldRef = ref();
  const setTableStyleRef = ref();
  const setLineRef = ref();
  const setImageRef = ref();
  const setCustomTitleTextRef = ref();
  const setPresetImgRef = ref();
  watch(
    () => curComponent.value,
    (val) => {
      activeName.value = 'first';
      nextTick(() => {
        if (val) {
          const { type } = val;
          if (type === 'multiple-text') {
            setStyleRef.value.init();
            setFieldRef.value.init();
          } else if (type === 'single-text') {
            setTitleStyleRef.value.init();
            setTitleRef.value.init();
          } else if (type === 'custom-text') {
            setStyleRef.value.init();
          } else if (['barcode', 'qrcode'].includes(type)) {
            setBarCodeRef.value.init();
          } else if (type === 'table') {
            setTableFieldRef.value.init();
            setTableStyleRef.value.init();
          } else if (['x-line', 'y-line'].includes(type)) {
            setLineRef.value.init();
          } else if (type === 'custom-img') {
            setImageRef.value.init();
          } else if (['circular', 'square'].includes(type)) {
            setStyleRef.value.init();
          } else if (type === 'custom-title-text') {
            setCustomTitleTextRef.value.init();
          } else if (type === 'pre-img') {
            setPresetImgRef.value.init();
          }
        }
      });
    },
    { immediate: true }
  );

  const changeFontSize = ({ val, textAlign, curDom, parentDom }) => {
    // 小于12px 设置缩放  transform-origin也需要设置
    const key = 'fontSize';
    const intVal = parseInt(val);
    if (intVal < 12) {
      textAlign += ' top';
      curDom
        .css('transform', `scale(${intVal / 12})`)
        .css('transform-origin', textAlign);
      parentDom.css(key, '12px');
    } else {
      curDom.css('transform', '').css('transform-origin', '');
      parentDom.css(key, val);
    }
  };

  const deleteActive = inject('deleteActive');
  const emits = defineEmits(['tableDom']);
  const handleDel = () => {
    // 如果table的two-page="true"，删除表格时，也需要删除第二页
    const { dom, type } = curComponent.value;
    if (type === 'table') {
      const twoPage = dom.attr('two-page');
      if (twoPage === 'true') {
        emits('tableDom');
      }
    }
    setComponent();
    deleteActive();
  };
  const handleCopy = () => {
    copyComponent(curComponent.value.dom);
    pasteCopiedComponent();
    ElMessage.success('已复制当前组件');
  };

  const updateTypeList = inject('updateTypeList');
  const handleAddPreImg = throttle(async () => {
    const preSetImgHtml = curComponent.value.dom[0].outerHTML;
    const itemHtml = preSetImgHtml
      .replace('custom-img', 'pre-img')
      .replace('dropitem active', 'dropitem')
      .replace('自定义图片', '预设图片')
      .replace(positionHtmlObj[curComponent.value.type], '');
    const { msg } = await addPreImg({ templateTypes: 'EU_APTITUDE', itemHtml });
    ElMessage.success(msg);
    setTimeout(() => {
      updateTypeList();
    }, 500);
  }, 1000);
</script>

<style lang="scss" scoped>
  .title {
    color: #606266;
    font-size: 14px;
    font-weight: 600;
    height: 40px;
    line-height: 40px;
    padding-left: 45px;
    background-color: #f6f6f6;
    border-color: #cfd9db;
  }
  .set_wrapper {
    padding: 10px;
  }
  .label_set_btns {
    text-align: center;
    margin-top: 10px;
  }

  .field_title {
    display: inline-block;
    font-weight: 600;
    color: #6f6f6f;
    padding-left: 8px;
    margin-bottom: 5px;
  }
  :deep(.el-checkbox__label) {
    display: block;
    margin-bottom: 2px;
    font-weight: 600;
    cursor: pointer;
  }
  :deep(.el-tabs__content) {
    min-height: 300px; // 避免el-popconfirm 不展示
  }
</style>
