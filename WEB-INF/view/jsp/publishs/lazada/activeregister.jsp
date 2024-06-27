<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>活动报名</title>

<style>
 .activeregisterTimer {
    margin: 0 auto;
    background: #F1F3F9;
    width: fit-content;
    border-radius: 14px;
    padding: 5px;
 }
 .activeregisterOpacity {
    opacity: 0;
 }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" id="activeregisterForm" class="layui-form">
                    <div class="layui-form-item">
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">部门</label>
                            <div class="layui-input-block">
                                <select id="activeregister_depart_sel" 
                                    lay-search
                                    lay-filter="activeregister_depart_sel" 
                                    class="orgs_hp_custom" 
                                    name="orgId">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">销售人员</label>
                            <div class="layui-input-block">
                                <select id="activeregister_salesman_sel" 
                                    lay-search
                                    lay-filter="activeregister_salesman_sel" 
                                    class="users_hp_custom"
                                    data-rolelist="lazada专员" 
                                    name="salePersonId">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">店铺</label>
                            <div class="layui-input-block" style="font-size: 12px;">
                                <%-- <div data-platcode="lazada" xm-select="activeregister_store_sel" class="users_hp_store_multi" id="activeregister_store_sel"></div> --%>
                                <select id="activeregister_store_sel" 
                                    lay-filter="activeregister_store_sel"
                                    xm-select="activeregister_store_sel" 
                                    class="users_hp_store_multi" 
                                    xm-select-search
                                    xm-select-search-type="dl" 
                                    xm-select-skin="normal"
                                    data-platcode="lazada"
                                    name="storeIds">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">站点</label>
                            <div class="layui-input-block">
                                <select id="activeregister_site_sel" 
                                    lay-filter="activeregister_site_sel"
                                    xm-select="activeregister_site_sel" 
                                    class="salesSite_hp_custom" 
                                    xm-select-search
                                    xm-select-search-type="dl" 
                                    xm-select-skin="normal" 
                                    name="siteIds">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">活动类型</label>
                            <div class="layui-input-block">
                                <select id="activeregister_active_sel" lay-filter="activeregister_active_sel"
                                    xm-select="activeregister_active_sel" xm-select-search
                                    xm-select-search-type="dl" xm-select-skin="normal" name="campaignBizTypeAndBrandTypes">
                                        <option value="">全部</option>
                                        <option value="1_3">Mega/A+ Campaigns-Platform Campaign</option>
                                        <option value="20_2">Flash Sale-Flash Sale</option>
                                        <option value="20_4">Flash Sale-Crazy Flash Sale</option>
                                        <option value="1_6">Mega/A+ Campaigns-Voucher Campaign</option>
                                        <option value="1_12">Mega/A+ Campaigns-Free Shipping</option>
                                        <option value="2_3">Daily Sales-Platform Campaign</option>
                                        <option value="2_6">Daily Sales-Voucher Campaign</option>
                                        <option value="2_12">Daily Sales-Free Shipping</option>
                                    </select>
                            </div>
                        </div>
                        <div class="layui-col-lg6 layui-col-md6">
                            <label class="layui-form-label">活动名称</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="campaignTitleName">
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">报名截止时间</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" readonly id="campaignSceneTimes" name="campaignSceneTimes">
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">最后错误</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="error">
                            </div>
                        </div>
                        <div class="layui-col-lg6 layui-col-md6">
                            <label class="layui-form-label">处理状态</label>
                            <div class="layui-input-block">
                                <input type="checkbox" name="lmsDealStatus" title="待处理" lay-skin="primary" value="1">
                                <input type="checkbox" name="lmsDealStatus" title="处理中" lay-skin="primary" value="2"> 
                                <input type="checkbox" name="lmsDealStatus" title="处理失败" lay-skin="primary" value="4"> 
                                <input type="checkbox" name="lmsDealStatus" title="处理成功" lay-skin="primary" value="3"> 
                                <input type="checkbox" name="lmsDealStatus" title="处理重试中" lay-skin="primary" value="5"> 
                            </div>
                        </div>
                        <input type="hidden" name="pageType" value="InvitedOnline,InvitedOffline">
                        <div class="layui-col-lg3 layui-col-md3">
                            <div class="layui-input-block">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" 
                                lay-submit 
                                lay-filter="activeregister_filter">搜索</span>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="activeregisterCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="activeregister_tabs"        
                            id="activeregister_tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">特殊邀请<span></span></li>
                                    <li>平台活动<span></span></li>
                                </ul>
                            </div>
                            <div style="display:flex;">
                                <div class="disN batchHandleClass">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="activeregister_batchDiscount">批量设置折扣</span>
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="activeregister_batchSubmit">批量提交</span>
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="activeregister_voucherTemplate">设置优惠券模板</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ztt-card-checkbox">
                    <div class="layui-form invitedCheckboxs">
                        <input type="checkbox" lay-filter="activeregister_checkboxs" title="在线" lay-skin="primary" value="InvitedOnline">
                        <input type="checkbox" lay-filter="activeregister_checkboxs" title="离线" lay-skin="primary"  value="InvitedOffline">
                    </div>
                    <div class="layui-form registerCheckboxs disN">
                        <input type="checkbox" lay-filter="activeregister_checkboxs" title="待报名" lay-skin="primary" value="available">
                        <input type="checkbox" lay-filter="activeregister_checkboxs" title="注册中" lay-skin="primary"  value="RegisteredInProgress">
                        <input type="checkbox" lay-filter="activeregister_checkboxs" title="注册完成" lay-skin="primary" value="RegisteredComplete">
                        <input type="checkbox" lay-filter="activeregister_checkboxs" title="在线" lay-skin="primary"  value="RegisteredOnline">
                        <input type="checkbox" lay-filter="activeregister_checkboxs" title="离线" lay-skin="primary" value="RegisteredOffline">
                    </div>  
                </div>
                <div class="layui-card-body">
                     <table class="layui-table" id="activeregister_table" 
                    lay-filter="activeregister_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格---处理状态 --%>
