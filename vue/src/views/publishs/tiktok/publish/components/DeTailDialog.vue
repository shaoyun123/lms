<template>
  <!-- 详情 -->
  <div>
    <div class="detail_wrapper">
      <el-dialog
        v-model="dialogVisible"
        width="80%"
        title="产品详情"
        :modal-class="'fullDialog'"
        :align-center="true"
        :close-on-click-modal="false"
      >
        <el-card>
          <el-form
            ref="formRef"
            :rules="formRules"
            :model="formData"
            size="default"
            scroll-to-error
            :label-width="130"
          >
            <el-form-item label="商品父SKU">
              <div>{{ formData.prodPSku }}</div>
            </el-form-item>
            <el-form-item label="Global标题" prop="productName">
              <PlatTitle
                v-model="formData.productName"
                style="width: 100%"
                :content-top="50"
                minlength="25"
                :max-length="255"
                show-word-limit
                input-width="100%"
                :prod-p-id="formData.prodPId"
                :prod-p-sku="formData.prodPSku"
                custom-type="text"
              />
            </el-form-item>
            <el-form-item label="Global产品描述" prop="description">
              <!-- <el-input
                v-model="formData.description"
                type="textarea"
                :rows="8"
              /> -->
              <Editor
                v-if="dialogVisible"
                :detail="formData.description"
                :api-url="'/lms/tiktok/mediaSpace/uploadProductDescriptionImage'"
                :api-params="transferParams"
                :get-tpl-image-params="getTplImageParams"
                @get-url="getImageUrl"
                @change="changeEditor"
              />
            </el-form-item>
            <el-form-item label="TikTok类目" prop="platCateId"
              ><el-cascader
                v-model="formData.platCateId"
                :options="tiktokList"
                filterable
                collapse-tags
                :props="{
                  label: 'cnName',
                  value: 'categoryId'
                }"
            /></el-form-item>
            <div class="disflex">
              <div class="label_title">商品属性</div>
              <div>
                <el-form-item
                  v-for="item in formData?.attributes"
                  :key="item.attributeId"
                  :label="item.attributeName"
                  label-width="300px"
                  :prop="item.attributeId.toString()"
                >
                  <el-select
                    v-if="item?.platCateAttrValueList?.length"
                    v-model="formData.attributesObj[item.attributeId]"
                    filterable
                    clearable
                    :collapse-tags="item.isMultipleSelected"
                    :collapse-tags-tooltip="item.isMultipleSelected"
                    :multiple="item.isMultipleSelected"
                    :allow-create="item.isCustomized"
                    default-first-option
                    :reserve-keyword="false"
                    style="width: 150px"
                    :placeholder="item.isCustomized ? '请选择/输入' : '请选择'"
                  >
                    <el-option
                      v-for="elem in item.platCateAttrValueList || []"
                      :key="elem.id"
                      :label="elem.name"
                      :value="elem.id + '_' + elem.name"
                    />
                  </el-select>
                  <el-input
                    v-else
                    v-model="formData.attributesObj[item.attributeId]"
                    clearable
                    placeholder="请输入"
                  />
                </el-form-item>
              </div>
            </div>
            <el-form-item label="package_weight" prop="packageWeight">
              <ZInputNumber
                v-model="formData.packageWeight"
                :precision="100"
                class="w180"
              />
            </el-form-item>
            <div class="disflex">
              <el-form-item
                label="package_length"
                prop="packageLength"
                class="mr20"
              >
                <ZInputNumber
                  v-model="formData.packageLength"
                  :precision="100"
                />
              </el-form-item>
              <el-form-item
                label="package_width"
                prop="packageWidth"
                class="mr20"
                required
              >
                <ZInputNumber
                  v-model="formData.packageWidth"
                  :precision="100"
                />
              </el-form-item>
              <el-form-item label="package_height" prop="packageHeight">
                <ZInputNumber
                  v-model="formData.packageHeight"
                  :precision="100"
                />
              </el-form-item>
            </div>
            <el-form-item label="图片" prop="mainImage">
              <div>
                <div class="disflex">
                  <el-button
                    type="primary"
                    class="mr20"
                    @click="handleFirstUrlDialog"
                    >首图水印</el-button
                  >
                  <el-button
                    type="primary"
                    class="mr20"
                    @click="handleOpenUrlDialog"
                    >网络图片</el-button
                  >
                  <el-upload
                    ref="uploadRef"
                    action
                    class="mr20"
                    :http-request="handleUpload"
                    :on-exceed="handleExceed"
                    :show-file-list="false"
                    :limit="MAX_IMAGE_LENGTH - formData.assitImageList?.length"
                    accept="image/*"
                    multiple
                  >
                    <el-button
                      :disabled="
                        !(MAX_IMAGE_LENGTH - formData.assitImageList?.length)
                      "
                      type="primary"
                      >本地图片</el-button
                    >
                  </el-upload>
                  <el-button type="primary" @click="handleTplImg"
                    >模板图片</el-button
                  >
                  <span class="ml20"
                    >！提示：点击图片拖动，即可调整图片顺序。图片最多添加9张。</span
                  >
                </div>
                <div class="detail_image">
                  <div class="detail_image_main">
                    <ImagePop
                      :src="formData.mainImage"
                      :width="'200px'"
                      :height="'200px'"
                    />
                  </div>
                  <div class="detail_image_assit">
                    <div
                      v-for="(item, index) in formData.assitImageList"
                      :key="item + index"
                    >
                      <div class="detail_image_assit_img">
                        <img
                          :id="index"
                          class="small_img"
                          :src="item"
                          draggable="true"
                          @dragstart="dragStart"
                          @drop="drop"
                          @dragover="dragover"
                        />
                      </div>
                      <div class="detail_image_assit_btns">
                        <el-button
                          link
                          type="primary"
                          @click="handleSetMainImg(item, index)"
                          >设为主图</el-button
                        >
                        <el-button
                          link
                          type="primary"
                          @click="handleRemoveImg(index)"
                          >移除</el-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              v-if="isSizeChartMandatory"
              label="尺寸图"
              prop="sizeChartImgUrl"
            >
              <SizeImage
                v-model="formData.sizeChartImgUrl"
                :form-ref="formRef"
                :table-data="fullSaleTableData"
                @get-table-data="getSaleTableData"
                @validate-image="formRef.validateField('sizeChartImgUrl')"
              />
            </el-form-item>
            <el-form-item label="销售信息">
              <div class="full_width detail_sales">
                <!-- <div class="disflex">
                  <el-form-item prop="siteList">
                    <span class="mr20">发布站点:</span>
                    <el-checkbox-group v-model="formData.siteList">
                      <el-checkbox
                        v-for="item in formData.prodListingTiktokLocalList"
                        :key="item.salesSite"
                        :label="item.salesSite"
                        name="type"
                        >{{ item.salesSite }}</el-checkbox
                      >
                    </el-checkbox-group>
                  </el-form-item>
                </div> -->
                <div class="sales_batch_btns">
                  <el-select
                    v-model="operatorType"
                    class="sales_batch_operator"
                  >
                    <el-option
                      v-for="item in OPERATOR_LIST"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                  <ZInputNumber
                    v-model="originalPrice"
                    class="w180 ml10"
                    :min="0"
                    placeholder="全球商品价格"
                    :precision="2"
                  />
                  <ZInputNumber
                    v-model="availableStock"
                    placeholder="刊登数量"
                    :min="0"
                    class="w180 ml10"
                  />
                  <el-button
                    type="primary"
                    size="small"
                    class="ml10"
                    @click="handlebatchApply"
                    >批量应用</el-button
                  >
                  <el-button
                    type="primary"
                    class="ml20"
                    size="small"
                    @click="handleAddTr"
                    >添加一行</el-button
                  >
                </div>
                <vxe-table
                  ref="saleTableRef"
                  :data="formData.prodListingSubSkuTiktokDtoList"
                  border
                  :row-config="{ isCurrent: true, isHover: true }"
                  :column-config="{ resizable: true }"
                >
                  <vxe-column title="图片" width="100" field="subImgUrl">
                    <template #default="{ row }">
                      <ImagePop :src="row.subImgUrl" />
                    </template>
                  </vxe-column>
                  <vxe-column title="商品子SKU" field="storeSSku">
                    <template #default="{ row }">
                      <el-input
                        v-if="row.isNewTr"
                        v-model="row.storeSSku"
                        placeholder="请输入商品子SKU"
                        @blur="handleSSkuChange(row)"
                      />
                      <div v-else>{{ row.storeSSku }}</div>
                    </template>
                  </vxe-column>
                  <!-- 销售属性 -->
                  <template
                    v-for="(item, index) in formData
                      ?.prodListingSubSkuTiktokDtoList[0]?.salesAttributeList"
                    :key="item.attributeId"
                    ><vxe-column>
                      <template #header="{ $table }">
                        <el-select
                          v-model="formData['attr' + index]"
                          filterable
                          @change="changeSaleAttr($table, index, $event)"
                        >
                          <el-option
                            v-for="elem in formData?.saleAttributes"
                            :key="elem.attributeId"
                            :disabled="
                              formData.disabledSaleAttr.includes(
                                elem.attributeId
                              )
                            "
                            :label="elem.attributeName"
                            :value="elem.attributeId"
                            ><template v-if="elem.isMandatory"
                              ><span style="float: left">{{
                                elem.attributeName
                              }}</span>
                              <span style="float: right; color: #909399"
                                >必选</span
                              ></template
                            ></el-option
                          >
                        </el-select>
                      </template>
                      <template #default="{ row }">
                        <template
                          v-if="
                            row['attrObj' + index]?.platCateAttrValueList
                              ?.length
                          "
                        >
                          <el-select
                            v-model="row['attr' + index]"
                            filterable
                            clearable
                            default-first-option
                            :reserve-keyword="false"
                            :allow-create="row['attrObj' + index]?.isCustomized"
                            :placeholder="
                              row['attrObj' + index]?.isCustomized
                                ? '请选择/输入'
                                : '请选择'
                            "
                          >
                            <el-option
                              v-for="elem in row['attrObj' + index]
                                ?.platCateAttrValueList"
                              :key="elem.id"
                              :label="elem.name"
                              :value="elem.id"
                            /> </el-select
                        ></template>
                        <template v-else>
                          <el-input
                            v-model="row['attr' + index]"
                            clearable
                            placeholder="请输入"
                          />
                        </template>
                      </template> </vxe-column
                  ></template>

                  <vxe-column title="全球商品价格" field="originalPrice">
                    <template #default="{ row }">
                      <div class="disCenter">
                        <span class="detail_dolloar flex_none">$</span>
                        <ZInputNumber
                          v-model="row.originalPrice"
                          :precision="2"
                        />
                      </div>
                    </template>
                  </vxe-column>
                  <vxe-column
                    title="站点价格(当地币种)"
                    field="originalPriceLocalList"
                  >
                    <template #default="{ row }">
                      <template
                        v-for="item in row.localPriceList"
                        :key="item.salesSite"
                      >
                        <div
                          v-if="formData.siteList.includes(item.salesSite)"
                          class="site_price disCenter"
                        >
                          <span class="flex_none">{{ item.salesSite }}: </span>
                          <span class="detail_dolloar flex_none">{{
                            item.currency
                          }}</span
                          ><ZInputNumber
                            v-model="item.localOriginalPrice"
                            :precision="2"
                          />
                        </div>
                      </template>
                    </template>
                  </vxe-column>
                  <vxe-column title="刊登数量" field="availableStock">
                    <template #default="{ row }">
                      <ZInputNumber v-model="row.availableStock" />
                    </template>
                  </vxe-column>
                  <vxe-column title="操作" width="120">
                    <template #default="{ row }">
                      <el-button
                        type="danger"
                        size="small"
                        @click="handleRemoveTr(row)"
                        >删除</el-button
                      >
                      <el-button
                        type="primary"
                        size="small"
                        @click="handleChangeSaleImg(row)"
                        >修改图片</el-button
                      >
                      <el-button
                        type="primary"
                        size="small"
                        @click="handleRemoveSaleImg(row)"
                        >移除图片</el-button
                      >
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
        <template #footer>
          <span v-if="status === 2 || status === 0">
            <el-button
              type="primary"
              :loading="publishLoading"
              @click="handlePublish(formRef)"
              >立即刊登</el-button
            >
            <el-button
              type="primary"
              :loading="saveLoading"
              @click="handleSave(formRef)"
              >保存</el-button
            >
            <el-button @click="dialogVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 本地图片 -->
    <el-dialog
      v-model="imgUrlVisible"
      width="600px"
      title="网络图片"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="imgUrls"
        type="textarea"
        :rows="9"
        placeholder="换行分割"
      />
      <template #footer>
        <el-button type="primary" @click="handleSaveUrl()">保存</el-button>
        <el-button @click="imgUrlVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 首图加水印 -->
    <el-dialog
      v-model="imgFirstUrlVisible"
      width="600px"
      title="首图添加水印"
      :close-on-click-modal="false"
    >
      <vxe-table :data="formData.watermarkList" border>
        <vxe-column title="店铺" field="storeAcct" />
        <vxe-column title="图片水印" width="180" field="subImgUrl">
          <template #default="{ row }">
            <el-select
              v-model="row.imgWatermark"
              clearable
              :disabled="row.imgWatermarkDis"
              @change="handleWatermarkSel()"
            >
              <el-option
                v-for="item in row.imgWatermarkList"
                :key="item.id"
                :value="item.id"
                :label="item.watermarkTemplateName"
              />
            </el-select>
          </template>
        </vxe-column>
        <vxe-column title="文字水印" width="180" field="subImgUrl">
          <template #default="{ row }">
            <el-select
              v-model="row.textWatermark"
              clearable
              :disabled="row.textWatermarkDis"
              @change="handleWatermarkSel()"
            >
              <el-option
                v-for="item in row.textWatermarkList"
                :key="item.id"
                :value="item.id"
                :label="item.watermarkTemplateName"
              />
            </el-select>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <el-button type="primary" @click="handleSaveWatermarkUrl()"
          >保存</el-button
        >
        <el-button @click="imgFirstUrlVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 销售上传图片 -->
    <UploadSaleImg
      v-model="saleImgVisible"
      :checked-sale-row="checkedSaleRow"
      @change-sale-img="changeSaleImg"
    />
    <!-- 模板图片 -->
    <ChooseTplImage
      v-model="tplImgVisible"
      :limit="remainderLimit"
      :params="tplImgParams"
      @get-tpl-img="getTplImg"
    />
  </div>
