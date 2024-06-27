<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>joom父商品上下架</title>
<style> 
  #adjustPriceSearchForm .layui-form-item{
       margin-bottom:0
  }

.dis_flex{
    display: flex;
    justify-content: space-between;
}
.w_8{
    width:8%;
}
.w_90{
    width:90%;
}
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item">
                            <%--<div class="layui-col-lg3 layui-col-md3">--%>
                                <%--<label class="layui-form-label">商品父SKU</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                <%--<select id="joom_idEnable_pskuSearchType">--%>
                                    <%--<option value="0">模糊</option>--%>
                                    <%--<option value="1">精确</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">商品父SKU</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select id="joom_idEnable_pskuSearchType">
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
	                                <select name="is_sale_p" id="is_sale_p">
	                                    <option value='1'>上架中<option>
	                                    <option value='0'>已下架<option>
	                                </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="text-align:right">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="adjustPriceResetBtn">清空</button>
                            </div>
                        </div>                          
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-header">
                <div class="numCount w_8" style="text-align:center;padding:0 5px;">数量(<span id="tolnum_span_joom_stop"></span>)</div>
                <div class="dis_flex w_90">
                        <button type="button" id="batchEnableProd" class="layui-btn layui-btn-normal layui-btn-sm">批量上架</button>
                        <button type="button" id="joom_batchDisEnableParentProd" class="layui-btn layui-btn-danger layui-btn-sm">批量下架</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="enableProdTable" lay-filter="adjustPriceTable"></table>
                    <script type="text/html" id="currPriceTpl">
                        <div>{{ d.currPrice }}</div> 
                    </script>
                    <script type="text/html" id="newPriceTpl">
                        <input type="text" class="layui-input" id="newPrice" style="height:28px"   value={{ d.newPrice || '' }}>
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
<script type="text/javascript" src="${ctx}/static/js/publishs/joom/isEnablePProduct.js"></script>
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
		        //select_multi('selectAttr_store',platAccts)
			  formSelects.data('selectAttr_store','local',{arr:platAccts})
			 },
			 error: function () {
				 layer.msg("服务器正忙");
			 }
		 });
    })
</script>