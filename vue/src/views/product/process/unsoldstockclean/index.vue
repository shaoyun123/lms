<template>
  <div id="add_width" class="app-container">
    <!-- 数据筛选 start -->
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-row>
          <el-form-item>
            <el-select
              v-model="skuType"
              placeholder="请选择"
              class="form_left"
              clearable
              filterable
            >
              <el-option label="子sku" value="ssku"></el-option>
              <el-option label="父sku" value="psku"></el-option>
            </el-select>
            <el-input
              v-model="skuValue"
              placeholder="支持10000个SKU"
              style="width: 250px"
            >
            </el-input>
            <div
              style="width: 100px; padding-left: 10px; box-sizing: border-box"
            >
              <el-switch
                v-model="skuStatus"
                size="default"
                inline-prompt
                active-text="精确"
                inactive-text="模糊"
                style="height: 24px"
              />
            </div>
          </el-form-item>
          <el-form-item label="部门" prop="orgId">
            <el-cascader
              v-model="formData.orgId"
              :options="state.orgIdList"
              filterable
              clearable
              collapse-tags
              :props="{
                emitPath: false,
                value: 'id',
                label: 'name',
                children: 'childOrgList'
              }"
              @change="handleOrgId"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="roleType"
              placeholder="请选择"
              clearable
              filterable
              class="form_left"
            >
              <el-option value="1" label="开发专员"></el-option>
              <el-option value="2" label="责任人"></el-option>
            </el-select>
            <el-select
              v-model="roleVal"
              placeholder="请选择"
              clearable
              filterable
              multiple
              collapse-tags
              class="form_right"
              :class="roleVal?.length > 1 ? 'hide_tag' : ''"
            >
              <template #prefix>
                <el-tag v-if="roleVal?.length > 1" type="info">
                  已选{{ roleVal?.length }}项</el-tag
                >
              </template>
              <el-option
                v-for="item in state.userList"
                :key="item.id"
                bus
                :label="item.user_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采购专员" prop="buyerIdList">
            <el-select
              v-model="formData.buyerIdList"
              placeholder="请选择"
              clearable
              filterable
              multiple
              collapse-tags
              :class="formData.buyerIdList?.length > 1 ? 'hide_tag' : ''"
            >
              <template #prefix>
                <el-tag v-if="formData.buyerIdList?.length > 1" type="info">
                  已选{{ formData.buyerIdList?.length }}项</el-tag
                >
              </template>
              <el-option
                v-for="item in state.purchaseList"
                :key="item.id"
                bus
                :label="item.userName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟单专员" prop="followerIdList">
            <el-select
              v-model="formData.followerIdList"
              placeholder="请选择"
              clearable
              filterable
              multiple
              collapse-tags
              :class="formData.followerIdList?.length > 1 ? 'hide_tag' : ''"
            >
              <template #prefix>
                <el-tag v-if="formData.followerIdList?.length > 1" type="info">
                  已选{{ formData.followerIdList?.length }}项</el-tag
                >
              </template>
              <el-option
                v-for="item in state.followList"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商" prop="supplierId">
            <el-select
              v-model="formData.supplierId"
              filterable
              remote
              reserve-keyword
              placeholder="输入供应商名称"
              :remote-method="remoteMethod"
              :loading="supplierLoading"
              style="width: 240px"
              clearable
            >
              <el-option
                v-for="item in state.supplierList"
                :key="item.id"
                :label="item.supplier"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="timeType">
            <el-select v-model="timeType" class="form_left">
              <el-option value="createTime" label="导入时间" />
            </el-select>
            <el-date-picker
              v-model="time"
              class="form_right"
              type="daterange"
              value-format="YYYY-MM-DD"
              :shortcuts="shortcuts"
              placeholder="请选择时间"
              clearable
            />
          </el-form-item>

          <el-form-item style="margin-left: 70px">
            <template #label>
              <el-checkbox
                v-model="formData.ifPurchaseReturnBool"
                label="符合采购退件"
              />
            </template>
            <el-select
              v-model="formData.purchaseDealStatus"
              placeholder="采购处理结果"
              clearable
            >
              <el-option
                label="供应商同意退件"
                value="供应商同意退件"
              ></el-option>
              <el-option
                label="供应商不同意退件"
                value="供应商不同意退件"
              ></el-option>
              <el-option label="未处理" value="未处理"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formData.ifHighValueProdBool"
              label="高价值产品"
            />
            <div style="width: 65px"></div>
          </el-form-item>
          <el-form-item label="出库单">
            <el-input
              v-model="outboundOrderNoListStr"
              placeholder="请选择"
              clearable
              style="width: 90px !important"
              class="form_left"
              @clear="clearOrderNo"
            >
            </el-input>
            <el-select
              v-model="formData.ifContainOutBoundOrderNo"
              class="mini_select form_right"
              popper-class="widthSelect"
              @change="changeOutNo"
            >
              <el-option label="请选择" value=""></el-option>
              <el-option label="有" :value="true"></el-option>
              <el-option label="无" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <!-- </el-row>
        <el-row> -->

          <el-form-item label="仓库" prop="warehouseId">
            <el-select
              v-model="formData.warehouseId"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in state.warehouseList"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="清仓方式" prop="cleanStockWay">
            <el-select
              v-model="formData.cleanStockWay"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in state.cleanWayList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序方式" prop="orderType">
            <el-select
              v-model="formData.orderType"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option label="导入时间倒序" :value="1"></el-option>
              <el-option label="导入时间正序" :value="2"></el-option>
              <el-option label="当前30天销量倒序" :value="5"></el-option>
              <el-option label="当前15天销量倒序" :value="4"></el-option>
              <el-option label="当前7天销量倒序" :value="3"></el-option>
              <el-option label="商品创建时间倒序" :value="6"></el-option>
              <el-option label="商品创建时间正序" :value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <el-button @click="handleReset()">清空</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <!-- 数据筛选 end -->
    <!-- 滞销品清仓 tabs table start -->
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
          :name="item.label"
        >
          <!-- 待装箱状态复选框 start -->
          <el-checkbox-group
            v-if="activeKey === '打折清仓'"
            v-model="discount"
            class="checkbox_margin"
            @change="changeStatus"
          >
            <el-checkbox
              v-for="cItem in checkboxList"
              :key="cItem.label"
              :label="cItem.status"
              >{{ cItem.label }}</el-checkbox
            >
          </el-checkbox-group>
          <!-- 待装箱状态复选框 end -->

          <!-- 列表数据 start -->
          <vxe-table
            ref="unsoldTable"
            :data="unsoldList"
            :height="height"
            keep-source
            :show-overflow="true"
            :scroll-y="{ gt: 10 }"
            border
            :checkbox-config="{ checkField: 'checked', trigger: 'row' }"
          >
            <vxe-column type="checkbox" width="50"></vxe-column>
            <vxe-column title="图片" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.image || ''" />
              </template>
            </vxe-column>
            <vxe-column title="商品SKU" width="130">
              <template #default="{ row }">
                <div>{{ row.prodSSku }}</div>
                <div>父：{{ row.psku }}</div>
                <div style="margin-bottom: 5px">
                  <el-tag v-if="row.ifPurchaseReturn === '是'" size="small"
                    >符合采购退件</el-tag
                  >
                </div>
                <div>
                  <el-tag v-if="row.ifHighValueProd === '是'" size="small"
                    >高价值商品</el-tag
                  >
                </div>
              </template>
            </vxe-column>
            <vxe-column title="责任人" min-width="80">
              <template #default="{ row }">
                <div>
                  <div>开发：{{ row.bizzOwner }}</div>
                  <div>采购：{{ row.buyer }}</div>
                  <div>责任：{{ row.responsor }}</div>
                  <div>跟单：{{ row.followOrderUserName }}</div>
                </div>
              </template>
            </vxe-column>
            <vxe-column title="商品名称" width="200">
              <template #default="{ row }">
                <div>{{ row.title }}</div>
                <div>采购成本(￥)：{{ row.purchaseCostPrice }}</div>
                <div
                  v-for="(cItem, cIndex) in row.prodSupplierList"
                  :key="cIndex"
                >
                  <a :href="cItem.purchaseUrl" target="_blank">{{
                    cItem.supplierName
                  }}</a>
                </div>
              </template>
            </vxe-column>
            <vxe-column
              v-if="activeKey !== '待审核'"
              title="打折成本(￥)"
              width="100"
              field="discountPrice"
            >
            </vxe-column>
            <vxe-column min-width="120">
              <template #header>
                <span
                  >滞销时库存信息<br />
                  <el-tooltip
                    :content="`数量 ${totalUnsoldNum} || 金额${totalMoney}`"
                    placement="right"
                  >
                    数量{{ totalUnsoldNum }} || 金额{{ totalMoney }}
                  </el-tooltip>
                </span>
              </template>
              <template #default="{ row }">
                <div>
                  <div>仓库：{{ row.warehouseName }}</div>
                  <div>库位：{{ row.locationCode }}</div>
                  <div>可用：{{ row.slowSoldAvailableStock }}</div>
                  <div>平均成本(￥)：{{ row.slowSoldAveCost }}</div>
                  <div>库存金额(￥)：{{ row.slowSoldStockAmont }}</div>
                </div>
              </template>
            </vxe-column>
            <vxe-column title="滞销时销量" width="100">
              <template #default="{ row }">
                <div>
                  <div>7天：{{ row.slowSold7Sales }}</div>
                  <div>15天：{{ row.slowSold15Sales }}</div>
                  <div>30天：{{ row.slowSold30Sales }}</div>
                </div>
              </template>
            </vxe-column>
            <vxe-column title="当前库存数量" min-width="80">
              <template #default="{ row }">
                <div>
                  <div>真实：{{ row.currentStock }}</div>
                  <div>占用：{{ row.reservationStock }}</div>
                  <div>可用：{{ row.avaStock }}</div>
                </div>
              </template>
            </vxe-column>
            <vxe-column title="当前销量" min-width="80">
              <template #default="{ row }">
                <div>
                  <div>7天：{{ row.sevenSalesNum }}</div>
                  <div>15天：{{ row.fifteenSalesNum }}</div>
                  <div>30天：{{ row.thirtySalesNum }}</div>
                </div>
              </template>
            </vxe-column>
            <template v-if="activeKey !== '待审核'">
              <vxe-column title="采购处理结果" min-width="80">
                <template #default="{ row }">
                  <div>{{ row.purchaseDealStatus }}</div>
                </template>
              </vxe-column>
              <vxe-column title="其他出库单" width="120">
                <template #default="{ row }">
                  <div style="white-space: break-spaces">
                    {{ row.outboundOrderNo }}
                  </div>
                  <div
                    v-if="row.outboundOrderNo"
                    style="white-space: break-spaces"
                  >
                    <span>状态：{{ row.outboundOrderNoStatus }}</span
                    ><br />
                    <span>数量：{{ row.outNum }}</span>
                  </div>
                </template>
              </vxe-column>
              <vxe-column
                v-if="activeKey === '已清仓'"
                title="清仓方式"
                min-width="80"
              >
                <template #default="{ row }">
                  <div>{{ row.cleanStockWay || '' }}</div>
                </template>
              </vxe-column>
            </template>

            <vxe-column title="时间" width="220">
              <template #default="{ row }">
                <div>
                  <span
                    >导入：{{
                      parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                    }}</span
                  >
                </div>
                <div v-if="row.prodCreateTime">
                  <span
                    >开发：{{
                      parseTime(row.prodCreateTime, '{y}-{m}-{d} {h}:{i}')
                    }}</span
                  >
                </div>
                <div v-if="row.firstDiscountTime">
                  <span
                    >1st打折：{{
                      parseTime(row.firstDiscountTime, '{y}-{m}-{d} {h}:{i}')
                    }}</span
                  >
                </div>
                <div v-if="row.secondDiscountTime">
                  <span
                    >2st打折：{{
                      parseTime(row.secondDiscountTime, '{y}-{m}-{d} {h}:{i}')
                    }}</span
                  >
                </div>
                <div v-if="row.waitPackageTime">
                  <span
                    >待打包：{{
                      parseTime(row.waitPackageTime, '{y}-{m}-{d} {h}:{i}')
                    }}</span
                  >
                </div>
                <div v-if="row.cleanStockTime">
                  <span
                    >已清仓：{{
                      parseTime(row.cleanStockTime, '{y}-{m}-{d} {h}:{i}')
                    }}</span
                  >
                </div>
              </template>
            </vxe-column>
            <vxe-column
              v-if="activeKey === '打折清仓'"
              title="操作"
              width="110"
            >
              <template #default="{ row, rowIndex }">
                <el-button
                  v-if="row.ifPurchaseReturn === '是'"
                  v-permission="['unsoldPurchase']"
                  type="primary"
                  @click.stop="handlePurchase(row, rowIndex)"
                  >采购处理</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>

          <div class="pagination">
            <el-pagination
              v-model:currentPage="formData.page"
              v-model:page-size="formData.limit"
              background
              :page-sizes="[50, 300, 500, 2000]"
              :small="true"
              layout="total, sizes, prev, pager, next"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
          <!-- 列表数据 end -->
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn">
        <el-popconfirm
          v-if="activeKey === '待审核'"
          title="确定要删除吗？"
          @confirm="batchDeleteUnsold()"
        >
          <template #reference>
            <el-button
              v-permission="['unsoldBatchDelete']"
              type="danger"
              @click.stop
              >删除</el-button
            >
          </template>
        </el-popconfirm>
        <el-button
          v-if="activeKey === '打折清仓'"
          v-permission="['unsoldPurchase']"
          type="primary"
          @click="batchPurchase"
        >
          采购批量处理
        </el-button>
        <el-button
          type="primary"
          style="margin-right: 6px; margin-left: 6px"
          @click="handleDownLoad"
          >导入模板下载</el-button
        >
        <el-upload
          :action="'/api/lms/prodUnsoldStockCleanProcess/importProdUnsoldStock'"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :show-file-list="false"
          style="margin-right: 6px"
        >
          <el-button v-permission="['unsoldImport']" type="primary"
            >导入滞销品</el-button
          >
        </el-upload>
        <el-popconfirm
          v-if="activeKey === '待审核'"
          title="确定要审核吗？"
          @confirm="batchCheckUnsold()"
        >
          <template #reference>
            <el-button
              v-if="activeKey === '待审核'"
              v-permission="['unsoldCheck']"
              type="primary"
              style="margin-right: 6px"
              @click.stop
              >审核</el-button
            >
          </template>
        </el-popconfirm>
        <el-button
          v-if="activeKey === '打折清仓' && formData.discountCount === 1"
          v-permission="['unsoldDiscount']"
          type="primary"
          style="margin-right: 6px"
          @click="adjustDiscount"
          >调整折扣</el-button
        >
        <el-popconfirm
          title="确定要创建出库单吗？"
          @confirm="handleCreateOutboundOrder"
        >
          <template #reference>
            <el-button
              v-if="activeKey === '待打包清仓'"
              v-permission="['unsoldCreateOrder']"
              type="primary"
              style="margin-right: 6px; margin-right: 0"
              @click.stop
              >创建出库单</el-button
            >
          </template>
        </el-popconfirm>
        <el-popconfirm title="确定要清空出库单吗？" @confirm="clearboundOrder">
          <template #reference>
            <el-button
              v-if="activeKey === '待打包清仓'"
              v-permission="['unsoldClearOrder']"
              type="primary"
              style="margin-right: 6px; margin-left: 6px"
              @click.stop
              >清空出库单</el-button
            >
          </template>
        </el-popconfirm>

        <el-button
          v-permission="['unsoldExport']"
          :loading="exportLoading"
          type="primary"
          style="margin-right: 6px; margin-left: 0"
          @click="handleExport"
        >
          导出
        </el-button>
      </div>
    </el-card>
    <!-- 滞销品清仓 tabs table end -->

    <!-- 调整折扣弹窗 -->
    <el-dialog
      v-model="showAdjustDiscountDialog"
      title="调整折扣"
      width="30%"
      :close-on-click-modal="false"
      @close="handleCloseDiscount"
    >
      <div style="display: flex">
        <el-form size="default">
          <el-form-item label="新折扣" label-width="100">
            <el-select v-model="newDiscount" clearable>
              <el-option :label="0.8" :value="0.8"></el-option>
              <el-option :label="0.7" :value="0.7"></el-option>
              <el-option :label="0.6" :value="0.6"></el-option>
              <el-option :label="0.5" :value="0.5"></el-option>
              <el-option :label="0.4" :value="0.4"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span>
          <el-button type="primary" @click="adjustConfirm()">保存</el-button>
          <el-button @click="handleCloseDiscount">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 采购处理弹窗 -->
    <el-dialog
      v-model="showPurchaseDialog"
      title="采购处理"
      width="30%"
      :close-on-click-modal="false"
      @close="handleClosePurchase"
    >
      <div>
        <el-form size="default">
          <el-form-item label="处理结果" label-width="100">
            <el-radio-group v-model="purchaseForm.purchaseDealStatus">
              <el-radio value="供应商同意退件">供应商同意退件</el-radio>
              <el-radio value="供应商不同意退件">供应商不同意退件</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="!isBatch" label="出库单号" label-width="100">
            <el-input v-model="purchaseForm.outboundOrderNo" />
          </el-form-item>
        </el-form>
        <vxe-table
          v-if="purchaseForm.purchaseDealStatus === '供应商同意退件' && isBatch"
          :data="purchaseList"
        >
          <vxe-column title="图片" width="100">
            <template #default="{ row }">
              <ImagePop :src="row.image || ''" />
            </template>
          </vxe-column>
          <vxe-column title="商品SKU" width="200">
            <template #default="{ row }">
              <div>{{ row.prodSSku }}</div>
              <div>父：{{ row.psku }}</div>
              <div style="margin-bottom: 5px">
                <el-tag v-if="row.ifPurchaseReturn === '是'" size="small"
                  >符合采购退件</el-tag
                >
              </div>
              <div>
                <el-tag v-if="row.ifHighValueProd === '是'" size="small"
                  >高价值商品</el-tag
                >
              </div>
            </template>
          </vxe-column>
          <vxe-column title="其他出库单">
            <template #default="{ row }">
              <el-input v-model="row.outboundOrderNo" />
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <span>
          <el-button type="primary" @click="purchaseConfirm()">保存</el-button>
          <el-button @click="handleClosePurchase()">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showCreateDialog"
      width="40%"
      title="创建出库单结果"
      style="overflow: hidden"
      :close-on-click-modal="false"
    >
      <el-tag style="margin-bottom: 10px; margin-right: 10px"
        >成功数量({{ successCount }})</el-tag
      >
      <el-tag style="margin-bottom: 10px" type="danger"
        >失败数量({{ createList.length - successCount }})</el-tag
      >
      <div style="overflow-y: auto; max-height: 550px">
        <vxe-table :data="createList" border>
          <vxe-column title="SKU" field="sku" width="150"></vxe-column>
          <vxe-column title="结果" width="150">
            <template #default="{ row }">
              {{ row.stockOutNumber ? '创建成功' : '创建失败' }}</template
            >
          </vxe-column>
          <vxe-column title="原因" field="errorMsg"></vxe-column>
        </vxe-table>
      </div>
    </el-dialog>
  </div>
