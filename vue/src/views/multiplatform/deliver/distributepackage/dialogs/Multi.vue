<template>
  <el-dialog
    :model-value="multiDialogVisible"
    title="可配组合品"
    width="90%"
    :close-on-click-modal="false"
    align-center
    :before-close="handleClose"
  >
    <el-form :model="searchData" :inline="true" class="search_form">
      <el-form-item label="平台">
        <MultiSelect
          v-model="searchData.platCode"
          :option-obj="{ optionList: state.platList }"
          @change="changePlatCode"
        />
        <!-- <el-select
          v-model="searchData.platCode"
          placeholder="请选择"
          clearable
          filterable
          multiple
          @change="changePlatCode"
        >
          <el-option
            v-for="item in state.platList"
            :key="item"
            :lbael="item"
            :value="item"
          ></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-select v-model="searchData.warehouseName" filterable clearable>
          <el-option
            v-for="item in platStoreList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批次号">
        <el-select
          v-model="searchData.batchNos"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.batchNoList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否急采">
        <el-select v-model="searchData.ifSpeed" filterable clearable>
          <el-option label="急采" :value="1"></el-option>
          <el-option label="非急采" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售备注">
        <el-input
          v-model="searchData.sellerRemark"
          clearable
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序方式">
        <el-select
          v-model="searchData.orderType"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option :value="1" label="创建时间升序"></el-option>
          <el-option :value="2" label="创建时间倒序"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库缺货">
        <el-select
          v-model="searchData.lackMark"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option :value="true" label="是"></el-option>
          <el-option :value="false" label="否"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="showIfContainPickUpNo" label="是否有揽收单">
        <el-select v-model="searchData.ifContainPickUpNo" filterable clearable>
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传箱唛">
        <el-select v-model="searchData.ifHaveCaseLabel" filterable clearable>
          <el-option label="全部" :value="null"></el-option>
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchDataBtn">
          查询
        </el-button></el-form-item
      >
    </el-form>
    <div>
      <vxe-toolbar ref="xToolbar" custom print>
        <template #buttons>
          <vxe-button :content="nums"></vxe-button>
          <span style="padding-left: 20px"
            >已生成批次SKU: {{ batchSkuNum || 0 }}</span
          >
          <span style="padding-left: 20px"
            >总SKU: {{ tableData.length || 0 }}</span
          >
        </template>
        <template #tools>
          <vxe-button
            content="生成批次"
            status="primary"
            @click="getBatchNo"
          ></vxe-button>
          <vxe-button
            content="标记已配货"
            status="primary"
            @click="getSelectedEvent"
          ></vxe-button>
          <vxe-button
            content="取消批次"
            status="danger"
            @click="cancelBatch"
          ></vxe-button>
          <vxe-button type="text" class="tool-btn"></vxe-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        ref="xTable"
        border
        height="500"
        :print-config="{}"
        :data="tableData"
        :column-config="{ resizable: true }"
        :loading="multiLoading"
      >
        <vxe-column type="checkbox" width="40"></vxe-column>
        <vxe-column
          title="平台"
          field="platCode"
          sortable
          width="100"
          :sort-by="sortPlatMethod"
        >
          <template #default="{ row }">
            {{ row.shipmentInfo.platCode }}
          </template>
        </vxe-column>
        <vxe-column title="仓库" field="warehouseName" width="80">
          <template #default="{ row }">
            {{ row.shipmentInfo.warehouseName }}
          </template>
        </vxe-column>
        <vxe-column title="批次号" field="batchNo"></vxe-column>
        <vxe-column field="platOrderId" title="货件号">
          <template #default="{ row }">
            <span>{{
              row.shipmentInfo ? row.shipmentInfo.platOrderId : ''
            }}</span>
          </template>
        </vxe-column>
        <vxe-column field="ifSpeed" title="是否急采" width="80">
          <template #default="{ row }">
            <span>{{ row.shipmentInfo.ifSpeed ? '急采' : '非急采' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间">
          <template #default="{ row }">
            <span>{{
              row.shipmentInfo.createTime
                ? parseTime(
                    row.shipmentInfo.createTime,
                    '{y}-{m}-{d} {h}:{i}:{s}'
                  )
                : ''
            }}</span>
          </template>
        </vxe-column>
        <vxe-column field="prodSSku" title="组合品SKU"></vxe-column>
        <vxe-column
          field="packStatus"
          title="配货状态"
          :filters="[]"
          sortable
          :sort-by="sortPackStatusMethod"
        >
          <template #default="{ row }">
            <span>{{ statusEnums[row.packStatus] }}</span>
          </template>
        </vxe-column>
        <vxe-column
          field="distributeTime"
          title="派至仓库时间"
          :filters="[]"
          :filter-method="filterTimeMethod"
          sortable
          :sort-by="sortTimeMethod"
        >
          <template #default="{ row }">
            <span>{{
              transferDate(row.shipmentInfo && row.shipmentInfo.dispatchTime)
            }}</span>
          </template>
        </vxe-column>
        <vxe-column field="planQuantity" width="100">
          <template #header>
            <el-tooltip
              effect="dark"
              :content="'当页合计： ' + (totalPlanQuantity || 0)"
              raw-content
              placement="top-end"
            >
              可配数量 {{ totalPlanQuantity }}
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column field="restNumber" title="剩余可用">
          <template #default="{ row }">
            <span>{{
              row.whStock
                ? row.whStock.currentStock - row.whStock.reservationStock
                : 0
            }}</span>
          </template>
        </vxe-column>
        <vxe-colgroup title="组合品详情">
          <vxe-column field="sSku" title="商品SKU" width="140">
            <template #default="{ row }">
              <div
                v-for="item in row.prodSInfoDto.combSubProds"
                :key="item.id"
                class="combination_td"
              >
                <span>{{ item.sSku }}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="locationCode" title="库位" width="140">
            <template #default="{ row }">
              <div
                v-for="item in row.prodSInfoDto.combSubProds"
                :key="item.id"
                class="combination_td"
              >
                <span>{{ item.combLocation.locationCode }}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="prodDetailNums" title="组合数">
            <template #default="{ row }">
              <div
                v-for="item in row.prodSInfoDto.combSubProds"
                :key="item.id"
                class="combination_td"
              >
                <span>{{ item.prodDetailNums }}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="allNums" title="商品数量">
            <template #default="{ row }">
              <div
                v-for="item in row.prodSInfoDto.combSubProds"
                :key="item.id"
                class="combination_td"
              >
                <span>{{ item.prodDetailNums * row.planQuantity }}</span>
              </div>
            </template>
          </vxe-column>
        </vxe-colgroup>
        <vxe-column field="salerRemark" title="销售备注" :filters="[]" />
      </vxe-table>
      <vxe-pager
        v-model:current-page="tablePage.currentPage"
        v-model:page-size="tablePage.pageSize"
        background
        :layouts="[
          'Sizes',
          'PrevJump',
          'PrevPage',
          'Number',
          'NextPage',
          'NextJump',
          'FullJump',
          'Total'
        ]"
        :page-sizes="[25, 50, 100, 200, 500]"
        :total="tablePage.total"
        @page-change="handlePageChange"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import {
    defineEmits,
    ref,
    nextTick,
    reactive,
    onMounted,
    watch,
    computed
  } from 'vue';
  import { transferDate, parseTime } from '@/utils/common';
  import {
    queryLatestUnMatchBatchNo,
    createPDABatchNo,
    markDistributed,
    queryPackableMulti,
    cancelSkuTransferBatch
  } from '@/api/multiplatform/distributepackage';
  import { getAllPlatList } from '@/api/common/index.js';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import { difference, cloneDeep } from 'lodash-es';

  defineProps({
    platStoreList: {
      type: Array,
      default: () => []
    }
  });

  const state = reactive({
    platList: [], // 平台
    batchNoList: [] // 批次号
  });
  const searchData = ref({
    platCode: [],
    batchNo: '',
    batchNos: '',
    warehouseName: '',
    ifSpeed: null,
    sellerRemark: '',
    orderType: null,
    ifContainPickUpNo: true,
    ifHaveCaseLabel: null
  });

  const AE_PLATCODE = ['AE半托管', 'AE全托管'];
  onMounted(async () => {
    {
      const { code, data } = await getAllPlatList();
      if (code === '0000') {
        state.platList = data;
      }
    }
    getBatchNoOption();
  });

  // 获取批次号下拉数据
  const getBatchNoOption = async () => {
    const { code, data } = await queryLatestUnMatchBatchNo({
      ifCom: 0,
      warehouseName: searchData.value.warehouseName
    });
    code === '0000'
      ? (state.batchNoList = ['无批次'].concat(data))
      : (state.batchNoList = ['无批次']);
  };

  watch(
    () => searchData.value.warehouseName,
    (val) => {
      if (val) {
        getBatchNoOption();
        searchData.value.batchNos = '';
      }
    }
  );

  const changePlatCode = () => {
    if (showIfContainPickUpNo.value) {
      // if (AE_PLATCODE.includes(val)) {
      searchData.value.ifContainPickUpNo = true;
    }
  };

  const showIfContainPickUpNo = computed(() => {
    const { platCode } = searchData.value;
    if (platCode.some((v) => AE_PLATCODE.includes(v))) {
      return true;
    } else {
      return false;
    }
  });

  computed;

  const batchSkuNum = ref(''); // 已生成批次sku数量
  const totalPlanQuantity = ref('');
  // 查询
  const searchDataBtn = async () => {
    if (searchData.value.batchNos == '无批次') {
      searchData.value.batchNo = '';
    } else if (searchData.value.batchNos == '') {
      searchData.value.batchNo = null;
    } else if (searchData.value.batchNos != '') {
      searchData.value.batchNo = searchData.value.batchNos;
    }
    if (searchData.value.ifSpeed === '') {
      searchData.value.ifSpeed = null;
    }
    //仅支持AE全托管和AE半托管的平台多选
    if (
      searchData.value.platCode?.length >= 2 &&
      difference(searchData.value.platCode, ['AE全托管', 'AE半托管']).length
    ) {
      ElMessageBox.alert('仅支持AE全托管和AE半托管的平台多选!', '提示', {
        confirmButtonText: '确认',
        type: 'warning'
      });
      return;
    }
    if (
      showIfContainPickUpNo.value &&
      typeof searchData.value.ifContainPickUpNo !== 'boolean'
    ) {
      searchData.value.ifContainPickUpNo = null;
    }
    if (!showIfContainPickUpNo.value) {
      delete searchData.value.ifContainPickUpNo;
    }
    multiLoading.value = true;
    const params = cloneDeep({
      ...searchData.value,
      platCodeStr: searchData.value.platCode.join(',')
    });
    delete params.platCode;
    let multiGood = await queryPackableMulti(params).finally(
      () => (multiLoading.value = false)
    );
    multiData.value = multiGood.data;
    tablePage.total = multiGood.data.length;
    nums.value = `数量:${multiGood.data.length}`;
    tableData.value = multiData.value.slice(0, tablePage.pageSize);
    updateTotalQuantity();
    batchSkuNum.value = tableData.value.filter((item) => item.batchNo)?.length;
    setFilterData();
  };

  // 生成批次
  const getBatchNo = async () => {
    const $table = xTable.value;
    const selectRecords = $table.getCheckboxRecords();
    if (selectRecords && selectRecords.length > 0) {
      // 因搜索时查询接口必传platcode，故不用校验平台
      // 平台
      // let platCode = selectRecords.map((item) =>
      //   item.shipmentInfo ? item.shipmentInfo.platCode : ''
      // );
      // // 平台去重
      // let uniquePlatCode = Array.from(new Set(platCode));
      // if (uniquePlatCode.length != 1) {
      //   return ElMessage.warning('请选择同一平台生成批次');
      // }
      let ids = selectRecords.map((item) => item.id);
      let result = await createPDABatchNo({ ids });
      if (result.code == '0000') {
        ElMessage.success(result.msg || '操作成功');
        getData();
      }
    } else {
      console.log(selectRecords);
    }
  };

  // 取消批次
  const cancelBatch = async () => {
    const $table = xTable.value;
    const selectRecords = $table.getCheckboxRecords();
    if (selectRecords && selectRecords.length > 0) {
      const ids = selectRecords.map((item) => item.id);

      let formData = new FormData();
      formData.append('ids', ids.join(','));

      await ElMessageBox.confirm('确定要取消批次吗?', { type: 'warning' });
      const { code, msg } = await cancelSkuTransferBatch(formData);
      if (code == '0000') {
        ElMessage.success(msg);
        getData();
      }
    } else {
      return ElMessage.warning('请至少勾选一条数据！');
    }
  };

  let multiData = ref([]);
  let tableData = ref([]);
  let multiLoading = ref(false);
  let nums = ref('');
  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 100
  });
  const getData = async () => {
    try {
      if (searchData.value.batchNos == '无批次') {
        searchData.value.batchNo = '';
      } else if (searchData.value.batchNos == '') {
        searchData.value.batchNo = null;
      } else if (searchData.value.batchNos != '') {
        searchData.value.batchNo = searchData.value.batchNos;
      }
      multiLoading.value = true;
      const params = cloneDeep({
        ...searchData.value,
        platCodeStr: searchData.value.platCode.join(',')
      });
      delete params.platCode;
      let multiGood = await queryPackableMulti(params);
      multiLoading.value = false;
      multiData.value = multiGood.data;
      tablePage.total = multiGood.data.length;
      nums.value = `数量:${multiGood.data.length}`;
      tableData.value = multiData.value.slice(0, tablePage.pageSize);
      updateTotalQuantity();
      batchSkuNum.value = tableData.value.filter(
        (item) => item.batchNo
      )?.length;

      setFilterData();
    } catch (err) {
      console.error('未存框取货', err);
    }
  };

  const setFilterData = () => {
    let filterTime = [];
    let filterRemark = [];
    tableData.value.forEach((item) => {
      let objTime = {
        label: transferDate(item.assistInfo?.distributeTime),
        value: transferDate(item.assistInfo?.distributeTime)
      };
      let objRemark = {
        label: item.salerRemark,
        value: item.salerRemark
      };
      filterTime.push(objTime);
      filterRemark.push(objRemark);
    });
    filterTime = arrDistinctByProp(filterTime, 'label');
    filterRemark = arrDistinctByProp(filterRemark, 'label');
    const $table = xTable.value;
    if ($table) {
      const timeColumn = $table.getColumnByField('distributeTime');
      const remarkColumn = $table.getColumnByField('salerRemark');
      if (timeColumn) {
        $table.setFilter(timeColumn, filterTime);
      }
      if (remarkColumn) {
        $table.setFilter(remarkColumn, filterRemark);
      }
    }
  };

  const arrDistinctByProp = (arr, prop) => {
    let obj = {};
    return arr.reduce(function (preValue, item) {
      obj[item[prop]] ? '' : (obj[item[prop]] = true && preValue.push(item));
      return preValue;
    }, []);
  };

  const filterTimeMethod = ({ value, row }) => {
    return value === transferDate(row.assistInfo?.distributeTime);
  };

  //分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
    //渲染表格
    let startItem = (currentPage - 1) * pageSize;
    let endItem = currentPage * pageSize;
    tableData.value = multiData.value.slice(startItem, endItem);
    updateTotalQuantity();
    batchSkuNum.value = tableData.value.filter((item) => item.batchNo)?.length;
    setFilterData();
  };

  const updateTotalQuantity = () => {
    totalPlanQuantity.value = tableData.value?.reduce((prev, cur) => {
      return prev + (cur.planQuantity || 0);
    }, 0);
  };

  let multiDialogVisible = ref(false);
  //配货状态: 待配货(0),待包装(1),待存框(2),已存框(3);
  const statusEnums = ref({
    0: '待配货',
    1: '待包装',
    2: '待存框',
    3: '已存框',
    4: '仓库缺货'
  });
  //关闭的点击事件
  //实例化defineEmits
  const emits = defineEmits(['update:modelValue']);
  const handleClose = () => {
    emits('update:modelValue', false);
  };
  // 将表格和工具栏进行关联
  let xTable = ref(null);
  let xToolbar = ref(null);
  nextTick(() => {
    const $table = xTable.value;
    const $toolbar = xToolbar.value;
    $table.connect($toolbar);
  });

  const getSelectedEvent = async () => {
    const $table = xTable.value;
    const selectRecords = $table.getCheckboxRecords();
    try {
      if (selectRecords && selectRecords.length > 0) {
        let result = await markDistributed(selectRecords);
        ElMessage.success(result.msg || '操作成功');
        getData();
      } else {
        console.log(selectRecords);
      }
    } catch (err) {
      console.error('标记已配货', err);
    }
  };
  nextTick(() => {
    const $table = xTable.value;
    if ($table) {
      const nameColumn = $table.getColumnByField('packStatus');
      if (nameColumn) {
        $table.setFilter(nameColumn, [
          { label: '待配货', value: 0 },
          { label: '待包装', value: 1 },
          { label: '仓库缺货', value: 4 }
        ]);
      }
    }
  });
  // const sortLogisticsNoMethod = ({ row }) => {
  //   // 按发货号进行排序
  //   return row.shipmentInfo.logisticsNo;
  // };
  const sortPackStatusMethod = ({ row }) => {
    return row.packStatus;
  };
  const sortTimeMethod = ({ row }) => {
    return row.shipmentInfo && row.shipmentInfo.dispatchTime;
  };
  const sortPlatMethod = ({ row }) => {
    return row.shipmentInfo && row.shipmentInfo.platCode;
  };
</script>

<style lang="scss" scoped></style>
