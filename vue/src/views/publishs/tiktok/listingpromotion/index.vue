<template>
  <!-- tiktok 促销 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item
          label="店铺"
          prop="storeAcctIdList"
          class="search_item_cascader cascader_width"
        >
          <z-cascader
            v-model="formData.storeAcctIdList"
            :data="enumList.storeList"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.storeAcctIdList"
            :options="enumList.storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true }"
          ></el-cascader> -->
          <el-button
            :loading="syncStoreLoading"
            type="primary"
            @click="handleStoreSync"
            >同步</el-button
          >
        </el-form-item>
        <el-form-item label="站点" prop="siteIdList">
          <MultiSelect
            v-model="formData.siteIdList"
            :option-obj="{
              optionList: enumList.siteList,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="营销工具" prop="promotionTypeEnum">
          <el-select v-model="formData.promotionTypeEnum" clearable filterable>
            <el-option
              v-for="(key, label) in enumList.promotionTypeEnum"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="promotionName">
          <el-input
            v-model="formData.promotionName"
            clearable
            placeholder="模糊搜索"
          />
        </el-form-item>
        <el-form-item label="活动ID" prop="promotionIdList">
          <el-input
            v-model="formData.promotionIdList"
            clearable
            placeholder="支持多个精确查询"
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <el-form-item label="活动类型" prop="autoRenew">
          <el-select v-model="formData.autoRenew" clearable filterable>
            <el-option :value="true" label="连续活动" />
            <el-option :value="false" label="单次活动" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orderBy">
          <el-select v-model="formData.orderBy" clearable filterable>
            <el-option
              v-for="(val, key) in enumList.orderByList"
              :key="key"
              :label="key"
              :value="val"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="daterange"
            unlink-panels
            range-separator="-"
            value-format="YYYY-MM-DD"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="daterange"
            unlink-panels
            range-separator="-"
            value-format="YYYY-MM-DD"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
            class="form_right"
          />
        </el-form-item>
        <el-form-item prop="operator">
          <el-select v-model="operatorType" class="form_left">
            <el-option value="creatorList" label="创建人" />
            <el-option value="modifierList" label="修改人" />
          </el-select>
          <MultiSelect
            v-model="formData.operator"
            class="form_right"
            :option-obj="{
              optionList: enumList[operatorType],
              label: 'label',
              value: 'value'
            }"
          />
        </el-form-item>
        <el-form-item label-width="80" prop="promotionTime">
          <el-select v-model="timeType" class="form_left">
            <el-option value="promotionCreate" label="创建时间" />
            <el-option value="promotionModify" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="formData.promotionTime"
            class="form_right"
            type="daterange"
            unlink-panels
            range-separator="-"
            value-format="YYYY-MM-DD"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(ruleFormRef)"
            >查询</el-button
          ><el-button @click="handleResetForm(ruleFormRef)"
            >重置</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card class="common_split_bottom list_card">
      <el-tabs
        v-model="promotionStatus"
        v-loading="configOptions.tableLoading"
        type="card"
        @tab-click="handleTab"
      >
        <el-tab-pane
          v-for="item in enumList.promotionStatusList"
          :key="item.label"
          :name="item.value"
          :label="item.label + '(' + item.count + ')'"
        >
          <vxe-grid ref="tableDataRef" v-bind="gridOptions">
            <template #autoRenew_default="{ row }">
              <vxe-switch
                v-model="row.autoRenew"
                :disabled="Number(promotionStatus) === 3"
                open-label="连续"
                :open-value="true"
                close-label="单次"
                :close-value="false"
                :loading="row.autoRenewLoading"
                @click="handleAutoRenew(row)"
              ></vxe-switch>
            </template>
            <template #promotion_time_default="{ row }">
              <div>{{ transferDate(row.startTime) }}</div>
              <div>{{ transferDate(row.endTime) }}</div>
            </template>
            <template #operatorcol_default="{ row }">
              <div>创建:{{ row.creator }}</div>
              <div>修改:{{ row.modifier }}</div>
            </template>
            <template #timecol_default="{ row }">
              <div>创建:{{ transferDate(row.promotionCreateTime) }}</div>
              <div>修改:{{ transferDate(row.promotionUpdateTime) }}</div>
            </template>
            <template #toolbar_default="{ row }">
              <el-button
                v-if="row.promotionType == 2"
                type="primary"
                @click="handleEdit(row)"
                >{{
                  Number(promotionStatus) === 3 ? '查看' : '修改'
                }}</el-button
              >
              <el-button
                v-if="['1', '2'].includes(promotionStatus)"
                :loading="row.syncPromotionLoading"
                type="success"
                @click="handlePromotionSync(row)"
                >同步</el-button
              >
              <el-button
                v-if="['1', '2'].includes(promotionStatus)"
                :loading="row.stopLoading"
                type="danger"
                @click="handleStop(row)"
                >终止</el-button
              >
            </template>
          </vxe-grid>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="paginationData.page"
              v-model:page-size="paginationData.limit"
              :page-sizes="[50, 100, 300]"
              :small="true"
              layout="total, sizes, prev, pager, next"
              :total="paginationData.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 批量操作 -->
      <div class="common_batch_btns">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button
          v-if="promotionStatus != '3'"
          :loading="batchSyncPromotionLoading"
          type="success"
          @click="handleBatchPromotionSync"
          >批量同步</el-button
        >
        <el-button
          v-if="promotionStatus != '3'"
          :loading="batchStopLoading"
          type="danger"
          @click="handleBatchStop"
          >批量终止</el-button
        >
      </div>
    </el-card>
    <PromotionDialog
      v-model="dialogVisible"
      :selected-row="selectedRow"
      :store-list="enumList.storeList"
      @handle-search="handleSearch"
      @update-operator="updateOperator"
    />
  </div>
