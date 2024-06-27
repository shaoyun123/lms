<template>
  <div class="app-container">
    <el-card ref="searchCardRef" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item
          label="OA新类目"
          prop="cateOaIdList"
          class="search_item_cascader"
        >
          <z-cascader
            v-model="formData.cateOaIdList"
            :data="initData.oaList"
            :props="{
              label: 'title',
              children: 'data',
              value: 'value'
            }"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.cateOaIdList"
            :options="initData.oaList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'title',
              children: 'data'
            }"
          ></el-cascader> -->
        </el-form-item>
        <el-form-item
          label="TikTok类目"
          prop="tiktokCateIdList"
          class="search_item_cascader"
        >
          <z-cascader
            v-model="formData.tiktokCateIdList"
            :data="initData.tiktokList"
            :props="{
              label: 'cnName',
              children: 'children',
              value: 'categoryId'
            }"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.tiktokCateIdList"
            :options="initData.tiktokList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'cnName',
              value: 'categoryId'
            }"
          ></el-cascader> -->
        </el-form-item>
        <el-form-item label="补充信息维护" prop="assiDataTiktokEnumList">
          <MultiSelect
            v-model="formData.assiDataTiktokEnumList"
            :option-obj="{
              optionList: initData.assiDataTiktokList
            }"
        /></el-form-item>
        <el-form-item prop="searchList">
          <el-select v-model="formData.searchType" class="form_left" filterable>
            <el-option value="pSkuList" label="商品父SKU" />
            <el-option value="sSkuList" label="商品子SKU" />
            <el-option value="cnTitle" label="商品中文" />
            <el-option value="enTitle" label="商品英文" />
          </el-select>
          <el-input
            v-model="formData.searchList"
            clearable
            class="form_right"
            :placeholder="
              formData.searchType.includes('List') ? '多个逗号隔开' : '标题'
            "
            @blur="commonDivideComma"
          />
        </el-form-item>
        <el-form-item label="在售状态" prop="isSale">
          <el-select v-model="formData.isSale" clearable filterable>
            <el-option :value="0" label="停售" />
            <el-option :value="1" label="部分在售" />
            <el-option :value="2" label="在售" />
          </el-select>
        </el-form-item>
        <el-form-item prop="time">
          <el-select
            v-model="formData.timeTypeEnum"
            class="form_left"
            filterable
          >
            <el-option
              v-for="item in initData.timeTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-date-picker
            v-model="formData.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 200px"
            class="form_right"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item prop="tortTypeEnum" label="侵权状态"
          ><el-select
            v-model="formData.tortTypeEnum"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in initData.tortTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="禁售状态" prop="isForBid">
          <el-select v-model="formData.isForBid" clearable filterable>
            <el-option :value="true" label="禁售" />
            <el-option :value="false" label="非禁售" />
          </el-select>
        </el-form-item>
        <el-form-item prop="operatorList">
          <el-select
            v-model="formData.operatorType"
            class="form_left"
            filterable
            @change="handleChangeOperatorType"
          >
            <el-option value="creatorList" label="创建人" />
            <el-option value="modifierList" label="修改人" />
          </el-select>
          <MultiSelect
            v-model="formData.operatorList"
            class="form_right"
            :option-obj="{
              optionList: initData.operatorList
            }"
          />
        </el-form-item>
        <el-form-item prop="assiDataTime">
          <el-select
            v-model="formData.assiDataTimeTypeEnum"
            class="form_left"
            filterable
          >
            <el-option
              v-for="item in initData.assiDataTimeTypeEnumList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-date-picker
            v-model="formData.assiDataTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 200px"
            class="form_right"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item label="尺寸图" prop="sizeImgEnum">
          <el-select v-model="formData.sizeImgEnum" filterable clearable>
            <el-option
              v-for="item in initData.sizeImgEnumList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开发专员" prop="bizzOwnerIds">
          <MultiSelect
            v-model="formData.bizzOwnerIds"
            :option-obj="{
              optionList: initData.bizzOwners,
              value: 'id',
              label: 'userName'
            }"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(true)">查询</el-button>
          <el-button @click="handleResetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <div class="page_header">
        <el-tabs
          v-model="activeName"
          type="card"
          class="demo-tabs"
          @tab-click="handleSearch(true)"
        >
          <el-tab-pane
            :label="'数量(' + paginationData.total + ')'"
            name="first"
          >
          </el-tab-pane>
        </el-tabs>
        <div class="common_batch_btns disflex">
          <el-button type="primary" @click="handleCateRequired()"
            >商品类目必填项</el-button
          >
          <el-button type="primary" @click="handleUpdateListing"
            >修改在线listing</el-button
          >
          <el-button type="primary" @click="handleBatchEdit()"
            >批量修改</el-button
          >
          <el-popover
            content="删除后该模板将恢复为映射逻辑"
            effect="dark"
            placement="top-end"
          >
            <template #reference>
              <el-button type="danger" @click="handleBatchDel">删除</el-button>
            </template>
          </el-popover>
        </div>
      </div>
      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <template #default_mainImgUri="{ row }">
          <ImagePop :src="row.mainImgUri" />
        </template>
        <template #default_enTitle="{ row }">
          <div>{{ row.enTitle }}</div>
          <div v-if="row.cateCnName">分类：{{ row.cateCnName }}</div>
        </template>
        <template #default_bizzOwner="{ row }">
          <div>开发：{{ row.bizzOwner }}</div>
          <div>责任：{{ row.responsor }}</div>
        </template>
        <template #default_psku="{ row }">
          <el-link type="primary" underline @click="handleViewPsku(row)">{{
            row.psku
          }}</el-link>
        </template>
        <template #default_tort="{ row }">
          <div class="table_tort_cell">
            <template
              v-if="
                row.isWishTort ||
                row.isJoomTort ||
                row.isEbayTort ||
                row.isAmazonTort ||
                row.isSmtTort ||
                row.isShopeeTort ||
                row.isTophatterTort
              "
            >
              <div v-for="item in tortList" :key="item.value">
                <el-checkbox
                  v-if="row[item.value]"
                  v-model="row[item.value]"
                  :label="item.label"
                  size="large"
                  disabled
                ></el-checkbox>
              </div>
            </template>
            <template v-else>
              <div>_</div>
            </template>
          </div>
        </template>
        <template #default_prodProhibitMappings="{ row }">
          <span
            v-for="item in row.prodProhibitMappings"
            :key="item.id"
            class="mr15"
            >{{ item.platCode }}:{{ item.salesSite }}</span
          >
        </template>
        <template #default_sizeChartImgUrl="{ row }">
          <div
            :class="
              !row.sizeChartImgUrl && row.isSizeChartMandatory
                ? 'danger_color'
                : ''
            "
          >
            {{
              row.isSizeChartMandatory
                ? row.sizeChartImgUrl
                  ? '已添加'
                  : '未添加'
                : '_'
            }}
          </div>
        </template>
        <template #default_operator="{ row }">
          <div>创建：{{ row.creator }}</div>
          <div>修改：{{ row.modifier }}</div>
        </template>
        <template #default_operateTime="{ row }">
          <div>创建：{{ transferDate(row.createTime) }}</div>
          <div>修改：{{ transferDate(row.modifyTime) }}</div>
        </template>
        <template #default_operate="{ row }">
          <el-button type="primary" @click="handleChange(row)"> 修改</el-button>
        </template>
      </vxe-grid>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[50, 100, 300, 1000]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 商品必填项 -->
    <CateRequired
      v-if="showCateRequired"
      v-model="showCateRequired"
      :attributeNames="attributeNames"
      @handle-search="handleSearch"
    />
    <!-- 父sku信息 -->
    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />
    <DetailDialog
      v-if="showEditDialog"
      v-model="showEditDialog"
      :is-batch="isBatch"
      :checked-list="checkedList"
      :tiktok-cate-list="initData.tiktokList"
      @handle-search="handleSearch"
      @fresh="freshInit"
    />
    <UpdateListing
      v-if="updateListingVisible"
      v-model="updateListingVisible"
      :checked-list="checkedList"
      @open-junp-page="openJunpPage"
    />
    <JumpPage
      v-if="showJumpPage"
      v-model="showJumpPage"
      title="操作结果"
      content="操作成功！请到任务中心查看导入结果"
    />
  </div>
