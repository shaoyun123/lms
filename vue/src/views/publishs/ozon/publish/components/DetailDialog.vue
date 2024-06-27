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
      <el-form-item label="店铺父SKU">
        <el-input v-model="dialogForm.storePSku" readonly />
      </el-form-item>
      <el-form-item label="标题">
        <PlatTitle
          v-model="dialogForm.title"
          :prod-p-id="dialogForm.prodPId"
          :input-width="'700px'"
          :max-length="200"
          :content-top="50"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="dialogForm.description" :rows="4" type="textarea" />
      </el-form-item>
      <el-form-item label="ozon类目">
        <el-input v-model="dialogForm.fullCateName" readonly />
      </el-form-item>
      <el-divider content-position="left"><h3>类目属性</h3></el-divider>
      <div v-for="item in dialogForm.normalAttrList" :key="item.attrId">
        <el-form-item
          v-if="item.isRequired"
          required
          :class="[item.isRequired && !item.value ? 'is-error' : '']"
          :label="item.attrName"
        >
          <!-- 单选 -->
          <el-select
            v-if="
              getInputType(item.dictionaryId, item.isCollection, item.type) ==
              'select'
            "
            v-model="item.value"
            clearable
          >
            <el-option
              v-for="cItem in item.values"
              :key="cItem.value"
              :value="cItem.value"
              :label="cItem.value"
            />
          </el-select>
          <el-input
            v-else-if="
              getInputType(item.dictionaryId, item.isCollection, item.type) ==
              'string'
            "
            v-model="item.value"
            clearable
            style="width: 210px"
          />
          <!-- 单选+可自定义+校验数字 -->
          <!-- <el-autocomplete
          v-if="
            getInputType(
              item.dictionaryId,
              item.isCollection,
              item.type
            ) == 'string'
          "
          v-model="item.value"
          :fetch-suggestions="querySearch"
          clearable
          class="inline-input w-50"
          @focus="getData(item.value.split(','))"
        /> -->
          <el-input-number
            v-else-if="
              getInputType(item.dictionaryId, item.isCollection, item.type) ==
              'number'
            "
            v-model="item.value"
          />
          <!-- 多选 -->
          <el-select
            v-if="
              getInputType(item.dictionaryId, item.isCollection, item.type) ==
              'mSelect'
            "
            v-model="item.value"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <el-option
              v-for="cItem in item.values"
              :key="cItem.value"
              :value="cItem.value"
              :label="cItem.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div style="color: #59bbed" @click="hideOrShow = !hideOrShow">
        {{ hideOrShow ? '点击折叠' : '点击展开所有' }}
      </div>
      <div v-for="item in dialogForm.normalAttrList" :key="item.attrId">
        <el-form-item
          v-if="!item.isRequired && hideOrShow == true"
          :class="[item.isRequired && !item.value ? 'is-error' : '']"
          :label="item.attrName"
        >
          <!-- 单选 -->
          <el-select
            v-if="
              getInputType(item.dictionaryId, item.isCollection, item.type) ==
              'select'
            "
            v-model="item.value"
            clearable
          >
            <el-option
              v-for="cItem in item.values"
              :key="cItem.value"
              :value="cItem.value"
              :label="cItem.value"
            />
          </el-select>
          <el-input
            v-else-if="
              getInputType(item.dictionaryId, item.isCollection, item.type) ==
              'string'
            "
            v-model="item.value"
            clearable
            style="width: 210px"
          />
          <!-- 单选+可自定义+校验数字 -->
          <!-- <el-autocomplete
          v-if="
            getInputType(
              item.dictionaryId,
              item.isCollection,
              item.type
            ) == 'string'
          "
          v-model="item.value"
          :fetch-suggestions="querySearch"
          clearable
          class="inline-input w-50"
          @focus="getData(item.value.split(','))"
        /> -->
          <el-input-number
            v-else-if="
              getInputType(item.dictionaryId, item.isCollection, item.type) ==
              'number'
            "
            v-model="item.value"
          />
          <!-- 多选 -->
          <el-select
            v-if="
              getInputType(item.dictionaryId, item.isCollection, item.type) ==
              'mSelect'
            "
            v-model="item.value"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <el-option
              v-for="cItem in item.values"
              :key="cItem.value"
              :value="cItem.value"
              :label="cItem.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-divider content-position="left"><h3>商品图片</h3></el-divider>
      <div style="display: flex; flex-direction: column">
        <div style="display: flex; margin: 5px; align-items: center">
          <span style="color: red">*</span>主图
          <el-button
            v-if="dialogForm.imageList && dialogForm.imageList.length < 7"
            type="primary"
            @click="openUrlImg"
            >网络图片</el-button
          >

          <el-upload
            action="/api/lms/prodTpl/uploadPic.html"
            :on-success="importSuccess"
            :on-error="importError"
            :show-file-list="false"
          >
            <el-button
              v-if="dialogForm.imageList && dialogForm.imageList.length < 7"
              class="ml-2"
              type="primary"
              >本地图片</el-button
            >
          </el-upload>
          <el-button
            v-if="(dialogForm.imageList && dialogForm.imageList.length) < 7"
            type="primary"
            class="ml-2"
            @click="handleTplImg"
            >模板图片</el-button
          >
          <div class="ml-2">说明：最多选用 7 张，至少一张</div>
        </div>
        <div style="display: flex">
          <div
            v-for="(imgSrc, index) in dialogForm.imageList"
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
                  <el-image v-if="imgSrc" :src="imgSrc + '!size=80x80' || ''" />
                </template>
              </el-popover>
            </div>
            <div>
              <span
                style="color: red"
                @click="dialogForm.imageList.splice(index, 1)"
                >移除</span
              >
            </div>
          </div>
        </div>
      </div>
      <el-divider content-position="left"> <h3>变种属性信息</h3></el-divider>
      <span style="color: #59bbed">提示：仅支持自定义的平台属性映射oa属性</span>
      <div v-if="dialogForm.salePropAttrList" style="display: flex">
        <el-form-item label="平台属性名称">
          <el-select
            v-model="initTpl.name1"
            clearable
            @change="choosePlat('name1', $event)"
          >
            <el-option
              v-for="item in dialogForm.salePropAttrList"
              :key="item.attrId"
              :value="item.attrName"
              :disabled="
                item.attrName == initTpl.name2 || item.attrName == '商品颜色'
              "
              ><span v-if="item.isRequired" style="color: red">*</span
              >{{ item.attrName }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="平台属性名称">
          <el-select
            v-model="initTpl.name2"
            clearable
            @change="choosePlat('name2', $event)"
          >
            <el-option
              v-for="item in dialogForm.salePropAttrList"
              :key="item.attrId"
              :value="item.attrName"
              :disabled="
                item.attrName == initTpl.name1 || item.attrName == '商品颜色'
              "
              ><span v-if="item.isRequired" style="color: red">*</span
              >{{ item.attrName }}</el-option
            >
          </el-select>
        </el-form-item>
      </div>
      <div style="display: flex">
        <!-- 只有可自定义的平台属性才能选择映射OA 属性 -->
        <el-form-item label="映射OA属性">
          <el-select
            v-model="initTpl.mainOa"
            clearable
            :disabled="
              !initTpl.name1 ||
              getInputType(
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name1
                )[0]?.dictionaryId,
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name1
                )[0]?.isCollection,
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name1
                )[0]?.type
              ) == 'mSelect' ||
              getInputType(
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name1
                )[0]?.dictionaryId,
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name1
                )[0]?.isCollection,
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name1
                )[0]?.type
              ) == 'select'
            "
            @change="chooseOA('name1', $event)"
          >
            <el-option
              v-for="item in initTpl.oa1"
              :key="item"
              :value="item"
              :disabled="item == initTpl.assistOa"
              >{{ item }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="映射OA属性">
          <el-select
            v-model="initTpl.assistOa"
            clearable
            :disabled="
              !initTpl.name2 ||
              getInputType(
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name2
                )[0]?.dictionaryId,
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name2
                )[0]?.isCollection,
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name2
                )[0]?.type
              ) == 'mSelect' ||
              getInputType(
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name2
                )[0]?.dictionaryId,
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name2
                )[0]?.isCollection,
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name2
                )[0]?.type
              ) == 'select'
            "
            @change="chooseOA('name2', $event)"
          >
            <el-option
              v-for="item in initTpl.oa1"
              :key="item"
              :value="item"
              :disabled="item == initTpl.mainOa"
              >{{ item }}</el-option
            >
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <!-- 变种参数表格 -->
    <!-- <el-button
      type="primary"
      style="float: right; margin: 5px"
      @click="handlePublishNum"
      >批量修改变种信息</el-button
    > -->
    <el-table :data="dialogForm.skuInfoList" border :size="small">
      <el-table-column label="子SKU主图">
        <template #default="scope">
          <div style="display: flex; flex-direction: column">
            <div style="width: 120px">
              <el-popover
                placement="right"
                width="500px"
                :hide-after="0"
                trigger="hover"
              >
                <template #default>
                  <el-image :src="scope.row.images || ''" />
                </template>
                <template #reference>
                  <el-image
                    v-if="scope.row.images"
                    :src="scope.row.images + '!size=80x80' || ''"
                  />
                </template>
              </el-popover>
            </div>
            <el-upload
              action="/api/lms/prodTpl/uploadPic.html"
              :on-success="(event) => importSuccessMain(event, scope.$index)"
              :on-error="importError"
              :show-file-list="false"
            >
              <el-button type="primary" style="padding: 0 17px"
                >本地图片</el-button
              >
            </el-upload>
            <el-button
              type="primary"
              style="padding: 0 15px; margin-top: 4px"
              @click="handleTplImg(scope.$index)"
              >模板图片</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column property="storeSubSku" label="店铺子SKU" />
      <el-table-column label="系统属性">
        <template #default="scope">
          color：{{ scope.row.color }}<br />
          size：{{ scope.row.size }}<br />
          style：{{ scope.row.style }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          dialogForm.salePropAttrList?.filter((x) => x.attrName == '商品颜色')
            ?.length != 0
        "
      >
        <template #header
          ><span
            v-if="
              dialogForm.salePropAttrList?.filter(
                (x) => x.attrName == '商品颜色'
              )[0]?.isRequired
            "
            style="color: red"
            >*</span
          >商品颜色</template
        >
        <template #default="scope">
          <div style="display: flex; align-items: baseline">
            <el-input
              v-if="
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == '商品颜色'
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == '商品颜色'
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == '商品颜色'
                  )[0]?.type
                ) == 'string' ||
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == '商品颜色'
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == '商品颜色'
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == '商品颜色'
                  )[0]?.type
                ) == 'number'
              "
              v-model="scope.row.name0"
            ></el-input>
            <!-- scope.row[
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == '商品颜色'
                  )[0]?.attrName
                ] -->
            <el-select v-else v-model="scope.row.name0" clearable multiple>
              <el-option
                v-for="item in dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == '商品颜色'
                )[0]?.values"
                :key="item.value"
                :value="item.value"
                :label="item.value"
              />
            </el-select>
            <el-tooltip class="box-item" content="向下填充" placement="right">
              <el-icon
                v-if="scope.$index == 0"
                style="cursor: pointer"
                @click="handleRowData(scope.row.name0, 'name0')"
              >
                <ArrowDownBold />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="initTpl.name1">
        <template #header
          ><span
            v-if="
              dialogForm.salePropAttrList?.filter(
                (x) => x.attrName == initTpl.name1
              )[0]?.isRequired
            "
            style="color: red"
            >*</span
          >{{ initTpl.name1 }}
        </template>
        <template #default="scope">
          <div style="display: flex; align-items: baseline">
            <el-input
              v-if="
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name1
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name1
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name1
                  )[0]?.type
                ) == 'string' ||
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name1
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name1
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name1
                  )[0]?.type
                ) == 'number'
              "
              v-model="scope.row.name1"
            ></el-input>
            <!-- scope.row[
                  dialogForm.salePropAttrList.filter(
                    (x) => x.attrName == initTpl.name1
                  )[0]?.attrName
                ] -->
            <el-select v-else v-model="scope.row.name1" clearable>
              <el-option
                v-for="item in dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name1
                )[0]?.values"
                :key="item.value"
                :value="item.value"
                :label="item.value"
              />
            </el-select>
            <el-tooltip class="box-item" content="向下填充" placement="right">
              <el-icon
                v-if="scope.$index == 0"
                style="cursor: pointer"
                @click="handleRowData(scope.row.name1, 'name1')"
              >
                <ArrowDownBold />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="initTpl.name2">
        <template #header
          ><span
            v-if="
              dialogForm.salePropAttrList?.filter(
                (x) => x.attrName == initTpl.name2
              )[0]?.isRequired
            "
            style="color: red"
            >*</span
          >{{ initTpl.name2 }}
        </template>
        <template #default="scope">
          <div style="display: flex; align-items: baseline">
            <el-input
              v-if="
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name2
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name2
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name2
                  )[0]?.type
                ) == 'string' ||
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name2
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name2
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name2
                  )[0]?.type
                ) == 'number'
              "
              v-model="scope.row.name2"
            ></el-input>
            <!-- scope.row[
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name2
                  )[0]?.attrName
                ] -->
            <el-select v-else v-model="scope.row.name2" clearable>
              <el-option
                v-for="item in dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl.name2
                )[0]?.values"
                :key="item.value"
                :value="item.value"
                :label="item.value"
              />
            </el-select>
            <el-tooltip class="box-item" content="向下填充" placement="right">
              <el-icon
                v-if="scope.$index == 0"
                style="cursor: pointer"
                @click="handleRowData(scope.row.name2, 'name2')"
              >
                <ArrowDownBold />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column property="weight" label="Package weight(g)">
        <template #default="scope">
          <el-input v-model="scope.row.weight">{{ scope.row.weight }}</el-input>
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
      <el-table-column
        property="tempSku"
        :label="'价格（' + dialogForm.currency + '）'"
      >
        <template #default="scope">
          促销价:{{ scope.row.specialPrice }}<br />
          原价:{{ scope.row.price }}
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
            @confirm="remove(scope.$index, scope)"
          >
            <template #reference>
              <el-button type="danger">移除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button
        v-if="tabName == '0' || tabName == '2'"
        type="primary"
        @click="handleEditDialog()"
        >保存</el-button
      >
    </template>
  </el-dialog>
  <!-- <el-dialog
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
  </el-dialog> -->
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
  <!-- 模板图片 -->
  <ChooseTplImage
    v-model="tplImgVisible"
    limit="1"
    :params="{
      platCode: 'ozon',
      prodPIds: [dialogForm.prodPId]
    }"
    @get-tpl-img="getTplImg"
  />
