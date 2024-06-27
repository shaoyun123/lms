<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改重量"
    width="70%"
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div>
      <div class="flex flex-wrap">
        <el-form-item prop="skuType">
          <el-select v-model="skuType" class="form_left">
            <el-option value="prodSSkuStr" label="商品子SKU" />
            <el-option value="sellerSkuStr" label="店铺子SKU" />
            <el-option value="prodPSkuStr" label="商品父SKU" />
          </el-select>
          <el-input
            v-model="queryContent"
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
            class="w150"
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
            class="w150"
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
        <el-form-item label="在线重量(g)" class="mr-2">
          <ZInputNumber
            v-model="form.weightMin"
            style="width: 60px"
            placeholder=">="
            clearable
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="form.weightMax"
            style="width: 60px"
            placeholder=">="
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getBatchWeightList(1)"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </div>
      <div>
        <div class="flex mb-18">
          <div class="flex">
            <div class="mr-4">修改重量</div>
            <div class="w50">
              <el-select v-model="calculate.operateType">
                <el-option value="=">=</el-option>
                <el-option value="+">在线重量+</el-option>
                <el-option value="-">在线重量-</el-option>
                <el-option value="*">在线重量*</el-option>
              </el-select>
            </div>
            <ZInputNumber
              v-model="calculate.batchWeightVal"
              :min="0"
              :precision="0"
              class="mr-2 w100"
            />
            <el-button type="primary" @click="BatchWriteFn">一键应用</el-button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="flex-between">
        <div>已选/总计({{ checkTotal || 0 }}/{{ totalCount }})</div>
        <el-button type="primary" :loading="submitLoading" @click="handleSave"
          >提交修改</el-button
        >
      </div>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="550"
        border
        :loading="tableLoading"
        :edit-rules="validRules"
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
        :scroll-y="{ gt: 10 }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺" />
        <vxe-column field="productId" title="商品ID" />
        <vxe-column field="skuId" title="sku_id" width="145" />
        <vxe-column field="sellerSku" title="店铺子SKU" />
        <vxe-column field="prodSSku" title="商品子SKU" />
        <vxe-column
          field="weight"
          title="在线重量(g)"
          :filters="[{}]"
          :filter-method="filterRange"
          :filter-reset-method="filterResetRange"
        >
          <template #filter="{ column, $panel }">
            <div
              v-for="(option, index) in column.filters"
              :key="index"
              class="flex m10"
            >
              <ZInputNumber
                v-model="option.min"
                :precision="0"
                class="mr-2 w80"
                @input="$panel.changeOption($event, true, option)"
              />
              <ZInputNumber
                v-model="option.max"
                :min="0"
                :precision="0"
                class="mr-2 w80"
                @input="$panel.changeOption($event, true, option)"
              />
            </div>
          </template>
        </vxe-column>
        <vxe-column field="newWeight" title="修改重量(g)">
          <template #default="{ row }">
            <ZInputNumber
              v-model="row.newWeight"
              :min="0"
              :precision="0"
              style="width: 100%"
              class="flex-center"
              @change="changeNewWeight($event, row)"
            />
          </template>
        </vxe-column>
        <vxe-column
          field="weightDiff"
          title="重量差(g)"
          :title-help="{ message: '重量差＝在线重量-修改重量' }"
          :filters="[{}]"
          :filter-method="filterRange"
          :filter-reset-method="filterResetRange"
        >
          <template #filter="{ column, $panel }">
            <div
              v-for="(option, index) in column.filters"
              :key="index"
              class="flex m10"
            >
              <ZInputNumber
                v-model="option.min"
                :precision="0"
                class="mr-2 w80"
                @input="$panel.changeOption($event, true, option)"
              />
              <ZInputNumber
                v-model="option.max"
                :min="0"
                :precision="0"
                class="mr-2 w80"
                @input="$panel.changeOption($event, true, option)"
              />
            </div>
          </template>
        </vxe-column>
        <vxe-column field="result" title="操作结果">
          <template #default="{ row }">
            <div :class="row.result ? 'success_color' : 'fail_color'">
              {{ row.msg }}
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </el-dialog>
</template>

