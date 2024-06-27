<template>
  <div class="shopeeChat">
    <header class="chat_header">
      <!-- 买家头像 -->
      <el-avatar
        v-if="userInfo.toAvatar"
        :size="50"
        :src="userInfo.toAvatar"
        class="md_headpic"
      />
      <!-- 买家姓名，当前所在店铺 -->
      <div class="chat_header_info">
        <span>{{ userInfo.toName }}</span>
        <template v-if="userInfo.storeAcct">
          <div class="chat_header_store">
            <el-icon :color="chatPrimary"><Shop /></el-icon>
            <span>{{ userInfo.storeAcct }}</span>
          </div>
        </template>
      </div>
      <div class="chat_header_pinned">
        <img
          v-if="userInfo.pinned"
          src="/src/components/lazada/images/pinned.png"
          width="25"
          @click="handlePinned(false)"
        />
        <img
          v-else
          src="/src/components/lazada/images/unpinned.png"
          width="25"
          @click="handlePinned(true)"
        />
      </div>
    </header>
    <section ref="chatMainRef" v-loading="messageListLoading" class="chat_main">
      <ChatList
        @scan-img-func="scanImgFunc"
        @change-offer-count="changeOfferCount"
        @change-offer-status="changeOfferStatus"
      />
      <!-- 点击图片查看大图 -->
      <div v-if="largeImg" class="lzd-preview">
        <div class="lzd-preview__header">
          <a
            class="action-btn action-btn--download"
            download=""
            :href="largeImgUrl"
            target="_blank"
            ><el-icon style="font-size: 40px"><Download /></el-icon></a
          ><span class="action-btn action-btn--close" @click="largeImg = false"
            ><el-icon style="font-size: 40px"><Close /></el-icon
          ></span>
        </div>
        <div class="lzd-preview__content">
          <div
            class="lzd-preview__viewer"
            :style="{ 'background-image': 'url(' + largeImgUrl + ')' }"
            style="transform: scale(1)"
          ></div>
        </div>
      </div>
      <!-- 上传图片回显 -->
      <div v-if="dialogVisible" class="lzd-preview">
        <div class="lzd-preview__content">
          <div
            class="lzd-preview__viewer"
            :style="{ 'background-image': 'url(' + dialogImageUrl + ')' }"
            style="transform: scale(1)"
          ></div>
        </div>
        <div class="lzd-preview__footer">
          <el-button
            size="small"
            type="danger"
            @click="handleImgFileSend(uploadImgUrl)"
            >发送</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="dialogVisible = !dialogVisible"
            >取消</el-button
          >
        </div>
      </div>
    </section>
    <!-- 底部 -->
    <div class="chat-footer">
      <!-- 选择栏 -->
      <el-row>
        <!-- 表情和图片选择 -->
        <el-col :span="4">
          <el-row>
            <el-col :span="4"></el-col>
            <el-col v-if="emojiData.length" :span="10">
              <img
                src="/src/components/lazada/images/xiaolian.png"
                width="30"
                @click="toggleEmoji()"
              />
              <!-- 表情包选择框 -->
              <div
                v-show="emojiShow"
                class="im-components-balloon im-components-balloon-normal im-components-balloon-medium im-components-balloon-bottom im-components-overlay-inner emotion-popup next-position-bc emoji-part"
              >
                <div class="im-emotions">
                  <div class="simple-scroller emoji-list custom-scroll-bar">
                    <div class="scroll-content emoji-scroll-content">
                      <div
                        v-for="(item, index) in curEmojiData.child"
                        :key="index"
                        class="emoji-item"
                        :index="index"
                        @click="sendEmojiFunc(item.stickerId)"
                      >
                        <el-image
                          :src="item.src"
                          class="emoji-item-pic"
                          loading="lazy"
                        ></el-image>
                        <span class="emoji-item-label">{{ item.name }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="simple-tab-container simple-tab-theme-badge">
                    <ul class="simple-tab" style="overflow-x: scroll">
                      <li
                        v-for="(item, index) of emojiData"
                        :key="item.packageId"
                        class="tab-item"
                        :class="{ selected: index == activedEmoji }"
                        @click="emojiTabFunc(item, index)"
                      >
                        <div class="ripple">
                          <el-image :src="item.src" loading="lazy" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="10">
              <el-upload
                class="upload_img"
                :action="''"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handlePictureCardPreview"
              >
                <el-icon :size="30"><Picture /></el-icon>
              </el-upload>
            </el-col>
          </el-row>
        </el-col>
        <!-- 语言模板 -->
        <el-col :span="10" class="disFCenter">
          <el-select
            v-model="tplInfo.languageCode"
            filterable
            placeholder="语言"
            @change="handleGetTplNameList"
          >
            <el-option
              v-for="item in languageList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>

          <el-select
            v-model="tplInfo.templateTypeName"
            filterable
            placeholder="模板类型"
            @change="handleGetTplNameList"
          >
            <el-option
              v-for="item in tplTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>

          <el-select
            v-model="tplId"
            filterable
            placeholder="模板名称"
            @change="handleTplName"
          >
            <el-option
              v-for="item in tplNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <!-- 输入消息内容框 -->
      <el-col :span="24">
        <el-input
          v-model="textarea"
          type="textarea"
          :rows="7"
          placeholder="在此输入消息内容,按回车键发送消息"
          autofocus="true"
          resize="none"
          @keydown="handleKeyCode($event)"
        >
        </el-input>
      </el-col>
      <!-- 回复按钮 -->
      <el-col :span="24">
        <el-row type="flex" class="row-bg mtb8" justify="end">
          <el-button size="small" type="danger" @click="handleTextSend"
            >回复</el-button
          >
        </el-row>
      </el-col>
    </div>
  </div>
</template>

<script setup>
  import {
    onMounted,
    ref,
    nextTick,
    watch,
    onBeforeUpdate,
    reactive
  } from 'vue';
  import { Shop, Picture, Download, Close } from '@element-plus/icons-vue';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  import ChatList from './ChatList.vue';
  import axios from 'axios';
  import { storeToRefs } from 'pinia';
  import { comBlobToDataURL } from '@/utils/upload';
  import { ElMessage } from 'element-plus';
  import { isEmpty } from 'lodash-es';
  import { chatPrimary } from '@/styles/vars.module.scss';
  import { getLanguageBySiteApi } from '@/api/shopee/chat';
  import {
    getTplTypeListApi,
    getTplNameListApi,
    getTplContentApi
  } from '@/api/common/chat';

  const shopeeChatStore = useShopeeChatStore();
  const { sendMessage, handlePinned } = shopeeChatStore;
  const { userInfo, messageListLoading } = storeToRefs(shopeeChatStore);
  const changeOfferCount = () => {};
  const changeOfferStatus = () => {};

  onMounted(() => {
    document.addEventListener('paste', getClipboardFiles);
  });

  const dialogVisible = ref(false);
  const dialogImageUrl = ref();
  // 发送图片
  const handleImgFileSend = (imageUrl) => {
    if (isEmpty(userInfo.value)) {
      return ElMessage.warning('请选择聊天对象');
    }
    sendMessage({ messageType: 'image', params: { imageUrl } });
    dialogVisible.value = false;
  };
  // 粘贴上传图片
  const getClipboardFiles = (event) => {
    let items = event.clipboardData && event.clipboardData.items;
    let file = null;
    if (items && items.length) {
      // 检索剪切板items
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile();
        }
      }
    }
    if (!file) {
      return false;
    }

    dialogImageUrl.value = URL.createObjectURL(file); // 赋值图片的url，用于图片回显功能
    dialogVisible.value = true;
    uploadImg(file); // 调用上传文件api接口
  };
  const uploadImgUrl = ref();
  // 图片上传服务器
  const uploadImg = (file) => {
    // 文件上传操作
    comBlobToDataURL(file, (res) => {
      console.log('res :>> ', res);
      uploadImgUrl.value = res;
    });
  };

  const emojiData = ref([]);
  const curEmojiData = ref({});
  const activedEmoji = ref(0);
  watch(
    () => userInfo.value.salesSite,
    (val) => {
      if (val) {
        // 获取语言
        initTplInfo();
        let stickerPrefixUrl = `https://deo.shopeemobile.com/shopee/shopee-sticker-live-${val.toLowerCase()}`;
        axios.get(`${stickerPrefixUrl}/manifest.json`).then(({ data }) => {
          if (data && data.packs) {
            const _packs = data.packs.filter((item) => item.reg.includes(val));
            _packs.forEach((item, index) => {
              axios
                .get(`${stickerPrefixUrl}/packs/${item.pid}/${item.pid}.json`)
                .then((res) => {
                  let curObj = {
                    stickerPackageId: item.pid,
                    src: `${stickerPrefixUrl}/packs/${item.pid}/icon@2x.png`,
                    child: []
                  };
                  res.data.stickers.forEach((elem) => {
                    let stickerUrl = `${stickerPrefixUrl}/packs/${item.pid}/${elem.sid}@1x.${elem.ext}`;
                    curObj.child.push({ stickerId: elem.sid, src: stickerUrl });
                  });
                  curObj.child.length && emojiData.value.push(curObj);
                  index === 0 && (curEmojiData.value = curObj);
                });
            });
          }
        });
      }
    }
  );
  const emojiShow = ref(false);
  const toggleEmoji = () => {
    emojiShow.value = !emojiShow.value;
  };
  const emojiTabFunc = (item, index) => {
    activedEmoji.value = index;
    curEmojiData.value = item;
  };

  // #region 语言模板
  const languageList = ref([]);
  const tplInfo = reactive({
    platCode: 'shopee'
  });
  const initTplInfo = async (val) => {
    tplInfo.languageCode = null;
    tplInfo.templateTypeName = null;
    tplId.value = null;
    Promise.all([
      getLanguageBySiteApi({
        salesSite: userInfo.value.salesSite || val
      }),
      getTplTypeListApi('shopee')
    ]).then((res) => {
      languageList.value = res[0].data;
      tplInfo.languageCode = res[0].data[0];
      tplTypeList.value = res[1].data;
    });
  };
  // 获取模板类型
  const tplTypeList = ref([]);
  const handleGetTplNameList = async () => {
    tplNameList.value = null;
    tplId.value = null;
    if (tplInfo.languageCode && tplInfo.templateTypeName) {
      const { data } = await getTplNameListApi({ ...tplInfo });
      tplNameList.value = data;
    }
  };
  const tplNameList = ref([]);
  const tplId = ref();
  const handleTplName = async () => {
    const { data } = await getTplContentApi(tplId.value);
    textarea.value = data.emailContent;
  };
  // #endregion 语言模板

  // 键盘回车事件
  const textarea = ref();
  const handleKeyCode = (event) => {
    // 排除别的键盘事件，如果不加这个，按一下键盘就会触发一次
    if (event.keyCode === 13) {
      if (event.keyCode === 13 && event.ctrlKey === true) {
        textarea.value = textarea.value + '\n';
      } else {
        event.preventDefault();
        handleTextSend();
      }
    }
  };
  // 发送文字消息
  const handleTextSend = () => {
    if (textarea.value === '') {
      return ElMessage.warning('发送消息内容不能为空');
    }
    if (isEmpty(userInfo.value)) {
      return ElMessage.warning('请选择聊天对象');
    }
    const itemIdReg = /^[0-9]{11}$/;
    const orderReg = /^[0-9A-Z]{14}$/;
    if (itemIdReg.test(textarea.value)) {
      // itemId
      sendMessage({
        messageType: 'item',
        params: { itemId: textarea.value }
      });
    } else if (orderReg.test(textarea.value)) {
      sendMessage({
        messageType: 'order',
        params: { orderSn: textarea.value }
      });
    } else {
      sendMessage({
        messageType: 'text',
        params: { text: textarea.value }
      });
    }
    textarea.value = '';
  };

  // 发送表情包
  const sendEmojiFunc = (stickerId) => {
    if (isEmpty(userInfo.value)) {
      return ElMessage.warning('请选择聊天对象');
    }
    sendMessage({
      messageType: 'sticker',
      params: {
        stickerId,
        stickerPackageId: curEmojiData.value.stickerPackageId
      }
    });
    // 选择表情隐藏
    toggleEmoji();
  };
  // 选择图片回显
  const handlePictureCardPreview = (file) => {
    const isJPG = file.raw.type === 'image/jpeg';
    const isPNG = file.raw.type === 'image/png';
    // const isLt2M = file.raw.size / 1024 / 1024 < 0.5  //限制上传文件的大小
    if (!isPNG && !isJPG) {
      return ElMessage.warning('上传图片只能是 JPG/PNG 格式!');
    } else {
      dialogImageUrl.value = URL.createObjectURL(file.raw); // 赋值图片的url，用于图片回显功能
      dialogVisible.value = true;
      uploadImg(file.raw); // 调用上传文件api接口
    }
  };

  // 点击查看大图
  const largeImg = ref(false);
  const largeImgUrl = ref();
  const scanImgFunc = (imgSrc) => {
    largeImg.value = true;
    largeImgUrl.value = imgSrc;
  };
  // 滚动条在最底部
  const chatMainRef = ref();
  const scrollToBottom = () => {
    nextTick(() => {
      chatMainRef.value.scrollTop = chatMainRef.value.scrollHeight;
    });
  };
  const changeMessageAttr = ref(false);
  onBeforeUpdate(() => {
    if (!changeMessageAttr.value) {
      scrollToBottom();
    } else {
      changeMessageAttr.value = false;
    }
  });
  defineExpose({ scrollToBottom });
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .shopeeChat {
    flex: 1;
  }
  .chat_header {
    display: flex;
    flex-direction: row;
    height: 80px !important;
    align-items: center;
    margin-left: 10px;
    &_info {
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      justify-content: space-between;
      & span:first-child {
        font-size: 16px;
        font-weight: 600;
      }
      & span:last-child {
        font-size: 14px;
      }
      .shop-icon {
        color: --chat-primary;
        font-size: 18px;
        margin-top: 5px;
      }
    }
    &_store {
      margin-top: 10px;
      display: flex;
    }
    &_pinned {
      width: 100%;
      padding-right: 40px;
      text-align: right;
    }
  }

  .el-container.is-vertical {
    flex-direction: column;
  }

  .el-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
  }
  :deep(.el-textarea__inner) {
    :focus {
      border-color: #c0c4cc;
    }
  }
  .shopeeChat {
    height: 100%;
    display: flex;
    flex-direction: column;
    .chat_main {
      display: block;
      flex: 1;
      box-sizing: border-box;
      padding: 20px;
      overflow: scroll;
      background-color: #f4f5f5;
    }
    .el-upload-list {
      display: none;
    }

    .border-bottom {
      border-bottom: 1px solid #ddd;
    }

    .chat-footer {
      height: 270px;
      border-top: 1px solid #ddd;
      .emoji-part {
        position: absolute;
        left: -140px;
        bottom: 50px;
        .emoji-scroll-content {
          width: 330px;
          height: 260px;
        }
      }
      .upload_img {
        vertical-align: middle;
        height: 100%;
      }
      .disFCenter {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .m8 {
      margin: 8px;
    }
    .mtb8 {
      margin: 8px 0 8px 0;
    }
    .msg-status {
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 16px;
    }
  }
</style>
