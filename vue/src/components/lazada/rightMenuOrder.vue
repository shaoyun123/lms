<template>
  <div>
    <el-card class="box-card" style="margin: 5px">
      <template #header>
        <div class="clearfix">
          <img src="@/components/lazada/images/dingdan.png" width="18" />
          <span style="font-size: 15px"
            ><b>{{ orderData.platOrderStatus }}</b></span
          >

          <span class="color-9B" style="float: right; padding: 3px 0">
            <!-- {{type[orderData.filterFlag]}} -->
            {{ orderData.allRootStatus }}
          </span>
          <br />
          <span
            >{{ orderData.platOrderId
            }}<label
              ><img
                src="@/components/lazada/images/fuzhi_o.png"
                width="20"
                alt="复制"
                title="复制"
                @click="copy(orderData.platOrderId)"
            /></label>
            <span v-if="orderData.platTags">
              <span
                v-for="(item, index) in orderData.platTags.split(',')"
                :key="index"
              >
                <div
                  v-if="['预售', '二次销售', '平台履约'].includes(item)"
                  style="
                    background-color: #1e9fff;
                    color: #fff;
                    padding: 3px 6px;
                    display: inline-block;
                    border-radius: 4px;
                  "
                >
                  {{ item }}
                </div></span
              >
            </span></span
          >
        </div>
      </template>
      <div>
        <el-row
          v-for="(item, index) in orderData.detailsInfoDto"
          v-show="index < toggleLen ? true : false"
          :key="index"
          style="margin-bottom: 10px"
        >
          <el-col :span="4"><img :src="item.img" width="50" alt="" /> </el-col>
          <el-col :span="14">
            <!-- <el-row> -->
            <div
              style="
                font-size: 16px;
                width: 200px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              "
            >
              <b>{{ item.itemTitle }}</b>
            </div>
            <div class="color-9B">子sku属性：{{ item.itemAttr }}</div>
            <div class="color-9B">
              店铺子SKU：{{ item.storeSubSKu
              }}<label
                ><img
                  src="@/components/lazada/images/fuzhi_o.png"
                  width="20"
                  alt="复制"
                  title="复制"
                  @click="copy(item.storeSubSKu)"
              /></label>
            </div>
            <!-- </el-row> -->
          </el-col>
          <el-col :span="6" class="text-align-right">
            <div>{{ orderData.currency }}</div>
            <div>{{ item.detailOrderAmt }}</div>
            <div>x {{ JSON.parse(item.quantity) }}</div></el-col
          >
        </el-row>
        <el-row
          v-if="
            orderData.detailsInfoDto.length > 2 &&
            orderData.detailsInfoDto.length !== toggleLen
          "
          style="
            text-align: center;
            margin-top: 10px;
            color: #0073bd;
            cursor: pointer;
          "
          @click="toggleOrder(orderData.detailsInfoDto.length)"
        >
          查看全部
        </el-row>
        <el-row
          v-if="
            orderData.detailsInfoDto.length === toggleLen &&
            orderData.detailsInfoDto.length !== 2
          "
          style="
            text-align: center;
            margin-top: 10px;
            color: #0073bd;
            cursor: pointer;
          "
          @click="toggleOrder(2)"
        >
          收起
        </el-row>
        <hr />
        <el-row style="margin-top: 8px">
          <el-col :span="12" class="color-9B"
            ><img
              src="@/components/lazada/images/qianbao.png"
              width="15"
              style="margin: 0 10px"
            />订单金额</el-col
          >
          <el-col
            :span="12"
            class="text-align-right"
            style="color: #d9001b; font-weight: bold"
            >{{ orderData.currency }} {{ orderData.amt }}</el-col
          >
        </el-row>
        <el-row style="margin-top: 8px">
          <el-col :span="12" class="color-9B"
            ><img
              src="@/components/lazada/images/wuliuchaxun.png"
              width="15"
              style="margin: 0 10px"
            />物流信息</el-col
          >
          <el-col :span="12" class="text-align-right">
            <el-popover
              placement="right"
              width="800"
              @show="popFunc(orderData)"
            >
              <h4 style="color: #000">物流详情</h4>
              <div v-if="packageDetailInfoList != ''">
                <el-row
                  v-for="(
                    packageDetailInfoItem, index
                  ) in packageDetailInfoList"
                  :key="index"
                >
                  <el-col :span="12">
                    订单ID：{{ orderData.platOrderId }}<br />
                    Created on
                    {{
                      util.formatDate.format(
                        new Date(JSON.parse(orderData.orderTime)),
                        'yy-MM-dd hh:mm:ss'
                      )
                    }}<br />
                    You have {{ packageDetailInfoList.length }} packages
                    <el-card class="box-card">
                      Package {{ index + 1 }}/{{ packageDetailInfoList.length }}
                      <!-- 已到本地仓 <br />
                    logistic Company <br />
                    1234 <br /> -->
                      Tracking No. <br />
                      {{ packageDetailInfoItem.trackingNumber }}
                    </el-card>
                  </el-col>
                  <el-col
                    :span="12"
                    style="padding-left: 20px; height: 300px; overflow: auto"
                    ><el-timeline>
                      <el-timeline-item
                        v-for="(
                          activity, indexDetail
                        ) in packageDetailInfoItem.logisticDetailInfoList"
                        :key="indexDetail"
                        :timestamp="activity.description"
                      >
                        {{
                          util.formatDate.format(
                            new Date(activity.eventTime),
                            'yy-MM-dd hh:mm:ss'
                          )
                        }}
                      </el-timeline-item>
                    </el-timeline></el-col
                  >
                </el-row>
              </div>
              <template #reference>
                <el-button size="small" type="danger" plain>查看物流</el-button>
              </template>
            </el-popover>
          </el-col>
        </el-row>
        <el-row style="margin-top: 0px">
          <el-col :span="12" class="color-9B"
            ><img
              src="@/components/lazada/images/rili.png"
              width="16"
              style="margin: 0 10px"
            />订单时间</el-col
          >
          <el-col :span="12" class="text-align-right">
            {{
              util.formatDate.format(
                new Date(JSON.parse(orderData.orderTime)),
                'yy-MM-dd hh:mm:ss'
              )
            }}
          </el-col>
        </el-row>
        <el-row style="margin-top: 8px">
          <el-col :span="12" class="color-9B"
            ><img
              src="@/components/lazada/images/rili.png"
              width="16"
              style="margin: 0 10px"
            />OA发货时间</el-col
          >
          <el-col
            v-if="
              orderData.allRootStatus == '已发货' ||
              orderData.allRootStatus == '已归档'
            "
            :span="12"
            class="text-align-right"
            >{{ orderData.allRootShipTime }}</el-col
          >
        </el-row>
        <el-row style="flex-direction: row-reverse">
          <el-button type="danger" size="small" @click="sendOrder(orderData)"
            >发送</el-button
          >
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  import lazadaChat from '@/store/lazadaChat/store';
  import { listOrderTrace, sendMessage } from '@/api/lazada/index';

  export default {
    name: 'Rightmenuorder',
    props: {
      orderData: {
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
      return {
        packageDetailInfoList: [],
        // type: {0: '等待付款', 1: '订单缺货', 2: '订单退货', 3: '订单取消', 4: '其他异常单', 5: '等待派单', 6: '已派单', 20: '未拣货', 22: '未核单', 24: '未包装', 26: '订单缺货_仓库', 28: '缺货待包装', 40: '待发货', 100: '已发货', 200: '已归档'},
        toggleLen: 2 // 子订单显示的条数，默认两条
      };
    },
    methods: {
      // 查看全部
      toggleOrder(len) {
        this.toggleLen = len;
      },
      sendOrder(item) {
        item.templateId = 10007;
        item.sessionId = this.state.currentSession;
        item.storeAcctId = this.state.currentStoreAcctId;
        item.salesSite = this.state.currentSalesSite;
        item.orderId = item.platOrderId;
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
      popFunc(item) {
        let obj = {};
        obj.orderId = item.platOrderId;
        obj.storeAcctId = this.state.currentStoreAcctId;
        obj.salesSite = this.state.currentSalesSite;
        listOrderTrace(obj).then((res) => {
          if (res.code === '0000') {
            if (
              res.data !== undefined &&
              res.data.result !== undefined &&
              res.data.result.module !== undefined
            ) {
              this.packageDetailInfoList =
                res.data.result.module[0].packageDetailInfoList;
            } else {
              this.packageDetailInfoList = '';
            }
          } else {
            this.$message.error(res.msg);
          }
        });
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
