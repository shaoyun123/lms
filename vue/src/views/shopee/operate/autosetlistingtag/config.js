export const Column = [
  {
    type: 'checkbox',
    width: 60
  },
  {
    field: 'status',
    title: '规则状态',
    width: 100,
    slots: {
      default: 'status_default'
    }
  },
  {
    field: 'listingTagId',
    title: '在线listing标签',
    slots: {
      default: 'listingTagId_default'
    }
  },
  {
    field: 'processingType',
    title: '配置对象',
    slots: {
      default: 'processingType_default'
    }
  },
  {
    field: 'type',
    title: '标签操作',
    slots: {
      default: 'type_default'
    }
  },
  {
    field: 'listingTagCondition',
    title: '标签条件',
    width: 250,
    slots: {
      default: 'listingTagCondition_default'
    }
  },
  {
    field: 'isFilterNoSku',
    title: '是否过滤无SKU',
    width: 120,
    slots: {
      default: 'isFilterNoSku_default'
    }
  },
  {
    field: 'shopCount',
    title: '适用店铺',
    width: 100,
    slots: {
      default: 'shopCount_default'
    }
  },
  {
    field: 'operator',
    title: '操作人',
    slots: {
      default: 'operator_default'
    }
  },
  {
    field: 'optime',
    title: '操作时间',
    width: 190,
    slots: {
      default: 'optime_default'
    }
  },
  {
    field: 'toolbar',
    title: '操作',
    width: 130,
    slots: {
      default: 'toolbar_default'
    }
  }
];
