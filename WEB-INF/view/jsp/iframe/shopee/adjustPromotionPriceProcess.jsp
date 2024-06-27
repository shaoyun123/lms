<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" />
<link
  rel="stylesheet"
  href="${ctx}/static/font_iconfont/iconfont.css"
  media="all"
/>
<title>调整促销价</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label labelSel">
                                    <select name="listType">
                                        <option value="sSkuList">商品子SKU</option>
                                        <option value="variIdList">vari_id</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" name="sSkuList" class="layui-input" placeholder="默认精确查询，且数量不能超过1000个" onblur="handleSku(this.value,event)">
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <select id="shopee_adjustPrice_skuSearchType">
                                    <option value="1">精确</option>
                                </select>
                            </div>
                            <div class="layui-col-lg5 layui-col-md5">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" lay-filter="component-form-element">
                                    <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                        <button class="layui-btn layui-btn-sm ml20 keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary" id="adjustPriceResetBtn">清空</button>
                            </div>

                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-col-md2 layui-col-lg2">
                                        <select name="originPriceType">
                                            <option value="0">当前销售价</option>
                                            <option value="1">销售价定价</option>
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
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-col-md2 layui-col-lg2">
                                  毛利率
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <input class="layui-input" name="newGrossRate" placeholder="填写小数,例如0.3">
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <button type="button" id="adjustPromotionPriceProcess_grossRate_batchSetBtn" class="fr layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <button type="button" id="batchUpadatePrice" class="fr layui-btn layui-btn-normal layui-btn-sm">批量调价</button>
                            </div>
                            <div class="layui-col-md12 layui-col-lg12 secondary">
                                促销价 = ((商品成本+包装成本) / 站点汇率 + 物流运费) / (1 - 平台提成 - 毛利率)
                            </div>
                            <div class="layui-col-md12 layui-col-lg12 secondary">
                                最低毛利促销价= ((商品成本+ 包装成本 + 最低毛利) / 站点汇率 + 物流运费) / (1 - 平台提成)
                            </div>
                        </div>
                        <div id="shopeePromotionPrice_customsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header disFCenter">
                    <div>数量(<span id="tolnum_span_shopee"></span>)</div>
                    <form class="layui-form" id="shop_promoadjustPrice_filtForm">
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
                            <button class="layui-btn layui-btn-sm ml20 keyHandle" type="button" data-type="reload" id="shop_promoadjustPricefilterPrice">搜索</button>
                            <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary ml20" id="shop_promoadjustPriceOrigin">清空</button>
                        </div>
                    </form>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="promoAdjustPriceTable" lay-filter="promoAdjustPriceTable"></table>
                    <script type="text/html" id="currPriceTpl">
                        <div>{{ d.currPrice }}</div>
                    </script>
                    <script type="text/html" id="newPriceTpl">
                        {{# if(d.newPrice==0 || d.newPrice==null){ }}
                        <span></span>
                        {{# }else{ }}
                        <span>{{ d.newPrice.toFixed(1) || '' }}</span>
                        {{# } }}
                    </script>
                    <script type="text/html" id="newCurrPriceTpl">
                        {{# if(d.newCurrPrice==0 || d.newCurrPrice==null){ }}
                        <input type="text"  class="layui-input" value="" name="newCurrPrice">
                        {{# }else{ }}
                        <input type="text" class="layui-input" name="newCurrPrice" value={{ d.newCurrPrice.toFixed(2) || '' }} onblur="shopeeadjustPromotionprice_newcurrprice_radio(this)">
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
                         <div name="isPromotion">
                             {{# if(d.isMultiSku != null){ }}
                             {{# if(d.isPromotion == 1){ }}
                             <span style="">是</span>
                             {{# }else if(d.isPromotion == 0){ }}
                             <span style="">否</span>
                             {{#  } }}
                             {{# } }}
                         </div>
                    </script>
                     <script type="text/html" id="diffPriceProTpl">
                         <div>{{ (((d.newPrice-d.currPrice)/d.currPrice)*100).toFixed(2)}}%</div>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="disN p20" id="chooseCateLayer">
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/adjustPromotionPriceProcess.js"></script>
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
	        //select_multi('selectAttr_store',platAccts)
	        formSelects.data('selectAttr_store','local',{arr:platAccts})
		 },
		 error: function () {
			 layer.msg("服务器正忙");
		 }
	 });
})
</script>

<script id="adjustPromotionPriceProcess_storeAcct" type="text/html">
    <div>{{d.storeAcct}}</div>
    <input hidden name="id" value="{{d.id}}">
    <input hidden name="storeAcct" value="{{d.storeAcct}}">
    <input hidden name="storeAcctId" value="{{d.storeAcctId}}">
    <input hidden name="variId" value="{{d.variId || ''}}">
    <input hidden name="isMultiSku" value="{{d.isMultiSku}}">
    <input hidden name="totalCost" value="{{d.totalCost}}">
    <input hidden name="platDeduct" value="{{d.platDeduct}}">
    <input hidden name="grossRate" value="{{d.grossRate}}">
    <input hidden name="salesSite" value="{{d.salesSite}}">
    <input hidden name="minProfitPrice" value="{{d.minProfitPrice}}">
    <input hidden name="itemId" value="{{d.itemId}}">
    <input hidden name="prodStoreSku" value="{{d.storeSku || ''}}">
    <input hidden name="prodSSku" value="{{d.sSku || ''}}">
    <input hidden name="listingPrice" value="{{d.listingPrice}}">
    <input hidden name="currPrice" value="{{d.currPrice}}">
    <input hidden name="newCurrPriceWithoutFloat" value="{{d.newCurrPriceWithoutFloat}}">
</script>
<script type="text/html" id="adjustPromotionPriceProcess_result">
    <div name="result"></div>
</script>