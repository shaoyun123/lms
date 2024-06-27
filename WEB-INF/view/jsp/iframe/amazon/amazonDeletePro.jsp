<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>amazon删除商品</title>
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
<div class="layui-fluid" id="">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="amazonDeleteProForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-lg1 layui-col-md1">
                                <select name="skuType">
                                    <option value="prodSSku">商品子SKU</option>
                                    <option value="prodPSku">商品父SKU</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <input type="text" name="skuValue" class="layui-input" placeholder="默认模糊查询">
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="searchType">
                                    <option value="like">模糊</option>
                                    <option value="exact">精确</option>
                                </select>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="amazondelpro_depart_sel" lay-search lay-filter="amazondelpro_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select lay-search lay-filter="amazondelpro_salesman_sel" class="users_hp_custom" data-rolelist="amazon专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="amazondelpro_store_sel" id="amazondelpro_store_sel"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            lay-filter="amazondelpro_store_sel" class="store_hp_custom" data-platcode="amazon">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="text-align:right">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="amazonDeleteProSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="amazonDeleteProResetBtn">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                    <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(<span id="tolnum_span_amazondelpro_stock"></span>)</div>
                    <div class="dis_flex mg_10">
                        <button type="button" id="amazonDeleteButton" class="layui-btn layui-btn-danger layui-btn-sm">删除商品</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="amazonDeleteProTable" lay-filter="amazonDeleteProTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/amazon/amazonDeletePro.js"></script>

