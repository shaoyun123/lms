<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>平台仓订单</title>
<style>
  #LAY-fbpOrder .layui-btn + .layui-btn {
    margin-left: 0 !important;
  }

  .pageSortfix {
    background: #fff;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 100px;
  }
  .hide {
    display: none !important;
  }
  .fbpOrder-noteContent-tag{
    color:#008B8B;
    border: 1px solid #008B8B;
    background-color: #fff;
  }
</style>
<div class="layui-fluid" id="LAY-fbpOrder">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" id="fbpOrderForm" lay-filter="fbpOrderForm">
            <div class="layui-form-item">
              <div class="layui-col-md4 layui-col-lg4">
                <!-- 先只有订单时间 -->
                <!-- <div class="layui-form-label labelSel">
                  <select name="orderTimeType">
                    <option value="orderTimeCn">订单时间</option>
                    <option value="shippingTime">发货时间</option>
                  </select>
                </div> -->
                <div class="layui-form-label">订单时间</div>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" id="fbpOrder_time" name="time" lay-verify="required" readonly />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">平台</label>
                <div class="layui-input-block">
                  <select name="platCode" lay-filter="fbpOrder_allstatusplatCodes" lay-search></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label labelSel">
                  <select lay-filter="fbpOrder_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                    <option value="1">销售</option>
                    <option value="2">客服</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <select
                    name="salePersonId"
                    id="fbpOrder_salePersonsSelect"
                    xm-select="fbpOrder_salePersonsSelect"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select name="storeAcctIds" xm-select="fbpOrderStoreAcct" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">平台状态</label>
                <div class="layui-input-block">
                  <select name="platOrderStatusList" xm-select="fbpOrderStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search=""></select>
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
                <label class="layui-form-label">国家/地区</label>
                <div class="layui-input-block">
                  <select name="shippingCountryCodes" xm-select="fbpOrder_shippingCountrys" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">平台标签</label>
                <div class="layui-input-block">
                  <select
                    name="platTags"
                    xm-select="fbpOrder_platTags"
                    id="fbpOrder_platTags"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    lay-search
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">订单金额</label>
                <div class="layui-input-block disflex">
                  <input type="number" name="platOrderAmtMin" class="layui-input" />
                  <span>&nbsp;~&nbsp;</span>
                  <input type="number" name="platOrderAmtMax" class="layui-input" />
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">买家账号</label>
                <div class="layui-input-block">
                  <input type="text" name="buyerUserId" class="layui-input" />
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">收件人</label>
                <div class="layui-input-block">
                  <input type="text" name="shippingUsername" class="layui-input" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">排序方式</label>
                <div class="layui-input-block">
                  <select name="orderStr" lay-search>
                    <option value="order_time_cn asc">订单时间正序</option>
                    <option value="order_time_cn desc" selected>订单时间倒序</option>
                    <option value="plat_order_amt asc">订单金额正序</option>
                    <option value="plat_order_amt desc">订单金额倒序</option>
                    <option value="profit asc">利润正序</option>
                    <option value="profit desc">利润倒序</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">Item_ID</label>
                <div class="layui-input-block">
                  <input type="text" name="itemIds" class="layui-input" placeholder="多个单号使用逗号隔开" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">匹配SKU</label>
                <div class="layui-input-block">
                  <select name="isMatchSku" lay-search>
                    <option value="">请选择</option>
                    <option value="1">是</option>
                    <option value="0">否</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">标记发货</label>
                <div class="layui-input-block">
                  <select name="markShippingStatus" lay-search>
                    <option value="">请选择</option>
                    <option value="0">未标记</option>
                    <option value="1">已标记</option>
                    <option value="2">标记失败</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">备注类型</label>
                <div class="layui-input-block">
                  <div class="layui-col-md6 layui-col-lg6">
                    <select
                      name="orderLabels"
                      id="fbpOrder_labels"
                      xm-select="orderLabels_toAuditOrder"
                      xm-select-search
                      xm-select-search-type="dl"
                      xm-select-skin="normal"
                      lay-search
                    ></select>
                  </div>
                  <div class="layui-col-md6 layui-col-lg6">
                    <input type="text" name="orderNote" class="layui-input" placeholder="备注内容" style="height: 34px" />
                  </div>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <div class="layui-input-block">
                  <button type="button" class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch" lay-submit="" id="fbpOrderSearch" lay-filter="fbpOrderSearch">
                    查询
                  </button>
                  <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit="" id="fbpOrderExport" lay-filter="fbpOrderExport">
                    导出
                  </button>
                  <button type="button" class="layui-btn layui-btn-sm" lay-submit="" id="fbpOrderExportDetail" lay-filter="fbpOrderExportDetail">
                    导出明细
                  </button>
                </div>
              </div>
              <input class="hide" type="text" name="page" value="1" />
              <input class="hide" type="text" name="limit" value="5000" />
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="fbpOrderCard">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="fbpOrder_Tab" id="fbpOrder_Tab">
            <div class="disFCenter">
              <div style="height: 42px">
                <ul class="layui-tab-title" style="width: 80%">
                  <li class="layui-this">数量(<span></span>)</li>
                </ul>
              </div>
              <div>
                <div>
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="fbpOrder_downloadTemp"
                  onclick="javascript: window.open('${ctx}/static/excel/平台仓批量导入订单模板.xlsx');">新增模板</button>
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="fbpOrder_abatchUpload">批量新增</button>
                  <permTag:perm funcCode="fbpOrder_appointWarehouseType">
                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="fbpOrder_appointWarehouseType">指定仓库类型</button>
                  </permTag:perm>
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="fbpOrder_batchRemark">批量备注</button>
                  <permTag:perm funcCode="fbpOrder_reParseSkuBtn">
                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="fbpOrder_reParseSku">匹配SKU</button>
                  </permTag:perm>
                  <permTag:perm funcCode="fbpOrder_createMCFOrdersBtn">
                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="fbpOrder_createMCFOrders">创建MCF订单</button>
                  </permTag:perm>
                </div>
              </div>
            </div>
            <div class="layui-tab-content">
              <div id="fbpOrder_table" style="width: 100%; height: 600px" class="ag-theme-balham"></div>
              <div class="pageSortfix" id="fbpOrderPage"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/html" id="fbpOrder_appointWarehouseTypeTpl">
  <form class="layui-form" action="" lay-filter="component-form-group" id="fbpOrder_appointWarehouseTypeForm">
      <div class="p20">
          <div class="layui-form-item">
              <label class="layui-form-label">仓库类型</label>
              <div class="layui-input-block">
                  <!-- <input type="radio" name="warehouseType" value="DIRECT" title="直邮仓"> -->
                  <input type="radio" name="warehouseType" value="WINIT" title="海外仓">
                  <!-- <input type="radio" name="warehouseType" value="FBP" title="平台仓"> -->
              </div>
          </div>
      </div>
  </form>
</script>

<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/order/orderLog.js"></script>
<script src="${ctx}/static/js/order/fbpOrder.js"></script>
