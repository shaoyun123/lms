<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>订单</title>

<style>
</style>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                  <form class="layui-form" id="ordergoodsSearchForm">
                    <div class="layui-form-item">
                      <div class="layui-col-lg2 layui-col-md2">
                          <div class="layui-form-label labelSel">
                            <select name="timeType" lay-search>
                              <option value="1">订单时间</option>
                              <option value="2">下发时间</option>
                            </select>
                        </div>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="times" id="ordergoodsSearch_times">
                        </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">货主名称</label>
                          <div class="layui-input-block">
                              <select name="ownerUserIdList" 
                                id="ordergoodsSearch_ownerUserIdLists" 
                                xm-select="ordergoodsSearch_ownerUserIdList"
                                xm-select-search 
                                xm-select-search-type="dl" 
                                xm-select-skin="normal"
                              ></select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">店铺</label>
                          <div class="layui-input-block">
                              <select name="storeAcctIds" 
                                id="ordergoodsSearch_storeAcctIds" 
                                xm-select="ordergoodsSearch_storeAcctIds"
                                xm-select-search 
                                xm-select-search-type="dl" 
                                xm-select-skin="normal"
                              ></select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">仓库单号</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="orderCodeList" placeholder="多个逗号隔开">
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">店铺单号</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="platOrderIdList" placeholder="多个逗号隔开">
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">跟踪号</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="tmsOrderCodeList" placeholder="多个逗号隔开">
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">平台状态</label>
                          <div class="layui-input-block">
                              <select name="platOrderStatusList" 
                                id="ordergoodsSearch_platOrderStatusLists" 
                                xm-select="ordergoodsSearch_platOrderStatusLists"
                                xm-select-search 
                                xm-select-search-type="dl" 
                                xm-select-skin="normal"
                              ></select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">优选仓状态</label>
                          <div class="layui-input-block">
                              <select name="processStatusList" 
                                id="ordergoodsSearch_processStatusLists" 
                                xm-select="ordergoodsSearch_processStatusLists"
                                xm-select-search 
                                xm-select-search-type="dl" 
                                xm-select-skin="normal"
                              ></select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">OA状态</label>
                          <div class="layui-input-block">
                              <select name="oaStatusList" 
                                id="ordergoodsSearch_oaStatusLists" 
                                xm-select="ordergoodsSearch_oaStatusLists"
                                xm-select-search 
                                xm-select-search-type="dl" 
                                xm-select-skin="normal"
                              ></select>
                          </div>
                      </div>
                      <div class="layui-col-lg2 layui-col-md2">
                          <label class="layui-form-label">排序方式</label>
                          <div class="layui-input-block">
                              <select name="orderStr" lay-search>
                                  <option value="order_create_time asc">订单时间正序</option>
                                  <option value="order_create_time desc">订单时间倒序</option>
                                  <option value="dom.create_time asc">下发时间正序</option>
                                  <option value="dom.create_time desc">下发时间倒序</option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2" style="padding-left: 2%;box-sizing: border-box;line-height: 32px;">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" lay-filter="ordergoodsSearch"  lay-submit>
                        查询
                        </span>
                        <span class="layui-btn layui-btn-sm layui-btn-primary" id="ordergoods_export">导出</span>
                      </div>
                    </div>
                  </form>
                </div>
            </div>
            <div class="layui-card">
              <div class="layui-card-body">
                <table class="layui-table" id="ordergoods_table" lay-filter="ordergoods_tableFilter"></table>
              </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格---订单号 --%>
<script type="text/html" id="ordergoods_orderNum">
  <div>
    <div>仓库单号: {{d.orderCode || ''}}</div>
    <div>店铺:{{d.storeAcct || ''}}</div>
    <div>店铺单号: {{d.platOrderId || ''}}</div>
  </div>
</script>
<%-- 表格---订单金额 --%>
<script type="text/html" id="ordergoods_orderMoney">
  <div>
    <div>订单金额:{{d.oaCurrency}}: {{d.platOrderAmt}}</div>
    <div>商品成本(￥): {{d.prodCost}}</div>
    <div>物流成本(￥):{{d.shippingCost}}</div>
    <div>利润(￥):{{d.profit}}</div>
  </div>
</script>
<%-- 表格---订单商品 --%>
<script type="text/html" id="ordergoods_orderGoods">
    <div>
      <div>货主: {{d.ownerUserId || ''}}</div>
      <div>种类: {{d.skuQuantity || ''}}</div>
      <div>数量: {{d.prodQuantity || ''}}</div>
    </div>
</script>
<%-- 表格---订单状态 --%>
<script type="text/html" id="ordergoods_orderStatus">
    <div>
      <div>平台: {{d.platOrderStatus || ''}}</div>
      <div>优选仓: {{d.processStatusCn || ''}}</div>
      <div>OA: {{d.oaStatusCn || ''}}</div>
    </div>
</script>
<%-- 表格---订单物流 --%>
<script type="text/html" id="ordergoods_orderLogis">
  <div>
    <div>买家: {{d.buyerRequireShippingType || ''}}</div>
    <div>发货: {{d.logisTypeName || ''}}</div>
    <div>跟踪号: {{d.tmsOrderCode || ''}}</div>
  </div>
</script>
<%-- 表格---订单时间 --%>
<script type="text/html" id="ordergoods_orderTimes">
  <div>
    <div>订单: {{Format(d.orderCreateTime || '', 'yyyy-MM-dd hh:mm:ss')}}</div>
    <div>下发: {{Format(d.createTime || '', 'yyyy-MM-dd hh:mm:ss')}}</div>
    <div>截止: {{Format(d.shipByDate || '', 'yyyy-MM-dd hh:mm:ss')}}</div>
  </div>
</script>
<%-- 表格---仓库处理 --%>
<script type="text/html" id="ordergoods_orderWarehouse">
  <div>
    <div>批次: {{d.batchInfo || ''}}</div>
    <div>配货: {{d.pickInfo || ''}}</div>
    <div>投篮: {{d.checkInfo || ''}}</div>
    <div>包装: {{d.packingInfo || ''}}</div>
    <div>分拣: {{d.scanerInfo || ''}}</div>
  </div>
</script>




<script src="${ctx}/static/js/customer/dabao/ordergoods.js"></script>