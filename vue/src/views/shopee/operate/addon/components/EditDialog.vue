<template>
  <div class="editdialog_wrapper">
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="1000px"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        v-loading="dialogLoading"
        :model="formData"
        :label-width="110"
        :rules="formRule"
        size="default"
      >
        <el-form-item label="店铺" prop="storeAcctId">
          <el-select
            v-model="formData.storeAcctId"
            filterable
            :disabled="checkedRow?.editType === 'edit'"
          >
            <el-option
              v-for="item in initData.storeList"
              :key="item.id"
              :label="item.storeAcct"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="开始时间"
            :disabled-date="disabledDate"
            :disabled="
              formData?.promotionStatus === 'ongoing' &&
              checkedRow?.editType === 'edit'
            "
            format="YYYY-MM-DD HH:mm:ss"
            :default-time="new Date(2000, 1, 1, 0, 0, 0)"
          />
          <span
            v-if="
              formData?.promotionStatus !== 'ongoing' &&
              checkedRow?.editType !== 'edit'
            "
            class="ml12"
            >请输入比当前至少晚1小时的时间。</span
          >
        </el-form-item>
        <el-form-item label="活动结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="结束时间"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD HH:mm:ss"
            :default-time="new Date(2000, 1, 1, 23, 59, 59)"
          />
          <span class="ml12"
            >请输入比开始时间晚1小时<span v-if="checkedRow?.editType !== 'edit'"
              >且少于3个月的时间</span
            >。</span
          >
        </el-form-item>
        <el-form-item label="活动名称" prop="addOnDealName">
          <el-input
            v-model="formData.addOnDealName"
            :maxlength="25"
            :precision="0"
            show-word-limit
            type="text"
          />
        </el-form-item>
        <el-form-item label="活动类型" prop="autoRenew"
          ><el-radio-group v-model="formData.autoRenew">
            <el-radio :value="0">单次活动</el-radio>
            <el-radio :value="1">连续活动</el-radio>
          </el-radio-group></el-form-item
        >
        <el-form-item label="选择优惠方式" prop="promotionType">
          <el-radio-group
            v-model="formData.promotionType"
            :disabled="checkedRow?.editType === 'edit'"
          >
            <el-radio
              v-if="
                !(
                  checkedRow?.editType === 'edit' &&
                  formData.promotionType === 1
                )
              "
              :value="0"
              >加购折扣</el-radio
            >
            <el-radio
              v-if="
                !(
                  checkedRow?.editType === 'edit' &&
                  formData.promotionType === 0
                )
              "
              :value="1"
              >赠品满最低消费</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="formData.promotionType === 0"
          label="限购数量"
          prop="promotionPurchaseLimit"
          :min="0"
        >
          <el-input-number
            v-model="formData.promotionPurchaseLimit"
            :disabled="
              checkedRow?.editType === 'edit' &&
              formData?.promotionStatus === 'ongoing'
            "
            :precision="0"
            :min="1"
            :max="100"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.promotionType === 1"
          label="最低消费金额"
          prop="purchaseMinSpend"
          :disabled="formData?.promotionStatus === 'ongoing'"
        >
          <div>{{ currency }}</div>
          <el-input-number
            v-model="formData.purchaseMinSpend"
            :disabled="
              checkedRow?.editType === 'edit' && formData.promotionType === 1
            "
            :precision="2"
            :min="0.01"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.promotionType === 1"
          label="单次赠品数量"
          prop="perGiftNum"
          :disabled="formData?.promotionStatus === 'ongoing'"
        >
          <el-input-number
            v-model="formData.perGiftNum"
            :disabled="
              checkedRow?.editType === 'edit' && formData.promotionType === 1
            "
            :precision="0"
            :min="1"
            :max="50"
          />
        </el-form-item>

        <el-form-item label="主商品" prop="mainItemIdListStr">
          <div>
            上限100个，已添加<span class="editdialog_text_success">{{
              mainItemList.length
            }}</span
            >个
          </div>
          <el-input
            v-model="formData.mainItemIdListStr"
            placeholder="请输入itemId,用逗号分隔"
            show-word-limit
            :rows="4"
            type="textarea"
            @blur="commonDivideCommaNum($event)"
        /></el-form-item>
        <el-form-item
          label="加购商品"
          prop="variIds"
          class="editdialog_addprod"
        >
          <div>
            无数量限制，已添加<span class="editdialog_text_success">{{
              subItemList.length
            }}</span
            >个
          </div>
          <div
            v-if="formData.promotionType === 0"
            class="editdialog_addprod_operate"
          >
            <div style="display: flex">
              <div>
                <el-select v-model="discountObj.discountType">
                  <el-option value="grofit" label="毛利率" />
                  <el-option value="discount" label="加购折扣" />
                </el-select>
                <el-input-number
                  v-model="discountObj.discount"
                  :precision="2"
                  controls-position="right"
                /><span>%</span>
              </div>
              <div class="ml10 editdialog_addprod_mount">
                <span>限购数量</span>
                <el-input-number
                  v-model="discountObj.subItemLimit"
                  :precision="0"
                  controls-position="right"
                  :min="0"
                /><el-button
                  type="primary"
                  size="small"
                  :loading="multiApplyLoading"
                  @click="handleApply"
                  >应用</el-button
                >
              </div>
            </div>
            <div class="ml10 editdialog_addprod_variid">
              <el-input
                v-model="vraiIdAddStr"
                placeholder="请输入variId或itemId,用逗号分割"
                @blur="commonDivideCommaNum($event)"
              />
              <el-button type="primary" size="small" @click="handleBatchAdd"
                >一键添加</el-button
              >
              <el-button type="danger" size="small" @click="handleBatchDel"
                >删除</el-button
              >
            </div>
          </div>
          <el-input
            v-if="formData.promotionType === 1"
            v-model="formData.subItemListStr"
            placeholder="请输入variId,用逗号分隔"
            show-word-limit
            :rows="4"
            type="textarea"
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <div v-if="formData.promotionType === 0" class="editdialog_table">
          <vxe-table
            ref="tableRef"
            :data="tableData"
            :height="400"
            border
            show-overflow
            :row-config="{ isCurrent: true, isHover: true }"
            :column-config="{ resizable: true }"
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column field="modelId" title="variId"></vxe-column>
            <vxe-column field="itemId" title="itemId"></vxe-column>
            <vxe-column field="discountPrice" title="现价">
              <template #default="{ row }"
                >{{ row.discountPrice }}{{ currency }}</template
              >
            </vxe-column>
            <vxe-column field="promoInputPrice" width="330">
              <template #header>
                <div class="table_promoInputPrice_header">
                  <span>加购价格</span>
                  <el-select
                    v-model="addOnpRriceObj.calculType"
                    class="ml05"
                    filterable
                  >
                    <el-option value="+" label="+" />
                    <el-option value="-" label="-" />
                    <el-option value="*" label="*" />
                    <el-option value="=" label="=" />
                  </el-select>
                  <el-input-number
                    v-model="addOnpRriceObj.calculNum"
                    controls-position="right"
                    :precision="2"
                  />
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleApplypromoInputPrice"
                    >一键应用</el-button
                  >
                </div>
              </template>
              <template #default="{ row }">
                <div class="table_promoInputPrice_cell">
                  <el-input-number
                    v-model="row.promoInputPrice"
                    :precision="2"
                    controls-position="right"
                    @blur="handleCalculateDiscount(row)"
                  /><span class="ml10">{{ currency }}</span>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="discount" title="加购折扣" width="130">
              <template #default="{ row }">
                <div style="display: flex; align-items: center">
                  <el-input-number
                    v-model="row.discount"
                    controls-position="right"
                    :precision="2"
                    @blur="handleCalculatepromoInputPrice(row)"
                  />
                  <span>%</span>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="time" title="限购数量" width="120">
              <template #header>
                <div><span class="fRed">*</span> 限购数量</div>
              </template>
              <template #default="{ row }">
                <el-input-number
                  v-model="row.subItemLimit"
                  controls-position="right"
                  :precision="0"
                  :min="1"
                  :max="1000000"
                />
              </template>
            </vxe-column>
            <vxe-column title="操作" width="80">
              <template #default="{ row }">
                <el-button type="danger" size="small" @click="handleDelete(row)"
                  >删除</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave(formRef)"
          >保存</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 报错提示 -->
    <FailDialog
      v-model="failVisible"
      :fail-data="failData"
      @close-dialog-by-save="closeDialogBySave"
    />
  </div>
