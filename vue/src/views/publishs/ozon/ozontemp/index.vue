<template>
  <!-- ozon 模板-->
  <div class="app-container">
    <el-card class="search_card">
      <el-form ref="formRef" :model="form" :inline="true" class="search_form">
        <el-form-item
          label="OA新类目"
          prop="cateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="form.cateName"
            :options="initFormData.oaList"
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
        <el-form-item prop="creatorType">
          <el-select
            v-model="form.creatorType"
            class="form_left"
            @change="changeUser"
          >
            <el-option value="1" label="开发专员" />
            <el-option value="2" label="责任人" />
            <el-option
              v-if="activeName == 'ozon模板'"
              value="3"
              label="模板创建人"
            />
            <el-option
              v-if="activeName == 'ozon模板'"
              value="4"
              label="模板编辑人"
            />
          </el-select>
          <el-select
            v-model="form.creatorIdList"
            class="form_right"
            placeholder="请选择"
            :class="form.creatorIdList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.creatorIdList.length > 1" type="info"
                >已选{{ form.creatorIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.creatorIdList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态" prop="prodIsSaleStatusList">
          <el-select
            v-model="form.prodIsSaleStatusList"
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
        <el-form-item>
          <el-select v-model="form.logisType" class="form_left">
            <el-option value="1" label="物流属性(与)" />
            <el-option value="2" label="物流属性(或)" />
          </el-select>
          <el-select
            v-model="form.logisAttrList"
            class="form_right"
            placeholder="请选择"
            :class="form.logisAttrList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.logisAttrList.length > 1" type="info"
                >已选{{ form.logisAttrList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.logisAttr"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开发类型" prop="devTypeList">
          <el-select
            v-model="form.devTypeList"
            placeholder="请选择"
            :class="form.devTypeList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.devTypeList.length > 1" type="info"
                >已选{{ form.devTypeList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.devTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="form.searchSkuType" class="form_left">
            <el-option value="1" label="父SKU(精确)" />
            <el-option value="2" label="子SKU(精确)" />
          </el-select>
          <el-input
            v-model="form.searchSku"
            class="form_right"
            placeholder="多个逗号隔开"
          />
        </el-form-item> -->
        <el-form-item prop="searchSku">
          <el-select v-model="form.skuType" class="form_left">
            <el-option :value="1" label="父SKU" />
            <el-option :value="2" label="子SKU" />
          </el-select>
          <el-input
            v-model="form.searchSku"
            placeholder="多个逗号隔开"
            style="width: 270px !important"
            class="form_left form_right"
          />
          <el-select v-model="form.skuSearchType" class="form_right WH80">
            <el-option :value="1" label="精确" />
            <el-option :value="2" label="模糊" />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item
          v-if="activeName == 'ozon模板'"
          label="平台类目"
          prop="ozoncateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="form.ozoncateName"
            :options="initFormData.ozonList"
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
          v-if="activeName == '基础模板'"
          prop="hasOzonModel"
          label="ozon模板"
          ><el-select v-model="form.hasOzonModel">
            <el-option value="false" label="未生成" />
            <el-option value="true" label="已生成" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-else prop="creatorId" label="创建人">
          <el-select v-model="form.creatorId" filterable>
            <el-option
              v-for="item in initFormData.creatorId"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            /> </el-select
        ></el-form-item> -->
        <el-form-item prop="tortBanListings" label="侵权状态"
          ><el-select
            v-model="form.tortBanListings"
            placeholder="请选择"
            clearable
          >
            <el-option label="所有平台不侵权" value="ANY_PLAT" />
            <el-option label="ozon不侵权" value="2" />
            <el-option label="ozon侵权" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式" prop="orderByTypes">
          <el-select v-model="form.orderByTypes">
            <el-option
              v-if="activeName == '基础模板'"
              value="1"
              label="基础模板创建时间"
            />
            <el-option value="3" label="基础模板审核时间" />
            <el-option
              v-if="activeName == 'ozon模板'"
              value="5"
              label="ozon模板创建时间"
            />
            <el-option value="7" label="全平台30天销量" />
            <el-option value="9" label="全平台15天销量" />
            <el-option value="11" label="全平台7天销量" />
            <el-option value="13" label="全平台俄罗斯30天销量" />
            <el-option value="15" label="全平台俄罗斯15天销量" />
            <el-option value="17" label="全平台俄罗斯7天销量" />
          </el-select>
        </el-form-item>
        <el-form-item prop="sortByType">
          <el-select v-model="form.sortByType" filterable>
            <el-option label="正序" value="1" />
            <el-option label="倒序" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签" prop="prodAttr">
          <el-select
            v-model="form.prodAttr"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in initFormData.prodAttrList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.timeType" class="form_left">
            <el-option value="1" label="创建时间" />
            <el-option
              v-if="activeName == '基础模板'"
              value="2"
              label="审核时间"
            />
          </el-select>
          <el-date-picker
            v-model="form.time"
            style="width: 200px !important"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item
          v-if="activeName == '基础模板'"
          prop="preStockType"
          class="form_range"
        >
          <el-select
            v-model="form.preStockType"
            placeholder="请选择"
            clearable
            filterable
            class="form_left"
          >
            <el-option label="预计可用含在途" value="1"></el-option>
            <el-option label="预计可用不含在途" value="2"></el-option>
          </el-select>
          <el-input v-model="form.preStockMin" clearable></el-input>
          <div class="range_link">-</div>
          <el-input v-model="form.preStockMax" clearable></el-input>
        </el-form-item>
        <el-form-item prop="cnTitle" label="商品名">
          <el-input v-model="form.cnTitle" placeholder="模糊查询" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="false" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="name in tabsName"
          :key="name"
          :label="name"
          :name="name"
        >
          <!-- :scroll-y="{ gt: 10 }" -->
          <vxe-table
            ref="tableDataRef"
            v-loading="tableDataLoading"
            :data="tableData"
            :height="height"
            :column-config="{ resizable: true }"
            border
            @resizable-change="resizableChange"
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="图片" width="130">
              <template #default="{ row }">
                <ImagePop :src="row.image || ''" />
              </template>
            </vxe-column>
            <vxe-column
              field="title"
              title="英文标题/商品名"
              :width="OZON_TEMP['title'] || 230"
            >
              <template #default="{ row }">
                <TooltipText
                  :text="row.title"
                  :init-tool-field="initTool.title"
                />
                <TooltipText
                  :text="row.productName"
                  :init-tool-field="initTool.title"
                />
              </template>
            </vxe-column>
            <!-- <vxe-column field="productName" title="商品名" /> -->
            <vxe-column field="bizzOwner" title="业绩归属人" width="120">
              <template #default="{ row }">
                <div>开发：{{ row.performanceOwner }}</div>
                <div>责任：{{ row.responsor }}</div>
              </template>
            </vxe-column>
            <vxe-column field="parentSku" title="父SKU" width="100" />
            <vxe-column width="450">
              <template #header>
                <div style="display: flex; justify-content: space-around">
                  <div>子SKU</div>
                  <div>颜色</div>
                  <div>尺寸</div>
                  <div>款式</div>
                  <div>在售</div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  v-if="row.childrenList && row.childrenList.length != 0"
                  :data="
                    row.childrenList
                      ? row.childrenList.slice(0, row.displayCount)
                      : []
                  "
                  :show-header="false"
                >
                  <vxe-column field="childSku" width="120" />
                  <vxe-column field="color" />
                  <vxe-column field="size" />
                  <vxe-column field="style" />
                  <vxe-column width="50"
                    ><template #default="{ row: sonRow }">{{
                      sonRow.onSale ? '是' : '否'
                    }}</template>
                  </vxe-column>
                </vxe-table>
                <div
                  v-if="row.childrenList && row.childrenList.length != 0"
                  :class="[row.childrenList.length <= 3 ? 'hideBtn' : '']"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >
            <vxe-column
              v-if="activeName == 'ozon模板'"
              field="fullCateName"
              title="ozon类目"
              width="140"
            />
            <vxe-column
              v-if="activeName == '基础模板'"
              title="是否已有ozon模板"
              min-width="70"
            >
              <template #default="{ row }">
                {{ row.ozonModelId ? '是' : '否' }}
              </template></vxe-column
            >
            <vxe-column field="sale7" title="销量7/15/30" width="120">
              <template #default="{ row }">
                俄罗斯：{{ row.russiaSale7 }}/{{ row.russiaSale15 }}/{{
                  row.russiaSale30
                }}<br />
                公司：{{ row.sale7 }}/{{ row.sale15 }}/{{ row.sale30 }}
              </template>
            </vxe-column>
            <vxe-column field="listingStoreNum" title="刊登店铺数" width="70" />
            <vxe-column field="isListingAble" title="侵权状态" width="80">
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
              :min-width="activeName == 'ozon模板' ? 210 : 190"
            >
              <template #default="{ row }">
                <div v-if="activeName == '基础模板'">
                  创建：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}<br />
                  审核：{{
                    row.auditTime
                      ? parseTime(row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                </div>
                <div v-else>
                  模板创建：{{
                    row.modelCreateTime
                      ? parseTime(
                          row.modelCreateTime,
                          '{y}-{m}-{d} {h}:{i}:{s}'
                        )
                      : ''
                  }}
                  <span>{{ row.creator }}</span
                  ><br />
                  模板更新：{{
                    row.modelModifyTime
                      ? parseTime(
                          row.modelModifyTime,
                          '{y}-{m}-{d} {h}:{i}:{s}'
                        )
                      : ''
                  }}
                  <span>{{ row.modifyer }}</span>
                </div>
              </template></vxe-column
            >
            <vxe-column
              title="操作"
              :width="activeName == 'ozon模板' ? 90 : 150"
            >
              <template #default="{ row }">
                <el-button
                  v-if="activeName == '基础模板'"
                  type="primary"
                  @click="handleEditDialogOpen(row, 'add')"
                  >新建ozon模板</el-button
                >
                <el-button
                  v-if="activeName == 'ozon模板'"
                  type="primary"
                  @click="handleEditDialogOpen(row, 'edit')"
                  >修改</el-button
                >
                <el-popconfirm
                  v-if="activeName == 'ozon模板'"
                  title="确定删除这条模板数据?"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  @confirm="confirmEvent(row)"
                >
                  <template #reference>
                    <el-button v-if="activeName == 'ozon模板'" type="danger"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </template>
            </vxe-column>
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
      <div class="tools_btn">
        <el-button
          v-if="activeName == 'ozon模板' && aa"
          type="primary"
          @click="noPlatformCategoryDel"
          >删除无平台类目模板</el-button
        ><el-button
          v-if="activeName == 'ozon模板'"
          v-permission="['ozontempBathDelBtn']"
          type="danger"
          @click="batchDel"
          >批量删除</el-button
        >
      </div>
    </el-card>
    <EditDialog
      v-if="showEditDialog"
      :title="handleEditDialogType"
      :show-dialog="showEditDialog"
      :form-data="dialogFormVisible"
      @close-dialog="handelEditDialogClose($event)"
    />
  </div>
</template>
<script setup name="publishsozonozontemp">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import {
    shortcuts,
    queryOaNewCategory,
    editOrAddProdProhibitMapping,
    getPlatCategoryTreeApi
  } from '@/api/common';
  import EditDialog from './components/EditDialog.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import TooltipText from '@/components/TooltipText.vue';
  import {
    getOzonModelList,
    listuserbyrole,
    getPreProdDevTypeEnum,
    // getModelCreatorList,
    listdict,
    getLogisAttrEnum,
    getAllColumnByPId,
    queryForEdit,
    // batchDelMercadoModel,
    // geNoPlatCatetModel,
    getOzonModelOperator,
    deleteOzonModelListing
  } from '@/api/publishs/ozontemp';

  const form = reactive({
    cateName: '', // 产品类目名
    cateOaId: '', // 产品类目id
    ozoncateName: '',
    platCateIdList: [],
    cateOaIdList: [],
    creatorType: '1',
    creatorIdList: [], //  专员:多选
    creatorId: '', // 创建人
    prodIsSaleStatusList: [], //  商品状态
    prodAttr: '', //  商品标签
    logisAttrList: [], //  物流属性:多选
    logisType: '1',
    devTypeList: [], //  开发类型:多选
    timeType: '1', //  创建时间|审核时间
    time: [], //  时间
    startTime: '',
    endTime: '',
    hasOzonModel: 'false', //  ozon模板
    tortBanListings: '2', //  侵权状态
    orderByTypes: '13', //  排序方式
    sortByType: '0',
    // searchSkuType: '1',
    skuType: 1,
    skuSearchType: 1,
    searchSku: '',
    preStockType: '1',
    preStockMin: '',
    preStockMax: ''
  });

  // 初始化查询条件
  const initFormData = reactive({
    oaList: [], // oa类目
    // ozonList: [], // ozon类目
    creatorIdList: [], //  专员:多选
    creatorId: [], // 创建人
    prodAttrList: [], //  商品标签
    logisAttr: [], //  物流属性:多选
    devTypeList: [] //  开发类型:多选
  });
  // 查询条件表单ref
  const formRef = ref();
  // 查询条件表单清空
  const resetForm = function () {
    formRef.value.resetFields();
    form.logisType = '1';
    form.logisAttrList = [];
    form.timeType = '1';
    form.time = '';
    // form.searchSkuType = '1';
    form.skuType = 1;
    form.skuSearchType = 1;
    form.searchSku = '';
    form.cateOaIdList = [];
    form.cateName = [];
    form.platCateIdList = [];
    form.ozoncateName = [];
    form.preStockMin = '';
    form.preStockMax = '';
  };
  // 查询条件提交查询
  const onSubmit = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    form.page = currentPage.value;
    form.limit = pageSize.value;
    form.startTime = form.endTime = '';
    if (form.time && form.time.length != 0) {
      form.startTime = form.time[0] + ' 00:00:00';
      form.endTime = form.time[1] + ' 23:59:59';
    }
    if (activeName.value == '基础模板') {
      form.ozoncateName = [];
      form.type = 1;
    } else {
      form.type = 2;
    }
    if (form.cateName.length && form.cateName.length != 0) {
      form.cateOaIdList = [];
      form.cateName?.forEach((item) => {
        form.cateOaIdList.push(item[item.length - 1]);
      });
    } else {
      form.cateOaIdList = [];
    }
    if (form.ozoncateName.length && form.ozoncateName.length != 0) {
      form.platCateIdList = [];
      form.ozoncateName?.forEach((item) => {
        form.platCateIdList.push(item[item.length - 1]);
      });
    } else {
      form.platCateIdList = [];
    }
    if (form.searchSku) {
      // 1父SKU(精确),2子SKU(精确),3父sku模糊,4子ku模糊
      if (form.skuType == 1 && form.skuSearchType == 1) {
        form.searchSkuType = 1;
      } else if (form.skuType == 2 && form.skuSearchType == 1) {
        form.searchSkuType = 2;
      } else if (form.skuType == 1 && form.skuSearchType == 2) {
        form.searchSkuType = 3;
      } else if (form.skuType == 2 && form.skuSearchType == 2) {
        form.searchSkuType = 4;
      }
    }
    // 侵权状态，选择ozon侵权/不侵权，使用tortPlat字段，选择所有平台不侵权，使用tortBanListing
    let tortPlat = '',
      tortBanListing = '';
    if (form.tortBanListings == 1 || form.tortBanListings == 2) {
      tortPlat = form.tortBanListings;
    } else {
      tortBanListing = form.tortBanListings;
    }

    let { data, code, count } = await getOzonModelList({
      ...form,
      orderByType: form.orderByTypes * 1 + form.sortByType * 1,
      tortPlat,
      tortBanListing,
      skuList: form.searchSku ? form.searchSku.split(',') : [],
      prodAttrList: form.prodAttr ? [form.prodAttr] : []
    });
    code == '0000' && count == 0
      ? (tableData.value = [])
      : (tableData.value = data.map((item) => {
          item.displayCount = 3;
          return item;
        }));
    total.value = count;
    tableDataLoading.value = false;
  };

  // 是否禁售
  const isListingAbleFunc = async (e, row) => {
    try {
      let { code } = await editOrAddProdProhibitMapping({
        prodPId: row.pInfoId,
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

  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 查看全部时，将所有都给到
  const viewAll = (row) => {
    row.displayCount = row.childrenList.length;
  };
  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };
  let tabsName = ref(['基础模板', 'ozon模板']);
  const activeName = ref('基础模板');
  const handleClick = (tab) => {
    if (tab.paneName == 'ozon模板') {
      form.preStockMin = '';
      form.preStockMax = '';
    }
    if (tab.paneName != activeName.value) {
      form.creatorType = '1';
      form.creatorIdList = [];
    }
    tableDataLoading.value = true;
    activeName.value = tab.paneName;
    currentPage.value = 1;
    onSubmit();
  };
  //   ozon模板弹窗
  const dialogFormVisible = ref({
    prodPId: '',
    pSku: '',
    cateTreeName: '',
    categoryId: '',
    prodDesc: '',
    fixDesc: '',
    fullCateName: '',
    normalAttrList: [],
    salePropAttrList: [],
    skuInfoList: []
  });
  //  ozon模板--删除
  const confirmEvent = async (row) => {
    const { code } = await deleteOzonModelListing([row.id]);
    if (code == '0000') {
      tableData.value = tableData.value.filter((item) => item.id != row.id);
      ElMessage.success('删除成功');
    }
  };
  // 新增&编辑组件 start
  const showEditDialog = ref(false);
  const handleEditDialogType = ref();
  const handelEditDialogClose = (e) => {
    showEditDialog.value = e.isShow;
  };
  const dialogType = ref();
  //  新建&编辑ozon模板--回显
  const handleEditDialogOpen = async (row, type) => {
    dialogType.value = type;
    const { data } = await getAllColumnByPId(
      type == 'edit' ? row.pInfoId : row.id
    );
    let tempData = data;
    let editData = null;
    let pmodelAttrList = {};
    tempData.ozonModelDetailDto?.normalAttrList?.forEach((item) => {
      if (item.dictionaryId != 0 && item.isCollection == true) {
        item['value'] = item.defaultValue?.split(';');
      } else {
        item['value'] = item.defaultValue;
      }
    });
    // tempData.ozonModelDetailDto?.skuInfoList?.forEach((item) => {
    //   item.skuAttrList?.forEach((c) => (item[c.attrId] = c.value));
    //   item.salePropAttrList?.forEach((c) => {
    //     // 如果没有value值，不显示name，name置空，如果有value值，赋值value
    //     !item[c.attrId] ? (c.attrName = '') : (c['value'] = item[c.attrId]);
    //   });
    // });
    if (type == 'edit') {
      const { data } = await queryForEdit(row.id);
      editData = data;
      editData.pmodelAttrList?.forEach(
        (c) => (pmodelAttrList[c.attrId] = c.value)
      );
      editData.normalAttrList?.forEach((item) => {
        if (pmodelAttrList[item.attrId]) {
          if (item.dictionaryId != 0 && item.isCollection == true) {
            item['value'] = pmodelAttrList[item.attrId].split(';');
          } else {
            item['value'] = pmodelAttrList[item.attrId];
          }
        }
      });
      editData.skuInfoList.forEach((item) => {
        item.skuAttrList?.forEach((c) => (item[c.attrId] = c.value));
        item.salePropAttrList?.forEach((c) => {
          // 如果没有value值，不显示name，name置空，如果有value值，赋值value
          !item[c.attrId] ? (c.attrName = '') : (c['value'] = item[c.attrId]);
        });
      });
      dialogFormVisible.value = {
        id: row.id,
        prodPId: row.pInfoId,
        attrInfo: tempData.ozonModelDetailDto,
        pSku: tempData.pSku,
        cateTreeName: tempData.cateTreeName,
        attrKeyOa: editData.attrKeyOa,
        must: editData.must,
        prodDesc: editData.prodDesc ? editData.prodDesc : tempData.prodDesc,
        fixDesc: editData.fixDesc ? editData.fixDesc : tempData.fixDesc,
        description: editData.description
          ? editData.description
          : tempData.description,
        normalAttrList: editData.normalAttrList
          .filter((item) => item.required == true)
          .concat(
            editData.normalAttrList.filter((item) => item.required != true)
          ),
        salePropAttrList: editData.salePropAttrList,
        skuInfoList: editData.skuInfoList,
        fullCateName: editData.fullCateName,
        categoryId: editData.categoryId
      };
    } else {
      dialogFormVisible.value = {
        prodPId: row.id,
        pSku: tempData.pSku,
        // attrInfo: tempData.ozonModelDetailDto,
        cateTreeName: tempData.cateTreeName, // oa新类目
        // must: tempData.ozonModelDetailDto && tempData.ozonModelDetailDto.must,
        prodDesc: tempData.prodDesc,
        fixDesc: tempData.fixDesc,
        description: tempData.description,
        normalAttrList:
          tempData.ozonModelDetailDto &&
          tempData.ozonModelDetailDto?.normalAttrList
            ? tempData.ozonModelDetailDto?.normalAttrList
                .filter((item) => item.isRequired == true)
                .concat(
                  tempData.ozonModelDetailDto?.normalAttrList.filter(
                    (item) => item.isRequired != true
                  )
                )
            : [],
        salePropAttrList:
          tempData.ozonModelDetailDto &&
          tempData.ozonModelDetailDto?.salePropAttrList
            ? tempData.ozonModelDetailDto?.salePropAttrList
            : [],
        skuInfoList:
          tempData.ozonModelDetailDto &&
          tempData.ozonModelDetailDto?.skuInfoList
            ? tempData.ozonModelDetailDto?.skuInfoList
            : [],
        fullCateName: tempData.ozonCateTreeName, // ozon类目
        categoryId: tempData.cateId // ozon类目id
      };
    }
    handleEditDialogType.value = type;
    showEditDialog.value = true;
  };

  let OZON_TEMP = {};
  // 新增&编辑组件 end
  onMounted(async () => {
    OZON_TEMP = JSON.parse(localStorage.getItem('OZON_TEMP')) || {};
    let form1 = new FormData();
    form1.append('headCode', 'prod_tag');
    let form2 = new FormData();
    form2.append('role', '开发专员');
    Promise.all([
      listdict(form1),
      getLogisAttrEnum(),
      getPreProdDevTypeEnum(),
      // getModelCreatorList(),
      listuserbyrole(form2),
      queryOaNewCategory(),
      getPlatCategoryTreeApi('ozon'),
      getOzonModelOperator(1),
      getOzonModelOperator(2)
    ])
      .then((res) => {
        // 商品标签
        initFormData.prodAttrList = res[0].data.map((item) => item.name);
        //物流属性
        initFormData.logisAttr = res[1].data.map((item) => item.name);
        //开发类型
        initFormData.devTypeList = res[2].data.map((item) => item.name);
        // //创建人
        // initFormData.creatorId = res[3].data.map((item) => ({
        //   value: item.creatorId,
        //   label: item.creator
        // }));
        //开发专员 // 责任人？？
        initFormData.user1 = res[3].data;
        initFormData.creatorIdList = initFormData.user1;

        //OA新类目
        initFormData.oaList = JSON.parse(res[4].data);
        // ozon类目
        initFormData.ozonList = res[5].data;
        initFormData.user2 = res[6].data; // 创建人
        initFormData.user3 = res[7].data; // 编辑人
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
    // .finally(() => {});
  });

  let changeUser = () => {
    initFormData.creatorIdList = [];
    if (form.creatorType == 3) {
      // 模板创建人
      initFormData.creatorIdList = initFormData.user2;
    } else if (form.creatorType == 4) {
      initFormData.creatorIdList = initFormData.user3;
    } else {
      initFormData.creatorIdList = initFormData.user1;
    }
  };

  let tableDataRef = ref();
  // 批量删除
  const batchDel = async () => {
    const checkedData = tableDataRef.value[1].getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    ElMessageBox.confirm(`是否确认将选中的模板全部删除？`, '注意', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { code } = await deleteOzonModelListing(ids);
      if (code == '0000') {
        ElMessage.success('删除成功');
        onSubmit();
      }
    });
  };
  // // 删除无平台类目模板
  // const noPlatformCategoryDel = async () => {
  //   const { code, count, data } = await geNoPlatCatetModel();
  //   if (code == '0000') {
  //     ElMessageBox.alert(
  //       `无平台类目模板数量共计${count}个，请确认是否全部删除？`,
  //       '查询结果',
  //       {
  //         dangerouslyUseHTMLString: true,
  //         confirmButtonText: '确认'
  //       }
  //     ).then(async () => {
  //       const { code } = await batchDelMercadoModel(data.join(','));
  //       if (code == '0000') {
  //         ElMessage.success('删除成功');
  //         onSubmit();
  //       }
  //     });
  //   }
  // };
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 300;
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
  // 分页处理
  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);
  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    onSubmit();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit();
  };

  const initTool = ref({});
  function resizableChange({ column }) {
    if (column.resizeWidth < column.width) {
      initTool.value[column.field] = true;
    } else {
      initTool.value[column.field] = false;
    }
    OZON_TEMP[column.field] = column.resizeWidth;
    localStorage.setItem('OZON_TEMP', JSON.stringify(OZON_TEMP));
  }
</script>
<style scoped lang="scss">
  .mt-10 {
    margin-top: 10px;
  }
  // 查询条件--所有平台不侵权--展示完整
  :deep(.el-select__tags-text) {
    max-width: 120px !important;
  }
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
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
