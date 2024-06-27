<template>
  <el-dialog
    v-model="configNameDialogVisible"
    title="保存自定义搜索条件"
    width="25%"
    align-center
  >
    <el-form size="default">
      <el-form-item label="配置名称" prop="configName">
        <el-input v-model="configName" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="configNameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="configNameDialogSave(configNameRef)"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ref, defineProps, computed, watch } from 'vue';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(['update:modelValue', 'configName']);

  const configNameDialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  watch(
    () => configNameDialogVisible.value,
    async (val) => {
      if (val) {
        configName.value = '';
      }
    }
  );

  const configNameRef = ref(null);
  const configName = ref('');

  // 保存配置
  const configNameDialogSave = async () => {
    if (!configName.value) {
      return ElMessage.warning('请输入配置名称');
    }
    emits('configName', configName.value);
    configName.value = '';
    configNameDialogVisible.value = false;
  };
</script>
<style scoped lang="scss"></style>
