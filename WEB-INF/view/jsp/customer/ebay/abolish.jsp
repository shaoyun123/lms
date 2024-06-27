<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>取消订单</title>

<style>
    .abolish_detail_info {
        box-shadow: 0 0 5px 0 rgba(0,34,77,0.3);
        margin-bottom: 10px;
        padding: 10px;
    }
    .abolish_back_container {
        border: 1px solid #ccc;
        margin-bottom: 10px;
        border-radius: 2px;
    }
    .abolish_back_title {
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        background: #eee;
        border-bottom: 1px solid #ccc;
    }
    .abolish_back_content {
         padding: 10px;
    }
    .abolish_detail_flexH {
        display: flex;
        justify-content: flex-start;
        margin: 10px 0;
    }
    .abolish_detail_mr10 {
       margin-right: 10px;
    }
    .abolish_disN {
        display: none !important;
    }
       
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="abolish_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="abolish_orgFilter" class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">客服人员</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId"  class="users_hp_custom" data-rolelist="ebay客服专员" lay-filter="abolish_sellerFilter" data-type="customservicer" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="abolish_storeFilter" lay-search="" >
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding:0 15px;">
                                    <select name="abolish_searchType" lay-search>
                                        <option value="cancelId">取消交易编号</option>
                                        <option value="itemId">物品号</option>
                                        <option value="buyerName">买家账号</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="abolish_searchContent">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">取消状态</label>
                                <div class="layui-input-block">
                                   <select name="cancelStatus" id="abolish_cancelStatus" lay-search></select>
                                </div>
                            </div>
                            
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">创建时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="times" id="abolish_receive_date" readonly>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">发起原因</label>
                                <div class="layui-input-block">
                                    <select
                                    name="cancelReasonList"
                                    xm-select="ebay_abolish_cancalreason"
                                    xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">平台订单号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="platOrderIdStr">
                                </div>
                            </div>
                            <input type="hidden" value="2" id="abolish-tabVal">
                            <div class="layui-col-md12 layui-col-lg12" style="text-align: right;">
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="abolish_submit">查询</span>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="abolishCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header" style="display:flex;justify-content:space-between;">
                        <div class="layui-tab" lay-filter="abolish-tabs" id="abolish-tabs" style="display:flex;align-items: center;">
                            <ul class="layui-tab-title">
                                <li class="layui-this">开启(<span id="abolish_not_handle_number">0</span>)</li>
                                <li>关闭(<span id="abolish_already_close_number">0</span>)</li>
                                <li>全部(<span id="abolish_all_handle_number">0</span>)</li>
                            </ul>
                        </div>
                        <div>
                            <span class="layui-btn layui-btn-sm" id="abolish_batchHandle">批量同步</span>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="abolish_table"  lay-filter="abolish_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 产品信息 --%>
