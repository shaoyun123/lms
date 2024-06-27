/**
 * Created by EPEAN on 2021-06-17.
 */


/**
 * 根据code获取开发类型名-  发货需求专用
 * @return {string}
 */
function getDevTypeName(devType) {
    if (!devType) {
        return ''
    }
    switch (devType) {
        case 12 : return '精品';
        case 13 : return '精铺';
    }
    return '非精品'
}

/** 根据物流属性全程获取 其简称
 * @return {string}
 */
function getLogisAttrAlia(logisAttr) {
    if (!logisAttr) {
        return ''
    }
    switch (logisAttr) {
        case '普货' : return '普';
        case '带电' : return '电';
        case '纯电' : return '纯';
        case '带磁' : return '磁';
        case '粉末' : return '粉';
        case '液体(0-15ml)' : return '液';
        case '液体(>15ml)' : return '特';
        case '固体化妆品' : return '固';
        case '膏状' : return '膏';
        case '手表和≤2纽电池' : return '表';
        case '电子烟' : return '烟';
        case '指甲油' : return '甲';
        case '尖锐' : return '尖';
        case '速卖通简易' : return '速';
        case '大货' : return '大';
        case '电容' : return '容';
        case '口罩' : return '口';
        case '种子' : return '种';
        case '干花' : return '花';
    }
    return ''
}

