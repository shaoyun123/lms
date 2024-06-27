<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<title>分类&品牌</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="cb_SearchForm" class="layui-form">
                        <input type="hidden" name="pCateId" id="LAY-commodity-catalog-customs-hidden">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">选择分类</label>
                                <div class="layui-input-block">
                                  <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="cb_cateSelect">选择类目</button>
                                  <i class="layui-icon layui-icon-delete" onclick="clearCate('cb_cateCheckd','LAY-commodity-catalog-customs-hidden')" style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">完成状态</label>
                                <div class="layui-input-block">
                                    <select name="finishStatus">
                                        <option value="">全部</option>
                                        <option value="0">未完成</option>
                                        <option value="1">已完成</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">品牌</label>
                                <div class="layui-input-block">
                                  <input type="text" name="brand" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="cb_searchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="cb_reset">清空</button>
                            </div>
                        </div>
                        <div id="cb_cateCheckd"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id='cateBrandCard'>
                <div class="layui-card-header">
                    <span style="float: right">
                        <button type="button" class="layui-btn layui-btn-sm" id="cb_batchSave">批量保存</button>
                    </span>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="catebrandTable" lay-filter="catebrandTable"></table>
                    <script type="text/html" id="cb_brandTpl">
                        <input type="text" class="layui-input" style="height:28px"  value={{ d.brand || '' }} >
                    </script>
                    <script type="text/html" id="cateBrandBar">
                        <a class="layui-btn layui-btn-xs" lay-event="edit">保存</a>
                    </script>
                </div>
            </div>
        </div>
    </div>
    <div class="disN p20" id="cb_chooseSMTCateLayer"></div>
</div>
<script type="text/javascript" src="${ctx}/static/js/work/smt/catebrand.js"></script>
