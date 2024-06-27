<template>
  <div class="app-container forceprices-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form :model="formData" class="search_form" :inline="true">
        <el-form-item label="品牌">
          <el-input
            v-model="formData.brand"
            placeholder="单个模糊查询"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="授权平台">
          <el-select
            v-model="formData.platNameList"
            class="form_plat"
            placeholder="请选择"
            clearable
            filterable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
          >
            <el-option
              v-for="item in platNameList"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权店铺">
          <el-select
            v-model="formData.storeAcctName"
            placeholder="请选择"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteHandleStoreAcctName"
            :loading="storeLoading"
          >
            <el-option
              v-for="item in storeList"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板父SKU">
          <el-input v-model="formData.tempPSkuStr" clearable></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-select
            v-model="formData.creator"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in creatorList"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="searchLoading"
            @click="handleQuery"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="common_split_bottom list_card">
      <div class="card-tool">
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button type="primary" @click="updateAuth(1, {})">新增</el-button>
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
        <vxe-column field="brand" title="品牌" width="150">
          <template #default="{ row }">
            <div>
              {{ row.brand }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="模板父SKU" width="150">
          <template #default="{ row }">
            <div>
              {{ row.prodBrandAuthorizationTemps }}
            </div>
          </template>
        </vxe-column>
        <vxe-column field="company" title="授权公司"></vxe-column>
        <vxe-column
          field="prodBrandAuthorizationPlats"
          title="授权平台"
        ></vxe-column>
        <vxe-column field="prodBrandAuthorizationStores" title="授权店铺">
          <template #default="{ row }">
            <div>
              <el-tooltip effect="dark" content="点击复制" placement="left">
                <div
                  class="showOneLine"
                  @click="copy(row.prodBrandAuthorizationStores)"
                >
                  {{ row.prodBrandAuthorizationStores }}
                </div>
              </el-tooltip>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="priceAfter" title="授权证书">
          <template #default="{ row }">
            <div>
              <!-- 如果是图片 -->
              <div
                v-if="getFileType(row.certificatePath) === 'image'"
                class="flex-center"
              >
                <ImagePop
                  :src="row.certificatePath"
                  width="60px"
                  height="60px"
                />
              </div>
              <!-- 如果是文件 -->
              <div v-else class="showOneLine">
                <a :href="row.certificatePath" target="_blank">{{
                  row.certificatePath
                }}</a>
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注">
          <template #default="{ row }">
            <div>
              <el-tooltip
                effect="dark"
                :content="row.remark"
                placement="bottom"
              >
                <div class="showOneLine">{{ row.remark }}</div>
              </el-tooltip>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="人员">
          <template #default="{ row }">
            <div>创建: {{ row.creator }}</div>
            <div>修改: {{ row.modifier }}</div>
          </template>
        </vxe-column>
        <vxe-column title="时间" width="180">
          <template #default="{ row }">
            <div>创建: {{ transferDate(row.createTime) }}</div>
            <div>修改: {{ transferDate(row.modifyTime) }}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="updateAuth(0, row)"
              >编辑</el-button
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

    <!-- 新增修改品牌授权 -->
    <UpdateBrandAuth
      v-model="updateAuthVisible"
      :is-edit="isEdit"
      :select-id="selectId"
      @handle-search="handleQuery"
    />

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

<script setup name="productbrandauthorization">
  import { ref, reactive, onMounted, computed } from 'vue';
  import {
    prodBrandQueryByConditionApi,
    queryAllPlatNameApi,
    queryAllCreatorApi,
    queryAllPossibleStoreAcctApi
  } from '@/api/brand/goodsBrandAuth';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transferDate, getFileType } from '@/utils/common';
  import { transBlob } from '@/utils/downloadFile';
  import { omit } from 'lodash-es';
  import UpdateBrandAuth from './components/UpdateBrandAuth.vue';
  import { copy } from '@/utils/common';
  import ImagePop from '@/components/ImagePop/index.vue';

  const formData = reactive({
    brand: '', // 品牌
    platNameList: [], // 平台
    storeAcctName: '', // 店铺
    tempPSkuList: '', // 模板父SKU
    tempPSkuStr: '',
    creator: '' // 创建人
  });

  const paginationData = reactive({
    page: 1,
    limit: 100,
    total: 0
  });
  const tableData = ref([]); // 列表数据

  // 按钮 loading
  const searchLoading = ref(false);
  const tableLoading = ref(false);

  onMounted(() => {
    getQueryAllPlatNameList();
    getQueryAllCreatorList();
  });

  // 获取所有平台
  const platNameList = ref(false);
  const getQueryAllPlatNameList = async () => {
    const { data } = await queryAllPlatNameApi();
    platNameList.value = data;
  };

  // 获取创建人列表
  const creatorList = ref(false);
  const getQueryAllCreatorList = async () => {
    const { data } = await queryAllCreatorApi();
    creatorList.value = data;
  };

  // 获取远程搜索店铺列表
  const storeLoading = ref(false);
  const storeList = ref(false);
  const remoteHandleStoreAcctName = async (val) => {
    storeLoading.value = true;
    const { data } = await queryAllPossibleStoreAcctApi({
      storeAcctName: val
    }).finally(() => (storeLoading.value = false));
    storeList.value = data;
  };

  // 查询列表
  const handleQuery = async () => {
    searchLoading.value = true;
    formData.tempPSkuList = formData.tempPSkuStr
      .split(',')
      .filter((item) => item !== '');
    const params = omit(formData, ['tempPSkuStr']);
    const { data, count } = await prodBrandQueryByConditionApi({
      ...params,
      pageNo: paginationData.page,
      pageSize: paginationData.limit
    }).finally(() => {
      searchLoading.value = false;
    });

    tableData.value = data;
    paginationData.total = count;
  };

  const selectId = ref(null); // 当前行修改选中的id
  const isEdit = ref(false);
  const updateAuthVisible = ref(false);

  // 新增修改弹窗
  const updateAuth = (type, row) => {
    // 编辑
    if (!type) {
      isEdit.value = true;
      selectId.value = row.id;
    } else {
      // 新增
      isEdit.value = false;
    }
    updateAuthVisible.value = true;
  };

  const tableRef = ref(null);

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

  const showImportDialog = ref(false);
  const importList = ref([]);

  // 导出
  const handleExport = async () => {
    await ElMessageBox.confirm('确认导出当前搜索条件下的品牌授权吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const params = omit(formData, ['tempPSkuStr']);
    try {
      searchLoading.value = true;
      transBlob({
        url: '/lms/prodBrand/exportProdBrandAuthorization',
        contentType: 'application/json',
        data: params,
        fileName: '品牌授权导出' + Date.now() + '.xls'
      }).finally(() => {
        searchLoading.value = false;
        ElMessage.success('导出成功');
      });
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style lang="scss" scoped>
  .card-tool {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .showOneLine {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .flex-center {
    padding: 10px;
    display: flex;
    align-items: center;
  }
  .form_plat {
    width: 140px;
    :deep(.el-input) {
      width: 140px !important;
    }
  }
</style>
