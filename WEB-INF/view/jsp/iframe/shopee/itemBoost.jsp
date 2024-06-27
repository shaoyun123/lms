<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>shopee listing boost</title>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<style>
    li.window_map_imgLi{
        float: left;
    }
    img.window_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
    }
    img.templet_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 33px;
        right: 0;
        position: absolute;
    }
    div.window_map_imgDiv{
        width:120px;
        height:80px;
        display:inline-block;
        vertical-align: middle;
        margin-right:5px;
        position:relative;
        border: 1px solid #ccc;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="shopee_replace_itemBoost_form" id="shopee_replace_itemBoost_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md1 layui-col-lg1">
                                <label class="layui-form-label">商品子SKU</label>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="layui-input-inline">
                                    <input type="text" id="shopee_replace_itemBoost_storePSku_input" name="skuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                    <select id="shopee_itemBoost_pskuSearchType">
                                        <option value="0">模糊</option>
                                        <option value="1">精确</option>
                                    </select>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="shopee_online_depart_sel" name="orgId" lay-search lay-filter="shopee_online_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">销售人员</label>
                                    <div class="layui-input-block">
                                        <select  name="saleName"  lay-search class="users_hp_custom" data-rolelist="shopee专员" >
                                            <option value=""></option>
                                        </select>
                                    </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select  lay-search xm-select="selectAttr_store" id="selectAttr_store" class="store_hp_custom" data-platcode="shopee">
                                            <option value=""></option>
                                        </select>
                                    </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select id="shopee_boost_site_sel" lay-filter="shopee_boost_site_sel" xm-select="shopee_boost_site_sel" class="salesSite_hp_custom" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">itemId</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="shopee_boost_itemid_input" style="width: 254px" name="shopee_boost_itemid_input" autocomplete="off" class="layui-input" placeholder=",分割">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button"  id="shopee_replace_itemBoost_search_btn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="shopee_replace_windowMap_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" >数量(<span id="shopee_replace_itemBoost_num_span"></span>)</li>
                            <div style="float:right;margin-top:5px;">
                                <button type="button" id="shopee_replace_itemBoost_timing_auto_bacthUpdate_btn" class="layui-btn layui-btn-normal layui-btn-sm">批量自动定时boost</button>
                                <button type="button" id="shopee_replace_itemBoost_timing_auto_bacthUpdate_brazil_btn" class="layui-btn layui-btn-normal layui-btn-sm">巴西专用自动定时</button>
                                <button type="button" id="shopee_replace_itemBoost_bacthUpdate_btn" class="layui-btn layui-btn-normal layui-btn-sm">立即boost</button>
                                <button type="button" id="shopee_replace_itemBoost_cancel_timing_bacthUpdate_btn" class="layui-btn layui-btn-normal layui-btn-sm layui-btn-danger">取消定时boost</button>
                            </div>
                        </ul>
                        <div class="layui-tab-content" id="shopee_replace_itemBoost_tab_content">
                            <table class="layui-table" id="shopee_replace_itemBoost_table" lay-filter="shopee_replace_itemBoost_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="shopee_online_boostedTiming_tpl">
        {{# if(d.boostedTiming != null){ }}
        {{ Format(d.boostedTiming, "yyyy-MM-dd hh:mm:ss")}}
        {{# } }}
</script>

<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/itemBoost.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
