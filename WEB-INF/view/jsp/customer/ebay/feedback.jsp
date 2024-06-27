<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>FeedBack</title>
<link rel="stylesheet" href="${ctx}/static/font_iconfont/iconfont.css" media="all">
<style>
    .feedback_commentDialog_content {
        display:flex;
        justify-content:flex-end;
    }
    .feedback_commentDialog {
        display: flex;
        box-sizing: border-box;
    }
    .feedback_commentDialog>div.feedback_commentDialog_middle {
        margin: 0 10px;
    }
    .feedback_red {
        color: #ff0000;
        font-size: 20px;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="feedback_searchForm">
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
                                <label class="layui-form-label">买家账号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="commentingUser">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">普源订单号</label>
                                <div class="layui-input-block">
                                   <input type="text" class="layui-input" name="pyOrderNum">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">买家评价</label>
                                <div class="layui-input-block">
                                   <select name="commentType" lay-search>
                                      <option value="1">全部</option>
                                      <option value="2">好评</option>
                                      <option value="3">中评</option>
                                      <option value="4">差评</option>
                                   </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">留评角色</label>
                                <div class="layui-input-block">
                                   <select name="recipientRole" lay-search>
                                      <option value="">全部</option>
                                      <option value="Seller">作为卖家</option>
                                      <option value="Buyer">作为买家</option>
                                   </select>
                                </div>
                            </div>
                            
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">卖家回复</label>
                                <div class="layui-input-block">
                                   <select name="replyType" lay-search>
                                      <option value="4">全部</option>
                                      <option value="0">未回复</option>
                                      <option value="1">已回复</option>
                                      <option value="2">回复中</option>
                                      <option value="3">回复失败</option>
                                   </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding:0 15px;">
                                   <select name="searchType" lay-search>
                                     <option value="itemId">物品号</option>
                                     <option value="prodSSku">商品子SKU</option>
                                     <option value="prodPSku">商品父SKU</option>
                                     <option value="itemTitle">产品标题</option>
                                   </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchTypeVal">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单时间</label>
                                <div class="layui-input-block">
                                   <input type="text" class="layui-input" id="feedback_times" name="times" readonly>
                                </div>
                            </div>
                            <input type="hidden" value="1" id="feedback_pageType">
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="feedback_submit">查询</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="feedbackContentCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header" style="display:flex;justify-content:space-between;">
                        <div class="layui-tab" lay-filter="feedback-tabs" id="feedback-tabs">
                            <ul class="layui-tab-title">
                                <li class="layui-this">待评价(<span id="wait_evaluate_number">点击显示</span>)</li>
                                <li>已评价(<span id="already_evaluate_number">点击显示</span>)</li>
                                <li>全部(<span id="all_evaluate_number">点击显示</span>)</li>
                                <li>回复失败(<span id="fail_evaluate_number">点击显示</span>)</li>
                            </ul>
                        </div>
                        <%-- <div>
                          <a href="javascript:;" class="layui-btn layui-btn-sm" id="feedback_batchHandle">批量留评</a>
                        </div> --%>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="feedback_table"  lay-filter="feedback_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<%-- 店铺/客服模板 --%>
<script id="feedback_table_person"  type="text/html">
    <div style="text-align:left;">
        <div><strong>店铺:</strong>{{d.storeAcct}}</div>
        <div><strong>客服:</strong>{{d.customServicer}}</div>
    </div>
</script>
<%-- 产品信息 --%>
<script id="feedback_table_itemTitle" type="text/html">
    <div style="text-align:left;">
      <div>{{d.itemTitle}}</div>
      <div style="display:flex;justify-content:space-between;">
         <span>ItemID：<a  href="http://www.ebay.co.uk/itm/{{d.itemId}}" target="_blank" style="color:#4ab2fe;">{{d.itemId}}</a></span>
         <span>SKU：<span  style="color:#4ab2fe;">{{d.prodSSku}}</span></span>
      </div>  
    </div>
</script>
<%-- 买家账号 --%>
<script id="feedback_table_account" type="text/html">
    <div style="text-align:left;">
        {{# if(d.recipientRole == 'Buyer'){ }}
        <span class="iconfont icon-tubiaozhizuomoban_fuzhi feedback_red" title="我们是买家"></span>
        {{# } }}
        <a href="http://myworld.ebay.com/{{d.commentingUser}}" target="_blank" style="color:#1e9efe;">{{d.commentingUser}}<a>
    </div>
</script>
<%-- 订单信息 --%>
<script id="feedback_table_orderInfo"  type="text/html">
    <div style="text-align:left;">
        <div><strong>订单号:</strong>{{d.pyOrderNum}}</div>
        {{# if (d.pyOrderNum == null || d.pyOrderNum == '') { }}
            <div><strong>订单时间:</strong></div>
        {{# } else { }}
            <div><strong>订单时间:</strong>{{d.pyOrderTime}}</div>
        {{# } }}
    </div>
</script>
<%-- 买家评论 --%>
<script id="feedback_commentText" type="text/html">
    <div style="text-align:left;">
        <div>
            <strong>买家评价:</strong>
            {{# if(d.commentType=='Positive'){ }}
            <span class="flagIcon flagAdd"></span>
            {{# }else if(d.commentType=='Neutral'){ }}
            <span class="flagIcon flagRadio"></span>
            {{# }else{ }}
            <span class="flagIcon flagMinus"></span>
            {{# } }}
            {{d.commentText}}<br>
            <span style="color:#a2a2a2;">「 {{d.commentTime}}」</span>
        </div>
       {{# if(d.feedbackResponse){ }}
       <div><strong>卖家回复:</strong>{{d.feedbackResponse}}</div>
       {{# } }}
    </div>
</script>  
<%-- 操作栏 --%>
<script type="text/html" id="feedback_tableIdBar">
  <div><a class="layui-btn layui-btn-xs" lay-event="evaluate">回复</a></div>
</script>
<%-- 留评弹框 --%>
<script type="text/html" id="feedback_dialogLayer">
  <div style="padding:20px;"  id="feedback_commentDialog_tableContainer">
      
  </div>
</script>

<%-- 留评表格模板 --%>
<script type="text/html" id="feedback_commentDialog_tableTpl">
    <div class="feedback_commentDialog_content">
        <div class="layui-form feedback_commentDialog">
            <div class="layui-form-item" style="position:absolute;bottom:30px;right:50px;">
            {{# if(d.dataArr[0].delayReply){ }}
                <input type="checkbox" name="delayReply" title="延迟回复" lay-skin="primary" checked> 
            {{# }else{ }}
                <input type="checkbox" name="delayReply" title="延迟回复" lay-skin="primary"> 
            {{# } }}
            </div>
            <div class="layui-form-item">
                <select name="feedback_commentDialog_middle_type" lay-filter="feedback_commentDialog_middle_type" lay-search>
                <option value="">请选择</option>
                {{# if(d.emailType.length){ }}
                    {{#  layui.each(d.emailType, function(index, item){ }}
                    <option value="{{item.name}}">{{item.name}}</option>
                    {{# }) }}
                {{# } }}
                </select>
            </div>
            <div class="layui-form-item feedback_commentDialog_middle">
                <select name="feedback_commentDialog_middle_name" lay-search>
                <option value="">请选择</option>
                {{# if(d.nameType.length){ }}
                    {{#  layui.each(d.nameType, function(index, item){ }}
                    <option value="{{item.id}}">{{item.name}}</option>
                    {{# }) }}
                {{# } }}
                </select>
            </div>
            <div class="layui-form-item">
                <a href="javascript:;" class="layui-btn layui-btn-sm" id="feedback_commentDialog_config">应用</a>
            </div>
        </div>
    </div>
      <div>
            <table class="layui-table">
                <thead>
                    <tr>
                        <th>产品信息</th>
                        <th>买家账号</th>
                        <th>买家评价</th>
                        <th>回复买家</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="feedback_commentDialog_table_tbody">
                    {{#  layui.each(d.dataArr, function(index, item){ }}
                    <tr>
                        <td>
                        {{item.itemTitle}}
                        <input type="hidden" value="{{item.id}}">
                        </td>
                        <td>{{item.commentingUser}}</td>
                        <td>{{item.commentText}}</td>
                        <td class="comment_textarea">
                        <textarea class="layui-textarea"></textarea>
                        </td>
                        <td><a href="javascript:;" class="layui-btn layui-btn-danger layui-btn-xs commentDialog_table_tbody_remove">移除</a></td>
                    </tr>
                {{# }) }}
                </tbody>
            </table>
      </div>
</script>



<script src="${ctx}/static/js/customer/ebay/feedback.js"></script>