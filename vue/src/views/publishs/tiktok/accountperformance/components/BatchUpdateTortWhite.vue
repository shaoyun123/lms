<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="侵权处理白名单管理"
      width="50%"
      style="height: 80%"
      :close-on-click-modal="false"
    >
      <div>
        <div class="tort_tips">
          商品违规侵权处理规则: 除下述白名单商品外,当商品违规积分大于等于
          <span class="tort_num">4</span>
          时,将标记为TikTok侵权
        </div>
        <div class="tort_tool">
          <el-button type="primary" @click="handleExport">导出数据</el-button>
          <div>
            <el-input
              v-model="formData.prodPSkuList"
              clearable
              style="width: 200px"
              class="mr_10"
              placeholder="请输入商品父sku, 支持输入多个"
            />
            <el-input
              v-model="formData.remark"
              clearable
              style="width: 200px"
              class="mr_10"
              :maxlength="50"
              placeholder="请输入备注"
            />
            <el-button class="mr_10" type="primary" @click="handleAdd"
              >新增</el-button
            >
            <el-button type="primary" @click="handleDelete({}, 1)"
              >批量移除</el-button
            >
          </div>
        </div>
        <vxe-table
          ref="tableRef"
          :data="tableData"
          :height="550"
          :loading="loading"
          border
          :edit-config="{
            trigger: 'click',
            mode: 'cell'
          }"
          :row-config="{ isCurrent: true, isHover: true }"
          :column-config="{ resizable: true }"
        >
          <vxe-column type="checkbox" width="40" />
          <vxe-column
            field="prodPSku"
            title="白名单商品"
            width="150"
            :filters="[{}]"
            :filter-method="filterGoodsOrRemark"
            :filter-reset-method="filterResetGoodsOrRemark"
          >
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <el-input
                  v-model="option.data"
                  placeholder="请输入"
                  clearable
                  @input="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>
          <vxe-column
            field="creator"
            title="创建人"
            width="150"
            :filters="[{}]"
            :filter-method="filterCreator"
            :filter-reset-method="filterResetCreator"
          >
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <ZSelectPanel
                  v-model="option.data"
                  :items="creatorList"
                  @change="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>
          <vxe-column
            field="createTime"
            title="创建时间"
            width="150"
            :filters="[{ time: [] }]"
            :filter-method="filterRange"
            :filter-reset-method="filterResetRange"
          >
            <template #default="{ row }">
              {{ transferDate(row.createTime) }}
              <el-tag v-if="row.isSale === 0" type="danger">停</el-tag>
            </template>
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="disflex_between m10"
              >
                <el-date-picker
                  v-model="option.time"
                  value-format="YYYY-MM-DD"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  style="width: 200px"
                  class="form_right"
                  :shortcuts="shortcuts"
                  @change="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>
          <vxe-column
            field="remark"
            title="备注"
            :edit-render="{}"
            :filters="[{}]"
            :filter-method="filterGoodsOrRemark"
            :filter-reset-method="filterResetGoodsOrRemark"
          >
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <el-input
                  v-model="option.data"
                  clearable
                  placeholder="请输入"
                  @input="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
            <template #default="{ row }">
              <div class="flex-center">
                <div class="remark_container">
                  {{ row.remark }}
                </div>
              </div>
            </template>
            <template #edit="{ row }">
              <vxe-textarea
                v-model="row.remark"
                v-loading="row?.remarkLoading"
                :autosize="{ minRows: 1, maxRows: 10 }"
                :maxlength="50"
                resize="vertical"
                @blur="handleChangeRemark(row)"
              ></vxe-textarea>
            </template>
          </vxe-column>
          <vxe-column field="result" title="操作" width="120">
            <template #default="{ row }">
              <el-button link type="danger" @click="handleDelete(row, 0)"
                >移除</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref, watch, computed, reactive } from 'vue';
  import { transferDate } from '@/utils/common';
  import { shortcuts } from '@/api/common';
  import { transBlob } from '@/utils/downloadFile';
  import ZSelectPanel from '@/components/ZSelectPanel/index.vue';
  import {
    listTortWhiteListApi,
    addTortWhiteListApi,
    deleteByIdApi,
    updateTortWhiteListRemarkApi,
    listTortWhiteListCreatorApi
  } from '@/api/publishs/tiktokaccountperformance';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const formData = reactive({
    prodPSkuList: [],
    remark: ''
  });

  const tableRef = ref();
  const totalCount = ref();
  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleSearch();
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
        resetForm();
        needFresh.value = false;
      }
    }
  );

  const tableData = ref([]);

  const handleSearch = async () => {
    try {
      loading.value = true;
      const { data, count } = await listTortWhiteListApi();
      tableData.value = data.map((item) => {
        item.remarkLoading = false;
        return item;
      });
      totalCount.value = count;
      // 根据表格数据 重新更新一下所有创建人下拉列表
      getCreatorList();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      loading.value = false;
    }
  };

  // 获取所有创建人
  const creatorList = ref([]);
  const getCreatorList = async () => {
    const { data } = await listTortWhiteListCreatorApi();
    creatorList.value = data.map((item) => {
      return {
        name: item,
        id: item
      };
    });
  };

  // 新增
  const handleAdd = async () => {
    if (formData.prodPSkuList === '' || !formData.prodPSkuList.length) {
      return ElMessage.warning('请输入商品父sku!');
    }
    formData.prodPSkuList = formData.prodPSkuList.split(',');
    const { code, msg } = await addTortWhiteListApi({
      ...formData
    });
    if (code === '0000') {
      handleSearch();
      ElMessage.warning(msg);
      // 清空查询数据
      resetForm();
    }
  };

  // 点击备注单元格编辑
  const handleChangeRemark = async (row) => {
    row.remarkLoading = true;
    try {
      const { msg } = await updateTortWhiteListRemarkApi({
        id: row.id,
        remark: row.remark
      }).finally(() => (row.remarkLoading = false));
      ElMessage.success(msg);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  // 白名单商品/备注模糊筛选
  // const result = ref(true);
  const filterGoodsOrRemark = ({ option, cellValue }) => {
    // 判断有没有多个逗号隔开
    if (option.data && option.data.includes(',')) {
      let result = false;
      option.data?.split(',').forEach((item) => {
        if (cellValue.includes(item)) {
          result = true;
        }
      });
      return result;
    } else {
      if (cellValue.includes(option.data)) {
        return true;
      }
    }
    return false;
  };

  const filterResetGoodsOrRemark = ({ options }) => {
    options[0].data = [];
  };

  // 创建人筛选
  const filterCreator = ({ option, cellValue }) => {
    if (option.data && option.data.length && option.data.includes(cellValue)) {
      return true;
    }
    return false;
  };

  // 创建人筛选重置
  const filterResetCreator = ({ options }) => {
    options[0].data = [];
  };

  // 时间筛选项
  const filterRange = ({ option, cellValue }) => {
    const time = option.time;
    // debugger;
    if (time.length) {
      const [startTime, endTime] = time;
      const start = new Date(startTime + ' 00:00:00').getTime();
      const end = new Date(endTime + ' 23:59:59').getTime();
      if (cellValue <= end && cellValue >= start) {
        return true;
      }
    }
    return false;
  };

  // 清空时间筛选项
  const filterResetRange = ({ options }) => {
    options[0].time = [];
  };

  // 批量移除/单个移除
  const checkedId = ref([]);
  const handleDelete = async (row, type) => {
    // type 0 单个 1 批量
    if (type) {
      const checkedList = tableRef.value.getCheckboxRecords();
      if (!checkedList.length) {
        return ElMessage.warning('请选择数据！');
      } else {
        checkedId.value = checkedList.map((item) => item.id);
      }
    } else {
      checkedId.value = [row.id];
    }

    ElMessageBox.confirm(`请再次确认是否移除?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'Warning'
    }).then(async () => {
      const { code, msg } = await deleteByIdApi(checkedId.value);
      if (code === '0000') {
        ElMessage.success(msg);
        handleSearch();
      } else {
        ElMessage.warning(msg);
      }
    });
  };

  // 批量导出(默认所有)
  const loading = ref(false);
  const handleExport = () => {
    loading.value = true;
    transBlob({
      fileName: 'TikTok违规白名单导出文件.xlsx',
      url: '/lms/tiktok/accountPerformance/exportTortWhiteList',
      contentType: 'application/json'
    })
      .then(() => {
        loading.value = false;
        ElMessage.success('导出成功');
      })
      .finally(() => (loading.value = false));
  };

  // 清空表单数据
  const resetForm = () => {
    formData.prodPSkuList = [];
    formData.remark = '';
  };
</script>

<style lang="scss" scoped>
  .tort_tips {
    font-weight: bold;
    .tort_num {
      color: red;
    }
  }
  .tort_tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0 10px;
  }
  .mr_10 {
    margin-right: 10px;
  }
  .m10 {
    margin: 10px;
  }
  .p10 {
    padding: 10px;
  }
  .disflex_between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
