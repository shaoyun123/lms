<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="500"
    :close-on-click-modal="false"
  >
    <div class="dialog_container">
      <el-form
        ref="addrFormRef"
        :model="addrForm"
        label-width="80px"
        :rules="rules"
        size="default"
      >
        <el-form-item label="地址简称" prop="alias">
          <el-input
            v-model="addrForm.alias"
            placeholder="请输入地址简称"
            clearable
          />
        </el-form-item>
        <el-form-item label="平台" prop="platCode">
          <el-select v-model="addrForm.platCode" filterable>
            <el-option
              v-for="item in platCodes"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input
            v-model="addrForm.receivor"
            placeholder="请输入收件人"
            clearable
          />
        </el-form-item>
        <el-form-item label="电话/手机" prop="phoneNumber">
          <el-input
            v-model.number="addrForm.phoneNumber"
            placeholder="请输入电话/手机"
            clearable
          />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            v-model="addrForm.detail"
            placeholder="请输入详细地址"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog_footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSave(addrFormRef)">{{
          title
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import {
    computed,
    defineProps,
    defineEmits,
    ref,
    onMounted,
    reactive,
    watch
  } from 'vue';
  import { updateAddress, addAddress } from '@/api/multiplatform/address';
  import { ElMessage } from 'element-plus';
  import { getAllPlatList } from '@/api/common/index.js';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: () => {}
    }
  });
  const emits = defineEmits(['update:modelValue', 'onSearch', 'changeData']);
  const title = computed(() => {
    return JSON.stringify(props.rowData) === '{}' ? '添加' : '修改';
  });
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const addrForm = ref({});
  const platCodes = ref({});
  const addrFormRef = ref(null);
  const rules = reactive({
    alias: [{ required: true, trigger: 'blur', message: '请填写地址简称' }],
    platCode: [{ required: true, trigger: 'change', message: '请选择平台' }]
  });

  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) addrForm.value = JSON.parse(JSON.stringify(props.rowData));
    }
  );

  onMounted(async () => {
    try {
      const { data } = await getAllPlatList();
      platCodes.value = data;
    } catch (err) {
      console.log('err :>> ', err);
    }
  });
  const handleSave = async (formEl) => {
    // 校验
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          // 新增
          if (JSON.stringify(props.rowData) === '{}') {
            const { msg } = await addAddress(addrForm.value);
            ElMessage.success(msg || '新增成功');
            emits('onSearch');
          } else {
            // 修改
            const { msg } = await updateAddress(addrForm.value);
            ElMessage.success(msg || '保存成功');
            emits('changeData', addrForm.value);
          }
          dialogVisible.value = false;
        } catch (err) {
          console.log('err :>> ', err);
        }
      }
    });
  };
</script>

<style lang="scss" scoped></style>
