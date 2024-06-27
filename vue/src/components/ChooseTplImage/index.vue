<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="55%"
    top="3%"
    :append-to-body="false"
    :close-on-click-modal="false"
    align-center
    @close="handleCancel"
  >
    <el-tabs v-if="imageList.length" v-model="curTab">
      <el-tab-pane
        v-for="(tabItem, tabIndex) in imageList"
        :key="tabItem.prodPId"
        :label="tabItem.prodPSku"
        :name="tabIndex"
      >
        <div
          v-if="
            tabItem.mainImgs?.length ||
            tabItem.checkedAllAssiImgs?.length ||
            tabItem.checkedAllOtherSelfiesImages?.length ||
            tabItem.checkedAllProductVariationImages?.length ||
            tabItem.checkedAllNasAmazonImages?.length
          "
          class="img_container"
        >
          <div>
            <el-checkbox
              v-model="tabItem.isSupplierOrigiImg"
              label="供应商原图"
              size="large"
              disabled
            />
          </div>
          <div></div>
          <div class="main_image">
            <div class="main_left">
              <div>主图</div>
              <el-checkbox
                v-model="tabItem.checkedAllMainImgs"
                label="全选"
                size="large"
                @change="
                  handleCheckedAllImage('mainImgs', $event, tabItem.mainImgs)
                "
              />
            </div>
            <div class="main_right">
              <div
                v-for="(item, index) in tabItem.mainImgs"
                :key="index"
                class="image_item"
              >
                <div class="image_item_box">
                  <div style="flex: 1">
                    <div class="image_item_box_top">
                      <el-checkbox
                        v-model="item.isWhite"
                        label="白底图"
                        size="small"
                        disabled
                      />
                      <el-checkbox
                        v-model="item.isNotSupplier"
                        label="非供图"
                        size="small"
                        disabled
                      />
                    </div>
                    <div class="image_item_box_bottom">
                      <el-checkbox
                        v-model="item.checked"
                        style="margin-left: 5px; margin-top: -5px"
                        size="large"
                        @change="
                          handleCheckedImage(
                            'mainImgs',
                            'checkedAllMainImgs',
                            item
                          )
                        "
                      ></el-checkbox>
                      <img :src="item.name" class="item_img" />
                      <div
                        v-if="getCheckedImgIndex(item) > -1"
                        class="item_checked_order"
                      >
                        {{ getCheckedImgIndex(item) + 1 }}
                      </div>
                    </div>
                  </div>
                  <div v-if="item.isSelfImg" class="image_self">自拍图</div>
                </div>
              </div>
            </div>
          </div>
          <div class="assist_image">
            <div class="assist_left">
              <div>辅图</div>
              <el-checkbox
                v-model="tabItem.checkedAllAssiImgs"
                label="全选"
                size="large"
                @change="
                  handleCheckedAllImage('assiImgs', $event, tabItem.assiImgs)
                "
              />
            </div>
            <div class="assist_right">
              <div
                v-for="(item, index) in tabItem.assiImgs"
                :key="index"
                class="image_item"
              >
                <div class="image_item_box">
                  <div style="flex: 1">
                    <div class="image_item_box_top">
                      <el-checkbox
                        v-model="item.isMust"
                        label="必选图"
                        size="small"
                        disabled
                      />
                      <el-checkbox
                        v-model="item.isNotSupplier"
                        label="非供图"
                        size="small"
                        disabled
                      />
                      <el-checkbox
                        v-model="item.isWhite"
                        label="白底图"
                        size="small"
                        disabled
                      />
                      <el-checkbox
                        v-model="item.ifSize"
                        label="尺寸图"
                        size="small"
                        disabled
                      />
                    </div>
                    <div class="image_item_box_bottom">
                      <el-checkbox
                        v-model="item.checked"
                        style="margin-left: 5px; margin-top: -5px"
                        size="large"
                        @change="
                          handleCheckedImage(
                            'assiImgs',
                            'checkedAllAssiImgs',
                            item
                          )
                        "
                      ></el-checkbox>
                      <img :src="item.name" class="item_img" />
                      <div
                        v-if="getCheckedImgIndex(item) > -1"
                        class="item_checked_order"
                      >
                        {{ getCheckedImgIndex(item) + 1 }}
                      </div>
                    </div>
                  </div>
                  <div v-if="item.isSelfImg" class="image_self">自拍图</div>
                </div>
              </div>
            </div>
          </div>
          <div class="other_image">
            <div class="other_left">
              <div>其他自拍图</div>
              <el-checkbox
                v-model="tabItem.checkedAllOtherSelfiesImages"
                label="全选"
                size="large"
                @change="
                  handleCheckedAllImage(
                    'otherSelfiesImages',
                    $event,
                    tabItem.otherSelfiesImages
                  )
                "
              />
            </div>
            <div class="other_right">
              <div
                v-for="(item, index) in tabItem.otherSelfiesImages"
                :key="index"
                class="image_item_old"
              >
                <el-checkbox
                  v-model="item.checked"
                  style="margin-left: 5px; margin-top: -5px"
                  size="large"
                  @change="
                    handleCheckedImage(
                      'otherSelfiesImages',
                      'checkedAllOtherSelfiesImages',
                      item
                    )
                  "
                ></el-checkbox>
                <img :src="item.name" class="item_img" />
                <div
                  v-if="getCheckedImgIndex(item) > -1"
                  class="item_checked_order"
                >
                  {{ getCheckedImgIndex(item) + 1 }}
                </div>
              </div>
            </div>
          </div>
          <div class="product_image">
            <div class="product_left">
              <div>产品变种图</div>
              <el-checkbox
                v-model="tabItem.checkedAllProductVariationImages"
                label="全选"
                size="large"
                @change="
                  handleCheckedAllImage(
                    'productVariationImages',
                    $event,
                    tabItem.productVariationImages
                  )
                "
              />
            </div>
            <div class="product_right">
              <div
                v-for="(item, index) in tabItem.productVariationImages"
                :key="index"
                class="image_item"
              >
                <div class="image_item_box">
                  <div style="flex: 1">
                    <div class="image_item_box_top">
                      <el-checkbox
                        v-model="item.isNotSupplier"
                        label="非供图"
                        size="small"
                        disabled
                      />
                      <el-checkbox
                        v-model="item.isWhite"
                        label="白底图"
                        size="small"
                        disabled
                      />
                    </div>
                    <div class="image_item_box_bottom">
                      <el-checkbox
                        v-model="item.checked"
                        style="margin-left: 5px; margin-top: -5px"
                        size="large"
                        @change="
                          handleCheckedImage(
                            'productVariationImages',
                            'checkedAllProductVariationImages',
                            item
                          )
                        "
                      ></el-checkbox>
                      <img :src="item.name" class="item_img" />
                      <div
                        v-if="getCheckedImgIndex(item) > -1"
                        class="item_checked_order"
                      >
                        {{ getCheckedImgIndex(item) + 1 }}
                      </div>
                    </div>
                  </div>
                  <div v-if="item.isSelfImg" class="image_self">自拍图</div>
                </div>
              </div>
            </div>
          </div>
          <div class="nas_image">
            <div class="nas_left">
              <div>NAS亚马逊图</div>
              <el-checkbox
                v-model="tabItem.checkedAllNasAmazonImages"
                label="全选"
                size="large"
                @change="
                  handleCheckedAllImage(
                    'nasAmazonImages',
                    $event,
                    tabItem.nasAmazonImages
                  )
                "
              />
            </div>
            <div class="nas_right">
              <div
                v-for="(item, index) in tabItem.nasAmazonImages"
                :key="index"
                class="image_item_old"
              >
                <el-checkbox
                  v-model="item.checked"
                  style="margin-left: 5px; margin-top: -5px"
                  size="large"
                  @change="
                    handleCheckedImage(
                      'nasAmazonImages',
                      'checkedAllNasAmazonImages',
                      item
                    )
                  "
                ></el-checkbox>
                <img :src="item.name" class="item_img" />
                <div
                  v-if="getCheckedImgIndex(item) > -1"
                  class="item_checked_order"
                >
                  {{ getCheckedImgIndex(item) + 1 }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无数据" />
      </el-tab-pane>
    </el-tabs>
    <el-empty v-else description="暂无数据" />
    <template #footer>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import { getOriginImageApi } from '@/api/publishs/sheinpublish';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    params: {
      type: [Object, Array],
      default: () => ({})
    },
    limit: {
      type: [Number, String],
      default: 0
    },
    // wang-editor 点击模板图片不限制选择图片个数
    isBatchUpdateDesc: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(['update:modelValue', 'getTplImg']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const title = ref('');
  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) {
        getImageList();
        title.value = props.isBatchUpdateDesc
          ? '模板图片'
          : `模板图片-当前可选${props.limit}张图片`;
      }
    }
  );

  // 获取图片
  const imageList = ref([]);
  const curTab = ref(0);
  const getImageList = async () => {
    try {
      const { data } = await getOriginImageApi(props.params);
      mainCheckedUrlList.value = [];
      if (Array.isArray(data) && data.length) {
        curTab.value = 0;
        imageList.value = data.map((item) => ({
          ...item,
          checkedAllMainImgs: false,
          mainImgs: (item.mainImgs || []).map((v) => ({
            ...v,
            checked: false,
            isPopover: false
          })),
          checkedAllAssiImgs: false,
          assiImgs: (item.assiImgs || []).map((v) => ({
            ...v,
            checked: false,
            isPopover: false
          })),
          checkedAllOtherSelfiesImages: false,
          otherSelfiesImages: (item.otherSelfiesImages || []).map((v) => ({
            ...v,
            checked: false,
            isPopover: false
          })),
          checkedAllProductVariationImages: false,
          productVariationImages: (item.productVariationImages || []).map(
            (v) => ({
              ...v,
              checked: false,
              isPopover: false
            })
          ),
          checkedAllNasAmazonImages: false,
          nasAmazonImages: (item.nasAmazonImages || []).map((v) => ({
            ...v,
            checked: false,
            isPopover: false
          }))
        }));
      } else {
        imageList.value = [];
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleCheckedAllImage = (type, val, list) => {
    list.forEach((item) => {
      const mainIndex = mainCheckedUrlList.value.findIndex(
        (main) => main.id === item.id
      );
      if (mainIndex > -1) {
        mainCheckedUrlList.value.splice(mainIndex, 1);
      }

      if (val) {
        mainCheckedUrlList.value.push({
          name: item.name,
          id: item.id
        });
      }
    });
    imageList.value[curTab.value][type] = imageList.value[curTab.value][
      type
    ].map((item) => ({ ...item, checked: val }));
  };

  const mainCheckedUrlList = ref([]);
  const getCheckedImgIndex = (item) => {
    return mainCheckedUrlList.value.findIndex((main) => main.id === item.id);
  };
  const handleCheckedImage = (type, checkAllType, item) => {
    const mainIndex = mainCheckedUrlList.value.findIndex(
      (main) => main.id === item.id
    );
    if (mainIndex > -1) {
      mainCheckedUrlList.value.splice(mainIndex, 1);
    } else {
      mainCheckedUrlList.value.push({
        name: item.name,
        id: item.id
      });
    }
    nextTick(() => {
      const unChecked = imageList.value[curTab.value][type].filter(
        (item) => !item.checked
      );
      imageList.value[curTab.value][checkAllType] = !unChecked.length;
    });
  };

  const handleSubmit = () => {
    // 获取选中的图片
    let checkedUrlList = mainCheckedUrlList.value.map((item) => item.name);
    // let checkedUrlList = [];
    // imageList.value.forEach((item) => {
    //   item.mainImgs.forEach((v) => {
    //     if (v.checked) {
    //       checkedUrlList.push(v.name);
    //     }
    //   });
    //   item.assiImgs.forEach((v) => {
    //     if (v.checked) {
    //       checkedUrlList.push(v.name);
    //     }
    //   });
    //   item.otherSelfiesImages.forEach((v) => {
    //     if (v.checked) {
    //       checkedUrlList.push(v.name);
    //     }
    //   });
    //   item.productVariationImages.forEach((v) => {
    //     if (v.checked) {
    //       checkedUrlList.push(v.name);
    //     }
    //   });
    //   item.nasAmazonImages.forEach((v) => {
    //     if (v.checked) {
    //       checkedUrlList.push(v.name);
    //     }
    //   });
    // });
    // wang-editor 不限制图片数量
    if (checkedUrlList.length > props.limit && !props.isBatchUpdateDesc) {
      return ElMessage.warning(
        `最多支持${props.limit}张图片,已选中${checkedUrlList.length}`
      );
    }
    emits('getTplImg', checkedUrlList);
    dialogVisible.value = false;
  };
  const handleCancel = () => {
    dialogVisible.value = false;
  };
</script>
<style lang="scss" scoped>
  .img_container {
    max-height: 550px;
    overflow-y: auto;
  }
  .main_image,
  .assist_image,
  .other_image,
  .product_image,
  .nas_image {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
  }
  .main_left,
  .assist_left,
  .other_left,
  .product_left,
  .nas_left {
    width: 100px;
    padding-top: 10px;
    min-height: 40px;
    box-sizing: border-box;
  }
  .main_right,
  .assist_right,
  .other_right,
  .product_right,
  .nas_right {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .image_item_old {
    position: relative;
    width: 100px;
    height: 100px;
    margin-left: 10px;
    margin-bottom: 10px;
    border: 1px dashed #ddd;
    .el-checkbox {
      position: absolute;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .image_item {
    position: relative;
    margin-left: 10px;
    margin-bottom: 10px;
    border: 1px dashed #aaa;
  }
  .image_item_box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    border-radius: 5px;
    .image_item_box_top {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 4px;
      .el-checkbox {
        margin: 1px;
      }
    }
    .image_item_box_bottom {
      position: relative;
      .el-checkbox {
        position: absolute;
        top: 15px;
        left: -3px;
        height: 15px;
        margin-top: 5px;
        margin-right: 0;
      }
      img {
        width: 130px;
        height: 120px;
      }
      .item_checked_order {
        position: absolute;
        width: 14px;
        height: 14px;
        padding: 1px;
        left: 0;
        bottom: 0;
        border-radius: 50%;
        border: 1px solid #000;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .image_self {
      width: 20px;
      padding-left: 2px;
      color: red;
      text-align: center;
    }
  }
</style>
<style>
  #screenShotPanel {
    z-index: 9999;
  }
</style>
