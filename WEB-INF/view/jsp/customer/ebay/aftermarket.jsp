<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>return</title>

<style>
    .aftermarket_detail_info {
        box-shadow: 0 0 5px 0 rgba(0,34,77,0.3);
        margin-bottom: 10px;
        padding: 10px;
    }
    .aftermarket_detail_flex {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
    }
    .aftermarket_detail_flexH {
        display: flex;
        justify-content: flex-start;
        margin: 10px 0;
    }
    .aftermarket_detail_mr10 {
       margin-right: 10px;
    }
    .aftermarket_back_container {
        border: 1px solid #ccc;
        margin-bottom: 10px;
        border-radius: 2px;
    }
    .aftermarket_back_title {
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        background: #eee;
        border-bottom: 1px solid #ccc;
    }
    .aftermarket_back_content {
        padding: 10px;
    }
    .aftermarket_container {
        height: 146px;
        outline: none;
        width: 80%;
        border: 1px solid #ccc;
        padding: 5px 10px;
        box-sizing: border-box;
    }
    .aftermarket_back_contentFile {
        display: flex;
        min-height: 200px;
    }
    .aftermarket_back_content_left{
        width: 420px;
        border-right: 1px solid #ccc;
    }
    .aftermarket_back_content_left>ul,
    .aftermarket_back_content_right >ul {
        display: flex;
        justify-content: flex-start;
        flex-wrap:wrap;
    }
    .aftermarket_back_content_left>ul>li,
    .aftermarket_back_content_right >ul>li {
        margin: 5px;
    }
    .aftermarket_back_content_imgLi {
        width: 60px;
        height: 60px;
        border: 1px dashed #428bca;
        box-sizing: border-box;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
    }
    #aftermarket_back_content_imgUlContainer {
        display:flex;
    }
    #aftermarket_back_content_imgUlContainer>li {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 70px;
        margin: 10px 5px;
        box-sizing: border-box;
    }
    #aftermarket_back_content_imgUlContainer>li>span {
        cursor:pointer;
        color: #35a9ff;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="aftermarket_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="aftermarket_orgFilter" class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">客服人员</label>
                                <div class="layui-input-block">
                                    <select name="customServicerId" class="users_hp_custom" data-rolelist="ebay客服专员" lay-filter="aftermarket_sellerFilter" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="aftermarket_storeFilter" lay-search="" >
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
                                        <option value="returnId">退货编号</option>
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
                                <label class="layui-form-label">创建时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="times" id="aftermarket_receive_date" readonly>
                                </div>
                            </div>
                            <input type="hidden" value="0" id="aftermarket_closeType">
                            <input type="hidden" value="0" id="aftermarket_processType">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">退款状态</label>
                                <div class="layui-input-block">
                                    <select name="returnStatus" id="returnStatus" lay-filter="aftermarket_refundStatus" lay-search="">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">退款原因</label>
                                <div class="layui-input-block">
                                    <select name="returnReason" id="returnReason" lay-filter="aftermarket_refundReason" lay-search="">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="aftermarket_submit">查询</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="aftermarketCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header" style="display:flex;justify-content:space-between;">
                        <div class="layui-tab" lay-filter="aftermarket-tabs" id="aftermarket-tabs" style="display:flex;align-items: center;">
                            <ul class="layui-tab-title">
                                <li class="layui-this">未处理(<span id="aftermarket_not_handle_number">0</span>)</li>
                                <li>已处理(<span id="aftermarket_already_handle_number">0</span>)</li>
                                <li>关闭(<span id="aftermarket_already_close_number">0</span>)</li>
                                <li>全部(<span id="aftermarket_all_handle_number">0</span>)</li>
                            </ul>
                        </div>
                        <div style="display:flex;align-items: center;">
                            <input type="text" class="layui-input" id="aftermarket_batchTimes" readonly style="width:300px;">
                            <span class="layui-btn layui-btn-sm" id="aftermarket_batchHandle">批量同步</span>
                            <span class="layui-btn layui-btn-sm" id="aftermarket_batchExportHandle">批量导出</span>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="aftermarket_table"  lay-filter="aftermarket_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<%-- 产品信息 --%>
