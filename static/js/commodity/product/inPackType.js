/**
 * time: 2018/01/02
 */
var active_inPackType
layui.use([ "layer", "table", "form", "laydate"], function() {
    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        $ = layui.$,
        laydate = layui.laydate;
    // form.render(null, 'component-form-group')
    form.render('select');
    //时间渲染
    laydate.render({
        elem: '#inPackTypeTime',
        range: true
    })

    initHpSelect('#searchForm_inPackType')
    // 表格渲染
    function search_inPackType(data) {
        table.render({
            elem: "#inPackTypeTable",
            method: 'post',
            url: ctx + "/inPackType/queryPage.html",
            where: data,
            cols: [
                [
                    {type: "checkbox", width: 30},
                    {field: "id", templet: "#pl_imageTpl", title: "图片", width: 70},
                    {title: "商品sku", templet: "#sSku_inPackType"},
                    {field: "buyer", title: "采购专员", width: 70},
                    {title: "开发专员", templet: "<div>{{d.parent.bizzOwner}}</div>",width: 70},
                    {field: "inPackType", title: "入库包装类型"},
                    {title: "更新时间", templet: "<div>{{format(d.inPackTypeUpdateTime,'yyyy-MM-dd hh:mm:ss')}}</div>"},
                    { title: '操作', align: 'center', toolbar: '#editBar_inPackType', width: 100 }
                ],
            ],
            id: "inPackTypeTable",
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done: function (res, curr, count) {
                $("#sSkuNum").html(count);
                //懒加载
                imageLazyload();
            }
        });
    }

    active_inPackType = {
        //搜索
        reload: function (data) {
            if (!data) {
                data = getSerachData_inPackType()
            }
            table.reload('inPackTypeTable', {
                page: {curr: 1},
                where: data,
            });
        }
    };

    $("#searchBtn_inPackType").click(function () {
        var data = getSerachData_inPackType()
        search_inPackType(data)
    });

    function getSerachData_inPackType() {
        var searchTime = "";
        if ($.trim($("#inPackTypeTime").val())) {
            searchTime = $("#inPackTypeTime").val();
        }
        var sub = new Object();
        sub.bizzOwner = $("#searchForm_inPackType [name='bizzOwner']").val();
        sub.buyer = $("#searchForm_inPackType [name='buyer']").val();
        sub.searchType = $.trim($("#searchForm_inPackType select[name='searchType']").val());
        sub.searchValue = $.trim($("#searchForm_inPackType input[name='searchValue']").val());
        sub.searchTimeType = $.trim($("#searchForm_inPackType select[name='searchTimeType']").val());
        sub.searchTime = searchTime;
        sub.inPackType = $("#searchForm_inPackType [name='inPackType']").val();
        sub.isSale = $("#searchForm_inPackType [name='isSaleType']").val();
        return sub
    }

    $("#searchReset_inPackType").click(function () {
        $("#searchForm_inPackType")[0].reset();
        $("#searchForm_inPackType input[type='hidden']").val('');
        $("#storagePackType_search_cate").html('');
    });

    // 批量设置
    $('#setListBtn_inPackType').click(function () {
        var checkStatus = table.checkStatus('inPackTypeTable'),
            data = checkStatus.data;
        var skuArr = []
        if (data.length > 0) {
            for (var i = 0; i < data.length; ++i) {
                skuArr.push(data[i].sSku)
            }
        }
        var popIndex = layer.open({
            title: '设置入库包装类型',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '70%'],
            id: 'updateListLayer_inPackType',
            btn: ['保存', '关闭'],
            content: $('#updateListPop_inPackType').html(),
            success: function () {
                initNotNull('#updateListForm_inPackType')
                form.render('select','updateListForm_inPackType')
                console.log(skuArr)
                if (skuArr.length > 0) {
                    var skuStr = skuArr.join('\n');

                    $('#updateListForm_inPackType [name=skuList]').val(skuStr)
                }
            },
            yes: function (index, layero) {
                if (!checkNotNull('#updateListForm_inPackType')) {
                    return false
                }
                var skuList = $('#updateListForm_inPackType [name=skuList]').val().split('\n')
                // 去除前尾的空格
                var validSkuList = []
                for (var i = 0; i < skuList.length; ++i) {
                    if (skuList[i].trim()) {
                        validSkuList.push(skuList[i].trim())
                    }
                }
                var Adata = {
                    inPackType: $('#updateListForm_inPackType [name=inPackType]').val(),
                    skuList: validSkuList
                }
                ajaxToSetInPackTypeOfList(Adata)
            }
        })
    })

    // 导出
    $('#export_inPackType').click(function () {
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的入库包装类型数据？', {btn: ['确认', '取消']}, function () {
            var data = {}
            var searchParam = getSerachData_inPackType()
            checkNull(searchParam)
            data.searchParam = JSON.stringify(searchParam)
            layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
            submitForm(data, ctx + '/inPackType/export.html')
            layer.close(Confirmindex);
        })
    })

    table.on('tool(inPackTypeTable)', function (obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        var tr = obj.tr;

        if (layEvent === 'edit_inPackType') {
            // 修改后不刷新表格，直接更新，所以取数据的时候不能直接获取当前行的数据，需要前端页面的内容
            let inpacktype_templet_sSku = $(tr).find("td[data-field=2]").find(".inpacktype_templet_sSku").text(),
            inpacktype_templet_inPackType  = $(tr).find("td[data-field=inPackType]").children().text();

            var popIndex = layer.open({
                title: '设置入库包装类型',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['500px', '70%'],
                id: 'updateListLayer_inPackType',
                shadeClose: false,
                btn: ['保存', '关闭'],
                content: $('#updateListPop_inPackType').html(),
                success: function () {
                    initNotNull('#updateListForm_inPackType')
                    $('#updateListForm_inPackType [name=skuList]').val(inpacktype_templet_sSku)
                    $('#updateListForm_inPackType select[name=inPackType]').val(inpacktype_templet_inPackType)

                    form.render('select','updateListForm_inPackType')
                },
                yes: function () {
                    if (!checkNotNull('#updateListForm_inPackType')) {
                        return false
                    }
                    var skuList = $('#updateListForm_inPackType [name=skuList]').val().split('\n')
                    // 去除前尾的空格
                    var validSkuList = []
                    for (var i = 0; i < skuList.length; ++i) {
                        if (skuList[i].trim()) {
                            validSkuList.push(skuList[i].trim())
                        }
                    }
                    // 弹框数据
                    var Adata = {
                        inPackType: $('#updateListForm_inPackType [name=inPackType]').val(),
                        skuList: validSkuList
                    }
                    $.ajax({
                        type: "post",
                        url: ctx + "/inPackType/setInPackTypeOfList.html",
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(Adata),
                        success: function(res) {
                            if (res.code == '0000') {
                                var unexistList = res.data
                                var failMsg = ''
                                if (unexistList && unexistList.length > 0) {
                                    failMsg = ',以下sku不存在: ' + unexistList.join(',')
                                }else{  // 如果sku不存在，不更新sku
                                    $(tr).find("td[data-field=2]").find(".inpacktype_templet_sSku").text(Adata.skuList);
                                }
                                layer.closeAll()
                                layer.alert('设置成功' + failMsg)
                                $(tr).find("td[data-field=inPackType]").children().text(Adata.inPackType);
                            } else {
                                layer.alert(res.msg)
                            }
                        }
                    })
                }
            })
        }
    })

    function ajaxToSetInPackTypeOfList(Adata) {
        $.ajax({
            type: "post",
            url: ctx + "/inPackType/setInPackTypeOfList.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(Adata),
            success: function(res) {
                if (res.code == '0000') {
                    var unexistList = res.data
                    var failMsg = ''
                    if (unexistList && unexistList.length > 0) {
                        failMsg = ',以下sku不存在: ' + unexistList.join(',')
                    }
                    layer.closeAll()
                    layer.alert('设置成功' + failMsg)
                    active_inPackType.reload()
                } else {
                    layer.alert(res.msg)
                }
            }
        })
    }

})