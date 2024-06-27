<template>
  <div class="detail_wrapper">
    <el-dialog
      v-model="dialogVisible"
      width="90%"
      :close-on-click-modal="true"
      :align-center="true"
    >
      <template #title>
        <div style="display: flex">
          <div style="font-size: 14px; font-weight: 800">管理活动</div>
          <div
            style="
              font-size: 12px;
              color: #797979;
              margin-left: 20px;
              margin-top: 4px;
            "
          >
            {{ checkRow.storeAcct }}
          </div>
          <div
            style="
              font-size: 12px;
              color: #797979;
              margin-top: 4px;
              margin-left: 20px;
            "
          >
            {{ checkRow.titleEn }}
          </div>
          <div
            style="
              font-size: 12px;
              color: #797979;
              margin-top: 4px;
              margin-left: 20px;
            "
          >
            {{ checkRow.dateStart }}~{{ checkRow.dateEnd }}
          </div>
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item v-if="tabIndex == 0" label="参加类型" prop="addMode">
          <el-select
            v-model="formData.addMode"
            filterable
            clearable
            placeholder="全部类型"
          >
            <el-option label="卖家手动添加" :value="1" />
            <el-option label="OZON自动添加" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tabIndex == 0" prop="canRise">
          <template #label>
            可涨价商品
            <el-tooltip
              effect="dark"
              content="当前折扣价格小于平台最高折扣价格"
              placement="bottom-end"
            >
              <img src="../tips.png" width="18" />
            </el-tooltip>
          </template>
          <el-select
            v-model="formData.canRise"
            filterable
            clearable
            placeholder="全部"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item prop="leftDiscount" class="form_range">
          <el-select
            v-model="formData.discountType"
            filterable
            class="form_left"
          >
            <el-option label="实际促销折扣(%)" :value="1" />
            <el-option label="后台促销折扣(%)" :value="2" />
          </el-select>
          <ZInputNumber
            v-model="formData.leftDiscount"
            :min="0"
            :precision="0"
            clearable
          />
          <span class="range_link">-</span>
          <ZInputNumber
            v-model="formData.rightDiscount"
            :min="0"
            :precision="0"
            clearable
          />
        </el-form-item>
        <el-form-item prop="skuNo">
          <el-select v-model="formData.skuNoType" filterable class="form_left">
            <el-option label="物品号" :value="1" />
            <el-option label="货号" :value="2" />
          </el-select>
          <el-input
            v-model="formData.skuNo"
            clearable
            placeholder="多个逗号隔开"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLayerSearch(formRef)"
            >查询</el-button
          ><el-button @click="handleResetForm(formRef)"
            >清空</el-button
          ></el-form-item
        >
      </el-form>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="已参加" name="first">
          <div style="text-align: right; padding: 0 10px 10px 0">
            <el-button
              type="primary"
              :disabled="!!checkRow.freezeDate"
              @click="batch('edit')"
              >批量编辑</el-button
            >
            <el-button
              type="primary"
              :disabled="!!checkRow.freezeDate"
              @click="batch('del')"
              >批量移除</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane label="可参加" name="second">
          <div style="text-align: right; padding: 0 10px 10px 0">
            <el-button
              type="primary"
              :disabled="!!checkRow.freezeDate"
              @click="batch('add')"
              >批量添加</el-button
            >
          </div>
        </el-tab-pane>
        <vxe-grid
          ref="tableRef"
          v-bind="gridOptions"
          :loading="tableDataLoading"
        >
          <template #image_default="{ row }">
            <ImagePop :src="row.image || ''" />
          </template>
          <template #offerId_default="{ row }">
            <div>{{ row.offerId }}</div>
            <a
              style="color: #409eff"
              :href="'https://ozon.ru/product/' + row.sku"
              target="_blank"
              >{{ row.sku }}</a
            >
          </template>
          <template #name_default="{ row }">
            <div>{{ row.name }}</div>
            <div>{{ row.fullCateName }}</div>
          </template>
          <!-- 折扣前价格/当前价格 -->
          <template #oldPrice_default="{ row }">
            <div style="text-decoration: line-through; color: #797979">
              {{ CURRENCY[checkRow.currency]
              }}{{ (row.oldPrice * 1).toFixed(2) }}
            </div>
            <div>
              {{ CURRENCY[checkRow.currency]
              }}{{ (row.marketingPrice * 1).toFixed(2) }}
            </div>
          </template>
          <!-- 促销价格/实际促销折扣(%) -->
          <template #realDiscount_header>
            促销价格
            <el-tooltip
              effect="dark"
              content="未参加活动的价格"
              placement="bottom-end"
            >
              <img src="../tips.png" width="18" />
            </el-tooltip>
            /实际促销折扣(%)

            <el-tooltip
              effect="dark"
              content="（促销价格-折扣价格）/促销价格*100%"
              placement="bottom-end"
            >
              <img src="../tips.png" width="18" />
            </el-tooltip>
          </template>
          <template #realDiscount_default="{ row }">
            <div>{{ CURRENCY[checkRow.currency] }}{{ row.price }}</div>
            <div>{{ row.realDiscount }}</div>
          </template>
          <!-- 后台促销折扣(%) -->
          <template #discount_header>
            后台促销折扣(%)
            <el-tooltip
              effect="dark"
              content="（当前价格-折扣价格）/当前价格*100%"
              placement="bottom-end"
            >
              <img src="../tips.png" width="18" />
            </el-tooltip>
          </template>
          <template #discount_default="{ row }">
            <div :class="row.discountErr ? 'err' : ''">
              <ZInputNumber
                v-model="row.discount"
                :disabled="checkRow.actionStatus == 2 || !!checkRow.freezeDate"
                :min="0"
                :precision="2"
                clearable
                @blur="changePrice(row, 'discount')"
                @focus="row.minDiscountIsShow = true"
              />
              <div v-if="row.minDiscountIsShow == true" style="color: #797979">
                最低 {{ row.minDiscount }}
              </div>
            </div>
          </template>
          <!-- 折扣价格 -->
          <template #actionPrice_header>
            折扣价格
            <el-tooltip
              effect="dark"
              content="参加活动的价格"
              placement="bottom-end"
            >
              <img src="../tips.png" width="18" />
            </el-tooltip>
          </template>
          <template #actionPrice_default="{ row }">
            <div :class="row.actionPriceErr ? 'err' : ''">
              <span>{{ CURRENCY[checkRow.currency] }}</span>
              <ZInputNumber
                v-model="row.actionPrice"
                style="width: 80%"
                :disabled="checkRow.actionStatus == 2 || !!checkRow.freezeDate"
                :min="0"
                :precision="2"
                clearable
                @blur="changePrice(row, 'actionPrice')"
                @focus="row.maxActionPriceIsShow = true"
              />
              <div
                v-if="row.maxActionPriceIsShow == true"
                style="color: #797979"
              >
                最高 {{ CURRENCY[checkRow.currency] }}{{ row.maxActionPrice }}
              </div>
            </div>
          </template>
          <!-- 促销库存 -->
          <template #stock_default="{ row }">
            <ZInputNumber
              v-model="row.stock"
              :disabled="checkRow.actionStatus == 2 || !!checkRow.freezeDate"
              :min="0"
              :precision="0"
              clearable
              @focus="row.stock == '无限' ? (row.stock = 0) : ''"
              @blur="row.stock == 0 ? (row.stock = '无限') : ''"
            />
          </template>
          <template #toolbar_default="{ row }">
            <el-link
              type="primary"
              :disabled="checkRow.actionStatus == 2 || !!checkRow.freezeDate"
              @click="handleSave('', row)"
              >{{ tabIndex == 0 ? '编辑' : '添加' }}</el-link
            >
            <div v-if="tabIndex == 0">
              <el-link
                type="primary"
                :disabled="checkRow.actionStatus == 2 || !!checkRow.freezeDate"
                @click="handleDelRule('', row)"
                >移除</el-link
              >
            </div>
          </template>
        </vxe-grid>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="paginationData.page"
            v-model:page-size="paginationData.limit"
            background
            :page-sizes="[200, 300, 500]"
            :small="true"
            layout="total, sizes, prev, pager, next"
            :total="paginationData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tabs>
    </el-dialog>
  </div>

  <el-dialog
    v-model="resDialog"
    :width="700"
    title="结果详情"
    :close-on-click-modal="true"
    :align-center="true"
  >
    <div style="display: flex; justify-content: space-between; margin: 10px 0">
      <span>操作成功：{{ resDialogData.successNum }}个</span>
      <span>操作失败：{{ resDialogData.failNum }}个</span>
      <a style="color: #409eff; cursor: pointer" @click="exportErr"
        >下载失败详情</a
      >
    </div>
    <el-table :data="resDialogData.failResults" border max-height="500">
      <el-table-column prop="sku" label="失败物品号" />
      <el-table-column prop="reason" label="失败原因" />
    </el-table>
  </el-dialog>
