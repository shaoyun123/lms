<template>
  <el-dialog
    v-model="showPreview"
    :title="previewAction === 'case' ? '预览箱唛' : '预览发货单'"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div>
      <div
        v-for="(item, index) in previewContent"
        :key="index"
        style="margin-bottom: 10px"
      >
        <a
          :href="boxCodeVisitUrlPrex + item"
          target="_blank"
          class="case_link"
          >{{ item }}</a
        >
      </div>
    </div>
    <template #footer>
      <span>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { defineProps, toRefs, defineEmits, computed } from 'vue';
  const props = defineProps({
    showPreview: {
      type: Boolean,
      default: false
    },
    caseInfo: {
      type: Object,
      default: () => {}
    },
    previewAction: {
      type: String,
      default: 'case'
    },
    boxCodeVisitUrlPrex: {
      type: String,
      default: ''
    }
  });

  const previewContent = computed(() => {
    if (props.previewAction == 'case') {
      return props.caseInfo?.caseLabel?.split(',');
    } else {
      return props.caseInfo?.deliverOrderFile?.split(',');
    }
  });
  const emit = defineEmits(['close']);

  const { showPreview } = toRefs(props);

  const handleClose = () => {
    emit('close');
  };
</script>
<style lang="scss" scoped>
  .case_link {
    text-decoration: none;
    color: #409eff;
  }
</style>
