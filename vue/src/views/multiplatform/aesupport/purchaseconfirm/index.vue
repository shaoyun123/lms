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
        <el-form-item prop="time" label="创建时间">
          <el-date-picker
            v-model="formData.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
            @change="clearTime"
          />
        </el-form-item>
        <el-form-item prop="prodSSkusStr">
          <el-select v-model="skuType" class="form_left">
            <el-option value="sSku" label="商品SKU" />
            <el-option value="sSkuDetails" label="商品SKU精确" />
            <el-option value="single" label="货品ID" />
          </el-select>
          <el-input
            v-model="formData.prodSSkusStr"
            class="form_right"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item prop="itemStr">
          <el-select v-model="itemType" class="form_left">
            <el-option value="single" label="货品id单个模糊" />
            <el-option value="multi" label="货品id多个精确" />
          </el-select>
          <el-input v-model="formData.itemStr" class="form_right" clearable />
        </el-form-item> -->
        <el-form-item prop="title" label="商品名称"
          ><el-input v-model="formData.title" clearable />
        </el-form-item>
        <el-form-item prop="supplierId" label="供应商">
          <el-select
            v-model="formData.supplierId"
            filterable
            placeholder="请输入供货商"
            remote
            clearable
            reserve-keyword
            :remote-method="handleSearchSupplier"
          >
            <el-option
              v-for="item in supplierNameList"
              :key="item.id"
              :label="item.supplier"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="orderByType" label="排序方式">
          <el-select v-model="formData.orderByType">
            <el-option label="按供应商正序" value="1"></el-option>
            <el-option label="按SKU正序" value="2"></el-option>
          </el-select>
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
          <vxe-table
            ref="tableDataRef"
            v-loading="tableDataLoading"
            :data="tableData"
            :height="height"
            :scroll-y="{ gt: 15 }"
            :align="'left'"
            :show-overflow="true"
            :edit-config="{
              trigger: 'click',
              mode: 'cell'
            }"
            border
          >
            <vxe-column type="checkbox" width="40" />
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
                <ImagePop :src="extraImg + row.image || ''" />
              </template>
            </vxe-column>
            <vxe-column title="货品ID" field="productId" />
            <vxe-column title="商品SKU" field="sku" />
            <vxe-column title="商品名称" field="title" />
            <vxe-column title="款式" field="style" />
            <vxe-column title="需要发货数量" field="planQuantity" width="65" />
            <vxe-column
              title="需要采购数量"
              field="purchaseQuantity"
              width="65"
            />
            <vxe-column
              title="商品成本(￥)"
              field="purchaseCostPrice"
              width="65"
            />
            <vxe-column title="库存成本(￥)" field="avgCost" width="65" />
            <vxe-column title="默认供应商">
              <template #default="{ row }">
                <a :href="row.purchaseUrl" target="_blank">
                  {{ row.supplierName }}</a
                >
              </template>
            </vxe-column>
            <vxe-column
              width="120"
              field="targetPrice"
              title="目标价格(￥)"
              :edit-render="{ name: 'input' }"
              :slots="{ edit: 'edit' }"
            >
              <template #edit="{ row }">
                <el-input
                  v-model="row.targetPrice"
                  type="number"
                  @focus="saveTargePrice(row)"
                  @blur="editTargetPrice(row, 'price')"
                ></el-input>
              </template>
            </vxe-column>
            <vxe-column title="压价后价格(￥)" field="actPrice" />
            <vxe-column title="是否包邮">
              <template #default="{ row }">
                {{
                  row.ifLogisticsFree
                    ? '是'
                    : row.ifLogisticsFree === false
                    ? '否'
                    : ''
                }}
              </template>
            </vxe-column>
            <vxe-column title="预计到货时间">
              <template #default="{ row }">
                {{
                  row.predictDeliverTime
                    ? parseTime(row.predictDeliverTime, '{y}-{m}-{d}')
                    : ''
                }}
              </template>
            </vxe-column>
            <vxe-column title="采购单号" field="billNumber" />
            <vxe-column
              title="备注"
              field="note"
              :edit-render="{ name: 'input' }"
              :slots="{ edit: 'edit' }"
            >
              <template #edit="{ row }">
                <el-input
                  v-model="row.note"
                  @focus="saveNote(row)"
                  @blur="editTargetPrice(row, 'remark')"
                ></el-input>
              </template>
            </vxe-column>
            <vxe-column title="人员" width="100">
              <template #default="{ row }">
                <div>开发：{{ row.bizzOwner }}</div>
                <div>采购：{{ row.buyer }}</div>
              </template></vxe-column
            >
            <vxe-column title="时间" width="170">
              <template #default="{ row }">
                <div>
                  创建：{{ row.createTime ? parseTime(row.createTime) : '' }}
                </div>
              </template></vxe-column
            >
            <vxe-column
              v-if="
                activeKey == '0' ||
                activeKey == '1' ||
                activeKey == '2' ||
                activeKey == '9'
              "
              title="操作"
              :width="activeKey == '9' ? 130 : 75"
            >
              <template #default="{ row }">
                <el-popconfirm
                  title="确定要取消吗？"
                  @confirm="handleCancelAePurConfirml(row)"
                >
                  <template #reference>
                    <el-button
                      v-if="
                        activeKey == '0' || activeKey == '1' || activeKey == '2'
                      "
                      type="primary"
                      >取消</el-button
                    >
                  </template>
                </el-popconfirm>

                <el-button
                  v-if="activeKey == '9'"
                  type="primary"
                  @click="handleTransferPurchase(row)"
                  >转待采购确认</el-button
                >
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
        <el-button type="primary" @click="downBarCode">导出条码</el-button>
        <el-button
          v-if="activeKey == '0'"
          v-permission="['purchaseconfirmBtn']"
          type="primary"
          @click="handlePurchaseConfirm"
          >采购确认</el-button
        >
        <el-button
          v-if="activeKey == '1'"
          v-permission="['purchaseconfirmSalesBtn']"
          type="primary"
          @click="handleSaleConfirm"
          >销售确认</el-button
        >
        <el-button
          v-if="activeKey == '2'"
          v-permission="['purchaseconfirmPurchaseBtn']"
          type="primary"
          @click="handleFastCreatePurOrder"
          >一键采购</el-button
        >
        <el-button type="primary" @click="handleExport">导出</el-button>
      </div>
    </el-card>

    <!-- 采购确认弹窗 -->
    <el-dialog
      v-model="showPurchaseConfirm"
      title="采购确认"
      width="40%"
      :close-on-click-modal="false"
      @close="closePurchaseConfirm"
    >
      <el-form :inline="true" size="default" label-width="120px">
        <el-row>
          <el-form-item class="input_width" label="压价后价格(￥)">
            <el-input
              v-model="purchaseForm.actPrice"
              type="number"
              placeholder="请输入压价后价格"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="input_width" label="是否包邮">
            <el-radio-group v-model="purchaseForm.ifLogisticsFree">
              <el-radio value="true">包邮</el-radio>
              <el-radio value="false">不包邮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="input_width" label="预计到货时间">
            <el-date-picker
              v-model="purchaseForm.predictDeliverTime"
              value-format="YYYY-MM-DD"
              type="date"
              unlink-panels
              class="form_right"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="input_width" label="备注">
            <el-input
              v-model="purchaseForm.note"
              style="width: 370px"
              type="textarea"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="savePurchaseConfirm"
            >提交</el-button
          >
          <el-button @click="closePurchaseConfirm">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 销售确认弹窗 -->
    <el-dialog
      v-model="showSalefirm"
      title="销售确认"
      width="30%"
      :close-on-click-modal="false"
      @close="closeSaleConfirm"
    >
      <el-form class="packup" :inline="true" size="default" label-width="120px">
        <el-row>
          <el-form-item class="input_width" label="是否采购">
            <el-radio-group v-model="saleForm.ifPurchase">
              <el-radio value="true">确认采购</el-radio>
              <el-radio value="false">取消采购</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="saveSaleConfirm">提交</el-button>
          <el-button @click="closeSaleConfirm">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="multiplatformaesupportpurchaseconfirm">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { ref, reactive, onMounted, computed } from 'vue';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { shortcuts } from '@/api/common';
  import JSZip from 'jszip';
  import FileSaver from 'file-saver';
  import { getImgArrayBuffer } from '@/utils/downloadFile';

  import { exportBarCodePDF } from '@/api/multiplatform/aesupportprod';
  import {
    queryPageData,
    fastCreatePurOrder,
    cancelAePurConfirm,
    purchaseConfirm,
    sellerConfirm,
    editPurchaseConfirm,
    exportSSkuList,
    searchSupplier,
    turnOffCancelConfirm
  } from '@/api/multiplatform/purchaseconfirm.js';

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
    { name: '待采购确认', status: '0', count: 0 },
    { name: '待销售确认', status: '1', count: 0 },
    { name: '确认采购', status: '2', count: 0 },
    { name: '已建采购单', status: '3', count: 0 },
    { name: '取消采购', status: '9', count: 0 }
  ]);
  const activeKey = ref('0');
  // const start = new Date();
  // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
  const skuType = ref('sSku');
  const formData = reactive({
    processStatus: '0', // 流程状态
    time: [], //  时间
    createTimeBegin: '',
    createTimeEnd: '',
    sku: '', // 商品sku
    prodSSkusStr: '',
    detailSku: '', // 商品SKU精确
    title: '', // 商品名称
    supplierId: '', // 供应商
    pageNo: 1,
    pageSize: 50,
    productIdString: '',
    productIdDetailList: [], // 货品id
    orderByType: '1' // 排序方式
  });

  const tableData = ref([]);
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref();
  const supplierNameList = ref([]);
  const extraImg = ref('');
  // 查询条件提交查询
  const getSearchData = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    formData.pageNo = currentPage.value;
    formData.pageSize = pageSize.value;
    if (formData.time && formData.time.length != 0) {
      if (formData.time[0].length > 10 && formData.time[1].length > 10) {
        formData.time[0] = formData.time[0].split(' ')[0];
        formData.time[1] = formData.time[1].split(' ')[0];
      }
      formData.createTimeBegin = formData.time[0] + ' 00:00:00';
      formData.createTimeEnd = formData.time[1] + ' 23:59:59';
    }
    if (skuType.value === 'sSku') {
      formData.sku = formData.prodSSkusStr;
      formData.detailSku = '';
      formData.productIdString = '';
      formData.productIdDetailList = [];
    }
    if (skuType.value === 'sSkuDetails') {
      formData.detailSku = formData.prodSSkusStr;
      formData.sku = '';
      formData.productIdString = '';
      formData.productIdDetailList = [];
    }
    if (skuType.value === 'single') {
      formData.sku = '';
      formData.detailSku = '';
      if (formData.prodSSkusStr.includes(',')) {
        formData.productIdDetailList = formData.prodSSkusStr.split(',');
        formData.productIdString = '';
      } else {
        formData.productIdDetailList = [];
        formData.productIdString = formData.prodSSkusStr;
      }
    }
    try {
      const { code, data, extra } = await queryPageData(formData);
      if (code === '0000') {
        tableData.value = data.list || [];
        extraImg.value = extra;
        tabList.value.forEach((item) => {
          item.count = 0;
          if (item.status == tableData.value[0]?.processStatus) {
            item.count = data.total;
          }
        });
        total.value = data.total;
      }
      tableDataLoading.value = false;
    } catch (err) {
      console.log(err);
      tableDataLoading.value = false;
    }
  };

  // 情空时间
  const clearTime = (val) => {
    if (!val) {
      formData.time = [];
      formData.createTimeBegin = '';
      formData.createTimeEnd = '';
    }
  };

  // 搜索供应商
  const handleSearchSupplier = async (name) => {
    try {
      var formData = new FormData();
      formData.append('name', name);
      const data = await searchSupplier(formData);
      supplierNameList.value = data || [];
    } catch (err) {
      console.log(err);
    }
  };
  const targetPrice = ref('');
  const note = ref('');
  const saveTargePrice = async (row) => {
    targetPrice.value = row.targetPrice;
  };

  const saveNote = async (row) => {
    note.value = row.note;
  };
  const editTargetPrice = async (row, type) => {
    if (
      (type === 'price' && targetPrice.value !== row.targetPrice) ||
      (type === 'remark' && note.value !== row.note)
    ) {
      try {
        let params = {
          id: row.id,
          targetPrice: row.targetPrice,
          note: row.note
        };
        const { code } = await editPurchaseConfirm(params);
        if (code === '0000') {
          ElMessage.success('修改成功！');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleClick = (tab) => {
    formData.pageNo = 1;
    formData.processStatus = tab.props.name;
    getSearchData();
  };

  onMounted(async () => {
    // formData.time = [parseTime(start), parseTime(new Date())];
  });

  let tableDataRef = ref();
  const selectRecords = ref([]); // 表格复选框选中的数据
  // 获取复选框选中的数据
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = tableDataRef.value;
    // activeKey.value:9 // 取消采购
    if (activeKey.value == 9) {
      selectRecords.value = $table[4].getCheckboxRecords();
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

  const showPurchaseConfirm = ref(false);
  const purchaseForm = reactive({
    idList: [],
    actPrice: '',
    ifLogisticsFree: '', // 是否包邮
    predictDeliverTime: '',
    note: ''
  });
  // 采购确认
  const handlePurchaseConfirm = () => {
    if (getSelectedList()) {
      showPurchaseConfirm.value = true;
      purchaseForm.ifLogisticsFree = '';
      purchaseForm.actPrice = '';
      purchaseForm.predictDeliverTime = '';
      purchaseForm.note = '';
    }
  };
  const savePurchaseConfirm = async () => {
    try {
      purchaseForm.idList = selectRecords.value.map((item) => item.id);
      const { code } = await purchaseConfirm(purchaseForm);
      if (code === '0000') {
        ElMessage.success('操作成功！');
        getSearchData();
      }
      showPurchaseConfirm.value = false;
    } catch (err) {
      console.log(err);
      showPurchaseConfirm.value = false;
    }
  };
  const closePurchaseConfirm = () => {
    showPurchaseConfirm.value = false;
  };

  const showSalefirm = ref(false);
  const saleForm = reactive({
    idList: [],
    ifPurchase: '' // 是否采购
  });
  // 销售确认
  const handleSaleConfirm = () => {
    if (getSelectedList()) {
      showSalefirm.value = true;
    }
  };
  const saveSaleConfirm = async () => {
    try {
      saleForm.idList = selectRecords.value.map((item) => item.id);
      const { code } = await sellerConfirm(saleForm);
      if (code === '0000') {
        ElMessage.success('操作成功！');
        getSearchData();
      }
      showSalefirm.value = false;
    } catch (err) {
      console.log(err);
      showSalefirm.value = false;
    }
  };
  const closeSaleConfirm = () => {
    showSalefirm.value = false;
  };

  // 一键采购
  const handleFastCreatePurOrder = async () => {
    if (getSelectedList()) {
      try {
        tableDataLoading.value = true;
        let selectedId = selectRecords.value.map((item) => item.id);
        const { code } = await fastCreatePurOrder(selectedId);
        if (code === '0000') {
          ElMessage.success('一键采购成功！');
          getSearchData();
        }
        tableDataLoading.value = false;
      } catch (err) {
        tableDataLoading.value = false;
        console.log(err);
      }
    }
  };

  // 导出
  const handleExport = async () => {
    if (getSelectedList()) {
      try {
        let params = {
          createTimeBegin: formData.createTimeBegin,
          createTimeEnd: formData.createTimeEnd,
          sku: formData.sku,
          title: formData.title,
          supplierId: formData.supplierId,
          orderByType: formData.orderByType,
          pageNo: formData.pageNo,
          pageSize: formData.pageSize,
          processStatus: formData.processStatus,
          idList: selectRecords.value.map((item) => item.id)
        };
        const res = await exportSSkuList(params);
        const xlsx = 'application/vnd.ms-excel';
        const blob = new Blob([res], { type: xlsx }); //转换数据类型
        const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
        a.download = '采购确认单.xlsx';
        a.href = window.URL.createObjectURL(blob);
        a.click();
        a.remove();
      } catch (err) {
        console.log(err);
      }
    }
  };
  // 导出条码
  const downBarCode = async () => {
    if (getSelectedList()) {
      let arr = selectRecords.value.map((item) => item.productId);
      const { data } = await exportBarCodePDF(arr);
      var blogTitle = `条码.zip`; // 下载后压缩包的命名
      var zip = new JSZip();
      var promises = [];
      let cache = {};
      let arrImg = [],
        errMsg = '';
      for (let key in data) {
        if (data[key].isComplete != false) {
          arrImg.push({
            fileName: key,
            supplier: data[key].supplier,
            path: data[key].imageUrl, // 文件链接
            pdfUrl: data[key].pdfUrl // 文件链接
          });
        } else {
          errMsg += key + '：' + data[key].message + '\n';
        }
      }
      errMsg != '' &&
        ElMessageBox.alert(errMsg, '操作结果', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '取消'
        });
      for (let item of arrImg) {
        let folder = zip.folder(item.supplier);
        let folderName = folder.folder(item.fileName);
        for (let key in ['path', 'pdfUrl']) {
          let url = item[['path', 'pdfUrl'][key]];
          const promise = getImgArrayBuffer(
            url + '?v=' + new Date().getTime()
          ).then((data) => {
            // 下载文件, 并存成ArrayBuffer对象(blob)
            folderName.file(url.split('/')[url.split('/').length - 1], data, {
              binary: true
            }); // 逐个添加文件
            cache[item.name] = data;
          });
          promises.push(promise);
        }
      }
      Promise.all(promises)
        .then(() => {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            // 生成二进制流
            FileSaver.saveAs(content, blogTitle); // 利用file-saver保存文件  自定义文件名
          });
        })
        .catch(() => {});
    }
  };

  // 取消采购单
  const handleCancelAePurConfirml = async (row) => {
    try {
      tableDataLoading.value = true;
      const { code } = await cancelAePurConfirm({ id: row.id });
      if (code === '0000') {
        ElMessage.success('取消采购单成功！');
        getSearchData();
      }
      tableDataLoading.value = false;
    } catch (err) {
      console.log(err);
      tableDataLoading.value = false;
    }
  };
  // 转待采购确认
  const handleTransferPurchase = async (row) => {
    try {
      const { code } = await turnOffCancelConfirm({ id: row.id });
      if (code === '0000') {
        ElMessage.success('操作成功！');
        getSearchData();
      }
    } catch (err) {
      console.log(err);
    }
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
</style>