</template>
<script setup>
  import { ref, toRefs, defineProps, defineEmits, onMounted } from 'vue';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  // import { storeToRefs } from 'pinia';
  import {
    updateOzonPublishDetail,
    getOzonPublishDetail
  } from '@/api/publishs/ozonpublish';
  import { ElMessage } from 'element-plus';
  import PlatTitle from '@/components/PlatTitle/index.vue';
  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: -1
    },
    tabName: {
      type: String,
      default: ''
    }
  });
  const { tabName, id } = toRefs(props);

  // const typeDescription = {
  //   mSelect: '多选',
  //   select: '单选',
  //   string: 'string + 可自定义',
  //   number: '数字 + 可自定义'
  // };

  const getInputType = (dictionaryId, isCollection, type) => {
    if (dictionaryId != 0 && isCollection == true) {
      return 'mSelect';
    } else if (dictionaryId != 0 && isCollection == false) {
      return 'select';
    } else if (
      (dictionaryId == 0 && isCollection == false) ||
      (dictionaryId == 0 && isCollection == true)
    ) {
      if (type == 'String' || type == 'URL') {
        return 'string';
      } else {
        return 'number';
      }
    }
  };

  //   ozon模板弹窗
  const dialogForm = ref({});
  // 类目属性展开折叠
  const hideOrShow = ref(false);
  onMounted(async () => {
    const { code, data } = await getOzonPublishDetail(id.value);
    if (code == '0000') {
      dialogForm.value = data;
      dialogForm.value['salePropAttrList'] = JSON.parse(
        JSON.stringify(dialogForm.value.skuInfoList[0]?.salePropAttrList)
      );
      dialogForm.value.imageList = dialogForm.value.pImages?.split(',');
      // dialogForm.value.skuInfoList?.forEach((item) => {
      //   item.salePropAttrList?.forEach((c) => {
      //     !c.value ? (c.attrName = '') : '';
      //   });
      // });
      dialogForm.value.normalAttrList?.forEach((item) => {
        if (
          getInputType(item.dictionaryId, item.isCollection, item.type) ==
          'mSelect'
        ) {
          item.value = item.value?.split(';');
        }
      });
      handelData();
    }
  });

  function handelData() {
    //  `${initTpl.value.name1}:${initTpl.value.mainOa};${initTpl.value.name2}:${initTpl.value.assistOa}`;
    initTpl.value['name1'] = dialogForm.value['attrKeyOa']
      ?.split(';')[0]
      ?.split(':')[0];
    initTpl.value['name2'] = dialogForm.value['attrKeyOa']
      ?.split(';')[1]
      ?.split(':')[0];
    initTpl.value['mainOa'] = dialogForm.value['attrKeyOa']
      ?.split(';')[0]
      ?.split(':')[1];
    initTpl.value['assistOa'] = dialogForm.value['attrKeyOa']
      ?.split(';')[1]
      ?.split(':')[1];
    // 获取oaAttrName4/oaAttrName5/oaAttrName6/oaAttrName7，为了后面自动映射，仅前端用
    dialogForm.value.skuInfoList?.forEach((item) => {
      item.oaAttrName3
        ? (item[item.oaAttrName3?.split(':')[0]] =
            item.oaAttrName3?.split(':')[1])
        : '';
      item.oaAttrName4
        ? (item[item.oaAttrName4?.split(':')[0]] =
            item.oaAttrName4?.split(':')[1])
        : '';
      item.oaAttrName5
        ? (item[item.oaAttrName5?.split(':')[0]] =
            item.oaAttrName5?.split(':')[1])
        : '';
      item.oaAttrName6
        ? (item[item.oaAttrName6?.split(':')[0]] =
            item.oaAttrName6?.split(':')[1])
        : '';
      item.oaAttrName7
        ? (item[item.oaAttrName7?.split(':')[0]] =
            item.oaAttrName7?.split(':')[1])
        : '';
      // 表格动态列选中的值
      let A = ['商品颜色', initTpl.value['name1'], initTpl.value['name2']];
      item.salePropAttrList &&
        item.salePropAttrList.forEach((i) => {
          if (i.value && A.indexOf(i.attrName) == 0) {
            item['name' + A.indexOf(i.attrName)] = i.value?.split(';');
          } else if (i.value && A.indexOf(i.attrName) > 0) {
            item['name' + A.indexOf(i.attrName)] = i.value;
          }
        });
    });

    // 获取映射oa属性
    let A = [1, 2, 3, 4, 5, 6, 7];
    initTpl.value.oa1 = [];
    A.forEach((a) => {
      if (
        dialogForm.value.skuInfoList?.length != 0 &&
        dialogForm.value.skuInfoList[0]['oaAttrName' + a]
      ) {
        initTpl.value.oa1.push(
          dialogForm.value.skuInfoList[0]['oaAttrName' + a]?.split(':')[0]
        );
      }
    });
  }

  // const dialogForm = storeToRefs(formData);

  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    emit('closeDialog', { isShow: false });
  };

  // 本地图片
  const importSuccess = (res) => {
    if (res.code == '0000') {
      dialogForm.value.imageList.push(res.msg);
      ElMessage.success('上传成功！');
    } else {
      ElMessage.error(res.msg);
    }
  };
  const importSuccessMain = (res, index) => {
    if (res.code == '0000') {
      dialogForm.value.skuInfoList[index].images = res.msg;
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
  const openUrlImg = () => {
    dialogVisible.value = true;
  };
  const saveUrlImg = () => {
    checkImgExists(inputUrl.value)
      .then(() => {
        dialogForm.value.imageList.push(inputUrl.value);
        dialogVisible.value = false;
      })
      .catch(() => {
        return ElMessage.error(`url不能为空或不能访问`);
      });
  };

  // 模板图片
  const tplImgVisible = ref(false);
  const rowIndex = ref('');
  const handleTplImg = async (index) => {
    tplImgVisible.value = true;
    rowIndex.value = index;
  };
  const getTplImg = (imgUrlList) => {
    if (rowIndex.value) {
      dialogForm.value.skuInfoList[rowIndex.value].images = imgUrlList[0];
    } else {
      dialogForm.value.imageList.push(imgUrlList[0]);
    }
    // emits('validateImage');
  };

  // const publishNum = ref();
  // const otherNum = ref({
  //   packageHeight: '',
  //   packageLength: '',
  //   packageWidth: '',
  //   weight: ''
  // });
  //
  // // 批量修改变种信息
  // const publishNumDialog = ref(false);
  // const handlePublishNum = () => {
  //   publishNumDialog.value = true;
  // };

  // const closePublishNumDialog = () => {
  //   publishNumDialog.value = false;
  //   publishNum.value = '';
  //   otherNum.value.packageLength = '';
  //   otherNum.value.packageWidth = '';
  //   otherNum.value.packageHeight = '';
  //   otherNum.value.weight = '';
  // };

  // const savePublishNum = () => {
  //   if (
  //     publishNum.value != '' &&
  //     publishNum.value != undefined &&
  //     !/(^[1-9]\d*$)/.test(publishNum.value)
  //   ) {
  //     return ElMessage.warning('请输入正整数！');
  //   }
  //   dialogForm.value.skuInfoList.forEach((item) => {
  //     publishNum.value ? (item.quantity = publishNum.value) : '';
  //     otherNum.value.packageLength
  //       ? (item.packageLength = otherNum.value.packageLength)
  //       : '';
  //     otherNum.value.packageWidth
  //       ? (item.packageWidth = otherNum.value.packageWidth)
  //       : '';
  //     otherNum.value.packageHeight
  //       ? (item.packageHeight = otherNum.value.packageHeight)
  //       : '';
  //     otherNum.value.weight ? (item.weight = otherNum.value.weight) : '';
  //   });
  //   ElMessage.success('修改成功！');
  //   closePublishNumDialog();
  // };

  const dialogFormRef = ref(null);

  //  新建&编辑ozon模板--保存
  const handleEditDialog = async () => {
    let res;
    // 新增保存
    // sku变种校验
    let salePropAttrListName = {},
      isRequireName = [];
    dialogForm.value.salePropAttrList?.forEach((item) => {
      salePropAttrListName[item.attrName] = item.attrId;
      if (item.isRequired && item.attrName != '商品颜色') {
        isRequireName.push(item.attrName);
      }
    });

    // 平台属性名称的必选项需要选择
    if (isRequireName.length > 2) {
      ElMessage.warning('平台属性名称存在三个必选项');
      return;
    } else if (
      isRequireName.length == 2 &&
      !(
        isRequireName.includes(initTpl.value.name1) &&
        isRequireName.includes(initTpl.value.name2)
      )
    ) {
      ElMessage.warning('平台属性名称存在两个必选项');
      return;
    } else if (
      isRequireName.length == 1 &&
      !(
        isRequireName.includes(initTpl.value.name1) ||
        isRequireName.includes(initTpl.value.name2)
      )
    ) {
      ElMessage.warning('平台属性名称存在一个必选项');
      return;
    }
    try {
      dialogForm.value.skuInfoList?.forEach((item) => {
        if (
          item.packageHeight == '' ||
          item.packageLength == '' ||
          item.packageWidth == '' ||
          item.weight == ''
        ) {
          ElMessage.warning(`长宽高重量不能为空`);
          throw Error();
        }
        // // 校验：1. name和val要么都填，要么都不填；2. name为指定name，根据已有数据匹配，匹配不到报错；3. 不能一行都不填，至少一个name和val
        // let arr1 = item.salePropAttrList.map((c) => {
        //     if (c.attrName) {
        //       if (!salePropAttrListName[c.attrName]) {
        //         return '9999';
        //       } else {
        //         c['attrId'] = salePropAttrListName[c.attrName];
        //         return c.attrName;
        //       }
        //     } else {
        //       return '-1';
        //     }
        //   }),
        //   arr2 = item.salePropAttrList.map((c) => {
        //     if (c.value) {
        //       return c.attrName;
        //     } else {
        //       return '-1';
        //     }
        //   });
        // if (arr1.includes('9999')) {
        //   return ElMessage.warning(`变种参数名不是该类目的销售属性`);
        // }
        // if (arr1.toString() != arr2.toString()) {
        //   return ElMessage.warning(
        //     `变种参数填写有误，参数名称和参数值需同时填写`
        //   );
        // }
        // if (arr1?.filter((c) => c != -1).length == 0) {
        //   return ElMessage.warning(`变种参数不能全为空`);
        // }
        let addTd = ['商品颜色', initTpl.value.name1, initTpl.value.name2];
        item.salePropAttrList.forEach((x) => {
          console.log(x.attrName);
          let currentIndex = addTd.indexOf(x.attrName);
          if (currentIndex != -1) {
            if (
              x.isRequired &&
              (!item['name' + currentIndex] ||
                item['name' + currentIndex].length == 0)
            ) {
              ElMessage.warning(`${x.attrName}为必填项`);
              throw Error();
            }
            if (
              item['name' + currentIndex] &&
              Array.isArray(item['name' + currentIndex])
            ) {
              x['value'] = item['name' + currentIndex].join(';');
            } else {
              x['value'] = item['name' + currentIndex];
            }
          }
        });
      });
    } catch (e) {
      return false;
    }
    // 类目属性数据处理
    dialogForm.value.normalAttrList?.forEach((item) => {
      if (item.value && Array.isArray(item.value)) {
        item.value = item.value.join(';');
      }
    });
    if (dialogForm.value.imageList.length == 0) {
      ElMessage.warning(`主图最少一张`);
      return;
    }
    // attrKeyOa 平台属性名称->映射OA属性
    dialogForm.value['attrKeyOa'] = `${initTpl.value.name1 || ''}:${
      initTpl.value.mainOa || ''
    };${initTpl.value.name2 || ''}:${initTpl.value.assistOa || ''}`;
    res = await updateOzonPublishDetail(dialogForm.value);
    if (res.code == '0000') {
      ElMessage.success(`保存成功`);
      emit('closeDialog', { isShow: false });
    }
  };

  //  变种参数--删除
  const remove = async (index) => {
    dialogForm.value.skuInfoList.splice(index, 1);
    ElMessage.success(`删除成功`);
  };

  let initTpl = ref({});
  // 选择平台属性
  const choosePlat = (field, val) => {
    if (val == '') {
      if (field == 'name1') {
        initTpl.value.mainOa = '';
      }
      if (field == 'name2') {
        initTpl.value.assistOa = '';
      }
      dialogForm.value.skuInfoList.forEach((item) => {
        item[field] = '';
      });
    }
  };
  // 选择OA属性
  const chooseOA = (field, val) => {
    dialogForm.value.skuInfoList.forEach((i) => {
      i[field] = i[val];
    });
  };
  // 向下更新
  const handleRowData = (val, field) => {
    dialogForm.value.skuInfoList.forEach((item) => {
      item[field] = val;
    });
  };

  // const restaurants = ref([]);
  // const getData = (arr) => {
  //   restaurants.value = [];
  //   arr.forEach((item) => {
  //     restaurants.value.push({ value: item });
  //   });
  // };
  // const querySearch = (queryString, cb) => {
  //   const results = queryString
  //     ? restaurants.value?.filter(createFilter(queryString))
  //     : restaurants.value;
  //   cb(results);
  // };
  // const createFilter = (queryString) => {
  //   return (restaurant) => {
  //     return (
  //       restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  //     );
  //   };
  // };
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
</style>
