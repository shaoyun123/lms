<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<title>账号信息</title>
<style>
    .fieldBox{
        float: left;
        width: 15%;
        height: 25px;
    }
    .flex_around{
        display: flex;
        justify-content: arount;
    }
    .pl_20{
        margin-left:20px;
    }
    .w_30{
        width: 30%;
    }
    .label{
        width: 150px;
        text-align: right;
        margin-right:25px;
    }
    .point_st{
        cursor: pointer;
    }

    .m_10{
        margin: 10px 10px 0!important;
    }

    .layui-card-header{
        /* line-height: 0!important; */
        height:inherit!important;
    }

</style>
<div class="layui-fluid" id="LAY-ebay-acinformation">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="info_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售主管</label>
                                <div class="layui-input-block">
                                    <select name="ebay_account_sellLeader" lay-search="" id="ebay_account_sellLeaders" lay-filter="ebay_account_sellLeaders">
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">账号</label>
                                <div class="layui-input-block" hp-select>
                                        <div hidden hp-select-data id="user_id"></div>
                                        <%--<input hidden name="buyerId" hp-select-value>--%>
                                        <input class="layui-input" name="user_id" hp-select-text placeholder="可选可写">
                                        <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 flex_around pl_20">
                                <select name="isBind"  lay-filter="ebay_paypal_select" >
                                        <option value="0" selected>绑定paypal状态</option>
                                        <option value="1">收款paypal邮箱</option>
                                </select>
                                <div class="layui-input-block" style="margin-left:0" hp-select>
                                        <div style="width: 50%;" hidden hp-select-data data-name="ebay_paypal"></div>
                                        <%--<input hidden name="bind" hp-select-value>--%>
                                        <input class="layui-input" name="ebay_paypal" hp-select-text placeholder="可选可写">
                                        <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 flex_around pl_20">
                                <select name="search_type" id="search_type" class="w_30">
                                    <option value="0">公司</option>
                                    <option value="1">注册人</option>
                                    <option value="2">电话</option>
                                    <option value="3">省份</option>
                                </select>
                                <div class="layui-inline-block">
                                    <input type="text" class="layui-input" id="ebay_all_search">
                                </div>           
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">卖家标准</label>
                                <div class="layui-input-block">
                                    <select name="buyerStandard" lay-search="" id="powerSellerLevel">
                                        <option value="">请选择</option>
                                        <option value="Bronze">Bronze</option>
                                        <option value="CustomCode">CustomCode</option>
                                        <option value="Gold">Gold</option>
                                        <option value="None">None</option>
                                        <option value="Platinum">Platinum</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Titanium">Titanium</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺状态</label>
                                <div class="layui-input-block">
                                    <select name="buyerStandard" lay-search="" id="sellerAccountStatus">
                                        <option value="">请选择</option>
                                        <option value="Current">Current</option>
                                        <option value="CustomCode">CustomCode</option>
                                        <option value="OnHold">OnHold</option>
                                        <option value="PastDue">PastDue</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 flex_around">
                                <div class="label">好评率</div>
                                <select name="moreorless" id="feedbackSearchType">
                                    <option value="lessThan">&lt;</option>
                                    <option value="than">=</option>
                                    <option value="graterThan">&gt;</option>
                                </select> 
                                <div class="layui-inline-block">
                                    <input type="text" class="layui-input" id="feedbackSearch">
                                </div>                            
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 flex_around pl_20">
                                    <div class="label">费用折扣</div>
                                    <select name="moreorless" id="discountSearchType">
                                        <option value="lessThan">&lt;</option>
                                        <option value="than">=</option>
                                        <option value="graterThan">&gt;</option>
                                    </select> 
                                    <div class="layui-inline-block">
                                    <input type="text" class="layui-input" id="discountSearch">
                                    </div>                            
                                </div>
                            <div class="layui-col-md2 layui-col-lg2 pl_20">
                                <label class="layui-form-label">主站点</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="newSite">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">主站点等级</label>
                                <div class="layui-input-block">
                                <select name="buyerStandard" lay-search="" id="sellerLevel">
                                    <option value="">请选择</option>
                                    <option value="Anchor">Anchor</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Close">Close</option>
                                    <option value="CustomCode">CustomCode</option>
                                    <option value="Featured">Featured</option>
                                </select>
                            </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 flex_around">
                                    <div class="label">信用度</div>
                                    <select name="moreorless" id="scoreSearchType">
                                        <option value="lessThan">&lt;</option>
                                        <option value="than">=</option>
                                        <option value="graterThan">&gt;</option>
                                    </select> 
                                    <div class="layui-inline-block">
                                        <input type="text" class="layui-input" id="scoreSearch">
                                    </div>                            
                                </div>
                            <div class="layui-col-md2 layui-col-lg2 pl_20">
                                <label class="layui-form-label">账单时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="ebay_account_entries_date">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1" style="text-align:right">
                             <button class="layui-btn layui-btn-sm keyHandle" type="button" id="ebay_account_search">查询</button>
                            </div>
                        <div class="layui-col-l12 layui-col-md12" id="ebayAccount_search_cate"></div>
                    </form>
                </div>
            </div>
        </div>
        <div class="layui-card"   id="ebayaccinformationCard">
                <div class="layui-tab">
                    <div class="layui-card-header">
                    <ul class="layui-tab-title m_10" style="display:inline-block;">
                        <li class="layui-this">账户信息(<span id="ebay_accinformation_num1_span"></span>)</li>
                        <li>店铺信息(<span id="ebay_accinformation_num2_span"></span>)</li>
                        <li>账单信息(<span id="ebay_accinformation_num3_span"></span>)</li>
                    </ul>
                    <button class="layui-btn layui-btn-sm" id="ebayAcct_exportBtn" type="button" style="margin-left: 30px">导出</button>
                    </div>
                    <div class="layui-tab-content" style="padding:0 10px 10px;">
                        <div class="layui-tab-item  layui-show">
                            <table class="layui-table" id="acc_Info" lay-filter="acc_Info">
                            </table>
                        </div>
                        <div class="layui-tab-item">
                            <table class="layui-table" id="store_Information" lay-filter="store_Information">
                            </table>
                        </div>
                        <div class="layui-tab-item">
                            <table class="layui-table" id="acct_entries_Information" lay-filter="acct_entries_Information">
                            </table>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/accinformation.js"></script>

