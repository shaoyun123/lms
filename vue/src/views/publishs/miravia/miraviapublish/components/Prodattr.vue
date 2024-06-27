<template>
  <div class="label_item">
    <el-form-item
      v-for="item in prodListingMiraviaPropertyList"
      :key="item.id"
      :label="item.attrName"
      :class="{ isBlock: item.attrName === '危险品' }"
    >
      <template #label>
        <span class="label-text"
          ><span
            v-if="isRequired && item.attrName !== '危险品'"
            style="color: red"
            >*</span
          >{{ item.attrName }}</span
        >
      </template>
      <!-- attributeShowTypeValue 1：文本（支持输入） 3：单选（不支持输入） 4：多选(不支持输入) 7：枚举单选可输入 8：枚举多选可输入 -->
      <!-- 6 计数单位 文本框(支持输入) -->
      <!-- judgeCompAttrShowType 返回 单选1 多选2 自定义单选下拉单选3 文本框4 自定义多选下拉框5-->
      <el-input
        v-if="judgeCompAttrShowType(item) === 4"
        v-model="item.attrValueId"
      ></el-input>
      <el-select
        v-if="[1, 2, 3, 5].includes(judgeCompAttrShowType(item))"
        v-model="item.attrValueId"
        style="width: 400px"
        :placeholder="
          [1, 2].includes(judgeCompAttrShowType(item))
            ? '请选择'
            : '请选择或者自定义属性'
        "
        filterable
        clearable
        collapse-tags-tooltip
        :collapse-tags="[2, 5].includes(judgeCompAttrShowType(item))"
        :multiple="[2, 5].includes(judgeCompAttrShowType(item))"
        :allow-create="[3, 5].includes(judgeCompAttrShowType(item))"
      >
        <el-option
          v-for="cItem in item.optionalValueList"
          :key="cItem.id"
          :label="cItem.name"
          :value="cItem.id"
        ></el-option>
      </el-select>
      <span
        v-if="attrMapList?.length > 0 && item.attrName === '危险品'"
        class="temp_text"
        >模板物流属性：{{ attrMapStr }}</span
      >
    </el-form-item>
  </div>
</template>
<script setup>
  import { computed, inject } from 'vue';
  const props = defineProps({
    prodListingMiraviaPropertyList: {
      type: Array,
      default: () => []
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    attrMapList: {
      // 商品物流属性映射属性
      type: Array,
      default: () => []
    }
  });

  const judgeCompAttrShowType = inject('judgeAttrShowType');

  const attrMapStr = computed(() => {
    return props.attrMapList?.join(',');
  });
</script>
<style lang="scss" scoped>
  .isBlock {
    width: 100%;
  }
  .temp_text {
    padding-left: 15px;
    color: #aaa;
  }
</style>
