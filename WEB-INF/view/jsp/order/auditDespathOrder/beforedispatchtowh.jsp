<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>派至仓库前</title>
<style>
    .skuEllipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    #beforedispatchtowh_requestNumLayerId .layui-table-body {
      overflow: hidden;
    }
    .placeholder_color input::placeholder {
        color: #333; /* 设置占位符文本的颜色 */
    }
</style>
<link rel="stylesheet" href="${ctx}/static/style/dispatchtowh.css">

<div class="layui-fluid" id="LAY-beforedispatchtowh">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" id="beforedispatchtowhForm" lay-filter="beforedispatchtowhForm">
            <div class="layui-form-item">
              <div class="layui-col-md4 layui-col-lg4">
                  <label class="layui-form-label labelSel">
                    <select name="orderTimeType">
                      <option value="orderTime">订单时间</option>
                      <option value="shipByDate">截止时间</option>
                    </select>
                  </label>
                  <div class="layui-input-block">
                      <input type="text" class="layui-input" id="beforedispatchtowh_time" name="time" readonly>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                  <label class="layui-form-label">平台</label>
                  <div class="layui-input-block">
                      <select name="platCode" lay-filter="beforedispatchtowhplatCodes" lay-search id="beforedispatchtowhplatCodes">
                      </select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                  <label class="layui-form-label">部门</label>
                  <div class="layui-input-block">
                      <select name="orgs" lay-search class="orgs_hp_custom" lay-filter="beforedispatchtowh_orgs">
                        <option value="">请选择</option>
                      </select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                  <div class="layui-form-label labelSel">
                      <select lay-filter="beforedispatchtowh_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                          <option value="1">销售</option>
                          <option value="2">客服</option>
                      </select>
                  </div>
                  <div class="layui-input-block">
                      <select name="salePersonId" class="users_hp_custom" lay-filter="beforedispatchtowh_salePersonsSelect" id="beforedispatchtowh_salePersonsSelect" xm-select="beforedispatchtowh_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                      </select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 beforedispatchtowh_store_style">
                  <label class="layui-form-label">店铺</label>
                  <div class="layui-input-block">
                      <select name="storeAcctIds"
                      class="users_hp_store_multi"
                      id="beforedispatchtowh_store"
                      xm-select="beforedispatchtowhStoreAcctIds" 
                      xm-select-search 
                      xm-select-search-type="dl" 
                      xm-select-skin="normal" 
                      lay-filter="beforedispatchtowhStoreAcctIds">
                      </select>
                  </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">订单编号</label>
                  <div class="layui-input-block">
                      <input type="text" name="orderIds" class="layui-input" placeholder="多个编号使用逗号隔开">
                  </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">店铺单号</label>
                  <div class="layui-input-block">
                      <input type="text" name="platOrderIds" class="layui-input" placeholder="多个单号使用逗号隔开">
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                  <div class="layui-form-label select_label ml">
                      <select name="skuType">
                          <option value="prodSSkus">商品SKU(模糊)</option>
                          <option value="storeSSkus">店铺SKU(模糊)</option>
                          <option selected value="exactProdSSkus">商品SKU(精确)</option>
                          <option value="exactStoreSSkus">店铺SKU(精确)</option>

                      </select>
                  </div>
                  <div class="layui-input-block">
                      <input type="text" name="skuvalue" class="layui-input" placeholder="支持多个">
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                  <label class="layui-form-label">物流属性</label>
                  <div class="layui-input-block">
                      <select name="prodLogisAttrs" xm-select="beforedispatchtowhLogisAttrs" id="beforedispatchtowhLogisAttrs" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                      </select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                <div class="layui-form-label select_label ml">
                    <select name="sku_num_type" id="slelct_sku_num_type">
                        <option value="sku_num">SKU个数</option>
                        <option value="sku_type">缺货SKU种类</option>
                    </select>
                </div>
                  <div class="layui-input-block dis_flex_space">
                      <input type="number" name="skuQuantityMin" class="layui-input">
                      <span>&nbsp;~&nbsp;</span>
                      <input type="number" name="skuQuantityMax" class="layui-input">
                  </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">平台状态</label>
                  <div class="layui-input-block">
                      <select name="platOrderStatusList" xm-select="beforedispatchtowhStatusList" id="beforedispatchtowhStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                      </select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                  <label class="layui-form-label">商品状态</label>
                  <div class="layui-input-block">
                      <select name="prodIsSale">
                          <option value="">全部</option>
                          <option value="1">在售</option>
                          <option value="0">停售</option>
                      </select>
                  </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">LlistingID</label>
                  <div class="layui-input-block">
                      <input type="text" class="layui-input" name="itemIds" placeholder="多个单号使用逗号隔开">
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                  <label class="layui-form-label">国家/地区</label>
                  <div class="layui-input-block">
                      <select name="shippingCountryCodes" xm-select="beforedispatchtowhShippingCountrys" id="beforedispatchtowhShippingCountrys" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                      </select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                  <label class="layui-form-label">买家指定物流</label>
                  <div class="layui-input-block">
                      <input type="text" class="layui-input" name="buyerRequireShippingType">
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                  <label class="layui-form-label">商品数量</label>
                  <div class="layui-input-block dis_flex_space">
                      <input type="number" name="prodQuantityMin" class="layui-input">
                      <span>&nbsp;~&nbsp;</span>
                      <input type="number" name="prodQuantityMax" class="layui-input">
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                  <label class="layui-form-label labelSel">
                    <select name="platTagsSign" lay-filter="beforedispatchtowh_platTagsSign">
                      <option value="1">标签(包含)</option>
                      <option value="0">标签(不含)</option>
                    </select>
                  </label>
                  <div class="layui-input-block">
                      <select name="platTags" xm-select="beforedispatchtowh_platTags" id="beforedispatchtowh_platTags" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                      </select>
                  </div>
              </div>
               
              <div class="layui-col-lg2 layui-col-md2">
                  <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                      <select name="agentCompany" lay-filter="beforedispatchtowhcompanyType">
                        <option value="logisticsModes">物流方式集</option>
                          <option value="companys">物流公司</option>
                          <option value="agents">货代公司</option>
                      </select>
                  </div>
                  <div class="layui-input-block">
                      <select name="logisticsCompanyId" lay-filter="beforedispatchtowhcompany" id="beforedispatchtowhcompany" lay-search></select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                  <label class="layui-form-label">物流方式</label>
                  <div class="layui-input-block">
                      <select name="logisTypeIds" xm-select="beforedispatchtowhlogisTypeIds" id="beforedispatchtowhlogisTypeIds" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                      </select>
                  </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">跟踪号</label>
                  <div class="layui-input-block">
                      <input type="text" name="logisTrackingNos" class="layui-input" placeholder="">
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                  <label class="layui-form-label">标记发货</label>
                  <div class="layui-input-block">
                      <select name="markShippingStatus" lay-search id="beforedispatchtowhMarkShippingStatus"> 
                      </select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                  <div class="layui-form-label select_label ml placeholder_color">
                      <select name="orderAmountCurrency">
                          <option selected value>订单金额</option>
                          <option value="USD">订单金额(仅USD)</option>
                          <option value="CNY">订单金额(仅CNY)</option>
                      </select>
                  </div>
                  <div class="layui-input-block dis_flex_space">
                      <input type="number" name="platOrderAmtMin" class="layui-input">
                      <span>&nbsp;~&nbsp;</span>
                      <input type="number" name="platOrderAmtMax" class="layui-input">
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label labelSel">
                  <select name="dateType">
                      <option value="1">订单天数</option>
                      <option value="2">跟踪号天数</option>
                      <option value="3">上网剩余天数</option>
                      <option value="4">跟踪剩余天数</option>
                      <option value="5">发货剩余天数</option>
                  </select>
                </label>
                <div class="layui-input-block dis_flex_space">
                  <input type="number" name="delayMin" class="layui-input" min="0" />
                  <span>&nbsp;~&nbsp;</span>
                  <input type="number" name="delayMax" class="layui-input" min="0" />
                </div>
              </div>
              <div class="layui-row">
                <div class="layui-col-lg2 layui-col-md2">
                  <label class="layui-form-label labelSel">
                    <select name="orderLabels" 
                    xm-select="beforedispatchtowh_orderLabels" 
                    id="beforedispatchtowh_orderLabels" 
                    xm-select-search 
                    xm-select-search-type="dl" 
                    xm-select-skin="normal"></select>
                  </label>
                  <div class="layui-input-block">
                      <input type="text" name="orderNote" class="layui-input" placeholder="备注内容" style="height:34px;">
                  </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2 disN beforedispatchtowh-showLack">
                    <label class="layui-form-label">能否替换</label>
                   <div class="layui-input-block">
                       <select name="replace">
                           <option value="">请选择</option>
                           <option value="true">能</option>
                           <option value="false">否</option>
                       </select>
                   </div>
                  </div>
                <div class="layui-col-lg2 layui-col-md2 disN beforedispatchtowh-showDispath">
                  <label class="layui-form-label">是否占用</label>
                 <div class="layui-input-block">
                     <select name="holdStock">
                         <option value="">请选择</option>
                         <option value="true">是</option>
                         <option value="false">否</option>
                     </select>
                 </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2 disN beforedispatchtowh-showDispath">
                      <label class="layui-form-label">申请失败原因</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="logisApplyFailMsg">
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2 ">
                    <label class="layui-form-label">排序方式</label>
                    <div class="layui-input-block">
                        <select name="orderStr" lay-search>
                            <option value="order_time_cn asc">订单时间正序</option>
                            <option value="order_time_cn desc">订单时间倒序</option>
                            <option value="logis_apply_time asc">申请跟踪号时间正序</option>
                            <option value="logis_apply_time desc">申请跟踪号时间倒序</option>
                            <option value="ship_by_date asc">截止发货时间正序</option>
                            <option value="ship_by_date desc">截止发货时间倒序</option>
                            <option value="plat_order_amt asc">订单金额正序</option>
                            <option value="plat_order_amt desc">订单金额倒序</option>
                            <option value="profit asc">利润正序</option>
                            <option value="profit desc">利润倒序</option>
                            <option value="profit/(plat_order_amt*exchange_rate) asc">利润率正序</option>
                            <option value="profit/(plat_order_amt*exchange_rate) desc">利润率倒序</option>
                        </select>
                    </div>
                </div>
                <!-- <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">订单类型</label>
                  <div class="layui-input-block">
                      <select name="operOrderType" lay-search>
                          <option value="">请选择</option>
                          <option value="1">拆分订单</option>
                          <option value="2">合并订单</option>
                          <option value="3">重寄订单</option>
                      </select>
                  </div>
                </div> -->
                <div class="layui-col-md2 layui-col-lg2 disflex" style="height: 30px;">
                  <div class="externalBox mr5" id="showMoreSearchCondition_beforedispatchtowh" style="margin-left: 5px;width: 90px">
                      <span>更多<span class="hasValue"></span></span>
                      <span id="hide_icon_beforedispatchtowh" class="fr mr5 hidden">︽</span>
                      <span id="show_icon_beforedispatchtowh" class="fr mr5">︾</span>
                  </div>
                  <button type="button" class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch mr5" lay-submit id="beforedispatchtowhSearch" lay-filter="beforedispatchtowhSearch">查询</button>
                  <div id="beforedispatchtowh_save" class="inline_block pora"></div>
                  <div id="beforedispatchtowh_exportTemplate" class="mr5" style="display: inline-block;position: relative;margin-left: 30px;"></div>
                </div>
                <div class="externalContainbeforedispatchtowh disN">
                  <div class="externalPopAuditorder">
                    <div class="layui-form-item">
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">买家账号</label>
                          <div class="layui-input-block">
                              <input type="text" name="buyerUserId" class="layui-input">
                          </div>
                      </div>
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">收件人</label>
                          <div class="layui-input-block">
                              <input type="text" name="shippingUsername" class="layui-input">
                          </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">发货仓库</label>
                          <div class="layui-input-block">
                              <select name="warehouseId" lay-search>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">平台交易ID</label>
                          <div class="layui-input-block">
                              <input type="text" name="platTransactionIds" class="layui-input">
                          </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">付款邮箱</label>
                          <div class="layui-input-block">
                              <input type="text" name="buyerEmail" class="layui-input">
                          </div>
                      </div>
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">收款邮箱</label>
                          <div class="layui-input-block">
                              <input type="text" name="sellerEmail" class="layui-input">
                          </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">开发专员</label>
                          <div class="layui-input-block">
                              <select name="preprodDevId" id="beforedispatchtowhpreprodDevId" lay-search>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">采购专员</label>
                          <div class="layui-input-block">
                              <select name="purchasingAgentId" id="beforedispatchtowhpurchasingAgentId" lay-search>
                              </select>
                          </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">利润区间</label>
                          <div class="layui-input-block dis_flex_space">
                              <input type="number" name="profitMin" class="layui-input">
                              <span>&nbsp;~&nbsp;</span>
                              <input type="number" name="profitMax" class="layui-input">
                          </div>
                      </div>
                      <div class="layui-col-lg5 layui-col-md5 ">
                          <label class="layui-form-label">单品金额</label>
                          <div class="layui-input-block dis_flex_space">
                              <input type="number" name="platUnitPriceMin" class="layui-input">
                              <span>&nbsp;~&nbsp;</span>
                              <input type="number" name="platUnitPriceMax" class="layui-input">
                          </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">州/省</label>
                          <div class="layui-input-block">
                              <input type="text" name="buyerShippingState" class="layui-input">
                          </div>
                      </div>
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">电话号码</label>
                          <div class="layui-input-block">
                              <input type="text" name="phoneNumber" class="layui-input">
                          </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">地址</label>
                          <div class="layui-input-block">
                              <input type="text" name="address" class="layui-input">
                          </div>
                      </div>
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">邮编</label>
                          <div class="layui-input-block">
                              <input type="text" name="zipCode" class="layui-input">
                          </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label">城市</label>
                          <div class="layui-input-block">
                              <input type="text" name="city" class="layui-input">
                          </div>
                      </div>
                      <div class="layui-col-md5 layui-col-lg5">
                        <label class="layui-form-label">订单类型</label>
                        <div class="layui-input-block">
                            <select name="operOrderType" lay-search>
                                <option value="">请选择</option>
                                <option value="1">拆分订单</option>
                                <option value="2">合并订单</option>
                                <option value="3">重寄订单</option>
                            </select>
                        </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-col-md5 layui-col-lg5">
                          <label class="layui-form-label labelSel">
                            <select name="orderTagSign" lay-filter="beforedispatchtowh_orderTagSign">
                              <option value="1">订单标签(包含)</option>
                              <option value="0">订单标签(不含)</option>
                            </select>
                          </label>
                          <div class="layui-input-block">
                            <select name="orderTagList" 
                            xm-select="beforedispatchtowh_orderTagLists" id="beforedispatchtowh_orderTagLists" 
                            xm-select-search 
                            xm-select-search-type="dl" 
                            xm-select-skin="normal">
                            </select>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div class="layui-col-md3 layui-col-lg3">
                  <button type="button" class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch" lay-submit id="beforedispatchtowhSearch" lay-filter="beforedispatchtowhSearch">查询</button>
                  <div id="beforedispatchtowh_exportTemplate" style="display: inline-block;position: relative;"></div>
                  <div id="beforedispatchtowh_save" class="inline_block pora"></div>
                </div> -->
              </div>
              <!-- 子状态 -->
              <input class="hide" type="text" name="processStatus" value="1">
              <input class="hide" type="text" name="firstTab" value="audit">
              <input class="hide" type="text" name="limit" value="5000">
              <input class="hide" type="text" name="page" value="1">
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="beforedispatchtowhCard">
        <div class="fixHigh">
           <div class="layui-card-header">
               <div class="fixTab">
                   <!-- 页签点击结构 -->
                   <div class="layui-tab" lay-filter="beforedispatchtowh_tabs" id="beforedispatchtowh_tabs">
                       <ul class="layui-tab-title">
                           <li data-index="audit" class="layui-this">待审核</li>
                           <li data-index="dispatch">待派单</li>
                           <li data-index="lack">缺货单</li>
                           <li data-index="abnormal">异常订单</li>
                       </ul>
                   </div>
                   <div style="display: flex;">
                    <!-- 待审核按钮集合 -->
                      <div class="beforedispatchtowh-audit">
                        <permTag:perm funcCode="toAuditOrder_deleteOrder_permTag">
                          <span class="layui-btn layui-btn-danger layui-btn-sm" id="toAuditOrder_deleteOrder">
                            删除订单
                          </span>
                        </permTag:perm>
                        <div id="toAuditOrder_platOper" class="layui-inline">
                          <permTag:perm funcCode="toAuditOrder_platBtnHandle_permTag">
                              <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">平台操作</button>
                              <ul class="hidden">
                                  <li>
                                      <div>后台取消</div>
                                      <ul>
                                          <li id="toAuditOrder_cancelOrderEbay">ebay取消</li>
                                      </ul>
                                  </li>
                                  <li>
                                      <div>其他操作</div>
                                      <ul>
                                          <li id="toAuditOrder_syncOrderStatus">更新订单状态</li>
                                          <li id="toAuditOrder_markDelivery">标记平台发货</li>
                                          <li id="toAuditOrder_decryptAddress">解密地址</li>
                                      </ul>
                                  </li>
                                  <li>
                                      <div>邮件</div>
                                      <ul>
                                          <li id="toAuditOrder_amazonEmail">Amazon邮件</li>
                                          <li id="toAuditOrder_eBayEmail">eBay邮件</li>
                                          <!-- <li id="toAuditOrder_shopeeEmail">shopee发送消息</li> -->
                                      </ul>
                                  </li>
                              </ul>
                          </permTag:perm>
                        </div>
                          <div id="toAuditOrder_editOrder" class="layui-inline">
                              
                              <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单编辑</button>
                              <ul class="hidden">
                                  <li>
                                      <div>订单修改</div>
                                      <ul>
                                          <permTag:perm funcCode="toAuditOrder_newOrder_permTag">
                                          <li id="toAuditOrder_newOrder">新增订单</li>
                                          </permTag:perm>
                                          <permTag:perm funcCode="toAuditOrder_batchEditWareHouse_permTag">
                                          <li id="toAuditOrder_batchEditWareHouse">修改仓库和物流</li>
                                          </permTag:perm>
                                      </ul>
                                  </li>
                                  <li>
                                      <div>更新数据</div>
                                      <ul>
                                          <li id="updateCountry">更新法属国</li>
                                          <li id="updateProducts">更新商品信息</li>
                                      </ul>
                                  </li>
                              </ul>
                              
                          </div>
                          <div id="toAuditOrder_dealOrder" class="layui-inline">
                              <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单处理</button>
                              <ul class="hidden">
                                  <permTag:perm funcCode="toaudit_auditOrderBtn">
                                      <li id="toaudit_auditOrder" style="background: #00B83F;color: #fff;">审核</li>
                                  </permTag:perm>
                                  <li id="toAuditOrder_reMatchWarehouseType">匹配分仓</li>
                                  <li id="toAuditOrder_appointWarehouseType">指定仓库类型</li>
                                  <permTag:perm funcCode="toAuditOrder_matchLogis_permTag">
                                  <li id="toAuditOrder_matchLogis">匹配物流</li>
                                  </permTag:perm>
                                  <permTag:perm funcCode="toAuditOrder_reParseSku_permTag">
                                  <li id="toAuditOrder_reParseSku">匹配SKU</li>
                                  </permTag:perm>
                                  <permTag:perm funcCode="toAuditOrder_markException_permTag">
                                  <li id="toAuditOrder_markException" style="background: #FFB951;color: #fff;">标记异常</li>
                                  </permTag:perm>
                                  <permTag:perm funcCode="toAuditOrder_toCancel_permTag">
                                  <li id="toAuditOrder_toCancel" style="background: #ff0000;color: #fff;">取消订单</li>
                                  </permTag:perm>
                                  <permTag:perm funcCode="toAuditOrder_toShipped_permTag">
                                  <li id="toAuditOrder_toShipped">直接转已发货</li>
                                  </permTag:perm>
                                  <li id="toAuditOrder_modifyOrderLabel">批量备注</li>
                              </ul>
                          </div>
                      </div>
                       <!-- 待派单/缺货按钮集合 -->
                       <div class="beforedispatchtowh-dispatch disN">
                        
                        <div id="toDespatchOrder_exportDetail" class="layui-inline">
                          <permTag:perm funcCode="platform_operation_toDespatchOrder_export">
                          <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">导出</button>
                          <ul class="hidden">
                            <li data-detail="false">导出缺货SKU汇总</li>
                            <li data-detail="true">导出缺货SKU明细</li>
                          </ul>
                          </permTag:perm>
                        </div>
                        <div id="toDespatchOrder_platOperate" class="layui-inline">
                          <permTag:perm funcCode="platform_operation_toDespatchOrder_Order">
                              <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">平台操作</button>
                              <ul class="hidden">
                                  <li>
                                      <div>后台取消</div>
                                      <ul>
                                        <permTag:perm funcCode="toDespatchOrder_cancelOrderEbay_permTag">
                                            <li id="toDespatchOrder_cancelOrderEbay">ebay取消</li>
                                        </permTag:perm>
                                        <permTag:perm funcCode="toDespatchOrder_wishBtnPermTag">
                                            <li id="toDespatchOrder_wishRefund">wish退款</li>
                                        </permTag:perm>
                                        <permTag:perm funcCode="toDespatchOrder_tiktokBtnPermTag">
                                          <li id="toDespatchOrder_cancelOrderTiktok">tiktok取消</li>
                                        </permTag:perm>
                                      </ul>
                                  </li>
                                  <li>
                                      <div>其他操作</div>
                                      <ul>
                                          <li id="toDespatchOrder_syncOrderStatus">更新订单状态</li>
                                          <li id="toDespatchOrder_markDelivery">标记平台发货</li>
                                          <li id="toDespatchOrder_decryptAddress">解密地址</li>
                                          <li id="toDespatchOrder_deliverDeclare">修改发货声明</li>
                                      </ul>
                                  </li>
                                  <li>
                                      <div>邮件</div>
                                      <ul>
                                        <permTag:perm funcCode="toDespatchOrder_amazonEmail_permTag">
                                            <li id="toDespatchOrder_amazonEmail">Amazon邮件</li>
                                        </permTag:perm>
                                        <permTag:perm funcCode="toDespatchOrder_eBayEmail_permTag">
                                            <li id="toDespatchOrder_eBayEmail">eBay邮件</li>
                                        </permTag:perm>
                                        <permTag:perm funcCode="toDespatchOrder_shopeeEmail_permTag">
                                            <li id="toDespatchOrder_shopeeEmail">shopee发送消息</li>
                                        </permTag:perm>
                                        <permTag:perm funcCode="toDespatchOrder_tiktokEmail_permTag">
                                            <li id="toDespatchOrder_tiktokEmail">tiktok发送消息</li>
                                        </permTag:perm>

                                          <!--优选仓拒单按钮-->
                                          <permTag:perm funcCode="toDespatchOrder_rejectOrderdabao_permTag">
                                          <li id="toDespatchOrder_rejectOrderdabao">
                                            优选仓拒单
                                          </li>
                                          </permTag:perm>
                                      </ul>
                                  </li>
                              </ul>
                          </permTag:perm>
                        </div>
                        <div id="toDespatchOrder_logis" class="layui-inline">
                          <permTag:perm funcCode="toDespatchOrder_LogisBtnHandle_permTag">
                          <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">物流</button>
                          <ul class="hidden">
                              <li id="toDespatchOrder_matchLogis">匹配物流</li>
                              <li id="toDespatchOrder_updatelogistype">手动指定物流</li>
                              <li id="toDespatchOrder_applylogisno">申请跟踪号</li>
                              <li id="toDespatchOrder_removelogisno">清空跟踪号</li>
                              <li id="toDespatchOrder_cancelwishpost">取消wishpost跟踪号</li>
                              <li id="toDespatchOrder_cancelEdisebay">取消橙联跟踪号</li>
                              <li id="toDespatchOrder_getEdisebay" style="display: none">获取跟踪号</li>
                              <li id="toDespatchOrder_editTrackingNo">修改跟踪号</li>
                              <permTag:perm funcCode="toDespatchOrder_ChildTrackingNo_permTag">
                                <li id="toDespatchOrder_aliexpressChildApplyTrackingNo">速卖通子单申请跟踪号</li>
                              </permTag:perm>
                          </ul>
                          </permTag:perm>
                        </div>
                        <div id="toDespatchOrder_dealOrder" class="layui-inline">
                          <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单处理</button>
                          <ul class="hidden">
                              <permTag:perm funcCode="toDespatchOrder_dispatch_permTag">
                              <li id="toDespatchOrder_dispatch">派至仓库</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_toAudit_permTag">
                              <li id="toDespatchOrder_toAudit">转待审核</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_markException_permTag">
                              <li id="toDespatchOrder_markException" style="background: #FFB951;color: #fff;">标记异常</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_toCancel_permTag">
                              <li id="toDespatchOrder_toCancel" style="background: #ff0000;color: #fff;">取消订单</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_toShipped_permTag">
                              <li id="toDespatchOrder_toShipped">直接转已发货</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_batchEditReceiver_permTag">
                              <li id="toDespatchOrder_batchEditReceiver">修改收件信息</li>
                              </permTag:perm>
                              <li id="toDespatchOrder_batchRemark">批量备注</li>
                              <permTag:perm funcCode="toDespatchOrder_updateCostInfo_permTag">
                              <li id="toDespatchOrder_updateCostInfo">更新商品信息</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_oneClickDelivery_permTag">
                              <li id="toDespatchOrder_oneClickDelivery">一键派单</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_holdStockTask_permTag">
                              <li id="toDespatchOrder_holdStockTask">全量库存占用</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_towaitToShip_permTag">
                              <li id="toDespatchOrder_towaitToShip">转至待发货</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_toCheckList_permTag">
                              <li id="toDespatchOrder_toCheckList">转待核单</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_replenishCheck_permTag">
                                  <li id="toDespatchOrder_replenishCheck">补货检测</li>
                              </permTag:perm>
                              <permTag:perm funcCode="toDespatchOrder_toWarehouseIntercept_permTag">
                                  <li id="toDespatchOrder_toWarehouseIntercept">转至仓库拦截单</li>
                              </permTag:perm>
                          </ul>
                        </div>
                        <button type="button" id="toDespatchOrder_printlogistpl" class="layui-btn layui-btn-sm">打印面单</button>
                      </div>
                    <span class="layui-btn-sm layui-btn layui-btn-normal" id="beforedispatchtowh_saveOrderConfig">
                        保存设置
                    </span>
                      <span class="layui-btn-sm layui-btn" id="beforedispatchtowh_copyOrderNum">
                        复制订单号
                      </span>
                      <span class="layui-btn-sm layui-btn" id="beforedispatchtowh_copyStoreNum">
                        复制店铺单号
                      </span>
                      <span class="layui-btn-sm layui-btn" id="beforedispatchtowh_copyItemId" style="margin-right: 3px;">
                        复制itemId
                      </span>
                      <!-- 异常订单按钮集合 -->
                      <div class="beforedispatchtowh-abnormal disN">
                          <div id="abnormalOrder_logis" class="layui-inline disN">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">物流</button>
                            <ul class="hidden">
                                <permTag:perm funcCode="abnormalOrder_matchLogis_permTag">
                                <li id="abnormalOrder_matchLogis">匹配物流</li>
                                </permTag:perm>
                                <permTag:perm funcCode="abnormalOrder_updatelogistype_permTag">
                                <li id="abnormalOrder_updatelogistype">手动指定物流</li>
                                </permTag:perm>
                                <permTag:perm funcCode="abnormalOrder_applylogisno_permTag">
                                    <li id="abnormalOrder_applylogisno">申请跟踪号</li>
                                </permTag:perm>
                                <permTag:perm funcCode="abnormalOrder_removelogisno_permTag">
                                <li id="abnormalOrder_removelogisno">清空跟踪号</li>
                                </permTag:perm>
                                <permTag:perm funcCode="abnormalOrder_cancelwishpost_permTag">
                                <li id="abnormalOrder_cancelwishpost">取消wishpost跟踪号</li>
                                </permTag:perm>
                                <permTag:perm funcCode="abnormalOrder_cancelEdisebay_permTag">
                                <li id="abnormalOrder_cancelEdisebay">取消橙联跟踪号</li>
                                </permTag:perm>
                            </ul>
                          </div>
                          <div id="abnormalOrder_orderHandle" class="layui-inline disN">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单处理</button>
                            <ul class="hidden">
                                <permTag:perm funcCode="abnormalOrder_batchEditWareHouse_permTag">
                                <li id="abnormalOrder_batchEditWareHouse_copy">修改仓库和物流</li>
                                </permTag:perm>
                                <permTag:perm funcCode="abnormalOrder_toCancel_permTag">
                                <li id="abnormalOrder_toCancel_copy">取消订单</li>
                                </permTag:perm>
                                <permTag:perm funcCode="abnormalOrder_toAudit_permTag">
                                <li id="abnormalOrder_toAudit_copy">转待审核</li>
                                </permTag:perm>
                            </ul>
                          </div>
                          <permTag:perm funcCode="abnormalOrder_removelogisno_permTag">
                          <button type="button" class="layui-btn layui-btn-normal layui-btn-sm hidden" id="abnormalOrder_removelogisno_copy">清空跟踪号</button>
                          </permTag:perm>

                          <permTag:perm funcCode="abnormalOrder_syncOrderStatus_permTag">
                          <button type="button" id="abnormalOrder_syncOrderStatus" class="layui-btn layui-btn-normal layui-btn-sm hidden">更新订单状态</button>
                          </permTag:perm>
                          <permTag:perm funcCode="abnormalOrder_batchEditWareHouse_permTag">
                          <button type="button" id="abnormalOrder_batchEditWareHouse" class="layui-btn layui-btn-normal layui-btn-sm hidden">修改仓库和物流</button>
                          </permTag:perm>
                          <permTag:perm funcCode="abnormalOrder_replenishCheck_permTag">
                              <button type="button" id="abnormalOrder_replenishCheck" class="layui-btn layui-btn-normal layui-btn-sm hidden">补货检测</button>
                          </permTag:perm>

                          <permTag:perm funcCode="abnormalOrder_markExceptionBtn_permTag">
                          <button type="button" id="abnormalOrder_markExceptionBtn" class="layui-btn layui-btn-normal layui-btn-sm hidden">标记异常</button>
                          </permTag:perm>
                        
                          <permTag:perm funcCode="abnormalOrder_holdStockTask_permTag">
                          <button type="button" id="abnormalOrder_holdStockTask" class="layui-btn layui-btn-normal layui-btn-sm hidden">全量库存占用</button>
                          </permTag:perm>
                          <permTag:perm funcCode="abnormalOrder_toAudit_permTag">
                          <button type="button" id="abnormalOrder_toAudit" class="layui-btn layui-btn-normal layui-btn-sm hidden">转待审核</button>
                          </permTag:perm>
                          <permTag:perm funcCode="abnormalOrder_toCancel_permTag">
                          <button type="button" id="abnormalOrder_toCancel" class="layui-btn layui-btn-normal layui-btn-sm hidden">转取消订单</button>
                          </permTag:perm>
                      </div>
                      <span class="layui-btn-sm layui-btn" id="beforedispatchtowh_copyOrderNum" style="margin-left: 3px;">
                        复制订单号
                      </span>
                      <span class="layui-btn-sm layui-btn" id="beforedispatchtowh_copyStoreNum">
                        复制店铺单号
                      </span>
                      <span class="layui-btn-sm layui-btn" id="beforedispatchtowh_copyItemId">
                        复制itemId
                      </span>
                   </div>
               </div>
           </div>
       </div>
       <!-- 下面放表格 -->
       <div class="layui-card-body" style="padding-top: 0px;">
          <!-- 待审核表格/分页/tab -->
          <div class="beforedispatchtowh-audit">
            <div id="beforedispatchtowh_auditStatusTabs" class="layui-tab" lay-filter="beforedispatchtowh_auditStatusTabs">
              <ul class="layui-tab-title"></ul>
            </div>
            <div id="beforedispatchtowh_auditTable" style="width: 100%;height: 500px;" class="ag-theme-balham"></div>
            <div class="pageSortfix" id="beforedispatchtowh_auditPage"></div>
          </div>
          <!-- 待派单/缺货表格/分页/tab -->
          <div class="beforedispatchtowh-dispatch disN">
            <div id="beforedispatchtowh_dispatchStatusTabs" class="layui-tab" lay-filter="beforedispatchtowh_dispatchStatusTabs">
              <ul class="layui-tab-title"></ul>
            </div>
            <div id="beforedispatchtowh_dispatchTable" style="width: 100%;height: 500px;" class="ag-theme-balham"></div>
            <div class="pageSortfix" id="beforedispatchtowh_dispatchPage"></div>
          </div>
          <!-- 异常单表格/分页/tab -->
          <div class="beforedispatchtowh-abnormal disN">
            <div id="beforedispatchtowh_abnormalStatusTabs" class="layui-tab" lay-filter="beforedispatchtowh_abnormalStatusTabs">
              <ul class="layui-tab-title"></ul>
            </div>
            <div id="beforedispatchtowh_abnormalTable" style="width: 100%;height: 500px;" class="ag-theme-balham">
            </div>
            <div class="pageSortfix" id="beforedispatchtowh_abnormalPage"></div>
          </div>
       </div>
      </div>
    </div>
  </div>
