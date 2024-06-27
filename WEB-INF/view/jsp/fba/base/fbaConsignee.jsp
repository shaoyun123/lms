<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>FBA收货地址</title>
<style>
    .text_l {
        text-align: left;
    }
</style>
<!-- 主页面 -->
<div class="layui-fluid" id="fbaConsignee">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="fbaConsignee_Form" lay-filter="fbaConsignee_Form">
                        <!--<input class="disN" type="text" name="limit" value="10">-->
                        <!--<input class="disN" type="text" name="page" value="1">-->
                        <div class="layui-form-item">
                            <div class="layui-col-lg2">
                                <label class="layui-form-label">仓库简称</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="recipientPersonName" >
                                </div>
                            </div>
                            <div class="layui-col-lg2">
                                <label class="layui-form-label">仓库标记</label>
                                <div class="layui-input-block">
                                    <select name="addressMark">
                                        <option value=""></option>
                                        <option value="偏远地区">偏远地区</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                            id="fbaConsignee_Search" lay-filter="fbaConsignee_Search">查询
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header">
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr"
                                id="fbaConsignee_addOne">
                            添加
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table lay-filter="fbaConsignee_table" class="layui-table" id="fbaConsignee_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- 表格渲染-弹窗 -->
<script type="text/html" id="fbaConsignee_createOrEdit_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="fbaConsignee_createOrEdit_Form" lay-filter="fbaConsignee_createOrEdit_Form">
                <input class="disN" type="text" name="id">

<%--                <div class="layui-form-item" notNull>--%>
<%--                    <label class="layui-form-label">目的地仓库简称</label>--%>
<%--                    <div class="layui-inline">--%>
<%--                        <select required lay-verify="required" name="recipientPersonName" lay-search>--%>
<%--                        </select>--%>
<%--                    </div>--%>
<%--                </div>--%>
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">目的地仓库简称</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" name="recipientPersonName">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">公司名称</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" name="recipientCompanyName">
                    </div>
                </div>
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">国家/地区</label>
                    <div class="layui-inline">
                        <select  required lay-verify="required" name="recipientCountryCode" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">邮编</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" required lay-verify="required" name="recipientPostalCode">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">电话</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" name="recipientPhoneNumber">
                    </div>
                </div>
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">城市</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" name="recipientCity">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">电子邮件</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input"  name="recipientEmailAddress">
                    </div>
                </div>
                <div class="layui-form-item"  notNull>
                    <label class="layui-form-label">州</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" required lay-verify="required" name="recipientStateOrProvinceCode">
                    </div>
                </div>
                <div class="layui-form-item"  notNull>
                    <label class="layui-form-label">地址第一行</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" required lay-verify="required" name="recipientStreetLines">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">地址标记</label>
                    <div class="layui-inline">
                       <select name="addressMark">
                           <option value=""></option>
                           <option value="偏远地区">偏远地区</option>
                       </select>
                    </div>
                </div>
                <!--
                <div class="layui-form-item">
                    <label class="layui-form-label">地址第二行</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" required lay-verify="required" name="recipientStreetLines2">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">地址第三行</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" required lay-verify="required" name="recipientStreetLines3">
                    </div>
                </div>
                -->


                <div class="disN">
                    <div class="layui-input-block">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                id="fbaConsignee_createOrEdit_Btn" lay-filter="fbaConsignee_createOrEdit_Btn">提交事件
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<!-- 表格渲染-td内容格式 -->


<!-- 表格渲染-操作按钮 -->
<script type="text/html" id="fbaConsignee_Option">
    <button class="layui-btn layui-btn-sm" lay-event="edit">修改</button><br/>
</script>


<script src="${ctx}/static/js/warehouse/fbaConsignee.js"></script>