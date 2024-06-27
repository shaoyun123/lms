<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改标题"
      :width="1000"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :inline="true"
      >
        <el-form-item class="w100 vertical-top" prop="updateTitleWay">
          <el-select v-model="formData.updateTitleWay" filterable>
            <el-option value="replace" label="替换" />
            <el-option value="add" label="新增" />
          </el-select>
        </el-form-item>
        <!-- 替换 -->
        <template v-if="formData.updateTitleWay === 'replace'">
          <el-form-item label="原标题：" prop="title">
            <el-input
              v-model="title"
              type="textarea"
              style="width: 200px"
              placeholder="请输入需替换词，为空将全量调整标题"
            />
          </el-form-item>
          <el-form-item label="替换/修改为：" prop="newTitle">
            <el-input
              v-model="newTitle"
              type="textarea"
              style="width: 200px"
              placeholder="请输入，可用下划线代替原标题在其前后新增，例：_ apple"
            />
          </el-form-item>
        </template>
        <!-- 新增 -->
        <template v-else>
          <el-form-item label="新增词：" prop="newAddWord">
            <el-input
              v-model="formData.newAddWord"
              type="textarea"
              style="width: 200px"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            class="vertical-top"
            label="作为标题中的第"
            prop="index"
          >
            <el-tooltip
              effect="dark"
              content="支持输入数值，创建新的选项"
              placement="top-start"
            >
              <el-select
                v-model="formData.index"
                filterable
                allow-create
                class="w100"
              >
                <el-option :value="0" label="首" />
                <el-option :value="-1" label="末" />
              </el-select>
            </el-tooltip>
            <div>个词</div>
          </el-form-item>
          <el-form-item class="vertical-top">
            <el-button
              type="primary"
              title="将在刊登时生成标题规则基础上新增词后重新生成标题"
              @click="handleNew(formRef)"
              >重新生成</el-button
            >
          </el-form-item>
        </template>
        <el-form-item class="vertical-top">
          <el-button type="primary" @click="handleApply(formRef)"
            >一键应用</el-button
          >
          <el-button
            type="primary"
            :loading="batchAdjustLoading"
            @click="handleBatchAdjust"
            >批量调整</el-button
          >
        </el-form-item>
      </el-form>
      <div class="mb10">数量({{ totalCount }})</div>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="600"
        border
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺名称" width="90" />
        <vxe-column
          :field="curSetting.field"
          :title="curSetting.title"
          width="90"
        />
        <vxe-column field="productName" title="原标题">
          <template #default="{ row }">
            <!-- 高亮 -->
            <template v-if="!row.isMuchWords">
              <template
                v-for="(item, index) in row._productNameMuchList"
                :key="index"
              >
                <template v-if="isEndWithSymbol(item.label)">
                  <span :class="[item.isHighLight ? 'high_light_color' : '']"
                    >{{ item.label.substring(0, item.label.length - 2) }}
                  </span>
                  <span>{{ item.label.substr(-2) }} </span>
                </template>
                <span
                  v-else
                  :class="[item.isHighLight ? 'high_light_color' : '']"
                  >{{ item.label }}
                </span>
              </template>
            </template>
            <template v-else>
              <span
                v-for="(item, index) in row._productNameList"
                :key="index"
                :class="[item.isHighLight ? 'high_light_color' : '']"
                >{{ item.label }}</span
              >
            </template>
          </template>
        </vxe-column>
        <vxe-column
          field="updateProductName"
          title="修改为"
          :filter-multiple="false"
          :filters="updateProductNameOptions"
          :filter-method="filterUpdateProductName"
        >
          <template #default="{ row }">
            <PlatTitle
              v-model="row.updateProductName"
              :custom-type="'textarea'"
              :content-top="90"
              :rows="4"
              :prod-p-id="row.prodPId"
              :prod-p-sku="row.prodPSku"
              minlength="25"
              :max-length="255"
              show-word-limit
              :input-width="'100%'"
              @change="handleChangeProductName(row)"
            />
          </template>
        </vxe-column>
        <vxe-column field="result" title="操作结果" width="180">
          <template #default="{ row }">
            <div v-if="row.success" class="color_success">
              {{ row.success }}
            </div>
            <div v-else class="color_error">{{ row.result }}</div>
          </template>
        </vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
  import {
    batchModifyShopProductNameApi,
    regenerateTitleApi
  } from '@/api/publishs/tiktokonlineproduct';
  import { startsWith, trim, debounce } from 'lodash-es';
  import PlatTitle from '@/components/PlatTitle/index.vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    },
    platCode: {
      type: String,
      default: 'tiktok'
    }
  });

  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  //   配置项
  const settingInfo = {
    tiktok: {
      field: 'productId',
      title: 'product_id',
      listName: 'productIdList',
      fetchRegenerateTitle: regenerateTitleApi,
      fetchBatchModify: batchModifyShopProductNameApi
    }
  };
  const curSetting = computed(() => settingInfo[props.platCode]);
  const tableData = ref([]);
  const tableRef = ref();
  const totalCount = ref();
  const newTitle = ref();
  const title = ref();
  const formRef = ref();
  const formData = ref({
    updateTitleWay: 'replace', // 修改标题方式
    newAddWord: '', // 新增词
    index: 0 // 新增词位置
  });
  const validateIndex = (rule, value, callback) => {
    const { updateTitleWay } = formData.value;
    if (updateTitleWay === 'add') {
      if (typeof value === 'string' && (!Number(value) || Number(value) < 0)) {
        callback(new Error('仅支持输入正整数'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const formRules = reactive({
    index: [{ validator: validateIndex, trigger: 'change' }]
  });
  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表
  const tableDataLoading = ref(false);
  onMounted(async () => {
    handleSearch();
  });
  onUnmounted(() => {
    if (needFresh.value) {
      emits('handleSearch');
    }
    needFresh.value = false;
  });

  const handleSearch = async () => {
    try {
      tableDataLoading.value = true;
      tableData.value = JSON.parse(JSON.stringify(props.rowCheckedList)).map(
        (item) => ({
          ...item,
          isMuchWords: false,
          _productNameMuchList: item.productName.split(' ').map((v) => ({
            label: v + ' ',
            isHighLight: false
          })),
          _productNameList: item.productName.split('').map((v) => ({
            label: v,
            isHighLight: false
          }))
        })
      );
      totalCount.value = props.rowCheckedList.length;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };

  const isEndWithSymbol = (str, needSubstring = true) => {
    let _str = str;
    if (needSubstring) {
      _str = str.substring(0, str.length - 1);
    }
    const isExist = [',', ',', '.', '?', ':', ';', '!'].some((v) =>
      _str.endsWith(v)
    );
    return isExist;
  };

  const handleApply = async (formEl) => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    const { updateTitleWay } = formData.value;
    if (updateTitleWay === 'replace') {
      handleApplyReplace(checkedList);
    } else {
      handleApplyAdd(checkedList, formEl);
    }
  };
  //   新增的一键应用
  const handleApplyAdd = (checkedList, formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const { newAddWord, index } = formData.value;
        if (newAddWord) {
          checkedList.forEach((item) => {
            item.isMuchWords = false;
            item._productNameMuchList.forEach((v) => {
              // 高亮
              v.isHighLight = true;
            });
            const newProductName = item.productName.split(' ');
            if (index === -1) {
              newProductName.splice(newProductName.length, 0, newAddWord);
            } else if (index === 0) {
              newProductName.splice(0, 0, newAddWord);
            } else {
              newProductName.splice(index - 1, 0, newAddWord);
            }
            item.updateProductName = newProductName.join(' ');
          });
        }
      } else {
        return false;
      }
    });
  };

  //   替换的一键应用
  const handleApplyReplace = (checkedList) => {
    checkedList.forEach((item) => {
      item._productNameList.forEach((item) => {
        item.isHighLight = false;
      });
      item._productNameMuchList.forEach((item) => {
        item.isHighLight = false;
      });
      if (!title.value) {
        // 原标题列，替换词高亮
        if (newTitle.value) {
          item.isMuchWords = true;
          item._productNameList.forEach((v) => {
            v.isHighLight = true;
          });
        }
        if (newTitle.value.includes('_')) {
          item.updateProductName = newTitle.value.replace(
            '_',
            item.productName
          );
        } else {
          item.updateProductName = newTitle.value;
        }
      } else {
        // 大小写模糊搜索
        const lowerProductName = item.productName.toLowerCase();

        const lowerTitle = title.value.toLowerCase();
        if (lowerProductName.includes(trim(lowerTitle))) {
          //多个单词
          item.isMuchWords = true;
          // 语句替换
          if (trim(title.value).includes(' ')) {
            // 高亮
            highLightTitle(item, title.value);
            item.updateProductName = replaceString(
              item.productName,
              title.value,
              newTitle.value
            );
          } else {
            // 单词替换 半模糊
            item.isMuchWords = false;
            const wordsList = item.productName.split(' ');
            wordsList
              .map((v) => v.toLowerCase())
              .forEach((v, index) => {
                if (startsWith(v, trim(lowerTitle))) {
                  if (newTitle.value) {
                    let curStr = wordsList[index];
                    wordsList[index] = newTitle.value;
                    // 如果是以符号结尾,将符号添加到该词后面
                    if (
                      isEndWithSymbol(curStr, false) &&
                      !isEndWithSymbol(title.value, false)
                    ) {
                      wordsList[index] = wordsList[index] + curStr.substr(-1);
                    }
                  } else {
                    // 如果是以符号结尾,将符号添加到前一个单词
                    if (
                      isEndWithSymbol(wordsList[index], false) &&
                      wordsList[index - 1]
                    ) {
                      let curStr = wordsList[index];
                      wordsList[index - 1] =
                        wordsList[index - 1] + curStr.substr(-1);
                    } else {
                      wordsList[index] = undefined;
                    }
                  }

                  item._productNameMuchList[index].isHighLight = true;
                  // 若存在双空格的，将其前一位空格置空
                  // if (!newTitle.value && wordsList[index - 1] === ' ') {
                  //   console.log('111 :>> ', 111);
                  //   wordsList[index - 1] = '';
                  // }
                }
              });
            // 判断是否存在高亮词
            const isExistRepWord = item._productNameMuchList.some(
              (v) => v.isHighLight
            );
            item.updateProductName = isExistRepWord
              ? wordsList.filter((v) => v !== undefined).join(' ')
              : '';

            console.log('item', item.updateProductName, tableData.value);
          }
        } else {
          item.updateProductName = '';
        }
      }
    });
  };

  // 高亮
  const highLightTitle = (item, title) => {
    const positionList = searchSubStr(
      item.productName.toLowerCase(),
      title.toLowerCase()
    );
    positionList.forEach((vIndex) => {
      for (var i = vIndex; i < vIndex + title.length; i++) {
        item._productNameList[i].isHighLight = true;
      }
    });
  };

  //字符串全局替换，忽略大小写
  const searchSubStr = (str, subStr) => {
    var positions = new Array();
    var pos = str.indexOf(subStr);
    while (pos > -1) {
      positions.push(pos);
      pos = str.indexOf(subStr, pos + 1);
    }
    return positions;
  };

  const replaceString = (s1, s2, s3) => {
    if (s2) {
      var finalString = [],
        index = 0;
      var positions = searchSubStr(s1.toLowerCase(), s2.toLowerCase());
      if (positions.length > 0) {
        for (var i = 0; i < positions.length; i++) {
          finalString.push(s1.slice(index, positions[i]) + s3);
          index = positions[i] + s2.length;
        }
        finalString.push(s1.slice(index, s1.length));
        return finalString.join('');
      } else {
        return s1;
      }
    } else {
      return s1;
    }
  };

  // 筛选修改值
  const updateProductNameOptions = [
    { label: '修改值为空', value: 0 },
    { label: '存在修改值', value: 1 }
  ];
  const filterUpdateProductName = ({ option, row }) => {
    if (option.value && row.updateProductName) {
      return true;
    } else if (!option.value && !row.updateProductName) {
      return true;
    }
    return false;
  };

  //
  const handleChangeProductName = (row) => {
    if (!row.updateProductName) {
      row._productNameList.forEach((item) => {
        item.isHighLight = false;
      });
      row._productNameMuchList.forEach((item) => {
        item.isHighLight = false;
      });
    }
    handleResetResult(row);
  };
  //   重新生成
  const handleNew = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const $table = tableRef.value;
        const checkedList = $table.getCheckboxRecords();
        if (!checkedList.length) return ElMessage.warning('请选择数据');
        const { newAddWord, index } = formData.value;
        const { field, listName, fetchRegenerateTitle } = curSetting.value;
        const params = {
          [listName]: checkedList.map((v) => v[field]),
          newAddWord,
          indexEnum: '请输入'
        };
        if (index === 0) {
          params.indexEnum = '首';
        } else if (index === -1) {
          params.indexEnum = '末';
        } else {
          params.index = index;
        }
        // 掉接口
        try {
          const { data } = await fetchRegenerateTitle(params);
          const productIdObj = {};
          data.forEach((item) => {
            productIdObj[item[field]] = item.title;
          });
          checkedList.forEach((item) => {
            item.isMuchWords = false;
            item._productNameMuchList.forEach((v) => {
              v.isHighLight = true;
            });
            item.updateProductName = productIdObj[item[field]];
          });
        } catch (err) {
          console.log('err :>> ', err);
        }
      } else {
        return false;
      }
    });
  };

  const handleResetResult = debounce((row) => {
    if (row.result) {
      row.result = '';
    }
  }, 1000);

  // 批量调整
  const batchAdjustLoading = ref(false);
  const handleBatchAdjust = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    let checkedData = checkedList.filter((item) => !item.updateProductName);
    if (checkedData.length != 0) {
      return ElMessage.warning('请检查需要修改的标题，不能为空');
    }
    const { field, fetchBatchModify } = curSetting.value;
    let obj = [];
    checkedList.forEach((item) => {
      obj.push({
        id: item.id,
        [field]: item[field],
        productName: item.updateProductName,
        storeAcctId: item.storeAcctId
      });
    });
    try {
      batchAdjustLoading.value = true;
      const { data } = await fetchBatchModify(obj);
      needFresh.value = true;
      checkedList.forEach((item) => {
        if (data[item[field]] && data[item[field]].includes('失败')) {
          item.result = data[item[field]];
        } else {
          item.success = data[item[field]];
        }
      });
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchAdjustLoading.value = false;
    }
  };
</script>

<style lang="scss" scoped>
  .w100 {
    width: 100px;
  }
  .vertical-top {
    vertical-align: top;
  }
  .ml10 {
    margin-left: 10px;
  }
  .high_light_color {
    color: var(--success-color);
  }
</style>
