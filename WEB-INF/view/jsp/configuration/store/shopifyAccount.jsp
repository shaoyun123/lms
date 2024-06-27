<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>shopify店铺</title>

<style>
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form">
                        <div class="layui-form-item" id="shopifyAcctSearchForm">
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label labelSel">
                                    <select name="status" lay-search>
                                        <option value="">全部</option>
                                        <option value="true" selected>启用中</option>
                                        <option value="false">已停用</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off"
                                        placeholder="店铺名称,逗号分割查询多个" name="storeAcct">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="shopify_account_depart_sel" placeholder="部门" lay-search
                                        lay-filter="shopify_account_depart_sel" class="orgs_hp_custom" name="orgId">
                                        <option value="">部门</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select id="shopify_account_salesman_sel" lay-search
                                        lay-filter="shopify_account_salesman_sel" class="users_hp_custom"
                                        data-rolelist="shopify专员" name="salespersonId">
                                        <option value="">销售员</option>
                                    </select>
                                </div>
                            </div>
<%--                            <div class="layui-col-md3 layui-col-3">--%>
<%--                                <label class="layui-form-label">下载订单</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <select name="orderDownloadStatus" id="orderDownloadStatus" lay-search>--%>
<%--                                        <option value="">请选择</option>--%>
<%--                                        <option value="true">已开启</option>--%>
<%--                                        <option value="false">已关闭</option>--%>
<%--                                    </select>--%>
<%--                                </div>--%>
<%--                            </div>--%>
                            <div class="layui-col-md2 layui-col-lg2">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" lay-submit
                                    lay-filter="shopify_submit">查询</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="shopifyLayuiCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header">
                        <div class="dis_flex">
                            <div class="layui-tab" lay-filter="shopify-tabs">
                                <ul class="layui-tab-title" style="border-bottom:none;">
                                    <li class="layui-this">数量(<span id="shopify_account_colLen"></span></span>)</li>
                                    <li>7天内到期域名(<span id="shopify_acct_domain_overdue_number"></span>)</li>
                                </ul>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button class="layui-btn layui-btn-sm"
                                    id="shopify_syncShopifyListing">同步listing</button>
                                    <button class="layui-btn layui-btn-sm"
                                            id="shopify_syncLocation">同步默认Location</button>
                                </div>
                                <div class="layui-input-inline w150 layui-form">
                                    <select lay-filter="shopifyAcctBatchOperate" lay-search>
                                        <option value="" disabled selected>批量操作</option>
                                        <option value="editInfo">修改信息</option>
                                        <permTag:perm funcCode="shopifyBatchEnableAcctStatus">
                                            <option value="1">批量启用店铺</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="shopifyBatchUnableAcctStatus">
                                            <option value="2">批量停用店铺</option>
                                        </permTag:perm>
                                        <option value="3">修改图片域名</option>
                                    </select>
                                </div>
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="editShopifyAcctBtn">
                                            <span class="layui-btn layui-btn-sm layui-btn-normal"
                                                style="margin-left:15px;" id="shopify_addStore">新增店铺</span>
                                </permTag:perm>
                            </div>
                            </div>    
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="shopify_table" lay-filter="shopify_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格工具条 --%>
<script type="text/html" id="shopify_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="edit">编辑</span>
    </div>
</script>

<script type="text/html" id="editShopifyDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editShopifyDomainForm">
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

<%-- 修改信息弹框 --%>
<script type="text/html" id="shopify_editInfoLayer">
    <div class="p20">
        <form class="layui-form">
            <div class="layui-form-item">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="salespersonIdLayer" lay-verify="required" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">销售主管</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="sellLeaderIdLayer" lay-verify="required" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>

<%-- 新增店铺弹框 --%>
<script type="text/html" id="shopify_storeLayer">
    <div style="padding:20px;" id="shopify_storeContainer"></div>
