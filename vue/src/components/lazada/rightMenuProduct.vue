<template>
  <el-card class="box-card" style="margin: 5px">
    <el-row>
      <el-col :span="4"
        ><img :src="productData.images" width="50" alt="hh" />
      </el-col>
      <el-col :span="20">
        <!-- <el-row> -->
        <div
          style="
            font-size: 15px;
            width: 300px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          "
        >
          <b>{{ productData.title }}</b>
        </div>
        <el-tag
          type="danger"
          size="small"
          style="font-weight: bold; margin-top: 4px"
        >
          {{ productData.itemId }}</el-tag
        ><img
          src="@/components/lazada/images/fuzhi_o.png"
          width="18"
          @click="copy(productData.itemId)"
        /><br />
        <el-tag
          type="warning"
          size="small"
          style="font-weight: bold; margin-top: 4px"
        >
          {{ productData.storeSubSku }}</el-tag
        ><img
          src="@/components/lazada/images/fuzhi_o.png"
          width="18"
          @click="copy(productData.storeSubSku)"
        />
        <div style="font-weight: bold; color: #d9001b; margin-top: 4px">
          {{ productData.currency }} {{ productData.specialPrices }}
        </div>
        <!-- </el-row> -->
      </el-col>
    </el-row>
    <hr />
    <el-row>
      <el-col :span="12">
        <span class="color-9B">在线库存 {{ productData.available }}</span> |
        90天销量
        {{ productData.ninetySales }}
      </el-col>
      <el-col :span="12" class="text-align-right">
        <el-button size="small" @click="productInfo(productData.url)"
          >详情</el-button
        >
        <el-button type="danger" size="small" @click="sendProduct(productData)"
          >发送</el-button
        >
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import lazadaChat from '@/store/lazadaChat/store';
  import { sendMessage } from '@/api/lazada/index';
  export default {
    props: {
      productData: {
        type: Object,
        default: () => {}
      }
    },
    setup() {
      const { state } = lazadaChat();
      return {
        state
      };
    },
    data() {
      return {};
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
      sendProduct(item) {
        item.templateId = 10006;
        item.sessionId = this.state.currentSession;
        item.storeAcctId = this.state.currentStoreAcctId;
        // 发送消息
        sendMessage(item).then((res) => {
          if (res.code !== '0000') {
            this.$message.error(res.msg);
          }
        });
      },
      copy(copyText) {
        let url = copyText;
        let oInput = document.createElement('input');
        oInput.value = url;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象;
        document.execCommand('Copy'); // 执行浏览器复制命令
        this.$message({
          message: '复制成功',
          type: 'success'
        });
        oInput.remove();
      },
      productInfo(url) {
        window.open(url, '_blank');
      }
    }
  };
</script>

<style scoped>
  @import url('@/components/lazada/css/common.css');
  .text-align-right {
    text-align: right;
  }

  .color-9B {
    color: #9b9b9b;
  }

  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