</template>
<script setup name="productprocessunsoldstockclean">
  import { onMounted, ref, reactive, computed } from 'vue';
  import { shortcuts } from '@/api/common';
  import { getCustomers } from '@/api/common/index.js';
  import {
    getOrderAllWareHouse,
    queryProdUnsoldStockCleanProcess,
    getOutboundOrderNo,
    purchaseDeal,
    purchaseDealBatch,
    auditProcess,
    deleteProcess,
    changeDiscount,
    createOutboundOrder,
    cleanOutboundOrderNo,
    queryPurchasingAgentList,
    queryFollowOrderUserList,
    querySupplierList,
    queryCleanStockWayEnum
  } from '@/api/product/process/unsoldstockclean.js';
  import ImagePop from '@/components/ImagePop/index.vue';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transBlob } from '@/utils/downloadFile';

  const skuType = ref('ssku'); // sku 类型
  const skuValue = ref(''); // sku 值
  const skuStatus = ref('');

  const roleType = ref('1'); // 人员类型
  const roleVal = ref([]); // 人员
  const timeType = ref('createTime'); // 时间类型
  const time = ref(''); // 时间
  const formData = reactive({
    page: 1,
    limit: 50,
    orgId: '',
    orderType: 1,
    timeType: '',
    createTimeStart: '',
    createTimeEnd: '',
    bizzOwnerIdList: [], // 业绩归属人开发专员
    responsorIdList: [], // 责任归属人
    pSkuLikeList: [], // 父SKU模糊
    pSkuDetailList: [], //  父SKU精确
    sSkuDetailList: [], // 子SKU精确
    sSkuLikeList: [], // 子SKU模糊
    dealStatus: '待审核', // 状态 待审核 打折清仓 待打包清仓 已清仓
    purchaseDealStatus: '', // 采购处理状态
    ifPurchaseReturnBool: '', // 符合采购退件
    ifHighValueProd: '',
    ifHighValueProdBool: '', // 是否高价值产品
    ifPurchaseReturn: '',
    discountCount: '',
    ifContainOutBoundOrderNo: '',
    outboundOrderNoList: [], // 出库单号
    warehouseId: '', // 仓库id
    buyerIdList: [], // 采购专员
    followerIdList: [], // 跟单专员
    cleanStockWay: '', // 清仓方式
    supplierId: '' // 供应商
  });

  const discount = ref([]);
  const outboundOrderNoListStr = ref('');
  // const randomKey = ref(Math.random());

  const state = reactive({
    orgIdList: [],
    userList: [],
    warehouseList: [],
    outboundOrderList: [],
    purchaseList: [],
    followList: [],
    supplierList: [],
    cleanWayList: []
  });

  const activeKey = ref('待审核');
  const tabList = ref([
    { label: '待审核', count: 0, status: 0 },
    { label: '打折清仓', count: 0, status: 1 },
    { label: '待打包清仓', count: 0, status: 2 },
    { label: '已清仓', count: 0, status: 3 }
  ]);

  const checkboxList = ref([
    { label: '第一次打折', status: 1 },
    { label: '第二次打折', status: 2 }
  ]);

  onMounted(() => {
    getPersonAndOrgsByRoleFunc();
    getWareHouseList();
    getOutboundOrderList();
    getPurchaseList();
    getFollowList();
    getCleanWayList();
  });
  // 切换 tab
  const handleClick = (tab) => {
    formData.dealStatus = tab.props.name;
    formData.page = 1;
    formData.discountCount = '';
    discount.value = [];
    handleSearch();
  };

  const unsoldTable = ref(null);
  const selectRecords = ref([]);
  // 获取复选框选中的数据
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = unsoldTable.value;
    selectRecords.value =
      $table[getTableIndex(activeKey.value)].getCheckboxRecords();

    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };

  // 获取部门
  const userListCopy = ref([]);
  const getPersonAndOrgsByRoleFunc = async () => {
    const { code, data } = await getCustomers();
    if (code === '0000') {
      state.orgIdList = data.orgTree || [];
      state.userList = data.userList || [];
      userListCopy.value = data.userList;
    }
  };

  // 获取采购专员
  const getPurchaseList = async () => {
    const { code, data } = await queryPurchasingAgentList();
    if (code === '0000') {
      state.purchaseList = data || [];
    }
  };

  // 获取跟单专员
  const getFollowList = async () => {
    const { code, data } = await queryFollowOrderUserList();
    if (code === '0000') {
      state.followList = data || [];
    }
  };

  const supplierLoading = ref(false);
  const remoteMethod = async (query) => {
    if (query) {
      supplierLoading.value = true;
      let formData = new FormData();
      formData.append('name', query);
      const data = await querySupplierList(formData);
      state.supplierList = data || [];
      supplierLoading.value = false;
    } else {
      state.supplierList = [];
    }
  };

  const getCleanWayList = async () => {
    try {
      const { code, data } = await queryCleanStockWayEnum();
      if (code === '0000') {
        let list = data?.map((item) => {
          return {
            label: item,
            value: item
          };
        });
        state.cleanWayList = list || [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOrgId = (val) => {
    roleVal.value = [];
    if (val) {
      state.userList = userListCopy.value.filter((item) => item.org_id == val);
    } else {
      state.userList = userListCopy.value;
    }
  };

  // 获取仓库枚举
  const getWareHouseList = async () => {
    try {
      const { code, data } = await getOrderAllWareHouse();
      if (code === '0000') {
        state.warehouseList = data || [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 获取出库单枚举
  const getOutboundOrderList = async () => {
    try {
      const { code, data } = await getOutboundOrderNo();
      if (code === '0000') {
        state.outboundOrderList = data || [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestParam = () => {
    let skuList = skuValue.value ? skuValue.value.split(',') : [];
    formData.sSkuDetailList = [];
    formData.sSkuLikeList = [];
    formData.pSkuDetailList = [];
    formData.pSkuLikeList = [];
    // 子sku
    if (skuType.value === 'ssku') {
      if (skuValue.value) {
        // 精确
        formData.sSkuDetailList = skuList;
      } else {
        formData.sSkuLikeList = skuList;
      }
    }
    // 父sku
    if (skuType.value == 'psku') {
      if (skuValue.value) {
        // 精确
        formData.pSkuDetailList = skuList;
      } else {
        formData.pSkuLikeList = skuList;
      }
    }
    // 人员类型
    let userId = state.userList?.map((item) => item.id);

    formData.bizzOwnerIdList = [];
    formData.responsorIdList = [];
    if (roleType.value === '1') {
      formData.bizzOwnerIdList =
        roleVal.value?.length > 0
          ? roleVal.value
          : formData.orgId
          ? userId
          : [];
    }
    if (roleType.value === '2') {
      formData.responsorIdList =
        roleVal.value?.length > 0
          ? roleVal.value
          : formData.orgId
          ? userId
          : [];
    }

    if (outboundOrderNoListStr.value) {
      formData.outboundOrderNoList =
        outboundOrderNoListStr.value?.split(',') || [];
    } else {
      formData.outboundOrderNoList = [];
    }
    formData.outboundOrderNoList = formData.outboundOrderNoList?.filter(
      (item) => item !== '有' && item !== '无'
    );
    if (time.value) {
      formData.createTimeStart = time.value[0] + ' 00:00:00';
      formData.createTimeEnd = time.value[1] + ' 23:59:59';
    } else {
      formData.createTimeStart = '';
      formData.createTimeEnd = '';
    }
    formData.ifHighValueProd = formData.ifHighValueProdBool ? '是' : '';
    formData.ifPurchaseReturn = formData.ifPurchaseReturnBool ? '是' : '';
  };

  // 查询
  const unsoldList = ref([]);
  const total = ref(0);
  const totalUnsoldNum = ref(0);
  const totalMoney = ref(0);
  const handleSearch = async () => {
    let list = skuValue.value?.split(',') || [];
    if (list?.length > 1 && skuStatus.value === false) {
      ElMessage.warning('多个SKU仅支持精确查询！');
      return;
    }
    handleRequestParam();
    try {
      let ifContainOutBoundOrderNo =
        outboundOrderNoListStr.value === '有'
          ? true
          : outboundOrderNoListStr.value === '无'
          ? false
          : '';
      const { code, data, count, extra } =
        await queryProdUnsoldStockCleanProcess({
          ...formData,
          ifContainOutBoundOrderNo
        });
      if (code === '0000') {
        total.value = count;
        totalUnsoldNum.value = extra?.allCount || 0;
        totalMoney.value = extra?.allMoney || 0;
        unsoldList.value = data || [];
        tabList.value.forEach((item) => {
          if (item.label == activeKey.value) {
            item.count = count;
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 清空出库单
  const clearOrderNo = () => {
    outboundOrderNoListStr.value = '';
    formData.outboundOrderNoList = [];
  };

  const formRef = ref(null);
  const handleReset = () => {
    formRef.value.resetFields();
    discount.value = [];
    skuValue.value = '';
    skuType.value = 'ssku';
    skuStatus.value = '';
    roleType.value = '1';
    roleVal.value = [];
    timeType.value = 'createTime';
    time.value = '';
    outboundOrderNoListStr.value = '';
    formData.ifHighValueProdBool = '';
    formData.ifHighValueProd = '';
    formData.ifPurchaseReturnBool = '';
    formData.ifPurchaseReturn = '';
    formData.purchaseDealStatus = '';
    formData.ifContainOutBoundOrderNo = '';
  };

  // 切换打折状态
  const changeStatus = (val) => {
    // 复选框值选择一个
    if (val.length > 1) {
      let single = discount.value.splice(1);
      discount.value = single;
    }
    formData.discountCount = Number(discount.value[0]);
    handleSearch();
  };

  // 分页
  const handleSizeChange = (val) => {
    formData.pageSize = val;
    formData.page = 1;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    formData.page = val;
    handleSearch();
  };

  // 下载模板
  const handleDownLoad = () => {
    window.location.href = '/api/lms/static/excel/滞销品导入.xlsx';
  };

  // 审核
  const batchCheckUnsold = async () => {
    try {
      if (getSelectedList()) {
        const { code } = await auditProcess({
          idList: selectRecords.value.map((item) => item.id)
        });
        if (code === '0000') {
          ElMessage.success('审核成功');
          handleSearch();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 删除
  const batchDeleteUnsold = async () => {
    try {
      if (getSelectedList()) {
        const { code } = await deleteProcess({
          idList: selectRecords.value.map((item) => item.id)
        });
        if (code === '0000') {
          ElMessage.success('删除成功');
          handleSearch();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 调整折扣

  // 调整折扣
  const showAdjustDiscountDialog = ref(false);
  const newDiscount = ref('');
  const adjustDiscount = () => {
    if (getSelectedList()) {
      showAdjustDiscountDialog.value = true;
    }
  };
  const adjustConfirm = async () => {
    try {
      let idList = selectRecords.value.map((item) => item.id);
      const { code } = await changeDiscount({
        idList,
        discount: newDiscount.value
      });
      if (code === '0000') {
        ElMessage.success('调整折扣成功');
        showAdjustDiscountDialog.value = false;
        handleCloseDiscount();
        // handleSearch();
        refreshTable(idList);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleCloseDiscount = () => {
    showAdjustDiscountDialog.value = false;
    newDiscount.value = '';
  };

  // 创建出库单
  const showCreateDialog = ref(false);
  const successCount = ref('');
  const createList = ref([]);
  const handleCreateOutboundOrder = async () => {
    try {
      if (getSelectedList()) {
        let idList = selectRecords.value.map((item) => item.id);
        const { code, data } = await createOutboundOrder({
          idList
        });
        if (code === '0000') {
          if (data.length > 0) {
            showCreateDialog.value = true;
            successCount.value = data?.filter(
              (item) => item.stockOutNumber
            )?.length;
            createList.value = data;
          } else {
            ElMessage.success('创建出库单成功');
          }
          refreshTable(idList);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const refreshTable = async (idList) => {
    // 刷新行
    handleRequestParam();
    const { data } = await queryProdUnsoldStockCleanProcess(formData);
    const $table = unsoldTable.value;
    let rowLists = data?.filter((item) => idList.includes(item.id));
    rowLists.forEach((item) => {
      selectRecords.value?.forEach((cItem) => {
        if (item.id == cItem.id) {
          let row = Object.assign(cItem, item);
          $table[getTableIndex(activeKey.value)].reloadRow(row);
        }
      });
    });
  };

  const getTableIndex = (tabName) => {
    let list = tabList.value.filter((item) => item.label == tabName);
    return list[0].status;
  };

  // 导出
  const exportLoading = ref(false);
  const handleExport = () => {
    exportLoading.value = true;
    const $table = unsoldTable.value;
    selectRecords.value =
      $table[getTableIndex(activeKey.value)].getCheckboxRecords();

    let params = JSON.parse(JSON.stringify(formData));
    if (selectRecords.value && selectRecords.value.length > 0) {
      params = {
        ...formData,
        idList: selectRecords.value.map((item) => item.id)
      };
    }
    transBlob({
      fileName: '滞销品清导出文件.xlsx',
      url: '/lms/prodUnsoldStockCleanProcess/exportProcess',
      data: params,
      contentType: 'application/json'
    }).then(() => {
      exportLoading.value = false;
      ElMessage.success('操作成功');
    });
  };

  // 清空出库单
  const clearboundOrder = async () => {
    try {
      if (getSelectedList()) {
        const { code } = await cleanOutboundOrderNo({
          idList: selectRecords.value.map((item) => item.id)
        });
        if (code === '0000') {
          ElMessage.success('清空出库单成功');
          handleSearch();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 采购处理
  const purchaseForm = reactive({
    id: '',
    outboundOrderNo: '', // 出库单号
    purchaseDealStatus: '' // 采购处理结果
  });
  const showPurchaseDialog = ref(false);
  const rowIndex = ref('');
  const purchaseRow = ref({});
  const purchaseList = ref([]);
  const handlePurchase = (row, index) => {
    purchaseRow.value = row;
    purchaseForm.id = row.id;
    isBatch.value = false;
    showPurchaseDialog.value = true;
    rowIndex.value = index;
  };
  const purchaseConfirm = async () => {
    try {
      if (!purchaseForm.purchaseDealStatus) {
        return ElMessage.warning('请选择采购处理结果');
      }
      if (isBatch.value) {
        let paramArr = [];
        purchaseList.value?.forEach((item) => {
          paramArr.push({
            id: item.id,
            outboundOrderNo: item.outboundOrderNo,
            purchaseDealStatus: purchaseForm.purchaseDealStatus
          });
        });
        const { code } = await purchaseDealBatch(paramArr);
        if (code === '0000') {
          ElMessage.success('采购批量处理成功');
          handleSearch();
          handleClosePurchase();
        }
      } else {
        const { code } = await purchaseDeal(purchaseForm);
        if (code === '0000') {
          ElMessage.success('采购处理成功');
          // 刷新行
          handleRequestParam();
          const { data } = await queryProdUnsoldStockCleanProcess(formData);
          const $table = unsoldTable.value;
          let row = Object.assign(purchaseRow.value, data[rowIndex.value]);
          // 刷新行
          $table[getTableIndex(activeKey.value)].reloadRow(row);
          handleClosePurchase();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClosePurchase = () => {
    showPurchaseDialog.value = false;
    purchaseForm.outboundOrderNo = '';
    purchaseForm.purchaseDealStatus = '';
  };

  const isBatch = ref(false);

  // 采购批量处理
  const batchPurchase = () => {
    isBatch.value = true;
    if (getSelectedList()) {
      purchaseList.value = JSON.parse(JSON.stringify(selectRecords.value));
      let items = selectRecords.value?.filter(
        (item) => item.ifPurchaseReturn !== '是'
      );
      let skus = items?.map((item) => item.prodSSku);
      if (skus?.length > 0) {
        let str = skus?.join(',') || '';
        ElMessage.warning(str + '不能进行采购处理');
      } else {
        showPurchaseDialog.value = true;
      }
    }
  };
  // 导入
  const uploadSuccess = (res) => {
    ElMessageBox.alert(
      `<div style="width: 400px;overflow: hidden;overflow-wrap: break-word;">${res.msg}</div>`,
      '操作结果',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确认'
      }
    ).then(() => {
      handleSearch();
    });
  };
  const uploadError = () => {
    ElMessage.error('error');
  };

  const changeOutNo = (val) => {
    if (val) {
      outboundOrderNoListStr.value = '有';
    } else if (val === false) {
      outboundOrderNoListStr.value = '无';
    } else {
      outboundOrderNoListStr.value = '';
    }
  };

  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 300;
  });
</script>
<style lang="scss" scoped>
  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
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
<style lang="scss">
  .mini_select {
    width: 30px !important;
  }
  .widthSelect {
    width: 120px;
    margin-left: -90px;
    .el-select-dropdown {
      margin-left: 0px;
    }
  }
</style>
