/**
 * time: 2018/01/03
 */
//标题栏
layui.use(["layer", "table", "form","jquery","laytpl"], function() {

    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laytpl=layui.laytpl,
        $ = layui.$;
    //加载表格分页

    table.render({
        elem: "#planeDictTable",
        method:'post',
        url: ctx + "/sysdict/getflatdicts.html",
        cols: [[
            { type: "checkbox" },
            { field: "headCode", title: "头代码" },
            { field: "dKey", title: "键(key)" },
            { field: "dValue", title: "值" },
            { field: "extend1", title: "扩展1" },
            { field: "extend2", title: "扩展2" },
            { field: "sort", title: "排序"},
            {title: '操作', width: 300, align: 'center', toolbar: '#planeDictTableBar'}
        ]],
        page:true,
        id:"planeDictTable",
        limits:[50,100,200],
        limit:100,
    });

    layui.laytpl.transTrueFalse = function(d){
        if(d){
            return '是';
        }
        return '否';
    };

    $("#planeDict_searchBtn").on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    var active = {
        //搜索
        reload: function(){
            var headCode = $.trim($("#planeDict_searchForm select[name='headCode'] option:selected").val());
            table.reload('planeDictTable', {
                page: {curr: 1},
                where: {
                    headCode:headCode,
                }
            });
        }
    };
    listAllHeads();

    function listAllHeads() {
        $("#addPlanedictForm #dictHeadSel").prop("length", 1);
        $("#dict_editPlaneForm #editDictHeadSel").prop("length", 1);
        $("#searchForm #searchSel").prop("length", 1);
        $.ajax({
            type:"post",
            url:ctx+"/sysdict/getAllDictHeads.html",
            dataType:"json",
            success:function (returnData) {
                if (returnData.code == "0000"){
                    $(returnData.data).each(function () {
                        $("#planeDict_searchForm #searchSel").append("<option value='" + this.code + "'>" + this.name + "</option>");
                    });
                } else {
                    layer.msg(returnData.msg);
                }
                form.render('select');
            }
        })
    }

    //点击按钮弹出编辑字典头信息弹框
    $("#addPlanedictInfo").click(function() {
        var index = layer.open({
            type: 1,
            title: "添加平面字典",
            area: ["800px", "600px"],
            shadeClose: false,
            btn: ['确定','关闭'],
            content: $("#addPlanedictInfoLayer").html(),
            success: function (layero, index) {
                $('#addPlanedictForm [name=headCode]').html($('#planeDict_searchForm [name=headCode]').html())
                form.render('select');
            },
            yes: function () {
                var data = serializeObject($('#addPlanedictForm'))
                ajaxToAddOrEdit(data)
            }
        });
    });
    function ajaxToAddOrEdit(data) {
        console.log(data)
        $.ajax({
            type:"post",
            url:ctx + "/sysdict/saveflatdict.html",
            dataType:"json",
            data:data,
            success:function (returnData) {
                if (returnData.code == "0000"){
                    layer.closeAll();
                    active['reload'].call();
                    if (data.id) {
                        layer.msg("修改成功");
                    } else  {
                        layer.msg("添加成功");
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error:function () {
                layer.msg("发送请求失败");
            }
        })
    }
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(planeDictTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: "编辑平面字典",
                area: ["800px", "600px"],
                btn: ['确定','关闭'],
                shadeClose: false,
                content: $("#addPlanedictInfoLayer").html(),
                success: function (layero, index) {
                    $('#addPlanedictForm [name=headCode]').html($('#planeDict_searchForm [name=headCode]').html())
                    $.ajax({
                        type:"post",
                        url: ctx+'/sysdict/getflatdict.html',
                        data: {"id": data.id},
                        dataType: "json",
                        async:false,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                var obj = returnData.data;
                                $("#addPlanedictForm [name='id']").val(obj.id);
                                $("#addPlanedictForm [name='headCode']") .val(obj.headCode);
                                $("#addPlanedictForm [name='dKey']").val(obj.dKey);
                                $("#addPlanedictForm [name='dValue']").val(obj.dValue);
                                $("#addPlanedictForm [name='extend1']").val(obj.extend1);
                                $("#addPlanedictForm [name='extend2']").val(obj.extend2);
                                $("#addPlanedictForm [name='sort']").val(obj.sort);
                                form.render('select');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
                yes:function () {
                    var data = serializeObject($('#addPlanedictForm'))
                    ajaxToAddOrEdit(data)
                }
            });
        } else if (layEvent === 'del') {
            deleteFlatHead(data.id);
        }
    })


    //删除
    function deleteFlatHead(id) {
        layer.confirm('删除后不可恢复，是否确认删除？', function (result) {
            if (result) {
                $.ajax({
                    type:"post",
                    url: ctx+'/sysdict/deleteflatdict.html',
                    data: {"ids": id},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            active['reload'].call();
                            layer.msg("删除成功");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("发送请求失败");
                    }
                });
            }
        });
    }

});
