<template>
  <div class="fullDialog">
    <el-dialog
      :model-value="dialogVisible"
      title="同步listing结果"
      width="600px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div>
        <el-progress
          :percentage="percentage"
          status="success"
          :text-inside="true"
          :stroke-width="22"
        />
        <div>{{ content }}</div>
        <div v-if="errorMsg">
          <span>异常店铺:</span>
          <div id="unnormalstore" class="error-msg"></div>
        </div>
      </div>

      <template #footer>
        <el-button type="primary" @click="closeDialog">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
  import { batchSyncPlatListingApi } from '@/api/configure/shopeeaccount';
  import { getSyncProcessByBatchNoApi } from '@/api/configure/common';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectRecords: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue']);
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

  const percentage = ref(0);
  const content = ref();
  const errorMsg = ref();

  const apiObj = {
    shopee: batchSyncPlatListingApi
  };

  const params = {
    batchNo: new Date().getTime(), //本次同步任务流水号
    acctIds: props.selectRecords.map((v) => v.id).join(),
    platCode: props.selectRecords[0].platCode
  };
  onMounted(async () => {
    const platCode = props.selectRecords[0].platCode;
    try {
      apiObj[platCode](params).then(({ data }) => {
        percentage.value = parseInt(data.precent);
        content.value = data.content;
        errorMsg.value = data.errorMsg;
        if (data.content != null && data.content.indexOf('完成') > -1) {
          clearInterval(listInterval); //清除定时任务
        }
      });
    } catch (err) {
      console.log('err :>> ', err);
    }
  });

  const listInterval = setInterval(async () => {
    try {
      const { data } = await getSyncProcessByBatchNoApi({
        batchNo: params.batchNo,
        platCode: params.platCode
      });
      content.value = '正在同步中';
      errorMsg.value = data.errorMsg;
      percentage.value = parseInt(data.precent);

      if (data.content != null && !data.content.indexOf('完成') > -1) {
        clearInterval(listInterval); //清除定时任务
      }
    } catch (err) {
      content.value = '获取同步lisiting进度失败';
    }
  }, 2000);

  watch(
    () => errorMsg.value,
    (val) => {
      nextTick(() => {
        const errorDiv = document.getElementById('unnormalstore');
        errorDiv.innerHTML = val;
      });
    }
  );

  onUnmounted(() => {
    clearInterval(listInterval); //清除定时任务
  });
</script>

<style lang="scss" scoped>
  .error-msg {
    word-break: break-all;
  }
</style>
