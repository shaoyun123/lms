<template>
  <el-dialog
    v-model="showDialog"
    title="匹配店铺(停用店铺不显示)"
    width="668"
    class="matchStore-layer"
    draggable
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-layer">
      <div class="layer-search">
        <el-input
          v-model="storeAcctStr"
          placeholder="请输入店铺"
          size="default"
          @keyup.enter="searchHandle"
        />
        <el-button type="primary" size="default" @click="searchHandle">
          搜索
        </el-button>
      </div>
      <div class="layer-data">
        <el-tag size="default"> 搜索结果 </el-tag>
        <el-checkbox
          v-model="searchAllCked"
          size="default"
          @change="searchCkAllhandle"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          v-model="searchIdsArr"
          size="default"
          @change="searchCheckedHandle"
        >
          <RecycleScroller
            v-slot="{ item }"
            :items="searchData"
            :item-size="30"
            :item-secondary-size="200"
            :grid-items="3"
            key-field="storeAcctId"
            class="recycle-scroller"
          >
            <!-- 这里就是自己要渲染的每一项的内容-->
            <el-checkbox :key="item.storeAcctId" :label="item.storeAcctId">
              {{ item.storeAcct }}
            </el-checkbox>
          </RecycleScroller>
        </el-checkbox-group>
      </div>
      <div class="layer-data" size="default" style="position: relative">
        <el-tag type="success" size="default"> 选中结果 </el-tag>
        <div style="position: absolute; right: 100px">
          <el-button type="primary" @click="copySelected">一键复制</el-button>
          <el-button type="primary" @click="resetSelected">清空</el-button>
        </div>

        <el-checkbox-group
          v-model="selectedIdsArr"
          size="default"
          @change="selectedCheckedHandle"
        >
          <RecycleScroller
            v-slot="{ item }"
            :items="selectedData"
            :item-size="30"
            :item-secondary-size="200"
            :grid-items="3"
            key-field="storeAcctId"
            class="recycle-scroller"
          >
            <!-- 这里就是自己要渲染的每一项的内容-->
            <el-checkbox
              :key="item.storeAcctId"
              :label="item.storeAcctId"
              :disabled="!item.hasAuthority"
            >
              <span> {{ item.storeAcct }}</span>
            </el-checkbox>
          </RecycleScroller>
        </el-checkbox-group>
      </div>
    </div>
    <template #footer>
      <span class="dialog-layer-footer">
        <el-button size="default" type="primary" @click="saveHandle">
          保存
        </el-button>
        <el-button size="default" @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { getCheckedStoreApi, saveApi } from '@/api/shopee/autosetlistingtag';
  import { copy } from '@/utils/common';
  import { cloneDeep } from 'lodash-es';
  import { ElMessage } from 'element-plus';
  const emits = defineEmits(['update:modelValue', 'freshList']);
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: () => ({})
    }
  });
  const showDialog = computed({
    get() {
      return props.modelValue;
    },
    set(newVal) {
      emits('update:modelValue', newVal);
    }
  });

  // 关闭弹窗
  const handleClose = () => {
    showDialog.value = false;
  };
  //数据
  let storeAcctStr = ref('');
  const searchIdsArr = ref([]); //搜索结果勾选的数据
  const searchData = ref([]); //搜索结果
  let searchAllCked = ref(false); //搜索全选
  const selectedIdsArr = ref([]); //选中结果勾选的数据
  const selectedData = ref([]); //选中结果
  onMounted(async () => {
    //数据回显,已选中的店铺
    const { id, configShopList } = props.detailData;
    const { data } = await getCheckedStoreApi({
      configId: id,
      storeAcctList: configShopList.map((v) => v.storeAcct).join()
    });
    if (configShopList.length) {
      selectedData.value = (data || []).map((item) => ({
        ...item,
        ifMatch: true
      }));
    } else {
      selectedData.value = [];
    }

    selectedIdsArr.value = selectedData.value.map((item) => item.storeAcctId);
  });

  //搜索结构全选逻辑
  const searchCkAllhandle = (val) => {
    searchAllCked.value = val;
    if (val) {
      let storeAcctIdList = searchData.value.map((item) => item.storeAcctId);
      searchIdsArr.value = storeAcctIdList;
      //获取searchData在selectedData中的数据
      let arr = selectedData.value.filter((item) =>
        storeAcctIdList.includes(item.storeAcctId)
      );
      let arrIdsArr = arr.map((item) => item.storeAcctId);
      //获取需要添加到selectedData中的数据
      let needAddToSelectedIdsArr = storeAcctIdList.filter(
        (item) => !arrIdsArr.includes(item)
      );
      //根据needAddToSelectedIdsArr获取searchData中的数据
      let needAddToSelectedData = searchData.value.filter((item) =>
        needAddToSelectedIdsArr.includes(item.storeAcctId)
      );
      selectedData.value = selectedData.value.concat(needAddToSelectedData);
      selectedIdsArr.value = selectedIdsArr.value.concat(
        needAddToSelectedIdsArr
      );
    } else {
      searchIdsArr.value = [];
      let storeAcctIdList = searchData.value.map((item) => item.storeAcctId);
      //获取searchData在selectedData中的数据
      let arr = selectedData.value.filter((item) =>
        storeAcctIdList.includes(item.storeAcctId)
      );
      let arrIdsArr = arr.map((item) => item.storeAcctId);
      //从selectedData中移除arr
      selectedData.value = selectedData.value.filter(
        (item) => !arrIdsArr.includes(item.storeAcctId)
      );
      //从selectedIdsArr中移除arrIdsArr
      selectedIdsArr.value = selectedIdsArr.value.filter(
        (item) => !arrIdsArr.includes(item)
      );
    }
  };
  //搜索数据的点击事件
  const searchCheckedHandle = (val) => {
    if (val.length == searchData.value.length) {
      searchAllCked.value = true;
    } else {
      searchAllCked.value = false;
    }
    //获取到searchData和selectedData的交集data,作为点击的数据源
    let storeAcctIdList = searchData.value.map((item) => item.storeAcctId);
    let intersectionData = selectedData.value.filter((item) =>
      storeAcctIdList.includes(item.storeAcctId)
    );
    // let intersectionIdsArr = intersectionData.map((item) => item.id);
    //根据val值来匹配交集数据
    let arr = intersectionData.filter((item) => val.includes(item.storeAcctId));
    let arrIdsArr = arr.map((item) => item.storeAcctId);
    //获取到在intersectionIdsArr不在arr中的元素删除
    let handleArr = intersectionData.filter(
      (item) => !arrIdsArr.includes(item.storeAcctId)
    );
    let handleIdsArr = handleArr.map((item) => item.storeAcctId);
    //循环arr添加到selectedData中,如果存在id在arrIdsArr中
    selectedData.value = selectedData.value.filter(
      (item) => !handleIdsArr.includes(item.storeAcctId)
    );
    //选中selectedData中的数据添加arr中的数据
    // selectedData.value = selectedData.value.concat(arr);
    //根据val获取searchData中的数据
    let arr2 = searchData.value.filter((item) =>
      val.includes(item.storeAcctId)
    );
    //如果arr2中的数据在selectedData中不存在，则添加到selectedData中
    let currentSelectedIdsArr = selectedData.value.map(
      (item) => item.storeAcctId
    );
    arr2.forEach((item) => {
      if (!currentSelectedIdsArr.includes(item.storeAcctId)) {
        selectedData.value.push(item);
      }
      if (!selectedIdsArr.value.includes(item.storeAcctId)) {
        selectedIdsArr.value.push(item.storeAcctId);
      }
    });
  };
  //选中数据的点击事件
  const selectedCheckedHandle = (val) => {
    //筛选出selectData中所有在val中的数据
    let arr = selectedData.value.filter((item) =>
      val.includes(item.storeAcctId)
    );
    selectedData.value = arr;
    selectedIdsArr.value = val;
    searchIdsArr.value = selectedData.value.map((item) => item.storeAcctId);
  };

  //查询匹配的店铺逻辑
  const searchHandle = () => {
    //搜索时，搜索全选取消
    searchAllCked.value = false;
    //渲染搜索结果
    getCheckedStoreApi({
      storeAcctList: storeAcctStr.value,
      configId: props.detailData.id
    }).then((res) => {
      if (res.code === '0000') {
        searchData.value = res.data
          .filter((v) => v.hasAuthority)
          .map((item) => ({
            ...item,
            id: item.storeAcctId,
            storeAcct: item.storeAcct
          }));
        //搜索结果勾选
        searchIdsArr.value = selectedData.value.map((item) => item.storeAcctId);
        //全选是否勾选
        if (searchData.value.length === searchIdsArr.value.length) {
          searchAllCked.value = true;
        }
      }
    });
  };
  // 一键复制
  const copySelected = () => {
    let storeAcctList = selectedData.value.map((item) => item.storeAcct);
    copy(storeAcctList.join(','));
  };
  //   清空
  const resetSelected = () => {
    selectedIdsArr.value = selectedIdsArr.value.filter((v) => !v.hasAuthority);
    selectedData.value = selectedData.value.filter((v) => !v.hasAuthority);
    searchIdsArr.value = searchIdsArr.value.filter((v) => !v.hasAuthority);
    searchAllCked.value = false;
  };

  //保存

  const saveHandle = async () => {
    const params = cloneDeep(props.detailData);
    if (params.autoAdjustPriceLogEnumList) {
      delete params.autoAdjustPriceLogEnumList;
    }
    if (params.filterTypes) {
      delete params.filterTypes;
    }
    const configShopList = selectedData.value.map((v) => ({
      storeAcct: v.storeAcct,
      storeAcctId: v.storeAcctId
    }));
    const { msg } = await saveApi({
      ...params,
      shopChanged: true,
      configShopList
    });
    ElMessage.success(msg);
    showDialog.value = false;
    emits('freshList');
  };
</script>

<style lang="scss" scoped>
  .matchStore-layer {
    z-index: 1000;
    height: 100%;
    .recycle-scroller {
      height: 200px;
    }
    .dialog-layer {
      height: calc(100vh - 340px);
      overflow-y: auto;
      .layer-search {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .el-input {
          width: 300px;
          margin-right: 10px;
        }
      }
      .layer-data {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
