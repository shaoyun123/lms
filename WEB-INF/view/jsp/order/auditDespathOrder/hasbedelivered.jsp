<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>已发货订单</title>

<style>
  /* 弹框样式start */
  #hasbedelivered-scanLayerId .compositeStyle,
  #hasbedelivered-smtBigPackageLayerId .compositeStyle,
  #hasbedelivered-shopeeHandoverSheetId .compositeStyle {
    display: flex;
  }
  #hasbedelivered-scanLayerId .compositeStyle .layui-form-select,
  #hasbedelivered-scanLayerId .compositeStyle .xm-select-parent,
  #hasbedelivered-smtBigPackageLayerId .compositeStyle .layui-form-select,
  #hasbedelivered-smtBigPackageLayerId .compositeStyle .xm-select-parent,
  #hasbedelivered-shopeeHandoverSheetId .compositeStyle .layui-form-select,
  #hasbedelivered-shopeeHandoverSheetId .compositeStyle .xm-select-parent {
    flex: 4;
  }
  #hasbedelivered-scanLayerId .compositeStyle .compositeCk,
  #hasbedelivered-smtBigPackageLayerId .compositeStyle .compositeCk,
  #hasbedelivered-shopeeHandoverSheetId .compositeStyle .compositeCk {
    width: 121px;
    padding-left: 20px;
  }
  .totalWeight {
    position: absolute;
    right: 7%;
    bottom: 5%;
  }
  /* 弹框样式end */
  /* 搜索条件样式start */
  .dis_flex_space {
    display: flex;
    justify-content: space-between;
  }
  .externalContainAuditorder {
    position: relative;
    width: 0;
    float: left;
    height: 0;
    z-index: 20190918;
  }
  .externalPopAuditorder {
    clear: left;
    position: relative;
    left: -35.667vw;
    top: 40px;
    width: 35vw;
    border: 1px solid #e6e6e6;
    background-color: lightyellow;
    padding: 20px 0;
    border-radius: 5px;
    box-shadow: 1px 1px 1px grey;
  }
  /* 搜索条件样式end */

  .hasBedelivered-noteContent-tag {
    color: #008b8b;
    border: 1px solid #008b8b;
    background-color: #fff;
  }
  .hasbedelivered_store_style .xm-select-dl{
    width:-webkit-fill-available !important;
  }
  .select_label {
        padding: 0px!important;
  }
  .ml {
      margin-left: 10px;
  }
  .placeholder_color input::placeholder {
        color: #333; /* 设置占位符文本的颜色 */
  }
