<template>
  <el-dialog
    v-model="dialogVisible"
    title="说明及示意图"
    width="800px"
    :align-center="true"
    :close-on-click-modal="false"
  >
    <div>
      <div class="header">
        <div v-if="cardItem.propertyDesc">{{ cardItem.propertyDesc }}</div>
        <div v-if="cardItem.taskDesc">{{ cardItem.taskDesc }}</div>
      </div>
      <el-carousel
        indicator-position="outside"
        height="500px"
        arrow="always"
        :autoplay="false"
      >
        <el-carousel-item v-for="item in imageList" :key="item">
          <el-image :src="item" fit="contain" style="width: 500px" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-dialog>
</template>

<script setup>
  import { computed } from 'vue';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    cardItem: {
      type: Object,
      default: () => ({})
    }
  });
  const emits = defineEmits(['update:modelValue']);
  const imageList = computed(() => {
    if (props.cardItem.expectShowListStr) {
      return props.cardItem.expectShowListStr.split(',');
    }
    return [];
  });

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
</script>

<style lang="scss" scoped>
  :deep(.el-carousel__item) {
    text-align: center;
  }
  :deep(.el-carousel__indicators--outside button) {
    background-color: #595e68;
    height: 3px;
    border-radius: 10px;
  }
  .header {
    padding: 2px 7px;
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fde2e2;
    border-radius: 4px;
  }
</style>
