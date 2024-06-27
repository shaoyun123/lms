<template>
  <el-dialog
    v-model="dialogVisible"
    :title="configobj[type].title"
    :width="600"
    :close-on-click-modal="false"
    :align-center="true"
    :destroy-on-close="false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :label-width="120"
      :rules="formRules"
      class="detail-form"
    >
      <el-form-item label="站点" prop="salesSite">
        <el-select v-model="formData.salesSite" filterable clearable>
          <el-option
            v-for="item in initList.siteList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
        /></el-select>
      </el-form-item>
      <el-form-item label="过滤词中文" prop="prohibitWord">
        <el-input v-model="formData.prohibitWord" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="过滤词英文" prop="prohibitWordEn">
        <el-input v-model="formData.prohibitWordEn" placeholder="" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { addNewApi, updateApi } from '@/api/shopee/descprohibitword';
  import { cloneDeep, isEmpty } from 'lodash-es';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => ({})
    },
    initList: {
      type: Object,
      default: () => ({})
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

  onMounted(() => {
    const { detail } = props;
    if (!isEmpty(detail)) {
      type.value = 'edit';
      formData.value = cloneDeep(detail);
    }
  });
  const type = ref('add');
  const configobj = {
    edit: {
      title: '编辑',
      saveBtnApi: updateApi
    },
    add: {
      title: '新增',
      saveBtnApi: addNewApi
    }
  };

  const formRef = ref();
  const formData = ref({});

  const formRules = reactive({
    salesSite: [{ required: true, message: '请选择站点', trigger: 'change' }],
    prohibitWord: [
      { required: true, message: '请输入过滤词中文', trigger: 'blur' }
    ],
    prohibitWordEn: [
      { required: true, message: '请输入过滤词英文', trigger: 'blur' }
    ]
  });
  //   #endregion 校验

  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const { saveBtnApi } = configobj[type.value];
        await saveBtnApi({ ...formData.value });
        ElMessage.success(type.value === 'add' ? '新增成功' : '编辑成功');
        emits('handleSearch');
        dialogVisible.value = false;
      } else {
        return false;
      }
    });
  };
</script>

<style lang="scss" scoped></style>
