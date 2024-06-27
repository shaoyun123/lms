<template>
  <!-- daraz在线商品页面 -->
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="darazData.formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="店铺" prop="storeAcctIdList">
          <z-cascader
            v-model="darazData.formData.storeAcctIdList"
            :data="selectData.storeData"
          ></z-cascader>
        </el-form-item>
        <el-form-item label="站点" prop="siteCode">
          <el-select
            v-model="darazData.formData.siteCode"
            :class="darazData.formData.siteCode.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="darazData.formData.siteCode.length > 1" type="info"
                >已选{{ darazData.formData.siteCode.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.salesSite"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="OA新类目"
          prop="cateIdList"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="darazData.formData.cateIdList"
            :options="darazData.initFormData.oaList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'title',
              children: 'data'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="skuType">
          <el-select v-model="darazData.formData.skuType" class="form_left">
            <el-option :value="0" label="商品父SKU"></el-option>
            <el-option :value="1" label="商品子SKU"></el-option>
            <el-option :value="2" label="店铺父SKU"></el-option>
            <el-option :value="3" label="店铺子SKU"></el-option>
          </el-select>
          <el-input v-model="darazData.formData.skuVal" clearable />
        </el-form-item>
        <el-form-item label="物品号" prop="itemIds">
          <el-input v-model="darazData.formData.itemIds" clearable />
        </el-form-item>
        <el-form-item label="商品标签" prop="prodTags">
          <el-select
            v-model="darazData.formData.prodTags"
            :class="darazData.formData.prodTags.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="darazData.formData.prodTags.length > 1" type="info"
                >已选{{ darazData.formData.prodTags.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in darazData.initFormData.prodAttrList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="刊登标题" prop="title">
          <el-input
            v-model="darazData.formData.title"
            placeholder="常规模糊查询"
            clearable
          />
        </el-form-item>
        <el-form-item label="刊登时间" prop="listingTime">
          <!-- <el-select
            v-model="darazData.formData.queryTimeType"
            class="form_left"
          >
            <el-option v-if="activeKey == '-2'" :value="1" label="创建时间" />
            <el-option v-if="activeKey != '-2'" :value="3" label="生成时间" />
          </el-select> -->
          <el-date-picker
            v-model="darazData.formData.listingTime"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            type="daterange"
            unlink-panels
            style="width: 200px"
          />
          <!-- class="form_right" -->
        </el-form-item>
        <el-form-item prop="salesType">
          <el-select v-model="darazData.formData.salesType" class="form_left">
            <el-option :value="0" label="7天销量"></el-option>
            <el-option :value="1" label="15天销量"></el-option>
            <el-option :value="2" label="30天销量"></el-option>
            <el-option :value="3" label="60天销量"></el-option>
            <el-option :value="4" label="90天销量"></el-option>
          </el-select>
          <ZInputNumber
            v-model="darazData.formData.salesLeft"
            class="form_right"
            placeholder="请输入"
            style="width: 50px"
            clearable
          />
          <span class="range_link">-</span>
          <ZInputNumber
            v-model="darazData.formData.salesRight"
            placeholder="请输入"
            style="width: 50px"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否禁售" prop="ifProhibit">
          <el-select v-model="darazData.formData.ifProhibit" clearable>
            <el-option :value="false" label="非禁售" />
            <el-option :value="true" label="禁售" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否停售" prop="prodIsSaleStatus">
          <el-select v-model="darazData.formData.prodIsSaleStatus" clearable>
            <el-option :value="1" label="部分停售" />
            <el-option :value="0" label="全部停售" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="在售状态" prop="prodIsSaleStatusList">
          <el-select
            v-model="darazData.formData.prodIsSaleStatusList"
            filterable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="0"
            clearable
            multiple
          >
            <el-option :value="2" label="全部在售" />
            <el-option :value="1" label="部分在售" />
            <el-option :value="0" label="全部停售" />
          </el-select>
        </el-form-item>
        <el-form-item prop="orderType" label="排序">
          <el-select
            v-model="darazData.formData.orderType"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="刊登时间正序" :value="0"></el-option>
            <el-option label="刊登时间倒序" :value="1"></el-option>
            <el-option label="7天销量正序" :value="2"></el-option>
            <el-option label="7天销量倒序" :value="3"></el-option>
            <el-option label="30天销量正序" :value="4"></el-option>
            <el-option label="30天销量倒序" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="onlineCountLeft" label="在线数量">
          <ZInputNumber
            v-model="darazData.formData.onlineCountLeft"
            class="form_right"
            placeholder="请输入"
            style="width: 50px"
            clearable
          />
          <span class="range_link">-</span>
          <ZInputNumber
            v-model="darazData.formData.onlineCountRight"
            placeholder="请输入"
            style="width: 50px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs
        v-model="activeKey"
        v-loading="tableDataLoading"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.label"
          :label="
            item.count !== '' && activeKey == item.status
              ? `${item.label}(${item.count})`
              : item.label
          "
          :name="item.status"
        >
          <vxe-table
            ref="tableDataRef"
            :data="tableData"
            :height="height"
            :row-config="{ keyField: 'id' }"
            border
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="图片" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.images" />
              </template>
            </vxe-column>
            <vxe-column title="标题/产品id" width="300">
              <template #default="{ row }">
                {{ row.name }}<br />
                <el-tooltip content="点击跳转至商品在线链接" placement="left">
                  <el-link
                    :href="row.url"
                    target="_blank"
                    type="primary"
                    :underline="false"
                    >itemId:{{ row.itemId }}</el-link
                  >
                </el-tooltip>
                <el-icon
                  v-if="row.itemId"
                  class="copy_icon"
                  color="#aaa"
                  @click="copy(row.itemId)"
                  ><CopyDocument
                /></el-icon>
                [<span style="color: #bbb">{{ row.storeAcct }}</span
                >] [<span style="color: #bbb">{{ row.salesperson }}</span
                >]
              </template>
            </vxe-column>
            <vxe-column field="prodPSku" title="商品父SKU" width="120">
              <template #default="{ row }">
                <div @click="openPskuDetails(row.prodPId)">
                  <span style="color: #409eff">{{ row.prodPSku }}</span>
                </div>
                <el-icon
                  v-if="row.prodPSku"
                  class="copy_icon"
                  color="#aaa"
                  @click="copy(row.prodPSku)"
                  ><CopyDocument
                /></el-icon>
              </template>
            </vxe-column>
            <vxe-column title="item销量" width="100">
              <template #default="{ row }">
                7天：{{ row.sevenSales }}<br />
                15天：{{ row.fifteenSales }}<br />
                30天：{{ row.thirtySales }}<br />
                60天：{{ row.sixtySales }}<br />
                90天：{{ row.ninetySales }}
              </template>
            </vxe-column>
            <vxe-column width="900">
              <template #header>
                <div style="display: flex; justify-content: space-around">
                  <div style="width: 130px">seller_sku</div>
                  <div style="width: 130px">shop_sku</div>
                  <div style="width: 130px">属性</div>
                  <div style="width: 80px">原价</div>
                  <div style="width: 80px">促销价</div>
                  <div style="width: 80px">在线数量</div>
                  <div style="width: 150px">7/15/30/60/90天销量</div>
                  <div style="width: 100px">预计可用库存含在途/不含在途</div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  :data="
                    row.subProducts &&
                    row.subProducts.slice(0, row.displayCount)
                  "
                  :show-header="false"
                >
                  <vxe-column field="sellerSku" width="130" />
                  <vxe-column field="shopSku" width="130">
                    <template #default="{ row: sonRow }">
                      {{ sonRow.shopSku }}<br />
                      <span style="color: #409eff">{{ sonRow.status }}</span
                      ><br />
                      [{{ sonRow.prodSSku }}
                      <el-icon
                        v-if="sonRow.prodSSku"
                        class="copy_icon"
                        color="#aaa"
                        @click="copy(sonRow.prodSSku)"
                        ><CopyDocument /></el-icon
                      >]
                    </template>
                  </vxe-column>
                  <vxe-column field="color" width="130"
                    ><template #default="{ row: sonRow }">
                      colorFamily：{{ sonRow.colorFamily }}<br />
                      size：{{ sonRow.size }}<br />
                      style：{{ sonRow.style }}
                    </template>
                  </vxe-column>
                  <vxe-column field="price" width="80" />
                  <vxe-column field="specialPrice" width="80" />
                  <vxe-column field="quantity" width="80" />
                  <vxe-column field="" width="150"
                    ><template #default="{ row: sonRow }">
                      {{ sonRow.sevenSales }}/{{ sonRow.fifteenSales }}/{{
                        sonRow.thirtySales
                      }}/{{ sonRow.sixtySales }}/{{ sonRow.ninetySales }}
                    </template>
                  </vxe-column>
                  <vxe-column field="" width="100"
                    ><template #default="{ row: sonRow }">
                      {{ sonRow.preAvailableStockAll }}/{{
                        sonRow.preAvailableStock
                      }}
                    </template>
                  </vxe-column>
                </vxe-table>
                <div
                  v-if="row.subProducts"
                  :class="[row.subProducts.length <= 3 ? 'hideBtn' : '']"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a v-if="row.subProducts" style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >
            <vxe-column title="操作">
              <template #default="{ row }">
                <span>{{ row.enTitle }}</span>
                <br />
                <el-button type="success" @click="handleUpdate(false, row)"
                  >同步</el-button
                >
                <br />
                <el-button type="primary" @click="handleViewLog(row)"
                  >日志</el-button
                >
              </template>
            </vxe-column>
            <!-- {{
              row.createTime
                ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                : ''
            }} -->
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="currentPage"
              v-model:page-size="limit"
              background
              :page-sizes="[50, 100, 200, 500, 1000]"
              layout="prev, pager, next, sizes, total"
              :total="total"
              :small="true"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn">
        <el-button
          v-permission="['darazOnlineExportUpdatePrice']"
          type="primary"
          @click="handleExportUpdatePrice"
          >导出调价模板</el-button
        >
        <el-upload
          v-model:file-list="fileList"
          v-permission="['darazOnlineImportUpdatePrice']"
          class="ml12"
          accept="xlsx,xls"
          :show-file-list="false"
          action="/api/lms/darazBatch/importUpdatePrice"
          :before-upload="handleExportBefore"
          :on-success="handleExportResult"
          :on-error="handleExportError"
        >
          <el-button type="primary" :loading="uploadLoading"
            >导入调价</el-button
          >
        </el-upload>
        <el-select
          v-model="batchOperateType"
          style="width: 150px"
          class="ml12"
          placeholder="批量操作"
          filterable
          clearable
          ><template v-for="item in batchList" :key="item.value">
            <template v-if="item.showTab.includes(activeKey)">
              <template v-if="item.permission">
                <el-option
                  v-permission="[item.permission]"
                  :value="item.value"
                  :label="item.label"
                  @click="handleBatch"
                />
              </template>
              <template v-else>
                <el-option
                  :value="item.value"
                  :label="item.label"
                  @click="handleBatch"
                />
              </template>
            </template>
          </template>
        </el-select>
        <el-button type="primary" class="ml12" @click="exportListing"
          >导出</el-button
        >
        <!--
        <el-button v-if="activeKey == '0'" type="danger" @click="deleteListing"
          >删除店铺商品</el-button
        > -->
      </div>
    </el-card>
    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :cate-search-value="darazData.formData.cateSearchValue"
      :handle-cate-dialog-type="'oa'"
      @close-dialog="handleCateDialogClose($event)"
    />

    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />
    <LogDialog
      v-if="logVisible"
      v-model="logVisible"
      :checked-row="checkedRow"
    />
    <!-- 批量下架/删除 -->
    <OffLineOrDelDialog
      v-if="batchVisible.batchOfflineOrDel"
      v-model="batchVisible.batchOfflineOrDel"
      :select-records="selectRecords"
      :store-tree-list="selectData.storeData"
    />
    <BatchUpdateStock
      v-model="batchVisible.batchUpdateStock"
      :role-names="`daraz专员`"
      :plat-code="`daraz`"
      :checked-row-list="selectRecords"
      @handle-search="onSubmit()"
    />
    <!-- 批量调整原价和促销价 -->
    <PriceAndPromotionalPrice
      v-if="batchVisible.batchPriceAndPromotionalPrice"
      v-model="batchVisible.batchPriceAndPromotionalPrice"
      :select-records="selectRecords"
      :store-tree-list="selectData.storeData"
    />
  </div>
  <!-- 导出 -->
  <ExportListing
    v-if="exportListingVisible"
    v-model="exportListingVisible"
    :select-records="selectRecords"
    :form-data="darazData.formData"
  />
</template>
<script setup name="publishsdarazdarazonlineproduct">
  import { ref, reactive, onMounted, computed } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  // import { parseTime } from '@/utils/common';
  import { copy } from '@/utils/common';
  import {
    queryOaNewCategory,
    shortcuts,
    getProdTagListApi,
    getLogisListApi,
    getDevTypeListApi,
    getListuserbyrole,
    getModelCreatorList,
    getStoreList,
    getSiteListApi
  } from '@/api/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import CateDialog from '@/components/CateDialog.vue';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    getProducts,
    bacthUpdateApi
  } from '@/api/publishs/darazonlineproduct';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import LogDialog from './componentes/LogDialog.vue';
  import OffLineOrDelDialog from './componentes/OffLineOrDelDialog.vue';
  import ExportListing from './componentes/ExportListing.vue';
  import BatchUpdateStock from './componentes/BatchUpdateStock.vue';
  import PriceAndPromotionalPrice from './componentes/PriceAndPromotionalPrice.vue';
  import { cloneDeep } from 'lodash-es';

  const darazData = reactive({
    // 初始化查询条件
    initFormData: {
      oaList: [], // oa类目
      bizzOwnerIdList: [], //  开发专员:多选
      prodAttrList: [], //  商品标签
      logisAttr: [], //  物流属性:多选
      devTypeList: [] //  开发类型:多选
    },
    // form表单数据
    formData: {
      page: 1,
      limit: 50,
      orgId: '', // 部门
      salePersonId: '', // 销售员
      prodIsSaleStatusList: [],
      status: 'Active',
      storeAcctIdList: [], // 店铺
      siteCode: [], // 站点
      cateIdList: [],
      skuType: 1,
      // prodPSkuList: ['DZYG7G67', 'FEDB3B42'],
      // prodSSkuList: ['DZYG7G67-B'],
      // storePSkuList: [''],
      // storeSSkuList: ['ATMD3A07-W', 'ATMD3A07-W'],
      // itemIdList: [],
      prodTags: [],
      salesType: 1,
      listingTime: [] //  时间
    }
  });

  // tab list
  const tabList = ref([
    { label: '在线', count: '', status: '0', index: 0 },
    { label: '审核中', count: '', status: '1', index: 1 },
    { label: '已下架', count: '', status: '2', index: 2 },
    { label: '已暂停', count: '', status: '3', index: 3 },
    { label: '已删除', count: '', status: '4', index: 4 }
  ]);
  const activeKey = ref('0');

  onMounted(async () => {
    // 获取店铺信息
    const { data } = await getStoreList('daraz');
    selectData.storeData = data?.children;
    // 获取站点
    {
      const { data } = await getSiteListApi('daraz');
      selectData.salesSite = data;
    }
    Promise.all([
      getProdTagListApi(),
      getLogisListApi(),
      getDevTypeListApi(),
      getModelCreatorList(),
      getListuserbyrole(),
      queryOaNewCategory()
    ])
      .then((res) => {
        // 商品标签
        darazData.initFormData.prodAttrList = res[0].data.map(
          (item) => item.name
        );
        //物流属性
        darazData.initFormData.logisAttr = res[1].data.map((item) => item.name);
        //开发类型
        darazData.initFormData.devTypeList = res[2].data.map(
          (item) => item.name
        );
        //开发专员
        darazData.initFormData.bizzOwnerIdList = res[4].data.map((item) => ({
          value: item.id,
          label: item.userName
        }));
        //OA新类目
        darazData.initFormData.oaList = JSON.parse(res[5].data);
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
  });

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 300;
  });

  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };

  // 类目组件
  const showCateDialog = ref(false);
  const handleCateDialogClose = (e) => {
    showCateDialog.value = e.isShow;
    if (!e.cate) {
      return;
    }
    darazData.formData.cateName = e.cate.value.fullCateName;
    darazData.formData.cateOaId = e.cate.value.categoryId;
  };

  // 商品父SKU弹窗
  const showPskuDetailDialog = ref(false);
  let prodPId = ref();
  const openPskuDetails = async (id) => {
    prodPId.value = id;
    showPskuDetailDialog.value = true;
  };
  const handelPskuDialogClose = (e) => {
    prodPId.value = '';
    showPskuDetailDialog.value = e.isShow;
  };
  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    darazData.formData.salesLeft = '';
    darazData.formData.salesRight = '';
    darazData.formData.onlineCountRight = '';
  };

  const handleClick = (tab) => {
    darazData.formData.page = 1;
    // if (tab.props.name !== '-2' && activeKey.value !== tab.props.name) {
    //   darazData.formData.queryTimeType = 3;
    //   darazData.formData.orderByType = '';
    // } else if (tab.props.name === '-2' && activeKey.value !== tab.props.name) {
    //   darazData.formData.orderByType = '';
    //   darazData.formData.queryTimeType = 1;
    //   darazData.formData.isPublish = false;
    // } else if (tab.props.name === '0' && activeKey.value !== tab.props.name) {
    //   darazData.formData.isPublish = false;
    // }
    // if (tab.props.name != '-2' && tab.props.name != '0') {
    //   darazData.formData.isPublish = '';
    // }
    activeKey.value = tab.props.name;
    onSubmit();
  };

  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 提交查询
  const getSearchParams = () => {
    let status = ['Active', 'Pending QC', 'InActive', 'Suspended', 'Deleted'];
    // console.log(activeKey.value);
    darazData.formData.status = status[activeKey.value];
    // OA新类目
    if (darazData.formData.cateIdList?.length > 0) {
      darazData.formData.prodCateOaIdList = [];
      darazData.formData.cateIdList.forEach((item) => {
        darazData.formData.prodCateOaIdList.push(item[item.length - 1]);
      });
    } else {
      darazData.formData.prodCateOaIdList = [];
    }
    // SKU
    if (darazData.formData.skuVal && darazData.formData.skuVal != '') {
      darazData.formData.prodPSkuList =
        darazData.formData.prodSSkuList =
        darazData.formData.storePSkuList =
        darazData.formData.storeSSkuList =
          [];
      let skuName = [
        'prodPSkuList',
        'prodSSkuList',
        'storePSkuList',
        'storeSSkuList'
      ];
      darazData.formData[skuName[darazData.formData.skuType]] =
        darazData.formData.skuVal.split(',');
    } else {
      darazData.formData.prodPSkuList =
        darazData.formData.prodSSkuList =
        darazData.formData.storePSkuList =
        darazData.formData.storeSSkuList =
          [];
    }
    if (darazData.formData.itemIds && darazData.formData.itemIds != '') {
      darazData.formData.itemIdList = darazData.formData.itemIds.split(',');
    } else {
      darazData.formData.itemIdList = [];
    }
    // 刊登时间
    if (darazData.formData.listingTime?.length > 0) {
      darazData.formData.listingStartTime =
        darazData.formData.listingTime[0] + ' 00:00:00';
      darazData.formData.listingEndTime =
        darazData.formData.listingTime[1] + ' 23:59:59';
    } else {
      darazData.formData.listingStartTime = '';
      darazData.formData.listingEndTime = '';
    }
  };
  const onSubmit = async () => {
    tableData.value = null;
    darazData.formData.page = currentPage.value;
    darazData.formData.limit = limit.value;
    getSearchParams();

    if (!darazData.formData.storeAcctIdList) {
      ElMessage.warning('请选择店铺');
      return;
    }

    tableDataLoading.value = true;

    const { data, code, count } = await getProducts({
      ...darazData.formData,
      storeAcctIdList:
        typeof darazData.formData.storeAcctIdList === 'number'
          ? [darazData.formData.storeAcctIdList]
          : darazData.formData.storeAcctIdList
    });
    if (code == '0000') {
      tableData.value = data?.map((item) => {
        item.displayCount = 3;
        item.published =
          item.subProducts &&
          item.subProducts.filter((c) => c.published == true);
        return item;
      });
    }
    tableDataLoading.value = false;
    total.value = count;
    getTabCount(total.value);
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount > 10000 ? '>10000' : totalCount;
      }
    });
  };

  let tableDataRef = ref(null);
  const selectRecords = ref([]);
  // 获取复选框选中的数据
  const getSelectedList = (needReturn = true) => {
    // 获取表格多选数据
    const $table = tableDataRef.value;
    let index = tabList.value.filter(
      (item) => item.status == activeKey.value
    )[0].index;
    selectRecords.value = $table[index].getCheckboxRecords();
    if (needReturn) {
      if (selectRecords.value.length === 0) {
        ElMessage.warning('请选择要处理的数据！');
        return false;
      } else {
        return true;
      }
    }
  };

  // // 生成店铺商品
  // const getListing = async () => {
  //   if (getSelectedList()) {
  //     try {
  //       tableDataLoading.value = true;
  //       const { code, data } = await createProd({
  //         prodPIdList: selectRecords.value?.map((item) => item.prodPId),
  //         storeAcctId: darazData.formData.storeAcctIdList
  //       });
  //       tableDataLoading.value = false;
  //       if (code === '0000') {
  //         ElMessage.success('生成店铺商品成功！');
  //         onSubmit();
  //       } else {
  //         let errMsg = data?.join('');
  //         ElMessageBox.alert(`<div>${errMsg}</div>`, '操作结果', {
  //           dangerouslyUseHTMLString: true,
  //           confirmButtonText: '确认'
  //         });
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       tableDataLoading.value = false;
  //     }
  //   }
  // };
  // // 删除店铺商品
  // const deleteListing = () => {
  //   if (getSelectedList()) {
  //     let ids = selectRecords.value?.map((item) => item.id);
  //     ElMessageBox.confirm('确定要删除店铺商品吗?', '提示', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'Warning'
  //     }).then(async () => {
  //       const { code, msg } = await deleteRecord(ids);
  //       if (code == '0000') {
  //         ElMessage.success(msg);
  //         onSubmit();
  //       }
  //     });
  //   }
  // };

  // 导出店铺商品
  const exportListingVisible = ref(false);
  const exportListing = () => {
    getSearchParams();
    getSelectedList(false);
    exportListingVisible.value = true;
  };

  // 分页
  const currentPage = ref(1);
  const limit = ref(50);
  const total = ref(0);
  const handleSizeChange = (val) => {
    limit.value = val;
    onSubmit();
  };
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit();
  };

  // 查看全部时，将所有数据展示
  const viewAll = (row) => {
    row.displayCount = row.subProducts.length;
  };
  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };

  // 部门和销售人员数据
  const selectData = reactive({
    storeData: [],
    salesSite: []
  });

  // #region调价
  const handleExportUpdatePrice = () => {
    window.location.href = '/api/lms/static/templet/daraz导入店铺调价.xlsx ';
  };
  const fileList = ref();
  const uploadLoading = ref(false);
  const handleExportBefore = () => {
    uploadLoading.value = true;
  };
  const handleExportResult = (result) => {
    const { code, msg } = result;
    uploadLoading.value = false;
    if (code === '0000') {
      try {
        let _msg = JSON.parse(msg),
          msgStr = '';
        for (let key in _msg) {
          msgStr +=
            key + '：' + _msg[key].join().split('\n').join('<br>') + '<br>';
        }
        ElMessageBox.alert(
          `<div style="max-height:300px;overflow-y: auto">${msgStr}</div>`,
          '操作结果',
          {
            dangerouslyUseHTMLString: true
          }
        );
        return true;
      } catch (error) {
        ElMessage.success(msg);
      }
    } else {
      ElMessage.error(msg || '上传失败');
    }
  };
  const handleExportError = () => {
    uploadLoading.value = false;
  };
  // #endregion调价

  // #region 操作日志
  const logVisible = ref(false);
  const checkedRow = ref({});
  const handleViewLog = (row) => {
    logVisible.value = true;
    checkedRow.value = cloneDeep(row);
  };
  // #endregion 操作日志

  // #region 批量操作 函数
  const handleUpdate = async (isBatch = true, row) => {
    let params = [];
    if (isBatch) {
      params = selectRecords.value.map((v) => ({
        itemId: v.itemId,
        storeAcctId: v.storeAcctId
      }));
    } else {
      params.push({
        itemId: row.itemId,
        storeAcctId: row.storeAcctId
      });
    }
    try {
      const { msg, code } = await bacthUpdateApi(params);
      if (code === '0000') {
        ElMessage.success('同步成功');
      } else {
        ElMessageBox.alert(msg || '请求失败', '更新lisiting结果', {
          confirmButtonText: '确认',
          type: 'error',
          dangerouslyUseHTMLString: true,
          customClass: 'messageOverflow'
        });
      }
      onSubmit();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // #endregion 批量操作 函数

  // #region 批量操作
  const batchOperateType = ref();
  const batchVisible = reactive({});
  // 仔细对照tablist定义的status
  const batchList = [
    {
      label: '批量同步',
      value: 'batchUpdate',
      showTab: ['0', '1', '2', '3', '4']
    },
    {
      label: '修改库存',
      value: 'batchUpdateStock',
      showTab: ['0', '1', '2', '3']
    },
    {
      label: '批量下架/删除',
      value: 'batchOfflineOrDel',
      permission: 'darazOnlineBatchoffLineOrDel',
      showTab: ['0', '1', '2', '3']
    },
    {
      label: '调整原价和促销价',
      value: 'batchPriceAndPromotionalPrice',
      permission: 'darazOnlineBatchModifyPrice',
      showTab: ['0', '1', '2', '3']
    }
  ];
  const handleBatch = () => {
    // 选择数据
    const whiteList = ['batchUpdate', 'batchUpdateStock'];
    // 是否需要校验有选中数据
    const isNeedValidate = whiteList.includes(batchOperateType.value);
    let returnTag = getSelectedList(isNeedValidate);
    if (isNeedValidate && !returnTag) return;
    if (batchOperateType.value === 'batchUpdate') {
      // 批量更新
      handleUpdate();
    } else {
      batchVisible[batchOperateType.value] = true;
    }
  };
  // #endregion  批量操作
</script>

<style scoped lang="scss">
  :deep(.WH80) {
    width: 80px !important;
    .el-input.el-input--small {
      width: 80px;
    }
  }

  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
      display: flex;
    }
  }

  .search_item_cascader {
    :deep(.el-input) {
      height: 24px;
    }
    :deep(.el-cascader__tags .el-tag) {
      margin: 0 0 0 5px;
    }
    :deep(.el-tag--small) {
      padding: 0 2px;
    }
    :deep(.el-cascader__tags) {
      flex-wrap: nowrap;

      span:first-child {
        max-width: 40px;
      }
      span:last-child {
        width: 30px;
      }
      input {
        min-width: 10px;
        height: auto;
        margin: 0;
      }
    }
  }
  .copy_icon {
    margin-left: 5px;
    color: #666;
    cursor: pointer;
  }
</style>
<style>
  .sheinMallElMsg {
    --el-messagebox-width: 800px;
  }
  .ml12 {
    margin-left: 12px;
  }
</style>
