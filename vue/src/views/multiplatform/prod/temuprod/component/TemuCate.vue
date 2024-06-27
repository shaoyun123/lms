<template>
  <el-dialog
    v-model="dialogVisible"
    width="90%"
    style="height: 55%"
    align-center
    title="Temu类目"
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
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, watch, onMounted, ref, reactive } from 'vue';
  import { getCateTree } from '@/api/publishs/temupublish';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    hasCateList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue', 'done']);

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

  // 回显选中的数据
  const matchAndSetChecked = (arr, values) => {
    for (let i = 0; i < arr.length; i++) {
      if (values.includes(arr[i].value)) {
        arr[i].checked = true;
      }
      if (arr[i].data) {
        matchAndSetChecked(arr[i].data, values);
      }
    }
    return arr;
  };

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
  const getCates = async () => {
    loading.value = true;
    try {
      const { code, data } = await getCateTree().finally(
        () => (loading.value = false)
      );
      if (code === '0000') {
        oaList.value = JSON.parse(data);
        if (props.hasCateList.length) {
          oaList.value = matchAndSetChecked(oaList.value, props.hasCateList);
          formData.catsIds = getAllLeafValuesChecked(oaList.value);
        } else {
          formData.catsIds = [];
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 确认
  const handleSubmit = async () => {
    let arr = [];
    arr =
      formData.catsIds && formData.catsIds.length
        ? formData.catsIds.map((item) => {
            return item[item.length - 1];
          })
        : [];
    const obj = {
      cateIdList: formData.catsIds,
      arr
    };
    emits('done', obj);
    dialogVisible.value = false;
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
