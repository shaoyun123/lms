/**仓库人员作业一览**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element", "formSelects"], function () {
    var layer = layui.layer,
        form = layui.form,
        element=layui.element,
        table = layui.table;
    form.render('select');
    sysconfig_count_fun();
    //查询渲染表格
    $("#sysconfig_search_btn").click(function () {
        sysconfig_count_fun();
    });
    /**
     * 刷新component配置
     */
    $("#sysconfig_refresh_btn").click(function () {
        $.ajax({
            url: ctx + "/sys/refreshProperties.html",
            type: 'post',
            dataType: "json",
            success: function(res) {
                loading.hide();
                if (res.code == '0000') {
                    layer.msg('刷新配置信息成功',{icon:1});
                    sysconfig_count_fun();
                } else {
                    layer.msg(res.msg,{icon:2})
                }
            },
            error: function () {
                loading.hide()
            }
        })
    });
    /**监听tab选项卡切换**/
    element.on('tab(sysconfig_tab)', function (data) {
        sysconfig_count_fun();
    });
    /**渲染**/
    function sysconfig_count_fun() {
        var data = sysconfig_getSeacrhData();
        table.render({
            id:"sysconfig_data_table",
            elem: '#sysconfig_data_table',
            url: ctx + "/sys/sysConfigPage.html",
            page: false, //开启分页
            method: 'post',
            where: data,
            cols: [
                [ //表头
                    {field: 'appCode', title: '应用',width:80},
                    {field: 'cGroup', title: '组',width:80},
                    {field: 'cKey', title: 'key',width:320,templet:"#sysconfig_cKey_tpl"},
                    {field: 'cValue', title: '配置值',width:600,templet:"#sysconfig_cValue_tpl"},
                    {field: 'remark', title: '备注',templet:"#sysconfig_remark_tpl"},
                    {field: 'status', title: '状态',width:80,templet:"#sysconfig_operate"},
                    {field: 'createTime', title: '创建时间',width:150,templet:"#sysconfig_createTime_tpl"},
                    {field: 'creator', title: '创建者',width:100},
                ]
            ],
            done: function (res, curr, count) {
                if (res.code == '0000') {
                    $("#sysconfig_total_num").html(count);
                } else {
                    layer.msg(res.msg, {icon: 0});
                }
            },
        });
    };
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(sysconfig_data_table)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        var id = data.id;
        var ckey=data.cKey;
        if(layEvent=="stopUse"){//停用
            var confirmindex = layer.confirm('确认停用 '+ ckey+' ？', { btn: ['确认', '取消'] }, function() {
                var obj={};
                obj.id=id;
                obj.status=false;
                sysconfig_stopOrOpen(obj);
            })
        }else if(layEvent=="openUse"){//启用
            var obj={};
            obj.id=id;
            obj.status=true;
            sysconfig_stopOrOpen(obj);
        }
    });
    /*开启或则停用*/
    function sysconfig_stopOrOpen(obj){
        loading.show()
        $.ajax({
            url: ctx + "/sys/editConfig.html",
            type: 'post',
            dataType: "json",
            data: obj,
            success: function(res) {
                loading.hide();
                if (res.code == '0000') {
                    layer.msg('操作成功',{icon:1});
                    sysconfig_count_fun();
                } else {
                    layer.msg(res.msg,{icon:2})
                }
            },
            error: function () {
                loading.hide()
            }
        })
    }

    /**获取入库明细页面查询参数**/
    function sysconfig_getSeacrhData() {
        var data = serializeObject($('#sysconfig_search_form'));
        return data;
    }
});
