<template>
  <div>
    <template v-if="curComponent.type === 'custom-img'">
      <div class="upload_btn">
        <el-upload
          :show-file-list="false"
          accept="image/*"
          :http-request="handleExceed"
        >
          <el-button type="primary">本地图片</el-button>
        </el-upload>
      </div>
      <div class="upload_btn">
        <el-input v-model="netImgUrl" placeholder="请输入图片地址" clearable />
        <el-button type="primary" @click="changeImage(netImgUrl)"
          >添加网络图片</el-button
        >
      </div>
      <div class="upload_image">
        <el-popover placement="left" :width="400" trigger="hover">
          <template #default>
            <el-image :src="localImg" />
          </template>
          <template #reference>
            <el-image
              style="width: 100px; height: 100px"
              :src="localImg"
              fit="contain"
            />
          </template>
        </el-popover>
      </div>
      <div class="upload_notice">支持jpg、png图片格式，图片大小不得超过1MB</div>
    </template>
    <ResetDelBtns
      :show-add-pre-set-btn="curComponent.type === 'custom-img' ? true : false"
      :show-copy-btn="curComponent.type === 'custom-img' ? false : true"
      :show-reset-btn="curComponent.type === 'custom-img' ? true : false"
      @del="emits('del')"
      @handle-reset="handleReset"
      @copy="emits('copy')"
      @handle-add-pre-img="emits('handleAddPreImg')"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { comBlobToDataURL } from '@/utils/upload';
  import sheetEditorStore from '@/store/modules/sheetEditor';
  import { storeToRefs } from 'pinia';
  import $ from 'jquery';
  import { ElMessage } from 'element-plus';
  import ResetDelBtns from './ResetDelBtns.vue';
  import { validateImgApi } from '@/api/order/printtemplate';

  const store = sheetEditorStore();
  const { curComponent } = storeToRefs(store);

  const emits = defineEmits(['del', 'handleAddPreImg', 'copy']);
  const defaultUrl =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAEsASwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6UooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKUAnoCaAEoqQROe2PrThAe5FAENFT+R/tfpSeR/tfpQBDRUphbsQaYUYdVNADaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiilAJOAOaAEp6Rs3TgetSxxActyaloAjWFR15NSAY6UUUAFFFFABRRRQAUUUUANZFbqKieE9VOfap6KAKZBBweKSrjIGGCKrSRlOeo9aAGUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFKBkgCgAVSxwKtRoEHHX1ojQIvv3p1ABRRRQAUUUx5VX3PtQA+iq7TMenFRlmPUmgC5kCk3D1FU6KALuaKqxxl+eg9asqoUYGaAFooooAKKKCQBk8CgCGSIclePaoKklkLcDgVHQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVYgTA3HqaiiXc49O9WqACiiigAoJCjJ6UjEKCT0qrI5c89PSgB0kpbgcCo6KKACiiigAqSFA7c9BUdOjba4PagC30FFFFABRRSMdqk4zQAMwUZNVpHLnnp6UjsWOTTaACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiilAyQPWgCxAuEz3NSUAYGBRQAUUUydtqY7nigCGZ9zcdBUdFFABRRRQAUUUUAFFFFAFmBtyY7ipKqwttf2PFWqACiiigCo67WIptWLhcgN6VXoAKKKKACinpGzew9akkjCxHA59aAIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACpIBmQe3NR1NbD5ifagCeiiigAqtOcyY9Ks1Tc5Yn3oASiiigApVBY4HWkqSD/AFlADCCDgjBpKuOoYciq8kRXpyKAI6KKKACrcTbkB71UqSBsPjsaALNFFFAARkEHvVNhtYg9quU0opbJGTQBXSNm6Dj1qZIlXryakooAKbLzG30p1I3Kke1AFOiiigAooooAKKKKACiiigAooooAKKKKACiiigAqe2/iqCprbq1AE9FFFABVKrtUjwaACiiigAqW2+8fpUVT238RoAmooooAjkhDcrwarspU4IxVykZQwwRQBToHXip/IGevFSKir0FACqSVBPBpaKKACiiigAooooAKKKD0oApUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFS25+f8ACoqdGdrg0AW6KKKACqkgxIw96t1Bcr0b8KAIaKKKACnxSbO2QaZRQBcVgwyDS1TRipyKsxyB/Y+lAD6KKKACiiigAooooAKKY8qr05NQPIzew9BQBaBB6GimQjEY9+afQAU2Q4RvpTqjuDhMetAFaiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAtxtuQGnVBbtglT3qegApHXcpFLRQBTIwSDSVYmj3fMOoqvQAUUUUAFFFFAE8c3Z/zqaqVPjkKcdR6UAWqCQOtQNP/AHR+dRMxY8nNAE7zAfd5qF5GbqePSm0UAFOjXcwHamgZOBVqJNi+560APooooAKr3DZfHpU7HapJqmTk5NABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAKDg5HWraNuUEVTp8T7G56GgC1RQKKACoZYs5ZfyqaigClRVqSMP7H1qB42XqMj1FADKKKKACiiigAoooHPSgApQCTgDmpEhY/e4FTooUcCgBsUYQZPLU+iigAoopkr7F46mgCO4fJ2joOtQ0UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUASwyY+VunarFUqlilK8HkUAWKKAQRkGigAooooAa0at1FMMC9iRUtFAEPkf7X6UCAd2/SpqKAIxCo65NPVQvQAUtFABRRRQAUUUySQJx1NACyOEHv2FVWJYkmhiWOSaSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAHI5Q8VOkqtweDVaigC7RVRXZeh4qVZ/7w/KgCaimCVD3/OnBgehFAC0UUZoAKKQuo6sKYZlHTJoAkpGYKMk4qBpmPTioiSTyc0ATPMTwvAqGiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z';

  const localImg = ref();
  const handleExceed = (e) => {
    comBlobToDataURL(e.file, (url) => {
      changeImage(url);
    });
  };

  const init = () => {
    const imgDom = $(curComponent.value.dom).find('img');
    localImg.value = imgDom.prop('src');
  };
  defineExpose({ init });

  const netImgUrl = ref();
  const changeImage = async (url) => {
    if (!url) return ElMessage.warning('请输入图片地址');
    try {
      const { msg } = await validateImgApi(url);
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('图片加载失败');
          }
          return response.blob();
        })
        .then((blob) => {
          var fileSizeInBytes = blob.size;
          var fileSizeInMB = fileSizeInBytes / (1024 * 1024);

          if (fileSizeInMB > 1) {
            ElMessage.warning('图片大小超过1MB');
            console.log('图片大小超过1MB');
          } else {
            console.log('图片大小未超过1MB');
            const imgDom = $(curComponent.value.dom).find('img');
            imgDom.prop('src', url);
            localImg.value = url;
            ElMessage.success(msg);
          }
        })
        .catch((error) => {
          ElMessage.warning('获取图片失败');
          console.log('获取图片失败:', error);
        });
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const handleReset = () => {
    if (curComponent.value.type === 'custom-img') {
      localImg.value = defaultUrl;
      const imgDom = $(curComponent.value.dom).find('img');
      imgDom.prop('src', defaultUrl);
    }
  };
</script>

<style lang="scss" scoped>
  .upload_btn {
    // display: flex;
    margin-bottom: 10px;
  }
  .upload_image {
    margin-left: 20px;
    margin-bottom: 10px;
  }
  .upload_notice {
    color: #e6a23c;
    background: #fdf6ec;
    border-color: #faecd8;
    line-height: 20px;
    padding: 5px 7px;
  }
</style>
