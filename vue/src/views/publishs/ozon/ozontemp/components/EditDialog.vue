<template>
  <el-dialog
    class="dialog_form"
    :model-value="showDialog"
    width="70%"
    :title="title == 'add' ? '新建ozon模板' : '编辑ozon模板'"
    destroy-on-close
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
      <el-form-item label="商品父SKU">
        <el-input v-model="dialogForm.pSku" readonly />
      </el-form-item>
      <el-form-item label="OA新类目">
        <el-input v-model="dialogForm.cateTreeName" readonly />
      </el-form-item>
      <div style="display: flex">
        <div style="width: 100%">
          <el-form-item label="产品描述">
            <el-input
              v-model="dialogForm.desc"
              :rows="6"
              type="textarea"
              readonly
            />
          </el-form-item>
        </div>
        <div style="width: 100%">
          <el-form-item label="产品简介">
            <el-input
              v-model="dialogForm.description"
              :rows="6"
              type="textarea"
            />
          </el-form-item>
        </div>
      </div>
      <div style="color: #d9001b">
        提示：产品描述为基础模版信息。仅供参考。产品简介为实际上传字段，修改后请将全部内容自行翻译俄语。
      </div>
      <!-- <el-form-item label="固定描述">
        <el-input
          v-model="dialogForm.fixDesc"
          :rows="4"
          type="textarea"
          readonly
        />
      </el-form-item> -->
      <el-divider content-position="left"><h3>ozon类目</h3></el-divider>
      <div class="flexBetween">
        <el-button
          type="primary"
          @click="handleCateDialogOpen('ozon', dialogForm.id)"
          >选择分类</el-button
        >
        <el-input v-model="dialogForm.fullCateName" readonly />
        <div
          v-if="dialogForm.multiSub == false"
          style="color: red; width: 250px"
        >
          (该类目仅支持单属性商品)
        </div>
      </div>
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
            filterable
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
            filterable
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
      <el-divider content-position="left"> <h3>变种属性信息</h3></el-divider>
      <span style="color: #59bbed">提示：仅支持自定义的平台属性映射oa属性</span>

      <div v-if="dialogForm.salePropAttrList" style="display: flex">
        <template v-for="i in [1, 2, 3]" :key="i">
          <el-form-item label="平台属性名称">
            <el-select
              v-model="initTpl['name' + i]"
              clearable
              style="width: 150px"
              @change="choosePlat(`name${i}`, $event)"
            >
              <el-option
                v-for="item in dialogForm.salePropAttrList"
                :key="item.attrId"
                :value="item.attrName"
                :disabled="
                  item.attrName == initTpl.name1 ||
                  item.attrName == initTpl.name2 ||
                  item.attrName == initTpl.name3
                "
                ><span v-if="item.isRequired" style="color: red">*</span
                >{{ item.attrName }}</el-option
              >
            </el-select>
          </el-form-item>
        </template>
      </div>
      <div style="display: flex">
        <!-- 只有可自定义的平台属性才能选择映射OA 属性 -->
        <el-form-item label="映射OA属性">
          <el-select
            v-model="initTpl.mainOa"
            clearable
            style="width: 150px"
            :disabled="
              initTpl.name1 != '商品颜色' &&
              initTpl.name1 != '颜色名称' &&
              (!initTpl.name1 ||
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
                ) == 'select')
            "
            @change="chooseOA('name1', $event)"
          >
            <!-- {ProdColor:'映射表-商品颜色',ColorName:'映射表-颜色名称'} -->
            <el-option
              v-for="item in initTpl.oa1"
              :key="item"
              :value="item"
              :label="
                ['ProdColor', 'ColorName'].includes(item)
                  ? {
                      ProdColor: '映射表-商品颜色',
                      ColorName: '映射表-颜色名称'
                    }[item]
                  : item
              "
              :disabled="item == initTpl.assistOa || item == initTpl.assistOa3"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="映射OA属性">
          <el-select
            v-model="initTpl.assistOa"
            style="width: 150px"
            clearable
            :disabled="
              initTpl.name2 != '商品颜色' &&
              initTpl.name2 != '颜色名称' &&
              (!initTpl.name2 ||
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
                ) == 'select')
            "
            @change="chooseOA('name2', $event)"
          >
            <el-option
              v-for="item in initTpl.oa2"
              :key="item"
              :value="item"
              :label="
                ['ProdColor', 'ColorName'].includes(item)
                  ? {
                      ProdColor: '映射表-商品颜色',
                      ColorName: '映射表-颜色名称'
                    }[item]
                  : item
              "
              :disabled="item == initTpl.mainOa || item == initTpl.assistOa3"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="映射OA属性">
          <el-select
            v-model="initTpl.assistOa3"
            style="width: 150px"
            clearable
            :disabled="
              initTpl.name3 != '商品颜色' &&
              initTpl.name3 != '颜色名称' &&
              (!initTpl.name3 ||
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name3
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name3
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name3
                  )[0]?.type
                ) == 'mSelect' ||
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name3
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name3
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl.name3
                  )[0]?.type
                ) == 'select')
            "
            @change="chooseOA('name3', $event)"
          >
            <el-option
              v-for="item in initTpl.oa3"
              :key="item"
              :value="item"
              :label="
                ['ProdColor', 'ColorName'].includes(item)
                  ? {
                      ProdColor: '映射表-商品颜色',
                      ColorName: '映射表-颜色名称'
                    }[item]
                  : item
              "
              :disabled="item == initTpl.mainOa || item == initTpl.assistOa"
            />
          </el-select>
        </el-form-item>
      </div>
      <div style="display: flex; margin-left: -100px">
        <el-form-item label="批量填写">
          <div v-for="i in [1, 2, 3]" :key="i">
            <el-input
              v-if="
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl['name' + i]
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl['name' + i]
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl['name' + i]
                  )[0]?.type
                ) == 'string' ||
                getInputType(
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl['name' + i]
                  )[0]?.dictionaryId,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl['name' + i]
                  )[0]?.isCollection,
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl['name' + i]
                  )[0]?.type
                ) == 'number'
              "
              v-model="initTpl['batch' + i]"
              :placeholder="initTpl['name' + i] || '无'"
            ></el-input>
            <el-select
              v-else-if="initTpl['name' + i] == '商品颜色'"
              v-model="initTpl['batch' + i]"
              :placeholder="initTpl['name' + i] || '无'"
              filterable
              clearable
              multiple
            >
              <el-option
                v-for="item in dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == '商品颜色'
                )[0]?.values"
                :key="item.value"
                :value="item.value"
                :label="item.value"
              />
            </el-select>
            <el-select
              v-else
              v-model="initTpl['batch' + i]"
              :placeholder="initTpl['name' + i] || '无'"
              filterable
              clearable
            >
              <el-option
                v-for="item in dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl['name' + i]
                )[0]?.values"
                :key="item.value"
                :value="item.value"
                :label="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-button type="primary" @click="apply">应用</el-button>

        <el-form-item label="商品SKU">
          <el-input
            v-model="initTpl.addSku"
            placeholder="支持父、子SKU同时添加"
          />
        </el-form-item>
        <el-button type="primary" @click="add">新增变种</el-button>
      </div>
    </el-form>
    <el-table ref="dialogChildFormRef" border :data="dialogForm.skuInfoList">
      <el-table-column type="selection" width="55" />
      <el-table-column property="tempSku" width="100" label="图片">
        <template #default="scope">
          <!-- {{ scope.row?.varientImgs }} -->
          <ImagePop
            v-if="scope.row?.varientImgs && scope.row?.varientImgs[0]"
            :src="scope.row?.varientImgs[0].name || ''"
          />
        </template>
      </el-table-column>
      <el-table-column property="tempSku" label="子SKU" />
      <el-table-column label="系统属性">
        <template #default="scope">
          color：{{ scope.row.color }}<br />
          size：{{ scope.row.size }}<br />
          style：{{ scope.row.style }}
        </template>
      </el-table-column>
      <template v-for="i in [1, 2, 3]" :key="i">
        <el-table-column v-if="initTpl['name' + i]">
          <template #header
            ><span
              v-if="
                dialogForm.salePropAttrList?.filter(
                  (x) => x.attrName == initTpl['name' + i]
                )[0]?.isRequired
              "
              style="color: red"
              >*</span
            >{{ initTpl['name' + i] }}
          </template>
          <template #default="scope">
            <div style="display: flex; align-items: baseline">
              <el-input
                v-if="
                  getInputType(
                    dialogForm.salePropAttrList?.filter(
                      (x) => x.attrName == initTpl['name' + i]
                    )[0]?.dictionaryId,
                    dialogForm.salePropAttrList?.filter(
                      (x) => x.attrName == initTpl['name' + i]
                    )[0]?.isCollection,
                    dialogForm.salePropAttrList?.filter(
                      (x) => x.attrName == initTpl['name' + i]
                    )[0]?.type
                  ) == 'string' ||
                  getInputType(
                    dialogForm.salePropAttrList?.filter(
                      (x) => x.attrName == initTpl['name' + i]
                    )[0]?.dictionaryId,
                    dialogForm.salePropAttrList?.filter(
                      (x) => x.attrName == initTpl['name' + i]
                    )[0]?.isCollection,
                    dialogForm.salePropAttrList?.filter(
                      (x) => x.attrName == initTpl['name' + i]
                    )[0]?.type
                  ) == 'number'
                "
                v-model="scope.row['name' + i]"
              ></el-input>
              <el-select
                v-else-if="initTpl['name' + i] == '商品颜色'"
                v-model="scope.row['name' + i]"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == '商品颜色'
                  )[0]?.values"
                  :key="item.value"
                  :value="item.value"
                  :label="item.value"
                />
              </el-select>
              <!-- scope.row[
                  dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl['name' + i]
                  )[0]?.attrName
                ] -->
              <el-select
                v-else
                v-model="scope.row['name' + i]"
                filterable
                clearable
              >
                <el-option
                  v-for="item in dialogForm.salePropAttrList?.filter(
                    (x) => x.attrName == initTpl['name' + i]
                  )[0]?.values"
                  :key="item.value"
                  :value="item.value"
                  :label="item.value"
                />
              </el-select>
            </div>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm
            title="确定删除这行数据?"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="remove(scope.$index, scope.row)"
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
      <el-button type="primary" @click="handleEditDialog()">保存</el-button>
    </template>
  </el-dialog>

  <!-- 类目组件 -->
  <CateDialog
    v-if="showCateDialog"
    :show-dialog="showCateDialog"
    :handle-cate-dialog-type="handleCateDialogType"
    :prod-p-id="prodPId"
    @close-dialog="handleCateDialogClose($event)"
  />
