<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>wish店铺</title>
<style>
    #LAY-wishAccount tbody td[data-field="accessTokenStatus"] .layui-table-cell {
        text-align: left;
    }

    .fixRightIcon {
        position: absolute;
        right: 3px;
        top: 2px
    }
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }
</style>
<div class="layui-fluid" id="LAY-wishAccount">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="wishAcctSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="status" lay-search>
                                        <option value="">全部</option>
                                        <option value="true" selected>启用中</option>
                                        <option value="false">已停用</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="storeAcct" placeholder="店铺名称,逗号分割查询多个" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="wishAcct-search-org-id" lay-search="">
                                        <option value="">部门</option>
                                        <c:forEach items="${wishOrgs}" var="wishOrg">
                                            <option value="${wishOrg.id}">${wishOrg.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                    <div class="layui-col-md8 layui-col-lg8">
                                        <label class="layui-form-label">销售员</label>
                                        <div class="layui-input-block sellect-seller">
                                            <select name="salespersonId" lay-filter="aihao" lay-search="">
                                                <option value="">销售人</option>
                                                <c:forEach items="${wishUsers}" var="wishUser">
                                                    <option value="${wishUser.id}">${wishUser.userName}</option>
                                                </c:forEach>
                                            </select>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <select name="" id="wishSyncListingStatus"
                                            lay-filter="wishSyncListingStatusFilter" lay-search>
                                            <option value="">同步listing状态</option>
                                            <option value="0">未同步</option>
                                            <option value="2">同步中</option>
                                            <option value="3">同步成功</option>
                                            <option value="4">同步失败</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                   <input type="text" name="syncDesc" placeholder="同步异常备注" class="layui-input">
                                </div>
                            </div>
                            <!-- <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">下载订单</label>
                                <div class="layui-input-block">
                                    <select id="orderDownloadStatus" name="orderDownloadStatus" lay-search>
                                        <option value="">请选择</option>
                                        <option value="true">已开启</option>
                                        <option value="false">已关闭</option>
                                    </select>
                                </div>
                            </div> -->
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺等级</label>
                                <div class="layui-input-block">
                                    <select name="storeLevel">
                                        <option value="">请选择</option>
                                        <option value="Platinum 铂">Platinum 铂</option>
                                        <option value="Gold 黄金">Gold 黄金</option>
                                        <option value="Silver 银">Silver 银</option>
                                        <option value="Bronze 青铜">Bronze 青铜</option>
                                        <option value="At Risk 有风险">At Risk 有风险</option>
                                        <option value="Unrated未评级">Unrated未评级</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">剩余额度</label>
                                <div class="layui-input-block disflex">
                                    <input type="text" class="layui-input" name="listingQuotaRemainMin" onblur="commonBlurInteger(event)">
                                    <input type="text" class="layui-input ml10" name="listingQuotaRemainMax" onblur="commonBlurInteger(event)">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">Listing已使用</label>
                                <div class="layui-input-block disflex">
                                    <input type="text" class="layui-input" name="listingQuotaUsedMin" onblur="commonBlurInteger(event)">
                                    <input type="text" class="layui-input ml10" name="listingQuotaUsedMax" onblur="commonBlurInteger(event)">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload"
                                    id="wishSearch">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <%-- 表格渲染 --%>
            <div class="layui-card" id="wishaccountCard">
                <div class="layui-card-body">
                    <div class="dis_flex">
                        <div class="layui-tab" lay-filter="wish_acct_tab_filter">
                            <ul class="layui-tab-title">
                                <li class="layui-this" lay-id="1">数量(<span id="wishAccount_colLen"></span>)</li>
                                <li lay-id="2">7天内到期域名(<span id="wish_acct_domain_overdue_number"></span>)</li>
                            </ul>
                        </div> 
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button class="layui-btn layui-btn-sm"
                                                    id="wish_syncWishListing">同步listing</button>
                                <button class="layui-btn layui-btn-normal layui-btn-danger layui-btn-sm disN"
                                                    id="wa_syncWishOaTokenBtn">同步Token</button>
                            </div>
                            <div class="layui-input-inline w150 layui-form">
                                <select name="hello" lay-filter="wishAcctBatchOper" lay-search>
                                    <option value="" disabled selected>批量操作</option>
                                    <option value="3">修改信息</option>
                                    <option value="9">修改图片域名</option>
                                    <!-- <permTag:perm funcCode="order_download_wishStore">
                                        <option value="4">开启订单下载</option>
                                        <option value="5">关闭订单下载</option>
                                    </permTag:perm> -->
                                    <permTag:perm funcCode="wishBatchEnableAcctStatus">
                                        <option value="6">批量启用店铺</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="wishBatchUnableAcctStatus">
                                        <option value="7">批量停用店铺</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="wishBatchEditCurrency">
                                        <option value="8">批量修改币种</option>
                                    </permTag:perm>
                                </select>
                            </div>
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="editWishAcctBtn">
                                    <button class="layui-btn layui-btn-normal layui-btn-sm" id="wishAcct_addWishInfo">添加店铺</button>
                                </permTag:perm>
                            </div>
                           </div>
                    </div>             
                    <table class="layui-table" id="wishTable" lay-filter="wishTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="editWishDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editWishDomainForm">
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
<script type="text/html" id="wishProxyTpl">
    <span {{# if(d.accessTokenStatus== false){ }}style="color:red;" {{# } }}>{{ d.proxyServerIp }}</span>
    {{# if(d.proxyStatus == true){ }}
    <span class="layui-badge  layui-bg-blue">√</span>
    {{# } else if (d.proxyStatus == false) { }}
    <span class="layui-badge">x</span>
    {{# } else { }}
    <span class="layui-badge layui-bg-orange">?</span>
    {{# } }}
    <span style="float: right;">
        <a class="layui-btn layui-btn-xs" lay-event="tryConnect">检测</a>
        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="restart">重启</a>
    </span>
</script>

<script type="text/html" id="wishAccessTokenTpl">
    {{# if(d.accessToken){ }}
    {{ Format(d.accessTokenExpiryTime,"yyyy-M-d h:m:s")}}
    <a class="layui-btn layui-btn-danger layui-btn-xs ml20 fixRightIcon" lay-event="refreshToken" title="刷新token"><i
            class="layui-icon layui-icon-refresh-3"></i></a>
    {{# }else{ }}

    {{# } }}
</script>

<script type="text/html" id="wishAcctStatusTpl">
    {{# if(d.status == false){ }}
    <font color="#ff0000">已停用</font>
    {{# } else { }}
    已启用
    {{# } }}
</script>

<!--订单下载状态的开启和关闭-->
<!-- <script type="text/html" id="orderDownloadStatusTemplet">
    <div class="layui-form-item">
        <permTag:perm funcCode="order_download_wishStore">
            {{# if(d.orderDownloadStatus){ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" checked>
            {{# }else{ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus">
            {{# } }}
            <div style="display: none">{{d.id}}</div>
        </permTag:perm>
        <permTag:lacksPerm funcCode="order_download_wishStore">
            {{# if(d.orderDownloadStatus){ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" checked disabled>
            {{# }else{ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" disabled>
            {{# } }}
        </permTag:lacksPerm>
    </div>
</script> -->
<!--处理wish店铺同步时间-->
<script type="text/html" id="wishLastSyncTime">
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<!--处理wish店铺同步状态-->
<script type="text/html" id="wishSyncStatus">
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
<script type="text/html" id="wishTableBar">
    <%--            {{# if(d.accessToken == null){ }}--%>
    <%--            {{# } }}--%>
    <a class="layui-btn layui-btn-xs" lay-event="generateAccessToken">授权</a><br>
    <permTag:perm funcCode="editWishAcctBtn">
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    </permTag:perm>
    <permTag:perm funcCode="wishCheckAccessToken">
    <a class="layui-btn layui-btn-xs" lay-event="checkAccessToken">查看授权</a>
  </permTag:perm>
</script>
<!-- wish添加基本信息模态框内容 -->
<script type="text/html" id="addWishInfoLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="wishSalesPlatAccountAddForm">
            <div id="wishAcctReuseDiv" class="layui-hide taRight">
                <button class="layui-btn layui-btn-xs" lay-submit="" lay-filter="reuseWishAcct">启用店铺</button>
            </div>
            <div id="wishAcctDelDiv" class="layui-hide taRight">
                <button class="layui-btn layui-btn-danger layui-btn-xs" lay-submit="" lay-filter="delWishAcct">
                    停用店铺
                </button>
            </div>

            <input type="hidden" name="platCode" value="wish">
            <input type="hidden" name="acctBaseId">
            <input type="hidden" name="acctDetailId">

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">店铺名称</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="storeAcct" required lay-verify="required" placeholder="请输入店铺名称"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">图片域名</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="imgDomain" placeholder="请输入图片地址" class="layui-input">
                    </div>
                </div>
                <!-- <div class="layui-inline">
                    <label class="layui-form-label">普源别名</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="allrootAliasName" placeholder="请输入源别名" class="layui-input">
                    </div>
                </div> -->
                <!--20190822取消wish代理信息配置-->
                <%--<div class="layui-inline">--%>
                <%--<label class="layui-form-label">代理IP</label>--%>
                <%--<div class="layui-input-inline" style="width:300px">--%>
                <%--<input type="text" name="proxyServerIp" required lay-verify="required" placeholder="请输入代理IP"--%>
                <%--class="layui-input">--%>
                <%--</div>--%>
                <%--</div>--%>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">币种</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select type="text" name="currency" class="layui-select" lay-search>
                            <option value="CNY">CNY</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">销售员</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="salespersonId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">销售主管</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="sellLeader" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">ClientId</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="clientId" placeholder="请输入ClientId" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">ClientSecret</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="clientSecret" placeholder="请输入ClientSecret" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">税号</label>
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
                <div class="layui-inline">
                    <label class="layui-form-label">店铺等级</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="storeLevel" lay-filter="wishSalesPlatAccountAddForm-storeLevel">
                            <option value="">请选择</option>
                            <option value="Platinum 铂">Platinum 铂</option>
                            <option value="Gold 黄金">Gold 黄金</option>
                            <option value="Silver 银">Silver 银</option>
                            <option value="Bronze 青铜">Bronze 青铜</option>
                            <option value="At Risk 有风险">At Risk 有风险</option>
                            <option value="Unrated未评级">Unrated未评级</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">刊登额度</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="listingLimit" placeholder="请输入刊登额度" onblur="commonBlurPositiveInteger(event)"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea type="text" name="acctBaseRemark" placeholder="请输入备注内容" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" type="submit" lay-submit="" lay-filter="addWishAcct" id="addWishAcct">提交
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary" id="wishAccount_reset">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>


<!-- wish 生成token modal -->
<script type="text/html" id="wishTokenModalLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="wishTokenAddForm">
            <input type="hidden" name="platCode" value="wish">
            <input type="hidden" name="salesAcctId">
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:130px;">Client Id</label>
                <div class="layui-input-inline" style="width:400px;">
                    <input type="text" name="clientId" required lay-verify="required" class="layui-input" readonly>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:130px;">Client Secrect</label>
                <div class="layui-input-inline" style="width:400px;">
                    <input type="text" name="clientSecret" required lay-verify="required" class="layui-input" readonly>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:130px;">Code</label>
                <div class="layui-input-inline" style="width:400px;">
                    <input type="text" name="code" required lay-verify="required" placeholder="请输入Code"
                        class="layui-input">
                </div>
            </div>
<%--            <div class="layui-form-item">--%>
<%--                <input type="checkbox" name="type" value="true" title="公共开发者账号授权" lay-skin="primary">--%>
<%--            </div>--%>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="addWishAcctToken" id="addWishAcctToken">提交
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
        <label><a id="wishAuthLinkUrl" target="_blank" style="color: #428bca" href="">授权链接</a>
        </label>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/configuration/store/wishAccount.js"></script>

<script type="text/html" id="editWishSalesPersonLayer">
    <div class="p20">
        <form action="" class="layui-form " id="editWishSalesPersonForm">
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
                    <select name="salespersonLeaderId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">店铺等级</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="storeLevel" lay-filter="editWishSalesPersonForm-storeLevel">
                        <option value="">请选择</option>
                        <option value="Platinum 铂">Platinum 铂</option>
                        <option value="Gold 黄金">Gold 黄金</option>
                        <option value="Silver 银">Silver 银</option>
                        <option value="Bronze 青铜">Bronze 青铜</option>
                        <option value="At Risk 有风险">At Risk 有风险</option>
                        <option value="Unrated未评级">Unrated未评级</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">刊登额度</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="listingLimit" placeholder="请输入刊登额度" onblur="commonBlurPositiveInteger(event)"
                           class="layui-input">
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
                    <button type="reset" class="layui-btn layui-btn-primary" id="updateAcctCurrencyReset">取消</button>
                </div>
            </div>
        </form>
    </div>
</script>