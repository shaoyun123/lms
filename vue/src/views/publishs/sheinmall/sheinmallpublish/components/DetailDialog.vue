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
      class="dialog_form"
    >
      <el-divider content-position="left"><h3>基础信息</h3></el-divider>
      <el-form-item
        label="平台类目"
        prop="categoryTreeName"
        required
        class="flex_column"
      >
        <div>
          <el-cascader
            ref="cateName"
            v-model="dialogForm.categoryId"
            style="width: 700px"
            :options="oaList"
            :filter-method="filterCascader"
            filterable
            collapse-tags
            :props="{
              emitPath: false,
              multiple: false,
              value: 'categoryId',
              label: 'categoryName'
            }"
            @change="changeCate"
          ></el-cascader>
          <el-button
            type="primary"
            :disabled="syncCateDisabled"
            @click="handleSyncCate"
            >同步类目属性</el-button
          >
        </div>
        <div class="note">oa新类目: {{ prodCateOaTreeName }}</div>
      </el-form-item>
      <el-form-item label="商品标题" required>
        <!-- <el-input
          v-model="dialogForm.title"
          placeholder="最多输入1000个字符"
          maxlength="1000"
        /> -->
        <PlatTitle
          v-model="dialogForm.title"
          placeholder="最多输入1000个字符"
          :max-length="1000"
          show-word-limit
          :prod-p-id="dialogForm.prodPId"
          :input-width="'700px'"
        />
      </el-form-item>
      <el-form-item label="商品品牌" required>
        <!-- <el-input v-model="dialogForm.brandCode" /> -->
        <el-select v-model="dialogForm.brandCode" style="width: 700px">
          <el-option
            v-for="item in init.brandList"
            :key="item.brandCode"
            :value="item.brandCode"
            :label="item.brandName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺父SKU" required>
        <el-input v-model="dialogForm.storePSku" readonly />
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input
          v-model="dialogForm.description"
          maxlength="5000"
          :rows="4"
          type="textarea"
          placeholder="产品描述+固定描述，不超过5000个字符"
        />
      </el-form-item>
      <el-divider content-position="left"><h3>类目属性</h3></el-divider>
      <CateAttrType
        :all-data="dialogForm.sheinCategoryAttrDtos1.requiredData"
        type="requiredData"
      />
      <el-button
        type="primary"
        size="small"
        style="margin-left: 500px; cursor: pointer"
        @click="isShow = !isShow"
        >{{ isShow ? '收起' : '展开' }}</el-button
      >
      <div v-if="isShow == true">
        <CateAttrType
          :all-data="dialogForm.sheinCategoryAttrDtos1.otherData"
          type="otherData"
        />
      </div>
      <el-divider content-position="left"
        ><h3 style="display: inline">规格信息</h3>
        <!-- <span style="color: #f76600">
          （请先填写主规格再填写次规格）</span> -->
      </el-divider>
      <div
        v-if="dialogForm.sheinMainAndSubSpecificationDto"
        style="display: flex"
      >
        <el-form-item label="主规格" required>
          <el-select
            v-model="sheinSaleAttrsInfoDto.mainAttributeId"
            @change="changeMain"
          >
            <!-- <el-option
              v-for="item in dialogForm.sheinMainAndSubSpecificationDto
                .mainSpecificationAttributeInfoList"
              :key="item.attributeId"
              :label="item.attributeName"
              :value="item.attributeId"
            /> -->
            <template
              v-for="item in dialogForm.sheinMainAndSubSpecificationDto
                .subSpecificationAttributeInfoList"
              :key="item.attributeId"
            >
              <el-option
                v-if="item.attributeStatus != 3"
                :label="item.attributeName"
                :value="item.attributeId"
                :disabled="
                  item.attributeId == sheinSaleAttrsInfoDto.subAttributeId
                "
              />
              <el-option
                v-else
                :value="item.attributeId"
                :label="item.attributeName"
                :disabled="
                  item.attributeId == sheinSaleAttrsInfoDto.subAttributeId
                "
                ><span style="color: red">*</span
                >{{ item.attributeName }}</el-option
              >
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="次规格" :required="subRequired">
          <el-select
            v-model="sheinSaleAttrsInfoDto.subAttributeId"
            clearable
            @change="changeSub"
          >
            <template
              v-for="item in dialogForm.sheinMainAndSubSpecificationDto
                .subSpecificationAttributeInfoList"
              :key="item.attributeId"
            >
              <el-option
                v-if="item.attributeStatus != 3"
                :label="item.attributeName"
                :value="item.attributeId"
                :disabled="
                  item.attributeId == sheinSaleAttrsInfoDto.mainAttributeId
                "
              />
              <el-option
                v-else
                :value="item.attributeId"
                :label="item.attributeName"
                :disabled="
                  item.attributeId == sheinSaleAttrsInfoDto.mainAttributeId
                "
                ><span style="color: red">*</span
                >{{ item.attributeName }}</el-option
              >
            </template>
            <!-- <el-option
              v-for="item in init.subArr"
              :key="item.attributeId"
              :label="item.attributeName"
              :value="item.attributeId"
            /> -->
          </el-select>
        </el-form-item>
      </div>
      <div
        v-if="dialogForm.sheinMainAndSubSpecificationDto"
        style="display: flex"
      >
        <el-form-item label="映射oa规格">
          <el-select
            v-model="sheinSaleAttrsInfoDto.oaMainAttributeName"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in dialogForm.sheinMainAndSubSpecificationDto
                .oaAttributeNames"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="映射oa规格">
          <el-select
            v-model="sheinSaleAttrsInfoDto.oaSubAttributeName"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in dialogForm.sheinMainAndSubSpecificationDto
                .oaAttributeNames"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-divider content-position="left"><h3>变种信息</h3></el-divider>
      <div style="display: flex">
        <el-input style="visibility: hidden" />
        <el-input style="visibility: hidden" />
        <div>
          <!-- allow-create -->
          <el-select
            v-model="batchWriteData.main"
            placeholder="请选择"
            clearable
            filterable
            style="width: 125px"
          >
            <el-option
              v-for="item in init.main"
              :key="item.attributeValueId"
              :label="item.attributeValue"
              :value="item.attributeValueId"
            />
          </el-select>
        </div>
        <div>
          <!-- allow-create -->
          <el-select
            v-model="batchWriteData.sub"
            placeholder="请选择"
            clearable
            filterable
            style="width: 125px"
          >
            <el-option
              v-for="item in init.sub"
              :key="item.attributeValueId"
              :label="item.attributeValue"
              :value="item.attributeValueId"
            />
          </el-select>
        </div>
        <el-input v-model="batchWriteData.inventoryNum" placeholder="库存" />
        <el-input v-model="batchWriteData.basePrice" placeholder="原价" />
        <el-input v-model="batchWriteData.specialPrice" placeholder="特价" />
        <!-- <el-input
          v-model="batchWriteData.prodSSku"
          readonly
          placeholder="商家SKU"
        /> -->
        <el-input v-model="batchWriteData.weight" placeholder="重量" />
        <div style="display: flex">
          <el-input
            v-model="batchWriteData.packageLength"
            placeholder="长(cm)"
            style="width: 80px"
          />
          <el-input
            v-model="batchWriteData.packageWidth"
            placeholder="宽(cm)"
            style="width: 80px"
          />
          <el-input
            v-model="batchWriteData.packageHeight"
            placeholder="高(cm)"
            style="width: 80px"
          />
        </div>
        <el-button type="primary" @click="batchWrite">批量填写</el-button>
      </div>
      <el-table :data="dialogForm.sheinPublishSkuDtos" border size="small">
        <el-table-column label="系统属性">
          <template #default="scope">
            <div>
              {{
                scope.row.oaAttrName1 ? scope.row.oaAttrName1.split(':')[1] : ''
              }}
            </div>
            <div>
              {{
                scope.row.oaAttrName2 ? scope.row.oaAttrName2.split(':')[1] : ''
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span style="color: red">*</span>
            商家SKU
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.prodSSku" readonly />
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span style="color: red">*</span>
            主规格
          </template>
          <template #default="scope">
            <!-- allow-create -->
            <div style="display: flex; align-items: baseline">
              <el-select
                v-model="scope.row.main"
                placeholder="请选择"
                clearable
                filterable
                @change="changeTableMain(scope.row)"
              >
                <el-option
                  v-for="item in init.main"
                  :key="item.attributeValueId"
                  :label="item.attributeValue"
                  :value="item.attributeValueId"
                />
              </el-select>
              <el-tooltip class="box-item" content="向下填充" placement="right">
                <el-icon
                  v-if="scope.$index == 0"
                  style="cursor: pointer"
                  @click="handleRowData(scope.row.main, 'main')"
                  ><ArrowDownBold
                /></el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span v-if="subRequired || _subRequired" style="color: red">*</span>
            次规格
          </template>
          <template #default="scope">
            <!-- allow-create -->
            <div style="display: flex; align-items: baseline">
              <el-select
                v-model="scope.row.sub"
                placeholder="请选择"
                clearable
                filterable
                @change="changeTableSub(scope.row)"
              >
                <el-option
                  v-for="item in init.sub"
                  :key="item.attributeValueId"
                  :label="item.attributeValue"
                  :value="item.attributeValueId"
                />
              </el-select>
              <el-tooltip class="box-item" content="向下填充" placement="right">
                <el-icon
                  v-if="scope.$index == 0"
                  style="cursor: pointer"
                  @click="handleRowData(scope.row.sub, 'sub')"
                  ><ArrowDownBold
                /></el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span style="color: red">*</span>
            库存
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.inventoryNum" />
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span style="color: red">*</span>
            原价
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.basePrice" />
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span style="color: red">*</span>
            特价
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.specialPrice" />
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span style="color: red">*</span>
            重量(g)
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.weight" />
          </template>
        </el-table-column>
        <el-table-column width="200">
          <template #header>
            <span style="color: red">*</span>
            体积(cm)
          </template>
          <template #default="scope">
            <div style="display: flex">
              <el-input
                v-model="scope.row.packageLength"
                placeholder="长(cm)"
              />
              <el-input v-model="scope.row.packageWidth" placeholder="宽(cm)" />
              <el-input
                v-model="scope.row.packageHeight"
                placeholder="高(cm)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-popconfirm
              title="确定删除这行数据?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="removePublishSkuDtos(scope)"
            >
              <template #reference>
                <el-button type="danger" size="small">移除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-divider content-position="left"><h3>商品图片</h3></el-divider>
      <sheinImage
        :sku-info-list="dialogForm.sheinSaleAttrsAndImageInfoDtos"
        :prod-ids="[prodPId]"
        plat-code="shein商城"
        :fba-obj="{
          isFba: formData.isFba,
          fbaProductId: formData.fbaProductId
        }"
      ></sheinImage>
      <!-- @changeImage="getSheinImageData($event)" -->
      <!-- 尺码表 -->
      <SizeAttrTable
        ref="sizeAttrTableRef"
        :useful-info="{
          sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos:
            dialogForm.sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos,
          sizeAttributeInfoDtos: dialogForm.sizeAttributeInfoDtos,
          sheinPublishSkuDtos: dialogForm.sheinPublishSkuDtos,
          mainAttributeId: sheinSaleAttrsInfoDto.mainAttributeId,
          subAttributeId: sheinSaleAttrsInfoDto.subAttributeId,
          subArr: init.sub || [],
          mainArr: init.main || []
        }"
      />
      <!-- 参考产品链接 -->
      <ReferenceLinkTable
        v-model="referenceLinkObj"
        :sub-arr="init.sub || []"
        :main-arr="init.main || []"
        :shein-sale-attrs-info-dto="sheinSaleAttrsInfoDto"
        :reference-product-link="formData.referenceProductLink"
        :shein-publish-sku-dtos="dialogForm.sheinPublishSkuDtos"
        @change-diaform-value="changeDiaformValue"
      />
      <!-- 库存证明 -->
      <ProofOfStockTable
        :main-arr="init.main || []"
        :shein-sale-attrs-info-dto="sheinSaleAttrsInfoDto"
        :proof-of-stock="formData.proofOfStock"
        :shein-publish-sku-dtos="dialogForm.sheinPublishSkuDtos"
      />
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <!-- v-if="tabName == '商品' || tabName == '待刊登' || tabName == '刊登失败'" -->
      <el-button
        v-if="
          formData.isFba ||
          tabName == '商品' ||
          tabName == '待刊登' ||
          tabName == '刊登失败'
        "
        type="primary"
        :loading="updateLoading"
        @click="handleEditDialog()"
        >保存</el-button
      >
    </template>
  </el-dialog>
  <!-- 类目组件 -->
  <!-- <CateDialog
    v-if="showCateDialog"
    :show-dialog="showCateDialog"
    handle-cate-dialog-type="shein"
    :prod-p-id="prodPId"
    plat-code="shein"
    :store-acct-id="dialogForm.storeAcctId"
    @close-dialog="handleCateDialogClose($event)"
  /> -->
