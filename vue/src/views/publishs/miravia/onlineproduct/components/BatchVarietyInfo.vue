<template>
  <el-dialog
    v-model="dialogVisible"
    width="72%"
    style="height: 80%; padding: 5px"
    align-center
    title="修改变种信息"
    @close="handleClose"
  >
    <div class="content">
      <div class="justify-end mb-10">
        <el-button type="primary" @click="handleApply">提交修改</el-button>
      </div>
      <div v-loading="loading" class="skuList">
        <div
          v-for="(item, index) in detailList"
          :key="index"
          class="varietyList"
        >
          <BatchVarietyInfoItem
            ref="varietyInfoRef"
            :item="item"
            :index="index"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
  import { computed, watch, ref } from 'vue';
  import {
    batchQueryVariantInfo,
    batchModifyVariantInfo
  } from '@/api/publishs/miraviaonline';
  import BatchVarietyInfoItem from './BatchVarietyInfoItem.vue';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    varietyInfoParamsList: {
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
    loading.value = true;
    const { data } = await batchQueryVariantInfo(
      props.varietyInfoParamsList
    ).finally(() => (loading.value = false));

    detailList.value = data;
    detailList.value.forEach((item) => {
      item.prodSyncSMiraviaDtoList.forEach((cItem) => {
        cItem.skuProperty = cItem.skuProperty
          ? JSON.parse(cItem.skuProperty)
          : [];
      });
    });
  };

  const varietyInfoRef = ref(null);
  // 点击提交修改
  const handleApply = async () => {
    let checkedList = [];

    varietyInfoRef.value.forEach((item) => {
      const resultObj = item.resultObj();
      const list = resultObj.checkedList.map((el) => {
        el.productId = resultObj.detailListItem.productId;
        el.storeAcctId = resultObj.detailListItem.storeAcctId;
        return el;
      });
      checkedList.push(...list);
    });

    if (checkedList.length === 0) {
      return ElMessage.warning('请选择数据！');
    }

    // 校验checkedList
    let wrongMsg = '';

    checkedList.forEach((item) => {
      if (!item.storeSSku) {
        wrongMsg = '卖家SKU不能为空！';
      }

      // 销售属性不能为空 有图片的图片也不能为空
      // if (!item.skuImageList) {
      //   wrongMsg = '图片不能为空！';
      // }

      if (item.skuProperty) {
        JSON.parse(item.skuProperty).forEach((item) => {
          if (!item.skuPropertyValue) {
            wrongMsg = '销售属性不能为空！';
          }
        });
      }

      // 零售价、促销价、重量、尺寸不能为0 不能为0
      if (
        !item.skuPrice ||
        !item.skuDiscountPrice ||
        !item.packageLength ||
        !item.packageWidth ||
        !item.packageHeight ||
        !item.packageWeight
      ) {
        wrongMsg = '零售价、促销价、重量、尺寸均不能为空且必须大于0！';
      }

      // 库存不能为空
      if (item.skuStock === '') {
        wrongMsg = '库存不能为空！';
      }
    });

    if (wrongMsg) {
      return ElMessage.warning(wrongMsg);
    }

    loading.value = true;
    const { code } = await batchModifyVariantInfo(checkedList).finally(
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
    varietyInfoRef.value.forEach((item) => {
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
    height: calc(100vh - 280px);
    margin-top: -30px;
    .skuList {
      flex: 1;
    }
  }

  .flex {
    display: flex;
    align-items: center;
  }
  .justify-end {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
</style>
