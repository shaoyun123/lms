<template>
  <!-- 上传登录背景图片或者视频 -->
  <div class="app-container">
    <el-card
      class="app-container common_split_bottom"
      style="padding: 20px; min-height: 700px"
    >
      <div class="file_tip">
        <div class="d_flex">
          <el-icon size="16" color="orange" style="margin-right: 10px"
            ><Warning
          /></el-icon>
          登录背景图片需命名为
          <span
            class="file_name"
            :class="{
              nameGreen: isCurrentImgName
            }"
          >
            loginBack2024.jpg</span
          >，视频需命名为
          <span
            class="file_name"
            :class="{
              nameGreen: isCurrentVideoName
            }"
          >
            loginBack2024.mp4</span
          >
        </div>
        <div v-if="currentName" class="img_name">
          当前文件名为
          <span
            :class="
              isCurrentVideoName || isCurrentImgName ? 'nameGreen' : 'nameRed'
            "
            >{{ currentName }}</span
          >
        </div>
      </div>
      <div style="margin-top: 10px" class="d_flex">
        <el-upload
          ref="uploadRef"
          v-model:file-list="fileList"
          :show-file-list="false"
          accept="image/*, video/*"
          :auto-upload="false"
          :on-change="changeFile"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <!-- 上传按钮的文本 -->
          <el-button type="primary">选择文件</el-button>
        </el-upload>
        <el-button
          type="primary"
          :loading="uploadLoading"
          style="margin-left: 20px"
          @click="handleUploadLogin"
          >上传文件</el-button
        >
      </div>
      <!-- 图片预览区域 -->
      <div v-if="imageUrl" class="file_preview">
        <img :src="imageUrl" alt="图片预览" />
      </div>

      <!-- 视频预览区域 -->
      <div v-if="videoUrl" class="file_preview">
        <video controls preload="metadata">
          <source :src="videoUrl" type="video/mp4" />
        </video>
      </div>
    </el-card>
  </div>
</template>
<script setup name="configuretechuploadloginback">
  import { ref, computed } from 'vue';
  import { ElMessage } from 'element-plus';
  import { uploadVideoApi } from '@/api/common/index.js';

  const imageUrl = ref('');
  const videoUrl = ref('');
  const currentName = ref('');
  const uploadRef = ref(null);
  const type = ref('');

  const isCurrentImgName = computed(() => {
    return currentName.value == 'loginBack2024.jpg' && type.value === 'image';
  });

  const isCurrentVideoName = computed(() => {
    return currentName.value == 'loginBack2024.mp4' && type.value === 'video';
  });

  const changeFile = (file) => {
    currentName.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      // 将 URL 存储到 data 对象中
      if (file.raw.type.startsWith('image/')) {
        // 如果是图片文件
        imageUrl.value = imageDataUrl;
        videoUrl.value = '';
        type.value = 'image';
      } else if (file.raw.type.startsWith('video/')) {
        // 如果是视频文件
        videoUrl.value = imageDataUrl;
        imageUrl.value = '';
        type.value = 'video';
      }
    };
    reader.readAsDataURL(file.raw);
  };

  const handleExceed = (files) => {
    uploadRef.value.clearFiles();
    const file = files[0];
    uploadRef.value.handleStart(file);
  };

  const fileList = ref([]);
  const uploadLoading = ref(false);

  const handleUploadLogin = async () => {
    if (fileList.value.length === 0) {
      return ElMessage.warning('请先选择文件');
    }

    try {
      uploadLoading.value = true;
      const formData = new FormData();
      formData.append('file', fileList.value[0].raw);
      const { code } = await uploadVideoApi(formData);
      if (code === '0000') {
        ElMessage.success('上传成功');
        uploadLoading.value = false;
      }
    } catch (err) {
      console.log(err);
      uploadLoading.value = false;
    }
  };
</script>
<style lang="scss" scoped>
  .file_preview {
    width: 500px;
    height: 500px;
    object-fit: contain;
    margin-top: 20px;
    border: 1px dashed #ccc;
    video,
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .d_flex {
    display: flex;
  }
  .file_tip {
    height: 40px;
  }
  .img_name {
    margin-top: 5px;
    padding-left: 26px;
  }
  .file_name {
    color: red;
    padding-left: 5px;
  }
  .nameGreen {
    color: green;
  }
  .nameRed {
    color: red;
  }
</style>
