/**
 * 支付宝账单的js
 * by linzhen 20180510
 * @returns
 */
layui.use(['admin', 'layer', 'table', 'laydate', 'form', 'element', 'upload'], function () {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        form = layui.form,
        element = layui.element,
        upload = layui.upload;

    /**
     * 导入初始判断提示
     */
    var importJudge = function (id) {
        $('#' + id).click(function () {
            var file = $(this).parent().parent().find("input").eq(0).val();
            if (file == null || $.trim(file) == "") {
                layer.msg('请先选中文件!');
                $(this).preventDefault();//阻止继续冒泡
            }
        })
    }
    importJudge('skuMapping__storePSkuImportBtn')

    /**
     * 批量导入店铺sku映射
     */
    upload.render({
        elem: '#skuMapping__storePSkuImport', //绑定元素
        url: ctx + '/skuPMapping/addBatchStorePSkuMapping.html', //上传接口
        accept: 'file',
        exts: 'csv',
        auto: false, //屏蔽自动上传
        bindAction: "#skuMapping__storePSkuImportBtn",
        field: "uploadStorePSkuMappingFile",
        choose: function (obj) {
            var inp = $(this)[0].elem.parent().prev().find('input')
            obj.preview(function (index, file, result) {
                inp.val(file.name)
            })
        },
        before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layer.load(1); //上传loading
        },
        done: function (res, index, result) {
            layer.closeAll('loading'); //关闭loading
            if (res.code == "0000") {
                var content = "本次累计解析记录(" + (res.data.total) + ")条";
                if (res.data.repeat != null && res.data.repeat > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;去除excel中重复映射：" + (res.data.repeat) + "条";
                }
                if (res.data.ingnoreListCount != null && res.data.ingnoreListCount > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;忽略已存在且相等映射：" + res.data.ingnoreListCount + "条";
                }
                if (res.data.updateListCount != null && res.data.updateListCount > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;忽略已存在不相等映射：" + res.data.updateListCount + "条";
                }
                if (res.data.addListCount != null && res.data.addListCount > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:green;'>实际导入订单：" + res.data.addListCount + "条</span>";
                }
                layer.open({
                    title: '店铺导入映射结果',
                    content: content,
                    offset: '100px',
                    area: '500px',
                    yes: function (index, layero) {
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                });
            } else {
                layer.msg(res.msg, {icon: 0});
            }
            //上传完毕回调
        },
        error: function () { //请求异常回调
            layer.msg("批量导入店铺sku映射异常", {icon: 0});
            layer.closeAll('loading'); //关闭loading
        }
    });
    /**
     * 搜索
     */
    $("#sku_p_mapping_search_btn").click(function () {
        table.render({
            elem: "#sku_p_mapping_data_table",
            method: 'post',
            url: ctx + "/skuPMapping/getSkuPMappingByStorePSku.html",
            where:{"storePSku":$.trim($("#sku_p_mapping_storePSku").val())},
            cols: [
                [
                    //标题栏
                    {field: "storePSku", title: "店铺sku"},
                    {field: 'prodPSku', title: "商品sku", align: 'left',},
                    {title: '操作', align: 'center', toolbar: '#sku_p_mapping_table_operate'}
                ],
            ],
            page: false,
            id: "sku_p_mapping_data_table",
            skin: 'line', //行边框风格
            even: true, //开启隔行背景
        });
    })
    /**
     * 监听删除
     */
    table.on('tool(sku_p_mapping_data_table)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        var id = data.id;
        var storePSku = data.storePSku;//店铺sku
        var prodPSku  = data.prodPSku;//店铺sku
        if (layEvent == "delete") {//编辑
            deleteSkuPMapping(id, storePSku,prodPSku);
        }
    })

    /**
     * 删除店铺父sku映射
     */
    function deleteSkuPMapping(id, storePSku,prodPSku) {
        layer.confirm('确认删除店铺父sku <span style=\'color:red;\'>' + storePSku + '</span> 对应的映射？', function (result) {
            if (result) {
                $.ajax({
                    type: "post",
                    url: ctx + "/skuPMapping/deleteSkuPMappingById.html",
                    dataType: "json",
                    data: {"id": id, "storePSku": storePSku,"prodPSku":prodPSku},
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            layer.msg("删除店铺父sku映射成功", {icon: 1});
                            setTimeout(function () {
                                table.reload('sku_p_mapping_data_table', {
                                    where:{"storePSku":$.trim($("#sku_p_mapping_storePSku").val())},
                                });
                            },1500);
                        } else {
                            layer.msg(returnData.msg, {icon: 0});
                        }
                    }
                })
            }
        });
    }
})