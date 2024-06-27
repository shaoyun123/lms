<template>
  <el-container style="height: 100%" class="lazadaChat">
    <el-header class="border-bottom" style="height: 80px">
      <el-row v-if="stateMessage.headUrl" :gutter="24">
        <!-- 买家头像 -->
        <el-col :span="2">
          <el-avatar :size="50" :src="stateMessage.headUrl" class="md_headpic">
          </el-avatar>
        </el-col>
        <!-- 买家姓名，当前所在店铺 -->
        <el-col :span="14">
          <el-col :span="24" class="size20" style="padding: 12px">
            {{ stateMessage.name }}
          </el-col>
          <el-col :span="24">
            <!-- <el-icon class="el-icon-s-shop size20"></el-icon> -->
            <el-icon class="size20"><Shop /></el-icon>
            {{ stateMessage.storeAcct }}
          </el-col>
        </el-col>
        <!-- 买家是否收藏该店铺 -->
        <el-col :span="8" style="text-align: right">
          <el-icon
            v-if="stateMessage.followFlag === 0"
            class="size30"
            :style="stateMessage.mark ? 'margin: 24px 24px 0px' : ''"
            @click="invite"
            ><User
          /></el-icon>
          <el-icon
            v-show="!stateMessage.mark"
            class="size30"
            style="cursor: pointer; margin: 24px 10px 0px"
            @click="starBool(false)"
            ><Star
          /></el-icon>
          <img
            v-show="stateMessage.mark"
            src="@/components/lazada/images/wujiaoxing.png"
            width="26"
            style="
              background-color: #fff;
              margin: -24px 0 0 -5px;
              cursor: pointer;
            "
            @click="starBool(true)"
          />
        </el-col>
      </el-row>
    </el-header>
    <el-main class="chat-main" style="background-color: #f4f5f5">
      <div v-for="(item, index) in stateMessage.messageList" :key="index">
        <!-- 10015自动回复，暂时没写 -->
        <!-- 10011退款卡片，前端暂时没写，没找到样式 -->
        <div
          v-if="
            item.templateId !== 2 &&
            item.messageStatus === 0 &&
            item.templateId !== 10015
          "
          class="message-row row-card-emoji"
          :class="item.fromAccountType === 1 ? 'user-type-1' : 'user-type-2'"
        >
          <div class="simple-avatar circle">
            <!-- <img :src="item.headUrl" /> -->
            <img
              :src="
                item.fromAccountType === 1
                  ? stateMessage.headUrl
                  : 'https://sg-live.slatic.net/original/0f460c08eaf10eaaada4bd51ef2af6ea.png'
              "
            />
          </div>
          <div
            class="message-contain"
            @mouseenter="mouseEnter(item.sendTime, index)"
            @mouseleave="mouseLeave"
          >
            <div :class="item.fromAccountType === 1 ? '' : 'message-read-type'">
              <span style="color: #999">{{
                util.formatDate.format(
                  new Date(item.sendTime),
                  'MM-dd hh:mm:ss'
                )
              }}</span>
            </div>
            <!-- 撤回图标 -->
            <div :class="enterVal == index ? '' : enterClass">
              <div
                class="message-withdraw"
                style="bottom: 0px; cursor: pointer"
                @click="goback(item)"
              >
                <img
                  src="@/components/lazada/images/chehui.png"
                  alt="撤回"
                  width="18"
                  height="15"
                />
              </div>
            </div>
            <!-- start -->
            <!-- 文字 -->
            <lazada-text
              v-if="item.templateId === 1"
              :lazada-text-data="item"
            ></lazada-text>
            <!-- 图片 -->
            <lazada-img
              v-if="item.templateId === 3"
              :lazada-img-data="item"
              @click="scanImgFunc(JSON.parse(item.content).imgUrl)"
            ></lazada-img>
            <!-- 表情 -->
            <lazada-emoji
              v-if="item.templateId === 4"
              :lazada-emoji-data="item"
            ></lazada-emoji>
            <!-- 商品 -->
            <lazada-product
              v-if="item.templateId === 10006"
              :lazada-product-data="item"
            ></lazada-product>
            <!-- 订单 -->
            <lazada-order
              v-if="item.templateId === 10007"
              :lazada-order-data="item"
            ></lazada-order>
            <!-- 优惠券 -->
            <lazada-voucher
              v-if="item.templateId === 10008"
              :lazada-voucher-data="item"
            ></lazada-voucher>
            <!-- 关注卡片 -->
            <lazada-card
              v-if="item.templateId === 10010"
              :lazada-card-data="item"
            >
            </lazada-card>
            <!-- end -->
            <div class="message-read-type">
              <span v-if="!item.readStatus" class="read-type unread-type"
                >未读</span
              >
              <span v-if="item.readStatus" class="read-type">读取</span>
            </div>
          </div>
          <div class="avatar-holder"></div>
        </div>
        <!-- 系統消息 -->
        <lazada-sys-text
          v-if="item.templateId === 2 && item.messageStatus === 0"
          :lazada-sys-text-data="item"
        >
        </lazada-sys-text>
      </div>
      <!-- 点击图片查看大图 -->
      <div v-if="largeImg" class="lzd-preview">
        <div class="lzd-preview__header">
          <a
            class="action-btn action-btn--download"
            download=""
            :href="largeImgUrl"
            target="_blank"
          >
            <!-- <i class="im-components-icon im-components-icon-download im-components-icon-xl"></i> -->
            <el-icon style="font-size: 40px"><Download /></el-icon></a
          ><span
            class="action-btn action-btn--close"
            @click="largeImg = !largeImg"
          >
            <!-- <i class="im-components-icon im-components-icon-close im-components-icon-xl"></i> -->
            <el-icon style="font-size: 40px"><Close /></el-icon>
          </span>
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
          <el-button size="small" @click="handleImgFileSend(uploadImgUrl)"
            >发送</el-button
          >
          <el-button size="small" @click="dialogVisible = !dialogVisible"
            >取消</el-button
          >
        </div>
      </div>
      <!-- 表情包选择框 -->
      <div
        v-show="emojiShow"
        class="im-components-balloon im-components-balloon-normal im-components-balloon-medium im-components-balloon-bottom im-components-overlay-inner emotion-popup next-position-bc"
        style="
          transform-origin: center bottom;
          position: absolute;
          left: 478px;
          bottom: 285px;
        "
      >
        <div class="im-emotions">
          <div class="simple-scroller emoji-list custom-scroll-bar">
            <div class="scroll-content" style="width: 330px; height: 260px">
              <div
                v-for="(item, index) in emojiData"
                :key="index"
                class="emoji-item"
                :index="index"
                @click="sendEmojiFunc(item.src, item.name)"
              >
                <img class="emoji-item-pic" :src="item.src" /><span
                  class="emoji-item-label"
                  >{{ item.name }}</span
                >
              </div>
            </div>
          </div>
          <div class="simple-tab-container simple-tab-theme-badge">
            <ul class="simple-tab">
              <li
                v-for="(item, index) in emojiTab"
                :key="index"
                class="tab-item"
                :class="{ selected: index == ins }"
                @click="emojiTabFunc(index)"
              >
                <div class="ripple">
                  <img :src="item" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-main>
    <!-- 底部 -->
    <el-footer class="border-top" style="height: 270px">
      <!-- 选择栏 -->
      <el-col :span="24">
        <el-row>
          <!-- 表情和图片选择 -->
          <el-col :span="4">
            <el-row>
              <el-col :span="12">
                <img
                  src="@/components/lazada/images/xiaolian.png"
                  width="30"
                  class="m8"
                  @click="toggleEmoji"
                />
              </el-col>
              <el-col :span="12">
                <el-upload
                  style="display: inline"
                  class="avatar-uploader"
                  :action="''"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handlePictureCardPreview"
                >
                  <img
                    src="@/components/lazada/images/tupian.png"
                    width="30"
                    class="m8"
                  />
                </el-upload>
              </el-col>
            </el-row>
          </el-col>
          <!-- 下拉框 -->
          <el-col :span="20">
            <el-row>
              <el-col :span="8">
                <el-select
                  v-model="language"
                  placeholder="请选择语言"
                  size="small"
                  class="mtb8"
                >
                  <el-option
                    v-for="item in languageOptions"
                    :key="item.language"
                    :label="item.language"
                    :value="item.language"
                    @click="languageTemplateName()"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="template"
                  placeholder="请选择模板类型"
                  size="small"
                  class="mtb8"
                >
                  <el-option
                    v-for="item in templateOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                    @click="languageTemplateName()"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="templateName"
                  placeholder="请选择模板名称"
                  size="small"
                  class="mtb8"
                >
                  <el-option
                    v-for="item in templateNameOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    @click="getlanguageTemplateName(item)"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
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
          <el-button
            size="small"
            type="danger"
            style="color: #fff"
            @click="handleTextTranslate"
            >翻译</el-button
          >
          <el-button
            size="small"
            type="danger"
            style="color: #fff"
            @click="handleTextSend"
            >回复</el-button
          >
        </el-row>
      </el-col>
    </el-footer>
  </el-container>
