<template>
  <el-dialog
    :model-value="showDialog"
    width="70%"
    title="详情"
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="dialogFormRef"
      :model="dialogForm"
      size="default"
      status-icon
      :label-width="180"
    >
      <el-divider content-position="left"><h3>基础信息</h3></el-divider>
      <el-form-item label="店铺父SKU">
        <el-input v-model="dialogForm.storePSku" readonly />
      </el-form-item>
      <el-form-item label="标题">
        <PlatTitle
          v-model="dialogForm.title"
          :prod-p-id="dialogForm.prodPId"
          :input-width="'700px'"
          :max-length="60"
          :content-top="50"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="dialogForm.description" :rows="4" type="textarea" />
      </el-form-item>
      <el-form-item label="美客多类目">
        <el-input v-model="dialogForm.fullCateName" readonly />
      </el-form-item>
      <el-divider content-position="left"><h3>类目属性</h3></el-divider>
      <el-form-item
        v-for="item in dialogForm.normalAttrList"
        :key="item.id"
        :required="item.required"
        :class="[item.required && !item.defaultValue ? 'is-error' : '']"
        :label="item.name"
      >
        <!-- 单选 -->
        <el-select
          v-if="getInputType(item.valueType) == 'select' && item.value"
          v-model="item.defaultValue"
        >
          <el-option
            v-for="cItem in item.value.split(',')"
            :key="cItem"
            :value="cItem"
            :label="cItem"
          />
        </el-select>

        <el-input
          v-else-if="getInputType(item.valueType) == 'select' && !item.value"
          v-model="item.defaultValue"
        />
        <!-- 单选+可自定义 -->
        <el-autocomplete
          v-if="getInputType(item.valueType) == 'inputSelect' && item.value"
          v-model="item.defaultValue"
          :fetch-suggestions="querySearch"
          clearable
          class="inline-input w-50"
          @focus="getData(item.value.split(','))"
        />
        <el-input
          v-else-if="
            getInputType(item.valueType) == 'inputSelect' && !item.value
          "
          v-model="item.defaultValue"
        />
        <!-- 单选+可自定义+校验数字 -->
        <el-autocomplete
          v-if="getInputType(item.valueType) == 'number' && item.value"
          v-model="item.defaultValue"
          :fetch-suggestions="querySearch"
          clearable
          class="inline-input w-50"
          @focus="getData(item.value.split(','))"
        />
        <el-input-number
          v-else-if="getInputType(item.valueType) == 'number' && !item.value"
          v-model="item.defaultValue"
        />
      </el-form-item>
      <el-divider content-position="left"><h3>保修信息</h3></el-divider>
      <el-form-item label="Warranty type" required>
        <el-select v-model="newWarrantyList.WARRANTY_TYPE" style="width: 300px">
          <!-- 默认值Seller warranty -->
          <!-- 选择No warranty，则不展示Warranty time字段 -->
          <el-option value="2230280" label="Seller warranty" />
          <el-option value="6150835" label="No warranty" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="newWarrantyList.WARRANTY_TYPE == '2230280'"
        label="Warranty time"
        required
        style="display: flex"
        :class="[newWarrantyList.WARRANTY_TIME == '' ? 'is-error' : '']"
      >
        <!-- 默认值30 -->
        <el-input
          v-model.trim="newWarrantyList.WARRANTY_TIME1"
          style="width: 100px"
        />
        <!-- 默认值days -->
        <el-select
          v-model.trim="newWarrantyList.WARRANTY_TIME2"
          style="width: 200px"
        >
          <el-option value="days" label="days" />
          <el-option value="months" label="months" />
          <el-option value="years" label="years" />
        </el-select>
      </el-form-item>
      <el-divider content-position="left"><h3>SKU变种</h3></el-divider>
      <el-form-item
        v-for="item in dialogForm.salePropAttrList"
        :key="item.id"
        :label="item.name"
        :required="item.required"
      >
        <span v-if="item.value">
          <el-tag
            v-for="cItem in item.value.split(',')"
            :key="cItem"
            type="info"
            class="ml-2"
            size="small"
            >{{ cItem }}</el-tag
          >
        </span>
        {{ typeDescription[getInputType(item.valueType)] }}
      </el-form-item>
    </el-form>
    <!-- 变种参数表格 -->

    <el-button
      type="primary"
      style="float: right; margin: 5px"
      @click="handlePrice"
      >修改价格</el-button
    >
    <el-button
      type="primary"
      style="float: right; margin: 5px"
      @click="handlePublishNum"
      >批量修改变种信息</el-button
    >
    <div
      v-for="(arrItem, arrIndex) in dialogForm.skuInfoList"
      :key="arrItem.id"
    >
      <el-table :data="[arrItem]" border :size="small">
        <el-table-column property="storeSubSku" label="店铺子SKU" />
        <el-table-column label="系统属性">
          <template #default="scope">
            颜色：{{ scope.row.color }}<br />
            尺寸：{{ scope.row.size }}<br />
            款式：{{ scope.row.style }}
          </template>
        </el-table-column>
        <el-table-column label="变种参数" width="200">
          <template #default="scope">
            <div
              v-for="item in scope.row.salePropAttrList"
              :key="item"
              style="display: flex"
            >
              <el-input v-model="item.name">{{ item.name }}</el-input>
              <el-input v-model="item.value">{{ item.value }}</el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="upc" label="UPC" />
        <el-table-column property="weight" label="Package weight(g)">
          <template #default="scope">
            <el-input v-model="scope.row.weight">{{
              scope.row.weight
            }}</el-input>
          </template></el-table-column
        >
        <el-table-column property="packageLength" label="Package length(cm)">
          <template #default="scope">
            <el-input v-model="scope.row.packageLength">{{
              scope.row.packageLength
            }}</el-input>
          </template></el-table-column
        >
        <el-table-column property="packageWidth" label="Package width(cm)">
          <template #default="scope">
            <el-input v-model="scope.row.packageWidth">{{
              scope.row.packageWidth
            }}</el-input>
          </template></el-table-column
        >
        <el-table-column property="packageHeight" label="Package height(cm)">
          <template #default="scope">
            <el-input v-model="scope.row.packageHeight">{{
              scope.row.packageHeight
            }}</el-input>
          </template></el-table-column
        >
        <el-table-column property="tempSku" label="价格（USD）">
          <template #default="scope">
            CBT:{{ scope.row.cbtRetailPrice }}<br />
            巴西:{{ scope.row.mlbRetailPrice }}<br />
            智利:{{ scope.row.mlcRetailPrice }}<br />
            墨西哥:{{ scope.row.mlmRetailPrice }}<br />
            哥伦比亚:{{ scope.row.mcoRetailPrice }}
          </template>
        </el-table-column>
        <el-table-column property="tempSku" label="刊登数量">
          <template #default="scope">
            <el-input v-model="scope.row.quantity">{{
              scope.row.quantity
            }}</el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-popconfirm
              title="确定删除这行数据?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="remove(arrIndex, scope)"
            >
              <template #reference>
                <el-button type="danger">移除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex">
        <div style="margin: 20px; height: 120px; width: 120px">
          <el-popover
            placement="right"
            width="500px"
            :hide-after="0"
            trigger="hover"
          >
            <template #default>
              <el-image :src="arrItem.mainImage || ''" />
            </template>
            <template #reference>
              <el-image
                v-if="arrItem.mainImage"
                :src="arrItem.mainImage + '!size=80x80' || ''"
              />
            </template>
          </el-popover>
        </div>
        <div style="display: flex; flex-direction: column">
          <div style="display: flex; margin: 5px; align-items: center">
            <el-button
              v-if="arrItem.imageList.length < 9"
              type="primary"
              @click="openUrlImg(arrIndex)"
              >网络图片</el-button
            >

            <el-upload
              action="/api/lms/prodTpl/uploadPic.html"
              :on-success="importSuccess"
              :on-error="importError"
              :show-file-list="false"
            >
              <el-button
                v-if="arrItem.imageList.length < 9"
                class="ml-2"
                type="primary"
                @click="currIndex = arrIndex"
                >本地图片</el-button
              >
            </el-upload>
            <div class="ml-2">
              说明：子SKU图最多选用 10 张，主图即为第一张图
            </div>
          </div>
          <div style="display: flex">
            <div
              v-for="(imgSrc, index) in arrItem.imageList"
              :key="imgSrc"
              style="margin-left: 5px"
            >
              <div style="width: 100px; height: 100px">
                <el-popover
                  placement="right"
                  width="500px"
                  :hide-after="0"
                  trigger="hover"
                >
                  <template #default>
                    <el-image :src="imgSrc || ''" />
                  </template>
                  <template #reference>
                    <el-image
                      v-if="imgSrc"
                      :src="imgSrc + '!size=80x80' || ''"
                    />
                  </template>
                </el-popover>
              </div>
              <div>
                <span class="btn1" @click="setMainImg(imgSrc, index, arrIndex)"
                  >设为主图</span
                >
                <span class="btn2" @click="arrItem.imageList.splice(index, 1)"
                  >移除</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button
        v-if="tabName == '待刊登' || tabName == '刊登失败'"
        type="primary"
        @click="handleEditDialog()"
        >保存</el-button
      >
    </template>
  </el-dialog>
  <el-dialog
    title="修改价格"
    width="20%"
    :model-value="priceDialog"
    :close-on-click-modal="false"
    @close="closePriceDialog"
  >
    <div class="priceDialogDiv">
      <span>巴西</span>
      <span>智利</span>
      <el-input v-model="priceEdit.MLB" placeholder="$9-$50" />
      <el-input v-model="priceEdit.MLC" placeholder="$12-$1000" />
      <span>墨西哥</span>
      <span>哥伦比亚</span>
      <el-input v-model="priceEdit.MLM" placeholder="$12-$1000" />
      <el-input v-model="priceEdit.MCO" placeholder="$12-$2000" />
    </div>
    <div style="color: red">{{ priceWarn }}</div>
    <template #footer>
      <el-button @click="closePriceDialog">取消</el-button>
      <el-button type="primary" @click="savePrice">保存</el-button>
    </template>
  </el-dialog>
  <el-dialog
    title="批量修改变种信息"
    width="30%"
    :model-value="publishNumDialog"
    :close-on-click-modal="false"
    @close="closePublishNumDialog"
  >
    <el-form size="default" status-icon :label-width="150">
      <el-form-item label="刊登数量修改为">
        <el-input
          v-model="publishNum"
          placeholder="直接修改所有子商品数量，仅支持输入正整数"
        />
      </el-form-item>
      <el-form-item label="商品长(cm)修改为">
        <el-input v-model="otherNum.packageLength" placeholder="长(cm)" />
      </el-form-item>
      <el-form-item label="商品宽(cm)修改为">
        <el-input v-model="otherNum.packageWidth" placeholder="宽(cm)" />
      </el-form-item>
      <el-form-item label="商品高(cm)修改为">
        <el-input v-model="otherNum.packageHeight" placeholder="高(cm)" />
      </el-form-item>
      <el-form-item label="商品重量(g)修改为">
        <el-input v-model="otherNum.weight" placeholder="重量(g)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closePublishNumDialog">取消</el-button>
      <el-button type="primary" @click="savePublishNum">保存</el-button>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogVisible"
    title="网络图片"
    width="30%"
    :close-on-click-modal="false"
  >
    <el-input v-model="inputUrl" placeholder="请输入图片URL" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUrlImg"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ref, reactive, toRefs, defineProps, defineEmits } from 'vue';
  import { updateMercadoPublishDetail } from '@/api/publishs/mercadopublish';
  import { ElMessage } from 'element-plus';
  import PlatTitle from '@/components/PlatTitle/index.vue';
  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: null
    },
    tabName: {
      type: String,
      default: ''
    }
  });
  const { formData, tabName } = toRefs(props);

  const typeDescription = {
    inputSelect: '单选 + 可自定义',
    select: '单选 + 不可自定义',
    number: '数字 + 可自定义'
  };

  const getInputType = (inputType) => {
    if (
      inputType == 'grid_id' ||
      inputType == 'picture_id' ||
      inputType == 'number_unit' ||
      inputType == 'list' ||
      inputType == 'grid_row_id' ||
      inputType == 'string'
    ) {
      return 'inputSelect';
    } else if (inputType == 'boolean') {
      return 'select';
    } else if (inputType == 'number') {
      return 'number';
    }
  };

  // MLB 巴西
  // MLM 墨西哥
  // MCO 哥伦比亚
  // MLC 智利
  const section = {
    MCO: [12, 2000, '哥伦比亚'],
    MLB: [9, 50, '巴西'],
    MLM: [12, 1000, '墨西哥'],
    MLC: [12, 1000, '智利']
  };
  const priceEdit = reactive({
    MCO: '',
    MLB: '',
    MLM: '',
    MLC: ''
  });
  // 应用价格
  const priceWarn = ref();
  const savePrice = () => {
    for (let key in priceEdit) {
      if (
        priceEdit[key] != '' &&
        (priceEdit[key] < section[key][0] || priceEdit[key] >= section[key][1])
      ) {
        priceWarn.value = `${section[key][2]}站点商品价格不在规定区间，请修改`;
        return;
      }
    }
    dialogForm.skuInfoList.forEach((item) => {
      priceEdit.MCO == '' ? '' : (item.mcoRetailPrice = priceEdit.MCO);
      priceEdit.MLB == '' ? '' : (item.mlbRetailPrice = priceEdit.MLB);
      priceEdit.MLM == '' ? '' : (item.mlmRetailPrice = priceEdit.MLM);
      priceEdit.MLC == '' ? '' : (item.mlcRetailPrice = priceEdit.MLC);
    });
    ElMessage.success('修改成功！');
    closePriceDialog();
  };
  const closePriceDialog = () => {
    priceDialog.value = false;
    priceEdit.MCO = priceEdit.MLB = priceEdit.MLM = priceEdit.MLC = '';
  };

  //   美客多模板弹窗
  const dialogForm = reactive({
    id: '',
    prodPId: '',
    attrKeyVal: '',
    fullCateName: '',
    categoryId: '',
    description: '',
    storePSku: '',
    title: '',
    normalAttrList: [],
    salePropAttrList: [],
    skuInfoList: [],
    warrantyList: [],
    newWarrantyList: {},
    salesSite: 'CBT'
  });

  const {
    id,
    prodPId,
    attrKeyVal,
    fullCateName,
    categoryId,
    description,
    storePSku,
    title,
    normalAttrList,
    salePropAttrList,
    skuInfoList,
    warrantyList,
    newWarrantyList
  } = toRefs(dialogForm);

  formData.value &&
    ((id.value = formData.value.id),
    (prodPId.value = formData.value.prodPId),
    (attrKeyVal.value = formData.value.attrKeyVal),
    (fullCateName.value = formData.value.fullCateName),
    (categoryId.value = formData.value.categoryId),
    (description.value = formData.value.description),
    (storePSku.value = formData.value.storePSku),
    (title.value = formData.value.title),
    (normalAttrList.value = formData.value.normalAttrList),
    (salePropAttrList.value = formData.value.salePropAttrList),
    (skuInfoList.value = formData.value.skuInfoList),
    (warrantyList.value = formData.value.warrantyList),
    formData.value.warrantyList.forEach((item) => {
      newWarrantyList.value[item.attrId] = item.value;
      if (item.attrId == 'WARRANTY_TIME') {
        newWarrantyList.value.WARRANTY_TIME1 = item.value.split(' ')[0];
        newWarrantyList.value.WARRANTY_TIME2 = item.value.split(' ')[1];
      }
    }));

  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    emit('closeDialog', { isShow: false });
  };

  // 设为主图
  const setMainImg = (url, cIndex, pIndex) => {
    let newUrl = url;
    dialogForm.skuInfoList[pIndex].imageList[cIndex] =
      dialogForm.skuInfoList[pIndex].mainImage;
    dialogForm.skuInfoList[pIndex].mainImage = newUrl;
  };
  const currIndex = ref();
  // 本地图片
  const importSuccess = (res) => {
    if (res.code == '0000') {
      dialogForm.skuInfoList[currIndex.value].imageList.push(res.msg);
      ElMessage.success('上传成功！');
    } else {
      ElMessage.error(res.msg);
    }
  };

  const importError = () => {
    ElMessage.error('上传失败！');
  };

  // 网络图片
  const dialogVisible = ref(false);
  const inputUrl = ref();
  const openUrlImg = (index) => {
    currIndex.value = index;
    dialogVisible.value = true;
  };
  const saveUrlImg = () => {
    checkImgExists(inputUrl.value)
      .then(() => {
        dialogForm.skuInfoList[currIndex.value].imageList.push(inputUrl.value);
        dialogVisible.value = false;
      })
      .catch(() => {
        return ElMessage.error(`url不能为空或不能访问`);
      });
  };

  // 修改价格
  const priceDialog = ref(false);
  const publishNum = ref();
  const otherNum = ref({
    packageHeight: '',
    packageLength: '',
    packageWidth: '',
    weight: ''
  });
  const handlePrice = () => {
    priceDialog.value = true;
  };

  // 批量修改变种信息
  const publishNumDialog = ref(false);
  const handlePublishNum = () => {
    publishNumDialog.value = true;
  };

  const closePublishNumDialog = () => {
    publishNumDialog.value = false;
    publishNum.value = '';
    otherNum.value.packageLength = '';
    otherNum.value.packageWidth = '';
    otherNum.value.packageHeight = '';
    otherNum.value.weight = '';
  };

  const savePublishNum = () => {
    if (
      publishNum.value != '' &&
      publishNum.value != undefined &&
      !/(^[1-9]\d*$)/.test(publishNum.value)
    ) {
      return ElMessage.warning('请输入正整数！');
    }
    dialogForm.skuInfoList.forEach((item) => {
      publishNum.value ? (item.quantity = publishNum.value) : '';
      otherNum.value.packageLength
        ? (item.packageLength = otherNum.value.packageLength)
        : '';
      otherNum.value.packageWidth
        ? (item.packageWidth = otherNum.value.packageWidth)
        : '';
      otherNum.value.packageHeight
        ? (item.packageHeight = otherNum.value.packageHeight)
        : '';
      otherNum.value.weight ? (item.weight = otherNum.value.weight) : '';
    });
    ElMessage.success('修改成功！');
    closePublishNumDialog();
  };

  const dialogFormRef = ref(null);

  //  新建&编辑美客多模板--保存
  const handleEditDialog = async () => {
    let mcoRetailPrice = dialogForm.skuInfoList.map(
        (item) => item.mcoRetailPrice
      ),
      mlbRetailPrice = dialogForm.skuInfoList.map(
        (item) => item.mcoRetailPrice
      ),
      mlcRetailPrice = dialogForm.skuInfoList.map(
        (item) => item.mcoRetailPrice
      ),
      mlmRetailPrice = dialogForm.skuInfoList.map(
        (item) => item.mcoRetailPrice
      );
    if (
      [...new Set(mcoRetailPrice)].length != 1 ||
      [...new Set(mlbRetailPrice)].length != 1 ||
      [...new Set(mlcRetailPrice)].length != 1 ||
      [...new Set(mlmRetailPrice)].length != 1
    ) {
      ElMessage.warning(`站点价格不一致，请重新修改价格`);
      return;
    }
    dialogForm.skuInfoList.forEach((item) => {
      item.images = item.mainImage + ',' + item.imageList.join(',');
    });
    dialogForm.warrantyList = [
      {
        attrId: 'WARRANTY_TYPE',
        value: dialogForm.newWarrantyList.WARRANTY_TYPE
      }
    ];
    if (
      dialogForm.newWarrantyList.WARRANTY_TYPE == '2230280' &&
      (dialogForm.newWarrantyList.WARRANTY_TIME1 == '' ||
        dialogForm.newWarrantyList.WARRANTY_TIME1 == undefined ||
        dialogForm.newWarrantyList.WARRANTY_TIME2 == '' ||
        dialogForm.newWarrantyList.WARRANTY_TIME2 == undefined)
    ) {
      ElMessage.warning(`请输入保修信息`);
      return;
    }

    if (dialogForm.newWarrantyList.WARRANTY_TYPE == '2230280') {
      dialogForm.warrantyList.push({
        attrId: 'WARRANTY_TIME',
        value:
          dialogForm.newWarrantyList.WARRANTY_TIME1 +
          ' ' +
          dialogForm.newWarrantyList.WARRANTY_TIME2
      });
    }
    let res,
      valid = false;
    // 新增保存
    dialogForm.skuInfoList.forEach((item) => {
      if (
        item.packageHeight == '' ||
        item.packageLength == '' ||
        item.packageWidth == '' ||
        item.weight == ''
      ) {
        valid = true;
      }
    });
    if (valid) {
      ElMessage.warning(`长宽高重量不能为空`);
      return;
    }
    res = await updateMercadoPublishDetail(dialogForm);
    if (res.code == '0000') {
      ElMessage.success(`保存成功`);
      emit('closeDialog', { isShow: false });
    }
  };

  //  变种参数--删除
  const remove = async (index) => {
    dialogForm.skuInfoList.splice(index, 1);
    ElMessage.success(`删除成功`);
  };

  const restaurants = ref([]);
  const getData = (arr) => {
    restaurants.value = [];
    arr.forEach((item) => {
      restaurants.value.push({ value: item });
    });
  };
  const querySearch = (queryString, cb) => {
    const results = queryString
      ? restaurants.value.filter(createFilter(queryString))
      : restaurants.value;
    cb(results);
  };
  const createFilter = (queryString) => {
    return (restaurant) => {
      return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      );
    };
  };
  //判断图片是否存在
  const checkImgExists = function (imgurl) {
    return new Promise(function (resolve, reject) {
      var ImgObj = new Image();
      ImgObj.src = imgurl;
      ImgObj.onload = function () {
        resolve(true);
      };
      ImgObj.onerror = function () {
        reject(false);
      };
    });
  };
</script>
<style scoped lang="scss">
  h3 {
    margin: 0;
  }
  .ml-2 {
    margin-left: 2px;
  }

  .btn1 {
    cursor: pointer;
    color: #79bbff;
  }
  .btn2 {
    cursor: pointer;
    color: red;
    float: right;
  }

  .priceDialogDiv {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    span {
      width: 40%;
      margin: 5px 0;
    }
    :deep(.el-input) {
      width: auto;
    }
  }

  .flexBetween {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
