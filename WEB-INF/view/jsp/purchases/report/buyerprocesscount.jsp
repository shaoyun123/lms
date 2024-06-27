<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>采购进度报表</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="buyerProcessCountSearchForm" lay-filter="buyerProcessCountSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="times" readonly placeholder="3个月内" class="layui-input" id="queryTime_buyerProcessCount">
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="orgs_hp_buyer_buyerprocesscount" class="orgs_hp_custom" data-id="buyer_buyerprocesscount">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block">
                                    <select name="buyerId" lay-filter="users_hp_buyer_buyerprocesscount" lay-search="" class="users_hp_custom" data-id="buyer_buyerprocesscount" data-roleList="采购专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <input type="checkbox" lay-skin="primary" name="ifDelCurrentCount" title="重新统计" value="true">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="search_buyerprocesscount">搜索</button>
                                    <permTag:perm funcCode="export_buyerprocesscount">
                                        <button type="button" class="layui-btn layui-btn-sm" id="exportBuyerProcessCountBtn">导出</button>
                                    </permTag:perm>
                                    <div id="buyerprocesscount_save" class="inline_block pora"></div>
                                    <button type="reset" id="search_buyerprocesscount_reset_btn" class="layui-btn layui-btn-primary layui-btn-sm disN">清空</button>
                                </div>
                            </div>

                        </div>
                    </form>

                </div>
            </div>
            <div class="layui-card" id="buyerProcessCountmanageCard">
                <div class="layui-card-body">
                    <span class="numCount">总数(<span id="buyerProcessCount_colLen"></span>)</span>
                    <span class="fr">
                            <%--<button type="button" class="layui-btn layui-btn-sm" id="exportBuyerProcessCountBtn">导出</button>--%>
                    </span>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="buyerProcessCountTable" lay-filter="buyerProcessCountTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

        <script type="text/html" id="ali1688AccessTokenTpl">
            {{# if(d.refreshToken != null){ }}
            {{ Format(d.refreshTokenExpiryTime,"yyyy-M-d h:m:s")}}
            <!--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="refreshToken" style="position:absolute;top:0;right:5px" >刷新Token</a>-->
            {{# } }}
        </script>

        <script type="text/html" id="buyerProcessCountStatusTpl">
            {{# if(d.status == false){ }}
            <font color="red">已停用</font>
            {{# } else { }}
            已启用
            {{# } }}
        </script>
        <!--处理wish店铺同步时间-->
        <script type="text/html" id="purReport_lastSyncTime">
            {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
        </script>
        <
        <!-- 工具条模板,写在script里面 -->
        <script type="text/html" id="ali1688TableBar">
            <permTag:perm funcCode="get1688AcctTokenBtn">
                <a class="layui-btn layui-btn-xs" lay-event="generateAccessToken">授权</a>
            </permTag:perm>
            <permTag:perm funcCode="editbuyerProcessCountBtn">
                <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
            </permTag:perm>
            <permTag:perm funcCode="editReceiveAddress">
                <a class="layui-btn layui-btn-xs" lay-event="address">地址</a>
            </permTag:perm>
        </script>
<!-- ali1688添加基本信息模态框内容 -->
<script type="text/html" id="purProgress_addLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="buyerProcessCountAddForm">

            <div class="layui-form-item">
                <div class="layui-inline" notNull>
                    <label class="layui-form-label" style="width:150px">账号名称</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <input type="text" name="acctName" required lay-verify="required" placeholder="内部标注自用"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <%--<div class="layui-form-item">--%>
                <%--<div class="layui-inline">--%>
                    <%--<label class="layui-form-label" style="width:150px">登录账号</label>--%>
                    <%--<div class="layui-input-inline" style="width:300px;">--%>
                        <%--<input type="text" name="acct" required lay-verify="required" placeholder="1688登录账号"--%>
                               <%--class="layui-input">--%>
                    <%--</div>--%>
                <%--</div>--%>
            <%--</div>--%>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" placeholder="请输入备注内容" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- ali1688 生成token modal -->
<script type="text/html" id="ali1688TokenModalLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="ali1688TokenAddForm">
            <p>跳转至授权页面<a id="code1688Url" TARGET="_blank" style="color: blueviolet"></a>，登录账号，同意授权</p>
            <%--<p>第二步，如果成功跳转 https://lms.epean.com.cn/lms/buyerProcessCount/getAccessToken.html。则授权已经成功，不用再进行下面第三步</p>--%>
            <%--<p>第三步，获取浏览器地址栏上的code参数，输入到下面输入框中，点击授权</p>--%>
            <%--<div class="layui-form-item">--%>
                <%--<label class="layui-form-label" style="width:150px">Code</label>--%>
                <%--<div class="layui-input-inline" style="width:500px">--%>
                    <%--<input type="text" name="code" required lay-verify="required" placeholder="请输入Code" class="layui-input">--%>
                <%--</div>--%>
            <%--</div>--%>
        </form>
    </div>
</script>

<script type="text/html" id="addressTablePop_buyerProcessCountmanage">
    <div class="p20">
        <div class="layui-card-body">
            <span class="numCount">总数(<span id="addressNumber"></span>)</span>
            <!-- 表格的数据渲染 -->
            <table class="layui-table" id="addressTable_buyerProcessCountmanage" lay-filter="addressTable_buyerProcessCountmanage"></table>
        </div>
    </div>
</script>

<script type="text/html" id="ifDefault_address_buyerProcessCountmanage">
    <div><input type="checkbox" lay-skin="primary" {{d.ifDefault ? 'checked' : ''}} disabled></div>
</script>

<script type="text/html" id="addressTabBar">
    <div><a class="layui-btn layui-btn-xs" lay-event="setDefault" disabled="">设为默认</a></div>
</script>
<script type="text/javascript" src="${ctx}/static/js/purchases/buyerprocesscount.js"></script>

<script type="text/html" id="getBuyerProcessDetail_tpl">
    <div>
        <a data-id="{{d.buyerId}}"  onclick="openBuyerProcessDetailTable('{{d.buyerId}}','{{d.beginDate}}','{{d.endDate}}')" href="javascrpt:;" style="color:blue" >{{d.buyer}}</a>
    </div>
</script>

<script type="text/html" id="getBuyerProcessDetail_table_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="getBuyerProcessDetail_show_table" lay-filter="getBuyerProcessDetail_show_tableFilter"></table>
        </div>
    </div>
</script>