</script>
<%-- 店铺模板 --%>
<script type="text/html" id="shopify_storeContainerTpl">
    <form action="" class="layui-form layui-form-pane">
        {{# if(d.id){ }}
        <div style="margin-bottom:10px;text-align:right;">
            {{# if(!d.status){ }}
            <span class="layui-btn layui-btn-xs layui-btn-normal" id="shopify_openStore">启用店铺</span>
            {{# }else{ }}
            <span class="layui-btn layui-btn-xs layui-btn-danger" id="shopify_stopStore">停用店铺</span>
            {{# } }}
        </div>
        {{# } }}
        <%-- 不知道这三个干嘛的 --%>
        <input type="hidden" name="acctBaseId" value="{{d.acctBaseId}}">
        <input type="hidden" name="acctDetailId" value="{{d.acctDetailId}}">


        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label" style="width:150px">店铺名称</label>
                <div class="layui-input-inline" style="width:300px;">
                    <input type="text" name="storeAcct" required lay-verify="required" placeholder="请输入店铺名称"
                        class="layui-input" value="{{d.storeAcct || ''}}">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">图片域名</label>
                <div class="layui-input-inline" style="width:300px;">
                    <input type="text" name="imgDomain" placeholder="请输入图片地址" class="layui-input"
                        value="{{d.imgDomain || ''}}">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label" style="width:150px">API秘钥</label>
                <div class="layui-input-inline" style="width:300px;">
                    <input type="text" name="accessKey" placeholder="请输入API秘钥" class="layui-input"
                        value="{{d.accessKey || ''}}">
                </div>
            </div>

            <div class="layui-inline">
                <label class="layui-form-label">API密码</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="secretKey" placeholder="请输入API密码" class="layui-input"
                        value="{{d.secretKey || ''}}">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label" style="width:150px;">销售员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="salespersonIdLayer" class="layui-select" lay-search>
                        <option value="">请选择</option>
                        {{# if(d.shopifyAcct.length){ }}
                        {{#  layui.each(d.shopifyAcct, function(index, item){ }}
                        {{# if(d.salespersonId == item.id){ }}
                        <option value="{{item.id}}" selected>{{item.userName}}</option>
                        {{# }else{ }}
                        <option value="{{item.id}}">{{item.userName}}</option>
                        {{# } }}
                        {{# }) }}
                        {{# } }}
                    </select>
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">销售主管</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="sellLeaderIdLayer" class="layui-select" lay-search>
                        <option value="">请选择</option>
                        {{# if(d.shopifyManger.length){ }}
                        {{#  layui.each(d.shopifyManger, function(index, item){ }}
                        {{# if(d.sellLeaderId == item.id){ }}
                        <option value="{{item.id}}" selected>{{item.userName}}</option>
                        {{# }else{ }}
                        <option value="{{item.id}}">{{item.userName}}</option>
                        {{# } }}
                        {{# }) }}
                        {{# } }}
                    </select>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label" style="width:150px;">税号</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="taxNumber" placeholder="税号"
                           class="layui-input" value="{{d.taxNumber || ''}}">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">欧盟税号</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="eoriNumber" placeholder="请输入欧盟税号"
                           class="layui-input" value="{{d.eoriNumber || ''}}">
                </div>
            </div>
        </div>

        <!-- <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label" style="width:150px;">普源别名</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="allrootAliasName" placeholder="请输入源别名" class="layui-input"
                        value="{{d.allrootAliasName || ''}}">
                </div>
            </div>
        </div> -->

        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <textarea name="acctBaseRemark" placeholder="请输入备注内容" class="layui-textarea"
                    value="{{d.acctBaseRemark || ''}}"></textarea>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="shopifyAcctStatusTpl">
    {{# if(d.status == false){ }}
    <font color="red">已停用</font>
    {{# } else { }}
    已启用
    {{# } }}
</script>
<!--处理shopify店铺同步状态-->
<script type="text/html" id="shopifySyncStatus">
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
<!--处理shopify店铺同步时间-->
<script type="text/html" id="shopifyLastSyncTime">
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script>

<!--订单下载状态的开启和关闭-->
<%--<script type="text/html" id="orderDownloadStatusTemplet">--%>
<%--    <div class="layui-form-item" id="orderDownloadStatusCheckbox">--%>
<%--        <permTag:perm funcCode="order_download_shopifyStore">--%>
<%--            {{# if(d.orderDownloadStatus){ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" checked>--%>
<%--            {{# }else{ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus">--%>
<%--            {{# } }}--%>
<%--            <div style="display: none">{{d.id}}</div>--%>
<%--        </permTag:perm>--%>
<%--        <permTag:lacksPerm funcCode="order_download_shopifyStore">--%>
<%--            {{# if(d.orderDownloadStatus){ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" checked disabled>--%>
<%--            {{# }else{ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" disabled>--%>
<%--            {{# } }}--%>
<%--        </permTag:lacksPerm>--%>
<%--    </div>--%>
<%--</script>--%>

<script src="${ctx}/static/js/configuration/store/shopifyAccount.js"></script>


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