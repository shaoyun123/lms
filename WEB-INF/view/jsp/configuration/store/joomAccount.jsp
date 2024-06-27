<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>joom店铺</title>
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
                    <form action="" class="layui-form" id="joomAcctSearchForm">
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
                                    <select id="joom_account_depart_sel" placeholder="部门" lay-search
                                        lay-filter="joom_account_depart_sel" class="orgs_hp_custom">
                                        <option value="">部门</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                    <div class="layui-col-md8 layui-col-lg8">
                                        <label class="layui-form-label">销售员</label>
                                        <div class="layui-input-block sellect-seller">
                                            <select id="joom_account_salesman_sel" lay-search
                                                lay-filter="joom_account_salesman_sel" class="users_hp_custom"
                                                data-rolelist="joom专员">
                                                <option value="">销售员</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <select name="" id="joomSyncListingStatus"
                                            lay-filter="joomSyncListingStatusFilter" lay-search>
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
                                    <select name="orderDownloadStatus" id="orderDownloadStatus" lay-search>
                                        <option value="">请选择</option>
                                        <option value="true">已开启</option>
                                        <option value="false">已关闭</option>
                                    </select>
                                </div>
                            </div> -->
                            <div class="layui-col-md2 layui-col-lg2">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload"
                                    id="joomSearch">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="joomaccountCard">
                <div class="layui-card-body">
                    <div class="dis_flex">
                        <div class="layui-tab" lay-filter="joom_acct_tab_filter">
                            <ul class="layui-tab-title">
                                <li class="layui-this" lay-id="1">数量(<span id="joomAccount_colLen"></span>)</li>
                                <li lay-id="2">7天内到期域名(<span id="joom_acct_domain_overdue_number"></span>)</li>
                            </ul>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button class="layui-btn layui-btn-sm"
                                            id="joom_syncJoomListing">同步listing</button>
                                <button class="layui-btn layui-btn-normal layui-btn-danger layui-btn-sm disN"
                                            id="joom_syncjoomOaTokenBtn">同步Token</button>
                            </div>
                            <div class="layui-input-inline w150 layui-form">
                                <select name="hello" lay-filter="joomAcctBatchOper" lay-search>
                                    <option value="" disabled selected>批量操作</option>
                                    <option value="3">修改信息</option>
                                    <!-- <permTag:perm funcCode="order_download_joomStore">
                                        <option value="4">开启订单下载</option>
                                        <option value="5">关闭订单下载</option>
                                    </permTag:perm> -->
                                    <option value="6">修改图片域名</option>
                                    <permTag:perm funcCode="joomBatchEnableAcctStatus">
                                        <option value="7">批量启用店铺</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="joomBatchUnableAcctStatus">
                                        <option value="8">批量停用店铺</option>
                                    </permTag:perm>
                                    <option value="9">批量自动删除</option>
                                    <permTag:perm funcCode="joomBatchEditQuota">
                                    <option value="10">批量修改店铺额度</option>
                                    </permTag:perm>
                                </select>
                            </div>
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="editJoomAcctBtn">
                                    <button class="layui-btn layui-btn-normal layui-btn-sm"
                                        id="addJoomInfo">添加账号
                                    </button>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="joomTable" lay-filter="joomTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="layui-row">

