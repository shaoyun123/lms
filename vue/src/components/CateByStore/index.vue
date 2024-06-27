<template>
  <el-dialog
    title="选择分类"
    width="80%"
    :model-value="showDialog"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <!-- <el-form :model="formData" status-icon> -->
    <el-form-item label="">
      <el-input
        v-model="formData.searchKey"
        style="width: 100%"
        @keyup.enter.prevent="cateDialogVisiable()"
      ></el-input>
    </el-form-item>
    <!-- </el-form> -->
    <el-cascader-panel
      ref="cateRef"
      v-model="formData.cateId"
      :options="options"
      :props="propsTo"
    />
    <template #footer>
      <span>
        <el-button @click="closeDialog()">取消</el-button>
        <el-button @click="getCateCheckedNodes">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, reactive } from 'vue';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: true
    },
    getCateApi: {
      type: Function,
      default: () => {}
    },
    pCateId: {
      type: Number,
      default: -1
    },
    storeAcctIdList: {
      type: Array,
      default: () => []
    },
    needLeaf: {
      type: Boolean,
      default: true
    },
    platCode: {
      type: String,
      default: ''
    }
  });
  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    emit('closeDialog', { isShow: false });
  };

  const formData = reactive({
    searchKey: '',
    cateId: null
  });

  //  商品类目
  const options = ref([]);
  const propsTo = ref({});
  propsTo.value = {
    lazy: true,
    async lazyLoad(node, resolve) {
      const { data } = node;
      curCateInfo.value = node;
      let res = {},
        nodes;

      // 半托管不传店铺
      const storeObj =
        props.platCode !== 'AE半托管'
          ? { storeAcctIds: props.storeAcctIdList.join(',') }
          : {};

      res = await props.getCateApi({
        // storeAcctIds: props.storeAcctIdList.join(','),
        ...storeObj,
        pCateId: data.id || 0
      });
      nodes = (res.data || []).map((item) => ({
        id: item.id,
        value: item.id,
        label: item.cateCnName + '(' + item.cateEnName + ')',
        leaf: item.isLeafCate
      }));

      resolve(nodes);
    }
  };
  const cateDialogVisiable = async () => {
    let res = {};
    let params = {
      storeAcctId: props.storeAcctIdList.join(',')
    };
    if (formData.searchKey) {
      params.searchKey = formData.searchKey;
    } else {
      params.pCateId = 0;
    }
    res = await props.getCateApi(params);
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
  };

  const cateRef = ref();
  const curCateInfo = ref({});

  const getCateCheckedNodes = async () => {
    // 需要子节点
    if (cateRef.value.getCheckedNodes()[0]) {
      curCateInfo.value = cateRef.value.getCheckedNodes()[0];
      if (props.needLeaf) {
        if (!curCateInfo.value?.isLeaf) {
          return ElMessage.warning('目前仅支持到子节点');
        }
      }
    } else {
      if (props.needLeaf) {
        if (!curCateInfo.value?.isLeaf) {
          return ElMessage.warning('目前仅支持到子节点');
        }
      }
    }
    emit('closeDialog', { isShow: false, cate: curCateInfo.value });
  };
</script>
