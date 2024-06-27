<template>
  <div class="app-container aefullyhosted">
    <el-card ref="searchCardRef" class="search_card">
      <el-form
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <!-- <el-form-item label="部门">
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
        <el-form-item label="销售人员">
          <el-select
            v-model="formData.salesPersonId"
            placeholder="请选择"
            clearable
            filterable
            @change="changeSalers"
            @clear="resetUnion"
          >
            <el-option
              v-for="item in selectData.salersData"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺">
          <el-select
            v-model="formData.storeAcctIdList"
            :class="formData.storeAcctIdList.length > 1 ? 'hideTag' : ''"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            filterable
          >
            <template #prefix>
              <el-tag v-if="formData.storeAcctIdList.length > 1" type="info"
                >已选{{ formData.storeAcctIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.storeData"
              :key="item.id"
              :label="item.storeAcct"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="店铺">
          <ZCascader
            ref="storeRef"
            v-model="formData.storeAcctIdList"
            placeholder="请选择"
            :data="selectData.storeData"
          ></ZCascader>
        </el-form-item>
        <el-form-item label="开发">
          <el-select
            v-model="formData.bizzOwnerId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in customersList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.sellerSkuKey" class="form_left">
            <el-option value="productIdList" label="产品ID" />
            <el-option value="sellerSkuList" label="店铺子SKU" />
            <el-option value="prodPSkuList" label="商品父SKU" />
            <el-option value="title" label="商品标题" />
          </el-select>
          <el-input
            v-model="formData.sellerSkuVal"
            class="form_right"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="平台类目"
          prop="leafCategoryId"
          style="width: 220px"
        >
          <el-button type="primary" @click="handleChooseCate"
            >选择类目</el-button
          >
          <el-icon class="ml10 gray_text" @click="handleDelCate"
            ><Delete
          /></el-icon>
        </el-form-item>
        <el-form-item label="销售状态">
          <el-select
            v-model="formData.skuStatus"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="销售" value="active" />
            <el-option label="不销售" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select
            v-model="formData.productStatusList"
            class="mul-input"
            :class="formData.productStatusList.length > 1 ? 'hideTag' : ''"
            placeholder="请选择"
            filterable
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <template #prefix>
              <el-tag v-if="formData.productStatusList.length > 1" type="info"
                >已选{{ formData.productStatusList.length }}项</el-tag
              >
            </template>
            <el-option label="正在销售" value="ONLINE" />
            <el-option label="待上架" value="PENDING_LAUNCH" />
            <el-option label="审核中" value="PENDING_APPROVAL" />
            <el-option label="审核不通过" value="VIOLATION_QC_FAILED" />
            <el-option label="已下架" value="OFFLINE" />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态">
          <el-select
            v-model="formData.isSale"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="停售" :value="0" />
            <el-option label="部分在售" :value="1" />
            <el-option label="在售" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select
            v-model="formData.orderByEnums"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in initData.orderByList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="formData.orderByType" style="width: 60px">
            <el-option label="正序" value="_ASC" />
            <el-option label="倒序" value="_DESC" />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="supplyPriceLowerBound"
          label="供货价"
          class="form_range"
        >
          <el-input
            v-model="formData.supplyPriceLowerBound"
            placeholder=">="
            clearable
          />
          <div class="range_link">-</div>
          <el-input
            v-model="formData.supplyPriceUpperBound"
            placeholder="<="
            clearable
          />
        </el-form-item>
        <el-form-item prop="productType" label="备货类型">
          <el-select
            v-model="formData.productType"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in PRODUCT_TYPE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="scItemTypeVal">
          <el-select
            v-model="formData.scItemTypeKey"
            placeholder="请选择"
            class="form_left"
            filterable
          >
            <el-option
              v-for="(item, index) in ID_TYPE_LIST"
              :key="item.value + index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="formData.scItemTypeVal"
            class="form_right"
            placeholder=""
            clearable
          />
        </el-form-item>
        <el-form-item prop="bindStatus" label="SKU绑定状态">
          <el-select
            v-model="formData.bindStatus"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in BIND_STATUS_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="productCreateTime">
          <el-select
            v-model="formData.timeType"
            class="form_left"
            clearable
            filterable
          >
            <el-option value="刊登时间" label="刊登时间" />
            <el-option value="修改时间" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="formData.productCreateTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 200px"
            class="form_right"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item
          prop="minJitStock"
          label="JIT库存"
          class="form_input_width"
        >
          <el-input
            v-model="formData.minJitStock"
            class="form_right"
            placeholder=">="
            clearable
          />
          <div class="range_link">-</div>
          <el-input v-model="formData.maxJitStock" placeholder="<=" clearable />
        </el-form-item>
        <el-form-item
          label="仓发库存"
          prop="minDomesticStock"
          class="form_input_width"
        >
          <el-select
            v-model="formData.existPlatWarehouse"
            style="width: 60px"
            class="form_right existPlatWarehouse"
            filterable
            @change="handleChangeDomesticStock"
          >
            <el-option :value="null" label="不限" />
            <el-option :value="true" label="有" />
            <el-option :value="false" label="无" />
          </el-select>
          <el-input
            v-model="formData.minDomesticStock"
            :disabled="formData.existPlatWarehouse === false"
            class="form_right"
            placeholder=">="
            clearable
          />
          <div class="range_link">-</div>
          <el-input
            v-model="formData.maxDomesticStock"
            :disabled="formData.existPlatWarehouse === false"
            placeholder="<="
            clearable
          />
        </el-form-item>
        <el-form-item
          label="总库存"
          prop="minSkuStock"
          class="form_input_width"
        >
          <el-input
            v-model="formData.minSkuStock"
            class="form_right"
            placeholder=">="
            clearable
          />
          <div class="range_link">-</div>
          <el-input v-model="formData.maxSkuStock" placeholder="<=" clearable />
        </el-form-item>
        <el-form-item label="不过审原因" prop="auditFailureType">
          <el-select v-model="formData.auditFailureType" clearable filterable>
            <el-option
              v-for="item in initData.auditFailureTypeEnum"
              :key="item"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="特殊商品类型" prop="specialProductTypeEnum">
          <el-select
            v-model="formData.specialProductTypeEnum"
            clearable
            filterable
          >
            <el-option
              v-for="item in initData.specialProductTypeEnumOption"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="yiwuStock" class="form_input_width">
          <el-select v-model="formData.yiwuStock" class="form_left" filterable>
            <el-option value="availableStock" label="义乌仓可用" />
            <el-option value="orderNotInNum" label="义乌仓在途" />
            <el-option value="lackUnPaiNum" label="义乌仓未派" />
          </el-select>
          <el-select
            v-model="formData.skuStockIncludeWhole"
            class="skuStockProperty"
            style="width: 120px"
            filterable
            clearable
          >
            <el-option :value="false" label="部分属性" />
            <el-option :value="true" label="全部属性" />
          </el-select>
          <el-input
            v-model="formData.lowerBound"
            style="width: 105px"
            placeholder=">="
            clearable
          />
          <div class="range_link">-</div>
          <el-input
            v-model="formData.upperBound"
            style="width: 105px"
            placeholder="<="
            clearable
          />
        </el-form-item>
        <el-form-item label="刊登数">
          <el-input
            v-model="formData.storeNumMin"
            oninput="value=value.replace(/[^\d]/g,'')"
            style="width: 50px"
            class="form_right"
            placeholder=">="
            clearable
          />
          <div class="range_link">-</div>
          <el-input
            v-model="formData.storeNumMax"
            style="width: 50px"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="<="
            clearable
          />
        </el-form-item>
        <el-form-item prop="saleDaysAttrType" class="form_input_width">
          <el-select v-model="formData.saleDaysAttrType" class="form_left">
            <el-option :value="1" label="预计可售天数(部分属性)" />
            <el-option :value="2" label="预计可售天数(全部属性)" />
          </el-select>
          <ZInputNumber
            v-model="formData.minDays"
            style="width: 75px"
            placeholder=">="
            clearable
          />
          <span class="range_link"> - </span>
          <ZInputNumber
            v-model="formData.maxDays"
            style="width: 75px"
            placeholder="<="
            clearable
          />
        </el-form-item>
        <el-form-item label="欧盟责任人" prop="msrEuIdStatus">
          <el-select v-model="formData.msrEuIdStatus" clearable filterable>
            <el-option label="有欧盟责任人" :value="1" />
            <el-option label="无欧盟责任人" :value="0" />
            <el-option label="无需欧盟责任人" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="qualificationKey" class="form_input_width">
          <el-select
            v-model="formData.qualificationKey"
            class="goods_qualification_left"
          >
            <el-option
              v-for="item in GOODS_CERTIFICATION"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <el-select
            v-model="formData.haveQualification"
            class="goods_qualification_right"
            clearable
          >
            <el-option :value="true" label="有" />
            <el-option :value="false" label="无" />
          </el-select>
        </el-form-item>
        <el-form-item label="重量待调整" prop="weightOutDate">
          <el-select v-model="formData.weightOutDate" clearable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="listing销量"
          prop="listingSalesType"
          class="form_input_width"
        >
          <el-select
            v-model="formData.listingSalesType"
            style="width: 60px"
            class="form_right"
            filterable
          >
            <el-option :value="1" label="7天" />
            <el-option :value="2" label="30天" />
            <el-option :value="3" label="60天" />
            <el-option :value="4" label="90天" />
            <el-option :value="5" label="180天" />
          </el-select>
          <el-input
            v-model="formData.listingSalesMin"
            class="form_right"
            placeholder=">="
            clearable
          />
          <div class="range_link">-</div>
          <el-input
            v-model="formData.listingSalesMax"
            placeholder="<="
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHandle(1)"> 查询 </el-button>
          <el-button @click="resetHostedForm">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown split-button type="primary">
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
        </el-form-item>
        <div v-if="formData.cateTreeName" class="gray_text">
          {{ formData.cateTreeName }}
        </div>
      </el-form>
    </el-card>
    <el-card class="list_card">
      <div class="right_batch_btns">
        <!-- <el-button style="margin-right: 10px" @click="aeExportConfig"
          >导出</el-button
        > -->
        <el-upload
          v-model:file-list="importPlatWhShipmentFile"
          v-permission="['multiplatformprodaefullyhostedImportPlatWhShipment']"
          class="mr10"
          accept="xlsx,xls"
          :show-file-list="false"
          :data="{ platCode: 'AE全托管' }"
          action="/api/lms/aliexpress/whShipment/importPlatWhShipment"
          :on-success="handleImportPlatWhShipment"
          :before-upload="handleExportBefore"
          :on-error="handleExportError"
        >
          <el-button type="primary" :loading="uploadLoading"
            >导入货件计划</el-button
          >
        </el-upload>
        <el-dropdown size="small" split-button type="primary">
          批量操作
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in BATCH_BTN_ENUM"
                :key="item.label"
                @click="item.clickFuc"
                >{{ item.label }}</el-dropdown-item
              >
              <el-dropdown-item @click="handleBatchUpdateEUResponsible()"
                ><span v-permission="['AEBatchUpdateEUResponsible']"
                  >修改欧盟责任人</span
                ></el-dropdown-item
              >
              <el-dropdown-item @click="handleBatchGoodsCertification()"
                ><span v-permission="['AEBatchGoodsCertification']"
                  >修改商品资质</span
                ></el-dropdown-item
              >
              <el-dropdown-item @click="handleBatchUpdateWeight()"
                ><span v-permission="['AEBatchUpdateWeight']"
                  >修改重量</span
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <!-- 图片 -->
        <template #aefh_imageUrls="{ row }">
          <ImagePop :src="row.imageUrls" />
        </template>
        <!-- 标题/产品编号/类目/店铺/备货类型 -->
        <template #aefh_tic="{ row }">
          <div>
            <el-tag
              v-if="row.weightOutDate"
              class="my-4"
              type="danger"
              size="small"
              >重量待调整</el-tag
            >
            <div>{{ row.title }}</div>
            <div>
              {{ row.productId }}
              <el-icon
                v-if="row.productId"
                class="copy_icon"
                color="#aaa"
                @click="copy(row.productId)"
                ><CopyDocument
              /></el-icon>
            </div>
            <div>{{ row.cateTreeName }}</div>
            <div class="text_red">{{ row.auditFailureTypeStr }}</div>
            <div style="font-weight: bold; margin: 12px 0">
              店铺:{{ row.storeAcct }}
            </div>
            <div>销售: {{ row.salesperson }}</div>
            <div>
              <div v-if="row.productType === 1">国内履约</div>
              <div v-else-if="row.productType === 2">海外备仓</div>
            </div>
            <div></div>
          </div>
        </template>
        <!-- 商品状态 -->
        <template #product_status="{ row }">
          {{ getproductStatus(row.productStatus) }}
        </template>
        <!-- 销量 -->
        <template #product_sales="{ row }">
          <div>7天：{{ row.sevenSales }}</div>
          <div>30天：{{ row.thirtySales }}</div>
          <div>60天：{{ row.sixtySales }}</div>
          <div>90天：{{ row.ninetySales }}</div>
          <div>180天：{{ row.oneHundredAndEightySales }}</div>
        </template>
        <!-- 自定义skuList表头skuList_header -->
        <template #skuList_header>
          <div class="aefh-theader">
            <div class="aefh-theader-th w80">SKU图片</div>
            <div class="aefh-theader-th w160">SKU</div>
            <div class="aefh-theader-th w180">货品信息</div>
            <div class="aefh-theader-th w100">SKU属性</div>
            <div class="aefh-theader-th w90">人员</div>
            <div class="aefh-theader-th w100">成本(&yen;)/重量(g)</div>
            <div class="aefh-theader-th w60">供货价</div>
            <div class="aefh-theader-th w160">平台库存量</div>
            <div class="aefh-theader-th w100">义乌仓库存</div>
            <div class="aefh-theader-th w90">销量(sku)</div>
            <div class="aefh-theader-th w90">时间</div>
          </div>
        </template>
        <!-- 自定义skuList展示 -->
        <template #aefh_skuList="{ row }">
          <div v-if="row.skuList.length > 0">
            <div
              v-for="item in row.skuList.slice(0, row.displayCount)"
              :key="item.id"
              class="aefh-tbody"
            >
              <div class="aefh-tbody-td w80">
                <ImagePop :src="item.skuImage" width="60px" height="60px" />
                <el-tag v-if="item.skuStatus === 'inactive'" type="danger"
                  >不售</el-tag
                >
              </div>
              <div class="aefh-tbody-td w160">
                <div>
                  <div class="flex tagList">
                    <span>店铺: {{ item.sellerSku }}</span>
                    <el-tag
                      v-if="item.isSale === false"
                      class="margin-right: 2px"
                      type="danger"
                      >停</el-tag
                    >
                    <div
                      v-if="item.logisAttrList && item.logisAttrList.length > 0"
                      style="display: flex"
                    >
                      <el-popover
                        v-for="val in item.logisAttrList"
                        :key="val"
                        placement="top-start"
                        trigger="hover"
                        :width="200"
                      >
                        <template #reference>
                          <el-tag type="danger"> {{ getAttrTag(val) }}</el-tag>
                        </template>
                        <div>物流属性:{{ val }}</div>
                      </el-popover>
                    </div>
                  </div>

                  <div>
                    <span>商品: {{ item.prodSSku }}</span>
                    <el-icon
                      v-if="item.prodSSku"
                      class="copy_icon"
                      color="#aaa"
                      @click="copy(item.prodSSku)"
                      ><CopyDocument
                    /></el-icon>
                  </div>
                  <div>sku_id: {{ item.skuId }}</div>
                </div>
              </div>
              <div class="aefh-tbody-td w180">
                <div class="product_col">
                  <div class="product_col_status">
                    <el-popover
                      v-if="item.bindStatus"
                      placement="top-start"
                      :width="200"
                      trigger="hover"
                    >
                      <template #reference>
                        <el-tag :type="BIND_STATUS_OBJ[item.bindStatus].type">{{
                          BIND_STATUS_OBJ[item.bindStatus].tag
                        }}</el-tag>
                      </template>
                      <div>商货绑定状态:{{ item.bindStatusStr }}</div>
                      <div v-if="item.bindStatus === 4">
                        原因:{{ item.unbindRefuseReason }}
                      </div>
                    </el-popover>
                  </div>
                  <div>
                    <div>货品id: {{ item.scItemId }}</div>
                    <div>货品条码: {{ item.scItemBarCode }}</div>
                    <div>货品编码: {{ item.scItemCode }}</div>
                  </div>
                </div>
              </div>
              <div class="aefh-tbody-td w100">
                {{ item.variation && item.variation.split('";').join('\n') }}
              </div>
              <div class="aefh-tbody-td w90">
                <div>开发: {{ item.bizzOwner }}</div>
                <div>采购: {{ item.buyer }}</div>
                <div>责任: {{ item.responsor }}</div>
              </div>
              <div class="aefh-tbody-td w100">
                <div>采购: {{ item.purchaseCostPrice }}</div>
                <div>毛重: {{ item.packWeight }}</div>
                <div>净重: {{ item.suttleWeight }}</div>
              </div>
              <div class="aefh-tbody-td w60" style="width: 60px">
                {{ item.supplyPrice }}
              </div>
              <div class="aefh-tbody-td w160">
                <el-popover placement="right" :width="200" trigger="hover">
                  <template #default>
                    <div>
                      <div
                        v-for="childItem in getPlatValue(
                          1,
                          item.skuWarehouseStockList,
                          ['杭州JIT库存', '东莞JIT库存']
                        )"
                        :key="childItem.warehouseCode"
                      >
                        <span>{{ childItem.warehouseName }}</span>
                        <span>:</span>
                        <span>{{ childItem.sellableQuantity }}</span>
                      </div>
                    </div>
                  </template>
                  <template #reference>
                    <div>JIT库存: {{ item.jitTotalStock }}</div>
                  </template>
                </el-popover>

                <el-popover placement="right" :width="200" trigger="hover">
                  <template #default>
                    <div
                      v-if="
                        item?.domesticTotalStock === null ||
                        item?.domesticTotalStock === undefined
                      "
                    >
                      暂无仓库
                    </div>
                    <div v-else>
                      <div
                        v-for="childItem in getPlatValue(
                          0,
                          item.skuWarehouseStockList,
                          ['杭州JIT库存', '东莞JIT库存']
                        )"
                        :key="childItem.warehouseCode"
                      >
                        <span>{{ childItem.warehouseName }}</span>
                        <span>:</span>
                        <span>{{ childItem.sellableQuantity }}</span>
                      </div>
                    </div>
                  </template>
                  <template #reference>
                    <div>
                      <span>仓发总库存:</span>

                      {{
                        item?.domesticTotalStock === null ||
                        item?.domesticTotalStock === undefined
                          ? '无'
                          : item.domesticTotalStock
                      }}
                    </div>
                  </template>
                </el-popover>

                <el-popover placement="right" :width="200" trigger="hover">
                  <template #default>
                    <div>
                      <div
                        v-for="childItem in item.skuWarehouseStockList"
                        :key="childItem.warehouseCode"
                      >
                        <span>{{ childItem.warehouseName }}</span>
                        <span>:</span>
                        <span>{{ childItem.sellableQuantity }}</span>
                      </div>
                    </div>
                  </template>
                  <template #reference>
                    <div>总库存:{{ item?.skuStock }}</div>
                  </template>
                </el-popover>
              </div>
              <div class="aefh-tbody-td w100">
                <div>可用: {{ item.availableStock }}</div>
                <div>在途: {{ item.orderNotInNum }}</div>
                <div>未派: {{ item.lackUnPaiNum }}</div>
                <div>可售天数: {{ item.predictSaleDay }}</div>
              </div>
              <div class="aefh-tbody-td w90">
                <div class="flex-start">
                  <span class="flex-none w42">7天:</span>
                  <span class="flex-1">{{ item.sevenSales }}</span>
                </div>
                <div class="flex-start">
                  <span class="flex-none w42">30天: </span>
                  <span class="flex-1">{{ item.thirtySales }}</span>
                </div>
                <div class="flex-start">
                  <span class="flex-none w42">60天:</span>
                  <span class="flex-1">{{ item.sixtySales }}</span>
                </div>
                <div class="flex-start">
                  <span class="flex-none w42">90天:</span>
                  <span class="flex-1">{{ item.ninetySales }}</span>
                </div>
                <div class="flex-start">
                  <span class="flex-none w42">180天:</span>
                  <span class="flex-1">{{
                    item.oneHundredAndEightySales
                  }}</span>
                </div>
              </div>

              <div class="aefh-tbody-td w90 flex-column">
                <div>
                  刊登时间:{{
                    transferDate(
                      row.productCreateTime,
                      (isTime = true),
                      (type = '/')
                    )
                  }}
                </div>
                <div>
                  修改时间:{{
                    transferDate(
                      row.productModifiedTime,
                      (isTime = true),
                      (type = '/')
                    )
                  }}
                </div>
              </div>
            </div>
            <div v-if="row.skuList.length > 3" class="aefh-tbody">
              <el-button type="primary" text @click="showAllList(row)">
                {{ row.displayTxt }}({{ row.skuList.length }})
              </el-button>
            </div>
          </div>
          <div v-else>无子数据</div>
        </template>
        <template #aefh_toolbar="{ row }">
          <el-button type="primary" @click="handleViewLog(row)">日志</el-button>
        </template>
        <!-- 分页 -->
        <template #pager>
          <vxe-pager
            v-model:current-page="tablePage.currentPage"
            v-model:page-size="tablePage.pageSize"
            :layouts="[
              'Sizes',
              'PrevPage',
              'Number',
              'NextPage',
              'FullJump',
              'Total'
            ]"
            :page-sizes="[20, 100, 200, 300]"
            :total="tablePage.total"
            @page-change="handlePageChange"
          >
          </vxe-pager>
        </template>
      </vxe-grid>
    </el-card>
    <!-- 类目组件 -->
    <CateByDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :get-cate-api="getSmtCateByApi"
      @close-dialog="handleCateDialogClose($event)"
    />

    <!-- 库存 -->
    <BatchUpdateStock
      v-model="updateStockVisible"
      :order="formData.orderByEnums + formData.orderByType"
      :checked-row-list="checkedRowList"
      :role-names="roleNames"
      :plat-code="platCode"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      @handle-search="searchHandle(1)"
    />

    <!-- 查看日志 -->
    <LogDialog v-model="logVisible" :checked-row-list="checkedRowList" />

    <!-- 批量修改特殊商品物流属性 -->
    <BatchSpecialGoodsType
      v-model="updateSpecialGoodsTypeVisible"
      :check-prod-id-list="checkProdIdList"
      @handle-search="searchHandle"
    />

    <!-- 修改标题 -->
    <ReplaceTitleDialog
      v-model="showBatchReplaceTitle"
      :checked-p-id-list="checkedPIdList"
      @handle-search="searchHandle(1)"
    />

    <!-- 修改描述 -->
    <ReplaceDescDialog
      v-model="showBatchReplaceDesc"
      :checked-p-id-list="checkedPIdList"
      @handle-search="searchHandle(1)"
    />

    <!-- 修改欧盟责任人 -->
    <BatchUpdateEUResponsible
      v-model="showEUResponsible"
      :checked-p-id-list="checkedPIdList"
      :response-params="responseParams"
      @handle-search="searchHandle(1)"
    />

    <!-- 修改商品资质 -->
    <BatchUpdateGoodsCertification
      v-model="showGoodsCertification"
      :checked-goods-certification-list="checkedGoodsCertificationList"
      @handle-search="searchHandle(1)"
    />

    <!-- 导出配置 -->
    <ExportConfig
      v-if="aeExportConfigDialog"
      :show-dialog="aeExportConfigDialog"
      config-type="'MULTIPLATFORM_PROD_AEFULLYHOSTED'"
      :checkbox-data="aeExportConfigCheckboxData"
      :checked-row-list="checkedRowList"
      :loading="loading"
      @close-dialog="handleLogRuleClose($event)"
      @export-dialog="exportDialog"
    />

    <!-- 批量修改重量 -->
    <BatchUpdateWeight
      v-model="updateWeightVisible"
      :checked-s-id-list="checkedSIdList"
      @handle-search="searchHandle(1)"
    />
  </div>
