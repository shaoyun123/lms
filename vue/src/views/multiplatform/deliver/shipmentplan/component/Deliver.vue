<template>
  <el-dialog
    v-model="showDeliver"
    :title="isUpdateLogistics ? '修改快递信息' : '发货'"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading">
      <el-form
        ref="formRef"
        :model="formData"
        class="deliver"
        :rules="formRules"
      >
        <el-form-item label="快递单号" size="default" prop="logisticsNo">
          <el-input v-model="formData.logisticsNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="快递费(￥)" size="default" prop="logisticsFee">
          <el-input v-model="formData.logisticsFee" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleSave(formRef)">提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 批量发货弹窗 -->
  <el-dialog
    v-model="showSendDialog"
    title="发货结果"
    :close-on-click-modal="false"
    @close="handleCloseSend"
  >
    <vxe-table :data="sendList" border>
      <vxe-column
        field="key"
        width="220"
        title="平台-货件编号-框号"
      ></vxe-column>
      <vxe-column field="result" title="操作结果"></vxe-column>
    </vxe-table>
    <template #footer>
      <span>
        <el-button @click="handleCloseSend">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import {
    defineProps,
    defineEmits,
    computed,
    reactive,
    ref,
    onMounted
  } from 'vue';
  import {
    sendShipment,
    batchSendShipment,
    updateLogisticsInfoApi,
    printExpressDeliverSnApi
  } from '@/api/multiplatform/shipmentplan';
  import { ElMessage } from 'element-plus';
  import { debounce } from 'lodash-es';
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    // 货件信息
    deliverInfo: {
      type: Object,
      default: () => {}
    },
    // 货件id
    deliverId: {
      type: Number,
      default: 0
    },
    batchDeliverId: {
      type: Array,
      default: () => []
    },
    activeKey: {
      type: String,
      default: ''
    },
    isBatchSend: {
      type: Boolean,
      default: false
    },
    // 是否是装箱后自动弹出发货弹窗
    isAutoPopUp: {
      type: Boolean,
      default: false
    },
    selectBoxUpList: {
      type: Array,
      default: () => []
    },
    // 是否是修改快递信息弹窗
    isUpdateLogistics: {
      type: Boolean,
      default: false
    },
    selectedPlat: {
      type: String,
      default: () => ''
    }
  });

  const showDeliver = computed(() => {
    return props.isVisible;
  });

  const loading = ref(false);

  const emits = defineEmits(['close', 'query', 'printCase', 'deliverSendDone']);
  const formRef = ref(null);
  const formData = reactive({
    id: '',
    logisticsFee: '', // 快递费
    logisticsNo: '' // 快递单号
  });

  onMounted(() => {
    // tiktok平台待发货状态中没有上传默认为空
    if (props.activeKey === '4' && props.selectedPlat == 'tiktok') {
      formData.logisticsNo = props.deliverInfo.deliverOrderSn || '';
    }
    if (props.activeKey === '5') {
      formData.logisticsNo = props.deliverInfo.logisticsNo || 'system';
    }
    if (props.activeKey === '4' || props.activeKey === '5') {
      // 点击发货按钮 快递单号和费用没有值 用默认值
      formData.logisticsFee = props.deliverInfo.logisticsFee || 0.01;
      formData.logisticsNo = props.deliverInfo.logisticsNo
        ? props.deliverInfo.logisticsNo
        : 'system';
    }
    // 只有待装箱页签
    if (props.activeKey === '3') {
      // 如果装箱弹窗勾选了装箱后发货 则打开发货弹窗 并且给表单赋初始值
      if (props.isAutoPopUp) {
        if (!props.isBatchSend) {
          formData.id = props.deliverId || '';
        }
        if (props.selectBoxUpList.length === 0) {
          formData.logisticsFee = 0.01;
          formData.logisticsNo = 'system';
        } else {
          // 看看当前项的快递单号、费用有没有值 有值用原值 没值用默认
          formData.logisticsFee = !props.selectBoxUpList[0].logisticsFee
            ? 0.01
            : props.selectBoxUpList[0].logisticsFee;
          formData.logisticsNo = !props.selectBoxUpList[0].logisticsNo
            ? 'system'
            : props.selectBoxUpList[0].logisticsNo;
        }
      }
    }
  });

  const formRules = reactive({
    logisticsFee: [
      { required: true, message: '请输入快递费', trigger: 'blur' }
    ],
    logisticsNo: [
      { required: true, message: '请输入快递单号', trigger: 'blur' }
    ]
  });

  // 关闭发货弹窗
  const handleClose = () => {
    // 清空表单
    formData.logisticsFee = '';
    formData.logisticsNo = '';

    emits('close', props.isAutoPopUp);
  };

  // 保存发货页面
  const showSendDialog = ref(false);
  const sendList = ref([]);
  const handleSave = debounce(async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        try {
          formData.logisticsFee = Number(formData.logisticsFee);
          console.log('fee', formData.logisticsFee);
          showDeliver.value = false;
          if (props.isBatchSend) {
            let params = {
              ids: props.batchDeliverId || [],
              logisticsFee: formData.logisticsFee,
              logisticsNo: formData.logisticsNo
            };
            const { code, data } = await batchSendShipment(params).finally(
              () => {
                loading.value = false;
              }
            );
            if (code === '0000') {
              showSendDialog.value = true;
              sendList.value = data || [];
              // 只打印数据状态为true的
              const handleSussessList = sendList.value.filter(
                (item) => item.success === 'true'
              );
              if (handleSussessList.length) {
                const idList = handleSussessList.map((item) => item.id);
                emits('deliverSendDone', idList);
              } else {
                emits('deliverSendDone', []);
              }
            }
          } else {
            formData.id = props.deliverId || '';
            let saveApi = sendShipment;
            if (props.isUpdateLogistics) {
              saveApi = updateLogisticsInfoApi;
            }
            const { code } = await saveApi(formData).finally(() => {
              loading.value = false;
            });
            if (code === '0000') {
              ElMessage.success('发货成功！');
              emits('query');
              // AE 点击发货 不打印快递面单
              const plat = ['shopee', 'AE半托管', 'AE全托管'];
              // 点击发货且属于上面平台 不打印快递单
              if (!props.isBatchSend && plat.includes(props.selectedPlat)) {
                return;
              }
              if (!props.isUpdateLogistics) {
                // 打印快递单
                try {
                  const { code, data } = await printExpressDeliverSnApi({
                    id: props.deliverId
                  });
                  if (code === '0000') {
                    if (data && data.length > 0) {
                      data?.forEach((item) => {
                        let printDetailDtoList = [];
                        let detailObj = {
                          titleMap: item,
                          amount: 1
                        };
                        printDetailDtoList.push(detailObj);
                        let obj = {
                          printType: 99,
                          printDto: JSON.stringify({
                            printerName: '100100',
                            jspaper: 'platWhExpressDeliverSnTemu.jasper',
                            printDetailDtoList
                          })
                        };
                        emits('printCase', obj);
                      });
                    } else {
                      return ElMessage.warning('没有可以打印的快递单！');
                    }
                  }
                } catch (err) {
                  console.log(err);
                }
              }
            }
            handleClose();
          }
        } catch (err) {
          loading.value = false;
          console.log(err);
          handleClose();
        }
      }
    });
  }, 1000);

  const handleCloseSend = () => {
    showSendDialog.value = false;
    handleClose();
    emits('query');
  };
</script>

<style lang="scss" scoped>
  .deliver {
    :deep {
      .el-form-item .el-form-item__label {
        width: 90px;
      }
    }
  }
</style>
