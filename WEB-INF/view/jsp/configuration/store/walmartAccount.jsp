<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>walmart店铺</title>

<style>

</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body" style="display:flex;justify-content: space-between;align-items:center;">
                    <form class="layui-form" style="flex:1;">
                        <div class="layui-form-item" id="walmartAcctSearchForm">
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-form-label labelSel">
                                    <select name="status" lay-search>
                                        <option value="">全部</option>
                                        <option value="true" selected>启用中</option>
                                        <option value="false">已停用</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" placeholder="店铺名称,逗号分割查询多个" name="storeAcct">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  
                                        id="walmart_account_depart_sel" 
                                        placeholder="部门" 
                                        lay-search 
                                        lay-filter="walmart_account_depart_sel"  
                                        class="orgs_hp_custom"
                                        name="orgId">
                                        <option value="">部门</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select  
                                    id="walmart_account_salesman_sel" 
                                    lay-search 
                                    lay-filter="walmart_account_salesman_sel"  
                                    class="users_hp_custom" 
                                    data-rolelist="walmart专员"
                                    name="salespersonId">
                                        <option value="">销售员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                   <input type="text" name="syncDesc" placeholder="同步异常备注" class="layui-input">
                                </div>
                            </div>
                            <input type="hidden" id="walmart_searchType" value="0">
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="walmart_submit">查询</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                    <div style="display:flex;justify-content: flex-end;">
                        <div class="layui-form">
                            <div class="layui-input-inline">
                                <div class="layui-input-inline">
                                    <select lay-filter="walmartAcctBatchOperate" lay-search>
                                        <option value="" disabled selected>批量操作</option>
                                        <option value="editInfo">修改信息</option>
                                        <option value="9">修改图片域名</option>
                                        <permTag:perm funcCode="walmartBatchEnableAcctStatus">
                                            <option value="1">批量启用店铺</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="walmartBatchUnableAcctStatus">
                                            <option value="2">批量停用店铺</option>
                                        </permTag:perm>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-input-inline">
                        <permTag:perm funcCode="editWalmartAcctBtn">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left:15px;" id="walmart_addStore">新增店铺</span>
                        </permTag:perm>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="walmartLayuiCard">
                <div style="height:42px;line-height:42px;">
                <div class="layui-card-header">
                    <div class="layui-tab" lay-filter="walmart-tabs">
                        <ul class="layui-tab-title" style="border-bottom:none;">
                            <li class="layui-this">数量(<span id="walmart_account_colLen"></span></span>)</li>
                            <li>7天内到期域名(<span id="walmart_acct_domain_overdue_number"></span>)</li>
                        </ul>
                    </div>
                </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="walmart_table"  lay-filter="walmart_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格工具条 --%>
<script type="text/html" id="walmart_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="edit">编辑</span>
        <permTag:perm funcCode="walmartCheckAccessToken">
          <a class="layui-btn layui-btn-xs" lay-event="checkAccessToken">查看授权</a>
        </permTag:perm>
    </div>
</script>
<script type="text/html" id="editWalmartDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editWalmartDomainForm">
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
<script type="text/html" id="walmart_editInfoLayer">
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
<script type="text/html" id="walmart_storeLayer">
    <div style="padding:20px;"  id="walmart_storeContainer"></div>
