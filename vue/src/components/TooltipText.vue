<!-- 多行文本显示省略号 -->
<template>
  <el-tooltip v-if="initToolField" placement="right" :content="text">
    <div
      style="
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
      "
    >
      {{ text }}
    </div>
  </el-tooltip>
  <div v-else>
    {{ text }}
  </div>
</template>

<script setup>
  // eslint-disable-next-line
  const props = defineProps({
    initToolField: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  });
</script>
