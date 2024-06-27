<template>
  <el-dialog
    v-model="dialogVisible"
    title="批量修改商品类目"
    width="1000"
    :align-center="true"
    :close-on-click-modal="false"
  >
    <div class="note_wrapper">
      <div>
        <el-text
          >！注：修改对象为全球商品类目，若存在一个全球商品刊登至多店铺商品，则将同步修改</el-text
        >
      </div>
      <!-- <div>
        <el-text type="danger">
          平台推荐类目接口返回数据目前存在大量不准确情况，请注意辨别！</el-text
        >
      </div> -->
    </div>
    <el-card class="card_position list_card common_split_bottom">
      <div class="page_header">
        <el-tabs
          v-model="activeKey"
          type="card"
          class="demo-tabs"
          @tab-click="handleTab"
        >
          <el-tab-pane :label="`数量(${total})`" name="total"> </el-tab-pane>
        </el-tabs>
        <div class="batch_btns">
          <div>
            <el-cascader
              ref="cascaderBatchRef"
              v-model="batchCateId"
              :options="cateList"
              separator=">>"
              filterable
              clearable
              :props="{
                label: 'cnName',
                value: 'categoryId',
                emitPath: false
              }"
            ></el-cascader>
            <el-button type="primary" class="ml10" @click="handleBacthApply"
              >一键应用</el-button
            >
          </div>
          <el-button
            type="primary"
            :loading="updateLoading"
            @click="handleUpdate"
            >批量修改</el-button
          >
        </div>
      </div>
      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <template #default_recommendCategoryId="{ row }">
          <el-cascader
            :ref="cascaderRefObj[`cascader_${row.productId}`]"
            v-model="row.recommendCategoryId"
            :options="row.cateList"
            separator=">>"
            filterable
            :props="{
              label: 'cnName',
              value: 'categoryId',
              emitPath: false
            }"
            @change="handleChangeCate(row)"
          ></el-cascader>
        </template>
        <template #default_complete="{ row }">
          <template
            v-if="
              row.recommendCategoryId &&
              ![null, undefined].includes(row.complete)
            "
          >
            <div v-if="row.complete">完整</div>
            <div v-else class="complete_cell">
              <span
                class="danger_color"
                @click="handleJumpExtraInfo(row.attributeNames)"
              >
                ！需维护必填项
              </span>
              <el-icon
                :size="20"
                :color="primaryColor"
                class="ml10"
                @click="handleFreshComplete(row)"
                ><Refresh
              /></el-icon>
            </div>
          </template>
        </template>
      </vxe-grid>
    </el-card>
  </el-dialog>
</template>

