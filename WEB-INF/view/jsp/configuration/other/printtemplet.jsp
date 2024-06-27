<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
        <title>打印模板</title>
        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form class="layui-form" lay-filter="printtemplet_form" id="printtemplet_formId" method="post">
                                <div class="layui-form-item">
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">模板名称</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="templateName" autocomplete="off" class="layui-input" placeholder="模糊查询">
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">备注</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="remark" autocomplete="off" class="layui-input" placeholder="模糊查询">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2 pl20">
                                       <span class="layui-btn layui-btn-sm" lay-submit lay-filter='printtemplet_form_btn'>
                                       搜索</span>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-card-header">
                            <div class="fr">
                                 <button class="layui-btn layui-btn-sm layui-btn-normal" type="button"
                                 id="printtemplet_addTem">新增模板</button>
                            </div>
                        </div>
                        <div class="layui-card-body">
                            <!-- 表格的数据渲染 -->
                            <table class="layui-table" id="printtemplet_table" lay-filter="printtemplet_table"></table>
                            <%-- toolbar工具条 --%>
                            <script  type="text/html" id="printtemplet_tableBar">
                                <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="preview">模板预览</a>
                                <a class="layui-btn layui-btn-xs" lay-event="download">模板下载</a>
                                <a class="layui-btn layui-btn-xs  layui-btn-normal" lay-event="upload">模板上传</a>
                                <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">模板修改</a>
                                <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a>
                            </script>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <%-- 修改模板弹框处理 --%>
        <script  type="text/html" id="printtemplet_edit">
                <div class="p20">
                    <form class="layui-form" id="printtemplet_editForm" method="post">
                        <div class="layui-form-item">
                            <label class="layui-form-label">模板编码</label>
                            <div class="layui-input-block">
                                <input type="text" name="templateCode" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <%-- <div class="layui-form-item">
                            <label class="layui-form-label">模板名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="templateName" autocomplete="off" class="layui-input">
                            </div>
                        </div> --%>
                        <div class="layui-form-item">
                            <label class="layui-form-label">排序</label>
                            <div class="layui-input-block">
                                <input type="number" name="newOrder" autocomplete="off" class="layui-input">
                                <input type="hidden" name="oldOrder" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-block">
                                <input type="text" name="remark" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2 pl20 disN">
                            <span class="layui-btn layui-btn-sm" lay-submit lay-filter='printtemplet_editForm_btn'>搜索</span>
                            <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                        </div>
                    </form>
                </div>
        </script>
        <%-- 新增模板弹框 --%>
        <script  type="text/html" id="printtemplet_add">
                <div class="p20">
                    <form class="layui-form" id="printtemplet_addForm" method="post">
                        <div class="layui-form-item">
                            <label class="layui-form-label">模板编码</label>
                            <div class="layui-input-block">
                                <input type="text" name="templateCode" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">模板名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="templateName" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-block">
                                <input type="text" name="remark" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2 pl20 disN">
                            <span class="layui-btn layui-btn-sm" lay-submit lay-filter='printtemplet_addForm_btn'
                            >搜索</span>
                        </div>
                    </form>
                </div>
        </script>

        <%-- 引入js文件 --%>
        <script src="${ctx}/static/js/configuration/other/printtemplet.js"></script>