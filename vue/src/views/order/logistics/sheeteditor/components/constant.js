import { h } from 'vue';

const shapeInitObj = {
  borderWidth: {
    value: '1px',
    text: '边框粗细',
    component: 'el-select'
  },
  text: {
    component: 'el-input',
    value: 'A',
    text: '内容文本'
  },
  fontFamily: {
    value: '微软雅黑',
    component: 'el-select',
    text: '内容文字字体'
  },
  fontSize: {
    component: 'el-select',
    value: '12px',
    text: '内容文字尺寸'
  },
  fontWeight: {
    component: 'el-checkbox',
    value: '400',
    extraProps: { trueLabel: '700', falseLabel: '400' },
    text: '文字内容加粗'
  }
};

// 初始值
export const styleToMap = {
  'multiple-text': {
    textAlign: {
      value: 'left',
      text: '内容文字对齐方式',
      component: 'el-select'
    },
    fontFamily: {
      value: '微软雅黑',
      text: '内容文字字体',
      component: 'el-select'
    },
    fontSize: {
      value: '12px',
      text: '内容文字尺寸',
      component: 'el-select'
    },
    lineHeight: {
      value: 1,
      text: '内容文字行距',
      component: 'el-select'
    },
    fontWeight: {
      value: '400',
      text: '内容文字加粗',
      extraProps: { trueLabel: '700', falseLabel: '400' },
      component: 'el-checkbox'
    }
    // textTransform: {
    //   value: '',
    //   text: '邮编默认大写',
    //   extraProps: { trueLabel: 'uppercase', falseLabel: '1' },
    //   component: 'el-checkbox'
    // }
  },
  'single-text': {
    textAlign: {
      value: 'left',
      text: '整体文字对齐方式',
      component: 'el-select'
    },
    fontFamily: {
      value: '微软雅黑',
      text: '内容文字字体',
      component: 'el-select'
    },
    fontSize: {
      value: '12px',
      text: '内容文字尺寸',
      component: 'el-select'
    },
    lineHeight: {
      value: 1,
      text: '内容文字行距',
      component: 'el-select'
    },
    fontWeight: {
      value: '400',
      text: '内容文字加粗',
      extraProps: { trueLabel: '700', falseLabel: '400' },
      component: 'el-checkbox'
    },
    whiteSpace: {
      value: 'nowrap',
      text: '自动换行',
      extraProps: { trueLabel: 'normal', falseLabel: 'nowrap' },
      component: 'el-checkbox',
      note: '点选依据外框长宽自动换行;作用于当前元素'
    }
  },
  barcode: {
    codeFormat: {
      text: '条形码格式',
      value: 'code128',
      component: 'el-select'
    },
    display: {
      text: '显示条码中的代码',
      value: 'block',
      extraProps: { trueLabel: 'block', falseLabel: 'none' },
      component: 'el-checkbox'
    },
    textAlign: {
      text: '条码代码文字对齐方式',
      value: 'center',
      showDisabled: true,
      component: 'el-select'
    },
    fontSize: {
      text: '条码代码文字尺寸',
      showDisabled: true,
      value: '12px',
      component: 'el-select'
    },
    fontWeight: {
      text: '条码代码加粗',
      showDisabled: true,
      value: '400',
      extraProps: { trueLabel: '700', falseLabel: '400' },
      component: 'el-checkbox'
    }
  },
  qrcode: {
    display: {
      text: '显示二维码中的代码',
      value: 'block',
      extraProps: { trueLabel: 'block', falseLabel: 'none' },
      component: 'el-checkbox'
    },
    textAlign: {
      text: '二维码代码文字对齐方式',
      value: 'left',
      showDisabled: true,
      component: 'el-select'
    },
    fontSize: {
      text: '二维码代码文字尺寸',
      showDisabled: true,
      value: '12px',
      component: 'el-select'
    },
    fontWeight: {
      text: '二维码代码加粗',
      showDisabled: true,
      value: '400',
      extraProps: { trueLabel: '700', falseLabel: '400' },
      component: 'el-checkbox'
    }
  },
  'custom-text': {
    text: {
      value: '自定义文本内容',
      text: '自定义文本',
      component: 'el-input',
      extraProps: { type: 'textarea', autosize: { minRows: 2, maxRows: 4 } }
    },
    textAlign: {
      value: 'left',
      text: '文本对齐方式',
      component: 'el-select'
    },
    fontFamily: {
      value: '微软雅黑',
      text: '文本字体',
      component: 'el-select'
    },
    fontSize: {
      value: '12px',
      text: '文本尺寸',
      component: 'el-select'
    },
    lineHeight: {
      value: 1,
      text: '文本行距',
      component: 'el-select'
    },
    fontWeight: {
      value: '400',
      text: '文本文字加粗',
      extraProps: { trueLabel: '700', falseLabel: '400' },
      component: 'el-checkbox'
    },
    whiteSpace: {
      value: 'nowrap',
      text: '自动换行',
      extraProps: { trueLabel: 'normal', falseLabel: 'nowrap' },
      component: 'el-checkbox',
      note: '点选依据外框长宽自动换行;作用于当前元素'
    }
  },
  'custom-title-text': {
    title: {
      text: {
        value: '自定义文本标题',
        text: '文本标题',
        component: 'el-input',
        extraProps: { type: 'textarea', autosize: { minRows: 2, maxRows: 4 } }
      },
      fontWeight: {
        value: '400',
        text: '文本文字加粗',
        extraProps: { trueLabel: '700', falseLabel: '400' },
        component: 'el-checkbox'
      }
    },
    detail: {
      text: {
        value: '自定义文本内容',
        text: '文本内容',
        component: 'el-input',
        extraProps: { type: 'textarea', autosize: { minRows: 2, maxRows: 4 } }
      },
      fontWeight: {
        value: '400',
        text: '文本内容加粗',
        extraProps: { trueLabel: '700', falseLabel: '400' },
        component: 'el-checkbox'
      }
    },
    whole: {
      textAlign: {
        value: 'left',
        text: '文本对齐方式',
        component: 'el-select'
      },
      fontFamily: {
        value: '微软雅黑',
        text: '文本字体',
        component: 'el-select'
      },
      fontSize: {
        value: '12px',
        text: '文本尺寸',
        component: 'el-select'
      },
      lineHeight: {
        value: 1,
        text: '文本行距',
        component: 'el-select'
      },
      whiteSpace: {
        value: 'nowrap',
        text: '自动换行',
        extraProps: { trueLabel: 'normal', falseLabel: 'nowrap' },
        component: 'el-checkbox'
      }
    }
  },
  pre_img: {},
  square: shapeInitObj,
  circular: shapeInitObj
};

