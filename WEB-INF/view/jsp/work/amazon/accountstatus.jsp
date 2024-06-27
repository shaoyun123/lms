<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>账户状况</title>
<style type="text/css">
    #LAY-accountstatus .text_l {
        font-size: 25px;
        text-align: left;
    }

    #LAY-accountstatus .text_11 {
        color: red;
        text-align: left;
    }

    #LAY-accountstatus .text {
        text-align: left;
        margin-top: 5px;
    }

    #LAY-accountstatus .text_2 {
        color: red;
    }

    #LAY-accountstatus .layui-table-cell {
        line-height: 18px;
    }

    #LAY-accountstatus .layui-table td {
        font-size: 11px;
    }

    #LAY-accountstatus .text_3 {
        text-align: left;
    }
</style>
<div class="layui-fluid" id="LAY-accountstatus">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="accountstatus_search_form" lay-filter="accountstatus_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonOrgId" id="accountstatus_online_depart_sel" lay-search
                                        lay-filter="accountstatus_online_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonId" id="accountstatus_online_salesman_sel" lay-search
                                        lay-filter="accountstatus_online_salesman_sel" class="users_hp_custom"
                                        data-rolelist="amazon专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="accountstatus_online_store_sel"
                                        lay-filter="accountstatus_online_store_sel"
                                        xm-select="accountstatus_online_store_sel" class="users_hp_store_multi"
                                        xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                        data-platcode="amazon" name="storeAcctIds"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">账户评分</label>
                                <div class="layui-input-block disflex">
                                    <input class="layui-input" name="minAhrScore" onblur="commonBlurInputNotNega(event)">
                                    <span class="ml10 mr10">-</span>
                                    <input class="layui-input" name="maxAhrScore" onblur="commonBlurInputNotNega(event)">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-lg2">
                                <button type="button" style="margin-left: 50px;" class="layui-btn" type="submit"
                                    lay-submit="" lay-filter="search_btn" id="search_btn">搜索</button>
                            </div>
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block" id="siteIds"></div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header">
                        <div style="display:flex;justify-content:flex-start;align-items:center;height: 100%;">
                            <button type="button" class="layui-btn layui-btn-sm" id="accountstatus_out">
                                导出</button>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="account_table" lay-filter="account_table"></table>
                </div>
            </div>

        </div>
    </div>
</div>
<!-- 表格渲染 -->

<script type="text/html" id="account_tp1_0">
    <div>
        {{d.storeAcctName}}
    </div>
    <div >{{d.siteName}}</div>
