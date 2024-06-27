<template>
  <div class="app-container aefullyhosted">
    <el-card ref="searchCardRef" class="search_card">
      <el-form
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="店铺">
          <ZCascader
            ref="storeRef"
            v-model="formData.storeAcctIds"
            :data="storeList"
          ></ZCascader>
        </el-form-item>
        <el-form-item label="产品ID">
          <el-input
            v-model="formData.productStr"
            class="form_right"
            clearable
          />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="formData.title" class="form_right" clearable />
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.skuType" class="form_left">
            <el-option :value="1" label="店铺子SKU" />
            <el-option :value="2" label="商品子SKU" />
            <el-option :value="3" label="商品父SKU" />
          </el-select>
          <el-input
            v-model="formData.skusStr"
            class="form_right"
            placeholder="支持多个逗号隔开"
            clearable
          />
          <el-switch
            v-model="formData.skuMatchType"
            class="ml-2"
            size="default"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            style="--el-switch-on-color: #13ce66"
            active-text="精确"
            inactive-text="模糊"
          />
        </el-form-item>
        <el-form-item v-if="activeKey !== 3">
          <el-select v-model="formData.scItemType" class="form_left">
            <el-option :value="1" label="货品编码" />
            <el-option :value="2" label="货品条码" />
            <el-option :value="3" label="货品id" />
          </el-select>
          <el-input
            v-model="formData.scItemsStr"
            class="form_right"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="activeKey !== 3"
          prop="jitStockType"
          class="form_range"
        >
          <el-select v-model="formData.jitStockType" class="form_left">
            <el-option :value="1" label="JIT总库存" />
            <el-option :value="2" label="杭州JIT库存" />
          </el-select>
          <el-select v-model="formData.jitStockSkuType" class="form_left">
            <el-option :value="1" label="全部属性" />
            <el-option :value="2" label="部分属性" />
          </el-select>
          <ZInputNumber
            v-model="formData.jitMinStock"
            style="width: 50px"
            placeholder=">="
            clearable
            :precision="0"
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="formData.jitMaxStock"
            style="width: 50px"
            placeholder="<="
            clearable
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="SMT分类" prop="categoryId" style="width: 220px">
          <el-button type="primary" @click="handleChooseCate"
            >选择类目</el-button
          >
          <el-icon class="ml10 gray_text" @click="handleDelCate"
            ><Delete
          /></el-icon>
        </el-form-item>
        <el-form-item prop="priceType" class="form_range">
          <el-select v-model="formData.priceType" class="form_left">
            <el-option value="CNY" label="价格(￥CNY)" />
            <el-option value="USD" label="价格($USD)" />
          </el-select>
          <ZInputNumber
            v-model="formData.minPrice"
            style="width: 50px"
            placeholder=">="
            clearable
            :precision="2"
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="formData.maxPrice"
            style="width: 50px"
            placeholder="<="
            clearable
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="在售状态">
          <el-select
            v-model="formData.onSale"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="停售" :value="0" />
            <el-option label="部分在售" :value="1" />
            <el-option label="在售" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="logisAttrType" class="form_input_width">
          <el-select v-model="formData.logisAttrType" class="form_left">
            <el-option label="商品物流属性(与)" :value="1" />
            <el-option label="商品物流属性(或)" :value="2" />
          </el-select>
          <ZSelect
            v-model="formData.logisAttrs"
            style="width: 120px"
            class="logisAttrListSelect"
            :items="logisAttrListOption"
            :num="1"
          />
        </el-form-item>
        <el-form-item prop="stockType" class="form_range">
          <el-select v-model="formData.stockType" class="form_left">
            <el-option :value="1" label="义乌仓库存(可用)" />
            <el-option :value="2" label="义乌仓库存(在途)" />
            <el-option :value="3" label="义乌仓库存(未派)" />
          </el-select>
          <el-select v-model="formData.stockSkuType" class="form_left">
            <el-option :value="1" label="全部属性" />
            <el-option :value="2" label="部分属性" />
          </el-select>
          <ZInputNumber
            v-model="formData.minStock"
            style="width: 115px"
            placeholder=">="
            clearable
            :precision="0"
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="formData.maxStock"
            style="width: 115px"
            placeholder="<="
            clearable
            :precision="0"
          />
        </el-form-item>
        <el-form-item prop="predictSaleDayType" class="form_input_width">
          <el-select v-model="formData.predictSaleDayType" class="form_left">
            <el-option :value="1" label="预计可售天数(全部属性)" />
            <el-option :value="2" label="预计可售天数(部分属性)" />
          </el-select>
          <ZInputNumber
            v-model="formData.minPredictSaleDay"
            style="width: 100px"
            placeholder=">="
            clearable
            :precision="1"
          />
          <span class="range_link"> - </span>
          <ZInputNumber
            v-model="formData.maxPredictSaleDay"
            style="width: 100px"
            placeholder="<="
            clearable
            :precision="1"
          />
        </el-form-item>
        <el-form-item prop="timeType">
          <el-select
            v-model="formData.timeType"
            class="form_left"
            clearable
            filterable
          >
            <el-option :value="1" label="刊登时间" />
            <el-option :value="2" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="formData.productTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 200px"
            class="form_right"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item v-if="activeKey === 1">
          <el-select v-model="formData.orderType" class="form_left">
            <el-option :value="1" label="按父sku排序" />
            <el-option :value="2" label="按子sku排序" />
          </el-select>
          <el-select
            v-model="formData.order"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in PRODUCT_ORDER"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="activeKey !== 3">
          <el-select
            v-model="formData.specialProductSearchType"
            class="form_left"
          >
            <el-option :value="1" label="特殊商品类型(与)" />
            <el-option :value="2" label="特殊商品类型(或)" />
          </el-select>
          <el-select
            v-model="formData.specialProductTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
          >
            <el-option
              v-for="label in SPECIAL_PRODUCT_TYPE_LIST"
              :key="label"
              :value="label"
              :label="label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select
            v-model="formData.productStatus"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in productStatusEnum"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="activeKey !== 1">
          <el-select v-model="formData.orderType" class="form_left">
            <el-option :value="3" label="正序排序" />
            <el-option :value="4" label="倒序排序" />
          </el-select>
          <el-select v-model="formData.order" placeholder="请选择" clearable>
            <el-option :value="1" label="刊登时间" />
            <el-option
              v-for="item in WAITINGJOIN_ORDER"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="activeKey !== 1" class="form_input_width">
          <el-select v-model="formData.salesSourceType" class="form_left">
            <el-option :value="1" label="速卖通销量" />
            <el-option :value="2" label="公司销量" />
            <el-option :value="3" label="公司销量(美国)" />
          </el-select>
          <el-select v-model="formData.salesCountType" class="form_left">
            <el-option :value="1" label="7天" />
            <el-option :value="2" label="30天" />
            <el-option :value="3" label="60天" />
            <el-option :value="4" label="90天" />
            <el-option :value="5" label="180天" />
          </el-select>
          <ZInputNumber
            v-model="formData.minSalesCount"
            style="width: 80px"
            placeholder=">="
            clearable
            :precision="1"
          />
          <span class="range_link"> - </span>
          <ZInputNumber
            v-model="formData.maxSalesCount"
            style="width: 80px"
            placeholder="<="
            clearable
            :precision="1"
          />
        </el-form-item>
        <el-form-item
          v-if="activeKey === 3"
          prop="joinLogType"
          label="加入日志"
        >
          <el-select v-model="formData.joinLogType">
            <el-option :value="1" label="加入失败" />
            <el-option :value="2" label="未加入" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === 1"
          label="重量待调整"
          prop="weightOutDate"
        >
          <el-select v-model="formData.weightOutDate" clearable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === 1"
          prop="profitStart"
          class="form_range"
          label="利润(￥)"
        >
          <ZInputNumber
            v-model="formData.profitStart"
            style="width: 50px"
            placeholder=">="
            clearable
            :precision="2"
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="formData.profitEnd"
            style="width: 50px"
            placeholder="<="
            clearable
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          v-if="activeKey === 1"
          prop="profitRateStartStr"
          class="form_range"
          label="利润率"
        >
          <ZInputNumber
            v-model="formData.profitRateStartStr"
            style="width: 50px"
            placeholder=">="
            clearable
            :precision="2"
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="formData.profitRateEndStr"
            style="width: 50px"
            placeholder="<="
            clearable
            :precision="2"
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
        <br />
        <div v-if="formData.cateTreeName" class="text_red mb-4">
          {{ formData.cateTreeName }}
        </div>
      </el-form>
    </el-card>
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
            :key="item.status"
            :label="
              item.count !== '' && activeKey == item.status
                ? `${item.label}(${item.count})`
                : `${item.label}(0)`
            "
            :name="item.status"
          >
          </el-tab-pane>
        </el-tabs>
        <vxe-grid ref="tableRef" v-bind="gridOptions">
          <!-- 图片 -->
          <template #aefh_imageUrls="{ row }">
            <ImagePop :src="row.mainImageUrl" />
          </template>
          <!-- 标题/商品编号/类目/店铺/备货类型 -->
          <template #aefh_tic="{ row }">
            <div>
              <el-tag
                v-if="row.weightOutDate && activeKey === 1"
                class="my-4"
                type="danger"
                size="small"
                >重量待调整</el-tag
              >
              <div>{{ row.title }}</div>
              <div class="relative">
                <a
                  :href="row.productUrl"
                  style="cursor: pointer"
                  target="_blank"
                  >{{ row.productId }}</a
                >
                <el-icon
                  class="copy_icon"
                  color="#aaa"
                  @click="copy(row.productId)"
                  ><CopyDocument
                /></el-icon>
                <div
                  v-if="activeKey !== 3"
                  class="regional_box"
                  @click="openRegionalPrice(row.productId)"
                >
                  <el-tag effect="dark">区</el-tag>
                </div>
              </div>
              <div>{{ row.cateTreeName }}</div>
              <div style="margin: 6px 0">
                <span style="font-weight: bold">店铺</span>
                :{{ row.storeAcct }}
              </div>
              <div>
                <span style="font-weight: bold">销售</span>
                :{{ row.salesperson }}
              </div>
            </div>
          </template>
          <!-- 销量 -->
          <template #product_sales="{ row }">
            <div v-if="activeKey === 1">
              <div>7天：{{ row.sevenDaySales }}</div>
              <div>30天：{{ row.thirtyDaySales }}</div>
              <div>60天：{{ row.sixtyDaySales }}</div>
              <div>90天：{{ row.ninetyDaySales }}</div>
              <div>180天：{{ row.oneHundredEightyDaySales }}</div>
            </div>
          </template>
          <!-- 均单利率 -->
          <template #average_rate="{ row }">
            <div>{{ row.profitMoney }}</div>
          </template>
          <!-- 利润率 -->
          <template #interest_rate="{ row }">
            <div>{{ row.profitPercentage }}%</div>
          </template>
          <!-- 自定义skuList表头skuList_header -->
          <template #skuList_header>
            <div class="aefh-theader">
              <div v-if="activeKey !== 3" class="aefh-theader-th w80">
                SKU图片
              </div>
              <div class="aefh-theader-th w180">SKU</div>
              <div v-if="activeKey !== 3" class="aefh-theader-th w160">
                货品信息
              </div>
              <div class="aefh-theader-th w100">SKU属性</div>
              <div class="aefh-theader-th w90">人员</div>
              <div class="aefh-theader-th w100 flex-column">
                <div>成本(￥)/</div>
                <div>重量(g)</div>
              </div>
              <div
                v-show="activeKey === 3"
                class="aefh-theader-th w100 flex-center"
              >
                <div>价格</div>
                <div>(*代表listing当前币种)</div>
              </div>
              <div
                v-show="activeKey === 1"
                class="aefh-theader-th w100 flex-center"
              >
                <div>价格/利润</div>
              </div>
              <div v-if="activeKey !== 3" class="aefh-theader-th w100">
                JIT库存
              </div>
              <div class="aefh-theader-th w100">义乌仓库存</div>
              <div v-if="activeKey === 1" class="w90">销量(sku)</div>
            </div>
          </template>
          <!-- 自定义skuList展示 -->
          <template #aefh_skuList="{ row }">
            <div>
              <div v-if="row.skus?.length > 0">
                <div
                  v-for="item in row.skus.slice(0, row.displayCount)"
                  :key="item.id"
                  class="aefh-tbody"
                >
                  <div v-if="activeKey !== 3" class="aefh-tbody-td w80">
                    <ImagePop :src="item.skuImage" width="60px" height="60px" />
                  </div>
                  <div class="aefh-tbody-td w180">
                    <div class="flex-column">
                      <div class="flex tagList">
                        <div>店铺: {{ item.storeSSku }}</div>
                        <div
                          v-if="
                            item.logisAttrList &&
                            item.logisAttrList.split(',').length > 0
                          "
                          style="display: flex"
                        >
                          <div
                            v-for="val in item.logisAttrList?.split(',')"
                            :key="val"
                          >
                            <el-popover
                              v-if="val"
                              placement="top-start"
                              trigger="hover"
                              :width="200"
                              :content="`物流属性:${val}`"
                            >
                              <template #reference>
                                <el-tag v-show="val !== '普货'" type="danger">
                                  {{ getAttrTag(val) }}</el-tag
                                >
                              </template>
                            </el-popover>
                          </div>
                        </div>
                      </div>
                      <div class="flex tagList">
                        <div>商品: {{ item.prodSSku }}</div>
                        <el-icon
                          v-if="item.prodSSku"
                          class="copy_icon"
                          color="#aaa"
                          @click="copy(item.prodSSku)"
                          ><CopyDocument
                        /></el-icon>
                        <el-tag
                          v-if="activeKey === 3 && item.isSale === false"
                          type="danger"
                        >
                          停</el-tag
                        >
                      </div>
                      <div v-if="activeKey !== 3">sku_id: {{ item.skuId }}</div>
                    </div>
                  </div>
                  <div v-if="activeKey !== 3" class="aefh-tbody-td w160">
                    <div>货品id: {{ item.scItem?.scItemId }}</div>
                    <div>货品条码: {{ item.scItem?.scItemBarCode }}</div>
                    <div>货品编码: {{ item.scItem?.scItemCode }}</div>
                  </div>

                  <div class="aefh-tbody-td w100">
                    <div
                      v-for="(propertyItem, pIndex) in item.skuProperties"
                      :key="pIndex"
                    >
                      <div>
                        <span v-if="activeKey !== 3">
                          {{ propertyItem.skuPropertyName }}:</span
                        >
                        {{ propertyItem.skuPropertyValue }}
                      </div>
                    </div>
                  </div>
                  <div class="aefh-tbody-td w90">
                    <div>开发: {{ item?.bizzOwner || '' }}</div>
                    <div>采购: {{ item?.buyer || '' }}</div>
                    <div>责任: {{ item?.responsor || '' }}</div>
                  </div>
                  <div class="aefh-tbody-td w100">
                    <div>采购: {{ item?.purchaseCostPrice || '' }}</div>
                    <div>毛重: {{ item?.grossWeight || '' }}</div>
                    <div>在线: {{ item?.packageWeight }}</div>
                  </div>
                  <div class="aefh-tbody-td w100">
                    <div
                      v-for="(priceItem, pIndex) in item?.prices"
                      :key="pIndex"
                    >
                      <span v-if="priceItem.current">*</span>
                      <span>
                        {{ priceItem?.currencySign }}{{ priceItem?.currency }}:
                        {{ priceItem?.price }}
                      </span>
                    </div>
                    <div v-show="activeKey === 1">
                      <div>￥利润: {{ item.profit }}</div>
                      <div>利润率: {{ item.profitRateStr }}</div>
                    </div>
                  </div>
                  <div v-if="activeKey !== 3" class="aefh-tbody-td w100">
                    <div
                      v-for="childItem in item?.jitStocks"
                      :key="childItem.warehouseCode"
                    >
                      <span>{{ childItem?.warehouseName }}</span>
                      <span>:</span>
                      <span>{{ childItem?.sellableQuantity }}</span>
                    </div>
                  </div>
                  <div class="aefh-tbody-td w100">
                    <div>可用: {{ item?.availableStock }}</div>
                    <div>在途: {{ item?.orderNotInNum }}</div>
                    <div>未派: {{ item?.lackUnPaiNum }}</div>
                    <div>可售天数: {{ item?.predictSaleDay }}</div>
                  </div>
                  <div v-if="activeKey === 1" class="w90">
                    <div class="flex-start">
                      <span class="w42 flex-none">7天:</span>
                      <span class="flex-1">{{ item?.sevenDaySales }}</span>
                    </div>
                    <div class="flex-start">
                      <span class="w42 flex-none">30天: </span>
                      <span class="flex-1">{{ item?.thirtyDaySales }}</span>
                    </div>
                    <div class="flex-start">
                      <span class="w42 flex-none">60天:</span>
                      <span class="flex-1">{{ item?.sixtyDaySales }}</span>
                    </div>
                    <div class="flex-start">
                      <span class="w42 flex-none">90天:</span>
                      <span class="flex-1">{{ item?.ninetyDaySales }}</span>
                    </div>
                    <div class="flex-start">
                      <span class="w42 flex-none">180天:</span>
                      <span class="flex-1">{{
                        item?.oneHundredEightyDaySales
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>无子数据</div>
              <div v-if="row.skus && row.skus?.length > 3" class="aefh-tbody">
                <el-button type="primary" text @click="showAllList(row)">
                  {{ row.displayTxt }}({{ row.skus?.length }})
                </el-button>
              </div>
            </div>
          </template>
          <template #sales_header>
            <div class="flex-center">
              <div>销量</div>
              <div>速卖通/公司/公司(美国)</div>
            </div>
          </template>
          <template #sales_content="{ row }">
            <div v-if="activeKey !== 1" class="flex-1">
              <div class="flex-start">
                <span class="w42 flex-none">7天:</span>
                <span class="flex-1"
                  >{{ row?.sevenDaySales }}/{{ row?.sevenDaySalesCompany }}/{{
                    row?.sevenDaySalesCompanyUs
                  }}</span
                >
              </div>
              <div class="flex-start">
                <span class="w42 flex-none">30天: </span>
                <span class="flex-1"
                  >{{ row?.thirtyDaySales }}/{{ row?.thirtyDaySalesCompany }}/{{
                    row?.thirtyDaySalesCompanyUs
                  }}</span
                >
              </div>
              <div class="flex-start">
                <span class="w42 flex-none">60天:</span>
                <span class="flex-1"
                  >{{ row?.sixtyDaySales }}/{{ row?.sixtyDaySalesCompany }}/{{
                    row?.sixtyDaySalesCompanyUs
                  }}</span
                >
              </div>
              <div class="flex-start">
                <span class="w42 flex-none">90天:</span>
                <span class="flex-1"
                  >{{ row?.ninetyDaySales }}/{{ row?.ninetyDaySalesCompany }}/{{
                    row?.ninetyDaySalesCompanyUs
                  }}</span
                >
              </div>
              <div class="flex-start">
                <span class="w42 flex-none">180天:</span>
                <span class="flex-1"
                  >{{ row?.oneHundredEightyDaySales }}/{{
                    row?.oneHundredEightyDaySalesCompany
                  }}/{{ row?.oneHundredEightyDaySalesCompanyUs }}</span
                >
              </div>
            </div>
          </template>
          <template #aefh_time="{ row }">
            <div>
              <div>
                <div>刊登时间：</div>
                <p>
                  {{
                    transferDate(
                      row.productCreateTime,
                      (isTime = true),
                      (type = '/')
                    )
                  }}
                </p>
              </div>
              <div>
                <div>修改时间：</div>
                <p>
                  {{
                    transferDate(
                      row.productModifiedTime,
                      (isTime = true),
                      (type = '/')
                    )
                  }}
                </p>
              </div>
            </div>
          </template>
          <template #aefh_toolbar="{ row }">
            <div>
              <el-button type="primary" @click="handleUpdateSync(row, 1)"
                >更新</el-button
              >
              <el-button
                v-if="
                  row.joinedProductTab === 2 ||
                  row.joinedProductTab === 5 ||
                  row.joinedProductTab === 6
                "
                v-permission="['aeHalfBatchJoinRightNow']"
                type="primary"
                @click="handleJoinRightNow(1, row)"
                >立即加入</el-button
              >
              <el-button type="primary" @click="handleViewLog(row)"
                >日志</el-button
              >
            </div>
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
              :page-sizes="[20, 100, 200, 300, 1000, 2000, 3000]"
              :total="tablePage.total"
              @page-change="handlePageChange"
            >
            </vxe-pager>
          </template>
        </vxe-grid>
      </div>
      <div class="tools_btn">
        <el-dropdown
          v-if="activeKey === 1"
          trigger="click"
          style="margin: 0 10px"
        >
          <el-button type="primary" :loading="storePriceLoading">
            店铺调价<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleBatchDownloadTemp"
                ><span v-permission="['aeHalfBatchDownloadTemp']"
                  >下载模板</span
                ></el-dropdown-item
              >
              <el-upload
                v-permission="['aeHalfBatchImportTemp']"
                :show-file-list="false"
                class="mr10"
                :action="'/api/lms/aliexpressHalfManage/product/adjustByExcel'"
                :on-success="handleImportStorePrice"
                :before-upload="handleImportStorePriceBefore"
                :on-error="handleImportStorePriceError"
              >
                <el-button>导入模板</el-button>
              </el-upload>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-upload
          v-model:file-list="importPlatWhShipmentFile"
          v-permission="['aehalfhostedonlineproductImportPlatWhShipment']"
          class="mr10"
          accept="xlsx,xls"
          :show-file-list="false"
          :data="{ platCode: 'AE半托管' }"
          action="/api/lms/aliexpress/whShipment/importPlatWhShipment"
          :on-success="handleImportPlatWhShipment"
          :before-upload="handleExportBefore"
          :on-error="handleExportError"
        >
          <el-button
            v-if="activeKey === 1"
            type="primary"
            :loading="uploadLoading"
            >导入货件计划</el-button
          >
        </el-upload>
        <el-dropdown trigger="click" style="margin: 0 10px">
          <el-button type="primary">
            批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleUpdateSync({}, 2)"
                ><span v-permission="['aeHalfBatchUpdateAsync']"
                  >批量同步</span
                ></el-dropdown-item
              >
              <el-dropdown-item
                v-if="activeKey !== 3"
                @click="handleBatchUpdateStock()"
                ><span v-permission="['aeHalfBatchUpdateStock']"
                  >修改库存</span
                ></el-dropdown-item
              >
              <el-dropdown-item
                v-if="activeKey !== 3"
                @click="handleBatchLogistics()"
                ><span v-permission="['aeHalfBatchUpdateLogistics']"
                  >修改物流信息</span
                ></el-dropdown-item
              >
              <el-dropdown-item
                v-if="activeKey !== 3"
                @click="handleBatchPrice()"
                ><span v-permission="['aeHalfBatchUpdatePrice']"
                  >修改价格</span
                ></el-dropdown-item
              >
              <el-dropdown-item
                v-if="activeKey !== 1"
                @click="handleJoinRightNow(0, {})"
                ><span v-permission="['aeHalfBatchJoinRightNow']"
                  >立即加入</span
                ></el-dropdown-item
              >
              <el-dropdown-item v-if="activeKey === 1" @click="handleExport"
                ><span v-permission="['aeHalfBatchExport']"
                  >批量导出</span
                ></el-dropdown-item
              >
              <el-dropdown-item
                v-if="activeKey === 1"
                @click="handleBatchUpdateWeight"
                ><span v-permission="['aeHalfBatchWeight']"
                  >修改重量</span
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-card>
    <!-- 类目组件 -->
    <CateByDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :get-cate-api="getSmtCateByApi"
      :store-acct-id-list="formData.storeAcctIds"
      plat-code="AE半托管"
      @close-dialog="handleCateDialogClose($event)"
    />
    <!-- 查看日志 -->
    <LogDialog
      v-model="logVisible"
      :checked-row-list="checkedRowList"
      :active-key="activeKey"
    />

    <!-- 物流信息 -->
    <BatchLogisticsInfo
      v-model="logisticsVisible"
      :product-id-list="checkedLogisticsIdList"
      @handle-search="searchHandle(1)"
    />

    <!-- 区域定价 -->
    <RegionalPriceDialog
      v-model="regionalPriceVisible"
      :select-product-id="selectProductId"
    />

    <!-- 库存 -->
    <BatchUpdateStock
      v-model="updateStockVisible"
      :checked-row-list="checkedParamsList"
      :active-key="activeKey"
      :joined-product-tab-list="joinedProductTabList"
      @handle-search="searchHandle(1)"
    />

    <!-- 修改价格 -->
    <BatchUpdatePrice
      v-model="batchPriceVisible"
      :select-records="selectRecords"
      :active-key="activeKey"
      :joined-product-tab-list="joinedProductTabList"
      @handle-search="searchHandle(1)"
    />

    <!-- 立即加入 -->
    <BatchJoinRightNow
      v-model="joinRightNowVisible"
      :select-records="selectRecords"
      :join-right-now-type="joinRightNowType"
      @handle-search="searchHandle(1)"
    />

    <!-- 导出配置 -->
    <ExportConfig
      v-if="adsConfigDialog"
      :show-dialog="adsConfigDialog"
      config-type="PUBLISHS_AEHALFHOSTED_ONLINE_PRODUCT_EXPORT"
      :checkbox-data="adsExportConfigList"
      title="导出listing数据"
      :checked-row-list="checkedRowList"
      :loading="adsExportLoading"
      :use-default-value="true"
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

<script setup name="publishsaehalfhostedonlineproduct">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { getStoreList, getMsgFreightTemplateSmtList } from '@/api/common';
  import { getLogisAttrEnum } from '@/api/publishs/miraviapublish';
  import {
    aefullyhostedSearchAjax,
    getSmtCateByApi,
    getAuditFailureTypeEnumApi,
    getSpecialGoodsEnumType,
    getProductSyncApi,
    getProductStatusEnumApi,
    batchCopyList,
    getExportHeaderApi
  } from '@/api/publishs/aehalfhosted';
  // import { getAdsExportFieldsApi } from '@/api/shopee/adsinfo';
  import { ElMessage } from 'element-plus';
  import { shortcuts } from '@/api/common';
  import ImagePop from '@/components/ImagePop/index.vue';
  import CateByDialog from '@/components/CateByStore/index.vue';
  import LogDialog from './components/LogDialog.vue';
  import { copy, transferDate } from '@/utils/common';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import ZSelect from '@/components/ZSelect/index.vue';
  import RegionalPriceDialog from './components/RegionalPriceDialog.vue';
  import { PRODUCT_ORDER, WAITINGJOIN_ORDER } from './config.js';
  import { cloneDeep } from 'lodash-es';
  import BatchUpdateStock from './components/BatchUpdateStock.vue';
  import BatchLogisticsInfo from './components/BatchLogisticsInfo.vue';
  import BatchUpdatePrice from './components/BatchUpdatePrice.vue';
  import BatchJoinRightNow from './components/BatchJoinRightNow.vue';
  import { transBlob } from '@/utils/downloadFile';
  import ExportConfig from '@/components/ExportConfig/index.vue';
  import BatchUpdateWeight from './components/BatchUpdateWeight.vue';

  const SPECIAL_PRODUCT_TYPE_LIST = [
    '普货',
    '内电',
    '弱磁',
    '液体',
    '粉末',
    '膏体'
  ];
  //#region  常量枚举
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
    storeAcctIds: [],
    productStr: '',
    productIds: [],
    title: '',
    skuType: 1,
    skus: [],
    skusStr: '', // sku逗号隔开
    skuMatchType: 1, // sku查询精确/模糊
    scItemType: 1, // 货品编码
    scItems: [], // 输入货品值
    scItemsStr: '', // 货品值逗号隔开
    jitStockType: 1, // JIT总库存
    jitStockSkuType: 2, // JIT库存属性
    jitMinStock: '',
    jitMaxStock: '',
    categoryId: null,
    cateTreeName: '',
    priceType: 'CNY',
    minPrice: '',
    maxPrice: '',
    logisAttrType: 1,
    logisAttrs: [],
    stockType: 1,
    stockSkuType: 2,
    minStock: '',
    maxStock: '',
    predictSaleDayType: 2,
    minPredictSaleDay: '',
    maxPredictSaleDay: '',
    onSale: '', //在售状态
    timeType: 1,
    productTime: '', // 创建时间
    startTime: '',
    endTime: '',
    orderType: 1,
    order: '',
    specialProductSearchType: 1, // 特殊商品类型
    specialProductTypeList: [],
    productStatus: '', // 商品状态
    salesSourceType: 1, // 销量
    salesCountType: 1,
    minSalesCount: '',
    maxSalesCount: '',
    joinLogType: '',
    includingPlatFreightFeeFlag: '', // 物流佣金
    weightOutDate: '', // 重量待调整
    profitStart: '', // 利润
    profitEnd: '',
    profitRateStartStr: '', // 利润率
    profitRateEndStr: ''
  });

  // tab list
  const tabList = ref([
    { label: '已加入', count: '', status: 1, index: 0 },
    { label: '可加入', count: '', status: 3, index: 1 }
  ]);

  const activeKey = ref(1);
  const joinedProductTabList = ref([1]);
  const tabIndex = ref(0);
  const oldStoreAcctIds = ref([]);
  // 切换 tab
  const changeTab = (tab) => {
    oldStoreAcctIds.value = formData.value.storeAcctIds;
    activeKey.value = Number(tab.props.name);

    changeTableCols();
    if (activeKey.value === 3) {
      joinedProductTabList.value = [2, 3, 5];
    } else {
      joinedProductTabList.value = [activeKey.value];
      // 可加入页签 加入失败日志查询
      formData.value.joinLogType = null;
    }
    tabIndex.value = Number(tab.index);
    tablePage.value.currentPage = 1;

    // 切换至待加入/已预约页面 保留公共查询条件 其余重置
    resetFormExceptStore();
    if (activeKey.value !== 1) {
      formData.value.orderType = 3;
      formData.value.salesSourceType = 1;
      formData.value.salesCountType = 1;
      formData.value.joinOrder = 1;
    } else {
      formData.value.orderType = 1;
    }

    searchHandle(1);
  };

  const changeTableCols = () => {
    if (activeKey.value === 1) {
      allColumns.value = columnArr1
        .concat(columnArr2)
        .concat(columnArr4)
        .concat(columnArr6);
    } else if (activeKey.value === 3) {
      allColumns.value = columnArr1
        .concat(columnArr3)
        .concat(columnArr4)
        .concat(columnArr5)
        .concat(columnArr6);
    }
    tableRef.value.reloadColumn(gridOptions.columns);
  };

  const resetFormExceptStore = () => {
    const _formData = {
      scItemType: 1, // 货品编码
      scItems: [], // 输入货品值
      scItemsStr: '', // 货品值逗号隔开
      jitStockType: 1, // JIT总库存
      jitStockSkuType: 2, // JIT库存属性
      jitMinStock: '',
      jitMaxStock: '',
      timeType: 1,
      productTime: '', // 创建时间
      startTime: '',
      endTime: '',
      orderType: 1,
      order: '',
      specialProductSearchType: 1, // 特殊商品类型
      specialProductTypeList: [],
      salesSourceType: 1, // 销量
      minSalesCount: '',
      maxSalesCount: '',
      joinLogType: '',
      includingPlatFreightFeeFlag: '',
      weightOutDate: ''
    };

    Object.keys(_formData).forEach((key) => {
      formData.value[key] = _formData[key];
    });

    formData.value.storeAcctIds = oldStoreAcctIds.value;
    if (activeKey.value !== 1) {
      formData.value.salesSourceType = 1;
      formData.value.salesCountType = 1;
    }
  };

  // 获取需要复制的枚举值
  const needCopyList = ref([]);
  const getNeedCopyList = () => {
    // const { data } = await getBatchCopyEnum();
    needCopyList.value = [
      {
        code: 1,
        fieldName: '产品id'
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
      ? { productIds: checkedList.map((item) => item.productId) }
      : {};

    // 查询条件
    let formDatas = getFormData();

    const { code, msg } = await batchCopyList({
      batchCopyFieldCode: copyCode,
      ...formDatas,
      ...params,
      joinedProductTabList: joinedProductTabList.value
    });
    if (code === '0000') {
      // 复制到粘贴板
      copy(msg);
    }
  };

  // 打开区域定价弹窗
  const regionalPriceVisible = ref(false);
  const selectProductId = ref('');
  const openRegionalPrice = (pId) => {
    regionalPriceVisible.value = true;
    selectProductId.value = pId;
  };

  // 获取店铺
  const storeList = ref([]);
  const getStoreListOption = async () => {
    try {
      const params = 'AE' + encodeURIComponent('半托管');
      const { data } = await getStoreList(params);
      storeList.value = data?.children;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取商品物流属性
  const logisAttrListOption = ref([]);
  const getMsgFreightTemplateSmtListOption = async () => {
    const { data } = await getMsgFreightTemplateSmtList();
    logisAttrListOption.value = data?.logisAttrList.map((item) => ({
      id: item.name,
      name: item.name
    }));
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

  // 获取商品状态枚举值
  const productStatusEnum = ref({});
  const getProductStatusEnum = async () => {
    const { data } = await getProductStatusEnumApi();
    productStatusEnum.value = Object.keys(data).map((key) => {
      return {
        label: data[key],
        value: key
      };
    });
  };

  const storeRef = ref(null);
  const resetHostedForm = () => {
    formData.value = {
      storeAcctIds: [],
      productStr: '',
      productIds: [],
      title: '',
      skuType: 1,
      skus: [],
      skusStr: '', // sku逗号隔开
      scItemType: 1, // 货品编码
      scItems: [], // 输入货品值
      scItemsStr: '', // 货品值逗号隔开
      jitStockType: 1, // JIT总库存
      jitStockSkuType: 2, // JIT库存属性
      jitMinStock: '',
      jitMaxStock: '',
      categoryId: null,
      cateTreeName: '',
      priceType: 'CNY',
      minPrice: '',
      maxPrice: '',
      logisAttrType: 1,
      logisAttrs: [],
      stockType: 1,
      stockSkuType: 2,
      minStock: '',
      maxStock: '',
      predictSaleDayType: 2,
      minPredictSaleDay: '',
      maxPredictSaleDay: '',
      onSale: '', //在售状态
      timeType: 1,
      productTime: '', // 创建时间
      startTime: '',
      endTime: '',
      order: '',
      joinLogType: '',
      specialProductSearchType: 1,
      includingPlatFreightFeeFlag: '',
      profitStart: '', // 利润
      profitEnd: '',
      profitRateStartStr: '', // 利润率
      profitRateEndStr: ''
    };

    if (activeKey.value === 1) {
      formData.value.orderType = 1;
    }
    if (activeKey.value !== 1) {
      formData.value.orderType = 3;
      formData.value.salesSourceType = 1;
      formData.value.salesCountType = 1;
    }
  };
  //#endregion

  //#region 类目
  const showCateDialog = ref(false);
  const handleCateDialogClose = (e) => {
    if (!e.cate) {
      showCateDialog.value = e.isShow;
      return;
    }
    formData.value.categoryId = e.cate.value;
    formData.value.cateTreeName = e.cate.pathLabels.join('>>');
    showCateDialog.value = e.isShow;
  };
  const handleChooseCate = () => {
    showCateDialog.value = true;
  };
  const handleDelCate = () => {
    formData.value.categoryId = null;
    formData.value.cateTreeName = '';
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
    return clientHeight - 128 - searchCardHeight;
  });
  const tableRef = ref(null);
  const allColumns = ref([]);

  let columnArr1 = [
    { type: 'checkbox', width: 43 },

    {
      field: 'mainImageUrl',
      title: '商品图片',
      width: 100,
      slots: {
        default: 'aefh_imageUrls'
      }
    },
    {
      field: 'tic',
      title: '标题/产品ID/类目/店铺',
      width: 180,
      slots: {
        default: 'aefh_tic'
      }
    }
  ];

  let columnArr2 = [
    {
      field: 'sales',
      title: '销量(listing)',
      width: 100,
      slots: {
        default: 'product_sales'
      }
    }
  ];

  let columnArr3 = [
    {
      field: 'profitMoney',
      title: '均单利润',
      resizable: false,
      width: 100,
      slots: { default: 'average_rate' }
    },
    {
      field: 'profitPercentage',
      title: '利润率',
      resizable: false,
      width: 100,
      slots: { default: 'interest_rate' }
    }
  ];

  let columnArr4 = [
    {
      field: 'skuList',
      resizable: false,
      slots: { header: 'skuList_header', default: 'aefh_skuList' }
    }
  ];

  let columnArr5 = [
    {
      field: 'salesCompany',
      width: 150,
      resizable: false,
      slots: { header: 'sales_header', default: 'sales_content' }
    }
  ];
  let columnArr6 = [
    {
      title: '时间',
      width: 120,
      slots: { default: 'aefh_time' }
    },
    {
      title: '操作',
      width: 110,
      slots: { default: 'aefh_toolbar' }
    }
  ];

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
    columns: allColumns,
    data: []
  });

  const getFormData = () => {
    let obj = {};
    if (formData.value.productStr) {
      obj.productIds = formData.value.productStr
        .split(',')
        .filter((item) => item.trim() !== '');
    } else {
      obj.productIds = [];
    }

    if (formData.value.skusStr) {
      obj.skus = formData.value.skusStr
        .split(',')
        .filter((item) => item.trim() !== '');
    } else {
      obj.skus = [];
    }

    if (formData.value.scItemsStr) {
      obj.scItems = formData.value.scItemsStr
        .split(',')
        .filter((item) => item.trim() !== '');
    } else {
      obj.scItems = [];
    }

    // 特殊商品类型
    if (formData.value.specialProductSearchType === '') {
      formData.value.specialProductSearchType = null;
    }

    // 商品创建时间
    if (formData.value.timeType !== '') {
      if (formData.value.productTime) {
        obj.startTime = formData.value.productTime[0] + ' 00:00:00';
        obj.endTime = formData.value.productTime[1] + ' 23:59:59';
      }
    } else {
      formData.value.timeType = null;
      obj.startTime = null;
      obj.endTime = null;
    }

    let returnObj = { ...formData.value, ...obj };
    delete returnObj.productTime;
    delete returnObj.skusStr;
    delete returnObj.productStr;
    return returnObj;
  };

  // 查询
  const searchHandle = async (currentPage) => {
    gridOptions.loading = true;
    let params = getFormData();

    gridOptions.scrollY.gt = tablePage.value.pageSize;
    tablePage.value.currentPage = currentPage;
    let { data } = await aefullyhostedSearchAjax({
      ...params,
      pageSize: tablePage.value.pageSize,
      pageNum: currentPage,
      joinedProductTabList: joinedProductTabList.value
    }).finally(() => {
      gridOptions.loading = false;
    });
    //表格数据
    gridOptions.data = data.result?.map((item) => ({
      ...item,
      displayCount: 3,
      displayTxt: '展开'
    }));
    tablePage.value.total = data.totalCount || 0;
    getTabCount(tablePage.value.total);

    //滚动条回到顶部
    setTimeout(() => {
      tableRef.value.$el.querySelector(
        '.vxe-table--body-wrapper.body--wrapper'
      ).scrollTop = 0;
    }, 200);
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount > 1000000 ? '>1000000' : totalCount;
      }
    });
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
      row.displayCount = row.skus?.length;
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
    getAuditFailureTypeEnumApi().then((res) => {
      initData.value.auditFailureTypeEnum = res.data || [];
    });
    changeTableCols();
    await getStoreListOption();
    await getMsgFreightTemplateSmtListOption();
    await getLogisListAttrApi();
    await getSpecialProductTypeEnumOption();
    await getProductStatusEnum();

    // 一键复制枚举
    getNeedCopyList();
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

  // #region导出
  const adsConfigDialog = ref(false);
  const adsExportLoading = ref(false);
  const adsExportConfigList = ref([]);
  const handleExport = async () => {
    const { data } = await getExportHeaderApi();
    adsExportConfigList.value = data;
    const checkedList = tableRef.value.getCheckboxRecords();
    checkedRowList.value = cloneDeep(checkedList);
    adsConfigDialog.value = true;
  };

  // 弹窗关闭
  const handleLogRuleClose = (e) => {
    adsExportConfigList.value = [];
    adsConfigDialog.value = e.isShow;
    adsExportLoading.value = false;
  };

  // 导出
  const exportDialog = (e) => {
    let obj = {};
    if (e.checkedType == '导出列表选中数据') {
      const checkedList = tableRef.value.getCheckboxRecords();
      if (checkedList.length == 0) {
        ElMessage.warning('没有在列表中选中数据，请检查后提交！');
        return false;
      }
      obj.productIds = checkedList.map((item) => item.productId);
    } else if (e.checkedType == '导出查询条件中的数据') {
      obj = getFormData();
    }
    obj.joinedProductTab = 1;
    e.data.forEach((item) => (obj[item.field] = item.checkedData));
    adsExportLoading.value = true;
    transBlob({
      fileName: 'AE半托管已加入商品导出文件.xlsx',
      url: '/lms/aliexpressHalfManage/product/exportOnlineSku',
      data: obj,
      contentType: 'application/json'
    }).then(() => {
      adsExportLoading.value = false;
      ElMessage.success('操作成功');
    });
  };
  // #endregion导出

  // 导入店铺调价 下载模板
  const storePriceLoading = ref(false);
  const handleBatchDownloadTemp = () => {
    try {
      storePriceLoading.value = true;
      transBlob({
        url: '/lms/aliexpressHalfManage/product/downloadModifyPriceExcelTemplate',
        contentType: 'application/json',
        fileName: '下载店铺调价模板' + '.xlsx'
      }).finally(() => {
        storePriceLoading.value = false;
        ElMessage.success('下载成功');
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 导入店铺调价 导入模板
  const handleImportStorePrice = (result) => {
    storePriceLoading.value = false;
    const { code, msg } = result;
    if (code === '0000') {
      ElMessage.success(msg);
    } else {
      ElMessage.error(msg);
    }
  };
  const handleImportStorePriceBefore = () => {
    storePriceLoading.value = true;
  };

  const handleImportStorePriceError = (error) => {
    ElMessage.error(error.toString());
    storePriceLoading.value = false;
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
      item.skus.map((son) => son.id)
    );
    updateWeightVisible.value = true;
  };

  // #region 批量操作
  // 查看日志
  const checkedRowList = ref([]);
  const logVisible = ref(false);
  const handleViewLog = async (row) => {
    checkedRowList.value = [].concat(cloneDeep(row));
    logVisible.value = true;
  };

  // 同步更新
  const handleUpdateSync = async (row, type) => {
    // type 1 单个 2 批量
    let params = [];
    if (type === 1) {
      params = [
        {
          productId: row.productId,
          storeAcctId: row.storeAcctId
        }
      ];
    } else {
      const checkedList = tableRef.value.getCheckboxRecords();
      if (!checkedList.length) {
        return ElMessage.warning('需要选择一个商品才能改库存！');
      }
      params = checkedList.map((item) => ({
        productId: item.productId,
        storeAcctId: item.storeAcctId
      }));
    }
    // type 1 单个 2批量
    const res = await getProductSyncApi(params);
    if (res.code === '0000') {
      ElMessage.success('同步成功!');
      searchHandle(1);
    } else {
      ElMessage.warning('请重试!');
    }
  };

  // 批量修改库存
  const checkedParamsList = ref([]);
  const updateStockVisible = ref(false);
  const handleBatchUpdateStock = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    checkedParamsList.value = checkedList;
    updateStockVisible.value = true;
  };

  // 批量修改物流信息
  const logisticsVisible = ref(false);
  const checkedLogisticsIdList = ref([]);
  const handleBatchLogistics = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    checkedLogisticsIdList.value = checkedList.map((item) => item.productId);
    logisticsVisible.value = true;
  };

  // 批量修改价格
  const batchPriceVisible = ref(false);
  const selectRecords = ref([]);
  const handleBatchPrice = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    selectRecords.value = checkedList;
    batchPriceVisible.value = true;
  };

  // 立即加入
  const joinRightNowType = ref(null);
  const joinRightNowVisible = ref(false);
  const handleJoinRightNow = (type, row) => {
    // type 1 单个 0 批量
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!type) {
      if (!checkedList.length) {
        return ElMessage.warning('请选择数据！');
      }
      selectRecords.value = checkedList;
    } else {
      selectRecords.value = [row];
    }
    if (activeKey.value === 3) {
      joinRightNowType.value = 1;
    }
    joinRightNowVisible.value = true;
  };
  // #endregion 批量操作
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
      align-items: center;
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
  .mb-4 {
    padding: 4px 0;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-column {
    display: flex;
    flex-direction: column;
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
  .w50 {
    width: 50px;
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
  .flex-end {
    display: flex;
    align-items: center;
    justify-content: end;
  }
  .flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .logisAttrListSelect {
    width: 120px;
    :deep(.el-input) {
      width: 100% !important;
    }
  }
  .relative {
    position: relative;
  }
  .badge {
    position: absolute;
    left: 0;
    top: 0;
  }
  .regional_box {
    position: absolute;
    top: 0;
    right: -4px;
  }
  .regional_box:hover {
    cursor: pointer;
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
  .flex {
    display: flex;
    align-items: center;
    .flex-1 {
      flex: 1;
    }
  }
  .mt-10 {
    margin-top: 10px;
  }
  .ml-2 {
    margin-left: 2px;
  }
  .my-4 {
    margin: 4px 0;
  }
</style>
