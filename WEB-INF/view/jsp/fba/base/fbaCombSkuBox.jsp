<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>组合品篮号</title>
<style>
    .text_l {
        text-align: left;
    }
</style>
<!-- 主页面 -->
<div class="layui-fluid" id="FbaCombSkuBox">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="FbaCombSkuBox_Form" lay-filter="FbaCombSkuBox_Form">
                        <div class="layui-form-item">
                            <!--<input class="disN" type="text" name="limit" value="10">-->
                            <!--<input class="disN" type="text" name="page" value="1">-->
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">箱子状态</label>
                                <div class="layui-input-block">
                                    <select type="text" class="layui-input" name="useStatus">
                                        <option value="" selected>全部</option>
                                        <option value="0">未占用</option>
                                        <option value="1">已占用</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                            id="FbaCombSkuBox_Search" lay-filter="FbaCombSkuBox_Search">查询
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div id="FbaCombSkuBox_showInfo">

                    </div>
                </div>
            </div>
            <div class="layui-card">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header">
                        <div class="fl">
                            <span style="background-color:deepskyblue">    正常篮子已用/总    </span><span id="FbaCombSkuBox_showInfo_num"></span>
                        </div>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm layui-btn-danger fr"
                                id="FbaCombSkuBox_batch_delete">
                            批量删除
                        </button>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr"
                                id="FbaCombSkuBox_batch_print">
                            批量打印
                        </button>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr"
                                id="FbaCombSkuBox_addBox">
                            添加箱子
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">

                    <table lay-filter="FbaCombSkuBox_table" class="layui-table" id="FbaCombSkuBox_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- 表格渲染-弹窗 -->
<script type="text/html" id="FbaCombSkuBox_create_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaCombSkuBox_edit_Form" lay-filter="FbaCombSkuBox_create_Form">
                <div class="layui-form-item">
                    <label class="layui-form-label">编号前缀</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" required lay-verify="required" name="prefix"
                               value="">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">编号区分</label>
                    <div class="layui-inline">
                        <input type="number" class="layui-input" name="startNum">
                    </div>
                    <div class="layui-inline">
                        <input type="number" class="layui-input" name="endNum">
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3 disN">
                    <div class="layui-input-block">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                id="FbaCombSkuBox_createBtn" lay-filter="FbaCombSkuBox_createBtn">提交事件
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<!-- 表格渲染-td内容格式 -->
<script type="text/html" id="FbaCombSkuBox_useStatus_tpl">
    {{# if(d.useStatus == 1){ }}
    <span>已占用</span>
    {{# }else{ }}
    <span>未占用</span>
    {{# } }}
</script>

<!-- 表格渲染-操作按钮 -->
<script type="text/html" id="FbaCombSkuBox_Option">
        <button class="layui-btn layui-btn-sm" lay-event="print">打印</button><br/>
        <button class="layui-btn layui-btn-sm layui-btn-danger" lay-event="delete">删除</button>
</script>


<script src="${ctx}/static/js/warehouse/fbaCombSkuBox.js"></script>