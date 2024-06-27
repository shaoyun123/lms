<template>
  <div>
    <el-divider content-position="left"
      ><h3>
        <span v-if="referenceProductLink" class="red_star">*</span> 参考产品链接
      </h3></el-divider
    >
    <el-row :span="24" class="reference_link_batch">
      <el-col :span="5">
        <el-select
          v-model="bacthParams.main"
          :placeholder="mainName"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in mainArr"
            :key="item.attributeValueId"
            :label="item.attributeValue"
            :value="item.attributeValueId"
          />
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="bacthParams.sub"
          :placeholder="subName"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in subArr"
            :key="item.attributeValueId"
            :label="item.attributeValue"
            :value="item.attributeValueId"
          />
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-input
          v-model="bacthParams.referenceProductLink"
          placeholder="请输入参考产品链接"
        />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleFillIn">填入</el-button>
        <el-button @click="handleResetAll">清空</el-button>
      </el-col>
    </el-row>
    <el-table :data="sheinPublishSkuDtos" border size="small">
      <el-table-column prop="main" :label="mainName" width="180">
        <template #default="{ row }">
          <div>{{ getAttributeName(mainArr, row.main) }}</div></template
        >
      </el-table-column>
      <el-table-column prop="sub" :label="subName" width="180">
        <template #default="{ row }">
          <div>{{ getAttributeName(subArr, row.sub) }}</div></template
        ></el-table-column
      >
      <el-table-column prop="link" label="商品链接">
        <template #default="{ row }">
          <span v-if="referenceProductLink" class="red_star">*</span>
          <el-input
            v-model="row.referenceProductLink"
            placeholder="请输入参考产品链接"
            clearable
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { cloneDeep } from 'lodash-es';
  import { computed } from 'vue';
  import { isUrl } from '@/utils/is';
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({})
    },
    referenceProductLink: {
      type: Boolean,
      default: false
    },
    subArr: {
      type: Array,
      default: () => []
    },
    mainArr: {
      type: Array,
      default: () => []
    },
    sheinPublishSkuDtos: {
      type: Array,
      default: () => []
    },
    sheinSaleAttrsInfoDto: {
      type: Object,
      default: () => ({})
    }
  });

  const emits = defineEmits(['update:modelValue', 'changeDiaformValue']);
  const bacthParams = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const getAttributeName = (arr = [], id) => {
    let name = id;
    if (typeof id === 'number') {
      name =
        (arr || []).filter((item) => item.attributeValueId === id)[0]
          ?.attributeValue || '';
    }
    return name;
  };

  const mainName = computed(() => {
    if (props.sheinSaleAttrsInfoDto.mainAttributeId) {
      return props.sheinSaleAttrsInfoDto.mainAttributeName;
    }
    return '';
  });
  const subName = computed(() => {
    if (props.sheinSaleAttrsInfoDto.subAttributeId) {
      return props.sheinSaleAttrsInfoDto.subAttributeName;
    }
    return '';
  });
  // 清空
  const handleResetAll = () => {
    let tableData = cloneDeep(props.sheinPublishSkuDtos);
    tableData.forEach((item) => {
      item.referenceProductLink = '';
    });
    emits('changeDiaformValue', 'sheinPublishSkuDtos', tableData);
  };
  // 填入
  const handleFillIn = () => {
    let tableData = cloneDeep(props.sheinPublishSkuDtos);
    const { main, sub, referenceProductLink } = bacthParams.value;
    if (!main) {
      return ElMessage.warning('请选择参考产品链接的主规格');
    }
    if (!sub) {
      return ElMessage.warning('请选择参考产品链接的次规格');
    }
    if (!referenceProductLink) {
      return ElMessage.warning('请输入参考产品链接的链接URL');
    }
    if (!isUrl(referenceProductLink)) {
      return ElMessage.warning('请输入参考产品链接的链接URL正确格式');
    }
    // 主规格属性值和次规格属性值作为筛选条件，根据筛选条件批量填写产品链接
    let isExistfilterData = false;
    tableData.forEach((item) => {
      if (item.main === main && item.sub === sub) {
        isExistfilterData = true;
        item.referenceProductLink = referenceProductLink;
      }
    });
    if (isExistfilterData) {
      emits('changeDiaformValue', 'sheinPublishSkuDtos', tableData);
      ElMessage.info('填入成功');
    } else {
      ElMessage.warning('主规格属性值和次规格属性值未筛选出值');
    }
  };
</script>

<style lang="scss" scoped>
  .reference_link_batch {
    :deep(.reference_link_batch) {
      width: 100%;
    }
  }
  .red_star {
    margin-right: 4px;
    color: #f56c6c;
  }
</style>
