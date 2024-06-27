<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>inquiry</title>

<style>
    .inquiry_back_container {
        border: 1px solid #ccc;
        margin-bottom: 10px;
        border-radius: 2px;
    }
    .inquiry_back_title {
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        background: #eee;
        border-bottom: 1px solid #ccc;
    }
    .inquiry_back_content {
        padding: 10px;
    }
    .sendProductInfoTable >tbody > tr {
        height:32px;
        line-height: 32px;
    }
    .inquiry_detail_mr10 {
       margin-right: 10px;
    }
    .inquiry_detail_flexH {
        display: flex;
        justify-content: flex-start;
        margin: 10px 0;
    }
    .inquiry_container {
        height: 146px;
        outline: none;
        width: 80%;
        border: 1px solid #ccc;
        padding: 5px 10px;
        box-sizing: border-box;
    }
    .input500 {
        width: 500px;
    }
    .inquiry_detail_disN {
        display: none !important;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="inquiry_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="inquiry_orgFilter" class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">客服人员</label>
                                <div class="layui-input-block">
                                    <select name="customServicerId"  class="users_hp_custom" data-rolelist="ebay客服专员" lay-filter="inquiry_sellerFilter" data-type="customservicer" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="inquiry_storeFilter" lay-search="" >
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId" id="salePersonId" class="sale_hp_custom" lay-filter="aftermarket_saleFilter" lay-search="">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                             <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding:0 15px;">
                                    <select name="searchType" lay-search>
                                        <option value="inquiryId">inquiryId</option>
                                        <option value="buyer">买家账号</option>
                                        <option value="itemId">物品号</option>
                                        <option value="platOrderId">平台订单号</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchContent">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">inquiry状态</label>
                                <div class="layui-input-block">
                                    <select name="inquiryStatus" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">创建时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="times" id="inquiry_receive_date" readonly>
                                </div>
                            </div>
                            <input type="hidden" value="0" id="inquiry_disposeStatusType">
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="inquiry_submit">查询</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="inquiryCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header" style="display:flex;justify-content:space-between;">
                        <div class="layui-tab" lay-filter="inquiry-tabs" id="inquiry-tabs" style="display:flex;align-items: center;">
                            <ul class="layui-tab-title">
                                <li class="layui-this">未处理(<span id="inquiry_not_handle_number">0</span>)</li>
                                <li>已处理(<span id="inquiry_already_handle_number">0</span>)</li>
                                <li>关闭(<span id="inquiry_already_close_number">0</span>)</li>
                                <li>全部(<span id="inquiry_all_handle_number">0</span>)</li>
                            </ul>
                        </div>
                        <div style="display:flex;align-items: center;">
                            <input type="text" class="layui-input" id="inquiry_batchTimes" readonly style="width:300px;">
                            <span class="layui-btn layui-btn-sm" id="inquiry_batchHandle">批量同步</span>
                            <span class="layui-btn layui-btn-sm" id="inquiry_batchExportHandle">批量导出</span>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="inquiry_table"  lay-filter="inquiry_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 产品信息 --%>
<script type="text/html" id="inquiry_info">
    <div style="text-align: left;">
      <div><strong>标题:</strong>{{d.itemTitle}}</div>
      <div><strong>ItemId:</strong>
        <span class="pora copySpan">
        <a  href="http://www.ebay.co.uk/itm/{{d.itemId}}" target="_blank" style="color:#4ab2fe;">{{d.itemId}}</a>
        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
        </span>
      </div>
      <div><strong>订单号:</strong> {{d.pyOrderNum}}</div>
      <div><strong>平台订单号:</strong> {{d.platOrderId || ''}}</div>
   </div>
</script>

<%-- 纠纷金额 --%>
<script type="text/html" id="inquiry_money">
    <div>{{d.currency}}:{{d.claimAmt}}</div>
</script>
<%-- 时间 --%>
<script type="text/html" id="inquiry_times">
    <div style="text-align: left;">
        <div>
            <strong>售出时间:</strong>
            <span>{{Format(d.pyOrderTime, 'yyyy-MM-dd hh:mm:ss')}}</span>
        </div>
        {{# if(d.shipmentDate){ }}
        <div>
            <strong>发货时间:</strong>
            <span>{{d.shipmentDate}}</span>
        </div>
        {{# } }}
        {{# if(d.creationDate){ }}
        <div>
            <strong>发起时间:</strong>
            <span>{{Format(d.creationDate, 'yyyy-MM-dd hh:mm:ss')}}</span>
        </div>
        {{# } }}
        {{# if(d.inquiryClosureDate){ }}
        <div>
            <strong>关闭时间:</strong>
            <span>{{Format(d.inquiryClosureDate, 'yyyy-MM-dd hh:mm:ss')}}</span>
        </div>
        {{# } }}
    </div>
</script>
<%-- 操作 --%>
<script type="text/html" id="inquiry_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-normal"  lay-event="detail">详情</span><br>
        {{# if(d.processStatus !=4){ }}
        <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="auto">同步</span>
        {{# } }}
    </div>
</script>
<%-- 详情页面 --%>
<script type="text/html" id="inquiryDetailLayero">
    <div id="inquiry_detail_container" style="padding: 20px;">
    </div>
</script>
<%-- 详情模板 --%>
<script type="text/html" id="inquiry_detail_containerTpl">
    <%-- 物品详情 --%>
    <div class="inquiry_detail_info">
        <div>详情</div>
        <div>
            <table class="layui-table">
                <thead>
                    <tr>
                        <th>物品标题</th>
                        <th width="130">售出日</th>
                        <th>售价</th>
                        <th width="65">订单号</th>
                        <th width="65">平台订单号</th>
                        <th>买家</th>
                        <th>卖家</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{d.msgInquiryEbay.itemTitle}}</td>
                        <td>{{Format(d.msgInquiryEbay.pyOrderTime,'yyyy-MM-dd hh:mm:ss')}}</td>
                        <td>{{d.msgInquiryEbay.currency}}:{{d.msgInquiryEbay.claimAmt}}</td>
                        <td>{{d.msgInquiryEbay.pyOrderNum}}</td>
                        <td>{{d.msgInquiryEbay.platOrderId}}</td>
                        <td>{{d.msgInquiryEbay.buyer}}</td>
                        <td>{{d.msgInquiryEbay.seller}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <%-- 纠纷详情 --%>
    <div class="layui-tab layui-tab-card">
        <ul class="layui-tab-title">
            <li class="layui-this">纠纷详情</li>
            <li>发货信息</li>
        </ul>
        <div class="layui-tab-content">
            <%-- 纠纷详情内容 --%>
            <div class="layui-tab-item layui-show">
                <div class="inquiry_back_container">
                    <%-- 纠纷处理 --%>
                   <div class="inquiry_back_title">纠纷处理</div>
                   <div class="inquiry_back_content">
                        {{# if(d.msgInquiryEbay.processStatus ==0){ }}
                        <div class="inquiry_detail_flexH">
                            <strong class="inquiry_detail_mr10">提示信息:</strong>
                            <div>
                                请在<span style="color: red;">{{Format(d.msgInquiryEbay.respondByDate, 'yyyy-MM-dd')}}</span>前处理,否则买家可要求eBay介入
                            </div>
                        </div>
                        {{# } }}
                        {{# if(d.msgInquiryEbay.processStatus !=4){ }}
                            {{# if(d.msgInquiryEbay.procResult && d.msgInquiryEbay.procResult.length > 1){ }}
                            <div class="aftermarket_detail_flexH">
                                <strong class="aftermarket_detail_mr10">卖家处理:</strong>
                                <div>
                                    <span style="color: red;">{{d.msgInquiryEbay.procResult}}</span>
                                </div>
                            </div>
                            {{# } }}
                        {{# } }}
                        {{# if(d.msgInquiryEbay.processStatus !=4){ }}
                        <div class="inquiry_detail_flexH inquiry_detail_file">
                            <strong class="inquiry_detail_mr10">处理方案:</strong>
                            <div class="layui-form">
                                <input type="radio" lay-filter="inquiry_handle_filter" name="inquiryrHandle" value="ISSUE_FULL_REFUND" title="全额退款" checked>
                                <input type="radio" lay-filter="inquiry_handle_filter" name="inquiryrHandle" value="ESCALATE" title="升级到客服">
                                <input type="radio" lay-filter="inquiry_handle_filter" name="inquiryrHandle" value="SEND_MESSAGE" title="与买家沟通">
                                <input type="radio" lay-filter="inquiry_handle_filter" name="inquiryrHandle" value="PROVIDE_SHIPPING_INFO" title="提供运输信息">
                            </div>
                        </div>
                        <div class="inquiry_detail_flexH inquiry_detail_money">
                            <strong class="inquiry_detail_mr10">退款金额:</strong>
                            <div>
                                <span>{{d.msgInquiryEbay.currency}}:</span>
                                <span>{{d.msgInquiryEbay.claimAmt}}</span>
                            </div>
                        </div>
                        <div class="inquiry_detail_flexH inquiry_detail_transport inquiry_detail_disN">
                            <strong class="inquiry_detail_mr10">发货时间:</strong>
                            <div>
                                <input type="text" class="layui-input" id="inquiry_detail_shippingCreateDate" value="{{d.msgInquiryEbay.shipmentDate}}"readonly>
                            </div>
                        </div>
                        <div class="inquiry_detail_flexH inquiry_detail_transport inquiry_detail_disN">
                            <strong class="inquiry_detail_mr10">&nbsp;&nbsp;&nbsp;承运商:</strong>
                            <div>
                                <input type="text" class="layui-input" id="inquiry_detail_shippingCarrier" value="{{d.msgInquiryEbay.shippingCarrier}}">
                            </div>
                        </div>
                        <div class="inquiry_detail_flexH inquiry_detail_transport inquiry_detail_disN">
                            <strong class="inquiry_detail_mr10">&nbsp;&nbsp;&nbsp;跟踪号:</strong>
                            <div>
                                <input type="text" class="layui-input"  id="inquiry_detail_shippingTrackingNo" value="{{d.msgInquiryEbay.shippingTrackingNumber}}">
                            </div>
                        </div>
                        <div class="inquiry_detail_flexH  inquiry_detail_reason inquiry_detail_disN">
                            <strong class="inquiry_detail_mr10">升级原因:</strong>
                            <div class="input500 layui-form">
                                <select name="escalateType" id="inquiry_escalateType" lay-search>
                                    <option value="BUYER_TROUBLE" selected>BUYER_TROUBLE</option>
                                    <option value="SHIPPED_ITEM">SHIPPED_ITEM</option>
                                    <option value="TROUBLE_COMMUNICATION">TROUBLE_COMMUNICATION</option>
                                    <option value="OTHERS">OTHERS</option>
                                </select>
                            </div>
                        </div>
                        <div class="inquiry_detail_flexH inquiry_container_leave">
                            <strong class="inquiry_detail_mr10">信息留言:</strong>
                            <div contentEditable="true" class="inquiry_container" id="inquiry_container_leave">    
                            </div>
                        </div>
                        {{# } }}
                   </div>
                </div>
                <%-- 纠纷详情 --%>
                <div class="inquiry_back_container">
                    <div class="inquiry_back_title">纠纷详情</div>
                    <div class="inquiry_back_content">
                        <div style="display:flex;justify-content: space-between;">
                            <div style="width:50%;text-align:left;">
                                <div class="inquiry_back_content"><strong class="inquiry_detail_mr10">inquiryId:</strong>{{d.msgInquiryEbay.inquiryId}}</div>
                                <div class="inquiry_back_content"><strong class="inquiry_detail_mr10">发起日期:</strong>{{Format(d.msgInquiryEbay.creationDate, 'yyyy-MM-dd')}}</div>
                                <div class="inquiry_back_content"><strong class="inquiry_detail_mr10">发起原因:</strong>{{d.msgInquiryEbay.creationReason}}</div>
                            </div>
                            <div style="width:50%;text-align:left;">
                                <div class="inquiry_back_content"><strong class="inquiry_detail_mr10">物品数量:</strong>{{d.msgInquiryEbay.inquiryQuantity}}</div>
                                <div class="inquiry_back_content"><strong class="inquiry_detail_mr10">纠纷金额:</strong>{{d.msgInquiryEbay.currency}}{{d.msgInquiryEbay.claimAmt}}</div>
                                <div class="inquiry_back_content"><strong class="inquiry_detail_mr10">纠纷状态:</strong>{{d.msgInquiryEbay.inrStatus}}</div>
                            </div>
                        </div>
                        <div stlye="display:flex;padding:0 10px;">
                            <div style="margin-left:10px;"><strong>沟通记录:</strong></div>
                            <div>
                                <table class="layui-table">
                                    <thead>
                                        <tr>
                                            <th width="130">日期</th>
                                            <th width="100">发起人</th>
                                            <th width="180">处理动作</th>
                                            <th>留言</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {{#  layui.each(d.msgInquiryHisEbays, function(index, item){ }}
                                        <tr>
                                            <td>{{Format(item.eventDate,'yyyy-MM-dd hh:mm:ss')}}</td>
                                            <td>{{item.eventActor}}</td>
                                            <td>{{item.eventAction}}</td>
                                            <td>{{item.eventDescription || ''}}</td>
                                        </tr>
                                        {{# }) }}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <%-- 发货/退款信息内容 --%>
            <div class="layui-tab-item">
                <div style="height:32px;line-height:32px;">
                    <strong>发货状态:</strong>
                    <span>{{d.msgInquiryEbay.orderStatus || ''}}</span>
                </div>
                <div style="height:32px;line-height:32px;">
                    <strong>发货时间:</strong>
                    <span>{{Format(d.msgInquiryEbay.pyOrderTime,'yyyy-MM-dd hh:mm:ss')}}</span>
                </div>
                <div style="height:32px;line-height:32px;">
                    <strong>跟踪号:</strong>
                    <span>{{d.msgInquiryEbay.shippingTrackingNumber || ''}}</span>
                </div>
                <div style="height:32px;line-height:32px;">
                    <strong>承运商:</strong>
                    <span>{{d.msgInquiryEbay.shippingCarrier || ''}}</span>
                </div>
                <div style="height:32px;line-height:32px;margin-bottom: 20px">
                    <strong>物流状态:</strong>
                    <span>{{d.msgInquiryEbay.shippingCurrentStatus || ''}}</span>
                </div> 
            </div>
        </div>
    </div>
</script>
<script src="${ctx}/static/js/customer/ebay/inqury.js"></script>