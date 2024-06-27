<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>shopee取消订单</title>

<style>
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="shopeeAbolish_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="shopeeAbolish_orgFilter" class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">客服人员</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId"  class="users_hp_custom" data-rolelist="shopee客服" lay-filter="shopeeAbolish_sellerFilter" data-type="customservicer" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" 
                                        data-platcode="shopee" 
                                        xm-select="shopeeAbolish_store_sel"
                                        id="shopeeAbolish_store_selId" 
                                        class="users_hp_store_multi"
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-search>
                                        <option value="ordersn">店铺单号</option>
                                        <option value="itemId">物品号</option>
                                        <option value="buyerName">买家账号</option>
                                        <option value="ordersn2">店铺单号(精确)</option>
                                        <option value="itemId2">物品号(精确)</option>
                                        <option value="buyerName2">买家账号(精确)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchValue">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchTimeType">
                                        <option value="1">创建时间</option>
                                        <option value="2">更新时间</option>  
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="times" id="shopeeAbolish_times">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderBy">
                                        <option value="t1.order_create_time desc">创建时间倒序</option>
                                        <option value="t1.order_create_time asc">创建时间升序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="shopeeAbolish_searchForm_handleResults">
                            </div>
                            <input type="hidden" name="handleStatus" id="shopeeAbolish-tabVal" value="0">
                            <div class="layui-col-lg12 layui-col-md12" style="display:flex;justify-content: flex-end;">
                                <span class="layui-btn layui-btn-sm" lay-submit lay-filter="shopeeAbolish_submit">
                                    查询
                                </span>
                                <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="shopeeAbolish_card">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="shopeeAbolish-tabs" id="shopeeAbolish-tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">未处理<span id="shopeeAbolish_count1"></span></li>
                                    <li>已处理<span id="shopeeAbolish_count2"></span></li>
                                    <li>全部<span id="shopeeAbolish_count3"></span></li>
                                    <li>系统拒绝待确认<span id="shopeeAbolish_count4"></span></li>
                                </ul>
                            </div>
                            <!-- 下面的div放按钮,结构不要变化 -->
                            <div>
                                <span class="layui-btn layui-btn-sm layui-btn-normal hidden" id="shopeeAbolish_batchConfirmBtn">
                                    批量确认
                                </span>
                                <span class="layui-btn layui-btn-sm layui-btn-normal" id="shopeeAbolish_batchBtn">
                                    批量同步
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table" lay-filter="shopeeAbolish_tableFilter" id="shopeeAbolish_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 查询---处理结果  --%>
<script type="text/html" id="shopeeAbolish_searchForm_handleResultsTpl">
    {{# if(d.tabIndex==1 || d.tabIndex==2){ }}
        <label class="layui-form-label">处理结果</label>
        <div class="layui-input-block">
            <select name="handleResults">
                <option value="">请选择</option>
                {{#  if(d.tabIndex==2){ }}
                    <option value="0" {{d.selected=='0'? 'selected': ''}}>未处理</option>
                    {{# } }}
                <option value="1"  {{d.selected==='1'? 'selected': ''}}>同意</option>
                <option value="2"  {{d.selected==='2'? 'selected': ''}}>拒绝</option>
                <option value="3"  {{d.selected==='3'? 'selected': ''}}>系统同意</option>
                <option value="4,5"  {{d.selected==='4,5'? 'selected': ''}}>系统拒绝</option>
            </select>
        </div>
    {{# } }}
</script>

<%-- 表格---产品信息  --%>
<script type="text/html" id="shopeeAbolish_info">
    <div class="alignLeft">
        <div>
            <strong>产品标题:</strong>
            <span>{{d.itemName || ''}}</span>
        </div>
        <div>
            <strong>itemId:</strong>
            <span>{{d.itemId || ''}}</span>
        </div>
    </div>
</script>

<%-- 表格---处理结果 --%>
<script type="text/html" id="shopeeAbolish_handleResult">
    <div>
        {{# if(d.handleResult == 1){ }}
        <span>同意</span>
        {{# }else if(d.handleResult == 2){ }}
        <span>拒绝</span>
        {{# }else if(d.handleResult == 3){ }}
        <span>系统同意</span>
        {{# }else if(d.handleResult == 4 || d.handleResult == 5){ }}
        <span>系统拒绝</span>
        {{# }else if(d.handleResult == 0){ }}
        <span>未处理</span>
        {{# }else{ }}
        <span></span>
        {{# } }}
    </div>
</script>

<%-- 表格---操作 --%>
<script type="text/html" id="shopeeAbolish_tableIdBar">
    <span class="layui-btn layui-btn-xs layui-btn-normal"  lay-event="detail">详情</span><br>
    <span class="layui-btn layui-btn-xs"  lay-event="auto">同步</span><br>
    {{# if(d.handleStatus == 2){ }}
        <span class="layui-btn layui-btn-xs"  lay-event="confirm">确认</span>
    {{# } }}
</script>

<%-- 表格---日期 --%>
<script type="text/html" id="shopeeAbolish_date">
    <div class="alignLeft">
        <p>
            <strong>创建时间:</strong>
            <span>{{Format(d.orderCreateTime, 'yyyy-MM-dd hh:mm:ss')}}</span>
        </p>
        <p>
            <strong>更新时间:</strong>
            <span>{{Format(d.orderUpdateTime, 'yyyy-MM-dd hh:mm:ss')}}</span>
        </p>
    </div>
</script>

<%-- 弹框---详情 --%>
<script type="text/html" id="shopeeAbolish_detail">
    <div class="p20" id="shopeeAbolish_detailContainer"></div>
</script>
<script type="text/html" id="shopeeAbolish_detailContainerTpl">
    <div style="padding:20px;">
       <p><strong>交易详情</strong></p>
       <table class="layui-table">
           <thead>
               <tr>
                   <th>店铺</th>
                   <th>买家</th>
                   <th>买家取消原因</th>
                   <th>取消金额(￥)</th>
                   <th>售出日</th>
                   <th>OA订单状态</th>
               </tr>
           </thead>
           <tbody>
                <tr>
                    <td>{{d.storeAcct || ''}}</td>
                    <td>{{d.buyerName || ''}}</td>
                    <td>{{d.cancelReason || ''}}</td>
                    <td>{{d.totalAmount || ''}}</td>
                    <td>{{Format(d.orderCreateTime, 'yyyy-MM-dd hh:mm:ss')}}</td>
                    <td>{{d.pyOrderStatus || ''}}</td>
                </tr>
           </tbody>
       </table>
    </div>
    <div class="layui-tab">
        <ul class="layui-tab-title">
            <li class="layui-this">取消详情</li>
            <li>发货信息</li>
        </ul>
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
                <div class="layui-form">
                {{# if(d.handleResult ==0){ }}
                    <input type="radio" name="handleResult" value="1" title="同意取消">
                    <input type="radio" name="handleResult" value="2" title="拒绝取消">
                {{# }else{ }}
                <span>该订单已处理!</span>
                {{# } }}
                </div>
            </div>
            <div class="layui-tab-item">
                <p>
                    <strong>跟踪号:</strong>
                    <span>{{d.trackingNo}}</span>
                </p>
                <p style="margin:20px 0;">
                    <strong>物流承运商:</strong>
                    <span>{{d.shippingCarrier}}</span>
                </p>
                <p>
                    <strong>收获地址:</strong>
                    <span>{{d.recipientFullAddress}}</span>
                </p>
            </div>
        </div>
    </div>
    <div style="padding:20px;">
       <p><strong>产品详情</strong></p>
       <table class="layui-table">
           <thead>
               <tr>
                   <th>图片</th>
                   <th>产品详情</th>
                   <th>商品单价(￥)</th>
                   <th>商品数量</th>
                   <th>商品总金额(￥)</th>
               </tr>
           </thead>
           <tbody>
           {{# if(d.shopeeOrderCancelItemDetailList.length){  }}
                {{#  layui.each(d.shopeeOrderCancelItemDetailList, function(index, item){ }}
                <tr>
                    <td>
                    <img class="img_show_hide imgCss imgBorder" width="60" height="60" src="{{item.firstImg}}" onerror="layui.admin.img_noFind()">
                    </td>
                    <td>
                        <p>
                            <strong>产品标题:</strong>
                            <span>{{item.itemName || ''}}</span>
                        </p>
                        <p>
                            <strong>SKU:</strong>
                            <span>{{item.variationSku || ''}}</span>
                        </p>
                    </td>
                    <td>{{item.variationDiscountedPrice || ''}}</td>
                    <td>{{item.variationQuantityPurchased || ''}}</td>
                    <td>{{(item.variationDiscountedPrice * item.variationQuantityPurchased ).toFixed(2) || '' }}</td>
                </tr>
                {{# }) }}
            {{# } }}
           </tbody>
       </table>
    </div>
</script>

<script src="${ctx}/static/js/customer/shopee/abolish.js"></script>