</div>

<!-- #region 待审核页面开始 -->
<!-- 表格渲染模板 -->
<script type="text/html" id="FBAdelivery_imageTpl">
  <div>
      <img width="60" height="60" data-original="{{d.image||d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
  </div>
</script>

<script type="text/html" id="toAuditOrder_id_tpl">
  <div class="alignLeft">
      <input type="hidden" class="toAuditOrder_col_id" value="{{d.id}}">
      <div>
              <span class="pora copySpan">
                  <a>{{d.id||""}}</a>
                  <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
              </span>
          <span class="gray">[<span id="toAudit_table_storeAcct">{{d.storeAcct||""}}</span>[{{d.allrootAliasName||""}}]]</span>
          {{# if(d.operOrderType=="1"){ }}
          <span class="hp-badge layui-bg-orange fr" title="拆出订单">拆</span> {{# }else if(d.operOrderType=="2"){ }}
          <span class="hp-badge layui-bg-orange fr" title="合并订单">合</span> {{# }}}
      </div>
      <div>
                  <span class="pora copySpan">
                  <a id="toAudit_table_platOrderId">{{d.platOrderId}}{{# if(d.platStoreOrderId){ }}({{d.platStoreOrderId}}){{# }}}</a>
                  <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
              </span>
      </div>
      <div><span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span></div>
      <div><span class="gray">销售:</span><span>{{d.salesPersons||''}}</span></div>
  </div>
</script>

<script type="text/html" id="toAuditOrder_platOrderAmt_tpl">
  <div class="alignLeft">
      <div><span class='gray'>{{d.currency||""}}</span><span id="toAudit_table_platOrderAmt">{{d.platOrderAmt||""}}</span></div>
      <div><span class="gray">利润(RMB)</span><span>{{d.profit||'0.00'}}</span></div>
      <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
  </div>
</script>

<script type="text/html" id="toAuditOrder_prodQuantity_tpl">
  <div class="alignLeft">
      <div><span class="gray">种类：</span><span id="toAudit_table_skuQuantity">{{d.kindNum||""}}</span></div>
      <div><span class="gray">数量：</span><span id="toAudit_table_prodQuantity">{{d.prodQuantity||""}}</span></div>
      <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
  </div>
</script>

<script type="text/html" id="toAuditOrder_shippingUsername_tpl">
  <div class="alignLeft">
      <div id="toAudit_table_shippingUsername">{{d.shippingUsername||""}}</div>
      <div>[{{d.shippingCountryCnName||""}}]</div>
  </div>
</script>

<script type="text/html" id="toAuditOrder_logisTypeName_tpl">
  <div class="alignLeft">
      <div><span class="gray">买家:</span><span id="toAudit_table_buyerRequireShippingType">{{d.buyerRequireShippingType||""}}</span></div>
      <div><span class="gray">发货:</span><span id="logisTypeName_toAuditOrder">[{{d.logisTypeName||""}}]</span><span id="logisTrackingNo_toAuditOrder">[{{d.logisTrackingNo||""}}]</span></div>
  </div>
</script>

<script type="text/html" id="toAuditOrder_time_tpl">
  <div class="alignLeft">
      <div><span class="gray">订单:</span><span id="toAudit_table_orderTimeCn">{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})</span></div>
      <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
      <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
  </div>
</script>


<script type="text/html" id="toAuditOrder_option_tpl">
  <div class="dis_flex_start">
      <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditOrder_modify">修改订单</button>
      <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditOrder_demolition">拆分订单</button>
      <button class="layui-btn layui-btn-xs mtb" lay-event="">邮件</button>
      <permTag:perm funcCode="toAuditOrder_issueRefund">
          <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditOrder_issueRefund">eBay退款</button>
      </permTag:perm>
      <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditOrder_remark">备注</button>
  </div>
</script>

<script type="text/html" id="toAuditOrder_detail_img_tpl">
  <div>
      <img width="60" height="60" data-original="{{d.imageUrl || ''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
  </div>
</script>

<script type="text/html" id="toAuditOrder_detail_isSale">
  {{# if(d.isSale){ }}
      <span>在售</span>
  {{# } else if (!d.isSale&&d.isSale != null) { }}
      <span style="font-weight:700;font-size:24px;color:#f00;">停售</span>
  {{# } else {}}
      <span></span>
  {{# } }}
</script>

<script type="text/html" id="add_product_img">
  <div>
      <img width="60" height="60" data-original="${tplIVP}{{d.image||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
  </div>
</script>

<script type="text/html" id="add_product_psku">
  <div>{{d.parent.pSku}}</div>
</script>

<script type="text/html" id="orginal_order_products">
  <div class="dis_flex">
      <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
      <div>
          <div>{{d.prodSSku||""}}
          </div>
          <div><span>Color</span>{{d.style||""}}</div>
      </div>
      <div><span>×</span><span>{{d.platQuantity||""}}</span></div>
      <div>
          {{# if(!d.isSale){ }}
              <span class="layui-badge plus-layui-badge ml5">停</span>
          {{# } }}
      </div>
  </div>
</script>
<script type="text/html" id="orginal_order_stock">
  <div><span class="gray">库存sku：{{d.availableStock||"0"}}</span></div>
  <div><span class="gray">当前数量：{{d.prodQuantity||"0"}}</span></div>
</script>

<script type="text/html" id="toAuditOrder_platOrderStatus_tpl">
  <div class="alignLeft">
      <div><span class="gray">留言：{{d.buyerNote||""}}</span></div>
      <!-- <div><span class="gray">标记发货：{{d.markShippingStatus || '' }} -->
      <div><span class="gray">标记发货：{{#  if(d.markShippingStatus == 0){ }}
                      未标记
                  {{#  } else if(d.markShippingStatus == 1) { }}
                      已标记
                  {{#  } else if(d.markShippingStatus == 2) { }}
                      标记失败
                  {{#  } }}
              </span></div>
      <div><span class="gray">订单标签：{{d.orderLabel||''}}</span></div>
      <div><span class="gray">订单状态：{{d.platOrderStatus||""}}</span></div>
      <%-- <div class="text_l"><span class="gray">万邑通状态：{{d.winitStatus||""}}</span></div> --%>
      <div><span class="gray">打印面单状态：</span></div>
  </div>
</script>

<!-- 商品价格 -->
<script type="text/html" id="toAuditOrder_edit_platOrderProdPrice">
  <div style="text-align:left;">
    <div title="平均库存成本|商品成本">
      成本(¥):{{d.prodUnitCost || ''}}|{{d.detailCostPrice || ''}}
    </div>
    <div>净重(g):{{d.prodUnitWeight || ''}}</div>
  </div>
</script>
<!-- 商品信息 -->
<script type="text/html" id="toAuditOrder_edit_platOrderProdInfo">
  <div style="text-align:left;">
    <div>库位:{{d.stockLocation || ''}}</div>
    <div class="onlyShowThreeLine" title="{{d.prodTitle || ''}}">
      名称:<span class="pora copySpan">
        <a>{{d.prodTitle || ''}}</a>
        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)" type="button">复制</button>
      </span>
    </div>
  </div>
</script>
<!-- 订单信息 -->
<script type="text/html" id="toAuditOrder_edit_platOrderOrderInfo">
  <div style="text-align:left;">
    <div>报关信息:{{d.customsEnName || ''}}</div>
    <div>订单状态:{{d.platOrderDetailStatus || ''}}</div>
  </div>
</script>

<script type="text/html" id="orginal_order_demolition">{{ d.prodQuantity * d.prodUnitWeight }}</script>

<script type="text/html" id="orginal_order_dynamicWeight"></script>

<script type="text/html" id="orginal_order_dynamicMoney"></script>

<script type="text/html" id="orginal_order_number">
  <input type="text" class="layui-input" name="demolitionQuality" onchange="commonSetInputMaxMinVal(this,{{d.prodQuantity}}, 1)">
</script>

<script type="text/html" id="toAuditOrder_edit_ListingID">
  <input type="text" class="layui-input" name="" value="{{d.itemId||''}}">
</script>

<script type="text/html" id="toAuditOrder_edit_Prodsku">
  <div>
    <div>
      {{# if(!d.isSale){ }}
      <span class="layui-badge">停</span>
      {{# } }}
    </div>
    <div>
      {{# if(d.logisAttrList){ }}
        {{# layui.each(d.logisAttrList.split(','), function(attrIndex, attrItem){ }}
          {{# if(attrItem != '普货'){ }}
          <span class="layui-badge">{{attrItem}}</span>
          {{# } }}
        {{# }) }}
      {{# } }}
    </div>
  </div>
  <div class="dis_flex">
      <input type="text" class="layui-input" name="" value="{{d.prodSSku}}">
      <i class="layui-icon refresh_icon">&#xe669;</i>
  </div>
</script>

<script type="text/html" id="toAuditOrder_edit_storeSSku">
  <input type="text" class="layui-input" name="" value="{{d.storeSSku||''}}">
</script>

<script type="text/html" id="toAuditOrder_edit_platUnitPrice">
  <input type="number" class="layui-input" name="" value="{{d.platUnitPrice||0}}" placeholder="订单币种">
</script>

<script type="text/html" id="toAuditOrder_edit_platQuantity">
  <input type="number" class="layui-input" name="" value="{{d.platQuantity||0}}">
</script>
<script type="text/html" id="toAuditOrder_edit_prodQuantity">
  <input type="text" class="layui-input" name="" value="{{d.prodQuantity}}">
</script>
<script type="text/html" id="add_product_prodQuantity">
  <input type="number" class="layui-input" name="prodQuantity" value="0">
</script>
<script type="text/html" id="add_product_platOrderDetailAmt">
  <input type="number" class="layui-input" name="platOrderDetailAmt" value="">
</script>
<script type="text/html" id="toAuditOrder_edit_platOrderDetailAmt">
  <input type="number" class="layui-input" value="{{d.platOrderDetailAmt===undefined ? '' : d.platOrderDetailAmt}}" placeholder="销售金额" min="0" step="1" onblur="commonFormatNonnegativeBlur(this)">
</script>

<script type="text/html" id="toAuditOrder_edit_option">
  <!-- <button class="layui-btn layui-btn-xs" lay-event="toAuditOrder_modify">修改订单</button> -->
  <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit_prod_delete">删除</button>
</script>

<!-- 表格渲染模板 -->

<!-- 操作弹框 -->
<!-- 添加备注 -->
<script type="text/html" id="pop_toAuditOrder_remark">
  <div class="layui-tab" id="toauditOrderremarkTab">
      <ul class="layui-tab-title">
          <li class="layui-this" data-index="1">备注</li>
          <li data-index="2">标签</li>
      </ul>
      <div class="layui-tab-content">
          <div class="layui-tab-item layui-show">
              <form class="layui-form mg_50">
                  <div class="layui-form-item">
                      <label class="layui-form-label">类型</label>
                      <div class="layui-input-block">
                          <select name="notetype" lay-verify="required">
                              <option value="addordernote">订单备注</option>
                              <option value="addpicknote">拣货备注</option>
                          </select>
                      </div>
                  </div>
                  <div class="layui-form-item">
                      <label class="layui-form-label">内容</label>
                      <div class="layui-input-block">
                          <textarea class="layui-textarea" name="noteContent" id="" cols="30" rows="10" lay-verify="required"></textarea>
                      </div>
                  </div>
                  <button type="button" id="toAuditOrder_remark_submit" class="hiden" lay-submit lay-filter="toAuditOrder_remark_submit"></button>
              </form>
          </div>
          <div class="layui-tab-item">
              <form class="layui-form mg_50">
                  <div class="layui-form-item">
                      <label class="layui-form-label">订单标签</label>
                      <div class="layui-input-block">
                          <select name="noteContent" lay-search>
                          </select>
                      </div>
                  </div>
                  <button type="button" id="toAuditorder_label_submit" class="hidden" lay-submit lay-filter="toAuditorder_label_submit"></button>
              </form>
          </div>
      </div>
  </div>
</script>

<!-- 商品详情 -->
<script type="text/html" id="pop_toAuditOrder_detail">
  <div class="mg_50">
      <table class="layui-table" id="toAuditOrder_detail_table" lay-filter="toAuditOrder_detail_table"></table>
  </div>
</script>
<!-- 原始订单拆单 -->
<script type="text/html" id="pop_toAuditOrder_demolition_original">
  <div class="mg_50">
      <div>
        <strong><font color="red" size="4">多个一买和组合品,所拆出的部分商品会影响线上发货,请谨慎拆分!</font></strong>
      </div>
     <div class="layui-form fixRight">
         <input type="radio" name="toAuditOrder_demo_original_abnormal" title="拆出订单转至取消订单" lay-skin="primary" id="toAuditOrder_demo_original_abnormal">
          <input type="radio" name="toAuditOrder_demo_original_abnormal" title="拆出订单转至其它异常订单" lay-skin="primary" id="toAuditOrder_demolition_original_abnormal">
      </div>
      <table class="layui-table" id="toAuditOrder_demolition_original_table" lay-filter="toAuditOrder_demolition_original_table"></table>
  </div>
</script>

<!-- 修改/新增订单 -->
<script type="text/html" id="pop_toAuditOrder_newandeditorder">
  <div class="mg_50">
      <div class="layui-tab" lay-filter="orderLog">
          <ul class="layui-tab-title">
              <li class="layui-this">详情</li>
              <li class="logHide">日志</li>
          </ul>
          <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                  <form class="layui-form" id="toAuditOrder_editForm" lay-filter="toAuditOrder_editForm">
                      <div class="layui-form-item">
                          <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">订单编号</label>
                              <div class="layui-input-block">
                                  <input type="text" name="id" class="layui-input" readonly>
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label"><font class="fRed">*</font>店铺单号</label>
                              <div class="layui-input-block">
                                  <input type="text" name="platOrderId" class="layui-input" lay-verify="required">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label"><font class="fRed">*</font>平台</label>
                              <div class="layui-input-block">
                                  <select name="platCode" lay-filter="edit_platCode" lay-verify="required" lay-search>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label"><font class="fRed">*</font>店铺</label>
                              <div class="layui-input-block">
                                  <select name="storeAcctId" id="edit_storeAcct" lay-filter="edit_storeAcct" lay-verify="required" lay-search>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">站点</label>
                              <div class="layui-input-block">
                                  <select name="siteId" lay-search>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label"><font class="fRed">*</font>订单北京时间</label>
                              <div class="layui-input-block">
                                  <input type="text" name="orderTimeCn" id="edit_time" class="layui-input" readonly lay-verify="required">
                              </div>
                          </div>
                          <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">交易ID</label>
                              <div class="layui-input-block">
                                  <input type="text" name="platTransactionId" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label"><font class="fRed">*</font>币种</label>
                              <div class="layui-input-block">
                                  <select name="currency" lay-verify="required" lay-search>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label"><font class="fRed">*</font>订单金额</label>
                              <div class="layui-input-block">
                                  <input name="platOrderAmt" type="text" lay-verify="required" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">出货仓库</label>
                              <div class="layui-input-block">
                                  <select name="warehouseId" lay-search>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">物流方式</label>
                              <div class="layui-input-block">
                                  <select name="logisTypeId" lay-filter="edit_logisTypeId" lay-search>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">物流跟踪号</label>
                              <div class="layui-input-block">
                                  <input type="text" name="logisTrackingNo" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">买家指定物流</label>
                              <div class="layui-input-block">
                                  <input type="text" name="buyerRequireShippingType" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">卖家邮箱</label>
                              <div class="layui-input-block">
                                  <input type="text" name="sellerEmail" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                            <label class="layui-form-label">平台费用</label>
                            <div class="layui-input-block">
                                <input type="text" name="platFee" class="layui-input">
                            </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">买家邮箱</label>
                              <div class="layui-input-block">
                                  <input type="text" name="buyerEmail" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">买家ID</label>
                              <div class="layui-input-block">
                                  <input type="text" name="buyerUserId" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">收件人</label>
                              <div class="layui-input-block">
                                  <input type="text" name="shippingUsername" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">收件人电话</label>
                              <div class="layui-input-block">
                                  <input type="text" name="shippingPhoneNumber" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">收件人邮编</label>
                              <div class="layui-input-block">
                                  <input type="text" name="shippingZip" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg4 layui-col-md4 ">
                              <label class="layui-form-label">地址1</label>
                              <div class="layui-input-block">
                                  <input type="text" name="shippingStreet1" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg4 layui-col-md4 ">
                              <label class="layui-form-label">地址2</label>
                              <div class="layui-input-block">
                                  <input type="text" name="shippingStreet2" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">城市</label>
                              <div class="layui-input-block">
                                  <input type="text" name="shippingCity" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">州/省</label>
                              <div class="layui-input-block">
                                  <input type="text" name="shippingState" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label"><font class="fRed">*</font>国家/地区</label>
                              <div class="layui-input-block">
                                  <select name="shippingCountryCode" lay-verify="required" lay-search></select>
                              </div>
                          </div>
                          <div class="layui-col-lg4 layui-col-md4">
                              <label class="layui-form-label">备注类型</label>
                              <div class="layui-input-block">
                                  <div class="layui-col-md6 layui-col-lg6">
                                      <select name="noteType" lay-search></select>
                                  </div>
                                  <div class="layui-col-md6 layui-col-lg6">
                                      <input type="text" name="noteContent" class="layui-input">
                                  </div>
                              </div>
                          </div>
                          <button type="button" id="edit_submit" lay-filter="edit_submit" class="hide" lay-submit></button>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-lg4 layui-col-md4 dis_flex">
                              <input type="text" class="layui-input">
                              <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="toAuditOrder_addProducts">添加商品</button>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-lg12 layui-col-md12 ">
                              <table class="layui-table" id="toAuditOrder_product_table" lay-filter="toAuditOrder_product_table"></table>
                          </div>
                      </div>

                      <div class="layui-form-item">
                        <div style="display: flex;font-size: 16px">
                            <div style="color: red;">原订单利润：<span id="originProfit"></span></div>
                            <div style="margin-left: 20px" class="disN" id="updateProfitBox">
                                <span style="color: red;">修改后订单利润：<span id="updateProfit"></span></span>
                                <span><i class="layui-icon refresh_profit" style="cursor: pointer">&#xe669;</i></span>
                                <span style="font-size:14px;color: red;margin-left: 50px">修改后利润在计算时，其物流成本会根据修改后的信息重新匹配物流后计算</span>
                            </div>
                        </div>
                      </div>
                      <permTag:perm funcCode="toAuditOrder:save">
                          <button type="button" class="hide" id="order_savebtn">保存</button>
                      </permTag:perm>
                  </form>
              </div>
              <div class="layui-tab-item">
                  <div>
                      <table class="layui-table" id="orderOprateLog" lat-filter="orderOprateLog"></table>
                  </div>
              </div>
          </div>
      </div>
  </div>
</script>

<!-- 添加商品弹框 -->
<script type="text/html" id="pop_toAuditOrder_addProducts">
  <div class="mg_50">
      <span class="numCount">数量<span></span></span>
      <table class="layui-table" id="toAuditOrder_addProducts_table" lay-filter="toAuditOrder_addProducts_table"></table>
  </div>
</script>
<script type="text/html" id="toAuditOrder_cancelEbayTpl">
  <form class="layui-form" action="" lay-filter="component-form-group" id="toAuditOrder_cancelEbayForm">
      <div class="p20">
          <div class="layui-form-item">
              <label class="layui-form-label">取消原因</label>
              <div class="layui-input-block">
                  <input type="radio" checked name="cancelReason" value="BUYER_ASKED_CANCEL" title="买家要求取消">
                  <input type="radio" name="cancelReason" value="OUT_OF_STOCK_OR_CANNOT_FULFILL" title="缺货或不能发货">
                  <input type="radio" name="cancelReason" value="ADDRESS_ISSUES" title="买家地址问题">
              </div>
          </div>
      </div>
  </form>
</script>
<script type="text/html" id="toAuditOrder_cancelWishpostTpl">
  <form class="layui-form" action="" lay-filter="component-form-group" id="toAuditOrder_cancelWishpostForm">
      <div class="p20">
          <div class="layui-form-item">
              <label class="layui-form-label">取消原因</label>
              <div class="layui-input-block">
                  <select class="layui-select" lay-search name="cancelReasonCode">
                      <option></option>
                      <option value="40101">需更换渠道</option>
                      <option value="40102">需更换揽收方式</option>
                      <option value="40103">需更换物流商</option>
                      <option value="40104">需更换仓库</option>
                      <option value="40105">需更换地址</option>
                      <option value="40106">需更换重量</option>
                      <option value="40107">需更换申报价格</option>
                      <option value="40201">单号已被使用</option>
                      <option value="40202">无法获取单号</option>
                      <option value="40203">ERP无法获取单号</option>
                      <option value="40204">无法打印面单</option>
                      <option value="40205">无效面单</option>
                      <option value="40206">订单过期</option>
                      <option value="40301">物流商未取货</option>
                      <option value="40302">不在揽收范围</option>
                      <option value="40303">物流商需更换单号</option>
                      <option value="40304">物流商无法收款</option>
                      <option value="40305">物流商未收到包裹</option>
                      <option value="40401">买家要求退货</option>
                      <option value="40402">寄错货物</option>
                      <option value="40403">需合并发货</option>
                      <option value="40404">需拆分发货</option>
                      <option value="40405">重复下单</option>
                      <option value="49999">其他原因</option>
                  </select>
              </div>
          </div>
          <div class="layui-inline">
              <label class="layui-form-label">其他原因</label>
              <div class="layui-input-inline">
                  <input type="text" name="invalidReason"  class="layui-input">
              </div>
          </div>
      </div>
  </form>
</script>
<script type="text/html" id="toAuditOrder_appointWarehouseTypeTpl">
  <form class="layui-form" action="" lay-filter="component-form-group" id="toAuditOrder_appointWarehouseTypeForm">
      <div class="p20">
          <div class="layui-form-item">
              <label class="layui-form-label">仓库类型</label>
              <div class="layui-input-block">
                  <!-- <input type="radio" name="warehouseType" value="DIRECT" title="直邮仓"> -->
                  <input type="radio" name="warehouseType" value="WINIT" title="海外仓">
              </div>
          </div>
      </div>
  </form>
</script>
<!-- 修改订单标签 -->
<script type="text/html" id="toAuditOrder_updateProdPInfoListPop">
  <form class="layui-form mg_50" id="toAuditOrder_updateProdPInfoForm">
      <div class="layui-form-item">
          <label class="layui-form-label">备注类型</label>
          <div class="layui-input-block">
              <select name="notetype" lay-verify="required" id="toAuditOrder_noteContent_content"></select>
          </div>
      </div>
      <div class="layui-form-item">
          <label class="layui-form-label">备注内容</label>
          <div class="layui-input-block">
              <textarea class="layui-textarea" name="noteContent" id="" cols="30" rows="10" lay-verify="required"></textarea>
          </div>
      </div>
  </form>
  <table class="layui-table" id="toAuditOrder_addProducts_table" lay-filter="toAuditOrder_addProducts_table"></table>
</script>

<%-- 弹框-批量修改仓库和物流 --%>
<script type="text/html" id="toAuditOrder_batchEditWareHouseLayer">
  <div class="layui-form" style="padding:20px 20px 0 0;">
      <div class="layui-form-item">
          <label class="layui-form-label">仓库</label>
          <div class="layui-input-block">
              <select name="warehouse" id="batchEditWareHouse_warehouse"></select>
          </div>
      </div>
      <div class="layui-form-item">
          <label class="layui-form-label">物流</label>
          <div class="layui-input-block" style="display:flex;">
              <select name="warehouse" id="batchEditWareHouse_logisCompany" lay-filter="batchEditWareHouse_logisCompanyFilter"></select>
              <div style="margin-left:10%;">
                  <select name="warehouse" id="batchEditWareHouse_logisWay"></select>
              </div>
          </div>
      </div>
  </div>
</script>



<%-- 权限问题---修改订单 --%>
<script type="text/html" id="toAuditOrder_updatePermTagTable">
  <permTag:perm funcCode="toAuditOrder_updatePermTag">
  <button name="toAuditOrder_modify" class="layui-btn layui-btn-xs layui-btn-normal">修改订单</button>
  </permTag:perm>
</script>
<%-- 权限问题---拆分订单 --%>
<script type="text/html" id="toAuditOrder_splitPermTagTable">
  <permTag:perm funcCode="toAuditOrder_splitPermTag">
  <button name="toAuditOrder_demolition" class="layui-btn layui-btn-xs layui-btn-normal">拆分订单</button>
  </permTag:perm>
</script>

<%-- 权限问题---ebay退款 --%>
<script type="text/html" id="toAuditOrder_ebayRefundPermTagTable">
  <permTag:perm funcCode="toAuditOrder_issueRefund">
  <button name="toAuditOrder_issueRefund" class="layui-btn layui-btn-xs layui-btn-normal">ebay退款</button>
  </permTag:perm>
</script>
<!-- #endregion 待审核页面结束 -->


<!-- #region 异常订单页面开始 -->
<!-- 表格渲染模板 -->

            <script type="text/html" id="abnormal_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="abnormalorder_id_tpl">
            <div class="alignLeft">
                <input type="hidden" class="abnormalorder_col_id" value="{{d.id}}">
                <div>
                <span class="pora copySpan">
                    <a>{{d.id||""}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>
                    <span class="gray">[{{d.storeAcct||""}}[{{d.allrootAliasName||""}}]]</span>
                    {{# if(d.operOrderType=="1"){ }}
                    <span class="hp-badge layui-bg-orange fr" title="拆出订单">拆</span>
                    {{# }else if(d.operOrderType=="2"){ }}
                    <span class="hp-badge layui-bg-orange fr" title="合并订单">合</span>
                    {{# }}}
                </div>
                <div>
                    <span class="pora copySpan">
                    <a>{{d.platOrderId}}{{# if(d.platStoreOrderId){ }}({{d.platStoreOrderId}}){{# }}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>
                </div>
                <div><span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span></div>
                <div><span class="gray">销售:</span><span>{{d.salesPersons||''}}</span></div>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_platOrderAmt_tpl">
                <div class="alignLeft">
                <div><span class='gray'>{{d.currency||""}}</span><span>{{d.platOrderAmt||""}}</span></div>
                <div><span class="gray">利润(RMB)</span><span>{{d.profit||'0.00'}}</span></div>
                <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_prodQuantity_tpl">
            <div class="alignLeft">
                <div><span class="gray">种类：</span><span>{{d.kindNum||""}}</span></div>
                <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
                <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
                <div><span class="gray">计费重：</span><span>{{d.priceWeight}}g</span></div>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_shippingUsername_tpl">
            <div class="alignLeft">
                <div>{{d.shippingUsername||""}}</div>
                <div>[{{d.shippingCountryCnName||""}}]</div>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_logisTypeName_tpl">
            <div class="alignLeft">
                <div><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}<span></div>
                <div><span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span><span>[{{d.logisTrackingNo||""}}]</span></div>
                </div>
            </script>

            <script type="text/html" id="abnormalOrder_time_tpl">
            <div class="alignLeft">
                <div><span class="gray">订单:</span><span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})<span></div>
                <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                </div>
            </script>


            <script type="text/html" id="abnormalorder_option_tpl">
                <span class="layui-btn layui-btn-xs disN" lay-event="edit">修改订单</span>
                <span class="layui-btn layui-btn-xs abnormalOrder_split disN" lay-event="split">拆分订单</span>
                <span class="layui-btn layui-btn-xs" lay-event="remark">备注</span>
            </script>

            <!-- 商品详情 -->
            <script type="text/html" id="pop_abnormalorder_detail">
                <div class="mg_50">
                    <table class="layui-table" id="abnormalorder_detail_table" lay-filter="abnormalorder_detail_table"></table>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_appointWarehouseTypeTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="abnormalorder_appointWarehouseTypeForm">
                    <div class="p20">
                        <div class="layui-form-item">
                            <label class="layui-form-label">仓库类型</label>
                            <div class="layui-input-block">
                                <input type="radio" name="warehouseType" value="DIRECT" title="直邮仓">
                                <input type="radio" name="warehouseType" value="WINIT" title="万邑通仓">
                            </div>
                        </div>
                    </div>
                </form>
            </script>

            <!-- 修改/新增订单 -->
            <script type="text/html" id="pop_abnormalOrder_newandeditorder">
                <div class="mg_50">
                    <div class="layui-tab" lay-filter="orderLog">
                        <ul class="layui-tab-title">
                          <li class="layui-this">详情</li>
                          <li>日志</li>
                        </ul>
                        <div class="layui-tab-content">
                          <div class="layui-tab-item layui-show">
                            <form class="layui-form" id="abnormalOrder_editForm" lay-filter="abnormalOrder_editForm">
                                <div class="layui-form-item">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">订单编号</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="id" class="layui-input" readonly>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">店铺单号</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="platOrderId" class="layui-input" lay-verify="required">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select name="storeAcctId" lay-verify="required" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">站点</label>
                                        <div class="layui-input-block">
                                            <select name="siteId" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">订单北京时间</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="orderTimeCn" id="edit_time" class="layui-input" readonly lay-verify="required">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">交易ID</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="platTransactionId" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">币种</label>
                                        <div class="layui-input-block">
                                            <select name="currency" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">订单金额</label>
                                        <div class="layui-input-block">
                                            <input name="platOrderAmt" type="text" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">出货仓库</label>
                                        <div class="layui-input-block">
                                            <select name="warehouseId" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">物流方式</label>
                                        <div class="layui-input-block">
                                            <select name="logisTypeId" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">物流跟踪号</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="logisTrackingNo" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">买家指定物流</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="buyerRequireShippingType" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">卖家邮箱</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="sellerEmail" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">买家邮箱</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="buyerEmail" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">买家ID</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="buyerUserId" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">收件人</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingUsername" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">收件人电话</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingPhoneNumber" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">收件人邮编</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingZip" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg4 layui-col-md4 ">
                                        <label class="layui-form-label">地址1</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingStreet1" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">地址2</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingStreet2" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">城市</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingCity" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">州/省</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingState" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">国家/地区</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingCountryCode" class="layui-input">
                                        </div>
                                    </div>
                                    <button type="button" id="edit_submit" lay-filter="edit_submit" class="hide" lay-submit></button>
                                </div>
                                <!-- <div class="layui-form-item">
                                    <div class="layui-col-lg4 layui-col-md4 dis_flex">
                                        <input type="text" class="layui-input">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">添加商品</button>
                                    </div>
                                </div> -->
                                <div class="layui-form-item">
                                    <div class="layui-col-lg12 layui-col-md12 ">
                                        <table class="layui-table" id="abnormalOrder_product_table" lay-filter="abnormalOrder_product_table"></table>
                                    </div>
                                </div>
                            </form>
                          </div>
                          <div class="layui-tab-item">
                              <div>
                                  <table class="layui-table" id="orderOprateLog" lat-filter="orderOprateLog"></table>
                              </div>
                          </div>
                        </div>
                      </div>
                </div>
            </script>
            <script type="text/html" id="abnormalOrder_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>


<%-- 弹框--拆分订单 --%>
<script type="text/html" id="abnormalOrderSplitOrderLayer">
    <div id="abnormalOrderSplitOrderContainer" style="padding: 20px 40px;">
    </div>
</script>
<script type="text/html" id="abnormalOrderSplitOrderContainerTpl">
    <div>
      <strong><font color="red" size="4">多个一买和组合品,所拆出的部分商品会影响线上发货,请谨慎拆分!</font></strong>
    </div>
    <table class="layui-table">
        <thead>
            <tr>
                <th>商品信息</th>
                <th>可用库存</th>
                <th>商品数量</th>
                <th>拆分数量</th>
            </tr>
        </thead>
        <tbody>
            {{# if(d.orderDetails.length>0){ }}
            {{#  layui.each(d.orderDetails, function(index, item){ }}
            <tr>
                <td>
                    <div class="dis_flex">
                        <img width="60" height="60" data-original="{{item.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                        <div>
                            <div>{{item.prodSSku||""}}</div>
                            <div>{{item.prodTitle||""}}</div>
                        </div>
                    </div>
                </td>
                <td>{{item.availableStock}}</td>
                <td>{{item.prodQuantity}}</td>
                <td>
                    <input type="number" class="layui-input" name="demolitionQuality" onchange="commonSetInputMaxMinVal(this,{{item.prodQuantity}},1)" data-id="{{item.id}}">
                </td>
            </tr>
            {{# }); }}
            {{# } }}
        </tbody>
    </table>
</script>

<%-- 弹框-批量修改仓库和物流 --%>
<script type="text/html" id="abnormalOrder_batchEditWareHouseLayer">
    <div class="layui-form" style="padding:20px 20px 0 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">仓库</label>
            <div class="layui-input-block">
                <select name="warehouse" id="batchEditWareHouse_warehouse_abnormalOrder"></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">物流</label>
            <div class="layui-input-block" style="display:flex;">
                <select name="warehouse" id="batchEditWareHouse_logisCompany_abnormalOrder" lay-filter="batchEditWareHouse_logisCompanyFilter_abnormalOrder"></select>
                <div style="margin-left:10%;">
                    <select name="warehouse" id="batchEditWareHouse_logisWay_abnormalOrder"></select>
                </div>
            </div>
        </div>
    </div>
</script>
<%-- 取消wishpost跟踪号 --%>
<script type="text/html" id="abnormalOrder_cancelWishpostTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="abnormalOrder_cancelWishpostForm">
        <div class="p20">
            <div class="layui-form-item">
                <label class="layui-form-label">取消原因</label>
                <div class="layui-input-block">
                    <select class="layui-select" lay-search name="cancelReasonCode">
                        <option></option>
                        <option value="40101">需更换渠道</option>
                        <option value="40102">需更换揽收方式</option>
                        <option value="40103">需更换物流商</option>
                        <option value="40104">需更换仓库</option>
                        <option value="40105">需更换地址</option>
                        <option value="40106">需更换重量</option>
                        <option value="40107">需更换申报价格</option>
                        <option value="40201">单号已被使用</option>
                        <option value="40202">无法获取单号</option>
                        <option value="40203">ERP无法获取单号</option>
                        <option value="40204">无法打印面单</option>
                        <option value="40205">无效面单</option>
                        <option value="40206">订单过期</option>
                        <option value="40301">物流商未取货</option>
                        <option value="40302">不在揽收范围</option>
                        <option value="40303">物流商需更换单号</option>
                        <option value="40304">物流商无法收款</option>
                        <option value="40305">物流商未收到包裹</option>
                        <option value="40401">买家要求退货</option>
                        <option value="40402">寄错货物</option>
                        <option value="40403">需合并发货</option>
                        <option value="40404">需拆分发货</option>
                        <option value="40405">重复下单</option>
                        <option value="49999">其他原因</option>
                    </select>
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">其他原因</label>
                <div class="layui-input-inline">
                    <input type="text" name="invalidReason"  class="layui-input">
                </div>
            </div>
        </div>
    </form>
</script>
<%-- 手动指定物流 --%>
<script type="text/html" id="abnormalOrder_updateLogisTypeTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="abnormalOrder_updateLogisTypeForm">
        <div class="p20">
            <div class="layui-form-item">
                <label class="layui-form-label">物流公司</label>
                <div class="layui-input-block">
                    <select class="layui-select" lay-search name="logisCompany" lay-filter="abnormalOrder_logisCompany">
                        <option></option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">物流方式</label>
                <div class="layui-input-block">
                    <select class="layui-select" lay-search name="logisType">
                        <option></option>
                    </select>
                </div>
            </div>
        </div>
    </form>
</script>

<%-- 权限问题---拆分订单 --%>
<script type="text/html" id="abnormalOrder_splitPermTagTable">
    <permTag:perm funcCode="abnormalOrder_splitPermTag">
    <button type="button" name="split" class="layui-btn layui-btn-xs layui-btn-normal disN abnormalOrder__splitBtn">拆分订单</button>
    </permTag:perm>
</script>
<!-- #endregion -->

<!-- #region 待派单/缺货订单页面开始 -->
<!-- 表格渲染模板 -->
            <script type="text/html" id="toDespatchOrder_id_tpl">
                <div class="alignLeft">
                <input type="hidden" class="toDespatchOrder_col_id" value="{{d.id}}">
                <div>
                <span class="pora copySpan">
                    <a class="toDespatchOrder_Id">{{d.id||""}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>
                    <span class="gray">[{{d.storeAcct||""}}[{{d.allrootAliasName||""}}]]</span>
                    {{# if(d.operOrderType=="1"){ }}
                    <span class="hp-badge layui-bg-orange fr" title="拆出订单">拆</span> {{# }else if(d.operOrderType=="2"){ }}
                    <span class="hp-badge layui-bg-orange fr" title="合并订单">合</span> {{# }}}
                </div>
                <div>
                    <span class="pora copySpan">
                    <a>{{d.platOrderId}}{{# if(d.platStoreOrderId){ }}({{d.platStoreOrderId}}){{# }}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>
                </div>
                <div><span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span></div>
                <div><span class="gray">销售:</span><span>{{d.salesPersons||''}}</span></div>
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_platOrderAmt_tpl">
                <div class="alignLeft">
                <div><span class='gray'>{{d.currency||""}}</span><span>{{d.platOrderAmt||""}}</span></div>
                <div><span class="gray">利润(RMB)</span><span>{{d.profit||'0.00'}}</span></div>
                <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
                {{# if(d.logisApplyStatus==4&&d.logisApplyFailMsg){ }}
                <div class="waitOrderErrorTips dis_flex"><div class="waitOrderErrorTipsword">{{d.logisApplyFailMsg}}</div><div class="waitOrderErrorTipsClose">x</div></div>
                {{# } }}
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_prodQuantity_tpl">
                <div class="alignLeft">
                    <div><span class="gray">种类：</span><span>{{d.kindNum||""}}</span></div>
                    <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
                    <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_shippingUsername_tpl">
                <div class="alignLeft">
                    <div>{{d.shippingUsername||""}}</div>
                    <div>[{{d.shippingCountryCnName||""}}]</div>
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_logisTypeName_tpl">
                <div class="alignLeft">
                    <div><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}<span></div>
                    <div><span class="gray">发货:</span><span id="logisTypeName_toDespatchOrder">[{{d.logisTypeName||""}}]</span><span id="logisTrackingNo_toDespatchOrder">[{{d.logisTrackingNo||""}}]</span></div>
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_time_tpl">
                <div class="alignLeft">
                    <div><span class="gray">订单:</span><span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})<span></div>
                    <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                    <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                </div>
            </script>

            <script type="text/html" id="todispatchr_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>


            <script type="text/html" id="toDespatchOrder_option_tpl">
                <div class="dis_flex_start">
                    <span class="layui-btn layui-btn-xs disN" lay-event="edit">修改订单</span><br>
                    <span class="layui-btn layui-btn-xs" lay-event="remark">备注</span>
                </div>
            </script>
            <script type="text/html" id="toDespatchOrder_cancelWishpostTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="toDespatchOrder_cancelWishpostForm">
                    <div class="p20">
                        <div class="layui-form-item">
                            <label class="layui-form-label">取消原因</label>
                            <div class="layui-input-block">
                                <select class="layui-select" lay-search name="cancelReasonCode">
                                    <option></option>
                                    <option value="40101">需更换渠道</option>
                                    <option value="40102">需更换揽收方式</option>
                                    <option value="40103">需更换物流商</option>
                                    <option value="40104">需更换仓库</option>
                                    <option value="40105">需更换地址</option>
                                    <option value="40106">需更换重量</option>
                                    <option value="40107">需更换申报价格</option>
                                    <option value="40201">单号已被使用</option>
                                    <option value="40202">无法获取单号</option>
                                    <option value="40203">ERP无法获取单号</option>
                                    <option value="40204">无法打印面单</option>
                                    <option value="40205">无效面单</option>
                                    <option value="40206">订单过期</option>
                                    <option value="40301">物流商未取货</option>
                                    <option value="40302">不在揽收范围</option>
                                    <option value="40303">物流商需更换单号</option>
                                    <option value="40304">物流商无法收款</option>
                                    <option value="40305">物流商未收到包裹</option>
                                    <option value="40401">买家要求退货</option>
                                    <option value="40402">寄错货物</option>
                                    <option value="40403">需合并发货</option>
                                    <option value="40404">需拆分发货</option>
                                    <option value="40405">重复下单</option>
                                    <option value="49999">其他原因</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">其他原因</label>
                            <div class="layui-input-inline">
                                <input type="text" name="invalidReason"  class="layui-input">
                            </div>
                        </div>
                    </div>
                </form>
            </script>
            <script type="text/html" id="toDespatchOrder_updateLogisTypeTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="toDespatchOrder_updateLogisTypeForm">
                    <div class="p20">
                        <div class="layui-form-item">
                            <label class="layui-form-label">物流公司</label>
                            <div class="layui-input-block">
                                <select class="layui-select" lay-search name="logisCompany" lay-filter="toDespatchOrder_logisCompany">
                                    <option></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">物流方式</label>
                            <div class="layui-input-block">
                                <select class="layui-select" lay-search name="logisType">
                                    <option></option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </script>

            <!-- 商品详情 -->
            <script type="text/html" id="pop_todispathorder_detail">
                <div class="mg_50">
                    <table class="layui-table" id="todispathorder_detail_table" lay-filter="todispathorder_detail_table"></table>
                </div>
            </script>

            <!-- 修改/新增订单 -->
            <script type="text/html" id="pop_toDespatchOrder_newandeditorder">
                <div class="mg_50">
                    <div class="layui-tab" lay-filter="orderLog">
                        <ul class="layui-tab-title">
                          <li class="layui-this">详情</li>
                          <li>日志</li>
                        </ul>
                        <div class="layui-tab-content">
                          <div class="layui-tab-item layui-show">
                            <form class="layui-form" id="toDespatchOrder_editForm" lay-filter="toDespatchOrder_editForm">
                                <div class="layui-form-item">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">订单编号</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="id" class="layui-input" readonly>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label"><font class="fRed">*</font>店铺单号</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="platOrderId" class="layui-input" lay-verify="required">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label"><font class="fRed">*</font>平台</label>
                                        <div class="layui-input-block">
                                            <select name="platCode" lay-filter="edit_platCode" lay-verify="required" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label"><font class="fRed">*</font>店铺</label>
                                        <div class="layui-input-block">
                                            <select name="storeAcctId" id="edit_storeAcct" lay-filter="edit_storeAcct" lay-verify="required" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">站点</label>
                                        <div class="layui-input-block">
                                            <select name="siteId" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label"><font class="fRed">*</font>订单北京时间</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="orderTimeCn" id="edit_time" class="layui-input" readonly lay-verify="required">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">交易ID</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="platTransactionId" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label"><font class="fRed">*</font>币种</label>
                                        <div class="layui-input-block">
                                            <select name="currency" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label"><font class="fRed">*</font>订单金额</label>
                                        <div class="layui-input-block">
                                            <input name="platOrderAmt" type="text" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">出货仓库</label>
                                        <div class="layui-input-block">
                                            <select name="warehouseId" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">物流方式</label>
                                        <div class="layui-input-block">
                                            <select name="logisTypeId" lay-filter="edit_logisTypeId" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">物流跟踪号</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="logisTrackingNo" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">买家指定物流</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="buyerRequireShippingType" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">卖家邮箱</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="sellerEmail" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">买家邮箱</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="buyerEmail" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">买家ID</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="buyerUserId" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">收件人</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingUsername" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">收件人电话</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingPhoneNumber" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">收件人邮编</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingZip" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg4 layui-col-md4 ">
                                        <label class="layui-form-label">地址1</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingStreet1" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg4 layui-col-md4 ">
                                        <label class="layui-form-label">地址2</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingStreet2" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">城市</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingCity" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">州/省</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingState" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label"><font class="fRed">*</font>国家/地区</label>
                                        <div class="layui-input-block">
                                            <select name="shippingCountryCode" lay-verify="required" lay-search></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg4 layui-col-md4">
                                        <label class="layui-form-label">备注类型</label>
                                        <div class="layui-input-block">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <select name="noteType" lay-search></select>
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="text" name="noteContent" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" id="edit_submit" lay-filter="edit_submit" class="hide" lay-submit></button>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-col-lg4 layui-col-md4 dis_flex">
                                        <input type="text" class="layui-input">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="toDespatchOrder_addProducts">添加商品</button>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-col-lg12 layui-col-md12 ">
                                        <table class="layui-table" id="toDespatchOrder_product_table" lay-filter="toDespatchOrder_product_table"></table>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div style="display: flex;font-size: 16px">
                                        <div style="color: red;">原订单利润：<span id="originProfitLack"></span></div>
                                        <div style="margin-left: 20px" class="disN" id="updateProfitLackBox">
                                            <span style="color: red;">修改后订单利润：<span id="updateProfitLack"></span></span>
                                            <span><i class="layui-icon refresh_profit" style="cursor: pointer">&#xe669;</i></span>
                                            <span style="font-size:14px;color: red;margin-left: 50px">修改后利润在计算时，其物流成本会根据修改后的信息重新匹配物流后计算</span>
                                        </div>
                                    </div>
                                  </div>
                                <button type="button" class="hide" id="order_savebtn">保存</button>
                            </form>
                          </div> ·  
                          <div class="layui-tab-item">
                              <div>
                                  <table class="layui-table" id="orderOprateLog" lat-filter="orderOprateLog"></table>
                              </div>
                          </div>
                        </div>
                      </div>
                </div>
            </script>
            <script type="text/html" id="toDespatchOrder_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_edit_ListingID">
                <input type="text" class="layui-input" name="" value="{{d.itemId||''}}">
            </script>
            
            <script type="text/html" id="toDespatchOrder_edit_Prodsku">
                <div>
                  <div>
                    {{# if(!d.isSale){ }}
                    <span class="layui-badge">停</span>
                    {{# } }}
                  </div>
                  <div>
                    {{# if(d.logisAttrList){ }}
                      {{# layui.each(d.logisAttrList.split(','), function(attrIndex, attrItem){ }}
                        {{# if(attrItem != '普货'){ }}
                        <span class="layui-badge">{{attrItem}}</span>
                        {{# } }}
                      {{# }) }}
                    {{# } }}
                  </div>
                </div>
                <div class="dis_flex">
                    <input type="text" class="layui-input" name="" value="{{d.prodSSku}}">
                    <i class="layui-icon refresh_icon">&#xe669;</i>
                </div>
                <div>
                  {{# if(d.replaceSkuList && d.replaceSkuList.length>0){ }}
                  <span class="layui-badge layui-bg-blue" style="cursor:pointer;" onclick="toDespatchOrder_lackSkuHandle(this)">换</span>
                  <input type="hidden" name="lackSku" value='{{JSON.stringify(d.replaceSkuList)}}'>
                  {{# }  }}
                </div>
            </script>
            
            <script type="text/html" id="toDespatchOrder_edit_storeSSku">
                <input type="text" class="layui-input" name="" value="{{d.storeSSku||''}}">
            </script>
            
            <script type="text/html" id="toDespatchOrder_edit_platUnitPrice">
                <input type="number" class="layui-input" name="" value="{{d.platUnitPrice||0}}" placeholder="订单币种">
            </script>
            
            <script type="text/html" id="toDespatchOrder_edit_platQuantity">
                <input type="number" class="layui-input" name="" value="{{d.platQuantity||0}}">
            </script>
            <script type="text/html" id="toDespatchOrder_edit_prodQuantity">
                <input type="text" class="layui-input" name="" value="{{d.prodQuantity||0}}">
            </script>
            <script type="text/html" id="toDespatchOrder_edit_platOrderDetailAmt">
                <input type="number" class="layui-input" value="{{d.platOrderDetailAmt===undefined ? '' : d.platOrderDetailAmt}}" placeholder="销售金额"  min="0" step="1" onblur="commonFormatNonnegativeBlur(this)">
            </script>

            <%-- 弹框--ebay取消订单原因展示 --%>
            <script type="text/html" id="toDespatchOrder_cancelEbayTpl">
                <form class="layui-form">
                    <div class="p20">
                        <div class="layui-form-item">
                            <label class="layui-form-label">取消原因</label>
                            <div class="layui-input-block">
                                <input type="radio" checked name="cancelReason" value="BUYER_ASKED_CANCEL" title="买家要求取消">
                                <input type="radio" name="cancelReason" value="OUT_OF_STOCK_OR_CANNOT_FULFILL" title="缺货或不能发货">
                                <input type="radio" name="cancelReason" value="ADDRESS_ISSUES" title="买家地址问题">
                            </div>
                        </div>
                    </div>
                </form>
            </script>
            <%-- 弹框--tiktok取消订单原因展示 --%>
            <script type="text/html" id="toDespatchOrder_cancelTiktokTpl">
                <form class="layui-form">
                    <div class="p20">
                        <div class="layui-form-item">
                            <label class="layui-form-label">取消原因</label>
                            <div class="layui-input-block">
                            </div>
                        </div>
                    </div>
                </form>
            </script>
            <!-- 添加商品弹框 -->
            <script type="text/html" id="pop_toDespatchOrder_addProducts">
                <div class="mg_50">
                    <span class="numCount">数量<span></span></span>
                    <table class="layui-table" id="toDespatchOrder_addProducts_table" lay-filter="toDespatchOrder_addProducts_table"></table>
                </div>
            </script>
            <script type="text/html" id="toDespatchOrder_edit_option">
                <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit_prod_delete">删除</button>
            </script>
            <script type="text/html" id="toDespatchOrder_add_product_prodQuantity">
                <input type="number" class="layui-input" name="prodQuantity" value="0">
            </script>
            <script type="text/html" id="toDespatchOrder_add_product_platOrderDetailAmt">
                <input type="number" class="layui-input" name="platOrderDetailAmt" value="">
            </script>

<script type="text/html" id="toDespatchOrderReceiveLayer">
    <div style="padding:0 10px;">
        <table class="layui-table">
            <tbody id="toDespatchOrderReceiveLayerTbody">

            </tbody>
        </table>
        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="decryptAddress">解密地址</button>
    </div>
</script>
<script type="text/html" id="toDespatchOrderReceiveLayerTbodyTpl">
    <tr>
        <td>收件人</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingUsername || ''}}" name="shippingUsername">
        </td>
    </tr>
    <tr>
        <td>州/省</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingState || ''}}" name="shippingState">
        </td>
    </tr>
    <tr>
        <td>城市</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingCity || ''}}" name="shippingCity">
        </td>
    </tr>
    <tr>
        <td>邮编</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingZip || ''}}" name="shippingZip">
        </td>
    </tr>
    <tr>
        <td>地址1</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingStreet1 || ''}}" name="shippingStreet1">
        </td>
    </tr>
    <tr>
        <td>地址2</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingStreet2 || ''}}" name="shippingStreet2">
        </td>
    </tr>
    <tr>
        <td>电话</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingPhoneNumber || ''}}" name="shippingPhoneNumber">
        </td>
    </tr>
</script>


<%-- 批量修改收件信息 --%>
<script type="text/html" id="toDespatchOrder_batchEditReceiverLayer">
    <div id="toDespatchOrderBatchEditReceiverContainer" style="padding:10px;" lay-filter="toDespatchOrderBatchEditReceiverContainer" class="layui-form"></div>
</script>
<script type="text/html" id="toDespatchOrderBatchEditReceiverContainerTpl">
    <table class="layui-table">
        <thead>
            <tr>
                <th>
                    <div class="layui-form">
                        <input type="checkbox" name="allCheck"  lay-skin="primary" class="receiverAllCheck" lay-filter="receiverAllCheckFilter">
                    </div>
                </th>
                <th>订单号</th>
                <th>收件人<input class="layui-input Username" style="width:100px" placeholder="回车批量"></th>
                <th>州/省<input class="layui-input State" style="width:100px" placeholder="回车批量"></th>
                <th>城市<input class="layui-input City" style="width:100px" placeholder="回车批量"></th>
                <th>邮编<input class="layui-input Zip" style="width:100px" placeholder="回车批量"></th>
                <th>地址1<input class="layui-input Street1" style="width:100px" placeholder="回车批量"></th>
                <th>地址2<input class="layui-input Street2" style="width:100px" placeholder="回车批量"></th>
                <th>电话<input class="layui-input PhoneNumber" style="width:100px" placeholder="回车批量"></th>
            </tr>
        </thead>
        <tbody>
            {{#  layui.each(d, function(index, item){ }}
            <tr>
                <td>
                    <div class="layui-form">
                        <input type="checkbox" lay-skin="primary" class="receiverCheck" name="checkbox1">
                    </div>
                </td>
                <td class="id">{{item.id}}</td>
                <td class="shippingUsername">
                    <input type="text" class="layui-input" value="{{ item.shippingUsername || ''}}" name="shippingUsername">
                </td>
                <td class="shippingState">
                    <input type="text" class="layui-input" value="{{ item.shippingState || ''}}" name="shippingState">
                </td>
                <td class="shippingCity">
                  <input type="text" class="layui-input" value="{{ item.shippingCity || ''}}" name="shippingCity">
                </td>
                <td class="shippingZip">
                   <input type="text" class="layui-input" value="{{ item.shippingZip || ''}}" name="shippingZip">
                </td>
                <td class="shippingStreet1">
                    <input type="text" class="layui-input" value="{{ item.shippingStreet1 || ''}}" name="shippingStreet1">
                </td>
                <td class="shippingStreet2">
                    <input type="text" class="layui-input" value="{{ item.shippingStreet2 || ''}}" name="shippingStreet2">
                </td>
                <td class="shippingPhoneNumber">
                    <input type="text" class="layui-input" value="{{ item.shippingPhoneNumber || ''}}" name="shippingPhoneNumber">
                </td>
            </tr>
            {{# }) }}
        </tbody>
    </table>
</script>


<script type="text/html" id="pop_toDespatchOrder_demolition_original">
    <div class="mg_50">
        <div>
          <strong><font color="red" size="4">多个一买和组合品,所拆出的部分商品会影响线上发货,请谨慎拆分!</font></strong>
        </div>
        <div class="layui-form fixRight">
            <input type="radio" name="toDespatchOrder_demo_original_abnormal" title="拆出订单转至取消订单" lay-skin="primary" id="toDespatchOrder_demo_original_abnormal">
            <input type="radio" name="toDespatchOrder_demo_original_abnormal" title="拆出订单转至其它异常订单" lay-skin="primary" id="toDespatchOrder_demolition_original_abnormal">
        </div>
        <table class="layui-table" id="toDespatchOrder_demolition_original_table" lay-filter="toDespatchOrder_demolition_original_table"></table>
    </div>
</script>

<script type="text/html" id="toDespatchOrder_orginal_order_products">
    <div class="dis_flex">
        <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
        <div>
            <div>{{d.prodSSku||""}}
            </div>
            <div><span>Color</span>{{d.style||""}}</div>
        </div>
        <div><span>×</span><span>{{d.platQuantity||""}}</span></div>
        <div>
            {{# if(!d.isSale){ }}
                <span class="layui-badge plus-layui-badge ml5">停</span>
            {{# } }}
        </div>
    </div>
</script>

<%--<script type="text/html" id="toDespatchOrder_orginal_order_availableStock">--%>
<%--    <div>--%>
<%--        {{# if(d.allCount > d.availableStock){ }}--%>
<%--        <div style="font-weight:700;font-size:24px;color:#f00;">{{d.availableStock}}</div>--%>
<%--        {{# }else{ }}--%>
<%--        <span>{{d.availableStock}}</span>--%>
<%--        {{# } }}--%>
<%--    </div>--%>
<%--</script>--%>
<%--<script type="text/html" id="toDespatchOrder_orginal_order_allCount">--%>
<%--   {{# if(d.allCount > d.availableStock){ }}--%>
<%--   <span style="font-weight:700;font-size:24px;color:#f00;">{{d.allCount || d.prodQuantity}}</span>--%>
<%--   {{# }else{ }}--%>
<%--   <span>{{d.allCount || d.prodQuantity}}</span>--%>
<%--   {{# } }}--%>
<%--</script>--%>
<%--<script type="text/html" id="toDespatchOrder_orginal_order_prodQuantity">--%>
<%--    <div>--%>
<%--    {{# if(d.allCount > d.availableStock){ }}--%>
<%--    <div style="font-weight:700;font-size:24px;color:#f00;">{{d.prodQuantity || ''}}</div>--%>
<%--    {{# }else{ }}--%>
<%--    <span>{{d.prodQuantity || ''}}</span>--%>
<%--    {{# } }}--%>
<%--    </div>--%>
<%--</script>--%>

<script type="text/html" id="toDespatchOrder_orginal_order_demolition">{{ d.prodQuantity * d.prodUnitWeight }}</script>

<script type="text/html" id="toDespatchOrder_orginal_order_number">
    <input type="text" class="layui-input" name="demolitionQuality" onchange="commonSetInputMaxMinVal(this,{{d.prodQuantity}},1)">
</script>

<!-- 商品价格 -->
<script type="text/html" id="toDespatchOrder_edit_platOrderProdPrice">
  <div style="text-align:left;">
    <div title="平均库存成本|商品成本">
      成本(¥):{{d.prodUnitCost || ''}}|{{d.detailCostPrice || ''}}
    </div>
    <div>净重(g):{{d.prodUnitWeight || ''}}</div>
  </div>
</script>
<!-- 商品信息 -->
<script type="text/html" id="toDespatchOrder_edit_platOrderProdInfo">
  <div style="text-align:left;">
    <div>库位:{{d.stockLocation || ''}}</div>
    <div class="onlyShowThreeLine" title="{{d.prodTitle || ''}}">
      名称:<span class="pora copySpan">
        <a>{{d.prodTitle || ''}}</a>
        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)" type="button">复制</button>
      </span>
    </div>
  </div>
</script>
<!-- 订单信息 -->
<script type="text/html" id="toDespatchOrder_edit_platOrderOrderInfo">
  <div style="text-align:left;">
    <div>报关信息:{{d.customsEnName || ''}}</div>
    <div>订单状态:{{d.platOrderDetailStatus || ''}}</div>
  </div>
</script>

<script type="text/html" id="toDespatchOrder_orginal_order_dynamicWeight"></script>
<script type="text/html" id="toDespatchOrder_orginal_order_dynamicMoney"></script>

<%-- 修改跟踪号 --%>
<script type="text/html" id="toDespatchOrder_editTrackingNoLayer">
    <form class="layui-form p20" id="toDespatchOrder_editTrackingNoForm"></form>
</script>
<script type="text/html" id="toDespatchOrder_editTrackingNoFormTpl">
    <div class="layui-form-item">
        <label class="layui-form-label">物流方式</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" name="logisTypeName" disabled value="{{d.logisTypeName || ''}}">
            <input type="hidden" name="id" value="{{d.id}}">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">跟踪号</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" name="logisTrackingNo" value="{{d.logisTrackingNo || ''}}">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">内部单号(包裹号)</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" name="logisAgentTrackingNo" value="{{d.logisAgentTrackingNo || ''}}">
        </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">&nbsp;</label>
      <div class="layui-input-block">虾皮店铺后台拆单订单,需填写跟踪号和内部单号,内部单号获取方法: 
        <a href="/lms/static/templet/虾皮真实拆单订单如何填入跟踪号和包裹号.docx" download="虾皮真实拆单订单如何填入跟踪号和包裹号" target="_blank" style="color: #0075ff;">
        <b>【下载】</b>
      </a> 
    </div>
    </div>
</script>
<%-- 权限问题---wish退款 --%>
<script type="text/html" id="toDespatchOrder_btnPermTag_wish">
    <permTag:perm funcCode="toDespatchOrder_wishBtnPermTag">
        <button name="toDespatchOrder_wishBtn" class="layui-btn layui-btn-xs layui-btn-normal">wish退款</button>
    </permTag:perm>
</script>
<%-- 权限问题---tiktok取消 --%>
<script type="text/html" id="toDespatchOrder_btnPermTag_tiktok">
    <permTag:perm funcCode="toDespatchOrder_tiktokBtnPermTag">
        <button name="toDespatchOrder_tiktokBtn" class="layui-btn layui-btn-xs layui-btn-normal">tiktok取消</button>
        <br>
    </permTag:perm>
</script>

<%-- 权限问题---修改订单 --%>
<script type="text/html" id="toDespatchOrder_updatePermTagTable">
    <permTag:perm funcCode="toDespatchOrder_updatePermTag">
    <button name="toDespatchOrder_update" class="layui-btn layui-btn-xs layui-btn-normal">修改订单</button><br>
    </permTag:perm>
</script>
<%-- 权限问题---拆分订单 --%>
<script type="text/html" id="toDespatchOrder_splitPermTagTable">
    <permTag:perm funcCode="toDespatchOrder_splitPermTag">
    <button name="toDespatchOrder_demolition" class="layui-btn layui-btn-xs layui-btn-normal">拆分订单</button><br>
    </permTag:perm>
</script>

<!-- #endregion -->


<!-- 成本占比 -->
<script type="text/html" id="toAuditOrder_costRatio">
  <div title="库存成本|商品成本占比">
    {{# if(!d.prodCost || !d.prodUnitCost){ }}
    <span></span>
    {{# }else{ }}
    <span>{{(d.prodUnitCost*100*d.prodQuantity/d.prodCost).toFixed(0)+'%' }}</span>
    {{# } }}
    <span>|</span>
    {{# if(!d.costPrice || !d.detailCostPrice){ }}
    <span></span>
    {{# }else{ }}
    <span>{{(d.detailCostPrice*100*d.prodQuantity/d.costPrice).toFixed(0)+'%'}}</span>
    {{# } }}
  </div>
</script>

<!-- 成本占比 -->
<script type="text/html" id="toDespatchOrder_costRatio">
  <div title="库存成本|商品成本占比">
    {{# if(!d.prodCost || !d.prodUnitCost){ }}
    <span></span>
    {{# }else{ }}
    <span>{{(d.prodUnitCost*100*d.prodQuantity/d.prodCost).toFixed(0)+'%' }}</span>
    {{# } }}
    <span>|</span>
    {{# if(!d.costPrice || !d.detailCostPrice){ }}
    <span></span>
    {{# }else{ }}
    <span>{{(d.detailCostPrice*100*d.prodQuantity/d.costPrice).toFixed(0)+'%'}}</span>
    {{# } }}
  </div>
</script>

<!-- 商品替换弹框-ztt20231011 -->
<script type="text/html" id="toDespatchOrder_lackSkuLayer">
  <div style="padding:20px">
    <table class="layui-table">
      <thead>
        <tr>
          <th>图片</th>
          <th>商品SKU</th>
          <th>款式</th>
          <th>可用数量</th>
          <th>重量(g)</th>
          <th>平均库存成本</th>
          <th>商品成本</th>
          <th width="80">操作</th>
        </tr>
      </thead>
      <tbody id="toDespatchOrder_lackSkuLayerTbody"></tbody>
    </table>
  </div>
</script>
<script type="text/html" id="toDespatchOrder_lackSkuLayerTbodyTpl">
{{# layui.each(d, function(index, item){ }}
  {{# if(index==0){ }}
  <tr style="background-color: aliceblue;">
  {{# }else{ }}
  <tr>
  {{# } }}
    <td>
      <div>
        <img width="60" height="60" data-original="{{item.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
      </div>
    </td>
    <td>{{item.prodSSku || ''}}</td>
    <td>{{item.style || ''}}</td>
    <td>{{item.availableStock || ''}}</td>
    <td>{{item.prodUnitWeight || ''}}</td>
    <td>{{item.prodUnitCost || ''}}</td>
    <td>{{item.commodityCost || ''}}</td>
    <td>
      {{# if(index !=0){ }}
      <span class="layui-btn layui-btn-sm layui-btn-normal lack-sku-replace" data-sku="{{item.prodSSku}}">替换</span>
      {{# } }}
    </td>
  </tr>
{{# }) }}
</script>

<!-- 速卖通申请跟踪号弹框 -->
<script type="text/html" id="beforedispatchtowh_requestNumLayer">
  <div style="padding:20px">
    <table class="layui-table" id="beforedispatchtowh_requestNumLayer_table"></table>
  </div>
</script>
<script type="text/html" id="beforedispatchtowh_requestNumLayer_table_prodInfo">
  <div style="display:flex;">
    <img width="60" height="60" data-original="{{d.platImageUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    <span>{{d.prodTitle}}</span>
  </div>
</script>
<script type="text/html" id="beforedispatchtowh_requestNumLayer_table_customPrice">
  <div>
    <input type="text" class="layui-input" value="{{d.customPrice || ''}}" name="customPrice{{d.id}}">
  </div>
</script>
<script type="text/html" id="beforedispatchtowh_requestNumLayer_table_customQuantity">
  <div>
    <input type="text" class="layui-input" value="{{d.customQuantity || ''}}" name="customQuantity{{d.id}}">
  </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/order/orderLog.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script src="${ctx}/static/js/order/beforedispatchtowh.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
