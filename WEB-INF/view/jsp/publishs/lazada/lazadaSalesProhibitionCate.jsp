<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>禁售类目维护</title>
<style>
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }
</style>
<div class="layui-fluid" id="lazadaSalesProhibitionCate">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lazadaSalesProCate_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="salesSites" id="lazadaSalesProCate_site"
                                            xm-select="lazadaSalesProCate_site"
                                            xm-select-search xm-select-search-type="dl"
                                            xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <div class="layui-form-label labelSel" style="width:140px;">
                                    <select id="lazadaSalesProCate_siteSingle" lay-filter="lazadaSalesProCate_siteSingle">
                                    </select>
                                </div>
                                <div class="layui-input-block" style="margin-left:170px">
                                    <input class="layui-input" id="lazadaSalesProhibit_lazadaCates" />
<%--                                    <button id="lazadaSalesProCate_cate_select_btn" type="button"--%>
<%--                                            class="layui-btn layui-btn-sm layui-btn-primary">选择分类--%>
<%--                                    </button>--%>
<%--                                    <i class="layui-icon layui-icon-delete"--%>
<%--                                       onclick="clearCateAndOtherElementArray('lazadaSalesProCate_category_text','lazadaSalesProCate_category_Id' ,'lazadaSalesProCate_category_cate_site_id')"--%>
<%--                                       style="cursor:pointer" title="删除产品类目"></i>--%>
<%--                                    <input id="lazadaSalesProCate_category_Id" type="hidden" name="categoryId">--%>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <select name="creators" id="lazadaSalesProCate_creatorId"
                                            xm-select="lazadaSalesProCate_creatorId" xm-select-search
                                            xm-select-search-type="dl"
                                            xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <div class="layui-input-block">
                                    <button id="lazadaSalesProCate_searchBtn" class="layui-btn layui-btn-sm"
                                            type="button">查询
                                    </button>
                                    <button id="lazadaSalesProCate_resetBtn"
                                            class="layui-btn layui-btn-primary layui-btn-sm"
                                            type="reset">清空
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="lazadaSalesProCate_category_text"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <%--<permTag:perm funcCode="lazada_rules_list_edit">--%>
                    <%--<a class="layui-btn" id="lazadarules_btn_addrules">添加规则</a>--%>
                    <%--</permTag:perm>--%>
                    <div class="dis_flex">
                        <div>
                            <permTag:perm funcCode="lazada_deleteSalesProhibitionCate">
                                <a class="layui-btn layui-btn-sm" id="lazadaSalesProCate_batchDeleteBtn">批量删除</a>
                            </permTag:perm>
                        </div>
                        <div>
                            <div class="layui-input-inline w100 layui-form">
                                <select id="lazadaSalesP_export" lay-filter="lazadaSalesP_export">
                                    <option value="" disabled selected>导出</option>
                                    <option value="1">按查询条件导出</option>
                                    <option value="2">按选中商品导出</option>
                                </select>
                            </div>
                            <a class="layui-btn layui-btn-sm layui-btn-normal"
                               id="lazadaSalesProCate_uploadBtn">下载模板</a>
                            <permTag:perm funcCode="lazada_importSalesProhibitionCate">
                                <a class="layui-btn layui-btn-sm" id="lazadaSalesProCate_importBtn">新增导入</a>
                            </permTag:perm>
                            <a class="layui-btn layui-btn-sm" id="lazadaSalesProCate_whiteListBtn">白名单管理</a>
                            <input hidden type="file" id="lazadaSalesProCate_importFile"/>
                        </div>
                    </div>
                    <table class="layui-table" id="lazadaSalesProCate_table"
                           lay-filter="lazadaSalesProCate_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    let lazadaSalesP_page = 1;
    layui.use(["admin", "form", "formSelects", "table", "layer", "laytpl", "element","laypage",'layCascader'], function () {
        var admin = layui.admin,
            form = layui.form,
            formSelects = layui.formSelects,
            table = layui.table,
            layer = layui.layer,
            laytpl = layui.laytpl,
            element = layui.element,
            laypage = layui.laypage,
            layCascader = layui.layCascader,
            $ = layui.$;

    let lazadaSalesProhibitlazadaCates = layCascader({
        elem: "#lazadaSalesProhibit_lazadaCates",
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

    $("#lazadaSalesProCate_resetBtn").click(function(){
        lazadaSalesProhibitlazadaCates.setValue(null)
    })

    form.on('select(lazadaSalesProCate_siteSingle)', function(data){
        if(data.value == ''){
            lazadaSalesProhibitlazadaCates.setOptions([])
        }else{
            getlazadaCategoryAttr(data.value,'lazadaSalesProhibitlazadaCates')
        }
    })

    let lazadaWhiteListlazadaCates;

    form.on('select(lazadawhiteListLayer_siteSingle)', function(data){
        if(data.value == ''){
            lazadaWhiteListlazadaCates.setOptions([])
        }else{
            getlazadaCategoryAttr(data.value,'lazadaWhiteListlazadaCates')
        }
    })

    function getlazadaCategoryAttr(siteCode,type){
        commonReturnPromise({
            url: "/lms/lazada/getLazadaCategoryTree?site=" + siteCode,
        }).then((res)=>{
            if(type == "lazadaSalesProhibitlazadaCates"){
                lazadaSalesProhibitlazadaCates.setOptions(res)
            }else if(type == "lazadaWhiteListlazadaCates"){
                lazadaWhiteListlazadaCates.setOptions(res)
            }
        })
    }



        // lazada禁售类目新增导出功能
        form.on('select(lazadaSalesP_export)', function(data) {
            var exportType = data.value;
            if (1 == exportType) { // 查询条件
                let formData = serializeObject($('#lazadaSalesProCate_searchForm'))
<%--                formData.categoryId = JSON.parse($('#lazadaSalesProhibit_lazadaCates').val() || '[]').join(",");//平台类目ID--%>
<%--                if (formData.categoryId != '') {--%>
<%--                    formData.salesSites = $("#lazadaSalesProCate_siteSingle").val()--%>
<%--                }--%>
                    var node = lazadaSalesProhibitlazadaCates.getCheckedNodes();
                    let labels = [];
                    node.forEach(item => {
                    let labelArr = item.path.map(i=>i.label)
                        labels.push(labelArr.join("->"))
                    })
                    formData.categoryNames = labels.join(",")
                // 删除值为空的字段，否则后端接口报错服务器异常
                for (var key in formData) {
                    if (formData[key] == '') {
                        delete formData [key]
                    }
                }
                formData.page = lazadaSalesP_page;
                formData.limit = 50;
                if(formData.creators != ''&&formData.creators != undefined){
                    formData.creators = formData.creators.split(",")
                }
                if(formData.salesSites != ''&&formData.salesSites != undefined){
                    formData.salesSites = formData.salesSites.split(",")
                }
                if(formData.categoryNames != ''&&formData.categoryNames != undefined){
                    formData.categoryNames = formData.categoryNames.split(",")
                }
                transBlob({
                    url: ctx + `/LazadaProhibitManage/export`,
                    formData: JSON.stringify(formData),
                    fileName: `禁售类目`,
                    contentType: 'application/json'
                }).then(function (result) {
                    loading.hide();
                }).catch(function (err) {
                    layer.msg(err, { icon: 2 });
                });
            }
            if (2 == exportType) { // 选中商品
                let checkData = table.checkStatus('lazadaSalesProCate_table').data; //获取选中的数据
                if (checkData.length == 0) {
                    return layer.msg("请选择需要导出的数据")
                }
                transBlob({
                    url: ctx + `/LazadaProhibitManage/export`,
                    formData: JSON.stringify({
                        "ids":checkData.map(item=>item.id)
                    }),
                    fileName: `禁售类目`,
                    contentType: 'application/json'
                }).then(function (result) {
                    loading.hide();
                }).catch(function (err) {
                    layer.msg(err, { icon: 2 });
                });

            }
        })

        let lazadaSalesProCate_siteData = [], lazadaSalesProCate_creatorIdData = [];
        // 初始化lazada站点
        commonReturnPromise({
            url: ctx + `/onlineProductLazada/getAllSite.html`,
            type: 'get'
        }).then(res => {
            lazadaSalesProCate_siteData = res;
            // 站点多选
            commonRenderSelect("lazadaSalesProCate_site", res, {
                name: 'name',
                code: 'code'
            })
            // 类目站点单选
            commonRenderSelect("lazadaSalesProCate_siteSingle", res, {
                name: 'name',
                code: 'code'
            })
            formSelects.render("lazadaSalesProCate_site")
            form.render("select");
        })

        // 初始化禁售类目创建人
        AllUser().then(result => {
            commonRenderSelect('lazadaSalesProCate_creatorId', result.filter(n => n), {
                name: 'userName',
                code: 'id'
            })
            formSelects.render("lazadaSalesProCate_creatorId")
        })

        // 初始化白名单创建人
        WhitelistManageAllUser().then(result => {
            lazadaSalesProCate_creatorIdData = result;
        })

<%--        // 平台类目查询--%>
<%--        $('#lazadaSalesProCate_cate_select_btn').click(function () {--%>
<%--            var siteCode = $("#lazadaSalesProCate_siteSingle").val();//站点id--%>
<%--            if (siteCode != null && siteCode != "") {--%>
<%--                admin.itemCat_select('lazadaSalesProCate_category_select_event',--%>
<%--                    'lazadaSalesProCate_category_Id',--%>
<%--                    'lazadaSalesProCate_category_text',--%>
<%--                    "/lazada/getLazadaCateList.html?siteId=" + siteCode,--%>
<%--                    "/lazada/searchLazadaCate.html?siteId=" + siteCode--%>
<%--                );--%>
<%--                //设置当前站点的值--%>
<%--                $("#lazadaSalesProCate_category_cate_site_id").val(siteCode);--%>
<%--            } else {--%>
<%--                layer.msg("必须选择站点");--%>
<%--            }--%>
<%--        });--%>

<%--        // 平台类目查询--%>
<%--        $(document).on("click", "#lazadawhiteListLayer_cate_select_btn", function () {--%>
<%--            var siteCode = $("#lazadawhiteListLayer_siteSingle").val();//站点id--%>
<%--            if (siteCode != null && siteCode != "") {--%>
<%--                admin.itemCat_select('lazadawhiteListLayer_category_select_event',--%>
<%--                    'lazadawhiteListLayer_category_Id',--%>
<%--                    'lazadawhiteListLayer_category_text',--%>
<%--                    "/lazada/getLazadaCateList.html?siteId=" + siteCode,--%>
<%--                    "/lazada/searchLazadaCate.html?siteId=" + siteCode--%>
<%--                );--%>
<%--                //设置当前站点的值--%>
<%--                $("#lazadawhiteListLayer_category_cate_site_id").val(siteCode);--%>
<%--            } else {--%>
<%--                layer.msg("必须选择站点");--%>
<%--            }--%>
<%--        });--%>

        // 搜索
        $("#lazadaSalesProCate_searchBtn").click(function () {
            let formData = serializeObject($('#lazadaSalesProCate_searchForm'))
<%--            formData.categoryId = JSON.parse($('#lazadaSalesProhibit_lazadaCates').val() || '[]').join(",");//平台类目ID--%>
<%--            if (formData.categoryId != '') {--%>
<%--                formData.salesSites = $("#lazadaSalesProCate_siteSingle").val()--%>
<%--            }--%>
            var node = lazadaSalesProhibitlazadaCates.getCheckedNodes();
            let labels = [];
            node.forEach(item => {
                let labelArr = item.path.map(i=>i.label)
                labels.push(labelArr.join("->"))
            })
            formData.categoryNames = labels.join(",")

            // 删除值为空的字段，否则后端接口报错服务器异常
            for (var key in formData) {
                if (formData[key] == '') {
                    delete formData [key]
                }
            }

            handleLazadaSalesProCateTable(formData)
        })

        // 渲染表格
        function handleLazadaSalesProCateTable(obj) {
            table.render({
                elem: "#lazadaSalesProCate_table",
                method: 'POST',
                where: obj,
                url: ctx + "/LazadaProhibitManage/searchBySalesSite", // 店铺列表接口
                cols: [
                    [{type: "checkbox", width: 25, style: "vertical-align: top;"}, {
                        field: "salesSite",
                        width: 100,
                        title: "站点"
                    }, {
                        field: "categoryId",
                        width: 200,
                        title: "禁售类目ID"
                    }, {
                        field: "fullCateName",
                        title: '禁售类目'
                    }, {
                        field: "remark",
                        width: 200,
                        title: '禁售规则', templet: '<div>{{d.remark == 0?"可申请白名单":(d.remark == 1?"完全禁售":"")}}</div>'
                    }, {
                        field: "createTime",
                        title: '创建时间',
                        width: 200,
                        templet: '<div>{{Format(new Date(d.createTime), "yyyy-MM-dd")}}</div>'
                    }, {
                        field: "creator",
                        width: 200,
                        title: '创建人'
                    }, {
                        title: '操作',
                        width: 200,
                        align: 'center',
                        toolbar: '#lazadaSalesProCateTable_option'
                    }
                    ]],
                id: "lazadaSalesProCate_table",
                page: true,
                limits: [50, 100, 150],
                limit: 50,
                done:function(res, curr, count){
                    lazadaSalesP_page = curr
                }
            });
        }

        //工具条事件
        table.on('tool(lazadaSalesProCate_table)', function (obj) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

            if (layEvent === 'delete') {
                layer.confirm('确定删除？', function (result) {
                    if (result) {
                        lazadaDelete(data.id).then(res => {
                            layer.msg(res)
                            $("#lazadaSalesProCate_searchBtn").click()
                        });
                    }
                })
            }
        })

        // 批量刪除
        $("#lazadaSalesProCate_batchDeleteBtn").click(function () {
            let checkData = table.checkStatus('lazadaSalesProCate_table').data; //获取选中的数据
            if (checkData.length == 0) {
                return layer.msg("请选择需要删除的数据")
            }

            let ids = checkData.map(item => item.id).join(",")
            layer.confirm('确定删除？', function (result) {
                if (result) {
                    lazadaDelete(ids).then(res => {
                        layer.msg(res)
                        $("#lazadaSalesProCate_searchBtn").click()
                    });
                }
            })
        })

        // 下载模板
        $("#lazadaSalesProCate_uploadBtn").click(function () {
            loading.show();
            transBlob({
                url: ctx + "/LazadaProhibitManage/getLazadaCateExcleTemplate",
                fileName: '导入模板.xlsx',
                contentType: 'application/json'
            }, "GET").then(function (result) {
                loading.hide();
            }).catch(function (err) {
                layer.msg(err, {icon: 2});
            });
        })

        // 新增导入
        $("#lazadaSalesProCate_importBtn").click(function () {
            // 先清空文件夹
            $('#lazadaSalesProCate_importFile').val('')
            $('#lazadaSalesProCate_importFile').click()
        })

        // 文件变化事件
        $('#lazadaSalesProCate_importFile').on('change', function () {
            lazada_importFileAjax()
        })

        function lazada_importFileAjax() {
            loading.show()
            var files = $('#lazadaSalesProCate_importFile')[0].files
            // 如果没有文件则终止
            if (files.length == 0) {
                return
            }
            var formData = new FormData();
            formData.append("file", files[0]);
            axios({
                method: 'post',
                url: ctx + '/LazadaProhibitManage/importLazadaProhibitExcel',
                data: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                responseType: 'blob'
            }).then((data) => { // 处理返回的文件流
                // console.log("jsondata===================>" + decodeURIComponent(data.headers.jsondata))
                let returnData = JSON.parse(decodeURIComponent(data.headers.jsondata))
                if (returnData.code == "0000" && returnData.msg == "部分数据存在问题") {
                    layer.alert(returnData.msg,{icon:7})
                    let blob = new Blob([data.data], { type: 'application/vnd.ms-excel' })
                    let url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a') // 创建a标签
                    link.href = url
                    link.download = '错误信息'+Date.now()+'.xlsx' // 重命名文件
                    link.click()
                    URL.revokeObjectURL(url);
                }else if (returnData.code == "0000"){
                    layer.msg(returnData.msg,{icon:1})
                }else {
                    layer.alert(returnData.msg,{icon:2})
                }
                loading.hide();
            })
        }

        // 白名单管理
        $("#lazadaSalesProCate_whiteListBtn").click(function () {
            let popIndex = layer.open({
                title: '白名单管理',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['50%', '70%'],
                btn: ['关闭'],
                id: 'lazadaSalesProCate_whiteListLayer',
                content: $('#lazadaSalesProCate_whiteListLayerCon').html(),
                success: function (layero) {
                    laytpl($('#lazadaSalesProCate_whiteListLayerDemo').html()).render({}, function (html) {
                        $('#lazadaSalesProCate_whiteListLayerView').html(html)

                        lazadaWhiteListlazadaCates = layCascader({
                            elem: "#lazadaWhiteList_lazadaCates",
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
                    })

                    $(layero).find("#lazadawhiteListLayer_resetBtn").click(function(){
                        lazadaWhiteListlazadaCates.setValue(null)
                    })
                    // 站点多选
                    commonRenderSelect("lazadawhiteListLayer_site", lazadaSalesProCate_siteData, {
                        name: 'name',
                        code: 'code'
                    })
                    // 类目站点单选
                    commonRenderSelect("lazadawhiteListLayer_siteSingle", lazadaSalesProCate_siteData, {
                        name: 'name',
                        code: 'code'
                    })
                    formSelects.render("lazadawhiteListLayer_site")
                    form.render("select");

                    // 店铺
                    listStoreForRenderHpStoreCommonComponent().then(function (result) {
                        commonRenderSelect("lazadawhiteListLayer_storeAcctId", result, {
                            name: 'storeAcct',
                            code: 'id'
                        }).then(() => formSelects.render('lazadawhiteListLayer_storeAcctId'))
                    }).catch(function (err) {
                        layer.msg(err, {icon: 2});
                    })

                    // 创建人
                    commonRenderSelect('lazadawhiteListLayer_creatorId', lazadaSalesProCate_creatorIdData.filter(n => n), {
                        name: 'userName',
                        code: 'id'
                    })
                    formSelects.render("lazadawhiteListLayer_creatorId")
                }
            })
        })

        let lazadaLayerLimits = "",lazadaLayerPage = "";
        // 搜索
        $(document).on("click", "#lazadawhiteListLayer_searchBtn", function () {
            handleLazadaSalesLayerTable(handleLazadaFormData())
        })

        function handleLazadaFormData(){
            let formData = serializeObject($('#lazadawhiteListLayer_searchForm'))
<%--            formData.categoryId = JSON.parse($('#lazadaWhiteList_lazadaCates').val() || '[]').join(",");//平台类目ID--%>
<%--            if (formData.categoryId != '') {--%>
<%--                formData.salesSites = $("#lazadawhiteListLayer_siteSingle").val()--%>
<%--            }--%>
                var node = lazadaWhiteListlazadaCates.getCheckedNodes();
                let labels = [];
                node.forEach(item => {
                let labelArr = item.path.map(i=>i.label)
                    labels.push(labelArr.join("->"))
                })
                formData.categoryNames = labels.join(",")

            // 删除值为空的字段，否则后端接口报错服务器异常
            for (var key in formData) {
                if (formData[key] == '') {
                    delete formData [key]
                }
            }

            return formData
        }

        // 渲染表格
        function handleLazadaSalesLayerTable(obj) {
            let lazadaSalesLayer_table = table.render({
                elem: "#lazadaSalesLayer_table",
                method: 'POST',
                where: obj,
                url: ctx + "/LazadaCateWhitelistManage/searchBySalesSite", // 店铺列表接口
                cols: [
                    [{
                        field: "salesSite",
                        width: 80,
                        title: '站点'
                    }, {
                        field: "categoryId",
                        width: 100,
                        title: "白名单类目ID"
                    }, {
                        field: "fullCateName",
                        title: '白名单类目'
                    }, {
                        field: "storeAcct",
                        title: '白名单店铺'
                    }, {
                        field: "creator",
                        width: 150,
                        title: '创建人'
                    }, {
                        field: "createTime",
                        title: '创建时间',
                        width: 150,
                        templet: '<div>{{Format(new Date(d.createTime), "yyyy-MM-dd")}}</div>'
                    }
                    ]],
                id: "lazadaSalesLayer_table",
                page: true,
                limits: [50, 100, 150],
                limit: 50,
                done: function(res, curr, count) {
                    lazadaLayerLimits = lazadaSalesLayer_table.config.limit
                    lazadaLayerPage = curr
                }
            });
        }

        form.on('select(lazadawhiteListLayer_select)', function (data) {
            if (data.value == "下载模板") {
                loading.show();
                transBlob({
                    url: ctx + "/LazadaCateWhitelistManage/LazadaCateWhitelistManageTemplate",
                    fileName: '白名单导入模板.xlsx',
                    contentType: 'application/json'
                }, "GET").then(function (result) {
                    loading.hide();
                }).catch(function (err) {
                    layer.msg(err, {icon: 2});
                });
            }
        });

        // 导出
        $(document).on("click", "#lazadawhiteListLayer_export", function () {
            loading.show();
            let lazadaExportFormData = handleLazadaFormData();
            lazadaExportFormData["page"] = lazadaLayerPage
            lazadaExportFormData["limit"] = lazadaLayerLimits
<%--            let str = ''--%>
<%--            // 删除值为空的字段，否则后端接口报错服务器异常--%>
<%--            for (var key in lazadaExportFormData) {--%>
<%--                if (lazadaExportFormData[key] != '') {--%>
<%--                    str += key + '=' + lazadaExportFormData[key] + '&';--%>
<%--                }--%>
<%--            }--%>

<%--            if(str == ''){--%>
<%--                return layer.alert("导出数据为空",{icon:7})--%>
<%--            }else{--%>
<%--                str = str.substring(0, str.lastIndexOf('&'))--%>
<%--            }--%>
            let formData = new FormData();
            for (var key in lazadaExportFormData) {
                formData.append(key, lazadaExportFormData[key]);
            }

            transBlob({
                url: ctx + `/LazadaCateWhitelistManage/getLazadaCateWhitelistExcle`,
                formData: formData,
<%--                contentType: 'application/json',--%>
                fileName: '白名单管理.xlsx'
            }).then(function (result) {
                loading.hide();
            }).catch(function (err) {
                layer.msg(err, {icon: 2});
            });
        })

        // 导入
        $(document).on("click", "#lazadawhiteListLayer_import", function () {
            let typeVal = $("select[name=lazadawhiteListLayer_select]").val();
            if(typeVal == "新增白名单"||typeVal == "删除白名单"||typeVal == "替换所有白名单"){
            // 先清空文件夹
            $('#lazadawhiteListLayer_importFile').val('')
            $('#lazadawhiteListLayer_importFile').click()
            }
        })

        // 文件变化事件
        // $("#lazadawhiteListLayer_importFile").change(function(){
        $(document).on("change", "#lazadawhiteListLayer_importFile", function () {
            lazadaLayer_importFileAjax()
        })

        function lazadaLayer_importFileAjax() {
            loading.show()
            var files = $('#lazadawhiteListLayer_importFile')[0].files,
                typeVal = $("select[name=lazadawhiteListLayer_select]").val(), type = '';

            // 如果没有文件则终止
            if (files.length == 0) {
                return
            }
            // 0新增 1删除 2 全部替换

            if (typeVal == "新增白名单") {
                type = 0
            } else if (typeVal == "删除白名单") {
                type = 1
            }else if (typeVal == "替换所有白名单") {
                type = 2
            }
            var formData = new FormData();
            formData.append("file", files[0]);
            axios({
                method: 'post',
                url: ctx + '/LazadaCateWhitelistManage/importLazadaCateWhitelistExcel?type=' + type,
                data: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                responseType: 'blob'
            }).then((data) => { // 处理返回的文件流
                // console.log("jsondata===================>" + decodeURIComponent(data.headers.jsondata))
                let returnData = JSON.parse(decodeURIComponent(data.headers.jsondata))
                if (returnData.code == "0001" && returnData.msg == "部分数据存在问题") {
                    layer.alert(returnData.msg,{icon:7})
                    let blob = new Blob([data.data], { type: 'application/vnd.ms-excel' })
                    let url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a') // 创建a标签
                    link.href = url
                    link.download = '白名单错误信息'+Date.now()+'.xlsx' // 重命名文件
                    link.click()
                    URL.revokeObjectURL(url);
                }else if (returnData.code == "0000"){
                    layer.msg(returnData.msg,{icon:1})
                }else {
                    layer.alert(returnData.msg,{icon:2})
                }
                loading.hide();
            })
        }

        // 获取lazada店铺
        function listStoreForRenderHpStoreCommonComponent() {
            return commonReturnPromise({
                url: `/lms/LazadaCateWhitelistManage/AllStoreAcctAndId`,
                type: 'GET'
            })
        }

        // 按id删除禁售类目
        function lazadaDelete(ids) {
            return commonReturnPromise({
                url: ctx + `/LazadaProhibitManage/delete?ids=` + ids,
                type: 'DELETE'
            })
        }

        // 获取禁售类目所有用户
        function AllUser() {
            return commonReturnPromise({
                url: ctx + `/LazadaProhibitManage/AllUser`,
                type: 'GET'
            })
        }


<%--        // 按参数导出白名单类目--%>
<%--        function getLazadaCateWhitelistExcle() {--%>
<%--            return commonReturnPromise({--%>
<%--                url: ctx + `/LazadaCateWhitelistManage/getLazadaCateWhitelistExcle`,--%>
<%--                type: 'GET'--%>
<%--            })--%>
<%--        }--%>

        // 白名单类目Excle导入以及更新和删除
        function importLazadaCateWhitelistExcel(type) {
            return commonReturnPromise({
                url: ctx + `/LazadaCateWhitelistManage/importLazadaCateWhitelistExcel?type` + type,
                type: 'POST'
            })
        }

        // 查询所有白名单用户
        function WhitelistManageAllUser() {
            return commonReturnPromise({
                url: ctx + `/LazadaCateWhitelistManage/AllUser`,
                type: 'GET'
            })
        }

    })
</script>

<!-- 表格操作按钮 -->
<script type="text/html" id="lazadaSalesProCateTable_option">
    <permTag:perm funcCode="lazada_deleteSalesProhibitionCate">
        <button class="layui-btn layui-btn-xs layui-btn-danger" style="padding: 0 6px;" lay-event="delete">删除</button>
    </permTag:perm>
</script>

<%--白名单管理--%>
<script type="text/html" id="lazadaSalesProCate_whiteListLayerCon">
    <div id="lazadaSalesProCate_whiteListLayerView"></div>
</script>

<script type="text/html" id="lazadaSalesProCate_whiteListLayerDemo">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="lazadawhiteListLayer_searchForm">
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">站点</label>
                        <div class="layui-input-block">
                            <select name="salesSites" id="lazadawhiteListLayer_site"
                                    xm-select="lazadawhiteListLayer_site"
                                    xm-select-search xm-select-search-type="dl"
                                    xm-select-skin="normal">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <div class="layui-form-label labelSel" style="width: 140px;">
                            <select id="lazadawhiteListLayer_siteSingle" lay-filter="lazadawhiteListLayer_siteSingle">
                            </select>
                        </div>
                        <div class="layui-input-block" style="margin-left:170px">
                                <input class="layui-input" id="lazadaWhiteList_lazadaCates" />
<%--                            <button id="lazadawhiteListLayer_cate_select_btn" type="button"--%>
<%--                                    class="layui-btn layui-btn-sm layui-btn-primary">选择分类--%>
<%--                            </button>--%>
<%--                            <i class="layui-icon layui-icon-delete"--%>
<%--                               onclick="clearCateAndOtherElementArray('lazadawhiteListLayer_category_text','lazadawhiteListLayer_category_Id' ,'lazadawhiteListLayer_category_cate_site_id')"--%>
<%--                               style="cursor:pointer" title="删除产品类目"></i>--%>
<%--                            <input id="lazadawhiteListLayer_category_Id" type="hidden" name="categoryId">--%>
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">店铺</label>
                        <div class="layui-input-block">
                            <select name="storeIds" id="lazadawhiteListLayer_storeAcctId"
                                    xm-select="lazadawhiteListLayer_storeAcctId" xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">创建人</label>
                        <div class="layui-input-block">
                            <select name="creators" id="lazadawhiteListLayer_creatorId"
                                    xm-select="lazadawhiteListLayer_creatorId" xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <div class="layui-input-block">
                            <button id="lazadawhiteListLayer_searchBtn" class="layui-btn layui-btn-sm" type="button">
                                查询
                            </button>
                            <button id="lazadawhiteListLayer_resetBtn" class="layui-btn layui-btn-primary layui-btn-sm"
                                    type="reset">清空
                            </button>
                        </div>
                    </div>
                </div>
                <div id="lazadawhiteListLayer_category_text"></div>
            </form>
        </div>
        <div class="layui-card">
            <div class="layui-card-body">
                <div class="dis_flex">
                    <div>
                        <input hidden type="file" id="lazadawhiteListLayer_importFile"/>
                        <permTag:perm funcCode="lazada_exportWhiteList">
                            <a class="layui-btn layui-btn-sm" id="lazadawhiteListLayer_export">导出</a>
                        </permTag:perm>
                    </div>
                    <form class="layui-form dis_flex">
                        <select name="lazadawhiteListLayer_select" lay-filter="lazadawhiteListLayer_select">
                            <option value="下载模板">下载模板</option>
                            <option value="新增白名单">新增白名单</option>
                            <option value="删除白名单">删除白名单</option>
                            <option value="替换所有白名单">替换所有白名单</option>
                        </select>
                        <permTag:perm funcCode="lazada_importWhiteList">
                            <a class="layui-btn layui-btn-sm layui-btn-normal" id="lazadawhiteListLayer_import">导入</a>
                        </permTag:perm>
                    </form>
                </div>
                <table class="layui-table" id="lazadaSalesLayer_table"
                       lay-filter="lazadaSalesLayer_table"></table>
            </div>
        </div>
    </div>
</script>