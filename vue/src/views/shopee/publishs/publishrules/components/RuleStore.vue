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
      <el-form
        ref="formRef"
        :model="formData"
        :label-width="100"
        :inline="true"
      >
        <el-form-item label="部门">
          <el-tree-select
            v-model="formData.orgId"
            placeholder="请选择"
            :data="selectData.departData"
            check-strictly
            :props="defaultProps"
            :render-after-expand="false"
            :empty-text="'No matching Data'"
            clearable
            filterable
            @clear="clearDepart"
            @node-click="handleNodeClick"
          />
        </el-form-item>
        <el-form-item label="销售人员">
          <el-select
            v-model="formData.salePersonId"
            placeholder="请选择"
            filterable
            clearable
            @change="changeSalers"
            @clear="resetSearch"
          >
            <el-option
              v-for="item in selectData.salersData"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          ><el-button type="primary" @click="handleFilterStore"
            >查询</el-button
          ></el-form-item
        >
      </el-form>
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
                :max="3000"
              /><el-button type="primary" @click="handleApplyPublishNums"
                >一键应用</el-button
              >
            </div>
            <div>
              <el-button type="success" @click="handleBatchSave"
                >批量保存</el-button
              >
              <el-button type="primary" @click="handleExport">导出</el-button>
              <el-button type="danger" @click="handleBatchRemove()"
                >批量移除店铺</el-button
              >
              <el-button
                type="primary"
                @click="
                  handleOpenPublishStoreInfo(
                    { publishInterval: 1, publishTime: 1 },
                    'add'
                  )
                "
                >添加店铺</el-button
              >
            </div>
          </div>
        </template>
        <vxe-grid ref="tableRef" v-bind="gridOptions">
          <template #daily_publish_nums_edit="{ row }">
            <vxe-input
              v-model="row.dailyPublishNums"
              type="integer"
              min="1"
              max="3000"
              :step="1"
              @blur="handleSaveCurDailyPublishNums(row)"
            ></vxe-input>
          </template>
          <template #toolbar_default="{ row }">
            <div class="toolbar-btn">
              <div>
                <el-tooltip effect="dark" content="查看" placement="left"
                  ><el-button
                    type="info"
                    :icon="View"
                    @click="handleOpenPublishStoreInfo(row, 'view')"
                  ></el-button
                ></el-tooltip>
              </div>
              <div
                v-if="checkedRow.status !== 2"
                v-permission="['shopee_store_list_edit']"
              >
                <el-tooltip effect="dark" content="编辑" placement="left">
                  <el-button
                    type="primary"
                    :icon="Edit"
                    @click="handleOpenPublishStoreInfo(row, 'edit')"
                  />
                </el-tooltip>
              </div>
              <div
                v-if="checkedRow.status !== 2"
                v-permission="['shopee_store_list_edit']"
              >
                <el-popconfirm
                  title="确定要删除此店铺吗？"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="handleDelCurRow(row)"
                >
                  <template #reference>
                    <div>
                      <el-tooltip effect="dark" content="删除" placement="left">
                        <el-button
                          :loading="row.loading"
                          type="danger"
                          :icon="Delete"
                        ></el-button>
                      </el-tooltip>
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
      v-model="storeVisible"
      :store-info="storeInfo"
      :rule-id="checkedRow.id"
      @handle-store-search="changeFreshVal"
    />
  </div>
</template>

