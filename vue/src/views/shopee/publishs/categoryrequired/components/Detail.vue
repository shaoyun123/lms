<template>
  <div class="fullDialog">
    <el-dialog
      v-model="dialogVisible"
      title="修改类目"
      :width="800"
      :close-on-click-modal="false"
      :destroy-on-close="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :label-width="200"
        size="default"
        :inline="true"
        :rules="formRules"
      >
        <el-form-item :label="detail.displayAttributeName" prop="defaultValue">
          <el-select
            v-if="showCreateSelect || showOnlySelect"
            v-model="formData.defaultValue"
            class="w240"
            filterable
            clearable
            :allow-create="showCreateSelect"
            placeholder="请选择"
            @change="handleChangeId"
          >
            <el-option
              v-for="item in attributeValueList"
              :key="item.valueId"
              :value="item.originalValueName"
              :label="item.originalValueName"
            ></el-option>
          </el-select>
          <el-text v-if="showCreateSelect" type="info" class="tips"
            >可输入创建新选项</el-text
          >

          <template v-if="detail.inputType === 'TEXT_FILED'">
            <ZInputNumber
              v-if="detail.inputValidationType === 'INT_TYPE'"
              v-model="formData.defaultValue"
              class="w240"
              :precision="0"
              placeholder="请输入整数"
              @blur="handleChangeId"
            />
            <ZInputNumber
              v-else-if="detail.inputValidationType === 'FLOAT_TYPE'"
              v-model="formData.defaultValue"
              class="w240"
              :precision="10"
              placeholder="请输入数字"
            />
            <el-input
              v-else
              v-model="formData.defaultValue"
              class="w240"
              placeholder="请输入"
              clearable
            />
          </template>
        </el-form-item>
        <el-form-item
          v-if="attributeUnit.length"
          label="unit(单位)"
          prop="defaultValueUnit"
        >
          <el-select
            v-model="formData.defaultValueUnit"
            class="w240"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in attributeUnit"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleSave(formRef)">保存</el-button
        ><el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { editApi } from '@/api/shopee/categoryrequired';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    detail: {
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

  const showCreateSelect = computed(() =>
    ['COMBO_BOX', 'MULTIPLE_SELECT_COMBO_BOX'].includes(props.detail.inputType)
  );
  const showOnlySelect = computed(() =>
    ['DROP_DOWN', 'MULTIPLE_SELECT'].includes(props.detail.inputType)
  );

  const formRef = ref();
  const formData = reactive({});
  const formRules = reactive({
    defaultValue: [
      {
        required: true,
        trigger: 'change',
        message: '请输入'
      }
    ]
  });

  const attributeValueList = ref();
  const attributeUnit = ref();
  onMounted(() => {
    const { detail } = props;
    attributeValueList.value = JSON.parse(detail.attributeValueList);
    attributeUnit.value = JSON.parse(detail.attributeUnit);
    if (showCreateSelect.value) {
      formRules.defaultValue[0].message = '请输入/选择';
    } else if (showOnlySelect.value) {
      formRules.defaultValue[0].message = '请选择';
    }
    formData.defaultValue = detail.defaultValue;
    formData.defaultValueId = detail.defaultValueId;
    formData.defaultValueUnit = detail.defaultValueUnit;
  });

  const handleChangeId = () => {
    const { detail } = props;
    if (detail.inputType === 'TEXT_FILED') {
      formData.defaultValueId = 0;
    } else if (showCreateSelect.value || showOnlySelect.value) {
      const curObj = attributeValueList.value.find(
        (v) => v.originalValueName === formData.defaultValue
      );
      if (curObj) {
        formData.defaultValueId = curObj.valueId;
      } else {
        formData.defaultValueId = 0;
      }
    }
  };

  const handleSave = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const params = { ...props.detail, ...formData };
        try {
          const { msg } = await editApi(params);
          ElMessage.success(msg);
          emits('handleSearch');
          dialogVisible.value = false;
        } catch (err) {
          console.log('err :>> ', err);
        }
      } else {
        return false;
      }
    });
  };
</script>

<style lang="scss" scoped>
  .tips {
    margin-left: 12px;
    font-size: 13px;
  }
  .w240 {
    width: 240px;
  }
</style>
