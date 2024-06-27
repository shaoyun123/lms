<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>采购账号</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="ali1688AcctSearchForm">
                        <div class="layui-inline w100">
                            <div class="layui-input-inline">
                                <select name="status">
                                    <option value="">全部</option>
                                    <option value="true">启用中</option>
                                    <option value="false">已停用</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline" style="width:150px">
                            <div class="layui-input-inline">
                                <input type="text" name="acctName" placeholder="昵称" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline" style="width:150px">
                            <div class="layui-input-inline">
                                <input type="text" name="acct" placeholder="登录账号" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="ali1688Search">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                    <div style="position:absolute;top:10px;right:20px">
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="add1688Acct">
                                    <button class="layui-btn layui-btn-normal layui-btn-sm" id="add1688AcctBtn">添加账号
                                    </button>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="ali1688acctmanageCard">
                <div class="layui-card-body">
                    <span class="numCount">总数(<span id="ali1688Account_colLen"></span>)</span>
                    <span class="fr">
                            <button type="button" class="layui-btn layui-btn-sm" id="syncReceiveAddressBtn">同步收货地址</button>
                    </span>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="ali1688AcctTable" lay-filter="ali1688AcctTable"></table>
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

        <script type="text/html" id="ali1688AcctStatusTpl">
            {{# if(d.status == false){ }}
            <font color="red">已停用</font>
            {{# } else { }}
            已启用
            {{# } }}
        </script>

        <script type="text/html" id="ali1688AcctTypeTpl">
            {{# if(d.acctType == 1){ }}
            <span>1688</span>
            {{# } }}
            {{# if(d.acctType == 2){ }}
            <span>1688财务</span>
            {{# } }}
            {{# if(d.acctType == 3){ }}
            <span>淘宝</span>
            {{# } }}
        </script>
        <!--处理wish店铺同步时间-->
        <script type="text/html" id="ali1688_lastSyncTime">
            {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
        </script>
        <
        <!-- 工具条模板,写在script里面 -->
        <script type="text/html" id="ali1688TableBar">
            <permTag:perm funcCode="get1688AcctTokenBtn">
                <a class="layui-btn layui-btn-xs" lay-event="generateAccessToken">授权</a>
            </permTag:perm>
            <permTag:perm funcCode="editali1688AcctBtn">
                <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
            </permTag:perm>
            <permTag:perm funcCode="editReceiveAddress">
                <a class="layui-btn layui-btn-xs" lay-event="address">地址</a>
            </permTag:perm>
            {{# if (d.status) {}}
            <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="disable">停用</a>
            {{# } else{ }}
            <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="enable">启用</a>
            {{# } }}
        </script>
<!-- ali1688添加基本信息模态框内容 -->
<script type="text/html" id="ali1688Account_addInfoLayer">
    <div class="p20">
        <form lay-filter="ali1688AcctAddForm" class="layui-form layui-form-pane" id="ali1688AcctAddForm">

            <div class="layui-form-item">
                <div class="layui-col-md6 layui-col-lg6" notNull>
                    <label class="layui-form-label">昵称</label>
                    <div class="layui-input-block">
                        <input type="text" name="acctName" required lay-verify="required" placeholder="内部标注自用"
                               class="layui-input">
                    </div>
                </div>

            </div>
            <div class="layui-form-item">
                <div class="layui-col-md6 layui-col-lg6" notNull>
                    <label class="layui-form-label">账号类型</label>
                    <div class="layui-input-block">
                        <select name="acctType" id="acctType" lay-filter="acctType" lay-search>
                        </select>
                    </div>
                </div>

            </div>
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
            <%--<p>第二步，如果成功跳转 https://lms.epean.com.cn/lms/ali1688Acct/getAccessToken.html。则授权已经成功，不用再进行下面第三步</p>--%>
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

<script type="text/html" id="addressTablePop_ali1688acctmanage">
    <div class="p20">
        <div class="layui-card-body">
            <span class="numCount">总数(<span id="addressNumber"></span>)</span>
            <!-- 表格的数据渲染 -->
            <table class="layui-table" id="addressTable_ali1688acctmanage" lay-filter="addressTable_ali1688acctmanage"></table>
        </div>
    </div>
</script>

<script type="text/html" id="ifDefault_address_ali1688acctmanage">
    <div><input type="checkbox" lay-skin="primary" {{d.ifDefault ? 'checked' : ''}} disabled></div>
</script>

<script type="text/html" id="addressTabBar">
    <div><a class="layui-btn layui-btn-xs" lay-event="setDefault" disabled="">设为默认</a></div>
</script>
<script type="text/javascript" src="${ctx}/static/js/purchases/ali1688acctmanage.js"></script>
