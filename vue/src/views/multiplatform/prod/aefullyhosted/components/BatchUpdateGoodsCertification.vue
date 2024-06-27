<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改商品资质"
      width="55%"
      style="height: 85%"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div class="content">
        <div>
          <div class="text-xl">
            <span class="text-red">*</span><span class="text-bold">调整项</span>
          </div>
          <el-checkbox-group
            v-model="checkedCertificationList"
            @change="changecheckedCertificationList"
          >
            <el-checkbox
              v-for="item of qualificationsInfo"
              :key="item"
              :label="item.qualificationKey"
              ><span v-if="item.required" class="text-red">*</span
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <hr />
        <div class="certification_info">
          <div class="title mr_20">资质信息</div>
          <div class="certification_content">
            <div class="text_orange mb_10">
              如果你在以下国家售卖商品,请提交该国家要求的商品资质,否则商品可能无法再该国家显示
            </div>
            <div
              v-for="(item, index) of qualificationsInfo"
              :key="item"
              class="card-box"
            >
              <div
                v-if="checkedCertificationList.includes(item.qualificationKey)"
              >
                <div
                  class="card-header"
                  style="border-bottom: 1px solid #eee; padding: 10px 0px"
                >
                  <div>{{ item.country }}-{{ item.qualificationName }}</div>
                </div>
                <div class="card-body" style="padding: 20px 40px">
                  <div v-if="item.qualificationType === 'image'">
                    <div class="flex">
                      <div>{{ item.label }}</div>
                      <el-upload
                        :action="'/api/lms/prodTpl/uploadPic.html'"
                        :on-success="(event) => importSuccessList(event, index)"
                        :on-error="importError"
                        :show-file-list="false"
                        class="mx_20"
                      >
                        <el-button type="primary" size="small"
                          >上传本地文件</el-button
                        >
                      </el-upload>
                      <ImagePop
                        :width="imgWidth"
                        :height="imgHeight"
                        :src="item.qualificationValue"
                      />
                      <el-button
                        v-if="item.qualificationValue"
                        type="danger"
                        size="small"
                        class="ml_10"
                        link
                        @click="deleteCheckImage(index)"
                        >删除</el-button
                      >
                    </div>
                    <div class="text_orange text-xs">{{ item.tips }}</div>
                  </div>
                  <div v-else class="flex">
                    <div>{{ item.label }}</div>
                    <el-input
                      v-model="item.qualificationValue"
                      class="ml_20"
                      style="width: 260px"
                      clearable
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex_end">
          <el-button
            type="primary"
            :loading="batchAdjustLoading"
            @click="handleBatchAdjust"
            >提交修改</el-button
          >
        </div>
        <vxe-table
          ref="tableRef"
          :data="tableData"
          :height="560"
          border
          :row-config="{ isCurrent: true, isHover: true }"
          :column-config="{ resizable: true }"
        >
          <vxe-column type="checkbox" width="40" />
          <vxe-column field="storeAcctId" title="店铺id" />
          <vxe-column field="storeAcct" title="店铺" />
          <vxe-column field="productId" title="商品编号" />
          <vxe-column field="result" title="操作结果" width="180">
            <template #default="{ row }">
              <div :class="getResultClass(row.result)">
                {{ getResultMsg(row) }}
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, watch, computed } from 'vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    getQualificationsInfo,
    batchEditQualifications,
    getBatchResult,
    getDefaultQualificationImage
  } from '@/api/multiplatform/aesupportprod';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedGoodsCertificationList: {
      type: Array,
      default: () => []
    }
  });

  // 选中的调整项
  const checkedCertificationList = ref([]);

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const tableData = ref([]);
  const tableRef = ref();

  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表
  const imgWidth = '60px';
  const imgHeight = '60px';

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        checkedCertificationList.value = [];
        tableData.value = props.checkedGoodsCertificationList;
        getQualificationsInfoList();
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
        clearTimeout(timerId.value);
      }
    }
  );

  const changecheckedCertificationList = async (val) => {
    // 只有当从外面列表勾选一个数据的时候 才调用查询默认资质图
    if (tableData.value.length === 1) {
      const { data } = await getDefaultQualificationImage({
        qualificationKeys: val,
        productId: tableData.value[0].productId
      });
      for (let i = 0; i < data.length; i++) {
        const index = qualificationsInfo.value.findIndex(
          (item) => item.qualificationKey === data[i].qualificationKey
        );
        if (index > -1) {
          qualificationsInfo.value[index].qualificationValue =
            data[i].qualificationValue;
        }
      }
    }
  };

  // 获取商品资质列表信息
  const qualificationsInfo = ref([]);
  const getQualificationsInfoList = async () => {
    const list = props.checkedGoodsCertificationList;
    const { data } = await getQualificationsInfo({
      categoryId: list[0].leafCategoryId,
      storeAcctId: list[0].storeAcctId
    });
    qualificationsInfo.value = data;
  };

  // 变种信息 本地上传图片
  const importSuccessList = (res, index) => {
    if (res.code === '0000') {
      qualificationsInfo.value[index].qualificationValue = res.msg;
    } else {
      ElMessage.error(res.msg);
    }
  };

  const importError = () => {
    ElMessage.error('上传失败,请重新上传！');
  };

  // 删除图片
  const deleteCheckImage = (index) => {
    qualificationsInfo.value[index].qualificationValue = '';
  };

  // 提交修改
  const timerId = ref(null);
  const batchAdjustLoading = ref(false);
  const handleBatchAdjust = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    if (!checkedCertificationList.value.length)
      return ElMessage.warning('请选择调整项');

    // 调整项选中的数据
    const allFilled = checkedCertificationList.value.every((key) => {
      const item = qualificationsInfo.value.find((obj) => {
        return obj.qualificationKey === key;
      });
      return (
        item &&
        item.qualificationValue !== '' &&
        item.qualificationValue !== undefined
      );
    });

    if (!allFilled) {
      return ElMessage.warning('所有勾选的资质信息文件都不能为空');
    }

    const checkedQualificationValueList = qualificationsInfo.value.filter(
      (item) => {
        return (
          checkedCertificationList.value.includes(item.qualificationKey) &&
          !!item.qualificationValue
        );
      }
    );

    // 列表选中的数据
    let listParamsList = [];
    checkedList.forEach((item) => {
      listParamsList.push({
        productId: item.productId,
        storeAcctId: item.storeAcctId
      });
    });

    try {
      batchAdjustLoading.value = true;
      const { data, msg } = await batchEditQualifications({
        products: listParamsList,
        qualifications: checkedQualificationValueList
      });
      needFresh.value = true;
      ElMessage.warning(msg);
      timerId.value = setInterval(() => {
        getOperateResult(data);
      }, 1000);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchAdjustLoading.value = false;
    }
  };

  // 查询操作结果
  const getOperateResult = async (batchNo) => {
    const { data } = await getBatchResult({
      type: 9,
      batchNo: batchNo
    });
    data.forEach((item) => {
      const index = tableData.value.findIndex(
        (el) => el.productId === item.productId
      );
      if (index > -1) {
        tableData.value[index].result = item.result;
        tableData.value[index].errorMsg = item.errorMsg || '';
      }
    });
    const isEnd = data.every((item) => {
      return item.result === -1 || item.result === 1;
    });
    if (isEnd) {
      clearTimeout(timerId.value);
    }
  };

  const getResultMsg = (row) => {
    if (row.result === 0) return '修改中...';
    if (row.result === 1) return '修改成功';
    if (row.result === -1) return `修改失败 ${row.errorMsg}`;
  };

  const getResultClass = (result) => {
    if (result === 0) return '';
    if (result === 1) return 'color_success';
    if (result === -1) return 'color_error';
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  :deep(.el-dialog) {
    display: flex;
    flex-direction: column;
  }
  :deep(.el-dialog__body) {
    flex: 1;
    overflow: hidden;
  }
  .content {
    height: 100%;
    overflow-y: auto;
  }
  .flex {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .flex_end {
    display: flex;
    justify-content: end;
    align-items: center;
    margin: 10px 0;
  }
  .text-bold {
    font-weight: bold;
  }
  .text-xl {
    font-size: 18px;
  }
  .text-xs {
    font-size: 12px;
  }
  .text-red {
    color: red;
  }
  .certification_info {
    width: 99%;
    display: flex;
    .title {
      flex-shrink: 0;
      color: #bbb;
    }
    .certification_content {
      flex: 1;
      .text_orange {
        color: #f4a460;
      }
    }
  }
  .ml_10 {
    margin-left: 10px;
  }
  .mb_10 {
    margin-bottom: 10px;
  }
  .my_20 {
    margin: 20px 0;
  }
  .mx_20 {
    margin: 0 20px;
  }
  .ml_20 {
    margin-left: 20px;
  }
  .mr_20 {
    margin-right: 20px;
  }
  .color_success {
    color: #67c23a;
  }
  .color_error {
    color: #f56c6c;
  }
</style>
