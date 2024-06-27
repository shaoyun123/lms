<template>
  <div class="previewClass">
    <div :class="previewData.type == 'mobileDesc' ? 'devicePhoneClass' : ''">
      <div class="title el-row">
        <div class="w100 bg-purple-dark">速卖通详情描述</div>
      </div>
      <div
        v-for="(item, index) in previewData.moduleList"
        :key="index"
        class="rowFlexClass"
      >
        <div class="taCenter">
          <template v-if="item.type === 'text'">
            <div v-for="(elem, textIndex) in item.texts" :key="textIndex">
              <div v-if="elem.class === 'title'" class="textTitleClass">
                {{ elem.content }}
              </div>
              <div v-else-if="elem.class === 'body'" class="textClass">
                {{ elem.content }}
              </div>
            </div>
          </template>
          <template v-if="item.type === 'image'">
            <div v-for="(elem, imgIndex) in item.images" :key="imgIndex">
              <div @click="handleJumpUrl(elem.targetUrl)">
                <img :src="elem.url" alt="" class="devicePhoneImg" />
              </div>
            </div>
          </template>
          <template v-if="item.type === 'text-image'">
            <div v-for="(elem, textIndex) in item.texts" :key="textIndex">
              <div v-if="elem.class === 'title'" class="textTitleClass">
                {{ elem.content }}
              </div>
              <div v-else-if="elem.class === 'body'" class="textClass">
                {{ elem.content }}
              </div>
            </div>
            <div v-for="(elem, imgIndex) in item.images" :key="imgIndex">
              <div @click="handleJumpUrl(elem.targetUrl)">
                <img :src="elem.url" alt="" class="devicePhoneImg" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="publishsaefullyhostedpublishpreviewdesc">
  import { onActivated, onMounted, ref } from 'vue';
  import { getItem } from '@/utils/storage';
  const previewData = ref({});
  onActivated(() => {
    previewData.value = getItem('priviewAeDescData');
  });
  onMounted(() => {
    previewData.value = getItem('priviewAeDescData');
  });
  const handleJumpUrl = (targetUrl = '') => {
    targetUrl && window.open(targetUrl);
  };
</script>

<style lang="scss" scoped>
  .devicePhoneClass {
    margin: 0 auto;
    background: #eee;
    padding: 5px;
    width: 375px;
  }

  .previewClass {
    width: 60%;
    padding: 20px;
  }

  .previewClass .title {
    height: 50px;
    line-height: 50px;
    color: #fff;
    text-align: center;
  }

  .el-row {
    position: relative;
    box-sizing: border-box;
  }

  .w100 {
    width: 100%;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .previewClass .textTitleClass {
    font-size: 16px;
    color: #333;
    line-height: 30px;
    white-space: pre-line;
  }

  .previewClass .textClass {
    font-size: 14px;
    line-height: 25px;
    color: #333;
    white-space: pre-line;
  }

  .devicePhoneImg {
    width: 100% !important;
    height: auto;
  }

  .taCenter {
    width: 80%;
    margin-left: 10%;
  }
</style>
