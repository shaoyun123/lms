<template>
  <!-- 更新虾皮水印页面 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="ruleFormRef"
        v-loading="clickLoading"
        :model="formData"
        :label-width="120"
        :rules="rules"
        style="margin-top: 10px"
        class="dialog_form"
      >
        <!-- required -->
        <el-form-item
          required
          label="店铺"
          prop="storeAcctIds"
          class="store_manage_item_cascader"
        >
          <el-cascader
            v-model="formData.storeAcctIds"
            :options="storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true, emitPath: false }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="水印类型" prop="watermarkType" required>
          <el-select
            v-model="formData.watermarkType"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, index) in WMType"
              :key="item"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="刊登天数" prop="listingDayLeftNumber">
          <el-input-number
            v-model="formData.listingDayLeftNumber"
            :min="0"
            :precision="0"
            :step="1"
            placeholder="≥"
          />
          <span class="input-devider">—</span>
          <el-input-number
            v-model="formData.listingDayRightNumber"
            :min="0"
            :precision="0"
            :step="1"
            placeholder="≤"
          />
        </el-form-item>
        <el-form-item label="商品标签" prop="prodTagList">
          <el-select
            v-model="formData.prodTagList"
            class="mul-input"
            :class="formData.prodTagList.length > 1 ? 'hide_tag' : ''"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            filterable
          >
            <template #prefix>
              <el-tag v-if="formData.prodTagList.length > 1" type="info"
                >已选{{ formData.prodTagList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.prodAttrTagArr"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="10" prop="salesType">
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
            placeholder="≥"
          />
          <span class="input-devider">—</span>
          <el-input-number
            v-model="formData.salesRightNumber"
            :min="0"
            :precision="0"
            :step="1"
            placeholder="≤"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleClick(ruleFormRef)"
            >立即执行</el-button
          ><el-button @click="resetForm">清空</el-button></el-form-item
        >
      </el-form>
    </el-card>
  </div>
</template>

<script setup name="lazadaoperateupdatewatermark">
  import { reactive, ref, onMounted } from 'vue';
  import { getStoreList, getProdTagListApi } from '@/api/common';
  import { updateWatermarkByStore } from '@/api/lazada/updatewatermark';
  import { ElMessageBox } from 'element-plus';
  const formData = ref({
    salesType: 7,
    prodTagList: []
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
  const WMType = ['日常图片水印', '文字水印', '其他图片水印'];
  const resetForm = function () {
    ruleFormRef.value.resetFields();
    formData.value.listingDayRightNumber = '';
    formData.value.salesLeftNumber = '';
    formData.value.salesRightNumber = '';
  };
  const selectData = reactive({
    prodAttrTagArr: []
  });
  // 店铺级联数据
  const storeList = ref([]);
  onMounted(async () => {
    {
      const { data: storeData } = await getStoreList('lazada');
      storeList.value = storeData.children;
    }
    // 获取商品标签
    {
      const { data } = await getProdTagListApi();
      selectData.prodAttrTagArr = data;
    }
  });
  // 立即执行
  const clickLoading = ref(false);
  const handleClick = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        ElMessageBox.confirm(`请确认是否执行更新水印`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'Warning'
        }).then(async () => {
          clickLoading.value = true;
          try {
            const { code, msg } = await updateWatermarkByStore({
              ...formData.value
            });
            if (code == '0000') {
              // ElMessage.success(msg);
              ElMessageBox.alert(msg, '提示', {
                confirmButtonText: '关闭',
                type: 'success'
              });
            }
          } finally {
            resetForm();
            clickLoading.value = false;
          }
        });
      }
    });
  };
</script>
<style lang="scss" scoped>
  :deep(.hide_tag) {
    :deep(.el-select__selected-item) {
      display: none;
    }
  }
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
