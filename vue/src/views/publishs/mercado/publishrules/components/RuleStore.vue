<template>
  <div class="store_dialog_wrapper">
    <el-dialog
      v-model="dialogVisible"
      :title="
        checkedRow.ruleName
          ? `${checkedRow.ruleName}--总数：${totalCount}`
          : '设置店铺'
      "
      :width="1000"
      :close-on-click-modal="false"
      :align-center="true"
      :destroy-on-close="false"
    >
      <el-card v-loading="tableLoading">
        <template #header>
          <div class="card-header">
            <div>
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
        <!-- v-loading="tableDataLoading" -->
        <vxe-table ref="tableRef" :data="tableData" :align="'center'" border>
          <vxe-column type="checkbox" width="40" />
          <vxe-column field="storeAcct" title="店铺名" />
          <vxe-column field="stock" title="在线库存" />
          <vxe-column field="dailyPublishNums" title="刊登量" />
          <vxe-column field="publishTime" title="上架开始时间" />
          <vxe-column field="publishInterval" title="上架间隔时间" />
          <vxe-column field="creator" title="创建人" />
          <vxe-column field="modifier" title="修改人" />
          <vxe-column title="操作" width="140"
            ><template #default="{ row }"
              ><div style="display: flex">
                <!-- <div>
                  <el-tooltip effect="dark" content="查看" placement="left"
                    ><el-button
                      type="info"
                      :icon="View"
                      @click="handleOpenPublishStoreInfo(row, 'view')"
                    ></el-button
                  ></el-tooltip>
                </div> -->
                <!-- v-permission="['shopee_store_list_edit']" -->
                <div v-if="checkedRow.status !== 2">
                  <el-tooltip effect="dark" content="编辑" placement="left">
                    <el-button
                      type="primary"
                      :icon="Edit"
                      @click="handleOpenPublishStoreInfo(row, 'edit')"
                    />
                  </el-tooltip>
                </div>
                <div v-if="checkedRow.status !== 2">
                  <el-popconfirm
                    title="确定要删除此店铺吗？"
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    @confirm="handleDelCurRow(row)"
                  >
                    <template #reference>
                      <div>
                        <el-tooltip
                          effect="dark"
                          content="删除"
                          placement="left"
                        >
                          <el-button
                            :loading="row.loading"
                            type="danger"
                            :icon="Delete"
                          ></el-button>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-popconfirm>
                </div></div></template
          ></vxe-column>
        </vxe-table>
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
  import { ref, watch, computed } from 'vue';
  import {
    deleteMercadoAutoListingRuleStoreById,
    searchMercadoAutoListingRuleStoreList
  } from '@/api/publishs/mercadopublishrules';
  import { Edit, Delete } from '@element-plus/icons-vue';
  import StoreInfoDialog from './StoreInfoDialog.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

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
  const tableData = ref([]);
  const handleSearchRuleStore = async () => {
    try {
      tableLoading.value = true;
      const { data } = await searchMercadoAutoListingRuleStoreList({
        ruleId: props.checkedRow.id
      });
      tableData.value = data;
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

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleSearchRuleStore();
      } else {
        if (needFresh.value) {
          emits('handleSearch');
          needFresh.value = false;
        }
      }
    }
  );
  const changeFreshVal = () => {
    needFresh.value = true;
    handleSearchRuleStore();
  };
  // 删除店铺
  const handleDelCurRow = async (row) => {
    try {
      row.loading = true;
      const { msg } = await deleteMercadoAutoListingRuleStoreById(row.id);
      ElMessage.success(msg);
      needFresh.value = true;
      tableRef.value.remove(row);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      row.loading = false;
    }
  };
  // 批量移除店铺
  const handleBatchRemove = async () => {
    const checkedData = tableRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    ElMessageBox.confirm(`是否将选中的店铺全部删除？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          const { msg } = await deleteMercadoAutoListingRuleStoreById(
            ids.join(',')
          );
          // 删除行
          checkedData.forEach((elem) => {
            tableRef.value.remove(elem);
          });
          // 更改总数
          totalCount.value = tableRef.value.getTableData().fullData.length;
          ElMessage.success(msg);
          needFresh.value = true;
        } catch (err) {
          console.log('err :>> ', err);
        }
      })
      .catch(() => {});
  };

  // 店铺弹窗
  const storeInfo = ref({});
  const storeVisible = ref(false);
  const handleOpenPublishStoreInfo = (row, type) => {
    storeInfo.value = { rowData: row, type };
    storeVisible.value = true;
  };
</script>
