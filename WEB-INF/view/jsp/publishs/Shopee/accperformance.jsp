<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<title>shopee账号表现</title>
<style>
  .border_b{
    border-bottom:1px solid #e6e6e6;
  }
  .border_all{
    border:1px solid #e6e6e6;
  }
 a.shopId {
     color: #428bca;
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

    img.shopee_imgCss {
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

  .fr{
    float: right!important;
  }
  .accRed {
    color: #FF5722;
    font-size: 14px
  }
  .accGreen {
    color: green;
    font-size: 14px
  }

  .w_50{
    width: 50%;
  }

  .point_st{
    cursor: pointer;
  }
  .m_10{
    margin:10px;
  }

  .chooseimg_row{
    margin-top:15px;
    display:flex;
    justify-content: flex-start;
    align-items:center;
    margin-left:110px;
    vertical-align: middle;
  }
#div_prev{
    display:flex;
    justify-content: flex-start;
    align-items:center;
    vertical-align: middle;  
}
  .w_100{
    width: 100px !important;
  }
  .img img{
      width: 60px;
      height:60px;
      border:1px solid #ccc;
      margin-right: 5px;
  }
  .showimg{
      width: 500px;
      height: 500px;
      border:1px solid #ccc
  }
  .close{
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
      cursor:pointer;
  }
  .close:hover{
    background: #aaa;
    font-size: 14px;
  }

  .icon_font{
      font-size: 36px;
      opacity: .5;
      cursor: pointer;
      color:#4e4e4e;
  }

</style>
<div class="layui-col-md12 layui-col-lg12" id="shoppeeaccplay_report">
    <div class="layui-card">
    <div class="layui-card-body">
        <div class="layui-card-body">
            <form class="layui-form" lay-filter="component-form-group" id="shopee_accper_searchForm">
                <div class="layui-form-item">
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">部门</label>
                        <div class="layui-input-block">
                            <select  id="shopee_accer_depart_sel" name="orgId" lay-search lay-filter="shopee_accer_depart_sel"  class="orgs_hp_custom">
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">销售人员</label>
                        <div class="layui-input-block">
                            <select  id="shopee_accer_salesman_sel" name="salespersonId" lay-search lay-filter="shopee_accer_salesman_sel"  class="users_hp_custom" data-rolelist="shopee专员" >
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2" >
                        <label class="layui-form-label">店铺</label>
                        <div class="layui-input-block" id="shopee_accer_store_sel_div">
                            <select id="shopee_accer_store_sel" xm-select="shopee_accer_store_sel" name="storeAcctIds" xm-select-search  lay-filter="shopee_accer_store_sel"   class="users_hp_store_multi" data-platcode="shopee" xm-select-search-type="dl" xm-select-skin="normal">
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3 hidden onlyStoreInfoPublishSaleTab">
                        <label class="layui-form-label">站点</label>
                        <div class="layui-input-block">
                        <select name="salesSites" xm-select-search xm-select="shopee_accer_site" class="salesSite_hp_custom">
                            <option value=""></option>
                        </select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">客服</label>
                        <div class="layui-input-block">
                            <select  id="shopee_accer_customServicer_sel" name="customServicerId" lay-search></select>
                        </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2 notInStoreRate">
                        <label class="layui-form-label">店铺标签</label>
                        <div class="layui-input-block">
                          <select name="storeTagList"
                              xm-select="shopee_accper_storeTagList"
                              lay-filter="shopee_accper_storeTagList"
                              xm-select-search
                              xm-select-search-type="dl"
                              xm-select-skin="normal"
                          ></select>
                        </div>
                      </div>
                    <!-- <div class="layui-col-lg2 layui-col-md2 hidden onlyStoreInfoTab">
                        <label class="layui-form-label">店铺图片数量</label>
                        <div class="layui-input-block">
                            <select name="imgSizes" xm-select-search xm-select="shopee_accperformance_picNum">
                                <option value="">请选择</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div> -->
                    <div class="layui-col-md2 layui-col-lg2 showInAccPerformancePublishSale">
                        <label class="layui-form-label">GP</label>
                        <div class="layui-input-block">
                            <select name="merchantNameList"
                                xm-select="shopee_accper_search_GP"
                                lay-filter="shopee_accper_search_GP"
                                xm-select-search
                                xm-select-search-type="dl"
                                xm-select-skin="normal"
                            ></select>
                        </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2" style="padding-left: 20px;">
                        <button type="button" class="layui-btn layui-btn-sm" id="shopee_accper_search">查询</button>
                        <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary" id="shopee_accperformance_search_reset">清空</button>
                        <button type="button" class="layui-btn layui-btn-sm" id="exportBtn_shopee">导出表格</button>
                    </div>
                </div>
            </form>
        </div>
    <div class="layui-tab table_tab" id="shopeeaccperformCard">
        <div class="disflex layui-card-header">
            <ul class="layui-tab-title" style="display:inline-block;">
                <li class="layui-this" data-title="acc_Performance">账号表现(<span id="shopee_accper_dataCount_num1"></span>)</li>
                <li data-title="store_Info">店铺信息(<span id="shopee_accper_dataCount_num2"></span>)</li>
                <li data-title="store_rate">店铺达标率统计(<span id="shopee_accper_dataCount_num3"></span>)</li>
                <li data-title="publish_sale">刊登及销售表现(<span id="shopee_accper_dataCount_num4"></span>)</li>
            </ul>
            <div class="disflex mt05" style="flex:1;">
                <div class="onlyPublishSaleTab hidden ml10" style="flex:1">!日均单数=合计单数/统计单数,四舍五入保留俩位小数</div>
                <!-- <div class="hidden onlyStoreInfoTab" style="flex:1">
                    <form action="" class="layui-form disflex">
                        <div class="layui-form-item" style="margin-top: 0;">
                            <label class="layui-form-label">图片URL<font class="fRed">*</font></label>
                            <div class="layui-input-block disflex">
                                <input type="text" class="layui-input" name="picUrl">
                                <select name="picOperat">
                                    <option value="add">新增图片</option>
                                    <option value="replace">替换首图</option>
                                    <option value="restore">还原</option>
                                </select>
                            </div>
                        </div>
                        <a href="javascript:;" type="button" class="layui-btn layui-btn-sm ml10" id="shopee_accper_picConfim">确认</a>
                    </form>
                    <a href="javascript:;" type="button" class="layui-btn layui-btn-sm ml20" id="shopee_accper_batchConfirm">批量修改</a>
                </div> -->
            </div>
        </div>
        <div class="layui-tab-content">
            <div class="layui-tab-item  layui-show">
                <table class="layui-table" id="shopee_accper_data_table" lay-filter="acc_Performance"></table>
           </div>
        </div>
      </div>
    </div>
    </div>
</div>

<script type="text/html" id="shopee_accer_store_sel_tpl">
    {{#  if(d==='store_rate'){ }}
        <select id="shopee_accer_store_sel" lay-search class="store_hp_custom" data-platcode="shopee" name="storeId">
            <option value=""></option>
        </select>
        {{#  }else{ }}
        <select id="shopee_accer_store_sel" xm-select="shopee_accer_store_sel" name="storeAcctIds" xm-select-search  lay-filter="shopee_accer_store_sel"   class="users_hp_store_multi" data-platcode="shopee" xm-select-search-type="dl" xm-select-skin="normal">
            <option value=""></option>
        </select>
        {{#  } }}
</script>

<!-- 表格数据渲染模板 -->
<script type="text/html" id="operationTpl">
  <button class="layui-btn layui-btn-xs layui-btn-primary" onclick="shopeeAccper_modifypic(this,'{{d.storeAcctId}}')">修改</button>
</script>
<!--账号以及同步状态-->
<script type="text/html" id="accountTem_shopee">
    {{# if(d.syncStatus){ }}
        <span class="shopee_storeAcct point_st">{{d.storeAcctName}}<br>({{d.shopId||''}})</span>
         <pre class="layui-hide">同步成功:{{ Format(d.syncTime,"yyyy-MM-dd hh:mm:ss")}}</pre>
    {{# }else{ }}
        <span class="shopee_storeAcct point_st" style="color:red">{{d.storeAcctName}}<br>({{d.shopId||''}})</span>
        <pre class="layui-hide">同步失败:{{d.syncDesc}},同步时间：{{ Format(d.syncTime,"yyyy-MM-dd hh:mm:ss")}} </pre>
    {{# } }}
    {{#  if(d.storeTagList && d.storeTagList.length){ }}
        {{# layui.each(d.storeTagList, function(_, tagitem){ }}
            <span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">{{tagitem}}</span>
        {{# }) }}
    {{# } }}
</script>
<!-- 取消率 -->
<script type="text/html" id="cancellationRate_shopee">
    {{# if(d.cancellationRateMy != null){ }}
        {{# if(d.cancellationRateTarget > d.cancellationRateMy){ }}
                <span class="cancellationRate_shopee point_st" style="color:green">{{d.cancellationRateMy+"%"}}</span>
                <pre class="layui-hide" style="color:green">取消率指标:{{d.cancellationRateTarget + "%,低于指标:" + (d.cancellationRateTarget- d.cancellationRateMy).toFixed(2)+"%"}}</pre>
            {{# }else{ }}
                <span class="cancellationRate_shopee point_st" style="color:red">{{d.cancellationRateMy+"%"}}</span>
                <pre class="layui-hide">取消率指标:{{d.cancellationRateTarget + "%,超出指标:" + (d.cancellationRateMy - d.cancellationRateTarget).toFixed(2) +"%"}}</pre>
             {{# } }}
    {{# }else{ }}
        无数据
    {{# } }}
</script>
<!-- 未完成率 -->
<script type="text/html" id="non_shopee">
    {{# if(d.nonFulfillmentRateMy != null){ }}
        {{# if(d.nonFulfillmentRateTarget > d.nonFulfillmentRateMy){ }}
                <span class="non_shopee point_st" style="color:green">{{d.nonFulfillmentRateMy+"%"}}</span>
                <pre class="layui-hide" style="color:green">未完成率指标:{{d.nonFulfillmentRateTarget + "%,低于指标:" + (d.nonFulfillmentRateTarget - d.nonFulfillmentRateMy).toFixed(2) +"%"}}</pre>
            {{# }else{ }}
                <span class="non_shopee point_st" style="color:red">{{d.nonFulfillmentRateMy+"%"}}</span>
                <pre class="layui-hide">未完成率指标:{{d.nonFulfillmentRateTarget + "%,超出指标:" + (d.nonFulfillmentRateMy - d.nonFulfillmentRateTarget).toFixed(2) +"%"}}</pre>
        {{# } }}
    {{# }else{ }}
            无数据
    {{# } }}
</script>
<!-- 退货退款率 -->
<script type="text/html" id="return_refund_rate_shopee">
    {{# if(d.returnRefundRateMy != null){ }}
            {{# if(d.returnRefundRateTarget > d.returnRefundRateMy){ }}
            <span class="non_shopee point_st" style="color:green">{{d.returnRefundRateMy+"%"}}</span>
            <pre class="layui-hide" style="color:green">退货退款率指标:{{d.returnRefundRateTarget + "%,低于指标:" + (d.returnRefundRateTarget - d.returnRefundRateMy).toFixed(2) +"%"}}</pre>
            {{# }else{ }}
            <span class="non_shopee point_st" style="color:red">{{d.nonFulfillmentRateMy+"%"}}</span>
            <pre class="layui-hide">退货退款率指标:{{d.returnRefundRateTarget + "%,超出指标:" + (d.returnRefundRateMy - d.returnRefundRateTarget).toFixed(2) +"%"}}</pre>
            {{# } }}
    {{# }else{ }}
        无数据
    {{# } }}
</script>
<!-- 平均备货 -->
<script type="text/html" id="average_shopee">
    {{# if(d.averagePreparationTimeMy != null){ }}
        {{# if(d.averagePreparationTimeTarget >= d.averagePreparationTimeMy){ }}
            <span class="average_shopee point_st" style="color:green">{{d.averagePreparationTimeMy}}</span>
            <pre class="layui-hide" style="color:green">平均备货时间指标:{{d.averagePreparationTimeTarget + "天,低于指标:" + (d.averagePreparationTimeTarget - d.averagePreparationTimeMy).toFixed(2) +"天"}}</pre>
        {{# }else{ }}
            <span class="average_shopee point_st" style="color:red">{{d.averagePreparationTimeMy}}</span>
            <pre class="layui-hide">平均备货时间指标:{{d.averagePreparationTimeTarget + "天,超出指标:" + (d.averagePreparationTimeMy - d.averagePreparationTimeTarget).toFixed(2) +"天"}}</pre>
        {{# } }}
    {{# }else{ }}
            无数据
    {{# } }}
</script>
<!-- 延迟发货率 -->
<script type="text/html" id="late_shopee">
    {{# if(d.lateShipmentRateTypeMy != null){ }}
        {{# if(d.lateShipmentRateTypeTarget > d.lateShipmentRateTypeMy){ }}
            <span class="late_shopee point_st" style="color:green">{{d.lateShipmentRateTypeMy+"%"}}</span>
            <pre class="layui-hide" style="color:green">延迟发货率指标:{{d.lateShipmentRateTypeTarget + "%,低于指标:" + (d.lateShipmentRateTypeTarget - d.lateShipmentRateTypeMy) +"%"}}</pre>
        {{# }else{ }}
            <span class="late_shopee point_st" style="color:red">{{d.lateShipmentRateTypeMy+"%"}}</span>
            <pre class="layui-hide">延迟发货率指标:{{d.lateShipmentRateTypeTarget + "%,超出指标:" + (d.lateShipmentRateTypeMy - d.lateShipmentRateTypeTarget) +"%"}}</pre>
        {{# } }}
    {{# }else{ }}
            无数据
    {{# } }}
</script>

<!-- 商品评分 -->
<script type="text/html" id="review_shopee">
    {{# if(d.reviewRatingMy != null ){ }}
        {{# if(d.reviewRatingTarget < d.reviewRatingMy){ }}
            <span class="review_shopee point_st" style="color:green">{{d.reviewRatingMy}}</span>
            <pre class="layui-hide" style="color:green">商品评分满分:{{d.reviewRatingTarget + ",超出指标:" + (d.reviewRatingMy - d.reviewRatingTarget).toFixed(2)}}</pre>
        {{# }else{ }}
            <span class="review_shopee point_st" style="color:red">{{d.reviewRatingMy}}</span>
            <pre class="layui-hide">商品评分满分:{{d.reviewRatingTarget + ",低于指标:" + (d.reviewRatingTarget - d.reviewRatingMy).toFixed(2)}}</pre>
        {{# } }}
    {{# }else{ }}
            无数据
    {{# } }}
</script>

<!-- 店铺评分 -->
<script type="text/html" id="shop_shopee">
    {{# if(d.shopRatingMy != null ){ }}
        {{# if(d.shopRatingTarget < d.shopRatingMy){ }}
                <span class="shop_shopee point_st" style="color:green">{{d.shopRatingMy}}</span>
            <pre class="layui-hide" style="color:green">店铺评分满分:{{d.shopRatingTarget + ",超出指标:" + (d.shopRatingMy - d.shopRatingTarget).toFixed(1)}}</pre>
        {{# }else{ }}
            <span class="shop_shopee point_st" style="color:red">{{d.shopRatingMy}}</span>
            <pre class="layui-hide">店铺评分满分:{{d.shopRatingTarget + ",低于指标:" + (d.shopRatingTarget - d.shopRatingMy).toFixed(1)}}</pre>
        {{# } }}
    {{# }else{ }}
        无数据
    {{# } }}
</script>

<!-- 回复速度 -->
<script type="text/html" id="response_shopee">
    {{# if(d.responseRateMy != null){ }}
        {{# if(d.responseRateTarget < d.responseRateMy){ }}
            <span class="response_shopee point_st" style="color:green">{{d.responseRateMy+"%"}}</span>
            <pre class="layui-hide" style="color:green">回复速度指标:{{d.responseRateTarget + "%,高于指标:" + (d.responseRateMy - d.responseRateTarget) +"%"}}</pre>
        {{# }else{ }}
            <span class="response_shopee point_st" style="color:red">{{d.responseRateMy+"%"}}</span>
            <pre class="layui-hide">回复速度指标:{{d.responseRateTarget + "%,低于指标:" + (d.responseRateTarget - d.responseRateMy) +"%"}}</pre>
        {{# } }}
    {{# }else{ }}
            无数据
    {{# } }}
</script>

<!-- 响应时间 -->
<script type="text/html" id="response_time_shopee">
    {{# if(d.responseTimeMy != null){ }}
        {{# if(d.responseTimeTarget > d.responseTimeMy){ }}
            <span class="response_time_shopee point_st" style="color:green">小于一天({{d.responseTimeMy+"天"}})</span>
            <pre class="layui-hide" style="color:green">响应时间:{{d.responseTimeTarget + "天,低于指标:" + (d.responseTimeTarget - d.responseTimeMy).toFixed(2) +"天"}}</pre>
        {{# }else{ }}
            <span class="response_time_shopee point_st" style="color:red">大于一天({{d.responseTimeMy+"天"}})</span>
            <pre class="layui-hide">响应时间:{{d.responseTimeTarget + "天,高于指标:" + (d.responseTimeMy - d.responseTimeTarget).toFixed(2) +"天"}}</pre>
        {{# } }}
    {{# }else{ }}
            无数据
    {{# } }}
</script>

<!-- 垃圾邮件 -->
<script type="text/html" id="spam_shopee">
    {{# if(d.spamMy != null){ }}
        {{# if(d.spamMy <= d.spamTarget){ }}
            <span class="spam_shopee point_st" style="color:green">{{d.spamMy}}</span>
            <pre class="layui-hide" style="color:green">垃圾邮件:{{d.spamTarget}}</pre>
        {{# }else{ }}
            <span class="spam_shopee point_st" style="color:red">{{d.spamMy}}</span>
            <pre class="layui-hide">垃圾邮件:{{d.spamTarget + ",高于指标:" + (d.spamMy - d.spamTarget)}}</pre>
        {{# } }}
    {{# }else{ }}
            无数据
    {{# } }}
</script>

<!-- 禁止上市 -->
<script type="text/html" id="prohibited_shopee">
    {{# if(d.prohibitedMy != null){ }}
        {{# if(d.prohibitedMy <= d.prohibitedTarget){ }}
            <span class="prohibited_shopee point_st" style="color:green">{{d.prohibitedMy}}</span>
            <pre class="layui-hide" style="color:green">禁止上市违规:{{d.prohibitedTarget}}</pre>
        {{# }else{ }}
            <span class="prohibited_shopee point_st" style="color:red">{{d.prohibitedMy}}</span>
            <pre class="layui-hide">禁止上市违规:{{d.prohibitedTarget + ",高于指标:" + (d.prohibitedMy - d.prohibitedTarget)}}</pre>
        {{# } }}
    {{# }else{ }}
            无数据
    {{# } }}
</script>

<!-- 假冒上市违规 -->
<script type="text/html" id="counterfeit_shopee">
    {{# if(d.counterfeitMy != null){ }}
        {{# if(d.counterfeitMy <= d.counterfeitTarget){ }}
            <span class="counterfeit_shopee point_st" style="color:green">{{d.counterfeitMy}}</span>
            <pre class="layui-hide" style="color:green">假冒上市违规:{{d.counterfeitTarget}}</pre>
        {{# }else{ }}
            <span class="counterfeit_shopee point_st" style="color:red">{{d.counterfeitMy}}</span>
            <pre class="layui-hide">假冒上市违规:{{d.counterfeitTarget + ",高于指标:" + (d.counterfeitMy - d.counterfeitTarget)}}</pre>
        {{# } }}
    {{# }else{ }}
            无数据
    {{# } }}
</script>

<!-- 店铺描述 -->
<script type="text/html" id="shopDescription">
    {{# if(d.shopDescription){ }}
    <div style="text-align:left;white-space: pre-wrap">{{d.shopDescription}}</div>
    {{# } }}
</script>
<!-- 店铺描述 -->

<!-- 修改店铺弹框 -->
<script type="text/html" id="modifypicture_Template">
  <div class="layui-fluid">
      <div class="layui-row">
          <div class="layui-col-lg12 layui-col-md12">
              <form action="" class="layui-form">
                  <div calss="layui-card">
                      <div class="layui-form-item">
                          <label class="layui-form-label w_100">店铺:</label>
                          <div class="layui-input-block w_50" id="storeAcctName">
                          </div>
                      </div>
                  </div>
                  <div calss="layui-card">
                      <div class="layui-form-item">
                          <label class="layui-form-label w_100">平台店铺名称:
                          </label>
                          <div class="layui-input-block">
                              <input name="storeAcct" id="storeAcct" placeholder="平台店铺名称" type="text" class="layui-input w_50">
                          </div>
                      </div>
                  </div>
                  <!-- <div calss="layui-card">
                      <div class="layui-form-item">
                          <label class="layui-form-label w_100">店铺图片</label>
                          <div class="chooseimg_row">
                            <div id='div_prev' title=''></div>
                            <button type="button" class="layui-btn" id="chooseimg">
                              选择图片
                            </button>
                          </div>
                      </div>
                  </div> -->
                  <div calss="layui-card">
                      <div class="layui-form-item">
                          <label class="layui-form-label w_100">店铺描述：</label>
                          <div class="layui-input-block">
                              <textarea name="shopDescription"  cols="30" rows="10" class="w_50"></textarea>
                          </div>
                      </div>
                  </div>
              </form>
          </div>
      </div>
  </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/accperformance.js"></script>
<script type="text/html" id="shopee_store_status">
    {{# if(d.status != null){ }}
        {{# if(d.status == 'BANNED'){ }}
        <span style="color: green">禁用</span>
        {{# } }}
        {{# if(d.status == 'FROZEN'){ }}
        <span style="color: green">冻结</span>
        {{# } }}
        {{# if(d.status == 'NORMAL'){ }}
        <span style="color: green">正常</span>
        {{# } }}
    {{# } }}
</script>
<script type="text/html" id="shopee_store_images">
    <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;" data-storeacctid="{{d.storeAcctId}}">
        {{# if(d.images != null && d.images != ''){ }}
            {{#  var img = JSON.parse(d.images) }}
            {{#  for(var i = 0; i < img.length; i++){ }}
                {{# var imgs = img[i].trim(" ") }}
                    <img src="{{imgs}}" alt="加载失败" class="lazy" data-onerror="layui.admin.img_noFind()">
            {{# } }}
        {{# } }}
    </div>
</script>
<script type="text/html" id="shopee_shopeId_url">
    <%--马来西亚--%>
    {{# if(d.country == 'MY') { }}
     <a class="shopId" target="_blank" href="https://shopee.com.my/shop/{{d.shopId}}">{{d.shopId}}</a>
    {{# } }}
    <%--台湾--%>
    {{# if(d.country == 'TW') { }}
    <a class="shopId" target="_blank" href="https://shopee.tw/shop/{{d.shopId}}" >{{d.shopId}}</a>
    {{# } }}
    <%--新加坡--%>
    {{# if(d.country == 'SG') { }}
    <a class="shopId" target="_blank" href="https://shopee.sg/shop/{{d.shopId}}" >{{d.shopId}}</a>
    {{# } }}
    <%--印尼  --%>
    {{# if(d.country == 'ID') { }}
    <a class="shopId" target="_blank" href="https://shopee.co.id/shop/{{d.shopId}}" >{{d.shopId}}</a>
    {{# } }}
    <%--泰国  --%>
    {{# if(d.country == 'TH') { }}
    <a class="shopId" target="_blank" href="https://shopee.co.th/shop/{{d.shopId}}" >{{d.shopId}}</a>
    {{# } }}
    <%--菲律宾 --%>
    {{# if(d.country == 'PH') { }}
    <a class="shopId" target="_blank" href="https://shopee.ph/shop/{{d.shopId}}" >{{d.shopId}}</a>
    {{# } }}
    <%--越南  --%>
    {{# if(d.country == 'VN') { }}
    <a class="shopId" target="_blank" href="https://shopee.vn/shop/{{d.shopId}}" >{{d.shopId}}</a>
    {{# } }}
</script>

<!-- 店铺信息 批量修改 结果显示 -->
<script type="text/html" id="shopee_accper_storeInfo_resultTpl">
    <table class="layui-table" id="shopee_accper_storeInfo_result"></table>
</script>