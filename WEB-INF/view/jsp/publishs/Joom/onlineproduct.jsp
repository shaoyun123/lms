<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>Joom在线商品</title>
<style>
    #LAY-joom-onlineproduct .layui-form-item{
        margin-bottom: 0;
    }
    .dis_flex{
        display:flex;
        justify-content: space-between;
    }
    a.pro-show-detail{
        margin-left: 10px;
        color: #d0d3d6;
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
    img.joom_imgCss {
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
    div.gray-c {
        color: #737679 !important;
    }
    #joom_online_div_audit_chk div{
        margin-top: 5px;
    }
    a.productListSkuShow{
        color: #428bca;
    }

    #LAY-joom-onlineproduct .layui-tab-title{
        height: 41px !important;
    }

    #LAY-joom-onlineproduct .layui-tab-content{
        padding: 0;
    }
</style>
<div class="layui-fluid" id="LAY-joom-onlineproduct">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="joom_online_search_form" id="joom_online_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="joom_online_depart_sel" lay-search lay-filter="joom_online_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select  id="joom_online_salesman_sel" lay-search lay-filter="joom_online_salesman_sel"  class="users_hp_custom" data-rolelist="joom专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="joom_online_store_sel" lay-search lay-filter="joom_online_store_sel"   class="store_hp_custom" data-platcode="joom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label" >销售类型</label>
                                <div class="layui-input-block" >
                                    <select placeholder="请选择" name="saleType" id="joom_online_saletype_sel" lay-filter="joom_online_saletype_sel">
                                        <option value=''></option>
                                        <option value="1">加钻</option>
                                        <option value="2">不加钻</option>
                                    </select>
                                </div>
                            </div>
                            <!-- <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">审核状态</label>
                                <div class="layui-input-block" id="joom_online_div_audit_chk">
                                    <input type="checkbox" value="1" lay-skin="primary" checked name="auditStatus[1]" lay-filter="joom_online_auditStatus_chk" title="已审核">
                                    <input type="checkbox" value="0" lay-skin="primary" checked name="auditStatus[0]" lay-filter="joom_online_auditStatus_chk" title="审核中">
                                    <input type="checkbox" value="2" lay-skin="primary" name="auditStatus[2]" lay-filter="joom_online_auditStatus_chk" title="被拒绝">
                                </div>
                            </div> -->
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品ID</label>
                                <div class="layui-input-block">
                                    <input  class="layui-input" autocomplete="off" id="joom_online_itemId">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg3">
                                <label class="layui-form-label">产品标题</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md7 layui-col-lg7">
                                        <input  class="layui-input inputBorRadLeft" autocomplete="off" id="joom_online_item_title" placeholder="默认模糊查询">
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <select id="joom_online_title_search_type" class="inputRad">
                                            <option value="0">分词全模糊</option>
                                            <option value="1">常规模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="seacrhType" id="joom_online_searchtype_sel">
                                        <option value="3">商品父SKU</option>
                                        <option value="4">商品子SKU</option>
                                        <option value="5">店铺父SKU</option>
                                        <option value="6">店铺子SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block" >
                                    <input type="text"  name="" class="layui-input" id="joom_online_searchtype_text">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序类型</label>
                                <div class="layui-input-block">
                                    <select name="seacrhType" id="joom_online_sortdesc_sel" lay-filter="joom_online_sortdesc_sel">
                                        <option value=""></option>
                                        <option value="listing_time desc">按创建时间降序</option>
                                        <option value="listing_time asc">按创建时间升序</option>
                                        <option value="wishes desc">按收藏量降序</option>
                                        <option value="wishes asc">按收藏量升序</option>
                                        <option value="sales desc">按出售量降序</option>
                                        <option value="sales asc">按出售量升序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品状态</label>
                                <div class="layui-input-block">
                                    <select name="state" id="joom_online_state" xm-select="joom_online_state" 
                                        xm-select-search-type="dl"  xm-select-search
                                        xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否活性</label>
                                <div class="layui-input-block">
                                    <select name="hasActiveVersion" lay-search>
                                        <option value=""></option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg3">
                                <label class="layui-form-label">诊断原因</label>
                                <div class="layui-input-block">
                                    <select name="reviewDescList" id="joom_online_reviewDescList"  xm-select="joom_online_reviewDescList"
                                        xm-select-search-type="dl"  xm-select-search
                                        xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="salesType">
                                        <option value="5" selected>总销量</option>
                                        <option value="0">7天销量</option>
                                        <option value="1">15天销量</option>
                                        <option value="2">30天销量</option>
                                        <option value="3">60天销量</option>
                                        <option value="4">90天销量</option>
                                    </select>
                                </div>
                                <div class="layui-input-block disflex">
                                    <input type="number" class="layui-input" name="salesStart">
                                    <input type="number" class="layui-input" name="salesEnd">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">刊登时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="publishTime" class="layui-input" id="joom_online_publish_time">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">刊登方式</label>
                                <div class="layui-input-block">
                                    <select name="isAutoListing" lay-search>
                                        <option value=""></option>
                                        <option value="true">系统刊登</option>
                                        <option value="false">销售刊登</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">价格</label>
                                <div class="layui-input-block disflex">
                                    <input type="number" class="layui-input" name="priceStart">
                                    <input type="number" class="layui-input" name="priceEnd">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select name="prodIsSaleStatus" id="joom_online_prodIsSaleStatus" xm-select="joom_online_prodIsSaleStatus" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                        <option value="2">全部在售</option>
                                        <option value="1">部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle"  type="button"  id="joom_online_search_submit">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="joom_online_search_reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="joomOnlineProCard">
                <div class="layui-card-body" id="joom_online_layui_card_body">
                    <div class="layui-tab" lay-filter="joom_online_tab_filter">
                        <div class="layui-card-header dis_flex">
                            <ul class="layui-tab-title">
                                <li class="layui-this" is_sale="1" >在线(<span id="joom_online_online_num_span"></span>)</li>
                                <li is_sale="0">下线(<span id="joom_online_offline_num_span"></span>)</li>
                            </ul>
                            <div style="float: right;">
                                <div  style="display: inline-block;">
                                    <a href="javascript:;" class="layui-btn layui-btn-sm" onclick="expandAll('joomOnlineProCard')">展开所有</a>
                                    <a href="javascript:;" class="layui-btn layui-btn-sm" onclick="PackUpAll('joomOnlineProCard')">收起所有</a>
                                </div>
                                <div class="layui-input-inline">
                                            <form id="isEnableForm" class="layui-form">
                                                <select name="joom_online_isEnableSel" id="joom_online_isEnableSel" lay-filter="joom_online_isEnableSel">
                                                    <option value=""   data-link="" data-title="">批量操作跳转</option>
                                                     <permTag:perm funcCode="batch_update_joom">
                                                        <option value="0"   data-link="" data-title="">批量更新</option>
                                                    </permTag:perm>
                                                     <permTag:perm funcCode="is_enable_p_joom">
                                                        <option value="2"  data-link="route/iframe/joom/isEnableProduct" data-title="子商品上下架">上下架子SKU</option>
                                                    </permTag:perm>
                                                     <permTag:perm funcCode="is_enable_s_joom">
                                                        <option value="3"  data-link="route/iframe/joom/isEnablePProduct" data-title="父商品上下架">上下架父SKU</option>
                                                    </permTag:perm>
                                                     <permTag:perm funcCode="adjust_price_process_joom">
                                                        <option value="4"  data-link="route/iframe/joom/adjustPriceProcess" data-title="调整价格">调整价格</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="batch_Weight_joom">
                                                        <option value="6"  data-link="route/iframe/joom/batchModifiedWeight" data-title="批量修改重量和运费">批量修改重量和运费</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="Edit_title_and_description_joom">
                                                        <option value="7"  data-link="route/iframe/joom/editTitleAndDescription" data-title="修改标题和描述">修改标题和描述</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="adjust_inventory_joom">
                                                        <option value="8"  data-link="route/iframe/joom/adjustInventory" data-title="调整库存">调整库存</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="batch_delete_joom">
                                                        <option value="5"  data-link="" data-title="批量删除">批量删除</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="batch_modifyListingPicture_joom">
                                                        <option value="9"  data-link="route/iframe/joom/modifyListingPicture" data-title="修改listing图片">修改listing图片</option>
                                                    </permTag:perm>
                                                </select>
                                            </form>
                                </div>
                            </div>
                        </div>
                        <div class="layui-tab-content">
                            <table class="layui-table" id="joom_online_data_table" lay-filter="joom_online_data_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<table id="joom_online_hide_table" style="display: none;"></table>
