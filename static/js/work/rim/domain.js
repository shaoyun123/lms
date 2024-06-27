layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage'], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        layer = layui.layer;
    form.render('select');
    getPlatCodeList();

    // 表单提交
    form.on('submit(DomainManageSearch)', function (data) {
        var formData = data.field;
        console.log("DomainManageSearch");
        DomainManage_tablerender(formData);
    });

    //获取店铺列表
    function getPlatCodeList() {
        initAjax('/enum/getSalesPlatEnum.html', 'get', {}, function(returnData) {
            var plctCodeList = returnData.data;
            console.log("list",plctCodeList);
            logics_append_op('platCode', returnData.data)
            form.render('select')
        })
    }


    function logics_append_op(domName, obj) {
        var $li = '<option value="">请选择</option>';
        var valuecode = {'platCode': 'name' }
        for (var i in obj) {
            $li += '<option value=' + obj[i][valuecode[domName]] + '>' + obj[i].name + '</option>';
        }
        $('#' + domName).append($li);
    }


    //渲染表格
    function DomainManage_tablerender(data) {
        table.render({
            elem: '#DomainManageTable',
            method: 'post',
            url: '/lms/domain/queryByDomainAndPlat.html',
            where:{domain:data.domain,
                   platCode: data.platCode} ,
            page: false,
            limit: 50,
            limits:[50,100,150],
            id: 'DomainManageTable',
            cols: [
                [
                    {checkbox: true, width: 30},
                    {title: "域名", field: "domain", sort: true},
                    {title: "域名平台", field: "platName", sort: true},
                    {title:"店铺",field:"storeAcctStr"},
                    {
                        title: "过期时间",
                        field: "expirTime",
                        templet: '<div>{{ Format(d.expirTime,"yyyy-MM-dd hh:mm:ss")}}</div>',
                        sort: true
                    },
                ]
            ]

        })
    }

    //同步
    $('#asyncDomainManage').click(function () {
        asyncDomainManage(null, function(returnData) {
            layer.msg(returnData.msg || '同步成功');
            $('#DomainManageSearch').click();
        });
    });

    //同步
    function asyncDomainManage(data, func) {
        initAjax('/domain/syncAll.html', 'POST', JSON.stringify(data), function (returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //内部ajax封装
    function initAjax(url, method, data, succefunc, contentType,cancleLoad) { //初始化ajax请求
        if(cancleLoad){

        }else {
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
                loading.hide();
                if (returnData.code == "0000") {
                    succefunc(returnData)
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            },
            error: function () {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }
})