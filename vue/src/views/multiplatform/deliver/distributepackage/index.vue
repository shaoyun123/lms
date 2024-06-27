<template>
  <div class="distribute_package app-container">
    <!-- 数据筛选 start -->
    <el-card class="common_split_bottom search_card">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-form-item label="平台">
          <MultiSelect
            v-model="formData.platCode"
            :option-obj="{ optionList: platList }"
          />
          <!-- <el-select placeholder="请选择" multiple clearable filterable>
            <el-option
              v-for="item in platList"
              :key="item"
              :lbael="item"
              :value="item"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="商品SKU">
          <el-input
            ref="skuInput"
            v-model="formData.prodSSku"
            placeholder="回车搜索"
            @keyup.enter="submitForm()"
          ></el-input>
        </el-form-item>
        <el-form-item label="货件计划">
          <el-input
            ref="platOrderIdInput"
            v-model="formData.platOrderId"
            placeholder="回车搜索"
            @keyup.enter="submitForm()"
          ></el-input>
        </el-form-item>
        <el-form-item label="批次号">
          <el-input
            v-model="formData.batchNo"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <div style="float: right">
          <el-form-item>
            <el-tooltip placement="top">
              <template #content>
                打印尺寸为70*40,打印机名称需设置为:7040<br />打印尺寸为100*100,打印机名称需设置为:100100
                <br />tiktok打印尺寸为70*20,打印机名称需设置为:7040
              </template>
              <el-checkbox v-model="formData.autoPrint" label="自动打印标签" />
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="formData.printNums">
              <el-radio :value="1">打印发货数量</el-radio>
              <el-radio :value="0">自定义发货数量</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formData.customNum"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <!-- 数据筛选 end -->
    <el-card class="distribute_package_body list_card">
      <div class="package_table">
        <!-- 表格工具条 -->
        <vxe-toolbar ref="xToolbar" custom>
          <template #buttons>
            <vxe-button
              v-if="tableNums"
              type="text"
              status="primary"
              :content="'数量:' + tableNums"
            ></vxe-button>
            <!-- <el-button type="primary" @click="exportStockHandle">
              导出呆滞库存
            </el-button> -->
          </template>
          <template #tools>
            <el-button type="primary" @click="unSaveGoodsHandle">
              未存框货品
            </el-button>
            <el-button type="primary" @click="packableSingleHandle">
              可配单品
            </el-button>
            <el-button type="primary" @click="packableMultiHandle">
              可配组合品
            </el-button>
            <vxe-button type="text" class="tool-btn"></vxe-button>
          </template>
        </vxe-toolbar>
        <!-- 表格 -->
        <vxe-table
          ref="xTable"
          border
          height="auto"
          :loading="loading"
          :data="tableData"
          :scroll-y="{ gt: 15 }"
          align="left"
          :column-config="{ resizable: true }"
        >
          <vxe-column field="number" title="编号" width="130">
            <template #default="{ row }">
              <div class="distribute_td">
                <div>
                  货件:{{ row.shipmentInfo && row.shipmentInfo.platOrderId }}
                </div>
                <div>
                  框号:{{ row.shipmentInfo && row.shipmentInfo.frameCode }}
                </div>
                <div>店铺:{{ row.storeAcct }}</div>
                <div>销售:{{ row.salesperson }}</div>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="image" title="SKU图片" width="100">
            <template #default="{ row }">
              <ImagePop :src="row.prodSInfoDto.image || ''" />
            </template>
          </vxe-column>
          <vxe-column field="skuInfo" title="SKU信息" width="130">
            <template #default="{ row }">
              <div class="distribute_td">
                <div>商品:{{ row.prodSSku }}</div>
                <div>店铺:{{ row.sellerSku }}</div>
                <div>variId:{{ row.prodSId }}</div>
                <div>条码:{{ row.barCode }}</div>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="salerRemark" title="销售备注">
            <template #default="{ row }">
              <span style="color: #000000; font-weight: bold">{{
                row.salerRemark
              }}</span>
            </template>
          </vxe-column>
          <vxe-column field="packDesc" title="包装备注">
            <template #default="{ row }">
              <span style="color: #000000; font-weight: bold">{{
                row.packDesc
              }}</span>
            </template>
          </vxe-column>
          <vxe-column field="combination" title="组合品" width="60">
            <template #default="{ row }">
              <span>
                {{
                  row.prodSInfoDto
                    ? row.prodSInfoDto.isCombination
                      ? '是'
                      : '否'
                    : ''
                }}
              </span>
            </template>
          </vxe-column>
          <vxe-colgroup title="组合品详情">
            <vxe-column field="combinationImg" title="图片">
              <template #default="{ row }">
                <div
                  v-for="item in row.prodSInfoDto.combSubProds"
                  :key="item.id"
                  class="combination_td"
                >
                  <el-popover
                    placement="right"
                    width="500px"
                    :hide-after="0"
                    trigger="hover"
                  >
                    <template #default>
                      <el-image :src="item.image || ''" />
                    </template>
                    <template #reference>
                      <el-image
                        v-if="item.image"
                        loading="lazy"
                        :src="item.image + '!size=60x60' || ''"
                        style="width: 60px; height: 60px"
                      />
                    </template>
                  </el-popover>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="sSku" title="商品SKU">
              <template #default="{ row }">
                <div
                  v-for="item in row.prodSInfoDto.combSubProds"
                  :key="item.id"
                  class="combination_td"
                >
                  <span>{{ item.sSku }}</span>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="locationCode" title="库位" width="150">
              <template #default="{ row }">
                <div
                  v-for="item in row.prodSInfoDto.combSubProds"
                  :key="item.id"
                  class="combination_td"
                >
                  <span>{{ item.combLocation.locationCode }}</span>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="prodDetailNums" title="几个一包">
              <template #default="{ row }">
                <div
                  v-for="item in row.prodSInfoDto.combSubProds"
                  :key="item.id"
                  class="combination_td"
                >
                  <span>{{ item.prodDetailNums }}</span>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="totalNums" title="商品数量">
              <template #default="{ row }">
                <div
                  v-for="item in row.prodSInfoDto.combSubProds"
                  :key="item.id"
                  class="combination_td"
                >
                  <span>{{ item.prodDetailNums * row.planQuantity }}</span>
                </div>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <vxe-column field="planQuantity" title="计划发货数量" width="90" />
          <vxe-column field="restNum" title="剩余可用" width="70">
            <template #default="{ row }">
              <span>{{
                row.whStock
                  ? row.whStock.currentStock - row.whStock.reservationStock
                  : 0
              }}</span>
            </template>
          </vxe-column>
          <vxe-column field="actQuantity" title="实发数量">
            <template #default="{ row }">
              <el-input v-model="row.actQuantity"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="handle" title="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" @click="printBarcodeLabel(row)">
                修改实发数量
              </el-button>
              <el-tooltip
                v-if="row.platCode === 'temu'"
                placement="top"
                content="打印尺寸为100*100,打印机名称需设置为:100100"
              >
                <el-button type="primary" @click="printHandle(row)">
                  打印箱唛
                </el-button>
              </el-tooltip>
              <el-button
                v-if="row.platCode !== 'temu'"
                type="primary"
                @click="printHandle(row)"
              >
                打印箱唛
              </el-button>
              <el-button type="primary" @click="supplyPrintHandle(row)">
                打印款号标签
              </el-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </el-card>
    <single-dialog
      v-if="singleDialogVisible"
      v-model="singleDialogVisible"
      :plat-store-list="platStoreList"
    />
    <save-dialog v-if="saveDialogVisible" v-model="saveDialogVisible" />
    <multi-dialog
      v-if="multiDialogVisible"
      v-model="multiDialogVisible"
      :plat-store-list="platStoreList"
    />
    <choose-pack
      v-if="showChoosePack"
      :is-visible="showChoosePack"
      :choose-data="chooseData"
      @choose="handleSubmit"
      @close="handleClose"
    />
  </div>
