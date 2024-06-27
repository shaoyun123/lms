<template>
  <!-- AE全托管刊登页面 -->
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item
          label="店铺"
          prop="storeAcctIds"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.storeAcctIds"
            :options="initData.storeList"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="开发专员" prop="bizzOwnerId">
          <el-select
            v-model="formData.bizzOwnerId"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in initData.bizzOwnerList"
              :key="item.id"
              :label="item.loginName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchTypeKey">
          <el-select
            v-model="formData.searchTypeKey"
            class="form_left"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in MULTI_SEARCH_TYPE_ENUM"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="formData.searchTypeVal"
            class="large_width form_right mr10"
            placeholder="父子sku支持多个查询,英文逗号分割"
            clearable
          />
          <el-switch v-model="formData.isExactQuery" />
        </el-form-item>
        <el-form-item label="开发类型" prop="devType">
          <el-select
            v-model="formData.devType"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in initData.devTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态" prop="isSales">
          <MultiSelect
            v-model="formData.isSales"
            :option-obj="{
              optionList: ISSALES_LIST,
              label: 'label',
              value: 'value'
            }"
          />
        </el-form-item>
        <el-form-item label="侵权状态" prop="isSmtTort">
          <el-select v-model="formData.isSmtTort" clearable filterable>
            <el-option :value="true" label="SMT侵权" />
            <el-option :value="false" label="SMT不侵权" />
          </el-select>
        </el-form-item>
        <el-form-item label="禁售状态" prop="isProhibit">
          <el-select v-model="formData.isProhibit" clearable filterable>
            <el-option :value="true" label="禁售" />
            <el-option :value="false" label="非禁售" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成状态" prop="isListing">
          <el-select v-model="formData.isListing" clearable filterable>
            <el-option :value="true" label="已生成" />
            <el-option :value="false" label="未生成" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片状态" prop="imgStatusList">
          <MultiSelect
            v-model="formData.imgStatusList"
            :option-obj="{
              optionList: IMG_STATUS_LIST,
              label: 'label',
              value: 'value'
            }"
          />
        </el-form-item>
        <el-form-item prop="prodAttrList">
          <el-select v-model="formData.logisticsType" class="form_left">
            <el-option :value="1" label="物流属性与" />
            <el-option :value="2" label="物流属性或" />
          </el-select>
          <MultiSelect
            v-model="formData.logisAttrs"
            class="form_right"
            :option-obj="{
              optionList: initData.logisAttrList,
              label: 'name',
              value: 'value'
            }"
          />
        </el-form-item>
        <el-form-item prop="prodAttrList" label="商品标签">
          <el-select v-model="formData.prodAttrList" clearable filterable>
            <el-option
              v-for="item in initData.prodAttrList"
              :key="item.name"
              :value="item.name"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="SMT类目" prop="cateId" style="width: 220px">
          <el-button type="primary" @click="handleChooseCate"
            >选择类目</el-button
          >
          <el-icon class="ml10 gray_text" @click="handleDelCate"
            ><Delete
          /></el-icon>
        </el-form-item>
        <el-form-item prop="minWeight" label="重量" class="form_range">
          <ZInputNumber
            v-model="formData.minWeight"
            placeholder="请输入"
            clearable
          />
          <span class="range_link">-</span>
          <ZInputNumber
            v-model="formData.maxWeight"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item prop="orderByType" label="排序">
          <el-select
            v-model="formData.orderByType"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in ORDERBY_TYPE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <template v-if="listingStatus === -2">
          <el-form-item prop="tplCreatorId" label="模板创建人">
            <el-select
              v-model="formData.tplCreatorId"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in initData.tplCreatorList"
                :key="item.id"
                :label="item.loginName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="syncStatus" label="刊登状态">
            <el-select
              v-model="formData.syncStatus"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option :value="true" label="已刊登" />
              <el-option :value="false" label="未刊登" />
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item prop="listingCreatorId" label="刊登创建人">
            <el-select
              v-model="formData.listingCreatorId"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in initData.listingCreatorList"
                :key="item.creatorId"
                :label="item.creator"
                :value="item.creatorId"
              />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item prop="timeRangeKey">
          <el-select v-model="formData.timeRangeKey" class="form_left">
            <el-option value="baseModelAuditTime" label="审核时间" />
            <el-option value="baseModelCreateTime" label="基础模板创建时间" />
            <el-option value="smtModelCreateTime" label="速卖通模板创建时间" />
          </el-select>
          <el-date-picker
            v-model="formData.timeRangeVal"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            type="daterange"
            unlink-panels
            class="form_right"
          />
        </el-form-item>
        <el-form-item prop="usefulVideo" label="可用视频">
          <el-select v-model="formData.usefulVideo" clearable>
            <el-option :value="true" label="有" />
            <el-option :value="false" label="无" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listingStatus !== -2"
          prop="supplyPriceMin"
          label="供货价"
          class="form_range"
        >
          <ZInputNumber
            v-model="formData.supplyPriceMin"
            placeholder=""
            clearable
          />
          <span class="range_link">-</span>
          <ZInputNumber
            v-model="formData.supplyPriceMax"
            placeholder=""
            clearable
          />
        </el-form-item>
        <el-form-item prop="isIncludeStockAll" class="form_input_width">
          <el-select v-model="formData.isIncludeStockAll" class="form_left">
            <el-option :value="true" label="预计可用库存（含在途)" />
            <el-option :value="false" label="预计可用库存(不含在途)" />
          </el-select>
          <el-select v-model="formData.stockAttrType" class="form_left">
            <el-option :value="1" label="部分属性" />
            <el-option :value="2" label="全部属性" />
          </el-select>
          <ZInputNumber
            v-model="formData.stockMin"
            class="form_right"
            placeholder=">="
            clearable
          />
          <span class="range_link">-</span>
          <ZInputNumber
            v-model="formData.stockMax"
            placeholder="<="
            clearable
          />
        </el-form-item>
        <el-form-item
          prop="purchaseCostPriceMin"
          label="成本"
          class="form_range"
        >
          <ZInputNumber
            v-model="formData.purchaseCostPriceMin"
            oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')"
            :precision="1"
            clearable
          />
          <span class="range_link">-</span>
          <ZInputNumber
            v-model="formData.purchaseCostPriceMax"
            oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')"
            :precision="1"
            clearable
          />
        </el-form-item>
        <el-form-item prop="isAllStoreAcctNotPublish" label="全店铺刊登状态">
          <el-select v-model="formData.isAllStoreAcctNotPublish" clearable>
            <el-option :value="true" label="未刊登" />
            <el-option :value="false" label="已刊登" />
          </el-select>
        </el-form-item>
        <el-form-item prop="attrType" class="form_input_width">
          <el-select v-model="formData.attrType" class="form_left">
            <el-option :value="1" label="预计可售天数(部分属性)" />
            <el-option :value="2" label="预计可售天数(全部属性)" />
          </el-select>
          <ZInputNumber v-model="formData.minDays" placeholder=">=" clearable />
          <span class="range_link"> - </span>
          <ZInputNumber v-model="formData.maxDays" placeholder="<=" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="tableLoading"
            type="primary"
            @click="handleSearch(1)"
            >查询</el-button
          >
          <el-button @click="handleResetForm(formRef)">重置</el-button>
        </el-form-item>
        <div v-if="formData.cateTreeName" class="gray_text">
          {{ formData.cateTreeName }}
        </div>
      </el-form>
    </el-card>
    <el-card v-loading="tableLoading" class="card_position list_card">
      <el-tabs
        v-model="listingStatus"
        class="demo-tabs"
        @tab-click="handleClickTab"
      >
        <el-tab-pane
          v-for="item in listingStatusObj"
          :key="item.value"
          :label="item.label + '(' + item.total + ')'"
          :name="item.value"
        >
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn">
        <el-button
          v-permission="['aefullyhandleBatchCreate']"
          type="primary"
          @click="handleBatchCreate"
          >批量生成</el-button
        >
      </div>
      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <template #default_pImage="{ row }">
          <ImagePop :src="row.pImage" />
        </template>
        <template #default_title="{ row }">
          <span>{{ row.title }}</span>
          <el-tooltip
            v-if="
              (row.listingStatus === 1 || row.listingStatus === 2) &&
              row.videoFailReason
            "
            effect="dark"
            :content="row.videoFailReason"
            placement="top-start"
          >
            <el-tag type="danger" @click="copy(row.videoFailReason)"
              >败</el-tag
            ></el-tooltip
          >
        </template>
        <template #default_product="{ row }">
          <div v-if="row.devType == 1">[wish开发]</div>
          <div v-else-if="row.devType == 2">[供应商新品]</div>
          <div v-else-if="row.devType == 3">[eaby开发]</div>
          <div v-else-if="row.devType == 4">[smt开发]</div>
          <div v-else-if="row.devType == 5">[阿里销售产品]</div>
          <div v-else-if="row.devType == 6">[采集报考开发]</div>
          <span>{{ row.cnTitle }}</span>
          <el-tag v-if="row.isSupplierOrigiImg">供</el-tag>
          <el-tag v-else-if="row.selfImgStatus == 1" type="danger">自</el-tag>
          <el-tag v-else-if="showRefinedImgTag(row)" type="warning">精</el-tag>
          <div>
            <span class="gray_text">开发：</span>
            <span>{{ row.bizzOwner || '' }}</span>
          </div>
          <div>
            <span class="gray_text">SMT类目：:</span>
            <span>{{ row.cateTreeName || '' }}</span>
          </div>
          <div>
            <span class="gray_text">模板创建人：:</span>
            <span>{{ row.tplCreators || '' }}</span>
          </div>
        </template>
        <template #default_pSku="{ row }">
          <div>{{ row.pSku }}</div>
          <div>{{ row.prodAttrList }}</div>
          <div>${{ row?.minListingPrice }} ~ ${{ row?.maxListingPrice }}</div>
          <template v-if="row.logisAttrAliasList?.length">
            <el-tag
              v-for="elem in row.logisAttrAliasList"
              :key="elem"
              type="danger"
              class="mr10"
              >{{ elem }}</el-tag
            >
          </template>
        </template>
        <template #header_subList>
          <div class="aefh-theader">
            <div class="aefh-theader-th">subSKU</div>
            <div class="aefh-theader-th w80">重量(g)</div>
            <div class="aefh-theader-th w80">成本</div>
            <div class="w180">可用/在途/未派/预计可售天数</div>
            <div class="aefh-theader-th w80">在售</div>
          </div>
        </template>
        <template #default_subList="{ row }">
          <div v-if="row.subList?.length > 0">
            <div
              v-for="v in row.subList.slice(0, row.displayCount)"
              :key="v.id"
              class="aefh-tbody"
            >
              <div class="aefh-tbody-td">
                <span>{{ v.prodTempVarietyDto?.sSku }}</span>
                <el-tag v-if="v.syncStatus" type="success">已</el-tag>
                <el-tag
                  v-else-if="v.syncStatus?.toString() === 'false'"
                  type="warning"
                  >未</el-tag
                >
              </div>
              <div class="aefh-tbody-td w80">
                {{ v.prodTempVarietyDto?.weight }}
              </div>
              <div class="aefh-tbody-td w80">
                {{ v.prodTempVarietyDto?.cost }}
              </div>
              <div class="aefh-tbody-td w180">
                {{
                  v.prodTempVarietyDto?.stockNum ||
                  0 - v.prodTempVarietyDto?.reservationNum ||
                  0
                }}/{{ v.prodTempVarietyDto?.orderNotInNum }}/{{
                  v.prodTempVarietyDto?.lackUnPaiNum || 0
                }}/{{ v.prodTempVarietyDto?.predictSaleDay || 0 }}
              </div>
              <div class="aefh-tbody-td w80">
                <el-checkbox
                  :checked="v.prodTempVarietyDto?.isSale"
                  label="在售"
                  disabled
                  size="large"
                />
              </div>
            </div>
            <div v-if="row.subList?.length > 3" class="aefh-tbody">
              <el-button type="primary" text @click="showAllList(row)">
                {{ row.displayTxt }}({{ row.subList.length }})
              </el-button>
            </div>
          </div>
          <div v-else>无子数据</div>
        </template>
        <template #default_storeNum="{ row }">
          <span class="gray_text">刊登数: </span>
          <!-- todo -->
          <span>{{ row.storeNum || 0 }}</span>
        </template>
        <template #default_salesNum="{ row }">
          <div>
            <span class="gray_text">SMT: </span>
            <span>{{ row.smtSalesNum || 0 }}</span>
          </div>
          <div>
            <span class="gray_text">公司: </span>
            <span>{{ row.totalSalesNum || 0 }}</span>
          </div>
          <div>
            <span class="gray_text">竞品: </span>
            <!-- todo -->
            <span>{{ row.compSalesNum || 0 }}</span>
          </div>
        </template>
        <template #edit_saleNote="{ row }">
          <vxe-textarea
            v-model="row.saleNote"
            show-word-count
            @blur="changeSaleNote(row.saleNote, row.prodPId)"
          ></vxe-textarea>
        </template>
        <template #default_isTort="{ row }">
          <el-checkbox
            v-for="v in TORT_LIST_STATUS"
            :key="v.value"
            :checked="row[v.value]"
            :label="v.label"
            disabled
            size="large"
          />
        </template>
        <template #default_time="{ row }">
          <span class="gray_text">审核:</span>
          <div>
            {{ transferDate(row.auditTime) }}
          </div>
          <span class="gray_text">自拍图:</span>
          <div>
            {{ transferDate(row.selfImgTime) }}
          </div>
        </template>

        <template #default_bizzOwner="{ row }">
          <div v-if="row.bizzOwner">
            {{ row.bizzOwner }}>{{ row.storeAcct }}
          </div>
        </template>
        <template #default_toolbar="{ row }">
          <template v-if="listingStatus === -2">
            <!-- <el-button type="primary">查看模板</el-button> -->
            <el-button type="primary" @click="handlePublish(row)"
              >生成刊登</el-button
            >
          </template>
          <template v-else>
            <el-button type="primary" @click="handlePublish(row)"
              >详情</el-button
            >

            <template v-if="[0, 2].includes(row.listingStatus)">
              <el-button type="primary" @click="handlePublishNow(row)">{{
                row.listingStatus === 0 ? '立即刊登' : '重新刊登'
              }}</el-button>
              <el-button
                type="danger"
                :loading="row.delLoading"
                @click="handleDelListing(row)"
                >删除</el-button
              >
            </template>
            <template v-if="listingStatus === 3">
              <el-button
                type="warning"
                :loading="row.cancelOnTimeLoading"
                @click="handleCancelOnTime(row)"
              >
                取消定时刊登
              </el-button>
            </template>
          </template>
        </template>
        <template #default_publish_product="{ row }">
          <div v-if="row.devType == 1">[wish开发]</div>
          <div v-else-if="row.devType == 2">[供应商新品]</div>
          <div v-else-if="row.devType == 3">[eaby开发]</div>
          <div v-else-if="row.devType == 4">[smt开发]</div>
          <div v-else-if="row.devType == 5">[阿里销售产品]</div>
          <div v-else-if="row.devType == 6">[采集报考开发]</div>
          <span>{{ row.cnTitle }}</span>
          <el-tag v-if="row.isSupplierOrigiImg">供</el-tag>
          <el-tag v-else-if="row.selfImgStatus == 1" type="danger">自</el-tag>
          <el-tag v-else-if="showRefinedImgTag(row)" type="warning">精</el-tag>
        </template>
        <template #default_publish_prodPSku="{ row }">
          <div>
            <span
              style="color: #409eff"
              @click="hanldeOpenPskuDetails(row.prodPId)"
              >{{ row.prodPSku }}</span
            >
          </div>
        </template>
        <template #header_publish_subList>
          <div class="aefh-theader">
            <div class="aefh-theader-th">模板子SKU</div>
            <div class="aefh-theader-th">店铺子SKU</div>
            <div class="aefh-theader-th w60">颜色</div>
            <div class="aefh-theader-th w60">尺寸</div>
            <div class="aefh-theader-th w60">供货价(￥)</div>
            <div class="aefh-theader-th w60">在售</div>
          </div>
        </template>
        <template #default_publish_subList="{ row }">
          <div v-if="row.subList?.length > 0">
            <div
              v-for="v in row.subList.slice(0, row.displayCount)"
              :key="v.id"
              class="aefh-tbody"
            >
              <div class="aefh-tbody-td">
                <span v-if="v.prodSSku">{{ v.prodSSku }}</span>
                <span v-else class="gray_text">不存在</span>
                <el-tooltip
                  v-if="v.prodSSku && row.listingStatus === 2"
                  effect="dark"
                  :content="row.listingRespMsg"
                  placement="top-start"
                >
                  <el-tag type="info" @click="copy(row.listingRespMsg)"
                    >败</el-tag
                  >
                </el-tooltip>
                <el-tag
                  v-else-if="v.prodSSku && row.listingStatus === 0"
                  type="warning"
                  >待</el-tag
                >
                <el-tag
                  v-else-if="v.prodSSku && row.listingStatus === 1"
                  type="success"
                  >成</el-tag
                >
                <el-tag v-if="v.prodSSku && row.listingStatus === 3">中</el-tag>
              </div>
              <div class="aefh-tbody-td">
                {{ v.storeSSku }}
              </div>
              <div class="aefh-tbody-td w60">
                {{ v.prodTempVarietyDto?.color }}
              </div>
              <div class="aefh-tbody-td w60">
                {{ v.prodTempVarietyDto?.size }}
              </div>
              <div class="aefh-tbody-td w60">
                {{ v.supplyPriceCny }}
              </div>
              <div class="aefh-tbody-td w60">
                <div v-if="v.prodTempVarietyDto?.isSale !== undefined">
                  <span
                    :class="v.prodTempVarietyDto?.isSale ? '' : 'gray_text'"
                    >{{ v.prodTempVarietyDto?.isSale ? '在售' : '停售' }}</span
                  >
                </div>
              </div>
            </div>
            <div v-if="row.subList?.length > 3" class="aefh-tbody">
              <el-button type="primary" text @click="showAllList(row)">
                {{ row.displayTxt }}({{ row.subList.length }})
              </el-button>
            </div>
          </div>
          <div v-else>无子数据</div>
        </template>
        <template #default_publish_salesNum="{ row }">
          <div>7日:{{ row.saleNumAliexpressSeven }}</div>
          <div>15日:{{ row.saleNumAliexpressFifteen }}</div>
          <div>30日:{{ row.saleNumAliexpressThirty }}</div>
        </template>
        <template #default_publish_time="{ row }">
          <div v-if="row.createTime">
            <span class="gray_text">创建:</span>
            <div>
              {{ transferDate(row.createTime) }}
            </div>
          </div>
          <div>
            <div v-if="row.listTiming">
              <span class="gray_text">定时刊登:</span>
              <div>
                {{ transferDate(row.listTiming) }}
              </div>
            </div>
          </div>
        </template>
      </vxe-grid>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[50, 100, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="common_batch_btns">
        <template v-if="listingStatus === 0">
          <el-button
            type="primary"
            :loading="batchPublishNowLoading"
            @click="handleBatchPublishNow"
            >立即刊登
          </el-button>
          <el-button type="primary" @click="handleBatchOnTime">
            定时刊登
          </el-button>
          <el-button
            type="danger"
            :loading="batchDelLoading"
            @click="handleBatchDel"
            >批量删除</el-button
          >
        </template>
        <template v-else-if="listingStatus === 3">
          <el-button
            type="warning"
            :loading="batchCancelOntimeLoading"
            @click="handleBatchCancelOnTime"
          >
            取消定时刊登
          </el-button>
        </template>
        <!-- <template v-else-if="listingStatus === 1">
          <div></div>
        </template> -->
        <template v-else-if="listingStatus === 2">
          <el-button
            type="primary"
            :loading="batchPublishNowLoading"
            @click="handleBatchPublishNow"
            >重新刊登
          </el-button>
          <el-button
            type="danger"
            :loading="batchDelLoading"
            @click="handleBatchDel"
            >批量删除</el-button
          >
        </template>
      </div>
    </el-card>
    <!-- 类目组件 -->
    <CateByDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :need-leaf="false"
      :get-cate-api="getSmtCateByApi"
      @close-dialog="handleCateDialogClose($event)"
    />
    <!-- 父sku -->
    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />
    <!-- 刊登详情 -->
    <DetailDialog
      v-model="publishVisible"
      :params="publishDialogParam"
      :row-list="rowList"
      :listing-status="listingStatus"
      :store-acct-id="curStoreAcctId"
      @handle-search="handleSearch"
    />
    <!-- 侵权提示 -->
    <TortBrand
      v-model="tortBrandVisible"
      :row-list="rowList"
      @handle-search="handleSearch"
    />
    <PublishOnTime
      v-model="publishOnTimeVisible"
      :row-list="rowList"
      @handle-search="handleSearch"
    />

    <!-- 批量生成 -->
    <BatchCreate
      v-model="handleBatchCreatedVisible"
      :checked-store-acc-id-list="storeAcctIdList"
      :checked-row-list="checkedRowList"
      @handle-search="handleSearch"
    />
  </div>
</template>

<script setup name="publishsaefullyhostedpublish">
  import { onMounted, reactive, ref, computed, nextTick, watch } from 'vue';
  import {
    getStoreList,
    getDevTypeListApi,
    shortcuts,
    getLogisListApi,
    getProdTagListApi,
    getListuserbyrole,
    getResultByBatchNoApi
  } from '@/api/common/index';
  import {
    getBizzOwnerList,
    getListingCreatorApi,
    queryListApi,
    updateSalenoteApi,
    delPublishInfoApi,
    publishNowApi,
    cancelTimingPublishNowApi
  } from '@/api/publishs/aefullyhostedpublish';
  import { getSmtCateByApi } from '@/api/publishs/aefullyhosted';
  import { transferDate, copy } from '@/utils/common';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import DetailDialog from './components/DetailDialog.vue';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import CateByDialog from '@/components/CateByStore/index.vue';
  import TortBrand from './components/TortBrand.vue';
  import PublishOnTime from './components/PublishOnTime.vue';
  import BatchCreate from './components/BatchCreate.vue';
  import { ElMessage } from 'element-plus';
  // 常量
  import {
    MULTI_SEARCH_TYPE_ENUM,
    IMG_STATUS_LIST,
    ISSALES_LIST,
    DEFAULT_FORMDATA,
    ORDERBY_TYPE_LIST,
    TORT_LIST_STATUS,
    TPL_COLUMNS,
    LISTING_COLUMNS
  } from './constants';
  import { cloneDeep, isEmpty } from 'lodash-es';

  // #region   表单 查询
  const listingStatus = ref(-2);
  const curStoreAcctId = ref();
  const listingStatusObj = ref([
    {
      label: '速卖通模板',
      total: 0,
      value: -2
    },
    {
      label: '待刊登',
      total: 0,
      value: 0
    },
    {
      label: '刊登中',
      total: 0,
      value: 3
    },
    {
      label: '刊登成功',
      total: 0,
      value: 1
    },
    {
      label: '刊登失败',
      total: 0,
      value: 2
    }
  ]);
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
    return clientHeight - 280;
  });
  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showOverflow: true,
    keepSource: true,
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
    toolbarConfig: {
      custom: false
    },
    editConfig: {
      trigger: 'click',
      mode: 'row',
      showStatus: true
    },
    columns: TPL_COLUMNS,
    data: []
  });
  const showRefinedImgTag = (row) => {
    if (row.mackRefineStatus) {
      if (row.selfImgStatus == 1 || row.selfImgStatus == 2) {
        return true;
      }
    }
    return false;
  };

  const formData = ref(cloneDeep(DEFAULT_FORMDATA));
  const formRef = ref();
  const tableLoading = ref(false);
  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.value = cloneDeep(DEFAULT_FORMDATA);
  };
  const getSearchData = () => {
    let obj = JSON.parse(JSON.stringify(formData.value));
    if (obj.storeAcctIds?.length) {
      // 模板查询用的是storeAcctId  是只能单个店铺查询
      // 其他页签用的是 storeAcctIds 可以多个店铺查询
      obj.storeAcctIds = storeAcctIdList.value;
      obj.storeAcctId = obj.storeAcctIds.join(',');
    }
    if (obj.timeRangeVal?.length) {
      obj[obj.timeRangeKey + 'From'] = new Date(
        obj.timeRangeVal[0] + ' 00:00:00'
      ).getTime();
      obj[obj.timeRangeKey + 'To'] = new Date(
        obj.timeRangeVal[1] + ' 23:59:59'
      ).getTime();
      delete obj.timeRangeKey;
      delete obj.timeRangeVal;
    }
    delete obj.timeRangeKey;
    delete obj.timeRangeVal;
    // 父SKU,子SKU,中文标题,英文标题
    if (obj.searchTypeVal) {
      obj[obj.searchTypeKey] = obj.searchTypeVal;
      if (['pSku', 'sSku'].includes(obj.searchTypeKey)) {
        obj[obj.searchTypeKey] = obj.searchTypeVal
          .replaceAll(',', ',')
          .split(',');
      }
    }
    // 供货价不在模板显示 supplyPriceMin
    if (listingStatus.value === -2) {
      delete obj.supplyPriceMin;
      delete obj.supplyPriceMax;
      delete obj.listingCreatorId;
    } else {
      delete obj.tplCreatorId;
      delete obj.syncStatus;
    }
    obj.listingStatus = listingStatus.value;
    obj.limit = paginationData.limit;
    obj.page = paginationData.page;
    return obj;
  };
  const handleSearch = async (page) => {
    if (page === 1) {
      paginationData.page = page;
    }
    const params = getSearchData();
    let total = 0;
    tableLoading.value = true;
    try {
      const { data, count } = await queryListApi(params);
      curStoreAcctId.value = params.storeAcctIds.join();
      gridOptions.data = (data || []).map((item) => {
        const _logisAttrList = item.logisAttrList?.split(',') || [];
        const logisAttrAliasList = initData.logisAttrList
          .filter((elem) => _logisAttrList.includes(elem.value))
          .map((item) => item.alias);
        return {
          ...item,
          delLoading: false,
          logisAttrAliasList,
          displayCount: 3,
          displayTxt: '展开'
        };
      });
      total = count;
    } catch (err) {
      console.log('err :>> ', err);
      gridOptions.data = [];
    }
    tableLoading.value = false;
    paginationData.total = total;
    listingStatusObj.value.forEach((item, index) => {
      if (item.value === listingStatus.value) {
        listingStatusObj.value[index].total = total;
      }
    });
  };
  const handleClickTab = (a) => {
    formData.value.purchaseCostPriceMin = '';
    formData.value.purchaseCostPriceMax = '';
    if (a.paneName === -2) {
      gridOptions.columns = TPL_COLUMNS;
    } else {
      gridOptions.columns = LISTING_COLUMNS;
    }
    nextTick(() => {
      handleSearch();
    });
  };
  //表格展示收缩
  const showAllList = async (row) => {
    if (row.displayCount == 3) {
      row.displayCount = row.subList.length;
      row.displayTxt = '收起';
      return;
    } else {
      row.displayCount = 3;
      row.displayTxt = '展开';
      return;
    }
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
  // #endregion   表单 查询
  // #region   获取初始数据
  const initData = reactive({
    bizzOwnerList: []
  });
  onMounted(() => {
    Promise.all([
      getStoreList('AE全托管'),
      getDevTypeListApi(),
      getBizzOwnerList(),
      getLogisListApi(),
      getProdTagListApi(),
      getListingCreatorApi(),
      getListuserbyrole({ role: 'AE全托管专员' })
    ]).then((res) => {
      initData.storeList = res[0].data?.children || [];
      initData.devTypeList = res[1].data || [];
      initData.bizzOwnerList = res[2].data || [];
      initData.logisAttrList = res[3].data || [];
      initData.prodAttrList = res[4].data || [];
      initData.listingCreatorList = res[5]?.data || [];
      initData.tplCreatorList = res[6].data || [];
      // 添加system
      initData.tplCreatorList.unshift({ id: -1, loginName: 'system' });
      initData.listingCreatorList.unshift({
        creatorId: -1,
        creator: 'system'
      });
    });
  });
  // #endregion   获取初始数据
  //#region 类目
  const showCateDialog = ref(false);
  const storeAcctIdList = ref([]);
  watch(
    () => formData.value.storeAcctIds,
    (val) => {
      // if (val.length) {
      // }
      storeAcctIdList.value = (val || []).map((item) => item[item.length - 1]);
    }
  );
  const handleCateDialogClose = (e) => {
    if (!e.cate) {
      showCateDialog.value = e.isShow;
      return;
    }
    formData.value.cateId = e.cate.value;
    formData.value.cateTreeName = e.cate.pathLabels.join('>>');
    showCateDialog.value = e.isShow;
  };
  const handleChooseCate = () => {
    showCateDialog.value = true;
  };
  const handleDelCate = () => {
    formData.value.cateId = null;
    formData.value.cateTreeName = '';
  };
  // #endregion 类目

  const publishVisible = ref(false);
  const publishDialogParam = ref({});
  const rowList = ref([]);
  const handlePublish = async (row) => {
    if (listingStatus.value === -2) {
      publishDialogParam.value = {
        storeAcctId: curStoreAcctId.value,
        aliexpressTplId: row.modelPId
      };
    } else {
      curStoreAcctId.value = row.storeAcctId;
      publishDialogParam.value = {
        prodListingId: row.id
      };
    }
    rowList.value = [row];
    publishVisible.value = true;
  };
  // 删除
  const handleDelListing = async (row) => {
    row.delLoading = true;
    const params = [row.id];
    try {
      const { msg } = await delPublishInfoApi(params);
      ElMessage.success(msg);
    } catch (err) {
      console.log('err :>> ', err);
    }
    row.delLoading = false;
    handleSearch();
  };
  // 取消定时刊登
  const handleCancelOnTime = async (row) => {
    try {
      row.cancelOnTimeLoading = true;
      const { msg } = await cancelTimingPublishNowApi([row.id]);
      ElMessage.success(msg);
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
    row.cancelOnTimeLoading = false;
  };
  // 刊登
  const handlePublishNow = async (row) => {
    row.publishNowLoading = true;
    const batchNo = new Date().getTime();
    const ids = [].concat(row.id);
    await publishNow(batchNo, ids);
    row.publishNowLoading = false;
  };
  let tortBrandTimestamp = null;
  const tortBrandVisible = ref(false);
  const publishNow = async (batchNo, ids, time = 0) => {
    // 校验侵权
    try {
      await publishNowApi({
        ids,
        batchNo,
        isContinueListing: 0
      });
      if (tortBrandTimestamp) {
        clearTimeout(tortBrandTimestamp);
      }
      tortBrandTimestamp = setTimeout(async () => {
        const { data } = await getResultByBatchNoApi({ batchNo });
        clearTimeout(tortBrandTimestamp);
        if (data && !isEmpty(data)) {
          const tableArr = [];
          tortBrandVisible.value = true;
          Object.keys(data).forEach((item) => {
            tableArr.push({
              id: item.replace(/[^\d]/g, ''),
              sku: data[item].split(':')[0],
              brandWord: data[item].split(':')[1]
            });
          });
          rowList.value = tableArr;
        } else {
          ElMessage.warning('进入刊登队列');
          handleSearch();
        }
      }, time);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // nextTick(() => {
  //   curStoreAcctId.value = 35904;
  //   handlePublish({ modelPId: 46696, cateId: 349 });
  // });
  // 商品父SKU弹窗----
  const showPskuDetailDialog = ref(false);
  let prodPId = ref();
  const hanldeOpenPskuDetails = async (id) => {
    prodPId.value = id;
    showPskuDetailDialog.value = true;
  };
  const handelPskuDialogClose = (e) => {
    prodPId.value = '';
    showPskuDetailDialog.value = e.isShow;
  };
  const changeSaleNote = async (val, prodPId) => {
    try {
      await updateSalenoteApi({
        prodPId: prodPId,
        saleNote: val
      });
    } catch (err) {
      console.log('val :>> ', val);
    }
  };

  // #region 批量操作

  // 批量生成
  const checkedRowList = ref([]);
  const handleBatchCreatedVisible = ref(false);
  const handleBatchCreate = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据');
    }
    handleBatchCreatedVisible.value = true;
    checkedRowList.value = checkedList;
  };
  // 删除
  const batchDelLoading = ref(false);
  const handleBatchDel = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据');
    }
    batchDelLoading.value = true;
    const params = checkedList.map((item) => item.id);
    try {
      const { msg } = await delPublishInfoApi(params);
      ElMessage.success(msg);
    } catch (err) {
      console.log('err :>> ', err);
    }
    batchDelLoading.value = false;
    handleSearch();
  };

  // 立即刊登
  const batchPublishNowLoading = ref(false);
  const handleBatchPublishNow = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据');
    }
    batchPublishNowLoading.value = true;
    const batchNo = new Date().getTime();
    const ids = checkedList.map((item) => item.id);
    await publishNow(batchNo, ids);
    batchPublishNowLoading.value = false;
  };
  //   定时刊登
  const publishOnTimeVisible = ref(false);
  const handleBatchOnTime = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据');
    }
    rowList.value = checkedList;
    publishOnTimeVisible.value = true;
  };
  // 取消定时刊登
  const batchCancelOntimeLoading = ref(false);
  const handleBatchCancelOnTime = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据');
    }
    const idList = checkedList.map((item) => item.id);
    try {
      batchCancelOntimeLoading.value = true;
      const { msg } = await cancelTimingPublishNowApi(idList);
      ElMessage.success(msg);
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
    batchCancelOntimeLoading.value = false;
  };

  // #endregion 批量操作
</script>

<style lang="scss" scoped>
  .form_input_width {
    :deep(.el-input) {
      width: 50px;
    }
  }
  .large_width {
    width: 290px !important;
  }
  .gray_text {
    color: #999;
  }
  .mr10 {
    margin-right: 30px;
  }
  .list_card {
    :deep(.el-checkbox.el-checkbox--large) {
      height: 20px;
    }
    :deep(.vxe-grid--toolbar-wrapper) {
      position: absolute;
    }
    .aefh-theader,
    .aefh-tbody {
      display: flex;
      .aefh-theader-th,
      .aefh-tbody-td {
        flex: 1;
        box-sizing: border-box;
        padding: 0 5px;
      }
    }
    .aefh-tbody {
      border-bottom: 1px solid #e8eaec;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .w80 {
    flex: none !important;
    width: 80px;
  }
  .w180 {
    flex: none !important;
    width: 180px;
  }
  .w60 {
    flex: none !important;
    width: 80px;
  }
  .card_position {
    position: relative;
    .tools_btn {
      display: flex;
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
</style>
