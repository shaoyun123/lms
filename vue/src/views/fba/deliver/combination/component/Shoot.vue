<!-- 投篮 -->
<template>
  <div class="combination_shoot">
    <el-dialog
      v-model="showShoot"
      title="组合品投篮"
      :fullscreen="true"
      :modal-class="'fullDialog'"
      top="3%"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div class="shoot_container">
        <div class="shoot_content shoot_left">
          <div class="shoot_print">
            <el-checkbox-group v-model="checkList" size="large">
              <el-checkbox label="打印组合品标签" />
              <el-checkbox label="核完一单删一单" />
            </el-checkbox-group>
          </div>
          <div class="shoot_info">
            <div class="title font_size_20">
              组合品信息（{{ combProductInfoList?.length || 0 }}）
            </div>
            <vxe-table
              height="300"
              :data="combProductInfoList"
              size="medium"
              border
            >
              <vxe-column
                title="组合品需求ID"
                field="produceNo"
                width="80"
              ></vxe-column>
              <vxe-column
                title="组合品SKU"
                field="prodSSku"
                width="100"
              ></vxe-column>
              <vxe-column title="SKU明细" field="skuInfo"></vxe-column>
              <vxe-column title="篮号" field="frameNo" width="80"></vxe-column>
              <vxe-column title="是否核完" width="80" field="checked">
                <template #default="{ row }">
                  {{ row.checked ? '是' : '否' }}
                </template>
              </vxe-column>
            </vxe-table>
          </div>
          <div class="shoot_not_sku">
            <div class="title font_size_20">
              未投篮SKU（{{ unCheckedOrderSkuInfos?.length || 0 }}）
            </div>
            <vxe-table
              height="300"
              :data="unCheckedOrderSkuInfos"
              size="medium"
              border
            >
              <vxe-column
                title="组合品需求ID"
                field="produceNo"
                width="80"
              ></vxe-column>
              <vxe-column title="库位" width="25%">
                <template #default="{ row }">
                  {{
                    row.combDetailDto?.combLocation?.locationCode || ''
                  }}</template
                >
              </vxe-column>
              <vxe-column
                title="商品SKU"
                field="prodSSku"
                width="25%"
              ></vxe-column>
              <vxe-column title="总数量" field="totalRequireQty"></vxe-column>
              <vxe-column title="已投数量" field="matchQty"></vxe-column>
              <vxe-column title="篮号" field="frameNo"></vxe-column>
            </vxe-table>
          </div>
        </div>
        <div class="shoot_content shoot_center">
          <div class="shoot_num font_size_20">
            <div style="margin-right: 10px">
              上次被核单：<span style="font-weight: bold">{{
                prevVerifyOrder
              }}</span>
            </div>
            <div>
              上次篮号：<span style="font-weight: bold">{{
                prevBasketNo
              }}</span>
            </div>
          </div>
          <div class="shoot_progress">
            <div class="title font_size_20">订单进度</div>
            <vxe-table
              height="300"
              :data="orderProgressInfos"
              size="medium"
              border
            >
              <vxe-column title="组合品需求ID" field="produceNo"></vxe-column>
              <vxe-column title="组合品SKU" field="parSku"></vxe-column>
              <vxe-column title="商品SKU" field="prodSSku">
                <template #default="{ row }">
                  <span
                    :class="row.prodSSku === formData.sku ? 'highlight' : ''"
                    >{{ row.prodSSku }}</span
                  >
                </template>
              </vxe-column>
              <vxe-column title="已投篮数" field="matchQty"></vxe-column>
              <vxe-column title="未投篮数" width="100">
                <template #default="{ row }">
                  {{ row.totalRequireQty - row.matchQty }}</template
                >
              </vxe-column>
            </vxe-table>
          </div>
          <div class="shoot_sku">
            <div class="title font_size_20">
              已投篮SKU（{{ checkedOrderSkuInfos?.length || 0 }}）
            </div>
            <vxe-table
              height="300"
              :data="checkedOrderSkuInfos"
              size="medium"
              border
            >
              <vxe-column title="组合品需求ID" field="produceNo"></vxe-column>
              <vxe-column title="库位" width="25%">
                <template #default="{ row }">
                  {{
                    row.combDetailDto?.combLocation?.locationCode || ''
                  }}</template
                >
              </vxe-column>
              <vxe-column
                title="商品SKU"
                field="prodSSku"
                width="25%"
              ></vxe-column>
              <vxe-column title="总数量" field="totalRequireQty"></vxe-column>
              <vxe-column title="已投数量" field="matchQty"></vxe-column>
              <vxe-column title="篮号" field="frameNo"></vxe-column>
            </vxe-table>
          </div>
        </div>
        <div class="shoot_content shoot_right font_size_20">
          <div class="shoot_operate">操作人：{{ userName }}</div>
          <div class="right_form">
            <el-form :model="formData" class="search_form" size="large">
              <el-form-item label="批次号">
                <el-input
                  v-model="formData.batchNo"
                  placeholder="请输入批次号"
                  style="width: 200px"
                  @keyup.enter="submitBatNo()"
                ></el-input>
              </el-form-item>
              <el-form-item label="SKU">
                <el-input
                  ref="skuRef"
                  v-model="formData.sku"
                  class="form_left"
                  placeholder="请输入SKU"
                  style="width: 150px"
                  @keyup.enter.prevent="submitSku()"
                ></el-input>
                <el-input
                  ref="skuNumRef"
                  v-model="formData.skuNum"
                  class="form_right"
                  style="width: 50px"
                  @keyup.enter="shootSkuFn()"
                ></el-input>
              </el-form-item>
              <el-form-item label="扫描SKU" style="margin-top: 60px">
                <div
                  class="text_com"
                  style="color: rgb(64, 158, 255); font-size: 26px"
                >
                  {{ printSku }}
                </div>
              </el-form-item>
              <el-form-item label="篮号" style="margin-top: 60px">
                <div class="text_com" style="color: rgb(64, 158, 255)">
                  {{ getFrameNo(skuFrameNo) }}
                </div>
              </el-form-item>
              <el-form-item label="数量" style="margin-top: 60px">
                <div class="text_com" style="color: red">
                  {{ skuNum }}
                </div>
              </el-form-item>
              <el-form-item label="单位" style="margin-top: 60px">
                <div class="text_com" style="color: red">
                  {{ skuUnit || '' }}
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>
    <audio id="error_voice" ref="errorVoiceRef" contorls>
      <source :src="voiceUrl" />
      亲 您的浏览器不支持html5的audio标签
    </audio>
  </div>
