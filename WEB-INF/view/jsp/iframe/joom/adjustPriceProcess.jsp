<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>joom调价信息</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <%--<div class="layui-col-lg3 layui-col-md3">--%>
                                    <%--<label class="layui-form-label">商品SKU</label>--%>
                                    <%--<div class="layui-input-block">--%>
                                        <%--<input type="text" name="sSkuList" class="layui-input" placeholder="默认模糊查询">--%>
                                    <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                    <%--<select id="joom_adjustPrice_skuSearchType">--%>
                                        <%--<option value="0">模糊</option>--%>
                                        <%--<option value="1">精确</option>--%>
                                    <%--</select>--%>
                                <%--</div>--%>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">商品SKU</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="sSkuList" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select id="joom_adjustPrice_skuSearchType">
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                             <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block" lay-filter="component-form-element">
                                   		 <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">>
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
                                    <div class="layui-col-md3 layui-col-lg3 disflex ml40">
                                            <button type="button" id="newPriceBtn" class="fr layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                                    </div>
                            </div>
                            <div class="layui-col-md5 layui-col-lg5 ml10">
                                <button type="button" id="batchUpadatePrice" class="fr layui-btn layui-btn-normal layui-btn-sm">批量修改</button>
                            </div>
                        </div>                          
                        <div id="joomAdjustPriceCustomsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">数量(<span id="tolnum_span_joom"></span>)</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="adjustPriceTable" lay-filter="adjustPriceTable"></table>
                    <script type="text/html" id="currPriceTpl">
                        <div>{{ d.currPrice.toFixed(2) }}</div> 
                    </script>
                    <script type="text/html" id="adjustPriceProcess_Msrp">
                        <input type="number" class="layui-input" style="height:28px" value="{{ d.msrp}}" onkeyup="adjustPriceProcess_Msrp_KeyUp(this)">
                    </script>
                    <script type="text/html" id="adjustPriceProcess_oldMsrp">
                        {{ d.msrp}}
                    </script>
                    <script type="text/html" id="newPriceTpl">
                        {{# if(d.newPrice==0 || d.newPrice==null){ }}
                            <input type="text" class="layui-input" style="height:28px" onkeyup="adjustPriceProcess_newPriceTpl_KeyUp(this)" value="">
                        {{# }else{ }}
                            <input type="text" class="layui-input" style="height:28px" onkeyup="adjustPriceProcess_newPriceTpl_KeyUp(this)" value={{ d.newPrice.toFixed(2) || '' }}>
                        {{# } }}
                    </script>
                     <script type="text/html" id="newShippingTpl">
                         {{# if(d.newShipping==0 || d.newShipping==null){ }}
                             <input type="text" class="layui-input" style="height:28px"  value="" disabled>
                         {{# }else{ }}
                            <input type="text" class="layui-input" id="newShipping" style="height:28px" value={{ d.newShipping.toFixed(2) || ''}} disabled>
                         {{# } }}
                    </script>
                    <script type="text/html" id="newShippingWeightTpl">
                        <input type="text" disabled class="layui-input" id="newShippingWeight" style="height:28px" value={{ d.newShippingWeight || ''}}>
                    </script>
                    <script type="text/html" id="diffPriceTpl">
                        {{# if(d.newPrice!=0 && d.newPrice!=null){ }}
                            <div> {{ (d.newPrice-d.currPrice).toFixed(2) }}</div>
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
<script type="text/javascript" src="${ctx}/static/js/publishs/joom/adjustPriceProcess.js"></script>
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
		 url: ctx + "/joomIsEnableProduct/getPlatData.html",
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