<script type="text/html" id="account_ebay">
    {{# if(d.syncStatus){ }}
        <span class="account_ebay point_st  pora copySpan" style="color: #00B83F">
          <a href="javascript:;">{{d.storeAcct}}</a>
          <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
        </span>
        <pre class="layui-hide">同步成功:{{ Format(d.syncTime,"yyyy-MM-dd hh:mm:ss")}}</pre>
    {{# }else{ }}
        <span class="account_ebay point_st  pora copySpan" style="color:red">
            <a href="javascript:;">{{d.storeAcct}}</a>
            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
        </span>
        <pre class="layui-hide">同步失败:{{d.syncDesc}}</pre>
    {{# } }}
</script>
<script type="text/html" id="registAddress">
        {{# if(d.street != null && d.street != ''){ }}
            {{d.stateOrProvince}}  {{d.street}}  <br>
            <%--{{# if(d.street1 != null && d.street1 != ''){ }}
                {{d.street1}} <br>
            {{# } }}
            {{# if(d.street2 != null && d.street2 != ''){ }}
                {{d.street2}}
            {{# } }}--%>
        {{# } }}
</script><script type="text/html" id="gatherPaypal">
        {{# if(d.paypalEmail1 != null && d.paypalEmail1 != ''){ }}
            {{d.paypalEmail1}} <br>
            {{# if(d.paypalEmail2 != null && d.paypalEmail2 != ''){ }}
                {{d.paypalEmail2}} <br>
            {{# } }}
            {{# if(d.paypalEmail3 != null && d.paypalEmail3 != ''){ }}
                {{d.paypalEmail3}}
            {{# } }}
        {{# } }}
</script></script><script type="text/html" id="mainStopChange">
    {{# if(d.oldSite != d.newSite){ }}
       {{d.oldSite}} - {{d.newSite}}
    {{# }else{ }}
        无变更
    {{# } }}
</script>
</script></script><script type="text/html" id="ebay_url">
    {{# if(d.url != null && d.url != ''){ }}
        <a href="{{d.url}}" style="color: #00B83F">{{d.url}}</a>
    {{# }else{ }}
        无
    {{# } }}
</script>


</script><script type="text/html" id="invoiceBalanceTpl">
<span>{{ d.invoiceBalance ||'' }}  {{d.invoiceBalanceCurrency || ''}}</span>
</script>
</script><script type="text/html" id="lastAmountPaidTpl">
<span>{{ d.lastAmountPaid ||'' }}  {{d.lastAmountPaidCurrency || ''}}</span>
</script>
</script><script type="text/html" id="currentBalanceTpl">
<span>{{ d.currentBalance ||'' }}  {{d.currentBalanceCurrency || ''}}</span>
</script>
<script type="text/html" id="sync_butn">
    <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="sync_butn">更新</a>
</script>

<script type="text/html" id="ebayAcct_exportPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_acctList"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="exportForm_acctList">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">账户信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="账号" title="账号" disabled checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="注册时间" title="注册时间" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="注册人" title="注册人" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="公司" title="公司" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="注册地址" title="注册地址" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="电话" title="电话" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="注册邮箱" title="注册邮箱" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="绑定paypal状态" title="绑定paypal状态" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="收款Paypal" title="收款Paypal" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">店铺信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="卖家标准" title="卖家标准" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="店铺状态" title="店铺状态" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="费用折扣" title="费用折扣" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="好评率" title="好评率" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="信用" title="信用" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="主站点" title="主站点" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="主站点等级" title="主站点等级" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="主站点时间段" title="主站点时间段" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="URL" title="URL" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="主站点变更" title="主站点变更" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">账单信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="出账单周期" title="出账单周期" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="信用卡" title="信用卡" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="信用卡过期时间" title="信用卡过期时间" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="信用卡更新时间" title="信用卡更新时间" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="当前余额" title="当前余额" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="账单金额" title="账单金额" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="账单日" title="账单日" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="上次实付金额" title="上次实付金额" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="上次实付时间" title="上次实付时间" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="storeField" value="支付方式" title="支付方式" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>