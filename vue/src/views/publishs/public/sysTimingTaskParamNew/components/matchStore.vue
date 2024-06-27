<template>
  <el-dialog
    v-model="showDialog"
    title="匹配店铺"
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
            key-field="id"
            class="recycle-scroller"
          >
            <!-- 这里就是自己要渲染的每一项的内容-->
            <el-checkbox :key="item.id" :label="item.id">
              {{ item.storeAcct }}
            </el-checkbox>
          </RecycleScroller>
        </el-checkbox-group>
      </div>
      <div class="layer-data" size="default">
        <el-tag type="success" size="default"> 选中结果 </el-tag>
        <el-checkbox-group
          v-model="selectedIdsArr"
          size="default"
          @change="selectedCheckedHandle"
        >
          <!-- <el-checkbox
            v-for="item in selectedData"
            :key="item.id"
            :label="item.id"
            >{{ item.storeAcct }}
          </el-checkbox> -->
          <RecycleScroller
            v-slot="{ item }"
            :items="selectedData"
            :item-size="30"
            :item-secondary-size="200"
            :grid-items="3"
            key-field="id"
            class="recycle-scroller"
          >
            <!-- 这里就是自己要渲染的每一项的内容-->
            <el-checkbox :key="item.id" :label="item.id">
              {{ item.storeAcct }}
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
  import { computed, ref } from 'vue';
  import {
    getMatchStore,
    setMatchStore
  } from '@/api/publishs/sysTimingTaskParamNew';
  import { ElMessage } from 'element-plus';
  const emits = defineEmits(['close', 'update:isVisible', 'save']);
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    //接口请求参数
    msInfo: {
      type: Object,
      default: () => {}
    }
  });
  const showDialog = computed({
    get() {
      return props.isVisible;
    },
    set(newVal) {
      emits('update:isVisible', newVal);
    }
  });
  //公共数据
  const dialogObj = computed(() => {
    return props.msInfo;
  });
  // 关闭弹窗
  const handleClose = () => {
    emits('close');
  };
  //数据
  let storeAcctStr = ref('');
  const searchIdsArr = ref([]); //搜索结果勾选的数据
  const searchData = ref([]); //搜索结果
  let searchAllCked = ref(false); //搜索全选
  const selectedIdsArr = ref([]); //选中结果勾选的数据
  const selectedData = ref([]); //选中结果
  //数据回显
  getMatchStore({
    ...dialogObj.value
  }).then((res) => {
    if (res.code === '0000') {
      selectedData.value = res.data.filter((item) => item.isMatch);
      selectedIdsArr.value = selectedData.value.map((item) => item.id);
    }
  });

  //搜索结构全选逻辑
  const searchCkAllhandle = (val) => {
    searchAllCked.value = val;
    if (val) {
      let idsArr = searchData.value.map((item) => item.id);
      searchIdsArr.value = idsArr;
      //获取searchData在selectedData中的数据
      let arr = selectedData.value.filter((item) => idsArr.includes(item.id));
      let arrIdsArr = arr.map((item) => item.id);
      //获取需要添加到selectedData中的数据
      let needAddToSelectedIdsArr = idsArr.filter(
        (item) => !arrIdsArr.includes(item)
      );
      //根据needAddToSelectedIdsArr获取searchData中的数据
      let needAddToSelectedData = searchData.value.filter((item) =>
        needAddToSelectedIdsArr.includes(item.id)
      );
      selectedData.value = selectedData.value.concat(needAddToSelectedData);
      selectedIdsArr.value = selectedIdsArr.value.concat(
        needAddToSelectedIdsArr
      );
    } else {
      searchIdsArr.value = [];
      let idsArr = searchData.value.map((item) => item.id);
      //获取searchData在selectedData中的数据
      let arr = selectedData.value.filter((item) => idsArr.includes(item.id));
      let arrIdsArr = arr.map((item) => item.id);
      //从selectedData中移除arr
      selectedData.value = selectedData.value.filter(
        (item) => !arrIdsArr.includes(item.id)
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
    //获取到searchData和selectedData的交集data,获得当前搜索数据的选中部分
    let idsArr = searchData.value.map((item) => item.id);
    let intersectionData = selectedData.value.filter((item) =>
      idsArr.includes(item.id)
    );
    //根据val值来匹配交集数据是否还在选中里
    let arr = intersectionData.filter((item) => val.includes(item.id));
    let arrIdsArr = arr.map((item) => item.id);
    //获取到在intersectionIdsArr不在arr中的元素删除
    let handleArr = intersectionData.filter(
      (item) => !arrIdsArr.includes(item.id)
    );
    let handleIdsArr = handleArr.map((item) => item.id);
    //循环arr添加到selectedData中,如果存在id在arrIdsArr中
    selectedData.value = selectedData.value.filter(
      (item) => !handleIdsArr.includes(item.id)
    );
    //选中selectedData中的数据添加arr中的数据
    // selectedData.value = selectedData.value.concat(arr);
    //根据val获取searchData中的数据
    let arr2 = searchData.value.filter((item) => val.includes(item.id));
    //如果arr2中的数据在selectedData中不存在，则添加到selectedData中
    let currentSelectedIdsArr = selectedData.value.map((item) => item.id);
    arr2.forEach((item) => {
      if (!currentSelectedIdsArr.includes(item.id)) {
        selectedData.value.push(item);
      }
      if (!selectedIdsArr.value.includes(item.id)) {
        selectedIdsArr.value.push(item.id);
      }
    });
  };
  //选中数据的点击事件
  const selectedCheckedHandle = (val) => {
    //筛选出selectData中所有在val中的数据
    let arr = selectedData.value.filter((item) => val.includes(item.id));
    selectedData.value = arr;
    selectedIdsArr.value = val;
  };

  //查询匹配的店铺逻辑
  const searchHandle = () => {
    //搜索时，搜索全选取消
    searchAllCked.value = false;
    //渲染搜索结果
    getMatchStore({
      ...dialogObj.value,
      storeAcctStr: storeAcctStr.value
    }).then((res) => {
      if (res.code === '0000') {
        searchData.value = res.data;
        //搜索结果勾选
        searchIdsArr.value = searchData.value
          .filter((item) => item.isMatch)
          .map((item) => item.id);
        //全选是否勾选
        if (searchData.value.length === searchIdsArr.value.length) {
          searchAllCked.value = true;
        }
      }
    });
  };

  //保存
  const saveHandle = async () => {
    try {
      let params = {
        storeAcctIdList: selectedData.value.map((item) => item.id),
        id: props.msInfo.id
      };
      const { code } = await setMatchStore(params);
      if (code === '0000') {
        ElMessage.success('保存成功！');
        emits('save');
        handleClose();
      }
    } catch (err) {
      console.log(err);
      handleClose();
    }
  };
</script>

<style lang="scss" scoped>
  .matchStore-layer {
    z-index: 1000;
    height: 100%;
    .recycle-scroller {
      height: 250px;
    }
    .dialog-layer {
      height: calc(100vh - 250px);
      overflow-y: hidden;
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
