layui.use(['admin', 'form', 'table','laydate','upload'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        upload = layui.upload,
        form = layui.form;
         laytpl = layui.laytpl;
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    //加载需求人
    $(function(){
        $.ajax({
        	type:"post",
        	url: ctx + "/msgselfportrait/listcreator.html",
        	dataType:"json",
        	success:function(returnData){
                if(returnData.code != "0000"){
                    layer.msg(returnData.msg);
                    return;
                }
                var str = "<option value=''>全部</option>";
                if(returnData.data){
                    for(var i=0; i<returnData.data.length; i++){
                        str += "<option value='"+returnData.data[i].creatorId+"'>"+returnData.data[i].creator+"</option>";
                    }
                }
                $("#sf_searchForm select[name=creatorId]").empty().html(str);
                form.render();
            }
        });
    });
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#selfieTable",
        id: "sf_selfieTable",
        url: ctx +'/msgselfportrait/list.html', // 数据接口
        where:getSearchData(),
        page: true,
        limits: [100, 500, 1000], // 每页条数的选择项
        limit: 100, //默认显示20条
        cols: [
            [
                //标题栏
                {
                    type: "checkbox",
                    width: 32
                }, {
                    field: "pSku",
                    title: "父SKU"
                }, {
                    field: "creator",
                    title: "需求人"
                }, {
                    field: "remark",
                    title: "需求备注"
                }, {
                    field: "selfType",
                    title: "拍图类型",
                     templet:"#sf_selfTypeTpl"
                },{
                    field: "photographer",
                    title: "摄影"
                },{
                    field: "isPhotographyComplete",
                    title: "摄影状态",
                    templet:"#sf_isPhotographyCompleteTpl"
                },{
                    field: "artDesigner",
                    title: "美工"
                },{
                    field: "isArtDesignerComplete",
                    title: "美工状态",
                    templet:"#sf_isArtDesignerCompleteTpl"
                },{
                    field: "time",
                    title: "时间",
                    templet:"#sf_timeTpl"
                }
            ],
        ],
        done:function(res, curr,count){
                $("#sf_count").html(count);
                //表头固定处理
            theadHandle().fixTh({ id:'#selfieCard',h:84 })
        }
    });
    
    function getSearchData(){
		var data = {};
		data.selfType = $("#sf_searchForm select[name=selfType]").val();
		data.isPhotographyComplete = $("#sf_searchForm select[name=isPhotographyComplete]").val();
		data.isArtDesignerComplete = $("#sf_searchForm select[name=isArtDesignerComplete]").val();
		data.creatorId = $("#sf_searchForm select[name=creatorId]").val();
         data.pSku = $("#sf_searchForm input[name=pSku]").val();
        return data;
    }
    $("#sf_searchBtn").on("click", function(){
    		//执行重载
		table.reload('sf_selfieTable', {
			page: {
				curr: 1 //重新从第 1 页开始
		   },
		   where: getSearchData()
		});
    });
   //摄影完成
   $('#sf_cameraComplete').click(function(){
        layer.open({
           title:'标记已完成自拍图的主SKU',
           type: 1,//不加该属性,就会出现[object Object]
           area:['600px', '400px'],
           shadeClose: false,
           btn:['提交','关闭'],
           content:$('#sf_cameraCompleteLayer').html(),
           success:function(layero, index){
           	form.render('');
           },
           yes:function(index, layero){
           	var param = {};
           	param.photographerId = $(layero).find("select[name=photographerId]").val();
           	param.photographer = $(layero).find("select[name=photographerId] option:selected").text();
     		param.pSku = $(layero).find("textarea[name=pSku]").val();
     		$.ajax({
         			type:"post",
         			url: ctx + "/msgselfportrait/photographycomplete.html",
         			dataType:"json",
         			data:param,
         			success:function(returnData){
         				if(returnData.code != "0000"){
         					layer.alert(returnData.msg,{icon:2});
         					return;
         				}
         				layer.alert(returnData.data, function(){
                  //刷新页面
                  table.reload('sf_selfieTable', { where: getSearchData()});
                });
         			}
         		});
           }
       })
    });
   //美工完成
    $('#sf_artComplete').click(function(){
        layer.open({
           title:'标记已完成自拍图的主SKU',
           type: 1,//不加该属性,就会出现[object Object]
           area:['600px', '400px'],
           shadeClose: false,
           btn:['提交','关闭'],
           content:$('#sf_artCompleteLayer').html(),
           success:function(layero, index){
           	form.render('');
           },
           yes:function(index, layero){
           	var param = {};
           	param.artDesignerId = $(layero).find("select[name=artDesignerId]").val();
           	param.artDesigner = $(layero).find("select[name=artDesignerId] option:selected").text();
     		param.pSku = $(layero).find("textarea[name=pSku]").val();
     		$.ajax({
         			type:"post",
         			url: ctx + "/msgselfportrait/artdesigncomplete.html",
         			dataType:"json",
         			data:param,
         			success:function(returnData){
         				if(returnData.code != "0000"){
         					layer.alert(returnData.msg,{icon:2});
         					return;
         				}
         				layer.alert(returnData.data, function(){
                  //刷新页面
                  table.reload('sf_selfieTable', { where: getSearchData()});
                });
         			}
         		});
           }
       })
    });
    //新增拍图需求
    $('#sf_rePictureMark').click(function(){
        layer.open({
           title:'新增拍图需求',
           type: 1,//不加该属性,就会出现[object Object]
           area:['600px', '500px'],
           shadeClose: false,
           btn:['提交','关闭'],
           content:$('#sf_rePictureMarkLayer').html(),
           success:function(layero, index){
           	form.render('');
           },
           yes:function(index, layero){
           		var param = {};
         		param.pSku = $(layero).find("textarea[name=pSku]").val();
         		param.selfType = $(layero).find("input[name=selfType]:checked").val();
         		param.remark = $(layero).find("textarea[name=remark]").val();
         		$.ajax({
         			type:"post",
         			url: ctx + "/msgselfportrait/create.html",
         			dataType:"json",
         			data:param,
         			success:function(returnData){
         				if(returnData.code != "0000"){
         					layer.alert(returnData.msg,{icon:2});
         					return;
         				}
         				layer.close(index);
         				//刷新页面
						    table.reload('sf_selfieTable', { where: getSearchData()});
         			}
         		});
           }
       });
    });
    //摄影收货
   $('#sf_goodsArrival').click(function(){
        layer.open({
           title:'摄影收货',
           type: 1,//不加该属性,就会出现[object Object]
           area:['600px', '400px'],
           shadeClose: false,
           btn:['提交','关闭'],
           content:$('#sf_goodsArrivalLayer').html(),
           success:function(layero, index){
            form.render();
           },
           yes:function(index, layero){
            var pSku = $(layero).find("textarea[name=pSku]").val();
            $.ajax({
              type:"post",
              url: ctx + "/msgselfportrait/goodsarrival.html",
              dataType:"json",
              data:{
                pSku:pSku
              },
              success:function(returnData){
                if(returnData.code != "0000"){
                  layer.alert(returnData.msg,{icon:2});
                  return;
                }
                layer.alert(returnData.data, function(){
                  //刷新页面
                  table.reload('sf_selfieTable', { where: getSearchData()});
                });
              }
            });
           }
       })
    });
    
    //删除需求
    $('#sf_delete').click(function(){
        var checkStatus = table.checkStatus('sf_selfieTable');
        if(checkStatus.data.length<1){
            layer.msg("未选中拍图需求");
            return;
        }
        var ids = [];
        for(var i=0; i<checkStatus.data.length; i++){
            ids.push(checkStatus.data[i].id);
        }
        layer.confirm('删除拍图需求', {icon:3},function(index){
            $.ajax({
                type: "post",
                url: ctx + "/msgselfportrait/delete.html",
                dataType: "json",
                data: { ids: ids.join(",") },
                success: function(returnData) {
                     if (returnData.code == "0000") {
                         layer.msg("删除成功");
                         table.reload('sf_selfieTable', { where: getSearchData()});
                     } else {
                         layer.msg(returnData.msg);
                     }
                }
            })
        });
    });
});

function format(datetime, fmt) {
    if (datetime) {
        datetime = datetime.toString();
        if (parseInt(datetime) == datetime) {
            if (datetime.length == 10) {
                datetime = parseInt(datetime) * 1000;
            } else if (datetime.length == 13) {
                datetime = parseInt(datetime);
            }
        }
        datetime = new Date(datetime);
        var o = {
            "M+": datetime.getMonth() + 1,                 //月份
            "d+": datetime.getDate(),                    //日
            "h+": datetime.getHours(),                   //小时
            "m+": datetime.getMinutes(),                 //分
            "s+": datetime.getSeconds(),                 //秒
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
            "S": datetime.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    } else {
        return "";
    }
}