<script setup>
  import { computed, onMounted, reactive, ref, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    queryUpdateCategoryApi,
    checkCategoryCompleteApi,
    batchUpdateCategoryApi
  } from '@/api/publishs/tiktokonlineproduct';
  import { getPlatCategoryTreeApi } from '@/api/common';
  import { Refresh } from '@element-plus/icons-vue';
  import { primaryColor } from '@/styles/vars.module.scss';
  import { setItem } from '@/utils/storage';
  // import { cloneDeep } from 'lodash-es';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'showTaskCenter'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const cascaderRefObj = {};
  const cateList = ref([]);
  onMounted(async () => {
    const idList = props.rowCheckedList.map((item) => item.productId);
    const { data: tiktokList } = await getPlatCategoryTreeApi('tiktok');
    const { data, count } = await queryUpdateCategoryApi(idList);
    cateList.value = tiktokList;
    gridOptions.data = data.map((item) => ({
      ...item,
      cateList: tiktokList,
      isClicked: false,
      cascader: {
        ref: ref(null)
      }
    }));
    total.value = count;
    data.forEach((v) => {
      cascaderRefObj['cascader_' + v.productId] = ref();
    });
  });

  // const delOneLeaf = (cateList, categoryId) => {
  //   const arr = [];
  //   cloneDeep(cateList).forEach((element) => {
  //     if (element.categoryId !== categoryId) {
  //       let _arr = element;
  //       if (element.children?.length) {
  //         _arr.children = delOneLeaf(element.children, categoryId);
  //       }
  //       arr.push(_arr);
  //     }
  //   });
  //   return arr;
  // };

  const total = ref(0);
  const activeKey = ref('total');
  const handleTab = () => {};

  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height: 500,
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'productId',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    scrollY: { enabled: false },
    columns: [
      {
        type: 'checkbox',
        width: 40
      },
      {
        title: 'product_id',
        field: 'productId'
      },
      {
        title: '店铺名称',
        field: 'storeAcct',
        width: 150
      },
      {
        title: '原平台类目',
        field: 'nowCategoryTree'
      },
      {
        title: '修改类目',
        field: 'recommendCategoryId',
        slots: {
          default: 'default_recommendCategoryId'
        }
      },
      {
        title: '商品属性(取值自类目必填项)',
        field: 'complete',
        slots: { default: 'default_complete' }
      }
    ],
    data: [],
    toolbarConfig: {
      custom: true
    }
  });

  const router = useRouter();
  const handleJumpExtraInfo = async (attributeNames) => {
    await setItem('publishstiktokonlineupdatecate', attributeNames);
    router.push({ name: 'publishstiktokextrainfo' });
  };
  // const handleGetCateList = async (isVisible, row) => {
  //   if (isVisible && !row.isClicked) {
  //     const params = row;
  //     delete params.cateList;
  //     delete params.isClicked;

  //     let arr = cateList.value;
  //     try {
  //       const { data } = await getRecommendCategoryApi(params);
  //       arr = delOneLeaf(cateList.value, data.recommendCategoryId);
  //       //建议类目放在下拉框内第一个选项
  //       arr.unshift({
  //         categoryId: data.recommendCategoryId,
  //         children: [],
  //         cnName: data.recommendCategoryTreeName
  //       });
  //       //填充建议类目
  //       if (!row.recommendCategoryId) {
  //         row.recommendCategoryId = data.recommendCategoryId;
  //         row.recommendCategoryTreeName = data.recommendCategoryTreeName;
  //       }
  //       // 商品属性
  //       row.complete = data.complete;
  //     } catch (err) {
  //       console.log('err :>> ', err);
  //     }
  //     //  不管成功与否，当二次点击时，不用掉接口
  //     row.isClicked = true;
  //     row.cateList = arr;
  //   }
  // };
  //   选中类目后，需判断其商品属性是否完整
  const handleChangeCate = async (row) => {
    const curCascaderRef = cascaderRefObj['cascader_' + row.productId];
    const checkedNodes = curCascaderRef.value.getCheckedNodes();
    // 推荐的类目树名称
    row.recommendCategoryTreeName = checkedNodes[0].text;

    const { data } = await checkCategoryCompleteApi(row.recommendCategoryId);
    if (data.length) {
      row.attributeNames = data.join();
      row.complete = false;
    } else {
      row.complete = true;
    }
  };

  const handleFreshComplete = async (row) => {
    const { data } = await checkCategoryCompleteApi(row.recommendCategoryId);
    if (data.length) {
      row.attributeNames = data.join();
      row.complete = false;
    } else {
      row.complete = true;
    }
  };

  const updateLoading = ref(false);
  let isExistUpdate = false;
  const handleUpdate = async () => {
    // 获取选中数据
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择需修改商品类目');
    }
    // 校验选中商品商品属性均完整
    const isAllComplete = checkedList.every((v) => v.complete);
    if (!isAllComplete) {
      return ElMessage.warning('请维护对应商品属性');
    }
    // 掉接口
    updateLoading.value = true;
    try {
      const { msg } = await batchUpdateCategoryApi(checkedList);
      updateLoading.value = false;
      isExistUpdate = true;
      ElMessage.success(msg);
    } catch (err) {
      updateLoading.value = false;
    }
  };

  onUnmounted(() => {
    if (isExistUpdate) {
      emits('showTaskCenter', {
        title: '修改类目结果',
        content: '修改成功！请到任务中心查看导入结果'
      });
    }
  });

  // #region 一键应用
  const cascaderBatchRef = ref();
  const batchCateId = ref(null);
  const handleBacthApply = async () => {
    if (!batchCateId.value) {
      return ElMessage.warning('请选择一键应用的类目');
    }
    // 获取选中数据
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据');
    }
    const { data } = await checkCategoryCompleteApi(batchCateId.value);
    let attributeNames = null;
    let complete = true;
    if (data.length) {
      attributeNames = data.join();
      complete = false;
    }
    // 推荐的类目树名称
    const recommendCategoryTreeName =
      cascaderBatchRef.value.getCheckedNodes()[0].text;
    // 更改数据
    checkedList.forEach((v) => {
      v.recommendCategoryTreeName = recommendCategoryTreeName;
      v.recommendCategoryId = batchCateId.value;
      v.attributeNames = attributeNames;
      v.complete = complete;
    });
  };
  // #endregion 一键应用
</script>

<style lang="scss" scoped>
  .danger_color {
    color: var(--danger-color);
  }
  .complete_cell {
    display: flex;
    align-items: center;
  }
  .ml10 {
    margin-left: 10px;
  }
  .page_header {
    position: absolute;
    z-index: 9;
    width: calc(100% - 70px);
  }

  :deep(.vxe-toolbar) {
    padding: 0 0 5px 0;
  }
  .batch_btns {
    position: absolute;
    top: 3px;
    right: 10px;
    width: 60%;
    display: flex;
    justify-content: space-between;
    :deep(.el-cascader) {
      width: 300px;
    }
  }
  :deep(.el-tabs--card) {
    .el-tabs__header {
      border-bottom: none;
    }
  }
  .note_wrapper {
    font-size: 13px;
  }
  :deep(.vxe-body--column .el-cascader) {
    width: 100%;
  }
  :deep(.vxe-header--column.col--ellipsis > .vxe-cell .vxe-cell--title) {
    white-space: normal;
  }
  :deep(
      .vxe-table--render-default.size--mini
        .vxe-header--column.col--ellipsis
        > .vxe-cell
    ) {
    max-height: 48px;
  }
</style>
