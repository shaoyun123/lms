<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>case</title>

<style>
    .case_back_container {
        border: 1px solid #ccc;
        margin-bottom: 10px;
        border-radius: 2px;
    }
    .case_back_title {
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        background: #eee;
        border-bottom: 1px solid #ccc;
    }
    .case_back_content {
        padding: 10px;
    }
    .sendProductInfoTable >tbody > tr {
        height:32px;
        line-height: 32px;
    }
    .case_detail_mr10 {
       margin-right: 10px;
    }
    .case_detail_flexH {
        display: flex;
        justify-content: flex-start;
        margin: 10px 0;
    }
    .case_container {
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
    .case_detail_disN {
        display: none !important;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="case_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="case_orgFilter" class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">客服人员</label>
                                <div class="layui-input-block">
                                    <select name="customServicerId"  class="users_hp_custom" data-rolelist="ebay客服专员" lay-filter="case_sellerFilter" data-type="customservicer" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="case_storeFilter" lay-search="" >
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
                                        <option value="caseId">纠纷编号</option>
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
                                    <input type="text" class="layui-input" autocomplete="off" name="times" id="case_receive_date" readonly>
                                </div>
                            </div>
                            <input type="hidden" value="0" id="case_disposeStatusType">
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="case_submit">查询</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="caseCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header" style="display:flex;justify-content:space-between;">
                        <div class="layui-tab" lay-filter="case-tabs" id="case-tabs" style="display:flex;align-items: center;">
                            <ul class="layui-tab-title">
                                <li class="layui-this">未处理(<span id="case_not_handle_number">0</span>)</li>
                                <li>已处理(<span id="case_already_handle_number">0</span>)</li>
                                <li>关闭(<span id="case_already_close_number">0</span>)</li>
                                <li>全部(<span id="case_all_handle_number">0</span>)</li>
                            </ul>
                        </div>
                        <div style="display:flex;align-items: center;">
                            <span class="layui-btn layui-btn-sm" id="case_whiteList" style="margin-right:10px;">白名单</span>
                            <input type="text" class="layui-input" id="case_batchTimes" readonly style="width:300px;">
                            <span class="layui-btn layui-btn-sm" id="case_batchHandle" style="margin-left:10px;">批量同步</span>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="case_table"  lay-filter="case_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 产品信息 --%>
<script type="text/html" id="case_info">
    <div style="text-align: left;">
      <div><strong>标题:</strong>{{d.itemTitle}}</div>
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

<%-- 纠纷金额 --%>
<script type="text/html" id="case_money">
    <div>{{d.currency}}:{{d.claimAmt}}</div>
</script>
<%-- 时间 --%>
<script type="text/html" id="case_times">
    <div style="text-align: left;">
        <div>
            <strong>售出时间:</strong>
            <span>{{Format(d.pyOrderTime, 'yyyy-MM-dd hh:mm:ss')}}</span>
        </div>
        {{# if(d.creationDate){ }}
        <div>
            <strong>发起时间:</strong>
            <span>{{Format(d.creationDate, 'yyyy-MM-dd hh:mm:ss')}}</span>
        </div>
        {{# } }}
        {{# if(d.caseClosureDate){ }}
        <div>
            <strong>关闭时间:</strong>
            <span>{{Format(d.caseClosureDate, 'yyyy-MM-dd hh:mm:ss')}}</span>
        </div>
        {{# } }}
    </div>
</script>
<%-- 操作 --%>
<script type="text/html" id="case_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-normal"  lay-event="detail">详情</span><br>
        {{# if(d.disposeStatus !=4){ }}
        <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="auto">同步</span>
        {{# } }}
    </div>
</script>

<%-- 详情页面 --%>
<script type="text/html" id="caseDetailLayero">
    <div id="case_detail_container" style="padding: 20px;">
    </div>
</script>
<%-- 详情页面模板 --%>
<script type="text/html" id="case_detail_containerTpl">
    <%-- 物品详情 --%>
    <div class="case_detail_info">
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
                        <td>{{d.msgCaseEbay.itemTitle}}</td>
                        <td>{{Format(d.msgCaseEbay.pyOrderTime,'yyyy-MM-dd hh:mm:ss')}}</td>
                        <td>{{d.msgCaseEbay.currency}}:{{d.msgCaseEbay.claimAmt}}</td>
                        <td>{{d.msgCaseEbay.pyOrderNum}}</td>
                        <td>{{d.msgCaseEbay.ebayOrderId}}</td>
                        <td>{{d.msgCaseEbay.buyer}}</td>
                        <td>{{d.msgCaseEbay.seller}}</td>
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
                <div class="case_back_container">
                    <%-- 纠纷处理 --%>
                   <div class="case_back_title">纠纷处理</div>
                   <div class="case_back_content">
                        {{# if(d.msgCaseEbay.disposeStatus ==0){ }}
                        <div class="case_detail_flexH">
                            <strong class="case_detail_mr10">提示信息:</strong>
                            <div>
                                请在<span style="color: red;">{{Format(d.msgCaseEbay.respondByDate, 'yyyy-MM-dd')}}</span>前处理,否则买家可要求eBay介入
                            </div>
                        </div>
                        {{# } }}
                        <%-- {{# if(d.msgCaseEbay.disposeStatus !=4){ }} --%>
                        <div class="case_detail_flexH case_detail_file">
                            <strong class="case_detail_mr10">处理方案:</strong>
                            <div class="layui-form">
                                <input type="radio" lay-filter="case_handle_filter" name="caserHandle" value="issueFullRefund" title="全额退款" checked>
                                <input type="radio" lay-filter="case_handle_filter" name="caserHandle" value="appeal" title="申诉">
                                <input type="radio" lay-filter="case_handle_filter" name="caserHandle" value="provide_return_address" title="提供退货地址">
                            </div>
                        </div>
                        <div class="case_detail_flexH case_detail_money">
                            <strong class="case_detail_mr10">退款金额:</strong>
                            <div>
                                <span>{{d.msgCaseEbay.currency}}:</span>
                                <span>{{d.msgCaseEbay.claimAmt}}</span>
                            </div>
                        </div>
                        <div class="case_detail_flexH  case_detail_addressInfo case_detail_disN">
                            <strong class="case_detail_mr10">类型:</strong>
                            <div class="input500 layui-form">
                                <select name="addressType" id="case_addressType" lay-search>
                                    <option value="BUSINESS" selected>BUSINESS</option>
                                    <option value="DIPLOMATIC">DIPLOMATIC</option>
                                    <option value="MILITARY">MILITARY</option>
                                    <option value="OTHER">OTHER</option>
                                    <option value="PO_BOX">RESIDENCE</option>
                                    <option value="RESIDENCE">RESIDENCE</option>
                                </select>
                            </div>
                        </div>
                        <div class="case_detail_flexH case_detail_addressInfo case_detail_disN">
                            <strong class="case_detail_mr10">姓名:</strong>
                            <div class="input500">
                                <input type="text" class="layui-input" id="case_detail_name">
                            </div>
                        </div>
                        <div class="case_detail_flexH  case_detail_addressInfo case_detail_disN">
                            <strong class="case_detail_mr10">国家:</strong>
                            <div class="input500">
                                <input type="text" class="layui-input" id="case_detail_country">
                            </div>
                        </div>
                        <div class="case_detail_flexH  case_detail_addressInfo case_detail_disN">
                            <strong class="case_detail_mr10">州省:</strong>
                            <div class="input500">
                                <input type="text" class="layui-input" id="case_detail_province">
                            </div>
                        </div>
                        <div class="case_detail_flexH  case_detail_addressInfo case_detail_disN">
                            <strong class="case_detail_mr10">城市:</strong>
                            <div class="input500">
                                <input type="text" class="layui-input" id="case_detail_city">
                            </div>
                        </div>
                        <div class="case_detail_flexH  case_detail_addressInfo case_detail_disN">
                            <strong class="case_detail_mr10">县区:</strong>
                            <div class="input500">
                                <input type="text" class="layui-input" id="case_detail_county">
                            </div>
                        </div>
                        <div class="case_detail_flexH  case_detail_addressInfo case_detail_disN">
                            <strong class="case_detail_mr10">街道:</strong>
                            <div class="input500">
                                <input type="text" class="layui-input" id="case_detail_street1">
                            </div>
                        </div>
                        <div class="case_detail_flexH  case_detail_addressInfo case_detail_disN">
                            <strong class="case_detail_mr10">门牌:</strong>
                            <div class="input500">
                                <input type="text" class="layui-input" id="case_detail_street2">
                            </div>
                        </div>
                        <div class="case_detail_flexH  case_detail_addressInfo case_detail_disN">
                            <strong class="case_detail_mr10">邮编:</strong>
                            <div class="input500">
                                <input type="text" class="layui-input" id="case_detail_code">
                            </div>
                        </div>
                        <div class="case_detail_flexH case_container_leave">
                            <strong class="case_detail_mr10">留言:</strong>
                            <div contentEditable="true" class="case_container" id="case_container_leave">    
                            </div>
                        </div>
                        <%-- {{# } }} --%>
                   </div>
                </div>
                <%-- 纠纷详情 --%>
                <div class="case_back_container">
                    <div class="case_back_title">纠纷详情</div>
                    <div class="case_back_content">
                        <div style="display:flex;justify-content: space-between;">
                            <div style="width:50%;text-align:left;">
                                <div class="case_back_content"><strong class="case_detail_mr10">纠纷编号:</strong>{{d.msgCaseEbay.caseId}}</div>
                                <div class="case_back_content"><strong class="case_detail_mr10">发起日期:</strong>{{Format(d.msgCaseEbay.creationDate, 'yyyy-MM-dd')}}</div>
                                <div class="case_back_content"><strong class="case_detail_mr10">发起原因:</strong>{{d.msgCaseEbay.escalateReason}}</div>
                                <div class="case_back_content"><strong class="case_detail_mr10">买家诉求:</strong>{{d.msgCaseEbay.buyerrequested}}</div>
                            </div>
                            <div style="width:50%;text-align:left;">
                                <div class="case_back_content"><strong class="case_detail_mr10">物品数量:</strong>{{d.msgCaseEbay.caseQuantity}}</div>
                                <div class="case_back_content"><strong class="case_detail_mr10">纠纷金额:</strong>{{d.msgCaseEbay.currency}}{{d.msgCaseEbay.claimAmt}}</div>
                                <div class="case_back_content"><strong class="case_detail_mr10">纠纷状态:</strong>{{d.msgCaseEbay.caseStatus}}</div>
                                <div class="case_back_content"><strong class="case_detail_mr10">关闭描述:</strong>{{d.msgCaseEbay.closeReason}}</div>
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
                                        {{#  layui.each(d.msgCaseHistoryEbayList, function(index, item){ }}
                                        <tr>
                                            <td>{{Format(item.eventDate,'yyyy-MM-dd hh:mm:ss')}}</td>
                                            <td>{{item.eventActor}}</td>
                                            <td>{{item.eventAction}}</td>
                                            <td>{{item.eventDescription}}</td>
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
                    <span>{{d.msgCaseEbay.orderStatus || ''}}</span>
                </div>
                <div style="height:32px;line-height:32px;">
                    <strong>发货时间:</strong>
                    <span>{{Format(d.msgCaseEbay.pyOrderTime,'yyyy-MM-dd hh:mm:ss')}}</span>
                </div>
                <div style="height:32px;line-height:32px;">
                    <strong>跟踪号:</strong>
                    <span>{{d.msgCaseEbay.shippingTrackingNumber || ''}}</span>
                </div>
                <div style="height:32px;line-height:32px;">
                    <strong>承运商:</strong>
                    <span>{{d.msgCaseEbay.shippingCarrier || ''}}</span>
                </div>
                <div style="height:32px;line-height:32px;margin-bottom: 20px">
                    <strong>物流状态:</strong>
                    <span>{{d.msgCaseEbay.shippingCurrentStatus || ''}}</span>
                </div> 
            </div>
        </div>
    </div>
</script>

<%-- 白名单弹框 --%>
<script type="text/html" id="case_whiteList_layer">
    <div class="layui-card">
        <div class="layui-card-header" style="display:flex;justify-content:space-between;">
            <div style="display:flex;align-items:center;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="whiteListBatch" style="margin-right:10px;">批量删除</span>
                <div><input type="text" class="layui-input" id="whiteListInput" placeholder="多个逗号隔开"></div>
                <div style="margin-left:15px;"><span class="layui-btn layui-btn-sm layui-btn-normal" id="whiteListAdd">添加</span></div>
            </div>
            <div style="display:flex;align-items:center;">
                <div><input type="text" class="layui-input" id="whiteListInputSearch" placeholder="多个逗号隔开"></div>
                <div style="margin-left:15px;"><span class="layui-btn layui-btn-sm layui-btn-normal" id="whiteListSearch">搜索</span></div>
            </div>
        </div>
        <div class="layui-card-body">
            <table id="case_whiteList_layerTable" lay-filter="case_whiteList_layerTable"></table>
        </div>
    </div>
</script>
<%-- 白名单表格删除 --%>
<script type="text/html" id="whiteList_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</span>
    </div>
</script>

<script src="${ctx}/static/js/customer/ebay/case.js"></script>