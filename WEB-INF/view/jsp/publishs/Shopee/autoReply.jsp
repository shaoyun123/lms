<%@ page language='java' import='java.util.*' contentType='text/html;charset=UTF-8' %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>自动回复</title>
<style>
  #shop_autoReply_setRuleForm .layui-input-block{
    margin-left: 150px;
  }
  #shop_autoReply_setRuleForm .layui-form-label{
    width: 120px;
  }
  #shop_autoReply_setRuleForm .notes{
    color: #aaa;
    font-size: 12px;
  }
  #shop_autoReply_tree li {
        border-bottom: 1px solid #797979;
    }
  #shop_autoReply_tree li:last-child{
      border-bottom:none;
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
  .fieldBox_shop_autoReply{
    display: inline-block;
    margin-bottom: 10px;
  }
  #shop_autoReply_replyRuleForm .layui-form-label{
    width: 90px;
  }
  #shop_autoReply_replyRuleForm .layui-input-block{
    margin-left: 120px;
  }
</style>
<div class="layui-fluid" id="shop_autoReply_page">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" id="shop_autoReply_SearchForm" @submit.prevent="handleSearch">
            <div class="layui-form-item">
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                  <select
                    name="siteList"
                    id="shop_autoReply_site"
                    xm-select="shop_autoReply_site"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    lay-filter="shop_autoReply_site"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select
                    name="storeAcctIdList"
                    id="shop_autoReply_storeAcct"
                    xm-select="shop_autoReply_storeAcct"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                    lay-filter="shop_autoReply_storeAcct"
                  ></select>
                </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">创建人</label>
                <div class="layui-input-block">
                  <select name="creatorId" lay-search>
                    <option value=""></option>
                    <option v-for="item in creatorList" :value="item.creatorId" :key="item.creatorId">{{ item.creator }}</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">启用状态</label>
                <div class="layui-input-block">
                  <select name="status">
                    <option value=""></option>
                    <option value="false">已关闭</option>
                    <option value="true" selected>已开启</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <div class="layui-input-block">
                  <button class="layui-btn layui-btn-sm layui-btn-normal">搜索</button>
                  <span class="layui-btn layui-btn-sm layui-btn-primary" type="reset" @click="clear">清空</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="shop_autoReplyCard">
        <div class="">
          <div class="layui-card-header">
            <div class="fixTab">
              <!-- 页签点击结构 -->
              <div class="layui-tab" lay-filter="shop_autoReply_tabs" id="shop_autoReply_tabs">
                <ul class="layui-tab-title">
                  <li v-for="item in replyTypeList" :class="item.code===1 ? 'layui-this':''" :data-value="item.code">{{item.type}}(<span></span>)</li>
                </ul>
                <div class="disFCenter ml10 layui-form">
                  <select name="" lay-filter="shop_autoReply_batchOperation">
                    <option value="">批量操作</option>
                    <permTag:perm funcCode="shop_autoReply_batchDel">
                      <option value="1">批量删除</option>
                    </permTag:perm>
                    <option value="2">批量开启</option>
                    <option value="3">批量关闭</option>
                  </select>
                </div>
              </div>
              <!-- 下面的div放按钮,结构不要变化 -->
              <div>
                <div class="layui-form mr10" style="position: relative" id="shop_autoReply_download-select">
                  <select name="downloadTpl" lay-filter="shop_autoReply_downLoadTpl">
                    <option value="">模板下载</option>
                    <option value="1">延长发货模板</option>
                    <option value="2">换货模板</option>
                    <option value="3">差评模板</option>
                    <!-- <option value="4">店铺优惠券模板</option> -->
                    <option value="5">乐言自动回复</option>
                  </select>
                </div>
                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="shop_autoReply_import">导入</button>
                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm ml10" @click="handleAdd">新增</button>
                <permTag:perm funcCode="shop_autoReply_setReplyRule">
                  <button type="button" class="layui-btn layui-btn-normal layui-btn-sm ml10" @click="handleSetRule">回复规则</button>
                </permTag:perm>
              </div>
            </div>
          </div>
          <!-- 下面放表格 -->
          <div class="layui-card-body">
            <table class="layui-table" id="shop_autoReply_table" lay-filter="shop_autoReply_table"></table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<!--  -->
