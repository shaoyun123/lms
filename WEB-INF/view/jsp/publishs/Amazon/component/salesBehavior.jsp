<%--
  Created by IntelliJ IDEA.
  User: EPEAN
  Date: 2021-07-01
  Time: 17:54
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!-- 表现详情 -->
<script type="text/html" id="amazon_component_salesBehavior_pop">
        <div class="layui-form-item" style="margin-top:20px">
            <div></div>
            <div class="layui-col-md1 layui-col-lg1">
                <div style="margin-left:40px">
                    <img width="50" height="50" data-original="" class="img_show_hide b1"
                         data-onerror="layui.admin.img_noFind()" id="FBAhistory_tabledetail_img" >
                </div>
            </div>
            <div class="layui-col-md1 layui-col-lg1">
                <span id="FBAhistory_detail_search_form_asin"></span>
            </div>
            <form class="layui-form" id="FBAhistory_detail_search_form" lay-filter="FBAhistory_detail_search_form">
                <input name="asin" hidden>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                        <select name="storeIdListStr" lay-filter="FBAhistory_detail_search_form_sel">

                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block">
                        <select name="salesSiteListStr" lay-filter="FBAhistory_detail_search_form_sel">

                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">时间</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="timeStr" id="FBAhistory_detail_timerange_input" readonly>
                    </div>
                </div>
            </form>
        </div>
        <div class="layui-card">
            <div class="layui-card-body">
                <table class="layui-table" lay-filter="FBAhistory_datadetail_table" id="FBAhistory_datadetail_table"></table>
            </div>
        </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/amazon/component/salesBehavior.js?v=${ver}"></script>
