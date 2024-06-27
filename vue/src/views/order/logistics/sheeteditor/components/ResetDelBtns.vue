<template>
  <div class="label_set_btns">
    <el-button v-if="showCopyBtn" type="success" @click="handleCopy"
      >复制</el-button
    >
    <el-popconfirm
      v-if="showResetBtn"
      title="确定重置该组件吗?"
      :teleported="false"
      :width="180"
      @confirm="handleReset"
    >
      <template #reference>
        <el-button type="success">重置</el-button>
      </template>
    </el-popconfirm>
    <el-popconfirm
      title="确定删除该组件吗?"
      :teleported="false"
      :width="180"
      @confirm="handleDel"
    >
      <template #reference>
        <el-button type="danger" style="margin-left: 10px">删除</el-button>
      </template>
    </el-popconfirm>
    <el-button v-if="showAddPreSetBtn" type="success" @click="handleAddPreImg"
      >新增预设图片</el-button
    >
  </div>
</template>

<script setup>
  import {} from 'vue';

  defineProps({
    showCopyBtn: {
      type: Boolean,
      default: false
    },
    showAddPreSetBtn: {
      type: Boolean,
      default: false
    },
    showResetBtn: {
      type: Boolean,
      default: true
    }
  });
  const emits = defineEmits(['del', 'handleReset', 'copy', 'handleAddPreImg']);
  const handleDel = () => {
    emits('del');
  };
  const handleReset = () => {
    emits('handleReset');
  };
  const handleAddPreImg = async () => {
    emits('handleAddPreImg');
  };
  const handleCopy = () => {
    emits('copy');
  };
</script>

<style lang="scss" scoped>
  .label_set_btns {
    text-align: center;
    margin-top: 10px;
  }
</style>
