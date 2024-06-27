<template>
  <el-dialog
    width="800px"
    :title="title"
    :model-value="showDialog"
    :close-on-click-modal="false"
    destroy-on-close
    @close="closeDialog"
    @export="exportDialog"
  >
    <el-divider content-position="left"
      ><span style="color: red">*</span>数据范围</el-divider
    >
    <el-radio-group v-model="formData.checkedType">
      <el-radio value="导出列表选中数据" size="large"
        >导出列表选中数据</el-radio
      >
      <el-radio value="导出查询条件中的数据" size="large"
        >导出查询条件中的数据</el-radio
      >
    </el-radio-group>
    <el-divider content-position="left">数据字段</el-divider>
    <el-dropdown
      style="float: right"
      size="small"
      split-button
      type="primary"
      @click="configNameDialogOpen"
    >
      保存配置
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in configOption"
            :key="item.id"
            @click="getOption(item.searchCondition)"
            >{{ item.searchConditionName
            }}<el-icon
              style="margin-left: 20px"
              @click.stop="optionDel(item.id)"
              ><Delete /></el-icon
          ></el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div v-for="(k, kIndex) in checkboxData" :key="k.field">
      <h1 style="font-size: 20px">
        {{ k.label }}
        <el-checkbox
          v-model="k.isChecked"
          label="全选"
          size="large"
          @change="changeAll(kIndex)"
        />
      </h1>
      <div
        v-for="(i, index) in k.children"
        :key="index"
        style="display: flex; align-items: center"
      >
        <div :style="getLabelStyle(i.label)">
          {{ i.label }}
        </div>
        <el-checkbox-group v-model="k.checkedData">
          <div v-for="j in i.children" :key="j.field" class="filed-checkbox">
            <el-checkbox
              :disabled="k.disabled?.includes(j.field)"
              :checked="k.disabled?.includes(j.field)"
              :label="j.field"
              :name="k.label"
              :title="j.name"
              @change="changeSingle(kIndex)"
              >{{ j.name }}</el-checkbox
            >
          </div>
        </el-checkbox-group>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" :loading="loading" @click="exportDialog"
        >导出</el-button
      >
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
  <!-- 停用&启用 -->
  <el-dialog v-model="configNameDialogVisible" width="30%" align-center>
    <el-form size="default">
      <el-form-item label="配置名称" required>
        <el-input v-model="configName" type="input" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="configNameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="configNameDialogSave()"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ref, toRefs, defineProps, defineEmits, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    searchConditionConfigList,
    searchConditionConfigNew,
    searchConditionConfigDel
  } from '@/api/publishs/aefullyhosted';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    checkboxData: {
      type: Array,
      default: null
    },
    configType: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '导出listing数据'
    },
    checkedRowList: {
      type: Array,
      default: () => []
    },
    useDefaultValue: {
      type: Boolean,
      default: false
    }
  });
  const { checkboxData, configType } = toRefs(props);

  // 自定义的配置选项
  const configOption = ref([]);
  // 自定义配置选项中选中的checkbox
  const checkedData = ref([]);
  const getConfigList = async () => {
    const { data } = await searchConditionConfigList({
      searchType: configType.value
    });
    configOption.value = data;
  };

  onMounted(async () => {
    await getConfigList();
    if (configOption.value.length != 0) {
      getOption(
        configOption.value[configOption.value.length - 1].searchCondition
      );
    } else if (!props.useDefaultValue) {
      // 全选
      checkboxData.value.forEach((item) => {
        let allCheckbox = [];
        item.children.forEach((item) => {
          allCheckbox = allCheckbox.concat(item.children);
        });
        item.checkedData = allCheckbox.map((item) => item.field);
        item.isChecked = true;
      });
    }
    // 如果有选中数据
    if (!props.checkedRowList.length) {
      formData.value.checkedType = '导出查询条件中的数据';
    }
    // 如果初始返回的是所有数据 全选按钮要联动
    checkboxData.value.forEach((item) => {
      if (item.checkedData.length === item.children?.[0]?.children.length) {
        item.isChecked = true;
      }
    });
  });

  // 全选/取消全选操作
  const changeAll = (index) => {
    let allCheckbox = [];
    checkboxData.value[index].children.forEach((item) => {
      allCheckbox = allCheckbox.concat(item.children);
    });
    if (checkboxData.value[index].isChecked) {
      checkboxData.value[index].checkedData = allCheckbox.map(
        (item) => item.field
      );
    } else {
      checkboxData.value[index].checkedData =
        checkboxData.value[index].disabled;
    }
  };

  // 单个选中/取消操作
  const changeSingle = (index) => {
    // 全选
    let allCheckbox = [];
    checkboxData.value[index].children.forEach((item) => {
      allCheckbox = allCheckbox.concat(item.children);
    });
    if (checkboxData.value[index].checkedData.length == allCheckbox.length) {
      checkboxData.value[index].isChecked = true;
    } else {
      checkboxData.value[index].isChecked = false;
    }
  };

  // 选中已保存的配置
  const getOption = (data) => {
    checkedData.value = JSON.parse(data);
    checkboxData.value.forEach((item) => {
      let allCheckbox = [];
      item.children.forEach((item) => {
        allCheckbox = allCheckbox.concat(item.children);
      });
      if (checkedData.value[`checkbox_${item.field}ExportProperties`]?.length) {
        item.checkedData =
          checkedData.value[`checkbox_${item.field}ExportProperties`].split(
            ','
          );
      } else {
        item.checkedData = [];
      }
      if (allCheckbox.length == item.checkedData.length) {
        item.isChecked = true;
      } else {
        item.isChecked = false;
      }
    });
  };

  const formData = ref({
    checkedType: '导出列表选中数据'
  });
  const getLabelStyle = (label) => {
    let obj = { width: '20px', margin: '10px', flex: 'none' };
    if (label) {
      obj.width = '140px';
    }
    return obj;
  };

  // 显示停用弹窗
  const configNameDialogVisible = ref(false);
  const configName = ref();
  const configNameDialogOpen = () => {
    configName.value = '';
    configNameDialogVisible.value = true;
  };

  // 保存配置
  const configNameDialogSave = async () => {
    if (!configName.value) {
      ElMessage.warning('请输入配置名称');
      return false;
    }
    let obj = {};
    checkboxData.value.forEach((item) => {
      obj[`${item.field}ExportProperties`] = 'on';
      obj[`checkbox_${item.field}ExportProperties`] =
        item.checkedData?.join(',');
    });
    // 传参--配置名称
    const { code } = await searchConditionConfigNew({
      searchType: configType.value,
      searchCondition: JSON.stringify(obj),
      searchConditionName: configName.value
    });
    if (code == '0000') {
      ElMessage.success('保存成功');
      getConfigList();
    }
    configNameDialogVisible.value = false;
  };
  // 删除配置
  const optionDel = async (id) => {
    const { code } = await searchConditionConfigDel(id);
    if (code == '0000') {
      ElMessage.success('删除成功');
      getConfigList();
    }
  };

  const emit = defineEmits(['closeDialog', 'exportDialog']);
  const closeDialog = () => {
    emit('closeDialog', { isShow: false });
  };

  const exportDialog = () => {
    if (!formData.value.checkedType) {
      ElMessage.warning('请选择需要导出的数据范围');
      return false;
    }

    emit('exportDialog', {
      checkedType: formData.value.checkedType,
      data: checkboxData.value
    });
  };
</script>
<style scoped lang="scss">
  .filed-checkbox {
    width: 120px;
    display: inline-block;
    :deep(.el-checkbox) {
      width: 100%;
    }
    :deep(.el-checkbox__label) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
