<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>待包装订单</title>

<link rel="stylesheet" href="${ctx}/static/layui/css/ztt.table.css" />
<%-- 引用element样式 --%>
<style>
  .waittopack_store_style .xm-select-dl {
    width: -webkit-fill-available !important;
  }
  .unit,
  .unit_mul {
    color: red !important;
    font-weight: bold;
    font-size: 50px !important;
  }
</style>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" id="waittopackForm" lay-filter="waittopackForm">
            <input type="hidden" name="logisApplySearchStatus" value="">
            <input type="hidden" name="limit" value="5000" />
            <input type="hidden" name="page" value="1" />
            <div class="layui-form-item">
              <div class="layui-col-md4 layui-col-lg4">
                <div class="layui-form-label labelSel">
                  <select lay-filter="orderTimeType" name="orderTimeType">
                    <option value="">订单时间</option>
                    <option value="dispatchTime">派至仓库时间</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <input
                    type="text"
                    class="layui-input"
                    id="waittopack_time"
                    name="times"
                    readonly
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">平台</label>
                <div class="layui-input-block">
                  <select
                    name="platCode"
                    lay-search
                    id="waittopack_platCode"
                    lay-filter="waittopack_platCode"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">部门</label>
                <div class="layui-input-block">
                  <select
                    name="orgs"
                    lay-search
                    class="orgs_hp_custom"
                    lay-filter="waittopack_orgs"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label labelSel">
                  <select
                    lay-filter="waittopack_salerAndcustomSelectFilter"
                    name="salerAndcustomSelect"
                  >
                    <option value="1">销售</option>
                    <option value="2">客服</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <select
                    name="salePersonId"
                    class="users_hp_custom"
                    lay-filter="waittopack_salePersonsSelect"
                    id="waittopack_salePersonsSelect"
                    xm-select="waittopack_salePersonsSelect"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 waittopack_store_style">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select
                    name="storeAcctIds"
                    class="users_hp_store_multi"
                    id="waittopack_store"
                    xm-select="waittopack_storeAcct"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    lay-filter="waittopack_storeAcct"
                  ></select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">订单编号</label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    name="orderIds"
                    class="layui-input"
                    placeholder="多个编号使用逗号隔开"
                  />
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
                    <option value="exactProdSSkus" selected>商品SKU(精确)</option>
                    <option value="exactStoreSSkus">店铺SKU(精确)</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <input
                    type="text"
                    name="skuvalue"
                    class="layui-input"
                    placeholder="支持多个"
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">物流属性</label>
                <div class="layui-input-block">
                  <select
                    name="prodLogisAttrs"
                    lay-filter="waittopack_logisAttrs"
                    xm-select="waittopack_logisAttrs"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    id="waittopack_logisAttrs"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">SKU个数</label>
                <div class="layui-input-block dis_flex_space">
                  <input
                    type="number"
                    name="skuQuantityMin"
                    class="layui-input"
                    min="0"
                  />
                  <span>&nbsp;~&nbsp;</span>
                  <input
                    type="number"
                    name="skuQuantityMax"
                    class="layui-input"
                    min="0"
                  />
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">平台状态</label>
                <div class="layui-input-block">
                  <select
                    name="platOrderStatusList"
                    xm-select="waittopack_platOrderStatusList"
                    id="waittopack_platOrderStatusList"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    lay-search=""
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
                  <input
                    type="text"
                    class="layui-input"
                    name="itemIds"
                    placeholder="多个单号使用逗号隔开"
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">国家/地区</label>
                <div class="layui-input-block">
                  <select
                    name="shippingCountryCodes"
                    lay-filter="waittopack_shippingCountrys"
                    xm-select="waittopack_shippingCountrys"
                    id="waittopack_shippingCountrys"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">买家指定物流</label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    class="layui-input"
                    name="buyerRequireShippingType"
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">商品数量</label>
                <div class="layui-input-block dis_flex_space">
                  <input
                    type="number"
                    name="prodQuantityMin"
                    class="layui-input"
                    min="0"
                  />
                  <span>&nbsp;~&nbsp;</span>
                  <input
                    type="number"
                    name="prodQuantityMax"
                    class="layui-input"
                    min="0"
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">平台标签</label>
                <div class="layui-input-block">
                  <select
                    name="platTags"
                    xm-select="waittopack_platTags"
                    id="waittopack_platTags"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    lay-search
                  ></select>
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
                  <select
                    id="waittopack_company"
                    lay-filter="waittopack_company"
                    name="company"
                    xm-select="xm_waittopack_company"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">物流方式</label>
                <div class="layui-input-block">
                  <select
                    name="logisTypeIds"
                    id="waittopack_logisTypeIds"
                    lay-filter="logisTypeIds"
                    xm-select="xm_waittopack_logisTypeIds"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">跟踪号</label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    name="logisTrackingNos"
                    class="layui-input"
                  />
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
                <label class="layui-form-label">订单金额</label>
                <div class="layui-input-block dis_flex_space">
                  <input
                    type="number"
                    name="platOrderAmtMin"
                    class="layui-input"
                    min="0"
                  />
                  <span>&nbsp;~&nbsp;</span>
                  <input
                    type="number"
                    name="platOrderAmtMax"
                    class="layui-input"
                    min="0"
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">订单天数</label>
                <div class="layui-input-block dis_flex_space">
                  <input
                    type="number"
                    name="delayMin"
                    class="layui-input"
                    min="0"
                  />
                  <span>&nbsp;~&nbsp;</span>
                  <input
                    type="number"
                    name="delayMax"
                    class="layui-input"
                    min="0"
                  />
                </div>
              </div>
              <div class="externalContainAuditorder disN">
                <div class="externalPopAuditorder">
                  <div class="layui-form-item">
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">买家账号</label>
                      <div class="layui-input-block">
                        <input
                          type="text"
                          name="buyerUserId"
                          class="layui-input"
                        />
                      </div>
                    </div>
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">收件人</label>
                      <div class="layui-input-block">
                        <input
                          type="text"
                          name="shippingUsername"
                          class="layui-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">发货仓库</label>
                      <div class="layui-input-block">
                        <select
                          name="warehouseId"
                          lay-search
                          id="waittopack_warehouseId"
                        ></select>
                      </div>
                    </div>
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">平台交易ID</label>
                      <div class="layui-input-block">
                        <input
                          type="text"
                          name="platTransactionIds"
                          class="layui-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">付款邮箱</label>
                      <div class="layui-input-block">
                        <input
                          type="text"
                          name="buyerEmail"
                          class="layui-input"
                        />
                      </div>
                    </div>
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">收款邮箱</label>
                      <div class="layui-input-block">
                        <input
                          type="text"
                          name="sellerEmail"
                          class="layui-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">开发专员</label>
                      <div class="layui-input-block">
                        <select
                          name="preprodDevId"
                          lay-search
                          id="waittopack_preprodDevId"
                        ></select>
                      </div>
                    </div>
                    <div class="layui-col-md5 layui-col-lg5">
                      <label class="layui-form-label">采购专员</label>
                      <div class="layui-input-block">
                        <select
                          name="purchasingAgentId"
                          lay-search
                          id="waittopack_purchasingAgentId"
                        ></select>
                      </div>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <div class="layui-col-lg5 layui-col-md5">
                      <label class="layui-form-label">单品金额</label>
                      <div class="layui-input-block dis_flex_space">
                        <input
                          type="number"
                          name="platUnitPriceMin"
                          class="layui-input"
                          min="0"
                        />
                        <span>&nbsp;~&nbsp;</span>
                        <input
                          type="number"
                          name="platUnitPriceMax"
                          class="layui-input"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="layui-row">
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">拣货批次</label>
                  <div class="layui-input-block">
                    <input
                      type="text"
                      name="enterpickBatchNor"
                      id="enterpickBatchNor"
                      class="layui-input"
                      style="position: absolute; z-index: 2; width: 80%"
                      placeholder="请选择"
                      autocomplete="off"
                    />
                    <select
                      name="pickBatchNo"
                      lay-search
                      id="waittopack_pickBatchNo"
                      lay-filter="waittopack_pickBatchNo"
                    ></select>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">组包批次</label>
                  <div class="layui-input-block">
                    <input
                      type="text"
                      name="handoverBatchNo"
                      class="layui-input"
                      placeholder=""
                    />
                  </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                  <label class="layui-form-label labelSel">
                    <select
                      name="orderLabels"
                      xm-select="waittopack_orderLabels"
                      id="waittopack_orderLabels"
                      xm-select-search
                      xm-select-search-type="dl"
                      xm-select-skin="normal"
                      lay-filter="waittopack_orderLabels"
                    ></select>
                  </label>
                  <div class="layui-input-block">
                    <input
                      type="text"
                      name="orderNote"
                      class="layui-input"
                      placeholder="备注内容"
                      style="height: 34px"
                    />
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
                      <option value="o.prod_quantity asc">商品数量正序</option>
                      <option value="o.prod_quantity desc">商品数量倒序</option>
                      <option value="poli.close_time asc">跟踪号剩余天数正序</option>
                      <option value="poli.close_time desc">跟踪号剩余天数倒序</option>
                      <option value="o.profit/(o.plat_order_amt*o.exchange_rate) asc">利润率正序</option>
                      <option value="o.profit/(o.plat_order_amt*o.exchange_rate) desc">利润率倒序</option>
                    </select>
                  </div>
                </div>
                <input type="hidden" name="processStatus" value="120" />
                <div class="layui-col-md2 layui-col-lg2 dis_flex_space">
                  <div
                    class="externalBox"
                    id="showMoreSearchCondition_waittopack"
                  >
                    <span>更多查询条件<span class="hasValue"></span></span>
                    <span id="hide_icon_waittopack" class="fr mr10 disN"
                      >︽</span
                    >
                    <span id="show_icon_waittopack" class="fr mr10">︾</span>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <div class="layui-input-block">
                    <span
                      class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch"
                      lay-filter="waittopackSearch"
                      id="waittopackSearch"
                      lay-submit
                      >查询</span
                    >
                    <!-- <button
                      type="button"
                      class="layui-btn layui-btn-sm layui-btn-primary"
                      lay-submit=""
                      id="waittopack_export"
                      lay-filter="waittopack_export"
                    >
                      导出
                    </button> -->
                    <!-- <span
                      class="layui-btn layui-btn-sm"
                      id="waittopackDetail_export"
                      >导出明细</span
                    > -->
                    <div id="waittopack_exportTemplate" style="display: inline-block;position: relative;"></div>
                    <div id="waittopack_save" class="inline_block pora"></div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="waittopackCard">
        <div class="fixHigh">
          <div class="layui-card-header">
            <div class="fixTab">
              <audio
                src="${ctx}/static/audio/error.wav"
                id="waittopack_audioplay"
              >
                亲 您的浏览器不支持html5的audio标签
              </audio>
              <!-- 页签点击结构 -->
              <div
                class="layui-tab"
                lay-filter="waittopack_tabs"
                id="waittopack_tabs"
              >
                <ul class="layui-tab-title">
                  <li class="layui-this">未配货(<span></span>)</li>
                  <li>未核单(<span></span>)</li>
                  <li>未包装(<span></span>)</li>
                  <li>仓库缺货(<span></span>)</li>
                  <li>仓库拦截(<span></span>)</li>
                </ul>
              </div>
              <!-- 下面的div放按钮,结构不要变化 -->
              <div>
                <permTag:perm  funcCode="waittopackage_dismantlePermTag">
                <span class="layui-btn layui-btn-sm disN" style="margin-right: 5px" id="waittopackage_dismantleBtn">
                  换单/拆单包装
                </span>
               </permTag:perm>
                <div
                  id="waittopackage_orderHandle"
                  style="position: relative; margin-right: 5px"
                >
                  <permTag:perm funcCode="order_processing_Order">
                    <button
                      type="button"
                      class="layui-btn layui-btn-normal layui-btn-sm"
                    >
                      订单处理
                    </button>
                    <ul class="hidden">
                      <permTag:perm funcCode="picking_iscomplete_wait_Order">
                        <li id="waittopackage_pickCompleteLi">配货完成</li>
                      </permTag:perm>
                      <permTag:perm funcCode="picking_iscomplete_wait_Order2">
                        <li id="waittopackage_pickCompleteLi2" class="disN">核单完成</li>
                      </permTag:perm>
                      <permTag:perm funcCode="picking_iscomplete_wait_Order3">
                        <li id="waittopackage_pickCompleteLi3" class="disN">包装完成</li>
                      </permTag:perm>
                      <permTag:perm funcCode="picking_iscomplete_wait_Order4">
                        <li id="waittopackage_pickCompleteLi4" class="disN">转至待派单</li>
                      </permTag:perm>
                      <permTag:perm funcCode="picking_iscomplete_wait_Order5">
                        <li id="waittopackage_pickCompleteLi5" class="disN">转至待发货</li>
                      </permTag:perm>
                      <permTag:perm funcCode="reject_the_order_wait_Order">
                        <li id="waittopackage_rejectLi" class="disN">驳回订单</li>
                      </permTag:perm>
                      <permTag:perm funcCode="mark_anomaly_wait_Order">
                        <li id="waittopackage_markLi" style="background: #FFB951;color: #fff;">标记异常</li>
                      </permTag:perm>
                      <permTag:perm funcCode="cancel_order_wait_Order">
                        <li id="waittopackage_cancelLi" style="background: #ff0000;color: #fff;">取消订单</li>
                      </permTag:perm>
                      <li id="waittopackage_updateLi">批量备注</li>
                      <permTag:perm
                        funcCode="waittopackage_pendingreview_permTag"
                      >
                        <li id="waittopackage_pendingreview" class="disN">
                          转至待审核
                        </li>
                      </permTag:perm>
                      <permTag:perm
                        funcCode="waittopackage_rejectOrderdabao_permTag"
                      >
                        <li id="waittopackage_rejectOrderdabao">优选仓拒单</li>
                      </permTag:perm>
                      <li id="waittopackage_updateProducts">更新商品信息</li>
                    </ul>
                  </permTag:perm>
                </div>
                <div
                  id="waittopackage_platOperate"
                  style="position: relative; margin-right: 5px"
                >
                  <permTag:perm funcCode="platform_operation_wait_Order">
                    <button
                      type="button"
                      class="layui-btn layui-btn-normal layui-btn-sm"
                    >
                      平台操作
                    </button>
                    <ul class="hidden">
                      <li>
                        <div>后台取消</div>
                        <ul>
                          <li id="waittopackage_cancelOrderEbay">ebay取消</li>
                          <permTag:perm funcCode="waittopackage_wishBtnPermTag">
                              <li id="waittopackage_wishRefund">wish退款</li>
                          </permTag:perm>
                        </ul>
                      </li>
                      <li>
                        <div>其他操作</div>
                        <ul>
                          <li id="waittopackage_syncOrderStatus">
                            更新订单状态
                          </li>
                          <li id="waittopackage_markDelivery">标记平台发货</li>
                        </ul>
                      </li>
                      <li>
                        <div>邮件</div>
                        <ul>
                          <li id="waittopackage_amazonEmail">Amazon邮件</li>
                          <li id="waittopackage_eBayEmail">eBay邮件</li>
                          <li id="waittopackage_decryptAddress" class="disN addressAndDeclare">解密地址</li>
                          <li id="waittopackage_deliverDeclare" class="disN addressAndDeclare">修改发货声明</li>
                        </ul>
                      </li>
                    </ul>
                  </permTag:perm>
                </div>
                <div id="waittopackage_printOperate" style="position: relative; margin-right: 5px">
                  <permTag:perm funcCode="print_wait_Order">
                    <button class="layui-btn layui-btn-normal layui-btn-sm" type="button">
                      打印
                    </button>
                    <ul class="hidden" style="margin-top: -3px">
                      <li id="waittopackage_logisLi">物流面单</li>
                      <%--
                      <li id="waittopackage_setLi">打印配货单</li>
                      --%>
                      <li id="waittopackage_setLi">配货单</li>
                      <li id="waittopackage_setlogisLi" style="line-height: 17px">
                        物流面单(含SKU)
                      </li>
                    </ul>
                  </permTag:perm>
                </div>
                <permTag:perm funcCode="single_product_packaging_Order">
                  <span
                    class="layui-btn layui-btn-sm layui-btn-normal disN"
                    id="waittopack_singlePackageBtn"
                  >
                    单品包装
                  </span>
                </permTag:perm>
                <permTag:perm funcCode="multi_product_packaging_Order">
                  <span
                    class="layui-btn layui-btn-sm layui-btn-normal disN"
                    id="waittopack_multiPackageBtn"
                  >
                    多品包装
                  </span>
                </permTag:perm>
                <permTag:perm funcCode="setup_sorting_batch_Order">
                  <span
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="waittopack_setBtn"
                  >
                    设置分拣批次
                  </span>
                </permTag:perm>
                <permTag:perm funcCode="distribution_wait_Order">
                  <span
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="waittopack_distributeBtn"
                  >
                    配货
                  </span>
                </permTag:perm>
                <permTag:perm funcCode="multi_batch_distribution_wait_Order">
                  <span
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="waittopack_multiDistributeBtn"
                  >
                    多批次配货
                  </span>
                </permTag:perm>
                <permTag:perm funcCode="multi_family_shooting_wait_Order">
                  <span
                    class="layui-btn layui-btn-sm layui-btn-normal disN"
                    id="waittopack_multiShotBasketballBtn"
                  >
                    多品投篮
                  </span>
                </permTag:perm>
                <permTag:perm funcCode="short_shots_wait_Order">
                  <span
                    class="layui-btn layui-btn-sm layui-btn-normal disN"
                    id="waittopack_lackShotBasketballBtn"
                  >
                    少货投篮
                  </span>
                </permTag:perm>

                <permTag:perm funcCode="batch_unbundling_wait_Order">
                  <span
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="waittopack_unBindBatch"
                  >
                    批次解绑
                  </span>
                </permTag:perm>
                <permTag:perm
                  funcCode="multi_product_outofstock_handling_wait_Order"
                >
                  <span
                    class="layui-btn layui-btn-sm layui-btn-normal disN"
                    id="waittopack_multiNoProdBtn"
                  >
                    多品缺货处理
                  </span>
                </permTag:perm>

                <div id="waittopack_logis" class="layui-inline disN">
                  <permTag:perm funcCode="waittopack_LogisBtnHandle_permTag">
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">物流</button>
                  <ul class="hidden">
                      <li id="waittopack_matchLogis">匹配物流</li>
                      <li id="waittopack_updatelogistype">手动指定物流</li>
                      <li id="waittopack_applylogisno">申请跟踪号</li>
                      <li id="waittopack_removelogisno">清空跟踪号</li>
                      <li id="waittopack_cancelwishpost">取消wishpost跟踪号</li>
                      <li id="waittopack_cancelEdisebay">取消橙联跟踪号</li>
                      <li id="waittopack_getEdisebay" class="disN">获取跟踪号</li>
                      <li id="waittopack_editTrackingNo">修改跟踪号</li>
                  </ul>
                  </permTag:perm>
              </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 下面放表格 -->
        <div class="layui-card-body">
          <div class="layui-tab disN" id="waittopacktoInterceptTabs" lay-filter="waittopacktoInterceptTabs">
            <ul class="layui-tab-title">
            </ul>
          </div>
          <div
            id="waittopack_tableId"
            style="width: 100%; height: 500px"
            class="ag-theme-balham"
          ></div>
          <div class="pageSortfix" id="waittopackdPage"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<%-- 表格-订单号 --%>
