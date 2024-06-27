<template>
  <el-dialog
    v-model="showDialog"
    :title="`${isAddNow ? '新增' : '修改'}不处理参数`"
    width="40%"
    class="dialog-layer"
    draggable
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-layer">
      <el-form :model="dialogForm" label-width="140px">
        <el-form-item v-show="isShowSite" label="站点">
          <ZSelect v-model="dialogForm.siteList" :items="sites" :num="3" />
        </el-form-item>
        <el-form-item label="店铺">
          <ZSelect
            v-model="dialogForm.storeAcctIdList"
            :items="options"
            :num="3"
          />
        </el-form-item>
        <el-form-item v-if="!notPlatCode.includes(platCode)" label="是否黄钻">
          <el-select
            v-model="dialogForm.isPromotion"
            placeholder="请选择"
            filterable
            class="layer-select"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="!notSalePlatCode.includes(platCode)"
          label="是否促销"
        >
          <el-select
            v-model="dialogForm.isPromoSku"
            placeholder="请选择"
            filterable
            class="layer-select"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <div class="layer-date">
          <el-form-item label="刊登时间开始">
            <el-date-picker
              v-model="dialogForm.listingTimeStart"
              type="date"
              placeholder="选择日期时间"
              value-format="YYYY-MM-DD"
              :shortcuts="shortcuts"
            />
          </el-form-item>
          <el-form-item label="刊登时间结束">
            <el-date-picker
              v-model="dialogForm.listingTimeEnd"
              type="date"
              placeholder="选择日期时间"
              value-format="YYYY-MM-DD"
              :shortcuts="shortcuts"
            />
          </el-form-item>
        </div>
        <el-form-item label="≤商品创建天数">
          <el-input v-model="dialogForm.prodCreateDays" type="number" />
        </el-form-item>
        <el-form-item label="≤距离刊登天数">
          <el-input v-model="dialogForm.dayNums" type="number" />
        </el-form-item>
        <el-form-item label="itemId">
          <el-input
            v-model="dialogForm.itemId"
            placeholder="在线商品的itemID或者物品号,英文逗号分隔"
          />
        </el-form-item>
        <el-form-item v-if="platCode == 'AE全托管'" label="店铺sku id">
          <el-input
            v-model="dialogForm.skuIdListStr"
            placeholder="在线商品的店铺sku id,英文逗号分隔"
          />
        </el-form-item>
        <el-form-item label="商品SKU">
          <el-input
            v-model="dialogForm.prodSSku"
            placeholder="填写基础商品子SKU,英文逗号分隔(要与在线商品映射到的子SKU完全一致,不能带“*”号等后缀)"
          />
        </el-form-item>
        <el-form-item label="商品标签">
          <el-select
            v-model="dialogForm.tagList"
            placeholder="请选择"
            multiple
            clearable
            filterable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            class="layer-select"
          >
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="platCode === 'tiktok'"
          label="TikTok在线listing标签"
        >
          <div class="flex">
            <el-select
              v-model="dialogForm.listingTagFilterType"
              placeholder="请选择"
              style="width: 30%"
            >
              <el-option label="product标签" :value="1" />
              <el-option label="product标签&sku标签" :value="2" />
            </el-select>
            <el-select
              v-model="dialogForm.listingTagId"
              placeholder="请选择"
              class="flex-1"
            >
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item
          v-if="
            pickDaysPlatCode.includes(platCode) &&
            title == '标零及设置真实库存不处理条件'
          "
          label="备货天数"
          class="form_input_width"
        >
          <ZInputNumber
            v-model="dialogForm.daysToShipStart"
            style="width: 49%"
            placeholder=">="
            clearable
            :min="0"
            :precision="0"
          />
          <span class="range_link"> - </span>
          <ZInputNumber
            v-model="dialogForm.daysToShipEnd"
            style="width: 49%"
            placeholder="<="
            clearable
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="dialogForm.remark"
            type="textarea"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-layer-footer">
        <el-button type="primary" @click="saveHandle">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { setIgnoreParam } from '@/api/publishs/sysTimingTaskParamNew';
  import { ElMessage } from 'element-plus';
  import ZSelect from '@/components/ZSelect/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  // 平台是ebay需要展示备货天数
  const pickDaysPlatCode = ref(['ebay', 'aliexpress']);
  //不包含黄钻
  const notPlatCode = ref([
    'ozon',
    'shein自营',
    'lazada',
    'aliexpress',
    'mercado',
    'AE全托管',
    'AE半托管',
    'tiktok',
    'daraz',
    'shopee',
    'walmart'
  ]);
  // 不包含促销
  const notSalePlatCode = ref([
    'ozon',
    'shein自营',
    'lazada',
    'aliexpress',
    'mercado',
    'joom',
    'AE全托管',
    'AE半托管',
    'tiktok',
    'daraz',
    'shopee',
    'walmart'
  ]);
  const emits = defineEmits(['close', 'update:isVisible', 'save']);
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    platCode: {
      type: String,
      default: ''
    },
    uhDialogObj: {
      type: Object,
      default: () => {}
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    tagList: {
      type: Array,
      default: () => []
    }
  });
  const showDialog = computed({
    get() {
      return props.isVisible;
    },
    set(newVal) {
      emits('update:isVisible', newVal);
    }
  });

  // 关闭弹窗
  const handleClose = () => {
    emits('close');
  };
  //数据
  const dialogObj = computed(() => {
    return props.uhDialogObj;
  });

  //是否新增
  const isAddNow = computed(() => {
    return props.isAdd;
  });

  //标题
  const title = computed(() => {
    return props.title;
  });

  const isShowSite = computed(() => {
    return ['lazada', 'amazon', 'ebay', 'daraz'].includes(props.platCode);
  });
  const sites = computed(() => {
    return dialogObj.value.sites;
  });
  const stores = computed(() => {
    return dialogObj.value.stores;
  });
  const options = ref(
    stores.value.map((item) => ({
      id: item.id,
      name: item.storeAcct
    }))
  );
  const tags = computed(() => {
    return dialogObj.value.tags;
  });
  const dialogForm = computed(() => {
    return dialogObj.value.form;
  });
  //日期快捷选项
  const shortcuts = [
    {
      text: '今天',
      value: new Date()
    },
    {
      text: '昨天',
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        return date;
      }
    },
    {
      text: '一周前',
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        return date;
      }
    }
  ];
  //保存
  const saveHandle = () => {
    let obj = {};
    //修改店铺属性
    obj.storeAcctIdStr = dialogForm.value.storeAcctIdList.join(',');
    //修改站点属性
    obj.site = dialogForm.value.siteList.join(',');
    //修改标签属性
    obj.prodTag = dialogForm.value.tagList.join(',');

    // 如果一个参数都不填，不允许保存
    let isDisabledToSubmit = false;
    // 将传递过来已经有值的数据忽略
    const otherKeys = [
      'ruleId',
      'operType',
      'creatorId',
      'createTime',
      'creator',
      'id',
      'modifier',
      'modifierId',
      'modifyTime',
      'status',
      '_X_ROW_KEY',
      'storeAcctIdStr',
      'site',
      'prodTag',
      'isPromotion',
      'isPromoSku',
      'remark' // 所有平台 新增编辑如果只填写'备注'这一项 不让保存
    ];

    const params = { ...dialogForm.value, ...obj };
    Object.keys(params).forEach((key) => {
      if (otherKeys.includes(key)) return;
      const item = dialogForm.value[key];
      const type = typeof item;

      if (type === 'string' && item) isDisabledToSubmit = true;
      if (type === 'number') isDisabledToSubmit = true;
      if (type === 'object' && item && item.length) isDisabledToSubmit = true;
      // 是否促销 是否黄钻 排除 不算作填写
      if (type === 'boolean') isDisabledToSubmit = false;
    });

    if (!isDisabledToSubmit) return ElMessage.warning('请填写表单！');

    if (
      params.daysToShipStart &&
      params.daysToShipEnd &&
      params.daysToShipStart > params.daysToShipEnd
    ) {
      return ElMessage.warning('输入数据有误！');
    }
    setIgnoreParam(params).then((res) => {
      if (res.code === '0000') {
        handleClose();
        emits('save');
      }
    });
  };
</script>

<style lang="scss" scoped>
  .dialog-layer {
    .layer-select {
      width: 100%;
    }
    .layer-date {
      display: flex;
    }
  }
  .range_link {
    margin: 0px 2px;
  }
  .flex {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .flex-1 {
    flex: 1;
  }
</style>
