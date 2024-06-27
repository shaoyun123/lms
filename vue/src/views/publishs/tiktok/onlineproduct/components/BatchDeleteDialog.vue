<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="批量删除商品"
      width="20%"
      align-center
      center
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @close="close"
    >
      <div class="my-8 text-center">
        <div v-if="isAllGlobalProduct">
          将删除商品对应的全球商品,确认要删除吗?
        </div>
        <div v-else>
          以下全球商品存在其他店铺在线商品:
          <span>{{ batchDeleteInfo.unMatchGlobalList?.join(',') }}</span
          >, 确认要删除吗?
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <div v-if="isAllGlobalProduct">
            <el-button type="primary" @click="confirmDelete(0)">确认</el-button>
            <el-button @click="close">取消</el-button>
          </div>
          <div v-else>
            <el-button type="primary" @click="confirmDelete(1)"
              >全部删除</el-button
            >
            <el-button type="primary" @click="confirmDelete(2)"
              >删除其余商品</el-button
            >
            <el-button @click="close">取消</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { ElMessage } from 'element-plus';
  import { batchDeleteGlobalProductApi } from '@/api/publishs/tiktokonlineproduct';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    batchDeleteInfo: {
      type: Object,
      default: () => {}
    }
  });

  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const isAllGlobalProduct = ref(true);

  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) {
        const info = props.batchDeleteInfo;
        if (info !== '') {
          if (info.unMatchGlobalList && info.unMatchGlobalList.length) {
            isAllGlobalProduct.value = false;
          } else {
            isAllGlobalProduct.value = true;
          }
        }
      }
    }
  );

  // 点击删除
  const confirmDelete = async (type) => {
    // type 0 全球商品删除 1 全部删除 2 部分删除
    let params = [];
    const info = props.batchDeleteInfo;
    switch (type) {
      case 0:
        params = info.matchGlobalList;
        break;
      case 1:
        params = info.matchGlobalList.concat(info.unMatchGlobalList);
        break;
      case 2:
        params = info.matchGlobalList;
        break;
    }

    if (!params.length) {
      return ElMessage.warning('操作失败：目前没有可操作的数据');
    }
    const { code, msg } = await batchDeleteGlobalProductApi(params);
    if (code === '0000') {
      ElMessage.success(msg || '操作成功');
      emits('handleSearch');
      close();
    }
  };

  // 关闭
  const close = () => {
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  .my-8 {
    margin: 8px 0;
  }
  .text-center {
    text-align: center;
  }
</style>