<script type="text/html" id="joom_online_trcheckbox_tpl">
    <div class="layui-form"><input type="checkbox" lay-skin="primary" /></div>
</script>
<script type="text/html" id="joom_online_mainImage_tpl">
    <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
        {{# if(d.isPromotion){ }}
        <div class="sell-hot-iocn"></div>
        {{# } }}
        <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
            <div class="findGoods epz_out">
                {{# if(d.mainImage != null){ }}
                <img  class="img_show_hide joom_imgCss lazy" data-original="{{d.mainImage}}" style="display: block;"  data-onerror="layui.admin.img_noFind()">
                {{# } }}
            </div>
        </div>
    </div>
</script>
<!--产品id-->
<script type="text/html" id="joom_online_storeProdPId_tpl">
    <div style="text-align: left;"  id="td_{{d.storeProdPId}}"> {{d.title}}
        <a style="cursor:pointer;" class="pro-show-detail"  onclick="joom_productListShow('{{d}}','{{d.storeProdPId}}')">详情</a></br>
        <div>
            <!-- <a class="storeProdPId" target="_blank" href="https://www.joom.com/en/products/{{d.storeProdPId}}">{{d.storeProdPId}}</a> -->
                <a class="storeProdPId" target="_blank" href="https://www.joom.com/en/products/{{d.storeProdPId}}">{{d.storeProdPId}}</a>
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
                {{# } }}
            </div>
            <div class="gray-c"> [ {{d.storeAcct || ''}} ]&nbsp;&nbsp;[{{d.salesperson || ''}}]</div>
        </div>
    </div>
</script>
<!--收藏数-->
<script type="text/html" id="joom_online_collect_tpl">
        {{d.wishes || 0}}</br>
</script>
<!--销量-->
<script type="text/html" id="joom_online_sales_tpl">
    总：{{d.sales || 0}}</br>
    7天：{{d.sevenSales || 0}}</br>
    15天：{{d.fifteenSales || 0}}</br>
    30天：{{d.thirtySales || 0}}</br>
    60天：{{d.sixtySales || 0}}</br>
    90天：{{d.ninetySales || 0}}
</script>
<script type="text/html" id="joom_online_storePSku_tpl">
    <div style="text-align: left;">
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
<script type="text/html" id="joom_online_listingTime_tpl">
    <div style="text-align: left;padding-left: 5px;">
         <span  style="color:#999;">创建:</span> {{ Format(d.listingTime, "yyyy-MM-dd")}}<br>
        <span  style="color:#999;">更新:</span> {{ Format(d.lastUpdateTime, "yyyy-MM-dd")}}
    </div>
</script>
<script type="text/html" id="joom_online_storeSSku_tpl">
    <table class="layui-table colspantable" style="width: 380px;margin-left: -5px" >
        {{#  layui.each(d.prodSyncSJoomDtos, function(index, item){ }}
        {{#  if(index <5){ }}
        {{#  if(index ==d.prodSyncSJoomDtos.length-1){ }}
        <tr style="">
            {{#  }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important">
            {{#  } }}
            {{# }else{ }}
            {{#  if(index == d.prodSyncSJoomDtos.length-1){ }}
        <tr style="display: none;" class="myj-hide">
            {{#  }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important;display: none;" class="myj-hide">
            {{#  } }}
            {{# } }}
            <td style="width:110px;text-align: left;padding-left: 5px;"> {{item.storeSSku}}
                {{# if(item.isSale =='0'){ }}
                <span class="popoverHover myj-type-box" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="已下架" title="">下</span>
                {{# } }}
                <div style="color: #999;" title="对应的基础子商品sku"> [ 
                    <!-- {{item.prodSSku || ''}} -->
                        <a>{{item.prodSSku || ''}}</a>
                        <span onclick="layui.admin.onlyCopyTxt('{{item.prodSSku}}')" style="display: {{item.prodSSku ? 'inline-block':'none'}}; cursor:pointer">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                     ]</div>
            </td>
            <td style="width:60px;text-align: center;"> {{item.price}}</td>
            <td style="width:60px;text-align: center;"> {{item.subStock}}</td>
<%--           <td style="width:60px;text-align: center;font-size: 12px;"> {{ ((item.stockNum || 0) - (item.reservationNum || 0))  + '/' + (item.orderNotInNum || 0) + '/' + (item.lackUnPaiNum || 0) }}</td>--%>
            <td style="width:60px;text-align: center;font-size: 12px;"> {{item.preAvailableStockAll || '' }}/{{item.preAvailableStock || '' }}</td>
            <td style="width:60px;text-align: center;"> {{item.shipping}}</td>
        </tr>
        {{#  }); }}
    </table>
    {{#  if(d.prodSyncSJoomDtos.length > 5){ }}
    <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">+ 展开</a>
    {{# } }}
</script>
<script id="joom_online_hide_table_tpl" type="text/html">
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
                    <td uid="msrp">{{item.prodSyncSJoomDtos[0].msrp||''}}</td>
                </tr>
                <tr class="content">
                    <td class="txt120 f-right bg-gray">运输信息：</td>
                    <td>
                        <span>运费：$</span><span uid="shipping">{{item.prodSyncSJoomDtos[0].shipping}}</span>
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
                        str+='<img data-original="'+array[i]+'" class="joom_imgCss lazy" data-onerror="layui.admin.img_noFind()"></div>';
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
<script type="text/html" id="joom_online_operate_tpl">
    <a class="layui-btn  layui-btn-xs" lay-event="joom_online_updateOneItem">更新</a>
    <a class="layui-btn  layui-btn-xs" lay-event="joom_online_searchLog" style="margin-left:0">日志</a>
</script>

<!-- 是否活性 -->
<script type="text/html" id="joom_online_table_hasActiveVersion">
    <div>{{d.hasActiveVersion !=undefined && d.hasActiveVersion!== '' ? !!d.hasActiveVersion ? '是' : '否' : ''}}</div>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/joom/onlineproduct.js"></script>
<script type="text/html" id="log_table_joom">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="joom_log_table" lay-filter="joom_log_table"></table>
        </div>

    </div>
</script>
<script type="text/html" id="joom_online_log_operation">
    <%-- {{# if(d.id!==-1){ }}--%>
    {{# if(d.operType==1){ }}
    调价
    {{# } }}
    {{# if(d.operType==2){ }}
    上架子SKU
    {{# } }}
    {{# if(d.operType==3){ }}
    下架子SKU
    {{# } }}
    {{# if(d.operType==4){ }}
    上架父SKU
    {{# } }}
    {{# if(d.operType==5){ }}
    下架父SKU
    {{# } }}
    {{# if(d.operType==6){ }}
    调整库存
    {{# } }}
    {{# if(d.operType==7){ }}
    修改标题和描述
    {{# } }}
    {{# if(d.operType==8){ }}
    处理侵权
    {{# } }}
    {{# if(d.operType==9){ }}
    删除父sku
    {{# } }}
    {{# if(d.operType==10){ }}
    库存标零
    {{# } }}
    {{# if(d.operType==11){ }}
    库存补货
    {{# } }}
    {{# if(d.operType==12){ }}
    过年期间库存标零
    {{# } }}
    {{# if(d.operType==13){ }}
    过年期间库存标为9999
    {{# } }}
    {{# if(d.operType==14){ }}
    停售商品补货为可用库存
    {{# } }}
    {{# if(d.operType==15){ }}
    删除商品
    {{# } }}
    {{# if(d.operType==16){ }}
    缺货标零
    {{# } }}
    {{# if(d.operType==17){ }}
    缺货补货
    {{# } }}
    {{# if(d.operType==18){ }}
    调整重量和运费
    {{# } }}
</script>