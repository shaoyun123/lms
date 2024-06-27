    /**
     * time: 2018/01/03
     */
    //标题栏
    layui.use(["layer", "table", "form","jquery","laytpl"], function() {

    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        $ = layui.$,
        laytpl=layui.laytpl;

    //加载表格分页
    table.render({
        elem: "#datadictheadTable",
        method:'post',
        url: ctx + "/sysdict/getdictheads.html",
        cols: [[
            { type: "checkbox" },
            { field: "code", title: "代码" },
            { field: "name", title: "名称" },
            { field: "isFixed", title: "是否固定",templet: '<div>{{ layui.laytpl.transTrueFalse(d.isFixed) }}</div>'},
            { field: "isFlat", title: "是否为平面字典", templet: '<div>{{ layui.laytpl.transTrueFalse(d.isFlat) }}</div>'},
            {title: '操作', width: 300, align: 'center', toolbar: '#dictHeadTableBar'}
        ]],
        page:true,
        id:"sysOrgTable",
        limits:[10,20,50],
        limit:10,
    });

    layui.laytpl.transTrueFalse = function(d){
        if(d){
            return '是';
        }
        return '否';
    };
      //点击按钮弹出编辑字典头信息弹框
      $("#datadictheadBtn").click(function() {
        var index = layer.open({
          type: 1,
          title: "添加字典头",
          area: ["800px", "600px"],
          shadeClose: false,
          content: $("#datadictheadLayer").html(),
          success: function (layero, index) {
                form.render('select');
                form.render('radio');
                form.render('checkbox');
          },
          end:function () {
              //关闭时清空表格内容
              $("#addDictHeadForm")[0].reset();
          }
        });
      });

         //添加字典头
      form.on('submit(addDictHead)', function(data){
        $.ajax({
            type:"post",
            url:ctx + "/sysdict/savedicthead.html",
            dataType:"json",
            data:data.field,
            success:function (returnData) {
                if (returnData.code == "0000"){
                    layer.closeAll();
                    active['reload'].call();
                    layer.msg("添加字典头成功");
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error:function () {
                layer.msg("发送请求失败");
            }
        })
        return false;
    });

    var active = {
        //搜索
        reload: function(){
            var isFlat = $.trim($("#ddh_searchForm select[name='isFlat']").val());
            var code = $.trim($("#ddh_searchForm input[name='code']").val());
            var name = $.trim($("#ddh_searchForm input[name='name']").val());
            table.reload('sysOrgTable', {
                page: {curr: 1},
                where: {
                    name:name,
                    isFlat:isFlat,
                    code:code
                }
            });
        }
    };

    $("#ddh_searchBtn").on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

        //自定义验证规则
        form.verify({
            unique: function(value){
                var isUnique = true;
                $.ajax({
                    type:"post",
                    url:ctx+"/sysdict/checkHeadUnique.html",
                    data:{"code":value},
                    dataType:"json",
                    async:false,
                    success:function (returnData) {
                        if (returnData.code != "0000"){
                            //此处return不起作用
                            isUnique = false;
                        }
                    }
                })
                if ( !isUnique){
                    return "code已存在";
                }
            }
        });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(datadictheadTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var id = data.id
            var index = layer.open({
                type: 1,
                title: "编辑字典头",
                area: ["800px", "600px"],
                shadeClose: false,
                content: $("#editdictheadLayer").html(),
                success: function (layero, index) {
                    $.ajax({
                        type:"post",
                        url: ctx+'/sysdict/getdicthead.html',
                        data: {"id": id},
                        dataType: "json",
                        async:false,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                var obj = returnData.data;
                                console.log(obj);
                                $("#editDictHeadForm input[name='id']").val(obj.id);
                                $("#editDictHeadForm input[name='appCode']").val(obj.appCode);
                                $("#editDictHeadForm input[name='code']").val(obj.code);
                                $("#editDictHeadForm input[name='name']").val(obj.name);
                                $("#editDictHeadForm input[name='isFixed']").prop("checked",obj.isFixed);
                                $("#editDictHeadForm input[name='isFlat']").prop("checked",obj.isFlat);
                                $("#editDictHeadForm textarea[name='remark']").val(obj.remark);
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                    form.render('select');
                    form.render('radio');
                    form.render('checkbox');
                },
                end:function () {
                    $("#editDictHeadForm")[0].reset();
                    $("#editDictHeadForm input[name='id']").val("");
                }
            });
        } else if (layEvent === 'del') {
            deleteDictHead(data.id,data.code);
        }
    })

    //修改字典头
    form.on('submit(editDictHeadBtn)', function(data){
        $.ajax({
            type:"post",
            url:ctx+"/sysdict/updatedicthead.html",
            dataType:"json",
            data:data.field,
            success:function (returnData) {
                if (returnData.code == "0000"){
                    layer.closeAll();
                    active['reload'].call();
                    layer.msg("修改成功");
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error:function () {
                layer.msg("发送请求失败");
            }
        })
        return false;
    });

    //删除
    function deleteDictHead(id,code) {
        layer.confirm('删除后不可恢复，是否确认删除？', function (result) {
            if (result) {
                $.ajax({
                    type:"post",
                    url: ctx+'/sysdict/deletedicthead.html',
                    data: {"ids": id,"codes":code},
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
