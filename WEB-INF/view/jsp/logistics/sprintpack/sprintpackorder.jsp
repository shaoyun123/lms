<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>欧速通单号</title>
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
<div class="layui-fluid" id="LAY-sprintpackorder">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="sp_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">IsProcessed</label>
                                <div class="layui-input-block">
                                    <select name="isProcessed">
                                        <option value="">全部</option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">使用状态</label>
                                <div class="layui-input-block">
                                    <select name="isUsed">
                                        <option value="">全部</option>
                                        <option value="0" selected>未使用</option>
                                        <option value="1">已使用</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">processedTime</label>
                                    <div class="layui-input-block">
                                        <input name="processTime" type="text" class="layui-input" id="processTime"/>
                                    </div>
                                </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                        <div class="layui-form-label label_reset">
                                            <select name="orderType">
                                                <option value="0">跟踪号</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input name="trackNos" type="text" class="layui-input" placeholder="支持多个精确查询,英文逗号分隔"/>
                                        </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2 pl20">
                                    <button id="sp_searchBtn" class="layui-btn layui-btn-sm" type="button">查询</button>
                                    <button type="reset" id="sp_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="sprintpackorderCard">
                <div class="layui-card-body">
                    <table class="layui-table" id="sprintpack_table" lay-filter="sprintpack_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 表格渲染模板 -->
<script type="text/html" id="sprintPackOrder_pl_processedTime">
    {{Format(d.processedTime,'yyyy-MM-dd hh:mm:ss')}}
</script>

<script type="text/html" id="pl_useStatus">
    {{d.isUsed?'<span style="color: grey;">已使用</span>':'<span style="color: green;">未使用</span>'}}
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
        elem: '#processTime', //指定元素
        range:true,
        type: 'date'
    });
    
   var tableIns = table.render({
    elem: "#sprintpack_table",
        method: 'post',
        url:ctx + "/ebayostorder/tracknolist.html",
        cols: [
            [
                {checkbox:true,width:30},
                // { field: "allrootNid",title: "普源订单编号"},
                { field: "trackNo",title: "跟踪号"},
                { field: "processedTime",title: "processed时间",templet:'#sprintPackOrder_pl_processedTime'},
                { field: "isUsed",title: '使用状态',templet:'#pl_useStatus'},
            ],
        ],
        created:function(res){
            console.log(res);
            res.data = res.data.list;
        },
        id: "sprintpack_table",
        page:true,
        limits:[100,200,500,1000],
        limit:100,
        where:getSearchData(),
   });
   function getSearchData(){
       var data = serializeObject($('#sp_searchForm'));
        data.startTime = data.processTime.split(' - ')[0]?data.processTime.split(' - ')[0]:"";
        data.endTime = data.processTime.split(' - ')[1]?data.processTime.split(' - ')[1] + " 23:59:59":"";
        return data;
   }
    //表单查询
    $('#sp_searchBtn').click(function(){
        tableIns.reload({
            where:getSearchData(),
        })
    });
    //表单清空
    $('#sp_searchReset').click(function(){
    $("#sp_searchForm input").each(function(index,item){
        $(item).val("");
    });
    return false
   });
});

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