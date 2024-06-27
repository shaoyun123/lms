<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      width="700"
      title="设置过滤性感图片类目"
      destroy-on-close
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div v-loading="initLoading">
        <div class="header_btns">
          <el-button type="danger" @click="handleBatchDel">批量删除</el-button>
          <el-button type="primary" @click="handleAdd">添加类目</el-button>
        </div>
        <vxe-table
          ref="tableRef"
          :data="originData?.platCateInfoList || []"
          :height="400"
          show-overflow
          border
        >
          <vxe-column type="checkbox" width="60" />
          <vxe-column title="类目id" field="platCateId" width="100" />
          <vxe-column title="过滤性感图片类目" field="platCateTree" />

          <vxe-column title="操作" width="100">
            <template #default="{ row }">
              <el-button type="danger" @click="handleDel(row)">移除</el-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSave"> 保存 </el-button>
          <el-button @click="handleClose"> 关闭 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-if="cateVisible"
      v-model="cateVisible"
      width="500"
      title="选择类目"
      destroy-on-close
      :close-on-click-modal="false"
      @close="cateVisible = false"
    >
      <div class="cate_cascader">
        <ZCascader
          ref="cateRef"
          v-model="cate"
          :data="options"
          :props="{
            label: 'cnName',
            children: 'children',
            value: 'categoryId'
          }"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSaveCate"> 保存 </el-button>
          <el-button @click="cateVisible = false"> 关闭 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import {
    saveStoreConfigApi,
    batchAddImageFilterCate,
    getStoreConfigApi
  } from '@/api/publishs/tiktokstoremanage';
  import { getPlatCategoryTreeApi } from '@/api/common';
  import { ElMessage } from 'element-plus';
  import ZCascader from '@/components/ZCascader/index.vue';

  const props = defineProps({
    editInfo: {
      type: Object,
      default: () => {}
    },
    modelValue: {
      type: Boolean,
      default: true
    }
  });

  const emits = defineEmits(['update:modelValue', 'handleSearch', 'close']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const tableRef = ref();
  const originData = ref({
    platCateInfoList: []
  });
  const initLoading = ref(false);

  onMounted(async () => {
    initLoading.value = true;
    if (props.editInfo.id) {
      try {
        const { data } = await getStoreConfigApi(props.editInfo.id);
        originData.value = data;
      } catch (err) {
        console.log('err :>> ', err);
      }
    } else {
      originData.value = {
        platCateInfoList: []
      };
    }
    initLoading.value = false;
  });

  const handleBatchDel = () => {
    const checkList = tableRef.value.getCheckboxRecords();
    if (!checkList.length) return ElMessage.warning('请选择要删除的数据');
    tableRef.value.removeCheckboxRow();
  };
  const handleDel = (row) => {
    tableRef.value.remove([row]);
  };

  const handleSave = async () => {
    try {
      const data = tableRef.value?.getTableData()?.fullData || [];
      const imageFilterPlatCateIdListStr = data
        .map((item) => item.platCateId)
        .join(',');
      if (props.editInfo.id) {
        const { msg } = await saveStoreConfigApi({
          ...originData.value,
          imageFilterPlatCateIdListStr
        });
        ElMessage.success(msg);
      } else if (props.editInfo.ids) {
        const { msg } = await batchAddImageFilterCate({
          storeAcctIds: props.editInfo.ids,
          imageFilterPlatCateIdList: imageFilterPlatCateIdListStr.split(',')
        });
        ElMessage.success(msg);
        emits('close');
      }
      dialogVisible.value = false;
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = () => {
    dialogVisible.value = false;
  };

  //   类目
  const options = ref([]);
  const cate = ref([]);
  const cateRef = ref();
  const cateVisible = ref(false);

  const handleAdd = async () => {
    cateVisible.value = true;
    try {
      const { data } = await getPlatCategoryTreeApi('tiktok');
      options.value = data;
      const tableData = tableRef.value?.getTableData()?.fullData || [];
      cate.value = tableData.map((v) => v.platCateId);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const handleSaveCate = () => {
    const checkNode = cateRef.value.selectedNodes;
    if (!checkNode.length) return ElMessage.warning('请选择类目');
    const newData = [];
    for (let i = 0; i < checkNode.length; i++) {
      let newRow = {
        platCateId: checkNode[i].categoryId,
        platCateTree: checkNode[i].pathLabels?.join('>>')
      };
      if (cate.value) {
        newData.push(newRow);
        // tableRef.value.insertAt(newRow, -1);
      }
    }
    tableRef.value.reloadData(newData);
    // 可能存在大数据量的添加，采用重新加载数据，而非一个一个添加
    cateVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  .header_btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  :deep(.el-dialog__body) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .cate_cascader {
    height: 250px;
    :deep(.el-cascader) {
      width: 400px;
    }
  }
</style>