<script type="text/html" id="activeregister_status">
    <div>
        {{# if(d.lmsDealStatus==4){ }}
        处理失败
        {{# }else if(d.lmsDealStatus==3){ }}
        处理成功
        {{# }else if(d.lmsDealStatus==2){ }}
        处理中
        {{# }else if(d.lmsDealStatus==1){ }}
        待处理
        {{# }else if(d.lmsDealStatus ==5){ }}
        处理重试中
        {{# } }}
    </div>
</script>

<%-- 表格--平台状态 --%>
<script type="text/html" id="activeregister_platStatus">
    <div>
        {{# if(d.type== 'RegisteredOffline' || d.type== 'InvitedOffline'){ }}
        离线
        {{# }else if(d.type== 'RegisteredOnline' || d.type== 'InvitedOnline'){ }}
        在线
        {{# }else if(d.type== 'RegisteredComplete'){ }}
        注册完成
        {{# }else if(d.type== 'RegisteredInProgress'){ }}
        注册中
        {{# }else if(d.type== 'available'){ }}
        待报名
        {{# } }}
    </div>
</script>

<%-- 表格 --时间 --%>
<script type="text/html" id="activeregister_times">
    <div>
        {{Format(d.registerEndTime,'yyyy-MM-dd hh:mm:ss')}}
        <br>
        <div id="activeregisterIdNum{{d.id}}" class="activeregisterTimer">{{ countDownHandle(d.registerEndTime, d.id) }}</div>
    </div>
</script>

<%-- 表格---市场活动 --%>
<script type="text/html" id="activeregister_campaignName">
    <div>
        <div>{{d.campaignName.replace('/ /', '&nbsp;')}}</div>
        <div>
            <span>{{Format(d.sceneStartTime,'yyyy-MM-dd hh:mm:ss')}}</span>
            -
            <span>{{Format(d.sceneEndTime,'yyyy-MM-dd hh:mm:ss')}}</span>
        </div>
    </div>
</script>

<%-- 表格--修改人 --%>
<script type="text/html" id="activeregister_editPerson">
    <div>{{d.operationUserName}}</div>
    <div>{{Format(d.operationTime,'yyyy-MM-dd hh:mm:ss')}}</div>
</script>

<%-- 表格(特殊邀请)---操作 --%>
<script type="text/html" id="activeregister_toolbar">
    <div class="alignLeft">
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="mark">标记完成</span>
    </div>
</script>

<%-- 表格(平台活动)---操作 --%>
<script type="text/html" id="activeregister_toolbar2">
    <div class="alignLeft">
        {{# if(d.lmsDealStatus == 1){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="discount">设置折扣</span>
        <br>
        {{# } }}

        {{# if(d.lmsDealStatus == 1){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="submit">提交</span>
        <br>
        {{# } }}
        {{# if(d.lmsDealStatus == 1 || d.lmsDealStatus == 2 || d.lmsDealStatus == 4){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="mark">标记完成</span>
        <br>
        {{# } }}
        {{# if(d.lmsDealStatus == 4 || d.platStatus == 'Registration in Progress'){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="submit">重新提交</span>
        <br>
        {{# } }}
        

        {{# if(d.downLoadUpdateExcelUrl){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="download">下载</span>
        <br>
        {{# } }}


        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="journal">日志</span>
    </div>
</script>

<%-- 弹框---日志详情 --%>
<script type="text/html" id="activeregister_logsTable">
    <div style="padding:20px;">
        <table class="layui-table">
            <thead>
                <tr>
                    <th>活动ID</th>
                    <th>创建人</th>
                    <th>创建时间</th>
                    <th>修改时间</th>
                    <th>操作结果</th>
                </tr>
            </thead>
            <tbody id="activeregister_logsTbody"></tbody>
        </table>
    </div>
</script>

<script type="text/html" id="activeregister_logsTbodyTpl">
    {{#  layui.each(d, function(index, item){ }}
    <tr>
        <td>{{item.sceneId}}</td>
        <td>{{item.creator}}</td>
        <td>{{Format(item.createTime,'yyyy-MM-dd hh:mm:ss')}}</td>
        <td>{{Format(item.modifyTime,'yyyy-MM-dd hh:mm:ss')}}</td>
        <td>{{item.operationResult}}</td>
    </tr>
    {{#　})　}}
</script>

<%-- 弹框---设置优惠券模板 --%>
<script type="text/html" id="activeregister_voucherTemplateLayer">
 <div class="p20">
    <div class="layui-col-lg12 layui-col-md12">
        <form class="layui-form" id="activeregister_voucherForm">
        <div class="layui-form-item">
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label"><font color="#ff0000">*</font> Discount Type</label>
                <div class="layui-input-block">
                    <select lay-filter="activeregister_voucher_discountType" name="discountType" lay-verify="required" required>
                        <option value="1">Money Value Voucher</option>
                        <option value="2">Percentage Value Voucher</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label"><font color="#ff0000">*</font>Discount Value (off)</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="discountValue" lay-verify="required" required>
                </div>
            </div>
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label"><font color="#ff0000">*</font>Voucher Name</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="voucherName" lay-verify="required" required>
                </div>
            </div>
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label"><font color="#ff0000">*</font>Minimum Spend</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="minimumSpend" lay-verify="required" required>
                </div>
            </div>
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label"><font color="#ff0000">*</font>Total Issued Number</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" lay-verify="required" name="canRedeemedCount" required>
                </div>
            </div>
            <div class="layui-col-lg6 layui-col-md6 activeregisterOpacity activeregisterMaxDiscountValue">
                <label class="layui-form-label">Maximum Discounted Value</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="maxDiscountValue">
                </div>
            </div>
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label"><font color="#ff0000">*</font>Usage Limit Per Customer</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" lay-verify="required" name="usageLimit" required>
                </div>
            </div>
        </div>
        </form>
    </div>
 </div>
</script>
















<script src="${ctx}/static/js/publishs/lazada/activeregister.js"></script>