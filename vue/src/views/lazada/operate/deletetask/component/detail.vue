<template>
  <div class="lazadaDeleteTaskDetail">
    <el-dialog
      v-model="showExport"
      title="详情"
      width="25%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form
        ref="formRef"
        v-loading="dialogLoading"
        :model="formData"
        :label-width="120"
      >
        <el-form-item label="任务名称" required prop="taskName">
          <el-input
            v-model="formData.taskName"
            placeholder="定时删除已下架90天销量为0的商品"
          />
        </el-form-item>
        筛选条件
        <el-form-item label="listing状态" prop="productStatus">
          <el-select v-model="formData.productStatus" placeholder="请选择">
            <el-option
              v-for="item in productStatusList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="listing销量" prop="listingSales" required>
          <el-select v-model="formData.listingSales" placeholder="请选择">
            <el-option :value="3" label="90天销量=0" />
            <el-option :value="2" label="60天销量=0" />
            <el-option :value="1" label="30天销量=0" />
            <el-option :value="0" label="7天销量=0" />
          </el-select>
        </el-form-item>
        <el-form-item label="Suspended子状态" prop="bizValueList">
          <!-- <el-select
            v-model="formData.bizValueList"
            placeholder="请选择"
            filterable
            clearable
            multiple
          >
            <el-option value="approved" label="approved" />
            <el-option value="liverejected" label="liverejected" />
            <el-option value="lock" label="lock" />
            <el-option value="pending" label="pending" />
            <el-option value="rejected" label="rejected" />
          </el-select> -->
          <el-select
            v-model="formData.bizValueList"
            placeholder="请选择"
            filterable
            clearable
            multiple
          >
            <el-option
              v-for="item in bizValueListInit"
              :key="item.id"
              :value="item.bizApiValue"
              :label="item.bizApiValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="刊登天数≥" prop="listingDays">
          <el-input v-model="formData.listingDays" />
        </el-form-item>
        <el-form-item label="listing评论" prop="listingComment">
          <el-select v-model="formData.listingComment" placeholder="请选择">
            <el-option :value="0" label="有评论" />
            <el-option :value="1" label="无评论" />
            <el-option :value="2" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item label="listing在线数量" prop="listingCount">
          <el-select v-model="formData.listingCount" placeholder="请选择">
            <el-option :value="0" label="有在线数量" />
            <el-option :value="1" label="无在线数量" />
            <el-option :value="2" label="全部" />
          </el-select>
        </el-form-item>
        执行设置
        <el-form-item label="任务类型" required prop="executeType">
          <el-radio-group
            v-model="formData.executeType"
            class="ml-4"
            @change="initType"
          >
            <el-radio :value="0" size="small">手动执行</el-radio>
            <el-radio :value="1" size="small">定时任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="formData.executeType == 1">
          <el-form-item label="定时执行日期" prop="timeType" required>
            <el-select
              v-model="formData.timeType"
              placeholder="请选择"
              @change="formData.executeDay = ''"
            >
              <el-option :value="0" label="按星期" />
              <el-option :value="1" label="按日期" />
            </el-select>
          </el-form-item>
          <el-form-item label="定时执行星期" prop="executeDay" required>
            <el-select
              v-model="formData.executeDay"
              placeholder="请选择"
              filterable
              clearable
              multiple
            >
              <div v-if="formData.timeType == 0">
                <el-option
                  v-for="item in week"
                  :key="item.key"
                  :value="item.val"
                  :label="item.key"
                />
              </div>
              <div v-else>
                <el-option v-for="item in day" :key="item" :value="item" />
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="定时执行时间" prop="executeTime" required>
            <el-time-picker
              v-model="formData.executeTime"
              format="HH:mm"
              value-format="HH:mm"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" :disabled="dialogLoading" @click="save"
            >保存</el-button
          >
          <el-button
            v-if="formData.executeType == 0 && formData.id"
            type="primary"
            :disabled="dialogLoading"
            @click="immeHandle(formData.id)"
            >立即执行</el-button
          >
          <el-button :disabled="dialogLoading" @click="handleClose"
            >关闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, computed, onMounted, toRefs } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import {
    saveDeleteTask,
    manualTask,
    getSuspendedStatus,
    getTaskCount,
    getProductStatusApi
  } from '@/api/lazada/deletetask';
  const props = defineProps({
    // 是否显示弹窗
    isVisible: {
      type: Boolean,
      default: false
    },
    dataArr: {
      type: Object,
      default: () => {}
    }
  });
  const { dataArr } = toRefs(props);
  const formData = ref({
    productStatus: '',
    listingComment: 2,
    listingCount: 2,
    executeType: 0,
    timeType: 1
  });
  const showExport = computed(() => {
    return props.isVisible;
  });

  const bizValueListInit = ref([]);
  const productStatusList = ref([{ label: '全部', value: '' }]);

  onMounted(async () => {
    if (dataArr.value && dataArr.value.id) {
      formData.value = deepCopy(dataArr.value);
      formData.value.bizValueList = dataArr.value.qcType
        ? dataArr.value.qcType.split(',')
        : [];
      if (dataArr.value.executeWeekDayStr) {
        // 按星期
        formData.value.executeDay = dataArr.value.executeWeekDayStr.split(',');
      } else if (dataArr.value.executeMonthDayStr) {
        // 按日期
        formData.value.executeDay = dataArr.value.executeMonthDayStr.split(',');
      }
    }
    let { data } = await getSuspendedStatus();
    bizValueListInit.value = data;
    const { data: productStatusData } = await getProductStatusApi();
    for (let key in productStatusData) {
      const value = productStatusData[key];
      productStatusList.value.push({ label: value, value: value });
    }
  });
  const initType = () => {
    formData.value.timeType = 0;
    formData.value.executeDay = '';
    formData.value.executeTime = '';
  };
  // 深拷贝
  function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = deepCopy(obj[key]); //递归复制
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }
  const emits = defineEmits(['close', 'submit']);
  const handleClose = (val) => {
    emits('close', val);
  };
  // 立即执行
  const dialogLoading = ref(false);
  const immeHandle = async (ruleId) => {
    dialogLoading.value = true;
    try {
      let { code, data } = await getTaskCount(ruleId);
      if (code == '0000') {
        ElMessageBox.confirm(
          `本次执行删除任务的listing数量为${data}，请确认是否全部删除？确认后则立即执行删除任务`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(async () => {
            let { code, msg } = await manualTask(ruleId);
            if (code == '0000') {
              ElMessage.success(msg);
              handleClose(true);
            }
            dialogLoading.value = false;
          })
          .catch(() => {
            dialogLoading.value = false;
          });
      }
    } catch (error) {
      dialogLoading.value = false;
    }
  };
  // 保存
  const save = async () => {
    let _qcType;
    if (formData.value.bizValueList.length != 0) {
      let selectData = bizValueListInit.value.filter((item) =>
        formData.value.bizValueList.includes(item.bizApiValue)
      );
      _qcType = selectData.map((item) => item.bizValue).join();
    } else {
      _qcType = '';
    }
    // formData.value.qcType = formData.value.bizValueList.join(',');
    if (formData.value.executeType == 1) {
      // 定时任务
      if (formData.value.timeType == 0) {
        formData.value.executeWeekDayStr = formData.value.executeDay.join(',');
        formData.value.executeMonthDayStr = '';
      } else {
        formData.value.executeWeekDayStr = '';
        formData.value.executeMonthDayStr = formData.value.executeDay.join(',');
      }
    }
    let {
      id,
      taskName,
      productStatus,
      listingSales,
      // qcType,
      // bizValue,
      listingDays,
      listingComment,
      listingCount,
      executeType,
      timeType = '',
      executeWeekDayStr = '',
      executeMonthDayStr = '',
      executeTime = ''
    } = formData.value;

    let { code, msg } = await saveDeleteTask({
      id,
      taskName,
      productStatus,
      listingSales,
      qcType: _qcType,
      // bizValue,
      listingDays,
      listingComment,
      listingCount,
      executeType,
      timeType,
      executeWeekDayStr,
      executeMonthDayStr,
      executeTime
    });
    if (code == '0000') {
      handleClose(true);
      ElMessage.success(msg);
    }
  };

  const week = [
    { key: '星期日', val: '1' },
    { key: '星期一', val: '2' },
    { key: '星期二', val: '3' },
    { key: '星期三', val: '4' },
    { key: '星期四', val: '5' },
    { key: '星期五', val: '6' },
    { key: '星期六', val: '7' }
  ];
  const day = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28'
  ];
</script>
<style lang="scss" scoped>
  .lazadaDeleteTaskDetail {
    :deep(.el-dialog__body) {
      padding-top: 0px !important;
    }
    :deep(.el-select) {
      width: 100%;
    }
    :deep(.el-date-editor--time) {
      width: 100%;
    }
  }
</style>
