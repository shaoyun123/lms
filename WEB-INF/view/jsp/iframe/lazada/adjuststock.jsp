<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>lazada调整库存</title>
<style> 

</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="lazadamodifystockForm" class="layui-form">
                        <div class="layui-form-item">
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<div class="layui-form-label" style="padding: 0px">--%>
                                  <%--<select name="skuType">--%>
                                    <%--<option value="0">商品子sku</option>--%>
                                    <%--<option value="1">商品父sku</option>--%>
                                  <%--</select>--%>
                                <%--</div>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input type="text" name="skuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                <%--<select name="searchType">--%>
                                    <%--<option value="0">模糊</option>--%>
                                    <%--<option value="1">精确</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <div class="layui-form-label" style="padding: 0px">
                                        <select name="skuType">
                                            <option value="0">商品子sku</option>
                                            <option value="1">商品父sku</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" name="skuList" autocomplete="off" class="layui-input" placeholder="默认精确查询" onblur="handleSkuMax(this.value,event)">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select name="searchType">
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="lazada_adjuststock_org" lay-filter="lazada_adjuststock_org" class="orgs_hp_custom">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select id="lazada_adjuststock_users" lay-filter="lazada_adjuststock_users" class="users_hp_custom" data-rolelist="lazada专员">
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="lazada_adjuststock_store" name="storeAcctIdList" class="store_hp_custom" data-platcode="lazada">
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale">
                                        <option value="">全部</option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" id="lazadaadjustSearch" lay-filter="lazadaadjustSearch" lay-submit="lazadaadjustSearch">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="">清空</button>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                 <button type="button" id="lazadastockApply" class="layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                            	<div class="layui-input-inline" style="width:120px;">
                            	<input type="number" class="layui-input" id="newStockpatch" name="newStockpatch" style="height:28px;">
                                </div>
                                <button type="button" id="adjustpatch" class="layui-btn layui-btn-normal layui-btn-sm">一键调整</button>
<%--                                <a type="button" id="lazadaAdjustStock_newStockBySku" class="layui-btn layui-btn-normal layui-btn-sm">一键调整</a>--%>
                            </div>
                        </div>                          
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">数量(<span id="lazadastockNum"></span>)</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="lazadamodifyStockTable" lay-filter="lazadamodifyStockTable"></table>
                    <script type="text/html" id="lazadastock_priceInfo">
                        <input type="number" class="layui-input newStock" style="height:28px">
                    </script>
                    <script type="text/html" id="lazadastock_isSale">
                        {{# if(d.isSale != null){ }}
                        {{# if(d.isSale == '1'){ }}
                        <span style="color:blue">在售</span>
                        {{# }else if(d.isSale == '0'){ }}
                        <span style="color:red">停售</span>
                        {{#  } }}
                        {{# } }}
                    </script>

                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/lazada/adjuststock.js"></script>
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
   /* layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
    	var formSelects = layui.formSelects;
      var platAccts = [];
    	$.ajax({
			 type: "POST",
			 url: ctx + "/lazadaBatchOperation/getPlatData.html",
			 data: {},
			 async: false,
			 dataType: "json",
			 success: function (returnData) {
				 for(var i=0;i<returnData.length;i++){
					 var a = {name: returnData[i].storeAcct, value:returnData[i].id}
					 platAccts.push(a);
				 }
			  formSelects.data('selectAttr_store','local',{arr:platAccts})
			 },
			 error: function () {
				 layer.msg("服务器正忙");
			 }
		 });
    })*/
</script>

<!-- 通过sku调整库存 -->
<script type="text/html" id="lazadaAdjustStockBySkuModal">
    <div class="layui-card watermark">
        {{# if(d.count != 0 ){ }}
        <div class="layui-card-header">本次共调整<span class="shopeeadjustStock-font-weight ml10 mr10">{{d.count}}</span>个SKU（已去重）</div>
        <div class="layui-card-body">
            <form action="" class="layui-from" id="lazadaAdjustStockBySkuForm">
                <div class="layui-form-item">
                    <label class="layui-form-label">
                        <font class="fRed">*</font>调整库存为:
                    </label>
                    <div class="layui-input-block">
                        <input type="number" min="0" class="layui-input" name="count" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                    </div>
                </div>
            </form>
        </div>
        {{# }else{ }}
        <div class="taCenter">无有效商品SKU，请重新输入</div>
        {{# } }}
    </div>
</script>