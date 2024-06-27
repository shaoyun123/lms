<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" />
<title>lazada在线商品</title>
<style>
    div .findGoods {
        width: 60px;
        height: 60px;
    }

    div .epz_out {
        position: relative !important;
        border: 1px solid #ccc;
    }

    .colspantable td {
        border-top: none;
        border-left: none;
        border-right: none;
    }

    .colspantable tr:last-child td {
        border: none;
    }

    #lazadaOnlineproduceCard .fixeddiv1{
        left: 30px!important;
        right: 40px!important;
    }
    #lazadaOnlineproduceCard .fixeddiv2{
        top: 80px;
        right: 40px;
        left: 30px;
    }
    #lazadaOnlineproduceCard .fixeddiv3{
        right: 20px;
    }
    #lazadaOnlineproduceCard .fixeddiv4{
        right: 40px;
        left: 30px; 
        z-index: 9999;
        margin-top: 9px;
        padding-top: 1px !important;
        width: auto;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lazadaOnlineproduct_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="lazada_online_depart_sel" lay-search
                                            lay-filter="lazada_online_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="lazada_online_salesman_sel" lay-search
                                            lay-filter="lazada_online_salesman_sel" class="users_hp_custom"
                                            data-rolelist="lazada专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <%-- <select id="lazada_online_store_sel" lay-filter="lazada_online_store_sel"
                                            xm-select="lazada_online_store_sel" class="users_hp_store_multi"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            data-platcode="lazada"></select> --%>
                                    <div data-platcode="lazada" xm-select="lazada_online_store_sel" class="users_hp_store_multi" id="lazada_online_store_sel"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select id="lazada_online_site_sel" lay-filter="lazada_online_site_sel"
                                            xm-select="lazada_online_site_sel" class="salesSite_hp_custom" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                            <!-- 类目这里 我那个公共页面有用法 -->
                                <label class="layui-form-label">类目</label>
                                <div class="layui-input-block">
