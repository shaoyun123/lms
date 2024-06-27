<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="批量调整原价和促销价"
      :width="1200"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-card>
        <el-form
          ref="formRef"
          :model="formData"
          :inline="true"
          class="search_form"
        >
          <el-form-item prop="skuType">
            <el-select v-model="formData.skuType" class="form_left" filterable>
              <el-option :value="2" label="商品子SKU" />
              <el-option :value="1" label="商品父SKU" />
            </el-select>
            <el-input
              v-model="formData.skus"
              clearable
              class="form_right"
              placeholder="精确搜索,支持多个逗号隔开"
              @blur="commonDivideComma($event)"
            />
          </el-form-item>
          <el-form-item label="部门" prop="orgId">
            <el-tree-select
              v-model="formData.orgId"
              placeholder="请选择"
              :data="selectData.departData"
              check-strictly
              :props="defaultProps"
              :render-after-expand="false"
              :empty-text="'No matching Data'"
              clearable
              filterable
              @node-click="handleNodeClick"
              @clear="clearDepart"
            />
          </el-form-item>
          <el-form-item label="销售员" prop="salePersonId">
            <el-select
              v-model="formData.salePersonId"
              placeholder="请选择"
              clearable
              filterable
              @change="changeSalers"
              @clear="resetSearch"
            >
              <el-option
                v-for="item in selectData.salersData"
                :key="item.id"
                :label="item.user_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺" prop="storeAcctIdList">
            <el-select
              v-model="formData.storeAcctIdList"
              :class="formData.storeAcctIdList.length > 1 ? 'hideTag' : ''"
              placeholder="请选择"
              multiple
              filterable
              collapse-tags
              clearable
            >
              <template #prefix>
                <el-tag v-if="formData.storeAcctIdList.length > 1" type="info"
                  >已选{{ formData.storeAcctIdList.length }}项</el-tag
                >
              </template>
              <el-option
                v-for="item in selectData.storeData"
                :key="item.id"
                :label="item.storeAcct"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="店铺" prop="storeAcctIdList">
            <ZCascader
              v-model="formData.storeAcctIdList"
              :data="storeTreeList"
            />
          </el-form-item> -->
          <el-form-item class="form_range" prop="salesType">
            <el-select v-model="formData.salesType" class="form_left">
              <el-option value="1" label="7天销量" />
              <el-option value="2" label="30天销量" />
              <el-option value="3" label="60天销量" />
              <el-option value="4" label="90天销量" />
              <el-option value="5" label="180天销量" />
            </el-select>
            <el-input v-model="formData.saleGreat" clearable />
            <div class="range_link">-</div>
            <el-input v-model="formData.saleLess" clearable />
          </el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <el-button @click="handleResetForm()">清空</el-button>
        </el-form>
      </el-card>
      <el-card class="list_card">
        <el-tabs v-model="activeName" @tab-click="handleSearch()">
          <el-tab-pane :label="tabLabel" name="first">
            <vxe-table
              ref="tableRef"
              :data="tableData"
              :height="500"
              border
              :edit-rules="validRules"
              :row-config="{ isCurrent: true, isHover: true }"
              :column-config="{ resizable: true }"
            >
              <vxe-column type="checkbox" width="40" />
              <vxe-column field="storeAcctName" title="店铺"> </vxe-column>
              <vxe-column field="itemId" title="item_id" width="100" />
              <vxe-column field="sellerSku" title="店铺子SKU"> </vxe-column>
              <vxe-column field="prodSSku" title="商品子SKU" />
              <vxe-column field="grossProfitRate" title="7/30/60/90/180天销量">
                <template #default="{ row }">
                  {{ row.sevenSale }}/{{ row.thirtySale }}/{{
                    row.sixtySale
                  }}/{{ row.ninetySale }}/{{ row.oneHundredAndEightySale }}
                </template>
              </vxe-column>
              <vxe-column field="oldPrice" title="当前原价" width="90" />
              <vxe-column field="newPrice" title="新原价" width="90">
                <template #default="{ row }">
                  <vxe-input
                    v-model="row.newPrice"
                    placeholder="请输入"
                  ></vxe-input>
                  <!-- @change="handleChangeNewPrice(row, 'newPrice')" -->
                </template>
              </vxe-column>
              <vxe-column
                field="oldSpecialPrice"
                title="当前促销价"
                width="90"
              />
              <vxe-column field="newSpecialPrice" title="新促销价" width="90">
                <template #default="{ row }">
                  <vxe-input
                    v-model="row.newSpecialPrice"
                    placeholder="请输入"
                    @change="handleChangeNewPrice(row, 'newSpecialPrice')"
                  ></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="specialDiff"
                title="促销价差价幅度"
                :title-help="{
                  message: '（新促销价-当前促销价）/当前促销价'
                }"
                :filters="[{}]"
                :filter-method="filterRange"
                :filter-reset-method="filterResetRange"
              >
                <template #default="{ row }">
                  {{ ((row.specialDiff || 0) * 100).toFixed(0) || 0 }}%
                </template>
                <template #filter="{ column, $panel }">
                  <div
                    v-for="(option, index) in column.filters"
                    :key="index"
                    class="disflex_between m10"
                  >
                    <ZInputNumber
                      v-model="option.min"
                      :precision="2"
                      placeholder=">="
                      class="w80"
                      @input="$panel.changeOption($event, true, option)"
                    /><span>%</span>
                    <ZInputNumber
                      v-model="option.max"
                      :precision="2"
                      placeholder="<="
                      class="w80 ml10"
                      @input="$panel.changeOption($event, true, option)"
                    /><span>%</span>
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="result" title="操作结果" width="100" />
            </vxe-table>
          </el-tab-pane>
        </el-tabs>
        <div
          style="
            position: absolute;
            top: 10px;
            left: 100px;
            width: 650px;
            display: flex;
          "
        >
          <el-form-item>
            <el-select v-model="formData.sel1" style="width: 90px">
              <el-option value="0" label="新促销价=" />
              <el-option value="1" label="新原价=" />
            </el-select>
            <el-select v-model="formData.sel2" style="width: 90px" clearable>
              <el-option value="0" label="当前促销价" />
              <el-option value="1" label="当前原价" />
              <el-option value="2" label="新促销价" />
              <el-option value="3" label="新原价" />
            </el-select>
            <el-select v-model="formData.sel3" style="width: 50px" clearable>
              <el-option value="0" label="+" />
              <el-option value="1" label="-" />
              <el-option value="2" label="*" />
              <el-option value="3" label="/" />
            </el-select>
            <el-input
              v-model="formData.input1"
              clearable
              style="width: 100px"
            />
          </el-form-item>
          <el-button type="primary" style="margin: 0 10px" @click="apply">
            一键应用
          </el-button>
          <el-form-item label="毛利率" prop="_gross" style="width: 150px">
            <el-input
              v-model="formData._gross"
              clearable
              placeholder="填写小数，0.3"
            />
          </el-form-item>
          <el-button type="primary" style="margin: 0 10px" @click="fixPrice">
            定价
          </el-button>
        </div>
        <div class="common_batch_btns">
          <el-button type="primary" @click="handleBatchPriceadjust">
            批量调价
          </el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, onMounted, reactive, ref, nextTick } from 'vue';
  // import ZCascader from '@/components/ZCascader/index.vue';
  import {
    updatePriceAndPromotionPrice,
    updatePriceAndPromotionPriceApi
  } from '@/api/publishs/darazonlineproduct';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  // import { getResultByBatchNoApi } from '@/api/common/index';
  import { commonDivideComma } from '@/utils/divide';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { ElMessage } from 'element-plus';
  //   import { isEmpty } from 'lodash-es';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectRecords: {
      type: Array,
      default: () => []
    },
    storeTreeList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['update:modelValue']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      // if (val == false && darazModifyPriceTimestamp.value != '') {
      //   window.clearInterval(darazModifyPriceTimestamp.value);
      // }
      emits('update:modelValue', val);
    }
  });

  const formData = ref({
    skuType: 2,
    salesType: '1',
    storeAcctIdList: [],
    sel1: '0',
    sel2: '0',
    sel3: '0'
  });
  let tableData = ref();
  onMounted(async () => {
    const idList = props.selectRecords.map((item) => item.id);
    const { data, count } = await updatePriceAndPromotionPrice({ idList });
    tableData.value = data;
    totalCount.value = count;
    // 部门
    // getPaymentsList();
    // 销售员
    getDepartmentList();
    // 店铺
    getStoreList();
  });
  // #region 搜索
  const formRef = ref();
  const handleResetForm = () => {
    formRef.value.resetFields();
    formData.value.skus = '';
    formData.value.saleGreat = '';
    formData.value.saleLess = '';
  };
  const totalCount = ref(0);
  const activeName = ref('first');
  const tabLabel = computed(() => `总数(${totalCount.value})`);
  const handleSearch = async () => {
    if (!formData.value.skus || formData.value.skus == '') {
      ElMessage.warning('输入sku，才可以查询');
      return false;
    }
    try {
      formData.value.gross = '';
      const { data, count } = await updatePriceAndPromotionPrice(
        formData.value
      );
      tableData.value = data;
      totalCount.value = count;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // #endregion
  const tableRef = ref();
  // #region 差价筛选
  // 差价筛选项
  const filterRange = ({ option, cellValue }) => {
    let { min, max } = option;
    if (min == 0) {
      min = 0;
    } else if (!min) {
      min = null;
    } else {
      min = min / 100;
    }
    if (!max) {
      max = null;
    } else if (max == 0) {
      max = 0;
    } else {
      max = max / 100;
    }
    if ([null, undefined].includes(min)) {
      if (cellValue <= max) {
        return true;
      }
    } else if ([null, undefined].includes(max)) {
      if (cellValue >= min) {
        return true;
      }
    } else if (
      ![null, undefined].includes(min) &&
      ![null, undefined].includes(max)
    ) {
      if (cellValue <= max && cellValue >= min) {
        return true;
      }
    }
    return false;
  };
  const filterResetRange = ({ options }) => {
    options[0].min = null;
    options[0].max = null;
  };
  // #endregion 差价筛选
  //   修改价格
  const handleChangeNewPrice = (row) => {
    if (row.newSpecialPrice == '') {
      row.specialDiff = 0;
    } else {
      row.specialDiff = (
        (row.newSpecialPrice * 1 - row.oldSpecialPrice * 1) /
        row.oldSpecialPrice
      ).toFixed(2);
    }
  };
  // #region 操作 批量调价
  // let darazModifyPriceTimestamp = ref(null);
  const handleBatchPriceadjust = async () => {
    const reqs = tableRef.value.getCheckboxRecords();
    if (!reqs.length) return ElMessage.warning('请选择要处理的数据！');
    let isNull = false;
    reqs.forEach((item) => {
      if (
        !item.newPrice ||
        !item.newSpecialPrice ||
        item.newPrice * 1 <= 0 ||
        item.newSpecialPrice * 1 <= 0
      ) {
        isNull = true;
      }
    });
    if (isNull) {
      return ElMessage.warning('新原价和新促销价必填且值必须>0！');
    }
    reqs.forEach((item) => {
      item.result = null;
    });
    try {
      const { code } = await updatePriceAndPromotionPriceApi(reqs);
      if (code == '0000') {
        reqs.forEach((item) => {
          item.result = '提交成功';
        });
      }
      // const { data } = await updatePriceAndPromotionPriceApi(reqs);
      // ElMessage.success('已进入执行队列');
      // if (darazModifyPriceTimestamp.value) {
      //   window.clearInterval(darazModifyPriceTimestamp.value);
      // }
      // darazModifyPriceTimestamp.value = window.setInterval(async () => {
      //   let res = await getResultByBatchNoApi({
      //     batchNo: data
      //   });
      //   if (res.data && JSON.stringify(res.data) != '{}') {
      //     reqs.forEach((item) => {
      //       item.result = res.data[`${data}_${item.itemId}${item.skuId}`];
      //     });
      //     window.clearInterval(darazModifyPriceTimestamp.value);
      //   }
      // }, 2000);
    } catch (err) {
      //   reqs.forEach((item) => {
      //     item.result = '提交队列失败';
      //   });
      //   ElMessage.error('提交队列失败');
    }
  };
  // #endregion 操作
  //   一键应用
  const apply = () => {
    const reqs = tableRef.value.getCheckboxRecords();
    if (!formData.value.input1 || formData.value.input1 == '') {
      ElMessage.warning('请输入数据');
      return false;
    }
    if (reqs.length == 0) {
      ElMessage.warning('请选择要处理的数据');
      return false;
    }
    // oldPrice	当前原价
    // newPrice	新原价
    // oldSpecialPrice	当前促销价
    // newSpecialPrice	新促销价
    // sel2====>0：当前促销价；1：当前原价； 2：新促销价；3：新原价
    let priceType = [
      'oldSpecialPrice',
      'oldPrice',
      'newSpecialPrice',
      'newPrice'
    ];
    let modifyType = ['newSpecialPrice', 'newPrice'];
    // sel1====>0：新促销价=；1：新原价=
    // sel3====>0：+；1：-； 2：*；3：/
    if (formData.value.sel2) {
      reqs.forEach((item) => {
        if (formData.value.sel3 == 0) {
          item[modifyType[formData.value.sel1]] = (
            item[priceType[formData.value.sel2]] * 1 +
            formData.value.input1 * 1
          ).toFixed(2);
        } else if (formData.value.sel3 == 1) {
          item[modifyType[formData.value.sel1]] = (
            item[priceType[formData.value.sel2]] * 1 -
            formData.value.input1 * 1
          ).toFixed(2);
        } else if (formData.value.sel3 == 2) {
          item[modifyType[formData.value.sel1]] = (
            item[priceType[formData.value.sel2]] *
            1 *
            formData.value.input1 *
            1
          ).toFixed(2);
        } else if (formData.value.sel3 == 3) {
          item[modifyType[formData.value.sel1]] = (
            (item[priceType[formData.value.sel2]] * 1) /
            (formData.value.input1 * 1)
          ).toFixed(2);
        }
        item['specialDiff'] = (
          (item.newSpecialPrice - item.oldSpecialPrice) /
          item.oldSpecialPrice
        ).toFixed(2);
      });
    } else {
      reqs.forEach((item) => {
        item[modifyType[formData.value.sel1]] = (
          formData.value.input1 * 1
        ).toFixed(2);
        item['specialDiff'] = (
          (item.newSpecialPrice - item.oldSpecialPrice) /
          item.oldSpecialPrice
        ).toFixed(2);
      });
    }
  };
  //   定价
  const fixPrice = async () => {
    const reqs = tableRef.value.getCheckboxRecords();
    if (!formData.value._gross || formData.value._gross == '') {
      ElMessage.warning('请输入数据');
      return false;
    }
    if (reqs.length == 0) {
      ElMessage.warning('请选择要处理的数据');
      return false;
    }
    const { data } = await updatePriceAndPromotionPrice({
      sidList: reqs.map((item) => item.sid),
      gross: formData.value._gross
    });
    reqs.forEach((item) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].sid == item.sid) {
          item.oldPrice = data[i].oldPrice;
          item.oldSpecialPrice = data[i].oldSpecialPrice;
          item.newPrice = data[i].newPrice;
          item.newSpecialPrice = data[i].newSpecialPrice;
          item.specialDiff = data[i].specialDiff;
          return false;
        }
      }
    });
  };

  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: []
  });
  const salersDataCopy = ref([]);
  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };
  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'daraz专员'
    };
    const { data } = await getDepartData(params);
    selectData.departData = data.orgTree;
    selectData.salersData = data.userList;
    salersDataCopy.value = data.userList;
  };
  // 获取店铺信息
  const getStoreList = async () => {
    let params = {
      roleNames: 'daraz专员',
      orgId: formData.value.orgId,
      salePersonId: formData.value.salePersonId,
      platCode: 'daraz'
    };
    const { data } = await getStoreInfo(params);
    selectData.storeData = data;
  };
  const handleNodeClick = (data) => {
    let selectId = data.id;
    selectData.salersData = salersDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
    resetSearch();
    nextTick(() => {
      getStoreList();
    });
  };
  const changeSalers = () => {
    formData.value.storeAcctIdList = [];
    getStoreList();
  };
  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    formData.value.orgId = '';
    resetSearch();
  };
  // 清空销售人员以及店铺
  const resetSearch = () => {
    formData.value.salePersonId = '';
    formData.value.storeAcctIdList = [];
    getStoreList();
  };
  //  部门-销售员-店铺联动 -- end
</script>
<style lang="scss" scoped>
  .w80 {
    width: 80px;
  }
</style>
