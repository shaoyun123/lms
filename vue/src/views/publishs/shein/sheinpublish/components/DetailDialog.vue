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
        <div style="display: flex">
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
            :loading="syncCategoryLoading"
            :disabled="syncCategoryLoading"
            @click="syncCategory"
            >同步类目</el-button
          >
        </div>
        <div class="note">oa新类目: {{ dialogForm.prodCateOaTreeName }}</div>
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
      <el-divider content-position="left">
        <h3 style="display: inline">规格信息</h3>
        <!-- <span style="color: #f76600">
          （请先填写主规格再填写次规格）</span
        > -->
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
                  item.attributeId == sheinSaleAttrsInfoDto.subAttributeId ||
                  item.attributeId == sheinSaleAttrsInfoDto.subAttributeId1
                "
              />
              <el-option
                v-else
                :value="item.attributeId"
                :label="item.attributeName"
                :disabled="
                  item.attributeId == sheinSaleAttrsInfoDto.subAttributeId ||
                  item.attributeId == sheinSaleAttrsInfoDto.subAttributeId1
                "
                ><span style="color: red">*</span
                >{{ item.attributeName }}</el-option
              >
            </template>
            <!-- <el-option
              v-for="item in dialogForm.sheinMainAndSubSpecificationDto
                .mainSpecificationAttributeInfoList"
              :key="item.attributeId"
              :label="item.attributeName"
              :value="item.attributeId"
            /> -->
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(pItem, index) in otherReqSpecification"
          :key="index"
          label="其他规格"
          :required="subRequired && pItem.id"
        >
          <el-select
            v-model="
              sheinSaleAttrsInfoDto[`subAttributeId${index == 0 ? '' : index}`]
            "
            clearable
            @change="
              changeSub(
                sheinSaleAttrsInfoDto[
                  `subAttributeId${index == 0 ? '' : index}`
                ],
                index
              )
            "
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
                  item.attributeId == sheinSaleAttrsInfoDto.mainAttributeId ||
                  item.attributeId ==
                    sheinSaleAttrsInfoDto[
                      `subAttributeId${index == 0 ? 1 : ''}`
                    ]
                "
              />
              <el-option
                v-else
                :value="item.attributeId"
                :label="item.attributeName"
                :disabled="
                  item.attributeId == sheinSaleAttrsInfoDto.mainAttributeId ||
                  item.attributeId ==
                    sheinSaleAttrsInfoDto[
                      `subAttributeId${index == 0 ? 1 : ''}`
                    ]
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
        <!-- 所有选项的个数 < 其它选项的个数 -->
        <!-- 比如所有选项总共就一个，那这个肯定只有主规格，不能新增 -->
        <el-button
          v-if="
            otherReqSpecification.length < 2 &&
            dialogForm.sheinMainAndSubSpecificationDto
              .subSpecificationAttributeInfoList.length -
              1 >
              otherReqSpecification.length
          "
          type="primary"
          @click="specificationAdd"
          >添加</el-button
        >
        <el-button
          v-if="
            otherReqSpecification.length <= 2 &&
            otherReqSpecification.length > 0 &&
            otherReqSpecification &&
            !otherReqSpecification[otherReqSpecification.length - 1]?.id
          "
          type="danger"
          @click="specificationDel"
          >删除</el-button
        >
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
        <el-form-item
          v-for="(pItem, index) in otherReqSpecification"
          :key="index"
          label="映射oa规格"
        >
          <el-select
            v-model="
              sheinSaleAttrsInfoDto[
                `oaSubAttributeName${index == 0 ? '' : index}`
              ]
            "
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
        <el-input style="visibility: hidden" />
        <div>
          <el-select
            v-model="batchWriteData.main"
            :allow-create="init.allowCreate[2]"
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
        <div v-if="otherReqSpecification.length >= 1">
          <el-select
            v-model="batchWriteData.sub"
            :allow-create="init.allowCreate[0]"
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
        <div v-if="otherReqSpecification.length == 2">
          <el-select
            v-model="batchWriteData.sub1"
            :allow-create="init.allowCreate[1]"
            placeholder="请选择"
            clearable
            filterable
            style="width: 125px"
          >
            <el-option
              v-for="item in init.sub1"
              :key="item.attributeValueId"
              :label="item.attributeValue"
              :value="item.attributeValueId"
            />
          </el-select>
        </div>
        <el-input v-model="batchWriteData.inventoryNum" placeholder="库存" />
        <el-input v-model="batchWriteData.costPrice" placeholder="供货价" />
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
      <el-table
        :data="dialogForm.sheinPublishSkuDtos"
        border
        :size="small"
        :row-style="getRowStyle"
      >
        <el-table-column label="系统属性">
          <template #default="scope">
            <div v-for="item in [1, 2, 3, 4, 5, 6, 7]" :key="item">
              {{
                scope.row[`oaAttrName${item}`]
                  ? scope.row[`oaAttrName${item}`].split(':')[1]
                  : ''
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column width="220">
          <template #header>
            <span style="color: red">*</span>
            店铺子SKU
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.storeSSku" readonly />
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span style="color: red">*</span>
            主规格<br /><span v-if="init.allowCreate[2]">(可自定义)</span>
          </template>
          <template #default="scope">
            <div style="display: flex; align-items: baseline">
              <el-select
                v-model="scope.row.main"
                placeholder="请选择"
                clearable
                filterable
                :allow-create="init.allowCreate[2]"
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
                >
                  <ArrowDownBold />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="otherReqSpecification.length >= 1">
          <template #header>
            <span v-if="subRequired || _subRequired" style="color: red">*</span>
            其他规格<br /><span v-if="init.allowCreate[0]">(可自定义)</span>
          </template>
          <template #default="scope">
            <div style="display: flex; align-items: baseline">
              <el-select
                v-model="scope.row.sub"
                placeholder="请选择"
                :allow-create="init.allowCreate[0]"
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
                >
                  <ArrowDownBold />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="otherReqSpecification.length == 2">
          <template #header>
            <span
              v-if="
                (subRequired || _subRequired) &&
                otherReqSpecification[otherReqSpecification.length - 1].id
              "
              style="color: red"
              >*</span
            >
            其他规格<br /><span v-if="init.allowCreate[1]">(可自定义)</span>
          </template>
          <template #default="scope">
            <div style="display: flex; align-items: baseline">
              <el-select
                v-model="scope.row.sub1"
                placeholder="请选择"
                :allow-create="init.allowCreate[1]"
                clearable
                filterable
                @change="changeTableSub(scope.row)"
              >
                <el-option
                  v-for="item in init.sub1"
                  :key="item.attributeValueId"
                  :label="item.attributeValue"
                  :value="item.attributeValueId"
                />
              </el-select>
              <el-tooltip class="box-item" content="向下填充" placement="right">
                <el-icon
                  v-if="scope.$index == 0"
                  style="cursor: pointer"
                  @click="handleRowData(scope.row.sub1, 'sub1')"
                >
                  <ArrowDownBold />
                </el-icon>
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
            供货价
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.costPrice" />
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
        plat-code="shein自营"
        :fba-obj="{
          isFba: formData.isFba,
          fbaProductId: formData.fbaProductId
        }"
      ></sheinImage>
      <!-- @changeImage="getSheinImageData($event)" -->
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
      <el-divider content-position="left"
        ><h3>
          <span style="color: red">*</span> 商品包装标签<span
            style="color: #aaa; font-size: 12px"
            >（数据仅保存至刊登表，不上传平台）</span
          >
        </h3>
      </el-divider>
      <!-- 1水洗唛、2环保贴、3眼睛贴 -->
      <el-form-item label="环保贴">
        <el-select
          v-model="selectGroupVal.envPro"
          clearable
          style="width: 400px"
        >
          <!-- @change="importPdf($event, 2)" -->
          <el-option-group v-for="(c, index) in envProGroup" :key="index">
            <el-option
              v-for="item in c.options"
              :key="item.value"
              :label="item.label"
              :value="item"
            >
              <el-upload
                v-if="item.value == ' '"
                action
                :http-request="(file) => handleUpload(file, 2)"
                :show-file-list="false"
                style="float: left; color: #409eff"
                >新增模板</el-upload
              >
              <div v-else>
                <span style="float: left">{{ item.label }}</span>
                <span
                  style="float: right; color: #409eff; font-size: 13px"
                  @click="delSelectGroup(item.label, 2)"
                  >删除模板</span
                >
              </div>
            </el-option></el-option-group
          >
        </el-select>
        <div
          v-if="selectGroupVal.envPro && selectGroupVal.envPro['value'] != ' '"
        >
          <el-popover
            placement="right"
            width="600px"
            :hide-after="0"
            trigger="hover"
            popper-class="custom_pop"
            @show="
              openPDFPreview(
                selectGroupVal.envPro['value'],
                `envPro` + new Date().getTime()
              )
            "
          >
            <template #default>
              <!-- v-show="pdfShow" -->
              <canvas :id="pdfShowTime.envPro"></canvas>
            </template>
            <template #reference>
              <div style="color: #aaa; margin-left: 10px">预览</div>
            </template>
          </el-popover>
        </div>
      </el-form-item>
      <el-form-item label="眼镜贴">
        <el-select
          v-model="selectGroupVal.glasse"
          clearable
          style="width: 400px"
        >
          <!-- @change="importPdf($event, 3)" -->
          <el-option-group v-for="(c, index) in glasseGroup" :key="index">
            <el-option
              v-for="item in c.options"
              :key="item.value"
              :label="item.label"
              :value="item"
            >
              <el-upload
                v-if="item.value == ' '"
                action
                :http-request="(file) => handleUpload(file, 3)"
                :show-file-list="false"
                style="float: left; color: #409eff"
                >新增模板</el-upload
              >
              <div v-else>
                <span style="float: left">{{ item.label }}</span>
                <span
                  style="
                    float: right;
                    color: color:#409eff;
                    font-size: 13px;
                  "
                  @click="delSelectGroup(item.label, 3)"
                  >删除模板</span
                >
              </div>
            </el-option></el-option-group
          >
        </el-select>
        <div
          v-if="selectGroupVal.glasse && selectGroupVal.glasse['value'] != ' '"
        >
          <el-popover
            placement="right"
            width="600px"
            :hide-after="0"
            trigger="hover"
            popper-class="custom_pop"
            @show="
              openPDFPreview(
                selectGroupVal.glasse['value'],
                `glasse` + new Date().getTime()
              )
            "
          >
            <template #default>
              <canvas :id="pdfShowTime.glasse"></canvas>
            </template>
            <template #reference>
              <div style="color: #aaa; margin-left: 10px">预览</div>
            </template>
          </el-popover>
        </div>
      </el-form-item>
      <el-form-item label="水洗唛">
        <el-select
          v-model="selectGroupVal.wateringMark"
          clearable
          style="width: 400px"
        >
          <!-- @change="importPdf($event, 1)" -->
          <el-option-group v-for="(c, index) in wateringMarkGroup" :key="index">
            <el-option
              v-for="item in c.options"
              :key="item.value"
              :label="item.label"
              :value="item"
            >
              <el-upload
                v-if="item.value == ' '"
                action
                :http-request="(file) => handleUpload(file, 1)"
                :show-file-list="false"
                style="float: left; color: #409eff"
                >新增模板</el-upload
              >
              <div v-else>
                <span style="float: left">{{ item.label }}</span>
                <span
                  style="float: right; color: #409eff; font-size: 13px"
                  @click="delSelectGroup(item.label, 1)"
                  >删除模板</span
                >
              </div>
            </el-option></el-option-group
          >
        </el-select>
        <div
          v-if="
            selectGroupVal.wateringMark &&
            selectGroupVal.wateringMark['value'] != ' '
          "
        >
          <el-popover
            placement="right"
            width="600px"
            :hide-after="0"
            trigger="hover"
            popper-class="custom_pop"
            @show="
              openPDFPreview(
                selectGroupVal.wateringMark['value'],
                `wateringMark` + new Date().getTime()
              )
            "
          >
            <template #default>
              <canvas :id="pdfShowTime.wateringMark"></canvas>
            </template>
            <template #reference>
              <div style="color: #aaa; margin-left: 10px">预览</div>
            </template>
          </el-popover>
        </div>
      </el-form-item>
      <el-divider content-position="left"
        ><h3><span style="color: red">*</span> 首次上架日期</h3>
      </el-divider>
      <vxe-table :data="DateFirstReleaseTable" border style="width: 500px">
        <vxe-column title="上架方式">
          <template #default="{ row }"
            ><span style="color: red">*</span>
            <el-select v-model="row.shelfWay">
              <el-option label="自动上架" :value="1" /><el-option
                label="定时上架"
                :value="2"
              />
            </el-select>
          </template>
        </vxe-column>
        <vxe-column
          title="首次期望上架日期"
          :title-help="{
            message:
              '首次期望上架日期必须≥（当前时间+2天），若实际刊登时间＞设置的首次期望刊登时间则刊登失败'
          }"
        >
          <template #default="{ row }">
            <div v-if="row.shelfWay == 2">
              <span style="color: red">*</span>
              <el-date-picker
                v-model="row.hopeOnSaleDate"
                type="datetime"
                placeholder="请选择"
                value-format="YYYY-MM-DD HH:mm:ss"
                :disabled-date="disabledDate"
              />
            </div>
          </template>
        </vxe-column>
      </vxe-table>
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
  <CateDialog
    v-if="showCateDialog"
    :show-dialog="showCateDialog"
    handle-cate-dialog-type="shein"
    :prod-p-id="prodPId"
    plat-code="shein"
    :store-acct-id="dialogForm.storeAcctId"
    @close-dialog="handleCateDialogClose($event)"
  />
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
    saveOrUpdateLables,
    getLablesById,
    syncSheinCate,
    saveStoreProduct,
    getSheinCateList,
    getStoreBrandList,
    getCateAttrAndValues
  } from '@/api/publishs/sheinpublish';
  import { transferDate } from '@/utils/common.js';
  import { ElMessage } from 'element-plus';
  import sheinImage from '@/components/SheinImage/index.vue';
  import CateDialog from '@/components/CateDialog.vue';
  import CateAttrType from './CateAttrType.vue';
  import SizeAttrTable from './SizeAttrTable.vue';
  // import { nextTick } from 'vue';
  import { colorMap } from '../enum';
  import { isEmpty } from 'lodash-es';
  import PlatTitle from '@/components/PlatTitle/index.vue';
  import * as pdfjs from 'pdfjs-dist';
  // import * as pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker';

  // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  pdfjs.GlobalWorkerOptions.workerSrc =
    '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.js';

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
  // 首次上架日期表
  let DateFirstReleaseTable = ref([{ shelfWay: 1 }]);
  // 首次上架日期禁选
  const disabledDate = (time) => {
    return time.getTime() < Date.now() + 48 * 60 * 60 * 1000;
  };

  const isShow = ref(false);
  const sizeAttrTableRef = ref();
  const subRequired = ref(false);
  const _subRequired = ref(false);
  // 规格信息
  const sheinSaleAttrsInfoDto = ref({
    subAttributeId1: '',
    subAttributeName1: '',
    oaSubAttributeName1: '',
    oaMainAttributeName: '',
    oaSubAttributeName: '',
    mainAttributeId: '',
    mainAttributeName: '',
    subAttributeId: '',
    subAttributeName: ''
  });

  // 其他规格，默认必填
  const otherReqSpecification = ref([]);
  // // 其他所有规格
  // const otherSpecification =
  //   formData.value.sheinMainAndSubSpecificationDto
  //     .subSpecificationAttributeInfoList;
  // 添加其他规格,手动添加的都是非必填的，必填项默认展示，且不能删除
  const specificationAdd = () => {
    otherReqSpecification.value.push({});
  };
  // 删除其它规格，只能删除非必填的其它规格
  const specificationDel = () => {
    otherReqSpecification.value.splice(
      otherReqSpecification.value.length - 1,
      1
    );
    // 删除规格信息
    if (otherReqSpecification.value.length == 0) {
      sheinSaleAttrsInfoDto.value.oaSubAttributeName = '';
      sheinSaleAttrsInfoDto.value.oaSubAttributeName1 = '';
      sheinSaleAttrsInfoDto.value.subAttributeName = '';
      sheinSaleAttrsInfoDto.value.subAttributeName1 = '';
      sheinSaleAttrsInfoDto.value.subAttributeId = '';
      sheinSaleAttrsInfoDto.value.subAttributeId1 = '';
    } else if (otherReqSpecification.value.length == 1) {
      sheinSaleAttrsInfoDto.value.oaSubAttributeName1 = '';
      sheinSaleAttrsInfoDto.value.subAttributeId1 = '';
      sheinSaleAttrsInfoDto.value.subAttributeName1 = '';
    }

    // 删除变种信息表格数据
    dialogForm.sheinPublishSkuDtos.forEach((item) => {
      if (otherReqSpecification.value.length == 0) {
        item.sub = '';
        item.sub1 = '';
      } else if (otherReqSpecification.value.length == 1) {
        item.sub1 = '';
      }
    });

    if (otherReqSpecification.value.length == 0) {
      // 改变尺码表
      sizeAttrTableRef.value.changeSizeTableData('main');
    }
  };

  // 变种信息
  const batchWriteData = reactive({
    main: '',
    sub: '',
    sub1: '',
    inventoryNum: '',
    costPrice: '',
    specialPrice: '',
    prodSSku: '',
    packageLength: '',
    packageWidth: '',
    packageHeight: '',
    weight: ''
  });
  // 同步类目
  let syncCategoryLoading = ref(false);
  const syncCategory = async () => {
    syncCategoryLoading.value = true;
    try {
      const { msg, code } = await syncSheinCate(formData.value.storeAcctId);
      if (code == '0000') {
        ElMessage.success(msg);
      }
      syncCategoryLoading.value = false;
    } catch {
      syncCategoryLoading.value = false;
    }
    const { data, code } = await getCateAttrAndValues({
      prodPId: formData.value.prodPId,
      categoryId: dialogForm.categoryId,
      storeAcctId: dialogForm.storeAcctId,
      platCode: 'shein自营'
    });
    if (code == '0000') {
      sheinCategorySort(data.sheinCategoryAttrDtos);
      dialogForm.sheinMainAndSubSpecificationDto =
        data.sheinMainAndSubSpecificationDto;
      // 尺码表列发生变化
      dialogForm.sizeAttributeInfoDtos = data.sizeAttributeInfoDtos;
      sizeAttrTableRef.value.initData();
      prodCateOaTreeName.value = data.prodCateOaTreeName;
      // 默认显示必填的其它规格
      // otherReqSpecification.value = aData.splice(0, 1);
    }
    dialogForm.sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos = [];
  };
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
    allowCreate: [false, false, false], // 其它规格1，其它规格2，主规格，是否允许自定义
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
    init.allowCreate[2] = main[0].hasPermission;
    colorTableMap(main, 'main');
    sizeAttrTableRef.value.resetTableData('main', val);
  };
  // 次规格下拉变化
  const changeSub = (val, index) => {
    //变种信息 次规格清空
    dialogForm.sheinPublishSkuDtos.forEach((item) => {
      item[`sub${index == 0 ? '' : index}`] = '';
    });
    if (val == '') {
      init[`sub${index == 0 ? '' : index}`] = [];
      // 次规格为非必填
      if (!subRequired.value) {
        _subRequired.value = false;
      }
    } else {
      let sub =
        dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
          (item) =>
            item.attributeId ==
            sheinSaleAttrsInfoDto.value[
              `subAttributeId${index == 0 ? '' : index}`
            ]
        );
      init[`sub${index == 0 ? '' : index}`] = sub[0].attributeValueList || [];
      // 次规格为非必填&&次规格选择了必填数据
      if (!subRequired.value && sub[0].attributeStatus == 3) {
        _subRequired.value = true;
      } else {
        _subRequired.value = false;
      }
      init.allowCreate[index] = sub[0].hasPermission;
      colorTableMap(sub, `sub${index == 0 ? '' : index}`);
    }
    if (index == 0) {
      sizeAttrTableRef.value.resetTableData('sub', val);
    }
  };
  // color自动映射
  const colorTableMap = (data, type) => {
    if (data[0].attributeName == '颜色') {
      let colorKeyVal = {};
      data[0].attributeValueList.forEach((item) => {
        colorKeyVal[item.attributeValue.toLowerCase()] = item.attributeValueId;
      });
      dialogForm.sheinPublishSkuDtos.forEach((item) => {
        let color = item.oaAttrName1.includes('color')
          ? item.oaAttrName1.split(':')[1]
          : item.oaAttrName2.includes('color')
          ? item.oaAttrName2.split(':')[1]
          : '';
        if (color != '') {
          item.name =
            (colorMap[color.toLowerCase()] &&
              colorMap[color.toLowerCase()][1]) ||
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
    if (otherReqSpecification.value.length == 0) {
      sizeAttrTableRef.value.changeSizeTableData('main');
    }
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
    // 有三个规格，其中两个其它规格，以第一个其他规格填充尺码表，第二个其它规格和尺码表无关
    if (type == 'sub1') {
      return;
    }
    if (otherReqSpecification.value.length == 0) {
      // 改变尺码表
      // 改变尺码表
      sizeAttrTableRef.value.resetTableData(type, val);
      sizeAttrTableRef.value.changeSizeTableData(type);
    }
  };
  //   shein模板弹窗
  const dialogForm = reactive({
    isFba: false,
    listingId: '',
    categoryId: '',
    prodCateOaTreeName: '',
    categoryTreeName: '',
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
    labels: '',
    title: ''
  });

  const {
    isFba,
    listingId,
    categoryId,
    prodCateOaTreeName,
    categoryTreeName,
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
    labels,
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
        let sub1 =
          formData.value.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
            (item) =>
              item.attributeId ==
              formData.value.sheinSaleAttrsInfoDto.subAttributeId1
          );
        //  下拉值
        init.sub1 = sub1.length != 0 ? sub1[0].attributeValueList : [];
        init.allowCreate[2] = main[0]?.hasPermission;
        init.allowCreate[0] = sub[0]?.hasPermission;
        init.allowCreate[1] = sub1[0]?.hasPermission;
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
          if (item.attrInfo.length >= 2) {
            if (item.attrInfo[1]['attributeValueList'][0]['attributeValue']) {
              item.sub =
                item.attrInfo[1]['attributeValueList'][0]['attributeValue'];
            } else {
              item.sub =
                item.attrInfo[1]['attributeValueList'][0]['attributeValueId'];
            }
          }
          // 其他规格
          if (item.attrInfo.length >= 3) {
            if (item.attrInfo[2]['attributeValueList'][0]['attributeValue']) {
              item.sub1 =
                item.attrInfo[2]['attributeValueList'][0]['attributeValue'];
            } else {
              item.sub1 =
                item.attrInfo[2]['attributeValueList'][0]['attributeValueId'];
            }
          }
        });
      }
      handleData(2);
      // console.log(formData);
    }
  );
  const handleData = (number) => {
    sheinCategorySort(formData.value.sheinCategoryAttrDtos, number);
    formData.value && (isFba.value = formData.value.isFba),
      (categoryId.value = formData.value.categoryId),
      (prodCateOaTreeName.value = formData.value.prodCateOaTreeName),
      (listingId.value = formData.value.listingId),
      (categoryTreeName.value = formData.value.categoryTreeName),
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
      (labels.value = formData.value.labels),
      (title.value = formData.value.title);
    DateFirstReleaseTable.value[0].hopeOnSaleDate = transferDate(
      formData.value.hopeOnSaleDate * 1
    );
    DateFirstReleaseTable.value[0].shelfWay = formData.value.shelfWay || 1;
    // 判断次规格是否必填
    let aData =
      formData.value?.sheinMainAndSubSpecificationDto?.subSpecificationAttributeInfoList.filter(
        (item) => item.attributeStatus == 3
      ) || [];
    if (aData.length >= 2) {
      subRequired.value = true;
      // 默认显示必填的其它规格
      aData.splice(0, 1);
      otherReqSpecification.value = aData;
    } else {
      subRequired.value = false;
      otherReqSpecification.value = [];
    }
    // 根据回显的数据，再添加规格信息
    if (
      formData.value?.sheinSaleAttrsInfoDto?.subAttributeId1 &&
      otherReqSpecification.value.length == 0
    ) {
      // 其它规格信息有两个
      otherReqSpecification.value = [{}, {}];
    } else if (
      formData.value?.sheinSaleAttrsInfoDto?.subAttributeId1 &&
      otherReqSpecification.value.length == 1
    ) {
      // 其它规格信息有两个
      otherReqSpecification.value.push({});
    } else if (
      formData.value?.sheinSaleAttrsInfoDto?.subAttributeId &&
      otherReqSpecification.value.length < 1
    ) {
      // 其它规格信息有一个
      otherReqSpecification.value = [{}];
    }
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
  const errSkusList = ref([]);
  function getRowStyle(rowObj) {
    return {
      background: errSkusList.value.includes(rowObj.row.storeSSku)
        ? 'yellow'
        : ''
    };
  }
  //  新建&编辑shein模板--保存
  const handleEditDialog = async function () {
    // 必填项校验
    if (!dialogForm.categoryId || !dialogForm.title) {
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
    // 其它规格选中项
    let subSelect1 = sheinSaleAttrsInfoDto.value.subAttributeId1
      ? dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
          (item) =>
            item.attributeId == sheinSaleAttrsInfoDto.value.subAttributeId1
        )
      : [];
    // let subSelect1 = sheinSaleAttrsInfoDto.value.subAttributeId1
    //   ? dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
    //       (item) =>
    //         item.attributeId == sheinSaleAttrsInfoDto.value.subAttributeId1
    //     )
    //   : [];
    // 根据返回的数据，判断次规格是否必选&选中的是否是必填项
    let requiredNum =
      dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
        (item) => item.attributeStatus == 3
      );
    // 类目属性必填项是否填值
    let requireSpecAttr = dialogForm.sheinCategoryAttrDtos1.requiredData.filter(
      (item) =>
        item.defaultValue &&
        item.defaultValue.length != 0 &&
        item.defaultValue != ''
    );
    // 变种信息主规格必填项
    let tableMain = dialogForm.sheinPublishSkuDtos.filter(
      (item) =>
        item.main === undefined ||
        item.main === '' ||
        item.costPrice === undefined ||
        item.costPrice === '' ||
        item.inventoryNum === undefined ||
        item.inventoryNum === '' ||
        item.packageHeight === undefined ||
        item.packageHeight === '' ||
        item.packageLength === undefined ||
        item.packageLength === '' ||
        item.packageWidth === undefined ||
        item.packageWidth === '' ||
        item.weight === undefined ||
        item.weight === '' ||
        item.prodSSku === undefined ||
        item.prodSSku === ''
    );
    if (
      mainSelect.length == 0 ||
      requireSpecAttr.length !=
        dialogForm.sheinCategoryAttrDtos1.requiredData.length ||
      tableMain.length != 0
    ) {
      ElMessage.warning(`必填项不能为空`);
      return false;
    }
    // 变种信息表格，不允许有空值
    let tableSubVal = [],
      tableSub1Val = [];
    if (otherReqSpecification.value.length == 1) {
      tableSubVal = dialogForm.sheinPublishSkuDtos.filter(
        (item) => item.sub == ''
      );
    } else if (otherReqSpecification.value.length == 2) {
      tableSub1Val = dialogForm.sheinPublishSkuDtos.filter(
        (item) => item.sub1 == ''
      );
    }
    if (tableSubVal.length != 0 || tableSub1Val.length != 0) {
      return ElMessage.warning('请把变种信息表格的值填写完整');
    }
    // 只要添加了规格，不管是否必填，都需要填写数据
    if (
      (otherReqSpecification.value.length == 1 &&
        !sheinSaleAttrsInfoDto.value.subAttributeId) ||
      (otherReqSpecification.value.length == 2 &&
        (!sheinSaleAttrsInfoDto.value.subAttributeId ||
          !sheinSaleAttrsInfoDto.value.subAttributeId1))
    ) {
      return ElMessage.warning('请选择其他规格的值，或者删除其他规格');
    }
    // 根据规格信息里面主规格下拉的值，获取必填的选项值，看必填的选项值是否被全部选中
    if (
      (requiredNum.length == 1 &&
        mainSelect[0]?.attributeStatus != 3 &&
        subSelect[0]?.attributeStatus != 3 &&
        subSelect1[0]?.attributeStatus != 3) ||
      (requiredNum.length == 2 &&
        ((mainSelect[0]?.attributeStatus != 3 &&
          subSelect[0]?.attributeStatus != 3) ||
          (subSelect[0]?.attributeStatus != 3 &&
            subSelect1[0]?.attributeStatus != 3) ||
          (mainSelect[0]?.attributeStatus != 3 &&
            subSelect1[0]?.attributeStatus != 3))) ||
      (requiredNum.length == 3 &&
        !(
          mainSelect[0]?.attributeStatus == 3 &&
          subSelect[0]?.attributeStatus == 3 &&
          subSelect1[0]?.attributeStatus == 3
        ))
    ) {
      ElMessage.warning(`规格信息存在必填的选项，请修改为必填的选项`);
      return false;
    }
    // // 次规格必填||次规格不是必填，但是次规格选了必填属性,表格中的次规格也需要必填
    // if (
    //   requiredNum.length > 1 ||
    //   (requiredNum.length == 1 &&
    //     subSelect.length != 0 &&
    //     subSelect[0].attributeStatus == 3)
    // ) {
    //   // 变种信息次规格必填项
    //   let tableMain = dialogForm.sheinPublishSkuDtos.filter(
    //     (item) => item.sub === undefined || item.sub === ''
    //   );
    //   if (tableMain.length != 0) {
    //     ElMessage.warning(`必填项不能为空`);
    //     return false;
    //   }
    // }
    // // 如果不存在必填项，不用校验，主次规格随便选
    // if (
    //   requiredNum.length == 1 &&
    //   subSelect.length != 0 &&
    //   mainSelect[0].attributeStatus != 3 &&
    //   subSelect[0].attributeStatus != 3
    // ) {
    //   // 只有一个必选项，主规格次规格都选值了，并且都没有选必选项
    //   ElMessage.warning(`该类目存在必填规格属性，请在主规格或者其他规格中填写`);
    //   return false;
    // } else if (
    //   // 只有一个必选项，主规格选值了，次规格为空，主规格没有选必选项
    //   requiredNum.length == 1 &&
    //   subSelect.length == 0 &&
    //   mainSelect[0].attributeStatus != 3
    // ) {
    //   ElMessage.warning(`该类目存在必填规格属性，请在主规格或者其他规格中填写`);
    //   return false;
    // } else if (
    //   requiredNum.length > 1 &&
    //   (mainSelect[0].attributeStatus != 3 || subSelect[0].attributeStatus != 3)
    // ) {
    //   // 有>=2个必选项，主规格次规格都必选
    //   ElMessage.warning(`主规格和其他规格都为必填项，请检查是否已填`);
    //   return false;
    // }
    // 主规格属性与oa映射:sheinSaleAttrsInfoDto
    // if (
    //   sheinSaleAttrsInfoDto.value.oaMainAttributeName ==
    //     sheinSaleAttrsInfoDto.value.oaSubAttributeName &&
    //   sheinSaleAttrsInfoDto.value.oaSubAttributeName != ''
    // ) {
    //   ElMessage.warning(`映射oa规格不能相同`);
    //   return false;
    // }
    if (dialogForm.title.length > 1000) {
      ElMessage.warning(`标题最多1000字符，已超出限制`);
      return false;
    }
    // 尺码表
    const {
      sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos,
      needPromptMsg,
      needSubSpecAttributeValueName
    } = sizeAttrTableRef.value.getTableData();
    if (needSubSpecAttributeValueName) {
      return ElMessage.warning('尺码表的尺寸为必要条件');
    }
    if (needPromptMsg) {
      return ElMessage.warning('请将尺码表种中项填写完整');
    }
    if (
      (!selectGroupVal.value.envPro || selectGroupVal.value.envPro == '') &&
      (!selectGroupVal.value.glasse || selectGroupVal.value.glasse == '') &&
      (!selectGroupVal.value.wateringMark ||
        selectGroupVal.value.wateringMark == '')
    ) {
      return ElMessage.warning('请选择环保贴/眼镜贴/水洗唛');
    }
    if (
      (!selectGroupVal.value.envPro || selectGroupVal.value.envPro == '') &&
      (!selectGroupVal.value.glasse || selectGroupVal.value.glasse == '') &&
      selectGroupVal.value.wateringMark &&
      selectGroupVal.value.wateringMark != ''
    ) {
      return ElMessage.warning('不能仅选择水洗唛');
    }
    let labels = {
      wateringMark:
        !selectGroupVal.value.wateringMark ||
        selectGroupVal.value.wateringMark == ''
          ? ''
          : selectGroupVal.value.wateringMark.value.split(
              selectGroupInit.value.imgUrl
            )[1],
      envPro:
        !selectGroupVal.value.envPro || selectGroupVal.value.envPro == ''
          ? ''
          : selectGroupVal.value.envPro.value.split(
              selectGroupInit.value.imgUrl
            )[1],
      glasse:
        !selectGroupVal.value.glasse || selectGroupVal.value.glasse == ''
          ? ''
          : selectGroupVal.value.glasse.value.split(
              selectGroupInit.value.imgUrl
            )[1]
    };
    // 首次上架日期
    if (
      !DateFirstReleaseTable.value[0].hopeOnSaleDate &&
      DateFirstReleaseTable.value[0].shelfWay == 2
    ) {
      return ElMessage.warning('请填写首次上架日期');
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
    sheinSaleAttrsInfoDto.value.subAttributeName1 = sheinSaleAttrsInfoDto.value
      .subAttributeId1
      ? dialogForm.sheinMainAndSubSpecificationDto.subSpecificationAttributeInfoList.filter(
          (item) =>
            item.attributeId == sheinSaleAttrsInfoDto.value.subAttributeId1
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
        },
        {
          attributeId: sheinSaleAttrsInfoDto.value.subAttributeId1,
          attributeName: sheinSaleAttrsInfoDto.value.subAttributeName1,
          attributeValueList: [
            {
              attributeValue: typeof item.sub1 === 'string' ? item.sub1 : '',
              attributeValueId: typeof item.sub1 === 'string' ? '' : item.sub1
            }
          ]
        }
      ];
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
    dialogForm.isMall = 0;
    let SizeAttributeInfoOption = [];
    if (otherReqSpecification.value.length == 0) {
      SizeAttributeInfoOption = init.main.map((item) => item.attributeValue);
    } else {
      SizeAttributeInfoOption = init.sub.map((item) => item.attributeValue);
    }
    sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.forEach((item) => {
      if (!SizeAttributeInfoOption.includes(item.subSpecAttributeValueName)) {
        item.subSpecAttributeValueId = '';
      }
    });
    try {
      // 新增保存
      const { code } = await saveStoreProduct({
        ...dialogForm,
        hopeOnSaleDate: new Date(
          DateFirstReleaseTable.value[0].hopeOnSaleDate
        ).getTime(),
        shelfWay: DateFirstReleaseTable.value[0].shelfWay,
        sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos,
        labels: JSON.stringify(labels),
        isMall: false
      });
      if (code == '0000') {
        ElMessage.success(`保存成功`);
        emit('closeDialog', { isShow: false, save: true });
      }
    } catch (err) {
      if (err.message.includes('存在组合品')) {
        let errSkusStr = err.message.split('[')[1].split(']')[0];
        errSkusList.value = errSkusStr.split(',');
      }
    } finally {
      updateLoading.value = false;
    }
  };
  onMounted(async () => {
    // 获取品牌接口
    const { data } = await getStoreBrandList({
      storeAcctId: formData.value.storeAcctId,
      isMall: false
    });
    init.brandList = data;
    // 获取平台类目
    getCates();
    prodCateOaTreeName.value = props.formData.prodCateOaTreeName;
    if (!isEmpty(props.formData.option)) {
      prodCateOaTreeName.value = props.formData.option.prodCateOaTreeName;
    }
    getLablesByIdFunc('open');
  });

  const getLablesByIdFunc = async (isFirst) => {
    //获取标签--水洗唛/眼睛贴/环保贴
    const { data } = await getLablesById();
    selectGroupInit.value = data;
    let typeData = {
      wateringMark: 'wateringMarkGroup',
      envPro: 'envProGroup',
      glasse: 'glasseGroup'
    };
    for (let i in typeData) {
      if (data[i] != '{}') {
        let _Group = [];
        for (let key in JSON.parse(data[i])) {
          _Group.push({
            value: data.imgUrl + JSON.parse(data[i])[key],
            label: key
          });
        }
        typeData[i] == 'wateringMarkGroup'
          ? (wateringMarkGroup.value[0].options = _Group)
          : '';
        typeData[i] == 'envProGroup'
          ? (envProGroup.value[0].options = _Group)
          : '';
        typeData[i] == 'glasseGroup'
          ? (glasseGroup.value[0].options = _Group)
          : '';
      } else {
        typeData[i] == 'wateringMarkGroup'
          ? (wateringMarkGroup.value[0].options = [])
          : '';
        typeData[i] == 'envProGroup' ? (envProGroup.value[0].options = []) : '';
        typeData[i] == 'glasseGroup' ? (glasseGroup.value[0].options = []) : '';
      }
    }

    if (isFirst == 'open') {
      let labels = JSON.parse(
        formData.value.labels ? formData.value.labels : '{}'
      );
      if (labels.envPro && labels.envPro != '') {
        let arr = envProGroup.value[0].options.filter((item) =>
          item.value.includes(labels.envPro)
        );
        selectGroupVal.value.envPro = arr[0];
      }
      if (labels.glasse && labels.glasse != '') {
        let arr = glasseGroup.value[0].options.filter((item) =>
          item.value.includes(labels.glasse)
        );
        selectGroupVal.value.glasse = arr[0];
      }
      if (labels.wateringMark && labels.wateringMark != '') {
        let arr = wateringMarkGroup.value[0].options.filter((item) =>
          item.value.includes(labels.wateringMark)
        );
        selectGroupVal.value.wateringMark = arr[0];
      }
    }
  };

  // 预览pdf
  let pdfShowTime = ref({
    wateringMark: '',
    envPro: '',
    glasse: ''
  });
  const openPDFPreview = (padfUrl, canvasEl) => {
    if (canvasEl.includes('wateringMark')) {
      pdfShowTime.value.wateringMark = canvasEl;
    }
    if (canvasEl.includes('envPro')) {
      pdfShowTime.value.envPro = canvasEl;
    }
    if (canvasEl.includes('glasse')) {
      pdfShowTime.value.glasse = canvasEl;
    }
    // PDF文件的URL
    const pdfUrl = padfUrl;

    // 创建一个新的PDF文档实例
    pdfjs.getDocument(pdfUrl).promise.then((pdf) => {
      // 获取第一页
      pdf.getPage(1).then((page) => {
        const canvas = document.getElementById(canvasEl);
        const context = canvas.getContext('2d');

        const viewport = page.getViewport({ scale: 2.5 });

        // 设置画布大小以匹配PDF页面尺寸
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // 将PDF页面渲染到画布上
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    });
  };
  // 类目组件 start
  let oaList = ref();
  let cateName = ref(null);
  // 获取类目;
  const getCates = async () => {
    try {
      const { data, code } = await getSheinCateList({
        storeAcctId: formData.value.storeAcctId,
        isMall: false,
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
      subAttributeId1: '',
      subAttributeName1: '',
      oaSubAttributeName1: '',
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
      item.sub1 = '';
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
      platCode: 'shein自营'
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
        // 默认显示必填的其它规格
        aData.splice(0, 1);
        otherReqSpecification.value = aData;
      } else {
        subRequired.value = false;
        otherReqSpecification.value = [];
      }
      // 尺码表列发生变化
      dialogForm.sizeAttributeInfoDtos = data.sizeAttributeInfoDtos;
      sizeAttrTableRef.value.initData();
      prodCateOaTreeName.value = data.prodCateOaTreeName;
      init.sub1 = init.sub = init.main = [];
    }
    dialogForm.sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos = [];
  };

  let envProGroup = ref([
    {
      options: []
    },
    {
      options: [
        {
          value: ' ',
          label: '新增模板'
        }
      ]
    }
  ]);
  let glasseGroup = ref([
    {
      options: []
    },
    {
      options: [
        {
          value: ' ',
          label: '新增模板'
        }
      ]
    }
  ]);
  let wateringMarkGroup = ref([
    {
      options: []
    },
    {
      options: [
        {
          value: ' ',
          label: '新增模板'
        }
      ]
    }
  ]);
  let selectGroupInit = ref({});
  let selectGroupVal = ref({
    envPro: '',
    glasse: '',
    wateringMark: ''
  });

  // const importPdf = (val, type) => {
  //   // <!-- 1水洗唛、2环保贴、3眼睛贴 -->
  //   console.log(type);
  //   console.log(val);
  //   console.log(selectGroupVal.value.envPro);
  // };

  const handleUpload = async (rawFile, type) => {
    const fd = new FormData();
    fd.append('id', selectGroupInit.value.id || '');
    fd.append('wateringMark', selectGroupInit.value.wateringMark || '{}');
    fd.append('envPro', selectGroupInit.value.envPro || '{}');
    fd.append('glasse', selectGroupInit.value.glasse || '{}');
    // fd.append('prodPId', formData.value.prodPId);
    // fd.append('prodPSku', formData.value.prodPSku);
    fd.append('pdf', rawFile.file);
    fd.append('labelType', type);
    const { code, msg } = await saveOrUpdateLables(fd);
    if (code == '0000') {
      // 刷新
      ElMessage.success(msg);
      getLablesByIdFunc();
    }
  };

  const delSelectGroup = async (val, type) => {
    // <!-- 1水洗唛、2环保贴、3眼睛贴 -->
    let typeData = {
      1: 'wateringMark',
      2: 'envPro',
      3: 'glasse'
    };
    let obj = JSON.parse(selectGroupInit.value[typeData[type]]);
    delete obj[val];
    selectGroupInit.value[typeData[type]] = JSON.stringify(obj);
    // setTimeout(() => {
    //   value11.value = '';
    // }, 10);
    const fd = new FormData();
    fd.append('id', selectGroupInit.value.id || '');
    fd.append('wateringMark', selectGroupInit.value.wateringMark || '{}');
    fd.append('envPro', selectGroupInit.value.envPro || '{}');
    fd.append('glasse', selectGroupInit.value.glasse || '{}');
    // fd.append('prodPId', formData.value.prodPId);
    // fd.append('prodPSku', formData.value.prodPSku);
    fd.append('labelType', type);
    const { code, msg } = await saveOrUpdateLables(fd);
    if (code == '0000') {
      // 刷新
      ElMessage.success(msg);
      selectGroupVal.value[typeData[type]] = '';
      getLablesByIdFunc();
    }
  };

  // 类目组件 end
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