</style>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" id="hasbedeliveredForm" lay-filter="hasbedeliveredForm">
            <input type="hidden" name="logisApplySearchStatus" value="0" />
            <input type="hidden" name="limit" value="5000" />
            <input type="hidden" name="page" value="1" />
            <div class="layui-form-item">
              <div class="layui-col-md4 layui-col-lg4">
                <div class="layui-form-label labelSel">
                  <select name="orderTimeType">
                    <option value="orderTimeCn">订单时间</option>
                    <option value="shippingTime">发货时间</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" id="hasbedelivered_time" name="times" readonly />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">平台</label>
                <div class="layui-input-block">
                  <select name="platCode" lay-search id="hasbedelivered_platCode" lay-filter="hasbedelivered_platCode"></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">部门</label>
                <div class="layui-input-block">
                  <select name="orgs" lay-search class="orgs_hp_custom" lay-filter="hasbedelivered_orgs">
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label labelSel">
                  <select lay-filter="hasbedelivered_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                    <option value="1">销售</option>
                    <option value="2">客服</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <select name="salePersonId" class="users_hp_custom" lay-filter="hasbedelivered_salePersonsSelect" id="hasbedelivered_salePersonsSelect" xm-select="hasbedelivered_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 hasbedelivered_store_style">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select
                    name="storeAcctIds"
                    class="users_hp_store_multi"
                    id="hasbedelivered_store"
                    xm-select="hasbedelivered_storeAcct"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    lay-filter="hasbedelivered_storeAcct"
                  ></select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">订单编号</label>
                <div class="layui-input-block">
                  <input type="text" name="orderIds" class="layui-input" placeholder="多个编号使用逗号隔开" />
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">店铺单号</label>
                <div class="layui-input-block">
                  <input type="text" name="platOrderIds" class="layui-input" placeholder="多个单号使用逗号隔开" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label labelSel">
                  <select name="skuType">
                    <option value="prodSSkus">商品SKU(模糊)</option>
                    <option value="storeSSkus">店铺SKU(模糊)</option>
                    <option selected value="exactProdSSkus">商品SKU(精确)</option>
                    <option value="exactStoreSSkus">店铺SKU(精确)</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <input type="text" name="skuvalue" class="layui-input" placeholder="支持多个" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">物流属性</label>
                <div class="layui-input-block">
                  <select
                    name="prodLogisAttrs"
                    lay-filter="hasbedelivered_logisAttrs"
                    xm-select="hasbedelivered_logisAttrs"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    id="hasbedelivered_logisAttrs"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">SKU个数</label>
                <div class="layui-input-block dis_flex_space">
                  <input type="number" name="skuQuantityMin" class="layui-input" min="0" />
                  <span>&nbsp;~&nbsp;</span>
                  <input type="number" name="skuQuantityMax" class="layui-input" min="0" />
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">平台状态</label>
                <div class="layui-input-block">
                  <select
                          name="platOrderStatusList"
                          id="tbd_platOrderStatusList"
                          xm-select="tbd_platOrderStatusList"
                          xm-select-search
                          xm-select-search-type="dl"
                          xm-select-skin="normal"
                          lay-filter="tbd_platOrderStatusList"
                  ></select>
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
                  <input type="text" class="layui-input" name="itemIds" placeholder="多个单号使用逗号隔开" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">国家/地区</label>
                <div class="layui-input-block">
                  <select
                    name="shippingCountryCodes"
                    lay-filter="hasbedelivered_shippingCountrys"
                    xm-select="hasbedelivered_shippingCountrys"
                    id="hasbedelivered_shippingCountrys"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">买家指定物流</label>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="buyerRequireShippingType" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">商品数量</label>
                <div class="layui-input-block dis_flex_space">
                  <input type="number" name="prodQuantityMin" class="layui-input" min="0" />
                  <span>&nbsp;~&nbsp;</span>
                  <input type="number" name="prodQuantityMax" class="layui-input" min="0" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ">
                  <label class="layui-form-label">平台标签</label>
                  <div class="layui-input-block">
                      <select name="platTags" xm-select="hasbedelivered_platTags" id="hasbedelivered_platTags" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                      </select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label labelSel">
                  <select name="companyType" lay-filter="companyType">
                    <option value="companys">物流公司</option>
                    <option value="agents">货代公司</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <select id="hasbedelivered_company" lay-filter="hasbedelivered_company" name="company" lay-search></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">物流方式</label>
                <div class="layui-input-block">
                  <select
                    name="logisTypeIds"
                    id="hasbedelivered_logisTypeIds"
                    lay-filter="logisTypeIds"
                    xm-select="xm_hasbedelivered_logisTypeIds"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">跟踪号</label>
                <div class="layui-input-block">
                  <input type="text" name="logisTrackingNos" class="layui-input" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">标记发货</label>
                <div class="layui-input-block">
                  <select name="markShippingStatus">
                    <option value=""></option>
                    <option value="0">未标记</option>
                    <option value="1">已标记</option>
                    <option value="2">标记失败</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label select_label ml placeholder_color">
                  <select name="orderAmountCurrency">
                      <option selected value>订单金额</option>
                      <option value="USD">订单金额(仅USD)</option>
                      <option value="CNY">订单金额(仅CNY)</option>
                  </select>
                </div>
                <div class="layui-input-block dis_flex_space">
                  <input type="number" name="platOrderAmtMin" class="layui-input" min="0" />
                  <span>&nbsp;~&nbsp;</span>
                  <input type="number" name="platOrderAmtMax" class="layui-input" min="0" />
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2 dis_flex_space">
                <div class="externalBox" id="showMoreSearchCondition_hasbedelivered">
                  <span>更多查询条件<span class="hasValue"></span></span>
                  <span id="hide_icon_hasbedelivered" class="fr mr10 disN">︽</span>
                  <span id="show_icon_hasbedelivered" class="fr mr10">︾</span>
                </div>
              </div>
              <div class="externalContainAuditorder disN">
                <div class="externalPopAuditorder">
                  <div class="layui-form-item">
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">买家账号</label>
                      <div class="layui-input-block">
                        <input type="text" name="buyerUserId" class="layui-input" />
                      </div>
                    </div>
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">收件人</label>
                      <div class="layui-input-block">
                        <input type="text" name="shippingUsername" class="layui-input" />
                      </div>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">发货仓库</label>
                      <div class="layui-input-block">
                        <select name="warehouseId" lay-search id="hasbedelivered_warehouseId"></select>
                      </div>
                    </div>
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">平台交易ID</label>
                      <div class="layui-input-block">
                        <input type="text" name="platTransactionIds" class="layui-input" />
                      </div>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">付款邮箱</label>
                      <div class="layui-input-block">
                        <input type="text" name="buyerEmail" class="layui-input" />
                      </div>
                    </div>
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">收款邮箱</label>
                      <div class="layui-input-block">
                        <input type="text" name="sellerEmail" class="layui-input" />
                      </div>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">开发专员</label>
                      <div class="layui-input-block">
                        <select name="preprodDevId" lay-search id="hasbedelivered_preprodDevId"></select>
                      </div>
                    </div>
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">采购专员</label>
                      <div class="layui-input-block">
                        <select name="purchasingAgentId" lay-search id="hasbedelivered_purchasingAgentId"></select>
                      </div>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <div class="layui-col-lg5 layui-col-md5">
                      <label class="layui-form-label">单品金额</label>
                      <div class="layui-input-block dis_flex_space">
                        <input type="number" name="platUnitPriceMin" class="layui-input" min="0" />
                        <span>&nbsp;~&nbsp;</span>
                        <input type="number" name="platUnitPriceMax" class="layui-input" min="0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="layui-row">
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label labelSel">
                    <select name="newBatchNo">
                      <option value="1">拣货批次</option>
                      <option value="2">组包批次</option>
                    </select>
                  </label>
                  <div class="layui-input-block">
                    <input type="text" name="valBatchNo" class="layui-input" placeholder="">
                  </div>
