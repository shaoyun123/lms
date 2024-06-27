<template>
  <el-dialog
    v-model="showRegulation"
    title="规则"
    width="650"
    class="regulation-layer"
    draggable
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="regulation-layer">
      <el-form
        ref="regulationFormRef"
        :model="regulationForm"
        :rules="regulationRules"
        label-width="107px"
      >
        <el-form-item label="平台" prop="platCode">
          <el-select
            v-model="regulationForm.platCode"
            placeholder="请选择"
            filterable
            class="layer-select"
          >
            <el-option
              v-for="item in platformList"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-radio-group v-model="regulationForm.isSale" @change="changeSale">
            <el-radio :value="true">在售</el-radio>
            <el-radio :value="false">停售</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group
            v-model="regulationForm.ruleType"
            @change="changeType"
          >
            <el-radio value="根据库存标零补货">根据库存标零补货</el-radio>
            <el-radio
              value="根据缺货流程标零补货"
              :disabled="regulationForm.isSale == false"
            >
              根据缺货流程标零补货
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="仓库" prop="stockLocation">
          <el-select
            v-model="regulationForm.stockLocation"
            class="layer-select"
            prop="stockLocation"
          >
            <el-option
              v-for="item in warehouseArr"
              :key="item.id"
              :label="item.warehouseName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="预计可用库存"
          class="layer-select-input"
          prop="stockTypeValue"
        >
          <div class="opts">
            <el-select v-model="regulationForm.preAvailableStockType">
              <el-option label="不含在途" value="preAvailableStock" />
              <el-option
                v-if="regulationForm.ruleType == '根据库存标零补货'"
                label="含在途"
                value="preAvailableStockAll"
              />
            </el-select>
            <z-input-number
              v-model="regulationForm.stockTypeValue"
              :max="3"
              class="layer-number-input"
              prop="stockTypeValue"
            />
            <!-- <el-input
              v-model="regulationForm.stockTypeValue"
              :max="3"
              type="number"
              class="layer-number-input"
              prop="stockTypeValue"
              @mousewheel.prevent
            /> -->
          </div>
          <div class="tips">
            补货是&gt;参数值,标零是≤参数值。如果设置为负值,修改为可用库存不生效。
          </div>
        </el-form-item>
        <el-form-item
          v-if="isShow"
          label="预计到货天数"
          prop="estimateArrivalDay"
        >
          <el-input v-model="regulationForm.estimateArrivalDay" />
          <div class="tips">
            <p>补货是&lt;参数值,标零是≥参数值。</p>
            <p>其他默认标零条件:未到货&采购/整合/开发找不到</p>
          </div>
        </el-form-item>
        <el-form-item label="当前在线数量≤" prop="onlineStock">
          <z-input-number
            v-model="regulationForm.onlineStock"
            :min="0"
            class="layer-number-input"
            prop="onlineStock"
          />
          <!-- <el-input
            v-model="regulationForm.onlineStock"
            :min="1"
            type="number"
            class="layer-number-input"
            prop="onlineStock"
            @mousewheel.prevent
          /> -->
          <div class="tips">
            <p>1. 仅对补货有效。</p>
            <p>2. 标零固定在线数量!=0。</p>
            <p>3. 设置为可用库存固定!=预计可用库存。</p>
          </div>
        </el-form-item>
        <el-form-item label="在线数量修改为" prop="newOnlineStock">
          <z-input-number
            v-model="regulationForm.newOnlineStock"
            :min="1"
            class="layer-number-input"
            prop="newOnlineStock"
          />
          <!-- <el-input
            v-model="regulationForm.newOnlineStock"
            :min="1"
            type="number"
            class="layer-number-input"
            prop="newOnlineStock"
            @mousewheel.prevent
          /> -->
          <div class="tips">
            <p>修改在线数量不能≤当前在线数量(ebay不适用)。</p>
          </div>
        </el-form-item>
        <el-form-item
          v-if="showStock"
          label="预计可用库存≤"
          prop="maxPreAvailableStock"
        >
          <ZInputNumber
            v-if="!regulationForm.isSale"
            v-model="regulationForm.maxPreAvailableStock"
            :max="maxStockTypeValue"
            class="layer-stock"
            prop="maxPreAvailableStock"
            oninput="value=value.replace(/^([0-9-]\d*)?.*$/,'$1')"
          />
          <ZInputNumber
            v-if="regulationForm.isSale"
            v-model="regulationForm.maxPreAvailableStock"
            :min="0"
            :max="maxStockTypeValue"
            class="layer-stock"
            prop="maxPreAvailableStock"
          />
          <!-- <el-input
            v-model="regulationForm.maxPreAvailableStock"
            :min="0"
            :max="maxStockTypeValue"
            type="number"
            class="layer-stock"
            prop="maxPreAvailableStock"
            @mousewheel.prevent
          /> -->
          <span>
            时，修改在线数量为预计可用库存数量(ebay不适用)。(是否含在途由前面配置)
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="regulationForm.remark"
            type="textarea"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="regulation-layer-footer">
        <el-button type="primary" @click="saveHandle">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineProps, computed, defineEmits, ref, watch } from 'vue';
  import {
    getPlatform,
    saveOrUpdateSysTimingTaskParamNew,
    getAllWarehouses
  } from '@/api/publishs/sysTimingTaskParamNew';
  import { ElMessage } from 'element-plus';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  //#region 组件传值
  const emits = defineEmits(['close', 'update:isVisible', 'save']);
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    // 规则信息
    regulationInfo: {
      type: Object,
      default: () => {}
    }
  });

  const showStock = ref(true);
  const showRegulation = computed({
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
  //#endregion

  //#region 弹框渲染
  const regulationForm = computed(() => {
    return props.regulationInfo;
  });
  const platformList = ref([]);
  const warehouseArr = ref([]);
  //根据接口获取平台
  getPlatform().then((res) => {
    platformList.value = res.data;
  });
  //根据接口获取仓库
  getAllWarehouses().then((res) => {
    warehouseArr.value = res.data;
  });
  //监听状态变化
  let maxStockTypeValue = ref(3);
  watch(
    () => regulationForm.value.isSale,
    (newVal) => {
      if (newVal === true) {
        maxStockTypeValue.value = 100;
      } else {
        //无穷大
        maxStockTypeValue.value = Infinity;
      }

      if (
        newVal === '根据缺货流程标零补货' ||
        regulationForm.value.stockTypeValue < 0
      ) {
        showStock.value = false;
      } else {
        showStock.value = true;
      }
    },
    { immediate: true }
  );
  //监听类型变化
  let isShow = ref(false);
  watch(
    () => regulationForm.value.ruleType,
    (newVal) => {
      if (newVal === '根据库存标零补货') {
        regulationForm.value.estimateArrivalDay = '';
        isShow.value = false;
      } else {
        isShow.value = true;
      }

      if (
        newVal === '根据缺货流程标零补货' ||
        regulationForm.value.stockTypeValue < 0
      ) {
        showStock.value = false;
      } else {
        showStock.value = true;
      }
    },
    { immediate: true }
  );
  //#endregion

  watch(
    () => regulationForm.value.stockTypeValue,
    (newVal) => {
      if (
        newVal >= 0 &&
        regulationForm.value.ruleType !== '根据缺货流程标零补货'
      ) {
        showStock.value = true;
      } else {
        showStock.value = false;
      }
    },
    { immediate: true }
  );

  const changeType = (val) => {
    if (val == '根据缺货流程标零补货') {
      regulationForm.value.preAvailableStockType = 'preAvailableStock';
    } else {
      regulationForm.value.preAvailableStockType = '';
    }
  };

  const changeSale = (val) => {
    regulationForm.value.maxPreAvailableStock = '';
    if (!val) {
      regulationForm.value.ruleType = '根据库存标零补货';
    }
  };

  //表单校验
  const regulationFormRef = ref(null);
  const regulationRules = ref({
    platCode: [
      {
        required: true,
        message: '请选择平台',
        trigger: 'change'
      }
    ],
    stockLocation: [
      {
        required: true,
        message: '请选择仓库',
        trigger: 'change'
      }
    ],
    stockTypeValue: [
      {
        required: true,
        message: '请输入库存类型值',
        trigger: 'change'
      }
    ],
    onlineStock: [
      {
        required: true,
        message: '请输入在线数量',
        trigger: 'change'
      }
    ],
    newOnlineStock: [
      {
        required: true,
        message: '请输入修改在线数量',
        trigger: 'change'
      }
    ],
    estimateArrivalDay: [
      {
        required: true,
        message: '请输入预计到货天数',
        trigger: 'change'
      }
    ],
    maxPreAvailableStock: [
      {
        required: true,
        message: '请输入预计可用库存(商品为在售状态时 需填0或者正整数)',
        trigger: 'change'
      }
    ]
  });
  //保存弹框数据
  const saveHandle = () => {
    //校验表单
    regulationFormRef.value.validate((valid) => {
      if (valid) {
        if (regulationForm.value.preAvailableStockType == '') {
          return ElMessage.warning('请选择预计可用库存是否含在途');
        }

        if (
          regulationForm.value.newOnlineStock <=
          regulationForm.value.onlineStock
        ) {
          return ElMessage.warning(
            '在线数量修改为不允许小于等于当前在线数量！'
          );
        }
        if (
          regulationForm.value.maxPreAvailableStock <
            regulationForm.value.stockTypeValue &&
          regulationForm.value.ruleType === '根据库存标零补货'
        ) {
          return ElMessage.warning(
            '预计可用库存≤时的配置值不能小于预计可用库存！'
          );
        }
        // ebay 平台的 根据缺货流程标零补货 预计可用库存不含在途 不能为正数
        if (
          regulationForm.value.platCode === 'ebay' &&
          regulationForm.value.ruleType === '根据缺货流程标零补货' &&
          regulationForm.value.preAvailableStockType === 'preAvailableStock' &&
          regulationForm.value.stockTypeValue > 0
        ) {
          return ElMessage.warning('预计可用库存不含在途不能为正数！');
        }
        //获取仓库名称
        let currentWarehouse = warehouseArr.value.find(
          (item) => item.id === regulationForm.value.stockLocation
        );
        let stockLocationName = currentWarehouse
          ? currentWarehouse.warehouseName
          : '';
        let preAvailableStockType = regulationForm.value.preAvailableStockType; //类型
        let stockTypeValue = regulationForm.value.stockTypeValue; //类型值
        let obj = {
          [preAvailableStockType]: stockTypeValue,
          stockLocationName: stockLocationName
        };
        if (preAvailableStockType == 'preAvailableStock') {
          // 不含在途
          regulationForm.value.preAvailableStockAll = '';
        }
        if (preAvailableStockType == 'preAvailableStockAll') {
          // 含在途
          regulationForm.value.preAvailableStock = '';
        }
        // if (
        //   regulationForm.value.isSale &&
        //   regulationForm.value.maxPreAvailableStock === 0 &&
        //   regulationForm.value.stockTypeValue >= 0 &&
        //   regulationForm.value.ruleType === '根据库存标零补货'
        // ) {
        //   return ElMessage.warning('在售商品的预计可用库存必须为正整数!');
        // }
        if (!showStock.value) {
          delete regulationForm.value.maxPreAvailableStock;
        }
        saveOrUpdateSysTimingTaskParamNew({
          ...regulationForm.value,
          ...obj
        }).then((res) => {
          if (res.code === '0000') {
            showRegulation.value = false;
            //清空表单
            regulationFormRef.value.resetFields();
            //elmentui提示
            ElMessage({
              message: '保存成功',
              type: 'success'
            });
            //触发父组件搜索+关闭弹窗
            emits('close');
            emits('save');
          }
        });
      } else {
        return false;
      }
    });
  };
</script>

<style lang="scss" scoped>
  .regulation-layer {
    max-height: 700px;
    overflow-y: auto;
    .regulation-layer-footer button:first-child {
      margin-right: 10px;
    }
    .layer-select,
    .layer-number-input {
      width: 100%;
    }
    .layer-select-input {
      .opts {
        display: flex;
        width: 100%;
      }
    }
    .layer-stock {
      width: 80px;
      display: inline;
      margin-right: 10px;
    }
  }
</style>
