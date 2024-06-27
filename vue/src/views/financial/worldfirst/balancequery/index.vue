<!-- 余额查询 -->
<template>
  <div style="padding: 10px">
    <el-card class="app-container common_split_bottom" style="padding: 20px">
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="height"
        class="table_scrollbar"
        border
        show-overflow
        :column-config="{ resizable: true }"
      >
        <!-- <vxe-column type="checkbox" width="40" /> -->
        <vxe-column field="acctName" title="账号" width="150"> </vxe-column>
        <vxe-column
          v-for="item in currencyList"
          :key="item"
          :title="item"
          width="150"
        >
          <template #default="{ row }">
            <div>
              <span>求和：</span>
              <span>
                {{
                  addThousandSeparator(
                    getValue(row.balanceList, item, 'sameValue') +
                      getValue(row.balanceList, item, 'normalValue')
                  )
                }}</span
              >
            </div>
            <div>
              <span>同名：</span
              ><span>{{
                addThousandSeparator(
                  getValue(row.balanceList, item, 'sameValue')
                )
              }}</span>
            </div>
            <div>
              <span>电商：</span
              ><span>{{
                addThousandSeparator(
                  getValue(row.balanceList, item, 'normalValue')
                )
              }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="更新时间" width="220">
          <template #default="{ row }">
            <div>
              <span>更新时间：</span>
              {{
                row.lastSyncTime
                  ? parseTime(row.lastSyncTime, '{y}-{m}-{d} {h}:{i}:{s}')
                  : ''
              }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" @click="handleUpdate(row)"
              >更新</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </el-card>
  </div>
</template>
<script setup name="financialworldfirstbalancequery">
  import { computed, ref, onMounted } from 'vue';
  import {
    getWfBalanceApi,
    syncBalanceApi
  } from '@/api/financial/worldfirst.js';
  import { ElMessage } from 'element-plus';
  import { parseTime } from '@/utils/common';
  // 获取table高度
  onMounted(() => {
    // 查询列表数据
    handleQuery();
  });
  const tableData = ref([]);
  const currencyList = ref([]); // 币种表头
  const sortOrder = ref([
    'CNH',
    'USD',
    'CAD',
    'GBP',
    'EUR',
    'AUD',
    'SGD',
    'HKD',
    'JPY',
    'NZD'
  ]);

  const handleQuery = async () => {
    try {
      const { code, data } = await getWfBalanceApi();
      if (code === '0000') {
        tableData.value = data;
        // 获取 currency 的并集去重 作为币种表头
        currencyList.value = [
          ...new Set(
            data.reduce((acc, item) => {
              item.balanceList.forEach((balance) => {
                acc.push(balance.currency);
              });
              return acc;
            }, [])
          )
        ];
        const newArr = [];
        sortOrder.value.forEach((twoE) => {
          currencyList.value.forEach((oneE) => {
            if (twoE === oneE) {
              newArr.push(twoE);
            }
          });
        });

        let newArr1 = currencyList.value.filter(
          (item) => !newArr.includes(item)
        );
        currencyList.value = newArr.concat(newArr1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getValue = (list, currency, type) => {
    let res = [];
    res = list.filter((item) => item.currency === currency);
    if (res?.length > 0) {
      return res[0][type];
    }
    return '';
  };

  // 更新
  const handleUpdate = async (row) => {
    try {
      const { code } = await syncBalanceApi([row.id]);
      if (code === '0000') {
        ElMessage.success('更新成功');
        handleQuery();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 数字添加 千分符
  const addThousandSeparator = (number) => {
    // 检查是否为小数
    const isDecimal = Number.isInteger(number) === false;
    // 格式化数字
    const formattedNumber = number.toLocaleString(undefined, {
      maximumFractionDigits: isDecimal ? 4 : 0
    });
    // 如果是小数，添加小数点
    if (isDecimal) {
      return formattedNumber.replace('.', '.');
    }
    return formattedNumber;
  };

  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 150;
  });
</script>
<style lang="scss" scoped>
  /*滚动条整体部分*/
  .table_scrollbar ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  /*滚动条的轨道*/
  .table_scrollbar ::-webkit-scrollbar-track {
    background-color: #ffffff;
  }
  /*滚动条里面的小方块，能向上向下移动*/
  .table_scrollbar ::-webkit-scrollbar-thumb {
    background-color: #bfbfbf;
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  .table_scrollbar ::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
  }
  .table_scrollbar ::-webkit-scrollbar-thumb:active {
    background-color: #787878;
  }
  /*边角，即两个滚动条的交汇处*/
  .mytable-scrollbar ::-webkit-scrollbar-corner {
    background-color: #ffffff;
  }
</style>
