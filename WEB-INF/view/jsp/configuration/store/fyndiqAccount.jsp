<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>fyndiq店铺</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="fyndiqAcctSearchForm">
                        <div class="layui-inline w100">
                            <div class="layui-input-inline">
                                <select name="status" lay-search>
                                    <option value="">全部</option>
                                    <option value="true" selected>启用中</option>
                                    <option value="false">已停用</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline" style="width:180px">
                            <div class="layui-input-inline">
                                <input type="text" name="storeAcct" placeholder="店铺名称,逗号分割查询多个" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">部门</label>
                            <div class="layui-input-inline" style="width:180px">
                                <select id="fyndiq_account_depart_sel" placeholder="部门" lay-search
                                        lay-filter="fyndiq_account_depart_sel" class="orgs_hp_custom">
                                    <option value="">部门</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">销售员</label>
                            <div class="layui-input-inline sellect-seller w100">
                                <select id="fyndiq_account_salesman_sel" lay-search
                                        lay-filter="fyndiq_account_salesman_sel" class="users_hp_custom"
                                        data-rolelist="fyndiq专员">
                                    <option value="">销售员</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline w100">
                                <input type="text" name="syncDesc" placeholder="同步异常备注" class="layui-input">
                            </div>
                        </div>
                        <%-- <div class="layui-inline" style="width:180px">
                             <select name="" id="fyndiqSyncListingStatus" lay-filter="fyndiqSyncListingStatusFilter" lay-search>
                                 <option value="" >同步listing状态</option>
                                 <option value="0">未同步</option>
                                 <option value="2">同步中</option>
                                 <option value="3">同步成功</option>
                                 <option value="4">同步失败</option>
                             </select>
                         </div>--%>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload"
                                        id="fyndiqSearch">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                    <div style="position:absolute;top:10px;right:20px">
                        <div class="layui-inline">
                            <%-- <div class="layui-input-inline">
                                 <button class="layui-btn layui-btn-sm" id="fyndiq_syncFyndiqListing">同步listing</button>
                             </div>--%>
                            <div class="layui-input-inline w150 layui-form">
                                <select name="hello" lay-filter="fyndiqAcctBatchOper" lay-search>
                                    <option value="" disabled selected>批量操作</option>
                                    <option value="3">修改信息</option>
<%--                                    <permTag:perm funcCode="order_download_fyndiqStore">--%>
<%--                                        <option value="4">开启订单下载</option>--%>
<%--                                        <option value="5">关闭订单下载</option>--%>
<%--                                    </permTag:perm>--%>
                                    <permTag:perm funcCode="fyndiqBatchEnableAcctStatus">
                                        <option value="6">批量启用店铺</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="fyndiqBatchUnableAcctStatus">
                                        <option value="7">批量停用店铺</option>
                                    </permTag:perm>
                                    <option value="8">修改图片域名</option>
                                </select>
                            </div>
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="editFyndiqAcctBtn">
                                    <button class="layui-btn layui-btn-normal layui-btn-sm" id="addFyndiqInfo">添加店铺
                                    </button>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="fyndiqaccountCard">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="fyndiq_acct_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" lay-id="1">数量(<span id="fyndiqAccount_colLen"></span>)</li>
                            <li lay-id="2">7天内到期域名(<span id="fyndiq_acct_domain_overdue_number"></span>)</li>
                        </ul>
                    </div>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="fyndiqTable" lay-filter="fyndiqTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="layui-row">
</div>

