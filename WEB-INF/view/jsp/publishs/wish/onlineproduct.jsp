<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>wish在线商品</title>
<style>
    .starCss {
        font-size: 15px;
        color: #ffb800;
    }
    #LAY-wish-onlineproduct .layui-form-item{
        margin-bottom: 0;
    }
    .dis_flex{
        display:flex;
        justify-content: space-between;
    }
    a.pro-show-detail{
        margin-left: 10px;
        /*color: #d0d3d6;*/
        color: lightskyblue;
        word-break: keep-all;
    }
    a.storeProdPId{
        color: #428bca;
    }
    table.colspantable td{
        border:0px;
    }
    div.sell-hot-iocn {
        z-index: 10;
        position: absolute;
        top: 0;
        width: 25px;
        height: 24px;
        background: url('${ctx}/static/img/goldenDiamond.png') no-repeat;
    }
    div .findGoods {
        width: 60px;
        height: 60px;
    }
    div .sell-hot-iocn-box {
        position: relative;
    }
    div .epz_out {
        position: relative !important;
        border: 1px solid #ccc;
    }
    img.wish_imgCss {
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
    span.myj-type-box-we {
        display: inline-block;
        margin-right: 5px;
        border: 1px solid #87CEEB;
        border-radius: 4px;
        width: 30px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #87CEEB;
    }
    .myj-type-box.type-red {
        border-color: #ec4339;
        color: #ec4339;
    }
    .myj-type-box.type-yellow {
        border-color: #d6ad1a;
        color: #d6ad1a;
    }
    td .bg-gray {
        color: #737679;
        background-color: #f2f2f2 !important;
    }
    .mLeft20 {
        margin-left: 20px;
    }
    tbody > tr > td .detail-tag {
        margin-right: 10px;
        border-radius: 4px;
        padding: 3px 6px;
        height: 26px;
        line-height: 26px;
        color: #fff;
        background-color: #428bca;
    }
    span.gray-c {
        color: #737679 !important;
    }
    #wish_online_div_audit_chk div{
        margin-top: 5px;
    }
    a.productListSkuShow{
        color: #428bca;
    }
    #isEnableForm .layui-form-select dl {
        max-height: 900px
    }
    #LAY-wish-onlineproduct .layui-tab-title{
        height: 41px !important;
    }
    #LAY-wish-onlineproduct .layui-tab-content{
        padding: 0;
    }
    .update_sellerNote{
        color: #009688;
        cursor: pointer;
    }
    .wish_online_sales{
        border-bottom: 1px solid lightsteelblue;
        margin-left: -5px;
        margin-right: -5px;
        text-align: center;
    }
    .wish_online_operate_btn{
        position: absolute;
        background: #fff;
        z-index: 99999;
        border: 1px solid #ccc;
        min-width: 140px;
        left: -118px;
        top: -7px;
    }