</template>

<script setup>
  import {
    defineProps,
    defineEmits,
    computed,
    onMounted,
    ref,
    reactive
  } from 'vue';
  import { queryCombList, putInFrame } from '@/api/fba/combination';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { epeanPrint_plugin_fun } from '@/utils/print';
  import useUserStore from '@/store/modules/user';
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    formParams: {
      type: Object,
      default: () => {}
    },
    total: {
      type: Number,
      default: 1000
    }
  });

  const errorVoiceRef = ref(null);

  const showShoot = computed(() => {
    return props.isVisible;
  });

  const checkList = ref(['核完一单删一单']);
  const combProductInfoList = ref([]); // 组合品信息
  const checkedOrderSkuInfos = ref([]); // 已投篮表格
  const unCheckedOrderSkuInfos = ref([]); // 未投篮表格
  const orderProgressInfos = ref([]); // 订单进度表格
  const prevVerifyOrder = ref('无'); // 上次被核单
  const prevBasketNo = ref('无'); // 上次蓝号

  const emits = defineEmits(['close', 'query']);
  const formData = reactive({
    batchNo: '',
    sku: '',
    skuNum: ''
  });

  // const requestParams = computed(() => {
  //   return props.formParams;
  // });

  const requestParams = reactive({});

  // 获取用户名
  const userName = ref('');
  const { userInfo } = useUserStore();
  userName.value = computed(() => userInfo.userName);

  onMounted(() => {
    localStorage.setItem('LACKLASTTIMEDATA', JSON.stringify({}));
    // getCombInfoList();
  });
  // 获取组合品信息列表
  const originComList = ref([]);
  const getCombInfoList = async () => {
    try {
      requestParams.value.page = 1;
      requestParams.value.limit = 5000;
      requestParams.value.batchNo = formData.batchNo;
      requestParams.value.combDetailSSkuList = [];
      requestParams.value.combDetailSSkuStr = '';
      requestParams.value.createBegintime = '';
      requestParams.value.createEndTime = '';
      requestParams.value.idStr = '';
      requestParams.value.processStatus = '2';
      requestParams.value.prodSSkuList = [];
      requestParams.value.prodSSkuStr = '';
      requestParams.value.produceNoList = [];
      requestParams.value.productId = '';
      requestParams.value.storeId = '';
      requestParams.value.frameNo = '';
      const { code, data } = await queryCombList(requestParams.value);
      if (code === '0000') {
        // 是否核完 逻辑：所有sku明细的 投篮数量大于 0 才算组合品sku 核完
        handleTableData(data);
        originComList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTableData = (data) => {
    let skuList = [];

    let unCheckedSkuInfoArr = [];
    let checkedSkuInfoArr = [];
    // 是否核完 逻辑：所有sku明细的 投篮数量大于 0 才算组合品sku 核完
    data.forEach((item) => {
      let skuInfoArr = [];
      item.detailDtoList.forEach((cItem) => {
        skuList.push(cItem.prodSSku); // sku 明细
        cItem.frameNo = item.frameNo;
        cItem.prodSId = item.prodSId;
        cItem.produceNo = item.produceNo;
        cItem.checked = false;
        if (cItem.matchQty === cItem.totalRequireQty) {
          cItem.checked = true;
        }
        skuInfoArr.push(cItem);
        if (cItem.matchQty === 0 || cItem.matchQty < cItem.totalRequireQty) {
          unCheckedSkuInfoArr.push(cItem);
        }
        if (cItem.matchQty > 0 && cItem.matchQty <= cItem.totalRequireQty) {
          checkedSkuInfoArr.push(cItem);
        }
      });
      let isCheckedList = skuInfoArr.filter((item) => item.checked === false);
      item.skuInfo = skuList.join(',');
      skuList = [];
      if (isCheckedList?.length === 0) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    combProductInfoList.value = data || [];
    unCheckedOrderSkuInfos.value = unCheckedSkuInfoArr || [];
    checkedOrderSkuInfos.value = checkedSkuInfoArr || [];
    // 核完一单删一单
    deleteChecckedInfo();
    // 打印组合品标签
    printComLabel();
  };

  // 批次号回车事件
  const submitBatNo = () => {
    requestParams.value = Object.assign({}, props.formParams);
    requestParams.value.batchNo = formData.batchNo;
    selectInput();
    getCombInfoList();
  };

  const skuRef = ref(null);
  // 输入框内容选中
  const selectInput = () => {
    skuRef.value.focus();
  };

  const playErrorVoice = () => {
    let voice = new Audio();
    voice = new URL('@/assets/audio/error.wav', import.meta.url).href;
    errorVoiceRef.value.src = voice;
    errorVoiceRef.value.play();
  };

  const playBatchNo = (batchNo) => {
    var speechSynthesisUtterance = new SpeechSynthesisUtterance(batchNo);
    speechSynthesisUtterance.rate = 1;
    speechSynthesis.speak(speechSynthesisUtterance);
  };

  // sku 回车事件
  const skuFrameNo = ref('');
  const skuNum = ref('');
  const skuNumRef = ref(null);
  const skuUnit = ref('');
  const printSku = ref('');
  const voiceUrl = ref('');
  // const timer = ref(null);
  // sku 输入后就显示篮号和播报篮号
  // const changeSku = async (value) => {
  //   if (value) {
  //     clearTimeout(timer.value);
  //     timer.value = setTimeout(() => {
  //       let matchOrder = getShootSku();
  //       if (matchOrder.id) {
  //         playBatchNo(skuFrameNo.value);
  //       }
  //       setTimeout(() => {
  //         skuRef.value.select();
  //         printSku.value = '';
  //         skuNum.value = '';
  //         skuUnit.value = '';
  //       }, 100);
  //     }, 500);
  //   }
  // };
  const submitSku = async () => {
    if (!isMessageBoxOpen.value) {
      if (!formData.sku) {
        return ElMessage.warning('请输入SKU');
      }
      let matchOrder = getShootSku();
      let proDetailId = matchOrder?.id; // 生产详情id

      // 判断sku未投篮的数量
      // 如果未投篮的数量为1，那么直接进行投篮
      // 反之，则在sku数量那里进行enter投篮
      let unShootNum = matchOrder?.totalRequireQty - matchOrder?.matchQty;
      if (unShootNum === 1) {
        formData.skuNum = unShootNum;
        shootSkuFn(proDetailId);
      } else {
        if (unShootNum !== unShootNum) {
          // unShootNum 为 NaN
          formData.skuNum = '';
          skuFrameNo.value = '';
          skuRef.value.select();
        } else {
          formData.skuNum = unShootNum || '';
          skuNumRef.value.focus();
          // 播报篮号
          playBatchNo(skuFrameNo.value);
        }
        printSku.value = '';
        skuNum.value = '';
        skuUnit.value = '';
      }
      skuRef.value.select();
    }
  };

  const isMessageBoxOpen = ref(false);

  // 获取要投篮的sku 逻辑
  const getShootSku = () => {
    let matchSkuArr = unCheckedOrderSkuInfos.value.filter(function (item) {
      return item.prodSSku.toUpperCase() === formData.sku?.trim().toUpperCase();
    });
    if (matchSkuArr?.length == 0) {
      playErrorVoice();
      skuFrameNo.value = '';

      isMessageBoxOpen.value = true;
      ElMessageBox.alert('匹配不到组合品SKU，该商品请还库！', '提示信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        callback: () => {
          setTimeout(() => {
            isMessageBoxOpen.value = false;
          }, 500);
        }
      });
      return;
    }
    // 如果有多个相同的sku 不同的需求id 的数据
    // 投篮逻辑为：优先投部分投篮的 再投总数量多的数据
    // 数量相等选第一个进行投篮
    let partOrder = matchSkuArr.filter((item) => {
      return item.matchQty > 0; // 部分投篮的
    });

    let MaxOrder =
      matchSkuArr &&
      matchSkuArr.sort(function (a, b) {
        return a.totalRequireQty < b.totalRequireQty;
      })[0];

    let matchOrder = partOrder?.length === 0 ? MaxOrder : partOrder[0];
    // console.log('partOrder', partOrder);
    // console.log('MaxOrder', MaxOrder);
    // console.log('matchOrder', matchOrder);
    skuFrameNo.value = matchOrder?.frameNo;
    return matchOrder;
  };

  const currentNum = ref('');
  // 投篮方法
  const shootSkuFn = async (proDetailId) => {
    const str = /^[0-9]*[1-9][0-9]*$/;
    if (!str.test(formData.skuNum)) {
      return ElMessage.warning('投篮数量需要大于0！');
    }
    let matchOrder = getShootSku();
    proDetailId = matchOrder?.id; // 生产详情id
    try {
      let params = {
        id: proDetailId,
        batchNo: formData.batchNo,
        prodSSku: formData.sku,
        matchQty: formData.skuNum
      };
      skuRef.value.select();
      const { code, data } = await putInFrame(params);
      printSku.value = formData.sku;
      if (code === '0000') {
        let matchQty = formData.skuNum;
        // 订单进度
        let progressInfo = [];
        [data].forEach((item) => {
          skuFrameNo.value = item?.frameNo;

          item.detailDtoList.forEach((cItem) => {
            cItem.frameNo = item.frameNo;
            cItem.prodSId = item.prodSId;
            cItem.parSku = item.prodSSku;
            cItem.produceNo = item.produceNo;
            // 将订单进度中的商品sku 投篮数修改
            if (cItem.prodSSku.toUpperCase() === formData.sku.toUpperCase()) {
              // 匹配商品sku
              // cItem.matchQty = cItem.totalRequireQty;
              cItem.matchQty = Number(cItem.matchQty);
              currentNum.value = Number(cItem.matchQty);
            }
            progressInfo.push(cItem);
            // 篮号 数量 单位
            if (formData.sku.toUpperCase() === cItem.prodSSku.toUpperCase()) {
              // skuNum.value = cItem?.matchQty;
              skuNum.value = formData.skuNum;
              skuUnit.value = cItem.combDetailDto?.unit || '';
            }
          });
        });
        setTimeout(() => {
          if (matchQty == 1) {
            playBatchNo(skuFrameNo.value);
          } else if (matchQty > 1) {
            playBatchNo('成功');
          }
        }, 100);
        orderProgressInfos.value = progressInfo;
        let lackLastTimeData = JSON.parse(
          localStorage.getItem('LACKLASTTIMEDATA')
        );
        //上次被核单
        prevVerifyOrder.value = lackLastTimeData.produceNo || '无';
        //上次篮号
        if (lackLastTimeData?.frameNo || lackLastTimeData?.frameNo == '0') {
          prevBasketNo.value = lackLastTimeData?.frameNo;
        } else {
          lackLastTimeData.frameNo = '无';
        }
        //存储上次核单篮号信息
        let obj = orderProgressInfos.value[0] || {};
        localStorage.setItem('LACKLASTTIMEDATA', JSON.stringify(obj));

        // 修改组合品信息表 已投篮数量
        originComList.value.forEach((item) => {
          item.detailDtoList.forEach((cItem) => {
            if (
              cItem.prodSSku.toUpperCase() === formData.sku.toUpperCase() &&
              proDetailId === cItem.id
            ) {
              // cItem.matchQty = Number(cItem.matchQty) + Number(formData.skuNum);
              cItem.matchQty = currentNum.value;
            }
          });
        });
        // 更新未投篮sku表格数据
        // 更新已投篮sku表格数据 和 组合品信息列表 是否核完数据
        handleTableData(originComList.value);
        formData.skuNum = '';
      }
      skuRef.value.select();
    } catch (err) {
      console.log(err);
    }
    skuRef.value.select();
  };

  // 核完一单删一单
  const deleteChecckedInfo = () => {
    if (checkList.value.includes('核完一单删一单')) {
      // 更新完 组合品信息表后 如果选择了核完一单删一单
      // 删除列表中核完的数据
      getHandledData();
    }
  };

  // 获取已经核完和未核完的数据
  const getHandledData = () => {
    let uncheckedArr = [];

    combProductInfoList.value.forEach((item) => {
      if (!item.checked) {
        uncheckedArr.push(item);
      } else {
        checkedCombProductInfoList.value.push(item);
      }
    });
    combProductInfoList.value = uncheckedArr;
  };

  // 打印组合品标签
  // 打印的是 已经核完的组合品数据
  const checkedCombProductInfoList = ref([]); // 已经核完的数据
  const printComLabel = () => {
    if (checkList.value.includes('打印组合品标签')) {
      combProductInfoList.value?.forEach((item) => {
        if (item.checked) {
          checkedCombProductInfoList.value.push(item);
        }
      });
      let printArray = [];
      checkedCombProductInfoList.value?.forEach((item) => {
        let obj = {
          printNumber: item.planQty,
          develop: item.bizzOwner,
          prodSSku: item.prodSSku,
          prodName: getTitleAli(item.title),
          printerName: '6515',
          prodStyle: '',
          inPackType: ''
        };
        printArray.push(obj);
      });
      if (checkedCombProductInfoList.value?.length > 0) {
        epeanPrint_plugin_fun(4, printArray);
      }
    }
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

  const getFrameNo = (frameNo) => {
    if (frameNo == '0' || frameNo) {
      return frameNo;
    } else {
      return '无';
    }
  };

  // 关闭投篮弹窗
  const handleClose = () => {
    emits('close');
  };
</script>

<style lang="scss" scoped>
  .highlight {
    color: red;
    font-weight: bold;
  }
  .combination_shoot {
    :deep(.el-dialog__body) {
      padding-top: 0px !important;
    }
    :deep(.el-dialog__title) {
      font-size: 20px;
    }
    :deep(.el-checkbox__label) {
      font-size: 24px;
    }
    .search_form {
      :deep(.el-form-item__label) {
        font-size: 18px;
        width: 90px !important;
      }
    }
    :deep(.vxe-cell--label) {
      font-size: 18px;
      color: #000;
    }
    :deep(.vxe-table--body) {
      .vxe-cell {
        font-size: 18px;
        color: #000;
      }
    }
  }
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .title {
    font-size: 14px;
    margin: 10px 0;
    font-weight: 700;
    height: 20px;
  }
  .opreate {
    width: 300px;
    display: flex;
    justify-content: center;
  }
  .shoot_print,
  .shoot_num,
  .shoot_operate {
    height: 30px;
    display: flex;
  }
  .shoot_operate {
    justify-content: center;
  }
  .text_com {
    font-weight: bold;
    font-size: 68px;
    margin-left: 20px;
  }
  .font_size_20 {
    font-size: 24px;
  }
  .shoot_container {
    display: flex;
    .shoot_content {
      display: flex;
      flex-direction: column;
    }
    .shoot_right {
      width: 20%;
      height: 85%;
    }
    .right_form {
      margin-top: 10px;
      padding: 20px 0px 0px 10px;
      flex: 1;
      box-shadow: 0px 0px 10px 1px #cccccc;
    }
    .shoot_left,
    .shoot_center {
      flex: 1;
      display: flex;
      flex-direction: column;

      .shoot_info,
      .shoot_not_sku,
      .shoot_progress,
      .shoot_sku {
        flex: 1;
        margin: 10px 10px 0 0;
        padding: 0 10px;
        border: 1px solid #eee;
      }
    }
  }
</style>
