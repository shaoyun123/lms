<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>joom批量修改重量和运费</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="batchModifedWeight_Form" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-lg8 layui-col-md8">
                                <div class="layui-col-lg5 layui-col-md5">
                                    <div class="layui-col-lg10 layui-col-md10">
                                        <label class="layui-form-label">商品SKU</label>
                                        <div class="layui-input-block">
                                            <input type="hidden" name="idList" class="layui-input">
                                            <input type="text" name="sSkuList" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <select id="searchType" name="searchType">
                                            <option value="1">精确</option>
                                            <option value="0">模糊</option>
                                        </select>
                                    </div>
                                </div>
                                    
                                 <div class="layui-col-md4 layui-col-lg4">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block" lay-filter="component-form-element" class="layui-col-md4 layui-col-lg4">
                                                <select id="batchModifedWeight_Form_selectStore" xm-select="selectAttr_store"  name="storeAcctIdList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">>
                                            </select>
                                        </div>
                                </div>
                            </div>
                            <div class="layui-col-lg8 layui-col-md8">
                                <div class="layui-col-md5 layui-col-lg5">
                                    <div class="layui-col-md5 layui-col-lg5">
                                        <label class="layui-form-label">运费差价</label>
                                        <div class="layui-input-block">
                                            <select name="subShippingPriceType">
                                                <option value="3">=</option>
                                                <option value="1"><b>></b></option>
                                                <option value="2"><</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <input type="number" class="layui-input" name="subShippingPrice">
                                    </div>
                                </div>
                                <div class="layui-col-md5 layui-col-lg5">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">当前运费</label>
                                            <div class="layui-input-block">
                                                <select name="bmw_currentFrieght_symbol">
                                                    <option value="1"><b>+</b></option>
                                                    <option value="2">-</option>
                                                    <option value="3">*</option>
                                                    <option value="4">/</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md4 layui-col-lg4">
                                            <input type="number" class="layui-input" name="bmw_currentFrieght">
                                        </div>
                                </div>
                                
                            </div>
                            <div class="layui-col-lg8 layui-col-md8">
                                <div class="layui-col-md5 layui-col-lg5">
                                    <div class="layui-col-md5 layui-col-lg5">
                                        <label class="layui-form-label">重量差</label>
                                        <div class="layui-input-block">
                                            <select name="subShippingWeightType">
                                                <option value="3">=</option>
                                                <option value="1"><b>></b></option>
                                                <option value="2"><</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <input type="number" class="layui-input" name="subShippingWeight">
                                    </div>
                                </div>
                                <div class="layui-col-md5 layui-col-lg5">
                                    <div class="layui-col-md5 layui-col-lg5">
                                        <label class="layui-form-label">当前重量</label>
                                        <div class="layui-input-block">
                                            <select name="bmw_currentWeight_symbol">
                                                <option value="1"><b>+</b></option>
                                                <option value="2">-</option>
                                                <option value="3">*</option>
                                                <option value="4">/</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <input type="number" class="layui-input" name="bmw_currentWeight">
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div class="layui-col-md10 layui-col-lg10" style="padding-left: 90px;">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" lay-submit id="batchModifedWeight_searchBtn" lay-filter="batchModifedWeight_searchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="adjustPriceResetBtn">清空</button> 

                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" id="batchModifedWeight_WeightFee">一键应用</button>
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" id="batchModifedWeight_application">批量调整</button>
                            </div>
                        </div>                          
                        <div id="joomAdjustPriceCustomsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">数量(<span id="tolnum_span_joom"></span>)<span id="checkedNum_span_bmw"> - 选中 (<span id="checkedNum_span_bmw_num">0</span>)条</span></div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="batchModifedWeight_table" lay-filter="batchModifedWeight_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="disN p20" id="chooseCateLayer">
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/joom/batchModifiedWeight.js"></script>