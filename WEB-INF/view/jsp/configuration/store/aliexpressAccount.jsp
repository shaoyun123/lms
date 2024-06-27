<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>速卖通</title>
<style>
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }
    #aliexpressaccountCard .fixeddiv2{
        top: 48px;
    }
    #aliexpressaccountCard .importPart{
        display: flex;
        flex: 1;
        align-items: center;
    }
    #smtAcct_setAutoDelete_form .layui-form-label{
        padding: 9px 5px;
        width: 90px;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="aliexpressAcctSearchForm">
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
                                    <select id="aliexpress_account_depart_sel" placeholder="部门" lay-search
                                        lay-filter="aliexpress_account_depart_sel" class="orgs_hp_custom">
                                        <option value="">部门</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block sellect-seller">
                                    <select id="aliexpress_account_salesman_sel" lay-search
                                        lay-filter="aliexpress_account_salesman_sel" class="users_hp_custom"
                                        data-rolelist="smt专员">
                                        <option value="">销售员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
<%--                                    <div class="layui-col-md8 layui-col-lg8">--%>
                                        <label class="layui-form-label">客服</label>
                                        <div class="layui-input-block">
                                            <select name="customServicerId" lay-search>
                                                <option value="">客服</option>
                                            </select>
                                        </div>
<%--                                    </div>--%>
<%--                                    <div class="layui-col-md4 layui-col-lg4">--%>
<%--                                        <select name="" id="smtSyncListingStatus"--%>
<%--                                            lay-filter="smtSyncListingStatusFilter" lay-search>--%>
<%--                                            <option value="">同步listing状态</option>--%>
<%--                                            <option value="0">未同步</option>--%>
<%--                                            <option value="2">同步中</option>--%>
<%--                                            <option value="3">同步成功</option>--%>
<%--                                            <option value="4">同步失败</option>--%>
<%--                                        </select>--%>
<%--                                    </div>--%>
                                </div>
                            </div>
<%--                            <div class="layui-col-md2 layui-col-lg2">--%>
<%--                                <div class="layui-input-block">--%>
<%--                                   <input type="text" name="syncDesc" placeholder="同步异常备注" class="layui-input">--%>
<%--                                </div>--%>
<%--                            </div>--%>
<%--                            <div class="layui-col-md2 layui-col-lg2">--%>
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
                                <label class="layui-form-label">同步listing状态</label>
                                <div class="layui-input-block">
                                    <select name="" id="smtSyncListingStatus" lay-search>
                                        <option value="">同步listing状态</option>
                                        <option value="0">未同步</option>
                                        <option value="2">同步中</option>
                                        <option value="3">同步成功</option>
                                        <option value="4">同步失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">自动下架设置</label>
                                <div class="layui-input-block">
                                    <select name="autoDelete" lay-search>
                                        <option value="">请选择</option>
                                        <option value="true">已开启</option>
                                        <option value="false">已关闭</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺标签</label>
                                <div class="layui-input-block">
                                    <select name="storeTagList"
                                        xm-select="aliexpressaccount_search_storeTagList"
                                        lay-filter="aliexpressaccount_search_storeTagList"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                    ></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">同步异常备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="syncDesc" placeholder="同步异常备注" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType" lay-search>
                                    <option value="0">创建时间</option>
                                    <option value="1">access到期时间</option>
                                    <option value="2">refresh到期时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input id="listing_time" type="text" name="listing_time" lay-verify="required"
                                    autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="text-align:right;">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload"
                                    id="aliexpressSearch">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="aliexpressaccountCard">
                <div class="layui-card-body">
                    <div class="dis_flex">
                        <div class="layui-tab" lay-filter="aliexpress_acct_tab_filter">
                            <ul class="layui-tab-title">
                                <li class="layui-this" lay-id="1">数量(<span id="aliexpressAccount_colLen"></span>)</li>
                                <!-- <li lay-id="2">7天内到期域名(<span id="aliexpress_acct_domain_overdue_number"></span>)</li> -->
                            </ul>
                        </div>
                        <div class="layui-form importPart ml10">
                            <div class="w100">
                                <select name="downloadType" lay-filter="aliexpressAcct_downloadType" lay-search>
                                    <option value="">下载模板</option>
                                    <permTag:perm funcCode="edit_store_excel_aliexpressAcct">
                                        <option value="editStore">修改店铺</option>
                                    </permTag:perm>
                                </select>
                            </div>
                            <div class="w100">
                                <select name="downloadType" lay-filter="aliexpressAcct_importExcelType" lay-search>
                                    <option value="">导入excel</option>
                                    <permTag:perm funcCode="edit_store_excel_aliexpressAcct">
                                        <option value="editStore">导入修改店铺excel</option>
                                    </permTag:perm>
                                </select>
                            </div>
                            <input type="file" id="aliexpressAccount_import_file" hidden>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button class="layui-btn layui-btn-sm"
                                id="smt_syncWishListing">同步listing</button>
                            </div>
                            <div class="layui-input-inline">
                                <button class="layui-btn layui-btn-sm" id="smtAcct_export">导出</button>
                            </div>
                            <div class="layui-input-inline w150 layui-form">
                                <select name="hello" lay-filter="aliexpressAcctBatchOper" lay-search>
                                    <option value="" disabled selected>批量操作</option>
                                    <option value="3">修改信息</option>
                                    <!-- <option value="9">修改图片域名</option> -->
