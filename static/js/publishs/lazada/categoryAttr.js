/**layui.use开始 */
layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laydate', 'laypage','layCascader'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        layCascader = layui.layCascader,
        $ = layui.$,
        table = layui.table;


    $.ajax({
        type: "POST",
        url: ctx + "/lazada/getSalesSiteEnum.html",
        dataType: "json",
        success: function (returnData) {
            if (returnData.code == "0000") {
                var data=returnData.data;
                for(var i=0;i<data.length;i++) {
                    var option = "<option value=\"" + data[i].code + "\">" + data[i].name + "</option>";
                    $("#lazadaCateSearchForm select[name='siteCode']").append(option);
                }
                form.render('select');
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function () {
            layer.msg("服务器正忙");
        }
    });
    form.render('select');
    var active = {
        reload: function () {
            var siteCode = $("#lazadaCateSearchForm select[name='siteCode'] option:selected").val();
            var attrNullable = $("#lazadaCateSearchForm select[name='attrNullable'] option:selected").val();
            // var categoryId = $("#lazadaCateSearchForm input[name='categoryId']").val();
            var categoryId = JSON.parse($('#lazadaCategoryAttr_lazadaCates').val() || '[]').join(",");//平台类目ID
            var cateIdInput = $("#lazadaCateSearchForm input[name='cateIdInput']").val();
            //执行重载
            table.reload("lazadaCateTable", {
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
        elem: "#lazadaCateTable",
        method: "post",
        url: ctx + "/lazada/queryCateAttrPage.html",
        where: {
            siteCode: "SG"
        },
        cols: [
            [
                //标题栏
                {field: "name",title: "类目"},
                {field: "categoryId",title: "类目id"},
                {field: "fullCateName", title: "全路径"},
                {field: "cateAttrs", title: "属性值", templet: "#lazadaCateAttrValueTpl", width: 300},
                {
                    title: "操作",
                    align: "center",
                    toolbar: "#editLazadaCateAttrBar",
                },
            ],
        ],
        page: true,
        limits: [10,50, 100, 200],
        limit: 10,
        id: "lazadaCateTable",
        done:function () {
            $("#lazada_cateAttr").parent(".layadmin-tabsbody-item").get(0).scrollTop=slidePostion;
            // console.log(slidePostion);
            slidePostion=0;
        }
    });

    // $('#lazadaCate_cateSelBtn').click(function() {
    //     console.log("类目树展开");
    //     var siteCode = $("#lazadaCateSearchForm select[name='siteCode'] option:selected").val();
    //     if(siteCode) {
    //         console.log(siteCode);
    //         admin.itemCat_select('lazadaCate_cateSelEvent',
    //             'lazadaCate_searchCateId',
    //             'lazadaCate_searchNameText',
    //             "/lazada/getLazadaCateList.html?siteId=" + siteCode,
    //             "/lazada/searchLazadaCate.html?siteId=" + siteCode
    //             );
    //     }else{
    //         layer.msg("必须选择站点");
    //     }
    // });
    let lazadaCategoryAttrLazadaCates = layCascader({
        elem: "#lazadaCategoryAttr_lazadaCates",
        clearable: true,
        filterable: true,
        collapseTags: true,
        placeholder: '请先选择站点',
        // options: res,
        props: {
            multiple: true,
            label: "enName",
            value: "categoryId"
        },
    })

    form.on("select(lazadaCategoryAttr_siteCode)",function(data){
        getlazadaCategoryAttr(data.value)
    })

    getlazadaCategoryAttr("SG")
    function getlazadaCategoryAttr(siteCode){
        commonReturnPromise({
            url: "/lms/lazada/getLazadaCategoryTree?site=" + siteCode,
        }).then((res)=>{
            lazadaCategoryAttrLazadaCates.setOptions(res)
        })
    }

    $('#lazadaCate_reset').click(function(){
        lazadaCategoryAttrLazadaCates.setValue(null)
        // clearCate('lazadaCate_searchNameText','lazadaCate_searchCateId')
    });

    //搜索
    $("#lazadaCate_search").click(function () {
        var type = $(this).data("type");
        active[type] ? active[type].call(this) : "";
    });

    //同步
    $("#lazadaCatesync").click(function () {
        layer.confirm('确定同步类目数据吗？首次同步耗时较长请勿中断!!', function() {
            var salesSite = $("#lazadaCateSearchForm select[name='siteCode'] option:selected").val();
            loading.show();
            $.ajax({
                type: "POST",
                url: ctx + "/lazada/syncCate.html",
                data:{salesSite:salesSite},
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
        var cateDom = $("#lazadaSelCateAttrForm .layui-card-body .layui-form-item");
        cateDom.each(function () {
            var attr={};
            var attributeName;
            var attributeValue;
            if ($(this).find("select").length > 0) {//单选
                attributeName = $(this).find("select").attr("name");
                attributeValue = $(this).find("select").val();
            }else if($(this).find(".multiSelectCheckBox").length > 0){//多项复选
                attributeName = $(this).find(".multiSelectCheckBox").attr("name");
                var checkboxList=$(this).find(".multiSelectCheckBox input:checked ");
                attributeValue="";
                for(var i=0;i<checkboxList.length;i++){
                    if(attributeValue){
                        attributeValue+="#,#"+$(checkboxList[i]).val();
                    }else{
                        attributeValue=$(checkboxList[i]).val();
                    }

                }
            }
            else {
                attributeName = $(this).find(".canChangeInput").attr("name");//由于input类型会不断变化,所以最好使用class识别
                attributeValue = $(this).find(".canChangeInput").val();//后台转换TIMESTAMP_TYPE或DATE_TYPE
            }
            attr.attributeName=attributeName;
            attr.attributeValue=attributeValue;
            if(attr.attributeName) {
                cateAttrs.push(attr);
            }

        });
        req.cateAttrs=cateAttrs;

        $.ajax({
            type: "POST",
            url: ctx + "/lazada/editCateDefalutValue.html",
            dataType: "json",
            contentType:"application/json;charset=utf-8",
            traditional: true,
            data: JSON.stringify(req),
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.msg("保存成功");
                    layer.closeAll();

                    $("#lazadaCate_search").trigger("click");
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
    table.on("tool(lazadaCateTable)", function (obj) {
        slidePostion = $("#lazada_cateAttr").parent(".layadmin-tabsbody-item").get(0).scrollTop;

        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值
        currentLineData=data;
        $("#lazadaSelCateAttrForm input[name=categoryId]").val(data.categoryId);
        if (layEvent === "edit") {
            layer.open({
                type: 1,
                title: "编辑类目属性",
                area: ["1000px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editLazadaCateAttrLayer").html(),
                success: function (layero, index) {
                    var attrList = data.cateAttrs;
                    if (attrList&&attrList.length > 0) {
                        for (var i = 0; i < attrList.length; i++) {
                            if(attrList[i].attributeType=='sku'){//只处理父sku的
                                continue;
                            }
                            if(attrList[i].attributeName=='name'
                                ||attrList[i].attributeName=='brand'
                                ||attrList[i].attributeName=='model'
                                ||attrList[i].attributeName=='warranty_type'
                                ||attrList[i].attributeName=='short_description'
                                ||attrList[i].attributeName=='description'
                                ||attrList[i].attributeName=='Hazmat'
                                ||attrList[i].attributeName=='name_ms'
                            ){
                                continue;
                            }


                            //singleSelect
                            var selectTpl = '<div class="layui-form-item">'
                                + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                                + '<div class="layui-input-inline">'
                                + '    <select name=":attrName" lay-verify=":isMandatory">'
                                + ':optionList'
                                + '    </select>'
                                + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                                + '</div>'
                                + '</div>';
                            //text
                            var inputTpl = '<div class="layui-form-item">'
                                + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                                + '<div class="layui-input-block">'
                                + '  <input name=":attrName" type=":attrType" value=":attrValue" class="canChangeInput layui-input" lay-verify=":isMandatory:isInteger">'
                                + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                                + '</div>'
                                + '</div>';
                            //multiSelect
                            var multiSelTpl = '<div class="layui-form-item">'
                                + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                                + '<div class="layui-input-block">'
                                + '<div class="multiSelectCheckBox" name=":attrName">'
                                + ':checkBoxList'
                                + '</div>'
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

                            //---------------------------------
                            if(inputType == 'singleSelect'&&attributeName == 'brand' &&!options){//brand字段比较特殊(options没有选个屁),走text
                                inputType='text';
                            }
                            if(inputType == 'richText'){
                                inputType='text';
                            }
                            //
                            // if(inputType != 'text'&&inputType != 'richText'&&inputType != 'singleSelect'&&inputType != 'multiSelect'){
                            //     layer.msg("有超出想象的输入类型:"+inputType+"被忽略,如需展示请联系开发");
                            // }
                            // //
                            // if(inputType == 'richText'){//一般不会再这里出现富文本,所以玩意出现意料以外的要提示
                            //     if(attributeName=='short_description'||attributeName=='description'){
                            //         continue;
                            //     }else{
                            //         layer.msg("有超出想象的类目属性:"+attributeName+"被忽略,如需展示请联系开发");
                            //     }
                            // }
                            if(inputType == 'multiSelect'&&isMandatory){
                                layer.msg("假装这个类目属性:"+attributeName+"不是必选,如需提示必选请联系开发");
                            }
                            //--------------------------------------


                            if (inputType == 'singleSelect') {
                                dom = selectTpl;
                                var optionList = '<option value="">请选择</option>';
                                options.split("#,#").forEach(function (attrVal) {
                                    var attrValTrans=opTransMap.get(attrVal);
                                    if(attrValTrans){
                                        attrValTrans +='('+attrVal+')';
                                    }else{
                                        attrValTrans=attrVal;
                                    }
                                    if(attrVal==attributeValue) {
                                        optionList += '<option selected value="' + attrVal + '">' + attrValTrans + '</option>';
                                    }else{
                                        optionList += '<option  value="' + attrVal + '">' + attrValTrans + '</option>';
                                    }
                                });


                                dom = dom.replace(":optionList", optionList);
                            }
                            else if (inputType == 'multiSelect') {
                                dom = multiSelTpl;
                                var checkBoxList = "";
                                //checkBox的回显,值是多个匹配
                                var valList=[];
                                if(attributeValue){
                                    attributeValue.split("#,#").forEach(function (attributeValueOne) {
                                        valList.push(attributeValueOne);
                                    });
                                }

                                options.split("#,#").forEach(function (attrVal) {
                                    var attrValTrans=opTransMap.get(attrVal);
                                    if(attrValTrans){
                                        attrValTrans +='('+attrVal+')';
                                    }else{
                                        attrValTrans=attrVal;
                                    }
                                    //回显


                                    if(valList.indexOf(attrVal)!=-1) {
                                        checkBoxList += '<input lay-skin="primary" type="checkbox"  checked title="'+attrValTrans+'" value="' + attrVal + '">';
                                    }else{
                                        checkBoxList += '<input lay-skin="primary" type="checkbox" title="'+attrValTrans+'" value="' + attrVal + '">';
                                    }
                                });


                                dom = dom.replace(":checkBoxList", checkBoxList);
                            }
                            else if (inputType == 'text') {
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

                            $("#lazadaSelCateAttrForm .layui-card-body").append(dom);
                        }
                    }
                    form.render();
                },
                yes: function (index, layero) {//保存
                    $("#editCateDefalutValue").trigger("click");
                }
            })
        }
        if (layEvent === "delAttr") {
            layer.confirm("是否删除该类目的所有属性？", function(result) {
                if (result) {
                    $.ajax({
                        type: "POST",
                        url: ctx + "/lazada/delAttr.html",
                        dataType: "json",
                        data: {categoryId:data.categoryId},
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("删除成功");
                                $("#lazadaCate_search").trigger("click");
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
    })
});
