<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="app-container">
    <!-- 筛选条件表单 start -->
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="temuData.formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="temuData.formData.orgId"
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
            v-model="temuData.formData.salePersonId"
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
        <el-form-item label="店铺" prop="storeAcctId">
          <el-select
            v-model="temuData.formData.storeAcctId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in selectData.storeData"
              :key="item.id"
              :label="item.storeAcct"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="OA新类目"
          prop="cateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="temuData.formData.cateName"
            :options="temuData.initFormData.oaList"
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
        <el-form-item label="开发类型" prop="devTypeList">
          <el-select
            v-model="temuData.formData.devTypeList"
            placeholder="请选择"
            :class="temuData.formData.devTypeList.length > 1 ? 'hide_tag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="temuData.formData.devTypeList.length > 1"
                type="info"
                >已选{{ temuData.formData.devTypeList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in temuData.initFormData.devTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签" prop="prodAttrTagList">
          <el-select
            v-model="temuData.formData.prodAttrTagList"
            :class="
              temuData.formData.prodAttrTagList.length > 1 ? 'hide_tag' : ''
            "
            filterable
            clearable
            placeholder="请选择"
            collapse-tags
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="temuData.formData.prodAttrTagList.length > 1"
                type="info"
                >已选{{ temuData.formData.prodAttrTagList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in temuData.initFormData.prodAttrTagList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="temuData.formData.logisAttrListType"
            class="form_left"
          >
            <el-option :value="1" label="物流属性与"></el-option>
            <el-option :value="2" label="物流属性或"></el-option>
          </el-select>
          <el-select
            v-model="temuData.formData.logisAttrList"
            placeholder="请选择"
            :class="
              temuData.formData.logisAttrList.length > 1 ? 'hide_tag' : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="temuData.formData.logisAttrList.length > 1"
                type="info"
                >已选{{ temuData.formData.logisAttrList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in temuData.initFormData.logisAttr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="开发专员" prop="bizzOwnerIdList">
          <el-select
            v-model="temuData.formData.bizzOwnerIdList"
            placeholder="请选择"
            :class="
              temuData.formData.bizzOwnerIdList.length > 1 ? 'hide_tag' : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="temuData.formData.bizzOwnerIdList.length > 1"
                type="info"
                >已选{{ temuData.formData.bizzOwnerIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in temuData.initFormData.bizzOwnerIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态" prop="saleStatus">
          <el-select v-model="temuData.formData.saleStatus" clearable>
            <el-option :value="0" label="停售" />
            <el-option :value="1" label="部分在售" />
            <el-option :value="2" label="在售" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型" prop="isMultiAttr">
          <el-select v-model="temuData.formData.isMultiAttr" clearable>
            <el-option value="false" label="单属性" />
            <el-option value="true" label="多属性" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成情况" prop="generateStatus">
          <el-select v-model="temuData.formData.generateStatus" clearable>
            <el-option :value="false" label="未生成" />
            <el-option :value="true" label="已生成" />
          </el-select>
        </el-form-item>
        <el-form-item prop="isAnyPlatTort" label="侵权状态"
          ><el-select
            v-model="temuData.formData.isAnyPlatTort"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="所有平台不侵权" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="temuData.formData.timeType" class="form_left">
            <el-option
              v-if="activeKey == '-2'"
              value="CREATE_TIME"
              label="创建时间"
            />
            <el-option
              v-if="activeKey == '-2' || activeKey == '0'"
              value="AUDIT_TIME"
              label="审核时间"
            />
            <el-option
              v-if="[0, 1, 2, 3].includes(Number(activeKey))"
              value="GENERAL_TIME"
              label="生成时间"
            />
            <el-option
              v-if="[1, 2, 3].includes(Number(activeKey))"
              value="LISTING_TIME"
              label="刊登时间"
            />
          </el-select>
          <el-date-picker
            v-model="temuData.formData.time"
            type="datetimerange"
            range-separator="-"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            style="width: 200px"
            class="form_right"
          />
        </el-form-item>
        <br />
        <el-form-item prop="isListingAble" label="是否禁售"
          ><el-select v-model="temuData.formData.isListingAble" clearable>
            <el-option :value="1" label="非禁售" />
            <el-option :value="0" label="禁售" />
          </el-select>
        </el-form-item>
        <el-form-item prop="orderBy" label="排序方式"
          ><el-select v-model="temuData.formData.orderBy" clearable>
            <el-option
              v-if="activeKey === '-2' || activeKey === '0'"
              :value="'ppi.audit_time DESC'"
              label="基础模板审核时间倒序"
            />
            <el-option
              v-if="activeKey === '-2' || activeKey === '0'"
              :value="'ppi.audit_time ASC'"
              label="基础模板审核时间正序"
            />
            <el-option
              v-if="activeKey !== '-2'"
              :value="'plisting.create_time DESC'"
              label="生成店铺商品时间倒序"
            />
            <el-option
              v-if="activeKey !== '-2'"
              :value="'plisting.create_time ASC'"
              label="生成店铺商品时间正序"
            />
            <el-option
              v-if="[1, 2, 3].includes(Number(activeKey))"
              :value="'plisting.listing_time DESC'"
              label="刊登时间倒序"
            />
            <el-option
              v-if="[1, 2, 3].includes(Number(activeKey))"
              :value="'plisting.listing_time ASC'"
              label="刊登时间正序"
            />
            <el-option :value="'psc_30.sale_num DESC'" label="30天销量倒序" />
            <el-option :value="'psc_15.sale_num DESC'" label="15天销量倒序" />
            <el-option :value="'psc_7.sale_num DESC'" label="7天销量倒序" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="activeKey === '-2'" label="成本" class="form_range">
          <el-input
            v-model="temuData.formData.costMin"
            type="number"
            placeholder="￥"
          />
          <div class="range_link">-</div>
          <el-input
            v-model="temuData.formData.costMax"
            type="number"
            placeholder="￥"
          />
        </el-form-item>
        <el-form-item prop="searchSkuType">
          <el-select
            v-model="temuData.formData.searchSkuType"
            class="form_left"
          >
            <el-option value="pSku" label="父SKU" />
            <el-option value="sSku" label="模板子SKU" />
          </el-select>
          <el-input
            v-model="temuData.formData.skuList"
            placeholder="多个逗号隔开"
            class="form_left form_right"
            style="width: 270px !important"
            clearable
          />
          <el-select
            v-model="temuData.formData.vagueSearch"
            class="form_right WH80"
          >
            <el-option value="false" label="精确" />
            <el-option value="true" label="模糊" />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchSkuType" class="form_range">
          <el-select v-model="temuData.formData.salesType" class="form_left">
            <el-option value="7" label="7日销量" />
            <el-option value="15" label="15日销量" />
            <el-option value="30" label="30日销量" />
          </el-select>
          <el-input
            v-model="temuData.formData.salesNumLowerLimit"
            placeholder=">="
            class="form_right"
          />
          <div class="range_link">-</div>
          <el-input
            v-model="temuData.formData.salesNumUpperLimit"
            placeholder="<="
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPublishList()">查询</el-button>
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
        <!-- <div style="font-size: 12px; margin-bottom: 8px">
        {{ temuData.formData.cateName }}
      </div> -->
      </el-form>
    </el-card>
    <!-- 筛选条件表单 end -->

    <!-- 数据展示列表 start -->
    <el-card class="card_position list_card">
      <div>
        <el-tabs
          v-model="activeKey"
          type="card"
          class="demo-tabs"
          @tab-click="changeTab"
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
              ref="temuTable"
              v-loading="loading"
              :data="tableData"
              :height="height"
              :show-overflow="true"
              :scroll-y="{ gt: 10 }"
              border
            >
              <vxe-column type="checkbox" width="40" />
              <vxe-column title="图片" width="100">
                <template #default="{ row }">
                  <ImagePop
                    :src="
                      activeKey === '-2' ? row.prodPImage : row.materialImgUrl
                    "
                  />
                </template>
              </vxe-column>
              <vxe-column
                v-if="activeKey === '-2'"
                field="enTitle"
                title="英文标题"
              />
              <vxe-column
                v-if="activeKey !== '-2'"
                field="productName"
                title="产品标题"
              />
              <vxe-column field="bizzOwner" title="商品名/开发专员">
                <template #default="{ row }">
                  商品名：{{ row.cnTitle }}<br />
                  开发专员：{{ row.bizzOwner }}
                </template>
              </vxe-column>
              <vxe-column title="销量" width="100">
                <template #default="{ row }">
                  7天：{{ row.sevenSaleNum }}<br />
                  15天：{{ row.fifteenSaleNum }}<br />
                  30天：{{ row.thirtySaleNum }}
                </template>
              </vxe-column>
              <vxe-column :title="activeKey !== '-2' ? '父SKU' : '商品父SKU'">
                <template #default="{ row }">
                  <div @click="openPskuDetails(row.prodPId)">
                    商品父SKU:
                    <span style="color: #409eff">{{ row.prodPSku }}</span>
                  </div>
                  <div v-if="activeKey !== '-2'">
                    店铺父SKU:{{ row.storePSku }}
                  </div>
                  <el-popover
                    v-if="activeKey == '2'"
                    placement="right"
                    width="300px"
                    :hide-after="0"
                    trigger="hover"
                  >
                    <template #default> {{ row.listingRespMsg }} </template>
                    <template #reference>
                      <span v-if="activeKey == '2'" class="sku_tag fail_tag"
                        >败</span
                      ></template
                    >
                  </el-popover>
                </template>
              </vxe-column>

              <vxe-column :width="activeKey !== '-2' ? 860 : 690">
                <template #header>
                  <div style="display: flex">
                    <div v-if="activeKey === '-2'" style="width: 150px">
                      商品子SKU
                    </div>
                    <div v-if="activeKey !== '-2'" style="width: 150px">
                      模板子SKU
                    </div>
                    <div v-if="activeKey !== '-2'" style="width: 150px">
                      店铺子SKU
                    </div>
                    <div style="width: 80px">颜色</div>
                    <div style="width: 80px">尺寸</div>
                    <div style="width: 80px">款式</div>
                    <div style="width: 50px">在售</div>
                    <div style="width: 120px">可用/在途/未派</div>
                    <div v-if="activeKey === '-2'" style="width: 80px">
                      成本
                    </div>
                    <div v-if="activeKey !== '-2'" style="width: 100px">
                      价格(￥)/价格($)
                    </div>
                  </div>
                </template>
                <template #default="{ row }">
                  <vxe-table
                    ref="innerTable"
                    :data="
                      row.prodListingSubSkuTemuDtoList &&
                      row.prodListingSubSkuTemuDtoList.slice(
                        0,
                        row.displayCount
                      )
                    "
                    :show-header="false"
                  >
                    <vxe-column
                      v-if="activeKey === '-2'"
                      width="150"
                      field="tempSSku"
                    >
                      <template #default="{ row }">
                        {{ row.tempSSku }}
                      </template>
                    </vxe-column>
                    <template v-else>
                      <vxe-column width="150" field="prodSSku">
                        <template #default="{ row }">
                          {{ row.prodSSku }}
                          <span
                            v-if="activeKey == '1'"
                            class="sku_tag success_tag"
                            >已</span
                          >
                          <span v-if="activeKey == '2'" class="sku_tag fail_tag"
                            >败</span
                          >
                        </template>
                      </vxe-column>
                      <vxe-column field="storeSSku" width="150" />
                    </template>
                    <vxe-column field="color" width="80" />
                    <vxe-column field="size" width="80" />
                    <vxe-column field="style" width="80" />
                    <vxe-column field="isSale" width="50"
                      ><template #default="{ row }"
                        ><span
                          :style="{
                            color: row.isSale ? 'green' : 'rgb(245, 108, 108)'
                          }"
                          >{{ row.isSale ? '在售' : '停售' }}</span
                        ></template
                      >
                    </vxe-column>
                    <vxe-column width="120">
                      <template #default="{ row }">{{
                        (row.availableStock || 0) +
                        ' / ' +
                        (row.orderNotInNum || 0) +
                        ' / ' +
                        (row.lackUnPaiNum || 0)
                      }}</template>
                    </vxe-column>
                    <vxe-column
                      v-if="activeKey === '-2'"
                      field="cost"
                      width="80"
                    />
                    <vxe-column v-if="activeKey != '-2'" field="supplierPrice">
                      <template #default="{ row }">
                        <div v-if="row.priceList && row.priceList.length">
                          <span v-if="row.priceList[0].current" class="text-red"
                            >*</span
                          >{{ row.priceList[0].price }}/
                          <span v-if="row.priceList[1].current" class="text-red"
                            >*</span
                          >{{ row.priceList[1].price }}
                        </div>
                      </template>
                    </vxe-column>
                  </vxe-table>
                  <div
                    v-if="row.prodListingSubSkuTemuDtoList"
                    style="text-align: center"
                    :class="[
                      row.prodListingSubSkuTemuDtoList.length <= 3
                        ? 'hide_btn'
                        : ''
                    ]"
                    @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                  >
                    <a
                      v-if="row.prodListingSubSkuTemuDtoList"
                      style="color: #409eff; cursor: pointer"
                      >{{ row.displayCount > 3 ? '收起' : '展开所有' }}</a
                    >
                  </div>
                </template>
              </vxe-column>

              <vxe-column title="时间">
                <template #default="{ row }">
                  <div v-if="activeKey === '-2' || activeKey === '0'">
                    审核时间： {{ transferDate(row.auditTime) }}
                  </div>
                  <div v-if="activeKey === '-2'">
                    创建时间： {{ transferDate(row.createTime) }}
                  </div>
                  <div v-if="[0, 1, 2, 3].includes(Number(activeKey))">
                    生成时间： {{ transferDate(row.createTime) }}
                  </div>
                  <div v-if="[1, 2, 3].includes(Number(activeKey))">
                    刊登时间： {{ transferDate(row.listingTime) }}
                  </div>
                </template>
              </vxe-column>

              <vxe-column v-if="activeKey != '-2'" title="操作" width="120">
                <template #default="{ row }">
                  <el-button type="primary" @click="getDetail(row)"
                    >详情</el-button
                  >
                </template>
              </vxe-column>
            </vxe-table>
            <div class="pagination">
              <el-pagination
                v-model:currentPage="temuData.formData.page"
                v-model:page-size="temuData.formData.limit"
                background
                :page-sizes="[50, 100, 300]"
                :small="true"
                layout="total, sizes, prev, pager, next"
                :total="totalCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="tools_btn">
        <el-button
          v-if="activeKey == '-2'"
          type="primary"
          @click="handleCreate()"
          >生成店铺商品</el-button
        >
        <el-button
          v-if="activeKey == '0' || activeKey == '2'"
          type="danger"
          @click="handleDelete()"
          >删除店铺商品</el-button
        >
        <el-button v-if="activeKey == '0'" type="primary" @click="handlePublish"
          >立即刊登</el-button
        >
        <el-button v-if="activeKey == '2'" type="primary" @click="handlePublish"
          >重新发布</el-button
        >
      </div>
    </el-card>
    <!-- 数据展示列表 end -->

    <!-- 详情 -->
    <Publishdetail
      v-if="showDialog"
      :show-dialog="showDialog"
      :store-acc-id="temuData.formData.storeAcctId"
      :action="action"
      :active-key="activeKey"
      :prod-p-id="prodPId"
      :listing-id="listingId"
      @close="handleClose"
    />

    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :cate-search-value="temuData.formData.cateSearchValue"
      :handle-cate-dialog-type="'oa'"
      @close-dialog="handleCateDialogClose($event)"
    />
    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />
    <!-- 批量生成店铺商品 -->
    <BatchCreateGoods
      v-if="showBatchCreateDialog"
      :show-dialog="showBatchCreateDialog"
      :store-acc-id="temuData.formData.storeAcctId"
      :prod-p-id-and-p-sku-list="prodPIdAndPSkuList"
      @close="closeBatchCreateGoods"
    />
  </div>
</template>

<script setup name="publishstemutemupublish">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { onMounted, reactive, ref, computed, nextTick } from 'vue';
  import { ElMessage } from 'element-plus';
  import Publishdetail from './components/Publishdetails.vue';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import {
    queryOaNewCategory,
    shortcuts,
    getProdTagListApi,
    getLogisListApi,
    getDevTypeListApi,
    getListuserbyrole
  } from '@/api/common';
  import {
    queryPublishData,
    deletePublishData,
    startPublish
  } from '@/api/publishs/temupublish';
  import useUserStore from '@/store/modules/user';
  import CateDialog from '@/components/CateDialog.vue';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import { transferDate } from '@/utils/common';
  import BatchCreateGoods from './components/BatchCreateGoods.vue';
  // 商品父SKU弹窗----
  const showPskuDetailDialog = ref(false);
  const openPskuDetails = async (id) => {
    prodPId.value = id;
    showPskuDetailDialog.value = true;
  };
  const handelPskuDialogClose = (e) => {
    prodPId.value = '';
    showPskuDetailDialog.value = e.isShow;
  };

  const defaultTime = [
    new Date(0, 0, 0, 0, 0, 0),
    new Date(0, 0, 0, 23, 59, 59)
  ];

  const temuData = reactive({
    // 初始化查询条件
    initFormData: {
      oaList: [],
      bizzOwnerIdList: [], //  开发专员:多选
      prodAttrTagList: [], //  商品标签
      logisAttr: [], //  物流属性:多选
      devTypeList: [] //  开发类型:多选
    },
    // form表单数据
    formData: {
      roleNameList: ['temu专员'],
      orgId: '', // 部门
      salePersonId: '', // 销售员
      //店铺Id，必选
      storeAcctId: '',
      //OA新类目
      cateId: '',
      cateIdList: [],
      //开发类型
      devTypeList: '',
      //商品标签
      prodAttrTagList: [],
      //物流属性
      logisAttrListType: 1,
      logisAttrList: [],
      includeLogisAttrList: [],
      anyLogisAttrList: [],
      //开发专员
      bizzOwnerIdList: [],
      //在售状态
      saleStatusList: [],
      saleStatus: 2,
      //商品类型
      isMultiAttr: '',
      //生成情况
      generateStatus: false,
      //侵权状态
      isAnyPlatTort: 0,
      // 成本
      costMin: '',
      costMax: '',

      createTimeStart: '',
      createTimeEnd: '',
      auditTimeStart: '',
      auditTimeEnd: '',
      listingTimeStart: '',
      listingTimeEnd: '',
      //时间，CREATE_TIME,AUDIT_TIME,GENERAL_TIME
      timeType: '',
      time: [], //  时间

      //是否禁售
      isListingAble: 1,
      //sku查询类型，参考mercado模板
      searchSkuType: 'pSku', // sku 类型
      vagueSearch: 'false', // 模糊 和 精确
      skuList: '', // sku value
      prodPSkuStrFussy: '', // 父sku 模糊查询
      prodPSkuStr: '', // 父sku 精确查询
      tempSSkuStr: '', // 模板子sku 精确查询
      tempSSkuStrFussy: '', // 模板子sku 模糊查询

      salesType: '7', // 销量
      salesNumLowerLimit: '',
      salesNumUpperLimit: '',
      sevenSalesMax: '', // 7日销量
      sevenSalesMin: '',
      fifteenSalesMax: '', // 15日销量
      fifteenSalesMin: '',
      thirtySalesMax: '', // 30日销量
      thirtySalesMin: '',
      orderBy: '', // 排序方式
      page: 1,
      limit: 50,
      listingStatus: -2
    }
  });

  const totalCount = ref(0);

  // tab list
  const tabList = ref([
    { label: '商品', count: '', status: '-2', index: 0 },
    { label: '待刊登', count: '', status: '0', index: 1 },
    { label: '刊登中', count: '', status: '3', index: 2 },
    { label: '刊登成功', count: '', status: '1', index: 3 },
    { label: '刊登失败', count: '', status: '2', index: 4 }
  ]);
  const formRef = ref(null);
  const activeKey = ref('-2');
  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };
  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: []
  });
  const salersDataCopy = ref([]);

  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  onMounted(async () => {
    getDepartmentList();
    getStoreList();
    //OA新类目
    {
      const { data } = await queryOaNewCategory();
      temuData.initFormData.oaList = JSON.parse(data);
    }

    //开发专员
    {
      const { data } = await getListuserbyrole();
      temuData.initFormData.bizzOwnerIdList = data.map((item) => ({
        value: item.id,
        label: item.userName
      }));
    }
    //商品标签
    {
      const { data } = await getProdTagListApi();
      temuData.initFormData.prodAttrTagList = data.map((item) => ({
        value: item.name,
        label: item.name
      }));
    }
    //物流属性
    {
      const { data } = await getLogisListApi();
      temuData.initFormData.logisAttr = data.map((item) => ({
        value: item.name,
        label: item.name
      }));
    }
    //开发类型
    {
      const { data } = await getDevTypeListApi();
      temuData.initFormData.devTypeList = data.map((item) => ({
        value: item.name,
        label: item.name
      }));
    }
  });

  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'temu专员'
    };
    try {
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
        roleNames: 'temu专员',
        orgId: temuData.formData.orgId,
        salePersonId: temuData.formData.salePersonId,
        platCode: 'temu',
        lmsAppUserName: userName.value
      };
      const { data } = await getStoreInfo(params);
      selectData.storeData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 选择部门 获取店铺和销售员
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
  // 选择销售 获取店铺
  const changeSalers = () => {
    temuData.formData.storeAcctId = '';
    getStoreList();
  };

  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    temuData.formData.orgId = '';
    resetSearch();
  };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    temuData.formData.salePersonId = '';
    temuData.formData.storeAcctId = '';
    getStoreList();
  };

  // 类目组件 start
  const showCateDialog = ref(false);
  const handleCateDialogClose = (e) => {
    showCateDialog.value = e.isShow;
    if (!e.cate) {
      return;
    }
    temuData.formData.cateName = e.cate.value.fullCateName;
    temuData.formData.cateId = e.cate.value.categoryId;
  };
  // 类目组件 end

  // 清空表单
  const resetForm = function () {
    formRef.value.resetFields();
    temuData.formData.includeLogisAttrList = [];
    temuData.formData.anyLogisAttrList = [];
    temuData.formData.logisAttrList = [];
    temuData.formData.cateId = '';
    temuData.formData.timeType = '';
    temuData.formData.skuList = '';
    temuData.formData.salesType = '7';
    temuData.formData.salesNumLowerLimit = '';
    temuData.formData.salesNumUpperLimit = '';
    temuData.formData.vagueSearch = 'false';
    temuData.formData.time = [];
    temuData.formData.searchSkuType = 'pSku';
    temuData.formData.searchSKUValue = '';
    temuData.formData.costMin = '';
    temuData.formData.costMax = '';
  };

  const temuTable = ref(null);
  const innerTable = ref(null);
  const selectRecords = ref([]);

  // 获取复选框选中的数据
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = temuTable.value;
    let index = tabList.value.filter(
      (item) => item.status == activeKey.value
    )[0].index;
    selectRecords.value = $table[index].getCheckboxRecords();
    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };

  // 切换 tab
  const changeTab = async (tab) => {
    temuData.formData.listingStatus = Number(tab.props.name);
    temuData.formData.page = 1;
    showPublishTime();
    await getPublishList();
  };

  // 切换tab时 刊登时间的展示
  const showPublishTime = () => {
    // 创建时间 CREATE_TIME 审核时间 AUDIT_TIME
    // 生成时间 GENERAL_TIME 刊登时间 LISTING_TIME

    // 切换到商品-2（创建、审核）
    if (temuData.formData.listingStatus === -2) {
      switch (temuData.formData.timeType) {
        case 'CREATE_TIME':
          temuData.formData.timeType = 'CREATE_TIME';
          break;
        case 'AUDIT_TIME':
          temuData.formData.timeType = 'AUDIT_TIME';
          break;
        case 'GENERAL_TIME':
          temuData.formData.timeType = 'CREATE_TIME';
          temuData.formData.time = [];
          break;
        case 'LISTING_TIME':
          temuData.formData.timeType = 'CREATE_TIME';
          temuData.formData.time = [];
          break;
        default:
          break;
      }
    }
    // 切换到待刊登0（审核、生成）
    if (temuData.formData.listingStatus === 0) {
      switch (temuData.formData.timeType) {
        case 'CREATE_TIME':
          temuData.formData.timeType = 'AUDIT_TIME';
          temuData.formData.time = [];
          break;
        case 'AUDIT_TIME':
          temuData.formData.timeType = 'AUDIT_TIME';
          break;
        case 'GENERAL_TIME':
          temuData.formData.timeType = 'GENERAL_TIME';
          break;
        case 'LISTING_TIME':
          temuData.formData.timeType = 'AUDIT_TIME';
          temuData.formData.time = [];
          break;
        default:
          break;
      }
    }
    // 切换到刊登中3（生成、刊登）
    if (
      temuData.formData.listingStatus === 3 ||
      temuData.formData.listingStatus === 1 ||
      temuData.formData.listingStatus === 2
    ) {
      switch (temuData.formData.timeType) {
        case 'CREATE_TIME':
          temuData.formData.timeType = 'GENERAL_TIME';
          temuData.formData.time = [];
          break;
        case 'AUDIT_TIME':
          temuData.formData.timeType = 'GENERAL_TIME';
          temuData.formData.time = [];
          break;
        case 'GENERAL_TIME':
          temuData.formData.timeType = 'GENERAL_TIME';
          break;
        case 'LISTING_TIME':
          temuData.formData.timeType = 'LISTING_TIME';
          break;
        default:
          break;
      }
    }
  };

  const loading = ref(false);
  // 列表数据
  const tableData = ref([]);
  const requestId = ref(0); // 请求标识
  // 获取列表数据
  const getPublishList = async () => {
    handleSearchData();
    temuData.formData.saleStatusList =
      typeof temuData.formData.saleStatus !== 'function'
        ? String(temuData.formData.saleStatus).split('')
        : temuData.formData.saleStatus;

    if (!temuData.formData.storeAcctId) {
      ElMessage.warning('请选择店铺');
      return;
    }
    if (temuData.formData.logisAttrListType === 1) {
      temuData.formData.includeLogisAttrList = temuData.formData.logisAttrList;
      temuData.formData.anyLogisAttrList = [];
    } else if (temuData.formData.logisAttrListType === 2) {
      temuData.formData.includeLogisAttrList = [];
      temuData.formData.anyLogisAttrList = temuData.formData.logisAttrList;
    }

    loading.value = true;
    const id = ++requestId.value;
    requestId.value = id;

    try {
      const { code, data, count } = await queryPublishData(temuData.formData);
      loading.value = false;
      if (code === '0000') {
        if (id === requestId.value) {
          tableData.value = data;
          tableData.value =
            data &&
            data.map((item) => {
              item.displayCount = 3;
              return item;
            });
          totalCount.value = count;
          getTabCount(totalCount.value);
        }
      }
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
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

  // 查看全部时，将所有都给到
  const viewAll = (row) => {
    row.displayCount = row.prodListingSubSkuTemuDtoList.length;
  };

  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };

  // 处理搜索条件 时间和sku搜索
  const handleSearchData = () => {
    let {
      searchSkuType,
      vagueSearch,
      skuList,
      time,
      timeType,
      salesType,
      salesNumLowerLimit,
      salesNumUpperLimit
    } = temuData.formData;
    temuData.formData.prodPSkuStr = '';
    temuData.formData.prodPSkuStrFussy = '';
    temuData.formData.tempSSkuStr = '';
    temuData.formData.tempSSkuStrFussy = '';
    temuData.formData.sevenSalesMax = '';
    temuData.formData.sevenSalesMin = '';
    temuData.formData.fifteenSalesMax = '';
    temuData.formData.fifteenSalesMin = '';
    temuData.formData.thirtySalesMax = '';
    temuData.formData.thirtySalesMin = '';
    // 精确父sku
    if (searchSkuType === 'pSku' && vagueSearch === 'false') {
      temuData.formData.prodPSkuStr = skuList;
    }
    // 模糊父sku
    if (searchSkuType === 'pSku' && vagueSearch === 'true') {
      temuData.formData.prodPSkuStrFussy = skuList;
    }
    // 精确子sku
    if (searchSkuType === 'sSku' && vagueSearch === 'false') {
      temuData.formData.tempSSkuStr = skuList;
    }
    // 精确子sku
    if (searchSkuType === 'sSku' && vagueSearch === 'true') {
      temuData.formData.tempSSkuStrFussy = skuList;
    }

    // 7日销量
    if (salesType === '7') {
      temuData.formData.sevenSalesMin = salesNumLowerLimit;
      temuData.formData.sevenSalesMax = salesNumUpperLimit;
    }
    // 15日销量
    if (salesType === '15') {
      temuData.formData.fifteenSalesMin = salesNumLowerLimit;
      temuData.formData.fifteenSalesMax = salesNumUpperLimit;
    }
    // 30日销量
    if (salesType === '30') {
      temuData.formData.thirtySalesMin = salesNumLowerLimit;
      temuData.formData.thirtySalesMax = salesNumUpperLimit;
    }

    if (time && (timeType === 'CREATE_TIME' || timeType === 'GENERAL_TIME')) {
      temuData.formData.createTimeStart = new Date(time[0]).getTime() || '';
      temuData.formData.createTimeEnd = new Date(time[1]).getTime() || '';

      temuData.formData.auditTimeStart = '';
      temuData.formData.auditTimeEnd = '';
      temuData.formData.listingTimeStart = '';
      temuData.formData.listingTimeEnd = '';
    }
    if (time && timeType === 'AUDIT_TIME') {
      temuData.formData.auditTimeStart = new Date(time[0]).getTime() || '';
      temuData.formData.auditTimeEnd = new Date(time[1]).getTime() || '';

      temuData.formData.createTimeStart = '';
      temuData.formData.createTimeEnd = '';
      temuData.formData.listingTimeStart = '';
      temuData.formData.listingTimeEnd = '';
    }
    if (time && timeType === 'LISTING_TIME') {
      temuData.formData.listingTimeStart = new Date(time[0]).getTime() || '';
      temuData.formData.listingTimeEnd = new Date(time[1]).getTime() || '';

      temuData.formData.auditTimeStart = '';
      temuData.formData.auditTimeEnd = '';
      temuData.formData.createTimeStart = '';
      temuData.formData.createTimeEnd = '';
    }

    temuData.formData.cateIdList = [];
    if (temuData.formData.cateName && temuData.formData.cateName.length != 0) {
      temuData.formData.cateName.forEach((item) => {
        temuData.formData.cateIdList.push(item[item.length - 1]);
      });
    }
  };
  const showDialog = ref(false);
  const action = ref(''); // 弹窗 detail 详情 create 生成店铺商品
  const prodPId = ref('');
  const showBatchCreateDialog = ref(false);
  const prodPIdAndPSkuList = ref([]);
  // 生成店铺商品
  const handleCreate = () => {
    if (getSelectedList()) {
      // 如果选中的是一条 就是原有逻辑不变
      if (selectRecords.value.length === 1) {
        showDialog.value = true;
        action.value = 'create';
        prodPId.value = selectRecords.value[0].prodPId;
      }
      //如果选中了多条 那就展示批量刊登弹窗
      if (selectRecords.value.length > 1) {
        prodPIdAndPSkuList.value = selectRecords.value.map((item) => ({
          id: item.prodPId,
          pSku: item.prodPSku
        }));
        showBatchCreateDialog.value = true;
      }
    }
  };

  // 关闭批量生成刊登弹窗
  const closeBatchCreateGoods = () => {
    showBatchCreateDialog.value = false;
  };

  const listingId = ref('');
  // 生成店铺商品详情
  const getDetail = (row) => {
    showDialog.value = true;
    action.value = 'update';
    prodPId.value = row.prodPId;
    listingId.value = row.id;
  };

  // 删除
  const handleDelete = async () => {
    if (getSelectedList()) {
      let ids = selectRecords.value.map((item) => item.id);
      try {
        const { code } = await deletePublishData(ids);
        if (code === '0000') {
          ElMessage.success('删除成功！');
          getPublishList();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // 立即刊登/重新发布
  const handlePublish = async () => {
    if (getSelectedList()) {
      let ids = selectRecords.value.map((item) => item.id);
      try {
        const { code } = await startPublish(ids);
        if (code === '0000') {
          ElMessage.success('刊登成功！');
          getPublishList();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // 关闭弹窗
  const handleClose = (val) => {
    showDialog.value = false;
    if (val === 'update') {
      getPublishList();
    }
  };

  // 分页
  const handleSizeChange = (val) => {
    temuData.formData.limit = val;
    getPublishList();
  };

  const handleCurrentChange = (val) => {
    temuData.formData.page = val;
    getPublishList();
  };

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
</script>

<style lang="scss" scoped>
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
  .hide_btn {
    display: none;
  }
  :deep(.WH80) {
    width: 80px !important;
    .el-input.el-input--small {
      width: 80px;
    }
  }
  .sku_tag {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-left: 5px;
    line-height: 22px;
    text-align: center;
    border-radius: 5px;
    font-size: 14px;
  }
  .success_tag {
    background: rgb(64, 158, 255);
    color: #ffffff;
  }
  .fail_tag {
    background: rgb(238, 238, 238);
    color: rgb(121, 121, 121);
  }
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
  }

  /*vxe-table 自定义行高 */
  :deep(
      .vxe-table--render-default.size--mini
        .vxe-body--column.col--ellipsis
        > .vxe-cell
    ) {
    // padding: 7px 0;
    max-height: fit-content;
    text-overflow: ellipsis;
    white-space: break-spaces;
  }
</style>
