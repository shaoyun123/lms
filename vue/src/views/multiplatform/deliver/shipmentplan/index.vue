<template>
  <div id="add_width" class="shipment_plan app-container">
    <!-- 数据筛选 start -->
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-row>
          <el-form-item>
            <el-select v-model="timeType" class="form_left">
              <el-option value="createTime" label="创建时间" />
              <el-option value="sendTime" label="派单时间" />
              <el-option value="deliverTime" label="发货时间" />
              <el-option value="pickupTime" label="预约时间" />
              <el-option value="cancelTime" label="取消时间" />
            </el-select>
            <el-date-picker
              v-model="formData.time"
              class="form_right"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="shortcuts"
              :default-time="defaultTime"
              placeholder="请选择时间"
            />
          </el-form-item>
          <el-form-item label="平台">
            <el-select
              v-model="formData.platCode"
              placeholder="请选择"
              clearable
              filterable
              @change="changePlat"
            >
              <el-option
                v-for="item in state.platList"
                :key="item"
                :lbael="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="店铺">
            <el-select-v2
              v-model="formData.storeAcctList"
              placeholder="请选择"
              :options="state.storeList"
              style="width: 185px"
              multiple
              collapse-tags
              clearable
              filterable
              @visible-change="changeStoreSelect"
              @change="changeStore"
            >
            </el-select-v2>
          </el-form-item> -->
          <el-form-item label="店铺">
            <ZCascader
              v-model="formData.storeAcctList"
              :data="state.storeList"
            ></ZCascader>
          </el-form-item>
          <el-form-item label="合单箱号">
            <el-select
              v-model="formData.comBoxNos"
              filterable
              clearable
              @visible-change="changeComBoxNoSelect"
            >
              <el-option
                v-for="item in comboxList"
                :key="item.id"
                :value="item.comBoxNo"
                :label="item.comBoxNo"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="平台状态">
            <el-select
              v-model="formData.platProcessStatus"
              placeholder="请选择"
              clearable
              filterable
              @visible-change="changePlatStatus"
            >
              <el-option
                v-for="item in state.platStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售">
            <el-select
              v-model="formData.salesperson"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in state.salersList"
                :key="item.salesPersonId"
                :label="item.salesPerson"
                :value="item.salesPersonId"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item>
          <el-select v-model="formData.remarkType" filterable class="form_left">
            <el-option
              v-for="item in REMARK_TYPE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-model="formData.remarkContent"
            class="form_right"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="货件编号">
          <el-input
            v-model="formData.platCodeIdStr"
            placeholder="支持多个逗号分隔"
            @keyup.enter="handleSearch"
          ></el-input>
        </el-form-item>
        <el-form-item label="打印条码">
          <el-input
            v-model="formData.barCode"
            placeholder="请输入"
            @keyup.enter="handleSearch"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="formData.skuType" class="form_left w_input">
            <el-option label="店铺SKU(精确)" value="1"></el-option>
            <el-option label="店铺SKU(模糊)" value="3"></el-option>
            <el-option label="子商品SKU(精确)" value="2"></el-option>
            <el-option label="子商品SKU(模糊)" value="4"></el-option>
          </el-select>
          <el-input
            v-model="skuContent"
            class="form_right"
            placeholder="精确支持多个逗号分隔"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input
            v-model="formData.logisticsNoListStr"
            placeholder="支持多个逗号分隔"
            @keyup.enter="handleSearch"
          ></el-input>
        </el-form-item>
        <el-form-item label="收件地址">
          <el-select
            v-model="formData.alias"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in state.addressListFilter"
              :key="item.id"
              :label="item.alias"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="仓库备注">
          <el-input
            v-model="formData.storeRemark"
            placeholder="请输入"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="是否紧急">
          <el-select
            v-model="formData.ifSpeed"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item>
          <el-select v-model="orderType" class="form_left">
            <el-option label="发货单号" :value="1"></el-option>
            <el-option label="入库单号" :value="2"></el-option>
            <el-option label="LBX号" :value="3"></el-option>
            <el-option label="揽收单号" :value="4"></el-option>
            <el-option label="合单批次号" :value="5"></el-option>
          </el-select>
          <el-select
            v-model="ifContainOrderSn"
            class="form_left"
            filterable
            clearable
          >
            <el-option label="全部" :value="null"></el-option>
            <el-option label="有" :value="true"></el-option>
            <el-option label="无" :value="false"></el-option>
          </el-select>
          <el-input
            v-model="orderSnStr"
            class="form_right"
            style="width: 250px"
            clearable
            placeholder="支持多个逗号分隔"
          ></el-input>
        </el-form-item>
        <el-form-item label="仓库名称" class="warehouseName">
          <el-select v-model="formData.warehouseName" filterable clearable>
            <el-option
              v-for="item in storeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="框号">
          <el-input
            v-model="formData.frameCode"
            clearable
            placeholder="支持多个逗号分隔"
            @keyup.enter="handleSearch"
          ></el-input>
        </el-form-item>
        <el-form-item label="子单ID">
          <el-input
            v-model="formData.detailId"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-select v-model="formData.creatorId" filterable clearable>
            <el-option
              v-for="item in creatorList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库数量" class="form_range">
          <el-input
            v-model="formData.totalPlatReceiveQuantityMin"
            type="number"
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="formData.totalPlatReceiveQuantityMax"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="批次号">
          <el-input
            v-model="formData.batchNoStr"
            clearable
            placeholder="支持多个逗号隔开"
          ></el-input>
        </el-form-item>
        <el-form-item label="取货剩余时间" class="form_range">
          <el-input
            v-model="formData.latestDeliveryTimeMin"
            type="number"
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="formData.latestDeliveryTimeMax"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="platformOATag"
            clearable
            class="form_left"
            @change="changePLatOA"
          >
            <el-option
              label="平台标签(包含)"
              value="平台标签(包含)"
            ></el-option>
            <el-option
              label="平台标签(不包含)"
              value="平台标签(不包含)"
            ></el-option>
            <el-option label="OA标签(包含)" value="OA标签(包含)"></el-option>
            <el-option
              label="OA标签(不包含)"
              value="OA标签(不包含)"
            ></el-option>
          </el-select>
          <el-select
            v-if="paltOROA == 1"
            v-model="platVal"
            clearable
            @change="changePlatTag"
          >
            <el-option
              v-for="item in platTagList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-select
            v-else-if="paltOROA == 2"
            v-model="OAVal"
            clearable
            @change="changeOATag"
          >
            <el-option
              v-for="item in oaTagList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-select v-else> </el-select>
        </el-form-item>
        <el-form-item label="箱唛状态">
          <el-select v-model="ifHaveCaseLabelVal" clearable filterable>
            <el-option label="全部" value="null" selected></el-option>
            <el-option label="已上传" value="true"></el-option>
            <el-option label="未上传" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="select_item_vari" class="form_left">
            <el-option label="g_item_id" value="g_item_id"></el-option>
            <el-option label="g_vari_id" value="g_vari_id"></el-option>
          </el-select>
          <el-input
            v-model="input_item_vari"
            class="form_right"
            placeholder="多条逗号分隔"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown
            trigger="click"
            style="margin: 0 10px"
            size="small"
            split-button
            type="primary"
            @click="configNameDialogOpen"
          >
            保存搜索
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in searchConfigOption"
                  :key="item.id"
                  @click="getConfigOption(item.searchCondition)"
                >
                  <div class="w-full justify-between">
                    <div>{{ item.searchConditionName }}</div>
                    <div>
                      <el-icon
                        style="margin-left: 20px"
                        @click.stop="configOptionDel(item.id)"
                        ><Delete
                      /></el-icon>
                    </div>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据筛选 end -->

    <!-- 货件计划 tabs table start -->
    <el-card class="common_split_bottom card_position list_card">
      <el-tabs
        v-model="activeKey"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.label"
          :label="`${item.label}(${item.count})`"
          :name="item.status"
        >
          <!-- 待装箱状态复选框 start -->
          <el-checkbox-group
            v-if="activeKey === '3'"
            v-model="checkList"
            class="checkbox_margin"
            @change="changeStatus"
          >
            <el-checkbox
              v-for="cItem in checkboxList"
              :key="cItem.label"
              :label="cItem.status"
              >{{ cItem.label }}({{ cItem.count || 0 }})</el-checkbox
            >
          </el-checkbox-group>
          <!-- 待装箱状态复选框 end -->

          <!-- 货件计划列表数据 start -->
          <vxe-table
            ref="orderTable"
            v-loading="loading"
            class="mytable-style"
            :data="shipmentList"
            :height="height"
            :row-config="{
              isCurrent: true,
              isHover: true,
              height: 300,
              keyField: 'id'
            }"
            :show-overflow="true"
            :scroll-y="{ gt: 10 }"
            :row-class-name="rowBgClassName"
            border
            @cell-click="handleRowClick"
          >
            <vxe-column type="checkbox" width="50"></vxe-column>
            <vxe-column
              title="货件编号"
              class-name="sub_table_cell"
              min-width="110"
            >
              <template #default="{ row }">
                <div class="flex-column">
                  <div>
                    <a
                      v-if="row.shopeeUrl"
                      :href="row.shopeeUrl"
                      target="_blank"
                      style="color: #1e90ff"
                      >{{ row.platOrderId }}</a
                    >
                    <span v-else>{{ row.platOrderId }}</span>
                    <el-icon
                      v-if="row.platOrderId"
                      class="copy_icon"
                      color="#aaa"
                      style="cursor: pointer; margin-left: 4px"
                      @click="copyPSku(row.platOrderId)"
                    >
                      <CopyDocument />
                    </el-icon>
                    <span v-if="row.ifSpeed" class="speed_tag">急</span>
                    <el-tag
                      v-if="
                        row.comNo !== '' &&
                        (activeKey === '4' ||
                          activeKey === '5' ||
                          activeKey === '6' ||
                          activeKey === '-1')
                      "
                      >合单</el-tag
                    >
                    <el-tooltip
                      v-if="
                        row.ifFirst === '是' && row.platCode === 'shein自营'
                      "
                      effect="dark"
                      content="首单发货数量必须大于等于下单数量的80%"
                      placement="right"
                    >
                      <el-tag type="danger">首单</el-tag>
                    </el-tooltip>
                  </div>

                  <el-tooltip
                    v-if="
                      row.skcStr &&
                      (row.platCode === 'shein自营' || row.platCode === 'temu')
                    "
                    effect="dark"
                    placement="right"
                  >
                    <template #content>
                      <div @click="copyPSku(row.skcStr)">
                        {{ row.skcStr }}
                      </div>
                    </template>
                    <div class="showOneLine">
                      {{ row.skcStr }}
                      <el-icon
                        v-if="row.skcStr"
                        class="copy_icon"
                        color="#aaa"
                        style="cursor: pointer"
                        @click="copyPSku(row.skcStr)"
                      >
                        <CopyDocument />
                      </el-icon>
                    </div>
                  </el-tooltip>

                  <el-tooltip
                    v-if="row.pSkuStr"
                    effect="dark"
                    placement="right"
                  >
                    <template #content>
                      <div @click="copyPSku(row.pSkuStr)">
                        {{ row.pSkuStr }}
                      </div>
                    </template>
                    <div class="showOneLine">{{ row.pSkuStr }}</div>
                  </el-tooltip>

                  <div v-if="row.platCode === 'shein自营'">
                    <span>建单：{{ row.platShipmentCreator }}</span>
                  </div>
                  <div v-if="activeKey === '-1'">
                    {{ getStatus(row.oaProcessStatus) }}
                  </div>
                </div>
              </template>
            </vxe-column>
            <vxe-column title="店铺-销售" min-width="130">
              <template #default="{ row }">
                <div>平台：{{ row.platCode }}</div>
                <div>仓库：{{ row.warehouseName }}</div>
                <div>店铺：{{ row.storeAcct }}</div>
                <!-- :content="`[${row.salesperson}][${row.sellLeaderName}]`" -->
                <el-tooltip content="[销售][主管]">
                  <div>
                    <div>[{{ row.salesperson }}][{{ row.sellLeaderName }}]</div>
                  </div>
                </el-tooltip>
                <div>创建：{{ row.creator }}</div>
              </template>
            </vxe-column>
            <vxe-column :width="260" class-name="sub_table_cell">
              <template #header>
                <div class="flex">
                  <div style="width: 100px">平台图片</div>
                  <div style="width: 140px">
                    商品 种类{{ totalKind }} || 数量{{ totalProductNum }}
                    <el-tooltip
                      effect="dark"
                      content="仅统计当前页"
                      placement="right"
                    >
                      <el-icon
                        :size="18"
                        style="
                          cursor: pointer;
                          vertical-align: text-bottom;
                          color: #666;
                          margin-left: 10px;
                        "
                        ><Warning
                      /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  border="inner"
                  :data="row?.shipmentDetailDtoList?.slice(0, row.displayCount)"
                  :show-header="false"
                  class="son_container"
                  style="margin: 10px 0"
                >
                  <vxe-column field="sellerSku" width="100">
                    <template #default="{ row: sonRow }">
                      <div class="flex-center">
                        <ImagePop
                          :src="sonRow.sellerSkuImage"
                          width="80px"
                          height="80px"
                        />
                      </div>
                    </template>
                  </vxe-column>

                  <vxe-column width="140">
                    <template #default="{ row: sonRow }">
                      <div>
                        <div>规格：{{ sonRow.specification }}</div>
                        <div>
                          {{ sonRow.prodSSku }}
                          <el-icon
                            v-if="sonRow.prodSSku"
                            class="copy_icon"
                            color="#aaa"
                            style="cursor: pointer"
                            @click="copyPSku(sonRow.prodSSku)"
                          >
                            <CopyDocument />
                          </el-icon>
                        </div>
                        <div v-if="row?.shipmentDetailDtoList.length === 1">
                          成本：{{ row.totalCost }}
                        </div>
                        <div v-else>成本：{{ sonRow.cost }}</div>
                        <div>
                          <span>计划/实发：</span>
                          {{ sonRow.planQuantity }}/{{ sonRow.actQuantity }}
                        </div>
                      </div>
                    </template>
                  </vxe-column>
                </vxe-table>
                <div
                  v-if="row?.shipmentDetailDtoList?.length > DEFAULT_TR_LENGTH"
                  style="text-align: right"
                  @click="
                    row.displayCount > DEFAULT_TR_LENGTH
                      ? hideList(row)
                      : viewAll(row)
                  "
                >
                  <a
                    v-if="row.shipmentDetailDtoList"
                    style="color: #409eff; cursor: pointer"
                    >{{
                      row.displayCount > DEFAULT_TR_LENGTH ? '收起' : `+展开`
                    }}({{ row?.shipmentDetailDtoList?.length }})</a
                  >
                </div>
              </template>
            </vxe-column>
            <vxe-column title="重量(kg)" min-width="120">
              <template #default="{ row }">
                <div>
                  <div>种类：{{ row.skuNumber }}</div>
                  <div>框号：{{ row.frameCode }}</div>
                  <div>预估：{{ row.preTotalWeight }}</div>
                  <div>实称：{{ row.actTotalWeight }}</div>
                  <div class="flex-start flex-wrap">
                    <span>总计划/总实发：</span>
                    <span> {{ row.totalPlanQuantity }}</span
                    >/
                    <span>{{ row.totalActQuantity }}</span>
                  </div>
                </div>
              </template>
            </vxe-column>
            <vxe-column
              title="平台状态"
              min-width="150"
              class-name="sub_table_cell"
            >
              <template #default="{ row }">
                <div>{{ getPlatformStatus(row.platProcessStatus) }}</div>
                <div>平台入库：{{ row.totalPlatReceiveQuantity }}</div>
                <div>
                  入库单号：{{ row.aePoNo }}
                  <el-icon
                    v-if="row.aePoNo"
                    class="copy_icon"
                    color="#aaa"
                    style="cursor: pointer"
                    @click="copyPSku(row.aePoNo)"
                  >
                    <CopyDocument />
                  </el-icon>
                </div>
                <div>
                  发货单号：{{ row.deliverOrderSn }}
                  <el-icon
                    v-if="row.deliverOrderSn"
                    class="copy_icon"
                    color="#aaa"
                    style="cursor: pointer"
                    @click="copyPSku(row.deliverOrderSn)"
                  >
                    <CopyDocument />
                  </el-icon>
                </div>
                <div>
                  LBX号：{{ row.lbxNo }}
                  <el-icon
                    v-if="row.lbxNo"
                    class="copy_icon"
                    color="#aaa"
                    style="cursor: pointer"
                    @click="copyPSku(row.lbxNo)"
                  >
                    <CopyDocument />
                  </el-icon>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="alias" title="地址" min-width="110">
              <template #default="{ row }">
                <el-tooltip placement="right">
                  <template #content>
                    <div @click="copy(row.platWhReceiveAddress)">
                      收件人：
                      {{ row.platWhReceiveAddress.receivor || '' }}<br />手机：
                      {{ row.platWhReceiveAddress.phoneNumber || '' }}<br />
                      详细地址：
                      {{ row.platWhReceiveAddress.detail || '' }}
                    </div></template
                  >
                  {{ row.alias }}
                </el-tooltip>
              </template>
            </vxe-column>
            <vxe-column
              title="发货"
              min-width="120"
              class-name="sub_table_cell"
            >
              <template #default="{ row }">
                <div v-if="[3, 4, 5].includes(Number(activeKey))">
                  <span
                    >合单箱号：{{ row.comBoxNo }}
                    <el-icon
                      v-if="row.comBoxNo"
                      class="copy_icon"
                      color="#aaa"
                      style="cursor: pointer"
                      @click="copyPSku(row.comBoxNo)"
                    >
                      <CopyDocument /> </el-icon
                  ></span>
                </div>
                <div>合单批次号：{{ row.comBoxBatchNo }}</div>
                <div>箱数：{{ row.boxQuantity }}</div>
                <div>
                  快递单号：{{ row.logisticsNo }}
                  <el-icon
                    v-if="row.logisticsNo"
                    class="copy_icon"
                    color="#aaa"
                    style="cursor: pointer"
                    @click="copyPSku(row.logisticsNo)"
                  >
                    <CopyDocument />
                  </el-icon>
                </div>
                <div>
                  <span
                    v-if="
                      row.oaTags?.includes('合并') &&
                      (activeKey === '3' ||
                        activeKey === '4' ||
                        activeKey === '5')
                    "
                    class="merge_tag"
                    >合并</span
                  >
                </div>
                <div>揽收单号：{{ row.pickUpNo }}</div>
                <div>费用：{{ row.logisticsFee }}</div>
                <div>
                  <el-tag
                    v-if="row.deliverOrderFile !== ''"
                    style="
                      margin-left: 2px;
                      vertical-align: middle;
                      cursor: pointer;
                    "
                    @click.stop="previewDeliverCaseLabel(row)"
                    >发货单预览</el-tag
                  >
                </div>
              </template>
            </vxe-column>
            <vxe-column v-if="activeKey === '6'" title="取消" width="180">
              <template #default="{ row }">
                <div>人员：{{ row.canceler || '' }}</div>
                <div>时间：{{ transferDate(row.cancelTime) }}</div>
                <div>取消时状态：{{ getStatus(row.cancelStatus) }}</div>
                <!-- <div>原状态：{{  }}</div> -->
              </template>
            </vxe-column>
            <vxe-column title="时间" width="180">
              <template #default="{ row }">
                <div>创建：{{ transferDate(row.createTime) }}</div>
                <div>派单：{{ transferDate(row.dispatchTime) }}</div>
                <div>预约：{{ transferDate(row.expectedPickupTime) }}</div>
                <div>要求：{{ transferDate(row.latestDeliveryTime) }}</div>
                <div>取件：{{ transferDate(row.actPickupTime) }}</div>
                <div>发货：{{ transferDate(row.deliverTime) }}</div>
              </template>
            </vxe-column>
            <vxe-column title="备注" min-width="120">
              <template #default="{ row }">
                <div>销售：{{ row.salerRemark }}</div>
                <div>采购：{{ row.purchaseRemark }}</div>
                <div>仓库：{{ row.storeRemark }}</div>
              </template>
            </vxe-column>
            <vxe-column v-if="activeKey !== '-1'" title="操作" min-width="120">
              <template #default="{ row, rowIndex }">
                <el-button
                  v-if="
                    activeKey === '1' || activeKey === '6' || activeKey === '2'
                  "
                  type="primary"
                  @click.stop="handleCancelToCheck(row)"
                  >转待审核</el-button
                >
                <el-button
                  v-if="activeKey === '3'"
                  v-permission="['shipmentplanPackageBtn']"
                  type="primary"
                  @click.stop="viewPackup(row)"
                  >包装</el-button
                ><el-button
                  v-if="activeKey === '3'"
                  v-permission="['shipmentplanBoxupBtn']"
                  type="primary"
                  @click.stop="viewBoxup(row)"
                  >装箱</el-button
                >
                <el-button
                  v-if="[3, 4, 5].includes(Number(activeKey))"
                  type="primary"
                  @click.stop="handleToPrintComBoxBatchNo(row)"
                  >打印合单批次号</el-button
                >
                <el-button
                  v-if="[1, 2, 3, 4].includes(Number(activeKey))"
                  type="primary"
                  @click.stop="handleUpload(row)"
                  >上传箱唛</el-button
                >
                <el-button
                  v-if="[1, 2, 3, 4, 5].includes(Number(activeKey))"
                  type="primary"
                  @click.stop="handlePrint(row)"
                  >打印箱唛</el-button
                >
                <el-button
                  v-if="[4, 5].includes(Number(activeKey))"
                  type="primary"
                  @click.stop="getDeliverSn(row)"
                  >打印快递单</el-button
                >
                <!-- <el-button
                  v-if="[0, 1, 2, 3, 4].includes(Number(activeKey))"
                  type="primary"
                  @click.stop="writeDeliverItemSn(row)"
                  >填写发货单</el-button
                > -->
                <!-- <el-button
                  v-if="
                    [3, 4].includes(Number(activeKey)) ||
                    (activeKey === '5' &&
                      (row.platCode === 'AE半托管' ||
                        row.platCode === 'AE全托管'))
                  "
                  type="primary"
                  @click.stop="writePickItemSn(row)"
                  >填写揽收单</el-button
                > -->
                <el-button
                  v-if="activeKey === '4'"
                  v-permission="['shipmentplanDeliverBtn']"
                  type="primary"
                  @click.stop="viewDeliver(row)"
                  >发货</el-button
                >
                <el-button
                  v-if="[4, 5].includes(Number(activeKey))"
                  type="primary"
                  @click.stop="printLogisticsTemplate(row)"
                  >打印物流面单</el-button
                >
                <el-button
                  v-if="[1, 2, 3, 4, 5].includes(Number(activeKey))"
                  v-permission="['shipmentplanDeliverBtn']"
                  type="primary"
                  @click.stop="handleUpdateLogisticsInfo(row)"
                  >修改快递信息</el-button
                >
                <el-button
                  v-if="
                    [3, 4, 5].includes(Number(activeKey)) &&
                    row.platCode == 'temu'
                  "
                  type="primary"
                  @click.stop="temuUpdateLogistics(row, rowIndex)"
                  >temu修改物流</el-button
                >
                <el-tag
                  v-if="
                    [1, 2, 3, 4].includes(Number(activeKey)) &&
                    row.caseLabel !== ''
                  "
                  style="
                    margin-left: 2px;
                    vertical-align: middle;
                    cursor: pointer;
                  "
                  @click.stop="previewCaseLabel(row)"
                  >箱唛预览</el-tag
                >
                <el-tag
                  v-if="
                    [1, 2, 3, 4].includes(Number(activeKey)) && !row.caseLabel
                  "
                  type="danger"
                  style="margin-left: 2px; vertical-align: middle"
                  >无上传箱唛</el-tag
                >
                <el-popconfirm
                  v-if="[0, 1, 2].includes(Number(activeKey))"
                  title="确定要取消吗？"
                  @confirm="handleCancel(row)"
                >
                  <template #reference>
                    <el-button
                      v-permission="['shipmentplanCancelOrderBtn']"
                      type="danger"
                      @click.stop
                      >取消</el-button
                    >
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  v-if="[3, 4].includes(Number(activeKey))"
                  title="确定要取消吗？"
                  @confirm="handleCancel(row)"
                >
                  <template #reference>
                    <el-button
                      v-permission="['shipmentplanCancelBtn']"
                      type="danger"
                      @click.stop
                      >取消</el-button
                    >
                  </template>
                </el-popconfirm>
              </template>
            </vxe-column>
          </vxe-table>

          <div class="pagination">
            <el-pagination
              v-model:currentPage="formData.page"
              v-model:page-size="formData.limit"
              background
              :page-sizes="[500, 1000, 2000]"
              :small="true"
              layout="total, sizes, prev, pager, next"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
          <!-- 货件计划列表数据 end -->
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn">
        <el-button
          v-if="activeKey === '0'"
          type="danger"
          @click="handleBatchCancel"
          >取消</el-button
        >
        <el-dropdown v-if="![5, 6, -1].includes(Number(activeKey))">
          <el-button type="danger">
            清空<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-popconfirm
                  v-if="[0, 1, 2, 3].includes(Number(activeKey))"
                  title="确定要清空发货单号吗？"
                  @confirm="handleCleaDeliver"
                >
                  <template #reference>
                    <el-row
                      v-permission="['shipmentEditDeliverBtn']"
                      type="primary"
                      @click.stop
                      >发货单号</el-row
                    >
                  </template>
                </el-popconfirm>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-popconfirm
                  v-if="![5, 6, -1].includes(Number(activeKey))"
                  title="确定要清空发货单和快递单吗？"
                  @confirm="handleRemoveLogisNoAndDeliverOrderSn"
                >
                  <template #reference>
                    <el-row
                      v-permission="[
                        'shipmentRemoveLogisNoAndDeliverOrderSnBtn'
                      ]"
                      type="primary"
                      @click.stop
                      >发货单和快递单</el-row
                    >
                  </template>
                </el-popconfirm>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          v-if="[3, 4, 5].includes(Number(activeKey))"
          v-permission="['shipmentbatchUpdateAEPickUpNoBtn']"
          type="primary"
          @click="batchUpdateAEPickUpNo"
        >
          修改AE揽收单
        </el-button>
        <el-button
          v-if="activeKey === '3'"
          v-permission="['shipmentplanMergeBtn']"
          type="primary"
          @click.stop="handleMergeBox()"
          >合单装箱</el-button
        >
        <el-popconfirm
          v-if="activeKey === '3'"
          title="该操作会立即释放货件计划占用的框子,并立即跳转到待发货中"
          @confirm="handleSkipPack(row)"
        >
          <template #reference>
            <el-button v-permission="['shipmentplanJumpBtn']" type="primary"
              >跳转至待发货(temu)</el-button
            >
          </template>
        </el-popconfirm>
        <el-button
          v-if="activeKey === '1' || activeKey === '2'"
          type="primary"
          @click="handlePendingReview"
          >转待审核</el-button
        >
        <el-button
          v-if="activeKey === '1' || activeKey === '2'"
          v-permission="['shipmentBatchPurchaseRemarkBtn']"
          type="primary"
          @click="handleBatchPurchaseRemark"
          >修改采购备注</el-button
        >
        <!-- <el-button
          v-if="[0, 1, 2, 3].includes(Number(activeKey))"
          v-permission="['shipmentEditDeliverBtn']"
          type="primary"
          @click="handleEditDeliver"
          >修改发货单</el-button
        > -->
        <el-button
          v-if="activeKey === '0'"
          v-permission="['shipmentMatchSkuBtn']"
          type="primary"
          @click="handleMateSku"
          >匹配SKU</el-button
        >
        <el-button
          v-if="activeKey === '0'"
          type="primary"
          @click="handleCheckOrder"
          >审核</el-button
        >
        <el-button
          v-if="activeKey === '2'"
          v-permission="['shipmentplanTransferBtn']"
          type="primary"
          @click="handleAddPurchase"
          >调拨采购</el-button
        >
        <el-button
          v-if="activeKey === '1' || activeKey === '2'"
          v-permission="['shipmentplanSendRepositoryBtn']"
          type="primary"
          @click="handleSendRepository()"
          >派至仓库</el-button
        >
        <el-button
          v-if="activeKey === '4'"
          v-permission="['shipmentplanDeliverBtn']"
          type="primary"
          @click.stop="viewDeliver()"
          >批量发货</el-button
        >
        <el-button
          v-if="activeKey === '5'"
          v-permission="['shipmentplanMarkBtn']"
          type="primary"
          @click.stop="handleMarkOrder"
          >标记平台发货</el-button
        >
        <el-dropdown>
          <el-button type="primary">
            导入上传<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-upload
                  v-if="activeKey === '3'"
                  :action="'/api/lms/PlatWh/PlatWhShipment/importShipmentPickUpNo'"
                  :before-upload="beforePickUpNoUpload"
                  :on-success="importPickUpNoSuccess"
                  :on-error="importPickUpNoError"
                  :show-file-list="false"
                >
                  <el-row
                    v-permission="['shipmentImportPickUpNoLoadingBtn']"
                    type="primary"
                    :loading="importPickUpNoLoading"
                    >揽收单号</el-row
                  >
                </el-upload></el-dropdown-item
              >
              <el-dropdown-item>
                <el-upload
                  v-if="activeKey === '0'"
                  :action="'/api/lms/PlatWh/PlatWhShipment/importPlatWhShipment'"
                  :on-success="importSuccess"
                  :on-error="importError"
                  :show-file-list="false"
                  style="margin-right: 12px"
                >
                  <el-row type="primary">导入新增</el-row>
                </el-upload>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  :action="'/api/lms/PlatWh/PlatWhShipment/importAePoNoExcel'"
                  :before-upload="beforeUpload"
                  :on-success="importPOSuccess"
                  :on-error="importPOError"
                  :show-file-list="false"
                  style="margin-right: 12px"
                >
                  <el-row
                    v-permission="['shipmentImportPOloadingBtn']"
                    type="primary"
                    :loading="importPOloading"
                    >入库单号</el-row
                  >
                </el-upload>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-row
                  type="primary"
                  @click="handlerBatchUploadLogisticsbill()"
                  >物流面单</el-row
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown>
          <el-button style="background-color: #009688; color: #fff">
            导出<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-row
                  v-if="activeKey === '0'"
                  type="primary"
                  @click="downloadTemp"
                  >模板下载</el-row
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-row
                  v-permission="['shipmentplanExportTemplateBtn']"
                  @click.stop="handleExportTemp(row)"
                  >按模板导出</el-row
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-row
                  v-if="activeKey === '4' || activeKey === '5'"
                  v-permission="['shipmentplanExportBtn']"
                  type="primary"
                  @click="exportBoxup"
                  >导出装箱信息</el-row
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-row
                  v-if="activeKey === '-1'"
                  type="primary"
                  @click.stop="handleExport(row)"
                  >导出货件</el-row
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- <el-button
          v-if="activeKey === '2'"
          type="primary"
          @click="handlePurchase" 
          v-permission="['shipmentplanPurchaseBtn']"
          >一键采购</el-button
        > -->
      </div>
    </el-card>
    <!-- 货件计划 tabs table end -->

    <!-- 货件计划 包装弹窗 -->
    <Packupdetail
      v-if="showPackup"
      ref="packupDetailRef"
      :is-visible="showPackup"
      :plat-code="platCode"
      :address-list="state.addressList"
      :is-detail="isDetail"
      :active-key="activeKey"
      :detail-id="detailId"
      @close="handleClosePackup"
      @query="handleQuery"
    />

    <!-- 货件计划 发货弹窗 -->
    <Deliver
      v-if="showDeliver"
      :is-visible="showDeliver"
      :deliver-info="deliverInfo"
      :deliver-id="deliverId"
      :batch-deliver-id="batchDeliverId"
      :active-key="activeKey"
      :is-auto-pop-up="isAutoPopUp"
      :is-batch-send="isBatchSend"
      :selected-plat="selectedPlat"
      :select-box-up-list="selectBoxUpList"
      :is-update-logistics="isUpdateLogistics"
      @print-case="printCase"
      @close="handleCloseDeliver"
      @deliver-send-done="handleSendDeliver"
      @query="handleQuery"
    />

    <!-- 货件计划 填写发货单弹窗 -->
    <!-- <Writedeliver
      v-if="showWriteDeliver"
      :id="deliverId"
      :is-visible="showWriteDeliver"
      :deliver-info="deliverInfo"
      :active-key="activeKey"
      @close="handleCloseWriteDeliver"
      @query="handleQuery"
    /> -->

    <!-- 货件计划 填写揽收单弹窗 -->
    <!-- <WritePickUpNo
      v-if="showPickItemSn"
      :id="pickUpId"
      :is-visible="showPickItemSn"
      @close="handleCloseWritePickUp"
      @query="handleQuery"
    /> -->

    <!-- 批量修改AE揽收单 -->
    <BatchWritePickUpNo
      v-if="showBatchWritePickUp"
      :shipment-id-list="shipmentIdList"
      :is-visible="showBatchWritePickUp"
      @close="handleCloseBatchWritePickUp"
      @query="handleQuery"
    />

    <!-- 货件计划 装箱弹窗 -->
    <Boxup
      :is-visible="showBoxup"
      :boxup-info="boxupInfo"
      :box-type="boxType"
      :box-id="boxUpId"
      :select-list="selectList"
      :batch-box-up-id="batchBoxUpId"
      @done="handleSuccessBoxup"
      @done-is-to-send="handleIsToSend"
      @close="handleCloseBoxup"
    />

    <!-- 预览箱唛 -->
    <previewCase
      :show-preview="showPreview"
      :case-info="caseInfo"
      :box-code-visit-url-prex="boxCodeVisitUrlPrex"
      :preview-action="previewAction"
      @close="handleClosePreview"
    />

    <!-- 修改发货单 -->
    <EditDeliver
      v-if="showEditDeliver"
      :is-visible="showEditDeliver"
      :batch-beliver-id="batchBeliverId"
      @query="handleQuery"
      @close="handleCloseEditDeliver"
    />

    <!-- 上传箱唛弹窗 -->
    <el-dialog
      v-model="showCaseDialog"
      title="上传箱唛"
      :close-on-click-modal="false"
      @close="closeUpload"
    >
      <div style="display: flex">
        <el-upload
          v-model:file-list="fileList"
          :action="''"
          :show-file-list="true"
          :on-change="handleChange"
          :auto-upload="false"
          multiple
        >
          <template #trigger>
            <el-button type="primary">选择箱唛</el-button>
          </template>
          <el-button type="danger" style="margin-left: 20px" @click="clearCase"
            >清空箱唛</el-button
          >
        </el-upload>
      </div>
      <br />
      <div style="width: 200px">
        <el-input v-model="inputExpressNumber" placeholder="请填写快递单号" />
      </div>
      <template #footer>
        <span>
          <el-button type="primary" @click="uploadFile()">提交</el-button>
          <el-button @click="closeUpload">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 派至仓库弹窗 -->
    <el-dialog
      v-model="showSendDialog"
      title="派至仓库"
      :close-on-click-modal="false"
      @close="showSendDialog = false"
    >
      <vxe-table ref="itemTable" :data="reasonList" border>
        <vxe-column field="platOrderId" title="货件编号"></vxe-column>
        <vxe-column field="reason" title="派送结果"></vxe-column>
      </vxe-table>
    </el-dialog>

    <!-- 导入新增弹窗 -->
    <el-dialog
      v-model="showImportDialog"
      title="导入"
      :close-on-click-modal="false"
      @close="showImportDialog = false"
    >
      <vxe-table ref="itemTable" :data="importList" border>
        <vxe-column field="platOrderId" title="平台-货件编号-店铺"></vxe-column>
        <vxe-column field="reason" title="导入结果"></vxe-column>
      </vxe-table>
    </el-dialog>

    <!-- 新增采购弹窗 -->
    <el-dialog
      v-model="showAddPurchaseDialog"
      title="调拨采购"
      width="90%"
      :close-on-click-modal="false"
      @close="closeAddPurchase"
    >
      <div>
        <div class="query_header">
          <div class="query_form">
            <span style="padding-right: 10px"
              ><span style="color: red">*</span>仓库名称:</span
            >
            <el-select
              v-model="warehouseName"
              filterable
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="item in storeList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <el-button
              type="primary"
              style="margin-left: 10px"
              @click="queryPurchaseList"
              >查询</el-button
            >
          </div>
          <div class="tool_btn">
            <el-button
              v-permission="['shipmentplanCreateOrderBtn']"
              type="primary"
              @click="createTransfer"
              >生成调拨单</el-button
            >
            <el-button
              v-permission="['shipmentplanPurchaseStoreBtn']"
              type="primary"
              @click="handlePurchaseStore"
              >采购到目的仓</el-button
            >
          </div>
        </div>
        <vxe-table
          ref="purchaseRef"
          v-loading="purchaseLoading"
          :data="purchaseList"
          :edit-config="{
            trigger: 'click',
            mode: 'cell'
          }"
          height="550"
          :scroll-y="{ enabled: false }"
          :cell-style="cellStyle"
          border
        >
          <vxe-column type="checkbox" width="50"></vxe-column>
          <vxe-column field="ssku" title="商品sku">
            <template #default="{ row }">
              {{ row.ssku }}
              <el-tag v-if="row.ifSpeed === 1" type="danger">紧急</el-tag>
            </template>
          </vxe-column>
          <vxe-column field="platCode" title="平台">
            <template #default="{ row }">
              <ExpandText :text="row.platCode" />
            </template>
          </vxe-column>
          <vxe-column
            field="defaultWareHouseAvailableStock"
            title="直邮仓可用"
            width="100"
            sortable
          ></vxe-column>
          <vxe-column
            field="defaultWareHousePreAvailableStock"
            title="直邮仓预计可用(含在途)"
            width="110"
            sortable
          ></vxe-column>
          <vxe-column
            field="unAuditItemsNum"
            title="直邮仓未审核采购单商品数量"
            sortable
          ></vxe-column>
          <vxe-column title="直邮7/15/30天销量" field="sales7th" sortable>
            <template #default="{ row }">
              {{ row.sales7th || 0 }} / {{ row.sales15th || 0 }} /
              {{ row.sales30th || 0 }}
            </template>
          </vxe-column>
          <vxe-column title="jit7/15/30天销量" field="jit7" sortable>
            <template #default="{ row }">
              {{ row.jit7 || 0 }} / {{ row.jit15 || 0 }} /
              {{ row.jit30 || 0 }}
            </template>
          </vxe-column>
          <vxe-column
            field="transitDay"
            title="直邮仓周转天数"
            sortable
          ></vxe-column>
          <vxe-column
            field="transitDayWithOutJit"
            title="直邮仓周转天数(排除jit)"
            sortable
          ></vxe-column>
          <vxe-column
            field="platWhStock"
            title="目的仓可用"
            sortable
          ></vxe-column>
          <vxe-column
            field="platOnwayStock"
            title="目的仓在途"
            sortable
          ></vxe-column>
          <vxe-column
            field="platWhPreAvailableStock"
            title="目的仓预计可用(含在途)"
            sortable
          ></vxe-column>
          <vxe-column
            field="platWhUnAuditItemsNum"
            title="目的仓未审核采购单商品数量"
            sortable
          ></vxe-column>
          <vxe-column
            field="totalPlanQuantity"
            title="计划发货总数"
          ></vxe-column>
          <vxe-column
            field="needBorrow"
            title="需要调拨数"
            sortable
            :edit-render="{ name: 'input' }"
            :slots="{ edit: 'edit' }"
            :filters="needBorrowFilters"
          >
            <template #edit="{ row }">
              <el-input
                v-model="row.needBorrow"
                @blur="updateBorrowFilter"
              ></el-input>
            </template>
          </vxe-column>
          <vxe-column
            field="needPurchase"
            title="需要采购数"
            sortable
            :edit-render="{ name: 'input' }"
            :filters="needPurchaseFilters"
            :slots="{ edit: 'edit' }"
          >
            <template #edit="{ row }">
              <el-input
                v-model="row.needPurchase"
                @blur="updatePurchaseFilter"
              ></el-input>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <span>
          <el-button @click="closeAddPurchase">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <div v-if="showProgress" class="mask">
      <el-progress
        class="progress"
        :text-inside="true"
        :stroke-width="16"
        :percentage="percent"
      />
    </div>
  </div>

  <el-dialog
    v-model="showMateDialog"
    width="40%"
    title="匹配SKU"
    style="overflow: hidden"
    :close-on-click-modal="false"
  >
    <div style="overflow-y: auto; max-height: 550px">
      <vxe-table :data="mateList" border>
        <vxe-column title="货件计划" field="shipmentMsg"></vxe-column>
        <vxe-column title="匹配结果" field="result"></vxe-column>
      </vxe-table>
    </div>
  </el-dialog>
  <el-dialog
    v-model="logisticsbillDialog"
    width="30%"
    title="批量上传物流面单"
    close-on-click-modal="false"
    :before-close="handlelogisticsNumberClose"
  >
    <el-form :model="logisticsNumberForm" :rules="logisticsBillRules">
      <el-form-item
        label="物流单号"
        :label-width="formLabelWidth"
        prop="logisticsNumber"
      >
        <el-input
          v-model="logisticsNumberForm.logisticsNumber"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <div style="display: flex; margin-top: 50px">
      <el-upload
        v-model:file-list="logisticsBillList"
        :action="''"
        :show-file-list="true"
        :on-change="handlelogisticsBillChange"
        :auto-upload="false"
        multiple
      >
        <template #trigger>
          <el-button type="primary">上传物流面单</el-button>
        </template>
        <el-button
          type="danger"
          style="margin-left: 20px"
          @click="clearlogisticsBillCase"
          >批量清空物流面单</el-button
        >
      </el-upload>
    </div>
    <span style="font-size: 12px">只允许上传PDF格式的文件</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="UploadLogisticsBillFile">
          提交
        </el-button>
        <el-button
          @click="
            logisticsbillDialog = false;
            logisticsNumberForm.logisticsNumber = '';
            logisticsBillList = [];
          "
          >关闭</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- temu修改物流 -->
  <el-dialog v-model="updateLogisticsVisible" title="修改物流" width="500">
    <el-form :model="updateLogisticsForm">
      <el-form-item label="物流公司" required>
        <el-select
          v-model="updateLogisticsForm.expressCompanyId"
          placeholder="请选择物流公司"
          style="width: 240px"
        >
          <el-option
            v-for="item in teumLogisticsList"
            :key="item.expressCompanyId"
            :label="item.expressCompanyName"
            :value="item.expressCompanyId"
            style="height: 40px"
          >
            <div style="line-height: 20px">
              <span style="float: left">{{ item.expressCompanyName }}</span>
              <br />
              <span style="font-size: 12px; font-weight: 300">
                <span>{{ item.minSupplierChargeAmount }}</span>
                ~
                <span>{{ item.maxSupplierChargeAmount }}</span>
                元
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约时间" required>
        <div class="demo-datetime-picker">
          <div class="block">
            <el-date-picker
              v-model="updateLogisticsForm.expectedPickupTime"
              type="datetime"
              :clearable="false"
              placeholder="请选择预约时间"
              style="width: 240px"
            />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitTemunLogistics()">
          提交
        </el-button>
        <el-button @click="closeTemuLogistics">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 按模板导出 -->
  <ExportTemplate
    v-if="showExportDialog"
    :is-export-all="isExportAll"
    :is-visible="showExportDialog"
    :selected-data="selectRecords"
    :query-params="formData"
    @close="handleCloseExportDialog"
  />
  <!-- 采购备注 -->
  <UpdateRemark
    v-if="purchaseRemarkVisible"
    v-model="purchaseRemarkVisible"
    :selected-data="selectRecords"
    @handle-search="handleQuery"
  />

  <!-- 保存搜索 -->
  <AddSearchConfigDialog
    v-model="configNameDialogVisible"
    @config-name="addNewConfigName"
  />
