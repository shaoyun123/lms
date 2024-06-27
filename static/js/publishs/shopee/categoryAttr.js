/**layui.use开始 */
layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laydate', 'laypage'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$,
        table = layui.table;

    form.render('select')
    var active = {
        reload: function () {
            var siteCode = $("#shopeeCateSearchForm select[name='siteCode'] option:selected").val();
            var attrNullable = $("#shopeeCateSearchForm select[name='attrNullable'] option:selected").val();
            var categoryId = $("#shopeeCateSearchForm input[name='categoryId']").val();
            var cateIdInput = $("#shopeeCateSearchForm input[name='cateIdInput']").val();
            //执行重载
            table.reload("shopeeCateTable", {
                where: {
                    siteCode: siteCode,
                    attrNullable: attrNullable,
                    categoryId: categoryId,
                    cateIdInput: cateIdInput,
                },
            });
        },
    };
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#shopeeCateTable",
        method: "post",
        url: ctx + "/shopee/shopeeCate/queryPage.html",
        where: {
            siteCode: "SG"
        },
        cols: [
            [
                //标题栏
                {field: "categoryName",templet: "#shopeeCateNameTpl" ,title: "类目"},
                {field: "categoryId",title: "类目id"},
                {field: "fullCateNameTrans", title: "全路径"},
                {field: "cateAttrs", title: "属性值", templet: "#shopeeCateAttrValueTpl", width: 300},
                {
                    title: "操作",
                    align: "center",
                    toolbar: "#editShopeeCateAttrBar",
                },
            ],
        ],
        page: true,
        limits: [10,50, 100, 200],
        limit: 10,
        id: "shopeeCateTable",
        done:function () {
            $("#shopee_cateAttr").parent(".layadmin-tabsbody-item").get(0).scrollTop=slidePostion;
            // console.log(slidePostion);
            slidePostion=0;
        }
    });

    $('#shopeeCate_cateSelBtn').click(function() {
        console.log("类目树展开");
        var siteCode = $("#shopeeCateSearchForm select[name='siteCode'] option:selected").val();
        if(siteCode) {
            console.log(siteCode);
            admin.itemCat_select('shopeeCate_cateSelEvent',
                'shopeeCate_searchCateId',
                'shopeeCate_searchNameText',
                "/shopee/shopeeCate/getShopeeCateList.html?siteId=" + siteCode,
                "/shopee/shopeeCate/searchShopeeCate.html?siteId=" + siteCode
                );
        }else{
            layer.msg("必须选择站点");
        }
    });

    $('#shopeeCate_reset').click(function(){
        clearCate('shopeeCate_searchNameText','shopeeCate_searchCateId')
    });

    //搜索
    $("#shopeeCate_search").click(function () {
        var type = $(this).data("type");
        active[type] ? active[type].call(this) : "";
    });

    //同步
    $("#shopeeCatesync").click(function () {
        layer.confirm('确定同步类目数据吗？首次同步耗时较长请勿中断!!', function() {
            loading.show();
            $.ajax({
                type: "POST",
                url: ctx + "/shopee/shopeeCate/syncCate.html",
                dataType: "json",
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code == "0000") {
                        layer.msg("同步成功");
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function () {
                    loading.hide();
                    layer.msg("服务器正忙");
                }
            });
        });
    });

    //编辑默认类目属性
    form.on("submit(editCateDefalutValue)", function (obj) {//使用表单提交的方式,方便校验做表单
        var editObj=obj;
        var req={};
        req.categoryId = currentLineData.categoryId;
        var cateAttrs = [];//属性值
        var cateDom = $("#shopeeSelCateAttrForm .layui-card-body .layui-form-item");
        cateDom.each(function () {
            var attr={};
            var attributeName;
            var attributeValue;

            attributeName = $(this).find("input").attr("name");
            attributeValue = $(this).find("input").val();
            attr.attributeName=attributeName;
            attr.attributeValue=attributeValue;
            if(attr.attributeName) {
                cateAttrs.push(attr);
            }

        });
        req.cateAttrs=cateAttrs;

        $.ajax({
            type: "POST",
            url: ctx + "/shopee/shopeeCate/editCateDefalutValue.html",
            dataType: "json",
            contentType:"application/json;charset=utf-8",
            traditional: true,
            data: JSON.stringify(req),
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.msg("保存成功");
                    layer.closeAll();

                    $("#shopeeCate_search").trigger("click");
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
        });
        return false;
    });

    var currentLineData;//当前选中的行
    var slidePostion=0; //滑动条位置
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on("tool(shopeeCateTable)", function (obj) {
        slidePostion = $("#shopee_cateAttr").parent(".layadmin-tabsbody-item").get(0).scrollTop;

        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值
        currentLineData=data;
        $("#shopeeSelCateAttrForm input[name=categoryId]").val(data.categoryId);
        if (layEvent === "edit") {
            layer.open({
                type: 1,
                title: "编辑类目属性",
                area: ["1000px", "500px"],
                btn: ["关闭"],
                content: $("#editShopeeCateAttrLayer").html(),
                success: function (layero, index) {
                    var attrList = data.cateAttrs;
                    if (attrList&&attrList.length > 0) {
                        for (var i = 0; i < attrList.length; i++) {
                            //DROP_DOWN
                            var selectTpl = '<div class="layui-form-item">'
                                + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                                + '<div class="layui-input-inline">'
                                + '    <input type="text" class="layui-input" list=":attrName_CC_List"  name=":attrName" value=":attrValue" lay-verify=":isMandatory">'
                                +'<datalist id=":attrName_CC_List">'
                                +':optionList'
                                +'</datalist>'
                                + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                                + '</div>'
                                + '</div>';
                            //COMBO_BOX

                            //TEXT_FILED
                            var inputTpl = '<div class="layui-form-item">'
                                + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                                + '<div class="layui-input-block">'
                                + '  <input name=":attrName" type=":attrType" value=":attrValue" class="canChangeInput layui-input" lay-verify=":isMandatory:isInteger">'
                                + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                                + '</div>'
                                + '</div>';

                            var description = "";
                            var dom = ""; //展示元素
                            var isMandatory = attrList[i].isMandatory,
                                attributeName = attrList[i].attributeName,
                                attributeNameTrans = attrList[i].attributeNameTrans,
                                attributeType = attrList[i].attributeType,
                                attributeId = attrList[i].attributeId,
                                inputType = attrList[i].inputType,
                                options = attrList[i].options,
                                optionsTrans = attrList[i].optionsTrans,
                                attributeValue = attrList[i].attributeValue;
                            var opTransMap = new Map();
                            if(options&&optionsTrans){//构建一个翻译map
                                var optionArry=options.split("#,#");
                                var optionTransArry=optionsTrans.split("#,#");
                                for(var ix=0;ix<optionArry.length;ix++){
                                    opTransMap.set(optionArry[ix],optionTransArry[ix]);
                                }
                            }

                             if (inputType == 'DROP_DOWN'||inputType == 'COMBO_BOX') {
                                dom = selectTpl;
                                var optionList = '<option value="">请选择</option>';
                                options.split("#,#").forEach(function (attrVal) {
                                    var attrValTrans=opTransMap.get(attrVal);
                                    if(attrValTrans){
                                        attrValTrans +='('+attrVal+')';
                                    }else{
                                        attrValTrans=attrVal;
                                    }
                                    if(attributeValue) {
                                        dom = dom.replace(/:attrValue/g, attributeValue);
                                    }else{
                                        dom = dom.replace(/:attrValue/g, '');
                                    }
                                    optionList += '<option  value="' + attrVal + '">' + attrValTrans + '</option>';
                                });


                                dom = dom.replace(":optionList", optionList);
                            } else if (inputType == 'TEXT_FILED') {
                                dom = inputTpl;
                                if (attributeType == 'INT_TYPE' || attributeType == 'FLOAT_TYPE') {
                                    dom = dom.replace(/:attrType/g, 'number');
                                    if (attributeType == 'INT_TYPE') {
                                        dom = dom.replace(/:isInteger/g, 'integer|');//要求整数
                                    }
                                } else {
                                    dom = dom.replace(/:attrType/g, 'text');
                                }
                                dom = dom.replace(/:isInteger/g, '');//不要求整数
                                if(attributeValue) {
                                    dom = dom.replace(/:attrValue/g, attributeValue);
                                }else{
                                    dom = dom.replace(/:attrValue/g, '');
                                }
                            }
                            if (isMandatory) {
                                dom = dom.replace(/:isMandatory/g, 'required|');
                                dom = dom.replace(/:isCheckOne/g, 'mustCheckOne|');//要求必选checkbox
                                // dom = dom.replace(/:description/g, '必填'+inputType+"#"+attributeType);
                                dom = dom.replace(/:needTips/g, '<p style="color:red; float: right;" >*</p>');
                            }else {
                                dom = dom.replace(/:isMandatory/g, '');
                                dom = dom.replace(/:isCheckOne/g, '');//不必选checkbox
                                // dom = dom.replace(/:description/g, ''+inputType+'#'+attributeType);
                                dom = dom.replace(/:needTips/g, '');
                            }
                            if(attributeNameTrans) {
                                dom = dom.replace(/:attrNameTrans/g, attributeNameTrans+'('+attributeName+')');
                            }else{
                                dom = dom.replace(/:attrNameTrans/g, attributeName);
                            }
                            dom = dom.replace(/:attrName/g, attributeName);
                            dom = dom.replace(/:description/g, '');
                            //赋值

                            $("#shopeeSelCateAttrForm .layui-card-body").append(dom);
                        }
                    }
                    form.render();
                },
                // yes: function (index, layero) {//保存
                //     $("#editCateDefalutValue").trigger("click");
                // }
            })
        }
        if (layEvent === "delAttr") {
            layer.confirm("是否删除该类目的所有属性？", function(result) {
                if (result) {
                    $.ajax({
                        type: "POST",
                        url: ctx + "/shopee/shopeeCate/delAttr.html",
                        dataType: "json",
                        data: {categoryId:data.categoryId},
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("删除成功");
                                $("#shopeeCate_search").trigger("click");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function() {
                            layer.msg("服务器正忙");
                        },
                    });
                }
            });
        }
        if (layEvent === "syncAttr") {
            layer.confirm("确定同步该类目的所有属性？", function(result) {
                if (result) {
                    loading.show();
                    $.ajax({
                        type: "POST",
                        url: ctx + "/shopee/shopeeCate/syncAttr.html",
                        dataType: "json",
                        data: {id:data.id},
                        success: function (returnData) {
                            loading.hide();
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("同步成功");
                                $("#shopeeCate_search").trigger("click");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function() {
                            loading.hide();
                            layer.msg("服务器正忙");
                        },
                    });
                }
            });
        }
    })
});