<script setup>
  import { ref, watch, computed, reactive, nextTick } from 'vue';
  import {
    getStoreInfoByRuleApi,
    delStoreApi,
    batchDelStoreApi,
    batchSaveStoreApi
  } from '@/api/shopee/publishrules';
  import { transBlob } from '@/utils/downloadFile';
  import { View, Edit, Delete } from '@element-plus/icons-vue';
  import StoreInfoDialog from './StoreInfoDialog.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { inRange } from 'lodash-es';
  import { getCustomers } from '@/api/common';
  import { getStoreListApi } from '@/api/shopee/common';

  // eslint-disable-next-line
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
  const tableDataCopy = ref([]);
  const handleSearchRuleStore = async () => {
    try {
      tableLoading.value = true;
      const params = {
        ruleId: props.checkedRow.id
      };
      const { data } = await getStoreInfoByRuleApi(params);
      let _data = data.map((item) => ({ ...item, loading: false }));
      gridOptions.data = _data;
      tableDataCopy.value = _data;
      totalCount.value = data.length;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableLoading.value = false;
    }
  };
  //#endregion 搜索end

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
        title: '店铺名'
      },
      { field: 'listingLimit', title: '总额度' },
      { field: 'canListingCount', title: '可用额度' },
      {
        field: 'dailyPublishNums',
        title: '每天刊登量',
        width: 120,
        slots: { edit: 'daily_publish_nums_edit' },
        editRender: {}
      },
      {
        field: 'autoDelete',
        title: '自动删除',
        formatter({ cellValue }) {
          return cellValue == 1 ? '开启' : '关闭';
        }
      },
      {
        field: 'autoDeleteNum',
        title: '每天删除数量'
      },
      {
        field: 'autoDeleteGreatListingTime',
        title: '删除刊登时间',
        formatter({ cellValue }) {
          return '大于' + cellValue + '天';
        }
      },
      {
        field: 'autoDeleteSalesType',
        title: '删除销量设置',
        formatter({ cellValue }) {
          if (cellValue === 1) {
            return '30天销量=0';
          } else if (cellValue === 2) {
            return '60天销量=0';
          } else if (cellValue === 3) {
            return '90天销量=0';
          } else if (cellValue === 4) {
            return '7天销量=0';
          }
        }
      },
      {
        field: 'publishTime',
        title: '上架开始时间',
        formatter({ cellValue }) {
          return '中国时间：' + cellValue + ':00';
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
        width: 100,
        slots: { default: 'toolbar_default' }
      }
    ],
    editRules: {
      dailyPublishNums: [
        { required: true, message: '请输入每天刊登量' },
        {
          validator({ cellValue }) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                if (!inRange(cellValue, 1, 3000)) {
                  reject(new Error('每天可刊登量最小为1，最大为3000'));
                } else {
                  resolve();
                }
              }, 100);
            });
          }
        }
      ]
    },
    // editClosed: function ({ row, column }) {
    //   console.log('row,column :>> ', row, column);
    // },
    footerMethod() {}
  });

  //#region 销售人员部门
  const formRef = ref();
  const formData = reactive({});
  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };
  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: []
  });
  const salersDataCopy = ref([]);
  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    try {
      const { data } = await getCustomers({ roleNames: 'shopee专员' });
      selectData.departData = data.orgTree;
      selectData.salersData = data.userList;
      salersDataCopy.value = data.userList;
    } catch (err) {
      console.log(err);
    }
  };
  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'shopee专员',
        orgId: formData.orgId,
        salePersonId: formData.salePersonId,
        platCode: 'ebay'
      };
      const { data } = await getStoreListApi(params);
      selectData.storeData = data;
    } catch (err) {
      console.log(err);
    }
  };
  const handleNodeClick = (data) => {
    let selectId = data.id;
    formData.salePersonId = '';
    selectData.salersData = salersDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
    nextTick(() => {
      getStoreList();
    });
  };
  const changeSalers = () => {
    formData.storeAcctId = [];
    getStoreList();
  };
  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    formData.orgId = '';
    formData.salePersonId = '';
    resetSearch();
  };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    formData.salePersonId = '';
    formData.storeAcctId = '';
    getStoreList();
  };
  // 筛选店铺
  const handleFilterStore = () => {
    const storeIdList = selectData.storeData.map((item) => item.id);
    if (!formData.orgId && !formData.salePersonId) {
      gridOptions.data = tableDataCopy.value;
    } else {
      gridOptions.data = tableDataCopy.value.filter((item) =>
        storeIdList.includes(item.storeAcctId)
      );
    }
  };
  // #endregion 销售人员部门
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleSearchRuleStore();
        getDepartmentList();
      } else {
        reset();
        if (needFresh.value) {
          emits('handleSearch');
          needFresh.value = false;
        }
      }
    }
  );

  const reset = () => {
    batchPublishNums.value = null;
    formData.orgId = null;
    formData.salePersonId = null;
  };

  const changeFreshVal = () => {
    needFresh.value = true;
    handleSearchRuleStore();
  };
  //#region 操作start
  // 每天刊登量 批量应用
  const batchPublishNums = ref();
  const handleApplyPublishNums = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    const tableList = tableRef.value?.getTableData()?.fullData;
    const checkedIdList = checkedList.map((e) => e.id);
    const _tableData = (tableList || []).map((item) => {
      if (checkedIdList.includes(item.id)) {
        return {
          ...item,
          dailyPublishNums: batchPublishNums.value
        };
      }
      return item;
    });
    tableRef.value?.reloadData(_tableData);
    gridOptions.checkboxConfig.checkRowKeys = checkedIdList;
    tableDataCopy.value.forEach((item) => {
      if (checkedIdList.includes(item.id)) {
        item.dailyPublishNums = batchPublishNums.value;
      }
    });
  };
  const handleBatchRemove = async () => {
    ElMessageBox.prompt('卖家简称列表', '批量移除店铺', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      autofocus: true,
      inputType: 'textarea',
      customClass: 'shopee-remove-stores',
      inputPlaceholder: '请输入需要删除的店铺名，多个店铺用回车换行',
      inputValidator: function (val) {
        if (val === null || val.trim() === '') {
          return false;
        }
        return true;
      },
      inputErrorMessage: '请输入店铺名'
    }).then(async ({ value }) => {
      const { msg } = await batchDelStoreApi({
        storeNameStr: value,
        ruleId: props.checkedRow.id
      });
      needFresh.value = true;
      // 删除行
      handleSearchRuleStore();
      ElMessage.success(msg);
    });
  };
  const handleDelCurRow = async (row) => {
    try {
      row.loading = true;
      const { msg } = await delStoreApi(row.id);
      ElMessage.success(msg);
      needFresh.value = true;
      tableRef.value.remove(row);
      tableDataCopy.value = (tableDataCopy.value || []).filter(
        (item) => item.id !== row.id
      );
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      row.loading = false;
    }
  };
  const handleBatchSave = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    if (checkedList.some((item) => !inRange(item.dailyPublishNums, 1, 3000)))
      return ElMessage.warning('每天刊登量最小为1，最大为3000');
    try {
      tableLoading.value = true;
      const params = checkedList.map((item) => ({
        id: item.id,
        dailyPublishNums: item.dailyPublishNums
      }));
      const { msg } = await batchSaveStoreApi(params);
      needFresh.value = true;
      ElMessage.success(msg);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableLoading.value = false;
    }
  };
  const handleSaveCurDailyPublishNums = async (row) => {
    if (!inRange(row.dailyPublishNums, 1, 3000))
      return ElMessage.warning('每天刊登量最小为1，最大为3000');
    try {
      tableLoading.value = true;
      const params = [
        {
          id: row.id,
          dailyPublishNums: row.dailyPublishNums
        }
      ];
      const { msg } = await batchSaveStoreApi(params);
      needFresh.value = true;
      ElMessage.success(msg);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataCopy.value.forEach((item) => {
        if (item.id === row.id) {
          item.dailyPublishNums = row.dailyPublishNums;
        }
      });
      tableLoading.value = false;
    }
  };
  const exportLoading = ref(false);
  const handleExport = async () => {
    exportLoading.value = true;
    transBlob({
      url: '/lms/shopee/shopeeAutoListingRuleStoreController/store/exportStoreDetails',
      data: { ruleId: props.checkedRow.id },
      contentType: 'application/json',
      fileName: `Shopee规则店铺${Date.now()}.xlsx`
    }).finally(() => {
      exportLoading.value = false;
      ElMessage.success('下载成功');
    });
  };
  //#endregion 操作end

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
  }
</style>
<style lang="scss">
  .shopee-remove-stores {
    .el-textarea__inner {
      height: 160px;
    }
  }
</style>