</template>

<script setup name="multiplatformdelivershipmentplan">
  import { reactive, ref, onMounted, watch } from 'vue';
  import {
    getShipmentList,
    getAddress,
    // getShipmentDetail,
    cancelCheck,
    queryBoxup,
    queryCheckHaveCaseLabel,
    // purchaseOrder,
    sendRepository,
    getShipmentCount,
    cancelToCheck,
    checkOrder,
    importCaseLabel,
    clearCaseLabel,
    // getAllPlatData,
    getSalersData,
    markOrder,
    getPlatStatus,
    // getProcess,
    getCaseLabelData,
    // getDeliverData,
    printExpressDeliverSnApi,
    // getDeliverItemData,
    platCancel,
    getPurchaseList,
    transferStore,
    purchaseToStore,
    mateSku,
    getLazadaCase,
    skipPack,
    mergeBox,
    getCombox,
    getStoreProcessCount,
    getSheinCase,
    queryAeCaleLabelApi,
    getRepoName,
    getCreator,
    savePrintExpressNoLog,
    savePrintCaseLabelLog,
    editDeliverOrder,
    removeLogisNoAndDeliverOrderSnApi,
    batchPendingReviewApi,
    batchBatchCancelApi,
    UploadLogisticsBillApi,
    clearLogisticsBillApi,
    queryTemuGetMatchLogistics,
    quieryTemuChangeShipOrderLogistics,
    queryPlatOaListEnum
    // savePrintDeliverOrderSnLog
  } from '@/api/multiplatform/shipmentplan';
  import { getAllPlatList } from '@/api/common/index.js';
  import Packupdetail from './component/Packupdetail.vue';
  import Deliver from './component/Deliver.vue';
  // import Writedeliver from './component/Writedeliver.vue';
  // import WritePickUpNo from './component/WritePickUpNo.vue';
  import BatchWritePickUpNo from './component/BatchWritePickUpNo.vue';
  import previewCase from './component/previewcase.vue';
  import ExportTemplate from './component/exportTemplate.vue';
  import { transferDate } from '@/utils/common';
  import { epeanPrint_plugin_fun } from '@/utils/print';
  import {
    shortcuts,
    getStoreList as getCascaderStoreListApi
  } from '@/api/common';
  import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
  import Boxup from './component/Boxup.vue';
  import qs from 'qs';
  import axios from 'axios';
  import { transBlob } from '@/utils/downloadFile';
  import ExpandText from '@/components/ExpandText.vue';
  import EditDeliver from './component/Editdeliver.vue';
  import UpdateRemark from './component/UpdateRemark.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import AddSearchConfigDialog from '@/components/AddSearchConfigDialog/index.vue';
  import { copy as copyPSku } from '@/utils/common';
  import {
    searchConditionConfigList,
    searchConditionConfigNew,
    searchConditionConfigDel
  } from '@/api/publishs/aefullyhosted';
  import { commonGetPrintInfoApi } from '@/api/multiplatform/common';
  import { commonExecutePrintJobs } from '@/utils/print';

  const timeType = ref('createTime');
  let input_item_vari = ref(''); //g_vari_id,g_item_id
  const formData = reactive({
    page: 1,
    limit: 500,
    time: [],
    sendTimeStart: '',
    sendTimeEnd: '',
    deliveryTimeEnd: '',
    deliveryTimeStart: '',
    creatTimeStart: '',
    creatTimeEnd: '',
    comBoxNo: null, // 合单箱号
    comBoxNos: null,
    platCode: '', // 平台
    storeAcctList: [], // 店铺
    platProcessStatus: '', // 平台状态
    oaProcessStatus: '0', // 货件状态
    storeProcessStatus: '', // 仓库流程状态
    salesperson: null, // 销售
    remarkType: 'purchaseRemark', // 备注类型
    remarkContent: '', //备注内容
    salerRemark: '', // 销售备注
    storeRemark: '', // 仓库备注
    purchaseRemark: '', // 采购备注
    platCodeIdStr: '', // 货件编号
    sellerSkuList: '', // 店铺 sku
    prodSSkuList: '', // 子商品 sku
    sellerSkuLike: '', // 店铺 sku 模糊
    prodSSkuLike: '', // 子商品 sku 模糊
    barCode: '', // 打印条码
    logisticsNoListStr: '',
    logisticsNoList: '', // 快递单号
    alias: null, // 收件地址
    ifSpeed: null, // 是否紧急
    deliverOrderSnList: [], // 发货单号列表
    frameCode: '', // 框号
    detailId: '', // 子单ID
    ifContainDeliverOrderSn: null, // 无发货单
    ifContainAePoNo: true, // 是否入库单号
    ifContainLbxNo: null, // 选中LBX单号
    ifContainPickUpNo: null, // 选中揽收单号
    aePoNoList: [],
    lbxNoList: [],
    pickUpNoList: [],
    totalPlatReceiveQuantityMax: '',
    totalPlatReceiveQuantityMin: '',
    batchNoStr: '', // 批次号
    batchNoList: [],
    skuType: '1', // 筛选的 sku 类型
    latestDeliveryTimeMin: '', //取货剩余时间最小值
    latestDeliveryTimeMax: '', //取货剩余时间最大值
    ifFirst: '2', //是否首单
    gInfoIdList: []
  });
  const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59)
  ];
  const orderType = ref(1);
  const ifContainOrderSn = ref(null);
  const orderSnStr = ref('');
  const skuContent = ref(''); // sku 筛选内容
  const total = ref(0);
  const orderTable = ref(null);
  const ifHaveCaseLabelVal = ref('null'); //箱唛状态
  let select_item_vari = ref('g_item_id');
  let paltOROA = ref(1); //默认下拉值，平台标签下拉值，OA标签下拉值三种状态的切换
  let platformOATag = ref('平台标签(包含)'); //平台标签，OA标签选择的值
  let platVal = ref(null); //平台标签选择的值
  let OAVal = ref(null); //OA标签选择的值
  let oaTagList = ref([]); //OA标签下拉值枚举
  let platTagList = ref([]); //平台标签下拉值枚举

  const state = reactive({
    platList: [],
    salersList: [],
    storeList: [],
    addressList: [],
    addressListFilter: [],
    platStatus: []
  });
  const DEFAULT_TR_LENGTH = 3;

  const activeKey = ref('0'); // tab 页

  const tabList = ref([
    { label: '待审核', count: 0, status: '0' },
    { label: '待派单', count: 0, status: '1' },
    { label: '缺货单', count: 0, status: '2' },
    { label: '待装箱', count: 0, status: '3' },
    { label: '待发货', count: 0, status: '4' },
    { label: '已发货', count: 0, status: '5' },
    { label: '已取消', count: 0, status: '6' },
    { label: '全部', count: 0, status: '-1' }
  ]);

  const checkboxList = ref([
    { label: '待配货', count: 0, status: '0' },
    { label: '待包装', count: 0, status: '1' },
    { label: '部分包装', count: 0, status: '2' },
    { label: '已包装', count: 0, status: '3' },
    { label: '仓库缺货', count: 0, status: '4' }
  ]);

  const REMARK_TYPE_LIST = [
    { value: 'salerRemark', label: '销售备注' },
    { value: 'purchaseRemark', label: '采购备注' },
    { value: 'storeRemark', label: '仓库备注' }
  ];

  // 高度
  const height = ref(400);
  const searchCardRef = ref();

  onMounted(() => {
    calculateTableHeight();
    // getPlat();
    getPlatList();
    getSalersList();
    handleQuery();
    getAdressList();
    getRepoNameList();
    getCreatorList();
    getComboxList();
    getConfigList();
    getPlatOAList();
  });

  const calculateTableHeight = () => {
    const searchCardHeight = searchCardRef.value.$el.clientHeight;
    const secondTabHeight = activeKey.value === '3' ? 35 : 0;
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    height.value = clientHeight - searchCardHeight - secondTabHeight - 168;
  };
  // 获取平台标签，OA标签的枚举值
  const getPlatOAList = async () => {
    let { data } = await queryPlatOaListEnum();
    platTagList.value = data.platTagList;
    oaTagList.value = data.oaTagList;
  };
  // 平台标签，OA标签切换的事件
  const changePLatOA = () => {
    delete formData.platTagSign;
    delete formData.platTagList;
    delete formData.oaTagSign;
    delete formData.oaTagList;
    platVal.value = null;
    OAVal.value = null;
    if (platformOATag.value == '平台标签(包含)') {
      paltOROA.value = 1;
      formData.platTagSign = true;
    } else if (platformOATag.value == '平台标签(不包含)') {
      paltOROA.value = 1;
      formData.platTagSign = false;
    } else if (platformOATag.value == 'OA标签(包含)') {
      paltOROA.value = 2;
      formData.oaTagSign = true;
    } else if (platformOATag.value == 'OA标签(不包含)') {
      paltOROA.value = 2;
      formData.oaTagSign = false;
    } else {
      paltOROA.value = null;
    }
  };
  // 平台标签值切换的事件
  const changePlatTag = () => {
    formData.platTagList = platVal.value ? [platVal.value] : null;
  };
  // OA标签值切换的事件
  const changeOATag = () => {
    formData.oaTagList = OAVal.value ? [OAVal.value] : null;
  };
  // 切换 tab
  const handleClick = (tab) => {
    formData.oaProcessStatus = tab.props.name;
    activeKey.value = tab.props.name;
    calculateTableHeight();
    // -1 为全部货件
    if (tab.props.name === '-1') {
      formData.oaProcessStatus = null;
    }
    // 货件计划不是待装箱状态
    if (tab.props.name !== '3') {
      formData.storeProcessStatus = '';
    } else {
      checkList.value = [];
    }
    totalKind.value = 0;
    totalProductNum.value = 0;
    formData.page = 1;
    handleQuery();
  };

  const getStatus = (status) => {
    let oaStatus = '';
    tabList.value.forEach((item) => {
      if (status == item.status) {
        oaStatus = item.label;
      }
    });
    return oaStatus;
  };

  const getPlatformStatus = (status = '') => {
    const statusObj = {
      '-1': '待接单',
      0: '待发货',
      9: '已发货',
      10: '已取消'
    };
    if (status === '') return '';
    if (!statusObj[status]) return status;
    return statusObj[status];
  };

  const shipmentList = ref([]); // 货件计划列表数据
  const countList = ref([]); // 货件计划状态数据
  const selectRecords = ref([]); // 表格复选框选中的数据

  const storeList = ref([]);
  const getRepoNameList = async () => {
    try {
      const { code, data } = await getRepoName();
      if (code === '0000') {
        data?.forEach((item) => {
          let obj = {
            label: item,
            value: item
          };
          storeList.value.push(obj);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取创建人下拉框
  const creatorList = ref([]);
  const getCreatorList = async () => {
    try {
      const { code, data } = await getCreator();
      if (code === '0000') {
        data?.forEach((item) => {
          let obj = {
            label: item.creator,
            value: item.creatorId
          };
          creatorList.value.push(obj);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取所有平台数据
  const getPlatList = async () => {
    try {
      const { code, data } = await getAllPlatList();
      if (code === '0000') {
        state.platList = data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 获取所有销售人员信息 （和平台之间没有联动）
  const getSalersList = async () => {
    try {
      const { data } = await getSalersData();
      state.salersList = data;
    } catch (err) {
      console.log(err);
    }
  };
  // 平台信息改变 重新获取店铺
  const changePlat = () => {
    formData.storeAcctList = [];
    formData.comBoxNo = null;
    formData.comBoxNos = null;
    // 收件地址
    formData.alias = '';
    if (formData.platCode == '') {
      state.addressListFilter = state.addressList;
    } else {
      state.addressListFilter = state.addressList.filter(
        (item) => item.platCode == formData.platCode
      );
    }
    getStoreList();
    getPlatInfo();
  };

  // 店铺信息改变 修改合单箱号数据
  // const changeStore = () => {
  //   formData.comBoxNos = null;
  //   getComboxList();
  // };
  watch(
    () => formData.storeAcctList,
    (val) => {
      if (val && val.length && !formData.platCode) {
        state.storeList = [];
        return ElMessage.warning('请先选择平台！');
      } else {
        formData.comBoxNos = null;
        getComboxList();
      }
    }
  );

  // // 店铺选择
  // const changeStoreSelect = (val) => {
  //   if (val && !formData.platCode) {
  //     state.storeList = [];
  //     return ElMessage.warning('请先选择平台！');
  //   }
  // };

  // 合单箱号选择
  const changeComBoxNoSelect = (val) => {
    if (val && !formData.storeAcctList.length) {
      return ElMessage.warning('请先选择店铺！');
    } else if (val && !formData.platCode) {
      state.storeList = [];
      return ElMessage.warning('请先选择平台！');
    }
  };

  // 获取店铺信息
  const getStoreList = async () => {
    try {
      const { data } = await getCascaderStoreListApi(formData.platCode);
      state.storeList = data?.children || [];
    } catch (err) {
      console.log(err);
    }
  };
  // 获取平台状态
  const changePlatStatus = async (val) => {
    if (val && !formData.platCode) {
      return ElMessage.warning('请先选择平台');
    }
  };

  const getPlatInfo = async () => {
    state.platStatus = [];
    let params = {
      platCode: formData.platCode
    };
    const { code, data } = await getPlatStatus(params);
    if (code === '0000') {
      let statusMap = {
        '-1': '待接单',
        0: '待发货',
        9: '已发货'
      };
      data.forEach((item) => {
        let obj = {};
        if (Object.keys(statusMap).includes(item)) {
          obj.value = item;
          obj.label = statusMap[item];
        } else {
          obj.value = item;
          obj.label = item;
        }
        state.platStatus.push(obj);
      });
    }
  };

  // 获取合单箱号
  const comboxList = ref([]);
  const getComboxList = async () => {
    try {
      const { data, code } = await getCombox({
        storeAcctIdList: formData.storeAcctList || []
      });
      code === '0000' && data.length > 0
        ? (comboxList.value = [{ comBoxNo: '无合单箱号', id: -1 }].concat(data))
        : (comboxList.value = []);
    } catch (err) {
      console.log(err);
    }
  };

  // const changeComBox = (val) => {
  //   if (val && formData.storeAcctList?.length === 0) {
  //     comboxList.value = [];
  //     return ElMessage.warning('请先选择店铺！');
  //   }
  // };

  // 获取收件地址信息
  const getAdressList = async () => {
    try {
      const { data } = await getAddress({
        platCode: formData.platCode,
        alias: formData.alias
      });
      state.addressList = data.list;
      state.addressListFilter = data.list;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = () => {
    formData.page = 1;
    handleQuery();
  };

  const formatParams = (formData) => {
    formData.deliveryTimeEnd = '';
    formData.deliveryTimeStart = '';
    formData.sendTimeEnd = '';
    formData.sendTimeStart = '';
    formData.creatTimeEnd = '';
    formData.creatTimeStart = '';
    formData.pickupTimeEnd = '';
    formData.pickupTimeStart = '';
    formData.cancelTimeEnd = '';
    formData.cancelTimeStart = '';
    if (formData.time && formData.time.length != 0) {
      if (timeType.value === 'sendTime') {
        formData.sendTimeEnd = formData.time[1];
        formData.sendTimeStart = formData.time[0];
      }
      if (timeType.value === 'deliverTime') {
        formData.deliveryTimeEnd = formData.time[1];
        formData.deliveryTimeStart = formData.time[0];
      }
      if (timeType.value === 'createTime') {
        formData.creatTimeEnd = formData.time[1];
        formData.creatTimeStart = formData.time[0];
      }
      if (timeType.value === 'pickupTime') {
        formData.pickupTimeEnd = formData.time[1];
        formData.pickupTimeStart = formData.time[0];
      }
      if (timeType.value === 'cancelTime') {
        formData.cancelTimeEnd = formData.time[1];
        formData.cancelTimeStart = formData.time[0];
      }
    }
    formData.sellerSkuList = [];
    formData.prodSSkuList = [];
    formData.sellerSkuLike = '';
    formData.prodSSkuLike = '';

    if (orderType.value === 1) {
      // 发货单号
      formData.deliverOrderSnList = orderSnStr.value
        ? orderSnStr.value?.split(',')
        : [];
      if (ifContainOrderSn.value === '') {
        formData.ifContainDeliverOrderSn = null;
      }
      formData.ifContainDeliverOrderSn = ifContainOrderSn.value;
      formData.ifContainAePoNo = '';
      formData.aePoNoList = [];
    } else if (orderType.value === 2) {
      // 发货单号
      formData.aePoNoList = orderSnStr.value
        ? orderSnStr.value?.split(',')
        : [];
      if (ifContainOrderSn.value === '') {
        formData.ifContainAePoNo = null;
      }
      formData.ifContainAePoNo = ifContainOrderSn.value;
      formData.deliverOrderSnList = [];
      formData.ifContainDeliverOrderSn = '';
    } else if (orderType.value === 3) {
      // LBX号
      formData.lbxNoList = orderSnStr.value ? orderSnStr.value?.split(',') : [];
      if (ifContainOrderSn.value === '') {
        formData.ifContainLbxNo = null;
      }
      formData.ifContainLbxNo = ifContainOrderSn.value;
      formData.deliverOrderSnList = [];
      formData.ifContainDeliverOrderSn = '';
    } else if (orderType.value === 4) {
      // 揽收单号
      formData.pickUpNoList = orderSnStr.value
        ? orderSnStr.value?.split(',')
        : [];
      if (ifContainOrderSn.value === '') {
        formData.ifContainPickUpNo = null;
      }
      formData.ifContainPickUpNo = ifContainOrderSn.value;
      formData.deliverOrderSnList = [];
      formData.ifContainDeliverOrderSn = '';
    } else if (orderType.value === 5) {
      // 合单批次号
      formData.comBoxBatchNoList = orderSnStr.value
        ? orderSnStr.value?.split(',')
        : [];
      if (ifContainOrderSn.value === '') {
        formData.ifContainComBoxBatchNo = null;
      }
      formData.ifContainComBoxBatchNo = ifContainOrderSn.value;
      formData.deliverOrderSnList = [];
      formData.ifContainDeliverOrderSn = '';
    } else {
      formData.deliverOrderSnList = [];
      formData.ifContainDeliverOrderSn = '';
      formData.ifContainAePoNo = '';
      formData.ifContainLbxNo = '';
      formData.ifContainPickUpNo = '';
      formData.aePoNoList = [];
      formData.lbxNoList = [];
      formData.pickUpNoList = [];
      formData.ifContainComBoxBatchNo = '';
      formData.comBoxBatchNoList = [];
    }

    if (formData.skuType === '1') {
      // 店铺 sku
      formData.sellerSkuList = skuContent.value
        ? skuContent.value?.split(',')
        : [];
    } else if (formData.skuType === '2') {
      formData.prodSSkuList = skuContent.value
        ? skuContent.value?.split(',')
        : [];
    } else if (formData.skuType === '3') {
      formData.sellerSkuLike = skuContent.value;
    } else if (formData.skuType === '4') {
      formData.prodSSkuLike = skuContent.value;
    }
    if (!formData.alias) {
      formData.alias = null;
    }
    if (!formData.salesperson) {
      formData.salesperson = null;
    }
    if (!formData.frameCode) {
      formData.frameCodeList = null;
    } else {
      formData.frameCodeList = formData.frameCode.split(',');
    }

    if (formData.comBoxNos == '无合单箱号') {
      formData.comBoxNo = '';
    } else if (!formData.comBoxNos) {
      formData.comBoxNo = null;
    } else {
      formData.comBoxNo = formData.comBoxNos;
    }

    formData.logisticsNoList = formData.logisticsNoListStr
      ? formData.logisticsNoListStr.split(',')
      : [];
    // 批次号
    formData.batchNoList = formData.batchNoStr
      ? formData.batchNoStr.split(',')
      : [];

    // 备注
    REMARK_TYPE_LIST.forEach((v) => {
      if (v.value === formData.remarkType) {
        formData[v.value] = formData.remarkContent;
      } else {
        formData[v.value] = null;
      }
    });
    // 箱唛状态
    if (ifHaveCaseLabelVal.value == 'null') {
      delete formData.ifHaveCaseLabel;
    } else {
      formData.ifHaveCaseLabel = ifHaveCaseLabelVal.value;
    }
    return formData;
  };

  const handleQuery = () => {
    formatParams(formData);
    queryShipmentCount();
    queryProcessCount();
    queryShipmentList();
    resetOrderField();
  };

  // 清空发货单号查询
  const resetOrderField = () => {
    formData.deliverOrderSnList = [];
    formData.ifContainAePoNo = '';
    formData.ifContainLbxNo = '';
    formData.ifContainPickUpNo = '';
    formData.aePoNoList = [];
    formData.lbxNoList = [];
    formData.pickUpNoList = [];
  };

  // 查询不同状态 货件计划 的数量
  const queryShipmentCount = async () => {
    let params = Object.assign({}, formData);
    params.oaProcessStatus = null;
    params.storeProcessStatus = '';
    params.gInfoIdList =
      input_item_vari.value.replaceAll('，', ',').trim() == ''
        ? []
        : input_item_vari.value.split(',');
    try {
      const { code, data } = await getShipmentCount(params);
      if (code === '0000') {
        countList.value = data;
        handleTabsCount();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 查询待装箱 子状态数量
  const processList = ref([]);
  const queryProcessCount = async () => {
    let params = Object.assign({}, formData);
    params.gInfoIdList =
      input_item_vari.value.replaceAll('，', ',').trim() == ''
        ? []
        : input_item_vari.value.split(',');
    try {
      const { code, data } = await getStoreProcessCount(params);
      if (code === '0000') {
        processList.value = data;
        handleCheckboxCount();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 查看全部时，将所有都展示
  const viewAll = (row) => {
    row.displayCount = row.shipmentDetailDtoList.length;
  };

  // 收起多出部分时，只取前DEFAULT_TR_LENGTH条
  const hideList = (row) => {
    row.displayCount = DEFAULT_TR_LENGTH;
  };

  const loading = ref(false);
  const totalKind = ref(0); // 商品种类求和
  const totalProductNum = ref(0); // 商品计划发货数量
  // 查询货件计划列表
  const queryShipmentList = async () => {
    shipmentList.value = [];
    try {
      loading.value = true;
      let params = Object.assign({}, formData);
      params.gInfoIdList =
        input_item_vari.value.replaceAll('，', ',').trim() == ''
          ? []
          : input_item_vari.value.split(',');
      const { code, data, count, extra } = await getShipmentList(params);
      if (code === '0000') {
        shipmentList.value = data.list
          ? data.list[0]?.shipments.map((item) => {
              // 将子级的pSKU去重展示到父级
              const skuSet = new Set();
              const skcSet = new Set();
              item.shipmentDetailDtoList.forEach((sItem) => {
                const pSku = sItem?.pSku;
                const sellerSkc = sItem?.sellerSkc;
                if (pSku) {
                  skuSet.add(pSku);
                }
                if (sellerSkc) {
                  skcSet.add(sellerSkc);
                }
              });

              // 将子级的计划/实发累加至父级
              const totalPlanQuantity = item.shipmentDetailDtoList.reduce(
                (sum, sItem) => sum + sItem.planQuantity,
                0
              );
              item.totalPlanQuantity = totalPlanQuantity;
              const totalActQuantity = item.shipmentDetailDtoList.reduce(
                (sum, sItem) => sum + sItem.actQuantity,
                0
              );
              item.totalActQuantity = totalActQuantity;

              return {
                ...item,
                pSkuStr: Array.from(skuSet).join(','),
                skcStr: Array.from(skcSet).join(','),
                displayCount: DEFAULT_TR_LENGTH
              };
            })
          : [];
        total.value = count;
        boxCodeVisitUrlPrex.value = extra && extra.boxCodeVisitUrlPrex;
        totalKind.value = shipmentList.value.reduce(function (prev, cur) {
          return prev + cur.skuNumber;
        }, 0);
        totalProductNum.value = shipmentList.value.reduce(function (prev, cur) {
          return prev + cur.goodsQuantity;
        }, 0);
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  // 处理 tabs 货件的数量
  const handleTabsCount = () => {
    tabList.value.forEach((item) => {
      item.count = 0;
      countList.value.forEach((cItem) => {
        if (item.status == cItem.oa_process_status) {
          item.count = cItem.count;
        }
      });
    });
  };

  const handleCheckboxCount = () => {
    checkboxList.value.forEach((item) => {
      item.count = 0;
      processList.value.forEach((cItem) => {
        if (item.status == cItem.store_process_status) {
          item.count = cItem.count;
        }
      });
    });
  };
  const checkList = ref([]); // 待装箱状态
  // 切换待装箱状态
  const changeStatus = (val) => {
    // 复选框值选择一个
    if (val.length > 1) {
      let single = checkList.value.splice(1);
      checkList.value = single;
    }
    formData.storeProcessStatus = Number(checkList.value[0]);
    handleQuery();
  };

  const showPackup = ref(false); // 是否显示发包装和详情弹窗
  const isDetail = ref(false); // 详情弹窗 true 包装弹窗 false
  const packupDetailRef = ref(null);
  // const detailList = ref([]);
  const platCode = ref('');

  const detailId = ref('');
  // 显示发包装和详情弹窗
  const viewPackup = (row) => {
    showPackup.value = true;
    isDetail.value = false;
    platCode.value = row.platCode;
    detailId.value = row.id;
  };

  // 货件计划 查看详情
  const handleRowClick = ({ row, column }) => {
    let selection = window.getSelection() || {};
    if (selection.type === 'Range') {
      return false;
    }

    if (column.type !== 'checkbox' && column.className !== 'sub_table_cell') {
      showPackup.value = true;
      isDetail.value = true;
      platCode.value = formData.platCode || row.platCode;
      detailId.value = row.id;
    }
  };

  // 关闭包装弹窗
  const handleClosePackup = () => {
    showPackup.value = false;
  };

  // 批量转待审核
  const handlePendingReview = async () => {
    if (getSelectedList()) {
      const { code } = await batchPendingReviewApi({
        ids: selectRecords.value.map((item) => item.id)
      });
      if (code === '0000') {
        ElMessage.success('转待审核成功！');
        handleQuery();
      }
    }
  };

  // 批量取消
  const handleBatchCancel = async () => {
    if (getSelectedList()) {
      const { code } = await batchBatchCancelApi({
        ids: selectRecords.value.map((item) => item.id)
      });
      if (code === '0000') {
        ElMessage.success('取消成功！');
        handleQuery();
      }
    }
  };

  // 批量修改AE揽收单
  const showBatchWritePickUp = ref(false);
  const shipmentIdList = ref([]);
  const batchUpdateAEPickUpNo = () => {
    if (getSelectedList()) {
      // 校验只能勾选AE
      const isPlatformValid = selectRecords.value.every(
        (item) => item.platCode === 'AE半托管' || item.platCode === 'AE全托管'
      );
      if (!isPlatformValid) {
        return ElMessage.warning('只能勾选AE全托管或者AE半托管!');
      }
      if (selectRecords.value.length !== 1) {
        // 勾选2个或以上校验平台/店铺/入库单三者是否一致
        const [firstSelectItem, ...restSelctItems] = selectRecords.value;
        const isSame = restSelctItems.every(
          ({ platCode, storeAcct, aePoNo }) =>
            platCode === firstSelectItem.platCode &&
            storeAcct === firstSelectItem.storeAcct &&
            aePoNo === firstSelectItem.aePoNo
        );
        if (!isSame) {
          return ElMessage.warning('不能批量修改AE揽收单!');
        }
      }

      const haveValList = selectRecords.value.filter(
        (item) =>
          (item.lbxNo && item.lbxNo !== '') ||
          (item.pickUpNo && item.pickUpNo !== '')
      );

      // 勾选的数据 如果LBX或者揽收单号不为空 弹出提示
      if (haveValList.length) {
        const platOrderIdList = haveValList.map((v) => v.platOrderId).join(',');
        return ElMessageBox.confirm(
          `{${platOrderIdList}}揽收单不为空,是否确认修改?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            showBatchWritePickUp.value = true;
            shipmentIdList.value = selectRecords.value.map((v) => v.id);
          })
          .catch((err) => {
            // 关闭不修改
            handleCloseBatchWritePickUp();
            console.log(err);
          });
      } else {
        // 勾选的LBX和揽收单号均为空
        showBatchWritePickUp.value = true;
        shipmentIdList.value = selectRecords.value.map((v) => v.id);
      }
    }
  };

  // 关闭修改AE揽收单
  const handleCloseBatchWritePickUp = () => {
    showBatchWritePickUp.value = false;
  };

  // 修改采购备注
  const purchaseRemarkVisible = ref(false);
  const handleBatchPurchaseRemark = async () => {
    if (getSelectedList()) {
      purchaseRemarkVisible.value = true;
    }
  };

  // 清空发货单和快递单
  const handleRemoveLogisNoAndDeliverOrderSn = async () => {
    try {
      if (getSelectedList()) {
        loading.value = true;
        const idStr = selectRecords.value.map((item) => item.id).join();
        const { code, msg } = await removeLogisNoAndDeliverOrderSnApi(idStr);
        loading.value = false;
        if (code === '0000') {
          ElMessage.success('清空发货单和快递单成功！');
          handleQuery();
        } else {
          ElMessageBox.confirm(msg || '请求失败', '错误信息', {
            confirmButtonText: '确认',
            type: 'error',
            dangerouslyUseHTMLString: true
          });
        }
      }
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  // 清空发货单号
  const handleCleaDeliver = async () => {
    try {
      if (getSelectedList()) {
        loading.value = true;
        let formParams = new FormData();
        formParams.append('file', undefined);
        formParams.append('deliverOrderSn', '');
        formParams.append(
          'ids',
          selectRecords.value.map((item) => item.id)
        );

        const { code, msg } = await editDeliverOrder(formParams);
        loading.value = false;
        if (code === '0000') {
          ElMessage.success('清除发货单号成功！');
          handleQuery();
        } else {
          ElMessageBox.confirm(msg || '请求失败', '错误信息', {
            confirmButtonText: '确认',
            type: 'error',
            dangerouslyUseHTMLString: true
          });
        }
      }
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };
  // 是否显示修改发货单弹窗
  const showEditDeliver = ref(false);
  const batchBeliverId = ref([]);
  // const handleEditDeliver = () => {
  //   if (getSelectedList()) {
  //     batchBeliverId.value = selectRecords.value.map((item) => item.id);
  //     showEditDeliver.value = true;
  //   }
  // };

  const handleCloseEditDeliver = () => {
    showEditDeliver.value = false;
  };

  // 是否显示发货弹窗
  const showDeliver = ref(false);
  const deliverInfo = ref({});
  const selectedPlat = ref('');
  const deliverId = ref(0); // 发货 id
  const batchDeliverId = ref([]);
  const isBatchSend = ref(false);
  const viewDeliver = (row = {}) => {
    if (JSON.stringify(row) === '{}') {
      if (getSelectedList()) {
        selectedPlat.value = '';
        batchDeliverId.value = selectRecords.value.map((item) => item.id);
        isBatchSend.value = true;
        showDeliver.value = true;
        deliverInfo.value = row;
      }
    } else {
      selectedPlat.value = row.platCode;
      deliverId.value = row.id;
      isBatchSend.value = false;
      showDeliver.value = true;
      deliverInfo.value = row;
    }
  };
  // 打印物流面单
  const printLogisticsTemplate = (row) => {
    let url = boxCodeVisitUrlPrex.value + row.deliverOrderFile;
    let obj = {
      printType: 19, //固定
      labelUrl: url, //物流面单的url
      printName: 100150,
      width: 100,
      height: 150
    };
    printCase(obj);
  };
  // 修改快递信息
  const isUpdateLogistics = ref(false);
  const handleUpdateLogisticsInfo = (row = {}) => {
    if (JSON.stringify(row) === '{}') {
      if (getSelectedList()) {
        batchDeliverId.value = selectRecords.value.map((item) => item.id);
        isBatchSend.value = true;
        showDeliver.value = true;
        deliverInfo.value = row;
      }
    } else {
      deliverId.value = row.id;
      isBatchSend.value = false;
      showDeliver.value = true;
      deliverInfo.value = row;
    }
    isUpdateLogistics.value = true;
  };
  let updateLogisticsVisible = ref(false);
  let teumLogisticsList = ref([]); //物流公司数据
  let temuSelectLogisticsId = ref(null); //选中的行的id
  let temuRowIndex = ref('');
  let nowD = new Date();
  nowD.setHours(18);
  nowD.setMinutes(0);
  nowD.setSeconds(0);
  let updateLogisticsForm = reactive({
    expressCompanyId: '',
    expectedPickupTime: transferDate(nowD)
  });
  // temu修改物流按钮事件-打开弹窗
  const temuUpdateLogistics = async (row, rowIndex) => {
    temuRowIndex.value = rowIndex;
    updateLogisticsForm.expressCompanyId = '';
    let nowD = new Date();
    nowD.setHours(18);
    nowD.setMinutes(0);
    nowD.setSeconds(0);
    updateLogisticsForm.expectedPickupTime = transferDate(nowD);
    temuSelectLogisticsId.value = row.id;
    let { data } = await queryTemuGetMatchLogistics({
      shipmentId: row.id
    });
    teumLogisticsList.value = data;
    updateLogisticsVisible.value = true;
  };
  // 关闭temu修改物流弹窗
  const closeTemuLogistics = () => {
    updateLogisticsVisible.value = false;
    updateLogisticsForm.expressCompanyName = '';
  };
  // 点击temu修改物流弹窗提交按钮
  const submitTemunLogistics = async () => {
    if (!updateLogisticsForm.expressCompanyId) {
      ElMessage.warning('请选择物流公司');
      return;
    }
    updateLogisticsVisible.value = false;
    let select_company = teumLogisticsList.value.filter(
      (item) => item.expressCompanyId == updateLogisticsForm.expressCompanyId
    );
    let params = {
      shipmentId: temuSelectLogisticsId.value,
      expressCompanyId: select_company[0].expressCompanyId,
      expressCompanyName: select_company[0].expressCompanyName,
      expectedPickupTime: transferDate(updateLogisticsForm.expectedPickupTime),
      predictId: select_company[0].predictId
    };
    let { data } = await quieryTemuChangeShipOrderLogistics(params);
    shipmentList.value[temuRowIndex.value].logisticsNo = data;
    shipmentList.value[temuRowIndex.value].expectedPickupTime =
      updateLogisticsForm.expectedPickupTime;
  };

  // 批量发货成功
  const handleSendDeliver = (idList = []) => {
    if (idList.length) {
      const data = shipmentList.value.filter((item) =>
        idList.includes(String(item.id))
      );
      if (data[0].platCode === 'AE全托管' || data[0].platCode === 'AE半托管') {
        // 打印箱唛(LBX)[成功了打印揽收单]
        getAeCaseLabel(data[0]);
      }
    }
  };

  // 关闭发货弹窗
  const handleCloseDeliver = (val) => {
    // 如果存在已经打开的装箱弹窗 关闭发货弹窗同时也要关闭装箱弹窗
    if (val) {
      showBoxup.value = false;
    }
    showDeliver.value = false;
    isUpdateLogistics.value = false;
  };

  // 关闭填写发货单弹窗
  // const showWriteDeliver = ref(false);
  // const handleCloseWriteDeliver = () => {
  //   showWriteDeliver.value = false;
  // };

  // 取消 待审核 待装箱 待发货
  const handleCancel = async (row) => {
    // 待发货的取消
    if (activeKey.value === '4') {
      // 调用平台取消接口 success 为 true 时调用 OA 取消接口
      // 调用平台取消接口 success 为 false 时,提示错误信息，确认后调用 OA 取消接口
      try {
        const res = await platCancel({
          id: row.id
        });
        if (res?.code === '0000') {
          if (res?.data && res.data.success) {
            cancelFn(row);
          } else {
            ElMessageBox.alert(res?.data.reason || '请求错误', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                // 关闭错误信息后 进行二次取消确认
                ElMessageBox.confirm('是否仍旧进行取消操作?', '', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  cancelFn(row);
                });
              }
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      cancelFn(row);
    }
  };

  const cancelFn = async (row) => {
    try {
      const { code } = await cancelCheck({
        status: activeKey.value,
        shipmentId: [row.id]
      });
      if (code === '0000') {
        ElMessage.success('取消成功！');
        handleQuery();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 导出
  const handleExport = async () => {
    try {
      loading.value = true;
      transBlob({
        url: '/lms/PlatWh/PlatWhShipment/PlatWhShipmentFullExport',
        contentType: 'application/json',
        data: formData,
        fileName: '货件信息' + Date.now() + '.xls'
      }).finally(() => {
        loading.value = false;
        ElMessage.success('下载成功');
      });
    } catch (err) {
      console.log(err);
    }
  };

  const showExportDialog = ref(false);

  // 按模板导出
  const isExportAll = ref(false);
  const handleExportTemp = () => {
    // 获取表格多选数据
    const $table = orderTable.value;
    if (activeKey.value === '-1') {
      selectRecords.value = $table[$table.length - 1].getCheckboxRecords();
    } else {
      selectRecords.value = $table[activeKey.value].getCheckboxRecords();
    }
    isExportAll.value = selectRecords.value.length === 0 ? true : false;
    showExportDialog.value = true;
  };

  // 批量上传物流面单逻辑部分
  const logisticsbillDialog = ref(false); // 控制批量上传物流单号的弹出框的显示与隐藏
  //批量上传物流面单弹窗中-物流单号的数据
  const logisticsNumberForm = reactive({
    logisticsNumber: ''
  });
  //批量上传物流面单弹窗中-为物流单号设置规则
  const logisticsBillRules = reactive({
    logisticsNumber: [
      {
        required: true,
        message: '请输入物流单号',
        trigger: 'blur'
      }
    ]
  });
  const logisticsBillList = ref([]); //上传物流面单的列表
  // 批量上传物流面单按钮功能
  const handlerBatchUploadLogisticsbill = () => {
    //判断是否有选中的行
    if (getSelectedList()) {
      logisticsbillDialog.value = true;
    }
  };
  // 批量上传物流面单弹窗中-上传物流面单的upload功能
  const handlelogisticsBillChange = (file, files) => {
    logisticsBillList.value = files;
  };
  // 批量上传物流面单弹窗中-批量清除物流面单功能
  const clearlogisticsBillCase = async () => {
    try {
      const shipmentIdStr = selectRecords.value
        .map((item) => item.id)
        .toString();
      const { code } = await clearLogisticsBillApi({
        shipmentIdStr: shipmentIdStr
      });
      if (code === '0000') {
        ElMessage.success('批量清除物流面单成功!');
        logisticsNumberForm.logisticsNumber = '';
        logisticsBillList.value = [];
        // shipmentList.value?.forEach((item) => {
        //   if (item.id === uploadId.value) {
        //     item.caseLabel = '';
        //   }
        // });
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 批量上传物流面单弹窗中-提交按钮的功能
  const UploadLogisticsBillFile = async () => {
    try {
      const shipmentIdStr = selectRecords.value
        .map((item) => item.id)
        .toString();
      var form = new FormData();
      logisticsBillList.value.forEach((item) => {
        if (item.raw) {
          form.append('file', item.raw);
        }
      });
      form.append('shipmentIdStr', shipmentIdStr);
      form.append('deliverOrderSn', logisticsNumberForm.logisticsNumber);
      const { code } = await UploadLogisticsBillApi(form);
      if (code === '0000') {
        ElMessage.success('批量上传物流面单成功!');
        logisticsbillDialog.value = false;
        logisticsNumberForm.logisticsNumber = '';
        logisticsBillList.value = [];
        // handleQuery();
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 批量上传物流面单弹窗中-右上角取消X的功能
  const handlelogisticsNumberClose = () => {
    logisticsbillDialog.value = false;
    logisticsNumberForm.logisticsNumber = '';
    logisticsBillList.value = [];
  };

  const handleCloseExportDialog = () => {
    showExportDialog.value = false;
  };

  // 转待审核
  const handleCancelToCheck = async (row) => {
    try {
      const { code } = await cancelToCheck({
        // status: activeKey.value,
        id: row.id
      });
      if (code === '0000') {
        ElMessage.success('转待审核成功！');
        handleQuery();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const showBoxup = ref(false);
  const boxupInfo = ref({});
  const boxType = ref('');
  const batchBoxUpId = ref([]);
  const selectList = ref([]);
  // 合单装箱
  const handleMergeBox = async () => {
    if (getSelectedList()) {
      batchBoxUpId.value = selectRecords.value.map((item) => item.id);
      await queryCheckHaveCaseLabel({ idStr: batchBoxUpId.value.join(',') });
      selectList.value = selectRecords.value.map((item) => {
        return {
          platCode: item.platCode, // 平台
          platOrderId: item.platOrderId, // 货件编号
          logisticsNo: item.logisticsNo, // 快递单号
          logisticsFee: item.logisticsFee // 快递费用
        };
      });
      showBoxup.value = true;
      boxType.value = 'merge';
      getMergeBox();
    }
  };
  // 显示装箱弹窗
  const boxUpId = ref(null);
  const viewBoxup = async (row) => {
    showBoxup.value = true;
    boxUpId.value = row.id;
    // 待装箱“合单装箱”和“装箱”按钮校验货件是否上传箱唛
    await queryCheckHaveCaseLabel({ idStr: row.id });
    selectList.value = [
      {
        platCode: row.platCode, // 平台
        platOrderId: row.platOrderId, // 货件编号
        logisticsNo: row.logisticsNo, // 快递单号
        logisticsFee: row.logisticsFee // 快递费用
      }
    ];
    boxType.value = '';
    queryBoxupData(row.id);
  };

  // 打印合单批次号
  const handleToPrintComBoxBatchNo = async (row) => {
    if (!row.comBoxBatchNo) {
      return ElMessage.warning('该货件没有合单批次号！');
    }
    const params = {
      printTplType: 'COM_BOX_BATCH_NO_LABEL', // 固定值
      bizId: row.comBoxBatchNo // 合单批次号
    };
    const { data: printObj } = await commonGetPrintInfoApi(params);
    await commonExecutePrintJobs([printObj]);
  };

  // 合单装箱
  const getMergeBox = async () => {
    try {
      if (getSelectedList()) {
        const { code, data } = await mergeBox({
          ids: selectRecords.value.map((item) => item.id)
        });
        if (code === '0000') {
          boxupInfo.value = data;
          // 初始化装箱数量
          boxupInfo.value.platWhShipmentDetailDtos.forEach((item) => {
            if (item.count !== 'undefined') {
              item.count = 0;
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取装箱数据
  const queryBoxupData = async (id) => {
    try {
      const { code, data } = await queryBoxup({ shipmentId: id });
      if (code === '0000') {
        boxupInfo.value = data;
        // 初始化装箱数量
        boxupInfo.value.platWhShipmentDetailDtos.forEach((item) => {
          if (item.count !== 'undefined') {
            item.count = 0;
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isAutoPopUp = ref(false);
  // 装箱成功(再请求一遍打印箱唛)【temu 都打印；shein任选一个打印】
  const handleSuccessBoxup = (infoList) => {
    // let temuList = [];
    // temuList = infoList.filter(
    //   (item) => item.platCode && item.platCode === 'temu'
    // );

    // if (temuList.length) {
    //   infoList.forEach((item) => {
    //     handlePrint(item);
    //   });
    // } else {
    handlePrint(infoList[0]);
    // }
  };

  // 装箱成功了 之后根据勾选了装箱后发货 打开发货弹窗
  const selectBoxUpList = ref([]);
  const handleIsToSend = ({ id, checkedBox, isMergeBox, selectList }) => {
    // 是否勾选了装箱后发货
    if (checkedBox) {
      // 是否合单装箱
      if (isMergeBox) {
        // 如果是AE半托管/全托管 则不弹出发货框 去打印框号标签
        if (
          selectList[0].platCode === 'AE全托管' ||
          selectList[0].platCode === 'AE半托管'
        ) {
          isAutoPopUp.value = false;
          showDeliver.value = false;
          selectBoxUpList.value = [];

          handleBarCodeNoPackAE(id);
          return;
        }
        if (selectList[0].platCode === 'tiktok') {
          handlePrint(selectRecords.value[0]);
        }
        batchDeliverId.value = id;
        isBatchSend.value = true;
        // 如果合单装箱 并且勾选的只要有一项有快递单号 则直接给提示 且不弹出发货框
        const haveLogisticsNoList = selectList.filter(
          (item) => item.logisticsNo !== ''
        );
        if (haveLogisticsNoList.length) {
          const platOrderIdStr = haveLogisticsNoList
            .map((item) => item.platOrderId)
            .join(',');
          ElMessageBox.confirm(
            `{货件号${platOrderIdStr}}已有快递单号, 请到"待发货"界面操作!`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          );
          isAutoPopUp.value = false;
          showDeliver.value = false;
          selectBoxUpList.value = [];
        } else {
          // 合单装箱 都没有快递单号 则展示发货弹窗 并且给出默认值
          isAutoPopUp.value = true;
          showDeliver.value = true;
          selectBoxUpList.value = [];
          selectedPlat.value = '';
        }
      } else {
        deliverId.value = id;
        isBatchSend.value = false;
        isAutoPopUp.value = true;
        showDeliver.value = true;
        selectedPlat.value = selectList[0].platCode;
        selectBoxUpList.value = selectList;
      }
    }
  };

  // 打印框号标签(AE)
  const handleBarCodeNoPackAE = (idList) => {
    const data = shipmentList.value.filter((item) => idList.includes(item.id));

    let printObj100 = {};
    // 判断 框号（bottomLine1），是XU开头，barCode传bottomLine1一样的值，并且deliverOrderSn传一个字“单”
    const isIncludeXu = ref(false);
    const newBarCode = ref('');

    if (data && data[0].frameCode.includes('XU')) {
      newBarCode.value = data[0].frameCode;
      isIncludeXu.value = true;
    }

    printObj100 = {
      printerName: 100100,
      jspaper: 'platWhSellerSku100100.jasper',
      printDetailDtoList: [
        {
          titleMap: {
            barCode: isIncludeXu.value ? newBarCode.value : data.id,
            bottomLine1: data && data[0].frameCode,
            bottomLine2: `货件计划:${data && data[0].platOrderId}`,
            bottomLine3: `实发数量:${data[0].shipmentDetailDtoList[0].actQuantity} 种类:${data[0].shipmentDetailDtoList[0].skuNumber}`,
            prodSSku: `${data[0].shipmentDetailDtoList[0].prodSSku}`,
            deliverOrderSn: isIncludeXu.value
              ? `单 ${data[0].storeAcct || ''}`
              : `${data[0]?.deliverOrderSn}${data.storeAcct || ''}`,
            locationCode: `${data[0].shipmentDetailDtoList[0].locationCode}`,
            sellerSkuCode: data[0].alias,
            specification: data[0].shipmentDetailDtoList[0].specification || '',
            comBoxNo: data[0]?.comBoxNo || ''
          },
          amount: 1
        }
      ]
    };
    // 装箱成功后 AE不打印sku信息---(.first.jasper)
    // let printObj = Object.assign({}, printObj100);
    // printObj.jspaper = 'platWhSellerSku10040first.jasper';
    // epeanPrint_plugin_fun(99, printObj);
    epeanPrint_plugin_fun(99, printObj100);
  };

  // 关闭装箱弹窗
  const handleCloseBoxup = () => {
    showBoxup.value = false;
    boxupInfo.value = {};
  };

  // 获取复选框选中的数据
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = orderTable.value;
    if (activeKey.value === '-1') {
      selectRecords.value = $table[$table.length - 1].getCheckboxRecords();
    } else {
      selectRecords.value = $table[activeKey.value].getCheckboxRecords();
    }
    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };

  // 待审核-模板下载
  const downloadTemp = () => {
    const elink = document.createElement('a'); // 建一个a标签
    elink.style.display = 'none'; // 设置标签style属性
    elink.href =
      window.location.origin +
      '/api/lms/PlatWh/PlatWhShipment/downShipmentExcelTemplate.html'; // 设置标签href
    document.body.appendChild(elink); // 页面中添加这个标签
    elink.click(); // 点击这个标签
    URL.revokeObjectURL(elink.href);
  };

  const showMateDialog = ref(false);

  const mateList = ref([]);
  // 匹配sku
  const handleMateSku = async () => {
    try {
      if (getSelectedList()) {
        loading.value = true;
        const { code, data } = await mateSku({
          shipmentIds: selectRecords.value.map((item) => item.id)
        });
        loading.value = false;
        if (code === '0000') {
          console.log('data', data);
          showMateDialog.value = true;
          mateList.value = data;
          handleQuery();
        }
      }
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  // 上传揽收单号
  const importPickUpNoLoading = ref(false);
  const beforePickUpNoUpload = () => {
    importPickUpNoLoading.value = true;
  };

  const importPickUpNoSuccess = (res) => {
    if (res.code == '0000') {
      ElMessageBox.confirm(res.msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      });
    } else {
      ElMessageBox.confirm(res.msg || '上传揽收单号失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
    importPickUpNoLoading.value = false;
  };

  const importPickUpNoError = () => {
    ElMessage.error('上传揽收单号失败！');
    importPOloading.value = false;
  };

  // 导入入库单号
  const showImportDialog = ref(false);
  const importList = ref([]);
  const importPOloading = ref(false);
  const beforeUpload = () => {
    importPOloading.value = true;
  };
  const importPOSuccess = (res) => {
    if (res.code == '0000') {
      ElMessageBox.confirm(res.msg, '信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      });
      // ElMessage.success('导入入库单号成功！');
    } else {
      ElMessageBox.confirm(res.msg || '导入入库单号失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
    importPOloading.value = false;
  };

  const importPOError = () => {
    ElMessage.error('导入入库单号失败！');
    importPOloading.value = false;
  };
  // 待审核-导入新增
  const importSuccess = (res) => {
    if (res.code == '0000') {
      showImportDialog.value = true;
      importList.value = res.data || [];
      // ElMessage.success('导入新增成功！');
      handleQuery();
    } else {
      ElMessageBox.confirm(res.msg || '导入新增失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };

  const importError = () => {
    ElMessage.error('导入新增失败！');
  };

  const showAddPurchaseDialog = ref(false);
  const purchaseList = ref([]);
  const purchaseRef = ref(null);
  const purchaseSelectRecords = ref([]);

  const needBorrowFilters = ref([]);

  const needPurchaseFilters = ref([]);
  // 获取采购列表复选框选中的数据
  const getPurchaseSelectedList = () => {
    // 获取表格多选数据
    const $table = purchaseRef.value;
    purchaseSelectRecords.value = $table.getCheckboxRecords();
    if (purchaseSelectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };
  // 新增采购弹窗
  const warehouseName = ref('');
  const handleAddPurchase = async () => {
    showAddPurchaseDialog.value = true;
  };

  const queryPurchaseList = async () => {
    try {
      if (!warehouseName.value) {
        return ElMessage.warning('请先选择仓库名称');
      }
      purchaseLoading.value = true;
      const { code, data } = await getPurchaseList({
        warehouseName: warehouseName.value
      });
      if (code === '0000') {
        purchaseList.value = data;

        let borrowObj = {};
        let purchaseObj = {};
        needBorrowFilters.value = [];
        needPurchaseFilters.value = [];
        data.forEach((item) => {
          if (item.needBorrow || item.needBorrow == 0) {
            borrowObj = { label: item.needBorrow, value: item.needBorrow };
            needBorrowFilters.value.push(borrowObj);
          }
          if (item.needPurchase || item.needPurchase == 0) {
            purchaseObj = {
              label: item.needPurchase,
              value: item.needPurchase
            };
            needPurchaseFilters.value.push(purchaseObj);
          }
        });
        needBorrowFilters.value = arrDistinctByProp(
          needBorrowFilters.value,
          'label'
        );
        needPurchaseFilters.value = arrDistinctByProp(
          needPurchaseFilters.value,
          'label'
        );

        // 筛选的 数据
        const $table = purchaseRef.value;
        if ($table) {
          const nameColumn = $table.getColumnByField('needPurchase');
          if (nameColumn) {
            $table.setFilter(nameColumn, needPurchaseFilters.value);
          }
          const borrowColumn = $table.getColumnByField('needBorrow');
          if (borrowColumn) {
            $table.setFilter(borrowColumn, needBorrowFilters.value);
          }
        }
      }
      purchaseLoading.value = false;
    } catch (err) {
      console.log(err);
      purchaseLoading.value = false;
    }
  };

  const arrDistinctByProp = (arr, prop) => {
    let obj = {};
    return arr.reduce(function (preValue, item) {
      obj[item[prop]] ? '' : (obj[item[prop]] = true && preValue.push(item));
      return preValue;
    }, []);
  };

  const updateBorrowFilter = () => {
    needBorrowFilters.value = [];
    purchaseList.value.forEach((item) => {
      item.needBorrow = Number(item.needBorrow);
      if (item.needBorrow || item.needBorrow == 0) {
        let obj = { label: item.needBorrow, value: Number(item.needBorrow) };
        needBorrowFilters.value.push(obj);
      }
    });
    needBorrowFilters.value = arrDistinctByProp(
      needBorrowFilters.value,
      'label'
    );
    const $table = purchaseRef.value;
    if ($table) {
      const nameColumn = $table.getColumnByField('needBorrow');
      if (nameColumn) {
        $table.setFilter(nameColumn, needBorrowFilters.value);
      }
    }
  };

  const updatePurchaseFilter = () => {
    needPurchaseFilters.value = [];
    purchaseList.value.forEach((item) => {
      item.needPurchase = Number(item.needPurchase);
      if (item.needPurchase || item.needPurchase == 0) {
        let obj = { label: item.needPurchase, value: item.needPurchase };
        needPurchaseFilters.value.push(obj);
      }
    });
    needPurchaseFilters.value = arrDistinctByProp(
      needPurchaseFilters.value,
      'label'
    );
    const $table = purchaseRef.value;
    if ($table) {
      const nameColumn = $table.getColumnByField('needPurchase');
      if (nameColumn) {
        $table.setFilter(nameColumn, needPurchaseFilters.value);
      }
    }
  };

  const cellStyle = ({ column }) => {
    if (
      column.field === 'defaultWareHouseAvailableStock' ||
      column.field === 'platWhStock'
    ) {
      return {
        backgroundColor: 'rgb(255, 247, 228)'
      };
    }
    if (
      column.field === 'defaultWareHousePreAvailableStock' ||
      column.field === 'platWhPreAvailableStock'
    ) {
      return {
        backgroundColor: 'rgb(231, 244, 255)'
      };
    }
    if (
      column.field === 'unAuditItemsNum' ||
      column.field === 'platWhUnAuditItemsNum'
    ) {
      return {
        backgroundColor: 'rgb(255, 228, 228)'
      };
    }
    if (column.field === 'totalPlanQuantity') {
      return {
        backgroundColor: 'rgb(255, 184, 0)'
      };
    }
  };

  const purchaseLoading = ref(false);

  // 生成调拨单
  const createTransfer = async () => {
    try {
      if (getPurchaseSelectedList()) {
        purchaseLoading.value = true;
        // let purchaseDtos = [];
        // purchaseSelectRecords.value?.forEach((item) => {
        //   let obj = {
        //     prodSId: item.prodSId,
        //     needBorrow: item.needBorrow,
        //     ssku: item.ssku
        //   };
        //   purchaseDtos.push(obj);
        // });
        let params = {
          warehouseName: warehouseName.value,
          dtos: purchaseSelectRecords.value
        };
        const { code, msg } = await transferStore(params);
        if (code === '0000') {
          ElMessageBox.confirm(msg, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'success'
          });
          purchaseLoading.value = false;
        }
      }
    } catch (err) {
      console.log(err);
      purchaseLoading.value = false;
    }
  };

  const handlePurchaseStore = async () => {
    if (getPurchaseSelectedList()) {
      let greaterThanZero = [];
      purchaseSelectRecords.value.forEach((item) => {
        if (item.platWhUnAuditItemsNum > 0) {
          greaterThanZero.push(item.ssku);
        }
      });
      if (greaterThanZero.length > 0) {
        ElMessageBox.confirm(
          `以下SKU存在未审核采购订单【${greaterThanZero.join(
            ','
          )}】,是否继续采购?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          purchaseFn(true);
        });
      } else {
        purchaseFn(false);
      }
    }
  };

  const purchaseFn = async (ifIgnore) => {
    try {
      purchaseLoading.value = true;
      let params = {
        ifIgnore,
        dtos: purchaseSelectRecords.value,
        warehouseName: warehouseName.value
      };
      const { code, msg } = await purchaseToStore(params);
      if (code === '0000') {
        ElMessage.success(msg || '采购成功！');
      }
      purchaseLoading.value = false;
    } catch (err) {
      console.log(err);
      purchaseLoading.value = false;
    }
  };

  const closeAddPurchase = () => {
    showAddPurchaseDialog.value = false;
    warehouseName.value = '';
    purchaseList.value = [];
  };

  const showProgress = ref(false); // 一键采购进度条
  const percent = ref(0); // 进度条进度
  // 一键采购
  // const handlePurchase = async () => {
  //   try {
  //     const { code, data } = await purchaseOrder();
  //     if (code === '0000') {
  //       showProgress.value = true;
  //       getProcessData(data);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // 一键采购进度条
  // const getProcessData = async (params) => {
  //   try {
  //     const { code, data } = await getProcess(params);
  //     if (code === '0000') {
  //       percent.value = data.percent;
  //       if (data.processStatus !== 3) {
  //         setTimeout(() => {
  //           getProcessData(params);
  //         }, 1000);
  //       }
  //       if (data.processStatus === 3) {
  //         setTimeout(() => {
  //           showProgress.value = false;
  //           ElMessage.success('一键采购成功！');
  //         }, 500);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const showSendDialog = ref(false);
  const reasonList = ref([]);
  // 派至仓库
  const handleSendRepository = async () => {
    try {
      if (getSelectedList()) {
        const { code, data } = await sendRepository({
          shipmentId: selectRecords.value.map((item) => item.id)
        });
        if (code === '0000') {
          if (data.length > 0) {
            showSendDialog.value = true;
            reasonList.value = data;
          } else {
            ElMessage.success('派至仓库成功！');
          }
          handleQuery();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 跳过装箱到待发货
  const handleSkipPack = async () => {
    try {
      if (getSelectedList()) {
        const { code } = await skipPack({
          ids: selectRecords.value.map((item) => item.id)
        });
        if (code === '0000') {
          ElMessage.success('跳转至待发货成功！');
          handleQuery();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 审核-转至待派单
  const handleCheckOrder = async () => {
    try {
      if (getSelectedList()) {
        const { code } = await checkOrder({
          status: Number(activeKey.value),
          shipmentId: selectRecords.value.map((item) => item.id)
        });
        if (code === '0000') {
          ElMessage.success('审核成功！');
          handleQuery();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 导出装箱信息
  const exportBoxup = () => {
    if (getSelectedList()) {
      let idList = selectRecords.value.map((item) => item.id);
      let params = {
        idList: idList
      };
      const elink = document.createElement('a'); // 建一个a标签
      elink.style.display = 'none'; // 设置标签style属性
      elink.href =
        window.location.origin +
        '/lms/PlatWh/PlatWhShipment/exportBoxInfo.html?searchParam=' +
        encodeURIComponent(JSON.stringify(params)); // 设置标签href
      document.body.appendChild(elink); // 页面中添加这个标签
      elink.click(); // 点击这个标签
      URL.revokeObjectURL(elink.href);
    }
  };

  // 标记平台发货
  const handleMarkOrder = async () => {
    try {
      if (getSelectedList()) {
        const { code } = await markOrder({
          shipmentIds: selectRecords.value.map((item) => item.id)
        });
        if (code === '0000') {
          ElMessage.success('标记平台发货成功！');
          handleQuery();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const showCaseDialog = ref(false); // 上传箱唛弹窗
  const fileList = ref([]); // 箱唛列表
  const uploadId = ref(''); // 上传箱唛 id
  const boxCodeVisitUrlPrex = ref(''); // 打印箱唛的路径
  const caseLabel = ref(''); // 打印箱唛的pdf
  let inputExpressNumber = ref(''); //请填写快递单号
  const handleUpload = (row) => {
    inputExpressNumber.value = '';
    inputExpressNumber.value = row.logisticsNo;
    uploadId.value = row.id;
    showCaseDialog.value = true;
    caseLabel.value = row.caseLabel;
  };

  const handleChange = (file, files) => {
    fileList.value = files;
  };

  // 清空箱唛
  const clearCase = async () => {
    if (!caseLabel.value) {
      return ElMessage.warning('请先上传箱唛');
    }
    try {
      const { code } = await clearCaseLabel({ id: uploadId.value });
      if (code === '0000') {
        ElMessage.success('清除箱唛成功!');
        shipmentList.value?.forEach((item) => {
          if (item.id === uploadId.value) {
            item.caseLabel = '';
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 上传箱唛
  const uploadFile = async () => {
    try {
      var form = new FormData();
      fileList.value.forEach((item) => {
        if (item.raw) {
          form.append('file', item.raw);
        }
      });
      form.append('id', uploadId.value);
      form.append('logisticsNo', inputExpressNumber.value);
      const { code } = await importCaseLabel(form);
      if (code === '0000') {
        ElMessage.success('上传成功!');
        showCaseDialog.value = false;
        handleQuery();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const showPreview = ref(false);
  const caseInfo = ref({});
  const previewAction = ref('case');
  // 预览箱唛
  const previewCaseLabel = (row) => {
    showPreview.value = true;
    caseInfo.value = row;
    previewAction.value = 'case';
  };

  // 预览发货单
  const previewDeliverCaseLabel = (row) => {
    showPreview.value = true;
    caseInfo.value = row;
    previewAction.value = 'deliverOrder';
  };

  const handleClosePreview = () => {
    showPreview.value = false;
  };

  // 打印快递单
  const getDeliverSn = async (row) => {
    try {
      const res = await savePrintExpressNoLog({ id: row.id });
      if (res.code === '0000') {
        const { code, data } = await printExpressDeliverSnApi({ id: row.id });
        if (code === '0000') {
          if (data && data.length > 0) {
            data?.forEach((item) => {
              let printDetailDtoList = [];
              let detailObj = {
                titleMap: item,
                amount: 1
              };
              printDetailDtoList.push(detailObj);
              let obj = {
                printType: 99,
                printDto: JSON.stringify({
                  printerName: '100100',
                  jspaper: 'platWhExpressDeliverSnTemu.jasper',
                  printDetailDtoList
                })
              };
              printCase(obj);
            });
          } else {
            return ElMessage.warning('没有可以打印的快递单！');
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 打印箱唛
  const handlePrint = async (row) => {
    const res = await savePrintCaseLabelLog({ id: row.id });
    if (res.code === '0000') {
      shipmentList.value.forEach((item) => {
        if (item.id === row.id) {
          caseLabel.value = item.caseLabel;
        }
      });
      // 如果没有上传的箱唛，请求获取箱唛的接口再进行打印
      if (!caseLabel.value) {
        if (row.platCode === 'temu') {
          getCaseLabel(row.id);
        }
        if (row.platCode === 'lazada') {
          getLazadaCaseLabel(row.id);
        }
        if (row.platCode === 'shein自营') {
          getSheinCaseLabel(row);
        }
        // 装箱成功后 AE全/半托管的打印箱唛变为一次
        if (row.platCode === 'AE全托管' || row.platCode === 'AE半托管') {
          getAeCaseLabel(row);
        }
        return;
      } else {
        let caseLabelArr = caseLabel.value.split(',');
        for (let i = 0; i < caseLabelArr.length; i++) {
          let caseLabelItem = caseLabelArr[i];
          let obj = {
            printerName: '100100',
            printType: 100,
            width: 100,
            height: row.platCode === 'shopee' ? 150 : 100,
            url: boxCodeVisitUrlPrex.value + caseLabelItem,
            amount: 1
          };
          printCase(obj);
        }
      }
    }
  };

  // 获取箱唛 lazada
  const getLazadaCaseLabel = async (id) => {
    try {
      const { code, data } = await getLazadaCase({ id: id });
      if (code === '0000') {
        handlePrintTemuAndLazada(data, 'lazadaCaseLabel100100.jasper');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取箱唛 shein 自营
  const getSheinCaseLabel = async (row) => {
    try {
      let params = {
        platOrderId: row.platOrderId || '',
        storeAcctId: row.storeAcctId || ''
      };
      const { code, data } = await getSheinCase(params);
      if (code === '0000') {
        let obj = {
          printerName: '100100',
          printType: 100,
          width: 100,
          height: 100,
          url: data?.caseLabelUrl,
          amount: 1
        };
        printCase(obj);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 打印箱唛参数 AE
  const getAeCaseLabel = async (row) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        let params = {
          printTemplateType: 'PLAT_WH_LABEL',
          tplName: 'AE仓发_箱唛',
          bizzId: row.id
        };
        const { code, data } = await queryAeCaleLabelApi(params);
        if (code === '0000') {
          if (data.labelUrl) {
            let obj = {
              printType: 19,
              width: data.width,
              height: data.height,
              printName: data.printName,
              labelUrl: data.labelUrl
            };
            await printCase(obj);
            if (row.platCode === 'AE全托管' || row.platCode === 'AE半托管') {
              getAeReceiveLabel(row);
            }
            resolve();
          } else {
            ElMessage.warning('没有箱唛可以打印');
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  // 打印箱唛参数 AE揽收单
  const getAeReceiveLabel = async (row) => {
    try {
      let params = {
        printTemplateType: 'PLAT_WH_LABEL',
        tplName: 'AE仓发_揽收单',
        bizzId: row.id
      };
      const { code, data } = await queryAeCaleLabelApi(params);
      if (code === '0000') {
        if (data.labelUrl) {
          let obj = {
            printType: 19,
            width: data.width,
            height: data.height,
            printName: data.printName,
            labelUrl: data.labelUrl
          };
          printCase(obj);
        } else {
          ElMessage.warning('没有箱唛可以打印');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取箱唛 temu
  const getCaseLabel = async (id) => {
    try {
      const { code, data } = await getCaseLabelData({ id: id });
      if (code === '0000') {
        handlePrintTemuAndLazada(data, 'platWhCaseLabelTemu.jasper');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 打印 temu 和 lazada 箱唛
  const handlePrintTemuAndLazada = (data, jspaper) => {
    let printDetailDtoList = [];
    if (data && data.length > 0) {
      data.forEach((item) => {
        let detailObj = {
          titleMap: {},
          amount: 1
        };
        detailObj.titleMap = item;
        printDetailDtoList.push(detailObj);
      });
      let obj = {
        printType: 99,
        printDto: JSON.stringify({
          printerName: '100100',
          jspaper: jspaper,
          printDetailDtoList
        })
      };
      printCase(obj);
    } else {
      return ElMessage.warning('没有可以打印的箱唛！');
    }
  };

  // 打印
  const printCase = (obj) => {
    const loadingInstance = ElLoading.service({
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.4)'
    });
    axios({
      method: 'post',
      url: 'http://localhost:9898/',
      data: qs.stringify(obj)
    })
      .then(() => {})
      .catch((err) => {
        var responseText = err.message;
        if (responseText == null || responseText.indexOf('打印成功') == -1) {
          ElMessage.error(
            '打印错误，请检查打印插件是否正常运行或者重新启动插件'
          );
        }
      })
      .finally(() => {
        loadingInstance.close();
      });
  };

  // 关闭箱唛弹窗
  const closeUpload = () => {
    showCaseDialog.value = false;
    fileList.value = [];
  };

  const copy = (obj) => {
    obj = {
      1: obj.receivor || '',
      2: obj.phoneNumber || '',
      3: obj.detail || ''
    };
    const copyText = Object.values(obj)
      .filter((item) => item !== '')
      .join('\n');
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        ElMessage.success('复制成功');
      })
      .catch((error) => {
        ElMessage.error('复制值时出错:', error);
      });
  };

  // 分页
  const handleSizeChange = (val) => {
    formData.pageSize = val;
    formData.page = 1;
    handleQuery();
  };

  const handleCurrentChange = (val) => {
    formData.page = val;
    handleQuery();
  };

  const CONFIGTYPE = 'AUDITDESPATHORDER_AFTERDISPATCHTOWH';

  // 显示保存搜索配置弹窗
  const configNameDialogVisible = ref(false);
  const configNameDialogOpen = () => {
    configNameDialogVisible.value = true;
  };

  // 查询搜索配置列表
  const searchConfigOption = ref([]);
  const getConfigList = async () => {
    const { data } = await searchConditionConfigList({
      searchType: CONFIGTYPE
    });
    searchConfigOption.value = data;
  };

  // 添加新的搜索配置
  const addNewConfigName = async (name) => {
    const { code } = await searchConditionConfigNew({
      searchType: CONFIGTYPE,
      searchCondition: JSON.stringify(formatParams(formData)),
      searchConditionName: name
    });
    if (code == '0000') {
      ElMessage.success('保存成功');
      getConfigList();
    }
  };

  // 删除配置
  const configOptionDel = async (id) => {
    const { code } = await searchConditionConfigDel(id);
    if (code == '0000') {
      ElMessage.success('删除成功');
      getConfigList();
    }
  };

  // 点击选择已保存搜索配置
  const getConfigOption = (data) => {
    const saveInfo = JSON.parse(data);
    Object.assign(formData, saveInfo);

    const arr1 = [
      'deliverOrderSnList',
      'aePoNoList',
      'lbxNoList',
      'pickUpNoList',
      'comBoxBatchNoList'
    ];

    const arr2 = [
      'ifContainDeliverOrderSn',
      'ifContainAePoNo',
      'ifContainLbxNo',
      'ifContainPickUpNo',
      'ifContainComBoxBatchNo'
    ];
    // 回显发货单号/入库单号/LBX单号/揽收单号/合单批次号
    const index1 = arr1.findIndex((item) => formData[item].length);
    if (index1 !== -1) {
      orderSnStr.value = formData[arr1[index1]].join(',');
      orderType.value = index1 + 1;
    }

    // 回显全部/是/否
    const index2 = arr2.findIndex((item) => formData[item]);
    if (index2 !== -1) {
      const value = formData[arr2[index2]];
      if (value === null) {
        ifContainOrderSn.value = '';
      } else {
        ifContainOrderSn.value = formData[arr2[index2]];
      }
    }

    // 回显创建时间
    const arr3 = [
      'sendTime',
      'deliverTime',
      'createTime',
      'pickupTime',
      'cancelTime'
    ];
    if (formData.deliveryTimeStart) {
      timeType.value = 'deliverTime';
    } else {
      const index3 = arr3.findIndex((item) => formData[item + 'Start']);
      if (index3 !== -1) {
        timeType.value = arr3[index3];
      }
    }

    // 回显店铺
    if (formData.storeAcctList.length) {
      getStoreList();
    }

    // 回显店铺sku/子商品sku精确/模糊
    const arr4 = [
      'sellerSkuList',
      'prodSSkuList',
      'sellerSkuLike',
      'prodSSkuLike'
    ];
    const index4 = arr4.findIndex((item) => formData[item].length);
    if (index4 !== -1) {
      if (index4 === 0 || index4 === 1) {
        skuContent.value = formData[arr4[index4]].join(',');
      } else {
        skuContent.value = formData[arr4[index4]];
      }
    }
    formData.oaProcessStatus = activeKey.value;
    handleQuery();
  };

  // shein自营，OA状态是待审核、待派单、缺货单、待装箱、待发货状态的，等于或超过要求取件时间，货件整条标记黄底
  const rowBgClassName = ({ row }) => {
    const oaStatus = ['0', '1', '2', '3', '4'];
    if (
      row.platCode == 'shein自营' &&
      oaStatus.includes(formData.oaProcessStatus)
    ) {
      const time = new Date().getTime();
      if (row.latestDeliveryTime && time >= row.latestDeliveryTime) {
        return 'row_yellow_bg';
      }
    }
  };
</script>

<style lang="scss" scoped>
  :deep(.vxe-table--body-wrapper) {
    background: none !important;
  }
  .card_position {
    position: relative; /*  */
    .tools_btn {
      display: flex;
      position: absolute;
      top: 10px;
      right: 10px;
      > button {
        margin-left: 12px;
      }
      > div {
        margin-left: 12px;
      }
    }
  }
  .checkbox_margin {
    margin-bottom: 10px;
  }
  .hide_tag {
    :deep(.el-select-tags-wrapper) {
      display: none;
    }
  }
  #add_width {
    .w_input {
      :deep(.el-input) {
        width: 130px !important;
      }
    }
  }
  :deep(.el-radio__inner) {
    border-radius: 2px;
  }
  :deep(.el-radio__input.is-checked .el-radio__inner::after) {
    content: '';
    width: 7px;
    height: 3px;
    border: 1px solid white;
    border-top: transparent;
    border-right: transparent;
    text-align: center;
    display: block;
    position: absolute;
    top: 2px;
    left: 1px;
    transform: rotate(-45deg);
    border-radius: 0px;
    background: none;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
    .progress {
      width: 200px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .speed_tag {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-left: 5px;
    line-height: 22px;
    text-align: center;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
    background: rgb(245, 108, 108);
  }
  .merge_tag {
    display: inline-block;
    width: 40px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
    background: #1e9fff;
  }
  .query_header {
    display: flex;
    justify-content: flex-end;
  }
  .query_form {
    display: flex;
    width: 50%;
    :deep(.el-input) {
      width: 200px;
    }
  }
  .tool_btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .warehouseName {
    :deep(.el-input) {
      // width: 185px;
    }
  }
  .son_container ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-start {
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
  }
  .showOneLine {
    display: inline-block;
    // white-space: nowrap;
    width: 100%;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }
  .flex-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .justify-between {
    display: flex;
    justify-content: space-between;
  }
  .ml-4 {
    margin-left: 4px;
  }
  .w-full {
    width: 100%;
  }
  :deep(.mytable-style.vxe-table .vxe-body--row.row_yellow_bg) {
    background-color: #fdf8bc;
  }
</style>
