<template>
  <!-- mercado 模板-->
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
        <el-form-item
          v-if="activeName == '美客多模板'"
          label="平台类目"
          prop="mercateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="form.mercateName"
            :options="initFormData.merList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'name',
              value: 'categoryId',
              children: 'childList'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="开发专员" prop="bizzOwnerIdList">
          <el-select
            v-model="form.bizzOwnerIdList"
            placeholder="请选择"
            :class="form.bizzOwnerIdList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.bizzOwnerIdList.length > 1" type="info"
                >已选{{ form.bizzOwnerIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.bizzOwnerIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态" prop="isSaleList">
          <el-select
            v-model="form.isSaleList"
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
          <el-select v-model="form.logisAttrRelation" class="form_left">
            <el-option value="and" label="物流属性(与)" />
            <el-option value="or" label="物流属性(或)" />
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
        <el-form-item>
          <el-select v-model="form.timeType" class="form_left">
            <el-option value="createTime" label="创建时间" />
            <el-option
              v-if="activeName == '基础模板'"
              value="auditTime"
              label="审核时间"
            />
            <el-option
              v-if="activeName == '美客多模板'"
              value="updateTime"
              label="更新时间"
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
        <br />
        <el-form-item
          v-if="activeName == '基础模板'"
          prop="haveMercadoModel"
          label="美客多模板"
          ><el-select v-model="form.haveMercadoModel">
            <el-option value="false" label="未生成" />
            <el-option value="true" label="已生成" />
            <el-option value="" label="全部" />
          </el-select> </el-form-item
        ><el-form-item v-else prop="creatorId" label="创建人">
          <el-select v-model="form.creatorId" filterable>
            <el-option
              v-for="item in initFormData.creatorId"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            /> </el-select
        ></el-form-item>
        <el-form-item prop="orderByType" label="排序方式"
          ><el-select v-model="form.orderByType">
            <el-option
              v-if="activeName == '美客多模板'"
              value="1"
              label="美客多模板创建时间降序"
            />
            <el-option
              v-if="activeName == '美客多模板'"
              value="2"
              label="美客多模板创建时间升序"
            />
            <el-option
              v-if="activeName == '基础模板'"
              value="1"
              label="基础模板创建时间降序"
            />
            <el-option
              v-if="activeName == '基础模板'"
              value="2"
              label="基础模板创建时间升序"
            />
            <el-option value="3" label="基础模板审核时间降序" />
            <el-option value="4" label="基础模板审核时间升序" />
            <el-option value="5" label="7天销量倒序" />
            <el-option value="6" label="15天销量倒序" />
            <el-option value="7" label="30天销量倒序" />
            <el-option
              v-if="activeName == '美客多模板'"
              value="8"
              label="更新时间倒序"
            />
            <el-option
              v-if="activeName == '美客多模板'"
              value="9"
              label="更新时间正序"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签" prop="prodAttrList">
          <el-select
            v-model="form.prodAttrList"
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
          <el-select v-model="form.searchSKUType" class="form_left">
            <el-option value="pSku" label="父SKU" />
            <el-option value="sSku" label="子SKU" />
            <el-option value="pSku2" label="父SKU(精确)" />
            <el-option value="sSku2" label="子SKU(精确)" />
          </el-select>
          <el-input
            v-model="form.searchSKUValue"
            class="form_right"
            placeholder="多个逗号隔开"
          />
        </el-form-item>
        <el-form-item prop="tortPlatMer" label="侵权状态"
          ><el-select
            v-model="form.tortPlatMer"
            class="tortPlatMer"
            placeholder="请选择"
            :class="form.tortPlatMer.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.tortPlatMer.length > 1" type="info"
                >已选{{ form.tortPlatMer.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="(item, index) in initFormData.tortPlatMer"
              :key="item"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName != '基础模板'"
          prop="isComplete"
          label="变种属性状态"
          ><el-select v-model="form.isComplete" clearable>
            <el-option value="1" label="完整" />
            <el-option value="0" label="不完整" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item prop="multiSub" label="商品类型"
          ><el-select v-model="form.multiSub" clearable>
            <el-option value="" label="全部" />
            <el-option :value="false" label="单属性" />
            <el-option :value="true" label="多属性" />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item prop="enTitle" label="英文标题"
          ><el-input v-model="form.enTitle" placeholder="模糊查询" />
        </el-form-item>
        <el-form-item
          v-if="activeName == '基础模板'"
          prop="priceMin"
          label="成本"
          class="form_range"
        >
          <el-input
            v-model="form.priceMin"
            placeholder="￥"
            clearable
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="form.priceMax"
            placeholder="￥"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="activeName == '基础模板'"
          prop="weightMin"
          label="重量(g)"
          class="form_range"
        >
          <el-input v-model="form.weightMin" clearable></el-input>
          <div class="range_link">-</div>
          <el-input v-model="form.weightMax" clearable></el-input>
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
          <vxe-table
            ref="tableDataRef"
            v-loading="tableDataLoading"
            :scroll-y="{ gt: 10 }"
            :data="tableData"
            :height="height"
            :align="'center'"
            border
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="图片" width="130">
              <template #default="{ row }">
                <ImagePop :src="row.pImg || ''" />
              </template>
            </vxe-column>
            <vxe-column field="enTitle" title="英文标题" />
            <vxe-column field="cnTitle" title="商品名" />
            <vxe-column field="bizzOwner" title="开发专员" width="90" />
            <vxe-column field="pSku" title="父SKU" width="90" />
            <vxe-column width="490">
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
                  v-if="row.varients && row.varients.length != 0"
                  :data="
                    row.varients ? row.varients.slice(0, row.displayCount) : []
                  "
                  :show-header="false"
                >
                  <vxe-column field="sSku" width="120" />
                  <vxe-column field="color" />
                  <vxe-column field="size" />
                  <vxe-column field="style" />
                  <vxe-column width="50"
                    ><template #default="{ row: sonRow }">{{
                      sonRow.isSale ? '是' : '否'
                    }}</template>
                  </vxe-column>
                </vxe-table>
                <div
                  v-if="row.varients && row.varients.length != 0"
                  :class="[row.varients.length <= 3 ? 'hideBtn' : '']"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >
            <vxe-column
              v-if="activeName == '美客多模板'"
              field="fullCateName"
              title="美客多类目"
              width="140"
            />
            <vxe-column
              v-if="activeName == '美客多模板'"
              field="creator"
              title="创建人"
              width="70"
            />
            <vxe-column
              v-if="activeName == '基础模板'"
              title="已有美客多模板"
              width="120"
            >
              <template #default="{ row }">
                {{
                  row.varients && row.varients[0].haveMercadoModel ? '是' : '否'
                }}
              </template></vxe-column
            >
            <vxe-column title="时间" width="150">
              <template #default="{ row }">
                <div>
                  创建：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d}')
                      : ''
                  }}
                </div>
                <div v-if="activeName == '基础模板'">
                  审核：{{
                    row.auditTime ? parseTime(row.auditTime, '{y}-{m}-{d}') : ''
                  }}
                </div>
                <div v-else>
                  更新：{{
                    row.modifyTime
                      ? parseTime(row.modifyTime, '{y}-{m}-{d}')
                      : ''
                  }}
                </div>
              </template></vxe-column
            >
            <vxe-column title="操作" width="150">
              <template #default="{ row }">
                <el-button
                  v-if="activeName == '基础模板'"
                  type="primary"
                  @click="handleEditDialogOpen(row, 'add')"
                  >新建美客多模板</el-button
                >
                <el-button
                  v-if="activeName == '美客多模板'"
                  type="primary"
                  @click="handleEditDialogOpen(row, 'edit')"
                  >修改</el-button
                >
                <el-popconfirm
                  v-if="activeName == '美客多模板'"
                  title="确定删除这条模板数据?"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  @confirm="confirmEvent(row)"
                >
                  <template #reference>
                    <el-button v-if="activeName == '美客多模板'" type="danger"
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
          v-if="activeName == '美客多模板'"
          v-permission="['mercadotempBathDelBtn']"
          type="primary"
          @click="noPlatformCategoryDel"
          >删除无平台类目模板</el-button
        ><el-button
          v-if="activeName == '美客多模板'"
          v-permission="['mercadotempBathDelBtn']"
          type="primary"
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
      @handle-cate-dialog-open="
        handleCateDialogOpen('mercado', dialogFormVisible.prodPId)
      "
    />
    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :handle-cate-dialog-type="handleCateDialogType"
      :prod-p-id="prodPId"
      @close-dialog="handleCateDialogClose($event)"
    />
  </div>
