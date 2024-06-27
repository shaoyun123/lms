<template>
  <el-dialog
    v-model="dialogVisible"
    width="62%"
    style="height: 85%; padding: 5px"
    align-center
    title="修改物流信息"
    @close="handleClose"
  >
    <div class="content">
      <div v-loading="loading" class="skuList">
        <div
          v-for="(item, index) in detailList"
          :key="index"
          class="varietyList"
        >
          <BatchLogisticsInfoItem
            ref="logisticsInfoRef"
            :item="item"
            :index="index"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleApply">提交修改</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, watch, ref } from 'vue';
  import {
    batchGetLogisInfoApi,
    batchUpdateLogisInfoApi
  } from '@/api/publishs/aehalfhosted';
  import BatchLogisticsInfoItem from './BatchLogisticsInfoItem.vue';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    productIdList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue', 'handleSearch']);
  const needFresh = ref(false);

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
        handleClose();
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
      } else {
        queryList();
      }
    }
  );

  // 弹窗loading
  const loading = ref(false);

  const detailList = ref([]);

  // 获取列表
  const queryList = async () => {
    const { data } = await batchGetLogisInfoApi(props.productIdList).finally(
      () => (loading.value = false)
    );
    detailList.value = data;
  };

  const logisticsInfoRef = ref(null);
  // 点击提交修改
  const handleApply = async () => {
    let paramsList = [];
    let paramsObjList = [];

    logisticsInfoRef.value.forEach((item) => {
      const resultObj = item.resultObj();
      paramsObjList.push(resultObj.detailListItem);

      const list = resultObj.tableList.map((el) => {
        el.productId = resultObj.detailListItem.productId;
        el.storeAcctId = resultObj.detailListItem.storeAcctId;
        return el;
      });
      paramsList.push(...list);
    });

    // 校验paramsList
    let wrongMsg = '';

    paramsList.forEach((item) => {
      if (item.originalBox === '') {
        wrongMsg = '请选择是否原箱！';
      }

      // 重量、尺寸
      if (
        !item.packageLength ||
        !item.packageWidth ||
        !item.packageHeight ||
        !item.packageWeight
      ) {
        wrongMsg = '重量、包装尺寸均不能为空且必须大于0！';
      }
    });

    if (wrongMsg) {
      return ElMessage.warning(wrongMsg);
    }

    loading.value = true;
    const { code } = await batchUpdateLogisInfoApi(paramsObjList).finally(
      () => (loading.value = false)
    );
    needFresh.value = true;

    if (code === '0000') {
      ElMessage.warning('提交成功,修改结果请查看日志！');
      handleClose();
    }
  };

  const handleClose = () => {
    dialogVisible.value = false;
    logisticsInfoRef.value.forEach((item) => {
      item.clearFormInfo();
    });
  };
</script>
<style lang="scss" scoped>
  :deep(.el-card__header) {
    background-color: #eee;
  }
  .content {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 300px);
    margin-top: -30px;
    .skuList {
      flex: 1;
    }
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item {
    margin-bottom: 18px;
  }
</style>
