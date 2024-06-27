<template>
  <div class="combination">
    <!-- 数据筛选 start -->
    <el-card class="common_split_bottom search_card">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-form-item prop="time" label="创建时间">
          <el-date-picker
            v-model="formData.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
          />
        </el-form-item>
        <el-form-item prop="storeId" label="仓库">
          <el-select v-model="formData.storeId" clearable>
            <el-option
              v-for="item in warehouseList"
              :key="item.name"
              :label="item.value"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="idStr" label="生产单号">
          <el-input
            v-model="formData.idStr"
            clearable
            placeholder="多个使用逗号隔开"
          ></el-input>
        </el-form-item>
        <el-form-item prop="prodSSkuStr" label="组合品sku">
          <el-input
            v-model="formData.prodSSkuStr"
            placeholder="多个使用逗号隔开"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="combDetailSSkuStr" label="单品sku">
          <el-input
            v-model="formData.combDetailSSkuStr"
            placeholder="多个使用逗号隔开"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="creator" label="创建人">
          <el-input
            v-model="formData.creator"
            placeholder="请输入创建人"
            clearable
          ></el-input>
        </el-form-item>
        <br v-if="[1, 8, 2, 3, 4].includes(Number(activeKey))" />
        <el-form-item
          v-if="[1, 8, 2, 3, 4].includes(Number(activeKey))"
          prop="batchNo"
          label="批次号"
          class="batch_input"
        >
          <el-select v-model="formData.batchNo" clearable filterable>
            <el-option
              v-for="item in batchNoList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="[1, 8, 2, 3, 4].includes(Number(activeKey))">
          <el-button
            v-permission="['printBatchNoBtn']"
            type="primary"
            @click="handlePrintBatch()"
            >打印批次篮号</el-button
          >
        </el-form-item>
        <el-form-item
          v-if="[1, 8, 2, 3, 4].includes(Number(activeKey))"
          prop="frameNo"
          label="篮号"
        >
          <el-input v-model="formData.frameNo" clearable></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="isSale" label="在售状态">
          <el-select v-model="formData.isSale" clearable>
            <el-option label="在售" value="true"></el-option>
            <el-option label="非在售" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="orderByType" label="排序方式">
          <el-select v-model="formData.orderByType">
            <el-option
              v-for="v in orderByTypeEnum"
              :key="v.value"
              :label="v.label"
              :value="v.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()">查询</el-button>
          <el-button type="primary" @click="whExportExcelHandle()"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据筛选 end -->
    <!-- 组合品生产 tabs table start -->
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
          <!-- 组合品生产列表数据 start -->
          <vxe-table
            ref="orderTable"
            v-loading="loading"
            :data="combProductList"
            :height="height"
            :scroll-y="{ gt: 10 }"
            border
          >
            <vxe-column type="checkbox" width="45" />
            <vxe-column title="生产单号" field="produceNo" align="center">
              <template #default="{ row }">
                <div v-if="row.source == 0">{{ row.produceNo }}</div>
                <div v-else-if="row.source == 1">
                  {{ row.produceNo }}
                  <el-tooltip
                    :content="'由' + row.sourceProduceNo + '拆出'"
                    effect="dark"
                    placement="right"
                  >
                    <el-tag type="warning" effect="dark">拆</el-tag>
                  </el-tooltip>
                </div>
                <div v-else-if="row.source == 2">
                  {{ row.produceNo }}
                  <el-tooltip
                    :content="'拆出订单' + row.sourceProduceNo"
                    effect="dark"
                    placement="right"
                  >
                    <el-tag type="warning" effect="dark">拆</el-tag>
                  </el-tooltip>
                </div>
              </template>
            </vxe-column>
            <vxe-column title="商品SKU" field="prodSSku" align="center">
              <template #default="{ row }">
                <div>{{ row.prodSSku }}</div>
                <div v-if="row.isSale === false" class="tag_sku">停</div>
              </template>
            </vxe-column>
            <vxe-column
              title="仓库"
              field="storeName"
              align="center"
            ></vxe-column>
            <vxe-column
              title="创建人"
              field="creator"
              align="center"
            ></vxe-column>
            <vxe-column title="创建时间" align="center">
              <template #default="{ row }">
                {{ transferDate(row.createTime) }}
              </template>
            </vxe-column>
            <vxe-column
              title="需要生产数量"
              field="planQty"
              align="center"
            ></vxe-column>
            <vxe-column
              title="包装规格"
              align="center"
              field="packSpec"
            ></vxe-column>

            <vxe-column
              :width="activeKey !== '0' && activeKey !== '9' ? 680 : 560"
            >
              <template #header>
                <div>
                  <div style="margin-bottom: 5px; text-align: center">
                    组合品明细
                  </div>
                  <div style="display: flex">
                    <div style="width: 80px; text-align: center">图片</div>
                    <div style="width: 120px; text-align: center">
                      基础商品sku
                    </div>
                    <div style="width: 60px; text-align: center">单位</div>
                    <div style="width: 60px; text-align: center">组合数量</div>
                    <div style="width: 120px; text-align: center">
                      基础商品库位
                    </div>
                    <div
                      v-if="activeKey === '0'"
                      style="width: 100px; text-align: center"
                    >
                      商品可用数量
                    </div>
                    <div
                      v-if="activeKey !== '0' && activeKey !== '9'"
                      style="width: 140px; text-align: center"
                    >
                      操作
                    </div>
                  </div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  :data="
                    row.detailDtoList &&
                    row.detailDtoList.slice(0, row.displayCount)
                  "
                  :show-header="false"
                >
                  <vxe-column v-slot="{ row: sonRow }" width="90">
                    <ImagePop
                      :src="`${extraUrl}${sonRow.combDetailDto.image}`"
                    />
                  </vxe-column>
                  <vxe-column field="prodSSku" width="120"></vxe-column>
                  <vxe-column width="60">
                    <template #default="{ row: sonRow }">
                      {{ sonRow.combDetailDto.unit }}
                    </template>
                  </vxe-column>
                  <vxe-column width="60">
                    <template #default="{ row: sonRow }">
                      {{ sonRow.combDetailDto.prodDetailNums }}
                    </template>
                  </vxe-column>
                  <vxe-column width="120">
                    <template #default="{ row: sonRow }">
                      {{
                        sonRow.combDetailDto?.combLocation?.locationCode || ''
                      }}
                    </template>
                  </vxe-column>
                  <vxe-column v-if="activeKey === '0'">
                    <template #default="{ row: sonRow }">
                      {{ sonRow.combDetailDto.availableStock }}
                    </template>
                  </vxe-column>
                  <vxe-column
                    v-if="activeKey !== '0' && activeKey !== '9'"
                    title="操作"
                    align="center"
                  >
                    <template #default="{ row: sonRow }">
                      <div style="text-align: left">
                        配货：{{
                          sonRow.matchTime
                            ? parseTime(sonRow.matchTime, '{y}-{m}-{d} {h}:{i}')
                            : ''
                        }}
                        {{ sonRow.matcher }}
                      </div>
                      <div
                        v-if="[8, 2, 3, 4, 5].includes(Number(activeKey))"
                        style="text-align: left"
                      >
                        投篮:
                        {{
                          sonRow.putTime
                            ? parseTime(sonRow.putTime, '{y}-{m}-{d} {h}:{i}')
                            : ''
                        }}
                        {{ sonRow.putter }}
                      </div>
                    </template>
                  </vxe-column>
                </vxe-table>
                <div
                  v-if="row.detailDtoList"
                  :class="[row.detailDtoList.length <= 3 ? 'hideBtn' : '']"
                  style="text-align: center"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a v-if="row.detailDtoList" style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template>
            </vxe-column>
            <!-- 不为 待派单 和 取消单 -->
            <vxe-column
              v-if="activeKey !== '0' && activeKey !== '9'"
              title="批次号"
              align="center"
              width="120"
              field="batchNo"
            ></vxe-column>
            <!-- 待配货 仓库缺货 待投篮 待生产 -->
            <template v-if="[1, 3, 2, 8, 5, 4].includes(Number(activeKey))">
              <vxe-column
                title="篮号"
                align="center"
                width="60"
                field="frameNo"
              ></vxe-column>
              <vxe-column title="仓库操作" align="center">
                <template #default="{ row }">
                  <div>
                    生产：{{
                      row.produceTime
                        ? parseTime(row.produceTime, '{y}-{m}-{d} {h}:{i}:{s}')
                        : ''
                    }}
                    {{ row.producePerson }}
                  </div>
                  <div>
                    上架：{{
                      row.groundingTime
                        ? parseTime(
                            row.groundingTime,
                            '{y}-{m}-{d} {h}:{i}:{s}'
                          )
                        : ''
                    }}
                    {{ row.groundingPerson }}
                  </div>
                </template>
              </vxe-column>
            </template>
          </vxe-table>

          <div class="pagination">
            <el-pagination
              v-model:currentPage="formData.page"
              v-model:page-size="formData.limit"
              background
              :page-sizes="[50, 100, 160, 1000]"
              :small="true"
              layout="total, sizes, prev, pager, next"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
          <!-- 组合品生产列表数据 end -->
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn">
        <el-button v-permission="['downloadCombinationTplBtn']" type="primary">
          <a
            style="color: #fff; text-decoration: none"
            href="/api/lms/static/templet/whCombProduce_addTemplate.xlsx"
            target="_blank"
            >下载新增模板</a
          ></el-button
        >
        <el-upload
          :action="'/api/lms/whCombProduce/addByExcel'"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :show-file-list="false"
          style="margin-right: 10px"
        >
          <el-button
            v-permission="['importCombinationBtn']"
            type="primary"
            style="margin-left: 10px"
            >导入新增</el-button
          >
        </el-upload>
        <el-button
          v-if="activeKey === '0'"
          v-permission="['transferToWarehouseBtn']"
          type="primary"
          @click="handleDistribute()"
          >派至仓库</el-button
        >
        <el-button
          v-if="activeKey === '1'"
          v-permission="['generateBatchBtn']"
          type="primary"
          @click="handleGenerateBatch"
          >生成批次</el-button
        >
        <el-button
          v-if="[1, 8, 2, 3].includes(Number(activeKey))"
          v-permission="['transferToWaitDispatchBtn']"
          type="primary"
          @click="handleTranferStatus('0')"
          >转待派单</el-button
        >
        <el-button
          v-if="[0, 1, 8, 2, 3].includes(Number(activeKey))"
          v-permission="['fbaCancelBtn']"
          type="primary"
          @click="handleTranferStatus('9')"
          >取消</el-button
        >
        <el-button
          v-if="[1, 2, 3, 4, 8].includes(Number(activeKey))"
          type="primary"
          @click="handlePrintLabel('label')"
          >打印篮号</el-button
        >
        <el-button
          v-if="[1, 2, 3, 4, 8].includes(Number(activeKey))"
          type="primary"
          @click="handlePrintGoods()"
          >打印商品标签</el-button
        >
        <el-button
          v-if="activeKey === '2'"
          v-permission="['fbaShootBtn']"
          type="primary"
          @click="handleShoot"
          >投篮</el-button
        >
        <el-button
          v-if="activeKey === '3'"
          v-permission="['fbaProduceBtn']"
          type="primary"
          @click="handleProduce"
          >生产</el-button
        >
      </div>
    </el-card>
    <!-- 组合品生产 tabs table end -->

    <!-- 投篮弹窗 -->
    <Shoot
      v-if="showShootDialog"
      :is-visible="showShootDialog"
      :form-params="formData"
      :total="total"
      @close="handleCloseShoot"
    />

    <!-- 生产弹窗 -->
    <Produce
      v-if="showProduceDialog"
      :is-visible="showProduceDialog"
      @close="handleCloseProduce"
    />
  </div>

  <!-- 打印弹窗 -->
  <el-dialog
    v-model="showPrint"
    title="打印商品标签"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="数量" size="default">
        <el-input v-model="printNum"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="confirmPrintGoods">打印</el-button>
        <el-button @click="showPrint = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 生成批次结果弹窗 -->
  <el-dialog
    v-model="showBatch"
    title="生成批次结果"
    width="500px"
    :close-on-click-modal="false"
    @close="showBatch = false"
  >
    <div>
      生成批次号： {{ batchNo }}, SKU种类总量： {{ skuTotalNum }}, 商品总量：
      {{ moveTotalNum }}
    </div>
    <div
      v-for="(item, index) in floorMap"
      :key="index"
      style="margin-top: 10px"
    >
      楼层{{ item.floor }}, SKU种类数: {{ item.skuNum }}, 商品数量:
      {{ item.moveNum }}
    </div>
    <template #footer>
      <span>
        <el-button type="primary" @click="showBatch = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="fbadelivercombination">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { reactive, ref, computed, onMounted } from 'vue';
  import Shoot from './component/Shoot.vue';
  import Produce from './component/Produce.vue';
  import { transferDate } from '@/utils/common';
  import {
    queryCombList,
    queryCombCount,
    queryBatchNo,
    distributeOrder,
    generateBatch,
    getWarehouse,
    changeStatus,
    // getPrintInfo,
    getPrintParamsAjax,
    whExportExcelApi,
    printBasketLabelApi
  } from '@/api/fba/combination';
  import { shortcuts } from '@/api/common';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { commonExecutePrintJobs } from '@/utils/print';

  const activeKey = ref('0'); // tab 页

  const tabList = ref([
    { label: '待派单', count: 0, status: '0' },
    { label: '待配货', count: 0, status: '1' },
    { label: '仓库缺货', count: 0, status: '8' },
    { label: '待投篮', count: 0, status: '2' },
    { label: '待生产', count: 0, status: '3' },
    { label: '生产完成', count: 0, status: '4' },
    // { label: '拍照中', count: 0, status: '41' },
    { label: '上架完成', count: 0, status: '5' },
    { label: '取消单', count: 0, status: '9' }
  ]);

  const orderByTypeEnum = [
    {
      label: '创建时间正序',
      value: 1
    },
    {
      label: '创建时间倒序',
      value: 2
    },
    {
      label: '生产数量正序',
      value: 3
    },
    {
      label: '生产数量倒序',
      value: 4
    }
  ];

  const loading = ref(false);

  const extraUrl = ref('');
  const formData = reactive({
    page: 1,
    limit: 100,
    batchNo: '', // 批次号
    time: [],
    createBegintime: '',
    createEndTime: '',
    storeId: '',
    produceNoList: [], // 生产单号
    idStr: '',
    combDetailSSkuList: [], // 单品sku
    combDetailSSkuStr: '',
    prodSSkuList: [], // 组合品sku
    prodSSkuStr: '',
    productId: '',
    processStatus: '0',
    frameNo: '',
    isSale: '',
    orderByType: 1,
    creator: '' // 创建人
  });

  onMounted(() => {
    getWarehouseData();
  });

  const orderTable = ref(null);

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
  // 切换 tab
  const tabIndex = ref(0);
  const handleClick = (tab) => {
    if (tabIndex.value !== tab.index) {
      // 不是同一个tab
      formData.batchNo = '';
    }
    tabIndex.value = tab.index;
    formData.processStatus = tab.props.name;
    formData.page = 1;
    handleQuery();
    //切换tab,无批次号搜索条件的tab不请求
    if (![0, 6, 7].includes(Number(tab.index))) {
      getBatchNo();
    }
  };

  // 获取复选框选中的数据
  const selectRecords = ref([]);
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = orderTable.value;
    selectRecords.value = $table[tabIndex.value].getCheckboxRecords();
    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };

  // 获取仓库数据
  const warehouseList = ref([]);
  const getWarehouseData = async () => {
    const { code, data } = await getWarehouse();
    if (code === '0000') {
      warehouseList.value = data.prodWarehouses;
    }
  };

  const combProductList = ref([]);
  const handleQuery = () => {
    getCombList();
    queryCombCountData();
  };
  // 查询列表
  const getCombList = async () => {
    handleSearchData();
    try {
      loading.value = true;
      if (![1, 8, 2, 3, 4].includes(Number(tabIndex.value))) {
        formData.batchNo = '';
      }
      const { code, data, count, extra } = await queryCombList(formData);
      if (code === '0000') {
        combProductList.value = data?.map((item) => {
          item.displayCount = 3;
          item.logList?.forEach((cItem) => {
            if (cItem.operType == 8) {
              item.groundingPerson = cItem.creator;
              item.groundingTime = cItem.createTime;
            }
            if (cItem.operType == 7) {
              item.producePerson = cItem.creator;
              item.produceTime = cItem.createTime;
            }
          });
          return item;
        });
        total.value = count;
        extraUrl.value = extra;
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  const handleSearchData = function () {
    formData.produceNoList = formData.idStr ? formData.idStr?.split(',') : [];
    formData.prodSSkuList = formData.prodSSkuStr
      ? formData.prodSSkuStr?.split(',')
      : [];
    formData.combDetailSSkuList = formData.combDetailSSkuStr
      ? formData.combDetailSSkuStr?.split(',')
      : [];
    formData.createBegintime = '';
    formData.createEndTime = '';
    if (formData.time?.length > 0) {
      formData.createBegintime = formData?.time[0] + ' 00:00:00';
      formData.createEndTime = formData?.time[1] + ' 23:59:59';
    }
  };

  // 查看全部时，将所有都给到
  const viewAll = (row) => {
    row.displayCount = row.detailDtoList.length;
  };

  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };

  const countList = ref([]);
  const total = ref(0);
  // 查询不同状态 组合品 的数量
  const queryCombCountData = async () => {
    let params = Object.assign({}, formData);
    try {
      const { code, data } = await queryCombCount(params);
      if (code === '0000') {
        countList.value = data;
        handleTabsCount();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 处理 tabs 货件的数量
  const handleTabsCount = () => {
    tabList.value.forEach((item) => {
      item.count = 0;
      Object.keys(countList.value).forEach((cItem) => {
        if (item.status == cItem) {
          item.count = countList.value[cItem];
        }
      });
    });
  };

  // 获取批次号
  const batchNoList = ref([]);
  const getBatchNo = async () => {
    try {
      let params = {
        processStatus: formData.processStatus
      };
      const { code, data } = await queryBatchNo(params);
      if (code === '0000') {
        batchNoList.value = data?.map((item) => {
          return {
            label: `${item.batchNo}单${item.skuTypeQty}/总${item.totalQty}`,
            value: item.batchNo
          };
        });
        batchNoList.value.unshift({ label: '无批次', value: '无' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 导入新增
  const uploadSuccess = (res) => {
    ElMessageBox.alert(
      `<div style="width: 400px;overflow: hidden;overflow-wrap: break-word;">${res.msg}</div>`,
      '操作结果',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确认'
      }
    ).then(() => {
      if (tabIndex.value === 0) {
        handleQuery();
      }
    });
  };
  const uploadError = () => {
    ElMessage.error('请下载新增模板后导入');
  };

  // 派单
  const handleDistribute = async () => {
    try {
      if (getSelectedList()) {
        ElMessageBox.confirm('确定要派至仓库吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            loading.value = true;
            const { code, msg } = await distributeOrder(
              selectRecords.value.map((item) => item.id)
            );
            if (code === '0000') {
              ElMessageBox.alert(msg, '操作结果', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '取消'
              });
            }
            loading.value = false;
          })
          .catch((err) => {
            loading.value = false;
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  const showBatch = ref(false); // 生成批次结果弹窗
  const batchNo = ref(''); //弹框-批次
  const floorMap = ref([]);
  // 生成批次
  const handleGenerateBatch = async () => {
    try {
      if (getSelectedList()) {
        ElMessageBox.confirm('确定要生成批次吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            loading.value = true;
            let params = {
              idList: selectRecords.value.map((item) => item.id)
            };
            const { code, data } = await generateBatch(params);
            if (code === '0000') {
              // ElMessage.success('生成批次成功');
              showBatch.value = true;
              batchNo.value = data.batchNo;
              floorMap.value = [];
              Object.keys(data?.floorMap)?.forEach((key) => {
                let obj = {
                  floor: '',
                  skuNum: ''
                };
                obj.floor = key;
                obj.skuNum = data?.floorMap[key]?.length || 0;
                let moveNumArr = data?.floorMap[key]?.map(
                  (floorItem) => floorItem.moveNum
                );
                obj.moveNum = moveNumArr.reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                );
                floorMap.value.push(obj);
              });
              handleQuery();
              getBatchNo();
            }
            loading.value = false;
          })
          .catch((err) => {
            loading.value = false;
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };
  //弹框-sku总量
  const skuTotalNum = computed(() => {
    return floorMap.value.reduce(
      (accumulator, currentValue) => accumulator + currentValue.skuNum,
      0
    );
  });
  //弹框-商品总量
  const moveTotalNum = computed(() => {
    return floorMap.value.reduce(
      (accumulator, currentValue) => accumulator + currentValue.moveNum,
      0
    );
  });

  //ztt20231031 缺货导出功能
  const whExportExcelHandle = async () => {
    const $table = orderTable.value;
    const isCKedArr = $table[tabIndex.value].getCheckboxRecords();
    if (isCKedArr.length > 0) {
      // whExportExcelApi
      let idList = isCKedArr.map((item) => Number(item.id));
      loading.value = true;
      whExportExcelApi({ idList: idList }).then((res) => {
        const xlsx = 'application/vnd.ms-excel';
        const blob = new Blob([res], { type: xlsx }); //转换数据类型
        const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
        a.download = '组合品生产导出数据.xlsx';
        a.href = window.URL.createObjectURL(blob);
        a.click();
        a.remove();
        loading.value = false;
      });
    } else {
      let params = Object.assign({}, formData);
      loading.value = true;
      whExportExcelApi({ ...params }).then((res) => {
        const xlsx = 'application/vnd.ms-excel';
        const blob = new Blob([res], { type: xlsx }); //转换数据类型
        const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
        a.download = '组合品生产导出数据.xlsx';
        a.href = window.URL.createObjectURL(blob);
        a.click();
        a.remove();
        loading.value = false;
      });
    }
  };

  // 转待派单 取消
  const handleTranferStatus = (status) => {
    try {
      if (getSelectedList()) {
        let tip = status === '9' ? '取消' : '转至待派单';
        ElMessageBox.confirm(`确定要${tip}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            loading.value = true;
            let params = {
              idList: selectRecords.value.map((item) => Number(item.id)),
              processStatus: status
            };
            const { code } = await changeStatus(params);
            if (code === '0000') {
              let msg = status === '9' ? '取消成功' : '转待派单成功';
              ElMessage.success(msg || '操作成功');
              handleQuery();
            }
            loading.value = false;
          })
          .catch((err) => {
            loading.value = false;
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  // 打印批次蓝号
  // const printList = ref([]);
  const handlePrintBatch = async () => {
    if (!formData.batchNo) {
      return ElMessage.warning('请选择批次号');
    }
    if (formData.batchNo === '无') {
      return ElMessage.warning('请选择存在的批次打印');
    }
    // let params = Object.assign({}, formData);
    // params.processStatus = '';
    // params.time = [];
    // params.createBegintime = '';
    // params.createEndTime = '';
    // params.storeId = '';
    // params.produceNoList = [];
    // params.idStr = '';
    // params.combDetailSSkuList = [];
    // params.combDetailSSkuStr = '';
    // params.prodSSkuList = [];
    // params.prodSSkuStr = '';
    // params.productId = '';
    // params.frameNo = '';
    // delete params.limit;
    // delete params.page;
    // const { code, data } = await getPrintInfo(params);
    // if (code === '0000') {
    //   printList.value = data || [];
    handlePrintLabel('frame', formData.batchNo);
    // }
    // let printObj100100 = {
    //   printerName: 100100,
    //   jspaper: 'combBatchNo.jasper',
    //   printDetailDtoList: [
    //     {
    //       titleMap: {
    //         batchNo: formData.batchNo
    //       }
    //     }
    //   ]
    // };
    // epeanPrint_plugin_fun(99, printObj100100);
  };

  // 打印标签
  const handlePrintLabel = async (type, batchNo) => {
    const params = {};
    if (type === 'frame') {
      params.batchNo = batchNo;
    }
    if (type === 'label') {
      getSelectedList();
      params.wcpId = selectRecords.value.map((v) => v.id).join();
    }
    const { data } = await printBasketLabelApi(params);
    if (type === 'frame') {
      data.singlePrint = true;
    }
    commonExecutePrintJobs([data]);

    // list?.forEach((item) => {
    //   let obj = {
    //     titleMap: {
    //       frameNo: item.frameNo,
    //       prodSSku: item.prodSSku,
    //       planQty: item.planQty,
    //       produceId: item.produceNo,
    //       skuList: item.detailDtoList.map((cItem) => cItem.prodSSku),
    //       locationList: item.detailDtoList.map(
    //         (cItem) => cItem.combDetailDto?.combLocation?.locationCode || ''
    //       ),
    //       numList: item.detailDtoList.map((cItem) => cItem.totalRequireQty)
    //     }
    //   };
    //   printDetailDtoList.push(obj);
    // });
    // let printObj10040 = {
    //   printerName: 100100,
    //   jspaper: 'combProduceDetail100.jasper',
    //   printDetailDtoList
    // };
    // epeanPrint_plugin_fun(99, printObj10040);
    // // }
  };

  //顺序获取打印参数
  const commonGetPrintDataByLoopRequest = (data) => {
    let printReqData = [];
    data.forEach((item) => {
      printReqData.push(
        new Promise((resolve) => {
          getPrintParamsAjax(item)
            .then((res) => {
              return resolve(res.data);
            })
            .catch((_) => {
              return resolve(_); // 注意
            });
        })
      );
    });
    return printReqData;
  };
  const confirmPrintGoods = () => {
    const str = /^[0-9]*[1-9][0-9]*$/;
    if (printNum.value <= 0 || !str.test(printNum.value)) {
      return ElMessage.warning('打印数量为大于0的整数！');
    }
    let list = selectRecords.value;
    console.log(list);
    let printArray = [];
    list?.forEach((item) => {
      let obj = {
        // printNumber: printNum.value,
        // develop: item.bizzOwner,
        // prodSSku: item.prodSSku,
        // prodName: getTitleAli(item.title),
        // printerName: '6515',
        // prodStyle: '',
        // inPackType: ''
        printNum: printNum.value,
        storageNum: printNum.value,
        prodSId: item.prodSId,
        warehouseId: item.storeId,
        addFlag: true
      };
      printArray.push(obj);
    });
    showPrint.value = false;
    if (list?.length > 0) {
      // epeanPrint_plugin_fun(4, printArray);
      let resData = commonGetPrintDataByLoopRequest(printArray);
      // console.log('打印商品标签', resData);
      Promise.all(resData).then((res) => {
        let printParamsArr = [];
        for (let i = 0; i < res.length; i++) {
          let item = res[i];
          if (typeof item == 'string') {
            return ElMessage.error(item);
          } else {
            let obj = {};
            obj.printType = 19;
            obj.labelUrl = item.labelUrl;
            obj.width = item.width;
            obj.height = item.height;
            obj.printName = item.printName;
            printParamsArr.push(obj);
          }
        }
        commonExecutePrintJobs(printParamsArr);
      });
    }
  };

  const showPrint = ref(false);
  const printNum = ref(1);
  // 打印商品小标签
  const handlePrintGoods = () => {
    if (getSelectedList()) {
      showPrint.value = true;
      printNum.value = 1;
    }
  };

  // const getTitleAli = (title) => {
  //   let titleArr = title.split(' ');
  //   if (titleArr.length > 5) {
  //     return (
  //       titleArr[0] +
  //       ' ' +
  //       titleArr[1] +
  //       ' ... ' +
  //       titleArr[titleArr.length - 2] +
  //       ' ' +
  //       titleArr[titleArr.length - 1]
  //     );
  //   } else {
  //     return title;
  //   }
  // };

  const showShootDialog = ref(false);
  const handleShoot = () => {
    showShootDialog.value = true;
  };

  const handleCloseShoot = () => {
    showShootDialog.value = false;
  };

  const showProduceDialog = ref(false);
  const handleProduce = () => {
    showProduceDialog.value = true;
  };

  const handleCloseProduce = () => {
    showProduceDialog.value = false;
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    if ([1, 8, 2, 3, 4].includes(Number(activeKey.value))) {
      return clientHeight - 285;
    }
    return clientHeight - 240;
  });
</script>

<style lang="scss" scoped>
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
  .card_position {
    position: relative;
    .tools_btn {
      display: flex;
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  /*vxe-table 自定义行高 */
  :deep(
      .vxe-table--render-default.size--mini
        .vxe-body--column.col--ellipsis
        > .vxe-cell
    ) {
    padding: 7px;
    max-height: fit-content;
    text-overflow: ellipsis;
    white-space: break-spaces;
  }
  .batch_input {
    :deep(.el-input) {
      width: 224px !important;
    }
  }
</style>
