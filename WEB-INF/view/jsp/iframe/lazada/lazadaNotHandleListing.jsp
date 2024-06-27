<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2022/5/24
  Time: 15:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>不处理Listing</title>
<style>
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg15 layui-col-md15">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="lazada_not_handle_listing_form"
                          lay-filter="lazada_not_handle_listing_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="lazada_not_handle_listing_depart" lay-search
                                            name="orgId"
                                            lay-filter="lazada_not_handle_listing_depart" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select lay-search class="users_hp_custom" data-rolelist="lazada专员" xm-select="lazada_not_handle_listing_salesman" id="lazada_not_handle_listing_salesman" lay-filter="lazada_not_handle_listing_salesman" name="salesPersonIds">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="lazada_not_handle_listing_store"
                                            id="lazada_not_handle_listing_store" xm-select-search
                                            class="store_hp_custom" data-platcode="lazada"
                                            xm-select-search-type="dl" xm-select-skin="normal"
                                            name="storeAcctIds">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="lazadaNotHandlerSalesType">
                                        <option value="7">7天销量</option>
                                        <option value="30">30天销量</option>
                                        <option value="60">60天销量</option>
                                        <option value="90">90天销量</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input inputBorRadLeft" name="lazadaNotHandlerSalesGreate">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input inputRad" name="lazadaNotHandlerSalesLess">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">物品号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="itemIds"
                                           class="layui-input lazada-not-handle-listing-list-blur"
                                           placeholder="支持多个item_id,英文逗号分割">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">不处理类型</label>
                                <div class="layui-input-block">
                                    <select name="dealType">
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">可用库存合计</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="lazadaNotHandlerStockGreate" name="lazadaNotHandlerStockGreate" class="layui-input inputBorRadLeft">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="lazadaNotHandlerStockLess" name="lazadaNotHandlerStockLess" class="layui-input inputRad">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">添加时间</label>
                                <div class="layui-input-block">
                                    <input id="lazadaNotHandlerCreateTime" type="text" name="lazadaNotHandlerCreateTime" lay-verify="required"
                                           autocomplete="off" class="layui-input">
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <a href="javascript:void(0);"
                                   class="layui-btn layui-btn-normal layui-btn-sm ml20"
                                   id="lazada_not_handle_listing_search">查询</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <!-- 表格内容  -->
            <div class="layui-card">
                <div class="layui-card-header disFCenter toFixedContain">
                    <div class="disFCenter">
                        <div>数量(共<span id="lazada_not_handle_listing_total">0</span>条)</div>
                        <a href="javascript:void(0);" class="layui-btn  layui-btn-danger layui-btn-sm ml20"
                           id="lazada_not_handle_listing_batch_del">批量删除</a>
                        <a href="javascript:void(0);" class="layui-btn layui-btn-normal layui-btn-sm ml20" id="lazada_not_handle_listing_export">导出</a>
                    </div>
                    <form class="layui-form disflex" id="lazada_not_handle_listing_add_form">
                        <div>
                            <label class="layui-form-label">
                                <font class="fRed">*</font>不处理类型
                            </label>
                            <div class="layui-input-block">
                                <select name="dealType">
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="layui-form-label"><font class="fRed">*</font>店铺</label>
                            <div class="layui-input-block">
                                <select name="storeAcctId" id="storeAcctId" lay-search="“">
                                </select>
                            </div>
                        </div>



                        <input type="text"
                               class="layui-input w200 inline_block lazada-not-handle-listing-list-blur ml20"
                               placeholder="支持多个item_id,英文逗号分割" name="itemIds">
                        <a href="javascript:void(0);" class="layui-btn layui-btn-normal layui-btn-sm ml20"
                           id="lazada_not_handle_listing_add">新增</a>
                        <%--下载导入模板--%>
                        <a href="javascript:void(0);" class="layui-btn layui-btn-normal layui-btn-sm ml20"
                           id="lazada_not_handle_listing_export_mode">下载模板</a>
                        <a href="javascript:void(0);" class="layui-btn layui-btn-normal layui-btn-sm ml20"
                           id="lazada_not_handle_listing_import">导入</a>
                        <input type="file" name="" id="lazada_not_handle_listing_import_val" hidden>
                    </form>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="lazada_not_handle_listing_table"
                           lay-filter="lazada_not_handle_listing_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="lazada_not_handle_listing_toolbar">
    <a href="javascript:void(0);" class="layui-btn  layui-btn-danger layui-btn-sm ml20" lay-event='del'>删除</a>
