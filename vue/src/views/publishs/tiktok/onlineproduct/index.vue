<template>
  <!-- tiktok在线商品页面 -->
  <div v-loading="pageLoading" class="publish_wrapper app-container">
    <!-- 筛选条件表单 start -->
    <el-card ref="searchCard" class="search_card common_split_bottom">
      <div class="flex">
        <div class="form_title">Product查询</div>
        <el-form
          ref="formRef"
          :model="formData"
          :inline="true"
          :label-width="180"
          class="search_form flex-1"
        >
          <el-form-item
            label="店铺"
            prop="storeAcctIdList"
            class="search_item_cascader"
          >
            <z-cascader
              v-model="formData.storeAcctIdList"
              :data="initFormData.storeCascaderList"
            ></z-cascader>
          </el-form-item>
          <el-form-item label="站点" prop="salesSiteList">
            <el-select
              v-model="formData.salesSiteList"
              placeholder="请选择"
              :class="formData.salesSiteList?.length > 1 ? 'hide_tag' : ''"
              filterable
              collapse-tags
              clearable
              multiple
            >
              <template #prefix>
                <el-tag v-if="formData.salesSiteList?.length > 1" type="info"
                  >已选{{ formData.salesSiteList?.length }}项</el-tag
                >
              </template>
              <el-option
                v-for="item in initFormData.siteList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="OA新类目"
            prop="prodCateOaIdList"
            class="search_item_cascader"
          >
            <z-cascader
              v-model="formData.prodCateOaIdList"
              :data="initFormData.oaList"
              :props="{
                label: 'title',
                children: 'data',
                value: 'value'
              }"
            ></z-cascader>
          </el-form-item>
          <el-form-item
            label="TikTok类目"
            prop="categoryIdList"
            class="search_item_cascader"
          >
            <z-cascader
              v-model="formData.categoryIdList"
              :data="initFormData.tiktokList"
              :props="{
                label: 'cnName',
                children: 'children',
                value: 'categoryId'
              }"
            ></z-cascader>
          </el-form-item>
          <el-form-item label="商品类型" prop="multipleSku">
            <el-select v-model="formData.multipleSku" clearable filterable>
              <el-option :value="0" label="单属性" />
              <el-option :value="1" label="多属性" />
            </el-select>
          </el-form-item>
          <el-form-item prop="searchList">
            <el-select
              v-model="formData.searchType"
              class="form_left"
              clearable
              filterable
            >
              <el-option value="prodPSkuList" label="商品父SKU" />
              <el-option value="productIdList" label="product_id" />
              <el-option
                value="globalProductIdList"
                label="global_product_id"
              />
            </el-select>
            <el-input
              v-model="formData.searchList"
              clearable
              class="form_right"
              placeholder="支持多个搜索逗号隔开"
              @blur="commonDivideComma($event)"
            />
          </el-form-item>
          <el-form-item prop="productName">
            <el-select
              v-model="formData.productNameType"
              class="form_left"
              clearable
              filterable
            >
              <el-option value="分词全模糊" label="刊登标题（分词全模糊）" />
              <el-option value="常规模糊" label="刊登标题（常规模糊）" />
            </el-select>
            <el-input
              v-model="formData.productName"
              clearable
              class="form_right"
            />
          </el-form-item>
          <el-form-item prop="time">
            <el-select v-model="formData.timeType" class="form_left" filterable>
              <el-option value="prodCreateTime" label="刊登时间" />
              <el-option value="prodUpdateTime" label="修改时间" />
            </el-select>
            <el-date-picker
              v-model="formData.time"
              value-format="YYYY-MM-DD"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 200px"
              class="form_right"
              :shortcuts="shortcuts"
            />
          </el-form-item>
          <el-form-item prop="salesQueryType" class="form_range"
            ><el-select
              v-model="formData.salesQueryType"
              class="form_left"
              filterable
            >
              <el-option
                v-for="item in SALE_ENUM"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input
              v-model="formData.salesQueryLowerBound"
              style="width: 52px"
              oninput="value=value.replace(/[^\d]/g,'')"
              clearable
            />
            <div class="range_link">-</div>
            <el-input
              v-model="formData.salesQueryUpperBound"
              style="width: 52px"
              clearable
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </el-form-item>
          <el-form-item prop="stockType" class="form_range"
            ><el-select
              v-model="formData.stockType"
              class="form_left"
              filterable
            >
              <el-option value="全部库存" label="全部库存" />
              <el-option value="部分库存" label="部分库存" />
            </el-select>
            <el-input
              v-model="formData.stockLowerBound"
              class="form_right"
              clearable
            />
            <div class="range_link">-</div>
            <el-input v-model="formData.stockUpperBound" clearable />
          </el-form-item>
          <el-form-item label="在售状态" prop="prodIsSaleStatusList">
            <MultiSelect
              v-model="formData.prodIsSaleStatusList"
              :option-obj="{
                optionList: prodIsSaleStatusOptionList,
                value: 'value',
                label: 'label'
              }"
            />
          </el-form-item>
          <el-form-item label="是否添加促销" prop="isPromotion">
            <el-select v-model="formData.isPromotion" clearable filterable>
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否添加秒杀" prop="flashSaleSelectType">
            <el-select
              v-model="formData.flashSaleSelectType"
              clearable
              filterable
            >
              <el-option :value="1" label="全部子sku均秒杀" />
              <el-option :value="2" label="否" />
              <el-option :value="3" label="部分子sku秒杀" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeKey === '5,6'"
            label="Listing状态"
            prop="listingStausOff"
          >
            <el-select v-model="formData.listingStausOff" clearable filterable>
              <el-option value="5" label="卖家下架" />
              <el-option value="6" label="平台下架" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeKey === '2,3,7'"
            label="Listing状态"
            prop="listingStausStopList"
          >
            <el-select
              v-model="formData.listingStausStopList"
              clearable
              filterable
              :class="
                formData.listingStausStopList?.length > 1 ? 'hide_tag' : ''
              "
              multiple
            >
              <template #prefix>
                <el-tag
                  v-if="formData.listingStausStopList?.length > 1"
                  type="info"
                  >已选{{ formData.listingStausStopList.length }}项</el-tag
                >
              </template>
              <el-option value="2" label="审核中" />
              <el-option value="3" label="审核失败" />
              <el-option value="7" label="已冻结" />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="orderTypeContent"
            class="orderType"
            label="排序方式"
          >
            <el-select v-model="formData.orderTypeContent" clearable filterable>
              <el-option
                v-for="item in ORDER_TYPE_CONTENT_ENUM"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <el-select
              v-model="formData.orderTypeContentType"
              class="form_right"
              clearable
              filterable
            >
              <el-option :value="1" label="正序" />
              <el-option :value="2" label="倒序" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeKey === '2,3,7'"
            prop="qcReasonsOaCodeList"
            label="审核失败原因"
          >
            <el-select
              v-model="formData.qcReasonsOaCodeList"
              clearable
              multiple
              filterable
              remote
              :class="
                formData.qcReasonsOaCodeList?.length > 1 ? 'hide_tag' : ''
              "
              :remote-method="filterCheckFailReason"
              collapse-tags
            >
              <template #prefix>
                <el-tag
                  v-if="formData.qcReasonsOaCodeList?.length > 1"
                  type="info"
                  >已选{{ formData.qcReasonsOaCodeList?.length }}项</el-tag
                >
              </template>
              <el-option
                v-for="item in initFormData.filterQcReasonListOption"
                :key="item"
                :value="item.bizValue"
                :label="item.bizApiValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="onlineProductTag"
            prop="listingTagQueryType"
            label="在线product标签"
          >
            <el-select
              v-model="formData.listingTagQueryType"
              style="width: 90px"
              class="search_form"
              filterable
              @change="changeListingTagQueryType"
            >
              <el-option :value="1" label="包含" />
              <el-option :value="2" label="不包含" />
            </el-select>
            <el-select
              v-if="formData.listingTagQueryType === 1"
              v-model="formData.listingTagIdList"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              style="width: 135px"
              clearable
              filterable
            >
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
            <el-select
              v-if="formData.listingTagQueryType !== 1"
              v-model="formData.listingTagIdList"
              style="width: 150px"
              clearable
              filterable
            >
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="canSales" label="是否禁售">
            <el-select
              v-model="formData.canSales"
              clearable
              filterable
              @change="changeCanSale"
            >
              <el-option value="" label="全部" />
              <el-option :value="false" label="禁售" />
              <el-option :value="true" label="非禁售" />
            </el-select>
          </el-form-item>
          <el-form-item prop="tortBanListings" label="是否侵权">
            <el-select
              v-model="formData.tortBanListings"
              clearable
              filterable
              @change="changeTortBanListing"
            >
              <el-option
                v-for="item in initFormData.tortBanListingOption"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeKey === '8'"
            prop="reListingStatus"
            label="重新刊登状态"
          >
            <el-select v-model="formData.reListingStatus" clearable filterable>
              <el-option :value="1" label="已刊登" />
              <el-option :value="0" label="未刊登" />
            </el-select>
          </el-form-item>
          <el-form-item label="刊登类型">
            <el-select v-model="formData.listingType" clearable filterable>
              <el-option value="SALE" label="销售刊登" />
              <el-option value="SYS" label="系统刊登" />
            </el-select>
          </el-form-item>
          <el-form-item prop="haveTempVideo" label="视频库视频">
            <el-select v-model="formData.haveTempVideo" clearable filterable>
              <el-option :value="true" label="有" />
              <el-option :value="false" label="无" />
            </el-select>
          </el-form-item>
          <el-form-item prop="videoState" label="视频状态">
            <el-select v-model="formData.videoState" clearable filterable>
              <el-option :value="0" label="未上传" />
              <el-option :value="1" label="已上传" />
              <el-option :value="2" label="上传失败" />
              <el-option :value="3" label="上传中" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="flex">
        <div class="form_title">SKU查询</div>
        <el-form
          ref="form2Ref"
          :model="formData2"
          :inline="true"
          :label-width="100"
          class="search_form flex-1"
        >
          <el-form-item prop="prodSSkuListStr" label="商品子SKU">
            <el-input
              v-model="formData2.prodSSkuListStr"
              clearable
              style="width: 140px"
              placeholder="支持多个搜索逗号隔开"
              @blur="commonDivideComma($event)"
            />
          </el-form-item>
          <el-form-item prop="priceType" class="form_range"
            ><el-select
              v-model="formData.priceType"
              class="form_left"
              filterable
            >
              <el-option value="originalPrice" label="税前价" />
              <el-option value="priceIncludeVat" label="本地展示价" />
              <el-option value="promotionPrice" label="促销价" />
              <el-option value="flashSalePrice" label="秒杀价" />
            </el-select>
            <el-input
              v-model="formData.priceMin"
              style="width: 52px"
              clearable
            />
            <div class="range_link">-</div>
            <el-input
              v-model="formData.priceMax"
              style="width: 52px"
              clearable
            />
          </el-form-item>
          <el-form-item prop="subStockMin" label="在线数量">
            <el-input
              v-model="formData2.subStockMin"
              style="width: 52px"
              clearable
              placeholder="≥"
            />
            <div class="range_link">-</div>
            <el-input
              v-model="formData2.subStockMax"
              style="width: 52px"
              clearable
              placeholder="≤"
            />
          </el-form-item>
          <el-form-item label="商品状态" prop="subIsSale">
            <el-select
              v-model="formData2.subIsSale"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option :value="1" label="在售" />
              <el-option :value="0" label="停售" />
            </el-select>
          </el-form-item>
          <el-form-item prop="preAvailableStockType" class="form_range"
            ><el-select
              v-model="formData.preAvailableStockType"
              class="form_left"
              filterable
            >
              <el-option
                value="preAvailableStockAll"
                label="预计可用库存含在途"
              />
              <el-option
                value="preAvailableStock"
                label="预计可用库存不含在途"
              />
            </el-select>
            <el-input
              v-model="formData.preAvailableStockMin"
              class="form_right"
              clearable
            />
            <div class="range_link">-</div>
            <el-input v-model="formData.preAvailableStockMax" clearable />
          </el-form-item>
          <el-form-item prop="subListingTagQueryType" label="在线sku标签">
            <el-select
              v-model="formData2.subListingTagQueryType"
              style="width: 90px"
              class="search_form"
              filterable
              @change="changeSubListingTagQueryType"
            >
              <el-option :value="1" label="包含" />
              <el-option :value="2" label="不包含" />
            </el-select>
            <el-select
              v-if="formData2.subListingTagQueryType === 1"
              v-model="formData2.subListingTagIdList"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              style="width: 150px"
              clearable
              filterable
            >
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
            <el-select
              v-if="formData2.subListingTagQueryType !== 1"
              v-model="formData2.subListingTagIdList"
              style="width: 150px"
              clearable
              filterable
            >
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button
                type="primary"
                :loading="tableDataLoading"
                @click="handleSearch"
                >查询</el-button
              >
              <el-button @click="handleResetForm({ formRef, form2Ref })"
                >重置</el-button
              >
              <el-dropdown
                split-button
                type="primary"
                style="margin: 0 10px 10px"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="最多复制1w个"
                  placement="top"
                >
                  一键复制
                </el-tooltip>
                <template #dropdown>
                  <el-dropdown-menu>
                    <template v-for="item in needCopyList" :key="item.code">
                      <div>
                        <el-dropdown-item @click="handleCopySkuInfo(item.code)">
                          {{ item.fieldName }}
                        </el-dropdown-item>
                      </div>
                    </template>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-form-item>
        </el-form>
      </div>
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
        show-overflow
        :row-config="{
          isCurrent: true,
          isHover: true,
          height: 500,
          keyField: 'productId'
        }"
        :column-config="{ resizable: true }"
        :scroll-y="{ gt: 10 }"
      >
        <vxe-column width="40">
          <template #header>
            <el-checkbox v-model="pAllChecked" @change="changeAllChecked">
            </el-checkbox>
          </template>
          <template #default="{ row }">
            <el-checkbox
              v-model="row.pChecked"
              @change="changePChecked($event, row)"
            >
            </el-checkbox>
          </template>
        </vxe-column>
        <vxe-column title="图片" width="100" field="firstImageUrl">
          <template #default="{ row }">
            <ImagePop :src="row.firstImageUrl" />
          </template>
        </vxe-column>
        <vxe-column field="productName" title="标题/产品id" width="130">
          <template #default="{ row }">
            {{ row.productName }}
            <el-tag v-if="row.isSale === 0" type="danger">停</el-tag>
            <el-tag
              v-if="row.isPromotion"
              class="ml05"
              :type="getTagType(row.promotionStatus, 2)"
              >促</el-tag
            >
            <el-popover
              v-if="showFlashSaleTag(row.flashSalePromotion)"
              width="260"
            >
              <template #reference>
                <el-tag
                  class="ml05"
                  :type="getTagType(row.flashSalePromotion.promotionStatus, 2)"
                  >秒</el-tag
                >
              </template>
              <div>
                秒杀活动类型：{{
                  row.flashSalePromotion.autoRenew ? '连续' : '单次'
                }}
              </div>
              <div>
                秒杀开始时间：{{
                  transferDate(row.flashSalePromotion.startTime)
                }}
              </div>
              <div>
                秒杀结束时间：{{ transferDate(row.flashSalePromotion.endTime) }}
              </div>
            </el-popover>
            <div style="display: flex; align-items: center">
              product_id:<el-link
                :href="`https://shop.tiktok.com/view/product/${row.productId}?region=${row.salesSite}&locale=zh-CN`"
                target="_blank"
                type="primary"
                :underline="false"
                >{{ row.productId }}</el-link
              >
              <el-icon
                v-if="row.productId"
                class="copy_icon"
                color="#aaa"
                style="cursor: pointer"
                @click="copy(row.productId)"
                ><CopyDocument
              /></el-icon>
            </div>
            <div v-if="row.globalProductId">
              global_product_id:{{ row?.globalProductId }}
              <el-icon
                class="copy_icon"
                color="#aaa"
                style="cursor: pointer"
                @click="copy(row.globalProductId)"
                ><CopyDocument
              /></el-icon>
            </div>
            <div>
              [{{ row.storeAcct }}]&nbsp;&nbsp;[{{ row.shopId }}]&nbsp;&nbsp;[{{
                row.salesperson || ''
              }}]
            </div>
            <span>{{ row.fullCateNameChinese }}</span>
            <div
              v-if="row.listingTagInfoList && row.listingTagInfoList.length"
              class="tag_grid"
            >
              <span v-for="item in row.listingTagInfoList" :key="item.id">
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div>
                      <span v-if="item.tagAddDays !== undefined"
                        >({{ item.tagAddDays }}) </span
                      ><span v-if="item.note">{{ item.note }}</span>
                    </div>
                  </template>
                  <el-tag type="primary" effect="dark">
                    {{ item.name }}
                  </el-tag>
                </el-tooltip>
              </span>
            </div>
          </template></vxe-column
        >
        <vxe-column field="prodStatusName" title="Listing状态" width="70"
          ><template #default="{ row }"
            >{{ STATUS_ENUM[row.prodStatusName] }}
          </template></vxe-column
        >
        <vxe-column field="prodPSku" title="商品父SKU" width="100">
          <template #default="{ row }">
            {{ row.prodPSku }}
            <el-icon
              v-if="row.prodPSku"
              class="copy_icon"
              color="#aaa"
              style="cursor: pointer"
              @click="copy(row.prodPSku)"
              ><CopyDocument
            /></el-icon>
          </template>
        </vxe-column>
        <vxe-column class-name="sub_table_cell">
          <template #header>
            <div class="flex-center">
              <div style="width: 40px">
                <el-checkbox
                  v-model="sAllChecked"
                  size="large"
                  @change="changeAllChecked"
                />
              </div>
              <div class="table_header">seller_sku</div>
              <div class="table_header">shop_sku_id</div>
              <div class="table_header">销售属性</div>
              <div class="table_header">税前价</div>
              <div class="table_header">本地展示价</div>
              <div class="table_header">促销价</div>
              <div v-if="activeKey == '4'" style="width: 80px">秒杀价</div>
              <div class="table_header">在线数量</div>
              <div class="table_header">可用/在途/未派</div>
            </div>
          </template>
          <template #default="{ row }">
            <vxe-table
              :data="
                isShowAllSku
                  ? row?.skuList
                  : row?.skuList.filter((cItem) => cItem.passFilter)
              "
              :show-header="false"
              max-height="400"
            >
              <vxe-column width="40">
                <template #default="{ row: sonRow }">
                  <el-checkbox
                    v-model="sonRow.sChecked"
                    @change="changeSChecked($event, row)"
                  >
                  </el-checkbox>
                </template>
              </vxe-column>
              <vxe-column field="sellerSku">
                <template #default="{ row: sonRow }"
                  >[{{ sonRow.sellerSku }}]
                  <el-icon
                    v-if="sonRow.sellerSku"
                    class="copy_icon"
                    color="#aaa"
                    style="cursor: pointer"
                    @click="copy(sonRow.sellerSku)"
                    ><CopyDocument
                  /></el-icon>
                  <el-tag v-if="sonRow.isSale === 0" type="danger">停</el-tag>
                  <el-popover v-if="sonRow?.flashSaleTiktok?.id" width="260">
                    <template #reference>
                      <el-tag
                        class="ml05"
                        :type="
                          getTagType(row.flashSalePromotion?.promotionStatus, 2)
                        "
                        >秒</el-tag
                      >
                    </template>
                    <div>
                      秒杀活动类型：{{
                        row.flashSalePromotion.autoRenew ? '连续' : '单次'
                      }}
                    </div>
                    <div>
                      秒杀开始时间：{{
                        transferDate(row.flashSalePromotion.startTime)
                      }}
                    </div>
                    <div>
                      秒杀结束时间：{{
                        transferDate(row.flashSalePromotion.endTime)
                      }}
                    </div>
                    <div>
                      秒杀限购总量：{{
                        getFlashSaleLimit(sonRow.flashSaleTiktok.skuNumLimit)
                      }}
                    </div>
                    <div>
                      秒杀买家限购：{{
                        getFlashSaleLimit(sonRow.flashSaleTiktok.skuUserLimit)
                      }}
                    </div>
                  </el-popover>
                </template>
              </vxe-column>
              <vxe-column field="skuId">
                <template #default="{ row: sonRow }">
                  <div>{{ sonRow.skuId }}</div>
                  <div
                    v-if="
                      sonRow.listingTagInfoList &&
                      sonRow.listingTagInfoList.length
                    "
                    class="tag_grid"
                  >
                    <span
                      v-for="tItem in sonRow.listingTagInfoList"
                      :key="tItem.id"
                    >
                      <el-tooltip placement="top" effect="light">
                        <template #content>
                          <div>
                            <span v-if="tItem.tagAddDays !== undefined"
                              >({{ tItem.tagAddDays }}) </span
                            ><span v-if="tItem.note">{{ tItem.note }}</span>
                          </div>
                        </template>
                        <el-tag type="primary" effect="dark">
                          {{ tItem.name }}
                        </el-tag>
                      </el-tooltip>
                    </span>
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="skuList"
                ><template #default="{ row: sonRow }">
                  <template
                    v-for="saleAttrItem in sonRow.saleAttributeList"
                    :key="saleAttrItem.id"
                  >
                    <div>
                      {{ saleAttrItem.name }}：{{ saleAttrItem.valueName }}
                    </div>
                  </template>
                </template>
              </vxe-column>
              <vxe-column field="originalPrice"
                ><template #default="{ row: sonRow }"
                  >{{ sonRow.originalPrice }} {{ sonRow.currency }}
                </template>
              </vxe-column>
              <vxe-column field="priceIncludeVat">
                <template #default="{ row: sonRow }"
                  >{{ sonRow.priceIncludeVat }} {{ sonRow.currency }}
                </template>
              </vxe-column>
              <vxe-column field="promotionPrice">
                <template #default="{ row: sonRow }"
                  >{{ sonRow.promotionPrice }} {{ sonRow.currency }}
                </template>
              </vxe-column>
              <vxe-column
                v-if="activeKey == '4'"
                field="flashSalePrice"
                width="80"
              >
                <template #default="{ row: sonRow }">
                  <div
                    v-if="
                      sonRow.flashSalePrice !== undefined &&
                      sonRow.flashSalePrice !== null
                    "
                  >
                    {{ sonRow.flashSalePrice }} {{ sonRow.currency }}
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="stock" />
              <vxe-column width="100">
                <template #default="{ row: sonRow }">{{
                  (sonRow.availableStock || 0) +
                  ' / ' +
                  (sonRow.orderNotInNum || 0) +
                  ' / ' +
                  (sonRow.lackUnPaiNum || 0)
                }}</template>
              </vxe-column>
            </vxe-table>
          </template></vxe-column
        >
        <vxe-column title="商品重量/在线重量" width="100" field="weight">
          <template #default="{ row }"
            >{{ row.maxSkuWeight }}g/{{ row.globalPackWeight }}g</template
          ></vxe-column
        >
        <vxe-column
          v-if="activeKey === '2,3,7'"
          width="140"
          title="审核失败原因"
          field="qcReasonStr"
        />
        <vxe-column title="销量/全球销量" width="140">
          <template #default="{ row }">
            <div>
              7天：{{ row.sevenDaysSales }} / {{ row.globalSevenDaysSales }}
            </div>
            <div>
              30天：{{ row.thirtyDaysSales }}/ {{ row.globalThirtyDaysSales }}
            </div>
            <div>
              60天：{{ row.sixtyDaysSales }}/ {{ row.globalSixtyDaysSales }}
            </div>
            <div>
              90天：{{ row.ninetyDaysSales }}/ {{ row.globalNinetyDaysSales }}
            </div>
            <div>
              180天：{{ row.halfYearSales }}/ {{ row.globalHalfYearSales }}
            </div>
            <div>
              365天：{{ row.oneYearSales }}/ {{ row.globalOneYearSales }}
            </div>
            <div v-if="row.salesCountTime">
              更新:<br />{{ transferDate(row.salesCountTime) }}
            </div>
          </template>
        </vxe-column>

        <vxe-column title="时间" width="120">
          <template #default="{ row }">
            <div>刊登： <br />{{ transferDate(row.prodCreateTime) }}</div>
            <div>修改： <br />{{ transferDate(row.prodUpdateTime) }}</div>
          </template>
        </vxe-column>

        <vxe-column title="操作" width="80" fixed="right">
          <template #default="{ row }">
            <!-- <el-button
                  type="primary"
                  v-if="activeKey !== '8'"
                  @click="handleUpdate(row)"
                  :loading="updateLoading"
                  >更新</el-button
                >
                <el-button
                  type="primary"
                  v-if="activeKey === '1'"
                  @click="handlePublish(row)"
                  :loading="publishLoading"
                  >发布</el-button
                > -->
            <el-button type="primary" @click="handleViewLog(row)"
              >日志</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[50, 100, 300, 1000]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="tools_btn disflex flex-center -mt-8">
        <el-tooltip
          effect="dark"
          content="显示满足查询条件的listing内全部子sku"
          placement="top"
        >
          <el-checkbox
            v-model="isShowAllSku"
            size="large"
            style="margin-right: 15px"
            @change="initAllChecked"
            >显示全部子sku</el-checkbox
          >
        </el-tooltip>
        <el-select
          v-model="downLoadTplOption"
          v-permission="['tiktokonlilneimportadjuststore']"
          placeholder="下载模板"
          filterable
          clearable
          style="width: 150px"
        >
          <el-option
            label="调整店铺商品价格模版"
            value="调整店铺商品价格模版"
            @click="handleDownLoadTpl"
          />
        </el-select>
        <!-- <el-upload
          v-model:file-list="fileList"
          v-permission="['tiktokonlilneimportadjuststore']"
          class="upload-demo"
          accept="xlsx,xls"
          :show-file-list="false"
          action="/api/lms/tiktok/product/adjustPriceByExcel"
          :before-upload="handleExportBefore"
          :on-success="handleExportResult"
          :on-error="handleExportError"
        > -->
        <el-button type="primary" @click="exportAdjustPrice"
          >导入调价</el-button
        >
        <!-- </el-upload> -->
        <el-button
          type="primary"
          class="ml20"
          :loading="exportLoading"
          @click="handleExport()"
          >导出</el-button
        >
        <!-- <el-select
          v-if="activeKey === '8'"
          v-model="batchCopySku"
          class="ml20"
          placeholder="批量操作"
          filterable
          clearable
          style="width: 150px"
        >
          <el-option label="复制SKU" value="复制SKU" @click="handleCopySku" />
        </el-select> -->
        <el-dropdown style="margin: 0 10px">
          <el-button type="primary">
            批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="item in batchList" :key="item.value">
                <div
                  v-if="item.showTab.includes(activeKey) && item.permission"
                  v-permission="[item.permission]"
                >
                  <el-dropdown-item @click="handleBatch(item.value)">
                    {{ item.label }}
                  </el-dropdown-item>
                </div>
                <el-dropdown-item
                  v-if="item.showTab.includes(activeKey) && !item.permission"
                  @click="handleBatch(item.value)"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-card>
    <!-- 数据展示列表 end -->
    <!-- 组件 start -->
    <div>
      <!-- 操作日志 -->
      <LogDialog v-model="logVisible" :checked-row="checkedRow" />
      <!-- 调整库存 -->
      <AdjustStockDialog
        v-model="batchVisible.batchAdjustStock"
        :row-checked-list="rowCheckedList"
        @handle-search="handleSearch"
      />
      <!-- 调整税前价 -->
      <AdjustPreTaxPriceDialog
        v-if="batchVisible.batchPreTaxPrice"
        v-model="batchVisible.batchPreTaxPrice"
        :row-checked-list="rowCheckedList"
        :store-list="initFormData.storeList"
        @handle-search="handleSearch"
      />
      <!-- 修改seller_sku -->
      <UpdateSellerSku
        v-model="batchVisible.batchModifySellerSku"
        :row-checked-list="rowCheckedList"
        @handle-search="handleSearch"
      />
      <!-- 修改listing促销 -->
      <PromotionDialog
        v-if="batchVisible.batchPromotion"
        v-model="batchVisible.batchPromotion"
        :operate-data="operateData"
        @handle-search="handleSearch"
        @show-task-center="showTaskCenter"
      />
      <!-- 修改商品图片 -->
      <ReplaceImgDialog
        v-model="batchVisible.batchRepalceImg"
        :row-checked-list="rowCheckedList"
        :store-cascader-list="initFormData.storeCascaderList"
        @handle-search="handleSearch"
        @filter-cascader="filterCascader"
      />
      <!-- 修改标题 -->
      <BatchUpdateTitle
        v-if="batchVisible.batchRepalceTitle"
        v-model="batchVisible.batchRepalceTitle"
        :row-checked-list="rowCheckedList"
        plat-code="tiktok"
        @handle-search="handleSearch"
      />
      <!-- 修改描述 -->
      <ReplaceDescDialog
        v-model="batchVisible.batchRepalceDesc"
        :row-checked-list="rowCheckedList"
        @handle-search="handleSearch"
      />
    </div>
    <!-- 修改商品类目 -->
    <UpdateCate
      v-if="batchVisible.batchUpdateCate"
      v-model="batchVisible.batchUpdateCate"
      :row-checked-list="rowCheckedList"
      @show-task-center="showTaskCenter"
      @handle-search="handleSearch"
    />
    <!-- 不处理listing -->
    <FilterListing
      v-if="batchVisible.batchFilterListing"
      v-model="batchVisible.batchFilterListing"
      :row-checked-list="rowCheckedList"
      :store-tree-list="initFormData.storeCascaderList"
      @filter-cascader="filterCascader"
    />
    <!-- 任务中心的提示 -->
    <el-dialog
      v-model="taskCenterProps.exportModelVisile"
      :title="taskCenterProps.title"
      width="400"
    >
      <el-link type="primary" @click="handleJumpTaskCenter"
        ><el-icon :size="30" color="#67C23A" class="mr20"
          ><CircleCheck /></el-icon
        >{{ taskCenterProps.content }}</el-link
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="taskCenterProps.exportModelVisile = false"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 选择操作对象弹窗 -->
    <SelectOperationObject
      v-if="batchVisible.selectOperation"
      v-model="batchVisible.selectOperation"
      :only-pass-filter-sku="!isShowAllSku"
      :row-checked-list="rowCheckedList"
      :form-data="filterParams()"
      :store-list="initFormData.storeCascaderList"
      :dialog-value="batchOperateType"
      @get-params="getSecondModalParams"
    />
    <!-- 秒杀 -->
    <AddFlashSale
      v-if="batchVisible.batchAddFlashSale"
      v-model="batchVisible.batchAddFlashSale"
      :params="operateData"
    />
    <UpdateFlashSale
      v-if="batchVisible.batchUpdateFlashSale"
      v-model="batchVisible.batchUpdateFlashSale"
      :params="operateData"
    />
    <!-- 组件 end -->

    <ExportAdjustPrice
      :dialog-visible="showAdjustPriceDialog"
      @close="closeAdjustPrice"
    />

    <!-- 导出配置 -->
    <ExportConfig
      v-if="tkConfigDialog"
      :show-dialog="tkConfigDialog"
      config-type="PUBLISHS_TIKTOK_ONLINE_PRODUCT_EXPORT"
      :checkbox-data="tkExportConfigList"
      title="导出listing数据"
      :checked-row-list="checkedRowList"
      :loading="tkExportLoading"
      :use-default-value="true"
      @close-dialog="handleCloseExportConfig($event)"
      @export-dialog="exportDialog"
    />

    <!-- 批量修改listing标签 -->
    <BatchUpdateListingTags
      v-model="showUpdateListingTags"
      :checked-params-list="rowCheckedList"
      :tag-list="tagList"
      @handle-search="handleSearch"
    ></BatchUpdateListingTags>

    <!-- 已下架页签 批量删除 -->
    <BatchDeleteDialog
      v-model="isShowBatchDelete"
      :batch-delete-info="batchDeleteInfo"
      @handle-search="handleSearch"
    />
  </div>
