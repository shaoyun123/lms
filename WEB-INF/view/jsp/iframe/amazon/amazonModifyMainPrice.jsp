<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>amazon修改价格</title>
<style>
#LAY_adjustPriceProcess .layui-form-label{
   padding: 9px 5px;
}
#LAY_adjustPriceProcess .layui-form-item .layui-col-lg2 layui-col-md2 {
    margin-right: 0; 
}

.dis_flex{
    display: flex;
    justify-content: space-between;
}
.w_100{
    width:100px;
}

#LAY_adjustPriceProcess .layui-form{
    margin: 0 10px;
}
#LAY_adjustPriceProcess .layui-form-checkbox span{
    line-height: inherit;
}

#LAY_adjustPriceProcess .layui-form-checkbox{
    line-height: 30px !important;
}

.numCount {
    border: 1px solid #e8e8e8;
    border-bottom: none;
    display:inline-block;
    padding:0 5px;
    text-align: center;
    line-height: 30px;
}
.mg_10{
    margin:0 10px;
}
#amazon_theShelves_searchForm .layui-form-label,
#applyForm .layui-form-label {
    width: 60px;
}

#amazon_theShelves_searchForm .layui-input-block,
#applyForm .layui-input-block{
    margin-left: 90px;
}
    .left10{
        margin-left:10px;
    }

</style>

<div class="layui-fluid" id="amazonadjustPriceProcess">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
          <div class="layui-card">
                <div class="layui-card-body">
                    <form id="amazon_theShelves_searchForm" lay-filter="prod_search_form" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <%--<div class="layui-col-lg1 layui-col-md1">--%>
                                    <%--<select id="amazonModPrice_is_pAnds_sku">--%>
                                        <%--<option value="0">商品子SKU</option>--%>
                                        <%--<option value="1">商品父SKU</option>--%>
                                    <%--</select>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                <%--<input type="text" name="skuList" class="layui-input" placeholder="默认模糊查询">--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                <%--<select id="amazon_idEnable_skuSearchType">--%>
                                    <%--<option value="0">模糊</option>--%>
                                    <%--<option value="1" selected>精确</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                                <div class="layui-col-lg1 layui-col-md1">
                                    <select id="amazonModPrice_is_pAnds_sku">
                                        <option value="0">商品子SKU</option>
                                        <option value="1">商品父SKU</option>
                                    </select>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <input type="text" name="skuList" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select id="amazon_idEnable_skuSearchType">
                                        <%--<option value="0">模糊</option>--%>
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="amazon_mm_depart_sel" lay-search lay-filter="amazon_mm_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select  lay-search lay-filter="amazon_mm_salesman_sel"  class="users_hp_custom" data-rolelist="amazon专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="amazon_mm_store_sel" id="amazon_mm_store_sel" lay-search lay-filter="amazon_mm_store_sel" xm-select-search xm-select-search-type="dl" class="store_hp_custom" data-platcode="amazon">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1" style="display: flex;">
                                        <button class="left10 layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="amazonModifyPirceSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="amazonModifyPirceResetBtn">清空</button>
                            </div>
                        </div>
                        <div id="amazonModMainPriceCustomsContent"></div>
                    </form>
                    <form id="applyForm" class="layui-form layui-clear">
                            <%--<div class="layui-col-md12 layui-col-lg12">--%>
                                    <div class="layui-col-md2 layui-col-lg2">
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
                                    <div class="layui-col-md1 layui-col-lg1">
                                        <input type="number" class="layui-input" name="newPriceInput">
                                    </div>

                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">毛利率(%)</label>
                                    <div class="layui-input-block">
                                        <input class="layui-input" type="number" name="grossProfitRate">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <button type="button" id="newPriceBtn" class="left10 layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">差价范围</label>
                                    <div class="layui-input-block" style="display: flex;align-items: center">
                                        <input type="number" name="minDifPrice" class="layui-input" placeholder="大于">
                                        <input type="number" name="maxDifPrice" class="layui-input" placeholder="小于">
                                    </div>
                                </div>
                                    <div class="layui-col-md2 layui-col-lg2" style="display: flex;">
                                            <button type="button" id="amazonFilter" class="left10 layui-btn layui-btn-warm layui-btn-sm">筛选</button>
                                            <button type="button" id="amazonRevert" class="layui-btn layui-btn-primary layui-border-orange layui-btn-sm">还原</button>
                                    </div>
                            <%--</div>--%>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(<span id="tolnum_span_amazon_price"></span>)</div>
                <div class="dis_flex mg_10">
                    <button type="button" id="batchUpadatePrice" class="fr layui-btn layui-btn-normal layui-btn-sm">批量调价</button>
                </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="amazonModifyPriceTable" lay-filter="amazonModifyPriceTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/amazon/amazonModifyMainPrice.js"></script>
<script type="text/html" id="new_price">
    <input type="text" class="layui-input" style="height:28px" id="adjustprice" name="adjustprice" value="{{d.newPrice||''}}">
</script>
