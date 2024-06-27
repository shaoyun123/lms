<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>物流规则匹配分析</title>
<style></style>
<div id="orderanalysisLogisRule">
  <div class="layui-card">
    <div class="layui-card-body">
      <div style="padding: 20px">
        <div id="order_logisRule_match_analysisLayerContainer" class="layui-fluid"></div>
      </div>
    </div>
  </div>
</div>

<script type="text/html" id="order_logisRule_match_analysisLayerTpl">
  <div class="layui-card">
    <div class="layui-card-body">
      <form class="layui-form">
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">订单编号</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.id || ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">国家/地区</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.shippingCountryCnName || ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">店铺名称</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.storeAcct || ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">延迟天数</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.delayDays || ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">订单金额</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.platOrderAmt || ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">运费</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.shippingCost !==undefined ? d.orderInfo.shippingCost : ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">订单重量(g)</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.preWeight || ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">发货仓库</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.warehouseName || ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">买家指定物流</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.buyerRequireShippingType || ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">物流方式</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.logisTypeName || ''}}" />
              </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
              <label class="layui-form-label">平台</label>
              <div class="layui-input-block">
                <input type="text" class="layui-input" disabled value="{{d.orderInfo.platCode || ''}}" />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div>
        <span>
          <span><strong>1.待处理订单匹配物流规则运费低的优先;</strong></span>
          <span><strong>2.待处理订单未关联商品也匹配物流;</strong></span>
          <span><strong>3.匹配物流规则金额币种:人民币RMB;</strong></span>
        </span>
        <span class="layui-btn layui-btn-sm layui-btn-normal" style="position:absolute;right:0;" id="order_logisRule_match_analysis_exportBtn">导出</span>
      </div>
    </div>
  </div>
  <div class="layui-card">
    <div class="layui-card-header">
      <!-- 页签点击结构 -->
      <div class="layui-tab" lay-filter="order_logisRule_match_analysis_tabs" id="order_logisRule_match_analysis_tabs">
        <ul class="layui-tab-title">
          <li data-attr="状态" class="layui-this">状态</li>
          <li data-attr="国家/地区">国家/地区</li>
          <li data-attr="州/省">州/省</li>
          <li data-attr="仓库类型">仓库类型</li>
          <li data-attr="sku">sku</li>
          <li data-attr="延迟天数">延迟天数</li>
          <li data-attr="sku数量">sku数量</li>
          <li data-attr="货物数量">货物数量</li>
          <li data-attr="货物尺寸">货物尺寸</li>
          <li data-attr="订单金额">订单金额</li>
          <li data-attr="订单重量">订单重量</li>
          <li data-attr="订单国家/地区">订单国家/地区</li>
          <li data-attr="商品属性">商品属性</li>
          <%--
          <li data-attr="基本信息">基本信息</li>
          --%>
          <li data-attr="指定运输方式">指定运输方式</li>
          <li data-attr="买家支付运费">买家支付运费</li>
          <li data-attr="订单平台和店铺">订单平台和店铺</li>
          <li data-attr="邮编">邮编区间</li>
          <li data-attr="邮编号">邮编固定值</li>
          <li data-attr="优先级">优先级</li>
          <li data-attr="sku库存">sku库存</li>
          <li data-attr="运费">运费</li>
        </ul>
      </div>
    </div>
    <div class="layui-card-body">
      <table class="layui-table">
        <thead>
          <tr>
            <th>编号</th>
            <th class="priority_sort">
              优先级
              <span style="display:inline-flex;flex-direction:column;line-height:10px;cursor:pointer;">
                <i class="layui-icon match-analysis-up">&#xe619;</i>
                <i class="layui-icon match-analysis-down">&#xe61a;</i>
              </span>
            </th>
            <th>物流方式</th>
            <th>物流规则</th>
            <th>备注</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody id="order_logisRule_match_analysis_tbody">
          {{# layui.each(d.resultMap['状态'], function(index, item){ }}
          <tr>
            <td>{{ index+1 }}</td>
            <td>{{item.priority}}</td>
            <td>{{item.logisticsTypeName}}</td>
            <td>{{item.ruleName}}</td>
            <td>{{item.remark}}</td>
            <td>{{item.desc}}</td>
          </tr>
          {{#　})　}}
        </tbody>
      </table>
    </div>
  </div>
</script>

<script src="${ctx}/static/js/order/analysisLogisRule.js"></script>
