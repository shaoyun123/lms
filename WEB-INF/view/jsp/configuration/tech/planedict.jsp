<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>平面字典</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="planeDict_searchForm">
                        <div class="layui-inline w120">
                            <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                <select name="headCode" lay-search="" id="searchSel">
                                    <option value="">字典头代码</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="planeDict_searchBtn">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                    <div style="position:absolute;right:10px;top:10px">
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button class="layui-btn layui-btn-normal layui-btn-sm" id="addPlanedictInfo">添加</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="planeDictTable" lay-filter="planeDictTable"></table>
                    <script type="text/html" id="planeDictTableBar">
                        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 模态框 -->
<script type='text/html' id="addPlanedictInfoLayer">
    <div class="p20">
        <form class="layui-form" id="addPlanedictForm">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <label class="layui-form-label">字典头</label>
                <div class="layui-input-block">
                    <select name="headCode" lay-filter="headCode" id="dictHeadSel" lay-search>
                        <option value="" selected>请选择</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">key</label>
                <div class="layui-input-block">
                    <input type="text" name="dKey" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">值</label>
                <div class="layui-input-block">
                    <input type="text" name="dValue" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">扩展1</label>
                <div class="layui-input-block">
                    <input type="text" name="extend1" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">扩展2</label>
                <div class="layui-input-block">
                    <input type="text" name="extend2" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">排序</label>
                <div class="layui-input-block">
                    <input type="number" name="sort" class="layui-input">
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/configuration/other/planedict.js?v=${ver}"></script>