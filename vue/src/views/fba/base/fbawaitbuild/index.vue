<template>
  <div>
    <el-card class="card_position list_card">
      <div>
        <div
          class="ope_tool"
          style="
            width: 100%;
            margin-bottom: 10px;
            display: flex;
            justify-content: flex-end;
          "
        >
          <el-button
            v-permission="['fbaBaseCreateBuild']"
            type="primary"
            @click="createWaitBuildDialog()"
            >新建待建框</el-button
          >
        </div>
        <vxe-table
          v-loading="loading"
          :data="tableData"
          :height="height"
          :show-overflow="true"
          :scroll-y="{ gt: 10 }"
          border
        >
          <vxe-column field="frameNo" title="待建框号" />
          <vxe-column field="storeAcct" title="绑定店铺" />
          <vxe-column field="salesSite" title="绑定站点" />
          <vxe-column title="备注" field="remark"></vxe-column>
          <vxe-column title="绑定人" field="creator"></vxe-column>

          <vxe-column title="绑定时间">
            <template #default="{ row }">
              <div>{{ transferDate(row.createTime) }}</div>
            </template>
          </vxe-column>

          <vxe-column title="操作" width="180">
            <template #default="{ row }">
              <el-button type="primary" @click="updateWaitBuildDialog(row)"
                >修改</el-button
              >
              <el-button type="primary" @click="handlePrint(row)"
                >打印</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </el-card>
  </div>

  <el-dialog
    :model-value="showDialog"
    width="500"
    class="detail-dialog"
    :title="title"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div>
      <el-form :model="formData" :label-width="90" size="default">
        <el-form-item label="待建框号">
          <el-input
            v-model="formData.frameNo"
            style="width: 210px"
            :readonly="action === 'update' ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item label="绑定店铺">
          <el-select
            v-model="formData.storeAcctId"
            filterable
            style="width: 210px"
          >
            <el-option
              v-for="(item, index) in storeList"
              :key="index"
              :label="item.storeAcct"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定站点">
          <el-select v-model="formData.salesSite" style="width: 210px">
            <el-option
              v-for="(item, index) in siteList"
              :key="index"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="formData.remark" style="width: 210px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button
        v-if="action === 'create'"
        type="primary"
        @click="handleCreateAndPrint(formRef)"
        >新增并打印</el-button
      >
      <el-button
        v-if="action === 'create'"
        type="primary"
        @click="handleAddWaitBuild(formRef)"
        >仅新增</el-button
      >
      <el-button
        v-if="action === 'update'"
        type="primary"
        @click="handleEditWaitBuild(formRef)"
        >保存</el-button
      >
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { transferDate } from '@/utils/common';
  import {
    getWaitBuild,
    addWaitBuild,
    updateWaitBuild,
    getStoreListApi
  } from '@/api/fba/combination';
  import { getSiteListApi } from '@/api/common/index';
  import { ElMessage } from 'element-plus';
  import { epeanPrint_plugin_fun } from '@/utils/print';

  const showDialog = ref(false);

  const formData = reactive({
    id: '',
    frameNo: '',
    storeAcctId: '',
    salesSite: '',
    storeAcct: '',
    remark: ''
  });

  const queryForm = reactive({
    page: 1,
    limit: 50
  });

  onMounted(() => {
    getWaitBuildList();
    getSiteList();
    getStoreList();
  });

  // 获取平台站点
  const siteList = ref([]);
  const getSiteList = async () => {
    try {
      const { code, data } = await getSiteListApi('amazon');
      if (code === '0000') {
        siteList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const storeList = ref([]);
  const getStoreList = async () => {
    try {
      const { code, data } = await getStoreListApi();
      if (code === '0000') {
        storeList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const tableData = ref([]);
  // 获取待建框数据
  const loading = ref(false);
  const getWaitBuildList = async () => {
    try {
      loading.value = true;
      let params = {
        frameNo: '',
        storeAcctId: '',
        salesSite: '',
        remark: ''
      };
      const { code, data } = await getWaitBuild({ ...params, ...queryForm });
      if (code === '0000') {
        console.log('data', data);
        tableData.value = data || [];
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };
  const title = ref('新建待建框');
  const action = ref('');
  const createWaitBuildDialog = () => {
    // 新建待建框
    title.value = '新建待建框';
    showDialog.value = true;
    action.value = 'create';

    formData.frameNo = '';
    formData.storeAcctId = '';
    formData.salesSite = '';
    formData.remark = '';
  };

  const updateWaitBuildDialog = (row) => {
    // 新建待建框
    title.value = '修改待建框';
    showDialog.value = true;
    action.value = 'update';
    formData.id = row.id;
    formData.frameNo = row.frameNo;
    formData.storeAcctId = row.storeAcctId;
    formData.salesSite = row.salesSite;
    formData.remark = row.remark;
  };

  // 新建
  const handleAddWaitBuild = async () => {
    let params = {
      frameNo: formData.frameNo,
      storeAcctId: formData.storeAcctId,
      storeAcct: '',
      salesSite: formData.salesSite,
      remark: formData.remark
    };

    storeList.value.forEach((item) => {
      if (item.id === params.storeAcctId) {
        params.storeAcct = item.storeAcct;
        formData.storeAcct = item.storeAcct;
      }
    });
    try {
      const { code } = await addWaitBuild(params);
      if (code === '0000') {
        ElMessage.success('新建成功！');
        showDialog.value = false;
        getWaitBuildList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 新增并打印
  const handleCreateAndPrint = () => {
    handleAddWaitBuild();
    let params = {
      frameNo: formData.frameNo,
      storeAcct: formData.storeAcct,
      salesSite: formData.salesSite
    };
    handlePrint(params);
  };

  // 修改
  const handleEditWaitBuild = async () => {
    try {
      const { code } = await updateWaitBuild(formData);
      if (code === '0000') {
        ElMessage.success('修改成功！');
        showDialog.value = false;
        getWaitBuildList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrint = (item) => {
    let printDetailDtoList = [];
    let obj = {
      titleMap: {
        frameNo: item.frameNo,
        storeAcct: item.storeAcct,
        salesSite: item.salesSite
      }
    };
    printDetailDtoList.push(obj);
    let printObj10040 = {
      printerName: 10040,
      jspaper: 'waitingFrameNo.jasper',
      printDetailDtoList
    };
    epeanPrint_plugin_fun(99, printObj10040);
  };

  const handleClose = () => {
    showDialog.value = false;
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 110;
  });
</script>

<style lang="scss" scoped></style>
