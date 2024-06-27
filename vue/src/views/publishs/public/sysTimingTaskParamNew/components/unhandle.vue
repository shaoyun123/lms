<template>
  <el-dialog
    v-model="showUnhandle"
    :title="title"
    width="75%"
    draggable
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="unhandle-layer">
      <vxe-grid v-bind="gridOptions">
        <template #uh_toolbar_tools>
          <vxe-button status="primary" size="mini" @click="addUhHandle">
            新增
          </vxe-button>
        </template>
        <!-- 店铺 -->
        <template #uh_storeAcctIdStr="{ row }">
          <el-tooltip content="点击复制" placement="bottom">
            <span
              class="overclamp"
              :title="row.storeAcctIdStr"
              @click="copy(row.storeAcctIdStr)"
            >
              {{ row.storeAcctIdStr }}
            </span>
          </el-tooltip>
        </template>
        <!-- 站点 -->
        <template #uh_site="{ row }">
          <span class="overclamp" :title="row.site">{{ row.site }}</span>
        </template>
        <!-- itemid -->
        <template #uh_itemId="{ row }">
          <el-tooltip content="点击复制" placement="bottom">
            <span
              class="overclamp"
              :title="row.itemId"
              @click="copy(row.itemId)"
              >{{ row.itemId }}</span
            >
          </el-tooltip>
        </template>
        <!-- 商品SKU -->
        <template #uh_prodSSku="{ row }">
          <el-tooltip content="点击复制" placement="bottom">
            <span
              class="overclamp"
              :title="row.prodSSku"
              @click="copy(row.prodSSku)"
            >
              {{ row.prodSSku }}
            </span>
          </el-tooltip>
        </template>
        <!-- 商品标签uh_prodTag -->
        <template #uh_prodTag="{ row }">
          <span class="overclamp" :title="row.prodTag">{{ row.prodTag }}</span>
        </template>
        <!-- 备货天数 -->
        <template #uh_daysToShip="{ row }">
          <span class="overclamp">
            {{ getDaysToShipStart(row) }}
          </span>
        </template>
        <!-- 备注 -->
        <template #uh_remark="{ row }">
          <span class="overclamp" :title="row.remark">{{ row.remark }}</span>
        </template>
        <!-- 是否黄钻 -->
        <template #uh_isPromotion="{ row }">
          <span v-if="row.isPromotion == true">是</span>
          <span v-else-if="row.isPromotion == false">否</span>
          <span v-else>全部</span>
        </template>
        <!-- 是否促销SKUuh_isPromoSku -->
        <template #uh_isPromoSku="{ row }">
          <span v-if="row.isPromoSku == true">是</span>
          <span v-else-if="row.isPromoSku == false">否</span>
          <span v-else>全部</span>
        </template>
        <!-- 刊登时间开始uh_listingTimeStart -->
        <template #uh_listingTimeStart="{ row }">
          <span>{{ formatTime(row.listingTimeStart) }}</span>
        </template>
        <!-- 刊登时间结束uh_listingTimeEnd -->
        <template #uh_listingTimeEnd="{ row }">
          <span>{{ formatTime(row.listingTimeEnd) }}</span>
        </template>
        <!-- tk listing 标签 -->
        <template #listingTagIdBtn="{ row }">
          <div>
            <span v-if="row.listingTagFilterType === 1">
              product标签: {{ row.listingTagId }}</span
            >
            <span v-if="row.listingTagFilterType === 2">
              product&sku标签: {{ row.listingTagId }}</span
            >
          </div>
        </template>
        <!-- 操作 -->
        <!-- 操作sttpn_handleBtn -->
        <template #uh_handleBtn="{ row }">
          <vxe-button
            size="mini"
            status="primary"
            type="text"
            class="handle-btn"
            @click="editUhDialogHandle(row)"
          >
            修改
          </vxe-button>
          <vxe-button
            status="danger"
            size="mini"
            type="text"
            class="handle-btn"
            @click="deleteUh(row)"
          >
            删除
          </vxe-button>
          <vxe-button
            status="primary"
            size="mini"
            type="text"
            class="handle-btn"
            @click="logHandle(row)"
          >
            日志
          </vxe-button>
        </template>
      </vxe-grid>
    </div>
    <template #footer>
      <span class="unhandle-layer-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <UhDialog
    v-if="uhDialogVisible"
    :is-visible="uhDialogVisible"
    :uh-dialog-obj="uhDialogObj"
    :plat-code="platCode"
    :is-add="isAdd"
    :title="title"
    :tag-list="tagList"
    @close="uhDialogHandleClose"
    @save="unhandleTableDataHandle"
  />

  <!-- 日志 -->
  <LogDialog v-model="showLogs" :info="currentLogInfo" is-filter-api="true" />
