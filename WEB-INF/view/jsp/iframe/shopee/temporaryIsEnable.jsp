<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>临时上下架</title>
<style> 
  #adjustPriceSearchForm .layui-form-item{
       margin-bottom:0
  }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg15 layui-col-md15">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="tem_is_enable_form" id="tem_is_enable_form">
                        <div class="layui-form-item">
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<label class="layui-form-label">商品父sku</label>--%>
                                <%--<div class="layui-input-block disflex">--%>
                                    <%--<input type="text" class="layui-input brnone" placeholder="默认模糊查询" name="pSkuList">--%>
                                    <%--<select name="searchType">--%>
                                        <%--<option value="0">模糊</option>--%>
                                        <%--<option value="1">精确</option>--%>
                                    <%--</select>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">商品父sku</label>
                                    <div class="layui-input-block disflex">
                                        <input type="text" class="layui-input brnone" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)" name="pSkuList">
                                        <select name="searchType">
                                            <option value="1">精确</option>
                                        </select>
                                    </div>
                                </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="shopee_online_depart_sel" lay-search lay-filter="shopee_online_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select lay-search class="users_hp_custom" data-rolelist="shopee专员" lay-filter="shopee_tem_is_enable_sel">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectAttr_store" xm-select-search class="store_hp_custom" id="tem_is_enable_store" data-platcode="shopee" name="storeAcctIdList">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select id="tem_shopee_online_site_sel" lay-filter="tem_shopee_online_site_sel" xm-select="tem_shopee_online_site_sel" class="salesSite_hp_custom" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm" type="button" data-type="reload" id="temp_is_enable_SearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="temp_is_enable_ResetBtn">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <%-- 表格内容 --%>
            <div class="layui-card">
                <div class="layui-card-header">数量共(<span id="isENable_table_num">0</span>)
                <div style="float:right;margin-top:5px;margin-left:5px;">
                    <button type="button" id="batchIEnableProd" class="layui-btn layui-btn-danger layui-btn-sm">批量上架</button>
                </div>
                <div style="float:right;margin-top:5px;">
                    <button type="button" id="batchNEnableProd" class="layui-btn layui-btn-danger layui-btn-sm">批量临时下架</button>
                </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="temp_is_enable_Table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/temporaryIsEnable.js"></script>
