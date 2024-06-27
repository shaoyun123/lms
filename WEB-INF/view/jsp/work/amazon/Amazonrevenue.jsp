<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>Amazon营收</title>
<style type="text/css">
    #LAY-amazonreenue .layTitle:hover::after {
        width: 250px;
    }
    #amazon_revenue_data_table tbody td {
        word-break: break-all; 
        word-wrap:break-word;
    }
</style>
<div class="layui-fluid" id="LAY-amazonreenue">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="amazonreenue_search_form" lay-filter="amazonreenue_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonOrgId" id="amazonreenue_online_depart_sel" lay-search
                                        lay-filter="amazonreenue_online_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonId" id="amazonreenue_online_salesman_sel" lay-search
                                        lay-filter="amazonreenue_online_salesman_sel" class="users_hp_custom"
                                        data-rolelist="amazon专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="amazonreenue_online_store_sel"
                                        lay-filter="amazonreenue_online_store_sel"
                                        xm-select="amazonreenue_online_store_sel" class="users_hp_store_multi"
                                        xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                        data-platcode="amazon" name="storeAcctIdList"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="siteIdList" 
                                        id="amazonreenuesiteIdList"
                                        lay-filter="amazonreenuesiteIdList" 
                                        xm-select="amazonreenuesiteIdList"
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                        xm-select-search
                                        xm-select-type="1">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">入账日期</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="amazonreenue_postedDateStr" name="postedDateStr">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-lg2">
                                <button type="button" style="margin-left: 50px;" class="layui-btn" type="submit"
                                    lay-submit="" lay-filter="search_btn" id="amazonreenue_search_btn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="amazonreenue_reset">清空</button>
                            
                            </div>
                            <input type="hidden" id="amazonreenue_operateType" value="0">
                        </div>
                    </form>
                </div>
            </div>
            <!-- tab切换 -->
            <div class="layui-card">
                <div class="layui-tab layui-card-header " id="amazonreenue_data_count_tab" lay-filter="amazonreenue_data_count_tab">
                    <ul class="layui-tab-title fl">
                        <li class="layui-this" onclick="RevenueType(0)">店铺（FBM）</li>
                        <li onclick="RevenueType(1)">销售（FBM）</li>
                        <li onclick="RevenueType(2)">店铺（FBA）</li>
                        <li onclick="RevenueType(3)">销售（FBA）</li>
                    </ul>
                </div>
                <div  class="layui-card-body">
                    <div id="amazon_revenue_data_table"  class="layui-card-body"></div>
                </div>
                <div id="amazon_revenue_page_pagination" class="customPagination"></div>
            </div>



        </div>
    </div>
</div>


