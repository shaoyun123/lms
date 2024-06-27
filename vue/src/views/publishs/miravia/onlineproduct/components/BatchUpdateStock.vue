<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改库存"
    width="65%"
    style="height: 85%"
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <vxe-grid ref="tableRef" v-bind="gridOptions">
      <template #toolbar_btn>
        <div class="flex">
          <el-form-item prop="queryType">
            <el-select v-model="form.queryType" class="form_left">
              <el-option :value="4" label="商品子SKU" />
              <el-option :value="3" label="店铺子SKU" />
              <el-option :value="2" label="商品父SKU" />
            </el-select>
            <el-input
              v-model="form.queryContent"
              placeholder="多个搜素以逗号隔开"
              class="w150 mr-2"
              clearable
            />
          </el-form-item>
          <el-form-item label="部门" prop="orgId" class="mr-2">
            <el-tree-select
              v-model="form.orgId"
              placeholder="请选择"
              :data="departData"
              check-strictly
              :props="defaultProps"
              :render-after-expand="false"
              :empty-text="'No matching Data'"
              clearable
              filterable
              class="tree_select"
              @node-click="handleNodeClick"
              @clear="clearDepart"
            />
          </el-form-item>
          <el-form-item label="销售" prop="salesPersonId" class="mr-2">
            <el-select
              v-model="form.salesPersonId"
              placeholder="请选择"
              clearable
              filterable
              style="width: 150px"
              @change="changeSalers"
              @clear="resetSearch"
            >
              <el-option
                v-for="item in salersData"
                :key="item.id"
                :label="item.user_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺" prop="storeAcctIdList">
            <el-select
              v-model="form.storeAcctIdList"
              class="w150 mr-2"
              clearable
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.storeAcct"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="queryType">
            <el-button type="primary" @click="handleSearch(1)">查询</el-button>
            <el-button @click="resetForm">清空</el-button>
          </el-form-item>
        </div>
        <div>
          <div class="flex mb-18">
            <el-radio-group v-model="tabStatus" @change="changeRadio">
              <el-radio :value="1"
                >按现有库存
                <span class="text-gray addStock">增加</span>
                <ZInputNumber
                  v-model="addNewSkuStockBatch"
                  :precision="0"
                  class="mr-2 w80"
                />
              </el-radio>
              <el-radio :value="2"
                >直接修改库存
                <ZInputNumber
                  v-model="newSkuStockBatch"
                  :min="0"
                  :precision="0"
                  class="mr-2 w80"
              /></el-radio>
            </el-radio-group>
            <el-button type="primary" @click="BatchWriteFn">一键应用</el-button>
          </div>
        </div>
      </template>
      <template #default_image_url="{ row }">
        <div><ImagePop :src="row.skuImageList" /></div>
      </template>
      <template #default_goodsSSku="{ row }">
        <div>{{ row.prodSSku }}</div>
      </template>
      <template #default_variation="{ row }">
        <div v-html="row.skuPropertyStr"></div>
      </template>
      <template #default_totalStock="{ row }">
        <div>{{ row.oldSkuStock }}</div>
      </template>
      <template #default_newTotalStock="{ row }">
        <div>
          <ZInputNumber
            v-model="row.skuStock"
            placeholder="请输入"
            :min="0"
            :precision="0"
          />
        </div>
      </template>
      <template #default_result="{ row }">
        <div :class="row.success ? 'success_color' : 'fail_color'">
          {{ row.success ? '修改成功' : row.result }}
        </div>
      </template>
    </vxe-grid>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleSave">提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, reactive, computed, watch, nextTick } from 'vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    adjustStockBatchApi,
    batchUpdateStockPageApi
  } from '@/api/publishs/miraviaonline';
  import { ElMessage } from 'element-plus';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRowList: {
      type: Array,
      default: () => []
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 100
    }
  });
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const idList = ref([]);
  const allChildSkuList = ref([]);
  const needFresh = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        resetForm();
        allChildSkuList.value = [];
        needFresh.value = false;
        let checkedRowListCopy = JSON.parse(
          JSON.stringify(props.checkedRowList)
        );
        idList.value = checkedRowListCopy.map((item) => item.id);
        getDepartmentList();
        getStoreList();
        handleSearch(0);
      } else {
        needFresh.value &&
          emits('handleSearch', props.currentPage, props.pageSize);
      }
    }
  );
  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showOverflow: true,
    loading: false,
    height: 650,
    rowConfig: {
      isHoverRow: true
    },
    columnConfig: {
      resizable: true
    },
    toolbarConfig: {
      slots: {
        buttons: 'toolbar_btn'
      }
    },
    columns: [
      { type: 'checkbox', width: 43 },
      {
        field: 'storeAcct',
        title: '店铺'
      },
      {
        field: 'productId',
        title: '商品编号'
      },
      {
        field: 'imageUrl',
        title: 'SKU图片',
        slots: {
          default: 'default_image_url'
        }
      },
      {
        field: 'storeSSku',
        title: '店铺子SKU'
      },
      {
        field: 'prodSSku',
        title: '商品子SKU',
        slots: {
          default: 'default_goodsSSku'
        }
      },
      {
        field: 'skuProperty',
        title: 'SKU属性',
        slots: {
          default: 'default_variation'
        }
      },
      {
        title: '库存原值',
        slots: {
          default: 'default_totalStock'
        }
      },
      {
        title: '库存新值',
        width: '180',
        slots: {
          default: 'default_newTotalStock'
        }
      },
      {
        title: '操作结果',
        width: '180',
        slots: {
          default: 'default_result'
        }
      }
    ],
    data: []
  });
  const handleClose = () => {
    dialogVisible.value = false;
    newSkuStockBatch.value = '';
    addNewSkuStockBatch.value = '';
    resetForm();
  };

  const form = reactive({
    queryType: 4,
    queryContent: '',
    orgId: '',
    salesPersonId: '',
    storeAcctIdList: []
  });

  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };

  const tabStatus = ref(1);
  const changeRadio = (val) => {
    if (val === 1) {
      newSkuStockBatch.value = '';
    }
    if (val === 2) {
      addNewSkuStockBatch.value = '';
    }
  };

  // 获取店铺信息
  const storeList = ref([]);
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'miravia专员',
        orgId: form.orgId,
        salePersonId: form.salesPersonId,
        platCode: 'miravia'
      };
      const { data } = await getStoreInfo(params);
      storeList.value = data;
    } catch (err) {
      console.log(err);
    }
  };

  const salersData = ref([]);
  const salersDataCopy = ref([]);
  const departData = ref([]);
  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'miravia专员'
    };
    try {
      const { data } = await getDepartData(params);
      departData.value = data.orgTree;
      salersData.value = data.userList;
      salersDataCopy.value = data.userList;
    } catch (err) {
      console.log(err);
    }
  };

  // 切换销售下拉
  const changeSalers = () => {
    form.storeAcctIdList = [];
    getStoreList();
  };

  // 选择部门 获取店铺和销售员
  const handleNodeClick = (data) => {
    let selectId = data.id;
    salersData.value = salersDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
    resetSearch();
    nextTick(() => {
      getStoreList();
    });
  };

  // 清空部门选择
  const clearDepart = () => {
    salersData.value = salersDataCopy.value;
    form.orgId = '';
    resetSearch();
  };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    form.salesPersonId = '';
    form.storeAcctIdList = [];
    getStoreList();
  };

  // 清空表单
  const resetForm = () => {
    form.queryType = 4;
    form.queryContent = '';
    form.orgId = '';
    form.salesPersonId = '';
    form.storeAcctIdList = [];
    getStoreList();
  };

  // 查询列表数据
  const handleSearch = async (type) => {
    if (type && form.queryContent === '') {
      return ElMessage.warning('请输入SKU！');
    }
    let params = {};
    params = type ? form : {};
    const { data } = await batchUpdateStockPageApi({
      ...params,
      idList: type ? [] : idList.value
    });
    gridOptions.data = data?.map((item) => {
      (item.oldSkuStock = item.skuStock), (item.skuStock = '');
      return item;
    });
  };

  const newSkuStockBatch = ref('');
  const addNewSkuStockBatch = ref('');
  // 批量填写
  const BatchWriteFn = () => {
    // 如果点击了批量修改(一键应用) 但没有填值
    if (
      (tabStatus.value === 1 && addNewSkuStockBatch.value === '') ||
      (tabStatus.value === 2 && newSkuStockBatch.value === '')
    ) {
      return ElMessage.warning('请先填写批量修改库存的数据！');
    }
    // 填写了值 没有勾选数据 就批量填写所有;否则只批量修改勾选的
    const checkedList = tableRef.value.getCheckboxRecords();
    const { fullData } = tableRef.value.getTableData();

    // tabStatus.value 1: 原有基础上增加 2: 直接改为修改值
    if (tabStatus.value === 1) {
      if (!checkedList.length) {
        fullData.forEach((item) => {
          item.skuStock =
            Number(item.oldSkuStock) + Number(addNewSkuStockBatch.value);
        });
      } else {
        checkedList.forEach((item) => {
          item.skuStock =
            Number(item.oldSkuStock) + Number(addNewSkuStockBatch.value);
        });
      }
    }
    if (tabStatus.value === 2) {
      if (!checkedList.length) {
        fullData.forEach((item) => {
          item.skuStock = Number(newSkuStockBatch.value);
        });
      } else {
        checkedList.forEach((item) => {
          item.skuStock = Number(newSkuStockBatch.value);
        });
      }
    }
  };

  // 点击提交
  const handleSave = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    // 去除没填写新库存的数据
    const existNewStockList = checkedList.filter(
      (item) =>
        item.skuStock !== undefined &&
        item.skuStock !== null &&
        item.skuStock !== ''
    );
    if (!existNewStockList.length) {
      return ElMessage.warning('请填写新库存');
    }

    // 改数据格式
    let productIdObj = {};
    existNewStockList.forEach((item) => {
      if (productIdObj[item.productId]) {
        productIdObj[item.productId] =
          productIdObj[item.productId].concat(item);
      } else {
        productIdObj[item.productId] = [item];
      }
    });
    const params = [];
    Object.keys(productIdObj).forEach((itemkey) => {
      const itemVal = productIdObj[itemkey];
      params.push({
        productId: itemkey,
        storeAcctId: itemVal[0]?.storeAcctId,
        skuStockList: itemVal.map((elem) => ({
          skuId: elem.skuId,
          skuStock: elem.skuStock,
          id: elem.id
        }))
      });
    });
    gridOptions.loading = true;
    const { data } = await adjustStockBatchApi(params).finally(() => {
      gridOptions.loading = false;
    });
    needFresh.value = true;
    // 操作结果
    data.forEach((item) => {
      const index = gridOptions.data.findIndex((el) => el.skuId === item.skuId);
      if (index > -1) {
        gridOptions.data[index].result = item.message || '';
        gridOptions.data[index].success = item.success;
      }
    });
  };
</script>

<style lang="scss" scoped>
  .form_left {
    width: 100px !important;
  }
  .w150 {
    width: 150px;
  }
  .w80 {
    width: 80px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .mb-18 {
    margin-bottom: 18px;
  }
  .mr-2 {
    margin-right: 8px;
  }
  .addStock {
    margin: 0 2px 0 8px;
  }
  .text-gray {
    color: #606266 !important;
  }
  .success_color {
    color: #67c23a;
  }
  .fail_color {
    color: #f56c6c;
  }
  .tree_select {
    width: 150px;
  }
</style>
