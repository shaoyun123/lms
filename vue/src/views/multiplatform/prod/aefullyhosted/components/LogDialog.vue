<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="操作日志"
      width="60%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      align-center
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
          <el-form-item label="sku_id" props="skuIdListStr">
            <el-input
              v-model="formInline.skuIdListStr"
              style="width: 180px"
              placeholder="支持多个英文逗号分隔"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <vxe-grid ref="tableRef" v-bind="gridOptions">
          <template #createTime_default="{ row }">
            {{ transferDate(row.createTime) }}
          </template>
          <template #operDesc_default="{ row }">
            <ExpandText :text="row.operDesc" />
          </template>
        </vxe-grid>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="pageInfo.page"
            v-model:page-size="pageInfo.limit"
            :page-sizes="[50, 100, 300]"
            :small="true"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, reactive, watch } from 'vue';
  import {
    getAllOperatorApi,
    getOperateTypeEnumApi,
    searchOnlineLogApi
  } from '@/api/publishs/aefullyhosted';
  import { transferDate } from '@/utils/common';
  import ExpandText from '@/components/ExpandText.vue';
  import { shortcuts } from '@/api/common';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRowList: {
      type: Object,
      default: () => {}
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

  const formInline = reactive({
    time: [],
    operatorIdList: [],
    operType: [],
    skuIdListStr: ''
  });

  const pageInfo = reactive({
    page: 1,
    limit: 50
  });

  const total = ref(0);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        getAllOperatorList();
        getOperateTypeEnum();
        resetForm();
        handleSearch();
      }
    }
  );

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

  // 查询
  const handleSearch = async () => {
    if (formInline.time?.length) {
      [formInline.dateStart, formInline.dateEnd] = formInline.time;
    } else {
      formInline.dateStart = '';
      formInline.dateEnd = '';
    }

    try {
      const { code, data, count } = await searchOnlineLogApi({
        ...formInline,
        ...pageInfo,
        productId: props.checkedRowList[0].productId,
        orderBy: 'create_time desc'
      });
      if (code === '0000') {
        gridOptions.data = data;
        total.value = count;
      }
    } catch (error) {
      console.log('error :>> ', error);
    }
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

  const tableDataLoading = ref(false);

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
    sortConfig: {
      remote: true,
      trigger: 'cell'
    },
    data: [],
    columns: [
      {
        field: 'createTime',
        title: '时间',
        sortable: true,
        slots: { default: 'createTime_default' }
      },
      {
        field: 'creator',
        title: '操作人'
      },
      {
        field: 'sellerSku',
        title: '子sku'
      },
      {
        field: 'operTypeStr',
        title: '事件'
      },
      {
        field: 'origData',
        title: '原值'
      },
      {
        field: 'newData',
        title: '调整值'
      },
      {
        field: 'operDesc',
        title: '结果',
        width: 200,
        slots: { default: 'operDesc_default' }
      }
    ]
  });
  // 分页
  const handleSizeChange = (val) => {
    pageInfo.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    pageInfo.page = val;
    handleSearch();
  };
</script>

<style lang="scss" scoped>
  .operatelog_wrapper {
    .operatelog_text_success {
      color: #67c23a;
    }
    .operatelog_text_error {
      color: #f56c6c;
    }
  }
</style>
