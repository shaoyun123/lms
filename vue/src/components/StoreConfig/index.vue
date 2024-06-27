<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="启用状态" prop="status">
          <el-select v-model="formData.status" clearable>
            <el-option label="启用中" value="1"></el-option>
            <el-option label="已停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="orgId">
          <el-cascader
            v-model="formData.orgId"
            :options="state.orgIdList"
            filterable
            clearable
            collapse-tags
            :props="{
              emitPath: false,
              value: 'id',
              label: 'name',
              children: 'childOrgList'
            }"
            @change="changeOrg"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="roleType">
          <el-select
            v-model="formData.roleType"
            class="form_left"
            @change="changeRole"
          >
            <el-option
              v-for="item in state.salesRoleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="formData.salePersonId"
            clearable
            filterable
            collapse-tags
            :class="formData.salePersonId?.length > 1 ? 'hide_tag' : ''"
            multiple
            @change="changeUser"
          >
            <template #prefix>
              <el-tag v-if="formData.salePersonId?.length > 1" type="info">
                已选{{ formData.salePersonId?.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in state.userList"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺" prop="storeAcctIds">
          <!-- <el-select v-model="formData.storeAcctIds" clearable filterable>
            <el-option
              v-for="item in state.storeList"
              :key="item.id"
              :label="item.storeAcct"
              :value="item.id"
            ></el-option>
          </el-select> -->
          <ZSelect
            v-model="formData.storeAcctIds"
            style="width: 200px"
            :items="state.storeList"
            :num="1"
          />
        </el-form-item>
        <el-form-item prop="timeType">
          <el-select v-model="formData.timeType" class="form_left">
            <el-option label="创建时间" value="0"></el-option>
            <el-option label="access到期时间" value="1"></el-option>
            <el-option label="refresh到期时间" value="2"></el-option>
          </el-select>
          <el-date-picker
            v-model="formData.time"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
            clearable
          />
        </el-form-item>
        <el-form-item class="form_range" prop="grossType">
          <el-select v-model="formData.grossType" class="form_left">
            <el-option
              v-for="item in state.rateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input v-model="formData.grossRateMin" clearable />
          <div class="range_link">-</div>
          <el-input v-model="formData.grossRateMax" clearable />
        </el-form-item>
        <br />
        <!-- 以上为所有平台公共查询条件 -->

        <el-form-item
          v-for="(item, index) in searchFormItemList"
          :key="index"
          :label="item.labelName"
          :prop="item.contentType !== 'inputRange' ? item.contentField : ''"
          :class="[item.contentType === 'inputRange' ? 'form_range' : '']"
        >
          <el-select
            v-if="item.labelType === 'select'"
            v-model="formData[item.labelField]"
            class="form_left"
          >
            <el-option
              v-for="(cItem, cIdx) in item.labelOption"
              :key="cIdx"
              :value="cItem.value"
              :label="cItem.label"
            ></el-option>
          </el-select>

          <template v-if="item.contentType === 'inputRange'">
            <el-input v-model="formData[item.contentField[0]]" clearable />
            <div class="range_link">-</div>
            <el-input v-model="formData[item.contentField[1]]" clearable />
          </template>

          <el-input
            v-if="item.contentType === 'input'"
            v-model="formData[item.contentField]"
            clearable
          ></el-input>
          <el-select
            v-if="item.contentType === 'select'"
            v-model="formData[item.contentField]"
            :multiple="item.isMuliple"
            clearable
            filterable
            :collapse-tags="item.isMuliple"
            :class="formData[item.contentField]?.length > 1 ? 'hide_tag' : ''"
          >
            <template #prefix>
              <el-tag
                v-if="formData[item.contentField]?.length > 1"
                type="info"
              >
                已选{{ formData[item.contentField]?.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="(cItem, cIdx) in item.contentOption"
              :key="cIdx"
              :value="cItem.value"
              :label="cItem.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="searchLoading"
            @click="handleQuery"
            >搜索</el-button
          ><el-button @click="resetQuery">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <div class="flex_between">
        <div class="flex_between">
          <div class="count_content">数量（{{ totalCount }}）</div>
          <el-dropdown style="margin: 0 5px">
            <el-button type="primary">
              下载模板<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="platCode !== 'AE半托管'">
                  <a
                    :href="`/api/lms/static/templet/import_store_${platCode}.xlsx`"
                    target="_blank"
                    >新增店铺模板</a
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <a
                    :href="`/api/lms/static/templet/import_update_store_${platCode}.xlsx`"
                    target="_blank"
                    >修改店铺模板</a
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown style="margin: 0 5px">
            <el-button type="primary">
              导入表格<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="platCode !== 'AE半托管'">
                  <el-upload
                    :action="'/api/lms/salesplatnew/importStore.html'"
                    :data="{ platCode: platCode }"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    style="margin-right: 10px"
                    >导入新增店铺表格</el-upload
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu>
                <el-dropdown-item
                  ><el-upload
                    :action="'/api/lms/salesplatnew/importUpdateStore.html'"
                    :data="{ platCode: platCode }"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    style="margin-right: 10px"
                    >导入修改店铺表格</el-upload
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="tools_btn">
          <el-button type="primary" @click="handleExport">导出</el-button>
          <el-button type="primary" @click="handleBatchEdit"
            >批量编辑</el-button
          >
          <el-button
            v-if="platCode != 'AE半托管'"
            type="primary"
            @click="handleAdd"
            >新增店铺</el-button
          >
        </div>
      </div>

      <vxe-grid
        ref="tableRef"
        v-bind="gridOptions"
        v-loading="tableLoading"
        :height="height"
        style="margin-top: 10px"
      >
        <template
          v-for="(item, index) in gridOptions.columns.slice(1)"
          :key="index"
          #[item.slots.default]="{ row }"
        >
          <div v-if="item.field === 'toolbar'">
            <el-button
              v-for="cItem in item.columnItemRender"
              :key="cItem.cellLabel"
              type="primary"
              size="small"
              @click="handleCellClick(row, cItem)"
              >{{ cItem.cellLabel }}</el-button
            >
          </div>
          <template v-else>
            <div v-for="cItem in item.columnItemRender" :key="cItem.cellLabel">
              {{ cItem.cellLabel }}<span v-if="cItem.cellLabel"> :</span>
              <span v-if="cItem.cellType === 'time'">{{
                row[cItem.cellField]
                  ? parseTime(row[cItem.cellField], '{y}-{m}-{d} {h}:{i}:{s}')
                  : ''
              }}</span>
              <span v-else-if="cItem.cellType === 'objMap'">{{
                cItem.objMap[row[cItem.cellField]]
              }}</span>
              <span v-else>{{ row[cItem.cellField] }}</span>
            </div>
          </template>
        </template>
      </vxe-grid>

      <div class="pagination">
        <el-pagination
          v-model:currentPage="formData.page"
          v-model:page-size="formData.limit"
          background
          :page-sizes="[300, 500, 1000]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增编辑店铺弹窗 -->
    <EditStore
      v-if="showEditDialog"
      :show-edit-dialog="showEditDialog"
      :title="title"
      :plat-code="platCode"
      :action="action"
      :edit-info="editInfo"
      :custom-form-config="customFormConfig"
      @close="closeEditDialog"
      @save="saveEditInfo"
    />

    <!-- 批量编辑弹窗 -->
    <BatchEditStore
      v-if="showBatchEditDialog"
      :plat-code="platCode"
      :store-acct-id-list="storeAcctIdList"
      :show-batch-edit-dialog="showBatchEditDialog"
      :custom-form-config="customFormConfig"
      :check-box-group="checkItemConfig"
      @save="saveBatchEditInfo"
      @close="closeBatchEditDialog"
    />

    <!-- 批量导出店铺信息 -->
    <ExportConfirmDialog
      v-model="exportConfirmVisible"
      :goods-info-list-copy="storeHeaderInfoList"
      :title="exportTitle"
      :require-checked-field="requireCheckedField"
      @checked-export-info="checkedExportInfo"
      @close="closeExportConfirmDialog"
    />

    <!-- API授权 -->
    <AuthDialog
      v-if="showAuthDialog"
      :plat-code="platCode"
      :show-auth-dialog="showAuthDialog"
      :acct-auth-url="acctAuthUrl"
      :edit-info="editInfo"
      @close="closeAuthDialog"
    />

    <!-- 查看授权弹框 -->
    <AuthManage
      v-if="showAuthManage"
      :is-visible="showAuthManage"
      :auth-info="authInfo"
      @close="closeAuthManageDialog"
    />
  </div>
</template>
<script setup>
  import { reactive, onMounted, ref, computed } from 'vue';
  import { parseTime } from '@/utils/common';
  import { shortcuts } from '@/api/common';
  import EditStore from './EditStore.vue';
  import BatchEditStore from './BatchEditStore.vue';
  import AuthDialog from './AuthDialog.vue';
  import AuthManage from '@/components/AuthManage/index.vue';
  import ZSelect from '@/components/ZSelect/index.vue';
  import ExportConfirmDialog from '@/components/ExportConfirmDialog/index.vue';
  import { ElMessage } from 'element-plus';
  import { transferDate } from '@/utils/common';
  import { ElMessageBox } from 'element-plus';
  import {
    queryStoreListApi,
    getPersonAndOrgApi,
    getStoreListApi,
    getStoreListByOrgApi,
    getStoreHeaderInfoList,
    storeExportExcelApi,
    getAddressListApi,
    getPddAuthUrlApi
  } from '@/api/configure/storeconf.js';
  const props = defineProps({
    searchFormItemList: {
      // 查询条件
      type: Array,
      default: () => []
    },
    platFormData: {
      // 查询条件的默认数据
      type: Object,
      default: () => {}
    },
    tableListColumn: {
      // 表格列配置
      type: Array,
      default: () => []
    },
    customFormConfig: {
      // 单个编辑时 修改项配置
      type: Array,
      default: () => []
    },
    checkItemConfig: {
      // 批量编辑时 checkbox 勾选项配置
      type: Array,
      default: () => []
    },
    platCode: {
      type: String,
      default: ''
    },
    acctAuthUrlParams: {
      // API 授权链接参数
      type: String,
      default: ''
    }
  });

  const formData = ref({
    limit: 300,
    page: 1,
    platCode: props.platCode,
    roleType: '1',
    timeType: '0',
    grossType: '0'
  });

  const totalCount = ref(0);

  const tableRef = ref(null);
  const gridOptions = reactive({
    border: true,
    showFooter: true,
    height: 200,
    columnConfig: {
      resizable: true
    },
    showOverflow: true,
    scrollY: { gt: 15 },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    data: [],
    columns: [
      { type: 'checkbox', width: 43 },
      {
        field: 'status',
        title: '启用状态',
        width: 250,
        slots: { default: 'switch_status' },
        columnItemRender: [
          {
            cellLabel: '',
            cellField: 'status',
            cellType: 'objMap',
            objMap: {
              true: '已启用',
              false: '已停用'
            }
          },
          {
            cellLabel: '创建时间',
            cellField: 'createTime',
            cellType: 'time'
          }
        ]
      },
      {
        field: 'storeAcct',
        title: '店铺名称',
        slots: { default: '' }
      },
      {
        field: 'grossRate',
        title: '毛利率',
        slots: { default: 'grossRate' },
        columnItemRender: [
          {
            cellLabel: '毛利率',
            cellField: 'grossRate'
          },
          {
            cellLabel: '优惠幅度',
            cellField: 'discountRateMsg'
          },
          {
            cellLabel: '平台提成 ',
            cellField: 'platDeduct'
          }
        ]
      },
      {
        field: 'accessTokenExpiryTime',
        title: '授权到期时间',
        width: 220,
        slots: { default: 'accessTokenExpiryTime' },
        columnItemRender: [
          {
            cellLabel: 'access',
            cellField: 'accessTokenExpiryTime',
            cellType: 'time'
          },
          {
            cellLabel: 'refresh',
            cellField: 'refreshTokenExpiryTime',
            cellType: 'time'
          }
        ]
      },
      {
        field: 'salesperson',
        title: '人员信息',
        slots: { default: 'salesperson' },
        columnItemRender: [
          {
            cellLabel: '销售',
            cellField: 'salesperson'
          },
          {
            cellLabel: '主管',
            cellField: 'sellLeaderName'
          },
          {
            cellLabel: '客服',
            cellField: 'customServicer'
          },
          {
            cellLabel: '组长',
            cellField: 'leaderName'
          }
        ]
      }
    ]
  });

  onMounted(() => {
    getPersonAndOrgsByRoleFunc();
    getStoreSelectFunc();
    getStoreHeaderInfo();
    formData.value = Object.assign(formData.value, props.platFormData);

    gridOptions.columns = gridOptions.columns.concat(props.tableListColumn);
  });

  const state = reactive({
    orgIdList: [], // 部门
    userList: [], // 人员
    storeList: [], // 店铺
    salesRoleList: [
      { label: '销售', value: '1' },
      { label: '主管', value: '3' },
      { label: '客服', value: '2' },
      { label: '组长', value: '4' }
    ],
    rateList: [
      { label: '毛利率', value: '0' },
      { label: '优惠幅度', value: '1' },
      { label: '平台提成', value: '2' }
    ]
  });

  // 获取部门&销售员
  const salersDataCopy = ref([]);
  const getPersonAndOrgsByRoleFunc = async () => {
    let params = {
      platCode: props.platCode,
      roleType: formData.value.roleType
    };
    const { code, data } = await getPersonAndOrgApi(params);
    if (code === '0000') {
      state.orgIdList = data.orgTree || [];
      state.userList = data.userList || [];
      salersDataCopy.value = data.userList;
    }
  };

  // 获取店铺数据
  const getStoreSelectFunc = async () => {
    let params = {
      platCode: props.platCode
    };
    const { code, data } = await getStoreListApi(params);
    if (code === '0000') {
      state.storeList =
        data?.map((item) => ({
          id: item.id,
          name: item.storeAcct
        })) || [];
    }
  };

  // 切换部门
  const changeOrg = async (val) => {
    let params = {
      platCode: props.platCode,
      roleNames: props.platCode + '专员',
      orgId: val,
      salePersonId: '',
      type: formData.value.roleType == 1 ? 'salesperson' : 'customservicer'
    };
    const { code, data } = await getStoreListByOrgApi(params);
    if (code === '0000') {
      state.storeList =
        data?.map((item) => ({
          id: item.id,
          name: item.storeAcct
        })) || [];
    }

    let selectId = val;
    state.userList = salersDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
  };

  // 切换角色
  const changeRole = () => {
    // 清空部门选择 人员 店铺
    formData.value.orgId = '';
    formData.value.salePersonId = '';
    formData.value.storeAcctIds = [];
    getPersonAndOrgsByRoleFunc();
    getStoreSelectFunc();
  };

  // 切换人员
  const changeUser = async (val) => {
    console.log(val);
    // let params = {
    //   platCode: props.platCode,
    //   roleNames: props.platCode + '专员',
    //   orgId: val,
    //   salePersonId: '',
    //   type: formData.value.roleType == 1 ? 'salesperson' : 'customservicer'
    // };
    // const { code, data } = await getStoreListByOrgApi(params);
    // if (code === '0000') {
    //   state.storeList =
    //     data?.map((item) => ({
    //       id: item.id,
    //       name: item.storeAcct
    //     })) || [];
    // }

    // let selectId = val;
    // state.userList = salersDataCopy.value.filter(
    //   (item) => item.org_id === selectId
    // );
  };

  // 搜索
  const searchLoading = ref(false);
  const tableLoading = ref(false);
  const handleQuery = async () => {
    const time = {
      startTime: formData.value.time?.length
        ? new Date(formData.value.time[0] + ' 00:00:00').getTime()
        : null,
      endTime: formData.value.time?.length
        ? new Date(formData.value.time[1] + ' 23:59:59').getTime()
        : null
    };
    // 如没有选择店铺 则传所有的店铺数据
    // let storeAcctIds = [];
    // if (
    //   formData.value.storeAcctIds?.length === 0 ||
    //   !formData.value.storeAcctIds
    // ) {
    //   storeAcctIds = state.storeList.map((item) => item.id) || [];
    // } else {
    //   storeAcctIds = formData.value.storeAcctIds;
    // }
    const { code, data, count } = await queryStoreListApi({
      ...formData.value,
      ...time
      // storeAcctIds
    });
    if (code === '0000') {
      gridOptions.data = data;
      totalCount.value = count;
    }
  };

  // 清空查询
  const formRef = ref(null);
  const resetQuery = () => {
    formRef.value.resetFields();
    formData.value.time = [];
    formData.value.salePersonId = [];
    formData.value.grossRateMin = '';
    formData.value.grossRateMax = '';
    props.searchFormItemList?.forEach((item) => {
      if (item.contentType === 'inputRange') {
        formData.value[item.contentField[0]] = '';
        formData.value[item.contentField[1]] = '';
      }
    });
  };

  // 获取复选框选中的数据
  const selectRecords = ref([]);
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = tableRef.value;
    selectRecords.value = $table.getCheckboxRecords();
    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };

  const editInfo = ref({}); // 表格每行数据
  // 点击操作按钮
  const acctAuthUrl = ref('');
  const showAuthManage = ref(false);
  const authInfo = ref({});
  const handleCellClick = (row, item) => {
    // 编辑时 人员id如果传了-1， 回显时要变为空
    Object.keys(row).forEach((item) => {
      if (
        [
          'salespersonId',
          'sellLeaderId',
          'customServicerId',
          'leaderId'
        ].includes(item)
      ) {
        row[item] === -1 && (row[item] = '');
      }
    });
    if (item.cellField === 'edit') {
      // 编辑
      showEditDialog.value = true;
      title.value = '编辑店铺';
      editInfo.value = row;
      action.value = 'edit';
    }
    if (item.cellField === 'apiAuth') {
      editInfo.value = row;
      showAuthDialog.value = true;

      getAddressList(row);
    }
    if (item.cellField === 'storeAuth') {
      showAuthManage.value = true;
      authInfo.value = {
        id: row.id,
        platCode: row.platCode
      };
    }
  };

  // 获取地址
  const getAddressList = async (row) => {
    if (row.platCode === 'daraz') {
      try {
        const { code, msg } = await getAddressListApi({ storeAcctId: row.id });
        if (code === '0000') {
          acctAuthUrl.value = msg || '';
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (row.platCode === 'pinduoduo') {
      try {
        const { code, data } = await getPddAuthUrlApi();
        if (code === '0000') {
          acctAuthUrl.value = data || '';
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const showEditDialog = ref(false);
  const title = ref('新增店铺');
  const action = ref('create');
  const handleAdd = () => {
    showEditDialog.value = true;
    title.value = '新增店铺';
    action.value = 'create';
  };

  // 批量编辑
  const showBatchEditDialog = ref(false);
  const storeAcctIdList = ref([]);
  const handleBatchEdit = () => {
    if (getSelectedList()) {
      showBatchEditDialog.value = true;
      // 获取选中的店铺 id
      storeAcctIdList.value = selectRecords.value.map((item) => item.id);
    }
  };
  const closeBatchEditDialog = () => {
    showBatchEditDialog.value = false;
  };
  const saveBatchEditInfo = () => {
    showBatchEditDialog.value = false;
    handleQuery();
  };

  // 单个编辑
  const closeEditDialog = () => {
    showEditDialog.value = false;
  };
  const saveEditInfo = () => {
    showEditDialog.value = false;
    handleQuery();
  };

  // 用于编辑和批量编辑中的数据

  // api 授权
  const showAuthDialog = ref(false);
  const closeAuthDialog = () => {
    showAuthDialog.value = false;
  };

  // 导出
  const exportConfirmVisible = ref(false);
  const exportTitle = '导出店铺信息';
  const requireCheckedField = ['storeAcct'];
  const storeHeaderInfoList = ref([]);

  // 获取要导出店铺信息的字段
  const getStoreHeaderInfo = async () => {
    try {
      const { data } = await getStoreHeaderInfoList({
        platCode: props.platCode
      });
      storeHeaderInfoList.value = JSON.parse(data);
      // 拼多多去掉站点
      if (props.platCode === 'pinduoduo') {
        storeHeaderInfoList.value = storeHeaderInfoList.value.filter(
          (item) => item.name !== '站点'
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleExport = () => {
    exportConfirmVisible.value = true;
  };

  // 导出 返回的导出确认框勾选信息
  const checkedList = ref([]);
  const checkedIdList = ref([]);
  const checkedExportInfo = (info) => {
    checkedList.value = tableRef.value.getCheckboxRecords();
    if (info.type === 1 && !checkedList.value.length) {
      return ElMessage.warning('导出失败，当前列表未选择数据！');
    }
    // 选择导出列表选中数据
    if (info.type === 1 && checkedList.value.length) {
      checkedIdList.value = checkedList.value.map((item) => item.id);
    } else {
      checkedIdList.value = [];
    }
    // 根据 field 获取 name
    let exportName = [];
    info.selectedExportFieldList?.forEach((item) => {
      const fieldInfo = storeHeaderInfoList.value.find(
        (val) => val.field === item
      );
      exportName.push(fieldInfo?.name);
    });
    const params = {
      exportstoreAcctIds: checkedIdList.value.join(',') || '', // 店铺 id
      titles: exportName?.join(',') || '店铺名称',
      ...formData.value,
      platCode: props.platCode
    };

    storeExportExcelApi(params).then((res) => {
      const xlsx = 'application/vnd.ms-excel';
      const blob = new Blob([res], { type: xlsx }); //转换数据类型
      const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
      a.download = '店铺导出' + transferDate(new Date().getTime()) + '.xlsx';
      a.href = window.URL.createObjectURL(blob);
      a.click();
      a.remove();
    });
  };

  const closeExportConfirmDialog = () => {
    exportConfirmVisible.value = false;
  };

  //查看授权处理
  const closeAuthManageDialog = () => {
    showAuthManage.value = false;
  };

  // 导入店铺表格
  // 导入新增
  const uploadSuccess = (res) => {
    if (res.code == '0000') {
      ElMessage.success('导入店铺表格成功！');
      if (res?.data?.length > 0) {
        ElMessageBox.alert(res.data?.join(','), '提示', {
          confirmButtonText: '确认',
          type: 'warning',
          dangerouslyUseHTMLString: true
        });
      }
      handleQuery();
    } else {
      ElMessageBox.alert(res.msg || '导入店铺表格失败！', '错误信息', {
        confirmButtonText: '确认',
        type: 'error',
        dangerouslyUseHTMLString: true
      });
    }
  };
  const uploadError = () => {
    ElMessage.error('导入店铺表格失败！');
  };

  const beforeUpload = (file) => {
    const fileType = file.type;
    if (
      fileType !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      ElMessage.warning('导入文件格式错误，请导入.xlsx文件');
      return false;
    }
    return true;
  };

  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 240;
  });

  // 分页
  const handleSizeChange = (val) => {
    formData.value.limit = val;
    handleQuery();
  };

  const handleCurrentChange = (val) => {
    formData.value.page = val;
    handleQuery();
  };
</script>
<style lang="scss" scoped>
  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
    :deep(.el-select__input) {
      margin-left: 78px;
    }
    :deep(.el-select__input.is-small) {
      margin-left: 65px;
    }
    :deep(.el-select__input.is-large) {
      margin-left: 85px;
    }
  }
  .flex_between {
    display: flex;
    justify-content: space-between;
  }
  .count_content {
    padding: 0 10px;
    height: 24px;
    line-height: 24px;
  }
</style>
