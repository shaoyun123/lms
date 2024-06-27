<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<title>报关信息</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="cateCusSearchForm" class="layui-form">
                        <input type="hidden" name="pCateIds" id="LAY-commodity-catalog-customs-hidden">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">选择分类</label>
                                <div class="layui-input-block">
                                   <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="selectGoodsItems">选择类目</button>
                                   <i class="layui-icon layui-icon-delete" onclick="clearCate('proCustoms_category_delImg','LAY-commodity-catalog-customs-hidden')" style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">完成状态</label>
                                <div class="layui-input-block">
                                    <select name="finishStatus" lay-search>
                                        <option value="">全部</option>
                                        <option value="0">未完成</option>
                                        <option value="1">已完成</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">搜索类型</label>
                                <div class="layui-input-block">
                                    <select name="searchType" lay-search>
                                        <option value="0">中文报关名</option>
                                        <option value="1">英文报关名</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">搜索内容</label>
                                <div class="layui-input-block">
                                   <input type="text" name="searchContent" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="cateCusSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="cateCusResetBtn">清空</button>
                            </div>
                            <div style="float:right">
                                    <button type="button" id="batchUpadateCus" class="layui-btn layui-btn-normal layui-btn-sm">批量修改</button>
                            </div>
                        </div>                          
                        <div id="proCustoms_category_delImg"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="customsCard">
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="customsTable" lay-filter="customsTable"></table>
                    <script type="text/html" id="customCnNameTpl">
                        <input type="text" class="layui-input" style="height:28px"  value="{{ d.customsCnName || '' }}" >
                    </script>
                    <script type="text/html" id="customEnNameTpl">
                        <input type="text" class="layui-input" style="height:28px"   value="{{ d.customsEnName || '' }}">
                    </script>
                    <script type="text/html" id="customValueTpl">
                        <input type="number" class="layui-input" style="height:28px"  value="{{ d.customsValue || '' }}">
                    </script>
                    <script type="text/html" id="customsBar">
                        <a class="layui-btn layui-btn-xs" lay-event="edit">保存</a>
                        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="copy">一键应用</a>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="disN p20" id="chooseCateLayer">
</div>
<script type="text/javascript" src="${ctx}/static/js/commodity/catalog/customs.js"></script>