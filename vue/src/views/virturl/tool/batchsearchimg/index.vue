<template>
  <div class="app-container batch_search_img_container">
    <el-card ref="batchSearchImgRef" class="common_split_bottom search_card">
      <div style="padding: 20px">
        <div class="batch_import">
          <div
            id="paste_img"
            in="innerImage"
            style="width: 150px; height: 150px"
            contenteditable="true"
            @paste="handlePaste"
            @drop="handleDomDrop"
            @click="getDelete"
          ></div>
          <el-upload
            action
            class="mr20"
            :http-request="handleUpload"
            :show-file-list="false"
          >
            <el-button type="primary" :loading="importLoading"
              >导入批量搜图</el-button
            >
          </el-upload>
        </div>
        <div class="batch_export">
          <div class="export_box">
            <el-button
              type="primary"
              :loading="exportLoading"
              @click="handleExport"
              >导出</el-button
            >
            <span>疑似相同sku: 商品列表在售商品图片得分0.7以上的商品</span>
          </div>

          <div>
            <el-select
              v-model="platCode"
              placeholder="平台"
              size="default"
              style="margin-right: 20px; width: 200px"
              clearable
              @change="handlePlatChange"
            >
              <el-option
                v-for="item in platNameList"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
            <el-select
              v-model="siteCode"
              placeholder="站点"
              size="default"
              style="margin-right: 20px; width: 200px"
              multiple
              collapse-tags
              collapse-tags-tooltip
              clearable
            >
              <el-option
                v-for="item in siteCodeList"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
            <el-button
              type="primary"
              :loading="setpriceLoading"
              @click="handleSetPrice()"
              >定价</el-button
            >
          </div>
        </div>
      </div>

      <div>
        <vxe-grid ref="tableRef" v-bind="gridOptions" class="search_img_table">
          <!-- 图片 -->
          <template #img_header>
            <div class="batch_theader-th w80">原图</div>
          </template>
          <template #batch_imageUrls="{ row }">
            <ImagePop :src="row.sourceImage" />
          </template>
          <!-- 自定义skuList表头skuList_header -->
          <template #skuList_header>
            <div class="batch_theader">
              <div class="batch_theader-th w42">
                <el-checkbox
                  v-model="allChecked"
                  @change="handleCheckAllChange"
                ></el-checkbox>
              </div>
              <div class="batch_theader-th w100">疑似相同图片</div>
              <div class="batch_theader-th w140">疑似相同SKU</div>
              <div class="batch_theader-th w120">商品名称</div>
              <div class="batch_theader-th w100">采购成本(￥)</div>
              <div class="batch_theader-th w80">毛重(g)</div>
              <div class="batch_theader-th w120">外箱长宽高(cm)</div>
              <div class="batch_theader-th w100">开发专员</div>
              <div class="batch_theader-th w80">30天销量</div>
              <div class="batch_theader-th w-200">采购链接</div>

              <div
                v-for="(item, index) in addTitleList"
                :key="index"
                class="batch_theader-th w120"
              >
                {{ item.title }}
              </div>
            </div>
          </template>
          <!-- 自定义skuList展示 -->
          <template #batch_skuList="{ row }">
            <div v-if="row.prodImageAliyunSearchNewDtoList.length > 0">
              <div
                v-for="item in row.prodImageAliyunSearchNewDtoList"
                :key="item.id"
                class="batch_tbody"
              >
                <div class="batch_tbody-td w42">
                  <el-checkbox
                    v-model="item.checked"
                    @change="changeSubChecked"
                  ></el-checkbox>
                </div>
                <div class="batch_tbody-td w100">
                  <ImagePop :src="item.name" width="60px" height="60px" />
                </div>

                <div class="batch_tbody-td w140">
                  <div>
                    {{ item.ssku }}
                  </div>
                  <div>父：{{ item.psku || '' }}</div>
                </div>
                <div class="batch_tbody-td w120">
                  {{ item.prodFullName }}
                  <div style="color: grey">
                    分类： {{ item.leafCategoryName }}
                  </div>
                </div>
                <div class="batch_tbody-td w100">
                  {{ item.cost }}
                </div>
                <div class="batch_tbody-td w80">
                  {{ item.weight }}
                </div>
                <div class="batch_tbody-td w120">
                  {{ item.outerBoxLength }} * {{ item.outerBoxWidth }} *
                  {{ item.outerBoxHeight }}
                </div>
                <div class="batch_tbody-td w100">
                  {{ item.developName }}
                </div>
                <div class="batch_tbody-td w80">
                  {{ item.sales30th }}
                </div>
                <div class="batch_tbody-td w-200">
                  <a
                    :href="item.purchaseUrl"
                    target="_blank"
                    class="text_ellipsis"
                    >{{ item.purchaseUrl }}</a
                  >
                </div>

                <div
                  v-for="(citem, cindex) in addTitleList"
                  :key="cindex"
                  class="batch_tbody-td w120"
                >
                  <span v-if="citem.platCode !== 'ebay'">{{
                    item[`listingPrice${citem.platCode}${citem.siteName}`]
                  }}</span>
                  <span v-else>{{
                    item[
                      `listingPrice${citem.platCode}${citem.siteName}${citem.stockLocation}`
                    ]
                  }}</span>
                </div>
              </div>
            </div>
            <div v-else>无子数据</div>
          </template>
        </vxe-grid>
      </div>
      <div style="display: none">
        <vxe-table
          ref="exportTableRef"
          height="300"
          :row-config="{ isHover: true }"
          :data="selectData"
        >
          <vxe-column title="原图" field="sourceImage" width="200"></vxe-column>
          <vxe-column title="疑似相同子SKU" field="ssku"></vxe-column>
          <vxe-column title="疑似相同父SKU" field="psku"></vxe-column>
          <vxe-column title="商品名称" field="prodFullName"></vxe-column>
          <vxe-column title="分类" field="leafCategoryName"></vxe-column>
          <vxe-column title="采购成本(￥)" field="cost"></vxe-column>
          <vxe-column title="毛重(g)" field="weight"></vxe-column>
          <vxe-column title="外箱长(cm)" field="outerBoxLength"></vxe-column>
          <vxe-column title="外箱宽(cm)" field="outerBoxWidth"></vxe-column>
          <vxe-column title="外箱高(cm)" field="outerBoxHeight"></vxe-column>
          <vxe-column title="开发专员" field="developName"></vxe-column>
          <vxe-column title="30天销量" field="sales30th"></vxe-column>
          <vxe-column title="采购链接" field="purchaseUrl"></vxe-column>
          <vxe-column
            v-for="(item, index) in addTitleList"
            :key="index"
            :title="item.title"
            :field="
              item.platCode === 'ebay'
                ? `listingPrice${item.platCode}${item.siteName}${item.stockLocation}`
                : `listingPrice${item.platCode}${item.siteName}`
            "
          >
          </vxe-column>
        </vxe-table>
      </div>
    </el-card>
  </div>
