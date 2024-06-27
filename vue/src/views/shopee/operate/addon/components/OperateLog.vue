<template>
  <div class="operatelog_wrapper">
    <el-dialog
      v-model="dialogVisible"
      title="操作日志"
      :width="900"
      :close-on-click-modal="false"
    >
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="600"
        border
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column field="addOnDealId" title="导入时间"
          ><template #default="{ row }">
            {{ transferDate(row.createDate) }}
          </template></vxe-column
        >
        <vxe-column
          field="importTypeStr"
          title="导入类型"
          :width="70"
        ></vxe-column>
        <vxe-column field="promotionType" title="优惠类型"></vxe-column>
        <vxe-column field="mainProducts" title="主商品">
          <template #default="{ row }">
            <span class="operatelog_text_error">{{
              row.failedMainItemCount || 0
            }}</span
            >个不成功，
            <span class="operatelog_text_success">{{
              row.addMainItemSuccessCount || 0
            }}</span
            >个成功
          </template>
        </vxe-column>
        <vxe-column field="byproducts" title="副商品">
          <template #default="{ row }">
            <span class="operatelog_text_error">{{
              row.failedSubItemCount || 0
            }}</span
            >个不成功，
            <span class="operatelog_text_success">{{
              row.addSubItemSuccessCount || 0
            }}</span
            >个成功
          </template>
        </vxe-column>
        <vxe-column field="result" title="操作结果">
          <template #default="{ row }">
            <span class="operatelog_text_error">{{
              row.failActivitiesNum || 0
            }}</span
            >个不成功，
            <span class="operatelog_text_success">{{
              row.createSuccessCount || 0
            }}</span
            >个成功
          </template>
        </vxe-column>
        <vxe-column field="creator" title="操作人" :width="80"> </vxe-column>
        <vxe-column field="autoRenew" title="结果文件" :width="150">
          <template #default="{ row }">
            <el-link
              v-loading="row.downloadLoading"
              type="primary"
              @click="handleDownloadLog(row)"
              >{{ row.oldFileName }}</el-link
            >
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[50, 100, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, reactive, watch, computed } from 'vue';
  import { viewLogListApi } from '@/api/shopee/addon';
  import { transferDate } from '@/utils/common';
  import { transBlob } from '@/utils/downloadFile';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const tableData = ref([]);
  const tableRef = ref();
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });
  const tableDataLoading = ref(false);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleSearch();
      }
    }
  );

  const handleSearch = async () => {
    const { page, limit } = paginationData;
    try {
      tableDataLoading.value = true;
      const { data, count } = await viewLogListApi(page, limit);
      tableData.value = data.map((item) => ({
        ...item,
        downloadLoading: false
      }));
      paginationData.total = count;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };
  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleSearch();
  };

  const handleDownloadLog = (row) => {
    row.downloadLoading = true;
    transBlob(
      {
        url: `/lms/shopee/addOneDeal/downloadLog?filePath=${row.filePath}&oldFileName=${row.oldFileName}`,
        fileName: row.oldFileName
      },
      'get'
    )
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        row.downloadLoading = false;
      });
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
