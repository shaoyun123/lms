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
        elem: "#customsTable",
        method:'post',
        url: ctx + "/prodcate/getCateCustomPage.html",
        cols: [[
            { field: "id", title: "id" },
            { field: "cateCnName", title: "叶子类目(中文)" },
            { field: "cateEnName", title: "叶子类目(EN)" },
            { field: "customsCnName", title: "报关中文名",templet:'#customCnNameTpl'},
            { field: "customsEnName", title: "报关英文名",templet:'#customEnNameTpl' },
            { field: "customsValue", title: "价值(USD)",templet:'#customValueTpl' },
            {title: '操作', width: 300, align: 'center', toolbar: '#customsBar'}
        ]],
        page:true,
        id:"customsTable",
        limits:[100,500,1000],
        limit:100,
        done:function(res, curr, count){
        	//当前分页展示的数据
            tableData = res.data;
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
            table.reload('customsTable', {
                page: {curr: 1},
                where: {
                    pCateIds: $("#cateCusSearchForm input[name='pCateIds']").val(),
                    finishStatus: $("#cateCusSearchForm select[name='finishStatus'] option:selected").val(),
                    customsCnName: customsCnName,
                    customsEnName:customsEnName,
                }
            });
        }
    };
    $("#cateCusSearchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    $("#cateCusResetBtn").click(function () {
        $('#proCustoms_category_delImg').html('');
        $("#cateCusSearchForm")[0].reset();
        $("#cateCusSearchForm input[name='pCateIds']").val('');
    });


    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(customsTable)', function (obj) {
        let data = obj.data, //获得当前行数据
        layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            layer.confirm('确定修改报关信息吗？', {
                btn: ['提交','取消'], //按钮
                shade: false //不显示遮罩
            }, function(index){
                let list = []
                list.push({
                    id: data.id,
                    cateCnName: $(obj.tr[0]).find('td').eq(1).find('div').text(),
                    customsCnName: $(obj.tr[0]).find('td').eq(3).find('input').val(),
                    customsEnName: $(obj.tr[0]).find('td').eq(4).find('input').val(),
                    customsValue: $(obj.tr[0]).find('td').eq(5).find('input').val(),
                })
                loading.show()
                oneAjax.post({
                    url: '/prodcate/saveBatchCustomMsg.html',
                    data: list,
                    success: function (returnData) {
                        loading.hide()
                        layer.closeAll();
                        if (returnData.code === "0000") {
                            layer.alert("保存成功");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    }
                })
            });
        } else if (layEvent === 'copy') {
            $(obj.tr[0]).find('td').eq(3).find('input').val(data.cateCnName);
            $(obj.tr[0]).find('td').eq(4).find('input').val(data.cateEnName);
        }
    });


    //选择商品类目
    $('#selectGoodsItems').click(function(){
        admin.itemCat_select('layer-commodity-catalog-customs','LAY-commodity-catalog-customs-hidden','proCustoms_category_delImg');
    });  
    
    //批量修改报关消息
    $('#batchUpadateCus').click(function(){
        layer.confirm('更改报关信息将同步修改普源系统的商品报关信息,继续修改？', {
            btn: ['提交','取消'], //按钮
            shade: false //不显示遮罩
        }, function(index){
            layer.confirm('确定修改报关信息吗？', {
                btn: ['提交','取消'], //按钮
                shade: false //不显示遮罩
            }, function(index){
                let arr = [];
                //获取表格行对象
                let trObj =  $('#customsTable').next().find('.layui-table-body tbody').find('tr');
                for(let i=0;i<trObj.length;i++){
                    let obj = {};
                    obj.id = trObj.eq(i).find('td').eq(0).find('div').text();
                    obj.cateCnName = trObj.eq(i).find('td').eq(1).find('div').text();
                    obj.customsCnName = trObj.eq(i).find('td').eq(3).find('input').val();
                    obj.customsEnName = trObj.eq(i).find('td').eq(4).find('input').val();
                    obj.customsValue = trObj.eq(i).find('td').eq(5).find('input').val();
                    arr.push(obj)
                }
                oneAjax.post({
                    url: "/prodcate/saveBatchCustomMsg.html",
                    data: arr,
                    success: function (returnData) {
                        layer.closeAll();
                        if (returnData.code === "0000") {
                            layer.msg("保存成功");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    }
                })
            });
        });

    });
});