</script>
<%-- 店铺模板 --%>
<script type="text/html" id="walmart_storeContainerTpl">
     <form action="" class="layui-form layui-form-pane">
           {{# if(d.id){ }}
            <div style="margin-bottom:10px;text-align:right;">
                {{# if(!d.status){ }}
                <span class="layui-btn layui-btn-xs layui-btn-normal" id="walmart_openStore">启用店铺</span>
                {{# }else{ }}
                <span class="layui-btn layui-btn-xs layui-btn-danger" id="walmart_stopStore">停用店铺</span>
                {{# } }}
            </div>
           {{# } }}
            <%-- 不知道这三个干嘛的 --%>
            <input type="hidden" name="acctBaseId" value="{{d.acctBaseId}}">
            <input type="hidden" name="acctDetailId" value="{{d.acctDetailId}}">


        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">店铺名称</label>
                <div class="layui-input-inline" style="width:300px;">
                    <input type="text" name="storeAcct" required lay-verify="required" placeholder="请输入店铺名称"
                    class="layui-input" value="{{d.storeAcct || ''}}">
                </div>
            </div>
            <!-- <div class="layui-inline">
                <label class="layui-form-label">普源别名</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="allrootAliasName" placeholder="请输入源别名" class="layui-input" value="{{d.allrootAliasName || ''}}" required lay-verify="required">
                </div>
            </div> -->
            <div class="layui-inline">
                <label class="layui-form-label">图片域名</label>
                <div class="layui-input-inline" style="width:300px;">
                    <input type="text" name="imgDomain"  placeholder="请输入图片地址"
                    class="layui-input" value="{{d.imgDomain || ''}}">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">币种</label>
                <div class="layui-input-inline" style="width:300px">
                    <select type="text" name="currency"  class="layui-select" lay-search>
                        {{# if(d.currency=='CNY'){ }}
                        <option value="CNY" selected>CNY</option>
                        <option value="USD">USD</option>
                        {{# }else{ }}
                        <option value="CNY">CNY</option>
                        <option value="USD" selected>USD</option>
                        {{# } }}
                    </select>
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-inline" style="width:300px;">
                    <select type="text" name="openingSite"  class="layui-select" lay-search>
                       {{# if(d.openingSite=='US'){ }}
                        <option value="US" selected>US</option>
                        <option value="MX">MX</option>
                        <option value="CA">CA</option>
                        {{# }else if(d.openingSite=='MX'){ }}
                        <option value="US">US</option>
                        <option value="MX" selected>MX</option>
                        <option value="CA">CA</option>
                        {{# }else if(d.openingSite=='CA'){ }}
                        <option value="US">US</option>
                        <option value="MX">MX</option>
                        <option value="CA" selected>CA</option>
                        {{# } }}
                    </select>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">品牌</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="brand" class="layui-input" value="{{d.brand || ''}}">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="salespersonIdLayer"  class="layui-select" lay-search>
                        <option value="">请选择</option>
                        {{# if(d.walmartAcct.length){ }}
                            {{#  layui.each(d.walmartAcct, function(index, item){ }}
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
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">销售主管</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="sellLeaderIdLayer"  class="layui-select" lay-search>
                        <option value="">请选择</option>
                        {{# if(d.walmartManger.length){ }}
                            {{#  layui.each(d.walmartManger, function(index, item){ }}
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
            <div class="layui-inline">
                <label class="layui-form-label">ClientId</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="clientId"
                    class="layui-input" value="{{d.clientId || ''}}">
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">ClientSecret</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="clientSecret" class="layui-input" value="{{d.clientSecret || ''}}">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">税号</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" name="taxNumber" placeholder="税号"
                           class="layui-input" value="{{d.taxNumber || ''}}">
                </div>
            </div>
        </div>

         <div class="layui-form-item">
             <div class="layui-inline">
                 <label class="layui-form-label">欧盟税号</label>
                 <div class="layui-input-inline" style="width:300px">
                     <input type="text" name="eoriNumber" placeholder="请输入欧盟税号"
                            class="layui-input" value="{{d.eoriNumber || ''}}">
                 </div>
             </div>
         </div>

        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <textarea name="acctBaseRemark" placeholder="请输入备注内容" 
                class="layui-textarea" value="{{d.acctBaseRemark|| ''}}">
                </textarea>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="walmartAcctStatusTpl">
    {{# if(d.status == false){ }}
    <font color="red">已停用</font>
    {{# } else { }}
    已启用
    {{# } }}
</script>
<!--处理walmart店铺同步状态-->
<script type="text/html" id="walmartSyncStatus">
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
<!--处理walmart店铺同步时间-->
<script type="text/html" id="walmartLastSyncTime">
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script>

<!--订单下载状态的开启和关闭-->
<script type="text/html" id="orderDownloadStatusTemplet">
    <div class="layui-form-item"  id="orderDownloadStatusCheckbox">
        <permTag:perm funcCode="order_download_walmartStore">
            {{# if(d.orderDownloadStatus){ }}
            <input  type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus"
                    checked>
            {{# }else{ }}
            <input  type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus">
            {{# } }}
            <div style="display: none">{{d.id}}</div>
        </permTag:perm>
        <permTag:lacksPerm funcCode="order_download_walmartStore">
            {{# if(d.orderDownloadStatus){ }}
            <input  type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus"
                    checked disabled>
            {{# }else{ }}
            <input  type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" disabled>
            {{# } }}
        </permTag:lacksPerm>
    </div>
</script>

<script src="${ctx}/static/js/configuration/store/walmartAccount.js"></script>


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