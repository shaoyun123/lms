<template>
  <div id="task_center-list" class="task_center app-container">
    <!-- 数据筛选 start -->
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-row>
          <el-form-item label="批次号" prop="batchNos">
            <el-input
              v-model="formData.batchNos"
              placeholder="精准查询；多个用,隔开"
              clearable
              style="width: 150px"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务模块" prop="">
            <MultiSelect
              v-model="formData.businessModule"
              placeholder="请选择"
              :option-obj="{ optionList: businessModuleList }"
            />
          </el-form-item>
          <el-form-item label="任务名称" prop="businessType">
            <el-select
              v-model="formData.businessType"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in taskNameOption"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间" prop="time">
            <el-date-picker
              v-model="formData.time"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="shortcuts"
              placeholder="请选择"
              @change="changeTime"
            />
          </el-form-item>
          <el-form-item label="完成时间" prop="completeTime">
            <el-date-picker
              v-model="formData.completeTime"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="shortcuts"
              placeholder="请选择"
              @change="changeCompleteTime"
            />
          </el-form-item>
          <el-form-item
            label="操作人"
            prop="creatorIdList"
            class="creatorIdList"
          >
            <el-select
              v-model="formData.creatorIdList"
              style="width: 150px"
              placeholder="请选择"
              multiple
              collapse-tags
              clearable
              filterable
              default-first-option
            >
              <el-option
                v-for="item in allCreator"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务结果" prop=" taskStatusEnum">
            <el-select
              v-model="formData.taskStatusEnum"
              placeholder="请选择"
              clearable
              filterable
              @clear="clearTaskStatus"
            >
              <el-option
                v-for="(item, index) in taskStatusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结果文件" prop="haveResult">
            <el-select v-model="formData.haveResult" filterable clearable>
              <el-option label="有" :value="true"></el-option>
              <el-option label="无" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <el-button type="primary" @click="resetForm(formRef)"
              >清空</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <!-- 数据筛选 end -->

    <!-- 任务中心列表 table start -->
    <el-card class="common_split_bottom card_position list_card">
      <vxe-table
        ref="orderTable"
        v-loading="tableLoading"
        :data="taskCenterList"
        :height="height"
        :show-overflow="true"
        :scroll-y="{ gt: 10 }"
        border
      >
        <vxe-column title="批次号" width="150">
          <template #default="{ row }">
            <div>{{ row.batchNo }}</div>
          </template>
        </vxe-column>
        <vxe-column title="业务模块" width="100">
          <template #default="{ row }">
            <div>{{ row.businessModule }}</div>
          </template>
        </vxe-column>
        <vxe-column title="任务名称">
          <template #default="{ row }">
            <div>{{ row.businessType }}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作时间">
          <template #default="{ row }">
            <div>操作：{{ transferDate(row.createTime) }}</div>
            <div>完成：{{ transferDate(row.completeTime) }}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作人" width="100">
          <template #default="{ row }">
            <div>{{ row.creator }}</div>
          </template>
        </vxe-column>
        <vxe-column title="任务结果">
          <template #default="{ row }">
            <div v-if="row.operaStatus == 2">执行中断，请重新执行操作</div>
            <div v-else>
              <span v-if="row.taskStatus === true"
                >已完成, 成功{{ `${row.totalNumber - row.failNumber}` || 0 }}条,
                失败{{ row.failNumber }}条</span
              >
              <span v-else
                >处理中, 预计处理数据{{ `${row.totalNumber}` || 0 }}条</span
              >
            </div>
          </template>
        </vxe-column>
        <vxe-column title="结果文件">
          <template #default="{ row }">
            <div v-if="row.operateResultFileUri" style="text-align: center">
              <a
                v-if="row.businessType === 'TikTok在线商品导入调价'"
                :href="row.operateResultFileUri"
                >{{
                  `${
                    transferDate(row.createTime) +
                    ' ' +
                    'TikTok在线商品导入调价失败'
                  }`
                }}</a
              >
              <a v-else :href="row.operateResultFileUri">{{
                `${transferDate(row.createTime) + ' ' + row.businessType}`
              }}</a>
            </div>
          </template>
        </vxe-column>
      </vxe-table>

      <div class="pagination">
        <el-pagination
          v-model:currentPage="formData.page"
          v-model:page-size="formData.limit"
          background
          :page-sizes="[50, 100, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 任务中心列表 table end -->
  </div>
