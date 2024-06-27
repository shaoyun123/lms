<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

<title>库存明细账</title>

<div class="layui-fluid" id="winit_stock_entries"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="winit_stock_entries_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">注册sku</label>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md9 layui-col-lg9">
                                        <input name="sku" type="text" class="layui-input" placeholder="单个精确查询">
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">审核时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="auditTime" autocomplete="off" class="layui-input"
                                           id="winit_stock_entries_time">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3 pl20">
                                <span class="layui-btn layui-btn-sm" id="winit_stock_entries_search">搜索</span>
                            </div>
                        </div>
                    </form>

                </div>
            </div>

            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="winit_stock_entries_table"
                           lay-filter="winit_stock_entries_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="${ctx}/static/js/wyt/stock/stockEntries.js"/>