<template>
  <el-dialog
    width="70%"
    title="修改/计算价格"
    :model-value="showDialog"
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="formRef"
      :model="form"
      :inline="true"
      :label-width="80"
      class="search_form"
    >
      <el-form-item prop="grossProfitRate" label="毛利率">
        <!-- [0,1] -->
        <el-input
          v-model="form.grossProfitRate"
          class="form_right"
          placeholder="例如：0.3"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="calcuPrice">计算</el-button>
        <el-button @click="batchModifyPrice">批量调价</el-button>
      </el-form-item>
    </el-form>
    <vxe-table
      ref="tableDataRef"
      v-loading="tableDataLoadingDialog"
      :data="tableData"
      height="500"
      :align="'center'"
      border
    >
      <vxe-column type="checkbox" width="40" />
      <vxe-column field="storeAcct" title="店铺" />
      <vxe-column field="itemId" title="item_id" />
      <vxe-column field="salesSite" title="站点" />
      <vxe-column title="现价（USD）">
        <template #default="{ row }">
          {{
            row.pprodSyncSMercadoDtos && row.pprodSyncSMercadoDtos[0]
              ? row.pprodSyncSMercadoDtos[0].priceUSD
              : ''
          }}
        </template>
      </vxe-column>
      <vxe-column field="" title="新价格">
        <template #default="{ row }">
          <el-input v-model="row.newPrice">{{ row.newPrice }}</el-input>
        </template>
      </vxe-column>
      <vxe-column field="message" title="操作结果" />
    </vxe-table>
    <div class="tools_btn">
      <el-button type="primary" @click="exportStockHandle">导出</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
  import { ref, toRefs, reactive, defineProps, defineEmits } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  import {
    // exportMercadoPriceInfo,
    getPriceByItemIds,
    mercadoUpdatePrices
  } from '@/api/publishs/mercadoonline';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: null
    }
  });
  const { tableData } = toRefs(props);

  const form = reactive({
    grossProfitRate: ''
  });
  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    tableData.value.forEach((item) => {
      item.newPrice = '';
      item.message = '';
    });
    emit('closeDialog', { isShow: false });
  };

  //   const tableDataDialog = ref(null);
  let tableDataRef = ref();
  const tableDataLoadingDialog = ref(false);
  const batchModifyPrice = async () => {
    let checkedData = tableDataRef.value.getCheckboxRecords();
    let newArr = getData();
    if (newArr == false) {
      return;
    }
    const { code } = await mercadoUpdatePrices(newArr);
    if (code == '0000') {
      ElMessage.success('提交调价队列成功');
      checkedData.forEach((item) => {
        item['message'] = '调价中';
      });
    }
  };
  // 计算价格
  const calcuPrice = async () => {
    let checkedData = tableDataRef.value.getCheckboxRecords();
    let newArr = getData();
    if (newArr == false) {
      return;
    }
    if (form.grossProfitRate > 1 || form.grossProfitRate < 0) {
      return ElMessage.warning('毛利率需大于等于0，小于等于1');
    }
    ElMessage.success('提交成功，请稍等...');
    newArr.forEach(async (item, index) => {
      const { data, code } = await getPriceByItemIds([item]);
      if (code == '0000') {
        // ElMessage.success('计算成功');
        let getNewPrice = {};
        getNewPrice[data[0].itemId] = [data[0].newPrice, data[0]['message']];
        if (checkedData[index]['itemId'] == data[0].itemId) {
          checkedData[index]['newPrice'] =
            getNewPrice[checkedData[index].itemId][0];
          checkedData[index]['message'] =
            getNewPrice[checkedData[index].itemId][1];
        }
      }
    });

    // const { data, code } = await getPriceByItemIds(newArr);
    // if (code == '0000') {
    //   ElMessage.success('计算成功');
    //   let getNewPrice = {};
    //   data.forEach(
    //     (item) => (getNewPrice[item.itemId] = [item.newPrice, item.message])
    //   );
    //   checkedData.forEach((item) => {
    //     item['newPrice'] = getNewPrice[item.itemId][0];
    //     item['message'] = getNewPrice[item.itemId][1];
    //   });
    // }
  };
  //导出
  const exportStockHandle = async () => {
    let newArr = getData();
    if (newArr == false) {
      return;
    }
    axios({
      method: 'POST',
      url: '/lms/mercadoProducts/exportMercadoPriceInfo.html  ',
      data: newArr,
      responseType: 'blob',
      dataType: 'json'
    })
      .then((res) => {
        if (res.statusText == 'OK') {
          const xlsx = 'application/vnd.ms-excel';
          const blob = new Blob([res.data], { type: xlsx }); //转换数据类型
          const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
          a.download = '美客多批量改价.xlsx';
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getData = () => {
    let checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请至少选择一条数据');
      return false;
    }
    let newArr = [];
    checkedData.forEach((item) => {
      newArr.push({
        storeAcct: item.storeAcct,
        storeAcctId: item.storeAcctId,
        salesSite: item.salesSite,
        prodSs: item.pprodSyncSMercadoDtos,
        priceUSD:
          item.pprodSyncSMercadoDtos && item.pprodSyncSMercadoDtos[0]
            ? item.pprodSyncSMercadoDtos[0].priceUSD
            : '',
        globalItemId: item.globalItemId,
        itemId: item.itemId,
        prodPId: item.prodPId,
        newPrice: item.newPrice,
        grossProfitRate: form.grossProfitRate,
        batchNo: new Date().getTime()
      });
    });
    return newArr;
  };
</script>
<style>
  .tools_btn {
    position: absolute;
    top: 65px;
    right: 25px;
  }
</style>
