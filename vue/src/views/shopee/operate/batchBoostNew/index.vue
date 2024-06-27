<template>
  <!-- 批量boost页面 -->
  <div class="app-container">
    <el-card class="search_card">
      <el-form :model="formData" :label-width="180">
        <el-form-item :label-width="65">
          <span style="color: red">*</span>
          <div class="form_left">
            <el-select
              v-model="formData.taskStatus"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option label="店铺" :value="1"></el-option>
              <el-option label="站点" :value="2"></el-option>
            </el-select>
          </div>
          <z-cascader
            v-if="formData.taskStatus == 1"
            v-model="formData.storeAcctIdList"
            :data="initList.storeData"
            style="width: 270px"
          ></z-cascader>
          <MultiSelect
            v-if="formData.taskStatus == 2"
            v-model="formData.salesSite"
            style="width: 270px"
            :option-obj="{
              optionList: initList.siteList,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item :label-width="70">
          <div class="form_left">
            <el-select v-model="formData.salesSearchType" filterable>
              <el-option
                v-for="item in SalesTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <el-input-number
            v-model="formData.salesMin"
            :min="0"
            :precision="0"
            :step="1"
          />
          <span class="input-devider">—</span>
          <el-input-number
            v-model="formData.salesMax"
            :min="0"
            :precision="0"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="收藏数">
          <el-input-number
            v-model="formData.likesAmountStart"
            :min="0"
            :precision="0"
            :step="1"
          />
          <span class="input-devider">—</span>
          <el-input-number
            v-model="formData.likesAmountEnd"
            :min="0"
            :precision="0"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="浏览量">
          <el-input-number
            v-model="formData.viewAmountStart"
            :min="0"
            :precision="0"
            :step="1"
          />
          <span class="input-devider">—</span>
          <el-input-number
            v-model="formData.viewAmountEnd"
            :min="0"
            :precision="0"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="现价(站点币种)">
          <el-input-number v-model="formData.currentPriceStart" :min="0" />
          <span class="input-devider">—</span>
          <el-input-number v-model="formData.currentPriceEnd" :min="0" />
        </el-form-item>
        <el-form-item label="刊登时间" prop="listingTime">
          <div style="width: 270px">
            <el-date-picker
              v-model="formData.listingTime"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="shortcuts"
              placeholder="请选择"
            />
          </div>
        </el-form-item>
        <el-form-item label="排序方式" prop="orderBy">
          <el-select
            v-model="formData.orderBy"
            placeholder="请选择"
            clearable
            filterable
            style="width: 270px !important"
          >
            <el-option value="0" label="7日销量升序"></el-option>
            <el-option value="1" label="7日销量降序"></el-option>
            <el-option value="2" label="30日销量升序"></el-option>
            <el-option value="3" label="30日销量降序"></el-option>
            <el-option value="4" label="90日销量升序"></el-option>
            <el-option value="5" label="90日销量降序"></el-option>
            <el-option value="6" label="收藏量升序"></el-option>
            <el-option value="7" label="收藏量降序"></el-option>
            <el-option value="8" label="浏览量升序"></el-option>
            <el-option value="9" label="浏览量降序"></el-option>
            <el-option value="10" label="刊登时间升序"></el-option>
            <el-option value="11" label="刊登时间降序"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每个店铺Boost数量" prop="boostAmount">
          <el-input-number
            v-model="formData.boostAmount"
            :min="0"
            :precision="0"
            style="width: 270px"
            :step="1"
          />
          <!-- <el-input
            v-model="formData.boostAmount"
            style="width: 270px"
          ></el-input> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleClick(1)">替换boost</el-button
          ><el-button type="primary" @click="handleClick(2)"
            >定时boost</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
  </div>
</template>
<script setup name="shopeeoperatebatchboostnew">
  import { ref, onMounted } from 'vue';
  import { getStoreList } from '@/api/common';
  import { getSiteListApi } from '@/api/shopee/common';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { ElMessage } from 'element-plus';
  import {
    batchResetBoostItemsApi,
    batchSetBoostItemsApi
  } from '@/api/shopee/batchboost';
  const formData = ref({
    taskStatus: 1,
    salesSearchType: 0
  });
  const SalesTypeList = [
    { label: 'listing7天销量', value: 0 },
    { label: 'listing30天销量', value: 1 },
    { label: 'listing90天销量', value: 2 }
  ];
  const initList = ref({
    siteList: [],
    storeData: []
  });
  onMounted(async () => {
    // 初始化站点和店铺
    Promise.all([getStoreList('shopee'), getSiteListApi()])
      .then((res) => {
        initList.value.storeData = res[0]?.data?.children || [];
        initList.value.siteList = res[1]?.data?.siteList || [];
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
  });
  // 替换boost和定时boost
  const clickLoading = ref(false);
  const handleClick = async (type) => {
    // 站点店铺选其一
    if (formData.value.taskStatus == 1) {
      formData.value.salesSite = [];
    } else if (formData.value.taskStatus == 2) {
      formData.value.storeAcctIdList = [];
    }
    // 格式化时间
    if (formData.value.listingTime && formData.value.listingTime.length != 0) {
      formData.value.listingTimeStart = new Date(
        formData.value.listingTime[0]
      ).getTime();
      formData.value.listingTimeEnd = new Date(
        formData.value.listingTime[1]
      ).getTime();
    } else {
      formData.value.listingTimeStart = '';
      formData.value.listingTimeEnd = '';
    }
    if (
      formData.value.salesSite.length == 0 &&
      formData.value.storeAcctIdList == 0
    ) {
      return ElMessage.warning('请选择站点或店铺');
    }
    clickLoading.value = true;
    if (type == 1) {
      try {
        const { msg } = await batchResetBoostItemsApi(formData.value);
        ElMessage.success(msg);
      } catch (err) {
        console.log('err :>> ', err);
      } finally {
        clickLoading.value = false;
      }
    } else if (type == 2) {
      try {
        const { msg } = await batchSetBoostItemsApi(formData.value);
        ElMessage.success(msg);
      } catch (err) {
        console.log('err :>> ', err);
      } finally {
        clickLoading.value = false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .form_left {
    width: 110px;
  }
  .input-devider {
    margin: 0 5px;
    color: #dcdfe6;
  }
</style>
