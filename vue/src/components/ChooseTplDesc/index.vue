<template>
  <el-dialog
    v-model="dialogVisible"
    title="模板图片"
    width="60%"
    top="3%"
    :append-to-body="false"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <div v-loading="initLoading" class="img_container">
      <template v-if="descList.length">
        <div v-for="item in descList" :key="item.id">
          <el-checkbox v-model="item.checked" :label="item.pSku" size="large" />
          <div class="textTpl">{{ item.prodDesc }}</div>
        </div>
      </template>

      <el-empty v-else description="暂无数据" />
    </div>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { getTemplateDescApi } from '@/api/common/index';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    params: {
      type: [Object, Array],
      default: () => ({})
    },
    limit: {
      type: [Number, String],
      default: 0
    },
    descParams: {
      type: String,
      default: ''
    }
  });

  const emits = defineEmits(['update:modelValue', 'getTplDesc']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const descList = ref([]);
  const initLoading = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        try {
          initLoading.value = true;
          const { data } = await getTemplateDescApi(props.descParams);
          descList.value = (data || []).map((item) => ({
            ...item,
            checked: false
          }));
        } catch (err) {
          descList.value = [];
          console.log('err :>> ', err);
        }
        initLoading.value = false;
      }
    }
  );
  const handleCancel = () => {
    dialogVisible.value = false;
  };
  const handleSubmit = async () => {
    dialogVisible.value = false;
    const checkedDescStr = descList.value
      .filter((item) => item.checked)
      .map((item) => item.prodDesc)
      .join('\n');
    emits('getTplDesc', checkedDescStr);
  };
</script>

<style lang="scss" scoped>
  .img_container {
    max-height: 550px;
    overflow-y: auto;
  }
  .textTpl {
    overflow-y: scroll;
    height: 200px;
    font-size: 14px;
    color: #333;
    line-height: 26px;
    padding: 10px;
    border: 1px solid #e6e1e1;
    white-space: pre-wrap;
  }
</style>
