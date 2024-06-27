<!-- eslint-disable vue/v-slot-style -->
<!-- 货件存取 -->
<template>
  <div class="shipmentaccess_container app-container">
    <el-card class="common_split_bottom search_card">
      <el-form v-model="formData" :inline="true" class="search_form">
        <el-form-item label="平台">
          <el-select
            v-model="formData.platCode"
            placeholder="请选择"
            clearable
            filterable
            @change="changePlat"
          >
            <el-option
              v-for="item in platList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺">
          <el-select-v2
            v-model="formData.storeAcctIdList"
            placeholder="请选择"
            :options="storeList"
            style="width: 200px"
            multiple
            collapse-tags
            clearable
            filterable
            @visible-change="changeStore"
          >
          </el-select-v2>
        </el-form-item>
        <el-form-item label="合单箱号">
          <el-input v-model="formData.comBoxNo" clearable />
        </el-form-item>
        <el-form-item label="收件地址">
          <el-select
            v-model="formData.receiveAddressId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.alias"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库单号">
          <el-input
            v-model="formData.relationBusinessNoStr"
            placeholder="多个英文逗号隔开"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="handleMulPrint">批量打印</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="common_split_bottom list_card">
      <div>
        <vxe-table
          ref="tableRef"
          :data="tableData"
          :height="height"
          :loading="loading"
          :scroll-y="{ gt: 12, oSize: 50 }"
          show-overflow
          border
          :row-config="{ isCurrent: true, isHover: true }"
          :column-config="{ resizable: true }"
        >
          <vxe-column type="checkbox" width="50"></vxe-column>
          <vxe-column field="platCode" title="平台"></vxe-column>
          <vxe-column field="comBoxNo" title="合单箱号"></vxe-column>
          <vxe-column field="relationBusinessNo" title="入库单号"></vxe-column>
          <vxe-column field="storeAcct" title="店铺"></vxe-column>
          <vxe-column field="alias" title="地址"></vxe-column>
          <vxe-column title="创建时间">
            <template #default="{ row }">{{
              row.createTime
                ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
                : ''
            }}</template>
          </vxe-column>
          <vxe-column title="操作">
            <template #default="{ row }">
              <el-button type="primary" @click="handlePrint(row)"
                >打印</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </el-card>
  </div>
</template>

<script setup name="multiplatformdelivercompackbox">
  import { onMounted, reactive, ref, computed } from 'vue';

  import { getAllPlatList } from '@/api/common/index.js';
  import { getStoreData, getAddress } from '@/api/multiplatform/shipmentplan';
  import { queryPage } from '@/api/multiplatform/compackbox';
  import { epeanPrint_plugin_fun } from '@/utils/print';
  import { ElMessage } from 'element-plus';
  import { parseTime } from '@/utils/common';

  const formData = reactive({
    receiveAddressId: '', // 收货地址id
    storeAcctIdList: [],
    storeAcctId: '', // 店铺id
    platCode: '', // 平台名称
    comBoxNo: '', // 合单箱号
    relationBusinessNoStr: '' // 入库单号
  });

  onMounted(() => {
    getStoreList();
    getAddressList();
    getPlatList();
  });

  // 平台信息改变 重新获取店铺、合单箱号数据
  const changePlat = () => {
    formData.storeAcctIdList = [];
    formData.comBoxNo = '';
    formData.receiveAddressId = '';

    getStoreList();
    getAddressList();
  };

  const changeStore = (val) => {
    if (val && !formData.platCode) {
      return ElMessage.warning('请先选择平台！');
    }
  };

  // 获取平台名称
  const platList = ref([]);
  // 获取所有平台数据
  const getPlatList = async () => {
    try {
      const { code, data } = await getAllPlatList();
      if (code === '0000') {
        platList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取店铺信息
  const storeList = ref([]);
  const getStoreList = async () => {
    try {
      let params = {
        platCode: formData.platCode
      };
      const { data } = await getStoreData(params);
      storeList.value = data.map((item) => ({
        value: item.id,
        label: item.storeAcct
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const addressList = ref([]);
  // 获取收件地址信息
  const getAddressList = async () => {
    try {
      const { data } = await getAddress({
        platCode: formData.platCode
      });
      addressList.value = data.list;
    } catch (err) {
      console.log(err);
    }
  };

  const tableData = ref([]);
  const tableRef = ref(null);
  const loading = ref(false);

  const onSubmit = async () => {
    try {
      loading.value = true;
      const { code, data } = await queryPage(formData);
      if (code === '0000') {
        tableData.value = data;
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  const handlePrint = async (item) => {
    let printDetailDtoList = [];
    let obj = {
      titleMap: {
        comBoxNo: item.comBoxNo,
        storeAcct: item.storeAcct,
        alias: item.alias
      }
    };
    printDetailDtoList.push(obj);
    let printObj10040 = {
      printerName: 10040,
      jspaper: 'platWhShipmentComBoxNo10040.jasper',
      printDetailDtoList
    };
    await epeanPrint_plugin_fun(99, printObj10040);
  };

  // 批量打印
  const handleMulPrint = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (checkedList?.length === 0) {
      return ElMessage.warning('请选择要批量打印的数据');
    }
    for (let i = 0; i < checkedList.length; i++) {
      let item = checkedList[i];
      let printDetailDtoList = [];
      let obj = {
        titleMap: {
          comBoxNo: item.comBoxNo,
          storeAcct: item.storeAcct,
          alias: item.alias
        }
      };
      printDetailDtoList.push(obj);
      let printObj10040 = {
        printerName: 10040,
        jspaper: 'platWhShipmentComBoxNo10040.jasper',
        printDetailDtoList
      };
      await epeanPrint_plugin_fun(99, printObj10040);
    }
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 140;
  });
</script>

<style lang="scss" scoped></style>
