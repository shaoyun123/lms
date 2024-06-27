layui.use(['admin', 'form', 'table', 'laydate', 'upload'], function() {
    var $ = layui.$,
        layer = layui.layer,
        table = layui.table,
        upload = layui.upload,
        form = layui.form;
    var secondCateHtml = "<option value=''></option>";
    var allTortTypeHtml = "<option value=''></option>";

    /**
     * 列举侵权类型
     */
    $.ajax({
        type: "post",
        url: ctx + "/tort/prodTortTypeList.html",
        dataType: "json",
        success: function(returnData) {
            if (returnData.code == "0000") {
                $(returnData.data).each(function() {
                    allTortTypeHtml += "<option value='" + this.code + "'>" + this.name + "</option>";
                });
                $("#prodTortSearchForm #prodTortSearchTortTypeSel").html(allTortTypeHtml);
                form.render('select');
            } else {
                layer.msg(returnData.msg);
            }
        }
    });
    /**
     * 列举一级分类
     */
    $.ajax({
        type: "post",
        url: ctx + "/tort/listFirstCate.html",
        dataType: "json",
        success: function(returnData) {
            if (returnData.code == "0000") {
                $(returnData.data).each(function() {
                    secondCateHtml += "<option value='" + this.id + "'>" + this.cateCnName + "</option>";
                });
                $("#prodTortSearchForm #prodTortSearchCateIdSel").html(secondCateHtml);
                form.render('select');
            } else {
                layer.msg(returnData.msg);
            }
        }
    })

    //计算表格所占高度

    function table_height() {
        var bodyheight = $(window).height();
        // var cardheight1 =  $("#LAY_app_body").find('.layui-card').eq(0).outerHeight();
        var cardheight2 = $("#LAY_app_body").find('.layui-card').eq(1).children('.layui-card-header').outerHeight();
        return bodyheight - cardheight2 - 120;
    }

    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#prodTortTable",
        method: 'post',
        url: ctx + "/tort/prodTortPage.html",
        cols: [
            [
                //标题栏
                { title: "缩略图", toolbar: '#prodTortImageBar', width: 70 },
                { field: "cnName", title: "中文名" },
                { field: "enName", title: "英文名", width: 150 },
                { field: "tortTypeName", title: "侵权原因" },
                { title: "侵权平台", toolbar: '#prodTortSitesBar', width: 80 },
                { field: "tortBrand", title: "品牌", },
                { field: "complainant", title: "投诉人", },
                { title: "Logo", toolbar: '#prodTortBrandLogoBar', width: 70 },
                { title: "official URL", toolbar: '#prodTortOfficialUrlBar', width: 80 },
                { field: "sku", title: "sku" },
                { field: "note", title: "说明" },
                { field: "creator", title: "录入人", width: 65 },
                { field: "createTime", title: "时间", },
                { title: '操作', width: 200, align: 'center',toolbar: '#prodTortOperBar' }
            ],
        ],
        page: true,
        id: "prodTortTable",
        limits: [20, 50, 100],
        limit: 50,
        done: function(res, curr, count) {
            //$("#needCheckNum_prodbrand").html(count);
            countProdTortAllStatus();//数量
            imageLazyload();
        }
    });
    function countProdTortAllStatus(){
        var data = {
            cateId: $("#prodTortSearchForm #prodTortSearchCateIdSel").val(),
            tortType: $("#prodTortSearchForm #prodTortSearchTortTypeSel").val(),
            tortSites: $("#prodTortSearchForm #prodTortSearchTortSiteSel").val(),
            searchType: $("#prodTortSearchForm #prodTortSearchTypeSel").val(),
            searchVal: $.trim($("#prodTortSearchForm #prodTortSearchVal").val())
        }
        $.ajax({
            type: "POST",
            url: ctx + "/tort/countProdTortAllStatus.html",
            data: data,
            async: false,
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == '0000') {
                    $('#needCheckNum_prodbrand').text(returnData.data.needCheckNum)
                    $('#hadDelNum_prodbrand').text(returnData.data.hadDelNum)
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function () {
                layer.msg("服务器繁忙，请稍后再试")
            }
        })
    }
    //搜索
    var active = {
        reload: function() {
            table.reload('prodTortTable', {
                page: { curr: 1 },
                where: {
                    cateId: $("#prodTortSearchForm #prodTortSearchCateIdSel").val(),
                    tortType: $("#prodTortSearchForm #prodTortSearchTortTypeSel").val(),
                    tortSites: $("#prodTortSearchForm #prodTortSearchTortSiteSel").val(),
                    searchType: $("#prodTortSearchForm #prodTortSearchTypeSel").val(),
                    searchVal: $.trim($("#prodTortSearchForm #prodTortSearchVal").val()),
                    status : $("#prodTortSearchForm #prodTortStatus").val()==1,
                }
            });
        }
    };

    $("#prodTortSearchBtn").on('click', function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    // 新增侵权弹出框
    $('#addProdTortBtn').click(function() {
        layer.open({
            title: '增加侵权',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['100%', '100%'],
            content: $('#addProdTortLayer').html(),
            btn: ['保存', '关闭'],
            success: function() {
                $("#addProdTortForm #addProdTortTortTypeSel").html(allTortTypeHtml); //初始化侵权类型
                $("#addProdTortForm #addProdTortCateIdSel").html(secondCateHtml); //初始化二级类目
                uploadAllImage_add(); //图片上传
                form.render('select');
            },
            yes: function(index, layero) {
                $("#submitAddProdTortBtn").click();
            },
            end: function() {
                $("#addProdTortForm").trigger('reset');
            }
        })
    })

    //新增侵权
    form.on('submit(submitAddProdTort)', function(data) {
        var productImage = data.field.image;
        if (productImage == null || productImage == '') {
            layer.msg("产品图片不能为空", { icon: 2 });
            return false;
        }
        $.ajax({
            type: "post",
            url: ctx + "/tort/addProdTort.html",
            dataType: "json",
            data: data.field,
            success: function(returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    active['reload'].call();
                    layer.msg("新增侵权成功", { icon: 1 });
                } else {
                    layer.msg(returnData.msg, { icon: 5 });
                }
            },
            error: function() {
                layer.msg("发送请求失败");
            }
        })

        return false;
    });
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(prodTortTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        var id = data.id;
        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: "修改侵权",
                area: ['100%', '100%'],
                content: $("#editProdTortLayer").html(),
                btn: ['保存', '关闭'],
                success: function(layero) {
                    $.ajax({
                        type: "post",
                        url: ctx + '/tort/getProdTortById.html',
                        data: { "id": id },
                        dataType: "json",
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                $("#editProdTortForm input[name='id']").val(id);
                                $("#editProdTortForm #editProdTortCateIdSel").html(secondCateHtml);
                                $("#editProdTortForm #editProdTortTortTypeSel").html(allTortTypeHtml);
                                var obj = returnData.data;
                                $("#editProdTortForm #editProdTortCateIdSel").val(obj.cateId);
                                $("#editProdTortForm #editProdTortTortTypeSel").val(obj.tortType);
                                $("#editProdTortForm #editProdTortTortSitesSel").val(obj.tortSites);
                                $("#editProdTortForm input[name='cnName']").val(obj.cnName);
                                $("#editProdTortForm input[name='enName']").val(obj.enName);
                                $("#editProdTortForm input[name='sku']").val(obj.sku);
                                $("#editProdTortForm input[name='complainant']").val(obj.complainant); //投诉人
                                $("#editProdTortForm input[name='brandUrl']").val(obj.brandUrl);
                                $("#editProdTortForm input[name='tortBrand']").val(obj.tortBrand);
                                $("#editProdTortForm input[name='brandLogo']").val(obj.brandLogo);
                                $("#editProdTortForm input[name='image']").val(obj.image);
                                $('#editTortBrandLogPicShow').attr('src', obj.brandLogo); //图片链接（base64）
                                $('#editTortImagePicShow').attr('src', obj.image); //图片链接（base64）
                                $("#editProdTortForm textarea[name='note']").val(obj.note);
                                uploadAllImage_edit();
                                form.render();
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
                yes: function(index, layero) {
                    $("#submitEditProdTortBtn").click();
                },
                end: function() {
                    $("#editProdTortForm").trigger('reset');
                },
            });
        }else if (layEvent === 'del' || layEvent === 'reback') {
            var operator = data.status ? '停用' : '启用'
            layer.confirm('确定'+ operator +'该条数据吗？', {
                btn: ['确定','取消'], //按钮
                shade: false //不显示遮罩
            }, function(index){
                var id = data.id;
                var status = layEvent == 'reback'
                $.ajax({
                    type: "POST",
                    url: ctx + "/tort/delOrRebackProdTort.html",
                    data: {"id": id,status : status},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            $("#prodTortSearchBtn").trigger('click');
                            if (!status) {
                                layer.msg("停用成功");
                            } else {
                                layer.msg("启用成功");
                            }
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            });
        }else if (layEvent == 'showLog') {
            var id = data.id;
            var index = layer.open({
                type: 1,
                title: '操作日志',
                area: ['1000px', '600px'],
                btn: ['关闭'],
                shadeClose: false,
                content: $('#tb_logListLayer').html(),
                success: function () {
                    table.render({
                        elem: "#tortProd_logTable",
                        method:'post',
                        url: ctx + "/tort/tortBrandLogList.html",
                        cols: [[
                            { field: "creator", title: "操作人",width: 100},
                            { field: "operDesc", title: "操作详情"},
                            { field: "create_time", title: "操作时间",templet : "<div>{{ layui.admin.Format( d.createTime, 'yyyy-MM-dd hh:mm:ss')}}</div>"},
                        ]],
                        page:true,
                        where:{operObjId : id,operModel : 2},
                        id:"tortProd_logTable",
                        limits:[20,100,100],
                        limit:20
                    });
                }
            })
        }
    })

    //编辑侵权
    form.on('submit(submitEditProdTort)', function(data) {
        var productImage = data.field.image;
        if (productImage == null || productImage == '') {
            layer.msg("产品图片不能为空", { icon: 2 });
            return false;
        }
        $.ajax({
            type: "post",
            url: ctx + "/tort/editProdTort.html",
            dataType: "json",
            data: data.field,
            success: function(returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    active['reload'].call();
                    layer.msg("修改侵权成功", { icon: 1 });
                } else {
                    layer.msg(returnData.msg, { icon: 5 });
                }
            },
            error: function() {
                layer.msg("发送请求失败");
            }
        });
        return false;
    });
    /**
     * 新增，初始化图片
     */
    function uploadAllImage_add() {
        //普通图片上传
        upload.render({
            elem: '#addTortBrandLogPic',
            url: ctx + "/tort/uploadTortPic.html",
            accept: 'images',
            before: function(obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result) {
                    $('#addTortBrandLogPicShow').attr('src', result); //图片链接（base64）
                });
            },
            done: function(res) {
                //如果上传失败
                if (res.code != 0) {
                    return layer.msg(res.msg);
                }
                //上传成功
                $("#addProdTortForm input[name='brandLogo']").val(res.msg);
            }
        });

        //url上传图片
        $('#addOutBrandUrl').click(function() {
            layer.open({
                title: '从网络地址(URL)选择图片',
                type: 1,
                area: ['700px', '180px'],
                shadeClose: false,
                content: $('#addProdTortBrandUrlPicLayer').html(),
                end: function() {
                    $("#addProdTortBrandUrlPicLayerInput").val("");
                },
                btn: ['添加', '关闭'],
                yes: function(index, layero) {
                    var brandUrl = $.trim($("#addProdTortBrandUrlPicLayerInput").val());
                    if (brandUrl == "" || brandUrl == undefined) {
                        layer.msg("链接不能为空");
                        return;
                    }
                    $("#addProdTortForm input[name='brandLogo']").val(brandUrl);
                    $('#addTortBrandLogPicShow').attr('src', brandUrl);
                }
            })
        });

        //拖拽上传
        upload.render({
            elem: '#addImageDragUpload',
            url: ctx + "/tort/uploadTortPic.html",
            accept: 'images',
            before: function(obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result) {
                    $('#addTortImagePicShow').attr('src', result); //图片链接（base64）
                });
            },
            done: function(res) {
                //如果上传失败
                if (res.code != 0) {
                    return layer.msg(res.msg);
                }
                //上传成功
                console.info(res.msg);
                $("#addProdTortForm input[name='image']").val(res.msg);
            }
        });
    }

    /**
     * 编辑，初始化图片
     */
    function uploadAllImage_edit() {
        //普通图片上传
        upload.render({
            elem: '#editTortBrandLogPic',
            url: ctx + "/tort/uploadTortPic.html",
            accept: 'images',
            before: function(obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result) {
                    $('#editTortBrandLogPicShow').attr('src', result); //图片链接（base64）
                });
            },
            done: function(res) {
                //如果上传失败
                if (res.code != 0) {
                    return layer.msg(res.msg);
                }
                //上传成功
                $("#editProdTortForm input[name='brandLogo']").val(res.msg);
            }
        });

        //url上传图片
        $('#editOutBrandUrl').click(function() {
            layer.open({
                title: '从网络地址(URL)选择图片',
                type: 1,
                area: ['700px', '180px'],
                shadeClose: false,
                content: $('#editProdTortBrandUrlPicLayer').html(),
                end: function() {
                    $("#editProdTortBrandUrlPicLayerInput").val("");
                },
                btn: ['添加', '关闭'],
                yes: function(index, layero) {
                    layer.close(layer.index);
                    var brandUrl = $.trim($("#editProdTortBrandUrlPicLayerInput").val());
                    if (brandUrl == "" || brandUrl == undefined) {
                        layer.msg("链接不能为空");
                        return;
                    }
                    $("#editProdTortForm input[name='brandLogo']").val(brandUrl);
                    $('#editTortBrandLogPicShow').attr('src', brandUrl);
                }
            })
        });
        //拖拽上传
        upload.render({
            elem: '#editImageDragUpload',
            url: ctx + "/tort/uploadTortPic.html",
            accept: 'images',
            before: function(obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result) {
                    $('#editTortImagePicShow').attr('src', result); //图片链接（base64）
                });
            },
            done: function(res) {
                //如果上传失败
                if (res.code != 0) {
                    return layer.msg(res.msg);
                }
                //上传成功
                $("#editProdTortForm input[name='image']").val(res.msg);
            }
        });
    }
});
function queryPage_prodbrand(status) {
    $("#prodTortSearchForm [name='status']").val(status)
    $("#prodTortSearchBtn").click()
}