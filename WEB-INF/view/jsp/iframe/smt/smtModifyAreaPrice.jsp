<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt区域调价</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 根据需求,查询去掉 -->
            <!-- <div class="layui-card">   
               <form class="layui-form" id="smtModifyAreaPriceForm">
                <input type="hidden" name="storeAcctIdList">
                <div class="layui-form-item">
                   <div class="layui-col-md1">
                        <select name="pAndsSkuList">
                            <option value="sSkuList">商品子SKU</option>
                            <option value="pSkuList">商品父SKU</option>
                        </select>
                    </div>
                    <div class="layui-col-md1">
                        <input type="text" class="layui-input" placeholder="默认模糊查询" id="smtModifyAreaPriceInput">
                    </div>
                    <div class="layui-col-md1">
                        <select name="searchType">
                            <option value="0">模糊</option>
                            <option value="1" selected>精确</option>
                        </select>
                    </div>
                    <div class="layui-col-md2">
                        <label class="layui-form-label">部门</label>
                        <div class="layui-input-block">
                            <select lay-search lay-filter="smt_online_depart_sel"  class="orgs_hp_custom">
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md2">
                        <label class="layui-form-label">销售人员</label>
                        <div class="layui-input-block">
                            <select lay-search lay-filter="smt_online_salesman_sel"  class="users_hp_custom" data-rolelist="smt专员" name="salepersonId">
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md3">
                        <label class="layui-form-label">店铺</label>
                        <div class="layui-input-block">
                            <select lay-search lay-filter="smt_online_store_sel" class="store_hp_custom" data-platcode="aliexpress">
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md2 pl20">
                       <span class="layui-btn layui-btn-sm"  lay-submit lay-filter="smtModifyAreaPrice_submit">查询</span>
                       <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                    </div>
                </div>
               </form>
            </div> -->
            <div class="layui-card">
                <div class="layui-card-body disFCenter" >
                    <div >
                        <button class="layui-btn layui-btn-sm layui-btn-danger" type="button" id="smtModifyAreaPrice_batchEditCancel">取消区域调价</button>
                    </div>
                    <div class="disFCenter">
                        <div class="layui-form" >
                            <select name="templateId" id="smtModifyAreaPrice_templateId" lay-search></select>
                        </div>
                        <button class="layui-btn layui-btn-sm" type="button" id="smtModifyAreaPrice_batchEdit">批量修改</button>
                    </div>
                </div>
            </div>
            <div class="layui-card">
                <table class="layui-table" id="smtModifyAreaPriceTable" lay-filter="smtModifyAreaPriceTableFilter"></table>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifyAreaPrice.js"></script>