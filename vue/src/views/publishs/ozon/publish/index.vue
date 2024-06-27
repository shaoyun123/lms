<template>
  <!-- ozon刊登页面 -->
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="ozonData.formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="ozonData.formData.orgId"
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
            v-model="ozonData.formData.salePersonId"
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
            ref="ozonStoreAcctRef"
            v-model="ozonData.formData.storeAcctId"
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
            v-model="ozonData.formData.cateName"
            :options="ozonData.initFormData.oaList"
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
        <el-form-item label="物流属性" prop="existLogisAttrs">
          <!-- <el-select
            v-model="ozonData.formData.includeLogisAttrListType"
            class="form_left"
          >
            <el-option :value="1" label="物流属性与"></el-option>
            <el-option :value="2" label="物流属性或"></el-option>
          </el-select> -->
          <el-select
            v-model="ozonData.formData.existLogisAttrs"
            placeholder="请选择"
            :class="
              ozonData.formData.existLogisAttrs.length > 1 ? 'hideTag' : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="ozonData.formData.existLogisAttrs.length > 1"
                type="info"
                >已选{{ ozonData.formData.existLogisAttrs.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in ozonData.initFormData.logisAttr"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开发专员" prop="bizzOwner">
          <el-select
            v-model="ozonData.formData.bizzOwner"
            :class="ozonData.formData.bizzOwner.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="ozonData.formData.bizzOwner.length > 1" type="info"
                >已选{{ ozonData.formData.bizzOwner.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in ozonData.initFormData.bizzOwnerIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="在售状态" prop="isSale">
          <el-select v-model="ozonData.formData.isSale" clearable>
            <el-option :value="true" label="在售" />
            <el-option :value="false" label="停售" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁售" prop="isListingAble">
          <el-select v-model="ozonData.formData.isListingAble" clearable>
            <el-option :value="1" label="非禁售" />
            <el-option :value="0" label="禁售" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === '-1'"
          label="生成情况"
          prop="generateStatus"
        >
          <el-select v-model="ozonData.formData.generateStatus">
            <el-option :value="0" label="未生成" />
            <el-option :value="1" label="已生成" />
          </el-select>
        </el-form-item>
        </el-form-item> -->
        <el-form-item prop="tortBanListings" label="侵权状态"
          ><el-select
            v-model="ozonData.formData.tortBanListings"
            placeholder="请选择"
            filterable
            clearable
          >
            <!-- <el-option label="任一平台侵权不可刊登" value="ANY_PLAT" />
            <el-option label="该平台侵权不可刊登" value="CURRENT_PLAT" />
            <el-option label="全部" value="ALL" /> -->
            <el-option label="所有平台不侵权" value="ANY_PLAT" />
            <el-option v-if="activeKey == '-1'" label="ozon不侵权" value="2" />
            <el-option v-if="activeKey == '-1'" label="ozon侵权" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="timeType">
          <el-select v-model="ozonData.formData.timeType" class="form_left">
            <el-option
              v-if="activeKey == '-1' || activeKey == '0'"
              :value="3"
              label="基础模板审核时间"
            />
            <el-option
              v-if="activeKey == '-1' || activeKey == '0'"
              :value="4"
              label="ozon模板创建时间"
            />
            <el-option
              v-if="activeKey === '0'"
              :value="1"
              label="店铺商品生成时间"
            />
            <el-option
              v-if="activeKey === '1' || activeKey == '2' || activeKey == '3'"
              :value="1"
              label="生成时间"
            />
            <el-option
              v-if="activeKey === '1' || activeKey == '2' || activeKey == '3'"
              :value="2"
              label="刊登时间"
            />
          </el-select>
          <el-date-picker
            v-model="ozonData.formData.time"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            type="daterange"
            unlink-panels
            style="width: 200px"
            class="form_right"
          />
        </el-form-item>
        <el-form-item prop="sortTypes" label="排序方式">
          <el-select
            v-model="ozonData.formData.sortTypes"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-if="activeKey !== '-1'"
              label="店铺商品生成时间"
              value="[1, 2]"
            ></el-option>
            <el-option
              v-if="activeKey === '1' || activeKey === '2' || activeKey === '3'"
              label="刊登时间"
              value="[3, 4]"
            ></el-option>
            <el-option label="全平台30天销量" value="[5, 6]"></el-option>
            <el-option label="全平台15天销量" value="[7, 8]"></el-option>
            <el-option label="全平台7天销量" value="[9, 22]"></el-option
            ><el-option
              v-if="activeKey === '0'"
              label="基础模板审核时间"
              value="[10, 11]"
            ></el-option>
            <el-option
              v-if="activeKey === '-1'"
              label="ozon模板创建时间"
              value="[14, 15]"
            ></el-option>
            <el-option
              label="全平台30天俄罗斯销量"
              value="[16, 17]"
            ></el-option>
            <el-option
              label="全平台15天俄罗斯销量"
              value="[18, 19]"
            ></el-option>
            <el-option label="全平台7天俄罗斯销量" value="[20, 21]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sortByType">
          <el-select v-model="ozonData.formData.sortByType" filterable>
            <el-option label="正序" :value="1" />
            <el-option label="倒序" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="skuType">
          <el-select v-model="ozonData.formData.skuType" class="form_left">
            <el-option :value="1" label="父SKU" />
            <el-option :value="2" label="子SKU" />
          </el-select>
          <el-input
            v-model="ozonData.formData.skus"
            placeholder="多个逗号隔开"
            style="width: 270px !important"
            class="form_left form_right"
          />
          <el-select
            v-model="ozonData.formData.skuSearchType"
            class="form_right WH80"
          >
            <el-option :value="1" label="精确" />
            <el-option :value="2" label="模糊" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          v-if="activeKey == '2'"
          prop="errorMessage"
          label="失败原因"
        >
          <el-input v-model="ozonData.formData.errorMessage" />
        </el-form-item> -->
        <el-form-item v-if="activeKey == 2" prop="errorMessage" label="失败原因"
          ><el-select
            v-model="ozonData.formData.errorMessage"
            placeholder="请选择"
            allow-create
            filterable
            clearable
          >
            <el-option
              v-for="(val, key) in failReasonList"
              :key="key"
              :label="key"
              :value="val"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey == '1' || activeKey == '3' || activeKey == '2'"
          prop="submitId"
          label="提交人"
        >
          <el-select v-model="ozonData.formData.submitId" filterable clearable>
            <el-option
              v-for="item in ozonData.initFormData.submitIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey == '-1' || activeKey == '0'"
          prop="isPublish"
          label="刊登情况"
        >
          <el-select v-model="ozonData.formData.isPublish" filterable clearable>
            <el-option label="未刊登" :value="false" />
            <el-option label="已刊登" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === '-1'"
          label="生成情况"
          prop="generateStatus"
        >
          <el-select v-model="ozonData.formData.generateStatus">
            <el-option :value="0" label="未生成" />
            <el-option :value="1" label="已生成" />
          </el-select>
        </el-form-item>
        <el-form-item prop="preAvailableStockType">
          <el-select
            v-model="ozonData.formData.preAvailableStockType"
            class="form_left"
          >
            <el-option :value="1" label="预计可用库存含在途" />
            <el-option :value="2" label="预计可用库存不含在途" />
          </el-select>
          <el-select
            v-model="ozonData.formData.preAvailableAllSku"
            class="form_left form_right"
            style="width: 100px"
          >
            <el-option :value="false" label="部分属性" />
            <el-option :value="true" label="全部属性" />
          </el-select>
          <el-input
            v-model="ozonData.formData.preAvailableStockMin"
            style="width: 125px !important"
            class="form_left form_right"
          />

          <el-input
            v-model="ozonData.formData.preAvailableStockMax"
            style="width: 125px"
            class="form_right"
          />
        </el-form-item>
        <el-form-item class="form_range" prop="weightMin" label="重量(g)">
          <el-input v-model="ozonData.formData.weightMin" clearable></el-input>
          <div class="range_link">-</div>
          <el-input v-model="ozonData.formData.weightMax" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="activeKey === '2'" prop="allFail" label="失败数量">
          <el-select v-model="ozonData.formData.allFail" clearable>
            <el-option :value="true" label="全部失败" />
            <el-option :value="false" label="部分失败" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === '-1' || activeKey === '0'"
          label="平台类目"
          prop="platCateIdLists"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="ozonData.formData.platCateIdLists"
            :options="ozonData.initFormData.ozonList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'cnName',
              children: 'children',
              value: 'categoryId'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-if="activeKey === '-1'"
          label="在售状态"
          prop="isSaleList"
        >
          <el-select
            v-model="ozonData.formData.isSaleList"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <el-option :value="0" label="全部停售" />
            <el-option :value="1" label="部分在售" />
            <el-option :value="2" label="全部在售" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === '-1'"
          label="商品名"
          prop="productName"
        >
          <el-input v-model="ozonData.formData.productName" />
        </el-form-item>
        <el-form-item
          v-if="activeKey === '-1'"
          label="平台刊登状态"
          prop="platOnSale"
        >
          <el-select v-model="ozonData.formData.platOnSale" clearable>
            <el-option :value="true" label="已刊登" />
            <el-option :value="false" label="未刊登" />
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
          <!-- :scroll-y="{ gt: 10 }" -->
          <vxe-table
            ref="tableDataRef"
            :data="tableData"
            :show-overflow="true"
            :height="height"
            :column-config="{ resizable: true }"
            border
            @resizable-change="resizableChange"
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="图片" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.image" />
              </template>
            </vxe-column>
            <vxe-column
              field="englishTitle"
              :title="activeKey == '-1' ? '英文标题/商品名' : '刊登标题/商品名'"
              :min-width="OZON_PUBLISH['englishTitle'] || 200"
            >
              <template #default="{ row }">
                <TooltipText
                  :text="row.englishTitle"
                  :init-tool-field="initTool.englishTitle"
                />
                <TooltipText
                  :text="'商品名：' + row.productName"
                  :init-tool-field="'商品名：' + initTool.englishTitle"
                />
              </template>
            </vxe-column>
            <vxe-column
              field="bizOwer"
              title="业绩归属人"
              :width="OZON_PUBLISH['bizOwer'] || 120"
            >
              <template #default="{ row }">
                <TooltipText
                  :text="'开发：' + row.bizOwer"
                  :init-tool-field="'开发：' + initTool.bizOwer"
                />
                <TooltipText
                  :text="'责任：' + row.responsor"
                  :init-tool-field="'责任：' + initTool.bizOwer"
                />
              </template>
            </vxe-column>
            <vxe-column
              field="sale7"
              title="销量7/15/30"
              :width="OZON_PUBLISH['sale7'] || 140"
            >
              <template #default="{ row }">
                俄罗斯：{{ row.russiaSale7 }}/{{ row.russiaSale15 }}/{{
                  row.russiaSale30
                }}<br />
                公司：{{ row.sale7 }}/{{ row.sale15 }}/{{ row.sale30 }}
              </template>
            </vxe-column>
            <!-- <vxe-column
              field="sale7"
              title="全平台销量"
              :width="OZON_PUBLISH['sale7'] || 120"
            >
              <template #default="{ row }">
                7天：{{ row.sale7 }}<br />
                15天：{{ row.sale15 }}<br />
                30天：{{ row.sale30 }}
              </template>
            </vxe-column>
            <vxe-column
              v-if="activeKey == '-1' || activeKey == '0' || activeKey == '2'"
              field="russiaSale7"
              title="全平台俄罗斯销量"
              :width="OZON_PUBLISH['russiaSale7'] || 120"
            >
              <template #default="{ row }">
                7天：{{ row.russiaSale7 || 0 }}<br />
                15天：{{ row.russiaSale15 || 0 }}<br />
                30天：{{ row.russiaSale30 || 0 }}
              </template>
            </vxe-column> -->
            <vxe-column field="prodPSku" title="父SKU" min-width="150">
              <template #default="{ row }">
                <div
                  v-if="activeKey == '-1'"
                  @click="openPskuDetails(row.prodPId)"
                >
                  <span>商品父SKU：</span>
                  <span style="color: #409eff">{{ row.parentSKU }}</span>
                </div>
                <div v-else>
                  <span>店铺父SKU：</span>
                  <span style="color: #409eff">{{ row.parentSKU }}</span>
                </div>
                <el-tag v-if="activeKey == '1'" type="success">已</el-tag>
              </template>
            </vxe-column>
            <!-- :width="
                activeKey == '-1' || activeKey == '1' || activeKey == '3'
                  ? 600
                  : 710
              " -->
            <vxe-column :width="600">
              <template #header>
                <div style="display: flex; justify-content: space-around">
                  <div v-if="activeKey == '-1'" style="width: 120px">
                    基础模板子SKU
                  </div>
                  <div v-if="activeKey != '-1'" style="width: 130px">
                    店铺子SKU
                  </div>
                  <div style="width: 100px">颜色</div>
                  <div style="width: 100px">尺寸</div>
                  <div style="width: 100px">款式</div>
                  <div style="width: 50px">在售</div>
                  <div v-if="activeKey != '-1'" style="width: 100px">
                    促销价({{ currency }})
                  </div>
                  <div
                    v-if="
                      activeKey == '-1' || activeKey == '0' || activeKey == '2'
                    "
                    style="width: 100px"
                  >
                    预计可用库存含在途/不含在途
                  </div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  :data="
                    row.detailList && row.detailList.slice(0, row.displayCount)
                  "
                  :show-header="false"
                >
                  <vxe-column field="subSku" width="128">
                    <template #default="{ row: sonRow }">
                      {{ sonRow.subSku }}
                      <el-tooltip
                        v-if="activeKey == '2' && sonRow.listingStatus == 2"
                        effect="dark"
                        :content="sonRow.listingRespMsg"
                        placement="top-start"
                      >
                        <el-tag
                          type="danger"
                          @click="copy(sonRow.listingRespMsg)"
                          >败</el-tag
                        ></el-tooltip
                      >
                      <el-tag
                        v-if="activeKey == '2' && sonRow.listingStatus == 1"
                        type="success"
                        >已</el-tag
                      >
                    </template></vxe-column
                  >
                  <vxe-column field="color" width="100" />
                  <vxe-column field="size" width="100" />
                  <vxe-column field="style" width="100" />
                  <vxe-column field="onSale" width="50"
                    ><template #default="{ row: sonRow }">{{
                      sonRow.onSale ? '是' : '否'
                    }}</template>
                  </vxe-column>
                  <vxe-column
                    v-if="activeKey != '-1'"
                    field="promotionPrice"
                  ></vxe-column>
                  <vxe-column
                    v-if="
                      activeKey == '-1' || activeKey == '0' || activeKey == '2'
                    "
                    width="100"
                    ><template #default="{ row: sonRow }"
                      >{{ sonRow.preAvailableStockAll || 0 }}/{{
                        sonRow.preAvailableStock || 0
                      }}</template
                    ></vxe-column
                  >
                </vxe-table>
                <div
                  v-if="row.detailList"
                  :class="[row.detailList.length <= 3 ? 'hideBtn' : '']"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a v-if="row.detailList" style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >
            <vxe-column
              v-if="activeKey == '-1'"
              field="listingStoreNum"
              title="刊登店铺数"
              :width="OZON_PUBLISH['listingStoreNum'] || 70"
            />
            <vxe-column
              v-if="activeKey == '-1'"
              field="isListingAble"
              title="侵权状态"
              width="80"
            >
              <template #default="{ row }">
                <el-checkbox
                  :checked="row.isListingAble == false"
                  @change="isListingAbleFunc($event, row)"
                  >禁售</el-checkbox
                >
                <div class="disabledDiv">
                  <el-checkbox disabled :checked="row.isSmtTort"
                    >smt</el-checkbox
                  >
                  <el-checkbox disabled :checked="row.isJoomTort"
                    >joom</el-checkbox
                  >
                </div>
              </template>
            </vxe-column>
            <vxe-column
              title="时间"
              field="auditTime"
              :width="OZON_PUBLISH['auditTime'] || 230"
            >
              <template #default="{ row }">
                <div v-if="activeKey == '-1'">
                  <TooltipText
                    :text="`基础模板审核：${
                      row.auditTime
                        ? parseTime(row.auditTime, '{y}-{m}-{d}')
                        : ''
                    }`"
                    :init-tool-field="`基础模板审核：${
                      row.auditTime
                        ? parseTime(row.auditTime, '{y}-{m}-{d}')
                        : ''
                    }`"
                  />
                  <TooltipText
                    :text="`ozon模板创建：${
                      row.createTime
                        ? parseTime(row.createTime, '{y}-{m}-{d}')
                        : ''
                    }`"
                    :init-tool-field="`ozon模板创建：${
                      row.createTime
                        ? parseTime(row.createTime, '{y}-{m}-{d}')
                        : ''
                    }`"
                  />
                </div>
                <div v-if="activeKey == '0'">
                  <TooltipText
                    :text="`基础模板审核：${
                      row.auditTime
                        ? parseTime(row.auditTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                    :init-tool-field="`基础模板审核：${
                      row.auditTime
                        ? parseTime(row.auditTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                  />
                  <TooltipText
                    :text="`ozon模板创建：${
                      row.ozonCreateTime
                        ? parseTime(row.ozonCreateTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                    :init-tool-field="`ozon模板创建：${
                      row.ozonCreateTime
                        ? parseTime(row.ozonCreateTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                  />
                  <TooltipText
                    :text="`店铺商品生成：${
                      row.createTime
                        ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                    :init-tool-field="`店铺商品生成：${
                      row.createTime
                        ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                  />
                </div>
                <div
                  v-if="
                    activeKey == '3' || activeKey == '1' || activeKey == '2'
                  "
                >
                  <TooltipText
                    :text="`店铺商品生成：${
                      row.createTime
                        ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                    :init-tool-field="`店铺商品生成：${
                      row.createTime
                        ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                  />
                  <TooltipText
                    v-if="row.listingTime"
                    :text="`刊登：${
                      row.listingTime
                        ? parseTime(row.listingTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                    :init-tool-field="`刊登：${
                      row.listingTime
                        ? parseTime(row.listingTime, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                  />
                </div>
                <div v-if="activeKey == '3' && row.listTiming">
                  <TooltipText
                    :text="`定时刊登：${
                      row.listTiming
                        ? parseTime(row.listTiming, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                    :init-tool-field="`定时刊登：${
                      row.listTiming
                        ? parseTime(row.listTiming, '{y}-{m}-{d} {h}:{i}')
                        : ''
                    }`"
                  />
                </div> </template
            ></vxe-column>
            <vxe-column
              v-if="activeKey == '3' || activeKey == '1' || activeKey == '2'"
              title="提交人"
              :width="OZON_PUBLISH['submitter'] || 80"
              field="submitter"
            ></vxe-column>
            <vxe-column
              v-if="
                activeKey == '0' ||
                activeKey == '3' ||
                activeKey == '1' ||
                activeKey == '2'
              "
              title="操作"
              width="80"
              ><template #default="{ row }">
                <el-button type="primary" @click="getDetail(row)"
                  >详情</el-button
                >
              </template></vxe-column
            >
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
        <el-button v-if="activeKey == '-1'" type="primary" @click="getListing"
          >生成店铺商品</el-button
        >
        <el-button v-if="activeKey == '0'" type="primary" @click="publish"
          >立即刊登</el-button
        >
        <el-button v-if="activeKey == '0'" type="primary" @click="publishTime"
          >定时刊登</el-button
        >
        <el-button v-if="activeKey == '3'" type="primary" @click="cancelPublish"
          >取消定时刊登</el-button
        >
        <!-- <el-button v-if="activeKey == '0'" type="primary" @click="exportListing"
          >导出店铺商品</el-button
        > -->
        <el-button
          v-if="activeKey == '0' || activeKey == '2'"
          type="danger"
          @click="deleteListing"
          >删除店铺商品</el-button
        >
        <el-button v-if="activeKey == '2'" type="primary" @click="publish"
          >重新刊登</el-button
        >
      </div>
    </el-card>
    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :cate-search-value="ozonData.formData.cateSearchValue"
      :handle-cate-dialog-type="'oa'"
      @close-dialog="handleCateDialogClose($event)"
    />

    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />

    <!-- 刊登详情 -->
    <DetailDialog
      v-if="publishVisible"
      :id="rowId"
      :show-dialog="publishVisible"
      :tab-name="ozonData.formData.listingStatus"
      @handle-search="handleSearch"
      @close-dialog="closeDialog"
    />

    <!-- 定时刊登 -->
    <el-dialog
      v-model="showDialogPublishNow"
      width="40%"
      title="定时刊登"
      :close-on-click-modal="false"
    >
      <el-form
        v-loading="publishLoad"
        size="default"
        status-icon
        :label-width="180"
      >
        <el-form-item label="定时刊登开始时间" required>
          <el-date-picker
            v-model="listingTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="predictAogTimeDisableDate"
            type="datetime"
            style="width: 200px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleEditDialog()">确定</el-button>
        <el-button @click="showDialogPublishNow = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="publishsozonpublish">
  import { ref, reactive, onMounted, computed, nextTick } from 'vue';
  import { shortcuts } from '@/api/common';
  import { parseTime, copy } from '@/utils/common';
  import {
    queryOaNewCategory,
    getProdTagListApi,
    getLogisListApi,
    getDevTypeListApi,
    getListuserbyrole,
    getPlatCategoryTreeApi,
    editOrAddProdProhibitMapping,
    getModelCreatorList
  } from '@/api/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import CateDialog from '@/components/CateDialog.vue';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import DetailDialog from './components/DetailDialog.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import {
    ozonPublishListing,
    saveOzonListing,
    deleteOzonListing,
    queryOzonList,
    ozonUpdateListingTiming,
    cancelListingTiming,
    getOzonListingSubmiters
  } from '@/api/publishs/ozonpublish';
  import { failReasonList } from './enum';
  import TooltipText from '@/components/TooltipText.vue';
  // import { transBlob } from '@/utils/downloadFile';

  const ozonData = reactive({
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
      pageSize: 50,
      orgId: '', // 部门
      salePersonId: '', // 销售员
      platCateIdLists: [],
      //店铺Id，必选
      storeAcctId: '',
      listingStatus: '-1', // (0, "待刊登"),(1, "刊登成功"),(2, "刊登失败"),(3, "刊登中"),
      skus: '',
      skuType: 1,
      skuSearchType: 1,
      cateIdList: [],
      // 刊登情况
      isPublish: false,
      preAvailableStockType: 1,
      preAvailableAllSku: true,
      //生成情况
      generateStatus: 0, // 0: 未生成；1：已生成
      //物流属性
      // includeLogisAttrListType: 1,
      existLogisAttrs: [],
      //开发专员
      bizzOwner: [],
      //侵权状态
      tortBanListings: '2',
      timeType: 3,
      sortByType: 0,
      time: [], //  时间
      startDate: '',
      endDate: '',
      sortTypes: '[16, 17]',
      //OA新类目
      cateOaId: '',
      whStockSearchType: 'preAvailableStockAll',
      whStockBegin: '',
      whStockEnd: '',
      isSale: true,
      isSaleList: [], // 在售状态
      isListingAble: 1
    }
  });

  // tab list
  const tabList = ref([
    { label: '商品', count: '', status: '-1', index: 0 },
    { label: '待刊登', count: '', status: '0', index: 1 },
    { label: '刊登中', count: '', status: '3', index: 2 },
    { label: '刊登成功', count: '', status: '1', index: 3 },
    { label: '刊登失败', count: '', status: '2', index: 4 }
  ]);
  const activeKey = ref('-1');

  let OZON_PUBLISH = {};
  onMounted(async () => {
    OZON_PUBLISH = JSON.parse(localStorage.getItem('OZON_PUBLISH')) || {};
    // 部门
    // getPaymentsList();
    // 销售员
    getDepartmentList();
    // 店铺
    getStoreList();
    Promise.all([
      getProdTagListApi(),
      getLogisListApi(),
      getDevTypeListApi(),
      getModelCreatorList(),
      getListuserbyrole(),
      queryOaNewCategory(),
      getOzonListingSubmiters(),
      getPlatCategoryTreeApi('ozon')
    ])
      .then((res) => {
        // 商品标签
        ozonData.initFormData.prodAttrList = res[0].data.map(
          (item) => item.name
        );
        //物流属性
        ozonData.initFormData.logisAttr = res[1].data.map((item) => item.name);
        //开发类型
        ozonData.initFormData.devTypeList = res[2].data.map(
          (item) => item.name
        );
        //开发专员
        ozonData.initFormData.bizzOwnerIdList = res[4].data.map((item) => ({
          value: item.id,
          label: item.userName
        }));
        //OA新类目
        ozonData.initFormData.oaList = JSON.parse(res[5].data);
        // 提交人
        ozonData.initFormData.submitIdList = res[6].data.map((item) => ({
          value: item.id,
          label: item.userName
        }));
        // 平台类目
        ozonData.initFormData.ozonList = res[7].data;
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
    return clientHeight - 250;
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
    ozonData.formData.cateName = e.cate.value.fullCateName;
    ozonData.formData.cateOaId = e.cate.value.categoryId;
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
    ozonData.formData.cateOaId = '';
    ozonData.formData.cateIdList = [];
    ozonData.formData.skus = '';
    ozonData.formData.skuSearchType = 1;
    ozonData.formData.time = [];
    ozonData.formData.existLogisAttrs = [];
    ozonData.formData.bizzOwner = [];
    ozonData.formData.bizzOwnerId = '';
    ozonData.formData.timeType = activeKey.value === '-1' ? 3 : 1;
    ozonData.formData.preAvailableStockMin = '';
    ozonData.formData.preAvailableStockMax = '';
    ozonData.formData.weightMax = '';
  };

  const handleClick = (tab) => {
    ozonData.formData.listingStatus = Number(tab.props.name);
    ozonData.formData.page = 1;
    if (tab.props.name === '-1' && activeKey.value !== tab.props.name) {
      ozonData.formData.timeType = 3;
      ozonData.formData.tortBanListings = '2';
    } else if (tab.props.name === '0' && activeKey.value !== tab.props.name) {
      ozonData.formData.timeType = 1;
    } else if (tab.props.name === '2' && activeKey.value !== tab.props.name) {
      // ozonData.formData.sortType = 16;
    } else if (
      tab.props.name !== '-1' &&
      tab.props.name !== '0' &&
      activeKey.value !== tab.props.name
    ) {
      ozonData.formData.timeType = 2;
    }
    // 非商品页签
    if (tab.props.name !== '-1') {
      ozonData.formData.isSaleList = [];
      ozonData.formData.productName = '';
      ozonData.formData.platOnSale = '';

      ozonData.formData.tortBanListings = 'ANY_PLAT';
    }
    // 切换页签，排序默认全平台俄罗斯30天销量倒序
    if (activeKey.value !== tab.props.name) {
      ozonData.formData.sortTypes = '[16, 17]';
      ozonData.formData.sortByType = 0;
    }
    onSubmit();
  };

  // 是否禁售
  const isListingAbleFunc = async (e, row) => {
    try {
      let { code } = await editOrAddProdProhibitMapping({
        prodPId: row.prodPId,
        platCode: 'ozon',
        ifFixedInable: e
      });
      if (code == '0000') {
        ElMessage.success('修改成功');
      }
    } catch (err) {
      row.isListingAble = !e;
    }
  };

  // 店铺币种
  const currency = ref();
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 提交查询
  const onSubmit = async () => {
    tableData.value = null;
    ozonData.formData.page = currentPage.value;
    ozonData.formData.pageSize = limit.value;
    if (ozonData.formData.time?.length > 0) {
      ozonData.formData.startDate = ozonData.formData.time[0] + ' 00:00:00';
      ozonData.formData.endDate = ozonData.formData.time[1] + ' 23:59:59';
    } else {
      ozonData.formData.startDate = '';
      ozonData.formData.endDate = '';
    }

    ozonData.formData.bizzOwnerId = ozonData.formData.bizzOwner.join();
    if (!ozonData.formData.storeAcctId) {
      return ElMessage.warning('请选择店铺');
    }

    tableDataLoading.value = true;
    if (ozonData.formData.cateName?.length > 0) {
      ozonData.formData.cateIdList = [];
      ozonData.formData.cateName.forEach((item) => {
        ozonData.formData.cateIdList.push(item[item.length - 1]);
      });
    } else {
      ozonData.formData.cateIdList = [];
    }

    if (
      ozonData.formData.platCateIdLists &&
      ozonData.formData.platCateIdLists.length != 0
    ) {
      ozonData.formData.platCateIdList = [];
      ozonData.formData.platCateIdLists.forEach((item) => {
        ozonData.formData.platCateIdList.push(item[item.length - 1]);
      });
    } else {
      ozonData.formData.platCateIdList = [];
    }

    // 侵权状态，选择ozon侵权/不侵权，使用tortPlat字段，选择所有平台不侵权，使用tortBanListing
    let tortPlat = '',
      tortBanListing = '';
    if (
      ozonData.formData.listingStatus == '-1' &&
      (ozonData.formData.tortBanListings == 1 ||
        ozonData.formData.tortBanListings == 2)
    ) {
      tortPlat = ozonData.formData.tortBanListings;
    } else {
      tortBanListing = ozonData.formData.tortBanListings;
    }

    // 排序
    let sortType =
      ozonData.formData.sortTypes &&
      JSON.parse(ozonData.formData.sortTypes)[ozonData.formData.sortByType];

    const { data, code, count } = await queryOzonList({
      ...ozonData.formData,
      tortPlat,
      tortBanListing,
      sortType,
      storeAcctIdList: [ozonData.formData.storeAcctId]
    });
    tableDataLoading.value = false;
    if (code == '0000') {
      data?.forEach((item) => {
        item.displayCount = 3;
      });
      tableData.value = data;
      currency.value = data ? data[0]?.currency : '';
    }
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
  const publishVisible = ref(false);
  const rowId = ref(-1);
  const getDetail = async (row) => {
    rowId.value = row.id;
    // 待刊登&刊登失败支持修改
    // ozonData.formData.listingStatus == 2 ||
    // ozonData.formData.listingStatus == 0
    publishVisible.value = true;
  };
  const closeDialog = () => {
    publishVisible.value = false;
  };

  const selectRecords = ref([]);
  // 获取复选框选中的数据;
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = tableDataRef.value;
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
  // 生成店铺商品
  const getListing = async () => {
    if (getSelectedList()) {
      try {
        tableDataLoading.value = true;
        let list = [];
        selectRecords.value.forEach((item) => {
          list.push({
            prodPId: item.prodPId,
            pSku: item.parentSKU,
            storeAcctId: ozonData.formData.storeAcctId,
            modelPId: item.id,
            sInfo: {
              modelSIdList: item.detailList?.map((c) => c.subSku)
            },
            stock: 0
          });
        });
        const { code, data } = await saveOzonListing(list);
        tableDataLoading.value = false;
        if (code === '0000' && JSON.stringify(data) == '{}') {
          ElMessage.success('生成店铺商品成功！');
          onSubmit();
        } else {
          ElMessageBox.alert(
            `<div>${JSON.stringify(data)}</div>`,
            '部分失败，失败结果如下',
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确认'
            }
          );
        }
      } catch (err) {
        console.log(err);
        tableDataLoading.value = false;
      }
    }
  };
  // 立即刊登
  const publish = async () => {
    if (getSelectedList()) {
      const { code, data } = await ozonPublishListing({
        listingIdList: selectRecords.value.map((c) => c.id),
        listingType: '立即刊登',
        isAutoListing: false
      });
      if (code == '0000') {
        ElMessage.success('立即刊登成功！');
        onSubmit();
      } else {
        let errMsg = data?.join('');
        ElMessageBox.alert(`<div>${errMsg}</div>`, '操作结果', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确认'
        });
      }
    }
  };
  // 定时刊登
  let showDialogPublishNow = ref(false),
    listingTime = ref('');
  // 定时刊登开始时间 今天以及将来
  const predictAogTimeDisableDate = (time) => {
    return time.getTime() < Date.now() - 8.64e7;
  };
  const publishTime = () => {
    let checkedData = tableDataRef.value[1].getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return false;
    }
    listingTime.value = '';
    showDialogPublishNow.value = true;
  };
  const handleEditDialog = async () => {
    let checkedData = tableDataRef.value[1].getCheckboxRecords();
    let listingIdList = checkedData.map((item) => item.id);
    if (!listingTime.value) {
      ElMessage.warning('请选择定时刊登时间');
      return false;
    }
    const { code } = await ozonUpdateListingTiming({
      listingIdList,
      listingType: 'timing',
      listTiming: listingTime.value
    });
    if (code == '0000') {
      ElMessage.success('操作成功');
      showDialogPublishNow.value = false;
      onSubmit();
    }
    // publishLoad.value = false;
  };
  // 取消定时刊登
  const cancelPublish = async () => {
    let checkedData = tableDataRef.value[2].getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return false;
    }
    let idList = checkedData.map((item) => item.id);
    let formdata = new FormData();
    formdata.append('idList', idList);
    try {
      const { code, msg } = await cancelListingTiming(formdata);
      if (code == '0000') {
        ElMessage.success(msg);
        showDialogPublishNow.value = false;
        onSubmit();
      }
    } catch (err) {
      console.log(err);
    }
    // publishLoad.value = false;
  };

  // 删除店铺商品
  const deleteListing = () => {
    if (getSelectedList()) {
      let ids = selectRecords.value?.map((item) => item.id);
      ElMessageBox.confirm('确定要删除店铺商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'Warning'
      }).then(async () => {
        const { code, msg } = await deleteOzonListing(ids);
        if (code == '0000') {
          ElMessage.success(msg);
          onSubmit();
        }
      });
    }
  };

  const ozonStoreAcctRef = ref();
  // // 导出店铺商品
  // const exportListing = () => {
  //   if (getSelectedList()) {
  //     try {
  //       let ids = selectRecords.value?.map((item) => item.id);
  //       transBlob({
  //         url: '/lms/ozonListing/exportListingItems',
  //         contentType: 'application/json',
  //         data: {
  //           storeAcctId: ozonData.formData.storeAcctIdList,
  //           listingIdList: ids
  //         },
  //         fileName:
  //           ozonStoreAcctRef.value.query +
  //           '待刊登店铺商品' +
  //           Date.now() +
  //           '.xlsx'
  //       }).then(() => {
  //         ElMessage.success('导出成功');
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };

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
    row.displayCount = row.detailList.length;
  };
  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };

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
  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'ozon专员'
    };
    const { data } = await getDepartData(params);
    selectData.departData = data.orgTree;
    selectData.salersData = data.userList;
    salersDataCopy.value = data.userList;
  };
  // 获取店铺信息
  const getStoreList = async () => {
    let params = {
      roleNames: 'ozon专员',
      orgId: ozonData.formData.orgId,
      salePersonId: ozonData.formData.salePersonId,
      platCode: 'ozon'
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
    ozonData.formData.storeAcctId = '';
    getStoreList();
  };
  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    ozonData.formData.orgId = '';
    resetSearch();
  };
  // 清空销售人员以及店铺
  const resetSearch = () => {
    ozonData.formData.salePersonId = '';
    ozonData.formData.storeAcctId = '';
    getStoreList();
  };
  //  部门-销售员-店铺联动 -- end

  const initTool = ref({});
  function resizableChange({ column }) {
    if (column.resizeWidth < column.width) {
      initTool.value[column.field] = true;
    } else {
      initTool.value[column.field] = false;
    }
    OZON_PUBLISH[column.field] = column.resizeWidth;
    localStorage.setItem('OZON_PUBLISH', JSON.stringify(OZON_PUBLISH));
  }
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

  .disabledDiv {
    :deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
      background-color: var(--el-checkbox-checked-text-color);
      border-color: var(--el-checkbox-checked-text-color);
      cursor: not-allowed;
    }
    :deep(
        .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after
      ) {
      border-color: var(--el-checkbox-checked-icon-color);
    }
    :deep(.el-checkbox__input.is-disabled.is-checked + .el-checkbox__label) {
      color: var(--el-checkbox-checked-text-color);
    }
  }
</style>
<style>
  .sheinMallElMsg {
    --el-messagebox-width: 800px;
  }
</style>