</template>
<script>
  import { defineComponent, computed } from 'vue';
  import lazadaChat from '@/store/lazadaChat/store';
  import { enmuEmojiData } from '@/components/lazada/js/enum';
  import {
    sendMessage,
    recallMessage,
    getImgPath,
    updateMark,
    getLanguage,
    listTemplateType,
    listTemplateName,
    lazadaTransactionContent,
    getEmailContent
  } from '@/api/lazada/index';

  import lazadaVoucher from '@/components/lazada/LazadaVoucher.vue';
  import lazadaText from '@/components/lazada/LazadaText.vue';
  import lazadaSysText from '@/components/lazada/LazadaSysText.vue';
  import lazadaProduct from '@/components/lazada/LazadaProduct.vue';
  import lazadaEmoji from '@/components/lazada/LazadaEmoji.vue';
  import lazadaImg from '@/components/lazada/LazadaImg.vue';
  import lazadaCard from '@/components/lazada/LazadaCard.vue';
  import lazadaOrder from '@/components/lazada/LazadaOrder.vue';
  // import VirtualList from '@/components/lazada/VirtualList.vue';

  export default defineComponent({
    components: {
      // 'lazada-voucher': lazadaVoucher,
      // 'lazada-text': lazadaText,
      // 'lazada-sys-text': lazadaSysText,
      // 'lazada-product': lazadaProduct,
      // 'lazada-emoji': lazadaEmoji,
      // 'lazada-img': lazadaImg,
      // 'lazada-card': lazadaCard,
      // 'lazada-order': lazadaOrder
      lazadaVoucher,
      lazadaText,
      lazadaSysText,
      lazadaProduct,
      lazadaEmoji,
      lazadaImg,
      lazadaCard,
      lazadaOrder

      // VirtualList: VirtualList
    },
    setup() {
      const { state } = lazadaChat(); // 引入 useStore 类似 vue2 的 this.state

      const stateMessage = computed(() => {
        // 使用计算属性来监听数据的变化
        return state.message;
      });
      return {
        // 返回出去供 template 模板访问
        state,
        stateMessage
      };
    },
    data() {
      return {
        messageList: [],
        largeImg: false,
        largeImgUrl: '',
        dialogImageUrl: '',
        uploadImgUrl: '',
        imageUrl: '',
        dialogVisible: false,
        language: '', // 语言
        languageOptions: [], // 语言下拉options
        template: '', // 模板类型
        templateOptions: [], // 模板类型下拉options
        templateName: '', // 模板名称
        templateNameOptions: [], // 模板名称下拉options
        ins: 0,
        chatDataList: [],
        textarea: '',
        emojiShow: false,
        emojiTab: [
          'https://sg-live-01.slatic.net/other/im/dc9375aeaba4435212341c2c71bb2c52.png',
          'https://sg-live.slatic.net/other/im/edd7b121015dfc3743316c1e132cecb7.png',
          'https://sg-live.slatic.net/other/im/daa33e1afebefd388e616e82a7dc2071.png'
        ],
        emojiData: [],
        staticEmojiData: {},
        enterClass: 'message-withdraw-active',
        enterVal: ''
      };
    },
    computed: {
      // messageList() {
      //   return this.state.message.messageList;
      // }
    },
    watch: {
      'state.message.messageList': function (val) {
        this.messageList = val;
      },
      // 当前店铺id，会话列表变化
      'state.currentStoreAcctId': function () {
        this.state.message = {};
        this.state.currentSession = '';
        this.state.showSessionListData = [];
      },
      // 当前站点
      'state.currentSalesSite': function (val) {
        // console.log(val);
        if (val !== '') {
          this.getLanguage();
        }
      }
    },
    mounted() {
      // 获取图片表情包
      console.log(enmuEmojiData);
      this.staticEmojiData = enmuEmojiData;
      this.emojiData = this.staticEmojiData[`emoji1`];
      document.addEventListener('paste', this.newHandleGetClipboardFiles);
    },
    beforeUpdate() {
      this.scrollToBottom();
    },

    methods: {
      // 邀请关注
      invite() {
        this.sendMessageFunc({
          salesSite: this.state.currentSalesSite,
          storeAcctId: this.state.currentStoreAcctId,
          sessionId: this.state.message.sessionId,
          templateId: 10010
        });
      },
      // 收藏切换
      starBool(bool) {
        if (bool === true) {
          this.state.message.mark = false;
        } else {
          this.state.message.mark = true;
        }
        this.state.showSessionListData.forEach((item) => {
          if (item.sessionId === this.state.message.sessionId) {
            item.mark = this.state.message.mark;
          }
        });

        this.state.message = {
          name: this.state.message.name,
          headUrl: this.state.message.headUrl,
          sessionId: this.state.message.sessionId,
          storeAcctId: this.state.message.storeAcctId,
          storeAcct: this.state.message.storeAcct,
          messageList: this.state.message.messageList,
          buyerId: this.state.message.buyerId,
          mark: this.state.message.mark,
          followFlag: this.state.message.followFlag
        };
        // this.state.showSessionListData = this.state.showSessionListData;
        updateMark({
          sessionId: this.state.message.sessionId,
          mark: bool === true ? 0 : 1
        }).then((res) => {
          if (res.code !== '0000') {
            this.$message.error(res.msg);
          }
        });
      },
      newHandleGetClipboardFiles(event) {
        this.getClipboardFiles(event);
      },
      // 粘贴上传图片
      getClipboardFiles(event) {
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
          //  this.$message.error('粘贴内容不是图片')
          return false;
        }

        this.dialogImageUrl = URL.createObjectURL(file); // 赋值图片的url，用于图片回显功能
        this.dialogVisible = true;
        this.uploadImg(file); // 调用上传文件api接口
      },
      // 点击查看大图
      scanImgFunc(imgSrc) {
        this.largeImg = true;
        this.largeImgUrl = imgSrc;
      },
      // 滚动条在最底部
      scrollToBottom() {
        this.$nextTick(() => {
          let box = this.$el.querySelector('.chat-main');
          box.scrollTop = box.scrollHeight;
        });
      },
      // 表情包整体显示隐藏
      toggleEmoji() {
        this.emojiShow = !this.emojiShow;
      },
      // 选择表情包的tab
      emojiTabFunc(num) {
        this.ins = num;
        this.emojiData = this.staticEmojiData[`emoji${num + 1}`];
      },
      // 键盘回车事件
      handleKeyCode(event) {
        // 排除别的键盘事件，如果不加这个，按一下键盘就会触发一次
        if (event.keyCode === 13) {
          if (event.keyCode === 13 && event.ctrlKey === true) {
            this.textarea = this.textarea + '\n';
          } else {
            event.preventDefault();
            this.handleTextSend();
          }
        }
      },
      // 发送文字消息
      handleTextSend() {
        if (this.textarea === '') {
          this.$message.error('发送消息内容不能为空');
          return false;
        }
        this.sendMessageFunc({
          salesSite: this.state.currentSalesSite,
          storeAcctId: this.state.currentStoreAcctId,
          sessionId: this.state.message.sessionId,
          templateId: 1,
          txt: this.textarea
        });
        this.textarea = '';
      },
      // 翻译文字
      handleTextTranslate() {
        let _this = this;
        if (this.state.currentSalesSite && this.textarea) {
          lazadaTransactionContent({
            salesSite: _this.state.currentSalesSite,
            content: _this.textarea
          }).then((res) => {
            if (res.code == '0000') {
              this.$message.success('翻译成功');
              _this.textarea = res.data[0].message.content;
            } else {
              this.$message.error(res.msg);
            }
          });
        } else if (!this.state.currentSalesSite) {
          this.$message.error('请选择站点');
        } else if (!this.textarea) {
          this.$message.error('请输入需要翻译的内容');
        }
      },
      // 发送表情包
      sendEmojiFunc(imgUrl, imgName) {
        this.sendMessageFunc({
          salesSite: this.state.currentSalesSite,
          storeAcctId: this.state.currentStoreAcctId,
          sessionId: this.state.message.sessionId,
          templateId: 4,
          txt: `[${imgName}]`,
          imgUrl: imgUrl
        });
        // 选择表情隐藏
        this.toggleEmoji();
      },
      // 发送优惠券
      sendVoucherFunc() {
        this.sendMessageFunc({
          salesSite: this.state.currentSalesSite,
          storeAcctId: this.state.currentStoreAcctId,
          sessionId: this.state.message.sessionId,
          templateId: 10008
        });
      },
      // 发送消息接口
      sendMessageFunc(obj) {
        sendMessage(obj).then((res) => {
          if (res.code !== '0000') {
            this.$message.error(res.msg);
          } else {
            this.state.showSessionListData[
              this.state.unanswered
            ].fromAccountType = 2;
            // this.state.showSessionListData = this.state.showSessionListData;
          }
        });
      },
      // 选择图片回显
      handlePictureCardPreview(file) {
        const isJPG = file.raw.type === 'image/jpeg';
        const isPNG = file.raw.type === 'image/png';
        // const isLt2M = file.raw.size / 1024 / 1024 < 0.5  //限制上传文件的大小
        if (!isPNG && !isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
          return false;
        } else {
          this.dialogImageUrl = URL.createObjectURL(file.raw); // 赋值图片的url，用于图片回显功能
          this.dialogVisible = true;
          this.uploadImg(file.raw); // 调用上传文件api接口
        }
      },
      // 发送图片
      handleImgFileSend(imgSrc) {
        this.sendMessageFunc({
          salesSite: this.state.currentSalesSite,
          storeAcctId: this.state.currentStoreAcctId,
          sessionId: this.state.message.sessionId,
          templateId: 3,
          imgUrl: imgSrc,
          width: 100,
          height: 100
        });
        this.dialogVisible = !this.dialogVisible;
      },
      // 图片上传服务器
      uploadImg(file) {
        // 文件上传操作
        let formData = new FormData();
        formData.append('imageFile', file);
        getImgPath(formData).then((res) => {
          if (res.code === '0000') {
            this.uploadImgUrl = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      // 鼠标移入
      mouseEnter(sendTime, index) {
        // 發送消息的時間,两分钟 = 120s
        if (this.timediff(new Date().getTime(), sendTime) <= 120) {
          this.enterVal = index;
        } else {
          this.enterVal = '';
        }
      },
      timediff(beginTime, endTime) {
        let date1, date2;
        if (beginTime < endTime) {
          date1 = beginTime;
          date2 = endTime;
        } else {
          date1 = endTime; // 开始时间
          date2 = beginTime;
        }
        let date3 = date2 - date1; // 时间差的毫秒数
        return date3 / 1000;
      },
      // 鼠标移出
      mouseLeave() {
        this.enterVal = '';
      },
      // 消息撤回
      goback(obj) {
        let { sessionId, messageId } = { ...obj };
        let salesSite = this.state.currentSalesSite;
        let storeAcctId = this.state.currentStoreAcctId;
        recallMessage({
          sessionId,
          messageId,
          storeAcctId,
          salesSite
        }).then((res) => {
          if (res.code !== '0000') {
            this.$message.error(res.msg);
          } else {
            // 前端撤回
            this.state.message.messageList =
              this.state.message.messageList.filter(
                (item) => item.messageId !== obj.messageId
              );
            this.state.message = {
              name: this.state.message.name,
              headUrl: this.state.message.headUrl,
              sessionId: this.state.message.sessionId,
              storeAcctId: this.state.message.storeAcctId,
              storeAcct: this.state.message.storeAcct,
              messageList: this.state.message.messageList,
              buyerId: this.state.message.buyerId,
              mark: this.state.message.mark,
              followFlag: this.state.message.followFlag
            };
          }
        });
      },
      // 根据站点初始化语言
      getLanguage() {
        this.textarea = '';
        getLanguage({ salesSite: this.state.currentSalesSite }).then((res) => {
          if (res.code !== '0000') {
            this.$message.error(res.msg);
          } else {
            this.languageOptions = res.data;
            this.language = res.data.filter((item) => !item.flag)[0].language;
          }
        });
        this.languageTemplate();
      },
      // 查询模板类型
      languageTemplate() {
        this.textarea = '';
        listTemplateType({ platCode: 'lazada' }).then((res) => {
          if (res.code !== '0000') {
            // 后面删掉
            this.templateOptions = ['物流'];
            this.$message.error(res.msg);
          } else {
            this.templateOptions = res.data;
          }
        });
      },
      languageChange() {
        this.textarea = '';
        this.templateName = '';
      },
      // 查询模板名称
      languageTemplateName() {
        this.languageChange();
        listTemplateName({
          platCode: 'lazada',
          // 模板类型名
          templateTypeName: this.template,
          // 语言
          languageCode: this.language
        }).then((res) => {
          if (res.code !== '0000') {
            this.$message.error(res.msg);
          } else {
            this.templateNameOptions = res.data;
          }
        });
      },
      // 选择模板名称显示模板
      getlanguageTemplateName(item) {
        getEmailContent({ id: item.id }).then((res) => {
          if (res.code !== '0000') {
            this.$message.error(res.msg);
          } else {
            this.textarea = '';
            this.textarea = res.data.emailContent;
          }
        });
      }
    }
  }); // <style scoped lang="scss">
</script>
<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
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
  :deep(.lazadaChat .el-textarea__inner:focus) {
    border-color: #c0c4cc;
  }
  .lazadaChat {
    .chat-main {
      display: block;
      flex: 1;
      box-sizing: border-box;
      padding: 20px;
    }
    .el-upload-list {
      display: none;
    }

    .border-bottom {
      border-bottom: 1px solid #ddd;
    }

    .border-top {
      border-top: 1px solid #ddd;
    }

    .size20 {
      font-size: 21px;
    }

    .size30 {
      font-size: 30px;
      line-height: 60px;
    }
    .m8 {
      margin: 8px;
    }
    .mtb8 {
      margin: 8px 0 8px 0;
    }
  }
</style>
