// 常量
export const orderTypeEnum = [
  { label: '按创建时间正序', value: '1' },
  { label: '按创建时间倒序', value: '0' }
  // {
  //   label: '按盒子号正序',
  //   value: `cast(replace(box.box_code,'F','') AS UNSIGNED)`
  // },
  // { label: '按可取时间正序', value: 'ship.take_able_time' },
  // { label: '按可取时间倒序', value: 'ship.take_able_time desc' }
];
// 配货状态
export const packStatusEnum = [
  { label: '全部', value: '' },
  { label: '待配货', value: 0 },
  { label: '待包装', value: 1 },
  { label: '待存框', value: 2 },
  { label: '已存框', value: 3 }
];
export const frameStatusEnum = [
  { label: '全部', value: '' },
  { label: '未分配', value: 0 },
  { label: '不可取', value: 1 },
  { label: '可取', value: 2 },
  { label: '已取框', value: 3 }
];
