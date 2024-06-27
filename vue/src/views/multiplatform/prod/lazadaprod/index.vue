<template>
  <div class="app-container">
    <el-card class="lazada_prod search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="formData.orgId"
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
            v-model="formData.salePersonId"
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
        <el-form-item label="店铺" prop="storeAcctIds">
          <el-select-v2
            v-model="formData.storeAcctIds"
            placeholder="请选择"
            :options="selectData.storeData"
            style="width: 350px"
            multiple
            collapse-tags
            clearable
            filterable
          >
          </el-select-v2>
        </el-form-item>
        <el-form-item label="站点" prop="saleSite">
          <el-select
            v-model="formData.saleSite"
            placeholder="请选择"
            clearable
            filterable
          >
            <!-- @change="changeSiteGetStore"
          @clear="resetSite" -->
            <el-option
              v-for="item in selectData.siteList"
              :key="item.salesSite"
              :label="item.name"
              :value="item.salesSite"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="skuType">
          <el-select v-model="formData.skuType" class="form_left">
            <el-option value="1" label="店铺子SKU" />
            <el-option value="2" label="商品子SKU" />
            <el-option value="3" label="FBL SKU" />
            <el-option value="4" label="item ID" />
          </el-select>
          <el-input
            v-model="formData.sku"
            placeholder="单个模糊,多个精确"
            class="form_right"
          />
        </el-form-item>
        <el-form-item label="商品标签" prop="prodAttrLists">
          <el-select
            v-model="formData.prodAttrLists"
            class="mul-input"
            :class="formData.prodAttrLists.length > 1 ? 'hideTag' : ''"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            filterable
          >
            <template #prefix>
              <el-tag v-if="formData.prodAttrLists.length > 1" type="info"
                >已选{{ formData.prodAttrLists.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.prodAttrTagArr"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态" prop="saleStatus">
          <el-select v-model="formData.saleStatus" clearable>
            <el-option value="" label="全部" />
            <el-option value="售卖" label="售卖" />
            <el-option value="不卖" label="不卖" />
          </el-select>
        </el-form-item>
        <el-form-item label="开发" prop="devId">
          <el-select
            v-model="formData.devId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in selectData.lazadaPerson"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sortType">
          <el-select
            v-model="formData.sortType"
            placeholder="排序方式"
            clearable
          >
            <el-option value="" label="全部" />
            <el-option value="1" label="FBL可用库存倒序" />
            <el-option value="2" label="FBL可用库存正序" />
            <el-option value="3" label="FBL30天销量倒序" />
            <el-option value="4" label="FBL30天销量正序" />
            <el-option value="5" label="FBL60天销量倒序" />
            <el-option value="6" label="FBL60天销量正序" />
            <el-option value="7" label="FBL15天销量倒序" />
            <el-option value="8" label="FBL15天销量正序" />
          </el-select>
        </el-form-item>
        <el-form-item label="FBL库存" prop="stockGreate" class="form_range">
          <el-input
            v-model="formData.stockGreate"
            clearable
            class="form_right"
            placeholder=">="
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="formData.stockLess"
            clearable
            placeholder="<="
          ></el-input>
        </el-form-item>
        <el-form-item prop="saleType" class="form_range">
          <el-select v-model="formData.saleType" class="form_left">
            <el-option value="2" label="7天销量" />
            <el-option value="3" label="15天销量" />
            <el-option value="4" label="30天销量" />
            <el-option value="5" label="60天销量" />
            <el-option value="6" label="90天销量" />
          </el-select>
          <el-input
            v-model="formData.saleGreate"
            clearable
            class="form_right"
            placeholder=">="
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="formData.saleLess"
            clearable
            placeholder="<="
          ></el-input>
        </el-form-item>
        <el-form-item label="条形码" prop="barcodeList">
          <el-input
            v-model="formData.barcodeList"
            clearable
            placeholder="多个精准,单个模糊"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPaymentsList()">查询</el-button>
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据列表展示 -->
    <el-card class="list_card">
      <div class="flexBetween">
        <div></div>
        <div class="flexBetween">
          <el-button type="primary" @click="editStatus">
            修改销售状态
          </el-button>
          <!-- <el-dropdown style="margin: 0 10px">
          <el-button type="primary">
            修改信息<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="editLabel">设置标签</el-dropdown-item>
              <el-dropdown-item @click="editStatus"
                >修改销售状态</el-dropdown-item
              >
              <el-dropdown-item @click="editRemark"
                >修改包装备注</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
          <el-button v-if="formData.aa" type="primary" @click="createPack"
            >同步FBL产品</el-button
          >
        </div>
      </div>
      <!-- v-for index in 1 用于ref获取嵌套子表格时，获取的格式为一个数组 不可删 -->
      <div v-for="index in 1" :key="index">
        <vxe-table
          ref="tableDataRef"
          v-loading="loading"
          show-overflow="true"
          :edit-config="{
            trigger: 'dblclick',
            mode: 'cell'
          }"
          :data="tableData"
          :height="height"
          :scroll-y="{ gt: 10 }"
          border
          @edit-closed="editClosed"
        >
          <vxe-column type="checkbox" width="45" />
          <vxe-column title="图片" width="100">
            <template #default="{ row }">
              <ImagePop :src="row.image || ''" />
            </template>
          </vxe-column>
          <vxe-column title="标题">
            <template #default="{ row }">
              <div>{{ row.title }}</div>
            </template>
          </vxe-column>
          <vxe-column title="店铺" width="250">
            <template #default="{ row }">
              <div>{{ row.storeAcct }}</div>
              <div>开发：{{ row.devPerson || '-' }}</div>
              <div>销售：{{ row.salePerson || '-' }}</div>
              <!-- eslint-disable-next-line prettier/prettier -->
              <div>
                更新：{{ parseTime(row.modifyTime, '{y}-{m}-{d}') || '-' }}
              </div>
              <div>销售状态：{{ row.saleStatus || '-' }}</div>
            </template>
          </vxe-column>
          <vxe-column title="SKU" width="320">
            <template #default="{ row }">
              <div>商品SKU：{{ row.prodSSku || '-' }}</div>
              <div>店铺SKU：{{ row.storeSku || '-' }}</div>
              <div>FBL_SKU：{{ row.fblSku || '-' }}</div>
              <div>商品ID：{{ row.itemId || '-' }}</div>
              <div>条码：{{ row.barcode || '-' }}</div>
            </template>
          </vxe-column>
          <vxe-column title="库存-成本(￥)" width="180">
            <template #default="{ row }">
              <div>商品成本：{{ row.prodCast }}</div>
              <div>可用库存：{{ row.availableStock }}</div>
              <div>可用库存成本：{{ row.availableStockCast }}</div>
            </template>
          </vxe-column>
          <vxe-column title="售价(当地币种)" width="160">
            <template #default="{ row }">
              <div>{{ row.price }}</div>
            </template>
          </vxe-column>
          <vxe-column title="销量">
            <template #default="{ row }">
              <div>7天：{{ row.sevenSale || '-' }}</div>
              <div>15天：{{ row.fiftySale || '-' }}</div>
              <div>30天：{{ row.thirtySale || '-' }}</div>
              <div>60天：{{ row.sixtySale || '-' }}</div>
              <div>90天：{{ row.ninetySale || '-' }}</div>
            </template>
          </vxe-column>
          <vxe-column
            title="销售备注"
            field="remark"
            :edit-render="{ name: 'input' }"
          >
          </vxe-column>
          <!-- <vxe-column title="操作">
          <template #default="{ row }">
          </template>
        </vxe-column> -->
        </vxe-table>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            background
            :page-sizes="[100, 500, 1000]"
            layout="prev, pager, next,sizes, total"
            :total="total"
            :small="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
    <el-dialog
      v-model="editStatusDialog"
      width="20%"
      title="修改销售状态"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editStatusForm"
        size="default"
        status-icon
        :label-width="180"
      >
        <el-select v-model="editStatusForm.selectData">
          <el-option value="售卖" label="售卖" />
          <el-option value="不卖" label="不卖" />
        </el-select>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="editStatusSave()">确定</el-button>
        <el-button @click="editStatusDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
  <!-- <el-dialog width="30%" title="修改包装备注" v-model="editRemarkDialog" :close-on-click-modal="false">
    <el-input
      v-model="dialogForm.textarea"
      :rows="4"
      type="textarea"
      placeholder="请输入包装备注"
    />
    <template #footer>
      <el-button type="primary" @click="editRemarkSave()">确定</el-button>
      <el-button @click="editRemarkDialog = false">关闭</el-button>
    </template>
  </el-dialog> -->
</template>

<script setup name="multiplatformprodlazadaprod">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { nextTick, onMounted, reactive, ref, computed } from 'vue';
  import { ElMessage } from 'element-plus';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import {
    allSite,
    getPlatformProducts,
    updatePlatformProducts
    // siteFilterStore
  } from '@/api/multiplatform/lazadaprod';
  import { getCustomers, getProdTagListApi } from '@/api/common';
  import useUserStore from '@/store/modules/user';
  import { parseTime } from '@/utils/common';

  const createPack = async () => {
    let checkedData = tableDataRef.value[0].getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请选择一条数据');
    }
    console.log(checkedData);
  };
  // // 站点店铺联动
  // const changeSiteGetStore = async () => {
  //   let site = formData.saleSite;
  //   const { data } = await siteFilterStore(site);
  //   selectData.storeData = data;
  // };
  // const resetSite = () => {
  //   console.log(123456);
  // };
  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    formData.stockLess = '';
    formData.saleGreate = '';
    formData.saleLess = '';
    formData.sortType = '';
    formData.sku = '';
  };

  const formData = reactive({
    orgId: '', // 部门
    salePersonId: '', // 销售员
    saleSite: '', // 站点
    storeAcctIds: [], // 店铺
    devId: '',
    skuType: '1',
    sku: '', // 多个使用逗号分割
    prodAttrLists: [], // 商品标签；多个使用逗号分割
    saleStatus: '', // 销售状态 1 售卖 0 不卖 不传查全部
    saleType: '2', // FBL销量此下拉框的type类型
    stockGreate: '', // fbl库存大于等于值
    stockLess: '',
    saleGreate: '',
    saleLess: '', // 销量 <=
    sortType: '' // 排序
  });
  const tableDataRef = ref();
  const loading = ref(false);
  // 分页--start
  const currentPage = ref(1);
  const pageSize = ref(100);
  const total = ref(0);
  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    getPaymentsList();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    getPaymentsList();
  };
  // 获取用户名
  let userStore = useUserStore();
  let userName = computed(() => userStore.userInfo.userName);
  // 列表数据
  const tableData = ref([]);
  // 部门和销售人员数据
  const selectData = reactive({
    lazadaPerson: [], // lazada开发专员
    prodAttrTagArr: [], // 商品标签
    departData: [], // 部门
    salersData: [], // 销售员
    storeData: [], // 店铺
    siteList: [] // 站点
  });
  const salersDataCopy = ref([]);
  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };
  onMounted(async () => {
    getDepartmentList();
    getStoreList();
    getSiteList();
    {
      // 获取商品标签
      const { data } = await getProdTagListApi();
      selectData.prodAttrTagArr = data;
    }
    {
      // 基础模板开发专员
      const { data } = await getCustomers();
      selectData.lazadaPerson = data.userList;
    }
  });
  // const handleSearchData = () => {};
  const getPaymentsList = async () => {
    formData.page = currentPage.value;
    formData.limit = pageSize.value;
    // handleSearchData();
    loading.value = true;
    formData.skuType ? (formData[formData.skuType] = formData.sku) : '';
    let formObj = {};
    for (let key in formData) {
      if (key == 'storeAcctIds' && formData[key].length != 0) {
        formObj.storeAcctId = formData.storeAcctIds.join(',');
      } else if (key == 'prodAttrLists' && formData[key].length != 0) {
        formObj.prodAttrList = formData.prodAttrLists.join(',');
      } else if (formData[key] != '') {
        formObj[key] = formData[key];
      }
    }
    const { data, code, count } = await getPlatformProducts(formObj);
    if (code == '0000') {
      ElMessage.success('查询成功');
      tableData.value = data;
    }
    total.value = count;
    loading.value = false;
  };
  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    try {
      let params = {
        roleNames: 'lazada专员'
      };
      const { data } = await getDepartData(params);
      selectData.departData = data.orgTree;
      selectData.salersData = data.userList;
      salersDataCopy.value = data.userList;
    } catch (err) {
      console.log(err);
    }
  };
  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'lazada专员',
        orgId: formData.orgId,
        salePersonId: formData.salesPersonId,
        platCode: 'lazada',
        lmsAppUserName: userName.value
      };
      const { data } = await getStoreInfo(params);
      selectData.storeData = data.map((item) => ({
        value: item.id,
        label: item.storeAcct
      }));
    } catch (err) {
      console.log(err);
    }
  };
  // 获取站点信息
  const getSiteList = async () => {
    const { data } = await allSite();
    selectData.siteList = data;
  };

  const handleNodeClick = (data) => {
    let selectId = data.id;
    selectData.salersData = salersDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
    resetSearch();
  };

  const changeSalers = () => {
    formData.storeAcctIds = [];
    getStoreList();
  };
  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    formData.orgId = '';
    resetSearch();
  };
  // 清空销售人员以及店铺
  const resetSearch = () => {
    formData.salePersonId = '';
    formData.storeAcctIds = [];
    nextTick(() => {
      getStoreList();
    });
  };
  // 修改销售状态 --start--
  const editStatusDialog = ref(false);
  const editStatusForm = ref({
    selectData: ''
  });
  const editStatus = () => {
    const checkedData = tableDataRef.value[0].getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请选择至少一条数据');
    }
    editStatusDialog.value = true;
    editStatusForm.value.selectData = '';
  };
  // 保存
  const editStatusSave = async () => {
    const checkedData = tableDataRef.value[0].getCheckboxRecords();
    if (editStatusForm.value.selectData == '') {
      return ElMessage.warning('请选择销售状态');
    }
    const { code, msg } = await updatePlatformProducts({
      idList: checkedData.map((item) => item.id),
      saleStatus: editStatusForm.value.selectData
    });
    if (code == '0000') {
      editStatusDialog.value = false;
      ElMessage.success(msg);
      getPaymentsList();
    }
  };
  // 修改销售状态 --end--
  // 修改销售备注 --s--
  const editClosed = async (table) => {
    const { code } = await updatePlatformProducts({
      idList: [table.row.id],
      remark: table.row.remark
    }); // 成功不用更新，失败刷新表格
    if (code != '0000') {
      ElMessage.danger('修改失败');
      getPaymentsList();
    }
  };
  // 修改销售备注 --end--
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 250;
  });
</script>
<style lang="scss" scoped>
  .flexBetween {
    display: flex;
    justify-content: space-between;
  }
  .color_red {
    color: red;
  }
</style>
