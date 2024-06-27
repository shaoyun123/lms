<template>
  <!-- 更新虾皮水印页面 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :label-width="120"
        :rules="rules"
      >
        <MultiStoreCascader
          v-model="formData.storeAcctIds"
          class="form-store"
          form-item-prop="storeAcctIds"
        />
        <el-form-item :label-width="10">
          <div class="form_left">
            <el-select v-model="formData.salesType" filterable>
              <el-option
                v-for="item in SalesTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <el-input-number
            v-model="formData.salesLeftNumber"
            :min="0"
            :precision="0"
            :step="1"
          />
          <span class="input-devider">—</span>
          <el-input-number
            v-model="formData.salesRightNumber"
            :min="0"
            :precision="0"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="历史销量">
          <el-input-number
            v-model="formData.historySalesLeftNumber"
            :min="0"
            :precision="0"
            :step="1"
          />
          <span class="input-devider">—</span>
          <el-input-number
            v-model="formData.historySalesRightNumber"
            :min="0"
            :precision="0"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="刊登天数">
          <el-input-number
            v-model="formData.listingDayLeftNumber"
            :min="0"
            :precision="0"
            :step="1"
          />
          <span class="input-devider">—</span>
          <el-input-number
            v-model="formData.listingDayRightNumber"
            :min="0"
            :precision="0"
            :step="1"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleClick(ruleFormRef)"
            >立即执行</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
  </div>
</template>

<script setup name="shopeeoperateupdatewatermark">
  import { reactive, ref } from 'vue';
  import MultiStoreCascader from '@/components/MultiStoreCascader/index.vue';
  import { updateWaterMarkApi } from '@/api/shopee/updatewatermark';
  import { ElMessage } from 'element-plus';
  const formData = ref({
    salesType: 7
  });
  const ruleFormRef = ref({});
  const rules = reactive({
    storeAcctIds: [{ required: true, trigger: 'change', message: '请选择店铺' }]
  });
  const SalesTypeList = [
    { label: 'listing7天销量', value: 7 },
    { label: 'listing30天销量', value: 30 },
    { label: 'listing60天销量', value: 60 },
    { label: 'listing90天销量', value: 90 }
  ];
  // 立即执行
  const clickLoading = ref(false);
  const handleClick = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          clickLoading.value = true;
          const storeAcctIds = formData.value.storeAcctIds.map(
            (item) => item[item.length - 1]
          );

          const { msg } = await updateWaterMarkApi({
            ...formData.value,
            storeAcctIds
          });
          ElMessage.success(msg);
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          clickLoading.value = false;
        }
      }
    });
  };
</script>

<style lang="scss" scoped>
  .form-store {
    margin-top: 18px;
    :deep(.el-input) {
      width: 260px;
    }
    :deep(.el-cascader__tags .el-tag) {
      margin: 2 0 2 6px;
    }
    :deep(.el-tag--small) {
      padding: 0 2px;
    }
    :deep(.el-cascader__tags) {
      flex-wrap: nowrap;

      span:first-child {
        max-width: 150px;
      }
    }
  }

  .form_left {
    width: 110px;
  }
  .input-devider {
    margin: 0 5px;
    color: #dcdfe6;
  }
</style>
