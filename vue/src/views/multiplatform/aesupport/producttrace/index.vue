<template>
  <!-- 商品寻源 -->

  <div class="app-container">
    <el-card v-loading="initLoading">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item
          label="OA新类目"
          prop="oaCateIdList"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.oaCateIdList"
            :options="initList.oaNewCateList"
            filterable
            :show-all-levels="false"
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'title',
              children: 'data'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="平台类目"
          prop="platCateIdList"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.platCateIdList"
            :options="initList.platCateList"
            :show-all-levels="false"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'cnName',
              value: 'categoryId',
              children: 'children'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="bizzOwnerList" label="开发专员">
          <MultiSelect
            v-model="formData.bizzOwnerList"
            class="form_right"
            :allow-create="true"
            :option-obj="{
              optionList: initList?.bizzOwnerList
            }"
          />
        </el-form-item>
        <el-form-item prop="prodSSkuList" label="子SKU">
          <el-input v-model="formData.prodSSkuList" clearable />
        </el-form-item>
        <el-form-item
          prop="taskNameOrpurchaseChannel"
          label="产品名称/任务名称"
          class="item-label"
        >
          <el-input v-model="formData.taskNameOrpurchaseChannel" clearable />
        </el-form-item>
        <el-form-item prop="taskCode" label="任务编号">
          <el-input
            v-model="formData.taskCode"
            clearable
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item prop="taskStatus" label="任务状态">
          <el-select v-model="formData.taskStatus" clearable>
            <el-option :value="1" label="进行中" />
            <el-option :value="2" label="已结束" />
          </el-select>
        </el-form-item>
        <el-form-item prop="reportingStatus" label="提报状态">
          <el-select v-model="formData.reportingStatus" clearable>
            <el-option :value="1" label="未提报" />
            <el-option :value="2" label="已提报" />
          </el-select>
        </el-form-item>
        <el-form-item prop="approved" label="审核结果">
          <el-select v-model="formData.approved" clearable>
            <el-option :value="0" label="待审核" />
            <el-option :value="1" label="审核通过" />
            <el-option :value="2" label="审核不过" />
          </el-select>
        </el-form-item>
        <el-form-item prop="taskEndTime" label="项目截止时间">
          <el-date-picker
            v-model="formData.taskEndTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
            range-separator="-"
            start-placeholder="起始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item prop="priority" label="优先级">
          <el-select v-model="formData.priority" clearable>
            <el-option :value="1" label="低" />
            <el-option :value="2" label="中" />
            <el-option :value="3" label="高" />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="hasSupplierReply"
          label="有无供应商参与"
          class="item-label"
        >
          <el-select v-model="formData.hasSupplierReply" clearable>
            <el-option :value="true" label="有" />
            <el-option :value="false" label="无" />
          </el-select>
        </el-form-item>
        <el-form-item prop="localCreateTime" label="本地创建时间">
          <el-date-picker
            v-model="formData.localCreateTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item prop="tag" label="编辑状态">
          <el-select v-model="formData.tag" clearable>
            <el-option :value="0" label="未编辑" />
            <el-option :value="1" label="可补充" />
            <el-option :value="2" label="已编辑" />
          </el-select>
        </el-form-item>
        <el-form-item style="width: 120px">
          <el-button type="primary" @click="handleSubmit()">查询</el-button>
          <el-button @click="handleReset(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div v-loading="searchLoading" class="list_card">
      <div
        v-if="cardList.length"
        v-infinite-scroll="load"
        class="infinite-list"
        style="min-height: 400px"
        :infinite-scroll-disabled="disabledLoad"
      >
        <template v-for="item in cardList" :key="item.id">
          <TaskCard
            :card-item="item"
            :init-list="initList"
            @change-info="changeInfo"
            @change-key="changeKey"
          />
        </template>
        <p v-if="cardLoading" class="last-text">加载中...</p>
        <p v-if="noMore" class="last-text">----到底啦----</p>
      </div>
      <div v-else><el-empty description="暂无数据" /></div>
    </div>
  </div>
</template>