</template>

<script setup name="multiplatformprodaefullyhosted">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { getSysUserList } from '@/api/multiplatform/aesupportprod';
  import { getLogisAttrEnum } from '@/api/publishs/miraviapublish';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { GOODS_CERTIFICATION } from './config';
  import {
    aefullyhostedSearchAjax,
    getSmtCateByApi,
    batchSyncApi,
    initDataApi,
    getAuditFailureTypeEnumApi,
    getSpecialGoodsEnumType,
    batchCopyList,
    getExportHeader
  } from '@/api/publishs/aefullyhosted';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getStoreList, shortcuts } from '@/api/common';
  import ImagePop from '@/components/ImagePop/index.vue';
  import CateByDialog from '@/components/CateByStore/index.vue';
  import BatchUpdateStock from './components/BatchUpdateStock.vue';
  import BatchUpdateWeight from './components/BatchUpdateWeight.vue';
  import BatchSpecialGoodsType from './components/BatchSpecialGoodsType.vue';
  import ReplaceTitleDialog from './components/BatchUpdateTitle.vue';
  import ReplaceDescDialog from './components/BatchUpdateDescription.vue';
  import BatchUpdateEUResponsible from './components/BatchUpdateEUResponsible.vue';
  import BatchUpdateGoodsCertification from './components/BatchUpdateGoodsCertification.vue';
  import LogDialog from './components/LogDialog.vue';
  import { transBlob } from '@/utils/downloadFile';
  import { copy, transferDate } from '@/utils/common';
  import { cloneDeep } from 'lodash-es';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ExportConfig from '@/components/ExportConfig/index.vue';

  //#region  常量枚举
  const ID_TYPE_LIST = [
    {
      label: '货品ID',
      value: 'scItemIdList'
    },
    {
      label: '货品条码',
      value: 'scItemBarCodeList'
    },
    {
      label: '货品编码',
      value: 'scItemCodeList'
    }
  ];
  const BIND_STATUS_LIST = [
    {
      label: '未绑定',
      tag: '未',
      value: 1,
      type: 'danger'
    },
    {
      label: '绑定中',
      tag: '已',
      value: 2,
      type: 'success'
    },
    {
      label: '解绑待审核',
      tag: '审',
      value: 3,
      type: 'warning'
    },
    {
      label: '解绑拒绝',
      tag: '拒',
      value: 4,
      type: 'danger'
    }
  ];
  const PRODUCT_STATUS = {
    ONLINE: '在线',
    PENDING_LAUNCH: '待上架',
    PENDING_APPROVAL: '审核中',
    VIOLATION_QC_FAILED: '审核不通过',
    OFFLINE: '已下架'
  };
  const BIND_STATUS_OBJ = {
    1: {
      label: '未绑定',
      tag: '未',
      type: 'danger'
    },
    2: {
      label: '绑定中',
      tag: '已',
      type: 'success'
    },
    3: {
      label: '解绑待审核',
      tag: '审',
      type: 'warning'
    },
    4: {
      label: '解绑拒绝',
      tag: '拒',
      type: 'danger'
    }
  };
  const PRODUCT_TYPE_LIST = [
    {
      label: '国内履约',
      value: 1
    },
    {
      label: '海外备仓',
      value: 2
    }
  ];
  const initData = ref([]);
  //#endregion  常量枚举

  const tablePage = ref({
    total: 0,
    currentPage: 1,
    pageSize: 100
  });
  //#region 表单处理
  //表单数据渲染和校验
  const formData = ref({
    // orgId: '', //部门
    // salesPersonId: '', //销售
    storeAcctIdList: [], //店铺(多选)
    bizzOwnerId: '', //开发
    sellerSkuKey: 'productIdList',
    sellerSkuVal: '',
    leafCategoryId: null,
    cateTreeName: '',
    skuStatus: '', //销售状态
    productStatusList: ['ONLINE'], // 商品状态多选 至少选择一个 默认正在销售
    isSale: '', //在售状态
    orderByEnums: 'CREATE_TIME', //排序
    orderByType: '_DESC',
    listingSalesType: 1, // listing销量
    supplyPriceUpperBound: '', // 供货价上界
    supplyPriceLowerBound: '', // 供货价下界
    productType: '', //备货类型
    scItemTypeKey: 'scItemIdList',
    scItemTypeVal: '',
    bindStatus: '', // 货品编码
    timeType: '刊登时间',
    productCreateTime: '', // 创建时间
    yiwuStock: 'availableStock',
    skuStockIncludeWhole: false,
    upperBound: '',
    lowerBound: '',
    auditFailureType: null,
    storeNumMin: null,
    storeNumMax: '',
    specialProductTypeEnum: null,
    saleDaysAttrType: 1, // 预计可售天数部分属性 1 全部属性 2
    minDays: '',
    maxDays: '',
    msrEuIdStatus: '', // 欧盟责任人
    qualificationKey: 'cosmetics_PIF', // 商品资质key
    haveQualification: '', // 是否有商品资质
    weightOutDate: '', // 重量待调整
    minJitStock: '',
    maxJitStock: '',
    minSkuStock: '',
    maxSkuStock: '',
    minDomesticStock: '',
    maxDomesticStock: '',
    existPlatWarehouse: null // 默认不限仓库
  });
  const customersList = ref([]);
  const getCustomersList = async () => {
    try {
      const { data } = await getSysUserList();
      customersList.value = data.preprodDevList;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取特殊商品类型
  const getSpecialProductTypeEnumOption = async () => {
    try {
      const { data } = await getSpecialGoodsEnumType();
      initData.value.specialProductTypeEnumOption = data.specialProductTypeEnum;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取商品状态
  const getproductStatus = (status) => {
    const statusList = [];
    status.split(',').forEach((item) => {
      statusList.push(PRODUCT_STATUS[item]);
    });
    return statusList.join(',');
  };
  const resetHostedForm = () => {
    formData.value = {
      // orgId: '', //部门
      // salesPersonId: '', //销售
      storeAcctIdList: [], //店铺(多选)
      bizzOwnerId: '', //开发
      sellerSkuKey: 'productIdList',
      sellerSkuVal: '',
      leafCategoryId: null,
      cateTreeName: '',
      skuStatus: '', //销售状态
      productStatusList: ['ONLINE'], // 原来的商品状态字段productStatus废弃。使用新字段，支持多选
      isSale: '', //在售状态
      orderByEnums: 'CREATE_TIME', //排序
      orderByType: '_DESC',
      listingSalesType: 1,
      listingSalesMin: '',
      listingSalesMax: '',
      supplyPriceUpperBound: '', // 供货价上界
      supplyPriceLowerBound: '', // 供货价下界
      productType: '', //备货类型
      scItemTypeKey: 'scItemIdList',
      scItemTypeVal: '',
      bindStatus: '', // 货品编码
      productCreateTime: '', // 创建时间
      yiwuStock: 'availableStock',
      skuStockIncludeWhole: false,
      upperBound: '',
      lowerBound: '',
      storeNumMin: null,
      storeNumMax: '',
      auditFailureType: null,
      timeType: '刊登时间',
      specialProductTypeEnum: null,
      saleDaysAttrType: 1,
      minJitStock: '',
      maxJitStock: '',
      minSkuStock: '',
      maxSkuStock: '',
      minDomesticStock: '',
      maxDomesticStock: ''
    };
    // getStoreLists();
  };
  //#endregion

  // //#region 部门-销售-店铺三级联动
  // const defaultProps = {
  //   children: 'childOrgList',
  //   label: 'name',
  //   value: 'id'
  // };
  const selectData = ref({
    departData: [],
    salersData: [],
    storeData: [],
    siteList: []
  });
  // // 重置联动
  // const resetUnion = () => {
  //   formData.value.salesPersonIdList = [];
  //   formData.value.salesPersonId = '';
  //   formData.value.storeAcctIdList = [];
  // };
  // const salersDataCopy = ref([]);
  // // 获取部门以及销售人员信息
  // const getDepartmentList = async () => {
  //   try {
  //     let params = {
  //       roleNames: 'AE全托管专员'
  //     };
  //     const { data } = await getDepartData(params);
  //     selectData.value.departData = data.orgTree;
  //     selectData.value.salersData = data.userList;
  //     salersDataCopy.value = data.userList;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // 获取店铺信息
  const getStoreLists = async () => {
    try {
      // let params = {
      //   roleNames: 'AE全托管专员',
      //   orgId: formData.value.orgId,
      //   salePersonId: formData.value.salesPersonId,
      //   platCode: 'AE全托管'
      // };
      // const { data } = await getStoreInfo(params);
      try {
        const params = 'AE' + encodeURIComponent('全托管');
        const { data } = await getStoreList(params);
        selectData.value.storeData = data?.children;
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // // 清空部门选择
  // const clearDepart = () => {
  //   selectData.value.salersData = salersDataCopy.value;
  //   formData.value.orgId = '';
  //   formData.value.storeAcctIdList = [];
  //   resetUnion();
  //   nextTick(() => {
  //     getStoreList();
  //   });
  // };
  // //部门节点点击事件
  // const handleNodeClick = (data) => {
  //   let selectId = data.id;
  //   selectData.value.salersData = salersDataCopy.value.filter(
  //     (item) => item.org_id === selectId
  //   );
  //   resetUnion();
  //   nextTick(() => {
  //     getStoreList();
  //   });
  // };
  // const changeSalers = () => {
  //   formData.value.storeAcctIdList = [];
  //   nextTick(() => {
  //     getStoreList();
  //   });
  // };
  // //#endregion

  // 获取需要复制的枚举值
  const needCopyList = ref([]);
  const getNeedCopyList = () => {
    // const { data } = await getBatchCopyEnum();
    needCopyList.value = [
      {
        code: 1,
        fieldName: 'skuId'
      },
      {
        code: 2,
        fieldName: '商品父sku'
      },
      {
        code: 3,
        fieldName: '店铺'
      },
      {
        code: 4,
        fieldName: '销售'
      }
    ];
  };
  // 点击一键复制
  const handleCopySkuInfo = async (copyCode) => {
    const checkedList = tableRef.value.getCheckboxRecords();
    // 有勾选 就传productIdList
    let params = {};
    params = checkedList?.length
      ? { productIdList: checkedList.map((item) => item.productId) }
      : {};

    // 查询条件
    let formDatas = getFormData();

    const { code, data } = await batchCopyList({
      batchCopyFieldCode: copyCode,
      ...formDatas,
      ...params
    });
    if (code === '0000') {
      // 复制到粘贴板
      copy(data);
    }
  };

  //#region 类目
  const showCateDialog = ref(false);
  const handleCateDialogClose = (e) => {
    if (!e.cate) {
      showCateDialog.value = e.isShow;
      return;
    }
    formData.value.leafCategoryId = e.cate.value;
    formData.value.cateTreeName = e.cate.pathLabels.join('>>');
    showCateDialog.value = e.isShow;
  };
  const handleChooseCate = () => {
    // if (!formData.value?.storeAcctIdList?.length) {
    //   ElMessage.warning('请选择店铺');
    // } else {
    showCateDialog.value = true;
    // }
  };
  const handleDelCate = () => {
    formData.value.leafCategoryId = null;
    formData.value.cateTreeName = '';
  };

  // 获取平台库存对应枚举
  const getPlatValue = (type, list, nameList) => {
    return list.filter((item) => {
      if (type && nameList.includes(item.warehouseName)) return true;
      if (!type && !nameList.includes(item.warehouseName)) return true;
    });
  };

  // 选择有无仓发库存查询
  const handleChangeDomesticStock = (val) => {
    if (!val) {
      formData.value.minDomesticStock = '';
      formData.value.maxDomesticStock = '';
    }
  };
  // #endregion 类目
  //#region 渲染表格
  //动态计算高度
  // 高度
  const searchCardRef = ref(null);
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCardRef?.value?.$el?.clientHeight;
    return clientHeight - 130 - searchCardHeight;
  });
  const tableRef = ref(null);
  const gridOptions = reactive({
    border: true,
    showOverflow: true,
    loading: false,
    height: height,
    scrollY: {
      gt: tablePage.value.pageSize
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
    columns: [
      { type: 'checkbox', width: 43 },

      {
        field: 'imageUrls',
        title: '商品图片',
        width: 100,
        slots: {
          default: 'aefh_imageUrls'
        }
      },
      {
        field: 'tic',
        title: '标题/产品ID/类目/店铺/备货类型',
        width: 170,
        slots: {
          default: 'aefh_tic'
        }
      },
      {
        field: 'productStatus',
        title: '商品状态',
        width: 70,
        slots: {
          default: 'product_status'
        }
      },
      {
        field: 'sales',
        title: '销量(listing)',
        width: 75,
        slots: {
          default: 'product_sales'
        }
      },
      {
        field: 'skuList',
        resizable: false,
        slots: { header: 'skuList_header', default: 'aefh_skuList' }
      },
      {
        title: '操作',
        width: 80,
        slots: { default: 'aefh_toolbar' }
      }
    ],
    data: []
  });

  const getFormData = () => {
    let obj = {};
    if (formData.value.sellerSkuKey == 'productIdList') {
      obj.productIdList = formData.value.sellerSkuVal
        ? formData.value.sellerSkuVal
            .split(',')
            .filter((item) => item.trim() !== '')
        : [];
    } else if (formData.value.sellerSkuKey == 'sellerSkuList') {
      obj.sellerSkuList = formData.value.sellerSkuVal
        ? formData.value.sellerSkuVal
            .split(',')
            .filter((item) => item.trim() !== '')
        : [];
    } else if (formData.value.sellerSkuKey == 'title') {
      obj.title = formData.value.sellerSkuVal;
    } else if (formData.value.sellerSkuKey == 'prodPSkuList') {
      obj.prodPSkuList = formData.value.sellerSkuVal
        ? formData.value.sellerSkuVal
            .split(',')
            .filter((item) => item.trim() !== '')
        : [];
    }

    // 货品ID/货品条码/货品编码
    obj[formData.value.scItemTypeKey] = formData.value.scItemTypeVal
      ? formData.value.scItemTypeVal.split(',')
      : [];

    // 商品创建时间
    if (formData.value.timeType !== '') {
      if (formData.value.productCreateTime) {
        obj.productCreateTimeLowerBound =
          formData.value.productCreateTime[0] + ' 00:00:00';
        obj.productCreateTimeUpperBound =
          formData.value.productCreateTime[1] + ' 23:59:59';
      }
    } else {
      formData.value.timeType = null;
      obj.productCreateTimeLowerBound = null;
      obj.productCreateTimeUpperBound = null;
    }
    // 刊登数区间
    if (formData.value.storeNumMin === '') {
      formData.value.storeNumMin = null;
    }
    if (formData.value.storeNumMax === '') {
      formData.value.storeNumMax = null;
    }

    // 特殊商品类型
    if (formData.value.specialProductTypeEnum === '') {
      formData.value.specialProductTypeEnum = null;
    }

    // 义乌仓可用属性
    if (formData.value.skuStockIncludeWhole === '') {
      formData.value.skuStockIncludeWhole = null;
    }

    // 欧盟责任人
    if (formData.value.msrEuIdStatus === '') {
      formData.value.msrEuIdStatus = null;
    }

    // 平台库存
    const stockArr = [
      'minJitStock',
      'maxJitStock',
      'minSkuStock',
      'maxSkuStock',
      'minDomesticStock',
      'maxDomesticStock'
    ];
    stockArr.forEach((item) => {
      if (formData.value[item] === '') {
        formData.value[item] = null;
      }
    });

    // 商品资质
    if (formData.value.haveQualification === '') {
      formData.value.haveQualification = null;
    }
    // // 如果部门、销售都选了 没选店铺 就将关联的店铺传过去
    // if (
    //   formData.value.orgId &&
    //   formData.value.salesPersonId &&
    //   !formData.value.storeAcctIdList.length
    // ) {
    //   obj.storeAcctIdList = selectData.value.storeData.map((item) => item.id);
    // }
    // 排序
    obj.orderByEnum = formData.value.orderByEnums + formData.value.orderByType;
    // 义乌仓
    obj[formData.value.yiwuStock + 'LowerBound'] = formData.value.lowerBound;
    obj[formData.value.yiwuStock + 'UpperBound'] = formData.value.upperBound;
    let returnObj = { ...formData.value, ...obj };
    delete returnObj.productCreateTime;
    return returnObj;
  };
  const searchHandle = async (currentPage) => {
    let params = getFormData();

    gridOptions.loading = true;
    gridOptions.scrollY.gt = tablePage.value.pageSize;
    tablePage.value.currentPage = currentPage;
    let res = await aefullyhostedSearchAjax({
      ...params,
      pageSize: tablePage.value.pageSize,
      pageNum: currentPage
    }).finally(() => {
      gridOptions.loading = false;
    });
    //表格数据
    gridOptions.data = (res.data || []).map((item) => ({
      ...item,
      displayCount: 3,
      displayTxt: '展开'
    }));
    tablePage.value.total = res.count || 0;
    //滚动条回到顶部
    setTimeout(() => {
      tableRef.value.$el.querySelector(
        '.vxe-table--body-wrapper.body--wrapper'
      ).scrollTop = 0;
    }, 200);
  };
  //表格分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    tablePage.value.currentPage = currentPage;
    tablePage.value.pageSize = pageSize;
    searchHandle(currentPage, pageSize);
  };
  //表格展示收缩
  const showAllList = async (row) => {
    if (row.displayCount == 3) {
      row.displayCount = row.skuList.length;
      row.displayTxt = '收起';
      return;
    } else {
      row.displayCount = 3;
      row.displayTxt = '展开';
      return;
    }
  };
  //#endregion

  onMounted(async () => {
    initDataApi().then((res) => {
      console.log(res.data);
      // initData.value.orderByList = res.data || [];
      initData.value.orderByList = [
        { name: '创建时间', value: 'CREATE_TIME' },
        { name: '商品库存', value: 'PRODUCT_TATAL_STOCK' },
        { name: 'listing7天销量', value: 'P_SEVEN_SALES' },
        { name: 'listing30天销量', value: 'P_THIRTY_SALES' },
        { name: 'listing60天销量', value: 'P_SIXTY_SALES' },
        { name: 'listing90天销量', value: 'P_NINETY_SALES' },
        {
          name: 'listing180天销量',
          value: 'P_ONE_HUNDRED_AND_EIGHTY_SALES'
        },
        { name: 'sku7天销量', value: 'SEVEN_SALES' },
        { name: 'sku30天销量', value: 'THIRTY_SALES' },
        { name: 'sku60天销量', value: 'SIXTY_SALES' },
        { name: 'sku90天销量', value: 'NINETY_SALES' },
        { name: 'sku180天销量', value: 'ONE_HUNDRED_AND_EIGHTY_SALES' }
      ];
    });
    getAuditFailureTypeEnumApi().then((res) => {
      initData.value.auditFailureTypeEnum = res.data || [];
    });
    // await getDepartmentList();
    await getStoreLists();
    await getCustomersList();
    await getLogisListAttrApi();
    await getSpecialProductTypeEnumOption();

    // 一键复制枚举
    getNeedCopyList();
  });

  const roleNames = 'AE全托管专员';
  const platCode = 'AE全托管';

  //#region 批量操作
  const checkedRowList = ref([]);
  //  修改库存 必须选择一个JIT商品才能进行改库存操作：
  const updateStockVisible = ref(false);
  const handleBatchUpdateStock = () => {
    // 未选择商品toast提示：需要选择一个商品才能改库存！
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('需要选择一个商品才能改库存！');
    }

    // 选择非JIT商品：只有JIT商品才能修改库存，请选择JIT商品(现在可以修改多个JIT商品 勾选的必须都是JIT)
    // if (!checkedList.every((item) => item.productType == 1)) {
    //   return ElMessage.warning('只有JIT商品才能修改库存，请选择JIT商品');
    // }
    // 必须选择一个或多个JIT商品才能进行改库存操作：
    checkedRowList.value = checkedList;
    updateStockVisible.value = true;
  };
  // 批量同步
  const handleBatchSync = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('需要选择一个商品才能改库存！');
    }
    const params = checkedList.map((item) => ({
      storeAcctId: item.storeAcctId,
      productId: item.productId
    }));
    const { data } = await batchSyncApi(params);
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
      ElMessage.success('同步成功');
      searchHandle(1);
    }
  };
  // 批量导出
  // const handleBatchExport = async () => {
  //   let obj = {};
  //   const checkedList = tableRef.value.getCheckboxRecords();
  //   if (checkedList.length) {
  //     obj.productIdList = checkedList.map((item) => item.productId);
  //   } else {
  //     obj = getFormData();
  //   }
  //   transBlob({
  //     fileName: 'AE全托管在线商品导出文件.xlsx',
  //     url: '/lms/aliexpressFullmanage/product/exportList',
  //     data: obj,
  //     contentType: 'application/json'
  //   }).then(() => {
  //     ElMessage.success('操作成功');
  //   });
  // };
  const loading = ref(false);
  const exportDialog = (e) => {
    console.log(e);
    let obj = {};
    if (e.checkedType == '导出列表选中数据') {
      const checkedList = tableRef.value.getCheckboxRecords();
      if (checkedList.length == 0) {
        ElMessage.warning('没有在列表中选中数据，请检查后提交！');
        return false;
      }
      obj.productIdList = checkedList.map((item) => item.productId);
    } else if (e.checkedType == '导出查询条件中的数据') {
      obj = getFormData();
    }
    e.data.forEach(
      (item) => (obj[`${item.field}ExportFields`] = item.checkedData)
    );
    // obj.productExportFields = e.checkedProduct;
    // obj.variationExportFields = e.checkedVariation;
    loading.value = true;
    transBlob({
      fileName: 'AE全托管在线商品导出文件.xlsx',
      url: '/lms/aliexpressFullmanage/product/exportList',
      data: obj,
      contentType: 'application/json'
    }).then(() => {
      loading.value = false;
      ElMessage.success('操作成功');
    });
  };

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

  // 批量修改特殊商品类型
  const checkProdIdList = ref([]);
  const updateSpecialGoodsTypeVisible = ref(false);
  const handleBatchSpecialGoodsType = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    checkProdIdList.value = checkedList.map((item) => item.productId);
    updateSpecialGoodsTypeVisible.value = true;
  };

  // 批量修改标题
  const checkedPIdList = ref([]);
  const showBatchReplaceTitle = ref(false);
  const handleBatchUpdateTitle = () => {
    checkedPIdList.value = [];
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    checkedPIdList.value = checkedList.map((item) => item.productId);
    showBatchReplaceTitle.value = true;
  };

  // // 批量修改描述
  const showBatchReplaceDesc = ref(false);
  const handleBatchDescription = () => {
    checkedPIdList.value = [];
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    checkedPIdList.value = checkedList.map((item) => item.productId);
    showBatchReplaceDesc.value = true;
  };

  // 批量修改欧盟责任人
  const showEUResponsible = ref(false);
  const responseParams = ref({});
  const handleBatchUpdateEUResponsible = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    const storeIdList = new Set(checkedList.map((item) => item.storeAcctId));
    if (storeIdList.size !== 1) {
      return ElMessage.warning('必须选择同一个店铺的数据！');
    }
    responseParams.value = {
      storeAcctId: checkedList[0].storeAcctId,
      storeAcct: checkedList[0].storeAcct,
      leafCategoryIdList: checkedList.map((item) => item.leafCategoryId)
    };
    checkedPIdList.value = checkedList.map((item) => item.productId);
    showEUResponsible.value = true;
  };

  // 批量修改商品资质
  const checkedGoodsCertificationList = ref([]);
  const showGoodsCertification = ref(false);
  const handleBatchGoodsCertification = () => {
    checkedPIdList.value = [];
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    const categoryIdList = new Set(
      checkedList.map((item) => item.leafCategoryId)
    );
    if (categoryIdList.size !== 1) {
      return ElMessage.warning('必须选择同一类目的数据！');
    }
    checkedGoodsCertificationList.value = checkedList;
    showGoodsCertification.value = true;
  };

  // 批量修改重量
  const updateWeightVisible = ref(false);
  const checkedSIdList = ref([]);
  const handleBatchUpdateWeight = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    // 取出所有子表的id
    checkedSIdList.value = checkedList.flatMap((item) =>
      item.skuList.map((son) => son.id)
    );
    updateWeightVisible.value = true;
  };

  // #region 导入货件计划
  const importPlatWhShipmentFile = ref();
  const uploadLoading = ref(false);
  const handleImportPlatWhShipment = (result) => {
    uploadLoading.value = false;
    const { code, msg } = result;
    if (code === '0000') {
      ElMessage.success(msg);
    } else {
      ElMessage.error(msg);
    }
  };
  const handleExportBefore = () => {
    uploadLoading.value = true;
  };
  const handleExportError = (error) => {
    ElMessage.error(error.toString());
    uploadLoading.value = false;
  };
  // #endregion 导入货件计划

  // 导出配置--start
  const aeExportConfigDialog = ref(false);
  const aeExportConfigCheckboxData = ref();
  const aeExportConfig = async () => {
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
            disabled: ['storeSku'],
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
      aeExportConfigCheckboxData.value = obj;
      aeExportConfigDialog.value = true;
      const checkedList = tableRef.value.getCheckboxRecords();
      checkedRowList.value = cloneDeep(checkedList);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const handleLogRuleClose = (e) => {
    aeExportConfigCheckboxData.value = [];
    aeExportConfigDialog.value = e.isShow;
  };
  // 查看日志
  const logVisible = ref(false);
  const handleViewLog = async (row) => {
    checkedRowList.value = [].concat(cloneDeep(row));
    logVisible.value = true;
  };
  const BATCH_BTN_ENUM = [
    {
      label: '修改库存',
      clickFuc: handleBatchUpdateStock
    },
    {
      label: '批量同步',
      clickFuc: handleBatchSync
    },
    {
      label: '批量导出',
      clickFuc: aeExportConfig
    },
    {
      label: '批量修改特殊商品类型',
      clickFuc: handleBatchSpecialGoodsType
    },
    {
      label: '修改标题',
      clickFuc: handleBatchUpdateTitle
    },
    {
      label: '修改描述',
      clickFuc: handleBatchDescription
    }
  ];
  //#endregion 批量操作
</script>

<style lang="scss" scoped>
  .aefullyhosted {
    .search_card {
      margin-bottom: 10px;
      .search_form {
        // width: 1200px;
        .input_divide {
          margin: auto 2px;
          color: #a8abb2;
        }
        .form_input_width {
          :deep(.el-input) {
            width: 50px;
          }
        }
      }
    }
    .right_batch_btns {
      display: flex;
      justify-content: flex-end;
    }
    .product_col {
      display: flex;
      &_status {
        display: flex;
        align-items: center;
      }
    }
    .aefh-theader,
    .aefh-tbody {
      display: flex;
      .aefh-theader-th,
      .aefh-tbody-td {
        flex: none;
        box-sizing: border-box;
        padding: 0 5px;
      }
      // .aefh-theader-th {
      //   text-align: center;
      // }
    }
    .aefh-tbody {
      border-bottom: 1px solid #e8eaec;
      &:last-child {
        border-bottom: none;
      }
    }
    .disflex_space {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
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
    // cascader级联选择器
    :deep(.el-cascader) {
      height: 32px;
      line-height: 32px;
      .el-cascader__tags .el-tag {
        max-width: 120px !important;
        position: relative;
      }
      .el-cascader__tags input {
        // margin-left: 2px;
        min-width: 20px;
      }
      .el-input input {
        height: 32px !important;
      }
    }
    .ml10 {
      margin-left: 10px;
    }
    .gray_text {
      color: #606266;
    }
  }
  .skuStockProperty {
    :deep(.el-input) {
      width: 120px !important;
    }
  }
  .text_red {
    color: #f56c6c;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-start {
    display: flex;
    align-items: flex-start;
  }
  .flex-none {
    flex: none;
  }
  .flex-1 {
    flex: 1;
  }
  .w80 {
    width: 80px;
  }
  .w90 {
    width: 90px;
  }
  .w42 {
    width: 42px;
  }
  .w180 {
    width: 190px;
  }
  .w160 {
    width: 160px;
  }
  .w100 {
    width: 100px;
  }
  .w120 {
    width: 120px;
  }
  .w-200 {
    width: 200px;
  }
  .w60 {
    width: 60px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .my-4 {
    margin: 4px 0;
  }
  .sale_grid {
    display: grid;
    grid-template-columns: repeat(2, auto);
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
  .tagList {
    .el-tag.el-tag--danger {
      margin-left: 5px;
    }
  }
  .flex-column {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .existPlatWarehouse {
    :deep(.el-input__inner) {
      width: 26px;
    }
  }
</style>
