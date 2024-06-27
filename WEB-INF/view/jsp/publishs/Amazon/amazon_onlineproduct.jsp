<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<link rel="stylesheet" href="${ctx}/static/simditor/simditor.css">
        <title>亚马逊在线商品</title>
        <style>
            .labelSel {
                padding: 0 15px;
            }
            
            .pl20 {
                padding-left: 20px;
            }
            
            .dis_flex {
                display: flex;
                justify-content: space-between;
            }
            
            .row_module_js {
                background: #fff;
                height: 42px;
            }
            
            #amazon_online_searchForm .layui-col-md6.layui-col-lg6 .layui-input.layui-unselect {
                border-radius: 0;
                border-right: none;
            }
            
            #amazon_online_searchForm .layui-col-md6.layui-col-lg6 .layui-input {
                border-radius: 0;
            }
            
            a.itemId {
                color: #428bca;
                cursor: pointer;
            }
            
            div .findGoods {
                width: 60px;
                height: 60px;
            }
            
            table.colspantable td {
                border: 0px;
            }
            
            div.sell-hot-iocn {
                z-index: 10;
                position: absolute;
                top: 0;
                width: 25px;
                height: 24px;
                background: url('${ctx}/static/img/goldenDiamond.png') no-repeat;
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
            
            tbody>tr>td .detail-tag {
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
                position: relative;
            }
            
            #wish_online_div_audit_chk div {
                margin-top: 5px;
            }
            
            .mTop10 {
                margin-top: 10px;
            }
            
            .glyphicon-triangle-bottom:before {
                content: "\e252";
            }
            
            .glyphicon {
                position: relative;
                top: 1px;
                display: inline-block;
                font-family: 'Glyphicons Halflings';
                font-style: normal;
                font-weight: 400;
                line-height: 1;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            .update_sellerNote {
                color: #009688;
                cursor: pointer;
            }
            
            .smt_online_operate_btn {
                position: absolute;
                min-width: 215px;
                z-index: 99999;
                left: -88px;
                border: 1px solid #ccc;
                background: #fff;
            }

            .amazonSubImg_UL li {
                float: left;
                margin: 5px
            }

            #amazon_onlineproductCard .layui-tab-content{
                padding: 0;
            }
        </style>

        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <!-- 搜索条件 -->
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form class="layui-form" id="amazon_online_searchForm">
                                <div class="layui-form-item">
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select id="amazon_online_depart_sel" lay-search lay-filter="amazon_online_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">销售人员</label>
                                        <div class="layui-input-block">
                                            <select id="amazon_online_salesman_sel" lay-search lay-filter="amazon_online_salesman_sel" class="users_hp_custom" data-rolelist="amazon专员">
                                        <option value=""></option>
                                    </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select id="amazon_online_store_sel" lay-search lay-filter="amazon_online_store_sel" xm-select="amazon_online_store_sel" class="users_hp_store_multi" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" class="store_hp_custom" data-platcode="amazon">
                                        <option value=""></option>
                                    </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">站点</label>
                                        <div class="layui-input-block">
                                            <select name="" id="amazon_online_site_sel" lay-search lay-filter="amazon_online_site_sel" xm-select="amazon_online_site_sel" class="salesSite_hp_custom" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                        </div>
                                    </div>
                                    <%--<div class="layui-col-lg2 layui-col-md2">--%>
                                        <%--<label class="layui-form-label">listingId</label>--%>
                                            <%--<div class="layui-input-block">--%>
                                                <%--<input  class="layui-input" autocomplete="off" id="amazon_online_listingId">--%>
                                                    <%--</div>--%>
                                                        <%--</div>--%>
                                                            <div class="layui-col-lg3 layui-col-md3">
                                                                <label class="layui-form-label">产品标题</label>
                                                                <div class="layui-input-block">
                                                                    <div class="layui-col-md7 layui-col-lg7">
                                                                        <input class="layui-input" autocomplete="off" id="amazon_online_item_title" placeholder="默认分词全模糊查询">
                                                                    </div>
                                                                    <div class="layui-col-md4 layui-col-lg4">
                                                                        <select id="amazon_online_title_search_type">
                                            <option value="0">分词全模糊</option>
                                            <option value="1">常规模糊</option>
                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="layui-col-lg2 layui-col-md2">
                                                                <div class="layui-form-label labelSel">
                                                                    <select id="amazon_online_skuSearchType_sel">
                                        <option value="1">商品子SKU</option>
                                        <option value="2">店铺子SKU</option>
                                        <option value="3">商品子SKU(精确)</option>
                                        <option value="4">店铺子SKU(精确)</option>
                                    </select>
                                                                </div>
                                                                <div class="layui-input-block">
                                                                    <input type="text" class="layui-input" id="amazon_online_skuSearchType_text">
                                                                </div>
                                                            </div>
                                                            <div class="layui-col-lg2 layui-col-md2">
                                                                <label class="layui-form-label">asin</label>
                                                                <div class="layui-input-block">
                                                                    <input class="layui-input" autocomplete="off" id="amazon_online_asin_text">
                                                                </div>
                                                            </div>
                                                            <div class="layui-col-lg2 layui-col-md2">
                                                                <label class="layui-form-label">在线数量</label>
                                                                <div class="layui-input-block">
                                                                    <div class="layui-col-md6 layui-col-lg6">
                                                                        <input type="number" class="layui-input" autocomplete="off" id="amazon_online_stockStart_text">
                                                                    </div>
                                                                    <div class="layui-col-md6 layui-col-lg6">
                                                                        <input type="number" class="layui-input" autocomplete="off" id="amazon_online_stockEnd_text">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <%--<div class="layui-col-lg2 layui-col-md2">--%>
                                                                <%--<label class="layui-form-label">productId</label>--%>
                                                                    <%--<div class="layui-input-block">--%>
                                                                        <%--<input  class="layui-input" autocomplete="off" id="amazon_online_productId_text">--%>
                                                                            <%--</div>--%>
                                                                                <%--</div>--%>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <div class="layui-form-label labelSel">
                                            <select id="amazon_online_listtime_sel">
                                                <option value="1">刊登时间</option>
                                                <option value="2">结束时间</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" autocomplete="off" id="amazon_online_listtime">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">排序类型</label>
                                        <div class="layui-input-block">
                                            <select id="amazon_online_sortdesc_sel" lay-filter="amazon_online_sortdesc_sel">
                                                <option value="1">刊登时间降序</option>
                                                <option value="2">刊登时间升序</option>
                                                <option value="3">在线数量升序</option>
                                                <option value="4">在线数量降序</option>
                                                <option value="5">7天销量倒序</option>
                                                <option value="6">15天销量倒序</option>
                                                <option value="7">30天销量倒序</option>
                                                <option value="8">60天销量倒序</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">商品标签</label>
                                        <div class="layui-input-block">
                                            <select id="amazon_online_productLabel_sel" lay-search lay-filter="amazon_online_productLabel_sel"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">商品类型</label>
                                        <div class="layui-input-block">
                                            <select name="isMultiSku">
                                                <option value=""></option>
                                                <option value="0">单属性</option>
                                                <option value="1">多属性</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label" style="padding: 0 15px">
                                            <select name="salesTime" lay-filter="amazonOnlineProductSalesTime">
                                                <option value=""></option>
                                                <option value="sevenSalesNum">7日销量-直邮</option>
                                                <option value="fifteenSalesNum">15日销量-直邮</option>
                                                <option value="thirtySalesNum">30日销量-直邮</option>
                                                <option value="sixtySalesNum">60日销量-直邮</option>
                                            </select>
                                        </label>
                                        <div class="layui-input-block">
                                            <div class="layui-col-lg6 layui-col-md6">
                                                <input type="number" name="salesStart" class="layui-input" placeholder=">=" min="0" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                            </div>
                                            <div class="layui-col-lg6 layui-col-md6">
                                                <input type="number" name="salesEnd" class="layui-input" placeholder="<=" min="0" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">分类</label>
                                        <div class="layui-input-block">
                                            <select name="salesType">
                                                <option value=""></option>
                                                <option value="FBA">FBA</option>
                                                <option value="FBM">FBM</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">刊登类型</label>
                                        <div class="layui-input-block">
                                            <select name="creator" id="amazon_online_creator_sel">
                                                <option value=""></option>
                                                <option value="sales">销售刊登</option>
                                                <option value="system">系统刊登</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">侵权状态</label>
                                        <div class="layui-input-block">
                                            <select name="tortBanListing" id="">
                                                <option value="ALL">全部</option>
                                                <option value="AMAZON_PLAT">Amazon侵权</option>
                                                <option value="CURRENT_PLAT">Amazon不侵权</option>
                                                <option value="ANY_PLAT">所有平台都不侵权</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">是否禁售</label>
                                        <div class="layui-input-block">
                                            <select name="isCanSale">
                                                <option value="">全部</option>
                                                <option value="false">禁售</option>
                                                <option value="true">非禁售</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">在售状态</label>
                                        <div class="layui-input-block">
                                            <select name="isSaleStr" xm-select="amazon_online_isSaleStr" class="" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                <option value="2">在售</option>
                                                <option value="1">部分在售</option>
                                                <option value="0">全部停售</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">促销价</label>
                                        <div class="layui-input-block">
                                            <select name="promotionPriceValid">
                                                <option value="">请选择</option>
                                                <option value="0">已过期</option>
                                                <option value="1">促销中</option>
                                                <option value="2">未开始</option>
                                                <option value="3">无促销</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 pl20">
                                    <button type="button" class="layui-btn layui-btn-sm keyHandle" id="amazon_online_search_submit">查询</button>
                                    <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card" id="amazon_onlineproductCard">
                        <div class="layui-card-body">
                        <div class=" layui-card-header">
                            <div class="dis_flex row_module_js">
                                <div class="layui-tab" lay-filter="amazon_online_tab_filter">
                                    <ul class="layui-tab-title">
                                        <li class="layui-this" product_status_type="1">在线(<span id="amazon_online_online_num1_span"></span>)</li>
                                        <li class="layui-this" product_status_type="2">取消(<span id="amazon_online_online_num2_span"></span>)</li>
                                        <li class="layui-this" product_status_type="3">不可售(<span id="amazon_online_online_num3_span"></span>)</li>
                                        <li class="layui-this" product_status_type="4">不完整(<span id="amazon_online_online_num4_span"></span>)</li>
                                    </ul>
                                </div>
                                <div class="layui-form" style="display: flex;align-items: center">
                                <select id="amazon_online_export_import" lay-filter="amazon_online_export_import">
                                    <option value="0">调整店铺处理时间</option>
                                    <permTag:perm funcCode="export_amazon_online_permTag"><option value="1">下载模板</option></permTag:perm>
                                    <permTag:perm funcCode="import_amazon_online_permTag"><option value="2">导入模板</option></permTag:perm>
                                </select>
                                <input id="amazon_online_import_btn" type="hidden"/>
                                <permTag:perm funcCode="export_amazon">
                                    <div style="margin-right: 50px;">
                                        <a type="button" class="layui-btn layui-btn-sm layui-btn-normal" name="amazon_onlineprod_export">导出</a>
                                    </div>
                                </permTag:perm>
                                    <div>
                                        <select id="amazon_online_apiOperate_sel" lay-filter="amazon_online_apiOperate_sel">
                                                <option value="0">批量更新</option>
                                            <permTag:perm funcCode="modify_inventory_amazon">
                                                <option value="1"  data-link="route/iframe/amazon/stopPublish" data-title="修改库存">修改库存</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="modify_price_amazon">
                                            <option value="2"  data-link="route/iframe/amazon/amazonModifyMainPrice" data-title="修改价格">修改价格</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="modify_title_amazon">
                                                <option value="3"  data-link="route/iframe/amazon/amazonModifyTitle" data-title="修改标题">修改标题</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="delete_pro_amazon">
                                                <option value="7"  data-link="route/iframe/amazon/amazonDeletePro" data-title="删除商品">删除商品</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="modify_picture_amazon">
                                                <option value="8"  data-link="route/iframe/amazon/amazonModifyPicture" data-title="修改商品图片">修改商品图片</option>
                                            </permTag:perm>
                                            <permTag:perm funcCode="modify_promotionPrice_amazon">
                                                <option value="9" data-link="route/iframe/amazon/amazonModifyPromotionPrice" data-title="促销价">促销价</option>
                                            </permTag:perm>
                                            <%--<permTag:perm funcCode="modify_bulletpoint_amazon">--%>
                                                <%--<option value="4"  data-link="route/iframe/amazon/amazonModifyBulletPoint" data-title="修改卖点">修改卖点</option>--%>
                                            <%--</permTag:perm>--%>
                                            <%--<permTag:perm funcCode="modify_searchterms_amazon">--%>
                                                <%--<option value="5"  data-link="route/iframe/amazon/amazonModifySearchTerms" data-title="修改SearchTerms">修改SearchTerms</option>--%>
                                            <%--</permTag:perm>--%>
                                            <!-- <option value="6"  data-link="route/iframe/amazon/addtoFBA" data-title="添加至FBA">添加至FBA</option> -->
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-tab-content">
                            <table class="layui-table" id="amazon_online_data_table" lay-filter="amazon_online_data_table"></table>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/html" id="amazon_online_firstImage_tpl">
            <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
                <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
                    {{# if(d.mainImage != null && d.mainImage !='' ){ }}
                    <div class="findGoods epz_out">
                        <img class="img_show_hide wish_imgCss lazy" data-original="{{d.mainImage}}" style="display: block;" data-onerror="layui.admin.img_noFind()">
                    </div>
                    {{# }else if(d.remark != null ){ }}
                    <span class="   mTop10 glyphicon glyphicon-triangle-bottom">变体({{d.remark}})</span> {{# } }}
                </div>
            </div>
        </script>
        <script type="text/html" id="amazon_online_asin_tpl">
            <div style="text-align: left;" id="td_{{d.asin}}">
                {{d.title || ''}}
                <div class="gray-c">
                    [ {{d.storeAcct || ''}} ]&nbsp; &nbsp;
                    [ {{d.salesperson || ''}} ]&nbsp; &nbsp;
                    <a class="itemId" target="_blank" href="{{d.asinSrc}}">{{d.asin}}</a>
                    <span onclick="layui.admin.onlyCopyTxt('{{d.asin}}')" style="display: {{d.asin ? 'inline-block':'none'}}; cursor:pointer">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{d.itag || ''}}
                    <!-- <span class="pora copySpan">
                        <a class="itemId" target="_blank" href="{{d.asinSrc}}">{{d.asin}}</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{d.itag || ''}}
                        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                    </span> -->
                </div>
            </div>
        </script>
        <script type="text/html" id="amazon_online_sellerSku_tpl">
            <div style="text-align: left;">
                {{# if(d.storeSSku != null && d.storeSSku !='' ){ }} {{d.storeSSku || ''}}</br>
                <span style="color: #999;" >[
                    <a title="对应的基础商品sku" style="color: #999;">{{d.prodSSku || ''}}</a>
                    <span onclick="layui.admin.onlyCopyTxt('{{d.prodSSku}}')" style="display: {{d.prodSSku ? 'inline-block':'none'}}; cursor:pointer">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                ]</span>
                {{# } }}
            </div>
        </script>
        <script type="text/html" id="amazon_online_listingPrice_tpl">
            {{d.listingPrice || '' }} <span style="color:#999;font-size: 12px;">{{d.currency || ''}}</span> <br>
        </script>
        <script type="text/html" id="amazon_online_PromotionPrice_tpl">
            {{d.promotionPrice || '' }}
            {{# if(d.promotionPrice){ }}
            <span style="color:#999;font-size: 12px;">{{d.currency || ''}}</span> <br>
            {{# } }}
            {{Format(d.promotionEndTime, "yyyy-MM-dd")}}
        </script>
        <script type="text/html" id="amazon_online_avaiableStock_tpl">
            <div style="width:80px;text-align: center;font-size: 12px;"> {{ ((d.stockNum || 0) - (d.reservationNum || 0))  + '/' + (d.orderNotInNum || 0) + '/' + (d.lackUnPaiNum || 0) }}</div>
        </script>
        <script type="text/html" id="amazon_online_propery_tpl">
            <div style="text-align: left; font-size: 12px;line-height: 18px;">
                {{# if(d.remark == null ){ }}
                <span style="width: 60px;text-align: right">color：{{d.color || '' }}</span><br>
                <span style="width: 60px;text-align: right">size：{{d.size || ''}}</span><br>
                <span style="width: 60px;text-align: right">brand：{{d.brand || ''}}</span><br> {{# } }}
            </div>
        </script>
<script type="text/html" id="amazon_online_salesNum_tpl">
    <div style="text-align: left; font-size: 12px;line-height: 18px;">
        <span style="width: 60px;text-align: right">7天：{{d.sevenSalesNum || 0 }}</span><br>
        <span style="width: 60px;text-align: right">15天：{{d.fifteenSalesNum || 0 }}</span><br>
        <span style="width: 60px;text-align: right">30天：{{d.thirtySalesNum || 0 }}</span><br>
        <span style="width: 60px;text-align: right">60天：{{d.sixtySalesNum || 0 }}</span>
    </div>
</script>
        <script type="text/html" id="amazon_online_listingTime_tpl">
            {{# if(d.listingTime != null ){ }}
            <span style="color:#999;">刊登:</span> {{ Format(d.listingTime, "yyyy-MM-dd")}}<br> {{# } }}
        </script>
        <script type="text/html" id="amazon_online_operate_tpl">
            {{# if(d.title != null ){ }}
            <a class="layui-btn  layui-btn-xs" lay-event="amazon_online_updateOneItem" title="从平台重新同步产品">更新</a>
            <a class="layui-btn  layui-btn-xs" lay-event="amazon_oper_listing" title="查看日志">日志</a>
            <a class="layui-btn  layui-btn-xs" lay-event="amazon_online_createListing" title="创建listing">创建listing</a>
            {{# } }}
        </script>
        <script type="text/html" id="amazon_oper_liting_layer">
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="amazon_online_showlog_table" lay-filter="amazon_online_showlog_table"></table>
                </div>
            </div>
            </script>
            <script type="text/html" id="amazon_log_operation">
                {{#
                    if(d.operType==1)
                { }} 调整库存 {{# } }}

                {{#
                if(d.operType==2)
                { }} 调整价格{{# } }}

                {{#
                     if(d.operType==3)
                { }}修改标题{{# } }}

                {{#
                if(d.operType==8)
                { }}FBM标零{{# } }}

                {{#
                if(d.operType==9)
                { }}FBM补货{{# } }}

                {{#
                if(d.operType==10)
                { }}跟卖标零{{# } }}

                {{#
                if(d.operType==11)
                { }}跟卖补货{{# } }}
            </script>

<!-- 创建listingta弹框-->
<script type="text/html" id="amazon_online_creatListing_tpl">
    <div id="amazon_online_creatListing_p_info_tpl_div"></div>
    <div id="amazon_online_creatListing_s_info_tpl_div"></div>
</script>
<!--创建listingta弹框 -父信息部分-->
<script type="text/html" id="amazon_online_creatListing_p_info_tpl">
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-col-lg12 layui-col-md12">
                <form action="" class="layui-form" id="amazon_online_creatListing_Form">
                    <input name="externalProductIdType" type="hidden" value="{{externalProductIdType}}">
                    <input name="currency" type="hidden" value="{{currency}}" >
                    <input name="weightUnit" type="hidden"  value="{{weightUnit}}">
                    <div calss="layui-card">
                        <div class="layui-col-lg2 layui-col-md2">
                            <label class="layui-form-label">店铺</label>
                            <div class="layui-input-block">
                                <select name="storeAcctId" lay-filter="amazon_online_creatListing_selAcct_filter" lay-search>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg2 layui-col-md2">
                            <label class="layui-form-label">站点</label>
                            <div class="layui-input-block">
                                <select name="salesSite"  lay-filter="amazon_online_creatListing_selSite_filter" >
                                </select>
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">品牌:</label>
                            <div class="layui-input-block">
                                <input name="brand" value="{{brand}}" type="text" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">店铺父SKU:</label>
                            <div class="layui-input-block">
                                <input name="storePSku" value="{{storePSku}}" type="text" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">刊登标题:</label>
                            <div class="layui-input-block">
                                <input name="itemName"  type="text" value="{{enTitle}}"  class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">产品描述:</label>
                            <div class="layui-input-block">
                                <textarea id="amazon_online_creatListing_prodDesc" style="display: none">
                                </textarea>
                            </div>
                        </div>
                    </div>

                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">刊登模板:</label>
                                <div class="layui-input-block">
                                    <select name="tempFileName">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 dis_flex">
                                <input type="input"  name="prodPSku"  class="layui-input" width="300px" value="">
                                <button class="layui-btn layui-btn-sm" type="button" id="amazon_online_creatListing_recom_cate">根据父商品SKU推荐类目信息</button>
                            </div>
                        </div>
                    </div>
<!-- todo -->
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">选择类目:</label>
                            <div class="layui-input-block">
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                        id="amazon_online_creatListing_cateItem_btn">选择类目
                                </button>
                                <input type="hidden" id="amazon_online_creatListing_cateItem-hidden2" name="recommendedBrowseNode" value="{{recommendedBrowseNode}}">
                                <div id="amazon_online_creatListing_cateItem-div2">{{fullCateName}}</div>
                            </div>
                        </div>
                    </div>

                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">feed_product_type:
                            </label>
                            <div class="layui-input-block">
                                <input name="feedProductType" value="{{feedProductType}}" type="text"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">item_type:
                            </label>
                            <div class="layui-input-block">
                                <input name="itemType" value="" type="text"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">color_key_name:
                            </label>
                            <div class="layui-input-block">
                                <input name="colorKeyName" value="" type="text"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">size_key_name:
                            </label>
                            <div class="layui-input-block">
                                <input name="sizeKeyName" value="" type="text"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">color_size_key_name:
                            </label>
                            <div class="layui-input-block">
                                <input name="colorSizeKeyName" value="" type="text"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>

                    <div calss="layui-card" id="amazon_online_creatListing_bullet">
                        <div class="layui-form-item">
                            <label class="layui-form-label">卖点:
                            </label>
                            <div>
                                <div class="layui-input-block" >
                                    <input type="text" name="bulletPoint_0" value="" lay-verify="required" class="layui-input">
                                    <input type="text" name="bulletPoint_1" value="" lay-verify="required" class="layui-input">
                                    <input type="text" name="bulletPoint_2" value="" lay-verify="required" class="layui-input">
                                    <input type="text" name="bulletPoint_3" value="" lay-verify="required" class="layui-input">
                                    <input type="text" name="bulletPoint_4" value="" lay-verify="required" class="layui-input">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">检索词:
                            </label>
                            <div class="layui-input-block">
                                <input  type="text" name="genericKeywords"
                                        class="layui-input" value="{{genericKeywords}}">
                            </div>
                        </div>
                    </div>

                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">扩展属性:
                            </label>
                            <div class="layui-input-block">
                                <textarea name="attrKeyVal" type="text" class="layui-textarea"></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>


<script type="text/html" id="amazon_online_creatListing_s_info_tpl">
    <div class="layui-card">
        <div class="layui-card-header">
            <span>SKU信息</span>
            <button id="aoc_s_info_addOne_btn" type="button" class="layui-btn layui-btn-sm layui-btn-normal fr" >
                添加一行
            </button>
            <button id="aoc_s_info_refreshProductId_btn" type="button" class="layui-btn layui-btn-sm layui-btn-normal fr" >
                刷新UPC/EAN
            </button>
        </div>
        <div class="layui-card-body">
            <table class="layui-table" id="aoc_s_info_sub_tab">
                <thead>
                <tr>
                    <th>店铺SKU</th>
                    <th>UPC/EAN</th>
                    <th>product id</th>
                    <th>重量</th>
                    <th>尺寸</th>
                    <th>颜色</th>
                    <th>刊登价格</th>
                    <th>刊登数量</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="aoc_s_info_SubSkuInfo">
                {{each sInfo amazonSubSkuListing index }}
                <tr class="aoc_s_info_subInfo_class">
                    <td><input type='text'  class="layui-input aoc_s_info_storeSSku_input" value="{{amazonSubSkuListing.storeSSku}}"></td>
                    <td class="aoc_s_info_td_externalProductIdType_td">{{amazonSubSkuListing.externalProductIdType}}</td>
                    <td>
                        <input type='text' readonly class="layui-input aoc_s_info_externalProductId_input" value="">
                        <button type="button"  class="layui-btn layui-btn-xs aoc_s_info_td_clickGenUpcEan">重新生成</button>
                        <button type="button" class="layui-btn layui-btn-xs aoc_s_info_td_empty">清空</button>
                    </td>
                    <td><input type='text'  class="layui-input" value='{{amazonSubSkuListing.weight || ""}}'><label class="aoc_s_info_td_weightUnit">{{amazonSubSkuListing.weightUnit}}</label></td>
                    <td><input type='text' class="layui-input" value='{{amazonSubSkuListing.size || ""}}'
                               onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
                    </td>
                    <td><input type='text' class="layui-input" value='{{amazonSubSkuListing.color || ""}}'
                               onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
                    </td>
                    <td><div class="layui-input-inline"><input type='number' class="layui-input" value='{{amazonSubSkuListing.listingPrice}}'><label class="aoc_s_info_td_currency">{{amazonSubSkuListing.currency}}</label></div></td>
                    <td><input type='number' class="layui-input" value='9999'></td>
                    <td>
                        <button type="button" class="layui-btn layui-btn-sm aoc_s_info_td_remove">移除</button>
                    </td>
                </tr>
                <tr class="aoc_s_info_pic_class">
                    <td colspan="10">
                        <div>
                            <div class="ImgDivIn aoc_s_info_mainImg" style="height:300px;width: 280px;float: left">
                                <img style="height:150px;max-width: 150px" originImage="{{amazonSubSkuListing.image}}" src="{{amazonSubSkuListing.image}}" class='b1'>
                            </div>

                            <div style="overflow: hidden">
                                <div>
                                    <button style="float:left" type="button" class="layui-btn layui-btn-sm aoc_s_info_addPic_btn">网络图片</button>
                                    <div style="float:left" class="aoc_s_info_extPic_edit_local"></div>
                                    <div class="p0">
                                        <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
                                            <span class="layui-bg-red">说明！</span>
                                            <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
                                            <span class="fColor2 mLeft10">「子sku辅图最多选用<span class="maxImgNum fRed">6</span>张，已经选用了<span class="curImgNum">
                                             0
                                      </span>张辅图</span>
                                        </div>
                                    </div>
                                </div>
                                <ul class="amazonSubImg_UL" style="overflow: hidden">

                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
                {{ /each }}
                </tbody>
            </table>
        </div>
    </div>

</script>

<%-- 引入富文本 --%>
<script src="${ctx}/static/simditor/module.js"></script>
<script src="${ctx}/static/simditor/hotkeys.js"></script>
<script src="${ctx}/static/simditor/simditor.js"></script>
<%-- 引入表框移动 --%>
<script src="${ctx}/static/jquery-ui.min.js"></script>

<script type="text/javascript" src="${ctx}/static/js/publishs/amazon/amazon_onlineproduct.js"></script>
