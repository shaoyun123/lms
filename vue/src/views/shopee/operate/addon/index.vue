<template>
  <!-- shopee 加购优惠 -->
  <div class="addon_wrapper app-container" :loading="pageLoading">
    <el-card ref="searchCard" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item
          label="店铺"
          prop="storeAcctIdList"
          class="search_item_cascader"
        >
          <ZCascader
            v-model="formData.storeAcctIdList"
            style="width: 300px"
            :data="initList.storeList"
          />
          <!-- <el-cascader
            v-model="formData.storeAcctIdList"
            style="width: 300px"
            :options="initList.storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true }"
          ></el-cascader> -->
          <el-button type="primary" :loading="syncLoading" @click="handleSync"
            >同步</el-button
          >
        </el-form-item>
        <el-form-item label="站点" prop="salesSiteList">
          <MultiSelect
            v-model="formData.salesSiteList"
            :option-obj="{
              optionList: initList.siteList,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="排序" prop="orderType">
          <el-select v-model="formData.orderType" filterable clearable>
            <el-option
              v-for="item in ORDERBY_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠方式" prop="promotionType">
          <el-select v-model="formData.promotionType" filterable clearable>
            <el-option
              v-for="item in PREFERENTIAL_WAY"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠名称" prop="addOnDealName">
          <el-input v-model="formData.addOnDealName" clearable></el-input>
        </el-form-item>
        <el-form-item label="加购优惠ID" prop="addOnDealIdList">
          <el-input
            v-model="formData.addOnDealIdList"
            clearable
            placeholder="多个用英文逗号隔开"
            @blur="commonDivideCommaNum($event)"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="DEFAULT_TIME"
            :shortcuts="shortcutsRange"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="DEFAULT_TIME"
            :shortcuts="shortcutsRange"
          />
        </el-form-item>
        <el-form-item label="主商品ID" prop="itemIdList">
          <el-input
            v-model="formData.itemIdList"
            clearable
            placeholder="多个用英文逗号隔开"
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <el-form-item prop="Ids">
          <el-select v-model="formData.idType" class="form_left" filterable>
            <el-option value="modelIdList" label="加购商品vari_id" />
            <el-option value="subItemIdList" label="加购商品item_id" />
          </el-select>
          <el-input
            v-model="formData.Ids"
            clearable
            class="form_right"
            placeholder="多个用英文逗号隔开"
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <el-form-item label="活动类型" prop="autoRenew">
          <el-select v-model="formData.autoRenew" filterable clearable>
            <el-option :value="1" label="连续活动" />
            <el-option :value="0" label="单次活动" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否添加商品" prop="addMainItemOrSubItem">
          <el-select
            v-model="formData.addMainItemOrSubItem"
            filterable
            clearable
          >
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item prop="operator">
          <el-select
            v-model="formData.operatorType"
            class="form_left"
            filterable
          >
            <el-option value="creatorList" label="创建人" />
            <el-option value="modifierList" label="修改人" />
          </el-select>
          <MultiSelect
            v-model="formData.operator"
            :option-obj="{
              optionList: initList.operatorList,
              value: 'userName',
              label: 'userName'
            }"
          />
        </el-form-item>
        <el-form-item
          label="45天加购销量"
          prop="fortyFiveDays"
          class="search_item_label form_range"
        >
          <el-input v-model="formData.fortyFiveDaysSalesMin" clearable />
          <div class="range_link">-</div>
          <el-input v-model="formData.fortyFiveDaysSalesMax" clearable />
        </el-form-item>
        <el-form-item prop="operateTime">
          <el-select
            v-model="formData.operateTimeType"
            class="form_left"
            filterable
          >
            <el-option value="createTime" label="创建时间" />
            <el-option value="updateTime" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="formData.operateTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="DEFAULT_TIME"
            style="width: 200px"
            class="form_right"
            :shortcuts="shortcutsRange"
          />
        </el-form-item>
        <el-form-item label="店铺标签" prop="storeTagList">
          <MultiSelect
            v-model="formData.storeTagList"
            :option-obj="{
              optionList: initList.storeTagList,
              value: 'name',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(formRef)"
            >查询</el-button
          ><el-button type="primary" @click="handleResetForm(formRef)"
            >重置</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card v-loading="tableDataLoading" class="list_card">
      <el-tabs
        v-model="activeKey"
        v-loading="tableDataLoading"
        type="card"
        class="demo-tabs"
        @tab-click="handleTab"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.label"
          :label="`${item.label}(${item.count})`"
          :name="item.status"
        >
        </el-tab-pane
      ></el-tabs>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="height"
        :scroll-y="{ gt: 15, oSize: 50 }"
        border
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column
          field="addOnDealId"
          title="加购优惠ID"
          width="100"
        ></vxe-column>
        <vxe-column field="addOnDealName" title="优惠名称"></vxe-column>
        <vxe-column field="storeAcct" title="店铺">
          <template #default="{ row }">
            <div>{{ row.storeAcct }}</div>
            <el-tag
              v-for="item in row.storeTagList"
              :key="item"
              class="store_tag"
              >{{ item }}</el-tag
            >
          </template>
        </vxe-column>
        <vxe-column field="salesperson" title="销售员" width="80"></vxe-column>
        <vxe-column field="autoRenew" title="活动类型" width="90">
          <template #default="{ row }">
            <vxe-switch
              v-model="row.autoRenew"
              open-label="连续"
              close-label="单次"
              size="mini"
              :close-value="0"
              :open-value="1"
              :loading="autoRenewLoading"
              @click="handlAutoRenew(row)"
            />
          </template>
        </vxe-column>
        <vxe-column field="time" title="活动时间">
          <template #default="{ row }">
            {{ transferDate(row.startTime) }}
            <br />
            {{ transferDate(row.endTime) }}
          </template>
        </vxe-column>
        <vxe-column field="promotionType" title="优惠方式">
          <template #default="{ row }">
            <div v-if="row.promotionType === 0">加购折扣</div>
            <div v-if="row.promotionType === 1">满赠</div>
          </template>
        </vxe-column>
        <vxe-column field="mainItemNum" title="主商品数量" width="100"
          ><template #default="{ row }"
            >{{ row.mainItemNum || 0 }}
          </template></vxe-column
        >
        <vxe-column field="subItemNum" title="加购商品数量" width="100">
          <template #default="{ row }">{{ row.subItemNum || 0 }} </template>
        </vxe-column>
        <vxe-column
          field="promotionPurchaseLimit"
          title="限购/赠品数量"
          width="120"
        >
          <template #default="{ row }">
            <div v-if="row.promotionType === 0">
              {{ row.promotionPurchaseLimit }}
            </div>
            <div v-if="row.promotionType === 1">{{ row.perGiftNum }}</div>
          </template></vxe-column
        >
        <vxe-column
          field="fortyFiveDaysSales"
          title="45天加购销量"
        ></vxe-column>
        <vxe-column field="modifier" title="操作人">
          <template #default="{ row }">
            <div>创建： {{ row.creator }}</div>
            <div>修改： {{ row.modifier }}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作时间">
          <template #default="{ row }">
            <div>创建： {{ transferDate(row.createTime) }}</div>
            <div>修改： {{ transferDate(row.modifyTime) }}</div>
          </template>
        </vxe-column>

        <vxe-column title="操作" width="80">
          <template #default="{ row }">
            <el-button
              v-if="['upcoming', 'ongoing'].includes(row.promotionStatus)"
              type="primary"
              @click="handleEdit(row)"
              >修改</el-button
            >
            <el-button type="primary" @click="handleCopy(row)">复制</el-button>
            <el-popconfirm
              v-if="row.promotionStatus === 'upcoming'"
              title="加购优惠活动删除后无法恢复，且无法查看活动信息。请问确定删除吗？"
              @confirm="handleDel(row)"
            >
              <template #reference>
                <el-button type="danger" :del-loading="delLoading"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-if="row.promotionStatus === 'ongoing'"
              title="加购优惠活动终止后，无法重启，连续加购优惠活动不会自动续期。请问确定终止吗？"
              @confirm="handleStop(row)"
            >
              <template #reference>
                <el-button type="danger" :stop-loading="stopLoading"
                  >终止</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.pageNum"
          v-model:page-size="paginationData.pageSize"
          background
          :page-sizes="[50, 100, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="tools_btn">
        <el-button
          type="primary"
          :loading="batcgSyncActivituLoading"
          @click="handleSyncActivity"
          >同步</el-button
        >
        <!-- <el-button
          type="primary"
          @click="handledownloadList"
          :loading="downloadListLoading"
          >导出</el-button
        > -->
        <el-button type="primary" @click="handleOperateLog">操作日志</el-button>
        <el-button
          v-permission="['addonDiscountBtn']"
          type="primary"
          @click="handleAdd"
          >新增加购优惠</el-button
        >
        <el-dropdown class="ml12">
          <el-button type="primary">
            下载模板<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in DOWNLOAD_TPL_LIST"
                :key="item.value"
                @click="handledownloadTpl(item.fileName)"
                >{{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown v-permission="['addonImportBtn']" class="ml12 mr12">
          <el-button type="primary">
            导入<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in DOWNLOAD_TPL_LIST"
                :key="item.value"
              >
                <el-upload
                  :action="item.uploadUrl"
                  :on-success="uploadPlanSuccess"
                  :on-error="uploadError"
                  name="file"
                  :data="item.data"
                  :show-file-list="false"
                >
                  {{ item.label }}
                </el-upload></el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          v-if="activeKey === 'ongoing'"
          v-permission="['addonBatchPauseBtn']"
          :loading="batchStopLoading"
          type="primary"
          @click="handleBatchStop"
          >批量终止</el-button
        >
        <el-button
          v-if="activeKey === 'upcoming'"
          v-permission="['addonBatchDeleteBtn']"
          :loading="batchDelLoading"
          type="danger"
          @click="handleBatchDel"
          >批量删除</el-button
        >
      </div>
    </el-card>
    <OperateLog v-model="operateLogVisible" />
    <EditDialog
      v-model="editVisible"
      :checked-row="checkedRow"
      @handle-search="handleSearch"
      @update-row="updateRow"
    />
  </div>
</template>

<script setup name="shopeeoperateaddon">
  import { reactive, ref, onMounted, watch, computed } from 'vue';
  import {
    getStoreList,
    shortcuts as shortcutsRange,
    getStoreTagListApi
  } from '@/api/common';
  import { getSiteListApi } from '@/api/shopee/common';
  import {
    syncByStoreApi,
    queryPageApi,
    getUserListApi,
    updateApi,
    delAddOnApi,
    endAddOnApi,
    syncByActivityApi
  } from '@/api/shopee/addon';
  import {
    ORDERBY_LIST,
    PREFERENTIAL_WAY,
    DOWNLOAD_TPL_LIST,
    DEFAULT_TIME
  } from './config';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { isObject } from '@/utils/is';
  import { commonDivideCommaNum } from '@/utils/divide';
  import { transferDate } from '@/utils/common';
  import { transBlob } from '@/utils/downloadFile';
  import OperateLog from './components/OperateLog.vue';
  import EditDialog from './components/EditDialog.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';

  const formData = reactive({
    idType: 'modelIdList',
    operatorType: 'creatorList',
    operateTimeType: 'createTime',
    salesSiteList: []
  });
  const formRef = ref();
  const initList = reactive({
    operatorList: []
  });
  const activeKey = ref('upcoming');
  const tabList = ref([
    { label: '未开始', count: 0, status: 'upcoming' },
    { label: '进行中', count: 0, status: 'ongoing' },
    { label: '结束', count: 0, status: 'expired' }
  ]);
  const pageLoading = ref(false);

  onMounted(async () => {
    pageLoading.value = true;
    getCreatorList(true);
    getModifierList();
    Promise.all([
      getStoreList('shopee'),
      getSiteListApi(),
      getStoreTagListApi('shopee')
    ])
      .then((res) => {
        initList.storeList = res[0]?.data?.children || [];
        initList.siteList = res[1]?.data?.siteList || [];
        initList.storeTagList = res[2]?.data || [];
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        pageLoading.value = false;
      });
  });
  // 创建人
  const getCreatorList = async (showTag) => {
    try {
      const { data } = await getUserListApi(1);
      initList.creatorList = data;
      showTag && (initList.operatorList = data);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // 修改人
  const getModifierList = async (showTag) => {
    try {
      const { data } = await getUserListApi(2);
      initList.modifierList = data;
      showTag && (initList.operatorList = data);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  watch(
    () => formData.operatorType,
    (val) => {
      if (val === 'creatorList') {
        initList.operatorList = initList.creatorList;
      } else if (val === 'modifierList') {
        initList.operatorList = initList.modifierList;
      } else {
        initList.operatorList = [];
      }
    }
  );

  // 同步
  const syncLoading = ref(false);
  const handleSync = async () => {
    if (!formData.storeAcctIdList?.length)
      return ElMessage.warning('请选择店铺');
    try {
      syncLoading.value = true;
      const { data } = await syncByStoreApi(formData.storeAcctIdList);
      if (isObject(data)) {
        ElMessageBox.alert(
          `<div>总更新活动数量：${data.total || 0}</div>`,
          '同步店铺结果',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确认',
            type: 'success'
          }
        ).finally(() => {
          handleSearch();
        });
      } else {
        ElMessage.success('同步店铺操作成功');
        handleSearch();
      }
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      syncLoading.value = false;
    }
  };

  let tableData = ref();
  const tableDataLoading = ref(false);
  const tableRef = ref();
  const searchCard = ref();
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCard.value?.$el?.clientHeight;
    return clientHeight - 166 - searchCardHeight;
  });
  const paginationData = reactive({
    total: 0,
    pageSize: 50,
    pageNum: 1
  });

  const handleSearch = async () => {
    tableDataLoading.value = true;
    try {
      const obj = filterSearchParams();
      const { data, count } = await queryPageApi(obj);

      tableData.value = data;
      paginationData.total = count;
      getTabCount(count);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };
  const filterSearchParams = () => {
    const { pageSize, pageNum } = paginationData;
    const obj = {};
    // 店铺
    // if (formData.storeAcctIdList) {
    //   obj.storeAcctIdList = (formData.storeAcctIdList || []).map(
    //     (item) => item[item.length - 1]
    //   );
    // }
    // 加购优惠ID
    if (formData.addOnDealIdList) {
      obj.addOnDealIdList = formData.addOnDealIdList.split(',').map(Number);
    } else {
      obj.addOnDealIdList = [];
    }
    // 开始时间
    if (formData.startTime) {
      obj.startTimeLowerBound = new Date(formData.startTime[0]).getTime();
      obj.startTimeUpperBound = new Date(formData.startTime[1]).getTime();
    }
    // 结束时间
    if (formData.endTime) {
      obj.endTimeLowerBound = new Date(formData.endTime[0]).getTime();
      obj.endTimeUpperBound = new Date(formData.endTime[1]).getTime();
    }
    // 主商品ID
    if (formData.itemIdList) {
      obj.itemIdList = formData.itemIdList.split(',').map(Number);
    } else {
      obj.itemIdList = [];
    }
    // 加购商品
    if (formData.Ids) {
      obj[formData.idType] = formData.Ids.split(',').map(Number);
    }
    // vraiId itemId
    // 创建人 修改人
    if (formData.operator) {
      obj[formData.operatorType] = formData.operator;
    }
    // 创建时间 修改时间
    if (formData.operateTime) {
      obj[formData.operateTimeType + 'LowerBound'] = transferDate(
        formData.operateTime[0]
      );
      obj[formData.operateTimeType + 'UpperBound'] = transferDate(
        formData.operateTime[1]
      );
    }
    let params = {
      ...formData,
      promotionStatus: activeKey.value,
      ...obj,
      pageSize,
      pageNum
    };
    delete params.startTime;
    delete params.endTime;

    return params;
  };

  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount;
      }
    });
  };

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.idType = 'modelIdList';
    formData.operatorType = 'creatorList';
    formData.fortyFiveDaysSalesMin = '';
    formData.fortyFiveDaysSalesMax = '';
    formData.operateTimeType = 'createTime';
  };
  const handleTab = ({ paneName }) => {
    activeKey.value = paneName;
    handleSearch();
  };

  // // 分页处理
  const handleSizeChange = (val) => {
    paginationData.pageNum = 1;
    paginationData.pageSize = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.pageNum = val;
    handleSearch();
  };

  // 改变活动类型
  const autoRenewLoading = ref(false);
  const handlAutoRenew = async (row) => {
    autoRenewLoading.value = true;
    if (row.promotionType === 0) {
      delete row.purchaseMinSpend;
      delete row.perGiftNum;
    } else if (row.promotionType === 1 && row.promotionStatus === 'ongoing') {
      delete row.purchaseMinSpend;
      delete row.promotionPurchaseLimit;
    } else {
      delete row.promotionPurchaseLimit;
    }
    const autoRenew = row.autoRenew;
    try {
      const { data, msg } = await updateApi(row);
      if (data.success) {
        ElMessage.success(msg);
      } else {
        row.autoRenew = autoRenew ? 0 : 1;
        ElMessage.error(data.failMessage);
      }
    } catch (err) {
      row.autoRenew = autoRenew ? 0 : 1;
      ElMessage.error('设置失败');
      console.log('err :>> ', err);
    } finally {
      autoRenewLoading.value = false;
    }
  };

  // 导出 根据搜索条件导出
  // const downloadListLoading = ref(false);
  // const handledownloadList = () => {
  //   downloadListLoading.value = true;
  //   transBlob({
  //     url: '/lms/shopee/voucher/export_voucher_list',
  //     fileName: 'shopee-addOn.xlsx',
  //     contentType: 'application/json',
  //     data: filterSearchParams()
  //   })
  //     .catch((err) => {
  //       console.log('err :>> ', err);
  //     })
  //     .finally(() => {
  //       downloadListLoading.value = false;
  //     });
  // };

  // 操作日志
  const operateLogVisible = ref(false);
  const handleOperateLog = () => {
    operateLogVisible.value = true;
  };

  // 新增 修改加购优惠
  const checkedRow = ref({});
  const editVisible = ref(false);
  const handleAdd = () => {
    editVisible.value = true;
    checkedRow.value.editType = 'add';
  };
  const handleEdit = (row) => {
    checkedRow.value = row;
    checkedRow.value.editType = 'edit';
    editVisible.value = true;
  };
  const handleCopy = (row) => {
    checkedRow.value = row;
    checkedRow.value.editType = 'copy';
    editVisible.value = true;
  };
  const updateRow = (param) => {
    Object.assign(checkedRow.value, param);
  };

  // 下载
  const handledownloadTpl = (fileName) => {
    transBlob(
      {
        url: `/lms/shopee/file/template/downloadShopeeExcelTemplateByFileName?fileName=${fileName}`,
        fileName: fileName,
        contentType: 'application/json'
      },
      'GET'
    )
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {});
  };

  // 上传
  const uploadPlanSuccess = (res) => {
    if (res.code == '0000' && res.success === true) {
      ElMessageBox.confirm(res.msg || '导入成功', '导入', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      });
      // getPaymentsList();
    } else {
      ElMessageBox.confirm(res.msg || '请求失败', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };
  const uploadError = () => {
    ElMessageBox.confirm('导入失败', '错误信息', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'error'
    });
  };

  // 批量操作
  const batcgSyncActivituLoading = ref(false);
  const handleSyncActivity = async () => {
    const $table = findTable();
    const checkedList = $table.getCheckboxRecords();
    const checkedLen = checkedList.length;
    if (!checkedLen) return ElMessage.warning('请选择数据');
    try {
      batcgSyncActivituLoading.value = true;
      const params = checkedList.map((item) => item.addOnDealId);
      const { data, msg } = await syncByActivityApi(params);
      const failData = data.filter((item) => !item.syncSuccess);
      if (!failData.length) {
        ElMessage.success(msg || '操作成功');
        handleSearch();
      } else {
        const failMsg = failData
          .map(
            (item) =>
              `<span style="color:#409EFF">${item.addOnDealName}${item.addOnDealId} </span>` +
              ': ' +
              item.errMsg
          )
          .join('\n');
        const failHtml = `<div style="white-space:pre-line">${failMsg}</div>`;
        ElMessageBox.alert(failHtml || '请求失败', '报错提示', {
          confirmButtonText: '关闭',
          dangerouslyUseHTMLString: true,
          type: 'error',
          callback: () => {
            handleSearch();
          }
        });
      }
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batcgSyncActivituLoading.value = false;
    }
  };

  const batchStopLoading = ref(false);
  const handleBatchStop = () => {
    const $table = findTable();
    const checkedList = $table.getCheckboxRecords();
    const checkedLen = checkedList.length;
    if (!checkedLen) return ElMessage.warning('请选择数据');
    ElMessageBox.confirm(
      '加购优惠活动终止后，无法重启，连续加购优惠活动不会自动续期。请问确定终止吗？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      batchStopLoading.value = true;
      try {
        const params = checkedList.map((item) => ({
          storeAcctId: item.storeAcctId,
          addOnDealId: item.addOnDealId
        }));
        const { data, msg } = await endAddOnApi(params);
        const failData = data.filter((item) => !item.success);
        if (!failData.length) {
          ElMessage.success(msg || '操作成功');
          handleSearch();
        } else {
          const failMsg = failData
            .map(
              (item) =>
                `<span style="color:#409EFF">${item.addOnDealId}</span>` +
                ': ' +
                item.failMessage
            )
            .join('\n');
          const failHtml = `<div style="white-space:pre-line">${failMsg}</div>`;
          ElMessageBox.alert(failHtml || '请求失败', '报错提示', {
            confirmButtonText: '关闭',
            dangerouslyUseHTMLString: true,
            type: 'error',
            callback: () => {
              handleSearch();
            }
          });
        }
      } catch (err) {
        console.log('err :>> ', err);
      } finally {
        batchStopLoading.value = false;
      }
    });
  };
  const batchDelLoading = ref(false);
  const handleBatchDel = async () => {
    const $table = findTable();
    const checkedList = $table.getCheckboxRecords();
    const checkedLen = checkedList.length;
    if (!checkedLen) return ElMessage.warning('请选择数据');
    ElMessageBox.confirm(
      '加购优惠活动删除后无法恢复，且无法查看活动信息。请问确定删除吗？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      batchDelLoading.value = true;
      try {
        const params = checkedList.map((item) => ({
          storeAcctId: item.storeAcctId,
          addOnDealId: item.addOnDealId
        }));
        const { data, msg } = await delAddOnApi(params);
        const failData = data.filter((item) => !item.success);
        if (!failData.length) {
          ElMessage.success(msg || '操作成功');
          handleSearch();
        } else {
          const failMsg = failData
            .map(
              (item) =>
                `<span style="color:#409EFF">${item.addOnDealId}</span>` +
                ': ' +
                item.failMessage
            )
            .join('\n');
          const failHtml = `<div style="white-space:pre-line">${failMsg}</div>`;
          ElMessageBox.alert(failHtml, '报错提示', {
            confirmButtonText: '关闭',
            dangerouslyUseHTMLString: true,
            type: 'error',
            callback: () => {
              handleSearch();
            }
          });
        }
      } catch (err) {
        console.log('err :>> ', err);
      } finally {
        batchDelLoading.value = false;
      }
    });
  };

  const delLoading = ref(false);
  const handleDel = async (row) => {
    delLoading.value = true;
    const $table = findTable();
    try {
      const { data, msg } = await delAddOnApi([
        {
          storeAcctId: row.storeAcctId,
          addOnDealId: row.addOnDealId
        }
      ]);
      const failData = data.filter((item) => !item.success);
      if (!failData.length) {
        ElMessage.success(msg || '操作成功');
        $table.remove(row);
        paginationData.total = paginationData.total - 1;
      } else {
        ElMessageBox.alert(data[0].failMessage, '报错提示', {
          confirmButtonText: '关闭',
          type: 'error'
        });
      }
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      delLoading.value = false;
    }
  };
  const stopLoading = ref(false);
  const handleStop = async (row) => {
    const $table = findTable();
    stopLoading.value = true;
    try {
      const { data, msg } = await endAddOnApi([
        {
          storeAcctId: row.storeAcctId,
          addOnDealId: row.addOnDealId
        }
      ]);
      const failData = data.filter((item) => !item.success);
      if (!failData.length) {
        ElMessage.success(msg || '操作成功');
        $table.remove(row);
        paginationData.total = paginationData.total - 1;
      } else {
        ElMessageBox.alert(data[0].failMessage, '报错提示', {
          confirmButtonText: '关闭',
          type: 'error'
        });
      }
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      stopLoading.value = false;
    }
  };

  const findTable = () => {
    const $table = tableRef.value;
    // const tableIndex = tabList.value.findIndex(
    //   (item) => item.status === activeKey.value
    // );
    // return $table[tableIndex];
    return $table;
  };
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
