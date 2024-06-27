<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>货架计划箱号</title>
<style>
    .text_l {
        text-align: left;
    }
</style>
<!-- 主页面 -->
<div class="layui-fluid" id="FbaBox">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="FbaBox_Form" lay-filter="FbaBox_Form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">箱号</label>
                                <div class="layui-input-block">
                                   <input class="layui-input" name="boxCodeListStr" placeholder="精确查询,多个以,隔开">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">箱子尺寸</label>
                                <div class="layui-input-block">
                                    <select type="text" class="layui-input" name="size">
                                        <option value="" selected>全部</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="无">无尺寸</option>
                                    </select>
                                </div>
                            </div>
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
                                            id="FbaBox_Search" lay-filter="FbaBox_Search">查询
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div id="FbaBox_showInfo">

                    </div>
                </div>
            </div>
            <div class="layui-card">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header">
                        <div class="fl">
                            <span style="background-color:deepskyblue">    正常盒子已用/总    </span><span id="FbaBox_showInfo_num"></span>
                        </div>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm layui-btn-danger fr"
                                id="FbaBox_batch_modifySize">
                            批量修改
                        </button>

                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm layui-btn-danger fr"
                                id="FbaBox_batch_delete">
                            批量删除
                        </button>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr"
                                id="FbaBox_batch_print">
                            批量打印
                        </button>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr"
                                id="FbaBox_addBox">
                            添加箱子
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <div>数量:(<span id="fbaBox_queryNum">0</span>)</div>
                    <table lay-filter="FbaBox_table" class="layui-table" id="FbaBox_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="fbaBox_timeTemp">
    <div><span class="secondary">创建：</span>{{format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>
    <div><span class="secondary">修改：</span>{{format(d.modifyTime,"yyyy-MM-dd hh:mm:ss")}}</div>
</script>

<!-- 表格渲染-弹窗 -->
<script type="text/html" id="FbaBox_create_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaBox_edit_Form" lay-filter="FbaBox_create_Form">
                <div class="layui-form-item">
                    <label class="layui-form-label">编号前缀</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" required lay-verify="required" name="prefix"
                               value="">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">编号范围</label>
                    <div class="layui-inline">
                        <input type="number" class="layui-input" name="startNum" placeholder="起始">
                    </div>
                    <div class="layui-inline">
                        <input type="number" class="layui-input" name="endNum" placeholder="结束">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">箱子尺寸</label>
                    <div class="layui-inline">
                        <select name="size">
                            <option value=""></option>
                            <option value="L">L</option>
                            <option value="M">M</option>
                            <option value="S">S</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3 disN">
                    <div class="layui-input-block">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                id="FbaBox_createBtn" lay-filter="FbaBox_createBtn">提交事件
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<!-- 表格渲染-td内容格式 -->
<script type="text/html" id="FbaBox_useStatus_tpl">
    {{# if(d.useStatus == 1){ }}
    <span>已占用</span>
    {{# }else{ }}
    <span>未占用</span>
    {{# } }}
</script>

<!-- 表格渲染-操作按钮 -->
<script type="text/html" id="FbaBox_Option">
        <button class="layui-btn layui-btn-sm" lay-event="print">打印</button><br/>
        <button class="layui-btn layui-btn-sm layui-btn-danger" lay-event="delete">删除</button>
</script>

<script type="text/html" id="FbaBox_modifySize_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaBox_modifySize_Form" lay-filter="FbaBox_modifySize_Form">
                <div class="layui-form-item">
                    <label class="layui-form-label">箱子尺寸</label>
                    <div class="layui-inline">
                        <select name="size">
                            <option value=""></option>
                            <option value="L">L</option>
                            <option value="M">M</option>
                            <option value="S">S</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>


<script src="${ctx}/static/js/warehouse/fbaBox.js"></script>