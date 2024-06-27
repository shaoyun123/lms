<template>
  <div class="">
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :width="600"
      :align-center="true"
      :close-on-click-modal="storeInfo.type === 'view' ? true : false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :label-width="150"
        :rules="formRule"
        size="default"
      >
        <el-form-item label="店铺名" prop="storeNameStr">
          <el-input
            v-model="formData.storeNameStr"
            :disabled="storeInfo.type !== 'add'"
            placeholder="多个店铺请使用英文逗号分隔"
            @blur="commonDivideComma($event)"
          />
        </el-form-item>
        <el-form-item label="每天刊登量" prop="dailyPublishNums">
          <el-input-number
            v-model="formData.dailyPublishNums"
            :precision="0"
            :min="0"
            :step="1"
          />
        </el-form-item>

        <el-form-item label="上架开始时间" prop="publishTime">
          <el-select v-model="formData.publishTime">
            <el-option
              v-for="item in PublishTimeList"
              :key="item"
              :value="item"
              :label="item + '点'"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上架间隔时间" prop="publishInterval">
          <el-select v-model="formData.publishInterval">
            <el-option
              v-for="item in PublishIntervalList"
              :key="item"
              :value="item"
              :label="item + '分钟'"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template v-if="storeInfo.type !== 'view'" #footer>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave(formRef)"
          >保存</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { commonDivideComma } from '@/utils/divide';
  import { editStoreApi, addStoreApi } from '@/api/shopee/publishrules';
  import { ElMessage } from 'element-plus';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    storeInfo: {
      type: Object,
      default: () => ({})
    },
    ruleId: {
      type: Number,
      default: null
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleStoreSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const title = computed(() => {
    if (props.storeInfo.type === 'edit') {
      return '编辑';
    } else if (props.storeInfo.type === 'view') {
      return '查看';
    }
    return '新增';
  });

  const PublishTimeList = new Array(20).fill().map((_, index) => index + 1);
  const PublishIntervalList = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30];

  const formData = ref({});
  const formRef = ref();
  const validateDailyPublishNums = (rule, value, callback) => {
    if (value === undefined) {
      callback(new Error('请输入每天刊登量'));
    } else if (value > 3000) {
      callback(new Error('每天刊登量超过最大限制'));
    } else {
      callback();
    }
  };
  const formRule = ref({
    storeNameStr: [
      { required: true, trigger: 'blur', message: '请输入店铺名' },
      {
        required: true,
        trigger: 'change',
        message: '请输入店铺名'
      }
    ],
    dailyPublishNums: {
      required: true,
      trigger: 'change',
      validator: validateDailyPublishNums
    }
  });

  const needFresh = ref(false);

  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) {
        formData.value = {
          ...props.storeInfo.rowData,
          storeNameStr:
            props.storeInfo.type !== 'add'
              ? props.storeInfo.rowData?.storeAcct
              : ''
        };
      } else {
        if (needFresh.value) {
          emits('handleStoreSearch');
        }
        needFresh.value = false;
      }
    }
  );

  const saveLoading = ref(false);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        saveLoading.value = true;
        try {
          let res = null;
          if (props.storeInfo.type === 'edit') {
            res = await editStoreApi(formData.value);
          } else {
            res = await addStoreApi({
              ...formData.value,
              ruleId: props.ruleId
            });
          }
          ElMessage.success(res.msg);
          needFresh.value = true;
          dialogVisible.value = false;
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          saveLoading.value = false;
        }
      } else {
        console.log('error submit!', fields);
      }
    });
  };
</script>

<style lang="scss" scoped></style>
