<template>
  <div class="">
    <div class="disflex_btns">
      <div class="calculate_price">
        <span>毛利率</span>
        <ZInputNumber
          v-model="grossRateModel"
          :precision="2"
          class="w60"
          placeholder="20%，请填写20"
          @change="changeGrossRateModel"
        />
        <span class="mr10">%</span>
        <el-button
          type="primary"
          class="ml10"
          :loading="calculatePriceLoading"
          @click="handleCalculatePrice"
          >估算价格</el-button
        >
      </div>
      <div class="disflex">
        <el-button type="primary" @click="handleBatchRemoveStar"
          >批量去*</el-button
        >
        <el-button type="primary" @click="handleBatchSet">批量设置</el-button>
        <el-button type="primary" @click="handleChangeAttr({}, 2)"
          >批量修改属性映射</el-button
        >
        <div>
          <el-input
            v-model="addSku"
            placeholder="支持父、子SKU同时输入"
            clearable
            style="width: 170px; margin: 0 10px"
          ></el-input>
          <el-button
            type="primary"
            :disabled="!tableData.length"
            @click="handleAddInfo"
            >一键添加sku</el-button
          >
        </div>
      </div>
    </div>
    <vxe-table
      ref="tableSkuRef"
      border
      class="mt10"
      :data="tableData"
      show-overflow
      :height="400"
      :edit-rules="validRules"
      :row-config="{ isCurrent: true, isHover: true, keyField: 'prodSSku' }"
      :checkbox-config="{ highlight: true }"
      :column-config="{ resizable: true }"
    >
      <vxe-column type="checkbox" width="40" />
      <vxe-column
        v-if="tableData[0]?.imgAttrId"
        field="imgAttrId"
        :width="160"
        :title="tableData[0].imgAttrName"
      >
        <template #default="{ row, $rowIndex }">
          <div class="disflex">
            <ImagePop :src="row.skuImage" />
            <div class="disflexCol">
              <el-upload
                action
                :http-request="(file) => handleUpload(file, row)"
                :show-file-list="false"
                accept="image/*"
                multiple
              >
                <el-button type="primary" link size="small" class="mr10"
                  >本地图片</el-button
                >
              </el-upload>
              <el-button
                type="primary"
                link
                style="font-size: 12px"
                @click="uploadNetworkImg('list', $rowIndex)"
                >网络图片</el-button
              >
              <el-button
                type="primary"
                link
                style="font-size: 12px"
                @click="uploadTempImg('list', $rowIndex)"
                >模板图片</el-button
              >
              <el-button
                type="danger"
                link
                size="small"
                @click="handleDelImg(row)"
                >删除</el-button
              >
            </div>
          </div>
          <div>
            <el-select
              v-model="row.imgAttrValueId"
              filterable
              @change="handleChangeSameCustomValue(row)"
            >
              <el-option
                v-for="item in skuAttrList[row.imgAttrId]
                  ?.categoryAttributeValuesSmts"
                :key="item.categoryAttributeValueId"
                :label="item.valueNameZn"
                :value="item.categoryAttributeValueId"
              />
            </el-select>
            <el-input v-model="row.imgCustomValue" />
          </div>
        </template>
      </vxe-column>
      <!-- 动态列 -->
      <template v-for="v in skuTheadCols" :key="v.attrId">
        <vxe-column :field="v.name" :title="v.name">
          <template #default="{ row }">
            <el-select v-model="row[v.selectValueKey]" filterable>
              <el-option
                v-for="item in skuAttrList[v.attrId]
                  ?.categoryAttributeValuesSmts"
                :key="item.categoryAttributeValueId"
                :label="item.valueNameZn"
                :value="item.categoryAttributeValueId"
              />
            </el-select>
            <el-input v-model="row[v.inputValueCustom]" />
          </template>
        </vxe-column>
      </template>
      <vxe-column title="SKU编码" field="storeSSku">
        <template #default="{ row }">
          <el-input
            v-model="row.storeSSku"
            clearable
            maxlength="32"
            placeholder="只允许数字、字母以及* . _ = -"
            oninput="value=value.replace(/[^A-Za-z0-9*.=_\-]/g, '')"
          />
        </template>
      </vxe-column>
      <vxe-column title="成本(￥)" :width="110">
        <template #default="{ row }">
          <div>采购单价:{{ row.purchaseCostPrice }}</div>
          <div>平均单价:{{ row.avgPrice }}</div>
        </template>
      </vxe-column>
      <vxe-column width="140" field="supplyPriceCny">
        <template #header>
          <div><span class="danger_color">*</span>供货价(￥)</div>
        </template>
        <template #default="{ row }">
          <el-input-number
            v-model="row.supplyPriceCny"
            class="small_input"
            :precision="2"
            controls-position="right"
          />
          <!-- <ZInputNumber v-model="row.supplyPriceCny" :precision="2" /> -->
        </template>
      </vxe-column>
      <vxe-column v-if="productType" title="JIT库存">
        <template #default="{ row }">
          <ZInputNumber v-model="row.jitStock" :precision="0" />
        </template>
      </vxe-column>
      <vxe-column title="重量(g)" field="weight" :width="80"></vxe-column>
      <vxe-column field="packageLength" :width="180">
        <template #header>
          <div><span class="danger_color">*</span>尺寸(cm)(长*宽*高)</div>
        </template>
        <template #default="{ row }">
          <div class="disflex">
            <ZInputNumber
              v-model="row.packageLength"
              placeholder="长"
              oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')"
              :precision="1"
              clearable
            />
            <ZInputNumber
              v-model="row.packageWidth"
              placeholder="宽"
              oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')"
              :precision="1"
              clearable
            />
            <ZInputNumber
              v-model="row.packageHeight"
              placeholder="高"
              oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')"
              :precision="1"
              clearable
            />
          </div>
        </template>
      </vxe-column>
      <vxe-column field="originalBox" :width="90">
        <template #header>
          <div><span class="danger_color">*</span>是否原箱</div>
        </template>
        <template #default="{ row }">
          <el-select v-model="row.originalBox" clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </template>
      </vxe-column>
      <vxe-column field="specialProductTypeList" :width="180">
        <template #header>
          <div><span class="danger_color">*</span>特殊商品类型</div>
        </template>
        <template #default="{ row }">
          <div :key="randomKey">
            <el-select
              v-model="row.specialProductTypeList"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              clearable
              filterable
            >
              <!-- <el-option
                v-for="label in SPECIAL_PRODUCT_TYPE_LIST"
                :key="label"
                :value="label"
                :label="label"
                :disabled="isOptionDisabled(row.specialProductTypeList, label)"
              ></el-option> -->
              <el-option
                value="普货"
                label="普货"
                :disabled="isOptionDisabled(row.specialProductTypeList, '普货')"
              ></el-option>
              <el-option
                value="内电"
                label="内电"
                :disabled="isOptionDisabled(row.specialProductTypeList, '内电')"
              ></el-option>
              <el-option
                value="弱磁"
                label="弱磁"
                :disabled="isOptionDisabled(row.specialProductTypeList, '弱磁')"
              ></el-option>
              <el-option
                value="粉末"
                label="粉末"
                :disabled="isOptionDisabled(row.specialProductTypeList, '粉末')"
              ></el-option>
              <el-option
                value="膏体"
                label="膏体"
                :disabled="isOptionDisabled(row.specialProductTypeList, '膏体')"
              ></el-option>
              <el-option
                value="液体"
                label="液体"
                :disabled="isOptionDisabled(row.specialProductTypeList, '液体')"
              ></el-option>
            </el-select>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="isAppalyForSale" :width="105">
        <template #header>
          <div><span class="danger_color">*</span>是否申请销售</div>
        </template>
        <template #default="{ row }">
          <el-select v-model="row.isAppalyForSale" clearable>
            <el-option label="销售" value="active"></el-option>
            <el-option label="不销售" value="inactive"></el-option
          ></el-select>
        </template>
      </vxe-column>
      <vxe-column title="操作" :width="130">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleChangeAttr(row, 1)"
            >修改属性映射</el-button
          >
          <el-button type="danger" size="small" @click="handleDelRow(row)"
            >删除</el-button
          >
        </template>
      </vxe-column>
    </vxe-table>
    <!-- 属性映射弹窗 -->
    <el-dialog
      v-model="attrVisible"
      :title="changeAttrTitle"
      width="800"
      class="attr_dialog"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div class="update_attr_part">
        <template v-for="(item, index) in tableAttrList" :key="item.oaNameVal">
          <div>
            <div class="attr_title">{{ item.oaNameVal }}</div>
            <div class="attr_content">{{ item.afterChangeVal }}</div>
          </div>
          <div
            v-if="index + 1 !== tableAttrList.length"
            class="attr_icon"
            @click="handleChangeCustomVal(index)"
          >
            <el-icon><Switch /></el-icon>
          </div>
        </template>
      </div>
      <template #footer>
        <span>
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 批量设置弹窗 -->
    <el-dialog
      v-model="bacthSetVisible"
      title="批量设置"
      width="800"
      class="attr_dialog"
      :close-on-click-modal="false"
      @close="bacthSetVisible = false"
    >
      <el-form
        :model="batchFormData"
        size="default"
        status-icon
        :label-width="100"
      >
        <el-form-item class="disflex">
          <el-select v-model="supplyPriceType" clearable>
            <el-option label="供货价(覆盖)" :value="0"></el-option>
            <el-option label="供货价(增加)" :value="1"></el-option>
            <el-option label="供货价(减少)" :value="2"></el-option>
          </el-select>
          <ZInputNumber
            v-model="batchFormData.supplyPriceCny"
            class="flex-1"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="JIT库存">
          <ZInputNumber v-model="batchFormData.jitStock" :precision="0" />
        </el-form-item>
        <el-form-item label="尺寸(cm)">
          <div class="disflex">
            <ZInputNumber
              v-model="batchFormData.packageLength"
              placeholder="长"
              oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')"
              :precision="1"
              clearable
            />
            <ZInputNumber
              v-model="batchFormData.packageWidth"
              placeholder="宽"
              oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')"
              :precision="1"
              clearable
            />
            <ZInputNumber
              v-model="batchFormData.packageHeight"
              placeholder="高"
              oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')"
              :precision="1"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="是否原箱">
          <el-select v-model="batchFormData.originalBox" clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特殊商品类型">
          <el-select
            v-model="batchFormData.specialProductTypeList"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            filterable
            clearable
          >
            <el-option
              v-for="label in SPECIAL_PRODUCT_TYPE_LIST"
              :key="label"
              :value="label"
              :label="label"
              :disabled="
                isOptionDisabled(batchFormData.specialProductTypeList, label)
              "
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="是否申请销售">
          <el-select v-model="batchFormData.isAppalyForSale" clearable>
            <el-option label="销售" value="active"></el-option>
            <el-option label="不销售" value="inactive"></el-option
          ></el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="handleSaveBacthData"
            >保存</el-button
          >
          <el-button @click="bacthSetVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 上传网络图片弹窗 -->
    <el-dialog
      :model-value="showNetworkImg"
      title="网络图片"
      width="30%"
      :close-on-click-modal="false"
      @close="closeNetwork"
    >
      <el-input
        v-model="networkImgUrls"
        placeholder="请填写图片URL，多个地址用回车换行"
        type="textarea"
        :autosize="{ minRows: 6 }"
      ></el-input>
      <template #footer>
        <span>
          <el-button type="primary" @click="handleUploadNetwork"
            >确定</el-button
          >
          <el-button @click="closeNetwork">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 上传模板图片弹窗 -->
    <Tempimages
      v-if="showTempImgsDialog"
      :show-temp-imgs-dialog="showTempImgsDialog"
      :prod-p-id="props.prodPId"
      :temp-type="tempType"
      :sku-image-list="[]"
      :carousel-image-url-list="mainImageUrlList"
      @close="handleCloseTemp"
    />
  </div>
