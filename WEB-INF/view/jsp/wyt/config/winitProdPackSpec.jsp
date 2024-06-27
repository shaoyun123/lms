<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>万邑通包装规格</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form action="" class="layui-form" id="winitProdPackSpecSearchForm">
                            <div class="layui-inline w100">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="code" placeholder="规格代码" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline w100">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="name" placeholder="规格名称" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload"
                                            id="winitProdPackSpecSearch">搜索
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                            <div style="position:absolute;right:10px;top:10px">
                                <div class="layui-inline">
                                    <div class="layui-input-inline" id="winitProdPackSpecOperateOption">
                                        <permTag:perm funcCode="save_winitPackSpec">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="addWinitProdPackSpec">
                                            新增
                                        </button>
                                        </permTag:perm>
                                            <permTag:perm funcCode="edit_winitPackSpec">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="updWinitProdPackSpec"
                                                data-type="updWinitProdPackSpec">修改
                                        </button>
                                            </permTag:perm>
                                                <permTag:perm funcCode="del_winitPackSpec">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="delWinitProdPackSpec"
                                                data-type="delWinitProdPackSpec">删除
                                        </button>
                                                </permTag:perm>
                                    </div>
                                </div>
                            </div>
                        </form>
                </div>
            </div>
            <div class="layui-card" id="winitProdPackSpecCard">
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="winitProdPackSpecTable" lay-filter="winitProdPackSpecTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 新增包装规格 -->
<script type="text/html" id="addWinitProdPackSpecLayer">
    <div class="p20">
        <form action="" class="layui-form" id="addWinitProdPackSpecForm">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <div class="layui-inline">
                        <label class="layui-form-label" id="winitProdPackSpecCodeForUpdLabel">规格代码</label>
                        <div class="layui-input-inline">
                            <input type="text" name="code" class="layui-input" required lay-verify="required">
                        </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">规格名称</label>
                    <div class="layui-input-inline">
                        <input type="text" name="name" class="layui-input" required lay-verify="required">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">成本单价</label>
                    <div class="layui-input-inline">
                        <input type="number" name="unitCost" class="layui-input" required lay-verify="required" min='0'>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">重量</label>
                    <div class="layui-input-inline">
                        <input type="number" name="weight" class="layui-input" required lay-verify="required" min='0'>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">条码</label>
                    <div class="layui-input-inline">
                        <input type="text" name="barcode" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block" style="width:515px">
                    <textarea placeholder="请输入内容" class="layui-textarea" name="remark"></textarea>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="addWinitProdPackSpecInfo" id="addWinitProdPackSpecInfo">
                        提交
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/wyt/config/winitProdPackSpec.js"></script>