</template>
<script setup name="publishstiktokextrainfo">
  // http://yapi.epean.cn/project/54/interface/api/2702 商品类目必填项 接口地址文档
  import { onMounted, ref, reactive, computed, onActivated } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { initApi, queryApi, deleteApi } from '@/api/publishs/tiktokextrainfo';
  import {
    queryOaNewCategory,
    getPlatCategoryTreeApi,
    shortcuts
  } from '@/api/common';
  import { cloneDeep, isEmpty } from 'lodash-es';
  import { commonDivideComma } from '@/utils/divide';
  import { transferDate } from '@/utils/common';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import CateRequired from './components/CateRequired.vue';
  import DetailDialog from './components/DetailDialog.vue';
  import UpdateListing from './components/UpdateListing.vue';
  import JumpPage from '@/components/JumpPage/index.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getItem, removeItem } from '@/utils/storage';

  // #region 查询区域
  const formData = ref({
    searchType: 'pSkuList',
    searchList: '',
    operatorType: 'creatorList',
    tortTypeEnum: 'TikTok不侵权',
    assiDataTime: [],
    time: []
  });
  const searchCardRef = ref();
  const formRef = ref();
  const initData = ref({});

  const tortList = [
    { label: 'wish', value: 'isWishTort' },
    { label: 'joom', value: 'isJoomTort' },
    { label: 'ebay', value: 'isEbayTort' },
    { label: 'amazon', value: 'isAmazonTort' },
    { label: 'smt', value: 'isSmtTort' },
    { label: 'shopee', value: 'isShopeeTort' },
    { label: 'tophatter', value: 'isTophatterTort' }
  ];
  onMounted(async () => {
    Promise.all([
      initApi(),
      queryOaNewCategory(),
      getPlatCategoryTreeApi('tiktok')
    ]).then((res) => {
      initData.value = res[0].data;
      initData.value.oaList = JSON.parse(res[1].data);
      initData.value.tiktokList = res[2].data;
      initData.value.operatorList = res[0].data.creatorList;
      // 赋初始值
      formData.value.assiDataTimeTypeEnum =
        initData.value.assiDataTimeTypeEnumList[0];
      formData.value.timeTypeEnum = initData.value.timeTypeList[0];
    });
  });
  // 更新
  const freshInit = async () => {
    const { data } = await initApi();
    initData.value.creatorList = data.creatorList;
    initData.value.modifierList = data.modifierList;
    if (formData.value.operatorType === 'creatorList') {
      initData.value.operatorList = data.creatorList;
    } else {
      initData.value.operatorList = data.modifierList;
    }
  };
  // 级联多选
  // const filterCascader = (node, keyword) => {
  //   if (
  //     node?.label?.trim().includes(keyword.trim()) ||
  //     node?.text?.trim().includes(keyword.trim())
  //   ) {
  //     return node;
  //   }
  // };
  // 选择操作人类型
  const handleChangeOperatorType = () => {
    if (formData.value.operatorType === 'creatorList') {
      initData.value.operatorList = initData.value.creatorList;
    } else {
      initData.value.operatorList = initData.value.modifierList;
    }
    formData.value.operatorList = [];
  };
  const activeName = ref('first');
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });
  // #endregion 查询区域
  // #region 查询操作
  const handleResetForm = () => {
    formRef.value.resetFields();
    // 赋初始值
    formData.value.assiDataTimeTypeEnum =
      initData.value.assiDataTimeTypeEnumList[0];
    formData.value.timeTypeEnum = initData.value.timeTypeList[0];
    formData.value.searchType = 'pSkuList';
    formData.value.operatorType = 'creatorList';
  };
  const getParams = () => {
    const obj = cloneDeep(formData.value);
    // OA新类目
    obj.cateOaIdList = obj.cateOaIdList || [];
    // Tiktok新类目
    obj.tiktokCateIdList = obj.tiktokCateIdList || [];

    // 模版父sku/模板子sku/中文标题/英文标题
    if (obj.searchType.includes('List')) {
      obj[obj.searchType] = obj.searchList ? obj.searchList.split(',') : [];
    } else {
      obj[obj.searchType] = obj.searchList;
    }
    // 创建人，修改人
    obj[obj.operatorType] = obj.operatorList;
    // 模板创建审核时间
    obj.startTime = obj.time?.length ? obj.time[0] + ' 00:00:00' : '';
    obj.endTime = obj.time?.length ? obj.time[1] + ' 23:59:59' : '';
    // 补充信息创建，修改时间
    obj.assiDataStartTime = obj.assiDataTime?.length
      ? obj.assiDataTime[0] + ' 00:00:00'
      : '';
    obj.assiDataEndTime = obj.assiDataTime?.length
      ? obj.assiDataTime[1] + ' 23:59:59'
      : '';
    Object.keys(obj).forEach((item) => {
      if (obj[item] === '') {
        obj[item] = null;
      }
    });
    return obj;
  };
  const handleSearch = async (isInit) => {
    if (isInit) {
      paginationData.page = 1;
    }
    try {
      const params = getParams();
      const { data, count } = await queryApi({
        ...params,
        page: paginationData.page,
        limit: paginationData.limit
      });
      gridOptions.data = data;
      paginationData.total = count;
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
    }
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
  // #endregion 查询操作
  // #region 表格
  const tableRef = ref();
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCardRef.value?.$el?.clientHeight;
    return clientHeight - 118 - searchCardHeight;
  });
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height,
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'prodPId',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    scrollY: { enabled: false },
    columns: [
      {
        type: 'checkbox',
        width: 60
      },
      {
        title: '缩略图',
        field: 'mainImgUri',
        width: 90,
        slots: { default: 'default_mainImgUri' }
      },
      {
        title: '标题',
        field: 'enTitle',
        slots: { default: 'default_enTitle' }
      },
      {
        title: '归属人',
        field: 'bizzOwner',
        width: 120,
        slots: { default: 'default_bizzOwner' }
      },
      {
        title: '父sku',
        field: 'psku',
        width: 110,
        slots: { default: 'default_psku' }
      },
      {
        title: '侵权状态',
        field: 'tort',
        slots: { default: 'default_tort' },
        width: 120
      },
      {
        title: '禁售',
        field: 'prodProhibitMappings',
        slots: { default: 'default_prodProhibitMappings' }
      },
      { title: '开发备注', field: 'devNote', width: 100 },
      { title: '销售备注', field: 'ebaySaleRemark', width: 100 },
      { title: 'TikTok类目', field: 'fullCateName', width: 150 },
      {
        title: '尺寸图',
        field: 'sizeChartImgUrl',
        width: 90,
        slots: { default: 'default_sizeChartImgUrl' }
      },
      {
        title: '操作人',
        field: 'operator',
        width: 120,
        slots: { default: 'default_operator' }
      },
      {
        title: '时间',
        field: 'operateTime',
        slots: { default: 'default_operateTime' }
      },
      { title: '操作', width: 90, slots: { default: 'default_operate' } }
    ],
    data: [],
    toolbarConfig: {
      custom: true
    }
  });
  // #endregion 表格

  // #region 操作
  // 选中数据
  // #region 操作-修改
  const checkedList = ref([]);
  const isBatch = ref(false);
  const showEditDialog = ref(false);
  const handleChange = (row) => {
    showEditDialog.value = true;
    isBatch.value = false;
    checkedList.value = [{ ...row }];
  };
  const handleBatchEdit = () => {
    const $table = tableRef.value;
    if ($table) {
      const selectedRecoeds = $table.getCheckboxRecords();
      if (!selectedRecoeds.length) {
        return ElMessage.warning('请选择数据');
      }
      showEditDialog.value = true;
      isBatch.value = true;
      checkedList.value = cloneDeep(selectedRecoeds);
    }
  };
  // #endregion 操作-修改
  // #region 修改在线listing
  const showJumpPage = ref(false);
  const openJunpPage = () => {
    showJumpPage.value = true;
  };
  const updateListingVisible = ref(false);
  const handleUpdateListing = () => {
    const $table = tableRef.value;
    if ($table) {
      const selectedRecoeds = $table.getCheckboxRecords();
      if (!selectedRecoeds.length) {
        return ElMessage.warning('请选择数据');
      }
      checkedList.value = cloneDeep(selectedRecoeds);
      updateListingVisible.value = true;
    }
  };
  // #endregion 修改在线listing
  //  #region 操作-商品详情
  const showPskuDetailDialog = ref(false);
  let prodPId = ref();
  const handleViewPsku = (row) => {
    showPskuDetailDialog.value = true;
    prodPId.value = row.prodPId;
  };
  const handelPskuDialogClose = (e) => {
    prodPId.value = '';
    showPskuDetailDialog.value = e.isShow;
  };
  //  #endregion 操作-商品详情
  // #region 操作-删除
  const handleBatchDel = async () => {
    const $table = tableRef.value;
    if ($table) {
      const selectedRecoeds = $table.getCheckboxRecords();
      if (!selectedRecoeds.length) {
        return ElMessage.warning('请选择数据');
      }
      const idList = selectedRecoeds
        .filter((item) => item.id)
        .map((item) => item.id);
      if (idList.length) {
        ElMessageBox.confirm(
          '删除选中的' + idList.length + '个商品补充信息',
          '删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(async () => {
          const ids = idList.join();
          const { msg } = await deleteApi(ids);
          ElMessage.success(msg);
          // handleSearch();
        });
      } else {
        ElMessage.warning('请选择有补充信息的数据');
      }
    }
  };
  // #endregion 操作-删除
  // #region 操作-商品类目必填项
  const showCateRequired = ref(false);
  const attributeNames = ref();
  const handleCateRequired = () => {
    showCateRequired.value = true;
    attributeNames.value = null;
  };
  // 在线商品跳转商品类目必填项
  onActivated(() => {
    let detail = getItem('publishstiktokonlineupdatecate');
    if (!isEmpty(detail)) {
      attributeNames.value = detail; // 获取的fba选中的值
      showCateRequired.value = true;
      removeItem('publishstiktokonlineupdatecate');
    }
  });
  // #endregion 操作-商品类目必填项
  // #endregion 操作
</script>
<style scoped lang="scss">
  .danger_color {
    color: var(--danger-color);
  }
  .ml10 {
    margin-left: 10px;
  }
  .mr15 {
    margin-right: 15px;
  }
  .page_header {
    position: absolute;
    z-index: 9;
    width: calc(100% - 30px);
  }
  .common_batch_btns {
    right: 30px !important;
    top: 2px !important;
  }
  :deep(.vxe-toolbar) {
    padding: 0 0 0.6em 0;
  }
  .table_tort_cell {
    :deep(.el-checkbox.el-checkbox--large) {
      height: 30px;
    }
  }
</style>