</template>

<script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { LAYER_COLS, CURRENCY } from '../config';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    batchActivateActionProd,
    batchDeactivateActionProd,
    queryActionProdApi
  } from '@/api/publishs/ozonactivity';
  import { transBlob } from '@/utils/downloadFile';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    tabName: {
      type: String,
      default: ''
    },
    checkRow: {
      type: Object,
      default: () => {}
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue'
    // 'handleSearch',
  ]);

  const activeName = ref('first');

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const formRef = ref();
  const formData = ref({
    skuNoType: 1,
    discountType: 1
  });

  onMounted(async () => {
    activeName.value = props.tabName;
    let nameIndex = { first: 0, second: 1 };
    tabIndex.value = nameIndex[props.tabName];
    handleLayerSearch();
  });

  const tableRef = ref();
  // 切换 tab
  const tabIndex = ref(0);
  const handleClick = (tab) => {
    if (tabIndex.value !== tab.index) {
      // 不是同一个tab
    }
    tabIndex.value = tab.index;
    handleLayerSearch();
  };
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 330;
  });
  const gridOptions = reactive({
    border: true,
    height: height,
    showHeaderOverflow: true,
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
    columns: LAYER_COLS,
    data: []
    // toolbarConfig: {
    //   custom: true
    // }
  });
  const paginationData = reactive({
    total: 0,
    limit: 200,
    page: 1
  });

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleLayerSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleLayerSearch();
  };

  const tableDataLoading = ref(false);
  const handleLayerSearch = async () => {
    const { limit, page } = paginationData;
    let joined;
    if (tabIndex.value == 0) {
      joined = true;
    } else if (tabIndex.value == 1) {
      joined = false;
    }
    tableDataLoading.value = true;
    try {
      const { data, count } = await queryActionProdApi({
        ...formData.value,
        limit,
        page,
        storeAcctId: props.checkRow.storeAcctId,
        actionId: props.checkRow.actionId,
        joined
      });
      data.forEach((item) => (item.stock == 0 ? (item.stock = '无限') : ''));

      if (joined == false) {
        // 可参加
        data.forEach((item) => {
          item.actionPrice = item.maxActionPrice;
          item.discount = item.minDiscount;
        });
      }
      gridOptions.data = data;
      paginationData.total = count;
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
    } finally {
      tableDataLoading.value = false;
    }
  };
  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.value.rightDiscount = '';
  };

  // 添加&编辑
  const handleSave = async (type, data) => {
    let arr = [];
    if (type == 'bat') {
      arr = data.map((item) => {
        item.stock = item.stock == '无限' ? 0 : item.stock;
        return item;
      });
    } else {
      // 促销库存字段，修改接口传参和展示的不一样
      data.stock = data.stock == '无限' ? 0 : data.stock;
      arr = [data];
      // 后台促销折扣
      let isErr;
      if (data.discount * 1 < data.minDiscount * 1) {
        data.discountErr = true;
        isErr = true;
      } else {
        data.discountErr = false;
      }
      //折扣价格
      if (data.actionPrice * 1 > data.maxActionPrice * 1) {
        data.actionPriceErr = true;
        isErr = true;
      } else {
        data.actionPriceErr = false;
      }
      if (isErr) {
        return ElMessage.warning('填写数值不符合条件，请参照提示修改');
      }
    }
    try {
      const { msg, code, data } = await batchActivateActionProd(
        props.checkRow.storeAcctId,
        {
          actionId: props.checkRow.actionId,
          products: arr
        }
      );
      if (code == '0000') {
        if (data.failNum == 0) {
          ElMessage.success(msg);
        } else {
          if (type == 'bat') {
            // 批量
            resDialog.value = true;
            resDialogData.value = data;
          } else {
            // 单个
            ElMessage.error(data.failResults[0]?.reason);
          }
        }
        handleLayerSearch();
      }
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // 删除
  let resDialog = ref(false);
  let resDialogData = ref({});
  const handleDelRule = async (type, data) => {
    let len = 1,
      arr = [];
    if (type == 'bat') {
      len = data.length;
      arr = data.map((item) => item.productId);
    } else {
      arr = [data.productId];
    }
    await ElMessageBox.confirm(
      `是否移除${len}个商品，该操作执行后不可恢复`,
      '确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        dangerouslyUseHTMLString: true,
        icon: 'WarningFilled'
      }
    );
    try {
      let formData = new FormData();
      formData.append('storeAcctId', props.checkRow.storeAcctId);
      formData.append('actionId', props.checkRow.actionId);
      formData.append('productIds', arr);
      const { msg, code, data } = await batchDeactivateActionProd(formData);
      if (code == '0000') {
        if (data.failNum == 0) {
          ElMessage.success(msg);
        } else {
          if (type == 'bat') {
            // 批量
            resDialog.value = true;
            resDialogData.value = data;
          } else {
            // 单个
            ElMessage.error(data.failResults[0]?.reason);
          }
        }
      }
      handleLayerSearch();
    } catch (err) {
      console.log(err);
    }
  };

  // 批量操作
  const batch = async (type) => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (checkedList.length == 0) {
      ElMessage.warning('请选择商品');
      return;
    }
    // 校验
    let isErr;
    checkedList.forEach((item) => {
      // 后台促销折扣
      if (item.discount * 1 < item.minDiscount * 1) {
        item.discountErr = true;
        isErr = true;
      } else {
        item.discountErr = false;
      }
      //折扣价格
      if (item.actionPrice * 1 > item.maxActionPrice * 1) {
        item.actionPriceErr = true;
        isErr = true;
      } else {
        item.actionPriceErr = false;
      }
    });

    if (type == 'add') {
      if (isErr == true) {
        return ElMessage.warning('填写数值不符合条件，请参照提示修改');
      }
      handleSave('bat', checkedList);
    } else if (type == 'edit') {
      if (isErr == true) {
        return ElMessage.warning('填写数值不符合条件，请参照提示修改');
      }
      handleSave('bat', checkedList);
    } else if (type == 'del') {
      handleDelRule('bat', checkedList);
    }
  };

  const changePrice = (row, type) => {
    let obj = {
      discount: 'minDiscountIsShow',
      actionPrice: 'maxActionPriceIsShow'
    };
    row[obj[type]] = false;
    // 后台促销折扣 = （当前价格-促销价格）/当前价格*100%
    // discount = (marketingPrice - actionPrice) / marketingPrice;
    // 实际促销折扣 =（促销价格-折扣价格）/促销价格*100%
    // realDiscount = (price - actionPrice) / price;
    // oldPrice折扣前价格;
    // marketingPrice当前价格;
    // price促销价格
    // realDiscount实际促销折扣
    // discount后台促销折扣;
    // actionPrice折扣价格;

    if (type == 'discount') {
      row.actionPrice = (
        row.marketingPrice * 1 -
        row.marketingPrice * (row.discount / 100)
      ).toFixed(2);
    } else if (type == 'actionPrice') {
      row.discount = (
        ((row.marketingPrice - row.actionPrice) / row.marketingPrice) *
        100
      ).toFixed(2);
    }
    row.realDiscount = (
      ((row.price - row.actionPrice) / row.price) *
      100
    ).toFixed(2);
  };

  // 下载失败详情
  const exportErr = () => {
    let form = new FormData();
    form.append('batchNo', resDialogData.value.batchNo);
    transBlob({
      url: '/lms/ozon/action/exportFailProducts',
      contentType: 'application/x-www-form-urlencoded',
      data: form,
      fileName: '失败详情.xls'
    }).finally(() => {
      // ElMessage.success('下载成功');
    });
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
