<template>
  <el-dialog
    :model-value="dialogVisible"
    title="设置mall店铺"
    width="800px"
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="180"
      size="default"
    >
      <el-form-item label="mall店铺品牌" prop="shopIsMall">
        <el-radio-group v-model="formData.shopIsMall">
          <el-radio :label="true">开启</el-radio>
          <el-radio :label="false">取消</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="mall店铺品牌ID" prop="brandId">
        <ZInputNumber
          v-model="formData.brandId"
          class="w300"
          :precision="0"
          :min="0"
          :disabled="!formData.shopIsMall"
        />
        <el-text type="info" class="ml10">!未填写将取店铺品牌ID</el-text>
      </el-form-item>
      <el-form-item label="mall店铺品牌名" prop="brandName">
        <el-input
          v-model="formData.brandName"
          class="w300"
          :disabled="!formData.shopIsMall"
        />
        <el-text type="info" class="ml10">!未填写将取店铺品牌名</el-text>
      </el-form-item>
      <el-form-item label="mall品牌授权CNSC类目ID" prop="platCateIdListStr">
        <div>!未填写时全部类目均使用mall品牌，多个用，隔开</div>
        <el-input
          v-model="formData.platCateIdListStr"
          type="textarea"
          :row="5"
          :disabled="!formData.shopIsMall"
          @blur="commonDivideCommaIntNum($event)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="disflex">
        <div class="mr200">
          <el-checkbox
            v-model="formData.updateItemBrandAndTitle"
            :value="true"
            size="large"
            >同步修改在线商品mall品牌</el-checkbox
          >
        </div>
        <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
        <el-button @click="closeDialog">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, ref, onMounted, reactive } from 'vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { commonDivideCommaIntNum } from '@/utils/divide';
  import {
    getStoreInfoApi,
    updateStoreInfoApi
  } from '@/api/configure/shopeeaccount';
  import { ElMessage } from 'element-plus';
  import { cloneDeep } from 'lodash-es';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    editInfo: {
      type: Object,
      default: () => ({})
    }
  });
  const emits = defineEmits(['update:modelValue', 'search']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const closeDialog = () => {
    dialogVisible.value = false;
  };

  let originalObj;
  onMounted(async () => {
    const { data } = await getStoreInfoApi(props.editInfo.id);
    originalObj = cloneDeep(data);
    formData.value.shopIsMall = data.shopIsMall;
    formData.value.brandId = data.brandId;
    formData.value.brandName = data.brandName;
    formData.value.platCateIdListStr = data.platCateIdListStr;
  });

  const validateBrandId = (rule, value, callback) => {
    const { shopIsMall } = formData.value;
    if (shopIsMall && !value && value !== 0) {
      callback(new Error('mall品牌ID需必填'));
    } else {
      callback();
    }
  };
  const validateBrandName = (rule, value, callback) => {
    const { shopIsMall } = formData.value;
    if (shopIsMall && !value && value !== 0) {
      callback(new Error('mall品牌名需必填'));
    } else {
      callback();
    }
  };

  const formRef = ref();
  const formData = ref({});
  const formRules = reactive({
    shopIsMall: [
      { required: true, message: '请设置mall店铺状态', trigger: 'blur' }
    ],
    brandId: [
      {
        trigger: 'blur',
        validator: validateBrandId
      }
    ],
    brandName: [
      {
        validator: validateBrandName,
        trigger: 'blur'
      }
    ]
  });
  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const params = { ...formData.value };
        if (!params.shopIsMall) {
          // 为取消状态时，不传当前其它三个新值
          delete params.brandId;
          delete params.brandName;
          delete params.platCateIdListStr;
        }
        try {
          const { msg } = await updateStoreInfoApi({
            storeAcctId: props.editInfo.id,
            ...originalObj,
            ...params
          });
          ElMessage.success(msg);
          closeDialog();
          emits('search');
        } catch (err) {
          console.log('err :>> ', err);
        }
      } else {
        console.log('error submit!');
        return false;
      }
    });
  };
</script>

<style lang="scss" scoped>
  .ml10 {
    margin-left: 10px;
  }
  .w300 {
    width: 300px;
  }
  .disflex {
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .mr200 {
    margin-right: 200px;
  }
</style>
