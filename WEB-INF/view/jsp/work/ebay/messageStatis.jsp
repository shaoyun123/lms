<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>客服统计</title>
        <div class="layui-fluid" v-cloak>
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form action="" class="layui-form" id="eaby_messageStatis_form">
                                <div class="layui-form-item layui-row">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select name="orgId" lay-filter="orgs_hp_eaby_messageStatis" lay-search
                                                class="orgs_hp_custom">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">客服专员</label>
                                        <div class="layui-input-block">
                                            <select name="customServicerId" class="users_hp_custom" lay-search
                                                data-rolelist="ebay客服专员" lay-filter="users_hp_eaby_messageStatis"
                                                data-type="customservicer">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select name="acctIds" xm-select-search class="store_hp_custom"
                                                xm-select="eaby_messageStatis_storeAcct_sel" xm-select-search-type="dl"
                                                xm-select-skin="normal" data-platcode="ebay">
                                                <option value="">选择店铺</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">邮件接收时间</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" id="eaby_messageStatis_time"
                                                name="time">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <div class="layui-input-block clearfix">
                                            <span id="eaby_messageStatis_search_submit" lay-submit
                                                class="layui-btn layui-btn-sm">搜索</span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <div class="layui-tab">
                                <div class="layui-tab-content">
                                    <table class="layui-table" id="eaby_messageStatis_table"
                                        lay-filter="eaby_messageStatis_table"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script type="text/javascript" src="${ctx}/static/js/publishs/ebay/messageStatis.js"></script>