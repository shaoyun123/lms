<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="dialog_wrapper"
      title="退款拒绝申请"
      :width="600"
      align-center
      style="max-height: 500px; overflow: auto"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        label-width="80"
        size="default"
        :rules="formRule"
      >
        <el-form-item label="拒绝原因" prop="rejectReasonKey">
          <el-select v-model="formData.rejectReasonKey">
            <el-option
              v-for="item in refuseReasonList"
              :key="item.reverseReasonKey"
              :value="item.reverseReasonKey"
              :label="item.reverseReason" /></el-select
        ></el-form-item>
        <el-form-item label="附加内容" prop="reverseRejectComments"
          ><el-input
            v-model="formData.reverseRejectComments"
            type="textarea"
            :autosize="{ minRows: 3 }"
            placeholder="请明确说明拒绝申请的原因"
            maxlength="500"
            show-word-limit
          >
          </el-input
        ></el-form-item>
      </el-form>
      <template #footer>
        <el-button
          :loading="submitLoading"
          type="primary"
          @click="handleSubmit(formRef)"
          >提交</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, reactive, ref, watch } from 'vue';
  import {
    getRejectReasonListApi,
    rejectReverseApi,
    batchRejectReverse
  } from '@/api/publishs/tiktokaftersale';
  import { ElMessage, ElMessageBox } from 'element-plus';
  // eslint-disable-next-line
  const props = defineProps({
    // 单项
    rowData: {
      type: Object,
      default: () => {}
    },
    // 批量
    checkedList: {
      type: Array,
      default: () => []
    },
    // 是否是批量
    isHandleBatch: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Boolean,
      default: true
    },
    queryType: {
      type: String || Number,
      default: 0
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'freshData']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const formData = reactive({});
  const formRef = ref();
  const formRule = ref({
    rejectReasonKey: [
      { required: true, message: '请选择拒绝原因', triggrt: 'change' }
    ]
  });
  // 拒绝原因列表
  const refuseReasonList = ref([]);

  watch(dialogVisible, async (val) => {
    if (val) {
      try {
        //reasonType 待处理的填2, 待收货拒绝填3
        const reasonType = props.queryType === '1' ? 2 : 3;
        const params = {
          reasonType,
          storeAcctId: props.isHandleBatch
            ? props.checkedList[0].storeAcctId
            : props.rowData.storeAcctId,
          reverseType: props.isHandleBatch
            ? props.checkedList[0].reverseType
            : props.rowData.reverseType
        };
        const { data } = await getRejectReasonListApi(params);
        refuseReasonList.value = data;
      } catch (err) {
        console.log('err :>> ', err);
      }
    } else {
      formRef.value.resetFields();
      refuseReasonList.value = [];
    }
  });
  const submitLoading = ref(false);
  const handleSubmit = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        // 单个拒绝
        if (!props.isHandleBatch) {
          try {
            submitLoading.value = true;
            const params = {
              reverseOrderId: props.rowData.reverseOrderId,
              storeAcctId: props.rowData.storeAcctId,
              ...formData
            };
            const { msg } = await rejectReverseApi(params);
            ElMessage.success(msg);
            dialogVisible.value = false;
            emits('freshData');
          } catch (err) {
            console.log('err :>> ', err);
          } finally {
            submitLoading.value = false;
          }
        } else {
          // 批量拒绝
          try {
            const params = {
              reverseOrderIdList: props.checkedList.map(
                (item) => item.reverseOrderId
              ),
              ...formData
            };
            const { data, code } = await batchRejectReverse(params);
            if (code === '0000') {
              ElMessage.success('操作成功！');
              dialogVisible.value = false;
              emits('freshData');
            } else {
              let str = '';
              data?.forEach((item) => {
                str =
                  str + item.errorMsg + ':' + item.errorOrderIdStr + '<br/>';
              });

              ElMessageBox.alert(str || '请求失败', '错误信息', {
                confirmButtonText: '确认',
                type: 'error',
                dangerouslyUseHTMLString: true,
                customClass: 'tipErrorWidth'
              });
            }
          } catch (err) {
            console.log('err :>> ', err);
          }
        }
      }
    });
  };
</script>

<style lang="scss">
  .tipErrorWidth {
    .el-message-box__container {
      word-break: break-all;
    }
  }
</style>