</template>

<script setup name="shopeeoperatetaskcenter">
  import {
    getBusinessTypeEnum,
    getAllCreatorApi,
    getShopeeTaskCenter,
    getAllBusinessModuleApi,
    getTaskStatusApi
  } from '@/api/publishs/taskcenter';
  import { transferDate, comGetTableHeight } from '@/utils/common';
  import { shortcuts } from '@/api/common';
  import { onMounted, ref, computed } from 'vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';

  const searchCardRef = ref();
  const formData = ref({
    batchNos: '',
    batchNoList: [], // 批次号
    businessType: null, // 业务类型（任务名称）
    creatorIdList: [], // 创建人
    taskStatusEnum: null, // 任务状态
    haveResult: '', // 是否结果文件
    limit: 50,
    page: 1,
    startTime: '',
    endTime: '',
    time: '',
    completeTime: '', // 完成时间
    completeStartTime: '',
    completeEndTime: ''
  });

  onMounted(() => {
    businessTypeEnum();
    getAllCreator();
    getAllBusinessModule();
    getTaskStatus();
  });
  const total = ref(0);
  const taskNameOption = ref([]);

  // 高度
  const height = computed(
    () => comGetTableHeight(searchCardRef, true, false) - 9
  );

  const tableLoading = ref(false);

  const changeTime = () => {
    [formData.value.startTime, formData.value.endTime] =
      formData.value.time || [];
  };
  const changeCompleteTime = () => {
    [formData.value.completeStartTime, formData.value.completeEndTime] =
      formData.value.completeTime || [];
  };

  const businessTypeEnum = async () => {
    try {
      const { code, data } = await getBusinessTypeEnum();
      if (code === '0000') {
        taskNameOption.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const allCreator = ref([]);
  const getAllCreator = async () => {
    try {
      const { code, data } = await getAllCreatorApi();
      if (code === '0000') {
        allCreator.value = data;
        // 默认选中当前操作人
        const currentUserId = Number(localStorage.getItem('loginId'));
        const selectedItem = allCreator.value.find(
          (item) => currentUserId === item.id
        );
        formData.value.creatorIdList.push(selectedItem.id);
        handleSearch();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const businessModuleList = ref([]);
  const getAllBusinessModule = async () => {
    try {
      const { code, data } = await getAllBusinessModuleApi();
      if (code === '0000') {
        businessModuleList.value = data;
      }
    } catch (err) {
      businessModuleList.value = [];
    }
  };

  const taskStatusList = ref([]);
  const getTaskStatus = async () => {
    try {
      const { code, data } = await getTaskStatusApi();
      if (code === '0000') {
        data?.forEach((item) => {
          let obj = {
            label: item,
            value: item
          };
          taskStatusList.value.push(obj);
        });
      }
    } catch (err) {
      taskStatusList.value = [];
    }
  };

  const clearTaskStatus = () => {
    formData.value.taskStatusEnum = null;
  };

  // 分页
  const handleSizeChange = (val) => {
    formData.value.pageSize = val;
    formData.value.page = 1;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    formData.value.page = val;
    handleSearch();
  };

  const taskCenterList = ref([]);
  const getShopeeTaskCenterList = async () => {
    try {
      if (!formData.value.businessType) {
        formData.value.businessType = null;
      }
      const newFormData = JSON.parse(JSON.stringify(formData.value));
      newFormData.batchNoList = newFormData.batchNos
        ? newFormData.batchNos.split(',')
        : [];
      delete newFormData.time;
      delete newFormData.batchNos;
      delete newFormData.completeTime;
      tableLoading.value = true;

      const { code, count, data } = await getShopeeTaskCenter({
        ...newFormData
      }).finally(() => (tableLoading.value = false));

      if (code === '0000') {
        taskCenterList.value = data;
        total.value = count;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formRef = ref();
  const handleSearch = () => {
    getShopeeTaskCenterList();
  };

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.value.startTime = '';
    formData.value.endTime = '';
    formData.value.completeStartTime = '';
    formData.value.completeEndTime = '';
  };
</script>

<style lang="scss" scoped></style>
