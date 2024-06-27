<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item
          v-if="activeKey === 2 || activeKey === 9"
          prop="time"
          label="创建时间"
        >
          <el-date-picker
            v-model="formData.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item v-if="activeKey === 4 || activeKey === 21" prop="time">
          <el-select v-model="timeType">
            <el-option value="create" label="创建时间"></el-option>
            <el-option value="deliver" label="发货时间"></el-option>
          </el-select>
          <el-date-picker
            v-model="formData.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item prop="orderByType" label="排序方式">
          <el-select v-model="formData.orderByType">
            <el-option value="1" label="创建时间正序"></el-option>
            <el-option value="2" label="创建时间倒序"></el-option>
            <el-option
              v-if="activeKey === 4 || activeKey === 21"
              value="3"
              label="发货时间正序"
            ></el-option>
            <el-option
              v-if="activeKey === 4 || activeKey === 21"
              value="4"
              label="发货时间倒序"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === 4 || activeKey === 21"
          prop="deliveryNoStr"
          label="快递单号"
        >
          <el-input
            v-model="formData.deliveryNoStr"
            placeholder="支持多个逗号分隔"
          ></el-input>
        </el-form-item>
        <el-form-item prop="replOrderNosStr" label="供货单号"
          ><el-input
            v-model="formData.replOrderNosStr"
            placeholder="多个英文逗号分隔"
            clearable
          />
        </el-form-item>
        <el-form-item prop="productIdsStr" label="货品ID"
          ><el-input v-model="formData.productIdsStr" clearable />
        </el-form-item>
        <el-form-item prop="prodSSkusStr">
          <el-select v-model="skuType" class="form_left">
            <el-option value="sSku" label="商品SKU" />
            <el-option value="sSkuDetails" label="商品SKU精确" />
          </el-select>
          <el-input
            v-model="formData.prodSSkusStr"
            class="form_right"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="getSearchData"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs v-model="activeKey" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.status"
          :label="
            item.count !== '' && activeKey == item.status
              ? `${item.name}(${item.count})`
              : item.name
          "
          :name="item.status"
        >
          <!-- :scroll-y="{ gt: 10 }" ,表格最后一条抖动，应该跟虚拟列表高度计算有关，暂时先注释 -->
          <!-- :editConfig="{
            trigger: 'dblclick',
            mode: 'cell'
          }" 【没找到哪里需要编辑，应该不需要加这个】-->
          <vxe-table
            ref="tableDataRef"
            v-loading="tableDataLoading"
            :data="tableData"
            :height="height"
            :align="'left'"
            border
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="供货单" width="100" field="replOrderNo" />
            <vxe-column :width="activeKey == 4 || activeKey === 21 ? 710 : 610">
              <template #header>
                <div style="display: flex">
                  <div style="width: 110px">图片</div>
                  <div style="width: 150px">SKU</div>
                  <div style="width: 150px">AE中文名</div>
                  <div style="width: 100px">需要发货数量</div>
                  <div v-if="activeKey === 21" style="width: 100px">
                    已发货数量
                  </div>
                  <div v-if="activeKey === 4" style="width: 100px">
                    实发数量
                  </div>
                  <div style="width: 100px">操作</div>
                </div>
              </template>
              <template #default="{ row }">
                <!-- :editConfig="{
            trigger: 'dblclick',
            mode: 'cell'
          }" 【没找到哪里需要编辑，应该不需要加这个】-->
                <vxe-table
                  v-if="row.sInfo && row.sInfo.length != 0"
                  :data="row.sInfo ? row.sInfo.slice(0, row.displayCount) : []"
                  :show-header="false"
                >
                  <vxe-column title="图片" width="100">
                    <template #default="{ row }">
                      <div v-if="row.labelName">
                        <el-tag
                          v-for="item in row.labelName.split(',')"
                          :key="item"
                          type="warning"
                          size="small"
                          >{{ item }}</el-tag
                        >
                      </div>
                      <ImagePop :src="row.sImg || ''" />
                    </template>
                  </vxe-column>
                  <vxe-column width="150">
                    <template #default="{ row }">
                      <div>货品ID: {{ row.productId }}</div>
                      <div>商品SKU: {{ row.prodSSku }}</div>
                    </template>
                  </vxe-column>
                  <vxe-column field="productNameCn" width="150" />
                  <vxe-column field="actualReplNumber" width="100" />
                  <vxe-column
                    v-if="activeKey === 21"
                    field="actStockNum"
                    width="100"
                  />
                  <vxe-column
                    v-if="activeKey === 4"
                    field="actStockNum"
                    width="100"
                  />
                  <vxe-column
                    ><template #default="{ row }">
                      <el-button type="primary" @click="handlePrint(row)"
                        >打印</el-button
                      >
                    </template>
                  </vxe-column>
                </vxe-table>
                <div
                  v-if="row.sInfo && row.sInfo.length != 0"
                  :class="[row.sInfo.length <= 3 ? 'hideBtn' : '']"
                  style="text-align: center"
                  @click="
                    row.displayCount > 3 ? hideList(row) : viewAll(row, 'sinfo')
                  "
                >
                  <a style="color: #409eff; cursor: pointer">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >
            <vxe-column title="入库仓库">
              <template #default="{ row }">
                仓库名： {{ row.storeName }} <br />
                仓库编码： {{ row.storeCdoe }}
              </template>
            </vxe-column>
            <vxe-column title="收货地址" field="storeAddr"></vxe-column>

            <template v-if="activeKey === 2">
              <vxe-column title="备注" field="remark"></vxe-column>
              <vxe-column title="时间">
                <template #default="{ row }">
                  创建：
                  {{ row.createTime ? parseTime(row.createTime) : '' }}
                  <br />
                  发货：
                  {{ row.deliverTime ? parseTime(row.deliverTime) : '' }}
                </template>
              </vxe-column>
              <vxe-column title="操作">
                <template #default="{ row }">
                  <el-button
                    v-permission="['warehousedeliverDeliverBtn']"
                    type="primary"
                    @click="handleDeliver(row)"
                    >发货</el-button
                  >
                  <el-popconfirm
                    title="确定要取消吗？"
                    @confirm="handleCancel(row)"
                  >
                    <template #reference>
                      <el-button
                        v-permission="['warehousedeliverCancelBtn']"
                        type="primary"
                        >取消</el-button
                      >
                    </template>
                  </el-popconfirm>
                </template>
              </vxe-column>
            </template>

            <!-- <template v-if="activeKey == 4"> -->
            <vxe-column
              v-if="activeKey == 4 || activeKey == 21"
              :width="activeKey == 4 ? 700 : 600"
            >
              <template #header>
                <div v-if="activeKey == 4" style="display: flex">
                  <div style="width: 100px">装箱</div>
                  <div style="width: 150px">物流</div>
                  <div style="width: 150px">时间</div>
                  <div style="width: 100px">人员</div>
                  <div style="width: 100px">备注</div>
                  <div>操作</div>
                </div>
                <div v-if="activeKey == 21" style="display: flex">
                  <div style="width: 100px">箱数</div>
                  <div style="width: 100px">重量（kg）</div>
                  <div style="width: 150px">快递单号</div>
                  <div style="width: 100px">快递费用￥</div>
                  <div>操作</div>
                </div>
              </template>

              <template #default="{ row }">
                <div v-if="activeKey == 4">
                  <!-- :editConfig="{
            trigger: 'dblclick',
            mode: 'cell'
          }" 【没找到哪里需要编辑，应该不需要加这个】-->
                  <vxe-table
                    v-if="row.expressList && row.expressList.length != 0"
                    :data="
                      row.expressList
                        ? row.expressList.slice(0, row.displayCount)
                        : []
                    "
                    :show-header="false"
                  >
                    <vxe-column title="装箱" width="100">
                      <template #default="{ row }">
                        箱数： {{ row.boxNum }} <br />
                        重量(kg)： {{ row.weight }}
                      </template>
                    </vxe-column>
                    <vxe-column title="物流" width="150">
                      <template #default="{ row }">
                        公司： {{ row.expressCompany }} <br />
                        单号： {{ row.expressNo }} <br />
                        费用： ￥{{ row.expressCost }}
                      </template>
                    </vxe-column>
                    <vxe-column title="时间" width="150">
                      <template #default="{ row }">
                        创建：
                        {{ row.createTime ? parseTime(row.createTime) : '' }}
                        <br />
                        发货：
                        {{ row.deliverTime ? parseTime(row.deliverTime) : '' }}
                      </template>
                    </vxe-column>
                    <vxe-column title="人员">
                      <template #default="{ row }">
                        发货： {{ row.deliver }} <br />
                      </template>
                    </vxe-column>
                    <vxe-column title="备注" field="remark"></vxe-column>
                    <vxe-column>
                      <template #default="{ row }">
                        <el-button type="primary" @click="editLogistics(row)"
                          >修改物流</el-button
                        >
                      </template>
                    </vxe-column>
                  </vxe-table>
                  <div
                    v-if="row.expressList && row.expressList.length != 0"
                    :class="[row.expressList.length <= 3 ? 'hideBtn' : '']"
                    style="text-align: center"
                    @click="
                      row.displayCount > 3
                        ? hideList(row)
                        : viewAll(row, 'delivered')
                    "
                  >
                    <a style="color: #409eff; cursor: pointer">{{
                      row.displayCount > 3 ? '收起' : '展开所有'
                    }}</a>
                  </div>
                </div>
                <div v-if="activeKey == 21">
                  <!-- :editConfig="{
            trigger: 'dblclick',
            mode: 'cell'
          }" 【没找到哪里需要编辑，应该不需要加这个】-->
                  <vxe-table
                    v-if="row.expressList && row.expressList.length != 0"
                    :data="
                      row.expressList
                        ? row.expressList.slice(0, row.displayCount)
                        : []
                    "
                    :show-header="false"
                  >
                    <vxe-column field="boxNum" width="100"></vxe-column>
                    <vxe-column field="weight" width="100" />
                    <vxe-column width="150">
                      <template #default="{ row }">
                        {{ row.expressCompany }}<br />
                        {{ row.expressNo }}
                      </template>
                    </vxe-column>
                    <vxe-column field="expressCost" width="100" />
                    <vxe-column>
                      <template #default="{ row }">
                        <el-button type="primary" @click="editLogistics(row)"
                          >修改物流</el-button
                        >
                      </template>
                    </vxe-column>
                  </vxe-table>
                  <div
                    v-if="row.expressList && row.expressList.length != 0"
                    :class="[row.expressList.length <= 3 ? 'hideBtn' : '']"
                    style="text-align: center"
                    @click="
                      row.displayCount > 3
                        ? hideList(row)
                        : viewAll(row, 'express')
                    "
                  >
                    <a style="color: #409eff; cursor: pointer">{{
                      row.displayCount > 3 ? '收起' : '展开所有'
                    }}</a>
                  </div>
                </div>
              </template></vxe-column
            >
            <!-- </template> -->

            <template v-if="activeKey == 9">
              <vxe-column title="备注" field="remark"></vxe-column>
              <vxe-column title="时间">
                <template #default="{ row }">
                  创建：
                  {{ row.createTime ? parseTime(row.createTime) : '' }}
                  <br />
                  发货：
                  {{ row.deliverTime ? parseTime(row.deliverTime) : '' }}
                </template>
              </vxe-column>
            </template>
            <vxe-column v-if="activeKey == 21" title="操作">
              <template #default="{ row }">
                <el-button
                  v-permission="['warehousedeliverDeliverBtn']"
                  type="primary"
                  @click="handleDeliver(row)"
                  >发货</el-button
                >
                <el-popconfirm
                  title="确定剩余不发吗？"
                  @confirm="handleNotDeliver(row)"
                >
                  <template #reference>
                    <el-button type="primary">剩余不发</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </vxe-column>
            <!-- </template> -->
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="currentPage"
              v-model:page-size="pageSize"
              background
              :page-sizes="[50, 100, 200]"
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
        <el-button type="primary" @click="handleExport">下载运费模板</el-button>
        <el-upload
          :action="'/api/lms/whaeReplOrder/importAETemplate'"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :show-file-list="false"
          style="margin-left: 10px"
        >
          <el-button v-permission="['warehousedeliverImportBtn']" type="primary"
            >导入运费</el-button
          >
        </el-upload>
      </div>
    </el-card>

    <!-- 打印弹窗 -->
    <el-dialog
      v-model="showPrint"
      title="打印"
      width="40%"
      :close-on-click-modal="false"
      @close="closePrint"
    >
      <el-form class="packup" :inline="true" size="default" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-form-item class="input_width" label="商品SKU">
                <el-input v-model="printForm.prodSSku" disabled></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item class="input_width" label="货品ID">
                <el-input v-model="printForm.productId" disabled></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item class="input_width" label="AE中文名">
                <el-input v-model="printForm.productNameCn" disabled></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item class="input_width" label="需要发货数量">
                <el-input
                  v-model="printForm.platReplNumber"
                  disabled
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item class="input_width" label="打印数量">
                <div style="display: flex">
                  <el-input
                    v-model="printForm.printNumber"
                    type="number"
                  ></el-input>
                  <el-button
                    type="primary"
                    style="margin-left: 10px"
                    @click="savePrint"
                    >打印</el-button
                  >
                </div>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <div class="img_info">
              <el-image :src="printForm.sImg"></el-image>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="closePrint">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发货弹窗 -->
    <el-dialog
      v-model="showDeliver"
      :title="showSInfo ? '发货' : '修改物流'"
      width="40%"
      :close-on-click-modal="false"
      @close="closeDeliver"
    >
      <el-form :inline="true" size="default" label-width="120px">
        <el-row>
          <el-form-item class="input_width" label="供货单">
            <el-input v-model="deliverForm.replOrderNo" disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="input_width" label="收件地址">
            <el-input v-model="deliverForm.storeAddr" disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="input_width" label="物流公司" required>
            <el-select
              v-model="deliverForm.expressCompany"
              style="width: 190px"
            >
              <el-option value="壹米滴答" label="壹米滴答"></el-option>
              <el-option value="圆通" label="圆通"></el-option>
              <el-option value="中通" label="中通"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="input_width" label="快递单号" required>
            <el-input v-model="deliverForm.expressNo"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="input_width" label="称重(kg)">
            <el-input v-model="deliverForm.weight"></el-input>
          </el-form-item>
          <el-form-item class="input_width" label="件数">
            <el-input v-model="deliverForm.boxNum"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="input_width" label="运费(￥)">
            <el-input v-model="deliverForm.expressCost"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <vxe-table
        v-if="showSInfo"
        :data="deliverForm.sInfo"
        :edit-config="{
          trigger: 'click',
          mode: 'cell'
        }"
        border
      >
        <vxe-column title="图片" field="sImg">
          <template #default="{ row }">
            <el-image :src="row.sImg"></el-image>
          </template>
        </vxe-column>
        <vxe-column title="货品ID" field="productId"></vxe-column>
        <vxe-column title="商品SKU" field="prodSSku"></vxe-column>
        <vxe-column title="AE中文名" field="productNameCn"></vxe-column>
        <vxe-column title="需要发货数量" field="actualReplNumber"></vxe-column>
        <vxe-column title="已发货数量" field="actStockNum"></vxe-column>
        <vxe-column
          title="实发数量"
          field="batchDeliverNum"
          :edit-render="{ name: 'input' }"
          :slots="{ edit: 'edit' }"
        >
          <template #edit="{ row }">
            <el-input v-model="row.batchDeliverNum"></el-input>
          </template>
        </vxe-column>
      </vxe-table>

      <template #footer>
        <span>
          <el-popconfirm
            v-if="showSInfo"
            title="发货后会立即扣减仓库库存，确认发货数量正确"
            @confirm="saveDeliverAndExpress"
          >
            <template #reference>
              <el-button type="primary">发货</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="!showSInfo"
            type="primary"
            @click="saveDeliverAndExpress()"
            >修改物流</el-button
          >
          <el-button @click="closeDeliver">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="multiplatformaesupportwarehousedeliver">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { ref, reactive, onMounted, computed } from 'vue';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElLoading, ElMessageBox } from 'element-plus';
  import { shortcuts } from '@/api/common';
  import {
    queryList,
    cancelOrder,
    deliverOrder,
    notDeliverOrder,
    printCode,
    queryExpress,
    editExpress
  } from '@/api/multiplatform/warehousedeliver';
  import axios from 'axios';
  import qs from 'qs';
  import { epeanPrint_plugin_fun } from '@/utils/print';

  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);

  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    getSearchData();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    getSearchData();
  };

  let tabList = ref([
    { name: '待发货', status: 2, count: 0 },
    { name: '部分发货', status: 21, count: 0 },
    { name: '已发货', status: 4, count: 0 },
    { name: '已取消', status: 9, count: 0 }
  ]);
  const activeKey = ref(2);

  // const start = new Date();
  // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

  const skuType = ref('sSku');
  const timeType = ref('deliver');
  const formData = reactive({
    time: [], //  时间
    createStartTime: '',
    createEndTime: '',
    deliveryStartTime: '',
    deliveryEndTime: '',
    orderByType: '1',
    deliveryNoStr: '',
    deliveryNoList: '',
    replOrderNos: [], // 供货单号
    replOrderNosStr: '',
    productIds: [], // 货品Ids
    productIdsStr: '',
    prodSSkus: [], // 商品sku
    prodSSkuDetails: [], // 商品SKU精确
    prodSSkusStr: '',
    remark: '',
    replOrderStatus: 2 // 供货状态
  });

  const tableData = ref([]);
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref();
  // 查询条件提交查询
  const getSearchData = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    formData.page = currentPage.value;
    formData.limit = pageSize.value;
    formData.createStartTime = formData.createEndTime = '';
    formData.deliveryStartTime = formData.deliveryEndTime = '';

    if (formData.time && formData.time.length != 0) {
      if (formData.time[0].length > 10 && formData.time[1].length > 10) {
        formData.time[0] = formData.time[0].split(' ')[0];
        formData.time[1] = formData.time[1].split(' ')[0];
      }
      if (
        (formData.replOrderStatus === 4 || formData.replOrderStatus === 21) &&
        timeType.value === 'deliver'
      ) {
        formData.deliveryStartTime = formData.time[0] + ' 00:00:00';
        formData.deliveryEndTime = formData.time[1] + ' 23:59:59';
      } else {
        formData.createStartTime = formData.time[0] + ' 00:00:00';
        formData.createEndTime = formData.time[1] + ' 23:59:59';
      }
    }

    formData.replOrderNos =
      formData.replOrderNosStr == '' ? [] : formData.replOrderNosStr.split(',');
    formData.productIds =
      formData.productIdsStr == '' ? [] : formData.productIdsStr.split(',');
    formData.deliveryNoList =
      formData.deliveryNoStr == '' ? [] : formData.deliveryNoStr.split(',');
    if (skuType.value === 'sSku') {
      formData.prodSSkus =
        formData.prodSSkusStr == '' ? [] : formData.prodSSkusStr.split(',');
      formData.prodSSkuDetails = [];
    }
    if (skuType.value === 'sSkuDetails') {
      formData.prodSSkuDetails =
        formData.prodSSkusStr == '' ? [] : formData.prodSSkusStr.split(',');
      formData.prodSSkus = [];
    }

    try {
      const { code, data, count } = await queryList(formData);
      if (code === '0000') {
        tableData.value = data || [];
        tabList.value.forEach((item) => {
          item.count = 0;
          if (item.status == tableData.value[0]?.replOrderStatus) {
            item.count = count;
          }
        });
        total.value = count;
        tableData.value =
          data &&
          data.map((item) => {
            item.displayCount = 3;
            return item;
          });
      }
      tableDataLoading.value = false;
    } catch (err) {
      console.log(err);
      tableDataLoading.value = false;
    }
  };

  // 查看全部时，将所有都给到
  const viewAll = (row, type = '') => {
    if (type === 'delivered' || type === 'express') {
      row.displayCount = row.expressList.length;
    }
    if (type === 'sinfo') {
      row.displayCount = row.sInfo.length;
    }
  };
  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };

  const handleClick = (tab) => {
    formData.page = 1;
    formData.replOrderStatus = tab.props.name;
    if (formData.replOrderStatus === 2 || formData.replOrderStatus === 9) {
      formData.orderByType = '1';
    }
    getSearchData();
  };

  onMounted(async () => {
    // formData.time = [parseTime(start), parseTime(new Date())];
  });

  // 情空时间
  const changeTime = (val) => {
    if (!val) {
      formData.time = [];
      formData.createTimeBegin = '';
      formData.createTimeEnd = '';
    }
  };

  let tableDataRef = ref();

  const showPrint = ref(false);
  const printForm = reactive({
    sImg: '',
    productId: '',
    printNumber: '',
    prodUnit: '',
    prodName: '',
    weight: '',
    develop: '',
    prodSSku: '',
    prodStyle: '',
    prodPSku: '',
    inPackType: '',
    printerName: '10040'
  });
  // 打印
  const handlePrint = (row) => {
    showPrint.value = true;
    Object.keys(row).forEach((item) => {
      printForm[item] = row[item];
    });
    printForm.printNumber = row.platReplNumber;
  };

  const savePrint = async () => {
    // 打印货品条码
    handlePrintCode();
    // 调用第一次打印接口
    let printFormCopy = Object.assign({}, printForm);
    printFormCopy.printNumber = 1; // 默认第一次打印的数量是 1
    let obj = {
      titleMap: {
        ...printFormCopy
      }
    };
    let params = {
      printerName: 6030,
      jspaper: 'skuLabelForAe.jasper',
      printDetailDtoList: [obj]
    };
    epeanPrint_plugin_fun(99, params);
  };

  const pdfPrint = ref('');
  const handlePrintCode = async () => {
    let params = {
      productId: printForm.productId
    };
    try {
      const { code, msg } = await printCode(params);
      if (code === '0000') {
        pdfPrint.value = msg;

        let obj = {
          printType: 100,
          width: 60,
          height: 30,
          url: pdfPrint.value,
          amount: printForm.printNumber
        };
        printCase(obj);
      }
    } catch (err) {
      console.log(err);
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

  const closePrint = () => {
    showPrint.value = false;
  };

  const showDeliver = ref(false);
  const showSInfo = ref(true);
  const deliverForm = reactive({
    id: '',
    orderId: '',
    modifyTime: '',
    replOrderNo: '',
    storeAddr: '',
    expressNo: '',
    expressCompany: '',
    weight: '',
    boxNum: '',
    expressCost: '',
    sInfo: []
  });
  // 发货
  const handleDeliver = async (row) => {
    try {
      showDeliver.value = true;
      showSInfo.value = true;
      const { code, data } = await queryList({ id: row.id });
      if (code === '0000') {
        let res = data[0] || [];
        deliverForm.replOrderNo = res.replOrderNo;
        deliverForm.storeAddr = res.storeAddr;
        deliverForm.sInfo = res.sInfo;
        deliverForm.orderId = res.id;
        deliverForm.modifyTime = res.modifyTime;
        deliverForm.expressCompany = '';
        deliverForm.expressNo = '';
        deliverForm.weight = '';
        deliverForm.boxNum = '';
        deliverForm.expressCost = '';

        // 实发数量默认 = 需要发货 - 已发货数量
        deliverForm.sInfo.forEach((item) => {
          item.batchDeliverNum = item.actualReplNumber - item.actStockNum;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 修改物流
  const editLogistics = async (row) => {
    showDeliver.value = true;
    showSInfo.value = false;
    const { code, data } = await queryExpress({ id: row.id });
    if (code === '0000') {
      let {
        id,
        replOrderNo,
        storeAddr,
        expressCompany,
        expressNo,
        boxNum,
        weight,
        expressCost
      } = data;
      deliverForm.replOrderNo = replOrderNo;
      deliverForm.storeAddr = storeAddr;
      deliverForm.sInfo = [];
      deliverForm.orderId = '';
      deliverForm.id = id;
      deliverForm.expressCompany = expressCompany;
      deliverForm.expressNo = expressNo;
      deliverForm.weight = weight;
      deliverForm.boxNum = boxNum;
      deliverForm.expressCost = expressCost;
    }
  };

  // 剩余不发
  const handleNotDeliver = async (row) => {
    try {
      const { code } = await notDeliverOrder({ id: row.id });
      if (code === '0000') {
        ElMessage.success('操作成功！');
        getSearchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 发货 修改物流
  const saveDeliverAndExpress = async () => {
    // 物流公司必填
    if (!deliverForm.expressCompany) {
      return ElMessage.warning('请选择物流公司！');
    }
    // 快递单号必填
    if (!deliverForm.expressNo) {
      return ElMessage.warning('请填写快递单号！');
    }
    // 验证实发数量必填
    let isRequired =
      deliverForm.sInfo &&
      deliverForm.sInfo.every((item) => {
        return item.batchDeliverNum !== undefined;
      });
    if (!isRequired) {
      return ElMessage.warning('请填写实发数量！');
    }
    deliverForm.weight =
      deliverForm.weight === ''
        ? (deliverForm.weight = 0)
        : Number(deliverForm.weight);
    deliverForm.boxNum =
      deliverForm.boxNum === ''
        ? (deliverForm.boxNum = 0)
        : Number(deliverForm.boxNum);
    deliverForm.expressCost =
      deliverForm.expressCost === ''
        ? (deliverForm.expressCost = 0)
        : Number(deliverForm.expressCost);
    try {
      const { code } = showSInfo.value
        ? await deliverOrder(deliverForm)
        : await editExpress(deliverForm);
      if (code === '0000') {
        let msg = showSInfo.value ? '发货成功！' : '修改物流成功！';
        ElMessage.success(msg || '操作成功！');
        getSearchData();
        showDeliver.value = false;
      }
    } catch (err) {
      console.log(err);
    }
  };
  const closeDeliver = () => {
    showDeliver.value = false;
  };

  // 导入运费
  const uploadSuccess = (res) => {
    if (res.code === '0000') {
      console.log(res.data?.success);
      if (res.data?.success) {
        ElMessage.success(res.data?.msg || '导入成功！');
      } else {
        ElMessageBox.alert(
          `<p style="word-break: normal;word-wrap: break-word;">
            ${res.data?.msg}</p>`,
          '操作结果',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '取消'
          }
        );
      }
    } else {
      ElMessage.error('导入运费失败！');
    }
  };
  const uploadError = () => {
    ElMessage.error('导入运费失败！');
  };

  // 取消
  const handleCancel = async (row) => {
    try {
      tableDataLoading.value = true;
      const { code } = await cancelOrder({ id: row.id });
      if (code === '0000') {
        ElMessage.success('取消成功！');
        getSearchData();
      }
      tableDataLoading.value = false;
    } catch (err) {
      console.log(err);
      tableDataLoading.value = false;
    }
  };

  // 下载运费模板
  const handleExport = async () => {
    const elink = document.createElement('a'); // 建一个a标签
    elink.style.display = 'none'; // 设置标签style属性
    elink.href =
      window.location.origin + '/api/lms/whaeReplOrder/downAETemplate.html'; // 设置标签href
    document.body.appendChild(elink); // 页面中添加这个标签
    elink.click(); // 点击这个标签
    URL.revokeObjectURL(elink.href);
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 210;
  });
</script>
<style scoped lang="scss">
  .mt-10 {
    margin-top: 10px;
  }
  // 查询条件--侵权状态框
  :deep(.tortPlatMer) {
    width: 200px !important;
    .el-input.el-input--small {
      width: 200px;
    }
  }
  // 查询条件--所有平台不侵权--展示完整
  :deep(.el-select__tags-text) {
    max-width: 120px !important;
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

  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }
  .img_info {
    width: 150px;
    height: 150px;
    margin-top: 15px;
    margin-left: 30px;
  }
</style>
