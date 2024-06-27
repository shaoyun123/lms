<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="SKU销量"
      width="50%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div class="flex">
        <div
          ref="saleChartRef"
          class="w-full min-h-50"
          style="width: 85%; height: 350px; padding-bottom: 10px"
        />
        <div v-if="chartInfo.product.length" class="sku-content">
          <div class="overflow-y-auto">
            <div
              v-for="item in controlList"
              :key="item.value"
              class="flex point mb-4"
              :style="{
                color: item.color,
                opacity: currentShowLine.includes(item.value) ? 1 : 0.25
              }"
              @click="initEchartsData(item.value)"
            >
              <div
                class="color-box"
                :style="{ backgroundColor: item.color }"
              ></div>
              <div>
                <span v-if="item.value !== '父SKU'">子</span>{{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, nextTick, ref, watch, markRaw } from 'vue';
  import * as echarts from 'echarts/core';
  import {
    DataZoomComponent,
    GridComponent,
    MarkLineComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent
  } from 'echarts/components';
  import { LineChart } from 'echarts/charts';
  import { UniversalTransition } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';

  echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
    DataZoomComponent,
    MarkLineComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition
  ]);

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    chartInfo: {
      type: Object,
      default: () => {}
    },
    currentSkuList: {
      type: Array,
      default: () => []
    },
    currentSellerSku: {
      type: String,
      default: () => ''
    }
  });

  const emits = defineEmits(['update:modelValue']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const initOptionData = (xList, series) => {
    return {
      tooltip: {
        show: true
      },
      dataZoom: [
        {
          height: 20,
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'filter',
          start: 72,
          end: 100
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'filter',
          start: 72,
          end: 100
        }
      ],
      xAxis: {
        type: 'category',
        data: xList
      },
      yAxis: {
        type: 'value'
      },
      series: series,

      grid: {
        top: '30px',
        left: '100px',
        right: '100px',
        bottom: '80px'
      }
    };
  };

  const allSeries = ref([]);
  const controlList = ref([]);

  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) {
        currentShowLine.value = [];
        controlList.value = [];
        chartDom.value = null;
        let series = [
          {
            name: '父SKU',
            type: 'line',
            smooth: true,
            label: {
              show: true,
              position: 'top'
            },
            tooltip: {
              show: true
            },
            data: props.chartInfo.product.map((item) => item.todaySaleVolume)
          }
        ];
        controlList.value.push({
          name: '父SKU',
          value: '父SKU',
          color: getRandomColor()
        });
        Object.keys(props.chartInfo.sku).forEach((key) => {
          series.push({
            name: key,
            type: 'line',
            smooth: true,
            label: {
              show: true,
              position: 'top'
            },
            tooltip: {
              show: true
            },
            data: props.chartInfo.sku[key].map((item) => item.todaySaleVolume)
          });
          controlList.value.push({
            name: key,
            value: key,
            color: getRandomColor()
          });
        });
        allSeries.value = series.map((item, index) => {
          item.lineStyle = {
            color: controlList.value[index].color
          };
          return item;
        });
        initEchartsData(props.currentSellerSku);
      }
    },
    { deep: true }
  );

  // 当前展示的线
  const currentShowLine = ref([]);

  const initEchartsData = (currentSellerSku) => {
    // x轴
    const xList = props.chartInfo.product.map((item) => item.statisticDay);
    // y轴
    const currentIndex = currentShowLine.value.findIndex(
      (current) => current === currentSellerSku
    );
    if (currentIndex > -1) {
      currentShowLine.value.splice(currentIndex, 1);
    } else {
      currentShowLine.value.push(currentSellerSku);
    }
    // 所有该显示的数据
    const series = allSeries.value.filter((item) =>
      currentShowLine.value.includes(item.name)
    );
    nextTick(() => {
      initChartDom(initOptionData(xList, series));
    });
  };
  const saleChartRef = ref(null);

  const chartDom = ref(null);

  const initChartDom = (option) => {
    if (!chartDom.value) {
      chartDom.value = markRaw(echarts.init(saleChartRef.value));
    }
    chartDom.value.clear();
    chartDom.value.setOption(option);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
</script>

<style lang="scss" scoped>
  .w-full {
    width: 100%;
  }
  .min-h-50 {
    min-height: 50px;
  }
  .flex {
    display: flex;
  }
  .sku-content {
    flex: 1;
    height: 350px;
    overflow: hidden;
  }
  .color-box {
    width: 20px;
    height: 20px;
    border-radius: 10%;
    margin-right: 4px;
  }
  .point {
    cursor: pointer;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
  .overflow-y-auto {
    height: 350px;
    overflow-y: auto;
  }
</style>
