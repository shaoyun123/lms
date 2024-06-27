<template>
  <div>
    <el-divider content-position="left" class="title"
      ><span v-if="proofOfStock" class="red_star">*</span>
      <h3>库存证明</h3>
      <el-text class="title_notice" type="info"
        >一个主规格商品最多可上传2张库存证明文件，支持图片（JPG/JPEG/PNG）/PDF文件</el-text
      ></el-divider
    >
    <el-table :data="sheinPublishSkuDtos" border size="small">
      <el-table-column prop="main" :label="mainName" width="180">
        <template #default="{ row }">
          <div>
            <span v-if="proofOfStock" class="red_star">*</span
            >{{ getMainAttributeName(row.main) }}
          </div></template
        >
      </el-table-column>
      <el-table-column prop="_proofOfStockList" label="库存证明">
        <template #default="{ row }">
          <el-upload
            v-model:file-list="row._proofOfStockList"
            action=""
            :limit="2"
            accept=".png,.jpg,.jpeg,.pdf"
            list-type="picture-card"
            :class="row._proofOfStockList?.length > 1 ? 'hide_upload_icon' : ''"
            :on-preview="handlePictureCardPreview"
            :http-request="(file) => handleRequest(file, row)"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { Plus } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';
  import axios from 'axios';
  const props = defineProps({
    sheinPublishSkuDtos: {
      type: Array,
      default: () => []
    },
    proofOfStock: {
      type: Boolean,
      default: false
    },
    mainArr: {
      type: Array,
      default: () => []
    },
    sheinSaleAttrsInfoDto: {
      type: Object,
      default: () => ({})
    }
  });

  const mainName = computed(() => {
    if (props.sheinSaleAttrsInfoDto.mainAttributeId) {
      return props.sheinSaleAttrsInfoDto.mainAttributeName;
    }
    return '';
  });

  const getMainAttributeName = (mainId) => {
    let name = mainId;
    if (typeof mainId === 'number') {
      name =
        (props.mainArr || []).filter(
          (item) => item.attributeValueId === mainId
        )[0]?.attributeValue || '';
    }
    return name;
  };
  // 预览
  const dialogImageUrl = ref('');
  const dialogVisible = ref(false);
  const handlePictureCardPreview = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url;
    dialogVisible.value = true;
  };

  // 上传
  const handleRequest = (val, row) => {
    let formData = new FormData();
    formData.append('file', val.file);
    axios.post('/api/lms/prodTpl/uploadPic2.html', formData).then((res) => {
      if (res.data?.code === '0000') {
        row._proofOfStockList[row._proofOfStockList?.length - 1].rightUrl =
          res.data?.msg;
      } else {
        ElMessage.error(res.data.msg || '上传失败');
      }
    });
  };
</script>

<style lang="scss" scoped>
  :deep(.el-divider__text) {
    display: flex;
    .title_notice {
      margin-left: 20px;
    }
  }
  .red_star {
    margin-right: 4px;
    color: #f56c6c;
  }
  :deep(.el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
  :deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 100px;
  }
  .hide_upload_icon {
    :deep(.el-upload--picture-card) {
      display: none;
    }
  }
</style>
