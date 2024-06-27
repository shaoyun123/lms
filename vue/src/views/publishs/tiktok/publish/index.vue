<template>
  <!-- tiktok刊登页面 -->
  <div v-loading="pageLoading" class="publish_wrapper app-container">
    <!-- 筛选条件表单 start -->
    <el-card ref="searchCard" class="search_card common_split_bottom">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item
          label="店铺"
          prop="storeAcctId"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.storeAcctId"
            :options="initFormData.storeTreeList"
            filterable
            clearable
            collapse-tags
            :props="{
              emitPath: false
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="TikTok类目"
          prop="platCateIdList"
          class="search_item_cascader"
        >
          <z-cascader
            v-model="formData.platCateIdList"
            :data="initFormData.tiktokList"
            :props="{
              label: 'cnName',
              children: 'children',
              value: 'categoryId'
            }"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.platCateIdList"
            :options="initFormData.tiktokList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'cnName',
              value: 'categoryId'
            }"
          ></el-cascader> -->
        </el-form-item>
        <el-form-item
          label="OA新类目"
          prop="cateOaIdList"
          class="search_item_cascader"
        >
          <z-cascader
            v-model="formData.cateOaIdList"
            :data="initFormData.oaList"
            :props="{
              label: 'title',
              children: 'data',
              value: 'value'
            }"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.cateOaIdList"
            :options="initFormData.oaList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'title',
              children: 'data'
            }"
          ></el-cascader> -->
        </el-form-item>

        <el-form-item label="商品类型" prop="isMultiSku">
          <el-select v-model="formData.isMultiSku" clearable filterable>
            <el-option value="" label="全部" />
            <el-option :value="false" label="单属性" />
            <el-option :value="true" label="多属性" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签" prop="tag">
          <el-select
            v-model="formData.tag"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in initFormData.tagList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物流属性" prop="logisAttrList">
          <el-select
            v-model="formData.logisAttrList"
            placeholder="请选择"
            :class="formData.logisAttrList.length > 1 ? 'hide_tag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.logisAttrList.length > 1" type="info"
                >已选{{ formData.logisAttrList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.logisAttr"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开发专员" prop="bizzOwnerIds">
          <el-select
            v-model="formData.bizzOwnerIds"
            placeholder="请选择"
            :class="formData.bizzOwnerIds.length > 1 ? 'hide_tag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.bizzOwnerIds.length > 1" type="info"
                >已选{{ formData.bizzOwnerIds.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.bizzOwnerIdList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态" prop="prodIsSaleStatus">
          <MultiSelect
            v-model="formData.prodIsSaleStatus"
            :option-obj="{
              optionList: prodSaleStatusOptionList,
              value: 'value',
              label: 'label'
            }"
          />
        </el-form-item>
        <el-form-item label="开发类型" prop="devTypeList">
          <el-select
            v-model="formData.devTypeList"
            placeholder="请选择"
            :class="formData.devTypeList?.length > 1 ? 'hide_tag' : ''"
            filterable
            clearable
            multiple
            ><template #prefix>
              <el-tag v-if="formData.devTypeList?.length > 1" type="info"
                >已选{{ formData.devTypeList?.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.devTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="tortBanListing" label="侵权状态"
          ><el-select
            v-model="formData.tortBanListing"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in initFormData.tortBanListings"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey == '-2'"
          label="生成情况"
          prop="existListing"
        >
          <el-select v-model="formData.existListing" clearable filterable>
            <el-option :value="false" label="未生成" />
            <el-option :value="true" label="已生成" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey == '-2'"
          label="刊登情况"
          prop="published"
        >
          <el-select v-model="formData.published" clearable filterable>
            <el-option :value="false" label="未刊登" />
            <el-option :value="true" label="已刊登" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>

        <el-form-item prop="time">
          <el-select v-model="formData.timeType" class="form_left" filterable>
            <el-option value="PROD_CREATE_TIME" label="父商品创建时间" />
            <el-option value="PROD_AUDIT_TIME" label="父商品审核时间" />
            <el-option
              v-if="activeKey === 1"
              value="LOCAL_PUBLISH_TIME"
              label="刊登时间"
            />
            <el-option
              v-if="activeKey === 1"
              value="LISTING_PUBLISH_TIME"
              label="全球商品创建时间"
            />
            <el-option
              v-if="activeKey !== -2"
              value="LISTING_CREATE_TIME"
              label="listing生成时间"
            />
            <el-option
              v-if="activeKey === 3"
              value="TIMING_PUBLISH_TIME"
              label="定时刊登"
            />
          </el-select>
          <el-date-picker
            v-model="formData.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 200px"
            class="form_right"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item prop="preAvailableStockType" class="form_range"
          ><el-select
            v-model="formData.preAvailableStockType"
            class="form_left"
            filterable
          >
            <el-option :value="1" label="预计可用库存含在途" />
            <el-option :value="2" label="预计可用库存不含在途" />
          </el-select>
          <el-select
            v-model="formData.isCheckAllSkuStock"
            filterable
            class="middle_search_item"
          >
            <el-option :value="true" label="全部属性" />
            <el-option :value="false" label="存在属性" />
          </el-select>
          <el-input
            v-model="formData.preAvailableStockMin"
            class="form_right"
            clearable
          />
          <div class="range_link">-</div>
          <el-input v-model="formData.preAvailableStockMax" clearable />
        </el-form-item>
        <el-form-item prop="searchList">
          <el-select
            v-model="formData.searchType"
            class="form_left"
            clearable
            filterable
          >
            <el-option value="pSkuList" label="商品父SKU" />
            <el-option value="sSkuList" label="商品子SKU" />
            <el-option value="cnTitle" label="商品中文" />
            <el-option value="enTitle" label="商品英文" />
          </el-select>
          <el-input
            v-model="formData.searchList"
            clearable
            class="form_right form_left"
            style="width: 270px !important"
            :placeholder="
              formData.searchType.includes('List') ? '多个逗号隔开' : '标题'
            "
            @blur="commonDivideComma($event)"
          />
          <el-select
            v-if="formData.searchType.includes('List')"
            v-model="formData.skuVagueFlag"
            class="form_right WH80"
          >
            <el-option :value="false" label="精确" />
            <el-option :value="true" label="模糊" />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchSalesType" class="form_range">
          <el-select
            v-model="formData.searchSalesType"
            class="form_left"
            clearable
            filterable
          >
            <el-option :value="1" label="7日销量" />
            <el-option :value="2" label="15日销量" />
            <el-option :value="3" label="30日销量" />
          </el-select>
          <el-input v-model="formData.salesMin" class="form_right" clearable />
          <div class="range_link">-</div>
          <el-input v-model="formData.salesMax" clearable />
        </el-form-item>
        <el-form-item prop="canSale" label="禁售"
          ><el-select
            v-model="formData.canSale"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="禁售" :value="0" />
            <el-option label="非禁售" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="orderBy" label="排序"
          ><el-select
            v-model="formData.orderBy"
            placeholder="请选择"
            filterable
            clearable
          >
            <template
              v-for="item in initFormData.orderByList"
              :key="item.value"
            >
              <!--刊登成功 刊登时间正序，刊登时间倒序 -->
              <template
                v-if="
                  ![
                    'pltl.local_publish_time desc',
                    'pltl.local_publish_time asc'
                  ].includes(item.value) && activeKey !== 1
                "
              >
                <el-option :label="item.key" :value="item.value" />
              </template>
              <template v-else-if="activeKey === 1">
                <el-option :label="item.key" :value="item.value" />
              </template>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item v-if="activeKey === 2" prop="failReason" label="失败原因"
          ><el-select
            v-model="formData.failReason"
            placeholder="请选择"
            allow-create
            filterable
            clearable
          >
            <el-option
              v-for="item in initFormData.failReasonList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleResetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选条件表单 end -->

    <!-- 数据展示列表 start -->
    <el-card
      v-loading="tableDataLoading"
      class="card_position list_card common_split_bottom"
    >
      <el-tabs
        v-model="activeKey"
        type="card"
        class="demo-tabs"
        @tab-click="handleTab"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.label"
          :label="`${item.label}(${item.count})`"
          :name="item.status"
        >
        </el-tab-pane>
      </el-tabs>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="height"
        border
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
        :scroll-y="{ gt: 10 }"
        :show-overflow="true"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column title="图片" width="100" field="pImg">
          <template #default="{ row }">
            <ImagePop
              :src="activeKey === -2 ? row.pImg : row.imgUrlList?.[0]"
            />
          </template>
        </vxe-column>
        <vxe-column field="enTitle" title="Global标题/店铺">
          <template #default="{ row }">
            {{ activeKey === -2 ? row.enTitle : row.productName }}<br />
            <span v-if="activeKey !== -2">店铺：{{ row.storeAcct }}</span>
          </template></vxe-column
        >
        <vxe-column
          v-if="activeKey !== -2"
          field="publishSite"
          title="发布站点"
        >
        </vxe-column>
        <vxe-column field="sales" title="销量">
          <template #default="{ row }">
            7日: {{ row.saleNumSeven }}<br />
            15日: {{ row.saleNumFifteen }}<br />
            30日:{{ row.saleNumThirty }}
          </template>
        </vxe-column>
        <vxe-column field="prodPSku" title="父SKU">
          <template #default="{ row }">
            <div @click="openPskuDetails(row.prodPId)">
              父SKU: <span style="color: #409eff">{{ row.prodPSku }}</span>
            </div>
            global_product_id: {{ row.globalProductId }}<br />

            <template v-if="row.listingStatus === 2">
              <el-popover placement="right" :width="300" trigger="hover"
                ><template #reference>
                  <el-tag type="danger">败</el-tag>
                </template>
                <div class="word-break">{{ showRealErrMsg(row) }}</div>
              </el-popover>
            </template>
            <el-tag v-if="row.listingStatus === 1" type="success">已</el-tag>
          </template>
        </vxe-column>
        <vxe-column width="500" class-name="sub_table_cell">
          <template #header>
            <div style="display: flex">
              <div style="width: 120px">商品子SKU</div>
              <div style="width: 80px">颜色</div>
              <div style="width: 80px">尺寸</div>
              <div style="width: 50px">在售</div>
              <div style="width: 150px">可用/在途/未派</div>
            </div>
          </template>
          <template #default="{ row }">
            <vxe-table
              :data="
                row?.prodListingSubSkuTiktokDtoList?.slice(0, row.displayCount)
              "
              :show-header="false"
            >
              <vxe-column field="storeSSku" width="120">
                <template #default="{ row: sonRow }"
                  ><div>
                    {{ activeKey === -2 ? sonRow.prodSSku : sonRow.storeSSku }}
                  </div></template
                >
              </vxe-column>
              <vxe-column field="color" width="80" />
              <vxe-column field="size" width="80" />
              <vxe-column field="isSale" width="50"
                ><template #default="{ row: sonRow }"
                  ><el-tag :type="sonRow.isSale ? 'success' : 'danger'">{{
                    sonRow.isSale ? '在售' : '停售'
                  }}</el-tag></template
                >
              </vxe-column>
              <vxe-column width="150">
                <template #default="{ row: sonRow }">{{
                  (sonRow.stockNum || 0) -
                  (sonRow.reservationNum || 0) +
                  ' / ' +
                  (sonRow.orderNotInNum || 0) +
                  ' / ' +
                  (sonRow.lackUnPaiNum || 0)
                }}</template>
              </vxe-column>
            </vxe-table>
            <div
              v-if="
                row?.prodListingSubSkuTiktokDtoList?.length > DEFAULT_TR_LENGTH
              "
              style="text-align: center"
              @click="
                row.displayCount > DEFAULT_TR_LENGTH
                  ? hideList(row)
                  : viewAll(row)
              "
            >
              <a
                v-if="row.prodListingSubSkuTiktokDtoList"
                style="color: #409eff; cursor: pointer"
                >{{
                  row.displayCount > DEFAULT_TR_LENGTH ? '收起' : '展开所有'
                }}</a
              >
            </div>
          </template></vxe-column
        >
        <vxe-column v-if="activeKey === 0" field="creator" title="创建人" />
        <vxe-column
          v-if="[1, 2, 3].includes(activeKey)"
          field="modifier"
          title="提交人"
          width="120"
          ><template #default="{ row }">{{
            row.modifier || row.creator
          }}</template></vxe-column
        >
        <vxe-column title="时间">
          <template #default="{ row }">
            <div v-if="[-2].includes(activeKey)">
              创建：{{ row.prodCreateTime }}
            </div>
            <div>&nbsp;审核：{{ row.prodAuditTime }}</div>
            <div v-if="[0, 1, 2].includes(activeKey)">
              生成：{{ transferDate(row.listingCreateTime) }}
            </div>
            <div v-if="[1, 3].includes(activeKey)">
              全球商品创建：{{ transferDate(row.listingPublishTime) }}
            </div>
            <div v-if="[1, 3].includes(activeKey)">
              刊登：{{ transferDate(row.localPublishTime) }}
            </div>
            <div v-if="activeKey === 3 && row.listTiming">
              定时： {{ transferDate(row.listTiming) }}
            </div>
          </template>
        </vxe-column>

        <vxe-column
          v-if="[0, 1, 2, 3].includes(activeKey)"
          title="操作"
          width="120"
        >
          <template #default="{ row }">
            <el-button
              v-if="activeKey !== -2"
              type="primary"
              @click="handletDetail(row)"
              >详情</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[50, 100, 240, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="tools_btn">
        <span v-if="activeKey == '0' || activeKey == '-2'" class="rest_publish"
          ><span>今日剩余刊登量: {{ todayRemainCount }}</span
          ><span
            class="refresh_icon"
            :class="{ rotate: isRefresh }"
            @click="handleRefresh"
          >
            <el-icon color="#409EFC" size="18"><Refresh /></el-icon> </span
        ></span>
        <el-button
          v-if="activeKey == '-2'"
          type="primary"
          @click="handleExportPublic()"
          >导出刊登数据</el-button
        >
        <el-button
          v-if="activeKey == '-2'"
          type="primary"
          @click="handleCreate()"
          >生成待刊登信息</el-button
        >
        <el-button
          v-if="activeKey == '0'"
          :loading="publishLoading"
          type="primary"
          @click="handleSignPublicSuccess()"
          >标记为刊登成功</el-button
        >
        <el-button
          v-if="activeKey == '0' || activeKey == '2'"
          type="danger"
          :loading="delLoading"
          @click="handleDelete()"
          >删除</el-button
        >
        <el-button
          v-if="activeKey == '0'"
          :loading="publishLoading"
          type="primary"
          @click="handlePublish('publish')"
          >立即刊登</el-button
        >
        <el-button
          v-if="activeKey == '2'"
          :loading="publishLoading"
          type="primary"
          @click="handlePublish('republish')"
          >重新刊登</el-button
        >
        <el-button
          v-if="activeKey == '0' || activeKey == '2'"
          type="primary"
          @click="handleTimimgPublish()"
          >定时刊登</el-button
        >
        <el-button
          v-if="activeKey == '3'"
          type="danger"
          :loading="cancelTimimgLoading"
          @click="handleCancelTimimgPublish()"
          >取消定时刊登</el-button
        >
        <el-button
          v-if="activeKey == '1'"
          type="danger"
          @click="handleSucTabDelete()"
          >删除</el-button
        >
      </div>
    </el-card>
    <!-- 数据展示列表 end -->

    <!-- 全球商品 -->
    <CreateGlobalProd
      v-model="globalCreteVisible"
      :row-checked-list="rowCheckedList"
      :store-list="initFormData.storeList"
      :store-acct-id="storeAcctId"
      @handle-search="handleSearch"
      @handle-refresh="handleRefresh"
    />
    <!-- 详情 -->
    <DeTailDialog
      v-if="detailVisible"
      v-model="detailVisible"
      :checked-row="checkedRow"
      :status="activeKey"
      :tiktok-list="initFormData.tiktokList"
      @handle-search="handleSearch"
    />
    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />
    <TimingPublish
      v-model="timingPublishVisible"
      :row-checked-list="rowCheckedList"
      :store-list="initFormData.storeList"
      :store-acct-id="storeAcctId"
      @handle-search="handleSearch"
      @handle-refresh="handleRefresh"
    />
    <!-- 立即刊登 -->
    <PublishDialog
      v-if="isRePublish"
      v-model="publishVisible"
      :is-republish="isRePublish"
      :row-checked-list="rowCheckedList"
      :store-list="initFormData.storeList"
      :store-acct-id="storeAcctId"
      @handle-search="handleSearch"
      @handle-refresh="handleRefresh"
    />
  </div>
</template>

<script setup name="publishstiktokpublish">
  import { reactive, onMounted, ref, computed } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import {
    queryOaNewCategory,
    getDevTypeListApi,
    getProdTagListApi,
    getLogisListApi,
    getPlatCategoryTreeApi,
    getSiteListApi,
    getCustomers,
    getStoreList
  } from '@/api/common';
  import {
    getDevelopUserListApi,
    queryPageApi,
    // publishListingApi,
    delListingApi,
    cancelListTimingApi,
    getInitEnumApi,
    getStoreListApi,
    manualMarkingListingApi,
    getTodayPublishCountApi
  } from '@/api/publishs/tiktokpublish';
  import { transBlob } from '@/utils/downloadFile';
  import { commonDivideComma } from '@/utils/divide';
  import { transferDate } from '@/utils/common';
  import { shortcuts } from '@/api/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { DEFAULT_TR_LENGTH } from './config';
  import ImagePop from '@/components/ImagePop/index.vue';
  import CreateGlobalProd from './components/CreateGlobalProd.vue';
  import DeTailDialog from './components/DeTailDialog.vue';
  import TimingPublish from './components/TimingPublish.vue';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import PublishDialog from './components/PublishDialog.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';

  // 商品父SKU弹窗----
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
  const searchCard = ref();
  const initFormData = reactive({
    storeTreeList: [], // 店铺
    tiktokList: [], // tiktok类目
    oaList: [], // oa类目
    tagList: [], // 商品标签
    logisAttr: [], // 物流属性
    bizzOwnerIdList: [], // 开发专员
    devTypeList: [] // 开发类型
  });
  const pageLoading = ref(false);
  const siteList = ref();
  onMounted(async () => {
    pageLoading.value = true;
    Promise.all([
      getStoreList('tiktok'),
      getPlatCategoryTreeApi('tiktok'),
      queryOaNewCategory(),
      getProdTagListApi(),
      getLogisListApi(),
      getDevelopUserListApi(),
      getDevTypeListApi(),
      getSiteListApi('tiktok'),
      getCustomers({ roleNames: 'tiktok专员' }),
      getInitEnumApi(),
      getStoreListApi()
    ])
      .then((res) => {
        initFormData.storeTreeList = res[0].data.children;
        initFormData.tiktokList = res[1].data;
        initFormData.oaList = JSON.parse(res[2].data);
        initFormData.tagList = res[3].data;
        res[4]?.data?.forEach((item) => {
          initFormData.logisAttr.push(
            { ...item, code: item.name },
            { code: `no_${item.name}`, name: `不含 ${item.name}` }
          );
        });
        initFormData.bizzOwnerIdList = res[5].data;
        initFormData.devTypeList = res[6].data;
        siteList.value = res[7].data;
        initFormData.salePersonList = res[8]?.data?.userList || [];
        initFormData.tortBanListings = res[9]?.data?.tortBanListings || [];
        initFormData.failReasonList = res[9]?.data?.failReasonList || [];
        initFormData.orderByList = res[9]?.data?.orderByList || [];
        initFormData.storeList = (res[10]?.data || []).map((v) => ({
          ...v,
          name: v.storeAcct
        }));
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        pageLoading.value = false;
      });
  });

  const formRef = ref();
  const formData = reactive({
    logisAttrList: [],
    bizzOwnerIds: [],
    devTypeList: [],
    timeType: 'PROD_CREATE_TIME',
    preAvailableStockType: 2,
    isCheckAllSkuStock: false,
    tortBanListing: 'TIKTOK_NOT_TORT',
    searchSalesType: 1,
    searchType: 'pSkuList',
    skuVagueFlag: true,
    existListing: false,
    published: false,
    prodIsSaleStatus: [],
    canSale: 1
  });

  const activeKey = ref(-2);
  const tabList = ref([
    { label: '商品', count: 0, status: -2 },
    { label: '待刊登', count: 0, status: 0 },
    { label: '刊登中', count: 0, status: 3 },
    { label: '刊登成功', count: 0, status: 1 },
    { label: '刊登失败', count: 0, status: 2 }
  ]);
  // const tableIndexObj = {
  //   '-2': 0,
  //   0: 1,
  //   3: 2,
  //   1: 3,
  //   2: 4
  // };
  const prodSaleStatusOptionList = ref([
    {
      label: '全部在售',
      value: 2
    },
    {
      label: '部分在售',
      value: 1
    },
    {
      label: '全部停售',
      value: 0
    }
  ]);

  let tableData = ref();
  const tableDataLoading = ref(false);
  const tableRef = ref();
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCard.value?.$el?.clientHeight;
    return clientHeight - 166 - searchCardHeight;
  });
  // const filterStore = (node, keyword) => {
  //   const label = node?.label?.trim();
  //   const text = node?.text?.trim();
  //   const _keyword = keyword.trim().replaceAll('，', ',').split(',');
  //   const hasLabel = _keyword.some((item) => label.includes(item));
  //   const hasText = _keyword.some((item) => text.includes(item));
  //   if (hasLabel || hasText) {
  //     return node;
  //   }
  // };
  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.preAvailableStockMin = null;
    formData.preAvailableStockMax = null;
    formData.searchList = '';
    formData.salesMin = null;
    formData.salesMax = null;
    formData.skuVagueFlag = true;
    formData.timeType = 'PROD_CREATE_TIME';
    formData.isCheckAllSkuStock = false;
    formData.prodIsSaleStatus = [];
  };

  const setParams = () => {
    let obj = { ...formData };
    obj.existLogisAttrs = formData.logisAttrList.filter(
      (item) => !item.includes('no_')
    );
    obj.notExistLogisAttrs = formData.logisAttrList
      .filter((item) => item.includes('no_'))
      .map((item) => item.replace('no_', ''));
    // 全球商品创建时间仅存在于 刊登成功页签
    if (activeKey.value !== 1 && formData.timeType === 'LISTING_PUBLISH_TIME') {
      formData.timeType = 'PROD_CREATE_TIME';
      formData.time = null;
    }
    // 刊登时间仅存在于 刊登成功页签
    if (activeKey.value !== 1 && formData.timeType === 'LOCAL_PUBLISH_TIME') {
      formData.timeType = 'PROD_CREATE_TIME';
      formData.time = null;
    }
    // 定时刊登仅存在 刊登中
    if (activeKey.value !== 3 && formData.timeType === 'TIMING_PUBLISH_TIME') {
      formData.timeType = 'PROD_CREATE_TIME';
      formData.time = null;
    }
    // 在售状态
    // if (formData.isSale === '') {
    //   formData.isSale = null;
    // }
    // listing生成时间不存在于 商品页签
    if (activeKey.value === -2 && formData.timeType === 'LISTING_CREATE_TIME') {
      formData.timeType = 'PROD_CREATE_TIME';
      formData.time = null;
    }
    if (formData.time) {
      obj.startTime = Date.parse(formData.time[0] + ' 00:00:00');
      obj.endTime = Date.parse(formData.time[1] + ' 23:59:59');
    }
    if (formData.searchList) {
      if (formData.searchType.includes('List')) {
        obj[formData.searchType] = formData.searchList.split(',');
      } else {
        obj[formData.searchType] = formData.searchList;
      }
    }
    if (formData.platCateIdList?.length) {
      obj.platCateIdList = formData.platCateIdList;
    }
    if (formData.cateOaIdList?.length) {
      obj.cateOaIdList = formData.cateOaIdList;
    }

    // 刊登时间排序仅存在刊登成功页签
    if (
      activeKey.value !== 1 &&
      ['pltl.local_publish_time desc', 'pltl.local_publish_time asc'].includes(
        formData.orderBy
      )
    ) {
      formData.orderBy = '';
    }
    obj.existListing = formData.existListing;
    if (activeKey.value !== -2) {
      obj.existListing = true;
    }
    obj.published = formData.published;
    if (activeKey.value !== -2) {
      delete obj.published;
    }
    return obj;
  };

  const handleSearch = async () => {
    const { limit, page } = paginationData;
    tableDataLoading.value = true;
    try {
      let obj = setParams();

      const { data, count } = await queryPageApi({
        listingStatus: activeKey.value,
        ...obj,
        limit,
        page
      });
      storeAcctId.value = formData.storeAcctId;
      tableData.value = data.map((item) => ({
        ...item,
        displayCount: DEFAULT_TR_LENGTH
      }));
      getTabCount(count);
      paginationData.total = count;
    } catch (err) {
      tableData.value = [];
      getTabCount(0);
      paginationData.total = 0;
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
      handleRefresh();
    }
  };

  const showRealErrMsg = ({
    listingErrMsg,
    prodListingTiktokLocalList = []
  }) => {
    let errMsg = '';
    if (listingErrMsg) {
      errMsg = '创建失败：' + listingErrMsg + '\n';
    }
    prodListingTiktokLocalList.forEach((item) => {
      if (!item.listingStatus && item.listingStatus !== undefined) {
        errMsg += item.salesSite + '站点发布失败:' + item.errMsg + '\n';
      }
    });
    return errMsg;
  };

  const handleTab = ({ paneName }) => {
    activeKey.value = paneName;
    handleSearch();
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      // item.count = 0;
      if (item.status === activeKey.value) {
        item.count = totalCount;
      }
    });
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleSearch();
  };

  const isRefresh = ref(false);

  // 点击刷新按钮
  const handleRefresh = () => {
    getTodayRemainCount();
  };

  const todayRemainCount = ref('');
  // 获取今日剩余刊登量
  const getTodayRemainCount = async () => {
    if (!formData.storeAcctId) {
      return ElMessage.warning('请先选择店铺');
    }
    try {
      isRefresh.value = true;
      const { code, data } = await getTodayPublishCountApi({
        storeAcctId: formData.storeAcctId
      });
      if (code === '0000') {
        console.log('data', data);
        todayRemainCount.value = data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      isRefresh.value = false;
    }
  };

  // 查看全部时，将所有都给到
  const viewAll = (row) => {
    row.displayCount = row.prodListingSubSkuTiktokDtoList.length;
  };

  // 收起多出部分时，只取前DEFAULT_TR_LENGTH条
  const hideList = (row) => {
    row.displayCount = DEFAULT_TR_LENGTH;
  };

  // 选中的当前行数据
  let checkedRow = ref({});
  // 选中多条数据
  let rowCheckedList = reactive([]);

  // 生成店铺商品
  const globalCreteVisible = ref(false);
  const storeAcctId = ref();
  const handleCreate = () => {
    // 获取选中的数据
    const $table = tableRef.value;
    rowCheckedList.value = $table.getCheckboxRecords();
    if (!rowCheckedList.value.length) return ElMessage.warning('请选择数据');
    globalCreteVisible.value = true;
  };

  // 详情
  const detailVisible = ref(false);
  const handletDetail = (row) => {
    detailVisible.value = true;
    // 销售属性
    const obj = {};
    (row?.prodListingSubSkuTiktokDtoList[0]?.salesAttributeList || []).forEach(
      (item, index) => {
        obj['attr' + index] = item.attributeId;
      }
    );
    checkedRow.value = {
      ...row,
      packageWeight: row.weight,
      packageHeight: row.height,
      packageWidth: row.width,
      packageLength: row.length,
      siteList: row.prodListingTiktokLocalList
        .filter((item) => item.status)
        .map((item) => item.salesSite),
      mainImage: row.imgUrlList[0],
      assitImageList: row.imgUrlList.slice(1),
      disabledSaleAttr: (
        row.prodListingSubSkuTiktokDtoList[0]?.salesAttributeList || []
      ).map((item) => item.attributeId),
      ...obj
    };
  };

  // 删除店铺商品
  const delLoading = ref(false);
  const handleDelete = () => {
    // 获取选中的数据
    const $table = tableRef.value;
    rowCheckedList.value = $table.getCheckboxRecords();
    if (!rowCheckedList.value.length) return ElMessage.warning('请选择数据');
    ElMessageBox.confirm(
      '仅删除该店铺下的刊登记录，如需重新刊登该商品，可至商品处重新生成该店铺的全球商品',
      '删除刊登记录',
      { confirmButtonText: '确定', cancelButtonText: '关闭', type: 'warning' }
    ).then(async () => {
      try {
        delLoading.value = true;
        const listingIdList = rowCheckedList.value
          .map((item) => item.listingId)
          .join();
        // 不删除全球商品
        const deleteGlobalProduct = false;
        const { msg } = await delListingApi(listingIdList, deleteGlobalProduct);
        ElMessage.success(msg || '操作成功');
        handleSearch();
      } catch (err) {
        console.log('err :>> ', err);
      } finally {
        delLoading.value = false;
      }
    });
  };
  // 立即刊登 重新刊登
  const publishLoading = ref(false);
  const publishVisible = ref(false);
  const isRePublish = ref('');
  const handlePublish = async (type) => {
    isRePublish.value = type;
    // 获取选中的数据
    const $table = tableRef.value;
    rowCheckedList.value = $table.getCheckboxRecords();
    if (!rowCheckedList.value.length) return ElMessage.warning('请选择数据');
    publishVisible.value = true;
  };

  // 定时刊登
  const timingPublishVisible = ref(false);
  const handleTimimgPublish = async () => {
    // 获取选中的数据
    const $table = tableRef.value;
    rowCheckedList.value = $table.getCheckboxRecords();
    if (!rowCheckedList.value.length) return ElMessage.warning('请选择数据');
    timingPublishVisible.value = true;
  };
  // 取消定时刊登
  const cancelTimimgLoading = ref(false);
  const handleCancelTimimgPublish = async () => {
    // 获取选中的数据
    const $table = tableRef.value;
    rowCheckedList.value = $table.getCheckboxRecords();
    if (!rowCheckedList.value.length) return ElMessage.warning('请选择数据');
    cancelTimimgLoading.value = true;
    try {
      const idList = rowCheckedList.value.map((item) => item.id);
      const { msg } = await cancelListTimingApi({ idList });
      ElMessage.success(msg);
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      cancelTimimgLoading.value = false;
    }
  };

  // 刊登成功页签 增加删除按钮
  const handleSucTabDelete = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }

    const listingIdList = checkedList.map((item) => item.id).join();
    const deleteGlobalProduct = false;
    const { code, msg } = await delListingApi(
      listingIdList,
      deleteGlobalProduct
    );
    if (code === '0000') {
      ElMessage.success(msg);
      handleSearch();
    } else {
      ElMessage.warning(msg || '删除失败，请重试！');
    }
  };

  // 导出刊登数据 将勾选数据的sku填充到查询条件：商品sku里面
  const handleExportPublic = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();

    await ElMessageBox.confirm('确认导出当前搜索条件下的刊登数据?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });

    formData.skuVagueFlag = false;
    formData.searchType = 'pSkuList';
    if (checkedList.length) {
      formData.searchList = checkedList.map((item) => item.prodPSku).join(',');
    }
    const { limit, page } = paginationData;
    let obj = setParams();
    const tempParams = {
      listingStatus: activeKey.value,
      ...obj,
      limit,
      page
    };

    try {
      tableDataLoading.value = true;
      transBlob({
        url: '/lms/tiktok/listing/exportUs',
        contentType: 'application/json',
        data: tempParams,
        fileName: '美国刊登数据导出' + Date.now() + '.xls'
      }).finally(() => {
        tableDataLoading.value = false;
        ElMessage.success('下载成功');
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 批量标记为刊登成功
  const handleSignPublicSuccess = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();

    if (!checkedList.length) return ElMessage.warning('请选择数据');
    const params = checkedList.map((item) => item.id);
    const { msg } = await manualMarkingListingApi(params);
    ElMessage.success(msg);
    handleSearch();
  };

  // 级联多选
  // const filterCascader = (node, keyword) => {
  //   if (
  //     node?.label?.trim().includes(keyword.trim()) ||
  //     node?.text?.trim().includes(keyword.trim())
  //   ) {
  //     return node;
  //   }
  // };
</script>

<style lang="scss" scoped>
  .tools_btn {
    display: flex;
    align-items: center;
  }
  .rest_publish {
    padding: 0 10px;
    color: rgb(64, 158, 255);
    display: flex;
    align-self: center;
    span {
      padding: 0 5px;
    }
  }
  .refresh_icon {
    cursor: pointer;
  }
  .rotate {
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  .word-break {
    white-space: break-spaces;
  }
  .middle_search_item {
    width: 50px !important;
    :deep(.el-input__wrapper) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
        0 1px 0 0 var(--el-input-border-color) inset,
        0 -1px 0 0 var(--el-input-border-color) inset;
    }
  }
  @import './index.scss';
</style>