</template>
<script setup name="publishstiktokonlineproduct">
  import { reactive, onMounted, ref, onActivated } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { useRouter } from 'vue-router';
  import {
    queryOaNewCategory,
    getPlatCategoryTreeApi,
    getSiteListApi,
    getStoreList
  } from '@/api/common';
  import {
    getStoreListApi,
    getListApi,
    batchProductOnlineApi,
    batchProductOffApi,
    batchDelApi,
    batchSyncApi,
    uploadVideoApi,
    getProductQueryEnumApi,
    getTortBanEnumApi,
    getListAllQcReasonApi,
    updateWatermarkApi,
    getExportHeadersApi,
    getListingTagApi,
    getBatchCopyEnumApi,
    batchCopyListApi,
    queryBatchDeleteByProductIdsApi
  } from '@/api/publishs/tiktokonlineproduct';
  import { commonDivideComma } from '@/utils/divide';
  import { transBlob } from '@/utils/downloadFile';
  import { transferDate } from '@/utils/common';
  import { shortcuts } from '@/api/common';
  import { STATUS_ENUM, SALE_ENUM, ORDER_TYPE_CONTENT_ENUM } from './config';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { CircleCheck } from '@element-plus/icons-vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import LogDialog from './components/LogDialog.vue';
  import AdjustStockDialog from './components/AdjustStockDialog.vue';
  import UpdateSellerSku from './components/UpdateSellerSku.vue';
  import AdjustPreTaxPriceDialog from './components/AdjustPreTaxPriceDialog.vue';
  import PromotionDialog from './components/PromotionDialog.vue';
  import ReplaceImgDialog from './components/ReplaceImgDialog.vue';
  // import ReplaceTitleDialog from './components/ReplaceTitleDialog.vue';
  import BatchUpdateTitle from '@/components/BatchUpdateTitle/index.vue';
  import ExportAdjustPrice from '@/components/ExportAdjustPrice/index.vue';
  import ExportConfig from '@/components/ExportConfig/index.vue';
  import ReplaceDescDialog from './components/ReplaceDescDialog.vue';
  import UpdateCate from './components/UpdateCate.vue';
  import FilterListing from './components/FilterListing.vue';
  import SelectOperationObject from './components/SelectOperationObject.vue';
  import AddFlashSale from './components/AddFlashSale.vue';
  import UpdateFlashSale from './components/UpdateFlashSale.vue';
  import BatchUpdateListingTags from './components/BatchUpdateListingTags.vue';
  import BatchDeleteDialog from './components/BatchDeleteDialog.vue';
  import { copy } from '@/utils/common';
  import { forIn, isEmpty, cloneDeep } from 'lodash-es';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  const DEFAULT_TR_LENGTH = 2;
  const searchCard = ref();
  const initFormData = reactive({
    storeList: [], // 店铺
    tiktokList: [], // tiktok类目
    oaList: [], // oa类目
    siteList: [], // 站点
    orderTypeOption: [], // 排序方式枚举值
    tortBanListingOption: [], // 侵权类型枚举
    qcReasonListOption: [], // 审核失败原因枚举值
    filterQcReasonListOption: []
  });
  const pageLoading = ref(false);
  // 高度
  const height = ref(400);

  onMounted(async () => {
    calculateTableHeight();
    searchByProductIdFromTkChat();
    pageLoading.value = true;
    Promise.all([
      getStoreListApi(),
      getPlatCategoryTreeApi('tiktok'),
      queryOaNewCategory(),
      getSiteListApi('tiktok'),
      getStoreList('tiktok'),
      getProductQueryEnumApi(),
      getTortBanEnumApi()
    ])
      .then((res) => {
        initFormData.storeList = res[0].data;
        initFormData.tiktokList = res[1].data;
        initFormData.oaList = JSON.parse(res[2].data);
        initFormData.siteList = res[3].data;
        initFormData.storeCascaderList = res[4]?.data?.children || [];
        initFormData.orderTypeOption = res[5]?.data;
        initFormData.tortBanListingOption =
          res[6]?.data.length > 0
            ? [{ name: '全部', code: '全部' }].concat(res[6].data)
            : [];
        pageLoading.value = false;
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        pageLoading.value = false;
      });
    // 由于该接口太慢了
    getListAllQcReasonApi().then((res) => {
      initFormData.qcReasonListOption = res.data;
    });
    getTkListingTagList();
    getNeedCopyList();
  });

  onActivated(() => {
    searchByProductIdFromTkChat();
  });

  const pAllChecked = ref(false);
  const sAllChecked = ref(false);
  const formRef = ref();
  const form2Ref = ref();
  const formData = reactive({
    productNameType: '分词全模糊',
    timeType: 'prodCreateTime',
    priceType: 'originalPrice',
    stockType: '全部库存',
    preAvailableStockType: 'preAvailableStockAll',
    searchType: 'prodPSkuList',
    searchList: '', // 商品父sku输入框
    orderTypeContent: '', // 排序方式
    orderTypeContentType: 2, // 正序倒序
    salesQueryType: 7, // 销量查询
    salesQueryUpperBound: '', // 销量上限值
    salesQueryLowerBound: '', // 销量下限值
    canSale: '', // 是否禁售 全部'' 非禁售 true 禁售 false
    canSales: '',
    tortBanListing: '', // 是否侵权
    tortBanListings: '全部',
    qcReasonsOaCodeList: [], // 审核失败原因
    reListingStatus: '', // 重新刊登状态
    listingType: '', // 刊登类型
    haveTempVideo: '',
    videoState: '',
    prodIsSaleStatusList: [], // 在售状态
    listingTagQueryType: 1, // 是否包含
    listingTagIdList: [] // 选中的标签id
  });

  const formData2 = reactive({
    prodSSkuListStr: '',
    subIsSale: '', // 商品状态
    subStockMin: '', // 在线数量 区间
    subStockMax: '',
    subListingTagIdList: [], // sku标签
    subListingTagQueryType: 1
  });

  // 是否显示全部子sku
  const isShowAllSku = ref(false);

  const prodIsSaleStatusOptionList = ref([
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

  const activeKey = ref('4');
  const tabList = ref([
    { label: '在线商品', count: 0, status: '4' },
    { label: '已下架', count: 0, status: '5,6' },
    { label: '暂停销售', count: 0, status: '2,3,7' },
    { label: '草稿', count: 0, status: '1' },
    { label: '已删除', count: 0, status: '8' }
  ]);

  const tableData = ref();
  const tableDataLoading = ref(false);
  const tableRef = ref();
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });

  const calculateTableHeight = () => {
    const searchCardHeight = searchCard.value.$el.clientHeight;
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    height.value = clientHeight - searchCardHeight - 175;
  };

  // 清空表单
  const handleResetForm = ({ formRef, form2Ref }) => {
    if (!formRef) return;
    if (!form2Ref) return;
    formRef.resetFields();
    form2Ref.resetFields();

    formData.priceMin = null;
    formData.priceMax = null;
    formData.stockLowerBound = null;
    formData.stockUpperBound = null;
    formData.preAvailableStockMin = null;
    formData.preAvailableStockMax = null;
    formData.searchList = null;
    formData.salesMin = null;
    formData.salesMax = null;
    formData.salesQueryType = 7;
    formData.salesQueryUpperBound = null;
    formData.salesQueryLowerBound = null;
    formData.canSale = null;
    formData.canSales = '';
    formData.tortBanListing = null;
    formData.tortBanListings = '全部';
    formData.reListingStatus = '';
    formData.listingType = null;
    formData.listingTagQueryType = 1;
    formData.listingTagIdList = [];
    formData.searchType = 'prodPSkuList';
    formData.orderTypeContentType = 2;
    formData.timeType = 'prodCreateTime';
    formData.preAvailableStockType = 'preAvailableStockAll';
    formData.priceType = 'originalPrice';
    formData2.subStockMax = '';
    formData2.subListingTagIdList = [];
  };

  // 查询
  const handleSearch = async () => {
    tableDataLoading.value = true;
    try {
      let obj = filterParams();
      if (obj.errorMessage) return ElMessage.warning(obj.errorMessage);

      const { data, count } = await getListApi(obj);
      // tableData.value = (data || []).map((item) => ({
      //   ...item,
      //   displayCount: DEFAULT_TR_LENGTH,
      //   pChecked: false,
      //   skuList: item?.skuList.map((el, index) => {
      //     const passFilter = index < 4;
      //     return {
      //       ...el,
      //       sChecked: false,
      //       passFilter
      //     };
      //   })
      // }));
      tableData.value = (data || []).map((item) => ({
        ...item,
        displayCount: DEFAULT_TR_LENGTH,
        pChecked: false,
        skuList: item?.skuList.map((el) => ({ ...el, sChecked: false }))
      }));

      initAllChecked();
      getTabCount(count);
      paginationData.total = count;
    } catch (err) {
      tableData.value = [];
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };

  // 勾选父复选框
  const changePChecked = (checked, row) => {
    row.skuList.forEach((item) => {
      if (!isShowAllSku.value && !item.passFilter) return;
      item.sChecked = checked;
    });
    initAllChecked();
  };

  // 勾选子复选框
  const changeSChecked = (checked, prow) => {
    if (checked) {
      prow.pChecked = true;
    } else {
      const skuList = isShowAllSku.value
        ? prow.skuList
        : prow.skuList.filter((cItem) => cItem.passFilter);
      const sCheckeds = skuList.find((item) => item.sChecked);
      if (!sCheckeds) prow.pChecked = false;
    }
    initAllChecked();
  };

  // 勾选全选复选框
  const changeAllChecked = (checked) => {
    tableData?.value?.forEach((item) => {
      item.pChecked = checked;
      item.skuList.forEach((el) => {
        if (!isShowAllSku.value && !el.passFilter) return;
        el.sChecked = checked;
      });
    });
    if (tableData?.value) initAllChecked();
  };

  // 初始化全选框数据
  const initAllChecked = () => {
    pAllChecked.value =
      tableData.value.length && tableData.value.every((item) => item.pChecked);
    if (!pAllChecked.value) return (sAllChecked.value = false);
    sAllChecked.value = true;
    tableData.value.forEach((item) => {
      if (!sAllChecked.value) return;
      sAllChecked.value = item.skuList.every((el) => {
        if (!isShowAllSku.value && !el.passFilter) return true;
        return el.sChecked;
      });
    });
  };

  // 对审核失败下拉选项进行手动过滤 初始不展示下拉内容
  const filterCheckFailReason = (node) => {
    const label = node?.trim();
    if (!label) return (initFormData.filterQcReasonListOption = []);
    initFormData.filterQcReasonListOption =
      initFormData.qcReasonListOption.filter((item) => {
        return item.bizApiValue?.indexOf(label) > -1;
      });
  };

  // 切换product标签包含不包含
  const changeListingTagQueryType = (val) => {
    if (val === 1) {
      formData.listingTagIdList = [];
    } else {
      formData.listingTagIdList = '';
    }
  };

  // 切换sku标签
  const changeSubListingTagQueryType = (val) => {
    if (val === 1) {
      formData2.subListingTagIdList = [];
    } else {
      formData2.subListingTagIdList = '';
    }
  };

  // 切换禁售不禁售
  const changeCanSale = (val) => {
    if (val == '全部') {
      formData.canSale = '';
    } else {
      formData.canSale = val;
    }
  };

  // 切换侵权
  const changeTortBanListing = (val) => {
    if (val == '全部') {
      formData.tortBanListing = '';
    } else if (!val) {
      formData.tortBanListing = null;
    } else {
      formData.tortBanListing = val;
    }
  };

  const filterParams = () => {
    let obj = { ...formData, ...formData2, errorMessage: '' };
    if (formData.time) {
      obj[formData.timeType + 'LowerBound'] = Date.parse(
        formData.time[0] + ' 00:00:00'
      );
      obj[formData.timeType + 'UpperBound'] = Date.parse(
        formData.time[1] + ' 23:59:59'
      );
    }

    // 商品父级sku
    if (formData.searchList) {
      obj[formData.searchType] = formData.searchList.split(',');
    } else {
      obj[formData.searchType] = [];
    }

    // 商品子sku
    if (obj.prodSSkuListStr) {
      obj['prodSSkuList'] = obj.prodSSkuListStr.split(',');
    } else {
      obj['prodSSkuList'] = [];
    }
    // if (formData.categoryIdList?.length) {
    //   obj.categoryIdList = formData.categoryIdList.map(
    //     (item) => item[item.length - 1]
    //   );
    // }
    // if (formData.prodCateOaIdList?.length) {
    //   obj.prodCateOaIdList = formData.prodCateOaIdList.map(
    //     (item) => item[item.length - 1]
    //   );
    // }
    // 税前价，税后价
    obj[formData.priceType + 'LowerBound'] = formData.priceMin;
    obj[formData.priceType + 'UpperBound'] = formData.priceMax;

    //预计可用库存
    obj[formData.preAvailableStockType + 'LowerBound'] =
      formData.preAvailableStockMin;
    obj[formData.preAvailableStockType + 'UpperBound'] =
      formData.preAvailableStockMax;

    // 下架
    if (activeKey.value === '5,6' && formData.listingStausOff) {
      obj.productStatusList = formData.listingStausOff.split();
    }

    // 暂停销售
    if (activeKey.value === '2,3,7' && formData.listingStausStopList?.length) {
      obj.productStatusList = formData.listingStausStopList;
    }

    // 是否禁售
    if (formData.canSales == '全部') {
      formData.canSale = '';
    } else {
      formData.canSale = formData.canSales;
    }

    // 排序方式如果选中的是在线Listing 就必须是 包含+单选标签
    if (
      obj.orderTypeContent === 9 &&
      !(obj.listingTagQueryType === 1 && obj.listingTagIdList.length === 1)
    ) {
      obj.errorMessage = '仅支持单一listing标签排序！';
    }

    // 如果选了不包含 就是单选 但是传参依旧是数组
    if (obj.listingTagQueryType === 2) {
      obj.listingTagIdList = [obj.listingTagIdList].filter(
        (item) => item !== ''
      );
    }

    if (obj.subListingTagQueryType === 2) {
      obj.subListingTagIdList = [obj.subListingTagIdList].filter(
        (item) => item !== ''
      );
    }

    // 是否侵权
    if (formData.tortBanListings == '全部') {
      formData.tortBanListing = '';
    } else if (!formData.tortBanListings) {
      formData.tortBanListing = null;
    } else {
      formData.tortBanListing = formData.tortBanListings;
    }
    const { limit, page } = paginationData;
    let params = {
      ...formData,
      productStatusList: activeKey.value.split(','),
      ...obj,
      pageSize: limit,
      pageNum: page
    };
    // 全部库存 如果区间值没值，就不传
    if (
      [null, undefined, ''].includes(params.stockLowerBound) &&
      [null, undefined, ''].includes(params.stockUpperBound)
    ) {
      delete params.stockType;
      delete params.stockLowerBound;
      delete params.stockUpperBound;
    }
    return params;
  };

  const handleTab = ({ paneName }) => {
    activeKey.value = paneName;
    tableData.value = [];
    batchOperateType.value = null;
    formData.qcReasonsOaCodeList = null;
    handleSearch();
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (activeKey.value === item.status) {
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

  // const filterSite = (siteList) => {
  //   if (Array.isArray) {
  //     return (siteList || []).map((item) => item.salesSite).join();
  //   }
  //   return '';
  // };

  // const findTable = () => {
  //   const $table = tableRef.value;
  //   const tableIndex = tabList.value.findIndex((item) =>
  //     activeKey.value.includes(item.status)
  //   );
  //   return $table[tableIndex];
  // };

  // 选中的当前行数据
  let checkedRow = ref({});
  // 选中多条数据
  let rowCheckedList = ref([]);

  // 根据选中数据导出
  const exportLoading = ref(false);

  // #region导出
  const checkedRowList = ref([]);
  const tkConfigDialog = ref(false);
  const tkExportLoading = ref(false);
  const tkExportConfigList = ref([]);

  // 获取所有选中项
  const getAllCheckedInfo = () => {
    let checkedInfo = {
      allPCheckedList: [],
      allSCheckedList: []
    };
    if (!tableData.value) return checkedInfo;
    checkedInfo.allPCheckedList = tableData.value
      .filter((item) => {
        return item.pChecked;
      })
      .map((item) => {
        return {
          ...item,
          skuList: isShowAllSku.value
            ? item.skuList
            : item.skuList.filter((cItem) => cItem.passFilter)
        };
      });
    checkedInfo.allPCheckedList = checkedInfo.allPCheckedList.map((item) => {
      checkedInfo.allSCheckedList = checkedInfo.allSCheckedList.concat(
        item.skuList
      );
      return {
        ...item,
        skuList: item.skuList.filter((el) => el.sChecked)
      };
    });
    return checkedInfo;
  };

  // 点击导出按钮
  const handleExport = async () => {
    const { data } = await getExportHeadersApi();
    tkExportConfigList.value = data;
    let checkedList = [];
    const { allPCheckedList } = getAllCheckedInfo();
    if (allPCheckedList.length || getSkuIdList(allPCheckedList).length) {
      // 导出判断有没有勾选数据
      checkedList = [1];
    }
    checkedRowList.value = cloneDeep(checkedList);
    tkConfigDialog.value = true;
  };

  // 弹窗关闭
  const handleCloseExportConfig = (e) => {
    tkExportConfigList.value = [];
    tkConfigDialog.value = e.isShow;
    tkExportLoading.value = false;
  };

  // 获取子级的idList
  const getSkuIdList = (checkedList) => {
    let checkedSList = [];
    checkedList.forEach((item) => {
      checkedSList = checkedSList.concat(item.skuList);
    });
    return checkedSList.map((item) => item.skuId);
  };

  // 导出
  const exportDialog = (e) => {
    let obj = {};
    obj.onlyPassFilterSku = !isShowAllSku.value;
    if (e.checkedType == '导出列表选中数据') {
      const { allPCheckedList } = getAllCheckedInfo();
      if (
        allPCheckedList.length == 0 &&
        getSkuIdList(allPCheckedList).length == 0
      ) {
        return ElMessage.warning('没有在列表中选中数据，请检查后提交！');
      }
      obj.skuIdList = getSkuIdList(allPCheckedList);
    } else if (e.checkedType == '导出查询条件中的数据') {
      obj = filterParams();
    }

    e.data.forEach((item) => (obj[item.field] = item.checkedData));
    if (
      obj.productExportFields.length === 0 &&
      obj.variationExportFields.length === 0
    ) {
      return ElMessage.warning('product信息和sku信息里请至少勾选一项！');
    }
    tkExportLoading.value = true;

    transBlob({
      fileName: 'TikTok在线商品导出文件.xlsx',
      url: '/lms/tiktok/product/exportOnlineProductInfos',
      data: obj,
      contentType: 'application/json'
    })
      .then(() => {
        tkExportLoading.value = false;
        ElMessage.success('操作成功');
      })
      .catch(() => {
        tkExportLoading.value = false;
      });
  };
  // #endregion导出

  // 级联多选
  const filterCascader = (node, keyword) => {
    if (keyword) {
      const keywordList = keyword.replace('，', ',').split(',');
      const label = node?.label?.trim();
      const text = node?.text?.trim();
      const isIncludelabel = keywordList.some((item) =>
        label?.includes(item.trim())
      );
      const isIncludetext = keywordList.some((item) =>
        text?.includes(item.trim())
      );
      if (isIncludelabel || isIncludetext) {
        return node;
      }
    }
  };
  // 更新
  // const updateLoading = ref(false);
  // const handleUpdate = (row) => {
  //   try {
  //     updateLoading.value = true;
  //   } catch (err) {
  //     console.log('err :>> ', err);
  //   } finally {
  //     updateLoading.value = false;
  //   }
  // };
  // 发布
  // const publishLoading = ref(false);
  // const handlePublish = (row) => {
  //   try {
  //     publishLoading.value = true;
  //   } catch (err) {
  //     console.log('err :>> ', err);
  //   } finally {
  //     publishLoading.value = false;
  //   }
  // };
  // #region table数据解析
  // 是否展示秒杀标记
  const showFlashSaleTag = (flashSalePromotion) => {
    // 未开始，进行中
    if (flashSalePromotion) {
      if (
        flashSalePromotion.promotionStatus == 1 ||
        flashSalePromotion.promotionStatus == 2
      ) {
        return true;
      }
    }
    return false;
  };
  const getTagType = (stauts, succType) => {
    if (stauts === succType) {
      return 'success';
    }
    return 'warning';
  };
  const getFlashSaleLimit = (limit) => {
    if (limit === -1) {
      return '无限制';
    }
    return limit;
  };
  // #endregion table数据解析
  // 日志
  const logVisible = ref(false);
  const handleViewLog = (row) => {
    checkedRow.value = row;
    logVisible.value = true;
  };

  // #region 批量操作
  const batchOperateType = ref();
  const batchVisible = reactive({});
  // 仔细对照tablist定义的status
  const batchList = [
    // {
    //   label: '批量更新',
    //   value: 'batchUpdate',
    //   showTab: ['4', '5,6', '2,3,7', '1']
    // },
    {
      label: '批量同步',
      value: 'batchSync',
      showTab: ['4', '5,6', '2,3,7', '1']
    },
    {
      label: '批量上架',
      value: 'batchOnline',
      showTab: ['5,6', '2,3,7']
    },
    {
      label: '批量下架',
      value: 'batchOff',
      showTab: ['4']
    },
    {
      label: '批量删除',
      value: 'batchDel',
      showTab: ['4', '1']
    },
    {
      label: '调整库存',
      value: 'batchAdjustStock',
      showTab: ['4']
    },
    {
      label: '调整税前价',
      value: 'batchPreTaxPrice',
      showTab: ['4']
    },
    // {
    //   label: '修改seller_sku',
    //   value: 'batchModifySellerSku',
    //   showTab: ['4']
    // },
    // {
    //   label: '批量发布',
    //   value: 'batchPublish',
    //   showTab: ['1']
    // },
    {
      label: '修改listing促销',
      value: 'batchPromotion',
      permission: 'tiktokOnlinebatchUpdatePromotion',
      showTab: ['4']
    },
    {
      label: '修改商品图片',
      value: 'batchRepalceImg',
      permission: 'tiktokOnlineRepleceImg',
      showTab: ['4', '5,6', '2,3,7', '1']
    },
    {
      label: '修改标题',
      value: 'batchRepalceTitle',
      showTab: ['4', '5,6', '2,3,7', '1', '8']
    },
    {
      label: '修改描述',
      value: 'batchRepalceDesc',
      showTab: ['4', '5,6', '2,3,7', '1']
    },
    {
      label: '上传视频',
      value: 'uploadVideo',
      showTab: ['4', '5,6', '2,3,7', '1']
    },
    {
      label: '修改商品类目',
      value: 'batchUpdateCate',
      permission: 'tiktokOnlineBatchUpdateCate',
      showTab: ['4', '5,6', '2,3,7', '1', '8']
    },
    {
      label: '复制SKU',
      value: 'batchCopyPSku',
      showTab: ['5,6']
    },
    {
      label: '不处理listing',
      value: 'batchFilterListing',
      permission: 'tiktokOnlineBatchFilterListing',
      showTab: ['4', '5,6', '2,3,7', '1', '8']
    },
    {
      label: '添加秒杀',
      value: 'batchAddFlashSale',
      permission: 'tiktokOnlineBatchAddFlashSale',
      showTab: ['4', '5,6', '2,3,7', '1', '8']
    },
    {
      label: '修改秒杀',
      value: 'batchUpdateFlashSale',
      permission: 'tiktokOnlineBatchUpdateFlashSale',
      showTab: ['4', '5,6', '2,3,7', '1', '8']
    },
    {
      label: '更新首图水印',
      value: 'updateFirstWatermark',
      permission: 'tiktokOnlineUpdateFirstWatermark',
      showTab: ['4', '5,6', '2,3,7', '1', '8']
    },
    {
      label: '修改在线标签',
      value: 'updateListingTags',
      permission: 'tiktokOnlineUpdateListingTags',
      showTab: ['4', '5,6', '2,3,7', '1', '8']
    },
    {
      label: '批量删除',
      value: 'batchDelete',
      permission: 'tiktokOnlinebatchDelete',
      showTab: ['5,6']
    }
  ];
  // 需要打开选择操作对象弹窗的操作
  const selectObjWhiteList = [
    'batchAddFlashSale', // 添加秒杀
    'batchUpdateFlashSale', // 修改秒杀
    'updateFirstWatermark', // 更新首图水印
    'batchPromotion' // 修改listing促销
  ];

  // 不需要校验是否选中数据
  const noValidCheckedList = [
    'batchRepalceImg', // 修改商品图片
    'batchFilterListing', // 不处理listing
    'batchCopyPSku', // 复制sku
    ...selectObjWhiteList
  ];

  // 批量操作
  const handleBatch = (val) => {
    batchOperateType.value = val;
    // 选择数据
    const { allPCheckedList: checkedList } = getAllCheckedInfo();
    if (!noValidCheckedList.includes(batchOperateType.value)) {
      if (batchOperateType.value !== 'batchCopyPSku') {
        if (!checkedList.length) return ElMessage.warning('请选择数据');
      }
    }
    rowCheckedList.value = checkedList;
    if (batchOperateType.value === 'batchUpdate') {
      // 批量更新
      batchUpdate(checkedList);
    } else if (batchOperateType.value === 'batchOnline') {
      // 批量上架
      batchOnline(checkedList);
    } else if (batchOperateType.value === 'batchOff') {
      // 批量下架
      batchOff(checkedList);
    } else if (batchOperateType.value === 'batchDel') {
      // 批量删除
      batchDel(checkedList);
    } else if (batchOperateType.value === 'batchSync') {
      // 批量同步
      batchSync(checkedList);
    } else if (batchOperateType.value === 'batchRepalceTitle') {
      // 批量修改标题
      batchVisible[batchOperateType.value] = true;
    } else if (batchOperateType.value === 'uploadVideo') {
      // 上传视频
      uploadVideo(checkedList);
    } else if (batchOperateType.value === 'batchCopyPSku') {
      handleCopySku(1);
    } else if (selectObjWhiteList.includes(batchOperateType.value)) {
      // 打开选择操作对象弹窗
      batchVisible.selectOperation = true;
    } else if (batchOperateType.value === 'updateListingTags') {
      // 修改listing标签
      handleUpdateListingTags();
    } else if (batchOperateType.value === 'batchDelete') {
      // 已下架页签的批量删除
      handleSoldOutBatchDelete();
    } else {
      batchVisible[batchOperateType.value] = true;
    }
  };

  const batchCopySku = ref('');
  const batchCopySkuInfo = ref('');
  // 已删除页签 批量复制sku 不勾选 默认全部 (已下架、暂停销售、草稿页签也添加批量复制父sku)
  const handleCopySku = (type) => {
    const { allPCheckedList: checkedList } = getAllCheckedInfo();
    const fullData = tableData.value;
    if (batchCopySku.value === '复制SKU' || type === 1) {
      if (!checkedList.length) {
        batchCopySkuInfo.value = fullData
          .map((item) => item.prodPSku)
          .filter((item) => item)
          .join(',');
      } else {
        batchCopySkuInfo.value = checkedList
          .map((item) => item.prodPSku)
          .filter((item) => item)
          .join(',');
      }
      copy(batchCopySkuInfo.value);

      ElMessage.success(
        '已复制所有符合条件的父sku至剪贴板，可复制到刊登页重新刊登！'
      );
    }
  };
  // 批量更新
  const batchUpdate = () => {
    try {
      // const {msg} = await batchUpdateApi
      // ElMessage.success(msg||'操作成功')
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // 批量上架
  const batchOnline = (checkedList) => {
    ElMessageBox.confirm(
      '提交上架平台审批通过后，商品将显示给买家，确定批量上架吗？',
      '批量上架商品',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
      try {
        const productIds = checkedList.map((item) => item.productId).join();
        const { msg } = await batchProductOnlineApi({ productIds });
        ElMessage.success(msg || '操作成功');
        handleSearch();
      } catch (err) {
        console.log('err :>> ', err);
      }
    });
  };
  // 批量下架
  const batchOff = (checkedList) => {
    ElMessageBox.confirm(
      '提交下架将立即生效，下架后商品将无法下单，确定批量下架吗？',
      '批量下架商品',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
      try {
        const productIds = checkedList.map((item) => item.productId).join();
        const { msg } = await batchProductOffApi({ productIds });
        ElMessage.success(msg || '操作成功');
        handleSearch();
      } catch (err) {
        console.log('err :>> ', err);
      }
    });
  };
  // 批量删除
  let batchDelTimeStamp = null;
  const batchDel = (checkedList) => {
    ElMessageBox.confirm(
      '此操作将删除选中商品，是否继续，选择是，则将选中商品状态修改为已删除，选择否则不修改原商品状态？',
      '批量删除',
      { confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }
    ).then(async () => {
      try {
        const globalProductIdList = checkedList.map(
          (item) => item.globalProductId
        );
        if (batchDelTimeStamp) {
          clearInterval(batchDelTimeStamp);
        }
        const { msg } = await batchDelApi(globalProductIdList);
        ElMessage.success(msg || '操作成功');
        handleSearch();
      } catch (err) {
        console.log('err :>> ', err);
      }
    });
  };
  // 批量同步
  const batchSync = async (checkedList) => {
    try {
      let params = checkedList.map((item) => ({
        storeAcctId: item.storeAcctId,
        productId: item.productId
      }));
      const { msg, data } = await batchSyncApi(params);
      if (isEmpty(data)) {
        ElMessage.success(msg);
      } else {
        let htmlStr = '';
        forIn(data, function (value, key) {
          htmlStr += `<div>product_id:${key}, 失败原因:${value}<div>`;
        });
        // 展示部分同步失败
        ElMessageBox.alert(
          `<div style="max-height:500px;overflow:auto">${htmlStr}</div>`,
          '同步失败',
          {
            dangerouslyUseHTMLString: true,
            type: 'warning',
            confirmButtonText: '确认'
          }
        );
      }
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // 上传视频
  const uploadVideo = async (checkedList) => {
    ElMessageBox.confirm('确定上传视频至所选商品?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        let params = checkedList.map((item) => item.id);
        const { msg } = await uploadVideoApi(params);
        ElMessageBox.alert(msg, '提示', {
          confirmButtonText: '关闭',
          type: 'success'
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 批量修改类目，展示任务中心
  const showTaskCenter = (desc) => {
    taskCenterProps.value = {
      ...desc,
      exportModelVisile: true
    };
  };

  // 打开第二个弹窗
  const operateData = ref();
  const getSecondModalParams = (params) => {
    console.log(params);
    if (!params.updateFirstWatermark) {
      operateData.value = params;
      batchVisible[batchOperateType.value] = true;
    } else {
      console.log('调用首图添加水印接口');
      updateWatermarkApi(params.param).then((res) => {
        if (res.code === '0000') {
          ElMessageBox.alert(
            '更新首图水印操作成功，请到任务中心查看数据执行结果',
            '提示',
            {
              confirmButtonText: '关闭'
            }
          );
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
  };
  //#endregion 批量

  // #region 下载模板调价
  const router = useRouter();
  const taskCenterProps = ref({
    title: '',
    content: '',
    exportModelVisile: false
  });
  const handleJumpTaskCenter = () => {
    router.push('/shopee/operate/taskcenter');
  };
  const downLoadTplOption = ref();
  // const uploadLoading = ref(false);
  const handleDownLoadTpl = () => {
    window.location.href =
      '/api/lms/static/templet/TikTok调整店铺商品价格模版.xlsx';
  };
  // const fileList = ref();
  // const handleExportBefore = () => {
  //   uploadLoading.value = true;
  // };
  // const handleExportResult = (result) => {
  //   const { code, msg, data } = result;
  //   if (code === '0000') {
  //     taskCenterProps.value = {
  //       title: '导入结果',
  //       content: '导入成功！请到任务中心查看导入结果',
  //       exportModelVisile: true
  //     };
  //   } else {
  //     if (data?.length) {
  //       const dataStr = data
  //         .map(
  //           (item) =>
  //             '店铺名：' + item.storeAcct + '，失败原因：' + item.errorMessage
  //         )
  //         .join('<br>');
  //       ElMessageBox.alert(
  //         `<div style="max-height:300px;overflow-y: auto">${dataStr}</div>`,
  //         '导入失败店铺',
  //         {
  //           dangerouslyUseHTMLString: true
  //         }
  //       );
  //     } else {
  //       ElMessage.warning(msg);
  //     }
  //   }
  //   uploadLoading.value = false;
  // };
  // const handleExportError = () => {
  //   uploadLoading.value = false;
  // };

  const showAdjustPriceDialog = ref(false);
  const exportAdjustPrice = () => {
    showAdjustPriceDialog.value = true;
  };
  const closeAdjustPrice = (val = false) => {
    showAdjustPriceDialog.value = false;
    if (val) {
      handleSearch();
    }
  };
  // #endregion 下载模板调价

  // 获取tk在线listing标签
  const tagList = ref([]);
  const getTkListingTagList = async () => {
    const { data } = await getListingTagApi({
      headCode: 'TIKTOK_ONLINE_LISTING_TAG'
    });
    tagList.value = data;
  };

  // 批量修改listing标签
  const showUpdateListingTags = ref(false);
  const handleUpdateListingTags = () => {
    showUpdateListingTags.value = true;
  };

  // 已下架页签 批量删除
  const isShowBatchDelete = ref(false);
  const batchDeleteInfo = ref({});
  const handleSoldOutBatchDelete = async () => {
    const { allPCheckedList } = getAllCheckedInfo();
    if (!allPCheckedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    const params = allPCheckedList.map((item) => item.productId);
    const { code, data } = await queryBatchDeleteByProductIdsApi(params);
    if (code === '0000') {
      batchDeleteInfo.value = data;
    } else {
      batchDeleteInfo.value = '';
    }
    isShowBatchDelete.value = true;
  };

  // 获取需要复制的枚举值
  const needCopyList = ref([]);
  const getNeedCopyList = async () => {
    const { data } = await getBatchCopyEnumApi();
    needCopyList.value = data;
  };

  // 点击一键复制
  const handleCopySkuInfo = async (copyCode) => {
    const { allPCheckedList } = getAllCheckedInfo();
    // 有勾选 就传skuIdList
    let params = {};
    if (
      allPCheckedList.length == 0 &&
      getSkuIdList(allPCheckedList).length == 0
    ) {
      params = {};
    } else {
      params = { skuIdList: getSkuIdList(allPCheckedList) };
    }
    // 查询条件
    let obj = filterParams();

    const { code, data } = await batchCopyListApi({
      batchCopyFieldCode: copyCode,
      ...params,
      ...obj
    });
    if (code === '0000') {
      if (data) {
        // 复制到粘贴板
        copy(data);
      }
    }
  };

  // 从TK Chat跳转过来(根据路由传递的productId进行搜索)
  const searchByProductIdFromTkChat = () => {
    const pId = router.currentRoute.value.query?.productId;
    if (pId) {
      formData.searchType = 'productIdList';
      formData.searchList = pId;
      handleSearch();
    }
  };
</script>

<style lang="scss" scoped>
  @import './index.scss';
  .orderType {
    :deep(.el-select .el-input) {
      width: 63px;
    }
  }
  .tag_grid {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    el-tag {
      margin-bottom: 4px;
    }
  }
  .flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .form_title {
    margin: 10px 40px 0 10px;
  }
  .flex-center {
    display: flex;
    align-items: center;
  }
  .-mt-8 {
    margin-top: -8px;
  }
  .table_header,
  .table_body {
    flex: 1;
  }
</style>
<style lang="scss">
  // 在线product标签文字太长
  .app-main .search_form .onlineProductTag.el-form-item .el-form-item__label {
    width: 110px !important;
  }
</style>
