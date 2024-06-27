<template>
  <el-dialog
    v-model="showPackup"
    :title="isDetail ? '货件计划-详情' : '货件计划-包装'"
    width="90%"
    class="pack-dialog"
    modal-class="detailDalog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-tabs v-if="isDetail" v-model="detailActiveKey" type="card">
      <el-tab-pane label="详情" name="detail"></el-tab-pane>
      <el-tab-pane label="日志" name="log"></el-tab-pane>
    </el-tabs>

    <vxe-table
      v-if="detailActiveKey === 'log'"
      v-loading="detailLoading"
      :data="platWhShipmentLogs"
      height="570"
      :scroll-y="{ enabled: false }"
      border
    >
      <vxe-column title="时间" width="180">
        <template #default="{ row }">
          {{ transferDate(row.createTime) }}
        </template>
      </vxe-column>
      <vxe-column title="创建人" field="creator" width="180"></vxe-column>
      <vxe-column title="日志信息" field="operDesc"></vxe-column>
    </vxe-table>

    <el-form
      v-if="detailActiveKey === 'detail'"
      class="packup dialog_form"
      :inline="true"
    >
      <el-row>
        <el-form-item label="货件编号" size="default">
          <el-input
            v-model="formData.platOrderId"
            :disabled="activeKey !== '0'"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="activeKey === '2' || activeKey === '4'">
          <el-button
            v-permission="['shipmentplanEditPlatOrder']"
            type="primary"
            @click="handleEditOrderId"
            >修改货件编号</el-button
          >
        </el-form-item>
        <el-form-item label="收件地址简称" size="default">
          <el-select
            v-model="formData.receiveAddressId"
            :disabled="activeKey !== '0'"
          >
            <el-option
              v-for="item in newAddressList"
              :key="item.id"
              :label="item.alias"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="platCode == 'lazada'"
          label="lazada销售头程"
          size="default"
        >
          <el-select v-model="formData.salesHead" :disabled="activeKey !== '0'">
            <el-option value="SEA-FLASH" label="SEA-FLASH"></el-option>
            <el-option value="LAND-FLASH" label="LAND-FLASH"></el-option>
            <el-option value="SEA-UNE-FLASH" label="SEA-UNE-FLASH"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="input_width" label="销售备注" size="default">
          <el-input
            v-model="formData.salerRemark"
            style="width: 400px"
            :disabled="activeKey !== '0'"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-permission="['shipmentplanEditRemark']"
            type="primary"
            style="margin-left: 20px"
            @click.stop="handleEditRemark()"
            >修改销售备注</el-button
          >
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item class="input_width" label="采购备注" size="default">
          <el-input
            v-model="formData.purchaseRemark"
            disabled
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="activeKey === '2'"
            type="primary"
            style="margin-left: 20px"
            @click.stop="handlePurchaseRemark()"
            >修改采购备注</el-button
          >
        </el-form-item>
      </el-row>

      <el-row v-if="isDetail">
        <el-form-item label="新增商品" size="default">
          <el-input
            v-model="barCode"
            placeholder="请输入商品条码"
            :disabled="activeKey !== '0' || platCode == 'lazada'"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="activeKey !== '0' || platCode == 'lazada'"
            @click="handleAddSku"
            >新增</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>

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
        <vxe-column title="SKU">
          <template #default="{ row }">
            <div>店铺：{{ row.sellerSku }}</div>
            <div>商品：{{ row.prodSSku }}</div>
            <div>条码：{{ row.barCode }}</div>
            <span v-if="row.combination" class="combination_sku">组</span>
          </template>
        </vxe-column>
        <vxe-column field="specification" title="规格">
          <template #default="{ row }">
            <div>店铺：{{ row.storeAcct }}</div>
            <div>标题：{{ row.title }}</div>
            <div>规格：{{ row.specification }}</div>
            <div>OA简称：{{ row.oATitle }}</div>
          </template>
        </vxe-column>
        <vxe-column field="bizzOwner" title="开发专员"></vxe-column>
        <vxe-column field="packDesc" title="包装备注"></vxe-column>
      </vxe-table>
      <template #footer>
        <span>
          <el-button type="primary" @click="addToKist">新增</el-button>
          <el-button @click="showAddDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 包装和详情列表数据 -->
    <vxe-table
      v-if="detailActiveKey === 'detail'"
      v-loading="detailLoading"
      :data="detailData"
      auto-resize
      :height="400"
      :edit-config="{
        trigger: 'click',
        mode: 'cell'
      }"
      :scroll-y="{ enabled: false }"
      border
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
      <vxe-column title="SKU" width="180">
        <template #default="{ row }">
          <div>店铺：{{ row.sellerSku }}</div>
          <div>商品：{{ row.prodSSku }}</div>
          <div>条码：{{ row.barCode }}</div>
          <div>skuid：{{ row.sellerSkuId || '' }}</div>
          <div>g_item_id：{{ row['gItemId'] || '' }}</div>
          <div>g_vari_id：{{ row['gVariId'] || '' }}</div>
          <span v-if="row.combination" class="combination_sku">组</span>
        </template>
      </vxe-column>
      <vxe-column field="specification" title="规格" min-width="90">
        <template #default="{ row }">
          <div>店铺：{{ row.storeAcct }}</div>
          <div>标题：{{ row.title }}</div>
          <div>规格：{{ row.specification }}</div>
          <div>简称：{{ row.oATitle }}</div>
        </template>
      </vxe-column>
      <vxe-column field="locationCode" title="库位" min-width="30">
        <template #default="{ row }">
          <div>{{ row.locationCode }}</div>
        </template>
      </vxe-column>
      <vxe-column
        v-if="isDetail && activeKey === '0'"
        field="planQuantity"
        title="计划数量"
        width="80"
        :edit-render="{ name: 'input' }"
        :slots="{ edit: 'edit' }"
      >
        <template #edit="{ row }">
          <el-input
            v-model="row.planQuantity"
            type="number"
            style="width: 80px"
          ></el-input>
        </template>
      </vxe-column>
      <vxe-column
        v-if="!isDetail || (isDetail && activeKey !== '0')"
        field="planQuantity"
        title="计划数量"
        width="80"
      >
      </vxe-column>
      <vxe-column
        v-if="isDetail"
        field="actQuantity"
        title="实发数量"
        width="80"
      >
      </vxe-column>
      <vxe-column
        v-if="!isDetail && activeKey !== '0'"
        field="actQuantity"
        title="实发数量"
        width="80"
        :edit-render="{ name: 'input' }"
      >
        <template #edit="{ row }">
          <el-input
            v-model="row.actQuantity"
            type="number"
            style="width: 80px"
            @input="changeActQuantity($event, row)"
            @focus="focusInput"
          ></el-input>
        </template>
      </vxe-column>
      <vxe-column field="platReceiveQuantity" title="平台实收">
        <template #default="{ row }">
          <div>{{ row.platReceiveQuantity }}</div>
        </template>
      </vxe-column>
      <vxe-column
        v-if="platCode === 'temu' || platCode === 'shopee'"
        field="platReceiveQuantity"
        title="listing销量"
        width="80"
      >
        <template #default="{ row }">
          <div>
            <div>7天: {{ row.listingSales7 }}</div>
            <div>30天: {{ row.listingSales30 }}</div>
          </div>
        </template>
      </vxe-column>
      <vxe-column
        v-if="platCode !== 'lazada'"
        field="platReceiveQuantity"
        title="子SKU销量"
        width="80"
      >
        <template #default="{ row }">
          <div>
            <div>7天: {{ row.sales7 }}</div>
            <div>30天: {{ row.sales30 }}</div>
          </div>
        </template>
      </vxe-column>
      <vxe-column :title="`${warehouse}可用库存`" min-width="40">
        <template #default="{ row }">
          {{ row.selfStock }}
          <span
            v-if="
              [1, 2, 0].includes(Number(activeKey)) &&
              isDetail &&
              row.selfStock < row.planQuantity
            "
            class="lack_tag"
            >缺</span
          >
        </template>
      </vxe-column>
      <vxe-column :title="`${warehouse}在途`">
        <template #default="{ row }">
          {{ row.onWayStock }}
        </template>
      </vxe-column>
      <template v-if="isDetail">
        <vxe-column
          field="availableStock"
          :title="`${warehouse}预计可用(含在途)`"
          min-width="50"
        ></vxe-column>
      </template>
      <template v-if="[5].includes(Number(activeKey)) && isDetail">
        <vxe-column field="availableStock" title="退货信息" min-width="80">
          <template #default="{ row }">
            <div>数量：{{ row.totalReturnNum }}</div>
            <div>原因：{{ row.returnReason }}</div>
            <div>出库时间：{{ row.returnDeliveryTime }}</div>
          </template>
        </vxe-column>
      </template>
      <vxe-column v-if="isDetail" title="在途明细" min-width="80">
        <template #default="{ row }">
          <div>
            调拨单号:{{ row.borrowNo || '' }}
            <el-icon
              v-if="row.borrowNo"
              class="copy_icon"
              color="#aaa"
              style="cursor: pointer"
              @click="copy(row.borrowNo)"
            >
              <CopyDocument />
            </el-icon>
          </div>

          <span>
            采购单号(到货天数):
            <template
              v-for="(item, index) in row.purOrderMainDtos"
              :key="item.id"
            >
              <el-tooltip placement="bottom">
                <template #content
                  >采购备注：{{ item.memo || '' }}<br />物流信息：
                  {{ item.scanInfo || '' }}</template
                >
                {{
                  row.purOrderMainDtos.length - 1 !== index
                    ? item.purchaseNo + ','
                    : item.purchaseNo || ''
                }}
              </el-tooltip>
            </template>
            <el-icon
              v-if="row.purchaseNo"
              class="copy_icon"
              color="#aaa"
              style="cursor: pointer"
              @click="copy(row.purchaseNo)"
            >
              <CopyDocument />
            </el-icon>
          </span>
          <!-- <div>采购单号(到货天数): {{ row.purchaseNo || '' }}</div> -->
        </template>
      </vxe-column>
      <vxe-column field="bizzOwner" title="开发专员"></vxe-column>
      <vxe-column field="packDesc" title="包装备注">
        <template #default="{ row }">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="row.packDesc"
            placement="top"
          >
            <div class="limitRow">{{ row.packDesc }}</div>
          </el-tooltip>
        </template>
      </vxe-column>
      <vxe-column title="仓库" min-width="80">
        <template #default="{ row }">
          <div>包装：{{ transferDate(row.packTime) }} {{ row.packer }}</div>
          <div>装车：{{ transferDate(row.loadTime) }} {{ row.loader }}</div>
          <div>
            存框：{{ transferDate(row.storeTime) }} {{ row.storeOperator }}
          </div>
          <div>
            存箱:{{ transferDate(row.saveComBoxTime) }}
            {{ row.saveComBoxOper || '' }}
          </div>
          <div>
            装箱：{{ transferDate(row.casePackerTime) }} {{ row.casePacker }}
          </div>
        </template>
      </vxe-column>
      <vxe-column
        title="操作"
        :width="!isDetail && platCode == 'temu' ? 140 : 90"
      >
        <template #default="{ row }">
          <el-button
            v-if="platCode == 'temu'"
            type="primary"
            @click="handlePrintFourToOne(row)"
            >打印</el-button
          >
          <el-button
            v-if="platCode !== 'temu'"
            type="primary"
            @click="ShowPrintDailog(row)"
            >打印</el-button
          >
          <el-popconfirm
            title="确定要0库存发货吗？"
            @confirm="handleDeliveryNoStock(row)"
          >
            <template #reference>
              <el-button
                v-if="!isDetail"
                v-permission="['deliverNoStockBtn']"
                type="primary"
                >0库存发货</el-button
              >
            </template>
          </el-popconfirm>

          <el-popconfirm title="确定要删除吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button
                v-if="isDetail"
                type="danger"
                :disabled="activeKey !== '0' || platCode == 'lazada'"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
    <template #footer>
      <span>
        <el-button
          type="primary"
          :disabled="isDetail && activeKey !== '0'"
          @click="handleSave"
          >保存</el-button
        >
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 修改销售备注弹窗 -->
  <el-dialog
    v-model="editRemarkDialog"
    width="30%"
    title="修改销售备注"
    :close-on-click-modal="false"
  >
    <el-input
      v-model="newRemark"
      :rows="4"
      type="textarea"
      placeholder="请输入销售备注"
    />
    <template #footer>
      <el-button type="primary" @click="editRemarkSave()">确定</el-button>
      <el-button @click="editRemarkDialog = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 修改采购备注弹窗 -->
  <el-dialog
    v-model="editPurchaseRemarkDialog"
    width="30%"
    title="修改采购备注"
    :close-on-click-modal="false"
  >
    <el-input
      v-model="newPurchaseRemark"
      :rows="4"
      type="textarea"
      placeholder="请输入采购备注"
    />
    <template #footer>
      <el-button
        type="primary"
        :loading="editPurchaseLoading"
        @click="editPurchaseRemarkSave()"
        >确定</el-button
      >
      <el-button @click="editPurchaseRemarkDialog = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 修改货件编号弹窗 -->
  <el-dialog
    v-model="editPlatOrderDialog"
    width="30%"
    title="修改货件编号"
    :close-on-click-modal="false"
  >
    <el-input v-model="newPlatOrder" placeholder="请输入货件编号" />
    <template #footer>
      <el-button type="primary" @click="editPlatOrderSave()">确定</el-button>
      <el-button @click="editPlatOrderDialog = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 打印弹窗 -->
  <el-dialog
    v-model="showPrint"
    title="打印货品标签"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="数量" size="default">
        <el-input v-model="printNum"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="handlePrint">打印</el-button>
        <el-button @click="showPrint = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 打印弹窗 -->
  <el-dialog
    v-model="showPrintTemu"
    title="打印temu四合一标签"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="数量" size="default">
        <ZInputNumber
          v-model="printNum"
          :step="1"
          :precision="0"
          :min="1"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="handlePrintTemu">打印</el-button>
        <el-button @click="showPrintTemu = false">关闭</el-button>
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
    onMounted
  } from 'vue';
  import {
    saveDelivery,
    saveDetail,
    addSku,
    editRemark,
    getLazadaPrint,
    getShipmentDetail,
    editPlatOrder,
    getSheinPrint,
    savePurchaseRemark,
    queryAeCaleLabelApi,
    queryAeEuCaleLabelApi,
    queryIfNeedEuLabelApi,
    // queryIfPrintFoodLabelApi
    deliveryNoStock
  } from '@/api/multiplatform/shipmentplan';
  import { getWaterMarkLabel } from '@/api/common';
  import { ElMessage, ElLoading } from 'element-plus';
  import { transferDate } from '@/utils/common';
  import { commonGetPrintInfoApi } from '@/api/multiplatform/common';

  import { commonExecutePrintJobs } from '@/utils/print';
  import axios from 'axios';
  import qs from 'qs';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { copy } from '@/utils/common';
  const props = defineProps({
    // 是否显示弹窗
    isVisible: {
      type: Boolean,
      default: false
    },
    // 平台名称
    platCode: {
      type: String,
      default: ''
    },
    // 收获地址列表
    addressList: {
      type: Array,
      default: () => []
    },
    // 详情弹窗/ 包装弹窗
    isDetail: {
      type: Boolean,
      default: false
    },
    detailId: {
      type: Number,
      default: 0
    },
    // 货件状态
    activeKey: {
      type: String,
      default: ''
    }
  });

  const emits = defineEmits(['close', 'submit', 'query', 'delete', 'add']);

  const platCodeValue = ref(''); // 平台
  const warehouse = ref(''); // 仓库
  const barCode = ref(''); // 商品条形码
  const formData = reactive({
    id: '',
    platOrderId: '', // 货件编号
    salerRemark: '', // 销售备注
    purchaseRemark: '', // 采购备注
    receiveAddressId: '',
    alias: '', // 收件地址
    salesHead: '' // lazada 销售头程
  });

  const detailActiveKey = ref('detail'); // 默认详情页tab

  const showPrint = ref(false); // 是否显示打印弹窗
  const detailData = ref([]);
  const showAddDialog = ref(false);
  const addSkuList = ref([]);
  const itemTable = ref(null);
  const selectRecords = ref([]); // 列表复选框选中的数据

  const newAddressList = ref([]); // 新地址列表
  onMounted(() => {
    getShipmentDetailList(props.detailId);
    newAddressList.value = props.addressList.filter(
      (item) => item.platCode == props.platCode
    );
  });

  const showPackup = computed(() => {
    return props.isVisible;
  });

  const printNum = ref(''); // 打印数量
  const printInfo = ref({});
  const pdfInfo = ref([]);
  const detailId2 = ref('');

  const printRequest = reactive({
    storeAcctId: '',
    sellerSku: '',
    sellerSkc: ''
  });
  const ShowPrintDailog = (row) => {
    showPrint.value = true;
    printInfo.value = row;
    detailId2.value = row.id;
    printNum.value = '';
    printRequest.storeAcctId = row.storeAcctId;
    printRequest.sellerSku = row.sellerSku;
    printRequest.sellerSkc = row.sellerSkc;

    if (props.platCode === 'temu') {
      // 获取水洗唛和英文标签 （temu）
      let params = {
        shipmentId: row.shipmentId,
        barCode: row.barCode
      };
      getWaterMarkLabelFile(params);
    }
  };

  // 获取货件计划 包装和详情弹窗表格数据
  const shipmentInfo = ref({});
  const detailLoading = ref(false);
  const platWhShipmentLogs = ref([]); // 日志
  const getShipmentDetailList = async (id) => {
    try {
      detailLoading.value = true;
      const { code, data } = await getShipmentDetail({ shipmentId: id });
      if (code === '0000') {
        detailData.value = data.platWhShipmentDetailDtos;
        shipmentInfo.value = data.platWhShipment;
        detailData.value.forEach((item) => {
          item.lackStock = item.selfStock - item.planQuantity;
          item.saveComBoxOper = shipmentInfo.value.saveComBoxOper;
          item.saveComBoxTime = shipmentInfo.value.saveComBoxTime;
        });
        platWhShipmentLogs.value = data.platWhShipmentLogs || [];
        sortDetailData(detailData.value);
        let {
          platOrderId,
          salerRemark,
          purchaseRemark,
          alias,
          id,
          receiveAddressId,
          platCode,
          salesHead,
          warehouseName
        } = shipmentInfo.value;
        formData.platOrderId = platOrderId;
        formData.purchaseRemark = purchaseRemark;
        formData.salerRemark = salerRemark;
        formData.alias = alias;
        formData.receiveAddressId = receiveAddressId;
        formData.id = id;
        formData.salesHead = salesHead;
        platCodeValue.value = platCode;
        warehouse.value = warehouseName;
      }
      detailLoading.value = false;
    } catch (err) {
      console.log(err);
      detailLoading.value = false;
    }
  };

  // 将缺货数据放在前
  const sortDetailData = (arr) => {
    arr.sort((a, b) => {
      return a.lackStock - b.lackStock;
    });
  };

  // 打印temu四合一标签
  const showPrintTemu = ref(false);
  const temuPrintInfo = ref('');
  const handlePrintFourToOne = (info) => {
    showPrintTemu.value = true;
    temuPrintInfo.value = info;
    printNum.value = '';
    if (props.platCode === 'temu') {
      // 获取水洗唛和英文标签 （temu）
      let params = {
        shipmentId: info.shipmentId,
        barCode: info.barCode
      };
      getWaterMarkLabelFile(params);
    }
  };

  const handlePrintTemu = async () => {
    // const { data: ifPrintLabel } = await queryIfPrintFoodLabelApi({
    //   id: temuPrintInfo.value.id
    // });
    // let printDetailDtoList = [
    //   {
    //     titleMap: {
    //       barCode: temuPrintInfo.value.barCode,
    //       sellerSku: temuPrintInfo.value.sellerSku,
    //       specification: temuPrintInfo.value.specification,
    //       showCode: temuPrintInfo.value.showCode,
    //       MIC: 'Made In China',
    //       companyName1: 'Manufacturer',
    //       companyName: temuPrintInfo.value.companyName,
    //       Location1: 'Address',
    //       Location:
    //         window.location.href.indexOf('mx.epean') > -1
    //           ? '2nd Floor, Building 2, No. 218, Xushan Road, Pujiang County, Jinhua City, Zhejiang Province'
    //           : '618 Yongzai Avenue, Xianhua Street, Pujiang County, Jinhua City, Zhejiang Province',
    //       ProductName1: 'Product name',
    //       ProductName: temuPrintInfo.value.keyword,
    //       warning:
    //         'To avoid danger of suffocation, keep this plastic bag away from babies and children. Do not use this bag in cribs, beds, carriages or play pens.',
    //       warning1: '⚠WARNING⚠'
    //     },
    //     amount: printNum.value,
    //     ifPrintLabel
    //   }
    // ];
    // let printObj10040 = {
    //   printerName: '6055',
    //   jspaper: 'platWhSellerSku7040FourToOne.jasper',
    //   printDetailDtoList
    // };
    // await epeanPrint_plugin_fun(99, printObj10040);
    if (printNum.value) {
      const bizId = new Array(printNum.value)
        .fill(temuPrintInfo.value.id)
        .join();
      const params = {
        tplName: 'TEMU商品标签',
        printTplType: 'PLAT_PROD_LABEL',
        bizId
      };
      const { data: printObj } = await commonGetPrintInfoApi(params);
      await commonExecutePrintJobs([printObj]);
    }
    handlePrintTemuNew();
  };

  const getWaterMarkLabelFile = async (params) => {
    try {
      const { code, data } = await getWaterMarkLabel(params);
      if (code === '0000') {
        pdfInfo.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 修改销售备注
  const editRemarkDialog = ref(false);
  const newRemark = ref('');
  const editRemarkId = ref('');
  const handleEditRemark = () => {
    editRemarkDialog.value = true;
    newRemark.value = formData.salerRemark;
    editRemarkId.value = formData.id;
  };

  const editRemarkSave = async () => {
    try {
      const { code, msg } = await editRemark({
        id: editRemarkId.value,
        salerRemark: newRemark.value
      });
      if (code == '0000') {
        editRemarkDialog.value = false;
        formData.salerRemark = newRemark.value;
        ElMessage.success(msg || '修改成功！');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 修改采购备注
  const editPurchaseLoading = ref(false);
  const editPurchaseRemarkDialog = ref(false);
  const newPurchaseRemark = ref('');
  const editPurchaseRemarkId = ref('');

  const handlePurchaseRemark = () => {
    editPurchaseRemarkDialog.value = true;
    newPurchaseRemark.value = formData.purchaseRemark;
    editPurchaseRemarkId.value = formData.id;
  };

  const editPurchaseRemarkSave = async () => {
    editPurchaseLoading.value = true;
    const { code, msg } = await savePurchaseRemark({
      id: editPurchaseRemarkId.value,
      purchaseRemark: newPurchaseRemark.value
    }).finally(() => {
      editPurchaseLoading.value = false;
    });
    if (code == '0000') {
      editPurchaseRemarkDialog.value = false;
      formData.purchaseRemark = newPurchaseRemark.value;
      ElMessage.success(msg || '修改成功！');
    }
  };

  // 修改货件编号
  const editPlatOrderDialog = ref(false);
  const newPlatOrder = ref('');
  const editPlatOrderId = ref('');
  const handleEditOrderId = async () => {
    editPlatOrderDialog.value = true;
    newPlatOrder.value = formData.platOrderId;
    editPlatOrderId.value = formData.id;
  };

  const editPlatOrderSave = async () => {
    try {
      const { code, msg } = await editPlatOrder({
        id: editPlatOrderId.value,
        platOrderId: newPlatOrder.value
      });
      if (code == '0000') {
        editPlatOrderDialog.value = false;
        formData.platOrderId = newPlatOrder.value;
        ElMessage.success(msg || '修改成功！');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 打印
  const printLabel = (obj) => {
    return new Promise((resolve, reject) => {
      const loadingInstance = ElLoading.service({
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.4)'
      });
      axios({
        method: 'post',
        url: 'http://localhost:9898/',
        data: qs.stringify(obj)
      })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          var responseText = err.message;
          if (responseText == null || responseText.indexOf('打印成功') == -1) {
            ElMessage.error(
              '打印错误，请检查打印插件是否正常运行或者重新启动插件'
            );
          }
          reject('打印错误，请检查打印插件是否正常运行或者重新启动插件');
        })
        .finally(() => {
          loadingInstance.close();
        });
    });
  };

  // 根据平台判断是否是 lazada
  // lazada 获取打印的参数 进行参数
  const lazadaParams = ref([]);
  const lazadaPrint = async () => {
    if (platCodeValue.value === 'lazada') {
      try {
        const { code, data } = await getLazadaPrint({
          detailIds: [detailId2.value]
        });
        if (code === '0000') {
          lazadaParams.value = data;
          let obj = {
            jspaper: 'lazadaBarCode6040.jasper',
            printDetailDtoList: [
              {
                titleMap: {
                  barCode: data[0]?.barCode,
                  fulfillmentSku: data[0]?.fulfillmentSku,
                  last3BarCode: data[0]?.last3BarCode,
                  title: data[0]?.title
                },
                amount: Number(printNum.value)
              }
            ],
            printerName: '6040' // 不填则使用默认打印机
          };
          let params = {
            printType: 99,
            printDto: JSON.stringify(obj)
          };
          printLabel(params);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // AE
  // 获取AE商品标签参数
  const handlePrintAE = async () => {
    try {
      let params = {
        printTemplateType: 'PLAT_WH_LABEL',
        tplName: 'AE仓发_商品标签',
        bizzId: detailId2.value
      };
      const { code, data } = await queryAeCaleLabelApi(params);
      if (code === '0000') {
        if (data.labelUrl) {
          let url = data.labelUrl;
          let labelUrl = Array(Number(printNum.value)).fill(url).join(',');
          let obj = {
            printType: 19,
            width: data.width,
            height: data.height,
            printName: data.printName,
            labelUrl
          };
          printLabel(obj);
        } else {
          ElMessage.warning('无商品标签');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // AE 欧盟资质标签
  const handlePrintAEEU = async () => {
    try {
      let params = {
        printNum: Number(printNum.value),
        bizzId: detailId2.value
      };
      const { code, data } = await queryAeEuCaleLabelApi(params);
      if (code === '0000') {
        if (data.labelUrl) {
          let obj = {
            printType: 19,
            width: data.width,
            height: data.height,
            printName: data.printName,
            labelUrl: data.labelUrl
          };
          printLabel(obj);
        } else {
          ElMessage.warning('无欧盟标签');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 是否需要打印欧盟标签
  const isNeedPrintEU = async () => {
    try {
      const { code, data } = await queryIfNeedEuLabelApi({
        id: detailId2.value
      });
      if (code === '0000') {
        if (data) {
          handlePrintAEEU();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // shein自营 需要额外打印 商品标签 水洗唛 眼镜贴 环保贴
  const handlePrintShein = async () => {
    try {
      let params = {
        platOrderId: formData.platOrderId, //  货件编号
        storeAcctId: printRequest.storeAcctId, // 店铺id
        sellerSku: printRequest.sellerSku, // 店铺sku
        sellerSkc: printRequest.sellerSkc,
        prodSSku: printInfo.value.prodSSku,
        num: Number(printNum.value) // 打印数量
      };
      const { code, data } = await getSheinPrint(params);
      if (code === '0000') {
        // 打印商品标签
        data.barCodeUrl &&
          (await printSheinInfo(
            data?.barCodeUrl,
            '7020',
            '70',
            '20',
            'itemLabel'
          ));

        // 打印水洗唛
        data.waterMark && printSheinInfo(data?.waterMark, '7020', '70', '20');
        // 打印环保贴
        data.envMark && printSheinInfo(data?.envMark, '7020', '70', '20');
        // 打印眼镜贴
        data.eyesMark && printSheinInfo(data?.eyesMark, '10040', '100', '40');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const printSheinInfo = async (
    pdfUrl,
    printerName,
    width,
    height,
    type = ''
  ) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      let params = {
        url: pdfUrl,
        amount: type === 'itemLabel' ? 1 : Number(printNum.value),
        printType: '100',
        width,
        height,
        printerName: printerName
      };
      await printLabel(params);
      resolve();
    });
  };

  const handlePrintTemuNew = () => {
    if (props.platCode === 'temu') {
      // 水洗唛 英文标签
      pdfInfo.value &&
        pdfInfo.value.forEach((item) => {
          if (item.pdfUrl) {
            let params = {
              url: item.pdfUrl,
              width: item.pdfLength === 'B' ? 100 : 60,
              height: item.pdfLength === 'B' ? 40 : 55,
              amount: Number(printNum.value),
              printType: '100',
              printerName: item.pdfLength === 'B' ? '10040' : '6055'
            };
            printLabel(params);
          }
        });
    }
  };

  // 确定打印
  const handlePrint = async () => {
    // shein自营 获取商品标签 水洗唛 眼镜贴 环保贴
    if (props.platCode === 'shein自营') {
      handlePrintShein();
    } else if (props.platCode === 'AE半托管' || props.platCode === 'AE全托管') {
      handlePrintAE();
      isNeedPrintEU();
    } else if (platCodeValue.value === 'lazada') {
      lazadaPrint();
    } else {
      // if (props.platCode !== 'shein自营') {
      // 商品标签
      let obj = {
        jspaper: 'platWhSellerSku7040.jasper',
        printDetailDtoList: [
          {
            titleMap: {
              barCode: printInfo.value.barCode,
              top1:
                platCodeValue.value === 'shopee'
                  ? printInfo.value.prodSSku
                  : printInfo.value.sellerSku,
              top2: printInfo.value.specification,
              bottom1: printInfo.value.showCode,
              bottom2: 'Made In China',
              bottomLine: printInfo.value.title
            },
            amount: Number(printNum.value)
          }
        ],
        printerName: '6040' // 不填则使用默认打印机
      };
      let params = {
        printType: 99,
        printDto: JSON.stringify(obj)
      };
      await printLabel(params);
      handlePrintTemuWaterEng();
      // }
    }
  };

  const handlePrintTemuWaterEng = () => {
    if (props.platCode === 'temu') {
      // 水洗唛 英文标签
      pdfInfo.value &&
        pdfInfo.value.forEach((item) => {
          if (item.pdfUrl) {
            let params = {
              url: item.pdfUrl,
              width: item.pdfLength === 'B' ? 100 : 60,
              height: item.pdfLength === 'B' ? 40 : 55,
              amount: Number(printNum.value),
              printType: '100',
              printerName: item.pdfLength === 'B' ? '10040' : '6055'
            };
            printLabel(params);
          }
        });
    }
  };

  // 删除货件计划
  const handleDelete = async (row) => {
    deleteDetailList(row.id);
  };

  // 新增商品
  const handleAddSku = async () => {
    if (!barCode.value) {
      return ElMessage.warning('请输入商品条码！');
    }
    showAddDialog.value = true;
    try {
      let params = {
        platCode: platCodeValue.value,
        barCode: barCode.value
      };
      const { code, data } = await addSku(params);
      if (code === '0000') {
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
      addDetalList(selectRecords.value);
      showAddDialog.value = false;
    }
  };

  // 详情-删除
  const deleteDetailList = (id) => {
    let detailListCopy = detailData.value.concat([]);
    detailData.value.forEach((item, index) => {
      if (item.id === id) {
        detailListCopy.splice(index, 1);
        detailData.value = detailListCopy;
      }
    });
  };
  // 详情-新增商品
  const addDetalList = (list) => {
    let detailListCopy = detailData.value.concat([]);
    list.forEach((item) => {
      detailListCopy.push(item);
    });
    detailData.value = detailListCopy;
  };

  // 关闭弹窗
  const handleClose = () => {
    barCode.value = '';
    emits('close');
  };

  const previousValue = ref('');
  const changeActQuantity = (val, row) => {
    // 检查输入值是否为0
    if (val === '0') {
      // 如果是0，则将输入值设置为之前的值
      row.actQuantity = previousValue.value;
      ElMessage.warning('实发数量不能修改为0, 请联系主管使用0库存发货');
    } else {
      // 如果不是0，则更新之前的值为当前输入值
      if (val) {
        previousValue.value = val;
      }
    }
  };

  const focusInput = (e) => {
    previousValue.value = e.target.value;
  };

  // 0 库存发货
  const handleDeliveryNoStock = async (row) => {
    try {
      let list = detailData.value?.filter((item) => item.id === row.id);
      let listCopy = JSON.parse(JSON.stringify(list));
      if (list) {
        listCopy[0].actQuantity = 0;
      }
      let params = {
        ifNoStockDeliver: true,
        platWhShipment: { id: formData.id },
        platWhShipmentDetailDtos: listCopy
      };
      const { code } = await deliveryNoStock(params);
      if (code === '0000') {
        ElMessage.success('0库存发货成功！');
        if (list) {
          list[0].actQuantity = 0;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 保存弹窗页面
  const handleSave = async () => {
    try {
      // 校验实发数量和计划数量
      let checkPlanQuantity =
        props.isDetail &&
        detailData.value.some((item) => {
          return item.planQuantity < 0;
        });
      let checkActQuantity =
        !props.isDetail &&
        detailData.value.some((item) => {
          return item.actQuantity < 0;
        });
      if (checkPlanQuantity)
        return ElMessage.warning('计划数量需要大于等于0！');
      if (checkActQuantity) return ElMessage.warning('实发数量不能小于0！');
      let platWhShipment = {
        id: formData.id
      };
      let params = {
        // 详情 保存参数
        platWhShipment: formData,
        platWhShipmentDetails: detailData.value
      };
      let deliverParams = {
        // 包装 保存参数
        platWhShipment: platWhShipment,
        platWhShipmentDetailDtos: detailData.value
      };
      const { code } = await (props.isDetail
        ? saveDetail(params)
        : saveDelivery(deliverParams));
      if (code === '0000') {
        ElMessage.success('保存成功！');
        // emits('query', formData.id);
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style lang="scss" scoped>
  .packup {
    // position: fixed;
    margin-bottom: 15px;
    :deep {
      .el-form-item .el-form-item__label {
        width: 110px;
      }
    }
  }
  .input_width {
    margin-right: 5px !important;
    .el-input.el-input--small {
      width: 305px;
    }
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
</style>
<style lang="scss">
  .pack-dialog {
    position: relative;
    margin-top: 80px;
    .el-dialog__body {
      overflow-y: hidden;
      max-height: 650px;
    }
    .vxe-table--body-wrapper {
      overflow-x: hidden;
    }
  }
  .lack_tag {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-left: 5px;
    line-height: 22px;
    text-align: center;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
    background: rgb(245, 108, 108);
  }
  .limitRow {
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
  // .detailDalog {
  //   .el-overlay-dialog {
  //     overflow-y: hidden;
  //   }
  // }
</style>
