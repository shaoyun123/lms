<template>
  <div v-for="item in attrList" :key="item.id">
    <el-form-item
      v-if="item.attributeShowTypeValue === 'list_box'"
      :label-width="240"
      :label="getName(item.attributeNameZn, item.attributeNameEn)"
      :prop="item.attributeId.toString()"
    >
      <el-select
        v-model="item.checkValue"
        clearable
        filterable
        @change="handleSecondAttr($event, item.attributeId)"
      >
        <el-option
          v-for="option in item.categoryAttributeValuesSmts"
          :key="option.categoryAttributeValueId"
          :value="option.categoryAttributeValueId"
          :label="getName(option.valueNameZn, option.valueNameEn)"
        />
      </el-select>
      <!-- 品牌才同步 -->
      <el-button
        v-if="item.attributeId == 2"
        type="primary"
        class="ml10"
        :loading="syncBrandLoading"
        @click="handleSyncBrand"
        >同步</el-button
      >
    </el-form-item>
    <!-- 二级属性 -->
    <el-form-item
      v-if="
        item.attributeShowTypeValue === 'list_box' &&
        !isEmpty(item.msgCategoryAttributeSmt)
      "
      :label-width="240"
      :label="
        getName(
          item.msgCategoryAttributeSmt.attributeNameZn,
          item.msgCategoryAttributeSmt.attributeNameEn
        )
      "
      :prop="item.msgCategoryAttributeSmt.attributeId.toString()"
    >
      <el-select
        v-model="item.msgCategoryAttributeSmt.checkValue"
        clearable
        filterable
      >
        <el-option
          v-for="option in item.msgCategoryAttributeSmt
            .categoryAttributeValuesSmts"
          :key="option.categoryAttributeValueId"
          :value="option.categoryAttributeValueId"
          :label="getName(option.valueNameZn, option.valueNameEn)"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="item.attributeShowTypeValue === 'check_box'"
      :label-width="240"
      :label="getName(item.attributeNameZn, item.attributeNameEn)"
      :prop="item.attributeId.toString()"
    >
      <el-checkbox-group v-model="item.checkValue">
        <el-checkbox
          v-for="option in item.categoryAttributeValuesSmts"
          :key="option.categoryAttributeValueId"
          :label="option.categoryAttributeValueId"
        >
          {{ option.valueNameZn }} ({{ option.valueNameEn }} )
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      v-if="item.attributeShowTypeValue === 'input'"
      :label-width="240"
      :label="getName(item.attributeNameZn, item.attributeNameEn)"
      :prop="item.attributeId.toString()"
    >
      <el-input v-model="item.checkValue" clearable />
    </el-form-item>
    <el-form-item
      v-if="item.attributeShowTypeValue === 'interval'"
      :label-width="240"
      :label="getName(item.attributeNameZn, item.attributeNameEn)"
      :prop="item.attributeId.toString()"
    >
      <div class="disflex">
        <el-input v-model="item.checkValue[0]" clearable />
        <span class="ml10 mr10">-</span>
        <el-input v-model="item.checkValue[1]" clearable />
      </div>
    </el-form-item>
  </div>
</template>

<script setup>
  import { isEmpty } from 'lodash-es';
  defineProps({
    attrList: {
      type: Array,
      default: () => []
    },
    syncBrandLoading: {
      type: Boolean,
      default: false
    }
  });
  const emits = defineEmits(['handleSyncBrand', 'handleSecondAttr']);

  const getName = (znName, enName) => {
    return `${znName}(${enName})`;
  };

  //   品牌
  const handleSyncBrand = async () => {
    emits('handleSyncBrand');
  };
  // 查找第二类目
  const handleSecondAttr = (curVal, attributeId) => {
    emits('handleSecondAttr', { curVal, attributeId });
  };
</script>

<style lang="scss" scoped>
  :deep(.el-form-item--default .el-form-item__label) {
    line-height: 20px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .disflex {
    display: flex;
  }
</style>