<%--                  <label class="layui-form-label">拣货批次</label>--%>
<%--                  <div class="layui-input-block">--%>
<%--                    <input type="text" name="pickBatchNo" class="layui-input" placeholder="" />--%>
<%--                  </div>--%>
<%--                </div>--%>
<%--                <div class="layui-col-md2 layui-col-lg2">--%>
<%--                  <label class="layui-form-label">组包批次</label>--%>
<%--                  <div class="layui-input-block">--%>
<%--                    <input type="text" name="handoverBatchNo" class="layui-input" placeholder="" />--%>
<%--                  </div>--%>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                  <label class="layui-form-label">备注类型</label>
                  <div class="layui-input-block">
                    <div class="layui-col-md6 layui-col-lg6">
                      <select
                        name="orderLabels"
                        xm-select="hasbedelivered_orderLabels"
                        id="hasbedelivered_orderLabels"
                        xm-select-search
                        xm-select-search-type="dl"
                        xm-select-skin="normal"
                        lay-filter="hasbedelivered_orderLabels"
                      ></select>
                    </div>
                    <div class="layui-col-md6 layui-col-lg6">
                      <input type="text" name="orderNote" class="layui-input" placeholder="备注内容" style="height: 34px" />
                    </div>
                  </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                  <label class="layui-form-label">排序方式</label>
                  <div class="layui-input-block">
                    <select name="orderStr" lay-search>
                      <option value="o.order_time_cn asc">订单时间正序</option>
                      <option value="o.order_time_cn desc">订单时间倒序</option>
                      <option value="o.logis_apply_time asc">申请跟踪号时间正序</option>
                      <option value="o.logis_apply_time desc">申请跟踪号时间倒序</option>
                      <option value="o.ship_by_date asc">截止发货时间正序</option>
                      <option value="o.ship_by_date desc">截止发货时间倒序</option>
                      <option value="o.plat_order_amt asc">订单金额正序</option>
                      <option value="o.plat_order_amt desc">订单金额倒序</option>
                      <option value="o.profit asc">利润正序</option>
                      <option value="o.profit desc">利润倒序</option>
                      <option value="o.shipping_time asc">发货时间正序</option>
                      <option value="o.shipping_time desc">发货时间倒序</option>
                      <option value="poli.close_time asc">跟踪号剩余天数正序</option>
                      <option value="poli.close_time desc">跟踪号剩余天数倒序</option>
                      <option value="o.profit/(o.plat_order_amt*o.exchange_rate) asc">利润率正序</option>
                      <option value="o.profit/(o.plat_order_amt*o.exchange_rate) desc">利润率倒序</option>
                    </select>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2 layui-col-md-offset2">
                  <div style="text-align: right;">
                    <span class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch" lay-filter="hasbedeliveredSearch" id="hasbedeliveredSearch" lay-submit>查询</span>
                    <!-- <permTag:perm funcCode="export_tobe_Order">
                      <span class="layui-btn layui-btn-sm layui-btn-primary" id="hasbedelivered_export" lay-filter="hasbedelivered_export">导出</span>
                    </permTag:perm>
                    <permTag:perm funcCode="export_details_tobe_Order">
                      <span class="layui-btn layui-btn-sm" id="hasbedeliveredDetail_export">导出明细</span>
                    </permTag:perm> -->
                    <div id="hasbedelivered_save" class="inline_block pora"  style="margin-right: 25px;"></div>
                    <permTag:perm funcCode="export_tobe_Order">
                      <div id="hasbedelivered_exportTemplate" style="display: inline-block;position: relative;"></div>
                    </permTag:perm>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="hasbedeliveredCard">
        <div class="fixHigh">
          <div class="layui-card-header">
            <div class="fixTab">
              <audio src="${ctx}/static/audio/error.wav" id="hasbedelivered_audioplay">亲 您的浏览器不支持html5的audio标签</audio>
              <audio src="${ctx}/static/audio/success.wav" id="hasbedelivered_audioplaySuccess">亲 您的浏览器不支持html5的audio标签</audio>
              <!-- 页签点击结构 -->
              <div class="layui-tab" lay-filter="hasbedelivered-tabs" id="hasbedelivered-tabs">
                <ul class="layui-tab-title">
                  <li class="layui-this">全部(<span></span>)</li>
                </ul>
              </div>
              <div>
                <div id="hasbedelivered_platOperate" style="position: relative; margin-right: 5px">
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">平台操作</button>
                  <ul class="hidden">
                    <li>
                      <div>操作</div>
                      <ul>
                        <li id="hasbedelivered_syncOrderStatus">更新订单状态</li>
                        <li id="hasbedelivered_markDelivery">标记平台发货</li>
                      </ul>
                    </li>
                    <li>
                      <div>邮件</div>
                      <ul>
                        <li id="hasbedelivered_amazonEmail">Amazon邮件</li>
                        <li id="hasbedelivered_eBayEmail">eBay邮件</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <permTag:perm funcCode="hasbedelivered_Logistics">
                  <div id="hasbedelivered_Logistics_btns" style="position: relative; margin-right: 5px">
                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">物流</button>
                    <ul class="hidden" style="margin-top: -3px">
                      <li id="hasbedelivered_yanwenCutOrder">燕文截单</li>
                      <li id="hasbedelivered_huayiTrackingNo">获取华亿跟踪号</li>
                      <li id="hasbedelivered_logisRule_match_analysis">物流规则匹配分析</li>
                      <li id="hasbedelivered_updateLogistics">更新运费</li>
                      <li id="hasbedelivered_getEdisebay">获取跟踪号</li>
                    </ul>
                  </div>
                </permTag:perm>
                <div id="hasbedelivered_dealOrder_btns" style="position: relative; margin-right: 5px">
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单处理</button>
                  <ul class="hidden" style="margin-top: -3px">
                    <li id="hasbedelivered_batchRemark">批量备注</li>
                    <li id="hasbedelivered_resend">重寄</li>
                    <permTag:perm funcCode="hasbedelivered_updateWeight">
                      <li id="hasbedelivered_updateWeight" lay-tips="上传表格分2列，第1列：订单号/跟踪号，第2列：包裹重量(g)">修改称重</li>
                    </permTag:perm>
                  </ul>
                </div>
                <div id="hasbedelivered_printOperate" style="position: relative; margin-right: 5px">
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">打印</button>
                  <ul class="hidden" style="margin-top: -3px">
                    <li id="hasbedelivered_logisLi">物流面单</li>
                    <li id="hasbedelivered_setLi">配货单</li>
                    <li id="hasbedelivered_setlogisLi" style="line-height: 17px">物流面单(含SKU)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 下面放表格 -->
        <div class="layui-card-body">
          <div id="hasbedelivered_tableId" style="width: 100%; height: 500px" class="ag-theme-balham"></div>
          <div class="pageSortfix" id="hasBedeliveredPage"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<%-- 表格-订单号 --%>