<%-- 销售FBA --%>
<script type="text/html" id="amazon_revenue_sale_fba">
    <table class="layui-table" style="table-layout: fixed">
        <thead>
        <tr>
            <td>ASIN销售员</td>
            <td>店铺名</td>
            <td>订单数</td>
            <td>销售额($)</td>
            <td>客单价($)</td>
            <td>退款订单数</td>
            <td>退款金额($)</td>
            <td>退款率</td>
            <td>FBA收益($)<i class="layui-icon layui-icon-tips layTitle" lay-title="FBA清算收益+FBA调整收益"></i></td>
            <td>促销费($)<i class="layui-icon layui-icon-tips layTitle" lay-title="秒杀+早期评论者+优惠券兑换费"></i></td>
            <td>广告费($)</td>
            <td>月租费($)</td>
            <td>FBA退货费($)</td>
            <td>FBA仓储费($)</td>
            <td>FBA派送费($)</td>
            <td>平台成交费($)</td>
            <td>FBA报损(￥)<i class="layui-icon layui-icon-tips layTitle" lay-title="FBA移除订单费+弃置商品成本+弃置头程运费"></i>
            </td>
            <td>商品成本(￥)</td>
            <td>头程物流成本(￥)</td>
            <td>包装成本(￥)</td>
            <td>实收利润(￥)</td>
            <td>实收利润率</td>
            <td>库存总金额(￥)</td>
            <td>大于90天库存总金额(￥)</td>
            <td>站外营销费(￥)</td>
            <td>VAT费用</td>
        </tr>
        </thead>
        <tbody style="text-align: center">

        {{each data v vIndex }}
        {{ if (v.salePersonList != null)  }}

        {{ if (v.salePersonList.totalData  != null)  }}
        <tr>
            <td>
                {{ v.salePersonName }}
            </td>
            <td onclick="RevenueDetailClick(this,'{{ vIndex }}')">
                <div style="color: #009688">详情
                    <div>
            </td>
            <td>{{ v.salePersonList.totalData.orderNum}}</td>
            <td>{{ v.salePersonList.totalData.salesAmount}}</td>
            <td>{{ v.salePersonList.totalData.unitAmount}}</td>
            <td>{{ v.salePersonList.totalData.refundOrderNum}}</td>
            <td>{{ v.salePersonList.totalData.refundAmount}}</td>
            <td>{{ v.salePersonList.totalData.refundRate}}%</td>
            <td>{{ v.salePersonList.totalData.fbaIncome}}</td>
            <td>{{ v.salePersonList.totalData.promotionAmount}}</td>
            <td>{{ v.salePersonList.totalData.adAmount}}</td>
            <td>{{ v.salePersonList.totalData.subscriptionAmount}}</td>
            <td>{{ v.salePersonList.totalData.fbaReturnStoreAmount}}</td>
            <td>{{ v.salePersonList.totalData.fbaStorageAmount}}</td>
            <td>{{ v.salePersonList.totalData.fbaDeliveryAmount}}</td>
            <td>{{ v.salePersonList.totalData.platSellingAmount}}</td>
            <td>{{ v.salePersonList.totalData.fbaDamagedAmount}}</td>
            <td>{{ v.salePersonList.totalData.goodsCost}}</td>
            <td>{{ v.salePersonList.totalData.logisticsAmount}}</td>
            <td>{{ v.salePersonList.totalData.packageAmount}}</td>
            <td>{{ v.salePersonList.totalData.profit}}</td>
            <td>{{ v.salePersonList.totalData.profitRate}}</td>
            <td>{{ v.salePersonList.totalData.fbaStockAllAmount}}</td>
            <td>{{ v.salePersonList.totalData.fbaMoreThan90DaysStockAllAmount}}</td>
            <td>{{ v.salePersonList.totalData.offSiteMarketingAmount }}</td>
            <td>{{ v.salePersonList.totalData.vatAmount }}</td>
        </tr>
        {{ /if }}

        {{ if (v.salePersonList.details  != null)  }}
        {{ each v.salePersonList.details sd sdIndex }}

        {{ if (sd.storeList  != null)  }}
        {{ each sd.storeList sds sdsIndex}}

        <tr data-index="{{vIndex}}" hidden>
            <td first-children-td="first_{{vIndex}}">{{ v.salePersonName }}</td>
            <td>{{ sds.storeName }}({{sds.siteCode}})</td>
            <td>{{ sds.orderNum}}</td>
            <td>{{ sds.salesAmount}}</td>
            <td>{{ sds.unitAmount}}</td>
            <td>{{ sds.refundOrderNum}}</td>
            <td>{{ sds.refundAmount}}</td>
            <td>{{ sds.refundRate}}%</td>
            <td>{{ sds.fbaIncome}}</td>
            <td>{{ sds.promotionAmount}}</td>
            <td>{{ sds.adAmount}}</td>
            <td>{{ sds.subscriptionAmount}}</td>
            <td>{{ sds.fbaReturnStoreAmount}}</td>
            <td>{{ sds.fbaStorageAmount}}</td>
            <td>{{ sds.fbaDeliveryAmount}}</td>
            <td>{{ sds.platSellingAmount}}</td>
            <td>{{ sds.fbaDamagedAmount}}</td>
            <td>{{ sds.goodsCost}}</td>
            <td>{{ sds.logisticsAmount}}</td>
            <td>{{ sds.packageAmount}}</td>
            <td>{{ sds.profit}}</td>
            <td>{{ sds.profitRate}}</td>
            <td>{{ sds.fbaStockAllAmount}}</td>
            <td>{{ sds.fbaMoreThan90DaysStockAllAmount}}</td>
            <td>{{ sds.offSiteMarketingAmount }}</td>
            <td>{{ sds.vatAmount }}</td>
        </tr>
        {{ /each }}
        {{ /if }}

        {{ /each }}
        {{ /if }}

        {{ /if }}
        {{ /each }}
        </tbody>
    </table>
