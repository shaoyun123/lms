<template>
  <el-card v-loading="cardItem.cardItemLoading" class="infinite-list-item">
    <div class="card-left">
      <LeftImage :card-item="cardItem" />
      <el-link
        type="primary"
        :underline="false"
        class="mt10"
        @click="handleOpenCarousel()"
        >查看说明及示意图</el-link
      >
      <CarouselImage v-model="carouselVisible" :card-item="cardItem" />
    </div>
    <div class="card-right">
      <el-row class="card-right-row card-right-row-title" :gutter="20">
        <el-col :span="6">
          <div class="disflex">
            任务ID:{{ cardItem.taskCode }}
            <el-icon
              color="#409efc"
              class="ml10"
              @click="copy(cardItem.taskCode)"
            >
              <DocumentCopy />
            </el-icon>
          </div>
        </el-col>
        <template v-if="cardItem.productQualificationDesc">
          <el-col :span="6">
            <el-tooltip
              effect="dark"
              :content="cardItem.taskName"
              placement="top-start"
            >
              <div class="ellipsis">
                {{ cardItem.taskName }}
              </div>
            </el-tooltip>
          </el-col>
          <el-col v-if="cardItem.productQualificationDesc" :span="12">
            <el-tooltip
              effect="dark"
              :content="cardItem.productQualificationDesc"
              placement="top-start"
            >
              <div class="ellipsis">
                风险提示：{{ cardItem.productQualificationDesc }}
              </div>
            </el-tooltip>
          </el-col>
        </template>
        <template v-else>
          <el-col :span="18">
            <el-tooltip
              effect="dark"
              :content="cardItem.taskName"
              placement="top-start"
            >
              <div class="ellipsis">
                {{ cardItem.taskName }}
              </div>
            </el-tooltip>
          </el-col>
        </template>
      </el-row>
      <el-descriptions :column="7" size="small" border>
        <el-descriptions-item label="任务状态">
          <el-tag v-if="cardItem.taskStatus === 1">进行中</el-tag>
          <el-tag v-if="cardItem.taskStatus === 2" type="info">已结束</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">平台类目</div>
          </template>
          <el-tooltip
            effect="dark"
            :content="cardItem.platCateTree"
            placement="top-start"
          >
            <span>{{ cardItem.platCateName }}</span>
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">建议价格</div>
          </template>
          <div v-if="cardItem.expectPrice">{{ cardItem.expectPrice }} CNY</div>
          <div v-else>-</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">采购数量</div>
          </template>
          <div v-if="cardItem.expectQuantity">
            {{ cardItem.expectQuantity }}
          </div>
          <div v-else>-</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">优先级</div>
          </template>
          {{ cardItem.priorityStr }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">截止日期</div>
          </template>
          {{ transferDate(cardItem.expireTime) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"><span class="red">*</span>供应商链接</div>
          </template>
          <el-input v-model="cardItem.supplierUrl" placeholder="请输入" />
          <el-icon v-if="cardItem.supplierUrl" color="#409efc" class="ml10">
            <Link @click="handleOPenSuppier" />
          </el-icon>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">提报状态</div>
          </template>
          <div class="disflex">
            <div :class="getPresendStatusClass()">
              <span :class="getIconClass()"></span>
            </div>
            <div v-if="cardItem.reportingStatus === 2">
              {{ cardItem.approvedStr }}
              <el-tooltip
                v-if="cardItem.approved === 2"
                effect="dark"
                :content="cardItem.approvedFailReason"
                placement="top-start"
              >
                <span style="color: #409eff">查看</span>
              </el-tooltip>
            </div>
            <div v-else>未提报</div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">OA新类目</div>
          </template>
          <el-tooltip
            v-if="cardItem.oaCateTree"
            effect="dark"
            :content="cardItem.oaCateTree"
            placement="top-start"
          >
            <div>
              <el-cascader
                v-model="cardItem.oaCateId"
                :options="initList.oaNewCateList"
                filterable
                :show-all-levels="false"
                clearable
                collapse-tags
                :props="{
                  label: 'title',
                  children: 'data'
                }"
                @change="handleChangeProduct('oaCateId')"
              ></el-cascader>
            </div>
          </el-tooltip>
          <div v-else>
            <el-cascader
              v-model="cardItem.oaCateId"
              :options="initList.oaNewCateList"
              filterable
              :show-all-levels="false"
              clearable
              collapse-tags
              :props="{
                label: 'title',
                children: 'data'
              }"
              @change="handleChangeProduct('oaCateId')"
            ></el-cascader>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">预估报价</div>
          </template>
          <div v-if="cardItem.estimatePrice">
            {{ cardItem.estimatePrice }} CNY
          </div>
          <div v-else>-</div>
        </el-descriptions-item>
        <el-descriptions-item width="80">
          <template #label>
            <div class="cell-item">重量要求</div>
          </template>
          <div v-if="cardItem.expectWeight">{{ cardItem.expectWeight }} kg</div>
          <div v-else>-</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">创建人</div>
          </template>
          {{ cardItem.taskCreatorName }}
        </el-descriptions-item>
        <el-descriptions-item :width="90" label="本地创建时间">
          <!-- <template #label>
            <div class="cell-item">本地创建时间</div>
          </template> -->
          {{ transferDate(cardItem.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">开发专员</div>
          </template>
          <el-select
            v-model="cardItem.bizzOwner"
            clearable
            filterable
            allow-create
            @change="handleChangeProduct('bizzOwner')"
          >
            <el-option
              v-for="item in initList.bizzOwnerList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">子SKU</div>
          </template>
          <el-select
            v-model="cardItem.prodSSku"
            filterable
            remote
            clearable
            :remote-method="handleRemoteProdSSku"
            :loading="prodSSkuLoading"
            @focus="changeEmptyText"
          >
            <template #empty>
              <div class="select-dropdown-empty">
                {{ emptyText }}
              </div>
            </template>
            <el-option
              v-for="item in prodSSkuOptions"
              :key="item.prodSSku"
              :label="item.prodSSku"
              :value="item.prodSSku"
              @click="handleUpdateInfo(item)"
            />
          </el-select>
          <el-tag v-if="cardItem.prodSSku && !cardItem.isSale" type="info"
            >停</el-tag
          >
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">款式</div>
          </template>
          <el-input
            v-model="cardItem.style"
            placeholder="请输入"
            :maxlength="50"
            @change="handleChangeProduct('style')"
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"><span class="red">*</span>成本</div>
          </template>
          <div class="disflex">
            <el-input-number
              v-model="cardItem.cost"
              placeholder="请输入"
              :maxlength="20"
              :min="0.01"
              @blur="handleChangeNull($event, 'cost')"
              @keyup.enter="handleChangeNull($event, 'cost')"
              @change="handleChangeProduct('cost')"
            >
            </el-input-number>
            <span>CNY</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"><span class="red">*</span>毛重(g)</div>
          </template>
          <el-input-number
            v-model="cardItem.weight"
            placeholder="请输入"
            :precision="2"
            :min="0.01"
            :maxlength="20"
            @blur="handleChangeNull($event, 'weight')"
            @keyup.enter="handleChangeNull($event, 'weight')"
            @change="handleChangeProduct('weight')"
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">尺寸(长)</div>
          </template>
          <el-input-number
            v-model="cardItem.outerBoxLength"
            placeholder="请输入长"
            :precision="2"
            :maxlength="50"
            @blur="handleChangeNull($event, 'outerBoxLength')"
            @keyup.enter="handleChangeNull($event, 'outerBoxLength')"
            @change="handleChangeProduct('outerBoxLength')"
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">尺寸(宽)</div>
          </template>
          <el-input-number
            v-model="cardItem.outerBoxWidth"
            placeholder="请输入宽"
            :precision="2"
            :maxlength="50"
            @blur="handleChangeNull($event, 'outerBoxWidth')"
            @keyup.enter="handleChangeNull($event, 'outerBoxWidth')"
            @change="handleChangeProduct('outerBoxWidth')"
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">尺寸(高)</div>
          </template>
          <el-input-number
            v-model="cardItem.outerBoxHeight"
            placeholder="请输入高"
            :precision="2"
            :maxlength="50"
            @blur="handleChangeNull($event, 'outerBoxHeight')"
            @keyup.enter="handleChangeNull($event, 'outerBoxHeight')"
            @change="handleChangeProduct('outerBoxHeight')"
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">商品简称</div>
          </template>
          <el-input
            v-model="cardItem.purchaseChannel"
            placeholder="请输入"
            :maxlength="50"
            @change="handleChangeProduct('purchaseChannel')"
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">是否包邮</div>
          </template>
          <el-select
            v-model="cardItem.freeShipping"
            clearable
            @change="handleChangeProduct('freeShipping')"
          >
            <el-option :value="true" label="包邮" />
            <el-option :value="false" label="不包邮" />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">大货价</div>
          </template>
          <el-input-number
            v-model="cardItem.bigProductPrice"
            placeholder="请输入"
            :maxlength="20"
            :precision="2"
            @blur="handleChangeNull($event, 'bigProductPrice')"
            @keyup.enter="handleChangeNull($event, 'bigProductPrice')"
            @change="handleChangeProduct('bigProductPrice')"
          >
          </el-input-number>
          <span>CNY</span>
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template #label>
            <div class="cell-item">备注</div>
          </template>
          <el-input
            v-model="cardItem.remark"
            :rows="1"
            type="textarea"
            placeholder="请输入"
            @change="handleChangeProduct('remark')"
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">编辑状态</div>
          </template>
          <div>
            <el-tag v-if="cardItem.tag === 0" type="warning" size="large"
              >未编辑</el-tag
            >
            <el-tag v-if="cardItem.tag === 1" type="warning" size="large"
              >可补充</el-tag
            >
            <el-tag v-if="cardItem.tag === 2" size="large">已编辑</el-tag>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { debounce } from 'lodash-es';
  import LeftImage from './LeftImage.vue';
  import CarouselImage from './CarouselImage.vue';
  import { DocumentCopy } from '@element-plus/icons-vue';
  import { copy, transferDate } from '@/utils/common';
  import { getSkuInfoApi } from '@/api/multiplatform/aeproducttrace';
  // import { cloneDeep } from 'lodash-es';
  const props = defineProps({
    cardItem: {
      type: Object,
      default: () => ({})
    },
    initList: {
      type: Object,
      default: () => ({})
    }
  });
  const emits = defineEmits(['changeInfo', 'changeKey']);
  const cardItem = computed(() => props.cardItem);
  // const { cardItem } = toRefs(props);
  const getIconClass = () => {
    let iconClass = {
      icon: true
    };
    const { approved, reportingStatus } = props.cardItem;
    let _reportingStatus = 3; // 未提报
    if (reportingStatus === 2) {
      // 待审核 0
      // 审核通过 1
      // 审核不过 2
      _reportingStatus = approved;
    }
    const colorObj = {
      0: 'primary',
      1: 'success',
      2: 'danger',
      3: 'warning'
    };
    iconClass[colorObj[_reportingStatus]] = true;
    return iconClass;
  };
  const getPresendStatusClass = () => {
    let presendStatusClass = {
      'card-right-presend-status': true
    };
    const colorObj = {
      0: 'primary-opacity',
      1: 'success-opacity',
      2: 'danger-opacity',
      3: 'warning-opacity'
    };
    const { approved, reportingStatus } = props.cardItem;
    let _reportingStatus = 3; // 未提报
    if (reportingStatus === 2) {
      // 待审核 0
      // 审核通过 1
      // 审核不过 2
      _reportingStatus = approved;
    }
    presendStatusClass[colorObj[_reportingStatus]] = true;
    return presendStatusClass;
  };
  const carouselVisible = ref(false);
  const handleOpenCarousel = () => {
    carouselVisible.value = true;
  };
  const handleOPenSuppier = () => {
    window.open(props.cardItem.supplierUrl);
  };
  const prodSSkuLoading = ref(false);
  const prodSSkuOptions = ref([]);
  const emptyText = ref('无数据');
  const handleRemoteProdSSku = debounce(async (query) => {
    if (query && query.length > 4) {
      prodSSkuLoading.value = true;
      emptyText.value = '加载中';
      try {
        const { data } = await getSkuInfoApi(query);
        // 需要判断下有无数据返回
        if (data) {
          prodSSkuOptions.value = [data];
        } else {
          prodSSkuOptions.value = [];
        }
      } catch (err) {
        console.log('err :>> ', err);
      } finally {
        prodSSkuLoading.value = false;
        emptyText.value = '无数据';
      }
    } else {
      prodSSkuOptions.value = [];
      emptyText.value = '无数据';
    }
  }, 1000);
  const changeEmptyText = () => {
    emptyText.value = '加载中';
  };
  const handleChangeNull = (e, key) => {
    const value = e.target.value;
    if (!value && value !== 0) {
      handleChangeProduct(key);
    }
  };

  const handleUpdateInfo = (info) => {
    emits('changeInfo', {
      ...info,
      id: cardItem.value.id
    });
  };
  // 回车/点击页面保存字段内容
  const handleChangeProduct = (key) => {
    emits('changeKey', {
      key: key,
      id: cardItem.value.id,
      [key]: cardItem.value[key]
    });
  };
</script>

<style lang="scss" scoped>
  .infinite-list-item {
    :deep(.el-card__body) {
      display: flex;
    }
  }
  .infinite-list-item + .infinite-list-item {
    margin-top: 10px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .card-right {
    flex: 1;
    margin-left: 10px;
    position: relative;
    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .card-right-row-title {
      font-weight: bolder;
      font-size: 16px;
      color: #2b2d3b;
      margin-bottom: 10px;
    }
    .card-right-row + .card-right-row {
      margin-top: 10px;
    }
    .disflex {
      display: flex;
      align-items: center;
    }
    .cell-item {
      display: flex;
      align-items: center;
      width: 60px;
    }

    .card-right-presend-status {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 12px;
      width: 12px;
      border-radius: 6px;
      margin-right: 4px;
      .icon {
        // background-color: #818a98;
        display: inline-block;
        height: 6px;
        width: 6px;
        border-radius: 3px;
      }
    }
    .success {
      background-color: #67c23a;
    }
    .success-opacity {
      background-color: rgba(103, 194, 58, 0.5);
    }

    .primary {
      background-color: #409eff;
    }
    .primary-opacity {
      background-color: rgba(64, 158, 255, 0.5);
    }
    .danger {
      background-color: #f47474;
    }
    .danger-opacity {
      background-color: rgba(244, 116, 116, 0.5);
    }
    .warning {
      background-color: #e6a23c;
    }
    .warning-opacity {
      background-color: rgba(230, 162, 60, 0.5);
    }
    .red {
      color: #f47474;
    }
  }
  .select-dropdown-empty {
    padding: 10px 0;
    margin: 0;
    text-align: center;
    color: #909399;
    font-size: 12px;
  }
</style>