<script type="text/html" id="hasbedelivered_id_tpl">
  <input type="hidden" value="{{d.id}}" />
  <div class="alignLeft">
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
        <a>{{d.platOrderId}}{{d.platStoreOrderId ? (d.platStoreOrderId): '' }}</a>
        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
      </span>
    </div>
    <div><span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span></div>
    <div><span class="gray">销售:</span><span>{{d.salesPersons||''}}</span></div>
  </div>
</script>

<%-- 表格-订单金额 --%>
<script type="text/html" id="hasbedelivered_platOrderAmt_tpl">
  <div class="alignLeft">
    <div><span class="gray">{{d.currency||""}}:</span>{{d.platOrderAmt||""}}</div>
    <div><span class="gray">利润(RMB):</span>{{d.profit||'0.00'}}</div>
    <div><span class="gray">利润率:</span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</div>
  </div>
</script>

<%-- 表格--商品 --%>
<script type="text/html" id="hasbedelivered_prodQuantity_tpl">
  <div class="alignLeft">
    <div><span class="gray">种类：</span><span>{{d.kindNum||""}}</span></div>
    <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
    <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
  </div>
</script>

<%-- 表格---收件人 --%>
<script type="text/html" id="hasbedelivered_shippingUsername_tpl">
  <div class="alignLeft">
    <div>{{d.shippingUsername||""}}</div>
    <div>[{{d.shippingCountryCnName||""}}]</div>
  </div>
