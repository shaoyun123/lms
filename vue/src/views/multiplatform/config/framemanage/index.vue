<template>
  <div class="frame_container app-container">
    <el-card class="common_split_bottom search_card">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-form-item label="框号">
          <el-input
            v-model="formData.frameCodeListStr"
            placeholder="精确查询，多个以,分割"
          />
        </el-form-item>
        <el-form-item label="框子尺寸">
          <el-select v-model="formData.size" filterable>
            <el-option
              v-for="item in sizeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="通道">
          <el-input v-model="formData.passage" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="仓库名称">
          <el-select v-model="formData.warehouseName" filterable clearable>
            <el-option
              v-for="item in storeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="框子状态">
          <el-select v-model="formData.ifOccupy" filterable>
            <el-option
              v-for="item in ifOccupyList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="common_split_bottom list_card">
      <template #header>
        <div class="header_container">
          <div>
            <span>数量:({{ tableData.length }})</span>
            <el-tag>已用:{{ usedNum }}</el-tag>
            <el-tag type="success">总:{{ totalNum }}</el-tag>
          </div>
          <div>
            <el-button type="primary" @click="handleAddBox">添加框子</el-button>
            <el-button type="primary" @click="handlePrint(true)"
              >批量打印</el-button
            >
            <el-button type="danger" @click="handleBatchDel"
              >批量删除</el-button
            >
            <el-button type="primary" @click="handlebatchUpdate"
              >批量修改</el-button
            >
          </div>
        </div>
      </template>
      <div>
        <vxe-table
          ref="frameTable"
          v-loading="loading"
          :height="height"
          border
          align="center"
          :data="tableData"
          show-overflow
          :row-config="{ isCurrent: true, isHover: true, height: 60 }"
        >
          <vxe-column type="checkbox" width="60"></vxe-column>
          <vxe-column field="code" title="框子编号"></vxe-column>
          <vxe-column field="size" title="框子尺寸"></vxe-column>
          <vxe-column field="warehouseName" title="仓库名称"></vxe-column>
          <vxe-column field="passage" title="通道"></vxe-column>
          <vxe-column
            field="ifOccupy"
            title="适用状态"
            :formatter="formatterStatus"
          ></vxe-column>
          <vxe-column field="creator" title="创建人"></vxe-column>
          <vxe-column v-slot="{ row }" field="time" title="时间">
            <div>创建: {{ transferDate(row.createTime) }}</div>
            <div>修改: {{ transferDate(row.modifyTime) }}</div>
          </vxe-column>
          <vxe-column title="操作">
            <template #default="{ row }">
              <el-button link type="primary" @click="handlePrint(false, row)"
                >打印</el-button
              >
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="QuestionFilled"
                icon-color="rgb(255, 153, 0)"
                title="确定要删除该条数据吗"
                @confirm="handleDel(row)"
              >
                <template #reference>
                  <el-button link type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </el-card>
    <edit-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :checked-data="checkedData"
      :store-list="storeList"
      @handle-search="handleSearch"
    />
  </div>
</template>

<script setup name="multiplatformconfigframemanage">
  import { reactive, ref, computed, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { QuestionFilled } from '@element-plus/icons-vue';
  import { queryPage, del, getRepoName } from '@/api/multiplatform/framemanage';
  import { epeanPrint_plugin_fun } from '@/utils/print';
  import { transferDate } from '@/utils/common';
  import EditDialog from './components/EditDialog.vue';
  const formData = reactive({});
  const loading = ref(false);
  const sizeList = [
    { label: '全部', value: '' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: '无尺寸', value: '无' }
  ];
  const ifOccupyList = [
    { label: '全部', value: '' },
    { label: '未占用', value: 0 },
    { label: '已占用', value: 1 }
  ];
  const usedNum = ref();
  const totalNum = ref();
  const tableData = ref([]);
  const frameTable = ref();
  const dialogVisible = ref(false);
  const checkedData = ref([]);
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 177;
  });

  onMounted(() => {
    getRepoNameList();
  });
  // 查询
  const handleSearch = async () => {
    loading.value = true;
    try {
      const { data } = await queryPage(formData);
      loading.value = false;
      usedNum.value = data.totalNum - data.notUsedNum;
      totalNum.value = data.totalNum;
      tableData.value = data.list;
    } catch (err) {
      loading.value = false;
      console.log('err :>> ', err);
    }
  };
  const formatterStatus = ({ cellValue }) => {
    return cellValue ? '已占用' : '未占用';
  };
  // 添加框子
  const handleAddBox = () => {
    dialogVisible.value = true;
    checkedData.value = [];
  };
  // 修改
  const handlebatchUpdate = () => {
    const $table = frameTable.value;
    const records = $table.getCheckboxRecords();
    checkedData.value = records;
    if (!records.length) return ElMessage.warning('请选择数据');
    dialogVisible.value = true;
  };

  const storeList = ref([]);
  const getRepoNameList = async () => {
    try {
      const { code, data } = await getRepoName();
      if (code === '0000') {
        data?.forEach((item) => {
          let obj = {
            label: item,
            value: item
          };
          storeList.value.push(obj);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 打印
  const handlePrint = (isBatch, row) => {
    let reqPrintArr = [];
    let obj = {
      onlyPreView: false,
      printerName: '10040',
      printNumber: 1
    };
    if (isBatch) {
      const $table = frameTable.value;
      reqPrintArr = $table.getCheckboxRecords().map((item) => ({
        ...obj,
        boxCode: item.code
      }));
      if (!reqPrintArr.length) return ElMessage.warning('请选择数据');
    } else {
      reqPrintArr = [
        {
          ...obj,
          boxCode: row.code
        }
      ];
    }
    epeanPrint_plugin_fun(7, reqPrintArr);
  };
  // 批量删除
  const handleBatchDel = () => {
    const $table = frameTable.value;
    const records = $table.getCheckboxRecords();
    const idList = records.map((item) => item.id);
    if (!idList.length) return ElMessage.warning('请选择数据');
    ElMessageBox.confirm('删除将无法再找回数据，确认删除吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          loading.value = true;
          const { code } = await del({ idList });
          if (code === '0000') {
            $table.removeCheckboxRow();
            tableData.value = tableData.value.filter(
              (item) => !idList.includes(item.id)
            );
            loading.value = false;
            totalNum.value = totalNum.value - idList.length;
            // 已用总量变更
            let usedList = records.filter((item) => item.status);
            if (usedList.length) {
              usedNum.value = usedNum.value - 1;
            }
            ElMessage.success('删除成功');
          }
        } catch (err) {
          loading.value = false;
          console.log('err :>> ', err);
        }
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
  };
  // 删除
  const handleDel = async (row) => {
    const $table = frameTable.value;
    try {
      loading.value = true;
      const { code } = await del({ idList: [row.id] });
      if (code === '0000') {
        $table.removeCurrentRow();
        tableData.value = tableData.value.filter((item) => item.id !== row.id);
        totalNum.value = totalNum.value - 1;
        if (row.status) {
          usedNum.value = usedNum.value - 1;
        }
        loading.value = false;
        console.log('tableData :>> ', tableData);
        ElMessage.success('删除成功');
      }
    } catch (err) {
      loading.value = false;
      console.log('err :>> ', err);
    }
  };
</script>

<style lang="scss" scoped>
  .frame_container {
    .header_container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