export const borderList = [
  {
    title: '显示上边框',
    valueProp: 'borderTop',
    value: true,
    list: [
      {
        title: '上边框厚度',
        valueProp: 'borderTopWidth',
        value: '0px'
      },
      {
        title: '上边距',
        valueProp: 'paddingTop',
        value: '0px'
      }
    ]
  },
  {
    title: '显示下边框',
    valueProp: 'borderBottom',
    value: false,
    list: [
      {
        title: '下边框厚度',
        valueProp: 'borderBottomWidth',
        value: '0px'
      },
      {
        title: '下边距',
        valueProp: 'paddingBottom',
        value: '0px'
      }
    ]
  },
  {
    title: '显示做边框',
    valueProp: 'borderLeft',
    value: false,
    list: [
      {
        title: '做边框厚度',
        valueProp: 'borderLeftWidth',
        value: '0px'
      },
      {
        title: '做边距',
        valueProp: 'paddingLeft',
        value: '0px'
      }
    ]
  },
  {
    title: '显示右边框',
    valueProp: 'borderRight',
    value: false,
    list: [
      {
        title: '右边框厚度',
        valueProp: 'borderRightWidth',
        value: '0px'
      },
      {
        title: '右边距',
        valueProp: 'paddingRight',
        value: '0px'
      }
    ]
  }
];

