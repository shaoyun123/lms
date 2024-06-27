<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt修改库存</title>
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

</style>

<div class="layui-fluid" id="LAY_adjustPriceProcess">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
          <div class="layui-card">
                <div class="layui-card-body">
                    <form id="smt_theShelves_searchForm" lay-filter="prod_search_form" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <%--<div class="layui-col-lg1 layui-col-md1">--%>
                                    <%--<select id="smtModStock_is_pAnds_sku">--%>
                                        <%--<option value="0">商品子SKU</option>--%>
                                        <%--<option value="1">商品父SKU</option>--%>
                                    <%--</select>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-lg1 layui-col-md1">--%>
                                <%--<input type="text" name="skuList" class="layui-input" placeholder="默认模糊查询">--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                <%--<select id="smt_idEnable_skuSearchType">--%>
                                    <%--<option value="0">模糊</option>--%>
                                    <%--<option value="1" selected>精确</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                                <div class="layui-col-lg1 layui-col-md1">
                                    <select id="smtModStock_is_pAnds_sku">
                                        <option value="0">商品子SKU</option>
                                        <option value="1">商品父SKU</option>
                                    </select>
                                </div>
                                <div class="layui-col-lg1 layui-col-md1">
                                    <input type="text" name="skuList" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select id="smt_idEnable_skuSearchType">
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="smt_online_depart_sel" name = "orgId" lay-search lay-filter="smt_online_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select name="saleName" id="smt_online_salesman_sel" lay-search lay-filter="smt_online_salesman_sel"  class="users_hp_custom" data-rolelist="smt专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="smt_online_store_sel" xm-select="selectAttr_store" lay-search xm-select-search lay-filter="smt_online_store_sel"   class="store_hp_custom" data-platcode="aliexpress">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="text-align:right">
                                        <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="smtModifyStockSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="smtModifyStockResetBtn">清空</button>
                            </div>
                        </div>
                        <div id="smtModMainStockCustomsContent"></div>
                    </form>
                    <form id="applyForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md4 layui-col-lg4 pl_110">
                                <input type="radio" name="apply" value="0" title="按现有库存" checked style="margin:0" lay-filter="apply">
                                <label style="display:inline-block;margin:6px 10px 0 0">增加</label>
                                <input type="number" class="layui-input" style="width:80px;display: inline;" id="addinvntory">
                            </div>
                            <div class="layui-col-md4 layui-col-lg4 pl_110">
                                    <input type="radio" name="apply" value="1" title="直接修改库存" lay-filter="apply" >
                                    <input type="number" class="layui-input" style="width:80px;display: inline;"disabled id="adjustto" min="0">
                            </div>
                            <div class="layui-col-md4 layui-col-lg4 pl_110" style="text-align:right">
                                    <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" type="button"  lay-submit id="applyBtn" lay-filter="applyBtn">应用</button>
                                    <a type="button" id="smtModifyStock_newStockBySku" class="layui-btn layui-btn-normal layui-btn-sm">一键调整</a>   
                            </div>
                        </div>
                </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(<span id="tolnum_span_smt_stock"></span>)</div>
                <div class="dis_flex mg_10">
                        <button type="button" id="modifyStockButtn" class="layui-btn layui-btn-danger layui-btn-sm">批量调整</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="smtModifyStockTable" lay-filter="smtModifyStockTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 通过sku调整库存 -->
<script type="text/html" id="smtModifyStockBySkuModal">
    <div class="layui-card watermark">
        {{# if(d.count != 0 ){ }}
        <div class="layui-card-header">本次共调整<span class="shopeeadjustStock-font-weight ml10 mr10">{{d.count}}</span>个SKU（已去重）</div>
        <div class="layui-card-body">
            <form action="" class="layui-from" id="smtModifyStockBySkuForm">
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

<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifyMainStock.js"></script>
<script type="text/html" id="new_stock">
    <input type="text" class="layui-input" style="height:28px" name="adjustStock" >
</script>
