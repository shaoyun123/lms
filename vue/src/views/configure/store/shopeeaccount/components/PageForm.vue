<template>
  <el-form ref="formRef" :model="formData" :inline="true" class="search_form">
    <el-form-item label="启用状态" prop="status">
      <el-select v-model="formData.status" clearable filterable>
        <el-option label="启用中" :value="true"></el-option>
        <el-option label="已停用" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="店铺" prop="storeAcct">
      <ZCascader
        v-model="formData.storeAcct"
        :data="initList.storeList"
        :style="{ width: '120px' }"
        :props="{
          label: 'label',
          children: 'children',
          value: 'label'
        }"
      />
    </el-form-item>
    <el-form-item label="发货仓库" prop="shippingWarehouseId">
      <el-select
        v-model="formData.shippingWarehouseId"
        clearable
        filterable
        placeholder="请选择"
      >
        <el-option
          v-for="item in initList.warehouseList"
          :key="item.id"
          :label="item.warehouseName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="客服" prop="customServicerId">
      <el-select v-model="formData.customServicerId" filterable clearable>
        <el-option
          v-for="item in initList.customServiceList"
          :key="item.id"
          :label="item.userName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="可用额度"
      prop="listingQuotaRemainMin"
      class="form_range"
    >
      <ZInputNumber v-model="formData.listingQuotaRemainMin" />
      <div class="range_link">-</div>
      <ZInputNumber v-model="formData.listingQuotaRemainMax" />
    </el-form-item>
    <el-form-item label="自动删除" prop="autoDelete">
      <el-select v-model="formData.autoDelete" clearable filterable>
        <el-option
          v-for="v in StatusList"
          :key="v.value"
          :label="v.label"
          :value="v.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="同步Listing状态" prop="syncStatus">
      <el-select v-model="formData.syncStatus" clearable filterable>
        <el-option
          v-for="v in SyncStatusList"
          :key="v.value"
          :label="v.label"
          :value="v.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="同步异常备注" prop="syncDesc">
      <el-input v-model="formData.syncDesc" clearable></el-input>
    </el-form-item>
    <el-form-item label="刊登时间" prop="autoDeleteGreatListingTimes">
      <el-select
        v-model="formData.autoDeleteGreatListingTimes"
        clearable
        filterable
      >
        <el-option
          v-for="v in PublistTimeList"
          :key="v.value"
          :label="v.label"
          :value="v.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="formData.remark" clearable></el-input>
    </el-form-item>
    <el-form-item label="毛利率" prop="grossRateMin" class="form_range">
      <ZInputNumber v-model="formData.grossRateMin" :precision="2" />
      <div class="range_link">-</div>
      <ZInputNumber v-model="formData.grossRateMax" :precision="2" />
    </el-form-item>
    <el-form-item label="预售" prop="shopeePreOrderConfigStatus">
      <el-select
        v-model="formData.shopeePreOrderConfigStatus"
        clearable
        filterable
      >
        <el-option
          v-for="v in PreConfigStatusList"
          :key="v.value"
          :label="v.label"
          :value="v.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="自动上传视频" prop="autoUploadVideo">
      <el-select v-model="formData.autoUploadVideo" clearable filterable>
        <el-option
          v-for="v in StatusList"
          :key="v.value"
          :label="v.label"
          :value="v.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="店铺标签" prop="storeTagList">
      <ZSelect
        v-model="formData.storeTagList"
        :items="initList.storeTagList"
        :num="0"
      />
    </el-form-item>
    <el-form-item label="mall店铺" prop="shopIsMall">
      <el-select v-model="formData.shopIsMall" clearable filterale>
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="GP" prop="merchantNameList">
      <ZSelect
        v-model="formData.merchantNameList"
        :items="initList.merchantNameList"
        :num="0"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch(true)">搜索</el-button>
      <el-button @click="resetSearchForm()">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import {
    SyncStatusList,
    PublistTimeList,
    PreConfigStatusList,
    StatusList
  } from '../config.js';
  import ZCascader from '@/components/ZCascader/index.vue';
  // import { successColor, dangerColor } from '@/styles/vars.module.scss';
  import ZSelect from '@/components/ZSelect/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  defineProps({
    initList: {
      type: Object,
      default: () => ({})
    }
  });

  const emits = defineEmits(['handleSearch']);

  const formData = reactive({
    status: true, // 状态 默认开启
    syncStatus: null //同步Listing状态
  });
  const formRef = ref(null);

  const handleSearch = () => {
    emits('handleSearch', true);
  };

  // 清空筛选表单
  const resetSearchForm = () => {
    formRef.value.resetFields();
    formData.listingQuotaRemainMax = null;
    formData.grossRateMax = null;
  };

  //   赋值
  const setFormDataValue = (key, value) => {
    formData[key] = value;
  };

  defineExpose({ formData, setFormDataValue });
</script>

<style lang="scss" scoped></style>