</script>

<%-- 表格---物流 --%>
<script type="text/html" id="hasbedelivered_logisTypeName_tpl">
  <div class="alignLeft">
    <div><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}</span></div>
    <div><span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span><span>[{{d.logisTrackingNo||""}}]</span></div>
  </div>
</script>

<%-- 表格---时间 --%>
<script type="text/html" id="hasbedelivered_time_tpl">
  <div class="alignLeft">
    <div>
      <span class="gray">订单:</span>
      <span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})</span>
    </div>
    <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
  </div>
</script>

<%-- 表格---状态 --%>
<script type="text/html" id="hasbedelivered_platOrderStatus_tpl">
  <div class="alignLeft">
    <div><span class="gray">留言：{{d.buyerNote||""}}</span></div>
    <div>
      <span class="gray"
        >标记发货：{{# if(d.markShippingStatus == 0){ }} 未标记 {{# } else if(d.markShippingStatus == 1) { }} 已标记 {{# } else if(d.markShippingStatus == 2) { }} 标记失败 {{# } }}
      </span>
    </div>
    <div><span class="gray">订单标签：</span></div>
    <div><span class="gray">订单状态：{{d.platOrderStatus||""}}</span></div>
    <%--
    <div class="text_l"><span class="gray">万邑通状态：{{d.winitStatus||""}}</span></div>
    --%>
    <div><span class="gray">打印面单状态：</span></div>
  </div>
</script>

<%-- 表格---操作 --%>
<script type="text/html" id="hasbedelivered_detailTool">
  <span class="layui-btn layui-btn-xs disN" lay-event="detail">详情</span><br />
  <span class="layui-btn layui-btn-xs" lay-event="remark">备注</span>
</script>

<%-- 录入异常弹框 --%>
<script type="text/html" id="hasbedelivered_inputexceptLayer">
    <div class='mg_t'>
        <form class="layui-form mg" action="" id="issue_mofidy_form">
            <div class="layui-col-md12 layui-col-lg12">
              <div class="layui-col-md4 layui-col-lg4">
                <label class="layui-form-label" style="display: none">数据来源</label>
                <div class="layui-input-block" style="display: none">
                  <input name="dataSource" class="layui-input"  placeholder="必填">
                </div>
              </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">问题类型</label>
                    <div class="layui-input-block">
                        <select name="issueType" lay-verify="required" id="layer_issue_select" >
                            
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">订单号</label>
                    <div class="layui-input-block">
                        <input name="allrootNid" class="layui-input" lay-verify="required" placeholder="必填">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                  <label class="layui-form-label">店铺单号</label>
                  <div class="layui-input-block">
                      <input name="orderId" class="layui-input " lay-verify="required" >
                  </div>
              </div>
                <!-- <div class="layui-col-md4 layui-col-lg4">
                    <div style="min-height: 36px;"></div>
                </div> -->
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">平台</label>
                    <div class="layui-input-block">
                        <input name="platCode" class="layui-input " lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                        <input name="storeAcct" class="layui-input " lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                  <label class="layui-form-label">包装员</label>
                  <div class="layui-input-block">
                      <input name="packager" class="layui-input">
                  </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                  <label class="layui-form-label"><font class="fRed">*</font>异常数量</label>
                  <div class="layui-input-block">
                      <input name="issueNum" class="layui-input">
                  </div>
                </div>
                <!-- <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常sku</label>
                    <div class="layui-input-block">
                        <input name="issueSku" class="layui-input" placeholder="商品子sku,必填" lay-verify="required">
                    </div>
                </div> -->
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常重量(g)</label>
                    <div class="layui-input-block">
                        <input name="issueWeight" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                  <label class="layui-form-label">发货时间</label>
                  <div class="layui-input-block">
                      <input name="deliveryTime" class="layui-input" id="delivery_time_str" placeholder="请选择">
                  </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">实发sku</label>
                    <div class="layui-input-block">
                        <input name="deliverySku" class="layui-input">
                    </div>
                </div>
                <!-- <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">金额</label>
                    <div class="layui-input-block">
                        <div class="layui-col-md6 layui-col-lg6">
                            <select name="issueCurrency" id="hasbedelivered_issueCurrency">
                                
                            </select>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <input name="issueAmount" class="layui-input" placeholder="">
                        </div>
                    </div>
                </div> -->
            </div>
            <!-- <div class="layui-col-md12 layui-col-lg12"> -->
            <!-- </div> -->
            <div style="padding: 10px;">
              <table id="hasbedelivered_inputexcept_table" lay-filter="hasbedelivered_inputexcept_table"></table>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">问题描述</label>
                <div class="layui-input-block">
                    <textarea name="issueRemark" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12 mg_t">
                <label class="layui-form-label">
                  <div>图片URL</div>
                  <span class="layui-btn layui-btn-xs layui-btn-normal previewBtn">预览链接</span>
                </label>
                <div class="layui-input-block">
                    <textarea name="issueImgs" class="layui-textarea" placeholder="多个以换行分隔"></textarea>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12 mg_t">
              <label class="layui-form-label">图片预览</label>
              <div class="layui-input-block" style="margin-bottom:10px;">
                  <!-- 分成两部分: 一部分专门用来拖拽,拖拽完成以后把图片链接渲染到textarea中,一部分预览,每次点击预览,都会清空这两部分 -->
                  <ul class="commonPreviewImg" style="height:150px"></ul>
                  <div  class="layui-upload-drag"  id="hasbedelivered_issue_mofidy_dragImg">
                    <i class="layui-icon">&#xe67c;</i>
                    <p>点击上传，或将文件拖拽到此处</p>
                  </div>
              </div>
            </div>
        </form>
    </div>
</script>


<%-- 权限问题---录入异常 --%>
<script type="text/html" id="hasbedelivered_inputexceptPermTagTable">
    <permTag:perm funcCode="hasbedelivered_inputexceptPermTag">
    <button name="hasbedelivered_inputexcept" class="layui-btn layui-btn-xs">录入异常</button>
    </permTag:perm>
</script>

<!-- 录入异常 radio -->
<script type="text/html" id="hasbedelivered_inputexcept_table_radio">
  <input type="radio" name="radio" value="{{d.id}}" title="">
</script>
<!-- 录入异常 商品SKU -->
<script type="text/html" id="hasbedelivered_inputexcept_table_prodSSku">
  <input type="hidden" name="pickUserName_prodSSku_{{d.id}}" value="{{d.pickUserName}}">
  <input type="hidden" name="checkUserName_prodSSku_{{d.id}}" value="{{d.checkUserName}}">
  <%--    <input type="hidden" name="packager_prodSSku_{{d.id}}" value="{{d.packUser}}">--%>
  <input type="text" name="prodSSku_{{d.id}}" value="{{d.prodSSku}}" placeholder="请输入异常sku" autocomplete="off" class="layui-input">    
</script>


<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script src="${ctx}/static/js/order/hasbedelivered.js"></script>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/js/ireport/print.js"></script>
