<template>
  <el-dialog
    title="选择分类"
    width="100%"
    :model-value="showCatsDialog"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <el-form-item label="">
      <el-input
        v-model="formData.cateSearch"
        style="width: 100%"
        clearable
        @keyup.enter.prevent="cateDialogVisiable('enter')"
      ></el-input>
    </el-form-item>
    <el-cascader-panel
      ref="cateRef"
      :options="options"
      :props="propsTo"
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
  import { ref, defineProps, defineEmits, reactive, onMounted } from 'vue';

  import { getSubCat } from '@/api/publishs/temupublish';

  const props = defineProps({
    showCatsDialog: {
      type: Boolean,
      default: true
    }
  });
  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    emit('closeDialog', { isShow: false });
  };
  console.log(props.showCatsDialog);

  const formData = reactive({
    cateSearch: ''
  });

  onMounted(() => {
    setProp();
  });

  //  商品类目
  const options = ref([]);
  const propsTo = ref({});
  const setProp = () => {
    propsTo.value = {
      lazy: true,
      async lazyLoad(node, resolve) {
        const { data } = node;
        let res = {},
          nodes;
        let params = {
          salesSite: 'US',
          catTreeName: formData.cateSearch,
          catId: data.catId || 0
        };
        res = await getSubCat(params);
        nodes = res.data.map((item) => ({
          catId: item.catId,
          value: item.catId,
          label: item.catName,
          leaf: item.isLeaf
        }));
        resolve(nodes);
      }
    };
  };

  // 关键词搜索
  const cateDialogVisiable = async (type) => {
    if (type == 'enter') {
      let res = {};
      let params = {
        catTreeName: formData.cateSearch,
        salesSite: 'US'
      };
      formData.cateSearch === '' ? (params.catId = 0) : delete params.catId;
      res = await getSubCat(params);
      if (res.data && res.data.length != 0) {
        options.value = res.data.map((item) => ({
          catId: item.catId,
          value: item.catId,
          label: item.catName,
          leaf: item.isLeaf
        }));
      } else {
        options.value = [];
        propsTo.value = {};
      }
      setProp();
    }
  };

  const cateRef = ref();
  const cate = ref({
    fullCateName: '',
    allCatsIds: []
  });

  const getCateCheckedNodes = async () => {
    cate.value.fullCateName = cateRef.value
      .getCheckedNodes()[0]
      .pathLabels.join('>');
    cate.value.allCatsIds = cateRef.value.getCheckedNodes()[0].pathValues;
    emit('closeDialog', { isShow: false, cate });
  };
</script>