<script type="text/html" id="waittopack_id_tpl">
  <input type="hidden" value="{{d.id}}" />
  <div class="alignLeft">
    <div>
      <span class="pora copySpan">
        <a class="waittipack_Id">{{d.id||""}}</a>
        <button
          class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
          onclick="layui.admin.copyTxt(this)"
        >
          复制
        </button>
      </span>
      <span class="gray"
        >[{{d.storeAcct||""}}[{{d.allrootAliasName||""}}]]</span
      >
      {{# if(d.operOrderType=="1"){ }}
      <span class="hp-badge layui-bg-orange fr" title="拆出订单">拆</span>
      {{# }else if(d.operOrderType=="2"){ }}
      <span class="hp-badge layui-bg-orange fr" title="合并订单">合</span>
      {{# }}}
    </div>
    <div>
      <span class="pora copySpan">
        <a
          >{{d.platOrderId}}{{d.platStoreOrderId ? (d.platStoreOrderId): ''
          }}</a
        >
        <button
          class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
          onclick="layui.admin.copyTxt(this)"
        >
          复制
        </button>
      </span>
    </div>
    <div>
      <span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span>
    </div>
    <div>
      <span class="gray">销售:</span><span>{{d.salesPersons||''}}</span>
    </div>
  </div>
</script>

<%-- 表格-订单金额 --%>
<script type="text/html" id="waittopack_platOrderAmt_tpl">
  <div class="alignLeft">
    <div>
      <span class="gray">{{d.currency||""}}:</span>{{d.platOrderAmt||""}}
    </div>
    <div><span class="gray">利润(RMB):</span>{{d.profit||'0.00'}}</div>
    <div>
      <span class="gray">利润率:</span
      >{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%
    </div>
  </div>
</script>

<%-- 表格--商品 --%>
<script type="text/html" id="waittopack_prodQuantity_tpl">
  <div class="alignLeft">
    <div><span class="gray">种类：</span><span>{{d.kindNum||""}}</span></div>
    <div>
      <span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span>
    </div>
    <div>
      <span class="gray">重量：</span
      ><span>{{d.realWeight||d.preWeight}}g</span>
    </div>
  </div>
</script>

<%-- 表格---收件人 --%>
<script type="text/html" id="waittopack_shippingUsername_tpl">
  <div class="alignLeft">
    <div>{{d.shippingUsername||""}}</div>
    <div>[{{d.shippingCountryCnName||""}}]</div>
  </div>
</script>

<%-- 表格---物流 --%>
<script type="text/html" id="waittopack_logisTypeName_tpl">
  <div class="alignLeft">
    <div>
      <span class="gray">买家:</span
      ><span>{{d.buyerRequireShippingType||""}}</span>
    </div>
    <div>
      <span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span
      ><span>[{{d.logisTrackingNo||""}}]</span>
    </div>
  </div>
</script>

<%-- 表格---时间 --%>
<script type="text/html" id="waittopack_time_tpl">
  <div class="alignLeft">
    <div>
      <span class="gray">订单:</span>
      <span
        >{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay||
        '0'}})</span
      >
    </div>
    <div>
      <span class="gray">申号:</span
      ><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span>
    </div>
    <div>
      <span class="gray">发货:</span
      ><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span>
    </div>
  </div>
</script>

<%-- 表格---状态 --%>
<script type="text/html" id="waittopack_platOrderStatus_tpl">
  <div class="alignLeft">
      <div><span class="gray">留言：{{d.buyerNote||""}}</span></div>
      <%-- <div><span class="gray">标记发货：{{d.markShippingStatus || '' }} 11223 --%>
      <div><span class="gray">标记发货：
      {{#  if(d.markShippingStatus == 0) { }}
          未标记
      {{#  } else if(d.markShippingStatus == 1) { }}
          已标记
      {{#  } else if(d.markShippingStatus == 2) { }}
          标记失败
      {{#  } }}   </span></div>
      <div><span class="gray">订单标签：</span></div>
      <div><span class="gray">订单状态：{{d.platOrderStatus||""}}</span></div>
      <%-- <div class="text_l"><span class="gray">万邑通状态：{{d.winitStatus||""}}</span></div> --%>
      <div><span class="gray">打印面单状态：</span></div>
  </div>
</script>

<%-- 表格---操作 --%>
<script type="text/html" id="waittopack_detailTool">
  <span class="layui-btn layui-btn-xs disN" lay-event="detail">详情</span><br />
  <span class="layui-btn layui-btn-xs" lay-event="remark">备注</span>
</script>

<%-- 弹框--配货 --%>
<script type="text/html" id="waittopack_distributeLayer">
  <div class="distributeContainer">
    <div class="distributeContainer-table">
      <table class="ztt-table">
        <thead>
          <tr>
            <th class="td5">序号</th>
            <th class="td35">SKU</th>
            <%--
            <th>商品简称</th>
            --%>
            <th class="td20">
              库位
              <span class="sortIconClass">
                <i
                  class="layui-icon layui-icon-up"
                  id="sortIconClass_upSort"
                ></i>
                <i
                  class="layui-icon layui-icon-down"
                  id="sortIconClass_downSort"
                ></i>
              </span>
            </th>
            <th class="td10">应拣量</th>
            <th class="td10">实拣量</th>
            <th class="td10">库存量</th>
            <%--
            <th>是否拣完</th>
            --%>
            <th class="td10">是否装袋</th>
          </tr>
        </thead>
        <tbody id="distributeContainer_tableTbody"></tbody>
      </table>
    </div>
    <div class="distributeContainer-form">
      <form class="layui-form">
        <div class="layui-form-item" style="margin-left: -20px;">
          <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-col-md6 layui-col-lg6">
              <label class="layui-form-label">仓库</label>
              <div class="layui-input-block">
                <select
                  name="warehouseId"
                  id="waittopack_distribute_warehouseId"
                  lay-search
                  lay-filter="waittopack_distribute_warehouseId"
                >
                  <option value="">请选择</option>
                  <option value="1">昆山仓</option>
                </select>
              </div>
            </div>
            <div class="layui-col-md6 layui-col-lg6">
              <label class="layui-form-label">类型</label>
              <div class="layui-input-block">
                <select name="pickType">
                  <option value="">请选择</option>
                  <option value="0">单品</option>
                  <option value="1">多品</option>
                  <option value="2">多批次</option>
                  <option value="3">少货批次</option>
                </select>
              </div>
            </div>
            <div class="layui-col-md6 layui-col-lg6">
              <label class="layui-form-label">楼栋</label>
              <div class="layui-input-block">
                <select name="buildingNo">
                  <option value="">请先选择仓库</option>
                </select>
              </div>
            </div>
            <div class="layui-col-md6 layui-col-lg6">
              <label class="layui-form-label">楼层</label>
              <div class="layui-input-block">
                <select name="floorNo">
                  <option value="">请先选择仓库</option>
                </select>
              </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
              <label class="layui-form-label">批次号</label>
              <div class="layui-input-block">
                <input
                  type="text"
                  class="layui-input"
                  name="batchNo"
                  readonly
                />
              </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
              <div class="layui-input-block" style="text-align:right;">
                <span
                  class="layui-btn layui-btn-sm layui-btn-normal"
                  title="打印配货批次"
                  id="distributeContainerForm_printBatchNo"
                  >打印</span
                >
                <span
                  class="layui-btn layui-btn-sm layui-btn-normal"
                  id="distributeContainerForm_getSku"
                  >获取</span
                >
                <span
                  class="layui-btn layui-btn-sm layui-btn-normal"
                  id="distributeContainerForm_robSku"
                  >抢单</span
                >
              </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
              <label class="layui-form-label">库位</label>
              <div class="layui-input-block">
                <div class="hlh50" id="distribute_locationCode"></div>
                <input
                  type="hidden"
                  class="layui-input"
                  readonly
                  name="locationCode"
                />
              </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
              <label class="layui-form-label">SKU</label>
              <div class="layui-input-block" style="display:flex;">
                <input
                  type="text"
                  class="layui-input"
                  readonly
                  name="sku"
                  style="font-size: 35px;border:none;"
                />
                <span
                  class="layui-btn layui-btn-sm layui-btn-normal ml20"
                  id="distributeContainerForm_printSku"
                  title="打印商品标签"
                  >打印</span
                >
              </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
              <label class="layui-form-label">库存数量</label>
              <div class="layui-input-block">
                <input
                  type="text"
                  class="layui-input"
                  readonly
                  name="stockNum"
                />
              </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
              <label class="layui-form-label">扫描SKU</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" name="scanningSku" />
              </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
              <label class="layui-form-label">实拣数量</label>
              <div class="layui-input-block" style="display:flex;">
                <input
                  type="text"
                  class="layui-input"
                  style="margin-right:20px;"
                  name="actualNum"
                />
                <span
                  class="layui-btn layui-btn-sm layui-btn-normal"
                  id="waittopack_pickSuccessBtn"
                  >配货完成</span
                >
                <span
                  class="layui-btn layui-btn-sm layui-btn-normal"
                  id="waittopack_lackProdWaitBtn"
                  >缺货待检</span
                >
              </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
              <label class="layui-form-label">应拣数量</label>
              <div
                class="layui-input-block"
                style="display:flex;justify-content:space-around;"
              >
                <div
                  style="font-size:60px;color: #ff0000;"
                  class="shouldPickNum"
                ></div>
                <div class="unit"></div>
                <div
                  class="boxContainBag"
                  style="font-size:49px;color: #000;"
                ></div>
                <div
                  class="boxContain"
                  style="font-size:60px;color: #02a7f0;"
                ></div>
              </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
              <div class="layui-input-block">
                <img
                  class="distribute_img b1 img_show_hide"
                  width="250"
                  height="250"
                  onerror="errorImgHandle(event)"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>
<%-- 弹框-配货---渲染tbody --%>
<script type="text/html" id="distributeContainer_tableTbodyTpl">
  {{# if(d.length === 0){ }}
  <td colspan="9">暂无数据</td>
  {{# }else{ }} {{# layui.each(d, function(index, item){ }} {{# if(index == 0){
  }}
  <tr
    data-info="{sku: '{{item.sku}}',
                        stockNum:{{item.stockNum}},
                        pickNum:{{item.pickNum}},
                        skuNum:{{item.skuNum}},
                        needBag: {{item.needBag}},
                        locationCode: '{{item.locationCode}}',
                        imageUrl: '{{item.imageUrl}}',
                        unit: '{{item.unit}}',
                    }"
    batchDetails='{{JSON.stringify(item.batchDetails)}}'
    class="selectTr unHandledTr"
  >
    {{# }else{ }}
  </tr>

  <tr
    data-info="{sku: '{{item.sku}}',
                        stockNum:{{item.stockNum}},
                        pickNum: {{item.pickNum}},
                        skuNum:{{item.skuNum}},
                        needBag: {{item.needBag}},
                        locationCode: '{{item.locationCode}}',
                        imageUrl: '{{item.imageUrl}}',
                        unit: '{{item.unit}}'
                    }"
    batchDetails='{{JSON.stringify(item.batchDetails)}}'
    class="unHandledTr"
  >
    {{# } }}
    <td class="td5">
      {{index+1}}
      <input
        type="hidden"
        name="batchDetails"
        value='{{JSON.stringify(item.batchDetails)}}'
      />
    </td>
    <td class="td35">
      <span class="pora copySpan">
        <a class="waittopack-setBigFont">{{item.sku || ''}}</a>
        <button
          class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
          onclick="layui.admin.copyTxt(this,event)"
        >
          复制
        </button>
      </span>
      <span class="waittopack_packageProdName"
        >{{item.purchaseChannel || ''}}</span
      >
    </td>
    <%--
    <td>{{item.purchaseChannel}}</td>
    --%>
    <td class="td20">
      <div class="waittopack-setBigFont">{{item.locationCode || ''}}</div>
    </td>
    <td class="td10">
      <div class="waittopack-setBigFont">{{item.skuNum || ''}}</div>
    </td>
    <td class="pickNum td10">{{item.pickNum || ''}}</td>
    <td class="td10">{{item.stockNum || ''}}</td>
    <%--
    <td>{{(item.skuNum ==item.pickNum) ? '是': '否' }}</td>
    --%>
    <td class="td10">{{item.needBag ? '是': ''}}</td>
  </tr>
  {{# }) }} {{# } }}
</script>

<%-- 弹框--设置分拣批次 --%>
<script type="text/html" id="waittopack_setLayer">
  <div class="layui-col-lg12 layui-col-md12">
    <div class="layui-card">
      <div class="layui-card-body">
        <form class="layui-form">
          <div class="layui-form-item">
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">仓库</label>
              <div class="layui-input-block">
                <select
                  name="warehouseId"
                  lay-search
                  lay-filter="waittopack_setWarehouseId"
                  id="waittopack_prodWarehousesLayer"
                >
                  <option value="1">昆山仓</option>
                </select>
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">楼栋</label>
              <div class="layui-input-block">
                <select
                  name="buildingNo"
                  id="waittopack_buildingNo"
                  lay-filter="buildingNo"
                  xm-select="xm_waittopack_buildingNo"
                  xm-select-search
                  xm-select-search-type="dl"
                  xm-select-skin="normal"
                ></select>
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">楼层</label>
              <div class="layui-input-block">
                <select
                  name="floorNo"
                  id="waittopack_floorNo"
                  lay-filter="floorNo"
                  xm-select="xm_waittopack_floorNo"
                  xm-select-search
                  xm-select-search-type="dl"
                  xm-select-skin="normal"
                >
                  <option value="">请选择</option>
                </select>
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">平台</label>
              <div class="layui-input-block">
                <select
                  name="platCode"
                  lay-search
                  lay-filter="platCode"
                  id="waittopack_platCodeLayer"
                ></select>
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">物流方式集</label>
              <div class="layui-input-block">
                <select
                  name="logisCollectionIds"
                  lay-search
                  lay-filter="logisCollectionIds"
                  id="waittopack_logisCollectionIdsLayer"
                ></select>
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">物流方式</label>
              <div class="layui-input-block">
                <select
                  name="logisTypeIds"
                  lay-filter="logisTypeIds"
                  id="waittopack_logisTypeIdsLayer"
                  xm-select="xm_waittopack_logisTypeIdsLayer"
                  xm-select-search
                  xm-select-search-type="dl"
                  xm-select-skin="normal"
                ></select>
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">订单编号</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" name="platOrderIds" />
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">订单天数</label>
              <div class="layui-input-block dis_flex_space">
                <input
                  type="number"
                  name="delayMin"
                  class="layui-input"
                  min="0"
                />
                <span>&nbsp;~&nbsp;</span>
                <input
                  type="number"
                  name="delayMax"
                  class="layui-input"
                  min="0"
                />
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">订单类型</label>
              <div class="layui-input-block">
                <select
                  name="orderType"
                  lay-search
                  lay-filter="waittopack_setLayer_orderType"
                >
                  <option value="0">单品</option>
                  <option value="1">多品</option>
                  <option value="2">订单编号</option>
                </select>
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">SKU种类</label>
              <div class="layui-input-block dis_flex_space">
                <input
                  type="number"
                  name="skuNumMin"
                  class="layui-input"
                  min="0"
                />
                <span>&nbsp;~&nbsp;</span>
                <input
                  type="number"
                  name="skuNumMax"
                  class="layui-input"
                  min="0"
                />
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">订单数量</label>
              <div class="layui-input-block">
                <input
                  type="text"
                  class="layui-input"
                  name="orderNum"
                  value="100000"
                />
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <div class="layui-input-block" style="display:flex;">
                <input
                  type="checkbox"
                  name="urgent"
                  title="紧急批次"
                  lay-skin="primary"
                />
                <input
                  type="checkbox"
                  name="sameArea"
                  title="同一通道订单"
                  lay-skin="primary"
                  disabled
                />
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <label class="layui-form-label">设置拣货人</label>
              <div class="layui-input-block">
                <select
                  name="pickUserId"
                  lay-search
                  lay-filter="pickUserId"
                  id="waittopack_pickUserIdLayer"
                >
                  <option value="assignPickUser">按指定规则</option>
                </select>
              </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3 pl20">
              <span
                class="layui-btn layui-btn-sm"
                lay-submit
                lay-filter="waittopackSearch_set"
              >
                生成分拣单
              </span>
              <span
                class="layui-btn layui-btn-sm layui-btn-primary"
                id="waittopackSearch_export"
              >
                导出未生成订单
              </span>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
              <div class="layui-input-block"></div>
            </div>
            <div class="layui-col-lg3 layui-col-md3" style="display:flex;">
              <div class="layui-input-block">
                <select
                  id="waittopack_selectpolicy"
                  xm-select="waittopack_selectpolicy"
                  xm-select-search
                  xm-select-search-type="dl"
                  xm-select-skin="normal"
                >
                  <option value="">选择策略</option>
                </select>
              </div>
              <span
                class="layui-btn layui-btn-sm layui-btn-normal"
                style="margin-left:5px;"
                id="waittopack_basicAsPolicyBtn"
                >按批次策略生成分拣单</span
              >
            </div>
            <div class="layui-form-item">
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">分拣单号</label>
                <div
                  class="layui-input-block"
                  style="display:flex;justify-content: space-between;"
                >
                  <input
                    type="text"
                    name="enterSortOrderNumber"
                    id="enterSortOrderNumber"
                    class="layui-input"
                    style="position:absolute;z-index:2;width:80%;"
                    placeholder="请选择"
                    autocomplete="off"
                  />
                  <div style="flex:auto">
                    <select
                      name="batchNo"
                      lay-search
                      lay-filter="batchNo"
                      id="waittopack_batchNoLayer"
                    ></select>
                  </div>

                  <i
                    class="layui-icon layui-icon-refresh layui-icon-layer"
                    id="waittopack_batchNoLayerIcon"
                  ></i>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">篮号</label>
                <div style="display: flex;">
                  <div
                    class="layui-input-block"
                    style="margin-left: 0;margin-right:0;flex:auto"
                  >
                    <select
                      name="basketNO"
                      id="waittopack_basketNO"
                      lay-filter="floorNo"
                      xm-select="xm_waittopack_basketNO"
                      xm-select-search
                      xm-select-search-type="dl"
                      xm-select-skin="normal"
                    >
                      <option value="">请选择</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">配货区号</label>
                <div class="layui-input-block">
                  <select
                    name="locationCodeInitials"
                    id="waittopack_locationCodeInitials"
                    lay-filter="logisTypeIds"
                    xm-select="xm_waittopack_locationCodeInitials"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <div
                  class="layui-input-block"
                  style="display:flex;justify-content:right"
                >
                  <span
                    class="layui-btn layui-btn-sm"
                    id="waittopack_set_batchNo"
                    style="margin-left:20px"
                    >查询</span
                  >
                  <span class="layui-btn layui-btn-sm" id="print_packingNo"
                    >打印配货单</span
                  >
                  <span class="layui-btn layui-btn-sm" id="print_logisticsNo"
                    >打印物流面单</span
                  >
                  <span class="layui-btn layui-btn-sm" id="print_logisticsSKUNo"
                    >打印物流面单（含SKU）</span
                  >
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="layui-card" style="margin-top:20px;">
      <div class="layui-card-body" id="waittopack_setLayer_page">
        <table
          class="layui-table"
          lay-filter="waittopack_set_table"
          id="waittopack_set_table"
        ></table>
      </div>
    </div>
  </div>
</script>

<%-- 弹框-拣货完成按钮提示 --%>
<script type="text/html" id="pickSuccessLayer">
  <div
    id="pickSuccessLayerContainer"
    style="padding:20px;font-size:20px;"
  ></div>
</script>
<script type="text/html" id="pickSuccessLayerContainerTpl">
  应拣：{{d.skuNum}},实拣：{{d.pickNum}},{{d.skuNum > d.pickNum && d.pickNum !=
  0 ? '缺货状态下,' : ''}}只需要拣货<font size="15" color="#02a7f0"
    >{{d.newPickNum}}</font
  >, 请放回<font size="15" color="#f3adb6">{{d.returnNum}}</font>个商品!
</script>

<%-- 弹框--ebay取消订单原因展示 --%>
<script type="text/html" id="waittopackage_cancelEbayTpl">
  <form class="layui-form">
    <div class="p20">
      <div class="layui-form-item">
        <label class="layui-form-label">取消原因</label>
        <div class="layui-input-block">
          <input
            type="radio"
            checked
            name="cancelReason"
            value="BUYER_ASKED_CANCEL"
            title="买家要求取消"
          />
          <input
            type="radio"
            name="cancelReason"
            value="OUT_OF_STOCK_OR_CANNOT_FULFILL"
            title="缺货或不能发货"
          />
          <input type="radio" name="cancelReason" value="ADDRESS_ISSUES" title="买家地址问题" />
        </div>
      </div>
    </div>
  </form>
</script>

<%-- 弹框---单品包装 --%>
<script type="text/html" id="waittopack_singlePackageLayer">
  <div style="display:flex;">
    <div class="singlePackage_left" style="margin-top:37px;">
      <div
        class="singlePackage_left_title"
        style="display:flex;"
      >
        <div style="padding-left: 10px;">新增功能：双击重量数值即可修改</div>
        <div>
          <!-- <span class="layui-btn layui-btn-sm layui-btn-normal" id="singlePackage_printBtn">
                        打印面单
                    </span>
                    <span class="layui-btn layui-btn-sm layui-btn-danger" id="singlePackage_packageERemoveBtn">
                        驳回订单
                    </span> -->
          <span class="layui-btn layui-btn-sm layui-btn-danger" id="singlePackage_printTestBtn">
            打印测试页
          </span>
        </div>
      </div>
      <div class="singlePackage_left_container">
        <%-- 主表格 --%>
        <table class="layui-table" id="singlePackage_left_table">
          <thead>
            <tr>
              <th>
                <div class="layui-form">
                  <input
                    type="checkbox"
                    lay-skin="primary"
                    lay-filter="singlePackage_allChecked"
                  />
                </div>
              </th>
              <th>订单编号</th>
              <th>物流方式</th>
              <th>跟踪号</th>
              <th>国家/地区</th>
              <th>包裹重量(g)</th>
              <th>运费(￥)</th>
              <th>拣货人</th>
              <th>订单备注</th>
              <th>店铺名称</th>
            </tr>
          </thead>
          <tbody id="singlePackage_left_tbody"></tbody>
        </table>
        <%-- 中间层 --%>
        <div style="margin-top:20%;border-top:1px solid #ccc;"></div>
        <%-- 副表格 --%>
        <table class="layui-table" id="singlePackage_left_viceTable">
          <thead>
            <tr>
              <th>订单编号</th>
              <th>SKU</th>
              <th>商品名称</th>
              <th>款式</th>
              <th>平台数量</th>
              <th>商品数量</th>
              <th>实配数量</th>
              <th>单位</th>
              <!-- <th>预估重量(g)</th> -->
              <th>质检要求</th>
            </tr>
          </thead>
          <tbody id="singlePackage_left_viceTbody"></tbody>
        </table>
      </div>
    </div>
    <div class="singlePackage_right  layui-row">
      <form class="layui-form">
        <div class="layui-form-item" style="margin-left: -30px;">
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">批次号</label>
            <div class="layui-input-block">
              <div>
                <input
                  class="layui-input"
                  name="singlePackage_batchNo"
                  style="position: absolute;z-index: 2;width: 80%;"
                />
              </div>
              <select
                id="waittopack_singlePackage_batchNo_select"
                readonly
                lay-filter="singlePackage_batchNo_select"
              ></select>
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">扫描SKU</label>
            <div class="layui-input-block">
              <input
                type="text"
                name="singlePackage_scanSku"
                class="layui-input"
              />
            </div>
          </div>
          <input type="hidden" name="platOrderId" />
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">物品SKU</label>
            <div class="layui-input-block" style="display:flex;">
              <input type="text" class="layui-input" name="prodSku" />
              <input
                type="number"
                class="layui-input"
                name="prodSkuCount"
                style="width:80px;margin-left:10px;"
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">订单号</label>
            <div class="layui-input-block">
              <input
                type="text"
                class="layui-input"
                name="orderNumber"
                readonly
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">跟踪号</label>
            <div class="layui-input-block">
              <input
                type="text"
                class="layui-input"
                name="trackNumber"
                readonly
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">包裹重量(g)</label>
            <div class="layui-input-block">
              <input type="number" class="layui-input" name="packageWeight" />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-input-block">
              <input
                type="checkbox"
                name="printLogisSheet"
                title="打印物流面单"
                lay-skin="primary"
                checked
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-input-block">
              <input
                type="checkbox"
                name="combinationTips"
                title="组合品提示"
                lay-skin="primary"
              />
            </div>
          </div>
          <%--
          <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-input-block">
              <input
                type="checkbox"
                name="largeTwoWarn"
                title="大于2kg提醒"
                lay-skin="primary"
                checked
              />
            </div>
          </div>
          --%>
          <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-input-block">
              <img
                class="singlePackage_img b1 img_show_hide"
                width="250"
                height="250"
                onerror="errorImgHandle(event)"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<%-- 弹框--多品包装 --%>
<script type="text/html" id="waittopack_multiPackageLayer">
  <div>
    <div
      class="multiPackage_left"
      style="margin-top:37px;width: calc(100% - 480px);"
    >
      <div
        class="multiPackage_left_title"
        style="display:flex;"
      >
        <div style="padding-left: 10px;">新增功能：双击重量数值即可修改</div>
        <div>
          <span class="layui-btn layui-btn-sm layui-btn-danger" id="multiPackage_packagePrintTestBtn">
            打印测试页
        </span>
          <!-- <span class="layui-btn layui-btn-sm layui-btn-normal" id="multiPackage_printBtn">打印面单</span>
                    <span class="layui-btn layui-btn-sm layui-btn-danger" id="multiPackage_packageRemoveBtn">
                        驳回订单
                    </span> -->
          <permTag:perm funcCode="multiPackage_completeBtn_PermTag">
            <span class="layui-btn layui-btn-sm layui-btn-normal" id="multiPackage_completeBtn">包装完成</span>
          </permTag:perm>
        </div>
      </div>
      <div class="multiPackage_left_container">
        <%-- 主表格 --%>
        <table class="layui-table" id="multiPackage_left_table">
          <thead>
            <tr>
              <th>
                <div class="layui-form">
                  <input
                    type="checkbox"
                    lay-skin="primary"
                    lay-filter="multiPackage_allChecked"
                  />
                </div>
              </th>
              <th>订单编号</th>
              <th>物流方式</th>
              <th>跟踪号</th>
              <th>国家/地区</th>
              <th>包裹重量(g)</th>
              <th>运费(￥)</th>
              <th>订单备注</th>
              <th>店铺名称</th>
              <th>商品数量</th>
            </tr>
          </thead>
          <tbody id="multiPackage_left_tbody"></tbody>
        </table>
        <%-- 中间层 --%>
        <div style="margin-top:20%;border-top:1px solid #ccc;"></div>
        <%-- 辅助表格 --%>
        <table class="layui-table" id="multiPackage_left_viceTable">
          <thead>
            <tr>
              <th>图片</th>
              <th>SKU</th>
              <th>商品名称</th>
              <th>款式</th>
              <th>平台数量</th>
              <th>商品数量</th>
              <th>实配数量</th>
              <th>单位</th>
              <th>拣货人</th>
              <th>累计净重(g)</th>
              <th>是否非标品</th>
              <permTag:perm
                funcCode="multiPackage_left_viceTbody_weight_PermTag"
              >
                <th>单个商品重量(g)</th>
              </permTag:perm>
            </tr>
          </thead>
          <tbody id="multiPackage_left_viceTbody"></tbody>
        </table>
      </div>
    </div>
    <div class="multiPackage_right layui-row">
      <form class="layui-form">
        <div
          class="layui-form-item"
          style="margin-left: -30px;font-size: 18px;padding: 0 5px;"
        >
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">扫描类型</label>
            <div class="layui-input-block">
              <input
                type="radio"
                name="queryType"
                value="1"
                title="订单编号或跟踪号"
                checked
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">扫描值</label>
            <div class="layui-input-block">
              <input type="text" class="layui-input" name="scanVal" />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <div style="display:flex;">
              <div style="display:flex;line-height: 32px;margin-left: 26px;">
                <input
                  type="checkbox"
                  lay-skin="primary"
                  title="跟踪号过滤"
                  name="trackNumFilter"
                />
                <div style="display:flex;">
                  <span>前</span>
                  <input
                    type="text"
                    class="layui-input"
                    name="trackNumFilterFront"
                    style="width:50px;margin:0 20px 0 8px;"
                  />
                </div>
                <div style="display:flex;">
                  <span>后</span>
                  <input
                    type="text"
                    class="layui-input"
                    name="trackNumFilterAfter"
                    style="width:50px;margin:0 20px 0 8px;"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <div style="display:flex;line-height: 32px;margin-left: 26px;">
                <input
                  type="checkbox"
                  lay-skin="primary"
                  title="跟踪号过滤[]"
                  name="trackNumFilterBrackets"
                />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">国家/地区</label>
            <div class="layui-input-block">
              <input
                type="text"
                class="layui-input"
                name="shippingCountry"
                readonly
              />
            </div>
          </div>
          <input type="hidden" name="orderId" />
          <input type="hidden" name="platOrderId" />
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">物流方式</label>
            <div class="layui-input-block">
              <input
                type="text"
                class="layui-input"
                name="logisticsTypeName"
                readonly
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">跟踪号</label>
            <div class="layui-input-block">
              <input
                type="text"
                class="layui-input"
                name="logisticsTrackingNo"
                readonly
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">包裹重量(g)</label>
            <div class="layui-input-block">
              <input type="number" class="layui-input" name="packageWeight" />
            </div>
          </div>
          <%--
          <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-input-block">
              <input
                type="checkbox"
                name="largeTwoWarn"
                title="大于2kg提醒"
                lay-skin="primary"
                checked
              />
            </div>
          </div>
          --%>
          <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-input-block">
              <input
                type="checkbox"
                name="isPrintOrder"
                title="是否打印面单"
                lay-skin="primary"
              />
            </div>
            <div class="layui-input-block">
              <input
                type="checkbox"
                name="combinationTips"
                title="组合品提示"
                lay-skin="primary"
              />
            </div>
          </div>
          
          <div style="position:absolute;bottom:0;">
            <div class="layui-col-md8 layui-col-lg8">
              <label class="layui-form-label">备注类型</label>
              <div class="layui-input-block">
                <select
                  name="multiPackage_right_remark"
                  id="multiPackage_right_remark"
                ></select>
              </div>
            </div>
            <div
              class="layui-col-md4 layui-col-lg4"
              style="text-align: center;"
            >
              <permTag:perm funcCode="multiPackage_right_remarkBtn_PermTag">
                <div
                  class="layui-btn layui-btn-sm"
                  id="multiPackage_right_remarkBtn"
                >
                  新增备注
                </div>
              </permTag:perm>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<%-- 弹框--多批次配货 --%>
<script type="text/html" id="waittopack_multiDistributeLayer">
  <div class="layui-card">
    <div class="layui-card-body">
      <form class="layui-form layui-row">
        <div class="layui-col-lg3 layui-col-md3">
          <div class="layui-form-item">
            <label class="layui-form-label">配货批次号</label>
            <div class="layui-input-block">
              <input type="text" class="layui-input" name="batchNo" />
            </div>
          </div>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
          <div class="layui-form-item">
            <label class="layui-form-label">汇总批次号</label>
            <div class="layui-input-block">
              <input type="text" class="layui-input" name="groupBatchNo" />
            </div>
          </div>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
          <div class="layui-form-item">
            <label class="layui-form-label">汇总时间</label>
            <div class="layui-input-block">
              <input
                type="text"
                class="layui-input"
                name="times"
                id="multiDistributeTimes"
              />
            </div>
          </div>
        </div>
        <input type="hidden" value="0" name="merged" />
        <div class="layui-col-lg3 layui-col-md3 pl20">
          <span
            class="layui-btn layui-btn-sm layui-btn-normal"
            id="multiDistribute_search"
            >查询</span
          >
        </div>
      </form>
    </div>
  </div>
  <div class="layui-card">
    <div class="fixHigh">
      <div class="layui-card-header">
        <div class="fixTab">
          <!-- 页签点击结构 -->
          <div
            class="layui-tab"
            lay-filter="multiDistribute_tabs"
            id="multiDistribute_tabs"
          >
            <ul class="layui-tab-title">
              <li class="layui-this">未汇总<span></span></li>
              <li>已汇总<span></span></li>
            </ul>
          </div>
          <div style="display:flex;">
            <div class="layui-form-item layui-form" style="margin-right:10px;">
              <label class="layui-form-label">设置拣货人</label>
              <div class="layui-input-block">
                <select id="multiDistribute_pickUserId" lay-search></select>
              </div>
            </div>
            <span
              class="layui-btn layui-btn-sm layui-btn-normal"
              id="multiDistribute_generateBtn"
            >
              生成汇总批次
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 下面放表格 -->
    <div class="layui-card-body">
      <table
        class="layui-table"
        id="multiDistribute_table"
        lay-filter="multiDistribute_tableFilter"
      ></table>
    </div>
  </div>
</script>
<%-- 弹框-多批次配货表格-汇总表格渲染 --%>
<script type="text/html" id="multiDistributeTable_detail">
  {{# if(d.pickBatches){ }}
  <table class="layui-table multiDistributeTable_colspantable">
    {{# layui.each(d.pickBatches, function(index, item){ }} {{# if(index <5){ }}
    {{# if(index ==d.pickBatches.length-1){ }}
    <tr>
      {{# }else{ }}
    </tr>

    <tr style="border-bottom: 1px solid #e6e6e6 !important">
      {{# } }} {{# }else{ }} {{# if(index ==d.pickBatches.length-1){ }}
    </tr>

    <tr class="myj-hide">
      {{# }else{ }}
    </tr>

    <tr style="border-bottom: 1px solid #e6e6e6 !important" class="myj-hide">
      {{# } }} {{# } }}
      <td style="width:100px">{{item.skuNum || ''}}</td>
      <td style="width:100px">{{item.prodNum || ''}}</td>
      <td style="width:70px">{{item.buildingNos || '' }}</td>
      <td style="width:70px">{{item.floorNos || ''}}</td>
      <td style="width:70px">{{item.caseNo || ''}}</td>
      <td></td>
    </tr>

    {{# }) }}
  </table>
  {{# if(d.pickBatches.length > 5){ }}
  <a
    href="javascript:"
    onclick="changeColspantable(this);"
    class="productListSkuShow"
    style="float:right;"
  >
    <span> + 展开</span>({{d.pickBatches.length}})
  </a>
  {{# } }} {{# } }}
</script>
<%-- 弹框-多批次配货表格-操作 --%>
<script type="text/html" id="multiDistributeTable_toolBar">
  <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="change"
    >变更拣货人</span
  >
</script>
<%-- 弹框--多批次配货表格-变更拣货人弹框 --%>
<script type="text/html" id="multiDistribute_table_pickerLayer">
  <div class="layui-form-item layui-form p20">
    <label class="layui-form-label">设置拣货人</label>
    <div class="layui-input-block">
      <select id="multiDistribute_pickUserIdLayer" lay-search></select>
    </div>
  </div>
</script>
<style>
  #waittopack_app .waittopack-accountNew {
    font-size: 26px;
  }
  #waittopack_app .waittopack-accountButton,
  #waittopack_multiPackageLayerId span {
    font-size: 22px;
    height: 30px;
    line-height: 30px;
  }
  #waittopack_app table th,
  #waittopack_app table td,
  #waittopack_multiPackageLayerId table td,
  #waittopack_multiPackageLayerId table th {
    font-size: 18px;
    text-align: center;
    color: #000;
  }
  #waittopack_app table th {
    font-size: 12px;
  }
  .mNine {
    margin: 20px 0;
  }
  .tranX25 {
    transform: translateX(25%);
  }
</style>
<%-- 弹框---多品投篮 --%>
<script type="text/html" id="waittopack_multiShotBasketballLayer">
  <div id="waittopack_app" style="padding:20px;font-size: 24px;">
    <div class="waittopack_app_left" style="margin-right:450px;">
      <div class="waittopack_app_header">
        <div>
          <input
            type="checkbox"
            id="printChecked"
            v-model.trim="printChecked"
          />
          <label for="printChecked">打印物流面单</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="verifyChecked"
            v-model.trim="verifyChecked"
          />
          <label for="verifyChecked">核完一单删一单</label>
        </div>
        <div
          style="margin-left: 30%;flex: 1;display: flex;justify-content: space-between;"
        >
          <div>
            <span>上次被核单: <strong>{{prevVerifyOrder}}</strong></span>
            <span>上次篮号:<strong>{{prevBasketNo}}</strong></span>
          </div>
          <div style="padding: 0 20px;">
            <button
              class="layui-btn layui-btn-normal layui-btn-xs waittopack-accountButton"
              id="waittopack_multiShotBasketball_progress"
            >
              配货进度
            </button>
          </div>
        </div>
      </div>
      <div class="waittopack_app_tableContainer">
        <%-- 订单信息表格 --%>
        <div class="waittopack_app_table">
          <div class="waittopack_app_table_header">
            <strong
              ><font size="3" class="waittopack-accountNew"
                >订单信息({{platOrderInfosLength}})</font
              ></strong
            >
            <span
              class="layui-btn layui-btn-xs layui-btn-normal waittopack-accountButton"
              @click="removeOrderHandle"
              >移除订单</span
            >
          </div>
          <table
            class="layui-table"
            style="table-layout:fixed; width:100%;"
            style="font-size: 28px;"
          >
            <thead>
              <tr>
                <th width="10">
                  <input
                    type="checkbox"
                    v-model="allChecked"
                    @change="handleAllCked"
                  />
                </th>
                <th width="50">单号</th>
                <th>跟踪号</th>
                <th>SKU明细</th>
                <th width="36">篮号</th>
                <th width="60">是否核完</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in platOrderInfos"
                :key="item.orderId"
                @dblclick="showProgress(item)"
              >
                <td width="10">
                  <input
                    type="checkbox"
                    :value="item.orderId"
                    v-model="checkedCellections"
                  />
                </td>
                <td width="50" class="orderNumTd">{{item.orderId}}</td>
                <td style="word-break: break-all;" class="orderNumTd">{{item.logisTrackingNo}}</td>
                <td style="word-break: break-all;">{{item.skuOverOv}}</td>
                <td width="36">{{item.basketNo}}</td>
                <td width="60">{{item.checked ? '是': '否'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <%-- 订单进度表格 --%>
        <div class="waittopack_app_table">
          <div class="waittopack_app_table_header">
            <strong
              ><font size="3" class="waittopack-accountNew"
                >订单进度</font
              ></strong
            >
          </div>
          <table class="layui-table">
            <thead>
              <tr>
                <th width="50">单号</th>
                <th>跟踪号</th>
                <th>商品SKU</th>
                <th width="40">总数量</th>
                <th width="30">实配</th>
                <th width="30">已投</th>
                <th width="30">未投</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderProgressInfos" :key="item.id">
                <td width="50" class="orderNumTd">{{item.orderId}}</td>
                <td style="word-break: break-all;" class="orderNumTd">{{item.logisTrackingNo}}</td>
                <td style="word-break: break-all;">{{item.sku}}</td>
                <td width="40">{{item.skuNum}}</td>
                <td width="30">{{item.pickNum}}</td>
                <td width="30" :class="{'waittopack-hasBasketNumBg': item.checkNum>0}">
                  {{item.checkNum}}
                </td>
                <td width="30">{{item.pickNum-item.checkNum}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <%-- 未投篮SKU --%>
        <div class="waittopack_app_table">
          <div class="waittopack_app_table_header">
            <strong
              ><font size="3" class="waittopack-accountNew"
                >未投篮SKU({{unCheckedOrderSkuInfosLength}})</font
              ></strong
            >
            <span
              class="layui-btn layui-btn-xs layui-btn-normal waittopack-accountButton"
              @click="viewOrderHandle"
              >查看</span
            >
            <span
              class="layui-btn layui-btn-xs layui-btn-normal waittopack-accountButton"
              @click="markReduceHandle"
              >标记少货</span
            >
          </div>
          <table class="layui-table">
            <thead>
              <tr>
                <th width="50">单号</th>
                <%--
                <th>跟踪号</th>
                --%>
                <th>库位</th>
                <th>商品SKU</th>
                <th width="40">总数量</th>
                <th width="40">实配</th>
                <th width="40">已投</th>
                <th width="30">篮号</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in unCheckedOrderSkuInfos" :key="item.orderId">
                <td width="50" class="orderNumTd">{{item.orderId}}</td>
                <%--
                <td style="word-break: break-all;">{{item.logisTrackingNo}}</td>
                --%>
                <td style="word-break: break-all;">{{item.locationCode}}</td>
                <td style="word-break: break-all;">{{item.sku}}</td>
                <td width="40">{{item.skuNum}}</td>
                <td width="40">{{item.pickNum}}</td>
                <td width="40">{{item.checkNum}}</td>
                <td width="30">{{item.basketNo}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <%-- 已投篮SKU --%>
        <div class="waittopack_app_table">
          <div class="waittopack_app_table_header">
            <strong
              ><font size="3" class="waittopack-accountNew"
                >已投篮SKU({{checkedOrderSkuInfosLength}})</font
              ></strong
            >
          </div>
          <table class="layui-table">
            <thead>
              <tr>
                <th width="50">单号</th>
                <th>跟踪号</th>
                <th>商品SKU</th>
                <th width="40">总数量</th>
                <th width="40">实配</th>
                <th width="40">已投</th>
                <th width="50">篮号</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in checkedOrderSkuInfos" :key="item.orderId">
                <td width="50" class="orderNumTd">{{item.orderId}}</td>
                <td style="word-break: break-all;" class="orderNumTd">{{item.logisTrackingNo}}</td>
                <td style="word-break: break-all;">{{item.sku}}</td>
                <td width="40">{{item.skuNum}}</td>
                <td width="40">{{item.pickNum}}</td>
                <td width="40">{{item.checkNum}}</td>
                <td width="50">{{item.basketNo}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="waittopack_app_right">
      <form class="layui-form">
        <div class="layui-form-item" style="margin-left: -30px;">
          <div class="layui-col-md12 layui-col-lg12 mNine">
            <label class="layui-form-label">批次号</label>
            <div class="layui-input-block">
              <input
                type="text"
                class="layui-input"
                v-model.trim="sizeForm.batchNo"
                name="batchNo"
                @keyup.enter="batchNoEnterHandle"
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12 mNine">
            <label class="layui-form-label">SKU</label>
            <div class="layui-input-block" style="display:flex;">
              <input
                type="text"
                class="layui-input"
                v-model.trim="sizeForm.sku"
                name="sku"
                ref="sku"
                @keyup.enter="skuEnterHandle"
              />
              <input
                type="number"
                class="layui-input"
                name="skuNum"
                v-model.trim="sizeForm.skuNum"
                ref="skuNum"
                min="0"
                @keyup.enter="skuNumEnterHandle"
                style="width:50px;margin-left:10px;"
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12 mNine">
            <label class="layui-form-label">篮号</label>

            <div class="layui-input-block hlh100 tranX25">
              {{sizeForm.basketNo || '无'}}
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12 mNine ">
            <label class="layui-form-label">数量</label>
            <div
              class="layui-input-block hlh100 tranX25"
              style="color:#ff0000;"
            >
              {{sizeForm.number || 0 }}
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12 mNine">
            <label class="layui-form-label">单位</label>
            <div
              class="layui-input-block hlh100 tranX25"
              style="color:#ff0000;"
            >
              {{sizeForm.unit || 0}}
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>
<%-- 弹框--多品投篮-标记少货弹框 --%>
<script type="text/html" id="waittopack_multiShotBasketballLayer_markReduce">
  <div id="waittopack_multiShotBasketballLayer_markReduceContainer"></div>
</script>
<script
  type="text/html"
  id="waittopack_multiShotBasketballLayer_markReduceContainerTpl"
>
  <div style="padding:20px;">
    <table class="layui-table">
      <thead>
        <tr>
          <th>订单编号</th>
          <th>SKU</th>
          <th>少货数量</th>
          <th>原箱号</th>
          <th>新箱号</th>
        </tr>
      </thead>
      <tbody>
        {{# layui.each(d, function(index, item){ }}
        <tr>
          <td>{{item.orderId}}</td>
          <td>{{item.sSku}}</td>
          <td>{{item.skuNum}}</td>
          <td><span class="tdGrow">{{item.oldBasketNo}}</span></td>
          <td><span class="tdGrow">{{item.basketNo}}</span></td>
        </tr>
        {{# }) }}
      </tbody>
    </table>
  </div>
</script>

<%-- 弹框--少货投篮 --%>
<script type="text/html" id="waittopack_lackShotBasketballLayer">
  <div id="waittopack_lackApp" style="padding:20px;">
    <div class="waittopack_app_left" style="margin-right:450px;">
      <div class="waittopack_app_header">
        <div>
          <input
            type="checkbox"
            id="printChecked"
            v-model.trim="printChecked"
          />
          <label for="printChecked">打印物流面单</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="verifyChecked"
            v-model.trim="verifyChecked"
          />
          <label for="verifyChecked">核完一单删一单</label>
        </div>
        <div style="margin-left: 30%;">
          <span>上次被核单:<strong>{{prevVerifyOrder}}</strong></span>
          <span>上次篮号:<strong>{{prevBasketNo}}</strong></span>
        </div>
      </div>
      <div class="waittopack_app_tableContainer">
        <%-- 订单信息表格 --%>
        <div class="waittopack_app_table">
          <div class="waittopack_app_table_header">
            <strong><font size="3">订单信息</font></strong>
            <span
              class="layui-btn layui-btn-sm layui-btn-normal"
              @click="removeOrderHandle"
              >移除订单</span
            >
          </div>
          <table class="layui-table">
            <thead>
              <tr>
                <th width="10">
                  <input
                    type="checkbox"
                    v-model="allChecked"
                    @change="handleAllCked"
                  />
                </th>
                <th width="50">单号</th>
                <th>SKU明细</th>
                <th width="36">篮号</th>
                <th width="60">是否核完</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in platOrderInfos" :key="item.orderId">
                <td width="10">
                  <input
                    type="checkbox"
                    :value="item.orderId"
                    v-model="checkedCellections"
                  />
                </td>
                <td width="50">{{item.orderId}}</td>
                <td>{{item.skuOverOv}}</td>
                <td width="36">{{item.basketNo}}</td>
                <td width="60">{{item.checked ? '是': '否'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <%-- 订单进度表格 --%>
        <div class="waittopack_app_table">
          <div class="waittopack_app_table_header">
            <strong><font size="3">订单进度</font></strong>
          </div>
          <table class="layui-table">
            <thead>
              <tr>
                <th width="50">单号</th>
                <th>商品SKU</th>
                <th>已投篮数</th>
                <th>未投篮数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderProgressInfos" :key="item.id">
                <td width="50" class="orderNumTd">{{item.orderId}}</td>
                <td>{{item.sku}}</td>
                <td :class="{'waittopack-hasBasketNumBg': item.checkNum>0}">
                  {{item.checkNum}}
                </td>
                <td>{{item.skuNum-item.checkNum}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <%-- 未投篮SKU --%>
        <div class="waittopack_app_table">
          <div class="waittopack_app_table_header">
            <strong><font size="3">未投篮SKU</font></strong>
          </div>
          <table class="layui-table">
            <thead>
              <tr>
                <th width="50">单号</th>
                <th>库位</th>
                <th>商品SKU</th>
                <th width="40">总数量</th>
                <th width="60">已投数量</th>
                <th width="40">篮号</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in unCheckedOrderSkuInfos" :key="item.orderId">
                <td width="50" class="orderNumTd">{{item.orderId}}</td>
                <td style="word-break: break-all;">{{item.locationCode}}</td>
                <td style="word-break: break-all;">{{item.sku}}</td>
                <td width="40">{{item.skuNum}}</td>
                <td width="60">{{item.checkNum}}</td>
                <td width="40">{{item.basketNo}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <%-- 已投篮SKU --%>
        <div class="waittopack_app_table">
          <div class="waittopack_app_table_header">
            <strong><font size="3">已投篮SKU</font></strong>
          </div>
          <table class="layui-table">
            <thead>
              <tr>
                <th>单号</th>
                <th>商品SKU</th>
                <th>总数量</th>
                <th>已投数量</th>
                <th>篮号</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in checkedOrderSkuInfos" :key="item.orderId">
                <td>{{item.orderId}}</td>
                <td>{{item.sku}}</td>
                <td>{{item.skuNum}}</td>
                <td>{{item.checkNum}}</td>
                <td>{{item.basketNo}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="waittopack_app_right">
      <form class="layui-form">
        <div class="layui-form-item" style="margin-left: -30px;">
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">缺货日期</label>
            <div class="layui-input-block">
              <input
                type="text"
                class="layui-input"
                ref="date"
                id="lackShotBasketball_times"
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">仓库</label>
            <div
              class="layui-input-block"
              style="display:flex;justify-content: space-between;"
            >
              <div style="flex:1;">
                <select
                  name="warehouse"
                  id="lackShotBasketball_warehouse"
                  ref="warehouse"
                  lay-search
                  lay-filter="lackShotBasketball_warehouse"
                ></select>
              </div>
              <i
                class="layui-icon layui-icon-refresh layui-icon-layer"
                style="width:30px;"
                id="waittopack_lackGoodsIcon"
              ></i>
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">SKU</label>
            <div class="layui-input-block" style="display:flex;">
              <input
                type="text"
                class="layui-input"
                v-model.trim="lackForm.sku"
                name="sku"
                ref="sku"
                @keyup.enter="skuEnterHandle"
              />
              <input
                type="number"
                class="layui-input"
                name="skuNum"
                v-model.trim="lackForm.skuNum"
                ref="skuNum"
                min="0"
                @keyup.enter="skuNumEnterHandle"
                style="width:50px;margin-left:10px;"
              />
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label">篮号</label>

            <div class="layui-input-block hlh100">
              {{lackForm.basketNo || '无'}}
            </div>
          </div>
          <div class="layui-col-md6 layui-col-lg6">
            <label class="layui-form-label">数量</label>
            <div class="layui-input-block hlh100" style="color:#ff0000;">
              {{lackForm.number || 0 }}
            </div>
          </div>
          <div class="layui-col-md6 layui-col-lg6">
            <label class="layui-form-label">单位</label>
            <div class="layui-input-block hlh100" style="color:#ff0000;">
              {{lackForm.unit || 0}}
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<%-- 弹框--多品缺货处理 --%>
<script type="text/html" id="waittopack_multiNoProdLayer">
  <div class="layui-row" style="padding:20px;">
    <%-- 搜索条件 --%>
    <div class="layui-card">
      <div class="layui-card-body">
        <div class="layui-form">
          <label class="layui-form-label" style="width:110px;"
            >订单编号或跟踪号</label
          >
          <div class="layui-input-block" style="margin-left:140px;">
            <input
              type="text"
              class="layui-input"
              style="width:300px;"
              name="orderOrTrackId"
              placeholder="一次一个,多个无效"
            />
          </div>
        </div>
      </div>
    </div>
    <%-- 按钮操作 --%>
    <div class="layui-card">
      <div class="layui-card-header" style="text-align:right;">
        <span
          class="layui-btn layui-btn-sm layui-btn-normal"
          id="waittopack_multiNoProdCancel"
          >取消订单</span
        >
        <span
          class="layui-btn layui-btn-sm layui-btn-normal"
          id="waittopack_multiNoProdTrans"
          >转待审核</span
        >
        <span
          class="layui-btn layui-btn-sm layui-btn-normal"
          id="waittopack_multiNoProdNormal"
          >正常发货</span
        >
      </div>
      <div
        class="layui-card-body"
        id="waittopack_multiNoProdLayerContainer"
      ></div>
    </div>
  </div>
</script>
<script type="text/html" id="waittopack_multiNoProdLayerContainerTpl">
  <%-- 表单 --%>
  <div
    class="layui-form layui-col-lg12 layui-col-md12"
    style="margin-left:-40px;"
  >
    <div class="layui-form-item">
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">订单编号</label>
        <div class="layui-input-block">
          <input type="text" class="layui-input" name="id" readonly value="{{d.id}}" />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">店铺单号</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.platOrderId}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">店铺</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.storeAcct}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">站点</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.siteName}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">订单北京时间</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{Format(d.orderTimeCn,'yyyy-MM-dd hh:mm:ss')}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">交易ID</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.platTransactionId}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">币种</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.platFeeCurrency}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">订单金额</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.platOrderAmt}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">出货仓库</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.warehouseName}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">物流方式</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.logisTypeName || '暂无'}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">跟踪号</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.logisTrackingNo }}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">买家指定物流</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.buyerRequireShippingType}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">卖家邮箱</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.sellerEmail}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">买家邮箱</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.buyerEmail}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">买家ID</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.buyerUserId}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">收件人</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.shippingUsername}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">收件人电话</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.shippingPhoneNumber}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">收件人邮编</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.shippingZip}}"
          />
        </div>
      </div>
      <div class="layui-col-lg3 layui-col-md3">
        <label class="layui-form-label">地址1</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.shippingStreet1}}"
          />
        </div>
      </div>
      <div class="layui-col-lg3 layui-col-md3">
        <label class="layui-form-label">地址2</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.shippingStreet2}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">城市</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.shippingCity}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">州/省</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.shippingState}}"
          />
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <label class="layui-form-label">国家/地区</label>
        <div class="layui-input-block">
          <input
            type="text"
            class="layui-input"
            readonly
            value="{{d.shippingCountryCode}}"
          />
        </div>
      </div>
    </div>
  </div>
  <%-- 表格 --%>
  <div>
    <table class="layui-table">
      <thead>
        <tr>
          <th>图片</th>
          <th>ListingID</th>
          <th>店铺SKU</th>
          <th>商品SKU</th>
          <th>库位</th>
          <th>商品名称</th>
          <th>入库要求</th>
          <th>款式</th>
          <th>可用库存</th>
          <th>商品成本(¥)</th>
          <th>净重(g)</th>
          <th>报关信息</th>
          <%--
          <th>销售单价</th>
          --%>
          <th>商品数量</th>
          <th>销售金额</th>
          <th>少货数量</th>
        </tr>
      </thead>
      <tbody>
        {{# if(d.orderDetails.length>0){ }} {{# layui.each(d.orderDetails,
        function(index, item){ }}
        <tr>
          <td>
            <img
              class="b1 img_show_hide"
              width="60"
              height="60"
              src="{{item.imageUrl}}"
              onerror="layui.admin.img_noFind()"
            />
          </td>
          <td>{{item.itemId || ''}}</td>
          <td>{{item.storeSSku || ''}}</td>
          <td>{{item.prodSSku || ''}}</td>
          <td>{{item.stockLocation || ''}}</td>
          <td>{{item.prodTitle || ''}}</td>
          <td></td>
          <%-- 入库要求 --%>
          <td>{{item.style || ''}}</td>
          <td>{{item.availableStock || ''}}</td>
          <td>{{item.prodUnitCost || ''}}</td>
          <td>{{item.prodUnitWeight || ''}}</td>
          <%-- 报关信息 --%>
          <td>{{item.packDesc || ''}}</td>
          <%--
          <td>{{item.platUnitPrice}}</td>
          --%>
          <td>{{item.prodQuantity || ''}}</td>
          <td>{{item.platOrderDetailAmt || ''}}</td>
          <td>
            <div
              class="{{item.skuNum - item.checkNum > 0? 'multiNoProdRed': '' }}"
            >
              {{item.skuNum - item.checkNum > 0 ? item.skuNum - item.checkNum:
              0}}
            </div>
          </td>
        </tr>
        {{# }); }} {{# }else{ }}
        <tr>
          <td colspan="15">暂无数据</td>
        </tr>
        {{# } }}
      </tbody>
    </table>
  </div>
</script>

<!-- 配货进度 -->
<script type="text/html" id="waittopack_multiShotBasketball_progressTpl">
  <div class="layui-card">
    <div class="layui-card-body">
      <table
        id="waittopack_multiShotBasketball_progressTable"
        class="layui-table"
      ></table>
    </div>
  </div>
</script>

<!-- 订单进度弹窗 -->
<script type="text/html" id="waittopack_order_progressTpl">
  <div class="layui-card">
    <div class="layui-card-body">
      <table class="layui-table" id="waittopack_order_progress_table"></table>
    </div>
  </div>
</script>

<!-- 渲染多品包装附表 -->
<script type="text/html" id="multiPackage_left_viceTbodyTpl">
  {{# layui.each(d, function(index, item){ }}
  <tr class="{{item.orderId}}Vice">
    <td>
      <img
        class="singlePackage_img b1 img_show_hide"
        width="100"
        height="100"
        src="{{item.image}}"
        onerror="layui.admin.img_noFind()"
      />
    </td>
    <td class="detailSku">
      <div>商品: <span class="sSku">{{item.detailSku || ""}}</span></div>
      <div>店铺: {{item.detailStoreSku || ''}}</div>
    </td>
    <td>{{item.productName || ""}}</td>
    <td>{{item.style || ""}}</td>
    <td>{{item.platQuantity || ""}}</td>
    <td>{{item.skuNumber || ""}}</td>
    <td>{{item.shipNumber || ""}}</td>
    {{# if(['个','件','条', '盒'].includes(item.unit)){ }}
    <td style="width: 60px">{{item.unit || ""}}</td>
    {{# }else{ }}
    <td class="unit" style="width: 60px">{{item.unit || ""}}</td>
    {{# } }}
    <td>{{item.pickUserName || ""}}</td>
    <td>{{item.suttleWeight * item.shipNumber || ""}}</td>
<%--    <td>--%>
<%--      {{# if(item.ifNeedQualityCheck){ }}--%>
<%--      <span--%>
<%--        class="layui-btn layui-btn-sm layui-btn-normal"--%>
<%--        onclick="showQualityCheckHandle(this)"--%>
<%--        >是</span--%>
<%--      >--%>
<%--      {{# } }}--%>
<%--      <input type="hidden" value='{{item.qualityCheckRqmt || ""}}' />--%>
<%--    </td>--%>
    <td>
      {{# if(item.ifNotStandardGoods == true){ }}
      <font size="6" color="red"><b>是</b></font>
      {{# } else if(item.ifNotStandardGoods == false){ }}
      否
      {{# } }}
      <input type="hidden" value='{{item.qualityCheckRqmt || ""}}' />
    </td>
    <permTag:perm funcCode="multiPackage_left_viceTbody_weight_PermTag">
      <td class="viceWeight">
        <span>{{item.suttleWeight}}</span>
      </td>
    </permTag:perm>
  </tr>
  {{# }) }}
</script>

<%-- 权限问题---wish退款 --%>
<script type="text/html" id="waittopackage_btnPermTag_wish">
  <permTag:perm funcCode="waittopackage_wishBtnPermTag">
    <button name="waittopackage_wishBtn" class="layui-btn layui-btn-xs">wish退款</button>
  </permTag:perm>
</script>
<%-- 权限问题---修改订单 --%>
<script type="text/html" id="waittopack_btnPermTag_lazada">
  <permTag:perm funcCode="waittopack_lazadaBtnPermTag">
    <button name="waittopack_lazadaBtn" class="layui-btn layui-btn-xs">
      lazada拆单
    </button>
  </permTag:perm>
</script>
<%-- 权限问题---拆分订单 --%>
<script type="text/html" id="waittopack_splitPermTag_allTag">
  <permTag:perm funcCode="waittopack_splitBtnPermTag">
  <button name="waittopack_splitBtn" class="layui-btn layui-btn-xs" type="button">
    拆分订单
  </button>
  </permTag:perm>
</script>
<%-- 弹框--拆分订单 --%>
<script type="text/html" id="pop_waittopack_demolition_original">
  <div class="mg_50">
      <div>
        <strong><font color="red" size="4">多个一买和组合品,所拆出的部分商品会影响线上发货,请谨慎拆分!</font></strong>
      </div>
      <div class="layui-form fixRight">
          <input type="radio" name="waittopack_demo_original_abnormal" title="拆出订单转至取消订单" lay-skin="primary" id="waittopack_demo_original_abnormal">
          <input type="radio" name="waittopack_demo_original_abnormal" title="拆出订单转至其它异常订单" lay-skin="primary" id="waittopack_demolition_original_abnormal">
      </div>
      <table class="layui-table" id="waittopack_demolition_original_table" lay-filter="waittopack_demolition_original_table"></table>
  </div>
</script>
<script type="text/html" id="waittopack_orginal_order_products">
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
<script type="text/html" id="waittopack_orginal_order_demolition">{{ d.prodQuantity * d.prodUnitWeight }}</script>

<script type="text/html" id="waittopack_orginal_order_number">
    <input type="text" class="layui-input" name="demolitionQuality" onchange="commonSetInputMaxMinVal(this,{{d.prodQuantity}},1)">
</script>

<!-- 手动指定物流 -->
<script type="text/html" id="waittopack_updateLogisTypeTpl">
  <form class="layui-form" action="" lay-filter="component-form-group" id="waittopack_updateLogisTypeForm">
      <div class="p20">
          <div class="layui-form-item">
              <label class="layui-form-label">物流公司</label>
              <div class="layui-input-block">
                  <select class="layui-select" lay-search name="logisCompany" lay-filter="waittopack_logisCompany" id="waittopack_logisCompany">
                      <option></option>
                  </select>
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label">物流方式</label>
              <div class="layui-input-block">
                  <select class="layui-select" lay-search name="logisType" id="waittopack_logisType">
                      <option></option>
                  </select>
              </div>
          </div>
      </div>
  </form>
</script>
<!-- 取消wishpost跟踪号 -->
<script type="text/html" id="waittopack_cancelWishpostTpl">
  <form class="layui-form" action="" lay-filter="component-form-group" id="waittopack_cancelWishpostForm">
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
<%-- 修改跟踪号 --%>
<script type="text/html" id="waittopack_editTrackingNoLayer">
    <form class="layui-form p20" id="waittopack_editTrackingNoForm"></form>
</script>
<script type="text/html" id="waittopack_editTrackingNoFormTpl">
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

<!-- 换单/拆单包装弹框 -->
<script type="text/html" id="waittopackage_dismantleLayer">
  <div style="padding: 20px;">
    <div class="layui-form-item">
      <div class="layui-inline">
        <label class="layui-form-label">跟踪号</label>
        <div class="layui-input-inline">
          <input type="text" name="trackNo" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-inline">
        <label class="layui-form-label">订单号</label>
        <div class="layui-input-inline">
          <input type="text" name="orderId" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-inline">
        <label class="layui-form-label">店铺单号</label>
        <div class="layui-input-inline">
          <input type="text" name="platOrderId" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-inline">
        <span class="layui-btn layui-btn-sm search">查询</span>
      </div>
    </div>
    <div>
      <div class="layui-form" style="display:flex;justify-content: space-between;">
        <span>店铺单号: <span class="storeOrderNum"></span></span>
        <div class="dismantleCheckboxs" style="display: flex;">
          <div>
            <input type="checkbox" name="printSku" title="打印面单(含SKU)" lay-skin="primary" lay-filter="dismantleCheckboxsItem"> 
          </div>
          <div>
            <input type="checkbox" name="print" title="打印面单" lay-skin="primary" checked lay-filter="dismantleCheckboxsItem"> 
          </div>
        </div>
      </div>
      <table class="layui-table">
        <thead>
          <tr>
            <th>跟踪号</th>
            <th>订单号</th>
            <th>订单状态</th>
            <th width="700">商品明细</th>
            <th width="50">重量</th>
          </tr>
        </thead>
        <tbody id="waittopackage_dismantleLayerTbody">

        </tbody>
      </table>
    </div>
  </div>
</script>

<script type="text/html" id="waittopack_orginal_order_dynamicWeight"></script>
<script type="text/html" id="waittopack_orginal_order_dynamicMoney"></script>
<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script src="${ctx}/static/js/order/waittopack.js"></script>
<script src="${ctx}/static/js/ireport/print.js"></script>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/components/lodash.js"></script>
