<template>
  <!--shopee-物流映射 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item label="站点" prop="siteList">
          <MultiSelect
            v-model="formData.siteList"
            :option-obj="{
              optionList: initList.siteList,
              label: 'name',
              value: 'code'
            }"
          />
        </el-form-item>
        <el-form-item label="校验值" prop="prohibitType">
          <el-select v-model="formData.prohibitType" clearable filterable>
            <el-option
              v-for="item in ConstantObj.prohibitTypeList"
              :key="item"
              :label="item"
              :value="item"
          /></el-select>
        </el-form-item>
        <el-form-item label="CNSC类目ID" prop="categoryIdList">
          <el-input
            v-model="formData.categoryIdList"
            placeholder="支持多CNSC类目ID精确查询"
            clearable
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <el-form-item label="物流ID" prop="logisticIdList">
          <el-input
            v-model="formData.logisticIdList"
            placeholder="支持多物流ID精确查询"
            clearable
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <el-form-item label="创建人" prop="creator">
          <el-select v-model="formData.creator" clearable filterable>
            <el-option
              v-for="item in initList.creatorList"
              :key="item"
              :label="item"
              :value="item"
          /></el-select>
        </el-form-item>
        <el-form-item label="修改人" prop="modifier">
          <el-select v-model="formData.modifier" clearable filterable>
            <el-option
              v-for="item in initList.modifierList"
              :key="item"
              :label="item"
              :value="item"
          /></el-select>
        </el-form-item>
        <el-form-item label="规则状态" prop="status">
          <el-select v-model="formData.status" clearable filterable>
            <el-option label="无效" :value="0" />
            <el-option label="生效中" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button
          ><el-button type="primary" @click="handleResetForm(formRef)"
            >清空</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card class="list_card">
      <el-tabs
        v-model="activeKey"
        type="card"
        class="demo-tabs"
        @tab-click="handleTab"
      >
        <el-tab-pane :label="`数量(${paginationData.total})`" name="total">
          <vxe-grid ref="tableRef" v-bind="gridOptions">
            <template #filterValue_default="{ row }">
              <div v-if="row.prohibitType === 'CNSC类目'">
                {{ row.categoryName }}({{ row.categoryId }})
              </div>
              <div v-else-if="row.prohibitType === '外箱包装'">
                {{ getouterBoxPackingStr(row.outerBoxPackingConditionList) }}
              </div>
              <div v-else-if="row.prohibitType === '物流属性'">
                {{ row.logisAttrList || '' }}
              </div>
              <div v-else-if="row.prohibitType === '可售天数'">
                {{ row.minDailySaleDays }}
              </div>
            </template>
            <template #operator_default="{ row }">
              <div>创建:{{ row.creator }}</div>
              <div>修改:{{ row.modifier }}</div>
            </template>
            <template #operateTime_default="{ row }">
              <div>创建:{{ transferDate(row.createTime) }}</div>
              <div>修改:{{ transferDate(row.modifyTime) }}</div>
            </template>
            <template #status_default="{ row }">
              <el-popconfirm
                :title="
                  ConstantObj[row.status ? 'confirmCloseStr' : 'confirmOpenStr']
                "
                width="200"
                :confirm-button-text="row.status ? '确认关闭' : '确认开启'"
                @confirm="handleStatusConfirm(row)"
              >
                <template #reference>
                  <el-switch
                    v-model="row.status"
                    size="large"
                    :before-change="statusBeforeChange"
                  />
                </template>
              </el-popconfirm>
            </template>
            <template #toolbar_default="{ row }">
              <el-button type="primary" @click="handleEdit(row)">
                编辑
              </el-button>
            </template>
          </vxe-grid>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="paginationData.page"
              v-model:page-size="paginationData.limit"
              background
              :page-sizes="[100, 200, 500]"
              :small="true"
              layout="total, sizes, prev, pager, next"
              :total="paginationData.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="common_batch_btns batch-btn-wrapper">
        <div>
          <el-button type="primary" @click="handleDownloadTpl"
            >下载模板</el-button
          >

          <el-dropdown :teleported="false">
            <el-button
              type="primary"
              class="export-wrapper"
              :loading="importLoading"
            >
              导入excel<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in exportSetting"
                  :key="item.importUrl"
                >
                  <el-upload
                    :action="item.importUrl"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :show-file-list="false"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    :before-upload="handleUploadBefore"
                    >{{ item.name }}</el-upload
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-text v-if="importReselut.text" type="success" class="ml10">{{
            importReselut.text
          }}</el-text>
          <el-text
            v-if="importReselut.id"
            type="primary"
            class="ml10"
            @click="importReselutInfo(importReselut.id)"
            >查看错误详情</el-text
          >
        </div>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </el-card>
    <!-- 详情 -->
    <Detail
      v-if="detailVisible"
      v-model="detailVisible"
      :detail="detailRow"
      :init-list="initList"
      @handle-search="queryPage"
    />
  </div>
