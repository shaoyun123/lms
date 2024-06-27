<template>
  <div v-loading="initLoading" class="app-container editor_wrapper">
    <!-- <DndProvider :backend="HTML5Backend"> -->
    <div class="header">
      <div class="header_tpl_info">
        <span>模板名称：{{ tpl.templateName }}</span>
        <span>模板类型：{{ getTemplateType(tpl.templateType) }}</span>
        <span>模板规格：{{ tpl.width }}mm x {{ tpl.height }}mm</span>
      </div>
      <!-- 文字提示 -->
      <div v-if="showShortKeyNote" class="header_note">
        <div>
          <span>
            快捷键支持：拷贝(⌘C / Ctrl+C), 粘贴(⌘V / Ctrl+V), 取消选中(ESC),
          </span>
          <br />
          <span>
            上下左右移动一像素(↑ ↓ → ←), 上下左右移动十像素(Shift + ↑ ↓ → ←)
          </span>
        </div>
        <el-icon
          class="ml10"
          :size="20"
          color="#409EFF"
          @click="handleCloseShortKeyNote"
          ><CircleClose
        /></el-icon>
      </div>
      <div>
        <el-button type="primary" @click="handlePreviewPrint"
          >打印预览</el-button
        >
        <el-popconfirm
          title="确定清空模板吗?"
          :width="180"
          @confirm="handleClearAllTpl"
        >
          <template #reference>
            <el-button type="danger">清空模板</el-button>
          </template>
        </el-popconfirm>
        <el-button type="success" @click="handleSaveTpl(false)"
          >保存模板</el-button
        >
        <el-button type="success" @click="handleSaveTpl(true)"
          >保存并关闭</el-button
        >
      </div>
    </div>
    <el-divider />
    <div class="main">
      <LeftMenu
        class="left"
        :menu-list="menuList"
        :tpl="tpl"
        :loading="typeListLoading"
      />
      <div
        id="sheetEditorMiddle"
        class="middle"
        :style="sheetEditorMiddleStyle"
      >
        <div
          ref="contentRef"
          class="content"
          :style="{
            height: tpl.height + 2 + 'mm',
            width: tpl.width + 2 + 'mm',
            zoom: realZoomVal
          }"
        >
          <Editor
            :style="{
              margin: '1mm',
              position: 'relative',
              height: tpl.height + 'mm',
              width: tpl.width + 'mm'
            }"
            @table-dom="setTableDom"
          />
        </div>

        <div
          v-if="tableDomData.trim().length > 0"
          ref="contentTableRef"
          class="table_content_second_container"
          :style="{
            height: tpl.height + 2 + 'mm',
            width: tpl.width + 2 + 'mm',
            top: secondTableTop
          }"
        >
          <div
            :style="{
              margin: '1mm',
              position: 'relative',
              height: tpl.height + 'mm',
              width: tpl.width + 'mm'
            }"
            class="table_content_second"
            v-html="tableDomData"
          ></div>
        </div>
        <div class="scale_warpper">
          <div class="scale_warpper_slider">
            <el-slider
              v-model="zoomValue"
              :min="100"
              :max="300"
              :step="25"
              :format-tooltip="formatZoomTips"
            />
          </div>
          <div class="scale_warpper_btn">
            <el-button-group>
              <el-button
                :icon="Minus"
                size="default"
                :disabled="zoomValue === 100"
                @click="handleDecrese"
              />
              <el-button
                :icon="Plus"
                size="default"
                :disabled="zoomValue === 300"
                @click="handleIncrese"
              />
            </el-button-group>
          </div>
        </div>
        <LabelSet
          :class="['middle_right', curComponent?.id ? 'middle_right_set' : '']"
          @table-dom="setTableDom"
        />
      </div>
    </div>
    <!-- </DndProvider> -->
  </div>
</template>

