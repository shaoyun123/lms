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
          label="OA新类目"
          prop="cateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.cateName"
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
        <el-form-item prop="skuType">
          <!-- <el-input
          v-model="formData.prodSSku"
          placeholder="多个英文逗号分隔"
          clearable
        /> -->
          <el-select v-model="formData.skuType" class="form_left">
            <el-option value="prodSSkuList" label="商品SKU" />
            <el-option value="prodSSkuExact" label="商品SKU精确" />
          </el-select>
          <el-input v-model="formData.skuValues" class="form_right" clearable />
        </el-form-item>
        <el-form-item prop="searchKey">
          <el-select v-model="formData.searchKey" class="form_left">
            <el-option value="productIdList" label="货品ID" />
            <el-option value="prodPIdList" label="商品父ID" />
            <el-option value="barCodeList" label="打印条码" />
          </el-select>
          <el-input v-model="formData.searchVal" class="form_right" />
        </el-form-item>
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="formData.title" clearable />
        </el-form-item>
        <el-form-item label="AE中文名" prop="productNameCn">
          <el-input v-model="formData.productNameCn" clearable />
        </el-form-item>
        <el-form-item label="开发专员" prop="bizzOwner">
          <el-select v-model="formData.bizzOwner" filterable clearable>
            <el-option
              v-for="item in initFormData.preprodDevList"
              :key="item.id"
              :label="item.userName"
              :value="item.userName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售专员" prop="salePerson">
          <el-select v-model="formData.salePerson" filterable clearable>
            <el-option
              v-for="item in initFormData.sellerList"
              :key="item.id"
              :label="item.user_name"
              :value="item.user_name"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="采购专员" prop="buyer">
          <el-select v-model="formData.buyer" filterable clearable>
            <el-option
              v-for="item in initFormData.purchasingAgentList"
              :key="item.id"
              :label="item.userName"
              :value="item.userName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否断供" prop="replStatus">
          <el-select v-model="formData.replStatus">
            <el-option value="" label="全部" />
            <el-option value="2" label="是" />
            <el-option value="1" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-select-v2
            v-model="formData.supplierName"
            style="width: 350px"
            filterable
            remote
            :remote-method="remoteMethod"
            clearable
            :options="options"
            :loading="loading"
          />
        </el-form-item>
        <el-form-item label="排序方式" prop="sortTypes">
          <el-select
            v-model="formData.sortTypes"
            placeholder="排序方式"
            clearable
          >
            <!-- 默认 -->
            <el-option value="0" label="创建时间正序" />
            <el-option value="1" label="创建时间倒序" />
            <el-option value="6" label="毛利正序" />
            <el-option value="7" label="毛利倒序" />
            <el-option value="8" label="毛利率正序" />
            <el-option value="9" label="毛利率倒序" />
            <el-option value="2" label="供货价正序" />
            <el-option value="3" label="供货价倒序" />
            <el-option value="4" label="AE销量正序" />
            <el-option value="5" label="AE销量倒序" />
            <el-option value="10" label="库存倒序" />
            <el-option value="11" label="库存正序" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit()">查询</el-button>
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据列表展示 -->
    <el-card class="list_card">
      <div class="flexBetween">
        <span>当前选中 {{ selectCount }} 条数据</span>
        <div class="flexBetween">
          <el-dropdown style="margin-right: 10px">
            <el-button type="primary">
              导出货品<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="exportData"
                  >选中商品导出</el-dropdown-item
                >
                <el-dropdown-item @click="downloadExcel"
                  >按查询条件导出</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" @click="downBarCode">导出条码</el-button>
          <el-button type="primary" @click="editLabel">设置标签</el-button>
          <el-button type="primary" @click="modifyStatus"
            >修改供货状态</el-button
          >
          <el-button type="primary" style="color: #fff">
            <el-upload
              :action="'/api/lms/whaeProduct/importAEProducts'"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :show-file-list="false"
            >
              导入商品
            </el-upload>
          </el-button>
        </div>
      </div>
      <div>
        <el-checkbox
          v-for="item in initFormData.labelNameArr"
          :key="item"
          :label="item"
          @change="handleFormChange($event, item)"
        />
      </div>
      <vxe-table
        ref="tableDataRef"
        v-loading="loading"
        :scroll-y="{ gt: 10 }"
        :data="aesupportList"
        :height="height"
        :show-overflow="true"
        :edit-config="{
          trigger: 'dblclick',
          mode: 'cell'
        }"
        border
        @edit-closed="editClosed"
        @checkbox-change="changeTableCheckbox"
        @checkbox-all="changeTableAllCheckbox"
      >
        <vxe-column type="checkbox" width="50" />
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
            <ImagePop :src="row.image || ''" />
          </template>
        </vxe-column>
        <vxe-column title="SKU" width="170">
          <template #default="{ row }">
            <el-tooltip content="点击复制" placement="bottom">
              <div>
                商品：<span
                  style="cursor: pointer"
                  @click="copy(row.prodSSku)"
                  >{{ row.prodSSku }}</span
                >
              </div>
            </el-tooltip>
            <el-tooltip content="点击复制" placement="bottom">
              <div>
                货品ID：<span
                  style="cursor: pointer"
                  @click="copy(row.productId)"
                  >{{ row.productId }}</span
                >
              </div> </el-tooltip
            ><el-tooltip content="点击复制" placement="bottom">
              <div>
                商品父ID：<span
                  style="cursor: pointer"
                  @click="copy(row.prodPId)"
                  >{{ row.prodPId }}</span
                >
              </div> </el-tooltip
            ><el-tooltip content="点击复制" placement="bottom">
              <div v-if="row.barCode != row.productId">
                条码：<span
                  style="cursor: pointer"
                  @click="copy(row.barCode)"
                  >{{ row.barCode }}</span
                >
              </div>
            </el-tooltip>
            <div v-if="row.replStatus">
              <el-tag type="warning" size="small">{{
                row.replStatus == 1
                  ? '不断供'
                  : row.replStatus == 2
                  ? '断供'
                  : ''
              }}</el-tag>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="商品名称">
          <template #default="{ row }">
            {{ row.prodSInfo.title }}<br />款式：{{ row.prodSInfo.style
            }}<br />类目：{{
              row.cateTreeName
                ? row.cateTreeName.split('>>')[
                    row.cateTreeName.split('>>').length - 1
                  ]
                : ''
            }}
          </template>
        </vxe-column>
        <vxe-column title="AE中文名" field="productNameCn"> </vxe-column>
        <vxe-column title="AE销量" width="70">
          <template #default="{ row }">
            <div>{{ row.saleCount }}</div>
          </template>
        </vxe-column>
        <vxe-column title="发货单" width="110">
          <template #default="{ row }">
            <div>待发：{{ row.preProductNum }}</div>
            <div>库存：{{ row.stockNum }}</div>
          </template>
        </vxe-column>
        <vxe-column title="责任人" width="100">
          <template #default="{ row }">
            <div>销售：{{ row.salePerson }}</div>
            <div>开发：{{ row.prodPInfo.bizzOwner }}</div>
            <div>采购：{{ row.prodSInfo.buyer }}</div>
          </template>
        </vxe-column>
        <vxe-column title="重量(g)" width="100">
          <template #default="{ row }">
            净重：{{ row.prodSInfo.suttleWeight }}
            <br />
            毛重：{{ row.prodSInfo.suttleWeight + row.prodSInfo.packWeight }}
            <br />
            AE重：{{ row.weight }}
          </template>
        </vxe-column>
        <vxe-column title="AE尺寸(cm)" width="100" field="size">
          <template #default="{ row }">
            <div>长：{{ row.size.split('x')[0] }}</div>
            <div>宽：{{ row.size.split('x')[1] }}</div>
            <div>高：{{ row.size.split('x')[2] }}</div>
          </template>
        </vxe-column>
        <vxe-column title="成本(￥)" width="100">
          <template #default="{ row }">
            <div>采购：{{ row.purchaseCostPrice }}</div>
            <div>库存：{{ row.avgPrice }}</div>
          </template>
        </vxe-column>
        <vxe-column title="供货价(￥)" width="130">
          <template #default="{ row, rowIndex }"
            >供货价：
            <el-input
              v-model="row.supplyPrice"
              type="number"
              @blur="blurValue(rowIndex, row.id, row.supplyPrice)"
            ></el-input
            ><br />毛利：{{ row.profit }}<br />
            <span v-if="row.grossProfit"
              >毛利率：{{ (row.grossProfit * 1000) / 10 }} %
            </span>
          </template>
        </vxe-column>
        <vxe-column title="供应商名称">
          <template #default="{ row }">
            <!-- purchaseUrl -->
            <el-link :href="row.purchaseUrl" target="_blank" type="primary">{{
              row.supplier
            }}</el-link>
          </template>
        </vxe-column>
        <vxe-column
          title="备注"
          field="remark"
          :edit-render="{ name: 'input' }"
        >
        </vxe-column>
        <vxe-column title="操作" width="75"
          ><template #default="{ row }"
            ><el-button type="danger" @click="deleteTable(row)"
              >删除</el-button
            ></template
          ></vxe-column
        ></vxe-table
      >
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          background
          :page-sizes="[1000, 2000, 10000]"
          layout="prev, pager, next,sizes, total"
          :total="total"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 设置标签 -->
    <el-dialog
      v-model="editLabelDialog"
      width="30%"
      title="设置标签"
      :close-on-click-modal="false"
    >
      <el-form size="default">
        <el-checkbox
          v-for="item in initFormData.labelNameArr"
          :key="item"
          :label="item"
          @change="handleChange($event, item)"
        />
      </el-form>
      <template #footer>
        <el-button type="primary" @click="editLabelSave()">确定</el-button>
        <el-button @click="editLabelDialog = false">关闭</el-button>
      </template>
    </el-dialog>
    <!-- 修改供货状态 -->
    <el-dialog
      width="30%"
      title="修改供货状态"
      :model-value="modifyStatusDialog"
      destroy-on-close
      :close-on-click-modal="false"
      @close="modifyStatusCloseDialog"
    >
      <el-form size="default" status-icon :label-width="120"
        ><el-form-item label="是否断供">
          <el-radio-group v-model="modifyStatusDialogForm.replStatus">
            <el-radio value="1">不断供</el-radio>
            <el-radio value="2">断供</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="modifyStatusDialogForm.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="modifyStatusSubmitDialog"
            >确认</el-button
          >
          <el-button @click="modifyStatusCloseDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="multiplatformaesupportaesupportprod">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { onMounted, reactive, ref, computed } from 'vue';
  import axios from 'axios';
  import JSZip from 'jszip';
  import FileSaver from 'file-saver';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { queryOaNewCategory } from '@/api/common';
  import { copy } from '@/utils/common';
  import { getImgArrayBuffer } from '@/utils/downloadFile';

  import {
    getProducts,
    updateProduct,
    getSysUserList,
    exportBarCodePDF,
    getLabelList,
    deleteProduct,
    getPersonAndOrgsByRole
  } from '@/api/multiplatform/aesupportprod';
  // 初始化查询条件
  const initFormData = reactive({
    labelNameArr: [],
    oaList: [], // oa类目
    sellerList: [], // 销售员
    preprodDevList: [], //开发专员
    purchasingAgentList: [] //采购专员
  });

  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    formData.searchVal = '';
    formData.skuValues = '';
    formData.prodSSkuList = [];
    formData.prodSSkuExact = [];
  };

  const formData = reactive({
    labelNames: [],
    // 类目id 数组
    cateTreeName: [],
    searchKey: 'productIdList',
    searchVal: '',
    // sku
    skuType: 'prodSSkuList',
    skuValues: '',
    // 商品SKU精确
    prodSSkuExact: [],
    prodSSkuList: [],
    // // 供货Id
    // productId: '',
    // // 条码
    // barCode: '',
    // // 供货商品父ID
    // prodPId: '',
    // 商品标题
    title: '',
    // AE中文名
    productNameCn: '',
    // 供应商
    supplierName: '',
    // 开发
    bizzOwner: '',
    // 销售
    salePerson: '',
    // 采购
    buyer: '',
    // 是否断供 1->不断供;2 ->代表断供
    replStatus: '',
    // 排序
    sortTypes: '0'
  });
  // 编辑单元格更新
  const editClosed = async (table) => {
    const { code } = await updateProduct({
      idList: [table.row.id],
      remark: table.row.remark
    });
    // 成功不用更新，失败刷新表格
    if (code != '0000') {
      onSubmit();
    }
  };
  const tableDataRef = ref();
  const loading = ref(false);
  // const mouseEnter = (row, active) => {
  //   row[active] = {
  //     color: '#409EFF',
  //     cursor: 'pointer'
  //   };
  // };
  // const mouseLeave = (row, active) => {
  //   row[active] = '';
  // };
  // 当前选中数据数量
  const selectCount = ref(0);
  const changeTableCheckbox = (e) => {
    selectCount.value = e.records.length;
  };
  const changeTableAllCheckbox = (e) => {
    selectCount.value = e.records.length;
  };
  // 供应商 -- 渐渐搜索--start--
  const options = ref([]);
  const remoteMethod = (query) => {
    if (query !== '') {
      let formData = new FormData();
      formData.append('name', query);
      axios({
        method: 'POST',
        url: '/api/lms/prodSupplier/searchSupplier.html',
        data: formData
      })
        .then((res) => {
          if (res.statusText == 'OK') {
            options.value = res.data.map((item) => {
              item.label = item.supplier;
              item.value = item.supplier;
              return item;
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      options.value = [];
    }
  };
  // 供应商 -- 渐渐搜索--end--
  // 供货价 ------- start---------
  const blurValue = async (rowIndex, id, val) => {
    const { code, msg } = await updateProduct({
      idList: [id],
      supplyPrice: val
    });
    if (code != '0000') {
      ElMessage.danger(msg);
      onSubmit();
    }
    //  毛利=供货价-库存成本-毛重*0.0035，库存成本不存在时取采购成本。
    if (
      aesupportList.value[rowIndex].avgPrice &&
      aesupportList.value[rowIndex].avgPrice != '' &&
      aesupportList.value[rowIndex].avgPrice != 0
    ) {
      aesupportList.value[rowIndex]['profit'] = (
        val -
        aesupportList.value[rowIndex].avgPrice -
        (aesupportList.value[rowIndex].prodSInfo.suttleWeight +
          aesupportList.value[rowIndex].prodSInfo.packWeight) *
          0.0035
      ).toFixed(3);
    } else if (
      aesupportList.value[rowIndex].purchaseCostPrice &&
      aesupportList.value[rowIndex].purchaseCostPrice != '' &&
      aesupportList.value[rowIndex].purchaseCostPrice != 0
    ) {
      aesupportList.value[rowIndex]['profit'] = (
        val -
        aesupportList.value[rowIndex].purchaseCostPrice -
        (aesupportList.value[rowIndex].prodSInfo.suttleWeight +
          aesupportList.value[rowIndex].prodSInfo.packWeight) *
          0.0035
      ).toFixed(3);
    }

    //  毛利率 = 毛利/供货价*100%,保留千分位
    aesupportList.value[rowIndex]['grossProfit'] = (
      aesupportList.value[rowIndex]['profit'] / val
    ).toFixed(3);
  };
  // 供货价 ------- end---------
  // 分页--start
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
  // 分页--end
  // 列表数据
  const aesupportList = ref([]);
  onMounted(async () => {
    //OA新类目
    {
      const { data } = await queryOaNewCategory();
      initFormData.oaList = JSON.parse(data);
    }
    {
      // 另一个标签
      const { data } = await getLabelList();
      initFormData.labelNameArr = data.map((item) => item.name);
    }
    {
      // 销售员
      let formData = new FormData();
      formData.append('roleNames', 'AE自营专员');
      const { data } = await getPersonAndOrgsByRole(formData);
      initFormData.sellerList = data.userList;
    }
    {
      // 开发专员&采购专员
      const { data } = await getSysUserList();
      initFormData.preprodDevList = data.preprodDevList;
      initFormData.purchasingAgentList = data.purchasingAgentList;
    }
  });

  const onSubmit = async () => {
    selectCount.value = 0;
    formData.page = currentPage.value;
    formData.limit = pageSize.value;
    loading.value = true;
    if (formData.cateName && formData.cateName.length != 0) {
      formData.cateTreeName = [];
      formData.cateName.forEach((item) => {
        formData.cateTreeName.push(item[item.length - 1]);
      });
    } else {
      formData.cateTreeName = [];
    }
    formData.sortType = formData.sortTypes * 1;
    // productIdList;barCodeList;prodPIdList;
    formData.productIdList = formData.barCodeList = formData.prodPIdList = [];
    if (formData.searchKey == 'prodPIdList' && formData.searchVal != '') {
      formData[formData.searchKey] = formData.searchVal
        .split(',')
        .map((item) => item * 1);
    } else if (formData.searchVal != '') {
      delete formData.prodPIdList;
      formData[formData.searchKey] = formData.searchVal.split(',');
    }
    formData.prodSSkuList = formData.prodSSkuExact = [];
    if (formData.skuType == 'prodSSkuList') {
      formData.prodSSkuList =
        formData.skuValues == '' ? [] : formData.skuValues.split(',');
    } else if (formData.skuType == 'prodSSkuExact') {
      formData.prodSSkuExact =
        formData.skuValues == '' ? [] : formData.skuValues.split(',');
    }
    delete formData.export;
    let response = await getProducts(formData);
    if (response.code == '0000' && response.data?.length != 0) {
      aesupportList.value = response.data;
      total.value = response.count;
    } else if (response.code == '0000' && response.data?.length == 0) {
      aesupportList.value = [];
      total.value = 0;
    }
    loading.value = false;
  };

  // 删除--start--
  const deleteTable = async (row) => {
    const { code } = await deleteProduct(row.id);
    if (code == '0000') {
      ElMessage.success('删除成功');
      onSubmit();
    }
  };
  // 删除--end--

  // 获取checkbox
  const handleFormChange = (e, data) => {
    if (e) {
      formData.labelNames.push(data);
    } else {
      formData.labelNames = formData.labelNames.filter((item) => item != data);
    }
  };
  // 设置标签 --start--
  const editLabelDialog = ref(false);
  const editLabelForm = ref([]);

  // 打开
  const editLabel = () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    let selectIds = checkedData.map((item) => item.id);
    if (selectIds.length == 0) {
      ElMessage.warning('请选择一条数据');
      return;
    }
    editLabelDialog.value = true;
  };
  // 获取checkbox
  const handleChange = (e, item) => {
    if (e) {
      editLabelForm.value.push(item);
    } else {
      editLabelForm.value = editLabelForm.value.filter(
        (newItem) => newItem != item
      );
    }
  };
  // 保存
  const editLabelSave = async () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    let selectIds = checkedData.map((item) => item.id);
    const { code, msg } = await updateProduct({
      idList: selectIds,
      labelNames: editLabelForm.value.join(',')
    });
    if (code == '0000') {
      editLabelDialog.value = false;
      ElMessage.success(msg);
      onSubmit();
    }
  };
  // 设置标签 --end--
  // 修改供货状态 --start--
  const modifyStatusDialog = ref(false);
  const modifyStatus = async () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    let selectIds = checkedData.map((item) => item.id);
    if (selectIds.length == 0) {
      ElMessage.warning('请至少选择一条数据');
      return;
    }
    modifyStatusDialogForm.idList = selectIds;
    modifyStatusDialog.value = true;
  };

  const modifyStatusDialogForm = reactive({
    idList: [],
    replStatus: '',
    remark: ''
  });
  const modifyStatusSubmitDialog = async () => {
    const { code, msg } = await updateProduct(modifyStatusDialogForm);
    if (code == '0000') {
      ElMessage.success(msg);
      onSubmit();
      modifyStatusCloseDialog();
    }
  };
  const modifyStatusCloseDialog = () => {
    modifyStatusDialogForm.idList = [];
    modifyStatusDialogForm.replStatus = '';
    modifyStatusDialogForm.remark = '';
    modifyStatusDialog.value = false;
  };
  // 修改供货状态 --end--

  // 按查询条件导出
  const downloadExcel = async () => {
    formData.export = true;
    axios({
      method: 'POST',
      url: '/api/lms/whaeProduct/export',
      data: formData,
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'blob',
      dataType: 'json'
    })
      .then((res) => {
        if (res.statusText == 'OK') {
          const xlsx = 'application/vnd.ms-excel';
          const blob = new Blob([res.data], { type: xlsx }); //转换数据类型
          const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
          a.download = 'AE自营商品.xlsx';
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 选中商品导出
  const exportData = async () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    let selectIds = checkedData.map((item) => item.productId);
    if (selectIds.length == 0) {
      ElMessage.warning('请选择一条数据');
      return false;
    }
    axios({
      method: 'POST',
      url: '/api/lms/whaeProduct/export',
      data: {
        export: true,
        productIds: selectIds
      },
      responseType: 'blob',
      dataType: 'json'
    }).then((res) => {
      const xlsx = 'application/vnd.ms-excel';
      const blob = new Blob([res.data], { type: xlsx }); //转换数据类型
      const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
      a.download = '商品信息表.xlsx';
      a.href = window.URL.createObjectURL(blob);
      a.click();
      a.remove();
    });
  };

  // 导入新增
  const uploadSuccess = (res) => {
    ElMessageBox.alert(
      `<div style="width: 400px;overflow: hidden;overflow-wrap: break-word;">${res.msg}</div>`,
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
  const downBarCode = async () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return false;
    }
    let arr = checkedData.map((item) => item.productId);
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
  };
  // 下载zip--end--

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
</script>
<style lang="scss" scoped>
  .flexBetween {
    display: flex;
    justify-content: space-between;
  }
</style>