</script>
<%--店铺FBA--%>
<script type="text/html" id="amazon_revenue_store_fba">
    <table class="layui-table" style="table-layout: fixed">
        <thead>
        <tr>
            <td>店铺名</td>
            <td>站点</td>
            <td>店铺销售员</td>
            <td>订单数</td>
            <td>销售额($)</td>
            <td>客单价($)</td>
            <td>退款订单数</td>
            <td>退款金额($)</td>
            <td>退款率</td>
            <td>FBA收益($)<i class="layui-icon layui-icon-tips layTitle" lay-title="FBA清算收益+FBA调整收益"></i></td>
            <td>促销费($)<i class="layui-icon layui-icon-tips layTitle" lay-title="秒杀+早期评论者+优惠券兑换费"></i></td>
            <td>广告费($)</td>
            <td>月租费($)</td>
            <td>FBA退货费($)</td>
            <td>FBA仓储费($)</td>
            <td>FBA派送费($)</td>
            <td>平台成交费($)</td>
            <td>FBA报损(￥)<i class="layui-icon layui-icon-tips layTitle" lay-title="FBA移除订单费+弃置商品成本+弃置头程运费"></i></td>
            <td>商品成本(￥)</td>
            <td>头程物流成本(￥)</td>
            <td>包装成本(￥)</td>
            <td>实收利润(￥)</td>
            <td>实收利润率</td>
            <td>库存总金额(￥)</td>
            <td>大于90天库存总金额(￥)</td>
            <td>站外营销费(￥)</td>
            <td>VAT费用</td>
        </tr>
        </thead>
        <tbody >

        {{each data v vIndex }}
        {{ if(v.storeList  != null)  }}

        {{ if(v.storeList.totalData  != null)  }}
        <tr>
            <td>
                {{ v.storeName }}
            </td>
            <td onclick="RevenueDetailClick(this,'{{ vIndex }}')">
                <div style="color: #009688">详情
                    <div>
            </td>
            <td>{{ v.storeList.totalData.salesPersonName}}</td>
            <td>{{ v.storeList.totalData.orderNum}}</td>
            <td>{{ v.storeList.totalData.salesAmount}}</td>
            <td>{{ v.storeList.totalData.unitAmount}}</td>
            <td>{{ v.storeList.totalData.refundOrderNum}}</td>
            <td>{{ v.storeList.totalData.refundAmount}}</td>
            <td>{{ v.storeList.totalData.refundRate}}%</td>
            <td>{{ v.storeList.totalData.fbaIncome}}</td>
            <td>{{ v.storeList.totalData.promotionAmount}}</td>
            <td>{{ v.storeList.totalData.adAmount}}</td>
            <td>{{ v.storeList.totalData.subscriptionAmount}}</td>
            <td>{{ v.storeList.totalData.fbaReturnStoreAmount}}</td>
            <td>{{ v.storeList.totalData.fbaStorageAmount}}</td>
            <td>{{ v.storeList.totalData.fbaDeliveryAmount}}</td>
            <td>{{ v.storeList.totalData.platSellingAmount}}</td>
            <td>{{ v.storeList.totalData.fbaDamagedAmount}}</td>
            <td>{{ v.storeList.totalData.goodsCost}}</td>
            <td>{{ v.storeList.totalData.logisticsAmount}}</td>
            <td>{{ v.storeList.totalData.packageAmount}}</td>
            <td>{{ v.storeList.totalData.profit}}</td>
            <td>{{ v.storeList.totalData.profitRate}}</td>
            <td>{{ v.storeList.totalData.fbaStockAllAmount}}</td>
            <td>{{ v.storeList.totalData.fbaMoreThan90DaysStockAllAmount}}</td>
            <td>{{ v.storeList.totalData.offSiteMarketingAmount}}</td>
            <td>{{ v.storeList.totalData.vatAmount}}</td>
        </tr>
        {{ /if }}

        {{ if(v.storeList.details  != null)  }}
        {{ each v.storeList.details sd sdIndex }}

        {{ if(sd.siteList  != null)  }}
        {{ each sd.siteList ss ssIndex}}

        <tr data-index="{{vIndex}}" hidden>
            <td first-children-td="first_{{vIndex}}">{{ v.storeName }}</td>
            <td>{{ ss.siteCode }}</td>
            <td>{{ ss.salesPersonName}}</td>
            <td>{{ ss.orderNum}}</td>
            <td>{{ ss.salesAmount}}</td>
            <td>{{ ss.unitAmount}}</td>
            <td>{{ ss.refundOrderNum}}</td>
            <td>{{ ss.refundAmount}}</td>
            <td>{{ ss.refundRate}}%</td>
            <td>{{ ss.fbaIncome}}</td>
            <td>{{ ss.promotionAmount}}</td>
            <td>{{ ss.adAmount}}</td>
            <td>{{ ss.subscriptionAmount}}</td>
            <td>{{ ss.fbaReturnStoreAmount}}</td>
            <td>{{ ss.fbaStorageAmount}}</td>
            <td>{{ ss.fbaDeliveryAmount}}</td>
            <td>{{ ss.platSellingAmount}}</td>
            <td>{{ ss.fbaDamagedAmount}}</td>
            <td>{{ ss.goodsCost}}</td>
            <td>{{ ss.logisticsAmount}}</td>
            <td>{{ ss.packageAmount}}</td>
            <td>{{ ss.profit}}</td>
            <td>{{ ss.profitRate}}</td>
            <td>{{ ss.fbaStockAllAmount}}</td>
            <td>{{ ss.fbaMoreThan90DaysStockAllAmount}}</td>
            <td>{{ ss.offSiteMarketingAmount}}</td>
            <td>{{ ss.vatAmount}}</td>
        </tr>
        {{ /each }}
        {{ /if }}

        {{ /each }}
        {{ /if }}

        {{ /if }}
        {{ /each }}
        </tbody>
    </table>
