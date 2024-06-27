<template>
  <el-dialog
    v-model="showExport"
    :title="`执行日志 - 共 ${tableData && tableData.length} 条`"
    width="60%"
    class="roll-dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <vxe-table
      ref="tableDataRef"
      v-loading="tableDataLoading"
      :data="tableData"
      :height="500"
      :align="'center'"
      border
    >
      <vxe-column field="ruleName" title="规则名称" />
      <vxe-column field="ruleDetail" title="删除条件" />
      <vxe-column field="batchNo" title="执行时间">
        <template #default="{ row }">
          {{ transferDate(row.batchNo * 1) }}
        </template>
      </vxe-column>
      <vxe-column field="successCount" title="删除成功数量" />
      <vxe-column field="failCount" title="删除失败数量" />
      <vxe-column title="失败日志"
        ><template #default="{ row }"
          ><el-button
            type="primary"
            style="margin-right: 12px"
            @click="exportData(row.batchNo)"
          >
            导出
          </el-button></template
        >
      </vxe-column>
    </vxe-table>
    <!-- <div class="pagination">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        background
        :page-sizes="[50, 100, 200]"
        layout="prev, pager, next,sizes, total"
        :total="total"
        :small="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
  </el-dialog>
</template>
<script setup>
  import { ref, computed, onMounted, toRefs } from 'vue';
  import { getLogs } from '@/api/lazada/deletetask';
  import axios from 'axios';
  import { transferDate } from '@/utils/common';
  // const currentPage = ref(1);
  // const pageSize = ref(50);
  // const total = ref(0);
  // // 设置每页count
  // const handleSizeChange = (val) => {
  //   pageSize.value = val;
  //   // onSubmit();
  // };
  // // 上一页下一页
  // const handleCurrentChange = (val) => {
  //   currentPage.value = val;
  //   // onSubmit();
  // };

  const props = defineProps({
    // 是否显示弹窗
    isVisible: {
      type: Boolean,
      default: false
    },
    ruleId: {
      type: Number,
      default: -1
    }
  });
  const { ruleId } = toRefs(props);
  const showExport = computed(() => {
    return props.isVisible;
  });

  const emits = defineEmits(['close', 'submit']);
  const handleClose = () => {
    emits('close');
  };

  onMounted(async () => {
    // 查询
    onSubmit();
  });
  // 查询
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  const onSubmit = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    let { code, data } = await getLogs(ruleId.value);
    if (code == '0000') {
      tableData.value = data;
    }
    tableDataLoading.value = false;
  };
  // 导出
  const exportData = async (batchNo) => {
    axios({
      method: 'POST',
      url: '/api/lms/deleteTaskManage/exportLogs?batchNo=' + batchNo,
      responseType: 'blob',
      dataType: 'json'
    }).then((res) => {
      const xlsx = 'application/vnd.ms-excel';
      const blob = new Blob([res.data], { type: xlsx }); //转换数据类型
      const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
      a.download = 'lazada删除任务执行日志.xlsx';
      a.href = window.URL.createObjectURL(blob);
      a.click();
      a.remove();
    });
  };
</script>
