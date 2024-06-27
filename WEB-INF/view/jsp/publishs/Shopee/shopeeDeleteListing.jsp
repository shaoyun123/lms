<%-- Created by IntelliJ IDEA. User: shaohuiyun Date: 2021/8/31 Time: 15:52 To change this template use File | Settings
    | File Templates. --%>
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
        <html>

        <head>
            <title>删除Listing</title>
            <style>
                .shopee-delListing-interval {
                    height: 1px;
                    width: 100%;
                    clear: both;
                    margin-bottom: 30px;
                    padding-top: 20px;
                    border-bottom: 1px solid #d2d2d2;
                }
            </style>
        </head>

        <body>
            <div class="layui-fluid" id="LAY-shopeeDeleteListing">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form id="shopeeDeleteListingForm" class="layui-form">
                                    <h2 class="mb10">筛选条件</h2>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <select name="shopeeDeleteListingSiteAndStoreFilter" class=""
                                                lay-filter="shopeeDeleteListingSiteAndStoreFilter">
                                                <option value="1">站点</option>
                                                <option value="2">店铺</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-md9 layui-col-lg9">
                                            <select id="shopeeDeleteListingSiteAndStoreSelect"
                                                name="shopeeDeleteListingSiteAndStoreSelect"
                                                lay-filter="shopeeDeleteListingSiteAndStoreSelect"
                                                xm-select="shopeeDeleteListingSiteAndStoreSelect" xm-select-search
                                                xm-select-search-type="dl" xm-select-skin="normal"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md12 layui-col-lg12 mt10">
                                        <label class="layui-form-label">站点处理额度</label>
                                        <div class="layui-input-block">
                                            <a class="layui-btn layui-btn-sm"
                                                id="shopeeDeleteListingExportSiteDeleteLimit">下载模板</a>
                                            <a class="layui-btn layui-btn-sm"
                                                id="shopeeDeleteListingImportSiteDeleteLimit">导入</a>
                                            <%--<input type="file" id="shopeeDeleteListingImportFile" />--%>
                                            <b>（提醒：导入额度，只执行对应店铺的处理，站点和店铺条件不可选择）</b>
                                            <span name="deleteNumFileName"></span>
                                            <%--<input type="hidden" name="deleteNumFile">--%>
                                        </div>
                                    </div>
                                    <div class="shopee-delListing-interval"></div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <select name="zeroRecentSales">
                                                <option value="">请选择</option>
                                                <option value="1">7天销量为0</option>
                                                <option value="2">30天销量为0</option>
                                                <option value="3">60天销量为0</option>
                                                <option value="4" selected>90天销量为0</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-form-item disflex">
                                        <input type="checkbox" lay-skin="primary" name="isHistorySales" value="true"
                                            title="历史销量&le;">
                                        <div class="w200">
                                            <input type="number" lay-skin="primary" min="0" max="50" name="historySales" class="layui-input" onkeypress="commonKeyPressInputNotNega(event)" placeholder="输入不大于50的非负整数">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <input type="checkbox" lay-skin="primary" name="isZeroViews" value="true"
                                            title="浏览量0">
                                    </div>
                                    <div class="layui-form-item">
                                        <input type="checkbox" lay-skin="primary" name="isZeroLikes" value="true"
                                            title="收藏量0">
                                    </div>
                                    <div class="shopee-delListing-interval"></div>
                                    <%--<div class="layui-form-item">--%>
                                        <%--<input type="checkbox" lay-skin="primary" name="isBanned" value="true"
                                            title="禁售">--%>
                                            <%--< /div>--%>
                                                <div class="layui-form-item mb20">
                                                    <h3>以下3个商品状态选项至少选1种</h3>
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-col-md3 layui-col-lg3">
                                                        <select name="prodStatuses" xm-select="prodStatuses"
                                                            xm-select-search xm-select-search-type="dl"
                                                            xm-select-skin="normal">
                                                            <option value="">请选择</option>
                                                            <option value="bannedBanned" selected>已被禁</option>
                                                            <option value="bannedUnderView" selected>审核中</option>
                                                            <option value="UNLIST">已暂时下架</option>
                                                            <option value="NORMAL">在线</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <input type="checkbox" lay-skin="primary" name="allStockZero"
                                                        value="true" title="在线全部库存为0（大促前不要用）" lay-filter="shopeeDelListingAllStockZero">
                                                </div>
                                                <div class="layui-form-item">
                                                    <input type="checkbox" lay-skin="primary" name="isSale"
                                                        value="true" title="在线全部停售" lay-filter="shopeeDelListingIsSale">
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-col-md3 layui-col-lg3">
                                                        <label class="layui-form-label">刊登时间</label>
                                                        <div class="layui-input-block">
                                                            <input type="text" class="layui-input" readonly
                                                                id="shopeeDeleteListingTime"
                                                                name="shopeeDeleteListingTime" placeholder="请选择">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-col-md3 layui-col-lg3">
                                                        <label class="layui-form-label">商品标签</label>
                                                        <div class="layui-input-block">
                                                            <select name="prodAttrList" xm-select="shopee_delete_prodAttrList"
                                                                xm-select-search xm-select-search-type="dl"
                                                                xm-select-skin="normal">
                                                                <option value="">请选择</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layui-col-md3 layui-col-lg3">
                                                    <permTag:perm funcCode="shopee_delete_listing_implement">
                                                        <a class="layui-btn layui-btn-normal flo ml10"
                                                        id="shopeeDeleteListingImmediatelyBtn"
                                                        style="float: right;">删除listing</a>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="shopee_delete_listing_temporarily">
                                                        <a class="layui-btn layui-btn-normal flo"
                                                            id="shopeeDeleteListingTemporarilyOffBtn"
                                                            style="float: right;">暂时下架</a>
                                                    </permTag:perm>
                                                </div>
                                                <div style="clear: both;"></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>

        </html>
        <script src="${ctx}/static/js/publishs/shopee/shopeeDeleteListing.js"></script>