</script>
<%--销售FBM--%>
<script type="text/html" id="amazon_revenue_sale_fbm">
    <table class="layui-table" style="table-layout: fixed">
        <thead>
        <tr>
            <td>ASIN销售员</td>
            <td>店铺名</td>
            <td>订单数</td>
            <td>销售额($)</td>
            <td>客单价($)</td>
            <td>退款订单数</td>
            <td>退款金额($)</td>
            <td>退款率</td>
            <td>促销费($)<i class="layui-icon layui-icon-tips layTitle" lay-title="秒杀+早期评论者+优惠券兑换费"></i></td>
            <td>广告费($)</td>
            <td>平台成交费($)</td>
            <td>月租费($)</td>
            <td>商品成本(￥)</td>
            <td>物流成本(￥)</td>
            <td>包装成本(￥)</td>
            <td>站外营销费(￥)</td>
            <td>实收利润(￥)</td>
            <td>实收利润率</td>
            <td>VAT费用(￥)</td>
        </tr>
        </thead>
        <tbody >

        {{each data v vIndex }}

        {{ if (v.salePersonList!= null) }}
        {{ if (v.salePersonList.totalData != null )}}
        <tr>
            <td>{{ v.salePersonName }} </td>
            <td onclick="RevenueDetailClick(this,'{{ vIndex }}')"><div style="color: #009688">详情<div></td>
            <td>{{ v.salePersonList.totalData.orderNum}}</td>
            <td>{{ v.salePersonList.totalData.salesAmount}}</td>
            <td>{{ v.salePersonList.totalData.unitAmount}}</td>
            <td>{{ v.salePersonList.totalData.refundOrderNum}}</td>
            <td>{{ v.salePersonList.totalData.refundAmount}}</td>
            <td>{{ v.salePersonList.totalData.refundRate}}%</td>
            <td>{{ v.salePersonList.totalData.promotionAmount}}</td>
            <td>{{ v.salePersonList.totalData.adAmount}}</td>
            <td>{{ v.salePersonList.totalData.platSellingAmount}}</td>
            <td>{{ v.salePersonList.totalData.subscriptionAmount}}</td>
            <td>{{ v.salePersonList.totalData.goodsCost}}</td>
            <td>{{ v.salePersonList.totalData.logisticsAmount}}</td>
            <td>{{ v.salePersonList.totalData.packageAmount}}</td>
            <td>{{ v.salePersonList.totalData.offSiteMarketingAmount}}</td>
            <td>{{ v.salePersonList.totalData.profit}}</td>
            <td>{{ v.salePersonList.totalData.profitRate}}</td>
            <td>{{ v.salePersonList.totalData.vatAmount}}</td>
        </tr>
        {{ /if }}

        {{ if(v.salePersonList.details!= null) }}
        {{ each v.salePersonList.details sd sdIndex }}

        {{ if (sd.storeList != null )}}
        {{ each sd.storeList ss ssIndex}}

        <tr data-index="{{vIndex}}" hidden>
            <td first-children-td="first_{{vIndex}}">{{ v.salePersonName }}</td>
            <td>{{ss.storeName}}({{ss.siteCode}})</td>
            <td>{{ ss.orderNum}}</td>
            <td>{{ ss.salesAmount}}</td>
            <td>{{ ss.unitAmount}}</td>
            <td>{{ ss.refundOrderNum}}</td>
            <td>{{ ss.refundAmount}}</td>
            <td>{{ ss.refundRate}}%</td>
            <td>{{ ss.promotionAmount}}</td>
            <td>{{ ss.adAmount}}</td>
            <td>{{ ss.platSellingAmount}}</td>
            <td>{{ ss.subscriptionAmount}}</td>
            <td>{{ ss.goodsCost}}</td>
            <td>{{ ss.logisticsAmount}}</td>
            <td>{{ ss.packageAmount}}</td>
            <td>{{ ss.offSiteMarketingAmount}}</td>
            <td>{{ ss.profit}}</td>
            <td>{{ ss.profitRate}}</td>
            <td>{{ ss.vatAmount}}</td>
        </tr>
        {{ /each }}
        {{ /if }}

        {{ /each }}
        {{ /if }}

        {{ /if }}
        {{ /each }}
        </tbody>
    </table>
