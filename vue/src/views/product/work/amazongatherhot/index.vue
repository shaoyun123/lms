<template>
  <div class="app-container">
    <!-- 数据筛选 start -->
    <el-card class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId" class="mr-2">
          <el-tree-select
            v-model="formData.orgId"
            placeholder="请选择"
            :data="state.orgIdList"
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
        <el-form-item label="站点" prop="site" class="search_item_cascader">
          <el-select
            v-model="formData.site"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="val in state.siteList"
              :key="val.code"
              :label="val.name"
              :value="val.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="月销售额" class="form_range">
          <el-input
            v-model="formData.monthlySalesMin"
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input v-model="formData.monthlySalesMax" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="initState.remarkType"
            class="form_left"
            filterable
          >
            <el-option label="初审备注" value="1"></el-option>
            <el-option label="开发备注" value="2"></el-option>
          </el-select>
          <el-select
            v-model="initState.remark"
            class="form_right"
            filterable
            allow-create
            default-first-option
          >
            <el-option label="有" value="有"></el-option>
            <el-option label="无" value="无"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="价格" class="form_range">
          <el-input
            v-model="formData.priceMin"
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input v-model="formData.priceMax" clearable></el-input>
        </el-form-item>
        <br />
        <el-form-item label="开发" prop="developmentId">
          <el-select
            v-model="formData.developmentId"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="val in state.development"
              :key="val.id"
              :label="val.user_name"
              :value="val.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配送方式" prop="deliveryMode">
          <el-select
            v-model="formData.deliveryMode"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="FBA" value="FBA" />
            <el-option label="FBM" value="FBM" />
            <el-option label="AMZ" value="AMZ" />
            <el-option label="NA" value="NA" />
          </el-select>
        </el-form-item>
        <el-form-item label="月销量" class="form_range">
          <el-input
            v-model="formData.monthlySalesNumMin"
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input v-model="formData.monthlySalesNumMax" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="initState.timeType" class="form_left">
            <el-option label="产品上架时间" value="1" />
            <el-option label="产品更新时间" value="2" />
          </el-select>
          <el-date-picker
            v-model="initState.time"
            class="form_right"
            type="daterange"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="评分值" class="form_range">
          <el-input
            v-model="formData.scoreMin"
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input v-model="formData.scoreMax" clearable></el-input>
        </el-form-item>
        <br />
        <el-form-item label="变体数" class="form_range">
          <el-input
            v-model="formData.variantsNumMin"
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input v-model="formData.variantsNumMax" clearable></el-input>
        </el-form-item>
        <el-form-item prop="category">
          <el-select v-model="initState.searchType" class="form_left">
            <el-option label="类目" value="category" />
            <el-option label="标题" value="title" />
            <el-option label="父ASIN" value="parentAsin" />
            <el-option label="品牌" value="brand" />
          </el-select>
          <el-input v-model="initState.searchVal" class="form_right"></el-input>
        </el-form-item>
        <el-form-item label="排序方式" prop="sortType">
          <el-select v-model="formData.sortType" placeholder="排序" clearable>
            <!-- 默认 -->
            <el-option value="1" label="产品更新时间倒序" />
            <el-option value="2" label="月销量倒序" />
            <el-option value="3" label="月销售额倒序" />
            <el-option value="4" label="评分倒序" />
            <el-option value="5" label="评分数倒序" />
            <el-option value="6" label="价格倒序" />
            <el-option value="7" label="类目正序" />
          </el-select>
        </el-form-item>
        <el-form-item label="热销标识" prop="checkboxType">
          <el-checkbox-group v-model="initState.checkboxType">
            <el-checkbox label="BR" name="BR" />
            <el-checkbox label="AC" name="AC" />
            <el-checkbox label="NR" name="NR" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="getSearchData"
            >查询</el-button
          ><el-button @click="resetQuery">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

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
          <vxe-table
            ref="tableRef"
            v-loading="loading"
            :data="tableList"
            :height="height"
            :show-overflow="true"
            :scroll-y="{ gt: 10 }"
            border
          >
            <vxe-column type="checkbox" width="50"></vxe-column>
            <vxe-column title="ID" width="60" field="id"></vxe-column>
            <vxe-column title="主图" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.mainImage || ''" />
              </template>
            </vxe-column>
            <vxe-column title="产品信息">
              <template #default="{ row }">
                <div>标题：{{ row.title }}</div>
                <div>父ASIN：{{ row.parentAsin }}</div>
                <div>子ASIN：{{ row.asin }}</div>
                <div>
                  品牌：<a :href="row.brandUrl" target="_blank">{{
                    row.brand
                  }}</a>
                </div>
              </template>
            </vxe-column>
            <vxe-column title="站点/类目/BSR排名">
              <template #default="{ row }">
                <div>站点：{{ row.site }}</div>
                <div>类目路径：{{ row.category }}</div>
                <div>大类目：{{ row.headCategory }}</div>
                <div>小类目: {{ row.tailCategory }}</div>
              </template>
            </vxe-column>
            <vxe-column title="价格/销量">
              <template #default="{ row }">
                <div>
                  价格：{{ row.price }}{{ row.currency }}
                  <span v-if="row.primePrice"
                    >/ {{ row.primePrice }}{{ row.currency }}(prime)</span
                  >
                </div>
                <div>FBA运费：{{ row.fbaFreight }}{{ row.currency }}</div>
                <div>配送方式：{{ row.deliveryMode }}</div>
                <div>变体数：{{ row.variantsNum }}</div>
                <div>月销量：{{ row.monthlySalesNum }}</div>
                <div>月销售额：{{ row.monthlySales }}{{ row.currency }}</div>
              </template>
            </vxe-column>
            <vxe-column title="评分/buybox/重量" width="200">
              <template #default="{ row }">
                <div>评分值：{{ row.score }}</div>
                <div>评分数：{{ row.scoreNum }}</div>
                <div>buybox类型：{{ row.buyBoxType }}</div>
                <div>
                  buybox卖家：<a :href="row.sellerWebPage" target="_blank">{{
                    row.buyBoxSeller
                  }}</a>
                </div>
                <div>重量：{{ row.weight }}</div>
                <div>体积：{{ row.volume }}</div>
              </template>
            </vxe-column>
            <vxe-column title="产品时间" width="150">
              <template #default="{ row }">
                <div>
                  添加：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d}')
                      : ''
                  }}
                </div>
                <div>
                  上架：{{
                    row.launchTime
                      ? parseTime(row.launchTime, '{y}-{m}-{d}')
                      : ''
                  }}
                </div>
                <div>
                  更新：{{
                    row.lastUpdateTime
                      ? parseTime(row.lastUpdateTime, '{y}-{m}-{d}')
                      : ''
                  }}
                </div>
              </template>
            </vxe-column>
            <vxe-column title="人员" width="120">
              <template #default="{ row }">
                <div>主管：{{ row.managers }}</div>
                <div>组长：{{ row.teamLeader }}</div>
                <div>开发：{{ row.developmentPerson }}</div>
              </template>
            </vxe-column>
            <vxe-column title="备注" width="150">
              <template #default="{ row }">
                初审：{{ row.firstTrialRemark }}<br />
                开发：{{ row.developmentRemark }}
              </template>
            </vxe-column>
            <vxe-column title="操作" width="120">
              <template #default="{ row }">
                <el-button
                  v-if="row.processStatus === 1 || row.processStatus === 2"
                  v-permission="['matchDevBtn']"
                  type="primary"
                  @click.stop="confirmMatchDev('', row)"
                  >匹配开发</el-button
                >
                <el-button
                  v-if="row.processStatus === 1 || row.processStatus === 2"
                  v-permission="['assignDevBtn']"
                  type="primary"
                  @click.stop="handleAssignDev('', row)"
                  >分配开发</el-button
                >
                <el-button
                  v-if="row.processStatus === 2"
                  v-permission="['checkProdBtn']"
                  type="primary"
                  @click.stop="handleCheckStatus('', '初审', row)"
                  >初审</el-button
                >
                <el-button
                  v-if="row.processStatus === 3"
                  v-permission="['checkProdBtn']"
                  type="primary"
                  @click="handleCheckStatus('', '重新初审', row)"
                  >重新初审</el-button
                >
                <el-button
                  v-if="row.processStatus === 4"
                  v-permission="['devSuccessBtn']"
                  type="primary"
                  @click="handleDevStatus('', 'success', '开发成功', row)"
                  >开发成功</el-button
                >
                <el-button
                  v-if="row.processStatus === 4"
                  v-permission="['devFailBtn']"
                  type="primary"
                  @click="handleDevStatus('', 'fail', '开发失败', row)"
                  >开发失败</el-button
                >

                <el-popconfirm
                  v-if="row.processStatus === 4"
                  :title="`确认要转初始化吗？`"
                  @confirm="handleTurnToWaitDevAndInit('', 1, '转初始化', row)"
                >
                  <template #reference>
                    <el-button v-permission="['turnInitBtn']" type="primary"
                      >转初始化</el-button
                    >
                  </template>
                </el-popconfirm>

                <el-button
                  v-if="row.processStatus === 5 || row.processStatus === 6"
                  type="primary"
                  @click="handleDevStatus('', 'remark', '开发备注', row)"
                  >开发备注</el-button
                >
                <el-popconfirm
                  v-if="row.processStatus === 6"
                  :title="`继续操作将清空商品的开发失败原因。且状态重新变为待开发。请确认`"
                  @confirm="handleTurnToWaitDevAndInit('', 4, '转待开发', row)"
                >
                  <template #reference>
                    <el-button v-permission="['turnWaitDevBtn']" type="primary"
                      >转待开发</el-button
                    >
                  </template>
                </el-popconfirm>
                <el-button type="primary" @click.stop="showOperateLog(row)"
                  >操作日志</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
        </el-tab-pane>

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
      </el-tabs>
      <div class="tools_btn">
        <el-upload
          :action="'/api/lms/amazon/prodHotSale/importProd'"
          :before-upload="beforeUpload"
          :on-success="importSuccess"
          :on-error="importError"
          :show-file-list="false"
          style="margin-right: 12px"
        >
          <el-button
            v-if="activeKey === '1' || activeKey === ''"
            v-permission="['importProdBtn']"
            type="primary"
            :loading="importLoading"
            >导入产品</el-button
          >
        </el-upload>
        <el-button
          v-if="activeKey === '1' || activeKey === '2'"
          v-permission="['matchDevBtn']"
          type="primary"
          @click="confirmMatchDev('isBatch')"
          >批量匹配开发</el-button
        >
        <el-button
          v-if="activeKey === '1' || activeKey === '2'"
          v-permission="['assignDevBtn']"
          type="primary"
          @click="handleAssignDev('isBatch')"
          >批量分配开发</el-button
        >
        <el-button
          v-if="activeKey === '2'"
          v-permission="['checkProdBtn']"
          type="primary"
          @click="handleCheckStatus('isBatch', '批量初审')"
          >批量初审</el-button
        >
        <el-button
          v-if="activeKey === '3'"
          v-permission="['checkProdBtn']"
          type="primary"
          @click="handleCheckStatus('isBatch', '批量重新初审')"
          >批量重新初审</el-button
        >
        <el-button
          v-if="activeKey === '4'"
          v-permission="['devSuccessBtn']"
          type="primary"
          @click="handleDevStatus('isBatch', 'success', '批量开发成功')"
          >批量开发成功</el-button
        >
        <el-button
          v-if="activeKey === '4'"
          v-permission="['devFailBtn']"
          type="primary"
          @click="handleDevStatus('isBatch', 'fail', '批量开发失败')"
          >批量开发失败</el-button
        >

        <el-popconfirm
          v-if="activeKey === 4"
          :title="`确认要转初始化吗？`"
          @confirm="handleTurnToWaitDevAndInit('isBatch', 1, '批量转初始化')"
        >
          <template #reference>
            <el-button v-permission="['turnInitBtn']" type="primary"
              >批量转初始化</el-button
            >
          </template>
        </el-popconfirm>
        <el-popconfirm
          v-if="activeKey === '6'"
          :title="`继续操作将清空商品的开发失败原因。且状态重新变为待开发。请确认`"
          @confirm="handleTurnToWaitDevAndInit('isBatch', 4, '批量转待开发')"
        >
          <template #reference>
            <el-button v-permission="['turnWaitDevBtn']" type="primary"
              >批量转待开发</el-button
            >
          </template>
        </el-popconfirm>
        <el-button
          v-if="activeKey === '5'"
          type="primary"
          @click="handleDevStatus('isBatch', 'remark', '批量备注')"
          >批量备注</el-button
        >
        <el-dropdown
          v-if="['1', '2', ''].includes(activeKey)"
          style="margin: 0 5px"
        >
          <el-button v-permission="['devMapBtn']" type="primary">
            类目-开发映射<el-icon class="el-icon--right"
              ><arrow-down
            /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="downloadTemp()">
                下载导入模板
              </el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu>
              <el-dropdown-item
                ><el-upload
                  :action="'/api/lms/amazon/prodHotSale/importCateDevloperMapping'"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  :show-file-list="false"
                  style="margin-right: 10px"
                >
                  导入映射</el-upload
                ></el-dropdown-item
              >
            </el-dropdown-menu>
            <el-dropdown-menu>
              <el-dropdown-item @click="exportMap()">
                导出映射
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-card>

    <el-dialog
      v-model="showAssignDevDialog"
      width="30%"
      title="分配开发"
      style="overflow: hidden"
      :close-on-click-modal="false"
    >
      <el-select
        v-model="developmentId"
        style="width: 100%"
        placeholder="请选择"
        size="default"
        filterable
        clearable
      >
        <el-option
          v-for="val in state.development"
          :key="val.id"
          :label="val.user_name"
          :value="val.id"
        />
      </el-select>
      <template #footer>
        <span>
          <el-button type="primary" @click="confirmAssignDev()">确认</el-button>
          <el-button @click="showAssignDevDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="devVisible"
      width="30%"
      :title="devTitle"
      style="overflow: hidden"
      :close-on-click-modal="false"
    >
      <el-input v-model="devStatusRemark" type="textarea" :rows="5"></el-input>
      <template #footer>
        <span>
          <el-button type="primary" @click="confirmDevStatus()">确认</el-button>
          <el-button @click="devVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 操作日志 -->
    <Operatelog
      v-if="operateLogVisible"
      :product-id="productId"
      :is-visible="operateLogVisible"
      @close="closeOpearteLog"
    />

    <Prodcheck
      v-if="checkVisible"
      :product-id="productId"
      :is-visible="checkVisible"
      :is-batch-check="isBatchCheck"
      :select-records="selectRecords"
      @close="closeCheck"
      @done="confirmChangeStatus"
    />
  </div>