// 微软雅黑
const fontFamilyArr = [
  { text: '微软雅黑', value: '微软雅黑' },
  { text: '宋体', value: '宋体' },
  { text: 'Arial Black', value: '"Arial Black"' },
  { text: 'Gabriola', value: 'Gabriola' },
  { text: 'MV Boli', value: '"MV Boli"' },
  { text: 'Impact', value: 'Impact' },
  { text: 'Segoe Script', value: '"Segoe Script"' },
  { text: '楷体', value: '楷体' },
  { text: '华文琥珀', value: '华文琥珀' }
];
const fontFamilyOptions = fontFamilyArr.map((font) => ({
  value: font.value,
  label: font.text,
  text: h('span', { style: { fontFamily: font.value } }, font.text)
}));

export const optionList = {
  textAlign: [
    { value: 'left', label: '左对齐' },
    { value: 'center', label: '中对齐' },
    { value: 'right', label: '右对齐' }
  ],
  fontSize: [
    { value: '6px', label: '6px' },
    { value: '7px', label: '7px' },
    { value: '8px', label: '8px' },
    { value: '9px', label: '9px' },
    { value: '10px', label: '10px' },
    { value: '11px', label: '11px' },
    { value: '12px', label: '12px' },
    { value: '14px', label: '14px' },
    { value: '18px', label: '18px' },
    { value: '24px', label: '24px' },
    { value: '30px', label: '30px' }
  ],
  fontFamily: fontFamilyOptions,
  lineHeight: [
    { value: 1, label: '1倍' },
    { value: 1.5, label: '1.5倍' },
    { value: 2, label: '2倍' },
    { value: 2.5, label: '2.5倍' },
    { value: 3, label: '3倍' }
  ],
  paddingBottom: [
    { text: '0px', value: '0px' },
    { text: '1px', value: '1px' },
    { text: '2px', value: '2px' },
    { text: '3px', value: '3px' },
    { text: '4px', value: '4px' },
    { text: '5px', value: '5px' }
  ],
  codeFormat: [
    { text: 'Code128', value: 'code128' },
    { text: 'Code128A', value: 'code128a' },
    { text: 'Code128B', value: 'code128b' },
    { text: 'Code128C', value: 'code128c' }
  ],
  borderWidth: [
    // { text: '0px', value: '0px' },
    { text: '1px', value: '1px' },
    { text: '2px', value: '2px' },
    { text: '3px', value: '3px' },
    { text: '4px', value: '4px' },
    { text: '5px', value: '5px' },
    { text: '6px', value: '6px' }
  ],
  borderStyle: [
    {
      value: 'solid',
      label: '实线'
    },
    {
      value: 'dotted',
      label: '点状线'
    },
    {
      value: 'dashed',
      label: '虚线'
    },
    {
      value: 'double',
      label: '双实线'
    }
  ]
};

