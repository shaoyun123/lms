<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="form"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item prop="time" label="创建时间">
          <el-date-picker
            v-model="form.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
          />
        </el-form-item>
        <el-form-item prop="replOrderNosStr" label="供货单号"
          ><el-input
            v-model="form.replOrderNosStr"
            placeholder="多个英文逗号分隔"
            clearable
          />
        </el-form-item>
        <el-form-item prop="productIdsStr" label="货品ID"
          ><el-input v-model="form.productIdsStr" clearable />
        </el-form-item>
        <el-form-item prop="prodSSkusStr">
          <el-select v-model="skuType" class="form_left">
            <el-option value="sSku" label="商品SKU" />
            <el-option value="sSkuDetails" label="商品SKU精确" />
          </el-select>
          <el-input v-model="form.prodSSkusStr" class="form_right" clearable />
        </el-form-item>
        <el-form-item prop="remark" label="备注"
          ><el-input v-model="form.remark" clearable />
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
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="name in tabsName"
          :key="name"
          :label="name + '(' + tabsNameCount[name] + ')'"
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
            :edit-config="{
              trigger: 'dblclick',
              mode: 'cell'
            }"
            @edit-closed="editClosedP"
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="供货单" field="replOrderNo" width="180">
              <template #default="{ row }">
                <div>{{ row.replOrderNo }}</div>
                <div v-if="activeName == '提交采购'">
                  {{
                    row.replOrderStatus == 2
                      ? '待发货'
                      : row.replOrderStatus == 21
                      ? '部分发货'
                      : row.replOrderStatus == 4
                      ? '已发货'
                      : ''
                  }}
                </div></template
              >
            </vxe-column>
            <vxe-column field="">
              <template #header>
                <div style="display: flex; justify-content: center">
                  <div style="width: 130px">图片</div>
                  <div style="width: 130px">货品ID</div>
                  <div style="width: 130px">商品SKU</div>
                  <div style="width: 230px">AE中文名</div>
                  <div style="width: 60px; padding-left: 10px">
                    平台采购数量
                  </div>
                  <div style="width: 60px; padding-left: 10px">
                    <el-icon><Edit /></el-icon>
                    需要发货数量
                  </div>
                  <div style="width: 60px; padding-left: 10px">
                    <el-icon><Edit /></el-icon>
                    需要采购数量
                  </div>
                  <div style="width: 100px">商品</div>
                  <div style="width: 100px">金额</div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  v-if="row.sInfo && row.sInfo.length != 0"
                  :data="row.sInfo ? row.sInfo.slice(0, row.displayCount) : []"
                  :show-header="false"
                  :edit-config="{
                    trigger: 'dblclick',
                    mode: 'cell'
                  }"
                  @edit-closed="editClosedS"
                >
                  <vxe-column title="图片" width="130" align="center">
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
                  <vxe-column field="productId" title="货品ID" width="130" />
                  <vxe-column field="prodSSku" title="商品SKU" width="130" />
                  <vxe-column field="productNameCn" title="AE中文名" />
                  <vxe-column
                    field="platReplNumber"
                    title="平台采购数量"
                    width="60"
                  />
                  <vxe-column
                    v-if="activeName == '待确认'"
                    field="actualReplNumber"
                    title="需要发货数量"
                    width="60"
                    :slots="{ edit: 'edit' }"
                    :edit-render="{ name: 'input' }"
                  >
                  </vxe-column>
                  <vxe-column
                    v-if="activeName != '待确认'"
                    width="60"
                    field="actualReplNumber"
                    title="需要发货数量"
                  >
                  </vxe-column>
                  <vxe-column
                    v-if="activeName == '待确认'"
                    width="60"
                    field="purchaseQuantity"
                    title="需要采购数量"
                    :slots="{ edit: 'edit' }"
                    :edit-render="{ name: 'input' }"
                  ></vxe-column>
                  <vxe-column
                    v-if="activeName != '待确认'"
                    width="60"
                    field="purchaseQuantity"
                    title="需要采购数量"
                  ></vxe-column>
                  <vxe-column title="商品" width="100">
                    <template #default="{ row }">
                      成本：{{ row.prodCost }}<br />
                      供货价：{{ row.supplyPrice }}<br />
                      重量：{{ row.prodWeight }}</template
                    >
                  </vxe-column>
                  <vxe-column title="金额" width="100"
                    ><template #default="{ row }">
                      收入：{{ row.income }}<br />
                      毛利：{{ row.preGross }}<br />
                      毛利率：{{ (row.preGrossPercent * 1000) / 10 }}%</template
                    >
                  </vxe-column>
                </vxe-table>
                <div
                  v-if="row.sInfo && row.sInfo.length != 0"
                  :class="[row.sInfo.length <= 3 ? 'hideBtn' : '']"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >
            <vxe-column title="入库仓库" width="150">
              <template #default="{ row }">
                {{ row.storeName }}{{ row.storeCdoe }}</template
              >
            </vxe-column>
            <vxe-column title="时间" width="150">
              <template #default="{ row }">
                <div>
                  创建：{{
                    row.replOrderNoCt
                      ? parseTime(row.replOrderNoCt, '{y}-{m}-{d}')
                      : ''
                  }}
                </div>
                <div>
                  导入：{{
                    row.impDate ? parseTime(row.impDate, '{y}-{m}-{d}') : ''
                  }}
                </div>
                <div>
                  失效：{{
                    row.invalidDate
                      ? parseTime(row.invalidDate, '{y}-{m}-{d}')
                      : ''
                  }}
                </div>
              </template></vxe-column
            >
            <vxe-column
              field="remark"
              title="备注"
              width="130"
              :slots="{ edit: 'edit' }"
              :edit-render="{ name: 'input' }"
            >
            </vxe-column>
            <vxe-column title="操作" width="150">
              <template #default="{ row }">
                <!-- v-if="activeName != '已取消' && row.replOrderStatus == 2" -->
                <el-button
                  v-if="
                    activeName == '待确认' ||
                    activeName == '需要发货' ||
                    (activeName == '提交采购' && row.replOrderStatus == 2)
                  "
                  v-permission="['aesupplylistcancel']"
                  type="primary"
                  @click="optionBtn(row, '9')"
                  >取消</el-button
                >
                <el-button
                  v-if="activeName == '已取消'"
                  v-permission="['aesupplylistreset']"
                  type="primary"
                  @click="optionBtn(row, '0')"
                  >转待确认</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="currentPage"
              v-model:page-size="pageSize"
              background
              :page-sizes="[1000, 2000, 5000]"
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
          v-if="activeName == '待确认'"
          v-permission="['aesupplylistimport']"
          type="primary"
          style="color: #fff"
        >
          <el-upload
            :action="'/api/lms/whaeReplOrder/importExcel'"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :show-file-list="false"
          >
            导入供货单
          </el-upload>
        </el-button>
        <el-button
          v-if="activeName == '待确认'"
          v-permission="['aesupplylistdelivery']"
          type="primary"
          @click="needShip"
          >需要发货</el-button
        >
        <el-button
          v-if="activeName == '需要发货'"
          v-permission="['aesupplylistsubmit']"
          type="primary"
          @click="submitProcurement"
          >提交采购</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script setup name="multiplatformaesupportaesupplylist">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { ref, reactive, computed } from 'vue';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { shortcuts } from '@/api/common';
  import {
    queryList,
    submitToPurchase,
    updateDetailList,
    updateList
  } from '@/api/multiplatform/aesupplylist';

  // 编辑单元格更新
  const editClosedP = async (table) => {
    // 成功不用更新，失败刷新表格
    let arr = [
      {
        id: table.row.id,
        remark: table.row.remark
      }
    ];
    const { code } = await updateList({
      updateList: arr,
      cancellationBool: false
    });
    if (code != '0000') {
      ElMessage.danger('修改失败');
      onSubmit();
    }
  };
  const editClosedS = async (table) => {
    // 需要发货数量actualReplNumber
    // 收入income
    // 毛利preGross
    // 毛利率preGrossPercent
    // 供货价supplyPrice
    let field = table.column.field,
      arr = [];
    if (field == 'purchaseQuantity') {
      // 需要采购数量
      arr.push({
        id: table.row.id,
        purchaseQuantity: table.row.purchaseQuantity
      });
    } else if (field == 'actualReplNumber') {
      // 需要发货数量
      arr.push({
        id: table.row.id,
        actualReplNumber: table.row.actualReplNumber
      });
      // 收入
      table.row.income = table.row.actualReplNumber * table.row.supplyPrice;
      table.row.preGross = (
        table.row.actualReplNumber *
        (table.row.supplyPrice -
          table.row.prodCost -
          table.row.prodWeight * 0.0035)
      ).toFixed(3);
    }
    const { code, msg } = await updateDetailList(arr);
    if (code != '0000') {
      ElMessage.danger(msg);
      onSubmit();
    }
  };

  const skuType = ref('sSku');
  const form = reactive({
    // 默认最近30天
    time: [
      // parseTime(new Date(new Date() - 1000 * 60 * 60 * 24 * 30), '{y}-{m}-{d}'),
      // parseTime(new Date().getTime(), '{y}-{m}-{d}')
    ], //  时间
    createStartTime: '',
    createEndTime: '',
    replOrderNos: [], // 补货编号
    replOrderNosStr: '',
    productIds: [], // 商品Ids
    productIdsStr: '',
    prodSSkus: [], // 商品sku
    prodSSkuDetails: [], // 商品SKU精确
    prodSSkusStr: '',
    remark: '',
    replOrderStatus: '0' // 补货状态
  });

  const optionBtn = async (row, type) => {
    let cancellationBool = false;
    if (type == 9) {
      cancellationBool = true;
    }
    let arr = [
      {
        id: row.id,
        replOrderStatus: type
      }
    ];
    const { code } = await updateList({
      updateList: arr,
      cancellationBool: cancellationBool
    });
    if (code == '0000') {
      ElMessage.success('操作成功');
      onSubmit();
    }
  };

  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref();

  const currentPage = ref(1);
  const pageSize = ref(1000);
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
  // 查询条件表单清空
  const resetForm = function () {
    formRef.value.resetFields();
    form.time = [];
    form.createStartTime = '';
    form.createEndTime = '';
  };
  // 查询条件提交查询
  const onSubmit = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    form.page = currentPage.value;
    form.limit = pageSize.value;
    if (replOrderStatusObj[activeName.value] == 2) {
      form.replOrderStatusList = [2, 21, 4];
    } else {
      form.replOrderStatusList = [replOrderStatusObj[activeName.value]];
    }
    form.createStartTime = form.createEndTime = '';
    if (form.time && form.time.length != 0) {
      form.createStartTime = form.time[0] + ' 00:00:00';
      form.createEndTime = form.time[1] + ' 23:59:59';
    }
    form.replOrderNos =
      form.replOrderNosStr == '' ? [] : form.replOrderNosStr.split(',');
    form.productId =
      form.productIdsStr == '' ? [] : form.productIdsStr.split(',');
    form.productIds = form.productId.map((item) => item * 1);
    if (skuType.value === 'sSku') {
      form.prodSSkus =
        form.prodSSkusStr == '' ? [] : form.prodSSkusStr.split(',');
      form.prodSSkuDetails = [];
    }
    if (skuType.value === 'sSkuDetails') {
      form.prodSSkuDetails =
        form.prodSSkusStr == '' ? [] : form.prodSSkusStr.split(',');
      form.prodSSkus = [];
    }
    const { data, code, count } = await queryList(form);
    if (code == '0000' && count == 0) {
      tableData.value = [];
    } else if (code == '0000') {
      tableData.value = data.map((item) => {
        item.displayCount = 3;
        return item;
      });
    }
    tabsNameCount[activeName.value] = count;
    total.value = count;
    tableDataLoading.value = false;
  };
  // 查看全部时，将所有都给到
  const viewAll = (row) => {
    row.displayCount = row.sInfo.length;
  };
  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };
  let tabsName = ref(['待确认', '需要发货', '提交采购', '已取消']);
  let replOrderStatusObj = {
    待确认: 0,
    需要发货: 1,
    提交采购: 2,
    已取消: 9
  };
  const tabsNameCount = reactive({
    待确认: 0,
    需要发货: 0,
    提交采购: 0,
    已取消: 0
  });
  const activeName = ref('待确认');
  const handleClick = (tab) => {
    // if (activeName.value != tab.paneName && tab.paneName == '待确认') {
    //   form.isComplete = '1';
    // }
    tableDataLoading.value = true;
    activeName.value = tab.paneName;
    currentPage.value = 1;
    onSubmit();
  };
  let tableDataRef = ref();
  // 导入供货单 -- start--
  const uploadSuccess = (res) => {
    let msg = '';
    msg += res.msg + '\n';
    msg +=
      `成功${res.data.successCount}，失败${res.data.errorCount}，失败原因如下：` +
      '\n';
    msg += res.data.failList.join('\n');
    ElMessageBox.alert(
      `<div style="width: 400px;overflow: hidden;overflow-wrap: break-word;">${msg}</div>`,
      '操作结果',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '取消'
      }
    );
  };
  const uploadError = () => {
    ElMessage.error('error');
  };
  // 导入供货单 -- end--
  // 需要发货--start--
  const needShip = async () => {
    const checkedData = tableDataRef.value[0].getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return;
    }
    let arr = [];
    checkedData.forEach((item) => {
      arr.push({
        id: item.id,
        replOrderStatus: 1
      });
    });
    const { code } = await updateList({
      updateList: arr,
      cancellationBool: false
    });
    if (code == '0000') {
      ElMessage.success('操作成功');
      onSubmit();
    }
  };
  // 需要发货--end--
  // 提交采购--start--
  const submitProcurement = async () => {
    const checkedData = tableDataRef.value[1].getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return;
    }
    let ids = checkedData.map((item) => item.id);
    const { code } = await submitToPurchase(ids);
    if (code == '0000') {
      ElMessage.success('提交成功');
      onSubmit();
    }
  };
  // 提交采购--end--
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
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }
</style>
