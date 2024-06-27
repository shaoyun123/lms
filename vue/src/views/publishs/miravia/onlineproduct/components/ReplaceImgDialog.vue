<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改商品图片"
      width="73%"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="formData" :inline="true" class="adjustPreTax_form">
          <el-row align="middle">
            <el-col :span="8">
              <el-form-item prop="searchStr">
                <el-select
                  v-model="formData.searchType"
                  class="form_left"
                  filterable
                >
                  <el-option :value="1" label="商品父SKU" />
                  <el-option :value="2" label="商品子SKU" />
                </el-select>
                <el-input
                  v-model="formData.searchStr"
                  clearable
                  class="form_right"
                  placeholder="支持多个搜索逗号隔开"
                  @blur="commonDivideComma($event)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="店铺" prop="storeAcctIdList">
                <el-select
                  v-model="formData.storeAcctIdList"
                  placeholder="请选择"
                  clearable
                  filterable
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                >
                  <el-option
                    v-for="item in storeList"
                    :key="item.id"
                    :label="item.storeAcct"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="handleSearch(1)"
                >查询</el-button
              >
              <el-button @click="handleResetForm">取消</el-button></el-col
            >
          </el-row>
        </el-form>
      </div>
      <div class="disflex_between mb10">
        <div class="flex-center flex-1">
          <div class="flex">
            <div class="mr-5" :style="{ flex: 'none' }">图片URL</div>
            <el-input v-model="addImageUrl" clearable style="width: 200px" />
            <el-button type="primary" @click="handleAddNewImg"
              >新增图片</el-button
            >
          </div>

          <el-button
            type="primary"
            style="margin-left: 125px"
            @click="handleRestore"
            >还原</el-button
          >
        </div>
        <el-button
          type="primary"
          class="ml10"
          :loading="batchUpdateLoading"
          @click="handleBatchUpdate"
          >批量修改</el-button
        >
      </div>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="600"
        :loading="tableDataLoading"
        border
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺" width="120" />
        <vxe-column field="productId" title="商品编号" width="120" />
        <vxe-column field="prodPSku" title="商品父SKU" width="120" />
        <vxe-column field="mainImageUrlList" min-width="360">
          <template #header
            >橱窗图 （<span style="color: #f56c6c"
              >每个listing最多8张，第一张为主图</span
            >）</template
          >
          <template #default="{ row, rowIndex }">
            <div class="image_list_row_item">
              <div class="image_content">
                <div class="image_row_top">
                  <div class="imgs_container_img flex-1">
                    <div
                      v-for="(item, imgIndex) in row.mainImageUrlList"
                      :key="item"
                      class="img_item"
                    >
                      <CardDragSort
                        :id="item + '_' + imgIndex"
                        :index="imgIndex"
                        :type="item.id + 'cardImg'"
                        :move-card="
                          (dragIndex, hoverIndex) => {
                            moveCardImg(dragIndex, hoverIndex, row);
                          }
                        "
                      >
                        <div class="disflex flex_d_column">
                          <div
                            style="position: relative"
                            @mouseenter="handleMouseEnter(imgIndex, rowIndex)"
                            @mouseleave="handleMouseLeave()"
                          >
                            <img
                              :src="item"
                              style="width: 80px; height: 80px"
                            />
                            <div
                              v-if="
                                showOverlay &&
                                activeImgIndex === imgIndex &&
                                activeRowIndex === rowIndex
                              "
                              class="img_overlay"
                            >
                              <el-button
                                type="primary"
                                size="small"
                                style="margin-bottom: 5px"
                                @click="setWhiteImage(row, imgIndex)"
                                >设为白底图</el-button
                              >
                              <el-button
                                type="primary"
                                :loading="screenLoading"
                                @click="setScreenImage(row, imgIndex)"
                                >设为场景图</el-button
                              >
                            </div>
                          </div>

                          <el-button
                            link
                            type="danger"
                            @click="handleRemoveImg(row, imgIndex)"
                            >移除</el-button
                          >
                        </div>
                      </CardDragSort>
                    </div>
                    <!-- </el-checkbox-group> -->
                  </div>
                </div>
                <div class="disflex image_row_bottom"></div>
              </div>
              <div class="image_row_right">
                <el-button
                  type="primary"
                  class="mr10"
                  @click="handleOpenUrlDialog('imageList', row)"
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
                    @click="handleLocalImage('imageList')"
                    >本地图片</el-button
                  >
                </el-upload>
                <el-button
                  type="primary"
                  @click="handleTplImg('imageList', row)"
                  >模板图片</el-button
                >
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="prodPSku" title="营销图" width="190">
          <template #default="{ row }">
            <div class="market_image_content">
              <div class="white_image">
                <div>1:1白底图</div>
                <ImagePop
                  :src="
                    row.marketSquareImageUrlList.length
                      ? row.marketSquareImageUrlList[0]
                      : ''
                  "
                />
                <el-button
                  type="primary"
                  link
                  class="mr10"
                  @click="handleOpenUrlDialog('white', row)"
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
                    link
                    class="mr10"
                    :loading="localImgLoading"
                    @click="handleLocalImage('white')"
                    >本地图片</el-button
                  >
                </el-upload>
                <el-button
                  type="primary"
                  link
                  @click="handleTplImg('white', row)"
                  >模板图片</el-button
                >
                <el-button type="danger" link @click="deleteWhiteImage(row)"
                  >移除</el-button
                >
              </div>
              <div class="scene_image">
                <div>3:4场景图</div>
                <ImagePop
                  :src="
                    row.marketLongImageUrlList.length
                      ? row.marketLongImageUrlList
                      : ''
                  "
                />
                <el-button
                  type="primary"
                  link
                  class="mr10"
                  @click="handleOpenUrlDialog('screen', row)"
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
                    link
                    class="mr10"
                    :loading="localImgLoading"
                    @click="handleLocalImage('screen')"
                    >本地图片</el-button
                  >
                </el-upload>
                <el-button
                  type="primary"
                  link
                  @click="handleTplImg('screen', row)"
                  >模板图片</el-button
                >
                <el-button type="danger" link @click="deleteScreenImage(row)"
                  >移除</el-button
                >
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="result" title="操作结果" width="120">
          <template #default="{ row }">
            <div
              v-if="row.result"
              :class="row.result === 1 ? 'success_msg' : 'fail_msg'"
            >
              {{ row.result === 1 ? '成功' : '失败' }}
            </div>
          </template>
        </vxe-column>
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
      :limit="tplImageLimit"
      :params="tplImgParams"
      @get-tpl-img="getTplImg"
    />
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { commonDivideComma } from '@/utils/divide';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import ImagePop from '@/components/ImagePop/index.vue';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  import { isUrl } from '@/utils/is';
  import { comBlobToDataURL } from '@/utils/upload';
  import { cloneDeep } from 'lodash-es';
  import { getStoreInfo } from '@/api/eBay/payments';
  import {
    batcheditPictureDetail,
    batcheditPictureSubmit
  } from '@/api/publishs/miraviaonline';
  import CardDragSort from '@/components/CardDragSort/index.vue';
  import { tansferImageApi } from '@/api/publishs/sheinpublish';

  const MAX_IMAGE_LENGTH = 8;

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedIdList: {
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

  const tableDataLoading = ref(false);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        await getStoreList();
        formData.value = {
          searchType: 1, // 选择的是父sku 1 还是子 2
          searchStr: '', // 选择完父子输入的内容
          storeAcctIdList: [] // 店铺 支持多选
        };
        paginationData.value = {
          total: 0,
          limit: 100,
          page: 1
        };

        addImageUrl.value = ''; // 新增图片url
        tableData.value = [];
        needFresh.value = false;

        if (props.checkedIdList.length) {
          paginationData.value.total = props.checkedIdList.length;
          await handleSearch(1);

          formData.value.searchStr = tableData.value
            .filter((item) => item.prodPSku)
            .map((item) => item.prodPSku)
            .join(',');

          formData.value.storeAcctIdList = tableData.value.map((item) =>
            Number(item.storeAcctId)
          );

          // 对列表数据进行初始化
          tableData.value = tableData.value.map((item) => ({
            ...item,
            oldMainImageUrlList: JSON.parse(
              JSON.stringify(item.mainImageUrlList)
            ), // 橱窗图
            oldMarketLongImageUrlList: JSON.parse(
              JSON.stringify(item.marketLongImageUrlList)
            ), // 场景图
            oldMarketSquareImageUrlList: JSON.parse(
              JSON.stringify(item.marketSquareImageUrlList)
            ) // 营销图
          }));
        }
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
      }
    }
  );

  const storeList = ref([]);
  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'miravia专员',
        orgId: '',
        salePersonId: '',
        platCode: 'miravia'
      };
      const { data } = await getStoreInfo(params);
      storeList.value = data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (newPage) => {
    // 父1 子2
    let obj = {};
    obj['prodPSkuStr'] =
      formData.value.searchType === 1 ? formData.value.searchStr : '';
    obj['prodSSkuStr'] =
      formData.value.searchType === 1 ? '' : formData.value.searchStr;

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
      const { data, count } = await batcheditPictureDetail({
        idList: props.checkedIdList,
        limit,
        page,
        ...obj
      });
      paginationData.value.total = count;
      tableData.value = data;

      tableData.value = tableData.value.map((item) => ({
        ...item,
        oldMainImageUrlList: JSON.parse(JSON.stringify(item.mainImageUrlList)), // 橱窗图
        oldMarketLongImageUrlList: JSON.parse(
          JSON.stringify(item.marketLongImageUrlList)
        ),
        oldMarketSquareImageUrlList: JSON.parse(
          JSON.stringify(item.marketSquareImageUrlList)
        )
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

  // 取消 清空搜索框
  const handleResetForm = () => {
    formData.value = {
      searchType: 'prodPSkuList',
      searchStr: '',
      storeAcctIdList: []
    };
  };

  // 点击新增图片
  const addImageUrl = ref();
  const handleAddNewImg = () => {
    if (!addImageUrl.value) return ElMessage.warning('图片地址不能为空');

    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    checkedList.forEach((item) => {
      recordRow = item;
      addRowImg([addImageUrl.value.trim()]);
    });
  };

  // 图片拖拽
  const moveCardImg = (dragIndex, hoverIndex, row) => {
    let imageListNew = cloneDeep(row.mainImageUrlList);
    let imageListOld = cloneDeep(row.mainImageUrlList);
    imageListNew.splice(dragIndex, 1, imageListOld[hoverIndex]);
    imageListNew.splice(hoverIndex, 1, imageListOld[dragIndex]);
    row.mainImageUrlList = imageListNew;
  };

  // 还原
  const handleRestore = () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    checkedList.forEach((item) => {
      item.mainImageUrlList = cloneDeep(item.oldMainImageUrlList);
      item.marketLongImageUrlList = cloneDeep(item.oldMarketLongImageUrlList);
      item.marketSquareImageUrlList = cloneDeep(
        item.oldMarketSquareImageUrlList
      );
    });
  };

  //  网络图片
  const imgUrlVisible = ref(false);
  const imgUrls = ref();
  const networkImageType = ref('');
  let recordRow = null;
  const handleOpenUrlDialog = (type, row) => {
    imgUrlVisible.value = true;
    imgUrls.value = '';
    recordRow = row;
    networkImageType.value = type;
  };

  // 保存网络图片
  const handleSaveUrl = () => {
    const imgList = imgUrls.value.split('\n').filter((item) => !!item);
    if (!imgList.length) {
      return ElMessage.warning('请输入图片地址');
    }
    // 判断url是否合法
    if (imgList.some((item) => !isUrl(item))) {
      return ElMessage.warning('输入地址不合法');
    }
    // 判断是哪个网络图片按钮
    if (networkImageType.value === 'imageList') {
      addRowImg(imgList);
    } else if (networkImageType.value === 'white') {
      recordRow.marketSquareImageUrlList = imgList;
    } else if (networkImageType.value === 'screen') {
      handleSetScene(imgList[0]);
    }
    imgUrlVisible.value = false;
  };

  // 新增图片
  const addRowImg = (newImageList) => {
    const afterImgLength = MAX_IMAGE_LENGTH - recordRow.mainImageUrlList.length;
    if (afterImgLength - newImageList.length < 0) {
      ElMessageBox.confirm(
        '此次修改部分listing图片数量大于八张，是否倒序删除至仅保留八张图片',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 将listing内图片从后往前删除到仅保留8张图片
          if (newImageList.length > MAX_IMAGE_LENGTH) {
            recordRow.mainImageUrlList = newImageList.slice(0, 8);
          } else {
            recordRow.mainImageUrlList = newImageList
              .concat(recordRow.mainImageUrlList)
              .slice(0, 8);
          }
        })
        .catch(() => {});
    } else {
      recordRow.mainImageUrlList = newImageList.concat(
        recordRow.mainImageUrlList
      );
    }
  };

  const localImageType = ref('');
  const handleLocalImage = (type) => {
    localImageType.value = type;
  };

  // 本地图片
  const localImgLoading = ref(false);
  const handleUpload = (row, rawFile) => {
    recordRow = row;
    comBlobToDataURL(rawFile.file, (url) => {
      if (localImageType.value === 'imageList') {
        addRowImg([url]);
      } else if (localImageType.value === 'white') {
        recordRow.marketSquareImageUrlList = [url];
      } else if (localImageType.value === 'screen') {
        handleSetScene(url);
      }
    });
  };

  // 模板图片
  const tplImageLimit = ref(8);
  const templateImageType = ref('');
  const tplImgParams = ref();
  const tplImgVisible = ref(false);
  const handleTplImg = (type, row) => {
    templateImageType.value = type;
    // 只有橱窗图可以设置八张图片 营销图一张
    tplImageLimit.value =
      type === 'imageList' ? 8 - row.mainImageUrlList.length : 1;

    tplImgParams.value = {
      platCode: 'miravia',
      prodPSkus: [row.prodPSku]
    };
    tplImgVisible.value = true;
    recordRow = row;
  };

  // 更新模板图片
  const getTplImg = (imgUrlList) => {
    if (templateImageType.value === 'imageList') {
      addRowImg(imgUrlList);
    } else if (templateImageType.value === 'white') {
      recordRow.marketSquareImageUrlList = imgUrlList;
    } else if (templateImageType.value === 'screen') {
      handleSetScene(imgUrlList[0]);
    }
  };

  // 设为场景图
  const handleSetScene = (url) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let image = new Image();
    image.src = url;
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = async () => {
      const realWidth = image.width;
      const realHeight = image.height;
      canvas.width = realWidth - 250;
      canvas.height = realHeight;
      // // 在 canvas 上绘制原始图片，并缩放到目标尺寸
      // 将左右各裁剪125像素后， 放入3:4场景图
      ctx.drawImage(
        image,
        125,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      // 将 canvas 转换为新的图片文件
      const newImageURL = canvas.toDataURL('image/jpeg');
      // 将图片base64转换为图片链接
      let reg =
        /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
      if (reg.test(newImageURL)) {
        let obj = {
          base64FileStr: newImageURL
        };
        try {
          const { code, msg } = await tansferImageApi(obj);
          if (code === '0000') {
            recordRow.marketLongImageUrlList = [msg];
            ElMessage.success('设置场景图成功!');
          }
        } catch (err) {
          console.log(err);
          recordRow.marketLongImageUrlList = [url];
          ElMessage.success('设置场景图成功!');
        } finally {
          screenLoading.value = false;
        }
      }
    };
  };

  const showOverlay = ref(false);
  const activeImgIndex = ref(-1);
  const activeRowIndex = ref(-1);

  // 删除橱窗图
  const handleRemoveImg = (row, imgIndex) => {
    recordRow = row;
    recordRow.mainImageUrlList.splice(imgIndex, 1);
  };

  const handleMouseEnter = (imgIndex, rowIndex) => {
    showOverlay.value = true;
    activeImgIndex.value = imgIndex;
    activeRowIndex.value = rowIndex;
  };

  const handleMouseLeave = () => {
    showOverlay.value = false;
  };

  const screenLoading = ref(false);
  // 设为白底图
  const setWhiteImage = (row, imgIndex) => {
    recordRow = row;
    recordRow.marketSquareImageUrlList = [recordRow.mainImageUrlList[imgIndex]];
    ElMessage.warning('设置白底图成功！');
  };

  // 设为场景图
  const setScreenImage = (row, imgIndex) => {
    recordRow = row;
    const url = recordRow.mainImageUrlList[imgIndex];
    screenLoading.value = true;
    handleSetScene(url);
  };

  // 移除白底图
  const deleteWhiteImage = (row) => {
    recordRow = row;
    recordRow.marketSquareImageUrlList = [];
  };

  // 移除场景图
  const deleteScreenImage = (row) => {
    recordRow = row;
    recordRow.marketLongImageUrlList = [];
  };

  // 批量调整(勾选的橱窗图 必须大于0)
  const batchUpdateLoading = ref(false);
  const handleBatchUpdate = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据！');

    const withoutMainImageRow = checkedList.every(
      (item) => item.mainImageUrlList.length > 0
    );
    if (withoutMainImageRow === false) {
      return ElMessage.warning('所有勾选数据至少要选择1张橱窗图!');
    }

    let params = checkedList.map((item) => ({
      id: item.id,
      storeAcctId: item.storeAcctId,
      prodPSku: item.prodPSku,
      productId: item.productId,
      mainImageUrlList: item.mainImageUrlList,
      marketLongImageUrlList: item.marketLongImageUrlList,
      marketSquareImageUrlList: item.marketSquareImageUrlList
    }));

    try {
      batchUpdateLoading.value = true;
      const { data, msg } = await batcheditPictureSubmit(params);
      needFresh.value = true;
      ElMessage.success(msg);

      checkedList.forEach((item) => {
        data.forEach((cItem) => {
          if (item.productId === cItem.productId) {
            item.result = Number(cItem.operResult);
          }
        });
      });
    } catch (err) {
      console.log('err :>> ', err);
    }
    batchUpdateLoading.value = false;
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  :deep(.el-checkbox.el-checkbox--small) {
    height: inherit;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .imgs_container_img {
    display: flex;
    flex-wrap: wrap;
    .img_item {
      margin: 5px 8px;
    }
  }
  .flex_d_column {
    flex-direction: column;
  }
  .img_overlay {
    position: absolute;
    top: 0;
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
  }
  .image_list_row_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    .image_content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .image_row_right {
      width: 100px;
      text-align: center;
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
  .mb10 {
    margin-bottom: 10px;
  }
  .mr-5 {
    margin-right: 5px;
  }
  .disflex {
    display: flex;
  }
  .disflex_between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .market_image_content {
    display: flex;
    font-size: 14px;
    .white_image,
    .scene_image {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .white_image {
      margin-right: 10px;
    }
  }
  .success_msg {
    color: #67c23a;
  }
  .fail_msg {
    color: #f56c6c;
  }
</style>
<style lang="scss">
  .img_overlay {
    .el-button {
      padding: 2px;
      span {
        font-size: 12px;
      }
    }
  }
</style>