<script setup name="multiplatformaesupportproducttrace">
  import { computed, onMounted, reactive, ref } from 'vue';
  import { queryOaNewCategory, getCustomers, shortcuts } from '@/api/common';
  import {
    queryPlatCateListApi,
    queryPageApi,
    updateApi
  } from '@/api/multiplatform/aeproducttrace';
  import TaskCard from './componenets/TaskCard.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import { ElMessage } from 'element-plus';
  import { cloneDeep } from 'lodash-es';

  // #region 初始化
  const initList = reactive({});
  const initLoading = ref(false);
  onMounted(async () => {
    initLoading.value = true;
    Promise.all([queryOaNewCategory(), queryPlatCateListApi(), getCustomers()])
      .then((res) => {
        initList.oaNewCateList = JSON.parse(res[0].data); // oa新类目
        initList.platCateList = res[1].data; // 平台类目
        initList.bizzOwnerList = res[2].data.userList.map(
          (item) => item.user_name
        ); //开发专员  选项取值自基础模板-模板详情-开发专员（开发专员）
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        initLoading.value = false;
      });
  });
  // #endregion 初始化结束
  // #region 表单 start
  const formRef = ref();
  const formData = reactive({
    taskStatus: 1
  });
  const handleReset = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };
  const searchLoading = ref(false);
  const handleSubmit = async (type = 'init') => {
    if (type === 'init') {
      paginationData.page = 1;
      paginationData.total = 0;
      searchLoading.value = true;
    }
    try {
      cardLoading.value = true;
      const params = getParams();
      const { data, count } = await queryPageApi(params);
      const _data = (data || []).map((item) => ({
        ...item,
        cardItemLoading: false
      }));
      if (type === 'add') {
        cardList.value = cardList.value.concat(_data);
      } else {
        cardList.value = _data;
      }
      paginationData.total = count;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      cardLoading.value = false;
      searchLoading.value = false;
    }
  };
  const getParams = () => {
    let params = { ...formData };
    params.pageSize = paginationData.limit;
    params.pageNum = paginationData.page;
    if (params.oaCateIdList && params.oaCateIdList.length) {
      params.oaCateIdList = params.oaCateIdList.map(
        (item) => item[item.length - 1]
      );
    }
    if (params.platCateIdList && params.platCateIdList.length) {
      params.platCateIdList = params.platCateIdList.map(
        (item) => item[item.length - 1]
      );
    }
    if (params.prodSSkuList) {
      params.prodSSkuList = params.prodSSkuList.split(',');
    } else {
      params.prodSSkuList = [];
    }
    if (params.taskEndTime && params.taskEndTime.length) {
      params.taskEndTimeMin = new Date(
        params.taskEndTime[0] + ' 00:00:00'
      ).getTime();
      params.taskEndTimeMax = new Date(
        params.taskEndTime[1] + ' 23:59:59'
      ).getTime();
    }
    if (params.localCreateTime && params.localCreateTime.length) {
      params.localCreateTimeMin = new Date(
        params.localCreateTime[0] + ' 00:00:00'
      ).getTime();
      params.localCreateTimeMax = new Date(
        params.localCreateTime[1] + ' 23:59:59'
      ).getTime();
    }
    return params;
  };
  // #endregion 表单end
  // #region 列表start
  const cardLoading = ref(false);
  const paginationData = reactive({
    page: 1,
    limit: 5,
    total: 0
  });
  const noMore = computed(
    () =>
      cardList.value.length >= paginationData.total && paginationData.total > 0
  );
  const cardList = ref([]);
  const disabledLoad = computed(() => cardLoading.value || noMore.value);
  const load = () => {
    cardLoading.value = true;
    ++paginationData.page;
    setTimeout(() => {
      handleSubmit('add');
      cardLoading.value = false;
    }, 1000);
  };
  // 选中sku后根据模板信息联动填充字段： 商品简称、oa新类目、款式、预估报价、成本、毛重、尺寸、供应商链接、开发专员
  // 若上述联动填充字段中存在找不到对应值时，对应填充字段仍为空即可；
  // 若联动填充字段在选中sku前已填写信息，则选中sku后用联动内容直接覆盖填写的信息；仅联动的内容为空时则保持填写的内容
  const changeInfo = async (rowItem) => {
    const curIndex = cardList.value.findIndex((e) => e.id === rowItem.id);
    const oldCurData = cardList.value[curIndex];
    const keyArr = [
      'purchaseChannel',
      'oaCateId',
      'style',
      'estimatePrice',
      'cost',
      'weight',
      'outerBoxLength',
      'outerBoxWidth',
      'outerBoxHeight',
      'supplierUrl',
      'bizzOwner'
    ];
    const newCurData = { ...oldCurData, ...rowItem };
    keyArr.forEach((item) => {
      if (newCurData[item] === null || newCurData[item] === undefined) {
        newCurData[item] = oldCurData[item];
      }
    });
    newCurData.estimatePrice = getEstimatePrice(newCurData);

    try {
      cardList.value[curIndex].cardItemLoading = true;
      delete newCurData.cardItemLoading;
      const { data } = await updateApi(newCurData);
      ElMessage.success('修改成功');
      cardList.value[curIndex] = data;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      cardList.value[curIndex].cardItemLoading = false;
    }
  };

  const changeKey = async (obj) => {
    const curIndex = cardList.value.findIndex((e) => e.id === obj.id);
    const curData = cloneDeep(cardList.value[curIndex]);
    curData[obj.key] = obj[[obj.key]];
    if (Array.isArray(curData.oaCateId)) {
      curData.oaCateId = curData.oaCateId[curData.oaCateId.length - 1];
    }
    curData.estimatePrice = getEstimatePrice(curData);
    try {
      cardList.value[curIndex].cardItemLoading = true;
      delete curData.cardItemLoading;
      const { data } = await updateApi(curData);
      ElMessage.success('修改成功');
      cardList.value[curIndex] = data;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      cardList.value[curIndex].cardItemLoading = false;
    }
  };
  // 预估报价=（重量*0.0035*2+0.5+成本）/70%
  // 当公式中字段取值为空时，该字段显示为“-”
  const getEstimatePrice = (curObj) => {
    let estimatePrice = null;
    if (curObj.weight && curObj.cost) {
      estimatePrice = (curObj.weight * 0.0035 * 2 + 0.5 + curObj.cost) / 0.7;
    }
    return estimatePrice;
  };
  // #endregion 列表end
</script>

<style lang="scss" scoped>
  .item-label {
    :deep(.el-form-item__label) {
      line-height: 15px;
      padding-right: 0px !important;
    }
  }
  .last-text {
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
</style>
