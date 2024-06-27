<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改库存"
    width="75%"
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div>
      <div class="flex flex-wrap">
        <el-form-item prop="sellerSkuKey">
          <el-select v-model="form.sellerSkuKey" class="form_left">
            <el-option value="prodSSkuList" label="商品子SKU" />
            <el-option value="sellerSkuList" label="店铺子SKU" />
            <el-option value="prodPSkuList" label="商品父SKU" />
          </el-select>
          <el-input
            v-model="form.sellerSkuVal"
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
        <el-form-item prop="ywuStock">
          <el-select v-model="stockForm.ywuStock" class="form_left" filterable>
            <el-option value="availableStock" label="义乌仓库存可用" />
            <el-option value="orderNotInNum" label="义乌仓库存在途" />
            <el-option value="lackUnPaiNum" label="义乌仓库存未派" />
          </el-select>
          <el-input
            v-model="stockForm.lowerBound"
            placeholder=">="
            style="width: 80px"
            clearable
          />
          <div class="range_link">-</div>
          <el-input
            v-model="stockForm.upperBound"
            placeholder="<="
            style="width: 80px; margin-right: 10px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getBatchGetStockList(1)"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </div>
      <div>
        <div class="flex mb-18">
          <div class="flex">
            <div class="mr-4">库存新值</div>
            <div class="w50">
              <el-select v-model="calculate.operateType">
                <el-option value="=">=</el-option>
                <el-option value="+">原值+</el-option>
                <el-option value="-">原值-</el-option>
                <el-option value="*">原值*</el-option>
              </el-select>
            </div>
            <ZInputNumber
              v-model="calculate.batchStockVal"
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
        <div>
          <span class="text-red mr-4">注: 库存修改仅针对JIT杭州仓</span>
          <el-button type="primary" @click="handleSave">提交修改</el-button>
        </div>
      </div>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="550"
        border
        :edit-rules="validRules"
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
        :scroll-y="{ gt: 10 }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺" />
        <vxe-column field="productId" title="商品ID" />
        <vxe-column field="skuId" title="sku_id" />
        <vxe-column field="sellerSku" title="店铺子SKU" />
        <vxe-column field="prodSSku" title="商品子SKU" />
        <vxe-column
          field="sellableQuantityOrigin"
          title="库存原值"
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
        <vxe-column field="availableStock" title="义乌仓可用" />
        <vxe-column field="newJitTotalStock" title="库存新值">
          <template #default="{ row }">
            <ZInputNumber
              v-model="row.newJitTotalStock"
              :min="0"
              :precision="0"
              class="mr-25 w120 mb-4"
            />
            <el-tag type="danger"
              >当前类目要求SKU库存≥{{ row.jitStockLimit }}</el-tag
            >
          </template>
        </vxe-column>
        <vxe-column field="result" title="操作结果">
          <template #default="{ row }">
            <div :class="row.result ? 'success_color' : 'fail_color'">
              {{ row.remark }}
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </el-dialog>
</template>

