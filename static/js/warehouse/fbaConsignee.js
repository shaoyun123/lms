console.log("fbaConsignee");
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
        upload = layui.upload,
        laydate = layui.laydate;
    form.render('select');
    var  default_country_List=[];//国家列表
    var  default_address_List=[];//缩写目的地列表

    var tablecol = {
        'fbaConsignee_table': [
            [ //
                // {checkbox: true, width: 30},
                {title: "目的地仓库简称", field: "recipientPersonName"},
                {title: "国家全称", field: "recipientCompanyName"},
                {title: "国家简称", field: "recipientCountryCode"},
                {title: "邮编", field: "recipientPostalCode"},
                {title: "电话", field: "recipientPhoneNumber"},
                {title: "城市", field: "recipientCity"},
                {title: "电子邮件", field: "recipientEmailAddress"},
                {title: "州", field: "recipientStateOrProvinceCode"},
                {title: "地址第一行", field: "recipientStreetLines"},
                {title: "地址标记", field: "address"},
                // {title: "地址第二行", field: "recipientStreetLines2"},
                // {title: "地址第三行", field: "recipientStreetLines3"},
                {title: "创建人", field: "creator"},
                {title: "创建时间", field: "createTime",templet:'<div>{{format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>'},
                {title: '操作', field: "", toolbar: "#fbaConsignee_Option",width:100}
            ]
        ]
    };

    // 弹框-----------------
    //监听工具栏操作(精简化操作,使用封装方法的形式,使代码简洁,简单ajax无需封装)
    for (var i in tablecol) {
        table.on('tool(' + i + ')', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;

            if (layEvent === 'edit') {
                layer.open({
                    type: 1,
                    title: '修改',
                    btn: ['修改', '关闭'],
                    area: ['40%', '80%'],
                    content: $('#fbaConsignee_createOrEdit_tpl').html(),
                    success: function (index, layero) {
                        // 初始化必填项
                        initNotNull('#fbaConsignee_createOrEdit_Form')
                        let formElem = $('#fbaConsignee_createOrEdit_Form')
                        //初始化
                        appendSelectByFun($("#fbaConsignee_createOrEdit_Form select[name=recipientCountryCode]"), default_country_List,function (item) {
                            return item.enSimpleName;
                        }, function (item) {
                            return item.enFullName+"("+item.cnName+"--"+item.enSimpleName+")";
                        });
                        appendSelect($("#fbaConsignee_createOrEdit_Form select[name=recipientPersonName]"),default_address_List,"dKey","dKey");

                        //回显
                        let inps = formElem.find('[name]')
                        for (let i = 0; i < inps.length;++i) {
                            inps[i].value = data[inps[i].name]
                        }

                        form.render();
                    },
                    yes: function (index, layero) {
                        $('#fbaConsignee_createOrEdit_Btn').click();
                    }
                })
            }
        });
    }

    $('#fbaConsignee_addOne').click(function () {
        layer.open({
            type: 1,
            title: '添加',
            btn: ['添加', '关闭'],
            area: ['40%', '80%'],
            content: $('#fbaConsignee_createOrEdit_tpl').html(),
            success: function (index, layero) {
                initNotNull('#fbaConsignee_createOrEdit_Form')
                appendSelectByFun($("#fbaConsignee_createOrEdit_Form select[name=recipientCountryCode]"), default_country_List,function (item) {
                    return item.enSimpleName;
                }, function (item) {
                    return item.enFullName+"("+item.cnName+"--"+item.enSimpleName+")";
                });
                appendSelect($("#fbaConsignee_createOrEdit_Form select[name=recipientPersonName]"),default_address_List,"dKey","dKey");

                form.render();
            },
            yes: function (index, layero) {
                $('#fbaConsignee_createOrEdit_Btn').click();
            }
        })
    });

    //提交
    form.on('submit(fbaConsignee_createOrEdit_Btn)', function (data) {//作为初次提交
        initAjax("/amazonFbaReceiveAddress/createOrEdit.html", "POST",JSON.stringify(data.field), function (returnData) {
            layer.closeAll();
            layer.msg(returnData.msg || "提交成功");
            $('#fbaConsignee_Search').click();
        }, null, true, true);
    });

    // 表单提交
    //验证 //分页效果,从按钮触发是否可以重置//如果不能重置,则改为非表单提交,表单的目的做数据校验
    form.on('submit(fbaConsignee_Search)', function (data) {//作为初次提交
        // data.field.page = 1;//保障首次分页请求中带有的值正确,分页首次为第一页,如果页面刷新业务需要保持在原有页,则注释此行
        // if (data.field.time) {
        //     data.field.startTime = data.field.time.split(' - ')[0] + ' 00:00:00';
        //     data.field.endTime = data.field.time.split(' - ')[1] + ' 23:59:59';
        // }
        form_search(data.field);
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
        initAjax('/amazonFbaReceiveAddress/queryPage.html', 'POST', JSON.stringify(data), function (returnData) {
            // renderPage(returnData.count, data.page, data.limit);
            renderTable(returnData.data, 'fbaConsignee_table');
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
            elem: 'fbaConsignee_page',
            curr: current,
            limit: limit,
            limits: [10, 300, 500],
            layout: ['prev', 'page', 'next', 'count','limit'],
            count: count,
            jump: function (obj, first) {
                $('#fbaConsignee_Form input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#fbaConsignee_Form input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    var data = getFormReqObj("fbaConsignee_Form");
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    form_search(data);
                }
            }
        });
    }

    //填充下拉框
    function appendSelect( dom, data, value, name) {
        $(dom).empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            option += '<option value="' + data[i][value] + '">' + data[i][name] + '</option>'
        }
        $(dom).append(option);
    }
    //填充下拉框指定组合方式
    function appendSelectByFun( dom, data, valueFun, nameFun) {
        $(dom).empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            option += '<option value="' + valueFun(data[i]) + '">' + nameFun(data[i]) + '</option>'
        }
        $(dom).append(option);
    }

    //初始化国家和地区
    initAjax("/amazonFbaReceiveAddress/listAllCountry.html", "POST",null, function (returnData) {
        returnData.data.forEach(function(item){
            default_country_List.push(item);
        });
    }, null, true, true);
    //初始化缩写目的地
    // initAjax("/sysdict/getSysFlatDictsByHead.html", "POST",{dictHead:"DICT_AMAZON_FBA_DEST_SITE"}, function (returnData) {
    //     returnData.data.forEach(function(item){
    //         default_address_List.push(item);
    //     });
    // }, 'application/x-www-form-urlencoded', true, true);


    //初始动作
    $('#fbaConsignee_Search').click();
})
