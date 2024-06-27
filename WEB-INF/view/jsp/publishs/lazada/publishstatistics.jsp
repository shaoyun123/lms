<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>lazada刊登统计</title>

<style>
dl[xid=lazada_publishstatistics_store_sel] {
    width: 500px !important;
}
.publishstatistics_flex {
    display: flex !important;
    justify-content: space-around;
    align-items: center;
}
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                   <form class="layui-form"  id="publishstatistics_lazada_searchForm">
                       <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="shopee_publishstatistics_depart_sel" lay-search lay-filter="shopee_publishstatistics_depart_sel"  class="orgs_hp_custom" name="orgId">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select  id="lazada_publishstatistics_salesman_sel" lay-filter="lazada_publishstatistics_salesman_sel"  class="users_hp_custom" data-rolelist="lazada专员" lay-search
                                    name="salePersonId">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="lazada_publishstatistics_store_sel" lay-filter="lazada_publishstatistics_store_sel" xm-select="lazada_publishstatistics_store_sel" class="users_hp_store_multi" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                    data-platcode="lazada" name="storeAcctId"></select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select id="lazada_publishstatistics_site_sel" lay-filter="lazada_publishstatistics_site_sel" xm-select="lazada_publishstatistics_site_sel" class="salesSite_hp_custom" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" name="salesSite"></select>
                                </div>
                            </div>

                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">刊登时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" readonly id="lazada_publishstatistics_times" name="lazada_publishstatistics_times">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1 publishstatistics_flex">
                                 <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="lazada_publishstatistics_submit">
                                查询</span>
                            </div>
                        </div>
                   </form>
                </div>
            </div>
            <%-- 表格 --%>
            <div class="layui-card" id="lazada_publishstatistics_card">
                <div class="layui-card-body">
                 <table class="layui-table" id="lazada_publishstatistics_table"  lay-filter="lazada_publishstatistics_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 销售上月刊登数 --%>
<script type="text/html" id="lazada_publishstatistics_lastMonth">
    <div>
       <span onmouseenter='lazada_publishstatistics_show(this,{{JSON.stringify(d.salePersonLastMonthListingDetail)}})' onmouseleave="lazada_publishstatistics_remove(this)">{{d.personLastMonthAmount}}</span>
    </div>
</script>

<%-- 销售本月刊登数 --%>
<script type="text/html" id="lazada_publishstatistics_thisMonth">
    <div>
       <span onmouseenter='lazada_publishstatistics_show(this,{{JSON.stringify(d.salePersonThisMonthListingDetail)}})' onmouseleave="lazada_publishstatistics_remove(this)">{{d.personThisMonthAmount}}</span>
    </div>
</script>

<%-- 悬浮显示详情 --%>
<script type="text/html" id="lazada_publishstatistics_detail">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="lazada_publishstatistics_detailTable"></table>
        </div>
    </div>
</script>


<script src="${ctx}/static/js/publishs/lazada/publishstatistics.js"></script>
