<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<title>语音播报</title>
<style>
    #voice_speech_searchForm .layui-form-item{
        margin-bottom:0
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="voice_speech_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">业务模块</label>
                                <div class="layui-input-block">
                                    <select name="business_module" id="business_module" lay-search>
                                        <option value='1'>语音播报模块<option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">文件名</label>
                                <div class="layui-input-block">
                                    <input type="text" id="file_name" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-block">
                                    <input type="text" id="file_remark" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="voiceSearchBtn">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="voice_speech_card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="voice_speech_tab_filter">
                        <ul class="layui-tab-title">
                            <div style="float:left;margin: 3px 0 0 12px">
                                <li class="layui-this" id="voice_speech_li">(<span id="tolnum_span_num"></span>)</li>
                            </div>

                            <div style="float:right;margin: 3px 0 0 5px">
                                <button type="button" id="add_voice" class="layui-btn layui-btn-sm layui-btn-normal">新增</button>
                            </div>
                        </ul>
                        <div class="layui-tab-content" id="issue_processing_div" style="">
                            <table id="voice_speech_table" lay-filter="voice_speech_table"></table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="addVoiceSpeechtpl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="voice_addForm"  lay-filter="voice_addForm" autocomplete="off">
                        <div class="layui-form-item" notNull>
                            <label class="layui-form-label">语音文件</label>
                            <input id="voice_file" type="file" multiple="multiple"/>
                            <audio id="audio" controls="" style="display: none;"></audio>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">语音名称</label>
                            <div class="layui-input-block">
                                <input name="file_name_in" id="file_name_in" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">业务模块</label>
                            <div class="layui-input-block">
                                <select name="business_module_input" id="business_module_input" lay-search>
                                    <option value='1'>语音播报模块<option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-block">
                                <input name="voice_desc" id="voice_desc" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <span style="color: blue">上传语音文件时可不填写语音名称。生成语音播报时需填写语音名称作为语音播报内容。</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="busiMudBar">
    {{# if(d.businessModule != null){ }}
        {{# if(d.businessModule == '1'){ }}
        <span style="">语音播报模块</span>
        {{#  } }}
    {{# } }}
</script>
<script type="text/html" id="voice_processBar">
    <audio id="audiolist_{{d.id}}" controls="" style="display: none;"></audio>
    <a class="layui-btn layui-btn-xs" lay-event="play">播放</a>
<%--
    <a class="layui-btn layui-btn-xs" lay-event="download">下载</a>
--%>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="edit">修改</a>
</script>
<script type="text/javascript" src="${ctx}/static/js/configuration/other/voiceSpeech.js"></script>