<%--                                    <permTag:perm funcCode="order_download_aliexpressStore">--%>
<%--                                        <option value="4">开启订单下载</option>--%>
<%--                                        <option value="5">关闭订单下载</option>--%>
<%--                                    </permTag:perm>--%>
                                    <permTag:perm funcCode="aliexpressBatchEnableAcctStatus">
                                        <option value="6">批量启用店铺</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="aliexpressBatchUnableAcctStatus">
                                        <option value="7">批量停用店铺</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="aliexpressBatchSetStoreTags">
                                        <option value="8">批量修改店铺标签</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="aliexpressBatchSetAutoDelete">
                                        <option value="10">批量修改自动下架</option>
                                    </permTag:perm>
                                </select>
                            </div>
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="editAliexpressAcctBtn">
                                    <button class="layui-btn layui-btn-normal layui-btn-sm"
                                                id="addAliexpressInfo">
                                                添加aliexpress账号
                                    </button>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>

                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="aliexpressTable" lay-filter="aliexpressTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="editAliexpressDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editAliexpressDomainForm">
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
<!--订单下载状态的开启和关闭-->
<%--<script type="text/html" id="orderDownloadStatusTemplet">--%>
<%--    <div class="layui-form-item">--%>
<%--        <permTag:perm funcCode="order_download_aliexpressStore">--%>
<%--            {{# if(d.orderDownloadStatus){ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" checked>--%>
<%--            {{# }else{ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus">--%>
<%--            {{# } }}--%>
<%--            <div style="display: none">{{d.id}}</div>--%>
<%--        </permTag:perm>--%>
<%--        <permTag:lacksPerm funcCode="order_download_aliexpressStore">--%>
<%--            {{# if(d.orderDownloadStatus){ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" checked disabled>--%>
<%--            {{# }else{ }}--%>
<%--            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" disabled>--%>
<%--            {{# } }}--%>
<%--        </permTag:lacksPerm>--%>
<%--    </div>--%>
<%--</script>--%>
<!-- 自动下架设置 -->
<script type="text/html" id="aliexpressAcct_autoDelete">
    <div>{{d.autoDelete?'已开启':"未开启"}}</div>
    <permTag:perm funcCode="aliexpressBatchSetAutoDelete">
        <a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="setAutoDelete">设置</a>
    </permTag:perm>
</script>
<%--<script type="text/html" id="aliexpressAccessTokenTpl">
    {{# if(d.accessToken != null){ }}
    {{ Format(d.accessTokenExpiryTime,"yyyy-M-d h:m:s")}}
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="refreshToken" style="position:absolute;top:0;right:5px" >刷新Token</a>
    {{# } }}
</script>--%>

<script type="text/html" id="aliexpressAcctStatusTpl">
    {{# if(d.status == false){ }}
    <font color="red">已停用</font>
    {{# } else { }}
    已启用
    {{# } }}
</script>
<!--处理smt店铺同步时间-->
<!-- <script type="text/html" id="smtLastSyncTime">
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script> -->
<!--处理smt店铺同步时间-->
<script type="text/html" id="smtSyncDesc">
    {{ d.syncDesc || ''}}
</script>
<!--处理smt店铺同步状态-->
<script type="text/html" id="smtSyncStatus">
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
    <br>
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<!-- 工具条模板,写在script里面 -->
<script type="text/html" id="aliexpressTableBar">
    <permTag:perm funcCode="editAliexpressAcctBtn">
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    </permTag:perm>
    {{# if(d.accessToken == null){ }}
    <%--<a class="layui-btn layui-btn-xs" lay-event="generateAccessToken">授权(马帮)</a>--%>
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="genAccessToken">授权</a>
    {{# }else { }}
    <a class="layui-btn layui-btn-xs " lay-event="genAccessToken" title="重新授权">重授</a>
    {{# } }}
    <!-- <permTag:perm funcCode="aliexpressSetStoreTags">
      <a class="layui-btn layui-btn-xs" lay-event="setStoreTags">店铺标签</a>
    </permTag:perm> -->
    <a class="layui-btn layui-btn-xs " lay-event="syncCspStore" title="同步CSP店铺">同步CSP店铺</a>
    <permTag:perm funcCode="aliexpressCheckAccessToken">
    <a class="layui-btn layui-btn-xs" lay-event="checkAccessToken">查看授权</a>
  </permTag:perm>
</script>
<!-- aliexpress添加基本信息模态框内容 -->
<script type="text/html" id="addAliexpressInfoLayer">
    <div style="padding:20px">
        <form action="" class="layui-form layui-form-pane" id="aliexpressSalesPlatAccountAddForm">
            <div id="aliexpressAcctReuseDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-xs" lay-submit="" lay-filter="reuseAliexpressAcct">启用店铺</button>
            </div>
            <div id="aliexpressAcctDelDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-danger layui-btn-xs" lay-submit="" lay-filter="delAliexpressAcct">
                    停用店铺
                </button>
            </div>

            <input type="hidden" name="acctBaseId">
            <input type="hidden" name="platCode" value="aliexpress">
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
                        <select name="salespersonLeaderId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">客服</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="customServicerId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">组长</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="leaderId" class="layui-select" lay-search>
                        </select>
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
                    <label class="layui-form-label">币种</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="currency" lay-search>
                            <option value="USD">USD</option>
                            <option value="CNY" selected>CNY</option>
                        </select>
                    </div>
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
                    <button class="layui-btn" lay-submit="" lay-filter="addAliexpressAcct" id="addAliexpressAcct">提交
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- aliexpress 授权modal -->
<script type="text/html" id="aliexpressTokenModalLayer">
    <div class="p20">
        <form id="aliexpressTokenAddForm" action="" class="layui-form layui-form-pane">
            <input type="hidden" name="salesAcctId">
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤一：点击下方链接购买速易ERP，按提示获取token
                    <a href="http://wiki.mabangerp.com/index.php?mod=helpcenter.detail&type=1&model=1&id=967"
                        target="_blank" style="color:blueviolet">授权说明</a></label>
                <div class="layui-input-block">
                    <input class="layui-input"
                        onclick="window.open('https://api-sg.aliexpress.com/oauth/authorize?response_type=code&force_auth=true&client_id=25533666')"
                        style="cursor: pointer;color:blueviolet"
                        value="速卖通服务市场:https://api-sg.aliexpress.com/oauth/authorize?response_type=code&force_auth=true&client_id=25533666">
                    <input class="layui-input" onclick="window.open('https://c.tb.cn/Y4.4d3FK')"
                        style="cursor: pointer;color:blueviolet"
                        value="1元活动:https://c.tb.cn/Y4.4d3FK(详见授权说明)">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤二：填入获取的code，点击保存，即可获取token</label>
                <div class="layui-input-block">
                    <textarea type="text" name="code" placeholder="请输入Code" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/configuration/store/aliexpressAccount.js"></script>

<!--批量修改销售员-->
<script type="text/html" id="editAliexpressSalesPersonLayer">
    <div class="p20">
        <form action="" class="layui-form" id="editAliexpressSalesPersonForm">
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
                <label class="layui-form-label">客服专员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="customServicerId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">组长</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="leaderId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="smtAccount_exportLayer">
    <div style="padding:20px;" id="smtAccount_exportLayer_container">
    </div>
</script>
<script type="text/html" id="smtAccount_exportLayer_containerTpl">
    <fieldset class="layui-elem-field layui-field-title"> <legend>店铺信息</legend> </fieldset>
    <form class="layui-form" id="smtAccount_exportLayer_form" lay-filter="smtAccount_exportLayer_form">
        <input type="checkbox" title="全选" lay-skin="primary" lay-filter="smtAcctCheckAll">
        <div class="smtAcctCheckChildDiv">
        {{#  layui.each(d.field, function(index, item){ }}
            <div style="display:inline-block;width:140px;"><input type="checkbox" title="{{item}}" value="{{item}}" name="field" lay-skin="primary" lay-filter="smtAcctCheckChild"></div>
        {{#  }) }}
        </div>
        <fieldset class="layui-elem-field layui-field-title"> <legend><span style="color:red;">*</span>数据范围</legend> </fieldset>
        <input type="radio" name="type" value="1" title="导出列表选中数据" checked>
        <input type="radio" name="type" value="2" title="导出查询条件中的数据">
    </form>
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

<!-- 店铺标签批量设置 -->
<script type="text/html" id="aliexpress_acct_set_bacth_storetag_tpl">
    <div class="layui-card aliexpress_acct_set_bacth_storetag">
        <div class="layui-card-body layui-form">
            <div class="layui-form-item">
                <label class="layui-form-label">新增标签</label>
                <div class="layui-input-block disflex">
                   <select name="addStoreTagList"
                        xm-select="aliexpressAccount_storetag_addStoreTagList"
                        lay-filter="aliexpressAccount_storetag_addStoreTagList"
                        xm-select-search
                        xm-select-search-type="dl"
                        xm-select-skin="normal"
                    ></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">移除标签</label>
                <div class="layui-input-block disflex">
                   <select name="removeStoreTagList"
                        xm-select="aliexpressAccount_storetag_removeStoreTagList"
                        lay-filter="aliexpressAccount_storetag_removeStoreTagList"
                        xm-select-search
                        xm-select-search-type="dl"
                        xm-select-skin="normal"
                    ></select>
                </div>
            </div>
        </div>
    </div>
</script>

<!-- 自动下架设置 -->
<script type="text/html" id="smtAcct_setAutoDelete_layer">
    <div class="layui-card">
        <div class="layui-card-body">
            <form action="" class="layui-form" id="smtAcct_setAutoDelete_form">
                <div class="layui-form-item">
                    <label class="layui-form-label"><font class="fRed">*</font>自动下架</label>
                    <div class="layui-input-block">
                        <input type="radio" name="autoDelete" value="0" title="关闭">
                        <input type="radio" name="autoDelete" value="1" title="开启">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><font class="fRed">*</font>每日下架数量</label>
                    <div class="layui-input-block disflex">
                       <input type="text" class="layui-input" style="width:210px" min="0" name="autoDeleteNum" onblur="smtAcctCheckNum(this,{max:300,min:0,percision:0})">
                       <span class="ml20" >(最大限制为300)</span>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label">刊登时间≥</label>
                    <div class="layui-input-block disflex">
                        <input type="text" class="layui-input" style="width:210px" min="0" name="autoDeleteGreatListingTime" onblur="smtAcctCheckNum(this,{min:1,percision:0})">
                        <span class="ml20">天</span>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">listing店铺销量</label>
                    <div class="layui-input-block disflex">
                       <select name="autoDeleteSalesType" lay-search>
                            <option value="">请选择</option>
                            <option value="30天销量=0">30天销量=0</option>
                            <option value="60天销量=0">60天销量=0</option>
                            <option value="90天销量=0">90天销量=0</option>
                            <option value="180天销量=0">180天销量=0</option>
                       </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">是否半托管商品</label>
                    <div class="layui-input-block disflex">
                        <select name="halfManage" lay-search>
                            <option value="">请选择</option>
                            <option value=true>是</option>
                            <option value=false>否</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<!-- 导入excel 显示不成功数据-->
<script type="text/html" id="aliexpress_acct_export_result_tpl">
    <table class="layui-table" id="aliexpress_acct_export_result"></table>
</script>
