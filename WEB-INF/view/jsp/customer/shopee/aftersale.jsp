<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>售后</title>
<style type="text/css">
  .bgeee {
    background-color: #eee;
  }
  .mlb40 {
    margin-left:40px;
    margin-bottom: 20px;
  }
  .h2style {
    color: #fff;
    background: #2F4056;
    padding: 5px 10px;
    margin-bottom: 10px;
  }
  .reasonContent {
    display: flex;
    justify-content: flex-start;
  }
  .detailMb20 {
      margin-bottom: 20px;
  }
  #aftersale_appealImgs{
    display: flex;
    justify-content: space-between;
  }
  #aftersale_shopee_searchForm .xm-select-dl{
    z-index: 9999;
  }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form"  id="aftersale_shopee_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="shopee_aftersale_depart_sel" lay-search lay-filter="shopee_aftersale_depart_sel"  class="orgs_hp_custom" name="orgId">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">客服</label>
                                <div class="layui-input-block">
                                    <select  id="shopee_aftersale_salesman_sel" lay-filter="shopee_aftersale_salesman_sel"  class="users_hp_custom" data-rolelist="shopee客服"  data-type="customservicer" lay-search 
                                    name="salePersonId">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="shopee_aftersale_store_sel" lay-filter="shopee_aftersale_store_sel" xm-select="shopee_aftersale_store_sel" class="users_hp_store_multi" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                    data-platcode="shopee" name="storeAcctId"></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺单号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" placeholder="支持多个精确查询" name="orderId">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">售后单号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" placeholder="支持多个精确查询" name="returnSn">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType" id="aftersale_time">
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="times" id="aftersale_times" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">退款状态</label>
                                <div class="layui-input-block">
                                    <select name="returnStatusList" xm-select="aftersale_status"  xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">退款类型</label>
                                <div class="layui-input-block">
                                    <select lay-search name="reason" id="aftersale_reason" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">客服备注</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="remark">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                   <select lay-search name="orderBy" id="aftersale_orderBy" lay-search>
                                     
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="pageType" value='REQUESTED_PAGE' id='aftersale_pageType'>
                            <div class="layui-col-md3 layui-col-lg3 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="aftersale_submit">
                                查询</span>
                                 <span class="layui-btn layui-btn-sm layui-btn-primary" onclick="aftersale_reset()">清空</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="aftersale_positionCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header" style="display:flex;justify-content:space-between;align-items: center;">
                        <div class="layui-tab" lay-filter="aftersale-tabs" id="aftersale-tabs">
                            <ul class="layui-tab-title">
                                <li class="layui-this">待处理(<span id="REQUESTED_PAGE_number">点击显示</span>)</li>
                                <li>已处理(<span id="DEAL_PAGE_number">点击显示</span>)</li>
                                <li>全部(<span id="aftersale_number">点击显示</span>)</li>
                            </ul>
                        </div>
                        <div>
                            <span class="layui-btn layui-btn-sm" id="aftersale_batchAuto">批量同步</span>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="aftersale_table"  lay-filter="aftersale_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 操作栏 --%>
<script type="text/html" id="aftersale_tableIdBar">
    <div><a class="layui-btn layui-btn-xs" lay-event="detail">详情</a></div>
    <div><a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="auto">同步</a></div>
    <div><a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="remark">备注</a></div>
</script>

<%-- 备注弹框 --%>
<script type="text/html" id="aftersale_remarkDialog">
<div style="padding:20px;">
    <textarea placeholder="请输入内容" class="layui-textarea"></textarea>
</div>
</script>
<%-- 详情弹框 --%>
<script type="text/html" id="aftersale_detailDialog">
   <div id="aftersale_detailContainer" style="padding: 20px 50px 20px 10px;"></div>
