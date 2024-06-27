<template>
  <div class="detail_wrapper">
    <el-dialog
      v-model="dialogVisible"
      title="刊登数据重量设置"
      :width="900"
      :align-center="true"
    >
      <div style="color: red; margin-top: -30px; margin-bottom: 10px">
        提示：
        <p>
          1.根据设置的最低重量值，修改手动刊登和自动刊登生成待刊登重量取值逻辑的最低重量
        </p>
        <p>
          2.根据设置的参数，重新计算计费重，自动修改刊登表中待刊登状态所有数据，以及符合设置的刊登失败原因的数据
        </p>
      </div>
      <el-form
        ref="formRef"
        :model="formData"
        :label-width="150"
        :rules="formRule"
        scroll-to-error
        size="default"
      >
        <el-form-item label="修改最低重量限制为" prop="typeCount" required>
          <el-input
            v-model="formData.typeCount"
            placeholder="支持填写0或正整数，必填，单位为g"
          />
        </el-form-item>
        <el-form-item label="设置刊登失败原因" prop="typeInfo">
          <!-- <div style="display: flex"> -->
          <div style="width: 7%">包含</div>
          <el-input
            v-model="formData.typeInfo"
            style="width: 93%; float: right"
          />
          <!-- </div> -->
        </el-form-item>
      </el-form>
      <vxe-table ref="tableRef" :data="tableData" :align="'center'" border>
        <vxe-column field="operResult" title="最低重量限制设置记录" />
        <vxe-column field="operDesc" title="刊登失败原因" />
        <vxe-column field="operName" title="操作人" />
        <vxe-column field="operTime" title="操作时间">
          <template #default="{ row }">
            <div>{{ transferDate(row.operTime) }}</div>
          </template></vxe-column
        >
      </vxe-table>
      <template #footer>
        <el-button type="primary" @click="handleSave">设置并修改重量</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transferDate } from '@/utils/common';
  import {
    mercadoWeightConfig,
    mercadoWeightConfigLog
  } from '@/api/publishs/mercadopublish';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    initList: {
      type: Object,
      default: () => {}
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue',
    'getConfigLog'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const formData = ref({});
  const tableData = ref();

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        tableData.value = props.initList;
      }
    }
  );

  const handleSave = () => {
    if (!formData.value.typeCount) {
      return ElMessage.warning('请填写修改最低重量限制');
    }
    if (
      formData.value.typeCount < 0 ||
      ('' + formData.value.typeCount).includes('.')
    ) {
      return ElMessage.warning('最低重量限制仅支持0或正整数');
    }

    ElMessageBox.confirm('是否将全部符合条件的刊登数据重量立即修改', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { msg, code } = await mercadoWeightConfig(formData.value);
      if (code == '0000') {
        ElMessage.success(msg);
        formData.value.typeCount = '';
        formData.value.typeInfo = '';
        // emits('getConfigLog');
        const { data, code } = await mercadoWeightConfigLog();
        if (code == '0000' && data && data.length != 0) {
          tableData.value = data;
        }
      }
    });
  };
</script>
