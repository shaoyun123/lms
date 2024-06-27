<template>
  <el-dialog
    :model-value="showChoosePack"
    title="选择货品"
    width="90%"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div style="font-weight: bold; margin-bottom: 10px">
      该sku匹配到多个货件计划，请选择需要包装的是:
    </div>
    <vxe-table
      border
      height="500"
      :data="chooseData"
      :scroll-y="{ gt: 15 }"
      align="left"
      :column-config="{ resizable: true }"
      :checkbox-config="{ checkField: 'checked', trigger: 'row' }"
    >
      <vxe-column field="number" title="编号" width="150">
        <template #default="{ row }">
          <div class="distribute_td">
            <div>
              货件:{{ row.shipmentInfo && row.shipmentInfo.platOrderId }}
            </div>
            <div>框号:{{ row.shipmentInfo && row.shipmentInfo.frameCode }}</div>
            <div>店铺:{{ row.storeAcct }}</div>
            <div>销售:{{ row.salesperson }}</div>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="image" title="SKU图片" width="100">
        <template #default="{ row }">
          <el-popover
            placement="right"
            width="500px"
            :hide-after="0"
            trigger="hover"
          >
            <template #default>
              <el-image :src="row.prodSInfoDto.image || ''" />
            </template>
            <template #reference>
              <el-image
                v-if="row.prodSInfoDto"
                loading="lazy"
                :src="row.prodSInfoDto.image + '!size=80x80' || ''"
                style="width: 80px; height: 80px"
              />
            </template>
          </el-popover>
        </template>
      </vxe-column>
      <vxe-column field="skuInfo" title="SKU信息" width="140">
        <template #default="{ row }">
          <div class="distribute_td">
            <div>商品:{{ row.prodSSku }}</div>
            <div>店铺:{{ row.sellerSku }}</div>
            <div>variId:{{ row.prodSId }}</div>
            <div>条码:{{ row.barCode }}</div>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="salerRemark" title="销售备注">
        <template #default="{ row }">
          <span style="color: #000000; font-weight: bold">{{
            row.salerRemark
          }}</span>
        </template>
      </vxe-column>
      <vxe-column field="packDesc" title="包装备注">
        <template #default="{ row }">
          <span style="color: #000000; font-weight: bold">{{
            row.packDesc
          }}</span>
        </template>
      </vxe-column>
      <vxe-column field="combination" title="组合品" width="60">
        <template #default="{ row }">
          <span>
            {{
              row.prodSInfoDto
                ? row.prodSInfoDto.isCombination
                  ? '是'
                  : '否'
                : ''
            }}
          </span>
        </template>
      </vxe-column>
      <vxe-colgroup title="组合品详情">
        <vxe-column field="combinationImg" title="图片">
          <template #default="{ row }">
            <div
              v-for="item in row.prodSInfoDto.combSubProds"
              :key="item.id"
              class="combination_td"
            >
              <el-popover
                placement="right"
                width="500px"
                :hide-after="0"
                trigger="hover"
              >
                <template #default>
                  <el-image :src="item.image || ''" />
                </template>
                <template #reference>
                  <el-image
                    v-if="item.image"
                    loading="lazy"
                    :src="item.image + '!size=60x60' || ''"
                    style="width: 60px; height: 60px"
                  />
                </template>
              </el-popover>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="sSku" title="商品SKU" width="110">
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
        <vxe-column field="locationCode" title="库位" width="120">
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
        <vxe-column field="prodDetailNums" title="几个一包">
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
        <vxe-column field="totalNums" title="商品数量">
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
      <vxe-column field="planQuantity" title="计划发货数量" width="60" />
      <vxe-column field="restNum" title="剩余可用" width="60">
        <template #default="{ row }">
          <span>{{
            row.whStock
              ? row.whStock.currentStock - row.whStock.reservationStock
              : 0
          }}</span>
        </template>
      </vxe-column>
      <vxe-column field="handle" title="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="handlePack(row)"> 包装 </el-button>
        </template>
      </vxe-column>
    </vxe-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineProps, computed } from 'vue';

  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    chooseData: {
      type: Array,
      default: () => []
    }
  });

  const showChoosePack = computed(() => {
    return props.isVisible;
  });

  const emits = defineEmits(['close', 'choose']);
  const handleClose = () => {
    emits('close');
  };

  const handlePack = (row) => {
    handleClose();
    emits('choose', row?.shipmentInfo?.platOrderId);
  };
</script>

<style lang="scss" scoped></style>
