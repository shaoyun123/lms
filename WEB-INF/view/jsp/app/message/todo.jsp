<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>我的待办</title>
<div class="layui-fluid" id="todo_div">
    <div class="layui-card">
        <div class="layui-tab layui-tab-brief">
            <form class="layui-form" id="msgTodoListSearchForm" lay-filter="msgTodoListSearchForm">
                <input type="hidden" name="listType" value="">
                <ul class="layui-tab-title fl" id="todo_list_ul_tab">
                    <li onclick="getTodoList('')" type="">全部待办<span class="layui-badge"></span></li>
                    <c:forEach items="${listTypeEnums}" var="type">
                        <li onclick="getTodoList(${type.code})" type="${type.code}">${type.name}<span class="layui-badge"></span></li>
                    </c:forEach>
                </ul>
                <div class="fr mr30 mt10">
                    <select name="status" lay-filter="status_msgTodoListSearchForm" lay-search>
                        <option value="">全部</option>
                        <option value="true" selected>未处理</option>
                        <option value="false">已处理</option>
                    </select>
                </div>
            </form>
            <div class="layui-tab-content" style="clear: left">
                <div class="layui-tab-item layui-show">
                    <div class="LAY-app-message-btns" style="margin-bottom: 10px;">
                        <button class="layui-btn layui-btn-primary layui-btn-sm" data-type="all" id="todo_list_batch_deal_btn">
                            标记已处理
                        </button>
                    </div>
                    <table id="todo_list_data_table" lay-filter="todo_list_data_table" class="layui-table" ></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/message/todo.js"></script>