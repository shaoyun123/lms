<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>lazada账号表现</title>
        <style>
            .border_b {
                border-bottom: 1px solid #e6e6e6;
            }

            .border_all {
                border: 1px solid #e6e6e6;
            }

            a.shopId {
                color: #428bca;
            }

            .ml_20 {
                margin-left: 20px;
            }

            td {
                text-align: center;
            }

            .w_95 {
                width: 95% !important;
            }

            img.lazada_imgCss {
                width: auto;
                height: auto;
                max-width: 100%;
                max-height: 100%;
                padding: 1px;
                margin: auto;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                position: absolute;
            }

            .fr {
                float: right !important;
            }

            .accRed {
                color: #FF5722;
                font-size: 14px
            }

            .accGreen {
                color: green;
                font-size: 14px
            }

            .w_50 {
                width: 50%;
            }

            .point_st {
                cursor: pointer;
            }

            .m_10 {
                margin: 10px;
            }

            .chooseimg_row {
                margin-top: 15px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-left: 110px;
                vertical-align: middle;
            }

            #div_prev {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                vertical-align: middle;
            }

            .w_100 {
                width: 100px !important;
            }

            .img img {
                width: 60px;
                height: 60px;
                border: 1px solid #ccc;
                margin-right: 5px;
            }

            .showimg {
                width: 500px;
                height: 500px;
                border: 1px solid #ccc
            }

            .close {
                position: relative;
                display: inline-block;
                right: 10px;
                top: -28px;
                width: 15px;
                height: 15px;
                border-radius: 15px;
                background: #ccc;
                color: #000;
                line-height: 15px;
                opacity: .5;
                text-align: center;
                cursor: pointer;
            }

            .close:hover {
                background: #aaa;
                font-size: 14px;
            }

            .icon_font {
                font-size: 36px;
                opacity: .5;
                cursor: pointer;
                color: #4e4e4e;
            }
        </style>
        <div class="layui-fluid">
            <div class="layui-col-md12 layui-col-lg12" id="lazaadaaccplay_report">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" lay-filter="component-form-group" id="lazada_acctperf_searchForm">
                            <div class="layui-form-item">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select name="departId" lay-search lay-filter="lazada_accer_depart_sel"
                                            class="orgs_hp_custom">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">销售人员</label>
                                    <div class="layui-input-block">
                                        <select name="salesmanId" lay-search class="users_hp_custom"
                                            data-rolelist="lazada专员" lay-filter="lazada_online_sp_sel">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
<%--                                        <select name="storeId" lay-search lay-filter="lazada_accer_store_sel"--%>
<%--                                            class="store_hp_custom" data-platcode="lazada">--%>
<%--                                            <option value=""></option>--%>
<%--                                        </select>--%>
                                        <div name="storeId" data-platcode="lazada" xm-select="lazada_accperformance_store" class="store_hp_custom" id="lazada_accperformance_store"></div>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">站点</label>
                                    <div class="layui-input-block">
                                        <select name="salesSite" id="accperformanceSalesSite" lay-search>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">主管</label>
                                    <div class="layui-input-block">
                                        <select id="lazada_accer_customServicer_sel" name="supervisorId"
                                            lay-search></select>
                                    </div>
                                </div>
<%--                                <div class="layui-col-lg2 layui-col-md2">--%>
<%--                                    <label class="layui-form-label">店铺额度</label>--%>
<%--                                    <div class="layui-input-block">--%>
<%--                                        <select name="storeListing" lay-search>--%>
<%--                                            <option value="">请选择</option>--%>
<%--                                            <option value="100">100</option>--%>
<%--                                            <option value="500">500</option>--%>
<%--                                            <option value="1500">1500</option>--%>
<%--                                            <option value="5000">5000</option>--%>
<%--                                            <option value="50000">50000</option>--%>
<%--                                        </select>--%>
<%--                                    </div>--%>
<%--                                </div>--%>

                                <div class="layui-col-md2 layui-col-lg2" style="padding-left: 20px">
                                    <button type="button" class="layui-btn layui-btn-sm"
                                        id="lazada_acctperf_search">查询</button>
                                    <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary"
                                        id="lazada_acctperf_search_reset">清空</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-tab table_tab" lay-filter="lazada_acctperf_tab">
                            <div class="disFCenter">
                                <ul class="layui-tab-title layui-card-header" style="display:inline-block;">
                                    <li class="layui-this" data-title="acc_Performance">账号表现(<span
                                            id="lazada_acctperf_dataCount_num1"></span>)</li>
                                    <!-- <li data-title="store_Info">店铺信息(<span id="lazada_acctperf_dataCount_num2"></span>)
                                    </li>
                                    <li data-title="store_rate">店铺达标率统计(<span id="lazada_acctperf_dataCount_num3"></span>)
                                    </li> -->
                                </ul>
                                <!-- <div class="layui-col-md2 layui-col-lg2"><button type="button"
                                        class="layui-btn layui-btn-sm" id="lazada_acctperf_exportBtn">导出表格</button>
                                </div> -->
                            </div>
                            <div class="layui-tab-content">
                                <div class="layui-tab-item  layui-show">
                                    <table class="layui-table" id="lazada_acctperf_data_table"
                                        lay-filter="lazada_acctperf_data_table">
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

