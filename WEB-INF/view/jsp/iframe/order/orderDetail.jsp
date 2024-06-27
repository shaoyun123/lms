<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>订单详情</title>

<style>
    .returnToTop {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #9F9F9F;
        color: #fff;
        bottom: 0px;
        right: 18px;
        z-index: 999;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
    }
    .returnToBottom {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #9F9F9F;
        top: 55px;
        color: #fff;
        right: 18px;
        z-index: 999;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
    }
    .layui-layer-page {
        position: relative;
    }
    .layui-layer-content {
        position: static !important;
    }
</style>

<div class="layui-tab" lay-filter="orderDetail_detailTabs" id="orderDetail_detailTabs">
    <ul class="layui-tab-title">
        <li class="layui-this">详情<span></span></li>
        <li>日志<span></span></li>
        <li class="platFee">平台费用<span></span></li>
        <li class="combineOrderDetail">合单明细</li>
    </ul>
    <div class="returnToBottom"><div class="layui-icon layui-icon-down"></div></div>
    <div class="returnToTop"><div class="layui-icon layui-icon-up"></div></div>
    <div class="layui-tab-content">
        <div class="layui-tab-item layui-show" id="orderDetail_detailTab1Container"></div>
        <div class="layui-tab-item" id="orderDetail_detailTab2Container"></div>
        <div class="layui-tab-item" id="orderDetail_detailTab3Container"></div>
        <div class="layui-tab-item" id="orderDetail_detailTab4Container"></div>
    </div>
</div>


