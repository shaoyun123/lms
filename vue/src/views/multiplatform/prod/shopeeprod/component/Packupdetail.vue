<template>
  <el-dialog
    v-model="showPackup"
    title="货件计划-创建"
    width="70%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" class="packup" :inline="true">
      <el-row>
        <el-form-item
          label="货件编号"
          size="default"
          prop="shipmentId"
          class="is_required"
        >
          <el-input
            v-model="formData.shipmentId"
            placeholder="请输入货件编号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="收件地址简称"
          size="default"
          prop="shortNameOfReceiveAddressId"
          class="is_required"
        >
          <el-select v-model="formData.shortNameOfReceiveAddressId">
            <el-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.alias"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          class="input_width"
          label="销售备注"
          size="default"
          prop="salesRemark"
        >
          <el-input
            v-model="formData.salesRemark"
            placeholder="请输入销售备注"
          ></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="新增商品" size="default" prop="printCodeList">
          <el-input
            v-model="formData.printCodeList"
            placeholder="请输入打印条码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAddSku">新增</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <!-- 包装列表数据 -->
    <vxe-table
      ref="tableListRef"
      v-loading="loading"
      :edit-config="{
        trigger: 'click',
        mode: 'cell'
      }"
      :data="shipmentList"
      auto-resize
      border
    >
      <vxe-column title="图片" width="120">
        <template #default="{ row }">
          <el-popover
            placement="right"
            width="500px"
            :hide-after="0"
            trigger="hover"
          >
            <template #default>
              <el-image :src="row.prodImage || ''" />
            </template>
            <template #reference>
              <el-image
                v-if="row.prodImage"
                loading="lazy"
                :src="row.prodImage + '!size=80x80' || ''"
              />
            </template>
          </el-popover>
        </template>
      </vxe-column>
      <vxe-column title="SKU">
        <template #default="{ row }">
          <div>
            店铺子SKU：{{ row.variSku }}
            <span v-if="row.isSellMultiple" class="tag_sku">多</span
            ><span v-if="!row.isSale" class="tag_sku">停</span>
          </div>
          <div>商品子SKU：{{ row.prodSSku }}</div>
          <div>item_id：{{ row.itemId }}</div>
          <div>vari_id：{{ row.variId }}</div>
          <div>打印条码:{{ row.printCode }}</div>
        </template>
      </vxe-column>
      <vxe-column field="" title="标题">
        <template #default="{ row }">
          <div>标题：{{ row.title }}</div>
          <div>规格：{{ row.specification }}</div>
        </template>
      </vxe-column>
      <vxe-column
        field="shippedQuantity"
        title="计划数量"
        width="120"
        :edit-render="{ name: 'input' }"
        :slots="{ edit: 'edit' }"
      >
        <template #header>
          <span style="color: rgb(245, 108, 108)">*</span>计划数量</template
        >
        <template #edit="{ row }">
          <el-input v-model="row.shippedQuantity" type="number"></el-input>
        </template>
      </vxe-column>
      <vxe-column field="bizzOwner" title="开发专员" width="120"></vxe-column>
      <vxe-column field="packDesc" title="包装备注" width="200"></vxe-column>
      <vxe-column title="操作" width="150">
        <template #default="{ row }">
          <el-popconfirm title="确定要删除吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 新增商品弹窗 -->
  <el-dialog
    v-model="showAddDialog"
    title="新增商品"
    :close-on-click-modal="false"
  >
    <vxe-table ref="itemTable" :data="addSkuList" border>
      <vxe-column type="checkbox" width="50"></vxe-column>
      <vxe-column title="图片" width="120">
        <template #default="{ row }">
          <el-popover
            placement="right"
            width="500px"
            :hide-after="0"
            trigger="hover"
          >
            <template #default>
              <el-image :src="row.prodImage || ''" />
            </template>
            <template #reference>
              <el-image
                v-if="row.prodImage"
                loading="lazy"
                :src="row.prodImage + '!size=80x80' || ''"
              />
            </template>
          </el-popover>
        </template>
      </vxe-column>
      <vxe-column title="SKU">
        <template #default="{ row }">
          <div>
            店铺子SKU：{{ row.variSku }}
            <span v-if="row.isSellMultiple" class="tag_sku">多</span
            ><span v-if="!row.isSale" class="tag_sku">停</span>
          </div>
          <div>商品子SKU：{{ row.prodSSku }}</div>
          <div>item_id：{{ row.itemId }}</div>
          <div>vari_id：{{ row.variId }}</div>
          <div>打印条码:{{ row.printCode }}</div>
        </template>
      </vxe-column>
      <vxe-column field="specification" title="标题">
        <template #default="{ row }">
          <div>标题：{{ row.title }}</div>
          <div>规格：{{ row.specification }}</div>
        </template>
      </vxe-column>
      <vxe-column field="bizzOwner" title="开发专员" width="120"></vxe-column>
      <vxe-column field="packDesc" title="包装备注" width="200"></vxe-column>
    </vxe-table>
    <template #footer>
      <span>
        <el-button type="primary" @click="addToKist">新增</el-button>
        <el-button @click="showAddDialog = false">关闭</el-button>
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
    watch
  } from 'vue';
  import { ElMessage } from 'element-plus';
  import { createShipment, addSku } from '@/api/multiplatform/shopeeprod';
  const props = defineProps({
    // 是否显示弹窗
    isVisible: {
      type: Boolean,
      default: false
    },
    storeAcctId: {
      type: String,
      default: ''
    },
    // 收获地址列表
    addressList: {
      type: Array,
      default: () => []
    },
    shipmentList: {
      type: Array,
      default: () => []
    }
  });
  const storeId = ref('');
  watch(
    () => props.storeAcctId,
    (id) => {
      storeId.value = id;
    }
  );

  const emits = defineEmits(['close', 'submit', 'delete', 'add']);

  const formData = reactive({
    shipmentId: '', // 货件编号
    shortNameOfReceiveAddressId: '',
    salesRemark: '', // 销售备注
    storeAcctId: '',
    printCodeList: '',
    shopeeSbsItemDtoList: []
  });

  const showAddDialog = ref(false);
  const addSkuList = ref([]);
  const itemTable = ref(null);
  const selectRecords = ref([]); // 列表复选框选中的数据

  const loading = ref(false);
  const showPackup = computed(() => {
    return props.isVisible;
  });

  // 新增商品
  const handleAddSku = async () => {
    if (formData.printCodeList == '') {
      ElMessage.warning('请输入打印条码');
      return;
    }
    showAddDialog.value = true;
    try {
      const { data, code } = await addSku({
        printCodeList: formData.printCodeList
          ? formData.printCodeList.split(',')
          : []
      });
      if (code == '0000') {
        addSkuList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取复选框选中的数据
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = itemTable.value;
    selectRecords.value = $table.getCheckboxRecords();
    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };

  // 将 新增商品 添加进 sku 列表中
  const addToKist = () => {
    if (getSelectedList()) {
      // 给新增的商品添加 计划数量
      selectRecords.value.forEach((item) => {
        item.planQuantity = 0;
      });
      emits('add', JSON.stringify(selectRecords.value));
      showAddDialog.value = false;
    }
  };

  const tableListRef = ref(null);
  const formRef = ref(null);

  // 删除货件计划
  const handleDelete = async (row) => {
    emits('delete', row.id);
  };

  // 关闭弹窗
  const handleClose = () => {
    formRef.value.resetFields();
    emits('close');
  };

  // 保存弹窗页面
  const handleSave = async () => {
    if (!props.shipmentList || props.shipmentList.length == 0) {
      ElMessage.warning('请先新增商品');
      return;
    }
    if (!formData.shipmentId) return ElMessage.warning('请输入货件编号！');
    if (!formData.shortNameOfReceiveAddressId)
      return ElMessage.warning('请选择收件地址！');
    // 校验计划数量
    let isRequierd = props.shipmentList.every((item) => {
      if (item.shippedQuantity !== '') return true;
    });
    if (!isRequierd) return ElMessage.warning('请输入计划数量！');
    let isPositive = props.shipmentList.some((item) => {
      if (item.shippedQuantity && item.shippedQuantity <= 0) return true;
    });
    if (isPositive) return ElMessage.warning('计划数量需要大于0！');

    formData.storeAcctId = storeId.value;
    formData.shopeeSbsItemDtoList = [];
    props.shipmentList.forEach((item) => {
      let obj = {
        itemId: '',
        prodSSku: '',
        prodSId: '',
        shippedQuantity: '',
        specification: '',
        salesRemark: '',
        variSku: '',
        printCode: ''
      };
      obj.itemId = item.itemId;
      obj.prodSSku = item.prodSSku;
      obj.prodSId = item.prodSId;
      obj.shippedQuantity = item.shippedQuantity;
      obj.specification = item.specification;
      obj.variSku = item.variSku;
      obj.printCode = item.printCode;
      obj.salesRemark = formData.salesRemark;
      formData.shopeeSbsItemDtoList.push(obj);
    });

    try {
      const { code } = await createShipment(formData);
      if (code === '0000') {
        ElMessage.success('保存成功！');
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style lang="scss" scoped>
  .input_width {
    margin-right: 5px !important;
    .el-input.el-input--small {
      width: 305px;
    }
  }
  .tag_sku {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-left: 5px;
    background: rgb(255, 87, 34);
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
