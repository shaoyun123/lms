<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>订单详情</title>
<!-- 更简化 -->
<style>
    
</style>

<div class="layui-tab" lay-filter="orderSimpleDetail_detailTabs" id="orderSimpleDetail_detailTabs">
    <ul class="layui-tab-title">
        <li class="layui-this">详情<span></span></li>
        <li>日志<span></span></li>
    </ul>
    <div class="layui-tab-content">
        <div class="layui-tab-item layui-show" id="orderSimpleDetail_detailTab1Container"></div>
        <div class="layui-tab-item" id="orderSimpleDetail_detailTab2Container"></div>
    </div>
</div>


<%-- 弹框-详情-详情tab --%>
<script type="text/html" id="orderSimpleDetail_detailTab1ContainerTpl">
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
                <label class="layui-form-label">交易ID</label>
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
        <table class="layui-table">
            <thead>
                <tr>
                    <th>图片</th>
                    <th>Item_ID</th>
                    <th>店铺SKU</th>
                    <th>商品SKU</th>
                    <th>商品名称</th>
                    <th>入库要求</th>
                    <th>款式</th>
                    <th>商品成本(¥)</th>
                    <th>净重(g)</th>
                    <th>订单状态</th>
                    <th>商品数量</th>
                    <th>销售金额</th>
                </tr>
            </thead>
            <tbody>
               {{# if(d.orderDetails.length>0){ }}
                {{#  layui.each(d.orderDetails, function(index, item){ }}
                    <tr>
                     <td>
                        <img class="b1 img_show_hide" width="60" height="60"  src="{{item.imageUrl}}" onerror="layui.admin.img_noFind()">
                     </td>
                     <td>{{item.itemId || ''}}</td>
                     <td>{{item.storeSSku || ''}}</td>
                     <td>{{item.prodSSku || ''}}</td>
                     <td>{{item.prodTitle || ''}}</td>
                     <td></td><%-- 入库要求 --%>
                     <td>{{item.style || ''}}</td>
                     <td>{{item.prodUnitCost || ''}}</td>
                     <td>{{item.prodUnitWeight || ''}}</td>
                      <td>{{item.platOrderDetailStatus || ''}}</td>
                     <td>
                     {{# if(item.allCount > item.availableStock && item.holdStock <= 0){ }}
                     <div style="font-weight:700;font-size:24px;color:#f00;">{{item.prodQuantity || ''}}</div>
                     {{# }else{ }}
                     <span>{{item.prodQuantity || ''}}</span>
                     {{# } }}
                     </td>
                     <td>{{item.platOrderDetailAmt || ''}}</td>
                    </tr>
                {{#  }); }}
               {{# }else{ }}
               <tr><td colspan="15">暂无数据</td></tr>
               {{# } }}
            </tbody>
        </table>
    </div>
</script>
<%-- 弹框--详情-日志tab --%>
    <script type="text/html" id="orderSimpleDetail_detailTab2ContainerTpl">
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
</script>