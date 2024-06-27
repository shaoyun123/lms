<template>
  <div class="imagepop_wrapper">
    <el-popover
      popper-class="common_height_500"
      placement="right"
      :width="500"
      :hide-after="0"
      trigger="hover"
      v-bind="attrs"
      @hide="handleThumbnailMouseLeave"
    >
      <template #default>
        <el-image
          v-if="showPop"
          style="width: 100%; height: 100%"
          loading="lazy"
          :src="src"
        />
      </template>
      <template #reference>
        <el-image
          loading="lazy"
          :src="comGetThumbnailUrl(src, width, height)"
          :style="{ width, height }"
          @mouseenter="handleThumbnailMouseEnter"
        >
          <template #placeholder>
            <div class="image-slot">Loading<span class="dot">...</span></div>
          </template>
          <template #error>
            <div class="image-slot">
              {{ src ? '加载失败' : '暂无图片' }}
            </div>
          </template>
        </el-image>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
  import { ref, useAttrs } from 'vue';
  import { comGetThumbnailUrl } from '@/utils/common';
  const attrs = useAttrs();
  defineProps({
    src: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '80px'
    },
    width: {
      type: String,
      default: '80px'
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
  .imagepop_wrapper {
    :deep(el-image) {
      height: var(height);
      width: var(width);
    }
    .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
    .dot {
      animation: dot 2s infinite steps(3, start);
      overflow: hidden;
    }
  }
</style>
