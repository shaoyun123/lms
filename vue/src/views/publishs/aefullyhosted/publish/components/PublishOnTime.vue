<template>
  <div class="">
    <el-dialog
      v-model="dialogVisible"
      width="600px"
      title="定时刊登"
      :close-on-click-modal="false"
    >
      <el-form
        ref="timeFormRef"
        :model="timeFormData"
        :rules="timeFormRule"
        :scroll-to-error="true"
        size="default"
        :label-width="180"
      >
        <el-form-item label="定时刊登开始时间" prop="timingDate">
          <el-date-picker
            v-model="timeFormData.timingDate"
            format="YYYY-MM-DD"
            type="date"
          />
        </el-form-item>
        <el-form-item label="listing刊登间隔(分)" prop="intervalMinute">
          <ZInputNumber v-model="timeFormData.intervalMinute" :precision="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          :loading="publishLoading"
          @click="handlePublsih(timeFormRef)"
          >定时刊登</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { computed, ref, watch } from 'vue';
  import { timingPublishApi } from '@/api/publishs/aefullyhostedpublish';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const timeFormRef = ref();
  const timeFormData = ref();
  const timeFormRule = ref({
    timingDate: [{ required: true, trigger: 'change', message: '请选择日期' }]
  });

  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) {
        timeFormData.value = { timingDate: '', intervalMinute: '' };
      }
    }
  );

  const publishLoading = ref(false);
  const handlePublsih = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        publishLoading.value = true;
        let params = {
          idList: props.rowList.map((item) => item.id),
          timingDate: new Date(timeFormData.value.timingDate).getTime(),
          intervalMinute: timeFormData.value.intervalMinute
        };
        try {
          const { msg } = await timingPublishApi(params);
          ElMessage.success(msg);
          dialogVisible.value = false;
          emits('handleSearch');
        } catch (err) {
          console.log('err :>> ', err);
        }
        publishLoading.value = false;
      }
    });
  };
</script>

<style lang="scss" scoped></style>
