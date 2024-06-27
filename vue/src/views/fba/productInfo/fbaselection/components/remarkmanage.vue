<!-- 常用备注管理弹窗 暂时没有用到 先保留 -->
<template>
  <el-dialog
    class="remark_dialog"
    width="650px"
    :model-value="showRemarkDialog"
    destroy-on-close
    :close-on-click-modal="false"
    @close="submitCloseDialog"
  >
    <template #header>
      <div class="dialog_title">
        <div class="large_title">常用备注管理</div>
      </div>
    </template>
    <div class="remark_title">
      <div style="width: 100px">序号</div>
      <div style="width: 400px">备注内容</div>
      <div style="width: 100px">操作</div>
    </div>
    <div
      v-for="(item, index) in remarkList"
      :key="index"
      style="display: flex; margin-bottom: 10px"
      :draggable="true"
      @dragstart="dragstart(index)"
      @dragenter="dragenter(index, $event)"
      @dragend="dragend(item, $event)"
      @dragover="dragover($event)"
    >
      <div style="width: 100px">{{ item.sort }}</div>
      <div style="width: 400px">
        <el-input
          v-model="item.name"
          maxlength="20"
          style="width: 80%"
        ></el-input>
      </div>
      <div style="width: 100px">
        <el-icon
          :size="20"
          style="cursor: pointer"
          @click="deleteRemarkRow(item)"
          ><Delete
        /></el-icon>
      </div>
    </div>
    <div style="margin-left: 500px; margin-top: 10px">
      <el-icon :size="20" style="cursor: pointer" @click="addRemarkRow"
        ><CirclePlus
      /></el-icon>
    </div>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleSave()">提交</el-button>
        <el-button @click="submitCloseDialog">返回</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ElMessage } from 'element-plus';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { getUsualRemark } from '@/api/fba/fbaselection';
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    }
  });

  onMounted(() => {
    getUsualRemarkList();
  });

  const emits = defineEmits(['close']);
  const showRemarkDialog = computed(() => {
    return props.isVisible;
  });
  // 获取常用备注
  const remarkList = ref([]);
  const getUsualRemarkList = async () => {
    const { code, data } = await getUsualRemark();
    if (code === '0000') {
      remarkList.value = data || [];
      remarkList.value?.forEach((item, index) => {
        item.sort = index + 1;
      });
    }
  };

  const submitCloseDialog = () => {
    emits('close');
  };

  // 添加备注行
  const addRemarkRow = () => {
    if (remarkList.value?.length >= 10) {
      return ElMessage.warning('只能添加到10条备注');
    }
    let obj = [
      {
        headCode: 'FBA_SELECTION_COMMON_REMARK',
        name: '',
        code: '',
        sort: remarkList.value?.length + 1
      }
    ];
    remarkList.value = remarkList.value.concat(obj);
  };

  // 删除备注行
  const deleteRemarkRow = (row) => {
    remarkList.value = remarkList.value.filter(
      (item, index) => index !== row.sort - 1
    );
    remarkList.value?.forEach((item, index) => {
      item.sort = index + 1;
    });
  };

  const drag = reactive({
    startIndex: '',
    endIndex: ''
  });
  const dragstart = (index) => {
    drag.startIndex = index;
  };

  const dragenter = (index, e) => {
    drag.endIndex = index;
    e.preventDefault();
  };

  const dragover = (e) => {
    e.preventDefault();
  };

  const dragend = () => {
    let temp = remarkList.value[drag.startIndex];
    remarkList.value[drag.startIndex] = remarkList.value[drag.endIndex];
    remarkList.value[drag.endIndex] = temp;

    remarkList.value?.forEach((item, index) => {
      item.sort = index + 1;
    });
  };
</script>
<style lang="scss" scoped>
  .remark_title {
    display: flex;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    font-weight: bold;
  }
  .dialog_title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  .large_title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .small_title {
    color: #666;
    font-size: 14px;
    font-weight: bold;
  }
</style>
<style lang="scss">
  .remark_dialog {
    .el-dialog__body {
      height: 400px;
    }
  }
</style>
