<template>
  <!-- 自动标签配置 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item label="规则状态" prop="status">
          <el-select
            v-model="formData.status"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线listing标签" prop="listingTagIdList">
          <ZSelect
            v-model="formData.listingTagIdList"
            placeholder="请选择"
            :num="0"
            :items="initList.tagList"
          />
        </el-form-item>
        <el-form-item label="配置对象" prop="processingType">
          <el-select
            v-model="formData.processingType"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="product" :value="0"></el-option>
            <el-option label="product&variation" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签操作" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="添加标签" :value="0"></el-option>
            <el-option label="移除标签" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否过滤无SKU" prop="isFilterNoSku">
          <el-select
            v-model="formData.isFilterNoSku"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="common_split_bottom card_position list_card">
      <el-tabs v-model="activeKey" type="card" @tab-click="handleSearch">
        <el-tab-pane :label="`数量(${total})`" name="curTab"> </el-tab-pane
      ></el-tabs>
      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <template #status_default="{ row }">
          <span :style="{ color: row.status ? successColor : dangerColor }">{{
            row.status ? '启用' : '禁用'
          }}</span>
        </template>
        <template #listingTagId_default="{ row }">
          <div>{{ renderListingTag(row.listingTagId) }}</div>
        </template>
        <template #processingType_default="{ row }">
          <div>{{ renderProcessingType(row.processingType) }}</div>
        </template>
        <template #type_default="{ row }">
          <div>{{ renderType(row.type) }}</div>
        </template>
        <template #listingTagCondition_default="{ row }">
          <div>{{ renderTagConditionDesc(row) }}</div>
        </template>
        <template #isFilterNoSku_default="{ row }">
          <div v-if="row.isFilterNoSku !== undefined">
            {{ row.isFilterNoSku ? '是' : '否' }}
          </div>
        </template>
        <template #shopCount_default="{ row }">
          <el-text type="primary" @click="handleShopCount(row)">{{
            row.shopCount
          }}</el-text>
        </template>
        <template #operator_default="{ row }">
          <div>创建：{{ row.creator }}</div>
          <div v-if="row.modifier">修改：{{ row.modifier }}</div>
        </template>
        <template #optime_default="{ row }">
          <div>创建：{{ transferDate(row.createTime) }}</div>
          <template v-if="row.modifyTime">
            <div>修改：{{ transferDate(row.modifyTime) }}</div>
          </template>
        </template>
        <template #toolbar_default="{ row }">
          <el-button type="primary" @click="handeEdit(row)">修改</el-button>
          <el-button type="danger" @click="handeDel(row)">删除</el-button>
        </template>
      </vxe-grid>
      <div class="common_batch_btns">
        <el-button type="primary" @click="handleDealListing"
          >处理在线listing</el-button
        >
        <el-select
          v-model="batchType"
          placeholder="批量操作"
          filterable
          clearable
          class="ml12"
          style="width: 150px"
        >
          <el-option
            v-for="item in batchTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @click="handleBatch(item)"
          />
        </el-select>

        <el-button type="primary" class="ml12" @click="handleAdd"
          >新增配置</el-button
        >
      </div>
    </el-card>
  </div>
  <DetailDialog
    v-if="showDetail"
    v-model="showDetail"
    :checked-row="checkedRow"
    :type="editType"
    :init-list="initList"
    @handle-search="handleSearch"
  />
  <!-- 跳转页面 -->
  <JumpPage
    v-if="showPage"
    v-model="showPage"
    title="操作结果"
    content="操作成功！请到任务中心查看导入结果"
  />
  <MatchStore
    v-if="showStore"
    v-model="showStore"
    :detail-data="checkedRow"
    @fresh-list="handleSearch"
  />
</template>

