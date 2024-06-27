<template>
  <div class="label_item">
    <el-form-item
      v-for="item in prodListingTemuPropertyList"
      v-show="item.controlType !== 16"
      :key="item.id"
      :label="item.name"
      label-width="110px"
      :required="item.required"
    >
      <!-- 控件类型 0 文本输入 1 3 下拉框 16 成分比例 -->
      <el-select
        v-if="item.controlType === 1 || item.controlType === 3"
        v-model="item.propertyVId"
        style="width: 400px"
        :disabled="activeKey === '1' ? true : false"
        filterable
        clearable
        :max-collapse-tags="item.chooseMaxNum"
        :multiple-limit="item.chooseMaxNum"
        collapse-tags-tooltip
        :collapse-tags="multiProdAttrList.includes(item.name)"
        :multiple="multiProdAttrList.includes(item.name)"
        @change="(val) => changePropVal(val, item.optionalValueList, item)"
      >
        <el-option
          v-for="cItem in item.optionalValueList"
          :key="cItem.vid"
          :label="cItem.value"
          :value="cItem.vid"
        ></el-option>
      </el-select>

      <el-input
        v-if="item.controlType === 0"
        v-model="item.propertyPropValue"
        style="width: 400px"
        placeholder="请输入"
      ></el-input>
    </el-form-item>
    <template v-if="isIncludeIngredient">
      <div>{{ ingredientList.value }}</div>
      <el-form-item
        v-for="(iItem, index) in ingredientList"
        :key="iItem.id"
        class="ingredientWidth"
        label-width="110px"
        :label="iItem.name"
        :required="iItem.required"
      >
        <div class="ingredient">
          <el-form
            ref="ingredientFormRef"
            :model="ingredientList"
            label-width="80px"
          >
            <div
              v-for="(cItem, cIndex) in ingredientList[index].ingredientRowList"
              :key="cIndex"
              class="ingredientFormItemStyle"
            >
              <el-form-item :label="cItem.propertyChooseTitle">
                <el-select
                  v-model="cItem.propertyVId"
                  placeholder="请选择"
                  style="width: 310px"
                  clearable
                >
                  <el-option
                    v-for="item in iItem.optionalValueList"
                    :key="item.vid"
                    :label="item.value"
                    :value="item.vid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="cItem.numberInputTitle" class="ml-20">
                <div class="flex">
                  <el-input
                    v-model="cItem.propertyNumberInputValue"
                    placeholder="请输入0-100且比例总和为100"
                    style="width: 280px"
                    oninput="value=value.replace(/^\.*((100|\d{0,2})(?:\.\d{0,2})?).*$/g, '$1')"
                  />
                  <span class="px10">%</span>
                  <el-button
                    link
                    class="mt-2"
                    type="danger"
                    :disabled="
                      ingredientList[index].ingredientRowList.length === 1
                    "
                    @click.prevent="removeDomain(cIndex, index)"
                    >删除</el-button
                  >
                </div>
              </el-form-item>
            </div>
            <el-form-item class="ml-20 p-10">
              <el-button
                type="primary"
                link
                :disabled="
                  ingredientList[index].ingredientRowList?.length >= 11
                "
                @click="addDomain(index)"
              >
                <el-icon><Plus /></el-icon>
                <span>添加</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-form-item>
    </template>
  </div>
</template>
<script setup>
  import { watch } from 'vue';
  const props = defineProps({
    prodListingTemuPropertyList: {
      type: Array,
      default: () => []
    },
    activeKey: {
      type: String,
      default: ''
    },
    ingredientList: {
      type: Array,
      default: () => []
    },
    multiProdAttrList: {
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: ''
    },
    ingredientDataItem: {
      type: Object,
      default: () => {}
    },
    isIncludeIngredient: {
      type: Boolean,
      default: false
    },
    isTriggerChangeSelect: {
      type: Boolean,
      default: false
    }
  });
  const emits = defineEmits([
    'updatePropertyListWidthChild',
    'addDomain',
    'removeDomain',
    'triggerDone'
  ]);

  watch(
    () => props.isTriggerChangeSelect,
    (val) => {
      if (!val) return false;
      props.prodListingTemuPropertyList.forEach((item) => {
        if (item.defaultValue) {
          const foundDefaultItem = item.optionalValueList?.find(
            (v) => v.value === item.defaultValue
          );

          // 根据接口返回的defaultValue去回显嵌套类目属性
          if (foundDefaultItem?.subCateAttrList?.length)
            setTimeout(() => {
              changePropVal(item.propertyVId, item.optionalValueList, item);
            }, 0);
        }
      });
      emits('triggerDone');
    }
  );

  // 选择平台类目产品属性
  const changePropVal = (val, data, itemData) => {
    let arr = data?.filter((item) => item.vid === val);
    // 看产品属性下是不是还有子属性，若有子属性则需要提取出来放置到产品属性列表最后面
    let newPropSelectList;
    newPropSelectList =
      arr[0]?.subCateAttrPropertyList || arr[0]?.subCateAttrList || [];

    newPropSelectList?.forEach((item) => {
      item.parId = itemData.id;
      item.name = item.propertyPropName ? item.propertyPropName : item.name;
      if (item.defaultValue) {
        const foundDefaultItem = item.optionalValueList.find(
          (v) => v.value === item.defaultValue
        );
        if (foundDefaultItem) item.propertyVId = foundDefaultItem.vid;
      }
    });
    let temuPropertyList = [];
    if (props.action === 'update') {
      // 获取 subCateAttrPropertyList 下面所有的子属性
      // 将子属性拼接到产品属性后
      let allChildProp = [];
      data?.forEach((item) => {
        if (item.subCateAttrPropertyList) {
          allChildProp.push(...item.subCateAttrPropertyList);
        }
      });
      let allChildPropIdArr = allChildProp?.map(
        (item) => item.propertyTemplatePId
      );

      temuPropertyList = props.prodListingTemuPropertyList?.filter((item) => {
        return allChildPropIdArr.includes(item.propertyTemplatePId) === false;
      });
    } else {
      temuPropertyList = props.prodListingTemuPropertyList?.filter((item) => {
        return item.parId !== itemData.id;
      });
    }
    emits('updatePropertyListWidthChild', {
      temuPropertyList,
      newPropSelectList
    });
  };

  // 添加成分属性
  const addDomain = (index) => {
    const newIngredientItem = JSON.parse(
      JSON.stringify(props.ingredientDataItem)
    );
    newIngredientItem.propertyVId = '';
    newIngredientItem.propertyNumberInputValue = '';
    newIngredientItem.propertyPropValue = '';
    emits('addDomain', { index, newIngredientItem });
  };

  // 删除成分属性
  const removeDomain = (cIdx, idx) => {
    emits('removeDomain', { cIdx, idx });
  };
</script>
<style lang="scss" scooped>
  .label_item {
    display: flex;
    flex-wrap: wrap;
    margin-left: 180px;
  }
</style>
