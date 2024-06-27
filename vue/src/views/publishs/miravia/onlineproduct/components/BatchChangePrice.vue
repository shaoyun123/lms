<template>
  <el-dialog
    v-model="dialogVisible"
    width="50%"
    align-center
    title="批量调价"
    @close="handleClose"
  >
    <div class="content">
      <div class="flex justify-between">
        <el-form
          ref="formRef"
          :model="formData"
          :inline="true"
          :label-width="60"
        >
          <el-form-item label="sku编号" prop="storeSSkuStr">
            <el-input
              v-model="formData.storeSSkuStr"
              placeholder="多个以逗号分隔"
              clearable
            />
          </el-form-item>
          <el-form-item label="店铺" prop="storeAcctIdList">
            <el-select
              v-model="formData.storeAcctIdList"
              placeholder="请选择"
              clearable
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              style="width: 150px"
            >
              <el-option
                v-for="item in storeOption"
                :key="item.id"
                :label="item.storeAcct"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
            <el-button @click="resetForm">清空</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submit">提交修改</el-button>
      </div>
      <div class="flex justify-between mt-4">
        <div>
          <span>毛利率</span>
          <ZInputNumber
            v-model="formData.grossProfitRate"
            :min="0"
            :max="1"
            :precision="2"
            style="width: 50%; padding: 0 18px"
          />
          <el-button type="primary" @click="queryList">应用</el-button>
        </div>
        <div class="flex-1 flex justify-end">
          <el-select v-model="saleType" style="width: 20%" clearable filterable>
            <el-option :value="0" label="零售价" />
            <el-option :value="1" label="促销价" />
          </el-select>
          <el-select
            v-model="operator"
            style="width: 10%"
            filterable
            clearable
            class="middle_search_item"
          >
            <el-option value="+" label="+" />
            <el-option value="-" label="-" />
            <el-option value="*" label="*" />
            <el-option value="=" label="=" />
          </el-select>
          <el-input
            v-model="tempParams"
            placeholder="请输入"
            style="width: 25%; padding: 0 5px"
            clearable
          />
          <el-dropdown>
            <el-button type="primary">
              应用至<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="changeNum(0)"
                  >新零售价</el-dropdown-item
                >
                <el-dropdown-item @click="changeNum(1)"
                  >新促销价</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <vxe-grid v-bind="gridOptions" ref="tableRef" class="mt-4">
        <template #new_retail_price="{ row }">
          <div>
            <ZInputNumber
              v-model="row.newSkuPrice"
              placeholder="请输入"
              :min="0"
              :precision="2"
            />
          </div>
        </template>
        <template #new_promotion_price="{ row }">
          <div>
            <ZInputNumber
              v-model="row.newSkuDiscountPrice"
              placeholder="请输入"
              :min="0"
              :precision="2"
            />
          </div>
        </template>
        <template #change_price_result="{ row }">{{
          row.operatingResult
        }}</template>
        <!-- 分页 -->
        <template #pager>
          <vxe-pager
            v-model:current-page="formData.page"
            v-model:page-size="formData.limit"
            :layouts="[
              'Sizes',
              'PrevPage',
              'Number',
              'NextPage',
              'FullJump',
              'Total'
            ]"
            :page-sizes="[100, 300, 500, 1000]"
            :total="total"
            @page-change="handlePageChange"
          >
          </vxe-pager>
        </template>
      </vxe-grid>
    </div>
  </el-dialog>
</template>

