<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <title>数据字典头(已弃用)</title>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form action="" class="layui-form" id="ddh_searchForm">
                            <div class="layui-inline w100">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <select name="isFlat" lay-search>
                                        <option value="">字典类型</option>
                                        <option value="true">平面字典</option>
                                        <option value="false">树形字典</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline w100">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="code" placeholder="字典头代码" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline w130">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="name" placeholder="字典头名称" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="ddh_searchBtn_deprecated">搜索
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                            <div style="position:absolute;right:10px;top:10px">
                                <div class="layui-inline">
                                    <div class="layui-input-inline">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="datadictheadBtn">
                                            添加
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-header">表格</div>
                    <div class="layui-card-body">
                        <!-- 表格的数据渲染 -->
                        <table class="layui-table" id="datadictheadTable" lay-filter="datadictheadTable"></table>
                        <script type="text/html" id="dictHeadTableBar">
                            {{# if(d.isFixed == false){ }}
                            <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
                            {{# } }}
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 模态框 -->
    <script type='text/html' id="datadictheadLayer">
        <div class="p20">
            <form class="layui-form layui-form-pane mt20" id="addDictHeadForm">
                <div class="layui-form-item">
                    <label class="layui-form-label">应用代码</label>
                    <div class="layui-input-block">
                        <input type="text" name="appCode" lay-verify="required" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">代码</label>
                    <div class="layui-input-block">
                        <input type="text" name="code" lay-verify="required" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" lay-verify="required" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item" pane="">
                    <label class="layui-form-label">是否固定</label>
                    <div class="layui-input-block">
                        <input type="checkbox" checked="checked" name="isFixed" lay-skin="switch" lay-text="是|否">
                    </div>
                </div>
                <div class="layui-form-item" pane="">
                    <label class="layui-form-label">是否平面字典</label>
                    <div class="layui-input-block">
                        <input type="checkbox" checked="checked" name="isFlat" lay-skin="switch" lay-text="是|否">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-input-block taRight">
                        <button class="layui-btn" lay-submit lay-filter="addDictHead">提交</button>
                        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                    </div>
                </div>
            </form>
        </div>
    </script>
<!-- 编辑按钮的弹出框 -->
<!-- 模态框 -->
<script type='text/html' id="editdictheadLayer">
    <div class="p20">
        <form class="layui-form layui-form-pane mt20" id="editDictHeadForm">
            <div class="layui-form-item">
                <label class="layui-form-label">应用代码</label>
                <div class="layui-input-block">
                    <input type="hidden" name="id">
                    <input type="text" name="appCode" lay-verify="required" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">代码</label>
                <div class="layui-input-block">
                    <input type="text" name="code" lay-verify="required" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">名称</label>
                <div class="layui-input-block">
                    <input type="text" name="name" lay-verify="required" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item" pane="">
                <label class="layui-form-label">是否固定</label>
                <div class="layui-input-block">
                    <input type="checkbox" checked="checked" name="isFixed" lay-skin="switch" lay-text="是|否">
                </div>
            </div>
            <div class="layui-form-item" pane="">
                <label class="layui-form-label">是否平面字典</label>
                <div class="layui-input-block">
                    <input type="checkbox" checked="checked" name="isFlat" lay-skin="switch" lay-text="是|否">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit lay-filter="editDictHeadBtn">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/configuration/other/datadicthead.js"></script>