</style>
<div class="layui-fluid" id="LAY-wish-onlineproduct">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="wish_online_search_form" id="wish_online_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="wish_online_depart_sel" lay-search lay-filter="wish_online_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select  id="wish_online_salesman_sel" lay-search lay-filter="wish_online_salesman_sel"  class="users_hp_custom" data-rolelist="wish专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="wish_online_store_sel" lay-search lay-filter="wish_online_store_sel"   class="store_hp_custom" data-platcode="wish">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label" >销售类型</label>
                                <div class="layui-input-block" >
                                    <select placeholder="请选择" name="saleType" id="wish_online_saletype_sel" lay-filter="wish_online_saletype_sel">
                                        <option value=''></option>
                                        <option value="1">加钻</option>
                                        <option value="2">不加钻</option>
                                        <option value="3">wishexpress</option>
                                        <option value="4">非wishexpress</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">审核状态</label>
                                <div class="layui-input-block" id="wish_online_div_audit_chk">
                                    <input type="checkbox" value="1" lay-skin="primary" checked name="auditStatus[1]" lay-filter="wish_online_auditStatus_chk" title="已审核">
                                    <input type="checkbox" value="0" lay-skin="primary" checked name="auditStatus[0]" lay-filter="wish_online_auditStatus_chk" title="审核中">
                                    <input type="checkbox" value="2" lay-skin="primary" name="auditStatus[2]" lay-filter="wish_online_auditStatus_chk" title="被拒绝">
                                    <input type="checkbox" value="3" lay-skin="primary" name="auditStatus[3]" lay-filter="wish_online_auditStatus_chk" title="已删除">

                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">产品ID</label>
                                    <div class="layui-input-block">
                                        <input  class="layui-input" autocomplete="off" id="wish_online_itemId">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">商品类型</label>
                                    <div class="layui-input-block">
                                        <select name="" id="wish_online_producttype_sel" lay-filter="wish_online_producttype_sel">
                                            <option value=""></option>
                                            <option value="0">单属性</option>
                                            <option value="1">多属性</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">PB状态</label>
                                    <div class="layui-input-block">
                                        <select name="" id="wish_online_pbStatus_sel" lay-filter="wish_online_pbStatus_sel">
                                            <option value="">全部</option>
                                            <option value="1">进行中</option>
                                            <option value="2">已结束</option>
                                            <option value="3">未参与</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">上周订单</label>
                                    <div class="layui-input-block">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" id="wish_online_lastWeekOrderNumStart_text"  autocomplete="off" class="layui-input inputBorRadLeft">
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" id="wish_online_lastWeekOrderNumEnd_text"  autocomplete="off" class="layui-input inputRad">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">累计销量</label>
                                    <div class="layui-input-block">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" id="wish_online_salesStart_text"  autocomplete="off" class="layui-input inputBorRadLeft">
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" id="wish_online_salesEnd_text"  autocomplete="off" class="layui-input inputRad">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">刊登时间</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" autocomplete="off" id="wish_online_listtime">
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg3">
                                <label class="layui-form-label">产品标题</label>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md9 layui-col-lg9">
                                        <input  class="layui-input" autocomplete="off" id="wish_online_item_title" placeholder="默认分词全模糊查询">
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <select id="wish_online_title_search_type">
                                            <option value="0">分词全模糊</option>
                                            <option value="1">常规模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <%--<div class="layui-col-md2 layui-col-lg3">--%>
                                <%--<label class="layui-form-label">在线数量</label>--%>
                                <%--<div class="layui-input-inline" style="width: 70px;">--%>
                                    <%--<input type="text" name="price_min"  autocomplete="off" class="layui-input">--%>
                                <%--</div>--%>
                                <%--<div class="layui-form-mid">-</div>--%>
                                <%--<div class="layui-input-inline" style="width: 70px;">--%>
                                    <%--<input type="text" name="price_max"  autocomplete="off" class="layui-input">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="seacrhType" id="wish_online_searchtype_sel">
                                        <option value="3">商品父SKU</option>
                                        <option value="4">商品子SKU</option>
                                        <option value="5">店铺父SKU</option>
                                        <option value="6">店铺子SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md9 layui-col-lg9">
                                        <input type="text"  name="" class="layui-input" id="wish_online_searchtype_text" placeholder="默认精确查询">
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <select id="wish_online_skusearchtype_sel">
                                            <option value="1">精确</option>
                                            <option value="0">模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品评分</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="wish_online_prodRatingStart_text"  autocomplete="off" class="layui-input inputBorRadLeft">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="wish_online_prodRatingEnd_text"  autocomplete="off" class="layui-input inputRad">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序类型</label>
                                <div class="layui-input-block">
                                    <select name="seacrhType" id="wish_online_sortdesc_sel" lay-filter="wish_online_sortdesc_sel">
                                        <option value=""></option>
                                        <option value="listing_time desc">按创建时间降序</option>
                                        <option value="listing_time asc">按创建时间升序</option>
                                        <option value="last_update_time desc">按更新时间降序</option>
                                        <option value="last_update_time asc">按更新时间升序</option>
                                        <option value="wishes desc">按收藏量降序</option>
                                        <option value="wishes asc">按收藏量升序</option>
                                        <option value="sales desc">按出售量降序</option>
                                        <option value="sales asc">按出售量升序</option>
                                        <option value="last_week_sales asc">按上周出售量升序</option>
                                        <option value="last_week_sales desc">按上周出售量降序</option>
                                        <option value="rating asc">按评分升序</option>
                                        <option value="rating desc">按评分降序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select id="wish_online_productLabel_sel" lay-search lay-filter="wish_online_productLabel_sel"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发专员销售</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="wish_online_userId">
                                    <div>
                                        <input id="wish_pl_searchSysUser"  name="wish_online_userName" class="layui-input"/>
                                    </div>
                                    <div class="wishOnline_dimResultDiv"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">批量刊登</label>
                                    <div class="layui-input-block">
                                        <select name="isAutoListing">
                                            <option value="">全部</option>
                                            <option value="1">是</option>
                                            <option value="0">否</option>
                                        </select>
                                    </div>
                                </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle"  type="button"  id="wish_online_search_submit">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="wish_online_search_reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="wishonlineCard">
                <div class="layui-card-body" id="wish_online_layui_card_body">
                    <div class="dis_flex layui-card-header">
                    <div class="layui-tab" lay-filter="wish_online_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" is_sale="1" title="点击统计在线数量">在线(<span id="wish_online_online_num_span"></span>)</li>
                            <li is_sale="0" title="点击统计下线数量">已下架(<span id="wish_online_offline_num_span"></span>)</li>
                        </ul>
                    </div>                    
                    <div class="layui-form dis_flex" style="align-items: center;">
                        <div>
                            <a href="javascript:;" class="layui-btn layui-btn-sm" onclick="expandAll('wishonlineCard')">展开所有</a>
                            <a href="javascript:;" class="layui-btn layui-btn-sm" onclick="PackUpAll('wishonlineCard')" style="margin-right: 10px;">收起所有</a>
                        </div>
                        <form id="isEnableForm" class="layui-form">
                            <select name="wish_online_isEnableSel" id="wish_online_isEnableSel" lay-filter="wish_online_isEnableSel">
                                <option value=""   data-link="" data-title="">批量操作</option>
                                <permTag:perm funcCode="batch_update_wish">
                                    <option value="0"  data-title="wish批量更新" title="从平台获取最新商品信息">批量更新</option>
                                </permTag:perm>
                                 <permTag:perm funcCode="is_ebable_p_product_wish">
                                    <option value="2"  data-link="route/iframe/wish/isEnablePProduct" data-title="父商品上下架">批量上下架父SKU</option>
                                </permTag:perm>
                                <permTag:perm funcCode="is_ebable_s_product_wish">
                                        <option value="1"  data-link="route/iframe/wish/isEnableProduct" data-title="子商品上下架">批量上下架子SKU</option>
                                </permTag:perm>
                                <permTag:perm funcCode="edit_main_assist_img_wish">
                                        <option value="4"  data-link="route/iframe/wish/editMainAssistImg" data-title="修改主辅图">修改主辅图</option>
                                </permTag:perm>
                                 <permTag:perm funcCode="modify_inventory_wish">
                                    <option value="5"  data-link="route/iframe/wish/modifyInventory" data-title="库存管理">库存管理</option>
                                </permTag:perm>
                                <permTag:perm funcCode="modify_descript_info_wish">
                                    <option value="6"  data-link="route/iframe/wish/modifyDescriptInfo" data-title="修改标题/TAGS/描述">修改标题/TAGS/描述</option>
                                </permTag:perm>
                               <%-- <permTag:perm funcCode="handle_tort_wish">
                                    <option value="7"  data-link="route/iframe/wish/handleTort" data-title="侵权处理">侵权处理</option>
                                </permTag:perm>--%>
                                <permTag:perm funcCode="adjust_price_process_wish">
                                    <option value="8"  data-link="route/iframe/wish/adjustPriceProcess" data-title="调整价格">调整价格</option>
                                </permTag:perm>
                                <permTag:perm funcCode="edit_variant_image_wish">
                                    <option value="9"  data-link="route/iframe/wish/editVariantImage" data-title="修改子sku图">修改子sku图</option>
                                </permTag:perm>
                                <permTag:perm funcCode="copy_listing_wishOnline">
                                    <option value="10"  data-link="route/iframe/wish/copyOnlineListing" data-title="复制模板">复制模板</option>
                                </permTag:perm>
                                <permTag:perm funcCode="remove_product_wish">
                                    <option value="11" data-link="route/iframe/wish/removeProduct" data-title="wish移除商品">批量删除</option>
                                </permTag:perm>
                                <permTag:perm funcCode="batch_marks_wishOnline">
                                    <option value="12" data-title="批量调整标签">调整标签</option>
                                </permTag:perm>
                                <permTag:perm funcCode="wish_setAchievementSaleperson">
                                    <option value="13"  data-link="route/iframe/wish/setAchievementSaleperson" data-title="设置开发专员销售">设置开发专员销售</option>
                                </permTag:perm>
                                <permTag:perm funcCode="wish_batch_create_pb">
                                    <option value="14">批量创建PB</option>
                                </permTag:perm>
                                <permTag:perm funcCode="wish_not_handle_listing">
                                    <option value="15" data-link="route/iframe/wish/wishNotHandleListing">不处理Listing</option>
                                </permTag:perm>
                            </select>
                        </form>
                    </div>
                    </div>
                    <div class="layui-tab-content checkbox-group" style="padding:10px;">
                            <div class="layui-form" style="display: flex;justify-content: space-between">
                                <form id="wish_online_marks_form">
                                    <input type="checkbox"  value="" lay-skin="primary" title="全部"  lay-filter="wishonline_marksCheck" >
                                </form>
                                <input type="checkbox" name="wishOnPro_accurateCount" lay-skin="primary" title="统计总数" lay-filter="wishonline_marksCheck" >
                            </div>
                    </div>
                    <div class="layui-tab-content">
                        <table class="layui-table" id="wish_online_data_table" lay-filter="wish_online_data_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<table id="wish_online_hide_table" style="display: none;"></table>
