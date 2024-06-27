<template>
  <el-dialog
    v-model="dialogVisible"
    width="40%"
    :title="title"
    destroy-on-close
    :close-on-click-modal="false"
    @close="dialogVisible = false"
  >
    <el-form
      ref="editFormRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="模板名称" prop="templateName">
        <el-input
          v-model="formData.templateName"
          clearable
          :maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="模板类型" prop="templateType">
        <el-select
          v-model="formData.templateType"
          clearable
          filterable
          :disabled="type === 'copy'"
        >
          <el-option
            v-for="item in templateTypeList"
            :key="item.code"
            :label="item.cnName"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <div class="disflex">
        <div class="el-form-item__label tpl_size"><span>*</span>模板规格</div>
        <div class="space_between">
          <div class="disflex">
            <el-form-item prop="width" label-width="0">
              <el-input
                v-model="formData.width"
                clearable
                :maxlength="3"
                show-word-limit
                placeholder="请输入模板规格的宽"
                :disabled="type === 'copy'"
              />
            </el-form-item>
            <span class="ml10">mm</span>
          </div>
          <div class="disflex">
            <el-form-item prop="height" label-width="0">
              <el-input
                v-model="formData.height"
                clearable
                :maxlength="3"
                show-word-limit
                placeholder="请输入模板规格的高"
                :disabled="type === 'copy'"
              />
            </el-form-item>
            <span class="ml10">mm</span>
          </div>
        </div>
      </div>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          clearable
          :rows="3"
          :maxlength="100"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave(editFormRef)"
        >
          保存
        </el-button>
        <el-button @click="dialogVisible = false"> 关闭 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { reactive, ref, computed, watch } from 'vue';
  import { cloneDeep, isEmpty, throttle } from 'lodash-es';
  import { createApi } from '@/api/order/printtemplate';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    tplInfo: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    templateTypeList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['update:modelValue', 'search']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  // sourcePrintTemplateId=来源模板id，可空（复制面单模板时传值）
  const formData = ref({});
  const resetData = {
    templateName: '',
    templateType: '',
    height: null,
    width: null,
    remark: ''
  };

  // 校验只能正整数
  const validateHeight = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入模板规格的高'));
    } else if (value <= 0) {
      callback(new Error('模板规格的高需大于0'));
    } else if (parseInt(value) !== Number(value)) {
      callback(new Error('模板规格的高需为正数'));
    } else {
      formData.value.height = parseInt(value);
      callback();
    }
  };
  const validateWidth = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入模板规格的宽'));
    } else if (value <= 0) {
      callback(new Error('模板规格的宽需大于0'));
    } else if (parseInt(value) !== Number(value)) {
      callback(new Error('模板规格的宽需为正数'));
    } else {
      formData.value.width = parseInt(value);
      callback();
    }
  };

  const formRules = reactive({
    templateName: [
      { required: true, message: '请输入模板名称', trigger: 'blur' }
    ],
    templateType: [
      { required: true, message: '请选择模板类型', trigger: 'change' }
    ],
    height: [{ required: true, validator: validateHeight, trigger: 'blur' }],
    width: [
      {
        required: true,
        validator: validateWidth,
        trigger: 'blur'
      }
    ]
  });

  const editFormRef = ref(null);

  const title = ref();
  const type = ref();

  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) {
        formData.value = cloneDeep(resetData);
        if (isEmpty(props.tplInfo)) {
          type.value = 'add';
          title.value = '新建面单模板';
        } else {
          formData.value.height = props.tplInfo.height;
          formData.value.width = props.tplInfo.width;
          formData.value.templateType = props.tplInfo.templateType;
          type.value = 'copy';
          title.value = '复制面单模板';
        }
      } else {
        title.value = null;
        type.value = null;
      }
    }
  );

  const saveLoading = ref(false);
  const handleSave = throttle((formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          saveLoading.value = true;
          let params = formData.value;
          if (!isEmpty(props.tplInfo)) {
            params.sourcePrintTemplateId = props.tplInfo.id;
          }
          const { msg } = await createApi(params);
          ElMessage.success(msg);
          dialogVisible.value = false;
          emits('search');
        } catch (err) {
          console.log(err);
        }
        saveLoading.value = false;
      } else {
        console.log('error submit!');
        return false;
      }
    });
  }, 1000);
</script>

<style lang="scss" scoped>
  .space_between {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .disflex {
    display: flex;
  }
  .tpl_size {
    height: 24px;
    line-height: 24px;
    width: 100px;
    font-size: 12px;
    margin-bottom: 18px;
    span {
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .ml10 {
    margin-left: 10px;
  }
</style>
