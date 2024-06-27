<template>
  <!-- lazada 删除任务整合-->
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="form"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="单个模糊查询" />
        </el-form-item>
        <el-form-item label="创建人" prop="creators">
          <el-select
            v-model="form.creators"
            placeholder="请选择"
            :class="form.creators.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.creators.length > 1" type="info"
                >已选{{ form.creators.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.creatorIdsList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" prop="executeType">
          <el-select v-model="form.executeType" placeholder="请选择">
            <el-option value="0" label="手动执行" />
            <el-option value="1" label="自动执行" />
            <el-option value="2" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option value="1" label="已开启" />
            <el-option value="0" label="已关闭" />
            <el-option value="2" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺" prop="storeAcctIds">
          <el-cascader
            v-model="form.storeAcctIds"
            :options="storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true, emitPath: false }"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="false" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <div style="display: flex; justify-content: space-between">
        <div></div>
        <el-button type="primary" @click="tableEdit">新增</el-button>
      </div>
      <vxe-table
        ref="tableDataRef"
        v-loading="tableDataLoading"
        :data="tableData"
        :scroll-y="{ gt: 10 }"
        :height="height"
        :align="'center'"
        border
      >
        <vxe-column field="status" title="状态">
          <template #default="{ row, rowIndex }">
            <el-switch
              v-if="row.executeType == 1"
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row, rowIndex)"
            /> </template
        ></vxe-column>
        <vxe-column field="taskName" title="任务名称" />
        <vxe-column field="creator" title="创建人" />
        <vxe-column field="acctNum" title="适用店铺"
          ><template #default="{ row }">
            <a @click="tableStore(row.id)">{{ row.acctNum || 0 }}</a>
          </template>
        </vxe-column>
        <vxe-column field="executeType" title="任务类型">
          <template #default="{ row }">
            {{
              row.executeType == 0
                ? '手动执行'
                : row.executeType == 1
                ? '自动执行'
                : ''
            }}
          </template></vxe-column
        >
        <vxe-column field="executeTime" title="执行时间"
          ><template #default="{ row }">
            <div v-if="row.executeType == 0 && row.lastExecuteTime">
              {{ row.lastExecuteTime }}
            </div>
            <div v-else>
              {{
                `${
                  row.executeMonthDayStr != ''
                    ? '每月' +
                      row.executeMonthDayStr.replaceAll(',', '号,') +
                      '号'
                    : ''
                }${row.executeWeekDayStr != '' ? row.weekStr : ''}，  ${
                  row.executeTime
                }`
              }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作"
          ><template #default="{ row }"
            ><el-button type="primary" size="small" @click="tableEdit(row)"
              >编辑</el-button
            ><el-button type="primary" size="small" @click="tableLog(row.id)"
              >执行日志</el-button
            ></template
          >
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          background
          :page-sizes="[50, 100, 200]"
          layout="prev, pager, next,sizes, total"
          :total="total"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 详情 -->
    <Detail
      v-if="showDetail"
      :is-visible="showDetail"
      :data-arr="detailData"
      @close="showDetailCloseLog"
    />
    <!-- 执行日志 -->
    <Log
      v-if="showLog"
      :is-visible="showLog"
      :rule-id="ruleId"
      @close="showLogCloseLog"
    />
    <!-- 店铺 -->
    <Store
      v-if="showStore"
      :is-visible="showStore"
      :rule-id="ruleId"
      @close="showStoreCloseLog"
    />
  </div>
</template>
<script setup name="lazadaoperatedeletetask">
  import { ref, reactive, onMounted, computed } from 'vue';
  // import { parseTime } from '@/utils/common';
  import { ElMessage } from 'element-plus';
  import { getStoreList } from '@/api/common';
  import {
    searchDeleteTask,
    getCreators,
    modifyStatus
  } from '@/api/lazada/deletetask';
  import Detail from './component/detail.vue';
  import Log from './component/log.vue';
  import Store from './component/store.vue';

  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);

  const week = {
    1: '周日',
    2: '周一',
    3: '周二',
    4: '周三',
    5: '周四',
    6: '周五',
    7: '周六'
  };

  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    onSubmit();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit();
  };
  // 查询条件
  const form = reactive({
    creators: [],
    executeType: '2',
    status: '2'
  });
  // const creator = ref([]);
  // 初始化查询条件
  const initFormData = reactive({
    creatorIdsList: []
  });
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref();
  // 查询条件表单清空
  const resetForm = function () {
    formRef.value.resetFields();
    form.categoryIds = [];
    form.mercateName = [];
    // creator.value = [];
  };
  // 查询条件提交查询
  const onSubmit = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    form.page = currentPage.value;
    form.limit = pageSize.value;
    // form.creators = creator.value.join(',');

    let { code, data } = await searchDeleteTask(form);
    if (code == '0000') {
      data.list.forEach((a) => {
        a.weekStr = a.executeWeekDayStr.split(',').map((b) => week[b]);
      });
      tableData.value = data.list;
      total.value = data.total;
    }
    tableDataLoading.value = false;
  };
  // 开启&关闭任务
  const handleStatusChange = async (row, rowIndex) => {
    let { code, msg } = await modifyStatus(row.id);
    if (code == '0000') {
      tableData.value[rowIndex].status = row.status;
      ElMessage.success(msg);
    } else {
      tableData.value[rowIndex].status = row.status == 0 ? 1 : 0;
    }
  };
  const showDetail = ref(false);
  const detailData = ref({});
  // 编辑
  const tableEdit = async (row) => {
    showDetail.value = true;
    detailData.value = row;
  };
  const showDetailCloseLog = (val) => {
    showDetail.value = false;
    if (val == true) {
      onSubmit();
    }
  };

  const ruleId = ref();
  const showLog = ref(false);
  // 执行日志
  const tableLog = async (ids) => {
    ruleId.value = ids;
    showLog.value = true;
  };
  const showLogCloseLog = () => {
    showLog.value = false;
  };
  const showStore = ref(false);
  // 设置店铺
  const tableStore = async (ids) => {
    showStore.value = true;
    ruleId.value = ids;
  };
  const showStoreCloseLog = () => {
    showStore.value = false;
    onSubmit();
  };

  // 店铺级联数据
  const storeList = ref([]);
  onMounted(async () => {
    // 创建人查询
    {
      const { data } = await getCreators();
      initFormData.creatorIdsList = data;
    }
    // 店铺
    {
      const { data: storeData } = await getStoreList('lazada');
      storeList.value = storeData.children;
    }
  });
  let tableDataRef = ref();

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 220;
  });
</script>
<style scoped lang="scss">
  .mt-10 {
    margin-top: 10px;
  }
  // 平台多选框
  .search_item_cascader {
    :deep(.el-input) {
      height: 24px;
    }
    :deep(.el-cascader__tags .el-tag) {
      margin: 0 0 0 5px;
    }
    :deep(.el-tag--small) {
      padding: 0 2px;
    }
    :deep(.el-cascader__tags) {
      flex-wrap: nowrap;

      span:first-child {
        max-width: 40px;
      }
      span:last-child {
        width: 30px;
      }
      input {
        min-width: 10px;
        height: auto;
        margin: 0;
      }
    }
  }
</style>
