<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="批量下架/删除商品"
      :width="1000"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-card>
        <el-form
          ref="formRef"
          :model="formData"
          :inline="true"
          :rules="formRule"
          class="search_form"
        >
          <el-form-item prop="skuVal">
            <el-select v-model="formData.skuType" class="form_left" filterable>
              <el-option :value="0" label="商品子SKU" />
              <el-option :value="1" label="商品父SKU" />
            </el-select>
            <el-input
              v-model="formData.skuVal"
              clearable
              class="form_right"
              placeholder="精确搜索,支持多个逗号隔开"
              @blur="commonDivideComma($event)"
            />
          </el-form-item>

          <el-form-item label="店铺" prop="storeAcctIdList">
            <ZCascader
              v-model="formData.storeAcctIdList"
              :data="storeTreeList"
            />
          </el-form-item>
          <el-form-item label="商品状态" prop="isSale">
            <el-select v-model="formData.isSale" filterable clearable>
              <el-option :value="true" label="在售" />
              <el-option :value="false" label="停售" />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="handleSearch(formRef)"
            >查询</el-button
          >
          <el-button @click="handleResetForm()">清空</el-button>
        </el-form>
      </el-card>
      <el-card class="list_card">
        <el-tabs v-model="activeName" @tab-click="handleSearch(formRef)">
          <el-tab-pane :label="tabLabel" name="first">
            <vxe-grid ref="tableRef" v-bind="gridOptions"> </vxe-grid>
          </el-tab-pane>
        </el-tabs>
        <div class="common_batch_btns">
          <el-button type="warning" @click="handleBatchDeal(false)">
            批量下架
          </el-button>
          <el-button type="danger" @click="handleBatchDeal(true)">
            批量删除
          </el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script setup>
  //   /* eslint-disable */
  import { computed, onMounted, reactive, ref } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import {
    getIsEnableProductApi,
    batchIsEnableProductApi
  } from '@/api/publishs/darazonlineproduct';
  import { commonDivideComma } from '@/utils/divide';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectRecords: {
      type: Array,
      default: () => []
    },
    storeTreeList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['update:modelValue', 'filterCascader']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const formData = reactive({
    skuType: 0
  });

  onMounted(async () => {
    const idList = [];
    props.selectRecords.forEach((item) => {
      (item.subProducts || []).forEach((v) => {
        idList.push(v.pId);
      });
    });
    const { data, count } = await getIsEnableProductApi({ idList });
    gridOptions.data = data;
    totalCount.value = count;
  });

  // #region 搜索

  const formRef = ref();
  const formRule = ref({
    skuVal: [{ required: true, message: '请输入值' }]
  });
  const handleResetForm = () => {
    formRef.value.resetFields();
    formData.skuType = 0;
  };
  const totalCount = ref(0);
  const activeName = ref('first');
  const tabLabel = computed(() => `总数(${totalCount.value})`);
  const handleSearch = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        const skuListKey = formData.skuType === 0 ? 'sSkuList' : 'pSkuList';
        const params = {
          [skuListKey]: formData.skuVal.split(','),
          storeAcctIdList: formData.storeAcctIdList,
          isSale: formData.isSale
        };
        try {
          const { data, count } = await getIsEnableProductApi(params);
          gridOptions.data = data;
          totalCount.value = count;
        } catch (err) {
          console.log('err :>> ', err);
        }
      }
    });
  };
  // #endregion

  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height: 500,
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
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
        title: '店铺',
        width: 120,
        field: 'storeAcctName'
      },
      {
        title: 'itemid',
        width: 120,
        field: 'itemId'
      },
      {
        title: '商品子SKU',
        width: 120,
        field: 'prodSSku'
      },
      {
        title: '店铺子SKU',
        width: 120,
        field: 'storeSubSku'
      },
      {
        title: '商品状态',
        width: 120,
        field: 'isSale',
        formatter: ({ cellValue }) =>
          cellValue ? '在售' : cellValue === false ? '停售' : ''
      },
      {
        title: '店铺子SKU状态',
        width: 140,
        field: 'status',
        filters: [
          { label: 'Active', value: 'Active' },
          { label: 'InActive', value: 'InActive' },
          { label: 'Pending QC', value: 'Pending QC' },
          { label: 'Suspended', value: 'Suspended' },
          { label: 'Deleted', value: 'Deleted' }
        ]
      },
      {
        title: '操作结果',
        field: 'result'
      }
    ],
    data: [],
    toolbarConfig: {
      custom: false
    }
  });

  // #region 操作 opType:true为删除操作
  const handleBatchDeal = async (opType = false) => {
    const reqs = tableRef.value.getCheckboxRecords();
    if (!reqs.length) return ElMessage.warning('请选择要处理的数据！');
    reqs.forEach((item) => {
      item.result = null;
    });
    try {
      await batchIsEnableProductApi({ reqs, opType });
      ElMessage.success('已进入执行队列');
    } catch (err) {
      reqs.forEach((item) => {
        item.result = '提交队列失败';
      });
      ElMessage.error('提交队列失败');
    }
  };
  // #endregion 操作
</script>

<style lang="scss" scoped></style>
