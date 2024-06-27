<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formDataRef"
        :model="formData"
        class="search_form"
        :inline="true"
      >
        <el-form-item label="钉钉用户名" prop="dingTalkName">
          <el-input v-model="formData.dingTalkName" clearable />
        </el-form-item>
        <el-form-item label="OA用户名" prop="sysUserName">
          <el-input v-model="formData.sysUserName" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(formRef)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list_card">
      <!-- 数据列表展示 -->
      <vxe-table
        ref="tableDataRef"
        :height="height"
        :data="tableData"
        border
        show-overflow
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column field="name" title="钉钉用户名" />
        <vxe-column field="deptName" title="钉钉所属部门" width="400" />
        <vxe-column field="title" title="职位" />
        <vxe-column field="mobile" title="手机号" />
        <vxe-column field="sysUserName" title="关联OA用户名" />
        <vxe-column field="orgName" title="OA部门" />
        <vxe-column field="extension" title="在职/离职状态" />
        <vxe-column field="hiredDate" title="入职时间">
          <template #default="{ row }">
            {{ row.hiredDate ? transferDate(row.hiredDate, false) : '' }}
          </template>
        </vxe-column>
        <vxe-column title="操作" width="100">
          <template #default="{ row }">
            <el-button
              v-permission="['ddaccountUpdateBtn']"
              type="primary"
              @click="handleUpdate(row)"
              >修改</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </el-card>
    <UpdateDialog
      v-model="updateVisible"
      :account-info="curAccountInfo"
      @handle-search="handleSearch"
    />
  </div>
</template>

<script setup name="configurestaffddaccount">
  import { ref, computed } from 'vue';
  import UpdateDialog from './components/UpdateDialog.vue';
  import { queryListApi } from '@/api/configure/ddaccount';
  import { transferDate } from '@/utils/common';

  const formDataRef = ref();
  const formData = ref({ dingTalkName: null, sysUserName: null });
  const tableDataRef = ref();
  const tableData = ref();
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 128;
  });
  const tableDataLoading = ref(false);
  const handleSearch = async () => {
    tableDataLoading.value = true;
    try {
      const { data } = await queryListApi({ ...formData.value });
      tableData.value = data;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };
  const updateVisible = ref(false);
  const curAccountInfo = ref({});
  const handleUpdate = (row) => {
    updateVisible.value = true;
    curAccountInfo.value = row;
  };
</script>

<style lang="scss" scoped></style>
