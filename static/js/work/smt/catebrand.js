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
        elem: "#catebrandTable",
        method: 'post',
        url: ctx + "/prodcate/smtActCatePage.html",
        cols: [
            [
                { field: "id", title: "id" },
                { field: "cateCnName", title: "叶子类目(中文)" },
                { field: "cateEnName", title: "叶子类目(EN)" },
                { field: "brand", title: "品牌", templet: '#cb_brandTpl' },
                { title: '操作', width: 60, align: 'center', toolbar: '#cateBrandBar' }
            ]
        ],
        page: true,
        id: "catebrandTable",
        limits: [100, 500, 1000],
        limit: 100,
        done: function(res, curr, count) {
            //获取到品牌所在列的dom元素并按要求赋值
            var $th = $('th[data-field="brand"]').find('.layui-table-cell'),
                // $str1 = $('<span>品牌<i class="layui-icon layui-icon-yemian1" style="cursor:pointer;color:red" title="点击一键应用"></i><span>'),
                $str1 = $('<span>品牌<img src="'+ctx+'/static/img/edit.png" class="brandImg" title="点击一键应用"></span>')
                $str2 = $('<input type="text" class="layui-input brandInput"><span class="brandPostion1">√</span><span class="brandPostion2">×</span>');
            $th.html($str1);
            $th.on('click', '.brandImg', function() {
                $th.html($str2)
            });
            $th.on('click', '.brandPostion2', function() {
                $(this).prev().prev().val('');
                $th.html($str1);
            });
            $th.on('click', '.brandPostion1', function() {
                var v = $(this).prev().val(),
                    inputs = $('td[data-field="brand"]').find('.layui-table-cell>input');
                for (var i = 0; i < inputs.length; i++) {
                    inputs.eq(i).val(v);
                }
                $(this).prev().val('');
                $th.html($str1);
            })
        }
    });


    var active = {
        reload: function() {
            //执行重载
            table.reload('catebrandTable', {
                page: { curr: 1 },
                where: {
                    pCateId: $("#cb_SearchForm input[name='pCateId']").val(),
                    finishStatus: $("#cb_SearchForm select[name='finishStatus'] option:selected").val(),
                    brand: $("#cb_SearchForm input[name='brand']").val(),
                }
            });
        }
    };
    $("#cb_searchBtn").click(function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //批量保存按钮
    $("#cb_batchSave").click(function() {
        var brands = []
        //$('#catebrandTable').find('tr').each(function() {
        $('#catebrandTable').next().find('.layui-table-body tbody').find('tr').each(function() {
            var tdArr = $(this).children()
            var brand = {}
            brand.id = tdArr.eq(0).text(); // id
            brand.brand = tdArr.eq(3).find('input').val(); // 品牌
            brands.push(brand);
        })
        $.ajax({
            type: "POST",
            url: ctx + "/prodcate/batchSaveBrd.html",
            data: JSON.stringify(brands),
            async: false,
            contentType : 'application/json;charset=utf-8',
            success: function(returnData) {
                var returnObj = returnData
                //console.log(returnData.msg)
                layer.msg(returnObj.msg)
            },
            error: function() {
                layer.msg("服务器正忙");
            }
        });
    });

    $("#cb_reset").click(function() {
        $('#cb_cateCheckd').html('');
        $("#cb_SearchForm")[0].reset();
        $("#cb_SearchForm input[name='pCateId']").val('');
    });


    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(catebrandTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var id = data.id;
            var brand = $(obj.tr[0]).find('td').eq(3).find('input').val();
            /*if (brand.trim() == '') {
                layer.msg("请填写品牌");
                return;
            }*/
            $.ajax({
                type: "POST",
                url: ctx + "/prodcate/saveBrand.html",
                data: { "id": id, "brand": brand },
                async: false,
                dataType: "json",
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("保存成功");
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    layer.msg("服务器正忙");
                }
            });
        }
    });


    //选择商品类目
    $('#cb_cateSelect').click(function() {
        admin.itemCat_select('layer-commodity-catalog-customs', 'LAY-commodity-catalog-customs-hidden', 'cb_cateCheckd');
    });

    //批量修改报关消息
    $('#batchUpadateCus').click(function() {
        var arr = [];
        //获取表格行对象
        var trObj = $('#catebrandTable').next().find('.layui-table-body tbody').find('tr');
        for (var i = 0; i < trObj.length; i++) {
            var obj = new Object();
            obj.id = trObj.eq(i).find('td').eq(0).find('div').text();
            obj.customsCnName = trObj.eq(i).find('td').eq(3).find('input').val();
            obj.customsEnName = trObj.eq(i).find('td').eq(4).find('input').val();
            obj.customsValue = trObj.eq(i).find('td').eq(5).find('input').val();
            arr[i] = obj;
        }
        console.log(JSON.stringify(arr));
        $.ajax({
            type: "POST",
            url: ctx + "/prodcate/saveBatchCustomMsg.html",
            data: { 'cusArr': JSON.stringify(arr) },
            async: false,
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    layer.msg("保存成功");
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("服务器正忙");
            }
        });

    });
});