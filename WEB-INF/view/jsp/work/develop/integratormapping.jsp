<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>整合人员映射</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" action="" lay-filter="component-form-group"
                          id="integrator_mapping_search_form">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block">
                                    <select id="integrator_mapping_buyer_sel" lay-search="" placeholder="采购员"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购整合人员</label>
                                <div class="layui-input-block">
                                    <select id="integrator_mapping_integrator_sel" lay-search="采购整合人员"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">跟单专员</label>
                                <div class="layui-input-block">
                                    <select id="followOrder_mapping_buyer_sel" lay-search="跟单专员"></select>
                                </div>
                            </div>
                            <%--<div class="layui-col-md2 layui-col-lg2">--%>
                                <%--<label class="layui-form-label">开发专员</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<select id="integrator_mapping_developer_sel" lay-search="开发专员"></select>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:20px">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" id="integrator_mapping_search_btn" lay-filter="demo1">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="integratormappingCard">
                <div class="layui-card-header">
                    <button class="layui-btn layui-btn-sm" id="integrator_mapping_add_btn">新增</button>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="integrator_mapping_data_table"  lay-filter="integrator_mapping_data_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 新增采购整合人员映射 -->
<script type="text/html" id="integrator_mapping_add_layer">
    <div class="p20">
        <form action="" class="layui-form" id="integrator_mapping_add_form">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <label class="layui-form-label"><span style="color:red;">*</span>采购员</label>
                <div class="layui-input-block">
                    <select id="integrator_mapping_add_buyer_sel" lay-verify="required" lay-search=""></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span style="color:red;">*</span>采购整合人员</label>
                <div class="layui-input-block">
                    <select id="integrator_mapping_add_integrator_sel" lay-verify="required" lay-search=""></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span style="color:red;">*</span>跟单专员</label>
                <div class="layui-input-block">
                    <select id="followOrder_mapping_add_sel" lay-verify="required" lay-search=""></select>
                </div>
            </div>
            <%--<div class="layui-form-item">--%>
                <%--<label class="layui-form-label">开发专员</label>--%>
                <%--<div class="layui-input-block">--%>
                    <%--<select id="integrator_mapping_add_developer_sel" lay-verify="required" lay-search=""></select>--%>
                <%--</div>--%>
            <%--</div>--%>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-filter="dm_submitMapping" id="integrator_mapping_add_form_btn">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 编辑采购整合人员映射 -->
<script type="text/html" id="integrator_mapping_edit_layer">
    <div class="p20">
        <form action="" class="layui-form" id="integrator_mapping_edit_form">
            <div class="layui-form-item">
                <label class="layui-form-label"><span style="color:red;">*</span>采购员</label>
                <div class="layui-input-block">
                    <select id="integrator_mapping_edit_buyer_sel" lay-verify="required" lay-search="" disabled="disabled"></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span style="color:red;">*</span>采购整合人员</label>
                <div class="layui-input-block">
                    <select id="integrator_mapping_edit_integrator_sel" lay-verify="required" lay-search=""></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span style="color:red;">*</span>跟单专员</label>
                <div class="layui-input-block">
                    <select id="followOrder_mapping_edit_sel" lay-verify="required" lay-search=""></select>
                </div>
            </div>
            <%--<div class="layui-form-item">--%>
                <%--<label class="layui-form-label">开发专员</label>--%>
                <%--<div class="layui-input-block">--%>
                    <%--<select id="integrator_mapping_edit_developer_sel" lay-verify="required" lay-search=""></select>--%>
                <%--</div>--%>
            <%--</div>--%>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-filter="dm_submitMapping" id="integrator_mapping_edit_form_btn">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="integrator_mapping_edit_bar">
    <a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit">修改</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
</script>
<script type="text/javascript" src="${ctx}/static/js/work/develop/integratormapping.js"></script>