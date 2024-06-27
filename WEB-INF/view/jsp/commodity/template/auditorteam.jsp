<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>审核分组</title>

<style>
#at_userCard .layui-form-checkbox {
    float:left;
    width:10%;
    padding: 10px;
    box-sizing:border-box;
}
#at_userCard .layui-form-checkbox span {
    padding: 0;
    position:absolute;
    left: 36px;
}
</style>



<div class="layui-fluid">
    <div class="layui-row">
        <div class="layui-col-md2">
            <div class="layui-side-scroll background-color:#fff">
                <!-- 左侧子菜单 -->
                <div><div class="layui-btn layui-col-md11" id="auditorteam_addGroupBtn">新增分组</div></div>
                <div class="clearLeft"></div>
                <ul class="layui-nav layui-nav-tree  " id="at_leftSearchDiv">
                    <%--<li class="layui-nav-item layui-this" onclick="searchMember('审核1组',this)"><a>审核1组</a></li>--%>
                    <%--<li class="layui-nav-item" onclick="searchMember('审核2组',this)"><a>审核2组</a></li>--%>
                    <%--<li class="layui-nav-item" onclick="searchMember('审核3组',this)"><a>审核3组</a></li>--%>
                    <%--<li class="layui-nav-item" onclick="searchMember('审核4组',this)"><a>审核4组</a></li>--%>
                    <%--<li class="layui-nav-item" onclick="searchMember('审核5组',this)"><a>审核5组</a></li>--%>
                    <%--<li class="layui-nav-item" onclick="searchMember('审核6组',this)"><a>审核6组</a></li>--%>
                    <%--<li class="layui-nav-item" onclick="searchMember('审核7组',this)"><a>审核7组</a></li>--%>
                    <%--<li class="layui-nav-item" onclick="searchMember('审核8组',this)"><a>审核8组</a></li>--%>
                </ul>
            </div>
        </div>
        <div class="layui-col-md10">
            <div class="layui-card">
                <div class="layui-card-header">
                    <span>表格</span>
                    <button class="layui-btn layui-btn-sm disN" type="button" id="at_search" data-type="reload">提交
                    </button>
                </div>
                <div class="layui-card-body layui-form" id="at_userCard" style="overflow:hidden" lay-filter="at_userCard">
                    <!-- 表格的数据渲染 -->
                    <%--<table class="layui-table" id="at_usersTable" lay-filter="at_usersTable"></table>--%>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="at_memberLayer">
    <form action="" class="layui-form" id="at_memberForm">
        <div class="layui-form-item">
            <label class="layui-form-label">&nbsp;</label>
            <div class="layui-input-block" id="at_membersList">
                <input type="checkbox" name="like1[write]" lay-skin="primary" title="写作" checked="">
                <input type="checkbox" name="like1[read]" lay-skin="primary" title="阅读">
            </div>
        </div>
    </form>
</script>

<script type="text/html" id="auditorteam_addGroupLayer">
    <div>
        <form id="auditorteam_addGroupForm">
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">分组名称</label>
                <div class="layui-input-block">
                    <input type="text" name="teamName" class="layui-input">
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/auditorteam.js"></script>