</template>
<script setup name="publishsmercadomercadotemp">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { shortcuts, queryOaNewCategory, getCateTree } from '@/api/common';
  import CateDialog from '@/components/CateDialog.vue';
  import EditDialog from './components/EditDialog.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    listuserbyrole,
    getPreProdDevTypeEnum,
    getModelCreatorList,
    listdict,
    getLogisAttrEnum,
    getMercadoBaseModelList,
    getMercadoModelList,
    getAllColumnByPId,
    queryForEdit,
    batchDelMercadoModel,
    geNoPlatCatetModel,
    delMercadoModel
  } from '@/api/publishs/mercadotemp';

  const form = reactive({
    cateName: '', // 产品类目名
    cateOaId: '', // 产品类目id
    mercateName: '',
    mercadoCateIdList: [],
    cateOaIdList: [],
    bizzOwnerIdList: [], //  开发专员:多选
    creatorId: '', // 创建人
    isSaleList: [], //  商品状态
    prodAttrList: '', //  商品标签
    logisAttrList: [], //  物流属性:多选
    logisAttrRelation: 'and',
    devTypeList: [], //  开发类型:多选
    timeType: 'createTime', //  创建时间|审核时间
    time: [], //  时间
    startTime: '',
    endTime: '',
    haveMercadoModel: 'false', //  美客多模板
    tortPlatMer: [14], //  侵权状态:多选
    tortPlat: '',
    orderByType: '1', //  排序方式
    searchSKUType: 'pSku',
    searchSKUValue: '',
    multiSub: '',
    enTitle: '',
    priceMin: '',
    priceMax: '',
    weightMin: '',
    weightMax: '',
    preStockType: '1',
    preStockMin: '',
    preStockMax: '',
    isComplete: '1' // 变种属性状态
  });

  // 初始化查询条件
  const initFormData = reactive({
    oaList: [], // oa类目
    merList: [], // 美客多类目
    bizzOwnerIdList: [], //  开发专员:多选
    creatorId: [], // 创建人
    prodAttrList: [], //  商品标签
    logisAttr: [], //  物流属性:多选
    devTypeList: [], //  开发类型:多选
    tortPlatMer: [
      'wish侵权',
      'wish不侵权',
      'ebay侵权',
      'ebay不侵权',
      'smt侵权',
      'smt不侵权',
      'joom侵权',
      'joom不侵权',
      'amazon侵权',
      'amazon不侵权',
      'shopee侵权',
      'shopee不侵权',
      'lazada侵权',
      'lazada不侵权',
      '所有平台不侵权'
    ] //  侵权状态:多选
  });
  // 查询条件表单ref
  const formRef = ref();
  // 查询条件表单清空
  const resetForm = function () {
    formRef.value.resetFields();
    form.logisAttrRelation = 'and';
    form.logisAttrList = [];
    form.timeType = 'createTime';
    form.time = '';
    form.searchSKUType = 'pSku';
    form.searchSKUValue = '';
    form.cateOaIdList = [];
    form.cateName = [];
    form.mercadoCateIdList = [];
    form.mercateName = [];
    form.priceMax = '';
    form.weightMax = '';
    form.preStockMin = '';
    form.preStockMax = '';
  };
  // 查询条件提交查询
  const onSubmit = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    form.page = currentPage.value;
    form.limit = pageSize.value;
    form.tortPlat = form.tortPlatMer.join(',');
    form.startTime = form.endTime = '';
    if (form.time && form.time.length != 0) {
      form.startTime = form.time[0] + ' 00:00:00';
      form.endTime = form.time[1] + ' 23:59:59';
    }
    if (activeName.value == '基础模板') {
      form.isComplete = '';
      form.mercateName = [];
    }
    if (form.cateName.length && form.cateName.length != 0) {
      form.cateOaIdList = [];
      form.cateName.forEach((item) => {
        form.cateOaIdList.push(item[item.length - 1]);
      });
    } else {
      form.cateOaIdList = [];
    }
    if (form.mercateName.length && form.mercateName.length != 0) {
      form.mercadoCateIdList = [];
      form.mercateName.forEach((item) => {
        form.mercadoCateIdList.push(item[item.length - 1]);
      });
    } else {
      form.mercadoCateIdList = [];
    }

    let data;
    activeName.value == '基础模板'
      ? (data = await getMercadoBaseModelList(form))
      : (data = await getMercadoModelList(form));
    data.code == '0000' && data.count == 0
      ? (tableData.value = [])
      : (tableData.value = data.data.map((item) => {
          item.displayCount = 3;
          return item;
        }));
    total.value = data.count;
    tableDataLoading.value = false;
  };
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 查看全部时，将所有都给到
  const viewAll = (row) => {
    row.displayCount = row.varients.length;
  };
  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };
  let tabsName = ref(['基础模板', '美客多模板']);
  const activeName = ref('基础模板');
  const handleClick = (tab) => {
    if (activeName.value != tab.paneName && tab.paneName == '美客多模板') {
      form.isComplete = '1';
    }
    if (tab.paneName == '美客多模板') {
      form.priceMin = '';
      form.priceMax = '';
      form.weightMin = '';
      form.weightMax = '';
      form.preStockMin = '';
      form.preStockMax = '';
    }
    tableDataLoading.value = true;
    activeName.value = tab.paneName;
    currentPage.value = 1;
    onSubmit();
  };
  //   美客多模板弹窗
  const dialogFormVisible = ref({
    id: '',
    prodPId: '',
    pSku: '',
    cateTreeName: '',
    categoryId: '',
    prodDesc: '',
    fixDesc: '',
    warrantyTimeVal: '30',
    warrantyTime: 'days',
    WARRANTY_TIME: '',
    WARRANTY_TYPE: '2230280',
    fullCateName: '',
    normalAttrList: [],
    salePropAttrList: [],
    skuInfoList: []
  });
  const pModelAttrList = ref([]);
  //  美客多模板--删除
  const confirmEvent = async (row) => {
    const { code } = await delMercadoModel(row.id);
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
  //  新建&编辑美客多模板--回显
  const handleEditDialogOpen = async (row, type) => {
    dialogType.value = type;
    const { data } = await getAllColumnByPId(row.varients?.[0]?.prodPId);
    let tempData = data;
    let editData = null;
    pModelAttrList.value = [];
    if (type == 'edit') {
      const { data } = await queryForEdit(row.id);
      editData = data;
      editData.pModelAttrList.forEach((item) => {
        pModelAttrList.value[item.attrId] = item.value;
        // 拆分保修信息
        if (item.attrId == 'WARRANTY_TIME' || item.attrId == 'WARRANTY_TYPE') {
          editData[item.attrId] = item.value;
        }
      });
      editData.normalAttrList.forEach((item) => {
        item.valueType == 'number' &&
        pModelAttrList.value[item.attrId] == undefined
          ? (item.defaultValue = undefined)
          : (item.defaultValue = pModelAttrList.value[item.attrId] || '');
      });
      dialogFormVisible.value = {
        id: row.id,
        prodPId: row.prodPId,
        pSku: tempData.pSku,
        cateTreeName: tempData.cateTreeName,
        multiSub: editData.multiSub,
        must: editData.must,
        prodDesc: editData.prodDesc ? editData.prodDesc : tempData.prodDesc,
        fixDesc: editData.fixDesc ? editData.fixDesc : tempData.fixDesc,
        warrantyTimeVal: editData.WARRANTY_TIME
          ? editData.WARRANTY_TIME.split(' ')[0]
          : '30',
        warrantyTime: editData.WARRANTY_TIME
          ? editData.WARRANTY_TIME.split(' ')[1]
          : 'days',
        WARRANTY_TIME: editData.WARRANTY_TIME || '',
        WARRANTY_TYPE: editData.WARRANTY_TYPE || '2230280',
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
        id: row.id,
        prodPId: row.prodPId,
        pSku: tempData.pSku,
        cateTreeName: tempData.cateTreeName,
        multiSub:
          tempData.mercadoModelDetail && tempData.mercadoModelDetail.multiSub,
        must: tempData.mercadoModelDetail && tempData.mercadoModelDetail.must,
        prodDesc: tempData.prodDesc,
        fixDesc: tempData.fixDesc,
        warrantyTimeVal: '30',
        warrantyTime: 'days',
        WARRANTY_TIME: '',
        WARRANTY_TYPE: '2230280',
        normalAttrList:
          tempData.mercadoModelDetail &&
          tempData.mercadoModelDetail.normalAttrList
            ? tempData.mercadoModelDetail.normalAttrList
                .filter((item) => item.required == true)
                .concat(
                  tempData.mercadoModelDetail.normalAttrList.filter(
                    (item) => item.required != true
                  )
                )
            : [],
        salePropAttrList:
          tempData.mercadoModelDetail &&
          tempData.mercadoModelDetail.salePropAttrList
            ? tempData.mercadoModelDetail.salePropAttrList
            : [],
        skuInfoList:
          tempData.mercadoModelDetail && tempData.mercadoModelDetail.skuInfoList
            ? tempData.mercadoModelDetail.skuInfoList
            : [],
        fullCateName: tempData.mercadoCategoryName,
        categoryId: tempData.mercadoModelDetail
          ? tempData.mercadoCategoryId
          : ''
      };
    }
    handleEditDialogType.value = type;
    showEditDialog.value = true;
  };
  // 新增&编辑组件 end
  // 类目组件 start
  const showCateDialog = ref(false);
  const prodPId = ref();
  const handleCateDialogType = ref('');
  const handleCateDialogClose = (e) => {
    if (!e.cate) {
      showCateDialog.value = e.isShow;
      return;
    }
    showCateDialog.value = e.isShow;
    if (handleCateDialogType.value == 'oa') {
      form.cateName = e.cate.value.fullCateName;
      form.cateOaId = e.cate.value.categoryId;
    } else if (handleCateDialogType.value == 'mercado') {
      dialogFormVisible.value.fullCateName = e.cate.value.fullCateName;
      dialogFormVisible.value.categoryId = e.cate.value.categoryId;
      dialogFormVisible.value.multiSub = e.cate.value.multiSub;
      dialogFormVisible.value.must = e.cate.value.must;
      // 根据美客多类目获取商品属性
      dialogFormVisible.value.normalAttrList = e.cate.value.normalAttrList
        .filter((item) => item.required == true)
        .concat(
          e.cate.value.normalAttrList.filter((item) => item.required != true)
        );
      dialogFormVisible.value.salePropAttrList = e.cate.value.salePropAttrList;
      if (dialogType.value == 'add') {
        dialogFormVisible.value.skuInfoList = e.cate.value.skuInfoList;
      }
    }
  };
  const handleCateDialogOpen = (type, id) => {
    handleCateDialogType.value = type;
    prodPId.value = id;
    showCateDialog.value = true;
  };
  // 类目组件 end
  onMounted(async () => {
    let form1 = new FormData();
    form1.append('headCode', 'prod_tag');
    let form2 = new FormData();
    form2.append('role', '开发专员');
    Promise.all([
      listdict(form1),
      getLogisAttrEnum(),
      getPreProdDevTypeEnum(),
      getModelCreatorList(),
      listuserbyrole(form2),
      queryOaNewCategory(),
      getCateTree()
    ])
      .then((res) => {
        // 商品标签
        initFormData.prodAttrList = res[0].data.map((item) => item.name);
        //物流属性
        initFormData.logisAttr = res[1].data.map((item) => item.name);
        //开发类型
        initFormData.devTypeList = res[2].data.map((item) => item.name);
        //创建人
        initFormData.creatorId = res[3].data.map((item) => ({
          value: item.creatorId,
          label: item.creator
        }));
        //开发专员
        initFormData.bizzOwnerIdList = res[4].data.map((item) => ({
          value: item.id,
          label: item.userName
        }));
        //OA新类目
        initFormData.oaList = JSON.parse(res[5].data);
        // 美客多类目
        initFormData.merList = res[6].data;
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
    // .finally(() => {});
  });
  let tableDataRef = ref();
  // 批量删除
  const batchDel = async () => {
    const checkedData = tableDataRef.value[1].getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    const { code } = await batchDelMercadoModel(ids.join(','));
    if (code == '0000') {
      ElMessage.success('删除成功');
      onSubmit();
    }
  };
  // 删除无平台类目模板
  const noPlatformCategoryDel = async () => {
    const { code, count, data } = await geNoPlatCatetModel();
    if (code == '0000') {
      ElMessageBox.alert(
        `无平台类目模板数量共计${count}个，请确认是否全部删除？`,
        '查询结果',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确认'
        }
      ).then(async () => {
        const { code } = await batchDelMercadoModel(data.join(','));
        if (code == '0000') {
          ElMessage.success('删除成功');
          onSubmit();
        }
      });
    }
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
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }
</style>
