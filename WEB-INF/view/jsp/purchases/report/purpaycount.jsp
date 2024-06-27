<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>采购付款统计</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="purPayCountSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="times" readonly placeholder="3个月内" class="layui-input" id="queryTime_purPayCount">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="purPayCountSearch">搜索</button>
                                    <button type="button" class="layui-btn layui-btn-sm" id="exportPurpaycountBtn">导出</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="purPayCountmanageCard">
                <div class="layui-card-body">
                    <span class="numCount">总数(<span id="purPayCount_colLen"></span>)</span>
                    <span class="fr">
                    </span>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="purPayCountTable" lay-filter="purPayCountTable"></table>
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

<script type="text/html" id="purPayCountStatusTpl">
    {{# if(d.status == false){ }}
    <font color="red">已停用</font>
    {{# } else { }}
    已启用
    {{# } }}
</script>
<!--处理wish店铺同步时间-->
<script type="text/html" id="purPayment_lastSyncTime">
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<
<!-- 工具条模板,写在script里面 -->
<script type="text/html" id="ali1688TableBar">
    <permTag:perm funcCode="get1688AcctTokenBtn">
        <a class="layui-btn layui-btn-xs" lay-event="generateAccessToken">授权</a>
    </permTag:perm>
    <permTag:perm funcCode="editpurPayCountBtn">
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    </permTag:perm>
    <permTag:perm funcCode="editReceiveAddress">
        <a class="layui-btn layui-btn-xs" lay-event="address">地址</a>
    </permTag:perm>
</script>
<!-- ali1688添加基本信息模态框内容 -->
<script type="text/html" id="purPament_addInfoLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="purPayCountAddForm">

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
            <%--<p>第二步，如果成功跳转 https://lms.epean.com.cn/lms/purPayCount/getAccessToken.html。则授权已经成功，不用再进行下面第三步</p>--%>
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

<script type="text/html" id="addressTablePop_purPayCountmanage">
    <div class="p20">
        <div class="layui-card-body">
            <span class="numCount">总数(<span id="addressNumber"></span>)</span>
            <!-- 表格的数据渲染 -->
            <table class="layui-table" id="addressTable_purPayCountmanage" lay-filter="addressTable_purPayCountmanage"></table>
        </div>
    </div>
</script>

<script type="text/html" id="ifDefault_address_purPayCountmanage">
    <div><input type="checkbox" lay-skin="primary" {{d.ifDefault ? 'checked' : ''}} disabled></div>
</script>

<script type="text/html" id="addressTabBar">
    <div><a class="layui-btn layui-btn-xs" lay-event="setDefault" disabled="">设为默认</a></div>
</script>
<script type="text/javascript" src="${ctx}/static/js/purchases/purpaycount.js"></script>
