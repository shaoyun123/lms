<template>
  <el-form-item
    v-for="(item, index) in allData"
    :key="item.id"
    :required="item.attributeStatus == 3"
    :class="[item.attributeStatus == 3 && !item.defaultValue ? 'is-error' : '']"
    :label="
      item.ids && item.ids.toString().includes('edit') ? '' : item.attributeName
    "
  >
    <!-- 0: 输入框，
      1: 下拉多选，
      3: 下拉单选，
      4: 可输入下拉 -->
    <!-- 输入框 -->
    <el-input v-if="item.attributeMode == 0" v-model="item.defaultValue" />
    <!-- 多选 -->
    <el-select
      v-if="item.attributeMode == 1 && item.attributeValueList"
      v-model="item.defaultValue"
      filterable
      multiple
    >
      <el-option
        v-for="cItem in item.attributeValueList"
        :key="cItem.attributeValueId"
        :value="cItem.attributeValueId"
        :label="cItem.attributeValue"
      />
    </el-select>
    <el-input
      v-else-if="item.attributeMode == 3 && !item.attributeValueList"
      v-model="item.defaultValue"
    />
    <!-- 单选 -->
    <el-select
      v-if="item.attributeMode == 3 && item.attributeValueList"
      v-model="item.defaultValue"
      filterable
      clearable
    >
      <el-option
        v-for="cItem in item.attributeValueList"
        :key="cItem.attributeValueId"
        :value="cItem.attributeValueId"
        :label="cItem.attributeValue"
      />
    </el-select>
    <!-- 单选+可自定义+删除框 -->
    <el-select
      v-if="item.attributeMode == 4 && item.attributeValueList"
      v-model="item.defaultValue"
      filterable
      clearable
    >
      <el-option
        v-for="cItem in item.attributeValueList"
        :key="cItem.attributeValueId"
        :value="cItem.attributeValueId"
        :label="cItem.attributeValue"
      />
    </el-select>
    <!-- <el-autocomplete
      v-if="item.attributeMode == 4 && item.attributeValueList"
      v-model="item.defaultValue"
      :fetch-suggestions="querySearch"
      style="width: 4.3rem"
      placeholder="请选择"
      clearable
      @focus="getData(item.attributeValueList)"
    /> -->
    <el-input
      v-else-if="item.attributeMode == 4 && !item.attributeValueList"
      v-model="item.defaultValue"
    />
    <!-- attributeMode == 4，后面会多一个输入框，并且可以新增和删除 -->
    <el-input
      v-if="item.attributeMode == 4"
      v-model="item.attributeExtraValue"
      style="width: 300px"
    />
    <a
      v-if="
        item.attributeMode == 4 &&
        ((item.ids && !item.ids.toString().includes('edit')) || !item.ids)
      "
      style="margin: 0 10px; cursor: pointer"
      @click="addItem(index, type)"
      >添加</a
    >
    <a
      v-if="
        item.attributeMode == 4 &&
        item.ids &&
        item.ids.toString().includes('edit')
      "
      style="color: red; margin: 0 10px; cursor: pointer"
      @click="deleteItem(index, type)"
      >删除</a
    >
  </el-form-item>
</template>

<script setup>
  import { toRefs } from 'vue';
  const props = defineProps({
    allData: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: ''
    }
  });
  const { allData, type } = toRefs(props);

  // const restaurants = ref([]);
  // const getData = (arr) => {
  //   restaurants.value = [];
  //   arr.forEach((item) => {
  //     restaurants.value.push({
  //       value: item.attributeValue
  //       // label: item.attributeValueId
  //     });
  //   });
  // };
  // const querySearch = (queryString, cb) => {
  //   const results = queryString
  //     ? restaurants.value.filter(createFilter(queryString))
  //     : restaurants.value;
  //   cb(results);
  // };
  // const createFilter = (queryString) => {
  //   return (restaurant) => {
  //     return (
  //       restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  //     );
  //   };
  // };

  // 添加
  const addItem = (index) => {
    let newData = JSON.parse(JSON.stringify(allData.value[index]));
    newData['ids'] = 'edit_' + new Date().getTime();
    allData.value.splice(index + 1, 0, newData);
  };
  // 删除
  const deleteItem = (index) => {
    allData.value.splice(index, 1);
  };
</script>
