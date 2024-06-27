<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>收货</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="checkgoods_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md4 layui-col-lg4">
                              <label class="layui-form-label">收货时间</label>
                              <div class="layui-input-block">
                                <input type="text" name="startEndDate" id="startEndDate" autocomplete="off" class="layui-input" placeholder='选择日期'>
                              </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">快递单号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="courierNumber" id="courierNumber" lay-verify="required|phone" autocomplete="off" class="layui-input" placeholder='输入快递单号'>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">包裹类型</label>
                              <div class="layui-input-block">
                                  <select name="packageType" id="checkgoods_pakageType"></select>
                              </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">收货人</label>
                                <div class="layui-input-block">
                                    <select name="consigneeNameList" id="checkgoods_creator"
                                        xm-select="checkgoods_creator"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">点货状态</label>
                              <div class="layui-input-block">
                                  <select name="hasScan" id="checkgoods_hasScan">
                                      <option value="">请选择</option>
                                      <option value="1">已点货</option>
                                      <option value="0">未点货</option>
                                  </select>
                              </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 disN" id="checkGoods_handleStatus">
                                <label class="layui-form-label">处理状态</label>
                                <div class="layui-input-block">
                                    <select name="dealStatus" id="checkgoods_dealStatus">
                                        <option value="">请选择</option>
                                        <option value="1">已处理</option>
                                        <option value="0">未处理</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否有图</label>
                                <div class="layui-input-block">
                                    <select name="hasImage" id="checkgoods_hasImage">
                                        <option value="-1">请选择</option>
                                        <option value="1">有图</option>
                                        <option value="0">无图</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">收件人</label>
                                <div class="layui-input-block">
                                    <input type="text" name="recipient" id="checkgood_recipient" autocomplete="off"
                                           class="layui-input" placeholder='输入 空 查询空数据'>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2  layui-col-md-offset6 layui-col-lg-offset6">
                              <div class="layui-input-block" style="text-align: right;">
                                <button class="layui-btn layui-btn-sm" type="button" id="checkgoods_search_btn">查询</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" >清空</button>
                              </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="checkGoodsCard">
               <div class="layui-tab" lay-filter="checkGoodsCard_tab">
                   <ul class="layui-tab-title">
                       <li class="layui-this" tab_type="1" >包裹数量(<span id="checkgoods_orderNum"></span>)</li>
                       <%--<li tab_type="2">包裹统计(<span id="checkGoodsCard_total_num"></span>)</li>--%>
                       <div style='float:right;line-height: 40px;'>
                           <button class="layui-btn layui-btn-sm layui-btn-normal" id="checkgoods_export_btn">导出(六个月之内)</button>
                           <button class="layui-btn layui-btn-sm layui-btn-normal" id="cg_saveOrder" >收货</button>
                           <permTag:perm funcCode="checkgoods_parcel_number_button">
                               <button id="checkgoods_parcel_number_button" hidden>修改包裹数量权限</button>
                           </permTag:perm>
                       </div>
                   </ul>
                   <div class="layui-tab-content">
                       <div class="layui-tab-item layui-show">
                           <table class="layui-table" id="checkgoods_data_table" lay-filter="checkgoods_data_table" style="margin: 0px;"></table>
                       </div>
                       <%--<div class="layui-tab-item">--%>
                           <%--<table class="layui-table" id="checkgoods_count_table"></table>--%>
                       <%--</div>--%>
                   </div>
               </div>
            </div>
        </div>
    </div>
</div>
<!--点货状态-->
<script type="text/html" id="checkgoods_hasScan_tpl">
    {{# if(d.hasScan == 0){ }}
        否
    {{# }else if(d.hasScan == 1){   }}
        是
    {{# } }}
</script>
<script type="text/html" id="checkgoods_recipient_tpl">
    <div>{{d.recipient}}  <i class="layui-icon layui-icon-edit" style="color: #009688" title="修改包裹收件人">&#xe642;</i></div>

</script>

<script type="text/html" id="checkgoods_parcel_number_tpl">
    <div>
        {{d.parcelNumber ? d.parcelNumber : 1}}  
        <i class="layui-icon layui-icon-edit" style="color: #009688" title="修改包裹数量">&#xe642;</i>
    </div>

</script>
<script type="text/html" id="checkgoods_image_tpl">
    <img  class="img_show_hide wish_imgCss lazy" width="80" height="60" data-original="{{d.image}}" style="display: block;" data-onerror="layui.admin.img_noFind()">
</script>

<%-- 收货弹框 --%>
<script type="text/html" id="checkGoodsLayer">
    <div style="padding:20px">
        <div>
            <input type='text' name='courierNumber' id='order_id' autocomplete='off' class='ivu-input' placeholder='快递单号'>
            <input type='text' id='cg_weight' name='weight' autocomplete='off' class='ivu-input' placeholder='重量'>
            <span style="font-size:14px;line-height:32px">重复输入更新商品重量和时间</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span><input type="checkbox" id="ck_isWeigh" style="vertical-align: middle;" checked>称重</span>
        </div>
        <div id='cg_count' class='cgCountStyle'></div>
        <table class="layui-table" id="checkgoods_layer_table"></table>
    </div>
</script>
<%-- 表格-操作 --%>
<script type="text/html" id="checkgoods_data_table_bar">
    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="showLog">日志</span>
</script>
<%--    日志--%>
<script type="text/html" id="checkgoods_data_table_logListLayer">
    <div style="padding:20px 50px 0 20px">
        <table class="layui-table" id="checkgoods_data_table_logTable"> </table>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/warehouse/checkGoods.js"></script>
