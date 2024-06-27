layui.use(['admin', 'form', 'table'], function() {
    var $ = layui.$,
        element = layui.element,
        admin = layui.admin, 
        layer = layui.layer,
        table = layui.table,
        form = layui.form;
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#pi_table",
        method:'post',
        url: ctx + "/prodcate/getCateCustomPage.html",
        cols: [[
            { field: "id", title: "id" },
            { field: "cateCnName", title: "叶子类目(中文)" },
            { field: "cateEnName", title: "叶子类目(EN)" },
            { field: "allrootCateId", title: "普源映射类目",templet:'#pi_allRootCateTpl' },
            {title: '操作', width: 300, align: 'center', toolbar: '#pi_Bar'}
        ]],
        page:true,
        id:"pi_table",
        limits:[10,20,50],
        limit:10,
        done:function(res, curr, count){
        	//当前分页展示的数据
        	tableData = res.data;
        	console.log(res);
             //得到当前页码
             console.log(curr);
             //得到数据总量
             console.log(count);
        }
    });


    var active = {
        reload: function () {
            var customsCnName = '';
            var customsEnName = '';
            var searchType = $("#cateCusSearchForm select[name='searchType'] option:selected").val();
            if (searchType == 0){
                customsCnName = $("#cateCusSearchForm input[name='searchContent']").val();
            }else{
                customsEnName = $("#cateCusSearchForm input[name='searchContent']").val();
            }
            //执行重载
            table.reload('pi_table', {
                page: {curr: 1},
                where: {
                    pCateIds: $("#pi_cateCusSearchForm input[name='pCateIds']").val(),
                    /*finishStatus: $("#cateCusSearchForm select[name='finishStatus'] option:selected").val(),
                    customsCnName: customsCnName,
                    customsEnName:customsEnName,*/
                }
            });
        }
    };
    $("#pi_cateCusSearchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    $("#pi_cateCusResetBtn").click(function () {
        $('#pi_customsContent').html('');
        $("#pi_cateCusSearchForm")[0].reset();
        $("#pi_cateCusSearchForm input[name='pCateIds']").val('');
    });


    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(pi_table)', function (obj) {
        var data = obj.data, //获得当前行数据
        layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var id = data.id;
            /*var customsCnName = $(obj.tr[0]).find('td').eq(3).find('input').val();
            var customsEnName = $(obj.tr[0]).find('td').eq(4).find('input').val();
            var customsValue = $(obj.tr[0]).find('td').eq(5).find('input').val();*/
            var allrootCateId = $(obj.tr[0]).find('td').eq(6).find('input').val();
            $.ajax({
                type: "POST",
                url: ctx + "/prodcate/saveCustomMsg.html",
                data: {"id": id,"allrootCateId":allrootCateId},
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("保存成功");
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


    //选择商品类目
    $('#pi_selectGoodsItems').click(function(){
        admin.itemCat_select('layer-commodity-catalog-productitem','LAY-commodity-catalog-productitem-hidden','pi_customsContent');
    });  
    
    //批量修改报关消息
    $('#pi_batchUpadateCus').click(function(){
    	var arr = [];
    	//获取表格行对象
    	var trObj =  $('#pi_table').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
    		var obj = new Object();
    		 obj.id = trObj.eq(i).find('td').eq(0).find('div').text();
    		 obj.allrootCateId = trObj.eq(i).find('td').eq(3).find('input').val();
    		 arr[i] = obj;
    	}
    	console.log(JSON.stringify(arr));
    	$.ajax({
            type: "POST",
            url: ctx + "/prodcate/saveBatchCustomMsg.html",
            data: {'cusArr':JSON.stringify(arr)},
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.msg("保存成功");
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    	
    });
});