<script type="text/html" id="wishOnline_tr_checkbox_tpl">
    <div class="layui-form"><input type="checkbox" lay-skin="primary" /></div>
</script>
<script type="text/html" id="wish_online_mainImage_tpl">
    <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
        {{# if(d.isPromotion){ }}
        <div class="sell-hot-iocn"></div>
        {{# } }}
        <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
            {{# if(d.pbStatus == 1 ){}}
            <img width="70"height="15" src="${ctx}/static/img/onpb.png">
            {{# }else if(d.pbStatus == 2 ){ }}
            <img width="70"height="15" src="${ctx}/static/img/notpb.jpg">
            {{# } }}
            <div class="findGoods epz_out">
                {{# if(d.mainImage != null){ }}
                <img  class="img_show_hide wish_imgCss lazy" data-original="{{d.mainImage}}" style="display: block;" data-onerror="layui.admin.img_noFind()">
                {{# } }}
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="wish_online_sales_tpl">
    <div style="text-align: left;font-size: 12px;line-height: 18px;">
        <div title="累计出售数" class="wish_online_sales">{{d.sales || '0'}}</div>
        <div title="上周订单数" class="wish_online_sales">{{d.fourWeekSales.split('/')[0] || '0'}}</div>
        <div title="最近第二周订单数" class="wish_online_sales">{{d.fourWeekSales.split('/')[1] || '0'}}</div>
        <div title="最近第三周订单数" class="wish_online_sales">{{d.fourWeekSales.split('/')[2] || '0'}}</div>
        <div title="最近第四周订单数" class="wish_online_sales" >{{d.fourWeekSales.split('/')[3] || '0'}}</div>
        <%--<div title="上周销售额" style="margin-left: -5px;margin-right: -5px;text-align: center;" >{{Number(d.lastWeekOrderTotal/0.85).toFixed(2) || '0'}}</div>--%>
    </div>
</script>
<script type="text/html" id="wish_online_storePSku_tpl">
    <div style="text-align: left;font-size: 12px;">
        {{d.pSku || ''}}</br>
        <div style="color: #999;" title="对应的基础商品sku"> [ 
            <!-- {{d.prodPSku || ''}} -->
                <a>{{d.prodPSku || ''}}</a>
                <span onclick="layui.admin.onlyCopyTxt('{{d.prodPSku}}')" style="display: {{d.prodPSku ? 'inline-block':'none'}}; cursor:pointer">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
             ]</div>
    </div>
</script>
<script type="text/html" id="wish_online_listingTime_tpl">
    <div style="font-size: 12px;">
        <span  style="color:#999;">创建:</span> {{ Format(d.listingTime, "yyyy-MM-dd")}}<br>
        <span  style="color:#999;">更新:</span> {{ Format(d.lastUpdateTime, "yyyy-MM-dd")}}
    </div>
</script>
<script type="text/html" id="wish_online_storeProdPId_tpl">
    <div style="text-align: left;font-size: 12px;"  id="td_{{d.storeProdPId}}"> {{d.title}}
        <a style="cursor:pointer;" class="pro-show-detail"  onclick="wish_productListShow('{{d}}','{{d.storeProdPId}}')">详情</a></br>
        <div>
            <span class="gray-c"> [ {{d.storeAcct || ''}} ]&nbsp;&nbsp;[{{d.salesperson || ''}}]</span>
            <!-- <a class="storeProdPId" target="_blank" href="https://www.wish.com/c/{{d.storeProdPId}}">{{d.storeProdPId}}</a> -->
                <a class="storeProdPId" target="_blank" href="https://www.wish.com/c/{{d.storeProdPId}}">{{d.storeProdPId}}</a>
                <span onclick="layui.admin.onlyCopyTxt('{{d.storeProdPId}}')" style="display: {{d.storeProdPId ? 'inline-block':'none'}}; cursor:pointer">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
            <div style=" display: inline-block !important;">
                {{# if(d.auditStatus =='0'){ }}
                <span class="popoverHover myj-type-box type-yellow" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="审核中" title="">审</span>
                {{# }else if(d.auditStatus =='1'){ }}
                <span class="popoverHover myj-type-box myj-hide" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="已审核" title="">已</span>
                {{# }else if(d.auditStatus =='2'){ }}
                <span class="popoverHover myj-type-box type-red" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="被拒绝" title="">拒</span>
                {{# }else if(d.auditStatus =='3'){ }}
                <span class="popoverHover myj-type-box type-red" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="已删除" title="">删</span>
                {{# } }}
                {{# if(d.wishExpressCode !=null && d.wishExpressCode !='' ){ }}
                <span class="popoverHover myj-type-box-we" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="WE" title="">WE</span>
                {{# }else{ }}
                {{# } }}
            </div>
            {{#  layui.each(d.marksSet, function(index, item){ }}
                <span class="hp-badge layui-bg-blue fr" title="{{item}}">{{item.substring(0,1)}}</span>
            {{#  }); }}
        </div>
    </div>
</script>
<script type="text/html" id="wish_online_storeSSku_tpl">
    <table class="layui-table colspantable" style="width: 560px;margin-left: -5px;font-size: 12px;" >
        {{#  layui.each(d.prodSyncSWishDtos, function(index, item){ }}
        {{#  if(index <1){ }}
        {{#  if(index ==d.prodSyncSWishDtos.length-1){ }}
        <tr style="">
            {{#  }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important">
            {{#  } }}
            {{# }else{ }}
            {{#  if(index == d.prodSyncSWishDtos.length-1){ }}
        <tr style="display: none;" class="myj-hide">
            {{#  }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important;display: none;" class="myj-hide">
            {{#  } }}
            {{# } }}
            <td style="width:120px;text-align: left;padding-left: 5px;font-size: 12px;"> {{item.storeSSku}}
                {{# if(item.isSale =='0'){ }}
                <span class="popoverHover myj-type-box" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="已下架" title="">下</span>
                {{# } }}
                <br>
                <div style="color: #999;" title="对应的基础子商品sku"> [ 
                    <!-- {{item.prodSSku || ''}} -->
                        <a>{{item.prodSSku  || ''}}</a>
                        <span onclick="layui.admin.onlyCopyTxt('{{item.prodSSku}}')" style="display: {{item.prodSSku ? 'inline-block':'none'}}; cursor:pointer">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                     ]</div>
            </td>
            <td style="width:60px;text-align: center;font-size: 12px;"> {{item.price || ''}} </td>
            <td style="width:80px;text-align: center;font-size: 12px;"> {{item.localizedPriceStr}} </td>
            <td style="width:60px;text-align: center;font-size: 12px;"> {{item.subStock || '0'}}</td>
<%--            <td style="width:80px;text-align: center;font-size: 12px;"> {{ ((item.stockNum || 0) - (item.reservationNum || 0))  + '/' + (item.orderNotInNum || 0) + '/' + (item.lackUnPaiNum || 0) }}</td>--%>
            <td style="width:80px;text-align: center;font-size: 12px;"> {{item.preAvailableStockAll || '' }}/{{item.preAvailableStock || '' }}</td>
            <td style="width:60px;text-align: center;font-size: 12px;"> {{item.shipping || ''}}<br></td>
            <td style="width:80px;text-align: center;font-size: 12px;"> {{item.localizedShippingStr}}</td>
        </tr>
        {{#  }); }}
    </table>
    {{#  if(d.prodSyncSWishDtos.length > 1){ }}
    <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">+ 展开</a>
    {{# } }}
</script>
<script id="wish_online_hide_table_tpl" type="text/html">
    {{#  layui.each(d, function(index, item){ }}
    <tr id="detail_{{item.storeProdPId}}" class="detail myj-table-detail" style="display: table-row;">
        <td colspan="13" style="border-left:none; text-indent: 0.5em;width:1200px;">
            <table class="table-modal" style=" width: 100%;">
                <tbody>
                <tr class="content">
                    <td class="txt120 f-right bg-gray">产品描述：</td>
                    <td uid="description">{{item.prodDesc}}</td>
                </tr>
                <tr class="content">
                    <td class="txt120 f-right bg-gray">产品标签：</td>
                    <td uid="tag">
                        {{#
                        var fn = function(data){
                        data=data==null?'':data;
                        var str='';
                        var array=data.split(',');
                        for(var i in array){
                        str+='  <span class="detail-tag">'+ array[i]+'</span>';
                        }
                        return str ;
                        };
                        }}
                        {{ fn(item.tags) }}
                    </td>
                </tr>
                <tr class="content">
                    <td class="txt120 f-right bg-gray">
                        <div>厂家指导价</div>
                        <div>MSRP($)：</div>
                    </td>
                    <td uid="msrp">{{item.prodSyncSWishDtos[0].msrp||''}}</td>
                </tr>
                <tr class="content">
                    <td class="txt120 f-right bg-gray">运输信息：</td>
                    <td>
                        <span>运费：$</span><span uid="shipping">{{item.prodSyncSWishDtos[0].shipping}}</span>
                        <span class="mLeft20">运送时间：</span><span uid="shippingTime">{{item.shippingTime}}</span>
                    </td>
                </tr>
                <tr class="content">
                    <td class="txt120 f-right bg-gray">附图信息：</td>
                    <td uid="img">
                        {{#
                        var extraImages = function(data){
                        data=data==null?'':data;
                        var str='';
                        var array=data.split('|');
                        for(var i in array){
                        str+='<div style="width:50px;height:50px;display:inline-block;vertical-align: middle;margin-right:5px;position:relative;">';
                        str+='<img data-original="'+array[i]+'" class="wish_imgCss lazy" data-onerror="layui.admin.img_noFind()"></div>';
                        }
                        return str ;
                        };
                        }}
                        {{ extraImages(item.extraImages) }}
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    {{#  }); }}
</script>
<!--listing备注-->
<script type="text/html" id="wish_online_listingRemark_tpl">
    <div style="text-align: left;text-indent: 2em;font-size: 12px;" class="wish_online_listingRemark_tip" listingRemark="{{d.listingRemark || ''}}">
        {{# if(d.listingRemark != null && d.listingRemark !='' ){ }}
        {{# if(d.listingRemark.length > 40){ }}
        {{d.listingRemark.substring(0,40)}}<span>... </span>
        {{# }else{ }}
        {{d.listingRemark}}
        {{# } }}
        {{# }else { }}
        &nbsp;
        {{# }}}
        &nbsp; &nbsp;   <i class="layui-icon update_sellerNote" title="wish在线商品修改listing备注" lay-event="wish_online_update_listingRemark"></i>
    </div>
</script>
<!--在线listing操作备注-->
<script type="text/html" id="log_table">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="wish_log_table" lay-filter="wish_log_table"></table>
        </div>
    </div>
</script>
<!-- 修改标签弹窗start-->
<script type="text/html"  id="wishOnline_updateBatchWishItemMarksLayer">
      <div class="p20">
        <form  class="layui-form" id="wishOnline_updateBatchWishItemMarksForm" >
            <div class="layui-form-item">
                <label class="layui-form-label">标签:</label>
                <div class="layui-input-block">
                    <div id="wish_online_update_marks_form"></div>
                </div>
            </div>
        </form>
    </div>
</script>
<!--修改标签弹窗end-->
<!-- lsiting销售弹窗start-->
<script type="text/html"  id="wishOnline_listingSaleDataLayer">
    <form class="layui-form">
        <div class="layui-form-item">
            <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">分析维度：</label>
                <div class="layui-input-block">
                    <select  id="wish_online_reportTable_sel" lay-filter="wish_online_reportTable_sel"  >
                        <option value="1" selected> 订单量维度</option>
                        <option value="2"> 退款单维度</option>
                    </select>
                </div>
            </div>
        </div>
    </form>
    <div class="layui-form-item">
            <div id="wish_online_listingmarks_saleData_form"  style="width: 100%;height: 500px;"></div>
    </div>
</script>
<%-- 日志执行事件 --%>
<script type="text/html" id="wish_online_log_operation">
    <%-- {{# if(d.id!==-1){ }}--%>
    {{# if(d.operType==1){ }} 调价 {{# } }}
    {{# if(d.operType==2){ }} 上架子sku {{# } }}
    {{# if(d.operType==3){ }} 下架子sku {{# } }}
    {{# if(d.operType==4){ }} 上架父sku {{# } }}
    {{# if(d.operType==5){ }} 下架父sku {{# } }}
    {{# if(d.operType==6){ }} 调整库存 {{# } }}
    {{# if(d.operType==7){}} 修改标题 {{# } }}
    {{# if(d.operType==8){ }} 修改侵权 {{# } }}
    {{# if(d.operType==9){ }} 删除商品 {{# } }}
    {{# if(d.operType==10){ }} 标零 {{# } }}
    {{# if(d.operType==11){ }} 补货 {{# } }}
    {{# if(d.operType==15){ }} 缺货标零 {{# } }}
    {{# if(d.operType==16){ }} 缺货补货 {{# } }}
</script>
<!--lsiting销售弹窗end-->
<script type="text/html" id="wish_online_orderTime_tpl">
    {{# if (d.orderId == null || d.orderId =='') { }} 
         
    {{# } else { }}  
        {{ Format(d.orderTime, "yyyy-MM-dd hh:mm:ss")}}<br>
    {{# } }}
</script>
<script type="text/html" id="wish_online_ratingTime_tpl">
    {{ Format(d.ratingTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<script type="text/html" id="wish_online_isRefund_tpl">
    {{# if (d.isRefund) { }} 
        是 
    {{# } else { }}  
        否
    {{# } }}
</script>
<script type="text/html" id="wish_online_prodRating_tpl">
    {{# if (d.rating == null) { }} 
        <span>暂无</span>
    {{# } else { }}  
        {{ d.rating }}
    <%-- {{# if(d.rating ==1){  }}
        <span class="starCss">&#9733</span>
    {{# }else if(d.rating ==2){ }}
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
    {{# }else if(d.rating ==3){ }}
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
    {{# }else if(d.rating ==4){ }}
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
    {{# }else if(d.rating ==5){ }}
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
        <span class="starCss">&#9733</span>
    {{# } }} --%>
    {{# } }}
</script>
<!--操作模板-->
<script type="text/html" id="wish_online_operate_tpl">
        <a class="layui-btn  layui-btn-xs" lay-event="wish_online_syncOneItem">更新</a>
        <a class="layui-btn  layui-btn-xs" lay-event="wish_online_markOneItem">标签</a>
        <br/>
        <a class="layui-btn  layui-btn-xs" onclick="compUrl_producttpl('{{d.prodPSku }}','{{d.prodPId }}')">竞品</a>
        <a class="layui-btn  layui-btn-xs" lay-event="wish_online_searchLog">日志</a>
        <br>
        <a class="layui-btn  layui-btn-xs" lay-event="wish_online_listing_sale_data">表现</a>
        <a class="layui-btn  layui-btn-xs" lay-event="wish_online_listing_rating">评分</a>
        <a class="layui-btn  layui-btn-xs layui-btn-danger" lay-event="wish_online_listing_createPB">创建PB</a>
        <a class="layui-btn  layui-btn-xs" lay-event="00" style="visibility:hidden;">你好</a>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/wish/onlineproduct.js"></script>
<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
