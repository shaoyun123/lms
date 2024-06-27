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
        <el-form-item label="站点" prop="salseSiteList">
          <MultiSelect
            v-model="formData.salseSiteList"
            placeholder="请选择"
            :option-obj="{
              optionList: initFormData.sites,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item
          label="店铺"
          prop="storeAcctIdList"
          class="search_item_cascader"
        >
          <z-cascader
            v-model="formData.storeAcctIdList"
            :data="initFormData.storeData"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.storeAcctIdList"
            :options="initFormData.storeData"
            :filter-method="filterStore"
            :props="cascaderProps"
            filterable
            clearable
            collapse-tags
          ></el-cascader> -->
        </el-form-item>
        <el-form-item label="名称" prop="autoReplyName">
          <el-select v-model="formData.includeName" class="form_left">
            <el-option label="包含" :value="true" />
            <el-option label="不包含" :value="false" />
          </el-select>
          <el-input
            v-model="formData.autoReplyName"
            clearable
            class="form_right"
          />
        </el-form-item>
        <el-form-item label="触发方式" prop="triggerTypeList">
          <MultiSelect
            v-model="formData.triggerTypeList"
            placeholder="请选择"
            :option-obj="{
              optionList: initFormData.triggerTypeEnum
            }"
          />
        </el-form-item>
        <el-form-item label="创建人" prop="creator">
          <el-select
            v-model="formData.creator"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in initFormData.creatorList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择" clearable>
            <el-option label="已启用" :value="true" />
            <el-option label="已关闭" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="tableDataLoading"
            type="primary"
            @click="handleSubmit"
            >查询</el-button
          >
          <el-button @click="handleResetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <div class="tools_btn" style="display: flex">
        <div></div>
        <div>
          <el-select v-model="batchOp" style="width: 150px">
            <el-option value="" label="批量操作" />
            <el-option
              v-permission="['tiktokAutoReplyBathOpenBtn']"
              value="2"
              label="批量开启"
              @click="handleStatusBatchChange(true)"
            />
            <el-option
              v-permission="['tiktokAutoReplyBathCloseBtn']"
              value="3"
              label="批量关闭"
              @click="handleStatusBatchChange(false)"
            />
          </el-select>
          <el-button type="primary" class="ml10" @click="tableEdit()">
            新增</el-button
          >
        </div>
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
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="status" title="状态"
          ><template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="true"
              :inactive-value="false"
              @change="handleStatusChange(row)"
            />
          </template>
        </vxe-column>
        <vxe-column field="autoReplyName" title="自动回复名称" />
        <vxe-column field="triggerType" title="触发方式" />
        <vxe-column field="salesSite" title="站点">
          <template #default="{ row }">
            {{ row.salesSite }}
          </template>
        </vxe-column>
        <vxe-column field="storeNum" title="应用店铺数" width="100">
          <template #default="{ row }">
            <a @click="tableStore(row)">{{ row.storeNum || 0 }}</a>
          </template>
        </vxe-column>
        <vxe-column field="platOrderStatusStr" title="平台订单状态" />
        <!-- <vxe-column field="platLogisticsStatusStr" title="平台物流状态" /> -->
        <vxe-column field="verbalTrick" title="话术">
          <template #default="{ row }">
            <ExpandText :text="row.verbalTrick" />
          </template>
        </vxe-column>
        <vxe-column field="creator" title="创建人/修改人" width="150">
          <template #default="{ row }">
            <div v-if="row.creator">创建人：{{ row.creator }}</div>
            <div v-if="row.modifier">修改人：{{ row.modifier }}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="150">
          <template #default="{ row }">
            <div style="display: flex">
              <el-button type="primary" @click="tableEdit(row)">修改</el-button>
              <el-button type="danger" @click="handleDel(row.id)"
                >删除</el-button
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
    <!-- 新增&修改 -->
    <Detail
      v-if="showDetail"
      v-model="showDetail"
      :detail-data="detailData"
      :init-data="initFormData"
      @fresh-list="freshList"
    />
    <!-- 店铺 -->
    <Store
      v-if="showStore"
      v-model="showStore"
      :detail-data="detailData"
      @fresh-list="freshList"
    />
  </div>
