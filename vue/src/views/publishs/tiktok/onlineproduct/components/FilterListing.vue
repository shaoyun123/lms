<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="不处理listing"
      width="80%"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-card>
        <el-form
          ref="formRef"
          :model="formData"
          :inline="true"
          :label-width="100"
          class="search_form"
        >
          <el-form-item label="不处理类型" prop="filterTypeList">
            <el-select
              v-model="formData.filterTypeList"
              style="width: 220px"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              clearable
            >
              <el-option
                v-for="item in initData.filterTypeEnum"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="店铺"
            prop="storeAcctIdList"
            class="search_item_cascader"
          >
            <z-cascader
              v-model="formData.storeAcctIdList"
              :data="storeTreeList"
            ></z-cascader>
          </el-form-item>
          <el-form-item label="添加时间" prop="addTime">
            <el-date-picker
              v-model="formData.addTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 200px"
              :default-time="defaultTime"
              :shortcuts="shortcuts"
            />
          </el-form-item>
          <el-form-item label="product_id" prop="productId">
            <el-input
              v-model="formData.productId"
              placeholder="支持多个英文逗号分割"
              clearable
              @blur="commonDivideCommaNum($event)"
            />
          </el-form-item>
          <el-form-item
            label="global_product_id"
            prop="globalProductId"
            style="margin-left: 20px"
          >
            <el-input
              v-model="formData.globalProductId"
              placeholder="支持多个英文逗号分割"
              clearable
              @blur="commonDivideCommaNum($event)"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch(true)"
              >查询</el-button
            >
            <el-button @click="handleClear">清空</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="card_position list_card common_split_bottom">
        <div class="page_header">
          <div class="disflex">
            <el-button class="ml10" type="primary" @click="handleUpdate(row, 0)"
              >新增</el-button
            >
            <el-button
              type="primary"
              style="margin: 0 10px"
              :loading="batchExportLoading"
              @click="handleBatchExport"
              >导出</el-button
            >
            <el-button
              type="danger"
              :loading="batchDelLoading"
              @click="handleBatchDel"
              >批量删除</el-button
            >
          </div>
        </div>
        <vxe-grid ref="tableRef" v-bind="gridOptions" style="overflow: hidden">
          <template #TikTok_storeAcct="{ row }">
            <div v-if="row.storeAcct">
              <el-tooltip effect="light" placement="right">
                <template #content
                  ><div class="tooltips_content">
                    {{ row.storeAcct }}
                  </div></template
                >
                <div class="show_two_line" @click="copy(row.storeAcct)">
                  {{ row.storeAcct }}
                </div>
              </el-tooltip>
            </div>
          </template>
          <template #TikTok_listing_tags="{ row }">
            <div v-if="row.listingTagNameList">
              {{ row.listingTagType == 1 ? 'product标签' : 'sku标签' }}:
              {{ row.listingTagNameList }}
            </div>
          </template>
          <template #listing_createInfo="{ row }">
            <div>
              <div>{{ row.creator }}</div>
              <div>{{ transferDate(row.createTime) }}</div>
            </div>
          </template>
          <template #default_toolbar="{ row }">
            <el-button type="primary" @click="handleUpdate(row, 1)"
              >修改</el-button
            >
            <el-button type="danger" @click="handleDel(row)">删除</el-button>
            <el-button type="primary" @click="handleShowLog(row)"
              >日志</el-button
            >
          </template>
        </vxe-grid>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="paginationData.page"
            v-model:page-size="paginationData.limit"
            background
            :page-sizes="[100, 300, 1000]"
            :small="true"
            layout="total, sizes, prev, pager, next"
            :total="paginationData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </el-dialog>

    <!-- 新增修改弹窗 -->
    <UpdateNoProParams
      v-if="isShowUpdateNoProParams"
      :edit-id="editId"
      :store-tree-list="storeTreeList"
      :show-dialog="isShowUpdateNoProParams"
      :filter-type-enum="initData.filterTypeEnum"
      @done="handleSearch(true)"
      @close="closeUpdateNoProParams"
    />
    <FilterListingLogDialog v-model="isShowLog" :log-id="showLogId" />
  </div>
</template>

