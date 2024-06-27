<template>
  <div class="logistics_container app-container">
    <el-card class="common_split_bottom search_card">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-form-item label="物流名称">
          <el-input v-model="formData.name" style="width: 300px" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSearch"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="common_split_bottom list_card">
      <div>
        <vxe-table
          :loading="loading"
          border
          align="center"
          :data="tableData"
          :height="height"
          :scroll-y="{ gt: 25 }"
          show-overflow
          :row-config="{ isCurrent: true, isHover: true }"
          :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
        >
          <vxe-column
            field="expressCompanyName"
            title="物流方式名称"
          ></vxe-column>
          <vxe-column
            field="expressCompanyId"
            title="物流方式代码"
          ></vxe-column>
          <vxe-column title="生效时间">
            <template #default="{ row, rowIndex }">
              <div
                title="双击可设置生效时间"
                @dblclick="setValidTime(row, rowIndex)"
              >
                {{ row.validTime || '' }}
              </div>
            </template>
          </vxe-column>
          <vxe-column field="status" title="状态">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                v-loading="row?.statusLoading"
                size="default"
                inline-prompt
                active-text="开启"
                style="--el-switch-on-color: #13ce66"
                inactive-text="关闭"
                @change="handleChangeEdit(row, 'status')"
              />
            </template>
          </vxe-column>
          <vxe-column field="ifUrgent" title="是否紧急">
            <template #default="{ row }">
              <el-switch
                v-model="row.ifUrgent"
                v-loading="row?.ifUrgentLoading"
                size="default"
                inline-prompt
                active-text="是"
                inactive-text="否"
                style="--el-switch-on-color: #13ce66"
                @change="handleChangeEdit(row, 'ifUrgent')"
              />
            </template>
          </vxe-column>
          <vxe-column field="ifSplitBox" title="是否支持分箱">
            <template #default="{ row }">
              <el-switch
                v-model="row.ifSplitBox"
                v-loading="row?.ifSplitBoxLoading"
                style="--el-switch-on-color: #13ce66"
                size="default"
                inline-prompt
                active-text="是"
                inactive-text="否"
                @change="handleChangeEdit(row, 'ifSplitBox')"
              />
            </template>
          </vxe-column>
          <vxe-column field="weight" title="重量上限(Kg)" :edit-render="{}">
            <template #edit="{ row }">
              <ZInputNumber
                v-model="row.weight"
                v-loading="row?.weightLoading"
                placeholder="填写正数"
                :precision="2"
                @blur="handleChangeEdit(row, 'weight')"
              />
            </template>
          </vxe-column>
          <vxe-column field="volume" title="体积上限(m³)" :edit-render="{}">
            <template #edit="{ row }">
              <ZInputNumber
                v-model="row.volume"
                v-loading="row?.volumeLoading"
                placeholder="填写正数"
                :precision="2"
                @blur="handleChangeEdit(row, 'volume')"
              />
            </template>
          </vxe-column>
          <vxe-column field="height" title="高度上线(cm)" :edit-render="{}">
            <template #edit="{ row }">
              <ZInputNumber
                v-model="row.height"
                v-loading="row?.heightLoading"
                placeholder="填写正数"
                :precision="2"
                @blur="handleChangeEdit(row, 'height')"
              />
            </template>
          </vxe-column>
          <vxe-column field="createTime" title="创建时间" width="210">
            <template #default="{ row }">
              <div style="text-align: left">
                <div>创建时间：{{ transferDate(row.createTime) }}</div>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="creator" title="修改" width="210">
            <template #default="{ row }">
              <div style="text-align: left">
                <div>操作人：{{ row.modifier }}</div>
                <div>修改时间：{{ transferDate(row.modifyTime) }}</div>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </el-card>
  </div>
  <!-- 生效时间弹窗 -->
  <el-dialog v-model="validTimeVisible" title="设置生效时间" width="500">
    <el-time-picker
      v-model="editValidTime"
      is-range
      range-separator="-"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelValidTime"> 取消 </el-button>
        <el-button type="primary" @click="submitValidTime">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="multiplatformconfigonlinelogistics">
  import { reactive, ref, computed } from 'vue';
  import {
    queryAllPlatWhShipmentExpressApi,
    editPlatWhShipmentExpressApi
  } from '@/api/multiplatform/onlinelogistics';
  import { transferDate } from '@/utils/common';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { ElMessage } from 'element-plus';

  const formData = reactive({
    name: '',
    expressCompanyName: '',
    expressCompanyNameList: []
  });

  const loading = ref(false);
  const tableData = ref([]);

  const onSearch = async () => {
    loading.value = true;
    // 单个名称的时候 expressCompanyName; 逗号隔开传 expressCompanyNameList
    try {
      if (
        formData.name &&
        formData.name.replace(/，/g, ',').split(',').length > 1
      ) {
        formData.expressCompanyNameList = formData.name
          .replace(/，/g, ',')
          .split(',')
          .map((item) => item.trim());
        const { data } = await queryAllPlatWhShipmentExpressApi({
          expressCompanyNameList: formData.expressCompanyNameList
        });
        tableData.value = data;
      } else {
        formData.expressCompanyName = formData.name;
        const { data } = await queryAllPlatWhShipmentExpressApi({
          expressCompanyName: formData.expressCompanyName
        });
        tableData.value = data;
      }

      tableData.value = tableData.value.list.map((item) => {
        item.heightLoading = false;
        item.weightLoading = false;
        item.volumeLoading = false;
        item.status = false;
        item.ifUrgent = false;
        item.ifSplitBox = false;
        return item;
      });
      loading.value = false;
    } catch (err) {
      loading.value = false;
      console.log('err :>> ', err);
    }
  };

  // 点击单元格编辑/开关切换
  const handleChangeEdit = async (row, type) => {
    // type:
    // height: 重量 volume: 体积 height: 高度
    // status: 是否启用 ifUrgent: 是否紧急 ifSplitBox: 是否分箱
    if (
      (type === 'height' || type === 'volume' || type === 'weight') &&
      Number(row[type]) < 0
    ) {
      return ElMessage.warning('请输入正数！');
    }

    row[type + 'Loading'] = true;

    try {
      const { id } = row;
      const { code, msg } = await editPlatWhShipmentExpressApi({
        id,
        [type]: row[type]
      });
      if (code === '0000') {
        ElMessage.success(msg);
        onSearch();
      } else {
        ElMessage.warning(msg);
      }
    } catch (err) {
      console.log('err :>> ', err);
    }
    row[type + 'Loading'] = false;
  };
  let validTimeVisible = ref(false);
  const editValidTime = ref([
    new Date(2024, 6, 17, 0, 0, 0),
    new Date(2024, 6, 17, 23, 59, 59)
  ]);
  let rowId = ref(null);
  let defaultRowIndex = ref(null);

  const setValidTime = (row, rowIndex) => {
    // 00:00:00-23:59:59
    let startTime = row.validTime.split('-')[0].split(':');
    let endTime = row.validTime.split('-')[1].split(':');
    editValidTime.value = [
      new Date(2024, 6, 17, startTime[0], startTime[1], startTime[2]),
      new Date(2024, 6, 17, endTime[0], endTime[1], endTime[2])
    ];
    validTimeVisible.value = true;
    rowId.value = row.id;
    defaultRowIndex.value = rowIndex;
  };
  const submitValidTime = async () => {
    let startTime = transferDate(editValidTime.value[0]).split(' ')[1];
    let endTime = transferDate(editValidTime.value[1]).split(' ')[1];
    let validTime = startTime + '-' + endTime;
    let params = {
      id: rowId.value,
      validTime: validTime
    };
    const { code, msg } = await editPlatWhShipmentExpressApi(params);
    if (code === '0000') {
      validTimeVisible.value = false;
      tableData.value[defaultRowIndex.value].validTime = validTime;
      ElMessage.success(msg);
      // onSearch();
    } else {
      ElMessage.warning(msg);
    }
  };
  const cancelValidTime = () => {
    validTimeVisible.value = false;
  };
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 137;
  });
</script>

<style lang="scss" scoped></style>