export const positionHtmlObj = {
  'multiple-text': `<div class="resizers">
  <div class="resize top-left"></div>
  <div class="resize top-right"></div>
  <div class="resize right"></div>
  <div class="resize bottom-left"></div>
  <div class="resize bottom-right"></div>
  <div class="resize bottom"></div>
</div>`,
  'single-text': `<div class="resizers">
  <div class="resize top-left"></div>
  <div class="resize top-right"></div>
  <div class="resize right"></div>
  <div class="resize bottom-left"></div>
  <div class="resize bottom-right"></div>
  <div class="resize bottom"></div>
</div>`,
  'custom-text': `<div class="resizers">
<div class="resize top-left"></div>
<div class="resize top-right"></div>
<div class="resize right"></div>
<div class="resize bottom-left"></div>
<div class="resize bottom-right"></div>
<div class="resize bottom"></div>
</div>`,
  barcode: `<div class="resizers">
  <div class="resize top-left"></div>
  <div class="resize top-right"></div>
  <div class="resize right"></div>
  <div class="resize bottom-left"></div>
  <div class="resize bottom-right"></div>
  <div class="resize bottom"></div>
</div>`,
  qrcode: `<div class="resizers">
  <div class="resize top-left"></div>
  <div class="resize top-right"></div>
  <div class="resize right"></div>
  <div class="resize bottom-left"></div>
  <div class="resize bottom-right"></div>
  <div class="resize bottom"></div>
</div>`,
  table: `<div class="resizers">
<div class="resize top-left"></div>
<div class="resize top-right"></div>
<div class="resize right"></div>
<div class="resize bottom-left"></div>
<div class="resize bottom-right"></div>
<div class="resize bottom"></div>
</div>`,
  'x-line': '',
  'y-line': '',
  circular: `<div class="resizers">
  <div class="resize top-left"></div>
  <div class="resize top-right"></div>
  <div class="resize right"></div>
  <div class="resize bottom-left"></div>
  <div class="resize bottom-right"></div>
  <div class="resize bottom"></div>
</div>`,
  square: `<div class="resizers">
  <div class="resize top-left"></div>
  <div class="resize top-right"></div>
  <div class="resize right"></div>
  <div class="resize bottom-left"></div>
  <div class="resize bottom-right"></div>
  <div class="resize bottom"></div>
</div>`,
  'custom-img': `<div class="resizers">
  <div class="resize top-left"></div>
  <div class="resize top-right"></div>
  <div class="resize right"></div>
  <div class="resize bottom-left"></div>
  <div class="resize bottom-right"></div>
  <div class="resize bottom"></div>
</div>`,
  'custom-title-text': `<div class="resizers">
<div class="resize top-left"></div>
<div class="resize top-right"></div>
<div class="resize right"></div>
<div class="resize bottom-left"></div>
<div class="resize bottom-right"></div>
<div class="resize bottom"></div>
</div>`,
  'pre-img': `<div class="resizers">
<div class="resize top-left"></div>
<div class="resize top-right"></div>
<div class="resize right"></div>
<div class="resize bottom-left"></div>
<div class="resize bottom-right"></div>
<div class="resize bottom"></div>
</div>`
};

// 表格默认值
export const tableDefaultStyle = {
  thead: {
    value: 'table-header-group',
    trueLabel: 'table-header-group',
    text: '显示表头',
    attrs: {
      textAlign: {
        value: 'left',
        text: '表头文字对齐方式',
        options: optionList.textAlign
      },
      fontFamily: {
        value: '微软雅黑',
        text: '表头文字字体',
        options: optionList.fontFamily
      },
      fontSize: {
        value: '12px',
        text: '表头文字尺寸',
        options: optionList.fontSize
      }
    }
  },
  // tbody: {
  //   attrs: {
  //     textAlign: {
  //       value: 'left',
  //       text: '表格内容文字对齐方式',
  //       options: optionList.textAlign
  //     },
  //     fontFamily: {
  //       value: '微软雅黑',
  //       text: '表格内容文字字体',
  //       options: optionList.fontFamily
  //     },
  //     fontSize: {
  //       value: '12px',
  //       text: '表格内容文字尺寸',
  //       options: optionList.fontSize
  //     }
  //   }
  // },
  tfoot: {
    value: 'table-footer-group',
    trueLabel: 'table-footer-group',
    text: '显示脚注',
    attrs: {
      // textAlign: {
      //   value: 'left',
      //   text: '脚注文字对齐方式',
      //   options: optionList.textAlign
      // },
      fontFamily: {
        value: '微软雅黑',
        text: '脚注文字字体',
        options: optionList.fontFamily
      },
      fontSize: {
        value: '12px',
        text: '脚注文字尺寸',
        options: optionList.fontSize
      }
    }
  }
};
