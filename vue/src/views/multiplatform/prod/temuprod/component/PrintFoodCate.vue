<template>
  <el-dialog
    v-model="dialogVisible"
    width="90%"
    style="height: 55%"
    align-center
    title="打印食品标类目"
    @close="handleClose"
  >
    <div v-loading="loading" class="content">
      <el-cascader-panel
        v-model="formData.catsIds"
        style="width: 100%; height: 350px"
        :options="oaList"
        filterable
        collapse-tags
        collapse-tags-tooltip
        max-collapse-tags="3"
        clearable
        :props="{
          multiple: true,
          label: 'title',
          children: 'data'
        }"
      ></el-cascader-panel>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, watch, onMounted, ref, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { setPrintFoodLabelApi } from '@/api/multiplatform/temuprod';
  import { getCateTree } from '@/api/publishs/temupublish';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectRecords: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue']);

  onMounted(() => {});

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        getCates();
      }
    }
  );

  const formData = reactive({
    catsIds: []
  });

  // 寻找初始要选中的节点
  const getAllLeafValuesChecked = (options) => {
    let leafValues = [];
    const traverse = (options) => {
      options.forEach((item) => {
        if (item.data && item.data.length > 0) {
          traverse(item.data);
        } else if (item.checked === true) {
          leafValues.push(item.value);
        }
      });
    };
    traverse(options);
    return leafValues;
  };

  const loading = ref(false);
  const oaList = ref([]);

  // 获取类目
  const oldCatsIds = ref([]);
  const getCates = async () => {
    loading.value = true;
    try {
      const { code, data } = await getCateTree().finally(
        () => (loading.value = false)
      );
      if (code === '0000') {
        oaList.value = JSON.parse(data);
        formData.catsIds = getAllLeafValuesChecked(oaList.value);
        oldCatsIds.value = getAllLeafValuesChecked(oaList.value);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 保存
  const handleSubmit = async () => {
    loading.value = true;
    let arr = [];
    const isSame =
      JSON.stringify(oldCatsIds.value) === JSON.stringify(formData.catsIds);
    arr = formData.catsIds.map((item) => {
      return {
        value: isSame ? item : item[item.length - 1],
        printFoodLabel: 1
      };
    });

    const { code, msg } = await setPrintFoodLabelApi(arr).finally(
      () => (loading.value = false)
    );
    if (code === '0000') {
      ElMessage.success('保存成功！' || msg);
      handleClose();
    } else {
      ElMessage.warning(msg);
    }
  };

  const handleClose = () => {
    dialogVisible.value = false;
    formData.catsIds = [];
  };
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 350px;
    :deep(.el-cascader-menu__wrap) {
      height: 350px !important;
    }
  }
</style>
