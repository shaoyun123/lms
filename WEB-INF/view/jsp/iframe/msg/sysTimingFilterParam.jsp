<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<style>
    .dis_flex{
        display: flex;
        justify-content:space-between;
    }
    .ml{
        margin-left: 5px;
    }
    #timing_filter_producttpl .xm-select-parent .xm-select-title{
        min-height: 30px;
    }
    #timing_filter_producttpl .xm-select-parent .xm-input{
        height: 30px;
    }
</style>
<title>添加不处理条件</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                </div>
            </div>
            <div class="layui-card" id="sys_timing_filter_param_card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="sys_timing_filter_param_tab_filter">
                        <ul class="layui-tab-title">
                            <div style="float:right;margin: 3px 0 0 5px">
                                <permTag:perm funcCode="add_filter_timing_param_btn">
                                     <button type="button" id="add_timing_filter_task" class="layui-btn layui-btn-sm layui-btn-normal">新增</button>
                                </permTag:perm>
                            </div>
                        </ul>
                        <div class="layui-tab-content" id="ebay_timing__div" style="">
                            <table id="sys_timing_filter_param_table" lay-filter="sys_timing_filter_param_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="isDiscountTpl">
    {{# if(d.isDiscount != null){ }}
        {{# if(d.isDiscount == '1'){ }}
        <span>是</span>
        {{# }else if(d.isDiscount == '0'){ }}
        <span>否</span>
        {{#  } }}
    {{# } }}
</script>
<script type="text/html" id="isPromotionTpl">
    {{# if(d.isPromotion != null){ }}
    {{# if(d.isPromotion == '1'){ }}
    <span>是</span>
    {{# }else if(d.isPromotion == '0'){ }}
    <span>否</span>
    {{#  } }}
    {{# } }}
</script>
<script type="text/html" id="isPromoSkuTpl">
    {{# if(d.isPromoSku != null){ }}
    {{# if(d.isPromoSku == '1'){ }}
    <span>是</span>
    {{# }else if(d.isPromoSku == '0'){ }}
    <span>否</span>
    {{#  } }}
    {{# } }}
</script>
<script type="text/html" id="plat_addTimingFiltertpl">
    <div class="p20">
        <form class="layui-form layui-form-pane mt20" id="timing_filter_producttpl"  lay-filter="timing_filter_producttpl" autocomplete="off" >
            <div class="layui-form-item" style="display: none">
                <label class="layui-form-label">jobHandler</label>
                <div class="layui-input-block">
                    <input name="jobHandler" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item" id="siteIdDiv" style="display: none">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block" name="siteId" id="siteId" >
                </div>
            </div>
            <div class="layui-form-item" id="storeAcctIdDiv" >
                <div style="display: none">
                    <label class="layui-form-label">部门</label>
                    <div class="layui-input-block">
                        <select id="sys_timing_depart_sel1" lay-search lay-filter="sys_timing_depart_sel1" class="orgs_hp_custom">
                            <option value=""></option>
                        </select>
                    </div>
                    <label class="layui-form-label">销售人员</label>
                    <div class="layui-input-block">
                        <select id="sys_timing_salesman_sel" lay-search lay-filter="sys_timing_salesman_sel" class="users_hp_custom" data-rolelist="ebay专员">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block" style="font-size: 12px;">
                    <select id="sys_timing_store_sel" lay-filter="sys_timing_store_sel" xm-select="sys_timing_store_sel" class="users_hp_store_multi" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" data-platcode="ebay" name="sys_timing_store_sel_name"></select>
                </div>

            </div>
            <div class="layui-form-item" id="countryDiv" style="display: none">
                <label class="layui-form-label">物品所在国</label>
                <div class="layui-input-block">
                    <input name="country" class="layui-input" onkeyup="value=value.replace(/[^\A-Z,]/g,'')">
                </div>
            </div>
            <%--wish黄钻 joom黄钻--%>
            <div class="layui-form-item" id="is_promotionDiv" style="display: none">
                <label class="layui-form-label">是否黄钻</label>
                <div class="layui-input-block">
                    <select name="is_promotion">
                        <option value="">全部</option>
                        <option value='1'>是<option>
                        <option value='0'>否<option>
                    </select>
                </div>
            </div>
            <%--wish 促销sku--%>
            <div class="layui-form-item" id="is_promotionSkuDiv" style="display: none">
                <label class="layui-form-label">是否促销sku</label>
                <div class="layui-input-block">
                    <select name="is_promotion_sku">
                        <option value="">全部</option>
                        <option value='1'>是<option>
                        <option value='0'>否<option>
                    </select>
                </div>
            </div>
            <%-- shopee促销--%>
            <div class="layui-form-item" id="is_discountDiv" style="display: none">
                <label class="layui-form-label">是否促销</label>
                <div class="layui-input-block">
                    <select name="is_discount">
                        <option value="">全部</option>
                        <option value='1'>是<option>
                        <option value='0'>否<option>
                    </select>
                </div>
            </div>

            <div class="layui-form-item"  id="listingTimeDiv">
                <div style="width:470px;float: left;">
                    <label class="layui-form-label" style="width:170px;float: left;">刊登时间范围开始</label>
                    <div class="layui-input-block">
                        <input name="listingTimeStart" id="listingTimeStart" style="width:300px;float: left;"  class="layui-input">
                    </div>
                </div>
                <div style="width:470px;float: left;">
                    <label class="layui-form-label" style="width:170px;float: left;">刊登时间范围结束</label>
                    <div class="layui-input-block">
                        <input name="listingTimeEnd" style="width:300px;float: left;" id="listingTimeEnd" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item"  id="prodCreateTimeDiv" style="width:960px;float: left;">
                <label class="layui-form-label" style="width:160px;float: left;"><=商品创建时间天数</label>
                <div class="layui-input-block">
                    <input name="prodCreateDays" id="prodCreateDays" style="width:790px;float: left;"  class="layui-input">
                </div>
            </div>
            <div class="layui-form-item" id="daysNumDiv" style="width:960px;float: left;">
                <label class="layui-form-label" style="width:160px;float: left;"><=距离刊登时间天数</label>
                <div class="layui-input-block">
                    <input name="daysNum" class="layui-input" style="width:790px;float: left;">
                </div>
            </div>
            <div class="layui-form-item" id="timing_filter_producttpl_itemId">
                <label class="layui-form-label">itemId</label>
                <div class="layui-input-block">
                    <input name="itemId" class="layui-input" placeholder="在线商品的itemID或者物品号,英文逗号分隔">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">商品sku</label>
                <div class="layui-input-block">
                    <input name="prodSSku" class="layui-input" placeholder="填写基础商品子SKU,英文逗号分隔(要与在线商品映射到的子SKU完全一致,不能带“*”号等后缀)">
                </div>
            </div>
            <div class="layui-form-item" id="timing_filter_producttpl_globalItemIds" style="width:960px;float: left;display: none">
                <label class="layui-form-label" style="width:160px;float: left;">global_item_id</label>
                <div class="layui-input-block">
                    <input name="globalItemIds" style="width:790px;float: left;" class="layui-input" onblur="sysTimingFilterParamblur(event)" placeholder="支持多个，英文逗号分隔">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">商品标签</label>
                <div class="layui-input-block">
                    <select xm-select="sys_timing_filter_param_prodtag" 
                        xm-select-search xm-select-search-type="dl" 
                        xm-select-skin="normal" name="prodTag">
                        <option value=""></option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" id="shippingService_Div" style="display: none">
                <label class="layui-form-label">店铺运输方式</label>
                <div class="layui-input-block">
                    <input name="shippingService" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <input name="remark" class="layui-textarea">
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/public/sysTimingFilterParam.js"></script>
