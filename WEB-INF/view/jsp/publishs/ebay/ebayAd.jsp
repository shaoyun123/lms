<!--ebay V2促销页面-->
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <link rel="stylesheet" href="${ctx}/static/zTree/css/zTreeStyle/zTreeStyle.css" media="all">
            <title>ebay广告</title>
            <style>
                .fr {
                    float: right;
                }
                
                .w_80 {
                    width: 80%!important;
                    display: inline-block;
                }
                
                .w_50 {
                    width: 50%!important;
                    display: inline-block;
                }
                
                .mt {
                    margin-top: 10px;
                }
                
                .ml {
                    margin-left: 10px!important;
                }
                .mr{
                    margin-right: 10px;
                }
                
                .m20 {
                    margin: 20px;
                }
                
                .hidden {
                    display: none!important;
                }
                
                .hide {
                    display: none!important;
                }
                
                .dis_flex {
                    display: flex;
                    justify-content: flex-start;
                }
                
                .dis_flex_space {
                    display: flex;
                    justify-content: space-between;
                }
                
                .mg_50 {
                    margin: 20px 50px;
                }
                
                .mb_5 {
                    margin-bottom: 5px;
                }
                
                .lh_38 {
                    line-height: 38px;
                }
                
                .w50 {
                    width: 50px;
                }
                
                .w_100 {
                    width: 100px;
                }
                
                .w_250 {
                    width: 250px;
                }
                
                .mlr_5 {
                    margin: 0 5px;
                }
                
                .middleLine {
                    margin: 0 10px;
                    line-height: 32px;
                }
                
                .ebayAd_chooseCategoryInput {
                    cursor: pointer;
                }
                
                .w_70 {
                    width: 70%;
                }
                
                .imgpre {
                    width: 70px;
                    height: 70px;
                    border: 1px solid #ccc;
                }
                
                .imgpre img {
                    width: 70px;
                    height: 70px;
                }
                
                .percentageOffItemDiv:first-child .deleteIcon {
                    display: none;
                }
                
                .label_select {
                    padding: 0 0 0 10px!important
                }
                
                .deleteIcon {
                    font-size: 32px;
                    line-height: 32px;
                    cursor: pointer;
                    color: gray
                }
                
                .dis_flex_start {
                    display: flex;
                    justify-content: flex-end;
                    flex-direction: column;
                }
                
                .deleteIcon:hover {
                    color: #4e4e4e
                }
                
                .mtb {
                    margin: 10px 0;
                }
                
                .panel {
                    background: #f2f2f2;
                    padding: 10px;
                }
                .w_200{
                    width:200px;
                }
                #LAY-ebayAddvertisement .layui-btn+.layui-btn{
                    margin-left: 0!important;
                }
                .light-blue{
                    color:lightblue;
                }
                .gray{
                    color:gray
                }
                .red{
                    color:red;
                }
                .bg_gray{
                    background:rgb(242,242,242);
                }
                .bg_white{
                    background:#fff;
                }
                .title_item{
                    border-top: 1px solid rgb(242,242,242);
                    border-bottom: 1px solid rgb(242,242,242);
                    border-left: 1px solid rgb(242,242,242);
                    padding: 10px;
                    width: 14.2%;
                    text-align: center;
                }
                #ebayAdperformance_title ul:last-child{
                    border-right:1px solid rgb(242,242,242)
                }
                .title_item_num{
                    font-weight: 600;
                    font-size: 16px;
                }
                .title_item_name{
                    font-size: 12px;
                    color: #aaa;
                }
            </style>
            <div class="layui-fluid" id="LAY-ebayAddvertisement">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="ebayAddvertisement_searchForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgId" lay-filter="ebayAddvertisement_orgFilter" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">销售人员</label>
                                            <div class="layui-input-block">
                                                <select name="salePersonId" class="users_hp_custom" data-rolelist="ebay专员" lay-filter="ebayAddvertisement_sellerFilter" lay-search>
                                    </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="ebayAddvertisement_storeFilter" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">广告活动名称</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="campaignName" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label label_select">
                                                <select name="dateType">
                                                    <option value="0">开始时间</option>
                                                    <option value="1">结束时间</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="searchDate" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-input-block">
                                                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit id="ebayAddvertisement_searchBtn" lay-filter="ebayAddvertisement_searchBtn">查询</button>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" name="showType">
                                    <input type="hidden" name="limit" value="100">
                                    <input type="hidden" name="page" value="1">
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-tab" lay-filter="ebayAddvertisement_Tab" id="ebayAddvertisement_Tab">
                                    <div class="dis_flex_space">
                                        <ul class="layui-tab-title">
                                            <li data-index="0" class="layui-this">未开始(<span>0</span>)</li>
                                            <!--未开始-->
                                            <li data-index="1">进行中(<span>0</span>)</li>
                                            <!--进行中-->
                                            <li data-index="2">暂停中(<span>0</span>)</li>
                                            <!--暂停中-->
                                            <li data-index="3">已结束(<span>0</span>)</li>
                                            <!--已结束-->
                                            <li data-index="4">已删除(<span>0</span>)</li>
                                            <!--已删除-->
                                            <li data-index="5">全部(<span>0</span>)</li>
                                            <!--全部-->
                                        </ul>
                                        <div class="dis_flex">
                                            <div>
                                            <input type="text" class="layui-input" placeholder="请选择同步时间" readonly id="syncTime">
                                            <div>同步时间范围=选择时间(开始时间)~当前时间</div>
                                        </div>
                                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal mr" id="ebayAdsyncStore">同步</button>
                                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left: 10px;" id="createAdvertisement">创建广告活动</button>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content">
                                        <div class="">
                                            <table lay-filter="ebayAddvertisement_table" class="layui-table" id="ebayAddvertisement_table"></table>
                                        </div>
                                    </div>
                                </div>
                                <div id="ebayAdpage"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 新增和编辑广告 -->
            <script type="text/html" id="pop_new_advertisement">
                <div class="mg_50">
                    <form class="layui-form " id="new_advertisement_form" lay-filter="new_advertisement_form">
                        <!-- 店铺信息，公共基本信息 -->
                        <div class="layui-form-item promotion-common">
                            <div class="layui-col-md8 layui-col-lg10">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" id="storeAcctId" lay-verify="required" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md8 layui-col-lg10">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="marketplaceId" id="marketplaceId" lay-filter="marketplaceId" lay-verify="required" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md8 layui-col-lg10">
                                <label class="layui-form-label">活动名称</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="campaignName" lay-verify="required">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg5">
                                <label class="layui-form-label">开始时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" readonly name="startDate" lay-verify="required">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg5">
                                <label class="layui-form-label">结束时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" readonly name="endDate" lay-verify="required">
                                </div>
                            </div>
                            <button type="button" class="hidden layui-btn layui-btn-sm layui-btn-normal" lay-submit id="submitebayAd_editForm" lay-filter="submitebayAd_editForm">查询</button>
                        </div>
                        <div class="layui-form-item ebayAd-product">
                                <label class="layui-form-label">广告活动</label>
                                <div class="layui-input-block">
                                    <div class="ebayAdProductBox">
                                        <div class="layui-col-md10 layui-col-lg10">
                                            <select name="campaignType" lay-filter="campaignType" class="w_50">
                                                <option value="">请选择</option>
                                                <option value="1">跟据规则获取</option>
                                                <option value="0">指定产品</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-md10 layui-col-lg10" style="padding: 10px 0;">
                                            <div class="layui-collapse ruleCriteria" lay-filter="ruleCriteria">
                                                <!-- TODO #ebayAd_promotionProductItemTpl  -->
                                             </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </form>
                </div>
            </script>  
            <!--促销商品选择分类弹框-->
            <script type="text/html" id="ebayAd_categoryTreeTpl">
                <form class="layui-form">
                    <div id="ebayAd_categoryTree" class="mg_50 ztree"></div>
                </form>
            </script>

            <script type="text/html" id="ebayAd_ProductItemTpl">
                <!--每一项促销产品-->
                <div class="layui-colla-item">
                    <!--折扣梯度名称-->
                    <h2 class="layui-colla-title">
                        <span>广告规则</span>
                    </h2>
                    <div class="layui-colla-content layui-show">
                        <!--全部商品-->
                        <div class="layui-row inventoryAny">
                        </div>
                        <!--按据规则获取-->
                        <div class="layui-col-md12 layui-col-lg12 RateIo" style="display: none">
                            <label class="layui-form-label">费率</label>
                            <div class="dis_flex_space layui-input-block"> 
                                <div class="dis_flex_space">
                                <input type="number" class="layui-input w_200" name="bidPercentage" min="1" max="100">
                                <span>%</span> 
                            </div>  
                                <span class="producttipsspan red">此项为创建广告活动必须，不用于计算广告费</span>                               
                            </div>
                        </div>
                        <div class="layui-row inventoryByRule" style="display: none">
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label">分类条件</label>
                                <div class="dis_flex_space layui-input-block">
                                    <select name="categoryScope" class="categoryScope">
                                        <option value="MARKETPLACE">产品分类</option>
                                        <option value="STORE">店铺分类(不要选)</option>
                                    </select>
                                    <button type="button" class="layui-btn layui-btn-sm ebayAd_categoryChoose">选择分类</button>
                                </div>
                                <div class="dis_flex_space layui-input-block">
                                    <table class="layui-table categoryRuleTable">
                                        <thead>
                                            <tr>
                                                <th>分类名</th>
                                                <th>价格筛选</th>
                                                <th>商品类型</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody> 
                                            <!-- #ebayAd_categoryPriceTrTpl-->
                                         </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label">规则适用新产品</label>
                                <div class="layui-input-block">
                                    <select name="autoSelectFutureInventory">
                                    <option value="true">是</option>
                                    <option value="false" selected>否</option>
                                   </select>
                                </div>
                            </div>
                        </div>
                        <!--指定产品-->
                        <div class="layui-row inventoryByValue" style="display: none">
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label">指定产品ID</label>
                                <div class="layui-input-block">
                                    <div class="dis_flex_space">
                                    <div class="dis_flex mtb">
                                        <button type="button" class="layui-btn layui-btn-sm ebayAdchooseProduct">选择产品</button>
                                        <span>已选择<span class="listingIdNum"></span>个产品</span>
                                    </div>
                                    <div class="dis_flex mtb">
                                        <input type="number" name="patchRate" step="0.01" placeholder="" autocomplete="off" class="layui-input">
                                        <button type="button" class="layui-btn layui-btn-sm patchModifyRate">批量修改费率</button>
                                    </div>
                                </div>
                                    <div>
                                        <table class="layui-table createByProductTable">
                                            <thead>
                                                <tr>
                                                    <th><span class="layui-form item_id" data-id="all">
                                                        <input type="checkbox" name="all" lay-filter="all" lay-skin="primary">
                                                    </span></th>
                                                    <th>item_id</th>
                                                    <th>产品价格</th>
                                                    <th>广告费率</th>
                                                    <th>操作</th>
                                                </tr>
                                            </thead>
                                            <tbody> 
                                                <!-- #ebayAd_createByProductsTrTpl-->
                                            </tbody>
                                        </table>
                                    </div>
                                 <!-- <textarea name="listingIds" cols="30" rows="5" placeholder="多个产品使用逗号分隔" class="layui-textarea"></textarea> --> 
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </script> 
 
            <script type="text/html" id="ebayAd_categoryPriceTrTpl">
                <%--分类-价格设置--%>
                    <tr data-field="datarow">
                        <td>
                            <span class="cateName" data-id="{{data.cateId}}">{{data.cateName}}</span>
                        </td>
                        <td>
                            <div class="dis_flex">
                            <div class="layui-input-inline" style="width: 100px;">
                                <input type="number" name="minPrice" step="0.01" value="{{data.minPrice||''}}" placeholder="" autocomplete="off" class="layui-input">
                            </div>
                            <div class="layui-form-mid">-</div>
                            <div class="layui-input-inline" style="width: 100px;">
                                <input type="number" name="maxPrice" step="0.01" value="{{data.maxPrice||''}}" placeholder="" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        </td>
                        <td><select name="listingConditionIds">
                            <option value="">请选择</option>
                            {{ each data.productsTypeEnumData value i}}
                            {{ if data.listingConditionIds == value.id }}
                            <option value="{{value.id}}" selected>{{value.name}}</option>
                            {{else}}
                            <option value="{{value.id}}">{{value.name}}</option>
                            {{ /if}}
                            {{ /each}}
                        </select></td>
                        <td>
                            {{ if !data.isedit }}
                            <button type="button" class="layui-btn layui-btn-danger layui-btn-sm " onclick="javascript:$(this).parents('tr').remove();">移除</button>
                            {{ /if}}
                        </td>
                    </tr>
            </script> 

             <script type="text/html" id="ebayAd_createByProductsTrTpl">
                    <tr data-field="productrow">
                        <td style="text-align:center">
                            <span class="layui-form item_id" data-id="{{data.itemId}}">
                                <input type="checkbox" name="perrow" lay-filter="perrow" lay-skin="primary">
                            </span>
                        </td>
                        <td>
                            <div>{{data.itemId}}</div>
                        </td>
                        <td>
                            <div>{{data.currentPrice}}</div>
                        </td>                     
                        <td>
                            <div class="dis_flex">
                                <input type="number" class="layui-input" value="{{data.bidPercentage}}" name="itembidPercentage" min="1" max="100" lay-verify="required" placeholder="1~100">
                                <span>%</span>
                            </div>
                        </td>
                        <td>
                            <button type="button" class="layui-btn layui-btn-danger layui-btn-sm " onclick="removeThis($(this))">移除</button>
                        </td>
                    </tr>
            </script> 

            <!--促销商品选择分类弹框-->
             <script type="text/html" id="ep2_categoryTreeTpl">
                <form class="layui-form">
                    <div id="ep2_categoryTree" class="mg_50 ztree"></div>
                </form>
            </script> 

            <!--促销活动编辑框promotionStatus-->
             <script id="ebayAddvertisement_tableBar" type="text/html">
                <div class="dis_flex_start">
                    {{# if(d.campaignStatus=='SCHEDULED'||d.campaignStatus=='RUNNING'||d.campaignStatus=='PAUSED'||d.campaignStatus=='PENDING'){ }}
                    <button class="layui-btn layui-btn-xs layui-btn-normal mb_5" lay-event="ebayAd_edit">编辑</button>
                    <button class="layui-btn layui-btn-xs layui-btn-normal mb_5" lay-event="ebayAd_update">更新</button>
                    {{# } }}
                    {{# if(d.campaignStatus=='RUNNING'){ }}
                    <button class="layui-btn layui-btn-xs layui-btn-danger mb_5" lay-event="ebayAd_pause">暂停</button>
                    {{# } }}
                    {{# if(d.campaignStatus=='RUNNING'||d.campaignStatus=='PAUSED'){ }}
                    <button class="layui-btn layui-btn-xs layui-btn-danger mb_5" lay-event="ebayAd_stop">终止</button>
                    {{# } }}
                    {{# if(d.campaignStatus=='ENDED'||d.campaignStatus=='ENDING_SOON'){ }}
                    <button class="layui-btn layui-btn-xs layui-btn-danger mb_5" lay-event="ebayAd_delete">删除</button>
                    {{# } }}
                    {{# if(d.campaignStatus=='PAUSED'){ }}
                    <button class="layui-btn layui-btn-xs layui-btn-normal mb_5" lay-event="ebayAd_reback">恢复</button>
                    {{# } }}
                    {{# if(d.campaignStatus=='RUNNING'||d.campaignStatus=='ENDED'||d.campaignStatus=='ENDING_SOON'){ }}
                    <button class="layui-btn layui-btn-xs layui-btn-normal mb_5" lay-event="ebayAd_performance">表现</button>
                    {{# } }}
                    {{# if(d.campaignStatus=='RUNNING'||d.campaignStatus=='PAUSED'||d.campaignStatus=='ENDING_SOON'||d.campaignStatus=='ENDED'){ }}
                    <button class="layui-btn layui-btn-xs layui-btn-normal mb_5" lay-event="ebayAd_download">下载报告</button>
                    {{# } }}                 
                </div>
            </script> 

            <!-- 选择指定产品 -->
             <script type="text/html" id="pop_ebayAd_specificproduct">
                <div class="mg_50">
                    <form class="layui-form" id="ebayAd_searchOnlineProductForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label" id="ebayAd_producttypeSpan"></label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input ebayAd_chooseCategoryInput" id="ebayAd_chooseCategoryInput" placeholder="选择类目" readonly>
                                    <input type="hidden" id="ebayAd_chooseCategoryidInput" name="categoryids">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">价格</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" class="layui-input" name="currentPriceStart">
                                    <span class="middleLine">-</span>
                                    <input type="number" class="layui-input" name="currentPriceEnd">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">标题</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="title">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="skus" placeholder="支持多个精确查询">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">item_id</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="itemIds" placeholder="支持多个精确查询">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderType">
                                        <option value="1">在线数量降序</option>
                                        <option value="2">在线数量升序</option>
                                        <option value="3">产品价格升序</option>
                                        <option value="4">产品价格降序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">平台推荐</label>
                                <div class="layui-input-block">
                                    <select name="recommendType">
                                        <option value="1">是</option>
                                        <option value="0" selected>否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                <div class="fr">
                                    <button class="layui-btn layui-btn-sm" type="button" id="ebayAd_searchOnlineproducts">查询</button>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="isSelected" value="0">
                        <input type="hidden" name="page" value="1">
                        <input type="hidden" name="limit" value="50">
                    </form>
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <div class="layui-tab" lay-filter="" id="ebayAd_selectableproduct">
                                <div class="dis_flex">
                                    <ul class="layui-tab-title">
                                        <li class="layui-this" data-index="0">可选<span><span></li>
                            <li data-index="1">已选<span><span></li>
                        </ul>
                        <div>
                            <button class="layui-btn layui-btn-sm ml" type="button" id="ebayAd_batchremove">批量移除</button>
                            <button class="layui-btn layui-btn-sm" type="button" id="ebayAd_batchadd">批量添加</button>
                        </div>
                    </div>
                    <div class="layui-tab-content">
                        <div class="">
                            <table lay-filter="ebayAd_OnlineProductTable" class="layui-table" id="ebayAd_OnlineProductTable"></table>
                            <div id="ebayAd_chooseproduct"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script> 
 <script type="text/html" id="pop_ebayAdproductsTree">
    <div class="mg_50">
        <form class="layui-form">
            <div class="layui-form-item">
                <input type="radio" name="catetype" value="eBaycatrgories" title="eBay catrgories" lay-filter="catetype" checked>
                <input type="radio" name="catetype" value="Storecategories" title="Store categories" lay-filter="catetype" disabled>
            </div>
            <div id="ebayAd_productsTree" class="mg_50 ztree"></div>
        </form>
    </div>
</script> 
<script type="text/html" id="ebayAd_product_imageTpl">
    <div>
        <img width="60" height="60" data-original="{{d.firstImage}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>
<script type="text/html" id="ebayAd_product_time">
    <div style="text-align:left"><span>刊登：</span><span>{{Format(d.listingStartTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div style="text-align:left"><span>结束：</span><span>{{Format(d.listingEndTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
</script>
<script type="text/html" id="ebayAd_product_Option">
    {{# if(d.isSelected==="0"){ }}
    <button class="layui-btn layui-btn-sm" lay-event="addproducts">添加</button>{{# }else{ }}
    <button class="layui-btn layui-btn-primary layui-btn-sm" lay-event="removeproducts">移除</button>
    {{# }}}
</script>
<script type="text/html" id="ebayAd_product_currentPrice">
    <div><span>{{d.currentPrice}}</span><span>[{{d.currency}}]</span></div>
</script>
<script type="text/html" id="ebayAd_product_title">
    <div>{{d.title}}</div>
    <div><span class="gray">itemId:</span><span class="light-blue">{{d.itemId}}</span></div>
</script>


<!-- 表现 -->
<script type="text/html"  id="ebayAd_performance_tpl">
    <form class="layui-form" lay-filter="performace_form" id="performace_form">
        <div class="layui-form-item">
            <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">广告活动名称：</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="campaignName" placeholder="当前活动名称">
                </div>
            </div>
            <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">店铺：</label>
                <div class="layui-input-block">
                    <select  id="perfomance_store" name="storeAcctId" lay-filter="perfomance_store" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">周期：</label>
                <div class="layui-input-block">
                    <select name="timeCycle">
                        <option value="7">近7天</option>
                        <option value="14"> 近14天</option>
                        <option value="31"> 近31天</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-md3 layui-col-lg3">
                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal fr" lay-submit lay-filter="ebayAd_submitStaticData" id="ebayAd_submitStaticData">查询</button>
            </div>
        </div>
    </form>
    <div class="layui-form-item">
        <div class="layui-col-md12 layui-col-lg12" id="ebayAdperformance_title">
        </div>
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-tab bg_white" lay-filter="ebayAdperformance_Tab" id="ebayAdperformance_Tab">
                    <ul class="layui-tab-title">
                        <li data-index="impressions" class="layui-this">Impressions(<span>0</span>)</li>
                        <li data-index="clicks">Clicks(<span>0</span>)</li>
                        <li data-index="sold">Sold(<span>0</span>)</li>
                    </ul>
            </div>
        </div>
        <div id="ebayAd_performance_linechart" class="bg_whit" style="width: 100%;height: 700px;"></div>
    </div>
</script>

<!-- 表现标题 -->
<script type="text/html" id="ebayAdperformance_title_tpl">
    <ul class="dis_flex bg_white">
        {{ each data value i}}
        <li class="title_item">
            <div class="title_item_name">{{value.name}}</div>
            <div class="title_item_num">{{value.number}}</div>
        </li>
        {{ /each}}
    </ul>

</script> 
            <!--script-->
 <script src="/lms/static/js/publishs/ebay/ebayAd.js "></script>