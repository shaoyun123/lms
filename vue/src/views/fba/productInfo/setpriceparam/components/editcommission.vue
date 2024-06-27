<template>
  <el-dialog
    width="35%"
    :title="`${title}`"
    :model-value="isVisible"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="editFormRef"
      size="default"
      status-icon
      :model="editForm"
      :rules="editFormRules"
      :label-width="150"
    >
      <el-form-item label="佣金分类名称" prop="ruleName" size="default">
        <el-input
          v-model="editForm.ruleName"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        label="亚马逊类目"
        prop="cateIdList"
        class="search_item_cascader"
        size="default"
      >
        <el-cascader
          v-model="editForm.cateIdList"
          :options="cateListOption"
          :filter-method="filterCascader"
          filterable
          clearable
          collapse-tags
          style="width: 220px"
          :props="{
            emitPath: false,
            multiple: true,
            disabled: 'banned',
            label: 'localCateName',
            value: 'localFullCateName',
            children: 'children'
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="销售佣金百分比" prop="applyAllScopes" size="default">
        <el-select
          v-model="editForm.applyAllScopes"
          placeholder="请选择佣金类型"
        >
          <el-option label="固定比例" :value="true"></el-option>
          <el-option label="按售价分段收取" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="editForm.applyAllScopes !== ''">
        <el-form-item
          v-for="(item, index) in getEachList"
          :key="index"
          label="佣金判断规则"
          size="default"
          required
        >
          <el-form
            v-for="(cItem, cIndex) in editForm.scopeList[item]"
            ref="editinnerFormRef"
            :key="cIndex"
            :rules="innnerRules"
            :model="cItem"
            style="display: flex; margin-top: 5px"
          >
            <span style="padding: 0 5px 0 0">{{ currencySign }}</span>
            <el-form-item prop="chargeStartPrice">
              <el-input
                v-model="cItem.chargeStartPrice"
                type="number"
                style="width: 100px"
              />
            </el-form-item>
            <span style="padding: 0 5px">-</span>
            <span style="padding: 0 5px 0 0">{{ currencySign }}</span>
            <el-form-item prop="chargeEndPrice">
              <el-input
                v-model="cItem.chargeEndPrice"
                type="number"
                placeholder="不填为+∞"
                style="width: 100px"
              />
            </el-form-item>
            <span style="padding: 0 5px">-></span>
            <el-form-item prop="commissionRate">
              <el-input
                v-model="cItem.commissionRate"
                type="number"
                style="width: 100px"
              />
            </el-form-item>
            <span style="padding: 0 5px 0 0">%</span>
            <div
              v-if="cIndex == editForm.scopeList[item].length - 1"
              class="eidt_icon"
            >
              <el-icon :size="20" @click="addAllSubItem(item)"
                ><CirclePlus
              /></el-icon>
            </div>
            <div
              v-if="
                editForm.scopeList[item]?.length >
                  (item === 'allScopeSubRuleList' ? 1 : 2) &&
                cIndex == editForm.scopeList[item].length - 1
              "
              class="eidt_icon"
            >
              <el-icon :size="20" @click="removeAllSubItem(item, cIndex)"
                ><Remove
              /></el-icon>
            </div>
          </el-form>
        </el-form-item>
      </template>
      <el-form-item
        :label="`适用的最低销售佣金` + currencySign"
        size="default"
        prop="totalMinCommision"
      >
        <el-input v-model="editForm.totalMinCommision" type="number" />
      </el-form-item>
      <el-form-item label="备注" size="default">
        <el-input
          v-model="editForm.remark"
          type="textarea"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        type="primary"
        size="small"
        @click="handleSave(editFormRef, editinnerFormRef)"
        >保存</el-button
      >
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
  import {
    defineProps,
    defineEmits,
    reactive,
    computed,
    ref,
    onMounted
  } from 'vue';
  import { saveOrEdit, querAmazonCate } from '@/api/fba/setpriceparams.js';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增'
    },
    currencySign: {
      type: String,
      default: 'US'
    },
    editInfo: {
      type: Object,
      default: () => {}
    },
    siteId: {
      type: String,
      default: ''
    }
  });
  const emit = defineEmits(['close']);

  const scopeArr = reactive({
    allScopeSubRuleList: [
      {
        commissionRate: '',
        chargeStartPrice: '',
        chargeEndPrice: ''
      }
    ],
    scopeSubRuleList: [
      {
        commissionRate: '',
        chargeStartPrice: '',
        chargeEndPrice: ''
      },
      {
        commissionRate: '',
        chargeStartPrice: '',
        chargeEndPrice: ''
      }
    ]
  });

  const editFormRef = ref(null);
  const editinnerFormRef = ref(null);

  const editForm = reactive({
    ruleName: '',
    applyAllScopes: '',
    totalMinCommision: '',
    cateIdList: [],
    scopeList: scopeArr,
    subRuleList: [],
    remark: ''
  });

  const validatePrice = (rule, value, callback) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(value) && parseFloat(value) > 0) {
      ElMessage.warning('请输入大于0的数字且最多2位小数');
      callback(new Error());
    } else {
      callback();
    }
  };

  const editFormRules = reactive({
    ruleName: [
      { required: true, trigger: 'blur', message: '请填写佣金分类名称' }
    ],
    cateIdList: [
      { required: true, trigger: 'blur', message: '请选择亚马逊类目' }
    ],
    applyAllScopes: [
      { required: true, trigger: 'blur', message: '请选择佣金类型' }
    ],
    totalMinCommision: [
      { trigger: 'blur', validator: validatePrice, message: '' }
    ]
  });
  const innnerRules = reactive({
    chargeStartPrice: [
      { required: true, validator: validatePrice, trigger: 'blur', message: '' }
    ],
    chargeEndPrice: [
      { validator: validatePrice, trigger: 'blur', message: '' }
    ],
    commissionRate: [
      { required: true, trigger: 'blur', validator: validatePrice, message: '' }
    ]
  });
  onMounted(() => {
    if (props.editInfo.id) {
      // 编辑时 回显数据
      Object.keys(editForm).forEach((item) => {
        editForm[item] = props.editInfo[item];
      });

      editForm.scopeList = scopeArr;

      if (editForm.applyAllScopes === true) {
        editForm.scopeList.allScopeSubRuleList = JSON.parse(
          JSON.stringify(props.editInfo.subRuleList)
        );
        editForm.scopeList.allScopeSubRuleList?.forEach((item) => {
          item.commissionRate = getRate(item.commissionRate);
        });
      } else {
        editForm.scopeList.scopeSubRuleList = JSON.parse(
          JSON.stringify(props.editInfo.subRuleList)
        );
        editForm.scopeList.scopeSubRuleList?.forEach((item) => {
          item.commissionRate = getRate(item.commissionRate);
        });
      }
    }
    queryCatelist();
  });

  const getRate = (val) => {
    if (!isNaN(val)) {
      let dotLength = String(val).length - (String(val).indexOf('.') + 1);
      return (val + '').indexOf('.') != -1 && dotLength > 3
        ? parseFloat(val * 100).toFixed(2)
        : parseFloat(val * 100).toFixed(dotLength - 2 > 0 ? dotLength - 2 : 0);
    }
  };

  const cateListOption = ref([]);
  const queryCatelist = async () => {
    try {
      const { data } = await querAmazonCate({
        salesSite: props.siteId,
        parentRuleId: props.editInfo.id || ''
      });
      cateListOption.value = data;
      if (props.editInfo.id) {
        // let categoryIdArr = props.editInfo.cateList?.map(
        //   (item) => item.categoryId
        // );
        // let cateArr = [];
        // categoryIdArr?.forEach((item) => {
        //   const path = findPathById(cateListOption.value, item);
        //   cateArr.push(path);
        //   editForm.cateIdList = cateArr;
        // });
        editForm.cateIdList = props.editInfo.cateList?.map(
          (item) => item.fullCateName
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 根据 categoryId 找到 categoryId 路径 用于回显
  // const findPathById = (arr, targetId, path = []) => {
  //   for (let item of arr) {
  //     path.push(item.categoryId);
  //     if (item.categoryId === targetId) {
  //       return path;
  //     }
  //     if (item.children && item.children.length > 0) {
  //       const foundPath = findPathById(item.children, targetId, path);
  //       if (foundPath) {
  //         return foundPath;
  //       }
  //     }
  //     path.pop();
  //   }
  //   return null;
  // };

  const getEachList = computed(() => {
    return editForm.applyAllScopes === true
      ? ['allScopeSubRuleList']
      : ['scopeSubRuleList'];
  });

  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };

  const addAllSubItem = (item) => {
    editForm.scopeList[item].push({
      commissionRate: '',
      chargeStartPrice: '',
      chargeEndPrice: ''
    });
  };

  const removeAllSubItem = (item, index) => {
    editForm.scopeList[item].splice(index, 1);
  };
  const handleClose = () => {
    editForm.ruleName = '';
    editForm.applyAllScopes = '';
    editForm.totalMinCommision = '';
    editForm.cateIdList = [];
    editForm.scopeList = scopeArr;
    editForm.subRuleList = [];
    emit('close');
  };

  const findAnemById = (nodes, targetName) => {
    for (let node of nodes) {
      if (node.localFullCateName === targetName) {
        return node.categoryId;
      }
      if (node.children) {
        let foundId = findAnemById(node.children, targetName);
        if (foundId !== undefined) {
          return foundId;
        }
      }
    }
  };

  // 保存
  const handleSave = async (formEl, formInderEl) => {
    if (!formEl) return;
    let innerValid = [];
    // if (!formInderEl) return;
    formEl.validate(async (valid) => {
      formInderEl?.forEach((item) => {
        item.validate(async (validInder) => {
          innerValid.push(validInder);
        });
      });
      setTimeout(async () => {
        if (valid && innerValid.filter((v) => !v)?.length === 0) {
          // 校验佣金

          let subRuleList = editForm.applyAllScopes
            ? JSON.parse(JSON.stringify(editForm.scopeList.allScopeSubRuleList))
            : JSON.parse(JSON.stringify(editForm.scopeList.scopeSubRuleList));
          subRuleList?.forEach((item) => {
            item.commissionRate = (item.commissionRate * 100) / 10000;
          });
          let notChargeArr = subRuleList.filter(
            (item) => item.chargeStartPrice === ''
          );
          let notRateArr = subRuleList.filter(
            (item) => item.commissionRate === ''
          );
          if (notChargeArr?.length > 0) {
            return ElMessage.warning('佣金判断规则最小值必填');
          }
          if (notRateArr?.length > 0) {
            return ElMessage.warning('佣金判断规则百分比必填');
          }

          let cateList = [];
          if (editForm.cateIdList?.length > 0) {
            editForm.cateIdList?.forEach((item) => {
              let obj = {
                categoryId: '',
                fullCateName: ''
              };
              obj.categoryId = findAnemById(cateListOption.value, item);
              obj.fullCateName = item;
              cateList.push(obj);
            });
          }
          let params = {
            id: props.editInfo.id || '',
            siteId: props.siteId,
            applyAllScopes: editForm.applyAllScopes,
            ruleName: editForm.ruleName,
            subRuleList,
            totalMinCommision: editForm.totalMinCommision,
            remark: editForm.remark,
            cateList
          };
          try {
            const { code } = await saveOrEdit([params]);
            if (code === '0000') {
              ElMessage.success('保存成功');
              emit('close', 'update');
            }
          } catch (error) {
            console.log(error);
          }
        }
      }, 100);
    });
  };
</script>
<style lang="scss" scoped>
  .search_item_cascader {
    :deep(.el-cascader) {
      width: 100% !important;
    }
  }
  .eidt_icon {
    display: flex;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;
  }
</style>
