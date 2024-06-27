<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>购买计划</title>

<style>
    .purchaseplans_card_checkbox {
        margin: 20px 20px 0;
    }
    .purchaseplans_args_config_item,
    .purchaseplans_purchase_item,
    .purchaseplans_add_search {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 20px;
    }
    .purchaseplans_leave_layer {
        display: flex;
        justify-content: flex-end;
    }
    .purchaseplans_leave_layer_middle {
        margin: 0 20px;
    }
</style>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="purchaseplans_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select lay-search lay-filter="ebay_online_depart_sel1" class="orgs_hp_custom" name="org">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select lay-search lay-filter="ebay_online_salesman_sel" class="users_hp_custom" data-rolelist="ebay专员" name="saleperson">
                                    <option value=""></option>
                                </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select 
                                        id="purchaseplans_storeSel"
                                        lay-filter="purchaseplans_storeSel" 
                                        xm-select="purchaseplans_storeSel" 
                                        class="users_hp_store_multi" 
                                        xm-select-search xm-select-search-type="dl" 
                                        unlimited-select="all_store_can_sel" 
                                        xm-select-skin="normal" 
                                        data-platcode="ebay" 
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-search>
                                        <option value="itemId">itemID</option>
                                        <option value="title">标题</option>
                                        <option value="feedback">留评</option>
                                        <option value="shipmentTrackingNumber">跟踪号</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchTypeVal">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">买家ID</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="buyerId" 
                                        id="purchaseplans_buyerId"  
                                        xm-select="purchaseplans_buyerId_xm"
                                        xm-select-search 
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                    >
                                        <option value=""></option>
                                        
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-form-label labelSel">
                                    <select name="timeField" lay-search>
                                        <option value="create_time">创建时间</option>
                                        <option value="plan_buy_time">计划购买时间</option>
                                        <option value="actual_buy_time">实际购买时间</option>
                                        <option value="allocated_buyer_time">分配买家时间</option>
                                        <option value="feedback_time">留评时间</option> 
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="purchaseplans_rangeTime"  name="times" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderby" lay-search>
                                        <option value=""></option>
                                        <option value="create_time asc">创建时间正序</option>
                                        <option value="create_time desc">创建时间倒序</option>
                                        <option value="plan_buy_time asc">计划购买时间正序</option>
                                        <option value="plan_buy_time desc">计划购买时间倒序</option>
                                        <option value="actual_buy_time asc">实际购买时间正序</option>
                                        <option value="actual_buy_time desc">实际购买时间倒序</option>
                                        <option value="buyer asc">买家名称正序</option>
                                        <option value="buyer desc">买家名称倒序</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" value="0" id="purchaseplans-tabVal">
                            <input type="hidden" value="" id="purchaseplans_notEvaluateVal">
                            <input type="hidden" value="" id="purchaseplans_notBuyerVal">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="purchaseplans_submit">查询</span>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="purchaseplansCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header" style="display:flex;justify-content:space-between;">
                        <div class="layui-tab" lay-filter="purchaseplans-tabs" id="purchaseplans-tabs" style="display:flex;align-items: center;">
                            <ul class="layui-tab-title">
                                <li class="layui-this">购买计划(<span>点击显示</span>)</li>
                                <li>已取消(<span>点击显示</span>)</li>
                                <li>购买中(<span>点击显示</span>)</li>
                                <li>购买成功(<span>点击显示</span>)</li>
                                <li>购买失败(<span>点击显示</span>)</li>
                                <li>全部(<span>点击显示</span>)</li>
                            </ul>
                        </div>
                        <div>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="purchaseplans_args_config_button">
                                参数配置
                            </span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="purchaseplans_allocate_button">分配买家</span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal"  id="purchaseplans_leave_button">批量留评</span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="purchaseplans_purchase_button">
                                批量购买
                            </span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="purchaseplans_cancel_button">
                                批量取消
                            </span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="purchaseplans_delete_button">
                                批量删除
                            </span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="purchaseplans_add_button">
                                新增
                            </span>
                        </div>
                    </div>
                </div>
                <div class="ztt-card-checkbox purchaseplans_card_checkbox">
                    <div class="layui-form purchaseplans-notBuyer">
                        <input type="checkbox" name="" title="未分配买家" lay-skin="primary" lay-filter="purchaseplans_notBuyer">
                    </div>
                    <div class="layui-form purchaseplans-notEvaluate disN">
                        <input type="checkbox" name="" title="未留评" lay-skin="primary" lay-filter="purchaseplans_notEvaluate">
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="purchaseplans_table"  lay-filter="purchaseplans_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格图片 --%>
<script type="text/html" id="purchaseplans_img">
    <div>
        <img class="img_show_hide imgCss imgBorder" width="60" height="60" src="{{d.pictureUrl}}" onerror="layui.admin.img_noFind()">
    </div>
