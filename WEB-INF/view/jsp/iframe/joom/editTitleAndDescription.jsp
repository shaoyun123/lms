<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>修改标题</title>
<style>
    #adjustPriceSearchForm .layui-form-item{
        margin-bottom:0
    }
    .dis_flex{
        display: flex;
        justify-content: space-between;
    }
    .w_70{
        width:70%
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12" id="editTitleAndDescription">
            <div class="layui-card">
                <div class="layui-card-body">
                        <div class="layui-form-item">
                            <input type="hidden" id="joomEditTandD_idList">
                            <div class="layui-inline">
                                <label class="layui-form-label">标题</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="joom_old_title" id="joom_old_title" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">替换为</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="joom_new_title" id="joom_new_title" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">描述</label>
                                <div class="layui-input-inline">
                                    <textarea name="" cols="30" rows="4" id="joom_old_describe" class="layui-textarea"></textarea>
<%--                                    <input type="text"  id="joom_old_describe" autocomplete="off" class="layui-input">--%>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">替换为</label>
                                <div class="layui-input-inline">
                                    <textarea name="" cols="30" rows="4" id="joom_new_describe" class="layui-textarea"></textarea>
<%--                                    <input type="text"  id="joom_new_describe" autocomplete="off" class="layui-input">--%>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <button type="button" id="joom_mt_replaceSubtitle" class="layui-btn layui-btn-normal layui-btn-sm" >替换</button>
                                <button type="button" id="joom_search_replace" class="layui-btn layui-btn-normal layui-btn-sm" >调整</button>
                            </div>
                        </div>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex">
                <div class="layui-card-header dis_flex w_70" style="height: 100px;">
                    <div style="line-height: 30px;">表格(<span id="tolnum_span_joom_editTitle"></span>)</div>
                    <div class="layui-form dis_flex"> 
                        <label class="layui-form-label" style="width: 120px;">标题一键修改为</label>
                        <div class="layui-input-inline">
                            <input type="text" class="layui-input" id="joomapplicationTitle">
                        </div>
                        <button class="layui-btn layui-btn-normal layui-btn-sm" id="one_click_application_title">一键应用</button>
                </div>
                    <div class="layui-form dis_flex"> 
                        <label class="layui-form-label" style="width: 120px;">描述一键修改为</label>
                        <div class="layui-input-inline">
                            <textarea name="" cols="30" rows="5" id="joomapplicationDesc" class="layui-textarea"></textarea>
                        </div>
                        <button class="layui-btn layui-btn-normal layui-btn-sm" id="one_click_application_describe">一键应用</button>
                    </div>
                </div>
                    <button class="layui-btn layui-btn-normal layui-btn-sm" id="joomOnlineETAD_aync_describe">同步描述</button>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="modifyJoomTitle_Table" lay-filter="modifyJoomTitle_Table"></table>
                    <script type="text/html" id="new_Joomdescribe">
                       <%-- <input type="text" class="layui-input"  style="height:28px"  value="{{ d.prodDesc || '' }}">--%>
                        <textarea class="layui-textrarea descript_textarea" id="new_Joomdescribe_textarea" style="min-height:200px;" cols="40">{{ d.prodDesc || '' }}</textarea>
                    </script>
                    <script type="text/html" id="new_JoomTitle">
                        <input type="text" class="layui-input title_input ifFocusInput" id="new_JoomTitle_input" data-prodpid="{{d.prodPId}}" style="height:28px"  value="{{ d.title || '' }}">
                    </script>
                    <script type="text/html" id="editTitle_id_Joomid">
                        <input type="hidden" class="layui-input id_Joomid_input" value="{{ d.id || '' }}">
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/joom/editTitleAndDescription.js"></script>