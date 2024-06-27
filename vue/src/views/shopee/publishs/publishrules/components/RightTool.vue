<template>
  <el-dropdown
    v-if="activeKey !== 2"
    v-permission="['shopee_rules_bacthOnRule', 'shopee_rules_bacthOffRule']"
  >
    <el-button type="primary">
      批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <div v-permission="['shopee_rules_bacthOnRule']">
          <el-dropdown-item @click="handleBatchStatus(true)"
            >批量开启</el-dropdown-item
          >
        </div>
        <div v-permission="['shopee_rules_bacthOffRule']">
          <el-dropdown-item @click="handleBatchStatus(false)"
            >批量关闭</el-dropdown-item
          >
        </div>
        <div v-permission="['shopee_rules_list_edit']">
          <el-dropdown-item @click="handleBatchEdit">批量修改</el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-button class="ml12" type="primary" @click="handleDetail({}, 'new')"
    >添加规则</el-button
  >
  <el-dropdown
    v-permission="['shopee_rules_new_rules_tpl', 'shopee_rules_new_store_tpl']"
    class="ml12"
  >
    <el-button type="primary">
      下载模板<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <div
          v-for="item in tplList"
          :key="item.text"
          v-permission="[item.permission]"
        >
          <el-dropdown-item @click="item.clickFuc">{{
            item.text
          }}</el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-dropdown
    v-permission="[
      'shopee_rules_import_rule_excel',
      'shopee_rules_import_store_excel'
    ]"
    class="ml12"
  >
    <el-button type="primary">
      导入模板<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <div
          v-for="item in importList"
          :key="item.url"
          v-permission="[item.permission]"
        >
          <el-dropdown-item
            ><el-upload
              :action="item.url"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :show-file-list="false"
            >
              {{ item.text }}
            </el-upload></el-dropdown-item
          >
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <jump-page
    v-model="resultVisible"
    :content="jumpPageContent"
    :status="importStatus"
  ></jump-page>
</template>

<script setup>
  import { ref } from 'vue';
  import { DOWNLOAD_TPL_URL, DOWNLOAD_RULES_TPL_URL } from '../config.js';
  import JumpPage from '@/components/JumpPage/index.vue';
  import { ElMessageBox } from 'element-plus';

  defineProps({
    activeKey: {
      type: String,
      default: '0,1'
    }
  });

  const emits = defineEmits([
    'handleSearch',
    'handleBatchStatus',
    'handleBatchEdit',
    'handleDetail'
  ]);

  // 下载
  const handledownloadStoreTpl = () => {
    window.open(DOWNLOAD_TPL_URL);
  };
  const handledownloadRulesTpl = () => {
    window.open(DOWNLOAD_RULES_TPL_URL);
  };
  const tplList = [
    {
      text: '新增模板刊登规则',
      clickFuc: handledownloadRulesTpl,
      permission: 'shopee_rules_new_rules_tpl'
    },
    {
      text: '修改应用店铺',
      clickFuc: handledownloadStoreTpl,
      permission: 'shopee_rules_new_store_tpl'
    }
  ];

  // 导入修改
  const importList = [
    {
      url: '/api/lms/shopee/shopeeAutoListingRuleController/rule/batchModifyPublishRuleTemplate',
      text: '导入模板刊登规则',
      permission: 'shopee_rules_import_rule_excel'
    },
    {
      url: '/api/lms/shopee/shopeeAutoListingRuleController/rule/importEdit',
      text: '导入修改应用店铺',
      permission: 'shopee_rules_import_store_excel'
    }
  ];
  const uploadSuccess = (res) => {
    if (res.code === '0000') {
      showResultModal(true, res.msg);
      emits('handleSearch');
    } else {
      uploadError(res);
    }
  };
  const uploadError = (res) => {
    ElMessageBox.alert(
      `<div style="word-break: break-word">${res.msg || res}</div>`,
      '导入失败',
      {
        confirmButtonText: '确认',
        dangerouslyUseHTMLString: true,
        type: 'error',
        closeOnClickModal: false,
        closeOnPressEscape: false
      }
    );
  };

  const resultVisible = ref(false);
  const importStatus = ref(false);
  const jumpPageContent = ref('');
  const showResultModal = (status, msg) => {
    resultVisible.value = true;
    importStatus.value = status;
    jumpPageContent.value = msg + '，可到任务中心查看失败结果日志';
  };

  const handleBatchStatus = (status) => {
    emits('handleBatchStatus', status);
  };
  const handleBatchEdit = () => {
    emits('handleBatchEdit');
  };
  const handleDetail = (info, type) => {
    emits('handleDetail', info, type);
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
