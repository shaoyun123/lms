<template>
  <div class="app-container">
    <!-- 筛选条件表单 start -->
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="formData.orgId"
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
        <el-form-item label="销售" prop="salePersonId">
          <el-select
            v-model="formData.salePersonId"
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
        <el-form-item label="店铺" prop="storeAcctIdList">
          <el-select
            v-model="formData.storeAcctIdList"
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
          label="开发"
          prop="developerIdList"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.developerIdList"
            :options="selectData.customersList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              label: 'name',
              children: 'childOrgList',
              value: 'id'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品类型" prop="isMultiSku">
          <el-select
            v-model="formData.isMultiSku"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option :value="false" label="单属性" />
            <el-option :value="true" label="多属性" />
          </el-select>
        </el-form-item>

        <el-form-item prop="queryType">
          <el-select v-model="formData.queryType" class="form_left">
            <el-option :value="1" label="商品编号" />
            <el-option :value="2" label="商品父SKU" />
            <el-option :value="3" label="店铺子SKU" />
            <el-option :value="4" label="商品子SKU" />
            <el-option :value="5" label="SKU id" />
          </el-select>
          <el-input
            v-model="formData.queryContent"
            placeholder="多个以逗号分隔"
            clearable
          />
        </el-form-item>

        <el-form-item prop="isSale" label="在售状态">
          <el-select v-model="formData.isSale" clearable>
            <el-option value="0" label="停售" />
            <el-option value="1" label="部分在售" />
            <el-option value="2" label="在售" />
          </el-select>
        </el-form-item>

        <el-form-item label="物流服务类型" prop="deliverySelf">
          <el-select v-model="formData.deliverySelf">
            <el-option :value="0" label="平台物流" />
            <el-option :value="1" label="卖家物流" />
          </el-select>
        </el-form-item>

        <el-form-item class="form_range" prop="skuPriceType">
          <el-select v-model="formData.skuPriceType" class="form_left">
            <el-option :value="1" label="促销价(EUR)"></el-option>
            <el-option :value="2" label="零售价(EUR)"></el-option>
            <el-option :value="3" label="成本查询(CNY)"></el-option>
          </el-select>
          <el-input v-model="formData.skuPriceMin" />
          <div class="range_link">-</div>
          <el-input v-model="formData.skuPriceMax" />
        </el-form-item>

        <el-form-item prop="orderByType">
          <el-select v-model="formData.orderBySubSku" class="form_left">
            <el-option :value="false" label="按父sku排序"></el-option>
            <el-option :value="true" label="按子sku排序"></el-option>
          </el-select>
          <el-select v-model="formData.orderByType">
            <el-option :value="1" label="创建时间正序" />
            <el-option :value="2" label="创建时间倒序" />
            <el-option :value="3" label="修改时间正序" />
            <el-option :value="4" label="修改时间倒序" />
            <el-option :value="5" label="7天销量正序" />
            <el-option :value="6" label="7天销量倒序" />
            <el-option :value="7" label="30天销量正序" />
            <el-option :value="8" label="30天销量倒序" />
            <el-option :value="9" label="60天销量正序" />
            <el-option :value="10" label="60天销量倒序" />
            <el-option :value="11" label="90天销量正序" />
            <el-option :value="12" label="90天销量倒序" />
            <el-option :value="13" label="180天销量正序" />
            <el-option :value="14" label="180天销量倒序" />
          </el-select>
        </el-form-item>
        <el-form-item class="form_range">
          <el-select v-model="formData.skuStockType" class="form_left">
            <el-option :value="1" label="平台可用库存(部分属性)"></el-option>
            <el-option :value="2" label="平台可用库存(全部属性)"></el-option>
          </el-select>
          <el-input v-model="formData.skuStockBegin" />
          <div class="range_link">-</div>
          <el-input v-model="formData.skuStockEnd" />
        </el-form-item>

        <el-form-item class="form_range">
          <el-select v-model="formData.whStockSearchType" class="form_left">
            <el-option
              value="availableStockNum"
              label="义乌仓可用(部分属性)"
            ></el-option>
            <el-option
              value="orderNotInNum"
              label="义乌仓在途(部分属性)"
            ></el-option>
            <el-option
              value="lackUnPaiNum"
              label="义乌仓未派(部分属性)"
            ></el-option>
            <el-option
              value="availableStockNumAll"
              label="义乌仓可用(全部属性)"
            ></el-option>
            <el-option
              value="orderNotInNumAll"
              label="义乌仓在途(全部属性)"
            ></el-option>
            <el-option
              value="lackUnPaiNumAll"
              label="义乌仓未派(全部属性)"
            ></el-option>
          </el-select>
          <el-input v-model="formData.whStockBegin" placeholder=">=" />
          <div class="range_link">-</div>
          <el-input v-model="formData.whStockEnd" placeholder="<=" />
        </el-form-item>
        <el-form-item label="平台物流属性" prop="oldAttrValueIdList">
          <el-select
            v-model="formData.oldAttrValueIdList"
            :class="formData.oldAttrValueIdList.length > 1 ? 'hide_tag' : ''"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
          >
            <template #prefix>
              <el-tag v-if="formData.oldAttrValueIdList.length > 1" type="info"
                >已选{{ formData.oldAttrValueIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in hazmatOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="oaLogisAttrList">
          <el-select v-model="formData.oaLogisAttrType" class="form_left">
            <el-option :value="1" label="oa物流属性(与)"></el-option>
            <el-option :value="2" label="oa物流属性(或)"></el-option>
          </el-select>
          <MultiSelect
            v-model="formData.oaLogisAttrList"
            class="form_right"
            :option-obj="{
              optionList: logisListOptions
            }"
          />
        </el-form-item>
        <el-form-item class="form_range">
          <el-select v-model="formData.searchTimeType" class="form_left">
            <el-option :value="1" label="刊登时间"></el-option>
            <el-option :value="2" label="修改时间"></el-option>
          </el-select>
          <el-date-picker
            v-model="formData.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
          />
        </el-form-item>
        <el-form-item label="商品标签">
          <el-select
            v-model="formData.prodAttrLists"
            :class="formData.prodAttrLists.length > 1 ? 'hide_tag' : ''"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
          >
            <template #prefix>
              <el-tag v-if="formData.prodAttrLists.length > 1" type="info"
                >已选{{ formData.prodAttrLists.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in prodsTagsOptions"
              :key="item.id"
              :value="item.name"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="平台类目"
          prop="leafCategoryIdList"
          class="search_item_cascader"
        >
          <!-- <z-cascader
            v-model="formData.leafCategoryIdList"
            :data="selectData.oaList"
            :props="{
              label: 'cnName',
              children: 'data',
              value: 'categoryId'
            }"
          ></z-cascader> -->
          <el-cascader
            v-model="formData.leafCategoryIdList"
            :options="selectData.oaList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'cnName',
              value: 'categoryId'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="listing视频" prop="listingVideoType">
          <el-select v-model="formData.listingVideoType" clearable>
            <el-option :value="1" label="已上传"></el-option>
            <el-option :value="0" label="未上传"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频库视频" prop="libVideoType">
          <el-select v-model="formData.libVideoType" clearable>
            <el-option :value="1" label="有"></el-option>
            <el-option :value="0" label="无"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form_range">
          <el-select v-model="formData.salesSkuType" class="form_left">
            <el-option :value="1" label="子SKU"></el-option>
            <el-option :value="2" label="父SKU"></el-option>
          </el-select>
          <el-select v-model="formData.salesDaysType" class="form_left">
            <el-option :value="1" label="7日销量"></el-option>
            <el-option :value="2" label="30日销量"></el-option>
            <el-option :value="3" label="60日销量"></el-option>
            <el-option :value="4" label="90日销量"></el-option>
            <el-option :value="5" label="180日销量"></el-option>
          </el-select>
          <el-input v-model="formData.minSales" />
          <div class="range_link">-</div>
          <el-input v-model="formData.maxSales" />
        </el-form-item>
        <el-form-item label="侵权状态" prop="tort">
          <el-select v-model="formData.tort" clearable>
            <el-option :value="0" label="所有平台都不侵权"></el-option>
            <el-option :value="1" label="任意平台侵权"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁售" prop="prohibit">
          <el-select v-model="formData.prohibit" clearable>
            <el-option :value="1" label="是"></el-option>
            <el-option :value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="formData.auditStatus" clearable>
            <el-option
              v-for="item in auditStatusOption"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="listing标签">
          <el-select
            v-model="formData.tagInclude"
            class="tag_left"
            @change="changeTagIncludeOption"
          >
            <el-option :value="1" label="包含"></el-option>
            <el-option :value="0" label="不包含"></el-option>
          </el-select>
          <el-select
            v-if="!formData.tagInclude"
            v-model="formData.tagIdSingle"
            class="tag_right"
          >
            <el-option
              v-for="item in listingTagListOption"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
          <el-select
            v-else
            v-model="formData.tagIdDouble"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            class="tag_right"
          >
            <el-option
              v-for="item in listingTagListOption"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台下架原因" prop="suspendReasonId">
          <!-- <el-select
            v-model="formData.suspendReasonId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in suspendReasonOption"
              :key="item.bizValue"
              :label="item.bizApiValue"
              :value="item.bizValue"
            />
          </el-select> -->
          <el-input v-model="formData.suspendReason" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList(1)">查询</el-button>
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
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
                : `${item.label}(0)`
            "
            :name="item.status"
          >
            <el-checkbox-group
              v-if="item.status === 4"
              v-model="secondaryTabStatusList"
              @change="changeSecondaryTab"
            >
              <el-checkbox :label="-1">卖家删除</el-checkbox>
              <el-checkbox :label="-4">小二删除</el-checkbox>
            </el-checkbox-group>
            <vxe-grid v-bind="gridOptions" ref="tableRef">
              <!-- 图片 -->
              <template #miravia_img="{ row }">
                <ImagePop :src="row.mainImageUrls?.split('|')[0]" />
              </template>
              <!-- 标题/商品ID/类目 -->
              <template #miravia_tic="{ row }">
                <div>{{ row.title }}</div>
                <div style="display: flex; align-items: center">
                  <el-tooltip content="点击跳转至商品在线链接" placement="left">
                    <el-link
                      :href="`https://www.miravia.es/p/i${row.productId}.html`"
                      target="_blank"
                      type="primary"
                      :underline="false"
                      >{{ row.productId }}</el-link
                    >
                  </el-tooltip>
                  <el-icon
                    class="copy_icon"
                    color="#aaa"
                    @click="copy(row.productId)"
                    ><CopyDocument
                  /></el-icon>
                </div>
                <div>{{ row.categoryTreeName }}</div>
                <div>店铺: {{ row.storeAcct }}</div>
                <div>销售: {{ row.salesperson }}</div>
                <el-tooltip effect="dark" placement="right">
                  <template #content>
                    <div class="reason-tips">{{ row.suspendReason }}</div>
                  </template>
                  <div class="show-oneline">
                    下架原因: {{ row.suspendReason }}
                  </div>
                </el-tooltip>
                <div>
                  <el-tag
                    v-for="tag in row.tags"
                    :key="tag.tagId"
                    class="mr-4"
                    >{{ tag.tagName }}</el-tag
                  >
                </div>
              </template>
              <template #miravia_sales="{ row }">
                <div>7天：{{ row.sevenSales }}</div>
                <div>30天：{{ row.thirtySales }}</div>
                <div>60天：{{ row.sixtySales }}</div>
                <div>90天：{{ row.ninetySales }}</div>
                <div>180天：{{ row.oneHundredAndEightySales }}</div>
              </template>
              <!-- 自定义prodSyncSMiraviaDtoList表头skuList_header -->
              <template #prodSyncSMiraviaDtoList_header>
                <div class="miravia-theader">
                  <div style="width: 120px">SKU图</div>
                  <div style="width: 190px">SKU</div>
                  <div class="miravia-theader-th" style="width: 80px">
                    SKU属性
                  </div>
                  <div class="miravia-theader-th">成本(￥)/重量(g)</div>
                  <div class="miravia-theader-th">零售价/促销价(EUR)</div>
                  <div class="miravia-theader-th">平台设置库存</div>
                  <div class="miravia-theader-th">义乌仓库存</div>
                  <div class="w-200">销量</div>
                  <div class="w-200">时间</div>
                </div>
              </template>
              <!-- 自定义prodSyncSMiraviaDtoList展示 -->
              <template #miravia_prodSyncSMiraviaDtoList="{ row }">
                <div v-if="row.prodSyncSMiraviaDtoList?.length > 0">
                  <div
                    v-for="item in row.prodSyncSMiraviaDtoList?.slice(
                      0,
                      row.displayCount
                    )"
                    :key="item.id"
                    class="miravia-tbody"
                  >
                    <div style="width: 120px">
                      <ImagePop :src="item.skuImageList" />
                    </div>
                    <div style="width: 190px">
                      <div class="flex">
                        <div class="flexItem">
                          <span
                            v-if="item.isSale === false"
                            class="tag danger_tag"
                            >停</span
                          >
                        </div>
                        <div>
                          <div>店铺: {{ item.storeSSku }}</div>
                          <div>
                            <span>商品: {{ item.prodSSku }}</span>
                            <el-icon
                              v-if="item.prodSSku"
                              class="copy_icon"
                              color="#aaa"
                              @click="copy(item.prodSSku)"
                              ><CopyDocument
                            /></el-icon>
                            <el-popover
                              v-if="
                                item.oaLogisAttrList &&
                                item.oaLogisAttrList.length != 0
                              "
                              placement="top-start"
                              trigger="hover"
                              :content="item.oaLogisAttrList.join()"
                              :width="500"
                            >
                              <template #reference>
                                <span
                                  class="tag danger_tag"
                                  @click="copy(item.oaLogisAttrList)"
                                >
                                  {{ getAttrTag(item.oaLogisAttrList) }}
                                </span>
                              </template>
                            </el-popover>
                          </div>
                          <div>SKU id: {{ item.skuId }}</div>
                          <div>
                            <el-tag
                              v-for="tag in item.tags"
                              :key="tag.tagId"
                              class="mr-4"
                              >{{ tag.tagName }}</el-tag
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="miravia-tbody-td">
                      <div v-html="item.skuPropertyStr"></div>
                    </div>
                    <div class="miravia-tbody-td">
                      <div>采购: {{ item.purchaseCostPrice }}</div>
                      <div>净重: {{ item.suttleWeight }}</div>
                      <div>毛重: {{ item.grossWeight }}</div>
                    </div>
                    <div class="miravia-tbody-td">
                      {{ item.skuPrice
                      }}<span v-if="item.skuDiscountPrice"
                        >/{{ item.skuDiscountPrice }}</span
                      >
                    </div>
                    <div class="miravia-tbody-td">{{ item.skuStock }}</div>
                    <div class="miravia-tbody-td">
                      <div>可用: {{ item.availableStockNum || 0 }}</div>
                      <div>在途: {{ item.orderNotInNum || 0 }}</div>
                      <div>未派: {{ item.lackUnPaiNum || 0 }}</div>
                    </div>
                    <div class="w-200">
                      <div>7天: {{ item.sevenSales || 0 }}</div>
                      <div>30天: {{ item.thirtySales || 0 }}</div>
                      <div>60天: {{ item.sixtySales || 0 }}</div>
                      <div>90天: {{ item.ninetySales || 0 }}</div>
                      <div>180天: {{ item.oneHundredAndEightySales || 0 }}</div>
                    </div>
                    <div class="w-200">
                      <div>
                        <span
                          >刊登时间:
                          {{
                            parseTime(
                              row.listingTime || '',
                              '{y}-{m}-{d} {h}:{i}:{s}'
                            )
                          }}</span
                        >
                      </div>
                      <div>
                        <span
                          >修改时间:
                          {{
                            parseTime(
                              row.lastModifyTime || '',
                              '{y}-{m}-{d} {h}:{i}:{s}'
                            )
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="row.prodSyncSMiraviaDtoList?.length > 3"
                    class="miravia-tbody"
                  >
                    <el-button type="primary" text @click="showAllList(row)">
                      {{ row.displayTxt }}({{
                        row.prodSyncSMiraviaDtoList?.length
                      }})
                    </el-button>
                  </div>
                </div>
                <div v-else>无子数据</div>
              </template>

              <!-- 操作 -->
              <template #toolbar_default="{ row }">
                <div class="flex_center">
                  <vxe-button
                    status="primary"
                    content="日志"
                    size="mini"
                    @click="handleViewLog(row.productId)"
                  ></vxe-button>
                  <el-button
                    style="margin-top: 10px"
                    size="small"
                    type="primary"
                    @click="handleBatchSync(row)"
                  >
                    更新
                  </el-button>
                </div>
              </template>
              <!-- 分页 -->
              <template #pager>
                <vxe-pager
                  v-model:current-page="formData.page"
                  v-model:page-size="formData.limit"
                  :layouts="[
                    'Sizes',
                    'PrevPage',
                    'Number',
                    'NextPage',
                    'FullJump',
                    'Total'
                  ]"
                  :page-sizes="[20, 100, 200, 300]"
                  :total="totalCount"
                  @page-change="handlePageChange"
                >
                </vxe-pager>
              </template>
            </vxe-grid>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="activeKey !== 4" class="tools_btn">
        <div v-if="activeKey == 0">
          <el-dropdown style="margin: 0 10px">
            <el-button type="primary">
              店铺调价<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-permission="['mivariaExportStore']"
                  ><a
                    href="/api/lms/static/templet/miravia_import_update_price.xlsx"
                    target="_blank"
                    >下载模板</a
                  ></el-dropdown-item
                >
                <el-dropdown-item v-permission="['mivariaImportStore']">
                  <el-upload
                    :action="'/api/lms/miraviaOnlineProduct/importUpdatePrice'"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    style="margin-right: 10px"
                    >导入模板</el-upload
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div>
          <el-dropdown style="margin: 0 10px">
            <el-button type="primary">
              批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleBatchUpdateStock()"
                  ><span v-permission="['mivariaBatchUpdateStock']"
                    >修改库存</span
                  ></el-dropdown-item
                >
                <el-dropdown-item @click="handleBatchSync()"
                  ><span v-permission="['miraviaBatchSync']"
                    >批量同步</span
                  ></el-dropdown-item
                >
                <el-dropdown-item @click="handleBatchExport()"
                  ><span v-permission="['mivariaBatchExport']"
                    >批量导出</span
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  v-if="[1].includes(activeKey)"
                  @click="handleBatchPutawayOrSoldout(1)"
                  ><span v-permission="['miraviaBatchPutaway']"
                    >批量上架</span
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  v-if="activeKey === 0"
                  @click="handleBatchPutawayOrSoldout(0)"
                  ><span v-permission="['miravaiBatchSoldout']"
                    >批量下架</span
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  v-if="[0, 1, 3].includes(activeKey)"
                  @click="handleBatchChangePrice()"
                  ><span v-permission="['miraviaBatchChangePrice']"
                    >批量改价</span
                  ></el-dropdown-item
                >
                <!-- <el-dropdown-item @click="handleBatchUpdateTitle()"
                  ><span v-permission="['miraviaBatchUpdateTitle']"
                    >修改标题</span
                  ></el-dropdown-item
                > -->
                <!-- <el-dropdown-item @click="handleBatchDescription()"
                  ><span v-permission="['miraviaBatchDescription']"
                    >修改描述</span
                  ></el-dropdown-item
                > -->
                <!-- <el-dropdown-item @click="handleBatchUpdateImages()"
                  ><span v-permission="['miraviaBatchUpdateImages']"
                    >修改图片</span
                  ></el-dropdown-item
                > -->
                <!-- <el-dropdown-item @click="handleBatchLogisticsAttribute()"
                  ><span v-permission="['miraviaLogisticSpec']"
                    >修改物流属性</span
                  ></el-dropdown-item
                > -->
                <!-- <el-dropdown-item @click="handleBatchVarietyInfo()"
                  ><span v-permission="['miraviaVarietyInfo']"
                    >修改变种信息</span
                  ></el-dropdown-item
                > -->
                <!-- <el-dropdown-item
                  v-if="[0, 1, 3].includes(activeKey)"
                  @click="handleBatchUploadVideo"
                  ><span>上传视频</span></el-dropdown-item
                > -->
                <el-dropdown-item @click="handleBatchUpdateListingTags()"
                  ><span v-permission="['miraviaUpdateListingTags']"
                    >修改listing标签</span
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-card>
  </div>
  <!-- 库存 -->
  <BatchUpdateStock
    v-model="updateStockVisible"
    :checked-row-list="checkedRowList"
    :current-page="formData.page"
    :page-size="formData.limit"
    @handle-search="queryList"
  />

  <!-- 批量上下架失败 -->
  <BatchFailListDialog
    v-model="batchExportVisible"
    :online-or-off-line-type="onlineOrOffLineType"
    :fail-group-map="failGroupMap"
  ></BatchFailListDialog>

  <!-- 查看日志 -->
  <ShowLogs v-model="showLogsVisible" :checked-id="checkedLogsProductId" />

  <!-- 批量调价 -->
  <BatchChangePrice
    v-model="showBatchChangePrice"
    :selected-id-list="selectedIdList"
  ></BatchChangePrice>

  <!-- 修改标题 -->
  <ReplaceTitleDialog
    v-model="showBatchReplaceTitle"
    :checked-p-id-list="checkedPIdList"
    @handle-search="queryList(1)"
  />

  <!-- 修改描述 -->
  <ReplaceDescDialog
    v-model="showBatchReplaceDesc"
    :checked-p-id-list="checkedPIdList"
    @handle-search="queryList(1)"
  />

  <!-- 修改图片 -->
  <ReplaceImgDialog
    v-model="showBatchUpdateImage"
    :checked-id-list="updateImageCheckedIdList"
    @handle-search="queryList(1)"
  />

  <!-- 批量修改物流属性 -->
  <BatchLogisticsAttr
    v-model="showBatchLogisticsAttr"
    :checked-id-list="checkedLogisticsAttrIdList"
  ></BatchLogisticsAttr>

  <!-- 批量修改变种信息 -->
  <BatchVarietyInfo
    v-model="showBatchVarietyInfo"
    :variety-info-params-list="varietyInfoParamsList"
    @handle-search="queryList(1)"
  ></BatchVarietyInfo>

  <!-- 批量修改listing标签 -->
  <BatchUpdateListingTags
    v-model="showBatchUpdateListingTags"
    :checked-params-list="checkedParamsList"
    @handle-search="queryList(1)"
  ></BatchUpdateListingTags>

  <!-- 导出配置 -->
  <ExportConfig
    v-if="miraviaExportConfigDialog"
    :show-dialog="miraviaExportConfigDialog"
    config-type="'MULTIPLATFORM_PROD_MIRAVIA_ONLINE'"
    :checkbox-data="miraviaExportConfigCheckboxData"
    :checked-row-list="checkedRowList"
    :loading="loading"
    @close-dialog="handleLogRuleClose($event)"
    @export-dialog="exportDialog"
  />
</template>

<script setup name="publishsmiraviaonlineproduct">
  import { onMounted, reactive, ref, nextTick, computed } from 'vue';
  import {
    queryMiraviaProduct,
    getPersonAndOrgsByRole,
    batchSyncApi,
    batchSetOnlineApi,
    batchSetOfflineApi,
    getListHazmatOptionsApi,
    getProdsTagsOptionsApi,
    getPlatCategoryTreeApi,
    getExportHeader,
    // uploadVideoApi,
    getMiraviaListingTagApi
    // getListByBizTypeApi
  } from '@/api/publishs/miraviaonline';
  import { getLogisListApi, shortcuts } from '@/api/common';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import { getLogisAttrEnum } from '@/api/publishs/miraviapublish';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import ImagePop from '@/components/ImagePop/index.vue';
  import BatchUpdateStock from './components/BatchUpdateStock.vue';
  import BatchFailListDialog from './components/BatchFailListDialog.vue';
  import BatchLogisticsAttr from './components/BatchLogisticsAttribute.vue';
  import ReplaceTitleDialog from './components/ReplaceTitleDialog.vue';
  import ReplaceDescDialog from './components/ReplaceDescDialog.vue';
  import ReplaceImgDialog from './components/ReplaceImgDialog.vue';
  import BatchChangePrice from './components/BatchChangePrice.vue';
  import BatchVarietyInfo from './components/BatchVarietyInfo.vue';
  import BatchUpdateListingTags from './components/BatchUpdateListingTags.vue';
  import ShowLogs from './components/ShowLogs.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transBlob } from '@/utils/downloadFile';
  import { copy, parseTime } from '@/utils/common';
  import { cloneDeep } from 'lodash-es';
  import ExportConfig from '@/components/ExportConfig/index.vue';
  // import ZCascader from '@/components/ZCascader/index.vue';

  const formData = reactive({
    page: 1,
    limit: 100,
    developerIdList: [], // 开发
    queryType: 1, // 查询类型
    queryContent: '', // 查询内容
    storeAcctIdList: '', // 店铺编号
    isMultiSku: '', // 是否多属性
    isSale: '',
    productStatus: 0, // 一级页签
    auctionStatus: '', // 二级页签
    deliverySelf: '', // 物流服务类型
    skuPriceType: 1,
    skuPriceMin: '', // 价格查询最小值
    skuPriceMax: '', // 价格查询最大值
    orderBySubSku: false,
    orderByType: '', // 排序
    orgId: '',
    salePersonId: '',
    skuStockType: 1,
    skuStockEnd: '',
    skuStockBegin: '',
    whStockSearchType: 'availableStockNum',
    whStockBegin: '',
    whStockEnd: '',
    attrNameId: '',
    attrValueIdList: [], // 选中的物流属性
    oldAttrValueIdList: [],
    oaLogisAttrList: [],
    prodAttrLists: [],
    isHazmat: '',
    searchTimeType: 1, // 时间类型
    oaLogisAttrType: 1,
    time: [],
    searchStartTime: '',
    searchEndTime: '',
    salesSkuType: 1,
    salesDaysType: 1,
    tort: 0,
    prohibit: '',
    auditStatus: '', // 审核状态
    tagInclude: 1, // 包含
    tagIdSingle: '', // 不包含仅支持单选
    tagIdDouble: [], // 不包含仅支持单选
    tagIds: [], // 选择包含可以多选
    suspendReason: ''
    // suspendReasonId: '' // 平台下架原因
  });
  const totalCount = ref(0);

  // tab list
  const tabList = ref([
    { label: '在线', count: '', status: 0, index: 0 },
    { label: '下架', count: '', status: 1, index: 1 },
    { label: '审核中', count: '', status: 2, index: 2 },
    { label: '平台下架', count: '', status: 3, index: 3 },
    { label: '已删除', count: '', status: 4, index: 4 }
  ]);

  const auditStatusOption = ref([
    { label: '审核中', value: -1 },
    { label: '审核通过', value: 1 },
    { label: '拒绝', value: -3 },
    { label: '锁定商品不允许编辑和上架', value: -4 }
  ]);

  const formRef = ref(null);

  const activeKey = ref(0);
  const secondaryTabStatusList = ref([]);
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: [],
    customersList: [],
    oaList: []
  });
  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 302;
  });
  const gridOptions = reactive({
    border: true,
    // showOverflow: true,
    loading: false,
    height: height,
    // scrollY: {
    //   gt: 30
    // },
    rowConfig: {
      isHoverRow: true
    },
    columnConfig: {
      resizable: true
    },
    columns: [
      { type: 'checkbox', width: 43 },
      {
        field: 'image',
        title: '图片',
        width: 100,
        slots: {
          default: 'miravia_img'
        }
      },
      {
        field: 'tic',
        title: '标题/商品编号/类目',
        width: 260,
        slots: {
          default: 'miravia_tic'
        }
      },
      {
        field: 'sales',
        title: '销量',
        width: 100,
        slots: {
          default: 'miravia_sales'
        }
      },
      {
        field: 'prodSyncSMiraviaDtoList',
        resizable: false,
        slots: {
          header: 'prodSyncSMiraviaDtoList_header',
          default: 'miravia_prodSyncSMiraviaDtoList'
        }
      },
      {
        title: '操作',
        pinned: 'right',
        width: 75,
        slots: {
          default: 'toolbar_default'
        }
      }
    ],
    data: []
  });

  onMounted(() => {
    getDepartmentList();
    getStoreList();
    getCustomersList();
    getListHazmatOptions();
    getLogisListOptions();
    getprodsTagstOptions();
    getCategoryList();
    getLogisListAttrApi();
    getListingTagList();
    // getSuspendReason();
  });

  // 获取平台下架原因枚举
  // const suspendReasonOption = ref([]);
  // const getSuspendReason = async () => {
  //   const { data } = await getListByBizTypeApi({
  //     bizType: 'MIRAVIA_SOLDOUT_REASON'
  //   });
  //   suspendReasonOption.value = data;
  // };

  // 获取物流属性 标签映射
  const attrEnum = ref([]);
  const getLogisListAttrApi = async () => {
    try {
      const { code, data } = await getLogisAttrEnum();
      if (code === '0000') {
        attrEnum.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAttrTag = (attrName) => {
    let arr = attrEnum.value?.filter((item) => {
      return attrName.includes(item.name);
    });
    return arr[0]?.alias || attrName;
  };

  const salersDataCopy = ref([]);
  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'miravia专员'
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

  // 获取平台物流属性
  const hazmatOptions = ref([]);
  const hazmatAttrNameId = ref('');
  const getListHazmatOptions = async () => {
    const { data } = await getListHazmatOptionsApi();
    hazmatOptions.value = data.optionalValueList.unshift({
      id: '未填写',
      name: '未填写'
    });
    hazmatOptions.value = data.optionalValueList;
    hazmatAttrNameId.value = data.attrNameId;
  };
  // 获取oa物流属性
  const logisListOptions = ref([]);
  const getLogisListOptions = async () => {
    const { data } = await getLogisListApi();
    logisListOptions.value = data.map((item) => item.name);
  };
  // 获取商品标签
  const prodsTagsOptions = ref([]);
  const getprodsTagstOptions = async () => {
    const { data } = await getProdsTagsOptionsApi();
    prodsTagsOptions.value = data || [];
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount;
      }
    });
  };

  const tabIndex = ref(0);
  // 切换 tab
  const changeTab = (tab) => {
    tabIndex.value = tab.index;
    formData.productStatus = Number(tab.props.name);
    if (formData.productStatus !== 4) {
      secondaryTabStatusList.value = [];
      formData.auctionStatus = '';
    }
    formData.page = 1;
    queryList(1);
  };

  // 切换二级页签
  const changeSecondaryTab = (tab) => {
    // 复选框值选择一个
    if (tab.length > 1) {
      let single = secondaryTabStatusList.value.splice(1);
      secondaryTabStatusList.value = single;
      formData.auctionStatus = Number(single[0]);
    } else {
      formData.auctionStatus = Number(tab[0]);
    }
    formData.page = 1;
    queryList(1);
  };

  // 获取商品标签
  const listingTagListOption = ref([]);
  const getListingTagList = async () => {
    const { data } = await getMiraviaListingTagApi();
    listingTagListOption.value = data;
  };

  // 切换标签包含不包含
  const changeTagIncludeOption = () => {
    formData.tagIdSingle = '';
    formData.tagIdDouble = [];
  };

  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'miravia专员',
        orgId: formData.orgId,
        salePersonId: formData.salePersonId,
        platCode: 'miravia'
      };
      const { data } = await getStoreInfo(params);
      selectData.storeData = data;
    } catch (err) {
      console.log(err);
    }
  };

  const changeSalers = () => {
    formData.storeAcctIdList = '';
    getStoreList();
  };

  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    formData.orgId = '';
    resetSearch();
  };

  const getCustomersList = async () => {
    try {
      const { data } = await getPersonAndOrgsByRole({ roleNames: '开发专员' });
      let arr = [];
      mapChooseDepart(arr, data.orgTree, data.userList);
      selectData.customersList = arr;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取 类目
  const getCategoryList = async () => {
    try {
      const { data } = await getPlatCategoryTreeApi({ platCode: 'miravia' });
      selectData.oaList = data;
    } catch (err) {
      console.log(err);
    }
  };

  const mapChooseDepart = (arr, orgTree, userList) => {
    orgTree.forEach((item, index) => {
      arr.push({
        ...item,
        name: item.org_name || item.name,
        childOrgList: []
      });
      if (item.childOrgList?.length) {
        mapChooseDepart(arr[index].childOrgList, item.childOrgList, userList);
      }
      const curSale = userList.filter((v) => item.id === v.org_id);
      if (curSale.length) {
        curSale.forEach((v) => {
          item.childOrgList.push({ ...v, name: v.user_name });
        });
        arr[index].childOrgList = item.childOrgList;
      }
    });
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

  // 清空销售人员以及店铺
  const resetSearch = () => {
    formData.salePersonId = '';
    formData.storeAcctIdList = '';
    getStoreList();
  };

  const handleStoreList = (storeAcctIdList) => {
    // 部门 销售人员 店铺没有筛选
    if (
      !formData.orgId &&
      !formData.salePersonId &&
      formData.storeAcctIdList.length === 0
    ) {
      storeAcctIdList = [];
    }

    // 选择部门或者销售人员 没有选择店铺
    if (
      (formData.orgId || formData.salePersonId) &&
      formData.storeAcctIdList.length === 0
    ) {
      if (selectData.storeData.length) {
        storeAcctIdList = selectData.storeData.map((item) => item.id);
      } else {
        // 如果销售人员下没有数据的话 传 -1
        storeAcctIdList = [-1];
      }
    }
    console.log('storeAcctIdList', storeAcctIdList);
  };

  const queryList = async (page) => {
    let storeAcctIdList = [];
    handleStoreList(storeAcctIdList);

    let _developerIdList = '';
    if (formData.developerIdList?.length > 0) {
      let developerId =
        formData.developerIdList[formData.developerIdList.length - 1];
      _developerIdList = [developerId];
    } else {
      _developerIdList = [];
    }

    if (formData.time?.length > 0) {
      formData.searchStartTime = formData?.time[0] + ' 00:00:00';
      formData.searchEndTime = formData?.time[1] + ' 23:59:59';
    } else {
      formData.searchStartTime = '';
      formData.searchEndTime = '';
    }

    // 侵权/禁售
    if (formData.tort === '') {
      formData.tort = null;
    }

    if (formData.prohibit === '') {
      formData.prohibit = null;
    }

    // 标签
    if (formData.tagInclude) {
      formData.tagIds = formData.tagIdDouble;
      formData.tagIdSingle = '';
    } else {
      formData.tagIds = [formData.tagIdSingle];
      formData.tagIdDouble = [];
    }

    // 物流属性（选择未填写表示： 没有填危险品属性）
    if (formData.oldAttrValueIdList.length) {
      formData.attrNameId = hazmatAttrNameId.value;
      if (formData.oldAttrValueIdList.includes('未填写')) {
        formData.isHazmat = false;
        formData.attrValueIdList = formData.oldAttrValueIdList.filter(
          (item) => item != '未填写'
        );
      } else {
        formData.attrValueIdList = formData.oldAttrValueIdList;
        formData.isHazmat = '';
      }
    } else {
      formData.attrValueIdList = [];
      formData.oldAttrValueIdList = [];
      formData.attrNameId = '';
      formData.isHazmat = '';
    }
    const paramsFormData = cloneDeep(formData);

    if (formData.leafCategoryIdList?.length) {
      paramsFormData.leafCategoryIdList = formData.leafCategoryIdList.map(
        (item) => item[item.length - 1]
      );
    }

    try {
      gridOptions.loading = true;
      formData.page = page;
      const { code, data, count } = await queryMiraviaProduct({
        ...paramsFormData,
        storeAcctIdList: formData.storeAcctIdList
          ? [formData.storeAcctIdList]
          : storeAcctIdList,
        developerIdList: _developerIdList
      });
      if (code === '0000') {
        data?.forEach((item) => {
          item.displayCount = 3;
        });
        gridOptions.data = (data || []).map((item) => ({
          ...item,
          displayCount: 3,
          displayTxt: '展开'
        }));
        totalCount.value = count;
        getTabCount(totalCount.value);
      }
      gridOptions.loading = false;
    } catch (err) {
      console.log(err);
      gridOptions.loading = false;
    }
  };

  const resetForm = () => {
    formRef.value.resetFields();
    formData.skuPriceMin = '';
    formData.skuPriceMax = '';
    formData.queryContent = '';
    formData.whStockBegin = '';
    formData.whStockEnd = '';
    formData.attrValueIdList = [];
    formData.prodAttrLists = [];
    formData.attrNameId = '';
    formData.time = [];
    formData.searchStartTime = '';
    formData.searchEndTime = '';
    formData.oaLogisAttrType = 1;
  };

  // 表格展示收缩
  const showAllList = async (row) => {
    if (row.displayCount == 3) {
      row.displayCount = row.prodSyncSMiraviaDtoList.length;
      row.displayTxt = '收起';
      return;
    } else {
      row.displayCount = 3;
      row.displayTxt = '展开';
      return;
    }
  };
  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };

  // 表格分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    formData.page = currentPage;
    formData.limit = pageSize;
    queryList(formData.page);
  };

  const tableRef = ref(null);
  //#region 批量操作
  const checkedRowList = ref([]);
  //  修改库存 必须选择一个JIT商品才能进行改库存操作：
  const updateStockVisible = ref(false);
  const handleBatchUpdateStock = () => {
    // 未选择商品toast提示：需要选择一个商品才能改库存
    const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请先选择要处理的数据！');
    }
    // 必须选择一个JIT商品才能进行改库存操作：
    checkedRowList.value = checkedList;
    updateStockVisible.value = true;
  };

  // 查看日志
  const showLogsVisible = ref(false);
  const checkedLogsProductId = ref('');
  const handleViewLog = (id) => {
    checkedLogsProductId.value = id;
    showLogsVisible.value = true;
  };

  // 批量同步(单个更新一样)
  const handleBatchSync = async (row = {}) => {
    // 没有当前row 就是批量 否则就是单个更新
    let params = [];
    if (Object.keys(row).length === 0) {
      const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
      if (!checkedList.length) {
        return ElMessage.warning('请先选择要处理的数据！');
      }
      params = checkedList.map((item) => ({
        storeAcctId: item.storeAcctId,
        productId: item.productId
      }));
    } else {
      params = [
        {
          storeAcctId: row.storeAcctId,
          productId: row.productId
        }
      ];
    }
    gridOptions.loading = true;
    const { data } = await batchSyncApi(params).finally(() => {
      gridOptions.loading = false;
    });
    const failList = data.filter((item) => !item.success);
    if (failList.length) {
      const failStr = failList.map((item) => item.message).join('<br>');
      const successStr = data
        .filter((item) => item.success)
        .map(
          (item) =>
            `storeAcctId:${item.storeAcctId},productId:${item.productId},同步成功`
        )
        .join('<br>');
      ElMessageBox.confirm(`${successStr}<br>${failStr}`, 'Warning', {
        confirmButtonText: '确定',
        showCancelButton: false,
        dangerouslyUseHTMLString: true,
        type: 'warning'
      });
    } else {
      await ElMessage.success('同步成功');
      await queryList(1);
    }
  };

  // // 批量导出
  // const handleBatchExport = async () => {
  //   const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
  //   let params = {};
  //   if (!checkedList.length) {
  //     // 没有勾选数据 则导出全部符合条件的数据
  //     let storeAcctIdList = [];
  //     handleStoreList(storeAcctIdList);
  //     params = {
  //       ...formData,
  //       storeAcctIdList: formData.storeAcctIdList
  //         ? [formData.storeAcctIdList]
  //         : storeAcctIdList
  //     };
  //   } else {
  //     // 导出勾选的数据
  //     params = {
  //       selectedIdList: checkedList.map((item) => item.id)
  //     };
  //   }
  //   try {
  //     gridOptions.loading = true;
  //     transBlob({
  //       url: '/lms/miraviaOnlineProduct/exportSelectedItem',
  //       contentType: 'application/json',
  //       data: params,
  //       fileName: '在线商品' + Date.now() + '.xls'
  //     }).finally(() => {
  //       gridOptions.loading = false;
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // 导出配置--start
  const miraviaExportConfigDialog = ref(false);
  const miraviaExportConfigCheckboxData = ref();
  const handleBatchExport = async () => {
    // 配置弹窗
    try {
      const { data } = await getExportHeader();

      let obj = [];
      for (let key in data) {
        if (key == 'product') {
          obj.push({
            label: key + '字段',
            field: key,
            isChecked: true,
            disabled: ['storeAcct', 'productId'],
            checkedData: [],
            children: [{ label: '', field: '', children: data[key] }]
          });
        } else if (key == 'variation') {
          obj.push({
            label: key + '字段',
            field: key,
            isChecked: true,
            disabled: ['storeSSku'],
            checkedData: [],
            children: [{ label: '', field: '', children: data[key] }]
          });
        } else {
          obj.push({
            label: key + '字段',
            field: key,
            isChecked: true,
            checkedData: [],
            children: [{ label: '', field: '', children: data[key] }]
          });
        }
      }
      miraviaExportConfigCheckboxData.value = obj;
      miraviaExportConfigDialog.value = true;
      const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
      checkedRowList.value = cloneDeep(checkedList);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const handleLogRuleClose = (e) => {
    miraviaExportConfigCheckboxData.value = [];
    miraviaExportConfigDialog.value = e.isShow;
  };

  const exportDialog = (e) => {
    let obj = {};
    if (e.checkedType == '导出列表选中数据') {
      const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
      if (checkedList.length == 0) {
        ElMessage.warning('没有在列表中选中数据，请检查后提交！');
        return false;
      }
      obj.selectedIdList = checkedList.map((item) => item.id);
    } else if (e.checkedType == '导出查询条件中的数据') {
      // 没有勾选数据 则导出全部符合条件的数据
      let storeAcctIdList = [];
      handleStoreList(storeAcctIdList);
      let _developerIdList = '';
      if (formData.developerIdList?.length > 0) {
        let developerId =
          formData.developerIdList[formData.developerIdList.length - 1];
        _developerIdList = [developerId];
      } else {
        _developerIdList = [];
      }
      const paramsFormData = cloneDeep(formData);
      if (formData.leafCategoryIdList?.length) {
        paramsFormData.leafCategoryIdList = formData.leafCategoryIdList.map(
          (item) => item[item.length - 1]
        );
      }
      obj = {
        ...paramsFormData,
        storeAcctIdList: formData.storeAcctIdList
          ? [formData.storeAcctIdList]
          : storeAcctIdList,
        developerIdList: _developerIdList
      };
    }
    e.data.forEach(
      (item) => (obj[`${item.field}ExportFields`] = item.checkedData)
    );
    // obj.productExportFields = e.checkedProduct;
    // obj.variationExportFields = e.checkedVariation;
    miraviaExportConfigDialog.value = false;
    gridOptions.loading = true;
    transBlob({
      url: '/lms/miraviaOnlineProduct/exportSelectedItem',
      contentType: 'application/json',
      data: obj,
      fileName: '在线商品' + Date.now() + '.xls'
    }).finally(() => {
      gridOptions.loading = false;
    });
  };

  // 批量上下架
  const pInfoList = ref([]);
  const handleBatchPutawayOrSoldout = async (type) => {
    const { fullData } = tableRef.value[tabIndex.value].getTableData();
    if (!fullData.length) {
      return ElMessage.warning('请先查询列表！');
    }

    const newType = type ? '上架' : '下架';
    await ElMessageBox.confirm(`确认${newType}所有符合条件的商品?`, {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    });

    // 不勾选 默认操作当页所有 type: 1 上架 0 下架
    const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
    if (!checkedList.length) {
      pInfoList.value = fullData.map((item) => ({
        storeAcctId: item.storeAcctId,
        productId: item.productId
      }));
    } else {
      pInfoList.value = checkedList.map((item) => ({
        storeAcctId: item.storeAcctId,
        productId: item.productId
      }));
    }
    type ? batchSetOnline() : batchSetOffline();
  };

  // 批量上架
  const batchExportVisible = ref(false);
  const failGroupMap = ref({});
  const onlineOrOffLineType = ref();
  const batchSetOnline = async () => {
    gridOptions.loading = true;
    const { code, data } = await batchSetOnlineApi(pInfoList.value).finally(
      () => (gridOptions.loading = false)
    );
    if (code === '0000' && data.success) {
      const { fullData } = tableRef.value[tabIndex.value].getTableData();
      const productIdList = pInfoList.value.map((item) => {
        return item.productId;
      });
      gridOptions.data = fullData.filter((item) => {
        return !productIdList.includes(item.productId);
      });
      totalCount.value = gridOptions.data.length;
      getTabCount(totalCount.value);
      ElMessage.success('上架成功！');
    } else {
      failGroupMap.value = data.failGroupMap;
      onlineOrOffLineType.value = 1;
      batchExportVisible.value = true;
    }
  };

  // 批量下架
  const batchSetOffline = async () => {
    const { code, data } = await batchSetOfflineApi(pInfoList.value).finally(
      () => (gridOptions.loading = false)
    );
    if (code === '0000' && data.success) {
      const { fullData } = tableRef.value[tabIndex.value].getTableData();
      const productIdList = pInfoList.value.map((item) => {
        return item.productId;
      });
      gridOptions.data = fullData.filter((item) => {
        return !productIdList.includes(item.productId);
      });
      totalCount.value = gridOptions.data.length;
      getTabCount(totalCount.value);
      ElMessage.success('下架成功！');
    } else {
      batchExportVisible.value = true;
      onlineOrOffLineType.value = 0;
      failGroupMap.value = data.failGroupMap;
    }
  };

  const showBatchChangePrice = ref(false);
  const selectedIdList = ref([]);

  // 批量改价
  const handleBatchChangePrice = () => {
    const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    selectedIdList.value = [];

    checkedList.forEach((item) => {
      item.prodSyncSMiraviaDtoList.forEach((sItem) => {
        selectedIdList.value.push(sItem.id);
      });
    });
    showBatchChangePrice.value = true;
  };

  // 批量修改标题
  const checkedPIdList = ref([]);
  const showBatchReplaceTitle = ref(false);
  // const handleBatchUpdateTitle = () => {
  //   checkedPIdList.value = [];
  //   const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
  //   if (!checkedList.length) {
  //     return ElMessage.warning('请选择数据！');
  //   }
  //   checkedPIdList.value = checkedList.map((item) => item.productId);

  //   showBatchReplaceTitle.value = true;
  // };

  // 批量修改描述
  const showBatchReplaceDesc = ref(false);
  // const handleBatchDescription = () => {
  //   checkedPIdList.value = [];
  //   const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
  //   if (!checkedList.length) {
  //     return ElMessage.warning('请选择数据！');
  //   }
  //   checkedPIdList.value = checkedList.map((item) => item.productId);
  //   showBatchReplaceDesc.value = true;
  // };

  // 批量修改图片
  const updateImageCheckedIdList = ref([]);
  const showBatchUpdateImage = ref(false);

  // const handleBatchUpdateImages = () => {
  //   updateImageCheckedIdList.value = [];
  //   const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();

  //   if (!checkedList.length) {
  //     return ElMessage.warning('请选择数据！');
  //   }
  //   updateImageCheckedIdList.value = checkedList.map((item) => item.id);
  //   showBatchUpdateImage.value = true;
  // };

  // 批量修改物流属性
  const checkedLogisticsAttrIdList = ref([]);
  const showBatchLogisticsAttr = ref(false);
  // const handleBatchLogisticsAttribute = () => {
  //   const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
  //   if (!checkedList.length) {
  //     return ElMessage.warning('请选择数据！');
  //   }
  //   checkedLogisticsAttrIdList.value = [];

  //   checkedLogisticsAttrIdList.value = checkedList.map((item) => item.id);
  //   showBatchLogisticsAttr.value = true;
  // };

  // 批量修改变种信息
  const varietyInfoParamsList = ref([]);
  const showBatchVarietyInfo = ref(false);
  // const handleBatchVarietyInfo = () => {
  //   const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
  //   if (!checkedList.length) {
  //     return ElMessage.warning('请选择数据！');
  //   }
  //   varietyInfoParamsList.value = checkedList.map((item) => ({
  //     id: item.id,
  //     productId: item.productId,
  //     storeAcct: item.storeAcct,
  //     storeAcctId: item.storeAcctId
  //   }));
  //   showBatchVarietyInfo.value = true;
  // };

  // #region 上传视频
  // const handleBatchUploadVideo = async () => {
  //   const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
  //   if (!checkedList.length) {
  //     return ElMessage.warning('请选择数据！');
  //   }
  //   ElMessageBox.confirm('确定上传视频至所选商品?', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   })
  //     .then(async () => {
  //       let params = checkedList.map((item) => item.id);
  //       const { msg } = await uploadVideoApi(params);
  //       ElMessageBox.alert(msg, '提示', {
  //         confirmButtonText: '关闭',
  //         type: 'success'
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  // #endregion 上传视频

  // 批量修改listing标签
  const checkedParamsList = ref([]);
  const showBatchUpdateListingTags = ref(false);
  const handleBatchUpdateListingTags = () => {
    const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    checkedParamsList.value = checkedList;
    showBatchUpdateListingTags.value = true;
  };

  // 导入店铺表格
  // 导入新增
  const uploadSuccess = (res) => {
    if (res.code == '0000') {
      ElMessage.success('导入店铺表格成功！');
      if (res?.data?.length > 0) {
        ElMessageBox.alert(res.data?.join(','), '提示', {
          confirmButtonText: '确认',
          type: 'warning',
          dangerouslyUseHTMLString: true
        });
      }
    } else {
      ElMessageBox.alert(res.msg || '导入店铺表格失败！', '错误信息', {
        confirmButtonText: '确认',
        type: 'error',
        dangerouslyUseHTMLString: true
      });
    }
  };
  const uploadError = () => {
    ElMessage.error('导入店铺表格失败！');
  };

  const beforeUpload = (file) => {
    const fileType = file.type;
    if (
      fileType !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      ElMessage.warning('导入文件格式错误，请导入.xlsx文件');
      return false;
    }
    return true;
  };
</script>
<style lang="scss" scoped>
  .miravia-theader,
  .miravia-tbody {
    display: flex;
    .miravia-theader-th,
    .miravia-tbody-td {
      flex: 1;
      box-sizing: border-box;
      padding: 0 5px;
    }
  }
  .miravia-tbody {
    border-bottom: 1px solid #e8eaec;
    &:last-child {
      border-bottom: none;
    }
  }
  // select下拉框
  :deep(.el-select) {
    .el-select__tags .el-tag {
      max-width: 100px !important;
      position: relative;
    }
    .el-select__tags input {
      margin-left: 2px;
    }
  }
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
    }
  }
  // .sale_grid {
  //   display: grid;
  //   grid-auto-flow: column;
  //   grid-template-rows: repeat(3, minmax(0, 1fr));
  // }
  .w-200 {
    width: 200px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex_center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .flexItem {
    flex: 1;
  }
  .danger_tag {
    background: rgb(245, 108, 108);
  }
  .tag {
    display: inline-block;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-radius: 5px;
    margin-right: 5px;
    font-size: 14px;
    color: #ffffff;
  }
  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
  }
  .copy_icon {
    margin-left: 5px;
    color: #666;
    cursor: pointer;
  }
  .mr-4 {
    margin-right: 4px;
  }
  .tag_left {
    width: 80px !important;
  }
  .tag_right {
    width: 270px !important;
    :deep(.el-input) {
      width: 100% !important;
    }
  }
  .show-oneline {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .reason-tips {
    max-width: 500px;
    padding: 5px;
    display: flex;
  }
</style>
