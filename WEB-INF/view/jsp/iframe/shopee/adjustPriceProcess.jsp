<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" />
<link
  rel="stylesheet"
  href="${ctx}/static/font_iconfont/iconfont.css"
  media="all"
/>
<style>
    .dis_flex{
        display: flex;
        justify-content:space-between;
    }
</style>
<title>调整原价和促销价</title>
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
                            <%--<div class="layui-col-lg1 layui-col-md1">--%>
                                         <%--<select id="shopee_adjustPrice_skuSearchType">--%>
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
                                <div class="layui-col-lg1 layui-col-md1">
                                    <select id="shopee_adjustPrice_skuSearchType">
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">itemId</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="itemId" id="shopeeOnline_adjustPP_itemId" class="layui-input" placeholder="默认精确查询，且itemId数量不超过1000个" onblur="shopeeOnline_adjustPP_handleItemIds(this.value,event)">
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">vari_id</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="variIdList" id="shopeeOnline_adjustPP_variId" class="layui-input" placeholder="默认精确查询，且vari_id数量不超过3000个" onblur="shopeeOnline_adjustPP_handleVariIds(this.value,event)">
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                        <select type="text" name="salesPerson"  class="users_hp_custom"
                                            data-rolelist="shopee专员" lay-filter="shopeeOnline_adjustPP_salesPerson"
                                            id="shopeeOnline_adjustPP_salesPerson"
                                        ></select>
                                    </div>
                                </div>
                             <div class="layui-col-lg5 layui-col-md5">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block" lay-filter="component-form-element">
                                       <select xm-select="selectAttr_store"  name="storeList" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal" data-platcode="shopee"
                                            class="users_hp_store_multi" id="shopeeOnline_adjustPP_store"
                                       >
                                      </select>
                                    </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                        <button class="layui-btn layui-btn-sm ml20 keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary" id="adjustPriceResetBtn">清空</button>
                            </div>
                            <!-- <div class="layui-col-lg1 layui-col-md1" style="text-align:right">
                                    <button type="button" id="batchUpadatePrice" class="layui-btn layui-btn-normal layui-btn-sm">批量修改</button>
                            </div> -->
                            <!-- 这个留着是弄样式的，为了让刊登原价另起一行，（去掉这个也是可以的） -->
                            <div class="layui-col-md5 layui-col-lg5">
                                <label class="layui-form-label"></label>
                                <div class="layui-input-block">
                                </div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6" style="margin-top:5px;">
                                <div class="layui-col-md2 layui-col-lg2">
                                        <select name="originPriceType">
                                            <option value="0">当前销售价</option>
                                            <option value="1">当前原价</option>
                                            <option value="2">销售价定价</option>
                                            <option value="3">原价定价</option>
                                        </select>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                        <select name="calculateType">
                                            <option value="1"><b>+</b></option>
                                            <option value="2">-</option>
                                            <option value="3" selected>*</option>
                                            <option value="4">=</option>
                                        </select>

                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <input type="number" class="layui-input" name="newPriceInput">
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                        <button type="button" id="newPriceBtn" class="fr layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                                </div>
                        </div>
                        </div>
                        <div id="shopeeAdjustPriiceCustomsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex">
                    <div class="layui-card-header">数量(<span id="tolnum_span_shopee"></span>)</div>
                    <form class="layui-form" id="shop_adjustPrice_filtForm">
                        <div style="display:inline-block">
                            <label class="layui-form-label">差价</label>
                            <div class="layui-input-block disflex w300">
                                <div class="w100">
                                    <select name="operator">
                                        <option value="">请选择</option>
                                        <option value="1">&gt;</option>
                                        <option value="2">&lt;</option>
                                        <option value="3">=</option>
                                    </select>
                                </div>
                                <div class="w100">
                                    <input type="number" name="diffPrice" class="layui-input">
                                </div>
                                <button class="layui-btn layui-btn-sm ml20 keyHandle" type="button" data-type="reload" id="shop_adjustPricefilterPrice">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary ml20" id="shop_adjustPriceOrigin">清空</button>
                            </div>
                        </div>
                        <input type="checkbox" name="isProcessDis" title="不处理原价加价" id="isProcessDis" lay-skin="primary" checked>
                        <button type="button" id="batchUpadatePrice" class="fr layui-btn layui-btn-normal layui-btn-sm">批量调价</button>
                    </form>
                </div>
                <div class="layui-card-body" id="shopee_online_adjustPP_card">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="adjustPriceTable" lay-filter="adjustPriceTable"></table>
                    <script type="text/html" id="currPriceTpl">
                        <div>{{ d.currPrice }}</div>
                    </script>
                    <script type="text/html" id="newPriceTpl">
                        {{# if(d.newCurrPrice==0 || d.newCurrPrice==null){ }}
                        <input type="text" class="layui-input" style="height:28px"   value="">
                        {{# }else{ }}
                        <input type="text" class="layui-input" style="height:28px"   value={{ d.newCurrPrice.toFixed(2) || '' }} onblur="shopee_adjust_price_newcurrprice_radio(this)">
                            {{#if(d.newCurrPriceWithoutFloat ===null ||d.newCurrPriceWithoutFloat ===undefined  ){ }}
                                <div></div>    
                            {{# }else if(d.newCurrPriceRadio ==0 ){ }}
                                <div class="fGreen">-</div>
                            {{# }else if(d.newCurrPriceRadio>0){ }}
                                <div class="fGreen"><i class="el-icon-top"></i>{{Math.abs(d.newCurrPriceRadio)}}%</div>
                            {{#  }else{ }}
                                <div class="fRed"><i class="el-icon-bottom"></i>{{Math.abs(d.newCurrPriceRadio)}}%</div>
                            {{#  } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="newListingPriceTpl">
                        {{# if(d.newListingPrice==0 || d.newListingPrice==null){ }}
                        <input type="text" class="layui-input" style="height:28px"   value="">
                        {{# }else{ }}
                        <input type="text" class="layui-input" style="height:28px"   value={{ d.newListingPrice.toFixed(2) || '' }} onblur="shopee_adjust_price_newlistingprice_radio(this)">
                            {{#if(d.newListingPriceWithoutFloat ===null ||d.newListingPriceWithoutFloat ===undefined  ){ }}
                                <div></div>    
                            {{# }else if(d.newListingPriceRadio ==0 ){ }}
                                <div class="fGreen">-</div>
                            {{# }else if(d.newListingPriceRadio>0){ }}
                                <div class="fGreen"><i class="el-icon-top"></i>{{Math.abs(d.newListingPriceRadio)}}%</div>
                            {{#  }else{ }}
                                <div class="fRed"><i class="el-icon-bottom"></i>{{Math.abs(d.newListingPriceRadio)}}%</div>
                            {{#  } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="diffPriceTpl">
                        {{# if(d.newPrice!=0 && d.newPrice!=null){ }}
                            <div> {{ (d.newPrice-d.currPrice).toFixed(1) }}</div>
                        {{# } }}
                    </script>
                    <script type="text/html" id="customsBar">
                        <a class="layui-btn layui-btn-xs" lay-event="edit">保存</a>
                        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">一键应用</a>
                    </script>
                     <script type="text/html" id="isPromotionTpl">
                        {{# if(d.isMultiSku != null){ }}
                            {{# if(d.isPromotion == 1){ }}
                          	<span style="">是</span>
							 {{# }else if(d.isPromotion == 0){ }}
								<span style="">否</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                     <script type="text/html" id="shopee_diffPriceProTpl">
                         <div>{{ (((d.newPrice-d.currPrice)/d.currPrice)*100).toFixed(2)}}%</div>
                    </script>
                    <script type="text/html" id="shopee_adjustPrice_info">
                        <input type="text" hidden name="newListingPriceWithoutFloat" value="{{d.newListingPriceWithoutFloat}}">
                        <input type="text" hidden name="currPrice" value="{{d.currPrice}}">
                        <input type="text" hidden name="listingPrice" value="{{d.listingPrice}}">
                        <input type="text" hidden name="newCurrPriceWithoutFloat" value="{{d.newCurrPriceWithoutFloat}}">
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="disN p20" id="chooseCateLayer">
</div>

<script type="text/html" id="shopee_adjustPP_addonModal">
    <div class="layui-card">
        <div class="layui-card-body">
            <div class="disFCenter">
                <div></div>
                <button class="layui-btn layui-btn-sm layui-btn-danger" type="button" id="shopee_adjustPP_addon_cancel">取消修改原价和促销价</button>
            </div>
            <div id="shopee_adjustPP_addon_table" style="width: 100%; height: 500px" class="ag-theme-balham"></div>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/adjustPriceProcess.js"></script>
<!-- <script>
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
    var form = layui.form
	var platAccts = [];



	// $.ajax({
	// 	 type: "POST",
	// 	 url: ctx + "/shopee/shopeeIsEnableProduct/getPlatData.html",
	// 	 data: {},
	// 	 async: false,
	// 	 dataType: "json",
	// 	 success: function (returnData) {
	// 		 for(var i=0;i<returnData.length;i++){
	// 			 var a = {name: returnData[i].storeAcct, value:returnData[i].id}
	// 			 platAccts.push(a);
	// 		 }
	//     	//属性多选
	//         //select_multi('selectAttr_store',platAccts)
	//         formSelects.data('selectAttr_store','local',{arr:platAccts})
	// 	 },
	// 	 error: function () {
	// 		 layer.msg("服务器正忙");
	// 	 }
	//  });
}) -->
</script>