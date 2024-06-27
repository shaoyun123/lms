<template>
  <el-dropdown v-permission="['shopeeaccountExcel']" class="ml12">
    <el-button type="primary" :loading="downloadLoading">
      下载模板<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in DownLoadTplList" :key="item.value">
          <div class="whole-text" @click="handleDownLoadTpl(item)">
            {{ item.label }}
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-dropdown v-permission="['shopeeaccountExcel']" class="ml12">
    <el-button type="primary" :loading="importLoading">
      导入excel<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in importExcelList" :key="item.value">
          <el-upload
            v-model:file-list="item.file"
            class="upload-demo"
            accept="xlsx,xls"
            :show-file-list="false"
            :action="item.href"
            :before-upload="(event) => handleExportBefore(event, item)"
            :on-success="(event) => handleExportResult(event, item)"
            :on-error="(event) => handleExportError(event, item)"
          >
            <div class="whole-text">{{ item.label }}</div>
          </el-upload>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- 具体失败数据 -->
  <div class="fullDialog fail-dailog">
    <el-dialog
      v-model="showDialog"
      title="操作失败结果"
      width="800px"
      destroy-on-close
      align-center
      :close-on-click-modal="false"
      @close="showDialog = false"
    >
      <vxe-table
        :data="tableData"
        height="600px"
        show-overflow
        border
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column field="storeAcct" width="300" title="店铺名称"></vxe-column>
        <vxe-column field="operationResult" title="报错信息"></vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, reactive, nextTick } from 'vue';
  import { DownLoadTplList } from '../config';
  import { transBlob } from '@/utils/downloadFile';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { refreshStoreCascaderoApi } from '@/api/configure/common';
  import { getStoreList } from '@/api/common/index';

  const props = defineProps({
    selectRecords: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['search', 'getSelectedList', 'updateStoreList']);

  const downloadLoading = ref(false);
  const handleDownLoadTpl = (obj) => {
    downloadLoading.value = true;
    if (obj.href) {
      window.location.href = obj.href;
      downloadLoading.value = false;
    } else {
      let storeAccts = '';
      emits('getSelectedList', false);
      nextTick(() => {
        const checkedList = props.selectRecords;
        if (checkedList.length) {
          storeAccts = checkedList.map((v) => v.storeAcct).join();
        }
        const formData = new FormData();
        formData.append('storeAccts', storeAccts);

        transBlob(
          {
            url: '/lms/shopee/shop/downloadTemplate?templateName=店铺预售规则配置',
            data: formData
          },
          'post'
        )
          .then(() => {
            ElMessage.success('下载成功');
            downloadLoading.value = false;
          })
          .catch((res) => {
            ElMessage.error(res);
            downloadLoading.value = false;
          });
      });
    }
  };

  const importLoading = ref(false);
  const importExcelList = reactive([
    {
      label: '新增店铺',
      value: 'addStore',
      file: [],
      href: '/lms/salesplat/importStore.html'
    },
    {
      label: '修改店铺',
      value: 'editStore',
      file: [],
      href: '/lms/salesplat/batchImportUpdateStore.html'
    },
    {
      label: '授权信息',
      value: 'authInfo',
      file: [],
      href: '/lms/salesplat/importShopeeAuthInfo'
    },
    {
      label: '店铺预售规则配置',
      value: 'newPresaleTpl',
      file: [],
      href: '/lms/shopee/shop/modifyConfigByExcel'
    }
  ]);
  const handleExportBefore = (_, option) => {
    importLoading.value = true;
    return new Promise((resolve, reject) => {
      if (option.value === 'addStore') {
        ElMessageBox.confirm('确认导入这个文件进行新增店铺吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            resolve();
          })
          .catch(() => {
            importLoading.value = false;
            reject();
          });
      } else {
        resolve();
      }
    });
  };

  const showDialog = ref(false);
  const tableData = ref([]);
  const handleExportResult = async (result, option) => {
    const { code, msg, data = [] } = result;
    importLoading.value = false;
    let failArr = [];
    if (code === '0000') {
      if (option.value === 'newPresaleTpl') {
        failArr = data
          .filter((item) => !item.success)
          .map((v) => ({ ...v, operationResult: v.msg }));
      }
      if (failArr.length) {
        showDialog.value = true;
        tableData.value = failArr;
      } else {
        ElMessage.success(msg || '操作成功');
        emits('search');
        if (['addStore'].includes(option.value)) {
          // 店铺级联缓存手动刷新
          await refreshStoreCascaderoApi('shopee');
          const { data } = await getStoreList('shopee');
          emits('updateStoreList', data.children || []);
        }
      }
    } else {
      if (['addStore', 'editStore', 'authInfo'].includes(option.value)) {
        failArr = data.filter((item) => item.operationCode === 0);
      }
      if (failArr.length) {
        showDialog.value = true;
        tableData.value = failArr;
      } else {
        ElMessageBox.alert(msg || '请求失败', '错误信息', {
          confirmButtonText: '确认',
          type: 'error',
          dangerouslyUseHTMLString: true
        });
      }
    }
  };
  const handleExportError = (_, option) => {
    importLoading.value = false;
    option.loading = false;
    // 展示错误信息
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  :deep(.upload-demo) {
    width: 100%;
    .el-upload {
      width: 100%;
    }
  }
  .whole-text {
    width: 100%;
  }
  .fail-dailog {
    display: inline;
  }
</style>