</template>
<script setup>
  import { ref, onMounted, toRefs, defineProps, defineEmits } from 'vue';
  import {
    addOzonModel,
    editOzonModel,
    getAddVariation,
    queryForCreateOzon
  } from '@/api/publishs/ozontemp';
  import CateDialog from '@/components/CateDialog.vue';
  import { ElMessage } from 'element-plus';
  import ImagePop from '@/components/ImagePop/index.vue';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: ''
    }
  });
  const { title, formData } = toRefs(props);

  const dialogForm = ref({});
  // let _formData = {};
  // 类目属性展开折叠
  const hideOrShow = ref(false);
  onMounted(() => {
    dialogForm.value = formData.value;
    // _formData = formData.value.attrInfo
    //   ? JSON.parse(JSON.stringify(formData.value.attrInfo))
    //   : '';

    dialogForm.value['desc'] =
      dialogForm.value.prodDesc + '\r\n\r\n' + dialogForm.value.fixDesc;
    // if (!dialogForm.value.id) {
    //   // 新增模板，存在自动映射
    //   autoMap();
    // } else {
    // 编辑模板
    attrKeyOaFunc();
    handelData();
    // }
    // console.log(dialogForm.value);
  });
  // // 处理自动映射的数据,只有新建的时候有自动映射的数据？
  // function autoMap() {
  //   dialogForm.value.skuInfoList?.forEach((item) => {
  //     // 如果存在拼接的映射OA属性，则不展示，现在只显示color，size，style，如果有color-size这种是不展示的
  //     item.oaAttrName3 && !item.oaAttrName3.includes('-')
  //       ? (item[item.oaAttrName3?.split(':')[0]] =
  //           item.oaAttrName3?.split(':')[1])
  //       : '';
  //     // 商品颜色和颜色名称特殊处理
  //     item.prodColor
  //       ? (item[item.prodColor?.split(':')[0]] = [
  //           item.prodColor?.split(':')[1]
  //         ])
  //       : [];
  //     item.colorName
  //       ? (item[item.colorName?.split(':')[0]] = item.colorName?.split(':')[1])
  //       : '';
  //     // 前端存一下数据
  //     initTpl.value['prodColor'] = item.prodColor; // 商品颜色的映射OA属性
  //     initTpl.value['colorName'] = item.colorName; // 颜色名称的映射OA属性
  //     // 表格动态列选中的值
  //     let A = item.salePropAttrList?.map((i) => i.attrName) || [];
  //     item.salePropAttrList &&
  //       item.salePropAttrList?.forEach((i) => {
  //         // 表格动态列赋值
  //         if (i.attrName == '商品颜色') {
  //           item['name' + (A.indexOf(i.attrName) + 1)] = i.value?.split(';');
  //         } else if (i.value && A.indexOf(i.attrName) >= 0) {
  //           item['name' + (A.indexOf(i.attrName) + 1)] = i.value;
  //         }
  //       });
  //     // 平台属性名称映射，不需要回显映射OA属性的值
  //     let attrKeyOa = '';
  //     A?.forEach((i) => {
  //       i ? (attrKeyOa += i + ':;') : '';
  //     });
  //     // 取数组最后一项就行
  //     dialogForm.value['attrKeyOa'] = attrKeyOa;
  //   });
  //
  //   //  `${initTpl.value.name1}:${initTpl.value.mainOa};${initTpl.value.name2}:${initTpl.value.assistOa};${initTpl.value.name3}:${initTpl.value.assistOa3}`;
  //   initTpl.value['name1'] = dialogForm.value['attrKeyOa']
  //     ?.split(';')[0]
  //     ?.split(':')[0];
  //   initTpl.value['name2'] = dialogForm.value['attrKeyOa']
  //     ?.split(';')[1]
  //     ?.split(':')[0];
  //   initTpl.value['name3'] = dialogForm.value['attrKeyOa']
  //     ?.split(';')[2]
  //     ?.split(':')[0];
  //   // 获取映射oa属性的下拉值
  //   let A = [1, 2, 3];
  //   initTpl.value.oa = [];
  //   initTpl.value.oa1 = [];
  //   initTpl.value.oa2 = [];
  //   initTpl.value.oa3 = [];
  //   A.forEach((a) => {
  //     if (
  //       dialogForm.value.skuInfoList?.length != 0 &&
  //       dialogForm.value.skuInfoList[0]['oaAttrName' + a]
  //     ) {
  //       let val =
  //         dialogForm.value.skuInfoList[0]['oaAttrName' + a]?.split(':')[0];
  //       initTpl.value.oa1.push(val);
  //       initTpl.value.oa2.push(val);
  //       initTpl.value.oa3.push(val);
  //       initTpl.value.oa.push(val);
  //     }
  //   });
  //   let B = [
  //     '',
  //     initTpl.value['name1'],
  //     initTpl.value['name2'],
  //     initTpl.value['name3']
  //   ];
  //   // 商品颜色和颜色名称的映射OA属性的下拉特殊处理
  //   B.forEach((i) => {
  //     if (i == '商品颜色') {
  //       initTpl.value[`oa${B.indexOf('商品颜色')}`] = [
  //         initTpl.value['prodColor']?.split(':')[0]
  //       ];
  //     } else if (i == '颜色名称') {
  //       initTpl.value[`oa${B.indexOf('颜色名称')}`] = [
  //         initTpl.value['colorName']?.split(':')[0]
  //       ];
  //     }
  //   });
  // }

  // 赋值，平台属性名称和映射OA属性
  function attrKeyOaFunc() {
    //  `${initTpl.value.name1}:${initTpl.value.mainOa};${initTpl.value.name2}:${initTpl.value.assistOa};${initTpl.value.name3}:${initTpl.value.assistOa3}`;
    initTpl.value['name1'] = dialogForm.value['attrKeyOa']
      ?.split(';')[0]
      ?.split(':')[0];
    initTpl.value['name2'] = dialogForm.value['attrKeyOa']
      ?.split(';')[1]
      ?.split(':')[0];
    initTpl.value['name3'] = dialogForm.value['attrKeyOa']
      ?.split(';')[2]
      ?.split(':')[0];
    initTpl.value['mainOa'] = dialogForm.value['attrKeyOa']
      ?.split(';')[0]
      ?.split(':')[1];
    initTpl.value['assistOa'] = dialogForm.value['attrKeyOa']
      ?.split(';')[1]
      ?.split(':')[1];
    initTpl.value['assistOa3'] = dialogForm.value['attrKeyOa']
      ?.split(';')[2]
      ?.split(':')[1];
  }

  function handelData() {
    // 平台属性名称默认选中必选项
    let isReq =
      dialogForm.value.salePropAttrList.filter(
        (item) => item.isRequired == true
      ) || [];
    let oaA = ['mainOa', 'assistOa', 'assistOa3'];
    isReq.forEach((item, index) => {
      // 平台属性名称的值
      initTpl.value['name' + (index * 1 + 1)] = item.attrName;
      // oa映射选中的值
      if (item.attrName == '商品颜色') {
        initTpl.value[oaA[index]] = 'ProdColor';
        chooseOA(oaA[index], 'ProdColor');
      } else if (item.attrName == '颜色名称') {
        initTpl.value[oaA[index]] = 'ColorName';
        chooseOA(oaA[index], 'ColorName');
      }
    });
    // 获取oaAttrName4/oaAttrName5/oaAttrName6/oaAttrName7，为了后面自动映射，仅前端用
    dialogForm.value.skuInfoList?.forEach((item) => {
      item.oaAttrName3 && !item.oaAttrName3.includes('-')
        ? (item[item.oaAttrName3?.split(':')[0]] =
            item.oaAttrName3?.split(':')[1])
        : '';
      item.prodColor
        ? (item[item.prodColor?.split(':')[0]] = item.prodColor?.split(':')[1]
            ? item.prodColor?.split(':')[1]?.split(';')
            : [])
        : '';
      item.colorName
        ? (item[item.colorName?.split(':')[0]] = item.colorName?.split(':')[1])
        : '';

      initTpl.value['prodColor'] = item.prodColor; // 商品颜色的映射OA属性
      initTpl.value['colorName'] = item.colorName; // 颜色名称的映射OA属性
      // 表格动态列选中的值
      let selected = {};
      item.skuAttrList &&
        item.skuAttrList.forEach((i) => {
          selected[i.attrId] = i.value;
        });
      let A = [
        '',
        initTpl.value.name1,
        initTpl.value.name2,
        initTpl.value.name3
      ];
      item.salePropAttrList &&
        item.salePropAttrList.forEach((i) => {
          // 存在自动映射的值
          if (i.attrName == '商品颜色') {
            item['name' + A.indexOf(i.attrName)] = i.value
              ? i.value.split(';')
              : [];
          } else {
            item['name' + A.indexOf(i.attrName)] = i.value;
          }
          // 选择类目后回显的值
          if (selected[i.attrId] && i.attrName == '商品颜色') {
            item['name' + A.indexOf(i.attrName)] =
              selected[i.attrId]?.split(';');
            // || i.value?.split(';')
          } else if (selected[i.attrId] && A.indexOf(i.attrName) >= 0) {
            item['name' + A.indexOf(i.attrName)] = selected[i.attrId];
            // || i.value
          }
        });
    });

    // 获取映射oa属性
    let A = [1, 2, 3];
    initTpl.value.oa = [];
    initTpl.value.oa1 = [];
    initTpl.value.oa2 = [];
    initTpl.value.oa3 = [];
    A.forEach((a) => {
      if (
        dialogForm.value.skuInfoList?.length != 0 &&
        dialogForm.value.skuInfoList[0]['oaAttrName' + a]
      ) {
        let val =
          dialogForm.value.skuInfoList[0]['oaAttrName' + a]?.split(':')[0];
        initTpl.value.oa1.push(val);
        initTpl.value.oa2.push(val);
        initTpl.value.oa3.push(val);
        initTpl.value.oa.push(val);
      }
    });
    let B = [
      '',
      initTpl.value['name1'],
      initTpl.value['name2'],
      initTpl.value['name3']
    ];

    B.forEach((i) => {
      if (i == '商品颜色') {
        initTpl.value[`oa${B.indexOf('商品颜色')}`] = [
          initTpl.value['prodColor']?.split(':')[0]
        ];
      } else if (i == '颜色名称') {
        initTpl.value[`oa${B.indexOf('颜色名称')}`] = [
          initTpl.value['colorName']?.split(':')[0]
        ];
      }
    });
  }

  const dialogChildFormRef = ref();

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

  // 类目组件 start
  const showCateDialog = ref(false);
  const prodPId = ref();
  const handleCateDialogType = ref('');
  const handleCateDialogClose = async (e) => {
    if (!e.cate) {
      showCateDialog.value = e.isShow;
      return;
    }
    showCateDialog.value = e.isShow;
    for (let key in initTpl.value) {
      initTpl.value[key] = '';
    }
    // //  如果选中的类目，就是平台映射的类目，则不需要调用接口，直接用已返回的数据映射
    // if (e.cate.value.categoryId == _formData.categoryId) {
    //   dialogForm.value.fullCateName = e.cate.value.fullCateName; // ozon类目
    //   dialogForm.value.categoryId = e.cate.value.categoryId;
    //   dialogForm.value['normalAttrList'] = _formData.normalAttrList;
    //   dialogForm.value['salePropAttrList'] = _formData.salePropAttrList;
    //   dialogForm.value['skuInfoList'] = _formData.skuInfoList;
    //   autoMap();
    //   // handelData();
    // } else {
    dialogForm.value.fullCateName = e.cate.value.fullCateName; // ozon类目
    dialogForm.value.categoryId = e.cate.value.categoryId;
    let { code, data } = await queryForCreateOzon({
      prodPId: formData.value.prodPId,
      categoryId: e.cate.value.categoryId
    });
    if (code == '0000') {
      dialogForm.value['normalAttrList'] = data.normalAttrList;
      dialogForm.value['salePropAttrList'] = data.salePropAttrList;
      dialogForm.value['skuInfoList'] = data.skuInfoList;
      handelData();
      // }
    }
  };
  const handleCateDialogOpen = (type, id) => {
    handleCateDialogType.value = type;
    prodPId.value = id;
    showCateDialog.value = true;
  };
  // 类目组件 end

  //   ozon模板弹窗
  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    emit('closeDialog', { isShow: false });
  };

  const dialogFormRef = ref(null);

  //  新建&编辑ozon模板--保存
  const handleEditDialog = async () => {
    if (dialogForm.value.categoryId == '') {
      ElMessage.warning('请选择类目');
      return;
    }
    if (
      !dialogForm.value.normalAttrList ||
      dialogForm.value.normalAttrList.length == 0
    ) {
      ElMessage.warning('请选择类目属性');
      return;
    }
    if (
      !dialogForm.value.skuInfoList ||
      dialogForm.value.skuInfoList.length == 0
    ) {
      ElMessage.warning('请选择变种信息');
      return;
    }
    // sku变种校验
    let salePropAttrListName = {},
      isRequireName = [];
    dialogForm.value.salePropAttrList?.forEach((item) => {
      salePropAttrListName[item.attrName] = item.attrId;
      if (item.isRequired) {
        isRequireName.push(item.attrName);
      }
    });

    // 平台属性名称必选项是否都选中；
    let A = [
      initTpl.value.name1,
      initTpl.value.name2,
      initTpl.value.name3
    ].filter((item) => !!item);
    let B = isRequireName.filter((item) => !A.includes(item));
    if (B.length > 0) {
      ElMessage.warning('平台属性名称存在必选项没选');
      return;
    }
    // 校验必填项
    for (let i = 0, item = dialogForm.value.skuInfoList; i < item.length; i++) {
      item[i].salePropAttrList = deepCopy(dialogForm.value.salePropAttrList);
      let addTd = [
        '',
        initTpl.value.name1,
        initTpl.value.name2,
        initTpl.value.name3
      ];
      try {
        item[i].salePropAttrList.forEach((x) => {
          let currentIndex = addTd.indexOf(x.attrName);
          if (currentIndex != -1) {
            if (
              x.isRequired &&
              (!item[i]['name' + currentIndex] ||
                item[i]['name' + currentIndex].length == 0)
            ) {
              ElMessage.warning(`${x.attrName}为必填项，请输入对应的值`);
              throw Error();
            }
            if (
              item[i]['name' + currentIndex] &&
              Array.isArray(item[i]['name' + currentIndex])
            ) {
              x['value'] = item[i]['name' + currentIndex].join(';');
            } else {
              x['value'] = item[i]['name' + currentIndex];
            }
          }
        });
      } catch (e) {
        return false;
      }
    }
    if (
      dialogForm.value.normalAttrList &&
      dialogForm.value.normalAttrList.length != 0
    ) {
      for (let i = 0; i < dialogForm.value.normalAttrList.length; i++) {
        if (
          dialogForm.value.normalAttrList[i].isRequired &&
          !dialogForm.value.normalAttrList[i].value
        ) {
          ElMessage.warning('类目属性不能为空');
          return false;
        }
        // 多选转换为逗号拼接
        if (
          dialogForm.value.normalAttrList[i].value &&
          Array.isArray(dialogForm.value.normalAttrList[i].value)
        ) {
          dialogForm.value.normalAttrList[i].value =
            dialogForm.value.normalAttrList[i].value.join(';');
        }
      }
    }
    // attrKeyOa 平台属性名称->映射OA属性
    dialogForm.value['attrKeyOa'] = `${initTpl.value.name1 || ''}:${
      initTpl.value.mainOa || ''
    };${initTpl.value.name2 || ''}:${initTpl.value.assistOa || ''};${
      initTpl.value.name3 || ''
    }:${initTpl.value.assistOa3 || ''}`;
    let res;
    if (title.value == 'add') {
      // 新增保存
      res = await addOzonModel(dialogForm.value);
    } else {
      dialogForm.value.pId = dialogForm.value.id;
      // 编辑保存
      res = await editOzonModel(dialogForm.value);
    }
    if (res.code == '0000') {
      emit('closeDialog', { isShow: false });
      ElMessage.success('保存成功');
    }
  };

  //  变种参数--删除
  const remove = async (index) => {
    dialogForm.value.skuInfoList.splice(index, 1);
    ElMessage.success('删除成功');
  };

  let initTpl = ref({});
  // 选择平台属性
  const choosePlat = (field, val) => {
    dialogForm.value.skuInfoList.forEach((item) => {
      item[field] = '';
    });
    // if (val == '') {
    if (field == 'name1') {
      initTpl.value.mainOa = '';
    }
    if (field == 'name2') {
      initTpl.value.assistOa = '';
    }
    if (field == 'name3') {
      initTpl.value.assistOa3 = '';
    }
    // } else {
    // 切换平台属性名称，映射oa属性置空，表格数据置空
    let A = ['', 'name1', 'name2', 'name3'];
    let oaA = ['', 'mainOa', 'assistOa', 'assistOa3'];
    if (val == '商品颜色') {
      //映射OA属性下拉
      initTpl.value[`oa${A.indexOf(field)}`] = [
        initTpl.value['prodColor']?.split(':')[0]
      ];
      //映射OA属性选中值
      initTpl.value[oaA[A.indexOf(field)]] =
        initTpl.value['prodColor']?.split(':')[0];
      chooseOA(field, initTpl.value['prodColor']?.split(':')[0]);
    } else if (val == '颜色名称') {
      initTpl.value[`oa${A.indexOf(field)}`] = [
        initTpl.value['colorName']?.split(':')[0]
      ];
      initTpl.value[oaA[A.indexOf(field)]] =
        initTpl.value['colorName']?.split(':')[0];
      chooseOA(field, initTpl.value['colorName']?.split(':')[0]);
    } else {
      initTpl.value[`oa${A.indexOf(field)}`] = initTpl.value['oa'];
    }
    // }
  };
  // 选择OA属性
  const chooseOA = (field, val) => {
    dialogForm.value.skuInfoList.forEach((i) => {
      i[field] = i[val];
    });
  };
  // // 向下更新
  // const handleRowData = (val, field) => {
  //   dialogForm.value.skuInfoList.forEach((item) => {
  //     item[field] = val;
  //   });
  // };
  // 一键应用
  const apply = () => {
    let selectData = dialogChildFormRef.value.getSelectionRows();
    if (selectData.length == 0) {
      ElMessage.warning('请选择sku');
      return;
    }
    selectData.forEach((item) => {
      initTpl.value.batch1 && initTpl.value.batch1.length != 0
        ? (item.name1 = initTpl.value.batch1)
        : '';
      initTpl.value.batch2 && initTpl.value.batch2.length != 0
        ? (item.name2 = initTpl.value.batch2)
        : '';
      initTpl.value.batch3 && initTpl.value.batch3.length != 0
        ? (item.name3 = initTpl.value.batch3)
        : '';
    });
  };
  // 新增变种
  const add = async () => {
    let sSkuList = dialogForm.value.skuInfoList.map((item) => item.tempSku);
    let { data } = await getAddVariation({
      sSkuList: sSkuList.join(),
      toAddSkuList: initTpl.value.addSku,
      categoryId: dialogForm.value.categoryId
    });
    if (data && data.length != 0) {
      dialogForm.value.skuInfoList = dialogForm.value.skuInfoList.concat(data);
    }
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
</script>
<style scoped lang="scss">
  h3 {
    margin: 0;
  }
  .ml-2 {
    margin-left: 2px;
  }

  .flexBetween {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
