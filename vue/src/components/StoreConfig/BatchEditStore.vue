<template>
  <el-dialog
    width="40%"
    title="批量编辑信息"
    :model-value="showBatchEditDialog"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <div style="margin-bottom: 10px">
      请点击选中要修改的字段，仅非必填支持修改为空
    </div>
    <el-checkbox-group v-model="checkedGroup">
      <el-checkbox
        v-for="(item, index) in checkBoxGroup"
        :key="index"
        style="width: 70px"
        :label="item.field"
        @change="handleCheckBoxGroup"
        >{{ item.name }}</el-checkbox
      >
    </el-checkbox-group>
    <el-form
      ref="batchEditForm"
      :model="batchEditFormData"
      :rules="formRules"
      style="margin-top: 20px"
    >
      <div class="form_item">
        <div
          v-for="(item, index) in basicEditFormItemList"
          :key="index"
          style="width: 50%"
        >
          <el-form-item
            v-if="item.isShow"
            :label="item.labelName"
            :prop="item.contentField"
            :label-width="100"
            :class="[item.contentType === 'inputRange' ? 'form_range' : '']"
            size="default"
          >
            <template v-if="item.contentType === 'inputRange'">
              <el-input
                v-model="batchEditFormData[item.contentField[0]]"
                type="number"
              />
              <div class="range_link">-</div>
              <el-input
                v-model="batchEditFormData[item.contentField[1]]"
                type="number"
              />
            </template>

            <el-input
              v-if="item.contentType === 'input'"
              v-model="batchEditFormData[item.contentField]"
              style="width: 220px"
            ></el-input>
            <el-select
              v-if="item.contentType === 'select'"
              v-model="batchEditFormData[item.contentField]"
              :multiple="item.isMuliple"
              clearable
              filterable
              :collapse-tags="item.isMuliple"
              :class="
                batchEditFormData[item.contentField]?.length > 1
                  ? 'hide_tag'
                  : ''
              "
            >
              <template #prefix>
                <el-tag
                  v-if="
                    batchEditFormData[item.contentField]?.length > 1 &&
                    item.isMuliple
                  "
                  type="info"
                >
                  已选{{
                    batchEditFormData[item.contentField]?.length
                  }}项</el-tag
                >
              </template>
              <el-option
                v-for="(cItem, cIdx) in item.contentOption"
                :key="cIdx"
                :value="cItem.value"
                :label="cItem.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <el-form-item v-if="checkedGroup.includes('remark')" size="default">
        <el-card style="width: 100%" class="remark_card">
          <template #header>
            <div class="card-header">
              <div class="card-header">
                <span style="padding-right: 20px">备注</span>
                <el-radio-group
                  v-model="batchEditFormData.remarkStatus"
                  @change="changeRemarkType"
                >
                  <el-radio value="1">拼接至原备注后</el-radio>
                  <el-radio value="2">覆盖原备注</el-radio>
                  <el-radio value="0">删除原备注</el-radio>
                </el-radio-group>
              </div>
            </div>
          </template>
          <el-input
            v-model="batchEditFormData.remark"
            type="textarea"
            :disabled="remarkDisabled"
            :autosize="{ minRows: 3, maxRows: 6 }"
          ></el-input>
        </el-card>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSave(batchEditForm)">
          保存
        </el-button>
        <el-button @click="closeDialog"> 关闭 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { onMounted, ref, toRefs, reactive } from 'vue';
  import {
    getPersonAndOrgNewApi,
    batchUpdateStoreApi
  } from '@/api/configure/storeconf.js';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    platCode: {
      type: String,
      default: ''
    },
    showBatchEditDialog: {
      type: Boolean,
      default: false
    },
    editInfo: {
      type: Object,
      default: () => {}
    },
    customFormConfig: {
      type: Array,
      default: () => []
    },
    checkBoxGroup: {
      type: Array,
      default: () => []
    },
    storeAcctIdList: {
      type: Array,
      default: () => []
    }
  });

  const emit = defineEmits('close');
  const { showBatchEditDialog } = toRefs(props);

  const checkedGroup = ref([]);
  const remarkDisabled = ref(false);

  onMounted(() => {
    // 默认勾选必填的字段
    checkedGroup.value = props.checkBoxGroup
      .filter((item) => item.required)
      .map((item) => {
        if (item.required) {
          return item.field;
        }
      });

    // 获取下拉框数据 销售 主管 客服 组长
    Promise.allSettled([
      getPersonList('专员', 'salespersonId'),
      getPersonList('主管', 'sellLeaderId'),
      getPersonList('客服', 'customServicerId'),
      getPersonList('组长', 'leaderId')
    ]).then(() => {
      basicEditFormItemList.value.forEach((item) => {
        if (
          [
            'salespersonId',
            'sellLeaderId',
            'customServicerId',
            'leaderId'
          ].includes(item.contentField)
        ) {
          item.contentOption = personInfo[item.contentField];
        }
      });
    });

    basicEditFormItemList.value = basicEditFormItemList.value.concat(
      props.customFormConfig
    );
    basicEditFormItemList.value?.forEach((item) => {
      let allNeedShow = props.checkBoxGroup?.map((v) => v.field);
      if (allNeedShow.includes(item)) {
        item.isShow = true;
      } else {
        item.isShow = false;
      }
    });
    let allRequireEditFields = basicEditFormItemList.value.filter(
      (item) => item.isRequired
    );
    // 校验规则
    allRequireEditFields?.forEach((item) => {
      let obj = {
        required: true,
        trigger: item.trigger,
        message: `请${item.contentType === 'input' ? '填写' : '选择'}${
          item.labelName
        }`
      };
      formRules[item.contentField] = [obj];
    });
  });

  const getPersonList = (role, field) => {
    return new Promise((resolve) => {
      getPersonAndOrgNewApi({
        role: props.platCode + role
      }).then((res) => {
        let data = res.data.filter((item) => item.status);
        data?.forEach((userItem) => {
          userItem.label = userItem.userName;
          userItem.value = userItem.id;
        });
        personInfo[field] = data || [];
        resolve();
      });
    });
  };

  const batchEditFormData = ref({
    remarkStatus: '1',
    remark: ''
  });

  const batchEditForm = ref(null);
  const formRules = reactive({
    salespersonId: [{ required: true, trigger: 'blur', message: '请选择销售' }],
    sellLeaderId: [{ required: true, trigger: 'blur', message: '请选择主管' }]
  });

  // 获取销售1 主管3 客服2 组长4
  const personInfo = reactive({
    salespersonId: [],
    sellLeaderId: [],
    customServicerId: [],
    leaderId: []
  });
  // const personMap = reactive({
  //   1: 'salespersonId',
  //   3: 'sellLeaderId',
  //   2: 'customServicerId',
  //   4: 'leaderId'
  // });

  // 固定的编辑项
  const basicEditFormItemList = ref([
    {
      labelType: 'text',
      labelName: '启用状态',
      contentType: 'select',
      contentField: 'status',
      contentOption: [
        { label: '已启用', value: 1 },
        { label: '已关闭', value: 0 }
      ],
      isShow: false,
      isRequired: true,
      trigger: 'blur'
    },
    {
      labelType: 'text',
      labelName: '销售',
      contentType: 'select',
      contentField: 'salespersonId',
      contentOption: [],
      isShow: false,
      isRequired: true,
      trigger: 'blur'
    },
    {
      labelType: 'text',
      labelName: '主管',
      contentType: 'select',
      contentField: 'sellLeaderId',
      contentOption: [],
      isShow: false,
      isRequired: true,
      trigger: 'blur'
    },
    {
      labelType: 'text',
      labelName: '客服',
      contentType: 'select',
      contentField: 'customServicerId',
      contentOption: [],
      isShow: false,
      trigger: 'blur'
    },
    {
      labelType: 'text',
      labelName: '组长',
      contentType: 'select',
      contentField: 'leaderId',
      contentOption: [],
      isShow: false
    }
  ]);

  // 勾选要编辑的信息
  const handleCheckBoxGroup = () => {
    basicEditFormItemList.value.forEach((item) => {
      item.isShow = checkedGroup.value.includes(item.contentField);
    });
  };

  const changeRemarkType = (val) => {
    if (val === '0') {
      remarkDisabled.value = true;
      batchEditFormData.value.remark = '';
    } else {
      remarkDisabled.value = false;
    }
  };

  const handleSave = async (formEl) => {
    if (!formEl) return;
    if (
      batchEditFormData.value.remarkStatus == '2' &&
      (batchEditFormData.value.remark == undefined ||
        batchEditFormData.value.remark == '')
    ) {
      // 覆盖原备注
      return ElMessage.warning('请输入备注');
    }
    await formEl.validate(async (valid) => {
      if (valid) {
        let params = {};
        checkedGroup.value?.forEach((item) => {
          if (
            [
              'salespersonId',
              'sellLeaderId',
              'customServicerId',
              'leaderId'
            ].includes(item)
          ) {
            //如果勾选了人员角色，但是却没有填充数据，那么就传 -1
            params[item] = batchEditForm.value[item] || -1;
          } else {
            params[item] = batchEditForm.value[item] || '';
          }
        });
        batchEditFormData.value.platCode = props.platCode;
        batchEditFormData.value.storeAcctIdList = props.storeAcctIdList;
        // 根据人员id 获取name
        // 接口要传人员id 还有人员Name
        let roleNameMap = {
          customServicer: 'customServicerId',
          salesperson: 'salespersonId',
          sellLeaderName: 'sellLeaderId',
          leaderName: 'leaderId'
        };
        Object.keys(roleNameMap).forEach((item) => {
          if (batchEditFormData.value[roleNameMap[item]]) {
            batchEditFormData.value[item] =
              personInfo[roleNameMap[item]]?.filter((i) => {
                return i.value === batchEditFormData.value[roleNameMap[item]];
              })[0]?.label || '';
          }
        });
        try {
          const { code } = await batchUpdateStoreApi({
            ...params,
            ...batchEditFormData.value
          });
          if (code === '0000') {
            ElMessage.success('批量编辑成功');
            emit('save');
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  const closeDialog = (val = '') => {
    emit('close', val);
  };
</script>
<style lang="scss" scoped>
  .card-header {
    padding: 0 60px 0 30px;
    display: flex;
    justify-content: space-between;
  }
  .remark_card {
    :deep(.el-card__body) {
      padding: 0 !important;
    }
    :deep(.el-textarea__inner) {
      border: none;
      box-shadow: none;
    }
  }
</style>