</script>
<%-- 详情弹框模板 --%>
<script id="aftersale_detailTpl" type="text/html">
    <div class="layui-row">
        <form class="layui-form">
            <div class="layui-form-item">
            <div class="layui-col-md3">
                <div class="layui-form-label">申请号</div>
                <div class="layui-input-block">
                    <input type="text" class="layui-input bgeee" value="{{ d.returnSn }}" disabled>
                </div>
            </div>
            <div class="layui-col-md3">
                <div class="layui-form-label">退款状态</div>
                <div class="layui-input-block">
                    <input type="text" class="layui-input bgeee" value="{{ d.returnStatusCn }}" disabled>
                </div>
            </div>
            <div class="layui-col-md3">
                <div class="layui-form-label">退款金额(￥)</div>
                <div class="layui-input-block">
                    <input type="text" class="layui-input bgeee" value="{{ d.refundAmount }}" disabled>
                </div>
            </div>
            <div class="layui-col-md3">
                <div class="layui-form-label">退款类型</div>
                <div class="layui-input-block">
                    <input type="text" class="layui-input bgeee" value="{{ d.reason }}" disabled>
                </div>
            </div>
            <div class="layui-col-md3">
                <div class="layui-form-label">申请时间</div>
                <div class="layui-input-block">
                    <input type="text" class="layui-input bgeee" value="{{ Format(d.returnCreateTime, 'yyyy-MM-dd') }}" disabled>
                </div>
            </div>
            <div class="layui-col-md3">
                <div class="layui-form-label">截止时间</div>
                <div class="layui-input-block">
                    <input type="text" class="layui-input bgeee" value="{{ Format(d.returnDueTime, 'yyyy-MM-dd') }}" disabled>
                </div>
            </div>
            <div class="layui-col-md3">
                <div class="layui-form-label">订单号</div>
                <div class="layui-input-block">
                    <input type="text" class="layui-input bgeee" value="{{ d.orderId }}" disabled>
                </div>
            </div>
            <div class="layui-col-md3">
                <div class="layui-form-label">订单金额(￥)</div>
                <div class="layui-input-block">
                    <input type="text" class="layui-input bgeee" value="{{ d.amountBeforeDiscount }}" disabled>
                </div>
            </div>
            </div>
        </form>
    </div>
    <div class="mlb40">
        <h2 class="h2style">买家退款理由</h2>
        <div class="reasonContent">
           <div>
            {{# if(d.returnImages){  }}
              {{#  layui.each(d.returnImages.split(','), function(index, item){ }}
               <img class="img_show_hide b1" width='60' height='60' src='{{ item }}' onerror="layui.admin.img_noFind()">
               {{# }) }}
            {{# } }}
           </div>
           <div style="padding-left:20px;">{{d.textReason}}</div>
        </div>
    </div>
    {{# if(d.disputeTextReason){ }}
    <div class="mlb40">
        <h2 class="h2style">卖家申诉理由</h2>
        <div class="reasonContent">
           <div>
            {{# if(d.disputeImages){  }}
                {{#  layui.each(d.disputeImages.split(','), function(index, item){ }}
                <img class="img_show_hide b1" width='60' height='60' src='{{item}}' onerror="layui.admin.img_noFind()">
                {{# }) }}
            {{# } }}
           </div>
           <div style="padding-left:20px;">{{d.disputeTextReason}}</div>
        </div>
    </div>

    {{# } }}
    <div class="mlb40">
        <h2 class="h2style">退款商品</h2>
        {{#  layui.each(d.sub, function(index, item){ }}
            <div class="reasonContent detailMb20">
                <div>
                    <img class="img_show_hide b1" width='60' height='60' src='{{item.itemImg}}' onerror="layui.admin.img_noFind()">
                </div>
                <div style="padding-left:20px;">
                    <div>{{item.shopItemSku}}</div>
                    <div>{{d.currency}} {{item.price}}*{{item.amount}}</div>
                    <div>{{item.title}}</div>
                </div>
            </div>
        {{# }) }}
    </div>
</script>

<%-- 申诉弹框 --%>
<script type="text/html" id="aftersale_appealDialog">
    <div style="padding:20px 50px 0 0;">
      <form class="layui-form" id="aftersale_appealForm">
        <div class="layui-form-item">
            <label class="layui-form-label">申诉类型</label>
            <div class="layui-input-block">
                <select name="disputeReason" id="aftersale_disputeReason" lay-search>
                    
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">原因</label>
            <div class="layui-input-block">
              <input type="text" class="layui-input" name="disputeTextReason">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">邮箱</label>
            <div class="layui-input-block">
              <input type="text" class="layui-input" name="disputeEmail">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">证据</label>
            <div class="layui-input-block">
              <%-- <a class="layui-btn layui-btn-sm" id="aftersale_appealUpload">上传</a> --%>
                <div in='innerImage' id="aftersale_appeal_images" style='width:638px;height:200px;border:1px solid #ccc'
                contenteditable='true'></div>
            </div>
        </div>
        <div class="layui-form-item">
           <div class="layui-input-block">
              <ul id="aftersale_appealImgs">
                  
              </ul>
           </div>
        </div>
      </form>
    </div>
</script>

<script src="${ctx}/static/UploadImage.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/process/imagePreview.min.js"></script>
<script src="${ctx}/static/js/customer/aftersale.js"></script>
