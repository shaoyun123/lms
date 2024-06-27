console.log("storageCheckRecord");
layui.use(["admin", "form", "table", "layer", "laytpl", 'laydate', 'upload', 'formSelects', 'element'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        upload = layui.upload,
        laypage = layui.laypage;
    $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");

    var SCR_errType_ = []; //全局异常类型
    //初始化出错类型
    $.ajax({
        type: 'post',
        url: ctx + '/sysdict/getBizDictByCode.html',
        dataType: 'json',
        data: { headCode: "WH_CHECK_ERR_TYPE" },
        async: false,
        success: function(res) {
            if (res.code == '0000') {
                var storageCheckRecord_errType_list = []; //这里用的
                var info = res.data;
                var emTmp = {};
                emTmp.value = "无异常";
                emTmp.name = "无异常";
                storageCheckRecord_errType_list.push(emTmp);
                for (var i = 0; i < info.length; i++) {
                    var tmp = {};
                    tmp.value = info[i].code;
                    tmp.name = info[i].name;
                    SCR_errType_.push(tmp);
                    storageCheckRecord_errType_list.push(tmp);
                }
                formSelects.data('storageCheckRecord_errType', 'local', { arr: storageCheckRecord_errType_list });
                // layui.formSelects.value('storageCheckRecord_errType', 'nameStr');
            } else {
                layer.msg(res.msg)
            }
        }
    });
    //初始化反馈者部门
    $('#storageCheckRecord_form select[name=reporterDepart]').append(`<option value="">请选择</option>`);
    initSelectIcon(form, 'WH_CHECK_REPORT_DEPART', '#storageCheckRecord_form select[name=reporterDepart]', true);

    laydate.render({
        elem: '#storageCheckRecord_createTime', //渲染时间
        range: true
    });

    //监听tab切换来选中不同的tab页
    element.on('tab(storageCheckRecord_tab)', function(data) {
        if (data.index == 0) {
            $('#storageCheckRecord_form input[name=haveDel]').val('false');
            $("#storageCheckRecord_search").trigger('click');
        } else if ((data.index == 1)) {
            $('#storageCheckRecord_form input[name=haveDel]').val('true');
            $("#storageCheckRecord_search").trigger('click');
        }
    });

    var SCR_limitAllAppoint = 100; //每页显示数据条数
    var SCR_currentPageAllAppoint = 1; //当前页数
    var SCR_dataLength = 0; //数据总条数

    //搜索事件
    $("#storageCheckRecord_search").click(function() {
        SCR_currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
        SCR_dataLength = 0;

        storageCheckRecord_search();
    });

    function storageCheckRecord_search() {
        var timeStr = $("#storageCheckRecord_form input[name=time]").val();
        var startTime = '';
        var endTime = '';
        if (timeStr) {
            startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
            endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
        }
        var searchType = $("#storageCheckRecord_form select[name=searchType]").val();
        var prodPSkuStr = '';
        var prodSSkuStr = '';
        if ("pSkus" == searchType) {
            prodPSkuStr = $("#storageCheckRecord_form input[name=skuInfo]").val();
        } else if ("sSkus" == searchType) {
            prodSSkuStr = $("#storageCheckRecord_form input[name=skuInfo]").val();
        }
        loading.show();
        $.ajax({
            type: 'post',
            url: ctx + '/whStorageCheckRecord/queryPage.html',
            data: JSON.stringify({
                reporterDepart: $("#storageCheckRecord_form select[name=reporterDepart]").val(),
                errType: layui.formSelects.value('storageCheckRecord_errType', 'nameStr'),
                errDesc: $("#storageCheckRecord_form input[name=errDesc]").val(),
                prodSSkuStr: prodSSkuStr,
                prodPSkuStr: prodPSkuStr,
                startTime: startTime,
                endTime: endTime,
                haveDel: $('#storageCheckRecord_form input[name=haveDel]').val(),
                page: SCR_currentPageAllAppoint,
                limit: SCR_limitAllAppoint
            }),
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            success: function(res) {
                var data = res.data;
                table.render({
                    elem: '#storageCheckRecord_table1',
                    id: 'storageCheckRecord_table1',
                    data: data,
                    limit: data.length,
                    cols: [
                        [
                            //标题栏
                            { type: "checkbox" },
                            { field: "storageNumber", title: "入库单号" },
                            {
                                field: "image",
                                title: "图片",
                                templet: `<div><img width="60" height="60" src="` + tplIVP + `{{  d.image }}"  data-onerror="layui.admin.img_noFind()" class="lazy b1"></div>`
                            },
                            { field: "sSku", title: "子SKU" },
                            { field: "reporter", title: "反馈人" },
                            { field: "reporterDepart", title: "反馈部门" },
                            { field: "creator", title: "经办人" },
                            { field: "checker", title: "点货专员" },
                            { field: "puter", title: "上架专员" },
                            { field: "errType", title: "出错类型" },
                            { field: "errDesc", title: "问题描述" },
                            { field: "taxPrice", title: "含税单价(￥)" },
                            { field: "actualNum", title: "实际数量" },
                            { field: "checkNum", title: "盘点数量" },
                            { field: "errorNum", title: "异常数量" },
                            {
                                title: "操作",
                                align: "center",
                                toolbar: "#storageCheckRecord_bar",
                            },
                        ],
                    ],
                    done: function(){
                        var txt = $('[lay-filter="storageCheckRecord_tab"]').find('li.layui-this').text();
                        if(txt == '已处理'){
                            $('[data-field=14]').addClass('disN');
                        }
                    }
                });
                laypage.render({
                    elem: 'test1',
                    count: res.count, //数据总数，从服务端得到
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                    limits: [50, 100, 500, 1000],
                    curr: SCR_currentPageAllAppoint,
                    limit: SCR_limitAllAppoint,
                    jump: function(obj, first) {
                        SCR_currentPageAllAppoint = obj.curr;
                        SCR_limitAllAppoint = obj.limit;
                        //首次不执行
                        if (!first) {
                            storageCheckRecord_search()
                        }
                    }
                });
            },
            error: function(error) {
                layer.msg(error);
            },
            complete: function() {
                loading.hide();
            }
        });
    }

    //行事件
    table.on("tool(storageCheckRecord_table1)", function(obj) {
        var data = obj.data;
        if (obj.event == "storageCheckRecord_tr_edit") {
            layer.open({
                type: 1,
                title: "编辑",
                area: ["80%", "80%"],
                btn: ["保存", "关闭"],
                content: $("#storageCheckRecord_add_tpl").html(),
                success: function(index, layero) {
                    $("#storageCheckRecord_refreshInfo").addClass("disN");
                    //初始化反馈者部门
                    $('#storageCheckRecord_add_form select[name=reporterDepart]').append(`<option value="">请选择</option>`);
                    initSelectIcon(form, 'WH_CHECK_REPORT_DEPART', '#storageCheckRecord_add_form select[name=reporterDepart]', true);

                    loading.show();
                    //获取入库单的详情
                    $.ajax({
                        type: "POST",
                        url: ctx + "/whStorageCheckRecord/queryStorageInfoById.html",
                        data: JSON.stringify({ id: data.id }),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(returnData) {
                            if (returnData.code == '0000') {
                                var html = template('storageCheckRecord_add_table_tpl', returnData);
                                $('#storageCheckRecord_add_table').html(html);
                                //初始化错误类型
                                var errType_optionDiv = "<option value=''>请选择</option>";
                                for (var i = 0; i < SCR_errType_.length; i++) {
                                    errType_optionDiv += `<option value="` + SCR_errType_[i].value + `">` + SCR_errType_[i].name + `</option>`;
                                }
                                $("#storageCheckRecord_add_table_body").find("tr").each(function() {
                                    $(this).find('select[name=errType]').append(errType_optionDiv);
                                });
                                //赋值+屏蔽不能修改的框(因为只有一条数据,可以直接赋值)
                                var info = returnData.data[0];
                                $("#storageCheckRecord_add_form input[name=storageNumber]").val(info.storageNumber);
                                $("#storageCheckRecord_add_form input[name=storageNumber]").prop("readonly", true)
                                $("#storageCheckRecord_add_form input[name=reporter]").val(info.reporter);
                                $("#storageCheckRecord_add_form select[name=reporterDepart]").val(info.reporterDepart);
                                $("#storageCheckRecord_add_form select[name=errType]").val(info.errType);
                                $("#storageCheckRecord_add_form textarea[name=errDesc]").val(info.errDesc);
                                $("#storageCheckRecord_add_form input[name=puter]").val(info.puter);
                                $("#storageCheckRecord_add_form input[name=checkNum]").val(info.checkNum);
                                $("#storageCheckRecord_add_form input[name=errorNum]").val(info.errorNum);

                                form.render('select');
                                form.render('checkbox');
                            } else {
                                layer.msg(returnData.msg, { icon: 5 });
                            }
                        },
                        complete: function() {
                            loading.hide();
                        }
                    });
                    return false;
                },
                yes: function(index, layero) {
                    var req = {};
                    req.id = data.id;
                    var tdArr = $("#storageCheckRecord_add_table_body").find("tr").children();
                    req.storageNumber = $('#storageCheckRecord_add_form input[name=storageNumber]').val();
                    req.reporter = $('#storageCheckRecord_add_form input[name=reporter]').val();
                    req.reporterDepart = $('#storageCheckRecord_add_form select[name=reporterDepart]').val();
                    req.whName = tdArr.eq(2).html();
                    req.sSku = tdArr.eq(4).html();
                    req.checker = tdArr.eq(5).html();
                    req.puter = tdArr.eq(6).find('input[name=puter]').val();
                    req.errType = tdArr.eq(7).find('select[name=errType]').val();
                    req.errDesc = tdArr.eq(8).find('textarea[name=errDesc]').val();
                    req.actualNum = tdArr.eq(9).html();
                    req.checkNum = tdArr.eq(10).find('input[name=checkNum]').val();
                    req.errorNum = tdArr.eq(11).find('input[name=errorNum]').val();
                    //确认钮
                    loading.show();
                    $.ajax({
                        type: "POST",
                        url: ctx + "/whStorageCheckRecord/edit.html",
                        data: JSON.stringify(req),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                layer.close(index);
                                layer.msg("修改成功");
                                $("#storageCheckRecord_search").trigger("click");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function() {
                            layer.msg("服务器正忙");
                        },
                        complete: function() {
                            loading.hide();
                        }
                    });
                    return false;
                }
            })
        }
    });

    //新增
    $("#storageCheckRecord_add").click(function() {
        layer.open({
            type: 1,
            title: "新增",
            id: 'storageCheckRecord_add_layer',
            area: ["80%", "80%"],
            btn: ["保存", "关闭"],
            content: $("#storageCheckRecord_add_tpl").html(),
            success: function(index, layero) {
                $('input[name=storageNumber]').on('keydown', function(e) {
                        if (e.keyCode == 13) {
                            $('#storageCheckRecord_refreshInfo').trigger('click')
                        }
                    })
                    //初始化反馈者部门
                $('#storageCheckRecord_add_form select[name=reporterDepart]').append(`<option value="">请选择</option>`);
                initSelectIcon(form, 'WH_CHECK_REPORT_DEPART', '#storageCheckRecord_add_form select[name=reporterDepart]', true);


                //获取入库单的详情
                $("#storageCheckRecord_refreshInfo").click(function() {
                    $.ajax({
                        type: "POST",
                        url: ctx + "/whStorageCheckRecord/queryStorageInfo.html",
                        data: JSON.stringify({ storageNumber: $('#storageCheckRecord_add_form input[name=storageNumber]').val() }),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(returnData) {
                            if (returnData.code == '0000') {
                                html = template('storageCheckRecord_add_table_tpl', returnData);
                                $('#storageCheckRecord_add_table').html(html);
                                //初始化错误类型
                                var errType_optionDiv = "<option value=''>请选择</option>";
                                for (var i = 0; i < SCR_errType_.length; i++) {
                                    errType_optionDiv += `<option value="` + SCR_errType_[i].value + `">` + SCR_errType_[i].name + `</option>`;
                                }
                                $("#storageCheckRecord_add_table_body").find("tr").each(function() {
                                    $(this).find('select[name=errType]').append(errType_optionDiv);
                                });
                                form.render('select');
                                form.render('checkbox');
                            } else {
                                layer.msg(returnData.msg, { icon: 5 });
                            }
                        }
                    });
                });
                $("#storageCheckRecord_form input[name=storageNumber]").on('keydown', function(event) {
                    if (event.keyCode == 13) {
                        $("#storageCheckRecord_refreshInfo").trigger("click");
                        return false;
                    }
                });
                return false;
            },
            yes: function(index, layero) {
                var req = {};
                req.storageNumber = $('#storageCheckRecord_add_form input[name=storageNumber]').val();
                req.reporter = $('#storageCheckRecord_add_form input[name=reporter]').val();
                req.reporterDepart = $('#storageCheckRecord_add_form select[name=reporterDepart]').val();

                var infoList = [];
                $("#storageCheckRecord_add_table_body").find("tr").each(function() {
                    var tdArr = $(this).children();
                    if (tdArr.eq(0).find('input[name=id]').prop('checked')) {
                        var subInfo = {};
                        subInfo.storageNumber = tdArr.eq(1).html();
                        subInfo.whName = tdArr.eq(2).html();
                        subInfo.sSku = tdArr.eq(4).html();
                        subInfo.checker = tdArr.eq(5).html();
                        subInfo.puter = tdArr.eq(6).find('input[name=puter]').val();
                        subInfo.errType = tdArr.eq(7).find('select[name=errType]').val();
                        subInfo.errDesc = tdArr.eq(8).find('textarea[name=errDesc]').val();
                        subInfo.actualNum = tdArr.eq(9).html();
                        subInfo.checkNum = tdArr.eq(10).find('input[name=checkNum]').val();
                        subInfo.errorNum = tdArr.eq(11).find('input[name=errorNum]').val();
                        infoList.push(subInfo);
                    }
                });
                if (infoList.length < 1) {
                    layer.msg("至少勾选一个sku", { icon: 5 });
                    return false;
                }
                req.infoList = infoList;
                //确认钮
                loading.show();
                $.ajax({
                    type: "POST",
                    url: ctx + "/whStorageCheckRecord/save.html",
                    data: JSON.stringify(req),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.close(index);
                            layer.msg("新增成功");
                            $("#storageCheckRecord_search").trigger("click");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function() {
                        layer.msg("服务器正忙");
                    },
                    complete: function() {
                        loading.hide();
                    }
                });
                return false;
            },
            end: function(index, layero) {
                return false;
            },
        })
    });

    //下载模板
    $("#storageCheckRecord_downTmp").click(function() {
        window.location.href = ctx + '/static/templet/prod_check_record.xlsx'
    })

    //批量处理
    $("#storageCheckRecord_batchHandle").click(function() {
        var checkStatus = table.checkStatus('storageCheckRecord_table1'); //idTest 即为基础参数 id 对应的值
        if (checkStatus.data && checkStatus.data.length > 0) {
            layer.open({
                type: 1,
                title: "批量处理",
                area: ["600px", "200px"],
                btn: ["提交", "关闭"],
                content: $("#storageCheckRecord__handleStatus_tpl").html(),
                success: function(index, layero) {
                    form.render('radio');
                    return false;
                },
                yes: function(index, layero) {
                    var infoList = checkStatus.data;
                    var idList = '';
                    for (var i = 0; i < infoList.length; i++) {
                        if (i == 0) {
                            idList += infoList[i].id;
                        } else {
                            idList += "," + infoList[i].id;
                        }
                    }

                    //确认钮
                    $.ajax({
                        type: "POST",
                        url: ctx + "/whStorageCheckRecord/batchHandle.html",
                        data: JSON.stringify({
                            idListStr: idList,
                            handleStatus: $('#storageCheckRecord_handleStatus_radio input[name=handleStatus]:checked').val()
                        }),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                layer.close(index);
                                layer.msg("批量处理成功");
                                $("#storageCheckRecord_search").trigger("click");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function() {
                            layer.msg("服务器正忙");
                        },
                        complete: function() {
                            loading.hide();
                        }
                    });
                    return false;
                }
            })
        } else {
            layer.msg("至少选择一条数据", { icon: 5 });
        }
    })

    //上传初始化
    //执行实例
    var uploadInst = upload.render({
        elem: '#storageCheckRecord_import', //绑定元素
        field: 'storageCheckRecordImportFile',
        accept: 'file',
        exts: 'xlsx',
        url: ctx + '/whStorageCheckRecord/importInfo.html', //上传接口
        before: function() {
            loading.show();
        },
        done: function(returnData) {
            if (returnData.code == "0000") {
                layer.msg("上传成功");
            } else {
                layer.alert(returnData.msg.replace(/\n/g, '<br>'), { icon: 2 });
            }
            $("#storageCheckRecord_search").trigger('click');
            loading.hide();
        },
        error: function() {
            layer.msg("服务器正忙");
        }
    });

    //导出
    $("#storageCheckRecord_export").click(function() {
        var timeStr = $("#storageCheckRecord_form input[name=time]").val();
        var startTime = '';
        var endTime = '';
        if (timeStr) {
            startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
            endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
        }
        var searchType = $("#storageCheckRecord_form select[name=searchType]").val();
        var prodPSkuStr = '';
        var prodSSkuStr = '';
        if ("pSkus" == searchType) {
            prodPSkuStr = $("#storageCheckRecord_form input[name=skuInfo]").val();
        } else if ("sSkus" == searchType) {
            prodSSkuStr = $("#storageCheckRecord_form input[name=skuInfo]").val();
        }
        if (startTime && endTime) {
            var m = parseInt(Math.abs(endTime - startTime)) / 1000 / 60 / 60 / 24 / 30;
            if (m > 3) {
                layer.msg("录入时间区间不可超过3个月");
                return;
            }
        } else {
            layer.msg("录入时间必选");
            return;
        }
        var req = {
            reporterDepart: $("#storageCheckRecord_form select[name=reporterDepart]").val(),
            errType: layui.formSelects.value('storageCheckRecord_errType', 'nameStr'),
            errDesc: $("#storageCheckRecord_form input[name=errDesc]").val(),
            prodSSkuStr: prodSSkuStr,
            prodPSkuStr: prodPSkuStr,
            startTime: startTime,
            endTime: endTime,
            haveDel: $('#storageCheckRecord_form input[name=haveDel]').val(),
        };
        submitForm(req, ctx + '/whStorageCheckRecord/export.html');
    });
});