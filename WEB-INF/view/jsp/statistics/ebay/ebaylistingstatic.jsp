<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <title>ebay listing利润分析</title>
<style type="text/css">
    a.ebay_listing_itemId{
        color: #428bca;;
    }
</style>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12 layui-col-lg12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" lay-filter="component-form-group" id="ebaylistingstaticForm">
                            <div class="layui-form-item">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select name="orgId" lay-filter="entries_orgFilter" class="orgs_hp_custom">
                                            <option value=""></option>
                                            </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                        <select name="salePersonId" class="users_hp_custom" data-rolelist="ebay专员" lay-filter="entries_sellerFilter" lay-search="">
                                                <option value=""></option>
                                            </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select name="storeAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="entries_search-store" lay-search="">
                                                    <option value=""></option>
                                            </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">站点</label>
                                    <div class="layui-input-block">
                                        <select name="siteName" lay-search="">
                                    		</select>
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">商品父SKU</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" name="prodPSku">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label"><font color="red">*</font>订单时间</label>
                                    <div class="layui-input-block" id="ebay_listing_time_div">
                                        <input type="text" class="layui-input" id="ebaylistingTime" name="orderQueryDate">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">刊登时间</label>
                                    <div class="layui-input-block" id="ebay_listing_order_time_div">
                                        <input type="text" class="layui-input" id="ebaylistingOrderTime" name="listingQueryDate">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">item_id</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" id="itemId" name="itemId" lay-filter="itemId">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">商品所在国家</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" id="location" name="location" lay-filter="location">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">排序</label>
                                    <div class="layui-input-block">
                                        <select name="collation" lay-filter="collation">
                                                <option value="0">按订单数量倒序</option>
                                                <option value="1">按销售额倒序</option>
                                                <option value="2">按销售利润倒序</option>
                                                <option value="3">按毛利率倒序</option>
                                                <option value="4">按毛利率正序</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2 pl20">
                                    <button id="ebaylistingstaticsearchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                    <button class="layui-btn layui-btn-sm" type="button" id="export_exportEbayListing" lay-filter="export_exportEbayListing">导出</button>
                                </div> 
                            </div>
                            <div class="layui-form-item" style="display: flex;justify-content: flex-end;">
                                <input type="checkbox" name="ebaylistingstatic_number" title="统计总数(统计总数可能会耗时较长)" lay-skin="primary">
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card" id="incomeOutCard">
                    <div class="layui-card-body">
                        <table class="layui-table" lay-filter="order_tablefilter" id="ebaylistingstaticTable"></table>
                        <div id="demo7"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="${ctx}/static/js/statistics/ebay/ebaylistingstatic.js"></script>
<%--<script type="text/html" id="fileDownPop_ebaylisting">--%>
<%--    <div style="text-align: center">--%>
<%--        <div id="ebaylisting_downTip" style="margin-top: 20px">文件正在准备中，请稍等...</div>--%>
<%--        <div class="fl" >--%>
<%--            <div style="margin: 30px 200px;" id="ebaylisting_toDownFileBtn" class="layui-btn layui-btn-sm disN">下载文件</div>--%>
<%--        </div>--%>
<%--    </div>--%>
<%--</script>--%>