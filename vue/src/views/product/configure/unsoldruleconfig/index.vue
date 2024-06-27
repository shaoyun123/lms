<template>
  <div id="add_width" class="app-container">
    <el-card class="common_split_bottom" style="height: calc(100vh - 100px)">
      <!-- 配置表格 -->
      <vxe-table :data="rulesList" boreder>
        <vxe-column title="规则名">
          <template #default="{ row }">
            {{ row.configName }}
          </template>
        </vxe-column>
        <vxe-column title="字段">
          <template #default="{ row }">
            {{ row.configData?.field1 || '' }}
          </template>
        </vxe-column>
        <vxe-column title="运算符">
          <template #default="{ row }">
            <el-select
              v-model="row.configData.operate1"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(opItem, opIndex) in getOperateMap1(row.configData)"
                :key="opIndex"
                :label="opItem.label"
                :value="opItem.value"
              />
            </el-select>
          </template>
        </vxe-column>
        <vxe-column title="数值">
          <template #default="{ row }">
            <el-input v-model="row.configData.value1" />
          </template>
        </vxe-column>
        <vxe-column title="逻辑运算符">
          <template #default="{ row }">
            <span>{{ getLogistic(row.configData?.logicalOperator) }}</span>
          </template>
        </vxe-column>
        <vxe-column title="字段">
          <template #default="{ row }">
            {{ row.configData?.field2 || '' }}
          </template>
        </vxe-column>
        <vxe-column title="运算符">
          <template #default="{ row }">
            <div
              v-if="
                row.configName === '继续售卖规则' ||
                row.configName === '高价值产品定义'
              "
            >
              <el-select
                v-model="row.configData.operate2"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(opItem, opIndex) in getOperateMap2(row.configData)"
                  :key="opIndex"
                  :label="opItem.label"
                  :value="opItem.value"
                />
              </el-select>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="数值">
          <template #default="{ row }">
            <el-input
              v-if="
                row.configName === '继续售卖规则' ||
                row.configName === '高价值产品定义'
              "
              v-model="row.configData.value2"
            />
          </template>
        </vxe-column>
      </vxe-table>
      <div style="margin-top: 100px">
        <el-button type="primary" @click="handleSaveSet()">保存配置</el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup name="productconfigureunsoldruleconfig">
  import { ref, onMounted, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    getRules,
    saveRules
  } from '@/api/product/configure/unsoldruleconfig.js';

  onMounted(() => {
    getRulesList();
  });

  // 获取所有的规则
  const rulesList = ref([]);

  const logicalMap = reactive({
    OR: '或',
    AND: '且'
  });

  const getLogistic = (item) => {
    return logicalMap[item];
  };

  const opearteMapLess = reactive([
    {
      value: 'LESS_THAN_OR_EQUAL',
      label: '≤'
    },
    {
      value: 'LESS_THAN',
      label: '<'
    }
  ]);
  const opearteMapGreater = reactive([
    {
      value: 'GREATER_THAN_OR_EQUAL',
      label: '≥'
    },
    {
      value: 'GREATER_THAN',
      label: '>'
    }
  ]);

  const getOperateMap1 = (data) => {
    let list = [];
    if (
      data.configName === '直接打包规则' ||
      data.configName === '继续售卖规则'
    ) {
      list = opearteMapLess;
    }
    if (
      data.configName === '采购退滞销规则' ||
      data.configName === '高价值产品定义'
    ) {
      list = opearteMapGreater;
    }
    return list;
  };

  const getOperateMap2 = (data) => {
    let list = [];
    if (
      data.configName === '继续售卖规则' ||
      data.configName === '高价值产品定义'
    ) {
      list = opearteMapGreater;
    }
    return list;
  };

  const getRulesList = async () => {
    try {
      const { code, data } = await getRules();
      if (code === '0000') {
        rulesList.value = data;
        rulesList.value?.forEach((item) => {
          if (
            item.configName === '直接打包规则' ||
            item.configName === '采购退滞销规则'
          ) {
            delete item.logicalOperator;
          }
        });
        rulesList.value?.forEach((item) => {
          if (item.configName === '继续售卖规则') {
            item.configData = {
              configName: item.configName,
              field1: '库存周转天数',
              operate1: item.stockSalesInventoryOperator,
              value1: item.stockSalesInventory,
              logicalOperator: item.logicalOperator,
              field2: '日均销量',
              operate2: item.dailySalesOperator,
              value2: item.dailySales
            };
          }
          if (item.configName === '直接打包规则') {
            item.configData = {
              configName: item.configName,
              field1: '指定仓当前库存金额(RMB)',
              operate1: item.currentSoldStockAmountOperator,
              value1: item.currentSoldStockAmount,
              logicalOperator: item.logicalOperator
            };
          }
          if (item.configName === '采购退滞销规则') {
            item.configData = {
              configName: item.configName,
              field1: '指定仓当前库存金额(RMB)',
              operate1: item.currentSoldStockAmountOperator,
              value1: item.currentSoldStockAmount,
              logicalOperator: item.logicalOperator
            };
          }
          if (item.configName === '高价值产品定义') {
            item.configData = {
              configName: item.configName,
              field1: '商品采购成本',
              operate1: item.purchasePriceOperator,
              value1: item.purchasePrice,
              logicalOperator: item.logicalOperator,
              field2: '指定仓当前库存金额(RMB)',
              operate2: item.currentSoldStockAmountOperator,
              value2: item.currentSoldStockAmount
            };
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveSet = async () => {
    // 保存配置
    let prodUnsoldStockCleanConfigList = [];
    rulesList.value?.forEach((item) => {
      let params = {
        id: '',
        configName: ''
      };
      params.id = item.id;
      params.configName = item.configName;
      Object.keys(item.configData)?.forEach((cItem) => {
        if (
          item.configData[cItem] === '' ||
          item.configData[cItem] === undefined
        ) {
          item.configData[cItem] = null;
        }
        if (item.configName === '继续售卖规则') {
          params.stockSalesInventoryOperator = item.configData.operate1;
          params.stockSalesInventory = item.configData.value1;
          params.dailySalesOperator = item.configData.operate2;
          params.dailySales = item.configData.value2;
          params.logicalOperator = 'OR';
        }
        if (item.configName === '直接打包规则') {
          params.currentSoldStockAmountOperator = item.configData.operate1;
          params.currentSoldStockAmount = item.configData.value1;
        }
        if (item.configName === '采购退滞销规则') {
          params.currentSoldStockAmountOperator = item.configData.operate1;
          params.currentSoldStockAmount = item.configData.value1;
        }
        if (item.configName === '高价值产品定义') {
          params.purchasePriceOperator = item.configData.operate1;
          params.purchasePrice = item.configData.value1;
          params.currentSoldStockAmountOperator = item.configData.operate2;
          params.currentSoldStockAmount = item.configData.value2;
          params.logicalOperator = 'OR';
        }
      });
      prodUnsoldStockCleanConfigList.push(params);
    });
    let obj = {
      prodUnsoldStockCleanConfigList
    };
    const { code } = await saveRules(obj);
    if (code === '0000') {
      ElMessage.success('保存成功');
      getRulesList();
    }
  };
</script>
<style lang="scss" scoped>
  .table_name {
    margin: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #333333;
  }
</style>
