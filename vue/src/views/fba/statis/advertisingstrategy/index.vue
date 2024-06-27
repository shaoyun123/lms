<template>
  <div v-loading="pageLoading" class="publish_wrapper app-container">
    <el-card ref="searchCard" class="search_card common_split_bottom">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="站点">
          <el-select v-model="formData.siteId" filterable clearable>
            <el-option
              v-for="item in allAmazonSiteOption"
              :key="item.siteId"
              :label="item.siteName"
              :value="item.siteId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="广告活动ID">
          <el-input
            v-model="formData.campaignIdStr"
            placeholder="支持多个逗号隔开"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="card_position list_card common_split_bottom">
      <el-tabs v-model="activeKey" type="card" @tab-click="handleTab">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.label"
          :label="`${item.label}(${item.count})`"
          :name="item.status"
        >
          <vxe-table
            ref="tableRef"
            :data="tableData"
            :height="height"
            border
            show-overflow
            :row-config="{
              isCurrent: true,
              isHover: true,
              keyField: 'productId'
            }"
            :column-config="{ resizable: true }"
            :scroll-y="{ gt: 10 }"
            :edit-config="editConfig"
            @cell-click="handleCellClick"
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column field="campaignId" title="广告活动ID" />
            <vxe-column field="campaignName" title="广告活动名" />
            <vxe-column field="salesSite" title="站点" />
            <vxe-column field="storeAcct" title="所属店铺" />
            <vxe-column field="targetAcos" title="目标ACOS" width="280"
              ><template #default="{ row }">
                <el-input
                  v-if="row.acosIsShowInput"
                  ref="acosInputRef"
                  v-model="row.targetAcosInput"
                  autofocus
                  @blur="changeAcos(row)"
                />
                <span v-else>{{ row.targetAcos }}</span>
              </template></vxe-column
            >
            <vxe-column field="remark" title="备注" width="280"
              ><template #default="{ row }">
                <el-input
                  v-if="row.remarkIsShowInput"
                  ref="remarkInputRef"
                  v-model="row.remarkInput"
                  :row="4"
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                  autofocus
                  @blur="changeRemark(row)"
                />
                <span v-else>{{ row.remark }}</span>
              </template></vxe-column
            >
            <vxe-column field="createTime" title="时间"
              ><template #default="{ row }">
                <div>
                  <p>创建: {{ transferDate(row.createTime) }}</p>
                  <p>修改: {{ transferDate(row.modifyTime) }}</p>
                </div></template
              ></vxe-column
            >
            <vxe-column field="creator" title="操作人"
              ><template #default="{ row }">
                <div>
                  <p>创建: {{ row.creator }}</p>
                  <p>修改: {{ row.modifier }}</p>
                </div>
              </template></vxe-column
            >

            <vxe-column title="操作" width="100">
              <template #default="{ row }">
                <el-switch
                  v-model="row.status"
                  :active-value="1"
                  :inactive-value="0"
                  inline-prompt
                  active-text="停用"
                  inactive-text="启用"
                  @change="changeRadio(row)"
                />
              </template>
            </vxe-column>
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="paginationData.page"
              v-model:page-size="paginationData.limit"
              background
              :page-sizes="[50, 100, 300, 1000]"
              :small="true"
              layout="total, sizes, prev, pager, next"
              :total="paginationData.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn">
        <div>
          <el-button type="primary" @click="batchUpdateAcos()"
            >批量修改目标ACOS</el-button
          >
          <el-button type="primary" @click="batchUpdateAdv()"
            >新增广告活动</el-button
          >
        </div>
      </div>
    </el-card>
    <!-- 新增广告活动 -->
    <UpdateAdvActivity
      v-model="batchUpdateAcosVisible"
      :title="title"
      :checked-id-list="checkedIdList"
      @handleSearch="handleSearch"
    />
  </div>
