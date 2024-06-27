<template>
  <!-- 定时刊登 -->
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="定时刊登设置"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRule" size="default">
        <el-form-item label="定时刊登开始时间" prop="listTiming">
          <el-date-picker
            v-model="formData.listTiming"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
            placeholder="请选择定时刊登开始时间"
          />
        </el-form-item>
        <el-form-item label="listing刊登间隔(分)" prop="listInterval">
          <el-input-number
            v-model="formData.listInterval"
            :min="1"
            :step="1"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="刊登店铺" prop="salesSiteList">
          <ZSelect
            v-model="formData.storeAcctIdList"
            :items="storeList"
            :num="1"
            :disabled-val="storeAcctName"
          />
        </el-form-item>
        <div>
          <el-text type="info">
            若选择的店铺里存在选中模板待刊登数据，将同步刊登；<br />
            若刊登时无剩余刊登量，则留存在待刊登数据
          </el-text>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="handleTimingPublish(formRef)"
            >定时刊登</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, reactive, watch } from 'vue';
  import { listTimingApi } from '@/api/publishs/tiktokpublish';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import ZSelect from '@/components/ZSelect/index.vue';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    },
    storeList: {
      type: Array,
      default: () => []
    },
    storeAcctId: {
      type: Number,
      default: null
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'handleRefresh'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const storeAcctName = computed(() => {
    let storeName = [];
    props.storeList.forEach((item) => {
      if (item.id === props.storeAcctId) {
        storeName.push(item.name);
      }
    });
    return storeName;
  });

  const formRef = ref();
  const formData = reactive({
    listTiming: '',
    storeAcctIdList: []
  });
  const needFresh = ref(false);
  const validateStartTime = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请选择定时刊登时间'));
    } else {
      const valueTime = new Date(value).getTime();
      const curRime = Date.now();
      if (valueTime - curRime < 0) {
        callback(new Error('定时刊登时间需大于当前时间'));
      }
      callback();
    }
  };
  const formRule = ref({
    listTiming: [
      {
        required: true,
        validator: validateStartTime,
        trigger: 'change'
      },
      {
        required: true,
        validator: validateStartTime,
        trigger: 'blur'
      }
    ],
    listInterval: {
      required: true,
      message: '请选择listing刊登间隔(分)',
      trigger: 'blur'
    },
    storeAcctIdList: {
      type: 'array',
      required: true,
      message: '请至少选择一个店铺',
      trigger: 'change'
    }
  });

  const btnLoading = ref(false);
  const handleTimingPublish = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          let params = {
            listTiming: formData.listTiming,
            listInterval: formData.listInterval,
            idList: props.rowCheckedList.value.map((item) => item.id),
            storeAcctIdList: formData.storeAcctIdList
          };
          const { msg, data } = await listTimingApi(params);

          if (Array.isArray(data)) {
            const failList = data.filter((item) => !item.success);
            if (failList.length) {
              const failMsg = failList
                .map(
                  (item) =>
                    `<span style="color:#409EFF">${item.prodPSku}</span>` +
                    ': ' +
                    String(item.storeAcct || '') +
                    item.operationMessage
                )
                .join('\n');
              const failHtml = `<div style="white-space:pre-line">${failMsg}</div>`;
              ElMessageBox.alert(failHtml || '请求失败', '失败信息', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确认',
                type: 'error',
                callback: () => {
                  if (failList?.length !== data?.length) {
                    emits('handleSearch');
                  }
                  dialogVisible.value = false;
                }
              });
            } else {
              ElMessage.success(msg || '操作成功');
              dialogVisible.value = false;
              emits('handleSearch');
              needFresh.value = true;
            }
          } else {
            ElMessageBox.alert(msg, '失败信息', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确认',
              type: 'error'
            });
          }
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          btnLoading.value = false;
        }
      }
    });
  };

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        formData.storeAcctIdList = [props.storeAcctId];
      }
      if (!val) {
        if (formRef.value) {
          formRef.value.resetFields();
        }
        if (needFresh.value) {
          emits('handleSearch');
          emits('handleRefresh');
          needFresh.value = false;
        }
      }
    },
    {
      immediate: true
    }
  );
</script>

<style lang="scss" scoped></style>
