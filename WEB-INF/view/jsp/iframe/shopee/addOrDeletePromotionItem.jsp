<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>添加/移除促销商品</title>
<style>
    #adjustPriceSearchForm .layui-form-item{
        margin-bottom:0
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form class="layui-form">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-md3 layui-col-lg3">
                                   <label class="layui-form-label">促销活动</label>
                                   <div class="layui-input-block">
                                       <select lay-search id="stortAcctPromotion" lay-filter="stortAcctPromotion">
                                           <option value="">选择活动</option>
                                       </select>
                                   </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label" style="width:60px;padding: 9px 0 9px 5px;">活动时间</label>
                                <div class="layui-input-block" style="margin-left: 65px;">
                                    <input type="text"id="stortAcctPromotion_time" autocomplete="off" class="layui-input" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="layui-form-label">活动限制</label>
                                <div class="layui-input-block" id="stortAcctPromotion_limit_info">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">毛利率</label>
                                <div class="layui-input-block">
                                    <input type="number" id="stortAcctPromotion_grossProfitRate" onkeypress="commonKeyPressInputFloat(event)" autocomplete="off" class="layui-input" style="width: 90%;display: inline-block;" min="0" placeholder="允许输入小数">

                                </div>
                            </div>
                            </form>
                        </div>
                </div>
                <div class="layui-form">
                <div style="display: flex;justify-content: space-between;margin: 0 20px;">
                    <button type="button" id="addMainPromotionItem" class="layui-btn layui-btn-danger layui-btn-sm">批量添加</button>
                    <input type="checkbox" id="isProcessDisTenDays" name="isProcessDisTenDays" title="近七日加价listing不加入促销" lay-skin="primary" checked />
                    <button type="button" id="deleteMainPromotionItem" class="layui-btn layui-btn-danger layui-btn-sm">批量去除</button>
                </div>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">表格(<span id="tolnum_span_shopee_promotion"></span>)</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="addOrDeletePromotionItem_Table" lay-filter="addOrDeletePromotionItem_Table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/addOrDeletePromotionItem.js"></script>
