<template>
  <div class="app-container">
    <el-card ref="searchCardRef" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="任务名称" prop="ruleName">
          <el-input v-model="formData.ruleName" clearable />
        </el-form-item>
        <el-form-item label="创建人" prop="creator">
          <el-input v-model="formData.creator" clearable />
        </el-form-item>
        <el-form-item label="任务类型" prop="executeType">
          <el-select v-model="formData.executeType" @change="changeExecuteType">
            <el-option label="定时任务" :value="1" />
            <el-option label="手动执行" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="周期起止时间" prop="ruleTime">
          <el-date-picker
            v-model="formData.ruleTime"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="-"
            :default-time="['2023-10-11 00:00:00', '2023-10-11 23:59:59']"
          />
        </el-form-item>
        <el-form-item
          v-if="!formData.executeType"
          label="执行时间"
          prop="executeTimeList"
        >
          <el-date-picker
            v-model="formData.executeTimeList"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="-"
            :default-time="['2023-10-11 00:00:00', '2023-10-11 23:59:59']"
            @change="changeExeTime"
          />
        </el-form-item>
        <el-form-item v-else label="执行时间" prop="executeDayList">
          <el-select
            v-model="formData.executeDayList"
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            @change="changeExeTime"
          >
            <el-option
              v-for="item in weekOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型" prop="operType">
          <el-select v-model="formData.operType" placeholder="请选择" clearable>
            <el-option
              v-for="item in operateTypeOption"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="tableDataLoading"
            type="primary"
            @click="handleSubmit"
            >搜索</el-button
          >
          <el-button @click="handleResetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <div class="tools_btn">
        <el-button type="primary" @click="updateTask()">新建任务</el-button>
      </div>
      <vxe-table
        ref="tableDataRef"
        v-loading="tableDataLoading"
        :data="tableData"
        :scroll-y="{ gt: 10 }"
        :height="height"
        :align="'center'"
        show-overflow
        border
      >
        <vxe-column
          field="status"
          :title-help="{
            message: '只有任务处于起始时间和截至时间内才可以操作开关'
          }"
          title="状态"
          ><template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="true"
              :inactive-value="false"
              :disabled="
                new Date().getTime() < row.ruleStartTime ||
                new Date().getTime() > row.ruleEndTime ||
                !row.ruleStartTime ||
                !row.ruleEndTime
              "
              @change="handleStatusChange(row)"
            />
          </template>
        </vxe-column>
        <vxe-column field="ruleName" title="任务名称" />
        <vxe-column field="creator" title="创建人" />
        <vxe-column field="operType" title="操作类型">
          <template #default="{ row }">
            {{ row.operType === 1 ? '下架' : '删除' }}
          </template>
        </vxe-column>
        <vxe-column field="executeType" title="任务类型">
          <template #default="{ row }">
            {{ row.executeType === 0 ? '手动' : '自动' }}
          </template>
        </vxe-column>
        <vxe-column field="ruleStartTime" title="周期起止时间" width="300">
          <template #default="{ row }">
            <div v-if="row.ruleStartTime && row.ruleEndTime">
              {{ transferDate(row.ruleStartTime) }} -
              {{ transferDate(row.ruleEndTime) }}
            </div>
            <div v-else>/</div>
          </template>
        </vxe-column>
        <vxe-column field="executeTime" title="执行时间" width="300">
          <template #default="{ row }">
            <div>
              {{
                row.executeType === 0
                  ? transferDate(row.lastExecuteTime)
                  : row.autoExecuteTimeDesc
              }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="150">
          <template #default="{ row }">
            <div style="display: flex">
              <el-button type="primary" @click="updateTask(row)"
                >编辑</el-button
              >
              <el-button type="primary" @click="handleExeLog(row)"
                >执行日志</el-button
              >
            </div>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          background
          :page-sizes="[50, 100, 300]"
          layout="prev, pager, next,sizes, total"
          :total="total"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增修改 -->
    <Detail
      v-if="showDetail"
      v-model="showDetail"
      :detail-data="detailData"
      @fresh-list="freshList"
    />
    <!-- 执行日志 -->
    <ExeLogs
      :id="logsId"
      v-model="showLogs"
      :oper-type="operType"
      @fresh-list="freshList"
    />
  </div>
</template>
<script setup name="publishsfyndiqautodeletelisting">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import { shortcuts } from '@/api/common';
  import { transferDate } from '@/utils/common';
  import {
    queryListApi,
    enableOrDisableRule,
    getAutoDeleteListingRuleOperType
  } from '@/api/publishs/fyndiqautodeletelisting';
  import Detail from './components/detail.vue';
  import ExeLogs from './components/exelogs.vue';

  // 查询条件
  const formData = reactive({
    creator: '',
    ruleName: '',
    executeType: '',
    ruleStartTime: '',
    ruleEndTime: '',
    ruleTime: [],
    executeTimeList: [],
    executeStartTime: '',
    executeEndTime: '',
    executeDayList: [],
    status: true,
    operType: ''
  });
  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);

  // 分页
  const handleSizeChange = (val) => {
    pageSize.value = val;
    handleSubmit();
  };

  const handleCurrentChange = (val) => {
    currentPage.value = val;
    handleSubmit();
  };

  const weekOptions = ref([]);

  // 高度
  const searchCardRef = ref();
  const height = ref(400);

  onMounted(() => {
    const searchCardHeight = searchCardRef.value.$el.clientHeight;
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    height.value = clientHeight - searchCardHeight - 152;

    weekOptions.value = [
      {
        label: '周一',
        value: '2'
      },
      {
        label: '周二',
        value: '3'
      },
      {
        label: '周三',
        value: '4'
      },
      {
        label: '周四',
        value: '5'
      },
      {
        label: '周五',
        value: '6'
      },
      {
        label: '周六',
        value: '7'
      },
      {
        label: '周日',
        value: '1'
      }
    ];
    getTiktokAutoDeleteListingRuleOperTypeFn();
  });

  // 切换任务类型
  const changeExecuteType = () => {
    formData.executeTimeList = [];
    formData.executeDayList = [];
  };

  // 切换执行时间
  const changeExeTime = (val) => {
    if (!val) {
      val = [];
    }
    if (val.length && formData.executeType === '') {
      formData.executeDayList = [];
      formData.executeTimeList = [];
      return ElMessage.warning('请先选择任务类型！');
    }
  };

  // 获取操作类型枚举
  const operateTypeOption = ref([]);
  const getTiktokAutoDeleteListingRuleOperTypeFn = async () => {
    const { data } = await getAutoDeleteListingRuleOperType();
    operateTypeOption.value = data;
  };

  const tableDataRef = ref();
  const tableData = ref(null);
  const tableDataLoading = ref(false);

  const formRef = ref();
  const showDetail = ref(false);
  const detailData = ref({});

  // 编辑
  const updateTask = async (row) => {
    showDetail.value = true;
    detailData.value = row;
  };

  // 清空
  const handleResetForm = function () {
    formRef.value.resetFields();
    formData.includeName = true;
  };

  // 查询
  const handleSubmit = async () => {
    tableDataLoading.value = true;
    tableData.value = [];

    // 任务类型 0手动执行(时间范围) 1自动定时任务(下拉框周一~周日)
    if (formData.executeType) {
      formData.executeDayList = formData.executeDayList?.map(
        (item) => item[item.length - 1]
      );
    } else {
      if (formData.executeTimeList === null) {
        formData.executeTimeList = [];
      }
      const timeList = formData.executeTimeList.map((item) => {
        return new Date(item).getTime();
      });
      [formData.executeStartTime, formData.executeEndTime] = timeList;
    }

    // 时间选中 没点确定 点清空
    if (formData.ruleTime === null) {
      formData.ruleTime = [];
    }
    if (formData.ruleTime.length) {
      const ruleTimeList = formData.ruleTime.map((item) => {
        return new Date(item).getTime();
      });
      [formData.ruleStartTime, formData.ruleEndTime] = ruleTimeList;
    } else {
      formData.ruleStartTime = null;
      formData.ruleEndTime = null;
    }

    if (!formData.executeTimeList.length) {
      formData.executeStartTime = null;
      formData.executeEndTime = null;
    }

    try {
      const { count, data } = await queryListApi({
        ...formData,
        page: currentPage.value,
        limit: pageSize.value
      });
      tableData.value = data || [];
      total.value = count;
    } catch (err) {
      tableData.value = [];
      total.value = 0;
    }
    tableDataLoading.value = false;
  };

  // 开启&关闭任务
  const handleStatusChange = async (row) => {
    try {
      let { msg } = await enableOrDisableRule({
        id: row.id,
        status: row.status
      });
      ElMessage.success(msg || '操作成功');
    } catch (err) {
      // 若接口没成功，返回原来状态
      row.status = row.status ? false : true;
    }
  };

  const showLogs = ref(false);
  const logsId = ref(null);
  const operType = ref(null);

  // 执行日志
  const handleExeLog = (row) => {
    showLogs.value = true;
    logsId.value = row.id;
    operType.value = row.operType;
  };

  const freshList = () => {
    handleSubmit();
  };
</script>
<style scoped lang="scss">
  .mt-10 {
    margin-top: 10px;
  }
  .search_form {
    :deep(.el-select__tags) {
      max-width: 100px !important;
    }
  }
  .card_position {
    position: relative;
    .tools_btn {
      display: flex;
      margin-bottom: 10px;
      justify-content: flex-end;
    }
  }
</style>
