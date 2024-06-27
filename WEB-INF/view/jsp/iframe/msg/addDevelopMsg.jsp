<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<style>
    li.window_map_imgLi{
        float: left;
    }
    img.window_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
    }
    div.window_map_imgDiv{
        width:120px;
        height:80px;
        display:inline-block;
        vertical-align: middle;
        margin-right:5px;
        position:relative;
        border: 1px solid #ccc;
    }
</style>
<title>添加开发通知</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="p20">
                    <form action="" class="layui-form" id="developNotice_addForm">
                        <div class="layui-form-item">
                            <label class="layui-form-label">需求类型<span style="color: red;">*</span></label>
                            <div class="layui-input-block">
                                <select  name="msg_develop_type" style="width: 1050px;" xm-select="msg_develop_typetpl" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='msg_develop_typetpl'>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">sku<span style="color: red;">*</span></label>
                            <div class="layui-input-block">
                                <input type="text" autocomplete="off" class="layui-input" style="width: 1147px;" placeholder="sku" id="development_msg_sku" >
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">需求处理人<span style="color: red;">*</span></label>
                            <div class="layui-input-block">
                                <textarea  autocomplete="off" class="layui-input"  id="develop_person" style="width:1147px; height:100px" disabled></textarea>
                                <button type="button" class='layui-btn' id="add_develop_msg_personbtn" onclick="add_develop_msg_personClick();">添加处理人</button>
                            </div>
                        </div>
                        <%--<div class="layui-form-item">
                            <label class="layui-form-label">图片</label>
                            <div class="layui-input-block" id="prcture_area">
                                <ul id="msg_develop_imgDiv_ul" class="msg_develop_imgDiv_ul" style="width:780px; height:100px">
                                    <li style="padding: 5px 0;" class="window_map_imgLi">

                                    </li>
                                    <div style="float:right;">
                                        <div>
                                            <div id="msg_add_img"></div><!--图片上传按钮-->
                                        </div>
                                    </div>
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                        </div>--%>
                        <!-- 图片 -->
                        <div class="layui-form-item">
                            <label class="layui-form-label">图片</label>
                            <div class="layui-input-inline">
<%--
                                <button type="button" class="layui-btn" id="delete_msg_pasteImg">删除图片</button>
--%>
                                <input type="hidden" name="image" >
                                <div in='innerImage' id="add_msg_image" style='width:1147px;height:200px;border:1px solid #ccc'
                                     contenteditable='true'></div>
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label class="layui-form-label">通知备注<span style="color: red;">*</span></label>
                            <div class="layui-input-block">
                                <textarea  autocomplete="off" class="layui-textarea" id="develop_msg_remark" style="width:1147px; height:100px"></textarea>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="develop_msg_org_layer">
    <div class="layui-col-md3">
        <div style="display: inline-block; padding: 4px;">
            <form class="layui-form" id="adddevelopmsg_layer_form">
                <span id="un_listing_text" style="color: #00B83F;margin-left:9px;display:block;word-break:keep-all;"></span><br>
                <div id="develop_msg_orgXTree" style="width:300px;padding: 10px 0 25px 5px;"></div>
            </form>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/process/addDevelopMsg.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/process/msgdevelopButton.js"></script>

<script src="${ctx}/static/UploadImage.js"></script>

