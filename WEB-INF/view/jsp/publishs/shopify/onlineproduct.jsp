<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>shopify在线商品</title>
<style>
    img.shopify_imgCss {
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

    .dis_flex {
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

    #shopify_onlilne_product .layui-tab-title {
        height: 41px !important;
    }

    .long_badge {
        width: 35px !important;
    }

    #shopify_onlilne_product .layui-tab-content {
        padding: 0;
    }

    #shopify_onlilne_product .layui-form-select dl {
        max-height: 400px !important;
        overflow-y: auto;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    #shopify_onlineproduct_modifyspecific .layui-btn + .layui-btn {
        margin-left: 10px;
    }

    .mg_50 {
        margin: 50px;
    }

    .ml {
        margin-left: 5px;
    }
</style>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<div class="layui-fluid" id="shopify_onlilne_product">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="pl_shopify_searchForm" id="pl_shopify_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="shopify_online_depart_sel" lay-search
                                            lay-filter="shopify_online_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="shopify_online_salesman_sel" lay-search
                                            lay-filter="shopify_online_salesman_sel" class="users_hp_custom"
                                            data-rolelist="shopify专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="shopify_online_store_sel" lay-filter="shopify_online_store_sel"
                                            xm-select="shopify_online_store_sel" class="users_hp_store_multi"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            data-platcode="shopify"></select>
                                </div>
                            </div>

                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">sku</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md7 layui-col-lg7">
                                        <input  class="layui-input" autocomplete="off" id="shopify_online_searchtype_input" placeholder="默认商品父sku">
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <select name="shopify_online_searchtype_sel" id="shopify_online_searchtype_sel"
                                                lay-filter="shopify_online_searchtype_sel">
                                            <option value="prodPSKu">商品父sku</option>
                                            <option value="prodSSku">商品子sku</option>
                                            <option value="storePSku">店铺父sku</option>
                                            <option value="storeSSku">店铺子sku</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">产品标题</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md7 layui-col-lg7">
                                        <input  class="layui-input" autocomplete="off" id="shopify_online_title" placeholder="默认分词全模糊查询">
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <select id="shopify_online_title_search_type">
                                            <option value="0">分词全模糊</option>
                                            <option value="1">常规模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">ProductId</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off"
                                           id="shopify_online_productId" placeholder="产品id">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">刊登时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off"
                                           id="shopify_online_listtime">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="" id="shopify_online_sortdesc_sel"
                                            lay-filter="shopify_online_sortdesc_sel">
                                        <option value=""></option>
                                        <option value="1">刊登时间升序</option>
                                        <option value="2">刊登时间降序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发专员销售</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="shopify_online_userId">
                                    <div>
                                        <input id="shopify_pl_searchSysUser"  name="shopify_online_userName" class="layui-input"/>
                                    </div>
                                    <div class="shopifyOnline_dimResultDiv"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div style="margin-left: 20px">
                                    <button type="button" class="layui-btn layui-btn-sm keyHandle"
                                            id="shopify_online_search_submit">查询
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary"
                                            id="shopify_online_search_reset">清空
                                    </button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
            <div class="layui-card" id="shopifyOnlineProCard">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="shopify_online_tab_filter">
                        <div class="dis_flex layui-card-header">
                            <ul class="layui-tab-title">
                                <li class="layui-this" product_status_type="NORMAL">在线(<span
                                        id="shopify_online_online_num1_span"></span>)
                                </li>
                            </ul>
                            <div>
                                <div style="display: inline-block;">
                                    <a href="javascript:;" class="layui-btn layui-btn-sm"
                                       onclick="expandAll('shopifyOnlineProCard')">展开所有</a>
                                    <a href="javascript:;" class="layui-btn layui-btn-sm"
                                       onclick="PackUpAll('shopifyOnlineProCard')">收起所有</a>
                                </div>
                                <div class="layui-input-inline">
                                    <form id="isEnableForm" class="layui-form">
                                        <select name="isEnableSel" id="shopify_online_isEnableSel"
                                                lay-filter="shopify_online_isEnableSel">
                                            <option value="" data-link="" data-title="">批量操作跳转</option>
                                            <permTag:perm funcCode="batch_update_shopify">
                                                <option value="0" data-link="" data-title="">批量更新</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="adjust_price_shopify">
                                                <option value="1" data-link="route/iframe/shopify/adjustPriceProcess" data-title="调整价格">调整价格</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="modify_stock_shopify">
                                                <option value="2" data-link="route/iframe/shopify/shopifyModifyInventory" data-title="调整库存">调整库存</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="shopify_setAchievementSaleperson">
                                                <option value="3"  data-link="route/iframe/shopify/setAchievementSaleperson" data-title="设置开发专员销售">设置开发专员销售</option>
                                            </permTag:perm>

                                        </select>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="layui-tab-content">
                            <table class="layui-table" id="shopify_online_data_table"
                                   lay-filter="shopify_online_data_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<%--  图片模板 --%>
