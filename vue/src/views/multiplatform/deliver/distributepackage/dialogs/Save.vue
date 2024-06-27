<template>
  <el-dialog
    :model-value="saveDialogVisible"
    title="未存框货品"
    width="90%"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div>
      <vxe-toolbar ref="xToolbar" custom print>
        <template #buttons>
          <vxe-button :content="nums"></vxe-button>
        </template>
        <template #tools>
          <vxe-button type="text" class="tool-btn"></vxe-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        ref="xTable"
        border
        height="500"
        show-overflow
        :loading="saveLoading"
        :print-config="{}"
        :data="tableData"
        :column-config="{ resizable: true }"
      >
        <vxe-column type="checkbox" width="40"></vxe-column>
        <vxe-column field="sellerSku" title="货品SKU"></vxe-column>
        <vxe-column field="prodSSku" title="商品SKU"></vxe-column>
        <vxe-column field="locationCode" title="库位" sortable></vxe-column>
        <vxe-column field="actQuantity" title="数量"></vxe-column>
        <vxe-column field="packStatus" title="框号">
          <template #default="{ row }">
            <span>{{ row.shipmentInfo && row.shipmentInfo.frameCode }}</span>
          </template>
        </vxe-column>
        <vxe-column field="platOrderId" title="货件号">
          <template #default="{ row }">
            <span>{{
              row.shipmentInfo ? row.shipmentInfo.platOrderId : ''
            }}</span>
          </template>
        </vxe-column>
        <vxe-column field="packer" title="配货人"></vxe-column>
        <vxe-column field="salerRemark" title="销售备注" />
        <vxe-column field="packTime" title="配货时间">
          <template #default="{ row }">
            <span>{{ transferDate(row.packTime || '') }}</span>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-pager
        v-model:current-page="tablePage.currentPage"
        v-model:page-size="tablePage.pageSize"
        background
        :layouts="[
          'Sizes',
          'PrevJump',
          'PrevPage',
          'Number',
          'NextPage',
          'NextJump',
          'FullJump',
          'Total'
        ]"
        :page-sizes="[50, 100]"
        :total="tablePage.total"
        @page-change="handlePageChange"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineEmits, ref, nextTick, onMounted, reactive } from 'vue';
  import { transferDate } from '@/utils/common';
  import { queryUnSaveGoods } from '@/api/multiplatform/distributepackage';

  let saveData = ref([]);
  let saveLoading = ref(false);
  let nums = ref('');
  let tableData = ref([]);
  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 100
  });
  const getData = async () => {
    try {
      saveLoading.value = true;
      let unSaveGood = await queryUnSaveGoods();
      saveLoading.value = false;
      saveData.value = unSaveGood.data;
      tablePage.total = unSaveGood.data.length;
      nums.value = `数量:${unSaveGood.data.length}`;
      tableData.value = saveData.value.slice(0, 100);
      //传参给组件
    } catch (err) {
      console.error('未存框取货', err);
    }
  };
  onMounted(getData);

  //分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
    //渲染表格
    let startItem = (currentPage - 1) * pageSize;
    let endItem = currentPage * pageSize;
    tableData.value = saveData.value.slice(startItem, endItem);
  };

  let saveDialogVisible = ref(false);
  //关闭的点击事件
  //实例化defineEmits
  const emits = defineEmits(['update:modelValue']);
  const handleClose = () => {
    emits('update:modelValue', false);
  };
  // 将表格和工具栏进行关联
  let xTable = ref(null);
  let xToolbar = ref(null);
  nextTick(() => {
    const $table = xTable.value;
    const $toolbar = xToolbar.value;
    $table.connect($toolbar);
  });
</script>

<style lang="scss" scoped></style>
