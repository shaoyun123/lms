<template>
  <div class="msg_wrapper">
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :width="600"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="remark"
        :rows="5"
        type="textarea"
        clearable
        placeholder="请输入"
      ></el-input>
      <template #footer>
        <span>
          <el-button
            type="primary"
            :loading="remarkLoading"
            @click="handleRemark"
          >
            备注
          </el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { updateRemark, batchUpdateRemark } from '@/api/shopee/aftersale';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue',
    'changeData',
    'handleSearch'
  ]);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const remarkLoading = ref(false);
  const remark = ref('');
  const title = ref('客服备注');
  onMounted(() => {
    // 判断是否是批量
    if (props.rowCheckedList.length) {
      title.value = '客服批量备注';
    } else {
      remark.value = JSON.parse(JSON.stringify(props.rowData.remark || ''));
    }
  });

  const handleRemark = async () => {
    const { id } = props.rowData;
    remarkLoading.value = true;
    try {
      // 判断是否是批量
      if (props.rowCheckedList.length) {
        const { msg } = await batchUpdateRemark({
          idList: props.rowCheckedList.map((v) => v.id),
          remark: remark.value
        });
        ElMessage.success(msg || '操作成功');
        emits('handleSearch');
      } else {
        const { msg } = await updateRemark(id, remark.value);
        ElMessage.success(msg || '操作成功');
        emits('changeData', { ...props.rowData, remark: remark.value });
      }
      remarkLoading.value = false;
      dialogVisible.value = false;
    } catch (err) {
      remarkLoading.value = false;
      console.log('err :>> ', err);
    }
  };
</script>

<style lang="scss" scoped>
  .msg_wrapper {
    // :deep() ;
    .msg_requier_tag {
      color: #f56c6c;
    }
    :deep(.el-row + .el-row) {
      margin-top: 10px;
    }
    .msg_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
</style>