</template>

<script setup>
  import { ref, watch, watchEffect } from 'vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import Tempimages from './Tempimages.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { comBlobToDataURL } from '@/utils/upload';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import {
    calculatePriceApi,
    aePublishAddSkuApi,
    removeSkuStarCheckApi,
    removeSkuStarApi
  } from '@/api/publishs/aefullyhostedpublish';
  import { forIn, pickBy, cloneDeep } from 'lodash-es';

  const SPECIAL_PRODUCT_TYPE_LIST = [
    '普货',
    '内电',
    '弱磁',
    '液体',
    '粉末',
    '膏体'
  ];
  const props = defineProps({
    tableDataCopy: {
      type: Array,
      default: () => []
    },
    mainImagesList: {
      type: Array,
      default: () => []
    },
    skuAttr: {
      type: Array,
      default: () => []
    },
    productType: {
      type: Boolean,
      default: true
    },
    prodPId: {
      type: Number,
      default: 0
    },
    grossRate: {
      type: Number,
      default: null
    },
    jitStockSafetyThreshold: {
      type: Number,
      default: 10
    },
    smtCategoryId: {
      type: Number,
      default: null
    }
  });
  const tableSkuRef = ref();
  const skuAttrList = ref([]);
  const tableData = ref([]);
  const grossRateModel = ref('');
  const emits = defineEmits(['changeImage']);
  watchEffect(() => {
    grossRateModel.value = props.grossRate;
  });
  const changeGrossRateModel = (val) => {
    emits('changeImage', { type: 'grossRate', val });
  };
  watch(
    () => props.skuAttr,
    () => {
      props.skuAttr.forEach((item) => {
        skuAttrList.value[item.attributeId] = item;
      });
    }
  );

  const randomKey = ref(Math.random());
  //   动态列
  const skuTheadCols = ref([]);
  watch(
    () => props.tableDataCopy,
    (val) => {
      if (val.length) {
        tableData.value = val.map((v) => ({
          ...v,
          specialProductTypeList: v.specialProductType
            ? v.specialProductType.split(',')
            : []
        }));
      }
      if (val && val.length) {
        Object.keys(val[0]).forEach((key) => {
          let curObj = val[0];
          if (
            key.includes('Name') &&
            !key.includes('OaAttrName') &&
            key != 'imgAttrName' &&
            !!curObj[key]
          ) {
            let prefixName = key.slice(0, 5);
            skuTheadCols.value.push({
              key,
              name: curObj[key],
              selectValueKey: `${prefixName}ValueId`,
              inputValueCustom: `${prefixName}CustomValue`,
              attrId: curObj[`${prefixName}Id`],
              oaAttrName: curObj[`${prefixName}OaAttrName`]
            });
          }
        });
      } else {
        skuTheadCols.value = [];
      }
    }
  );
  const validRules = ref({
    originalBox: [{ required: true, message: '请选择是否为原箱' }],
    supplyPriceCny: [{ required: true, message: '请填写供货价' }],
    packageLength: [{ required: true, message: '请填写尺寸' }],
    specialProductTypeList: [{ required: true, message: '请选择特殊商品类型' }],
    isAppalyForSale: [{ required: true, message: '请选择是否申请销售' }]
  });

  // 变种信息的主图信息
  watch(
    () => props.mainImagesList,
    (val) => {
      if (val) {
        // 有主图
        mainImageUrlList.value = val;
        mainImgUrl.value = val[0];
        assistImgList.value = val.slice(1);
      }
    }
  );
  // JIT补货
  watch(
    () => props.productType,
    (val) => {
      if (val) {
        // imgCustomValue相同,则替换为新属性
        const { fullData } = tableSkuRef.value.getTableData();
        fullData.forEach((item) => {
          item.jitStock = props.jitStockSafetyThreshold;
        });
        // 更新表格数据
        tableSkuRef.value.reloadData(fullData);
      }
    }
  );

  // 特殊商品类型 普货与 （内电/弱磁） 互斥
  const isOptionDisabled = (selectList = [], optionValue) => {
    const specialOption = ['内电', '弱磁', '粉末', '膏体', '液体'];
    if (optionValue === '普货') {
      return Boolean(
        selectList.length &&
          Array.isArray(selectList) &&
          selectList?.some((option) => specialOption?.includes(option))
      );
    } else if (specialOption?.includes(optionValue)) {
      return Boolean(
        selectList.length &&
          Array.isArray(selectList) &&
          selectList?.includes('普货')
      );
    } else {
      return false;
    }
  };
  // 估算价格
  const calculatePriceLoading = ref(false);
  const handleCalculatePrice = async () => {
    const checkedList = tableSkuRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    try {
      calculatePriceLoading.value = true;
      const { data } = await calculatePriceApi({
        grossProfitRate: grossRateModel.value,
        aliexpressFullmanageListingSkuDtoList: checkedList
      });
      let obj = {};
      data.forEach((item) => {
        if (!obj[item.prodSSku]) {
          obj[item.prodSSku] = item.supplyPriceCny;
        }
      });
      const { fullData } = tableSkuRef.value.getTableData();
      fullData.forEach((item) => {
        if (obj[item.prodSSku]) {
          item.supplyPriceCny = obj[item.prodSSku];
        }
      });
      // 更新表格数据
      tableSkuRef.value.reloadData(fullData);
    } catch (err) {
      console.log('err :>> ', err);
    }
    calculatePriceLoading.value = false;
  };
  //   prodSSku;
  const handleUpload = (rawFile, row) => {
    comBlobToDataURL(rawFile.file, (url) => {
      row.skuImage = url;
    });
  };

  const handleDelImg = (row) => {
    row.skuImage = '';
  };

  const mainImageUrlList = ref([]); // 主图列表
  const mainImgUrl = ref(''); // 主图
  const assistImgList = ref([]); // 辅图

  const showTempImgsDialog = ref(false); // 模板图片
  const tempType = ref('');
  const uploadTempImg = (type, idx) => {
    showTempImgsDialog.value = true;
    tempType.value = type;
    rowIndex.value = idx;
  };

  const handleCloseTemp = (addImgs) => {
    if (addImgs && addImgs.length > 0) {
      if (tempType.value === 'list') {
        tableData.value[rowIndex.value].skuImage = addImgs[0];
      }
    }
    showTempImgsDialog.value = false;
  };

  const showNetworkImg = ref(false); // 网络图片
  const networkImgUrls = ref('');
  const netWorkType = ref('');
  const rowIndex = ref(0);

  // 上传网络图片
  const uploadNetworkImg = (type = '', idx) => {
    showNetworkImg.value = true;
    networkImgUrls.value = '';
    netWorkType.value = type;
    rowIndex.value = idx;
  };

  // 模板图片选择后处理 basic 商品图片 white 白底图 scene 场景图 list 变种信息sku图
  const handleUploadNetwork = () => {
    let imgList = networkImgUrls.value.split('\n');
    if (netWorkType.value === 'list') {
      // 变种信息列表上传网络图片
      if (imgList?.length > 1) {
        return ElMessage.warning('sku预览图只支持一张图片！');
      }
      tableData.value[rowIndex.value].skuImage = imgList[0];
    }
    showNetworkImg.value = false;
    concatMainAssitImg();
  };

  // 合并主图和辅图
  const concatMainAssitImg = () => {
    mainImageUrlList.value = [mainImgUrl.value].concat(assistImgList.value);
  };

  const closeNetwork = () => {
    showNetworkImg.value = false;
  };

  // 图片属性下oa值相同表示 属于同个聚合
  const handleChangeSameCustomValue = (row) => {
    // imgCustomValue相同,则替换为新属性
    const { fullData } = tableSkuRef.value.getTableData();
    fullData.forEach((item) => {
      if (item.imgCustomValue === row.imgCustomValue) {
        item.imgAttrValueId = row.imgAttrValueId;
      }
    });
    // 更新表格数据
    tableSkuRef.value.reloadData(fullData);
  };

  //  修改属性
  const changeAttrTitle = ref('');
  const attrVisible = ref(false);
  const attrType = ref(1);
  const tableAttrList = ref([]);
  const rowList = ref([]);
  // type 1是单个 2是批量
  const handleChangeAttr = (row, type) => {
    if (type === 1) {
      rowList.value = [row];
    } else {
      const checkedList = tableSkuRef.value.getCheckboxRecords();
      if (!checkedList.length) return ElMessage.warning('请选择数据');
    }

    const { fullData } = tableSkuRef.value.getTableData();
    tableAttrList.value = [];
    const AttrInfos = {
      imgOaAttrName: 'imgCustomValue',
      attr1OaAttrName: 'attr1CustomValue',
      attr2OaAttrName: 'attr2CustomValue',
      attr3OaAttrName: 'attr3CustomValue'
    };
    Object.keys(fullData[0]).forEach((item) => {
      if (AttrInfos[item]) {
        tableAttrList.value.push({
          oaNameVal: fullData[0][item],
          afterChangeVal: fullData[0][item],
          customName: AttrInfos[item],
          afterCustomName: AttrInfos[item]
        });
      }
    });
    if (!tableAttrList.value.length) {
      return ElMessage.warning('暂无属性可修改');
    }
    attrType.value = type;
    changeAttrTitle.value =
      type === 1
        ? '修改属性映射  商品SKU编码:' + row.prodSSku
        : '批量修改属性映射';
    attrVisible.value = true;
  };

  // 点击箭头切换属性
  const handleChangeCustomVal = (index) => {
    const temp = tableAttrList.value[index].afterChangeVal;
    tableAttrList.value[index].afterChangeVal =
      tableAttrList.value[index + 1].afterChangeVal;
    tableAttrList.value[index + 1].afterChangeVal = temp;

    const customTemp = tableAttrList.value[index].afterCustomName;
    tableAttrList.value[index].afterCustomName =
      tableAttrList.value[index + 1].afterCustomName;
    tableAttrList.value[index + 1].afterCustomName = customTemp;
  };
  const handleClose = () => {
    attrVisible.value = false;
  };

  // 点击修改属性映射弹窗保存按钮
  const handleSave = () => {
    attrVisible.value = false;
    switch (attrType.value) {
      case 1:
        simpleSave(rowList.value);
        break;
      case 2:
        batchSave();
        break;

      default:
        simpleSave(rowList.value);
        break;
    }
  };

  // 单行修改属性映射
  const simpleSave = (rowList) => {
    rowList.forEach((item) => {
      let temp = cloneDeep(item);

      tableAttrList.value.forEach((v) => {
        item[v.customName] = temp[v.afterCustomName];
      });
    });
  };

  // 批量修改属性映射
  const batchSave = () => {
    const checkedList = tableSkuRef.value.getCheckboxRecords();
    simpleSave(checkedList);
  };

  const handleDelRow = (row) => {
    const $table = tableSkuRef.value;
    $table.remove(row);
  };
  //#region  批量设置
  const bacthSetVisible = ref(false);
  const batchFormData = ref({});
  const supplyPriceType = ref(0);
  const handleBatchSet = () => {
    const checkedList = tableSkuRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    batchFormData.value = {};
    bacthSetVisible.value = true;
    supplyPriceType.value = 0;
  };

  // 批量去星
  const handleBatchRemoveStar = async () => {
    const checkedList = tableSkuRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    const checkParams = checkedList.map((item) => {
      return {
        storeAcctId: item.storeAcctId,
        prodPId: item.prodPId,
        storeSSku: item.prodSSku,
        prodSId: item.prodSId
      };
    });

    await removeSkuStarCheckApi(checkParams);
    await removeStar(checkParams);
  };

  const removeStar = async (params) => {
    await ElMessageBox.confirm(
      '当前操作会去除所选SKU的*，变为单个一卖，操作不可撤回，确认继续?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    const { data } = await removeSkuStarApi(params);
    tableData.value.forEach((item) => {
      data.forEach((cItem) => {
        if (item.prodSId === cItem.prodSId) {
          item.supplyPriceCny = cItem.supplyPriceCny;
          item.weight = cItem.weight;
          item.packageLength = cItem.packageLength;
          item.packageWidth = cItem.packageWidth;
          item.packageHeight = cItem.packageHeight;
          item.storeSSku = cItem.storeSSku;
        }
      });
    });
  };

  const addSku = ref('');
  // 一键添加sku
  const handleAddInfo = () => {
    if (!addSku.value) {
      return ElMessage.warning('请填写新增的sku');
    }
    let skuArr = addSku.value?.split(',');
    if (skuArr?.length === 1) {
      // 只新增一条sku时，进行重复校验
      const { fullData } = tableSkuRef.value.getTableData();
      let listIds = fullData.map((item) => item.prodSSku);
      if (listIds.includes(skuArr[0].trim())) {
        return ElMessage.warning('商品已存在！');
      } else {
        handleAddSku();
      }
    }
    if (skuArr.length > 1) {
      handleAddSku();
    }
  };

  // 一键新增sku接口调用
  const handleAddSku = async () => {
    let params = {
      smtCategoryId: props.smtCategoryId,
      storeAcctId: tableData.value[0]?.storeAcctId || '',
      skuList: addSku.value.split(','),
      imgAttrId: tableData.value[0]?.imgAttrId || '',
      imgName: tableData.value[0]?.imgName || '',
      imgOaAttrName: tableData.value[0]?.imgOaAttrName || '',
      attr1Id: tableData.value[0]?.attr1Id || '',
      attr1Name: tableData.value[0]?.attr1Name || '',
      attr1OaAttrName: tableData.value[0]?.attr1OaAttrName || '',
      attr2Id: tableData.value[0]?.attr2Id || '',
      attr2Name: tableData.value[0]?.attr2Name || '',
      attr2OaAttrName: tableData.value[0]?.attr2OaAttrName || '',
      attr3Id: tableData.value[0]?.attr3Id || '',
      attr3Name: tableData.value[0]?.attr3Name || '',
      attr3OaAttrName: tableData.value[0]?.attr3OaAttrName || ''
    };
    const { code, data } = await aePublishAddSkuApi(params);
    if (code === '0000') {
      let prodSSkuList = data.prodSSkuList || [];
      const { fullData } = tableSkuRef.value.getTableData();
      let prodSSkuIds = fullData.map((item) => item.prodSSku);

      // 过滤重复数据
      prodSSkuList?.forEach((item) => {
        if (!prodSSkuIds.includes(item.prodSSku)) {
          tableSkuRef.value.insertAt(item, -1);
        }
      });
      ElMessage.success('新增成功！');
    }
  };

  const handleSaveBacthData = () => {
    const checkedList = tableSkuRef.value.getCheckboxRecords();
    // 有值才设
    let newObj = pickBy(
      batchFormData.value,
      (a) => a !== '' && a !== undefined && a !== null && a.length != 0
    );

    checkedList.forEach((item) => [
      forIn(newObj, function (value, key) {
        // 供货价：0覆盖 1原价基础增加 2原价基础减少
        if (key === 'supplyPriceCny' && value) {
          if (supplyPriceType.value === 1) {
            item[key] = item[key] + value;
          } else if (supplyPriceType.value === 2) {
            item[key] = item[key] - value;
          } else {
            item[key] = value;
          }
        } else {
          item[key] = value;
        }
      })
    ]);

    bacthSetVisible.value = false;
  };
  //#endregion  批量设置
  const getTableFullData = () => {
    const { fullData } = tableSkuRef.value.getTableData();
    let wrongMsg = '';

    let filterAttrIdList = [];
    let filterNameIdList = [];

    fullData.forEach((item) => {
      delete item['X_ROW_KEY'];
      if (!props.productType) {
        delete item.jitStock;
      } else {
        if (item.jitStock < props.jitStockSafetyThreshold) {
          wrongMsg = `当前类目要求新发的SKU库存量≥${props.jitStockSafetyThreshold}`;
        }
      }
      // 原箱必填
      if (
        item.originalBox === undefined ||
        item.originalBox === null ||
        item.originalBox === ''
      ) {
        wrongMsg = '请选择是否是原箱';
      }

      // 尺寸必填
      if (
        item.packageLength === undefined ||
        item.packageLength === null ||
        item.packageLength === '' ||
        Number(item.packageLength) <= 0 ||
        item.packageWidth === undefined ||
        item.packageWidth === null ||
        item.packageWidth === '' ||
        Number(item.packageWidth) <= 0 ||
        item.packageHeight === undefined ||
        item.packageHeight === null ||
        item.packageHeight === '' ||
        Number(item.packageHeight) <= 0
      ) {
        wrongMsg = '尺寸的长宽高不能为空且必须大于0';
      }

      // 供货价必填
      if (
        item.supplyPriceCny === undefined ||
        item.supplyPriceCny === null ||
        item.supplyPriceCny === ''
      ) {
        wrongMsg = '请填写供货价';
      }

      // 特殊商品类型必填
      if (!item.specialProductTypeList.length) {
        wrongMsg = '请选择特殊商品类型';
      }

      // 是否申请销售必填
      if (
        item.isAppalyForSale === undefined ||
        item.isAppalyForSale === null ||
        item.isAppalyForSale === ''
      ) {
        wrongMsg = '请选择是否申请销售';
      }
      // 如果存在imgAttrId
      if (item.imgAttrId) {
        if (!item.imgAttrValueId) {
          wrongMsg = `请选择${item.imgAttrName}`;
        } else {
          item.imgAttrValue = skuAttrList.value[
            item.imgAttrId
          ].categoryAttributeValuesSmts?.filter(
            (v) => v.categoryAttributeValueId === item.imgAttrValueId
          )[0].valueNameZn;
        }
      }
      ['attr1', 'attr2', 'attr3'].forEach((v) => {
        if (item[v + 'Id']) {
          if (item[v + 'ValueId']) {
            item[v + 'Value'] = skuAttrList.value[
              item[v + 'Id']
            ].categoryAttributeValuesSmts?.filter(
              (elem) => elem.categoryAttributeValueId === item[v + 'ValueId']
            )[0].valueNameZn;
          } else {
            item[v + 'Value'] = '';
          }
        }
      });
      // sku属性和属性值 不能重复
      let attrStr =
        (item.imgAttrValueId || ' ').toString() +
        (item.attr1ValueId || ' ').toString() +
        (item.attr2ValueId || ' ').toString() +
        (item.attr3ValueId || ' ').toString();
      let attrNameStr =
        (item.imgCustomValue || ' ').toString() +
        (item.attr1CustomValue || ' ').toString() +
        (item.attr2CustomValue || ' ').toString() +
        (item.attr3CustomValue || ' ').toString();
      filterAttrIdList.push(attrStr);
      filterNameIdList.push(attrNameStr);
    });
    let newFilterDataList = new Set(filterAttrIdList);
    let newFilterNameIdList = new Set(filterNameIdList);
    if (newFilterDataList.size !== filterAttrIdList.length) {
      wrongMsg = '属性重复，请重新选择！';
    }
    if (newFilterNameIdList.size !== filterNameIdList.length) {
      wrongMsg = '属性值重复，请重新填写！';
    }
    return { fullData, wrongMsg };
  };
  defineExpose({ getTableFullData });
</script>

<style lang="scss" scoped>
  .ml10 {
    margin-left: 10px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .disflex {
    display: flex;
  }
  .disflexCol {
    display: flex;
    flex-direction: column;
  }
  .disflex_btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .calculate_price {
    display: flex;
    align-items: center;
    span {
      flex: none;
    }
  }
  .w60 {
    width: 130px;
  }
  .flex-1 {
    flex: 1;
  }
  .update_attr_part {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .attr_title {
    background-color: #f2f2f2;
  }
  .attr_title,
  .attr_content {
    border: 1px solid #e6e6e6;
    height: 40px;
    line-height: 40px;
    width: 60px;
    padding: 10px;
    text-align: center;
  }
  .attr_icon {
    font-size: 40px;
    color: #409eff;
  }

  :deep(.el-dialog) {
    height: auto !important;
  }
  :deep(.el-dialog__body) {
    height: auto !important;
  }
  .danger_color {
    color: #f56c6c;
  }
  .small_input {
    width: 110px;
  }
</style>
