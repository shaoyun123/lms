<template>
  <el-card :body-style="{ padding: '5px 10px' }">
    <template #header>
      <div class="card-header">
        <span>{{ item.storeAcct }} {{ item.productId }}</span>
      </div>
    </template>
    <div class="text item">
      <el-form size="default" status-icon :model="mulSetting" :inline="true">
        <div class="batch_setting">
          <div>
            <el-form-item label="毛利率" style="margin-left: 25px">
              <ZInputNumber
                v-model="fixPrice.grossRate"
                :precision="2"
                clearable
                style="width: 80px"
                :min="0"
                size="small"
              />
              <span>%</span>
            </el-form-item>
            <el-form-item label="优惠幅度" style="margin-left: 25px">
              <ZInputNumber
                v-model="fixPrice.discountRate"
                :precision="2"
                clearable
                style="width: 80px"
                :min="0"
                size="small"
              />
              <span>%</span>
            </el-form-item>
            <el-form-item>
              <el-button
                style="margin-left: 10px"
                type="primary"
                size="small"
                @click="handleReCountPrice"
                >定价</el-button
              >
            </el-form-item>
          </div>
          <div>
            <el-form-item label="商品SKU">
              <el-input
                v-model="addSku"
                style="width: 260px"
                size="small"
                placeholder="支持父、子SKU同时添加,多个用逗号分隔"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                style="margin-left: 10px"
                type="primary"
                size="small"
                @click="handleAddInfo"
                >新增变种</el-button
              >
            </el-form-item>
          </div>
        </div>
        <b>批量设置</b>
        <el-form-item label="零售价(EUR)" style="margin-left: 25px">
          <ZInputNumber
            v-model="mulSetting.skuPrice"
            :precision="2"
            clearable
            style="width: 80px"
            :min="0"
            size="small"
          />
        </el-form-item>
        <el-form-item label="促销价(EUR)">
          <ZInputNumber
            v-model="mulSetting.skuDiscountPrice"
            :precision="2"
            clearable
            style="width: 80px"
            :min="0"
            size="small"
          />
        </el-form-item>
        <el-form-item label="重量(g)">
          <ZInputNumber
            v-model="mulSetting.packageWeight"
            :precision="4"
            clearable
            style="width: 80px"
            :min="0"
            size="small"
          />
        </el-form-item>
        <el-form-item label="长(cm)" label-width="60">
          <ZInputNumber
            v-model="mulSetting.packageLength"
            style="width: 80px"
            :precision="0"
            :step="1"
            :min="1"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item label="宽(cm)" label-width="60">
          <ZInputNumber
            v-model="mulSetting.packageWidth"
            style="width: 80px"
            :precision="0"
            :step="1"
            :min="1"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item label="高(cm)" label-width="60">
          <ZInputNumber
            v-model="mulSetting.packageHeight"
            style="width: 80px"
            :precision="0"
            :step="1"
            :min="1"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item label="库存" label-width="60">
          <ZInputNumber
            v-model="mulSetting.skuStock"
            placeholder="库存"
            :min="0"
            size="small"
            style="width: 80px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            style="margin-left: 10px"
            type="primary"
            size="small"
            @click="handleSet()"
            >填写</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <vxe-table
      ref="miraviaTableRef"
      max-height="400"
      show-overflow
      :data="item.prodSyncSMiraviaDtoList"
      border
    >
      <!-- <vxe-column type="checkbox" width="40" /> -->
      <vxe-column field="storeSSku" width="150">
        <template #header> <span style="color: red">*</span>卖家SKU </template>
        <template #default="{ row }">
          <el-input
            v-model="row.storeSSku"
            maxlength="20"
            placeholder="最多20字"
            type="textarea"
            show-word-limit
            size="small"
          ></el-input>
        </template>
      </vxe-column>
      <vxe-column
        v-for="(cItem, cIndex) in item.prodSyncSMiraviaDtoList[0].skuProperty"
        :key="cIndex"
        :field="cItem.skuPropertyId.toString()"
        :width="cItem.customizedPic ? 180 : 100"
      >
        <template #header>
          <span style="color: red">*</span>{{ cItem.skuPropertyName }}
        </template>
        <template #default="{ row, rowIndex }">
          <div style="display: flex">
            <ImagePop v-if="cItem.customizedPic" :src="row.skuImageList" />
            <div v-if="cItem.customizedPic" class="btn_position">
              <el-upload
                :action="'/api/lms/prodTpl/uploadPic.html'"
                :on-success="
                  (res) =>
                    importSkuImgSuccess(
                      res,
                      cItem.skuPropertyName,
                      cIndex,
                      rowIndex
                    )
                "
                :on-error="importError"
                :show-file-list="false"
                multiple
              >
                <el-button type="primary" link style="font-size: 12px"
                  >本地图片</el-button
                >
              </el-upload>
              <el-button
                type="primary"
                link
                style="font-size: 12px"
                @click="uploadNetworkImg(rowIndex)"
                >网络图片</el-button
              >
              <el-button
                type="primary"
                link
                style="font-size: 12px"
                @click="uploadTempImg(rowIndex)"
                >模板图片</el-button
              >
              <el-button
                type="danger"
                link
                style="font-size: 12px"
                @click="removeSkuImg(rowIndex)"
                >删除</el-button
              >
            </div>
          </div>
          <el-input
            v-if="row.skuProperty[cIndex]"
            v-model="row.skuProperty[cIndex].skuPropertyValue"
            clearable
            size="small"
            required
            @input="
              (val) =>
                changeCustom(val, cItem.skuPropertyName, cIndex, rowIndex)
            "
          ></el-input>
        </template>
      </vxe-column>
      <vxe-column field="skuPrice">
        <template #header>
          <span style="color: red">*</span>零售价(EUR)
        </template>
        <template #default="{ row }">
          <ZInputNumber
            v-model="row.skuPrice"
            :precision="2"
            clearable
            size="small"
            :min="0"
            placeholder="最多两位小数"
          />
        </template>
      </vxe-column>
      <vxe-column>
        <template #header>
          <span style="color: red">*</span>促销价(EUR)
        </template>
        <template #default="{ row }">
          <ZInputNumber
            v-model="row.skuDiscountPrice"
            :precision="2"
            clearable
            :min="0"
            size="small"
            placeholder="最多两位小数"
          />
        </template>
      </vxe-column>
      <vxe-column>
        <template #header> <span style="color: red">*</span>重量(g) </template>
        <template #default="{ row }">
          <ZInputNumber
            v-model="row.packageWeight"
            :precision="4"
            clearable
            style="width: 80px"
            :min="0"
            size="small"
          />
        </template>
      </vxe-column>
      <vxe-column width="190">
        <template #header> <span style="color: red">*</span>尺寸(cm) </template>
        <template #default="{ row }">
          <ZInputNumber
            v-model="row.packageLength"
            style="width: 50px"
            :precision="0"
            :step="1"
            :min="1"
            clearable
          />*<ZInputNumber
            v-model="row.packageWidth"
            style="width: 50px"
            :precision="0"
            :step="1"
            :min="1"
            clearable
          />*<ZInputNumber
            v-model="row.packageHeight"
            style="width: 50px"
            :precision="0"
            :step="1"
            :min="1"
            clearable
          />
        </template>
      </vxe-column>
      <vxe-column field="skuStock" width="80">
        <template #header> <span style="color: red">*</span>库存</template>
        <template #default="{ row }">
          <ZInputNumber v-model="row.skuStock" :min="0" clearable />
        </template>
      </vxe-column>
      <vxe-column title="ean code" field="eanCode" width="100">
        <template #default="{ row }">
          <el-input v-model="row.eanCode" size="small"></el-input>
        </template>
      </vxe-column>
      <vxe-column title="销售状态" filed="prodStatus" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.prodStatus"
            inline-prompt
            active-text="开启"
            inactive-text="关闭"
            active-value="active"
            inactive-value="inactive"
          />
        </template>
      </vxe-column>
      <vxe-column title="移除" width="70">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleRemove(row)"
            >移除</el-button
          >
        </template>
      </vxe-column>
    </vxe-table>
  </el-card>

  <el-dialog
    :model-value="showNetworkImg"
    title="网络图片"
    width="30%"
    :close-on-click-modal="false"
    @close="showNetworkImg = false"
  >
    <el-input
      v-model="networkImgUrls"
      placeholder="请填写图片URL，多个地址用回车换行"
      type="textarea"
      :autosize="{ minRows: 6 }"
    ></el-input>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleUpload">确定</el-button>
        <el-button @click="showNetworkImg = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <ChooseTplImage
    v-model="tplImgVisible"
    :limit="remainderLimit"
    :params="tplImgParams"
    @get-tpl-img="getTplImg"
  />