</template>

<script setup>
  import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch
  } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  import { MAX_IMAGE_LENGTH, OPERATOR_LIST } from '../config';
  import { isUrl } from '@/utils/is';
  import ImagePop from '@/components/ImagePop/index.vue';
  import Editor from '@/components/Editor/index.vue';
  import {
    listByStoreAcctIdAndPlatCode,
    batchFirstImageAddWatermark,
    getCateInfoApi,
    generateSkuByProdSSkuApi,
    editListingApi,
    getCategoryInfoApi
  } from '@/api/publishs/tiktokpublish';
  import UploadSaleImg from '../components/UploadSaleImg.vue';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  import SizeImage from './SizeImage.vue';
  import PlatTitle from '@/components/PlatTitle/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    status: {
      type: Number,
      default: 1
    },
    checkedRow: {
      type: Object,
      default: () => {}
    },
    tiktokList: {
      type: Object,
      default: () => {}
    }
  });

  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  let formData = ref({
    prodListingSubSkuTiktokDtoList: [],
    watermarkList: []
  });

  //富文本处理-ztt20230816
  const getTplImageParams = ref({});
  const productDescriptionCopy = ref('');
  const changeEditor = (html) => {
    productDescriptionCopy.value = html || '';
  };
  const transferParams = ref({
    storeAcctId: '',
    openId: '',
    imageUrl: ''
  });
  // 图片原始链接
  const getImageUrl = (url) => {
    transferParams.value.imageUrl = url;
  };

  // 获取字符串中图片数量
  const countImages = (str) => {
    var imgRegex = /<img[^>]+>/g;
    var matches = str.match(imgRegex);
    if (matches) {
      return matches.length;
    } else {
      return 0;
    }
  };
  onMounted(() => {
    formData.value = JSON.parse(JSON.stringify(props.checkedRow));
    transferParams.value.storeAcctId = formData.value.storeAcctId;
    productDescriptionCopy.value = formData.value.description
      .replaceAll('<div>', '<p>')
      .replaceAll('</div>', '</p>');
    formData.value.description = productDescriptionCopy.value;
    formData.value.attributesObj = {};
    formData.value.attributes = [];
    // 富文本的模板图片参数
    getTplImageParams.value = {
      platCode: 'tiktok',
      prodSSkus: formData.value.prodListingSubSkuTiktokDtoList
        .map((item) => item.prodSSku)
        .filter(Boolean)
    };
  });
  onUnmounted(() => {
    if (needFresh.value) {
      emits('handleSearch');
    }
    needFresh.value = false;
  });
  // watch(
  //   () => dialogVisible.value,
  //   (val) => {
  //     if (val) {
  //       formData.value = JSON.parse(JSON.stringify(props.checkedRow));
  //       transferParams.value.storeAcctId = formData.value.storeAcctId;
  //       formData.value.attributesObj = {};
  //       formData.value.attributes = [];
  //     } else {
  //       if (needFresh.value) {
  //         emits('handleSearch');
  //       }
  //       needFresh.value = false;
  //       formRef.value.resetFields();
  //       formData.value = {};
  //       cascaderPanelRef.value = null;
  //       formData.value.prodListingSubSkuTiktokDtoList = [];
  //       deleteSubIdList.value = [];
  //       operatorType.value = '+';
  //       originalPrice.value = null;
  //       availableStock.value = null;
  //     }
  //   }
  // );
  // 是否支持尺码图
  const isSizeChartMandatory = ref(false);
  const getCategoryInfo = (platCateId, isClickCate) => {
    getCategoryInfoApi(platCateId).then((res) => {
      isSizeChartMandatory.value = res.data?.isSizeChartMandatory;
      if (isSizeChartMandatory.value) {
        formRules.value.sizeChartImgUrl[0].required = true;
      } else {
        formRules.value.sizeChartImgUrl[0].required = false;
      }
      if (isClickCate) {
        formData.value.sizeChartImgUrl = '';
      }
    });
  };
  watch(
    () => formData.value.platCateId,
    async (val, oldVal) => {
      if (dialogVisible.value) {
        let platCateId = null;
        if (Array.isArray(val)) {
          platCateId = val[val.length - 1];
        } else {
          platCateId = val;
        }

        // 获取当前类目信息
        getCategoryInfo(platCateId, Array.isArray(val));

        // 避免渲染出问题
        formData.value.attributes = [];
        const { data } = await getCateInfoApi(platCateId);
        await nextTick();
        // 产品属性
        formData.value.attributes = data
          .filter((item) => item.attributeType === 3)
          .map((item) => ({
            ...item,
            platCateAttrValueList: item.platCateAttrValueList || []
          }));
        // 销售属性
        formData.value.saleAttributes = data
          .filter((item) => item.attributeType === 2)
          .map((item) => ({
            ...item,
            platCateAttrValueList: item.platCateAttrValueList || []
          }));

        // 销售属性
        const { fullData } = saleTableRef.value.getTableData();

        // 初始化赋值
        if (oldVal === undefined) {
          // 产品属性
          let productAttributeObj = {};
          formData.value?.productAttributeList?.forEach((item) => {
            productAttributeObj[Number(item.attributeId)] =
              item.attributeValues;
          });
          formData.value.attributes?.forEach((item) => {
            if (productAttributeObj[item.attributeId]) {
              if (item?.platCateAttrValueList?.length) {
                if (item.isMultipleSelected) {
                  formData.value.attributesObj[item.attributeId] =
                    productAttributeObj[item.attributeId].map(
                      (item) => Number(item.valueId) + '_' + item.valueName
                    );
                } else {
                  const curAttr = productAttributeObj[item.attributeId][0];
                  formData.value.attributesObj[item.attributeId] =
                    Number(curAttr.valueId) + '_' + curAttr.valueName;
                }
              } else {
                formData.value.attributesObj[item.attributeId] =
                  productAttributeObj[item.attributeId][0].valueName;
              }
            }
          });

          // 销售属性
          // 通过第一行销售信息
          fullData.forEach((row) => {
            if (row?.salesAttributeList?.length) {
              fullData[0]?.salesAttributeList?.forEach((_, itemIndex) => {
                row['attrObj' + itemIndex] =
                  formData.value.saleAttributes.filter(
                    (elem) =>
                      Number(elem.attributeId) ===
                      Number(formData.value['attr' + itemIndex])
                  )[0];
                const curRowAttrVal = row.salesAttributeList.filter(
                  (elem) =>
                    elem.attributeId ===
                    Number(formData.value['attr' + itemIndex])
                );
                if (
                  row?.['attrObj' + itemIndex]?.platCateAttrValueList?.length
                ) {
                  row['attr' + itemIndex] = curRowAttrVal.map(
                    (elem) => elem.customValue
                  );
                } else {
                  row['attr' + itemIndex] = curRowAttrVal?.[0]?.customValue;
                }
              });
            }
          });
        } else {
          formData.value.attributes?.forEach((item) => {
            formData.value.attributesObj[item.attributeId] = null;
            const { saleAttributes } = formData.value;
            // 将表头选中的销售属性的值清空
            Object.keys(formData.value).forEach((item) => {
              const _columnAttrIndex = item.replace(/[^\d]/g, '');
              if (item.includes('attr') && item.length === 5) {
                if (Array.isArray(val)) {
                  // 如果之前选中的销售值不存在于现在的销售属性枚举里，就赋值为空
                  const isExistCurSaleAttr = saleAttributes.filter(
                    (elem) => elem.attributeId === formData.value[item]
                  ).length;
                  if (!isExistCurSaleAttr) {
                    formData.value[item] = null;
                    fullData?.forEach((row) => {
                      row['attr' + _columnAttrIndex] = null;
                      row['attrObj' + _columnAttrIndex] = null;
                    });
                  }
                }
              }
            });
          });
        }
        // 校验 产品属性
        Object.keys(formRules.value).forEach((item) => {
          if (Number(item)) {
            formRules.value[item] = null;
          }
        });
        formData.value.attributes?.forEach((item) => {
          if (item.isMandatory) {
            let message = item?.platCateAttrValueList?.length
              ? `请选择${item.attributeName}`
              : `请输入${item.attributeName}`;
            formRules.value[item.attributeId.toString()] = [
              {
                required: true,
                trigger: 'change',
                message,
                validator: (rule, value, callback) => {
                  if (
                    Array.isArray(
                      formData.value.attributesObj[item.attributeId]
                    )
                  ) {
                    if (
                      !formData.value.attributesObj[item.attributeId].length
                    ) {
                      callback(message);
                    } else {
                      callback();
                    }
                    callback();
                  } else {
                    if (!formData.value.attributesObj[item.attributeId]) {
                      callback(message);
                    } else {
                      callback();
                    }
                  }
                }
              }
            ];
          }
        });
      }
    }
  );

  const formRef = ref();
  const needFresh = ref(false);
  const validateProductName = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入全球商品标题'));
    } else {
      if (value.length > 255) {
        callback(new Error(`全球商品标题长度超出${value.length - 255}`));
      }
      callback();
    }
  };
  const validateSizeChartImgUrl = (rule, value, callback) => {
    if (isSizeChartMandatory.value && !value) {
      callback('请上传尺寸图');
    } else {
      callback();
    }
  };
  const formRules = ref({
    productName: [
      { required: true, trigger: 'change', validator: validateProductName },
      { required: true, trigger: 'blur', validator: validateProductName }
    ],
    packageWeight: [
      { required: true, trigger: 'blur', message: '请输入包装重量' }
    ],
    packageHeight: [
      { required: true, trigger: 'blur', message: '请输入包装高度' }
    ],
    packageWidth: [
      { required: true, trigger: 'blur', message: '请输入包装宽度' }
    ],
    packageLength: [
      { required: true, trigger: 'blur', message: '请输入包装长度' }
    ],
    // siteList: [
    //   { required: true, trigger: 'change', message: '发布站点至少选择一个' }
    // ],
    sizeChartImgUrl: [{ trigger: 'change', validator: validateSizeChartImgUrl }]
  });
  const deleteSubIdList = ref([]); // 删除的子sku刊登id, 仅在移除子商品时需要
  const operatorType = ref('+');
  const originalPrice = ref();
  const availableStock = ref();

  // 立即刊登
  const publishLoading = ref(false);
  const handlePublish = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        const params = verifyParams(1);
        if (typeof params === 'string') return ElMessage.warning(params);
        try {
          if (countImages(params.description) > 30) {
            return ElMessage.error('上传图片限制在30张以内');
          }
          publishLoading.value = true;
          const { msg } = await editListingApi(params);
          ElMessage.success(msg || '操作成功');
          needFresh.value = true;
          dialogVisible.value = false;
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          publishLoading.value = false;
        }
      }
    });
  };

  // 保存
  const saveLoading = ref(false);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        const params = verifyParams(0);
        if (typeof params === 'string') return ElMessage.warning(params);
        try {
          if (countImages(params.description) > 30) {
            return ElMessage.error('上传图片限制在30张以内');
          }
          saveLoading.value = true;
          const { msg } = await editListingApi(params);
          ElMessage.success(msg || '操作成功');
          dialogVisible.value = false;
          needFresh.value = true;
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          saveLoading.value = false;
        }
      }
    });
  };
  // 验证 是否保存后立即刊登, 1立即刊登, 0仅保存
  const verifyParams = (publishNow) => {
    const params = {};
    params.listingId = formData.value.listingId;
    params.productName = formData.value.productName;
    // TK平台不识别p标签 需要转换
    params.description = productDescriptionCopy.value
      .replaceAll('<p>', '<div>')
      .replaceAll('</p>', '</div>')
      .replace(/<img([^>]+)>/g, (match, attributes) => {
        const srcMatch = attributes.match(/src="([^"]+)"/);
        const src = srcMatch ? srcMatch[1] : '';
        return `<img src="${src}">`;
      })
      .replaceAll('<img src="">', '');
    const { platCateId } = formData.value;
    params.platCateId = Array.isArray(platCateId)
      ? platCateId[platCateId.length - 1]
      : platCateId;
    params.packageWeight = formData.value.packageWeight;
    params.packageHeight = formData.value.packageHeight;
    params.packageWidth = formData.value.packageWidth;
    params.packageLength = formData.value.packageLength;
    const imgUrlList = JSON.parse(
      JSON.stringify(formData.value.assitImageList)
    );
    imgUrlList.unshift(formData.value.mainImage);
    if (!imgUrlList.length) return '请上传图片';
    // 产品属性
    const { attributesObj } = formData.value;
    const productAttributes = [];
    Object.keys(attributesObj)?.forEach((item) => {
      if (attributesObj[item] !== undefined && attributesObj[item] !== null) {
        let productAttrObj = {};
        productAttrObj.attributeId = item;
        productAttrObj.attributeValues = [];
        let curAttributesObj = JSON.parse(JSON.stringify(attributesObj[item]));
        if (!Array.isArray(attributesObj[item])) {
          curAttributesObj = [curAttributesObj];
        }
        curAttributesObj?.forEach((elem) => {
          const valNameArr = elem.split('_');
          productAttrObj.attributeValues.push({
            valueId: elem.includes('_') ? valNameArr[0] : null,
            valueName: elem.includes('_') ? valNameArr.slice(1).join('') : elem
          });
        });
        productAttributes.push(productAttrObj);
      }
    });
    //站点
    const { prodListingTiktokLocalList, siteList } = formData.value;
    const publishSiteList = [];
    prodListingTiktokLocalList?.forEach((item) => {
      const status = siteList.includes(item.salesSite);
      publishSiteList.push({ status, id: item.id });
    });

    // 尺寸图
    if (!isSizeChartMandatory.value) {
      params.sizeChartImgUrl = '';
    } else {
      params.sizeChartImgUrl = formData.value.sizeChartImgUrl;
    }

    // 销售属性 是否选择属性
    let saleAttrTag = '';
    const { saleAttributes } = formData.value;
    const saleMandatoryAttrList = saleAttributes
      .filter((item) => item.isMandatory)
      .map((item) => item.attributeId);
    Object.keys(formData.value)?.forEach((item) => {
      if (item.includes('attr') && item.length === 5) {
        if (
          formData.value[item] === undefined ||
          formData.value[item] === null
        ) {
          saleAttrTag = '请选择平台属性名称';
        } else if (
          saleMandatoryAttrList.length &&
          !saleMandatoryAttrList.includes(formData.value[item])
        ) {
          // 必选
          saleAttrTag = '请选择平台必选属性名称';
        }
      }
    });
    if (saleAttrTag) return saleAttrTag;
    //销售属性
    const $table = saleTableRef.value;
    const { fullData } = $table.getTableData();
    let saleTag = null;
    const subDtoList = [];
    fullData?.forEach((item, trIndex) => {
      let salesAttributeList = [];
      // 本来应该用item,因为后端现在每行的salesAttributeList长度不一样，所以采取第一行的salesAttributeList的长度
      fullData[0].salesAttributeList?.forEach((_, index) => {
        if (!item['attr' + index])
          saleTag = `请将第${trIndex + 1}行${
            item['attrObj' + index]?.attributeName
          }必需填写`;
        salesAttributeList.push({
          attributeId: item['attrObj' + index]?.attributeId,
          attributeName: item['attrObj' + index]?.attributeName,
          customValue: item['attr' + index]
        });
      });
      if ([undefined, null, ''].includes(item.availableStock))
        saleTag = `第${trIndex + 1}行刊登数量必填`;
      item?.localPriceList?.forEach((val) => {
        if (
          formData.value.siteList.includes(val.salesSite) &&
          [undefined, null, ''].includes(val.localOriginalPrice)
        ) {
          saleTag = `第${trIndex + 1}行的${val.salesSite}站点价格必填`;
        }
      });
      if ([undefined, null, ''].includes(item.originalPrice))
        saleTag = `第${trIndex + 1}行全球商品价格必填`;
      if ([undefined, null, ''].includes(item.storeSSku))
        saleTag = `第${trIndex + 1}行商品子sku必填`;
      if ([undefined, null, ''].includes(item.subImgUrl))
        saleTag = `请上传第${trIndex + 1}行的图片`;
      subDtoList.push({ ...item, salesAttributeList });
    });
    if (saleTag) return saleTag;

    Object.assign(params, {
      publishNow,
      imgUrlList,
      deleteSubIdList: deleteSubIdList.value,
      publishSiteList,
      productAttributes,
      subDtoList
    });
    return params;
  };

  // 图片
  // 本地上传
  const uploadRef = ref();
  const handleUpload = (rawFile) => {
    blobToDataURL(rawFile.file, function (base64) {
      const fd = new FormData();
      fd.append('AreaImgKey', base64);
      axios({
        method: 'post',
        url: '/api/lms/preProdDev/getBase64Img.html',
        data: fd
      })
        .then(({ data, status, statusText }) => {
          if (status === 200) {
            formData.value.assitImageList.push(data);
          } else {
            throw statusText;
          }
        })
        .catch(() => {
          ElMessage.error('上传图片失败');
        })
        .finally(() => {
          // loadingInstance.close()
          uploadRef.value.clearFiles();
        });
    });
  };
  const handleExceed = () => {
    ElMessage.warning('最多支持九张图片上传');
  };
  //blob转换成base64
  const blobToDataURL = (blob, callback) => {
    let a = new FileReader();
    a.onload = function (e) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  };
  // 首图水印
  const imgFirstUrlVisible = ref(false);
  const handleFirstUrlDialog = async () => {
    const { data } = await listByStoreAcctIdAndPlatCode({
      platCode: 'tiktok',
      storeAcctIdList: [transferParams.value.storeAcctId]
    });
    if (data.length != 0) {
      formData.value.watermarkList = [
        {
          storeAcct: data[0]['storeAcct'],
          textWatermarkList: data.filter((item) => item.watermarkType == true),
          imgWatermarkList: data.filter((item) => item.watermarkType != true)
        }
      ];
    } else {
      formData.value.watermarkList = [];
    }

    imgFirstUrlVisible.value = true;
  };
  const handleSaveWatermarkUrl = async () => {
    if (
      formData.value.watermarkList.length == 0 ||
      !(
        formData.value?.watermarkList[0]?.imgWatermark ||
        formData.value?.watermarkList[0]?.textWatermark
      )
    ) {
      return ElMessage.warning('请选择需要添加的水印');
    }
    const { code, data, msg } = await batchFirstImageAddWatermark([
      {
        mainImgUrl: formData.value.mainImage,
        watermarkId:
          formData.value.watermarkList[0].imgWatermark ||
          formData.value.watermarkList[0].textWatermark,
        prodPSku: formData.value.prodPSku
      }
    ]);
    if (code == '0000' && data[0].operateStatus == false) {
      ElMessage.danger(data[0].operateMessage);
    } else {
      ElMessage.success(msg);
      formData.value.mainImage = data[0].watermarkImageUrl;
    }
    imgFirstUrlVisible.value = false;
  };
  const handleWatermarkSel = () => {
    if (
      formData.value.watermarkList[0].textWatermark &&
      formData.value.watermarkList[0].textWatermark != ''
    ) {
      formData.value.watermarkList[0].imgWatermarkDis = true;
    } else if (
      formData.value.watermarkList[0].imgWatermark &&
      formData.value.watermarkList[0].imgWatermark != ''
    ) {
      formData.value.watermarkList[0].textWatermarkDis = true;
    } else {
      formData.value.watermarkList[0].textWatermarkDis = false;
      formData.value.watermarkList[0].imgWatermarkDis = false;
    }
  };

  // 网络地址
  const imgUrlVisible = ref(false);
  const imgUrls = ref('');
  const handleOpenUrlDialog = () => {
    imgUrlVisible.value = true;
  };
  watch(
    () => imgUrlVisible.value,
    (val) => {
      if (!val) {
        imgUrls.value = '';
      }
    }
  );
  const handleSaveUrl = () => {
    const imgList = imgUrls.value.split('\n').filter((item) => !!item);
    if (
      MAX_IMAGE_LENGTH - imgList.length - formData.value.assitImageList.length <
      0
    ) {
      return ElMessage.warning('最多支持九张图片上传');
    }
    // 判断url是否合法
    if (imgList.some((item) => !isUrl(item))) {
      return ElMessage.warning('输入地址不合法');
    }
    formData.value.assitImageList.push(...imgList);
    imgUrlVisible.value = false;
  };

  // 模板图片
  const tplImgVisible = ref(false);
  const remainderLimit = ref(0);
  const tplImgParams = ref({});
  const handleTplImg = () => {
    remainderLimit.value =
      MAX_IMAGE_LENGTH - formData.value.assitImageList.length;
    if (remainderLimit.value < 1) {
      return ElMessage.warning('最多支持九张图片上传');
    }
    tplImgVisible.value = true;
    const { fullData } = saleTableRef.value.getTableData();
    tplImgParams.value = {
      platCode: 'tiktok',
      prodSSkus: fullData.map((item) => item.prodSSku).filter((item) => !!item)
    };
  };
  const getTplImg = (imgUrlList) => {
    formData.value.assitImageList.push(...imgUrlList);
  };

  const dropEl = reactive({
    startEl: null, // 拖动开始的元素
    endEl: null // 拖动的结束元素
  });
  const dragStart = (e) => {
    dropEl.startEl = e.target || e.srcElement;
  };

  const dragover = (e) => {
    e.preventDefault();
  };

  const drop = (e) => {
    dropEl.endEl = e.target || e.srcElement;
    e.preventDefault();
    // 拖动元素，放置目标
    if (dropEl.startEl && dropEl.endEl) {
      // 交换
      let startI = dropEl.startEl.id;
      let endI = dropEl.endEl.id;
      formData.value.assitImageList[startI] = dropEl.endEl.src;
      formData.value.assitImageList[endI] = dropEl.startEl.src;
    }
  };

  // 设为主图
  const handleSetMainImg = (url, index) => {
    // 当前图与主图互换
    const { mainImage } = formData.value;
    formData.value.assitImageList.splice(index, 1, mainImage);
    formData.value.mainImage = url;
  };

  // 移除图片
  const handleRemoveImg = (index) => {
    formData.value.assitImageList.splice(index, 1);
  };

  // 获取table数据
  const fullSaleTableData = ref([]);
  const getSaleTableData = () => {
    const { fullData } = saleTableRef.value.getTableData();
    fullSaleTableData.value = fullData;
  };

  // 销售信息
  const saleTableRef = ref();
  //销售属性禁止 和 对应的属性值
  const changeSaleAttr = ($table, attrIndex, curVal) => {
    let arr = [];
    const { fullData } = $table.getTableData();
    Object.keys(formData.value)?.forEach((item) => {
      if (item.includes('attr') && item.length === 5) {
        arr.push(formData.value[item]);
      }
    });

    // 更改相关值
    fullData?.forEach((row) => {
      row['attr' + attrIndex] = null;
      const curAttrInfo = formData.value.saleAttributes.filter(
        (elem) => Number(elem.attributeId) === Number(curVal)
      )[0];
      // 将行的salesAttributeList
      if (row?.salesAttributeList?.length) {
        const lastAttributeId = Number(row['attrObj' + attrIndex]?.attributeId);
        row?.salesAttributeList?.forEach((item) => {
          if (Number(item.attributeId) === lastAttributeId) {
            item.attributeId = curVal;
            item.attributeName = curAttrInfo.attributeName;
            item.customValue = null;
          }
        });
      }
      row['attrObj' + attrIndex] = curAttrInfo;
    });
    formData.value.disabledSaleAttr = arr;
  };
  // 批量应用
  const handlebatchApply = () => {
    if (
      [undefined, null, ''].includes(originalPrice.value) &&
      [undefined, null, ''].includes(availableStock.value)
    )
      return ElMessage.warning('请输入数据');
    const $table = saleTableRef.value;
    const { fullData } = $table.getTableData();
    if (!fullData.length) return ElMessage.warning('请添加行');
    const _tableData = fullData.map((item) => ({
      ...item,
      originalPrice: calculateOriginalPrice(item.originalPrice),
      availableStock: ![undefined, null, ''].includes(availableStock.value)
        ? availableStock.value
        : item.availableStock
    }));
    $table.reloadData(_tableData);
  };

  const calculateOriginalPrice = (val) => {
    if (
      [null, undefined, ''].includes(val) ||
      [null, undefined, ''].includes(operatorType.value)
    )
      return;
    // 如果批量处理中全球商品价格的加数不存在时，返回表格里的原值
    if ([null, undefined, ''].includes(originalPrice.value)) return val;
    const _val = Number(val);
    if (operatorType.value === '=') {
      return originalPrice.value.toFixed(2);
    } else if (operatorType.value === '+') {
      return (_val + originalPrice.value).toFixed(2);
    } else if (operatorType.value === '-') {
      return (_val - originalPrice.value).toFixed(2);
    } else if (operatorType.value === '*') {
      return (_val * originalPrice.value).toFixed(2);
    }
  };
  // 添加行 刊登数量默认9999
  const handleAddTr = () => {
    const $table = saleTableRef.value;
    const { fullData } = $table.getTableData();
    let attrObj = {};
    const localPriceList = fullData[0].localPriceList.map((item) => ({
      ...item,
      localOriginalPrice: null
    }));
    Object.keys(fullData[0])?.forEach((item) => {
      if (item.includes('attrObj')) {
        attrObj[item] = fullData[0][item];
      }
    });
    $table.insertAt(
      { availableStock: 9999, ...attrObj, localPriceList, isNewTr: true },
      -1
    );
  };
  // 移除行
  const handleRemoveTr = (row) => {
    const $table = saleTableRef.value;
    if (!row.isNewTr) {
      deleteSubIdList.value.push(row.id);
    }
    $table.remove(row);
  };
  // 修改图片
  const saleImgVisible = ref(false);
  const checkedSaleRow = ref({});
  const handleChangeSaleImg = (row) => {
    saleImgVisible.value = true;
    checkedSaleRow.value = row;
  };
  const changeSaleImg = ({ row, saleImgUrl }) => {
    row.subImgUrl = saleImgUrl;
  };
  // 移除图片
  const handleRemoveSaleImg = (row) => {
    row.subImgUrl = null;
  };
  //商品子SKU输入后，根据商品子SKU信息调用定价公式，自动计算出全球商品价格和站点价格
  const handleSSkuChange = async (row) => {
    if (!row.storeSSku) return;
    try {
      const { platCateId } = formData.value;
      const _platCateId = Array.isArray(platCateId)
        ? platCateId[platCateId.length - 1]
        : platCateId;
      const { data, msg } = await generateSkuByProdSSkuApi({
        prodSSku: row.storeSSku,
        platCateId: _platCateId,
        listingId: formData.value.listingId
      });
      const salesAttributeObj = {};
      data.salesAttributeList?.forEach((v) => {
        salesAttributeObj[v.attributeId] = v;
      });
      Object.keys(row)?.forEach((item) => {
        if (
          item.includes('attrObj') &&
          salesAttributeObj[row[item].attributeId]
        ) {
          // 销售属性赋自定义值
          row['attr' + item.slice(7)] =
            salesAttributeObj[row[item].attributeId]?.customValue || '';
        }
      });
      Object.assign(row, data);
      ElMessage.success(msg);
      // 输入sku后，富文本的模板图片参数变化
      const { fullData } = saleTableRef.value.getTableData();
      getTplImageParams.value = {
        platCode: 'tiktok',
        prodSSkus: fullData.map((item) => item.prodSSku).filter(Boolean)
      };
    } catch (err) {
      row.storeSSku = '';
      console.log('err :>> ', err);
    }
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .site_price + .site_price {
    margin-top: 5px;
  }
  .flex_none {
    flex: none;
  }
  .disCenter {
    display: flex;
    align-items: center;
  }
  .ml10 {
    margin-left: 10px;
  }
</style>
