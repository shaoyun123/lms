<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>店铺休假结果</title>
<style>
        .label_reset{
        padding: 0 10px !important;
    }
    .w_40{
        width: 40% !important;
    }
    .flex_between{
        display: flex;
        justify-content: space-between;
    }
    .pl_10{
        padding-left: 10px !important;   
    }
    .fr{
        float: right;
    }
    .mr_10{
        margin-right: 10px;
    }
    .m_20{
        margin: 20px !important;
    }
</style>
<div class="layui-fluid" id="LAY-ebaypublishstaic">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="setStoreBreakResult_form" id="setStoreBreakResult_form"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺名称</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="storeAcct">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">休假状态</label>
                                <div class="layui-input-block">
                                    <select name="operateStatus">
                                        <option value="-1">全部</option>
                                        <option value="1">未开始</option>
                                        <option value="2">休假成功</option>
                                        <option value="3">休假失败</option>
                                        <option value="4">结束成功</option>
                                        <option value="5">结束失败</option>
                                    </select>
                                </div>
                            </div>

                                <div class="layui-col-md3 layui-col-lg3 pl_10">
                                    <button id="setStoreBreakResult_search" class="layui-btn layui-btn-sm" type="button">查询</button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="setStoreBreakResult_card">
                <div class="layui-card-body">
                    <table class="layui-table" id="setStoreBreakResult_table" lay-filter="setStoreBreakResult_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 表格渲染模板 -->

<script>
    layui.use(["admin", "form", "table", "layer", "laytpl",'element','laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer;
    form.render("select");
    form.render("radio");
    form.render("checkbox");

    $('#setStoreBreakResult_search').click(function(){
        var senddata = serializeObject($('#setStoreBreakResult_form'))
        setStoreBreakResulttable(senddata)
    })
    function setStoreBreakResulttable(data){
     table.render({
        elem: "#setStoreBreakResult_table",
        method: "post",
        url: ctx + "/ebayVacation/searchEbayVacationStoreAcct.html",
        where:data,
        cols: [
            [
               {
                    field: "storeAcct",
                    title: "店铺名称",
                },
                {
                    field: "acctStatus",
                    title: "店铺状态",
                    templet:"<div>{{d.acctStatus?'启用中':'禁用'}}</div>"
                },
                {
                    field: "salesPerson",
                    title: "销售员",
                },
                {
                    field: "acctType",
                    title: "账号类型",
                },
                {
                    field: "storeWarehouses",
                    title: "仓库类型",
                },
                {
                    field: "startTime",
                    title: "休假开始时间",
                },
                {
                    field: "exceptedReturnDate",
                    title: "期望休假结束日期",
                    templet:'<div>{{Format(d.exceptedReturnDate,"yyyy-MM-dd")}}</div>'
                },
                {
                    field: "vacationStatus",
                    title: "休假状态",
                },
                {
                    field: "hideFixedPrice",
                    title: "是否隐藏一口价",
                    templet:"<div>{{d.acctStatus?'是':'否'}}</div>"
                },
                {
                    field: "showText",
                    title: "休假文本",
                },
                {
                    field: "remark",
                    title: "操作备注",
                },
            ],
        ],
        done: function(res, curr, count){
        },
        id: "setStoreBreakResult_table",
        page: true, //是否显示分页
        limits: [300,500, 1000],
        limit: 500, //每页默认显示的数量
    });
}
})
</script>