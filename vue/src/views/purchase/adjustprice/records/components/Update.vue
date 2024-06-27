<template>
  <!-- 详情 -->
  <div class="detail_wrapper">
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '修改调价' : '新增调价'"
      width="40%"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        class="label_width"
        :model="handleForm"
        :rules="formRules"
      >
        <el-form-item label="SKU" size="default" prop="prodSSku">
          <el-input
            v-model="handleForm.prodSSku"
            :disabled="isEdit"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="调整后商品报价(￥)"
          size="default"
          prop="afterPrice"
        >
          <ZInputNumber
            v-model="handleForm.afterPrice"
            :precision="2"
            clearable
            class="mr-2"
          />
        </el-form-item>
        <el-form-item
          label="调整后供应商包装费(￥)"
          size="default"
          prop="afterSupplierPackPrice"
        >
          <ZInputNumber
            v-model="handleForm.afterSupplierPackPrice"
            clearable
            :min="0"
            :precision="2"
            class="mr-2"
          />
        </el-form-item>
        <el-form-item label="涨价原因" size="default">
          <el-select
            v-model="handleForm.reason"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in reasonTypeOption"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否通知开发" size="default" prop="ifCall">
          <el-select
            v-model="handleForm.ifCall"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option :value="true" label="是"></el-option>
            <el-option :value="false" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" size="default">
          <el-input v-model="handleForm.remark" :rows="4" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button
            type="primary"
            :loading="handleLoading"
            @click="handleSave(formRef)"
            >{{ isEdit ? '修改' : '新增' }}</el-button
          >
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch, reactive } from 'vue';
  import { pick } from 'lodash-es';
  import {
    savePurPriceChange,
    editPurPriceChange,
    queryReasonType
  } from '@/api/purchase/adjustprice';
  import { ElMessage } from 'element-plus';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    selectRow: {
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

  const needFresh = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        if (props.isEdit) {
          const currentRow = props.selectRow;
          const temp = pick(currentRow, [
            'prodSSku',
            'afterPrice',
            'afterSupplierPackPrice',
            'ifCall',
            'reason',
            'remark'
          ]);
          Object.keys(temp).forEach((key) => {
            handleForm[key] = temp[key];
          });
        }
        needFresh.value = false;
      } else {
        formRef.value.resetFields();
        handleForm.reason = '';
        handleForm.remark = '';
        if (needFresh.value) {
          emits('handleSearch');
        }
      }
    }
  );

  onMounted(() => {
    getqueryReasonTypeOption();
  });

  const formRef = ref();
  const formRules = ref({
    prodSSku: [{ required: true, trigger: 'blur', message: '请输入商品SKU' }],
    afterPrice: [
      { required: true, trigger: 'blur', message: '请输入调整后商品报价' }
    ],
    afterSupplierPackPrice: [
      { required: true, trigger: 'blur', message: '请输入调整后供应商包装费' }
    ],
    ifCall: [
      { required: true, trigger: 'change', message: '请选择是否通知开发' }
    ]
  });

  // 批量处理表单
  const handleForm = reactive({
    prodSSku: '', // sku
    afterPrice: null, // 压价前价格
    afterSupplierPackPrice: null, // 压价后价格
    ifCall: '', // 压价后价格
    reason: '', // 涨价原因
    remark: '' // 备注
  });

  const reasonTypeOption = ref(false);
  const getqueryReasonTypeOption = async () => {
    const { data } = await queryReasonType();
    reasonTypeOption.value = data;
  };

  const handleLoading = ref(false);

  // 保存
  const handleSave = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        if (!handleForm.prodSSku) {
          return ElMessage.warning('sku不能为空！');
        }
        if (Number(handleForm.afterSupplierPackPrice) < 0) {
          return ElMessage.warning('包装费不能小于0, 请重新填写！');
        }
        if (Number(handleForm.afterPrice) <= 0) {
          return ElMessage.warning('商品报价必须大于0, 请重新填写！');
        }
        try {
          handleLoading.value = true;
          const { msg } = props.isEdit
            ? await editPurPriceChange({
                id: props.selectRow.id,
                ...handleForm
              })
            : await savePurPriceChange(handleForm);
          needFresh.value = true;
          ElMessage.success(msg);

          handleClose();
          handleLoading.value = false;
        } catch (err) {
          console.log(err);
        } finally {
          handleLoading.value = false;
        }
      }
    });
  };

  // 关闭弹窗
  const handleClose = () => {
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  .label_width {
    :deep {
      .el-form-item .el-form-item__label {
        width: 160px;
      }
    }
    :deep {
      .el-select {
        width: 100%;
      }
    }
  }
</style>