<%--                                    <button id="lazada_online_cate_select_btn" type="button"--%>
<%--                                    class="layui-btn layui-btn-sm layui-btn-primary">选择分类--%>
<%--                                    </button>--%>
<%--                                    <i class="layui-icon layui-icon-delete"--%>
<%--                                    onclick="clearCateAndOtherElementArray('lazada_online_search_category_text','lazada_online_search_category_Id' ,'lazada_online_search_category_cate_site_id')"--%>
<%--                                    style="cursor:pointer" title="删除产品类目"></i>--%>
                                    <input class="layui-input" id="lazadaOnlineProd_lazadaCates" />
                                </div>
                            </div>
                            <input id="lazada_online_search_category_Id" type="hidden" name="categoryId">
                            <input id="lazada_online_search_category_cate_site_id" type="hidden" name="cateSiteId">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select id="lazada_online_searchtype_sel" lay-filter="lazada_online_searchtype_sel">
                                        <option value="prodPSku">商品父sku</option>
                                        <option value="prodSSku">商品子sku</option>
                                        <option value="storePSku">店铺父sku</option>
                                        <option value="storeSSku">店铺子sku</option>
                                        <option value="shopSkuList">店铺商品子sku</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off"
                                           id="lazada_online_searchtype_input" placeholder="请输入sku">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select id="lazada_online_searchgoods_sel"
                                            lay-filter="lazada_online_searchgoods_sel">
                                        <option value="itemId">物品号</option>
                                        <option value="cItemIds">子物品号</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off"
                                           id="lazada_online_searchgoods_input" placeholder="请输入(子)物品号">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select id="lazada_online_title_searchtype"
                                            lay-filter="lazada_online_title_searchtype">
                                        <option value="0">刊登标题(分词全模糊)</option>
                                        <option value="1">刊登标题(常规模糊)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="lazada_online_title"
                                           placeholder="刊登标题">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">刊登时间</label>
                                <div class="layui-input-block">
                                    <input id="listing_time" type="text" name="listing_time" lay-verify="required"
                                           autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">刊登类型</label>
                                <div class="layui-input-block">
                                    <select name="listingType">
                                        <option value="">全部</option>
                                        <option value="SALE_">销售刊登</option>
                                        <option value="SYS_">系统刊登</option>
                                    </select>
                                </div>
                            </div>
                            <%--                                        <div class="layui-col-md2 layui-col-lg2">--%>
                            <%--                                            <label class="layui-form-label">销量</label>--%>
                            <%--                                            <div class="layui-input-block">--%>
                            <%--                                                <div class="layui-col-md6 layui-col-lg6">--%>
                            <%--                                                    <select id="lazada_noline_soldnumtype_sel" lay-filter="lazada_noline_soldnumtype_sel">--%>
                            <%--                                            <option value="1">小于</option>--%>
                            <%--                                            <option value="0">等于</option>--%>
                            <%--                                            <option value="2">大于</option>--%>
                            <%--                                        </select>--%>
                            <%--                                                </div>--%>
                            <%--                                                <div class="layui-col-md6 layui-col-lg6">--%>
                            <%--                                                    <input type="number" class="layui-input inputBorRadRight" autocomplete="off" id="lazada_online_soldnum" min="0">--%>
                            <%--                                                </div>--%>
                            <%--                                            </div>--%>
                            <%--                                        </div>--%>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select id="lazada_online_productLabel_sel" lay-search
                                            lay-filter="lazada_online_productLabel_sel"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select xm-select="isSaleListLazadaOnline" name="isSaleList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                        <option value="2">全部在售</option>
                                        <option value="1">部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否禁售</label>
                                <div class="layui-input-block">
                                    <select name="isProhibit">
                                        <option value="">全部</option>
                                        <option value="true">禁售</option>
                                        <option value="false">非禁售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchSalesType">
                                        <option value="1">7天销量</option>
                                        <option value="2">30天销量</option>
                                        <option value="3">60天销量</option>
                                        <option value="4">90天销量</option>
                                        <option value="5">180天销量</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input inputBorRadLeft" name="salesMin">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input inputRad" name="salesMax">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchQuantityType">
                                        <option value="1">卖家可用</option>
                                        <option value="2">活动库存</option>
                                        <option value="3">在线总数</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="lazada_online_quantityStart" autocomplete="off" class="layui-input inputBorRadLeft">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="lazada_online_quantityEnd" autocomplete="off" class="layui-input inputRad">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品评分</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" name="avgRatingMin">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" name="avgRatingMax">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">评分次数</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input name="avgRatingCountMin" autocomplete="off" class="layui-input inputBorRadLeft">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input name="avgRatingCountMax" autocomplete="off" class="layui-input inputRad">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">促销价</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" name="specialPriceMin">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" name="specialPriceMax">
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">qc状态</label>
                                <div class="layui-input-block">
                                    <select name="qcStatus">
                                        <option value="">全部</option>
                                        <option value="approved">approved</option>
                                        <option value="liverejected">liverejected</option>
                                        <option value="lock">lock</option>
                                        <option value="pending">pending</option>
                                        <option value="rejected">rejected</option>
                                    </select>
                                </div>
                            </div> -->
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否预警商品</label>
                                <div class="layui-input-block">
                                    <select name="waring">
                                        <option value="">全部</option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否预售</label>
                                <div class="layui-input-block">
                                    <select name="preorderEnable">
                                        <option value="">全部</option>
                                        <option value="Yes">已开启</option>
                                        <option value="No">已关闭</option>
                                        <option value="Not">不支持</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否优化</label>
                                <div class="layui-input-block">
                                    <select name="optTimeType">
                                        <option value="">全部</option>
                                        <option value="1">已优化</option>
                                        <option value="2">未优化</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">品牌</label>
                                <div class="layui-input-block">
                                    <select name="brandName">
                                        <option value="">全部</option>
                                        <option value="No Brand">No Brand</option>
                                        <option value="NOT_BRAND">有品牌</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">视频</label>
                                <div class="layui-input-block">
                                    <select name="videoStatus">
                                        <option value="">全部</option>
                                        <option value="1">已上传</option>
                                        <option value="0">未上传</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">视频库视频</label>
                                <div class="layui-input-block">
                                    <select name="videoExist">
                                        <option value="">全部</option>
                                        <option value="true">有</option>
                                        <option value="false">无</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">listing标签</label>
                                <div class="layui-input-block disflex">
                                    <div class="w100">
                                        <select name="listingTagInclude">
                                            <option value="true">包含</option>
                                            <option value="false">不包含</option>
                                        </select>
                                    </div>
                                    <div>
                                        <select id="lazada_listing_label" xm-select="lazada_listing_label" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">listing备注</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="listingRemark">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select id="lazada_online_sortdesc_sel" lay-filter="lazada_online_sortdesc_sel">
                                        <option value=""></option>
                                        <option value="p.listing_time asc,p.id asc">刊登时间升序</option>
                                        <option value="p.listing_time desc,p.id asc">刊登时间降序</option>
                                        <option value="sum(s.available) asc,p.id asc">在线数量升序</option>
                                        <option value="sum(s.available) desc,p.id asc">在线数量降序</option>
                                        <option value="psplsc.seven_sales asc">7天销量升序</option>
                                        <option value="psplsc.seven_sales desc">7天销量降序</option>
                                        <option value="psplsc.thirty_sales asc">30天销量升序</option>
                                        <option value="psplsc.thirty_sales desc">30天销量降序</option>
                                        <option value="psplsc.sixty_sales asc">60天销量升序</option>
                                        <option value="psplsc.sixty_sales desc">60天销量降序</option>
                                        <option value="psplsc.ninety_sales asc">90天销量升序</option>
                                        <option value="psplsc.ninety_sales desc">90天销量降序</option>
                                        <option value="pe.opt_time desc">优化时间倒序</option>
                                        <option value="pe.opt_time">优化时间正序</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" id="lazada_online_productStatus" value='Active'>
                            <input type="hidden" name="lazada_online_noProfit" value=''>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div style="margin-left: 5px;">
                                    <button class="layui-btn layui-btn-sm" id="lazada_online_search_submit"
                                            type="button">搜索</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                            id="lazada_search_reset">清空</button>
                                  <span id="lazada_online_copy_list" style="position:relative;" onmouseover="showTip(`最多复制1w个`,this)" onmouseout="removeTip(this)">
                                    <button type="button" class="layui-btn layui-btn-sm">一键复制</button>
                                    <ul class="hidden">
                                        <li class="lazadaOnline_copyData" data-type="itemId" data-typestr="item_id">
                                          物品号</li>
                                        <li class="lazadaOnline_copyData" data-type="prodPSku" data-typestr="商品父SKU">商品父SKU</li>
                                        <li class="lazadaOnline_copyData" data-type="storeAcctName" data-typestr="店铺名称" >店铺名称</li>
                                    </ul>
                                </span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div id="lazada_online_search_category_text"></div>
            </div>
            <div class="layui-card" id="lazadaOnlineproduceCard">
                <div class="layui-card-body">
                    <div style="display: none">
                        <button class="layui-btn layui-btn-sm" id="lazada_export_btn" type="button">导出</button>
                    </div>
                    <div id="lazada_online_toolbar">
                        <div style="width:600px;position:absolute;right:150px;z-index:9">
                            <div style="display: inline">
                                <button class="layui-btn layui-btn-sm" id="lazada_onlilne_settting_tag" type="button">标签配置</button>
    <%--                            <a class="layui-btn layui-btn-sm" id="lazada_priceAdjustmentTemp_exportBtn" href="${ctx}/static/templet/lazada_import_update_price.xlsx" target="_blank">导出调价模板</a>--%>
    <%--                            <button class="layui-btn layui-btn-sm" id="lazada_priceAdjustmentTemp_importBtnConfirm" type="button">导入调价</button>--%>
                                <button id="lazada_priceAdjustmentTemp_importBtn" style="display:none;"></button>
                                <button id="lazada_priceAdjustmentTemp_modifyWeight_importBtn" style="display:none;"></button>
                            </div>
                            <a href="javascript:;" class="layui-btn layui-btn-sm"
                               onclick="expandAll('lazadaOnlineproduceCard')">展开所有</a>
                            <a href="javascript:;" class="layui-btn layui-btn-sm"
                               onclick="PackUpAll('lazadaOnlineproduceCard')">收起所有</a>
                            <div class="layui-form" style="display:inline-flex;width:300px;">
                                <select lay-filter="lazadaOnlineproduceExportSel">
                                    <option value="1">导出调价模板</option>
                                    <option value="2">导出修改重量模板</option>
                                </select>
                                <select lay-filter="lazadaOnlineproduceImportSel">
                                    <option value="1">导入调价</option>
                                    <option value="2">导入修改重量</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form" style="width:200px;position:absolute;right:20px;z-index:9">
    
                            <select lay-filter="lazada_online_patch" name="lazada_online_patch" id="lazada_online_patch"><option value="" data-link="" data-title="">批量操作</option>
                                <permTag:perm funcCode="modify_stock_lazada"><option value="0" data-link="route/iframe/lazada/adjuststock" data-title="批量调整库存">批量调整库存</option></permTag:perm>
                                <permTag:perm funcCode="off_shelves_lazada">
                                    <option value="2" data-link="route/iframe/lazada/offshelves" data-title="商品下架/删除">商品下架/删除</option>
                                </permTag:perm>
                                <permTag:perm funcCode="adjust_promoprice_lazada">
                                    <option value="3" data-link="route/iframe/lazada/adjustpromotion" data-title="仅调整促销价">仅调整促销价</option>
                                </permTag:perm>
                                <permTag:perm funcCode="adjust_price_lazada">
                                    <option value="4" data-link="route/iframe/lazada/adjustpriceAndpromotion"
                                            data-title="调整原价和促销价">调整原价和促销价</option>
                                </permTag:perm>
                                <option value="1" data-link="" data-title="">批量更新</option>
                                <permTag:perm funcCode="lazada_modify_title">
                                    <option value="12" data-link="route/iframe/lazada/lazadaModifyTitle" data-title="仅修改标题">仅修改标题
                                    </option>
                                </permTag:perm>
                                <permTag:perm funcCode="adjust_description_lazada">
                                    <option value="5" data-link="route/iframe/lazada/modifyTittle" data-title="修改标题和描述">修改标题和描述</option>
                                </permTag:perm>
                                <permTag:perm funcCode="modify_picture_lazada">
                                    <option value="6" data-link="route/iframe/lazada/modifyPicture" data-title="修改子SKU图">修改子SKU图
                                    </option>
                                </permTag:perm>
                                <%-- <option value="7" data-title="重新上架">重新上架
                                </option> --%>
                                <permTag:perm funcCode="modify_classify_lazada">
                                    <option value="8" data-link="route/iframe/lazada/modifyGoodsClassify" data-title="修改商品分类">修改商品分类
                                    </option>
                                </permTag:perm>
                                <option value="9" data-link="route/iframe/lazada/modifyListingPicture" data-title="修改listing图">修改listing图
                                </option>
    <%--                            <option value="9" data-link="route/iframe/lazada/lazadaModifyStock" data-title="调整库存">调整库存
                                </option>--%>
                                <permTag:perm funcCode="modify_listing_make_lazada">
                                    <option value="10" data-link="route/iframe/lazada/modifyListingMake" data-title="批量修改listing品牌">批量修改listing品牌
                                    </option>
                                </permTag:perm>
                                <permTag:perm funcCode="not_handle_listing_lazada">
                                    <option value="11" data-link="route/iframe/lazada/lazadaNotHandleListing" data-title="不处理listing">不处理listing
                                    </option>
                                </permTag:perm>
                                <option value="13" data-title="导出listing">导出listing
                                </option>
                                <option value="14" data-title="导出listing（不含利润）">导出listing（不含利润）
                                </option>
                                <option value="15" data-title="预售设置" data-link="route/iframe/lazada/lazadaPreSales">预售设置</option>
                                <permTag:perm funcCode="delete_listing_video_lazada">
                                    <option value="16" data-title="删除listing视频">删除listing视频</option>
                                </permTag:perm>
                                <permTag:perm funcCode="modify_listing_label_lazada">
                                    <option value="17" data-link="route/iframe/lazada/updateLisitingTags" data-title="修改listing标签">修改listing标签</option>
                                </permTag:perm>
                                    <option value="18" data-link="route/iframe/lazada/lazadaModifySsku" data-title="一键新增子SKU">一键新增子SKU</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-tab">
                        <ul class="layui-tab-title mb10 lazadaOnlineproduct-attr-active" id="lazada_online_tab_view">
                            <!-- <li class="layui-this" lazadaOnlineproduct-attr="0" onclick="setLazadaProductStatus(1)">在线(<span
                                    id="LazadaIsSaleTrueNum"></span>)</li> -->
                        </ul>
                    </div>
                    <div class="checkbox-group" style="padding:10px;" id="lazada_online_subStatus_checkbox">
                        <div class="layui-form">
                            <form id="lazada_online_marks_form" style="display: flex;justify-content: space-between">
                                <div class="hidden" id="lazada_online_subStatus_checkbox_view"></div>
                                <div>