<!--Store Performance penaltyPoint（≤10） 总罚分超过10则字体标红，≤10则标绿-->
<script type="text/html" id="lazada_acctperf_penaltyPoint">
    {{# if(d.storePerformancePenaltyPoint != null && d.storePerformancePenaltyPoint != undefined){ }}
    {{# if(d.storePerformancePenaltyPoint > 10){ }}
        <span class="fRed">{{d.storePerformancePenaltyPoint}}</span>
    {{# }else if(d.storePerformancePenaltyPoint <= 10){ }}
        <span class="fGreen"> {{d.storePerformancePenaltyPoint}}</span>
    {{#  } }}
    {{# } }}
</script>

<!--总罚分差值 最新总罚分与上一次总罚分的差值 差值小于0则标绿，差值等于0则标黑，差值大于0则标红-->
<script type="text/html" id="lazada_acctperf_all">
    {{# if(d.storePerformancePenaltyPoint != null && d.storePerformancePenaltyPoint != undefined){ }}
    {{# if((d.storePerformancePenaltyPoint - d.lastStorePerformancePenaltyPoint).toFixed(0) == 0){ }}
        {{(d.storePerformancePenaltyPoint - d.lastStorePerformancePenaltyPoint).toFixed(0)}}
    {{# }else if((d.storePerformancePenaltyPoint - d.lastStorePerformancePenaltyPoint).toFixed(0) > 0){ }}
        <span class="fRed"> {{(d.storePerformancePenaltyPoint - d.lastStorePerformancePenaltyPoint).toFixed(0)}}</span>
    {{# }else if((d.storePerformancePenaltyPoint - d.lastStorePerformancePenaltyPoint).toFixed(0) < 0){ }}
        <span class="fGreen"> {{(d.storePerformancePenaltyPoint - d.lastStorePerformancePenaltyPoint).toFixed(0)}}</span>
    {{#  } }}
    {{# } }}
</script>

<!--Fulfilment Violations point 非0则字体标红，0则标绿-->
<script type="text/html" id="lazada_acctperf_Fulfilment">
    {{# if(d.fulfilmentViolationsPoint != null && d.fulfilmentViolationsPoint != undefined){ }}
    {{# if(d.fulfilmentViolationsPoint != 0){ }}
        <span class="fRed">{{d.fulfilmentViolationsPoint}}</span>
    {{# }else if(d.fulfilmentViolationsPoint == 0){ }}
        <span class="fGreen"> {{d.fulfilmentViolationsPoint}}</span>
    {{#  } }}
    {{# } }}
</script>

<!--Listing Violations point 非0则字体标红，0则标绿-->
<script type="text/html" id="lazada_acctperf_Listing">
    {{# if(d.listingViolationsPoint != null && d.listingViolationsPoint != undefined){ }}
    {{# if(d.listingViolationsPoint != 0){ }}
        <span class="fRed">{{d.listingViolationsPoint}}</span>
    {{# }else if(d.listingViolationsPoint == 0){ }}
        <span class="fGreen"> {{d.listingViolationsPoint}}</span>
    {{#  } }}
    {{# } }}
</script>

<!--Service Standards point 非0则字体标红，0则标绿-->
<script type="text/html" id="lazada_acctperf_Service">
    {{# if(d.serviceStandardsPoint != null && d.serviceStandardsPoint != undefined){ }}
    {{# if(d.serviceStandardsPoint != 0){ }}
        <span class="fRed">{{d.serviceStandardsPoint}}</span>
    {{# }else if(d.serviceStandardsPoint == 0){ }}
        <span class="fGreen"> {{d.serviceStandardsPoint}}</span>
    {{#  } }}
    {{# } }}
</script>

<!--Others point 非0则字体标红，0则标绿-->
<script type="text/html" id="lazada_acctperf_Others">
    {{# if(d.othersPoint != null && d.othersPoint != undefined){ }}
    {{# if(d.othersPoint != 0){ }}
        <span class="fRed">{{d.othersPoint}}</span>
    {{# }else if(d.othersPoint == 0){ }}
        <span class="fGreen"> {{d.othersPoint}}</span>
    {{#  } }}
    {{# } }}
</script>


        <!--账号以及同步状态-->
        <script type="text/html" id="lazada_acctperf_syncStoreAcct">
            {{# if(d.syncStatus){ }}
                <span class="lazada_storeAcct point_st">{{d.storeAcct}}</span>
                <pre class="layui-hide">同步成功:{{ Format(d.syncTime,"yyyy-MM-dd hh:mm:ss")}}</pre>
            {{# }else{ }}
                <span class="lazada_storeAcct point_st fRed">{{d.storeAcct}}</span>
                <pre class="layui-hide">同步失败:{{d.syncDesc}},同步时间：{{ Format(d.syncTime,"yyyy-MM-dd hh:mm:ss")}} </pre>
            {{# } }}
        </script>

        <!-- Non-Compliance Points 指标为0 然后跟上一次数据last比较-->
        <script type="text/html" id="lazada_acctperf_nonCompliancePoints">
            {{# if(d.nonCompliancePoints != null && d.nonCompliancePoints != undefined){ }}
                {{# if(d.nonCompliancePoints == "-"){ }}
                    <span class="point_st">{{d.nonCompliancePoints}}</span>
                {{# }else if(d.nonCompliancePoints < 0){ }}
                    <div class="lazada_nonCompliancePoints point_st">
                        <span class="fRed"></span>
                        {{# if(d.lastNonCompliancePoints != "-" && (d.nonCompliancePoints == d.lastNonCompliancePoints)){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastNonCompliancePoints != "-" &&(d.nonCompliancePoints > d.lastNonCompliancePoints)){ }}
                           <span> {{"( ↑" + (d.nonCompliancePoints - d.lastNonCompliancePoints).toFixed(2) + " )"}}</span>
                        {{#}else if(d.lastNonCompliancePoints != "-" &&(d.nonCompliancePoints < d.lastNonCompliancePoints)){ }}
                            <span>{{"( ↓" + (d.lastNonCompliancePoints - d.nonCompliancePoints).toFixed(2) + " )"}}</span>
                        {{# } }}
                    </div>
                {{# }else if(d.nonCompliancePoints == 0){ }}
                    <div class="lazada_nonCompliancePoints point_st">
                        <span class="fGreen">{{d.nonCompliancePoints}}</span>
                        {{# if(d.lastNonCompliancePoints != "-" && (d.nonCompliancePoints == d.lastNonCompliancePoints)){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastNonCompliancePoints != "-" &&(d.nonCompliancePoints > d.lastNonCompliancePoints)){ }}
                           <span> {{"( ↑" + (d.nonCompliancePoints - d.lastNonCompliancePoints).toFixed(2) + " )"}}</span>
                        {{#}else if(d.lastNonCompliancePoints != "-" &&(d.nonCompliancePoints < d.lastNonCompliancePoints)){ }}
                            <span>{{"( ↓" + (d.lastNonCompliancePoints - d.nonCompliancePoints).toFixed(2) + " )"}}</span>
                        {{# } }}
                    </div>
                {{# }else if(d.nonCompliancePoints> 0){ }}
                    <div class="lazada_nonCompliancePoints point_st">
                        <span class="fRed">{{d.nonCompliancePoints}}</span>
                        {{# if(d.lastNonCompliancePoints != "-" && (d.nonCompliancePoints == d.lastNonCompliancePoints)){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastNonCompliancePoints != "-" &&(d.nonCompliancePoints > d.lastNonCompliancePoints)){ }}
                           <span> {{"( ↑" + (d.nonCompliancePoints - d.lastNonCompliancePoints).toFixed(2) + " )"}}</span>
                        {{#}else if(d.lastNonCompliancePoints != "-" &&(d.nonCompliancePoints < d.lastNonCompliancePoints)){ }}
                            <span>{{"( ↓" + (d.lastNonCompliancePoints - d.nonCompliancePoints).toFixed(2) + " )"}}</span>
                        {{# } }}
                    </div>
                {{#  } }}
            {{# } }}
        </script>

        <!-- Cancellation Rate 指标为在≦1% 然后跟上一次数据last比较 -->
        <script type="text/html" id="lazada_acctperf_cancellationRate">
            {{# if(d.cancellationRate != null && d.cancellationRate != undefined ){ }}
                {{# if(d.cancellationRate == "-"){ }}
                    <span class="point_st">{{d.cancellationRate}}</span>
                {{# }else if(parseFloat(d.cancellationRate) < '1' || parseFloat(d.cancellationRate) == '1' ){ }}
                    <div class="lazada_cancellationRate point_st">
                       <span class="fGreen"> {{d.cancellationRate}}</span>
                        {{# if(d.lastCancellationRate != '-' && (parseFloat(d.cancellationRate) == parseFloat(d.lastCancellationRate))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastCancellationRate != '-'&& (parseFloat(d.cancellationRate) > parseFloat(d.lastCancellationRate))){ }}
                           <span> {{"( ↑" + (parseFloat(d.cancellationRate) - parseFloat(d.lastCancellationRate)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastCancellationRate != '-'&& (parseFloat(d.cancellationRate) < parseFloat(d.lastCancellationRate))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastCancellationRate) - parseFloat(d.cancellationRate)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>{{# }else if(parseFloat(d.cancellationRate) > 1){ }}
                    <div class="lazada_cancellationRate point_st">
                       <span class="fRed"> {{d.cancellationRate}}</span>
                        {{# if(d.lastCancellationRate != '-' && (parseFloat(d.cancellationRate) == parseFloat(d.lastCancellationRate))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastCancellationRate != '-'&& (parseFloat(d.cancellationRate) > parseFloat(d.lastCancellationRate))){ }}
                           <span> {{"( ↑" + (parseFloat(d.cancellationRate) - parseFloat(d.lastCancellationRate)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastCancellationRate != '-'&& (parseFloat(d.cancellationRate) < parseFloat(d.lastCancellationRate))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastCancellationRate) - parseFloat(d.cancellationRate)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>{{#  } }}
            {{# } }}
        </script>

        <!-- Ship-on-Time (SOT)  指标为是≧95% 然后跟上一次数据last比较-->
        <script type="text/html" id="lazada_acctperf_shipOnTime">
            {{# if(d.shipOnTime != null && d.shipOnTime != undefined){ }}
                {{# if(d.shipOnTime == "-"){ }}
                    <span class="point_st">{{d.shipOnTime}}</span>
                {{# }else if(parseFloat(d.shipOnTime) < '95' || parseFloat(d.shipOnTime) == '95' ){ }}
                    <div class="lazada_shipOnTime point_st">
                        <span class="fRed">{{d.shipOnTime}}</span>
                        {{# if(d.lastShipOnTime != "-" && (parseFloat(d.shipOnTime) == parseFloat(d.lastShipOnTime))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastShipOnTime != "-" && (parseFloat(d.shipOnTime) > parseFloat(d.lastShipOnTime))){ }}
                            <span>{{"( ↑" + (parseFloat(d.shipOnTime) - parseFloat(d.lastShipOnTime)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastShipOnTime != "-" && (parseFloat(d.shipOnTime) < parseFloat(d.lastShipOnTime))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastShipOnTime) - parseFloat(d.shipOnTime)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{# }else if(parseFloat(d.shipOnTime) > 95){ }}
                    <div class="lazada_shipOnTime point_st">
                        <span class="fGreen">{{d.shipOnTime}}</span>
                        {{# if(d.lastShipOnTime != "-" && (parseFloat(d.shipOnTime) == parseFloat(d.lastShipOnTime))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastShipOnTime != "-" && (parseFloat(d.shipOnTime) > parseFloat(d.lastShipOnTime))){ }}
                            <span>{{"( ↑" + (parseFloat(d.shipOnTime) - parseFloat(d.lastShipOnTime)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastShipOnTime != "-" && (parseFloat(d.shipOnTime) < parseFloat(d.lastShipOnTime))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastShipOnTime) - parseFloat(d.shipOnTime)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{# } }}
            {{# } }}
        </script>

        <!-- Product Rating Coverage 指标为是≧70% 然后跟上一次数据last比较 -->
        <script type="text/html" id="lazada_acctperf_productRating">
            {{# if(d.productRating != null && d.productRating != undefined ){ }}
                {{# if(d.productRating == "-"){ }}
                    <span class="point_st">{{d.productRating}}</span>
                {{# }else if(parseFloat(d.productRating) < '70' || parseFloat(d.productRating) == '70' ){ }}
                    <div class="lazada_productRating point_st">
                        <span class="fRed">{{d.productRating}}</span>
                        {{# if(d.lastProductRating != "-" && (parseFloat(d.productRating) == parseFloat(d.lastProductRating))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastProductRating != "-" && (parseFloat(d.productRating) > parseFloat(d.lastProductRating))){ }}
                            <span>{{"( ↑" + (parseFloat(d.productRating) - parseFloat(d.lastProductRating)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastProductRating != "-" && (parseFloat(d.productRating) < parseFloat(d.lastProductRating))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastProductRating) - parseFloat(d.productRating)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{# }else if(parseFloat(d.productRating) > 70){ }}
                    <div class="lazada_productRating point_st">
                        <span class="fGreen">{{d.productRating}}</span>
                        {{# if(d.lastProductRating != "-" && (parseFloat(d.productRating) == parseFloat(d.lastProductRating))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastProductRating != "-" && (parseFloat(d.productRating) > parseFloat(d.lastProductRating))){ }}
                            <span>{{"( ↑" + (parseFloat(d.productRating) - parseFloat(d.lastProductRating)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastProductRating != "-" && (parseFloat(d.productRating) < parseFloat(d.lastProductRating))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastProductRating) - parseFloat(d.productRating)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{#  } }}
            {{# } }}
        </script>

        <!--Positive Seller Rating 指标为是≧85% 然后跟上一次数据last比较-->
        <script type="text/html" id="lazada_acctperf_positiveSeller">
             {{# if(d.positiveSeller != null && d.positiveSeller != undefined){ }}
                {{# if(d.positiveSeller == "-"){ }}
                    <span class="point_st">{{d.positiveSeller}}</span>
                {{# }else if(parseFloat(d.positiveSeller) < '85' || parseFloat(d.positiveSeller) == '85' ){ }}
                    <div class="lazada_positiveSeller point_st ">
                       <span class="fRed">{{d.positiveSeller}}</span>
                        {{# if(d.lastPositiveSeller != "-" && (parseFloat(d.positiveSeller) == parseFloat(d.lastPositiveSeller))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastPositiveSeller != "-" && (parseFloat(d.positiveSeller) > parseFloat(d.lastPositiveSeller))){ }}
                           <span> {{"( ↑" + (parseFloat(d.positiveSeller) - parseFloat(d.lastPositiveSeller)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastPositiveSeller != "-" && (parseFloat(d.positiveSeller) < parseFloat(d.lastPositiveSeller))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastPositiveSeller) - parseFloat(d.positiveSeller)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{# }else if(parseFloat(d.positiveSeller) > 85){ }}
                    <div class="lazada_positiveSeller point_st">
                       <span class="fGreen"> {{d.positiveSeller}}</span>
                        {{# if(d.lastPositiveSeller != "-" && (parseFloat(d.positiveSeller) == parseFloat(d.lastPositiveSeller))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastPositiveSeller != "-" && (parseFloat(d.positiveSeller) > parseFloat(d.lastPositiveSeller))){ }}
                           <span> {{"( ↑" + (parseFloat(d.positiveSeller) - parseFloat(d.lastPositiveSeller)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastPositiveSeller != "-" && (parseFloat(d.positiveSeller) < parseFloat(d.lastPositiveSeller))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastPositiveSeller) - parseFloat(d.positiveSeller)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{#  } }}
            {{# } }}
        </script>

        <!-- Chat Same-day Response Rate 指标为是≧85% 然后跟上一次数据last比较-->
        <script type="text/html" id="lazada_acctperf_chatSameDayResponseRate">
            {{# if(d.chatSameDayResponseRate != null && d.chatSameDayResponseRate != undefined){ }}
                {{# if(d.chatSameDayResponseRate == "-"){ }}
                    <span class="point_st">{{d.chatSameDayResponseRate}}</span>
                {{# }else if(parseFloat(d.chatSameDayResponseRate) < '85' || parseFloat(d.chatSameDayResponseRate) == '85' ){ }}
                    <div class="lazada_chatSameDayResponseRate point_st">
                        <span class="fRed">{{d.chatSameDayResponseRate}}</span>
                        {{# if( d.lastChatSameDayResponseRate != "-" && (parseFloat(d.chatSameDayResponseRate) == parseFloat(d.lastChatSameDayResponseRate))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastChatSameDayResponseRate != "-" && (parseFloat(d.chatSameDayResponseRate) > parseFloat(d.lastChatSameDayResponseRate))){ }}
                            <span>{{"( ↑" + (parseFloat(d.chatSameDayResponseRate) - parseFloat(d.lastChatSameDayResponseRate)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastChatSameDayResponseRate != "-" && (parseFloat(d.chatSameDayResponseRate) < parseFloat(d.lastChatSameDayResponseRate))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastChatSameDayResponseRate) - parseFloat(d.chatSameDayResponseRate)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{# }else if(parseFloat(d.chatSameDayResponseRate) > 85){ }}
                    <div class="lazada_chatSameDayResponseRate point_st">
                        <span class="fGreen">{{d.chatSameDayResponseRate}}</span>
                        {{# if( d.lastChatSameDayResponseRate != "-" && (parseFloat(d.chatSameDayResponseRate) == parseFloat(d.lastChatSameDayResponseRate))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastChatSameDayResponseRate != "-" && (parseFloat(d.chatSameDayResponseRate) > parseFloat(d.lastChatSameDayResponseRate))){ }}
                            <span>{{"( ↑" + (parseFloat(d.chatSameDayResponseRate) - parseFloat(d.lastChatSameDayResponseRate)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastChatSameDayResponseRate != "-" && (parseFloat(d.chatSameDayResponseRate) < parseFloat(d.lastChatSameDayResponseRate))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastChatSameDayResponseRate) - parseFloat(d.chatSameDayResponseRate)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{#  } }}
            {{# } }}
        </script>

        <!-- Chat Response Time 指标为是是≦30min 然后跟上一次数据last比较-->
        <script type="text/html" id="lazada_acctperf_chatResponseTime">
            {{# if(d.chatResponseTime != null && d.chatResponseTime != undefined){ }}
                {{# if(d.chatResponseTime == "-"){ }}
                    <span class="point_st">{{d.chatResponseTime}}</span>
                {{# }else if(parseFloat(d.chatResponseTime) < 30 || parseFloat(d.chatResponseTime) == 30){ }}
                    <div class="lazada_chatResponseTime point_st ">
                        <span class="fGreen">{{d.chatResponseTime}}min</span>
                        {{# if(d.lastChatResponseTime != "-" && (parseFloat(d.chatResponseTime) == parseFloat(d.lastChatResponseTime))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastChatResponseTime != "-" && (parseFloat(d.chatResponseTime) > parseFloat(d.lastChatResponseTime))){ }}
                            <span>{{"( ↑" + (parseFloat(d.chatResponseTime) - parseFloat(d.lastChatResponseTime)).toFixed(2) + "min )"}}</span>
                        {{#}else if(d.lastChatResponseTime != "-" && (parseFloat(d.chatResponseTime) < parseFloat(d.lastChatResponseTime))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastChatResponseTime) - parseFloat(d.chatResponseTime)).toFixed(2) + "min )"}}</span>
                        {{# } }}
                    </div>
                {{# }else if(parseFloat(d.chatResponseTime) > 30){ }}
                    <div class="lazada_chatResponseTime point_st ">
                        <span class="fRed">{{d.chatResponseTime}}min</span>
                        {{# if(d.lastChatResponseTime != "-" && (parseFloat(d.chatResponseTime) == parseFloat(d.lastChatResponseTime))){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastChatResponseTime != "-" && (parseFloat(d.chatResponseTime) > parseFloat(d.lastChatResponseTime))){ }}
                            <span>{{"( ↑" + (parseFloat(d.chatResponseTime) - parseFloat(d.lastChatResponseTime)).toFixed(2) + "min )"}}</span>
                        {{#}else if(d.lastChatResponseTime != "-" && (parseFloat(d.chatResponseTime) < parseFloat(d.lastChatResponseTime))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastChatResponseTime) - parseFloat(d.chatResponseTime)).toFixed(2) + "min )"}}</span>
                        {{# } }}
                    </div>
                {{#  } }}
            {{# } }}
        </script>

        <!-- Return Rate 指标为是是≦1% 然后跟上一次数据last比较-->
        <script type="text/html" id="lazada_acctperf_returnRate">
            {{# if(d.returnRate != null && d.returnRate != undefined){ }}
                {{# if(d.returnRate == "-"){ }}
                    <span class="point_st">{{d.returnRate}}</span>
                {{# }else if(parseFloat(d.returnRate) < '1' || parseFloat(d.returnRate) == '1' ){ }}
                    <div class="lazada_returnRate point_st">
                        <span class="fGreen ">{{d.returnRate}}</span>
                        {{# if(d.lastReturnRate != "-" && (d.returnRate == d.lastReturnRate)){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastReturnRate != "-" && (parseFloat(d.returnRate) > parseFloat(d.lastReturnRate))){ }}
                            <span>{{"( ↑" + (parseFloat(d.returnRate) - parseFloat(d.lastReturnRate)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastReturnRate != "-" && (parseFloat(d.returnRate) < parseFloat(d.lastReturnRate))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastReturnRate) - parseFloat(d.returnRate)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{# }else if(parseFloat(d.returnRate) > 1){ }}
                    <div class="lazada_returnRate point_st">
                        <span class="fRed">{{d.returnRate}}</span>
                        {{# if(d.lastReturnRate != "-" && (d.returnRate == d.lastReturnRate)){ }}
                            <span>(0)</span>
                        {{# }else if(d.lastReturnRate != "-" && (parseFloat(d.returnRate) > parseFloat(d.lastReturnRate))){ }}
                            <span>{{"( ↑" + (parseFloat(d.returnRate) - parseFloat(d.lastReturnRate)).toFixed(2) + "% )"}}</span>
                        {{#}else if(d.lastReturnRate != "-" && (parseFloat(d.returnRate) < parseFloat(d.lastReturnRate))){ }}
                            <span>{{"( ↓" + (parseFloat(d.lastReturnRate) - parseFloat(d.returnRate)).toFixed(2) + "% )"}}</span>
                        {{# } }}
                    </div>
                {{#  } }}
            {{# } }}
        </script>

        <!-- Basket size  指标为是是啊≧1.5 然后跟上一次数据last比较 -->
        <script type="text/html" id="lazada_acctperf_basketSize">
            {{# if(d.basketSize != null && d.basketSize != undefined ){ }}
                {{# if(d.basketSize == "-" || d.lastBasketSize == "-"){ }}
                    <span class="point_st">{{d.basketSize}}</span>
                {{# }else if(d.basketSize < 1.5 || d.basketSize == 1.5){ }}
                    <div class="lazada_basketSize point_st">
                        <span class="fGreen ">{{d.basketSize}}</span>
                        {{# if(d.basketSize == d.lastBasketSize){ }}
                            <span>(0)</span>
                        {{# }else if(d.basketSize > d.lastBasketSize){ }}
                            <span>{{"( ↑" + (d.basketSize - d.lastBasketSize).toFixed(2) + " )"}}</span>
                        {{#}else if(d.basketSize < d.lastBasketSize){ }}
                            <span>{{"( ↓" + (d.lastBasketSize - d.basketSize).toFixed(2) + " )"}}</span>
                        {{# } }}
                    </div>
                {{# }else if(d.basketSize > 1.5){ }}
                    <div class="lazada_basketSize point_st">
                        <span class="fRed">{{d.basketSize}}</span>
                        {{# if(d.basketSize == d.lastBasketSize){ }}
                            <span>(0)</span>
                        {{# }else if(d.basketSize > d.lastBasketSize){ }}
                            <span>{{"( ↑" + (d.basketSize - d.lastBasketSize).toFixed(2) + " )"}}</span>
                        {{#}else if(d.basketSize < d.lastBasketSize){ }}
                            <span>{{"( ↓" + (d.lastBasketSize - d.basketSize).toFixed(2) + " )"}}</span>
                        {{# } }}
                    </div>
                {{#  } }}
            {{# } }}
        </script>

        <script type="text/javascript" src="${ctx}/static/js/publishs/lazada/accperformance.js"></script>