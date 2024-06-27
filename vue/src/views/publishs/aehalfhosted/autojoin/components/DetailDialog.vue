<template>
  <div class="detail_wrapper">
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :width="900"
      :close-on-click-modal="
        checkedRow?.operationType === 'view' ? true : false
      "
      :align-center="true"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :label-width="180"
        :rules="formRule"
        scroll-to-error
        size="default"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="formData.ruleName" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            :rows="2"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="true">已启用</el-radio>
            <el-radio :value="false">已停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加入日期" prop="executionWeekTime">
          <el-checkbox-group v-model="formData.executionWeekTime">
            <el-checkbox
              v-for="item in PUBLISH_WEEK_TIME"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="preAvlDayType">
          <template #label>
            <el-select v-model="formData.preAvlDayType" filterable>
              <el-option label="预计可售天数(部分属性)" :value="1" />
              <el-option label="预计可售天数(全部属性)" :value="2" />
            </el-select>
          </template>
          <el-form-item prop="preAvlDayMin">
            <el-input-number
              v-model="formData.preAvlDayMin"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="大于等于"
            />
          </el-form-item>
          <span class="divide-line">-</span>
          <el-form-item prop="preAvlDayMax">
            <el-input-number
              v-model="formData.preAvlDayMax"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="小于等于"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item prop="preAvailableStockPart">
          <template #label>
            <el-select v-model="formData.preAvailableStockPart" filterable>
              <el-option label="部分属性" :value="1" />
              <el-option label="全部属性" :value="2" />
            </el-select>
          </template>
          <el-form-item prop="preAvailableStockType">
            <el-select v-model="formData.preAvailableStockType" filterable>
              <el-option label="预计可用库存含在途大于" :value="1" />
              <el-option label="预计可用库存不含在途大于" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item prop="preAvailableStockNum">
            <el-input-number
              v-model="formData.preAvailableStockNum"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="请输入整数"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item prop="logisAttrListType">
          <template #label>
            <el-select v-model="formData.logisAttrListType" filterable>
              <el-option label="商品物流属性(与)" :value="1" />
              <el-option label="商品物流属性(或)" :value="2" />
            </el-select>
          </template>
          <MultiSelect
            v-model="formData.logisAttrList"
            :option-obj="{
              optionList: initList.logisAttrEnums
            }"
          />
        </el-form-item>
        <el-form-item label="刊登时间" prop="createDays">
          <!-- listingTimeStart
          listingTimeEnd -->
          <el-date-picker
            v-model="formData.time"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="-"
          />
        </el-form-item>
        <el-form-item prop="costType">
          <template #label>
            <el-select v-model="formData.costType" filterable>
              <el-option label="价格(￥CNY)" :value="1" />
              <el-option label="价格($USD)" :value="2" />
            </el-select>
          </template>
          <el-form-item prop="costMin">
            <el-input-number
              v-model="formData.costMin"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="大于等于"
            />
          </el-form-item>
          <span class="divide-line">-</span>
          <el-form-item prop="costMax">
            <el-input-number
              v-model="formData.costMax"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="小于等于"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item prop="saleType">
          <template #label>
            <el-select v-model="formData.saleType" filterable>
              <el-option label="速卖通销量" :value="1" />
              <el-option label="公司销量" :value="2" />
              <el-option label="公司销量(美国)" :value="3" />
            </el-select>
          </template>
          <el-form-item prop="saleNumType">
            <el-select v-model="formData.saleNumType" filterable>
              <el-option label="7天" :value="1" />
              <el-option label="30天" :value="2" />
              <el-option label="60天" :value="3" />
              <el-option label="90天" :value="4" />
              <el-option label="180天" :value="5" />
            </el-select>
          </el-form-item>
          <el-form-item prop="saleNumMin">
            <el-input-number
              v-model="formData.saleNumMin"
              :min="0"
              :step="1"
              placeholder="大于等于"
            />
          </el-form-item>
          <span class="divide-line">-</span>
          <el-form-item prop="saleNumMax">
            <el-input-number
              v-model="formData.saleNumMax"
              :min="0"
              :step="1"
              placeholder="小于等于"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="加入顺序" required>
          <el-form-item prop="sortBy">
            <el-select v-model="formData.sortBy" filterable clearable>
              <el-option label="刊登时间" :value="1" />
              <el-option label="义乌仓库库存可售" :value="2" />
              <el-option label="7天销量（速卖通）" :value="3" />
              <el-option label="30天销量（速卖通）" :value="4" />
              <el-option label="60天销量（速卖通）" :value="5" />
              <el-option label="90天销量（速卖通）" :value="6" />
              <el-option label="180天销量（速卖通） " :value="7" />
              <el-option label="7天销量（公司）" :value="8" />
              <el-option label="30天销量（公司）" :value="9" />
              <el-option label="60天销量（公司）" :value="10" />
              <el-option label="90天销量（公司）" :value="11" />
              <el-option label="180天销量（公司） " :value="12" />
              <el-option label="7天销量（美国）" :value="13" />
              <el-option label="30天销量（美国）" :value="14" />
              <el-option label="60天销量（美国）" :value="15" />
              <el-option label="90天销量（美国）" :value="16" />
              <el-option label="180天销量（美国）" :value="17" />
            </el-select>
          </el-form-item>
          <el-form-item prop="sortByType">
            <el-select v-model="formData.sortByType" filterable>
              <el-option label="正序" :value="1" />
              <el-option label="倒序" :value="2" />
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="默认条件">
          <p>
            来源半托管在线商品-可加入 商品状态=在线
            在售状态=在售+停售且预计可用库存含在途>0
          </p>
        </el-form-item>
        <h1>不处理条件</h1>
        <el-form-item label="不加入商品SKU" prop="notDealSku">
          <el-input
            v-model="formData.notDealSku"
            placeholder="支持多个，逗号分隔"
          />
        </el-form-item>
        <el-form-item label="不加入product_id" prop="notProduct">
          <el-input
            v-model="formData.notProduct"
            placeholder="支持多个，逗号分隔"
          />
        </el-form-item>
      </el-form>
      <template v-if="checkedRow?.operationType !== 'view'" #footer>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave(formRef)"
          >保存</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { editRuleApi, addNewRuleApi } from '@/api/publishs/aeautojoin';
  import { PUBLISH_WEEK_TIME } from '../config';
  import { ElMessage } from 'element-plus';
  import { shortcuts } from '@/api/common';
  import MultiSelect from '@/components/MultiSelect/index.vue';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRow: {
      type: Object,
      default: () => {}
    },
    initList: {
      type: Object,
      default: () => {}
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'getCreatorList'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const title = computed(() => {
    if (props.checkedRow?.operationType === 'edit') {
      return '编辑规则';
    } else if (props.checkedRow?.operationType === 'view') {
      return '查看规则';
    }
    return '新增规则';
  });

  const formData = ref({});
  const formRef = ref();

  //#region  校验
  // 若两侧框均填写，需左侧框输入值小于等于右侧框
  const validateRange = (start, end, callback) => {
    if (
      start !== undefined &&
      start !== null &&
      end !== undefined &&
      end !== null
    ) {
      if (start > end) {
        callback(new Error('需左侧框输入值小于等于右侧框'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const validatePreAvlDayMin = (rule, value, callback) => {
    const { preAvlDayMax } = formData.value;
    validateRange(value, preAvlDayMax, callback);
  };
  const validatePreAvlDayMax = (rule, value, callback) => {
    const { preAvlDayMin } = formData.value;
    validateRange(preAvlDayMin, value, callback);
  };
  const validateCostMin = (rule, value, callback) => {
    const { costMax } = formData.value;
    validateRange(value, costMax, callback);
  };
  const validateCostMax = (rule, value, callback) => {
    const { costMin } = formData.value;
    validateRange(costMin, value, callback);
  };
  const validateSaleNumMin = (rule, value, callback) => {
    const { saleNumMax } = formData.value;
    validateRange(value, saleNumMax, callback);
  };
  const validateSaleNumMax = (rule, value, callback) => {
    const { saleNumMin } = formData.value;
    validateRange(saleNumMin, value, callback);
  };

  const formRule = ref({
    ruleName: [
      { required: true, trigger: 'blur', message: '请输入规则名称' },
      {
        required: true,
        trigger: 'change',
        message: '请输入规则名称'
      }
    ],
    status: {
      required: true,
      trigger: 'change',
      message: '请选择状态'
    },
    executionWeekTime: {
      required: true,
      trigger: 'change',
      message: '请选择刊登日期'
    },
    orderField: {
      required: true,
      trigger: 'change',
      message: '请选择获取顺序'
    },
    // 若两侧框均填写，需左侧框输入值小于等于右侧框
    preAvlDayMin: [
      { trigger: 'blur', validator: validatePreAvlDayMin },
      {
        trigger: 'change',
        validator: validatePreAvlDayMin
      }
    ],
    preAvlDayMax: [
      { trigger: 'blur', validator: validatePreAvlDayMax },
      {
        trigger: 'change',
        validator: validatePreAvlDayMax
      }
    ],
    costMin: [
      { trigger: 'blur', validator: validateCostMin },
      {
        trigger: 'change',
        validator: validateCostMin
      }
    ],
    costMax: [
      { trigger: 'blur', validator: validateCostMax },
      {
        trigger: 'change',
        validator: validateCostMax
      }
    ],
    saleNumMin: [
      { trigger: 'blur', validator: validateSaleNumMin },
      {
        trigger: 'change',
        validator: validateSaleNumMin
      }
    ],
    saleNumMax: [
      { trigger: 'blur', validator: validateSaleNumMax },
      {
        trigger: 'change',
        validator: validateSaleNumMax
      }
    ]
  });

  //#endregion 校验

  onMounted(async () => {
    formData.value = JSON.parse(
      JSON.stringify({
        preAvailableStockType: 1,
        orderField: 1,
        ...props.checkedRow,
        devType: props.checkedRow.devType
          ? props.checkedRow.devType.split(',')
          : [],
        prodAttrList: props.checkedRow.prodAttrList
          ? props.checkedRow.prodAttrList.split(',')
          : [],
        logisAttrList: props.checkedRow.logisAttrList
          ? props.checkedRow.logisAttrList.split(',')
          : []
      })
    );
  });

  const saveLoading = ref(false);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        saveLoading.value = true;
        try {
          let res = null;
          let params = getParams();
          if (props.checkedRow?.operationType === 'new') {
            res = await addNewRuleApi(params);
            emits('getCreatorList');
          } else {
            res = await editRuleApi(params);
          }
          ElMessage.success(res.msg);
          emits('handleSearch');
          dialogVisible.value = false;
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          saveLoading.value = false;
        }
      } else {
        console.log('error submit!', fields);
      }
    });
  };

  const getParams = () => {
    let params = { ...formData.value };
    if (params.executionWeekTime) {
      params.executionWeekTime = params.executionWeekTime.join(',');
    }
    if (params.categoryIdList) {
      let categoryIdList = params.categoryIdList.map((item) => {
        if (Array.isArray(item)) {
          return item[item.length - 1];
        }
        return item;
      });

      params.categoryIdList = categoryIdList.join(',');
    }
    if (params.devType) {
      params.devType = params.devType.join();
    }
    if (params.logisAttrList) {
      params.logisAttrList = params.logisAttrList.join();
    }
    if (params.prodAttrList) {
      params.prodAttrList = params.prodAttrList.join();
    }
    if (params.time && params.time.length != 0) {
      const ruleTimeList = params.time.map((item) => {
        return new Date(item).getTime();
      });
      [params.listingTimeStart, params.listingTimeEnd] = ruleTimeList;
    } else {
      params.listingTimeStart = null;
      params.listingTimeEnd = null;
    }
    return params;
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
