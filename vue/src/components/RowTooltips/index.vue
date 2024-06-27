<template>
  <div class="showElipsis">
    <el-popover
      placement="bottom"
      :width="400"
      :hide-after="0"
      trigger="hover"
      @hide="handleThumbnailMouseLeave"
    >
      <template #default>
        <div v-if="props.info" v-html="props.info"></div>
      </template>
      <template #reference>
        <div
          v-if="props.info"
          @mouseenter="handleThumbnailMouseEnter"
          v-html="props.info"
        ></div>
        <div v-else>暂无数据</div>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const props = defineProps({
    info: {
      type: String,
      default: ''
    }
  });
  const showPop = ref(false);
  const handleThumbnailMouseEnter = () => {
    showPop.value = true;
  };

  // 弹窗隐藏 关闭预览图
  const handleThumbnailMouseLeave = () => {
    showPop.value = false;
  };
</script>

<style lang="scss" scoped>
  .showElipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
    -webkit-line-clamp: 1;
  }
</style>
