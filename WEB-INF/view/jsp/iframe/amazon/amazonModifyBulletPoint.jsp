<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>samazon修改卖点</title>
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
.layui-textarea{
    min-height:100px;
}
.hide{
    display: none;
}
.W_60{
    width: 60% !important;
}
.dis_inline{
    display: inline-block;
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
                    <form id="amazon_theShelves_searchForm" lay-filter="prod_search_form" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-lg1 layui-col-md1">
                                <select id="amazonModPoint_is_pAnds_sku">
                                    <option value="0">商品子SKU</option>
                                    <option value="1">商品父SKU</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <input type="text" name="skuList" class="layui-input" placeholder="默认模糊查询">
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select id="amazon_idEnable_skuSearchType">
                                    <option value="0">模糊</option>
                                    <option value="1" selected>精确</option>
                                </select>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="amazon_online_depart_sel" lay-search lay-filter="amazon_online_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select  lay-search lay-filter="amazon_online_salesman_sel"  class="users_hp_custom" data-rolelist="amazon专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectAttr_store" id="amazon_online_store_sel" lay-search lay-filter="amazon_online_store_sel"   class="store_hp_custom" data-platcode="amazon">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="text-align:right">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="amazonModifyBulletPointSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="amazonModifyPirceResetBtn">清空</button>
                            </div>
                        </div>
                        <div id="amazonModBulletPointCustomsContent"></div>
                    </form>
                    <form id="applyForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-inline">
                                <label class="layui-form-label">字符</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="old_string" id="old_string" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">替换为</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="new_string" id="new_string" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" lay-submit type="button" id="amazon_replace" lay-filter="amazon_replace">替换</button>
                            </div>
                        </div>
                </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(<span id="tolnum_span_amazon_stock"></span>)</div>
                <div class="dis_flex mg_10">
                        <button type="button" id="modifyStockButtn" class="layui-btn layui-btn-danger layui-btn-sm">批量调整</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="amazonModifyTitleTable" lay-filter="amazonModifyTitleTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/amazon/amazonModifyBulletPoint.js"></script>
<script type="text/html" id="new_title1">
    <%--<div onclick="editTitle($(this));" class="title_js col_js"></div>--%>
    <textarea class="layui-textarea" style="height:28px"  name="title_js">{{' '}}</textarea>
</script>
<script>
    function editTitle(obj){
        console.log(obj);
        obj.addClass('hide').siblings('textarea').removeClass('hide');
    }
</script>
<script type="text/html" id="new_title">
    <div onclick="editTitle($(this));" class="title_js col_js">{{d.title || ''}}</div>
    <textarea class="layui-textarea hide" style="height:28px" value="{{d.title || ''}}" name="title_js">{{d.title || ''}}</textarea>
</script>
