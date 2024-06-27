<template>
  <div>
    <el-dialog
      v-model="showProduce"
      title="生产"
      width="90%"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <!-- 数据筛选 start -->
      <el-card class="common_split_bottom search_card">
        <el-form :model="formData" :inline="true" class="search_form">
          <el-form-item label="生产单号">
            <el-input
              ref="produceNoRef"
              v-model="formData.produceNo"
              placeholder="回车搜索"
              @keydown.enter.prevent="submitForm()"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePrintFrameNo"
              >打印篮号</el-button
            >
          </el-form-item>
          <!-- <el-form-item label="组合品SKU">
            <el-input
              v-model="formData.prodSSku"
              placeholder="回车搜索"
              @keyup.enter="submitForm()"
            ></el-input>
          </el-form-item> -->
          <div style="float: right">
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
                <el-radio :value="1">打印生产数量</el-radio>
                <el-radio :value="0">自定义打印数量</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formData.customNum"></el-input>
            </el-form-item>
            <el-button type="primary" @click="printProductsLabel"
              >打印商品标签</el-button
            >
          </div>
        </el-form>
      </el-card>
      <!-- 数据筛选 end -->
      <el-card class="distribute_package_body list_card">
        <div
          v-for="(item, index) in produceList"
          :key="index"
          style="margin: 10px 20px"
        >
          <div style="display: flex; justify-content: space-between">
            <div style="display: flex; justify-content: flex-start">
              <div style="margin-right: 30px">
                <span style="padding-left: 10px"
                  >仓库: {{ item.storeName }}</span
                >
              </div>
              <div style="margin-right: 30px">
                <span style="padding-left: 10px"
                  >组合品SKU: {{ item.prodSSku }}</span
                >
              </div>
              <div style="margin-right: 30px">
                基础商品SKU种类:
                <span style="font-size: 18px; color: red; padding-left: 10px">{{
                  item.detailDtoList?.length || 0
                }}</span>
              </div>
              <div style="margin-right: 30px">
                生产数量:<span
                  style="font-size: 18px; font-weight: bold; padding-left: 10px"
                  >{{ item.planQty }}</span
                >
              </div>
              <div style="margin-right: 30px">
                包装规格: {{ item.packSpec }}
              </div>
              <div style="margin-right: 30px">创建人: {{ item.creator }}</div>
              <div style="margin-right: 30px">
                <strong>
                  <span
                    style="display: inline-block; font-size: 26px; color: #f00"
                  >
                    {{ prodSuccess }}
                  </span>
                </strong>
              </div>
              <div
                v-permission="['combinationSplitOrderBtn']"
                class="split_combin_sku_wrapper"
              >
                <span class="note">拆除数量</span>
                <ZInputNumber
                  v-model="splitCombinSKuNum"
                  class="input-num"
                  :min="1"
                  clearable
                />
                <el-popconfirm
                  title="确认拆单吗?"
                  @confirm="handleSplitCombinSKu(item)"
                >
                  <template #reference>
                    <el-button type="primary" :loading="splitCombinSKuLoading"
                      >拆单</el-button
                    >
                  </template>
                </el-popconfirm>
              </div>
            </div>
            <div style="display: flex">
              <div
                v-permission="['outOfStockToCheckBtn']"
                style="margin-right: 10px"
              >
                <el-popconfirm
                  title="确认缺货待检吗?"
                  @confirm="handleOutOfStockToCheck(item)"
                >
                  <template #reference>
                    <el-button
                      v-permission="['outOfStockToCheckBtn']"
                      type="danger"
                    >
                      缺货待检
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>

              <el-button type="primary" @click="handleReturnProduce(item)">
                驳回到待生产
              </el-button>
            </div>
          </div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
            "
          >
            <div
              v-for="(cItem, cIndex) in item.detailDtoList"
              :key="cIndex"
              class="details_content"
            >
              <div class="detail_image">
                <el-popover
                  placement="right"
                  width="500px"
                  :hide-after="0"
                  trigger="hover"
                >
                  <template #default>
                    <el-image
                      :src="`${extraUrl}${cItem.combDetailDto.image}`"
                    />
                  </template>
                  <template #reference>
                    <el-image
                      loading="lazy"
                      :src="`${extraUrl}${cItem.combDetailDto.image}`"
                    />
                  </template>
                </el-popover>
              </div>
              <div class="details_info">
                <div>基础商品： {{ cItem.prodSSku }}</div>
                <div>单位： {{ cItem.combDetailDto.unit }}</div>
                <div>
                  数量：
                  <span style="color: red; font-size: 18px">{{
                    cItem.combDetailDto.prodDetailNums
                  }}</span>
                </div>
                <div>
                  库位： {{ cItem.combDetailDto.combLocation?.locationCode }}
                </div>
                <div>
                  配货：
                  {{
                    cItem.matchTime
                      ? parseTime(cItem.matchTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                  {{ cItem.matcher }}
                </div>
                <div>
                  <el-button
                    type="primary"
                    :loading="cItem.generateInventoryLoading"
                    @click="handleGenerateInventory(cItem, item.produceNo)"
                    >生成盘点</el-button
                  >
                </div>
              </div>
            </div>
            <div style="width: 30%"></div>
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, computed, ref, reactive } from 'vue';
  import {
    getProduce,
    handleProduce,
    changeStatus,
    outOfStockToCheckAjax,
    getPrintParamsAjax,
    generateInventoryApi,
    splitCombinSKuApi
  } from '@/api/fba/combination';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { commonExecutePrintJobs } from '@/utils/print';
  import { parseTime } from '@/utils/common';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    }
  });

  const showProduce = computed(() => {
    return props.isVisible;
  });

  const emit = defineEmits(['close']);

  const formData = reactive({
    produceNo: '',
    prodSSku: '',
    autoPrint: true,
    printNums: 1,
    customNum: '' // 自定义数量
  });

  const submitForm = () => {
    getProductData();
  };
  const produceNoRef = ref(null);
  const produceList = ref([]);
  const extraUrl = ref('');
  const loading = ref(false);
  const getProductData = async () => {
    if (!formData.produceNo) {
      return ElMessage.warning('请输入生产单号');
    }
    // if (!formData.prodSSku) {
    //   return ElMessage.warning('请输入组合品SKU');
    // }
    try {
      loading.value = true;
      const { code, data, extra } = await getProduce(formData);
      if (code === '0000') {
        produceList.value = [data];
        extraUrl.value = extra;
        handleProduceInfo(data);
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
    produceNoRef.value.select();
  };

  //顺序获取打印参数
  const commonGetPrintDataByLoopRequest = (data) => {
    let printReqData = [];
    data.forEach((item) => {
      printReqData.push(
        new Promise((resolve) => {
          getPrintParamsAjax(item)
            .then((res) => {
              return resolve(res.data);
            })
            .catch((_) => {
              return resolve(_); // 注意
            });
        })
      );
    });
    return printReqData;
  };

  //打印加补打标
  const handlePrintMakeup = () => {
    let printArray = [];
    produceList.value.forEach((item) => {
      let amount =
        formData.printNums == 1
          ? item.planQty
          : formData.customNum === ''
          ? item.planQty
          : formData.customNum > item.planQty
          ? item.planQty
          : formData.customNum;

      let obj = {
        printNum: amount,
        storageNum: amount,
        prodSId: item.prodSId,
        warehouseId: item.storeId,
        addFlag: true
      };
      printArray.push(obj);
    });
    let resData = commonGetPrintDataByLoopRequest(printArray);
    Promise.all(resData).then((res) => {
      let printParamsArr = [];
      for (let i = 0; i < res.length; i++) {
        let item = res[i];
        if (typeof item == 'string') {
          return ElMessage.error(item);
        } else {
          let obj = {};
          obj.printType = 19;
          obj.labelUrl = item.labelUrl;
          obj.width = item.width;
          obj.height = item.height;
          obj.printName = item.printName;
          printParamsArr.push(obj);
        }
      }
      commonExecutePrintJobs(printParamsArr);
    });
  };

  const handlePrint = () => {
    let printArray = [];
    produceList.value.forEach((item) => {
      let amount =
        formData.printNums == 1
          ? item.planQty
          : formData.customNum === ''
          ? item.planQty
          : formData.customNum > item.planQty
          ? item.planQty
          : formData.customNum;

      // let obj = {
      //   printNumber: amount,
      //   develop: item.bizzOwner,
      //   prodSSku: item.prodSSku,
      //   prodName: getTitleAli(item.title),
      //   printerName: '6515',
      //   prodStyle: '',
      //   inPackType: ''
      // };
      let obj = {
        printNum: amount,
        storageNum: amount,
        prodSId: item.prodSId,
        warehouseId: item.storeId
      };
      printArray.push(obj);
    });
    // epeanPrint_plugin_fun(4, printArray);
    let resData = commonGetPrintDataByLoopRequest(printArray);
    Promise.all(resData).then((res) => {
      let printParamsArr = [];
      for (let i = 0; i < res.length; i++) {
        let item = res[i];
        if (typeof item == 'string') {
          return ElMessage.error(item);
        } else {
          let obj = {};
          obj.printType = 19;
          obj.labelUrl = item.labelUrl;
          obj.width = item.width;
          obj.height = item.height;
          obj.printName = item.printName;
          printParamsArr.push(obj);
        }
      }
      commonExecutePrintJobs(printParamsArr);
    });
  };

  // 按钮 打印商品标签
  const printProductsLabel = () => {
    if (produceList.value?.length > 0) {
      // handlePrint();
      handlePrintMakeup();
    } else {
      ElMessage.warning('没有要打印的数据！');
    }
  };

  // const getTitleAli = (title) => {
  //   let titleArr = title.split(' ');
  //   if (titleArr.length > 5) {
  //     return (
  //       titleArr[0] +
  //       ' ' +
  //       titleArr[1] +
  //       ' ... ' +
  //       titleArr[titleArr.length - 2] +
  //       ' ' +
  //       titleArr[titleArr.length - 1]
  //     );
  //   } else {
  //     return title;
  //   }
  // };

  const prodSuccess = ref(''); //生产完成
  const handleProduceInfo = async (row) => {
    try {
      const { code } = await handleProduce({ id: row.id });
      if (code === '0000') {
        ElMessage.success('生产成功!');
        prodSuccess.value = '生产完成';
        if (formData.autoPrint) {
          handlePrint();
        }
      }
    } catch (err) {
      if (err.toString().indexOf('生产完成') > -1) {
        prodSuccess.value = '生产完成';
      } else {
        prodSuccess.value = '';
      }
    }
  };

  // 打印篮号
  const handlePrintFrameNo = () => {
    if (produceList.value.length === 0) {
      return ElMessage.warning('没有要打印的数据');
    }
    let printDetailDtoList = [];
    produceList.value?.forEach((item) => {
      // let obj = {
      //   titleMap: {
      //     frameNo: item.frameNo,
      //     prodSSku: item.prodSSku,
      //     planQty: item.planQty,
      //     produceId: item.produceNo,
      //     skuList: item.detailDtoList.map((cItem) => cItem.prodSSku),
      //     locationList: item.detailDtoList.map(
      //       (cItem) => cItem.combDetailDto?.combLocation?.locationCode || ''
      //     ),
      //     numList: item.detailDtoList.map((cItem) => cItem.totalRequireQty)
      //   }
      // };
      let obj = {
        printNum: item.planQty,
        storageNum: item.planQty,
        prodSId: item.prodSId,
        warehouseId: item.storeId
      };
      printDetailDtoList.push(obj);
    });
    let resData = commonGetPrintDataByLoopRequest(printDetailDtoList);
    Promise.all(resData).then((res) => {
      let printParamsArr = [];
      for (let i = 0; i < res.length; i++) {
        let item = res[i];
        if (typeof item == 'string') {
          return ElMessage.error(item);
        } else {
          let obj = {};
          obj.printType = 19;
          obj.labelUrl = item.labelUrl;
          obj.width = item.width;
          obj.height = item.height;
          obj.printName = item.printName;
          printParamsArr.push(obj);
        }
      }
      commonExecutePrintJobs(printParamsArr);
    });
    // let printObj10040 = {
    //   printerName: 100100,
    //   jspaper: 'combProduceDetail100.jasper',
    //   printDetailDtoList
    // };
    // epeanPrint_plugin_fun(99, printObj10040);
  };

  //缺货待检
  const handleOutOfStockToCheck = async (row) => {
    console.log(row);
    // let detailDtoList = row.detailDtoList || [];
    // //获取到checked为true的数据
    // let filterList = detailDtoList.filter((item) => item.checked);
    // //获取到sSkuList
    // let prodSSkuList = filterList.map((itemF) => {
    //   return itemF.combDetailDto && itemF.combDetailDto.sSku;
    // });
    //获取到单号
    let produceNo = formData.produceNo;
    //请求接口
    try {
      let { code, msg } = await outOfStockToCheckAjax({
        produceNo
      });
      if (code === '0000') {
        ElMessage.success(msg || '操作成功');
        prodSuccess.value = '仓库缺货';
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 驳回到待生产
  const handleReturnProduce = async (row) => {
    try {
      let params = {
        idList: [row.id],
        processStatus: '3'
      };
      const { code } = await changeStatus(params);
      if (code === '0000') {
        ElMessage.success('操作成功');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 生成盘点
  const handleGenerateInventory = async (cItem, produceNo) => {
    try {
      cItem.generateInventoryLoading = true;
      const { msg, data } = await generateInventoryApi({
        produceNo,
        prodSSkuList: [cItem.prodSSku]
      });
      cItem.generateInventoryLoading = false;
      if (data?.failList?.length) {
        ElMessageBox.alert(data.failList.join(','), '错误信息', {
          confirmButtonText: '确认',
          type: 'error',
          dangerouslyUseHTMLString: true
        });
      } else {
        ElMessage.success(msg);
      }
    } catch (err) {
      cItem.generateInventoryLoading = false;
    }
  };

  // #region拆单
  const splitCombinSKuLoading = ref(false);
  const splitCombinSKuNum = ref();
  const handleSplitCombinSKu = async (item) => {
    if (['', null, undefined].includes(splitCombinSKuNum.value)) {
      return ElMessage.warning('请输入拆单数量');
    }
    try {
      splitCombinSKuLoading.value = true;
      await splitCombinSKuApi({
        produceNo: item.produceNo,
        splitNum: splitCombinSKuNum.value
      });
      ElMessage.success('拆单成功');
      splitCombinSKuLoading.value = false;
      // 更改生产数量
      item.planQty = item.planQty - splitCombinSKuNum.value;
    } catch (err) {
      splitCombinSKuLoading.value = false;
    }
  };
  // #endregion拆单

  const handleClose = () => {
    emit('close');
  };
</script>

<style lang="scss" scoped>
  .distribute_package_body {
    height: 500px;
    overflow-y: auto;
    // 设置滚动条样式
    &::-webkit-scrollbar {
      width: 5px; /* 设置滚动条的宽度 */
    }
    &::-webkit-scrollbar-thumb {
      background-color: #888; /* 设置滚动条滑块的背景颜色 */
      border-radius: 4px; /* 设置滚动条滑块的圆角 */
    }
    &::-webkit-scrollbar-track {
      background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
    }
  }
  .detail_image {
    width: 200px;
    height: 200px;
    border: 1px dashed #ddd;
    position: relative;
    &__ckdiv {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  .details_content {
    display: flex;
    width: 30%;
    // border: 1px solid grey;
    margin: 20px 0px;
  }
  .details_info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;
    div {
      margin: 5px;
    }
  }
  .split_combin_sku_wrapper {
    display: flex;
    height: 25px;
    .note {
      flex: none;
      margin-right: 5px;
    }
    .input-num {
      margin-right: 5px;
    }
  }
</style>
