<template>
  <div v-if="sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.length">
    <el-divider content-position="left"><h3>尺码表</h3></el-divider>
    <el-table
      :data="sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos"
      border
      size="small"
    >
      <el-table-column
        label="尺寸"
        prop="subSpecAttributeValueName"
      ></el-table-column>

      <el-table-column
        v-for="item in sizeAttributeInfoDtos"
        :key="item.attributeId"
      >
        <template #header>
          <span v-if="item.attributeStatus == 3" style="color: red">*</span>
          {{ item.attributeName }}
        </template>
        <template #default="{ row }">
          <el-input
            v-model="
              row.sizeAttributeInfoObj[item.attributeId][0].attributeExtraValue
            "
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
  // 尺寸对应的id为87
  // 先判断规格信息中填写了“尺寸”这个规格
  import { cloneDeep, uniqBy } from 'lodash-es';
  import { computed, nextTick, ref, watch } from 'vue';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    usefulInfo: {
      type: Object,
      default: () => ({})
    }
  });

  const subArr = computed(() => props.usefulInfo?.subArr || []);
  const subAttributeId = computed(() => props.usefulInfo?.subAttributeId || '');
  const mainArr = computed(() => props.usefulInfo?.mainArr || []);
  const mainAttributeId = computed(
    () => props.usefulInfo?.mainAttributeId || ''
  );
  const sheinPublishSkuDtos = computed(
    () => props.usefulInfo?.sheinPublishSkuDtos || []
  );
  const sizeAttributeInfoDtos = computed(
    () => props?.usefulInfo?.sizeAttributeInfoDtos || []
  );

  const sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos = ref([]);

  watch(
    () => props.usefulInfo.sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos,
    (val) => {
      sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value = cloneDeep(val);
    },
    {
      immediate: true
    }
  );

  // 改变尺寸表数据
  const initData = () => {
    nextTick(() => {
      // attribute_type=2且attribute_status=3才展示尺码表
      let showSizeTable = sizeAttributeInfoDtos.value.some(
        (item) => item.attributeType == 2 && item.attributeStatus == 3
      );
      if (showSizeTable) {
        const { _sizeAttributeInfoList, _sizeAttributeInfoObj } =
          addSubSizeDefaultValue(0, true);
        sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value = [
          {
            subSpecAttributeValueId: null,
            subSpecAttributeValueName: null,
            sizeAttributeInfoList: _sizeAttributeInfoList,
            sizeAttributeInfoObj: _sizeAttributeInfoObj
          }
        ];
      } else {
        sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value = [];
      }
    });
  };

  // 置空
  const resetTableData = (type, val) => {
    // 如果数据为空，不进行操作
    if (!sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value.length)
      return false;
    if (val != 87) {
      if (
        (type == 'sub' && mainAttributeId.value != 87) ||
        (type == 'main' && subAttributeId.value != 87)
      ) {
        const { _sizeAttributeInfoList, _sizeAttributeInfoObj } =
          addSubSizeDefaultValue(0, true);
        sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value = [
          {
            subSpecAttributeValueId: null,
            subSpecAttributeValueName: null,
            sizeAttributeInfoList: _sizeAttributeInfoList,
            sizeAttributeInfoObj: _sizeAttributeInfoObj
          }
        ];
      }
    }
  };
  // 尺寸表中长度attributeId:55,宽度attributeId:118,高度attributeId:48,
  const DefaultPackageObj = {
    // 55: 'packageLength',
    // 118: 'packageWidth',
    // 48: 'packageHeight'
    55: 'productLength',
    118: 'productWidth',
    48: 'productHeight'
  };
  // 初始化时，不带没人值
  const addSubSizeDefaultValue = (taleIndex = 0, isInit = true) => {
    let _sizeAttributeInfoList = [];
    let _sizeAttributeInfoObj = {};
    sizeAttributeInfoDtos.value.forEach((elem) => {
      let attributeExtraValue = '';
      // 如果存在字段为长度/宽度/高度这三个之一，根据尺寸列对应的值找到对应的子商品的体积（长宽高）
      if (DefaultPackageObj[elem.attributeId] && !isInit) {
        attributeExtraValue =
          sheinPublishSkuDtos.value[taleIndex][
            DefaultPackageObj[elem.attributeId]
          ];
      }
      const attributeValueList = [
        {
          attributeValueId: 0,
          attributeExtraValue: attributeExtraValue
        }
      ];
      let obj = {
        attributeId: elem.attributeId,
        attributeName: elem.attributeName,
        attributeStatus: elem.attributeStatus,
        attributeValueList
      };
      _sizeAttributeInfoList.push(obj);
      _sizeAttributeInfoObj[elem.attributeId] = attributeValueList;
    });
    return {
      _sizeAttributeInfoList,
      _sizeAttributeInfoObj
    };
  };

  const getAttrList = () => {
    let arr = [];
    if (subAttributeId.value == 87) {
      arr = subArr.value;
    } else if (mainAttributeId.value == 87) {
      arr = mainArr.value;
    }
    return arr;
  };
  const changeSizeTableData = (type = 'sub') => {
    // 如果数据为空，不进行操作
    if (!sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value.length)
      return false;
    //
    if (type == 'sub') {
      if (subAttributeId.value != 87) {
        return false;
      }
    }
    if (type == 'main') {
      if (mainAttributeId.value != 87) {
        return false;
      }
    }

    const attrList = getAttrList();
    const hasSubVallueList = uniqBy(
      sheinPublishSkuDtos.value.filter((item) => item[type]),
      type
    );
    if (hasSubVallueList.length === 0) {
      const { _sizeAttributeInfoList, _sizeAttributeInfoObj } =
        addSubSizeDefaultValue(0, true);
      sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value[0] = {
        subSpecAttributeValueId: null,
        subSpecAttributeValueName: null,
        sizeAttributeInfoList: _sizeAttributeInfoList,
        sizeAttributeInfoObj: _sizeAttributeInfoObj
      };

      // 如果只有一个有值
    } else if (hasSubVallueList.length === 1) {
      const curSub = hasSubVallueList[0][type];
      let subSpecAttributeValueName = '';
      attrList.forEach((item) => {
        if (typeof curSub === 'string') {
          subSpecAttributeValueName = curSub;
        } else if (item.attributeValueId == curSub) {
          subSpecAttributeValueName = item.attributeValue;
        }
      });
      // 尺码表取一项
      if (sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value.length === 1) {
        let index = sheinPublishSkuDtos.value.findIndex(
          (item) => item.sub !== '' && item !== undefined
        );
        const { _sizeAttributeInfoList, _sizeAttributeInfoObj } =
          addSubSizeDefaultValue(index, false);
        sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value[0] = {
          sizeAttributeInfoList: _sizeAttributeInfoList,
          sizeAttributeInfoObj: _sizeAttributeInfoObj
        };
      } else if (
        sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value.length === 2
      ) {
        // 尺码表截取一项
        sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value = [
          sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value[0]
        ];
      }
      sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value[0].subSpecAttributeValueName =
        subSpecAttributeValueName;
      sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value[0].subSpecAttributeValueId =
        typeof curSub === 'string' ? null : curSub;
    } else {
      // 子商品的次规则去重
      let sheinPublishSkuDtosSubObj = {};
      sheinPublishSkuDtos.value.forEach((item, index) => {
        if (item.sub !== undefined && item.sub !== '' && item.sub !== null) {
          sheinPublishSkuDtosSubObj[item[type]] = { ...item, index };
        }
      });
      // 寻找次规则对应的已有尺寸
      let sizeColObj = {};
      sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value.forEach((item) => {
        sizeColObj[item.subSpecAttributeValueId] = true;
      });
      let i = 0;
      Object.keys(sheinPublishSkuDtosSubObj).forEach((item) => {
        // 增加一行
        if (!sizeColObj[item]) {
          sizeColObj[item] = true;
          let subSpecAttributeValueName = '';
          // attrList.forEach((elem) => {
          //   if (typeof item === 'string') {
          //     subSpecAttributeValueName = item;
          //   } else if (elem.attributeValueId == item) {
          //     subSpecAttributeValueName = elem.attributeValue;
          //   }
          // });
          let filterData = attrList.filter(
            (elem) => elem.attributeValueId == item
          );
          if (filterData.length != 1) {
            subSpecAttributeValueName = item;
          } else {
            subSpecAttributeValueName = filterData[0].attributeValue;
          }
          const { _sizeAttributeInfoList, _sizeAttributeInfoObj } =
            addSubSizeDefaultValue(
              sheinPublishSkuDtosSubObj[item].index,
              false
            );
          let newRow = {
            subSpecAttributeValueName,
            subSpecAttributeValueId: item,
            sizeAttributeInfoObj: _sizeAttributeInfoObj,
            sizeAttributeInfoList: _sizeAttributeInfoList
          };
          sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value.splice(
            i,
            0,
            newRow
          );
        }
        i++;
      });
      Object.keys(sizeColObj).forEach((item) => {
        // 减少一行
        if (!sheinPublishSkuDtosSubObj[item]) {
          sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value =
            sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value.filter(
              (elem) => Number(elem.subSpecAttributeValueId) !== Number(item)
            );
        }
      });
    }
  };

  // 获取数据
  const getTableData = () => {
    let arr = [];
    let needPromptMsg = false;
    let needSubSpecAttributeValueName = false;
    if (
      sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value.length != undefined
    ) {
      sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos.value.forEach((item) => {
        // 判断必填属性
        if (!needPromptMsg) {
          needPromptMsg = item.sizeAttributeInfoList.some(
            (elem) =>
              elem.attributeStatus == 3 &&
              !elem.attributeValueList[0].attributeExtraValue
          );
        }
        if (!item.subSpecAttributeValueName) {
          needSubSpecAttributeValueName = true;
        }
        arr.push({
          subSpecAttributeValueId: item.subSpecAttributeValueId,
          subSpecAttributeValueName: item.subSpecAttributeValueName,
          sizeAttributeInfoList: item.sizeAttributeInfoList
        });
      });
      return {
        sheinSubSpecSalesAttrsAndSizeAttributeInfoDtos: arr,
        needPromptMsg,
        needSubSpecAttributeValueName
      };
    } else {
      ElMessage.warning('当前类目存在尺码表，请重选类目后保存');
    }
  };

  defineExpose({ initData, changeSizeTableData, getTableData, resetTableData });
</script>

<style lang="scss" scoped></style>
