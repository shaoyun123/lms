<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
  <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
    <title>FBA产品管理</title>

    <link rel="stylesheet" href="${ctx}/static/teafram/teaFram.css">

    <style>
      .batchSetVal {
        width: 80px;
        float: left
      }

      .batchSetBtn {
        float: right;
      }

      .fbahistory_label {
        color:#fff;
        background-color: #33DF83;
        margin: 3px 5px;
        border-radius: 5px;
        cursor:auto;
      }

      .fbahistory_label3 {
        color:#fff;
        background-color:#FF6600;
        margin: 3px 5px;
        border-radius: 5px;
        cursor:auto;
      }

      .fl2 {
        float: left;
      }

      .ml-10 {
        margin-left: 10px;
      }

      .mr-15 {
        margin-right: 15px;
      }

      .mr-128 {
        margin-right: 128px;
      }

      .fba_overContentEllipsis {
        position: relative;
        line-height: 28px;
        max-height: 28px;
        overflow: hidden;
        width: 35px;
      }

      .fba_overContentEllipsis::after {
        content: "...";
        position: absolute;
        bottom: 0;
        right: 0;
        background: -webkit-linear-gradient(left, transparent, #fff 55%);
        background: -o-linear-gradient(right, transparent, #fff 55%);
        background: -moz-linear-gradient(right, transparent, #fff 55%);
        background: linear-gradient(to right, transparent, #fff 55%);
      }

      .ml {
        margin-left: 10px;
      }

      .label_reset {
        padding: 0 10px !important;
      }

      .select_label {
        padding: 0px !important;
      }

      .dis_flex {
        display: flex;
        justify-content: flex-start;
      }

      .yellowtips {
        color: deepskyblue;
        margin-left: 10px;
        background: lightyellow;
      }

      #FBAhistory_table_check_num {
        color: deepskyblue;
        width: 200px
      }

      .text_l {
        text-align: left;
      }

      .storeSwitchLable {
        width: 60px;
        padding: 9px 10px;
      }

      .storeSwitch .layui-form-switch {
        margin-top: 0;
      }

      .storeSwitch .layui-form-select {
        width: 160px;
      }

      .storeSwitch .layui-form-switch {
        width: 75px;
      }

      .storeSwitch .layui-form-switch em {
        width: 60px;
      }

      .storeSwitch .layui-form-onswitch i {
        left: 65px;
      }
      .type_tag {
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        padding: 2px 5px;
        color: #ffffff;
        border-radius: 4px;
      }
      .blue_tag {
        background-color: rgb(30, 149, 255);
      }
      .red_tag {
        background-color: rgb(255, 87, 34);
      }
      .grey_tag {
        background-color: rgb(153, 153, 153);
      }
      .gray_textarea{
        background-color: #f1f1f1;
      }
    </style>

    <div class="layui-fluid" id="FBAhistory">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
          <div class="layui-card">
            <div class="layui-card-body">
              <form class="layui-form" id="FBAhistoryForm" lay-filter="FBAhistoryForm" onsubmit="return false">
                <div class="layui-form-item" id="FBAhistory_StoreSaler">
                  <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">部门</label>
                    <div class="layui-input-block">
                      <select name="orgId" lay-filter="FBAhistory_orgTree" class="orgs_hp_custom" lay-search></select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">销售员</label>
                    <div class="layui-input-block">
                      <select name="salesPersonIdListStr" id="FBAhistory_userList" class="users_hp_custom"
                              lay-filter="FBAhistory_userList" data-rolelist="amazon专员" xm-select="FBAhistory_userList"
                              xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <!-- <label class="layui-form-label storeSwitchLable"></label> -->
                    <div class="layui-input-block storeSwitch" style="margin-left: 30px">
                      <div style="display: flex;align-items: center;justify-content: space-between;">
                        <input type="checkbox" name="FBAStoreSwitch" lay-text="启用店铺|停用店铺" lay-filter="FBAStoreSwitch"
                               lay-skin="switch" checked>
                        <select name="storeAcctId" style="width: 150px" class="store_hp_custom"
                                id="FBAhistory_storeAcct" lay-filter="FBAhistory_storeAcct" data-platcode="amazon"
                                data-storestatus="1" lay-search>
                          <option value="">全部</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1">
                    <select name="salesSite" id="FBAhistory_amazonSite" lay-search>
                      <option>站点</option>
                    </select>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2" style="width: 400px">
                    <div class="layui-form-label select_label ml" style="width: 80px">
                      <select name="skuType">
                        <option value="sellerSkuStr">店铺SKU</option>
                        <option value="asinStr">ASIN</option>
                        <option value="fnSkuStr">FNSKU</option>
                        <option value="prodSSkuStr">子商品SKU</option>
                        <option value="title">标题</option>
                        <option value="purchaseChannel">中文简称</option>
                      </select>
                    </div>
                    <div class="layui-input-block" style="width: 290px">
                      <input type="text" name="sku" class="layui-input" placeholder="多个使用逗号分隔">
                    </div>
                  </div>

                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">商品标签</label>
                    <div class="layui-input-block">
                      <select name="prodAttrTagListStr" xm-select="FBAhistory_prodAttrTag" id="FBAhistory_prodAttrTag"
                              xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                              lay-filter='FBAhistory_prodAttrTag'>
                        <option></option>
                        <option value="空">无标签</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="layui-form-item" id="FBAhistory_SkuSalerForm">
                  <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">部门</label>
                    <div class="layui-input-block">
                      <select name="FBA_skuSaler_orgId" lay-filter="FBA_skuSaler_orgId" class="orgs_hp_custom"
                              lay-search></select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">FBA销售员</label>
                    <div class="layui-input-block">
                      <select name="skuSalerPersonIdListStr" class="users_hp_custom" id="FBAhistory_FBASalerList"
                              lay-filter="FBAhistory_FBASalerList" data-rolelist="amazon专员"
                              xm-select="FBAhistory_FBASalerList" xm-select-search xm-select-search-type="dl"
                              xm-select-skin="normal" lay-search>
                      </select>
                    </div>
                  </div>

                  <div class="layui-col-lg2 layui-col-md2">
                    <select name="orderBy1" xm-select="FBAhistory_orderBy" id="FBAhistory_orderBy1" xm-select-search
                            xm-select-search-type="dl" xm-select-skin="normal" lay-filter='FBAhistory_orderBy1'>
                      <option value="">排序方式</option>
                      <option value="1">3天销量</option>
                      <option value="2">7天销量</option>
                      <option value="3">30天销量</option>
                      <option value="4">60天销量</option>
                      <option value="5">90天销量</option>
                      <option value="6">可售数量</option>
                      <option value="7">售价</option>
                      <option value="8">待发数量</option>
                      <option value="9">可售天数</option>

                      <option
                              value="10">
                        总库存</option>

                      <option
                              value="11">
                        总成本</option>

                      <option
                              value="12">
                        可售成本</option>

                      <option
                              value="13">
                        周转天数</option>

                        <option
                          value="14">
                        建议采购数量</option>
                      <option value="afi.profit_rate">利润率</option>
                      <option value="predict_month_storage_fee">月度仓储费(估)</option>
                      <option value="last_month_storage_fee">月度仓储费(实)</option>
                      <option value="afsas.ad_cost_seven">7天花费</option>
                      <option value="afsas.acos_seven">7天ACOS</option>
                      <option value="afsas.acocs_seven">7天ACoAS</option>
                      <option value="afsas.ad_cost_thirty">30天花费</option>
                      <option value="afsas.acos_thirty">30天ACOS</option>
                      <option value="afsas.acocs_thirty">30天ACoAS</option>
                    </select>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1">
                    <select name="orderBy2">
                      <option value="asc">正序</option>
                      <option value="desc">倒序</option>
                    </select>
                  </div>

                  <div class="layui-col-lg2 layui-col-md2" style="width: 400px">
                    <label class="layui-form-label ml-10" style="padding: 0">
                      <select name="ageRange">
                        <option value="0-90" selected>0-90库龄</option>
                        <option value="91-180">91-180库龄</option>
                        <option value="181-270">181-270库龄</option>
                        <option value="271-365">271-365库龄</option>
                        <option value="365+">365+库龄</option>
                      </select></label>
                    <div class="layui-input-block dis_flex">
                      <div class="layui-col-lg6 layui-col-md6">
                        <input type="number" name="ageInvStar" style="width: 98%;" class="layui-input" placeholder=">=">
                      </div>
                      <div class="layui-col-lg6 layui-col-md6">
                        <input type="number" name="ageInvEnd" style="width: 98%;" class="layui-input" placeholder="<=">
                      </div>
                    </div>
                  </div>
                  <div class="layui-col-md2 layui-col-lg2">
                    <div class="layui-form-label label_reset">
                      <select name="timeType" class="hiddenContent">
                        <option value="createTime">创建时间</option>
                        <option value="lastSyncTime">更新时间</option>
                        <option value="firstOnShelfTime">首次上架时间</option>
                        <option value="lastRestockTime">恢复库存时间</option>
                        <option value="devTime">开发时间</option>
                      </select>
                    </div>
                    <div class="layui-input-block">
                      <input name="time" class="layui-input" readonly id="FBAhistory_searchForm_time">
                    </div>
                  </div>
                </div>
                <div class="layui-form-item" id="FBAhistory_developerForm">
                  <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">部门</label>
                    <div class="layui-input-block">
                      <select name="FBA_developer_orgId" lay-filter="FBA_developer_orgId" class="orgs_hp_custom"
                              lay-search></select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">开发员</label>
                    <div class="layui-input-block">
                      <select name="developerIdListStr" class="users_hp_custom" id="FBAhistory_developerIdList"
                              lay-filter="FBAhistory_developerIdList" data-rolelist="开发专员"
                              xm-select="FBAhistory_developerIdList" xm-select-search xm-select-search-type="dl"
                              xm-select-skin="normal" lay-search>
                      </select>
                    </div>
                  </div>

                  <div class="layui-col-lg1 layui-col-md1">
                    <select name="ifSale">
                      <option value="">销售状态</option>
                      <option value="true">售卖</option>
                      <option value="false">不卖</option>
                    </select>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1">
                    <select name="needUpStockType">
                      <option value="">是否补货</option>
                      <option value="1">需要空运补货</option>
                      <option value="2">需要海运补货</option>
                      <option value="0">不需要</option>
                    </select>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2" style="width: 250px">
                    <label class="layui-form-label" style="padding: 0 15px">
                      <select name="salesType">
                        <option value="3日">3日销量</option>
                        <option value="7日" selected>7日销量</option>
                        <option value="30日">30日销量</option>
                        <option value="60日">60日销量</option>
                        <option value="90日">90日销量</option>
                      </select>
                    </label>
                    <div class="layui-input-block">
                      <div class="layui-col-lg6 layui-col-md6">
                        <input type="number" name="salesMin" style="width: 90%;" class="layui-input" placeholder=">=">
                      </div>
                      <div class="layui-col-lg6 layui-col-md6">
                        <input type="number" name="salesMax" style="width: 90%;" class="layui-input" placeholder="<=">
                      </div>
                    </div>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1">
                    <select name="hasPackDesc">
                      <option value="">有无包装备注</option>
                      <option value="true">有</option>
                      <option value="false">无</option>
                    </select>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1">
                    <select name="hasShippingPrice">
                      <option value="">有无配送费</option>
                      <option value="true">有</option>
                      <option value="false">无</option>
                    </select>

                  </div>
                  <div class="layui-col-lg1 layui-col-md1">
                    <select name="onlineBool">
                      <option value="">刊登状态</option>
                      <option value="true" selected>有listing</option>
                      <option value="false">无listing</option>
                    </select>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1">
                    <!-- <div class="layui-input-block"> -->
                    <select name="hasHeadFreight">
                      <option value="">有无头程运费</option>
                      <option value="true">有</option>
                      <option value="false">无</option>
                    </select>
                    <!-- </div> -->
                  </div>

                </div>
                <div class="layui-form-item" style="display: flex;justify-content: flex-end;">
                  <div class="layui-col-lg1 layui-col-md1">

                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">发货类型</label>
                    <div class="layui-input-block">
                      <select name="shippingType">
                        <option value=""></option>
                        <option value="1">空运</option>
                        <option value="2">海运</option>
                        <option value="0">未设置</option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1">
                    <select name="labelListStr" xm-select="FBAhistory_labelListStr" id="FBAhistory_labelListStr"
                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                            lay-filter='FBAhistory_labelListStr'>
                      <option value="">爬虫标记</option>
                      <option value="A+">A+</option>
                      <option value="AC">AC</option>
                      <option value="NR">NR</option>
                      <option value="TS">TS</option>
                      <option value="BS">BS</option>
                    </select>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1 mr-15">
                    <!-- <label class="layui-form-label">是否铺货店铺</label> -->
                    <!-- <div class="layui-input-block"> -->
                    <select name="isDistributionStore">
                      <option value="">是否铺货店铺</option>
                      <option value="true">是</option>
                      <option value="false">否</option>
                    </select>
                    <!-- </div> -->
                  </div>
                  <div class="layui-col-lg1 layui-col-md1">
                    <select name="havePromotionPrice">
                      <option value="">有无促销价</option>
                      <option value="true">有</option>
                      <option value="false">无</option>
                    </select>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1 mr-128">
                    <select name="logisticLabel" id="FBAhistory_logisticLabel" lay-filter='FBAhistory_logisticLabel'
                            xm-select="FBAhistory_logisticLabel" xm-select-search xm-select-search-type="dl"
                            xm-select-skin="normal">
                      <option value="">物流标签</option>
                    </select>
                  </div>
                  <div class="layui-col-md2 layui-col-lg2">
                    <div class="externalBox" id="showMoreSearchCondition_Fbahistory" style="margin-left: 10px">更多查询条件
                      <span id="hide_icon_processlist" class="fr mr10 disN">︽</span>
                      <span id="show_icon_processlist" class="fr mr10">︾</span>
                    </div>
                  </div>
                  <div class="externalContain disN">
                    <div class="externalPop">
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">待发数</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfWait" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfWait" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">在途数</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfOnway" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfOnway" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">可售数</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfSalable" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfSalable" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">不可售数</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfUnsalable" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfUnsalable" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">预留数</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfReservation" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfReservation" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">可售天数</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfSalableDay" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfSalableDay" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">周转天数</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfStockCycleDay" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfStockCycleDay" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">总库存</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfTotalStock" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfTotalStock" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">总库存成本</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfTotalCost" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfTotalCost" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">可售成本</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfSalableCost" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfSalableCost" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">建议采购数量</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfSaleSuggest" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfSaleSuggest" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">评分</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfScore" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfScore" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">毛利率</label>
                          <div class="layui-input-block dis_flex">
                            <input type="number" name="minNumOfProfitRate" class="layui-input" placeholder=">="
                                   style="width: 180px">
                            <input type="number" name="maxNumOfProfitRate" class="layui-input" placeholder="<="
                                   style="width: 180px">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="layui-col-lg1 layui-col-md1 fr">
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal keyHandle" lay-submit=""
                            id="FBAhistory_Search" lay-filter="FBAhistory_Search">查询</button>
                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                  </div>
                  <input type="hidden" name="roleNames" value="amazon专员">
                </div>
              </form>
            </div>
          </div>
          <div class="layui-card" id="FBAhistory_tableHead_card">
            <div style="height:42px;line-height:42px;">
              <div class="layui-card-header">
                <span id="FBAhistory_table_check_num" class="fl"></span>
                <div style="z-index:20201008;display: flex;margin-top: 10px;margin-right: 20px;" class="fr">
                  <permTag:perm funcCode="amazon_fba_setting_sales_params">
                    <button type="button" class="layui-btn layui-btn-danger layui-btn-sm"
                            id="FBAsetGoodsProperties">设置全局备货系数</button>
                  </permTag:perm>
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                                      id="FBAhistory_exportAllInfo">导出</button>
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                    id="FBAhistory_downTemp_planQuality">下载补货模板</button>
                  <permTag:perm funcCode="FBAhistory_excelImport_planQuality">
                    <button type="button" class="layui-btn layui-btn-warm layui-btn-sm"
                            id="FBAhistory_excelImport_planQuality">补货导入</button>
                  </permTag:perm>
                  <button type="button" class="layui-btn layui-btn-primary layui-btn-sm"
                      style="margin-left :5px" id="FBAhistory_asyncInv">同步FBA商品</button>

                  <div class="fr" style="z-index: 20200318;position: relative">
                    <div class="btnSelect_hp fl" style="width: 68px;margin-right: 15px;">
                        <div class="title_btnSelect">批量操作</div>
                        <div class="optionBox_btnSelect">
                            <div class="optionCanvas_btnSelect" style="width: 120px">
                              <permTag:perm funcCode="FBAhistory_setLogisticLabel">
                                <div class="option_btnSelect" id="FBAhistory_setLogisticLabelBtn" type="button">设置物流标签</div>
                              </permTag:perm>
                              <permTag:perm funcCode="FBAhistory_updatePackDescByList">
                                <div class="option_btnSelect" id="FBAhistory_updatePackDescByList" type="button">修改包装备注</div>
                              </permTag:perm>
                              <permTag:perm funcCode="FBAhistory_adjustPrice">
                                <div class="option_btnSelect" id="FBAhistory_adjustPrice" type="button">批量改价</div>
                              </permTag:perm>
                              <permTag:perm funcCode="amazon_fba_setting_ifSaleList">
                                <div class="option_btnSelect" id="amazon_fba_setting_ifSaleList" type="button">修改销售状态</div>
                              </permTag:perm>
                              <permTag:perm funcCode="amazon_fba_setting_sales_paramList">
                                <div class="option_btnSelect" id="FBAsetGoodsPropertiesForList" type="button">批量设置备货系数</div>
                              </permTag:perm>
                              <permTag:perm funcCode="FBAhistory_updateByList">
                                <div class="option_btnSelect" id="FBAhistory_updateByListBtn" type="button">批量修改</div>
                              </permTag:perm>
                              <permTag:perm funcCode="FBAhistory_setLabel">
                                <div class="option_btnSelect" id="FBAhistory_setLabelBtn" type="button">设置标签</div>
                              </permTag:perm>
                              <permTag:perm funcCode="FBAhistory_setSaleperson">
                                <div class="option_btnSelect" id="FBAhistory_batch_setSaleperson" type="button">批量转移</div>
                              </permTag:perm>
                              <permTag:perm funcCode="FBAhistory_addPlan">
                                <div class="option_btnSelect" id="FBAhistory_addPlan" type="button">添加发货需求</div>
                              </permTag:perm>
                              <permTag:perm funcCode="FBAhistory_addType">
                                <div class="option_btnSelect" id="FBAhistory_addType" type="button">设置发货类型</div>
                              </permTag:perm>
                              <permTag:perm funcCode="FBAeditSaleRemark">
                                <div class="option_btnSelect" id="FBAeditSaleRemark" type="button">批量修改销售备注</div>
                              </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
                  
                  


                  
                </div>
              </div>
            </div>
            <div class="layui-card-body">
              <div id="FBAhistory_labelOrigin" class="disN"></div>
              <div id="FBAhistory_labelContains" class="layui-form" lay-filter="FBAhistory_labelContains"></div>
              <table lay-filter="FBAhistory_Table" class="layui-table" id="FBAhistory_Table"></table>
            </div>
          </div>
          <div id="FBAhistory_page" class="tea_page_bottom"></div>
        </div>
      </div>
    </div>

    <!-- 设置发货类型 -->
    <script type="text/html" id="pop_FBAhistory_setAddType">
      <div class="mg_50" style="padding: 20px;">
        <form class="layui-form" id="FBAhistory_setAddType_Form" lay-filter="FBAhistory_setAddType_Form">
            <select name="shippingType">
                <option></option>
                <option value="1">空运</option>
                <option value="2">海运</option>
            </select>
        </form>
      </div>
    </script>

    <!-- 设置备货系数 -->
    <script type="text/html" id="pop_FBAhistory_setGoodsProperty">
      <div style="padding: 10px;" id="pop_FBAhistory_setGoodsPropertyDiv"></div>
    </script>

    <script type="text/html" id="pop_FBAhistory_setGoodsPropertyLayer">
      {{# layui.each(d, function(index, item){ }}
      <div class="shippingBox">
        <div class="mg_50">
          <div style="font-weight: bold;font-size: 18px;">
            {{ item.shippingType === 1 ? "空运" : "海运"}}
          </div>
            <table class="layui-table">
            <div>销量权重</div>
            <thead>
            <tr>
                <th>7天销量权重(%)</th>
                <th>15天销量权重(%)</th>
                <th>30天销量权重(%)</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                  <input type="hidden" name="id" value="{{item.id}}"/>
                  <input type="hidden" name="shippingType" value="{{item.shippingType}}"/>
                  <input type="number" min="0" max="100" class="layui-input" name="saleRatioSeven" value="{{item.saleRatioPercentStrSeven}}">
                </td>
                <td><input type="number" min="0" max="100" class="layui-input" name="saleRatioFifteen" value="{{item.saleRatioPercentStrFifteen}}"></td>
                <td><input type="number" min="0" max="100" class="layui-input" name="saleRatioThirty" value="{{item.saleRatioPercentStrThirty}}"></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mg_50">
            <table class="layui-table">
                <div>备货天数</div>
                <thead>
                <tr>
                    <th>采购天数</th>
                    <th>FBA头程天数</th>
                    <th>安全天数</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><input type="number" min="0" class="layui-input" name="purchaseDay" value="{{item.purchaseDay}}"></td>
                    <td><input type="number" min="0" class="layui-input" name="fbaFreightDay" value="{{item.fbaFreightDay}}"></td>
                    <td><input type="number" min="0" class="layui-input" name="safeDay" value="{{item.safeDay}}"></td>
                  </tr>
                </tbody>
            </table>
        </div>
      </div>
      {{#}) }}
    </script>
    <script type="text/html" id="FBAhistory_setPurParamsForList_pop_con">
      <div style="padding: 10px;" id="FBAhistory_setPurParamsForList_popDiv"></div>
    </script>
    <script type="text/html" id="FBAhistory_setPurParamsForList_pop">
    <div class="mg_50" style="padding: 10px">
        <form class="layui-form" id="FBAhistory_setPurParamsForList_form" lay-filter="FBAhistory_setPurParamsForList_pop">
          <div class="layui-form-item">
            <div class="layui-col-lg6 layui-col-md3">
              <label class="layui-form-label" style="text-align: left;padding: 9px 0px;"><span style="color: red">*</span>发货类型</label>
                <div class="layui-input-block" style="margin-left: 30%;">
                  <!-- 单独设置备货参数 -->
                  {{# if(!Array.isArray(d)){ }}
                    {{# if(d.shippingType === 1||!d.shippingType){ }} 
                      <input type="radio" name="shippingType" title="空运" value="1" checked lay-filter="shippingType_radio">
                      <input type="radio" name="shippingType" title="海运" value="2" lay-filter="shippingType_radio">
                    {{# } }}   
                    {{# if(d.shippingType === 2){ }} 
                    <input type="radio" name="shippingType" title="空运" value="1" lay-filter="shippingType_radio">
                    <input type="radio" name="shippingType" title="海运" value="2" checked lay-filter="shippingType_radio">
                    {{# } }}
                  {{# } }}
                  <!-- 批量设置备货参数 -->
                  {{# if(Array.isArray(d)){ }}
                    {{# if(d.length !== 1||(d.length === 1&&d[0].shippingType===1)||(d.length === 1&&!d[0].shippingType)){ }} 
                      <input type="radio" name="shippingType" title="空运" value="1" checked lay-filter="shippingType_radio">
                      <input type="radio" name="shippingType" title="海运" value="2" lay-filter="shippingType_radio">
                    {{# } }}
                    {{# if((d.length == 1&&d[0].shippingType===2)){ }} 
                      <input type="radio" name="shippingType" title="空运" value="1" lay-filter="shippingType_radio">
                      <input type="radio" name="shippingType" title="海运" value="2" checked lay-filter="shippingType_radio">
                    {{# } }}
                  {{# } }}
                  </div>
            </div>
            <div class="layui-col-lg6 layui-col-md3">
              <div style="color: red;margin-top: 5px;font-size: 12px;">注：保存成功会将产品修改至对应发货类型！</div>
            </div>
          </div>  
          <table class="layui-table">
                <div>备货天数</div>
                <thead>
                <tr>
                    <th>采购天数</th>
                    <th>FBA头程天数</th>
                    <th>安全天数</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <!-- 单个设置需要回显 -->
                  {{# if(!Array.isArray(d)){ }} 
                    <td><input type="number" min="0" class="layui-input" name="purDays" value="{{d.purDays||''}}"></td>
                    <td><input type="number" min="0" class="layui-input" name="headDays" value="{{d.headDays||''}}"></td>
                    <td><input type="number" min="0" class="layui-input" name="safeDays" value="{{d.safeDays||''}}"></td>
                  {{# } else if (Array.isArray(d)&&d.length===1){ }}
                  <!-- 批量只勾选一个需要回显 -->
                    <td><input type="number" min="0" class="layui-input" name="purDays" value="{{d[0].purDays||''}}"></td>
                    <td><input type="number" min="0" class="layui-input" name="headDays" value="{{d[0].headDays||''}}"></td>
                    <td><input type="number" min="0" class="layui-input" name="safeDays" value="{{d[0].safeDays||''}}"></td>
                  {{# } else { }}     
                  <!-- 不回显 -->
                    <td><input type="number" min="0" class="layui-input" name="purDays"></td>
                    <td><input type="number" min="0" class="layui-input" name="headDays"></td>
                    <td><input type="number" min="0" class="layui-input" name="safeDays"></td>
                  {{# }}}
                </tr>
                </tbody>
            </table>
        </form>
    </div>
</script>


    <script type="text/html" id="FBAhistory_updateIfSaleForList_pop">
    <div class="mg_50">
        <form class="layui-form" id="FBAhistory_updateIfSaleForList_Form" lay-filter="FBAhistory_updateIfSaleForList_Form">
            <select name="ifSale">
                <option></option>
                <option value="true">售卖</option>
                <option value="false">不卖</option>
            </select>
        </form>
    </div>
</script>

    <!-- 转移 -->
    <script type="text/html" id="FBAhistory_setSaleperson_tpl">
    <form class="layui-form mg_50" id="FBAhistory_setSaleperson_tpl_Form" lay-filter="FBAhistory_setSaleperson_tpl">
        <div class="layui-form-item">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-block">
                    <select name="skuSalespersonId" lay-search width="200"></select>
                </div>
                <input name="idList" type="hidden">
        </div>
        <div class="layui-col-lg2 layui-col-md2 disN">
            <div class="layui-input-block">
                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit="" id="FBAhistory_setSaleperson_tpl_Form_submit" lay-filter="FBAhistory_setSaleperson_tpl_Form_submit">提交</button>
            </div>
        </div>
    </form>
</script>
    <%-- 日志 --%>
      <script type="text/html" id="FBAhistory_price_log_tpl">
        <div class="layui-tab layui-tab-brief">
            <div class="layui-show">
                <table class="layui-table" id="fba_history_price_log_tab" lay-filter="fba_history_price_log_tab"></table>
            </div>
        </div>
</script>


      <!-- 预估定价 -->
      <script type="text/html" id="pop_FBAhistory_estimate">
    <form class="layui-form mg_50" id="FBAestimateForm" lay-filter="FBAestimateForm">
        <div class="layui-form-item">
            <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">商品成本(￥)</label>
                <div class="layui-input-block">
                    <input type="number" name="oaCost" class="layui-input" step="0.01" >
                </div>
            </div>
            <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">包装成本(￥)</label>
                <div class="layui-input-block">
                    <input type="number" name="packCost" value="0.3" step="0.01" class="layui-input">
                </div>
            </div>
            <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">平台佣金费率</label>
                <div class="layui-input-block">
                    <input type="number" name="platCommission" step="0.01" class="layui-input">
                </div>
            </div>
            <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">站点汇率</label>
                <div class="layui-input-block">
                    <input type="number" name="exchangeRate"  step="0.01" class="layui-input">
                </div>
            </div>
            <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">站点税率</label>
                <div class="layui-input-block">
                    <input type="number" name="siteTaxRate" step="0.01" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md4 layui-col-lg4" style="margin-left: 40px">
                <form id="FBAhistory_estimate_batchSetForm3" lay-filter="FBAhistory_estimate_batchSetForm3" class="layui-form">
                    <div style="display: flex;align-items: center;">
                        <input type="radio" name="updateEstimatePrice" value="1" title="修改刊登价" checked lay-filter="FBAdhistory_estimate_updatePrice">
                        <div name="updateEstimatePriceRemark" style="margin-left: 3px; color: red;">注: 修改刊登价会终止当前促销</div>
                    </div>
                    <div style="display: flex">
                        <input type="radio" name="updateEstimatePrice" value="2" title="修改促销价" lay-filter="FBAdhistory_estimate_updatePrice">
                        <input type="text" style="width: 300px" class="layui-input" id="price_estimate_time" name="time" lay-verify="required" readonly>
                    </div>
                </form>
            </div>
            <div class="layui-col-md2 layui-col-lg2" style="color:red;">
              注：佣金费率为空时按定价参数配置规则自动处理
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md8 layui-col-lg8">
                <div class="layui-form-item bg_gray">FBA刊登价=【(商品成本+包装成本+头程运费)/各站点汇率+FBA派送费】/(1-平台佣金费率-毛利率-站点税率)</div>
                <div class="layui-form-item bg_gray">毛利率 = 1 - 平台佣金费率 - 站点税率 - 【(商品成本+包装成本+头程运费)/各站点汇率+FBA派送费】/FBA刊登价</div>
            </div>
            <div class="layui-col-md4 layui-col-lg4">
                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="fbahistory_calListingPriceBtn">计算刊登价格</button>
                <permTag:perm funcCode="amazon_fba_update_listing_price">
                    <button type="button" class="layui-btn layui-btn-warm layui-btn-sm" id="fbahistory_updateListingPriceForList">批量改价</button>
                </permTag:perm>
                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="fbahistory_calProfitRateBtn">计算毛利率</button>

            </div>
        </div>
        <div class="layui-form-item" id="fbahistory_priceCalTabBox">
            <table class="layui-table" id="fbahistory_priceCalTab" lay-filter="fbahistory_priceCalTab"></table>
        </div>
    </form>
</script>

      <script type="text/html" id="fbahistory_priceCalTab_operate">
    <permTag:perm funcCode="amazon_fba_update_listing_price">
        {{#if (d.id) {}}
        <button type="button" class="layui-btn layui-btn-warm layui-btn-sm" lay-event="updateListingPrice">改价</button>
        {{#}}}
    </permTag:perm>
</script>

      <!-- 表格渲染模板 -->
      <script type="text/html" id="FBAhistory_imageTpl">
    <div>
        {{# if (d.packDesc) {}}
        <span class="layui-badge">有包装备注</span>
        {{# } }}
    </div>
    <div>
        <img width="60" height="60" data-original="{{d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
    <div>
      {{# if (d.ifSale) {}}
      <span style="color: #A7F43D">[售卖]</span>
      {{#}}}
      {{# if (!d.ifSale) {}}
      <span class="secondary">[不卖]</span>
      {{#}}}
    </div>
    <div>
      {{# if(d.shippingType === 1){ }} 
        <span class="type_tag blue_tag">空运</span>
      {{# } }}
      {{# if(d.shippingType === 2){ }} 
        <span class="type_tag red_tag">海运</span>
      {{# } }}
      {{# if(!d.shippingType){ }} 
        <span class="type_tag grey_tag">无发货类型</span>
      {{# } }}
    </div>

    <div>
      <!-- 1.手动标签 2.爬虫标签 3.物流标签 -->
      {{# if (d.labelList && d.labelList.length > 0) { }}
      {{# for (let i in d.labelList) {  }}
        {{# if (d.labelList[i].type == 2){}}
            <span class="hp-badge layui-bg-orange pointHand" title="{{d.labelList[i].labelName}}">{{d.labelList[i].labelName}}</span>
        {{# } }}
        {{# if (d.labelList[i].type == 1 ){}}
        <span class="fbahistory_label layui-btn layui-btn-xs layui-btn-radius">{{d.labelList[i].labelName}}</span>
        {{# } }}
        {{# if ( d.labelList[i].type == 3){}}
        <span class="fbahistory_label3 layui-btn layui-btn-xs layui-btn-radius">{{d.labelList[i].labelName}}</span>
        {{# } }}
      {{# } }}
      {{# } }}
  </div>
</script>

      <script type="text/html" id="FBAhistory_imageTpl2">
    <div>
        {{# if (d.packDesc) {}}
        <div onmouseover="FBAhistory_showPackDesc(this,{{d.LAY_TABLE_INDEX}})" onmouseleave="removeTip(this,500)">[包装备注]</div>
        {{# } }}
    </div>
    <div>
        <img width="60" height="60" src="{{d.picUrl}}" class="img_show_hide b1" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

      <script type="text/html" id="FBAhistory_title">
    <div  class="text_l">
        <div>{{d.title}}</div>
        <div>{{d.prodSInfo ? d.prodSInfo.purchaseChannel : ''}}</div>
    </div>
</script>

    <script type="text/html" id="FBAhistory_sku">
    <div class="text_l">
        <div><div class="secondary fl clearLeft">父ASIN</div>
            <div class="fl">
              <a>{{d.parentAsin || ''}}</a>
              <span onclick="layui.admin.onlyCopyTxt('{{d.parentAsin}}')" style="display: {{d.parentAsin ? 'inline-block':'none'}};cursor:pointer">
                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
              </span>
            </div>

        </div>
        <div><div class="secondary fl clearLeft">商品:</div><div class="fl">
          <a>{{d.prodSSku||'&nbsp;'}}</a>
          <span onclick="layui.admin.onlyCopyTxt('{{d.prodSSku}}')" style="display: {{d.prodSSku ? 'inline-block':'none'}};cursor:pointer">
            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
          </span>
        </div>
            
            <div class="fl">
                {{# if(d.prodSInfo && d.prodSInfo.logisAttrList){ }}
                {{# let logistAttrArr = d.prodSInfo.logisAttrList.split(',')}}
                {{# for (let i = 0; i < logistAttrArr.length; ++i) { let logis = logistAttrArr[i];let alia=getLogisAttrAlia(logis)}}
                {{#  if(alia && alia !== '普'){ }}
                <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logis}}">{{alia}}</span>
                {{# } }}
                {{# }}}
                {{# } }}
            </div>

        </div>
        <div><div class="secondary fl clearLeft">店铺:</div><div class="fl" style="position: relative"> 
          <a>{{d.sellerSku || ''}}</a>
          <span onclick="layui.admin.onlyCopyTxt('{{d.sellerSku}}')" style="display: {{d.sellerSku ? 'inline-block':'none'}};cursor:pointer">
            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
          </span>
        </div></div>
        <div><div class="secondary fl clearLeft">FnSKU:</div><div class="fl" style="position: relative">
          <a>{{d.fnSku || ''}}</a>
          <span onclick="layui.admin.onlyCopyTxt('{{d.fnSku}}')" style="display: {{d.fnSku ? 'inline-block':'none'}};cursor:pointer">
            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
          </span>
        </div></div>
        <div><div class="secondary fl clearLeft">ASIN:</div><div class="fl" style="position: relative">
          <a class="canClickEl" target="_blank" href="{{d.asinSrc}}">{{d.asin||''}}</a>
          <span onclick="layui.admin.onlyCopyTxt('{{d.asin}}')" style="display: {{d.asin ? 'inline-block':'none'}};cursor:pointer">
            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
          </span>
          
        </div></div>
        <div title="恢复库存的时间"><div class="secondary fl clearLeft">恢复:</div><div class="fl">{{format(d.lastRestockTime,'yyyy-MM-dd')}}</div></div>
    </div>
</script>

      <script type="text/html" id="FBAhistory_prepare_stock_tpl">
    <div class="text_l">
        <div><span class="secondary">仓储类型</span>:{{d.extra?.storageTypeName||d.extra?.storageType||''}}</div>
        <div><span class="secondary">仓储容量</span>:{{d.extra?.storageVolume||''}}</div>
        <div><span class="secondary">库存健康状况</span>:{{d.extra?.fbaInventoryLevelHealthStatusName||d.extra?.fbaInventoryLevelHealthStatus||''}}</div>
        <div><span class="secondary">建议最低水平</span>:{{d.extra?.fbaMinimumInventoryLevel||''}}</div>
        <div><span class="secondary">历史供货天数</span>:{{d.extra?.historicalDaysOfSupply||''}}</div>
        <div><span class="secondary">OA建议</span>:{{d.saleSuggest||''}}</div>
        <div><span class="secondary">FBA建议</span>:{{d.platSuggestAmount||''}}</div>
        <div><span class="secondary">最大发货</span>:{{d.platMaxDeliverAmount||''}}</div>
    </div>
</script>

      <script type="text/html" id="FBAhistory_price_tpl">
    <div class="text_l">
        <div style="text-align: center"><div class="layui-btn layui-btn-xs" lay-event="toProdBehavior">表现</div></div>
        <div><span>售价({{d.currency || ''}}):</span>{{d.listingPrice||''}}</div>
        {{# if(d.isExsitPromotion) { }}
            <div><span>促销价:</span>{{d.promotionPrice != null ? d.promotionPrice : ''}}</div>
        {{# } }}
        <div><span>配送({{d.currency || ''}}):</span>{{d.shippingPrice||''}}</div>
        <div><span>利润率:</span>{{d.profitRate != null ? (d.profitRate *100).toFixed(2) + '%' : ''}}</div>
        <div><span>利润(￥):</span>{{d.profit != null ? d.profit : ''}}</div>
        {{# if(d.isExsitPromotion) { }}
            <div><span>促销开始时间:</span>{{d.promotionStartTime != null ? Format(d.promotionStartTime,'yyyy-MM-dd') : ''}}</div>
            <div><span>促销结束时间:</span>{{d.promotionEndTime != null ? Format(d.promotionEndTime,'yyyy-MM-dd') : ''}}</div>
        {{# } }}
    </div>
</script>

      <script type="text/html" id="FBAhistory_cost_tpl">
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">商品¥:</div><div class="fl">{{d.oaCost || ''}}</div></div>
        <div><div class="secondary fl clearLeft">头程¥:</div><div class="fl">{{d.headFreight ? d.headFreight.toFixed(2) : ''}}</div></div>
        <div><div class="secondary fl clearLeft">可售成本¥:</div><div class="fl">{{d.salableCost}}</div></div>
        <div><div class="secondary fl clearLeft">待发成本¥:</div><div class="fl">{{d.reservedCost}}</div></div>
        <div><div class="secondary fl clearLeft">待入库成本¥:</div><div class="fl">{{d.stockTransferToBeReceivedCost}}</div></div>
        <div><div class="secondary fl clearLeft">总库存:</div><div class="fl">{{d.totalStock}}</div></div>
        <div><div class="secondary fl clearLeft">总成本¥:</div><div class="fl">{{d.totalCost}}</div></div>
    </div>
</script>

      <script type="text/html" id="FBAhistory_rank_tpl">
    <div  class="text_l">
        <div><div class="secondary fl clearLeft">亚马逊类目:</div><div class="fl">{{d.rootCateName || ''}}</div></div>
        <div><div class="secondary fl clearLeft">销售排名:</div><div class="fl">
          <span>{{d.saleRank || ''}}</span>
          {{# if(d.saleRankDiff ==0){ }}
          <span>(-)</span>
          {{# }else if(d.saleRankDiff>0){ }}
          <span style="color:rgb(0,155,136);">(+{{d.saleRankDiff}})</span>
          {{# }else{ }}
          <span style="color:rgb(255,87,34);">({{d.saleRankDiff}})</span>
          {{# } }}
        </div></div>
        <div><div class="secondary fl clearLeft">子类目排名:</div><div class="fl">{{d.leafCateRank || ''}}</div></div>
        <div><div class="secondary fl clearLeft">评分:</div><div class="fl">{{(d.score||'') }} <span class="fRed">{{ (d.ratting ? ('('+ d.ratting +')') : '') }}</span></div></div>
    </div>
</script>

      <script type="text/html" id="FBAhistory_store_site">
    <div class="text_l">
        <div>{{d.storeAcct}}-{{d.salesSite}}</div>
        <div><span>FBA销售:{{d.skuSalesperson||''}}</span></div>
        <div><span>店铺销售:{{d.salesperson||''}}</span></div>
        <div><span>开发:{{d.bizzOwner||''}}</span></div>
        <div><span>更新:</span>{{d.lastSyncTime ? Format(d.lastSyncTime,'yyyy-MM-dd hh:mm') : ''}}</div>
        <div><span>上架:</span>{{d.firstOnShelfTime ? Format(d.firstOnShelfTime,'yyyy-MM-dd hh:mm') : ''}}</div>
    </div>
</script>

      <script type="text/html" id="FBAhistory_saleInfo_tpl">
    <div class="text_l">
        <div class="clearLeft"><span class="secondary w50">3天:</span>{{d.threeSales||'0'}}</div>
        <div class="clearLeft"><span class="secondary w50">7天:</span>{{d.sevenSales||'0'}}</div>
        <div class="clearLeft"><span class="secondary w50">30天:</span>{{d.thirtySales||'0'}}</div>
        <div class="clearLeft"><span class="secondary w50">60天:</span>{{d.sixtySales||'0'}}</div>
        <div class="clearLeft"><span class="secondary w50">90天:</span>{{d.ninetySales||'0'}}</div>
        <div class="clearLeft"><span class="secondary w50">退款(60天):</span>{{d.sixtyRefundRate}}</div>
        <div class="clearLeft"><span class="secondary w50">退款(历史):</span>{{d.refundRate}}</div>
    </div>
</script>

      <script type="text/html" id="FBAhistory_invInfo_tpl">
    <div  class="text_l">
        <div class="clearLeft"><span class="secondary w50">待发:</span>{{d.oaInPackNum||0}}</div>
        <div class="clearLeft"><span class="secondary w50">待入:</span>{{(d.fbaInboundShippedQuality||0 + (d.fbaInboundReceivingQuality||0))}}</div>
        <div class="clearLeft"><span class="secondary w50">可售:</span>{{d.fbaAvailableQuality||'0'}}</div>
        <div class="clearLeft"><span class="secondary w50">不可售:</span>{{d.fbaUnsellableQuality||'0'}}</div>
        <div class="clearLeft"><span class="secondary w50">预留:</span>{{d.fbaResvervedQuality||'0'}}</div>
        <div><span class="secondary" title="可售数量 ÷ 日均销量">可售天数</span>:{{d.salableDay||''}}</div>
        <div><span class="secondary" title="总库存 ÷ 日均销量">周转天数</span>:{{d.stockCycleDay||''}}</div>
    </div>
</script>

      <script type="text/html" id="FBAhistory_excessfo_tpl">
    <div  class="text_l">
        <div class="clearLeft"><span class="secondary w60">0-90:</span>{{d.invAge0To90||'0'}}</div>
        <div class="clearLeft"><span class="secondary w60">91-180:</span>{{d.invAge91To180||'0'}}</div>
        <div class="clearLeft"><span class="secondary w60">181-270:</span>{{d.invAge181To270||'0'}}</div>
        <div class="clearLeft"><span class="secondary w60">271-365:</span>{{d.invAge271To365||'0'}}</div>
        <div class="clearLeft"><span class="secondary w60">365+:</span>{{d.invAge365Plus||'0'}}</div>
        <div class="clearLeft"><span class="secondary w60">月度¥(估):</span>{{d.predictMonthStorageFee||'0'}}</div>
        <div class="clearLeft"><span class="secondary w60">长期¥(估):</span>{{d.predictLongStorageFee||'0'}}</div>
        <div class="clearLeft"><span class="secondary w60">上月¥(实):</span>{{((d.lastMonthStorageFee|| 0) + (d.lastLongStorageFee|| 0)).toFixed(2) }}</div>
    </div>
</script>

      <script type="text/html" id="FBAhistory_option">
    <div style="text-align: left;margin-left: 10px">
        <div><button class="layui-btn layui-btn-xs " type="button" lay-event="FBAhistory_update">更新</button></div>
        <div><button class="layui-btn layui-btn-xs " type="button" lay-event="FBAhistory_log">日志</button></div>
        <div><button class="layui-btn layui-btn-xs " type="button" lay-event="FBAhistory_estimated">定价</button></div>
        <%--<div><button class="layui-btn layui-btn-xs " type="button" lay-event="FBAhistory_editComp">竞品</button></div>--%>
        <permTag:perm funcCode="FBAhistory_setSaleperson">
            <div><button class="layui-btn layui-btn-xs " type="button" lay-event="FBAhistory_setSaleperson_btn">转移</button></div>
        </permTag:perm>
        <div><button class="layui-btn layui-btn-xs " type="button" lay-event="FBAhistory_getSalesTrend">销量</button></div>
        <permTag:perm funcCode="FBAhistory_generateSheinProduct">
            <div><button class="layui-btn layui-btn-xs " type="button" lay-event="FBAhistory_generateSheinProduct">生成shein待刊登</button></div>
        </permTag:perm>
        <div><button class="layui-btn layui-btn-xs " type="button" lay-event="FBAsetOwnGoodsProperties">备货参数</button></div>
        <permTag:perm funcCode="FBAhistory_updatePackDescByList">
        <div><button class="layui-btn layui-btn-xs " type="button" lay-event="packageRemark">包装备注</button></div>
        </permTag:perm>

    </div>
</script>

      <script type="text/html" id="FBAhistory_statistic">
    <div class="text_l">
        {{# if (d.statisticInfo) {}}
        <div><span class="secondary">跟卖店铺:</span>{{d.statisticInfo.allSaleStore - 1}}</div>
        <div><span class="secondary">日均销量:</span>{{d.statisticInfo.allDailySales||''}}</div>
        <div><span class="secondary">可售天数:</span>{{d.statisticInfo.allDailySales ? Math.floor(accDiv(d.statisticInfo.allSalabelStock,d.statisticInfo.allDailySales)) :''}}</div>
        <div><span class="secondary">OA建议:</span>{{d.dailySales == d.statisticInfo.maxDailySales ? d.statisticInfo.allOaSuggestSale : ''}}</div>
        <div><span class="secondary">7天花费$:</span>{{d.statisticInfo.adCostSeven === undefined ? '' : d.statisticInfo.adCostSeven}}</div>
        <div><span class="secondary">7天ACOS:</span>{{d.statisticInfo.acosSeven === undefined ? '' : d.statisticInfo.acosSeven}}</div>
        <div><span class="secondary">7天ACoAS:</span>{{d.statisticInfo.acocsSeven === undefined ? '' : d.statisticInfo.acocsSeven}}</div>
        <div><span class="secondary">30天花费$:</span>{{d.statisticInfo.adCostThirty === undefined ? '' : d.statisticInfo.adCostThirty}}</div>
        <div><span class="secondary">30天ACOS:</span>{{d.statisticInfo.acosThirty === undefined ? '' :  d.statisticInfo.acosThirty}}</div>
        <div><span class="secondary">30天ACoAS:</span>{{d.statisticInfo.acocsThirty === undefined ? '' :  d.statisticInfo.acocsThirty}}</div>
        {{# } }}
    </div>
</script>

      <!-- 添加至FBA -->
      <script type="text/html" id="pop_FBAhistory_add">
    <div class="layui-card">
        <form id="pop_FBAhistory_addForm" class="layui-form" lay-filter="pop_FBAhistory_addForm">
        <div class="mg_50 addtoFBAboxhx">
            <table class="layui-table" lay-filter="FBAhistory_addToPlan_Table" id="FBAhistory_addToPlan_Table"></table>
        </div>
        </form>
    </div>
</script>

      <script type="text/html" id="FBAhistory_addToPlan_storeAcct">
        {{# if (!d.sameAsinStatistcInfo || d.sameAsinStatistcInfo.sameList.length === 1) {}}
            {{d.storeAcct}}
        {{#} else{}}
            <select lay-filter="FBAhistory_addToPlan_storeAcctSelect" data-id="{{d.id}}">
                {{# for (let i = 0; i < d.sameAsinStatistcInfo.sameList.length; ++i) {}}
                <option {{d.sameAsinStatistcInfo.sameList[i].storeAcctId === d.storeAcctId ? 'selected': ''}} value="{{d.sameAsinStatistcInfo.sameList[i].storeAcctId}}" data-hisId="{{d.sameAsinStatistcInfo.sameList[i].id}}" data-sellerSku="{{d.sameAsinStatistcInfo.sameList[i].sellerSku}}" data-platMaxDeliverAmount="{{d.sameAsinStatistcInfo.sameList[i].platMaxDeliverAmount || ''}}" data-dailySales="{{d.sameAsinStatistcInfo.sameList[i].dailySales || ''}}">
                        {{d.sameAsinStatistcInfo.sameList[i].storeAcct}}
                    </option>
                {{# } }}
            </select>
        {{# } }}
</script>

      <script type="text/html" id="FBAhistory_proNum">
    <input type="number" class="layui-input FBAhistory_proNum_class" value="{{d.statisticInfo && d.statisticInfo.allOaSuggestSale && d.statisticInfo.maxDailySales == d.dailySales ? d.statisticInfo.allOaSuggestSale : 0}}" min="0" min="0" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
</script>

      <script type="text/html" id="FBAhistory_addToPlan_sellerSku">
    <div class="FBAhistory_addToPlan_sellerSkuDiv">
        {{d.sellerSku}}
    </div>
    <div>
        {{# if(d.prodSInfo && d.prodSInfo.logisAttrList){ }}
        {{# let logistAttrArr = d.prodSInfo.logisAttrList.split(',')}}
        {{# for (let i = 0; i < logistAttrArr.length; ++i) { let logis = logistAttrArr[i];let alia=getLogisAttrAlia(logis)}}
        {{#  if(alia && alia !== '普'){ }}
        <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logis}}">{{alia}}</span>
        {{# } }}
        {{# }}}
        {{# } }}
    </div>
</script>
      <script type="text/html" id="FBAhistory_addToPlan_dailySales">
    <div class="FBAhistory_addToPlan_dailySalesDiv">
        {{d.dailySales || ''}}
    </div>
</script>
      <script type="text/html" id="FBAhistory_addToPlan_allDailySales">
    <div>
        {{d.sameAsinStatistcInfo && d.sameAsinStatistcInfo.allDailySales ? d.sameAsinStatistcInfo.allDailySales : ''}}
    </div>
</script>
      <script type="text/html" id="FBAhistory_addToPlan_platMaxDeliverAmount">
    <div class="FBAhistory_addToPlan_platMaxDeliverAmountDiv">
        {{d.platMaxDeliverAmount || ''}}
    </div>
</script>

      <script src="${ctx}/static/teafram/teaFram.js"></script>
      <script src="${ctx}/static/js/publishs/amazon/FBAhistory.js"></script>

      <script type="text/html" id="FBAhistory_setLablePop">
    <div class="p20">
        <form class="layui-form" id="FBAhistory_setLablePop_form" lay-filter="FBAhistory_setLablePop_form">
        </form>
    </div>
</script>

      <script type="text/html" id="FBAhistory_editCompPop">
    <div class="p20">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="FBAhistory_editCompPopForm" lay-filter="FBAhistory_editCompPopForm">
                            <div class="layui-form-item">
                                <div class="layui-col-md5 layui-col-lg5">
                                    <label class="layui-form-label">ASIN</label>
                                    <div class="layui-input-block">
                                       <input class="layui-input" name="asin">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-btn layui-btn-sm" id="FBAhistory_editCompPop_crawlingBtn">抓取</div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card">
                    <div id="FBAhistory_editCompPop_compContains"></div>
                </div>
                <div class="layui-card">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">优化思路</label>
                        <div class="layui-input-block layui-form">
                            <textarea class="layui-textarea" id="FBAhistory_editCompPop_optimizeIdea"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</script>

      <script type="text/html" id="FBAhistory_compList_tpl">
    {{# if (d.compList && d.compList.length > 0) {}}
        {{# for (let i in d.compList) {}}
        <a class="canClickEl" href="https://www.amazon.com/dp/{{d.compList[i].compAsin}}" target="_blank">{{d.compList[i].compAsin}}</a>
        {{# } }}
    {{# } }}
</script>

      <%--批量修改弹窗--%>
        <script type="text/html" id="FBAhistory_updateList_pop">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FBAhistory_updateList_Form" lay-filter="FBAhistory_updateList_Form" onsubmit="return false">
                <div class="layui-form-item">
                    <div class="layui-col-md6 layui-col-lg6">
                        <label class="layui-form-label">是否小号类产品</label>
                        <div class="layui-input-block">
                            <select name="ifSmallSize">
                                <option></option>
                                <option value="true">是</option>
                                <option value="false">否</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md6 layui-col-lg6">
                        <label class="layui-form-label">包装规格</label>
                        <div class="layui-input-block">
                            <select name="packType">
                                <option></option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<!--修改包装备注 -->
<script type="text/html" id="FBAhistory_updatePackDesc_pop">
    <div class="layui-card" style="color: #000;margin-top:25px;">
        <div class="layui-card-body">
            <div id="FBAhistory_packDescEdit">
                <div class="layui-form-item">
                  <div class="layui-form-label">包装备注</div>
                  <div class="layui-input-block">
                    <div id="FBAhistory_packDescEditor"></div>
                  </div>
                </div>
            </div>
        </div>
    </div>
</script>

        <%--销量趋势弹窗--%>
          <script type="text/html" id="FBAhistory_salesTrend_Pop">
    <form class="layui-form" id="FBAhistory_salesTrend_Form" lay-filter="FBAhistory_salesTrend_Form">
        <div class="layui-form-item">
            <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">时间维度：</label>
                <div class="layui-input-block">
                    <select name="timeType"  id="FBAhistory_salesTrend_sel" lay-filter="FBAhistory_salesTrend_sel"  >
                        <%--<option value="1" selected>24小时</option>--%>
                        <option value="2">30日</option>
                        <option value="3">12月</option>
                    </select>
                </div>
            </div>
        </div>
    </form>
    <div class="layui-form-item">
        <div id="FBAhistory_salesTrend_echardDiv"  style="width: 100%;height: 500px;"></div>
    </div>
</script>

          <!-- 生成shein待刊登 选择店铺 -->
          <script type="text/html" id="FBAhistory_generateSheinProduct_Pop">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form">
                <div class="layui-form-item">
                    <label class="layui-form-label">店铺：</label>
                    <div class="layui-input-block">
                        <select name="storeAcctId" id="FBAhistory_generateSheinProduct_storeAcctId">
                        </select>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

          <script type="text/html" id="FBAhistory_calPrice_headFreight">
    <div>
        {{# if (d.id) {}}
        <input class="layui-input FBAhistory_calPrice_headFreight_class" value="{{d.headFreight || ''}}">
        {{# } else { }}
        {{d.headFreight || ''}}
        {{#}}}
    </div>
    <input type="hidden" class="layui-input salesSiteVal" value="{{d.salesSite || ''}}" />
</script>
          <script type="text/html" id="FBAhistory_calPrice_shippingPrice">
    <div>
        {{# if (d.id) {}}
        <input class="layui-input FBAhistory_calPrice_shippingPrice_class" value="{{d.shippingPrice || ''}}">
        {{# } else { }}
        {{d.shippingPrice || ''}}
        {{#}}}
    </div>
</script>
          <script type="text/html" id="FBAhistory_calPrice_profitRate">
    <div>
        {{# if (d.id) {}}
        <input class="layui-input FBAhistory_calPrice_profitRate_class">
        {{# } }}
    </div>
</script>
          <script type="text/html" id="FBAhistory_calPrice_newPrice">
    <div>
        {{# if (d.id) {}}
        <input class="layui-input FBAhistory_calPrice_newPrice_class">
        {{# } }}
    </div>
</script>

          <script src="${ctx}/static/util/we.js"></script>

          <script type="text/html" id="FBAhistory_adjustPriceProcess">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-form-item">
                        <form id="FBAhistory_batchModify_batchSetForm1" lay-filter="FBAhistory_batchModify_batchSetForm1" class="layui-form">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品成本(¥)</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="oaCost">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">头程运费(¥)</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="headFreight">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">FBA派送费</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="shippingPrice">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">目标毛利率</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="newProfitRate">
                                </div>
                            </div>
                        </form>

                        <form id="FBAhistory_batchModify_batchSetForm2" lay-filter="FBAhistory_batchModify_batchSetForm2" class="layui-form">
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-col-md5 layui-col-lg5">
                                    <label class="layui-form-label">当前价格</label>
                                    <div class="layui-input-block">
                                        <select name="calculateType">
                                            <option value="1"><b>+</b></option>
                                            <option value="2">-</option>
                                            <option value="3" selected>*</option>
                                            <option value="4">=</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md6 layui-col-lg6">
                                    <input type="number" class="layui-input" name="newPriceInput">
                                </div>
                            </div>
                           
                        </form>
                        <div>
                            <button type="button" id="FBAhistory_batchModifyPrice_batchSetBtn1" class="layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-col-md6 layui-col-lg6" style="margin-left: 40px">
                            <form id="FBAhistory_batchModify_batchSetForm3" lay-filter="FBAhistory_batchModify_batchSetForm3" class="layui-form">
                                <div style="display: flex; align-items: flex-end; margin-bottom: 3px;">
                                    <input type="radio" name="updatePrice" value="1" title="修改刊登价" checked lay-filter="FBAdhistory_updatePrice">
                                    <span name="updateEstimatePriceRemark" style="margin-left: 3px; color: red;">注: 修改刊登价会终止当前促销</span>
                                </div>
                                <div style="display: flex">
                                    <input type="radio" name="updatePrice" value="2" title="修改促销价" lay-filter="FBAdhistory_updatePrice">
                                    <input type="text" style="width: 300px" class="layui-input" id="price_time" name="time" lay-verify="required" readonly>
                                </div>
                            </form>
                        </div>
                        <div class="layui-col-md4 layui-col-lg4">
                            <button type="button" id="FBAhistory_batchModifyPrice_submit" class="fr layui-btn layui-btn-danger layui-btn-sm">批量改价</button>
                            <button type="button" id="FBAhistory_batchModifyPrice_calNewPrice" class="fr layui-btn layui-btn-warm layui-btn-sm">计算目标刊登价</button>
                            <button type="button" id="FBAhistory_batchModifyPrice_calNewProfitRate" class="fr layui-btn layui-btn-normal layui-btn-sm">计算目标毛利率</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                    <div>数量(<span id="FBAhistory_modifyPriceSelectedNum">0</span>/<span id="FBAhistory_modifyPriceNum"></span>)
                        <div class="fr">
                            <div>
                                FBA刊登价=【(商品成本+包装成本+头程运费)/各站点汇率+FBA派送费】/(1-平台佣金费率-毛利率-站点税率)
                            </div>
                            <div>
                                毛利率 = 1 - 平台佣金费率 - 站点税率 - 【(商品成本+包装成本+头程运费)/各站点汇率+FBA派送费】/FBA刊登价
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="FBAhistory_ModifyPriceTable" lay-filter="FBAhistory_ModifyPriceTable"></table>
                </div>
            </div>
        </div>
    </div>
</script>

          <script type="text/html" id="FBAhistory_setLogisticLabelPop">
    <div class="p20">
        <form class="layui-form" id="FBAhistory_setLogisticLabelForm" lay-filter="FBAhistory_setLogisticLabelForm">
            <div id="FBAhistory_setLogisticLabelContains">

            </div>
        </form>
    </div>
</script>

          <script type="text/html" id="FBAhistory_batchModifyPrice_resultTpl">
    {{# if (d.result === '正在执行') {}}
    <i class="layui-icon layui-icon-loading layadmin-loading"></i>
    {{# } else { }}
    {{d.result || ''}}
    {{# } }}
</script>
<!-- 批量修改销售备注 -->
<script type="text/html" id="FBAhistory_editSaleRemarkList_pop">
  <form class="layui-form mg_20" lay-filter="FBAeditSaleRemarkForm" id="FBAeditSaleRemarkForm">
      <div class="layui-input-block">
          <input type="radio" name="remarkType" lay-filter="FBAhistory_remarkType" value="拼接至原备注后" title="拼接至原备注后" checked>
          <input type="radio" name="remarkType" lay-filter="FBAhistory_remarkType" value="覆盖原备注" title="覆盖原备注">
          <input type="radio" name="remarkType" lay-filter="FBAhistory_remarkType" value="删除原备注" title="删除原备注">
      </div>
      <div class="layui-form-item">
          <div class="layui-input-block" style="margin-right: 110px;">
              <textarea type="text" class="layui-textarea" name="newSaleRemark" lay-verify="required"></textarea>
          </div>
      </div>
      <input type="hidden" name="id">
      <button type="button" class="hidden" lay-submit lay-filter="amazonBrandeditSubmit" id="amazonBrandeditSubmit"></button>
  </form>
</script>

          <%@ include file="/WEB-INF/view/jsp/publishs/Amazon/component/salesBehavior.jsp" %>
          <script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