</template>

<script setup>
  import { ref, reactive, watch, computed } from 'vue';
  import { commonDivideCommaNum } from '@/utils/divide';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import {
    queryInfoApi,
    queryListInfoApi,
    addNewApi,
    updateApi,
    getPriceByGrossProfitRateApi
  } from '@/api/shopee/addon';
  import { getStoreListApi } from '@/api/shopee/common';
  import { getSiteListApi } from '@/api/common';
  import { throttle } from 'lodash-es';
  import { EDit_TYPE_OBJ } from '../config';
  import FailDialog from './FailDialog.vue';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRow: {
      type: Object,
      default: () => {}
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleSearch', 'updateRow']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const title = ref();
  const initData = reactive({
    storeList: [],
    siteCurrencyObj: {}
  });
  // 默认选择加购折扣
  let formData = ref({ promotionType: 0 });
  const formRef = ref();

  const validateStartTime = (rule, value, callback) => {
    const { promotionStatus, endTime } = formData.value;
    if (!value) {
      callback(new Error('请选择活动开始时间'));
    } else {
      if (
        promotionStatus === 'ongoing' &&
        props?.checkedRow?.editType === 'edit'
      ) {
        callback();
      } else {
        const _startTime = new Date(value).getTime();
        const curRime = Date.now();
        if (_startTime - curRime < 3600 * 1000) {
          callback(new Error('活动开始时间需要比当前时间至少晚1小时的时间'));
        } else if (
          endTime &&
          new Date(endTime).getTime() - _startTime < 3600 * 1000
        ) {
          callback(new Error('活动结束时间需要比开始时间至少晚1小时'));
        }
        callback();
      }
    }
  };
  const validateEndTime = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请选择活动结束时间'));
    } else {
      const _endTime = new Date(value).getTime();
      const { startTime } = formData.value;
      if (startTime) {
        const _startTime = new Date(startTime).getTime();
        if (_endTime - _startTime < 3600 * 1000) {
          callback(new Error('活动结束时间需要比开始时间至少晚1小时'));
        } else if (props?.checkedRow?.editType === 'edit') {
          callback();
        } else if (_endTime - _startTime > 90 * 24 * 3600 * 1000) {
          callback(new Error('活动时间不超过3个月'));
        }
      }
      callback();
    }
  };
  const formRule = reactive({
    storeAcctId: [{ required: true, trigger: 'change', message: '请选择店铺' }],
    startTime: [
      {
        required: true,
        trigger: 'change',
        validator: validateStartTime
      },
      {
        required: true,
        trigger: 'blur',
        validator: validateStartTime
      }
    ],
    endTime: [
      {
        required: true,
        trigger: 'change',
        validator: validateEndTime
      },
      {
        required: true,
        trigger: 'blur',
        validator: validateEndTime
      }
    ],
    addOnDealName: [
      { required: true, trigger: 'blur', message: '请输入活动名称' }
    ],
    autoRenew: [
      { required: true, trigger: 'change', message: '请选择活动类型' }
    ],
    promotionType: [
      { required: true, trigger: 'change', message: '请选择优惠类型' }
    ],
    promotionPurchaseLimit: [
      { required: true, trigger: 'blur', message: '请输入限购数量' }
    ],
    purchaseMinSpend: [
      { required: true, trigger: 'blur', message: '请输入最低消费金额' }
    ],
    perGiftNum: [
      { required: true, trigger: 'blur', message: '请输入单次赠品数量' }
    ]
  });

  const disabledDate = (time) => {
    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
  };
  const discountObj = ref({});

  const tableData = ref([]);
  const tableRef = ref();
  const mainItemList = computed(
    () =>
      formData.value?.mainItemIdListStr
        ?.replaceAll('，', ',')
        .split(',')
        .filter((item) => (Number(item) || item == 0) && item !== '') || []
  );
  const subItemList = computed(() => {
    if (formData.value.promotionType === 0) {
      return tableRef.value?.getTableData()?.fullData || [];
    }
    return formData.value.subItemListStr
      ? formData.value.subItemListStr.split(',')
      : [];
  });
  const vraiIdAddStr = ref();
  const addOnpRriceObj = ref({});
  const currency = ref();

  const dialogLoading = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        dialogLoading.value = true;
        title.value =
          EDit_TYPE_OBJ[props.checkedRow?.editType] || EDit_TYPE_OBJ.add;
        if (props.checkedRow?.editType === 'add') {
          Promise.all([getStoreListApi(), getSiteListApi('shopee')])
            .then((res) => {
              initData.storeList = res[0].data;
              res[1].data.forEach((item) => {
                initData.siteCurrencyObj[item.code] = item.currency;
              });
            })
            .catch((err) => console.log('err :>> ', err))
            .finally(() => {
              dialogLoading.value = false;
            });
        } else {
          Promise.all([
            getStoreListApi(),
            getSiteListApi('shopee'),
            queryInfoApi(props.checkedRow.addOnDealId)
          ])
            .then((res) => {
              initData.storeList = res[0].data;
              res[1].data.forEach((item) => {
                initData.siteCurrencyObj[item.code] = item.currency;
              });
              formData.value = res[2].data;
              formData.value.startTime = new Date(formData.value.startTime);
              formData.value.endTime = new Date(formData.value.endTime);

              if (res[2].data?.promotionType === 1) {
                formData.value.subItemListStr = (
                  res[2].data?.subItemList.map((item) => item.modelId) || []
                ).join();
              } else {
                tableData.value = res[2].data?.subItemList.map((item) => ({
                  ...item,
                  discount:
                    ((item.discountPrice - item.promoInputPrice) /
                      item.discountPrice) *
                    100
                }));
              }
              // 点击复制按钮，进入复制加购优惠界面。店铺字段清空
              if (props.checkedRow?.editType === 'copy') {
                formData.value.storeAcctId = null;
              }
            })
            .catch((err) => console.log('err :>> ', err))
            .finally(() => {
              dialogLoading.value = false;
            });
        }
      } else {
        formRef.value.resetFields();
        formData.value = { promotionType: 0 };
        addOnpRriceObj.value = {};
        discountObj.value = {};
        vraiIdAddStr.value = '';
        tableData.value = [];
        tableRef.value = null;
      }
    }
  );

  // // 币种
  watch(
    () => formData.value.storeAcctId,
    (val, oldVal) => {
      if (val !== oldVal) {
        const curSite =
          initData.storeList.filter((item) => item.id === val)[0]?.salesSite ||
          '';
        currency.value = initData.siteCurrencyObj[curSite] || '';
      }
    }
  );

  const multiApplyLoading = ref(false);
  const handleApply = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    const { subItemLimit, discountType, discount } = discountObj.value;
    if (!subItemLimit && (!discountType || !discount)) return;
    const tableList = tableRef.value?.getTableData()?.fullData;
    let checkedObj = {};
    try {
      // 定价公式
      multiApplyLoading.value = true;
      if (discountType === 'grofit' && discount) {
        const { data: _checkedList } = await getPriceByGrossProfitRateApi({
          grossProfitRate: discount / 100,
          list: checkedList.map((item) => ({ variId: item.modelId }))
        });
        _checkedList.forEach((item) => {
          const _discount =
            ((item.currPrice - item.newCurrPrice) / item.currPrice) * 100;
          checkedObj[item.variId] =
            _discount.toFixed(2) + '_' + item.newCurrPrice;
        });
      } else {
        checkedList.forEach((item) => {
          let promoInputPrice = null;
          if (discountType === 'discount' && discount) {
            promoInputPrice = (1 - discount / 100) * item.discountPrice;
          }
          checkedObj[item.modelId] =
            (discount || item.discount) +
            '_' +
            (promoInputPrice ? promoInputPrice.toFixed(2) : '');
        });
      }
      const _tableData = tableList.map((item) => {
        if (checkedObj[item.modelId]) {
          return {
            ...item,
            discount:
              Number(checkedObj[item.modelId].split('_')[0]) || item.discount,
            promoInputPrice:
              Number(checkedObj[item.modelId].split('_')[1]) ||
              item.promoInputPrice,
            subItemLimit: subItemLimit || item.subItemLimit
          };
        }
        return item;
      });
      tableRef.value?.reloadData(_tableData);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      multiApplyLoading.value = false;
    }
  };
  const handleBatchAdd = async () => {
    if (!vraiIdAddStr.value) return ElMessage.warning('请输入variId');
    const { storeAcctId } = formData.value;
    if (!storeAcctId) return ElMessage.warning('请选择店铺');
    // if (subItemList.value.length === 100)
    //   return ElMessage.warning('加购商品上限100个');
    if (vraiIdAddStr.value) {
      let _variIdList = subItemList.value.map((item) => item.modelId);
      // 去除重复值
      let productIdList = [];
      vraiIdAddStr.value
        .split(',')
        .map(Number)
        .forEach((item) => {
          if (!_variIdList.includes(item)) {
            productIdList.push(item);
          }
        });
      const { data } = await queryListInfoApi({
        storeAcctId,
        productIdList,
        addOnDealId: formData.value.addOnDealId
      });
      const tableData = tableRef.value?.getTableData()?.fullData || [];
      const originModeldList = tableData.map((item) => item.modelId);
      // // 最高添加100个
      // const addData = data.slice(0, 100 - subItemList.value.length);
      data.forEach((item) => {
        // Todo 同一个item_id的vari_id显示在一起
        if (!originModeldList.includes(item.modelId)) {
          let index = tableData.findIndex(
            (elem) => elem.itemId === item.itemId
          );
          // index行插入
          tableRef.value.insertAt(
            {
              ...item,
              promoInputPrice: item.discountPrice,
              currency: currency.value,
              discount: 0
            },
            index
          );
        }
      });
    }
  };
  const handleBatchDel = () => {
    tableRef.value.removeCheckboxRow();
  };
  const handleDelete = (row) => {
    tableRef.value.remove(row);
  };
  const handleApplypromoInputPrice = () => {
    if (
      addOnpRriceObj.value.calculType &&
      addOnpRriceObj.value.calculNum !== null
    ) {
      const checkedList = tableRef.value?.getCheckboxRecords();
      if (!checkedList.length) return ElMessage.warning('请选择数据');
      const tableList = tableRef.value?.getTableData()?.fullData;
      const checkedObj = {};
      checkedList.forEach((item) => {
        const curpromoInputPrice = calculatepromoInputPrice(
          addOnpRriceObj.value.calculType,
          addOnpRriceObj.value.calculNum,
          item.promoInputPrice
        );
        const curDiscount =
          (item.discountPrice - curpromoInputPrice) / item.discountPrice || '';
        checkedObj[item.modelId] = curpromoInputPrice + '_' + curDiscount * 100;
      });
      const _tableData = (tableList || []).map((item) => {
        if (checkedObj[item.modelId]) {
          return {
            ...item,
            promoInputPrice: Number(checkedObj[item.modelId].split('_')[0]),
            discount: Number(checkedObj[item.modelId].split('_')[1])
          };
        }
        return item;
      });
      tableRef.value?.reloadData(_tableData);
    }
  };
  const calculatepromoInputPrice = (calculType, calculNum, val) => {
    if (calculType === '+') {
      return val + calculNum;
    } else if (calculType === '-') {
      return val - calculNum;
    } else if (calculType === '*') {
      return val * calculNum;
    } else if (calculType === '=') {
      return calculNum;
    }
  };

  // 加购折扣 影响加购价格
  const handleCalculatepromoInputPrice = (row) => {
    row.promoInputPrice = (1 - row.discount / 100) * row.discountPrice;
  };
  const handleCalculateDiscount = (row) => {
    row.discount = Number(
      (
        ((row.discountPrice - row.promoInputPrice) / row.discountPrice) *
        100
      ).toFixed(2) || ''
    );
  };
  // DZYL2L16
  const failVisible = ref(false);
  const failData = ref();
  const saveLoading = ref(false);
  const handleSave = throttle(async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        let res = {};
        saveLoading.value = true;
        try {
          const obj = await filterSearchParams();
          // 限购数量必填数值范围1-1000000
          let subItemLimitTag = false;
          if (obj.promotionType === 0) {
            subItemLimitTag = obj.subItemList.some(
              (item) =>
                item.subItemLimit === undefined ||
                item.subItemLimit < 1 ||
                item.subItemLimit > 1000000
            );
          }
          if (subItemLimitTag)
            return ElMessage.warning('限购数量是必填项,且数值范围1-1000000');
          // 主商品限制100个itemId
          if (obj.mainItemList.length > 100)
            return ElMessage.warning(
              `主商品上限数量是100，已添加了${obj.mainItemList.length},超过上限`
            );
          if (props.checkedRow.editType !== 'edit') {
            res = await addNewApi(obj);
          } else {
            if (
              props.checkedRow?.editType === 'edit' &&
              formData.value.promotionType === 1 &&
              formData?.value.promotionStatus === 'ongoing'
            ) {
              delete obj.purchaseMinSpend;
              delete obj.promotionPurchaseLimit;
            }
            res = await updateApi(obj);
          }
          if (res.data.success) {
            const mainItemFailList = (res.data?.mainItemList || []).filter(
              (item) => !item.success
            );
            const subItemFailList = (res.data?.subItemList || []).filter(
              (item) => !item.success
            );
            const _failData = {
              mainItemFailList,
              subItemFailList
            };
            if (mainItemFailList.length || subItemFailList.length) {
              failVisible.value = true;
              failData.value = _failData;
            } else {
              ElMessage.success(res.msg || '操作成功');
              closeDialogBySave();
            }
          } else {
            ElMessageBox.alert(res.data.failMessage, '报错提示', {
              confirmButtonText: '关闭',
              type: 'error'
            });
          }
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          saveLoading.value = false;
        }
      } else {
        console.log('error submit!', fields);
      }
    });
  }, 1000);
  const filterSearchParams = async () => {
    let obj = {};
    // 活动时间
    obj.startTime = new Date(formData.value.startTime).getTime();
    obj.endTime = new Date(formData.value.endTime).getTime();
    // 主商品
    obj.mainItemList = mainItemList.value.map((item) => ({ itemId: item }));
    // 加购商品
    obj.subItemList = [];
    if (subItemList.value.length) {
      if (formData.value.promotionType === 0) {
        const tableList = tableRef.value?.getTableData()?.fullData;
        if (tableList.length) {
          obj.subItemList = tableList || [];
        }
      } else if (formData.value.promotionType === 1) {
        //赠品满最低消费
        const _subItemList = await queryListInfoApi({
          storeAcctId: formData.value.storeAcctId,
          addOnDealId: formData.value.addOnDealId,
          productIdList: subItemList.value
        });
        obj.subItemList = (_subItemList?.data || []).map((item) => ({
          itemId: item.itemId,
          modelId: item.modelId
        }));
      }
    }
    const params = { ...formData.value, ...obj };
    if (params.promotionType === 0) {
      delete params.purchaseMinSpend;
      delete params.perGiftNum;
    } else {
      delete params.promotionPurchaseLimit;
    }
    if (props.checkedRow.editType === 'copy') {
      delete params.id;
    }
    delete params.subItemNum;
    delete params.mainItemNum;
    return params;
  };
  const closeDialogBySave = () => {
    emits('handleSearch');
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