<script setup>
  import { computed, watch, onMounted, ref, reactive } from 'vue';
  import { getStoreInfo } from '@/api/eBay/payments';
  import {
    batchModifyPriceQuery,
    batchModifyPriceSubmit,
    getAdjustPriceLogByBatchNo
  } from '@/api/publishs/miraviaonline';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectedIdList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue']);

  const formData = reactive({
    storeSSkuStr: '', // sku编号
    storeAcctIdList: [], // 店铺id
    page: 1,
    limit: 100,
    total: 0,
    grossProfitRate: null // 毛利率
  });

  const total = ref(null);
  const operator = ref('+'); // 计算（加减乘等于）
  const saleType = ref(0); // 选择零售价0 促销价1
  const tempParams = ref(null); // 要加减乘等于的参数

  onMounted(() => {
    getStoreList();
  });

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (!val) {
        // 默认 零售价 +
        saleType.value = 0;
        operator.value = '+';
        tempParams.value = null;
        resetForm();
        handleClose();
      } else {
        queryList();
      }
    }
  );

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 280;
  });

  const tableLoading = ref(false);

  const gridOptions = reactive({
    border: true,
    showOverflow: true,
    loading: tableLoading,
    height: height,
    scrollY: {
      gt: 20
    },
    rowConfig: {
      isHoverRow: true
    },
    columnConfig: {
      resizable: true
    },
    columns: [
      { type: 'checkbox', width: 43 },
      {
        field: 'productId',
        title: '商品id'
      },
      {
        field: 'storeSSku',
        title: 'SKU编号'
      },
      {
        field: 'skuProperty',
        title: 'SKU属性'
      },
      {
        field: 'skuPrice',
        title: '零售价'
      },
      {
        field: 'skuDiscountPrice',
        title: '促销价'
      },
      {
        field: 'grossProfitRate',
        title: '毛利率'
      },
      {
        title: '新零售价',
        width: 100,
        slots: {
          default: 'new_retail_price'
        }
      },
      {
        title: '新促销价',
        width: 100,
        slots: {
          default: 'new_promotion_price'
        }
      },
      {
        title: '改价结果',
        width: 120,
        slots: {
          default: 'change_price_result'
        }
      }
    ],
    data: []
  });

  // 获取店铺信息
  const storeOption = ref([]);
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'miravia专员',
        orgId: '',
        salePersonId: '',
        platCode: 'miravia'
      };
      const { data } = await getStoreInfo(params);
      storeOption.value = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 表格分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    formData.page = currentPage;
    formData.limit = pageSize;
    queryList();
  };

  // 列表查询
  const queryList = async () => {
    tableLoading.value = true;
    const { count, data } = await batchModifyPriceQuery({
      selectedIdList: props.selectedIdList,
      ...formData
    }).finally(() => (tableLoading.value = false));
    total.value = count;
    gridOptions.data = data.map((item) => {
      item.operatingResult = '';
      return item;
    });
  };

  // 校验是否勾选了数据
  const tableRef = ref(null);
  const checkedList = ref([]);
  const isSelected = () => {
    checkedList.value = tableRef.value.getCheckboxRecords();
    if (!checkedList.value.length) {
      return false;
    } else {
      return true;
    }
  };

  // 点击应用至 校验
  const checkoutFn = () => {
    if (!isSelected()) return ElMessage.warning('请选择数据！');
    if (saleType.value === null || saleType.value === '') {
      return ElMessage.warning('请选择零售价还是促销价！');
    }
    if (tempParams.value === null || tempParams.value === '') {
      return ElMessage.warning('请填写要参与运算的数值！');
    }
    if (operator.value === '') {
      return ElMessage.warning('请选择运算方式！');
    }
  };

  // 应用于
  const changeNum = (newSaleTypeIndex) => {
    checkoutFn();
    const saleTypeList = ['skuPrice', 'skuDiscountPrice'];
    const newSaleTypeList = ['newSkuPrice', 'newSkuDiscountPrice'];
    const sale = saleTypeList[saleType.value];
    const newSaleType = newSaleTypeList[newSaleTypeIndex];

    if (operator.value === '+') {
      checkedList.value.forEach((item) => {
        item[newSaleType] = (
          Number(item[sale]) + Number(tempParams.value)
        ).toFixed(2);
      });
    }
    if (operator.value === '-') {
      checkedList.value.forEach((item) => {
        item[newSaleType] = (
          Number(item[sale]) - Number(tempParams.value)
        ).toFixed(2);
      });
    }
    if (operator.value === '*') {
      checkedList.value.forEach((item) => {
        item[newSaleType] = (
          Number(item[sale]) * Number(tempParams.value)
        ).toFixed(2);
      });
    }
    if (operator.value === '=') {
      checkedList.value.forEach((item) => {
        item[newSaleType] = Number(tempParams.value).toFixed(2);
      });
    }
  };

  // 查询操作结果
  const getOperatingResult = async (batchNo) => {
    const res = await getAdjustPriceLogByBatchNo(batchNo);
    const resDataKeys = res.data ? Object.keys(res.data) : [];

    checkedList.value = checkedList.value.map((item) => {
      let operatingResult = res.msg;
      if (resDataKeys.length && resDataKeys.includes(item.skuId)) {
        operatingResult = res.data[item.skuId];
      }
      item.operatingResult = operatingResult;
      return item;
    });
  };

  // 检测勾选数据是否都填写了新零售价、新促销价
  const verifyFun = (list) => {
    const result = list.filter(
      (item) => !item.newSkuPrice || !item.newSkuDiscountPrice
    );
    return result.length === 0;
  };

  // 提交
  const submit = async () => {
    if (!isSelected()) return ElMessage.warning('请选择数据！');
    if (!verifyFun(checkedList.value))
      return ElMessage.warning('所有勾选的数据新零售价和新促销价必须都有值！');

    const tableData = checkedList.value.map((item) => {
      return {
        productId: item.productId,
        skuId: item.skuId,
        id: item.id,
        skuPrice: item.newSkuPrice,
        skuDiscountPrice: item.newSkuDiscountPrice,
        storeAcctId: item.storeAcctId
      };
    });
    const { data, msg } = await batchModifyPriceSubmit(tableData);
    ElMessage.success(msg);
    getOperatingResult(data);
  };

  // 清空表单
  const resetForm = () => {
    formData.storeSSkuStr = '';
    formData.storeAcctIdList = [];
    formData.grossProfitRate = null;
  };

  const handleClose = () => {
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  .content {
    padding: 2px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .justify-end {
    justify-content: end;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-end {
    justify-content: end;
  }
  .flex-1 {
    flex: 1;
  }
  .mt-4 {
    margin-top: 16px;
  }
</style>
