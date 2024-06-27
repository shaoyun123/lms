<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

<title>库存明细账</title>

<div class="layui-fluid" id="wh_stock_entries"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="wh_stock_entries_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品sku</label>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md8 layui-col-lg8">
                                        <input name="sku" type="text" class="layui-input" placeholder="单个精确查询">
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">审核时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="auditTime" autocomplete="off" class="layui-input"
                                           id="wh_stock_entries_time">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">单号类型</label>
                              <div class="layui-input-block">
                                  <select name="typeList" 
                                  id="wh_stock_entries_typeList" 
                                  xm-select="wh_stock_entries_typeList"
                                  xm-select-search 
                                  xm-select-search-type="dl" 
                                  xm-select-skin="normal"></select>
                              </div>
                          </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <span class="layui-btn layui-btn-sm" id="wh_stock_entries_search">搜索</span>
                            </div>
                        </div>
                    </form>

                </div>
            </div>

            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="wh_stock_entries_table"
                           lay-filter="wh_stock_entries_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="${ctx}/static/js/warehouse/wh_stockEntries.js"/>