</template>

<script setup name="virturltoolbatchsearchimg">
  import { onMounted, ref, reactive, computed } from 'vue';
  import { getPlatNameApi } from '@/api/common/index.js';
  import {
    getSiteByPlatApi,
    importImgExccelApi,
    setPriceApi,
    singleImgSearchApi,
    getExcelImgApi
  } from '@/api/virturl/batchsearchimg.js';
  import ImagePop from '@/components/ImagePop/index.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  onMounted(() => {
    getPlatNameList();
    handleDrag();
  });
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 330;
  });

  const tableRef = ref(null);
  const gridOptions = reactive({
    border: true,
    // showOverflow: true,
    loading: false,
    height: height,
    // scrollX: true,
    rowConfig: {
      isHoverRow: true
    },
    columnConfig: {
      resizable: true
    },
    toolbarConfig: {
      custom: false
    },
    columns: [
      {
        field: 'imageUrls',
        title: '原图',
        fixed: 'left',
        width: 100,
        slots: {
          header: 'img_header',
          default: 'batch_imageUrls'
        }
      },
      {
        field: 'skuList',
        // resizable: true,
        slots: { header: 'skuList_header', default: 'batch_skuList' }
      }
    ],
    data: []
  });

  const platNameList = ref([]);
  const siteCodeList = ref([]);
  const platCode = ref('');
  const siteCode = ref([]);

  const allChecked = ref(false);

  const getPlatNameList = async () => {
    try {
      const { data } = await getPlatNameApi();
      platNameList.value = data;
    } catch (err) {
      console.log(err);
    }
  };
  // 根据平台获取站点
  const handlePlatChange = async (val) => {
    siteCode.value = [];
    try {
      const { data } = await getSiteByPlatApi({ platCode: val });
      siteCodeList.value = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 勾选全部/反选
  const handleCheckAllChange = () => {
    similarImgInfoList.value?.forEach((item) => {
      item.prodImageAliyunSearchNewDtoList?.forEach((cItem) => {
        cItem.checked = allChecked.value;
      });
    });
  };

  // 子表格数据勾选
  const changeSubChecked = () => {
    // 判断是否全部勾选
    const hasUnchecked = similarImgInfoList.value?.some((item) => {
      return item.prodImageAliyunSearchNewDtoList?.some(
        (subItem) => subItem.checked === false
      );
    });
    if (hasUnchecked) {
      // 存在未勾选的数据
      allChecked.value = false;
    } else {
      allChecked.value = true;
    }
  };

  // 批量导入
  // 返回一串字符串 根据字符串再请求 返回sku数据
  const similarImgInfoList = ref([]); // 相似的图片数据
  const randomStrList = ref([]); // 随机字符串列表
  const handleUpload = async (rawFile) => {
    try {
      const formData = new FormData();
      formData.append('file', rawFile.file);
      importLoading.value = true;
      const { code, data } = await importImgExccelApi(formData);
      if (code === '0000') {
        randomStrList.value = data;
        similarImgInfoList.value = [];
        handleBatchRequest(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 批量请求数据 按照返回的字符串顺序
  const handleBatchRequest = async () => {
    getSimilarSku(randomStrList.value[0]);
  };

  const importLoading = ref(false);
  const getSimilarSku = async (id) => {
    const { code, data, extra } = await getExcelImgApi({
      queryId: id
    });

    if (code === '0000') {
      if (extra) {
        // 每张图搜出来只有一个sku符合，则默认checkbok选中
        data?.forEach((item) => {
          item.prodImageAliyunSearchNewDtoList?.forEach((cItem) => {
            cItem.checked = false;
          });
          if (item.prodImageAliyunSearchNewDtoList?.length === 1) {
            item.prodImageAliyunSearchNewDtoList[0].checked = true;
          }
        });
        similarImgInfoList.value = similarImgInfoList.value.concat(data);
        gridOptions.data = similarImgInfoList.value;

        // 调用定价接口
        if (addTitleList.value.length > 0) {
          getLoopRequest(data);
        }
        // extra字段为true，继续请求数组下一个元素
        const nextIndex = randomStrList.value.indexOf(id) + 1;
        if (nextIndex < randomStrList.value.length) {
          await getSimilarSku(randomStrList.value[nextIndex]);
        }
        if (nextIndex === randomStrList.value.length) {
          importLoading.value = false;
          return ElMessage.success('导入批量搜图处理完毕');
        }
      } else {
        setTimeout(async () => {
          // 如果返回的数据中extra字段为false，则重新请求当前接口
          await getSimilarSku(id);
        }, 2000);
      }
    } else {
      importLoading.value = false;
    }
  };

  // 定价
  // const requestList = ref([]);
  const addTitleList = ref([]); // 要添加的表头
  const setpriceLoading = ref(false);
  const handleSetPrice = async () => {
    if (similarImgInfoList.value?.length === 0) {
      return ElMessage.warning('请先导入图片进行搜图');
    }
    if (platCode.value === '') {
      return ElMessage.warning('请先选择平台');
    }
    getLoopRequest(similarImgInfoList.value);
  };

  let requestList = ref([]);
  const getLoopRequest = async (infoList) => {
    for (let idx = 0; idx < infoList.length; idx++) {
      const item = infoList[idx];
      const list = item.prodImageAliyunSearchNewDtoList;

      requestList.value = [];
      for (let cIdx = 0; cIdx < list.length; cIdx++) {
        const requestData = list[cIdx];
        // 发送请求并等待请求完成
        setpriceLoading.value = true;

        requestList.value.push(setPriceRequest1(requestData, idx, cIdx));
      }

      await Promise.allSettled(requestList.value).then((res) => {
        setpriceLoading.value = false;
        // res 是多条子数据的定价数据
        res?.forEach((info) => {
          info.value.data?.forEach((cItem) => {
            let stockLocation = '';
            if (cItem.platCode === 'ebay') {
              stockLocation = cItem.stockLocationShow || '';
            }
            let title =
              cItem.platCode +
              '-' +
              (cItem.siteName || '') +
              stockLocation +
              '(' +
              cItem.locationCurrency +
              ')';
            let params = {
              title,
              platCode: cItem.platCode,
              siteName: cItem.siteName || undefined,
              stockLocation: stockLocation
            };
            addTitleList.value.push(params);
          });
          let allTitleSite = addTitleList.value?.map((item) => item.siteName);
          siteLists.value?.forEach((item) => {
            if (allTitleSite.includes(item) == false) {
              let title = platCode.value + '-' + item;
              let params = {
                title,
                platCode: platCode.value,
                siteName: item
              };
              addTitleList.value.push(params);
            }
          });
          // 已有的表头进行去重处理
          addTitleList.value = addTitleList.value.filter(
            (item, index, self) => {
              return index === self.findIndex((t) => t.title === item.title);
            }
          );
          // 填充表格中的定价数据
          let targetItem =
            infoList[info.value.idx]?.prodImageAliyunSearchNewDtoList[
              info.value.cIdx
            ];
          addTitleList.value?.forEach((item) => {
            info.value.data?.forEach((cItem) => {
              if (
                item.siteName == cItem.siteName &&
                item.platCode === cItem.platCode
              ) {
                if (
                  item.platCode === 'ebay' &&
                  item.stockLocation === cItem.stockLocationShow
                ) {
                  targetItem[
                    `listingPrice${item.platCode}${item.siteName}${item.stockLocation}`
                  ] = cItem.listingPrice;
                } else {
                  targetItem[`listingPrice${item.platCode}${item.siteName}`] =
                    cItem.listingPrice;
                }
              }
            });
          });
        });
      });
    }
  };

  const siteLists = ref([]);
  const setPriceRequest1 = (info, idx, cIdx) => {
    return new Promise((resolve) => {
      // 定价要添加表头 站点
      // 获取选择的站点数据，如果没有选择，那么就是当前平台下的所有站点
      let siteList = siteCode.value?.length
        ? siteCode.value
        : siteCodeList.value;
      let existPlatCode = [];
      let existSiteCode = [];
      if (addTitleList.value.length > 0) {
        existPlatCode = addTitleList.value.map((item) => item.platCode);
        addTitleList.value.forEach((item) => {
          if (item.siteName) {
            existSiteCode.push(item.siteName);
          }
        });
        existSiteCode = existSiteCode ? [...new Set(existSiteCode)] : [];
      }
      let platCodeNameList = [platCode.value].concat(existPlatCode);

      platCodeNameList = [...new Set(platCodeNameList)];
      siteList = siteList.concat(existSiteCode);
      siteList = [...new Set(siteList)];
      siteLists.value = siteList;

      let params = {
        price: info.cost,
        weight: info.weight,
        logisAttrList: '',
        platCodeNameList: platCodeNameList,
        siteList,
        // grossProfitRate: '',
        outerBoxLength: info.outerBoxLength,
        outerBoxWidth: info.outerBoxWidth,
        outerBoxHeight: info.outerBoxHeight
      };
      setPriceApi(params).then((res) => {
        res.cIdx = cIdx;
        res.idx = idx;
        resolve(res);
      });
    });
  };

  const handleDrag = () => {
    document.addEventListener('dragleave', preventDefault); //拖离
    document.addEventListener('drop', preventDefault); //拖后放
    document.addEventListener('dragenter', preventDefault); //拖进
    document.addEventListener('dragover', preventDefault); //拖来拖去
  };
  const preventDefault = (e) => {
    e.preventDefault();
  };

  const handleDomDrop = (event) => {
    var fileList = event.dataTransfer.files; //获取文件对象
    //检测是否是拖拽文件到页面的操作
    if (fileList.length == 0) {
      return false;
    }
    //检测文件是不是图片
    if (fileList[0].type.indexOf('image') === -1) {
      return false;
    }
    handleSearchByImg(fileList[0]);
  };

  const getDelete = () => {
    // if (event && event.keyCode === 8) {
    const pasteDiv = document.getElementById('paste_img');
    pasteDiv.innerHTML = '';
    // }
  };

  // 粘贴图片进行搜图
  const handlePaste = (event) => {
    console.log('paste');
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        handleSearchByImg(blob);
      }
    }
  };

  function handleSearchByImg(blob) {
    const reader = new FileReader();
    reader.onloadend = async function () {
      let base64Data = reader.result;
      const regex = /data:image\/(.*?);base64/;
      const match = base64Data.match(regex);
      let imgSuffix = match[1] || '';

      // 替换粘贴的内容为图片
      setTimeout(() => {
        // 设置图片的宽高
        const imgElement = document.createElement('img');
        imgElement.src = base64Data;
        imgElement.style.width = '100%';
        imgElement.style.height = '100%';
        console.log('替换图片！！！！！！！！');
        const pasteDiv = document.getElementById('paste_img');
        pasteDiv.innerHTML = '';
        pasteDiv.appendChild(imgElement);
      }, 100);

      try {
        const { data } = await singleImgSearchApi({
          base64: base64Data.split(',')[1],
          imageSuffix: '.' + imgSuffix
        });
        if (data.length === 0) {
          return ElMessage({
            type: 'warning',
            message: '未找到疑似相同SKU',
            duration: 5000
          });
        } else {
          data?.forEach((item) => {
            item.prodImageAliyunSearchNewDtoList?.forEach((cItem) => {
              cItem.checked = false;
            });
            if (item.prodImageAliyunSearchNewDtoList?.length === 1) {
              item.prodImageAliyunSearchNewDtoList[0].checked = true;
            }
          });
          similarImgInfoList.value = data.concat(similarImgInfoList.value);
          gridOptions.data = data.concat(gridOptions.data);
          // 调用定价接口
          if (addTitleList.value.length > 0) {
            handleSetPrice();
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    reader.readAsDataURL(blob);
  }

  // 导出
  const exportTableRef = ref(null);
  let selectData = ref([]);
  const exportLoading = ref(false);
  const handleExport = () => {
    // 获取勾选的数据
    selectData.value = similarImgInfoList.value?.reduce((result, item) => {
      const filteredList = item.prodImageAliyunSearchNewDtoList.filter(
        (subItem) => subItem.checked
      );
      return result.concat(filteredList);
    }, []);
    if (selectData.value.length === 0) {
      return ElMessage.warning('请勾选需要导出的数据');
    }
    ElMessageBox.confirm('确定要导出勾选的数据吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        exportLoading.value = true;
        setTimeout(() => {
          const $table = exportTableRef.value;
          if ($table) {
            $table.exportData({
              type: 'csv'
            });
          }
          exportLoading.value = false;
        }, 0);
      })
      .catch((err) => {
        console.log(err);
        exportLoading.value = false;
      });
  };
</script>

<style lang="scss" scoped>
  .batch_search_img_container {
    padding: 10px;
  }
  .batch_import {
    display: flex;
    margin-bottom: 20px;
    #paste_img {
      margin-right: 20px;
      border: 1px dashed #ccc;
    }
  }
  img {
    width: 100%;
    height: 100%;
  }
  .batch_export {
    display: flex;
    width: 80%;
    justify-content: space-between;
    .export_box {
      .el-button {
        margin-right: 120px;
      }
    }
    span {
      vertical-align: middle;
      line-height: 24px;
    }
  }
  .batch_theader,
  .batch_tbody {
    display: flex;
    .batch_theader-th,
    .batch_tbody-td {
      flex: none;
      box-sizing: border-box;
      padding: 0 5px;
    }
  }
  .batch_tbody {
    border-bottom: 1px solid #e8eaec;
    &:last-child {
      border-bottom: none;
    }
  }
  .flex-none {
    flex: none;
  }
  .flex-1 {
    flex: 1;
  }
  .w80 {
    width: 80px;
  }
  .w90 {
    width: 90px;
  }
  .w42 {
    width: 42px;
  }
  .w180 {
    width: 190px;
  }
  .w160 {
    width: 160px;
  }
  .w140 {
    width: 140px;
  }
  .w100 {
    width: 100px;
  }
  .w120 {
    width: 120px;
  }
  .w-200 {
    width: 200px;
  }
  .w60 {
    width: 60px;
  }
  .text_ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .search_img_table {
    :deep(.vxe-table--header) {
      width: auto !important;
    }
    :deep(.vxe-table--body) {
      width: auto !important;
    }
  }
</style>
