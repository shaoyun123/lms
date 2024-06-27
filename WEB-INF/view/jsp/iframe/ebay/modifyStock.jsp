<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>ebay调整库存</title>
<style> 
  #adjustPriceSearchForm .layui-form-item{
       margin-bottom:0
  }
  #adjustPriceSearchForm .layui-btn-sm{
      padding: 0 5px;
  }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item">
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<label class="layui-form-label">商品SKU</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                <%--<select id="Ebay_modifyStock_sskuSearchType">--%>
                                    <%--<option value="0">模糊</option>--%>
                                    <%--<option value="1">精确</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">商品SKU</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select id="Ebay_modifyStock_sskuSearchType">
                                        <%--<option value="0">模糊</option>--%>
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="adjustPriceResetBtn">清空</button>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" style="float:right;margin-top:5px;">
                                <button type="button" id="newStockBtn" class="layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                                <div class="layui-input-inline" style="width:120px;">
                                    <input type="number" class="layui-input" id="newStockInput" name="newStockInput" style="height:28px;">
                                </div>
                                <button type="button" id="batchEnableProd" class="layui-btn layui-btn-normal layui-btn-sm">批量调整</button>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                <div class="layui-col-md4 layui-col-lg4">
                                    <label class="layui-form-label">不处理原库存</label>
                                    <div class="layui-input-block">
                                        <select name="calculateType">
                                            <option value="1"><b>></b></option>
                                            <option value="3"><</option>
                                            <option value="2" selected>=</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <input type="number" class="layui-input" name="newStockAllInput">
                                </div>
                                <div class="layui-col-md4 layui-col-lg4">
                                    <label class="layui-form-label">销售数量</label>
                                    <div class="layui-input-block">
                                        <input type="number" class="layui-input" name="soldNumsBegin" min="0" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <input type="number" class="layui-input" name="soldNumsEnd" min="0" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                        </div>                          
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">数量(<span id="tolnum_span_ebay_stock"></span>)</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="modifyStockTable" lay-filter="modifyStockTable"></table>
                    <script type="text/html" id="currPriceTpl">
                        <div>{{ d.currPrice }}</div> 
                    </script>
                    <script type="text/html" id="newStockTpl">
                        <input type="text" class="layui-input newStock" style="height:28px">
                    </script>
                     <script type="text/html" id="locationCountryTpl">
                       <div>{{ d.location }} / {{ d.country }}</div> 
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
<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/modifyStock.js"></script>
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
			 url: ctx + "/ebayIsEnableProduct/getPlatData.html",
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