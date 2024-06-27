/**
 * time: 2018/01/02
 */
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate"], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');



    //查询币种字典
    listAllsrcCy();
    //按钮的点击事件
    $("#addCurrencyRate").click(function() {
        var index = layer.open({
            type: 1,
            title: "添加汇率",
            area: ["800px", "600px"],
            shadeClose: false,
            content: $("#currencyRateLayer").html(),
            btn: ['保存', '关闭'],
            yes: function() {
                $('#addExchangeRateInfo').click();
            },
            success: function() {
                form.render('select');
                //常规用法
                laydate.render({
                    elem: '#exchRateDate'
                });
                //币种渲染
                listAllsrcCy();
            },
            end: function() {
                // $("#addCurrencyRateForm")[0].reset();
                $("#addCurrencyRateForm").trigger('reset');
                $("#addCurrencyRateForm input[name='id']").val("");
            }
        });
    });
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#currencyRateTable",
        method: "post",
        url: ctx + "/sys/getRates.html",
        cols: [
            [
                //标题栏
                { type: "checkbox" },
                { field: "srcCyName", title: "原币种", templet: '<div>{{ d.srcCyName}}({{d.srcCyCode}})</div>'},
                { field: "tarCyName", title: "目标币种" },
                { field: "exchRate", title: "汇率", width: 70 },
                { field: "exchRateDate", title: "汇率日期", templet: '<div>{{ Format(d.exchRateDate,"yyyy-M-d")}}</div>', width: 110 },
                { field: "isFixed", title: "是否固定汇率", templet: '#isFixedTpl', width: 115 },
                { field: "suitableType", title: "适用类型", templet: '#suitableTypeTpl', width: 130 },
                { field: "remark", title: "备注" },
                { field: "modifier", title: "修改人" },
                { field: "modifyTime", title: "修改时间", templet: '<div>{{ Format(d.modifyTime,"yyyy-M-d h:m:s")}}</div>', width: 160 },
                //{ field: "city", title: "定时刊登" },
                //{ field: "experience", title: "操作" },
                //绑定工具条
                { title: '操作', width: 90, align: 'center', toolbar: '#currencyRateTableBar' }
            ],
        ],
        id: 'currencyRateReloadTable',
        page: true,
        limits: [100, 200, 300],
        limit: 100
    });

    // 搜索
    var active = {
        reload: function() {
            var srcCyName = $("#exchangeRateSearchForm select[name='srcCyName'] option:selected").val();
            var tarCyName = $("#exchangeRateSearchForm select[name='tarCyName'] option:selected").val();
            var suitableType = $("#exchangeRateSearchForm select[name='suitableType'] option:selected").val();
            //执行重载
            table.reload('currencyRateReloadTable', {
                page: { curr: 1 },
                where: {
                    srcCyName: srcCyName,
                    tarCyName: tarCyName,
                    suitableType: suitableType,
                }
            });
        }
    };

    $('#exchangeRateSearch').click(function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    form.on('submit(addExchangeRateInfo)', function(data) {
        var exchRateDate = data.field['exchRateDate'];
        //bug修复，日期转换错误影响流程
//        exchRateDate = exchRateDate.replace(/-/g, "/");
//        data.field['exchRateDate'] = new Date(exchRateDate);
        $.ajax({
            type: "POST",
            url: ctx + "/sys/addOrEditRate.html", //请求接口地址
            dataType: "json",
            data: data.field, //需要post的数据
            success: function(res) { //后台程序返回数据
                if (res.code == '0000') {
                    layer.closeAll();
                    layer.msg('操作成功');
                    table.reload('currencyRateReloadTable');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
        return false;
    });

    /*币种字典渲染*/
    function listAllsrcCy() {
        $("#srcCyName").prop("length", 0);
        $.ajax({
            type:"post",
            url:ctx+"/sys/getCurrency.html",
            dataType:"json",
            async: false,
            success:function (returnData) {
                        if (returnData.code == "0000"){
                            $(returnData.data).each(function () {
                                if(this.dKey!='人民币'){
                                    $("#srcCyName").append("<option value='" + this.dKey + "'>" + this.dKey + "</option>");
                                    $("#srcCyNamePage").append("<option value='" + this.dKey + "'>" + this.dKey + "</option>");
                                }
                            });
                   form.render('select');
                } else {
                    layer.msg(returnData.msg);
                }
            }
        })
    }


    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(currencyRateTable)', function(obj) {
        let data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            layer.open({
                type: 1,
                title: "编辑汇率",
                area: ["800px", "600px"],
                shadeClose: false,
                content: $("#currencyRateLayer").html(),
                btn: ['保存', '关闭'],
                yes: function() {
                    $('#addExchangeRateInfo').click();
                },
                success: function(layero, index) {
                    listAllsrcCy();
                    // getExchangeRateInfo(data.id);
                    var addForm = layero.find('form');
                    console.log(JSON.stringify(data))
                    addForm.find("input[name='id']").val(data.id);
                    addForm.find("select[name='srcCyName']").val(data.srcCyName);
                    addForm.find("select[name='tarCyName']").val(data.tarCyName);
                    addForm.find("select[name='suitableType']").val(data.suitableType);
                    addForm.find("input[name='exchRate']").val(data.exchRate);
                    addForm.find("input[name='exchRateDate']").val(Format(data.exchRateDate, "yyyy-M-d"));
                    addForm.find("textarea[name='remark']").val(data.remark);
                    form.render('select');
                    laydate.render({
                        elem: '#exchRateDate'
                    });
                },
                end: function() {
                    // $("#addCurrencyRateForm")[0].reset();
                    $("#addCurrencyRateForm").trigger('reset');
                    $("#addCurrencyRateForm input[name='id']").val("");
                }
            });

        } else if (layEvent === 'del') {
            deleteExchangeRate(data.id);
        }else if(layEvent == 'new'){
          // console.log('最新', data);
          commonReturnPromise({
            url: `/lms/sys/getRateFromJuhe?srcCyCode=${data.srcCyCode}`
          }).then(res => {
            layer.open({
              type:1,
              title: '最新汇率',
              area: ['400px', '400px'],
              content: $('#exchangerate_newRateLayer').html(),
              id: 'exchangerate_newRateLayerId',
              success: function(layero){
                //最新汇率
                layero.find('.newRate').text(res.newExchangeRate);
                //最新汇率扣除手续费后
                layero.find('.newRateByDiscount').text(res.newExchangeRateNoOptFee);
              }
            });
          });
        }
    });

    // 获取汇率信息
    // function getExchangeRateInfo(id) {
    //     if (typeof(id) == "undefined") {
    //         layer.msg('服务器正忙');
    //         return;
    //     }
    //     $.ajax({
    //         type: "POST",
    //         url: ctx + "/sys/getRates.html",
    //         data: { "id": id },
    //         async: false,
    //         dataType: "json",
    //         success: function(returnData) {
    //             $("#addCurrencyRateForm input[name='id']").val(returnData.data[0].id);
    //             console.log(returnData.data[0].srcCyName)
    //              $("#addCurrencyRateForm select[name='srcCyName']").val("菲律宾比索");
    //             //               $("#addCurrencyRateForm select[name='srcCyName']").find("option[value='"+returnData.data[0].srcCyName+"']").prop("selected",true);
    //             $("#addCurrencyRateForm select[name='tarCyName']").val(returnData.data[0].tarCyName);
    //             $("#addCurrencyRateForm select[name='suitableType']").val(returnData.data[0].suitableType);
    //             $("#addCurrencyRateForm input[name='exchRate']").val(returnData.data[0].exchRate);
    //             $("#addCurrencyRateForm input[name='exchRateDate']").val(Format(returnData.data[0].exchRateDate, "yyyy-M-d"));
    //             $("#addCurrencyRateForm textarea[name='remark']").val(returnData.data[0].remark);
    //             form.render('select');

    //         },
    //         error: function() {
    //             layer.msg("服务器正忙");
    //         }
    //     });
    // }

    //删除汇率
    function deleteExchangeRate(id) {
        if (typeof(id) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        layer.confirm('是否删除此汇率？', function(result) {
            if (result) {
                $.ajax({
                    url: ctx + '/sys/delSysExchRate.html',
                    data: { "id": id },
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg('操作成功');
                            table.reload('currencyRateReloadTable');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function() {
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }
});

// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
//Format("2016-10-04 8:9:4.423","yyyy-MM-dd hh:mm:ss.S") ==> 2016-10-04 08:09:04.423
//Format("1507353913000","yyyy-M-d h:m:s.S")      ==> 2017-10-7 13:25:13.0
function Format(datetime, fmt) {
    if (datetime) {
        datetime = datetime.toString();
        if (parseInt(datetime) == datetime) {
            if (datetime.length == 10) {
                datetime = parseInt(datetime) * 1000;
            } else if (datetime.length == 13) {
                datetime = parseInt(datetime);
            }
        }
        datetime = new Date(datetime);
        var o = {
            "M+": datetime.getMonth() + 1, //月份
            "d+": datetime.getDate(), //日
            "h+": datetime.getHours(), //小时
            "m+": datetime.getMinutes(), //分
            "s+": datetime.getSeconds(), //秒
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
            "S": datetime.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    } else {
        return "";
    }
}

// console.log(123);