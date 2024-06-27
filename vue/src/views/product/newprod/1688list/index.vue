<template>
  <div id="add_width" class="app-container">
    <el-card class="common_split_bottom card_position list_card">
      <el-form :inline="true" label-width="80px">
        <el-row>
          <el-form-item label="类目">
            <el-button type="primary" @click="chooseCate">选择类目</el-button>
            <el-icon class="ml10 gray_text" @click="handleDelCate"
              ><Delete
            /></el-icon>
          </el-form-item>
        </el-row>
        <el-row>
          <span style="padding-left: 80px">{{ catagoryName }}</span>
        </el-row>
      </el-form>
      <el-tabs
        v-model="activeKey"
        type="card"
        class="rank_tab"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.label"
          :label="item.label"
          :name="item.status"
        >
          <vxe-table
            ref="rankingTable"
            :data="rankingList"
            :height="height"
            :show-overflow="true"
            :scroll-y="{ gt: 10 }"
            border
          >
            <vxe-column title="排名" type="seq" width="60">
              <template #default="{ row }">
                <div style="position: relative" class="sort_box">
                  <div v-if="row.sort === 1">
                    <img src="@/assets/layout/ranking_gold1.png" />
                  </div>
                  <div v-if="row.sort === 2">
                    <img src="@/assets/layout/ranking_sliver.png" />
                  </div>
                  <div v-if="row.sort === 3">
                    <img src="@/assets/layout/ranking_copper.png" />
                  </div>
                  <div :class="[1, 2, 3].includes(row.sort) ? 'sort_text' : ''">
                    {{ row.sort }}
                  </div>
                </div>
              </template>
            </vxe-column>
            <vxe-column title="图片" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.imgUrl || ''" />
              </template>
            </vxe-column>
            <vxe-column title="itemID" field="itemId"></vxe-column>
            <vxe-column title="标题" field="title"></vxe-column>
            <vxe-column title="商品评分" field="goodsScore"></vxe-column>
            <vxe-column title="30天买家数" field="buyerNum"></vxe-column>
            <vxe-column title="30天销量" field="soldOut"></vxe-column>
            <vxe-column title="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" @click="handleSearchOrigin(row)"
                  >查找货源</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <CateDialog
      v-if="showCateDialog"
      ref="cateDialog"
      :show-dialog="showCateDialog"
      :handle-cate-dialog-type="'1688'"
      @close-dialog="handleCateDialogClose($event)"
    />
  </div>
</template>
<script name="productnewprod1688list" setup>
  import { ref, computed } from 'vue';
  import { get1688RankingList } from '@/api/product/newprod/1688list.js';
  import CateDialog from '@/components/CateDialog.vue';
  import { ElMessage } from 'element-plus';
  import ImagePop from '@/components/ImagePop/index.vue';
  const category = ref([]);
  const catagoryName = ref('');
  const tabList = ref([
    { label: '越南热销榜', status: '越南热销榜' },
    { label: '越南趋势榜', status: '越南趋势榜' },
    { label: '主播热卖榜', status: '主播热卖榜' },
    { label: '主播热推榜', status: '主播热推榜' },
    { label: '主播新兴榜', status: '主播新兴榜' },
    { label: '综合榜', status: '综合榜' },
    { label: '热销榜', status: '热销榜' },
    { label: '好价榜', status: '好价榜' }
  ]);

  const activeKey = ref('越南热销榜');
  const rankingList = ref([]);

  // 获取榜单数据
  const getRankingList = async () => {
    const params = {
      categoryId: category.value,
      rankCnName: activeKey.value,
      limit: 20
    };
    const { data } = await get1688RankingList(params);
    // rankingList.value = data?.rankProductModels || [];
    rankingList.value = arrSortByKey(
      data?.rankProductModels || [],
      'sort',
      true
    );
  };

  const arrSortByKey = (array, property, desc) => {
    return array.sort(function (a, b) {
      let value1 = a[property],
        value2 = b[property];
      if (desc) {
        //升序
        return value1 - value2;
      } else {
        //降序
        return value2 - value1;
      }
    });
  };

  const showCateDialog = ref(false);
  const chooseCate = () => {
    showCateDialog.value = true;
  };

  const handleCateDialogClose = (e) => {
    showCateDialog.value = e.isShow;
    if (!e.cate) {
      return;
    }
    catagoryName.value = e.cate.value.fullCateName;
    category.value = e.cate.value.categoryId;

    if (category.value) {
      getRankingList();
    }
  };

  const handleDelCate = () => {
    category.value = null;
    catagoryName.value = '';
  };

  // 切换 tab
  const handleClick = (tab) => {
    activeKey.value = tab.props.name;
    if (category.value?.length === 0 || !category.value) {
      return ElMessage.warning('请先选择类目');
    }
    getRankingList();
  };
  // 查找货源
  const handleSearchOrigin = (row) => {
    if (!row.imgUrl) {
      return ElMessage.warning('无图片不可查找货源');
    }
    window.open('https://www.1688.com?pordUrl=' + row.imgUrl);
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 245;
  });
</script>
<style lang="scss" scoped>
  .rank_tab {
    margin-top: 50px;
  }
  .sort_box {
    width: 24px;
    height: 24px;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .sort_text {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 12px;
    color: #fff;
  }
  .gray_text {
    margin-left: 5px;
    color: #606266;
    cursor: pointer;
  }
</style>
