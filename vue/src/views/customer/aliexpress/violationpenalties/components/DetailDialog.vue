<template>
  <el-dialog
    :model-value="showDialog"
    width="40%"
    title="编辑信息"
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="dialogFormRef"
      :model="dialogForm"
      size="default"
      status-icon
      :label-width="150"
    >
      <el-form-item label="违规商品" prop="skuType" required>
        <el-radio-group v-model="dialogForm.skuType" @change="getType">
          <el-radio value="prodPSku">商品父SKU</el-radio>
          <el-radio value="prodSSku">商品子SKU</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="skus"
        :label="dialogForm.skuType == 'prodPSku' ? '商品父SKU' : '商品子SKU'"
        required
      >
        <el-select
          v-model="dialogForm.skus"
          style="width: 100%"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          @change="skuSelect"
        >
          <el-option
            v-for="item in init.prodImageMap"
            :key="item.name"
            :label="item.name"
            :value="item.name"
            style="height: 80px"
          >
            <span style="float: right">{{ item.name }}</span>
            <span style="float: left">
              <ImagePop :src="item.val" />
              <!-- <img :src="item.val + '!size=100x100' || ''" /> -->
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="侵权品牌名" prop="violationBrand">
        <el-input v-model="dialogForm.violationBrand" />
      </el-form-item>
      <el-form-item label="侵权图片">
        <div
          v-for="(item, index) in dialogForm.skus"
          :key="index"
          style="margin-right: 20px"
        >
          {{ item }}
          <el-upload
            class="avatar-uploader"
            action="/api/lms/prodImageAliyun/uploadPic.html"
            :data="{ remainDay: 0 }"
            :on-success="(event) => importSuccessMain(event, item)"
            :on-error="importError"
            :show-file-list="false"
          >
            <!-- <img
              v-if="imageMap && imageMap[item]"
              style="width: 100px; height: 100px"
              :src="imageMap[item]"
              class="avatar"
            /> -->
            <ImagePop
              v-if="imageMap && imageMap[item]"
              :src="imageMap[item]"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="是否案件产品" prop="caseProd" required>
        <el-select v-model="dialogForm.caseProd" clearable style="width: 100%">
          <el-option :value="true" label="是" />
          <el-option :value="false" label="否" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dialogForm.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="handleEditDialog()">保存</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ref, toRefs, defineProps, defineEmits, onMounted } from 'vue';
  import {
    getSkuImageMap,
    editViolationInfo // 保存
  } from '@/api/smt/violationpenalties';
  import { ElMessage } from 'element-plus';
  import ImagePop from '@/components/ImagePop/index.vue';
  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: null
    }
  });
  // 当前行数据
  const { rowData } = toRefs(props);
  //  罚分模板弹窗
  const dialogForm = ref({ skuType: 'prodPSku', skus: [] });
  const init = ref({
    prodPSkuImageMap: [],
    prodSSkuImageMap: []
  });
  onMounted(async () => {
    // 获取父子sku数据&图片
    const { code, data } = await getSkuImageMap({
      storeAcctId: rowData.value.storeAcctId,
      itemId: rowData.value.itemId
    });
    if (code == '0000') {
      let prodPSkuImageMap = [],
        prodSSkuImageMap = [];
      for (let i in data.prodPSkuImageMap) {
        prodPSkuImageMap.push({
          name: i,
          val: data.prodPSkuImageMap[i]
        });
      }
      for (let i in data.prodSSkuImageMap) {
        prodSSkuImageMap.push({
          name: i,
          val: data.prodSSkuImageMap[i]
        });
      }
      // sku下拉框数据
      init.value.prodPSkuImageMap = prodPSkuImageMap;
      init.value.prodSSkuImageMap = prodSSkuImageMap;
      init.value.prodImageMap = prodPSkuImageMap;
      // 数据回显
      if (rowData.value.prodPSku && rowData.value.prodPSku != '') {
        dialogForm.value.skuType = 'prodPSku';
        dialogForm.value.skus = rowData.value.prodPSku?.split(',');
        imageMap.value = rowData.value.prodPSkuImageMap;
      } else if (rowData.value.prodSSku && rowData.value.prodSSku != '') {
        dialogForm.value.skuType = 'prodSSku';
        dialogForm.value.skus = rowData.value.prodSSku?.split(',');
        imageMap.value = rowData.value.prodSSkuImageMap;
      }
      dialogForm.value.violationBrand = rowData.value.violationBrand;
      dialogForm.value.caseProd = rowData.value.caseProd || false;
      dialogForm.value.remark = rowData.value.remark;
    }
  });

  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    emit('closeDialog');
  };
  // 本地图片上传
  let imageMap = ref({});
  const importSuccessMain = (res, item) => {
    if (res.code == '0000') {
      imageMap.value[item] = res.msg;
      ElMessage.success('上传成功！');
    } else {
      ElMessage.error(res.msg);
    }
  };
  const importError = () => {
    ElMessage.error('上传失败！');
  };

  const dialogFormRef = ref(null);
  //  罚分保存
  const handleEditDialog = async () => {
    dialogForm.value.prodPSku = '';
    dialogForm.value.prodSSku = '';
    dialogForm.value[dialogForm.value.skuType] = dialogForm.value.skus.join();
    dialogForm.value.prodPSkuImageMap = dialogForm.value.prodSSkuImageMap = {};
    // 过滤sku对应的图片
    for (let i in imageMap.value) {
      if (!dialogForm.value.skus.includes(i)) {
        delete imageMap.value[i];
      }
    }
    dialogForm.value[dialogForm.value.skuType + 'ImageMap'] = imageMap.value;
    const { code } = await editViolationInfo({
      ...dialogForm.value,
      id: rowData.value.id
    });
    if (code == '0000') {
      ElMessage.success(`保存成功`);
      emit('closeDialog', { isSearch: true });
    }
  };

  // 父/子SKU切换
  const getType = (val) => {
    dialogFormRef.value.resetFields();
    dialogForm.value.skuType = val;
    imageMap.value = {};
    if (val == 'prodPSku') {
      init.value.prodImageMap = init.value.prodPSkuImageMap;
    } else if (val == 'prodSSku') {
      init.value.prodImageMap = init.value.prodSSkuImageMap;
    }
  };

  const skuSelect = (e) => {
    e.forEach((item, index) => {
      let arr = [];
      if (item.includes(',')) {
        arr = item.split(',');
        dialogForm.value.skus.splice(index, 1);
        dialogForm.value.skus = dialogForm.value.skus.concat(arr);
      }
    });
  };
</script>
<style scoped lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    color: #8c939d;
    width: 100px;
    height: 100px;
    border: 1px dashed #ccc;
    text-align: center;
  }
</style>
