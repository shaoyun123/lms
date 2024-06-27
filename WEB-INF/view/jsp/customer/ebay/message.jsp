<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>Ebay Message</title>
<link rel="stylesheet" href="${ctx}/static/font_iconfont/iconfont.css" media="all">
<style type="text/css">
    .redFont {
        font-size: 24px;
        color:red;
    }
    .blueFont {
        color: #9bdaf3;
        font-size: 24px;
    }
    .response_container {
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
    }
    .response_right {
        width: 340px;
    }
    .respose_left_msg{
        width: 700px;
        height: 630px;
        border: 1px solid #ccc;
    }
    .respose_left_btn {
        width: 700px;
        margin-top: 10px;
        text-align: right;
    }
    .repsonse_left_msg_title,
    .repsonse_left_msg_bar{
        height: 32px;
        line-height: 32px;
        padding-left: 10px;
        border-bottom: 1px solid #ccc;
    }
    .repsonse_left_msg_bar {
        border-top: 1px solid #ccc;
        display: flex;
    }
    .repsonse_left_msg_content {
        padding: 5px 13px;
        height: 420px;
        overflow:scroll;
    }
    .repsonse_left_msg_content_buyer {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    .repsonse_left_msg_content_buyer_content {
        min-height: 40px;
        line-height: 40px;
        padding: 5px 20px 5px 10px;
        background: #eeeeee;
        margin: 8px 3px 8px 10px;
        border-radius: 5px;
    }
    .repsonse_left_msg_content_seller {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    .repsonse_left_msg_content_seller_content {
        min-height: 40px;
        line-height: 40px;
        padding: 5px 20px 5px 10px;
        /* text-align: right; */
        background: #eeeeee;
        margin: 8px 3px 8px 10px;
        border-radius: 5px;
    }
    .repsonse_left_msg_title_return {
        height: 146px;
        outline: none;
    }
    .message_model_ul {
        position: absolute;
        width: 300px;
        min-height: 100px;
        padding: 10px 0;
        background: #fff;
        overflow-y: scroll;
        top: -115px;
        text-align: center;
        left: -90px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 5px 0 rgba(0,34,77,0.3);
    }
    .message_model_ul > li {
        cursor:pointer;
    }
    .itemId,
    .itemId:hover {
        color: #428bca;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                  <form class="layui-form" id="message_searchForm">
                    <div class="layui-form-item">
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">部门</label>
                          <div class="layui-input-block">
                              <select name="orgId" lay-filter="feedback_orgFilter" class="orgs_hp_custom" lay-search>
                                  <option value=""></option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">客服人员</label>
                          <div class="layui-input-block">
                              <select name="salePersonId"  class="users_hp_custom" data-rolelist="ebay客服专员" lay-filter="feedback_sellerFilter" data-type="customservicer" lay-search="">
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">店铺</label>
                          <div class="layui-input-block">
                              <select name="storeAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="feedback_storeFilter" lay-search="" >
                                  <option value="">全部</option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <div class="layui-form-label" style="padding:0 15px;">
                              <select name="messageType" lay-search>
                                <option value="sender">发件人</option>
                                <option value="subject">消息主题</option>
                                <option value="itemId">物品号</option>
                              </select>
                          </div>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" autocomplete="off" name="messageTypeVal">
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">首次消息</label>
                          <div class="layui-input-block">
                              <select name="isFirstMsg" lay-search>
                                  <option value="">全部</option>
                                <option value="true">是</option>
                                <option value="false">否</option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">关联订单</label>
                          <div class="layui-input-block">
                              <select name="isAssociateOrder" lay-search>
                                  <option value="">全部</option>
                                <option value="true">有</option>
                                <option value="false">无</option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">消息类型</label>
                          <div class="layui-input-block">
                              <select name="msgType" lay-search>
                                <option value="">全部</option>
                                <option value="is_from_buyer">买家消息</option>
                                <option value="is_from_ebay">系统消息</option>
                                <option value="is_high_priority">重要通知</option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">回复状态</label>
                          <div class="layui-input-block">
                              <select name="isReplied" lay-search>
                                <option value="">全部</option>
                                <option value="0">未回复</option>
                                <option value="1">已回复</option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">颜色标记</label>
                          <div class="layui-input-block">
                              <select name="flagColor" lay-search>
                                <option value="">全部</option>
                                <option value="1">红旗</option>
                                <option value="0">白旗</option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">排序</label>
                          <div class="layui-input-block">
                              <select name="orderByType" lay-search>
                                <option value="4"></option>
                                <option value="4">店铺</option>
                                <option value="3">买家id</option>
                                <option value="1">时间降序</option>
                                <option value="2">时间升序</option>
                              </select>
                          </div>
                      </div>
                      <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">接收时间</label>
                          <div class="layui-input-block">
                            <input type="text" class="layui-input" autocomplete="off" name="times" id="message_receive_date" readonly>
                          </div>
                      </div>
                      <input type="hidden" value="0" id="message_pageType">
                      <div class="layui-col-md2 layui-col-lg2 pl20">
                          <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="message_submit">查询</span>
                          <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                      </div>
                    </div>
                  </form>
                </div>
            </div>
            <div class="layui-card" id="messageContentCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header" style="display:flex;justify-content:space-between;">
                        <div class="layui-tab" lay-filter="message-tabs" id="message-tabs" style="display:flex;align-items: center;">
                            <ul class="layui-tab-title">
                                <li class="layui-this">未读(<span id="not_read_number">0</span>)</li>
                                <li>已读(<span id="already_read_number">0</span>)</li>
                                <li>全部(<span id="all_read_number">0</span>)</li>
                            </ul>
                            <span style="margin-left:15px;">
                                <a href="javascript:;" class="layui-btn layui-btn-sm markAlreadyRead">标记已读</a>
                                <a href="javascript:;" class="layui-btn layui-btn-sm disN markNotRead">标记未读</a>
                                <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-normal" id="message_changeColorBtn">标记<span class="flagIcon flagRed"></span></a>
                                <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-normal" id="message_unchangeColorBtn">取消<span class="flagIcon flagWhite"></span></a>
                            </span>
                        </div>
                        <div>
                            <button class="layui-btn layui-btn-sm" id="message_exportBtn" type="button" style="margin-left: 30px">导出</button>
                            <a href="javascript:;" class="layui-btn layui-btn-sm" id="message_batchHandle">批量查看</a>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="message_table"  lay-filter="message_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 图片模板 --%>
<script type="text/html" id="message_image">
    <div>
        <img class="img_show_hide imgCss imgBorder" width="60" height="60" src="{{d.firstImage}}" onerror="layui.admin.img_noFind()">
    </div>
</script>
<%-- 颜色模板 --%>
<script type="text/html" id="message_flagColor">
    <div>
        {{# if(d.flagColor == '0'){ }}
        <span class="flagIcon flagWhite"></span>
        {{# }else if(d.flagColor == 1){ }}
        <span class="flagIcon flagRed"></span>
        {{# }else if(d.flagColor == 2){ }}
        <span class="flagIcon flagBlue"></span>
        {{# }else if(d.flagColor == 3){ }}
        <span class="flagIcon flagGreen"></span>
        {{# }else if(d.flagColor == 4){ }}
        <span class="flagIcon flagYellow"></span>
        {{# }else if(d.flagColor == 5){ }}
        <span class="flagIcon flagPurple"></span>
        {{# } }}
    </div>
</script>

<script type="text/html" id="ebay_message_title_tpl">
    <a class="itemId" target="_blank" href="{{d.seoViewUrl}}">{{d.itemId || ''}} </a>
</script>

<%-- 消息主题处理 --%>
<script type="text/html" id="message_subject">
   <div style="text-align:left;">
      {{# if(d.isFirstMsg == true && d.isReplied == true){ }}
        <div>
            <span class="iconfont icon-new redFont" title="首次消息"></span>
            <span class="iconfont icon-huifu blueFont" title="已回复"></span>
            <span>{{ d.subject }}</span>
        </div>
      {{# }else if(d.isFirstMsg == true && d.isReplied == false){ }}
        <div>
            <span class="iconfont icon-new redFont"  title="首次"></span>
            <span>{{ d.subject }}</span>
        </div>
      {{# }else if(d.isFirstMsg == false && d.isReplied == true){ }}
        <div>
            <span class="iconfont icon-huifu blueFont" title="已回复"></span>
            <span>{{ d.subject }}</span>
        </div>
      {{# }else{ }}
        <div>
            <span>{{ d.subject }}</span>
        </div>
      {{# } }}
      {{# if(d.mediaUrls){ }}
        {{#  layui.each(d.mediaUrls.split(','), function(index, item){ }}
            <a href="{{item}}" target="_blank" style="color:#1e9fff">图片{{index}}</a>
        {{# }) }}
      {{# } }}
   </div>
</script>
<%-- 操作栏 --%>
<script type="text/html" id="message_tableIdBar">
    <div>
       <%-- {{# if(d.isReplied=false && d.folderId==0){  }} --%>
       <%-- <span class="layui-btn layui-btn-xs layui-btn-normal"  lay-event="response">回复</span> --%>
       <%-- {{# } }} --%>
       {{# if(d.sender == 'eBay'){ }}
        <a class="layui-btn layui-btn-xs" href="${ctx}/static/msgDetailTemplate.html?id={{d.id}}" target="_blank" lay-event="detail">详情</a><br>
       {{# }else { }}
        <a class="layui-btn layui-btn-xs layui-btn-normal"  href="${ctx}/static/msgResponseTemplate.html?id={{d.id}}&storeAcctId={{d.platAcctId}}&buyer={{d.buyer}}" target="_blank" lay-event="response">回复</a><br>
       {{# } }}

       <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="logs">日志</span><br>
       {{# if(d.isRead == false){ }}
       <span class="layui-btn layui-btn-xs" lay-event="markReaded">标记已读</span>
       {{# }else{ }}
       <span class="layui-btn layui-btn-xs"  lay-event="markUnread">标记未读</span>
       {{# } }}
    </div>
</script>

<%-- 回复弹框 --%>

<script type="text/html" id="message_responseLayer">
<div id="response_container" class="response_container">
</div>
</script>
<script type="text/html" id="response_containerTpl">
    <div class="respose_left">
        <div class="respose_left_msg">
            <div class="repsonse_left_msg_title">
              <span style="color: #5b8ac0;font-weight: 700;font-size: 18px;">{{d.ebayMsg.sender}}</span> 
              <span style="color: #adaeb0;font-size: 12px;margin-left: 10px;">(店铺:<span id="respose_left_msg_storename">{{d.ebayMsg.storeName}}</span>)</span>
            </div>
            <div class="repsonse_left_msg_content">
                {{# if(d.msgDialogEbayDtos){ }}
                {{#  layui.each(d.msgDialogEbayDtos, function(index, item){ }}
                    {{# if(item.msgFromWho == 'buyer'){ }}
                    <div class="repsonse_left_msg_content_buyer">
                       <input type="hidden" value="{{item.id}}">
                        <div>
                        <span style="color: #5b8ac0;font-weight: 700;font-size: 14px;" class="repsonse_left_msg_content_buyer_sender">
                        {{item.sender}}
                        </span>
                        <span style="color: #b1b1b3;font-size: 12px;margin-left: 10px;">
                        {{ Format(item.sendTime, 'yyyy-MM-dd hh:mm:ss')}}
                        </span>
                        </div>
                        <div class="repsonse_left_msg_content_buyer_content">
                        {{item.msgContent}}
                        </div>
                    </div>
                    {{# }else{ }}
                    <div class="repsonse_left_msg_content_seller">
                        <div>
                        <span style="color: #5b8ac0;font-weight: 700;font-size: 14px;">
                        {{item.sender}}
                        </span>
                        <span style="color: #b1b1b3;font-size: 12px;margin-left: 10px;">
                        {{ Format(item.sendTime, 'yyyy-MM-dd hh:mm:ss')}}
                        </span>
                        </div>
                        <div class="repsonse_left_msg_content_seller_content">
                        {{item.msgContent}}
                        </div>
                    </div>
                    {{# } }}
                {{# }) }}
                {{# } }}
            </div>
            <div class="repsonse_left_msg_bar">
               <div class="layui-btn layui-btn-xs layui-btn-normal" style="margin-top:5px;" id="message_img_upload">上传图片</div>
               <div style="margin-left:10px;position:relative;" id="message_insert_model">
                   <span  class="layui-btn layui-btn-xs layui-btn-normal"  id="message_insert_model_btn">插入模板</span>
               </div>
            </div>
            <div class="repsonse_left_msg_title_return" contentEditable="true" id="repsonse_left_msg_title_return">
              
            </div>
        </div>
        <div class="respose_left_btn">
        <span class="layui-btn layui-btn-sm layui-btn-normal" id="respose_left_btn_upload">发送</span>
        <%-- <span class="layui-btn layui-btn-sm layui-btn-primary">关闭</span> --%>
        </div>
    </div>
    <div class="response_right">
        <div class="response_right_product layui-card">
        <div class="layui-card-header"><strong>商品信息</strong></div>
        <div class="layui-card-body" style="display:flex;">
            <div>
                <img  class="img_show_hide imgCss imgBorder" width="60" height="60" src="{{d.ebayMsg.firstImage}}" onerror="layui.admin.img_noFind()">       
            </div>
            <div>
               <div>{{d.ebayMsg.itemTitle}}</div>
               <div style="display:flex;justify-content:space-between;">
                <div>{{d.ebayMsg.itemId}}</div>
                {{# if(d.ebayMsg.prodSSku){ }}
                <div>{{d.ebayMsg.prodSSku}}</div>
                {{# } }}
               </div>
            </div>
        </div>
        </div>
    {{# if(d.msgOrderInfoDtos){ }}
        <div class="response_right_order layui-card">
            <div class="layui-card-header"><strong>订单信息</strong></div>
            <div class="layui-card-body">
            <div>普源编号:({{d.msgOrderInfoDtos[0].nid}}, {{d.msgOrderInfoDtos[0].orderstatus}},币种:{{d.msgOrderInfoDtos[0].currencycode}})</div>
            <div>订单时间:{{ Format(d.msgOrderInfoDtos[0].ordertime, "yyyy-MM-dd hh:mm:ss")}}</div>
            <div>发货时间:{{ Format(d.msgOrderInfoDtos[0].closingtime, "yyyy-MM-dd hh:mm:ss")}}</div>
            </div>
        </div>
        <div class="response_right_accept layui-card">
            <div class="layui-card-header"><strong>收货信息</strong></div>
            <div class="layui-card-body">
                <div>收件人:{{d.msgOrderInfoDtos[0].shiptoname}}</div>
                <div>收货地址:{{d.msgOrderInfoDtos[0].shiptostreet}}</div>
            </div>
        </div>
        <div class="response_right_logistic layui-card">
            <div class="layui-card-header"><strong>物流信息</strong></div>
            <div class="layui-card-body">
                <div>买家指定:{{d.msgOrderInfoDtos[0].custom}}</div>
                <div>物流方式:{{d.msgOrderInfoDtos[0].logiscode}}</div>
                <div>跟踪号:{{d.msgOrderInfoDtos[0].trackno}}</div>
            </div>
        </div>
        <div class="response_right_log layui-card">
            <div class="layui-card-header"><strong>操作日志</strong></div>
            <div class="layui-card-body">
            {{#  layui.each(d.msgOrderInfoDtos[0].pTradelogs, function(index, item){ }}
                <div>{{item.logs}}</div>
            {{# }) }}
            </div>
        </div>
    {{# } }}
        <%-- <div>更多订单</div> --%>
    </div>
</script>

<%-- 日志弹框 --%>
<script type="text/html" id="message_logsLayer">
    <div id="message_logsLayer_container"></div>
</script>
<%-- 日志模板 --%>
<script type="text/html" id="message_logsLayer_containerTpl">
    <table class="layui-table">
        <thead>
            <tr>
                <th>日期</th>
                <th>操作人</th>
                <th>操作类型</th>
                <th>描述</th>
            </tr>
        </thead>
        <tbody>
            {{#  layui.each(d, function(index, item){ }}
            <tr>
                <td>{{item.createTimeStr}}</td>
                <td>{{item.creator}}</td>
                <td>{{item.operTypeStr}}</td>
                <td>{{item.operDesc}}</td>
            </tr>
            {{# }) }}
        </tbody>
    </table>
</script>

<script src="${ctx}/static/js/customer/ebay/message.js"></script>