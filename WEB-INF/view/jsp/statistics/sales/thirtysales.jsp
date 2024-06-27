<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>30天销量</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="thirtySales_searchForm" id="thirtySales_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">最后交易时间</label>
                                <div class="layui-input-block">
                                    <input name="lastTradeTime" class="layui-input" id="thirtySales_lastTradeTime" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="skuType">
                                        <option value="1">子SKU</option>
                                        <option value="2">父SKU</option>
                                        <option value="3">子SKU(精确)</option>
                                        <option value="4">父SKU(精确)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="skuStr" type="text" class="layui-input" placeholder="多个逗号分隔" maxlength="2000">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data>
                                        <c:forEach items="${buyers}" var="developer">
                                            <li data-value="${developer.id}" hp-select-li>${developer.userName}</li>
                                        </c:forEach>
                                    </div>
                                    <input class="layui-input" name="buyer" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale" lay-search="">
                                        <option value="">全部</option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">有无销量</label>
                                <div class="layui-input-block">
                                    <select name="hasSale" lay-search="">
                                        <option value="">全部</option>
                                        <option value="1">有</option>
                                        <option value="0">无</option>
                                    </select>
                                </div>
                            </div>
                                <div class="layui-col-md3 layui-col-lg3 pl_10">
                                    <button id="thirtysales_searchBtn" class="layui-btn layui-btn-sm" type="button">查询</button>
                                    <button type="reset" id="thirtysales_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="thirtysales_card">
                <div class="layui-card-header">
                    <span class="numCount">30天销量<span id="thirtysales_countNum"></span></span>
                    <button type="button" class="layui-btn layui-btn-sm ml10" id="thirtysales_export">导出</button>
                </div>

                <div class="layui-card-body">
                    <table class="layui-table" id="thirtysales_table" lay-filter="thirtysales_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="${ctx}/static/js/statistics/sales/thirtysales.js"></script>