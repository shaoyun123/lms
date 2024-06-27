<template>
  <div class="app-container">
    <el-card class="shopee_prod search_card">
      <el-form
        ref="formRef"
        class="search_form"
        :model="formData"
        :inline="true"
        :label-width="100"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="formData.orgId"
            clearable
            filterable
            placeholder="请选择"
            :data="selectData.departData"
            check-strictly
            :props="defaultProps"
            :render-after-expand="false"
            :empty-text="'No matching Data'"
            @node-click="handleNodeClick"
            @clear="clearDepart"
          />
        </el-form-item>
        <el-form-item label="销售" prop="salesPersonIdList">
          <el-select
            v-model="formData.salesPersonIdList"
            placeholder="请选择"
            clearable
            filterable
            @change="changeSalers"
            @clear="clearSaler"
          >
            <el-option
              v-for="item in selectData.salersData"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺" prop="storePersonIdCopy">
          <ZSelect
            v-model="formData.storePersonIdCopy"
            :items="selectData.storeData"
            :num="0"
          />
        </el-form-item>
        <el-form-item label="站点">
          <el-select
            v-model="formData.salesSiteList"
            :class="formData.salesSiteList.length > 1 ? 'hide_tag' : ''"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            filterable
          >
            <template #prefix>
              <el-tag v-if="formData.salesSiteList.length > 1" type="info"
                >已选{{ formData.salesSiteList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.siteData"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="sellerSkuKey" class="form_left">
            <el-option value="0" label="店铺子SKU" />
            <el-option value="1" label="商品子SKU" />
            <el-option value="2" label="item_id" />
            <el-option value="3" label="vari_id" />
            <el-option value="4" label="global_item_id" />
            <el-option value="5" label="global_model_id" />
          </el-select>
          <el-input v-model="sellerSkuVal" class="form_right" />
        </el-form-item>
        <el-form-item label="打印条码" prop="printCodeList">
          <el-input v-model="formData.printCodeList" />
        </el-form-item>
        <el-form-item class="form_range">
          <el-select
            v-model="formData.salesType"
            placeholder="请选择销量"
            class="form_left"
          >
            <el-option value="7" label="7日销量" />
            <el-option value="30" label="30日销量" />
            <el-option value="60" label="60日销量" />
            <el-option value="90" label="90日销量" />
          </el-select>
          <el-input
            v-model="formData.salesNumLowerLimit"
            placeholder=">="
            class="form_right"
          />
          <div class="range_link">-</div>
          <el-input v-model="formData.salesNumUpperLimit" placeholder="<=" />
        </el-form-item>
        <br />
        <el-form-item label="平台库存" class="form_range">
          <el-input v-model="formData.stockLowerLimit" placeholder=">=" />
          <div class="range_link">-</div>
          <el-input v-model="formData.stockUpperLimit" placeholder="<=" />
        </el-form-item>
        <el-form-item label="包装备注" prop="hasPackDesc">
          <el-select v-model="formData.hasPackDesc" clearable>
            <el-option :value="true" label="有" />
            <el-option :value="false" label="无" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否停售" prop="isSale">
          <el-select v-model="formData.isSale" clearable>
            <el-option :value="false" label="停售" />
            <el-option :value="true" label="在售" />
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态" prop="saleStatus">
          <el-select v-model="formData.saleStatus" clearable>
            <el-option :value="true" label="售卖" />
            <el-option :value="false" label="不卖" />
          </el-select>
        </el-form-item>

        <el-form-item label="商品标签" prop="prodTagList">
          <el-select
            v-model="formData.prodTagList"
            class="mul-input"
            :class="formData.prodTagList.length > 1 ? 'hide_tag' : ''"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            filterable
          >
            <template #prefix>
              <el-tag v-if="formData.prodTagList.length > 1" type="info"
                >已选{{ formData.prodTagList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.prodAttrTagArr"
              :key="item.id"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPaymentsList()">查询</el-button>
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据列表展示 -->
    <el-card class="list_card">
      <div class="flex_between">
        <div>
          <el-tag>数量({{ total }})</el-tag>
          <span
            style="margin-left: 10px; font-size: 15px; vertical-align: middle"
            >当前选中 {{ selectCount }} 条数据</span
          >
        </div>
        <div class="flex_between">
          <el-dropdown
            v-permission="['shopeeprodEditInfoBtn']"
            style="margin: 0 10px"
          >
            <el-button type="primary">
              修改信息<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editLabel">设置标签</el-dropdown-item>
                <el-dropdown-item @click="editStatus"
                  >修改销售状态</el-dropdown-item
                >
                <el-dropdown-item @click="editRemark"
                  >修改包装备注</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown style="margin-right: 10px">
            <el-button type="primary">
              添加模板<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="downloadExcel(1)"
                  >添加商品模板</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="formData['task-view-5704']"
                  @click="downloadExcel(0)"
                  >货件计划模板</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown style="margin-right: 10px">
            <el-button type="primary">
              导入<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="formData['task-view-5704']">
                  <el-upload
                    v-permission="['shopeeprodSBSCreatedPlanBtn']"
                    :action="'/api/lms/shopee/sbsItem/importPlatWhShipment'"
                    :on-success="uploadPlanSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                  >
                    sbs批量创建货件计划
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-upload
                    v-permission="['shopeeprodSBSCreatedProdBtn']"
                    :action="'/api/lms/shopee/sbsItem/importShopeeSbsItemModel'"
                    :on-success="uploadSbsSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                  >
                    批量创建sbs商品
                  </el-upload>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            v-if="formData['task-view-5704']"
            v-permission="['shopeeprodCreatedPlanBtn']"
            type="primary"
            @click="createPack"
            >创建货件计划</el-button
          >
        </div>
      </div>
      <div style="margin: 5px 0">
        <el-checkbox-group v-model="formData.labelList">
          <el-checkbox
            v-for="item in selectData.labelNameArr"
            :key="item"
            :label="item"
          />
        </el-checkbox-group>
      </div>
      <vxe-table
        ref="tableDataRef"
        v-loading="loading"
        :data="paymentsList"
        :height="height"
        :show-overflow="true"
        :scroll-y="{ gt: 10 }"
        border
        @checkbox-change="changeTableCheckbox"
        @checkbox-all="changeTableAllCheckbox"
      >
        <vxe-column type="checkbox" width="50" />
        <vxe-column title="图片" width="100">
          <template #default="{ row }">
            <el-popover
              v-if="row.packDesc"
              placement="right"
              width="300px"
              :hide-after="0"
              trigger="hover"
            >
              <template #default> {{ row.packDesc }} </template>
              <template #reference
                ><div style="width: 100%; text-align: center">
                  [包装备注]
                </div></template
              >
            </el-popover>
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
              </template> </el-popover
          ></template>
        </vxe-column>
        <vxe-column title="标题">
          <template #default="{ row }">
            标题：{{ row.title }} <br />
            分类：{{ row.fullCateName }}
          </template></vxe-column
        >
        <vxe-column title="SKU">
          <template #default="{ row }">
            <el-tooltip content="点击复制" placement="bottom">
              <div>
                店铺子SKU：
                <span
                  :style="row.active1"
                  @mouseenter="mouseEnter(row, 'active1')"
                  @mouseleave="mouseLeave(row, 'active1')"
                  @click="copy(row.variSku)"
                  >{{ row.variSku }}
                </span>
                <span v-if="row.isSellMultiple" class="tag_sku">多</span>
                <span v-if="!row.isSale" class="tag_sku">停</span>
              </div>
            </el-tooltip>
            <el-tooltip content="点击复制" placement="bottom">
              <div>
                商品子SKU：<span
                  :style="row.active2"
                  @mouseenter="mouseEnter(row, 'active2')"
                  @mouseleave="mouseLeave(row, 'active2')"
                  @click="copy(row.prodSSku)"
                  >{{ row.prodSSku }}</span
                >
              </div></el-tooltip
            >
            <el-tooltip content="点击复制" placement="bottom">
              <div>
                item_id：<span
                  :style="row.active3"
                  @mouseenter="mouseEnter(row, 'active3')"
                  @mouseleave="mouseLeave(row, 'active3')"
                  @click="copy(row.itemId)"
                  >{{ row.itemId }}</span
                >
              </div></el-tooltip
            >
            <el-tooltip content="点击复制" placement="bottom">
              <div>
                vari_id：<span
                  :style="row.active4"
                  @mouseenter="mouseEnter(row, 'active4')"
                  @mouseleave="mouseLeave(row, 'active4')"
                  @click="copy(row.variId)"
                  >{{ row.variId }}</span
                >
              </div></el-tooltip
            >
            <el-tooltip content="点击复制" placement="bottom">
              <div>
                打印条码：<span
                  :style="row.active5"
                  @mouseenter="mouseEnter(row, 'active5')"
                  @mouseleave="mouseLeave(row, 'active5')"
                  @click="copy(row.printCode)"
                  >{{ row.printCode }}</span
                >
              </div></el-tooltip
            >
          </template>
        </vxe-column>
        <vxe-column title="人员信息" width="150">
          <template #default="{ row }">
            <div>店铺: {{ row.storeAcct }}</div>
            <div>销售: {{ row.salesperson }}</div>
            <div>开发: {{ row.bizzOwner }}</div>
            <div>采购: {{ row.buyer }}</div>
            <div>责任: {{ row.responsor }}</div>
          </template>
        </vxe-column>
        <vxe-column title="现价" width="150">
          <template #default="{ row }">
            {{ row.currPrice }} {{ row.currency }}
          </template>
        </vxe-column>
        <vxe-column title="variation销量" width="150">
          <template #default="{ row }">
            <div>7天: {{ row.sevenSales }}</div>
            <div>30天: {{ row.thirtySales }}</div>
            <div>60天: {{ row.sixtySales }}</div>
            <div>90天: {{ row.ninetySales }}</div>
          </template>
        </vxe-column>
        <vxe-column title="货件计划" width="120"
          ><template #default="{ row }">
            待发：{{ row.shipmentWaitNum }} <br />
            缺货：{{ row.shipmentOutOfNum }}
          </template></vxe-column
        >
        <vxe-column
          title="平台库存"
          field="shopeeStockCnn"
          width="120"
        ></vxe-column>
        <vxe-column title="创建人">
          <template #default="{ row }">
            <div>{{ row.creator }}</div>
            <div>{{ transferDate(row.createTime) }}</div>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="formData.pageNum"
          v-model:page-size="formData.pageSize"
          background
          :page-sizes="[50, 100, 300]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="editLabelDialog"
      width="30%"
      title="设置标签"
      :close-on-click-modal="false"
    >
      <el-form size="default">
        <el-checkbox
          v-for="item in selectData.labelNameArr"
          :key="item"
          v-model="editLabelForm"
          :label="item"
        />
      </el-form>
      <template #footer>
        <el-button type="primary" @click="editLabelSave()">确定</el-button>
        <el-button @click="editLabelDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editStatusDialog"
      width="30%"
      title="修改销售状态"
      class="dialog_height"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editStatusForm"
        size="default"
        status-icon
        :label-width="180"
      >
        <el-select v-model="editStatusForm.selectData">
          <el-option :value="true" label="售卖" />
          <el-option :value="false" label="不卖" />
        </el-select>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="editStatusSave()">确定</el-button>
        <el-button @click="editStatusDialog = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="editRemarkDialog"
      width="30%"
      title="修改包装备注"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="dialogForm.textarea"
        :rows="4"
        type="textarea"
        placeholder="请输入包装备注"
      />
      <template #footer>
        <el-button type="primary" @click="editRemarkSave()">确定</el-button>
        <el-button @click="editRemarkDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showImportDialog"
      width="40%"
      title="导入"
      style="overflow: hidden"
      :close-on-click-modal="false"
    >
      <el-tag style="margin-bottom: 10px; margin-right: 10px"
        >成功数量({{ successCount }})</el-tag
      >
      <el-tag style="margin-bottom: 10px" type="danger"
        >失败数量({{ importList.length }})</el-tag
      >
      <div style="overflow-y: auto; max-height: 550px">
        <vxe-table :data="importList" border>
          <vxe-column title="SKU">
            <template #default="{ row }">
              <div>店铺子SKU：{{ row.variSku }}</div>
              <div>商品子SKU：{{ row.prodSSku }}</div>
              <div>shop_id：{{ row.shopId }}</div>
              <div>item_id：{{ row.itemId }}</div>
              <div>global_item_id：{{ row.globalItemId }}</div>
              <div>global_model_id：{{ row.globalModelId }}</div>
              <div>打印条码：{{ row.printCode }}</div>
            </template>
          </vxe-column>
          <vxe-column title="导入结果" field="success" width="100">
            <template #default="{ row }">
              {{ row.success ? '成功' : '失败' }}</template
            >
          </vxe-column>
          <vxe-column title="原因" field="message"></vxe-column>
        </vxe-table>
      </div>
    </el-dialog>

    <!-- 货件计划 -->
    <Packupdetail
      ref="packupDetailRef"
      :is-visible="showPackup"
      :store-acct-id="storeAcctId"
      :shipment-list="shipmentList"
      :address-list="state.addressList"
      @close="handleClosePackup"
      @delete="handleDelete"
      @add="handleAdd"
    />
  </div>
</template>

<script setup name="multiplatformprodshopeeprod">
  import { nextTick, onMounted, reactive, ref, computed } from 'vue';
  import axios from 'axios';
  import { transferDate, copy } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import {
    searchItem,
    updateLabelName,
    updateSaleStatus,
    updatePackDesc,
    getOnlineEnum
  } from '@/api/multiplatform/shopeeprod';
  import {
    listdict,
    getLabelList,
    getAddress
  } from '@/api/multiplatform/temuprod';
  import Packupdetail from './component/Packupdetail.vue';
  import useUserStore from '@/store/modules/user';
  import ZSelect from '@/components/ZSelect/index.vue';

  // 货件计划
  const storeAcctId = ref('');
  const shipmentList = ref([]);
  const createPack = () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    const storeAcctArr = checkedData.map((item) => item.storeAcctId);
    if (checkedData.length == 0) {
      ElMessage.warning('请选择至少一条数据');
      return;
    }
    var newStoreAcctId = Array.from(new Set(storeAcctArr));
    if (newStoreAcctId.length != 1) {
      ElMessage.warning('请选择同一店铺的数据');
      return;
    }
    storeAcctId.value = newStoreAcctId[0];
    showPackup.value = true;
    getAdressList();
    // 新增计划数量字段
    checkedData.forEach((item) => {
      item.shippedQuantity = '';
    });
    shipmentList.value = checkedData;
  };

  const showPackup = ref(false);
  const packupDetailRef = ref(null);

  // 关闭货件计划弹窗
  const handleClosePackup = () => {
    showPackup.value = false;
  };

  const handleDelete = (id) => {
    let shipmentListCopy = shipmentList.value.concat([]);
    shipmentList.value.forEach((item, index) => {
      if (item.id === id) {
        shipmentListCopy.splice(index, 1);
        shipmentList.value = shipmentListCopy;
      }
    });
  };
  // 新增商品
  const handleAdd = (list) => {
    let shipmentListCopy = shipmentList.value.concat([]);
    let ids = shipmentList.value.map((item) => item.id);
    JSON.parse(list).forEach((item) => {
      if (!ids.includes(item.id)) {
        shipmentListCopy.push(item);
      }
    });
    shipmentList.value = shipmentListCopy;
  };

  const state = reactive({
    salersList: [],
    storeList: [],
    addressList: []
  });

  // 获取收件地址信息
  const getAdressList = async () => {
    let params = {
      platCode: 'shopee',
      alias: ''
    };
    const { code, data } = await getAddress(params);
    if (code === '0000') {
      state.addressList = data.list;
    }
  };
  // 货件计划-----------------------------

  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    sellerSkuKey.value = '0';
    sellerSkuVal.value = '';
    formData.salesNumUpperLimit = '';
    formData.salesNumLowerLimit = '';
    formData.stockUpperLimit = '';
    formData.stockLowerLimit = '';
    formData.salesSiteList = [];
    formData.storeAcctIds = [];
    formData.salesType = '';
    getDepartmentList();
    getStoreList();
  };

  // 分页--start
  const total = ref(0);

  // 设置每页count
  const handleSizeChange = (val) => {
    formData.pageSize = val;
    getPaymentsList();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    formData.pageNum = val;
    getPaymentsList();
  };
  // 分页--end

  const formData = reactive({
    labelList: [],
    orgId: '', // 部门
    salesPersonIdList: '', // 销售员
    pageNum: 1,
    pageSize: 50,
    storeAcctIds: [], // 店铺
    salesSiteList: [], // 站点
    itemIds: [], // item_id
    variIdList: [], // vari_id
    globalItemIdList: [], // global_item_id
    globalModelIdList: [], // global_model_id
    variSkuList: [], // 店铺子 sku
    prodSSkuList: [], // 子商品 sku
    printCodeList: '', // 打印条码
    prodTagList: [], // 商品标签
    salesType: '', // 销量类型
    salesNumUpperLimit: '', // 销量
    salesNumLowerLimit: '', // 销量
    stockUpperLimit: '', // 平台库存
    stockLowerLimit: '', // 平台库存
    hasPackDesc: '', // 是否有包装备注
    saleStatus: '', // 销售状态
    isSale: '', // 是否停售 0停售 1在售
    storePersonIdCopy: []
  });

  const sellerSkuKey = ref('0');
  const sellerSkuVal = ref('');

  const selectCount = ref(0);
  const changeTableCheckbox = (e) => {
    selectCount.value = e.records.length;
  };
  const changeTableAllCheckbox = (e) => {
    selectCount.value = e.records.length;
  };

  onMounted(async () => {
    getPaymentsList();
    getDepartmentList();
    getStoreList();
    getSiteList();
    {
      // 获取商品标签
      try {
        const { data } = await listdict();
        selectData.prodAttrTagArr = data;
      } catch (err) {
        console.log(err);
      }
    }
    {
      try {
        const { data } = await getLabelList();
        selectData.labelNameArr = data.map((item) => item.name);
      } catch (err) {
        console.log(err);
      }
    }
  });

  const tableDataRef = ref();

  // 根据skuType 设置 skuValue
  const getSkuValue = () => {
    if (formData.printCodeList && typeof formData.printCodeList === 'string') {
      formData.printCodeList = formData.printCodeList.split(',');
    }
    if (formData.printCodeList === '') {
      formData.printCodeList = [];
    }
    let value = sellerSkuVal.value ? sellerSkuVal.value.split(',') : [];
    formData.variSkuList = [];
    formData.prodSSkuList = [];
    formData.itemIds = [];
    formData.variIdList = [];
    formData.globalItemIdList = [];
    formData.globalModelIdList = [];
    if (sellerSkuKey.value === '0') {
      formData.variSkuList = value;
    }
    if (sellerSkuKey.value === '1') {
      formData.prodSSkuList = value;
    }
    if (sellerSkuKey.value === '2') {
      formData.itemIds = value;
    }
    if (sellerSkuKey.value === '3') {
      formData.variIdList = value;
    }
    if (sellerSkuKey.value === '4') {
      formData.globalItemIdList = value;
    }
    if (sellerSkuKey.value === '5') {
      formData.globalModelIdList = value;
    }
  };

  const showImportDialog = ref(false);
  const importList = ref([]);
  const successCount = ref(0);
  // 添加商品模板
  const downloadExcel = async (type) => {
    let filename = '';
    if (type == '0') {
      filename = 'sbs批量创建货件计划.xlsx';
    } else if (type == '1') {
      filename = '批量创建sbs商品.xlsx';
    }
    axios({
      method: 'get',
      url:
        `/api/lms/shopee/file/template/downloadShopeeExcelTemplateByFileName?fileName=` +
        filename,
      headers: {
        'Content-Type': 'text/plain'
      },
      responseType: 'blob',
      dataType: 'json'
    })
      .then((res) => {
        if (res.statusText == 'OK') {
          const xlsx = 'application/vnd.ms-excel';
          const blob = new Blob([res.data], { type: xlsx }); //转换数据类型
          const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
          a.download = filename;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loading = ref(false);
  const mouseEnter = (row, active) => {
    row[active] = {
      color: '#409EFF',
      cursor: 'pointer'
    };
  };
  const mouseLeave = (row, active) => {
    row[active] = '';
  };

  // 获取用户名
  let { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  // 列表数据
  const paymentsList = ref([]);
  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: [],
    siteData: [],
    prodAttrTagArr: [],
    labelNameArr: []
  });
  const salersDataCopy = ref([]);

  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };

  const checkSkuValue = () => {
    let value = sellerSkuVal.value ? sellerSkuVal.value.split(',') : [];
    if (
      sellerSkuKey.value === '2' ||
      sellerSkuKey.value === '3' ||
      sellerSkuKey.value === '4' ||
      sellerSkuKey.value === '5'
    ) {
      if (value.length) {
        let isNotNum = value.some((item) => {
          if (item !== '') {
            return !/^\d+$/.test(item);
          }
        });
        return isNotNum;
      }
    }
  };

  // 校验销量和库存
  const checkSales = () => {
    let reg = /^[1-9]\d*|0$/;
    if (
      (formData.salesNumUpperLimit && !reg.test(formData.salesNumUpperLimit)) ||
      (formData.salesNumLowerLimit && !reg.test(formData.salesNumLowerLimit)) ||
      (formData.stockUpperLimit && !reg.test(formData.stockUpperLimit)) ||
      (formData.stockLowerLimit && !reg.test(formData.stockLowerLimit))
    ) {
      return true;
    }
  };

  const getPaymentsList = async () => {
    getSkuValue();
    // 校验
    if (checkSkuValue()) {
      return ElMessage.warning('输入数据格式不正确，请重新输入！');
    }
    if (checkSales()) {
      return ElMessage.warning('输入数据格式不正确，请重新输入！');
    }
    // 选择销售或者部门 没有选择店铺
    if (
      formData.storePersonIdCopy.length === 0 &&
      (formData.orgId !== '' || formData.salesPersonIdList !== '')
    ) {
      if (selectData.storeData.length > 0) {
        formData.storeAcctIds = selectData.storeData.map((item) => item.id);
      } else {
        // 如果销售人员下没有数据的话 传 -1
        formData.storeAcctIds = [-1];
      }
    }

    if (formData.storePersonIdCopy.length > 0) {
      formData.storeAcctIds = formData.storePersonIdCopy;
    }

    try {
      loading.value = true;
      const { data, code, count } = await searchItem(formData);
      if (code == '0000') {
        paymentsList.value = data;
        total.value = count;
      } else {
        paymentsList.value = [];
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
    }
    selectCount.value = 0;
  };

  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    try {
      let params = {
        roleNames: 'shopee专员'
      };
      const { data } = await getDepartData(params);
      selectData.departData = data.orgTree;
      selectData.salersData = data.userList;
      salersDataCopy.value = data.userList;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'shopee专员',
        orgId: formData.orgId,
        salePersonId: formData.salesPersonIdList,
        platCode: 'shopee',
        lmsAppUserName: userName.value
      };
      const { data } = await getStoreInfo(params);
      selectData.storeData = data.map((v) => ({ id: v.id, name: v.storeAcct }));
    } catch (err) {
      console.log(err);
    }
  };

  // 获取 shopee 站点
  const getSiteList = async () => {
    try {
      const { code, data } = await getOnlineEnum();
      if (code === '0000') {
        selectData.siteData = data.siteList;
      }
    } catch (err) {
      console.log(err);
    }
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
    storeAcctId.value = [];
    formData.storeAcctIds = [];
    formData.storePersonIdCopy = [];
    getStoreList();
  };

  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    formData.orgId = '';
    formData.storeAcctIds = [];
    formData.storePersonIdCopy = [];
    resetSearch();
  };

  // 清空销售
  const clearSaler = () => {
    formData.salesPersonIdList = '';
    formData.storeAcctIds = [];
    formData.storePersonIdCopy = [];
    storeAcctId.value = [];
    getStoreList();
  };

  // const clearStore = () => {
  //   formData.storePersonIdCopy = [];
  //   formData.storeAcctIds = [];
  // };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    formData.salesPersonIdList = '';
    storeAcctId.value = [];
    getStoreList();
  };

  // 设置标签 --start--
  const editLabelDialog = ref(false);
  const editLabelForm = ref([]);
  // 打开
  const editLabel = () => {
    console.log(tableDataRef.value);
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择至少一条数据');
      return;
    }
    editLabelDialog.value = true;
  };

  const getCheckboxRecords = () => {
    const checkedData = tableDataRef.value
      .getCheckboxRecords()
      .map((item) => item.id);
    return checkedData;
  };

  // 保存
  const editLabelSave = async () => {
    const checkedData = getCheckboxRecords();
    let paramsArr = [];
    checkedData.forEach((item) => {
      let obj = {};
      obj.id = item;
      obj.label = editLabelForm.value.join(',');
      paramsArr.push(obj);
    });
    try {
      const { code, msg } = await updateLabelName(paramsArr);
      if (code == '0000') {
        editLabelDialog.value = false;
        editLabelForm.value = [];
        ElMessage.success(msg);
        getPaymentsList();
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 设置标签 --end--

  // 修改销售状态 --start--
  const editStatusDialog = ref(false);
  const editStatusForm = reactive({
    selectData: ''
  });
  // 打开
  const editStatus = () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择至少一条数据');
      return;
    }
    editStatusDialog.value = true;
    editStatusForm.selectData = '';
    console.log('status', editStatusForm.selectData);
  };
  // // 保存
  const editStatusSave = async () => {
    if (editStatusForm.selectData === '') {
      ElMessage.warning('请选择销售状态');
      return;
    }
    const checkedData = getCheckboxRecords();
    let paramsArr = [];
    checkedData.forEach((item) => {
      let obj = {};
      obj.id = item;
      obj.saleStatus = editStatusForm.selectData;
      paramsArr.push(obj);
    });
    try {
      const { code, msg } = await updateSaleStatus(paramsArr);
      if (code == '0000') {
        editStatusDialog.value = false;
        ElMessage.success(msg);
        getPaymentsList();
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 修改销售状态 --end--
  // 修改包装备注
  const editRemarkDialog = ref(false);
  const dialogForm = reactive({
    textarea: ''
  });
  const editRemark = () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择至少一条数据');
      return;
    }
    editRemarkDialog.value = true;
    dialogForm.textarea = '';
  };
  // 保存
  const editRemarkSave = async () => {
    if (dialogForm.textarea === '') {
      ElMessage.warning('请输入包装备注');
      return;
    }
    const checkedData = getCheckboxRecords();
    let paramsArr = [];
    checkedData.forEach((item) => {
      let obj = {};
      obj.id = item;
      obj.packDesc = dialogForm.textarea;
      paramsArr.push(obj);
    });
    try {
      const { code, msg } = await updatePackDesc(paramsArr);
      if (code == '0000') {
        editRemarkDialog.value = false;
        ElMessage.success(msg);
        getPaymentsList();
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 修改销售状态 --end--
  const uploadSbsSuccess = (res) => {
    if (res.code == '0000') {
      showImportDialog.value = true;
      let successList = res.data && res.data.filter((item) => item.success);
      successCount.value = successList.length;
      let data =
        res.data &&
        res.data.filter((item) => {
          return !item.success;
        });
      importList.value = data || [];
      getPaymentsList();
    } else {
      ElMessageBox.confirm(res.msg || '请求失败', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };

  const uploadPlanSuccess = (res) => {
    if (res.code == '0000' && res.success === true) {
      ElMessageBox.confirm(res.msg || '导入成功', '导入', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      });
      getPaymentsList();
    } else {
      ElMessageBox.confirm(res.msg || '请求失败', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };
  const uploadError = () => {
    ElMessageBox.confirm('导入失败', '错误信息', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'error'
    });
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 270;
  });
</script>
<style lang="scss" scoped>
  .mt-10 {
    margin-top: 10px;
  }

  .flex_between {
    display: flex;
    justify-content: space-between;
  }
  :deep(.hide_tag) {
    :deep(.el-select__selected-item) {
      display: none;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
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
<style lang="scss">
  .dialog_height {
    .el-dialog__body {
      min-height: 100px !important;
    }
  }
</style>
