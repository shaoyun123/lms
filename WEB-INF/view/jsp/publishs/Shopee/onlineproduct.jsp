<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
    <link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" />
        <title>shopee在线商品</title>
        <style>
            img.shopee_imgCss {
                width: auto;
                height: auto;
                max-width: 100%;
                max-height: 100%;
                padding: 1px;
                margin: auto;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                position: absolute;
            }
            
            a.itemId {
                color: #428bca;
            }
            
            div .findGoods {
                width: 60px;
                height: 60px;
            }
            
            div .epz_out {
                position: relative !important;
                border: 1px solid #ccc;
            }
            
            table.colspantable td {
                border: 0px;
                min-height: 10px;
                line-height: 10px;
            }
            
            .dis_flex_between {
                display: flex;
                justify-content: space-between;
            }
            
            span.myj-type-box {
                display: inline-block;
                margin-right: 5px;
                border: 1px solid #a0a3a6;
                border-radius: 4px;
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                color: #a0a3a6;
            }
            
            .myj-type-box.type-yellow {
                border-color: #d6ad1a;
                color: #d6ad1a;
            }
            
            a.productListSkuShow {
                color: #428bca;
            }
            
            #shopee_onlilne_product .layui-tab-title {
                height: 41px !important;
            }
            
            .long_badge {
                width: 35px!important;
            }
            
            #shopee_onlilne_product .layui-tab-content {
                padding: 0;
            }
            
            #shopee_onlilne_product .layui-form-select dl {
                max-height: 400px !important;
                overflow-y:auto;
            }

            #shopee_onlineproduct_modifyspecific .layui-btn+.layui-btn {
                margin-left: 10px;
            }
            
            .mg_50{
                margin:50px;
            }
            .ml{
                margin-left: 5px;
            }
            .ag-header-cell-text{
                white-space: break-spaces
            }
            .shopee_onlineproducts_exportSetting .layui-form-onswitch i{
                left: 50px;
            }
            .shopee_onlineproducts_exportSetting  .layui-form-switch{
                margin-top: 0px;
                width: 60px;
            }
            .shopee_onlineproducts_exportSetting em{
                width: 45px;
            }
            .exportSetting_grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, 20%);
            }
            .exportSetting_grid span{
                max-width: 140px;
            }
        </style>
        <link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
        <script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
        <div class="layui-fluid" id="shopee_onlilne_product">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <!-- 搜索条件 -->
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form class="layui-form" lay-filter="pl_shopee_searchForm" id="pl_shopee_searchForm">
                                <div class="layui-form-item">
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select id="shopee_online_depart_sel" name="orgId" lay-search lay-filter="shopee_online_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">销售人员</label>
                                        <div class="layui-input-block">
                                            <select id="shopee_online_salesman_sel" name="salePersonId" lay-search lay-filter="shopee_online_salesman_sel" class="users_hp_custom" data-rolelist="shopee专员">
                                        <option value=""></option>
                                    </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg4 layui-col-md4">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block" style="font-size: 12px;">
                                            <select id="shopee_online_store_sel" name="store" lay-filter="shopee_online_store_sel" xm-select="shopee_online_store_sel" class="users_hp_store_multi" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" data-platcode="shopee"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">站点</label>
                                        <div class="layui-input-block">
                                            <select id="shopee_online_site_sel" name="siteSel" lay-filter="shopee_online_site_sel" xm-select="shopee_online_site_sel" class="salesSite_hp_custom" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">商品类型</label>
                                        <div class="layui-input-block">
                                            <select name="producttype" id="shopee_online_producttype_sel" lay-filter="shopee_online_producttype_sel">
                                        <option value=""></option>
                                        <option value="0">单属性</option>
                                        <option value="1">多属性</option>
                                    </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">CNSC类目id</label>
                                        <div class="layui-input-block">
                                            <input class="layui-input" autocomplete="off" name="platCateId" id="shopee_online_platCateId" placeholder="支持多类目精确查询(整数型),英文逗号分隔" onblur="handleSku(this.value,event)">
                                        </div>
                                    </div>

                                    <!-- <div class="layui-form-item"> -->
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label labelSel">
                                            <select name="shopee_online_searchtype_sel" id="shopee_online_searchtype_sel" lay-filter="shopee_online_searchtype_sel">
                                        <option value="prodPSKu">商品父sku</option>
                                        <option value="prodSSku">商品子sku</option>
                                        <option value="storePSku">店铺父sku</option>
                                        <option value="storeSSku">店铺子sku</option>
                                    </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" name="searchtypeInput" class="layui-input" autocomplete="off" id="shopee_online_searchtype_input" placeholder="搜索类型">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label labelSel">
                                            <select id="shopee_online_idType" name="idType">
                                            <option value="itemId">item_id</option>
                                            <option value="globalItemId">global_item_id</option>
                                        </select></label>
                                        <div class="layui-input-block">
                                            <input class="layui-input" autocomplete="off" name="itemId" id="shopee_online_itemId" value="">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label labelSel">
                                            <select id="shopee_online_title_searchtype" name="searchtype" lay-filter="shopee_online_title_searchtype">
                                        <option value="0">刊登标题(分词全模糊)</option>
                                        <option value="1">刊登标题(常规模糊)</option>
                                    </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="title" autocomplete="off" id="shopee_online_title" placeholder="刊登标题">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">备货天数</label>
                                        <div class="layui-input-block">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="daysToShipStart" id="shopee_online_daysToShipStart" autocomplete="off" class="layui-input inputBorRadLeft">
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number"  name="daysToShipEnd" id="shopee_online_daysToShipEnd" autocomplete="off" class="layui-input inputRad">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                       <label class="layui-form-label">销量</label>
                                       <div class="layui-input-block">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="soldNumsStart" id="shopee_online_soldNumsStart" autocomplete="off" class="layui-input inputBorRadLeft">
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="soldNumsEnd" id="shopee_online_soldNumsEnd" autocomplete="off" class="layui-input inputRad">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">是否促销</label>
                                        <div class="layui-input-block">
                                            <select name="promotion" id="shopee_online_promotion_sel" lay-filter="shopee_online_promotion_sel">
                                        <option value=""></option>
                                        <option value="0">否</option>
                                        <option value="1">是</option>
                                    </select>
                                        </div>
                                    </div>
                                    <!-- </div>
                        <div class="layui-form-item"> -->
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">产品评分</label>
                                        <div class="layui-input-block">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="rating_start_input" id="shopee_noline_rating_star_input" autocomplete="off" class="layui-input inputBorRadLeft">
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="rating_end_input" id="shopee_noline_rating_end_input" autocomplete="off" class="layui-input inputRad">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label labelSel">
                                            <select name="timeType" id="time_type" lay-filter="time_type">
                                                <option value="1">刊登时间</option>
                                                <option value="2">boost定时时间</option>
                                                <option value="3">优化时间</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" name="listingTime" class="layui-input" autocomplete="off" id="shopee_online_listtime">
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <div class="layui-form-label labelSel" style="display: flex;width: 300px;padding-right:0">
                                            <select name="warehouseId" id="shopee_online_warehouseId"></select>
                                            <select name="allProperties">
                                                <option value="true">全部属性</option>
                                                <option value="false">部分属性</option>
                                            </select>
                                            <select name="preAvailableStockType">
                                                <option value="1">预计可用库存含在途</option>
                                                <option value="2">预计可用库存不含在途</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block disflex" style="margin-left: 300px;">
                                            <div>
                                                <input type="number" name="quantityStart" id="shopee_online_quantityStart" autocomplete="off" class="layui-input inputBorRadLeft">
                                            </div>
                                            <div>
                                                <input type="number" name="quantityEnd" id="shopee_online_quantityEnd" autocomplete="off" class="layui-input inputRad">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">促销名称</label>
                                        <div class="layui-input-block">
                                            <select id="shopee_online_distinct_sel" name="distinct" lay-search lay-filter="shopee_online_distinct_sel">
                                    </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">排序</label>
                                        <div class="layui-input-block">
                                            <select name="sortdesc" id="shopee_online_sortdesc_sel" lay-filter="shopee_online_sortdesc_sel" lay-search>
                                                <option value=""></option>
                                                <option value="p.last_update_time desc">修改时间降序</option>
                                                <option value="p.listing_time asc">刊登时间升序</option>
                                                <option value="p.listing_time desc">刊登时间降序</option>
                                                <option value="p.curr_price asc">价格升序</option>
                                                <option value="p.curr_price desc">价格降序</option>
                                                <!-- <option value="p.stock asc">在线数量升序</option>
                                                <option value="p.stock desc">在线数量降序</option> -->
                                                <option value="p.sales asc">卖出数量升序</option>
                                                <option value="p.sales desc">卖出数量降序</option>
                                                <option value="p.listing_price asc">刊登价升序</option>
                                                <option value="p.listing_price desc">刊登价降序</option>
                                                <option value="p.prod_p_sku asc">基础商品SKU升序</option>
                                                <option value="p.prod_p_sku desc">基础商品SKU降序</option>
                                                <option value="pe.seven_sales asc">7天销量升序</option>
                                                <option value="pe.seven_sales desc">7天销量降序</option>
                                                <option value="pe.thirty_sales asc">30天销量升序</option>
                                                <option value="pe.thirty_sales desc">30天销量降序</option>
                                                <option value="pe.sixty_sales asc">60天销量升序</option>
                                                <option value="pe.sixty_sales desc">60天销量降序</option>
                                                <option value="pe.ninety_sales asc">90天销量升序</option>
                                                <option value="pe.ninety_sales desc">90天销量降序</option>
                                                <option value="p.optimized_time desc">优化时间降序</option>
                                                <option value="p.optimized_time asc">优化时间升序</option>
                                                <option value="p.views desc">浏览量降序</option>
                                                <option value="p.views asc">浏览量升序</option>
                                                <option value="s.total_reserved_stock desc">活动库存降序</option>
                                                <option value="s.total_reserved_stock">活动库存升序</option>
                                                <option value="s.oa_available_stock desc">卖家可用库存降序</option>
                                                <option value="s.oa_available_stock asc">卖家可用库存升序</option>
                                                <option value="s.shopee_stock_cnn desc">Shopee南宁仓库存降序</option>
                                                <option value="s.shopee_stock_cnn">Shopee南宁仓库存升序</option>
                                                <option value="pspst.create_time asc">选中在线listing标签添加天数倒序</option>
                                                <option value="pspst.create_time desc">选中在线listing标签添加天数正序</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <%-- <label class="layui-form-label">7日销量</label>
                                       <div class="layui-input-block">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="lastWeekSalesStart" id="shopee_online_lastWeekSalesStart" autocomplete="off" class="layui-input inputBorRadLeft">
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="lastWeekSalesEnd" id="shopee_online_lastWeekSalesEnd" autocomplete="off" class="layui-input inputRad">
                                            </div>
                                        </div>--%>
                                        <div class="layui-form-label labelSel">
                                            <select name="isPlatSales">
                                                <option value="false">直邮订单</option>
                                                <option value="true">平台仓订单</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <div class="layui-col-md4 layui-col-lg4">
                                                <select name="searchSalesType">
                                                    <option value="1">7天销量</option>
                                                    <option value="2">30天销量</option>
                                                    <option value="3">60天销量</option>
                                                    <option value="4">90天销量</option>
                                                </select>
                                            </div>
                                            <div class="layui-col-md4 layui-col-lg4">
                                                <input type="number" class="layui-input inputBorRadLeft" name="salesMin">
                                            </div>
                                            <div class="layui-col-md4 layui-col-lg4">
                                                <input type="number" class="layui-input inputRad" name="salesMax">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label">收藏数</div>
                                        <div class="layui-input-block">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="watchStart" id="shopee_noline_watchStart_input"  autocomplete="off" class="layui-input inputBorRadLeft">
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="watchEnd"  id="shopee_noline_watchEnd_input" autocomplete="off" class="layui-input inputRad">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">浏览量</label>
                                        <div class="layui-input-block">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="hitCountStart" id="shopee_noline_hitCountStart_input" autocomplete="off" class="layui-input inputBorRadLeft">
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="hitCountEnd"  id="shopee_noline_hitCountEnd_input" autocomplete="off" class="layui-input inputRad">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">OA新类目</label>
                                        <div class="layui-input-block">
                                            <input id="shopee_online_oaNewcateId" name="oaNewcateId" />
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label labelSel">
                                            <select id="shopee_online_price_searchtype" name="priceSearchType" lay-filter="shopee_online_price_searchtype">
                                        <option value="0">刊登价</option>
                                        <option value="1">现价</option>
                                    </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number" name="priceStartInput" id="shopee_noline_price_start_input" autocomplete="off" class="layui-input inputBorRadLeft">
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <input type="number"  name="priceEndInput"  id="shopee_noline_price_end_input" autocomplete="off" class="layui-input inputRad">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">商品标签</label>
                                        <div class="layui-input-block">
                                            <select id="shopee_online_productLabel_sel" name="productLabel" lay-search lay-filter="shopee_online_productLabel_sel"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">boost</label>
                                        <div class="layui-input-block">
                                            <select name="boosted" id="shopee_online_boosted_sel" lay-filter="shopee_online_boosted_sel">
                                                <option value=""></option>
                                                <option value="1">是</option>
                                                <option value="2">否(无定时)</option>
                                                <option value="3">定时</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">是否优化</label>
                                        <div class="layui-input-block">
                                            <select name="isOptimized" id="shopee_online_is_optimized" lay-filter="shopee_online_is_optimized">
                                                <option value=""></option>
                                                <option value="1">是</option>
                                                <option value="0">否</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">在售状态</label>
                                        <div class="layui-input-block">
                                            <select id="shopee_online_is_sale_status_sel" name="prodIsSaleStatus" xm-select="shopee_online_is_sale_status_sel" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter="shopee_online_is_sale_status_sel">
                                                <option value="">全部</option>
                                                <option value="2">全部在售</option>
                                                <option value="1">部分在售</option>
                                                <option value="0">全部停售</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">刊登类型</label>
                                        <div class="layui-input-block">
                                            <select name="listingType" id="shopee_online_listing_type_sel" lay-filter="shopee_online_listing_type_sel">
                                                <option value="">全部</option>
                                                <option value="SALE">销售刊登</option>
                                                <option value="SYS">系统刊登</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">是否捆绑销售</label>
                                        <div class="layui-input-block">
                                            <select name="ifBundleDeal" id="shopee_online_ifBundleDeal" lay-filter="shopee_online_ifBundleDeal">
                                                <option value=""></option>
                                                <option value="0">否</option>
                                                <option value="1">是</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2 hidden only-show-banList">
                                        <label class="layui-form-label">违规状态</label>
                                        <div class="layui-input-block">
                                            <select name="productBannedStatus">
                                                <option value="">全部</option>
                                                <option value="banned">违规</option>
                                                <option value="under view">审查中</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">是否预售</label>
                                        <div class="layui-input-block">
                                            <select name="isPreOrder">
                                                <option value="">全部</option>
                                                <option value="true">是</option>
                                                <option value="false">否</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label labelSel">
                                            <select name="stockType">
                                            <option value="0">卖家可用库存</option>
                                            <option value="1">Shopee南宁仓库存</option>
                                            <option value="2">活动库存</option>
                                            <option value="3">卖家可用总库存</option>
                                        </select></label>
                                        <div class="layui-input-block disflex">
                                            <input type="text" class="layui-input" name="stockStart" onkeypress="commonKeyPressInputNotNega(event)">
                                            <span class="ml10 mr10">-</span>
                                            <input type="text" class="layui-input" name="stockEnd"  onkeypress="commonKeyPressInputNotNega(event)">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">可用视频</label>
                                        <div class="layui-input-block">
                                            <select name="usefulVideo">
                                                <option value="">请选择</option>
                                                <option value="true">有</option>
                                                <option value="false">无</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">已上传视频</label>
                                        <div class="layui-input-block">
                                            <select name="uploadedVideo">
                                                <option value="">请选择</option>
                                                <option value="true">是</option>
                                                <option value="false">否</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">视频标签</label>
                                        <div class="layui-input-block disflex">
                                            <div class="w100">
                                                <select name="videoTagsType">
                                                    <option value="includeVideoTags">包含</option>
                                                    <option value="notIncludeVideoTags">不包含</option>
                                                </select>
                                            </div>
                                            <select name="videoTags" id="shopee_online_videoTags" lay-filter="shopee_online_videoTags" xm-select="shopee_online_videoTags"  xm-select-search xm-select-search-type="dl" xm-select-skin="normal" data-platcode="shopee"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">视频添加时间</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" autocomplete="off" id="shopee_online_video_addTime" name="videoAddTime">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">CNSC类目</label>
                                        <div class="layui-input-block">
                                            <input id="shopee_online_cnscCateIds" name="cnscCateIds">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">店铺标签</label>
                                        <div class="layui-input-block">
                                            <select name="storeTagList"
                                                xm-select="shopee_online_storeTagList"
                                                lay-filter="shopee_online_storeTagList"
                                                xm-select-search
                                                xm-select-search-type="dl"
                                                xm-select-skin="normal"
                                            ></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label" style="width: 90px; padding: 9px 5px;">在线listing标签</label>
                                        <div class="layui-input-block disflex">
                                            <div class="w100">
                                                <select name="listingTagInclude">
                                                    <option value="true">包含</option>
                                                    <option value="false">不包含</option>
                                                </select>
                                            </div>
                                            <div>
                                                <select name="listingTagList"
                                                    xm-select="shopee_online_listingTagList"
                                                    lay-filter="shopee_online_listingTagList"
                                                    xm-select-search
                                                    xm-select-search-type="dl"
                                                    xm-select-skin="normal"
                                                ></select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">listing备注</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" autocomplete="off" name="listingRemark" placeholder="请输入">
                                        </div>
                                    </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">侵权状态</label>
                                        <div class="layui-input-block">
                                            <select name="tortPlat" xm-select="shopee_online_tortPlat" xm-select-search
                                                xm-select-search-type="dl" xm-select-skin="normal"
                                            >
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2 only-show-onlineList">
                                        <label class="layui-form-label">deboost</label>
                                        <div class="layui-input-block">
                                            <select name="deboost" id="shopee_online_deboost_sel" lay-filter="shopee_online_deboost_sel">
                                                <option value=""></option>
                                                <option value="true">是</option>
                                                <option value="false">否</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2 not-show-reviewAndUnList">
                                        <label class="layui-form-label">违规类型</label>
                                        <div class="layui-input-block">
                                            <select name="violationTypeList"
                                                xm-select="shopee_online_violationTypeList"
                                                lay-filter="shopee_online_violationTypeList"
                                                xm-select-search
                                                xm-select-search-type="dl"
                                                xm-select-skin="normal"
                                            ></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2 not-show-reviewAndUnList">
                                        <label class="layui-form-label">整改时间</label>
                                        <div class="layui-input-block">
                                            <input id="shopee_online_deadlineToFix_time" class="layui-input"/>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2 only-show-deleteList disN">
                                        <label class="layui-form-label">删除方式</label>
                                        <div class="layui-input-block">
                                            <select name="prodStatusDeleteType" id="shopee_online_prodStatusDeleteType" lay-filter="shopee_online_prodStatusDeleteType">
                                                <option value="">请选择</option>
                                                <option value="SHOPEE_DELETE">平台删除</option>
                                                <option value="SELLER_DELETE">卖家删除</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">物流名称</label>
                                        <div class="layui-input-block">
                                            <select name="logisticsIdListStr"
                                                xm-select="shopee_online_logisticsIdListStr"
                                                lay-filter="shopee_online_logisticsIdListStr"
                                                xm-select-search
                                                xm-select-search-type="dl"
                                                xm-select-skin="normal"
                                            ></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <div style="float:right;">
                                            <button type="button" class="layui-btn layui-btn-sm keyHandle" id="shopee_online_search_submit">查询</button>
                                            <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary" id="shopee_online_search_reset">清空</button>
                                            <div id="shopee_online_save" class="inline_block pora"></div>
                                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal ml10" id="shopee_onlilne_export_btn" style="margin-left: 30px;">导出</button>
                                            <span id="shopee_online_copy_list" style="position:relative;" onmouseover="showTip(`最多复制1w个`,this)" onmouseout="removeTip(this)">
                                                <button type="button" class="layui-btn layui-btn-sm">一键复制</button>
                                                <ul class="hidden">
                                                    <li class="shopeeOnline_copyData" data-type="itemId" data-typestr="item_id" >item_id</li>
                                                    <li class="shopeeOnline_copyData" data-type="prodPSku" data-typestr="商品父SKU" >商品父SKU</li>
                                                    <li class="shopeeOnline_copyData" data-type="globalItemId" data-typestr="global_item_id" >global_item_id</li>
                                                    <li class="shopeeOnline_copyData" data-type="storeAcct" data-typestr="店铺名称" >店铺名称</li>
                                                    <li class="shopeeOnline_copyData" data-type="siteId" data-typestr="shop_id" >shop_id</li>
                                                    <li class="shopeeOnline_copyData" data-type="salesperson" data-typestr="销售" >销售</li>
                                                </ul>
                                            </span>
                                        </div>
                                    </div>
                                    <input type="text" class="hidden" name="prodStatus" value="NORMAL">
                                    <div class="layui-col-md10 layui-col-lg10" id="shopee_online__search_cate_div" style="line-height: 36px;"></div>
                                    <!-- </div> -->
                                </div>

                            </form>
                        </div>
                    </div>
                    <div class="layui-card" id="shopeeOnlineProCard">
                        <div class="layui-card-body">
                            <div class="layui-tab" lay-filter="shopee_online_tab_filter">
                                <div class="dis_flex_between layui-card-header">
                                    <ul class="layui-tab-title">
                                        <li class="layui-this" product_status_type="NORMAL">在线(<span id="shopee_online_online_num1_span"></span>)</li>
                                        <li product_status_type="REVIEWING">审核中(<span id="shopee_online_online_num2_span"></span>)</li>
                                        <li product_status_type="SHOPEE_DELETE,ERROR_NOT_EXISTS,SELLER_DELETE">已删除(<span id="shopee_online_online_num3_span"></span>)</li>
                                        <li product_status_type="BANNED">已被禁(<span id="shopee_online_online_num4_span"></span>)</li>
                                        <li product_status_type="UNLIST">已暂时下架(<span id="shopee_online_online_num5_span"></span>)</li>
                                    </ul>
                                    <div class="disflex layui-form">
                                        <div style="display: flex;align-items: center">
                                            <!-- <permTag:perm funcCode="shopee_onlilne_import_adjust_store"> -->
                                            <!-- <div class="mr10">
                                                <permTag:perm funcCode="shopee_onlilne_settting_tag">
                                                    <button type="button" class="layui-btn layui-btn-sm ml10" id="shopee_onlilne_settting_tag">标签配置</button>
                                                </permTag:perm>
                                            </div> -->
                                            <div class="w150">
                                                <select name="exportType" lay-filter="shopee_online_exportType">
                                                    <option value="">下载模板</option>
                                                    <permTag:perm funcCode="shopee_onlilne_import_adjust_store">
                                                        <option value="storePrice">调整店铺价格</option>
                                                        <option value="cnscPrice">调整店铺CNSC价格</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="shopee_onlilne_import_titledesc">
                                                        <option value="titleOrDesc">重新生成店铺商品标题或描述</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="shopee_onlilne_import_productPrice">
                                                        <option value="productPrice">调整商品价格</option>
                                                    </permTag:perm>
                                                </select>
                                            </div>
                                            <div class="w150">
                                                <select name="importType" lay-filter="shopee_online_importType">
                                                    <option value="">导入模板</option>
                                                    <permTag:perm funcCode="shopee_onlilne_import_adjust_store">
                                                        <option value="importNewPrice">导入调价店铺</option>
                                                        <option value="importNewCnscPrice">导入CNSC调价店铺</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="shopee_onlilne_import_titledesc">
                                                        <option value="importNewTitle">导入重新生成标题店铺</option>
                                                        <option value="importNewDesc">导入重新生成描述</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="shopee_onlilne_import_productPrice">
                                                        <option value="importProductPrice">导入调价商品</option>
                                                    </permTag:perm>
                                                </select>
                                            </div>
                                            <input type="file" id="shopee_onlilne_import_adjust_store_file" hidden>
                                            <!-- </permTag:perm> -->
                                            <a href="javascript:;" class="layui-btn layui-btn-sm" onclick="expandAll('shopeeOnlineProCard')">展开所有</a>
                                            <a href="javascript:;" class="layui-btn layui-btn-sm" onclick="PackUpAll('shopeeOnlineProCard')">收起所有</a>
                                        </div>
                                        <div class="layui-input-inline disflex ml10" style="align-items: center;max-width: 300px;">
                                            <form id="isEnableForm" class="layui-form">
                                                <select name="isEnableSel" id="shopee_online_isEnableSel" lay-filter="shopee_online_isEnableSel">
                                            <option value=""   data-link="" data-title="">店铺商品操作</option>
                                            <permTag:perm funcCode="batch_update_shopee">
                                                <option value="0"   data-link="" data-title="">批量更新</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="modify_item_boost_shopee">
                                                <option value="11"  data-link="route/iframe/shopee/itemBoost" data-title="批量boost">批量boost</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="stop_publish_shopee">
                                                <option value="1"  data-link="route/iframe/shopee/stopPublish" data-title="删除listing">删除listing</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="modify_stock_shopee">
                                                <option value="2"  data-link="route/iframe/shopee/modifyStock" data-title="调整库存">调整库存</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="adjust_price_shopee">
                                                <option value="3"  data-link="route/iframe/shopee/adjustPriceProcess" data-title="调整原价和促销价格">调整原价和促销价格</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="adjust_promoprice_shopee">
                                                <option value="9"  data-link="route/iframe/shopee/adjustPromotionPriceProcess" data-title="仅调整促销价格">仅调整促销价格</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="modify_daytoship_shopee">
                                                <option value="4"  data-link="route/iframe/shopee/modifyDayToShip" data-title="调整备货天数">调整备货天数</option>
                                            </permTag:perm>
                                            <!-- <permTag:perm funcCode="modify_maintitle_shopee">
                                                <option value="5"  data-link="route/iframe/shopee/shopModifyMainTitle" data-title="批量修改标题">修改标题和描述</option>
                                            </permTag:perm> -->
                                            <permTag:perm funcCode="modify_title_shopee">
                                                <option value="19"  data-link="route/iframe/shopee/shopModifyTitle" data-title="批量修改标题">修改标题</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="modify_desc_shopee">
                                                <option value="20"  data-link="route/iframe/shopee/shopModifyDesc" data-title="批量修改描述">修改描述</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="addordelete_pro_item_shopee">
                                                <option value="6"  data-link="route/iframe/shopee/addOrDeletePromotionItem" data-title="添加/移除促销商品">添加/移除促销商品</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="addordelete_modify_classify_shopee">
                                                <option value="7"  data-link="route/iframe/shopee/modifyGoodsClassify" data-title="修改商品分类">修改商品分类</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="addordelete_modify_imgs_shopee">
                                            <option value="8"  data-link="route/iframe/shopee/replaceItemImg" data-title="修改商品图片">修改商品图片</option>
                                            </permTag:perm>
                                            <!-- <permTag:perm funcCode="addordelete_modify_ssku_shopee">
                                            <option value="10"  data-link="route/iframe/shopee/modifySSku" data-title="修改店铺子sku">修改店铺子sku</option>
                                            </permTag:perm> -->
                                            <permTag:perm funcCode="temporary_is_enable_shopee">
                                                <option value="12"  data-link="route/iframe/shopee/temporaryIsEnable" data-title="临时上下架">临时上下架</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="not_handle_listing_shopee">
                                                <option value="13"  data-link="route/iframe/shopee/notHandleListing" data-title="不处理Listing">不处理Listing</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="del_bundledeal_shopee">
                                                <option value="14"  data-link="route/iframe/shopee/delBundleDeal" data-title="移除Bundle Deal">移除Bundle Deal</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="create_sbsItems_shopee">
                                                <option value="15"  data-link="route/iframe/shopee/createSbsItems" data-title="创建SBS商品">创建SBS商品</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="upload_video_shopee">
                                                <option value="16"  data-title="上传视频">上传视频</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="del_video_shopee">
                                                <option value="17"  data-title="删除视频">删除视频</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="update_lisiting_tags_shopee">
                                                <option value="18"  data-link="route/iframe/shopee/updateLisitingTags" data-title="修改在线listing标签" >修改在线listing标签</option>
                                            </permTag:perm>
                                            <option value="21" data-link="route/iframe/shopee/shopeeModifySsku" data-title="编辑子SKU">编辑子SKU</option>
                                            <!-- <permTag:perm funcCode="del_video_shopee">
                                                <option value="21" data-title="修改在线listing标签" >修改在线listing标签</option>
                                            </permTag:perm> -->
                                        </select>
                                            </form>
                                            <form id="isCnscEnableForm" class="layui-form">
                                                <select name="isCnscEnableSel" id="shopee_online_isCnscEnableSel" lay-filter="shopee_online_isCnscEnableSel">
                                                    <option value=""   data-link="" data-title="">CNSC商品操作</option>
                                                    <permTag:perm funcCode="modify_cnscPrice_shopee">
                                                        <option value="1"  data-link="route/iframe/shopee/modifyCnscPrice" data-title="调整CNSC商品价格">调整CNSC商品价格</option>
                                                    </permTag:perm>
                                                </select>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-tab-content">
                                    <table class="layui-table" id="shopee_online_data_table" lay-filter="shopee_online_data_table"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/html" id="shopee_online_pImgs_tpl">
            <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
                <div class="findGoods epz_out">
                    {{# if(d.firstImage != null){ }}
                    <img class="img_show_hide shopee_imgCss lazy" data-original="{{d.firstImage}}" style="display: block;" data-onerror="layui.admin.img_noFind()"> {{# } }}
                </div>
            </div>
            {{# if(d.usefulVideo && d.uploadedVideo ){ }}
                <span lay-tips="有可用，已上传">[视频]</span>
                {{#}else if(d.usefulVideo && !d.uploadedVideo ){}}
                <span lay-tips="有可用，未上传">[视频]</span>

                {{#}else if(!d.usefulVideo && d.uploadedVideo ){ }}
                <span lay-tips="无可用，已上传">[视频]</span>
                {{#}else{ }}
                <span lay-tips="无可用，未上传">[视频]</span>
                {{# } }}
        </script>
        <script type="text/html" id="shopee_online_title_tpl">
            {{#  if(d.lastlistingRemarkObj.remark){ }}
                <div style="text-align: left;font-size: 12px;" lay-tips="{{d.lastlistingRemarkObj.remark}}">
            {{#   }else{ }}
                <div style="text-align: left;font-size: 12px;">
            {{#   } }}
                <a class="title" target="_blank" href="{{d.titleHref}}" style="color: #428bca;">{{d.title || ''}}</a>
                {{# if(d.prodStatus==='BANNED' && d.bannedReasonList && d.bannedReasonList.length){ }}
                <span class="hp-badge layui-bg-orange fr layTitle">违</span> {{# } }}{{# if(d.isPromotion){ }}
                <span class="hp-badge layui-bg-orange fr layTitle shopee_online_promotion_tip" pstart="{{d.discountStartTime || ''}}" pname="{{d.discountName || ''}}" pend="{{d.discountEndTime || ''}}">促</span> {{# } }} {{# if(d.ifBundleDeal==true){ }}
                <span class="hp-badge layui-bg-orange fr layTitle shopee_online_bundleDeal_tip" pid="{{d.bundleDealId || ''}}" pstart="{{d.bundleDealStartTime || ''}}" pname="{{d.bundleDealName}}" pend="{{d.bundleDealEndTime || ''}}">绑</span> {{# } }} {{# if(d.isDiscontinued == 1){ }}
                <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span> {{# } }} {{# if(d.isPreOrder){ }}
                <span class="hp-badge layui-bg-red fr layTitle" lay-title="预售">预</span> {{# } }} {{# if(d.deboost == true && d.prodStatus==='NORMAL'){ }}
                <span class="hp-badge layui-bg-red fr layTitle" lay-title="deboost" style="width:50px"  lay-event="shopee_online_violationInfo">deboost</span> {{# } }} {{# if(d.boostedStartTime != null ){ }}
                <span class="hp-badge layui-bg-red fr layTitle long_badge" lay-title="boost">boosted</span> {{# } }}  {{# if(d.boostedTiming != null ){ }}
                <span class="hp-badge layui-bg-orange fr layTitle long_badge lay-title shopee_online_boost_timing_tip"  pstart="{{d.boostedTiming || ''}}" >boosted</span> {{# } }}
                </br>
                <div>item_id:
                    <a class="itemId" target="_blank" href="{{d.itemIdSrc}}">{{d.itemId}}</a>
                    <span onclick="layui.admin.onlyCopyTxt('{{d.itemId}}')" style="display: {{d.itemId ? 'inline-block':'none'}}; cursor:pointer">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                </div>
                <div>
                    global_item_id:<span style="color: #428bca;">{{d.globalItemId}}</span>
                    {{#  if(d.brandId!==null && d.brandId !==undefined){ }}
                            brand ID:
                            <a>{{d.brandId}}</a>
                            <span onclick="layui.admin.onlyCopyTxt('{{d.brandId}}')" style="cursor:pointer">
                                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                            </span>
                        </span>
                    {{#  } }}
                </div>
                
                <div style="color: #999;">
                    [ {{d.storeAcct || ''}} ] &nbsp;&nbsp; [ {{ d.siteId}} ] &nbsp;&nbsp;[{{d.salesperson || ''}}]
                    {{#  if(d.storeTagList && d.storeTagList.length){ }}
                        {{# layui.each(d.storeTagList, function(_, tagitem){ }}
                            <span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">{{tagitem}}</span>
                        {{# }) }}
                    {{# } }}
                </div>
                <span >{{d.platCateId}}  {{d.fullCateNameTrans}}</span>
                <div style="text-align:right">
                    {{#  if(d.listingTagInfoList&& d.listingTagInfoList.length){ }}
                        {{# layui.each(d.listingTagInfoList, function(_, tagitem){ }}
                             <span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;" lay-tips="({{tagitem.tagAddDays}}){{tagitem.note}}">{{tagitem.name}}</span>
                        {{# }) }}
                    {{# } }}
                </div>
            </div>
        </script>
        <script type="text/html" id="shopee_online_storePSku_tpl">
            <div style="text-align: left;font-size: 12px;">
                {{d.storePSku || ''}} {{# if(d.isOffline =='1'){ }}
                <span class="popoverHover myj-type-box" tilte="已删除" title="">删</span> {{# } }}
                </br>
                <div style="color: #999;" title="对应的基础父商品sku"> [ 
                    <a>{{d.prodPSku || ''}}</a>
                    <span onclick="layui.admin.onlyCopyTxt('{{d.prodPSku}}')"  style="display: {{d.prodPSku ? 'inline-block':'none'}}; cursor:pointer">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                    ]</div>
                {{# if(d.prodStatus==='SHOPEE_DELETE'){ }}
                    <span class="hp-badge layui-bg-red fr" style="width:50px"  lay-event="shopee_online_violationInfo">平台删除</span> 
                {{#  }else if(d.prodStatus==='SELLER_DELETE'){ }}
                    <span class="hp-badge layui-bg-red fr" style="width:50px"  lay-event="shopee_online_violationInfo">卖家删除</span> 
                {{# } }}
            </div>
        </script>
        <script type="text/html" id="shopee_online_storeSSku_tpl">
            <table class="layui-table colspantable" style="width: 665px;margin-left: -5px;font-size: 12px;">
                {{# layui.each(d.prodSyncSShopeeDtos, function(index, item){ }} {{# if(index
                <5){ }} {{# if(index==d.prodSyncSShopeeDtos.length-1){ }} <tr style="">
                    {{# }else{ }}
                    <tr style="border-bottom: 1px solid #e6e6e6 !important">
                        {{# } }} {{# }else{ }} {{# if(index == d.prodSyncSShopeeDtos.length-1){ }}
                        <tr style="display: none;" class="myj-hide">
                            {{# }else{ }}
                            <tr style="border-bottom: 1px solid #e6e6e6 !important;display: none;" class="myj-hide">
                                {{# } }} {{# } }}
                                <td style="width:130px;text-align: left;padding-left: 5px;color: #000;word-break: break-all;font-size: 12px;">
                                    <p>{{item.storeSSku}}</p>
                                    {{# if(item.isDiscontinued =='1'){ }}
                                    <span class="hp-badge layui-bg-red fr" title="停售">停</span> {{# } }} {{# if(item.prodSSku){ }}
                                    <p style="color: #999;margin-top:10px" title="对应的基础子商品sku"> [ 
                                        <!-- {{item.prodSSku || ''}} -->
                                        <a>{{item.prodSSku || ''}}</a>
                                        <span onclick="layui.admin.onlyCopyTxt('{{item.prodSSku}}')" style="display: {{item.prodSSku ? 'inline-block':'none'}}; cursor:pointer">
                                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                                        </span>
                                         ]</p>
                                    {{# } }} {{# if(item.isOffline =='1'){ }}
                                    <span class="popoverHover myj-type-box" tilte="已删除" title="">删</span> {{# } }}
                                    <!-- </br> -->
                                </td>
                                <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> 
                                    {{item.variId||''}}
                                    {{#  if(item.listingTagInfoList&& item.listingTagInfoList.length){ }}
                                        {{# layui.each(item.listingTagInfoList, function(_, tagitem){ }}
                                            <span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;" lay-tips="({{tagitem.tagAddDays}}){{tagitem.note}}">{{tagitem.name}}</span>
                                        {{# }) }}
                                    {{# }  }}
                                </td>
                                <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.sTitle||''}}</td>
                                <td style="width:50px;text-align: center;color: #000;font-size: 12px;"> {{item.listingPrice||''}}</td>
                                <td style="width:60px;text-align: center;color: #000;font-size: 12px;"> {{item.sCurrentPrice || item.listingPrice }} <span style="color:#999;">{{d.currency}}</span></td>
                                <td style="width:100px;text-align: center;color: #000;font-size: 12px;"> {{item.totalReservedStock  || 0}}/{{item.sellerNormalStock || 0}}/{{item.shopeeStock  || 0}}</td>
                                <td style="width:100px;text-align: center;font-size: 12px;">
                                    {{# layui.each(item.stockInfoList, function(_, stockItem){ }}
                                    <div class="mt05">{{stockItem.warehouseName}}:{{ ((stockItem.currentStock || 0)-(stockItem.reservationStock || 0)-(stockItem.preReservationStock || 0)+(stockItem.onwayStock || 0)) + '/' + ((stockItem.currentStock || 0)-(stockItem.reservationStock || 0)-(stockItem.preReservationStock || 0)) }}</div>
                                    {{# }) }}
                                </td>
                                <td style="width:50px;text-align: center;font-size: 12px;line-height: 13px;"> 
                                    <div>
                                        直邮：{{ ((item.sevenSales || 0) + '/'  + (item.thirtySales || 0))  + '/' + (item.sixtySales || 0) + '/' + (item.ninetySales || 0) }}
                                    </div>
                                    <div class="mt05">
                                        平台：{{ ((item.platSevenSales || 0) + '/'  + (item.platThirtySales || 0))  + '/' + (item.platSixtySales || 0) + '/' + (item.platNinetySales || 0) }}
                                    </div>
                                </td>
                            </tr>
                            {{# }); }}
            </table>
            {{# if(d.prodSyncSShopeeDtos.length > 5){ }}
            <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">+ 展开</a> {{# } }}
        </script>
        <script type="text/html" id="shopee_online_attributes_tpl">
            <div style="text-align: left;padding-left: 5px;font-size: 12px;">
                {{d.attributes || '
                <div style="text-align: center;">-</div>' }}
            </div>
        </script>
        <td class="layui-table-cell" style="width:120px;text-align: left;padding-left: 5px;"> </td>
        <script type="text/html" id="shopee_online_listTime_tpl">
            <div style="font-size: 12px;">
                <span style="color:#999;">刊登:</span> {{ Format(d.listingTime, "yyyy-MM-dd")}}<br>
                <span style="color:#999;">修改:</span> {{ Format(d.lastUpdateTime, "yyyy-MM-dd")}}<br> {{# if(d.boostedStartTime != null){ }}
                <span style="color:#999;">booted:</span> {{ Format(d.boostedStartTime, "hh:mm:ss")}}<br> {{# } }}
                <span style="color:#999;">优化:</span> {{ Format(d.optimizedTime, "yyyy-MM-dd")}}<br>
                {{# if(['SHOPEE_DELETE','ERROR_NOT_EXISTS','SELLER_DELETE'].includes(d.prodStatus)){ }}
                <span style="color:#999;">删除:</span> {{ Format(d.deleteTime, "yyyy-MM-dd")}}<br>
                {{# } }}
            </div>
        </script>
        <script type="text/html" id="shopee_online_shipCost_tpl">
            <div style="text-align: left;font-size: 12px;">
                <span style="color:red">{{d.shippingService1 || ''}}</span>{{d.shippingSrv1Cost || '' }} {{# if(d.shippingSrv1Cost){ }} {{d.currency}} {{# } }}
                <br>
                <span style="color:blue">{{d.shippingService2 || '' }}</span>{{d.shippingSrv2Cost || '' }} {{# if(d.shippingSrv2Cost){ }} {{d.currency}} {{# } }}
                <br>
            </div>
        </script>
        <script type="text/html" id="shopee_online_effive_tpl">
            <div style="text-align: left;font-size: 12px;">
                <span style="width: 60px;text-align: right">浏览：</span>{{d.hitCount || 0 }}<br>
                <span style="width: 60px;text-align: right">收藏：</span>{{d.watchCount || 0}}<br>
                <span style="width: 60px;text-align: right">销量：</span>{{d.soldNums || 0}}<br>
                <span style="width: 60px;text-align: right">评分：</span>{{d.ratingStar || 0 }}<br>
                <!-- <span style="width: 60px;text-align: right">七日：</span>{{d.lastWeekSales || 0 }}<br> -->
            </div>
        </script>
        <script type="text/html" id="shopee_online_operate_tpl">
            <a class="layui-btn  layui-btn-xs" lay-event="shopee_online_updateOneItem">更新</a>
            <br>
            <a class="layui-btn  layui-btn-xs" lay-event="shopee_online_searchLog">日志</a>
            <br>
            <permTag:perm funcCode="shopee_onlineproducts_modifymultispecifics">
                <a class="layui-btn  layui-btn-xs" lay-event="shopee_online_modify">修改</a>
            </permTag:perm>
            {{# if(d.prodStatus==='BANNED'){ }}
                <a class="layui-btn  layui-btn-xs" lay-event="shopee_online_violationInfo">违规详情</a>
            {{# } }}
            <a class="layui-btn  layui-btn-xs" lay-event="shopee_online_remark">备注</a>
        </script>
        <script type="text/javascript" src="${ctx}/static/js/publishs/shopee/onlineproduct.js"></script>
        <script type="text/html" id="log_table_shopee">
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="shopee_log_table" lay-filter="shopee_log_table"></table>
                </div>
            </div>
        </script>
        <script type="text/html" id="shopee_onlineproducts_modifyspecfic">
            <div id="shopee_onlineproducts_modifyspecfic_container"></div>
        </script>
        <script type="text/html" id="shopee_onlineproducts_modifyspecfic_tpl">
            <div class="layui-colla-item">
                    <!--表格-->
                    <div class="layui-form">
                        <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">sku后缀批量</label>
                        <div class="layui-input-block dis_flex_between">
                        <div style="width:80px">
                            <select name="sufixSetType" id="shopeeonlineproduct_sufixSetType"
                                    lay-filter="shopeeonlineproduct_sufixSetType">
                                <option value="1">添加</option>
                                <option value="2">替换</option>
                                <option value="3">删除</option>
                            </select>
                        </div>
                        <input style="width:120px" type="text" class="layui-input" name="originalsku">
                        <div class="shopeeOnlineproduct_replacehide disN">
                            <div class="dis_flex_between">
                            <label class="layui-form-label">替换为</label>
                            <input type="text" class="layui-input" name="newsku" style="width:120px">
                            </div>
                        </div>
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="shopeeonlineproduct_batchSetSkuSufix(this)" >批量设置后缀
                        </button>
                    </div>
                    </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal ml" id="addNewRow">添加一行
                        </button>
                    </div>
                    <div class="layui-form-item mg_50">
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th>图片</th>
                                    <th class="stock">
                                        <div class="dis_flex_between"><input type="text" class="layui-input" name="variSku">
                                            <button class="layui-btn layui-btn-sm layui-btn-normal" onclick="shopeeOnlineProduct_batchOperator($(this),'variSku')">修改店铺sku</button>
                                        </div>
                                    </th>
                                    <th class="title">
                                        <div class="dis_flex_between"><input type="text" class="layui-input" name="title">
                                            <button class="layui-btn layui-btn-sm layui-btn-normal" onclick="shopeeOnlineProduct_batchOperator($(this),'title')">修改属性名</button>
                                        </div>
                                    </th>
                                    <th>
                                        <div class="dis_flex_between"><input type="number" class="layui-input" name="stock">
                                            <button class="layui-btn layui-btn-sm layui-btn-normal" onclick="shopeeOnlineProduct_batchOperator($(this),'stock')">修改数量</button>
                                        </div>
                                    </th>
                                    <th>
                                        <div class="dis_flex_between"><input type="number" class="layui-input" name="listingPrice">
                                            <button class="layui-btn layui-btn-sm layui-btn-normal" onclick="shopeeOnlineProduct_batchOperator($(this),'listingPrice')">修改价格</button>
                                        </div>
                                    </th>
                                    <th>商品sku</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="shopee_onlineproduct_modifyspecific">
                                {{#  layui.each(d.slist, function(index, subItem){ }}
                                <tr>
                                    <input name="ean" type="hidden" value="{{subItem.ean || ''}}">
                                    <input name="upc" type="hidden" value="{{subItem.upc || ''}}">
                                    <input name="variId" type="hidden" value="{{subItem.variId || ''}}">
                                    <td>
                                        <div style="width: 80px;">
                                            <input type="hidden" name="variAttr" value="{{subItem.variAttr || ''}}">
                                            <img class="img_show_hide" width="60" height="60" src="{{subItem.variAttr || ''}}" onerror="layui.admin.img_noFind()">
                                            <br>
                                            <div class="shopee_subSkuImg_edit_local layui-btn-sm layui-btn" style="padding:0px;">本地图片</div>
                                            <div class="layui-btn layui-btn-primary layui-btn-sm" style="margin-left:0px;margin-top:5px"
                                                 onclick="shopee_subSkuImg_exchangeNet(this)">网络图片</div>
                                        </div>
                                    </td>
                                    <td class="variSku">
                                        <input type="text" name="variSku" value="{{subItem.variSku||''}}" class="layui-input">
                                    </td>
                                    <td class="title">
                                        <input type="text" name="title" value="{{subItem.title || ''}}" class="layui-input">
                                    </td>
                                    <td class="stock">
                                        <input type="number" name="stock" value="{{subItem.stock !=undefined ? subItem.stock : ''}}" class="layui-input">
                                    </td>
                                    <td class="listingPrice">
                                        <input type="number" name="listingPrice" value="{{subItem.listingPrice || ''}}" class="layui-input">
                                    </td>
                                    <td class="prodSSku">
                                       {{subItem.prodSSku||''}}
                                    </td>
                                    <td>
                                        <button class="layui-btn layui-btn-sm layui-btn-danger" onclick="javascript:$(this).parents('tr').remove();">移除</button>
                                    </td>
                                </tr>
                                {{#  }); }}
                            </tbody>
                        </table>
                    </div>
            </div>
        </script>

        <script type="text/html" id="shopee_onlineproducts_modifyspecfic_row">
            <tr>
                <input name="ean" type="hidden" value="{{d.ean || ''}}">
                <input name="upc" type="hidden" value="{{d.upc || ''}}">
                <input name="variId" type="hidden" value="{{d.variId || ''}}">
                <td>
                    <div style="width: 80px;">
                        <input type="hidden" name="variAttr" value="{{d.variAttr || ''}}">
                        <img class="img_show_hide" width="60" height="60" src="{{d.variAttr || ''}}" onerror="layui.admin.img_noFind()">
                        <br>
                        <div class="shopee_subSkuImg_edit_local layui-btn-sm layui-btn" style="padding:0px;">本地图片</div>
                        <div class="layui-btn layui-btn-primary layui-btn-sm" style="margin-left:0px;margin-top:5px"
                             onclick="shopee_subSkuImg_exchangeNet(this)">网络图片</div>
                    </div>
                </td>
                <td class="variSku">
                    <input type="text" name="variSku" value="{{d.variSku||''}}" class="layui-input">
                </td>
                <td class="title">
                    <input type="text" name="title" value="{{d.title || ''}}" class="layui-input">
                </td>
                <td class="stock">
                    <input type="number" name="stock" value="{{d.stock !=undefined ? d.stock : ''}}" class="layui-input">
                </td>
                <td class="listingPrice">
                    <input type="number" name="listingPrice" value="{{d.listingPrice || ''}}" class="layui-input">
                </td>
                <td class="prodSSku">
                   {{d.prodSSku||''}}
                </td>
                <td>
                    <button class="layui-btn layui-btn-sm layui-btn-danger" onclick="javascript:$(this).parents('tr').remove();">移除</button>
                </td>
            </tr>
        </script>

        <!-- 违规详情 -->
        <script type="text/html" id="shopee_onlineproducts_bannedInfo_tpl">
            <div class="layui-card-body">
                <table class="layui-table" id="shopee_onlineproducts_bannedInfo_table"></table>
            </div>
        </script>
<script type="text/html" id="shopee_onlineproducts_export_container_script">
    <div id="shopee_onlineproducts_export_container"></div>
</script>

<!-- 批量修改在线listing标签 -->
<script type="text/html" id="shopee_onlineproducts_bacthListingtag_tpl">
    <div class="layui-card shopee_onlineproducts_bacthListingtag">
        <div class="layui-card-body layui-form">
            <div class="layui-form-item">
                <label class="layui-form-label">新增标签</label>
                <div class="layui-input-block disflex">
                   <select name="addListingTagIdList"
                        xm-select="shopee_onlineproducts_bacthListingtag_addTag"
                        lay-filter="shopee_onlineproducts_bacthListingtag_addTag"
                        xm-select-search
                        xm-select-search-type="dl"
                        xm-select-skin="normal"
                    ></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">移除标签</label>
                <div class="layui-input-block disflex">
                   <select name="removeListingTagIdList"
                        xm-select="shopee_onlineproducts_bacthListingtag_removeTag"
                        lay-filter="shopee_onlineproducts_bacthListingtag_removeTag"
                        xm-select-search
                        xm-select-search-type="dl"
                        xm-select-skin="normal"
                    ></select>
                </div>
            </div>
        </div>
    </div>
</script>

<!-- 备注 -->
<script type="text/html" id="shopee_onlineproducts_remark_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="shopee_onlineproducts_remark_table"></table>
            <textarea name="remark" placeholder="请输入备注最多可支持输入200字，超出无法输入" class="layui-textarea" maxlength="200" rows="6"></textarea>
        </div>
    </div>
</script>
<!-- 导出字段配置 -->
<script type="text/html" id="shopee_onlineproducts_exportSetting">
    <div class="layui-card shopee_onlineproducts_exportSetting">
        <div class="layui-card-body">
            <form class="layui-form" action="" id="shopee_online_exportSetting_form" lay-filter="shopee_online_exportSetting_form">
           {{#layui.each(d,function(index,item){}} 
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="mb10">
                            <span style="font-weight: bold;">{{item.name}}</span>
                            <input type="checkbox" name="{{item.key}}" lay-skin="switch" lay-text="全选|全选" lay-filter="{{'exportSetting_'+item.key}}" {{item.checked ?'checked':''}}>
                        </div>
                        <div class="exportSetting_grid">
                            {{#  layui.each(item.list,function(vIndex,v){}} 
                            <div title="{{v.title}}">
                                <input type="checkbox" name="{{'checkbox_'+item.key}}" title="{{v.title}}" lay-skin="primary" value="{{v.code}}" {{item.checked ?'checked':''}} lay-filter="{{'exportSetting_checkbox_'+item.key}}">
                            </div>
                                {{#   })}} 
                        </div>
                    </div>
                </div>
                {{#  })}} 
            </form>
            <div style="position: absolute;top:10px;right:44px">
                <div id="shopee_online_exportSetting_save" class="inline_block pora"></div>
            </div>
        </div>
    </div>
</script>
<!-- 违规详情 -->
<script type="text/html" id="shopee_onlineproducts_deboostInfo_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="shopee_onlineproducts_deboostInfo_table"></table>
        </div>
    </div>
</script>
<!-- 导入调价商品配置 -->
<script  type="text/html" id="shopee_onlineproducts_updateItemListingPriceAndDiscountPriceByExcel_script">
    <div class="layui-card">
        <div class="layui-card-body">
            <form action="" class="layui-form">
                <div class="layui-form-item">
                    <label class="layui-form-label">调整方式:</label>
                    <div class="layui-input-block">
                        <div>
                            <input type="checkbox" name="adjustOriginPriceIncrease" title="原价加价不处理" lay-skin="primary">
                        </div>
                        <div class="fRed">*勾选后将过滤掉新原价高于当前原价的商品，不做调价处理</div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><font class="fRed">*</font>选择文件:</label>
                    <div class="layui-input-block">
                        <button type="button" id="shopeeOnlineproductsUpdateItemListingPriceAndDiscountPriceByExcel" class="layui-btn layui-btn-sm layui-btn-primary">上传文件</button>
                        <span name="fileName"></span>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/vue/js/elementui@2.13.js"></script>
<script src="${ctx}/static/components/lodash.js"></script>