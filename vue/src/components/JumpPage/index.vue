<template>
  <!-- 任务中心的提示 -->
  <el-dialog v-model="dialogVisible" :title="title" width="350">
    <el-link type="primary" @click="handleJumpTaskCenter">
      <el-icon v-if="status" :size="30" :color="successColor" class="mr20">
        <CircleCheck />
      </el-icon>
      <el-icon v-else :size="30" :color="dangerColor" class="mr20">
        <CircleClose />
      </el-icon>
      {{ content }}
    </el-link>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { successColor, dangerColor } from '@/styles/vars.module.scss';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '导入结果'
    },
    content: {
      type: String,
      default: '导入成功！请到任务中心查看导入结果'
    },
    page: {
      type: String,
      default: '/shopee/operate/taskcenter'
    },
    status: {
      type: Boolean,
      default: true
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

  const router = useRouter();
  const handleJumpTaskCenter = () => {
    router.push(props.page);
  };
</script>

<style lang="scss" scoped>
  :deep(.el-link__inner) {
    word-break: break-word;
    .el-icon {
      margin-right: 12px;
    }
  }
</style>
