<!-- 美科多在线商品页面 -->
<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="form"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="form.orgId"
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
            v-model="form.salePersonId"
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
            v-model="form.storeAcctId"
            placeholder="请选择"
            :class="form.storeAcctId.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.storeAcctId.length > 1" type="info"
                >已选{{ form.storeAcctId.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.storeData"
              :key="item.id"
              :label="item.storeAcct"
              :value="item.id"
            />
          </el-select>
          <!-- <el-select
            v-model="form.storeAcctId"
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
          </el-select> -->
        </el-form-item>
        <el-form-item label="listing状态">
          <el-select
            v-model="form.listingStatus"
            placeholder="请选择"
            :class="form.listingStatus.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.listingStatus.length > 1" type="info"
                >已选{{ form.listingStatus.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.listingStatus"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchSKUValue">
          <el-select v-model="form.searchSKUType" class="form_left">
            <el-option value="pSkus" label="商品父SKU" />
            <el-option value="sSkus" label="商品子SKU" />
            <!-- <el-option value="？" label="店铺父SKU" />
          <el-option value="？" label="店铺子SKU" /> -->
          </el-select>
          <el-input
            v-model="form.searchSKUValue"
            class="form_right"
            placeholder="(精确)多个逗号隔开"
          />
        </el-form-item>
        <el-form-item
          label="在线数量"
          prop="minListingCount"
          class="form_range"
        >
          <el-input
            v-model="form.minListingCount"
            placeholder=">="
            clearable
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="form.maxListingCount"
            placeholder="<="
            clearable
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="站点" prop="salesSites">
          <el-select
            v-model="form.salesSites"
            placeholder="请选择"
            :class="form.salesSites.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.salesSites.length > 1" type="info"
                >已选{{ form.salesSites.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="(val, key) in initFormData.sites"
              :key="key"
              :label="val"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="OA新类目"
          prop="oacateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="form.oacateName"
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
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="平台类目"
          prop="mercateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="form.mercateName"
            :options="initFormData.merList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'name',
              value: 'categoryId',
              children: 'childList'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品标签" prop="prodTag">
          <el-select
            v-model="form.prodTag"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in initFormData.prodTag"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态" prop="isSaleList">
          <el-select
            v-model="form.isSaleList"
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
        <el-form-item prop="title">
          <el-select v-model="form.titleSearchType" class="form_left">
            <el-option value="false" label="刊登标题(常规模糊)" />
            <el-option value="true" label="刊登标题(分词模糊)" />
          </el-select>
          <el-input v-model="form.title" class="form_right" />
        </el-form-item>
        <el-form-item prop="searchSalesType" class="form_range">
          <el-select
            v-model="form.searchSalesType"
            placeholder="请选择"
            class="form_left"
            clearable
            filterable
          >
            <el-option label="15天平台销量" value="1"></el-option>
            <el-option label="30天平台销量" value="2"></el-option>
            <el-option label="60天平台销量" value="3"></el-option>
            <el-option label="90天平台销量" value="4"></el-option>
          </el-select>
          <el-input
            v-model="form.salesMin"
            placeholder=">="
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="form.salesMax"
            placeholder="<="
            clearable
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="itemId" label="物品号">
          <el-input
            v-model="form.itemId"
            class="form_right"
            placeholder="请输入itemId"
          />
        </el-form-item>
        <el-form-item prop="time" label="">
          <el-select v-model="form.searchTimeType" class="form_left">
            <el-option value="listingTime" label="刊登时间" />
            <el-option value="lastUpdateTime" label="更新时间" />
          </el-select>
          <!-- 更新时间 -->
          <el-date-picker
            v-model="form.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
          />
        </el-form-item>
        <el-form-item prop="orderBy" label="排序方式"
          ><el-select v-model="form.orderBy">
            <el-option value="0" label="刊登时间倒序" />
            <el-option value="1" label="刊登时间正序" />
            <el-option value="2" label="在线数量倒序" />
            <el-option value="3" label="在线数量正序" />
            <el-option value="4" label="30天平台销量倒序" />
            <el-option value="5" label="60天平台销量倒序" />
            <el-option value="6" label="90天平台销量倒序" />
            <el-option value="7" label="7天oa销量倒序" />
            <el-option value="8" label="15天oa销量倒序" />
            <el-option value="9" label="30天oa销量倒序" />
            <el-option
              v-if="activeName == '在线'"
              value="10"
              label="售价（USD）正序"
            />
            <el-option
              v-if="activeName == '在线'"
              value="11"
              label="售价（USD）倒序"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.abc"
          prop="priceMin"
          label="价格($)"
          class="form_range"
        >
          <el-input v-model="form.priceMin" clearable></el-input>
          <div class="range_link">-</div>
          <el-input v-model="form.priceMax" clearable></el-input>
        </el-form-item>
        <el-form-item prop="preStockType" class="form_range">
          <el-select
            v-model="form.preStockType"
            placeholder="请选择"
            class="form_left"
            clearable
            filterable
          >
            <el-option label="预计可用含在途" value="1"></el-option>
            <el-option label="预计可用不含在途" value="2"></el-option>
          </el-select>
          <el-input
            v-model="form.preStockMin"
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input v-model="form.preStockMax" clearable></el-input>
        </el-form-item>
        <el-form-item prop="hasWhiteImgs" label="亚马逊图">
          <el-select
            v-model="form.hasWhiteImgs"
            placeholder="请选择"
            clearable
            filterable
            multiple
            collapse-tags
          >
            <el-option label="有图" value="2"></el-option>
            <el-option label="部分有图" value="1"></el-option>
            <el-option label="无图" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="descType">
          <el-select v-model="form.descType">
            <el-option value="" label="全部" />
            <el-option value="1" label="有描述" />
            <el-option value="0" label="无描述" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '在线'"
          prop="canSaleBool"
          label="是否禁售"
          ><el-select v-model="form.canSaleBool">
            <el-option value="false" label="非禁售" />
            <el-option value="true" label="禁售" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '在线'"
          label="侵权状态"
          prop="tortBanListing"
          ><el-select
            v-model="form.tortBanListing"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="所有平台不侵权" value="ANY_PLAT_NOT_TORT" />
            <el-option label="任一平台侵权" value="ANY_PLAT_TORT" />
            <el-option label="mercado侵权" value="CURRENT_PLAT_TORT" />
            <el-option label="mercado不侵权" value="CURRENT_PLAT_NO_TORT" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '在线'"
          label="物流属性"
          prop="logisAttrList"
        >
          <el-select
            v-model="form.logisAttrList"
            placeholder="请选择"
            :class="form.logisAttrList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.logisAttrList.length > 1" type="info"
                >已选{{ form.logisAttrList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.logisAttr"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '在线'"
          prop="isMultiSku"
          label="listing类型"
          ><el-select
            v-model="form.isMultiSku"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="单属性" value="false" />
            <el-option label="多属性" value="true" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '在线'"
          prop="isPromotion"
          label="是否促销"
          ><el-select
            v-model="form.isPromotion"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="全部" :value="0" />
            <el-option label="是" :value="1" />
            <el-option label="否" :value="2" />
          </el-select>
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
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="name in tabsName"
          :key="name"
          :label="name + `(${tabsTotal[name]})`"
          :name="name"
        >
          <div style="display: flex; justify-content: flex-end">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="统计总数" name="type" />
            </el-checkbox-group>
          </div>
          <vxe-table
            ref="tableDataRef"
            v-loading="tableDataLoading"
            :data="tableData"
            :scroll-y="{ gt: 10 }"
            :height="height"
            :align="'center'"
            border
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="图片" width="130">
              <template #default="{ row }">
                <el-popover
                  placement="right"
                  width="500px"
                  :hide-after="0"
                  trigger="hover"
                >
                  <template #default>
                    <el-image :src="row.firstImg || ''" />
                  </template>
                  <template #reference>
                    <el-image :src="row.firstImg + '!size=80x80' || ''" />
                  </template>
                </el-popover>
              </template>
            </vxe-column>
            <vxe-column field="enTitle" title="标题/产品ID">
              <template #default="{ row }">
                {{ row.title }}<br />
                [{{ row.storeAcct }}][{{ row.salesperson }}]
                <a
                  target="_blank"
                  :href="row.permalink"
                  style="color: #409eff; cursor: pointer"
                  >{{ row.itemId }}</a
                ><el-icon
                  v-if="row.itemId"
                  class="copy_icon"
                  color="#aaa"
                  @click="copy(row.itemId)"
                  ><CopyDocument /></el-icon
                ><el-tag
                  v-if="
                    row.promotionsType == 1 &&
                    row.promotionsStatus == 2 &&
                    activeName == '在线'
                  "
                  type="warning"
                  >促</el-tag
                ><br />listing状态：{{ row.status }}
              </template>
            </vxe-column>
            <vxe-column field="pSku" title="父SKU" width="180">
              <template #default="{ row }">
                商品父SKU：{{ row.prodPSku
                }}<el-icon
                  v-if="row.prodPSku"
                  class="copy_icon"
                  color="#aaa"
                  @click="copy(row.prodPSku)"
                  ><CopyDocument /></el-icon
                ><br />
                <!-- 店铺父SKU：<br /> -->
                刊登时间：{{
                  row.itemCreateTime
                    ? parseTime(row.itemCreateTime, '{y}-{m}-{d}')
                    : ''
                }}<br />更新时间：{{
                  row.itemCreateTime
                    ? parseTime(row.lastUpdateTime, '{y}-{m}-{d}')
                    : ''
                }}
              </template>
            </vxe-column>
            <vxe-column field="" title="15/30/60/90天平台销量" width="90">
              <template #default="{ row }">
                15天：{{ row.fifteenSales }}<br />
                30天：{{ row.thirtySales }}<br />
                60天：{{ row.sixtySales }}<br />
                90天：{{ row.ninetySales }}
              </template>
            </vxe-column>
            <vxe-column field="" width="490">
              <template #header>
                <div style="display: flex; justify-content: space-evenly">
                  <div>店铺子SKU</div>
                  <div>子SKU</div>
                  <div>在线数量</div>
                  <div style="width: 90px">预计可用库存含在途/不含在途</div>
                  <div>属性</div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  v-if="
                    row.pprodSyncSMercadoDtos &&
                    row.pprodSyncSMercadoDtos.length != 0
                  "
                  :data="
                    row.pprodSyncSMercadoDtos
                      ? row.pprodSyncSMercadoDtos.slice(0, row.displayCount)
                      : []
                  "
                  :show-header="false"
                >
                  <vxe-column field="sellerSku" width="160" />
                  <vxe-column field="prodSSku">
                    <template #default="{ row: sonRow }">
                      {{ sonRow.prodSSku
                      }}<el-icon
                        v-if="sonRow.prodSSku"
                        class="copy_icon"
                        color="#aaa"
                        @click="copy(sonRow.prodSSku)"
                        ><CopyDocument
                      /></el-icon>
                    </template>
                  </vxe-column>
                  <vxe-column field="availableQuantity" width="60" />
                  <vxe-column field="prodSSku">
                    <template #default="{ row: sonRow }">
                      {{ sonRow.preAvailableStockAll }}/{{
                        sonRow.preAvailableStock
                      }}
                    </template>
                  </vxe-column>
                  <vxe-column field=""
                    ><template #default="{ row: sonRow }">
                      <div v-if="sonRow.size">
                        Size:{{ sonRow.size ? sonRow.size : '' }}
                      </div>
                      <div v-if="sonRow.color">
                        Color:{{ sonRow.color ? sonRow.color : '' }}
                      </div>
                      <div v-if="sonRow.style">
                        Style:{{ sonRow.style ? sonRow.style : '' }}
                      </div>
                    </template>
                  </vxe-column>
                </vxe-table>
                <div
                  v-if="
                    row.pprodSyncSMercadoDtos &&
                    row.pprodSyncSMercadoDtos.length != 0
                  "
                  :class="[
                    row.pprodSyncSMercadoDtos.length <= 3 ? 'hideBtn' : ''
                  ]"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >
            <vxe-column
              field="priceUSD"
              title="售价（USD/站点币种）"
              width="130"
            >
              <template #default="{ row }">
                USD：{{
                  row.pprodSyncSMercadoDtos && row.pprodSyncSMercadoDtos[0]
                    ? row.pprodSyncSMercadoDtos[0].priceUSD
                    : ''
                }}<br />
                {{ row.salesSite }}：{{
                  row.pprodSyncSMercadoDtos && row.pprodSyncSMercadoDtos[0]
                    ? row.pprodSyncSMercadoDtos[0].price
                    : ''
                }}
              </template>
            </vxe-column>
            <vxe-column field="price" title="原价（USD/站点币种）" width="130">
              <template #default="{ row }">
                USD：{{ row.usdPrice }}<br />
                {{ row.salesSite }}：{{ row.sitePrice }}
              </template>
            </vxe-column>
            <vxe-column field="status" title="状态" width="70"
              ><template #default="{ row }">
                {{ row.status == 'active' ? '在线' : '下架' }}
              </template>
            </vxe-column>
            <!-- <vxe-column title="预计可用库存含在途/不含在途" width="120">
            <template #default="{ row }">
              {{
                row.pprodSyncSMercadoDtos && row.pprodSyncSMercadoDtos[0]
                  ? row.pprodSyncSMercadoDtos[0].soldQuantity
                  : ''
              }}/{{
                row.pprodSyncSMercadoDtos && row.pprodSyncSMercadoDtos[0]
                  ? row.pprodSyncSMercadoDtos[0].soldQuantity
                  : ''
              }}
            </template>
          </vxe-column> -->
            <vxe-column title="操作" width="100">
              <template #default="{ row }">
                <el-button type="primary" @click="handleViewLog(row)"
                  >日志</el-button
                >
                <el-button
                  v-if="activeName == '在线'"
                  v-permission="['mercadoOnlineUpdataListing']"
                  type="primary"
                  @click="updataListing(row)"
                  >更新</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="currentPage"
              v-model:page-size="pageSize"
              background
              :page-sizes="[1000, 500, 100]"
              layout="prev, pager, next,sizes, total"
              :total="total"
              :small="true"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn" style="display: flex">
        <el-button v-if="activeName == '在线'" type="primary">
          <a
            href="/api/lms/static/excel/mercado_store_update.xlsx"
            target="_blank"
            style="color: #fff; text-decoration: none; font-size: inherit"
            >导出调价模板</a
          ></el-button
        >

        <el-upload
          v-if="activeName == '在线'"
          :auto-upload="false"
          :on-change="handleChange"
          :show-file-list="false"
        >
          <el-button type="primary" style="margin: 0 12px">导入调价</el-button>
        </el-upload>

        <el-select v-model="batchOp" style="width: 150px">
          <el-option value="" label="批量操作" />
          <el-option value="1" label="修改/计算价格" @click="getBatchOpClick" />
          <el-option
            v-if="activeName == '在线'"
            value="2"
            label="商品下架"
            @click="getProdOffShelf"
          />
          <el-option value="3" label="商品删除" @click="getProdDel" />
          <el-option
            v-permission="['mercadoOnlineUpdataListing']"
            value="4"
            label="更新listing"
            @click="updataListingBatch"
          />
        </el-select>
      </div>
    </el-card>

    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :handle-cate-dialog-type="handleCateDialogType"
      :prod-p-id="prodPId"
      @close-dialog="handleCateDialogClose($event)"
    />
    <!-- 修改/计算价格 -->
    <ModifyPrice
      v-if="showModifyPriceDialog"
      :show-dialog="showModifyPriceDialog"
      :table-data="detailDialogFormVisible"
      @close-dialog="handelEditDialogClose($event)"
    />
    <!-- 操作日志 -->
    <LogDialog v-model="logVisible" :checked-row="checkedRow" />
  </div>
</template>
<script setup name="publishsmercadomercadoonline">
  import { ref, reactive, onMounted, computed, nextTick } from 'vue';
  import { parseTime, copy } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import useUserStore from '@/store/modules/user';
  import {
    shortcuts,
    getCateTree,
    queryOaNewCategory,
    getLogisListApi,
    getProdTagListApi
  } from '@/api/common';

  import CateDialog from '@/components/CateDialog.vue';
  import ModifyPrice from './components/ModifyPrice.vue';
  import {
    getPaymentsData,
    getDepartData,
    getStoreInfo
  } from '@/api/eBay/payments';
  import {
    getProducts,
    importUpdatePriceByStoreList,
    pausedProductStatus,
    syncByItems,
    syncItem,
    deleteProducts
  } from '@/api/publishs/mercadoonline';
  import LogDialog from './components/LogDialog.vue';

  const currentPage = ref(1);
  const pageSize = ref(1000);
  const total = ref(0);
  const tabsTotal = ref({ 在线: 0, 已下架: 0 });
  const batchOp = ref('');

  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    onSubmit();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit();
  };
  // 批量操作
  // 日志
  // 选中的当前行数据
  let checkedRow = ref({});
  const logVisible = ref(false);
  const handleViewLog = (row) => {
    checkedRow.value = row;
    logVisible.value = true;
  };
  // 修改/计算价格--start--
  const showModifyPriceDialog = ref(false);
  let detailDialogFormVisible = ref();
  const handelEditDialogClose = (e) => {
    // detailDialogFormVisible.value = null;
    showModifyPriceDialog.value = e.isShow;
  };
  const getBatchOpClick = () => {
    let checkedData;
    if (activeName.value == '在线') {
      checkedData = tableDataRef.value[0].getCheckboxRecords();
    } else {
      checkedData = tableDataRef.value[1].getCheckboxRecords();
    }
    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    detailDialogFormVisible.value = checkedData;
    showModifyPriceDialog.value = true;
  };
  // 修改/计算价格--end--
  // 商品下架--start--
  const getProdOffShelf = () => {
    let checkedData;
    if (activeName.value == '在线') {
      checkedData = tableDataRef.value[0].getCheckboxRecords();
    } else {
      checkedData = tableDataRef.value[1].getCheckboxRecords();
    }
    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    ElMessageBox.confirm(
      `本次共计下架${checkedData.length}个item，请确认是否全部进行下架?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'Warning'
      }
    ).then(async () => {
      const { code, msg } = await pausedProductStatus(ids);
      if (code === '0000') {
        ElMessage.success(msg);
        onSubmit();
      }
    });
  };
  // 商品下架--end--
  // 商品删除--start--
  const getProdDel = () => {
    let checkedData;
    if (activeName.value == '在线') {
      checkedData = tableDataRef.value[0].getCheckboxRecords();
    } else {
      checkedData = tableDataRef.value[1].getCheckboxRecords();
    }
    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    ElMessageBox.confirm(
      `本次需要删除${checkedData.length}个商品，请确认是否全部删除?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'Warning'
      }
    ).then(async () => {
      const { code, msg } = await deleteProducts(ids);
      if (code === '0000') {
        ElMessage.success(msg);
        onSubmit();
      }
    });
  };
  // 商品删除--end--
  // 更新listing--批量
  const updataListingBatch = () => {
    let checkedData;
    if (activeName.value == '在线') {
      checkedData = tableDataRef.value[0].getCheckboxRecords();
    } else {
      checkedData = tableDataRef.value[1].getCheckboxRecords();
    }

    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let obj = [];
    checkedData.forEach((item) => {
      obj.push({
        storeId: item.storeAcctId,
        salesSite: item.salesSite,
        itemId: item.itemId,
        globalItemId: item.globalItemId
      });
    });
    ElMessageBox.confirm(
      `本次需要更新${checkedData.length}个商品，请确认是否全部更新?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'Warning'
      }
    ).then(async () => {
      // ;
      const { code } = await syncByItems(obj);
      if (code === '0000') {
        ElMessage.success('已提交更新，正在处理中');
        onSubmit();
      }
    });
  };
  // 更新listing--单个
  const updataListing = async (row) => {
    let obj = {
      storeId: row.storeAcctId,
      salesSite: row.salesSite,
      itemId: row.itemId,
      globalItemId: row.globalItemId
    };
    const { code, msg } = await syncItem(obj);
    if (code === '0000') {
      ElMessage.success(msg);
      onSubmit();
    }
  };
  // 更新listing--end--
  // 查询条件
  const form = reactive({
    titleSearchType: 'false',
    orgId: '', // 部门
    salePersonId: '', // 销售员
    storeAcctId: '', //店铺Id,list
    listingStatus: ['active'], // listing状态
    searchSKUType: 'pSkus',
    searchSKUValue: '',
    minListingCount: '',
    maxListingCount: '',
    salesSites: [],
    mercateName: '',
    oacateName: '',
    cate: [],
    cateOaIdList: [],
    prodTag: '', // 商品标签
    isSaleList: [], // 在售状态
    title: '', // 标题
    itemId: '',
    orderBy: '0', //  排序方式
    searchSalesType: '1', // 7/30/60/90销量
    hasWhiteImgs: [],
    salesMin: '',
    salesMax: '',
    priceMin: '',
    priceMax: '',
    preStockType: '1',
    preStockMin: '',
    preStockMax: '',
    preAvailableStockMin: '',
    preAvailableStockMax: '',
    preAvailableStockAllMin: '',
    preAvailableStockAllMax: '',
    isMultiSku: '',
    isPromotion: 0,
    //物流属性
    logisAttrList: [],
    tortBanListing: '', //侵权状态
    canSaleBool: 'false', //是否禁售
    searchTimeType: 'listingTime',
    time: [], //  时间
    startTime: '',
    endTime: ''
  });
  // 初始化查询条件
  const initFormData = reactive({
    sites: {
      MLB: '巴西',
      MLM: '墨西哥',
      MCO: '哥伦比亚',
      MLC: '智利'
    },
    listingStatus: ['active'],
    merList: [], // 美客多类目
    oaList: [], // oa类目
    logisAttr: [],
    prodTag: [] //  商品标签
  });
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref();
  // 查询条件表单清空
  const resetForm = function () {
    formRef.value.resetFields();
    form.maxListingCount = '';
    form.searchTimeType = 'listingTime';
    form.time = '';
    form.searchSKUType = 'pSkus';
    form.searchSKUValue = '';
    form.cate = [];
    form.cateOaIdList = [];
    form.mercateName = [];
    form.oacateName = [];
    form.priceMax = '';
    form.salesMax = '';
    form.salesMin = '';
    form.preStockType = '1';
    form.preStockMin = '';
    form.preStockMax = '';
    form.preAvailableStockMin = '';
    form.preAvailableStockMax = '';
    form.preAvailableStockAllMin = '';
    form.preAvailableStockAllMax = '';
    form['orderBySalePrice'] = '';
  };
  // 查询条件提交查询
  const onSubmit = async () => {
    // preStockType: '1',
    // preStockMin: '',
    // preStockMax: '',
    // preAvailableStockMin: '',
    // preAvailableStockMax: '',
    // preAvailableStockAllMin: '',
    // preAvailableStockAllMax: '',
    tableDataLoading.value = true;
    tableData.value = null;
    form.page = currentPage.value;
    form.limit = pageSize.value;
    form.sortType = form.orderBy * 1;
    form['orderBySalePrice'] = '';
    if (form.orderBy == 10) {
      form['orderBySalePrice'] = 'ASC';
    } else if (form.orderBy == 11) {
      form['orderBySalePrice'] = 'DESC';
    }
    form.hasWhiteImg = form.hasWhiteImgs.map(function (data) {
      return data * 1;
    });
    form.itemIds = form.itemId == '' ? [] : form.itemId.split(',');
    form.storeAcctIds =
      form.storeAcctId == '' ? [] : form.storeAcctId.toString().split(',');
    form.pSkus = [];
    form.sSkus = [];
    form[form.searchSKUType] =
      form.searchSKUValue == '' ? [] : form.searchSKUValue.split(',');
    form.startTime = form.endTime = '';
    if (form.time && form.time.length != 0) {
      form.startTime = form.time[0] + ' 00:00:00';
      form.endTime = form.time[1] + ' 23:59:59';
    }
    if (form.mercateName.length && form.mercateName.length != 0) {
      form.cate = [];
      form.mercateName.forEach((item) => {
        form.cate.push(item[item.length - 1]);
      });
    } else {
      form.cate = [];
    }

    if (form.oacateName.length && form.oacateName.length != 0) {
      form.cateOaIdList = [];
      form.oacateName.forEach((item) => {
        form.cateOaIdList.push(item[item.length - 1]);
      });
    } else {
      form.cateOaIdList = [];
    }

    if (form.preStockType == 1) {
      form.preAvailableStockAllMin = form.preStockMin;
      form.preAvailableStockAllMax = form.preStockMax;
      form.preAvailableStockMin = '';
      form.preAvailableStockMax = '';
    } else if (form.preStockType == 2) {
      form.preAvailableStockAllMin = '';
      form.preAvailableStockAllMax = '';
      form.preAvailableStockMin = form.preStockMin;
      form.preAvailableStockMax = form.preStockMax;
    }
    // 统计总数
    if (form.type && form.type.length != 0) {
      form.needLimitCount = false;
    } else {
      form.needLimitCount = true;
    }
    let { code, count, data } = await getProducts(form);
    code == '0000' && count == 0
      ? (tableData.value = [])
      : (tableData.value = data.map((item) => {
          item.displayCount = 3;
          return item;
        }));
    total.value = count;
    tabsTotal.value[activeName.value] = count;
    tableDataLoading.value = false;
  };

  // // 导出模板
  // const handleExportTemp = () => {
  //   const elink = document.createElement('a'); // 建一个a标签
  //   elink.style.display = 'none'; // 设置标签style属性
  //   elink.href =
  //     window.location.origin +
  //     '/api/lms/PlatWh/PlatWhShipmentBox/downPackageTemplate.html'; // 设置标签href
  //   document.body.appendChild(elink); // 页面中添加这个标签
  //   elink.click(); // 点击这个标签
  //   URL.revokeObjectURL(elink.href);
  // };

  // 导入模板之前
  const handleChange = (file) => {
    ElMessageBox.confirm(
      '确定导入这个文件，对这些店铺的所有商品进行调价吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'Warning'
      }
    ).then(async () => {
      var form = new FormData();
      form.append('file', file.raw);
      const { code, msg } = await importUpdatePriceByStoreList(form);
      if (code === '0000') {
        ElMessageBox.alert(msg, '导入成功，详细信息如下', {
          confirmButtonText: '取消'
        });
      }
    });
  };

  //   表格展开所有--start
  const viewAll = (row) => {
    row.displayCount = row.pprodSyncSMercadoDtos.length;
  };
  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };
  //   表格展开所有--end
  // 类目组件 start
  const showCateDialog = ref(false);
  const prodPId = ref();
  const handleCateDialogType = ref('');
  const handleCateDialogClose = (e) => {
    if (!e.cate) {
      showCateDialog.value = e.isShow;
      return;
    }
    showCateDialog.value = e.isShow;
  };
  // 类目组件 end
  let tabsName = ref(['在线', '已下架']);
  const activeName = ref('在线');
  const handleClick = (tab) => {
    if (activeName.value != tab.paneName && tab.paneName == '已下架') {
      initFormData.listingStatus = [
        'closed',
        'inactive',
        'paused',
        'under_review',
        'delete'
      ];
      form.listingStatus = [
        'closed',
        'inactive',
        'paused',
        'under_review',
        'delete'
      ];
    } else if (activeName.value != tab.paneName && tab.paneName == '在线') {
      initFormData.listingStatus = ['active'];
      form.listingStatus = ['active'];
    }
    if (tab.paneName == '已下架') {
      form.isPromotion = 0;
      form.isMultiSku = form.tortBanListing = form.canSaleBool = '';
      form.logisAttrList = [];
    }
    tableDataLoading.value = true;
    activeName.value = tab.paneName;
    currentPage.value = 1;
    onSubmit();
  };
  onMounted(async () => {
    // 部门
    getPaymentsList();
    // 销售员
    getDepartmentList();
    // 店铺
    getStoreList();
    // 美客多类目
    {
      const { data } = await getCateTree();
      initFormData.merList = data;
    }
    {
      //OA新类目
      const { data } = await queryOaNewCategory();
      initFormData.oaList = JSON.parse(data);
    }
    //物流属性
    {
      const { data } = await getLogisListApi();
      initFormData.logisAttr = data.map((item) => item.name);
    }
    //商品标签
    {
      const { data } = await getProdTagListApi();
      initFormData.prodTag = data.map((item) => item.name);
    }
  });
  let tableDataRef = ref();
  //  部门-销售员-店铺联动 -- start
  // 列表数据
  const paymentsList = ref([]);
  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: []
  });
  const salersDataCopy = ref([]);
  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };
  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  // 获取 payments 列表数据
  const getPaymentsList = async () => {
    let storeAcctIdList = [];
    // 部门 销售人员 店铺没有筛选
    if (!form.orgId && !form.salePersonId && form.storeAcctId.length === 0) {
      storeAcctIdList = [];
    }

    // 选择部门或者销售人员 没有选择店铺
    if ((form.orgId || form.salePersonId) && form.storeAcctId.length === 0) {
      if (selectData.storeData.length) {
        storeAcctIdList = selectData.storeData.map((item) => item.id);
      } else {
        // 如果销售人员下没有数据的话 传 -1
        storeAcctIdList = [-1];
      }
    }

    let params = {
      storeAcctIdList:
        form.storeAcctId.length > 0 ? form.storeAcctId : storeAcctIdList
    };
    const { data } = await getPaymentsData(params);
    paymentsList.value = data;
  };

  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'mercado专员'
    };
    const { data } = await getDepartData(params);
    selectData.departData = data.orgTree;
    selectData.salersData = data.userList;
    salersDataCopy.value = data.userList;
  };

  // 获取店铺信息
  const getStoreList = async () => {
    let params = {
      roleNames: 'mercado专员',
      orgId: form.orgId,
      salePersonId: form.salePersonId,
      platCode: 'mercado',
      lmsAppUserName: userName.value
    };
    const { data } = await getStoreInfo(params);
    selectData.storeData = data;
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
    form.storeAcctId = [];
    getStoreList();
  };

  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    form.orgId = '';
    resetSearch();
  };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    form.salePersonId = '';
    form.storeAcctId = '';
    // form.storeAcctIds = '';
    getStoreList();
  };
  //  部门-销售员-店铺联动 -- end
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 360;
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
<style scoped lang="scss">
  .copy_icon {
    margin-left: 5px;
    color: #666;
    cursor: pointer;
  }
  .mt-10 {
    margin-top: 10px;
  }
  //   查询条件--listing状态框
  :deep(.el-select__tags) {
    max-width: 100px !important;
  }
  // 平台多选框
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

  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }
</style>
