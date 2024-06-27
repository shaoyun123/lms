<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>ebay调价信息</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                              <div class="layui-col-lg3 layui-col-md3">
                                  <label class="layui-form-label">商品SKU</label>
                                  <div class="layui-input-block">
                                      <input type="text" name="sSkuList" class="layui-input" placeholder="默认精确查询,且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                  </div>
                              </div>
                             <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" lay-filter="component-form-element">
                                  <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">>
                                    </select>
                                </div>
                            </div>
                            

                            <div class="layui-col-lg2 layui-col-md2">
                                        <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary" id="adjustPriceResetBtn">清空</button>  
                            </div>
                           
                        </div>                          
                        <div id="ebayAdjustPriceCustomsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="ebayAdjustPriceCustomsCard">
                <div class="layui-card-header">
                  <div style="display: flex;">
                    <div style="width: 120px;">数量(<span id="tolnum_span_ebay"></span>)</div>
                    <div class="layui-form layui-row" style="flex: 1;">
                      <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">毛利率</label>
                        <div class="layui-input-block" style="display: flex;">
                            <input type="text" name="grossProfitRate" class="layui-input" placeholder="毛利率">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="adjustPricePriceBtn">定价</span>
                        </div>
                      </div>
                      <div class="layui-col-md4 layui-col-lg4">
                          <label class="layui-form-label">
                            当前价格
                          </label>
                          <div class="layui-input-block" style="display: flex;">
                            <select name="calculateType">
                              <option value="1"><b>+</b></option>
                              <option value="2">-</option>
                              <option value="3" selected>*</option>
                              <option value="4">/</option>
                            </select>
                            <input type="number" class="layui-input" name="newPriceInput">
                            <button type="button" id="newPriceBtn" class="fr layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                          </div>
                      </div>
                      <div class="layui-col-md3 layui-col-lg3">
                          <div class="layui-form-label">
                            差价
                          </div>
                          <div class="layui-input-block" style="display: flex;">
                            <select name="subPriceType">
                              <option value="1"><b>></b></option>
                              <option value="2"><</option>
                              <option value="3" selected>=</option>
                            </select>
                            <input  class="layui-input" name="subPriceInput">
                            <span class="layui-btn layui-btn-sm fr" id="ebaySubPriceInput">搜索</span>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                        <button type="button" id="batchUpadatePrice" class="fr layui-btn layui-btn-normal layui-btn-sm">批量调价</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="adjustPriceTable" lay-filter="adjustPriceTable"></table>
                    <script type="text/html" id="currPriceTpl">
                        <div>{{ d.currPrice }}</div> 
                    </script>
                    <script type="text/html" id="newPriceTpl">
                        {{# if(d.newPrice==0){ }}
                        <input type="text" class="layui-input" style="height:28px"   value="">
                        {{# }else{ }}
                        <input type="text" class="layui-input" id="newPrice" name="newPrice" style="height:28px" value={{ (d.newPrice !== undefined && d.newPrice !== '' && d.newPrice.toFixed(2)) || '' }}>
                        {{# } }}
                        <input type="hidden" name="id" value="{{d.id}}">
                    </script>
                    <script type="text/html" id="locationCountryTpl">
                       <div>{{ d.location }} / {{ d.country }}</div> 
                    </script>
                    <script type="text/html" id="diffPriceTpl">
                        {{# if(d.newPrice && d.newPrice!=0){ }}
                            <div> {{ (d.newPrice-d.currPrice).toFixed(2) }}</div>
                        {{# } }}
                        {{# if(!d.newPrice){ }}
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
<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/adjustPriceProcess.js"></script>
<!--订单是否状态的开启和关闭-->
<script type="text/html" id="isAttractSkuTpl">
    <div class="layui-form-item" data-isattractsku="{{d.isAttractSku}}">
        {{# if(d.isAttractSku){ }}
        <div>是</div>
        {{# }else{ }}
        <div>否</div>
        {{# } }}
        <div style="display: none">{{d.itemId}}</div>
        <div style="display: none">{{d.storeSku}}</div>
        <div style="display: none">{{d.storeAcctId}}</div>
        <div style="display: none">{{d.pId}}</div>

    </div>
</script>
<script type="text/html" id="isLockPriceTpl">
    <div class="layui-form-item" >
        {{# if(d.isLockPrice){ }}
        <input  type="checkbox" lay-skin="switch" name="isLockPrice" lay-text="是|否"
                checked>
        {{# }else{ }}
        <input  type="checkbox" lay-skin="switch" name="isLockPrice" lay-text="是|否">
        {{# } }}
        <div style="display: none">{{d.id}}</div>
    </div>
</script>
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
	        //select_multi('selectAttr_store',platAccts)
		  formSelects.data('selectAttr_store','local',{arr:platAccts})
		 },
		 error: function () {
			 layer.msg("服务器正忙");
		 }
	 });
})
</script>