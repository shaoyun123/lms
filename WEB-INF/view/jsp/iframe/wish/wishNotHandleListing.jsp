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
                    <form action="" class="layui-form" id="wish_not_handle_listing_form"
                          lay-filter="wish_not_handle_listing_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="wish_not_handle_listing_depart" lay-search
                                            name="orgId"
                                            lay-filter="wish_not_handle_listing_depart" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select xm-select-skin="normal" lay-search class="users_hp_custom" data-rolelist="wish专员" xm-select="wish_not_handle_listing_salesman" id="wish_not_handle_listing_salesman" lay-filter="wish_not_handle_listing_salesman" name="salesPersonIds">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="wish_not_handle_listing_store"
                                            id="wish_not_handle_listing_store" xm-select-search
                                            class="store_hp_custom" data-platcode="wish"
                                            xm-select-search-type="dl" xm-select-skin="normal"
                                            name="storeAcctId">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">产品ID</label>
                                <div class="layui-input-block">
                                    <input type="text" name="storePIds"
                                           class="layui-input wish-not-handle-listing-list-blur"
                                           placeholder="支持多个产品ID,英文逗号分割">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">不处理类型</label>
                                <div class="layui-input-block">
                                    <select name="type">
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <a href="javascript:void(0);"
                                   class="layui-btn layui-btn-normal layui-btn-sm ml20"
                                   id="wish_not_handle_listing_search">查询</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <!-- 表格内容  -->
            <div class="layui-card">
                <div class="layui-card-header disFCenter toFixedContain">
                    <div class="disFCenter">
                        <div>数量(共<span id="wish_not_handle_listing_total">0</span>条)</div>
                        <a href="javascript:void(0);" class="layui-btn  layui-btn-danger layui-btn-sm ml20"
                           id="wish_not_handle_listing_batch_del">批量删除</a>
                    </div>
                    <form class="layui-form disflex" id="wish_not_handle_listing_add_form">
                        <div>
                            <label class="layui-form-label">
                                <font class="fRed">*</font>不处理类型
                            </label>
                            <div class="layui-input-block">
                                <select name="type">
                                </select>
                            </div>
                        </div>
                        <input type="text"
                               class="layui-input w200 inline_block wish-not-handle-listing-list-blur ml20"
                               placeholder="支持多个产品ID,英文逗号分割" name="storePIds">
                        <a href="javascript:void(0);" class="layui-btn layui-btn-normal layui-btn-sm ml20"
                           id="wish_not_handle_listing_add">新增</a>
                      </form>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="wish_not_handle_listing_table"
                           lay-filter="wish_not_handle_listing_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="wish_not_handle_listing_toolbar">
    <a href="javascript:void(0);" class="layui-btn layui-btn-danger layui-btn-xs ml20" lay-event='del'>删除</a>