</template>

<script setup>
  import { defineProps, defineEmits, computed, reactive, ref } from 'vue';
  import {
    getIgnoreParam,
    getStore,
    getSiteInfo,
    getProdtags,
    deleteIgnoreParamById
  } from '@/api/publishs/sysTimingTaskParamNew';
  import { getListingTagApi } from '@/api/publishs/tiktokonlineproduct';
  import XEUtils from 'xe-utils';
  import UhDialog from './unhandleDialog.vue';
  import { ElMessage } from 'element-plus';
  import { copy } from '@/utils/common';
  import LogDialog from './LogDialog.vue';

  //使用XEUtils格式化时间
  const formatTime = (time, format = 'yyyy-MM-dd HH:mm:ss') => {
    return XEUtils.toDateString(time, format);
  };

  // 判断备货天数的展示
  const getDaysToShipStart = ({ daysToShipStart, daysToShipEnd }) => {
    const range = [];

    if (
      daysToShipStart !== null &&
      daysToShipStart !== undefined &&
      daysToShipStart !== ''
    ) {
      range.push(daysToShipStart);
    }

    if (
      daysToShipEnd !== null &&
      daysToShipEnd !== undefined &&
      daysToShipEnd !== ''
    ) {
      range.push(daysToShipEnd);
    }

    if (range.length === 2) {
      return `[${range[0]},${range[1]}]`;
    } else if (range.length === 1) {
      if (daysToShipStart === 0 || daysToShipStart) {
        return `≥${range[0]}`;
      } else {
        return `≤${range[0]}`;
      }
    }
    return '';
  };
  const emits = defineEmits(['close', 'update:isVisible']);
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    //接口请求参数
    queryInfo: {
      type: Object,
      default: () => {}
    }
  });
  //弹框渲染
  const title = computed(() => {
    return props.title;
  });
  const showUnhandle = computed({
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

  //处理表格
  const unhandleTableData = ref([]);
  const unhandleTableDataHandle = () => {
    getIgnoreParam(props.queryInfo).then((res) => {
      if (res.code === '0000') {
        unhandleTableData.value = res.data;
      }
    });
  };
  //执行请求函数
  unhandleTableDataHandle();

  let columnArr0 = [
    {
      field: 'storeAcctIdStr',
      title: '店铺',
      slots: {
        default: 'uh_storeAcctIdStr'
      }
    }
  ];

  let columnArr1 = [
    {
      field: 'isPromotion',
      title: '是否黄钻',
      slots: {
        default: 'uh_isPromotion'
      }
    }
  ];

  let columnArr = [
    {
      field: 'isPromoSku',
      title: '是否促销SKU',
      slots: {
        default: 'uh_isPromoSku'
      }
    }
  ];

  let columnArr2 = [
    {
      field: 'site',
      title: '站点',
      slots: {
        default: 'uh_site'
      }
    }
  ];

  let columnArr3 = [
    {
      field: 'listingTimeStart',
      title: '刊登时间开始',
      width: 147,
      slots: {
        default: 'uh_listingTimeStart'
      }
    },
    {
      field: 'listingTimeEnd',
      title: '刊登时间结束',
      width: 147,
      slots: {
        default: 'uh_listingTimeEnd'
      }
    },
    { field: 'prodCreateDays', title: '≤商品创建天数' },
    { field: 'dayNums', title: '≤距离刊登天数' },
    {
      field: 'prodSSku',
      title: '商品SKU',
      slots: {
        default: 'uh_prodSSku'
      }
    },
    {
      field: 'prodTag',
      title: '商品标签',
      slots: {
        default: 'uh_prodTag'
      }
    },
    {
      field: 'itemId',
      title: 'Item ID',
      slots: {
        default: 'uh_itemId'
      }
    }
  ];
  let columnArr4 = [
    {
      field: 'daysToShip',
      title: '备货天数',
      slots: {
        default: 'uh_daysToShip'
      }
    }
  ];
  let columnArr5 = [
    {
      field: 'remark',
      title: '备注',
      slots: {
        default: 'uh_remark'
      }
    },
    {
      title: '操作',
      slots: { default: 'uh_handleBtn' },
      width: 85,
      align: 'center'
    }
  ];
  let columnArr6 = [
    {
      field: 'skuIdListStr',
      title: '店铺sku id'
    }
  ];
  let columnArr7 = [
    {
      width: 120,
      field: 'listingTagId',
      title: 'TikTok在线listing标签',
      slots: { default: 'listingTagIdBtn' }
    }
  ];
  const notPlatCode = ref([
    'ozon',
    'shein自营',
    'lazada',
    'aliexpress',
    'mercado',
    'AE全托管',
    'tiktok',
    'daraz',
    'shopee',
    'walmart'
  ]);

  //设置列展示
  const setColumns = () => {
    if (notPlatCode.value.includes(props.queryInfo.platCode)) {
      if (
        [
          'ozon',
          'shein自营',
          'mercado',
          // 'AE全托管',
          // 'tiktok',
          'shopee',
          'walmart'
        ].includes(props.queryInfo.platCode)
      ) {
        return columnArr0.concat(columnArr3).concat(columnArr5);
      } else if (props.queryInfo.platCode === 'tiktok') {
        return columnArr0
          .concat(columnArr3)
          .concat(columnArr6)
          .concat(columnArr7)
          .concat(columnArr5);
      } else if (props.queryInfo.platCode === 'AE全托管') {
        return columnArr0
          .concat(columnArr3)
          .concat(columnArr6)
          .concat(columnArr5);
      } else if (props.queryInfo.platCode === 'aliexpress') {
        // 标零及设置真实库存不处理条件--aliexpress平台显示备货天数列
        if (title.value == '标零及设置真实库存不处理条件') {
          return columnArr0
            .concat(columnArr2)
            .concat(columnArr3)
            .concat(columnArr4)
            .concat(columnArr5);
        } else {
          return columnArr0
            .concat(columnArr2)
            .concat(columnArr3)
            .concat(columnArr5);
        }
      } else {
        return columnArr0
          .concat(columnArr2)
          .concat(columnArr3)
          .concat(columnArr5);
      }
    } else {
      if (props.queryInfo.platCode === 'wish') {
        return columnArr0
          .concat(columnArr1)
          .concat(columnArr)
          .concat(columnArr3)
          .concat(columnArr5);
      } else if (props.queryInfo.platCode === 'joom') {
        return columnArr0
          .concat(columnArr1)
          .concat(columnArr3)
          .concat(columnArr5);
      } else if (props.queryInfo.platCode === 'ebay') {
        // 标零及设置真实库存不处理条件--aliexpress平台显示备货天数列
        if (title.value == '标零及设置真实库存不处理条件') {
          return columnArr0
            .concat(columnArr2)
            .concat(columnArr3)
            .concat(columnArr4)
            .concat(columnArr5);
        } else {
          return columnArr0
            .concat(columnArr2)
            .concat(columnArr3)
            .concat(columnArr5);
        }
      } else {
        return columnArr0
          .concat(columnArr1)
          .concat(columnArr)
          .concat(columnArr2)
          .concat(columnArr3)
          .concat(columnArr5);
      }
    }
  };
  const gridOptions = reactive({
    border: true,
    height: 500,
    columnConfig: {
      resizable: true
    },
    columns: setColumns(),
    toolbarConfig: {
      custom: true,
      slots: {
        tools: 'uh_toolbar_tools'
      }
    },
    data: unhandleTableData
  });
  //新增功能[根据平台请求接口,同时传递数据给弹框组件]
  const uhDialogVisible = ref(false);
  const dialogStores = ref([]);
  const dialogSites = ref([]);
  const dialogTags = ref([]);
  const uhDialogObj = ref({});
  //获取平台
  const platCode = computed(() => {
    return props.queryInfo.platCode;
  });
  //获取店铺
  getStore(platCode.value).then((res) => {
    if (res.code === '0000') {
      dialogStores.value = res.data;
    }
  });
  //获取商品标签
  getProdtags().then((res) => {
    if (res.code === '0000') {
      dialogTags.value = res.data;
    }
  });

  // 获取tk在线listing标签
  const tagList = ref([]);
  const getTkListingTagList = async () => {
    const { data } = await getListingTagApi({
      headCode: 'TIKTOK_ONLINE_LISTING_TAG'
    });
    tagList.value = data || [];
  };

  //设置新增弹框的数据结构
  const uhDialogForm = ref({});
  //获取站点[如果存在的话]
  if (['lazada', 'amazon', 'ebay', 'daraz'].includes(platCode.value)) {
    getSiteInfo(platCode.value)
      .then((res) => {
        if (res.code === '0000') {
          dialogSites.value = res.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const isAdd = ref(false);
  //新增
  const addUhHandle = () => {
    isAdd.value = true;
    uhDialogForm.value = {
      ruleId: props.queryInfo.id,
      operType: props.queryInfo.operType,
      storeAcctIdList: [], //店铺
      siteList: [], //站点
      tagList: [], //商品标签
      isPromotion: '', //是否黄钻
      isPromoSku: '', //是否促销
      listingTimeStart: '', //刊登时间开始
      listingTimeEnd: '', //刊登时间结束
      prodCreateDays: '', //商品创建天数
      dayNums: '', //刊登天数
      itemId: '', //商品ID
      prodSSku: '', //商品SKU
      daysToShipStart: '', // 备货天数区间
      daysToShipEnd: '',
      remark: '', //备注
      listingTagFilterType: 1, // listing标签类型 默认选择product标签
      listingTagId: ''
    };
    uhDialogObj.value = {
      platCode: platCode.value,
      stores: dialogStores.value,
      sites: dialogSites.value,
      tags: dialogTags.value,
      form: uhDialogForm.value
    };
    if (platCode.value === 'tiktok') {
      getTkListingTagList();
    }
    uhDialogVisible.value = true;
  };
  //修改
  const editUhDialogHandle = (row) => {
    isAdd.value = false;
    let obj = {};

    // 给是否黄钻 是否促销初始值
    if (typeof row.isPromotion !== 'boolean') {
      obj.isPromotion = '';
    }
    if (typeof row.isPromoSku !== 'boolean') {
      obj.isPromoSku = '';
    }

    let storeAcctNameList =
      (row.storeAcctIdStr && row.storeAcctIdStr.split(',')) || [];
    obj.storeAcctIdList = dialogStores.value
      .filter((item) => storeAcctNameList.includes(item.storeAcct))
      .map((item) => item.id);
    obj.siteList = (() => {
      let hasSiteName = (row.site && row.site.split(',')) || [];
      let siteIdArr = [];
      dialogSites.value.forEach((item) => {
        if (hasSiteName.includes(item.name)) {
          siteIdArr.push(item.id);
        }
      });
      return siteIdArr;
    })();
    obj.tagList = (row.prodTag && row.prodTag.split(',')) || [];
    obj.ruleId = props.queryInfo.id;
    obj.listingTimeStart = row.listingTimeStart
      ? formatTime(row.listingTimeStart, 'yyyy-MM-dd')
      : '';
    obj.listingTimeEnd = row.listingTimeEnd
      ? formatTime(row.listingTimeEnd, 'yyyy-MM-dd')
      : '';
    uhDialogForm.value = { ...row, ...obj };
    uhDialogObj.value = {
      platCode: platCode.value,
      stores: dialogStores.value,
      sites: dialogSites.value,
      tags: dialogTags.value,
      form: uhDialogForm.value
    };
    uhDialogVisible.value = true;
    // console.log(row);
  };
  //删除
  const deleteUh = (row) => {
    deleteIgnoreParamById(row.id).then((res) => {
      if (res.code === '0000') {
        unhandleTableDataHandle();
        ElMessage.success('删除成功');
      }
    });
  };
  const uhDialogHandleClose = () => {
    uhDialogVisible.value = false;
  };

  // 查看日志
  const showLogs = ref(false);
  const currentLogInfo = ref({});
  const logHandle = (row) => {
    showLogs.value = true;
    currentLogInfo.value = row;
  };
</script>

<style lang="scss" scoped>
  .unhandle-layer {
    .overclamp {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    :deep(.vxe-button + .vxe-button) {
      margin-left: 0;
    }
    .handle-btn {
      display: block;
    }
  }
</style>
