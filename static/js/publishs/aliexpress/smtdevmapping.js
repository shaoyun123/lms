/**
 * time: 2018/02/07
 */
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate"], function () {
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
  render_hp_orgs_users("#sdm_searchForm");

    var smtUsers = [];
    var developUsers = [];
    $(function(){
    	//初始化人员
    	$.ajax({
    		type:"post",
    		url: ctx + "/sys/listuserbyrole.html",
    		dataType: "json",
    		data: {role:"smt专员"},
    		success:function(returnData){
    			if(returnData.code == "0000"){
    			  //搜索框修改为由部门 人员组件渲染
    				// var str = "<option value=''></option>";
    				// for(var i=0; i<returnData.data.length; i++){
    				// 	str += "<option value='"+returnData.data[i].id+"'>"+returnData.data[i].loginName+"</option>";
    				// }
    				// $("#sdm_searchForm select[name=smtUserId]").html(str);
    				smtUsers = returnData.data;
    				//form.render("select");
    			}
    		}
    	});
    	$.ajax({
    		type:"post",
    		url: ctx + "/sys/listuserbyrole.html",
    		dataType: "json",
    		data: {role:"开发专员"},
    		success:function(returnData){
    			if(returnData.code == "0000"){
    				var str = "<option value=''></option>";
    				for(var i=0; i<returnData.data.length; i++){
    					str += "<option value='"+returnData.data[i].id+"'>"+returnData.data[i].loginName+"</option>";
    				}
    				$("#sdm_searchForm select[name=developUserId]").html(str);
    				developUsers = returnData.data;
    				form.render("select");
    			}
    		}
    	});
    });

    //按钮的点击事件
    $("#addDevMapping").click(function () {
        var index = layer.open({
            type: 1,
            title: "新增人员映射",
            id:'newMapSuccess',
            area: ["800px", "450px"],
            shadeClose: false,
            btn: ['保存','关闭'],
            content: $("#sdm_addMappingLayer").html(),
            success:function () {
            	initUser();
                form.render('select');
            },
            yes: function () {
                $("#sdm_submitMapping").click();
            },
            end: function () {
                $("#sdm_addMappingForm").trigger('reset');
                $("#sdm_addMappingForm input[name='id']").val("");
            }
        });
    });
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#sdm_devMappingTable",
        method: "post",
        url: ctx + '/aliexpresslisting/listmapping.html',
        cols: [
            [
                {field: "smtUser", title: "速卖通专员"},
                {field: "developUser", title: "开发专员"},
                {field: "standard", title: "覆盖达标数(销售)"},
                //绑定工具条
                {title: '操作',align: 'center', toolbar: '#sdm_editBar'}
            ],
        ],
        id: 'sdm_devMappingTable',
        page: true,
        limits: [50, 100, 1000],
        limit: 50,
        done: function (res, curr, count) {
            admin.load.hide();
        }
    });

    // 搜索提交
    $('#sdm_searchBtn').click(function () {
        // 执行重载
        admin.load.show();
        table.reload('sdm_devMappingTable', {
            page: {
                curr: 1 // 重新从第 1 页开始
            },
            where: serializeObject($('#sdm_searchForm'))
        })
    })

    table.on('tool(sdm_devMappingTable)', function (obj) {
        var layEvent = obj.event; // 获得 lay-event 对应的值
        var data = obj.data; // 获得当前行数据
        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: "编辑速卖通-开发人员映射",
                area: ["800px", "450px"],
                shadeClose: false,
                btn: ['保存','关闭'],
                content: $("#sdm_addMappingLayer").html(),
                success:function () {
                    initUser();
                    $("#sdm_addMappingForm input[name=id]").val(obj.data.id);
                    $("#sdm_addMappingForm select[name=smtUserId]").val(obj.data.smtUserId);
                    $("#sdm_addMappingForm input[name=standard]").val(obj.data.standard);
                    $("#sdm_addMappingForm select[name=smtUserId]").prop("disabled", true);
                    $("#sdm_addMappingForm select[name=developUserId]").val(obj.data.developUserId);
                    form.render('select');
                },
                yes: function () {
                    $("#sdm_submitMapping").click();
                },
                end: function () {
                    $("#sdm_addMappingForm").trigger('reset');
                    $("#sdm_addMappingForm input[name='id']").val("");
                }
            });
        } else if (layEvent === 'del') {
            delDevMapping(data.id);
        }
    })

    form.on('submit(sdm_submitMapping)', function (data) {
        $.ajax({
            type: "post",
            url: ctx + "/aliexpresslisting/updatemapping.html",
            dataType: "json",
            data: data.field,
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    $('#sdm_searchBtn').trigger('click');
                    layer.msg("操作成功");
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("发送请求失败");
            }
        })
        return false;
    });

    //初始化人员信息
    function initUser() {
        var str = "<option value=''></option>";
		for(var i=0; i<smtUsers.length; i++){
			str += "<option value='"+smtUsers[i].id+"'>"+smtUsers[i].loginName+"</option>";
		}
		$("#sdm_addMappingForm select[name=smtUserId]").html(str);
		str = "<option value=''></option>";
		for(var i=0; i<developUsers.length; i++){
			str += "<option value='"+developUsers[i].id+"'>"+developUsers[i].loginName+"</option>";
		}
		$("#sdm_addMappingForm select[name=developUserId]").html(str);
    }

    //删除包装规格
    function delDevMapping(id) {
        if (typeof (id) == "undefined") {
            layer.msg('参数错误');
            return;
        }
        layer.confirm('是否删除此映射？', function (result) {
            if (result) {
                $.ajax({
                    url: ctx + '/aliexpresslisting/deletemapping.html',
                    data: {"id": id},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            layer.msg('操作成功');
                            $('#sdm_searchBtn').trigger('click');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }
});




console.log(1);
