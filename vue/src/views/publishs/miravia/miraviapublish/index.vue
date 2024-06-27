<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="app-container">
    <!-- 筛选条件表单 start -->
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="miraviaData.formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="miraviaData.formData.orgId"
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
            v-model="miraviaData.formData.salePersonId"
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
            v-model="miraviaData.formData.storeAcctIdList"
            placeholder="请选择"
            clearable
            filterable
            @change="changestoreAccIdList"
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
            v-model="miraviaData.formData.cateName"
            :options="miraviaData.initFormData.oaList"
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
            v-model="miraviaData.formData.devTypeList"
            placeholder="请选择"
            :class="
              miraviaData.formData.devTypeList.length > 1 ? 'hide_tag' : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="miraviaData.formData.devTypeList.length > 1"
                type="info"
                >已选{{ miraviaData.formData.devTypeList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in miraviaData.initFormData.devTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签" prop="prodAttrTagList">
          <el-select
            v-model="miraviaData.formData.prodAttrTagList"
            :class="
              miraviaData.formData.prodAttrTagList.length > 1 ? 'hide_tag' : ''
            "
            filterable
            clearable
            placeholder="请选择"
            collapse-tags
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="miraviaData.formData.prodAttrTagList.length > 1"
                type="info"
                >已选{{ miraviaData.formData.prodAttrTagList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in miraviaData.initFormData.prodAttrTagList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="miraviaData.formData.includeLogisAttrListType"
            class="form_left"
          >
            <el-option :value="1" label="物流属性与"></el-option>
            <el-option :value="2" label="物流属性或"></el-option>
          </el-select>
          <el-select
            v-model="miraviaData.formData.includeLogisAttrList"
            placeholder="请选择"
            :class="
              miraviaData.formData.includeLogisAttrList.length > 1
                ? 'hide_tag'
                : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="miraviaData.formData.includeLogisAttrList.length > 1"
                type="info"
                >已选{{
                  miraviaData.formData.includeLogisAttrList.length
                }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in miraviaData.initFormData.logisAttr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="开发专员" prop="bizzOwnerIdList">
          <el-select
            v-model="miraviaData.formData.bizzOwnerIdList"
            placeholder="请选择"
            :class="
              miraviaData.formData.bizzOwnerIdList.length > 1 ? 'hide_tag' : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="miraviaData.formData.bizzOwnerIdList.length > 1"
                type="info"
                >已选{{ miraviaData.formData.bizzOwnerIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in miraviaData.initFormData.bizzOwnerIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态" prop="saleStatusList">
          <el-select
            v-model="miraviaData.formData.saleStatusList"
            :class="
              miraviaData.formData.saleStatusList.length > 1 ? 'hide_tag' : ''
            "
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            clearable
          >
            <template #prefix>
              <el-tag
                v-if="miraviaData.formData.saleStatusList.length > 1"
                type="info"
                >已选{{ miraviaData.formData.saleStatusList.length }}项</el-tag
              >
            </template>
            <el-option :value="0" label="停售" />
            <el-option :value="1" label="部分在售" />
            <el-option :value="2" label="在售" />
          </el-select>
        </el-form-item>

        <el-form-item label="生成情况" prop="generateStatus">
          <el-select v-model="miraviaData.formData.generateStatus" clearable>
            <el-option :value="false" label="未生成" />
            <el-option :value="true" label="已生成" />
          </el-select>
        </el-form-item>
        <el-form-item prop="tortPlat" label="侵权状态"
          ><el-select
            v-model="miraviaData.formData.tortPlat"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="所有平台不侵权" :value="'ANY_PLAT'" />
            <el-option label="任意平台侵权" :value="'ONE_PLAT'" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="miraviaData.formData.queryTimeType"
            class="form_left"
          >
            <el-option v-if="activeKey == '-2'" value="1" label="创建时间" />
            <el-option value="2" label="审核时间" />
            <el-option
              v-if="[0, 1, 2, 3].includes(Number(activeKey))"
              value="3"
              label="生成时间"
            />
          </el-select>
          <el-date-picker
            v-model="miraviaData.formData.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            :shortcuts="shortcuts"
            unlink-panels
            style="width: 200px"
            class="form_right"
          />
        </el-form-item>

        <el-form-item prop="orderByType" label="排序方式"
          ><el-select v-model="miraviaData.formData.orderByType" clearable>
            <template v-if="activeKey === '-2'">
              <el-option :value="1" label="创建时间倒序" />
              <el-option :value="2" label="创建时间正序" />
            </template>
            <el-option :value="3" label="审核时间倒序" />
            <el-option :value="4" label="审核时间正序" />
            <template v-if="activeKey !== '-2'">
              <el-option :value="8" label="生成时间倒序" />
              <el-option :value="7" label="生成时间正序" />
              <el-option :value="5" label="采购成本倒序" />
              <el-option :value="6" label="采购成本正序" />
              <el-option :value="9" label="零售价倒序" />
              <el-option :value="10" label="零售价正序" />
              <el-option :value="11" label="7天销量正序" />
              <el-option :value="12" label="7天销量倒序" />
              <el-option :value="13" label="15天销量正序" />
              <el-option :value="14" label="15天销量倒序" />
              <el-option :value="15" label="30天销量正序" />
              <el-option :value="16" label="30天销量倒序" />
            </template>
            <template v-if="activeKey === '-2'">
              <el-option :value="7" label="7天销量正序" />
              <el-option :value="8" label="7天销量倒序" />
              <el-option :value="9" label="15天销量正序" />
              <el-option :value="10" label="15天销量倒序" />
              <el-option :value="11" label="30天销量正序" />
              <el-option :value="12" label="30天销量倒序" />
            </template>
            <el-option :value="17" label="7天西班牙销量正序" />
            <el-option :value="18" label="7天西班牙销量倒序 " />
            <el-option :value="19" label="15天西班牙销量正序" />
            <el-option :value="20" label="15天西班牙销量倒序" />
            <el-option :value="21" label="30天西班牙销量正序" />
            <el-option :value="22" label="30天西班牙销量倒序" />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item
          v-if="activeKey === '-2'"
          label="采购成本(CNY)"
          class="form_range"
        >
          <el-input
            v-model="miraviaData.formData.costMin"
            type="number"
            placeholder="￥"
          />
          <div class="range_link">-</div>
          <el-input
            v-model="miraviaData.formData.costMax"
            type="number"
            placeholder="￥"
          />
        </el-form-item>
        <el-form-item
          v-if="activeKey !== '-2'"
          label="采购成本(EUR)"
          class="form_range"
        >
          <el-input
            v-model="miraviaData.formData.costMinEUR"
            type="number"
            placeholder=""
          />
          <div class="range_link">-</div>
          <el-input
            v-model="miraviaData.formData.costMaxEUR"
            type="number"
            placeholder=""
          />
        </el-form-item>
        <el-form-item
          v-if="activeKey !== '-2'"
          label="零售价(EUR)"
          class="form_range"
        >
          <el-input
            v-model="miraviaData.formData.skuPriceMin"
            type="number"
            placeholder=""
          />
          <div class="range_link">-</div>
          <el-input
            v-model="miraviaData.formData.skuPriceMax"
            type="number"
            placeholder=""
          />
        </el-form-item>
        <el-form-item
          v-if="activeKey !== '-2'"
          label="促销价(EUR)"
          class="form_range"
        >
          <el-input
            v-model="miraviaData.formData.skuDiscountPriceMin"
            type="number"
          />
          <div class="range_link">-</div>
          <el-input
            v-model="miraviaData.formData.skuDiscountPriceMax"
            type="number"
          />
        </el-form-item>
        <el-form-item label="商品类型" prop="isMultiAttr">
          <el-select v-model="miraviaData.formData.isMultiAttr" clearable>
            <el-option :value="false" label="单属性" />
            <el-option :value="true" label="多属性" />
          </el-select>
        </el-form-item>
        <el-form-item label="自拍图" prop="selfImgStatusList">
          <el-select
            v-model="miraviaData.formData.selfImgStatusList"
            placeholder="请选择"
            :class="
              miraviaData.formData.selfImgStatusList.length > 1
                ? 'hide_tag'
                : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="miraviaData.formData.selfImgStatusList.length > 1"
                type="info"
                >已选{{
                  miraviaData.formData.selfImgStatusList.length
                }}项</el-tag
              >
            </template>
            <el-option :value="1" label="有图" />
            <el-option :value="2" label="部分有图" />
            <el-option :value="0" label="无图" />
          </el-select>
        </el-form-item>
        <el-form-item label="白底图" prop="isWhite">
          <el-select v-model="miraviaData.formData.isWhite" clearable>
            <el-option :value="2" label="数量≥2" />
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="miraviaData.formData.whStockSearchType"
            class="form_left"
            clearable
          >
            <el-option
              :value="'availableStockNum'"
              label="义乌仓库存可用"
            ></el-option>
            <el-option
              :value="'orderNotInNum'"
              label="义乌仓库存在途"
            ></el-option>
            <el-option
              :value="'lackUnPaiNum'"
              label="义乌仓库存未派"
            ></el-option>
          </el-select>
          <el-select
            v-model="miraviaData.formData.whStockPropType"
            class="form_left"
            clearable
          >
            <el-option :value="1" label="部分属性" />
            <el-option :value="2" label="全部属性" />
          </el-select>
          <el-input
            v-model="miraviaData.formData.whStockBegin"
            type="number"
            style="width: 115px"
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="miraviaData.formData.whStockEnd"
            type="number"
            style="width: 115px"
          ></el-input>
        </el-form-item>
        <br v-if="activeKey !== '-2'" />
        <el-form-item label="是否已刊登">
          <el-select v-model="miraviaData.formData.hasListing">
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchSkuType">
          <el-select
            v-model="miraviaData.formData.queryTextType"
            class="form_left"
          >
            <el-option value="1" label="父SKU" />
            <el-option value="2" label="子SKU" />
            <el-option value="3" label="中文标题" />
            <el-option value="4" label="英文标题" />
          </el-select>
          <el-input
            v-model="miraviaData.formData.queryText"
            placeholder="多个逗号隔开"
            class="form_left form_right"
            style="width: 120px !important"
            clearable
          />
          <el-select
            v-model="miraviaData.formData.fuzzyQuery"
            class="form_right WH80"
          >
            <el-option :value="false" label="精确" />
            <el-option :value="true" label="模糊" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="activeKey !== '-2'"
          label="miravia类目"
          prop="cateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="miraviaData.formData.miraviaCateName"
            :options="miraviaData.initFormData.miraviaOption"
            :props="miraviaPropsTo"
            clearable
            @change="changeMiraviaOption"
          ></el-cascader>
        </el-form-item>

        <el-form-item
          v-if="activeKey === '2'"
          prop="searchSkuType"
          label="失败原因"
        >
          <el-select v-model="miraviaData.formData.failType" class="form_left">
            <el-option value="0" label="侵权" />
            <el-option value="1" label="重复刊登" />
            <el-option value="2" label="平台报错" />
          </el-select>
          <el-input
            v-model="miraviaData.formData.failMessage"
            placeholder="错误码或错误信息"
            clearable
          />
        </el-form-item>

        <el-form-item prop="isListingAble" label="禁售状态">
          <el-select v-model="miraviaData.formData.isListingAble">
            <el-option :value="null" label="全部" />
            <el-option :value="false" label="禁售" />
            <el-option :value="true" label="非禁售" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getPublishList()">查询</el-button>
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
                : item.label
            "
            :name="item.status"
          >
            <vxe-grid v-bind="gridOptions" ref="miraviaTable">
              <!-- 标题/商品ID/类目 -->
              <template #miravia_pic="{ row }">
                <ImagePop
                  :src="
                    activeKey === '-2'
                      ? row.prodPImage
                      : row.mainImageUrls?.split('|')[0]
                  "
                />
              </template>
              <template #miravia_title="{ row }">
                <span v-if="activeKey === '-2'">{{ row.enTitle }}</span>
                <span v-else>{{ row.title }}</span>
                <el-popover
                  v-if="
                    (activeKey == '2' || activeKey == '1') && row.videoErrorMsg
                  "
                  placement="top-start"
                  trigger="hover"
                  :content="row.videoErrorMsg"
                  :width="500"
                >
                  <template #reference>
                    <el-tag
                      v-if="activeKey == '2' || activeKey == '1'"
                      type="danger"
                      effect="dark"
                      style="margin-left: 5px"
                      @click="copy(row.videoErrorMsg)"
                      >视</el-tag
                    >
                  </template>
                </el-popover>
              </template>
              <template #miravia_bizzOwner="{ row }">
                商品名：{{ row.cnTitle }}<br />
                开发专员：{{ row.bizzOwner }}
              </template>
              <template #miravia_pSku="{ row }">
                <div
                  v-if="activeKey == '-2'"
                  @click="openPskuDetails(row.prodPId)"
                >
                  <span style="color: #409eff">{{ row.prodPSku }}</span>
                  <el-tag v-if="row.listingPublishStatus" type="success"
                    >已刊登</el-tag
                  >
                </div>
                <div v-else @click="openPskuDetails(row.prodPId)">
                  <span style="color: #409eff">{{ row.prodPSku }}</span>
                </div>
                <div style="display: flex">
                  <span v-if="activeKey == '1'" class="tag primary_tag"
                    >已</span
                  >
                  <span v-if="row.selfImgStatus" class="tag primary_tag"
                    >自</span
                  >
                  <el-popover
                    v-if="row.logisAttrList"
                    placement="top-start"
                    trigger="hover"
                    :content="row.logisAttrList"
                    :width="500"
                  >
                    <template #reference>
                      <span
                        class="tag danger_tag"
                        @click="copy(row.logisAttrList)"
                      >
                        {{ getAttrTag(row.logisAttrList) }}
                      </span>
                    </template>
                  </el-popover>
                  <el-popover
                    v-if="activeKey == '2' && row.listingRespMsg"
                    placement="top-start"
                    trigger="hover"
                    :content="row.listingRespMsg"
                    :width="500"
                  >
                    <template #reference>
                      <span
                        v-if="activeKey == '2'"
                        class="tag dark_tag"
                        @click="copy(row.listingRespMsg)"
                      >
                        败
                      </span>
                    </template>
                  </el-popover>
                </div>
              </template>
              <template #prodListingSubSkuTemuDtoList_header>
                <div class="miravia-theader">
                  <div class="miravia-theader-th">基础模板子SKU</div>
                  <div class="miravia-theader-th">颜色</div>
                  <div class="miravia-theader-th">尺寸</div>
                  <div class="miravia-theader-th">款式</div>
                  <div class="miravia-theader-th">在售</div>
                  <div v-if="activeKey === '-2'" class="miravia-theader-th">
                    采购成本
                  </div>
                  <div v-if="activeKey !== '-2'" class="miravia-theader-th">
                    采购成本(EUR)
                  </div>
                  <div v-if="activeKey !== '-2'" class="miravia-theader-th">
                    零售价(EUR)
                  </div>
                  <div v-if="activeKey !== '-2'" class="miravia-theader-th">
                    促销价(EUR)
                  </div>
                  <div class="miravia-theader-th">
                    义乌仓库存<br />(可用/在途/未派)
                  </div>
                  <div class="miravia-theader-th">
                    公司销量<br />(7/15/30天)
                  </div>
                </div>
              </template>
              <template #miravia_prodListingSubSkuTemuDtoList="{ row }">
                <div v-if="row.prodListingSubSkuMiraviaDtoList?.length > 0">
                  <div
                    v-for="item in row.prodListingSubSkuMiraviaDtoList.slice(
                      0,
                      row.displayCount
                    )"
                    :key="item.id"
                    class="miravia-tbody"
                  >
                    <div class="miravia-tbody-td">
                      <div>{{ item.prodSSku }}</div>
                    </div>
                    <div class="miravia-tbody-td">
                      <div>{{ item.color }}</div>
                    </div>
                    <div class="miravia-tbody-td">
                      <div>{{ item.size }}</div>
                    </div>
                    <div class="miravia-tbody-td">
                      <div>{{ item.style }}</div>
                    </div>
                    <div class="miravia-tbody-td">
                      <div>{{ item.isSale }}</div>
                    </div>
                    <div class="miravia-tbody-td">
                      <div>{{ item.purchaseCostPrice }}</div>
                    </div>
                    <div v-if="activeKey !== '-2'" class="miravia-tbody-td">
                      <div>{{ item.skuPrice }}</div>
                    </div>
                    <div v-if="activeKey !== '-2'" class="miravia-tbody-td">
                      <div>{{ item.skuDiscountPrice }}</div>
                    </div>
                    <div class="miravia-tbody-td">
                      <div>
                        {{ item.availableStockNum || 0 }} /
                        {{ item.orderNotInNum || 0 }} /
                        {{ item.lackUnPaiNum || 0 }}
                      </div>
                    </div>
                    <div class="miravia-tbody-td">
                      <div>
                        {{ item.sevenSales || 0 }} /
                        {{ item.fifteenSales || 0 }} /
                        {{ item.thirtySales || 0 }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="row.prodListingSubSkuMiraviaDtoList.length > 3"
                    class="miravia-tbody"
                  >
                    <el-button type="primary" text @click="showAllList(row)">
                      {{ row.displayTxt }}({{
                        row.prodListingSubSkuMiraviaDtoList.length
                      }})
                    </el-button>
                  </div>
                </div>
                <div v-else>无子数据</div>
              </template>
              <template #miravia_time="{ row }">
                <div>
                  审核：{{
                    row.auditTime
                      ? parseTime(row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                </div>
                <div>
                  创建：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                </div>
                <div v-if="activeKey !== '-2'">
                  修改：{{
                    row.modifyTime
                      ? parseTime(row.modifyTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                </div>
                <div v-if="activeKey == '3' && row.listTiming">
                  定时刊登：{{
                    row.listTiming
                      ? parseTime(row.listTiming, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                </div>
              </template>
              <template v-if="activeKey !== '-2'" #miravia_operator="{ row }">
                <div>刊登人：{{ row.creator }}</div>
                <div>最后一次修改人：{{ row.modifier }}</div>
              </template>
              <template v-if="activeKey !== '-2'" #miravia_operate="{ row }">
                <el-button type="primary" @click="getDetail(row)"
                  >详情</el-button
                >
              </template>
              <!-- 分页 -->
              <template #pager>
                <vxe-pager
                  v-model:current-page="miraviaData.formData.page"
                  v-model:page-size="miraviaData.formData.limit"
                  :layouts="[
                    'Sizes',
                    'PrevPage',
                    'Number',
                    'NextPage',
                    'FullJump',
                    'Total'
                  ]"
                  :page-sizes="[50, 100, 300, 10000]"
                  :total="totalCount"
                  @page-change="handlePageChange"
                >
                </vxe-pager>
              </template>
            </vxe-grid>
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
        <el-button
          v-if="activeKey == '0'"
          type="primary"
          @click="publishOnTime()"
          >定时刊登</el-button
        >
        <el-button
          v-if="activeKey == '3'"
          type="danger"
          @click="cancelPublishOnTime()"
          >取消定时刊登</el-button
        >
        <el-button
          v-if="activeKey == '0'"
          type="primary"
          @click="handlePublish(0)"
          >立即刊登</el-button
        >
        <el-button
          v-if="activeKey == '2'"
          type="primary"
          @click="handlePublish(1)"
          >重新发布</el-button
        >
      </div>
    </el-card>
    <!-- 数据展示列表 end -->

    <!-- 详情 -->
    <Publishdetail
      v-if="showDialog"
      :show-dialog="showDialog"
      :store-acc-id="miraviaData.formData.storeAcctIdList"
      :action="action"
      :active-key="activeKey"
      :prod-p-id="prodPId"
      :listing-id="listingId"
      :listing-status="miraviaData.formData.listingStatus"
      @close="handleClose"
    />

    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :cate-search-value="miraviaData.formData.cateSearchValue"
      :handle-cate-dialog-type="'oa'"
      @close-dialog="handleCateDialogClose($event)"
    />

    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />

    <!-- 定时刊登 -->
    <el-dialog
      v-model="dialogVisible"
      width="600px"
      title="定时刊登"
      :close-on-click-modal="false"
    >
      <el-form :scroll-to-error="true" size="default" :label-width="180">
        <el-form-item label="定时刊登开始时间" prop="listTiming">
          <el-date-picker
            v-model="listTiming"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择定时刊登开始时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handlePublsih">确定</el-button>
        <el-button @click="cancelPublish">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="publishsmiraviamiraviapublish">
  import { queryCateList } from '@/api/publishs/miraviapublish';
  import { onMounted, reactive, ref, computed, nextTick } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import Publishdetail from './components/Publishdetails.vue';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    queryOaNewCategory,
    shortcuts,
    getProdTagListApi,
    getLogisListApi,
    getDevTypeListApi,
    getListuserbyrole
  } from '@/api/common';
  import {
    handleQueryList,
    handleRemoveList,
    startPublish,
    updateProdListTiming,
    cancelProdListTiming,
    getLogisAttrEnum
  } from '@/api/publishs/miraviapublish';
  import useUserStore from '@/store/modules/user';
  import CateDialog from '@/components/CateDialog.vue';
  import { parseTime, copy } from '@/utils/common';
  const miraviaData = reactive({
    // 初始化查询条件
    initFormData: {
      oaList: [],
      bizzOwnerIdList: [], //  开发专员:多选
      prodAttrTagList: [], //  商品标签
      logisAttr: [], //  物流属性:多选
      devTypeList: [], //  开发类型:多选
      miraviaOption: [] // miravia类目
    },
    // form表单数据
    formData: {
      orgId: '', // 部门
      salePersonId: '', // 销售员
      //店铺Id，必选
      // storeAcctId: '',
      storeAcctIdList: '',
      page: 1,
      limit: 50,
      listingStatus: -2,
      //OA新类目
      cateId: '',
      cateIdList: [],
      //开发类型
      devTypeList: '',
      //商品标签
      prodAttrTagList: [],
      //物流属性
      includeLogisAttrList: [],
      //开发专员
      bizzOwnerIdList: [],
      //在售状态
      saleStatusList: [2],
      //生成情况
      generateStatus: false,
      //侵权状态
      tortPlat: 'ANY_PLAT',
      //商品类型
      isMultiAttr: '',
      // 自拍图
      selfImgStatusList: [],
      miraviaCateIdList: [],
      miraviaCateName: [],
      whStockSearchType: 'availableStockNum',
      whStockBegin: '',
      whStockEnd: '',
      // 是否有白底图
      isWhite: '',
      // 白底图数量是否大于等于2
      minWhiteNum: '',
      // 是否已刊登
      hasListing: false,
      // 库存类型
      whStockPropType: 1,
      //是否禁售
      // isListingAble: 1,
      // 查询时间类型
      queryTimeType: '1', // 1 创建时间 2 审核时间 3 生成时间
      time: [],
      queryTimeStart: '', // 时间查询开始
      queryTimeEnd: '', // 时间查询结束
      // 采购成本
      costMin: '',
      costMax: '',
      // EUR采购成本
      costMinEUR: '',
      costMaxEUR: '',
      queryTextType: '1', // 查询文本类型 1父sku 2子sku 3中文标题 4英文标题
      failType: '', // 失败原因
      isListingAble: true, // 禁售状态 默认 非禁售
      failMessage: '', // 错误信息
      queryText: '', // 查询文本的具体内容
      fuzzyQuery: false, // 是否模糊查询 true false
      skuPriceMin: '', // 零售价
      skuPriceMax: '',
      skuDiscountPriceMin: '', // 促销价
      skuDiscountPriceMax: '', // 促销价
      orderByType: '',
      includeLogisAttrListType: 1
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

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 280;
  });
  const gridOptions = reactive({
    border: true,
    showOverflow: true,
    loading: false,
    height: height,
    scrollY: {
      gt: 20
    },
    rowConfig: {
      isHoverRow: true
    },
    columnConfig: {
      resizable: true
    },
    columns: [
      { type: 'checkbox', width: 43 },
      {
        title: '图片',
        width: 100,
        slots: {
          default: 'miravia_pic'
        }
      },
      {
        title: '英文标题',
        width: 280,
        slots: {
          default: 'miravia_title'
        }
      },
      {
        title: '商品名/开发专员',
        width: 200,
        slots: {
          default: 'miravia_bizzOwner'
        }
      },
      {
        title: '父SKU',
        width: 100,
        slots: {
          default: 'miravia_pSku'
        }
      },
      {
        field: 'prodListingSubSkuMiraviaDtoList',
        resizable: false,
        slots: {
          header: 'prodListingSubSkuTemuDtoList_header',
          default: 'miravia_prodListingSubSkuTemuDtoList'
        }
      },
      {
        title: '时间',
        width: 120,
        slots: {
          default: 'miravia_time'
        }
      }
    ],
    data: []
  });

  onMounted(async () => {
    getDepartmentList();
    getStoreList();
    getLogisListAttrApi();

    //OA新类目
    {
      const { data } = await queryOaNewCategory();
      miraviaData.initFormData.oaList = JSON.parse(data);
    }
    //开发专员
    {
      const { data } = await getListuserbyrole();
      miraviaData.initFormData.bizzOwnerIdList = data.map((item) => ({
        value: item.id,
        label: item.userName
      }));
    }
    //商品标签
    {
      const { data } = await getProdTagListApi();
      miraviaData.initFormData.prodAttrTagList = data.map((item) => ({
        value: item.name,
        label: item.name
      }));
    }
    //物流属性
    {
      const { data } = await getLogisListApi();
      miraviaData.initFormData.logisAttr = data.map((item) => ({
        value: item.name,
        label: item.name
      }));
    }
    //开发类型
    {
      const { data } = await getDevTypeListApi();
      miraviaData.initFormData.devTypeList = data.map((item) => ({
        value: item.name,
        label: item.name
      }));
    }
  });

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
      return item.name === attrName;
    });
    return arr[0]?.alias || attrName;
  };

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

  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'miravia专员',
        orgId: miraviaData.formData.orgId,
        salePersonId: miraviaData.formData.salePersonId,
        platCode: 'miravia',
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
    miraviaData.formData.storeAcctIdList = '';
    getStoreList();
  };

  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    miraviaData.formData.orgId = '';
    resetSearch();
  };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    miraviaData.formData.salePersonId = '';
    miraviaData.formData.storeAcctIdList = '';
    getStoreList();
  };

  // 类目组件 start
  const showCateDialog = ref(false);
  const handleCateDialogClose = (e) => {
    showCateDialog.value = e.isShow;
    if (!e.cate) {
      return;
    }
    miraviaData.formData.cateName = e.cate.value.fullCateName;
    miraviaData.formData.cateId = e.cate.value.categoryId;
  };
  // 类目组件 end

  // 清空表单
  const resetForm = function () {
    formRef.value.resetFields();

    miraviaData.formData.includeLogisAttrList = [];
    miraviaData.formData.cateId = '';
    miraviaData.formData.queryTimeType = '';
    miraviaData.formData.queryTextType = '';
    miraviaData.formData.time = [];
    miraviaData.formData.costMin = '';
    miraviaData.formData.costMax = '';
    miraviaData.formData.costMinEUR = '';
    miraviaData.formData.costMaxEUR = '';
    miraviaData.formData.skuPriceMin = '';
    miraviaData.formData.skuPriceMax = '';
    miraviaData.formData.skuDiscountPriceMin = '';
    miraviaData.formData.skuDiscountPriceMax = '';
    miraviaData.formData.orderByType = '';
    miraviaData.formData.queryText = '';
    miraviaData.formData.whStockSearchType = '';
    miraviaData.formData.whStockBegin = '';
    miraviaData.formData.whStockEnd = '';
    miraviaData.formData.failType = '';
    miraviaData.formData.failMessage = '';
    miraviaData.formData.isListingAble = null;
  };

  const miraviaTable = ref(null);
  const selectRecords = ref([]);

  // 获取复选框选中的数据
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = miraviaTable.value;
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
  const changeTab = (tab) => {
    activeKey.value = tab.props.name;
    miraviaData.formData.listingStatus = Number(tab.props.name);
    miraviaData.formData.page = 1;
    miraviaData.formData.orderByType = '';

    if (tab.props.name !== '2') {
      miraviaData.formData.failType = '';
      miraviaData.formData.failMessage = '';
    }
    if (tab.props.name !== '-2') {
      // 不是商品 时间默认是审核时间
      miraviaData.formData.queryTimeType = '2';
      let operatorList = gridOptions.columns.filter(
        (item) => item.title === '操作人'
      );
      if (operatorList?.length === 0) {
        gridOptions.columns = gridOptions.columns.concat([
          {
            title: '操作人',
            width: 130,
            slots: {
              default: 'miravia_operator'
            }
          }
        ]);
      }
      let operateList = gridOptions.columns.filter(
        (item) => item.title === '操作'
      );
      if (operateList?.length === 0) {
        gridOptions.columns = gridOptions.columns.concat([
          {
            title: '操作',
            width: 80,
            slots: {
              default: 'miravia_operate'
            }
          }
        ]);
      }
    } else {
      gridOptions.columns = gridOptions.columns.filter(
        (item) => item.title !== '操作' && item.title !== '操作人'
      );
    }

    getPublishList();
  };

  // 选择完店铺查询miravia类目
  const changestoreAccIdList = (val) => {
    if (!val) return (miraviaData.initFormData.miraviaOption = []);
    getMiraviaOption();
  };

  // 获取maravia类目选项
  const getMiraviaOption = async () => {
    const { data } = await queryCateList({
      categoryTreeName: '',
      parentCateId: '',
      storeAcctId: miraviaData.formData.storeAcctIdList
    });
    miraviaData.initFormData.miraviaOption = data.map((item) => ({
      id: item.categoryId,
      value: item.categoryId,
      label: item.categoryTreeName,
      leaf: item.leaf
    }));
  };

  const changeMiraviaOption = (val) => {
    if (val) {
      const length = val.length;
      miraviaData.formData.miraviaCateIdList = length ? [val[length - 1]] : [];
    } else {
      miraviaData.formData.miraviaCateIdList = [];
    }
  };

  // 动态加载miravia类目
  const miraviaPropsTo = ref({});
  miraviaPropsTo.value = {
    lazy: true,
    async lazyLoad(node, resolve) {
      const { data } = node;
      let res = {},
        nodes;
      res = await queryCateList({
        parentCateId: data.id || data.id == 0 ? data.id : '',
        categoryTreeName: data.label || '',
        storeAcctId: miraviaData.formData.storeAcctIdList
      });
      nodes = res.data.map((item) => ({
        id: item.categoryId,
        value: item.categoryId,
        label: item.categoryName,
        leaf: item.leaf
      }));
      resolve(nodes);
    }
  };

  // 列表数据
  const requestId = ref(0); // 请求标识
  // 获取列表数据
  const getPublishList = async () => {
    handleSearchData();

    if (!miraviaData.formData.storeAcctIdList) {
      ElMessage.warning('请选择店铺');
      return;
    }

    // 白底图选择数量大于2 用这个字段minWhiteNum
    if (miraviaData.formData.isWhite === 2) {
      miraviaData.formData.minWhiteNum = 2;
    } else {
      miraviaData.formData.minWhiteNum = '';
    }

    gridOptions.loading = true;
    const id = ++requestId.value;
    requestId.value = id;
    try {
      const { code, data, count } = await handleQueryList({
        ...miraviaData.formData,
        storeAcctIdList:
          typeof miraviaData.formData.storeAcctIdList === 'number'
            ? [miraviaData.formData.storeAcctIdList]
            : miraviaData.formData.storeAcctIdList
      });
      gridOptions.loading = false;
      if (code === '0000') {
        if (id === requestId.value) {
          gridOptions.data = (data || []).map((item) => ({
            ...item,
            displayCount: 3,
            displayTxt: '展开'
          }));
          totalCount.value = count;
          getTabCount(totalCount.value);
        }
      }
    } catch (err) {
      console.log(err);
      gridOptions.loading = false;
    }
  };

  // 商品父SKU弹窗
  const showPskuDetailDialog = ref(false);
  const openPskuDetails = async (id) => {
    prodPId.value = id;
    showPskuDetailDialog.value = true;
  };
  const handelPskuDialogClose = (e) => {
    prodPId.value = '';
    showPskuDetailDialog.value = e.isShow;
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount > 10000 ? '>10000' : totalCount;
      }
    });
  };

  // 处理搜索条件 时间和sku搜索
  const handleSearchData = () => {
    let { time } = miraviaData.formData;

    if (time) {
      miraviaData.formData.queryTimeStart = time[0] || '';
      miraviaData.formData.queryTimeEnd = time[1] || '';
    }

    miraviaData.formData.cateIdList = [];
    if (
      miraviaData.formData.cateName &&
      miraviaData.formData.cateName.length != 0
    ) {
      miraviaData.formData.cateName.forEach((item) => {
        miraviaData.formData.cateIdList.push(item[item.length - 1]);
      });
    }
  };
  const showDialog = ref(false);
  const action = ref(''); // 弹窗 detail 详情 create 生成店铺商品
  const prodPId = ref('');
  // 生成店铺商品
  const handleCreate = () => {
    if (getSelectedList()) {
      if (selectRecords.value.length > 1) {
        return ElMessage.warning('只能选择一条数据生成店铺商品！');
      }
      showDialog.value = true;
      action.value = 'create';
      prodPId.value = selectRecords.value[0].prodPId;
    }
  };

  // 表格展示收缩
  const showAllList = async (row) => {
    if (row.displayCount == 3) {
      row.displayCount = row.prodListingSubSkuMiraviaDtoList.length;
      row.displayTxt = '收起';
      return;
    } else {
      row.displayCount = 3;
      row.displayTxt = '展开';
      return;
    }
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
        const { code } = await handleRemoveList(ids);
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
  const handlePublish = async (isRestart) => {
    if (getSelectedList()) {
      if (!isRestart) {
        publishFn(false);
      } else {
        ignoreTortToPublish();
      }
    }
  };

  // 定时刊登
  let dialogVisible = ref(false);
  let listTiming = ref();
  const publishOnTime = () => {
    if (getSelectedList()) {
      dialogVisible.value = true;
    }
  };
  const handlePublsih = async () => {
    if (!listTiming.value) {
      ElMessage.warning('请选择定时刊登时间');
      return;
    }
    if (listTiming.value.getTime() <= new Date().getTime()) {
      ElMessage.warning('定时刊登时间需要大于当前时间');
      return;
    }
    dialogVisible.value = false;
    let idList = selectRecords.value.map((item) => item.id),
      newList = [];
    idList.forEach((item) => {
      newList.push({
        id: item,
        listTiming: listTiming.value.getTime()
      });
    });
    const { code } = await updateProdListTiming(newList);
    if (code === '0000') {
      ElMessage.success('操作成功！');
      getPublishList();
    }
    listTiming.value = '';
  };
  const cancelPublish = () => {
    dialogVisible.value = false;
    listTiming.value = '';
  };

  // 取消定时刊登
  const cancelPublishOnTime = () => {
    if (getSelectedList()) {
      let idList = selectRecords.value.map((item) => item.id);
      ElMessageBox.confirm('是否取消定时刊登?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await cancelProdListTiming(idList);
        if (code === '0000') {
          ElMessage.success('操作成功！');
          getPublishList();
        }
      });
    }
  };

  // 点击重新发布 （要判断如果勾选的没有包含侵权的 没有弹窗 ;只要勾选数据存在侵权的 要弹框提示）
  const ignoreTortToPublish = () => {
    const haveTort = selectRecords.value.some(
      (item) =>
        item &&
        (item.listingRespMsg?.includes('侵权') ||
          item.listingRespMsg?.includes('禁售'))
    );
    if (haveTort) {
      ElMessageBox.confirm('是否无视侵权重新刊登?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          publishFn(true);
        })
        .catch(() => {
          ElMessage.info('已取消重新刊登！');
        });
    } else {
      publishFn(false);
    }
  };

  const idsList = ref([]);
  // 勾选数据是否满足含有禁售或者侵权
  const tortOrBanSale = (msg) => {
    if (msg.includes('禁售') || msg.includes('侵权')) {
      return true;
    } else {
      return false;
    }
  };

  const publishFn = async (isAgreeRestart) => {
    // 点击了重新发布的弹窗“是”：需要判断里面含有侵权的 skipCheck为true 其他为false
    if (isAgreeRestart) {
      idsList.value = selectRecords.value.map((item) => {
        return {
          listingId: item.id,
          skipCheck: item.listingRespMsg
            ? tortOrBanSale(item.listingRespMsg)
            : false
        };
      });
    } else {
      // false 表示点击立即发布按钮
      idsList.value = selectRecords.value.map((item) => {
        return { listingId: item.id, skipCheck: isAgreeRestart };
      });
    }
    const { code } = await startPublish(idsList.value);
    if (code === '0000') {
      ElMessage.success('刊登成功！');
      getPublishList();
    }
  };

  // 关闭弹窗
  const handleClose = (val) => {
    showDialog.value = false;
    if (val === 'update') {
      getPublishList();
    }
  };

  // 表格分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    miraviaData.formData.page = currentPage;
    miraviaData.formData.limit = pageSize;
    getPublishList();
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
</script>

<style lang="scss" scoped>
  .tag {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-left: 5px;
    line-height: 22px;
    text-align: center;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
  }
  .danger_tag {
    background: rgb(245, 108, 108);
  }
  .primary_tag {
    background: rgb(64, 158, 255);
  }
  .dark_tag {
    background: rgb(144, 147, 153);
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
    max-height: fit-content;
    text-overflow: ellipsis;
    white-space: break-spaces;
  }

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
</style>