<script setup>
  import { ref, reactive, computed, watch, nextTick } from 'vue';
  import {
    aeHalfEditWeightApi,
    aeHalfEditWeightPageApi
  } from '@/api/publishs/aehalfhosted';
  import { ElMessage } from 'element-plus';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import { calculateBasicOperator } from '@/utils/common';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedSIdList: {
      type: Array,
      default: () => []
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

  const calculate = ref({
    operateType: '=',
    batchWeightVal: ''
  });

  const validRules = ref({});

  const needFresh = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        resetForm();
        needFresh.value = false;
        getDepartmentList();
        getStoreList();
        getBatchWeightList(0);
      } else {
        tableRef.value.clearFilter();
        clearTimeout(timerId.value);
        needFresh.value && emits('handleSearch');
      }
    }
  );

  const tableRef = ref();
  const checkTotal = computed(
    () => tableRef.value?.getCheckboxRecords().length
  );

  const handleClose = () => {
    dialogVisible.value = false;
    resetForm();
    submitLoading.value = false;
    tableLoading.value = false;
  };

  const skuType = ref('prodSSkuStr'); // 默认商品子sku
  const queryContent = ref('');

  const form = reactive({
    orgId: '',
    salesPersonId: '',
    storeAcctIdList: [],
    weightMin: '',
    weightMax: ''
  });

  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };

  // 获取店铺信息
  const storeList = ref([]);
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'smt专员',
        orgId: form.orgId,
        salePersonId: form.salesPersonId,
        platCode: 'AE半托管'
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
      roleNames: 'smt专员'
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
    skuType.value = 'prodSSkuStr';
    queryContent.value = '';
    form.orgId = '';
    form.salesPersonId = '';
    form.storeAcctIdList = [];
    form.weightMin = '';
    form.weightMax = '';
    calculate.value.operateType = '=';
    calculate.value.batchWeightVal = '';
    getStoreList();
  };

  // 查询列表数据
  const tableLoading = ref(false);
  const totalCount = ref(0);
  const tableData = ref([]);
  const getBatchWeightList = async (type) => {
    // 初始查询 type为0
    if (type === 1 && queryContent.value === '') {
      return ElMessage.warning('请输入SKU！');
    }

    if (queryContent.value !== '') {
      form[skuType.value] = queryContent.value;
    }

    const syncSIdList = type ? {} : { syncSIdList: props.checkedSIdList };

    tableLoading.value = true;
    const { data } = await aeHalfEditWeightPageApi({
      ...form,
      ...syncSIdList
    }).finally(() => {
      tableLoading.value = false;
    });
    totalCount.value = data.length;
    tableData.value = data?.map((item) => {
      if (!item.newWeight) {
        item.newWeight = '';
        item.weightDiff = '';
      } else {
        item.weightDiff = Number(item.weight || 0) - item.newWeight;
      }
      item.result = '';
      item.msg = '';
      return item;
    });
    delete form[skuType.value];
  };

  // 单个输入修改重量-去计算重量差
  const changeNewWeight = (val, row) => {
    if (val !== '') {
      row.newWeight = Math.round(val);
      row.weightDiff = Number(row.weight || 0) - row.newWeight;
    }
  };

  // 根据运算符批量填写
  const BatchWriteFn = () => {
    const { operateType, batchWeightVal } = calculate.value;
    if (batchWeightVal === 0 || !batchWeightVal)
      return ElMessage.warning('请填写数据且不为0！');

    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    checkedList.forEach((item) => {
      // 原值
      let originVal = item.weight;
      item.newWeight = calculateBasicOperator(
        operateType,
        batchWeightVal,
        Number(originVal || 0)
      );
      // 重量差
      item.weightDiff = Number(item.weight || 0) - item.newWeight;
    });
  };

  const submitLoading = ref(false);
  // 点击提交
  const timerId = ref(null);
  const handleSave = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }

    // 校验勾选的 修改重量不为空
    const newWeightNullList = checkedList.filter((item) => !item.newWeight);
    if (newWeightNullList.length) {
      return ElMessage.warning('请填写修改重量！');
    }
    submitLoading.value = true;

    const { code, data, msg } = await aeHalfEditWeightApi(checkedList).finally(
      () => {
        submitLoading.value = false;
      }
    );
    data.forEach((item) => {
      const index = tableData.value.findIndex((el) => el.skuId === item.skuId);
      if (index > -1) {
        tableData.value[index].result = item.success;
        tableData.value[index].msg = item.operateMessage;
      }
    });

    needFresh.value = true;

    if (code === '0000') {
      ElMessage.success(msg);
    } else {
      ElMessage.warning(msg);
    }
  };

  // 列表筛选
  const filterRange = ({ option, cellValue }) => {
    const { min, max } = option;
    if ([null, undefined].includes(min)) {
      if (cellValue <= max) {
        return true;
      }
    } else if ([null, undefined].includes(max)) {
      if (cellValue >= min) {
        return true;
      }
    } else if (
      ![null, undefined].includes(min) &&
      ![null, undefined].includes(max)
    ) {
      if (cellValue <= max && cellValue >= min) {
        return true;
      }
    }
    return false;
  };
  const filterResetRange = ({ options }) => {
    options[0].min = null;
    options[0].max = null;
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
  .success_color {
    color: #67c23a;
  }
  .fail_color {
    color: #f56c6c;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  .w100 {
    width: 100px;
  }
  .w50 {
    width: 50px;
  }
  .w120 {
    width: 120px;
  }
  .m10 {
    margin: 10px;
  }
  .mr-4 {
    margin-right: 4px;
  }
  .range_link {
    width: 20px;
    text-align: center;
  }
</style>