</div>
<%-- 表格--自动删除信息展示 --%>
<script type="text/html" id="joomAccount_autoDeleteInfo">
{{# if(d.autoDelete){ }}
    <span>已开启,每天删除{{d.autoDeleteNum || 0}}</span>
{{# }else{ }}
    <span>未开启</span>
{{# } }}
</script>
<%-- 表格--自动删除 --%>
<script type="text/html" id="joomAccount_autoDelete">
    {{# if(d.autoDelete){ }}
    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="hasSet">已设置</span>
    {{# }else{ }}
    <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="notSet">未设置</span>
    {{# } }}
</script>
<%-- 表格--额度/可用额度 --%>
<script type="text/html" id="joomAccount_quota">
    {{d.listingLimit+'' || ''}}{{# if(d.listingLimit && d.onlineItemCount){ }}/{{# } }}{{d.onlineItemCount+'' || ''}}/{{d.activeItemCount+'' || ''}}
</script>
<script type="text/html" id="joomAccountEditAcctQuotaLayer">
    <form class="layui-form" id="joomAccountEditAcctQuotaForm" style="margin: 20px;">
        <div class="layui-form-item">
            <div class="layui-form-label" style="width: 100px;">店铺额度修改为</div>
            <div class="layui-input-block" style="margin-left: 130px;">
                <input type="number" class="layui-input" min="0" name="newListingLimit" value="">
            </div>
        </div>
    </form>
</script>
<%-- 弹框---自动删除设置 --%>
<script type="text/html" id="joomAccount_autoDeleteLayer">
    <div style="padding:20px;" id="joomAccount_autoDeleteLayer_container">
    </div>
</script>
<script type="text/html" id="joomAccount_autoDeleteLayer_containerTpl">
    <form class="layui-form" id="joomAccount_autoDeleteLayer_container_form">
        <div class="layui-form-item">
            <div class="layui-form-label">自动删除</div>
            <div class="layui-input-block">
                 <input type="radio" name="autoDelete" value="false" title="关闭" {{d.autoDelete==false ? 'checked' : ''}}>
                <input type="radio" name="autoDelete" value="true" title="开启" {{d.autoDelete==true ? 'checked' : ''}}>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-form-label">每天删除</div>
            <div class="layui-input-block" style="display:flex;">
                <input type="number" class="layui-input" value="{{d.autoDeleteNum}}" name="autoDeleteNum" min="1" max="199" onchange="commonSetInputMaxMinVal(this,199,1)">
                <span style="margin-left:10px;">listing.(<200)</span>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-form-label">listing销量≤</div>
            <div class="layui-input-block">
                <input type="number" class="layui-input" max="10"  min="0" placeholder="整数,最大10" name="autoDeleteSalesType" value="{{d.autoDeleteSalesType}}"  onchange="commonSetInputMaxMinVal(this,10,0)">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-form-label">刊登天数≥</div>
            <div class="layui-input-block">
                <input type="number" class="layui-input" min="15" max="365" placeholder="正整数,最小15天" name="historySalesType" value="{{d.historySalesType}}"  onchange="commonSetInputMaxMinVal(this,365,15)">
            </div>
        </div>
    </form>
</script>



<script type="text/html" id="joomProxyTpl">
    <span {{# if(d.accessTokenStatus== false){ }}style="color:red;" {{# } }}>{{ d.proxyServerIp }}</span>
    <a class="layui-btn layui-btn-xs" lay-event="testLink">测试连接</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="restart">重启</a>
</script>

<script type="text/html" id="joomAccessTokenTpl">
    {{# if(d.refreshToken != null){ }}
    {{ Format(d.refreshTokenExpiryTime,"yyyy-M-d h:m:s")}}
    <!--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="refreshToken" style="position:absolute;top:0;right:5px" >刷新Token</a>-->
    {{# } }}
</script>

<script type="text/html" id="joomAcctStatusTpl">
    {{# if(d.status == false){ }}
    <font color="red">已停用</font>
    {{# } else { }}
    已启用
    {{# } }}
</script>
<!--订单下载状态的开启和关闭-->
<!-- <script type="text/html" id="orderDownloadStatusTemplet">
    <div class="layui-form-item">
        <permTag:perm funcCode="order_download_joomStore">
            {{# if(d.orderDownloadStatus){ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" checked>
            {{# }else{ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus">
            {{# } }}
            <div style="display: none">{{d.id}}</div>
        </permTag:perm>
        <permTag:lacksPerm funcCode="order_download_joomStore">
            {{# if(d.orderDownloadStatus){ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" checked disabled>
            {{# }else{ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" disabled>
            {{# } }}
        </permTag:lacksPerm>
    </div>
</script> -->
<!--处理wish店铺同步时间-->
<script type="text/html" id="joomLastSyncTime">
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<!--处理wish店铺同步状态-->
<script type="text/html" id="joomSyncStatus">
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
<script type="text/html" id="joomTableBar">
    <permTag:perm funcCode="editJoomAcctBtn">
        {{# if(!d.refreshToken || !d.refreshTokenExpiryTime){ }}
        <a class="layui-btn layui-btn-xs" lay-event="generateAccessToken">首次授权</a><br>
        {{# }else if(Date.parse(new Date())>((d.refreshTokenExpiryTime - 30*24*60*60)*1000)){ }}
        <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="generateAccessToken">到期重授</a><br>
        {{# }else{ }}
        <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="generateAccessToken">重新授权</a><br>
        {{# } }}
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    </permTag:perm>
    <permTag:perm funcCode="joomCheckAccessToken">
    <a class="layui-btn layui-btn-xs" lay-event="checkAccessToken">查看授权</a>
  </permTag:perm>
</script>
<!-- joom添加基本信息模态框内容 -->
<script type="text/html" id="addJoomInfoLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="joomSalesPlatAccountAddForm">
            <div id="joomAcctReuseDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-xs" lay-submit="" lay-filter="reuseJoomAcct">启用店铺</button>
            </div>
            <div id="joomAcctDelDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-danger layui-btn-xs" lay-submit="" lay-filter="delJoomAcct">
                    停用店铺
                </button>
            </div>

            <input type="hidden" name="acctBaseId">
            <input type="hidden" name="platCode" value="joom">
            <input type="hidden" name="acctDetailId">

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label" style="width:150px">店铺名称</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <input type="text" name="storeAcct" required lay-verify="required" placeholder="请输入店铺名称"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">图片域名</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <input type="text" name="imgDomain" placeholder="请输入图片地址" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label" style="width:150px">客户端id(clientId)</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <input type="text" name="clientId" placeholder="请输入客户端id" class="layui-input">
                    </div>
                </div>

                <div class="layui-inline">
                    <label class="layui-form-label">ClientSecret</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="clientSecret" placeholder="请输入ClientSecret" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label" style="width:150px;">销售员</label>
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
                    <label class="layui-form-label" style="width:150px;">税号</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="taxNumber" placeholder="税号"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">欧盟税号</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="eoriNumber" placeholder="请输入欧盟税号"
                               class="layui-input">
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">店铺额度</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="number" min="0" name="listingLimit" placeholder="请输入店铺额度" class="layui-input">
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
                    <button class="layui-btn" lay-submit="" lay-filter="addJoomAcct" id="addJoomAcct">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- joom 生成token modal -->
<script type="text/html" id="joomTokenModalLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="joomTokenAddForm">
            <input type="hidden" name="platCode" value="joom">
            <input type="hidden" name="salesAcctId">
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:150px">客户端id(clientId)</label>
                <div class="layui-input-inline" style="width:500px">
                    <input type="text" name="clientId" required lay-verify="required" class="layui-input" readonly>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:150px">Client Secrect</label>
                <div class="layui-input-inline" style="width:500px">
                    <input type="text" name="clientSecret" required lay-verify="required" class="layui-input" readonly>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:150px">Code</label>
                <div class="layui-input-inline" style="width:500px">
                    <input type="text" name="code" required lay-verify="required" placeholder="请输入Code"
                        class="layui-input">
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="addJoomAcctToken" id="addJoomAcctToken">提交
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
        <label><a id="joomAuthLinkUrl" target="_blank" style="color: #428bca" href="">授权链接</a>
        </label>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/configuration/store/joomAccount.js"></script>

<script type="text/html" id="editJoomSalesPersonLayer">
    <div class="p20">
        <form action="" class="layui-form" id="editJoomSalesPersonForm">
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

<script type="text/html" id="editJoomDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editJoomDomainForm">
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