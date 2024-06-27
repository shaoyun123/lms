/**
 * SKU映射修复的js
 */
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element'], function () {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        form = layui.form;

    form.render('select')
    /**新增店铺子sku映射*/
    $("#add_storeSkuManage_btn").click(function () {
        var aad_index = layer.open({
            type: 1,
            title: "新增映射",
            area: ['500px', '600px'],
            btn: ['保存', '关闭'],
            content: $('#publish_storeSkuManage_add_layer').html(),
            success: function (layero, index) {
                initNotNull('#add_prodSSkuMapping_form')
                form.render('select','add_prodSSkuMapping_form')
            },
            yes: function (index, layero) {
                if (!checkNotNull('#add_prodSSkuMapping_form')) {
                    return false;
                }
                var data = serializeObject($('#add_prodSSkuMapping_form'))
                loading.show();
                $.ajax({
                    type: "post",
                    url:ctx + "/prodSSkuMapping/addOne",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (res) {
                        loading.hide();
                        if (res.code == "0000") {
                            layer.msg('新增成功')
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                });
            }
        });
    });

    function queryTable_storeSkuManage() {
        var data = serializeObject($("#publish_storeSkuManage_searchForm"));
        if (!data.sSku.trim() && !data.storeSkuStr.trim()) {
            return
        }
        storeSkuManage_searchDataTable(data)
    }

    $('#publish_storeSkuManage_searchBtn').click(function () {
        var data = serializeObject($("#publish_storeSkuManage_searchForm"));
        if (!data.sSku.trim() && !data.storeSkuStr.trim()) {
            layer.msg('须传入商品sku或者店铺sku才能查询')
            return
        }
        storeSkuManage_searchDataTable(data)
    })

    /**
     * 列表查询
     */
    function  storeSkuManage_searchDataTable(data){
        table.render({
            elem: "#publish_storeSkuManage_data_table",
            method: 'post',
            url: ctx + "/prodSSkuMapping/queryPage.html",
            where: data,
            width: 888,
            cols: [
                [
                    {checkbox:true},
                    { field: "sSku", title: "商品子SKU" },
                    { field: 'storeSku', title: "店铺子SKU"},
                    { field: 'platCode', title: "平台"},
                    { title: '操作', width:160, align: 'center',templet: '#publish_storeSkuManage_table_operate_tpl' }
                ],
            ],
            done:function (res) {
                if (res.code == '0000') {
                    $('#publish_storeSkuManage_table_data_num').text(res.count)
                }
            },
        });
    };
    /**
     * 表格工具条的保存
     */
    table.on('tool(publish_storeSkuManage_data_table)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var update_index = layer.open({
                type: 1,
                title: "修改映射",
                area: ['500px', '600px'],
                btn: ['保存', '关闭'],
                content: $('#publish_storeSkuManage_add_layer').html(),
                success: function (layero, index) {
                    initNotNull('#add_prodSSkuMapping_form')
                    $('#add_prodSSkuMapping_form [name=sSku]').val(data.sSku)
                    $('#add_prodSSkuMapping_form [name=storeSku]').val(data.storeSku)
                    // $('#add_prodSSkuMapping_form [name=platCode]').val(data.platCode)
                    form.render('select','add_prodSSkuMapping_form')
                },
                yes: function (index, layero) {
                    if (!checkNotNull('#add_prodSSkuMapping_form')) {
                        return false;
                    }
                    var Adata = serializeObject($('#add_prodSSkuMapping_form'))
                    Adata.id = data.id
                    loading.show();
                    $.ajax({
                        type: "post",
                        url:ctx + "/prodSSkuMapping/updateOne",
                        data: JSON.stringify(Adata),
                        contentType: "application/json",
                        success: function (res) {
                            loading.hide();
                            if (res.code == "0000") {
                                layer.msg('修改成功')
                                layer.close(update_index)
                                queryTable_storeSkuManage()
                            } else {
                                layer.msg(res.msg)
                            }
                        }
                    });
                }
            });
        } else if (layEvent === 'dele') {
            var Adata = {idList: [data.id]}
            deleProdSSkuMappingList(Adata)
        }
    });

    // 批量删除点击
    $('#deleList').click(function () {
        var checkStatus = table.checkStatus('publish_storeSkuManage_data_table'),
            data = checkStatus.data;
        if (data.length == 0) {
            layer.msg('请至少选择1个映射')
            return
        }
        var idList = []
        for (var i = 0; i <data.length; ++i) {
            idList.push(data[i].id)
        }

        var Adata = {idList: idList}
        deleProdSSkuMappingList(Adata)
    })

    // ajax删除方法
    function deleProdSSkuMappingList(data) {
        layer.confirm('删除将无法再找回数据，确认删除吗?',{ btn: ['确认', '取消'] }, function () {
            loading.show()
            $.ajax({
                type: "post",
                url:ctx + "/prodSSkuMapping/deleProdSSkuMappingList",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (res) {
                    loading.hide()
                    if (res.code == '0000') {
                        layer.msg('删除成功')
                        queryTable_storeSkuManage()
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        })
    }

    // 下载模板
    $("#download_storeSkuManage_templat").click(function() {
        window.location.href = ctx + '/static/templet/addStoreMappingTemplat.xlsx'
    })

    // 批量导入
    $('#add_storeSkuManage_byExcel_btn').click(function () {
        $('#file_addprodSSkuMappingExcelFile').click()
    })

    $('#file_addprodSSkuMappingExcelFile').on('change', function() {
        var files = $('#file_addprodSSkuMappingExcelFile')[0].files
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != '.xls') {
            $('#file_addprodSSkuMappingExcelFile').val('')
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        var confirmIndex = layer.confirm('确认导入这个文件进行批量新增店铺SKU映射吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/prodSSkuMapping/addByExcel.html',
                    type: 'POST',
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        layer.close(confirmIndex)
                        loading.hide()
                        // 清空 excel
                        $('#file_addprodSSkuMappingExcelFile').val('')
                        if (data.code == '0000') {
                            // 清空 excel
                            var processData = {
                                processId: data.data.processId,
                                total: data.data.total,
                                redisKeyCode: data.data.redisKeyCode
                            }

                            function succReback(data) {
                                layer.msg("处理完毕");
                            }
                            if (processData.processId) {
                                processBegin(ctx + '/product/queryProcess.html', JSON.stringify(processData), '正在处理数据', 3000, succReback)
                            }
                            layer.msg("上传成功");
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#file_addprodSSkuMappingExcelFile').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })

    // 批量导出
    $('#export_storeSkuManage_btn').click(function () {
        var checkStatus = table.checkStatus('publish_storeSkuManage_data_table'),
            data = checkStatus.data;
        if (data.length == 0) {
            layer.msg('请至少选择1个映射')
            return
        }
        var idList = []
        for (var i = 0; i <data.length; ++i) {
            idList.push(data[i].id)
        }

        var Adata = {idList: idList}
        var Confirmindex = layer.confirm('确认导出所选映射？', { btn: ['确认', '取消'] }, function() {
            layer.alert('请不要关闭和操作网页，后台正在进行导出文件')
            submitForm(Adata, ctx + '/prodSSkuMapping/export.html')
            layer.close(Confirmindex);
        })
    })
});