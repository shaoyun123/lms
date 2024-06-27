<template>
  <div class="app-container sysTimingTaskParamNewContainer">
    <el-card class="common_split_bottom search_card">
      <el-form
        :inline="true"
        :model="sysTimingTaskParamNewForm"
        class="search_form"
      >
        <el-form-item label="平台">
          <el-select
            v-model="sysTimingTaskParamNewForm.platCode"
            placeholder="请选择"
            clearable
            filterable
            @change="changePlatCode"
          >
            <el-option value="" label="请选择" />
            <el-option
              v-for="item in platformList"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="店铺">
          <el-select-v2
            v-model="sysTimingTaskParamNewForm.storeAcctIdList"
            placeholder="请选择"
            :options="storeList"
            style="width: 200px"
            multiple
            collapse-tags
            clearable
            filterable
          >
          </el-select-v2>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select
            v-model="sysTimingTaskParamNewForm.isSale"
            placeholder="请选择"
          >
            <el-option value="" label="请选择" />
            <el-option label="在售" :value="true" />
            <el-option label="停售" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="sysTimingTaskParamNewForm.ruleType"
            placeholder="请选择"
          >
            <el-option value="" label="请选择" />
            <el-option label="根据库存标零补货" value="根据库存标零补货" />
            <el-option
              label="根据缺货流程标零补货"
              value="根据缺货流程标零补货"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sysTimingTaskParamNewFormSubmit">
            查询
          </el-button>
          <el-button @click="resetNewForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div class="card-body">
        <div
          v-if="sysTimingTaskParamNewForm.platCode === 'shein自营'"
          class="list_note"
        >
          <el-icon :size="16"><Warning /></el-icon>
          shein自营平台的标零补货规则不生效，仅不处理条件生效
        </div>
        <div
          v-if="sysTimingTaskParamNewForm.platCode === 'AE全托管'"
          class="list_note"
        >
          <el-icon :size="16"><Warning /></el-icon>
          AE全托管平台的标零补货规则不生效，仅不处理条件生效
        </div>
        <div
          v-if="sysTimingTaskParamNewForm.platCode === 'AE半托管'"
          class="list_note"
        >
          <el-icon :size="16"><Warning /></el-icon>
          AE半拖管平台的标零补货规则不生效，仅不处理条件生效
        </div>
        <vxe-grid v-bind="gridOptions">
          <template #toolbar_tools>
            <el-button
              v-permission="['zeroMarkingAddRule']"
              type="primary"
              size="small"
              @click="addRuleHandle"
            >
              新建规则
            </el-button>
          </template>
          <!-- 商品状态 -->
          <template #sttpn_isSale="{ row }">
            <span v-if="row.isSale">在售</span>
            <span v-else>停售</span>
          </template>
          <!-- 参数sttpn_splicingparams -->
          <template #sttpn_splicingparams="{ row }">
            <div v-if="row.preAvailableStockAll != undefined">
              预计可用库存含在途:{{ row.preAvailableStockAll }}
            </div>
            <div v-else>预计可用库存不含在途:{{ row.preAvailableStock }}</div>
            <div v-if="row.estimateArrivalDay || row.estimateArrivalDay === 0">
              预计到货天数:{{ row.estimateArrivalDay }}
            </div>
            <div>当前在线数量≤:{{ row.onlineStock }}</div>
            <div>设置固定数量:{{ row.newOnlineStock }}</div>
            <div
              v-if="row.maxPreAvailableStock || row.maxPreAvailableStock === 0"
            >
              设置真实数量≤:{{ row.maxPreAvailableStock }}
            </div>
          </template>
          <!-- 标零不处理条件sttpn_markZeroFlag -->
          <template #sttpn_markZeroFlag="{ row }">
            <span v-if="row.markZeroFlag" class="flag_primary">有值</span>
            <span v-else>无值</span>
            <el-button
              v-permission="['zeroNoProcessingCondition']"
              :icon="Edit"
              size="small"
              link
              :type="row.markZeroFlag ? 'success' : ''"
              @click="markZeroFlagHandle(row)"
            >
            </el-button>
          </template>
          <!-- 补货不处理条件sttpn_replenshFlag -->
          <template #sttpn_replenshFlag="{ row }">
            <span v-if="row.replenshFlag" class="flag_primary">有值</span>
            <span v-else>无值</span>
            <el-button
              v-permission="['replenishmentNoProcessingCondition']"
              :icon="Edit"
              link
              size="small"
              :type="row.markZeroFlag ? 'success' : ''"
              @click="replenshFlagHandle(row)"
            >
            </el-button>
          </template>
          <!-- 默认,不可编辑,sttpn_ifDefault -->
          <template #sttpn_ifDefault="{ row }">
            <vxe-checkbox
              v-model="row.ifDefault"
              :checked-value="true"
              :unchecked-value="false"
              disabled
            ></vxe-checkbox>
          </template>
          <!-- 适用店铺sttpn_storeAcctStr -->
          <template #sttpn_storeAcctStr="{ row }">
            <el-tooltip placement="bottom">
              <div
                class="overclamp"
                title="点击复制"
                @click="copy(row.storeAcctStr)"
              >
                {{ row.storeAcctStr }}
              </div>
              <template #content>
                <div class="popper_wrapper">
                  {{ row.storeAcctStr }}
                </div>
              </template>
            </el-tooltip>
          </template>
          <!-- 备注sttpn_remark -->
          <template #sttpn_remark="{ row }">
            <div class="overclamp" :title="row.remark">
              {{ row.remark }}
            </div>
          </template>
          <!-- 最后修改时间 -->
          <template #sttpn_modifyTime="{ row }">
            <div>{{ row.modifier || row.creator }}</div>
            <span>{{ formatTime(row.modifyTime || row.createTime) }}</span>
          </template>
          <!-- 操作sttpn_handleBtn -->
          <template #sttpn_handleBtn="{ row }">
            <el-button
              v-if="!row.ifDefault"
              v-permission="['setDefaultHandle']"
              size="small"
              class="handle-btn"
              link
              type="primary"
              @click="setDefaultHandle(row)"
            >
              设为默认
            </el-button>
            <el-button
              v-permission="['matchStoreHandle']"
              size="small"
              type="success"
              class="handle-btn"
              link
              @click="matchStoreHandle(row)"
            >
              匹配店铺
            </el-button>
            <el-button
              v-permission="['editHandle']"
              size="small"
              type="success"
              class="handle-btn"
              link
              @click="editHandle(row)"
            >
              编辑规则
            </el-button>
            <el-button
              size="small"
              link
              type="success"
              class="handle-btn"
              @click="logHandle(row)"
            >
              日志
            </el-button>
            <el-button
              v-permission="['deleteHandle']"
              size="small"
              link
              type="danger"
              class="handle-btn"
              @click="deleteHandle(row)"
            >
              删除
            </el-button>
          </template>
          <template #pager>
            <!--使用 pager 插槽-->
            <vxe-pager
              v-model:current-page="tablePage.page"
              v-model:page-size="tablePage.limit"
              :page-sizes="[50, 100, 200, 500]"
              :layouts="[
                'Sizes',
                'PrevJump',
                'PrevPage',
                'Number',
                'NextPage',
                'NextJump',
                'FullJump',
                'Total'
              ]"
              :total="tablePage.total"
              @page-change="handlePageChange"
            >
            </vxe-pager>
          </template>
        </vxe-grid>
      </div>
    </el-card>
    <!-- 规则弹框 -->
    <Regulation
      v-if="showRegulation"
      :is-visible="showRegulation"
      :regulation-info="regulationInfo"
      @close="closeRegulation"
      @save="saveAndSearch"
    />
    <!-- 不处理条件弹框 -->
    <Unhandle
      v-if="showUnhandle"
      :is-visible="showUnhandle"
      :query-info="unhandleObj"
      :title="unhandleTitle"
      @close="closeUnhandle"
    />
    <!-- 匹配店铺 -->
    <MatchStore
      v-if="showMatchStore"
      :is-visible="showMatchStore"
      :ms-info="matchStoreObj"
      @close="closeMatchStore"
      @save="saveAndSearch"
    />
    <!-- 日志 -->
    <LogDialog v-model="showLogs" :info="currentLogInfo" />
  </div>
