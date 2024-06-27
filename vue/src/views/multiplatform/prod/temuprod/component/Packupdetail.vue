<!-- eslint-disable vue/no-template-shadow -->
<template>
  <el-dialog
    v-model="showPackup"
    title="申请备货"
    width="70%"
    class="roll-dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form class="packup" :inline="true" size="default">
      <el-row>
        <el-form-item class="input_width" label="销售备注">
          <el-input
            v-model="formData.salesRemark"
            type="textarea"
            placeholder="请输入销售备注"
          ></el-input>
        </el-form-item>
      </el-row>
    </el-form>

    <!-- v-for index in 1 用于ref获取嵌套子表格时，获取的格式为一个数组 不可删 -->
    <div v-for="index in 1" :key="index">
      <!-- 包装列表数据 -->
      <vxe-table
        ref="tableListRef"
        v-loading="loading"
        :data="dataArr"
        :align="'center'"
        auto-resize
        border
      >
        <vxe-column type="checkbox" width="50" />
        <vxe-column title="标题/SKC" width="180">
          <template #default="{ row }">
            <div>{{ row.productName }}</div>
            <div>SKC货号：{{ row.sellerSkcCode || '-' }}</div>
            <div>SKCID：{{ row.sellerSkc || '-' }}</div>
          </template>
        </vxe-column>
        <vxe-column>
          <template #header>
            <div style="display: flex">
              <div style="width: 100px">图片</div>
              <div style="width: 160px">SKU</div>
              <div style="width: 120px">开发专员</div>
              <div style="width: 120px">申报价格</div>
              <div style="width: 120px">建议备货量</div>
              <div style="width: 120px">
                <div><Edit style="width: 14px; height: 14px" /> 备货量</div>
                <div>
                  <el-button link type="primary" @click="showUpdate"
                    >批量</el-button
                  >
                </div>
              </div>
              <div style="width: 100px">包装备注</div>
              <div style="width: 80px">操作</div>
            </div>
          </template>
          <template #default="{ row }">
            <vxe-table
              ref="innerTable"
              :data="row.subDtoList"
              :footer-method="
                row.subDtoList.length > 0 ? footerMethod : () => {}
              "
              :show-header="false"
              show-footer
              @cell-dblclick="handleCellDblClick"
            >
              <vxe-column title="图片" width="100">
                <template #default="{ row }">
                  <el-popover
                    placement="right"
                    width="500px"
                    :hide-after="0"
                    trigger="hover"
                  >
                    <template #default>
                      <el-image :src="row.image || ''" />
                    </template>
                    <template #reference>
                      <el-image
                        v-if="row.image"
                        loading="lazy"
                        :src="row.image || ''"
                      />
                    </template>
                  </el-popover>
                </template>
              </vxe-column>
              <vxe-column title="SKU" width="160">
                <template #default="{ row }">
                  <div>店铺：{{ row.sellerSkuCode }}</div>
                  <div>商品：{{ row.prodSSku }}</div>
                  <div>条码：{{ row.printCode }}</div>
                </template>
              </vxe-column>

              <vxe-column
                field="bizzOwner"
                title="开发专员"
                width="120"
              ></vxe-column>
              <vxe-column field="supplierPrice" title="申报价格" width="120">
                <template #default="{ row }">
                  <div
                    :style="
                      row.storeCurrency !== 'CNY' ? 'margin-left: 10px' : ''
                    "
                  >
                    <span v-if="row.storeCurrency === 'CNY'">*</span
                    ><span>￥</span>{{ row.supplierPrice }}
                  </div>
                  <div
                    :style="
                      row.storeCurrency !== 'USD' ? 'margin-left: 10px' : ''
                    "
                  >
                    <span v-if="row.storeCurrency === 'USD'">*</span
                    ><span>$ </span>{{ row.supplierPriceUsd }}
                  </div>
                </template>
              </vxe-column>
              <vxe-column
                title="建议备货量"
                width="120"
                field="adviceQuantity"
              ></vxe-column>
              <vxe-column width="120" field="lastPurchaseQuantity">
                <template #header>
                  备货量
                  <div>
                    <el-button link type="primary" @click="showUpdate"
                      >批量</el-button
                    >
                  </div>
                </template>
                <template #default="{ row }">
                  <el-input
                    v-if="row.isShowInput"
                    ref="lastPurchaseQuantityInputRef"
                    v-model="row.lastPurchaseQuantityInput"
                    type="number"
                    :row="2"
                    :min="0"
                    autofocus
                    @blur="changeQuantityNum(row)"
                  />
                  <span v-else>{{ row.lastPurchaseQuantity }}</span>
                </template>
              </vxe-column>
              <vxe-column
                field="packDesc"
                title="包装备注"
                width="100"
              ></vxe-column>
              <vxe-column title="操作">
                <template #default="{ row }">
                  <el-popconfirm
                    title="确定要删除吗？"
                    @confirm="handleDelete(row)"
                  >
                    <template #reference>
                      <el-button type="danger">删除</el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </vxe-column>
            </vxe-table>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleSave">申请备货</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 修改计划数量弹窗 -->
  <el-dialog
    v-model="showUpdateQuantity"
    title="修改备货量"
    width="30%"
    :close-on-click-modal="false"
    @close="handleCloseUpdate"
  >
    <el-input v-model="planQuantityNumber" type="number"></el-input
    >（直接修改所有备货量）
    <template #footer>
      <span>
        <el-button type="primary" @click="handleSubmitUpdate">确定</el-button>
        <el-button @click="handleCloseUpdate">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import {
    defineProps,
    ref,
    defineEmits,
    computed,
    reactive,
    nextTick
  } from 'vue';
  import { applyQuantity } from '@/api/multiplatform/temuprod';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    // 是否显示弹窗
    isVisible: {
      type: Boolean,
      default: false
    },
    dataArr: {
      type: Array,
      default: () => []
    },
    // 收获地址列表
    addressList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['close', 'submit']);
  const formData = reactive({
    salesRemark: '' // 销售备注
  });

  // const tableList = ref([]);
  const loading = ref(false);
  const showPackup = computed(() => {
    return props.isVisible;
  });

  // 表尾计算 返回一个 二维数组
  const footerMethod = (val) => {
    let arr = ['合计', '-', '-', '-'];
    let adviceQuantityArr = computedQuantityTotal(val, 'adviceQuantity');
    let quantityArr = computedQuantityTotal(val, 'lastPurchaseQuantity');
    return [arr.concat(adviceQuantityArr).concat(quantityArr).concat('-')];
  };

  // 计算总数量
  const computedQuantityTotal = (val, type) => {
    let total = 0;
    val.data.forEach((item) => {
      total += Number(item[type] || 0);
    });
    return total;
  };
  const tableIndex = ref('');

  const lastPurchaseQuantityInputRef = ref(null);

  // 双击单元格
  const handleCellDblClick = (params) => {
    const { row, column } = params;
    // 判断点击的单元格是不是lastPurchaseQuantity
    if (column.field === 'lastPurchaseQuantity') {
      row.isShowInput = true;
      nextTick(() => {
        lastPurchaseQuantityInputRef.value.forEach((dom) => {
          dom.focus();
        });
      });
    } else {
      row.isShowInput = false;
    }
  };

  // 动态设置数量
  const changeQuantityNum = (row) => {
    // 判断有没有修改
    if (row.lastPurchaseQuantity !== row.lastPurchaseQuantityInput) {
      row.lastPurchaseQuantity = row.lastPurchaseQuantityInput;
    }
    if (row.lastPurchaseQuantityInput < 0) {
      row.lastPurchaseQuantityInput = row.lastPurchaseQuantity = 0;
    }
    row.isShowInput = false;
    props.dataArr.forEach((item, index) => {
      if (row.sellerSkc === item.sellerSkc) {
        tableIndex.value = index;
      }
    });
    // 手动更新表尾合计数量
    updateFooterEvent();
  };
  const innerTable = ref();
  // 在值发生改变时更新表尾合计
  const updateFooterEvent = () => {
    const $table = innerTable.value[tableIndex.value];
    $table.updateFooter();
  };

  const tableListRef = ref();
  // 删除货件计划
  const handleDelete = async (row) => {
    props.dataArr.forEach((item, index) => {
      if (row.sellerSkc === item.sellerSkc) {
        tableIndex.value = index;
      }
    });
    const $table = innerTable.value[tableIndex.value];
    let data = props.dataArr[tableIndex.value];
    data.subDtoList.splice($table.getRowIndex(row), 1);
    $table.remove(row);
    ElMessage.success('删除成功!');
  };

  // 关闭包装弹窗
  const handleClose = () => {
    formData.salesRemark = ''; // 销售备注
    emits('close');
  };

  // 保存弹窗页面
  const handleSave = async () => {
    let selected = tableListRef.value[0].getCheckboxRecords();
    if (selected.length === 0) {
      return ElMessage.warning('请选择一条数据');
    }
    let selectedRecord = [];
    selected.forEach((item) => {
      selectedRecord = selectedRecord.concat(item.subDtoList);
    });
    selectedRecord.forEach((item) => {
      item.saleDesc = formData.salesRemark;
    });
    let isValid = selectedRecord.every((item) => {
      return (
        item.lastPurchaseQuantity % 1 === 0 &&
        Number(item.lastPurchaseQuantity) > 0
      );
    });
    if (!isValid) {
      return ElMessage.warning('备货量必须为一个正整数');
    }
    try {
      const { code, msg } = await applyQuantity(selectedRecord);
      if (code === '0000') {
        ElMessage.success(msg || '申请备货成功！');
      } else {
        ElMessage.error(msg || '申请备货失败！');
      }
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const showUpdateQuantity = ref(false); // 批量修改计划数量
  const planQuantityNumber = ref('');
  const showUpdate = () => {
    showUpdateQuantity.value = true;
  };

  // 批量设置计划数量
  const handleSubmitUpdate = () => {
    if (Number(planQuantityNumber.value) <= 0)
      return ElMessage.warning('备货量需要大于0！');
    props.dataArr.forEach((item) => {
      item.subDtoList.forEach((cItem) => {
        cItem.lastPurchaseQuantity = planQuantityNumber.value;
      });
    });
    handleCloseUpdate();
    innerTable.value &&
      innerTable.value.forEach((item) => {
        item.updateFooter();
      });
  };

  const handleCloseUpdate = () => {
    showUpdateQuantity.value = false;
    planQuantityNumber.value = '';
  };
</script>

<style lang="scss" scoped>
  .input_width {
    margin-right: 5px !important;
    width: 550px;
  }
  .combination_sku {
    display: inline-block;
    width: 22px;
    height: 22px;
    background: rgb(64, 158, 255);
    line-height: 22px;
    text-align: center;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
  }
  :deep(.is_required) {
    .el-form-item__label::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
</style>
<style lang="scss">
  .roll-dialog {
    margin-top: 100px;
    .el-dialog__body {
      overflow-y: auto;
      max-height: 600px;
    }
  }
</style>
