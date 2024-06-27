<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>箱子规则</title>

<style>
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">
                    <div class="fr">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="casetype_addCaseTypeBtn">新增</span>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="casetype_table"  lay-filter="casetype_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<%-- 操作 --%>
<script type="text/html" id="casetype_toolBar">
    <div>
        <span class="layui-btn layui-btn-xs" lay-event="edit">修改</span>
        <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</span>
    </div>
</script>

<%-- 新增/修改弹框 --%>
<script type="text/html" id="casetype_editOrAddCaseTypeTpl">
    <form class="layui-form" id="casetype_editOrAddCaseTypeForm" lay-filter="casetype_editOrAddCaseTypeForm" autocomplete="off">
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">箱子规格名</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" name="name">
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">长(cm)</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" name="length">
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">宽(cm)</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" name="width">
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">高(cm)</label>
            <div class="layui-input-block">
                    <input type="text" class="layui-input" name="height">
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">成本(￥)</label>
            <div class="layui-input-block">
                    <input type="text" class="layui-input" name="cost">
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">重量(g)</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" name="weight">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <textarea type="text" class="layui-textarea"  name="remark"></textarea>
            </div>
        </div>
    </form>
</script>

<script src="${ctx}/static/js/wyt/config/casetype.js"></script>