<script type="text/html" id="fyndiqAcctStatusTpl">
    {{# if(d.status == false){ }}
    <font color="red">已停用</font>
    {{# } else { }}
    已启用
    {{# } }}
</script>
<!--订单下载状态的开启和关闭-->
<%--<script type="text/html" id="orderDownloadStatusTemplet">--%>
<%--    <div class="layui-form-item">--%>
<%--        <permTag:perm funcCode="order_download_fyndiqStore">--%>
<%--            {{# if(d.orderDownloadStatus){ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus"--%>
<%--                   checked>--%>
<%--            {{# }else{ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus">--%>
<%--            {{# } }}--%>
<%--            <div style="display: none">{{d.id}}</div>--%>
<%--        </permTag:perm>--%>
<%--        <permTag:lacksPerm funcCode="order_download_fyndiqStore">--%>
<%--            {{# if(d.orderDownloadStatus){ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus"--%>
<%--                   checked disabled>--%>
<%--            {{# }else{ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" disabled>--%>
<%--            {{# } }}--%>
<%--        </permTag:lacksPerm>--%>
<%--    </div>--%>
<%--</script>--%>
<!--处理wish店铺同步时间-->
<script type="text/html" id="fyndiqLastSyncTime">
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<!--处理wish店铺同步状态-->
<script type="text/html" id="fyndiqSyncStatus">
    <span style="">
                {{# if(d.syncStatus == 1){ }}
                    <span class="layui-skyblue">同步中</span>
                {{# }else if (d.syncStatus == 2) { }}
                    <span class="layui-skyblue">同步中</span>
                {{# }else if (d.syncStatus == 3) { }}
                    <span class="layui-green">同步成功</span>
                {{# }else if (d.syncStatus == 4) { }}
                    <span class="layui-gray">同步失败</span>
                {{# }else { }}
                    <span class="layui-orange">未同步</span>
                {{# } }}
            </span>
</script>
<!-- 工具条模板,写在script里面 -->
<script type="text/html" id="fyndiqTableBar">
    {{# if(d.accessToken == null){ }}
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="generateAccessToken">授权</a>
    {{# }else { }}
    <a class="layui-btn layui-btn-xs " lay-event="generateAccessToken" title="重新授权">重授</a>
    {{# } }}
    <permTag:perm funcCode="editFyndiqAcctBtn">
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    </permTag:perm>
</script>
<!-- fyndiq添加基本信息模态框内容 -->
<script type="text/html" id="addFyndiqInfoLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="fyndiqSalesPlatAccountAddForm">
            <div id="fyndiqAcctReuseDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-xs" lay-submit="" lay-filter="reuseFyndiqAcct">启用店铺</button>
            </div>
            <div id="fyndiqAcctDelDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-danger layui-btn-xs" lay-submit="" lay-filter="delFyndiqAcct">
                    停用店铺
                </button>
            </div>

            <input type="hidden" name="acctBaseId">
            <input type="hidden" name="platCode" value="fyndiq">
            <input type="hidden" name="acctDetailId">

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">店铺名称</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <input type="text" name="storeAcct" required lay-verify="required" placeholder="请输入店铺名称"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">图片域名</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <input type="text" name="imgDomain" placeholder="请输入图片地址"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">销售员</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="salespersonId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">销售主管</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="sellLeaderId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">登录名</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="devAcct" placeholder="请输入登录名"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">账户id</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="clientId" placeholder="请输入账户id"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">token</label>
                    <div class="layui-input-inline">
                        <input type="text" name="accessToken" placeholder="请输入token"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label" style="width:150px;">税号</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="taxNumber" placeholder="税号"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">欧盟税号</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="eoriNumber" placeholder="请输入欧盟税号"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">Product feed URL</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="productFeedUrl" readonly="readonly"
                           onclick="var self = this;window.open(self.value)"
                           style="cursor: pointer;color:blueviolet">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="acctBaseRemark" placeholder="请输入备注内容" class="layui-textarea"></textarea>
                </div>
            </div>

            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="addFyndiqAcct" id="addFyndiqAcct">提交
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- fyndiq 生成token modal -->
<script type="text/html" id="fyndiqTokenModalLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="fyndiqTokenAddForm">
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤一：进入下方链接：登录fyndiq账号，在Setting/API下，点击[Create an API v2
                    Token]按钮</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="authUrl" value="https://fyndiq.se/merchant/login/"
                           onclick="var self = this;window.open(self.value)"
                           style="cursor: pointer;color:blueviolet">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤二：填入获取的token(Version 2)，点击保存，即可成功授权</label>
                <div class="layui-input-block">
                    <textarea type="text" name="token" placeholder="请输入token" class="layui-input"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/configuration/store/fyndiqAccount.js"></script>

<script type="text/html" id="editFyndiqSalesPersonLayer">
    <div class="p20">
        <form action="" class="layui-form" id="editFyndiqSalesPersonForm">
            <div class="layui-form-item">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="salespersonId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">销售主管</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="sellLeaderId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="batchUpdateAcctCurrencyLayer">
    <div class="p20">
        <form action="" class="layui-form " id="batchUpdateAcctCurrencyForm">
            <div class="layui-inline">
                <label class="layui-form-label">币种</label>
                <div class="layui-input-inline" style="width:300px">
                    <select type="text" name="currency" class="layui-select" lay-search>
                        <option value="">请选择</option>
                        <option value="CNY">CNY</option>
                        <option value="USD">USD</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" type="submit" lay-submit="" lay-filter="updateAcctCurrency"
                            id="updateAcctCurrency">确定
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary" id="updateAcctCurrencyReset">取消
                    </button>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="editFyndiqDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editFyndiqDomainForm">
            <div class="layui-inline-item">
                <label class="layui-form-label">域名</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="domainId" lay-verify="required" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>