</script>
<script type="text/javascript">
    layui.use(
        ["admin", "form", "layer", "table", "formSelects", "element", "laydate"],
        function () {
            var admin = layui.admin,
                form = layui.form,
                layer = layui.layer,
                table = layui.table,
                laydate = layui.laydate,
                formSelects = layui.formSelects,
                $ = layui.$
            render_hp_orgs_users("#lazada_not_handle_listing_form") //渲染部门销售员店铺三级联动   ??三级联动最终传值是哪种？

            // shop_arr: lazadaOnline页面选中的数据

            var lazadaNotHandleList = {
                // 初始化
                init: async function () {
                    // 获取不处理listing过滤类型
                    // this.filterListingType = await this.getProdFilterListingTypeAiax()
                    // 查询和新增俩处，需要添加这个下拉框
                    let options = `
                                    <option value="1">定时删除不处理</option>
                                    <option value="2">取消预售不处理</option>
                                    <option value="3">调价不处理</option>
                                    <option value="4">更新水印不处理</option>
                                    `
                    $("#lazada_not_handle_listing_form")
                        .find("[name=dealType]")
                        .append(options)
                    $("#lazada_not_handle_listing_add_form")
                        .find("[name=dealType]")
                        .append(options)
                    //渲染日期
                    laydate.render({
                        elem: '#lazadaNotHandlerCreateTime',
                        type: 'date',
                        range: true
                    });

                    commonReturnPromise({
                        url: `/lms/sys/listStoreForRenderHpStoreCommonComponent.html`,
                        type: 'POST',
                        params:{roleNames: "lazada专员",platCode: 'lazada'}
                    }).then(function(result){
                        commonRenderSelect("storeAcctId", result, {
                            name: 'storeAcct',
                            code: 'id'
                        }).then(()=> form.render())
                    })


                    let itemIds = window.localStorage.getItem("itemId")
                    let storeAcctId = window.localStorage.getItem("storeAcctId")
                    if (itemIds) {
                        // 根据后端需要的数据，对itemIds进行处理，然后掉后端接口，然后掉table.render
                        let obj = {
                            storeAcctIds: storeAcctId.split(","),
                            itemIds: itemIds.split(","),
                            roleNames:["lazada专员"],
                            dealType: "",
                        }
                        this.tableRender(obj)
                        // 赋值物品号
                        $("#lazada_not_handle_listing_form")
                            .find("input[name=itemIds]")
                            .val(itemIds)
                    }
                },
                filterListingType: [], //不处理listing过滤类型
                // 查询
                search: function () {
                    var _this = this
                    $("#lazada_not_handle_listing_search").click(function () {
                        var formObj = _this.serachData()
                        _this.tableRender(formObj)
                    })
                },
                serachData: function () {
                    var formObj = serializeObject($("#lazada_not_handle_listing_form"))
                    console.log("--->", formObj)
                    var currentStoreAccts = formSelects.value(
                        "lazada_not_handle_listing_store",
                        "val"
                    )
                    // 销售员
                    formObj.salesPersonIds = formSelects.value(
                        "lazada_not_handle_listing_salesman",
                        "val")
                    // 店铺
                    formObj.storeAcctIds = currentStoreAccts
                    formObj.roleNames = ["lazada专员"]
                    formObj.itemIds = formObj.itemIds == ''?[]:formObj.itemIds.split(",")
                    formObj.saleType = formObj.lazadaNotHandlerSalesType
                    formObj.saleLess = formObj.lazadaNotHandlerSalesLess
                    formObj.saleGreate = formObj.lazadaNotHandlerSalesGreate
                    formObj.stockGreate = formObj.lazadaNotHandlerStockGreate
                    formObj.stockLess = formObj.lazadaNotHandlerStockLess
                    if (formObj.lazadaNotHandlerCreateTime) {
                        formObj.createTimeGreate = formObj.lazadaNotHandlerCreateTime.split(' - ')[0] + ' 00:00:00'
                        formObj.createTimeLess = formObj.lazadaNotHandlerCreateTime.split(' - ')[1] + ' 23:59:59'
                    }
                    return formObj
                },

                // table数据
                tableRender: function (serachParams) {
                    var _this = this
                    table.render({
                        elem: "#lazada_not_handle_listing_table",
                        method: "post",
                        url:ctx + "/lazadaBatchOperation/searchProdFilterListingLazada",
                        contentType:"application/json",
                        where: serachParams,
                        cols: [
                            [
                                { type: "checkbox" },
                                { field: "id", title: "id", templet: "<div>{{d.id}}</div>" },
                                {
                                    field: "filterType",
                                    title: "过滤类型",
                                },
                                { field: "storeAcctName", title: "店铺" },
                                { field: "salePerson", title: "销售员" },
                                { field: "itemId", title: "item_id" },
                                { field: "itemId", title: "利润￥/利率%" ,
                                    templet:
                                        '<div>' +
                                        '<span>最高：{{d.maxProfit || 0}}/ {{d.maxInterestRate || 0}}%</span><br>' +
                                        '<span>最低：{{d.minProfit || 0}}/ {{d.minInterestRate || 0}}%</span>' +
                                        '</div>',},
                                { field: "itemId", title: "7/30/60/90天销量" ,
                                    templet:
                                        '<div>{{d.sevenSales || 0}}/{{d.thirtySales || 0}}/{{d.sixtySales || 0}}/{{d.ninetySales || 0}}</div>',},
                                { field: "stock", title: "可用库存合计" },
                                {
                                    field: "createTime",
                                    title: "添加时间",
                                    templet:
                                        '<div>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>',
                                },
                                {
                                    field: "result",
                                    title: "操作",
                                    toolbar: "#lazada_not_handle_listing_toolbar",
                                },
                            ],
                        ],
                        page: true,
                        id: "lazada_not_handle_listing_table",
                        height: 500,
                        limits: [100, 200, 500],
                        limit: 100,
                        done: function (res, curr, count) {
                            $("[data-field='id']").css("display", "none")
                            $("#lazada_not_handle_listing_total").text(count)
                        },
                    })
                },
                // 总数量更新
                totalUpdate: function (delTotal) {
                    let lastTotal = Number($("#lazada_not_handle_listing_total").text())
                    let curTotal = lastTotal - Number(delTotal)
                    $("#lazada_not_handle_listing_total").text(curTotal)
                },
                // 批量删除不刷新
                batchDel: function () {
                    var _this = this
                    $("#lazada_not_handle_listing_batch_del").click(function () {
                        // 选中的数据
                        var checkStatus = table.checkStatus("lazada_not_handle_listing_table") //idTest 即为基础参数 id 对应的值

                        var data = checkStatus.data //获取选中行的数据
                        if (!data.length) {
                            return layer.msg("请选择数据", { icon: 7 }) //icon的值可能有问题
                        }
                        var arrStr = data.map((item) => item.id)

                        let formData = new FormData();
                        formData.append("deleteIdList",arrStr.join(","))
                        $.ajax({
                            url: ctx + '/lazadaBatchOperation/deleteProdFilterListingLazada',
                            type: 'POST',
                            data: formData,                  // 上传formdata封装的数据
                            cache: false,                      // 不缓存
                            processData: false,               // jQuery不要去处理发送的数据
                            contentType: false,               // jQuery不要去设置Content-Type请求头
                            success: function (res) {          //成功回调
                                layer.msg(res.msg || "删除成功", { icon: 1 })
                                // 如果全选删除，需要更新
                                if (checkStatus.isAll) {
                                    _this.tableRender(_this.serachData())
                                } else {
                                    // 删除对应dom和对应缓存
                                    deleteCheckedData(
                                        "lazada_not_handle_listing_table",
                                        data.map((item) => item.id),
                                        "td[data-field=id]"
                                    )
                                    _this.totalUpdate(data.length)
                                }
                            }
                        })
                    })
                },
                // table模块的工具条事件
                //工具条事件
                tableToolbar: function () {
                    var _this = this
                    table.on("tool(lazada_not_handle_listing_table)", function (obj) {
                        //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                        var data = obj.data //获得当前行数据
                        var layEvent = obj.event //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

                        if (layEvent === "del") {
                            // 单个删除不刷新
                            //向服务端发送删除指令
                            let formData = new FormData();
                            formData.append("deleteIdList",data.id)
                            $.ajax({
                                url: ctx + '/lazadaBatchOperation/deleteProdFilterListingLazada',
                                type: 'POST',
                                data: formData,                  // 上传formdata封装的数据
                                // dataType: 'JSON',
                                cache: false,                      // 不缓存
                                processData: false,               // jQuery不要去处理发送的数据
                                contentType: false,               // jQuery不要去设置Content-Type请求头
                                success: function (res) {          //成功回调
                                    layer.msg(res.msg || "删除成功", { icon: 1 })
                                    obj.del() //删除对应行（tr）的DOM结构，并更新缓存
                                    // 总数量更新
                                    _this.totalUpdate(1)
                                }
                            })
                            // _this.DelAjax(formData).then((res) => {
                            //     // layer.msg(res || "删除成功", { icon: 1 })
                            //     obj.del() //删除对应行（tr）的DOM结构，并更新缓存
                            //     // 总数量更新
                            //     _this.totalUpdate(1)
                            // })
                        }
                    })
                },
                // 新增刷新页面
                Add: function () {
                    var _this = this
                    $("#lazada_not_handle_listing_add").click(function () {
                        // 获取数据
                        let formObj = serializeObject(
                            $("#lazada_not_handle_listing_add_form")
                        )
                        if (formObj.itemIds == "")
                            return layer.msg("请输入itemId", { icon: 7 })
                        if (formObj.storeAcctId== '')
                            return layer.msg("请选择店铺", { icon: 7 })
                        formObj.itemIdList = formObj.itemIds
                        formObj.filterType = formObj.dealType
                        // formObj.storeAcctId =
                        //向服务端发送添加指令
                        _this.AddAjax(formObj).then((res) => {
                            layer.msg(res || "操作成功", { icon: 1 })
                            _this.tableRender(_this.serachData())
                        })
                    })
                },
                //   导出数据，不分页
                exportAll: function () {
                    let _this = this
                    $("#lazada_not_handle_listing_export").click(function () {
                        let formData = new FormData()
                        let obj = _this.serachData();
                        obj["storeAcctIdList"] = obj.storeAcctIds.join(",")
                        obj["itemIdList"] = obj.itemIds.join(",")
                        obj["filterType"] = obj.dealType
                        obj["salesPersonIds"] = obj.salesPersonIds.join(",")
                        submitForm(obj, ctx + '/lazadaBatchOperation/exportProdFilterListingLazada', '_blank')
                    })
                },
                // 导入数据
                importAll: function (){
                    let _this = this
                    $("#lazada_not_handle_listing_import").click(function () {
                        $('#lazada_not_handle_listing_import_val').click();
                    })
                    // 下载导入模板
                    $("#lazada_not_handle_listing_export_mode").click(function () {
                        window.location.href = `${ctx}/static/templet/importAddNotDealListingExcel.xlsx`;
                    })
                },
                fileChange:function(){
                    // 通过导入excel 新增其它入库商品
                    $('#lazada_not_handle_listing_import_val').on('change', function() {
                        var files = $('#lazada_not_handle_listing_import_val')[0].files
                        if (files.length == 0) {
                            return;
                        }
                        // 校验文件类型
                        var fileName = files[0].name
                        var seat = fileName.lastIndexOf(".");
                        var extension = fileName.substring(seat).toLowerCase();
                        console.log(extension,'extension')
                        if (extension != '.xlsx' && extension != '.xls') {
                            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件', { icon: 0 })
                            return
                        }
                        var formData = new FormData();
                        formData.append("file", files[0]);
                        // formData.append("warehouseId", $("#movestock_search_form").find('select[name="warehouseId"]').val());
                        layer.confirm('确认导入这个文件吗', { btn: ['确认', '取消'] },
                            function() {
                                loading.show()
                                $.ajax({
                                    url: ctx + '/lazadaBatchOperation/importNotDealListingExcel',
                                    type: 'post',
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                    success: function(returnData) {
                                        loading.hide()
                                        $('#lazada_not_handle_listing_import_val').val('')
                                        if (returnData.code == '0000') {
                                            const failInfo = returnData.data.failList || [];
                                            let failInfoStr = "";
                                            failInfo.forEach(item => {
                                                failInfoStr += `<br>失败的信息` + item;
                                            });
                                            let content = "成功"+(returnData.data.successCount?returnData.data.successCount:0)+"个，失败"+(returnData.data.errorCount?returnData.data.errorCount:0)+"个"+failInfoStr;

                                            console.log(content)
                                            layer.open({
                                                title: "导入结果",
                                                icon: 7,
                                                content: content,
                                                end: function() {
                                                    // $("#movestock_submit").click();
                                                }
                                            });
                                        } else {
                                            layer.msg(returnData.msg, { icon: 2 });
                                        }
                                    },
                                    error: function() {
                                        loading.hide()
                                        $('#lazada_not_handle_listing_import_val').val('')
                                    }
                                });
                            },
                            function() {
                                $('#lazada_not_handle_listing_import_val').val('');
                                layer.closeAll()
                            }
                        )
                    });
                },
                // 对输入多个用逗号隔离的数据进行处理
                blurhandleids: function () {
                    $(".lazada-not-handle-listing-list-blur").blur(function () {
                        let _curList = $(this).val().replace(/，/g, ",").replace(/\s+/g, "") //中文逗号转为英文逗号，空格全部删掉
                        let curList = _curList
                            .split(",")
                            .filter((item) => !!item && Number(item)) //去掉空字符串和非数字的
                            .map((item) => Number(item))
                            .join() //转为int
                        $(this).val(curList)
                    })
                },
                // 获取不处理listing过滤类型
                getProdFilterListingTypeAiax: function () {
                    return commonReturnPromise({
                        url: ctx + "/lazadaBatchOperation/getProdFilterListingType",
                    })
                },
                // 删除ajax
                DelAjax: function (formData) {
                    return commonReturnPromise({
                        url:ctx + "/lazadaBatchOperation/deleteProdFilterListingLazada",
                        type: "POST",
                        params: formData
                    })
                },
                // 新增ajax
                AddAjax: function (obj) {
                    return commonReturnPromise({
                        url: ctx + "/lazadaBatchOperation/addProdFilterListing",
                        type: "PUT",
                        params: obj,
                    })
                },
            }
            // 进入页面初始数据
            lazadaNotHandleList.init()
            // 查询
            lazadaNotHandleList.search()
            lazadaNotHandleList.tableToolbar()
            // 批量删除不刷新
            lazadaNotHandleList.batchDel()
            // 导出
            lazadaNotHandleList.exportAll()
            // 导入
            lazadaNotHandleList.importAll()
            lazadaNotHandleList.fileChange()
            // 新增
            lazadaNotHandleList.Add()
            // 对输入多个用逗号隔离的数据进行处理
            lazadaNotHandleList.blurhandleids()
        }
    )
</script>
