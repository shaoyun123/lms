<template>
  <el-dialog
    width="30%"
    title="初审"
    :model-value="showCheckDialog"
    destroy-on-close
    :close-on-click-modal="false"
    @close="submitCloseDialog"
  >
    <div class="radio-group-container">
      <el-radio-group v-model="checkVal">
        <el-radio :label="1" size="large" style="margin-bottom: 30px"
          >初审通过</el-radio
        >
        <el-radio :value="2" size="large">重复</el-radio>
        <el-radio :value="3" size="large">侵权</el-radio>
        <el-radio :value="4" size="large">
          <template #default>
            其他 请输入
            <el-input v-model="customVal" />
          </template>
        </el-radio>
      </el-radio-group>
      <div class="check_fail">初审失败</div>
    </div>
    <template #footer>
      <el-button type="primary" @click="submitCheck">确认</el-button>
      <el-button @click="submitCloseDialog">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
  import {
    defineProps,
    ref,
    defineEmits,
    computed
    // reactive
  } from 'vue';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    productId: {
      type: Number,
      default: 0
    },
    isBatchCheck: {
      // 是否批量
      type: Boolean,
      default: false
    },
    selectRecords: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['close', 'done']);
  const checkVal = ref('');
  const customVal = ref('');
  const showCheckDialog = computed(() => {
    return props.isVisible;
  });

  const submitCloseDialog = () => {
    emits('close');
  };

  let remarkMap = {
    1: '初审通过',
    2: '重复',
    3: '侵权',
    4: ''
  };
  const submitCheck = () => {
    let processStatus = 0;
    let productId = [];
    if (checkVal.value == '') {
      return ElMessage.error('请选择初审结果');
    }
    if (checkVal.value === 4 && customVal.value == '') {
      return ElMessage.warning('请输入初审失败原因');
    }
    if (checkVal.value === 1) {
      // 初审通过 4
      processStatus = 4;
    } else {
      // 初审失败 3
      processStatus = 3;
    }
    if (props.isBatchCheck) {
      productId = props.selectRecords.map((item) => item.id);
    } else {
      productId = [props.productId];
    }
    let obj = {
      productId,
      processStatus,
      checkVal: checkVal.value,
      remark: remarkMap[checkVal.value],
      customVal: customVal.value
    };
    emits('done', obj);
  };
</script>
<style lang="scss" scoped>
  .radio-group-container {
    position: relative;
    .el-radio-group {
      margin-left: 30px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .check_fail {
    position: absolute;
    top: 43px;
    left: 30px;
  }
</style>
