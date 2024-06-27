<template>
  <el-dialog
    v-model="dialogVisible"
    width="30%"
    align-center
    :title="title"
    @close="handleClose"
  >
    <div class="content">
      <div class="flex justify-between">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          :label-width="120"
        >
          <el-form-item
            v-if="title === '新增广告活动'"
            label="广告活动ID"
            prop="campaignId"
          >
            <el-input v-model="formData.campaignId" clearable />
          </el-form-item>
          <el-form-item label="目标ACOS" prop="targetAcos">
            <ZInputNumber
              ref="acosInputDom"
              v-model="formData.targetAcos"
              placeholder="数值, >0, <1, 可以为小数"
              :min="0"
              :max="1"
              :precision="2"
              clearable
            />
          </el-form-item>
          <el-form-item
            v-if="title === '新增广告活动'"
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="formData.remark"
              type="textarea"
              maxlength="200"
              show-word-limit
              :rows="4"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit(formRef)">
          {{ title === '新增广告活动' ? '保存' : '修改' }}</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, watch, onMounted, ref, reactive } from 'vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import {
    saveOrUpdateApi,
    batchSetAcosApi
  } from '@/api/publishs/advertisingstrategy';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: () => ''
    },
    checkedIdList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue']);

  const formRules = reactive({
    campaignId: [
      { required: true, message: '请输入广告活动ID', trigger: 'blur' }
    ],
    targetAcos: [{ required: true, message: '请输入目标acos', trigger: 'blur' }]
  });

  const formData = reactive({
    campaignId: null,
    targetAcos: null,
    status: 1,
    remark: ''
  });

  onMounted(() => {});

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (!val) {
        resetForm();
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
      }
    }
  );
  const needFresh = ref(false);

  const formRef = ref();
  const submit = async (formEl) => {
    if (!formEl) return;
    await formEl.validate();
    if (Number(formData.targetAcos) <= 0 || Number(formData.targetAcos) >= 1) {
      return ElMessage.warning('目标ACOS必须大于0且小于1！');
    }
    if (props.title === '新增广告活动') {
      const { code, msg } = await saveOrUpdateApi({
        ...formData,
        campaignId: Number(formData.campaignId)
      });
      if (code === '0000') {
        needFresh.value = true;
        ElMessage.success(msg);
        handleClose();
      } else {
        ElMessage.warning(msg);
      }
    } else {
      const params = props.checkedIdList.map((item) => {
        return { id: item, targetAcos: formData.targetAcos };
      });
      const { code, msg } = await batchSetAcosApi(params);
      if (code === '0000') {
        needFresh.value = true;
        ElMessage.success(msg);
        handleClose();
      } else {
        ElMessage.warning(msg);
      }
    }
  };

  // 清空表单
  const resetForm = () => {
    formData.targetAcos = '';
    formData.remark = '';
    formData.campaignId = null;
  };

  const handleClose = () => {
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped></style>
