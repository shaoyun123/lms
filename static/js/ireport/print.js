/**
 * epean 打印插件
 * epeanPrintPdf_plugin_fun 根据pdfurl打印pdf文件
 * epeanPrint_plugin_fun 其它jasper文件打印
 */
var cur_ip = "http://localhost:9898/";//默认使用ip

/**
 * 根据url路径，打印pdf文件
 *  obj.prefixBashpath :"pdf文件前缀，默认是/lms/static/pdf/"
 *  obj.pdfUrls: pdf文件名，多个以,分隔 eg:1.pdf,2.pdf
 * @param obj
 * @returns {boolean}
 */
function epeanPrintPdf_plugin_fun(obj) {
    obj.printType = 1;
    var prefixBashpath = obj.prefixBashpath;
    if (prefixBashpath == null) {
        var curlHref = window.location.href;
        curlHref = curlHref.substring(0, curlHref.indexOf("/lms"));
        obj.prefixBashpath = curlHref + "/lms/static/pdf/";
    }
    var pdfUrls = obj.pdfUrls;
    if (pdfUrls == null || $.trim(pdfUrls) == '') {
        layui.layer.msg("要打印的pdf文件为空", {icon: 2});
        return false;
    }
    loading.show();
    $.ajax({
        type: "post",
        url: cur_ip,
        dataType: "json",
        data: obj,
        success: function () {
            loading.hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            loading.hide();
            var responseText = jqXHR.responseText;
            console.log(responseText);
            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
            }
        }
    });
};

/**
 * 通用打印
 * @param data
 * 传入数据模型
  {
      "printerName": "10040", // 打印机名称
      "jspaper" : "winitMatch.jasper",  // 使用的面单
      "printDetailDtoList" : [
          {
              "titleMap" : {
                  "sku" : "MRZB14B91-9",
                  "storeName" : "美国西部",
              }, // 要打印的参数 - 要和所设计的面单参数 一样
              amount: 10 // 需要打印的份数, 不填默认为1
          }
      ]
  }
 * @returns {boolean}
 */
function printStandard(data) {
    if (!data.jspaper) {
        layui.layer.msg("请传入所要打印的面单", {icon: 2});
        return false;
    }
    if (!data.printDetailDtoList || data.printDetailDtoList.length === 0) {
        layui.layer.msg("请传入所要打印的信息", {icon: 2});
        return false;
    }
    loading.show();
    let obj = {
        printType: 99,
        printDto: JSON.stringify(data)
    }
    $.ajax({
        type: "post",
        url: cur_ip,
        dataType: "json",
        data: obj,
        success: function () {
            loading.hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            loading.hide();
            var responseText = jqXHR.responseText;
            console.log(responseText);
            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
            }
        }
    });
};

function printBase64(obj) {
    if (!obj.base64) {
        layui.layer.msg("要打印的base64为空", {icon: 2});
        return false;
    }
    loading.show();
    $.ajax({
        type: "post",
        url: cur_ip,
        dataType: "json",
        data: obj,
        success: function () {
            loading.hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            loading.hide();
            var responseText = jqXHR.responseText;
            console.log(responseText);
            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
            }
        }
    });
};

function StandardPrint(obj) {
    loading.show();
    $.ajax({
        type: "post",
        url: cur_ip,
        dataType: "json",
        data: obj,
        success: function () {
            loading.hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            loading.hide();
            var responseText = jqXHR.responseText;
            console.log(responseText);
            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
            }
        }
    });
};

/**
 * 调用本地打印插件打印
 * @param printType 打印插件打印枚举类型
 * @param printArray 传入jasper模板文件的参数
 * @param backSuccessFun 成功后回调函数
 * @param isLoading 是否需要loading
 */
function epeanPrint_plugin_fun(printType,printArray,backSuccessFun,isLoading=true) {
    isLoading && loading.show();
    $.ajax({
        type: "post",
        url: cur_ip,
        dataType: "json",
        data: {printType:printType,printArray:JSON.stringify(printArray)},
        success: function () {
            loading.hide();
        }, error: function (jqXHR, textStatus, errorThrown) {
            loading.hide();
            var responseText = jqXHR.responseText;
            console.log(responseText);
            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
            }else{
                console.log(backSuccessFun)
                if(backSuccessFun && typeof backSuccessFun == 'function'){
                    console.log("执行backFun")
                    backSuccessFun();
                }
            }
        }
    });
}

/**
 * 打印物流面单使用
 * @param obj
 * @returns {boolean}
 */
function logistics_label_pdf_print(obj) {
    obj.printType = 19;
    // loading.show();
    $.ajax({
        type: "post",
        url: cur_ip,
        dataType: "json",
        data: obj,
        success: function () {
            loading.hide();
        },
        error: function (jqXHR) {
            loading.hide();
            var responseText = jqXHR.responseText;
            // console.log(responseText);
            // 拼多多处理。单个打印提示出错误信息
            if (responseText != null && responseText.indexOf("拼多多") !== -1) {
                layui.layer.msg(responseText, {icon: 2});
                return;
            }
            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
            }
        }
    });
};

/**
 * 待包装->设置分拣批次->打印物流面单时首尾增加批次号
 * @param obj
 * @returns {boolean}
 */
function batchNo_label_pdf_print(obj) {
    // obj.printType = printType;
    // loading.show();
    $.ajax({
        type: "post",
        url: cur_ip,
        dataType: "json",
        data: obj,
        success: function () {
            loading.hide();
        },
        error: function (jqXHR) {
            loading.hide();
            var responseText = jqXHR.responseText;
            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
            }
        }
    })
}

/**
 * 调用本地打印插件打印
 * @param printType 打印插件打印枚举类型
 * @param printArray 传入jasper模板文件的参数
 * @param extra 扩展参数字段
 * @param backSuccessFun 成功后回调函数
 * @param isLoading 是否需要loading
 */
function epeanPrint_plugin_with_extra_fun(printType,printArray,extra,backSuccessFun ,doEveryWhere,isLoading=true) {
    isLoading && loading.show();
    $.ajax({
        type: "post",
        url: cur_ip,
        dataType: "json",
        data: {printType: printType, printArray: JSON.stringify(printArray), extra: extra},
        success: function () {
            loading.hide();
            if (doEveryWhere) {
                doEveryWhere();
            }
        }, error: function (jqXHR, textStatus, errorThrown) {
            loading.hide();
            var responseText = jqXHR.responseText;
            console.log(responseText);
            if (doEveryWhere) {
                doEveryWhere();
            }
            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
            }else{
                console.log(backSuccessFun)
                if(backSuccessFun && typeof backSuccessFun == 'function'){
                    console.log("执行backFun")
                    backSuccessFun();
                }
            }
        }
    });
}
