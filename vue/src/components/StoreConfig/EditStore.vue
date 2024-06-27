<template>
  <el-dialog
    width="40%"
    :title="title"
    :model-value="showEditDialog"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <el-form
      ref="editForm"
      :model="editFormData"
      :rules="formRules"
      class="dialog_form"
    >
      <div class="form_item">
        <div
          v-for="(item, index) in basicEditFormItemList"
          :key="index"
          style="width: 50%"
        >
          <el-form-item
            :label="item.labelName"
            :prop="item.contentField"
            :label-width="100"
            :class="[item.contentType === 'inputRange' ? 'form_range' : '']"
            size="default"
          >
            <template v-if="item.contentType === 'inputRange'">
              <el-input
                v-model="editFormData[item.contentField[0]]"
                type="number"
              />
              <div class="range_link">-</div>
              <el-input
                v-model="editFormData[item.contentField[1]]"
                type="number"
              />
            </template>

            <el-input
              v-if="item.contentType === 'textarea'"
              v-model="editFormData[item.contentField]"
              style="width: 200px"
              show-word-limit
              maxlength="50"
              type="textarea"
            ></el-input>
            <el-input
              v-if="item.contentType === 'input'"
              v-model="editFormData[item.contentField]"
              style="width: 200px"
            ></el-input>
            <el-select
              v-if="item.contentType === 'select'"
              v-model="editFormData[item.contentField]"
              :multiple="item.isMuliple"
              clearable
              filterable
              :disabled="item.disabled"
              :collapse-tags="item.isMuliple"
              :class="
                editFormData[item.contentField]?.length > 1 ? 'hide_tag' : ''
              "
            >
              <template #prefix>
                <el-tag
                  v-if="
                    editFormData[item.contentField]?.length > 1 &&
                    item.isMuliple
                  "
                  type="info"
                >
                  已选{{ editFormData[item.contentField]?.length }}项</el-tag
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
      <el-form-item size="default">
        <el-card style="width: 100%" class="remark_card">
          <template #header>
            <div class="card-header">
              <span>备注</span>
            </div>
          </template>
          <el-input
            v-model="editFormData.remark"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
          ></el-input>
        </el-card>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSave(editForm)">
          保存
        </el-button>
        <el-button @click="closeDialog"> 关闭 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { onMounted, reactive, ref, toRefs } from 'vue';
  import {
    getPersonAndOrgNewApi,
    updateStoreApi,
    createStoreApi
  } from '@/api/configure/storeconf.js';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    title: {
      type: String,
      default: '标题'
    },
    action: {
      type: String,
      default: ''
    },
    platCode: {
      type: String,
      default: ''
    },
    showEditDialog: {
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
    }
  });

  const emit = defineEmits('close', 'save');
  const { showEditDialog } = toRefs(props);

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

  const formRules = reactive({});

  onMounted(() => {
    basicEditFormItemList.value = basicEditFormItemList.value.concat(
      props.customFormConfig
    );

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
      // 编辑时 回显数据
      if (props.action === 'edit') {
        let customFormField = basicEditFormItemList.value?.map(
          (item) => item.contentField
        );
        let allFormField = Object.keys(props.editInfo).concat(customFormField);
        allFormField.forEach((item) => {
          editFormData.value[item] = props.editInfo[item];
        });
      }
    });
  });

  const getPersonList = (role, field) => {
    return new Promise((resolve) => {
      getPersonAndOrgNewApi({
        role:
          props.platCode === 'AE半托管'
            ? getAEHalfRoleParams(props.platCode, role)
            : props.platCode + role
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

  // 将半托管角色的相关权限和功能全都合并至速卖通角色
  const getAEHalfRoleParams = (platCode, role) => {
    const plat = 'smt';
    if (platCode === 'AE半托管') {
      if (role === '客服') {
        return plat + role + '专员';
      } else {
        return plat + role;
      }
    }
  };

  const editFormData = ref({});

  const editForm = ref(null);

  // 固定的编辑项
  const basicEditFormItemList = ref([
    {
      labelType: 'text',
      labelName: '店铺名称',
      contentType: 'input',
      contentField: 'storeAcct',
      isRequired: true,
      trigger: 'blur'
    },
    {
      labelType: 'text',
      labelName: '店铺状态',
      contentType: 'select',
      contentField: 'status',
      contentOption: [
        { label: '已启用', value: true },
        { label: '已关闭', value: false }
      ],
      isRequired: true,
      trigger: 'blur'
    },
    {
      labelType: 'text',
      labelName: '销售',
      contentType: 'select',
      contentField: 'salespersonId',
      contentOption: [],
      isRequired: props.platCode !== 'AE半托管' ? true : false,
      trigger: 'blur',
      disabled: props.platCode === 'AE半托管' ? true : false
    },
    {
      labelType: 'text',
      labelName: '主管',
      contentType: 'select',
      contentField: 'sellLeaderId',
      contentOption: [],
      isRequired: props.platCode !== 'AE半托管' ? true : false,
      trigger: 'blur',
      disabled: props.platCode === 'AE半托管' ? true : false
    },
    {
      labelType: 'text',
      labelName: '客服',
      contentType: 'select',
      contentField: 'customServicerId',
      contentOption: [],
      disabled: props.platCode === 'AE半托管' ? true : false
    },
    {
      labelType: 'text',
      labelName: '组长',
      contentType: 'select',
      contentField: 'leaderId',
      contentOption: [],
      disabled: props.platCode === 'AE半托管' ? true : false
    }
  ]);

  let editParamsObj = {
    status: '',
    platCode: '',
    acctBaseId: '',
    acctDetailId: '',
    storeAcct: '',
    salesSite: '',
    salespersonId: '',
    salesperson: '',
    customServicerId: '',
    customServicer: '',
    sellLeaderId: '',
    sellLeaderName: '',
    leaderId: '',
    leaderName: '',
    acctBaseRemark: ''
  };

  let editConfigParams = {};

  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        Object.keys(editParamsObj).forEach((item) => {
          editParamsObj[item] = editFormData.value[item];
        });
        editParamsObj.platCode = props.platCode;
        editParamsObj.acctBaseId = editFormData.value.id;
        editParamsObj.acctBaseRemark = editFormData.value.remark;

        // 根据人员id 获取name
        let roleNameMap = {
          customServicer: 'customServicerId',
          salesperson: 'salespersonId',
          sellLeaderName: 'sellLeaderId',
          leaderName: 'leaderId'
        };

        Object.keys(roleNameMap).forEach((item) => {
          editParamsObj[item] =
            personInfo[roleNameMap[item]]?.filter((i) => {
              return i.value === editFormData.value[roleNameMap[item]];
            })[0]?.label || '';

          editParamsObj[roleNameMap[item]] =
            editFormData.value[roleNameMap[item]] || -1;
        });

        props.customFormConfig?.forEach((item) => {
          editConfigParams[item.contentField] =
            editFormData.value[item.contentField];
        });

        try {
          const { code } =
            props.action === 'edit'
              ? await updateStoreApi({ ...editParamsObj, ...editConfigParams })
              : await createStoreApi({ ...editParamsObj, ...editConfigParams });
          if (code === '0000') {
            ElMessage.success(
              props.action === 'edit' ? '编辑店铺成功' : '新建店铺成功'
            );
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
  .form_item {
    display: flex;
    flex-wrap: wrap;
  }
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
