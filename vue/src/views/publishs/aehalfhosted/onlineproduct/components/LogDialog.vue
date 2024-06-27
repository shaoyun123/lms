<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="操作日志"
      width="60%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @close="resetForm"
    >
      <div v-loading="tableDataLoading">
        <el-form
          ref="formRef"
          :inline="true"
          :model="formInline"
          class="dialog_form"
        >
          <el-form-item label="时间" props="dateStart">
            <el-date-picker
              v-model="formInline.time"
              type="datetimerange"
              value-format="x"
              :shortcuts="shortcuts"
              range-separator="-"
              :default-time="['2023-10-11 00:00:00', '2023-10-11 23:59:59']"
            />
          </el-form-item>
          <el-form-item label="操作人" props="operatorIdList">
            <el-select
              v-model="formInline.operatorIdList"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              clearable
            >
              <el-option
                v-for="item in allOperatorList"
                :key="item?.id"
                :label="item?.userName"
                :value="item?.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作类型" props="operType">
            <el-select
              v-model="formInline.operType"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              clearable
            >
              <el-option
                v-for="item in operateTypeEnum"
                :key="item?.id"
                :label="item?.title"
                :value="item?.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeKey === 1"
            label="sku_id"
            props="skuIdListStr"
          >
            <el-input
              v-model="formInline.skuIdListStr"
              style="width: 180px"
              placeholder="支持多个英文逗号分隔"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAEHalfLogList">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <vxe-grid ref="tableRef" v-bind="gridOptions">
          <template #createTime_default="{ row }">
            {{ transferDate(row.createTime) }}
          </template>
          <template #handle_log="{ row }">
            {{ row.operTypeName }}: {{ row.origData }} ->
            {{ row.newData }}
          </template>

          <template #handle_result="{ row }">
            <div>
              <span :class="getOperResultClass(row.operResult)" class="mr-4">{{
                getOperResult(row.operResult)
              }}</span>
              <span v-if="row.operDesc">原因: {{ row.operDesc }}</span>
            </div>
          </template>
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
              :page-sizes="[50, 100, 200]"
              :total="totalCount"
              @page-change="handlePageChange"
            >
            </vxe-pager>
          </template>
        </vxe-grid>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, reactive, watch } from 'vue';
  import {
    getAEHalfLogApi,
    getAllOperatorApi,
    getOperateTypeEnumApi
  } from '@/api/publishs/aehalfhosted';
  import { transferDate } from '@/utils/common';
  import { shortcuts } from '@/api/common';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRowList: {
      type: Object,
      default: () => {}
    },
    activeKey: {
      type: Number,
      default: () => 1
    }
  });

  const emits = defineEmits(['update:modelValue']);

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
      if (val) {
        initColumns();
        getAllOperatorList();
        getOperateTypeEnum();
        resetForm();
        getAEHalfLogList();
      }
    }
  );

  const formInline = reactive({
    time: [],
    operatorIdList: [],
    operType: [],
    skuIdListStr: ''
  });

  const formData = reactive({
    page: 1,
    limit: 50
  });

  // 查询操作人
  const allOperatorList = ref([]);
  const getAllOperatorList = async () => {
    const { data } = await getAllOperatorApi();
    allOperatorList.value = data;
  };

  // 查询操作类型
  const operateTypeEnum = ref([]);
  const getOperateTypeEnum = async () => {
    const { data } = await getOperateTypeEnumApi();
    operateTypeEnum.value = Object.entries(data).map(([id, title]) => ({
      id,
      title
    }));
  };

  const formRef = ref(null);
  const resetForm = () => {
    formInline.time = [];
    formInline.operatorIdList = [];
    formInline.operType = [];
    formInline.skuIdListStr = '';
    formInline.dateStart = '';
    formInline.dateEnd = '';
  };

  const tableRef = ref();
  const totalCount = ref(0);

  const tableDataLoading = ref(false);

  const allColumns = reactive([
    {
      field: 'createTime',
      title: '时间',
      sortable: true,
      width: 145,
      slots: { default: 'createTime_default' }
    },
    {
      field: 'creator',
      title: '操作人'
    },
    {
      field: 'productId',
      title: '商品ID'
    },
    {
      field: 'skuId',
      title: 'sku_id'
    },
    {
      field: 'storeSSku',
      title: '店铺子SKU'
    },
    {
      field: 'newData',
      title: '日志',
      width: 150,
      slots: { default: 'handle_log' }
    },
    {
      field: 'operDesc',
      title: '结果',
      width: 200,
      slots: { default: 'handle_result' }
    }
  ]);

  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    showOverflow: true,
    keepSource: true,
    height: 600,
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    toolbarConfig: {
      custom: true // 显示自定义列按钮
    },
    columns: [],
    data: []
  });

  // 根据不同tab展示不同表格列
  const initColumns = () => {
    const oneNoShowKeys = ['skuId', 'storeSSku'];
    gridOptions.columns = allColumns;
    if (props.activeKey === 3) {
      gridOptions.columns = filterColumns(oneNoShowKeys);
    }
  };

  const filterColumns = (noShowKeys) => {
    return allColumns.filter((item) => !noShowKeys.includes(item.field));
  };

  const getAEHalfLogList = async () => {
    if (formInline.time?.length) {
      [formInline.dateStart, formInline.dateEnd] = formInline.time;
    } else {
      formInline.dateStart = '';
      formInline.dateEnd = '';
    }
    const { data } = await getAEHalfLogApi({
      storeAcctId: props.checkedRowList[0].storeAcctId,
      productId: props.checkedRowList[0].productId,
      pageNum: formData.page,
      pageSize: formData.limit,
      ...formInline
    });
    gridOptions.data = data.list;
    totalCount.value = data.total;
  };

  // 表格分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    formData.page = currentPage;
    formData.limit = pageSize;
    getAEHalfLogList();
  };

  const getOperResult = (res) => {
    if (res === 1) {
      return '初始化';
    }
    if (res === 2) {
      return '执行中';
    }
    if (res === 3) {
      return '成功';
    }
    if (res === 4) {
      return '失败';
    }
  };

  const getOperResultClass = (res) => {
    if (res === 1) {
      return '';
    }
    if (res === 2) {
      return '';
    }
    if (res === 3) {
      return 'success';
    }
    if (res === 4) {
      return 'fail';
    }
  };
</script>

<style lang="scss" scoped>
  .mr-4 {
    margin-right: 4px;
  }

  .success {
    color: #67c23a;
  }
  .fail {
    color: #f56c6c;
  }
</style>