</template>
<script setup name="publishstiktokautoreply">
  import { ref, reactive, onMounted } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getSiteListApi, getStoreList } from '@/api/common/index';
  // http://yapi.epean.cn/project/365/interface/api/cat_354 接口地址文档
  import {
    initApi,
    queryListApi,
    updateRuleStatusApi,
    delRuleApi
  } from '@/api/publishs/tiktokautoreply';
  import Detail from './components/detail.vue';
  import Store from './components/store.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ExpandText from '@/components/ExpandText.vue';

  // 查询条件
  const formData = reactive({
    salseSiteList: [],
    storeAcctIdList: [],
    includeName: true,
    status: true
  });
  console.log(formData.storeAcctIdList);
  // const cascaderProps = { multiple: true };
  // 初始化查询条件
  const initFormData = reactive({
    sites: [],
    storeData: [],
    creatorList: [],
    logisticStatusEnum: [], // 平台物流状态
    orderStatusEnum: [], // 平台订单状态
    triggerTypeEnum: [] //触发方式
  });

  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);
  const batchOp = ref('');

  onMounted(async () => {
    Promise.all([getSiteListApi('tiktok'), getStoreList('tiktok')])
      .then((res) => {
        // 站点
        initFormData.sites = res[0].data;
        // 店铺
        initFormData.storeData = res[1]?.data?.children || [];
      })
      .catch((err) => ElMessage.error(err));
    init();
  });

  const init = async () => {
    const { data } = await initApi();
    initFormData.creatorList = data.creatorList;
    initFormData.logisticStatusEnum = data.logisticStatusEnum;
    initFormData.orderStatusEnum = data.orderStatusEnum;
    initFormData.triggerTypeEnum = data.triggerTypeEnum;
    initFormData.logisticsTrackingStatus = data.logisticsTrackingStatus;
  };

  const tableDataRef = ref();
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref();
  // 查询条件表单清空
  const handleResetForm = function () {
    formRef.value.resetFields();
    formData.includeName = true;
  };
  // 查询条件提交查询
  const handleSubmit = async () => {
    tableDataLoading.value = true;
    tableData.value = [];

    try {
      let { count, data } = await queryListApi({
        ...formData,
        storeAcctIdList: formData.storeAcctIdList,
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

  //#region  单个操作
  // 选中的当前行数据
  const showDetail = ref(false);
  const detailData = ref({});
  // 编辑
  const tableEdit = async (row) => {
    showDetail.value = true;
    detailData.value = row;
  };

  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    handleSubmit();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    handleSubmit();
  };
  // 设置店铺
  const showStore = ref(false);
  // 设置店铺
  const tableStore = async (row) => {
    detailData.value = row;
    showStore.value = true;
  };
  // const showStoreCloseLog = () => {
  //   showStore.value = false;
  //   handleSubmit();
  // };
  // 开启&关闭任务
  const handleStatusChange = async (row) => {
    try {
      let { msg } = await updateRuleStatusApi({
        ruleIdList: row.id.toString(),
        status: row.status
      });
      ElMessage.success(msg || '操作成功');
    } catch (err) {
      // 若接口没成功，返回原来状态
      row.status = row.status ? false : true;
    }
  };
  // 商品删除
  const handleDel = (id) => {
    ElMessageBox.confirm(`请再次确认是否删除?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { msg } = await delRuleApi([id]);
      ElMessage.success(msg);
      handleSubmit();
    });
  };
  //#endregion  单个操作
  //#region  批量操作
  const handleStatusBatchChange = async (status) => {
    let checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let ruleIdList = checkedData.map((item) => item.id);
    ElMessageBox.confirm(`确认要批量${status ? '开启' : '关闭'}?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { code, data, msg } = await updateRuleStatusApi({
        ruleIdList: ruleIdList.toString(),
        status
      });
      if (code === '0000') {
        if (data && data.length != 0) {
          let str = '部分操作成功；';
          str = str + '\n' + msg + '  规则id为: ' + data.join(',');

          ElMessageBox.alert(`<div>${str}</div>`, '操作结果', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '取消'
          });
        } else {
          ElMessage.success(msg);
        }
        handleSubmit();
      }
    });
  };
  //#endregion  批量操作
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
  });
  // const filterStore = (node, keyword) => {
  //   const label = node?.label?.trim();
  //   const text = node?.text?.trim();
  //   const _keyword = keyword.trim().replaceAll('，', ',').split(',');
  //   const hasLabel = _keyword.some((item) => label.includes(item));
  //   const hasText = _keyword.some((item) => text.includes(item));
  //   if (hasLabel || hasText) {
  //     return node;
  //   }
  // };
  const freshList = () => {
    init();
    handleSubmit();
  };
</script>
<style scoped lang="scss">
  .mt-10 {
    margin-top: 10px;
  }
  //   查询条件--listing状态框
  .search_form {
    :deep(.el-select__tags) {
      max-width: 100px !important;
    }
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

  .card_position {
    position: relative;
    .tools_btn {
      display: flex;
      margin-bottom: 10px;
      justify-content: space-between;
    }
  }
  .ml10 {
    margin-left: 10px;
  }
</style>
