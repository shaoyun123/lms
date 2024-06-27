<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>调整运费模板</title>
<style>
#smtadjustPriceProcess .layui-form-label{
   padding: 9px 5px;
}
#smtadjustPriceProcess .layui-form-item .layui-col-lg2 layui-col-md2 {
    margin-right: 0; 
}

.dis_flex{
    display: flex;
    justify-content: space-between;
}

#smtadjustPriceProcess .layui-form{
    margin: 0 10px;
}
#smtadjustPriceProcess .layui-form-checkbox span{
    line-height: inherit;
}

#smtadjustPriceProcess .layui-form-checkbox{
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
.clear{ clear:both} 

</style>

<div class="layui-fluid" id="smtadjustPriceProcess">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
          <div class="layui-card">
                <div class="layui-card-body">
                    <form id="smt_theShelves_searchForm" lay-filter="prod_search_form" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-lg1 layui-col-md1">
                                    <select id="temp_pAnds_sku">
                                        <option value="0">商品子SKU</option>
                                        <option value="1">商品父SKU</option>
                                    </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <input type="text" name="temp_skuList" class="layui-input" placeholder="默认模糊查询">
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select id="smt_temp_idEnable_skuSearchType">
                                    <option value="0">模糊</option>
                                    <option value="1" selected>精确</option>
                                </select>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="smt_online_depart_sel" lay-search lay-filter="smt_online_depart_sel"  class="orgs_hp_custom">
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
                                    <select id="smt_template_online_store_sel" lay-search lay-filter="smt_template_online_store_sel"   class="store_hp_custom" data-platcode="aliexpress">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="text-align:right">
                                        <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="smtModifyTempSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="smtModifyTemppltResetBtn">清空</button>
                            </div>
                        </div>
                    </form>
                    <form id="applyForm" class="layui-form clear">
                            <div class="layui-form-item" style="margin-bottom:0">
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">选择运费模板</label>
                                    <div class="layui-input-block">
                                        <select id="smt_fyfreight_templat" lay-search>
                                            <option value="0">请选择</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2 pl_110">
                                    <button id="smt_product_template_sync" class="layui-btn layui-btn-sm keyHandle" type="button">同步最新运费模板</button>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">区域调价模板</label>
                                    <div class="layui-input-block">
                                        <select name="" lay-search id="smt_fyfreight_regionPriceTpl">
                                            <option value="">请选择</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                <div class="w100 numCount" style="text-align:center;padding:0 5px;">数量(<span id="tolnum_span_smt_templat"></span>)</div>
                <div class="dis_flex mg_10 w_100">
                        <button type="button" id="smt_fyfreight_regionPrcCancel" class="layui-btn layui-btn-danger layui-btn-sm">取消区域调价</button>
                        <button type="button" id="smt_fyfreight__batchEdit" class="layui-btn layui-btn-danger layui-btn-sm">批量调整</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="smtModifyfreightTemplatTable" lay-filter="smtModifyfreightTemplatTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifyFreightTemplat.js"></script>

