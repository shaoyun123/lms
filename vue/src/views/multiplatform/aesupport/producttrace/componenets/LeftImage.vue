<template>
  <div>
    <el-popover placement="right" width="500px" :hide-after="0" trigger="hover">
      <template #default>
        <div class="left-pop">
          <el-image :src="imageUrl" />
          <span v-if="cardItem.hasSupplierReply" class="left-pop-text">
            已有供应商参与</span
          >
          <span v-else class="left-pop-text no-supplier">暂无供应商参与</span>
        </div>
      </template>
      <template #reference>
        <div class="left-image">
          <el-image loading="lazy" :src="imageUrl" style="width: 120px">
            <template #placeholder>
              <div class="image-slot">Loading<span class="dot">...</span></div>
            </template>
          </el-image>
          <span v-if="cardItem.hasSupplierReply" class="left-image-text">
            已有供应商参与</span
          >
          <span v-else class="left-image-text no-supplier">暂无供应商参与</span>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  const props = defineProps({
    cardItem: {
      type: Object,
      default: () => ({})
    }
  });
  const imageUrl = computed(() => {
    if (props.cardItem?.expectShowListStr) {
      return props.cardItem.expectShowListStr.split(',')[0];
    }
    return '';
  });
</script>

<style lang="scss" scoped>
  .left-pop,
  .left-image {
    position: relative;
  }
  .left-image {
    width: 120px;
  }
  .left-pop-text,
  .left-image-text {
    display: inline-block;
    padding: 4px;
    color: white;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: default;
    position: absolute;
    left: 0;
    right: 0;
  }
  .left-image-text {
    bottom: 0px;
  }
  .left-pop-text {
    bottom: 10px;
  }
  .no-supplier {
    background-color: rgba(2, 107, 255, 0.7);
  }
</style>
