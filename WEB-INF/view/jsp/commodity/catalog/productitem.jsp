<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>商品类目</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="pi_cateCusSearchForm" class="layui-form">
                        <input type="hidden" name="pCateIds" id="LAY-commodity-catalog-productitem-hidden">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="pi_selectGoodsItems">选择类目</button>
                                    <i class="layui-icon layui-icon-delete" onclick="clearCate('pi_customsContent','LAY-commodity-catalog-productitem-hidden')" style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button class="layui-btn  layui-btn-sm keyHandle" type="button" data-type="reload" id="pi_cateCusSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary  layui-btn-sm" id="pi_cateCusResetBtn">清空</button>
                            </div>
                            <%--<div class="layui-inline">
                                <div class="layui-input-inline" lay-filter="component-form-element" style="width:120px">
                                    <p>完成状态</p>
                                    <select name="finishStatus" lay-search>
                                        <option value="">全部</option>
                                        <option value="0">未完成</option>
                                        <option value="1">已完成</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline" lay-filter="component-form-element" style="width:120px">
                                    <p>搜索类型</p>
                                    <select name="searchType" lay-search>
                                        <option value="0">中文报关名</option>
                                        <option value="1">英文报关名</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <p>搜索内容</p>
                                    <input type="text" name="searchContent" class="layui-input">
                                </div>
                            </div>--%>
                            <div style="float:right;">
                                <button type="button" id="pi_batchUpadateCus" class="layui-btn layui-btn-normal  layui-btn-sm">批量修改</button>
                            </div>
                        </div>
                        <div id="pi_customsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="pi_table" lay-filter="pi_table"></table>
                    <script type="text/html" id="pi_allRootCateTpl">
                        <input type="number" class="layui-input" style="height:28px"  value={{ d.allrootCateId || '' }}>
                    </script>
                    <script type="text/html" id="pi_Bar">
                        <a class="layui-btn layui-btn-xs" lay-event="edit">保存</a>
                       <%-- <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">一键应用</a>--%>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/commodity/catalog/productitem.js"></script>
