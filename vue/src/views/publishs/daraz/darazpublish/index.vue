<template>
  <!-- daraz刊登页面 -->
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="darazData.formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="darazData.formData.orgId"
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
            v-model="darazData.formData.salePersonId"
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
            ref="darazStoreAcctRef"
            v-model="darazData.formData.storeAcctIdList"
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
            v-model="darazData.formData.cateName"
            :options="darazData.initFormData.oaList"
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
        <el-form-item>
          <el-select
            v-model="darazData.formData.includeLogisAttrListType"
            class="form_left"
          >
            <el-option :value="1" label="物流属性与"></el-option>
            <el-option :value="2" label="物流属性或"></el-option>
          </el-select>
          <el-select
            v-model="darazData.formData.includeLogisAttrList"
            placeholder="请选择"
            :class="
              darazData.formData.includeLogisAttrList.length > 1
                ? 'hideTag'
                : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="darazData.formData.includeLogisAttrList.length > 1"
                type="info"
                >已选{{
                  darazData.formData.includeLogisAttrList.length
                }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in darazData.initFormData.logisAttr"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开发专员" prop="bizzOwnerIdList">
          <el-select
            v-model="darazData.formData.bizzOwnerIdList"
            :class="
              darazData.formData.bizzOwnerIdList.length > 1 ? 'hideTag' : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="darazData.formData.bizzOwnerIdList.length > 1"
                type="info"
                >已选{{ darazData.formData.bizzOwnerIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in darazData.initFormData.bizzOwnerIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="在售状态" prop="prodIsSaleStatusList">
          <el-select
            v-model="darazData.formData.prodIsSaleStatusList"
            filterable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="0"
            clearable
            multiple
          >
            <el-option :value="2" label="全部在售" />
            <el-option :value="1" label="部分在售" />
            <el-option :value="0" label="全部停售" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁售" prop="isListingAble">
          <el-select v-model="darazData.formData.isListingAble" clearable>
            <el-option :value="1" label="非禁售" />
            <el-option :value="0" label="禁售" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === '-2'"
          label="生成情况"
          prop="generateStatus"
        >
          <el-select v-model="darazData.formData.generateStatus">
            <el-option :value="0" label="未生成" />
            <el-option :value="1" label="已生成" />
          </el-select>
        </el-form-item>
        <el-form-item prop="tortPlat" label="侵权状态"
          ><el-select
            v-model="darazData.formData.tortPlat"
            placeholder="请选择"
            filterable
            clearable
          >
            <!-- <el-option label="该平台侵权不可刊登" value="CURRENT_PLAT" /> -->
            <el-option label="任一平台侵权不可刊登" value="ANY_PLAT" />
            <el-option label="全部" value="ALL" />
          </el-select>
        </el-form-item>
        <el-form-item prop="queryTimeType">
          <el-select
            v-model="darazData.formData.queryTimeType"
            class="form_left"
          >
            <el-option v-if="activeKey == '-2'" :value="1" label="创建时间" />
            <el-option v-if="activeKey != '-2'" :value="3" label="生成时间" />
            <el-option
              v-if="activeKey == '-2' || activeKey === '0'"
              :value="2"
              label="审核时间"
            />
          </el-select>
          <el-date-picker
            v-model="darazData.formData.time"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            type="daterange"
            unlink-panels
            style="width: 200px"
            class="form_right"
          />
        </el-form-item>
        <br v-if="activeKey === '-2'" />
        <el-form-item prop="orderByType" label="排序方式">
          <el-select
            v-model="darazData.formData.orderByType"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-if="activeKey === '-2'"
              label="创建时间倒序"
              :value="1"
            ></el-option>
            <el-option
              v-if="activeKey === '-2'"
              label="创建时间正序"
              :value="2"
            ></el-option>
            <el-option
              v-if="activeKey === '0'"
              label="审核时间倒序"
              :value="3"
            ></el-option>
            <el-option
              v-if="activeKey === '0'"
              label="审核时间正序"
              :value="4"
            ></el-option>
            <el-option
              v-if="activeKey !== '-2'"
              :value="8"
              label="生成时间倒序"
            ></el-option>
            <el-option
              v-if="activeKey !== '-2'"
              :value="7"
              label="生成时间正序"
            ></el-option>
          </el-select>
        </el-form-item>
        <br v-if="activeKey !== '-2'" />
        <el-form-item prop="queryTextType">
          <el-select
            v-model="darazData.formData.queryTextType"
            class="form_left"
          >
            <el-option :value="1" label="父SKU" />
            <el-option :value="2" label="子SKU" />
            <el-option :value="3" label="中文标题" />
            <el-option :value="4" label="英文标题" />
          </el-select>
          <el-input
            v-model="darazData.formData.queryText"
            placeholder="多个逗号隔开"
            style="width: 270px !important"
            class="form_left form_right"
          />
          <el-select
            v-model="darazData.formData.fuzzyQuery"
            class="form_right WH80"
          >
            <el-option :value="false" label="精确" />
            <el-option :value="true" label="模糊" />
          </el-select>
        </el-form-item>
        <el-form-item prop="whStockSearchType" class="form_input_width">
          <el-select
            v-model="darazData.formData.whStockSearchType"
            class="form_left"
          >
            <el-option
              :value="'preAvailableStockAll'"
              label="预计可用库存含在途"
            />
            <el-option
              :value="'preAvailableStock'"
              label="预计可用库存不含在途"
            />
          </el-select>
          <ZInputNumber
            v-model="darazData.formData.whStockBegin"
            class="form_right"
            placeholder="请输入"
            style="width: 50px"
            clearable
          />
          <span class="range_link">-</span>
          <ZInputNumber
            v-model="darazData.formData.whStockEnd"
            placeholder="请输入"
            style="width: 50px"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="activeKey == '-2' || activeKey == '0'"
          prop="isPublish"
          label="刊登情况"
        >
          <el-select v-model="darazData.formData.isPublish">
            <el-option value="" label="全部" />
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
          <vxe-table
            ref="tableDataRef"
            :data="tableData"
            :height="height"
            border
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="图片" width="100">
              <template #default="{ row }">
                <ImagePop
                  :src="
                    activeKey === '-2'
                      ? row.prodPImage
                      : row.mainImageUrls?.split('|')[0]
                  "
                />
              </template>
            </vxe-column>
            <vxe-column title="英文标题">
              <template #default="{ row }">
                <span v-if="activeKey === '-2'">{{ row.enTitle }}</span>
                <span v-else>{{ row.title }}</span></template
              >
            </vxe-column>
            <vxe-column field="bizzOwner" title="商品名/开发专员" width="280">
              <template #default="{ row }">
                商品名：{{ row.cnTitle }}<br />
                开发专员：{{ row.bizzOwner }}
              </template>
            </vxe-column>
            <vxe-column field="prodPSku" title="父SKU" width="200">
              <template #default="{ row }">
                <div @click="openPskuDetails(row.prodPId)">
                  <span style="color: #409eff">{{ row.prodPSku }}</span>
                </div>
              </template>
            </vxe-column>
            <vxe-column width="600">
              <template #header>
                <div style="display: flex; justify-content: space-around">
                  <div v-if="activeKey == '-2'" style="width: 130px">
                    基础模板子SKU
                  </div>
                  <div v-if="activeKey != '-2'" style="width: 130px">
                    店铺子SKU
                  </div>
                  <div style="width: 100px">颜色</div>
                  <div style="width: 100px">尺寸</div>
                  <div style="width: 100px">款式</div>
                  <div style="width: 50px">在售</div>
                  <div style="width: 100px">采购成本</div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  :data="
                    row.prodListingSubSkuDarazDtoList &&
                    row.prodListingSubSkuDarazDtoList.slice(0, row.displayCount)
                  "
                  :show-header="false"
                >
                  <vxe-column
                    v-if="activeKey == '-2'"
                    field="prodSSku"
                    width="130"
                  >
                    <template #default="{ row: sonRow }">
                      {{ sonRow.prodSSku }}
                    </template></vxe-column
                  >
                  <vxe-column
                    v-if="activeKey != '-2'"
                    field="storeSSku"
                    width="130"
                  >
                    <template #default="{ row: sonRow }">
                      {{ sonRow.storeSSku }}
                    </template></vxe-column
                  >
                  <vxe-column field="color" width="100" />
                  <vxe-column field="size" width="100" />
                  <vxe-column field="style" width="100" />
                  <vxe-column field="isSale" width="50"
                    ><template #default="{ row: sonRow }">{{
                      sonRow.isSale ? '是' : '否'
                    }}</template>
                  </vxe-column>
                  <vxe-column field="price" width="100" />
                </vxe-table>
                <div
                  v-if="row.prodListingSubSkuDarazDtoList"
                  :class="[
                    row.prodListingSubSkuDarazDtoList.length <= 3
                      ? 'hideBtn'
                      : ''
                  ]"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a
                    v-if="row.prodListingSubSkuDarazDtoList"
                    style="color: #409eff"
                    >{{ row.displayCount > 3 ? '收起' : '展开所有' }}</a
                  >
                </div>
              </template></vxe-column
            >
            <vxe-column title="时间" width="160">
              <template #default="{ row }">
                <div v-if="activeKey == '-2'">
                  审核：{{
                    row.auditTime
                      ? parseTime(row.auditTime, '{y}-{m}-{d}')
                      : ''
                  }}<br />
                  创建：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d}')
                      : ''
                  }}
                </div>
                <div v-if="activeKey == '0'">
                  审核：{{
                    row.auditTime
                      ? parseTime(row.auditTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}<br />
                  生成：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}
                </div>
                <div
                  v-if="
                    activeKey == '3' || activeKey == '1' || activeKey == '2'
                  "
                >
                  生成：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}<br />
                  刊登：{{
                    row.listingTime
                      ? parseTime(row.listingTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}
                </div>
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
        <el-button v-if="activeKey == '-2'" type="primary" @click="getListing"
          >生成店铺商品</el-button
        >
        <el-button v-if="activeKey == '0'" type="primary" @click="exportListing"
          >导出店铺商品</el-button
        >
        <el-button v-if="activeKey == '0'" type="danger" @click="deleteListing"
          >删除店铺商品</el-button
        >
      </div>
    </el-card>
    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :cate-search-value="darazData.formData.cateSearchValue"
      :handle-cate-dialog-type="'oa'"
      @close-dialog="handleCateDialogClose($event)"
    />

    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />
  </div>
</template>
<script setup name="publishsdarazdarazpublish">
  import { ref, reactive, onMounted, computed, nextTick } from 'vue';
  import { parseTime } from '@/utils/common';
  import {
    queryOaNewCategory,
    // getPlatCategoryTreeApi,
    shortcuts,
    getProdTagListApi,
    getLogisListApi,
    getDevTypeListApi,
    getListuserbyrole,
    getModelCreatorList
  } from '@/api/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import CateDialog from '@/components/CateDialog.vue';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import {
    queryDarazList,
    createProd,
    deleteRecord
  } from '@/api/publishs/darazpublish';
  import { transBlob } from '@/utils/downloadFile';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';

  const darazData = reactive({
    // 初始化查询条件
    initFormData: {
      oaList: [], // oa类目
      darazList: [], // daraz类目
      bizzOwnerIdList: [], //  开发专员:多选
      prodAttrList: [], //  商品标签
      logisAttr: [], //  物流属性:多选
      devTypeList: [] //  开发类型:多选
    },
    // form表单数据
    formData: {
      page: 1,
      limit: 50,
      orgId: '', // 部门
      salePersonId: '', // 销售员
      isPublish: false, // 刊登情况
      //店铺Id，必选
      storeAcctIdList: '',
      listingStatus: '-2',
      queryText: '',
      queryTextType: 1,
      fuzzyQuery: false,
      cateIdList: [],
      //生成情况
      generateStatus: 0, // 0: 未生成；1：已生成
      //物流属性
      includeLogisAttrListType: 1,
      includeLogisAttrList: [],
      //开发专员
      bizzOwnerIdList: [],
      //侵权状态
      tortPlat: 'ANY_PLAT',
      queryTimeType: 1,
      time: [], //  时间
      queryTimeStart: '',
      queryTimeEnd: '',
      orderByType: '',
      //OA新类目
      cateOaId: '',
      whStockSearchType: 'preAvailableStockAll',
      whStockBegin: '',
      whStockEnd: '',
      prodIsSaleStatusList: [],
      isListingAble: 1
    }
  });

  // tab list
  const tabList = ref([
    { label: '商品', count: '', status: '-2', index: 0 },
    { label: '待刊登', count: '', status: '0', index: 1 },
    { label: '刊登中', count: '', status: '3', index: 2 },
    { label: '刊登成功', count: '', status: '1', index: 3 },
    { label: '刊登失败', count: '', status: '2', index: 4 }
  ]);
  const activeKey = ref('-2');

  onMounted(async () => {
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
      queryOaNewCategory()
      // getPlatCategoryTreeApi('daraz')
    ])
      .then((res) => {
        // 商品标签
        darazData.initFormData.prodAttrList = res[0].data.map(
          (item) => item.name
        );
        //物流属性
        darazData.initFormData.logisAttr = res[1].data.map((item) => item.name);
        //开发类型
        darazData.initFormData.devTypeList = res[2].data.map(
          (item) => item.name
        );
        //开发专员
        darazData.initFormData.bizzOwnerIdList = res[4].data.map((item) => ({
          value: item.id,
          label: item.userName
        }));
        //OA新类目
        darazData.initFormData.oaList = JSON.parse(res[5].data);
        // daraz类目
        // darazData.initFormData.darazList = res[6].data;
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
    darazData.formData.cateName = e.cate.value.fullCateName;
    darazData.formData.cateOaId = e.cate.value.categoryId;
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
    darazData.formData.cateOaId = '';
    darazData.formData.cateIdList = [];
    darazData.formData.queryText = '';
    darazData.formData.fuzzyQuery = false;
    darazData.formData.time = [];
    darazData.formData.includeLogisAttrListType = 1;
    darazData.formData.includeLogisAttrList = [];
    darazData.formData.bizzOwnerIdList = [];
    darazData.formData.queryTimeType = activeKey.value === '-2' ? 1 : 3;
  };

  const handleClick = (tab) => {
    darazData.formData.listingStatus = Number(tab.props.name);
    darazData.formData.page = 1;
    if (tab.props.name !== '-2' && activeKey.value !== tab.props.name) {
      darazData.formData.queryTimeType = 3;
      darazData.formData.orderByType = '';
    } else if (tab.props.name === '-2' && activeKey.value !== tab.props.name) {
      darazData.formData.orderByType = '';
      darazData.formData.queryTimeType = 1;
      darazData.formData.isPublish = false;
    } else if (tab.props.name === '0' && activeKey.value !== tab.props.name) {
      darazData.formData.isPublish = false;
    }

    if (tab.props.name != '-2' && tab.props.name != '0') {
      darazData.formData.isPublish = '';
    }
    onSubmit();
  };

  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 提交查询
  const onSubmit = async () => {
    tableData.value = null;
    darazData.formData.page = currentPage.value;
    darazData.formData.limit = limit.value;
    if (darazData.formData.time?.length > 0) {
      darazData.formData.queryTimeStart = new Date(
        darazData.formData.time[0] + ' 00:00:00'
      ).getTime();
      darazData.formData.queryTimeEnd = new Date(
        darazData.formData.time[1] + ' 23:59:59'
      ).getTime();
    } else {
      darazData.formData.queryTimeStart = '';
      darazData.formData.queryTimeEnd = '';
    }

    if (!darazData.formData.storeAcctIdList) {
      ElMessage.warning('请选择店铺');
      return;
    }

    tableDataLoading.value = true;
    if (darazData.formData.cateName?.length > 0) {
      darazData.formData.cateIdList = [];
      darazData.formData.cateName.forEach((item) => {
        darazData.formData.cateIdList.push(item[item.length - 1]);
      });
    } else {
      darazData.formData.cateIdList = [];
    }

    const { data, code, count } = await queryDarazList({
      ...darazData.formData,
      storeAcctIdList:
        typeof darazData.formData.storeAcctIdList === 'number'
          ? [darazData.formData.storeAcctIdList]
          : darazData.formData.storeAcctIdList
    });
    if (code == '0000') {
      tableData.value = data?.map((item) => {
        item.displayCount = 3;
        item.published =
          item.prodListingSubSkuDarazDtoList &&
          item.prodListingSubSkuDarazDtoList.filter((c) => c.published == true);
        return item;
      });
    }
    tableDataLoading.value = false;
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
  const selectRecords = ref([]);
  // 获取复选框选中的数据
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
        const { code, data } = await createProd({
          prodPIdList: selectRecords.value?.map((item) => item.prodPId),
          storeAcctId: darazData.formData.storeAcctIdList
        });
        tableDataLoading.value = false;
        if (code === '0000') {
          ElMessage.success('生成店铺商品成功！');
          onSubmit();
        } else {
          let errMsg = data?.join('');
          ElMessageBox.alert(`<div>${errMsg}</div>`, '操作结果', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确认'
          });
        }
      } catch (err) {
        console.log(err);
        tableDataLoading.value = false;
      }
    }
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
        const { code, msg } = await deleteRecord(ids);
        if (code == '0000') {
          ElMessage.success(msg);
          onSubmit();
        }
      });
    }
  };

  const darazStoreAcctRef = ref();
  // 导出店铺商品
  const exportListing = () => {
    if (getSelectedList()) {
      try {
        let ids = selectRecords.value?.map((item) => item.id);
        transBlob({
          url: '/lms/darazListing/exportListingItems',
          contentType: 'application/json',
          data: {
            storeAcctId: darazData.formData.storeAcctIdList,
            listingIdList: ids
          },
          fileName:
            darazStoreAcctRef.value.query +
            '待刊登店铺商品' +
            Date.now() +
            '.xlsx'
        }).then(() => {
          ElMessage.success('导出成功');
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

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
    row.displayCount = row.prodListingSubSkuDarazDtoList.length;
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
      roleNames: 'daraz专员'
    };
    const { data } = await getDepartData(params);
    selectData.departData = data.orgTree;
    selectData.salersData = data.userList;
    salersDataCopy.value = data.userList;
  };
  // 获取店铺信息
  const getStoreList = async () => {
    let params = {
      roleNames: 'daraz专员',
      orgId: darazData.formData.orgId,
      salePersonId: darazData.formData.salePersonId,
      platCode: 'daraz'
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
    darazData.formData.storeAcctIdList = [];
    getStoreList();
  };
  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    darazData.formData.orgId = '';
    resetSearch();
  };
  // 清空销售人员以及店铺
  const resetSearch = () => {
    darazData.formData.salePersonId = '';
    darazData.formData.storeAcctIdList = '';
    getStoreList();
  };
  //  部门-销售员-店铺联动 -- end
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
</style>
<style>
  .sheinMallElMsg {
    --el-messagebox-width: 800px;
  }
</style>