</template>

<script setup name="multiplatformdeliverdistributepackage">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { reactive, ref, nextTick, onMounted } from 'vue';
  import {
    queryPackableBySku,
    // exportUnSendStock,
    getRepoName,
    packShipmentDetail
  } from '@/api/multiplatform/distributepackage';
  import { getWaterMarkLabel } from '@/api/common';
  import {
    getCaseLabelData,
    // getAllPlatData,
    getLazadaPrint,
    getSheinPrint,
    getSheinCase,
    savePrintCaseLabelLog,
    queryAeCaleLabelApi,
    queryAeEuCaleLabelApi,
    queryIfNeedEuLabelApi
    // queryIfPrintFoodLabelApi
  } from '@/api/multiplatform/shipmentplan';
  import { getAllPlatList } from '@/api/common/index.js';
  import {
    commonGetPrintInfoApi,
    commonGetPrintInfoAndWrongMsgApi
  } from '@/api/multiplatform/common';

  // import { download } from '@/utils/common';
  import { epeanPrint_plugin_fun, commonExecutePrintJobs } from '@/utils/print';
  import qs from 'qs';
  import axios from 'axios';
  import { ElMessage, ElLoading, ElMessageBox } from 'element-plus';
  import SingleDialog from './dialogs/Single.vue';
  import saveDialog from './dialogs/Save.vue';
  import MultiDialog from './dialogs/Multi.vue';
  import ChoosePack from './dialogs/Choosepack.vue';
  import { cloneDeep, difference } from 'lodash-es';
  import MultiSelect from '@/components/MultiSelect/index.vue';

  let xTable = ref(null);
  let xToolbar = ref(null);
  nextTick(() => {
    const $table = xTable.value;
    const $toolbar = xToolbar.value;
    $table.connect($toolbar);
  });

  onMounted(() => {
    getPlatList();
    getRepoNameList();
  });

  const platStoreList = ref([]);
  const getRepoNameList = async () => {
    try {
      const { code, data } = await getRepoName();
      if (code === '0000') {
        data?.forEach((item) => {
          let obj = {
            label: item,
            value: item
          };
          platStoreList.value.push(obj);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const platList = ref([]);
  // 获取所有平台数据
  const getPlatList = async () => {
    try {
      const { code, data } = await getAllPlatList();
      if (code === '0000') {
        platList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  //#region 提交功能
  let loading = ref(false);
  let tableNums = ref(0);
  const formData = reactive({
    prodSSku: '',
    platCode: [],
    platOrderId: '',
    autoPrint: true,
    printNums: 1,
    customNum: '',
    batchNo: ''
  });
  let tableData = ref([]);
  const chooseData = ref([]);
  let boxCodeVisitUrlPrex = ref(null);
  const showChoosePack = ref(false);
  const skuInput = ref(null);
  const platOrderIdInput = ref(null);

  const submitForm = async () => {
    skuInput.value.blur();
    platOrderIdInput.value.blur();
    try {
      if (!formData.platCode?.length) {
        ElMessage.error('平台不能为空!');
        return;
      }
      //仅支持AE全托管和AE半托管的平台多选
      if (
        formData.platCode?.length >= 2 &&
        difference(formData.platCode, ['AE全托管', 'AE半托管']).length
      ) {
        ElMessageBox.alert('仅支持AE全托管和AE半托管的平台多选!', '提示', {
          confirmButtonText: '确认',
          type: 'warning'
        });
        return;
      }
      if (!formData.prodSSku) {
        ElMessage.error('SKU不能为空!');
        return;
      } else {
        // 批次号
        if (formData.batchNo === '') {
          formData.batchNo = null;
        }

        loading.value = true;
        const searchParams = cloneDeep({
          ...formData,
          platCodeStr: formData.platCode.join(',')
        });
        delete searchParams.platCode;
        let queryObj = await queryPackableBySku(searchParams);
        loading.value = false;
        if (queryObj && queryObj.data) {
          boxCodeVisitUrlPrex.value = queryObj.extra;
          for (let i = 0; i < queryObj.data.length; i++) {
            queryObj.data[i]['actQuantity'] = queryObj.data[i]['planQuantity'];
          }
        }
        tableNums.value =
          (queryObj && queryObj.data && String(queryObj.data.length)) || 0; //查询到的数据数量

        // 可能存在一个sku对应多个货件计划
        let idList = [];
        queryObj.data?.forEach((item) => {
          if (!idList.includes(item.shipmentInfo?.platOrderId)) {
            idList.push(item.shipmentInfo?.platOrderId);
          }
        });

        if (idList?.length <= 1) {
          // 一条数据 或者 货件编号相同
          // 待发货的优先级更高
          // 获取待发货的数据
          let waitSendList = queryObj.data.filter(
            (item) => item.packStatus === 1
          );
          if (waitSendList[0]) {
            tableData.value = [waitSendList[0]];
          } else {
            tableData.value = [queryObj.data[0]] || [];
          }

          // 如果只有一种数据时 清空 sku 和 货件计划
          formData.prodSSku = '';
          formData.platOrderId = '';
          skuInput.value.focus();
        } else {
          chooseData.value = queryObj.data || [];
          showChoosePack.value = true;
        }
        //触发打印功能
        if (idList?.length == 1) {
          let resultObj = tableData.value[0];
          if (
            formData.autoPrint &&
            resultObj['prodSInfoDto'] &&
            !resultObj['prodSInfoDto']['isCombination']
          ) {
            // 包装成功打印
            let { code, msg } = await packShipmentDetail(resultObj);
            if (code === '0000') {
              await packageHandle(resultObj);
            } else {
              ElMessage.warning(msg || '操作失败');
            }
          }
        }
      }
    } catch (err) {
      loading.value = false;
      console.error('配货包装', err);
    }
    //输入框选中
    // selectInput();
  };

  const handleSubmit = (val) => {
    formData.platOrderId = val;
    submitForm();
  };

  const handleClose = () => {
    showChoosePack.value = false;
  };

  const pdfInfo = ref([]);

  // 打印水洗唛+英文标签
  const getWaterMarkLabelFile = async (params, actQuantity) => {
    try {
      const { code, data } = await getWaterMarkLabel(params);
      if (code === '0000') {
        pdfInfo.value = data;
        pdfInfo.value &&
          pdfInfo.value.forEach((item) => {
            if (item.pdfUrl) {
              let params = {
                url: item.pdfUrl,
                width: item.pdfLength === 'B' ? 100 : 60,
                height: item.pdfLength === 'B' ? 40 : 55,
                amount:
                  formData.printNums == 1 ? actQuantity : formData.customNum,
                printType: '100',
                printerName: item.pdfLength === 'B' ? '10040' : '6055'
              };
              printCase(params);
            }
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 输入框内容选中
  // const selectInput = () => {
  //   document.activeElement.focus();
  //   document.activeElement.select();
  // };

  // 打印货品标签 7040 temu不打印 只打印四合一
  const printProductLabel = async (data) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      //在执行打印操作70*40面单
      // let result = await packShipmentDetail(data);
      // ElMessage.success(result.msg || '操作成功!');
      if (data.shipmentInfo?.platCode !== 'temu') {
        let amount =
          formData.printNums == 1
            ? data.actQuantity
            : formData.customNum === ''
            ? data.actQuantity
            : formData.customNum;
        if (data.shipmentInfo?.platCode == 'lazada') {
          lazadaPrint(data.id, amount);
        } else {
          if (data.shipmentInfo?.platCode !== 'shein自营') {
            let printerName = 6040;
            let jspaper = 'platWhSellerSku7040.jasper';
            if (data.shipmentInfo?.platCode == 'tiktok') {
              printerName = 7020;
              jspaper = 'platWhSellerSku7020.jasper';
            }
            let printObj70 = {
              printerName: printerName,
              jspaper: jspaper,
              printDetailDtoList: [
                {
                  titleMap: {
                    barCode: data.barCode,
                    top1:
                      data.shipmentInfo?.platCode === 'shopee'
                        ? data.prodSSku
                        : data.sellerSku,
                    top2: data.specification,
                    bottom1: data.showCode,
                    bottom2: 'Made In China',
                    bottomLine: data.title
                  },
                  // sku 回车打印 选中自定义发货数量时，打印数量为自定义发货数量，反之为实发数量
                  amount: amount
                }
              ]
            };
            await epeanPrint_plugin_fun(99, printObj70);
            resolve();
          }
        }
      }
    });
  };

  const lazadaPrint = async (detailId, amount) => {
    try {
      const { code, data } = await getLazadaPrint({
        detailIds: [detailId]
      });
      if (code === '0000') {
        let obj = {
          jspaper: 'lazadaBarCode6040.jasper',
          printDetailDtoList: [
            {
              titleMap: {
                barCode: data[0]?.barCode,
                fulfillmentSku: data[0]?.fulfillmentSku,
                last3BarCode: data[0]?.last3BarCode,
                title: data[0]?.title
              },
              amount: amount
            }
          ],
          printerName: '6040' // 不填则使用默认打印机
        };
        epeanPrint_plugin_fun(99, obj);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 打印框号标签 100100 修改实发数
  const printBarcodeLabel = async (data) => {
    //100*100面单[组合品情况单独处理]
    console.log('data====', data);
    let { code, msg } = await packShipmentDetail(data);
    if (code === '0000') {
      handleBarCodeNoPack(data);
    } else {
      ElMessage.warning(msg || '操作失败');
    }
  };

  // 打印框号标签
  const handleBarCodeNoPack = async (data) => {
    // tplName不同平台取不同值
    let tplName = data.shipmentInfo?.platCode + '框号标签';
    if (
      data.shipmentInfo?.platCode === 'AE全托管' ||
      data.shipmentInfo?.platCode === 'AE半托管'
    ) {
      tplName = 'AE平台框号标签';
    }
    const params = {
      tplName,
      printTplType: 'PLAT_FRAME_LABEL',
      addPlatSkuInfoLabel: 1,
      bizId: data.id
    };
    commonGetPrintInfoAndWrongMsgApi(params).then(async (res) => {
      if (res.code === '0000') {
        await commonExecutePrintJobs([res.data]);
      } else if (
        res.code === '9999' &&
        (res.msg.includes('未获取到模板') || res.msg.includes('已禁用'))
      ) {
        handleOldBarCodeNoPack(data);
      } else {
        ElMessageBox.alert(res.msg || '请求失败', '错误信息', {
          confirmButtonText: '确认',
          type: 'error',
          dangerouslyUseHTMLString: true
        });
      }
    });
  };
  // 打印框号标签(原有的)
  const handleOldBarCodeNoPack = (data) => {
    let printObj100 = {};
    // 判断 框号（bottomLine1），是XU开头，barCode传bottomLine1一样的值，并且deliverOrderSn传一个字“单”
    const isIncludeXu = ref(false);
    const newBarCode = ref('');
    const newSpecification = ref('');

    if (data.shipmentInfo?.platCode === 'shein自营') {
      newBarCode.value = data.sellerSku;
    } else {
      newBarCode.value = data.barCode;
    }
    if (data.shipmentInfo && data.shipmentInfo.frameCode.includes('XU')) {
      newBarCode.value = data.shipmentInfo.frameCode;
      isIncludeXu.value = true;
    }
    if (data.shipmentInfo?.platCode === 'temu') {
      newSpecification.value = data.className || '';
    } else {
      newSpecification.value = data.specification || '';
    }

    let sellerSkuCode = '';
    if (
      data.shipmentInfo?.platCode === 'AE全托管' ||
      data.shipmentInfo?.platCode === 'AE半托管'
    ) {
      sellerSkuCode = data.alias;
    } else {
      sellerSkuCode =
        !!data.shipmentInfo?.deliverOrderSn &&
        data.shipmentInfo?.platCode === 'temu'
          ? `后台已创建${data.sellerSkuCode}`
          : data.sellerSkuCode;
    }
    if (data['prodSInfoDto'] && data['prodSInfoDto']['isCombination']) {
      //组合品单独处理
      //组合品详情
      let combinationData = data['prodSInfoDto']['combSubProds'];
      let combinationProdSSKUArr = [];
      let combinationLocationCodeArr = [];
      for (let i = 0; i < combinationData.length; i++) {
        let item = combinationData[i];
        combinationProdSSKUArr.push(`${item.sSku}*${item.prodDetailNums}`);
        combinationLocationCodeArr.push(
          `${item.combLocation.locationCode || '-'}`
        );
      }

      printObj100 = {
        printerName: 10040,
        jspaper: 'platWhSellerSku10040.jasper',
        printDetailDtoList: [
          {
            titleMap: {
              barCode: isIncludeXu.value ? newBarCode.value : data.id,
              bottomLine1: data.shipmentInfo && data.shipmentInfo.frameCode,
              bottomLine2: `货件计划:${
                data.shipmentInfo && data.shipmentInfo.platOrderId
              }`,
              bottomLine3: `实发数量:${data.actQuantity}  种类:${data.shipmentInfo.skuNumber}`,
              prodSSku: `${combinationProdSSKUArr.join('\n')}`,
              deliverOrderSn: isIncludeXu.value
                ? `单 ${data.storeAcct || ''}`
                : `${data.shipmentInfo?.deliverOrderSn}${data.storeAcct || ''}`,
              locationCode: `${combinationLocationCodeArr.join('\n')}`,
              sellerSkuCode,
              specification: newSpecification.value,
              comBoxNo: data.shipmentInfo?.comBoxNo || ''
            },
            amount: 1
          }
        ]
      };
    } else {
      printObj100 = {
        printerName: 10040,
        jspaper: 'platWhSellerSku10040.jasper',
        printDetailDtoList: [
          {
            titleMap: {
              barCode: isIncludeXu.value ? newBarCode.value : data.id,
              bottomLine1: data.shipmentInfo && data.shipmentInfo.frameCode,
              bottomLine2: `货件计划:${
                data.shipmentInfo && data.shipmentInfo.platOrderId
              }`,
              bottomLine3: `实发数量:${data.actQuantity} 种类:${data.shipmentInfo.skuNumber}`,
              prodSSku: `${data.prodSSku}`,
              deliverOrderSn: isIncludeXu.value
                ? `单 ${data.storeAcct || ''}`
                : `${data.shipmentInfo?.deliverOrderSn}${data.storeAcct || ''}`,
              locationCode: `${data.locationCode}`,
              sellerSkuCode,
              specification: newSpecification.value,
              comBoxNo: data.shipmentInfo?.comBoxNo || ''
            },
            amount: 1
          }
        ]
      };
    }

    let printObj = Object.assign({}, printObj100);
    printObj.jspaper = 'platWhSellerSku10040first.jasper';
    epeanPrint_plugin_fun(99, printObj);
    epeanPrint_plugin_fun(99, printObj100);
  };

  // 回车之后打印
  const packageHandle = async (data) => {
    try {
      if (data.shipmentInfo?.platCode === 'temu') {
        await printTemuFourToOne(data); // 打印 temu 四合一标签
        handleBarCodeNoPack(data); // 打印框号标签
        // 查询是否有水洗唛和英文标签
        let params = {
          shipmentId: data.shipmentId,
          barCode: data.barCode
        };
        getWaterMarkLabelFile(params, data.actQuantity);
      } else if (data.shipmentInfo?.platCode === 'shein自营') {
        // shein自营 获取商品标签 水洗唛 眼镜贴 环保贴
        handlePrintShein(data, 'submit');
      } else if (
        data.shipmentInfo?.platCode === 'AE全托管' ||
        data.shipmentInfo?.platCode === 'AE半托管'
      ) {
        handlePrintAEPord(data);
        handleBarCodeNoPack(data); // 打印框号标签
        isNeedPrintEU(data);
      } else if (data.shipmentInfo?.platCode === 'tiktok') {
        // tiktok 打印商品标签，框号标签，sku信息标签
        await printTiktokLabel(data);
        // printHandle(data); //打印箱唛
      } else {
        printProductLabel(data); // 打印货品标签
        handleBarCodeNoPack(data); // 打印框号标签
      }
    } catch (err) {
      console.error('已包装', err);
    }
  };

  // shein自营 需要额外打印 商品标签 水洗唛 眼镜贴 环保贴
  const handlePrintShein = async (value, type = '') => {
    try {
      let amount =
        formData.printNums == 1
          ? value.actQuantity
          : formData.customNum === ''
          ? value.actQuantity
          : formData.customNum;
      let params = {
        platOrderId: value.shipmentInfo?.platOrderId, //  货件编号
        storeAcctId: value.storeAcctId, // 店铺id
        sellerSku: value.sellerSku, // 店铺sku
        sellerSkc: value.sellerSkc,
        prodSSku: value.prodSSku,
        num: Number(amount) // 打印数量
      };
      const { code, data } = await getSheinPrint(params);
      if (code === '0000') {
        // 打印商品标签
        data.barCodeUrl &&
          (await printSheinInfo(
            data?.barCodeUrl,
            '7020',
            amount,
            '70',
            '20',
            'itemLabel'
          ));
        // 打印水洗唛
        data.waterMark &&
          printSheinInfo(data?.waterMark, '7020', amount, '70', '20');
        // 打印环保贴
        data.envMark &&
          printSheinInfo(data?.envMark, '7020', amount, '70', '20');
        // 打印眼镜贴
        data.eyesMark &&
          printSheinInfo(data?.eyesMark, '10040', amount, '100', '40');

        type === 'submit' && printBarcodeLabel(value); // 打印框号标签
      }
    } catch (err) {
      console.log(err);
    }
  };

  const printSheinInfo = async (
    pdfUrl,
    printerName,
    amount,
    width,
    height,
    type = ''
  ) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      let params = {
        url: pdfUrl,
        amount: type === 'itemLabel' ? 1 : Number(amount),
        printType: '100',
        width,
        height,
        printerName: printerName
      };
      await printCase(params);
      resolve();
    });
  };

  // temu 四合一标签
  const printTemuFourToOne = (data) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (data.shipmentInfo?.platCode === 'temu') {
        let amount =
          formData.printNums == 1
            ? data.actQuantity
            : formData.customNum === ''
            ? data.actQuantity
            : formData.customNum;
        // const { data: ifPrintLabel } = await queryIfPrintFoodLabelApi({
        //   id: data.id
        // });
        // let printDetailDtoList = [
        //   {
        //     titleMap: {
        //       barCode: data.barCode,
        //       sellerSku: data.sellerSku,
        //       specification: data.specification,
        //       showCode: data.showCode,
        //       MIC: 'Made In China',
        //       companyName1: 'Manufacturer',
        //       companyName: data.companyName,
        //       Location1: 'Address',
        //       Location:
        //         window.location.href.indexOf('mx.epean') > -1
        //           ? '2nd Floor, Building 2, No. 218, Xushan Road, Pujiang County, Jinhua City, Zhejiang Province'
        //           : '618 Yongzai Avenue, Xianhua Street, Pujiang County, Jinhua City, Zhejiang Province',
        //       ProductName1: 'Product name',
        //       ProductName: data.keyword,
        //       warning:
        //         'To avoid danger of suffocation, keep this plastic bag away from babies and children. Do not use this bag in cribs, beds, carriages or play pens.',
        //       warning1: '⚠WARNING⚠'
        //     },
        //     amount,
        //     ifPrintLabel
        //   }
        // ];
        // let printObj10040 = {
        //   printerName: '6055',
        //   jspaper: 'platWhSellerSku7040FourToOne.jasper',
        //   printDetailDtoList
        // };
        // await epeanPrint_plugin_fun(99, printObj10040);
        const bizId = new Array(amount).fill(data.id).join();
        const params = {
          tplName: 'TEMU商品标签',
          printTplType: 'PLAT_PROD_LABEL',
          bizId
        };
        const { data: printObj } = await commonGetPrintInfoApi(params);
        await commonExecutePrintJobs([printObj]);
        resolve();
      }
    });
  };
  // tiktok 打印商品标签，框号标签，sku信息标签
  const printTiktokLabel = (data) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (data.shipmentInfo?.platCode === 'tiktok') {
        let amount =
          formData.printNums == 1
            ? data.actQuantity
            : formData.customNum === ''
            ? data.actQuantity
            : formData.customNum;
        const bizId = new Array(amount).fill(data.id).join();
        const paramsArr = [
          {
            tplName: 'Tiktok商品标签',
            printTplType: 'PLAT_PROD_LABEL',
            bizId
          },
          {
            tplName: 'Tiktok框号标签',
            printTplType: 'PLAT_FRAME_LABEL',
            bizId: data.id
          }
        ];
        paramsArr.forEach(async function (params) {
          const { data: printObj } = await commonGetPrintInfoApi(params);
          const arr = [];
          if (params.tplName == 'Tiktok商品标签') {
            await commonExecutePrintJobs([printObj]);
          } else {
            printObj.labelUrl.split(',').forEach((v) => {
              arr.push({
                ...printObj,
                labelUrl: v
              });
            });
            await commonExecutePrintJobs(arr);
          }
        });
        resolve();
      }
    });
  };

  // 打印款号标签 货品标签 + 水洗唛 + 英文标签
  const supplyPrintHandle = async (data) => {
    try {
      if (data.shipmentInfo?.platCode === 'temu') {
        await printTemuFourToOne(data);
        // 查询是否有水洗唛和英文标签
        let params = {
          shipmentId: data.shipmentId,
          barCode: data.barCode
        };
        getWaterMarkLabelFile(params, data.actQuantity);
      } else if (data.shipmentInfo?.platCode === 'shein自营') {
        // shein自营 获取商品标签 水洗唛 眼镜贴 环保贴
        handlePrintShein(data);
      } else if (
        data.shipmentInfo?.platCode === 'AE全托管' ||
        data.shipmentInfo?.platCode === 'AE半托管'
      ) {
        handlePrintAEPord(data);
        isNeedPrintEU(data);
      } else if (data.shipmentInfo?.platCode === 'tiktok') {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
          let amount =
            formData.printNums == 1
              ? data.actQuantity
              : formData.customNum === ''
              ? data.actQuantity
              : formData.customNum;
          const bizId = new Array(amount).fill(data.id).join();
          const params = {
            tplName: 'Tiktok商品标签',
            printTplType: 'PLAT_PROD_LABEL',
            bizId
          };
          const { data: printObj } = await commonGetPrintInfoApi(params);
          await commonExecutePrintJobs([printObj]);
          resolve();
        });
      } else {
        await printProductLabel(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintAEPord = async (val) => {
    try {
      let params = {
        printTemplateType: 'PLAT_WH_LABEL',
        tplName: 'AE仓发_商品标签',
        bizzId: val.id
      };
      const { code, data } = await queryAeCaleLabelApi(params);
      if (code === '0000') {
        if (data.labelUrl) {
          let amount =
            formData.printNums == 1
              ? val.actQuantity
              : formData.customNum === ''
              ? val.actQuantity
              : formData.customNum;
          let url = data.labelUrl;
          // type 0 回车触发打印; 1 点击列表按钮 打印款号标签
          // 目前只有回车事件 多打印一次amount
          // let labelUrl = type
          //   ? Array(Number(amount)).fill(url).join(',')
          //   : Array(Number(amount) + 1)
          //       .fill(url)
          //       .join(',');

          // 3.25 回车事件 取消多打印一次商品标签
          let labelUrl = Array(amount).fill(url).join(',');
          let obj = {
            printType: 19,
            width: data.width,
            height: data.height,
            printName: data.printName,
            labelUrl
          };
          printCase(obj);
        } else {
          ElMessage.warning('无商品标签');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 欧盟标签
  const handlePrintAEEU = async (val) => {
    try {
      let amount =
        formData.printNums == 1
          ? val.actQuantity
          : formData.customNum === ''
          ? val.actQuantity
          : formData.customNum;
      let params = {
        printNum: amount,
        bizzId: val.id
      };
      const { code, data } = await queryAeEuCaleLabelApi(params);
      if (code === '0000') {
        if (data.labelUrl) {
          let obj = {
            printType: 19,
            width: data.width,
            height: data.height,
            printName: data.printName,
            labelUrl: data.labelUrl
          };
          printCase(obj);
        } else {
          ElMessage.warning('无欧盟标签');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 是否需要打印欧盟标签
  const isNeedPrintEU = async (val) => {
    try {
      const { code, data } = await queryIfNeedEuLabelApi({ id: val.id });
      if (code === '0000') {
        if (data) {
          handlePrintAEEU(val);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //#endregion

  //#region 导出呆滞商品功能
  // const exportStockHandle = async () => {
  //   try {
  //     let unSendStock = await exportUnSendStock();
  //     download(unSendStock, '呆滞库存.xlsx');
  //     //传参给组件
  //   } catch (err) {
  //     console.error('导出呆滞库存', err);
  //   }
  // };
  //#endregion

  //#region 未存框取货功能
  let saveDialogVisible = ref(false);
  const unSaveGoodsHandle = async () => {
    try {
      //打开弹框
      saveDialogVisible.value = true;
      //传参给组件
    } catch (err) {
      console.error('未存框取货', err);
    }
  };
  //#endregion

  //#region 可配单品
  let singleDialogVisible = ref(false);
  const packableSingleHandle = async () => {
    try {
      //打开弹框
      singleDialogVisible.value = true;
    } catch (err) {
      console.error('可配单品', err);
    }
  };
  //#endregion

  //#region 可配多品
  let multiDialogVisible = ref(false);
  const packableMultiHandle = async () => {
    try {
      //打开弹框
      multiDialogVisible.value = true;
    } catch (err) {
      console.error('可配多品', err);
    }
  };
  //#endregion

  //打印箱唛
  const printHandle = async (data) => {
    if (
      data.shipmentInfo?.platCode == 'AE全托管' ||
      data.shipmentInfo?.platCode == 'AE半托管'
    ) {
      try {
        let params = {
          printTemplateType: 'PLAT_WH_LABEL',
          tplName: 'AE仓发_箱唛',
          bizzId: data.shipmentId
        };
        const res = await queryAeCaleLabelApi(params);
        if (res.code === '0000') {
          let val = res.data;
          if (val.labelUrl) {
            let obj = {
              printType: 19,
              width: val.width,
              height: val.height,
              printName: val.printName,
              labelUrl: val.labelUrl
            };
            printCase(obj);
          } else {
            ElMessage.error('没有箱唛可以打印');
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      const res = await savePrintCaseLabelLog({ id: data.shipmentId });
      if (res.code === '0000') {
        let { shipmentInfo } = data;
        let caseLabel = shipmentInfo.caseLabel;
        if (!caseLabel) {
          if (data.shipmentInfo?.platCode === 'shein自营') {
            getSheinCaseLabel(data);
          }
          if (data.shipmentInfo?.platCode === 'temu') {
            getCaseLabel(data.shipmentId);
          }
        } else {
          let caseLabelArr = caseLabel.split(',');
          for (let i = 0; i < caseLabelArr.length; i++) {
            let caseLabelItem = caseLabelArr[i];
            let obj = {
              printerName:
                data.shipmentInfo?.platCode === 'shopee' ? '100150' : '100100',
              printType: 100,
              width: 100,
              height: 100,
              url: boxCodeVisitUrlPrex.value + caseLabelItem,
              amount: 1
            };
            printCase(obj);
          }
        }
      }
    }
  };

  // 获取箱唛 shein 自营
  const getSheinCaseLabel = async (value) => {
    try {
      let params = {
        platOrderId: value.shipmentInfo?.platOrderId || '',
        storeAcctId: value.storeAcctId || ''
      };
      const { code, data } = await getSheinCase(params);
      if (code === '0000') {
        let obj = {
          printerName: '100100',
          printType: 100,
          width: 100,
          height: 100,
          url: data?.caseLabelUrl,
          amount: 1
        };
        printCase(obj);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取箱唛
  const getCaseLabel = async (id) => {
    try {
      const { data } = await getCaseLabelData({ id: id });
      let printDetailDtoList = [];
      if (data && data.length > 0) {
        data.forEach((item) => {
          let detailObj = {
            titleMap: {},
            amount: 1
          };
          detailObj.titleMap = item;
          printDetailDtoList.push(detailObj);
        });
        let obj = {
          printType: 99,
          printDto: JSON.stringify({
            printerName: '100100',
            jspaper: 'platWhCaseLabelTemu.jasper',
            printDetailDtoList
          })
        };
        printCase(obj);
      } else {
        return ElMessage.warning('没有可以打印的箱唛！');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 打印
  const printCase = (obj) => {
    return new Promise((resolve, reject) => {
      const loadingInstance = ElLoading.service({
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.4)'
      });
      axios({
        method: 'post',
        url: 'http://localhost:9898/',
        data: qs.stringify(obj)
      })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          var responseText = err.message;
          if (responseText == null || responseText.indexOf('打印成功') == -1) {
            ElMessage.error(
              '打印错误，请检查打印插件是否正常运行或者重新启动插件'
            );
          }
          reject();
        })
        .finally(() => {
          loadingInstance.close();
        });
    });
  };
</script>

<style lang="scss" scoped>
  .distribute_package {
    .distribute_package_body {
      :deep(.el-card__body) {
        height: calc(100vh - 130px);
        .package_table {
          // margin-top: 5px;
          height: 100%;
          .distribute_td {
            display: flex;
            flex-direction: column;
          }
          .vxe-toolbar {
            padding: 0;
            margin-bottom: 8px;
          }
          .combination_td {
            height: 66px;
            padding: 5px;
            line-height: 66px;
          }
        }
      }
    }
  }
</style>
