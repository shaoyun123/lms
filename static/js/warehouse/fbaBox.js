console.log("FbaBox");
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
        'FbaBox_table': [
            [ //FBA头程运费
                {checkbox: true, width: 30},
                {title: "箱子编号", field: "boxCode"},
                {title: "箱子尺寸", field: "size"},
                {title: "使用状态", field: "useStatus",templet:"#FbaBox_useStatus_tpl"},
                {title: "创建人", field: "creator"},
                {title: "时间" ,templet:'#fbaBox_timeTemp'},
                {title: '操作', field: "", toolbar: "#FbaBox_Option",width:100}
            ]
        ]
    };

    $('#FbaBox_Search').click(function () {
        form_search();
    })

    function form_search() {//初次search的入口
        let data = serializeObject($('#FbaBox_Form'))
        if (!data.size) {
            data.size = null
        }
        if (data.size === '无') {
            data.size = ''
        }
        initAjax('/amazonFbaWhBox/queryPage.html', 'POST', JSON.stringify(data), function (returnData) {
            // renderPage(returnData.count, data.page, data.limit);
            renderTable(returnData.data.list, 'FbaBox_table');
            //展示
            $('#FbaBox_showInfo_num').html((returnData.data.totalNum-returnData.data.notUsedNum)+"/"+returnData.data.totalNum);
            $('#fbaBox_queryNum').text(returnData.data.list ? returnData.data.list.length : 0)
        }, null, true, true);
    }
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
                    initAjax("/amazonFbaWhBox/delete.html","POST",JSON.stringify({idList:idList}),function (returnData) {
                        layer.msg(returnData.msg||'已删除');
                        $('#FbaBox_Search').click();
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
                fbaBox_print_Start(reqPrintArr);//打印
            }
        });
    }
    var FbaBox_add_and_print=false;

    $('#FbaBox_addBox').click(function () {
        layer.open({
            type: 1,
            title: '添加箱子',
            btn: ['添加并打印','添加', '关闭'],
            area: ['600px', '500px'],
            content: $('#FbaBox_create_tpl').html(),
            success: function (index, layero) {
                form.render('select','FbaBox_create_Form')
            },
            yes: function (index, layero) {
                //触发表单提交任务
                FbaBox_add_and_print=true;//传递打印任务
                $('#FbaBox_createBtn').click();
            },
            btn2: function (index, layero) {
                FbaBox_add_and_print=false;
                //触发表单提交任务
                $('#FbaBox_createBtn').click();
            }
        })
    });
    //批量删除
    $('#FbaBox_batch_delete').click(function () {
        var data = table.checkStatus('FbaBox_table').data;
        if (data.length <= 0) {
            layer.msg('请勾选要删除的箱子')
        }else {
            var idList = data.map(function(item) {
                return item.id;
            });
            layer.confirm('删除将无法再找回数据，确认删除吗?', {btn: ['确认', '取消']}, function () {
                initAjax("/amazonFbaWhBox/delete.html","POST",JSON.stringify({idList:idList}),function (returnData) {
                    layer.msg(returnData.msg||'已删除');
                    $('#FbaBox_Search').click();
                },null,true,true);
            });
        }
    })
//批量打印
    $('#FbaBox_batch_print').click(function () {
        var data = table.checkStatus('FbaBox_table').data;
        if (data.length <= 0) {
            layer.msg('请勾选打印的箱子')
        }else{
            var reqPrintArr = data.map(function(item) {
                var obj={};
                obj.boxCode=item.boxCode;
                obj.printerName = "10040";
                obj.printNumber = 1;
                obj.onlyPreView = false;
                return obj;
            });
            fbaBox_print_Start(reqPrintArr);//打印
        }
    });
    // 批量修改
    $('#FbaBox_batch_modifySize').click(function () {
        let data = table.checkStatus('FbaBox_table').data;
        if (data.length <= 0) {
            layer.msg('请勾选修改的箱子')
            return
        }
        let idList = []
        for (let i = 0; i < data.length; i++) {
            idList.push(data[i].id)
        }
        let popIndex = layer.open({
            type: 1,
            title: '修改箱子尺寸',
            btn: ['保存', '关闭'],
            area: ['600px', '500px'],
            content: $('#FbaBox_modifySize_tpl').html(),
            success: function (index, layero) {
                form.render('select','FbaBox_modifySize_Form')
            },
            yes: function (index, layero) {
                let Adata = {
                    idList: idList,
                    size: $('#FbaBox_modifySize_Form').find('[name=size]').val()
                }

                if (!Adata.size) {
                    layer.msg('请选择尺寸')
                    return
                }

                initAjax('/amazonFbaWhBox/modifySizeByIdList.html', 'POST', JSON.stringify(Adata), function (returnData) {
                    layer.msg('修改成功')
                    layer.close(popIndex)
                    form_search()
                }, null, true, true);
            }
        })

    });

    //提交
    form.on('submit(FbaBox_createBtn)', function (data) {//作为初次提交
        initAjax("/amazonFbaWhBox/batchCreate.html", "POST",JSON.stringify(data.field), function (returnData) {
            layer.closeAll();
            layer.msg(returnData.msg || "创建成功");
            //
            if(FbaBox_add_and_print){//成功添加后需要打印结果
                var codeList=returnData.data;
                var reqPrintArr = codeList.map(function(item) {
                    var obj={};
                    obj.boxCode=item;
                    obj.printerName = "10040";
                    obj.printNumber = 1;
                    obj.onlyPreView = false;
                    return obj;
                });
                fbaBox_print_Start(reqPrintArr);//打印
            }

            $('#FbaBox_Search').click();
        }, null, true, true);
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

    function fbaBox_print_Start(data) { //打印标签
        epeanPrint_plugin_fun(7,data);
    }


    //初始动作
    $('#FbaBox_Search').click();
})
