<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>shopee调整备货天数</title>
<style> 
  #adjustPriceSearchForm .layui-form-item{
       margin-bottom:0
  }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label">商品父SKU</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <select id="shopee_modifyStoct_skuSearchType">
                                        <option value="0">模糊</option>
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-inline">
                                    <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="adjustPriceResetBtn">清空</button>
                            </div>
                            <div style="float:right;margin-top:5px;">
                                 <button type="button" id="newStockBtn" class="layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                            	<div class="layui-input-inline">
                            	<input type="text" class="layui-input" id="newDaysToShip" name="newDaysToShip" style="height:28px">
                                </div>
                                <button type="button" id="batchEnableProd" class="layui-btn layui-btn-normal layui-btn-sm">批量调整</button>
                            </div>
                        </div>                          
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">数量(<span id="tolnum_span_shopee_daytoship"></span>)</div>
                <div class="layui-card-body">
                 <table class="layui-table" id="modifyDaysToShipTable" lay-filter="modifyDaysToShipTable"></table>
                    <script type="text/html" id="newDaysToShipTpl">
                        <input type="text" class="layui-input" id="newDaysToShip" name="newDaysToShip" style="height:28px">
                        <input type="text" class="hidden" name="globalItemId" value="{{d.globalItemId}}">
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/modifyDayToShip.js"></script>
<script>
    //多选渲染函数
    function select_multi(name, arr) {
        var formSelects = layui.formSelects
        formSelects.render({
            name: name, //xm-select的值
            type: 2, //select样式为checkbox
            data: {
                arr: arr,
                name: 'content', //这个对应数组项的属性,如{content: '属性1',value: 'attr1'},name就是content,val就是attr1
                val: 'value'
            }
        })
    }
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
    	var formSelects = layui.formSelects;
    	var platAccts = [];
    	$.ajax({
			 type: "POST",
			 url: ctx + "/shopee/shopeeIsEnableProduct/getPlatData.html",
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