<script type="text/html" id="abolish_info">
   <div style="text-align: left;">
        {{# if(d.list.length){ }}
            {{#  layui.each(d.list, function(index, item){ }}
            <div><strong>标题:</strong>{{item.itemTitle}}</div>
            <div><strong>ItemId:</strong> 
               <span class="pora copySpan">
                    <a  href="http://www.ebay.co.uk/itm/{{d.list[0].itemId}}" target="_blank" style="color:#4ab2fe;">{{item.itemId}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
               </span>
            </div>
            <div><strong>子交易号:</strong> {{item.transactionId}}</div>
            <div><strong>订单号:</strong> {{item.tradeNid}}</div>
            <div><strong>平台订单号:</strong> {{item.legacyOrderId}}</div>
            {{# }) }}
        {{# } }}
     
   </div>
</script>


<%-- 交易金额 --%>
<script type="text/html" id="abolish_money">
<div style="text-align:left;">
    <strong>{{d.orderCurrency}}:</strong>{{d.orderReturnAmount}}
</div>
</script>

<%-- 时间 --%>
<script type="text/html" id="abolish_date">
    <div style="text-align:left;">
       {{# if(d.shipmentDate){ }}
            <div><strong>发货时间:</strong><span>{{d.shipmentDate}}</span></div>
       {{# }  }}

       {{# if(d.cancelRequestDate){ }}
            <div><strong>发起时间:</strong><span>{{d.cancelRequestDate}}</span></div>
       {{# }  }}

       {{# if(d.cancelCloseDate){ }}
            <div><strong>关闭时间:</strong><span>{{d.cancelCloseDate}}</span></div>
       {{# }  }}
    </div>
</script>
<%-- 操作栏 --%>
<script type="text/html" id="abolish_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-normal"  lay-event="detail">详情</span><br>
        {{#  if(d.cancelState != 'CLOSED'){ }}
        <span class="layui-btn layui-btn-xs"  lay-event="auto">同步</span>
        {{# } }}
    </div>
</script>

<%-- 详情弹框 --%>
<script type="text/html" id="abolish_detail_layer">
    <div id="abolish_detail_container" style="padding: 20px;">
    </div>  
</script>
<%-- 详情模板 --%>
<script type="text/html" id="abolish_detail_containerTpl">
    <div class="abolish_detail_info">
        <table class="layui-table">
            <thead>
                <tr>
                    <th>图片</th>
                    <th>物品标题</th>
                    <th>售出日</th>
                    <th>平台订单号</th>
                    <th>订单号</th>
                    <th>卖家</th>
                    <th>买家</th>
                </tr>
            </thead>
            <tbody>
                {{# if(d[0].list){ }}
                {{#  layui.each(d[0].list, function(index, item){ }}
                <tr>
                    <td><img class="img_show_hide imgCss imgBorder" width="60" height="60" src="{{item.imgUrl}}" onerror="layui.admin.img_noFind()"></td>
                    <td>{{item.itemTitle}}</td>
                    <td>{{item.orderTime || ''}}</td>
                    <td>{{item.legacyOrderId}}</td>
                    <td>{{item.tradeNid}}</td>
                    <td>{{item.sellerLoginName || ''}}</td>
                    <td>{{item.buyerLoginName || ''}}</td>
                </tr>
                {{# }) }}
                {{# }  }}
            </tbody>
        </table>
    </div>
    <div class="layui-tab layui-tab-card">
        <ul class="layui-tab-title">
            <li class="layui-this">取消详情</li>
            <li>发货信息</li>
        </ul>
        <div class="layui-tab-content" style="height: 463px;overflow-y:scroll;">
            <div class="layui-tab-item layui-show">
                <div class="abolish_back_container">
                    <div class="abolish_back_title">退货处理</div>
                    <div class="abolish_back_content">
                        {{# if(d[3].cancelState == 'APPROVAL_PENDING'){ }}
                        <div class="abolish_detail_flexH abolish_detail_file">
                            <strong class="abolish_detail_mr10">处理方案:</strong>
                            <div class="layui-form" style="margin-top:-5px;">
                                <input type="radio" lay-filter="abolish_handle_filter" name="abolishHandle" value="abolishAgree" title="同意取消" checked>
                                <input type="radio" lay-filter="abolish_handle_filter" name="abolishHandle" value="abolishRefuse" title="拒绝取消">
                            </div>
                        </div>
                        <div class="abolish_detail_flexH abolish_disN" id="abolishlayer_sendProductTime">
                            <strong class="abolish_detail_mr10">发货日期:</strong>
                            <div class="layui-form" style="margin-top:-5px;">
                                <input type="text" class="layui-input" readonly id="abolishlayer_sendTime">
                            </div>
                        </div>
                        <div class="abolish_detail_flexH abolish_disN" id="abolishlayer_trackno_parent">
                            <strong class="abolish_detail_mr10" style="margin-left:13px;">跟踪号:</strong>
                            <div class="layui-form" style="margin-top:-5px;">
                                <input type="text" class="layui-input" id="abolishlayer_trackno">
                            </div>
                        </div>
                        {{# } }}
                    </div>
                </div>
                <div class="abolish_back_container">
                    <div class="abolish_back_title">交易详情</div>
                    <div class="abolish_back_content">
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th>交易时间</th>
                                    <th>交易类型</th>
                                    <th>交易结果</th>
                                    <th>请求金额</th>
                                    <th>实际金额</th>
                                    <th>物品数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{# if(d[1].length){ }}
                                    {{#  layui.each(d[1], function(index, item){ }}
                                    <tr>
                                        <td>{{Format(item.creationDate, 'yyyy-MM-dd hh:mm:ss')}}</td>
                                        <td>{{item.moneyMovementType}}</td>
                                        <td>{{item.platStatus}}</td>
                                        <td>{{item.currency}}{{item.requestedAmount}}</td>
                                        <td>{{item.currency}}{{item.actualAmount | ''}}</td>
                                        <td>{{item.cancelQuantity}}</td>
                                    </tr>
                                    {{# }) }}
                                {{# } }}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="abolish_back_container">
                    <div class="abolish_back_title">操作记录</div>
                    <div class="abolish_back_content">
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>发起人</th>
                                    <th>类型</th>
                                    <th>动作</th>
                                    <th>新状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{# if(d[2].length){ }}
                                    {{#  layui.each(d[2], function(index, item){ }}
                                    <tr>
                                        <td>{{Format(item.actionDate, 'yyyy-MM-dd hh:mm:ss')}}</td>
                                        <td>{{item.activityParty}}</td>
                                        <td>{{item.activityType}}</td>
                                        <td>{{item.stateFrom}}</td>
                                        <td>{{item.stateTo}}</td>
                                    </tr>
                                    {{# }) }}
                                {{# } }}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="layui-tab-item">
                {{# if(d[0].orderInfoMap?.resendOrders){ }}
                    {{# layui.each(d[0].orderInfoMap?.resendOrders, function(index, item){ }}
                        <div style="height:32px;line-height:32px;font-weight: bold;font-size: 14px">
                            关联重寄订单
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>订单号:</strong>
                            <span>{{item.nid || '' }}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货状态:</strong>
                            <span>{{item.orderstatus || '' }}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货时间:</strong>
                            <span>{{item.closingdate || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>跟踪号:</strong>
                            <span>{{item.trackno || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>承运商:</strong>
                            <span>{{item.logisticsProviderName || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;margin-bottom: 20px">
                            <strong>物流状态:</strong>
                            <span>{{item.logisticsStatus || ''}}</span>
                        </div>   
                    {{# }) }}
                {{# } }}

                {{# if(d[0].orderInfoMap?.splitOrders){ }}
                    {{# layui.each(d[0].orderInfoMap?.splitOrders, function(index, item){ }}
                        <div style="height:32px;line-height:32px;font-weight: bold;font-size: 14px">
                            关联拆分订单
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>订单号:</strong>
                            <span>{{item.nid || '' }}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货状态:</strong>
                            <span>{{item.orderstatus || '' }}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货时间:</strong>
                            <span>{{item.closingdate || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>跟踪号:</strong>
                            <span>{{item.trackno || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>承运商:</strong>
                            <span>{{item.logisticsProviderName || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;margin-bottom: 20px">
                            <strong>物流状态:</strong>
                            <span>{{item.logisticsStatus || ''}}</span>
                        </div>    
                    {{# }) }}
                {{# } }}

                {{# if(d[0].orderInfoMap?.mergeOrders){ }}
                    {{# layui.each(d[0].orderInfoMap?.mergeOrders, function(index, item){ }}
                        <div style="height:32px;line-height:32px;">
                            <strong>发货状态:</strong>
                            <span>{{item.orderstatus || '' }}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货时间:</strong>
                            <span>{{item.closingdate || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>跟踪号:</strong>
                            <span>{{item.trackno || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>承运商:</strong>
                            <span>{{item.logisticsProviderName || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;margin-bottom: 20px">
                            <strong>物流状态:</strong>
                            <span>{{item.logisticsStatus || ''}}</span>
                        </div>   
                    {{# }) }}
                {{# } }}
                
            </div>
        </div>
    </div>
</script>


<script src="${ctx}/static/js/customer/ebay/abolish.js"></script>