</template>

<script setup name="shopeepublishslogisticprohibit">
  import { onMounted, ref, reactive, nextTick } from 'vue';
  import { transferDate, comGetTableHeight } from '@/utils/common';
  import {
    queryPageApi,
    getCreatorListApi,
    getModifierListApi,
    modifyRuleStatusApi
  } from '@/api/shopee/logisticprohibit';
  import { getSiteListApi } from '@/api/shopee/common';
  import { ElMessage } from 'element-plus';
  import { commonDivideCommaNum } from '@/utils/divide';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import Detail from './components/Detail.vue';
  import ConstantObj from './constant';
  import { successColor, dangerColor } from '@/styles/vars.module.scss';
  import { submitForm } from '@/utils/downloadFile';

  const initList = reactive({});

  onMounted(async () => {
    getModifierList();
    getCreatorList();
    Promise.all([getSiteListApi()]).then((res) => {
      initList.siteList = res[0].data.siteList || [];
      gridOptions.height = comGetTableHeight(searchCardRef, true, true);
    });
  });

  const getModifierList = async () => {
    const { data } = await getModifierListApi();
    initList.modifierList = data;
  };
  const getCreatorList = async () => {
    const { data } = await getCreatorListApi();
    initList.creatorList = data;
  };

  //   #region 查询
  const formData = reactive({});
  const formRef = ref();
  const searchCardRef = ref(null);
  const paginationData = reactive({
    total: 0,
    limit: 100,
    page: 1
  });
  const handleSearch = async () => {
    paginationData.page = 1;
    queryPage();
  };
  const getParams = () => {
    const obj = { ...formData };
    if (obj.categoryIdList) {
      obj.categoryIdList = obj.categoryIdList.split(',');
    } else {
      obj.categoryIdList = [];
    }
    if (obj.logisticIdList) {
      obj.logisticIdList = obj.logisticIdList.split(',');
    } else {
      obj.logisticIdList = [];
    }
    return obj;
  };
  const queryPage = async () => {
    const { limit, page } = paginationData;
    const params = getParams();
    try {
      const { data = [], count } = await queryPageApi({
        limit,
        page,
        ...params
      });
      gridOptions.data = data;
      paginationData.total = count;
      // 设置left
      nextTick(() => {
        const tabWidth = document.querySelector('.el-tabs__nav').clientWidth;
        const batchBtnEle = document.querySelector('.batch-btn-wrapper');
        batchBtnEle.style.left = tabWidth + 40 + 'px';
      });
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };
  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    queryPage();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    queryPage();
  };

  const activeKey = ref('total');
  const handleTab = ({ paneName }) => {
    activeKey.value = paneName;
    handleSearch();
  };
  // #endregion 查询

  //   #region 表格
  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showFooter: true,
    height: 200,
    columnConfig: {
      resizable: true
    },
    showOverflow: true,
    scrollY: { enable: false },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    data: [],
    columns: [
      {
        field: 'salesSite',
        title: '站点',
        formatter: ({ cellValue }) =>
          initList.siteList.find((v) => v.code === cellValue).name +
          `(${cellValue})`
      },
      { field: 'prohibitType', title: '校验值' },
      {
        field: 'filterValue',
        title: '过滤值',
        width: 200,
        slots: { default: 'filterValue_default' }
      },
      {
        field: 'logisticsChannelName',
        title: '物流名称',
        width: 200,
        formatter: ({ cellValue, row }) =>
          cellValue + `(${row.logisticsChannelId})`
      },
      {
        field: 'operator',
        title: '操作人',
        slots: { default: 'operator_default' }
      },
      {
        field: 'operateTime',
        title: '操作时间',
        width: 200,
        slots: { default: 'operateTime_default' }
      },
      {
        field: 'status',
        title: '状态',
        slots: { default: 'status_default' }
      },
      {
        field: 'toolbar',
        title: '操作',
        width: 100,
        slots: { default: 'toolbar_default' }
      }
    ],
    footerMethod() {}
  });
  const getouterBoxPackingStr = (outerBoxPackingConditionList = []) => {
    const arr = outerBoxPackingConditionList.map((v) => {
      const unit = ConstantObj.unitObj[v.target] || '';
      const operator = v.operator === '==' ? '=' : v.operator;
      return v.target + operator + v.value + unit;
    });
    const str = arr.join('\nor ');
    return str;
  };
  const statusBeforeChange = () => {
    return false;
  };
  const handleStatusConfirm = async (row) => {
    const newStatus = !row.status;
    const { msg } = await modifyRuleStatusApi({
      id: row.id,
      status: newStatus
    });
    ElMessage.success(msg);
    row.status = newStatus;
  };
  //   #endregion 表格

  //   #region 详情弹窗
  const detailVisible = ref(false);
  const detailRow = ref({});
  const handleAdd = () => {
    detailVisible.value = true;
    detailRow.value = {};
  };
  const handleEdit = (row) => {
    detailVisible.value = true;
    detailRow.value = row;
  };
  //   #endregion 详情弹窗

  // #region 下载和导出
  const importReselut = reactive({
    text: '',
    id: null
  });
  const exportSetting = {
    add: {
      name: '新增禁用规则',
      downloadTplUrl:
        '/lms/static/templet/ShopeeCategoryLogisticProhibitImport.xlsx',
      importUrl:
        '/api/lms/shopee/logistic/importAddNewShopeeCategoryLogisticProhibit'
    },
    repalce: {
      name: '替换选中站点禁用规则',
      downloadTplUrl:
        '/lms//static/templet/ShopeeCategoryLogisticProhibitImport.xlsx',
      importUrl:
        '/api/lms/shopee/logistic/importReplaceShopeeCategoryLogisticProhibit'
    },
    del: {
      name: '删除禁用规则',
      downloadTplUrl:
        '/lms/static/templet/ShopeeCategoryLogisticProhibitImport.xlsx',
      importUrl:
        '/api/lms/shopee/logistic/importShutdownShopeeCategoryLogisticProhibit'
    }
  };
  const handleDownloadTpl = () => {
    window.open(
      '/lms//static/templet/ShopeeCategoryLogisticProhibitImport.xlsx',
      '_blank'
    );
  };
  // 导入
  const importLoading = ref(false);
  const handleUploadBefore = () => {
    importLoading.value = true;
    console.log('object :>> ', importLoading.value);
  };
  const handleUploadSuccess = (res) => {
    importLoading.value = false;
    if (res.code == '0000') {
      ElMessage.success(res.msg);
      importReselut.color = successColor;
      if (res.data) {
        importReselut.text = '文件数据出现错误';
        importReselut.id = res.data;
        importReselut.color = dangerColor;
      } else {
        importReselut.text = res.msg;
        importReselut.id = null;
      }
      // 创建人和修改人刷新
      getModifierList();
      getCreatorList();
      handleSearch();
    } else {
      ElMessage.error(res.msg);
      importReselut.color = dangerColor;
      importReselut.text = res.msg;
      importReselut.id = null;
    }
  };
  const handleUploadError = (error) => {
    importLoading.value = false;
    ElMessage.error(error.statusText);
    importReselut.color = dangerColor;
    importReselut.text = error.statusText;
    importReselut.id = null;
  };
  const importReselutInfo = (uuId) => {
    submitForm({ uuId }, '/lms/shopee/logistic/downloadImportOperateFailedLog');
  };
  // #endregion 下载和导出
</script>

<style lang="scss" scoped>
  :deep(.vxe-table--render-default .vxe-cell) {
    padding: 5px 10px;
  }
  .batch-btn-wrapper {
    display: flex;
    justify-content: space-between;
    left: 100px;
    :deep(.el-dropdown-menu__item > div) {
      width: 100%;
    }
    :deep(.el-upload) {
      width: 100%;
      justify-content: start;
    }
  }
  .export-wrapper {
    width: 100px;
    margin-left: 10px;
  }
  .ml10 {
    margin-left: 10px;
  }
</style>
