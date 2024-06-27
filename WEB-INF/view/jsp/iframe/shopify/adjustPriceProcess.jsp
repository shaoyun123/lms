<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>shopify调价商品</title>

<style>
#LAY_adjustPriceProcess .layui-form-label{
   padding: 9px 5px;
}
#LAY_adjustPriceProcess .layui-form-item .layui-inline {
    margin-right: 0; 
}
.fr{
    float: right;
}
</style>

<div class="layui-fluid" id="LAY_adjustPriceProcess">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" lay-filter="prod_search_form" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">商品SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" name="sSkuList" class="layui-input" placeholder="默认模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                    <select id="shopify_adjustPric_sskuSearchType">
                                        <option value="0">模糊</option>
                                        <option value="1">精确</option>
                                    </select>
                            </div>
                             <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
	                                	<select placeholder="" name="storeAcct" id="shopifyChangePrice_depart_sel" lay-search lay-filter="shopifyChangePrice_depart_sel" class="orgs_hp_custom"></select>
                               	</div>
                            </div>
                             <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
	                                	<select placeholder="" name="saleName" id="shopify_salesman_sel" lay-search lay-filter="shopify_salesman_sel" class="users_hp_custom" data-rolelist="shopify专员" ></select>
                             	</div>
                            </div>
                             <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block" lay-filter="component-form-element">
                                        <select  id="shopify_adjustPrice_store_sel"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"  class="store_hp_custom" data-platcode="shopify">
                                        </select>
                                    </div>
                            </div>

                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-col-md8 layui-col-lg8">
                                    <label class="layui-form-label">差价</label>
                                    <div class="layui-input-block">
                                        <select name="subPriceType">
                                            <option value="1"><b>></b></option>
                                            <option value="2"><</option>
                                            <option value="3" selected>=</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md4 layui-col-lg4">
                                    <input type="number" class="layui-input" name="subPriceInput">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                        <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="adjustPriceResetBtn">清空</button>   
                            </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <label class="layui-form-label">当前价格</label>
                                        <div class="layui-input-block">
                                            <select name="calculateType">
                                                <option value="1"><b>+</b></option>
                                                <option value="2">-</option>
                                                <option value="3" selected>*</option>
                                                <option value="4">=</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <input type="number" class="layui-input" name="newPriceInput">
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                            <button type="button" id="newPriceBtn" class="fr layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                            <button type="button" id="batchUpadatePrice" class="fr layui-btn layui-btn-normal layui-btn-sm">批量调价</button>
                                    </div>
                            </div>
                        </div>                          
                        <div id="shopifyAdjustPriceCustomsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">数量(<span id="tolnum_span_shopify"></span>)(只展示上架中的商品)</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="adjustPriceTable" lay-filter="adjustPriceTable"></table>
                    <script type="text/html" id="newPriceTpl">
                        {{# if(d.newPrice==0){ }}
                            <input type="text" class="layui-input" id="newPrice" name="newPrice" style="height:28px"   value="">
                        {{# }else{ }}
                            <input type="text" class="layui-input"  name="newPrice" style="height:28px"   value={{ d.newPrice.toFixed(2) || '' }}>
                        {{# } }}
                    </script>
                    <script type="text/html" id="shopifyOnline_change_price">
                        <input type="text" class="layui-input" id="newShipping" style="height:28px"   value="1">
                    </script>
                    <script type="text/html" id="diffPriceTpl">
                        {{# if(d.newPrice != 0){ }}
                            <div> {{ (d.newPrice-d.price).toFixed(2) }}</div>
                        {{# } }}
                    </script>
                    <script type="text/html" id="customsBar">
                        <a class="layui-btn layui-btn-xs" lay-event="edit">保存</a>
                        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">一键应用</a>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="disN p20" id="chooseCateLayer">
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopify/adjustPriceProcess.js"></script>
<script>
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
        var formSelects = layui.formSelects;
        var platAccts = [];
        $.ajax({
            type: "POST",
            url: ctx + "/shopifyBatchOperation/getPlatData.html",
            data: {},
            async: false,
            dataType: "json",
            success: function (returnData) {
                for(var i=0;i<returnData.length;i++){
                    var a = {name: returnData[i].storeAcct, value:returnData[i].id}
                    platAccts.push(a);
                }
                //属性多选
                // select_multi('selectAttr_store',platAccts)
                formSelects.data('selectAttr_store','local',{arr:platAccts})
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    })
</script>