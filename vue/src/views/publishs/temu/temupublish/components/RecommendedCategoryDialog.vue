<template>
  <div>
    <el-dialog
      :model-value="showDialog"
      class="dialog_wrapper"
      title="推荐类目"
      width="40%"
      align-center
      style="height: 400px; overflow: auto"
      :close-on-click-modal="false"
      @close="close"
    >
      <div>
        <div class="flex">
          <el-form label-width="100px" :model="formData" class="flex-1">
            <el-form-item>
              <template #label>
                <el-radio v-model="title" value="cnTitle" size="large">
                  <template #default>
                    <span>中文标题</span>
                  </template></el-radio
                >
              </template>
              <template #default>
                <el-input v-model="formData.cnTitle" autosize type="textarea"
              /></template>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-radio v-model="title" value="enTitle" size="large">
                  <template #default>
                    <span>英文标题</span>
                  </template></el-radio
                >
              </template>
              <template #default>
                <el-input v-model="formData.enTitle" autosize type="textarea"
              /></template>
            </el-form-item>
          </el-form>
          <div class="flex-center w-20">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <div></div>
            <el-button @click="clear">清空</el-button>
          </div>
        </div>
        <div class="h-130 category_box">
          <div v-if="cateName">
            <el-radio v-model="cateRadio" :value="1" size="large">{{
              cateName
            }}</el-radio>
          </div>
          <div v-else class="empty_box">
            未查询到推荐类目, 请更换查询关键词、语言后重试或手动选择商品类目！
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleChecked">选择类目</el-button>
        <el-button @click="close">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted, reactive } from 'vue';
  import { getRecommendCateByTitleApi } from '@/api/publishs/temupublish';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: true
    },
    info: {
      type: Object,
      default: () => {}
    }
  });

  const emits = defineEmits(['close', 'done']);
  const formData = reactive({});

  onMounted(() => {
    // 初始展示
    const { cnTitle, enTitle } = props.info;
    formData.cnTitle = cnTitle;
    formData.enTitle = enTitle;
    handleSearch();
  });

  const title = ref('cnTitle'); // 标题单选框
  const cateRadio = ref(1);
  const cateInfo = ref({});
  const cateName = ref('');

  // 查询
  const handleSearch = async () => {
    const { storeAcctId, salesSite } = props.info;
    if (!formData[title.value]) {
      return ElMessage.warning('所选类型文本框值不能为空!');
    }
    const params = {};
    if (title.value === 'cnTitle') {
      params.cnTitle = formData[title.value];
    } else {
      params.enTitle = formData[title.value];
    }
    const { code, data } = await getRecommendCateByTitleApi({
      storeAcctId,
      salesSite,
      ...params
    });
    if (code === '0000') {
      cateInfo.value = data;
      cateName.value = data[0].catTreeName;
    } else {
      cateName.value = '';
    }
  };

  // 点击选择类目
  const handleChecked = () => {
    if (cateName.value) {
      emits('done', cateInfo.value);
    } else {
      ElMessage.warning('请先选择推荐类目！');
    }
  };

  // 清空 当前选中哪个清哪个
  const clear = () => {
    formData[title.value] = '';
  };

  // 关闭
  const close = () => {
    emits('close');
  };
</script>

<style lang="scss" scoped>
  .flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
  .flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .category_box {
    width: 95%;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px;
    font-size: 16px;
  }
  .empty_box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  .w-20 {
    width: 20%;
  }
  .h-130 {
    height: 130px;
  }
</style>
