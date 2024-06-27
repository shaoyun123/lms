<template>
  <el-dialog
    v-model="showExport"
    title="导出"
    width="30%"
    class="roll-dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form size="default">
      <el-row>
        <el-form-item class="input_width" label="数据范围">
          <el-radio-group v-model="formData.exportType">
            <el-radio :value="1">导出列表选中数据</el-radio>
            <el-radio :value="2">导出搜索条件中的数据</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, reactive } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    // 是否显示弹窗
    isVisible: {
      type: Boolean,
      default: false
    },
    paymentsList: {
      type: Array,
      default: () => []
    },
    exportSelect: {
      type: Array,
      default: () => []
    },
    searchForm: {
      type: Object,
      default: () => {}
    }
  });

  const formData = reactive({
    exportType: 1
  });

  const showExport = computed(() => {
    return props.isVisible;
  });

  const emits = defineEmits(['close', 'submit']);

  const handleExport = () => {
    try {
      let allFlatData = [];
      let idArr = [];
      let params = {};
      props.paymentsList?.forEach((item) => {
        allFlatData.push(...item.subDtoList);
      });
      if (formData.exportType === 1) {
        if (props.exportSelect.length == 0) {
          return ElMessage.warning('请选择要导出的数据');
        }
        allFlatData.forEach((item) => {
          if (props.exportSelect.includes(item.id)) {
            idArr.push(item.id);
          }
        });
        params = {
          idList: idArr
        };
      } else {
        if (allFlatData.length == 0) {
          return ElMessage.warning('没有要导出的数据');
        }
        params = props.searchForm;
      }
      axios({
        method: 'POST',
        url: '/lms/temu/fbm/exportSelectedItem',
        data: params,
        responseType: 'blob',
        dataType: 'json'
      })
        .then((res) => {
          const xlsx = 'application/vnd.ms-excel';
          const blob = new Blob([res.data], { type: xlsx }); //转换数据类型
          const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
          a.download = '商品信息表.xlsx';
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
          emits('close');
        })
        .catch((err) => {
          console.log(err);
          return ElMessage.error('导出失败');
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = () => {
    emits('close');
  };
</script>
<style lang="scss" scoped>
  :deep(.el-radio-group) {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
  }
</style>
