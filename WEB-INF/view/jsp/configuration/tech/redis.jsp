<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>缓存管理</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form  class="layui-form" id="rm_searchForm" style="display: flex;justify-content: space-between;">
                             <div style="padding: 5px;">Key:</div>
                             <input type="text"class="layui-input" placeholder="支持redis通配符：*, ? ,[]">
                            <button id="rm_searchBtn" type="button" class="layui-btn ml20 layui-btn-sm keyHandle" lay-submit="" data-type="reload">搜索</button>
                        </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="rm_table" lay-filter="rm_table"></table>
                    <!-- 工具条模板,写在script里面，使用laytpl -->
                    <script type="text/html" id="rm_barRedisManage">
                        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>

<!--不同类型的弹出层-->
<script type="text/html" id="rm_hashLayer">
<div class="p20">
    <table class="layui-table">
    		<input name="key" type="hidden">
        <thead>
        <tr>
            <th>field</th>
            <th>value</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
</div>
</script>
<script type="text/html" id="rm_stringLayer">
  <div class="p20">
      <input name="key" type="hidden">
      <input name="value" type="text" class="layui-input">
  </div>
</script>
<script>
	console.log("rm");
    layui.use(['admin', 'form', 'table','layer'], function() {
        var $ = layui.$,
            admin = layui.admin,
            layer = layui.layer,
            table = layui.table,
            form = layui.form;
        form.render(null, 'component-form-element');
        form.render(null, 'component-form-group');
        //表格渲染结果
        //展示已知数据
        table.render({
            elem: "#rm_table",
            url: ctx + '/redis/searchkey.html', // 数据接口
            page:false,
            cols: [
                [
                    {
                        type: "numbers",
                        title:"序号"
                    }, {
                        field: "key",
                        title: "Key"
                    },{
                        field: "type",
                        title: "类型",
                        width: 120
                    },{
                    title: "操作",
                    width:114,
                    toolbar: '#rm_barRedisManage'
                }
                ],
            ],
        });
        //监听表格工具条事件
        table.on('tool(rm_table)',function(obj){
            var data = obj.data, //获得当前行数据
                getTpl = $("#detailM").html(), //获取模板引擎的内容
                layEvent = obj.event; //获得 lay-event 对应的值
            //删除key
            if (layEvent === 'del') {
                layer.confirm('确定删除key吗？', function(index) {
	                	if (data.key == undefined || data.key == "") {
						layer.alert("key不正确",{icon:2});
						return;
					}
	                	$.ajax({
						type: "post",
						url: ctx + "/redis/delredis.html",
						dataType: "json",
						data: { key: data.key },
						success: function (returnData) {
							if (returnData.code != "0000") {
								layer.alert(returnData.msg,{icon:2});
								return;
							}
							layer.alert("删除成功",{icon:1});
							 obj.del(); //删除对应行（tr）的DOM结构
						}
					});
                    layer.close(index);
                });
            //编辑key
            } else if (layEvent === 'edit') {
            		//hash
                if(data.type == "hash"){
                    layer.open({
                        type: 1,
                        content: $('#rm_hashLayer').html(),
                        shadowClose: true,
                        area: ['600px','400px'],
                        btn: ['确定','取消'],
                        success: function(layero, index){
                        		$(layero).find('tbody').empty();
							$.ajax({
								type:"post",
								url: ctx + "/redis/gethredis.html",
								async:true,
								data:{key : data.key},
								dataType:"json",
								success:function(returnData){
									if(returnData.code != "0000"){
			         					layer.alert(returnData.msg,{icon:2});
			         					return;
			         				}
									$(layero).find('input[name=key]').val(data.key);
									for(var i=0; i<returnData.data.length; i++){
										var tpl = `<tr>
                          <td>:field</td>
                          <td><textarea name="value" class="layui-textarea">:value</textarea></td>
                          <td><a id="rm_removeFieldBtn" class="layui-btn layui-btn-danger layui-btn-xs">X</a></td>
                        </tr>`;
										tpl = tpl.replace(":field", returnData.data[i].field);
										tpl = tpl.replace(":value", returnData.data[i].value);
										$(layero).find('tbody').append(tpl);
									}
								}
							});
                        },
                        yes:function(index, layero){
                        		var key = $(layero).find("input[name=key]").val();
                        		if(key == undefined && key == ""){
                        			layer.alert("key不正确",{icon:2});
	         					return;
                        		}
                        		var hRedisList = [];
                        		$(layero).find("table tbody>tr").each(function(){
                        			var field = $(this).find("td:first").text();
                        			var value = $(this).find("textarea[name=value]").val();
                        			if(field != undefined && value != undefined){
                        				var hRedis = {};
                        				hRedis.key = key;
                        				hRedis.field = field;
                        				hRedis.value = value;
                        				hRedisList.push(hRedis);
                        			}
                        		});
                        		if(hRedisList.length<1){
                        			layer.alert("至少保存1列field",{icon:2});
	         					return;
                        		}
                        		$.ajax({
                        			type:"post",
                        			url: ctx + "/redis/savehredis.html",
                        			dataType:"json",
                        			contentType:"application/json",
                        			data:JSON.stringify(hRedisList),
                        			success:function(returnData){
                        				if(returnData.code != "0000"){
			         					layer.alert(returnData.msg,{icon:2});
			         					return;
			         				}
                        				layer.msg("修改成功");
                        				layer.close(index);
                        			}
                        		});
                        }
                    })
                //string
                }else if(data.type == "string") {
                    layer.open({
                        type: 1,
                        content: $('#rm_stringLayer').html(),
                        shadowClose: true,
                        area: ['600px','250px'],
                        btn: ['确定','取消'],
                        success: function(layero, index){
                        		$.ajax({
								type: "post",
								url: ctx + "/redis/getredis.html",
								dataType: "json",
								data: { key: data.key },
								success: function (returnData) {
									if (returnData.code != "0000") {
										layer.alert(returnData.msg,{icon:2});
										return;
									}
									var value = returnData.data;
									$(layero).find("input[name=key]").val(data.key);
									$(layero).find("input[name=value]").val(value);
								}
							});
                        },
                        yes:function(index, layero){
                        		var key = $(layero).find("input[name=key]").val();
							var value = $(layero).find("input[name=value]").val();
							if (key == undefined || key == "" || value == undefined || value == "") {
								layer.alert("参数错误",{icon:2});
								return;
							}
							$.ajax({
								type: "post",
								url: ctx + "/redis/saveredis.html",
								async: true,
								dataType:"json",
								data: {
									key: key,
									value: value
								},
								success: function (returnData) {
									if (returnData.code != "0000") {
										layer.alert("参数错误",{icon:2});
										return;
									}
									layer.msg("修改成功");
									layer.close(index);
								}
							});
                        }
                    })
                }

            }
        });
        //搜索事件
        $("#rm_searchBtn").on("click", function(){
        		var key = $("#rm_searchForm input").val();
        		if(key != undefined && key != ""){
        			//执行重载
				table.reload('rm_table', {
				   where: {key:key}
				});
        		}
        });

        $("html").on("click", "#rm_removeFieldBtn",  function(){
        		var key = $(this).parents("table").find("input[name=key]").val();
        		var field = $(this).parents("tr").find("td:first").text();
        		var trObj = $(this).parents("tr");
        		if(key == undefined || key == "" || field == undefined || field == ""){
        			layer.alert("参数错误",{icon:2});
        			return;
        		}
        		layer.confirm('确定删除field吗？', function(index) {
                $.ajax({
					type: "post",
					url: ctx + "/redis/removefield.html",
					dataType:"json",
					data: {
						key: key,
						field: field
					},
					success: function (returnData) {
						if (returnData.code != "0000") {
							layer.alert(returnData.msg, {icon:2});
							return;
						}
						layer.msg("移除成功");
						trObj.remove();
						 layer.close(index);
					}
				});
            });
        });

    });
</script>