</script>
<%--店铺FBM--%>
<script type="text/html" id="amazon_revenue_store_fbm">
    <table class="layui-table" style="table-layout: fixed">
        <thead>
        <tr>
            <td>店铺名</td>
            <td>站点</td>
            <td>店铺销售员</td>
            <td>订单数</td>
            <td>销售额($)</td>
            <td>客单价($)</td>
            <td>退款订单数</td>
            <td>退款金额($)</td>
            <td>退款率</td>
            <td>促销费($)<i class="layui-icon layui-icon-tips layTitle" lay-title="秒杀+早期评论者+优惠券兑换费"></i></td>
            <td>广告费($)</td>
            <td>平台成交费($)</td>
            <td>月租费($)</td>
            <td>商品成本(￥)</td>
            <td>物流成本(￥)</td>
            <td>包装成本(￥)</td>
            <td>站外营销费(￥)</td>
            <td>实收利润(￥)</td>
            <td>实收利润率</td>
            <td>VAT费用</td>
        </tr>
        </thead>
        <tbody>

        {{each data v vIndex }}

        {{ if(v.storeList != null) }}

        {{ if(v.storeList.totalData != null) }}
        <tr>
            <td>{{ v.storeName }} </td>
            <td onclick="RevenueDetailClick(this,'{{ vIndex }}')"><div style="color: #009688">详情<div></td>
            <td>{{ v.storeList.totalData.salesPersonName}}</td>
            <td>{{ v.storeList.totalData.orderNum}}</td>
            <td>{{ v.storeList.totalData.salesAmount}}</td>
            <td>{{ v.storeList.totalData.unitAmount}}</td>
            <td>{{ v.storeList.totalData.refundOrderNum}}</td>
            <td>{{ v.storeList.totalData.refundAmount}}</td>
            <td>{{ v.storeList.totalData.refundRate}}%</td>
            <td>{{ v.storeList.totalData.promotionAmount}}</td>
            <td>{{ v.storeList.totalData.adAmount}}</td>
            <td>{{ v.storeList.totalData.platSellingAmount}}</td>
            <td>{{ v.storeList.totalData.subscriptionAmount}}</td>
            <td>{{ v.storeList.totalData.goodsCost}}</td>
            <td>{{ v.storeList.totalData.logisticsAmount}}</td>
            <td>{{ v.storeList.totalData.packageAmount}}</td>
            <td>{{ v.storeList.totalData.offSiteMarketingAmount}}</td>
            <td>{{ v.storeList.totalData.profit}}</td>
            <td>{{ v.storeList.totalData.profitRate}}</td>
            <td>{{ v.storeList.totalData.vatAmount}}</td>
        </tr>
        {{ /if }}

        {{ if(v.storeList.details!= null) }}
        {{ each v.storeList.details sd sdIndex }}

        {{ if(sd.siteList!= null) }}
        {{ each sd.siteList ss ssIndex}}

        <tr data-index="{{vIndex}}" hidden>
            <td first-children-td="first_{{vIndex}}">{{ v.storeName }}</td>
            <td>{{ss.siteName }}</td>
            <td>{{ ss.salesPersonName}}</td>
            <td>{{ ss.orderNum}}</td>
            <td>{{ ss.salesAmount}}</td>
            <td>{{ ss.unitAmount}}</td>
            <td>{{ ss.refundOrderNum}}</td>
            <td>{{ ss.refundAmount}}</td>
            <td>{{ ss.refundRate}}%</td>
            <td>{{ ss.promotionAmount}}</td>
            <td>{{ ss.adAmount}}</td>
            <td>{{ ss.platSellingAmount}}</td>
            <td>{{ ss.subscriptionAmount}}</td>
            <td>{{ ss.goodsCost}}</td>
            <td>{{ ss.logisticsAmount}}</td>
            <td>{{ ss.packageAmount}}</td>
            <td>{{ ss.offSiteMarketingAmount}}</td>
            <td>{{ ss.profit}}</td>
            <td>{{ ss.profitRate}}</td>
            <td>{{ ss.vatAmount}}</td>
        </tr>
        {{ /each }}
        {{ /if }}

        {{ /each }}
        {{ /if }}

        {{ /if }}
        {{ /each }}
        </tbody>
    </table>
</script>
<script src="${ctx}/static/js/work/amazon/amazonrevenue.js"></script>
