<template>
  <!-- <div class="app-container">pinduoduo店铺配置页面</div> -->
  <StoreConfig
    :search-form-item-list="searchFormItemList"
    :plat-code="platCode"
    :plat-form-data="platFormData"
    :table-list-column="tableListColumn"
    :custom-form-config="customFormConfig"
    :check-item-config="checkItemConfig"
  />
</template>
<script setup name="configurestorepddstoreconf">
  import { reactive, ref, onMounted } from 'vue';
  import StoreConfig from '@/components/StoreConfig/index.vue';

  const platCode = ref('pinduoduo');
  const platFormData = reactive({
    listingQuotaType: '0',
    orderByType: '5'
  });
  const searchFormItemList = reactive([
    {
      labelType: 'select',
      labelName: '',
      labelField: 'listingQuotaType', // 字段名称
      labelOption: [
        { label: '总额度', value: '0' },
        { label: '已用额度', value: '1' },
        { label: '剩余额度', value: '2' }
      ],
      contentType: 'inputRange',
      contentField: ['listingQuotaRemainMin', 'listingQuotaRemainMax'] // 字段名称
    },
    {
      labelType: 'text',
      labelName: '同步listing状态',
      contentType: 'select',
      isMuliple: true,
      contentField: 'syncStatusList', // 字段名称
      contentOption: [
        { label: '未同步', value: '0' },
        { label: '初始化', value: '1' },
        { label: '同步中', value: '2' },
        { label: '同步成功', value: '3' },
        { label: '同步失败', value: '4' }
      ]
    },
    {
      labelType: 'text',
      labelName: '同步异常备注',
      contentType: 'input',
      contentField: 'syncDesc' // 字段名称
    },
    {
      labelType: 'text',
      labelName: '备注',
      contentType: 'input',
      contentField: 'remark'
    },
    {
      labelType: 'text',
      labelName: '排序',
      contentType: 'select',
      contentField: 'orderByType',
      contentOption: [
        { label: 'access到期时间正序', value: '0' },
        { label: 'access到期时间倒序', value: '1' },
        { label: 'refresh到期时间正序', value: '2' },
        { label: 'refresh到期时间倒序', value: '3' },
        { label: '创建时间倒序', value: '5' },
        { label: '创建时间正序', value: '4' }
      ]
    }
  ]);

  const tableListColumn = reactive([
    {
      field: 'listing',
      title: 'Listing额度',
      slots: { default: 'listing' },
      columnItemRender: [
        {
          cellLabel: '总额度',
          cellField: 'listingQuotaLimit'
        },
        {
          cellLabel: '已用额度',
          cellField: 'listingQuotaUsed'
        },
        {
          cellLabel: '剩余额度',
          cellField: 'remainingQuota'
        }
      ]
    },
    {
      field: 'syncStatus',
      title: 'Listing同步',
      width: 220,
      slots: { default: 'syncStatus' },
      columnItemRender: [
        {
          cellLabel: '同步状态',
          cellField: 'syncStatus',
          cellType: 'objMap',
          objMap: {
            0: '未同步',
            1: '初始化',
            2: '同步中',
            3: '同步成功',
            4: '同步失败'
          }
        },
        {
          cellLabel: '同步时间',
          cellField: 'lastSyncTime',
          cellType: 'time'
        },
        {
          cellLabel: '异常备注',
          cellField: 'syncDesc'
        }
      ]
    },
    {
      field: 'remark',
      title: '备注',
      slots: { default: '' }
    },
    {
      field: 'toolbar',
      title: '操作',
      width: 140,
      slots: { default: 'toolbar_default' },
      columnItemRender: [
        {
          cellLabel: 'API授权',
          cellField: 'apiAuth'
        },
        {
          cellLabel: '编辑',
          cellField: 'edit'
        },
        {
          cellLabel: '店铺授权',
          cellField: 'storeAuth'
        }
      ]
    }
  ]);

  // 编辑时 修改项配置
  const customFormConfig = reactive([]);

  // 批量修改时
  // required 表示该项是否默认勾选
  const checkItemConfig = reactive([
    { name: '启用状态', field: 'status' },
    { name: '销售', field: 'salespersonId' },
    { name: '主管', field: 'sellLeaderId' },
    { name: '客服', field: 'customServicerId' },
    { name: '组长', field: 'leaderId' },
    { name: '备注', field: 'remark' }
  ]);

  onMounted(() => {});
</script>
<style lang="scss" scoped></style>
