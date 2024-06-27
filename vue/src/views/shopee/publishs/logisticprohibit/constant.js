//  常量
const ConstantObj = {
  prohibitTypeList: ['CNSC类目', '外箱包装', '物流属性', '可售天数'],
  unitObj: {
    任意一边长: 'cm',
    次长边长: 'cm',
    最短边长: 'cm',
    '长+宽+高': 'cm',
    重量: 'KG',
    液体量: 'ml'
  },
  targetList: [
    '任意一边长',
    '次长边长',
    '最短边长',
    '长+宽+高',
    '重量',
    '液体量'
  ],
  operatorList: ['>', '>=', '<', '<=', '='],
  confirmCloseStr:
    '规则关闭后，物流在该站点该CNSC类目下将重新启用，已刊登商品和未刊登商品将同步获取该物流渠道。',
  confirmOpenStr:
    '规则重启后，物流在该站点该CNSC类目下将禁用，已刊登商品和未刊登商品将同步禁用该物流渠道。'
};

export default ConstantObj;
