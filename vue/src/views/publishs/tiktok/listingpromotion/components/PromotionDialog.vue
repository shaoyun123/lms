<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :width="800"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        size="default"
        :rules="rules"
        :label-width="120"
      >
        <el-form-item label="店铺" prop="storeAcctId">
          <el-select
            v-model="formData.storeAcctId"
            filterable
            style="width: 220px"
            :disabled="[1, 2].includes(Number(formData.promotionStatus))"
          >
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :value="item.id"
              :label="item.storeAcct"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            :disabled="[2].includes(Number(formData.promotionStatus))"
            type="datetime"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="活动名称" prop="promotionName">
          <el-input
            v-model="formData.promotionName"
            maxlength="50"
            placeholder="请输入"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="活动类型" prop="autoRenew">
          <el-switch
            v-model="formData.autoRenew"
            inline-prompt
            active-text="连续"
            inactive-text="单次"
          />
        </el-form-item>
        <el-form-item label="限购数量" prop="buyerLimit">
          <el-input-number
            v-model="formData.buyerLimit"
            :min="1"
            :precision="0"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <template v-if="Number(formData.promotionStatus) !== 3" #footer>
        <el-button
          :loading="saveLoading"
          type="primary"
          @click="handleSave(formRef)"
        >
          保存</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, computed, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    getStoreListApi,
    saveOrUpdateApi
  } from '@/api/publishs/tiktoklistingpromotion';

  // 促销状态：1 - Upcoming：未开始，2- Ongoing：进行中，3- Expired&4- Deactivated:已结束

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: () => {}
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'updateOperator'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const title = ref('新增促销活动');
  const storeList = ref([]);
  const formData = ref({});
  const formRef = ref();
  const validateStartTime = (rule, value, callback) => {
    const { endTime, promotionStatus } = formData.value;
    if (!value) {
      callback(new Error('请选择活动开始时间'));
    } else if (Number(promotionStatus) === 2) {
      callback();
    } else {
      const _startTime = new Date(value).getTime();
      const curRime = Date.now();
      if (_startTime - curRime < 600 * 1000) {
        callback(new Error('活动开始时间需要比当前时间至少晚10分钟的时间'));
      } else if (endTime && new Date(endTime).getTime() - _startTime <= 0) {
        callback(new Error('活动开始时间需小于结束时间'));
      } else if (
        endTime &&
        new Date(endTime).getTime() - _startTime > 365 * 24 * 3600 * 1000
      ) {
        callback(new Error('活动时间不超过1年'));
      }
      callback();
    }
  };
  const validateEndTime = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请选择活动结束时间'));
    } else {
      const _endTime = new Date(value).getTime();
      const { startTime } = formData.value;
      if (startTime) {
        const _startTime = new Date(startTime).getTime();
        if (_endTime - _startTime > 365 * 24 * 3600 * 1000) {
          callback(new Error('活动时间不超过1年'));
        } else if (_endTime - _startTime <= 0) {
          callback(new Error('活动结束时间需大于活动开始时间'));
        }
      }
      callback();
    }
  };
  const rules = reactive({
    storeAcctId: [{ required: true, trigger: 'change', message: '请选择店铺' }],
    startTime: [
      {
        required: true,
        trigger: 'change',
        validator: validateStartTime
      },
      {
        required: true,
        trigger: 'blur',
        validator: validateStartTime
      }
    ],
    endTime: [
      {
        required: true,
        trigger: 'change',
        validator: validateEndTime
      },
      {
        required: true,
        trigger: 'blur',
        validator: validateEndTime
      }
    ],
    promotionName: [
      { required: true, trigger: 'blur', message: '请输入活动名称' }
    ],
    autoRenew: [{ required: true }]
  });

  watch(
    () => props.selectedRow,
    (val) => {
      if (JSON.stringify(val) !== '{}') {
        title.value = '修改促销活动';
      }
    }
  );
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        //
        try {
          const { data } = await getStoreListApi();
          storeList.value = data;
        } catch (err) {
          console.log('err :>> ', err);
        }
        // 赋值
        formData.value = {
          autoRenew: false,
          ...JSON.parse(JSON.stringify(props.selectedRow))
        };
      } else {
        formRef.value.resetFields();
      }
    }
  );

  // 保存
  const saveLoading = ref(false);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          saveLoading.value = true;
          const { msg } = await saveOrUpdateApi({ ...formData.value });
          ElMessage.success(msg || '操作成功');
          // 保存后 弹窗不关闭 活动名称数据清空
          formData.value.promotionName = '';
          emits('handleSearch');
          emits('updateOperator');
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          saveLoading.value = false;
        }
      }
    });
  };
</script>

<style lang="scss" scoped></style>
