layui.use(["admin", "form", "table", "layer", "laytpl", 'upload','laydate', 'element',"formSelects"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        upload = layui.upload,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        element = layui.element;
    $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");
    formSelects.render("amazonExtraInfo_bizzOwner")

    laydate.render({
        elem: '#amazonProdExtraInfoTime', //渲染时间
        range: true
    });

    //选择分类弹框
    $('#amazonProdExtraInfo_item').click(function () {
        admin.itemCat_select('LAY-amazon-prod-etra-info', 'LAY-amazon-prod-etra-info-hidden', 'LAY-amazon-prod-etra-info-div')
    });

    // 获取站点接口
    function getSaleSite(){
        return commonReturnPromise({
            url: `/lms/onlineProductAmazon/getAllAmazonSite.html`,
            type: 'POST'
        })
    }

    // 获取模板名称接口
    function getListTempFileName(saleSite){
        return commonReturnPromise({
            url: "/lms/amazonCateMapping/listTempFileName.html",
            type: 'POST',
            params:{ salesSite: saleSite },
        })
    }

    // 获取产品类型接口
    function getListTempFileType(saleSite,tempFileName){
        return commonReturnPromise({
            url: `/lms/amazonProdExtraInfo/getValidValuesBySalesSiteAndTempFileName`,
            type: 'GET',
            params:{ salesSite: saleSite,tempFileName:tempFileName },
        })
    }

    // 修改保存接口
    function getProdCateAttrExtraInfo(obj){
        return commonReturnPromise({
            url: `/lms/amazonProdExtraInfo/setProdCateAttrExtraInfo`,
            type: 'POST',
            params: JSON.stringify(obj),
            contentType:"application/json"
        })
    }

    // 属性设置
    $("#amazonProdEtraInfoTableDiv .propertySetting").click(function(){
        let flag = false;
        layer.open({
            type: 1,
            title: "修改属性设置",
            area: ["70%", "90%"],
            btn: ["保存", "关闭"],
            content: $("#amazonEtraInfoPropertySetting").html(),
            id:"_amazonEtraInfoPropertySetting",
            success: function (layero, index) {
                getSaleSite().then(res=>{
                    let html = `<option></option>`
                    res.amzonSiteList.forEach(item =>{
                        html += `<option value="${item.siteId}">${item.siteName}</option>`
                    })
                    $("#amazonEtraInfoPropertySettingForm select[name=salesSite]").html(html)
                    form.render()
                })

            },
            yes: function () {
                let trObj = $('#amazonExtraInfoPropertySettingTable').next().find('.layui-table-body tbody').find('tr');
                if(trObj.length <= 0){
                    return layer.alert("请查询后再修改",{icon:2})
                }

                let obj = {
                    "salesSite":  $("input[name=amazonExtraInfoSalesSite]").val(),
                    "tempFileName":  $("input[name=amazonExtraInfoTempFileName]").val(),
                    "feedProductType":  $("input[name=amazonExtraInfoFeedProductType]").val(),
                    "tempFileNameFixedValueMap": {}, // 大类目固定值
                    "feedProductTypeValidValuesMap": {}, // 产品类型下拉多选值映射
                    "feedProductTypeFixedValueMap": {},// 小类目固定值
                    "feedProductTypeRequiredMap": {}, //产品类型必填值映射
                    "feedProductTypeShowStatusMap": {
                        "lifestyle3": false
                    }
                };
                for (let i = 0; i < trObj.length; i++) {
                    let fieldName = trObj.eq(i).find('td[data-field="fieldName"]').find("div").text()
                    obj.tempFileNameFixedValueMap[`${fieldName}`] = trObj.eq(i).find("input[name=tempFileNameFixedValue]").val() // 大类目固定值
                    obj.feedProductTypeFixedValueMap[`${fieldName}`] = trObj.eq(i).find("input[name=feedProductTypeFixedValue]").val() // 小类目固定值
                    obj.feedProductTypeValidValuesMap[`${fieldName}`] = trObj.eq(i).find("textarea[name=validValues]").val() // 产品类型下拉多选值映射
                    obj.feedProductTypeRequiredMap[`${fieldName}`] = trObj.eq(i).find('.layui-form-checkbox').hasClass("layui-form-checked"); //产品类型必填值映射
                    if(obj.feedProductTypeRequiredMap[`${fieldName}`] == true && flag == false){
                        flag = true
                    }
                }

                if(!flag){
                    layer.alert("必填项至少选择一个",{icon:2})
                    return false
                }

                getProdCateAttrExtraInfo(obj).then(res=>{
                    // layer.closeAll()
                    layer.alert(res,{icon:1})
                })

                // return;
            },
        });
    })

    // 类目模板维护
    $("#amazonProdEtraInfoTableDiv .attrSetting").click(function(){
        let flag = false;
        layer.open({
            type: 1,
            title: "导入文件",
            area: ["70%", "70%"],
            btn: ["关闭"],
            content: $("#amazonEtraInfoAttrSetting").html(),
            id:"_amazonEtraInfoAttrSetting",
            success: function (layero, index) {
                getSaleSite().then(res=>{
                    let html = `<option></option>`
                    res.amzonSiteList.forEach(item =>{
                        html += `<option value="${item.siteId}">${item.siteName}</option>`
                    })
                    $("#amazonEtraInfoAttrSettingForm select[name=salesSite]").html(html)
                    form.render()
                })

                //演示多文件列表
                var uploadListIns = upload.render({
                    elem: '#amazonEIList'
                    ,elemList: $('#amazonEIDemoList') //列表元素对象
                    ,url: ctx + '/amazonCateAttr/updateBigCateByExcel.html'
                    ,accept: 'file'
                    ,data: {
                        salesSite: ''
                    }
                    ,multiple: true
                    // ,number: 3
                    ,auto: false
                    ,bindAction: '#amazonEIListAction'
                    ,choose: function(obj){
                        var that = this;
                        var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //读取本地文件
                        obj.preview(function(index, file, result){
                            var tr = $(['<tr id="upload-'+ index +'">'
                                ,'<td>'+ file.name +'</td>'
                                ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                                ,'<td>未上传</td>'
                                ,'<td>'
                                ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                                ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                                ,'</td>'
                                ,'</tr>'].join(''));

                            //单个重传
                            tr.find('.demo-reload').on('click', function(){
                                obj.upload(index, file);
                            });

                            //删除
                            tr.find('.demo-delete').on('click', function(){
                                delete files[index]; //删除对应的文件
                                tr.remove();
                                uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                            });

                            that.elemList.append(tr);
                            // element.render('progress'); //渲染新加的进度条组件
                        });
                    }
                    ,before: function(obj){
                        if(this.data.salesSite == ''&&$(layero).find("select[name=salesSite]").val() == ''){
                            layer.msg("请选择站点")
                            return false;
                        }else{
                            loading.show();
                            this.data.salesSite = $(layero).find("select[name=salesSite]").val()
                        }
                    }
                    ,done: function(res, index, upload){ //成功的回调
                        var that = this;
                        var tr = that.elemList.find('tr#upload-'+ index)
                            ,tds = tr.children();

                        if(res.code == "0000"){ //上传成功
                            // tds.eq(3).html(''); //清空操作
                            tds.eq(2).html(JSON.stringify(res.data)); //清空操作
                        }
                        // delete this.files[index]; //删除文件队列已经上传成功的文件
                        return;
                        // this.error(index, upload);
                    }
                    ,allDone: function(obj){ //多文件上传完毕后的状态回调
                        loading.hide();
                    }
                    // ,error: function(index, upload){ //错误回调
                    //     var that = this;
                    //     var tr = that.elemList.find('tr#upload-'+ index)
                    //         ,tds = tr.children();
                    //     tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
                    // }
                });
            },
        });
    })

    // 监听站点改变
    form.on("select(amazonEtraInfoSalesSite)",function (data) {
        // 清空模板名称和产品类型
        $("#amazonEtraInfoPropertySettingForm select[name=tempFileName]").val('')
        $("#amazonEtraInfoPropertySettingForm select[name=feedProductType]").val('')
        if(data.value != ''){
            getListTempFileName(data.value).then(res=>{
                let html = `<option></option>`
                res.forEach(item =>{
                    html += `<option value="${item.name}">${item.name}</option>`
                })
                $("#amazonEtraInfoPropertySettingForm select[name=tempFileName]").html(html)
                form.render()
            })
        }
    })

    // 监听模板名称改变
    form.on("select(amazonEtraInfoTempFileName)",function (data) {
        $("#amazonEtraInfoPropertySettingForm select[name=feedProductType]").val('')
        let saleSite = $("#amazonEtraInfoPropertySettingForm select[name=salesSite]").val();
        if(data.value != '' && saleSite != ''){
            getListTempFileType(saleSite,data.value).then(res=>{
                let html = `<option></option>`
                res.forEach(item =>{
                    html += `<option value="${item}">${item}</option>`
                })
                $("#amazonEtraInfoPropertySettingForm select[name=feedProductType]").html(html)
                form.render()
            })
        }
    })

    // 校验表单数据不为空
    function isObject(form){
        let flag = true
        for(let key in form){
            if(!form[key]){
                return false
            }
        }
        return flag
    }

    // 一键清除必填项
    $(document).on("click","#amazonEtraInfoLayerDeleteRequired",function(){
        let trObj = $('#amazonExtraInfoPropertySettingTable').next().find('.layui-table-body tbody').find('tr');

        for (let i = 0; i < trObj.length; i++) {
            let checked = trObj.eq(i).find('.layui-form-checkbox').hasClass("layui-form-checked")
            if(checked == true){
                trObj.eq(i).find('.layui-form-checkbox').click()
            }
        }
    })

    $(document).on("click","#amazonEtraInfoLayerFormSearch",function(){
        let data = serializeObject($("#amazonEtraInfoPropertySettingForm"))
        $("input[name=amazonExtraInfoSalesSite]").val(data.salesSite)
        $("input[name=amazonExtraInfoTempFileName]").val(data.tempFileName)
        $("input[name=amazonExtraInfoFeedProductType]").val(data.feedProductType)

        if (!isObject(data)) {
            return layer.alert("站点，模板名称，产品类型不能为空",{icon:2})
        }

        table.render({
            elem: "#amazonExtraInfoPropertySettingTable",
            method: "get",
            url: ctx + "/amazonProdExtraInfo/listProdCateAttrBySalesSiteAndTempFileNameAndFeedProductType",
            where: data,
            cols: [
                [
                    {field: "fieldName",width:150, title: "属性名称"},
                    {field: "tempFileNameFixedValue",width:150, title: "类目固定值",templet: function(d){
                            return `<input type="text" class="layui-input" name="tempFileNameFixedValue" value="${d.tempFileNameFixedValue||''}">`
                     }},
                    {field: "feedProductTypeFixedValue",width:150, title: "产品类型固定值",templet: function(d){
                            return `<input type="text" class="layui-input" name="feedProductTypeFixedValue" value="${d.feedProductTypeFixedValue||''}">`
                     }},
                    {field: "required", title: "是否必填",width:80,templet: function(d){
                            return `<input type="checkbox" name="required" lay-skin="primary" ${d.required == true?"checked":''}>`
                     }},
                    {field: "validValues", title: "下拉多选值(使用 #,# 拼接)",templet: function(d){
                            return `<textarea style="margin: 10px;" class="layui-textarea" name="validValues">${d.validValues||''}</textarea>`
                     }},
                ],
            ]
        });
    })

    //绑定更改事件
    form.on('select(amazonProdExtraInfo_showHideVagueFlag)', function (data) {
        if ("pSkus" == data.value
            || "sSkus" == data.value) {
            $("#amazonProdEtraInfo #amazonExtraInfo_skuVagueFlag_div").removeClass("disN");
        } else {
            $("#amazonProdEtraInfo #amazonExtraInfo_skuVagueFlag_div").addClass("disN");
        }
    });

    table.render({
        elem: "#amazonProdEtraInfoTable",
        method: "post",
        url: ctx + "/amazonProdExtraInfo/queryPage.html",
        where: getAmazonProdExtraInfoSearchInfo(),
        cols: [
            [
                //标题栏
                {field: "prodPId", type: "checkbox"},
                {field: "enTitle", title: "标题"},
                {field: "bizzOwner", title: "开发专员"},
                {field: "pSku", title: "父SKU"},
                {field: "tempFileName", title: "模板名称"},
                {field: "feedProductType", title: "产品类型"},
                // {field: "cateId", title: "类目id(要隐藏)"},
                // {field: "tempFileName", title: "模板文件(要隐藏)"},
                {templet: "#amazonExtraInfo_platTortTpl", title: "侵权状态"},
                {field: "devNote", title: "开发备注"},
                {templet: "#amazonExtraInfo_kvTpl", title: "亚马逊属性"},
                //绑定工具条
                {
                    title: "操作",
                    align: "center",
                    toolbar: "#amazonProdEtraInfoEditBar",
                },
            ],
        ],
        id: "amazonProdEtraInfoTable",
        page: true,
        limits: [10, 50, 100, 200],
        limit: 50
    });

    //搜索
    $("#amazonProdEtraInfo_search").click(function () {
        //执行重载
        table.reload("amazonProdEtraInfoTable", {
            where: getAmazonProdExtraInfoSearchInfo(),
        });
    });

    function getAllAttrList(data) {
        $.ajax({
            type: "POST",
            url: ctx + "/amazonProdExtraInfo/listAllAttr.html",
            data: {
                salesSite: data.salesSite,
                tempFileName: data.tempFileName,
                prodPId: data.prodPId,
                cateId: data.cateId
            },
            async: false,
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var attrList = returnData.data;
                    var attrVal="";
                    var inputSelTpl='<div class="layui-form-item" lay-tips=":definition">' +
                        '<label class="layui-form-label">:reqRedFlag:fieldLabel</label>' +
                        '<div class="layui-input-inline">' +
                        '<input type="text" class="layui-input" name=":fieldName" list=":fieldName_CC_List" value=":attrValue" :required>' +
                        '<datalist id=":fieldName_CC_List">' +
                        ':optionList' +
                        '</datalist>' +
                        '</div>' +
                        '</div>';

                    // var selectTpl =
                    //     '<div class="layui-form-item">'
                    //     + '<label class="layui-form-label">:fieldName</label>'
                    //     + '<div class="layui-input-inline">'
                    //     + '    <select name=":fieldName" :required>'
                    //     + ':optionList'
                    //     + '    </select>'
                    //     + '</div>'
                    //     + '</div>';
                    //TEXT_FILED
                    var inputTpl =
                        '<div class="layui-form-item" lay-tips=":definition">'
                        + '<label class="layui-form-label">:reqRedFlag:fieldLabel</label>'
                        + '<div class="layui-input-block">'
                        + '  <input name=":fieldName" type="text" value=":attrValue" class="layui-input" :required>'
                        + '</div>'
                        + '</div>';
                    for (var i = 0; i < attrList.length; i++) {
                        //针对item_sku属性不做展示
                        // if(attrList[i].salesSite == "GB"){
                        //     if(attrList[i].status==false){
                        //         continue;
                        //     }
                        // }else{
                        if(attrList[i].fieldName=='item_sku'
                            ||attrList[i].fieldName=='external_product_id'
                            ||attrList[i].fieldName=='feed_product_type'
                            ||attrList[i].fieldName=='external_product_id_type'
                            ||attrList[i].fieldName=='item_name'
                            ||attrList[i].fieldName=='brand_name'
                            ||attrList[i].fieldName=='manufacturer'
                            ||attrList[i].fieldName=='part_number'
                            ||attrList[i].fieldName=='standard_price'
                            ||attrList[i].fieldName=='item_type'

                            ||attrList[i].fieldName=='standard_price'
                            ||attrList[i].fieldName=='quantity'
                            ||attrList[i].fieldName=='main_image_url'
                            ||attrList[i].fieldName=='is_adult_product'
                            ||attrList[i].status==false

                        ){
                            continue;
                        }
                        // }

                        var dom = ""; //展示元素
                        if(attrList[i].validValues){
                            dom = inputSelTpl;
                            dom = dom.replace(/:fieldName/g,attrList[i].fieldName);
                            dom = dom.replace(/:definition/g,attrList[i].definition);
                            // dom = dom.replace(/:fieldLabel/g,attrList[i].localLabelName);
                            dom = dom.replace(/:fieldLabel/g,attrList[i].fieldName);
                            if(attrList[i].required) {
                                dom = dom.replace(/:required/g, "required lay-verify=\"required\"");
                                dom = dom.replace(/:reqRedFlag/g, "<font color='red'>*</font>");

                            }else{
                                dom = dom.replace(/:required/g, "");
                                dom = dom.replace(/:reqRedFlag/g, "");
                            }
                            var optionList = '<option value="">请选择</option>';
                            var selAttrVal=attrList[i].attrVal;
                            var inputAttrVal=attrList[i].attrVal
                            if (inputAttrVal) {
                                dom = dom.replace(/:attrValue/g, inputAttrVal);
                            } else {
                                dom = dom.replace(/:attrValue/g, "");
                            }
                            attrList[i].validValues.split("#,#").forEach(function (attrVal) {
                                if (selAttrVal&&attrVal == selAttrVal) {
                                    optionList += '<option selected value="' + attrVal + '">' + attrVal + '</option>';
                                } else {
                                    optionList += '<option  value="' + attrVal + '">' + attrVal + '</option>';
                                }
                            });
                            dom = dom.replace(":optionList", optionList);
                        }else {//input
                            dom = inputTpl;
                            dom = dom.replace(/:fieldName/g,attrList[i].fieldName);
                            dom = dom.replace(/:definition/g,attrList[i].definition);
                            // dom = dom.replace(/:fieldLabel/g,attrList[i].localLabelName);
                            dom = dom.replace(/:fieldLabel/g,attrList[i].fieldName);
                            if (attrList[i].required) {
                                dom = dom.replace(/:required/g, "required lay-verify=\"required\"");
                                dom = dom.replace(/:reqRedFlag/g, "<font color='red'>*</font>");
                            } else {
                                dom = dom.replace(/:required/g, "");
                                dom = dom.replace(/:reqRedFlag/g, "");
                            }

                            var inputAttrVal=attrList[i].attrVal;
                            if (inputAttrVal) {
                                dom = dom.replace(/:attrValue/g, inputAttrVal);
                            } else {
                                dom = dom.replace(/:attrValue/g, "");
                            }
                        }
                        $("#amazonProdEtraInfoEdit_Form .layui-card-body").append(dom);
                    }
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

    table.on("tool(amazonProdEtraInfoTable)", function (obj) {
        console.log(123);
        var data = obj.data, //获得当前行数据
            layEvent = obj.event;

        if(!data.tempFileName){
            layer.alert("请先填写商品所属类目的映射信息,类目:"+data.cateTreeName,{icon: 5});
            return;
        }

        if (layEvent === "edit") {
            layer.open({
                type: 1,
                title: "编辑amazon商品扩展信息",
                area: ["1000px", "90%"],
                btn: ["保存", "关闭"],
                content: $("#amazonProdEtraInfoEdit_Layer").html(),
                success: function (layero, index) {
                    //设置默认传值(站点 父商品id)
                    $("#amazonProdEtraInfoEdit_Form input[name=prodPId]").val(data.prodPId);
                    $("#amazonProdEtraInfoEdit_Form input[name=salesSite]").val(data.salesSite);
                    //按站点获取获取当前站点的文件列表
                    getAllAttrList(data);
                    //TODO 回显结果
                    // $("#amazonProdEtraInfoEdit_Form input[name=id]").val(data.id);

                    form.render("select");
                    form.render("radio");
                    form.render("checkbox")
                },
                end: function () {

                },
                yes: function () {
                    $("#updateAmazonExtraInfo").trigger("click");
                    return;
                },
            });
        }
    });
    //layui我提交的是这行的修改数据,然而却无法把这行的数据传过去,只能设置隐藏对象
    form.on("submit(updateAmazonExtraInfo)", function (obj) {
        //获取有值的属性列表,需要包含站点,类目文件,父商品id
        var req={};
        req.salesSite=$("#amazonProdEtraInfoEdit_Form input[name=salesSite]").val();
        req.prodPId=$("#amazonProdEtraInfoEdit_Form input[name=prodPId]").val();
        obj.field['salesSite']='';
        obj.field['prodPId']='';
        req.attrKeyVal= getAttrKeyVal(obj.field);
        $.ajax({
            type: "POST",
            url: ctx + "/amazonProdExtraInfo/saveUpdate.html",
            dataType: "json",
            data: req,
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg("保存成功");
                    $("#amazonProdEtraInfo_search").trigger("click");
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
});

function getAttrKeyVal(fileds) {
    var keyValStr="";
    Object.keys(fileds).forEach(function(key){
        if(fileds[key]){
            if(keyValStr){
                keyValStr=keyValStr+"#,#"+key+":"+fileds[key]
            }else{
                keyValStr=key+":"+fileds[key];
            }
        }
    });
    return keyValStr;
}

function getAmazonProdExtraInfoSearchInfo() {
    var data = new Object();
    data.cateId = $("#amazonProdEtraInfo_SearchForm input[name=cateId]").val();
    //产品归属人
    // data.bizzOwnerId = $("#amazonProdEtraInfo_SearchForm select[name=bizzOwner]").val();
    let bizzOwnerId = layui.formSelects.value("amazonExtraInfo_bizzOwner").map(item => item.value);
    data.bizzOwnerId = bizzOwnerId.join(",");

    data.haveExtraflag = $("#amazonProdEtraInfo_SearchForm select[name=haveExtraflag]").val();
    data.salesSite = $("#amazonProdEtraInfo_SearchForm select[name=salesSite]").val();

    //侵权状态
    data.tortBanListing = $("#amazonProdEtraInfo_SearchForm select[name=tortBanListing]").val();

    //日期
    var timeStr = $("#amazonProdEtraInfo_SearchForm input[name=time]").val();
    if (timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#amazonProdEtraInfo_SearchForm select[name=timeType]").val();
    data.isSale = $("#amazonProdEtraInfo_SearchForm select[name=isSale]").val();
    data.cnTitle = "";
    data.enTitle = "";
    data.pSkus = [];
    data.sSkus = [];
    data.skuVagueFlag = $("#amazonProdEtraInfo_SearchForm select[name=skuVagueFlag]").val()
    if ("cnTitle" == $("#amazonProdEtraInfo_SearchForm select[name=searchType]").val()) {
        data.cnTitle = ($("#amazonProdEtraInfo_SearchForm input[name=searchText]").val());
    }
    if ("enTitle" == $("#amazonProdEtraInfo_SearchForm select[name=searchType]").val()) {
        data.enTitle = ($("#amazonProdEtraInfo_SearchForm input[name=searchText]").val());
    }
    if ("pSkus" == $("#amazonProdEtraInfo_SearchForm select[name=searchType]").val()) {
        var pSkustmp = $("#amazonProdEtraInfo_SearchForm input[name=searchText]").val()
        if (pSkustmp.length > 0) {
            pSkustmp = pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    data.pSkus = data.pSkus.join(",");
    if ("sSkus" == $("#amazonProdEtraInfo_SearchForm select[name=searchType]").val()) {
        var sSkustmp = $("#amazonProdEtraInfo_SearchForm input[name=searchText]").val();
        if (sSkustmp.length > 0) {
            sSkustmp = sSkustmp.split(",");
        }
        if (sSkustmp.length > 0) {
            for (i = 0; i < sSkustmp.length; i++) {
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    data.sSkus = data.sSkus.join(",");
    return data;
}

