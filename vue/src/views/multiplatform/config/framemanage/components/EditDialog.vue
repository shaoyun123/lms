<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="500"
    :close-on-click-modal="false"
  >
    <div v-loading="loading" class="dialog_container">
      <el-form
        ref="formDataRef"
        :model="formData"
        label-width="80px"
        :rules="rules"
        size="default"
      >
        <template v-if="!checkedData.length">
          <el-form-item label="仓库名称" prop="warehouseName">
            <el-select v-model="formData.warehouseName" filterable>
              <el-option
                v-for="item in storeList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="编号前缀" prop="prefix">
            <el-input v-model="formData.prefix" clearable />
          </el-form-item>
        </template>
        <template v-if="!checkedData.length">
          <el-form-item label="编号范围">
            <el-col :span="11">
              <el-form-item prop="stratNum">
                <el-input
                  v-model.number="formData.startNum"
                  placeholder="开始"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="2" class="common_ta_center">
              <span class="common_text_gray_500">-</span>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="endNum">
                <el-input
                  v-model.number="formData.endNum"
                  placeholder="结束"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-form-item>
        </template>
        <div v-if="checkedData.length" class="tips">
          <el-icon><WarningFilled /></el-icon>
          不填表示不修改
        </div>
        <el-form-item label="框子尺寸" prop="size">
          <el-select v-model="formData.size" filterable>
            <el-option
              v-for="item in sizeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="通道" prop="passage">
          <el-input v-model="formData.passage" clearable />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog_footer">
        <template v-if="!checkedData.length">
          <el-button type="primary" @click="handleAdd(formDataRef, true)"
            >添加并打印</el-button
          >
          <el-button @click="handleAdd(formDataRef, false)">添加</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="handleSave(formDataRef)"
            >保存</el-button
          >
        </template>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, defineProps, defineEmits, ref, reactive } from 'vue';
  import { batchCreate, batchEdit } from '@/api/multiplatform/framemanage';
  import { epeanPrint_plugin_fun } from '@/utils/print';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedData: {
      type: Array,
      default: () => {}
    },
    storeList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'changeSize'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const title = computed(() => {
    return !props.checkedData.length ? '添加框子' : '修改框子';
  });
  const formData = reactive({
    warehouseName: '',
    prefix: '',
    startNum: null,
    endNum: null,
    size: '',
    passage: ''
  });
  const sizeList = [
    {
      value: '',
      label: '请选择'
    },
    {
      value: 'L',
      label: 'L'
    },
    {
      value: 'M',
      label: 'M'
    },
    {
      value: 'S',
      label: 'S'
    }
  ];

  const formDataRef = ref(null);
  const loading = ref(false);
  const rules = reactive({
    warehouseName: [
      { required: true, trigger: 'change', message: '请选择仓库名称' }
    ],
    prefix: [{ required: true, trigger: 'blur', message: '请填写编号前缀' }],
    startNum: [
      {
        type: 'number',
        trigger: ['blur', 'change'],
        message: '请填入数字'
      }
    ],
    endNum: [
      {
        type: 'number',
        trigger: ['blur', 'change'],
        message: '请填入数字'
      }
    ]
  });

  const handleAdd = async (formEl, isPrint) => {
    // 校验
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        // 添加
        loading.value = true;
        try {
          const { data } = await batchCreate(formData);
          const reqPrintArr = data.map((item) => ({
            boxCode: item,
            printerName: '10040',
            printNumber: 1,
            onlyPreView: false
          }));
          loading.value = false;
          dialogVisible.value = false;
          ElMessage.success('添加成功');
          // 打印
          isPrint && print(reqPrintArr);
          emits('handleSearch');
        } catch (err) {
          loading.value = false;
          console.log('err :>> ', err);
        }
      }
    });
  };

  // 保存
  const handleSave = async (formEl) => {
    // 校验
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        // 添加
        loading.value = true;
        try {
          const idList = props.checkedData.map((item) => item.id);
          await batchEdit({
            idList,
            size: formData.size,
            passage: formData.passage
          });
          loading.value = false;
          ElMessage.success('修改成功');
          dialogVisible.value = false;
          emits('handleSearch');
        } catch (err) {
          loading.value = false;
          console.log('err :>> ', err);
        }
      }
    });
  };
  // 打印
  const print = (data) => {
    epeanPrint_plugin_fun(7, data);
  };
</script>

<style lang="scss" scoped>
  :deep(.el-select.el-select--default) {
    width: 100%;
  }
  :deep(.el-dialog .el-dialog__body) {
    padding: 10px 20px;
  }
  .tips {
    margin-bottom: 20px;
    color: #f56c6c;
    font-size: 14px;
  }
</style>
