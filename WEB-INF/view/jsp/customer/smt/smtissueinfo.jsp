<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>smt纠纷</title>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css">
<link rel="stylesheet" href="${ctx}/static/style/dispute.css?v=3">

<style>
    #smtissueinfoCard .fixeddiv2{
        left: 101px;
        right: 60px;
    }
    /* 多行文本溢出隐藏 */
    .hideFourLine{
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        position: relative;
    }
    .hideFourLine::before{
        float: right;
        height: calc(100% - 26px);
        width: 0;
        content: '';
    }
    .hideFourLine::after{
        content: '';
        width: 999vw;
        height: 999vw;
        position: absolute;
        box-shadow: inset calc(30px - 999vw) calc(30px - 999vw) 0 0 #fff;
        margin-left: -30px;
    }
    .moreLineText::after{
        visibility: hidden;
    }
    .moreLineText .infoDetailBtn::after{
        content:'收起'
    }
    tr:hover .hideFourLine::after{
        box-shadow: inset calc(30px - 999vw) calc(30px - 999vw) 0 0 #f8f8f8;
        transition: all 0.3s;
    }
    .infoDetailBtn{
        float: right;
        color: #1e90fe;
        cursor: pointer;
        clear: both;
    }
    .infoDetailBtn::after{
        content:'展开';
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="aliExpress_online_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="smt_online_depart_sel_issue" lay-search lay-filter="smt_issue_depart_sel_issue"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">smt客服人员</label>
                                <div class="layui-input-block">
                                    <select  id="smt_online_salesman_sel_issue" lay-search lay-filter="smt_issue_salesman_sel_issue"  class="users_hp_custom" data-rolelist="smt客服专员" data-type="customservicer">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select
                                    class="users_hp_store_multi"
                                    data-platcode="aliexpress"
                                    id='smt_online_store_sel_issue'
                                    xm-select="smt_online_store_sel_issue"
                                    xm-select-type="1"
                                    xm-select-search-type="dl"
                                    xm-select-search xm-select-skin="normal"
                                    lay-filter="smt_issue_store_sel_issue"
                                    name="smt_issue_aliExpress_searchForm_select"
                                    lay-search >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="" id="selectType">
                                        <option value="0">订单号</option>
                                        <option value="1">买家姓名</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="issueInputText">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">发起时间</label>
                               <div class="layui-input-block" id="issueTimeDiv">
                           			 <input type="text" class="layui-input" id="queryTime" name="queryTime">
                        	   </div>
                            </div>
                             <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">付款时间</label>
                               <div class="layui-input-block" id="payTimeDiv">
                           			 <input type="text" class="layui-input" id="payQueryTime" name="payQueryTime">
                        	   </div>
                            </div>
                             <div class="layui-col-lg2 layui-col-md2">
                             	<label class="layui-form-label">收货时间</label>
                                    <div class="layui-input-block">
	                                    <select name="" id="selectReceiveTimeType">
	                                   		<option value=""></option>
	                                        <option value="0">小于30天</option>
	                                        <option value="1">大于30天</option>
	                                        <option value="2">收货超时</option>
	                                    </select>
	                                </div>
                             </div>
                             <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">
                               		 纠纷原因
                                </label>
                                 <div class="layui-input-block">
	                                    <select name="" id="issueReasonType">
	                                   		<option value=""></option>
	                                        <option value="0">货不对版</option>
	                                        <option value="1">买家原因</option>
	                                        <option value="2">未收到货物</option>
	                                    </select>
	                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">
                                   		纠纷金额
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="sumOrderMoneyText" style="width:150">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 onlyShowProcess">
                                <label class="layui-form-label">处理状态</label>
                                 <div class="layui-input-block">
	                                    <select name="issueSubdivideStatus" xm-select="smt_issuse_issueSubdivideStatus"
                                        xm-select-type="1"
                                        xm-select-search-type="dl"
                                        xm-select-search xm-select-skin="normal" >
	                                   		<option value="">请选择</option>
	                                        <option value="1">待卖家处理</option>
	                                        <option value="2">买家确认中</option>
	                                        <option value="3">待平台确认中</option>
	                                        <option value="4">平台退款中</option>
	                                        <option value="5">买家退货中</option>
	                                        <option value="6">待卖家收货</option>
	                                        <option value="7">处理中</option>
	                                    </select>
	                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">纠纷ID</label>
                                <div class="layui-input-block">
	                                <input type="text" class="layui-input" name="issueId" onblur="commChangeInputVal(this.value,event)">
	                            </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="issueSearchBtn">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="smtissueinfoCard">
                <!-- <div class="layui-card-header">
                    <button class="layui-btn layui-btn-sm" type="button">批量退货</button>
                    <button class="layui-btn layui-btn-sm" type="button">延长收货</button>
                    <button type="button" class="layui-btn layui-btn-sm disputeDetail">弹框</button>
                </div> -->
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="smt_issue_tab_filter">
                        <ul class="layui-tab-title">
                            <li issue_process_type="2">待卖家处理(<span id="tolnum_span_seller_process"></span>)</li>
                            <li class="layui-this" issue_process_type="1">纠纷处理中(<span id="tolnum_span_process"></span>)</li>
                            <!-- <li issue_process_type="3">待平台介入(<span id="tolnum_span_platform_process"></span>)</li>
                            <li issue_process_type="4">平台已介入(<span id="tolnum_span_platform_processing"></span>)</li>
                            <li issue_process_type="5">售后宝(<span id="tolnum_span_buyend"></span>)</li> -->
                            <li issue_process_type="6">待卖家收货(<span id="tolnum_span_seller_recive"></span>)</li>
                            <li issue_process_type="7">已取消(<span id="tolnum_span_cannel"></span>)</li>
                            <li issue_process_type="8">已结束(<span id="tolnum_span_finish"></span>)</li>
                            <div style="float:right;margin: 3px 0 0 12px">
                        		<button type="button" id="updateOrderReceiveInfo" class="layui-btn layui-btn-sm layui-btn-normal">更新收货信息</button>
                    		</div>
                        	<div style="float:right;margin: 3px 0 0 9px">
                        		<button type="button" id="batchSendMsg" class="layui-btn layui-btn-sm layui-btn-normal">批量回复站内信</button>
                    		</div>
                        	<div style="float:right;margin: 3px 0 0 5px">
                        		<button type="button" id="batchDelayOrder" class="layui-btn layui-btn-sm layui-btn-normal">批量延长收货日期</button>
                    		</div>
                    		<div style="float:right;margin-top:3px">
                                <button type="button" id="batchRefuseSolution" class="layui-btn layui-btn-sm layui-btn-normal">批量拒绝方案</button>
                    		</div>
                        </ul>
                        <div class="layui-tab-content" id="wait_seller_process_div" style="display:none">
                           <table id="wait_seller_process_table" lay-filter="issue_table_filter"></table>
                        </div>
                        <div class="layui-tab-content" id="issue_processing_div" style="display:none">
                            <table id="issue_processing_table" lay-filter="issue_table_filter"></table>
                        </div>
                         <div class="layui-tab-content" id="wait_platform_in_div" style="display:none">
                            <table id="wait_platform_in_table" lay-filter="issue_table_filter"></table>
                        </div>
                         <div class="layui-tab-content" id="platform_in_div" style="display:none">
                            <table id="platform_in_table" lay-filter="issue_table_filter"></table>
                        </div>
                         <div class="layui-tab-content" id="after_sale_warranty_div" style="display:none">
                            <table id="after_sale_warranty_table" lay-filter="issue_table_filter"></table>
                        </div>
                         <div class="layui-tab-content" id="wait_seller_receive_div" style="display:none">
                            <table id="wait_seller_receive_table" lay-filter="issue_table_filter"></table>
                        </div>
                         <div class="layui-tab-content" id="cancel_div" style="display:none">
                            <table id="cancel_table" lay-filter="issue_table_filter"></table>
                        </div>
                         <div class="layui-tab-content" id="finish_div" style="display:none">
                            <table id="finish_table" lay-filter="issue_table_filter"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
 <script type="text/html" id="orderIdTpl">
        <input type="text" class="hidden" name="id" value="{{d.id}}">
    	<a href="javascript:;" lay-event="show_item">{{d.orderId}}</a>
        <div>买家姓名:{{d.buyerSingerFullname}}</div>
        <div>国家:{{d.country}}</div>
        <div>剩余收货时间:{{d.timeToReceive}}</div>
</script>
<!-- <script type="text/html" id="priceTpl">
    	<span>{{d.refundMoneyMax}}({{d.refundMoneyMaxCurrency}})</span>
</script>
<script type="text/html" id="refundMoneyPostTpl">
    	<span>{{d.sumOrderMoney}}({{d.refundMoneyMaxCurrency}})</span>
</script> -->
<script type="text/html" id="issue_editBar">
    <a type="button" class="layui-btn layui-btn-xs disputeDetail" lay-event="pd_detail">详情</a><br/>
</script>
<!-- 纠纷详情框 -->
<script type="text/html" id="disputeDetailLayer">
  <div style="padding:20px 40px 0 20px">

      <div class="disputeBlock">
        <div class="disputeContainer">
          <div class="disputeStepBar">
              <div class="disputeStepBarTop" >
                	<span id="issue_start_date"></span>
              </div>
              <div class="disputeStepBarMid">
                <div class="disputeCircle disputeSuccessC" id="startDisputeCircle"></div>
                <div class="disputeDash" id="startDisputeDash"></div>
              </div>
              <div class="disputeStepBarBom">
                发起退款/退货
              </div>
          </div>
          <div class="disputeStepBar">
            <div class="disputeStepBarTop">
             <span  id="issue_smt_process_date"></span>
            </div>
            <div class="disputeStepBarMid">
              <div class="disputeCircle" id="proDisputeCircle"></div>
              <div class="disputeDash" id="proDisputeDash"></div>
            </div>
            <div class="disputeStepBarBom">
              速卖通介入
            </div>
          </div>
          <div class="disputeStepBar">
            <div class="disputeStepBarTop">
             	<span  id="issue_smt_end_date"></span>
            </div>
            <div class="disputeStepBarMid">
              <div class="disputeCircle" id="endDisputeCircle"></div>
             </div>
            <div class="disputeStepBarBom" id="issue_close_date">
              协商完成
            </div>
          </div>
        </div>
        <div class="disputeLine"></div>
          <table class="disputeTable">
          <tbody>
             <tr>
               <td>订单号:</td>
               <td  id="orderid_one">123123123</td>
             </tr>
             <tr>
               <td>纠纷原因:</td>
               <td id="issue_reason_one">货物仍在运输途中</td>
             </tr>
             <tr>
               <td>纠纷状态:</td>
               <td id="issue_status_one">等待响应</td>
             </tr>
             <tr>
               <td>提醒:</td>
               <td id="issue_click_one">买家已提起纠纷</td>
             </tr>
           </tbody>
         </table>
          <!-- <label class="layui-form-label">订单号</label>
          <div class="layui-input-block">
              <div class="disputeStepBarBom" id="orderid_one">
                 121212
              </div>
          </div>
          <br>
          <label class="layui-form-label">纠纷原因</label>
          <div class="layui-input-block">
              <div class="disputeStepBarBom" id="issue_reason_one">
                  121212
              </div>
          </div>
          <br>
          <label class="layui-form-label">纠纷状态</label>
          <div class="layui-input-block">
              <div class="disputeStepBarBom" id="issue_status_one">
                  121212
              </div>
          </div>
          <br>
          <label class="layui-form-label">提醒</label>
          <div class="layui-input-block">
              <div class="disputeStepBarBom" id="issue_click_one">
                  121212
              </div>
          </div> -->


      </div>
      <div class="disputeBlock">
          <div style="overflow: hidden">
            <div class="disputePlans" id="buyerSoluDiv" style="display:none">
              <div>买家方案</div>
              <table id="buyer_solution_table">
              </table>
              <button class="layui-btn-sm layui-btn layui-btn-normal disputeAgree" id="buyerSolutionAgreeBtn"  type="button">同意</button>
            </div>
            <div class="disputePlans" id="sellerSoluDiv" style="display:none">
                <div>我的方案</div>
                <table  id="seller_solution_table">
                </table>
            </div>
            <div class="disputePlans" id="platSoluDiv" style="display:none">
                <div>平台方案</div>
                <table  id="platform_solution_table">
                </table>
                <button class="layui-btn-sm layui-btn layui-btn-normal disputeAgree" id="platformSolutionAgreeBtn" type="button">同意</button>
            </div>
          </div>
          <div>
              <button class="layui-btn layui-btn-sm disputeRefuseAdd" type="button">拒绝并新增</button>
              <button class="layui-btn layui-btn-disabled disputeUploadProof" disabled="true" id="uploadImgBtn" type="button">上传证据</button>
          </div>
      </div>
       <div class="disputeBlock">
        <div id="zhengjuPicDiv" style="display:none">证据</div>
        <div  class="disputeEvidence" id="buyerPicDiv" style="display:none">
            <span>买家证据</span>
            <ul class="disputeImg" id="buyer_picture">
            </ul>
        </div>
        <div class="disputeEvidence" id="sellerPicDiv"  style="display:none">
            <span>我的证据</span>
            <ul class="disputeImg" id="seller_picture">
            </ul>
        </div>
        <div  class="disputeEvidence" id="buyerP" style="display:">
             <span>产品信息</span>
             <table  id="child_order_table">
             </table>
        </div>
      </div>
      <div class="disputeBlock">
          <div class="disputeOrderes">
              <div class="disputeOrderesTitle">纠纷订单</div>
              <table  class="disputeOrderesList" id="issue_order_info">
                <%--  <tbody>
                     <tr>
                        <td>订单号:</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>物流方式:</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>订单金额:</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>创建时间:</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>收货地址:</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>纠纷商品:</td>
                        <td></td>
                      </tr>
                  </tbody>--%>
              </table>
          </div>
          <div class="disputeOrderes">
            <div class="disputeOrderesTitle">
               <span>物流详情</span>
				<span style="color:red" id="trackingDateReceive"></span>
               <button class="layui-btn layui-btn-sm layui-btn-normal" id="delayOrderReceive" type="button">延长收货</button>
           </div>
				<span class="disputeOrderesList" id="trackingInfo"></span>
           <table class="disputeOrderesList" id="issue_tracking_msg">
              <%-- <tbody>
                 <tr>
                   <td>2018-09-16</td>
                   <td>啦啦啦啦啦啦</td>
                 </tr>
                 <tr>
                   <td>2018-09-16</td>
                   <td>啦啦啦啦啦啦</td>
                 </tr>
                 <tr>
                   <td>2018-09-16</td>
                   <td>啦啦啦啦啦啦</td>
                 </tr>
               </tbody>--%>
           </table>
          </div>
      </div>
      <div class="disputeBlock">
          <div class="disputeOrderMsg">
              <div id="disputeRichText"></div>
              <button class="layui-btn layui-btn-sm layui-btn-normal" id="messageSubmit" type="button">发送</button>
          </div>
          <div class="disputeOrderMsg">
               <div id="disputeOrderImg"></div>
               <div class="disputeOrderImgDet" id="message_info_img">
               </div>
          </div>
      </div>
      <div class="disputeBlock" id="buyer_seller_message_info">

      </div>
      <div class="disputeBlock">
        <div class="disputeHistoryTitle">纠纷历史</div>
        <table class="disputeHistoryBody  layui-table" id="issue_process_table">
            <%-- <thead>
               <tr>
                  <th>时间</th>
                  <th>角色</th>
                  <th>事件</th>
                  <th>详情</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td>2018-11-13</td>
                 <td>admin</td>
                 <td>what is your power</td>
                 <td>i am rich</td>
               </tr>
             </tbody>--%>
        </table>
      </div>
  </div>
</script>
<!-- 拒绝并新增方案弹框 -->
<script type="text/html" id="disputeRefuseAddLayer">
  <div class="p20">
      <form action="" class="layui-form">
          <div class="layui-form-item">
              <label class="layui-form-label">解决方案:</label>
              <div class="layui-input-block" id="refundTypeDiv">
                  <input type="radio" name ="refundType" value="refund" title="退款" checked>
                  <input type="radio" name ="refundType" value="return_and_refund" title="退款退货">
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label">退款金额(USD):</label>
              <div class="layui-input-block">
                  <%--<span>币种:JPY/USD/EUR</span>--%>
                 <input type="text" autocomplete="off" id="refund_amount" class="layui-input">
                 <span>拒绝退款写0</span>
              </div>
          </div>
          <div class="layui-form-item" style="display:flex;justify-content: space-between;">
              <label class="layui-form-label">回复模板:</label>
              <div class="layui-input-block" >
                  <select name="issue_template_type" id="issue_template_type" lay-filter="issue_template_type_filter">
                  </select>
              </div>
              <div class="layui-input-block">
                  <select name="issue_template_sel" id="issue_template_sel">
                      <option>请选择</option>
                  </select>
              </div>
              <div class="layui-input-block">
                  <a class="layui-btn" id="issue_use_template" onclick="useTemplate();"> 应用</a>
              </div>
          </div>

          <div class="layui-form-item">
              <label class="layui-form-label">问题描述:</label>
              <div class="layui-input-block">
                  <textarea name="desc" placeholder="请输入内容" id="smtIssue_refund_remark" class="layui-textarea"></textarea>
              </div>
          </div>
      </form>
  </div>
</script>
<!-- 站内信信息批量回复 -->
<script type="text/html" id="batchSendMsgTpl">
  <div class="p20">
      <form action="" class="layui-form">
          <div class="layui-form-item">
              <div class="layui-input-block">
                 <button type="button" id="hiBtn" class="layui-btn layui-btn-sm layui-btn-normal">hi!</button>
                 <button type="button" id="helloBtn" class="layui-btn layui-btn-sm layui-btn-normal">hello!</button>
                 <button type="button" id="worryBtn" class="layui-btn layui-btn-sm layui-btn-normal">don't worry!</button>
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label">回复内容:</label>
              <div class="layui-input-block">
                  <textarea name="desc" placeholder="请输入内容" id="seng_msg_area" class="layui-textarea"></textarea>
              </div>
          </div>
      </form>
  </div>
</script>
<!-- 上传证据弹框 -->
<script type="text/html" id="disputeUploadProofLayer">
    <div style="padding: 20px 40px 0 20px;">
        <div id="disputeUploadImg"></div>
		<span style="color:blue">请上传jpg/jepg/png格式图片，最多三张。</span>
        <ul style="margin-top:20px">
            <li id="img_li"></li>
        </ul>
    </div>
</script>
<script type="text/html" id="smt_issue_process_tpl">
    <div>
        <div>
            {{# if(d.processType =='buy'){ }}
                   <label class="layui-form-label mw100">订单金额:</label>
                  <div class="layui-input-block mlIns10">
                      <span>{{d.detail.orderAmount}}({{d.detail.orderAmountCurrency}})</span>
                  </div>
            {{# }else if(d.processType =='logistics'){ }}
                <label class="layui-form-label mw100">跟踪号:</label>
                  <div class="layui-input-block mlIns10">
                      <span>{{d.detail.logisticsNo}}</span>
                  </div>
                <label class="layui-form-label mw100">物流类型:</label>
                  <div class="layui-input-block mlIns10">
                      <span>{{d.detail.logisticsTypeCode}}</span>
                  </div>
          {{# }else if(d.processType =='buyerSolution'){ }}
            <label class="layui-form-label mw100">纠纷原因:</label>
                  <div class="layui-input-block mlIns10">
                      <span>{{d.detail.reasonChinese}}</span>
                  </div>
            <label class="layui-form-label mw100">方案:</label>
                  <div class="layui-input-block mlIns10">
                      <span>仅退款{{d.detail.buyerRefundAmount}}({{d.detail.buyerRefundAmountCurrency}})</span>
                  </div>
            <label class="layui-form-label mw100">备注:</label>
                  <div class="layui-input-block mlIns10">
                      <span>{{d.detail.buyerContent}}</span>
                  </div>
            {{# }else if(d.processType =='sellerSolution'){ }}
                <label class="layui-form-label mw100">方案:</label>
                  <div class="layui-input-block mlIns10">
                      <span>仅退款{{d.detail.sellerRefundAmount}}({{d.detail.sellerRefundAmountCurrency}})</span>
                  </div>
                <label class="layui-form-label mw100">备注:</label>
                  <div class="layui-input-block mlIns10">
                      <span>{{d.detail.sellerContent}}</span>
                  </div>
			{{# }else if(d.processType =='sellerAccept'){ }}
                <label class="layui-form-label mw100">方案:</label>
                  <div class="layui-input-block mlIns10">
                      <span>仅退款{{d.detail.buyerRefundAmount}}({{d.detail.buyerRefundAmountCurrency}})</span>
                  </div>
                <label class="layui-form-label mw100">卖家同意时间:</label>
                  <div class="layui-input-block mlIns10">
                      <span>{{d.processDate}}</span>
                  </div>
			{{# }else if(d.processType =='buyerAccept'){ }}
                <label class="layui-form-label mw100">方案:</label>
                  <div class="layui-input-block mlIns10">
                      <span>仅退款{{d.detail.sellerRefundAmount}}({{d.detail.sellerRefundAmountCurrency}})</span>
                  </div>
                <label class="layui-form-label mw100">买家同意时间:</label>
                  <div class="layui-input-block mlIns10">
                      <span>{{d.processDate}}</span>
                  </div>
            {{# }else if(d.processType =='platformSolution'){ }}
            <label class="layui-form-label mw100">平台介入</label>
          {{# } }}
        </div>
    </div>
</script>
<script type="text/html" id="smt_process_type_tpl">
    <div>
        <div>
            {{# if(d.processType =='buy'){ }}
                       <div>产生订单</<div>
            {{# }else if(d.processType =='logistics'){ }}
                 	<div>订单发货</<div>
          	{{# }else if(d.processType =='buyerSolution'){ }}
             	<div>买家提出纠纷方案</<div>
            {{# }else if(d.processType =='sellerSolution'){ }}
                  <div>卖家提出纠纷方案</<div>
			{{# }else if(d.processType =='buyerAccept'){ }}
                  <div>买家同意纠纷</<div>
			{{# }else if(d.processType =='sellerAccept'){ }}
                  <div>卖家同意纠纷</<div>
            {{# }else if(d.processType =='platformSolution'){ }}
           		<div>平台介入</<div>
          {{# } }}
        </div>
    </div>
</script>
<script type="text/html" id="delayDaysInfotpl">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <div class="layui-form-item" notNull>
                                <label class="layui-form-label">延长天数：</label>
                                <div class="layui-input-block">
                                    <input name="delay_days" id="delay_days" class="layui-input" style="width:250px">
                                </div>
                        </div>
                </div>
            </div>
        </div>
</script>
<!-- <div>{{ Format(d.gmtCreate,"yyyy-MM-dd hh:mm:ss")}}</div> -->
<script id="smtIssue_content" type="text/html">
    {{# if(d.content!==undefined){ }}
        <div class="disflex">
            <div class="hideFourLine">
                <span class="infoDetailBtn" onclick="smtIssue_showInfo(this)"></span>
                {{d.content}}
            </div>
        </div>
    {{# } }}
</script>
 <script type="text/html" id="logisticsNoTpl">
    <div class="disflex">
        <div class="logisticsNoInfo hideFourLine" onmouseenter="showLogisticsInfo('{{d.timeToReceive}}','{{d.logisticsTypeCode}}','{{ d.logisticsNo }}')"
     id="{{ d.logisticsNo }}">
     <span class="infoDetailBtn" onclick="smtIssue_showInfo(this)"></span>
     {{ d.logisticsNo }}<br>
	{{ d.orderTrackingRece }}
    </div>
    </div>
</script>
 <script type="text/html" id="allTimeTpl">
     <span>付款时间：{{ Format(d.gmtPayTime,"yyyy-MM-dd hh:mm:ss")}}</span> <br/>
     <span>创建时间：{{ Format(d.gmtCreate,"yyyy-MM-dd hh:mm:ss")}}</span> <br/>
	 <span>修改时间：{{ Format(d.gmtModified,"yyyy-MM-dd hh:mm:ss")}}</span><br/>
	 <span style="color:red">剩余处理时间：{{d.timeToProcess}}</span>
</script>
<script src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script src="${ctx}/static/js/smtissueinfo/smtissueinfo.js"></script>
