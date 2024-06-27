<template>
  <!-- 视频信息 -->
  <el-divider content-position="left"><h3>视频信息</h3></el-divider>
  <div>
    （视频时长不超过180s，不超过500M，支持mp4,wmv,avi,mpg,flv,mov,3gp格式，建议视频比例16:9和1:1，建议最小分辨率≥720p）
  </div>
  <div style="margin-left: 40px; margin-top: 10px">
    <div style="display: flex; align-items: center">
      <el-radio-group v-model="isCancelVideo" style="font-size: 14px">
        <el-radio :value="false" size="large"> {{ '' }}</el-radio>
        <div>
          <video
            v-if="hasVideo"
            :src="showVideoUrl"
            class="video_box"
            controls
          ></video>
          <div v-if="showVideoUrl" class="video_file_name">
            {{ formData.videoFileName }}
          </div>
          <div v-else class="no_video">该商品暂无视频</div>
        </div>
        <div style="margin: 10px">
          <div>
            <el-upload
              action="/api/lms/aliexpressFullmanage/listing/uploadVideo"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              ><el-button type="primary" size="small">本地上传</el-button>
            </el-upload>
          </div>
          <div style="margin-top: 10px">
            <el-button type="primary" size="small" @click="openVideoCenter"
              >从媒体中心选择</el-button
            >
          </div>
        </div>
        <el-radio :label="true" size="large">取消上传视频</el-radio>
      </el-radio-group>
    </div>
  </div>
  <VideoCenter
    v-if="openVideoCenterVisible"
    open-video-center-visible="openVideoCenterVisible"
    :store-acct-id="formData.storeAcctId"
    @close="videoCenterClose"
    @video-selected="videoSelected"
  />
</template>
<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, computed, onMounted, watch } from 'vue';
  import VideoCenter from '@/components/ChooseTplMedia/index.vue';
  const props = defineProps({
    formData: {
      type: Object,
      default: () => {}
    }
  });

  const hasVideo = computed(() => {
    return props.formData.hasVideo;
  });

  const showVideoUrl = ref('');

  const isCancelVideo = ref('');

  onMounted(() => {
    if (!props.formData.mediaCenterVideoUrl && !props.formData.videoUrl) {
      isCancelVideo.value = true;
    } else {
      isCancelVideo.value = false;
    }
    setUrl(props.formData);
  });
  const emits = defineEmits(['update', 'changeIsCancel', 'chooseMedia']);

  watch(
    () => [isCancelVideo.value, props.formData],
    (val) => {
      emits('changeIsCancel', val);
      if (val[1].videoUrl || val[1].mediaCenterVideoUrl) {
        setUrl(val[1]);
      }
    },
    {
      deep: true
    }
  );

  // 设置url
  const setUrl = (obj) => {
    const formDataCopy = JSON.parse(JSON.stringify(obj));
    let { videoUrl, mediaCenterVideoUrl, templateVideoUrl } = formDataCopy;

    let url = videoUrl || mediaCenterVideoUrl || templateVideoUrl;
    showVideoUrl.value = url;
  };

  // 本地上传视频文件
  const handleAvatarSuccess = (res) => {
    if (res.code == '0000') {
      emits('update', res);
      isCancelVideo.value = false;
    } else {
      ElMessage.warning(res.msg);
    }
  };

  // 视频上传前
  const beforeAvatarUpload = async (file) => {
    let isMp4success = await getMp4Detail(file); // 视频时长
    if (isMp4success * 1 > 180) {
      return ElMessage.warning('上传视频长度不能超过 180 秒');
    }
  };

  function getMp4Detail(file) {
    return new Promise((resolve, reject) => {
      // mp4/wmv/avi/mpg/flv/mov/3gp
      // 获取后缀名
      // const suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
      // 判断是否符合文件大小的限制需求
      const isLt2M = file.size / 1024 / 1024 < 500;
      // 判断是否符合文件类型需求
      const isLtType = [
        'video/mp4',
        // 'video/wmv',
        'video/x-ms-wmv',
        'video/avi',
        // 'video/mpg',
        'video/mpeg',
        // 'video/flv', //?
        // 'video/mov',
        'video/quicktime',
        // 'video/3gp'
        'video/3gpp'
      ];

      if (!isLt2M) {
        ElMessage.warning('上传文件大小不能超过500M!');
      }

      let correctType = true;
      //限制视频格式
      if (
        (file.type != '' && isLtType.indexOf(file.type) == -1) ||
        (file.type == '' && !file.name.includes('.flv'))
      ) {
        correctType = false;
        ElMessage.warning('上传视频文件格式不合法');
      } else {
        correctType = true;
      }

      //获取视频时长
      let url = URL.createObjectURL(file);
      let audioElement = new Audio(url);
      let duration;
      let fun = (duration) => {
        resolve(duration);
      };
      //下面需要注意的是在监听loadedmetadata绑定的事件中对duration直接进行赋值是无效的，需要在fun回调函数中进行赋值
      audioElement.addEventListener('loadedmetadata', function () {
        //音频/视频的元数据已加载时，会发生 loadedmetadata 事件
        duration = audioElement.duration; //时长以秒作为单位
        fun(parseFloat(duration).toFixed(1));
      });
      if (!(isLt2M && correctType)) {
        reject();
      }
    });
  }

  // 打开媒体中心弹窗
  const openVideoCenterVisible = ref(false);
  const openVideoCenter = () => {
    openVideoCenterVisible.value = true;
  };
  const videoCenterClose = () => {
    openVideoCenterVisible.value = false;
  };
  const videoSelected = (data) => {
    emits('chooseMedia', data);
    isCancelVideo.value = false;
    openVideoCenterVisible.value = false;
  };
</script>
<style lang="scss" scoped>
  .video_box {
    width: 320px;
    height: 180px;
    border: 1px dashed #dddddd;
  }
  .video_file_name {
    width: 320px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