</template>
<script setup name="productworkamazongatherhot">
  import { onMounted, reactive, ref, computed } from 'vue';
  import {
    getInitData,
    getOrgDevData,
    queryList,
    queryTabCount,
    assignDeveloper,
    changeStatusAndRemark
  } from '@/api/product/work/amazongatherhot.js';
  import { shortcuts } from '@/api/common';
  import { parseTime } from '@/utils/common';
  import ImagePop from '@/components/ImagePop/index.vue';
  import { transferDate } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transBlob } from '@/utils/downloadFile';
  import Operatelog from './components/operatelog.vue';
  import Prodcheck from './components/prodcheck.vue';

  const initState = reactive({
    timeType: '1', // 产品上架时间
    remark: '',
    remarkType: '1',
    time: [],
    searchType: 'category', // 类目
    searchVal: '',
    checkboxType: []
  });
  const formData = reactive({
    page: 1,
    limit: 50,
    processStatus: 1,

    sortType: '1', // 排序类型 产品更新时间倒序

    haveFirstTrialRemark: false, // 是否有初审备注
    firstTrialRemark: '',
    haveDevelopmentRemark: false, // 是否有开发备注
    developmentRemark: '',

    launchTimeStart: '',
    launchTimeEnd: '',
    lastUpdateTimeStart: '',
    lastUpdateTimeEnd: '',

    haveBestSellerSign: '',
    haveAmazonChoiceSign: '',
    haveNewReleaseSign: '',
    monthlySalesMin: '',
    monthlySalesMax: '',
    priceMin: '',
    priceMax: '',
    monthlySalesNumMin: '',
    monthlySalesNumMax: '',
    scoreMin: '',
    scoreMax: '',
    variantsNumMin: '',
    variantsNumMax: ''
  });

  const state = reactive({
    orgIdList: [], // 部门
    siteList: [],
    development: []
  });

  const activeKey = ref('1'); // tab 页
  const total = ref(0);

  const tabList = ref([
    { label: '初始化', count: 0, status: '1' },
    { label: '已分配', count: 0, status: '2' },
    { label: '初审失败', count: 0, status: '3' },
    { label: '待开发', count: 0, status: '4' },
    { label: '开发成功', count: 0, status: '5' },
    { label: '开发失败', count: 0, status: '6' },
    { label: '全部', count: 0, status: '' }
  ]);

  onMounted(() => {
    getOrgDevList();
    // getCustomersFun();
    getAmazonInitList();
  });

  // 部门
  const getOrgDevList = async () => {
    const { code, data } = await getOrgDevData();
    if (code === '0000') {
      state.orgIdList = data.orgTree;
      state.development = data.userList;
      developmentDataCopy.value = data.userList;
    }
  };

  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };

  // 站点
  const getAmazonInitList = async () => {
    const { code, data } = await getInitData();
    if (code === '0000') {
      state.siteList = data.site;
      // state.development = data.development;
    }
  };

  // 选择部门 获取开发人员
  const developmentDataCopy = ref([]);
  const handleNodeClick = (data) => {
    let selectId = data.id;
    state.development = developmentDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
  };

  // 清空部门选择
  const clearDepart = () => {
    state.development = developmentDataCopy.value;
    formData.orgId = '';
  };

  const signMap = {
    BR: 'haveBestSellerSign',
    AC: 'haveAmazonChoiceSign',
    NR: 'haveNewReleaseSign'
  };
  const handleQueryParams = () => {
    formData.haveFirstTrialRemark = '';
    formData.firstTrialRemark = '';
    formData.haveDevelopmentRemark = '';
    formData.developmentRemark = '';
    if (initState.remarkType === '1' && initState.remark) {
      // 初审备注
      if (initState.remark !== '无') {
        formData.haveFirstTrialRemark = true;
      } else {
        formData.haveFirstTrialRemark = false;
      }
      if (initState.remark === '有' || initState.remark === '无') {
        formData.firstTrialRemark = '';
      } else {
        formData.firstTrialRemark = initState.remark;
      }
    }
    if (initState.remarkType === '2' && initState.remark) {
      // 开发备注
      if (initState.remark !== '无') {
        formData.haveDevelopmentRemark = true;
      } else {
        formData.haveDevelopmentRemark = false;
      }
      if (initState.remark === '有' || initState.remark === '无') {
        formData.developmentRemark = '';
      } else {
        formData.developmentRemark = initState.remark;
      }
    }
    // 如果选择了部门 没有选择开发 那么开发就是选择部门下的全部开发
    if (formData.orgId && !formData.developmentId) {
      formData.developmentIdList = state.development
        ? state.development.map((item) => item.id)
        : [];
    }

    if (initState.timeType === '1') {
      formData.launchTimeStart = initState.time[0];
      formData.launchTimeEnd = initState.time[1];
      formData.lastUpdateTimeStart = '';
      formData.lastUpdateTimeEnd = '';
    }
    if (initState.timeType === '2') {
      formData.lastUpdateTimeStart = initState.time[0];
      formData.lastUpdateTimeEnd = initState.time[1];
      formData.launchTimeStart = '';
      formData.launchTimeEnd = '';
    }

    formData.category = '';
    formData.title = '';
    formData.parentAsin = '';
    formData.brand = '';
    formData[initState.searchType] = initState.searchVal;

    if (initState.checkboxType?.length > 0) {
      ['BR', 'AC', 'NR'].forEach((item) => {
        if (initState.checkboxType.includes(item)) {
          formData[signMap[item]] = true;
        } else {
          formData[signMap[item]] = '';
        }
      });
    }
  };

  const tableList = ref([]);
  const loading = ref(false);
  const getSearchData = async () => {
    handleQueryParams();
    loading.value = true;
    try {
      const { code, data, count } = await queryList(formData);
      if (code === '0000') {
        tableList.value = data;
        total.value = count;
        getTabCount();
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  const getTabCount = async () => {
    try {
      const { code, data } = await queryTabCount(formData);
      if (code === '0000') {
        let sum = 0;
        for (let key in data) {
          sum += data[key];
        }
        tabList.value.forEach((item) => {
          item.count = 0;
          Object.keys(data).forEach((cItem) => {
            if (item.status == cItem) {
              item.count = data[cItem];
            }
          });
          if (item.status == '') {
            item.count = sum;
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 切换 tab
  const handleClick = (tab) => {
    formData.processStatus = tab.props.name;
    formData.page = 1;
    getSearchData();
  };

  const formRef = ref(null);
  const resetQuery = () => {
    formRef.value.resetFields();
    formData.sortType = '1';
    formData.haveFirstTrialRemark = false;
    formData.firstTrialRemark = '';
    formData.haveDevelopmentRemark = false;
    formData.developmentRemark = '';
    formData.launchTimeStart = '';
    formData.launchTimeEnd = '';
    formData.lastUpdateTimeStart = '';
    formData.lastUpdateTimeEnd = '';
    formData.haveBestSellerSign = '';
    formData.haveAmazonChoiceSign = '';
    formData.haveNewReleaseSign = '';
    formData.monthlySalesMin = '';
    formData.monthlySalesMax = '';
    formData.priceMin = '';
    formData.priceMax = '';
    formData.monthlySalesNumMin = '';
    formData.monthlySalesNumMax = '';
    formData.scoreMin = '';
    formData.scoreMax = '';
    formData.variantsNumMin = '';
    formData.variantsNumMax = '';

    initState.timeType = '1'; // 产品上架时间
    initState.remark = '';
    initState.remarkType = '1';
    initState.time = [];
    initState.searchType = 'category'; // 类目
    initState.searchVal = '';
    initState.checkboxType = [];
    state.development = developmentDataCopy.value;
  };

  // 导入产品
  const importLoading = ref(false);
  const beforeUpload = () => {
    importLoading.value = true;
  };

  const importSuccess = (res) => {
    importLoading.value = false;
    if (res.code == '0000') {
      ElMessage.success('导入产品成功！');
      getSearchData();
    } else {
      ElMessageBox.confirm(res.msg || '导入产品失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };
  const importError = () => {
    ElMessage.error('导入产品失败！');
  };

  // 导入类目映射
  const uploadSuccess = (res) => {
    if (res.code == '0000') {
      if (res.data.success) {
        ElMessage.success('导入映射成功！');
        getSearchData();
      } else {
        // 下载失败文件
        ElMessageBox.confirm(
          `导入失败，下载失败详情：<br /><a href="${res.data.fileUrl}" target="_blank">${res.data.fileUrl}</a>`,
          '提示信息',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'error',
            dangerouslyUseHTMLString: true
          }
        );
      }
    } else {
      ElMessageBox.confirm(res.msg || '导入映射失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };
  const uploadError = () => {
    ElMessage.error('导入映射失败!');
  };

  // 获取复选框选中的数据
  const selectRecords = ref([]);
  const tableRef = ref(null);
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = tableRef.value;
    if (activeKey.value === '') {
      selectRecords.value = $table[$table.length - 1].getCheckboxRecords();
    } else {
      selectRecords.value = $table[activeKey.value - 1].getCheckboxRecords();
    }
    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };

  // 分配开发
  const showAssignDevDialog = ref(false);
  const developmentId = ref('');
  const singleRowMatcId = ref('');
  const isBatch = ref(false);
  const handleAssignDev = (type, row) => {
    if (type === 'isBatch') {
      isBatch.value = true;
    } else {
      isBatch.value = false;
      showAssignDevDialog.value = true;
      singleRowMatcId.value = row.id;
    }
    if (isBatch.value && getSelectedList()) {
      showAssignDevDialog.value = true;
    }
    developmentId.value = '';
  };

  // 分配开发
  const confirmAssignDev = async () => {
    try {
      let chooseArr = selectRecords.value.map((item) => item.id);
      const { code } = isBatch.value
        ? await assignDeveloper(chooseArr, developmentId.value)
        : await assignDeveloper([singleRowMatcId.value], developmentId.value);
      if (code === '0000') {
        let msg = isBatch.value ? '批量分配开发成功' : '分配开发成功';
        ElMessage.success(msg);
        showAssignDevDialog.value = false;
        getSearchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 匹配开发
  const confirmMatchDev = async (type, row) => {
    if (type === 'isBatch' && !getSelectedList()) return false;
    try {
      let chooseArr = selectRecords.value.map((item) => item.id);
      const { code } =
        type === 'isBatch'
          ? await assignDeveloper(chooseArr, '')
          : await assignDeveloper([row.id], '');
      if (code === '0000') {
        let msg = type === 'isBatch' ? '批量匹配开发成功' : '匹配开发成功';
        ElMessage.success(msg);
        getSearchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 导出映射
  const exportMap = () => {
    transBlob({
      url: '/lms/amazon/prodHotSale/exportCateDevloperMapping',
      contentType: 'application/x-www-form-urlencoded',
      fileName: '类目开发映射' + transferDate(new Date().getTime()) + '.xls'
    }).finally(() => {
      ElMessage.success('导出成功');
    });
  };

  // 下载导入模板
  const downloadTemp = () => {
    transBlob(
      {
        url: '/lms/amazon/prodHotSale/downloadExcelTemplate',
        contentType: 'application/json',
        params: {
          fileName: '类目开发映射导入模板.xlsx'
        },
        fileName:
          '类目开发映射模板' + transferDate(new Date().getTime()) + '.xlsx'
      },
      'get'
    ).finally(() => {
      ElMessage.success('下载成功');
    });
  };

  // 操作日志
  const operateLogVisible = ref(false);
  const productId = ref('');
  const showOperateLog = (row) => {
    operateLogVisible.value = true;
    productId.value = row.id;
  };

  const closeOpearteLog = () => {
    operateLogVisible.value = false;
  };

  // 更新商品状态
  const checkVisible = ref(false);
  // 初审 重新初审
  const isBatchCheck = ref(false);
  const operDesc = ref('');
  const handleCheckStatus = (type, descStatus, row) => {
    if (type === 'isBatch' && !getSelectedList()) return false;
    if (type !== 'isBatch') {
      productId.value = row.id;
    }
    checkVisible.value = true;
    operDesc.value = descStatus;
    isBatchCheck.value = type === 'isBatch' ? true : false;
  };

  const closeCheck = () => {
    checkVisible.value = false;
  };

  // 初审 重新初审 批量初审 批量重新初审
  const confirmChangeStatus = async (obj) => {
    let params = {};
    let paramsArr = [];
    // 初审通过 或者 初审失败
    if (obj.processStatus === 3 || obj.processStatus === 4) {
      obj.productId?.forEach((item) => {
        params = {
          id: item,
          processStatus: obj.processStatus,
          operDesc: operDesc.value,
          remark: obj.remark || obj.customVal
        };
        paramsArr.push(params);
      });
    }
    try {
      const { code } = await changeStatusAndRemark(paramsArr);
      if (code === '0000') {
        ElMessage.success('操作成功');
        checkVisible.value = false;
        getSearchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 开发失败 开发陈功 批量开发失败 批量开发成功
  // 批量备注 开发备注
  const devTitle = ref('开发成功');
  const devVisible = ref(false);
  const devStatusRemark = ref(''); // 开发备注
  const isBatchDev = ref(false); // 单个还是批量
  const isDevSucess = ref(false); // 开发成功还是失败
  const prodProcessStatus = ref('');

  const handleDevStatus = (type, status, descStatus, row) => {
    if (type === 'isBatch' && !getSelectedList()) return false;
    isBatchDev.value = type === 'isBatch' ? true : false;
    isDevSucess.value = status;
    devTitle.value =
      status === 'success'
        ? '开发成功'
        : status === 'fail'
        ? '开发失败'
        : '开发备注';
    devVisible.value = true;
    devStatusRemark.value = '';
    operDesc.value = descStatus;
    prodProcessStatus.value = row.processStatus;
    if (type !== 'isBatch') {
      productId.value = row.id;
      // devStatusRemark.value = row.developmentRemark;
    }
  };

  const confirmDevStatus = async () => {
    if (isDevSucess.value === 'fail' && devStatusRemark.value === '') {
      return ElMessage.warning('请输入开发失败备注');
    }
    let params = {};
    let paramsArr = [];
    let ids = [];
    let processStatus = '';
    if (isBatchDev.value) {
      ids = selectRecords.value.map((item) => item.id);
    } else {
      ids = [productId.value];
    }
    if (isDevSucess.value === 'success') {
      processStatus = 5;
    }
    if (isDevSucess.value === 'fail') {
      processStatus = 6;
    }
    if (isDevSucess.value === 'remark') {
      processStatus = prodProcessStatus.value; // 当前tab状态
    }
    ids?.forEach((item) => {
      params = {
        id: item,
        processStatus,
        operDesc: operDesc.value,
        remark: devStatusRemark.value
      };
      paramsArr.push(params);
    });
    try {
      const { code } = await changeStatusAndRemark(paramsArr);
      if (code === '0000') {
        ElMessage.success('操作成功');
        devVisible.value = false;
        getSearchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 转待开发 批量转待开发 转初始化 批量转初始化
  const handleTurnToWaitDevAndInit = async (
    type,
    processStatus,
    operDesc,
    row
  ) => {
    if (type === 'isBatch' && !getSelectedList()) return false;
    if (type !== 'isBatch') {
      productId.value = row.id;
    }
    let ids = [];
    let params = {};
    let paramsArr = [];
    if (type === 'isBatch') {
      ids = selectRecords.value.map((item) => item.id);
    } else {
      ids = [productId.value];
    }
    ids?.forEach((item) => {
      params = {
        id: item,
        processStatus, // 4 转待开发 1 初始化
        operDesc,
        remark: ''
      };
      paramsArr.push(params);
    });
    try {
      const { code } = await changeStatusAndRemark(paramsArr);
      if (code === '0000') {
        ElMessage.success('操作成功');
        getSearchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 分页
  const handleSizeChange = (val) => {
    formData.limit = val;
    formData.page = 1;
    getSearchData();
  };

  const handleCurrentChange = (val) => {
    formData.page = val;
    getSearchData();
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 300;
  });
</script>
<style scoped lang="scss">
  .card_position {
    position: relative; /*  */
    .tools_btn {
      display: flex;
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
</style>
