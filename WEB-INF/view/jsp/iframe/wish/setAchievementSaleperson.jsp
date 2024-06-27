<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>设置开发专员销售</title>
<style>
    .dis_flex_space {
        display: flex;
        justify-content: space-between;
    }

    .ml {
        margin-left: 10px
    }

    .red {
        color: red;
    }

    .blue {
        color: blue
    }
</style>
<div class="layui-fluid" id="LAY-setAchievementSaleperson">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="wish_setAchievementSalepersonForm" lay-filter="wish_setAchievementSalepersonForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="wish_achi_saleperson_depart_sel" lay-search lay-filter="wish_achi_saleperson_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="wish_achi_saleperson_salesman_sel" lay-search lay-filter="wish_achi_saleperson_salesman_sel" class="users_hp_custom" data-rolelist="wish专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="dis_flex_space">
                        <div class="dis_flex_space">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="batchSetAchievementSaleperson">批量设置</button>
                        </div>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="batchRemoveAchievementSaleperson">批量移除</button>
                    </div>
                    <table class="layui-table" id="wish_achievementSalepersonTable" lay-filter="wish_achievementSalepersonTable"></table>
                    <div id="pageSort"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="${ctx}/static/js/publishs/wish/setAchievementSaleperson.js"></script>