</script>

<%-- 表格时间 --%>
<script type="text/html" id="purchaseplans_times">
    <div style="display:flex;flex-direction:column;text-align:center;">
        <div><strong>创建:</strong><span>{{Format(d.createTime, 'yyyy-MM-dd hh:mm:ss')}}</span></div>
        <div><strong>修改:</strong><span>{{Format(d.modifyTime, 'yyyy-MM-dd hh:mm:ss')}}</span></div>
        <div><strong>计划:</strong><span>{{Format(d.planBuyTime, 'yyyy-MM-dd hh:mm:ss')}}</span></div>
        <div><strong>实际:</strong><span>{{Format(d.actualBuyTime, 'yyyy-MM-dd hh:mm:ss')}}</span></div>
        <div><strong>留评:</strong><span>{{Format(d.feedbackTime, 'yyyy-MM-dd hh:mm:ss')}}</span></div>
    </div>
</script>

<%-- 标题/itemId/店铺 --%>
<script type="text/html" id="purchaseplans_title">
    <div style="display:flex;flex-direction:column;">
        <div style="text-align:left;"><strong>标题:</strong>{{d.title}}</div>
        <div style="display:flex; justify-content: space-between;">
            <div>
                itemId:
                <a  href="http://www.ebay.co.uk/itm/{{d.itemId}}" target="_blank" style="color:#4ab2fe;">{{d.itemId}}</a>
            </div>
            <div>
            {{# if(d.storeAcctId){ }}
                <span>店铺: {{d.storeAcct}}</span>
            {{# }else{ }}
                <span style="backgroundColor:cyan;" title="该店铺不在系统中">店铺: {{d.storeAcct}}</span>
            {{# } }}
            </div>
        </div>
    </div>
</script>

<%-- 表格操作按钮 --%>
<script type="text/html" id="purchaseplans_tableIdBar">
    <div>
        {{# if(d.planStatus == 0 || d.planStatus == 1 || d.planStatus == 4){ }}
        <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="buy">购买</span><br>
        {{#  } }}

        {{# if(d.planStatus !=3){ }}
        <%-- <span class="layui-btn layui-btn-xs layui-btn-normal"  lay-event="edit">编辑</span><br> --%>
        <span class="layui-btn layui-btn-xs layui-btn-danger"  lay-event="delete">删除</span><br>
        {{#  } }}

        {{# if(d.planStatus ==3){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal"  lay-event="leave">留评</span><br>
        {{#  } }}

        {{# if(d.planStatus ==2){ }}
        <span class="layui-btn layui-btn-xs layui-btn-danger"  lay-event="cancel">取消</span>
        {{#  } }}
    </div>
</script>

<%-- 参数配置弹框 --%>
<script type="text/html" id="purchaseplans_args_config_layer">
    <div style="padding:20px;" id="purchaseplans_args_config_container"></div>
</script>

<script type="text/html" id="purchaseplans_args_config_template">
    <div class="purchaseplans_args_config_item">
        <div  style="width:300px;">一个买家每天可下单数量(单)</div>
        <input type="text" class="layui-input" id="purchaseplans_args_config_number" value="{{d.dailyOrderNum}}">
    </div>
    <div class="purchaseplans_args_config_item">
        <div  style="width:300px;">在同一家店铺下单间隔(天)</div>
        <input type="text" class="layui-input" id="purchaseplans_args_config_delay" value="{{d.storeInterval}}">
    </div>
</script>

<%-- 购买 --%>
<script type="text/html" id="purchaseplans_purchase_layer">
    <div style="padding:20px;">
        <div class="purchaseplans_purchase_item">
            <div  style="width:300px;">开始时间(英国)</div>
            <input type="text" class="layui-input" id="purchaseplans_purchase_time">
        </div>
        <div class="purchaseplans_purchase_item">
            <div  style="width:300px;">间隔(分钟)</div>
            <input type="text" class="layui-input" id="purchaseplans_purchase_minute">
        </div>
    </div>
</script>

<%-- 留评弹框 --%>
<script type="text/html" id="purchaseplans_leave_layer">
  <div style="padding:20px;"  id="purchaseplans_leave_layer_tableContainer">
  </div>
</script>

<%-- 留评表格模板 --%>
<script type="text/html" id="purchaseplans_leave_layer_tableTpl">
    <div class="purchaseplans_leave_layer_content">
        <div class="layui-form purchaseplans_leave_layer">
            <div class="layui-form-item">
                <select name="purchaseplans_leave_layer_middle_type" lay-filter="purchaseplans_leave_layer_middle_type" lay-search>
                <option value="">请选择</option>
                {{# if(d.emailType.length){ }}
                    {{#  layui.each(d.emailType, function(index, item){ }}
                    <option value="{{item.name}}">{{item.name}}</option>
                    {{# }) }}
                {{# } }}
                </select>
            </div>
            <div class="layui-form-item purchaseplans_leave_layer_middle">
                <select name="purchaseplans_leave_layer_middle_name" lay-search>
                <option value="">请选择</option>
                {{# if(d.nameType.length){ }}
                    {{#  layui.each(d.nameType, function(index, item){ }}
                    <option value="{{item.id}}">{{item.name}}</option>
                    {{# }) }}
                {{# } }}
                </select>
            </div>
            <div class="layui-form-item">
                <a href="javascript:;" class="layui-btn layui-btn-sm" id="purchaseplans_leave_layer_config">应用</a>
            </div>
        </div>
    </div>
    <div>
        <table class="layui-table">
            <thead>
                <tr>
                    <th>产品信息</th>
                    <th>买家账号</th>
                    <th>评论卖家</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody id="purchaseplans_leave_layer_table_tbody">
                {{#  layui.each(d.dataArr, function(index, item){ }}
                <tr>
                    <td>
                    {{item.title}}
                    <input type="hidden" value="{{item.id}}">
                    </td>
                    <td>{{item.buyer}}</td>
                    <td class="comment_textarea">
                        <textarea class="layui-textarea"></textarea>
                    </td>
                    <td><a href="javascript:;" class="layui-btn layui-btn-danger layui-btn-xs purchaseplans_leave_remove">移除</a></td>
                </tr>
            {{# }) }}
            </tbody>
        </table>
    </div>
</script>

<%-- 新增弹框 --%>
<script type="text/html" id="purchaseplans_add_layer">
    <div style="padding:20px">
        <div class="purchaseplans_add_search">
          <div style="width:50px;">itemID</div>
          <div style="flex:1;">
            <input type="text" class="layui-input" id="purchaseplans_add_search_input">
          </div>
          <div style="margin-left: 10px;">
            <span class="layui-btn layui-btn-sm layui-btn-normal" id="purchaseplans_add_search_btn">查询</span>
          </div>
        </div>
        <%-- <div class="purchaseplans_add_remove" style="display:flex;justify-content:flex-end;align-items: center;">
            <span class="layui-btn layui-btn-sm layui-btn-danger" id="purchaseplans_add_remove_btn">删除</span>
        </div> --%>
        <div class="purchaseplans_add_tableContainer">
            <table id="purchaseplans_add_table"  lay-filter="purchaseplans_add_tableFilter"></table>
        </div>
    </div>
</script>

<%-- 新增弹框的图片模板 --%>
<script type="text/html" id="purchaseplans_add_layer_img">
    <div>
        <img class="img_show_hide imgCss imgBorder" width="60" height="60" src="{{d.img}}" onerror="layui.admin.img_noFind()">
    </div>
</script>

<%-- 新增弹框的购买数量 --%>
<script type="text/html" id="purchaseplans_add_layer_number">
    <div>
        <input type="text" class="layui-input" value="1">
        <input type="hidden" value="{{d.storeAcctId}}">
    </div>
</script>

<%-- 新增弹框的操作栏 --%>
<script type="text/html" id="purchaseplans_add_layer_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-sm layui-btn-danger purchaseplans_add_layer_tableIdBar_remove">删除</span>
    </div>
</script>














<script src="${ctx}/static/js/customer/ebay/purchaseplans.js"></script>