<%--                                    <input type="checkbox" name="like1[write]" value="需要调价" lay-skin="primary" title="待调价"--%>
<%--                                           id="lazada_online_marks_adjust" lay-filter="marksCheck">--%>
<%--                                    <input type="checkbox" name="like1[write]" value="调价完成" lay-skin="primary" title="调价完成"--%>
<%--                                           lay-filter="marksCheck">--%>
                                </div>
                                <div>
                                    <input type="checkbox" name="displayAccurateCount" value="统计总数" lay-skin="primary" title="统计总数">
                                </div>
                            </form>
                        </div>
                    </div>
                    <table class="layui-hide" id="lazada_online_tableId" lay-filter="lazada_online_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- tab -->
<script type="text/html" id="lazada_online_tab_tpl">
    {{# layui.each(d,function(value,key){ }}
        <li onclick="setLazadaProductStatus('{{key}}')" class="{{key==='Active' ? 'layui-this':''}}" lazadaOnlineproduct-attr="{{key}}">{{value}}(<span></span>)</li>
    {{# }) }}
</script>
<script type="text/html" id="lazada_online_subStatus_checkbox_tpl">
    {{# layui.each(d,function(value,key){ }}
        <input type="checkbox" name="subStatus" value="{{key}}" lay-skin="primary" title="{{value}}">
    {{# }) }}
</script>

<!-- 导出数据弹框 -->
<script type="text/html" id="lazada_export_btn_layer">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <form class="layui-form  pd" >
                <div class="layui-form-item">
                    <div class="layui-col-lg12 layui-col-md12">
                        <label class="layui-form-label">状态</label>
                        <div class="layui-input-block">
                            <input type="radio" name="isSale" value="1" title="已在线" checked>
                            <input type="radio" name="isSale" value="0" title="已下架">
                        </div>
                    </div>
                    <div class="layui-col-12 layui-col-md12">
                        <label class="layui-form-label">数据范围</label>
                        <div class="layui-input-inline">
                            <input type="radio" name="range" value="1" title="导出列表选中数据">
                            <input type="radio" name="range" value="0" title="导出搜索条件中的数据" checked>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <div class="pd">
                <table class="layui-table" id="reststockin_additem_data_table" lay-filter="reststockin_additem_data_table"></table>
            </div>
        </div>
    </div>
</script>
<%-- 表格模块 --%>
<%-- 图片 --%>
<script type="text/html" id="lazada_online_pImgs_tpl">
    <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
        <div class="findGoods epz_out">
            {{# if(d.firstImg != null){ }}
            <img class="img_show_hide shopee_imgCss lazy" data-original="{{d.firstImg}}" style="display: block;width:60px;height:60px" data-onerror="layui.admin.img_noFind()"> {{# } }}
        </div>
    </div>
</script>
<%-- 标题/产品ID --%>
<script type="text/html" id="lazada_online_title_tpl">
    {{# if(d.listingRemark){ }}
        <div style="text-align: left;font-size: 12px;" lay-tips="{{d.listingRemark}}">
    {{# }else{ }}
        <div style="text-align: left;font-size: 12px;">
    {{# } }}
        {{d.title || ''}}
            <a class="itemId" target="_blank" style="color:#409eff;font-weight: bold" href="{{d.itemIdSrc}}">{{d.itemId}}</a>
            <span onclick="layui.admin.onlyCopyTxt('{{d.itemId}}')" style="display: {{d.itemId ? 'inline-block':'none'}}; cursor:pointer">
                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
            </span>
<%--        <a class="itemId" target="_blank" style="color:#409eff;font-weight: bold" href="{{d.itemIdSrc}}">{{d.itemId}}</a>--%>
        {{# if(d.isPromotion){ }}
        <span class="hp-badge layui-bg-orange fr layTitle" lay-title="参加促销">促</span>
        {{# } }}
        {{# if(d.videoStatus == 1){ }}
        <span class="hp-badge layui-bg-red fr layTitle" lay-title="存在视频">视</span>
        {{# } }}
        {{# if(d.isDiscontinued == 1){ }}
        <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>
        {{# } }}
        {{# if(d.pSkuIsSaleStatus == false ){ }}
        <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>
        {{# } }}
        {{# if(d.waringId){ }}
        <span class="hp-badge layui-bg-orange fr layTitle" lay-title="预警">警</span>
        {{# } }}
        </br>
        <div style="color: #999;"> [ {{d.storeAcctName || ''}} ] [ {{d.shortCode || ''}} ] [ {{d.salesperson || ''}} ] </div>
        {{# if(d.primaryCategory){ }}
        <span> {{ d.primaryCategory }}</span>
        {{# } }}
        {{# if(d.primaryCategoryName){ }}
        <span >{{ d.primaryCategoryName }}</span>
        {{# } }}
    </div>
</script>
<%-- 产品父sku/店铺父sku --%>
<script type="text/html" id="lazada_online_storePSku_tpl">
    <div style="text-align: left;font-size: 12px;">
        {{d.model || ''}} {{# if(d.isOffline =='1'){ }}
        <span class="popoverHover myj-type-box" tilte="已下架" title="">下</span> {{# } }}
        {{# if(d.model != undefined && d.model !=''){ }}
        {{# if(d.model.indexOf("SYS_") > -1){ }}
        <span class="hp-badge layui-bg-blue fr layTitle" lay-title="系统刊登">系</span>
        {{# } }}
        {{# } }}
        </br>
        <div style="color: #999;" title="对应的基础父商品sku"> [
                <a>{{d.prodPSku}}</a>
                <span onclick="layui.admin.onlyCopyTxt('{{d.prodPSku}}')" style="display: {{d.prodPSku ? 'inline-block':'none'}}; cursor:pointer">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
        ]</div>
        <div>刊登：{{ Format(d.listingTime,"yyyy-MM-dd hh:mm:ss")}}</div>
        <%--在线listing标签--%>
        {{# if(d.listingTags){ }}
        {{# layui.each(d.listingTags.split(","), function(index, item){ }}
            <span class="layui-bg-blue" style="padding: 2px 3px;border-radius: 4px;">{{item}}</span>
        {{# })} }}
        <div>优化时间：
            {{# if(d.optTime){ }}
            {{ Format(d.optTime,"yyyy-MM-dd hh:mm:ss")}}
            {{# } }}
        </div>
        <%-- “ParentSKU”下展示Suspended子状态，悬浮展示被暂停的原因--%>
        {{# if(d.productStatus == 'Suspended'){ }}
            {{# if(!d.rejectReasonListStr){ }}
                <p style="color: #01AAED;">{{d.subStatusStr || ''}}</p>
            {{# }else{ }}
                    <p style="color: #01AAED;" lay-tips="{{d.rejectReasonListStr}}">{{d.subStatusStr || ''}}</p>
            {{# } }}
        {{# } }}
    </div></script>
<%-- 子sku详情 --%>
<script type="text/html" id="lazada_online_storeSSku_tpl">
    {{# if(d.sub){  }}
    <table class="layui-table colspantable" style="width: 880px;margin-left: -5px;font-size: 12px;">
        {{# layui.each(d.sub, function(index, item){ }} {{# if(index
        <5){ }} {{# if(index==d.sub.length-1){ }} <tr style="">
        {{# }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important">
            {{# } }} {{# }else{ }} {{# if(index == d.sub.length-1){ }}
        <tr style="display: none;" class="myj-hide">
            {{# }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important;display: none;" class="myj-hide">
            {{# } }} {{# } }}
        <td style="width:150px;text-align: left;padding-left: 5px;color: #000;word-break: break-all;font-size: 12px;"> {{item.shopSku }} </td>
            <td style="width:130px;text-align: left;padding-left: 5px;color: #000;word-break: break-all;font-size: 12px;">
                <p>{{item.storeSubSku}}</p>
<%--                <p style="color: #01AAED;">{{item.qcStatus || ''}}</p>--%>
                <p style="color: #999;margin-top:10px" title="对应的基础子商品sku"> [
                    <a>{{item.prodSSku || ''}}</a>
                    <span onclick="layui.admin.onlyCopyTxt('{{item.prodSSku}}')" style="display: {{item.prodSSku ? 'inline-block':'none'}}; cursor:pointer">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                    ]
<%--                    {{# if(item.isAdjust == 1){ }}--%>
<%--                    <span class="hp-badge layui-bg-orange fr layTitle" lay-title="待调价">调</span>--%>
<%--                    {{# } }}--%>
                    {{# if(item.sSkuIsSaleStatus == false){ }}
                    <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>
                    {{# } }}
                </p>
            </td>
            <td style="width:100px;text-align: center;color: #000;font-size: 12px;">
                <p>size: {{ item.size || ''}}</p>
                <p>color: {{ item.colorFamily || ''}}</p>
            </td>
            <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.price||''}}</td>
            <td style="width:70px;text-align: center;color: #000;font-size: 12px;"> {{item.specialPrice||''}}</td>
            <td style="width:70px;text-align: center;color: #000;font-size: 12px;">
                {{# if(item.sellableQuantity && item.sellableQuantity != 0){ }}
                <span style='color: red' lay-tips='开始时间:{{item.startTime?format(item.startTime,"yyyy-MM-dd hh:mm:ss"):"-"}};结束时间:{{item.endTime?format(item.endTime,"yyyy-MM-dd hh:mm:ss"):"-"}}'>
                {{# }else{ }}
                <span lay-tips='开始时间:{{item.startTime?format(item.startTime,"yyyy-MM-dd hh:mm:ss"):"-"}};结束时间:{{item.endTime?format(item.endTime,"yyyy-MM-dd hh:mm:ss"):"-"}}'>
                {{# } }}
                {{item.sellableQuantity || 0}}</span> | {{item.sellerAvailable}} | {{item.available }} </td>
            <td style="width:60px;text-align: center;color: #000;font-size: 12px;"> {{item.productStatus=='active'?'在线': '下架' }}</td>
<%--            <td style="width:100px;text-align: center;color: #000;font-size: 12px;"> {{item.availableStock }}/{{item.onOrderStock }}/{{item.unallocatedStock }} </td>--%>
            <td style="width:100px;text-align: center;color: #000;font-size: 12px;"> {{item.preAvailableStockAll===0?0:(item.preAvailableStockAll||'')}}/{{item.preAvailableStock===0?0:(item.preAvailableStock||'')}}</td>
<%--            <td style="width:100px;text-align: center;color: #000;font-size: 12px;"> {{item.sevenSales || 0 }}/{{item.fifteenSales || 0 }}/{{item.thirtySales || 0 }}/{{item.sixtySales || 0 }}/{{item.ninetySales || 0 }} </td>--%>
            <td style="width:100px;text-align: center;color: #000;font-size: 12px;"> {{item.sevenSales || 0 }}/{{item.thirtySales || 0 }}/{{item.sixtySales || 0 }}/{{item.ninetySales || 0 }}/{{item.hundredOfEightySales || 0 }} </td>
        </tr>
        {{# }); }}
    </table>
    {{# if(d.sub.length > 5){ }}
    <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">+ 展开</a> {{# } }}
    {{# } }}
</script>

<%-- 操作按钮 --%>
<script type="text/html" id="lazada_online_operate_tpl">
    <a class="layui-btn  layui-btn-xs" lay-event="lazada_online_updateOneItem">更新</a>
    <br>
    <a class="layui-btn  layui-btn-xs" lay-event="lazada_online_searchLog">日志</a>
    <br><a class="layui-btn layui-btn-xs" lay-event="lazada_online_remark">备注</a>
</script>

<%-- 日志弹框表格 --%>
<script type="text/html" id="log_table_lazada">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="lazada_log_table" lay-filter="lazada_log_table"></table>
        </div>
    </div>
</script>
<%-- 备注弹框表格 --%>
<script type="text/html" id="remark_table_lazada">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="lazada_remark_table" lay-filter="lazada_remark_table"></table>
        </div>
    </div>
    <textarea class="layui-textarea" placeholder="请输入备注最多可支持输入200字，超出无法输入" name='listingRemark'></textarea>
</script>
<%-- 日志弹框表格 --%>
<script type="text/html" id="listing_label_lazada_tpl">
    <div class="layui-col-md11 layui-col-lg11" style="margin-top: 10px;">
        <label class="layui-form-label">新增标签</label>
        <div class="layui-input-block">
            <select id="lazada_listing_label_add" xm-select="lazada_listing_label_add" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
        </div>
    </div>
    <div class="layui-col-md11 layui-col-lg11">
        <label class="layui-form-label">移除标签</label>
        <div class="layui-input-block">
            <select id="lazada_listing_label_remove" xm-select="lazada_listing_label_remove" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
        </div>
    </div>
</script>
<%-- 日志执行事件 --%>
<%--<script type="text/html" id="lazada_log_operation">--%>
    <%--&lt;%&ndash; {{# if(d.id!==-1){ }}&ndash;%&gt;--%>
    <%--{{# if(d.operType==0){ }} 定时标零 {{# } }}--%>
    <%--{{# if(d.operType==1){ }} 调价 {{# } }}--%>
    <%--{{# if(d.operType==2){ }} 仅调整促销价 {{# } }}--%>
    <%--{{# if(d.operType==3){ }} 调整库存 {{# } }}--%>
    <%--{{# if(d.operType==4){ }} 删除商品 {{# } }}--%>
    <%--{{# if(d.operType==5){ }} 定时补货 {{# } }}--%>
    <%--{{# if(d.operType==6){ }} 自动删除 {{# } }}--%>
    <%--{{# if(d.operType==9){ }} 修改图片 {{# } }}--%>
    <%--{{# if(d.operType==8){ }} 下架商品 {{# } }}--%>
    <%--{{# if(d.operType==10){ }} 修改商品分类 {{# } }}--%>
    <%--{{# if(d.operType==13){ }} 修改商品图片 {{# } }}--%>
<%--</script>--%>
<script src="/lms/static/js/publishs/lazada/lazadaOnlineproduct.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/vue/js/elementui@2.13.js"></script>
<script src="${ctx}/static/components/lodash.js"></script>