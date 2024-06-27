<template>
  <div class="app-container forceprices-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form :model="formData" class="search_form" :inline="true">
        <el-form-item>
          <el-select v-model="createTime" class="form_left">
            <el-option :value="1" label="录入时间" />
          </el-select>
          <el-date-picker
            v-model="formData.createTime"
            type="daterange"
            popper-class="forceprices-times"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="录入人" class="search_item_cascader">
          <el-cascader
            v-model="formData.creatorList"
            :options="creatorList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'name',
              children: 'childOrgList',
              value: 'name'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.skuType" class="form_left">
            <el-option :value="1" label="子SKU" />
            <el-option :value="2" label="父SKU" />
          </el-select>
          <el-input
            v-model="formData.prodSSkuStr"
            placeholder="多个英文逗号隔开"
            clearable
            @blur="handleSkuBlur"
          ></el-input>
          <el-switch
            v-model="formData.skuSwitch"
            active-text="精确"
            inactive-text="模糊"
            inline-prompt
            size="large"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="searchLoading"
            @click="handleQuery"
            >查询</el-button
          >
          <el-button @click="resetSearchForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="common_split_bottom list_card">
      <div class="card-tool">
        <!-- <el-button type="primary">审核</el-button> -->
        <el-button
          v-permission="['forcepriceRecordDeleteBtn']"
          type="danger"
          @click="batchHandleDelete({}, 1)"
          >批量删除</el-button
        >
        <el-button type="primary" @click="updateRecordsItem()">新增</el-button>
        <el-button type="primary" @click="downloadTemp">下载模板</el-button>
        <el-upload
          :action="'/api/lms/purchasePriceCut/importPurPriceCutTemplate'"
          :on-success="importSuccess"
          :on-error="importError"
          :on-progress="importProcess"
          :show-file-list="false"
        >
          <el-button type="primary">导入新增</el-button>
        </el-upload>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </div>

      <vxe-table
        ref="tableRef"
        :height="height"
        :scroll-y="{ gt: 10 }"
        :data="tableData"
        :show-overflow="true"
        :loading="tableLoading"
        border
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column field="prodSSku" title="SKU" width="150">
          <template #default="{ row }">
            <div>
              {{ row.prodSSku }}
              <span v-if="row.ifNew">
                <el-tag type="success" size="small">新</el-tag>
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="开发时间" width="150">
          <template #default="{ row }">
            <div>
              {{ transferDate(row.devTime) }}
            </div>
          </template>
        </vxe-column>
        <vxe-column field="purchasePrice" title="采购成本价格(￥)"></vxe-column>
        <vxe-column field="priceBefore" title="调整前价格(￥)"></vxe-column>
        <vxe-column field="priceAfter" title="调整后价格(￥)"></vxe-column>
        <vxe-column field="cutPrice" title="压价金额(￥)" width="100">
        </vxe-column>
        <vxe-column title="义乌仓库存" width="130">
          <template #default="{ row }">
            <div>可用数量：{{ row.stockAvailable }}</div>
            <div>平均成本：{{ row.avgCost }}</div>
            <div>库存金额：{{ row.inventoryValue }}</div>
          </template>
        </vxe-column>
        <vxe-column title="义乌仓销量" width="120">
          <template #default="{ row }">
            <div>日均销量：{{ row.dailySaleNum3Valid }}</div>
            <div>周转天数：{{ row.inventoryTurnoverDays }}</div>
          </template>
        </vxe-column>
        <vxe-column field="firstPrice" title="调整后首单采购单" width="170">
          <template #default="{ row }">
            <div>{{ row.purchaseNo }}</div>
            <div>
              默认下单价(￥)：<span v-if="!row.purchaseUrl">
                {{ row.firstPrice }}</span
              >
              <a v-else :href="row.purchaseUrl" target="_blank">
                {{ row.firstPrice }}</a
              >
            </div>
            <div>采购单价(￥)：{{ row.originCost }}</div>
          </template></vxe-column
        >
        <vxe-column title="录入信息" width="180">
          <template #default="{ row }">
            <div>人员： {{ row.creator }}</div>
            <div>时间: {{ transferDate(row.createTime) }}</div>
          </template>
        </vxe-column>
        <vxe-column field="salesBefore" title="录入时30天销量"></vxe-column>
        <vxe-column field="salesAfter" title="录入后次月销量">
          <template #default="{ row }">
            <div>
              {{
                !row.salesAfter && row.salesAfter !== 0
                  ? '未统计'
                  : row.salesAfter
              }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="100">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="updateRecordsItem('edit', row)"
              >修改</el-button
            >
            <el-button
              v-permission="['forcepriceRecordDeleteBtn']"
              link
              type="danger"
              @click="batchHandleDelete(row, 0)"
              >删除</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>

      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[50, 100, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 处理订单 弹窗 -->
    <el-dialog
      v-model="isShowHandle"
      :title="isEdit ? '修改压价数据' : '新增压价数据'"
      width="40%"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        class="label_width"
        :model="handleForm"
        :rules="formRules"
      >
        <el-row>
          <el-form-item
            :label="isEdit ? 'SKU' : '父SKU'"
            size="default"
            :style="{ width: isEdit ? '100%' : '400px' }"
          >
            <el-input
              v-model="handleForm.prodSSku"
              clearable
              :placeholder="isEdit ? '请输入SKU' : '输入多个时用逗号隔开'"
            />
          </el-form-item>
          <el-form-item v-if="!isEdit">
            <el-button
              type="primary"
              size="small"
              :loading="skuSearchLoading"
              style="margin-left: 20px"
              @click="handleSearchSku"
              >查询</el-button
            >
          </el-form-item>
        </el-row>
        <vxe-table
          v-if="!isEdit"
          :max-height="200"
          :scroll-y="{ gt: 10 }"
          :data="skuList"
          :show-overflow="true"
          :align="'center'"
          style="margin-bottom: 20px"
          border
        >
          <vxe-column field="prodPSku" title="父SKU" width="150">
            <template #default="{ row, rowIndex }">
              <div>
                <el-checkbox
                  v-model="row.pChecked"
                  :label="row.prodPSku"
                  @change="(e) => changePSku(e, rowIndex)"
                ></el-checkbox>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="prodSSku" title="子SKU">
            <template #default="{ row, rowIndex }">
              <div style="display: flex; flex-wrap: wrap">
                <div
                  v-for="(item, index) in row.prodSInfoList"
                  :key="index"
                  class="ssku_item"
                >
                  <el-checkbox
                    v-model="item.sChecked"
                    :label="item.sSku"
                    @change="(e) => changeSSku(e, rowIndex)"
                  ></el-checkbox>
                </div>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
        <el-form-item label="调整前价格(￥)" size="default">
          <ZInputNumber
            v-model="handleForm.priceBefore"
            :precision="2"
            clearable
            class="mr-2"
          />
        </el-form-item>
        <el-form-item label="调整后价格(￥)" size="default">
          <ZInputNumber
            v-model="handleForm.priceAfter"
            clearable
            :precision="2"
            class="mr-2"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button
            type="primary"
            :loading="handleLoading"
            @click="handleSave(formRef)"
            >{{ isEdit ? '修改' : '新增' }}</el-button
          >
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导入新增弹窗 -->
    <el-dialog
      v-model="showImportDialog"
      title="导入"
      :close-on-click-modal="false"
      @close="showImportDialog = false"
    >
      <vxe-table ref="itemTable" :data="importList" border>
        <vxe-column field="prodSSku" title="SKU" prop="prodSSku"></vxe-column>
        <vxe-column field="ifImportSuccess" title="是否导入成功">
          <template #default="{ row }">
            <div>
              {{ row.ifImportSuccess === false ? '否' : '是' }}
            </div>
          </template>
        </vxe-column>
        <vxe-column field="importResult" title="导入结果"></vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup name="purchaseforcepricesrecords">
  import { ref, reactive, onMounted, computed } from 'vue';
  import {
    handleAddPriceCut,
    handleEditPriceCut,
    queryPurPriceCut,
    queryLast180DayCreator,
    downloadPurPriceCutTemplate,
    deletePurPriceCut,
    getSSkuList
  } from '@/api/purchase/forceprice';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transferDate } from '@/utils/common';
  import { transBlob } from '@/utils/downloadFile';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { shortcuts } from '@/api/common';
  import { omit } from 'lodash-es';

  const formData = reactive({
    creatorList: [], // 录入人
    createTime: [], // 录入时间
    createTimeStart: '',
    createTimeEnd: '',
    prodSSkuStr: '',
    // prodSSkuList: [], // 商品sku列表
    skuType: 1,
    skuSwitch: false,

    prodSSkuList: [], // 子sku多个精确
    prodSSku: '', // 子sku精确
    prodSSkuLike: '', // 子sku模糊
    prodPSkuList: [], // 父sku多个精确
    prodPSku: '', // 父sku精确
    prodPSkuLike: '' // 父sku模糊
  });

  const createTime = ref(1);
  const paginationData = reactive({
    page: 1,
    limit: 100,
    total: 0
  });
  const tableData = ref([]); // 列表数据

  // 是否显示批量处理弹窗
  const isShowHandle = ref(false);

  // 按钮 loading
  const searchLoading = ref(false);
  const tableLoading = ref(false);
  const handleLoading = ref(false);

  // 批量处理表单
  const handleForm = reactive({
    prodSSku: '', // sku
    prodSSkuList: [],
    priceBefore: null, // 压价前价格
    priceAfter: null // 压价后价格
  });

  const formRef = ref(null);
  const formRules = reactive({
    prodSSku: [{ required: true, message: '请填写sku', trigger: 'blur' }]
  });

  onMounted(() => {
    getLast180DayCreatorList();
  });

  const creatorList = ref(false);
  const getLast180DayCreatorList = async () => {
    const { data } = await queryLast180DayCreator();
    creatorList.value = data;
    // 删除子节点,因为这是获取平台的店铺
    let arr = [];
    mapChooseDepart(arr, data.orgTree, data.userList);
    creatorList.value = arr;
  };

  const mapChooseDepart = (arr, orgTree, userList) => {
    orgTree.forEach((item, index) => {
      arr.push({
        ...item,
        name: item.org_name || item.name,
        childOrgList: []
      });
      if (item.childOrgList?.length) {
        mapChooseDepart(arr[index].childOrgList, item.childOrgList, userList);
      }
      const curSale = userList.filter((v) => item.id === v.org_id);
      if (curSale.length) {
        curSale.forEach((v) => {
          item.childOrgList.push({ ...v, name: v.user_name });
        });
        arr[index].childOrgList = item.childOrgList;
      }
    });
  };

  // 格式化时间
  const formatCreateTime = () => {
    if (
      formData.createTime &&
      formData.createTime.length != 0 &&
      formData.createTime !== null
    ) {
      formData.createTimeStart = formData.createTime[0] + ' 00:00:00';
      formData.createTimeEnd = formData.createTime[1] + ' 23:59:59';
    }
    if (formData.createTime === null) {
      formData.createTime = [];
      formData.createTimeStart = '';
      formData.createTimeEnd = '';
    }
  };
  const resetSkuInfo = () => {
    formData.prodSSkuList = [];
    formData.prodSSku = '';
    formData.prodSSkuLike = '';
    formData.prodPSkuList = [];
    formData.prodPSku = '';
    formData.prodPSkuLike = '';
  };

  const handleSkuBlur = () => {
    if (formData.prodSSkuStr.indexOf(',') > -1) {
      formData.skuSwitch = true;
    }
  };

  const getParams = () => {
    resetSkuInfo();
    let list = formData.prodSSkuStr?.split(',') || [];
    if (list.length > 1) {
      // 多个 默认为精确
      if (formData.skuType === 1) {
        formData.prodSSkuList = list;
      }
      if (formData.skuType === 2) {
        formData.prodPSkuList = list;
      }
    } else {
      if (formData.skuType === 1) {
        // 子sku
        if (formData.skuSwitch) {
          // 精确
          formData.prodSSku = formData.prodSSkuStr;
        } else {
          formData.prodSSkuLike = formData.prodSSkuStr;
        }
      }
      if (formData.skuType === 2) {
        if (formData.skuSwitch) {
          // 精确
          formData.prodPSku = formData.prodSSkuStr;
        } else {
          formData.prodPSkuLike = formData.prodSSkuStr;
        }
      }
    }
  };

  // 查询列表
  const handleQuery = async () => {
    let list = formData.prodSSkuStr?.split(',') || [];
    if (list?.length > 1 && formData.skuSwitch === false) {
      ElMessage.warning('多个SKU仅支持精确查询！');
      return;
    }
    searchLoading.value = true;
    getParams();

    formatCreateTime();
    const creatorList = formData.creatorList?.map(
      (item) => item[item.length - 1]
    );
    const params = omit(formData, ['createTime', 'prodSSkuStr']);
    const { data, count } = await queryPurPriceCut({
      ...params,
      creatorList,
      page: paginationData.page,
      limit: paginationData.limit
    }).finally(() => {
      searchLoading.value = false;
    });

    tableData.value = data.list;
    paginationData.total = count;
  };

  const selectId = ref([]); // 当前行修改选中的id
  const isEdit = ref(false);

  // 新增修改弹窗
  const updateRecordsItem = (type, row) => {
    // 编辑
    if (type === 'edit') {
      isEdit.value = true;
      selectId.value = row.id;
      handleForm.prodSSku = row.prodSSku;
      handleForm.priceBefore = row.priceBefore;
      handleForm.priceAfter = row.priceAfter;
    } else {
      // 新增
      isEdit.value = false;
      resetDialogForm();
    }
    isShowHandle.value = true;
    skuList.value = [];
  };

  const skuList = ref([]);
  // 勾选或者取消勾选 父sku
  const changePSku = (val, rowIndex) => {
    changeSSkuStatus(val, rowIndex);
  };

  // 修改子sku选中状态
  const changeSSkuStatus = (status, rowIndex) => {
    skuList.value[rowIndex].prodSInfoList?.forEach((cItem) => {
      cItem.sChecked = status;
    });
  };

  // 勾选或者取消勾选 子sku
  const changeSSku = (e, rowIndex) => {
    let notCheckedSSku = [];
    notCheckedSSku = skuList.value[rowIndex].prodSInfoList?.filter(
      (item) => item.sChecked === false
    );
    if (notCheckedSSku.length === 0) {
      // 不存在没有勾选的
      skuList.value[rowIndex].pChecked = true;
    } else {
      skuList.value[rowIndex].pChecked = false;
    }
  };

  // 获取所有选中的 子ku
  const getCheckedSSku = () => {
    let checkedSSku = [];
    skuList.value?.forEach((item) => {
      item.prodSInfoList?.forEach((cItem) => {
        if (cItem.sChecked) {
          checkedSSku.push(cItem.sSku);
        }
      });
    });
    return checkedSSku;
  };

  // 新增压价数据时 搜索子sku
  const skuSearchLoading = ref(false);
  const handleSearchSku = async () => {
    if (!isEdit.value) {
      skuSearchLoading.value = true;
      try {
        const { data } = await getSSkuList({
          prodPSkuList: handleForm.prodSSku?.split(',') || []
        });
        data?.forEach((item) => {
          item.pChecked = false;
          item.skuList?.forEach((cItem) => {
            cItem.sChecked = false;
          });
        });
        skuList.value = data || [];
      } catch (err) {
        console.log('err', err);
      } finally {
        skuSearchLoading.value = false;
      }
    }
  };

  const tableRef = ref(null);
  const checkedIdList = ref([]);

  // 批量删除
  const batchHandleDelete = async (row, type) => {
    // type 1 批量 0 单个
    const checkedList = tableRef.value.getCheckboxRecords();
    if (checkedList?.length === 0 && type === 1) {
      return ElMessage.warning('请选择数据！');
    }

    await ElMessageBox.confirm(
      `确认${type === 1 ? '批量' : ''}删除勾选数据吗`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    if (type === 1) {
      checkedIdList.value = checkedList.map((item) => item.id);
    }
    const idList = type ? checkedIdList.value : [row.id];

    const { code } = await deletePurPriceCut({ idList });
    if (code === '0000') {
      ElMessage.success('删除成功！');
      handleQuery();
    }
  };

  // 保存
  const handleSave = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        if (!handleForm.prodSSku) {
          return ElMessage.warning('sku不能为空！');
        }
        if (
          Number(handleForm.priceBefore) <= 0 ||
          Number(handleForm.priceAfter) <= 0
        ) {
          return ElMessage.warning('调整前后价格均要大于0！');
        }
        if (isEdit.value) {
          delete handleForm.prodSSkuList;
        } else {
          handleForm.prodSSkuList = getCheckedSSku();
        }
        if (handleForm.prodSSkuList?.length === 0) {
          return ElMessage.warning('请勾选子sku！');
        }
        try {
          handleLoading.value = true;
          const { msg } = isEdit.value
            ? await handleEditPriceCut({ id: selectId.value, ...handleForm })
            : await handleAddPriceCut(handleForm);
          ElMessage.success(msg);

          handleClose();
          handleLoading.value = false;
          handleQuery();
        } catch (err) {
          console.log(err);
        } finally {
          handleLoading.value = false;
        }
      }
    });
  };

  // 关闭弹窗
  const handleClose = () => {
    isShowHandle.value = false;
    resetDialogForm();
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleQuery();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleQuery();
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

  const resetSearchForm = () => {
    formData.creatorList = [];
    formData.createTime = '';
    // formData.prodSSkuList = [];
    formData.prodSSkuStr = '';
    formData.skuType = '';
    resetSkuInfo();
  };

  const resetDialogForm = () => {
    handleForm.prodSSku = '';
    handleForm.priceBefore = '';
    handleForm.priceAfter = '';
  };

  // 模板下载
  const downloadTemp = async () => {
    const res = await downloadPurPriceCutTemplate();
    const xlsx = 'application/vnd.ms-excel';
    const blob = new Blob([res], { type: xlsx }); //转换数据类型
    const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
    a.download = '压价记录模板' + '.xlsx';
    a.href = window.URL.createObjectURL(blob);
    a.click();
    a.remove();
  };

  const showImportDialog = ref(false);
  const importList = ref([]);

  // 导入状态改变
  const importProcess = () => {
    tableLoading.value = true;
  };

  // 导入新增
  const importSuccess = async (res) => {
    if (res.code == '0000') {
      tableLoading.value = false;
      showImportDialog.value = true;
      importList.value = res.data || [];
      await handleQuery();
    } else {
      await ElMessageBox.confirm(res.msg || '导入新增失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
      tableLoading.value = false;
    }
  };

  const importError = () => {
    ElMessage.error('导入新增失败！');
  };

  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };

  // 导出
  const handleExport = async () => {
    await ElMessageBox.confirm('确认导出当前搜索条件下的压价记录?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    getParams();
    formatCreateTime();
    const creatorList = formData.creatorList?.map(
      (item) => item[item.length - 1]
    );
    const params = omit(formData, ['createTime', 'prodSSkuStr']);
    try {
      searchLoading.value = true;
      transBlob({
        url: '/lms/purchasePriceCut/exportPurPriceCut',
        contentType: 'application/json',
        data: {
          ...params,
          creatorList
        },
        fileName: '压价记录导出' + Date.now() + '.xls'
      }).finally(() => {
        searchLoading.value = false;
        ElMessage.success('下载成功');
      });
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style lang="scss" scoped>
  .forceprices-container {
    .card-tool {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
      span {
        padding: 0 10px;
        font-size: 12px;
      }
      .el-button {
        margin-left: 10px;
      }
    }
    .label_width {
      :deep {
        .el-form-item .el-form-item__label {
          width: 100px;
        }
      }
    }

    .input_width {
      :deep {
        .el-select.el-select--small,
        .el-input.el-input--small {
          width: 80px !important;
        }
      }
    }
  }
  .ssku_item {
    margin: 5px;
  }
</style>
