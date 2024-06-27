<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<title>账号表现</title>
<link rel="stylesheet" href="${ctx}/static/style/iconfont/index.css" media="all">

<style>
 .table_title{
     border:1px solid #e6e6e6;
     display: inline-block;
     line-height:20px;
     padding: 10px;
     background: #fff;
 }
 #accplay_report .layui-table,#accplay_report .layui-table-view{
     margin:0 !important;
 }

 .title{
    font-size: 18px;
    color:#000;
    font-weight:600;
    line-height: 45px;
  }
  .border_b{
    border-bottom:1px solid #e6e6e6;
  }
  .border_all{
    border:1px solid #e6e6e6;
  }

  .ml_20{
    margin-left: 20px;
  }
  td{
    text-align: center;
  }
  .w_95{
    width: 95%!important;
  }

  .fr{
    float: right!important;
  }
  .accRed {
    color: rgb(250, 201, 7);
    font-size: 14px
  }
  .accGreen {
    color: green;
    font-size: 14px
  }

  .point_st{
    cursor: pointer;
  }
  .m_10{
    margin:10px;
  }
  #accplay_report .layui-table-header{
    border-bottom:none;
  }

  #accplay_report [data-field="globalEvaluationStartDate"],
  #accplay_report [data-field="ukEvaluationStartDate"],
  #accplay_report [data-field="deEvaluationStartDate"],
  #accplay_report [data-field="usEvaluationStartDate"],
  #accplay_report [data-field="eubStatus"],
  #accplay_report [data-field="edsStatus"],
  #accplay_report [data-field="speedpakStatus"],
  #accplay_report [data-field="speedpakExpeditedPercent"]{
    border-left:3px solid #e6e6e6 !important;
  }
</style>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12 layui-col-lg12" id="accplay_report">
        <!-- 搜索条件 -->
        <div class="layui-card">
          <div class="layui-card-body">
              <form class="layui-form" lay-filter="ebay_accperformance_searchForm" id="ebay_accperformance_searchForm">
                  <div class="layui-form-item">
                      <div class="layui-col-lg2 layui-col-md2">
                          <label class="layui-form-label">部门</label>
                          <div class="layui-input-block">
                              <select id="ebay_accperformance_depart_sel1" name="ebay_accperformance_depart_sel1" lay-search lay-filter="ebay_accperformance_depart_sel1"
                                  class="orgs_hp_custom" xm-select="ebay_accperformance_depart_sel1" xm-select-search
                                  xm-select-search-type="dl" xm-select-skin="normal">
                                  <option value=""></option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-lg2 layui-col-md2">
                          <label class="layui-form-label">销售</label>
                          <div class="layui-input-block">
                              <select id="ebay_accperformance_salesman_sel" lay-search
                                  lay-filter="ebay_accperformance_salesman_sel" class="users_hp_custom"
                                  data-rolelist="ebay专员" xm-select="ebay_accperformance_salesman_sel"
                                  xm-select-search xm-select-search-type="dl"
                                  xm-select-skin="normal" data-platcode="ebay">
                                  <option value=""></option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-lg2 layui-col-md2">
                          <label class="layui-form-label">账户</label>
                          <div class="layui-input-block" style="font-size: 12px;">
                              <select id="ebay_accperformance_store_sel" lay-filter="ebay_accperformance_store_sel"
                                  xm-select="ebay_accperformance_store_sel" class="users_hp_store_multi" xm-select-search
                                  xm-select-search-type="dl" xm-select-skin="normal" data-platcode="ebay"
                                  name="ebay_accperformance_store_sel_name"></select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">账号类型</label>
                          <div class="layui-input-block">
                              <select id="ebay_accperformance_Account_type" lay-filter="ebay_accperformance_Account_type"
                                  xm-select="ebay_accperformance_Account_type" class="salesSite_hp_custom" xm-select-search
                                  xm-select-search-type="dl" xm-select-skin="normal"></select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">账号状态</label>
                        <div class="layui-input-block">
                            <select id="storeAcctStatus">
                                <option value="-1">全部</option>
                                <option value="0">停用</option>
                                <option value="1">启用</option>
                            </select>
                        </div>
                    </div>
                      <div class="layui-col-md1 layui-col-lg1 fr">
                          <button type="button" class="layui-btn layui-btn-sm keyHandle"
                              id="ebay_accperformance_search_submit">查询</button>
                          <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary ml10"
                              id="ebay_online_search_reset">清空</button>
                      </div>
                  </div>

              </form>
          </div>
        </div>
        <div class="layui-card">
        <div class="layui-card-body">
        <div class="layui-tab">
            <div class="disFCenter">
              <ul class="layui-tab-title m_10" style="display:inline-block;" id="tabList">
                <li class="layui-this" data-index="sel_Panect">卖家总览</li>
                <li data-index="policy_Performance">政策表现</li>
                <li data-index="sel_Limit">销售额度</li>
                <li data-index="log_Index">物流指标</li>
                <li data-index="withdrawal_Index">提额指标</li>
              </ul>
              <div>
                <a href="javascript:;" class="layui-btn layui-btn-sm disN" id="ebay_accountTem_selSync">批量同步</a>
              </div>
            </div>
            <!--<button class="layui-btn layui-btn-sm af_syncBtn m_10" style="float: right;">立即同步</button>-->
            <div class="layui-tab-content">
                    <div class="layui-tab-item  layui-show">
                          <table class="layui-table" id="sel_Panect" lay-filter="sel_Panect">
                          </table>
                  </div>
                    <div class="layui-tab-item">
                        <table class="layui-table" id="policy_Performance" lay-filter="policy_Performance">
                        </table>
                    </div>
                    <div class="layui-tab-item">
                          <table class="layui-table" id="sel_Limit" lay-filter="sel_Limit">
                          </table>
                    </div>
                    <div class="layui-tab-item">
                          <table class="layui-table" id="log_Index" lay-filter="log_Index">
                          </table>
                    </div>
                    <!-- <div class="layui-tab-item">
                          <table class="layui-table" id="sel_Repoter" lay-filter="sel_Repoter">
                          </table>
                    </div> -->
                    <div class="layui-tab-item">
                      <table class="layui-table" id="withdrawal_Index" lay-filter="withdrawal_Index">
                      </table>
                </div>
            </div>
          </div>
        </div>
        </div>
    </div>
  </div>