</template>

<script setup name="publishspublicsysTimingTaskParamNew">
  import { reactive, ref, computed } from 'vue';
  import { Edit } from '@element-plus/icons-vue';
  import {
    getPlatform,
    getStore,
    getSysTimingTaskParamNew,
    deleteSysTimingTaskParamNew,
    setDefaultRule
  } from '@/api/publishs/sysTimingTaskParamNew';
  import XEUtils from 'xe-utils';
  import Regulation from './components/regulation.vue';
  import Unhandle from './components/unhandle.vue';
  import MatchStore from './components/matchStore.vue';
  import LogDialog from './components/LogDialog.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { copy } from '@/utils/common';
  import { Warning } from '@element-plus/icons-vue';
  //初始化表单
  const sysTimingTaskParamNewForm = ref({
    platCode: '',
    isSale: '',
    ruleType: '',
    storeAcctIdList: []
  });
  //#region 平台---店铺联动
  //平台数组
  const platformList = reactive([]);
  //店铺数组
  const storeList = ref([]);
  //首先调用接口渲染平台
  getPlatform().then((res) => {
    res.data.forEach((item) => {
      if (item.code) {
        platformList.push(item);
      }
    });
  });

  const changePlatCode = (val) => {
    //调用接口渲染店铺
    getStore(val).then((res) => {
      let data = res.data || [];
      storeList.value = data?.map((item) => ({
        value: item.id,
        label: item.storeAcct
      }));
    });
  };
  //#endregion

  //#region 处理表格
  //表格配置
  const tablePage = reactive({
    total: 0,
    page: 1,
    limit: 50
  });
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 180;
  });
  const gridOptions = reactive({
    border: true,
    // showOverflow: 'tooltip',
    showOverflow: true,
    height: height,
    rowConfig: {
      isHoverRow: true
    },
    toolbarConfig: {
      custom: true,
      slots: {
        tools: 'toolbar_tools'
      }
    },
    loading: false,
    columnConfig: {
      resizable: true
    },
    data: [],
    columns: [
      { field: 'platCode', title: '平台' },
      {
        field: 'isSale',
        title: '商品状态',
        slots: {
          default: 'sttpn_isSale'
        }
      },
      { field: 'ruleType', title: '标零补货类型' },
      { title: '参数', slots: { default: 'sttpn_splicingparams' } },
      {
        field: 'markZeroFlag',
        title: '标零及设置真实库存不处理条件',
        slots: { default: 'sttpn_markZeroFlag' }
      },
      {
        field: 'replenshFlag',
        title: '补货不处理条件',
        slots: { default: 'sttpn_replenshFlag' }
      },
      {
        field: 'ifDefault',
        title: '默认',
        slots: { default: 'sttpn_ifDefault' },
        width: 50,
        align: 'center'
      },
      {
        field: 'storeAcctStr',
        title: '适用店铺',
        slots: { default: 'sttpn_storeAcctStr' },
        width: 150
      },
      {
        field: 'remark',
        title: '备注',
        slots: { default: 'sttpn_remark' },
        width: 150
      },
      {
        field: 'modifyTime',
        title: '最后修改时间',
        slots: { default: 'sttpn_modifyTime' },
        align: 'center'
      },
      {
        title: '操作',
        slots: { default: 'sttpn_handleBtn' },
        width: 85,
        align: 'center'
      }
    ]
  });
  const handlePageChange = ({ currentPage, pageSize }) => {
    tablePage.page = currentPage;
    tablePage.limit = pageSize;
    sysTimingTaskParamNewFormSubmit();
  };
  //查询功能
  const sysTimingTaskParamNewFormSubmit = () => {
    //调用查询接口
    getSysTimingTaskParamNew({
      ...sysTimingTaskParamNewForm.value,
      ...tablePage
    }).then((res) => {
      tablePage.total = res.data.length || 0;
      gridOptions.data = res.data || [];
    });
  };
  const resetNewForm = () => {
    sysTimingTaskParamNewForm.value = {
      platCode: '',
      isSale: '',
      ruleType: '',
      storeAcctIdList: []
    };
  };
  //使用XEUtils格式化时间,去掉秒
  const formatTime = (time) => {
    return XEUtils.toDateString(time, 'yyyy-MM-dd HH:mm');
  };
  //设置默认
  const setDefaultHandle = (row) => {
    const { id, platCode, isSale } = row;
    setDefaultRule({ id, platCode, isSale }).then((res) => {
      // console.log(res);
      if (res.code === '0000') {
        //el-message提示
        ElMessage({
          message: '设置默认成功',
          type: 'success'
        });
        sysTimingTaskParamNewFormSubmit();
      }
    });
  };
  //匹配店铺
  let showMatchStore = ref(false);
  const matchStoreObj = ref({});
  const matchStoreHandle = (row) => {
    const { id, platCode, storeAcctStr } = row;
    matchStoreObj.value = {
      id,
      platCode,
      storeAcctStr
    };
    showMatchStore.value = true;
  };
  const closeMatchStore = () => {
    showMatchStore.value = false;
  };
  //删除
  const deleteHandle = (row) => {
    ElMessageBox.confirm('确定要删除该规则吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const { id } = row;
        deleteSysTimingTaskParamNew(id).then((res) => {
          if (res.code === '0000') {
            //el-message提示
            ElMessage({
              message: '删除成功',
              type: 'success'
            });
            sysTimingTaskParamNewFormSubmit();
          }
        });
      })
      .catch(() => {});
  };
  //#endregion

  //#region 规则弹框
  //规则RuleHandle
  let showRegulation = ref(false);
  let regulationInfo = ref({});
  //新建规则
  const addRuleHandle = () => {
    regulationInfo.value = {
      platCode: '',
      isSale: true,
      ruleType: '根据库存标零补货',
      stockLocation: '', //仓库
      stockLocationName: '', //仓库名称
      preAvailableStockType: 'preAvailableStock', //preAvailableStockAll(含在途),preAvailableStock(不含在途)
      stockTypeValue: 0, //库存类型值
      estimateArrivalDay: '', //预计到货天数
      onlineStock: 1, //当前在线数量
      newOnlineStock: 1, //在线数量修改值
      maxPreAvailableStock: 0, //预计可用库存上限
      remark: '' //备注
    };
    showRegulation.value = true;
  };
  //编辑规则
  const editHandle = (row) => {
    let preAvailableStockType =
      row.preAvailableStock != undefined || row.preAvailableStock != null
        ? 'preAvailableStock'
        : 'preAvailableStockAll';
    let stockTypeValue =
      row.preAvailableStock != undefined || row.preAvailableStock != null
        ? row.preAvailableStock
        : row.preAvailableStockAll;
    let obj = {
      preAvailableStockType: preAvailableStockType,
      stockTypeValue: stockTypeValue
    };
    //赋值
    regulationInfo.value = { ...row, ...obj };
    showRegulation.value = true;
  };
  //关闭规则
  const closeRegulation = () => {
    showRegulation.value = false;
  };
  //触发保存规则/保存不处理条件
  const saveAndSearch = () => {
    sysTimingTaskParamNewFormSubmit();
  };
  //#endregion

  //#region 标零及设置真实库存不处理条件弹框
  let showUnhandle = ref(false);
  let unhandleObj = ref({});
  let unhandleTitle = ref('');
  const closeUnhandle = () => {
    showUnhandle.value = false;
  };
  //标零及设置真实库存不处理条件
  const markZeroFlagHandle = (row) => {
    unhandleTitle.value = '标零及设置真实库存不处理条件';
    let obj = {
      operType: 0,
      page: 1,
      limit: 10000,
      id: row.id,
      platCode: row.platCode
    };
    unhandleObj.value = { ...obj };
    showUnhandle.value = true;
  };

  // 补货不处理条件
  const replenshFlagHandle = (row) => {
    unhandleTitle.value = '补货不处理条件';
    let obj = {
      operType: 1,
      page: 1,
      limit: 10000,
      id: row.id,
      platCode: row.platCode
    };
    unhandleObj.value = { ...obj };
    showUnhandle.value = true;
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
  .sysTimingTaskParamNewContainer {
    :deep(.vxe-checkbox.is--disabled > input:checked + .vxe-checkbox--icon) {
      color: #409eff;
    }
    .card-body {
      position: relative;
      .list_note {
        color: #f56c6c;
        position: absolute;
        z-index: 9;
        top: 10px;
        display: flex;
        align-items: center;
      }
    }
    .overclamp {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    :deep(.vxe-button + .vxe-button) {
      margin-left: 0;
    }
    .handle-btn {
      display: block;
    }
    .flag_primary {
      color: #67c23a;
      font-weight: 700;
    }
  }
  .popper_wrapper {
    max-width: 500px;
    max-height: 500px;
    overflow-y: auto;
    word-break: break-all;
    &::-webkit-scrollbar {
      width: 3px; /* 设置滚动条的宽度 */
    }
    &::-webkit-scrollbar-thumb {
      background-color: #888; /* 设置滚动条滑块的背景颜色 */
      border-radius: 4px; /* 设置滚动条滑块的圆角 */
    }
    &::-webkit-scrollbar-track {
      background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
    }
  }
</style>
