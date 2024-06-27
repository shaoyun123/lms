<template>
  <div class="store_dialog_wrapper">
    <el-dialog
      v-model="dialogVisible"
      title="设置店铺"
      :width="1200"
      :close-on-click-modal="false"
      :align-center="true"
      :destroy-on-close="false"
    >
      <el-card v-loading="tableLoading">
        <template #header>
          <div class="card-header">
            <div>
              刊登规则：{{ checkedRow.ruleName }}
              <span class="ml10">总数：{{ totalCount }}</span>
            </div>
            <div>
              <span class="publish-num-label">每日刊登量</span>
              <el-input-number
                v-model="batchPublishNums"
                :precision="0"
                :step="1"
                :min="1"
              />
              <span class="publish-num-label ml10">上架开始时间</span>
              <el-select v-model="batchPublishTime" filterable clearable>
                <el-option
                  v-for="item in PublishTimeList"
                  :key="item"
                  :value="item"
                  :label="item + '点'"
                />
              </el-select>
              <span class="publish-num-label ml10">上架间隔时间</span>
              <el-select v-model="batchPublishInterval" filterable clearable>
                <el-option
                  v-for="item in PublishIntervalList"
                  :key="item"
                  :value="item"
                  :label="item + '分钟'"
                />
              </el-select>

              <el-button type="primary" @click="handleApplyPublishNums"
                >一键应用</el-button
              >
            </div>
            <div class="disflex">
              <el-button
                type="primary"
                @click="
                  handleOpenPublishStoreInfo(
                    { publishInterval: 1, publishTime: 1, stock: 9999 },
                    'add'
                  )
                "
                >添加店铺</el-button
              >
              <el-popconfirm
                title="确定要删除此店铺吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleBatchRemove(row)"
              >
                <template #reference>
                  <div>
                    <el-button
                      type="danger"
                      class="ml10"
                      :loading="batchDelLoading"
                      >批量移除</el-button
                    >
                  </div>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>
        <vxe-grid ref="tableRef" v-bind="gridOptions">
          <template #daily_publish_nums_edit="{ row }">
            <el-input-number
              v-model="row.dailyPublishNums"
              :precision="0"
              min="1"
              :step="1"
              @blur="handleSaveCurDailyPublishNums(row)"
            ></el-input-number>
          </template>
          <template #toolbar_default="{ row }">
            <div class="toolbar-btn">
              <div v-permission="['miravia_rules_list_edit']">
                <el-button
                  type="primary"
                  @click="handleOpenPublishStoreInfo(row, 'edit')"
                  >修改</el-button
                >
              </div>
              <div v-permission="['miravia_rules_list_edit']">
                <el-popconfirm
                  title="确定要删除此店铺吗？"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="handleDelCurRow(row)"
                >
                  <template #reference>
                    <div>
                      <el-button :loading="row.loading" type="danger"
                        >移除</el-button
                      >
                    </div>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </template>
        </vxe-grid>
      </el-card>
    </el-dialog>
    <StoreInfoDialog
      v-if="storeVisible"
      v-model="storeVisible"
      :store-info="storeInfo"
      :rule-obj="checkedRow"
      @handle-store-search="changeFreshVal"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, computed, reactive, watch } from 'vue';
  import {
    queryRuleShopsApi,
    editRuleShopApi,
    deleteRuleShopApi
  } from '@/api/publishs/miraviapublishrules';
  import StoreInfoDialog from './StoreInfoDialog.vue';
  import { ElMessage } from 'element-plus';
  import { debounce } from 'lodash-es';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRow: {
      type: Object,
      default: () => ({})
    },
    initList: {
      type: Object,
      default: () => ({})
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  //#region 搜索start
  const tableLoading = ref(false);
  const totalCount = ref(0);
  const storeNameList = ref([]);
  const storeNameOtions = ref([]);
  const storeName = ref([]);
  const handleSearchRuleStore = async () => {
    try {
      tableLoading.value = true;
      const { data } = await queryRuleShopsApi(props.checkedRow.id);
      let _data = data.map((item) => ({ ...item, loading: false }));
      gridOptions.data = _data.map((item) => {
        return {
          ...item,
          dailyPublishNumsOld: item.dailyPublishNums
        };
      });
      storeNameList.value = data.map((item) => ({
        label: item.storeAcct,
        value: item.storeAcct
      }));
      tableRef.value.setFilter('storeAcct', storeNameList.value);
      totalCount.value = data.length;
    } catch (err) {
      gridOptions.data = [];
      totalCount.value = 0;
    } finally {
      tableLoading.value = false;
    }
  };
  watch(storeNameList, (val) => {
    storeNameOtions.value = val;
  });
  //#endregion 搜索end
  const resetStoreName = () => {
    storeName.value = [];
  };
  const needFresh = ref(false);
  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    height: 400,
    columnConfig: {
      resizable: true
    },
    keepSource: true,
    showOverflow: true,
    scrollY: { gt: 15, osize: 50 },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      showStatus: true
    },
    checkboxConfig: {},
    data: [],
    columns: [
      { type: 'checkbox', width: 40 },
      {
        field: 'storeAcct',
        title: '店铺名',
        filters: [],
        filterRender: { name: 'FilterContent' },
        filterResetMethod: resetStoreName
      },
      {
        field: 'dailyPublishNums',
        title: '每天刊登量',
        slots: { edit: 'daily_publish_nums_edit' },
        editRender: {}
      },
      {
        field: 'publishTime',
        title: '上架开始时间',
        formatter({ cellValue }) {
          return cellValue + '点';
        }
      },
      {
        field: 'publishInterval',
        title: '上架间隔时间',
        formatter({ cellValue }) {
          return cellValue + '分钟';
        }
      },
      {
        field: 'toolbar',
        title: '操作',
        width: 150,
        slots: { default: 'toolbar_default' }
      }
    ],
    footerMethod() {}
  });

  onMounted(() => {
    handleSearchRuleStore();
  });
  onUnmounted(() => {
    if (needFresh.value) {
      emits('handleSearch');
      needFresh.value = false;
    }
  });

  const changeFreshVal = () => {
    needFresh.value = true;
    handleSearchRuleStore();
    resetStoreName();
  };
  // 对table数据的店铺名列进行筛选
  watch(
    storeName,
    debounce((val) => {
      const $table = tableRef.value;
      if ($table) {
        const column = $table.getColumnByField('storeAcct');
        if (column) {
          // 修改选项为勾选状态
          column.filters.forEach((item) => {
            if (val.filter((v) => v === item.value).length) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
          // 如果是直接修复筛选条件，则需要手动调用 updateData 处理表格数据
          $table.updateData();
        }
      }
    }, 100)
  );

  //#region 操作start
  // 每天刊登量 批量应用
  const PublishTimeList = new Array(24).fill().map((_, index) => index + 1);
  const PublishIntervalList = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30];
  const batchPublishNums = ref();
  const batchPublishTime = ref();
  const batchPublishInterval = ref();
  const handleApplyPublishNums = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    if (
      !batchPublishNums.value &&
      !batchPublishTime.value &&
      !batchPublishInterval.value
    )
      return ElMessage.warning('请填写数据');
    // 需校验刊登量 x 间隔时间 必须小于 1200
    let unableStoreList = [];
    checkedList.forEach((item) => {
      let dailyPublishNums = batchPublishNums.value || item.dailyPublishNums;
      let publishInterval = batchPublishInterval.value || item.publishInterval;
      if (dailyPublishNums * publishInterval >= 1200) {
        unableStoreList.push(item.storeAcct);
      }
    });
    if (unableStoreList.length) {
      return ElMessage.warning(
        unableStoreList.join() + ': 刊登量 x 间隔时间 必须小于 1200'
      );
    }
    const checkedListParams = checkedList.map((item) => ({
      ...item,
      dailyPublishNums: batchPublishNums.value || item.dailyPublishNums,
      publishTime: batchPublishTime.value || item.publishTime,
      publishInterval: batchPublishInterval.value || item.publishInterval
    }));
    // 批量保存
    try {
      const { msg } = await editRuleShopApi(checkedListParams);
      // 保存成功，再换数据
      checkedList.forEach((item) => {
        item.dailyPublishNums = batchPublishNums.value || item.dailyPublishNums;
        item.publishTime = batchPublishTime.value || item.publishTime;
        item.publishInterval =
          batchPublishInterval.value || item.publishInterval;
      });
      ElMessage.success(msg);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const batchDelLoading = ref(false);
  const handleBatchRemove = async () => {
    // 获取数据
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    const idList = checkedList.map((item) => item.id);
    batchDelLoading.value = true;
    try {
      const { msg } = await deleteRuleShopApi(idList);
      needFresh.value = true;
      // 删除行
      checkedList.forEach((elem) => {
        tableRef.value.remove(elem);
      });
      changeRowByDel();
      ElMessage.success(msg);
    } catch {
      needFresh.value = false;
    }
    batchDelLoading.value = false;
  };
  const handleDelCurRow = async (row) => {
    try {
      row.loading = true;
      const { msg } = await deleteRuleShopApi([row.id]);
      ElMessage.success(msg);
      needFresh.value = true;
      tableRef.value.remove(row);
      changeRowByDel();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      row.loading = false;
    }
  };

  const changeRowByDel = () => {
    const $table = tableRef.value;
    // 更改总数
    totalCount.value = $table.getTableData().fullData.length;
    // 店铺名变化
    storeNameList.value = $table.getTableData().fullData.map((item) => ({
      label: item.storeAcct,
      value: item.storeAcct
    }));
    $table.setFilter('storeAcct', storeNameList.value);
    const _storeNameList = storeNameList.value.map((item) => item.value);
    storeName.value = storeName.value.filter((item) =>
      _storeNameList.includes(item)
    );
  };

  const handleSaveCurDailyPublishNums = async (row) => {
    if (row.dailyPublishNums < 1)
      return ElMessage.warning('每天刊登量仅支持输入正整数！');
    if (row.dailyPublishNums * row.publishInterval >= 1200) {
      row.dailyPublishNums = row.dailyPublishNumsOld;
      return ElMessage.warning('刊登量 x 间隔时间 必须小于 1200！');
    }
    try {
      tableLoading.value = true;
      const { msg } = await editRuleShopApi([row]);
      needFresh.value = true;
      ElMessage.success(msg);
    } catch (err) {
      console.log('err :>> ', err);
    }
    tableLoading.value = false;
  };

  // 店铺弹窗
  const storeInfo = ref({});
  const storeVisible = ref(false);
  const handleOpenPublishStoreInfo = (row, type) => {
    storeInfo.value = { rowData: row, type };
    storeVisible.value = true;
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .publish-num-label {
    font-size: 12px;
    color: #606266;
    padding-right: 12px;
    flex: none;
  }
  .card-header {
    :deep(.el-select) {
      width: 100px;
    }
  }
  .ml10 {
    margin-left: 10px;
  }
  .store_width {
    width: 250px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
</style>