<script setup>
  import { ref, reactive, computed, watch, nextTick } from 'vue';
  import { ElMessage } from 'element-plus';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import { calculateBasicOperator } from '@/utils/common';
  import {
    getStockListApi,
    adjustStockBatchApi
  } from '@/api/publishs/aefullyhosted';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRowList: {
      type: Array,
      default: () => []
    },
    roleNames: {
      type: String,
      default: () => ''
    },
    platCode: {
      type: String,
      default: () => ''
    },
    currentPage: {
      type: Number,
      default: () => 1
    },
    pageSize: {
      type: Number,
      default: () => 100
    },
    // 子sku的顺序要根据勾选的父sku数据排序
    order: {
      type: String,
      default: 'CREATE_TIME_ASC'
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

  const validRules = ref({});

  // 计算
  const calculate = ref({
    operateType: '=',
    batchStockVal: ''
  });
  const pIdList = ref([]);
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
        pIdList.value = checkedRowListCopy.map((item) => item.productId);
        getDepartmentList();
        getStoreList();
        getBatchGetStockList(0);
      } else {
        tableRef.value.clearFilter();
        needFresh.value &&
          emits('handleSearch', props.currentPage, props.pageSize);
      }
    }
  );

  const tableRef = ref();

  const checkTotal = computed(
    () => tableRef.value?.getCheckboxRecords().length
  );

  const handleClose = () => {
    dialogVisible.value = false;
    newSkuStockBatch.value = '';
    addNewSkuStockBatch.value = '';
    resetForm();
  };

  const form = reactive({
    sellerSkuKey: 'prodSSkuList',
    sellerSkuVal: '',
    orgId: '',
    salesPersonId: '',
    storeAcctIdList: []
  });

  // 义乌仓库存
  const stockForm = reactive({
    ywuStock: 'availableStock',
    lowerBound: '',
    upperBound: ''
  });

  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };

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

  // 获取店铺信息
  const storeList = ref([]);
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: props.roleNames,
        orgId: form.orgId,
        salePersonId: form.salesPersonId,
        platCode: props.platCode
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
      roleNames: props.roleNames
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
    form.sellerSkuKey = 'prodSSkuList';
    form.sellerSkuVal = '';
    form.orgId = '';
    form.salesPersonId = '';
    form.storeAcctIdList = [];
    calculate.value.operateType = '=';
    calculate.value.batchStockVal = '';
    getStoreList();
  };

  // 查询列表数据
  const totalCount = ref(0);
  const tableData = ref([]);
  const getBatchGetStockList = async (type) => {
    // 初始查询 type为0
    if (type === 1 && form.sellerSkuVal === '') {
      return ElMessage.warning('请输入SKU！');
    }
    let obj = {};

    // 调整传参
    if (form.sellerSkuKey == 'prodSSkuList') {
      obj.prodSSkuList = form.sellerSkuVal
        ? form.sellerSkuVal.split(',').filter((item) => item.trim() !== '')
        : [];
    } else if (form.sellerSkuKey == 'sellerSkuList') {
      obj.sellerSkuList = form.sellerSkuVal
        ? form.sellerSkuVal.split(',').filter((item) => item.trim() !== '')
        : [];
    } else if (form.sellerSkuKey == 'prodPSkuList') {
      obj.prodPSkuList = form.sellerSkuVal
        ? form.sellerSkuVal.split(',').filter((item) => item.trim() !== '')
        : [];
    }
    delete form.sellerSkuVal;

    // 义乌仓
    obj[stockForm.ywuStock + 'LowerBound'] = stockForm.lowerBound;
    obj[stockForm.ywuStock + 'UpperBound'] = stockForm.upperBound;
    obj.skuStockIncludeWhole = false;

    const productIdsObj = type ? {} : { productIdList: pIdList.value };

    const { data } = await getStockListApi({
      ...form,
      ...obj,
      ...productIdsObj,
      orderByEnum: props.order
    });
    if (data.length) {
      let _data = [];
      data.forEach((item) => {
        if (Array.isArray(item.skuList)) {
          const _skuList = item.skuList.map((elem) => ({
            ...elem,
            sellableQuantityOrigin: elem.skuWarehouseStockList.length
              ? elem.skuWarehouseStockList[0]?.sellableQuantity
              : 0,
            productId: item.productId,
            newJitTotalStock: null
          }));
          _data = _data.concat(_skuList);
        }
      });
      tableData.value = _data?.map((item) => {
        item.newJitTotalStock = '';
        item.result = '';
        item.remark = '';
        return item;
      });
      totalCount.value = tableData.value.length;
    } else {
      tableData.value = [];
    }
  };

  const newSkuStockBatch = ref('');
  const addNewSkuStockBatch = ref('');
  // 根据运算符批量填写
  const BatchWriteFn = () => {
    const { operateType, batchStockVal } = calculate.value;
    if (batchStockVal === 0 || !batchStockVal)
      return ElMessage.warning('请填写数据且不为0！');

    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    checkedList.forEach((item) => {
      // 原值
      let originVal = item.sellableQuantityOrigin;
      item.newJitTotalStock = calculateBasicOperator(
        operateType,
        batchStockVal,
        Number(originVal || 0)
      );
    });
    calculate.value.batchStockVal = '';
    calculate.value.operateType = '=';
  };

  // 点击提交
  const handleSave = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }

    // 去除选中但是没填写新库存的数据
    const existNewStockList = checkedList.filter(
      (item) => ![undefined, null, ''].includes(item.newJitTotalStock)
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
        skuList: itemVal.map((elem) => ({
          skuId: elem.skuId,
          skuWarehouseStockList: [
            {
              warehouseType: elem.skuWarehouseStockList[0].warehouseType,
              warehouseName: elem.skuWarehouseStockList[0].warehouseName,
              warehouseCode: elem.skuWarehouseStockList[0].warehouseCode,
              sellableQuantity: elem.newJitTotalStock
            }
          ]
        }))
      });
    });

    const { data } = await adjustStockBatchApi(params);

    // 渲染操作结果
    tableData.value.forEach((item) => {
      data.forEach((cItem) => {
        if (item.skuId === cItem.skuId) {
          item.result = cItem.success;
          item.remark = cItem.operateType + ' ' + cItem.operateMessage;
        }
      });
    });

    const failList = data.filter((item) => !item.success);
    if (failList.length == 0) {
      ElMessage.success('修改成功');
    }
    needFresh.value = true;
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
  .text-red {
    color: red;
  }
  .flex-wrap {
    flex-wrap: wrap;
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
  .w150 {
    width: 150px;
  }
  .m10 {
    margin: 10px;
  }
  .mr-4 {
    margin-right: 4px;
  }
  .mb-4 {
    margin-top: 4px;
  }
  .range_link {
    margin: 0px 4px;
  }
  .tree_select {
    width: 150px;
  }
</style>