<%-- 弹框-详情-详情tab --%>
<script type="text/html" id="orderDetail_detailTab1ContainerTpl">
    <div class="layui-form layui-row">
        <div class="layui-form-item">
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">订单编号</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.id || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">店铺单号</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.platOrderId || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.storeAcct || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.siteName || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">订单北京时间</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{Format(d.orderTimeCn,'yyyy-MM-dd hh:mm:ss') || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">平台交易ID</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.platTransactionId || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">币种</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.currency || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">订单金额</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.platOrderAmt || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">出货仓库</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.warehouseName || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">物流方式</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.logisTypeName || '暂无'}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">跟踪号</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.logisTrackingNo || '' }}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">买家指定物流</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.buyerRequireShippingType || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">卖家邮箱</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.sellerEmail || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">买家邮箱</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.buyerEmail || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">买家ID</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.buyerUserId || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">收件人</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.shippingUsername || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">收件人电话</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.shippingPhoneNumber || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">收件人邮编</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.shippingZip || ''}}">
                </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">地址1</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.shippingStreet1 || ''}}">
                </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">地址2</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.shippingStreet2 || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">城市</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.shippingCity || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">州/省</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.shippingState || ''}}">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">国家/地区</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" readonly value="{{d.shippingCountryCnName || ''}}">
                </div>
            </div>
        </div>
    </div>
    <%-- 表格 --%>
    <div>
        <input type="hidden" name="allDetailData" value='{{JSON.stringify(d).replace(/>/g, '&gt;')}}'>
        <table class="layui-table" id="allOrderDetailTable2023">
            <thead>
                <tr>
                    <th width="80">OA图片</th>
                    <th width="120">平台图片</th>
                    <th width="110">商品SKU
                      <span class="layui-table-sort layui-inline" lay-sort="{{d.prodSSkuOrderBy}}"><i class="layui-edge layui-table-sort-asc" data-orderBy="asc prodSSku"></i><i class="layui-edge layui-table-sort-desc" data-orderBy="desc prodSSku"></i></span>
                    </th>
                    <th width="40">可用库存
                      <span class="layui-table-sort layui-inline" lay-sort="{{d.availableStockOrderBy}}"><i class="layui-edge layui-table-sort-asc" data-orderBy="asc availableStock"></i><i class="layui-edge layui-table-sort-desc" data-orderBy="desc availableStock"></i></span>
                    </th>
                    <th width="35">商品数量</th>
                    <th width="40">商品总量
                      <span class="layui-table-sort layui-inline" lay-sort="{{d.allCountOrderBy}}"><i class="layui-edge layui-table-sort-asc" data-orderBy="asc allCount"></i><i class="layui-edge layui-table-sort-desc" data-orderBy="desc allCount"></i></span>
                    </th>
                    <th width="35">平台数量</th>
                    <th width="175">商品价格</th>
                    <th width="194">商品信息</th>
                    {{# if(d.processStatus && d.processStatus ==502){ }}
                    <th width="170">采购单号</th>
                    {{# } }}
                    <th width="35">入库要求</th>
                    <th width="120">订单信息</th>
                    <th width="150">配货处理</th>
                    <th>标题</th>
                </tr>
            </thead>
            <tbody>
               {{# if(d.orderDetails.length>0){ }}
                {{#  layui.each(d.orderDetails, function(index, item){ }}
                    <tr>
                     <td>
                        <img class="b1 img_show_hide" width="60" height="60"  src="{{item.imageUrl}}" onerror="layui.admin.img_noFind()">
                     </td>
                     <td style="padding: 9px 5px;">
                      <img class="b1 img_show_hide" width="60" height="60"  src="{{item.platImageUrl ||''}}" onerror="layui.admin.img_noFind()">
                      <p>
                        {{# if(!item.prodUrl){ }}
                          {{item.itemId || ''}}
                        {{# }else{ }}
                        <a href="{{item.prodUrl}}" target="_blank" style="color: #00a9ff;">{{item.itemId}}</a>
                        {{# } }}
                        <span onclick="orderCopyText('{{item.itemId}}')"  style="display: {{item.itemId ? 'inline-block':'none'}}" class="copy-icon">
                          <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                      </p>
                     </td>
                     <!-- 商品SKU -->
                     <td style="padding: 9px 5px;">
                      <div>{{item.prodSSku || ''}}
                        <span onclick="orderCopyText('{{item.prodSSku}}')" style="cursor:pointer">
                          <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                      </div>
                      <div>
                        {{# if(!item.isSale){ }}
                        <span class="layui-badge">停</span>
                        {{# } }}
                      </div>
                      <div>
                        {{# if(item.logisAttrList){ }}
                          {{# layui.each(item.logisAttrList.split(','), function(attrIndex, attrItem){ }}
                            {{# if(attrItem != '普货'){ }}
                            <span class="layui-badge">{{attrItem}}</span>  
                            {{# } }}
                          {{# }) }}
                        {{# } }}
                      </div>
                        
                     </td>
                     <%-- 可用库存--%>
                     <td>
                         <!-- {{# if(item.allCount > item.availableStock && item.holdStock <= 0){ }}
                         <div style="font-weight:700;font-size:24px;color:#f00;">{{item.availableStock}}</div>
                         {{# }else{ }}
                         <span>{{item.availableStock}}</span>
                         {{# } }} -->
                         {{# if(item.outStockFlag){ }}
                         <div style="font-weight:700;font-size:24px;color:#f00;">{{item.availableStock}}</div>
                         {{# }else{ }}
                         <span>{{item.availableStock}}</span>
                         {{# } }}
                     </td>
                     <%-- 商品数量--%>
                     <td>
                         <!-- {{# if(item.allCount > item.availableStock && item.holdStock <= 0){ }}
                         <div style="font-weight:700;font-size:24px;color:#f00;">{{item.prodQuantity || ''}}</div>
                         {{# }else{ }}
                         <span>{{item.prodQuantity || ''}}</span>
                         {{# } }} -->
                         {{# if(item.outStockFlag){ }}
                         <div style="font-weight:700;font-size:24px;color:#f00;">{{item.prodQuantity || ''}}</div>
                         {{# }else{ }}
                         <span>{{item.prodQuantity || ''}}</span>
                         {{# } }}
                     </td>
                     <%-- 商品总量--%>
                     <td>
                         <!-- {{# if(item.allCount > item.availableStock && item.holdStock <= 0){ }}
                         <div style="font-weight:700;font-size:24px;color:#f00;">{{item.allCount || ''}}</div>
                         {{# }else{ }}
                         <span>{{item.allCount || ''}}</span>
                         {{# } }} -->
                         {{# if(item.outStockFlag){ }}
                         <div style="font-weight:700;font-size:24px;color:#f00;">{{item.allCount || ''}}</div>
                         {{# }else{ }}
                         <span>{{item.allCount || ''}}</span>
                         {{# } }}
                     </td>
                     <!-- 平台数量 -->
                     <td>{{item.platQuantity || ''}}</td>
                     <!-- 商品价格 -->
                     <td>
                      <div style="text-align:left;">
                        <div>销售金额:{{item.platOrderDetailAmt || ''}}</div>
                        <div title="平均库存成本|商品成本">
                          成本(¥):{{item.prodUnitCost || ''}}|{{item.detailCostPrice || ''}}
                        </div>
                        <div title="库存成本|商品成本占比">
                          成本占比:{{# if(!item.prodCost || !item.prodUnitCost){ }}
                          <span></span>
                          {{# }else{ }}
                          <span>{{(item.prodUnitCost*item.prodQuantity*100/item.prodCost).toFixed(0)+'%' }}</span>
                          {{# } }}
                          <span>|</span>
                          {{# if(!item.costPrice || !item.detailCostPrice){ }}
                          <span></span>
                          {{# }else{ }}
                          <span>{{(item.detailCostPrice*item.prodQuantity*100/item.costPrice).toFixed(0)+'%'}}</span>
                          {{# } }}
                        </div>
                        <div>净重(g):{{item.prodUnitWeight || ''}}</div>
                      </div>
                     </td>
                     <!-- 商品信息 -->
                     <td>
                      <div style="text-align:left;">
                        <div>库位:<span class="pora copySpan">
                          <a>{{item.stockLocation || ''}}</a>
                          <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)" type="button">复制</button>
                        </span></div>
                        <div>
                          店铺SKU:<span class="pora copySpan">
                            <a>{{item.storeSSku || ''}}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)" type="button">复制</button>
                          </span>
                        </div>
                        <div class="onlyShowThreeLine2" title="{{item.prodTitle || ''}}">
                          名称:<span class="pora copySpan">
                            <a>{{item.prodTitle || ''}}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)" type="button">复制</button>
                          </span>
                        </div>
                      </div>
                     </td>
                     <!-- 采购单号 -->
                     {{# if(d.processStatus && d.processStatus ==502){ }}
                     <td>
                      <div style="text-align:left;">
                        {{# if(item.purOrderLogisInfoList){ }}
                        {{#  layui.each(item.purOrderLogisInfoList.slice(0,4), function(pomIndex, pomItem){ }}
                        <div class="purcaseOrderNum" style="margin:5px 0;cursor:pointer;position:relative;" data-str="{{pomItem.stockInStatusStr}}({{pomItem.amount}})<br>{{pomItem.latestDeliveryInfo||''}}">
                          {{pomItem.mainBillNumber}}
                        </div>
                        {{# }) }}
                        {{# } }}
                      </div>
                     </td>
                     {{# } }}
                     <%-- 入库要求 --%>
                     <td></td>
                     <!-- 订单信息 -->
                     <td>
                      <div style="text-align:left;">
                        <div>申报价格:{{item.declaredValue || ''}}</div>
                        <div>报关信息:{{item.customsEnName || ''}}</div>
                        <div>订单状态:{{item.platOrderDetailStatus || ''}}</div>
                      </div>
                     </td>
                     <td>
                      <div>{{item.pickUserName || ''}}</div>
                      <div>{{Format(item.pickTime || '',"yyyy-MM-dd hh:mm:ss")}}</div>
                     </td>
                     <td>
                      <div class="onlyShowFourLine" title="{{item.itemTitle || ''}}">
                        <span class="pora copySpan">
                          <a>{{item.itemTitle || ''}}</a>
                          <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)" type="button">复制</button>
                        </span>
                      </div>
                     </td>
                    </tr>
                {{#  }); }}
               {{# }else{ }}
               <tr><td colspan="15">暂无数据</td></tr>
               {{# } }}
            </tbody>
        </table>

        <!-- <div class="returnToTop"><div class="layui-icon layui-icon-up"></div></div> -->
    </div>
</script>
<%-- 弹框--详情-日志tab --%>
<script type="text/html" id="orderDetail_detailTab2ContainerTpl">
      <div>
          <table class="layui-table">
              <thead>
                  <tr>
                      <th style="width: 25%;text-align: center;">时间</th>
                      <th style="width: 10%;text-align: center;">操作人</th>
                      <th style="width: 65%;">日志</th>
                  </tr>
              </thead>
              <tbody>
                 {{# if(d.length>0){ }}
                  {{#  layui.each(d, function(index, item){ }}
                      <tr>
                        <td style="width: 25%;text-align: center;">{{ Format(item.operTime,"yyyy-MM-dd hh:mm:ss") }}</td>
                       <td style="width: 10%;text-align: center;">{{item.operator}}</td>
                       <td style="width: 65%;white-space: break-spaces;word-break: break-word;">{{item.operDesc}}</td>
                      </tr>
                  {{#  }) }}
                 {{# }else{ }}
                 <tr><td colspan="4">暂无数据</td></tr>
                 {{# } }}
              </tbody>
          </table>
          <!-- <div class="returnToTop"><div class="layui-icon layui-icon-up"></div></div> -->
      </div>
</script>
<!-- 弹框--平台费用-shopee-tab -->
<script type="text/html" id="orderDetail_detailTab3ContainerTpl">
  <div>
      <table class="layui-table">
          <thead>
              <tr>
                  <th style="width: 25%;text-align: center;">费用项目</th>
                  <th style="width: 40%;text-align: center;">原币种(USD)</th>
                  <th style="width: 35%;">人民币(CNY)</th>
              </tr>
          </thead>
          <tbody>
          {{# if(Object.keys(d).length>0 && d.escrowDetail &&Object.keys(d.escrowDetail).length>0){ }}
            <tr>
              <td style="width: 45%;text-align: center;">订单金额</td>
              <td style="width: 30%;text-align: center;">{{d.orderMain?.platOrderAmt.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.orderMain?.platOrderAmt*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">平台佣金</td>
              <td style="width: 30%;text-align: center;">{{d.orderMain?.platFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.orderMain?.platFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">商品成本</td>
              <td style="width: 30%;text-align: center;">{{(d.orderMain?.prodCost/d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{d.orderMain?.prodCost.toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">OA预估物流费</td>
              <td style="width: 30%;text-align: center;">{{(d.orderMain?.shippingCost/d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{d.orderMain?.shippingCost.toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">利润</td>
              <td style="width: 30%;text-align: center;">{{(d.orderMain?.profit/d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{d.orderMain?.profit.toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖家提供的优惠券(扣除退款部分后)</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.voucherFromSeller.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.voucherFromSeller*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">shopee提供给买家的优惠券</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.voucherFromShopee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.voucherFromShopee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家使用的shopee币抵扣金额</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.coins.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.coins*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家支付的运费</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.buyerPaidShippingFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.buyerPaidShippingFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家承担的交易手续费(印尼)</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.buyerTransactionFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.buyerTransactionFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">根据部分地区海关规定,买家跨境购物需承担的关税</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.crossBorderTax.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.crossBorderTax*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家付款时使用的各种支付优惠,如信用卡优惠等</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.paymentPromotion.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.paymentPromotion*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">平台佣金</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.commissionFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.commissionFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">服务费</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.serviceFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.serviceFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖家承担的交易手续费</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.sellerTransactionFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.sellerTransactionFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖家最终需要承担的运费</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.finalShippingFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.finalShippingFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">实际运费(头程+尾程)</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.actualShippingFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.actualShippingFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">shopee提供的运费补贴</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.shopeeShippingRebate.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.shopeeShippingRebate*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">第三方物流渠道提供的运费折扣</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.shippingFeeDiscountFrom3pl.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.shippingFeeDiscountFrom3pl*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖家提供的运费优惠</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.sellerShippingDiscount.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.sellerShippingDiscount*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家下单时,系统预估的尾程运费</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.estimatedShippingFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.estimatedShippingFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家实际退款金额</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.sellerReturnRefund.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.sellerReturnRefund*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖方预计从订单中获取的总金额</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.escrowAmountPri.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.escrowAmountPri*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买方以主要货币支付的总金额</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.buyerTotalAmountPri.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.buyerTotalAmountPri*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">订单商品原价(主要货币)</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.originalPricePri.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.originalPricePri*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家实际退款金额(主要货币)</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.sellerReturnRefundPri.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.sellerReturnRefundPri*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">佣金(主要货币)</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.commissionFeePri.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.commissionFeePri*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">平台服务费(主要货币)</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.serviceFeePri.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.serviceFeePri*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">
                通过争议解决中心(Dispute Resolution Center,DRC)协商后的退款金额(主要货币)
              </td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail?.drcAdjustableRefundPri.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.escrowDetail?.drcAdjustableRefundPri*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">联盟佣金</td>
              <td style="width: 30%;text-align: center;">{{d.escrowDetail.orderAmsCommissionFee ? d.escrowDetail.orderAmsCommissionFee.toFixed(2) : ''}}</td>
              <td style="width: 25%;">{{((d.escrowDetail.orderAmsCommissionFee ? d.escrowDetail.orderAmsCommissionFee.toFixed(2) : 0)*d.orderMain.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            {{# }else if(Object.keys(d).length>0 && d.escrowDetail &&Object.keys(d.escrowDetail).length == 0){  }}
            <tr>
              <td style="width: 45%;text-align: center;">订单金额</td>
              <td style="width: 30%;text-align: center;">{{d.orderMain?.platOrderAmt.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.orderMain?.platOrderAmt*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">平台佣金</td>
              <td style="width: 30%;text-align: center;">{{d.orderMain?.platFee.toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{(d.orderMain?.platFee*d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">商品成本</td>
              <td style="width: 30%;text-align: center;">{{(d.orderMain?.prodCost/d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{d.orderMain?.prodCost.toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">OA预估物流费</td>
              <td style="width: 30%;text-align: center;">{{(d.orderMain?.shippingCost/d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{d.orderMain?.shippingCost.toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">利润</td>
              <td style="width: 30%;text-align: center;">{{(d.orderMain?.profit/d.orderMain?.exchangeRate).toFixed(2) || ''}}</td>
              <td style="width: 25%;">{{d.orderMain?.profit.toFixed(2) || ''}}</td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖家提供的优惠券(扣除退款部分后)</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">shopee提供给买家的优惠券</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家使用的shopee币抵扣金额</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家支付的运费</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家承担的交易手续费(印尼)</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">根据部分地区海关规定,买家跨境购物需承担的关税</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家付款时使用的各种支付优惠,如信用卡优惠等</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">平台佣金</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">服务费</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖家承担的交易手续费</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖家最终需要承担的运费</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">实际运费(头程+尾程)</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">shopee提供的运费补贴</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">第三方物流渠道提供的运费折扣</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖家提供的运费优惠</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家下单时,系统预估的尾程运费</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家实际退款金额</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">卖方预计从订单中获取的总金额</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买方以主要货币支付的总金额</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">订单商品原价(主要货币)</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">买家实际退款金额(主要货币)</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">佣金(主要货币)</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">平台服务费(主要货币)</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">
                通过争议解决中心(Dispute Resolution Center,DRC)协商后的退款金额(主要货币)
              </td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            <tr>
              <td style="width: 45%;text-align: center;">联盟佣金</td>
              <td style="width: 30%;text-align: center;"></td>
              <td style="width: 25%;"></td>
            </tr>
            {{# }else{ }}
             <tr><td colspan="3">暂无数据</td></tr>
            {{# } }}
          </tbody>
      </table>
      <div>平台财务接口返回相关费用暂不考虑拆单情况</div>
  </div>
</script>

<!-- 弹框-合单明细tab -->
<script type="text/html" id="orderDetail_detailTab4ContainerTpl">
  <div>
      <div style="font-weight: 700;">合并订单</div>
      <table class="layui-table">
          <thead>
              <tr>
                  <th>订单号</th>
                  <th>店铺单号</th>
                  <th>平台状态</th>
                  <th>订单金额</th>
                  <th>平台费</th>
                  <th>商品成本</th>
                  <th>物流成本</th>
                  <th>利润</th>
                  <th>SKU Overview</th>
                  <th>买家指定物流方式</th>
                  <th>物流方式</th>
              </tr>
          </thead>
          <tbody>
             {{# if(d.orderMain && Object.keys(d.orderMain).length>0){ }}
              <tr>
                <td>{{d.orderMain.id}}</td>
                <td>{{d.orderMain.platOrderId}}</td>
                <td>{{d.orderMain.platOrderStatus}}</td>
                <td>{{d.orderMain.platOrderAmt}}</td>
                <td>{{d.orderMain.platFee}}</td>
                <td>{{d.orderMain.prodCost}}</td>
                <td>{{d.orderMain.shippingCost}}</td>
                <td>{{d.orderMain.profit}}</td>
                <td>{{d.orderMain.skuOverview}}</td>
                <td>{{d.orderMain.buyerRequireShippingType}}</td>
                <td>{{d.orderMain.logisTypeName}}</td>
              </tr>
             {{# }else{ }}
             <tr><td colspan="11">暂无数据</td></tr>
             {{# } }}
          </tbody>
      </table>
      <div style="font-weight: 700;">原始订单</div>
      <table class="layui-table">
        <thead>
            <tr>
                <th>订单号</th>
                <th>店铺单号</th>
                <th>平台状态</th>
                <th>订单金额</th>
                <th>平台费</th>
                <th>商品成本</th>
                <th>物流成本</th>
                <th>利润</th>
                <th>SKU Overview</th>
                <th>买家指定物流方式</th>
                <th>物流方式</th>
            </tr>
        </thead>
        <tbody>
           {{# if(d.platOrderMainMerges && d.platOrderMainMerges.length>0){ }}
              {{#  layui.each(d.platOrderMainMerges, function(index, item){ }}
              <tr>
                <td>{{item.id}}</td>
                <td>{{item.platOrderId}}</td>
                <td>{{item.platOrderStatus}}</td>
                <td>{{item.platOrderAmt}}</td>
                <td>{{item.platFee}}</td>
                <td>{{item.prodCost}}</td>
                <td>{{item.shippingCost}}</td>
                <td>{{item.profit}}</td>
                <td>{{item.skuOverview}}</td>
                <td>{{item.buyerRequireShippingType}}</td>
                <td>{{item.logisTypeName}}</td>
              </tr>
              {{#  }) }}
           {{# }else{ }}
           <tr><td colspan="11">暂无数据</td></tr>
           {{# } }}
        </tbody>
      </table>
  </div>
</script>

<script type="text/javascript">
    $(function () {
        $('body').on('click','.returnToTop',function () {
            $('.layui-layer-content')[0].scrollTop = 0
        });

        $('body').on('click','.returnToBottom',function () {
            let height = $('#orderDetail_detailTabs').height()
            $('.layui-layer-content')[0].scrollTop = height
        });
    })
    function orderCopyText(text) { // text:为想要复制的内容
        var input = document.createElement('input');//创建input元素
        input.value = text;//把内容text给input元素
        document.querySelector('body').appendChild(input);//在body中添加input元素
        input.select();//选择文本中的内容
        document.execCommand('copy');//执行浏览器复制命令
        input.remove();//复制之后移除input的元素
        layer.msg('复制成功');
    };
    
</script>