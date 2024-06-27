<template>
  <el-dialog
    v-model="dialogVisible"
    width="1000px"
    class="media-dialog"
    title="媒体中心视频"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dis_flex">
      <div class="dis_flex">
        <el-input v-model="videoName" placeholder="视频名称" />
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="searchVideoList"
          >查找</el-button
        >
      </div>
      容量：{{ usage }} / {{ capicity }}
    </div>
    <el-radio-group v-model="selectedData" class="radioCss">
      <div v-for="item in videoList" :key="item.id" class="dis_flex contain">
        <el-radio
          size="large"
          :value="item.id"
          style="width: 10px; margin-right: 10px"
        >
          {{ '' }}
        </el-radio>
        <div style="width: 100%">
          <img
            :src="item.coverUrl"
            style="width: 120px; height: 120px; border: 1px dashed #ddd"
            @click="openUrl(item.url)"
          />
          <div class="all_capacity">
            <span>{{ (item.size / 1024 / 1024).toFixed(1) }}MB</span>
            <span style="float: right"
              >{{ (item.duration / 60).toFixed(0) }}:{{
                item.duration % 60
              }}</span
            >
          </div>
          <div class="video_name">
            {{ item.name }}
          </div>
        </div>
      </div>
    </el-radio-group>
    <template #footer>
      <div
        style="display: flex; align-items: baseline; justify-content: flex-end"
      >
        <div class="pagination" style="margin-right: 40px">
          <el-pagination
            v-model:currentPage="paginationData.page"
            v-model:page-size="paginationData.limit"
            background
            :page-sizes="[50]"
            :small="true"
            layout="total, sizes, prev, pager, next"
            :total="paginationData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <el-button type="primary" @click="getSelected">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref, reactive, onMounted, computed } from 'vue';
  import {
    searchVideo,
    getMediaCenterInfo
  } from '@/api/publishs/aefullyhostedpublish';
  const props = defineProps({
    openVideoCenterVisible: {
      type: Boolean,
      default: false
    },
    storeAcctId: {
      type: Number,
      default: 0
    }
  });
  const emits = defineEmits(['close', 'videoSelected']);
  const handleClose = () => {
    emits('close');
  };
  const selectedData = ref('');
  //   确认保存
  const getSelected = () => {
    if (selectedData.value == '') {
      return ElMessage.warning('请至少选择一条视频后再保存');
    } else {
      let selected = videoList.value.filter(
        (item) => item.id == selectedData.value
      );
      emits('videoSelected', selected);
    }
  };
  const dialogVisible = computed(() => {
    return props.openVideoCenterVisible;
  });
  const capicity = ref(''); //总容量
  const usage = ref(''); //已使用容量
  const videoList = ref([]);
  onMounted(() => {
    getInfo();
    getVideoData('');
  });
  //  单位显示 KB/MB/GB
  const changeUnit = function (val) {
    val = val * 1;
    if (val < 1024) {
      return (val / 1024).toFixed(1) + 'KB';
    } else if (val >= 1024 && val < 1024 * 1024) {
      return (val / (1024 * 1024)).toFixed(1) + 'MB';
    } else if (val >= 1024 * 1024) {
      return (val / (1024 * 1024 * 1024)).toFixed(1) + 'GB';
    }
  };
  //   获取总容量&已使用容量
  const getInfo = async () => {
    const { code, data } = await getMediaCenterInfo(props.storeAcctId);
    if (code == '0000') {
      // 根据合适的单位显示
      capicity.value = changeUnit(data.capicity); //总容量
      usage.value = changeUnit(data.usage);
    }
  };
  //   获取视频的数据，所有||过滤查询
  const getVideoData = async (videoName) => {
    const { code, data } = await searchVideo({
      storeAcctId: props.storeAcctId,
      videoName,
      pageSiz: paginationData.limit,
      currentPage: paginationData.page
    });
    if (code == '0000') {
      videoList.value = data.videoList;
      paginationData.total = data.totalCount;
    }
  };
  //   输入的视频名称
  const videoName = ref();
  //   查询
  const searchVideoList = () => {
    getVideoData(videoName.value);
  };
  //   点击显示视频
  const openUrl = (url) => {
    ElMessageBox.alert(
      `<video width="400" controls autoplay src="${url}"></video>`,
      '视频预览',
      {
        dangerouslyUseHTMLString: true
      }
    );
  };
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });
  // 分页--start
  // 设置每页count
  const handleSizeChange = () => {
    getVideoData(videoName.value);
  };
  // 上一页下一页
  const handleCurrentChange = () => {
    getVideoData(videoName.value);
  };
  // 分页--end
</script>
<style lang="scss" scoped>
  .dis_flex {
    display: flex;
    justify-content: space-between;
  }
  .radioCss {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    font-size: 14px;
  }
  .contain {
    width: 160px;
    height: 160px;
    margin: 10px;
    position: relative;
  }
  .all_capacity {
    position: absolute;
    margin-top: -20px;
    width: 120px;
    height: 30px;
  }
  .video_name {
    width: 130px;
    height: 30px;
    margin-top: 5px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
<style lang="scss">
  .media-dialog {
    margin-top: 100px;
    .el-dialog__body {
      overflow-y: auto;
      max-height: 650px;
    }
    .el-loading-mask {
      top: -24px;
    }
    .el-loading-spinner {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      width: auto;
    }
  }
</style>