</template>
<script setup name="fbastatisadvertisingstrategy">
  import { reactive, onMounted, ref, computed, nextTick } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    getListStrategyCampaignApi,
    getAllAmazonSiteApi,
    enableOrDisableApi,
    batchSetAcosApi,
    saveOrUpdateApi
  } from '@/api/publishs/advertisingstrategy';
  import { transferDate } from '@/utils/common';

  import UpdateAdvActivity from './components/UpdateAdvActivity.vue';
  const pageLoading = ref(false);

  onMounted(async () => {
    getAllAmazonSite();
  });

  const formRef = ref();
  const formData = reactive({
    siteId: '',
    campaignIdStr: ''
  });

  const remarkInputRef = ref();
  const acosInputRef = ref();

  // 点击表格获取焦点
  const handleCellClick = (params) => {
    const { row, column } = params;
    if (column.field === 'targetAcos') {
      row.acosIsShowInput = true;
      nextTick(() => {
        acosInputRef.value.forEach((dom) => {
          dom.focus();
        });
      });
    }
    if (column.field === 'remark') {
      row.remarkIsShowInput = true;
      nextTick(() => {
        remarkInputRef.value.forEach((dom) => {
          dom.focus();
        });
      });
    }
  };

  const formatAcos = (num) => {
    return Number(num).toFixed(2);
  };

  // 点击单元格单个修改ACOS
  const changeAcos = async (row) => {
    if (isNaN(row.targetAcosInput)) {
      row.acosIsShowInput = false;
      row.targetAcosInput = row.targetAcos;
      return ElMessage.warning('请输入数字！');
    }

    if (Number(row.targetAcosInput) >= 1 || Number(row.targetAcosInput) <= 0) {
      row.acosIsShowInput = false;
      row.targetAcosInput = row.targetAcos;
      return ElMessage.warning('目标ACOS必须大于0且小于1！');
    }

    if (row.targetAcosInput && row.targetAcos !== row.targetAcosInput) {
      const params = [
        {
          id: row.id,
          targetAcos: formatAcos(row.targetAcosInput)
        }
      ];
      const { code, msg } = await batchSetAcosApi(params);
      if (code === '0000') {
        ElMessage.success(msg);
        paginationData.page = 1;
        row.targetAcos = formatAcos(row.targetAcosInput);
        handleSearch();
      } else {
        ElMessage.warning(msg);
      }
    }
    row.acosIsShowInput = false;
    row.targetAcosInput = row.targetAcos;
  };

  // 点击单元格单个修改备注
  const changeRemark = async (row) => {
    if (row.remark !== row.remarkInput) {
      const { code, msg } = await saveOrUpdateApi({
        id: row.id,
        remark: row.remarkInput
      });
      if (code === '0000') {
        ElMessage.success(msg);
        row.remark = row.remarkInput;
        handleSearch();
      } else {
        ElMessage.warning(msg);
      }
    }
    row.remarkIsShowInput = false;
  };

  const editConfig = {
    trigger: 'manual',
    mode: 'cell'
  };

  const activeKey = ref(1);
  const tabList = ref([
    { label: '启用中', count: 0, status: 1 },
    { label: '已停用', count: 0, status: 0 }
  ]);

  let tableData = ref([]);
  const tableRef = ref();
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });

  const searchCard = ref();
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCard.value?.$el?.clientHeight;
    return clientHeight - 167 - searchCardHeight;
  });

  // 获取站点枚举
  const allAmazonSiteOption = ref([]);
  const getAllAmazonSite = async () => {
    const { data } = await getAllAmazonSiteApi();
    allAmazonSiteOption.value = data.amzonSiteList;
  };

  // 查询
  const handleSearch = async (page) => {
    if (page === 1) {
      paginationData.page = page;
    }
    const { data, count } = await getListStrategyCampaignApi({
      ...formData,
      page: paginationData.page,
      limit: paginationData.limit,
      status: activeKey.value
    });
    tableData.value = data.map((item) => {
      item.acosIsShowInput = false;
      item.remarkIsShowInput = false;
      item.targetAcosInput = item.targetAcos;
      item.remarkInput = item.remark;
      return item;
    });
    paginationData.total = count;
    getTabCount(count);
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount;
      }
    });
  };

  const tabIndex = ref(0);
  // 切换 tab
  const handleTab = (tab) => {
    activeKey.value = tab.props.name;
    tabIndex.value = tab.index;
    handleSearch();
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

  // 启用禁用
  const changeRadio = async (row) => {
    const { code, msg } = await enableOrDisableApi({
      id: row.id,
      status: row.status
    });
    if (code === '0000') {
      ElMessage.success(msg);
      handleSearch();
    } else {
      ElMessage.warning(msg);
    }
  };

  const title = ref('');

  // 批量修改ACOS
  const checkedIdList = ref(null);
  const batchUpdateAcosVisible = ref(false);
  const batchUpdateAcos = () => {
    const checkedList = tableRef.value[tabIndex.value].getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择广告活动！');
    }
    checkedIdList.value = checkedList.map((item) => item.id);

    batchUpdateAcosVisible.value = true;
    title.value = '批量修改目标ACOS';
  };

  const batchUpdateAdv = () => {
    title.value = '新增广告活动';
    batchUpdateAcosVisible.value = true;
  };
</script>

<style lang="scss" scoped>
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
</style>
