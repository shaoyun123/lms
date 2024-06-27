<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<style>
    .dis_flex{
        display: flex;
        justify-content:space-between;
    }
    .ml{
        margin-left: 5px;
    }
</style>
<title>添加活动登记</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-lg10 layui-col-md10">
                                    <label class="layui-form-label">产品id</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="itemIdList" class="layui-input">
                                    </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <button type="button" id="search_prod_p_info" class="layui-btn layui-btn-sm ml20 keyHandle" data-type="reload" >查询</button>
                            </div>
                             <div class="layui-col-lg5 layui-col-md5">
                                 <label class="layui-form-label">活动开始时间</label>
                                 <div class="layui-input-block">
                                     <input type="text" name="startTime" id="startTime" class="layui-input">
                                 </div>
                            </div>
                            <div class="layui-col-lg5 layui-col-md5">
                                <label class="layui-form-label">活动结束时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="endTime" id="endTime" class="layui-input">
                                </div>
                            </div>

                        </div>
                        <div id="shopeeAddActvtCustomsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex">
                    <div class="layui-card-header">数量(<span id="tolnum_span_shopee"></span>)</div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="shopee_actvt_prod_table" lay-filter="shopee_actvt_prod_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="actvtPriceTpl">
    <input type="text" class="layui-input" name="actvtPrice_{{d.itemId}}" id="actvtPrice_{{d.itemId}}"  style="height:28px"    }}>
</script>
<script type="text/html" id="actvtNumTpl">
    <input type="text" class="layui-input" name="actvtNum_{{d.itemId}}" id="actvtNum_{{d.itemId}}" style="height:28px"    }}>
</script>
<script type="text/html" id="addShopeeActivt_modifyactivtyprice">
    <div class="dis_flex">
        <input type="number" id="addShopeeActivt_modifyactivtyprice_input" class="layui-input">
        <button type="button" id="addShopeeActivt_modifyactivtyprice_btn" class="layui-btn layui-btn-sm layui-btn-normal ml">修改活动价</button>
    </div>
</script>
<script type="text/html" id="addShopeeActivt_modifyactivtyamount">
    <div class="dis_flex">
        <input type="number" id="addShopeeActivt_modifyactivtyamount_input" class="layui-input">
        <button type="button" id="addShopeeActivt_modifyactivtyamount_btn" class="layui-btn layui-btn-sm layui-btn-normal ml">修改活动数量</button>
    </div>
</script>
<div class="disN p20" id="chooseCateLayer">
</div>
<script>
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$;
    laydate.render({
        elem: '#endTime'
        ,type: 'date'
    });
    laydate.render({
        elem: '#startTime'
        ,type: 'date'
    });
    function tableReload(obj) {
        shopeetableIns = table.render({
            elem: "#shopee_actvt_prod_table",
            method:'post',
            url: ctx + "/shopee/msgActivityShopee/getActivityInfoByItemId.html",
            cols: [[
                /*{type: "checkbox"},*/
                { field: "id", title: "id" },
                { field: "storeAcctId", title: "店铺id"},
                { field: "storeAcct", title: "店铺" , width: '20%'},
                { field: "itemId", title: "item_id", width: '20%'},
                { field: "prodPSku", title: "商品父SKU", width: '10%'},
                { field: "listingPrice", title: "原价", width: '10%'},
                { field: "currPrice", title: "现价", width: '10%'},
                { field: "actvtPrice", title:$('#addShopeeActivt_modifyactivtyprice').html(),templet:'#actvtPriceTpl', width: '10%' },
                { field: "actvtNum", title: $('#addShopeeActivt_modifyactivtyamount').html(),templet:'#actvtNumTpl', width: '10%' },
            ]],
            where:obj,
            page:false,
            id:"shopee_actvt_prod_table",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
                tableData = res;
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_before").text("共"+count+"条");
                $('#addShopeeActivt_modifyactivtyprice_btn').click(function(){
                    var modifyactivtyprice = $('#addShopeeActivt_modifyactivtyprice_input').val()
                    if(modifyactivtyprice!==""){
                        $('td[data-field="actvtPrice"] input').val(modifyactivtyprice)
                    }else{
                        layer.msg("活动价格不能为空")
                    }
                })
                $('#addShopeeActivt_modifyactivtyamount_btn').click(function(){
                    var modifyactivtyamount  = $('#addShopeeActivt_modifyactivtyamount_input').val()
                    if(modifyactivtyamount!==""){
                        $('td[data-field="actvtNum"] input').val(modifyactivtyamount)
                    }else{
                        layer.msg("活动数量不能为空")
                    }
                })
            }
        });
    }
    var active = {
        reload: function () {
            var itemIdList = $("#adjustPriceSearchForm input[name=itemIdList]").val();
            if(itemIdList ==null || itemIdList==''){
                layer.msg("请输入产品id！");
                return;
            }
            var obj = new Object();
            obj.itemIds = itemIdList;
            tableReload(obj);
        }
    };
    $("#search_prod_p_info").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
})
</script>