<template>
  <div class="lazadaAutoReplyDetail">
    <el-dialog
      v-model="showExport"
      title="详情"
      width="25%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form
        ref="formRef"
        v-loading="dialogLoading"
        :model="formData"
        :label-width="120"
      >
        <div v-if="formData.autoReplyType == 2" class="warnTxt">
          <p>差评场景提示：</p>
          <p>1、查询的是lazada产品评分表中一个月内的订单数据</p>
          <p>
            2、针对一个订单下有多个listing的情况，“评论内容是否为空”这个参数，若用于判断的数据有多条（即有多条星数一致的数据），所有数据都无评论算作评论为空，若部分有评论则算作评论不为空
          </p>
        </div>
        <div v-if="formData.autoReplyType == 3" class="warnTxt">
          <p>要好评场景提示：</p>
          <p>1、查询时间为1个月内，并且更新时间为48小时以上的订单</p>
          <p>
            2、自动过滤掉overall
            rating不为空的数据，若一个订单下有多个listing，只要其中一个listing的overall
            rating不为空，则会过滤该订单
          </p>
          <p>3、自动过滤掉仓库少发、拆分、销售换货的订单</p>
        </div>
        <div v-if="formData.autoReplyType == 4" class="warnTxt">
          <p>reply好评固定条件提醒：</p>
          <p>1、获取的是lazada产品评分表一个月内，评论内容不为空的listing</p>
          <p>2、自动过滤掉仓库少发、拆分、销售换货的订单</p>
        </div>
        <div v-if="formData.autoReplyType == 6" class="warnTxt">
          <p>COD订单签收提醒固定条件提醒：</p>
          <p>1、自动过滤掉仓库少发、拆分、销售换货的订单</p>
        </div>
        <el-form-item label="回复类型" prop="autoReplyType">
          <el-select
            v-model="formData.autoReplyType"
            placeholder="请选择"
            filterable
            clearable
            :disabled="formData.id"
            required
          >
            <el-option
              v-for="(val, key) in replyType"
              :key="val"
              :label="key"
              :value="val"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="salesSite">
          <el-select
            v-model="formData.salesSite"
            placeholder="请选择"
            filterable
            clearable
            :disabled="formData.id"
            required
          >
            <el-option
              v-for="item in salesSite"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.autoReplyType == 1" prop="vals">
          <template #label>
            <el-select
              v-model="formData.keys"
              placeholder="请选择"
              filterable
              clearable
              required
            >
              <el-option
                v-for="item in ['延迟天数≥', '截止天数≤']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
          <el-input v-model="formData.vals" placeholder="请输入正整数" />
        </el-form-item>
        <el-form-item
          v-if="formData.autoReplyType == 1"
          label="仓库订单状态"
          prop="orderProcessStatusList"
        >
          <el-select
            v-model="formData.orderProcessStatusList"
            placeholder="请选择"
            :class="formData.orderProcessStatusList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="formData.orderProcessStatusList.length > 1"
                type="info"
                >已选{{ formData.orderProcessStatusList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="(val, key) in orderType"
              :key="val"
              :label="key"
              :value="val"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.autoReplyType == 2 || formData.autoReplyType == 4"
          label="评论星星数"
          prop="ratingStarList"
        >
          <el-select
            v-model="formData.ratingStarList"
            placeholder="请选择"
            :class="formData.ratingStarList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.ratingStarList.length > 1" type="info"
                >已选{{ formData.ratingStarList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in [1, 2, 3, 4, 5]"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.autoReplyType == 2"
          label="评论内容是否为空"
          prop="emptyComment"
        >
          <el-select
            v-model="formData.emptyComment"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            formData.autoReplyType == 2 ||
            formData.autoReplyType == 3 ||
            formData.autoReplyType == 4 ||
            formData.autoReplyType == 5 ||
            formData.autoReplyType == 6
          "
          label="平台订单状态"
          prop="platOrderStatusList"
        >
          <el-select
            v-model="formData.platOrderStatusList"
            placeholder="请选择"
            :class="formData.platOrderStatusList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.platOrderStatusList.length > 1" type="info"
                >已选{{ formData.platOrderStatusList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in lazadaOrderType"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.autoReplyType == 6"
          label="物流信息title"
          prop="logisticsTitle"
        >
          <el-input
            v-model="formData.logisticsTitle"
            placeholder="多个词用双竖线‘||’隔开，单词之间为或的关系"
          />
        </el-form-item>
        <el-form-item label="话术" prop="verbalTrick">
          <el-input
            v-model="formData.verbalTrick"
            type="textarea"
            placeholder="请填写站点对应语种"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" :disabled="dialogLoading" @click="save"
            >保存</el-button
          >
          <el-button v-if="!formData.id" @click="handleReset">清空</el-button>
          <el-button :disabled="dialogLoading" @click="handleClose"
            >关闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, computed, onMounted, toRefs } from 'vue';
  import { ElMessage } from 'element-plus';
  // import { ElMessage, ElMessageBox } from 'element-plus';

  import { addOrUpdateRule } from '@/api/lazada/autoreply';
  const props = defineProps({
    // 是否显示弹窗
    isVisible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: () => {}
    },
    salesSite: {
      type: Array,
      default: () => []
    },
    replyType: {
      type: Array,
      default: () => []
    },
    orderType: {
      type: Array,
      default: () => []
    },
    lazadaOrderType: {
      type: Array,
      default: () => []
    }
  });
  const { salesSite, detailData, replyType, orderType, lazadaOrderType } =
    toRefs(props);
  const formData = ref({
    ratingStarList: [],
    orderProcessStatusList: [],
    platOrderStatusList: []
  });
  const showExport = computed(() => {
    return props.isVisible;
  });

  //   获取仓库订单状态---获取平台订单状态
  onMounted(async () => {
    if (detailData.value && detailData.value.id) {
      formData.value = { ...deepCopy(detailData.value) };
      if (formData.value.delayDays) {
        formData.value.keys = '延迟天数≥';
        formData.value.vals = formData.value.delayDays;
      } else if (formData.value.deadlineDays) {
        formData.value.keys = '截止天数≤';
        formData.value.vals = formData.value.deadlineDays;
      }
    }
  });
  const emits = defineEmits(['close', 'submit']);
  const handleClose = (val) => {
    emits('close', val);
  };

  // 深拷贝
  function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = deepCopy(obj[key]); //递归复制
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }
  // 保存
  const dialogLoading = ref(false);
  const save = async () => {
    try {
      if (
        formData.value.salesSite == '' ||
        formData.value.autoReplyType == ''
      ) {
        return ElMessage.warning('回复类型和站点必填');
      }
      if (formData.value.vals && formData.value.vals != '') {
        if (
          formData.value.vals < 1 ||
          String(formData.value.vals).indexOf('.') > -1
        ) {
          return ElMessage.warning('延迟天数或截止天数请输入正整数');
        }
      }
      // '延迟天数≥', '截止天数≤'
      if (formData.value.keys == '延迟天数≥') {
        formData.value.delayDays = formData.value.vals;
        formData.value.deadlineDays = '';
      } else if (formData.value.keys == '截止天数≤') {
        formData.value.deadlineDays = formData.value.vals;
        formData.value.delayDays = '';
      } else if (formData.value.vals != '' && formData.value.keys == '') {
        return ElMessage.warning('请选择延迟天数或截止天数');
      }
      dialogLoading.value = true;
      let { code, msg } = await addOrUpdateRule(formData.value);
      if (code == '0000') {
        handleClose(true);
        ElMessage.success(msg);
      }
      dialogLoading.value = false;
    } catch (err) {
      dialogLoading.value = false;
    }
  };
  // 清空
  const formRef = ref();
  const handleReset = () => {
    formRef.value.resetFields();
  };
</script>
<style lang="scss" scoped>
  .lazadaAutoReplyDetail {
    :deep(.el-dialog__body) {
      padding-top: 0px !important;
    }
    :deep(.el-select) {
      width: 100%;
    }
    :deep(.el-date-editor--time) {
      width: 100%;
    }
  }

  .warnTxt {
    color: #aaa;
    margin-bottom: 10px;
  }
</style>