<script setup name="shopeeoperateautosetlistingtag">
  import { onMounted, ref, reactive } from 'vue';
  import { transferDate, comGetTableHeight } from '@/utils/common';
  import { Column } from './config';
  import { successColor, dangerColor } from '@/styles/vars.module.scss';
  import {
    queryPageApi,
    getShopeeListingTagApi,
    getConfigEnumsApi,
    getprodFilterListingTypeApi,
    batchRemoveApi,
    getDevelopDictApi,
    batchCloseApi,
    batchOnApi,
    onlineProductsAutoSetTagApi
  } from '@/api/shopee/autosetlistingtag';
  import ZSelect from '@/components/ZSelect/index.vue';
  import { ElMessage } from 'element-plus';
  import DetailDialog from './components/DetailDialog.vue';
  import JumpPage from '@/components/JumpPage/index.vue';
  import MatchStore from './components/MatchStore.vue';

  const searchCardRef = ref();
  const formData = ref({});
  const formRef = ref();
  const total = ref(0);
  const activeKey = ref('activeKey');
  const initList = reactive({
    tagList: [], //标签枚举
    typeList: [
      { value: 0, label: '添加标签' },
      { value: 1, label: '移除标签' }
    ], //标签操作枚举
    prodFilterListingTypeList: [], // 不处理类型
    prodFilterListingTypeObj: {},
    triggerConditionTypeList: [], //
    autoAdjustPriceLogEnum: [], // variation自动调价失败日志枚举
    processingTypeList: [], // 配置对象
    developDictList: [] // 开发通知类型
  });

  onMounted(() => {
    gridOptions.height = comGetTableHeight(searchCardRef, true, false) - 16;
    Promise.all([
      getShopeeListingTagApi(),
      getprodFilterListingTypeApi(),
      getConfigEnumsApi(),
      getDevelopDictApi()
    ]).then((res) => {
      initList.tagList = res[0]?.data; // 标签枚举
      initList.prodFilterListingTypeList = res[1]?.data; // 获取不处理类型

      initList.prodFilterListingTypeList.forEach((v) => {
        initList.prodFilterListingTypeObj[v.code] = v;
      });
      initList.triggerConditionTypeList = res[2].data.TriggerConditionType.map(
        (v) => ({ ...v, show: true })
      );
      initList.autoAdjustPriceLogEnum = res[2].data.AutoAdjustPriceLogEnum.map(
        (v) => ({ ...v, desc: `(${v.resultType})${v.resultDescription}` })
      );
      initList.processingTypeList = res[2].data.ProcessingType;
      initList.developDictList = res[3].data;
    });
  });
  const handleSearch = async () => {
    try {
      const { data, count } = await queryPageApi({ ...formData.value });
      gridOptions.data = data || [];
      total.value = count;
    } catch (err) {
      total.value = 0;
      gridOptions.data = [];
    }
  };

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  // #region 表格渲染
  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height: '400',
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    // scrollY: { enabled: false },
    columns: Column,
    data: []
  });
  const renderListingTag = (listingTagId) => {
    let str = '';
    if (listingTagId !== undefined) {
      str =
        initList.tagList.filter((item) => item.id === listingTagId)[0]?.name ||
        '标签已删除！';
    }
    return str;
  };
  const renderProcessingType = (processingType) => {
    const str = initList.processingTypeList.filter(
      (item) => item.code === processingType
    )[0]?.desc;
    return str;
  };
  const renderType = (type) => {
    const str = initList.typeList.filter((item) => item.value === type)[0]
      ?.label;
    return str;
  };
  const renderTagConditionDesc = (row) => {
    const triggerConditionTypeStr =
      initList.triggerConditionTypeList.filter(
        (item) => item.code === row.triggerConditionType
      )[0]?.desc || '';
    const includeStr = row.conditionInclude ? '包含' : '不包含';
    let detailStr = '';
    if (row.triggerConditionType === 0) {
      detailStr = (row.conditionListingFilterCodeList || [])
        .map((item) => initList.prodFilterListingTypeObj[item]?.name)
        .join();
    } else if (row.triggerConditionType === 1) {
      detailStr = [null, undefined].includes(row.conditionLogText)
        ? ''
        : row.conditionLogText;
    } else if (row.triggerConditionType === 2) {
      detailStr = initList.autoAdjustPriceLogEnum
        .filter((v) => (row.autoAdjustPriceLogCodeList || []).includes(v.code))
        .map((v) => v.desc)
        .join();
    } else if (row.triggerConditionType === 3) {
      detailStr = initList.developDictList
        .filter((v) => (row.developmentNoticeTypeList || []).includes(v.id))
        .map((v) => v.name)
        .join();
    }
    return triggerConditionTypeStr + ' ' + includeStr + ' ' + detailStr;
  };
  // #endregion 表格渲染

  //   #region 操作
  const showDetail = ref(false);
  const checkedRow = ref({});
  const editType = ref();
  const handeEdit = (row) => {
    showDetail.value = true;
    checkedRow.value = row;
    editType.value = 'edit';
  };
  const handleAdd = () => {
    showDetail.value = true;
    checkedRow.value = {};
    editType.value = 'add';
  };
  const handeDel = async (row) => {
    //有店铺数不可以删除
    if (row.shopCount) {
      return ElMessage.warning('存在适用店铺的规则不可删除');
    }
    try {
      const { msg } = await batchRemoveApi([row.id]);
      ElMessage.success(msg);
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const showStore = ref(false);
  const handleShopCount = (row) => {
    checkedRow.value = row;
    showStore.value = true;
  };

  const showPage = ref(false);
  const handleDealListing = async () => {
    // 获取选中数据
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length)
      return ElMessage.warning('请选择标签配置项处理在线listing');
    // 禁用状态不支持
    const isDisabledStutasList = checkedList.some((v) => !v.status);
    if (isDisabledStutasList)
      return ElMessage.warning(
        '不支持处理禁用状态的规则，请重新选择标签配置项'
      );
    // 校验选中项中存在[在线listing标签≠不处理类型]数据
    const isNotUnDeal = checkedList.some((v) => v.triggerConditionType !== 0);
    if (isNotUnDeal)
      return ElMessage.warning(
        '仅支持批量处理[标签类型=不处理类型]的标签，请重新选择配置项'
      );
    const idList = checkedList.map((v) => v.id);
    try {
      await onlineProductsAutoSetTagApi(idList);
      showPage.value = true;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const rowCheckedList = ref([]);
  const handleBatch = (curBatchObj) => {
    // 获取选中数据
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择标签配置项');
    rowCheckedList.value = checkedList;
    curBatchObj.clickFc();
  };

  const handleBatchOn = async () => {
    // 若选中的数据中存在[规则状态=启用]，则过滤不处理
    const onList = rowCheckedList.value.filter((v) => !v.status);
    if (!onList.length) return ElMessage.warning('当前规则均已处于启用状态');
    const onIdList = onList.map((v) => v.id);
    try {
      await batchOnApi(onIdList);
      ElMessage.success(`已启用${onIdList.length}项配置项`);
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const handleBatchClose = async () => {
    // 若选中的数据中存在[规则状态=禁用]，则过滤不处理
    const closeList = rowCheckedList.value.filter((v) => v.status);
    if (!closeList.length) return ElMessage.warning('当前规则均已处于禁用状态');
    const closeIdList = closeList.map((v) => v.id);
    try {
      await batchCloseApi(closeIdList);
      ElMessage.success(`已禁用${closeIdList.length}项配置项`);
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const handleBatchRemove = async () => {
    // 选中项则校验选中行的规则 [适用店铺数]，若不为0则弹窗内toast提示“存在适用店铺的规则不可禁用！”
    const isExistShopCount = rowCheckedList.value.some((v) => v.shopCount);
    if (isExistShopCount) {
      return ElMessage.warning('存在适用店铺的规则不可禁用！');
    }
    const idList = rowCheckedList.value.map((v) => v.id);
    try {
      const { msg } = await batchRemoveApi(idList);
      ElMessage.success(msg);
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const batchType = ref();
  const batchTypeList = [
    {
      label: '批量启用',
      value: 'batchOn',
      clickFc: handleBatchOn
    },
    {
      label: '批量禁用',
      value: 'batchClose',
      clickFc: handleBatchClose
    },
    {
      label: '批量移除',
      value: 'batchRemove',
      clickFc: handleBatchRemove
    }
  ];

  // #endregion 操作
</script>

<style lang="scss" scoped>
  .ml12 {
    margin-left: 12px;
  }
</style>
