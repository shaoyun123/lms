<template>
  <div v-loading="pageLoading" class="prefer_setting app-container">
    <!-- 数据筛选 start -->
    <el-card class="common_split_bottom search_card">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-form-item label="配置状态">
          <el-select v-model="formData.exist" clearable>
            <el-option value="0" label="未配置"></el-option>
            <el-option value="1" label="已配置"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getStoreData()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据筛选 end -->

    <!-- 数据列表 start -->
    <el-card class="common_split_bottom list_card">
      <div class="mt10 tool_btns">
        <el-button type="primary" @click="handleSave('multi', row)"
          >批量保存</el-button
        >
        <el-button type="primary" @click="handleSync('multi', row)"
          >批量同步</el-button
        >
      </div>
      <div class="mt10">
        <vxe-table
          ref="preferTable"
          v-loading="loading"
          :data="settingList"
          :height="height"
          show-overflow
          :checkbox-config="{ checkField: 'checked' }"
          :scroll-y="{ enabled: true }"
          border
        >
          <vxe-column type="checkbox" width="80" />
          <vxe-column
            title="店铺"
            field="storeAcct"
            max-width="300"
          ></vxe-column>
          <vxe-column title="发货地址" min-width="320">
            <template #default="{ row }">
              <el-select
                v-model="row.addressName"
                style="width: 150px"
                @change="changeAddress"
              >
                <el-option
                  v-for="item in row.addressPreferenceList"
                  :key="item"
                  :label="item.name"
                  :value="item.addressId"
                ></el-option>
              </el-select>
              <el-button link type="primary" @click="handleSet('address', row)"
                >应用到其他选择店铺</el-button
              >
            </template>
          </vxe-column>
          <vxe-column title="交运偏好" min-width="320">
            <template #default="{ row }">
              <el-select
                v-model="row.consignPreferenceName"
                style="width: 150px"
                @change="changeConsign"
              >
                <el-option
                  v-for="item in row.consignPreferenceList"
                  :key="item"
                  :label="item.name"
                  :value="item.consignPreferenceId"
                ></el-option>
              </el-select>
              <el-button link type="primary" @click="handleSet('prefer', row)"
                >应用到其他选择店铺</el-button
              >
            </template>
          </vxe-column>
          <vxe-column title="操作" width="250">
            <template #default="{ row }">
              <el-button type="primary" @click="handleSave('single', row)"
                >保存</el-button
              >
              <el-button type="primary" @click="handleSync('single', row)"
                >同步</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </el-card>
    <!-- 数据列表 end -->

    <el-dialog
      v-model="showSaveDialog"
      width="40%"
      :title="isSave ? '保存' : '同步'"
      style="overflow: hidden"
      :close-on-click-modal="false"
    >
      <el-tag style="margin-bottom: 10px; margin-right: 10px"
        >成功数量({{ isSave ? saveSuccessCount : syncSuccessCount }})</el-tag
      >
      <el-tag style="margin-bottom: 10px" type="danger"
        >失败数量({{ isSave ? saveList.length : syncList.length }})</el-tag
      >
      <div style="overflow-y: auto; max-height: 550px">
        <vxe-table :data="isSave ? saveList : syncList" border>
          <vxe-column title="店铺" field="storeAcct"> </vxe-column>
          <vxe-column
            :title="isSave ? '保存结果' : '同步结果'"
            field="success"
            width="100"
          >
            <template #default="{ row }">
              {{ row.success ? '成功' : '失败' }}</template
            >
          </vxe-column>
          <vxe-column title="原因" field="operationResult"></vxe-column>
        </vxe-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="orderlogisticsprefersetting">
  import { onMounted, reactive, ref, computed } from 'vue';
  import {
    getStoreList,
    syncStore,
    saveStore
  } from '@/api/order/prefersetting';
  import { ElMessage } from 'element-plus';

  const formData = reactive({
    exist: ''
  });
  const settingList = ref([]);

  const selectRecords = ref([]);
  const preferTable = ref(null);
  const loading = ref(false);
  const pageLoading = ref(false);

  onMounted(() => {
    getStoreData();
  });

  // 获取列表数据
  const getStoreData = async () => {
    try {
      loading.value = true;
      let { data } = await getStoreList(formData);
      settingList.value = data;
      loading.value = false;
    } catch (err) {
      loading.value = false;
      console.log(err);
    }
  };

  // 获取复选框选中的数据
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = preferTable.value;
    selectRecords.value = $table.getCheckboxRecords();
    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };

  // 应用到选择的其他店铺
  const handleSet = (type, row) => {
    if (getSelectedList()) {
      selectRecords.value.forEach((item) => {
        if (type === 'address') {
          // 发货地址
          const name = row.addressName;
          // 应用地址 id
          item.addressId = row.addressId;
          // 发货地址同步之后  row.name 值 ===> id
          if (row.addressPreferenceList?.length > 0) {
            row.addressPreferenceList.forEach((cItem) => {
              if (
                cItem.addressId === name ||
                cItem.addressId === row.addressId
              ) {
                item.addressName = cItem.name;
              }
            });
          } else {
            // 没有同步 直接应用
            item.addressName = row.addressName;
          }
        }
        if (type === 'prefer') {
          // 交运偏好
          const consignPreferenceName = row.consignPreferenceName;
          // 交运偏好 id
          item.consignPreferenceId = row.consignPreferenceId;
          // 交运偏好同步之后  row.name 值 ===> id
          if (row.consignPreferenceList?.length > 0) {
            row.consignPreferenceList.forEach((cItem) => {
              if (
                cItem.consignPreferenceId === consignPreferenceName ||
                cItem.consignPreferenceId === row.consignPreferenceId
              ) {
                item.consignPreferenceName = cItem.name;
              }
            });
          } else {
            // 没有同步 直接应用
            item.consignPreferenceName = row.consignPreferenceName;
          }
        }
      });
    }
  };

  // 地址改变 设置名称
  const changeAddress = (val) => {
    settingList.value.forEach((item) => {
      if (item.addressName === val) {
        item.addressId = val;
        item.addressPreferenceList &&
          item.addressPreferenceList.forEach((cItem) => {
            cItem.addressId === item.addressName &&
              (item.addressName = cItem.name);
          });
      }
    });
  };

  // 交运偏好改变 设置名称
  const changeConsign = (val) => {
    settingList.value.forEach((item) => {
      if (item.consignPreferenceName === val) {
        item.consignPreferenceId = val;
        item.consignPreferenceList &&
          item.consignPreferenceList.forEach((cItem) => {
            cItem.consignPreferenceId === item.consignPreferenceName &&
              (item.consignPreferenceName = cItem.name);
          });
      }
    });
  };

  const showSaveDialog = ref(false); // 保存后弹窗
  const saveList = ref([]);
  const syncList = ref([]);
  const saveSuccessCount = ref(0);
  const syncSuccessCount = ref(0);
  const isSave = ref(true);

  // 同步 获取地址和交运偏好
  const handleSync = async (type, row) => {
    let storeAcctIdList = [];
    if (type === 'single') {
      storeAcctIdList.push(row.storeAcctId);
      pageLoading.value = true;
      syncStoreList(storeAcctIdList);
    }
    if (type === 'multi') {
      if (!getSelectedList()) return;
      storeAcctIdList = selectRecords.value.map((item) => item.storeAcctId);
      pageLoading.value = true;
      syncStoreList(storeAcctIdList);
    }
  };

  const syncStoreList = async (storeAcctIdList) => {
    try {
      var { code, data } = await syncStore({ storeAcctIdList });
      pageLoading.value = false;
      if (code === '0000') {
        let successList = data && data.filter((item) => item.success);
        // 把获取的地址和交运偏好的下拉框数据 放入列表数据中
        data.length &&
          data.forEach((item) => {
            settingList.value.forEach((cItem) => {
              if (item.storeAcctId === cItem.storeAcctId) {
                cItem.addressPreferenceList = item.addressPreferenceList;
                cItem.consignPreferenceList = item.consignPreferenceList;
              }
            });
          });
        // 没有失败时
        if (successList.length === data.length) {
          ElMessage.success('同步成功!');
        } else {
          showSaveDialog.value = true;
          isSave.value = false;
          syncSuccessCount.value = successList.length;
          let result =
            data &&
            data.filter((item) => {
              return !item.success;
            });
          syncList.value = result || [];
        }
      }
    } catch (err) {
      console.log(err);
      pageLoading.value = false;
    }
  };

  // 批量保存
  const handleSave = async (type, row) => {
    let params = [];
    if (type === 'single') {
      params.push(row);
      pageLoading.value = true;
      if (row.addressId === '' || row.consignPreferenceId === '') {
        return ElMessage.warning('请设置货运地址和交运偏好！');
      }
      saveStoreList(params);
    }
    if (type === 'multi') {
      if (!getSelectedList()) {
        return;
      }
      params = selectRecords.value;
      let isExsit = selectRecords.value.some(
        (item) => item.addressId === '' || item.consignPreferenceId === ''
      );
      if (isExsit) {
        return ElMessage.warning('请设置货运地址和交运偏好！');
      }
      pageLoading.value = true;
      saveStoreList(params);
    }
  };

  const saveStoreList = async (params) => {
    try {
      const { code, data } = await saveStore(params);
      pageLoading.value = false;
      if (code === '0000') {
        let successList = data && data.filter((item) => item.success);
        // 没有失败时
        if (successList.length === data.length) {
          ElMessage.success('保存成功!');
        } else {
          showSaveDialog.value = true;
          isSave.value = true;
          saveSuccessCount.value = successList.length;
          let result =
            data &&
            data.filter((item) => {
              return !item.success;
            });
          saveList.value = result || [];
        }
        getStoreData();
      }
    } catch (err) {
      console.log(err);
      pageLoading.value = false;
    }
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 189;
  });
</script>

<style lang="scss" scoped>
  .mt10 {
    margin-top: 10px;
  }
  .tool_btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
