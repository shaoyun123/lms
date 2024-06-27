<template>
  <el-dialog
    :model-value="showDialog"
    width="70%"
    :title="title == 'add' ? '新建美客多模板' : '编辑美客多模板'"
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
      <el-form-item label="产品描述">
        <el-input v-model="dialogForm.prodDesc" :rows="4" type="textarea" />
      </el-form-item>
      <el-form-item label="固定描述">
        <el-input v-model="dialogForm.fixDesc" :rows="4" type="textarea" />
      </el-form-item>
      <el-divider content-position="left"><h3>美客多类目</h3></el-divider>
      <div class="flexBetween">
        <el-button
          type="primary"
          @click="handleCateDialogOpen('mercado', dialogForm.id)"
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
      <el-form-item
        v-for="item in dialogForm.normalAttrList"
        :key="item.id"
        :class="[item.required && !item.defaultValue ? 'is-error' : '']"
        :label="item.name"
        :required="item.required"
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
        <el-select v-model="dialogForm.WARRANTY_TYPE" style="width: 300px">
          <!-- 默认值Seller warranty -->
          <!-- 选择No warranty，则不展示Warranty time字段 -->
          <el-option value="2230280" label="Seller warranty" />
          <el-option value="6150835" label="No warranty" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="dialogForm.WARRANTY_TYPE == '2230280'"
        label="Warranty time"
        required
        style="display: flex"
        :class="[dialogForm.warrantyTimeVal == '' ? 'is-error' : '']"
      >
        <!-- 默认值30 -->
        <el-input
          v-model.trim="dialogForm.warrantyTimeVal"
          style="width: 100px"
        />
        <!-- 默认值days -->
        <el-select v-model.trim="dialogForm.warrantyTime" style="width: 200px">
          <el-option value="days" label="days" />
          <el-option value="months" label="months" />
          <el-option value="years" label="years" />
        </el-select>
      </el-form-item>
      <el-divider content-position="left"> <h3>变种参数</h3></el-divider>
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
    <div style="display: flex">
      <el-popconfirm
        title="确定删除选中数据?"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="batchDel"
      >
        <template #reference>
          <el-button type="danger">批量删除变种</el-button>
        </template>
      </el-popconfirm>
      <el-form-item label="变种参数名" class="ml-2">
        <el-input v-model="lazadaNameReplaceData" />
      </el-form-item>
      <el-form-item label="一键替换为" class="ml-2">
        <el-input v-model="lazadaNameReplaceNewData" />
      </el-form-item>
      <el-button type="primary" class="ml-2" @click="lazadaNameReplace"
        >替换</el-button
      >
    </div>

    <el-table ref="dialogChildFormRef" :data="dialogForm.skuInfoList">
      <el-table-column type="selection" width="55" />
      <el-table-column property="tempSku" label="子SKU" />
      <el-table-column label="系统属性">
        <template #default="scope">
          颜色：{{ scope.row.color }}<br />
          尺寸：{{ scope.row.size }}<br />
          款式：{{ scope.row.style }}
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template #header>
          <div style="display: flex; justify-content: space-around">
            <div>
              <span v-if="dialogForm.must == true" style="color: red">
                (必填)
              </span>
              变种参数
            </div>
            <el-button type="primary" @click="pushSalePropAttrList"
              >新增变种属性</el-button
            >
          </div>
        </template>
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
</template>
<script setup>
  import { ref, reactive, toRefs, defineProps, watch, defineEmits } from 'vue';
  import {
    addMercadoModel,
    editMercadoModel
  } from '@/api/publishs/mercadotemp';
  import { ElMessage } from 'element-plus';

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

  let lazadaNameReplaceData = ref();
  let lazadaNameReplaceNewData = ref();
  const lazadaNameReplace = () => {
    dialogForm.skuInfoList.forEach((item) => {
      item.salePropAttrList.forEach((cItem) => {
        if (
          cItem.name != undefined &&
          lazadaNameReplaceData.value != undefined &&
          cItem.name.toLowerCase() == lazadaNameReplaceData.value.toLowerCase()
        ) {
          cItem.name = lazadaNameReplaceNewData.value;
        } else if (
          (cItem.name == undefined || cItem.name == '') &&
          (lazadaNameReplaceData.value == undefined ||
            lazadaNameReplaceData.value == '')
        ) {
          cItem.name = lazadaNameReplaceNewData.value;
        }
      });
    });
    ElMessage.success('替换成功');
  };

  // 批量删除变种
  const dialogChildFormRef = ref();
  const batchDel = () => {
    if (dialogChildFormRef.value.getSelectionRows().length == 0) {
      ElMessage.warning('请选择需要删除的数据');
      return;
    }
    let selectedDataProdTempId = dialogChildFormRef.value
      .getSelectionRows()
      .map((item) => item.prodTempId);
    dialogForm.skuInfoList = JSON.parse(
      JSON.stringify(
        dialogForm.skuInfoList.filter(
          (item) => !selectedDataProdTempId.includes(item.prodTempId)
        )
      )
    );
    ElMessage.success('删除成功');
  };

  //   美客多模板弹窗
  const dialogForm = reactive({
    id: '',
    pSku: '',
    cateTreeName: '',
    categoryId: '',
    prodDesc: '',
    fixDesc: '',
    warrantyTimeVal: '30',
    warrantyTime: 'days',
    WARRANTY_TIME: '',
    WARRANTY_TYPE: '2230280',
    multiSub: '',
    must: '',
    fullCateName: '',
    normalAttrList: [],
    salePropAttrList: [],
    skuInfoList: [],
    salesSite: 'CBT'
  });

  const {
    id,
    pSku,
    cateTreeName,
    categoryId,
    prodDesc,
    fixDesc,
    warrantyTimeVal,
    warrantyTime,
    WARRANTY_TIME,
    WARRANTY_TYPE,
    multiSub,
    must,
    fullCateName,
    normalAttrList,
    salePropAttrList,
    skuInfoList
  } = toRefs(dialogForm);

  formData.value &&
    ((id.value = formData.value.id),
    (pSku.value = formData.value.pSku),
    (cateTreeName.value = formData.value.cateTreeName),
    (categoryId.value = formData.value.categoryId),
    (prodDesc.value = formData.value.prodDesc),
    (fixDesc.value = formData.value.fixDesc),
    (warrantyTimeVal.value = formData.value.warrantyTimeVal),
    (warrantyTime.value = formData.value.warrantyTime),
    (WARRANTY_TIME.value = formData.value.WARRANTY_TIME),
    (WARRANTY_TYPE.value = formData.value.WARRANTY_TYPE),
    (multiSub.value = formData.value.multiSub),
    (must.value = formData.value.must),
    (fullCateName.value = formData.value.fullCateName),
    (normalAttrList.value = formData.value.normalAttrList),
    (salePropAttrList.value = formData.value.salePropAttrList),
    (skuInfoList.value = formData.value.skuInfoList));

  watch(
    () => formData,
    () => {
      multiSub.value = formData.value.multiSub;
      must.value = formData.value.must;
      fullCateName.value = formData.value.fullCateName;
      categoryId.value = formData.value.categoryId;
      normalAttrList.value = formData.value.normalAttrList;
      salePropAttrList.value = formData.value.salePropAttrList;
      skuInfoList.value = formData.value.skuInfoList;
    },
    {
      deep: true // 深度监听的参数
    }
  );

  const emit = defineEmits(['closeDialog', 'handleCateDialogOpen']);
  const closeDialog = () => {
    emit('closeDialog', { isShow: false });
  };

  const handleCateDialogOpen = () => {
    emit('handleCateDialogOpen');
  };

  const dialogFormRef = ref(null);

  //  新建&编辑美客多模板--保存
  const handleEditDialog = async () => {
    if (dialogForm.categoryId == '') {
      ElMessage.warning('请选择类目');
      return;
    }
    if (dialogForm.normalAttrList && dialogForm.normalAttrList.length != 0) {
      for (let i = 0; i < dialogForm.normalAttrList.length; i++) {
        if (
          dialogForm.normalAttrList[i].required &&
          !dialogForm.normalAttrList[i].defaultValue
        ) {
          ElMessage.warning('类目属性不能为空');
          return false;
        }
      }
    }
    if (
      dialogForm.WARRANTY_TYPE == '' ||
      (dialogForm.WARRANTY_TYPE == '2230280' &&
        (dialogForm.warrantyTimeVal == '' || dialogForm.warrantyTime == ''))
    ) {
      ElMessage.warning('请填写保修信息');
      return;
    }
    if (dialogForm.WARRANTY_TYPE == '6150835') {
      dialogForm.warrantyTimeVal = '';
      dialogForm.warrantyTime = '';
    }
    dialogForm.normalAttrList.forEach((item) => {
      if (item.id) item.value = item.defaultValue || '';
    });
    if (
      dialogForm.normalAttrList &&
      dialogForm.normalAttrList.length != 0 &&
      dialogForm.normalAttrList[dialogForm.normalAttrList.length - 1].id
    ) {
      dialogForm.normalAttrList.push({
        attrId: 'WARRANTY_TYPE',
        value: dialogForm.WARRANTY_TYPE
      });
      dialogForm.normalAttrList.push({
        attrId: 'WARRANTY_TIME',
        value: dialogForm.warrantyTimeVal + ' ' + dialogForm.warrantyTime
      });
    } else if (
      !dialogForm.normalAttrList ||
      dialogForm.normalAttrList.length == 0
    ) {
      dialogForm.normalAttrList = [
        {
          attrId: 'WARRANTY_TYPE',
          value: dialogForm.WARRANTY_TYPE
        },
        {
          attrId: 'WARRANTY_TIME',
          value: dialogForm.warrantyTimeVal + ' ' + dialogForm.warrantyTime
        }
      ];
    }

    let res;
    if (title.value == 'add') {
      dialogForm.prodPId = dialogForm.id;
      // 新增保存
      res = await addMercadoModel(dialogForm);
    } else {
      dialogForm.pId = dialogForm.id;
      // 编辑保存
      res = await editMercadoModel(dialogForm);
    }
    if (res.code == '0000') {
      ElMessage.success('保存成功');
      emit('closeDialog', { isShow: false });
    }
  };

  //  变种参数--删除
  const remove = async (index) => {
    dialogForm.skuInfoList.splice(index, 1);
    ElMessage.success('删除成功');
  };

  // 新增变种属性
  const pushSalePropAttrList = () => {
    dialogForm.skuInfoList.forEach((item) => {
      if (item.salePropAttrList) {
        item.salePropAttrList.push({
          attrId: '',
          name: '',
          value: ''
        });
      } else {
        item.salePropAttrList = [
          {
            attrId: '',
            name: '',
            value: ''
          }
        ];
      }
    });
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
