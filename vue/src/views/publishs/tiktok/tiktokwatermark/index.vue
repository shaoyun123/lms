<template>
  <!-- tiktok 水印 -->
  <div class="app-container" :loading="pageLoading">
    <el-card ref="searchCard" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item
          label="店铺"
          prop="storeAcctId"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.storeAcctId"
            :options="initList.storeList"
            filterable
            clearable
            collapse-tags
            :props="{
              emitPath: false
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="水印类型" prop="watermarkType">
          <el-select v-model="formData.watermarkType" clearable>
            <el-option label="图片水印" :value="0" />
            <el-option label="文字水印" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否平铺" prop="layout">
          <el-select v-model="formData.layout" clearable>
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="tableDataLoading"
            type="primary"
            @click="handleSearch(formRef)"
            >查询</el-button
          ><el-button type="primary" @click="handleResetForm(formRef)"
            >重置</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card v-loading="tableDataLoading" class="list_card">
      <div class="page-header">
        <div class="common_batch_btns">
          <div>
            <el-button
              class="ml12"
              type="primary"
              @click="handleDetail({}, 'new')"
              >新增</el-button
            >
          </div>
        </div>
      </div>
      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <template #watermarkType_default="{ row }">
          <div v-if="row.watermarkType == 0">图片水印</div>
          <div v-if="row.watermarkType == 1">文字水印</div>
        </template>
        <template #storeAcct_default="{ row }">
          <span v-if="row.storeAcct == 'tiktok所有店铺'">tiktok所有店铺</span>
          <span
            v-for="item in row.storeAuthorityDtos"
            v-else
            :key="item.storeAcctId"
            :style="[item.haveAccess ? 'color: #000000' : 'color: #aaaaaa']"
          >
            {{ item.storeName }},
          </span>
        </template>
        <template #watermarkFontContent_default="{ row }">
          <div v-if="row.watermarkType == 0">
            <img :src="row.watermarkUrl" width="80" style="margin: 10px" />
          </div>
          <div v-if="row.watermarkType == 1">
            {{ row.watermarkFontContent }}
          </div>
        </template>
        <template #layout_default="{ row }">
          <div v-if="row.layout == 1">是</div>
          <div v-if="row.layout == 0">否</div>
        </template>
        <template #toolbar_default="{ row }">
          <div class="toolbar-btn">
            <div v-permission="['tiktok_rules_list_edit']">
              <el-button type="primary" @click="handleDetail(row, 'edit')"
                >编辑</el-button
              >
            </div>
            <div v-permission="['tiktok_rules_list_edit']">
              <el-popconfirm
                title="是否确认删除当前水印，删除后无法恢复！"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelWatermark(row)"
              >
                <template #reference>
                  <div>
                    <el-button type="danger">删除</el-button>
                  </div>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>
      </vxe-grid>
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
    <DetailDialog
      v-if="detailVisible"
      v-model="detailVisible"
      :checked-row="checkedRow"
      :init-list="initList"
      @handle-search="handleSearch"
    />
  </div>
</template>

<script setup name="publishstiktoktiktokwatermark">
  import { reactive, ref, computed, onMounted } from 'vue';
  // import ZCascader from '@/components/ZCascader/index.vue';
  import { getStoreList } from '@/api/common';
  import { ElMessage } from 'element-plus';
  import DetailDialog from './components/DetailDialog.vue';
  import {
    queryListApi,
    deleteWatermarkApi
  } from '@/api/publishs/tiktokwatermark';
  import useUserStore from '@/store/modules/user';

  const formData = reactive({});
  const formRef = ref();
  const initList = ref({});
  const pageLoading = ref(false);
  const gridOptions = reactive({
    border: true,
    height: '400',
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    scrollY: { enabled: false },
    columns: [
      //   {
      //     type: 'checkbox',
      //     width: 60
      //   },
      {
        field: 'storeAcct',
        title: '账号',
        slots: {
          default: 'storeAcct_default'
        }
      },
      {
        field: 'watermarkTemplateName',
        title: '模板名称'
      },
      {
        field: 'watermarkType',
        title: '水印类型',
        slots: {
          default: 'watermarkType_default'
        }
      },
      {
        field: 'watermarkFontContent',
        title: '水印',
        slots: {
          default: 'watermarkFontContent_default'
        }
      },
      {
        field: 'layout',
        title: '是否平铺',
        width: 90,
        slots: {
          default: 'layout_default'
        }
      },
      {
        title: '操作',
        width: 150,
        slots: {
          default: 'toolbar_default'
        }
      }
    ],
    data: [],
    toolbarConfig: {
      custom: true
    }
  });
  onMounted(async () => {
    pageLoading.value = true;

    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCard?.value?.$el?.clientHeight;
    gridOptions.height = clientHeight - 120 - searchCardHeight;
    Promise.all([getStoreList('tiktok')])
      .then((res) => {
        initList.value.storeList = res[0]?.data?.children || [];
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        pageLoading.value = false;
      });
    handleSearch();
  });

  const tableDataLoading = ref(false);
  const tableRef = ref();
  const searchCard = ref();
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });

  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  const handleSearch = async () => {
    tableDataLoading.value = true;
    try {
      const obj = filterSearchParams();
      obj.platCode = 'tiktok';
      obj.lmsAppUserName = userName.value;
      const { data, count } = await queryListApi(obj);
      gridOptions.data = data;
      paginationData.total = count;
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
    } finally {
      tableDataLoading.value = false;
    }
  };
  const filterSearchParams = () => {
    const { limit, page } = paginationData;
    const obj = {};
    // 店铺
    if (formData.storeAcctIdList) {
      obj.storeAcctIdList = formData.storeAcctIdList || [];
    }
    let params = {
      ...formData,
      ...obj,
      limit,
      page
    };

    return params;
  };

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleSearch();
  };

  const checkedRow = ref();
  const detailVisible = ref(false);
  const handleDetail = (row, operationType) => {
    detailVisible.value = true;
    checkedRow.value = {
      ...row,
      operationType
    };
  };
  // 删除
  const handleDelWatermark = async (row) => {
    try {
      const { msg } = await deleteWatermarkApi([row.id]);
      ElMessage.success(msg);
      tableRef.value.remove(row);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
