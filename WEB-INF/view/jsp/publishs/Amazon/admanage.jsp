<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>广告管理</title>

<style>
    .noHasCpc {
        color: #2E8B57;
        cursor:pointer;
    }
    .hasCpc {
        color: #009688;
        cursor:pointer;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="admanage_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select 
                                        id="admanage_depart_sel" 
                                        lay-search 
                                        lay-filter="admanage_depart_sel" 
                                        class="orgs_hp_custom">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select 
                                        id="admanage_salesman_sel" 
                                        lay-search 
                                        lay-filter="admanage_salesman_sel" 
                                        class="users_hp_custom" 
                                        data-rolelist="amazon专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select 
                                        id="admanage_store_sel" 
                                        lay-filter="admanage_store_sel" 
                                        xm-select="admanage_store_sel" 
                                        class="users_hp_store_multi store_hp_custom" 
                                        xm-select-search
                                        name="storeIds"
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                        data-platcode="amazon">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select 
                                        id="admanage_site" 
                                        lay-search
                                        name="siteId"
                                        lay-filter="admanage_site">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">推广类型</label>
                                <div class="layui-input-block">
                                    <select lay-search name="sponsoredType">
                                        <option value="SPONSORED_PRODUCT">商品推广</option>
                                        <option value="SPONSORED_BRAND">品牌推广</option>
                                        <option value="SPONSORED_DISPLAY">展示推广</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">统计时间</label>
                                <div class="layui-input-block">
                                    <input name="times" id="admanage_times" readonly class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">广告组合</label>
                                <div class="layui-input-block">
                                    <div id="admange_combination"></div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">广告活动</label>
                                <div class="layui-input-block">
                                    <div id="admange_activity"></div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">活动投放</label>
                                <div class="layui-input-block">
                                    <select lay-search name="state">
                                        <option value="enabled">正在投放</option>
                                        <option value="paused">已暂停</option>
                                        <option value="archived">已归档</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">投放类型</label>
                                <div class="layui-input-block">
                                    <select lay-search name="targetingType">
                                        <option value="">全部</option>
                                        <option value="auto">自动投放</option>
                                        <option value="manual">手动投放</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">CPC专员</label>
                                <div class="layui-input-block">
                                    <select lay-search name="cpcPersonId" id="admanage_cpcPersonId">
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" value="1" name="pageType">
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <span 
                                    class="layui-btn layui-btn-sm layui-btn-normal" 
                                    lay-submit 
                                    lay-filter="admanage_filter">查询</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type='reset'>清空</button>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <p style="color: red;float: right;">* 仅支持查询最近2个月的数据</p>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="admanageCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="admanage_tabs"        
                            id="admanage_tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">广告活动<span></span></li>
                                    <li>广告组<span></span></li>
                                </ul>
                            </div>
                            <div style="display:flex;">
                                <permTag:perm funcCode="admanage_batch">
                                <div class="layui-form">
                                    <select name="admanage_batch_select" lay-filter="admanage_batch_select">
                                        <option value="">批量编辑</option>
                                        <option value="1">批量启动</option>
                                        <option value="2">批量暂停</option>
                                        <option value="3">批量归档</option>
                                    </select>
                                </div>
                                </permTag:perm>
                                <span class="layui-btn layui-btn-sm layui-btn-primary" id="admanage_syscActivityBtn">同步广告活动</span>
                                <span class="layui-btn layui-btn-sm layui-btn-primary" id="admanage_syscGroupBtn">同步广告组</span>
                                <span class="layui-btn layui-btn-sm layui-btn-primary" id="admanage_ExportExcelBtn">导出Excel</span>
                                <%-- <span class="layui-btn layui-btn-sm layui-btn-primary">+创建广告活动</span> --%>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table" id="admanage_table" 
                    lay-filter="admanage_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格-广告组合/活动 --%>
<script type="text/html" id="admanage_adInfo">
    <div class="alignLeft">
        <div><strong>{{d.portfolioName || ''}}</strong></div>
        <div><strong>{{d.campaignName || ''}}</strong></div>
    </div>
</script>

<%-- 表格-投放时间/投放策略 --%>
<script type="text/html" id="admanage_strategy">
    <div class="alignLeft">
        <div>{{d.startDate}} <span>-</span> {{d.endDate}}</div>
        <div>{{d.strategy}} </div>
    </div>
</script>

<%-- 表格-同步时间和CPC会员 --%>
<script type="text/html" id="admanage_syncAndCPC">
    <div class="alignLeft">
        <div>{{Format(d.syncTime,'yyyy-MM-dd hh:mm:ss')}}</div>
        {{# if(d.cpcPersonName){ }}
        <%-- <div class="hasCpc" lay-event="setActiHasCpc">{{d.cpcPersonName}}</div> --%>
        <div>{{d.cpcPersonName}}</div>
        {{# }else{ }}
        <%-- <div class="noHasCpc" lay-event="setActiCpc">设置CPC专员</div> --%>
        {{# } }}
    </div>
</script>

<%-- 弹框---设置广告活动CPC专员 --%>
<script type="text/html" id="admanage_CpcActivityLayer">
    <div class="layui-form" style="padding: 20px 40px 0 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">CPC专员</label>
            <div class="layui-input-block">
                <select 
                    id="admanage_CpcActivity_sel" 
                    lay-search 
                    lay-filter="admanage_CpcActivity_sel">
                </select>
            </div>
        </div>
        <div class="layui-form-item" id="admanage_CpcActivityShow">
            <div class="layui-input-block">
                <input type="checkbox" 
                    id="admanage_CpcActivity_cks" 
                    title="此活动下所有广告组的CPC专员为空时,应用此CPC专员" 
                    lay-skin="primary"
                > 
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="ad_tabletemplet_type">
    <permTag:perm funcCode="admanage_batch">
        <div class="layui-form-item">
            {{# if(d.state == "enabled"){ }}
            <input type="checkbox" lay-skin="switch" lay-filter="ad_tabletemplet_state" value="{{d.campaignId}}" data-name="{{d.campaignName}}" checked>
            {{# }else if(d.state == "paused"){ }}
            <input type="checkbox" lay-skin="switch" lay-filter="ad_tabletemplet_state" value="{{d.campaignId}}" data-name="{{d.campaignName}}">
            {{# }else if(d.state == "archived"){ }}
            已归档
            {{# } }}
        </div>
    </permTag:perm>
    <permTag:lacksPerm funcCode="admanage_batch">
        <div class="layui-form-item">
            {{# if(d.state == "enabled"){ }}
            <input type="checkbox" lay-skin="switch" lay-filter="ad_tabletemplet_state" value="{{d.campaignId}}" data-name="{{d.campaignName}}" checked disabled>
            {{# }else if(d.state == "paused"){ }}
            <input type="checkbox" lay-skin="switch" lay-filter="ad_tabletemplet_state" value="{{d.campaignId}}" data-name="{{d.campaignName}}" disabled>
            {{# }else if(d.state == "archived"){ }}
            已归档
            {{# } }}
        </div>
    </permTag:lacksPerm>
</script>


<script src="${ctx}/static/js/publishs/amazon/admanage.js"></script>
<script src="${ctx}/static/components/lodash.js"></script>
