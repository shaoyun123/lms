<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<title>1688账号权限</title>

<style>
    .acctBox{
        float: left;
        padding: 5px 10px;
        margin-right: 10px;
    }
    .defaultAcct{
        background-color: orange;
        color: white;
    }
    .notDefaultAcct{
        background-color: grey;
        color: white;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="ali1688AcctGrantSearchForm">
                        <div class="layui-col-md2 layui-col-lg2">
                            <label class="layui-form-label">部门</label>
                            <div class="layui-input-block">
                                <select name="orgId" lay-filter="orgs_hp_buyer_ali1688acctgrant" class="orgs_hp_custom" data-id="buyer_ali1688acctgrant">
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                            <label class="layui-form-label">采购员</label>
                            <div class="layui-input-block">
                                <select name="buyerId" lay-filter="users_hp_buyer_ali1688acctgrant" lay-search class="users_hp_custom" data-id="buyer_ali1688acctgrant" data-roleList="采购专员">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                            <label class="layui-form-label">1688账号</label>
                            <div class="layui-input-block">
                                <select name="purAcctId" lay-search >
                                    <option value=""></option>
                                    <c:forEach items="${purAcctList}" var="purAcct">
                                        <option value="${purAcct.id}">${purAcct.acct}</option>
                                    </c:forEach>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="ali1688AcctGrantSearch">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                    <div style="position:absolute;top:10px;right:20px">
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="add1688Acct">
                                    <button class="layui-btn layui-btn-normal layui-btn-sm" id="add1688AcctGrantBtn">添加授权
                                    </button>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="ali1688acctgrantCard">
                <div class="layui-card-header">
                    <span class="numCount">总数(<span id="ali1688AccountGrantNum"></span>)</span>
                    <span class="fr">
                            <button type="button" class="layui-btn layui-btn-sm" id="addPemitListBtn">批量添加授权</button>
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="delPemitListBtn">批量删除授权</button>
                    </span>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="ali1688AcctGrantTable" lay-filter="ali1688AcctGrantTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 工具条模板,写在script里面 -->
<script type="text/html" id="ali1688AcctGrantTableBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
</script>

<script type="text/html" id="pemitAcctListLayer">
    {{# for(var i = 0; i < d.purBuyerAccts.length; ++i) {}}
        <span class="acctBox {{d.purBuyerAccts[i].ifDefault ? 'defaultAcct' : 'notDefaultAcct'}}" data-id="d.purBuyerAccts[i].id"> {{d.purBuyerAccts[i].acct}}
            {{# if (d.purBuyerAccts[i].addressId){}}
                <i class="layui-icon layui-icon-face-smile" style="font-size: 15px; color: cornflowerblue;" title="已经设置默认收货地址">&#xe6af;</i>
            {{#}}}
        </span>
    {{# } }}
</script>

<!-- 新增授权 -->
<script type="text/html" id="addali1688AcctGrantLayer">
    <div class="p20">
        <p style="color: grey;">重复添加，可成功，但只会变更此次添加时输入的  默认状态</p>

        <form action="" class="layui-form layui-form-pane" id="ali1688Authorization_AcctAddForm" lay-filter="ali1688Authorization_AcctAddForm">
            <div class="layui-form-item">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">1688账号</label>
                    <div class="layui-input-block">
                        <select name="purAcctId" lay-search>
                            <option value=""></option>
                            <c:forEach items="${purAcctList}" var="purAcct">
                                <option value="${purAcct.id}">${purAcct.acct}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">采购员</label>
                    <div class="layui-input-block">
                        <select name="buyerId" lay-search>
                            <option value=""></option>
                            <c:forEach items="${buyers}" var="buyer">
                                <option value="${buyer.id}">${buyer.userName}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <input type="checkbox" name="ifDefault" lay-skin="primary" title="默认">
                </div>
            </div>
        </form>
    </div>
</script>


<%--批量新增授权--%>
<script type="text/html" id="addAli1688PemitListLayer">
    <div class="p20">
        <p style="color: grey;">重复添加，可成功，但只会变更此次添加时输入的  默认状态</p>
        <form class="layui-form layui-form-pane" id="addAli1688PemitListForm" lay-filter="addAli1688PemitListForm">
            <div class="layui-form-item">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">1688账号</label>
                    <div class="layui-input-block">
                        <select name="purAcctId" lay-search>
                            <option value=""></option>
                            <c:forEach items="${purAcctList}" var="purAcct">
                                <option value="${purAcct.id}">${purAcct.acct}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <input type="checkbox" name="ifDefault" lay-skin="primary" title="默认">
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="purBuyerAcctTabLayer">
    <div class="p20">
        <div class="layui-card-body">
            <table class="layui-table" id="purBuyerAcctTab" lay-filter="purBuyerAcctTab"></table>
        </div>
    </div>
</script>

<script type="text/html" id="ifDefaultBox_purBuyerAcctTab">
    <div><input type="checkbox" lay-skin="primary" {{d.ifDefault ? 'checked': ''}} disabled/></div>
</script>


<script type="text/html" id="purBuyerAcctTableBar">
    <a class="layui-btn layui-btn-xs" lay-event="setDefault">设为默认</a>
    <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="defaultAddress">地址</a>
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a>
</script>


<script type="text/html" id="addressTablePop_ali1688acctgrant">
    <div class="p20">
        <div class="layui-card-body">
            <input type="hidden" id="grantId_ali1688acctgrant">
            <span class="numCount">总数(<span id="addressNumber_ali1688acctgrant"></span>)</span>
            <!-- 表格的数据渲染 -->
            <table class="layui-table" id="addressTable_ali1688acctgrant" lay-filter="addressTable_ali1688acctgrant"></table>
        </div>
    </div>
</script>

<script type="text/html" id="addressTabBar_ali1688acctgrant">
    <div><a class="layui-btn layui-btn-xs" lay-event="setDefault" disabled="">设为默认</a></div>
</script>

<script type="text/javascript" src="${ctx}/static/js/purchases/ali1688acctgrant.js"></script>