</template>
<script setup>
  import {
    ref,
    reactive,
    toRefs,
    defineEmits,
    watch,
    onMounted
    // onBeforeMount
  } from 'vue';
  import {
    saveStoreProduct,
    getSheinCateList,
    getStoreBrandList,
    getCateAttrAndValues,
    syncCateApi
  } from '@/api/publishs/sheinmallpublish';
  import { ElMessage } from 'element-plus';
  import sheinImage from '@/components/SheinImage/index.vue';
  // import CateDialog from '@/components/CateDialog.vue';
  import CateAttrType from './CateAttrType.vue';
  import SizeAttrTable from './SizeAttrTable.vue';
  import ReferenceLinkTable from './ReferenceLinkTable.vue';
  import ProofOfStockTable from './ProofOfStockTable.vue';
  // import { nextTick } from 'vue';
  import { colorMap } from '../../../shein/sheinpublish/enum';
  import { isEmpty, throttle } from 'lodash-es';
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
  const isShow = ref(false);
  const sizeAttrTableRef = ref();
  // 规格信息
  const sheinSaleAttrsInfoDto = ref({
    oaMainAttributeName: '',
    oaSubAttributeName: '',
    mainAttributeId: '',
    mainAttributeName: '',
    subAttributeId: '',
    subAttributeName: ''
  });

  // oa新类目名称
  const prodCateOaTreeName = ref();

  // 变种信息
  const batchWriteData = reactive({
    main: '',
    sub: '',
    inventoryNum: '',
    basePrice: '',
    specialPrice: '',
    prodSSku: '',
    packageLength: '',
    packageWidth: '',
    packageHeight: '',
    weight: ''
  });
  // 批量填写
  const batchWrite = () => {
    // 主规格次规格为空，全部修改
    if (batchWriteData.main == '' && batchWriteData.sub == '') {
      for (let key in batchWriteData) {
        dialogForm.sheinPublishSkuDtos.forEach((item) => {
          key != 'main' && key != 'sub' && key != 'prodSSku'
            ? (item[key] = batchWriteData[key] || item[key])
            : '';
        });
      }
    } else if (batchWriteData.main != '' && batchWriteData.sub != '') {
      // 主规格次规格都不为空，全匹配
      for (let key in batchWriteData) {
        dialogForm.sheinPublishSkuDtos.forEach((item) => {
          if (
            item['main'] == batchWriteData['main'] &&
            item['sub'] == batchWriteData['sub']
          )
            key != 'main' && key != 'sub' && key != 'prodSSku'
              ? (item[key] = batchWriteData[key] || item[key])
              : '';
        });
      }
    } else if (batchWriteData.main == '' && batchWriteData.sub != '') {
      for (let key in batchWriteData) {
        dialogForm.sheinPublishSkuDtos.forEach((item) => {
          if (item['sub'] == batchWriteData['sub'])
            key != 'main' && key != 'sub' && key != 'prodSSku'
              ? (item[key] = batchWriteData[key] || item[key])
              : '';
        });
      }
    } else if (batchWriteData.main != '' && batchWriteData.sub == '') {
      for (let key in batchWriteData) {
        dialogForm.sheinPublishSkuDtos.forEach((item) => {
          if (item['main'] == batchWriteData['main'])
            key != 'main' && key != 'sub' && key != 'prodSSku'
              ? (item[key] = batchWriteData[key] || item[key])
              : '';
        });
      }
    }
    // changeTableMain();
  };

  const init = reactive({
    subOaArr: [], // 映射oa规格
    brandList: [], // 品牌
    main: [], // 主规格
    sub: [] // 次规格
  });
  // 主规格下拉变化
  const changeMain = (val) => {
    dialogForm.sheinPublishSkuDtos.forEach((item) => {
      item.main = '';
    });
    let main =
      dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
        (item) =>
          item.attributeId == sheinSaleAttrsInfoDto.value.mainAttributeId
      );
    init.main = main[0].attributeValueList;
    colorTableMap(main, 'main');
    sizeAttrTableRef.value.resetTableData('main', val);
    // 改变主规格name
    sheinSaleAttrsInfoDto.value.mainAttributeName = main[0].attributeName;
  };
  // 次规格下拉变化
  const changeSub = (val) => {
    //变种信息 次规格清空
    dialogForm.sheinPublishSkuDtos.forEach((item) => {
      item.sub = '';
    });
    if (val == '') {
      init.sub = [];
      // 次规格为非必填
      if (!subRequired.value) {
        _subRequired.value = false;
      }
    } else {
      let sub =
        dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
          (item) =>
            item.attributeId == sheinSaleAttrsInfoDto.value.subAttributeId
        );
      init.sub = sub[0].attributeValueList || [];
      // 次规格为非必填&&次规格选择了必填数据
      if (!subRequired.value && sub[0].attributeStatus == 3) {
        _subRequired.value = true;
      } else {
        _subRequired.value = false;
      }
      colorTableMap(sub, 'sub');
      // 改变次规格name
      sheinSaleAttrsInfoDto.value.subAttributeName = sub[0].attributeName;
    }
    sizeAttrTableRef.value.resetTableData('sub', val);
  };
  // color自动映射
  const colorTableMap = (data, type) => {
    if (data[0]?.attributeName == '颜色') {
      let colorKeyVal = {};
      data[0].attributeValueList.forEach((item) => {
        colorKeyVal[item.attributeValue.toLowerCase()] = item.attributeValueId;
      });
      dialogForm.sheinPublishSkuDtos.forEach((item) => {
        let color =
          item.oaAttrName1 && item.oaAttrName1.includes('color')
            ? item.oaAttrName1.split(':')[1]
            : item.oaAttrName2 && item.oaAttrName2.includes('color')
            ? item.oaAttrName2.split(':')[1]
            : '';
        if (color != '') {
          item.name =
            (colorMap[color.toLowerCase()] &&
              colorMap[color.toLowerCase()][0]) ||
            '';
          item[type] = colorKeyVal[item.name];
          type == 'main' ? imageTableAdd() : '';
        }
      });
    }
  };
  // 商品图片表格
  const imageTableAdd = () => {
    // 获取变种信息表格中主规格的数据，并去重
    let uniqueArray = Array.from(
      new Set(dialogForm.sheinPublishSkuDtos.map((item) => item.main))
    );
    // 主规格换成key-val格式
    let mainArr = [];
    init.main.forEach((item) => {
      mainArr[item.attributeValueId] = item.attributeValue;
    });
    // 商品图片表格数据
    dialogForm.sheinSaleAttrsAndImageInfoDtos = [];
    // 表格数据赋值
    // 如果是字符串表示是自定义
    uniqueArray.forEach((item) => {
      item &&
        dialogForm.sheinSaleAttrsAndImageInfoDtos.push({
          oaAttrName1: typeof item === 'string' ? item : mainArr[item],
          mainAttributeValueId: typeof item === 'string' ? '' : item,
          mainAttributeValueName:
            typeof item === 'string' ? item : mainArr[item],
          detailImgList: [],
          squareImgUrl: [],
          colorImgUrl: []
        });
    });
  };
  // 表格主规格
  const changeTableMain = (row) => {
    imageTableAdd();
    // 相同映射oa规格的数据联动修改
    dialogForm.sheinPublishSkuDtos.forEach((item) => {
      if (sheinSaleAttrsInfoDto.value.oaMainAttributeName != '') {
        // 映射oa规格1是oaAttrName1还是oaAttrName2
        if (
          item.oaAttrName1 &&
          sheinSaleAttrsInfoDto.value.oaMainAttributeName ==
            item.oaAttrName1.split(':')[0] &&
          item.oaAttrName1 == row.oaAttrName1
        ) {
          // oaAttrName1
          item.main = row.main;
        } else if (
          item.oaAttrName2 &&
          sheinSaleAttrsInfoDto.value.oaMainAttributeName ==
            item.oaAttrName2.split(':')[0] &&
          item.oaAttrName2 == row.oaAttrName2
        ) {
          // oaAttrName2
          item.main = row.main;
        }
      }
    });
    // 改变尺码表
    sizeAttrTableRef.value.changeSizeTableData('main');
  };
  // 表格次规格
  const changeTableSub = (row) => {
    dialogForm.sheinPublishSkuDtos.forEach((item) => {
      if (sheinSaleAttrsInfoDto.value.oaSubAttributeName != '') {
        // 映射oa规格2是oaAttrName1还是oaAttrName2
        if (
          item.oaAttrName1 &&
          sheinSaleAttrsInfoDto.value.oaSubAttributeName ==
            item.oaAttrName1.split(':')[0] &&
          item.oaAttrName1 == row.oaAttrName1
        ) {
          // oaAttrName1
          item.sub = row.sub;
        } else if (
          item.oaAttrName2 &&
          sheinSaleAttrsInfoDto.value.oaSubAttributeName ==
            item.oaAttrName2.split(':')[0] &&
          item.oaAttrName2 == row.oaAttrName2
        ) {
          // oaAttrName2
          item.sub = row.sub;
        }
      }
    });
    // 改变尺码表
    sizeAttrTableRef.value.changeSizeTableData('sub');
  };

  // 移除
  const removePublishSkuDtos = (scope) => {
    // 判断表格是否还存在相同主规格的行，如果存在，则不需要删除图片表格行，不存在删除
    let tabledIsExist = dialogForm.sheinPublishSkuDtos.filter(
      (item) => item.main == scope.row.main
    );
    dialogForm.sheinPublishSkuDtos = dialogForm.sheinPublishSkuDtos.filter(
      (item, index) => index != scope.$index
    );
    // 等于1表示只存在一条，需要删除
    if (tabledIsExist.length == 1) {
      dialogForm.sheinSaleAttrsAndImageInfoDtos =
        dialogForm.sheinSaleAttrsAndImageInfoDtos.filter(
          (item) => scope.row.main != item.mainAttributeValueId
        );
    }
  };

  // 向下更新--主规格&次规格
  const handleRowData = (val, type) => {
    dialogForm.sheinPublishSkuDtos.forEach((item) => {
      item[type] = val;
    });
    if (type == 'main') {
      // 改变商品图片表格
      imageTableAdd();
    }
    // 改变尺码表
    sizeAttrTableRef.value.resetTableData(type, val);
    sizeAttrTableRef.value.changeSizeTableData(type);
  };

  //   shein模板弹窗
  const dialogForm = reactive({
    isFba: false,
    listingId: '',
    categoryId: '',
    categoryTreeName: '',
    description: '',
    prodPId: '',
    prodPSku: '',
    productTypeId: '',
    salesSite: '',
    sheinCategoryAttrDtos: [],
    sheinCategoryAttrDtos1: [],
    sheinMainAndSubSpecificationDto: {},
    sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos: {},
    sizeAttributeInfoDtos: [],
    sheinPublishSkuDtos: [],
    sheinSaleAttrsAndImageInfoDtos: [],
    storeAcctId: '',
    storePSku: '',
    brandCode: '',
    title: ''
  });

  const {
    isFba,
    listingId,
    categoryId,
    categoryTreeName,
    description,
    prodPId,
    prodPSku,
    productTypeId,
    salesSite,
    // sheinCategoryAttrDtos,
    // sheinCategoryAttrDtos1,
    sheinMainAndSubSpecificationDto,
    sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos,
    sizeAttributeInfoDtos,
    sheinPublishSkuDtos,
    sheinSaleAttrsAndImageInfoDtos,
    storeAcctId,
    storePSku,
    brandCode,
    title
  } = toRefs(dialogForm);
  const { formData, tabName } = toRefs(props);
  // 类目属性排序
  // 1. 必填项 成分属性（attributeType=3）+ attributeMode=4
  // 2. 必填项 成分属性（attributeType=3）+ attributeMode不等于4
  // 3. 必填项 非成分属性
  // 4. 非必填项
  const sheinCategorySort = (data, number) => {
    // number == 2表示查看详情时，有保存过的值了，不需要自动映射
    if (number != 2) {
      // 属性值变化，自动映射
      AutoMap(data, number);
    }
    let requiredData = data.filter((item) => item.attributeStatus == 3);
    dialogForm.sheinCategoryAttrDtos1 = {
      requiredData: requiredData
        .filter((item) => item.attributeType == 3 && item.attributeMode == 4)
        .concat(
          requiredData.filter(
            (item) => item.attributeType == 3 && item.attributeMode != 4
          )
        )
        .concat(requiredData.filter((item) => item.attributeType != 3)),
      otherData: data.filter((item) => item.attributeStatus != 3)
    };
  };
  // 自动映射类目属性值
  const AutoMap = (data) => {
    data.forEach((item) => {
      // 下拉多选
      if (item.directMappingValue) {
        if (item.attributeMode == 1 && item.attributeValueList.length != 0) {
          let selectData = item.attributeValueList.filter(
            (cItem) => item.directMappingValue == cItem.attributeValue
          );
          item.defaultValue =
            selectData.length == 0 ? [] : [selectData[0]['attributeValueId']];
        } else if (
          // 下拉单选
          (item.attributeMode == 3 || item.attributeMode == 4) &&
          item.attributeValueList.length != 0
        ) {
          let selectData = item.attributeValueList.filter(
            (cItem) => item.directMappingValue == cItem.attributeValue
          );
          // attributeValueId?attributeValue
          item.defaultValue =
            selectData.length == 0 ? '' : selectData[0]['attributeValueId'];
        } else if (item.attributeMode == 0) {
          item.defaultValue = item.directMappingValue;
        }
      }
    });
  };
  // 深拷贝
  function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = deepCopy(obj[key]); //递归复制
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }
  // watch(
  //   // 映射oa规格
  //   () => sheinSaleAttrsInfoDto.value.oaMainAttributeName,
  //   (val) => {
  //     if (val != '') {
  //       init.subOaArr =
  //         dialogForm.sheinMainAndSubSpecificationDto.oaAttributeNames.filter(
  //           (item) => item != sheinSaleAttrsInfoDto.value.oaMainAttributeName
  //         );
  //     } else {
  //       init.subOaArr = [];
  //     }
  //     // sheinSaleAttrsInfoDto.value.oaSubAttributeName = '';
  //   }
  // );
  // watch(
  //   // 次规格
  //   () => sheinSaleAttrsInfoDto.value.mainAttributeId,
  //   () => {
  //     init.subArr =
  //       dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
  //         (item) =>
  //           item.attributeId != sheinSaleAttrsInfoDto.value.mainAttributeId
  //       );
  //     // sheinSaleAttrsInfoDto.value.subAttributeId = '';
  //   }
  // );
  const subRequired = ref(false);
  const _subRequired = ref(false);
  const referenceLinkObj = ref({});
  watch(
    () => formData.value.option,
    () => {
      if (formData.value.option != '') {
        // 类目属性
        let sheinCategoryAttrDtos =
          formData.value.option['sheinCategoryAttrDtos'];
        // 处理下attributeMode == 4的数据
        for (let j = 0; j < formData.value.sheinCategoryAttrDtos.length; j++) {
          let cItem = formData.value.sheinCategoryAttrDtos[j];
          if (cItem.attributeMode == 4 && cItem.attributeValueList.length > 1) {
            // 会多一个输入框，可能还会有多行，回显处理
            let newData = deepCopy(cItem);
            for (let i = 0; i < newData.attributeValueList.length; i++) {
              if (i == 0) {
                formData.value.sheinCategoryAttrDtos[j]['ids'] = 'first_' + i;
                sheinCategoryAttrDtos[j]['ids'] = 'first_' + i;
              } else {
                formData.value.sheinCategoryAttrDtos.splice(j + i, 0, {
                  ids: 'edit_' + i,
                  defaultValue: newData.attributeValueList[i].attributeValueId,
                  attributeExtraValue:
                    newData.attributeValueList[i].attributeExtraValue,
                  attributeId: newData.attributeId,
                  attributeMode: newData.attributeMode,
                  attributeStatus: newData.attributeStatus,
                  attributeType: newData.attributeType,
                  attributeValueList: [newData.attributeValueList[i]]
                });
                sheinCategoryAttrDtos.splice(j + i, 0, {
                  ids: 'edit_' + i,
                  defaultValue: newData.attributeValueList[i].attributeValueId,
                  attributeExtraValue:
                    newData.attributeValueList[i].attributeExtraValue,
                  attributeId: newData.attributeId,
                  attributeMode: newData.attributeMode,
                  attributeStatus: newData.attributeStatus,
                  attributeType: newData.attributeType,
                  attributeValueList: sheinCategoryAttrDtos.filter(
                    (item) => item.attributeId == newData.attributeId
                  )[0].attributeValueList
                });
              }
            }
            cItem.attributeValueList = [cItem.attributeValueList[0]];
          }
        }
        sheinCategoryAttrDtos.forEach((item) => {
          formData.value.sheinCategoryAttrDtos.forEach((cItem) => {
            if (item.attributeId == cItem.attributeId) {
              if (
                cItem.attributeValueList.length != 0 &&
                item.attributeMode == 1
              ) {
                item.defaultValue = cItem.attributeValueList.map(
                  (nItem) => nItem.attributeValueId
                );
              } else if (
                cItem.attributeValueList.length != 0 &&
                item.attributeMode == 3
              ) {
                item.defaultValue =
                  cItem.attributeValueList[0].attributeValueId;
                item.attributeExtraValue =
                  cItem.attributeValueList[0].attributeExtraValue;
              } else if (
                cItem.attributeValueList.length != 0 &&
                item.attributeMode == 4 &&
                item.ids == cItem.ids
              ) {
                item.defaultValue =
                  cItem.attributeValueList[0].attributeValueId;
                item.attributeExtraValue =
                  cItem.attributeValueList[0].attributeExtraValue;
              } else if (
                cItem.attributeValueList.length != 0 &&
                item.attributeMode == 0
              ) {
                item.defaultValue =
                  cItem.attributeValueList[0].attributeExtraValue;
              }
            }
          });
        });
        formData.value.sheinCategoryAttrDtos = sheinCategoryAttrDtos;
        // 规格信息
        sheinSaleAttrsInfoDto.value = formData.value.sheinSaleAttrsInfoDto;
        sizeAttributeInfoDtos.value =
          formData.value.option.sizeAttributeInfoDtos;
        formData.value.sheinMainAndSubSpecificationDto =
          formData.value.option.sheinMainAndSubSpecificationDto;
        // 变种属性主规格(下拉+赋值)&次规格下拉
        let main =
          formData.value.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
            (item) =>
              item.attributeId ==
              formData.value.sheinSaleAttrsInfoDto.mainAttributeId
          );
        //  下拉值
        init.main = main[0].attributeValueList;
        let sub =
          formData.value.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
            (item) =>
              item.attributeId ==
              formData.value.sheinSaleAttrsInfoDto.subAttributeId
          );
        //  下拉值
        init.sub = sub.length != 0 ? sub[0].attributeValueList : [];
        // 变种信息--选中值
        formData.value.sheinPublishSkuDtos.forEach((item) => {
          // 如果attributeValue有值表示为自定义的值
          // 主规格
          if (item.attrInfo[0]['attributeValueList'][0]['attributeValue']) {
            item.main =
              item.attrInfo[0]['attributeValueList'][0]['attributeValue'];
          } else {
            item.main =
              item.attrInfo[0]['attributeValueList'][0]['attributeValueId'];
          }
          // 次规格
          if (item.attrInfo[1]['attributeValueList'][0]['attributeValue']) {
            item.sub =
              item.attrInfo[1]['attributeValueList'][0]['attributeValue'];
          } else {
            item.sub =
              item.attrInfo[1]['attributeValueList'][0]['attributeValueId'];
          }
        });
        // 判断次规格是否必填
        let aData =
          formData.value.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
            (item) => item.attributeStatus == 3
          );
        if (aData.length >= 2) {
          subRequired.value = true;
        } else {
          subRequired.value = false;
        }
      }
      handleData(2);
      // console.log(formData);
    }
  );
  const handleData = (number) => {
    sheinCategorySort(formData.value.sheinCategoryAttrDtos, number);
    formData.value && (isFba.value = formData.value.isFba),
      (categoryId.value = formData.value.categoryId),
      (listingId.value = formData.value.listingId),
      (categoryTreeName.value = formData.value.categoryTreeName),
      (description.value = formData.value.description),
      (prodPId.value = formData.value.prodPId),
      (prodPSku.value = formData.value.prodPSku),
      (productTypeId.value = formData.value.productTypeId),
      (salesSite.value = formData.value.salesSite),
      (sheinMainAndSubSpecificationDto.value =
        formData.value.sheinMainAndSubSpecificationDto),
      (sheinPublishSkuDtos.value = formData.value.sheinPublishSkuDtos),
      formData.value.sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos
        ? (sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value =
            formData.value.sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.map(
              (item) => ({
                ...item,
                sizeAttributeInfoObj: sizeAttributeInfoObj(
                  item.sizeAttributeInfoList
                )
              })
            ))
        : [],
      (formData.value.sheinSaleAttrsAndImageInfoDtos
        ? formData.value.sheinSaleAttrsAndImageInfoDtos.forEach((item) => {
            item.oaAttrName1 = item.mainAttributeValueName;
            item['detailImgList'] = item.imageInfoList.filter(
              (cItem) => cItem.imageType == 1 || cItem.imageType == 2
            );
            item['squareImgUrl'] = item.imageInfoList.filter(
              (cItem) => cItem.imageType == 5
            );
            item['colorImgUrl'] = item.imageInfoList.filter(
              (cItem) => cItem.imageType == 6
            );
          })
        : [],
      (sheinSaleAttrsAndImageInfoDtos.value =
        formData.value.sheinSaleAttrsAndImageInfoDtos)),
      (storeAcctId.value = formData.value.storeAcctId),
      (storePSku.value = formData.value.storePSku),
      (brandCode.value = formData.value.brandCode),
      (title.value = formData.value.title);
    referenceLinkObj.value = {};
  };
  const sizeAttributeInfoObj = (arr) => {
    let obj = {};
    arr.forEach((item) => {
      obj[item.attributeId] = item.attributeValueList;
    });
    return obj;
  };
  // 新建的时候调用
  handleData();
  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    dialogForm.sheinSaleAttrsAndImageInfoDtos?.forEach((item) => {
      item.detailImgList?.forEach((cItem) => {
        cItem.isPopover = false;
      });
      item.squareImgUrl?.forEach((cItem) => {
        cItem.isPopover = false;
      });
      item.colorImgUrl?.forEach((cItem) => {
        cItem.isPopover = false;
      });
    });
    emit('closeDialog', { isShow: false });
  };

  const dialogFormRef = ref(null);
  let updateLoading = ref(false);
  //  新建&编辑shein模板--保存
  const handleEditDialog = async function () {
    // 必填项校验
    if (!dialogForm.categoryId || !dialogForm.title || !dialogForm.brandCode) {
      ElMessage.warning(`必填项不能为空`);
      return false;
    }
    // 主规格选中项
    let mainSelect =
      dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
        (item) =>
          item.attributeId == sheinSaleAttrsInfoDto.value.mainAttributeId
      );
    // 次规格选中项
    let subSelect = sheinSaleAttrsInfoDto.value.subAttributeId
      ? dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
          (item) =>
            item.attributeId == sheinSaleAttrsInfoDto.value.subAttributeId
        )
      : [];
    // 根据返回的数据，判断次规格是否必选&选中的是否是必填项
    let requiredNum =
      dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
        (item) => item.attributeStatus == 3
      );
    // 类目属性必填项是否填值
    let requireSpecAttr = dialogForm.sheinCategoryAttrDtos1.requiredData.filter(
      (item) => item.defaultValue.length != 0 && item.defaultValue != ''
    );
    // 变种信息主规格必填项
    let tableMain = dialogForm.sheinPublishSkuDtos.filter(
      (item) =>
        //  (
        //   !item.main ||
        //   !item.basePrice ||
        //   !item.inventoryNum ||
        //   !item.packageHeight ||
        //   !item.packageLength ||
        //   !item.packageWidth ||
        //   !item.specialPrice ||
        //   !item.weight ||
        //   !item.prodSSku
        // )
        item.main === undefined ||
        item.main === '' ||
        item.basePrice === undefined ||
        item.basePrice === '' ||
        item.inventoryNum === undefined ||
        item.inventoryNum === '' ||
        item.packageHeight === undefined ||
        item.packageHeight === '' ||
        item.packageLength === undefined ||
        item.packageLength === '' ||
        item.packageWidth === undefined ||
        item.packageWidth === '' ||
        item.specialPrice === undefined ||
        item.specialPrice === '' ||
        item.weight === undefined ||
        item.weight === '' ||
        item.prodSSku === undefined ||
        item.prodSSku === ''
    );
    if (
      mainSelect.length == 0 ||
      (requiredNum.length >= 2 && subSelect.length == 0) ||
      requireSpecAttr.length !=
        dialogForm.sheinCategoryAttrDtos1.requiredData.length ||
      tableMain.length != 0
    ) {
      ElMessage.warning(`必填项不能为空`);
      return false;
    }
    // 次规格必填||次规格不是必填，但是次规格选了必填属性,表格中的次规格也需要必填
    if (
      requiredNum.length > 1 ||
      (requiredNum.length == 1 &&
        subSelect.length != 0 &&
        subSelect[0].attributeStatus == 3)
    ) {
      // 变种信息次规格必填项
      let tableMain = dialogForm.sheinPublishSkuDtos.filter(
        (item) => item.sub === undefined || item.sub === ''
      );
      if (tableMain.length != 0) {
        ElMessage.warning(`必填项不能为空`);
        return false;
      }
    }
    // 如果不存在必填项，不用校验，主次规格随便选
    if (
      requiredNum.length == 1 &&
      subSelect.length != 0 &&
      mainSelect[0].attributeStatus != 3 &&
      subSelect[0].attributeStatus != 3
    ) {
      // 只有一个必选项，主规格次规格都选值了，并且都没有选必选项
      ElMessage.warning(`该类目存在必填规格属性，请在主规格或者次规格中填写`);
      return false;
    } else if (
      // 只有一个必选项，主规格选值了，次规格为空，主规格没有选必选项
      requiredNum.length == 1 &&
      subSelect.length == 0 &&
      mainSelect[0].attributeStatus != 3
    ) {
      ElMessage.warning(`该类目存在必填规格属性，请在主规格或者次规格中填写`);
      return false;
    } else if (
      requiredNum.length > 1 &&
      (mainSelect[0].attributeStatus != 3 || subSelect[0].attributeStatus != 3)
    ) {
      // 有>=2个必选项，主规格次规格都必选
      ElMessage.warning(`主规格和次规格都为必填项，请检查是否已填`);
      return false;
    }
    // 主规格属性与oa映射:sheinSaleAttrsInfoDto
    if (
      sheinSaleAttrsInfoDto.value.oaMainAttributeName ==
        sheinSaleAttrsInfoDto.value.oaSubAttributeName &&
      sheinSaleAttrsInfoDto.value.oaSubAttributeName != ''
    ) {
      ElMessage.warning(`映射oa规格不能相同`);
      return false;
    }
    // 参考信息 参考链接
    if (formData.value.referenceProductLink) {
      let isExistReferceProductLink = dialogForm.sheinPublishSkuDtos.filter(
        (item) => !item.referenceProductLink
      );
      if (isExistReferceProductLink.length) {
        ElMessage.warning(`请填写参考链接`);
        return false;
      }
    }
    // 参考信息 库存证明
    if (formData.value.proofOfStockList) {
      let isExistProofOfStockList = dialogForm.sheinPublishSkuDtos.filter(
        (item) => !item.proofOfStockList?.length
      );
      if (isExistProofOfStockList.length) {
        ElMessage.warning(`请填写库存证明`);
        return false;
      }
    }
    if (
      dialogForm.title.length > 1000 ||
      dialogForm.description.length > 5000
    ) {
      ElMessage.warning(`标题最多1000字符，描述最多5000字符，已超出限制`);
      return false;
    }
    // 尺码表
    const {
      sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos,
      needPromptMsg
      // needSubSpecAttributeValueName
    } = sizeAttrTableRef.value.getTableData();
    // if (needSubSpecAttributeValueName) {
    //   return ElMessage.warning('尺码表的尺寸为必要条件');
    // }
    if (needPromptMsg) {
      return ElMessage.warning('请将尺码表种中项填写完整');
    }
    updateLoading.value = true;
    sheinSaleAttrsInfoDto.value.mainAttributeName = mainSelect[0].attributeName;
    // 次规格非必填
    sheinSaleAttrsInfoDto.value.subAttributeName = sheinSaleAttrsInfoDto.value
      .subAttributeId
      ? dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
          (item) =>
            item.attributeId == sheinSaleAttrsInfoDto.value.subAttributeId
        )[0].attributeName
      : '';
    dialogForm.sheinSaleAttrsInfoDto = sheinSaleAttrsInfoDto;
    // 类目属性
    // dialogForm.sheinCategoryAttrDtos
    // 类目属性:sheinCategoryAttrDtos
    let sheinCategoryAttrDtos =
      dialogForm.sheinCategoryAttrDtos1.requiredData.concat(
        dialogForm.sheinCategoryAttrDtos1.otherData
      );
    dialogForm.sheinCategoryAttrDtos = sheinCategoryAttrDtos;
    dialogForm.sheinCategoryAttrDtos.forEach((item, index) => {
      // 如果有值
      if (item.defaultValue && item.defaultValue.length != 0) {
        item.attributeValueList = item.attributeValueList.filter((cItem) =>
          // 判断defaultValue是否是数组
          Array.isArray(item.defaultValue)
            ? item.defaultValue.includes(cItem.attributeValueId)
            : item.defaultValue == cItem.attributeValueId
        );
        // 既不是数组，也不等于attributeValueId，剩余情况1. 手动输入的；(第2种情况不做了)2.下拉可输入，传值不是id，是输入的值
        if (item.attributeValueList.length == 0) {
          if (item.attributeMode == 0) {
            item.attributeValueList = [
              {
                attributeExtraValue: item.defaultValue
              }
            ];
          } else {
            item.attributeValueList = [
              {
                attributeValue: item.defaultValue,
                attributeExtraValue: item.attributeExtraValue // 额外输入的值
              }
            ];
          }
        } else if (
          item.attributeValueList.length == 1 &&
          item.attributeMode == 4
        ) {
          // 额外输入的值
          item.attributeValueList[0]['attributeExtraValue'] =
            item.attributeExtraValue;
        }
      } else {
        dialogForm.sheinCategoryAttrDtos[index].attributeValueList = [];
      }
    });
    // 处理新增的输入框
    for (let i = 1; i < dialogForm.sheinCategoryAttrDtos.length; i++) {
      if (
        dialogForm.sheinCategoryAttrDtos[i].attributeId ==
        dialogForm.sheinCategoryAttrDtos[i - 1].attributeId
      ) {
        dialogForm.sheinCategoryAttrDtos[i - 1].attributeValueList =
          dialogForm.sheinCategoryAttrDtos[i - 1].attributeValueList.concat(
            dialogForm.sheinCategoryAttrDtos[i].attributeValueList
          );
        dialogForm.sheinCategoryAttrDtos.splice(i, 1);
        i--;
      }
    }
    // dialogForm.sheinCategoryAttrDtos.forEach((item) => {});
    // 变种属性:sheinPublishSkuDtos
    dialogForm.sheinPublishSkuDtos.forEach((item, index) => {
      dialogForm.sheinPublishSkuDtos[index]['attrInfo'] = [
        {
          attributeId: sheinSaleAttrsInfoDto.value.mainAttributeId,
          attributeName: sheinSaleAttrsInfoDto.value.mainAttributeName,
          attributeValueList: [
            {
              attributeValue: typeof item.main === 'string' ? item.main : '',
              attributeValueId: typeof item.main === 'string' ? '' : item.main
            }
          ]
        },
        {
          attributeId: sheinSaleAttrsInfoDto.value.subAttributeId,
          attributeName: sheinSaleAttrsInfoDto.value.subAttributeName,
          attributeValueList: [
            {
              attributeValue: typeof item.sub === 'string' ? item.sub : '',
              attributeValueId: typeof item.sub === 'string' ? '' : item.sub
            }
          ]
        }
      ];
      // 库存证明
      if (item._proofOfStockList?.length) {
        item.proofOfStockList = (item._proofOfStockList || []).map(
          (v) => v.rightUrl
        );
      } else {
        item.proofOfStockList = [];
      }
    });
    // 商品图片
    dialogForm.sheinSaleAttrsAndImageInfoDtos.forEach((item) => {
      item.imageInfoList = item.detailImgList
        .concat(item.squareImgUrl)
        .concat(item.colorImgUrl);
      item.imageInfoList.forEach((cItem) => {
        cItem.isPopover = false;
      });
    });

    try {
      // 新增保存
      const { code } = await saveStoreProduct({
        ...dialogForm,
        sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos,
        isMall: true
      });
      if (code == '0000') {
        ElMessage.success(`保存成功`);
        emit('closeDialog', { isShow: false, save: true });
      }
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      updateLoading.value = false;
    }
  };
  onMounted(async () => {
    // 获取品牌接口
    const { data } = await getStoreBrandList({
      storeAcctId: formData.value.storeAcctId,
      isMall: true
    });
    init.brandList = data;
    // 获取平台类目
    getCates();
    prodCateOaTreeName.value = props.formData.prodCateOaTreeName;
    if (!isEmpty(props.formData.option)) {
      prodCateOaTreeName.value = props.formData.option.prodCateOaTreeName;
    }
  });
  // 类目组件 start
  let oaList = ref();
  let cateName = ref(null);
  // 获取类目;
  const getCates = async () => {
    try {
      const { data, code } = await getSheinCateList({
        storeAcctId: formData.value.storeAcctId,
        isMall: true,
        searchKey: ''
      });
      if (code === '0000') {
        oaList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };
  // 选择完类目
  const changeCate = async (e) => {
    // 主规格次规格下拉
    dialogForm.sheinMainAndSubSpecificationDto = {
      mainSpecificationAttributeInfoList: [],
      oaAttributeNames: [],
      subSpecificationAttributeInfoList: []
    };
    // 主规格次规格赋值下拉
    sheinSaleAttrsInfoDto.value = {
      oaMainAttributeName: '',
      oaSubAttributeName: '',
      mainAttributeId: '',
      mainAttributeName: '',
      subAttributeId: '',
      subAttributeName: ''
    };
    // 类目属性
    dialogForm.sheinCategoryAttrDtos1 = [];
    // 变种信息的规格信息&商品图片
    dialogForm.sheinPublishSkuDtos.forEach((item) => {
      item.main = '';
      item.sub = '';
    });
    dialogForm.sheinSaleAttrsAndImageInfoDtos = [];
    if (!e) {
      // 清空类目属性和规格信息
      dialogForm.categoryTreeName = '';
      dialogForm.categoryId = '';
      return;
    }
    dialogForm.categoryId = e;
    dialogForm.categoryTreeName =
      cateName.value.cascaderPanelRef.checkedNodes[0]['text'].replaceAll(
        ' / ',
        '>>'
      );
    const { data, code } = await getCateAttrAndValues({
      prodPId: formData.value.prodPId,
      categoryId: dialogForm.categoryId,
      storeAcctId: dialogForm.storeAcctId,
      platCode: 'shein商城'
    });
    if (code == '0000') {
      sheinCategorySort(data.sheinCategoryAttrDtos);
      dialogForm.sheinMainAndSubSpecificationDto =
        data.sheinMainAndSubSpecificationDto;
      // 判断次规格是否必填
      let aData =
        dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
          (item) => item.attributeStatus == 3
        );
      if (aData.length >= 2) {
        subRequired.value = true;
      } else {
        subRequired.value = false;
      }
      // 尺码表列发生变化
      dialogForm.sizeAttributeInfoDtos = data.sizeAttributeInfoDtos;
      sizeAttrTableRef.value.initData();
      prodCateOaTreeName.value = data.prodCateOaTreeName;
      init.sub = init.main = [];
    }
    dialogForm.sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos = [];
  };
  // 同步类目属性
  const syncCateDisabled = ref(false);
  const handleSyncCate = throttle(async () => {
    syncCateDisabled.value = true;
    try {
      await syncCateApi({
        categoryId: dialogForm.categoryId,
        storeAcctId: dialogForm.storeAcctId
      });
      changeCate(dialogForm.categoryId);
      syncCateDisabled.value = false;
    } catch (err) {
      syncCateDisabled.value = false;
    }
  }, 1000);
  // 类目组件 end
  // #region 参考信息
  // const referenceLinkObj = ref({});
  const changeDiaformValue = (key, data) => {
    dialogForm[key] = data;
  };
  // #endregion 参考产品链接
</script>
<style scoped lang="scss">
  h3 {
    margin: 0;
  }
  .flex_column {
    :deep(.el-form-item__content) {
      flex-direction: column;
      justify-content: start;
      align-items: flex-start;
    }
    .note {
      color: #999;
    }
  }
</style>
