let amazonCateData;
layui.use(["admin", "form", "table", "layer", "laytpl", 'formSelects', 'element', 'upload'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        upload = layui.upload;
    $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");

    //选择分类弹框
    $('#amazonCaateMapping_item').click(function () {
        admin.itemCat_select('LAY-amazon-cate-mapping', 'LAY-amazon-cate-mapping-hidden', 'LAY-amazon-cate-mapping-div')
    });

    $("#amazonCateAttr_batchDelete").click(function(){
        let tableData = layui.table.checkStatus("amazonCateAttrTable").data
        if (tableData.length == 0) {
            return layer.msg("请选择需要删除的数据！")
        } else {
            layer.confirm('确定删除？', function (index) {
                commonReturnPromise({
                    url: `/lms/amazonCateAttr/batchDelete`,
                    type: 'POST',
                    contentType: 'application/json',
                    params: JSON.stringify(tableData)
                }).then(res => {
                    layer.alert(res, {icon: 1})
                    $("#amazonCateMapping_search").click()
                })
            })
        }
    })


    //表格渲染
    table.render({
        elem: "#amazonCateAttrTable",
        method: "post",
        url: ctx + "/amazonCateAttr/queryCateAttrPage.html",
        contentType: 'application/json',
        where: {
            salesSite: $("#amazonCateMapping_Form select[name='salesSite'] option:selected").val(),
            isImport: $("#amazonCateMapping_Form select[name='isImport'] option:selected").val(),
            categoryId: $("#amazonCateMapping_Form input[name='categoryId']").val(),
            fullCateName: $("#amazonCateMapping_Form input[name='fullCateName']").val(),
            fullCateNameSearchType: $("#amazonCateMapping_Form input[name='fullCateNameSearchType']").is(':checked') == true ? 0: 1,
        },
        cols: [
            [
                //标题栏
                { type: "checkbox", width: 25, style: "vertical-align: top;" },
                {field: "name", title: "类目"},
                {field: "categoryId", title: "类目id"},
                {field: "fullCateName", title: "全路径"},
                {
                    field: "isImport", title: "是否导入", templet: function (data) {
                        if (data.isImport === true) {
                            return "是";
                        } else if (data.isImport === false) {
                            return "否";
                        } else {
                            return "";
                        }
                    }
                },
                {field: "createTime", title: "创建时间", templet: "<div>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</div>"},
                {field: "modifyTime", title: "修改时间", templet: "<div>{{Format(d.modifyTime,'yyyy-MM-dd hh:mm:ss')}}</div>"},
                {
                    title: "操作",
                    align: "center",
                    toolbar: "#amazonCateMappingEditBar",
                },
            ],
        ],
        id: "amazonCateAttrTable",
        page: true,
        limits: [10, 50, 100, 200],
        limit: 50
    });

    //搜索
    $("#amazonCateMapping_search").click(function () {
        //执行重载
        table.reload("amazonCateAttrTable", {
            where: {
                salesSite: $("#amazonCateMapping_Form select[name='salesSite'] option:selected").val(),
                isImport: $("#amazonCateMapping_Form select[name='isImport'] option:selected").val(),
                categoryId: $("#amazonCateMapping_Form input[name='categoryId']").val(),
                fullCateName: $("#amazonCateMapping_Form input[name='fullCateName']").val(),
                fullCateNameSearchType: $("#amazonCateMapping_Form input[name='fullCateNameSearchType']").is(':checked') == true ? 0: 1,
            },
        });
    });

    //编辑按钮查询
    function getFileList(data) {
        $.ajax({
            type: "POST",
            url: ctx + "/amazonCateAttr/listTempFileName.html",
            data: {
                categoryId: data.categoryId,
                fullCateName: data.fullCateName,
                salesSite: data.salesSite
            },
            async: false,
            dataType: "json",
            before: function () {
                layer.loading();
            },
            success: function (returnData) {
                if (returnData.code === "0000") {
                    let formElem = $('#amazonCateMappingEdit_Form')
                    formElem.html('')
                    let allField = returnData.data;
                    if (JSON.stringify(allField) == '{}') {
                        return formElem.append('<div style="width:100%;text-align:center;height: 300px;line-height:300px">没有类目属性信息！</div>')
                    }
                    amazonCateData = allField;
                    let html = ``;
                    for (let key in allField) {
                        html += `<div style="margin-left: 15px">
                                <fieldset class="layui-elem-field layui-field-title site-demo-button"  id="basicInfo">
                                <legend style="font-size:14px">` + key + `</legend>
                            </fieldset>`
                        let subFiled = allField[key];
                        // for (let item in subFiled) {
                            subFiled?.forEach(cItem => {
                                let options = `<option></option>`;
                                let required = ``;
                                // 是否必填
                                if (cItem.required == true) {
                                    required = '<span class="fRed">*</span>'
                                }
                                if(cItem.modifiable != true){ // 不允许修改
                                    // 是否允许修改cItem.modifiable != true
                                    html += `<div class="layui-form-item">
                                            <div class="layui-col-md3 layui-col-lg3" lay-tips="${cItem.remark}" style = "width:25%; word-break:break-all;">` + required + cItem.fieldName + `<i class="layui-icon layui-icon-about"></i></div>
                                            <div class="layui-col-md8 layui-col-lg8">
                                               <input class="layui-input" disabled readonly placeholder="不允许修改" value="${cItem.defaultValue||''}" name="` + cItem.fieldName + `">
                                            </div>
                                        </div>`
                                }else{ // 允许修改
                                    if (cItem.validValueList) { // 下拉框
                                        // 下拉选项
                                        cItem.validValueList.forEach(i => {
                                            if(cItem.defaultValue == i){
                                                options += `<option selected value="${i}">${i}</option>`
                                            }else{
                                                options += `<option value="${i}">${i}</option>`
                                            }
                                        })
                                        html += `<div class="layui-form-item" >
                                            <div class="layui-col-md3 layui-col-lg3">` + required + cItem.fieldName + `</div>
                                            <div class="layui-col-md8 layui-col-lg8">
                                                <select name="` + cItem.fieldName + `">
                                                ` + options + `
                                                </select>
                                            </div>
                                        </div>`
                                    } else { // 单选
                                        html += `<div class="layui-form-item">
                                            <div class="layui-col-md3 layui-col-lg3" lay-tips="${cItem.remark}" style = "width:25%; word-break:break-all;">` + required + cItem.fieldName + `<i class="layui-icon layui-icon-about"></i></div>
                                            <div class="layui-col-md8 layui-col-lg8">
                                               <input class="layui-input" value="${cItem.defaultValue||''}" name="` + cItem.fieldName + `">
                                            </div>
                                        </div>`
                                    }
                                }
                            })

                        // }
                        html += `</div>`
                    }
                    formElem.append(html)
                    form.render('select', 'amazonCateMappingEdit_Form')
                    //回显结果
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
        });
    }

    //编辑弹框
    table.on("tool(amazonCateAttrTable)", function (obj) {
        var editObj = obj;
        var data = obj.data; //获得当前行数据
        // data.isImport == true // 是
        layEvent = obj.event;
        if (layEvent === "edit") {
            // console.log(123);
            layer.open({
                type: 1,
                title: "编辑类目属性信息",
                area: ["1400px", "700px"],
                btn: data.isImport == true ? ["保存","关闭"] : ["关闭"],
                content: $("#amazonCateAttrEdit_Layer").html(),
                success: function (layero, index) {
                    //按站点获取获取当前站点的文件列表
                    getFileList(data);

                },
                yes: function (index, layero) {
                    if(data.isImport != true){
                        return layer.close(index);
                    }
                    layer.close(index);
                    let arr = [],obj = serializeObject($('#amazonCateMappingEdit_Form'));
                    for(let i in amazonCateData){
                        amazonCateData[i]?.forEach(item => {
                            item['defaultValue'] = obj[item.fieldName]
                        })
                        for(let j in amazonCateData[i]){
                            arr.push(amazonCateData[i][j])
                        }
                    }
                    commonReturnPromise({
                        url: `/lms/amazonCateAttr/saveProdCateAttrAmazonNew`,
                        type: 'POST',
                        contentType: 'application/json',
                        params: JSON.stringify(arr)
                    }).then(res => {
                        layer.alert(res, {icon: 1})
                        $("#amazonCateMapping_search").click()
                    })
                    // $("#updateAmazonCateMapping").trigger("click");
                }
            });
        }
        if (layEvent === "delAttr") {
            layer.confirm("是否删除该类目的所有属性？", function (result) {
                if (result) {
                    $.ajax({
                        type: "POST",
                        url: ctx + "/amazonCateAttr/delAttr.html",
                        dataType: "json",
                        data: {categoryId: data.categoryId,
                                salesSite: data.salesSite,
                            fullCateName: data.fullCateName
                        },
                        success: function (returnData) {
                            if (returnData.code === "0") {
                                layer.closeAll();
                                layer.msg("删除成功");
                                $("#lazadaCate_search").trigger("click");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function () {
                            layer.msg("服务器正忙");
                        },
                    });
                }
            });
        }
    });

    // 类目树维护
    $("#amazonCateAttrTreeImportBar").click(function(){
        amazonCateAttrImportFile("类目树维护","/amazonCateAttr/updateBrowseTreeByExcel")
    })

    // 类目属性维护
    $('#amazonCateAttrImportBar').click(function () {
        amazonCateAttrImportFile("类目属性维护","/amazonCateAttr/updateByExcel.html")
    });

    function amazonCateAttrImportFile(title,url){
        layer.open({
            type: 1,
            title: title,
            area: ["800px", "650px"],
            btn: ["关闭"],
            content: $("#amazonCateAttrImportBar_Layer").html(),

            success: function () {
                form.render('select', 'amazonCateAttrImportForm');
                //多文件列表示例
                var demoListView = $('#demoList');
                var loading;
                // var salesSite ;
                var uploadListIns = upload.render({
                    elem: '#testList'
                    , url: ctx + url
                    , accept: 'file'
                    , ansyn: false
                    , multiple: true
                    , auto: false
                    , bindAction: '#testListAction'
                    , before: function (obj) {
                        loading = layer.load(1);
                        this.data = {'salesSite': $('#selectSite').val()};//关键代码
                    }
                    , choose: function (obj) {

                        var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //读取本地文件
                        obj.preview(function (index, file, result) {
                            var tr = $(['<tr id="upload-' + index + '">'
                                , '<td>' + file.name + '</td>'
                                , '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
                                , '<td>等待上传</td>'
                                , '<td>'
                                , '<button class="layui-btn layui-btn-mini demo-reload layui-hide">重传</button>'
                                , '<button class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button>'
                                , '</td>'
                                , '</tr>'].join(''));

                            //单个重传
                            tr.find('.demo-reload').on('click', function () {
                                obj.upload(index, file);
                            });

                            //删除
                            tr.find('.demo-delete').on('click', function () {
                                delete files[index]; //删除对应的文件
                                tr.remove();
                                uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                            });

                            demoListView.append(tr);
                        });
                    }
                    , done: function (res, index, upload) {
                        layer.close(loading);
                        if (res.code == "0000") {
                            //上传成功
                            var tr = demoListView.find('tr#upload-' + index)
                                , tds = tr.children();
                            tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                            tds.eq(3).html(''); //清空操作
                            delete this.files[index]; //删除文件队列已经上传成功的文件
                            layer.msg(res.msg);
                            return;
                        } else  {
                            var tr = demoListView.find('tr#upload-' + index)
                                , tds = tr.children();
                            var failValue = '上传失败,' +res.msg;
                            var html = '<span style="color: red">'+ failValue +'</span>'
                            tds.eq(2).html(html);
                            layer.msg(res.msg);
                        }

                    }
                    , error: function (index, upload) {
                        var tr = demoListView.find('tr#upload-' + index)
                            , tds = tr.children();
                        tds.eq(2).html('<span style="color: #5FB878;">上传失败</span>');
                    }
                });
            },
            yes: function (index, layero) {
                // $("#updateAmazonCateMapping").trigger("click");
                layer.close(index);
            },
        });
    }


    form.on("submit(updateAmazonCateMapping)", function (data) {
        data.field.bulletPoints = "";
        var pointNum = 0;
        $("#amazonCateMappingEdit_Form .bullet_point_class").each(function () {
            if ($(this).find('input').val().trim()) {
                pointNum++;
            } else {
                return false;
            }
            if (data.field.bulletPoints) {
                data.field.bulletPoints += "#,#" + $(this).find('input').val();
            } else {
                data.field.bulletPoints += "#,#" + $(this).find('input').val().trim();
            }
        });
        $.ajax({
            type: "POST",
            url: ctx + "/amazonCateMapping/update.html",
            dataType: "json",
            async: false,
            data: data.field,
            success: function (returnData) {
                if (returnData.code == "0000") {
                    console.log("1");
                    layer.closeAll();
                    layer.msg("保存成功");
                    $("#amazonCateMapping_search").trigger("click");
                } else {
                    console.log("1");
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
        });
        return false;
    });


    // 导入excel
    $('#sInfoExcel_productlist').on('change', function () {
        var salesSite = $(" select[name='popSalesSite'] option:selected").val();
        var files = $('#sInfoExcel_productlist')[0].files;
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name;
        var seat = fileName.lastIndexOf('.')
        var extension = fileName.substring(seat).toLowerCase()
        if (extension != '.xlsx' && extension != '.xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData()
        formData.append('file', files[0]);
        formData.append("salesSite", salesSite);
        layer.confirm('确认通过这个文件进行类目属性的导入吗', {btn: ['确认', '取消']},
            function () {
            console.log("1");
                loading.show()
                $.ajax({
                    url: ctx + '/amazonCateAttr/updateByExcel.html',
                    type: 'POST',
                    async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function (data) {

                        console.log("1");
                        loading.hide()
                        $('#sInfoExcel_productlist').val('')

                        if (data.code == '0000') {

                            console.log("1");
                            // 清空 excel
                            var processData = {
                                processId: data.data.processId,
                                total: data.data.total,
                                redisKeyCode: data.data.redisKeyCode
                            }

                            function succReback(data) {
                                layer.close(updateParentSkuLayerIndex)
                                layer.msg('处理完毕')
                            }

                            if (processData.processId) {
                                processBegin(ctx + '/product/queryProcess.html', JSON.stringify(processData), '正在处理数据', 5000, succReback)
                            }
                            layer.msg('上传成功')
                        }else {
                            console.log("1");
                            layer.msg(data.msg)
                        }

                    },
                    error: function () {
                        loading.hide()
                        console.log("1");
                        layer.msg(data.msg)
                        $('#sInfoExcel_productlist').val('')
                    }
                })
            },
            function () {
                layer.closeAll()
            }
        )
    })

});

function add_bullet_point() {
    var tplReq =
        '<div class="bullet_point_class">' +
        '<input style="Width:750px" class="layui-input" type="text" required lay-verify="required" value="#value#" class="layui-input" placeholder="请输入1个bullet_point">' +
        '<i class="layui-icon layui-icon-delete" onclick="del_bullet_point(this)" style="cursor:pointer"></i>' +
        '</div>';

    $(".allBulletPointsClass").append(tplReq.replace("#value#", ""));

}

function del_bullet_point(obj) {
    $(obj).closest('.bullet_point_class').remove()
}

