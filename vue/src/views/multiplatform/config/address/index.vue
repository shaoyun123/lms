<!-- 收货地址 -->
<template>
  <div class="address_container app-container">
    <el-card class="common_split_bottom search_card">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-form-item label="地址简称">
          <el-input v-model="formData.alias" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="common_split_bottom list_card">
      <div class="header_container">
        <div></div>
        <div>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </div>
      <div>
        <vxe-table
          v-loading="loading"
          border
          :max-height="height"
          align="center"
          :data="tableData"
          :scroll-y="{ gt: 25 }"
          show-overflow
          :row-config="{ isCurrent: true, isHover: true }"
        >
          <vxe-column field="alias" title="地址简称"></vxe-column>
          <vxe-column field="platCode" title="平台"></vxe-column>
          <vxe-column field="receivor" title="收件人"></vxe-column>
          <vxe-column field="phoneNumber" title="电话/手机"></vxe-column>
          <vxe-column field="detail" title="详细地址"></vxe-column>
          <vxe-column title="操作">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleUpdate(row)"
                >修改</el-button
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
      </div>
    </el-card>
    <edit-dialog
      v-model="editVisible"
      :row-data="rowData"
      @on-search="onSearch"
      @change-data="changeData"
    />
  </div>
</template>

<script setup name="multiplatformconfigaddress">
  import { reactive, ref, computed } from 'vue';
  import EditDialog from './components/EditDialog.vue';
  import { queryPage } from '@/api/multiplatform/address';

  const formData = reactive({
    alias: ''
  });
  const loading = ref(false);
  const tableData = ref([]);
  const editVisible = ref(false);
  const rowData = ref({});
  const paginationData = reactive({
    page: 1,
    limit: 50,
    total: 0
  });

  const onSearch = async () => {
    loading.value = true;
    try {
      loading.value = false;
      const { page, limit } = paginationData;
      const { data } = await queryPage({ page, limit, ...formData });
      tableData.value = data.list;
      paginationData.total = data.total;
    } catch (err) {
      loading.value = false;
      console.log('err :>> ', err);
    }
  };
  const handleAdd = () => {
    editVisible.value = true;
    rowData.value = {};
  };
  const handleUpdate = (row) => {
    editVisible.value = true;
    rowData.value = row;
  };

  const changeData = (updateObj) => {
    Object.assign(rowData.value, updateObj);
  };
  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    onSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    onSearch();
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 157;
  });
</script>

<style lang="scss" scoped>
  .address_container {
    .header_container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
</style>