</template>

<script setup>
  import { onMounted, ref, reactive, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import { ElMessage } from 'element-plus';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  import {
    reCountPriceApi,
    addProdSSkuInfosApi
  } from '@/api/publishs/miraviaonline';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  });

  const miraviaTableRef = ref(null);

  const mulSetting = reactive({
    packageWeight: '', // 重量
    skuPrice: '', // 建议零售价
    skuStock: '', // 库存
    skuDiscountPrice: '', // 促销价
    packageLength: '', // 长
    packageWidth: '', // 宽
    packageHeight: '' // 高
  });

  const detailListItem = ref({});

  const fixPrice = reactive({
    discountRate: '', // 优惠幅度
    grossRate: '' // 毛利率
  });
  const recordSkuPropertyOrder = {};

  watch(
    () => props.item,
    async (val) => {
      if (val) {
        detailListItem.value = props.item;
        const { grossProfitRate, discountRate } = props.item;
        fixPrice.grossRate = [null, undefined, ''].includes(grossProfitRate)
          ? ''
          : grossProfitRate * 100;
        fixPrice.discountRate = [null, undefined, ''].includes(discountRate)
          ? ''
          : discountRate * 100;
        // 记录销售属性排序
        props.item.prodSyncSMiraviaDtoList[0].skuProperty.forEach(
          (v, index) => {
            recordSkuPropertyOrder[v.skuPropertyId] = index;
          }
        );
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    detailListItem.value = props.item;
  });

  const importError = () => {};

  // 本地图片
  const importSkuImgSuccess = (res, skuPropName, idx, rowIndex) => {
    if (res.code === '0000') {
      detailListItem.value.prodSyncSMiraviaDtoList[rowIndex].skuImageList =
        res.msg;
    } else {
      ElMessage.error(res.msg);
    }
  };

  const showNetworkImg = ref(false);
  const networkImgUrls = ref('');
  const rowIndex = ref(0);

  // 网络图片
  const uploadNetworkImg = (idx) => {
    showNetworkImg.value = true;
    networkImgUrls.value = '';
    rowIndex.value = idx;
  };

  const handleUpload = () => {
    let imgList = networkImgUrls.value.split('\n');

    if (imgList?.length > 1) {
      return ElMessage.warning('sku预览图只支持一张图片！');
    }
    detailListItem.value.prodSyncSMiraviaDtoList[rowIndex.value].skuImageList =
      imgList[0];

    showNetworkImg.value = false;
  };

  // 模板图片
  const tplImgVisible = ref(false);
  const tplImgParams = ref({});
  const remainderLimit = ref(0);
  const uploadTempImg = async (idx) => {
    // 最多上传图片限制
    remainderLimit.value = 1;
    rowIndex.value = idx;
    tplImgVisible.value = true;

    tplImgParams.value = {
      platCode: 'miravia',
      prodSSkus: detailListItem.value.prodSyncSMiraviaDtoList
        .filter((item) => item.prodSSku !== '')
        .map((item) => item.prodSSku)
    };
  };

  // 渲染选择的模板图片
  const getTplImg = (imgUrlList) => {
    detailListItem.value.prodSyncSMiraviaDtoList[rowIndex.value].skuImageList =
      imgUrlList[0];
  };

  // 删除模板图片
  const removeSkuImg = (index) => {
    detailListItem.value.prodSyncSMiraviaDtoList[index].skuImageList = '';
  };

  // 批量填写
  const handleSet = () => {
    const checkedList = miraviaTableRef.value.getTableData().fullData;
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    let obj = {
      packageWeight: '', // 重量
      skuPrice: '', // 建议零售价
      skuStock: '', // 库存
      skuDiscountPrice: '', // 促销价
      packageLength: '', // 长
      packageWidth: '', // 宽
      packageHeight: '' // 高
    };
    Object.keys(obj).forEach((key) => {
      checkedList.forEach((cItem) => {
        if (mulSetting[key] !== '') {
          cItem[key] = mulSetting[key];
        }
      });
    });
  };

  const resultObj = () => {
    const checkedList = cloneDeep(
      miraviaTableRef.value.getTableData().fullData
    );
    checkedList.forEach((item) => {
      item.skuProperty = JSON.stringify(item.skuProperty);
    });
    return {
      checkedList,
      detailListItem: cloneDeep(detailListItem.value)
    };
  };

  const clearFormInfo = () => {
    Object.keys(mulSetting).forEach((key) => {
      mulSetting[key] = '';
    });
    // 清空数据
    fixPrice.grossRate = '';
    fixPrice.discountRate = '';
    addSku.value = '';
  };

  // #region 定价
  const handleReCountPrice = async () => {
    const checkedList = miraviaTableRef.value.getTableData().fullData;
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    let { grossRate, discountRate } = fixPrice;
    if (grossRate) {
      grossRate = grossRate / 100;
    }
    if (discountRate) {
      discountRate = discountRate / 100;
    }
    try {
      let params = checkedList.map((v) => ({
        storeAcctId: props.item.storeAcctId,
        storeSSku: v.storeSSku,
        prodSId: v.prodSId,
        grossRate,
        discountRate
      }));
      const { code, data = [], msg } = await reCountPriceApi(params);
      if (code === '0000') {
        checkedList.forEach((elem) => {
          const curObj = data.filter((v) => v.storeSSku === elem.storeSSku)[0];
          if (curObj) {
            elem.skuDiscountPrice = curObj.listingPrice;
            elem.skuPrice = curObj.guidPrice;
          }
        });
        ElMessage.success(msg);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // #endregion 定价

  // #region 变种
  const addSku = ref();
  const handleAddInfo = async () => {
    if (!addSku.value) {
      return ElMessage.warning('请至少输入一个父/子SKU!');
    }
    try {
      let params = {
        storeAcctId: props.item.storeAcctId,
        productId: props.item.productId,
        outerGrossProfitRate: fixPrice.grossRate,
        outerDiscountRate: fixPrice.discountRate,
        prodSSku: addSku.value
      };
      const { data = [] } = await addProdSSkuInfosApi(params);
      const { fullData } = miraviaTableRef.value.getTableData();
      const existStoreSSkuList = fullData.map((v) => v.storeSSku.split('/')[0]);
      // 删除重复数据
      let skuList = data.filter(
        (v) => !existStoreSSkuList.includes(v.storeSSku.split('/')[0])
      );
      skuList.forEach((v) => {
        const skuProperty = [];
        // 按序增加
        JSON.parse(v.skuProperty || '[]').forEach((elem) => {
          const index = recordSkuPropertyOrder[elem.skuPropertyId];
          if (index !== undefined) {
            skuProperty.splice(index, 0, elem);
          }
        });
        v.skuProperty = skuProperty;
        miraviaTableRef.value.insertAt(v, -1);
      });
      if (skuList.length) {
        ElMessage.success('新增成功！');
      } else {
        ElMessage.warning('添加数据均存在，请重新输入！');
      }
      addSku.value = '';
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const handleRemove = (row) => {
    miraviaTableRef.value.remove(row);
  };
  // #endregion 变种

  defineExpose({
    resultObj,
    clearFormInfo
  });
</script>
<style lang="scss" scoped>
  :deep(.el-card__header) {
    background-color: #eee;
  }
  .content {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 280px);
    margin-top: -30px;
    .skuList {
      flex: 1;
    }
  }

  .flex {
    display: flex;
    align-items: center;
  }
  .justify-end {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
  .btn_position {
    width: 80px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .batch_setting {
    display: flex;
    justify-content: space-between;
    :deep(.el-form-item) {
      margin-bottom: 0px;
    }
  }
</style>
