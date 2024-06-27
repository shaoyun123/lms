<template>
  <el-dialog
    v-model="showBoxup"
    :title="boxType ? '合单装箱' : '装箱'"
    width="80%"
    class="boxup_dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading">
      <el-affix>
        <div class="flex">
          <el-form :inline="true" class="affix_color search_form">
            <el-form-item>
              <el-button type="primary" @click="handleExportTemp"
                >导出模板</el-button
              >
              <el-upload
                :action="'/api/lms/PlatWh/PlatWhShipmentBox/importShipmentBox'"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :show-file-list="false"
                style="margin-left: 12px"
                :disabled="boxData.length === 0"
              >
                <el-button type="primary" @click="handleImport"
                  >导入装箱</el-button
                >
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-select v-model="queryType">
                <el-option label="打印条码" value="barCode"></el-option>
                <el-option label="SKU" value="prodSSku"></el-option>
              </el-select>
              <el-input v-model="queryValue"></el-input>
              <el-button type="primary" @click="handlePosition">定位</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addBox">新增箱子</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="deleteBox">删除箱子</el-button>
            </el-form-item>
          </el-form>
          <div>
            <el-checkbox v-model="checkedBox" label="装箱后发货" />
          </div>
        </div>
      </el-affix>

      <vxe-table
        ref="boxTable"
        :data="boxData"
        max-height="350"
        :scroll-y="{ enabled: false }"
        :footer-method="boxData.length > 0 ? footerMethod : () => {}"
        border
        show-footer
      >
        <vxe-column title="图片" width="100">
          <template #default="{ row }">
            <el-popover
              placement="right"
              width="500px"
              :hide-after="0"
              trigger="hover"
            >
              <template #default>
                <el-image :src="row.image || ''" />
              </template>
              <template #reference>
                <el-image
                  v-if="row.image"
                  loading="lazy"
                  :src="row.image || ''"
                />
              </template>
            </el-popover>
          </template>
        </vxe-column>
        <vxe-column title="商品信息" width="150">
          <template #default="{ row }">
            <div v-if="boxType === 'merge'">店铺：{{ row.storeAcct }}</div>
            <div v-if="boxType === 'merge'">
              货件编号：{{ row.platOrderId || '' }}
            </div>
            <div>条码：{{ row.barCode }}</div>
            <div>SKU：{{ row.prodSSku }}</div>
            <div v-if="boxType === 'merge'">框号：{{ row.frameCode }}</div>
          </template>
        </vxe-column>
        <vxe-column title="包装" width="170">
          <template #default="{ row }">
            <div>人员：{{ row.packer || '' }}</div>
            <div>时间：{{ transferDate(row.packTime) }}</div>
          </template>
        </vxe-column>
        <vxe-column title="存框" width="170">
          <template #default="{ row }">
            <div>人员：{{ row.storeOperator || '' }}</div>
            <div>时间：{{ transferDate(row.storeTime) }}</div>
          </template>
        </vxe-column>
        <vxe-column
          field="actQuantity"
          title="待装箱数量"
          width="80"
        ></vxe-column>
        <vxe-column field="count" title="已打包数量" width="80"></vxe-column>
        <vxe-column
          v-for="(item, index) in boxData[0]?.boxActQuantity"
          :key="index"
          :title="`箱子${index + 1}`"
          width="80"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.boxActQuantity[index]"
              style="width: 60px"
              :min="0"
              @input="changeBoxNum(row)"
            ></el-input>
          </template>
        </vxe-column>
      </vxe-table>

      <vxe-table :align="'center'" :data="bottomData" max-height="600" border>
        <vxe-column title="" width="350">
          <template #default="{ row }">
            <el-input v-model="row.setting" style="width: 100px"></el-input>
            <el-button type="primary" @click="handleSetting(row)"
              >批量设置({{ row.text }})</el-button
            >
          </template>
        </vxe-column>
        <vxe-column title="箱子规格" width="400">
          <template #default="{ row }">
            {{ row.title }}
          </template>
        </vxe-column>
        <vxe-column
          v-for="(item, index) in bottomData[0].setList"
          :key="index"
          :title="`箱子${index + 1}`"
          width="80"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.setList[index]"
              style="width: 60px"
            ></el-input>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <template #footer>
      <div style="display: flex; justify-content: space-between">
        <span>
          <el-button type="primary" @click="handleSubmit('editDeliver')"
            >仅修改发货单(temu)</el-button
          >
          <el-popconfirm
            title="确认取消发货单(temu)？"
            :width="200"
            style="margin-left: 12px"
            @confirm="handleCancel"
          >
            <template #reference>
              <el-button v-if="boxType !== 'merge'" type="danger"
                >取消发货单(temu)</el-button
              >
            </template>
          </el-popconfirm>
        </span>
        <span>
          <el-button type="primary" @click="handleSubmit('save')"
            >提交</el-button
          >
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref, defineProps, computed, defineEmits, watch } from 'vue';
  import {
    saveBoxup,
    saveMergeBox,
    handleEditDeliver,
    cancelTemuDeliveryOrderApi
  } from '@/api/multiplatform/shipmentplan';
  import { transferDate } from '@/utils/common';
  import { transBlob } from '@/utils/downloadFile';
  import { debounce } from 'lodash-es';
  import { epeanPrint_plugin_fun } from '@/utils/print';

  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    // 装箱数据
    boxupInfo: {
      type: Object,
      default: () => {}
    },
    // 合单 还是 单个装箱
    boxType: {
      type: String,
      default: ''
    },
    boxId: {
      type: Number,
      default: null
    },
    batchBoxUpId: {
      type: Array,
      default: () => []
    },
    selectList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['close', 'done']);

  const showBoxup = computed(() => {
    return props.isVisible;
  });

  const boxTable = ref(null);
  const boxData = ref([]);
  const queryType = ref('barCode');
  const queryValue = ref('');
  const loading = ref(false);
  const checkedBox = ref(true);

  watch(
    () => props.boxupInfo,
    (info) => {
      boxData.value = info.platWhShipmentDetailDtos || [];
      initBoxQuantity();
      changeBoxNum();
      addBoxList();
    }
  );

  const bottomData = ref([
    {
      id: 1,
      text: '重量',
      title: '重量(kg)',
      desc: 'weight',
      setting: 0, // 批量设置
      setList: [] // 箱子数量默认为 1
    },
    {
      id: 2,
      text: '长',
      title: '长(cm)',
      desc: 'length',
      setting: 0,
      setList: []
    },
    {
      id: 3,
      text: '宽',
      title: '宽(cm)',
      setting: 0,
      desc: 'width',
      setList: []
    },
    {
      id: 4,
      text: '高',
      title: '高(cm)',
      setting: 0,
      desc: 'height',
      setList: []
    }
  ]);
  const allBoxList = ref([]);

  // 表尾计算 返回一个 二维数组
  const footerMethod = () => {
    let arr = [
      '总数量',
      '',
      '',
      '',
      computedTotal('actQuantity'),
      computedTotal('count')
    ];
    let boxArr = computedBoxTotal();
    return [arr.concat(boxArr)];
  };

  // 在值发生改变时更新表尾合计
  const updateFooterEvent = () => {
    const $table = boxTable.value;
    $table.updateFooter();
  };

  // 将所有 boxActQuantity 放在一个数组中
  const addBoxList = () => {
    allBoxList.value = [];
    boxData.value.forEach((item) => {
      allBoxList.value.push(item.boxActQuantity);
    });
  };

  // 计算所有箱子的总数量
  const computedBoxTotal = () => {
    let result = [];
    for (let key in allBoxList.value) {
      allBoxList.value[key].forEach((value, index) => {
        if (isBlank(result[index])) {
          result[index] = 0;
        }
        result[index] += Number(value);
      });
    }
    return result;
  };

  const isBlank = (val) => {
    if (val == null || val == '') {
      return true;
    }
  };

  // 计算 待装箱数量 的总数量
  const computedTotal = (num) => {
    return boxData.value.reduce((sum, obj) => (sum += Number(obj[num])), 0);
  };

  // 新增箱子
  const addBox = () => {
    if (boxData.value.length === 0) {
      return ElMessage.warning('当前没有商品！');
    }
    boxData.value.forEach((item) => {
      item.boxActQuantity.push(0);
    });
    bottomData.value.forEach((item) => {
      item.setList.push(1);
    });
  };

  // 删除箱子
  const deleteBox = () => {
    try {
      boxData.value.forEach((item) => {
        if (item.boxActQuantity.length > 1) {
          item.boxActQuantity.pop();
        } else {
          throw '箱子最少为1个，不能继续删除！';
        }
        changeBoxNum();
      });
    } catch (err) {
      ElMessage.warning(err);
    }
    bottomData.value.forEach((item) => {
      if (item.setList.length > 1) {
        item.setList.pop();
      }
    });
  };

  // 批量设置
  const handleSetting = (row) => {
    bottomData.value.forEach((item) => {
      if (item.desc === row.desc) {
        item.setList = item.setList.map((citem) => {
          citem = row.setting;
          return citem;
        });
      }
    });
  };

  // 箱子数量初始值设置
  const initBoxQuantity = () => {
    if (boxData.value.length > 0) {
      bottomData.value.forEach((item) => {
        // if (item.setList.length === 0) {
        //   item.setList = [0];
        // }
        item.setList = props.boxupInfo[item.desc].length
          ? props.boxupInfo[item.desc]
          : [0];
        item.setting = 0;
      });
    } else {
      bottomData.value.forEach((item) => {
        item.setList = [];
        item.setting = 0;
      });
    }
  };

  // 动态设置打包数量
  const changeBoxNum = () => {
    boxData.value.forEach((item) => {
      if (item.boxActQuantity?.length) {
        item.count = item.boxActQuantity.reduce((prep, curr) => {
          return Number(prep) + Number(curr);
        });
      }
    });
    // 手动更新表尾合计数量
    updateFooterEvent();
  };

  // 导出模板
  const handleExportTemp = () => {
    try {
      let ids = props.boxupInfo.platWhShipmentDetailDtos?.map(
        (item) => item.shipmentId
      );
      transBlob({
        url: '/lms/PlatWh/PlatWhShipmentBox/downPackageTemplate.html',
        contentType: 'application/json',
        data: {
          ids
        },
        fileName: '装箱模板' + Date.now() + '.xlsx'
      }).finally(() => {
        ElMessage.success('下载成功');
      });
    } catch (err) {
      console.log(err);
    }
  };

  const importData = ref({}); // 导入的装箱数据
  // 导入装箱
  const handleImport = async () => {
    if (boxData.value.length === 0) {
      return ElMessage.warning('当前没有商品！');
    }
  };

  // 导入装箱成功
  const uploadSuccess = (res) => {
    if (res.code == '0000') {
      ElMessage.success('导入装箱成功！');
      importData.value = res.data;
      // 回显导入的数据
      boxData.value.forEach((item, index) => {
        importData.value.platWhShipmentDetailDtos.forEach((cItem, cIndex) => {
          if (props.boxType === 'merge') {
            // 合单 (会存在两条数据一模一样的情况 需要增加id来匹配)
            if (
              item.sellerSku === cItem.sellerSku &&
              item.storeAcct === cItem.storeAcct &&
              item.platOrderId === cItem.platOrderId &&
              item.id === cItem.id
            ) {
              item.boxActQuantity = cItem.boxActQuantity;
            }
          } else {
            // 非合单
            if (index === cIndex) {
              item.boxActQuantity = cItem.boxActQuantity;
            }
          }
        });
      });
      bottomData.value.forEach((item) => {
        item.setList = importData.value[item.desc];
      });
      addBoxList();
      changeBoxNum();
    } else {
      // ElMessage.error('导入装箱失败！');
      ElMessageBox.alert(res?.msg || '导入装箱失败！', '错误信息', {
        confirmButtonText: '确认',
        type: 'error'
      });
    }
  };

  // 导入装箱失败
  const uploadError = () => {
    ElMessage.error('导入装箱失败！');
  };

  // 定位
  const handlePosition = () => {
    let locationIndex = 0;
    boxData.value.forEach((item, index) => {
      if (item[queryType.value] === queryValue.value) {
        locationIndex = index;
      }
    });
    let $table = boxTable.value.$el;
    if (!$table) return; // 表格不存在
    const scrollParent = $table.querySelector('.vxe-table--body-wrapper');
    const targetTop = $table
      .querySelectorAll('.vxe-table--body tr')
      [locationIndex].getBoundingClientRect().top; // 该行的位置
    const containerTop = $table
      .querySelector('.vxe-table--body')
      .getBoundingClientRect().top; // body的位置
    if (locationIndex) {
      scrollParent.scrollTop = targetTop - containerTop;
    }
  };

  // 保存
  const handleSubmit = debounce(async (type) => {
    // 验证 已打包数量 是否等于 待装箱数量
    // 将不符合的商品条码展示出来
    let notFinishItems = [];
    boxData.value.forEach((item) => {
      if (Number(item.count) !== Number(item.actQuantity)) {
        notFinishItems.push(item);
      }
    });
    if (notFinishItems.length) {
      const notFinishItemsSku = notFinishItems.map((item) => item.barCode);
      ElMessage.warning(
        `还有商品没有装箱，条码为：${notFinishItemsSku.join(', ')} `
      );
      return;
    }

    // 验证 箱子的规格都大于0
    let flag = false;
    let allSetList = [];
    bottomData.value.forEach((item) => {
      allSetList = allSetList.concat(item.setList);
    });
    flag = allSetList.some((cItem) => Number(cItem) <= 0);
    if (flag) return ElMessage.warning('箱子规格设置需要大于0！');

    // 设置箱子数量都为 number 类型 空设置为 0
    boxData.value.forEach((item) => {
      item.boxActQuantity = item.boxActQuantity.map(Number);
    });

    // 提交成功要传递给打印箱唛的参数
    let donePramsList = ref([]);
    donePramsList.value = boxData.value.map((item) => {
      return {
        platCode: item.platCode,
        id: item.shipmentId,
        storeAcctId: item.storeAcctId,
        platOrderId: item.platOrderId
      };
    });

    try {
      loading.value = true;
      let params = {
        shipmentId: props.boxupInfo.shipmentId,
        weight: getSetList('weight'),
        height: getSetList('height'),
        length: getSetList('length'),
        width: getSetList('width'),
        platWhShipmentDetailDtos: boxData.value
      };
      if (type === 'save') {
        try {
          const { code } =
            props.boxType === 'merge'
              ? await saveMergeBox(params)
              : await saveBoxup(params);

          if (code === '0000') {
            emits('done', donePramsList.value);
            emits('doneIsToSend', {
              id: props.boxType === 'merge' ? props.batchBoxUpId : props.boxId,
              checkedBox: checkedBox.value,
              isMergeBox: props.boxType,
              selectList: props.selectList
            });
            if (
              props.boxType !== 'merge' &&
              props.boxupInfo.platCode === 'shopee'
            ) {
              printShopee(boxData.value[0]?.boxActQuantity);
            }
            ElMessage.success('保存成功！');
          }
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          const whiteList = ['temu', 'shein自营']; // 不打印框号标签的平台
          // 框号标签
          if (
            props.boxType !== 'merge' &&
            !whiteList.includes(props.boxupInfo.platCode)
          ) {
            boxData.value.forEach((v) => {
              handleBarCodeNoPack(v);
            });
          }
        }
      }
      if (type === 'editDeliver') {
        const { code } = await handleEditDeliver(params);
        if (code === '0000') {
          ElMessage.success('修改发货单成功！');
        }
      }
      loading.value = false;
      // 如果发货弹窗跳出来 默认先不关闭
      if (!checkedBox.value) {
        handleClose();
      }
    } catch (err) {
      console.log(err);
      loading.value = false;
      // handleClose();
    }
  }, 1000);

  // 获取箱子批量设置的 setList
  const getSetList = (type) => {
    let setArr = [];
    bottomData.value.map((item) => {
      if (item.desc === type) {
        setArr = item.setList;
      }
    });
    return setArr;
  };

  // 取消发货单(temu)
  const handleCancel = async () => {
    const { msg } = await cancelTemuDeliveryOrderApi(props.boxId);
    ElMessage.success(msg);
  };

  // 打印框号标签 参考配货包装的打印框号标签
  const handleBarCodeNoPack = (obj) => {
    const { deliverOrderSn, frameCode, skuNumber } = props.boxupInfo;
    let printObj100 = {};
    // 判断 框号（bottomLine1），是XU开头，barCode传bottomLine1一样的值，并且deliverOrderSn传一个字“单”
    let isIncludeXu = false;
    let newBarCode = '';

    if (obj.platCode === 'shein自营') {
      newBarCode = obj.sellerSku;
    } else {
      newBarCode = obj.barCode;
    }
    if (frameCode && frameCode.includes('XU')) {
      newBarCode = frameCode;
      isIncludeXu = true;
    }

    let sellerSkuCode = '';
    if (obj.platCode === 'AE全托管' || obj.platCode === 'AE半托管') {
      sellerSkuCode = obj.alias;
    } else {
      sellerSkuCode =
        !!deliverOrderSn && obj.platCode === 'temu'
          ? `后台已创建${obj.sellerSkuCode}`
          : obj.sellerSkuCode;
    }

    // 装箱-AE打印参数调整
    const isAE = obj.platCode === 'AE全托管' || obj.platCode === 'AE半托管';

    printObj100 = {
      printerName: isAE ? 100100 : 10040,
      jspaper: isAE
        ? 'platWhSellerSku100100.jasper'
        : 'platWhSellerSku10040.jasper',
      printDetailDtoList: [
        {
          titleMap: {
            barCode: isIncludeXu ? newBarCode : obj.id,
            bottomLine1: frameCode,
            bottomLine2: `货件计划:${obj.platOrderId}`,
            bottomLine3: `实发数量:${obj.actQuantity} 种类:${skuNumber}`,
            prodSSku: obj.prodSSku || '',
            deliverOrderSn: isIncludeXu
              ? `单 ${obj.storeAcct || ''}`
              : `${deliverOrderSn}${obj.storeAcct || ''}`,
            locationCode: `${obj.locationCode}`,
            sellerSkuCode,
            specification: obj.specification || ''
          },
          amount: 1
        }
      ]
    };

    epeanPrint_plugin_fun(99, printObj100);
  };

  const printShopee = (arr) => {
    const { frameCode, platOrderId } = props.boxupInfo;
    arr.forEach((_, index) => {
      const printObj100 = {
        printerName: 10040,
        jspaper: 'platWhSellerSku10040.jasper',
        printDetailDtoList: [
          {
            titleMap: {
              barCode: frameCode,
              bottomLine1: frameCode,
              bottomLine2: `货件计划:${platOrderId}`,
              sellerSkuCode: `箱子:${arr.length}-${index + 1}`
            }
          }
        ]
      };
      epeanPrint_plugin_fun(99, printObj100);
    });
  };

  // 关闭弹窗
  const handleClose = () => {
    emits('close');
  };
</script>

<style lang="scss" scoped>
  .affix_color {
    background: #ffffff;
  }
</style>
<style lang="scss">
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