<script setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { transferDate, copy } from '@/utils/common';
  import {
    filterListingDelApi,
    filterListingQueryApi,
    filterListinginitApi
  } from '@/api/publishs/tiktokonlineproduct';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { shortcuts } from '@/api/common';
  import { commonDivideCommaNum } from '@/utils/divide';
  import { transBlob } from '@/utils/downloadFile';
  import UpdateNoProParams from './UpdateNoProParams.vue';
  import FilterListingLogDialog from './FilterListingLogDialog.vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    },
    storeTreeList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['update:modelValue', 'filterCascader']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const formRef = ref(null);
  const formData = reactive({
    filterTypeList: [], // 不处理类型
    storeAcctIdList: [], // 店铺列表
    globalProductId: '',
    productId: '',
    addTime: []
  });
  const initData = ref({ filterTypeEnum: [] });

  const defaultTime = [
    new Date(0, 0, 0, 0, 0, 0),
    new Date(0, 0, 0, 23, 59, 59)
  ];

  onMounted(async () => {
    const { data } = await filterListinginitApi();
    initData.value = data;
  });

  const paginationData = reactive({
    page: 1,
    limit: 100,
    total: 0
  });

  // 点击搜索
  const handleSearch = async (isSearchBtn = false) => {
    if (isSearchBtn) {
      paginationData.page = 1;
    }
    const obj = getParams();
    try {
      const { data, count } = await filterListingQueryApi(obj);
      gridOptions.data = data.map((item) => {
        if (item.salesCountMin && item.salesCountMax) {
          item.displayText = `${item.salesCountDay}天销量: [${item.salesCountMin}, ${item.salesCountMax}]`;
        } else if (item.salesCountMin) {
          item.displayText = `${item.salesCountDay}天销量: [${item.salesCountMin}, +∞)`;
        } else if (item.salesCountMax) {
          item.displayText = `${item.salesCountDay}天销量: (-∞, ${item.salesCountMax}]`;
        }
        return item;
      });
      paginationData.total = count;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  // 处理参数
  const getParams = () => {
    const obj = { ...formData };
    // 不处理类型
    obj.filterTypeList = obj.filterTypeList.length ? obj.filterTypeList : null;
    // 时间
    if (obj.addTime?.length) {
      [obj.addTimeMin, obj.addTimeMax] = obj.addTime;
    } else {
      obj.addTimeMin = null;
      obj.addTimeMax = null;
    }
    obj.productId = obj.productId || null;
    obj.globalProductId = obj.globalProductId || null;
    obj.limit = paginationData.limit;
    obj.page = paginationData.page;
    return obj;
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleSearch();
  };
  // #endregion

  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height: 500,
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    scrollY: { enabled: false },
    columns: [
      {
        type: 'checkbox',
        width: 40
      },
      {
        title: '过滤类型',
        field: 'filterType'
      },
      {
        title: '店铺',
        field: 'storeAcct',
        slots: { default: 'TikTok_storeAcct' }
      },
      {
        title: '销量',
        field: 'displayText'
      },
      {
        title: '<=模板审核时间天数',
        field: 'templateAuditDay'
      },
      {
        title: '<=距离刊登时间天数',
        field: 'productListingDay'
      },
      {
        title: 'product_id',
        field: 'productId'
      },
      {
        title: 'global_product_id',
        field: 'globalProductId'
      },
      {
        title: 'TikTok在线listing标签',
        field: 'listingTag',
        slots: { default: 'TikTok_listing_tags' }
      },
      {
        title: '备注',
        field: 'remark'
      },
      {
        title: '创建人',
        field: 'creator',
        slots: { default: 'listing_createInfo' }
      },
      {
        title: '操作',
        field: 'toolbar',
        width: 200,
        slots: { default: 'default_toolbar' }
      }
    ],
    data: [],
    toolbarConfig: {
      custom: true
    }
  });

  //   #region 新增 新增0 修改1
  const editId = ref(null);
  const isShowUpdateNoProParams = ref(false);
  const handleUpdate = (row, type) => {
    if (type) {
      editId.value = row.id;
    } else {
      editId.value = null;
    }
    isShowUpdateNoProParams.value = true;
  };

  // 关闭
  const closeUpdateNoProParams = () => {
    isShowUpdateNoProParams.value = false;
  };
  //   #endregion 新增
  //   #region 删除
  const batchDelLoading = ref(false);
  const batchExportLoading = ref(false);
  const handleBatchDel = async () => {
    const $table = tableRef.value;
    // 选中数据
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    const idList = checkedList.map((v) => v.id);
    await ElMessageBox.confirm(
      '该操作将删除所有选中不处理规则，是否继续?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    batchDelLoading.value = true;
    await delList(idList, true);
    $table.removeCheckboxRow();
    batchDelLoading.value = false;
  };

  // 导出
  const handleBatchExport = () => {
    const $table = tableRef.value;
    let obj = {};
    const checkedList = $table.getCheckboxRecords();
    if (checkedList.length) {
      obj.idList = checkedList.map((item) => item.id);
    } else {
      obj = getParams();
    }
    batchExportLoading.value = true;
    transBlob({
      fileName: '在线商品不处理listing.xlsx',
      url: '/lms/tiktok/filterListing/export',
      data: obj,
      contentType: 'application/json'
    })
      .then(() => {
        ElMessage.success('导出成功');
        batchExportLoading.value = false;
      })
      .catch(() => {
        batchExportLoading.value = false;
      });
  };

  const handleDel = async (row) => {
    row.delLoading = true;
    // 掉删除接口
    await delList([row.id], false, row);
    row.delLoading = false;
  };
  const delList = async (arr, isBatch, row) => {
    const $table = tableRef.value;
    try {
      const { msg } = await filterListingDelApi(arr);
      ElMessage.success(msg);
      if (isBatch) {
        $table.removeCheckboxRow();
      } else {
        $table.remove([row]);
      }
      paginationData.total = paginationData.total - arr.length;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // #endregion 删除

  // 清空
  const handleClear = () => {
    formRef.value.resetFields();
  };

  // 查看日志
  const showLogId = ref(null);
  const isShowLog = ref(false);
  const handleShowLog = (row) => {
    showLogId.value = row.id;
    isShowLog.value = true;
  };
</script>

<style lang="scss" scoped>
  .page_header {
    position: absolute;
    z-index: 9;
    width: calc(100% - 70px);
    display: flex;
    top: 19px;
    justify-content: end;
  }
  .ml10 {
    margin-left: 10px;
  }
  .disflex {
    display: flex;
  }
  :deep(.vxe-header--column.col--ellipsis > .vxe-cell .vxe-cell--title) {
    white-space: normal;
  }
  :deep(
      .vxe-table--render-default.size--mini
        .vxe-header--column.col--ellipsis
        > .vxe-cell
    ) {
    max-height: 48px;
  }
</style>
<style lang="scss">
  #samll_width {
    color: red;
    .el-form-item__label {
      width: 80px !important;
    }
  }
  .show_two_line {
    cursor: pointer;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tooltips_content {
    width: 200px;
    max-height: 300px;
    overflow-y: auto;
  }
</style>