</script>
<script type="text/html" id="account_tp1_1">
    <div>
        <p class="text_l" >{{d.orderDefectRate}}%</p>
        <p  class="text">({{d.orderDefectRateNums}}/{{d.orderDefectRateTotalNums}})</p>
    </div>
    {{# if(d.orderDefectRateStartTime || d.orderDefectRateEndTime ){}}
    <div class="text">{{format(d.orderDefectRateStartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.orderDefectRateEndTime,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script type="text/html" id="account_tp1_2">
    <div>
        <p class="text_l" >{{d.orderDefectRateNegativeFeedbackRate}}%</p>
        <p  class="text">({{d.orderDefectRateNegativeFeedbackRateNums}}/{{d.orderDefectRateTotalNums}})</p>
    </div>
    {{# if(d.orderDefectRateStartTime || d.orderDefectRateEndTime ){}}
    <div class="text">{{format(d.orderDefectRateStartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.orderDefectRateEndTime,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script type="text/html" id="account_tp1_3">
    <div>
        <p class="text_l">{{d.orderDefectRateProtectionClaimRate}}%</p>
        <p class="text">({{d.orderDefectRateProtectionClaimRateNums}}/{{d.orderDefectRateTotalNums}})</p>
    </div>
    {{# if(d.orderDefectRateStartTime || d.orderDefectRateEndTime ){}}
    <div class="text">{{format(d.orderDefectRateStartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.orderDefectRateEndTime,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script type="text/html" id="account_tp1_4">
    <div>
        <p class="text_l" >{{d.orderDefectRateProtestClaimRate}}%</p>
        <p class="text">({{d.orderDefectRateProtestClaimRateNums}}/{{d.orderDefectRateTotalNums}})</p>
    </div>
    {{# if(d.orderDefectRateStartTime || d.orderDefectRateEndTime ){}}
    <div class="text">{{format(d.orderDefectRateStartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.orderDefectRateEndTime,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script type="text/html" id="account_tp1_5">
    <div>
        <p class="text_l" >{{d.invoiceDefectRate}}%</p>
        <p class="text">({{d.invoiceDefectRateNums}}/{{d.invoiceDefectRateTotalNums}})</p>
    </div>
</script>
<script type="text/html" id="account_tp1_6">
    <div>
        <p class="text_l" >{{d.delayRate10}}%</p>
        <p class="text">({{d.delayRate10Nums}}/{{d.delayRate10TotalNums}})</p>
    </div>
    {{# if(d.delayRate10StartTime || d.delayRate10EndTime){}}
    <div class="text">{{format(d.delayRate10StartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.delayRate10EndTime,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script type="text/html" id="account_tp1_7">
    <div>
        {{# if(d.delayRate30 < 4){}}
        <p class="text_l">{{d.delayRate30}}%</p>
        {{# }}}
        {{# if(d.delayRate30 >= 4){}}
        <p class="text_l text_11">{{d.delayRate30}}%</p>
        {{# }}}
        <p class="text">({{d.delayRate30Nums}}/{{d.delayRate30TotalNums}})</p>
    </div>
    {{# if(d.delayRate30StartTime || d.delayRate30EndTime){}}
    <div class="text">{{format(d.delayRate30StartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.delayRate30EndTime,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script type="text/html" id="account_tp1_8">
    <div>
        {{# if(d.deliveryCancellationRate < 2.5){}}
        <p class="text_l">{{d.deliveryCancellationRate}}%</p>
        {{# }}}
        {{# if(d.deliveryCancellationRate >= 2.5){}}
        <p class="text_l text_11">{{d.deliveryCancellationRate}}%</p>
        {{# }}}
        <p class="text">({{d.deliveryCancellationRateNums}}/{{d.deliveryCancellationRateTotalNums}})</p>
    </div>
    {{# if(d.deliveryCancellationRateStartTime || d.deliveryCancellationRateEndTime){}}
    <div class="text">{{format(d.deliveryCancellationRateStartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.deliveryCancellationRateEndTime,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script type="text/html" id="account_tp1_9">
    <div>
        {{# if(d.effectiveTrackingRate >= 95){}}
        <p class="text_l">{{d.effectiveTrackingRate}}%</p>
        {{# }}}
        {{# if(d.effectiveTrackingRate < 95){}}
        <p class="text_l text_11">{{d.effectiveTrackingRate}}%</p>
        {{# }}}
        <p class="text">({{d.effectiveTrackingRateNums}}/{{d.effectiveTrackingRateTotalNums}})</p>
    </div>
    {{# if(d.effectiveTrackingRateStartTime || d.effectiveTrackingRateEndTime){}}
    <div class="text">{{format(d.effectiveTrackingRateStartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.effectiveTrackingRateEndTime,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script type="text/html" id="account_tp1_10">
<div>
    {{# if(d.onTimeDeliveryRate >= 97){}}
    <p class="text_l">{{d.onTimeDeliveryRate}}%</p>
    {{# }}}
    {{# if(d.onTimeDeliveryRate < 97){}}
    <p class="text_l text_11">{{d.onTimeDeliveryRate}}%</p>
    {{# }}}
    <p class="text">({{d.onTimeDeliveryRateNums}}/{{d.onTimeDeliveryRateTotalNums}})</p>
</div>
{{# if(d.onTimeDeliveryRateStartTime || d.onTimeDeliveryRateEndTime ){}}
<div class="text">
    {{format(d.onTimeDeliveryRateStartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.onTimeDeliveryRateEndTime,"yyyy-MM-dd")}}</div>
{{# }}}
</script>
<script type="text/html" id="account_tp1_11">
    <div>
        <p class="text_l" >{{d.returnDissatisfactionRate}}%</p>
        <p class="text">({{d.returnDissatisfactionRateNums}}/{{d.returnDissatisfactionRateTotalNums}})</p>
    </div>
    {{# if(d.returnDissatisfactionRateStartTime || d.returnDissatisfactionRateEndTime){}}
    <div class="text">{{format(d.returnDissatisfactionRateStartTime,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.returnDissatisfactionRateEndTime,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script type="text/html" id="account_tp1_12">
    {{#  layui.each(d.hasPolicyList,function(index,v){}}
    {{# if(index<4){}}
        <div class="text_2">
            {{v.label}}({{v.value}})     
        </div>  
        {{#  }}}
        {{#   })}}
        {{#if(d.hasPolicyList.length>4){}}
        <div class="text_2" style="font-weight: bolder" lay-tips="{{d.wholePolicyStr}}">...</div>
        {{# }}}
    <!-- {{# if(d.policySuspectedInfringementOfIntellectualPropertyRights){}}
    <div class="text_2">
        涉嫌侵犯知识产权({{d.policySuspectedInfringementOfIntellectualPropertyRights}})     
    </div>
    {{# }}}
    {{# if(d.policyIntellectualPropertyComplaints){}}
    <div class="text_2">
        知识产权投诉({{d.policyIntellectualPropertyComplaints}})     
    </div>
    {{# }}}
    {{# if(d.policyBuyerComplaintAboutProductAuthenticity){}}
    <div class="text_2">
        商品真实性买家投诉({{d.policyBuyerComplaintAboutProductAuthenticity}})     
    </div>
    {{# }}}
    {{# if(d.policyCommodityConditionBuyerComplaints){}}
    <div class="text_2">
        商品状况买家投诉({{d.policyCommodityConditionBuyerComplaints}})     
    </div>
    {{# }}}
    {{# if(d.policyFoodAndCommoditySafetyIssues){}}
    <div class="text_2">
        食品和商品安全问题({{d.policyFoodAndCommoditySafetyIssues}})     
    </div>
    {{# }}}
    {{# if(d.policyListingPolicyViolation){}}
    <div class="text_2">
        上架政策违规({{d.policyListingPolicyViolation}})     
    </div>
    {{# }}}
    {{# if(d.policyViolationOfRestrictedProductsPolicy){}}
    <div class="text_2">
        违反受限商品政策({{d.policyViolationOfRestrictedProductsPolicy}})     
    </div>
    {{# }}}
    {{# if(d.policyViolationOfBuyerProductReviewPolicy){}}
    <div class="text_2">
        违反买家商品评论政策({{d.policyViolationOfBuyerProductReviewPolicy}})     
    </div>
    {{# }}}
    {{# if(d.policyOtherPolicyViolations){}}
    <div class="text_2">
        其他违反政策({{d.policyOtherPolicyViolations}})     
    </div>
    {{# }}}
    {{# if(d.policyViolationWarning){}}
    <div class="text_2">
        违反政策警告({{d.policyViolationWarning}})     
    </div>
    {{# }}} -->
</script>
<script type="text/html" id="account_tp1_13">
    {{# if(d.ahrStatusCn=='健康'){ }}
        <div class="text_l fGreen" >{{d.ahrStatusCn}}</div>
    {{# }else if(d.ahrStatusCn=='存在风险'){ }}
        <div  class="text_l"  style="color: #deac25;">{{d.ahrStatusCn}}</div>
    {{#  }else if(d.ahrStatusCn=='不健康'){ }}
        <div  class="text_l fRed">{{d.ahrStatusCn}}</div>
    {{# } }}
    <div>{{d.ahrScoreIntValue===undefined?'':d.ahrScoreIntValue}}</div>
    {{# if(d.ahrReportingDateFrom || d.ahrReportingDateTo){}}
    <div class="text">{{format(d.ahrReportingDateFrom,'yyyy-MM-dd')}}~</div>
    <div class="text_3">{{format(d.ahrReportingDateTo,"yyyy-MM-dd")}}</div>
    {{# }}}
</script>
<script src="${ctx}/static/js/work/amazon/accountstatus.js"></script>