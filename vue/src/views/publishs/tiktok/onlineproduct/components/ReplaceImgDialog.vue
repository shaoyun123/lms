<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改商品图片"
      :width="1000"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="formData" :inline="true" class="adjustPreTax_form">
          <el-row align="middle">
            <el-col :span="8">
              <el-form-item prop="searchList">
                <el-select
                  v-model="formData.searchType"
                  class="form_left"
                  filterable
                >
                  <el-option value="prodPSkuList" label="商品父SKU" />
                  <el-option value="prodSSkuList" label="商品子SKU" />
                </el-select>
                <el-input
                  v-model="formData.searchList"
                  clearable
                  class="form_right"
                  placeholder="支持多个搜索逗号隔开"
                  @blur="commonDivideComma($event)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7"
              ><el-form-item
                label="店铺"
                prop="storeAcctIdList"
                class="search_item_cascader"
              >
                <z-cascader
                  v-model="formData.storeAcctIdList"
                  :data="storeCascaderList"
                ></z-cascader>
                <!-- <el-cascader
                  v-model="formData.storeAcctIdList"
                  :options="storeCascaderList"
                  :filter-method="filterCascader"
                  filterable
                  clearable
                  collapse-tags
                  :props="{
                    multiple: true
                  }"
                ></el-cascader> -->
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                :loading="tableDataLoading"
                @click="handleSearch(1)"
                >查询</el-button
              >
              <el-button @click="handleResetForm">清空</el-button></el-col
            >
            <el-col :span="4">
              <el-checkbox
                v-model="modifyAllSites"
                label="同步修改全站点商品图片"
                size="small"
              />
              <el-button
                type="primary"
                class="ml10"
                :loading="batchUpdateLoading"
                @click="handleBatchUpdate"
                >批量修改</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="disflex_between mb10">
        <div>数量({{ paginationData.total }})</div>
        <div class="disflex_between">
          <div :style="{ flex: 'none' }">图片URL</div>
          <el-input v-model="imageurl" class="ml12" clearable />
          <el-button type="primary" @click="handleAddNewImg"
            >新增图片</el-button
          >
          <el-button type="primary" @click="handleReback">还原</el-button>
          <el-button type="primary" @click="handleBatchUpdateAddWatermark">
            批量首图加水印
          </el-button>
          <el-tag type="danger">每个lisiting的图片不能超过9张</el-tag>
        </div>
        <div></div>
      </div>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="600"
        border
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺" width="120" />
        <vxe-column field="productId" title="product_id" width="120" />
        <vxe-column field="prodPSku" title="商品父sku" width="120" />
        <vxe-column field="imgList" title="橱窗图">
          <template #default="{ row }">
            <div class="imgs_container">
              <div
                v-for="(item, index) in row.imgList"
                :key="item"
                class="imgs_container_img"
              >
                <ImagePop :src="item" />
                <el-link type="danger" @click="handleRemoveImg(row, index)"
                  >移除</el-link
                >
              </div>
            </div>
            <div class="disflex">
              <el-button
                type="primary"
                class="mr10"
                @click="handleOpenUrlDialog(row)"
                >网络图片</el-button
              >
              <el-upload
                action
                :http-request="(file) => handleUpload(row, file)"
                :show-file-list="false"
                accept="image/*"
                multiple
              >
                <el-button
                  type="primary"
                  class="mr10"
                  :loading="localImgLoading"
                  >本地图片</el-button
                >
              </el-upload>
              <el-button type="primary" @click="handleTplImg(row)"
                >模板图片</el-button
              >
            </div>
          </template>
        </vxe-column>
        <vxe-column field="result" title="操作结果" width="120" />
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[100, 300, 500]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-dialog>
    <!-- 网络图片 -->
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
    <!-- 模板图片 -->
    <ChooseTplImage
      v-model="tplImgVisible"
      :limit="9"
      :params="tplImgParams"
      @get-tpl-img="getTplImg"
    />

    <!-- 首图添加水印 -->
    <el-dialog
      v-model="watermarkVisible"
      width="600px"
      title="首图添加水印"
      :close-on-click-modal="false"
    >
      <!-- 表格-vxe-table -->
      <div>
        <vxe-table :data="watermarkTableData">
          <vxe-column field="storeAcct" title="店铺"></vxe-column>
          <vxe-column title="图片水印">
            <template #default="{ row }">
              <el-select
                v-model="row.watermarkImg"
                :disabled="row.disableTxt"
                placeholder="请选择"
                clearable
                filterable
                @change="handleWatermarkChange(row, 0)"
                @clear="handleWatermarkClear(row)"
              >
                <el-option
                  v-for="item in row.watermarkImgArr"
                  :key="item.id"
                  :label="item.watermarkTemplateName"
                  :value="item.id"
                />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column title="文字水印">
            <template #default="{ row }">
              <el-select
                v-model="row.watermarkTxt"
                :disabled="row.disableImg"
                placeholder="请选择"
                clearable
                filterable
                @change="handleWatermarkChange(row, 1)"
                @clear="handleWatermarkClear(row)"
              >
                <el-option
                  v-for="item in row.watermarkTxtArr"
                  :key="item.id"
                  :label="item.watermarkTemplateName"
                  :value="item.id"
                />
              </el-select>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <!-- 底部 -->
      <template #footer>
        <el-button type="primary" @click="handleSaveWatermark()">
          添加
        </el-button>
        <el-button @click="watermarkVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { commonDivideComma } from '@/utils/divide';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    modifyGlobalProductImagesApi,
    getWatermarkInfoApi,
    batchFirstImageAddWatermarkApi
  } from '@/api/publishs/tiktokonlineproduct';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  import { getListApi } from '@/api/publishs/tiktokonlineproduct';
  import { isUrl } from '@/utils/is';
  import { comBlobToDataURL } from '@/utils/upload';
  import { cloneDeep } from 'lodash-es';

  const MAX_IMAGE_LENGTH = 9;

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Object,
      default: () => {}
    },
    storeCascaderList: {
      type: Array,
      default: () => []
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  let formData = ref({});
  const tableData = ref([]);
  const tableRef = ref();
  let paginationData = ref({
    total: 0,
    limit: 100,
    page: 1
  });
  const needFresh = ref(false);
  const modifyAllSites = ref(true);

  const tableDataLoading = ref(false);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        // 赋值
        formData.value = {
          searchType: 'prodPSkuList',
          searchList: '',
          storeAcctIdList: []
        };
        paginationData.value = {
          total: 0,
          limit: 100,
          page: 1
        };
        modifyAllSites.value = true;
        imageurl.value = '';
        tableData.value = [];
        needFresh.value = false;
        if (props.rowCheckedList.length) {
          paginationData.value.total = props.rowCheckedList.length;
          tableData.value = props.rowCheckedList.map((item) => ({
            ...item,
            oldImageUrlList: JSON.parse(item.imgs || '[]').map(
              (v) => v.urlList[0]
            ),
            imgList: JSON.parse(item.imgs || '[]').map((v) => v.urlList[0])
          }));
          paginationData.value.total = props.rowCheckedList.length;
        }
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
      }
    }
  );

  const handleSearch = async (newPage) => {
    let obj = {};
    obj[formData.value.searchType] = formData.value.searchList
      ? formData.value.searchList?.split(',')
      : [];
    obj.storeAcctIdList = [];
    if (formData.value.storeAcctIdList.length) {
      obj.storeAcctIdList = formData.value.storeAcctIdList;
    }
    try {
      tableDataLoading.value = true;
      let { limit, page } = paginationData.value;
      if (newPage) {
        page = newPage;
      }
      const { data, count } = await getListApi({
        pageSize: limit,
        pageNum: page,
        ...obj
      });
      paginationData.value.total = count;
      tableData.value = (data || []).map((item) => ({
        ...item,
        oldImageUrlList: JSON.parse(item.imgs || '[]').map((v) => v.urlList[0]),
        imgList: JSON.parse(item.imgs || '[]').map((v) => v.urlList[0])
      }));
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.value.page = 1;
    paginationData.value.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.value.page = val;
    handleSearch();
  };

  const handleResetForm = () => {
    formData.value = {
      searchType: 'prodPSkuList',
      searchList: '',
      storeAcctIdList: []
    };
  };

  const imageurl = ref();
  const handleAddNewImg = () => {
    if (!imageurl.value) return ElMessage.warning('图片地址不能为空');
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    checkedList.forEach((item) => {
      recordRow = item;
      addRowImg([imageurl.value.trim()]);
    });
  };
  const handleReback = () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    checkedList.forEach((item) => {
      item.imgList = cloneDeep(item.oldImageUrlList);
    });
  };
  const handleRemoveImg = (row, index) => {
    row.imgList.splice(index, 1);
  };
  //   网络图片
  const imgUrlVisible = ref(false);
  const imgUrls = ref();
  let recordRow = null;
  const handleOpenUrlDialog = (row) => {
    imgUrlVisible.value = true;
    imgUrls.value = '';
    recordRow = row;
  };
  const handleSaveUrl = () => {
    const imgList = imgUrls.value.split('\n').filter((item) => !!item);
    if (!imgList.length) {
      return ElMessage.warning('请输入图片地址');
    }
    // 判断url是否合法
    if (imgList.some((item) => !isUrl(item))) {
      return ElMessage.warning('输入地址不合法');
    }
    addRowImg(imgList);
    imgUrlVisible.value = false;
  };
  const addRowImg = (newImageList) => {
    const afterImgLength = MAX_IMAGE_LENGTH - recordRow.imgList.length;
    if (afterImgLength - newImageList.length < 0) {
      ElMessageBox.confirm(
        '此次修改部分listing图片数量大于九张，是否倒序删除至仅保留九张图片',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 将listing内图片从后往前删除到仅保留9张图片
          if (newImageList.length > MAX_IMAGE_LENGTH) {
            recordRow.imgList = newImageList.slice(0, 9);
          } else {
            recordRow.imgList = newImageList
              .concat(recordRow.imgList)
              .slice(0, 9);
          }
        })
        .catch(() => {});
    } else {
      recordRow.imgList = newImageList.concat(recordRow.imgList);
    }
  };

  // 本地图片
  const localImgLoading = ref(false);
  const handleUpload = (row, rawFile) => {
    recordRow = row;
    comBlobToDataURL(rawFile.file, (url) => {
      addRowImg([url]);
    });
  };

  // 模板图片
  const tplImgParams = ref();
  const tplImgVisible = ref(false);
  const handleTplImg = (row) => {
    tplImgParams.value = {
      platCode: 'tiktok',
      prodPSkus: [row.prodPSku]
    };
    tplImgVisible.value = true;
    recordRow = row;
  };
  const getTplImg = (imgUrlList) => {
    addRowImg(imgUrlList);
  };

  // 批量调整
  const batchUpdateLoading = ref(false);
  const handleBatchUpdate = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    let params = checkedList.map((item) => ({
      storeAcctId: item.storeAcctId,
      // oldImageUrlList: item.oldImageUrlList,
      productId: item.productId,
      globalProductId: item.globalProductId,
      imageUrlList: item.imgList,
      modifyAllSites: modifyAllSites.value
    }));
    try {
      batchUpdateLoading.value = true;
      const { data, msg } = await modifyGlobalProductImagesApi(params);
      needFresh.value = true;
      checkedList.forEach((item) => {
        item.result = data[item.productId];
      });
      ElMessage.success(msg);
    } catch (err) {
      console.log('err :>> ', err);
    }
    batchUpdateLoading.value = false;
  };

  //批量首图加水印操作
  const watermarkVisible = ref(false);
  const watermarkTableData = ref([]);
  const handleBatchUpdateAddWatermark = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    //获取到店铺相关数据首图,productId,storeAcctId
    console.log(checkedList);
    let getNeedData = checkedList.map((item) => {
      return {
        storeAcctId: item.storeAcctId,
        storeAcct: item.storeAcct,
        productId: item.productId,
        mainImgUrl: item.imgList[0],
        watermarkImg: '',
        watermarkTxt: '',
        disableImg: false,
        disableTxt: false
      };
    });
    //获取到店铺id
    const storeAcctIdList = checkedList.map((item) => item.storeAcctId);
    try {
      const { data } = await getWatermarkInfoApi({
        platCode: 'tiktok',
        storeAcctIdList: [...new Set(storeAcctIdList)]
      });
      if (!data.length) {
        return ElMessage.warning('选中店铺没有配置水印信息');
      } else {
        //获取到水印信息
        watermarkVisible.value = true;
        const watermarkImgArr = data.filter((item) => {
          if (!item.watermarkType) {
            return {
              watermarkType: item.watermarkType,
              id: item.id,
              watermarkTemplateName: item.watermarkTemplateName,
              storeAcctId: item.storeAcctId
            };
          }
        });
        const watermarkTxtArr = data.filter((item) => {
          if (item.watermarkType) {
            return {
              watermarkType: item.watermarkType,
              id: item.id,
              watermarkTemplateName: item.watermarkTemplateName,
              storeAcctId: item.storeAcctId
            };
          }
        });
        let newWatermarkTableData = getNeedData.map((item) => {
          return {
            ...item,
            watermarkImgArr: watermarkImgArr.filter(
              (itemI) => itemI.storeAcctId == item.storeAcctId
            ),
            watermarkTxtArr: watermarkTxtArr.filter(
              (itemI) => itemI.storeAcctId == item.storeAcctId
            )
          };
        });
        watermarkTableData.value = newWatermarkTableData;
      }
    } catch (err) {
      console.log('查询水印err :>> ', err);
    }
  };
  //选中操作
  const handleWatermarkChange = (row, num) => {
    if (num == 0) {
      row.disableImg = true;
      row.disableTxt = false;
    } else if (num == 1) {
      row.disableTxt = true;
      row.disableImg = false;
    }
  };
  //清空操作
  const handleWatermarkClear = (row) => {
    row.disableImg = false;
    row.disableTxt = false;
  };
  //保存水印
  const handleSaveWatermark = async () => {
    //循环watermarkTableData数据,找出watermarkTxt和watermarkImg都为空的数据
    const watermarkTableDataList = watermarkTableData.value;
    const watermarkTableDataListFilter = watermarkTableDataList.filter(
      (item) => {
        if (item.watermarkImg == '' && item.watermarkTxt == '') {
          return item;
        }
      }
    );
    //如果watermarkTableDataListFilter的长度大于0,则提示用户一个店铺至少选中一条水印
    if (watermarkTableDataListFilter.length > 0) {
      return ElMessage.warning('一个店铺至少选中一条水印');
    }
    //获取需要传递的参数,包括mainImgUrl,productId,watermarkId = watermarkImg || watermarkTxt
    const watermarkTableDataListMap = watermarkTableDataList.map((item) => {
      return {
        mainImgUrl: item.mainImgUrl,
        productId: item.productId,
        watermarkId: item.watermarkImg || item.watermarkTxt
      };
    });
    //请求批量首图加水印接口
    try {
      const { msg, data } = await batchFirstImageAddWatermarkApi(
        watermarkTableDataListMap
      );
      ElMessage.success(msg);
      //同时更改tableData的选中项的第一张橱窗图
      data.forEach((item) => {
        const tableDataList = tableData.value;
        tableDataList.forEach((v) => {
          if (v.productId == item.productId) {
            v.imgList[0] = item.watermarkImageUrl;
          }
        });
      });
      watermarkVisible.value = false;
    } catch (err) {
      console.log('批量首图加水印err :>> ', err);
    }
  };

  // const filterCascader = (node, keyword) => {
  //   if (keyword) {
  //     const keywordList = keyword.replace('，', ',').split(',');
  //     const label = node?.label?.trim();
  //     const text = node?.text?.trim();
  //     const isIncludelabel = keywordList.some((item) =>
  //       label?.includes(item.trim())
  //     );
  //     const isIncludetext = keywordList.some((item) =>
  //       text?.includes(item.trim())
  //     );
  //     if (isIncludelabel || isIncludetext) {
  //       return node;
  //     }
  //   }
  // };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .imgs_container {
    display: flex;
    flex-wrap: wrap;
    .imgs_container_img {
      padding: 5px;
    }
  }
  .adjustPreTax_form {
    :deep(.hide_tag) {
      :deep(.el-select__selected-item) {
        display: none;
      }
    }
    :deep(.el-form-item) {
      width: 90%;
    }
    :deep(.el-form-item__content) {
      flex-wrap: nowrap;
    }
    .form_left {
      :deep(.el-input) {
        width: 100px !important;
      }
      :deep(.el-input__wrapper) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
    .form_right {
      flex: auto;
      width: auto;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      :deep(.el-input__wrapper) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
  .ml10 {
    margin-left: 10px;
  }
</style>
