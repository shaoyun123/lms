<template>
  <div class="app-container">
    <!-- 数据筛选 start -->
    <el-card class="common_split_bottom search_card">
      <div class="sku_img">
        <img v-if="packupList[0]?.picUrl" :src="packupList[0]?.picUrl" />
        <img v-else src="@/assets/layout/kong.png" />
      </div>
      <div class="form_content">
        <el-form :model="formData" :inline="true" class="search_form">
          <el-form-item label="批次号">
            <el-select
              v-model="formData.batchNo"
              class="search_select"
              filterable
              allow-create
              clearable
              @blur="onBatchBlur($event)"
            >
              <el-option
                v-for="(item, index) in batchList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品SKU">
            <el-input
              ref="goodSkuRef"
              v-model="formData.prodSSku"
              placeholder="回车搜索"
              @keyup.enter.stop="submitForm()"
            ></el-input>
          </el-form-item>
          <div style="margin-left: 40px">
            <el-form-item>
              <el-tooltip placement="top">
                <template #content>
                  打印尺寸为70*40,打印机名称需设置为:7040<br />打印尺寸为100*100,打印机名称需设置为:100100
                </template>
                <el-checkbox
                  v-model="formData.autoPrint"
                  label="自动打印标签"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="formData.printNums">
                <el-radio :value="1">打印包装数量</el-radio>
                <el-radio :value="0">自定义打印数量</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formData.customNum"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-card>
    <!-- 数据筛选 end -->
    <el-card class="distribute_package_body list_card">
      <div class="package_table">
        <!-- 表格 -->
        <vxe-table
          ref="xTable"
          border
          :height="height"
          :loading="loading"
          :data="packupList"
          :scroll-y="{ gt: 15 }"
          align="left"
          :column-config="{ resizable: true }"
          :edit-config="{
            trigger: 'click',
            mode: 'cell'
          }"
        >
          <vxe-column title="编号" field="prodSSku" align="center">
            <template #default="{ row }">
              <div>仓箱：{{ row.shipBoxCode || '' }}</div>
              <div>篮子：{{ row.aa }}</div>
              <div>货件：{{ row.shipmentId }}</div>
              <div>{{ row.storeAcct }}</div>
            </template>
          </vxe-column>
          <vxe-column title="SKU图片" align="center">
            <template #default="{ row }">
              <ImagePop :src="extraImg + row.prodImage" />
            </template>
          </vxe-column>
          <vxe-column title="SKU/ASIN" align="center">
            <template #default="{ row }">
              <div>商品：{{ row.prodSInfoDto.sSku || '' }}</div>
              <div>店铺：{{ row.sellerSku || '' }}</div>
              <div>ASIN：{{ row.asin || '' }}</div>
              <div>FNSKU：{{ row.fnSku || '' }}</div>
            </template>
          </vxe-column>
          <vxe-column title="是否配货" align="center" width="80">
            <template #default="{ row }">
              <div>{{ getMatchStatus(row.matchStatus) }}</div>
            </template>
          </vxe-column>
          <vxe-column title="包装备注" field="packDesc"></vxe-column>
          <vxe-column title="计划发货数量" field="planQuality"></vxe-column>
          <vxe-column title="配货数量" field="matchQty"></vxe-column>
          <vxe-column title="剩余可用" field="remainAbleStock"></vxe-column>
          <vxe-column
            title="包装数量"
            field="actQuality"
            :edit-render="{ name: 'input' }"
            :slots="{ edit: 'edit' }"
          >
            <template #edit="{ row }">
              <el-input v-model="row.actQuality"></el-input>
            </template>
          </vxe-column>
          <vxe-column title="包装规格" align="center">
            <template #default="{ row }">
              <div>{{ row.packType }}</div>
              <el-button type="primary" @click="handlePrintLable(row)">
                打印货品标签
              </el-button>
            </template>
          </vxe-column>
          <vxe-column title="货件重量(kg)" field="totalWeight" width="100">
            <template #default="{ row }">
              {{ row.totalWeight / 1000 }}
            </template>
          </vxe-column>
          <vxe-column title="货件拼单" width="180">
            <template #default="{ row }">
              {{ row.fnCenterId }}<br />
              待装箱：{{ row.unPackageShipmentNum || 0 }} /
              {{ (row.unPackageShipmentTotalWeight || 0) / 1000 }}(kg) <br />
              待发货：{{ row.unDeliverShipmentUnm || 0 }} /
              {{ (row.unDeliverShipmentTotalWeight || 0) / 1000 }}(kg)
            </template>
          </vxe-column>
          <vxe-column title="属性">
            <template #default="{ row }">
              {{ row.prodSInfoDto.logisAttrList || '' }}
            </template>
          </vxe-column>
          <vxe-column field="handle" title="操作" align="center">
            <template #default="{ row }">
              <el-button
                type="primary"
                @click="handlePackup(row, 'actQuality')"
              >
                包装/修改数量
              </el-button>
              <el-button type="danger" @click="handleMarkLack(row)">
                标记少货
              </el-button>
            </template>
          </vxe-column>

          <!-- 组合品生产列表数据 end -->
        </vxe-table>
      </div>
    </el-card>
  </div>

  <el-dialog
    v-model="showLeftDialog"
    width="400"
    title="需要还库"
    class="left_dialog"
    :close-on-click-modal="false"
    @close="closeLeftDialog"
  >
    <div style="width: 400px; overflow: hidden; overflow-wrap: break-word">
      未匹配到货件计划和发货需求， <span style="color: red">需要还库</span>!
    </div>
    <template #footer>
      <el-button type="primary" @click="closeLeftDialog">关闭</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="showRightDialog"
    width="400"
    title="入待建框"
    class="right_dialog"
    :close-on-click-modal="false"
    @close="closeRightDialog"
  >
    <div style="width: 400px; overflow: hidden; overflow-wrap: break-word">
      发货需求未建货件计划，先<span style="color: rgb(64, 158, 255)"
        >入待建框</span
      >!
    </div>
    <template #footer>
      <el-button type="primary" @click="closeRightDialog">关闭</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-if="dialogMarkLackVisible"
    v-model="dialogMarkLackVisible"
    title="标记少货(生成二次配货任务)"
    width="500"
    status-icon
  >
    <el-form
      ref="markLackFormRef"
      :model="markLackForm"
      :rules="markLackRules"
      label-width="100"
    >
      <el-form-item label="移库类型" prop="transferTypeName">
        <el-input v-model="markLackForm.transferTypeName" readonly disabled />
      </el-form-item>
      <el-form-item label="仓库" prop="warehouseName">
        <el-input v-model="markLackForm.warehouseName" readonly disabled />
      </el-form-item>
      <el-form-item label="业务单号" prop="tranOrderId">
        <el-input v-model="markLackForm.tranOrderId" readonly disabled />
      </el-form-item>
      <el-form-item label="SKU" prop="sku">
        <el-input v-model="markLackForm.sku" readonly disabled />
      </el-form-item>
      <el-form-item label="少货数量" prop="skuNum">
        <el-input v-model="markLackForm.skuNum" autocomplete="off" />
      </el-form-item>
      <el-form-item label="目标通道">
        <el-input v-model="markLackForm.targetAisle" readonly disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogMarkLackVisible = false">取消</el-button>
        <el-button type="primary" @click="markLackSubmit(markLackFormRef)">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="fbadeliverfbapackup">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
  import {
    queryPackup,
    packup,
    getWaitPackBatch,
    markLackApi
  } from '@/api/fba/combination';
  import { ElMessage } from 'element-plus';
  import { epeanPrint_plugin_fun } from '@/utils/print';

  const formData = reactive({
    batchNo: '',
    prodSSku: '',
    autoPrint: true,
    printNums: 1,
    customNum: '' // 自定义数量
  });

  onMounted(() => {
    getBatchNoData();
    document.body.addEventListener('keyup', closeInfoDialog, false);
  });

  onUnmounted(() => {
    document.body.removeEventListener('keyup', closeInfoDialog, false);
  });

  const submitForm = () => {
    getProductData();
  };

  const onBatchBlur = (e) => {
    if (e.target.value) {
      formData.batchNo = e.target.value;
    }
  };

  const goodSkuRef = ref(null);
  // 获取批次号
  const batchList = ref([]);
  const getBatchNoData = async () => {
    try {
      const { code, data } = await getWaitPackBatch();
      if (code === '0000') {
        data?.forEach((item) => {
          if (item.batchNo) {
            let obj = {
              label: item.batchNo,
              value: item.batchNo
            };
            batchList.value.push(obj);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const packupList = ref([]);
  const loading = ref(false);
  const showLeftDialog = ref(false);
  const showRightDialog = ref(false);
  const extraImg = ref('');
  const getProductData = async () => {
    if (!formData.batchNo) {
      return ElMessage.warning('请输入批次号');
    }
    if (!formData.prodSSku) {
      return ElMessage.warning('请输入商品SKU');
    }
    try {
      loading.value = true;
      const { code, data, msg, extra } = await queryPackup(formData);
      if (code === '0000') {
        data.actQuality = data.planQuality || '';
        packupList.value = [data];
        extraImg.value = extra;
        // 自动包装
        handlePackup(data, 'planQuality');
        if (formData.autoPrint) {
          handlePrint();
        }
      }
      if (code === '1059') {
        // 还库
        showLeftDialog.value = true;
      }
      if (code === '1058') {
        // 放入待建框
        showRightDialog.value = true;
      }
      if (code === '9999') {
        ElMessage.warning(msg || '商品SKU不存在');
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
    goodSkuRef.value.select();
  };

  const closeLeftDialog = () => {
    showLeftDialog.value = false;
  };

  const closeRightDialog = () => {
    showRightDialog.value = false;
  };

  const closeInfoDialog = () => {
    if (showLeftDialog.value || showRightDialog.value) {
      showLeftDialog.value = false;
      showRightDialog.value = false;
    }
  };

  const handlePrint = () => {
    let printArray = [];
    packupList.value.forEach((item) => {
      let amount =
        formData.printNums == 1
          ? item.planQuality
          : formData.customNum === ''
          ? item.planQuality
          : formData.customNum > item.planQuality
          ? item.planQuality
          : formData.customNum;
      let obj = {
        // 回车打印 选中自定义发货数量时，打印数量为自定义发货数量，反之为实发数量
        printNumber: amount,
        fnSku: item.fnSku || '',
        mixStyle: item.mixStyle || '',
        title: getTitleAli(item.title),
        planQuality: item.actQuality,
        printerName: '10040',
        onlyPreView: false,
        prodSSku: item.prodSInfoDto?.sSku,
        locationCode: item.locationCode || '',
        shipmentId: item.shipmentId || '',
        shipBoxCode: item.shipBoxCode || ''
      };
      printArray.push(obj);
    });
    epeanPrint_plugin_fun(9, printArray);
  };

  const handlePrintLable = (row) => {
    let printArray = [];
    // packupList.value.forEach((item) => {
    let amount =
      formData.printNums == 1
        ? row.planQuality
        : formData.customNum === ''
        ? row.planQuality
        : formData.customNum;
    let obj = {
      // 回车打印 选中自定义发货数量时，打印数量为自定义发货数量，反之为实发数量
      printNumber: amount,
      fnSku: row.fnSku || '',
      mixStyle: row.mixStyle || '',
      title: getTitleAli(row.title),
      planQuality: row.actQuality,
      printerName: '10040',
      onlyPreView: false,
      prodSSku: row.prodSInfoDto?.sSku,
      locationCode: row.locationCode || '',
      shipmentId: row.shipmentId || '',
      shipBoxCode: row.shipBoxCode || ''
    };
    printArray.push(obj);
    // });
    epeanPrint_plugin_fun(9, printArray);
    goodSkuRef.value.select();
  };

  const getTitleAli = (title) => {
    let titleArr = title.split(' ');
    if (titleArr.length > 5) {
      return (
        titleArr[0] +
        ' ' +
        titleArr[1] +
        ' ... ' +
        titleArr[titleArr.length - 2] +
        ' ' +
        titleArr[titleArr.length - 1]
      );
    } else {
      return title;
    }
  };

  const handlePackup = async (row, type) => {
    try {
      const { code } = await packup({ id: row.id, actQuality: row[type] });
      if (code === '0000') {
        ElMessage.success('包装/修改数量成功!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMatchStatus = (status) => {
    let obj = {
      '-1': '待配货',
      0: '待包装',
      1: '已包装'
    };
    return obj[status];
  };

  //标记少货
  const dialogMarkLackVisible = ref(false);
  const markLackForm = ref({});
  const markLackFormRef = ref(null);
  const markLackRules = ref({
    transferTypeName: [
      { required: true, message: '请输入移库类型', trigger: 'blur' }
    ],
    warehouseName: [{ required: true, message: '请输入仓库', trigger: 'blur' }],
    tranOrderId: [
      { required: true, message: '请输入业务单号', trigger: 'blur' }
    ],
    sku: [{ required: true, message: '请输入SKU', trigger: 'blur' }],
    skuNum: [{ required: true, message: '请输入少货数量', trigger: 'blur' }]
  });
  const handleMarkLack = (row) => {
    markLackForm.value = {
      transferTypeName: 'FBA铺货二次配货',
      warehouseName: row.warehouseName,
      tranOrderId: row.planId,
      sku: row.prodSInfoDto.sSku,
      skuNum: '', //默认为空
      targetAisle: `${formData.batchNo}-${row.consigneeName}`
    };
    dialogMarkLackVisible.value = true;
  };

  //提交事件
  const markLackSubmit = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        try {
          let res = await markLackApi(markLackForm.value);
          if (res.code == '0000') {
            ElMessage.success(res.msg || '操作成功');
            dialogMarkLackVisible.value = false;
          }
        } catch (err) {
          console.log('err', err);
        }
      } else {
        console.log('error submit!', fields);
      }
    });
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 130;
  });
</script>

<style lang="scss" scoped>
  .search_card {
    :deep(.el-card__body) {
      display: flex;
    }
  }
  .sku_img {
    width: 200px;
    height: 200px;
    margin: 20px;
    border: 1px dashed #ccc;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .form_content {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .search_select {
    :deep(.el-input) {
      width: 180px;
    }
  }
  .left_dialog {
    position: relative;
    left: -300px;
    animation: dialog-fade-in-left 0.5s linear 1;
  }
  .right_dialog {
    position: relative;
    left: 300px;
    animation: dialog-fade-in-right 0.5s linear 1;
  }

  @keyframes dialog-fade-in-right {
    0% {
      transform: translate3d(200%, 0, 0);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  @keyframes dialog-fade-in-left {
    0% {
      transform: translate3d(-200%, 0, 0);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 30px;
  }
</style>
