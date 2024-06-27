<template>
  <div class="detail_wrapper">
    <el-dialog
      v-model="dialogVisible"
      title="刊登"
      :align-center="true"
      width="90%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="handleClose"
    >
      <el-form
        ref="detailFormRef"
        v-loading="initLoading"
        :model="formData"
        :rules="formRule"
        :scroll-to-error="true"
        size="default"
        status-icon
        :label-width="180"
        class="dialog_form"
      >
        <el-tabs v-model="curTab">
          <el-tab-pane label="商品信息" name="info">
            <el-divider content-position="left"><h3>基础信息</h3></el-divider>
            <el-form-item label="商品标题" prop="title" class="info_title">
              <PlatTitle
                v-model="formData.title"
                :custom-type="'text'"
                :content-top="50"
                :max-length="128"
                :clearable="true"
                :input-width="'100%'"
                :show-word-limit="true"
                :prod-p-id="formData.prodPId"
              />
              <el-button
                type="primary"
                class="ml10"
                :loading="randomTitleLoading"
                @click="handleRandomTile"
                >重新生成</el-button
              >
              <el-button @click="handleRegenTitle">还原</el-button>
            </el-form-item>
            <el-form-item label="SMT分类" prop="smtCategoryName">
              <el-input v-model="formData.smtCategoryName" disabled />
            </el-form-item>
            <el-divider content-position="left"><h3>分类属性</h3></el-divider>
            <AttrInfo
              :attr-list="attrListObj.brand"
              :sync-brand-loading="syncBrandLoading"
              @handle-sync-brand="handleSyncBrand"
              @handle-second-attr="handleSecondAttr"
            />
            <AttrInfo
              :attr-list="attrListObj.requiredAttrList"
              @handle-second-attr="handleSecondAttr"
            />
            <el-link
              type="primary"
              :underline="false"
              @click="handleShowNotRequiredAttr"
              >{{ showNotRequiredAttr ? '收起' : '展开' }}选填属性</el-link
            >
            <AttrInfo
              v-if="showNotRequiredAttr"
              :attr-list="attrListObj.notRequiredAttrList"
              @handle-second-attr="handleSecondAttr"
            />
            <el-form-item label="自定义属性">
              <div>
                <div>
                  <el-button type="primary" @click="handleAddCustomAttr"
                    >添加自定义属性</el-button
                  >
                  <el-button type="danger" @click="handleDelAllCustomAttr"
                    >删除全部</el-button
                  >
                </div>
                <div
                  v-for="item in customAtrrList"
                  :key="item.id"
                  class="custom_attr"
                >
                  <el-input
                    v-model="item.attr"
                    clearable
                    class="mr10"
                    :maxlength="70"
                    show-word-limit
                    placeholder="字数不超过70"
                  />
                  <el-input
                    v-model="item.attrValue"
                    clearable
                    class="ml10 mr10"
                    :maxlength="70"
                    show-word-limit
                    placeholder="字数不超过70"
                  />
                  <el-button type="danger" @click="handleDelCustomAttr(item.id)"
                    >删除</el-button
                  >
                </div>
              </div>
            </el-form-item>
            <el-divider content-position="left"><h3>商品图片</h3></el-divider>
            <ImageInfo
              :main-images="formData.mainImages"
              :market1-images="formData.market1Images"
              :market2-images="formData.market2Images"
              :full-table-data="fullTableData"
              @get-table-data="getTableData"
              @change-image="changeImage"
            />
            <el-divider content-position="left"><h3>商品视频</h3></el-divider>
            <div>
              （视频时长不超过180s，不超过500M，支持mp4,wmv,avi,mpg,flv,mov,3gp格式，建议视频比例16:9和1:1，建议最小分辨率≥720p）
            </div>
            <div style="height: 200px">
              <el-radio-group
                v-model="formData.isVideo"
                style="font-size: 14px"
              >
                <el-radio :value="true" size="large"> {{ '' }}</el-radio>
                <div v-if="!formData.videoFileUrl">模板暂无可用视频</div>
                <div v-else>
                  <video
                    width="150"
                    height="150"
                    controls
                    :src="formData.videoFileUrl"
                  ></video>
                  <div
                    style="
                      width: 150px;
                      text-align: center;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                    "
                  >
                    {{ formData.videoFileName }}
                  </div>
                </div>
                <div style="text-align: center; margin: 10px">
                  <div>
                    <el-button type="primary"
                      ><el-upload
                        action="/api/lms/aliexpressFullmanage/listing/uploadVideo"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-error="handleAvatarError"
                        :before-upload="beforeAvatarUpload"
                        >本地上传
                      </el-upload></el-button
                    >
                  </div>
                  <div style="margin-top: 10px">
                    <el-button type="primary" @click="openVideoCenter"
                      >从媒体中心选择</el-button
                    >
                  </div>
                </div>
                <el-radio :value="false" size="large">取消上传视频</el-radio>
              </el-radio-group>
            </div>
            <el-divider content-position="left"><h3>其它信息</h3></el-divider>
            <el-form-item label="备货类型" prop="productType">
              <el-radio-group v-model="formData.productType" class="ml-4">
                <el-radio :value="true" size="large">国内履约</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="最小计量单位" prop="productUnit">
              <el-select
                v-model="formData.extra.productUnit"
                clearable
                filterable
              >
                <el-option
                  v-for="item in MIN_UNIT_LIST"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
              /></el-select>
            </el-form-item>
            <el-form-item label="销售方式" class="sale_way" prop="lotNum">
              <el-checkbox
                v-model="formData.extra.packageType"
                label="打包出售"
              />
              <span>(勾选打包出售后),</span>
              <span class="mr10">每包</span>
              <ZInputNumber v-model="formData.extra.lotNum" />
              <span class="ml10">(选择打包出售的情况下,每包数量必须大于1)</span>
            </el-form-item>
            <!-- <el-form-item label="关联欧盟责任人" prop="euInfo">
              <el-select v-model="formData.extra.msrEuId">
                <el-option
                  v-for="item in EUResponsibleOption || []"
                  :key="item.msrEuId"
                  :label="item.name"
                  :value="item.msrEuId"
              /></el-select>
            </el-form-item> -->
            <el-divider content-position="left"><h3>变种信息</h3></el-divider>
            <SkuInfo
              ref="skuInfoRef"
              :table-data-copy="formData.aliexpressFullmanageListingSkuDtoList"
              :product-type="formData.productType"
              :prod-p-id="formData.prodPId"
              :main-images-list="formData.mainImages"
              :sku-attr="attrListObj.skuAttr"
              :gross-rate="formData.grossRate"
              :smt-category-id="formData.smtCategoryId"
              :jit-stock-safety-threshold="formData.jitStockSafetyThreshold"
              @change-image="changeImage"
            />
          </el-tab-pane>
          <el-tab-pane label="产品详情描述" name="desc">
            <DescInfo
              ref="descRef"
              :store-acct-id="storeAcctId"
              :desc-obj="descObj"
              :full-table-data="fullTableData"
              @get-table-data="getTableData"
              @change-desc="changeDesc"
            />
          </el-tab-pane>
          <el-tab-pane label="欧盟责任人和商品资质" name="ProductQualify">
            <el-form-item label="关联欧盟责任人" prop="euInfo">
              <el-select v-model="formData.extra.msrEuId">
                <el-option
                  v-for="item in formData.euInfo?.euContactModuleList
                    ?.euContactModule || []"
                  :key="item.msrEuId"
                  :label="item.name"
                  :value="item.msrEuId"
              /></el-select>
              <el-button type="primary" @click="syncEuInfo">同步</el-button>
            </el-form-item>
            <el-form-item v-if="getQualifications.length" label="资质信息">
              <span style="color: #f1c012"
                >如果你在以下国家售卖商品，请提交该国家要求的商品资质，否则商品可能无法在该国家展示</span
              >
            </el-form-item>
            <hr />
            <div
              v-for="(item, index) in getQualifications"
              :key="index"
              style="margin-left: 200px"
            >
              <h1 v-if="item.header" style="font-size: 16px; color: #000">
                {{ item.header }}
              </h1>
              <div style="display: flex; margin: 20px">
                <span v-if="item.required" style="color: red; font-size: 20px"
                  >*</span
                >
                <span>{{ item.label }}</span>
                <div v-if="item.qualificationType == 'image'">
                  <el-upload
                    action
                    :http-request="(file) => handleUpload(file, index)"
                    :show-file-list="false"
                    style="
                      margin: 0 20px;
                      vertical-align: top;
                      display: inline-block;
                    "
                    ><el-button type="primary" size="small"
                      >上传本地文件</el-button
                    ></el-upload
                  >
                  <div style="display: inline-block; text-align: center">
                    <ImagePop :src="item.qualificationValue" />
                    <span
                      v-if="item.qualificationValue"
                      style="color: red"
                      @click="item.qualificationValue = ''"
                      >删除</span
                    >
                  </div>
                </div>
                <el-input
                  v-else
                  v-model="item.qualificationValue"
                  style="width: 85%"
                  type="textarea"
                />
              </div>
              <div style="color: #f1c012; margin: 10px 20px">
                {{ item.tips }}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <template v-if="[-2, 0, 2].includes(listingStatus)">
          <!-- <el-button
            type="primary"
            :loading="saveLoading"
            @click="handleSave(detailFormRef)"
            >立即刊登</el-button
          > -->
          <el-button
            type="primary"
            :loading="saveLoading"
            :disabled="initLoading"
            @click="handleSave(detailFormRef, 'save')"
            >保存</el-button
          >
          <el-button
            type="primary"
            :loading="saveLoading"
            :disabled="initLoading"
            @click="handleSave(detailFormRef, 'saveandpublish')"
            >保存并发布</el-button
          >
        </template>
        <el-button @click="handleClose">关闭</el-button>
      </template>
    </el-dialog>
    <VideoCenter
      v-if="openVideoCenterVisible"
      open-video-center-visible="openVideoCenterVisible"
      :store-acct-id="storeAcctId"
      @close="videoCenterClose"
      @video-selected="videoSelected"
    />
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import {
    queryAliexpressVideoInfo,
    getInfoApi,
    getRandomTitleApi,
    getCateAttrApi,
    syncBrandAttrApi,
    savePublishInfoApi,
    getQualificationsByStoreAcctIdAndCategoryId,
    syncOneEuResponsibleByStoreAcctIdAndCategoryId,
    saveAndPublishListingApi,
    getDefaultQualificationImage
  } from '@/api/publishs/aefullyhostedpublish';
  import { MIN_UNIT_LIST } from '../constants';
  import { ElMessage } from 'element-plus';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import AttrInfo from './AttrInfo.vue';
  import SkuInfo from './SkuInfo.vue';
  import DescInfo from './DescInfo.vue';
  import VideoCenter from '@/components/ChooseTplMedia/index.vue';
  import { cloneDeep, isEmpty, uniqBy } from 'lodash-es';
  import ImageInfo from './ImageInfo.vue';
  import PlatTitle from '@/components/PlatTitle/index.vue';
  import { comBlobToDataURL } from '@/utils/upload';
  import ImagePop from '@/components/ImagePop/index.vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => ({})
    },
    storeAcctId: {
      type: [Number, String],
      default: ''
    },
    rowList: {
      type: Array,
      default: () => []
    },
    listingStatus: {
      type: Number,
      default: -2
    }
  });
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  // 视频上传前
  const beforeAvatarUpload = async (file) => {
    let isMp4success = await getMp4Detail(file); // 视频时长
    if (isMp4success * 1 > 180) {
      return ElMessage.warning('上传视频长度不能超过 180 秒');
    }
  };

  const handleAvatarError = (error) => {
    ElMessage.error(error.toString());
  };

  function getMp4Detail(file) {
    return new Promise((resolve, reject) => {
      // mp4/wmv/avi/mpg/flv/mov/3gp
      // 获取后缀名
      // const suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
      // 判断是否符合文件大小的限制需求
      const isLt2M = file.size / 1024 / 1024 < 500;
      // 判断是否符合文件类型需求
      const isLtType = [
        'video/mp4',
        // 'video/wmv',
        'video/x-ms-wmv',
        'video/avi',
        // 'video/mpg',
        'video/mpeg',
        // 'video/flv', //?
        // 'video/mov',
        'video/quicktime',
        // 'video/3gp'
        'video/3gpp'
      ];

      if (!isLt2M) {
        ElMessage.warning('上传文件大小不能超过500M!');
      }

      let correctType = true;
      //限制视频格式
      if (
        (file.type != '' && isLtType.indexOf(file.type) == -1) ||
        (file.type == '' && !file.name.includes('.flv'))
      ) {
        correctType = false;
        ElMessage.warning('上传视频文件格式不合法');
      } else {
        correctType = true;
      }

      //获取视频时长
      let url = URL.createObjectURL(file);
      let audioElement = new Audio(url);
      let duration;
      let fun = (duration) => {
        resolve(duration);
      };
      //下面需要注意的是在监听loadedmetadata绑定的事件中对duration直接进行赋值是无效的，需要在fun回调函数中进行赋值
      audioElement.addEventListener('loadedmetadata', function () {
        //音频/视频的元数据已加载时，会发生 loadedmetadata 事件
        duration = audioElement.duration; //时长以秒作为单位
        fun(parseFloat(duration).toFixed(1));
      });
      if (!(isLt2M && correctType)) {
        reject();
      }
    });
  }
  const mediaId = ref('');
  const coverUrl = ref('');
  const handleAvatarSuccess = (res) => {
    if (res.code == '0000') {
      formData.value.videoFileUrl = res.data;
      formData.value.videoFileName =
        res.data.split('/')[res.data.split('/').length - 1];
      formData.value.isVideo = true;
      formData.value.videoSource = 'local';
    } else {
      ElMessage.warning(res.msg);
    }
  };
  // 打开媒体中心弹窗
  const openVideoCenterVisible = ref(false);
  const openVideoCenter = () => {
    openVideoCenterVisible.value = true;
  };
  const videoCenterClose = () => {
    openVideoCenterVisible.value = false;
  };
  const videoSelected = (data) => {
    coverUrl.value = data[0].coverUrl;
    mediaId.value = data[0].storeName;
    formData.value.videoFileUrl = data[0].url;
    formData.value.videoFileName = data[0].name;
    formData.value.isVideo = true;
    formData.value.videoSource = 'center';
    openVideoCenterVisible.value = false;
  };

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const needFresh = ref(false);
  const formData = ref({ extra: {} });
  const skuInfoRef = ref();
  const detailFormRef = ref();
  const curTab = ref('info');
  const descRef = ref();
  const initLoading = ref(false);
  // 描述
  const descObj = ref({});
  //   类目
  const attrListObj = ref({});
  // 自定义属性
  const customAtrrList = ref([]);
  // 欧盟责任人枚举
  const EUResponsibleOption = ref([]);
  // 商品资质
  let getQualifications = ref([]);
  // 模板id
  const aliexpressTemplateId = ref(null);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        needFresh.value = false;
        curTab.value = 'info';
        showNotRequiredAttr.value = true;
        customAtrrList.value = [];
        descObj.value = {};
        formRule.value = cloneDeep(basicFormRule);
        initLoading.value = true;
        saveLoading.value = false;
        attrListObj.value = {};
        syncBrandLoading.value = false;
        Promise.all([
          getInfoApi(props.params),
          getCateAttrApi({
            storeAcctId: props.storeAcctId,
            smtCategoryId: props.rowList[0].cateId
          }),
          queryAliexpressVideoInfo({
            aliexpressTplId: props.params.aliexpressTplId
          }),
          getQualificationsByStoreAcctIdAndCategoryId({
            storeAcctId: props.storeAcctId,
            categoryId: props.rowList[0].cateId
          })
        ])
          .then((res) => {
            //   主图
            if (res[0].data.mainImages) {
              res[0].data.mainImages = res[0].data.mainImages.split(',');
            } else {
              res[0].data.mainImages = [];
            }
            formData.value = res[0].data;
            aliexpressTemplateId.value = res[0].data.aliexpressTemplateId;
            // 欧盟责任人枚举
            if (formData.value.euInfo) {
              if (
                formData.value.euInfo?.euContactModuleList?.euContactModule
                  .length
              ) {
                EUResponsibleOption.value =
                  formData.value.euInfo.euContactModuleList.euContactModule;
              } else {
                EUResponsibleOption.value = [];
              }
            }

            attrListObj.value = res[1].data || {};

            //   已有的分类属性值
            let existAttrValObj = {};
            if (formData.value.prodListingAliexpressFullManageAttrList) {
              formData.value.prodListingAliexpressFullManageAttrList.forEach(
                (item) => {
                  existAttrValObj[item.attrId] = item;
                }
              );
            }
            [attrListObj.value.brand, attrListObj.value.attr || []].forEach(
              (v) => {
                v.length &&
                  v.forEach((item) => {
                    //   将类目赋值
                    if (
                      ['interval', 'check_box'].includes(
                        item.attributeShowTypeValue
                      )
                    ) {
                      item.checkValue = [];
                    } else {
                      item.checkValue = null;
                    }
                    if (existAttrValObj[item.attributeId]) {
                      //单选 下拉框
                      if (item.attributeShowTypeValue === 'list_box') {
                        item.checkValue =
                          existAttrValObj[item.attributeId].attrValueId;
                        // 二级属性
                        item.msgCategoryAttributeSmt =
                          item.categoryAttributeValuesSmts?.filter(
                            (elem) =>
                              elem.categoryAttributeValueId === item.checkValue
                          )[0]?.msgCategoryAttributeSmt || {};
                        // 如果存在二级属性
                        if (!isEmpty(item.msgCategoryAttributeSmt)) {
                          let secondAttrId =
                            item.msgCategoryAttributeSmt.attributeId;
                          if (existAttrValObj[secondAttrId]) {
                            item.msgCategoryAttributeSmt.checkValue =
                              existAttrValObj[secondAttrId].attrValueId;
                          } else {
                            item.msgCategoryAttributeSmt.checkValue = null;
                          }
                        }
                      } else if (item.attributeShowTypeValue === 'check_box') {
                        item.checkValue =
                          formData.value.prodListingAliexpressFullManageAttrList
                            .filter((elem) => elem.attrId === item.attributeId)
                            .map((elem) => elem.attrValueId);
                      } else if (item.attributeShowTypeValue === 'input') {
                        item.checkValue =
                          existAttrValObj[item.attributeId].attrValue;
                      } else if (item.attributeShowTypeValue === 'interval') {
                        // 区间值的模板状态和刊登的值不一样
                        const checkedList =
                          formData.value.prodListingAliexpressFullManageAttrList.filter(
                            (elem) => elem.attrId === item.attributeId
                          );
                        if (checkedList.length) {
                          if (props.listingStatus === -2) {
                            item.checkValue = checkedList.map(
                              (item) => item.attrValue
                            );
                          } else {
                            item.checkValue[0] =
                              checkedList.filter(
                                (elem) => elem.attrValueStart
                              )[0]?.attrValueStart || '';
                            item.checkValue[1] =
                              checkedList.filter((elem) => elem.attrValueEnd)[0]
                                ?.attrValueEnd || '';
                          }
                        }
                      }
                    }
                  });
              }
            );
            //   将必填项属性和非必填属性区分
            attrListObj.value.requiredAttrList = cloneDeep(
              (attrListObj.value.attr || []).filter((item) => item.required)
            );
            attrListObj.value.notRequiredAttrList = cloneDeep(
              (attrListObj.value.attr || []).filter((item) => !item.required)
            );
            // 自定义属性
            if (
              formData.value?.prodListingAliexpressFullManageAttrList?.length
            ) {
              formData.value.prodListingAliexpressFullManageAttrList.forEach(
                (item, index) => {
                  if (!item.attrId) {
                    customAtrrList.value.push({ ...item, id: index });
                  }
                }
              );
            }

            //   标题
            originTitle.value = formData.value.title;
            initLoading.value = false;
            // 描述
            const dynamicIndex = JSON.parse(
              formData.value.mobileDesc
            ).moduleList.findIndex((item) => item.type === 'dynamic');
            descObj.value = {
              pcDesc: JSON.parse(formData.value.pcDesc).moduleList || [],
              mobileDesc: JSON.parse(formData.value.mobileDesc).moduleList || []
            };
            // 位置 信息模块
            if (dynamicIndex > -1) {
              let pcWholeList = JSON.parse(
                formData.value.mobileDesc
              ).moduleList;
              descObj.value = {
                moduleId: pcWholeList[dynamicIndex].reference.moduleId,
                posotion: dynamicIndex === 0 ? 'top' : 'bottom',
                pcDesc: JSON.parse(formData.value.pcDesc).moduleList || [],
                mobileDesc: pcWholeList.splice(dynamicIndex, 1)
              };
            }
            // 类目必填项添加校验
            addAttrRequiredValidate();
            // 视频显示
            if (!res[0].data.id) {
              // 新建模板
              // 判断基础模板是否存在视频
              if (res[2].data.length == 0) {
                // 无视频
                formData.value.isVideo = false;
              } else {
                formData.value.isVideo = true;
                formData.value.videoSource = 'local';
                formData.value.videoFileUrl = res[2].data[0].videos[0].location;
                formData.value.videoFileName =
                  res[2].data[0].videos[0].videoname;
              }
            } else {
              // 编辑模板
              // 判断是否存在视频
              if (res[0].data.videoFileUrl) {
                formData.value.isVideo = true;
                if (formData.value.mediaId) {
                  formData.value.videoSource = 'center';
                } else {
                  formData.value.videoSource = 'local';
                }
                formData.value.videoFileName =
                  res[0].data.videoFileUrl.split('/')[
                    res[0].data.videoFileUrl.split('/').length - 1
                  ];
              } else {
                // 无视频
                formData.value.isVideo = false;
              }
            }
            getQualifications.value = res[3].data.map((item, index) => {
              if (index == 0) {
                item['header'] = item.country + '-' + item.qualificationName;
              } else {
                if (
                  !(
                    item.country == res[3].data[index - 1].country &&
                    item.qualificationName ==
                      res[3].data[index - 1].qualificationName
                  )
                ) {
                  item['header'] = item.country + '-' + item.qualificationName;
                }
              }
              return item;
            });
            // 默认填写商品资质图
            const qualificationKeys = getQualifications.value.map(
              (item) => item.qualificationKey
            );
            getDefaultQualificationImage({
              qualificationKeys: qualificationKeys,
              templateId: aliexpressTemplateId.value
            }).then(({ data: res }) => {
              // 寻找当前项
              getQualifications.value.forEach((item) => {
                const index = res.findIndex(
                  (qualification) =>
                    qualification.qualificationKey === item.qualificationKey
                );
                if (index > -1)
                  item.qualificationValue = res[index].qualificationValue;
              });
            });
            if (
              // 商品资质
              res[0].data.qualifications
            ) {
              let qualificationsObj = {};
              res[0].data.qualifications.forEach((item) => {
                qualificationsObj[item.qualificationKey] =
                  item.qualificationValue;
              });
              getQualifications.value.forEach((item) => {
                item.qualificationValue =
                  qualificationsObj[item.qualificationKey];
              });
            }
          })
          .catch((err) => {
            console.log('err :>> ', err);
            attrListObj.value = {};
            initLoading.value = false;
          });
        nextTick(() => {
          descRef.value.tabName = 'mobileDesc';
          descRef.value.handleSync();
        });
      } else {
        needFresh.value &&
          emits('handleSearch', props.currentPage, props.pageSize);
        formData.value = { extra: {} };
      }
    }
  );
  // 类目必填项添加校验
  const addAttrRequiredValidate = () => {
    [attrListObj.value.brand, attrListObj.value.requiredAttrList].forEach(
      (v) => {
        v.forEach((item) => {
          if (item.required) {
            if (item.attributeShowTypeValue === 'input') {
              formRule.value[item.attributeId] = {
                required: true,
                trigger: 'blur',
                validator: (rule, value, callback) => {
                  if (item.checkValue) {
                    callback();
                  } else {
                    callback(new Error('请输入'));
                  }
                }
              };
            } else if (item.attributeShowTypeValue === 'check_box') {
              formRule.value[item.attributeId] = {
                required: true,
                trigger: 'change',
                validator: (rule, value, callback) => {
                  if (item.checkValue.length) {
                    callback();
                  } else {
                    callback(new Error('请选择'));
                  }
                }
              };
            } else {
              formRule.value[item.attributeId] = {
                required: true,
                trigger: 'change',
                validator: (rule, value, callback) => {
                  if (item.checkValue) {
                    callback();
                  } else {
                    callback(new Error('请选择'));
                  }
                }
              };
              // 二级属性
              if (
                !isEmpty(item.msgCategoryAttributeSmt) &&
                item.msgCategoryAttributeSmt.required
              ) {
                formRule.value[item.msgCategoryAttributeSmt.attributeId] = {
                  required: true,
                  trigger: 'change',
                  validator: (rule, value, callback) => {
                    if (item.msgCategoryAttributeSmt.checkValue) {
                      callback();
                    } else {
                      callback(new Error('请选择'));
                    }
                  }
                };
              }
            }
          }
        });
      }
    );
  };

  // 本地上传
  const localLoading = ref(false);
  const handleUpload = (rawFile, index) => {
    localLoading.value = true;
    comBlobToDataURL(rawFile.file, (url) => {
      getQualifications.value[index].qualificationValue = url;
      localLoading.value = false;
    });
  };

  // 同步关联欧盟责任人
  const syncEuInfo = async () => {
    let { data } = await syncOneEuResponsibleByStoreAcctIdAndCategoryId({
      storeAcctId: props.storeAcctId,
      categoryId: props.rowList[0].cateId
    });
    formData.value.euInfo.euContactModuleList.euContactModule = data.map(
      (item) => {
        item.name = item.msrEuName;
        return item;
      }
    );
  };
  const validateProductUnit = (rule, value, callback) => {
    const productUnit = formData.value.extra.productUnit;
    if (!productUnit) {
      callback(new Error('请选择最小计量单位'));
    } else {
      callback();
    }
  };
  const validateMarketingImage = (rule, value, callback) => {
    const { market1Images, market2Images, title } = formData.value;
    if (title) {
      if (!market1Images || !market2Images) {
        ElMessage.warning('请上传图片');
        callback(new Error(''));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const validateTitle = (rule, value, callback) => {
    if (value) {
      if (value.length > 128) {
        callback(new Error('标题超出字数'));
      } else {
        callback();
      }
    } else {
      callback('请输入标题');
    }
  };
  const validateLotNum = (rule, value, callback) => {
    const { lotNum } = formData.value.extra;
    if (lotNum) {
      if (lotNum < 2) {
        callback(new Error('选择打包出售的情况下,每包数量必须大于1'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  let basicFormRule = {
    title: [{ required: true, trigger: 'blur', validator: validateTitle }],
    mainImages: [{ required: true, trigger: 'change', message: '请上传图片' }],
    productType: [
      { required: true, trigger: 'change', message: '请选择备货类型' }
    ],
    productUnit: [
      {
        required: true,
        trigger: 'change',
        validator: validateProductUnit
      }
    ],
    marketingImage: [
      {
        required: true,
        trigger: 'change',
        validator: validateMarketingImage
      }
    ],
    lotNum: [{ trigger: 'blur', validator: validateLotNum }]
  };
  const formRule = ref();
  //   标题
  const randomTitleLoading = ref(false);
  const originTitle = ref();
  const handleRandomTile = async () => {
    randomTitleLoading.value = true;
    try {
      const { data } = await getRandomTitleApi(formData.value.prodPId);
      formData.value.title = data;
    } catch (err) {
      handleRegenTitle();
    }
    randomTitleLoading.value = false;
  };
  const handleRegenTitle = () => {
    formData.value.title = originTitle.value;
  };

  //   品牌
  const syncBrandLoading = ref(false);
  const handleSyncBrand = async () => {
    try {
      syncBrandLoading.value = true;
      const { data } = await syncBrandAttrApi({
        storeAcctId: props.storeAcctId,
        smtCategoryId: formData.value.smtCategoryId,
        productType: formData.value.productType
      });
      if (data.length) {
        attrListObj.value.brand.forEach((item) => {
          if (item.attributeId == 2) {
            item.categoryAttributeValuesSmts = data;
          }
        });
      } else {
        ElMessage.warning('该类目下无品牌选项');
      }
    } catch (err) {
      console.log('err :>> ', err);
    }
    syncBrandLoading.value = false;
  };
  // 查找第二类目
  const handleSecondAttr = ({ curVal, attributeId }) => {
    [
      attrListObj.value.brand,
      attrListObj.value.requiredAttrList,
      attrListObj.value.notRequiredAttrList
    ].forEach((v) => {
      v.forEach((item) => {
        // 某些下拉框存在二级属性
        if (
          item.attributeId === attributeId &&
          item.attributeShowTypeValue === 'list_box'
        ) {
          item.msgCategoryAttributeSmt =
            item.categoryAttributeValuesSmts?.filter(
              (elem) => elem.categoryAttributeValueId === curVal
            )[0]?.msgCategoryAttributeSmt;
          // 判断是否是必填项
          // 判断一级是否是必填项
          if (item.required) {
            // 判断二级是否是必填项
            if (item.msgCategoryAttributeSmt?.required) {
              formRule.value[item.msgCategoryAttributeSmt.attributeId] = {
                required: true,
                trigger: 'change',
                validator: (rule, value, callback) => {
                  if (item.msgCategoryAttributeSmt?.checkValue) {
                    callback();
                  } else {
                    callback(new Error('请选择'));
                  }
                }
              };
            } else {
              if (formRule.value[item.msgCategoryAttributeSmt?.attributeId]) {
                delete formRule.value[item.msgCategoryAttributeSmt.attributeId];
              }
            }
          }
        }
      });
    });
  };

  const showNotRequiredAttr = ref(false);
  const handleShowNotRequiredAttr = () => {
    showNotRequiredAttr.value = !showNotRequiredAttr.value;
  };

  // 图片
  const changeImage = ({ type, val }) => {
    formData.value[type] = val;
  };
  // 改变描述
  const changeDesc = ({ type, val }) => {
    descObj.value[type] = val;
  };
  // 获取table数据
  const fullTableData = ref([]);
  const getTableData = () => {
    const { fullData } = skuInfoRef.value.getTableFullData();
    fullTableData.value = fullData;
  };

  const handleClose = () => {
    dialogVisible.value = false;
  };

  const handleAddCustomAttr = () => {
    const lastId =
      customAtrrList.value[customAtrrList.value.length - 1]?.id || 0;
    customAtrrList.value.push({ attr: '', attrValue: '', id: lastId + 1 });
  };
  const handleDelAllCustomAttr = () => {
    customAtrrList.value = [];
  };
  const handleDelCustomAttr = (id) => {
    customAtrrList.value = customAtrrList.value.filter(
      (item) => item.id !== id
    );
  };

  const saveLoading = ref(false);
  const handleSave = async (formEl, type) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        try {
          let params = {
            ...formData.value,
            type: true,
            storeAcctId: props.storeAcctId
          };
          // 类目属性
          params.prodListingAliexpressFullManageAttrList = [];
          let isCheckFlag = false;
          [
            attrListObj.value.brand,
            attrListObj.value.requiredAttrList,
            attrListObj.value.notRequiredAttrList
          ].forEach((v) => {
            if (isCheckFlag) return false;
            v.length &&
              v.forEach((item) => {
                if (isCheckFlag) return false;
                // 如果存在值
                if (item.checkValue) {
                  //单选 下拉框
                  if (item.attributeShowTypeValue === 'list_box') {
                    const categoryAttributeValuesSmtsNew =
                      item.categoryAttributeValuesSmts?.filter(
                        (elem) =>
                          elem.categoryAttributeValueId === item.checkValue
                      );

                    const prodListingAliexpressFullManageAttrItem = {
                      attr: item.attributeNameZn,
                      attrId: item.attributeId,
                      attrValueId: item.checkValue,
                      attrValue: categoryAttributeValuesSmtsNew.length
                        ? categoryAttributeValuesSmtsNew[0].valueNameZn
                        : ''
                    };

                    params.prodListingAliexpressFullManageAttrList.push(
                      prodListingAliexpressFullManageAttrItem
                    );
                    isCheckFlag =
                      !prodListingAliexpressFullManageAttrItem.attrValue &&
                      prodListingAliexpressFullManageAttrItem.attrId === 2;
                    if (isCheckFlag) return false;
                    // 二级属性
                    if (item?.msgCategoryAttributeSmt?.checkValue) {
                      let secondAttrObj = item.msgCategoryAttributeSmt;
                      params.prodListingAliexpressFullManageAttrList.push({
                        attr: secondAttrObj.attributeNameZn,
                        attrId: secondAttrObj.attributeId,
                        attrValueId: secondAttrObj.checkValue,
                        attrValue:
                          secondAttrObj.categoryAttributeValuesSmts?.filter(
                            (elem) =>
                              elem.categoryAttributeValueId ===
                              secondAttrObj.checkValue
                          )[0].valueNameZn
                      });
                    }
                  } else if (
                    item.attributeShowTypeValue === 'check_box' &&
                    item.checkValue.length
                  ) {
                    // 通过checkValue找到 categoryAttributeValueId对应valueNameZn
                    item.categoryAttributeValuesSmts?.forEach((elem) => {
                      if (
                        item.checkValue.includes(elem.categoryAttributeValueId)
                      ) {
                        params.prodListingAliexpressFullManageAttrList.push({
                          attr: item.attributeNameZn,
                          attrId: item.attributeId,
                          attrValueId: elem.categoryAttributeValueId,
                          attrValue: elem.valueNameZn
                        });
                      }
                    });
                  } else if (item.attributeShowTypeValue === 'input') {
                    params.prodListingAliexpressFullManageAttrList.push({
                      attr: item.attributeNameZn,
                      attrId: item.attributeId,
                      attrValue: item.checkValue
                    });
                  } else if (
                    item.attributeShowTypeValue === 'interval' &&
                    item.checkValue.length
                  ) {
                    let checkValueString =
                      item.checkValue[0] + ' - ' + item.checkValue[1];
                    const basicAttrValue = {
                      attr: item.attributeNameZn,
                      attrId: item.attributeId,
                      attrValueId: -1,
                      attrValue: checkValueString
                    };
                    params.prodListingAliexpressFullManageAttrList.push({
                      ...basicAttrValue,
                      attrValueStart: item.checkValue[0]
                    });
                    params.prodListingAliexpressFullManageAttrList.push({
                      ...basicAttrValue,
                      attrValueEnd: item.checkValue[1]
                    });
                  }
                }
              });
          });
          if (isCheckFlag) {
            return ElMessage.warning(
              '未同步到店铺品牌信息，请点击同步按钮后重试！'
            );
          }
          //  自定义类目属性
          let _customAtrrList = customAtrrList.value.filter(
            (item) => item.attr && item.attrValue
          );
          //去重 自定义属性值的属性名不能一致
          let uniqCustomAtrrList = uniqBy(_customAtrrList, 'attr');
          if (uniqCustomAtrrList.length !== _customAtrrList.length) {
            return ElMessage.warning('不支持多个自定义属性名相同');
          }
          params.prodListingAliexpressFullManageAttrList =
            params.prodListingAliexpressFullManageAttrList.concat(
              _customAtrrList
            );
          // 主图
          params.mainImages = formData.value.mainImages.join(',');
          //变种信息
          const { fullData, wrongMsg } = skuInfoRef.value.getTableFullData();
          if (wrongMsg) {
            return ElMessage.warning(wrongMsg);
          }
          params.aliexpressFullmanageListingSkuDtoList = fullData.map((v) => ({
            ...v,
            specialProductType: v.specialProductTypeList.length
              ? v.specialProductTypeList.join(',')
              : ''
          }));
          // 描述
          const { pcDesc, mobileDesc, moduleId, posotion } = descObj.value;
          // 电脑版详情描述必填
          if (!pcDesc.length) {
            return ElMessage.warning('电脑版详情必填');
          }
          params.mobileDesc = JSON.stringify({
            version: '2.0.0',
            moduleList: mobileDesc
          });
          if (moduleId && posotion) {
            let dynamicObj = {
              type: 'dynamic',
              reference: {
                type: 'relation',
                moduleId: moduleId
              }
            };
            let _pcDesc = [];
            if (posotion === 'top') {
              _pcDesc = [dynamicObj].concat(pcDesc);
            } else if (posotion === 'bottom') {
              _pcDesc = pcDesc.concat([dynamicObj]);
            }
            params.pcDesc = JSON.stringify({
              version: '2.0.0',
              moduleList: _pcDesc
            });
          } else {
            params.pcDesc = JSON.stringify({
              version: '2.0.0',
              moduleList: pcDesc
            });
          }
          // 视频
          if (formData.value.isVideo && formData.value.isVideo == true) {
            if (!formData.value.videoFileUrl) {
              return ElMessage.warning(
                '无可用视频，请上传视频或者选择取消上传视频'
              );
            }
            if (formData.value.videoSource == 'local') {
              // 回显||本地上传
              params.posterUrl = '';
              params.mediaId = '';
              params.videoFileUrl = formData.value.videoFileUrl;
            } else if (formData.value.videoSource == 'center') {
              // 从媒体库
              params.posterUrl = coverUrl.value;
              params.mediaId = mediaId.value;
              params.videoFileUrl = formData.value.videoFileUrl;
            }
          } else {
            params.posterUrl = '';
            params.mediaId = '';
            params.videoFileUrl = '';
          }
          let qualificationsReq = getQualifications.value.filter(
            (item) =>
              item.required &&
              (!item.qualificationValue || item.qualificationValue == '')
          );
          if (qualificationsReq.length != 0) {
            return ElMessage.warning('请上传必填的商品资质信息');
          }
          // 商品资质
          params.qualifications = getQualifications.value.filter(
            (item) => item.qualificationValue && item.qualificationValue != ''
          );
          saveLoading.value = true;
          if (type === 'save') {
            const { msg } = await savePublishInfoApi(params);
            ElMessage.success(msg);
          }
          if (type === 'saveandpublish') {
            const { msg } = await saveAndPublishListingApi(params);
            ElMessage.success(msg);
          }
          needFresh.value = true;
          dialogVisible.value = false;
        } catch (err) {
          console.log('err :>> ', err);
        }
        saveLoading.value = false;
        // }
      } else {
        console.log('error submit!', fields);
      }
    });
  };
</script>

<style lang="scss" scoped>
  .detail_wrapper {
    :deep(.el-overlay-dialog) {
      overflow-y: hidden;
    }
    :deep(.el-dialog) {
      height: calc(100% - 100px);
    }
    :deep(.el-dialog__body) {
      overflow-y: scroll;
      height: calc(100% - 168px);
    }
  }
  .info_title {
    :deep(.el-form-item__content) {
      display: flex;
    }
    :deep(.el-input) {
      flex: 1;
    }
    :deep(.platform_title) {
      flex: 1;
    }
  }
  .ml10 {
    margin-left: 10px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .disflex {
    display: flex;
  }
  .custom_attr {
    display: flex;
    margin-top: 10px;
    :deep(.el-input) {
      width: 350px;
    }
  }
  .sale_way {
    :deep(.el-form-item__content) {
      display: flex;
    }
    :deep(.el-input) {
      width: 100px;
    }
  }
  .mt10 {
    margin-top: 10px;
  }
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