<script setup>
  // /* eslint-disable */
  import { onMounted, onUnmounted, ref, provide, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  import LeftMenu from './components/LeftMenu.vue';
  import Editor from './components/Editor.vue';
  import LabelSet from './components/LabelSet.vue';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import {
    getTplInfoApi,
    getTplTypeApi,
    saveTplApi,
    getTemplateTypeApi
  } from '@/api/order/printtemplate';
  import { ElMessage } from 'element-plus';
  import { setItem } from '@/utils/storage';
  import useEditorDom from '@/hooks/useEditorDom';
  import { initHotKeys } from './components/hotkeys';
  import { CircleClose, Minus, Plus } from '@element-plus/icons-vue';
  import css from '@/styles/sheetEditor.css?inline';
  import { max } from 'mathjs';

  const {
    handleClearTpl,
    removeActive,
    setEditorHtml,
    findLastDropItem,
    appendEditorHtml,
    mousedownEditor,
    clickEditor,
    resizeElement,
    deleteActive,
    getEditorHtml,
    setBarCodeImgHeight,
    resizeColumn
  } = useEditorDom();

  provide('removeActive', removeActive);
  provide('findLastDropItem', findLastDropItem);
  provide('appendEditorHtml', appendEditorHtml);
  provide('mousedownEditor', mousedownEditor);
  provide('clickEditor', clickEditor);
  provide('resizeElement', resizeElement);
  provide('deleteActive', deleteActive);
  provide('setBarCodeImgHeight', setBarCodeImgHeight);
  provide('resizeColumn', resizeColumn);

  const initLoading = ref(false);

  const store = sheetEditorStore();
  const { curComponent, zoomValue, realZoomVal } = storeToRefs(store);
  const { handleDecrese, handleIncrese } = store;

  const tpl = ref({});
  const menuList = ref([]);
  const templateTypeList = ref([]);

  // const router = useRouter();
  const route = useRoute();
  onMounted(async () => {
    const { templateType, id } = route.query;
    initLoading.value = false;
    const rx = /<body[^>]*>([\s\S]+?)<\/body>/i;
    let tableHtml = ''; // 第二页table的html
    Promise.all([
      getTplInfoApi(id),
      getTplTypeApi(templateType),
      getTemplateTypeApi()
    ])
      .then(async (res) => {
        tpl.value = res[0].data;
        menuList.value = res[1].data;
        templateTypeList.value = res[2].data;
        // let tableHtml = '';
        if (res[0]?.data?.templateHtml) {
          let bodyHtmlStr = rx.exec(res[0].data.templateHtml)[1];
          let newHtml = document.createElement('div');
          newHtml.innerHTML = bodyHtmlStr;
          setEditorHtml(newHtml.querySelectorAll('#editor')[0].innerHTML);
          // 赋值
          tableHtml = newHtml.querySelectorAll('.table_content_second')[0]
            .innerHTML;
        }
        initLoading.value = false;
      })
      .catch(() => {
        initLoading.value = false;
      })
      .finally(() => {
        setStyleCenter('sheetEditorMiddle');
        //  是否存在第二页
        if (tableHtml) {
          setTableDom(tableHtml);
        }
      });
  });

  const getTemplateType = (templateType) => {
    return templateTypeList.value.filter(
      (item) => item.code === templateType
    )[0]?.cnName;
  };

  const sheetEditorMiddleStyle = ref({});
  const setStyleCenter = (id) => {
    const middleContainer = document.getElementById(id);
    let styleObj = {};
    if (middleContainer) {
      const { width: parentWidth, height: parentHeight } =
        middleContainer.getBoundingClientRect();
      const { width: sonWidth, height: sonHeight } =
        middleContainer.children[0].getBoundingClientRect();
      if (parentWidth > sonWidth) {
        styleObj.justifyContent = 'center';
      }
      if (parentHeight > sonHeight) {
        styleObj.alignItems = 'center';
      }
    }
    sheetEditorMiddleStyle.value = styleObj;
  };

  const contentTableRef = ref(null);
  //   #region 操作
  const getWholeHtml = () => {
    let htmlSize = `@page { size: ${tpl.value.width}mm ${tpl.value.height}mm; margin: 0,0,0,0; }`;
    const preHtml = `<html><head><meta charset="UTF-8" /><style type="text/css">${htmlSize}${css}</style></head><body>`;
    const lastHtml = '</body></html>';

    const bodyHtml = contentRef.value.innerHTML.replace('margin: 1mm;', '');
    const body2Html = contentTableRef.value
      ? contentTableRef.value.innerHTML.replace('margin: 1mm;', '')
      : '';
    const templateHtml = preHtml + bodyHtml + body2Html + lastHtml;
    return templateHtml;
  };
  const handlePreviewPrint = () => {
    // 如果为空，不预览
    const contentHtml = getEditorHtml();
    if (!contentHtml) {
      return ElMessage.warning('请先编辑面单');
    }
    const bodyHtml = getWholeHtml();
    setItem('bodyHtml', bodyHtml);
    var newWin = window.open('', '_blank');
    newWin.document.write(localStorage.getItem('bodyHtml'));
  };

  const contentRef = ref();
  const handleSaveTpl = async (isClose) => {
    removeActive();
    try {
      const templateHtml = getWholeHtml();
      const { msg } = await saveTplApi({ id: tpl.value.id, templateHtml });
      ElMessage.success(msg);
      isClose && window.close();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  // 清空模板
  const handleClearAllTpl = () => {
    handleClearTpl();
    // 清空第二页
    setTableDom();
  };
  //   #endregion 操作

  const formatZoomTips = (value) => {
    return `缩放${value}%`;
  };

  onUnmounted(() => {
    // console.log('444 :>> ', 444);
  });

  //#region 设置换行table-ztt20230810
  const tableDomData = ref('');
  const isExistTwoPageTable = ref(false);
  const secondTableTop = ref();
  provide('isExistTwoPageTable', isExistTwoPageTable);
  const setTableDom = (data, updateButtom = true) => {
    //编辑data,切割<tfoot>标签后的所有内容
    if (data) {
      if (updateButtom) {
        nextTick(() => {
          // 通过上一页表格的bottom，来得到第二页表格的top；（不知道css怎么弄，所以用js）
          const { bottom, height } = document
            .getElementById('editor')
            .getBoundingClientRect();
          secondTableTop.value = max(bottom, height) + 20 + 'px';
        });
      }
      let dataArr = data.split('<!--脚注-->');
      let newData = dataArr[0] + '</table></div>';
      tableDomData.value = newData
        .replace('data-line-end="2"', '')
        .replace('data-line-start="0"', 'data-line-start="3"');
      isExistTwoPageTable.value = true;
    } else {
      tableDomData.value = '';
      isExistTwoPageTable.value = false;
    }
  };
  // #endregion table分页

  // #region  快捷键
  initHotKeys();
  // 是否显示快捷键注释文字
  const showShortKeyNote = ref(true);
  // 关闭快捷键注释文字
  const handleCloseShortKeyNote = () => {
    showShortKeyNote.value = false;
  };
  // #endregion

  // #region 更新
  const typeListLoading = ref(false);
  const updateTypeList = async () => {
    typeListLoading.value = true;
    const { templateType } = route.query;
    const { data } = await getTplTypeApi(templateType);
    menuList.value = data;
    typeListLoading.value = false;
  };
  provide('updateTypeList', updateTypeList);
  // #endregion 更新
</script>

<style lang="scss" scoped>
  .editor_wrapper {
    height: 100%;

    .header {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #606266;
      .header_tpl_info {
        font-size: 13px;
        span + span {
          margin-left: 20px;
        }
      }
      .header_note {
        display: flex;
        align-items: center;
      }
    }
    :deep(.el-divider--horizontal) {
      margin: 10px 0;
    }
    .main {
      height: calc(100vh - 90px);
      display: flex;

      .left {
        width: 200px;
        flex: none;
      }
      .middle {
        flex: 1;
        // background: rgb(248 246 246);
        background: url(https://global.mabangerp.com/image/grid_bg_gray.png)
          rgb(58, 65, 68);
        position: relative;
        border: 20px solid transparent;
        overflow: auto;
        display: flex;
        // justify-content: center;
        // align-items: center;
        border-radius: 10px;
        .content {
          position: absolute;
          // left: 50%;
          // top: 50%;
          // transform: translate(-50%, -50%);
          background: #fff;
          border-radius: 10px;
        }
        .scale_warpper {
          position: fixed;
          right: 300px;
          bottom: 100px;
          display: flex;
          align-items: center;
          z-index: 3000;
          &_slider {
            flex: none;
            width: 200px;
          }
          &_btn {
            margin-left: 15px;
          }
        }
        .middle_right {
          width: 0px;
          background: #fff;
          // height: 100%;
          position: fixed;
          z-index: 9;
          right: 0;
          top: 60px;
          bottom: 20px;
          box-shadow: 0 0 2px 2px #888888;
          // transition: all 5s;
        }
        .middle_right.middle_right_set {
          width: 250px;
          // transition: all 5s;
        }
      }
      .table_content_second_container {
        position: absolute;
        border-radius: 10px;
        // left: 45%;
        // top: 62%;
        background-color: #fff;
      }
    }
    .flutter {
      position: absolute;
      z-index: 999;
      pointer-events: none;
    }
    .ml10 {
      margin-left: 10px;
    }
  }
</style>
