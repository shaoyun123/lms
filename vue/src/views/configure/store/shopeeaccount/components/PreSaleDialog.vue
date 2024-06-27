<template>
  <el-dialog
    :model-value="dialogVisible"
    title="预售设置"
    width="800px"
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120"
      size="default"
    >
      <el-form-item label="预售" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">开启预售</el-radio>
          <el-radio :label="0">取消预售</el-radio>
          <el-radio :label="2">暂定预售定时任务</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="固定预售Item ID" prop="itemIdsStr">
        <el-input
          v-model="formData.itemIdsStr"
          type="textarea"
          placeholder="支持填入多个，英文逗号隔开"
          rows="9"
          @blur="commonDivideCommaIntNum($event)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, ref, onMounted, reactive } from 'vue';
  import { commonDivideCommaIntNum } from '@/utils/divide';
  import {
    getPreOrderConfigApi,
    createPreOrderConfigApi,
    updatePreOrderConfigApi,
    cancelPreOrderApi
  } from '@/api/configure/shopeeaccount';
  import { ElMessage, ElMessageBox } from 'element-plus';

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

  onMounted(async () => {
    formData.value.storeAcctId = props.editInfo.id;
    const { data } = await getPreOrderConfigApi(props.editInfo.id);
    if (data?.id) {
      formData.value.status = data.status;
      formData.value.id = data.id;
      formData.value.itemIdsStr = data.itemIdsStr;
    }
  });

  const formRef = ref();
  const formData = ref({});
  const formRules = reactive({
    status: [{ required: true, message: '请选择预售状态', trigger: 'blur' }]
  });

  const tipsObj = {
    0: '店铺预售设置取消后，除固定预售item外，其余已预售商品将在1个工作日内全部取消预售，确定继续取消预售吗？',
    2: '店铺预售定时任务暂停后，该店铺将不再调整所有商品的预售状态，已预售的继续保持预售，未预售的继续不预售，确定继续暂停预售定时任务吗？'
  };

  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const { status } = formData.value;
        if (status === 1) {
          await saveData();
        } else {
          ElMessageBox.confirm(tipsObj[status], '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '关闭',
            type: 'warning'
          }).then(async () => {
            await saveData();
          });
        }
      } else {
        console.log('error submit!');
        return false;
      }
    });
  };

  const saveData = async () => {
    const { id } = formData.value;
    const saveApi = id ? updatePreOrderConfigApi : createPreOrderConfigApi;
    try {
      const { msg } = await saveApi(formData.value);
      ElMessage.success(msg);
      // 真正执行取消预售(这个店铺的预售商品查出来,然后去取消预售)
      if (formData.value.status === 0) {
        const { msg } = await cancelPreOrderApi(formData.value.storeAcctId);
        ElMessage.success(msg);
      }
      closeDialog();
      emits('search');
    } catch (err) {
      console.log('err :>> ', err);
    }
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
