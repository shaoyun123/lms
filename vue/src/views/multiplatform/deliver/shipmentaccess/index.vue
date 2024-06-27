<!-- eslint-disable vue/v-slot-style -->
<!-- 货件存取 -->
<template>
  <div class="shipmentaccess_container app-container">
    <el-card class="common_split_bottom search_card">
      <el-form v-model="formData" :inline="true" class="search_form">
        <el-form-item>
          <el-select v-model="formData.timeType" class="form_left">
            <el-option value="1" label="创建时间" />
            <el-option value="2" label="派单时间" />
            <el-option value="3" label="发货时间" />
            <el-option value="4" label="预约时间" />
          </el-select>
          <el-date-picker
            v-model="formData.time"
            class="form_right"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            :shortcuts="shortcuts"
            :default-time="defaultTime"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="货件编号">
          <el-input
            v-model="formData.platOrderId"
            placeholder="支持多个逗号分隔"
            clearable
          />
        </el-form-item>
        <el-form-item label="框号">
          <el-input
            v-model="formData.frameCode"
            placeholder="支持多个逗号分隔"
            clearable
          />
        </el-form-item>
        <el-form-item label="存框状态">
          <el-select v-model="formData.packStatus">
            <el-option
              v-for="item in packStatusEnum"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="框子状态">
          <el-select v-model="formData.frameStatus">
            <template v-for="item in frameStatusEnum" :key="item.value">
              <el-option
                v-if="item.value !== 3 && item.value !== 0"
                :value="item.value"
                :label="item.label"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="商品sku">
          <el-input v-model="formData.prodSSku" clearable />
        </el-form-item>
        <el-form-item label="打印条码">
          <el-input v-model="formData.barCode" clearable />
        </el-form-item>
        <el-form-item label="仓库名称">
          <el-select v-model="formData.warehouseName" filterable clearable>
            <el-option
              v-for="item in platStoreList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台">
          <el-select
            v-model="formData.platCode"
            placeholder="请选择"
            clearable
            filterable
            @change="changePlat"
          >
            <el-option
              v-for="item in platList"
              :key="item"
              :lbael="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺">
          <el-select-v2
            v-model="formData.storeAcctList"
            placeholder="请选择"
            :options="storeList"
            style="width: 350px"
            multiple
            collapse-tags
            clearable
            filterable
            @change="changeStoreVal"
            @visible-change="changeStore"
          >
          </el-select-v2>
        </el-form-item>
        <el-form-item label="合单箱号">
          <el-select v-model="formData.comBoxNo" clearable>
            <el-option
              v-for="item in comboxList"
              :key="item.id"
              :value="item.comBoxNo"
              :label="item.comBoxNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件地址">
          <el-select
            v-model="formData.receiveAddressId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in addressListFilter"
              :key="item.id"
              :label="item.alias"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排序">
          <el-select v-model="formData.orderType">
            <el-option
              v-for="item in orderTypeEnum"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售备注">
          <el-input v-model="formData.sellerRemark" clearable />
        </el-form-item>

        <el-form-item label="发货单号">
          <el-input v-model="formData.deliverOrderSn" clearable />
        </el-form-item>
        <el-form-item label="箱唛状态">
          <el-select v-model="ifHaveCaseLabelVal" clearable filterable>
            <el-option label="全部" value="null" selected></el-option>
            <el-option label="已上传" value="true"></el-option>
            <el-option label="未上传" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input
            v-model="formData.logisticsNoListStr"
            placeholder="支持多个逗号分隔"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="common_split_bottom list_card">
      <template #header>
        <div class="header_container">
          <div>
            <span>数量:({{ paginationData.total }})</span>
            <el-tag>已用:{{ usedNum }}</el-tag>
            <el-tag type="success">总:{{ totalNum }}</el-tag>
          </div>
          <div>
            <el-button type="primary" @click="printPackMsg()"
              >打印取货信息</el-button
            >
            <el-button
              type="primary"
              style="margin-right: 10px"
              @click="printPackData()"
              >打印未包装</el-button
            >
            <el-dropdown :hide-on-click="false">
              <el-button type="primary">
                隐藏列<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in partColums"
                    :key="item.title"
                  >
                    <el-checkbox
                      v-model="item.visible"
                      :label="item.title"
                      @change="handleColumns(item.visible, item.field)"
                    />
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>
      <div>
        <vxe-table
          ref="tableRef"
          :data="tableData"
          :height="height"
          :loading="loading"
          :print-config="{}"
          :scroll-y="{ gt: 12, oSize: 50 }"
          show-overflow
          border
          :row-config="{ isCurrent: true, isHover: true }"
          :column-config="{ resizable: true }"
        >
          <vxe-column type="checkbox" width="50"></vxe-column>
          <vxe-column field="frameCode" title="仓库框号">
            <template #default="{ row }">
              {{ row.frameCode }}<br />
              仓库：{{ row.warehouseName }}
            </template>
          </vxe-column>
          <vxe-column field="platOrderId" title="货件编号(店铺站点)">
            <template #default="{ row }">
              <template v-if="row.platOrderId">
                <div>{{ row.platOrderId }}</div>
                <div>平台：{{ row.platCode }}</div>
                <div>店铺：{{ row.storeAcct }}</div>
                <div>站点：{{ row.salesSite }}</div>
              </template>
            </template>
          </vxe-column>
          <vxe-column title="商品信息" width="680">
            <template #header>
              <div class="common_ta_center">商品信息</div>
              <div
                style="display: flex; justify-content: space-around"
                class="table_head"
              >
                <div>商品SKU</div>
                <div>店铺SKU</div>
                <div>打印条码</div>
                <div>数量</div>
                <div>是否配货</div>
                <div>包装状态</div>
                <div>是否存框</div>
                <div>仓库缺货</div>
                <div>sku种类</div>
                <div>库位</div>
              </div>
            </template>
            <template #default="{ row }">
              <vxe-table
                v-if="
                  row.platWhShipmentDetail &&
                  row.platWhShipmentDetail.length != 0
                "
                :data="row.platWhShipmentDetail.slice(0, row.displayCount)"
                :show-header="false"
                :row-config="{ isCurrent: true, isHover: true }"
              >
                <vxe-column field="prodSSku" />
                <vxe-column field="sellerSku" />
                <vxe-column field="barCode" />
                <vxe-column field="actQuantity" />
                <vxe-column field="matchStatus">
                  <template #default="relSkuRow">
                    <el-tag
                      v-if="
                        relSkuRow.row.packStatus === 0 ||
                        relSkuRow.row.packStatus === 4
                      "
                      type="warning"
                    >
                      未配
                    </el-tag>
                    <el-tag v-else type="success">已配</el-tag>
                  </template>
                </vxe-column>
                <vxe-column field="packStatus">
                  <template #default="{ row: sonRow }">
                    <el-tag
                      v-if="
                        sonRow.packStatus === 0 ||
                        sonRow.packStatus === 1 ||
                        sonRow.packStatus === 4
                      "
                      type="warning"
                    >
                      未包
                    </el-tag>
                    <el-tag v-else type="success">已包</el-tag>
                  </template>
                </vxe-column>
                <vxe-column field="packStatus">
                  <template #default="relSkuRow">
                    <el-tag v-if="relSkuRow.row.packStatus === 3" type="success"
                      >已存</el-tag
                    >
                    <el-tag v-else type="warning">未存</el-tag>
                  </template></vxe-column
                >
                <vxe-column field="packStatus">
                  <template #default="relSkuRow">
                    <span
                      v-if="relSkuRow.row.packStatus == 4"
                      style="color: red"
                      >仓缺</span
                    >
                  </template>
                </vxe-column>
                <vxe-column field="sukNum"></vxe-column>
                <vxe-column field="locationCode"></vxe-column>
              </vxe-table>
              <template
                v-if="row.platWhShipmentDetail.length > showDefaultLength"
              >
                <div
                  class="common_ta_center m05"
                  @click="
                    row.displayCount > showDefaultLength
                      ? hideList(row)
                      : viewAll(row)
                  "
                >
                  <a style="color: #409eff">{{
                    row.displayCount > showDefaultLength ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template>
            </template>
          </vxe-column>
          <vxe-column field="skuNumber" width="70" title="货品种类" />
          <vxe-column field="comBoxNo" title="合单箱号" />
          <vxe-column field="deliverOrderSn" title="发货单号" />
          <vxe-column field="alias" title="地址名称" />
          <vxe-column
            field="frameStatus"
            title="框子状态"
            width="80"
            :formatter="formatterframeStatus"
          />
          <vxe-column #default="{ row }" field="time" title="时间">
            <div v-if="row.createTime">
              创建: {{ transferDate(row.createTime) }}
            </div>
            <div v-if="row.takeAbleTime">
              修改: {{ transferDate(row.takeAbleTime) }}
            </div>
          </vxe-column>
          <vxe-column title="仓库备注" field="storeRemark">
            <template #header>
              <span>仓库备注</span>
              <el-icon color="#409EFC" :size="20">
                <Edit />
              </el-icon>
            </template>
            <template #default="{ row }">
              <div class="cell_min_height" @click="handleEditstoreRemark(row)">
                <el-tooltip placement="left">
                  <template #content
                    ><div class="tooltip">{{ row.storeRemark }}</div></template
                  >
                  <span class="reamrk_clamp" :style="storeRemarkClamp(row)">{{
                    row.storeRemark
                  }}</span>
                </el-tooltip>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="salerRemark" title="销售备注"> </vxe-column>
        </vxe-table>
      </div>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[50, 100, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!--  仓库备注弹窗  -->
    <el-dialog
      v-model="dialogVisible"
      title="修改仓库备注"
      :width="400"
      :close-on-click-modal="false"
    >
      <div v-loading="loading" class="dialog_container">
        <el-input
          v-model="storeRemarkInfo.storeRemark"
          :rows="5"
          type="textarea"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleUpdatestoreRemark(row)"
            >确定</el-button
          >
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="multiplatformdelivershipmentaccess">
  import { onMounted, reactive, ref, computed } from 'vue';
  import {
    queryPage,
    updatestoreRemark,
    getFrameUseAndTotal,
    getRepoName
  } from '@/api/multiplatform/shipmentaccess';
  import { transferDate } from '@/utils/common';
  import { Edit } from '@element-plus/icons-vue';
  import { ElMessage, ElLoading } from 'element-plus';
  import { orderTypeEnum, packStatusEnum, frameStatusEnum } from './enum';
  import {
    getStoreData,
    getAddress,
    getCombox,
    getPrintInfo
  } from '@/api/multiplatform/shipmentplan';
  import { getAllPlatList, shortcuts } from '@/api/common/index.js';
  import axios from 'axios';
  import qs from 'qs';

  const formData = reactive({
    packStatus: '',
    frameStatus: '',
    orderType: '1',
    receiveAddressId: '', // 收货地址id
    storeAcctList: [],
    storeAcctId: '', // 店铺id
    platCode: '', // 平台名称
    comBoxNo: '', // 合单箱号
    sellerRemark: '', // 销售备注
    deliverOrderSn: '',
    warehouseName: '',
    timeType: '1',
    logisticsNoListStr: '',
    logisticsNoList: '' // 快递单号
  });
  const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59)
  ];
  const tableData = ref([]);
  const tableRef = ref(null);
  const loading = ref(false);
  const ifHaveCaseLabelVal = ref('null'); //箱唛状态
  const paginationData = reactive({
    page: 1,
    limit: 50,
    total: 0
  });
  const selectRow = ref(null);
  const showDefaultLength = 2;

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 260;
  });

  //
  const usedNum = ref();
  const totalNum = ref();
  const partColums = ref([]);
  onMounted(async () => {
    getPlatList();
    getStoreList();
    getAdressList();
    getComboxList();
    getInfoTotal();
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

  const getInfoTotal = async () => {
    try {
      const { data } = await getFrameUseAndTotal();
      usedNum.value = data[0];
      totalNum.value = data[1];
      partColums.value = tableRef.value
        .getColumns()
        .filter((item) => ['销售备注', '仓库备注', '时间'].includes(item.title))
        .map((item) => ({ ...item, visible: false }));
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  // 获取所有平台数据
  const platList = ref([]);
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

  // 获取店铺信息
  const storeList = ref([]);
  const getStoreList = async () => {
    try {
      let params = {
        platCode: formData.platCode
      };
      const { data } = await getStoreData(params);
      storeList.value = data.map((item) => ({
        value: item.id,
        label: item.storeAcct
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // 平台信息改变 重新获取店铺数据
  const changePlat = () => {
    formData.storeAcctId = '';
    // 收件地址
    formData.receiveAddressId = '';
    if (formData.platCode == '') {
      addressListFilter.value = addressList.value;
    } else {
      addressListFilter.value = addressList.value.filter(
        (item) => item.platCode == formData.platCode
      );
    }
    getStoreList();
  };

  // 店铺改变 合单装箱号变化
  const changeStoreVal = () => {
    formData.comBoxNo = '';
    getComboxList();
  };

  const changeStore = (val) => {
    if (val && !formData.platCode) {
      storeList.value = [];
      return ElMessage.warning('请先选择平台！');
    }
  };
  // 打印取货信息
  const printPackMsg = async () => {
    let select = tableRef.value.getCheckboxRecords();
    let selectData = JSON.parse(JSON.stringify(select));
    if (selectData && selectData.length > 0) {
      let selectIdArr = selectData.map((item) => item.id);
      let params = {
        tplName: '打印取货信息',
        printTplType: 'PLAT_PRINT_INNER_INFO_TPL',
        bizId: selectIdArr.join(',')
      };
      const { data } = await getPrintInfo(params);
      let print_params = {
        printType: 19,
        labelUrl: data.labelUrl,
        printName: data.printName,
        width: data.width,
        height: data.height
      };
      printCase(print_params);
    } else {
      ElMessage.warning('请选择要处理的数据');
    }
  };
  // 打印
  const printCase = (obj) => {
    const loadingInstance = ElLoading.service({
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.4)'
    });
    axios({
      method: 'post',
      url: 'http://localhost:9898/',
      data: qs.stringify(obj)
    })
      .then(() => {})
      .catch((err) => {
        var responseText = err.message;
        if (responseText == null || responseText.indexOf('打印成功') == -1) {
          ElMessage.error(
            '打印错误，请检查打印插件是否正常运行或者重新启动插件'
          );
        }
      })
      .finally(() => {
        loadingInstance.close();
      });
  };

  // 打印未包装
  const content = ref('');
  const printPackData = () => {
    let select = tableRef.value.getCheckboxRecords();
    let selectData = JSON.parse(JSON.stringify(select));
    if (selectData && selectData.length > 0) {
      // 筛选出未包装的数据
      // 查看所有商品的包装状态
      let notPackList = [];
      selectData.forEach((item) => {
        let allPackList = [];
        item.platWhShipmentDetail?.forEach((cItem) => {
          allPackList.push(cItem.packStatus);
          if (cItem.packStatus === 0 || cItem.packStatus === 1) {
            notPackList.push(cItem);
          }
        });
        if (
          allPackList.includes(0) === false &&
          allPackList.includes(1) === false
        ) {
          item.isPack = true;
        } else {
          item.isPack = false;
        }
      });

      if (notPackList?.length === 0) {
        return ElMessage.warning('没有未包装的商品！');
      }
      selectData = selectData.filter((item) => {
        item.platWhShipmentDetail = item.platWhShipmentDetail.filter(
          (cItem) => {
            return cItem.packStatus !== 2;
          }
        );
        return item.isPack === false;
      });

      let strContentStart = '';
      let strContentEnd = '';
      let innerTable = '';
      let allTr = '';
      let startStr = `<table border="1" cellspacing="0" width="100%">
            <tr>
               <th width="8%">仓库框号</th>
               <th width="17%">货件编号<br>(店铺站点)</th>
               <th style="display: flex">
                <p style="width: 20%">商品SKU</p>
                <p style="width: 27%">店铺SKU</p>
                <p style="width: 21%">打印条码</p>
                <p style="width: 12%">数量</p>
                <p style="width: 20%">库位</p>
               </th>
               <th width="10%">发货单号</th>
               <th width="10%">销售备注</th>
            </tr>
          `;
      let endStr = '</table>';
      for (let i = 0; i < selectData.length; i++) {
        strContentStart = `<tr>
            <td width="8%" style="word-wrap: break-word">
              ${selectData[i].frameCode}<br/>
              ${selectData[i].warehouseName}
            </td>
            <td width="17%" style="word-wrap: break-word;word-break:break-all">
              ${selectData[i].platOrderId || ''}<br>
              平台：${selectData[i].platCode || ''}<br>
              店铺：${selectData[i].storeAcct || ''}<br>
              站点：${selectData[i].salesSite || ''}
            </td>
            <td style="padding: 10px 3px">
            <table border="1" cellspacing="0" width="100%" style="table-layout: fixed">`;
        strContentEnd = `</table>
            </td>
            <td style="word-wrap: break-word;word-break:break-all">${
              selectData[i].deliverOrderSn || ''
            }</td>
            <td style="word-wrap: break-word">${
              selectData[i].salerRemark || ''
            }</td>
          </tr>`;
        innerTable = '';
        for (let j = 0; j < selectData[i].platWhShipmentDetail.length; j++) {
          innerTable += `<tr>
                  <td width="20%" style="word-wrap: break-word">${
                    selectData[i].platWhShipmentDetail[j].prodSSku || ''
                  }</td>
                  <td width="27%" style="word-wrap: break-word">${
                    selectData[i].platWhShipmentDetail[j].sellerSku || ''
                  }</td>
                  <td width="21%" style="word-wrap: break-word">${
                    selectData[i].platWhShipmentDetail[j].barCode || ''
                  }</td>
                  <td width="12%" style="word-wrap: break-word">${
                    selectData[i].platWhShipmentDetail[j].actQuantity
                  }</td>
                  <td width="20%" style="word-wrap: break-word">${
                    selectData[i].platWhShipmentDetail[j].locationCode
                  }</td>
                </tr>`;
        }
        allTr = allTr + strContentStart + innerTable + strContentEnd;
      }
      content.value = startStr + allTr + endStr;
      tableRef.value.print({
        sheetName: '',
        style: '',
        // 自定义打印HTML
        content: content.value
      });
    } else {
      ElMessage.warning('请选择要处理的数据');
    }
  };

  const addressListFilter = ref([]);
  const addressList = ref([]);
  // 获取收件地址信息
  const getAdressList = async () => {
    try {
      const { data } = await getAddress({
        platCode: formData.platCode,
        alias: formData.alias
      });
      addressList.value = data.list;
      addressListFilter.value = data.list;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取合单箱号
  const comboxList = ref([]);
  const getComboxList = async () => {
    try {
      const { data } = await getCombox({
        storeAcctIdList: formData.storeAcctList || []
      });
      comboxList.value = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 查询
  const onSubmit = async () => {
    loading.value = true;
    try {
      // 箱唛状态
      if (ifHaveCaseLabelVal.value == 'null') {
        delete formData.ifHaveCaseLabel;
      } else {
        formData.ifHaveCaseLabel = ifHaveCaseLabelVal.value;
      }
      formData.timeStart = formData.time ? formData.time[0] : '';
      formData.timeEnd = formData.time ? formData.time[1] : '';
      formData.storeAcctId = formData.storeAcctList?.join('') || '';
      const { page, limit } = paginationData;
      formData.logisticsNoList = formData.logisticsNoListStr
        ? formData.logisticsNoListStr.split(',')
        : [];
      //框号
      formData.frameCodeList = formData.frameCode
        ? formData.frameCode.split(',')
        : null;
      // 货件编号
      formData.platOrderIdList = formData.platOrderId
        ? formData.platOrderId.split(',')
        : null;
      const { data } = await queryPage({ ...formData, limit, page });
      loading.value = false;
      tableData.value = data.list.map((item) => ({
        ...item,
        platWhShipmentDetail: item.platWhShipmentDetail || [],
        displayCount: showDefaultLength
      }));

      paginationData.total = data.total;
      getInfoTotal();
    } catch (err) {
      loading.value = false;
      console.log('err :>> ', err);
    }
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    onSubmit();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    onSubmit();
  };

  const formatterframeStatus = ({ row }) => {
    if (row.frameStatus !== undefined) {
      return frameStatusEnum.filter((item) => item.value === row.frameStatus)[0]
        .label;
    }
  };

  const storeRemarkClamp = (row) => {
    let clamp = row.displayCount * 2;
    if (row.platWhShipmentDetail.length < 2) {
      clamp = 2;
    } else if (row.platWhShipmentDetail.length < showDefaultLength) {
      clamp = row.platWhShipmentDetail.length * 2;
    }
    return {
      webkitLineClamp: clamp
    };
  };

  const hideList = (row) => {
    row.displayCount = showDefaultLength;
  };
  const viewAll = (row) => {
    row.displayCount = row.platWhShipmentDetail.length;
  };

  const handleColumns = (val, field) => {
    loading.value = true;
    val && tableRef.value.hideColumn(tableRef.value.getColumnByField(field));
    !val && tableRef.value.showColumn(tableRef.value.getColumnByField(field));
    loading.value = false;
  };

  // 备注
  const dialogVisible = ref(false);
  const storeRemarkInfo = reactive({
    id: '',
    storeRemark: ''
  });
  const handleEditstoreRemark = (row) => {
    dialogVisible.value = true;
    storeRemarkInfo.storeRemark = row.storeRemark;
    storeRemarkInfo.id = row.id;
    selectRow.value = row;
  };

  const handleUpdatestoreRemark = async () => {
    if (storeRemarkInfo.id) {
      try {
        const { msg } = await updatestoreRemark(storeRemarkInfo);
        dialogVisible.value = false;
        Object.assign(selectRow.value, storeRemarkInfo);
        ElMessage.success(msg || '操作成功');
      } catch (err) {
        false;
        console.log('err :>> ', err);
      }
    } else {
      ElMessage.warning('请选择分配有货件的框子');
    }
  };
</script>

<style lang="scss" scoped>
  .shipmentaccess_container {
    .header_container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .reamrk_clamp {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .m05 {
      margin: 5px;
    }
    .cell_min_height {
      min-height: 35px;
    }
  }
  .tooltip {
    width: 300px;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .table_head div {
    width: 65px;
  }
</style>