<script type="text/html" id="aftermarket_info">
   <div style="text-align: left;">
      <div><strong>标题:</strong>{{d.prodTitle}}</div>
      <div><strong>ItemId:</strong>
        <span class="pora copySpan">
        <a  href="http://www.ebay.co.uk/itm/{{d.itemId}}" target="_blank" style="color:#4ab2fe;">{{d.itemId}}</a>
        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
        </span>
      </div>
      <div><strong>订单号:</strong> {{d.pyOrderNum}}</div>
      <div><strong>平台订单号:</strong> {{d.ebayOrderId}}</div>
   </div>
</script>
<%-- 金额 --%>
<script type="text/html" id="aftermarket_money">
    <div>{{d.refundCurrency}}:{{d.sellerTotalRefundAmt}}</div>
</script>

<%-- 买家账号 --%>
<script type="text/html" id="aftermarket_buyer_account">
    <div style="text-align: left;">
      <div>账号: {{d.buyerLoginName}}</div>
      <div>邮箱: {{d.buyerEmail}}</div>
    </div>
</script>

<%-- 操作栏 --%>
<script type="text/html" id="aftermarket_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-normal"  lay-event="detail">详情</span>
        {{# if(d.isClosed == true){  }}
        
        {{# }else{ }}
        <br>
            <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="auto">同步</span>
        {{# } }}
    </div>
</script>
<%-- 详情页面 --%>
<script type="text/html" id="aftermarket_detail_layer">
    <div id="aftermarket_detail_container" style="padding: 20px;">
    </div>
    
</script>
<%-- 详情模板 --%>
<script type="text/html" id="aftermarket_detail_containerTpl">
    <%-- 物品详情 --%>
    <div class="aftermarket_detail_info">
        <div style="display:flex;justify-content: space-between;">
            <div style="width:70%;text-align:left;">
                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">物品标题:</strong>{{d.msgReturnEbay.prodTitle}}</div>
                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">售价:</strong>{{d.msgReturnEbay.refundCurrency}}{{d.msgReturnEbay.sellerTotalRefundAmt}}</div>
                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">买家:</strong>{{d.msgReturnEbay.buyerLoginName}}</div>     
                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">卖家:</strong>{{d.msgReturnEbay.sellerLoginName}}</div>
            </div>
            <div style="width:30%;text-align:left;">
                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">售出日:</strong>{{Format(d.msgReturnEbay.createTime, 'yyyy-MM-dd hh:mm:ss')}}</div>
                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">订单号:</strong>{{d.msgReturnEbay.pyOrderNum}}</div>
                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">平台订单号:</strong>{{d.msgReturnEbay.ebayOrderId}}</div>
            </div>
        </div>
    </div>
    <div class="layui-tab layui-tab-card">
        <ul class="layui-tab-title">
            <li class="layui-this">退货详情</li>
            <li>发货信息</li>
        </ul>
        <div class="layui-tab-content" style="height: 463px;overflow-y:scroll;">
            <div class="layui-tab-item layui-show">
                <div class="aftermarket_back_container">
                    <%-- 退货详情 --%>
                   <div class="aftermarket_back_title">退货处理</div>
                   <div class="aftermarket_back_content">
                        {{# if(d.msgReturnEbay.isProcessed == false && d.msgReturnEbay.isClosed == false){ }}
                        <div class="aftermarket_detail_flexH">
                            <strong class="aftermarket_detail_mr10" style="margin-left:24px;">提醒:</strong>
                            <div>
                                请在<span style="color: red;">{{Format(d.msgReturnEbay.sellerResponseDue, 'yyyy-MM-dd')}}</span>前处理,否则买家可要求eBay介入
                            </div>
                        </div>
                        {{# } }}
                        {{#  if(!d.msgReturnEbay.isClosed) { }}
                        {{# if(d.msgReturnEbay.procResult && d.msgReturnEbay.procResult.length > 1){ }}
                        <div class="aftermarket_detail_flexH">
                            <strong class="aftermarket_detail_mr10">卖家处理:</strong>
                            <div>
                                <span style="color: red;">{{d.msgReturnEbay.procResult}}</span>
                            </div>
                        </div>
                        {{# } }}
                        <div class="aftermarket_detail_flexH aftermarket_detail_file">
                            <strong class="aftermarket_detail_mr10">处理方案:</strong>
                            <div class="layui-form">
                                <input type="radio" lay-filter="aftermarker_handle_filter" name="aftermarkerHandle" value="issueFullRefund" title="全额退款" checked>
                                <input type="radio" lay-filter="aftermarker_handle_filter" name="aftermarkerHandle" value="partialRefund" title="协商部分退款">
                                <input type="radio" lay-filter="aftermarker_handle_filter" name="aftermarkerHandle" value="sendMessage" title="与买家沟通">
                                <input type="radio" lay-filter="aftermarker_handle_filter" name="aftermarkerHandle" value="approve" title="同意退货">
                                <input type="radio" lay-filter="aftermarker_handle_filter" name="aftermarkerHandle" value="decline" title="拒绝退货">
                            </div>
                        </div>
                        <div id="aftermarket_detail_refund_items">
                            <div class="aftermarket_detail_flexH">
                                <strong class="aftermarket_detail_mr10">退款金额:</strong>
                                <div class="aftermarket_detail_refund_item">
                                    <span id="all_aftm_refundCurrency">{{d.msgReturnEbay.refundCurrency}}</span>
                                    <span id="all_aftm_refundMoney">{{d.msgReturnEbay.sellerTotalRefundAmt}}</span>
                                </div>
                                <div class="aftermarket_detail_refund_item disN">
                                <div style="display:flex;align-items:center;">
                                        <span id="part_aftm_refundCurrency">{{d.msgReturnEbay.refundCurrency}}</span>
                                        <input class="layui-input" id="part_aftm_refundMoney"/>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div class="aftermarket_detail_flexH" style="display:flex;">
                            <strong class="aftermarket_detail_mr10" style="margin-left:24px;">留言:</strong>
                            <div contentEditable="true" class="aftermarket_container" id="aftermarket_container_leave">    
                            </div>
                        </div>
                        {{# }else{ }}
                            {{# if(d.msgReturnEbay.procResult && d.msgReturnEbay.procResult.length > 1){ }}
                            <div class="aftermarket_detail_flexH">
                                <strong class="aftermarket_detail_mr10">处理方案:</strong>
                                <div>
                                {{d.msgReturnEbay.procResult}}
                                </div>
                            </div>
                            {{# } }}
                            <div class="aftermarket_detail_flexH">
                                <strong class="aftermarket_detail_mr10">退款金额:</strong>
                                <div>
                                {{d.msgReturnEbay.sellerTotalRefundAmt}}
                                </div>
                            </div>
                        {{# } }}
                   </div>
                </div>
                <%-- 文件处理 --%>
                <div class="aftermarket_back_container">
                   <div class="aftermarket_back_title">文件</div>
                   <div class="aftermarket_back_content aftermarket_back_contentFile">
                        <div class="aftermarket_back_content_left">
                            <div style="margin-bottom: 10px;">买家文件</div>
                            <ul>
                                {{# if(d.fileMap.BUYER){ }}
                                {{#  layui.each(d.fileMap.BUYER, function(index, item){ }}
                                    {{#  if(item.ftpUrl){ }}
                                    <li>
                                        <img class="img_show_hide imgCss imgBorder" width="60" height="60" src="{{item.ftpUrl}}" onerror="layui.admin.img_noFind()">
                                    </li>
                                    {{# } }}
                                {{# }) }}
                                {{# }  }}
                            </ul>
                        </div>
                        <div class="aftermarket_back_content_right" style="padding-left:20px;">
                            <div style="margin-bottom: 10px;">卖家文件</div>
                            <ul>
                                {{#  if(!d.msgReturnEbay.isClosed){ }}
                                <li class="aftermarket_back_content_imgLi" id="aftermarket_back_content_imgLi">上传文件</li>
                                {{# } }}
                                {{# if(d.fileMap.SELLER){ }}
                                {{#  layui.each(d.fileMap.SELLER, function(index, item){ }}
                                <li>
                                    <img class="img_show_hide imgCss imgBorder" width="60" height="60" src="{{item.ftpUrl}}" onerror="layui.admin.img_noFind()" data-id="{{item.fileId}}">
                                </li>
                                {{# }) }}
                                {{# }  }}
                                
                            </ul>
                        </div>
                   </div>
                </div>
                <%-- 退货详情 --%>
                <div class="aftermarket_back_container">
                    <div class="aftermarket_back_title">退货详情</div>
                    <div class="aftermarket_back_content">
                        <div style="display:flex;justify-content: space-between;">
                            <div style="width:50%;text-align:left;">
                                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">退货编号:</strong>{{d.msgReturnEbay.returnId}}</div>
                                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">发起日期:</strong>{{Format(d.msgReturnEbay.returnCreationDate, 'yyyy-MM-dd')}}</div>
                                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">发起原因:</strong>{{d.msgReturnEbay.returnReason}}</div>
                            </div>
                            <div style="width:50%;text-align:left;">
                                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">物品数量:</strong>{{d.msgReturnEbay.returnQuantity}}</div>
                                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">退货金额:</strong>{{d.msgReturnEbay.refundCurrency}}{{d.msgReturnEbay.sellerTotalRefundAmt}}</div>
                                <div class="aftermarket_back_content"><strong class="aftermarket_detail_mr10">状态:</strong>{{d.msgReturnEbay.returnState}}</div>
                            </div>
                        </div>
                        <div stlye="display:flex;padding:0 10px;">
                            <div><strong class="aftermarket_detail_mr10">操作记录:</strong></div>
                            <div>
                                <table class="layui-table">
                                    <thead>
                                        <tr>
                                            <th>时间</th>
                                            <th>发起人</th>
                                            <th>动作</th>
                                            <th>新状态</th>
                                            <th>留言</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {{#  layui.each(d.msgReturnHisEbayList, function(index, item){ }}
                                        <tr>
                                            <td>{{Format(item.actDate,'yyyy-MM-dd hh:mm:ss')}}</td>
                                            <td>{{item.author}}</td>
                                            <td>{{item.activity}}</td>
                                            <td>{{item.toState}}</td>
                                            <td>{{item.actNote}}</td>
                                        </tr>
                                        {{# }) }}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <%-- 发货信息 --%>
            <div class="layui-tab-item"> 
                {{# if(d.orderDetailData?.mergeOrders){ }}
                    {{# layui.each(d.orderDetailData?.mergeOrders, function(index, item){ }}
                        <div style="height:32px;line-height:32px;">
                            <strong>发货状态:</strong>
                            <span>{{item?.orderstatus || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货时间:</strong>
                            <span>{{item?.closingdate || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>跟踪号:</strong>
                            <span>{{item?.trackno || ''}}</span>
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

                {{# if(d.orderDetailData?.resendOrders){ }}
                    {{# layui.each(d.orderDetailData?.resendOrders, function(index, item){ }}
                        <div style="height:32px;line-height:32px;font-weight: bold;font-size: 14px">
                            关联重寄订单
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>订单号:</strong>
                            <span>{{item?.nid || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货状态:</strong>
                            <span>{{item?.orderstatus || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货时间:</strong>
                            <span>{{item?.closingdate || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>跟踪号:</strong>
                            <span>{{item?.trackno || ''}}</span>
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

                {{# if(d.orderDetailData?.splitOrders){ }}
                    {{# layui.each(d.orderDetailData?.splitOrders, function(index, item){ }}
                        <div style="height:32px;line-height:32px;font-weight: bold;font-size: 14px">
                            关联拆分订单
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>订单号:</strong>
                            <span>{{item?.nid || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货状态:</strong>
                            <span>{{item?.orderstatus || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>发货时间:</strong>
                            <span>{{item?.closingdate || ''}}</span>
                        </div>
                        <div style="height:32px;line-height:32px;">
                            <strong>跟踪号:</strong>
                            <span>{{item?.trackno || ''}}</span>
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

<%-- 新增图片弹框容器 --%>
<script type="text/html" id="aftermarket_back_content_imgLiLayer">
    <div style="padding: 20px;" id="aftermarket_back_content_imgLiContainer">
        
    </div>
</script>
<%-- 新增图片弹框模板 --%>
<script type="text/html" id="aftermarket_back_content_imgLiContainerTpl">
    {{# if(d.SELLER){ }}
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left:-70px;">
            <label class="layui-form-label">意图</label>
            <div class="layui-input-block">
                <select name="filePurpose" lay-search>
                {{# if(d.SELLER[0].filePurpose == 'ITEM_RELATED'){ }}
                    <option value="ITEM_RELATED" selected>ITEM_RELATED</option>
                    <option value="LABEL_RELATED">LABEL_RELATED</option>
                    <option value="REFUND_RELATED">REFUND_RELATED</option>
                {{# }else if(d.SELLER[0].filePurpose == 'LABEL_RELATED'){ }}
                    <option value="ITEM_RELATED">ITEM_RELATED</option>
                    <option value="LABEL_RELATED" selected>LABEL_RELATED</option>
                    <option value="REFUND_RELATED">REFUND_RELATED</option>
                {{# }else{ }}
                    <option value="ITEM_RELATED">ITEM_RELATED</option>
                    <option value="LABEL_RELATED">LABEL_RELATED</option>
                    <option value="REFUND_RELATED" selected>REFUND_RELATED</option>
                {{# } }}
                </select>
            </div>
        </div>
    </div>
    <span type="button" class="layui-btn layui-btn-sm" id="aftermarket_back_content_img_upload">
        <i class="layui-icon">&#xe67c;</i>上传图片
    </span>
    <ul id="aftermarket_back_content_imgUlContainer">
    {{# layui.each(d.SELLER, function(index, item){ }}
        <li data-imgUrl="{{item.ftpUrl}}" data-imgId="{{item.id}}">
            <img class="img_show_hide imgCss imgBorder" width="60" height="60" src="{{item.ftpUrl}}" onerror="layui.admin.img_noFind()">
            <%-- <span data-id="{{item.id}}">删除</span> --%>
        </li>       
    {{# }) }}
    </ul>
    {{# }else{ }}
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left:-70px;">
            <label class="layui-form-label">意图</label>
            <div class="layui-input-block">
                <select name="filePurpose" lay-search>
                    <option value="ITEM_RELATED">ITEM_RELATED</option>
                    <option value="LABEL_RELATED">LABEL_RELATED</option>
                    <option value="REFUND_RELATED">REFUND_RELATED</option>
                </select>
            </div>
        </div>
    </div>
    <span type="button" class="layui-btn layui-btn-sm" id="aftermarket_back_content_img_upload">
        <i class="layui-icon">&#xe67c;</i>上传图片
    </span>
    <ul id="aftermarket_back_content_imgUlContainer">

    </ul>
    {{# } }}
</script>

<script src="${ctx}/static/js/customer/ebay/aftermarket.js"></script>