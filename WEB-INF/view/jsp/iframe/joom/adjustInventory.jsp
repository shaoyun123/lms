<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>joom调整库存</title>
<style> 
  #adjustInventory_Form .layui-form-item{
       margin-bottom:0
  }
  .joomadjustInventory-item-label{
      width:60px
  }
  .joomadjustInventory-item-input{
      width:250px !important;
  }
  .joomadjustStock-font-weight{
      font-weight: bolder;
  }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustInventory_Form" class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label joomadjustInventory-item-label">商品SKU</label>
                                <div class="layui-input-inline joomadjustInventory-item-input">
                                    <input type="hidden" name="idList" id="adjustInventory_Form_idList">
                                    <input type="text" name="prodSSkuList" autocomplete="off" class="layui-input" placeholder="默认精确查询，英文逗号分隔" onblur="joomadjustInventory_handleSku(this.value,event)">
                                </div>
                                <div class="layui-col-md3 layui-cil-lg3">
                                    <select name="searchType" id="joom_modifyStock_skuSearchType">
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                                <button type="button" id="joomadjustInventory_newStockBySku" class="layui-btn layui-btn-normal layui-btn-sm">一键调整</button>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label joomadjustInventory-item-label" >店铺</label>
                                <div class="layui-input-inline joomadjustInventory-item-input">
                                    <select xm-select="joom_selectAttr_store" id="joom_selectAttr_store" name="storeAcctIdList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="adjustPriceResetBtn">清空</button>
                            </div>
                            <div style="float:right;margin-top:5px;">
                                 <button type="button" id="adjustInventory_Form_newStockBtn" class="layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                            	<div class="layui-input-inline">
                            	<input type="text" class="layui-input" id="adjustInventory_Form_newStockInput" name="newStockInput" style="height:28px">
                                </div>
                                <button type="button" id="batchEnableProd" class="layui-btn layui-btn-normal layui-btn-sm">批量调整</button>
                            </div>
                        </div>                          
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">数量(<span id="tolnum_span_joomAI_stock"></span>)</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="joom_adjustInventoryTable" lay-filter="joom_adjustInventoryTable"></table>
                    <script type="text/html" id="currPriceTpl">
                        <div>{{ d.currPrice }}</div> 
                    </script>
                    <script type="text/html" id="joom_newStockTpl">
                        <input type="text" class="layui-input joom_newStockTpl_newStock" style="height:28px">
                    </script>
                    <script type="text/html" id="saleStatsTpl">
                          {{# if(d.isSale != null){ }}
                            {{# if(d.isSale == '1'){ }}
                          	<span style="color:blue">上架中</span>
							 {{# }else if(d.isSale == '0'){ }}
								<span style="color:red">已下架</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 通过sku调整库存 -->
<script type="text/html" id="joomadjustInventory_stockBySku_modal">
    <div class="layui-card watermark">
        {{# if(d.count != 0 ){ }}
            <div class="layui-card-header">本次共调整<span class="joomadjustInventory-font-weight ml10 mr10">{{d.count}}</span>个SKU（已去重）</div>
            <div class="layui-card-body">
                <form action="" class="layui-from" id="joomadjustInventory_stockBySku_form">
                    <div class="layui-form-item">
                        <label class="layui-form-label">
                            <font class="fRed">*</font>调整库存为:
                        </label>
                        <div class="layui-input-block">
                            <input type="number" min="0" class="layui-input" name="count">
                        </div>
                    </div>
                </form>
            </div>
        {{# }else{ }}
            <div class="taCenter">无有效商品SKU，请重新输入</div>
        {{# } }}
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/joom/adjustInventory.js"></script>
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
    // layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
    // 	var formSelects = layui.formSelects;
    // 	var platAccts = [];
    // 	$.ajax({
	// 		 type: "POST",
	// 		 url: ctx + "/joomIsEnableProduct/getPlatData.html",
	// 		 data: {},
	// 		 async: false,
	// 		 dataType: "json",
	// 		 success: function (returnData) {
	// 			 for(var i=0;i<returnData.length;i++){
	// 				 var a = {name: returnData[i].storeAcct, value:returnData[i].id}
	// 				 platAccts.push(a);
	// 			 }
	// 	    	//属性多选
	// 	       // select_multi('selectAttr_store',platAccts)
	// 		  formSelects.data('joom_selectAttr_store','local',{arr:platAccts})
	// 		 },
	// 		 error: function () {
	// 			 layer.msg("服务器正忙");
	// 		 }
	// 	 });
    // })
</script>