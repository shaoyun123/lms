<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt修改商品毛重</title>
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
                            <div class="layui-col-lg1 layui-col-md1">
                                    <select id="weight_is_smt_sku">
                                        <option value="0">商品子SKU</option>
                                        <option value="1">商品父SKU</option>
                                    </select>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <input type="text" name="skuList" class="layui-input" placeholder="默认模糊查询">
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select id="smt_weight_skuSearchType">
                                    <option value="0">模糊</option>
                                    <option value="1" selected>精确</option>
                                </select>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="smt_online_depart_sel"  name="orgId"  lay-search lay-filter="smt_online_depart_sel"  class="orgs_hp_custom">
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
                                    <select id="smt_online_store_sel" xm-select="selectAttr_store" lay-search lay-filter="smt_online_store_sel"   class="store_hp_custom" data-platcode="aliexpress">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="text-align:right">
                                        <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="smt_Modify_weight_SearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="smt_Modify_weight_ResetBtn">清空</button>
                            </div>
                        </div>
                        <div id="smtModMainGrossWeightCustomsContent"></div>
                    </form>
                    <form id="applyForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md4 layui-col-lg4 pl_110">
                                <input type="radio" name="apply" value="0" title="按现有重量" checked style="margin:0" lay-filter="apply">
                                <label style="display:inline-block;margin:6px 10px 0 0">增加</label>
                                <input type="number" class="layui-input" style="width:80px;display: inline;" id="smt_add_weight">
                            </div>
                            <div class="layui-col-md4 layui-col-lg4 pl_110">
                                    <input type="radio" name="apply" value="1" title="直接修改重量" lay-filter="apply" >
                                    <input type="number" class="layui-input" style="width:80px;display: inline;"disabled id="smt_adjustto_weight" min="0">
                            </div>
                            <div class="layui-col-md4 layui-col-lg4 pl_110" style="text-align:right">
                                    <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" type="button"  lay-submit id="smt_weight_applyBtn" lay-filter="smt_weight_applyBtn">应用</button>  
                            </div>
                        </div>
                </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(<span id="tolnum_span_smt_stock"></span>)</div>
                <form class="layui-form" id="smt_ModifyMainGrossWeight_filtForm">
                    <label class="layui-form-label">重量差</label>
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
                            <input type="number" name="diffWeight" class="layui-input">
                        </div>
                        <button class="layui-btn layui-btn-sm ml20 keyHandle" type="button" data-type="reload" id="smt_ModifyMainGrossWeightfilterWeight">搜索</button>
                        <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary ml20" id="smt_ModifyMainGrossWeightOrigin">清空</button>
                    </div>
                </form>
                <div class="dis_flex mg_10">
                        <button type="button" id="modify_weight_Buttn" class="layui-btn layui-btn-danger layui-btn-sm">批量调整</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="smt_Modify_weight_Table" lay-filter="smt_Modify_weight_Table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifyMainGrossWeight.js"></script>
<script type="text/html" id="new_stock">
    <input type="text" class="layui-input" style="height:28px" name="adjustWeight" value="{{d.adjustWeight}}" >
</script>
