<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>履约选择</title>
<style>
    #performanceSelection_logisRule_match_analysis_tabs .layui-tab-title li {
        padding: 0;
    }
    .shallow-yellow{
        background-color: #dec674;
    }
    .shallow-yellow:hover{
        background-color: #dec674 !important;
    }
    .match-grey {
        color: #ccc;
    }
    .fr {
        float: right;
    }

    .w_80 {
        width: 80%!important;
        display: inline-block;
    }

    .ma {
        margin: 0 auto;
    }

    .skyblue {
        color: skyblue;
    }

    .mt {
        margin-top: 10px;
    }

    .ml {
        margin-left: 10px;
    }
    .mg_t{
        margin-top:10px;
    }
    .mg{
        margin:0 10px;
    }

    .fr {
        float: right;
    }
    .mr3 {
      margin-right: 3px;
    }

    .mr10 {
        margin-right: 10px;
    }

    .hidden {
        display: none;
    }

    .dis_flex {
        display: flex;
        justify-content: flex-start;
    }

    .dis_flex_space {
        display: flex;
        justify-content: space-between;
    }

    .dis_flex_around {
        display: flex;
        justify-content: space-around;
    }

    .mg_50 {
        margin: 20px 50px;
    }

    .lh_42 {
        line-height: 42px;
    }

    .lh_36 {
        line-height: 36px;
    }

    .w_100 {
        width: 100px;
    }

    .hide {
        display: none;
    }

    .select_label {
        padding: 0px!important;
    }

    .gray {
        color: gray;
    }

    .text_l {
        text-align: left;
    }

    .externalContainabnorlmalorder {
        position: relative;
        width: 0;
        float: left;
        height: 0;
        z-index: 20190918;
    }

    .externalPopAuditorder {
        clear: left;
        position: relative;
        left: -30.667vw;
        top: 40px;
        width: 35vw;
        border: 1px solid #e6e6e6;
        background-color: lightyellow;
        padding: 20px 0;
        border-radius: 5px;
        box-shadow: 1px 1px 1px grey;
    }

    .externalBox {
        width: 70px;
        line-height: 32px;
        text-align: center;
        border: 1px solid #e6e6e6;
        margin-left: 15px;
        cursor: pointer;
    }

    .externalBox:hover {
        border: 1px solid grey;
    }

    .showExternal {
        border: 1px solid #1E9FFF!important;
    }

    .refresh_icon {
        margin-left: 5px;
        cursor: pointer;
    }
    #LAY-performanceSelection .layui-btn+.layui-btn{
        margin-left: 0!important;
    }

    .dis_flex_start {
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
    }

    .mtb {
        margin: 5px 0;
    }

    .pageSortfix{
        background:#fff;
        width: 100%;
        position: fixed;
        bottom: 0;
        left:100px;
    }
    .hide{
        display: none!important;
    }

    .performanceSelection-noteContent-tag{
        color:#008B8B;
        border: 1px solid #008B8B;
        background-color: #fff;
    }

    .performanceSelection_store_style .xm-select-dl{
        width:-webkit-fill-available !important;
    }
    .skuEllipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    #performanceSelection_save .common-save-dropdown {
      bottom: 5px !important;
    }
    .placeholder_color input::placeholder {
        color: #333; /* 设置占位符文本的颜色 */
    }
    .shipping_method_div{
      padding: 10px;
      margin: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
      display: flex;
      height: 50px;
    }
    .shipping_method_active{
      border:1px solid #1E9FFF;
    }
    .shipping_method_input{
      line-height: 46px;
    }
    .predict_money{
      margin-left: 60px;
    }

</style>
<div class="layui-fluid" id="LAY-performanceSelection">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="performanceSelectionForm" lay-filter="performanceSelectionForm">
                        <div class="layui-form-item">
                            <input class="hide" type="text" id="semiSwitchShipStatus_val" name="semiSwitchShipStatus" value="1">
                            <input class="hide" type="text" name="platCode" value="aliexpress">
                            <input class="hide" type="text" name="page" value="1">
                            <input class="hide" type="text" name="limit" value="500">
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">订单时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="performanceSelection_time" name="time">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgs" lay-search class="orgs_hp_custom" lay-filter="performanceSelection_orgs">
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId" class="users_hp_custom" lay-filter="performanceSelection_salerAndcustom" id="performanceSelection_salePersonsSelect" xm-select="performanceSelection_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 performanceSelection_store_style">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select
                                    class="users_hp_store_multi"
                                    id="performanceSelection_store"
                                    name="storeAcctIds"
                                    xm-select="performanceSelection_store"
                                    xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">发货方式</label>
                                <div class="layui-input-block">
                                    <select name="shippingMethod" lay-search  lay-filter="shippingMethod">
                                      <option value="">请选择</option>
                                      <option value="2">托管发货</option>
                                      <option value="1">自行发货</option>
                                  </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺单号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="platOrderIds" class="layui-input" placeholder="多个单号使用逗号隔开">
                                </div>
                            </div>
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch ml20" lay-submit="" id="performanceSelectionSearch" lay-filter="performanceSelectionSearch">查询</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="performanceSelectionCard">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="performanceSelection_Tab" id="performanceSelection_Tab">
                        <div class="layui-card-header dis_flex">
                            <div style="float:left;" >
                                <ul class="layui-tab-title fl">
                                    <li class="layui-this" data-index="0">未确认(<span class="num" id="performance_selection_span0"></span>)</li>
                                    <li data-index="1">已确认(<span class="num" id="performance_selection_span1"></span>)</li>
                                    <li data-index="2">全部(<span class="num" id="performance_selection_span2"></span>)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="layui-tab-content">
                            <div id="performanceSelection_table" style="height: 600px;" class="ag-theme-balham"></div>
                            <div class="pageSortfix" id="performanceSelectionPage"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id=""></div>
<script type="text/html" id="selestPerformanceTypeDiv_con">
  <div style="padding: 10px;" id="selestPerformanceTypeDiv"></div>
</script>
<script type="text/html" id="selestPerformanceTypeTpl">
  <div style="border-radius: 8px;">
    <div>选择对应发货方式后，预计订单可得金额会有所差异，请谨慎评估</div>
    <div style="padding:10px">
      <div class="shipping_method_div shipping_method_active" orderId="{{d.id}}">
        <div class="shipping_method_input">
          <input type="radio" name="shippingMethodCode" value="2" checked> 托管发货
        </div>
        <div class="predict_money">
          <span>预计可得<br>{{d.semiCurrency||''}} {{d.semiAmount||''}}</span>
        </div>
      </div>
      <div class="shipping_method_div" orderId="{{d.id}}">
        <div class="shipping_method_input">
          <input type="radio" name="shippingMethodCode" value="1"> 自行发货
        </div>
        <div class="predict_money">
          <span>预计可得<br>{{d.selfShipCurrencyCode||''}} {{d.selfShipAmount||''}}</span>
        </div>
      </div>
    </div>
  </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/order/orderLog.js"></script>
<script src="${ctx}/static/js/smtissueinfo/performanceSelection.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<%--<script src="${ctx}/static/virtual-list/virtual-list.js"></script>--%>