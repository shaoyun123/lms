<template>
  <div class="app-container forceprices-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form :model="formData" class="search_form" :inline="true">
        <el-form-item>
          <el-select v-model="createTime" class="form_left">
            <el-option :value="1" label="录入时间" />
          </el-select>
          <el-date-picker
            v-model="formData.createTime"
            type="daterange"
            popper-class="forceprices-times"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="录入人">
          <el-select
            v-model="formData.creator"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in creatorList"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.skuType" class="form_left">
            <el-option :value="1" label="子SKU" />
            <el-option :value="2" label="父SKU" />
          </el-select>
          <el-input
            v-model="formData.prodSSkuStr"
            placeholder="多个英文逗号隔开"
            clearable
            @blur="handleSkuBlur"
          ></el-input>
          <el-switch
            v-model="formData.skuSwitch"
            active-text="精确"
            inactive-text="模糊"
            inline-prompt
            size="large"
          ></el-switch>
        </el-form-item>
        <el-form-item label="调价类型">
          <el-select
            v-model="formData.priceChangeType"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option :value="1" label="涨价"></el-option>
            <el-option :value="2" label="降价"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="涨价原因">
          <el-select
            v-model="formData.reasonList"
            filterable
            :class="formData?.reasonList?.length > 1 ? 'hide_tag' : ''"
            clearable
            multiple
            placeholder="请选择"
          >
            <template #prefix>
              <el-tag v-if="formData?.reasonList?.length > 1" type="info"
                >已选{{ formData?.reasonList?.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in reasonTypeOption"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调价处理">
          <el-select
            v-model="formData.priceChangeDealStatus"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option :value="2" label="未处理"></el-option>
            <el-option :value="1" label="已处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select
            v-model="formData.orderBy"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option :value="1" label="创建时间倒序"></el-option>
            <el-option :value="2" label="差值正序"></el-option>
            <el-option :value="3" label="差值倒序"></el-option>
            <el-option :value="4" label="差值比例正序"></el-option>
            <el-option :value="5" label="差值比例倒序"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="searchLoading"
            @click="handleQuery"
            >查询</el-button
          >
          <el-button @click="resetSearchForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="common_split_bottom list_card">
      <div class="card-tool">
        <div>
          <el-button
            v-permission="['handleBatchAdjustPrice']"
            type="primary"
            @click="batchAjustPrice"
          >
            批量调价
          </el-button>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="不联动调价"
            placement="right"
          >
            <el-button
              v-permission="['handleBatchSignProcessed']"
              type="primary"
              @click="batchSignProcessed"
            >
              标记已处理
              <el-icon class="el-icon--right"><WarningFilled /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        <div style="display: flex">
          <el-button
            v-permission="['adjustpriceRecordDeleteBtn']"
            type="danger"
            @click="deletePriceRecord({}, 1)"
            >批量删除</el-button
          >
          <el-button type="primary" @click="updatePrice()">新增</el-button>
          <el-button type="primary" @click="downloadTemp">下载模板</el-button>
          <el-upload
            :action="'/api/lms/purchasePriceChange/importPurPriceChangeTemplate'"
            :on-success="importSuccess"
            :on-error="importError"
            :on-progress="importProcess"
            :show-file-list="false"
          >
            <el-button type="primary">导入模板</el-button>
          </el-upload>
          <el-button
            v-permission="['handleBatchExport']"
            type="primary"
            @click="handleExport"
          >
            导出</el-button
          >
        </div>
      </div>

      <vxe-table
        ref="tableRef"
        :height="height"
        :scroll-y="{ gt: 10 }"
        :data="tableData"
        :show-overflow="true"
        :loading="tableLoading"
        border
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column field="prodSSku" title="SKU" width="150">
          <template #default="{ row }">
            <div>
              {{ row.prodSSku }}
              <span v-if="row.ifNew">
                <el-tag type="success" size="small">新</el-tag>
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="采购" width="150">
          <template #default="{ row }">
            <div>采购基数：{{ row.purchaseNum }}</div>
            <div class="showOneLine">
              <a :href="row.purchaseUrl" target="_blank">{{
                row.purchaseUrl
              }}</a>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="beforePrice" title="调整前商品报价(￥)"></vxe-column>
        <vxe-column field="afterPrice" title="调整后商品报价(￥)"></vxe-column>
        <vxe-column field="subPrice" title="差值(￥)">
          <template #default="{ row }">
            <div
              v-if="row.subPrice !== 0"
              :class="row.subPrice > 0 ? 'fail_color' : 'success_color'"
            >
              {{ row.subPrice }}
            </div>
            <div v-else>{{ row.subPrice }}</div>
          </template>
        </vxe-column>
        <vxe-column field="subPriceRatio" title="差值比例">
          <template #default="{ row }">
            {{ Math.round(row.subPriceRatio * 100) + '%' }}
          </template>
        </vxe-column>
        <vxe-column
          field="beforeSupplierPackPrice"
          title="调整前供应商包装费(￥)"
          width="120"
        >
        </vxe-column>
        <vxe-column
          field="afterSupplierPackPrice"
          title="调整后供应商包装费(￥)"
          width="120"
        >
        </vxe-column>
        <vxe-column field="reason" title="涨价原因">
          <template #default="{ row }">
            <div>
              <el-tooltip
                placement="right"
                class="box-item"
                effect="dark"
                :content="row.reason"
              >
                <div class="showTwoLine">{{ row.reason }}</div>
              </el-tooltip>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="义乌仓库存" width="130">
          <template #default="{ row }">
            <div>可用数量：{{ row.stockAvailable }}</div>
            <div>平均成本：{{ row.avgCost }}</div>
            <div>库存金额：{{ row.inventoryValue }}</div>
          </template>
        </vxe-column>
        <vxe-column title="义乌仓销量" width="120">
          <template #default="{ row }">
            <div>日均销量：{{ row.dailySaleNum3Valid }}</div>
            <div>周转天数：{{ row.inventoryTurnoverDays }}</div>
          </template>
        </vxe-column>
        <vxe-column title="是否通知开发">
          <template #default="{ row }">
            <div>
              {{ row.ifCall ? '是' : '否' }}
            </div>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注">
          <template #default="{ row }">
            <div>
              <el-tooltip
                placement="right"
                class="box-item"
                effect="dark"
                :content="row.remark"
              >
                <div class="showThreeLine">{{ row.remark }}</div>
              </el-tooltip>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="录入信息" width="180">
          <template #default="{ row }">
            <div>人员： {{ row.creator }}</div>
            <div>时间: {{ transferDate(row.createTime) }}</div>
          </template>
        </vxe-column>
        <vxe-column field="result" title="调价结果">
          <template #default="{ row }">
            <div>
              {{ row.result }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              :disabled="row.result !== '未处理'"
              @click="updatePrice('edit', row)"
              >修改</el-button
            >
            <el-button
              v-permission="['adjustpriceRecordDeleteBtn']"
              link
              type="danger"
              :disabled="row.result !== '未处理'"
              @click="deletePriceRecord(row, 0)"
              >删除</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>

      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[50, 100, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增修改价格变动 -->
    <UpdatePrice
      v-model="batchUpdatePriceVisible"
      :is-edit="isEdit"
      :select-row="selectRow"
      @handle-search="handleQuery"
    />
  </div>
</template>

<script setup name="purchaseadjustpricerecords">
  import { ref, reactive, onMounted, computed } from 'vue';
  import {
    searchPurPriceChange,
    queryLast180DayCreator,
    queryReasonType,
    deletePurPriceChange,
    markAsDealPurPriceChange,
    dealPurPriceChange,
    downloadAdjustPriceTemplate
  } from '@/api/purchase/adjustprice';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transferDate } from '@/utils/common';
  import { transBlob } from '@/utils/downloadFile';
  import UpdatePrice from './components/Update.vue';
  import { shortcuts } from '@/api/common';
  import { omit } from 'lodash-es';

  const formData = reactive({
    creator: '', // 录入人
    createTime: [], // 录入时间
    createTimeStart: '',
    createTimeEnd: '',
    prodSSkuStr: '',
    // prodSSkuList: [], // 商品sku列表
    reasonList: [], // 商品sku列表
    priceChangeType: null, // 调价类型1涨价 2降价
    priceChangeDealStatus: null, // 调价处理1已处理 2未处理
    orderBy: 1, // 排序方式
    prodSSkuList: [], // 子sku多个精确
    prodSSku: '', // 子sku精确
    prodSSkuLike: '', // 子sku模糊
    prodPSkuList: [], // 父sku多个精确
    prodPSku: '', // 父sku精确
    prodPSkuLike: '', // 父sku模糊
    skuType: 1
  });

  const createTime = ref(1);
  const paginationData = reactive({
    page: 1,
    limit: 100,
    total: 0
  });
  const tableData = ref([]); // 列表数据

  // 按钮 loading
  const searchLoading = ref(false);
  const tableLoading = ref(false);

  onMounted(() => {
    getLast180DayCreatorList();
    getqueryReasonTypeOption();
  });

  // 录入人枚举
  const creatorList = ref(false);
  const getLast180DayCreatorList = async () => {
    const { data } = await queryLast180DayCreator();
    creatorList.value = data;
  };

  // 涨价原因枚举
  const reasonTypeOption = ref(false);
  const getqueryReasonTypeOption = async () => {
    const { data } = await queryReasonType();
    reasonTypeOption.value = data;
  };

  // 格式化时间
  const formatCreateTime = () => {
    if (
      formData.createTime &&
      formData.createTime.length != 0 &&
      formData.createTime !== null
    ) {
      formData.createTimeStart = formData.createTime[0] + ' 00:00:00';
      formData.createTimeEnd = formData.createTime[1] + ' 23:59:59';
    }
    if (formData.createTime === null) {
      formData.createTime = [];
      formData.createTimeStart = '';
      formData.createTimeEnd = '';
    }
  };

  const resetSkuInfo = () => {
    formData.prodSSkuList = [];
    formData.prodSSku = '';
    formData.prodSSkuLike = '';
    formData.prodPSkuList = [];
    formData.prodPSku = '';
    formData.prodPSkuLike = '';
  };

  const handleSkuBlur = () => {
    if (formData.prodSSkuStr.indexOf(',') > -1) {
      formData.skuSwitch = true;
    }
  };

  const getParams = () => {
    resetSkuInfo();
    let list = formData.prodSSkuStr?.split(',') || [];
    if (list.length > 1) {
      // 多个 默认为精确
      if (formData.skuType === 1) {
        formData.prodSSkuList = list;
      }
      if (formData.skuType === 2) {
        formData.prodPSkuList = list;
      }
    } else {
      if (formData.skuType === 1) {
        // 子sku
        if (formData.skuSwitch) {
          // 精确
          formData.prodSSku = formData.prodSSkuStr;
        } else {
          formData.prodSSkuLike = formData.prodSSkuStr;
        }
      }
      if (formData.skuType === 2) {
        if (formData.skuSwitch) {
          // 精确
          formData.prodPSku = formData.prodSSkuStr;
        } else {
          formData.prodPSkuLike = formData.prodSSkuStr;
        }
      }
    }
  };

  // 查询列表
  const handleQuery = async () => {
    let list = formData.prodSSkuStr?.split(',') || [];
    if (list?.length > 1 && formData.skuSwitch === false) {
      ElMessage.warning('多个SKU仅支持精确查询！');
      return;
    }
    searchLoading.value = true;
    tableLoading.value = true;
    getParams();

    formatCreateTime();
    const params = omit(formData, ['createTime', 'prodSSkuStr']);
    const { data, count } = await searchPurPriceChange({
      ...params,
      page: paginationData.page,
      limit: paginationData.limit
    }).finally(() => {
      searchLoading.value = false;
      tableLoading.value = false;
    });

    tableData.value = data.list;
    paginationData.total = count;
  };

  const batchUpdatePriceVisible = ref(false);

  const tableRef = ref(null);
  const selectRow = ref({}); // 当前行修改选中行
  const isEdit = ref(false);

  // 新增修改弹窗
  const updatePrice = (type, row) => {
    if (type === 'edit') {
      isEdit.value = true;
      selectRow.value = row;
    } else {
      isEdit.value = false;
    }
    batchUpdatePriceVisible.value = true;
  };

  // 模板下载
  const downloadTemp = async () => {
    const res = await downloadAdjustPriceTemplate();
    const xlsx = 'application/vnd.ms-excel';
    const blob = new Blob([res], { type: xlsx }); //转换数据类型
    const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
    a.download = '成本价格记录模板' + '.xlsx';
    a.href = window.URL.createObjectURL(blob);
    a.click();
    a.remove();
  };

  // 导入新增
  const importSuccess = async (res) => {
    if (res.code == '0000') {
      ElMessageBox.confirm(res.msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      });
      handleQuery();
    } else {
      ElMessageBox.confirm(res.msg || '导入新增失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
    tableLoading.value = false;
  };

  const importError = () => {
    ElMessage.error('导入新增失败！');
  };

  const checkedIdList = ref([]);

  // 批量删除
  const deletePriceRecord = async (row, type) => {
    // type 1 批量 0 单个
    const checkedList = tableRef.value.getCheckboxRecords();
    if (checkedList?.length === 0 && type === 1) {
      return ElMessage.warning('请选择数据！');
    }

    await ElMessageBox.confirm(
      `确认${type === 1 ? '批量' : ''}删除勾选数据吗`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    if (type === 1) {
      checkedIdList.value = checkedList.map((item) => item.id);
    }
    const idList = type ? checkedIdList.value : [row.id];

    const { code } = await deletePurPriceChange({ idList });
    if (code === '0000') {
      ElMessage.success('删除成功！');
      handleQuery();
    }
  };

  // 标记为已处理
  const batchSignProcessed = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    await ElMessageBox.confirm('确认批量标记为已处理?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const idList = checkedList.map((item) => item.id);
    const { msg } = await markAsDealPurPriceChange({ idList });
    await ElMessage.success(msg);
    handleQuery();
  };

  // 批量调价
  const batchAjustPrice = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    await ElMessageBox.confirm('确认将勾选数据批量调价吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const idList = checkedList.map((item) => item.id);
    const { msg } = await dealPurPriceChange({ idList });
    await ElMessage.success(msg);
    handleQuery();
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleQuery();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleQuery();
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 210;
  });

  const resetSearchForm = () => {
    formData.creator = '';
    formData.createTime = '';
    formData.prodSSkuList = [];
    formData.prodSSkuStr = '';
    formData.createTimeStart = '';
    formData.createTimeEnd = '';
    formData.prodSSkuStr = '';
    formData.reasonList = [];
    formData.priceChangeType = null;
    formData.priceChangeDealStatus = null;
    formData.orderBy = null;
    resetSkuInfo();
  };

  // 导出
  const handleExport = async () => {
    await ElMessageBox.confirm(
      '确认导出当前搜索条件下的价格变动记录?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    getParams();
    formatCreateTime();

    const params = {
      ...omit(formData, ['createTime', 'prodSSkuStr']),
      page: paginationData.page,
      limit: paginationData.limit
    };
    try {
      searchLoading.value = true;
      transBlob({
        url: '/lms/purchasePriceChange/exportPurPriceChange',
        contentType: 'application/json',
        data: params,
        fileName: '价格变动记录导出' + Date.now() + '.xls'
      }).finally(() => {
        searchLoading.value = false;
        ElMessage.success('下载成功');
      });
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style lang="scss" scoped>
  .forceprices-container {
    .card-tool {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .el-button {
        margin-left: 10px;
      }
    }
  }
  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
  }
  .showOneLine {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .showTwoLine {
    width: 100%;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .showThreeLine {
    width: 100%;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .success_color {
    color: #67c23a;
  }
  .fail_color {
    color: #f56c6c;
  }
</style>
