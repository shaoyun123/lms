/**
 * Created by wujun on 2018/6/25.
 */
//3.input正则方法
//容量
function validateVolume(str) {
    var volume_format = /^(\d+(\.\d+)?)\s*(ml|l|oz\.?|m\^3|cm\^3|gallon|quart|cup|qt\.?|pt\.?|litre|liter|pint|fl\.?\s?oz\.?)s?$/gi;
    if (str.match(volume_format)) return true;
    return false;
}

//长度
function validateLength(str) {
    var length_format_1 = /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
    var length_format_2 = /^(\d+(\.\d+)?)\s*(ft.?|feet|\')\s*(\d+(\.\d+)?)\s*(in\.?|inche(es)?|\")$/gi;
    if (str.match(length_format_1) || str.match(length_format_2)) return true;
    return false;
}

//瓦数
function validateWattage(str) {
    var wattage_format = /^(\d+(\.\d+)?)\s*w$/gi;
    if (str.match(wattage_format)) return true;
    return false;
}

//面积或体积
function validateArea(str) {
    var area_format_1 = /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
    var area_format_2 = /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|X|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
    if (str.match(area_format_1) || str.match(area_format_2)) return true;
    return false;
}

//电压
function validateVoltage(str) {
    var voltage_format = /^(\d+(\.\d+)?)\s*v$/gi;
    if (str.match(voltage_format)) return true;
    return false;
}

//重量
function validateWeight(str) {
    var weight_format = /^(\d+(\.\d+)?)\s*(mg|g|kg|oz\.?|ounce|gram|pound|lb)s?$/gi;
    if (str.match(weight_format)) return true;
    return false;
}

//自定义
function validateCustom(str) {
    var custom_format = /^([a-zA-Z0-9]+[ .\-&\'\"\(\)\[\]]*)+$/gi;
    if (str.match(custom_format) && str.length <= 50) return true;
    return false
}

/**
 * 检查互斥
 * @param checkArr  待检查的字符串
 * @param mutexArr  互斥条件
 */
function checkNotBoth(checkList, mutexArr) {
    console.log(checkList)
    console.log(mutexArr)
    if (!mutexArr) {
        return true
    }
    var existNum
    for (var i = 0; i < mutexArr.length; ++i) {
        existNum = 0
        for (var j = j; j < checkList.length; ++j) {
            if (checkList[j] == mutexArr[i][0] || checkList[j] == mutexArr[i][1]) {
                existNum += 1;
            }
        }
        if (existNum == 2) {
            return false
        }
    }
    return true
}

/**
 * 校验sku  用于新增
 * 仅允许[a-z][A-Z][0-9][-]
 * @param sku
 */
function validateSKU2(sku) {
    var reg =/^[A-Z0-9\-]+$/;
    if (!reg.test(sku)) {
        return false
    }
    return true
}

/**
 * 校验sku  用于修改-   由于旧数据有许多带小写字母的
 * 仅允许[a-z][A-Z][0-9][-]
 * @param sku
 */
function validateSKU(sku) {
    var reg =/^[A-Za-z0-9\-]+$/;
    if (!reg.test(sku)) {
        return false
    }
    return true
}

/**
 * 校验p_sku  用于修改-   由于旧数据有许多带小写字母和*的
 * 仅允许[a-z][A-Z][0-9][-]
 * @param sku
 */
function validatePSKU(sku) {
    var reg =/^[A-Za-z0-9\-*]+$/;
    if (!reg.test(sku)) {
        return false
    }
    return true
}

/**
 * 判断是否金额
 * @param _keyword
 * @returns {boolean}
 */
function isMoney(_keyword) {

    if (_keyword == null) {
        return false
    }
    if (!isNaN(_keyword)) {
        return true
    }
    if(_keyword == "0" || _keyword == "0." || _keyword == "0.0" || _keyword == "0.00"){
        _keyword = "0"; return true;
    }else{
        var index = _keyword.indexOf("0");
        var length = _keyword.length;
        if(index == 0 && length>1){/*0开头的数字串*/
            var reg = /^[0]{1}[.]{1}[0-9]{1,2}$/;
            if(!reg.test(_keyword)){
                return false;
            }else{
                return true;
            }
        }else{/*非0开头的数字*/
            var reg = /^[1-9]{1}[0-9]{0,10}[.]{0,1}[0-9]*$/;
            if(!reg.test(_keyword)){
                return false;
            }else{
                return true;
            }
        }
        return false;
    }
}

/**
 * 判断是否整数
 */
function isInteger(num) {
    var re = /^[0-9]+$/ ;
    return re.test(num)
}


/**
 * 判断是否是数字
 * @param _keyword
 * @returns {boolean}
 */

function isNumber(_keyword){
    var regPos = /^\d+(\.)?(\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(_keyword) || regNeg.test(_keyword)){
        return true;
    }else{
        return false;
    }
}

/**
 * 校验当前input是否填入指定区间的数字
 * @param self input元素
 * @param min 最小值
 * @param max 最大值
 * @param leftClose 是否左闭  例如 >=1.  则leftClose为true。  >1则leftClose为false    默认为false
 * @param rightClose 是否右闭； 例如 <=1.  则 rightClose 为true。  <1则 rightClose 为false  默认为false
 */
function validNumberRange(self,min,max,leftClose,rightClose){
    let value = self.value

    if (!isNumber(value)) {
        layui.layer.msg('请输入数字')
        self.value = ''
        return
    }
    let section = (leftClose ? '[' : '(') + min + ',' + max + (rightClose ? ']' : ')')
    if (leftClose && value < min) {
        layui.layer.msg('请输入'+ section +'区间的数字')
        self.value = ''
        return
    } else if (!leftClose && value <= min) {
        layui.layer.msg('请输入'+ section +'区间的数字')
        self.value = ''
        return
    }
    if (rightClose && value > max) {
        layui.layer.msg('请输入'+ section +'区间的数字')
        self.value = ''
    } else if (!rightClose && value >= max) {
        layui.layer.msg('请输入'+ section +'区间的数字')
        self.value = ''
    }
}