</div>
<!-- 详情弹框 -->
<script type="text/html" id="detail_Template">
	{{if (accountData && accountData.data)}}
	{{set longTermDefects = accountData.data.longTermDefects}}
	{{set tciDefect = accountData.data.tciDefect}}
	{{set shippingDefect = accountData.data.shippingDefect}}
	{{set shippingDefect5T12Wk = accountData.data.shippingDefect5T12Wk}}
	{{set pgcTracking = accountData.data.pgcTracking}}
	{{set warehouse = accountData.data.warehouse}}
        {{if (accountData && accountData.data && accountData.data.directShipping)}}
            {{set directShipping = accountData.data.directShipping}}
        {{/if}}
        {{if (accountData && accountData.data && accountData.data.snadClaimData)}}
            {{set snadClaimData = accountData.data.snadClaimData}}
        {{/if}}
    {{/if}}


    {{set newwarehouse = newwarehouseData}}
	{{set shippingAccount = shippingAccount}}
	{{set standardsData = standardsData}}

    <div class="layui-container border_all">
        <div class="title border_b">{{storeAcctName}} 店铺账号表现</div>
        <div class="performance">
            <div class="title">综合表现</div>
            <div class="layui-row">
              <div class="layui-col-md6 layui-col-lg6">
                <table class="layui-table w_95">
                  <tbody>
                    <tr>
                    <td colspan="4">销售额度</td>
                   </tr>
                   <tr>
                     <td>指标</td>
                     <td>上限</td>
                     <td>剩余</td>
                     <td>剩余比例</td>
                   </tr>
                   <tr>
                     <td>销售额</td>
                     <td>暂无</td>
                     <td>{{sellingAccount.amountLimitRemaining}}{{sellingAccount.amountLimitRemainingCurrency}}</td>
                     <td>暂无</td>
                   </tr>
                   <tr>
                     <td>在线数量</td>
                     <td>{{sellingAccount.quantityHistoryCount}}</td>
                     <td>{{sellingAccount.quantityLimitRemaining}}</td>
                     <td>{{percentToStr(sellingAccount.quantityLimitPercent)}}</td>
                   </tr>
                  </tbody>
                </table>
              </div>
              <div class="layui-col-md6 layui-col-lg6">
                  <table class="layui-table w_95 fr">
                  	{{if longTermDefects}}
                      <tbody>
                        <tr>
                        <td colspan="4">
                        	不良交易表现(
		                    <span class="{{statusTran(longTermDefects.status_lst_eval).class}}"><b>{{statusTran(longTermDefects.status_lst_eval).text}}</b></span>
                        	)

                        </td>
                       </tr>
                       <tr>
                         <td>指标</td>
                         <td>标准值</td>
                         <td>当前值</td>
                         <td>状态</td>
                       </tr>
                       <tr>
                         <td><=$10 12月不良交易率</td>
                         <td>{{percentToStr(longTermDefects.dft_rt_lt10_12m_th)}}</td>
                         <td>{{percentToStr(longTermDefects.dft_rt_lt10_12m_lst_eval)}}</td>
                         <td>
                            <span class="{{statusTran(longTermDefects.status_lt10_lst_eval).class}}"><b>{{statusTran(longTermDefects.status_lt10_lst_eval).text}}</b></span>
                         </td>
                       </tr>
                       <tr>
                         <td>>$10 12月不良交易率</td>
                         <td>{{percentToStr(longTermDefects.dft_rt_gt10_12m_th)}}</td>
                        <td>{{percentToStr(longTermDefects.dft_rt_gt10_12m_lst_eval)}}</td>
                        <td>
                            <span class="{{statusTran(longTermDefects.status_gt10_lst_eval).class}}"><b>{{statusTran(longTermDefects.status_gt10_lst_eval).text}}</b></span>
                        </td>
                       </tr>
                       <tr>
                         <td>>综合</td>
                         <td>{{percentToStr(longTermDefects.adj_dft_rt_12m_th)}}</td>
                        <td>{{percentToStr(longTermDefects.adj_dft_rt_12m_lst_eval)}}</td>
                        <td>
                            <span class="{{statusTran(longTermDefects.status_adj_lst_eval).class}}"><b>{{statusTran(longTermDefects.status_adj_lst_eval).text}}</b></span>
                        </td>
                       </tr>
                      </tbody>
                    {{/if}}
                    </table>
              </div>
            </div>
            <div class="layui-row">
              <div class="layui-col-md12 layui-col-lg12">
                <table class="layui-table">
                {{if standardsData}}
                  <tbody>
                    <tr>
                      <td>指标</td>
                      <td>全球
                    	<span class="{{levelTran(standardsData.globalCurrentLevel).class}}"><b>{{levelTran(standardsData.globalCurrentLevel).text}}</b></span>
                    	({{Format(standardsData.globalEvaluationStartDate,"yyyy-MM-dd")}}-{{Format(standardsData.globalEvaluationEndDate,"yyyy-MM-dd")}})
                      </td>
                      <td>美国
                    	<span class="{{levelTran(standardsData.usCurrentLevel).class}}"><b>{{levelTran(standardsData.usCurrentLevel).text}}</b></span>
                    	({{Format(standardsData.usEvaluationStartDate,"yyyy-MM-dd")}}-{{Format(standardsData.usEvaluationEndDate,"yyyy-MM-dd")}})
                      </td>
                      <td>英国
                    	<span class="{{levelTran(standardsData.ukCurrentLevel).class}}"><b>{{levelTran(standardsData.ukCurrentLevel).text}}</b></span>
                    	({{Format(standardsData.ukEvaluationStartDate,"yyyy-MM-dd")}}-{{Format(standardsData.ukEvaluationEndDate,"yyyy-MM-dd")}})
                      </td>
                      <td>德国
                    	<span class="{{levelTran(standardsData.deCurrentLevel).class}}"><b>{{levelTran(standardsData.deCurrentLevel).text}}</b></span>
                    	({{Format(standardsData.deEvaluationStartDate,"yyyy-MM-dd")}}-{{Format(standardsData.deEvaluationEndDate,"yyyy-MM-dd")}})
                      </td>
                    </tr>
                    <tr>
                      <td>不良交易率</td>
                      <td>
                      	{{percentToStr(standardsData.globalDefectivePercent)}}({{standardsData.globalDefectiveNum}}笔)<b>{{levelTran(standardsData.globalDefectiveLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.globalDefectiveStd}}</span>
                      </td>
                      <td>{{percentToStr(standardsData.usDefectivePercent)}}({{standardsData.usDefectiveNum}}笔)<b>{{levelTran(standardsData.usDefectiveLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.usDefectiveStd}}</span>
                      </td>
                      <td>{{percentToStr(standardsData.ukDefectivePercent)}}({{standardsData.ukDefectiveNum}}笔)<b>{{levelTran(standardsData.ukDefectiveLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.ukDefectiveStd}}</span>
                      </td>
                      <td>{{percentToStr(standardsData.deDefectivePercent)}}({{standardsData.deDefectiveNum}}笔)<b>{{levelTran(standardsData.deDefectiveLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.deDefectiveStd}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>升级Case</td>
                      <td>{{percentToStr(standardsData.globalClaimsSafPercent)}}({{standardsData.globalClaimsSafNum}}笔)<b>{{levelTran(standardsData.globalClaimsSafLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.globalClaimsSafStd}}</span>
                      </td>
                      <td>{{percentToStr(standardsData.usClaimsSafPercent)}}({{standardsData.usClaimsSafNum}}笔)<b>{{levelTran(standardsData.usClaimsSafLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.usClaimsSafStd}}</span>
                      </td>
                      <td>{{percentToStr(standardsData.ukClaimsSafPercent)}}({{standardsData.ukClaimsSafNum}}笔)<b>{{levelTran(standardsData.ukClaimsSafLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.ukClaimsSafStd}}</span>
                      </td>
                      <td>{{percentToStr(standardsData.deClaimsSafPercent)}}({{standardsData.deClaimsSafNum}}笔)<b>{{levelTran(standardsData.deClaimsSafLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.deClaimsSafStd}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>延迟送达率</td>
                      <td>{{percentToStr(standardsData.globalLateShipmentPercent)}}({{standardsData.globalLateShipmentNum}}笔)<b>{{levelTran(standardsData.globalLateShipmentLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.globalLateShipmentStd}}</span>
                      </td>
                      <td>{{percentToStr(standardsData.usLateShipmentPercent)}}({{standardsData.usLateShipmentNum}}笔)<b>{{levelTran(standardsData.usLateShipmentLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.usLateShipmentStd}}</span>
                      </td>
                      <td>{{percentToStr(standardsData.ukLateShipmentPercent)}}({{standardsData.ukLateShipmentNum}}笔)<b>{{levelTran(standardsData.ukLateShipmentLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.ukLateShipmentStd}}</span>
                      </td>
                      <td>{{percentToStr(standardsData.deLateShipmentPercent)}}({{standardsData.deLateShipmentNum}}笔)<b>{{levelTran(standardsData.deLateShipmentLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.deLateShipmentStd}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>及时上传有效跟踪号</td>
                      <td>-</td>
                      <td>{{percentToStr(standardsData.usTrackingUploadedPercent)}}({{standardsData.usTrackingUploadedNum}}笔)<b>{{levelTran(standardsData.usTrackingUploadedLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.usTrackingUploadedStd}}</span>
                      </td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>销售额</td>
                      <td>{{standardsData.globalGmv}}({{standardsData.globalTransactionCount}}笔)<b>{{levelTran(standardsData.globalGmvLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.globalSaleStd}}</span>
                      </td>
                      <td>{{standardsData.usGmv}}({{standardsData.usTransactionCount}}笔)<b>{{levelTran(standardsData.usGmvLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.usSaleStd}}</span>
                      </td>
                      <td>{{standardsData.ukGmv}}({{standardsData.ukTransactionCount}}笔)<b>{{levelTran(standardsData.ukGmvLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.ukSaleStd}}</span>
                      </td>
                      <td>{{standardsData.deGmv}}({{standardsData.deTransactionCount}}笔)<b>{{levelTran(standardsData.deGmvLevel).text}}</b>
                      	<br><span style="color: #E6E6E6;">标准值：{{standardsData.deSaleStd}}</span>
                      </td>
                    </tr>
                  </tbody>
                {{/if}}
                </table>
              </div>
            </div>
        </div>

        <div class="warehouse">
            <div class="title">海外仓服务标准
                {{if newwarehouse}}
                <button id="af_downloadWhDataBtn" data-id={{storeAcctId}} title="下载相关交易数据" class="layui-btn layui-btn-sm layui-btn-normal">导出</button>
                {{/if}}
            </div>
            <div class="layui-row">
                <div class="layui-col-md12 layui-col-lg12">
                  <table class="layui-table">
                  {{if newwarehouse}}
                    <tbody>
                        <tr>
                            <td colspan="9">海外仓服务标准
                                <span class="{{newwarehouseTran(newwarehouse.actionStatus).class}}"><b>{{newwarehouseTran(newwarehouse.actionStatus).text}}</b></span>
                                ({{newwarehouse.reviewStarDate}}-{{newwarehouse.reviewEndDate}})
                                <br>
                                <span>
                                    <b>评估日期:</b>{{newwarehouse.createPst}}
                                    <b>下次评估:</b>{{newwarehouse.nextEvaluationDate}}
                                </span>
                            </td>
                        </tr>
                      <tr>
                        <td>海外仓</td>
                        <td colspan="2">合规刊登率</td>
                        <td colspan="2">及时发货率</td>
                        <td colspan="2">物品及时送达率</td>
                        <td colspan="2">物流不良交易率</td>
                       </tr>
                      <tr>
                        <td>指标</td>
                        <td>标准值</td>
                        <td>当前评估值</td>
                        <td>标准值</td>
                        <td>当前评估值</td>
                        <td>标准值</td>
                        <td>当前评估值</td>
                        <td>标准值</td>
                        <td>当前评估值</td>
                      </tr>
                      <tr>
                        <td>美国</td>
                        <!--合规刊登率-->
                        <td>{{if newwarehouse.usCorrectListRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.usCorrectListRateSd)}}</td>
                        <td
                        {{if newwarehouse.usCorrectListRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.usCorrectListRate < newwarehouse.usCorrectListRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.usCorrectListRate)}}</td>
                        <!--及时发货率-->
                        <td>{{if newwarehouse.usAscanHtRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.usAscanHtRateSd)}}</td>
                        <td
                        {{if newwarehouse.usAscanHtRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.usAscanHtRate < newwarehouse.usAscanHtRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.usAscanHtRate)}}</td>
                        <!--物品及时送达率-->
                        <td>{{if newwarehouse.usDscanEddRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.usDscanEddRateSd)}}</td>

                        <td
                        {{if newwarehouse.usDscanEddRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.usDscanEddRate < newwarehouse.usDscanEddRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.usDscanEddRate)}}</td>
                        <!--物流不良交易率-->
                        <td>{{if newwarehouse.usShipDefectRateSd != null}}&lt;{{/if}}{{percentToStr(newwarehouse.usShipDefectRateSd)}}</td>
                        <td
                        {{if newwarehouse.usShipDefectRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.usShipDefectRate > newwarehouse.usShipDefectRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.usShipDefectRate)}}</td>
                      </tr>
                      <tr>
                        <td>英国</td>
                        <!--合规刊登率-->
                        <td>{{if newwarehouse.ukCorrectListRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.ukCorrectListRateSd)}}</td>
                        <td
                        {{if newwarehouse.ukCorrectListRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.ukCorrectListRate < newwarehouse.ukCorrectListRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.ukCorrectListRate)}}</td>
                        <!--及时发货率-->
                        <td>{{if newwarehouse.ukAscanHtRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.ukAscanHtRateSd)}}</td>
                        <td
                        {{if newwarehouse.ukAscanHtRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.ukAscanHtRate < newwarehouse.ukAscanHtRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.ukAscanHtRate)}}</td>
                        <!--物品及时送达率-->
                        <td>{{if newwarehouse.ukDscanEddRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.ukDscanEddRateSd)}}</td>

                        <td
                        {{if newwarehouse.ukDscanEddRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.ukDscanEddRate < newwarehouse.ukDscanEddRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.ukDscanEddRate)}}</td>
                        <!--物流不良交易率-->
                        <td>{{if newwarehouse.ukShipDefectRateSd != null}}&lt;{{/if}}{{percentToStr(newwarehouse.ukShipDefectRateSd)}}</td>
                        <td
                        {{if newwarehouse.ukShipDefectRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.ukShipDefectRate > newwarehouse.ukShipDefectRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.ukShipDefectRate)}}</td>
                      </tr>
                      <tr>
                        <td>德国</td>
                        <!--合规刊登率-->
                        <td>{{if newwarehouse.deCorrectListRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.deCorrectListRateSd)}}</td>
                        <td
                        {{if newwarehouse.deCorrectListRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.deCorrectListRate < newwarehouse.deCorrectListRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.deCorrectListRate)}}</td>
                        <!--及时发货率-->
                        <td>{{if newwarehouse.deAscanHtRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.deAscanHtRateSd)}}</td>
                        <td
                        {{if newwarehouse.deAscanHtRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.deAscanHtRate < newwarehouse.deAscanHtRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.deAscanHtRate)}}</td>
                        <!--物品及时送达率-->
                        <td>{{if newwarehouse.deDscanEddRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.deDscanEddRateSd)}}</td>

                        <td
                        {{if newwarehouse.deDscanEddRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.deDscanEddRate < newwarehouse.deDscanEddRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.deDscanEddRate)}}</td>
                        <!--物流不良交易率-->
                        <td>{{if newwarehouse.deShipDefectRateSd != null}}&lt;{{/if}}{{percentToStr(newwarehouse.deShipDefectRateSd)}}</td>
                        <td
                        {{if newwarehouse.deShipDefectRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.deShipDefectRate > newwarehouse.deShipDefectRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.deShipDefectRate)}}</td>
                      </tr>
                      <tr>
                        <td>澳大利亚</td>
                        <!--合规刊登率-->
                        <td>{{if newwarehouse.auCorrectListRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.auCorrectListRateSd)}}</td>
                        <td
                        {{if newwarehouse.auCorrectListRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.auCorrectListRate < newwarehouse.auCorrectListRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.auCorrectListRate)}}</td>
                        <!--及时发货率-->
                        <td>{{if newwarehouse.auAscanHtRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.auAscanHtRateSd)}}</td>
                        <td
                        {{if newwarehouse.auAscanHtRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.auAscanHtRate < newwarehouse.auAscanHtRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.auAscanHtRate)}}</td>
                        <!--物品及时送达率-->
                        <td>{{if newwarehouse.auDscanEddRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.auDscanEddRateSd)}}</td>

                        <td
                        {{if newwarehouse.auDscanEddRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.auDscanEddRate < newwarehouse.auDscanEddRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.auDscanEddRate)}}</td>
                        <!--物流不良交易率-->
                        <td>{{if newwarehouse.auShipDefectRateSd != null}}&lt;{{/if}}{{percentToStr(newwarehouse.auShipDefectRateSd)}}</td>
                        <td
                        {{if newwarehouse.auShipDefectRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.auShipDefectRate > newwarehouse.auShipDefectRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.auShipDefectRate)}}</td>
                      </tr>
                      <tr>
                        <td>其他海外仓</td>
                        <!--合规刊登率-->
                        <td>{{if newwarehouse.otherCorrectListRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.otherCorrectListRateSd)}}</td>
                        <td
                        {{if newwarehouse.otherCorrectListRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.otherCorrectListRate < newwarehouse.otherCorrectListRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.otherCorrectListRate)}}</td>
                        <!--及时发货率-->
                        <td>{{if newwarehouse.otherAscanHtRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.otherAscanHtRateSd)}}</td>
                        <td
                        {{if newwarehouse.otherAscanHtRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.otherAscanHtRate < newwarehouse.otherAscanHtRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.otherAscanHtRate)}}</td>
                        <!--物品及时送达率-->
                        <td>{{if newwarehouse.otherDscanEddRateSd != null}}&gt;{{/if}}{{percentToStr(newwarehouse.otherDscanEddRateSd)}}</td>

                        <td
                        {{if newwarehouse.otherDscanEddRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.otherDscanEddRate < newwarehouse.otherDscanEddRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.otherDscanEddRate)}}</td>
                        <!--物流不良交易率-->
                        <td>{{if newwarehouse.otherShipDefectRateSd != null}}&lt;{{/if}}{{percentToStr(newwarehouse.otherShipDefectRateSd)}}</td>
                        <td
                        {{if newwarehouse.otherShipDefectRateFlag == 1}}
                             class="layui-bg-orange"
                        {{/if}}
                        {{if newwarehouse.otherShipDefectRate > newwarehouse.otherShipDefectRateSd}}
                             style="color:red !important;"
                        {{/if}}
                        >
                        {{percentToStr(newwarehouse.otherShipDefectRate)}}</td>
                    </tr>
                    </tbody>
                  {{/if}}
                  </table>
                </div>
            </div>
            <div class="layui-row">
                <div class="layui-col-md12 layui-col-lg12">
                  <table class="layui-table">
                  {{if warehouse}}
                    <tbody>
                      <tr>
                        <td colspan="5">海外仓标准
                            <span class="{{statusTran(warehouse.warehouse_status).class}}"><b>{{statusTran(warehouse.warehouse_status).text}}</b></span>
                            ({{warehouse.review_start_date}}-{{warehouse.review_end_date}})
                            <br>
                            <span>
                                <b>评估日期:</b>{{warehouse.refreshedDate}}
                                <b>下次评估:</b>{{warehouse.next_evaluation_date}}
                            </span>
                        </td>
                       </tr>
                      <tr>
                        <td>海外仓</td>
                        <td>物流不良交易比例标准值</td>
                        <td>物流不良交易比例当前值</td>
                        <td>非当地发货比例标准值</td>
                        <td>非当地发货比例当前值</td>
                      </tr>
                      <tr>
                        <td>美国</td>
                        <td>{{percentToStr(warehouse.us_ship_defect_sd)}}</td>
                        <td>{{percentToStr(warehouse.us_wh_shipping_defect_rate)}}</td>
                        <td>{{percentToStr(warehouse.us_cbt_sd)}}</td>
                        <td>{{percentToStr(warehouse.us_wh_cbt_trans_rate)}}</td>
                      </tr>
                      <tr>
                        <td>英国</td>
                        <td>{{percentToStr(warehouse.uk_ship_defect_sd)}}</td>
                        <td>{{percentToStr(warehouse.uk_wh_shipping_defect_rate)}}</td>
                        <td>{{percentToStr(warehouse.uk_cbt_sd)}}</td>
                        <td>{{percentToStr(warehouse.uk_wh_cbt_trans_rate)}}</td>
                      </tr>
                      <tr>
                        <td>德国</td>
                        <td>{{percentToStr(warehouse.de_ship_defect_sd)}}</td>
                        <td>{{percentToStr(warehouse.de_wh_shipping_defect_rate)}}</td>
                        <td>{{percentToStr(warehouse.de_cbt_sd)}}</td>
                        <td>{{percentToStr(warehouse.de_wh_cbt_trans_rate)}}</td>
                      </tr>
                      <tr>
                        <td>澳大利亚</td>
                        <td>{{percentToStr(warehouse.au_ship_defect_sd)}}</td>
                        <td>{{percentToStr(warehouse.au_wh_shipping_defect_rate)}}</td>
                        <td>{{percentToStr(warehouse.au_cbt_sd)}}</td>
                        <td>{{percentToStr(warehouse.au_wh_cbt_trans_rate)}}</td>
                      </tr>
                      <tr>
                        <td>其他</td>
                        <td>{{percentToStr(warehouse.other_ship_defect_sd)}}</td>
                        <td>{{percentToStr(warehouse.other_wh_shipping_defect_rate)}}</td>
                        <td>{{percentToStr(warehouse.other_cbt_sd)}}</td>
                        <td>{{percentToStr(warehouse.other_wh_cbt_trans_rate)}}</td>
                    </tr>
                    </tbody>
                  {{/if}}
                  </table>
                </div>
            </div>
        </div>

        <div class="freight">
            <div class="title border_b">货运，物流，纠纷</div>
            <div class="layui-row">
                <div class="layui-col-md12 layui-col-lg12">
                  <table class="layui-table">
                  	{{if shippingAccount}}
                    <tbody>
                      <tr>
                        <td colspan="2">EUB
                        	<span class="{{statusTran(shippingAccount.eubStatus).class}}"><b>{{statusTran(shippingAccount.eubStatus).text}}</b></span>
                        	({{Format(shippingAccount.eubStartTime,"yyyy-MM-dd")}}-{{Format(shippingAccount.eubEndTime,"yyyy-MM-dd")}})
                        </td>
                        <td colspan="2">EDS
                        	<span class="{{statusTran(shippingAccount.edsStatus).class}}"><b>{{statusTran(shippingAccount.edsStatus).text}}</b></span>
                        	({{Format(shippingAccount.edsStartTime,"yyyy-MM-dd")}}-{{Format(shippingAccount.edsEndTime,"yyyy-MM-dd")}})
                        </td>
                        <td colspan="5">SpeedPAK物流
                        	<span class="{{statusTran(shippingAccount.speedpakStatus).class}}"><b>{{statusTran(shippingAccount.speedpakStatus).text}}</b></span>
                        	({{Format(shippingAccount.speedpakStartTime,"yyyy-MM-dd")}}-{{Format(shippingAccount.speedpakEndTime,"yyyy-MM-dd")}})
                        </td>
                        <td colspan="5">
                        	SpeedPAK买家选择
                        </td>
                      </tr>
                      <tr>
                        <td>直邮交易比例</td>
                        <td>海外仓交易比例</td>
                        <td>标准型</td>
                        <td>经济型</td>
                        <td>美国>$5 (要求{{percentToStr(shippingAccount.speedpakUsReq)}})</td>
                        <td>英国>£5 (要求{{percentToStr(shippingAccount.speedpakUkReq)}})</td>
                        <td>德國>€5 (要求{{percentToStr(shippingAccount.speedpakDeReq)}})</td>
                        <td>澳洲>A$8 (要求{{percentToStr(shippingAccount.speedpakAuReq)}})</td>
                        <td>加拿大>C$8 (要求{{percentToStr(shippingAccount.speedpakCaReq)}})</td>
                        <td>加快型</td>
                        <td>标准型</td>
                        <td>经济型</td>
                      </tr>
                      <tr>
                        <td>{{percentToStr(shippingAccount.eubCbtAdoptionPercent)}}({{shippingAccount.eubCbtNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.eubWhAdoptionPercent)}}({{shippingAccount.eubWhNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.edsStdComplyPercent)}}({{shippingAccount.edsStdNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.edsEconComplyPercent)}}({{shippingAccount.edsEconNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.speedpakUsPercent)}}({{shippingAccount.speedpakUsNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.speedpakUkPercent)}}({{shippingAccount.speedpakUkNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.speedpakDePercent)}}({{shippingAccount.speedpakDeNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.speedpakAuPercent)}}({{shippingAccount.speedpakAuNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.speedpakCaPercent)}}({{shippingAccount.speedpakCaNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.speedpakExpeditedPercent)}}({{shippingAccount.speedpakExpeditedNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.speedpakStandardPercent)}}({{shippingAccount.speedpakStandardNum}}笔)</td>
                        <td>{{percentToStr(shippingAccount.speedpakEconomyPercent)}}({{shippingAccount.speedpakEconomyNum}}笔)</td>
                    </tbody>
                    {{/if}}
                  </table>
                </div>
            </div>
            <div class="layui-row">
                <div class="layui-col-md12 layui-col-lg12">
                  <table class="layui-table">
                  	{{if longTermDefects}}
                    <tbody>
                      <tr>
                        <td></td>
                        <td>纠纷表现
                            <span class="{{statusTran(longTermDefects.snad_status_lst_eval).class}}"><b>{{statusTran(longTermDefects.snad_status_lst_eval).text}}</b></span>
                        	({{longTermDefects.dft_lst_eval_beg_dt}}-{{longTermDefects.dft_lst_eval_end_dt}})</td>
                          {{if tciDefect}}
                             <td>非货运表现
                                <span class="{{nonShippingStatusTran(tciDefect.result).class}}"><b>{{nonShippingStatusTran(tciDefect.result).text}}</b></span>
                                ({{tciDefect.reviewStartDt}}-{{tciDefect.reviewEndDt}})
                            </td>
                          {{/if}}
                        <td>货运1-8周
                            {{if shippingDefect}}
                        	<span class="{{statusTran(shippingDefect.result).class}}"><b>{{statusTran(shippingDefect.result).text}}</b></span>
                        	({{shippingDefect.reviewStartDate}}-{{shippingDefect.reviewEndDate}})
                            {{/if}}
                        </td>
                        <td>货运5-12周
                            {{if shippingDefect5T12Wk}}
                        	<span class="{{statusTran(shippingDefect5T12Wk.result).class}}"><b>{{statusTran(shippingDefect5T12Wk.result).text}}</b></span>
                        	({{shippingDefect5T12Wk.reviewStartDate}}-{{shippingDefect5T12Wk.reviewEndDate}})
                            {{/if}}
                        </td>
                      </tr>
                      <tr>
                        <td>超出标准</td>
                        <td>{{percentToStr(longTermDefects.delta_snad_rt_12m_lst_eval)}}</td>
                          {{if tciDefect}}<td>{{tciDefect.nsDefectAdjRt8wk}}</td>{{/if}}
                          <td>
                          {{if shippingDefect && shippingDefect.glbShtmDeRatePre}}
                            {{percentToStr(shippingDefect.glbShtmDeRatePre)}}
                          {{/if}}
                          </td>
                        <td>
                            {{if shippingDefect5T12Wk}}
                            {{percentToStr(shippingDefect5T12Wk.glbShtmDeRatePre)}}
                            {{/if}}
                        </td>
                      </tr>
                      <tr>
                        <td>北美</td>
                        <td>{{percentToStr(longTermDefects.adj_snad_rt_12m_na)}}</td>
                          {{if tciDefect}}<td>{{tciDefect.naNsDefectAdjRt8wk}}</td>{{/if}}
                          <td>
                          {{if shippingDefect}}
                            {{percentToStr(shippingDefect.naShtmRatePre)}}
                          {{/if}}
                          </td>
                        <td>
                            {{if shippingDefect5T12Wk}}
                            {{percentToStr(shippingDefect5T12Wk.naShtmRatePre)}}
                            {{/if}}
                        </td>
                      </tr>
                      <tr>
                        <td>英国</td>
                        <td>{{percentToStr(longTermDefects.adj_snad_rt_12m_uk)}}</td>
                          {{if tciDefect}} <td>{{tciDefect.ukNsDefectAdjRt8wk}}</td>{{/if}}
                          <td>
                          {{if shippingDefect}}
                            {{percentToStr(shippingDefect.ukShtmRatePre)}}
                          {{/if}}
                          </td>
                        <td>
                            {{if shippingDefect5T12Wk}}
                            {{percentToStr(shippingDefect5T12Wk.ukShtmRatePre)}}
                            {{/if}}
                        </td>
                      </tr>
                      <tr>
                        <td>德国</td>
                        <td>{{percentToStr(longTermDefects.adj_snad_rt_12m_de)}}</td>
                          {{if tciDefect}}<td>{{tciDefect.deNsDefectAdjRt8wk}}</td>{{/if}}
                        <td>
                        {{if shippingDefect}}
                            {{percentToStr(shippingDefect.deShtmRatePre)}}
                        {{/if}}
                        </td>
                        <td>
                            {{if shippingDefect5T12Wk}}
                            {{percentToStr(shippingDefect5T12Wk.deShtmRatePre)}}
                            {{/if}}
                        </td>
                      </tr>
                      <tr>
                        <td>澳大利亚</td>
                        <td>{{percentToStr(longTermDefects.adj_snad_rt_12m_au)}}</td>
                          {{if tciDefect}}<td>{{tciDefect.auNsDefectAdjRt8wk}}</td>{{/if}}
                          <td>
                          {{if shippingDefect}}
                            {{percentToStr(shippingDefect.auShtmRatePre)}}
                          {{/if}}
                          </td>
                        <td>
                            {{if shippingDefect5T12Wk}}
                            {{percentToStr(shippingDefect5T12Wk.auShtmRatePre)}}
                            {{/if}}
                        </td>
                      </tr>
                      <tr>
                        <td>其他</td>
                        <td>{{percentToStr(longTermDefects.adj_snad_rt_12m_other)}}</td>
                          {{if tciDefect}}<td>{{tciDefect.glNsDefectAdjRt8wk}}</td>{{/if}}
                          <td>
                          {{if shippingDefect}}
                          {{percentToStr(shippingDefect.othShtmRatePre)}}
                          {{/if}}
                          </td>
                        <td>
                            {{if shippingDefect5T12Wk}}
                            {{percentToStr(shippingDefect5T12Wk.othShtmRatePre)}}
                            {{/if}}
                        </td>
                    </tr>
                    <tr>
                        <td>下次评估时间</td>
                        <td>{{longTermDefects.next_review_dt}}</td>
                        {{if tciDefect}}<td>{{tciDefect.nextEvalDate}}</td>{{/if}}
                        <td>
                        {{if shippingDefect}}
                        {{shippingDefect.nextEvalDate}}
                        {{/if}}
                        </td>
                        <td>
                            {{if shippingDefect5T12Wk}}
                            {{shippingDefect5T12Wk.nextEvalDate}}
                            {{/if}}
                        </td>
                    </tr>
                    <tr>
                        <td>意法西</td>
                        <td>{{percentToStr(longTermDefects.adj_snad_rt_12m_frites)}}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>新兴市场</td>
                        <td>{{percentToStr(longTermDefects.adj_snad_rt_12m_gbh)}}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    </tbody>
                  {{/if}}
                  </table>
                </div>
            </div>
        </div>

        <div class="performance">
                <div class="title">物流标准</div>
            <div class="layui-row">
                <div class="layui-col-md12 layui-col-lg12">
                    <table class="layui-table">
                        {{if directShipping && directShipping.directShipping}}
                        <tbody>
                            <tr>
                                <td></td>
                                <td>被评估交易数</td>
                                <td>合规率</td>
                                <td>最低要求</td>

                            </tr>
                            <tr>
                                <td>所有直邮交易</td>
                                <td>
                                    {{directShipping.directShipping.allSummary.trans}}笔
                                </td>
                                <td>
                                    <span class="{{nonShippingDirectTran(directShipping.directShipping.allSummary.color).class}}">{{percentToStr(directShipping.directShipping.allSummary.adoption)}}</span>
                                </td>
                                <td>
                                    {{percentToStr(directShipping.directShipping.allSummary.requirement)}}
                                </td>
                            </tr>

                            <tr>
                                <td>寄往美国直邮交易</td>
                                <td>
                                    {{if directShipping.directShipping.usSummary}}
                                         {{directShipping.directShipping.usSummary.trans}}笔
                                    {{else}}
                                        -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.usSummary}}
                                    <span class="{{nonShippingDirectTran(directShipping.directShipping.usSummary.color).class}}">{{percentToStr(directShipping.directShipping.usSummary.adoption)}}</span>
                                    {{else}}
                                         -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.usSummary}}
                                        {{percentToStr(directShipping.directShipping.usSummary.requirement)}}
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                            </tr>
                            <tr>
                                <td> 寄往英国直邮交易</td>
                                <td>
                                    {{if directShipping.directShipping.ukSummary}}
                                    {{directShipping.directShipping.ukSummary.trans}}笔
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.ukSummary}}
                                    <span class="{{nonShippingDirectTran(directShipping.directShipping.ukSummary.color).class}}">{{percentToStr(directShipping.directShipping.ukSummary.adoption)}}</span>
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.ukSummary}}
                                    {{percentToStr(directShipping.directShipping.ukSummary.requirement)}}
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                            </tr>
                            <tr>
                                <td> 寄往德国直邮交易</td>
                                <td>
                                    {{if directShipping.directShipping.deSummary}}
                                    {{directShipping.directShipping.deSummary.trans}}笔
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.deSummary}}
                                    <span class="{{nonShippingDirectTran(directShipping.directShipping.deSummary.color).class}}"> {{percentToStr(directShipping.directShipping.deSummary.adoption)}}</span>
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.deSummary}}
                                    {{percentToStr(directShipping.directShipping.deSummary.requirement)}}
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                            </tr>
                            <tr>
                                <td> 寄往澳大利亚直邮交易</td>
                                <td>
                                    {{if directShipping.directShipping.auSummary}}
                                    {{directShipping.directShipping.auSummary.trans}}笔
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.auSummary}}
                                    <span class="{{nonShippingDirectTran(directShipping.directShipping.auSummary.color).class}}"> {{percentToStr(directShipping.directShipping.auSummary.adoption)}}</span>
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.auSummary}}
                                    {{percentToStr(directShipping.directShipping.auSummary.requirement)}}
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                            </tr>
                            <tr>
                                <td> 寄往加拿大直邮交易</td>
                                <td>
                                    {{if directShipping.directShipping.caSummary}}
                                    {{directShipping.directShipping.caSummary.trans}}笔
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.caSummary}}
                                    <span class="{{nonShippingDirectTran(directShipping.directShipping.caSummary.color).class}}">{{percentToStr(directShipping.directShipping.caSummary.adoption)}}</span>
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.caSummary}}
                                    {{percentToStr(directShipping.directShipping.caSummary.requirement)}}
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                            </tr>
                            <tr>
                                <td> 寄往法国、意大利、西班牙直邮交易</td>
                                <td>
                                    {{if directShipping.directShipping.fritesSummary}}
                                    {{directShipping.directShipping.fritesSummary.trans}}笔
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.fritesSummary}}
                                    <span class="{{nonShippingDirectTran(directShipping.directShipping.fritesSummary.color).class}}">{{percentToStr(directShipping.directShipping.fritesSummary.adoption)}}</span>
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.fritesSummary}}
                                    {{percentToStr(directShipping.directShipping.fritesSummary.requirement)}}
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                            </tr>
                            <tr>
                                <td> 寄往其他国家直邮交易</td>
                                <td>
                                    {{if directShipping.directShipping.otherSummary}}
                                    {{directShipping.directShipping.otherSummary.trans}}笔
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.otherSummary}}
                                    <span class="{{nonShippingDirectTran(directShipping.directShipping.otherSummary.color).class}}">{{percentToStr(directShipping.directShipping.otherSummary.adoption)}}</span>
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                                <td>
                                    {{if directShipping.directShipping.otherSummary}}
                                    {{percentToStr(directShipping.directShipping.otherSummary.requirement)}}
                                    {{else}}
                                    -
                                    {{/if}}
                                </td>
                            </tr>
                        </tbody>
                        {{/if}}
                    </table>
                </div>
            </div>
        </div>

        <div class="performance">
            {{if snadClaimData}}

            <div class="title">物品与描述不符纠纷表现  </div>
                <span class="{{nonShippingStatusTran(snadClaimData.result).class}}"><b>{{nonShippingStatusTran(snadClaimData.result).text}}</b></span>
                ({{snadClaimData.reviewStartDt}} - {{snadClaimData.reviewEndDt}})
                <br>
                <span>
                    <b>评估日期:</b>{{snadClaimData.refreshedDate}}
                    <b>下次评估:</b>{{snadClaimData.nextEvalDate}}
                 </span>
            <div class="layui-row">
                <div class="layui-col-md12 layui-col-lg12">
                    <table class="layui-table">
                        <tbody>
                        <tr>
                            <td>国家</td>
                            <td>北美</td>
                            <td>英国</td>
                            <td>澳大利亚</td>
                            <td>德国</td>
                            <td>其他</td>

                        </tr>
                        <tr>
                            <td>物品与描述不符交易率</td>
                            <td>
                                {{snadClaimData.naNsDefectAdjRt}}
                            </td>
                            <td>
                                {{snadClaimData.ukNsDefectAdjRt}}
                            </td>
                            <td>
                                {{snadClaimData.auNsDefectAdjRt}}
                            </td>
                            <td>
                                {{snadClaimData.deNsDefectAdjRt}}
                            </td>
                            <td>
                                {{snadClaimData.glNsDefectAdjRt}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {{/if}}
        </div>
        <div class="businessplan">
            <div class="title border_b">商业计划</div>
            <div class="layui-row">
                <div class="layui-col-md6 layui-col-lg6">
                    <table class="layui-table w_95">
                	{{if pgcTracking}}
                        <tbody>
                          <tr>
                          <td colspan="3">商业计划表现
                          	<span class="{{spcStatusTran(pgcTracking.pgcStatus).class}}"><b>{{spcStatusTran(pgcTracking.pgcStatus).text}}</b></span>
                          	({{pgcTracking.refreshedDate}})
                          </td>
                         </tr>
                         <tr>
                           <td>指标</td>
                           <td>标准值</td>
                           <td>状态</td>
                         </tr>
                         <tr>
                           <td>累计营业额($)</td>
                           <td>>{{pgcTracking.accountCmltvStd}}</td>
                           <td>
                           	{{if pgcTracking.accountCmltv ==0}}
                           	<span class="accGreen"><b>达标</b></span>
                           	{{else if pgcTracking.accountCmltv == 1}}
                           	<span class="accRed"><b>不达标</b></span>
                           	{{else}}
                           	<span class=""><b>无数据</b></span>
                           	{{/if}}
                           </td>
                         </tr>
                         <tr>
                           <td>是否已被冻结</td>
                           <td>{{pgcTracking.suspensionStd}}</td>
                           <td>
                           	{{if pgcTracking.suspensionSts ==0}}
                           	<span class="accGreen"><b>达标</b></span>
                           	{{else if pgcTracking.suspensionSts == 1}}
                           	<span class="accRed"><b>不达标</b></span>
                           	{{else}}
                           	<span class=""><b>无数据</b></span>
                           	{{/if}}
                           </td>
                         </tr>
                         <tr>
                           <td>>重复刊登违规</td>
                           <td>{{pgcTracking.duplicateStd}}</td>
                           <td>
                           	{{if pgcTracking.duplicateSts ==0}}
                           	<span class="accGreen"><b>达标</b></span>
                           	{{else if pgcTracking.duplicateSts == 1}}
                           	<span class="accRed"><b>不达标</b></span>
                           	{{else}}
                           	<span class=""><b>无数据</b></span>
                           	{{/if}}
                           </td>
                         </tr>
                         <tr>
                          <td>>目标站点完成率</td>
                          <td>>{{pgcTracking.cridr_as_std}}</td>
                          <td>
                           	{{if pgcTracking.cridr_as_promised ==0}}
                           	<span class="accGreen"><b>达标</b></span>
                           	{{else if pgcTracking.cridr_as_promised == 1}}
                           	<span class="accRed"><b>不达标</b></span>
                           	{{else}}
                           	<span class=""><b>无数据</b></span>
                           	{{/if}}
                           </td>
                        </tr>
                          <tr>
                            <td>>目标品类完成率</td>
                            <td>{{pgcTracking.cat_as_std}}</td>
                            <td>
	                           	{{if pgcTracking.cat_as_promised ==0}}
	                           	<span class="accGreen"><b>达标</b></span>
	                           	{{else if pgcTracking.cat_as_promised == 1}}
	                           	<span class="accRed"><b>不达标</b></span>
	                           	{{else}}
	                           	<span class=""><b>无数据</b></span>
	                           	{{/if}}
                            </td>
                          </tr>
                          <tr>
                            <td>>目标客单价完成率</td>
                            <td>>{{pgcTracking.asp_as_std}}</td>
                            <td>
	                           	{{if pgcTracking.asp_as_promised ==0}}
	                           	<span class="accGreen"><b>达标</b></span>
	                           	{{else if pgcTracking.asp_as_promised == 1}}
	                           	<span class="accRed"><b>不达标</b></span>
	                           	{{else}}
	                           	<span class=""><b>无数据</b></span>
	                           	{{/if}}
                            </td>
                          </tr>
                          <tr>
                            <td>>账号不良交易率</td>
                            <td>{{pgcTracking.dft_std}}</td>
                            <td>
	                           	{{if pgcTracking.dft_sts ==0}}
	                           	<span class="accGreen"><b>达标</b></span>
	                           	{{else if pgcTracking.dft_sts == 1}}
	                           	<span class="accRed"><b>不达标</b></span>
	                           	{{else}}
	                           	<span class=""><b>无数据</b></span>
	                           	{{/if}}
                            </td>
                          </tr>
                          <tr>
                            <td>>海外仓使用率</td>
                            <td>{{pgcTracking.wh_std}}</td>
                            <td>
	                           	{{if pgcTracking.wh_sts ==0}}
	                           	<span class="accGreen"><b>达标</b></span>
	                           	{{else if pgcTracking.wh_sts == 1}}
	                           	<span class="accRed"><b>不达标</b></span>
	                           	{{else}}
	                           	<span class=""><b>无数据</b></span>
	                           	{{/if}}
                            </td>
                         </tr>
                         <tr>
                            <td>>平均月销售额</td>
                            <td>>{{pgcTracking.avg_gmv_std}}</td>
                            <td>
	                           	{{if pgcTracking.avg_gmv_sts ==0}}
	                           	<span class="accGreen"><b>达标</b></span>
	                           	{{else if pgcTracking.avg_gmv_sts == 1}}
	                           	<span class="accRed"><b>不达标</b></span>
	                           	{{else}}
	                           	<span class=""><b>无数据</b></span>
	                           	{{/if}}
                            </td>
                         </tr>
                        </tbody>
                      {{/if}}
                      </table>
                </div>
                <div class="layui-col-md6 layui-col-lg6">
                    <table class="layui-table w_95 fr">
                	{{if pgcTracking}}
                      <tbody>
                        <tr>
                        <td colspan="2">商业计划内容(提交时间  {{pgcTracking.refreshedDate}})</td>
                       </tr>
                       <tr>
                         <td>主要销售国家</td>
                         <td>{{pgcTracking.primary_corridor}}</td>
                       </tr>
                       <tr>
                         <td>次要销售国家</td>
                         <td>{{pgcTracking.secondary_corridor}}</td>
                       </tr>
                       <tr>
                         <td>主要产品所属一级分类</td>
                         <td>{{pgcTracking.primary_vertical}}</td>
                       </tr>
                       <tr>
                          <td>主要产品所属二级分类</td>
                          <td>{{pgcTracking.primary_category}}</td>
                        </tr>
                        <tr>
                          <td>次要产品所属一级分类</td>
                          <td>{{pgcTracking.secondary_vertical}}</td>
                        </tr>
                        <tr>
                          <td>次要产品所属二级分类</td>
                          <td>{{pgcTracking.secondary_category}}</td>
                        </tr>
                        <tr>
                          <td>主营产品预估平均单价（美金）</td>
                          <td>{{pgcTracking.estimated_item_asp_usd}}</td>
                      </tr>
                      <tr>
                          <td>仓储所在地</td>
                          <td>{{pgcTracking.location_of_warehouse}}</td>
                      </tr>                    <tr>
                          <td>海外仓存货销售占比</td>
                          <td>{{pgcTracking.warehouse_adoption_rate}}</td>
                      </tr>
                      </tbody>
              {{/if}}
                    </table>
                  </div>
              </div>
        </div>
    </div>
  </script>
  <!-- 详情弹框 -->
<!-- 时间格式化 -->
<script>
		//TODO delete
        function timestampToTime(timestamp) {
            var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            return Y + M + D + h + m + s;
        }
        
        function percentToStr(percent){
        	if(!isNaN(percent) && percent!=null){
        		return (percent*100).toFixed(2) + "%"
        	}else{
        		return "-";
        	}
        }
        
        function levelTran(str){
        	if(typeof(str)=='undefined' || str == null){
        		str = "-1";
        	}
            var obj ={'TOP_RATED':{'text':'优秀','class':'accGreen'},
            	'ABOVE_STANDARD':{'text':'合格','class':''},
              'BELOW_STANDARD':{'text':'不合格','class':'accRed'},
            	'-1':{'text':'无数据','class':''}}
            return obj[str];
        }

		function statusTran(str){
			if(typeof(str)=='undefined' || str == null){
        		str = "-1";
        	}
			var obj = {'0':{'imgPath':'${ctx}/static/img/tick.png','text':'正常','class':"accGreen"},
                    '1':{'imgPath':'${ctx}/static/img/over.png','text':'超标','class':"accRed"},
                    '2':{'imgPath':'${ctx}/static/img/tips.png','text':'警告','class':"accRed"},
                    '3':{'imgPath':'${ctx}/static/img/warn.png','text':'限制','class':"accRed"},
                    '4':{'imgPath':'${ctx}/static/img/warn.png','text':'不考核','class':"accRed"},
                    '-1':{'imgPath':'','alter':'无数据','text':'','class':""}
				}
			return obj[str];
		}
		function newwarehouseTran(str){
            if(typeof(str)=='undefined' || str == null){
                str = "-1";
            }
            var obj = {'0':{'imgPath':'${ctx}/static/img/tick.png','text':'正常','class':"accGreen"},
                    '1':{'imgPath':'${ctx}/static/img/over.png','text':'超标','class':"accRed"},
                    '2':{'imgPath':'${ctx}/static/img/tips.png','text':'警告','class':"accRed"},
                    '3':{'imgPath':'${ctx}/static/img/warn.png','text':'限制','class':"accRed"},
                    '-1':{'imgPath':'','alter':'无数据','text':'','class':""}
                }
            return obj[str];
        }
		function nonShippingStatusTran(str){
			if(typeof(str)=='undefined' || str == null){
        		str = "-1";
        	}
			var obj = {'1':{'imgPath':'${ctx}/static/img/tick.png','text':'正常','class':"accGreen"},
                    '2':{'imgPath':'${ctx}/static/img/tips.png','text':'警告','class':"accRed"},
                    '3':{'imgPath':'${ctx}/static/img/over.png','text':'超标','class':"accRed"},
                    '4':{'imgPath':'${ctx}/static/img/warn.png','text':'限制','class':"accRed"},
                    '5':{'imgPath':'${ctx}/static/img/wrong.png','text':'永久限制','class':"accRed"},
                    '6':{'imgPath':'${ctx}/static/img/wrong.png','text':'永久限制','class':"accRed"},
                    '-1':{'imgPath':'','alter':'无数据','text':'','class':""}
				}
			return obj[str];
		}
        function nonShippingDirectTran(str){
            if(typeof(str)=='undefined' || str == null){
                str = "-1";
            }
            var obj = {'1':{'imgPath':'${ctx}/static/img/tick.png','text':'正常','class':"accRed"},
                '2':{'imgPath':'${ctx}/static/img/tips.png','text':'警告','class':"accGreen"},
                '3':{'imgPath':'${ctx}/static/img/over.png','text':'超标','class':"accGreen"},
                '4':{'imgPath':'${ctx}/static/img/warn.png','text':'限制','class':"accGreen"},
                '-1':{'imgPath':'','alter':'无数据','text':'','class':""}
            }
            return obj[str];
        }
		function spcStatusTran(str){
			if(typeof(str)=='undefined'|| str == null){
        		str = "-1";
        	}
			var obj = {'0':{'imgPath':'${ctx}/static/img/tick.png','text':'正常','class':"accGreen"},
                    '1':{'imgPath':'${ctx}/static/img/over.png','text':'超标','class':"accRed"},
                    '2':{'imgPath':'${ctx}/static/img/tips.png','text':'警告','class':"accRed"},
                    '3':{'imgPath':'${ctx}/static/img/warn.png','text':'限制','class':"accRed"},
                    '4':{'imgPath':'${ctx}/static/img/warn.png','text':'不考核','class':"accRed"},
                    '-1':{'imgPath':'','alter':'无数据','text':'','class':""}
				}
			return obj[str];
		}
		
		template.defaults.imports.percentToStr = function(percent){
			return percentToStr(percent);
		};
		template.defaults.imports.levelTran = function(str){
			return levelTran(str);
		};
		template.defaults.imports.statusTran = function(str){
			return statusTran(str);
		};
        template.defaults.imports.newwarehouseTran = function(str){
          return newwarehouseTran(str);
        };
		template.defaults.imports.nonShippingStatusTran = function(str){
			return nonShippingStatusTran(str);
		};
        template.defaults.imports.nonShippingDirectTran = function(str){
            return nonShippingDirectTran(str);
        };
		template.defaults.imports.spcStatusTran = function(str){
			return spcStatusTran(str);
		};
		template.defaults.imports.Format = function(time,formatStr){
			return Format(time,formatStr);
		};

    </script>
<!-- 时间格式化 -->
<!-- 表格渲染模板 -->
<script type="text/html" id="accountTem">
    <div data-id="{{d.storeAcctId}}" onclick="afDetail({{d.storeAcctId}})">
    	{{# if(d.syncStatus){ }}
	    <span class="af_storeAcct point_st pora copySpan">
          <a href="javascript:;">{{d.storeAcctName}}</a>
          <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
      </span>
	    <pre class="layui-hide">同步成功:{{ Format(d.syncTime,"yyyy-MM-dd hh:mm:ss")}}</pre>
	    {{# }else{ }}
	    <span class="af_storeAcct point_st pora copySpan" style="color:red">
          <a href="javascript:;">{{d.storeAcctName}}</a>
          <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
      </span>
	    <pre class="layui-hide">同步失败:{{d.syncDesc}}</pre>
	    {{# } }}
    </div>
</script>
<!-- 卖家总览 -->
<script type="text/html" id="gloMatchTimeTem">
{{ Format(d.globalEvaluationStartDate,"yyyy-MM-dd")}}<br/>
{{ Format(d.globalEvaluationEndDate,"yyyy-MM-dd")}}
</script>
<script type="text/html" id="ukMatchTimeTem">
	{{ Format(d.ukEvaluationStartDate,"yyyy-MM-dd")}}<br/>
	{{ Format(d.ukEvaluationEndDate,"yyyy-MM-dd")}}
</script>
<script type="text/html" id="usMatchTimeTem">
	{{ Format(d.usEvaluationStartDate,"yyyy-MM-dd")}}<br/>
	{{ Format(d.usEvaluationEndDate,"yyyy-MM-dd")}}
</script>
<script type="text/html" id="deMatchTimeTem">
	{{ Format(d.deEvaluationStartDate,"yyyy-MM-dd")}}<br/>
	{{ Format(d.deEvaluationEndDate,"yyyy-MM-dd")}}
</script>
<script type="text/html" id="gloCurrLevel">
      <span class="{{levelTran(d.globalCurrentLevel).class}}">{{levelTran(d.globalCurrentLevel).text}}</span>
</script>
<script type="text/html" id="gloPreLevel">
    <span class="{{levelTran(d.globalProjectedLevel).class}}">{{levelTran(d.globalProjectedLevel).text}}</span>
</script>
<script type="text/html" id="usCurrLevel">
    <span class="{{levelTran(d.usCurrentLevel).class}}">{{levelTran(d.usCurrentLevel).text}}</span>
</script>
<script type="text/html" id="usPreLevel">
    <span class="{{levelTran(d.usProjectedLevel).class}}">{{levelTran(d.usProjectedLevel).text}}</span>
</script>
<script type="text/html" id="ukCurrLevel">
    <span class="{{levelTran(d.ukCurrentLevel).class}}">{{levelTran(d.ukCurrentLevel).text}}</span>
</script>
<script type="text/html" id="ukPreLevel">
    <span class="{{levelTran(d.ukCurrentLevel).class}}">{{levelTran(d.ukCurrentLevel).text}}</span>
</script>
<script type="text/html" id="ukCurrLevel">
    <span class="{{levelTran(d.ukProjectedLevel).class}}">{{levelTran(d.ukProjectedLevel).text}}</span>
</script>
<script type="text/html" id="germCurrLevel">
    <span class="{{levelTran(d.deCurrentLevel).class}}">{{levelTran(d.deCurrentLevel).text}}</span>
</script>
<script type="text/html" id="germPreLevel">
    <span class="{{levelTran(d.deProjectedLevel).class}}">{{levelTran(d.deProjectedLevel).text}}</span>
</script>
<!-- 卖家总览 -->
<!-- 账号表现 -->
<script type="text/html" id="longTermStatus">
    {{# if(typeof(d.longTermStatus)!="undefined"&&d.longTermStatus!=-1){ }}
    <img src="{{statusTran(d.longTermStatus).imgPath}}" alt="{{statusTran(d.longTermStatus).alter}}" width='30' height='30'>{{statusTran(d.longTermStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="newwarehouseStatus">
    {{# if(typeof(d.newwarehouseStatus)!="undefined"&&d.newwarehouseStatus!=-1){ }}
    <img src="{{newwarehouseTran(d.newwarehouseStatus).imgPath}}" alt="{{newwarehouseTran(d.newwarehouseStatus).alter}}" width='30' height='30'>{{newwarehouseTran(d.newwarehouseStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="shippingStatus1">
    {{# if(typeof(d.shippingStatus1)!="undefined"&&d.shippingStatus1!=-1){ }}
    <img src="{{statusTran(d.shippingStatus1).imgPath}}" alt="{{statusTran(d.shippingStatus1).alter}}" width='30' height='30'>{{statusTran(d.shippingStatus1).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="shippingStatus2">
    {{# if(typeof(d.shippingStatus2)!="undefined"&&d.shippingStatus2!=-1){ }}
    <img src="{{statusTran(d.shippingStatus2).imgPath}}" alt="{{statusTran(d.shippingStatus2).alter}}" width='30' height='30'>{{statusTran(d.shippingStatus2).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="accountNonShippingStatus">
    {{# if(typeof(d.nonShippingStatus)!="undefined"&&d.nonShippingStatus!=-1){ }}
    <img src="{{nonShippingStatusTran(d.nonShippingStatus).imgPath}}" alt="{{nonShippingStatusTran(d.nonShippingStatus).alter}}" width='30' height='30'>{{nonShippingStatusTran(d.nonShippingStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="eubStatus">
    {{# if(typeof(d.eubStatus)!="undefined"&&d.eubStatus!=-1){ }}
    <img src="{{statusTran(d.eubStatus).imgPath}}" alt="{{statusTran(d.eubStatus).alter}}" width='30' height='30'>{{statusTran(d.eubStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="edsStatus">
    {{# if(typeof(d.edsStatus)!="undefined"&&d.edsStatus!=-1){ }}
    <img src="{{statusTran(d.edsStatus).imgPath}}" alt="{{statusTran(d.edsStatus).alter}}" width='30' height='30'>{{statusTran(d.edsStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="speedPakStatus">
    {{# if(typeof(d.speedPakStatus)!="undefined"&&d.speedPakStatus!=-1){ }}
    <img src="{{statusTran(d.speedPakStatus).imgPath}}" alt="{{statusTran(d.speedPakStatus).alter}}" width='30' height='30'>{{statusTran(d.speedPakStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="speedpakStatus">
    {{# if(typeof(d.speedpakStatus)!="undefined"&&d.speedpakStatus!=-1){ }}
    <img src="{{statusTran(d.speedpakStatus).imgPath}}" alt="{{statusTran(d.speedpakStatus).alter}}" width='30' height='30'>{{statusTran(d.speedpakStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="warehouseStatus">
    {{# if(typeof(d.warehouseStatus)!="undefined"&&d.warehouseStatus!=-1){ }}
    <img src="{{statusTran(d.warehouseStatus).imgPath}}" alt="{{statusTran(d.warehouseStatus).alter}}" width='30' height='30'>{{statusTran(d.warehouseStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="pgcStatus">
    {{# if(typeof(d.pgcStatus)!="undefined"&&d.pgcStatus!=-1){ }}
    <img src="{{spcStatusTran(d.pgcStatus).imgPath}}" alt="{{spcStatusTran(d.pgcStatus).alter}}" width='30' height='30'>{{spcStatusTran(d.pgcStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>

<script type="text/html" id="prodDescStatus">
    {{# if(typeof(d.snadclaimStatus)!="undefined"&&d.snadclaimStatus!=-1){ }}
    <img src="{{nonShippingStatusTran(d.snadclaimStatus).imgPath}}" alt="{{nonShippingStatusTran(d.snadclaimStatus).alter}}" width='30' height='30'>{{nonShippingStatusTran(d.snadclaimStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="directPostStatus">
    {{# if(typeof(d.directShippingStatus)!="undefined"&&d.directShippingStatus!=-1){ }}
    <img src="{{statusTran(d.directShippingStatus).imgPath}}" alt="{{statusTran(d.directPodirectShippingStatusstStatus).alter}}" width='30' height='30'>{{statusTran(d.directShippingStatus).text}}
    {{# }else{ }}
    无数据
    {{# } }}
</script>
<script type="text/html" id="amountHistoryValue">
    {{# if(typeof(d.amountHistoryValue) != "undefined"){ }}
    <span>{{d.amountHistoryValue}}{{d.amountHistoryValueCurrency}}</span> {{# }else{ }} 无数据 {{# } }}
</script>
<script type="text/html" id="totalSoldValue">
    {{# if(typeof(d.totalSoldValue) != "undefined"){ }}
    <span>{{d.totalSoldValue}}{{d.totalSoldValueCurrency}}</span> {{# }else{ }} 无数据 {{# } }}
</script>
<script type="text/html" id="amountLimitRemaining">
    {{# if(typeof(d.amountLimitRemaining) != "undefined"){ }}
    <span>{{d.amountLimitRemaining}}{{d.amountLimitRemainingCurrency}}</span> {{# }else{ }} 无数据 {{# } }}
</script>

<script type="text/html" id="ebay_accountTem_toolbar">
  <a href="javascript:;" type="button" class="layui-btn layui-btn-sm" lay-event="sync">同步</a>
</script>
<!-- 账号表现 -->
<!-- 表格渲染模板 -->

<!--提额指标具体表格  -->
<script type="text/html" id="ebay_accountTem_withdrawal_Index_tpl">
  <div class="layui-card">
    <div class="layui-card-body">
      <table class="layui-table" id="ebay_accountTem_withdrawal_Index_table" lay-filter="ebay_accountTem_withdrawal_Index_table"></table>
    </div>
  </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/accperformance.js"></script>