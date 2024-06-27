console.log("FbaCombSkuBox");
//结构
//初始化和数据结构定义
//click事件定义
//表单事件最后
//无业务意义的方法
layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage', 'upload', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        layer = layui.layer,
        upload = layui.upload;
    laydate = layui.laydate;
    form.render('select');
    var tablecol = {
        'FbaCombSkuBox_table': [
            [ //FBA头程运费
                {checkbox: true, width: 30},
                {title: "篮子编号", field: "boxCode"},
                {title: "使用状态", field: "useStatus",templet:"#FbaCombSkuBox_useStatus_tpl"},
                {title: "创建人", field: "creator"},
                {title: "创建时间", field: "createTime",templet:'<div>{{format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>'},
                {title: '操作', field: "", toolbar: "#FbaCombSkuBox_Option",width:100}
            ]
        ]
    };

    // 弹框-----------------
    //监听工具栏操作(精简化操作,使用封装方法的形式,使代码简洁,简单ajax无需封装)
    for (var i in tablecol) {
        table.on('tool(' + i + ')', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;

            if (layEvent === 'delete') {
                layer.confirm('您确认要删除吗？', {icon: 3, title: '提示'}, function () {
                    var idList=[];
                    idList.push(data.id);
                    initAjax("/amazonFbaWhCombSkuBox/delete.html","POST",JSON.stringify({idList:idList}),function (returnData) {
                        layer.msg(returnData.msg||'已删除');
                        $('#FbaCombSkuBox_Search').click();
                    },null,true,true);
                });
            }
            if (layEvent === 'print') {
                var reqPrintArr=[];
                var obj={};
                obj.boxCode=data.boxCode;
                obj.printerName = "10040";
                obj.printNumber = 1;
                obj.onlyPreView = false;
                reqPrintArr.push(obj);
                FbaCombSkuBox_print_Start(reqPrintArr);//打印
            }
        });
    }
    var FbaCombSkuBox_add_and_print=false;

    $('#FbaCombSkuBox_addBox').click(function () {
        layer.open({
            type: 1,
            title: '添加篮子',
            btn: ['添加并打印','添加', '关闭'],
            area: ['35%', '30%'],
            content: $('#FbaCombSkuBox_create_tpl').html(),
            success: function (index, layero) {

            },
            yes: function (index, layero) {
                //触发表单提交任务
                FbaCombSkuBox_add_and_print=true;//传递打印任务
                $('#FbaCombSkuBox_createBtn').click();
            },
            btn2: function (index, layero) {
                FbaCombSkuBox_add_and_print=false;
                //触发表单提交任务
                $('#FbaCombSkuBox_createBtn').click();
            }
        })
    });
    //批量删除
    $('#FbaCombSkuBox_batch_delete').click(function () {
        var data = table.checkStatus('FbaCombSkuBox_table').data;
        if (data.length <= 0) {
            layer.msg('请勾选要删除的篮子')
        }else {
            var idList = data.map(function(item) {
                return item.id;
            });
            layer.confirm('删除将无法再找回数据，确认删除吗?', {btn: ['确认', '取消']}, function () {
                initAjax("/amazonFbaWhCombSkuBox/delete.html","POST",JSON.stringify({idList:idList}),function (returnData) {
                    layer.msg(returnData.msg||'已删除');
                    $('#FbaCombSkuBox_Search').click();
                },null,true,true);
            });
        }
    })
//批量打印
    $('#FbaCombSkuBox_batch_print').click(function () {
        var data = table.checkStatus('FbaCombSkuBox_table').data;
        if (data.length <= 0) {
            layer.msg('请勾选打印的篮子')
        }else{
            var reqPrintArr = data.map(function(item) {
                var obj={};
                obj.boxCode=item.boxCode;
                obj.printerName = "10040";
                obj.printNumber = 1;
                obj.onlyPreView = false;
                return obj;
            });
            FbaCombSkuBox_print_Start(reqPrintArr);//打印
        }
    });

    //提交
    form.on('submit(FbaCombSkuBox_createBtn)', function (data) {//作为初次提交
        initAjax("/amazonFbaWhCombSkuBox/batchCreate.html", "POST",JSON.stringify(data.field), function (returnData) {
            layer.closeAll();
            layer.msg(returnData.msg || "创建成功");
            //
            if(FbaCombSkuBox_add_and_print){//成功添加后需要打印结果
                var codeList=returnData.data;
                var reqPrintArr = codeList.map(function(item) {
                    var obj={};
                    obj.boxCode=item;
                    obj.printerName = "10040";
                    obj.printNumber = 1;
                    obj.onlyPreView = false;
                    return obj;
                });
                FbaCombSkuBox_print_Start(reqPrintArr);//打印
            }

            $('#FbaCombSkuBox_Search').click();
        }, null, true, true);
    });

    // 表单提交
    //验证 //分页效果,从按钮触发是否可以重置//如果不能重置,则改为非表单提交,表单的目的做数据校验
    form.on('submit(FbaCombSkuBox_Search)', function (data) {//作为初次提交
        // data.field.page = 1;//保障首次分页请求中带有的值正确,分页首次为第一页,如果页面刷新业务需要保持在原有页,则注释此行
        // if (data.field.time) {
        //     data.field.startTime = data.field.time.split(' - ')[0] + ' 00:00:00';
        //     data.field.endTime = data.field.time.split(' - ')[1] + ' 23:59:59';
        // }
        var {useStatus}=data.field;
        form_search({useStatus});
    });


    function initAjax(url, method, data, succFunc, contentType, loadingShow, laodingHide) { //初始化ajax请求
        if (loadingShow) {
            loading.show();
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (returnData.code == "0000") {
                    succFunc(returnData)
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            },
            error: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }


    function form_search(data) {//初次search的入口
        initAjax('/amazonFbaWhCombSkuBox/queryPage.html', 'POST', JSON.stringify(data), function (returnData) {
            // renderPage(returnData.count, data.page, data.limit);
            renderTable(returnData.data.list, 'FbaCombSkuBox_table');
            //展示
            $('#FbaCombSkuBox_showInfo_num').html((returnData.data.totalNum-returnData.data.notUsedNum)+"/"+returnData.data.totalNum);
        }, null, true, true);
    }

    function renderTable(data, tablename, func) {//
        var tableIns = table.render({
            elem: '#' + tablename,
            method: 'POST',
            data: data,
            cols: tablecol[tablename],
            page: false,
            limit: Number.MAX_VALUE,
            id: tablename,
            done: function (data) {
                if (func) {
                    func(data);
                }
            }
        })
    }

    function getFormReqObj(formIdName) {//获取表单参数
        var d = {};
        var t = $('#' + formIdName + ' [name]').serializeArray();
        $.each(t, function () {
            d[this.name] = this.value;
        });
        return d;
    }

    function renderPage(count, current, limit) {//分页
        laypage.render({
            elem: 'FbaCombSkuBox_page',
            curr: current,
            limit: limit,
            limits: [10, 300, 500],
            layout: ['prev', 'page', 'next', 'count','limit'],
            count: count,
            jump: function (obj, first) {
                $('#FbaCombSkuBox_Form input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#FbaCombSkuBox_Form input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    var data = getFormReqObj("FbaCombSkuBox_Form");
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    form_search(data);
                }
            }
        });
    }

    function FbaCombSkuBox_print_Start(data) { //打印标签
        epeanPrint_plugin_fun(7,data);
    }


    //初始动作
    $('#FbaCombSkuBox_Search').click();
})
