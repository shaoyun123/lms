<template>
  <div class="cancel_order app-container">
    <!-- 数据筛选 start -->
    <el-card class="common_split_bottom search_card">
      <el-form :model="formData" class="search_form" :inline="true">
        <el-row>
          <el-form-item label="采购专员">
            <el-select
              v-model="formData.buyerId"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in state.purchasUser"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="整合专员">
            <el-select
              v-model="formData.integratorId"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in state.conformUser"
                :key="item.id"
                bus
                :label="item.userName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开发专员">
            <el-select
              v-model="formData.bizzOwnerId"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in state.developUser"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品状态">
            <el-select
              v-model="formData.isSale"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option label="停售" value="0"></el-option>
              <el-option label="在售" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="skuType"
              placeholder="请选择"
              class="form_left"
              clearable
              filterable
            >
              <el-option label="子SKU模糊" value="1"></el-option>
              <el-option label="子SKU精确" value="2"></el-option>
              <el-option label="父SKU模糊" value="3"></el-option>
              <el-option label="父SKU精确" value="4"></el-option>
            </el-select>
            <el-input
              v-model="skuText"
              placeholder="多个时用逗号隔开"
              class="form_right"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="处理备注">
            <el-input
              v-model="formData.dealRemark"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="处理状态">
            <el-select
              v-model="formData.dealStatus"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option value="0" label="未处理"></el-option>
              <el-option value="1" label="已处理"></el-option>
              <el-option value="2" label="无需处理"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-select v-model="timeType" class="form_left">
              <el-option value="1" label="创建时间" />
              <el-option value="2" label="处理时间" />
            </el-select>
            <el-date-picker
              v-model="formData.time"
              value-format="YYYY-MM-DD"
              type="daterange"
              :shortcuts="shortcuts"
              unlink-panels
              class="form_right"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="searchLoading"
              @click="handleQuery"
              >搜索</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <!-- 数据筛选 end -->

    <el-card class="common_split_bottom list_card">
      <div class="card-tool">
        <el-button type="primary" @click="viewOrder('multi')"
          >批量处理</el-button
        >
        <div class="search_form">
          <span>取消数量>=</span
          ><el-input v-model="cancelNum" type="number" :min="1"></el-input>
          <span>或取消金额（￥）>=</span>
          <el-input v-model="cancelPrice" placeholder="请输入"></el-input>
          <el-button
            v-permission="['cancelOrderSaveBtn']"
            type="primary"
            :loading="saveLoading"
            @click="saveSetting"
            >保存</el-button
          >
        </div>
      </div>

      <!-- 数据列表展示 -->
      <vxe-table
        ref="table"
        :height="height"
        :scroll-y="{ gt: 10 }"
        :data="cancelOrderList"
        :show-overflow="true"
        :align="'center'"
        border
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column title="图片">
          <template #default="{ row }">
            <ImagePop :src="row.image || ''" />
          </template>
        </vxe-column>
        <vxe-column title="SKU">
          <template #default="{ row }">
            <div>
              {{ row.sku }}
              <span v-if="row.isSale === 0" class="stop_sku">停</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="title" title="商品名称"></vxe-column>
        <vxe-column title="人员">
          <template #default="{ row }">
            <div>采购：{{ row.buyer }}</div>
            <div>整合：{{ row.integrator }}</div>
            <div>开发：{{ row.bizzOwner }}</div>
          </template>
        </vxe-column>
        <vxe-column
          field="purchaseCostPrice"
          title="采购单价（￥）"
        ></vxe-column>
        <vxe-column title="库存">
          <template #default="{ row }">
            <div>预计可用：{{ row.preAvailableStock }}</div>
            <div>未入库数：{{ row.onWayStock }}</div>
            <div>采购未审核：{{ row.purOrderUnAuditNum }}</div>
          </template>
        </vxe-column>
        <vxe-column title="销量">
          <template #default="{ row }">
            <div>日均：{{ row.dailySalesNum }}</div>
            <div>7天：{{ row.sevenSales }}</div>
            <div>15天：{{ row.fifteenSales }}</div>
            <div>30天：{{ row.thirtySales }}</div>
          </template>
        </vxe-column>
        <vxe-column title="是否长销款">
          <template #default="{ row }">
            <div>
              {{ getSale(row.ifStableSale) }}
            </div>
          </template>
        </vxe-column>
        <vxe-column field="safeStock" title="安全库存"></vxe-column>
        <vxe-column field="cancelPercent" title="取消数量/占比">
          <template #default="{ row }">
            <div>
              {{ row.cancelNum }} / (
              {{ (row.cancelPercent * 1).toFixed() + '%' }})
            </div>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间">
          <template #default="{ row }">
            {{ transferDate(row.createTime, false) }}
          </template>
        </vxe-column>
        <vxe-column title="处理结果">
          <template #default="{ row }">
            <div>结果：{{ getResult(row.dealStatus) }}</div>
            <div>备注：{{ row.dealRemark }}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewOrder('single', row)"
              >处理</el-button
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

    <!-- 处理订单 弹窗 -->
    <el-dialog
      v-model="isShowHandle"
      :title="title"
      width="30%"
      :close-on-click-modal="false"
      @close="handleCloseOrder"
    >
      <el-form
        ref="formRef"
        class="label_width"
        :model="handleForm"
        :rules="formRules"
      >
        <el-form-item label="处理结果" size="defalut" prop="detailStatus">
          <el-radio-group v-model="handleForm.detailStatus" class="ml-4">
            <el-radio value="0">未处理</el-radio>
            <el-radio value="1">已处理</el-radio>
            <el-radio value="2">无需处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" size="defalut">
          <el-input
            v-model="handleForm.detailRemark"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button
            type="primary"
            :loading="handleLoading"
            @click="handleSaveOrder(formRef)"
            >保存</el-button
          >
          <el-button @click="handleCloseOrder">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="purchasepurchasecancelorder">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { ref, reactive, onMounted, computed } from 'vue';
  import {
    getAssignUser,
    getCancelOrder,
    settingParams,
    getSettingParams,
    handleCancelOrder
  } from '@/api/purchase/cancelorder';
  import { ElMessage } from 'element-plus';
  import { transferDate } from '@/utils/common';
  import { shortcuts } from '@/api/common';

  const formData = reactive({
    buyerId: '', // 采购专员
    bizzOwnerId: '', // 整合专员
    integratorId: '', // 开发人员
    isSale: '', // 商品状态
    sku: '', // 子sku模糊
    detailSku: '', // 子sku精确
    pSku: '', // 父sku模糊
    detailPSku: '', // 父sku精确
    dealRemark: '', // 备注
    dealStatus: '', // 处理状态
    time: [],
    startTime: '',
    endTime: '',
    dealStartTime: '',
    dealEndTime: ''
  });

  const skuText = ref(); // sku 查找内容
  const skuType = ref('1'); // sku 筛选类型
  const timeType = ref('1'); // 创建时间 处理时间

  const paginationData = reactive({
    page: 1,
    limit: 50,
    total: 0 // 取消采购数据总条数
  });
  const cancelOrderList = ref([]); // 取消采购数据

  // 是否显示批量处理弹窗
  const isShowHandle = ref(false);
  const title = ref('批量处理');

  // 按钮 loading
  const searchLoading = ref(false);
  const saveLoading = ref(false);
  const handleLoading = ref(false);

  const state = reactive({
    purchasUser: [], // 采购专员
    conformUser: [], // 整合专员
    developUser: [] // 开发专员
  });

  // 批量处理表单
  const handleForm = reactive({
    detailStatus: '', // 处理结果
    detailRemark: '' // 处理备注
  });

  const formRef = ref(null);
  const formRules = reactive({
    detailStatus: [
      { required: true, message: '请选择处理结果', trigger: 'change' }
    ]
  });

  onMounted(() => {
    getAssignUserList(1);
    getAssignUserList(2);
    getAssignUserList(3);
    getCancelOrderList();
    querySetting();
  });

  // 获取采购专员1 整合专员2 开发专员3 数据
  const getAssignUserList = async (type) => {
    try {
      const { code, data } = await getAssignUser({ type: type });
      if (code === '0000') {
        let result = data.filter((item) => item.userName !== '');
        if (type === 1) {
          state.purchasUser = result;
        }
        if (type === 2) {
          state.conformUser = result;
        }
        if (type === 3) {
          state.developUser = result;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取取消订单列表
  const getCancelOrderList = async () => {
    handleSkuSearch();
    getTime();
    formData.page = paginationData.page;
    formData.limit = paginationData.limit;
    try {
      const { code, data, count } = await getCancelOrder(formData);
      if (code === '0000') {
        cancelOrderList.value = data;
        paginationData.total = count;
      }
      searchLoading.value = false;
    } catch (err) {
      console.log(err);
      searchLoading.value = false;
    }
  };

  // 时间类型
  const getTime = () => {
    formData.startTime = '';
    formData.endTime = '';
    formData.dealStartTime = '';
    formData.dealEndTime = '';
    if (timeType.value === '1' && formData.time) {
      formData.startTime = formData.time[0];
      formData.endTime = formData.time[1];
    }
    if (timeType.value === '2' && formData.time) {
      formData.dealStartTime = formData.time[0];
      formData.dealEndTime = formData.time[1];
    }
  };

  // 父子 sku 查询
  const handleSkuSearch = () => {
    formData.sku = '';
    formData.detailSku = '';
    formData.pSku = '';
    formData.detailPSku = '';
    if (skuType.value === '1') {
      formData.sku = skuText.value;
    }
    if (skuType.value === '2') {
      formData.detailSku = skuText.value;
    }
    if (skuType.value === '3') {
      formData.pSku = skuText.value;
    }
    if (skuType.value === '4') {
      formData.detailPSku = skuText.value;
    }
  };

  // 查询列表
  const handleQuery = () => {
    searchLoading.value = true;
    getCancelOrderList();
  };

  const table = ref(null);
  const selectIds = ref([]); // 批量选中的数据 id 列表

  // 显示处理弹窗
  const viewOrder = (type, row) => {
    // 清空之前选择的数据
    handleForm.detailStatus = '';
    handleForm.detailRemark = '';
    if (type === 'multi') {
      // 获取表格多选数据
      const $table = table.value;
      const selectRecords = $table.getCheckboxRecords();
      if (selectRecords.length === 0) {
        ElMessage.warning('请选择要处理的数据！');
        return;
      }
      title.value = '批量处理';
      selectIds.value = selectRecords.map((item) => item.id);
    } else if (type === 'single') {
      title.value = '处理';
      selectIds.value = [row.id];
    }
    isShowHandle.value = true;
    formRef.value.clearValidate();
  };

  // 保存处理订单
  const handleSaveOrder = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          handleLoading.value = true;
          handleForm.id = selectIds.value;
          const { code } = await handleCancelOrder(handleForm);
          if (code === '0000') {
            ElMessage.success('处理成功！');
            handleCloseOrder();
            getCancelOrderList();
          }
          handleLoading.value = false;
        } catch (err) {
          console.log(err);
          handleCloseOrder();
          getCancelOrderList();
          handleLoading.value = false;
        }
      }
    });
  };

  // 关闭订单处理
  const handleCloseOrder = () => {
    isShowHandle.value = false;
  };

  const cancelNum = ref(null); // 取消订单数量
  const cancelPrice = ref(''); // 取消订单金额

  // 保存参数配置
  const saveSetting = async () => {
    try {
      // 校验保存参数
      let priceReg = /^(([1-9]\d*|0)\.([0-9]{1,2})$)|^([1-9]\d*|0)$/; // 整数 + 小数
      let numReg = /^[1-9]\d*|0$/; // 整数
      if (!numReg.test(cancelNum.value)) {
        ElMessage.warning('取消数量格式输入错误');
        return;
      }
      if (!priceReg.test(cancelPrice.value)) {
        ElMessage.warning('取消金额格式输入错误');
        return;
      }
      let params = {
        num: parseInt(cancelNum.value),
        price: parseFloat(cancelPrice.value)
      };
      saveLoading.value = true;
      const { code } = await settingParams(params);
      if (code === '0000') {
        ElMessage.success('保存成功！');
        querySetting();
      }
      saveLoading.value = false;
    } catch (err) {
      saveLoading.value = false;
      console.log(err);
    }
  };

  // 查询参数配置
  const querySetting = async () => {
    try {
      const { code, data } = await getSettingParams();
      if (code === '0000') {
        cancelNum.value = data.num;
        cancelPrice.value = data.price;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getResult = (status) => {
    if (status === 0) {
      return '未处理';
    }
    if (status === 1) {
      return '已处理';
    }
    if (status === 2) {
      return '无需处理';
    }
  };

  const getSale = (status) => {
    return status === 1 ? '是' : status === 0 ? '否' : '';
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    getCancelOrderList();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    getCancelOrderList();
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 250;
  });
</script>

<style lang="scss" scoped>
  .card-tool {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    span {
      padding: 0 10px;
      font-size: 12px;
    }
    .el-button {
      margin-left: 10px;
    }
  }
  .label_width {
    :deep {
      .el-form-item .el-form-item__label {
        width: 80px;
      }
    }
  }
  .cancel_order {
    .input_width {
      :deep {
        .el-select.el-select--small,
        .el-input.el-input--small {
          width: 80px !important;
        }
      }
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
  .stop_sku {
    display: inline-block;
    width: 22px;
    height: 22px;
    background: rgb(245, 108, 108);
    line-height: 22px;
    text-align: center;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
  }
  /*vxe-table 自定义行高 */
  :deep(
      .vxe-table--render-default.size--mini
        .vxe-body--column.col--ellipsis
        > .vxe-cell
    ) {
    padding: 7px 0;
    max-height: fit-content;
    text-overflow: ellipsis;
    white-space: break-spaces;
  }
</style>
