<!--打印设置页面分离-->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!-- sku标签打印区间数量设置弹框 -->
<script type="text/html" id="scantostockin_print_setting_layer">
    <div class="layui-row   pd">
        <div class="layui-col-lg12 layui-col-md12">
            <table class="layui-table" id="scantostockin_setting_table" lay-filter="scantostockin_setting_table"></table>
        </div>
        <p class="pd">备注：入库数量设定值n，打印数量设定值m，入库数≤n，打印n张， 入库数大于n，打印m张。（m需≤n）
        </p>
    </div>
</script>
<script type="text/javascript">
    var printSettingArray = [];
    var scantostockin_getActPrintNum_fun;
    var maxPrintNum = 200;
    layui.use(['form', 'layer', 'formSelects', "table"], function () {
        var $ = layui.$,
            layer = layui.layer,
            table = layui.table,
            formSelects = layui.formSelects,
            form = layui.form;
        form.render();
        /*初始化sku打印标签个数设置*/
        scantostockin_initSkuPrintSettting();
        function scantostockin_initSkuPrintSettting() {
            $.ajax({
                url: ctx + '/sysIntervalColorConfig/getIntervalColorConfig.html',
                dataType: 'json',
                data: {configType: 'WH_PRINT_SKU'},
                success: function (res) {
                    if (res.code === "0000") {
                        if (res.data != null && res.data.length > 0) {
                            printSettingArray = res.data[0].interval;
                        }
                    }
                },
                error: function (res) {
                    layer.msg(res.msg, {icon: 2});
                }
            });
            scantostockin_printSetting_fun();
        };
       /**打印数量设置**/
        function  scantostockin_printSetting_fun(){
            var curButton;
            if ($('#scantostockin_set_label_print').length > 0) {
                curButton = $('#scantostockin_set_label_print');
            }else if($('#stockinorder_set_label_print').length > 0){
                curButton = $('#stockinorder_set_label_print');
            }
            if (curButton == null || curButton == undefined) {
                    return false;
            }
            //设置
            curButton.click(function () {
                var index = layer.open({
                    type: 1,
                    title: "SKU标签打印数量区间设置",
                    area: ["50%", '60%'],
                    shadeClose: false,
                    btn: ['提交', '关闭'],
                    content: $("#scantostockin_print_setting_layer").html(),
                    success: function (index, layero) {
                        table.render({
                            elem: "#scantostockin_setting_table",
                            method: "post",
                            id: 'scantostockin_setting_table',
                            url: ctx + '/sysIntervalColorConfig/getIntervalColorConfig.html',
                            where: {configType:"WH_PRINT_SKU"},
                            cols: [
                                [
                                    {title: "区间", field: 'indexSize',width:120,},
                                    {title: "入库数", field: 'startValue',width:300,edit:'text'},
                                    {title: "打印数", field: 'color',width:300,edit:'text'},
                                ]
                            ],
                            page: false,
                            created: function(res) {
                                if (res.code === "0000") {
                                    var array = [];
                                    if (res.data != null && res.data.length > 0) {
                                        array = res.data[0].interval;
                                    }
                                    if (array == null || array.length < 5) {
                                        var initSize = array.length;
                                        for (var i = initSize; i < 5; i++) {
                                            var obj = {};
                                            obj.configType = "WH_PRINT_SKU";
                                            obj.configTypeDesc = "sku标签打印设置";
                                            obj.startValue = "";
                                            obj.color = "";
                                            array.push(obj)
                                        }
                                    }
                                    for (var i = 0; i < array.length; i++) {
                                        var obj = array[i];
                                        obj.indexSize = i + 1;
                                    }
                                    res.data = array;
                                } else {
                                    layer.msg(returnData.msg, {icon: 2});
                                }
                            },
                            done: function (res) {
                            },
                        });
                    },
                    yes: function (index, layero) {
                        scantostockin_saveSkuPrintSet();
                    }
                });
            });
        }
        /**
         * 保存打印区间设置
         * @returns {boolean}
         */
        function scantostockin_saveSkuPrintSet(){
            var configData=table.cache['scantostockin_setting_table'];
            for(var i =0;i< configData.length;i++){
                var data=configData[i];
                var storageNum=data.startValue;//入库数
                if(storageNum != null && $.trim(storageNum) != ''){
                    var printNum=data.color;//打印数
                    if (!(/(^[1-9]\d*$)/.test(storageNum))) {
                        layer.msg("区间"+data.indexSize+"的入库数需为正整数",{icon:0})
                        return false;
                    }
                    storageNum=Number(storageNum);
                    if (!(/(^[1-9]\d*$)/.test(printNum))) {
                        layer.msg("区间"+data.indexSize+"的打印数需为正整数",{icon:0})
                        return false;
                    }
                    printNum=Number(printNum);
                    if(storageNum < printNum){
                        layer.msg("区间"+data.indexSize+"的入库数需大于等于打印数",{icon:0})
                        return false;
                    }
                    if(i>0){
                        var data2 = configData[i - 1];
                        var storageNum0 = data2.startValue;
                        var printNum0 = data2.color;//打印数
                        if ((storageNum <= storageNum0) || (printNum <= printNum0)) {
                            layer.msg("区间" + data.indexSize + "的入库数、打印数需要大于区间" + data2.indexSize, {icon: 0})
                            return false;
                        }
                    }
                }else{
                    if (i < configData.length - 1) {
                        var data2 = configData[i + 1];
                        var storageNum2 = data2.startValue;
                        if (storageNum2 != null && storageNum2 != '') {
                            if(i==0){
                                layer.msg("区间" + data.indexSize+"入库数、打印数不能为空！", {icon: 0});
                            }else{
                                layer.msg("不能跳过区间" + data.indexSize, {icon: 0});
                            }
                            return false;
                        }
                    }
                }
            }
            loading.show();
            $.ajax({
                url: ctx + '/sysIntervalColorConfig/updateIntervalColorConfig.html',
                dataType: 'json',
                data: {
                    configType: 'WH_PRINT_SKU',
                    dataArray:JSON.stringify(configData)
                },
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code === "0000") {
                        layer.msg("修改sku标签打印数量配置成功",{icon:1});
                    } else {
                        layer.msg("修改sku标签打印数量配置失败",{icon:2});
                    }
                },
                error: function (returnData) {
                    layer.msg(returnData.msg,{icon:2});
                }
            });
        }
        /**获取实际打印数量函数**/
        scantostockin_getActPrintNum_fun=function(storageNum){
            var actPrintNum=storageNum;
            var inputPrintNum=null;
            var curChk;
            if ($('#scantostockin_print_setting_chk').length > 0) {
                curChk = $('#scantostockin_print_setting_chk');
                inputPrintNum=$("#scantostockin_print_num_input").val();
            }else if($('#stockinorder_print_setting_chk').length > 0){
                curChk = $('#stockinorder_print_setting_chk');
                inputPrintNum=$("#stockinorder_print_num_input").val();
            }
            if (curChk == null || curChk == undefined) {
                return actPrintNum;
            }
            curChk.find(".layui-form-radioed").each(function () {
                var val = $(this).prev().val();
                if (val == 0) {//打印1个
                    actPrintNum = 1;
                } else if (val == 2) {//自定义
                    for (var i = printSettingArray.length-1; i >=0; i--) {
                        var pr = printSettingArray[i];
                        if (Number(actPrintNum) > Number(pr.startValue)) {
                            actPrintNum = Number(pr.color);//如果入库数大于区间设置的打印数量，则为区间打印数量
                            break;
                        }
                    }
                }
            });
            if (inputPrintNum != null && inputPrintNum !='' ) {
                if (inputPrintNum < 0) {
                    inputPrintNum = 1;
                }
                actPrintNum = inputPrintNum;
            }
            /**20191126 打印数最大为入库数**/
            if (Number(actPrintNum) > Number(storageNum)) {
                actPrintNum = storageNum;
            }
            if (printSettingArray.length == 0 && Number(actPrintNum) > maxPrintNum) {//如果没有设置打印数量并且打印数量大于允许的最大打印书
                actPrintNum = maxPrintNum;
            }
            return actPrintNum;
        };

    });

</script>