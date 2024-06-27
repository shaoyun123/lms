<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>ebay刊登统计</title>
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
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="eps_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="eps_orgFilter" class="orgs_hp_custom" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select name="salespersonIds"  class="users_hp_custom" data-rolelist="ebay专员" lay-filter="eps_sellerFilter" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">工作时间</label>
                                <div class="layui-input-block">
                                    <input name="listingTime" type="text" class="layui-input"/>
                                </div>
                            </div>
                                <div class="layui-col-md3 layui-col-lg3 pl_10">
                                    <button id="eps_searchBtn" class="layui-btn layui-btn-sm" type="button">查询</button>
                                    <button type="reset" id="eps_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="productlistCard">
                <div class="layui-card-body">
                    <table class="layui-table" id="ebaypublish_table" lay-filter="ebaypublish_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 表格渲染模板 -->

<!-- 手动标记跟踪号弹框 -->
<script type="text/html" id="store_detail_layer">
    <form class="layui-form m_20" id="eps_detailSearchForm">
        <input type="hidden" name="salespersonIds" />
        <div class="layui-inline">
            <label class="layui-form-label">刊登时间</label>
                <div class="layui-input-block">
                    <input name="listingTime" type="text" class="layui-input"/>
                </div>
        </div>
        <div class="layui-inline">
            <button type="button" class="layui-btn layui-btn-sm" id="eps_detailSearchBtn">搜索</button>
        </div>
    </form>
    <div>
        <div class="m_20">
        <table class="layui-table" id="eps_detail_table" lay-filter="eps_detail_table"></table>
        </div>
    </div>
</script>

<!-- 表格渲染模板 -->
<script type="text/html" id="pl_createTime">
    {{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}
</script>

<script type="text/html" id="eps_salespersonTpl">
    {{#  if(d.salespersonId){ }}
        <a href="javacript:;" onclick="storeDetail({{d.salespersonId}})" style="color: -webkit-link;">{{d.salesperson}}</a>
    {{#  } }}
</script>
<!-- 表格渲染模板 -->
<script type="text/javascript">
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage','laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        table=layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        $ = layui.$;
        form.render();
        laydate.render({
            elem: '#eps_searchForm input[name="listingTime"]', //指定元素
            range:true,
            type: 'date'
        });
        //初始化部门
        render_hp_orgs_users("#eps_searchForm");
        //表单查询
        $('#eps_searchBtn').click(function(){
            tableIns.reload({
                where:getSearchData(),
            })
        });
        $(function(){
            var endTime = new Date(new Date().getTime() - 24*3600*1000);
            var startTime = new Date(new Date().getTime() - 7*24*3600*1000);
            var timeStr = Format(startTime,"yyyy-MM-dd")+" - "+Format(endTime,"yyyy-MM-dd");
            $('#eps_searchForm input[name=listingTime]').val(timeStr);
        });
        function getSearchData(){
            var data = serializeObject($('#eps_searchForm'));
            data.listingTime1 = data.listingTime.split(' - ')[0]?data.listingTime.split(' - ')[0] + " 00:00:00":"";
            data.listingTime2 = data.listingTime.split(' - ')[1]?data.listingTime.split(' - ')[1] + " 23:59:59":"";
            delete data.listingTime;
            return data;
        }

        //明细弹框

        //表单清空
        $('EPS_searchReset').click(function(){
            $("#eps_searchForm input").each(function(index,item){
                $(item).val("");
            });
            return false
       });

       var tableIns = table.render({
        elem: "#ebaypublish_table",
            method: 'post',
            url: ctx + "/lse/list.html",
            cols: [
                [
                    { field: "salesperson",title: "销售员",templet:'#eps_salespersonTpl'},
                    { field: "manualFixpriceNum",title: "手动一口价数量"},
                    { field: "batchFixpriceNum",title: "批量一口价数量"},
                    { field: "auctionNum",title: '拍卖数量'},
                    { field: "manualNum",title: '手动产品数量'},
                    { field: "optimizeNum",title: '优化数量'},
                ],
            ],
            id: "ebaypublish_table",
            page:true,
            limits:[100,200,500,1000],
            limit:100,
            where:getSearchData(),
       });

});
//店铺明细弹框
function storeDetail(salespersonId){
    layer.open({
        type: 1,
        title: "处理",
        area: ["60%", "50%"],
        shadeClose: false,
        content: $("#store_detail_layer").html(),
        success:function (index, layero) {
            $('#eps_detailSearchForm input[name="salespersonIds"]').val(salespersonId);
            $('#eps_detailSearchForm input[name="listingTime"]').val($('#eps_searchForm input[name="listingTime"]').val());
            layui.laydate.render({
                elem: '#eps_detailSearchForm input[name="listingTime"]', //指定元素
                range:true,
                type: 'date'
            });
            layui.form.render();
            var tableIns = layui.table.render({
                elem: "#eps_detail_table",
                method: 'post',
                url: ctx + "/lse/listbysaleperson.html",
                cols: [
                    [
                        { field: "storeAcct",title: "店铺"},
                        { field: "manualFixpriceNumStr",title: "手动一口价数量"},
                        { field: "batchFixpriceNumStr",title: "批量一口价数量"},
                        { field: "auctionNumStr",title: "拍卖数量"},
                        { field: "manualNumStr",title: "手动产品数量"},
                        { field: "optimizeNumStr",title: "优化数量"},
                        { field: "lastMonthNum",title: "上月上新量"},
                        { field: "nowMonthNum",title: "本月上新量"},
                    ],
                ],
                done: function(res, curr, count){
                    console.log(res);
                },
                id: "eps_detail_table",  
                where: getDetailSearchData()
            });
            $('#eps_detailSearchBtn').click(function(){
                tableIns.reload({
                    where:getDetailSearchData(),
                })
            });
        }
    })
}

function getDetailSearchData(){
    var data = {};
    data.salespersonIds = $('#eps_detailSearchForm input[name="salespersonIds"]').val();
    data.listingTime = $('#eps_detailSearchForm input[name="listingTime"]').val();
    data.listingTime1 = data.listingTime.split(' - ')[0]?data.listingTime.split(' - ')[0]:"";
    data.listingTime2 = data.listingTime.split(' - ')[1]?data.listingTime.split(' - ')[1] + " 23:59:59":"";
    delete data.listingTime;
    return data;
}

function serializeObject(form) {
        var o = {};
        $.each(form.serializeArray(), function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }

</script>