<script type="text/html" id="shop_autoReply_replyMsg_tpl">
  {{# if(d.autoReplyType==12){ }}
    {{# if(d.verbalTrick){ }}
       <div class="disflex">
         <div class="logisticsNoInfo hideFourLine" data-id="{{ d.id }}">
           <span class="infoDetailBtn" onclick="shop_autoReply_showInfo(this)"></span>
           COD：{{d.verbalTrick}}
         </div>
        </div>
        <div class="disflex">
          <div class="logisticsNoInfo hideFourLine" data-id="{{ d.id }}">
           <span class="infoDetailBtn" onclick="shop_autoReply_showInfo(this)"></span>
           非COD：{{d.notCodVerbalTrick}}
         </div>
        </div>
     {{# } }}
  {{#  }else{ }}
    {{# if(d.verbalTrick){ }}
       <div class="disflex">
         <div class="logisticsNoInfo hideFourLine" data-id="{{ d.id }}">
           <span class="infoDetailBtn" onclick="shop_autoReply_showInfo(this)"></span>
           {{d.verbalTrick}}
         </div>
       </div>
     {{# } }}
  {{#  } }}
</script>

<!-- 状态 -->
<script id="shop_autoReply_status" type="text/html">
  <input type="checkbox" lay-skin="switch" name="status" value="{{d.id}}" data-autoreplytype="{{d.autoReplyType}}" lay-filter="shop_autoReply_status_filter" {{d.status === true
  ? 'checked' : '' }}>
</script>

<!-- 优惠券发送状态 -->
<script id="shop_autoReply_sendVoucher_status" type="text/html">
  <input type="checkbox" lay-skin="switch" name="sendVoucher" value="{{d.id}}" lay-filter="shop_autoReply_sendVoucher_status_filter" {{d.sendVoucher == true
  ? 'checked' : '' }}>
</script>
    <!--  -->
    <script id="shop_autoReply_toolbar" type="text/html">
      <a href="javascript:;" class="layui-btn layui-btn-sm" lay-event="update">修改</a>
      <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-danger" lay-event="delete">删除</a>
    </script>

    <!--  -->
    <script type="text/html" id="shop_autoReply_setRule">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="shop_autoReply_setRuleForm">
            <div class="layui-form-item">
              <div>
                <label class="layui-form-label">回复类型</label>
                  <div class="layui-input-block">
                    <select name="autoReplyType" lay-filter="shop_autoReply_autoReplyType" id="shop_autoReply_setRuleForm_autoReplyType">
                    </select>
                  </div>
              </div>
              <div>
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                  <select name="salesSite" id="shop_autoReply_setRule_site">
                  </select>
                </div>
              </div>
              <div class="showInDelay">
                <label class="layui-form-label">截止天数</label>
                <div class="layui-input-block disflex">
                  <span class="ml10 mr10">&le;</span>
                  <input type="text" name="deadlineDays" onkeypress="commonKeyPressInputPositiveInt(event)" class="layui-input">
                </div>
              </div>
              <div class="showInDelay">
                <label class="layui-form-label">仓库订单状态</label>
                <div class="layui-input-block">
                  <select name="orderStatusList" xm-select="shop_autoReply_warehouseStatus1"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  >
                  </select>
                </div>
              </div>
              <div class="showInChange hidden">
                <label class="layui-form-label">仓库订单状态</label>
                <div class="layui-input-block">
                  <select name="orderStatusList" xm-select="shop_autoReply_warehouseStatus2"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  >
                  </select>
                </div>
              </div>
              <div class="showInChange hidden">
                <label class="layui-form-label">延迟天数</label>
                <div class="layui-input-block disflex">
                  <span class="ml10 mr10">&ge;</span>
                  <input type="text" name="delayDays" onkeypress="commonKeyPressInputPositiveInt(event)" class="layui-input">
                </div>
              </div>
              <div class="showInComment hidden">
                <label class="layui-form-label">评论星星数</label>
                <div class="layui-input-block">
                  <select name="ratingStar">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
              <div class="showInComment hidden">
                <label class="layui-form-label">评论是否为空</label>
                <div class="layui-input-block">
                  <select name="emptyComment">
                    <option value="false">否</option>
                    <option value="true">是</option>
                  </select>
                </div>
              </div>
              <!-- <div class="showInvoucher hidden">
                <label class="layui-form-label">优惠券剩余数量</label>
                <div class="layui-input-block disflex">
                  <span class="ml10 mr10">&ge;</span>
                  <input type="text" name="voucherRemainingQuantity" onkeypress="commonKeyPressInputPositiveInt(event)" class="layui-input">
                </div>
              </div> -->
              <div class="showInDeliverGoods hidden">
                <label class="layui-form-label">订单金额&ge;</label>
                <div class="layui-input-block disflex">
                  <div class="w150">
                    <select name="currency">
                      <option value="RMB" selected>人民币&yen;</option>
                    </select>
                  </div>
                  <input type="text" name="orderCnAmountGte" onkeypress="commonKeyPressInputFloat(event)" onblur="commonBlurPositiveFloat(event)" class="layui-input">
                </div>
              </div>
              <div class="showInCancelOrder hidden">
                <label class="layui-form-label">OA订单状态</label>
                <div class="layui-input-block">
                  <select name="orderProcessStatusList" xm-select="shop_autoReply_orderProcessStatusList"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  >
                  </select>
                </div>
              </div>
              <div class="showInCODReceive hidden">
                <label class="layui-form-label">平台订单物流状态</label>
                <div class="layui-input-block">
                  <select name="logisticsStatus" xm-select="shop_autoReply_logisticsStatusList"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  >
                  </select>
                </div>
              </div>
              <div class="showInCODReceive hidden">
                <label class="layui-form-label">订单物流描述</label>
                <div class="layui-input-block disflex">
                  <div class="w100">
                    <select name="logisticsDescriptionRelation">
                      <option value="1">包含</option>
                    </select>
                  </div>
                  <input type="text" class="layui-input" name="logisticsDescription" placeholder="多个词用英文逗号隔开，单词之间为或的关系">
                </div>
              </div>
              <div class="showInCODSend hidden">
                <label class="layui-form-label">平台订单状态</label>
                <div class="layui-input-block">
                  <select name="platOrderStatus" xm-select="shop_autoReply_platOrderStatusList"
                  xm-select-search
                  xm-select-search-type="dl"
                  xm-select-skin="normal"
                >
                  </select>
                </div>
              </div>
              <div class="showInCOD hidden">
                <label class="layui-form-label">买家拒绝次数</label>
                <div class="layui-input-block">
                  <select name="buyerRejectNumber" xm-select="shop_autoReply_buyerRejectNumber"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="9999">5次以上</option>
                  </select>
                </div>
              </div>
              <div class="showInPayReminder hidden">
                <label class="layui-form-label">平台订单状态</label>
                <div class="layui-input-block">
                  <select name="platOrderStatus" disabled>
                    <option value="UNPAID" selected>UNPAID</option>
                  </select>
                </div>
              </div>
              <div class="showInPayReminder hidden">
                <label class="layui-form-label">距订单时间</label>
                <div class="layui-input-block disflex">
                  <input class="layui-input" name="orderTimeCnGreaterThanOrEqualValue" onblur="commonBlurPositiveFloat(event)"/>
                  <span class="ml10 mr10">-</span>
                  <input class="layui-input" name="orderTimeCnLessThanValue" onblur="commonBlurPositiveFloat(event)"/>
                  <select name="orderTimeCnValueType">
                    <option value="天" selected>天</option>
                    <option value="时">时</option>
                    <option value="分">分</option>
                  </select>

                </div>
              </div>
              <div>
                <label class="layui-form-label"><span class="verbalTrick_title">话术</span><br><span class="notes">(填站点对应语种)</span></label>
                <div class="layui-input-block">
                  <textarea name="verbalTrick" class="layui-textarea" oninput="commonInputLimitWord(this,600)"></textarea>
                </div>
              </div>
              <div class="showInPayReminder hidden" style="margin-top: 4px;">
                <label class="layui-form-label">非COD订单话术<br><span class="notes">(填站点对应语种)</span></label>
                <div class="layui-input-block">
                  <textarea name="notCodVerbalTrick" class="layui-textarea" oninput="commonInputLimitWord(this,600)"></textarea>
                </div>
              </div>
              <div class="showInPayReminder hidden" style="margin-top: 4px;">
                <label class="layui-form-label">同一订单发送次数</label>
                <div class="layui-input-block">
                  <input class="layui-input" name="sameOrderSendNum" onkeypress="commonKeyPressInputPositiveInt(event)">
                </div>
              </div>
              <div class="showInPayReminder hidden">
                <label class="layui-form-label">多次发送间隔时间</label>
                <div class="layui-input-block disflex">
                  <input class="layui-input" name="sendIntervalValue" onkeypress="commonKeyPressInputPositiveInt(event)">
                  <select name="sendIntervalValueType">
                    <option value="天" selected>天</option>
                    <option value="时">时</option>
                    <option value="分">分</option>
                  </select>
                </div>
              </div>
              <div class="showVoucherBasic">
                <label class="layui-form-label">店铺优惠券</label>
                <div class="layui-input-block">
                  <input type="radio" name="sendVoucher" value="false" title="不发送" checked lay-filter="shop_autoReply_voucher"/>
                  <input type="radio" name="sendVoucher" value="true" title="发送" lay-filter="shop_autoReply_voucher"/>
                </div>
              </div>
              <div class="showVoucherOption hidden">
                <div>
                  <label class="layui-form-label">店铺优惠券起止天数</label>
                  <div class="layui-input-block disflex">
                    <input class="layui-input" name="voucherStartEndLeftDay"/>
                    <span class="ml10 mr10">-</span>
                    <input class="layui-input" name="voucherStartEndRightDay"/>
                  </div>
                </div>
                <div>
                  <label class="layui-form-label">结束时间距当前天数</label>
                  <div class="layui-input-block disflex">
                    <input class="layui-input" name="voucherEndLeftDay"/>
                    <span class="ml10 mr10">-</span>
                    <input class="layui-input" name="voucherEndRightDay"/>
                  </div>
                </div>
                <div>
                  <label class="layui-form-label">店铺优惠券剩余数量</label>
                  <div class="layui-input-block disflex">
                    <input class="layui-input" name="voucherRemainingQuantityLeft"/>
                    <span class="ml10 mr10">-</span>
                    <input class="layui-input" name="voucherRemainingQuantityRight"/>
                  </div>
                </div>
                <div>
                  <label class="layui-form-label">店铺优惠券类型</label>
                  <div class="layui-input-block">
                    <select name="voucherType" xm-select="shop_autoReply_voucherType"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal">
                    </select>
                  </div>
                </div>
                <div>
                  <label class="layui-form-label">展示类型</label>
                  <div class="layui-input-block">
                    <select name="voucherShowType">
                      <option value="">全部</option>
                      <option value="1">展示在所有页面</option>
                      <option value="3">通过优惠码分享</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </script>

    <!-- 自动回复规则配置 -->
    <script id="shop_autoReply_replyRule" type="text/html">
      <div class="layui-card">
        <div class="layui-card-body disflex">
          <div>
            <ul class="layui-nav layui-nav-tree" id="shop_autoReply_tree" style="width:230px;">
              <li class="layui-nav-item layui-this" style="text-align: center;"  data-replytype="">
                <a href="javascript:;"  data-replytype="">全部回复类型</a>
              </li>
              <li class="layui-nav-item" data-replytype="1">
                <a href="javascript:;"  data-replytype="1">延长发货回复</a>
              </li>
              <li class="layui-nav-item" data-replytype="2">
                <a href="javascript:;"  data-replytype="2">换货回复</a>
              </li>
              <li class="layui-nav-item" data-replytype="3">
                <a href="javascript:;"  data-replytype="3">差评回复</a>
              </li>
              <!-- <li class="layui-nav-item">
                <a href="javascript:;"  data-replytype="4">店铺优惠券回复</a>
              </li> -->
            </ul>
        </div>
          <div class="shop_autoReply_replyRule">
            <form action="" class="layui-form hidden" id="shop_autoReply_replyRuleForm">
              <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>回复日期</label>
                  <div class="layui-input-block">
                    <select name="replyDateType" lay-filter="shop_autoReply_chooseDate">
                      <option value="1">按星期</option>
                      <option value="2">按日期</option>
                    </select>
                  </div>
              </div>
              <div class="layui-form-item showWeek">
                <label class="layui-form-label"><font class="fRed">*</font>回复具体星期</label>
                  <div class="layui-input-block">
                    <select name="replyWeekday"
                      xm-select="shop_autoReply_replyWeekday"
                      xm-select-search
                      xm-select-search-type="dl"
                      xm-select-skin="normal"
                    >
                      <option value="2">星期一</option>
                      <option value="3">星期二</option>
                      <option value="4">星期三</option>
                      <option value="5">星期四</option>
                      <option value="6">星期五</option>
                      <option value="7">星期六</option>
                      <option value="1">星期日</option>
                    </select>
                  </div>
              </div>
              <div class="layui-form-item disN showDate">
                <label class="layui-form-label"><font class="fRed">*</font>回复具体日期</label>
                  <div class="layui-input-block">
                    <select name="replyMonthday"
                      xm-select="shop_autoReply_replyMonthday"
                      xm-select-search
                      xm-select-search-type="dl"
                      xm-select-skin="normal"
                    >
                      {{# layui.each(d.dateArr, function(index, item){ }}
                        <option value="{{item.value}}">{{item.name}}</option>
                      {{# }); }}
                    </select>
                  </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>回复开始时间</label>
                  <div class="layui-input-block disflex">
                    <div>
                      <select name="replyHour">
                        {{# layui.each(d.hourArr, function(index, item){ }}
                        {{# if(d.replyHour==item.value){ }}
                        <option value="{{item.value}}" selected>{{item.name}}</option>
                        {{# }else{ }}
                        <option value="{{item.value}}">{{item.name}}</option>
                        {{# } }}
                        {{# }); }}
                      </select>
                    </div>
                    <div>
                      <select name="replyMinute">
                        {{# layui.each(d.minutesArr, function(index, item){ }}
                        {{# if(d.replyMinute==item.value){ }}
                        <option value="{{item.value}}" selected>{{item.name}}</option>
                        {{# }else{ }}
                        <option value="{{item.value}}">{{item.name}}</option>
                        {{# } }}
                        {{# }); }}
                      </select>
                    </div>
                  </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>回复时间间隔</label>
                  <div class="layui-input-block disflex">
                    <div>
                      <input type="text" class="layui-input" name="replyTimeSpace" onkeypress="commonKeyPressInputPositiveInt(event)">
                    </div>
                    <div class="ml10" style="line-height: 32px;">秒（1-10s之间，消息回复间隔）</div>
                  </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </script>

    <script type="text/html" id="shop_autoReply_matchStorePop">
      <div class="p10" style="display: flex;justify-content: space-between;flex-direction: column;">
          <div class="layui-tab layui-tab-card">
            <form class="layui-form ml10" lay-filter="matchStoreForm_shop_autoReply" id="matchStoreForm_shop_autoReply">
                <div class="layui-form-item layui-row" style="padding: 5px 0;">
                    <div class="layui-col-md4 layui-col-lg4 showInsearch">
                        <label class="layui-form-label">全选</label>
                        <div class="layui-input-block" style="line-height: 30px!important;">
                            <input type="checkbox" lay-skin="primary" title="" lay-filter="matchStoreForm_shop_autoReply_checkAll" name="checkAll">
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">店铺</label>
                        <div class="layui-input-block">
                            <input type="text" lay-skin="primary" title="" name="storeAcct" placeholder="单个模糊，多个精确逗号分隔" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <div class="layui-input-block" style="line-height: 30px!important;">
                            <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" lay-submit lay-filter="matchStoreForm_shop_autoReply_submit">搜索</button>
                        </div>
                    </div>
                </div>
            </form>
          </div>
          <div class="layui-tab layui-tab-card">
                  <div class="layui-card-header" style="color: #468847;background-color: #dff0d8">已选择店铺
                      <button type="button" class="layui-btn ml20 layui-btn-xs" name="shop_autoReplyCopy" id="shop_autoReplyCopy" style="margin-left:100px;">一键复制</button>
                      <button type="button" class="layui-btn layui-btn-xs" name="shop_autoReplyClear" id="shop_autoReplyClear" style="margin-left:100px;">清空</button>
                  </div>
                  <div class="layui-card-body">
                      <form class="layui-form" id="matchStoreForm_shop_autoReply_checked" lay-filter="matchStoreForm_shop_autoReply_checked">

                      </form>
                  </div>
              </div>
      </div>
    </script>

<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/js/publishs/shopee/autoReply.js"></script>