<script type="text/html" id="shopify_online_pImgs_tpl">
    <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
        <div class="findGoods epz_out">
            {{# if(d.mainImage != null){ }}
            <img class="img_show_hide shopify_imgCss lazy" data-original="{{d.mainImage}}" style="display: block;"
                 data-onerror="layui.admin.img_noFind()"> {{# } }}
        </div>
    </div>
</script>
<%--  标题模板 --%>
<script type="text/html" id="shopify_online_title_tpl">
    <div style="text-align: left;font-size: 12px;">
        {{d.title}}
        </br>
        <div style="color: #999;">
            [ {{d.storeAcct || ''}} ]
            <a class="itemId" target="_blank" href="{{d.productUrl}}">{{d.productId}}</a>
        </div>
    </div>
</script>
<%--  店铺父SKU --%>
<script type="text/html" id="shopify_online_storePSku_tpl">
    <div style="text-align: left;font-size: 12px;">
        {{d.storePSku || ''}}
        {{# if(d.storePSku || ''){ }}
            </br>
            <div style="color: #999;" title="对应的基础父商品sku"> [ {{d.prodPSku || ''}} ]</div>
        {{# } }}
    </div>
</script>
<%--  店铺子SKU --%>
<script type="text/html" id="shopify_online_storeSSku_tpl">
    <table class="layui-table colspantable" style="width: 750px;margin-left: -5px;font-size: 12px;">
        {{# layui.each(d.prodSyncSShopifyDtoList, function(index, item){ }} {{# if(index
        <5){ }} {{# if(index==d.prodSyncSShopifyDtoList.length-1){ }}
        <tr style="">
            {{# }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important">
            {{# } }} {{# }else{ }} {{# if(index == d.prodSyncSShopifyDtoList.length-1){ }}
        <tr style="display: none;" class="myj-hide">
            {{# }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important;display: none;" class="myj-hide">
            {{# } }} {{# } }}
            <td style="width:100px;text-align:left;padding-left: 5px;color: #000;word-break: break-all;font-size: 12px;">
                <p>{{item.storeSSku}}</p>
                {{# if(item.prodSSku){ }}
                <p style="color: #999;margin-top:10px" title="对应的基础子商品sku"> [ {{item.prodSSku || ''}} ]</p>
                {{# } }}
                </br>
            </td>
            <td style="width:120px;text-align: center;color: #000;font-size: 12px;"> {{item.color||''}}</td>
            <td style="width:120px;text-align: center;color: #000;font-size: 12px;"> {{item.size||''}}</td>
            <td style="width:120px;text-align: center;color: #000;font-size: 12px;"> {{item.style||''}}</td>
            <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.price||''}}</td>
            <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.stock }}</td>
            <td style="width:100px;text-align: center;font-size: 12px;"> {{ ((item.stockNum || 0) - (item.reservationNum
                || 0)) + '/' + (item.orderNotInNum || 0) + '/' + (item.lackUnPaiNum || 0) }}
            </td>
        </tr>
        {{# }); }}
    </table>
    {{# if(d.prodSyncSShopifyDtoList.length > 5){ }}
    <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">+
        展开</a> {{# } }}
</script>
<td class="layui-table-cell" style="width:120px;text-align: left;padding-left: 5px;"></td>
<script type="text/html" id="shopify_online_listTime_tpl">
    <div style="font-size: 12px;">
        <span style="color:#999;">刊登:</span> {{ Format(d.listingTime, "yyyy-MM-dd")}}<br>
        <span style="color:#999;">修改:</span> {{ Format(d.lastUpdated, "yyyy-MM-dd")}}<br>
    </div>
</script>

<script type="text/html" id="shopify_online_operate_tpl">
    <a class="layui-btn  layui-btn-xs" lay-event="shopify_online_updateOneItem">更新</a>
    <br>
    <a class="layui-btn  layui-btn-xs" lay-event="shopify_online_searchLog">日志</a>
    <br>
    <permTag:perm funcCode="shopify_onlineproducts_modifymultispecifics">
        <a class="layui-btn  layui-btn-xs" lay-event="shopify_online_modify">修改</a>
    </permTag:perm>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopify/onlineproduct.js"></script>
<script type="text/html" id="log_table_shopify">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="shopify_log_table" lay-filter="shopify_log_table"></table>
        </div>
    </div>
</script>
<%--  日志类型模板 --%>
<script type="text/html" id="shopify_log_operation">
    {{# if(d.operType==1){ }} 调价 {{# } }}
</script>



