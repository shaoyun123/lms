<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>amazon店铺</title>
<style>
    .redStar:before{
        content: "*";
        color: red;
        font-size: 20px;
        position: relative;
        top: 7px;
        right: 10px;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="amazonAcctSearchForm">
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
                                <input type="text" name="storeAcct" placeholder="店铺名称,单个模糊多个精确逗号分隔" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">部门</label>
                            <div class="layui-input-inline" style="width:180px">
                                <select id="amazon_account_depart_sel" lay-search lay-filter="amazon_account_depart_sel"
                                        class="orgs_hp_custom">
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">销售员</label>
                            <div class="layui-input-inline sellect-seller w100">
                                <select id="amazon_account_salesman_sel" lay-search
                                        lay-filter="amazon_account_salesman_sel" class="users_hp_custom"
                                        data-rolelist="amazon专员">
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline w100">
                            <select name="" id="amazonSyncListingStatus" lay-filter="amazonSyncListingStatusFilter" lay-search>
                                <option value="">同步listing状态</option>
                                <option value="0">未同步</option>
                                <option value="2">同步中</option>
                                <option value="3">同步成功</option>
                                <option value="4">同步失败</option>
                            </select>
                        </div>
                        <div class="layui-inline w100">
                            <div class="layui-input-inline">
                                <input type="text" name="syncDesc" placeholder="同步异常备注" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">是否跟卖店铺</label>
                            <div class="layui-input-inline w100">
                                <select name="autoFollowSell" lay-search>
                                    <option value="" selected>全部</option>
                                    <option value="true">是</option>
                                    <option value="false">否</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload"
                                        id="amazonSearch">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="amazonaccountCard">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="amazon_acct_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" lay-id="1">数量(<span id="amazonAccount_colLen"></span>)</li>
                            <li lay-id="2">7天内到期域名(<span id="amazon_acct_domain_overdue_number"></span>)</li>
                        </ul>
                        <div style="position:absolute;top:10px;right:20px">
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button class="layui-btn layui-btn-sm" id="amazon_syncAmazonListing">同步listing
                                    </button>
                                </div>
                                <div class="layui-input-inline w150 layui-form">
                                    <select name="hello" lay-filter="amazonAcctBatchOper" lay-search>
                                        <option value="" disabled selected>批量操作</option>
                                        <option value="3">修改信息</option>
                                        <permTag:perm funcCode="amazonBatchEnableAcctStatus">
                                            <option value="6">批量启用店铺</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="amazonBatchUnableAcctStatus">
                                            <option value="7">批量停用店铺</option>
                                        </permTag:perm>
                                        <option value="8">修改图片域名</option>
                                        <option value="9">批量备注</option>
                                    </select>
                                </div>
                                <div class="layui-input-inline">
                                    <permTag:perm funcCode="editAmazonAcctBtn">
                                        <button class="layui-btn layui-btn-normal layui-btn-sm" id="addAmazonInfo">添加账号
                                        </button>
                                    </permTag:perm>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="amazonTable" lay-filter="amazonTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<script type="text/html" id="amazonAcctStatusTpl">
    {{# if(d.status == false){ }}
    <font color="red">已停用</font>
    {{# } else { }}
    已启用
    {{# } }}
</script>
<!--订单下载状态的开启和关闭-->
<script type="text/html" id="orderDownloadStatusTemplet">
    <div class="layui-form-item" id="orderDownloadStatusCheckbox">
        <permTag:perm funcCode="order_download_amazonStore">
            {{# if(d.orderDownloadStatus){ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus"
                   checked>
            {{# }else{ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus">
            {{# } }}
            <div style="display: none">{{d.id}}</div>
        </permTag:perm>
        <permTag:lacksPerm funcCode="order_download_amazonStore">
            {{# if(d.orderDownloadStatus){ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus"
                   checked disabled>
            {{# }else{ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" disabled>
            {{# } }}
        </permTag:lacksPerm>
    </div>
</script>
<!--处理amazon店铺同步时间-->
<script type="text/html" id="amazonLastSyncTime">
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<script type="text/html" id="amazonadvertisement">
    {{# if(d.advertisingExpiresTime){ }}
    <div class="wrap">
        <div class="left">
                <div class="layui-col-md8">
                    {{ Format(d.advertisingExpiresTime, "yyyy-MM-dd hh:mm:ss")}}
                </div>
        </div>
        <div class="right">
            <i class="layui-icon layui-icon-refresh-3" style="color: red;" lay-event="amazonrefesh"></i>  
        </div>
    </div>
{{# }}}
</script>
<script type="text/html" id="amazonaspAccessTokenExpiresTime">
    {{# if(d.spAccessTokenExpiresTime){ }}
    <div class="wrap">
        <div class="left">
            <div class="layui-col-md8">
                {{ Format(d.spAccessTokenExpiresTime, "yyyy-MM-dd hh:mm:ss")}}
            </div>
        </div>
        <div class="right">
            <i class="layui-icon layui-icon-refresh-3" style="color: red;" lay-event="amazonrefesh_spAccessTokenExpiresTime"></i>
        </div>
    </div>
    {{# }}}
</script>
<!--处理smt店铺同步时间-->
<script type="text/html" id="amazonSyncDesc">
    <div class="overContentIntercept" title="{{ d.syncDesc || ''}}">{{ d.syncDesc || ''}}</div>
</script>
<!--处理smt店铺同步状态-->
<script type="text/html" id="amazonSyncStatus">
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
<script type="text/html" id="amazonTableBar">
    <permTag:perm funcCode="editAmazonAcctBtn">
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    </permTag:perm>
    <button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="amazonAdverauthorization">
        广告授权
    </button>
    <button class="layui-btn layui-btn-xs" lay-event="amazonSpAPIauthorization">
        spAPI授权
    </button>
    <permTag:perm funcCode="amazonCheckAccessToken">
    <a class="layui-btn layui-btn-xs" lay-event="checkAccessToken">查看授权</a>
  </permTag:perm>
</script>
<!-- amazon添加基本信息模态框内容 -->
<script type="text/html" id="addAmazonInfoLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="amazonSalesPlatAccountAddForm">
            <div id="amazonAcctReuseDiv" class="layui-hide taRight">
                <button class="layui-btn layui-btn-xs" lay-submit="" lay-filter="reuseAmazonAcct">启用店铺</button>
            </div>
            <div id="amazonAcctDelDiv" class="layui-hide taRight">
                <button class="layui-btn layui-btn-danger layui-btn-xs" lay-submit="" lay-filter="delAmazonAcct">
                    停用店铺
                </button>
            </div>

            <input type="hidden" name="platCode" value="amazon">
            <input type="hidden" name="acctBaseId">
            <input type="hidden" name="acctDetailId">
            <input type="hidden" name="amazonSalesSite">

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label redStar">店铺名称</label>
                    <div class="layui-input-inline" style="width:320px">
                        <input type="text" name="storeAcct" required lay-verify="required" placeholder="请输入店铺名称"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label redStar">注册邮箱</label>
                    <div class="layui-input-inline" style="width:320px">
                        <input type="text" name="registerEmail" required lay-verify="required" placeholder="请输入注册邮箱"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                <label class="layui-form-label">开户站</label>
                <div class="layui-input-inline" style="width:320px" id="amazonSiteDiv">
                    <select name="openingSite" class="layui-select" lay-search>
                        <option value="">选择开户站</option>
                        <c:forEach items="${amazonSites}" var="amazonSite">
                            <option value="${amazonSite.getMarketName()}">${amazonSite.getName()}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">UPC豁免</label>
                <div class="layui-input-inline" style="width:320px">
                    <select name="upcExemptionFlag" class="layui-select" lay-search>
                        <option></option>
                        <option value="true">是</option>
                        <option value="false">否</option>
                    </select>
                </div>
            </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">图片域名</label>
                    <div class="layui-input-inline" style="width:320px">
                        <input type="text" name="imgDomain" placeholder="请输入图片地址"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">默认品牌</label>
                    <div class="layui-input-inline" style="width:320px">
                        <input type="text" placeholder="请输入默认品牌" min="0" class="layui-input" name="brand">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label redStar">授权ID</label>
                    <div class="layui-input-inline" style="width:320px">
                        <input type="text" name="sellerId" required lay-verify="required" placeholder="请输入MWS Merchat ID"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">授权令牌</label>
                    <div class="layui-input-inline" style="width:320px">
                        <input type="text" name="accessToken" placeholder="请输入MWS授权令牌"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">销售员</label>
                    <div class="layui-input-inline" style="width:320px">
                        <select name="salespersonId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">销售主管</label>
                    <div class="layui-input-inline" style="width:320px">
                        <select name="salespersonLeader" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">制造商</label>
                    <div class="layui-input-inline" style="width:320px">
                        <input type="text" name="manufacturer" placeholder="请输入制造商"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">是否跟卖店铺</label>
                    <div class="layui-input-inline" style="width:320px">
                        <select name="autoFollowSell" class="layui-select" lay-search>
                            <option value=""></option>
                            <option value="false">否</option>
                            <option value="true">是</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">跟卖上限</label>
                    <div class="layui-input-inline" style="width:320px">
                        <input type="number" name="autoFsLimit" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label" style="width:140px">是否FBA铺货店铺</label>
                    <div class="layui-input-inline" style="width:290px">
                        <select name="isDistributionStore" class="layui-select" lay-search>
                            <option value=""></option>
                            <option value="false">否</option>
                            <option value="true">是</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">刊登类型</label>
                    <div class="layui-input-inline" style="width:320px">
                        <select name="fulfillmentType" class="layui-select" lay-search lay-filter="amazonAcctFulfillmentType">
                            <option value=""></option>
                            <option value="fbm">直邮</option>
                            <option value="fba">FBA</option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline fulfillmentLatencyDiv">
                    <label class="layui-form-label">处理时间</label>
                    <div class="layui-input-inline" style="width:320px">
                        <input name="fulfillmentLatency" class="layui-input" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                        <input name="fulfillmentLatencyHide" type="hidden">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">站点品牌</label>
                <div class="layui-input-block">
                    <c:forEach items="${amazonSites}" var="amazonSite">
                        <label class="layui-form-label"
                               value="${amazonSite.getMarketName()}">${amazonSite.getName()}</label>
                        <div class="layui-input-inline" style="width:250px">
                            <input type="text" name="siteBrand_${amazonSite.getMarketName()}"
                                   site="${amazonSite.getMarketName()}" placeholder="请输入${amazonSite.getName()}站点对应的品牌"
                                   class="layui-input siteBrand_class">
                        </div>
                    </c:forEach>
                </div>
            </div>

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">税号</label>
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

            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="acctBaseRemark" placeholder="请输入备注内容" class="layui-textarea"></textarea>
                </div>
            </div>

            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="addAmazonAcct" id="addAmazonAcct">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 广告授权 -->
<script type="text/html" id="Adverauthorization">
    <div class="p20">
        <div class="layui-card">
            <div class="layui-card-header">步骤一：进入下方链接；选中对应的平台。登录amazon账号，成功后复制网页地址栏中code参数</div>
            <div class="layui-card-body">
                <input type="text" name="aaa" class="layui-input" id="Amazonwebcode">
            </div>
            </div>
        <div class="layui-card">
            <div class="layui-card-header">步骤二：填入获取的code，点击保存。即可成功授权</div>
            <div class="layui-card-body">
                <textarea name="code" placeholder="请输入备注code" class="layui-textarea"></textarea>
            </div>
        </div>
    </div>
</script>
<!-- spapi授权 -->
<script type="text/html" id="spapiauthorization">
    <div class="p20">
        <div class="layui-card">
            <div class="layui-card-header">步骤一：进入下方链接；选中对应的平台。登录amazon账号，成功后复制网页地址栏中code参数</div>
            <div class="layui-card-body">
                <input type="text" name="spapiauthorizationUrl" class="layui-input" value="" readonly>
            </div>
        </div>
        <div class="layui-card">
            <div class="layui-card-header">步骤二：填入获取的code，点击保存。即可成功授权</div>
            <div class="layui-card-body">
                <textarea name="code" placeholder="请输入备注code" class="layui-textarea"></textarea>
            </div>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/configuration/store/amazonAccount.js"></script>

<script type="text/html" id="editAmazonSalesPersonLayer">
    <div class="p20">
        <form action="" class="layui-form" id="editAmazonSalesPersonForm">
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
                    <select name="salespersonLeader" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">是否跟卖</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="autoFollowSell" lay-search>
                        <option value="" selected>全部</option>
                        <option value="true">是</option>
                        <option value="false">否</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">跟卖上限</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="number" class="layui-input" name="autoFollowSellNum" placeholder="跟卖上限">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">处理时间</label>
                <div class="layui-input-inline" style="width:300px">
                    <input class="layui-input" name="fulfillmentLatency" placeholder="处理时间" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="amazonAcct_autoFollowSell_tpl">
    {{# if(d.autoFollowSell){ }}
    是
    {{# } else { }}
    否
    {{# } }}
</script>

<script type="text/html" id="amazonAcct_layer_setMaxAutoFs">
    <div class="layui-card">
        <form class="layui-form mg_50" id="amazonAcct_layer_setMaxAutoFs_Form"
              lay-filter="amazonAcct_layer_setMaxAutoFs_Form">
            <div class="layui-form-item">
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">最多自动跟卖的店铺数量</label>
                    <div class="layui-input-block">
                        <input name="maxAutoFsStoreNum" type="number" class="layui-input" required
                               lay-verify="required">
                    </div>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-input-block">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                id="amazonAcct_layer_setMaxAutoFs_submit"
                                lay-filter="amazonAcct_layer_setMaxAutoFs_submit">提交
                        </button>
                    </div>
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

<script type="text/html" id="editAmazonDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editAmazonDomainForm">
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
<%--批量备注--%>
<script type="text/html" id="editAmazonRemark">
    <div class="p20">
        <form action="" class="layui-form" id="editAmazonRemarkForm">
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-inline" style="width:300px">
                    <input class="layui-input" name="remark">
                </div>
            </div>
        </form>
    </div>
</script>
