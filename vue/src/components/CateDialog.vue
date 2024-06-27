<template>
  <el-dialog
    title="选择分类"
    width="90%"
    class="cate_dialog"
    :model-value="showDialog"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <!-- <el-form :model="formData" status-icon> -->
    <el-form-item label="">
      <el-input
        v-model="formData.cateSearch"
        style="width: 100%"
        @keyup.enter.prevent="cateDialogVisiable('enter')"
      ></el-input>
    </el-form-item>
    <!-- </el-form> -->
    <el-cascader-panel
      ref="cateRef"
      :options="options"
      :props="propsTo"
      :popper-class="customPopperClass"
      @change="getCateCheckedNodes"
    />
    <template #footer>
      <span>
        <el-button @click="closeDialog()">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ref, reactive, toRefs, defineProps, defineEmits } from 'vue';
  import { searchCates, queryForCreate } from '@/api/publishs/mercadotemp';
  import { getSheinCateList } from '@/api/publishs/sheinmallpublish';
  import { queryCateList } from '@/api/publishs/miraviapublish';
  import {
    get1688Catagory,
    queryCateLike
  } from '@/api/product/newprod/1688list.js';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: true
    },
    handleCateDialogType: {
      type: String,
      default: ''
    },
    prodPId: {
      type: Number,
      default: -1
    },
    storeAcctId: {
      type: Number,
      default: -1
    }
  });
  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    emit('closeDialog', { isShow: false });
  };
  const { handleCateDialogType, prodPId, storeAcctId } = toRefs(props);

  const formData = reactive({
    cateSearch: ''
  });

  //  商品类目
  const options = ref([]);
  const propsTo = ref({});
  propsTo.value = {
    lazy: true,
    async lazyLoad(node, resolve) {
      const { data } = node;
      let res = {},
        nodes;
      if (handleCateDialogType.value == 'shein') {
        res = await getSheinCateList({
          storeAcctId: storeAcctId.value,
          pCateId: data.id || 0,
          isMall: true, // true:商城；false:自营
          searchKey: formData.cateSearch
        });
        nodes = res.data.map((item) => ({
          id: item.categoryId,
          value: item.categoryId,
          label: item.categoryName,
          leaf: item.lastCategory
        }));
      } else if (handleCateDialogType.value == 'miravia') {
        res = await queryCateList({
          parentCateId: data.id || data.id == 0 ? data.id : '',
          categoryTreeName: data.label || '',
          storeAcctId: storeAcctId.value
        });
        nodes = res.data.map((item) => ({
          id: item.categoryId,
          value: item.categoryId,
          label: item.categoryName,
          leaf: item.leaf
        }));
      } else if (handleCateDialogType.value == '1688') {
        let params = {
          categoryId: data.categoryId || 0
        };
        res = await get1688Catagory(params);
        nodes = res.data.map((item) => ({
          categoryId: item.categoryId,
          value: item.categoryId,
          label: item.name,
          leaf: item.ifLeaf
        }));
      } else {
        res = await searchCates({
          cateTreeName: '',
          pcateId: data.id || '',
          platCode: handleCateDialogType.value
        });
        nodes = res.data.map((item) => ({
          id: item.id,
          value: item.id,
          label: item.cateName,
          leaf: item.isLeafCate
        }));
      }

      resolve(nodes);
    }
  };
  const cateDialogVisiable = async (type) => {
    if (type == 'enter') {
      let res = {};
      if (handleCateDialogType.value == 'shein') {
        res = await getSheinCateList({
          storeAcctId: props.storeAcctId,
          isMall: true, // true:商城；false:自营
          searchKey: formData.cateSearch
        });
        if (res.data && res.data.length != 0) {
          options.value = res.data.map((item) => ({
            id: item.categoryId,
            value: item.categoryId,
            label: item.categoryName,
            leaf: item.lastCategory
          }));
        } else {
          options.value = [];
          propsTo.value = {};
        }
      } else if (handleCateDialogType.value == 'miravia') {
        res = await queryCateList({
          parentCateId: '',
          categoryTreeName: formData.cateSearch,
          storeAcctId: storeAcctId.value
        });
        if (res.data && res.data.length != 0) {
          options.value = res.data.map((item) => ({
            id: item.categoryId,
            value: item.categoryId,
            label: item.categoryTreeName,
            leaf: item.leaf
          }));
        } else {
          options.value = [];
          propsTo.value = {};
        }
      } else if (handleCateDialogType.value == '1688') {
        res = await queryCateLike({
          rankCnName: formData.cateSearch
        });
        if (res.data && res.data.length != 0) {
          options.value = res.data.map((item) => ({
            id: item.categoryId,
            categoryId: item.categoryId,
            value: item.categoryId,
            label: item.pNamePath,
            leaf: item.ifLeaf
          }));
        } else {
          options.value = [];
          propsTo.value = {};
        }
      } else {
        res = await searchCates({
          cateTreeName: formData.cateSearch,
          platCode: handleCateDialogType.value
        });
        if (res.data && res.data.length != 0) {
          options.value = res.data.map((item) => ({
            id: item.id,
            value: item.id,
            label: item.cateTreeName,
            leaf: item.isLeafCate
          }));
        } else {
          options.value = [];
          propsTo.value = {};
        }
      }
    }
  };

  const cateRef = ref();
  const cate = ref({
    fullCateName: '',
    categoryId: '',
    multiSub: '',
    must: '',
    normalAttrList: [],
    salePropAttrList: [],
    skuInfoList: []
  });
  const getCateCheckedNodes = async () => {
    cate.value.fullCateName = cateRef.value
      .getCheckedNodes()[0]
      .pathLabels.join('->');
    cate.value.categoryId = cateRef.value.getCheckedNodes()[0].value;
    if (handleCateDialogType.value == 'mercado') {
      cate.value.categoryId = 'CBT' + cateRef.value.getCheckedNodes()[0].value;
      const { data } = await queryForCreate({
        categoryId: 'CBT' + cateRef.value.getCheckedNodes()[0].value,
        prodPId: prodPId.value,
        modify: 'auto'
      });
      // 根据美客多类目获取商品属性
      cate.value.multiSub = data.multiSub;
      cate.value.must = data.must;
      cate.value.normalAttrList = data.normalAttrList;
      cate.value.salePropAttrList = data.salePropAttrList;
      cate.value.skuInfoList = data.skuInfoList;
    }
    emit('closeDialog', { isShow: false, cate });
  };
</script>
<style lang="scss">
  .cate_dialog {
    .el-dialog__body {
      .el-cascader-menu__wrap {
        height: 300px;
      }
    }
    .el-scrollbar .el-scrollbar__bar {
      opacity: 1 !important;
      display: block !important;
    }
  }
</style>