</script>
<script type="text/javascript">
    layui.use(
        ["admin", "form", "layer", "table", "formSelects", "element", "laydate"],
        function () {
            var admin = layui.admin,
                form = layui.form,
                layer = layui.layer,
                table = layui.table,
                formSelects = layui.formSelects,
                $ = layui.$
            render_hp_orgs_users("#wish_not_handle_listing_form") //渲染部门销售员店铺三级联动   ??三级联动最终传值是哪种？

            // shop_arr: wishOnline页面选中的数据

            var wishNotHandleList = {
                // 初始化
                init: async function () {
                    // 查询和新增俩处，需要添加这个下拉框
                    let options = `<option value="1">自动调价不处理</option>`
                    $("#wish_not_handle_listing_form")
                        .find("[name=type]")
                        .append(options)
                    $("#wish_not_handle_listing_add_form")
                        .find("[name=type]")
                        .append(options)

                    commonReturnPromise({
                        url: `/lms/sys/listStoreForRenderHpStoreCommonComponent.html`,
                        type: 'POST',
                        params:{roleNames: "wish专员",platCode: 'wish'}
                    }).then(function(result){
                        commonRenderSelect("storeAcctId", result, {
                            name: 'storeAcct',
                            code: 'id'
                        }).then(()=> form.render())
                    })

                    let storePIds = window.localStorage.getItem("storeProdPId")
                    let storeAcctId = window.localStorage.getItem("storeAcctId")
                    if (storePIds) {
                        // 根据后端需要的数据，对storeProdPId进行处理，然后掉后端接口，然后掉table.render
                        let obj = {
                            storeAcctId: storeAcctId.split(",").map(Number),
                            storePIds: storePIds.split(","),
                            roleNames:["wish专员"],
                            type: "",
                        }
                        this.tableRender(obj)
                        // 赋值物品号
                        $("#wish_not_handle_listing_form")
                            .find("input[name=storePIds]")
                            .val(storePIds)
                    }
                },
                filterListingType: [], //不处理listing过滤类型
                // 查询
                search: function () {
                    var _this = this
                    $("#wish_not_handle_listing_search").click(function () {
                        var formObj = _this.serachData()
                        _this.tableRender(formObj)
                    })
                },
                serachData: function () {
                    var formObj = serializeObject($("#wish_not_handle_listing_form"))
                    var currentStoreAccts = formSelects.value(
                        "wish_not_handle_listing_store",
                        "val"
                    )
                    // 店铺
                    formObj.storeAcctId = currentStoreAccts
                    formObj.storePIds = formObj.storePIds == ''?[]:formObj.storePIds.split(",")
                    return formObj
                },

                // table数据
                tableRender: function (serachParams) {
                    serachParams.storeAcctIds = serachParams.storeAcctId
                    var _this = this
                    table.render({
                        elem: "#wish_not_handle_listing_table",
                        method: "post",
                        url:ctx + "/noPriceListingWish/queryWishNoPriceListing",
                        contentType:"application/json",
                        where: serachParams,
                        cols: [
                            [
                                { type: "checkbox" },
                                { field: "id", title: "id", templet: "<div>{{d.id}}</div>" },
                                {
                                    field: "type",
                                    title: "不处理类型",
                                    templet:
                                        '<div>{{ d.type == 1?"自动调价不处理":""}}</div>',
                                },
                                { field: "storeAcct", title: "店铺名称" },
                                { field: "salesperson", title: "销售员",width: 90 },
                                { field: "storeProdPId", title: "产品ID",width: 230 },
                                { field: "creator", title: "添加人",width: 90 },
                                {
                                    field: "createTime",
                                    title: "添加时间",
                                    templet:
                                        '<div>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>',
                                },
                                {
                                    field: "result",
                                    width: 100,
                                    title: "操作",
                                    toolbar: "#wish_not_handle_listing_toolbar",
                                },
                            ],
                        ],
                        page: true,
                        id: "wish_not_handle_listing_table",
                        height: 500,
                        limits: [100, 200, 500],
                        limit: 100,
                        done: function (res, curr, count) {
                            $("[data-field='id']").css("display", "none")
                            $("#wish_not_handle_listing_total").text(count)
                        },
                    })
                },
                // 总数量更新
                totalUpdate: function (delTotal) {
                    let lastTotal = Number($("#wish_not_handle_listing_total").text())
                    let curTotal = lastTotal - Number(delTotal)
                    $("#wish_not_handle_listing_total").text(curTotal)
                },
                // 批量删除不刷新
                batchDel: function () {
                    var _this = this
                    $("#wish_not_handle_listing_batch_del").click(function () {
                        var checkStatus = table.checkStatus("wish_not_handle_listing_table") //idTest 即为基础参数 id 对应的值
                        var data = checkStatus.data //获取选中行的数据
                        if (!data.length) {
                            return layer.msg("请选择数据", { icon: 7 }) //icon的值可能有问题
                        }
                        var idArr = data.map((item) => item.id)
                        layer.confirm("确定要删除数据吗", { btn: ['确认', '取消'] }, function() {
                        // 单个删除不刷新
                        _this.DelAjax(idArr).then((res) => {
                            layer.msg("删除成功", { icon: 1 })
                            // 如果全选删除，需要更新
                            if (checkStatus.isAll) {
                                _this.tableRender(_this.serachData())
                            } else {
                                // 删除对应dom和对应缓存
                                deleteCheckedData(
                                    "wish_not_handle_listing_table",
                                    data.map((item) => item.id),
                                    "td[data-field=id]"
                                )
                                _this.totalUpdate(data.length)
                            }
                        })
                        })
                    })
                },
                // table模块的工具条事件
                //工具条事件
                tableToolbar: function () {
                    var _this = this
                    table.on("tool(wish_not_handle_listing_table)", function (obj) {
                        var data = obj.data
                        var layEvent = obj.event
                        if (layEvent === "del") {
                            // 单个删除不刷新
                            layer.confirm("确定要删除数据吗", { btn: ['确认', '取消'] }, function() {
                            _this.DelAjax([data.id]).then((res) => {
                                layer.msg("删除成功", { icon: 1 })
                                obj.del() //删除对应行（tr）的DOM结构，并更新缓存
                                // 总数量更新
                                _this.totalUpdate(1)
                            })
                            })
                        }
                    })
                },
                // 新增刷新页面
                Add: function () {
                    var _this = this
                    $("#wish_not_handle_listing_add").click(function () {
                        let formObj = serializeObject($("#wish_not_handle_listing_add_form"))
                        formObj.type = 1
                        if (formObj.storePIds == "")
                            return layer.msg("请输入产品ID", { icon: 7 })
                        formObj.storePIds = formObj.storePIds.split(",")
                        if(formObj.storePIds.length > 100){
                            return layer.msg("当前添加商品数量超过最大额度100", { icon: 7 })
                        }
                        //向服务端发送添加指令
                        _this.AddAjax(formObj).then((res) => {
                            layer.open({
                                title: '操作结果',
                                content: res,
                                yes: function (index, layero) {
                                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                                }
                            });
                            _this.tableRender(_this.serachData())
                        })
                    })
                },
                // 删除ajax
                DelAjax: function (data) {
                    return commonReturnPromise({
                        url:ctx + "/noPriceListingWish/deleteWishNoPriceListing",
                        type: "POST",
                        contentType:'application/json',
                        params: JSON.stringify(data)
                    })
                },
                // 新增ajax
                AddAjax: function (obj) {
                    return commonReturnPromise({
                        url: ctx + "/noPriceListingWish/saveWishNoPriceListing",
                        type: "PUT",
                        contentType:'application/json',
                        params: JSON.stringify(obj)
                    })
                },
            }
            // 进入页面初始数据
            wishNotHandleList.init()
            // 查询
            wishNotHandleList.search()
            wishNotHandleList.tableToolbar()
            // 批量删除不刷新
            wishNotHandleList.batchDel()
            // 新增
            wishNotHandleList.Add()
        }
    )
</script>