</template>

<script setup name="publishstiktoklistingpromotion">
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { transferDate } from '@/utils/common';
  import { getStoreList, shortcuts, getSiteListApi } from '@/api/common';
  import {
    initEnumApi,
    queryListApi,
    syncStoreApi,
    syncPromotionApi,
    stopPromotionApi,
    saveOrUpdateApi
  } from '@/api/publishs/tiktoklistingpromotion';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { commonDivideCommaNum } from '@/utils/divide';
  import PromotionDialog from './components/PromotionDialog.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  // 枚举
  const enumList = reactive({
    promotionStatusList: [
      { value: '1', label: '未开始', count: 0 },
      { value: '2', label: '进行中', count: 0 },
      { value: '3', label: '已结束', count: 0 }
    ],
    reverseStatusList: []
  });
  const searchCardRef = ref(null);
  const formData = reactive({ promotionTypeEnum: 'DIRECT_DISCOUNT' });
  const operatorType = ref('creatorList');
  const timeType = ref('promotionCreate');
  const ruleFormRef = ref();
  const promotionStatus = ref('1');
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });
  const configOptions = reactive({
    tableLoading: false
  });
  const selectedRow = ref({});
  const gridOptions = reactive({
    border: true,
    showFooter: true,
    height: 200,
    columnConfig: {
      resizable: true
    },
    showOverflow: true,
    scrollY: { gt: 15 },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    data: [],
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'promotionTypeStr', title: '营销工具' },
      { field: 'promotionId', title: '活动ID' },
      { field: 'promotionName', title: '活动名称' },
      { field: 'storeAcct', title: '店铺', width: 120 },
      { field: 'salesperson', title: '销售员', width: 120 },
      {
        field: 'autoRenew',
        title: '活动类型',
        width: 120,
        slots: { default: 'autoRenew_default' }
      },
      {
        field: 'promotionTime',
        title: '活动时间',
        slots: { default: 'promotion_time_default' }
      },
      { field: 'listingNum', title: 'listing数量', width: 100 },
      {
        field: 'operatorCol',
        title: '操作人',
        slots: { default: 'operatorcol_default' }
      },
      {
        field: 'timeCol',
        title: '操作时间',
        slots: { default: 'timecol_default' }
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
  const tableDataRef = ref();

  onMounted(() => {
    // 获取table高度
    initData();
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCardRef?.value?.$el?.clientHeight;
    gridOptions.height = clientHeight - 166 - searchCardHeight;
  });

  // 获取枚举值，将默认值选中
  const initData = () => {
    configOptions.tableLoading = true;
    Promise.all([
      getStoreList('tiktok'),
      initEnumApi(),
      getSiteListApi('tiktok')
    ])
      .then((res) => {
        enumList.storeList = res[0].data?.children;
        enumList.orderByList = res[1].data.orderBy;
        enumList.creatorList = res[1].data.creators.map((item) => ({
          label: item,
          value: item
        }));
        enumList.modifierList = res[1].data.modifiers.map((item) => ({
          label: item,
          value: item
        }));
        enumList.promotionTypeEnum = res[1].data.promotionTypeEnum;
        enumList.siteList = res[2].data;
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        configOptions.tableLoading = false;
      });
  };

  watch(
    () => operatorType.value,
    () => {
      if (
        formData.operator &&
        !enumList[operatorType.value].includes(formData.operator)
      ) {
        formData.operator = null;
      }
    }
  );

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    operatorType.value = 'creatorList';
    timeType.value = 'promotionCreate';
  };

  const handleSearch = async () => {
    configOptions.tableLoading = true;
    try {
      const params = getParamsData();
      const { data, count } = await queryListApi(params);
      gridOptions.data = (data || []).map((item) => ({
        ...item,
        syncPromotionLoading: false,
        stopLoading: false,
        autoRenewLoading: false
      }));
      paginationData.total = count;
      getTabCount(count);
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
    } finally {
      configOptions.tableLoading = false;
    }
  };
  const getParamsData = () => {
    const { limit, page } = paginationData;
    const time = {
      startMinTime: formData.startTime?.length
        ? new Date(formData.startTime[0] + ' 00:00:00').getTime()
        : null,
      startMaxTime: formData.startTime?.length
        ? new Date(formData.startTime[1] + ' 23:59:59').getTime()
        : null,
      endMinTime: formData.endTime?.length
        ? new Date(formData.endTime[0] + ' 00:00:00').getTime()
        : null,
      endMaxTime: formData.endTime?.length
        ? new Date(formData.endTime[1] + ' 23:59:59').getTime()
        : null
    };
    // 修改时间
    const updateTime = {
      [timeType.value + 'MinTime']: formData.promotionTime?.length
        ? new Date(formData.promotionTime[0] + ' 00:00:00').getTime()
        : null,
      [timeType.value + 'MaxTime']: formData.promotionTime?.length
        ? new Date(formData.promotionTime[1] + ' 23:59:59').getTime()
        : null
    };
    return {
      ...formData,
      storeAcctIdList: storeAcctIdList.value,
      [operatorType.value]: formData.operator,
      promotionTypeEnum: formData.promotionTypeEnum || null,
      promotionIdList: formData.promotionIdList
        ? formData.promotionIdList.split(',')
        : [],
      ...time,
      ...updateTime,
      limit,
      page,
      promotionStatus: promotionStatus.value
    };
  };
  const storeAcctIdList = computed(() => {
    let _storeAcctIdList = [];
    if (formData.storeAcctIdList?.length) {
      _storeAcctIdList = formData.storeAcctIdList;
    } else {
      // 没选店铺，传全部
      _storeAcctIdList = findAllStore(enumList.storeList);
    }
    return _storeAcctIdList;
  });
  const findAllStore = (storeList) => {
    let arr = [];
    storeList.forEach((item) => {
      if (item.tag === 'shop') {
        arr.push(item.value);
      } else if (item.tag !== 'shop' && item.children.length > 0) {
        arr = arr.concat(findAllStore(item.children));
      }
    });
    return arr;
  };
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

  const findTable = () => {
    const $table = tableDataRef.value;
    const tableIndex = enumList.promotionStatusList.findIndex(
      (item) => promotionStatus.value === item.value
    );
    return $table[tableIndex];
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    enumList.promotionStatusList.forEach((item) => {
      if (promotionStatus.value === item.value) {
        item.count = totalCount;
      }
    });
  };
  const handleTab = ({ paneName }) => {
    promotionStatus.value = paneName;
    handleSearch();
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

  // 批量同步活动
  const batchSyncPromotionLoading = ref(false);
  const handleBatchPromotionSync = async () => {
    const curTableData = findTable().getCheckboxRecords();
    if (!curTableData.length) return ElMessage.warning('请选择数据');
    const params = curTableData.map((item) => ({
      storeAcctId: item.storeAcctId,
      promotionId: item.promotionId
    }));
    try {
      batchSyncPromotionLoading.value = true;
      const { msg } = await syncPromotionApi(params);
      ElMessage.success(msg || '同步成功');
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchSyncPromotionLoading.value = false;
    }
  };

  // 同步店铺
  const syncStoreLoading = ref(false);
  const handleStoreSync = async () => {
    syncStoreLoading.value = true;
    try {
      const params = storeAcctIdList.value;
      const { data, msg } = await syncStoreApi(params);
      syncStoreLoading.value = false;
      let failList = data.filter((item) => !item.success);
      if (failList.length) {
        let str = data
          .map(
            (item) =>
              `<div style="color:${item.success ? '#67c23a' : '#f56c6c'}">${
                item.storeAcct
              }: ${item.msg}</div>`
          )
          .join('');
        ElMessageBox.confirm(`<div>${str}</div>`, '操作结果', {
          confirmButtonText: '确认',
          showCancelButton: false,
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).finally(() => {
          failList.length !== data.length && handleSearch();
        });
      } else {
        ElMessage.success(msg || '同步成功');
        handleSearch();
      }
    } catch (err) {
      syncStoreLoading.value = false;
      console.log('err :>> ', err);
    }
  };

  // 同步活动
  const handlePromotionSync = async (row) => {
    const params = [
      {
        storeAcctId: row.storeAcctId,
        promotionId: row.promotionId
      }
    ];
    try {
      row.syncPromotionLoading = true;
      const { msg } = await syncPromotionApi(params);
      ElMessage.success(msg || '同步成功');
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      row.syncPromotionLoading = false;
    }
  };

  // 批量终止
  const batchStopLoading = ref(false);
  const handleBatchStop = async () => {
    const curTableData = findTable().getCheckboxRecords();
    if (!curTableData.length) return ElMessage.warning('请选择数据');
    const promotionIds = curTableData.map((item) => item.promotionId).join();
    try {
      batchStopLoading.value = true;
      const { msg } = await stopPromotionApi({ promotionIds });
      ElMessage.success(msg || '同步成功');
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchStopLoading.value = false;
    }
  };

  const handleStop = async (row) => {
    try {
      row.stopLoading = true;
      const { msg } = await stopPromotionApi({ promotionIds: row.promotionId });
      ElMessage.success(msg || '同步成功');
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      row.stopLoading = false;
    }
  };

  // 改变活动类型
  const handleAutoRenew = async (row) => {
    let disableTag = [3, 4].includes(Number(row.promotionStatus));
    if (disableTag) return;
    row.autoRenewLoading = true;
    const autoRenew = row.autoRenew;
    try {
      const { msg } = await saveOrUpdateApi(row);
      handleSearch();
      updateOperator();
      ElMessage.success(msg);
    } catch (err) {
      row.autoRenew = autoRenew ? 0 : 1;
      ElMessage.error('设置失败');
      console.log('err :>> ', err);
    } finally {
      row.autoRenewLoading = false;
    }
  };

  // 活动详情
  const dialogVisible = ref(false);
  // 新增
  const handleAdd = () => {
    dialogVisible.value = true;
    selectedRow.value = {};
  };
  // 修改
  const handleEdit = (row) => {
    dialogVisible.value = true;
    selectedRow.value = { ...row, promotionStatus: promotionStatus.value };
  };
  // 更新创建人和修改人
  const updateOperator = async () => {
    try {
      const { data } = await initEnumApi();
      enumList.creatorList = data.creators.map((item) => ({
        label: item,
        value: item
      }));
      enumList.modifierList = data.modifiers.map((item) => ({
        label: item,
        value: item
      }));
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
</script>

<style lang="scss" scoped>
  // .cascader_width {
  //   width: 450px !important;
  //   :deep(.el-input) {
  //     width: 260px;
  //   }
  // }
  .search_form {
    .el-form-item:nth-child(2) {
      :deep(.el-form-item__label) {
        width: 50px !important;
      }
    }
  }
</style>
