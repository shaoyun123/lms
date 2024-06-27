<!--ebay V2促销页面-->
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <link rel="stylesheet" href="${ctx}/static/zTree/css/zTreeStyle/zTreeStyle.css" media="all">
            <title>ebay促销2.0</title>
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
                    margin-left: 10px;
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
                .mb_5{
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
                
                .chooseCategoryInput {
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
                
                .deleteIcon {
                    font-size: 32px;
                    line-height: 32px;
                    cursor: pointer;
                    color: gray
                }

                .dis_flex_start{
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
                
                .promotionProductBox .layui-table-view .layui-table {
                    width: 100%!important;
                }
                
                .promotionProductBox .layui-table {
                    width: 100%!important;
                }
                
                .promotionProductBox .layui-table table {
                    width: 100%!important;
                }
                
                .promotionProductBox .layui-table-header th div {
                    width: 100%!important;
                }
                /*默认5字符 TODO fix style */
                
                .orderDiscountType-item .layui-form-mid {
                    width: 6em;
                }
                #LAY-ebaypromotionV2 .layui-btn+.layui-btn{
                    margin-left:0px!important;
                }
            </style>
            <div class="layui-fluid" id="LAY-ebaypromotionV2">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="ep2_searchForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgId" lay-filter="ep_orgFilter" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">销售人员</label>
                                            <div class="layui-input-block">
                                                <select name="salePersonId" class="users_hp_custom" data-rolelist="ebay专员" lay-filter="ep2_sellerFilter" lay-search>
                                    </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="ep2_storeFilter" lay-search>
                                    </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-input-block">
                                                <button type="button" id="ep2_asyncStore" class="layui-btn layui-btn-normal layui-btn-sm" title="同步店铺促销">同步</button>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">促销名称</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="promotionName">
                                            </div>
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">促销类型</label>
                                            <div class="layui-input-block">
                                                <select name="promotionType">
                                        <option value="">请选择</option>
                                        <option value="MARKDOWN_SALE">Markdown</option>
                                        <option value="ORDER_DISCOUNT">Order discount</option>
                                        <option value="VOLUME_DISCOUNT">Volume discount</option>
                                    </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label label_select">开始时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="startTime" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label label_select">结束时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="endTime" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-input-block">
                                                <button type="button" class="layui-btn layui-btn-sm" lay-submit id="ep2_searchBtn" lay-filter="ep2_searchBtn">查询</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div></div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-tab" lay-filter="ep2_promotionStatusTab" id="ep2_promotionStatusTab">
                                    <div class="dis_flex_space">
                                        <ul class="layui-tab-title">
                                            <li data-index="DRAFT">draft(<span>0</span>)</li>
                                            <!--进行中-->
                                            <li class="layui-this" data-index="RUNNING">running(<span>0</span>)</li>
                                            <!--进行中-->
                                            <li data-index="PAUSED">paused(<span>0</span>)</li>
                                            <!--已暂停-->
                                            <li data-index="SCHEDULED">scheduled(<span>0</span>)</li>
                                            <!--未开始-->
                                            <li data-index="ENDED">ended(<span>0</span>)</li>
                                            <!--已结束-->
                                            <li data-index="DELETED">deleted(<span>0</span>)</li>
                                            <!--已删除-->
                                            <li data-index="ALL">全部(<span>0</span>)</li>
                                            <!--全部-->
                                        </ul>
                                        <form class="layui-form">
                                            <select lay-filter="createPromotion">
                                <option value="">新建促销</option>
                                <option value="MARKDOWN_SALE">创建Markdown</option>
                                <option value="ORDER_DISCOUNT">创建Order discount</option>
                                <option value="VOLUME_DISCOUNT">创建Volume discount</option>
                               </select>
                                        </form>
                                    </div>
                                    <div class="layui-tab-content">
                                        <div class="">
                                            <table lay-filter="ep2_table" class="layui-table" id="ep2_table"></table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--template-->
            <script type="text/html" id="ep2_editPromotionTpl">
                <!--促销弹框编辑页面-->
                <form class="layui-form mg_50" id="ep2_editPromotionForm" lay-filter="ep2_editPromotionForm">
                    <!--店铺信息，公共基本信息-->
                    <div class="layui-form-item promotion-common">
                        <!--隐藏域-->
                        <input type="hidden" name="id">
                        <input type="hidden" name="promotionStatus">
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">店铺</label>
                            <div class="layui-input-block">
                                <select name="storeAcctId" lay-verify="required" lay-search></select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">站点</label>
                            <div class="layui-input-block">
                                <select name="promotionMarketplaceId" lay-filter="promotionMarketplaceId" lay-verify="required" lay-search></select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">活动名称</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="promotionName" lay-verify="required">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6 descriptionItem">
                            <label class="layui-form-label">活动描述</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="promotionDescription" lay-verify="required">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">开始时间</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" readonly name="promotionStartTime" lay-verify="required">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">结束时间</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" readonly name="promotionEndTime" lay-verify="required">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">图片<br/>(仅一张)</label>
                            <div class="layui-input-block dis_flex_space">
                                <div class="imgpre" id="ep2_promotionImgShow"></div>
                                <div>
                                    <input type="hidden" name="promotionImageUrl" lay-verify="required">
                                    <button id="ep2_localImgUpload" class="layui-btn layui-btn-sm" type="button">本地图片</button>
                                    <button id="ep2_onlineImgUpload" class="layui-btn layui-btn-sm" type="button">网络图片</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <%--优先级 orderDiscount用--%>
                        <div class="layui-form-item" style="display: none;">
                            <div class="layui-col-md8 layui-col-lg8">
                                <label class="layui-form-label">优先级</label>
                                <div class="layui-input-block">
                                    <select name="priority" lay-search>
                        <option value="PRIORITY_1" selected>1</option>
                        <option value="PRIORITY_2">2</option>
                        <option value="PRIORITY_3">3</option>
                        <option value="PRIORITY_4">4</option>
                    </select>
                                </div>
                            </div>
                        </div>
                        <!--促销类型-->
                        <div class="layui-form-item promotion-type">
                            <div class="layui-col-md8 layui-col-lg8">
                                <label class="layui-form-label">促销类型</label>
                                <div class="layui-input-block">
                                    <!-- TODO #ep2_promotionType**Tpl-->
                                </div>
                            </div>
                        </div>
                        <!--促销产品-->
                        <div class="layui-form-item promotion-product">
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label">促销产品</label>
                                <div class="layui-input-block">
                                    <div class="promotionProductBox">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <select name="inventoryCriterionType" lay-filter="inventoryCriterionType" class="w_50">
                                <option value="INVENTORY_ANY">全部</option>
                                <option value="INVENTORY_BY_RULE">跟据规则获取</option>
                                <option value="INVENTORY_BY_VALUE">指定产品</option>
                            </select>
                                        </div>
                                        <div class="layui-col-md10 layui-col-lg10" style="padding: 10px 0;">
                                            <div class="layui-collapse ruleCriteria" lay-filter="ruleCriteria">
                                                <!--TODO #ep2_promotionProductItemTpl-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--促销其他设置, markdown 特有-->
                        <div class="layui-form-item promotion-other" style="display: none">
                            <div class="layui-col-md8 layui-col-lg8">
                                <label class="layui-form-label">其他设置</label>
                                <div class="layui-input-block">
                                    <div><input type="checkbox" name="autoSelectFutureInventory" lay-skin="primary" value="true" title="当满足条件时，被跳过的产品自动进入活动"></div>
                                    <div><input type="checkbox" name="blockPriceIncreaseInItemRevision" lay-skin="primary" value="true" title="加入活动的产品不允许修改产品价格"></div>
                                </div>
                            </div>
                        </div>
                        <button style="display: none" lay-submit="" id="ep2_markdownsubmit" lay-filter="ep2_markdownsubmit"></button>
                </form>
            </script>
            <!--MARKDOWN_SALE 促销设置-->
            <script type="text/html" id="ep2_promotionTypeMarkdownSaleTpl">
                <!--按百分比降价-->
                <div class="discountType dis_flex_space">
                    <div class="layui-col-md9 layui-col-lg9 dis_flex_space">
                        <input type="radio" checked name="discountBenefit" value="percentageOffItem" title="按百分比降价" lay-filter="markdownSaleDiscountBenefit">
                        <div class="discountTypeBox">
                            <div class="w_250 percentageOffItemDiv">
                                <label class="layui-form-label">每个产品减</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" data-id="" name="percentageOffItem" value="10" min="5" max="80" class="layui-input">
                                    <span style="margin:0 10px;line-height:32px">%</span>
                                    <span class="deleteIcon">×</span>
                                </div>
                            </div>
                        </div>
                        <div class="discountTypeBox"><button class="layui-btn layui-btn-sm" type="button" id="ep2_addPercentDiscountBtn">添加折扣梯度</button></div>
                    </div>
                </div>
                <!--按金额降价-->
                <div class="discountType dis_flex_space">
                    <div class="layui-col-md9 layui-col-lg9 dis_flex_space">
                        <input type="radio" name="discountBenefit" value="amountOffItem" title="按金额降价" min="0" lay-filter="markdownSaleDiscountBenefit">
                        <div class="w_250 discountTypeBox" style="display: none;">
                            <label class="layui-form-label">每个产品减</label>
                            <div class="layui-input-block dis_flex_space">
                                <input type="number" name="amountOffItem" data-id="" class="layui-input" min="5" max="80" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                            </div>
                        </div>
                    </div>
                </div>
                <!--是否免第一运费-->
                <input type="checkbox" name="applyFreeShipping" lay-skin="primary" value="true" title="免第一运费">
            </script>
            <!--VOLUME_DISCOUNT促销设置-->
            <script type="text/html" id="ep2_promotionTypeVolumeDiscountTpl">
                <div class="dis_flex lh_38" style="display: none;">
                    <span>买1个，不打折</span>
                    <input type="number" data-quantity="1" name="percentageOffOrder" value="0" min="0" max="80" readonly class="layui-input w50 mlr_5" lay-verify="percent">
                    <span>%</span>
                </div>
                <div class="dis_flex lh_38">
                    <span>买2或2个以上，每个减</span>
                    <input type="number" data-quantity="2" name="percentageOffOrder" value="0" min="0" max="80" class="layui-input w50 mlr_5" lay-verify="percent">
                    <span>%</span>
                </div>
                <div class="dis_flex lh_38">
                    <span>买3或3个以上，每个减</span>
                    <input type="number" data-quantity="3" name="percentageOffOrder" value="0" min="0" max="80" class="layui-input w50 mlr_5" lay-verify="percent">
                    <span>%</span>
                </div>
                <div class="dis_flex lh_38">
                    <span>买4或4个以上，每个减</span>
                    <input type="number" data-quantity="4" name="percentageOffOrder" value="0" min="0" max="80" class="layui-input w50 mlr_5" lay-verify="percent">
                    <span>%</span>
                </div>
                <div>
                    <input type="checkbox" name="applyDiscountToSingleItemOnly" lay-skin="primary" title="仅对相同的Item的产品生效">
                </div>
            </script>


            <!--ORDER_DISCOUNT促销设置-->
            <script type="text/html" id="ep2_promotionTypeOrderDiscountTpl">
                <!--优惠方式-->
                <div class="layui-col-md12 layui-col-lg12">
                    <input type="radio" name="orderDiscountRuleType" lay-filter="orderDiscountRuleType" value="amount" title="按金额" checked>
                    <input type="radio" name="orderDiscountRuleType" lay-filter="orderDiscountRuleType" value="quantity" title="按数量">
                    <input type="radio" name="orderDiscountRuleType" lay-filter="orderDiscountRuleType" value="buyOneGetOne" title="买一赠一">
                    <input type="radio" name="orderDiscountRuleType" lay-filter="orderDiscountRuleType" value="any" title="无门槛优惠">
                </div>
                <hr>
                <!--促销优惠方式切换div  注意item顺序和数据绑定-->
                <div class="layui-row">
                    <!--按金额-->
                    <div class="orderDiscountType-amount">
                        <%--满+减--%>
                            <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                <div class="" style="float: left">
                                    <input type="radio" name="orderDiscountType" value="">
                                </div>
                                <div class="layui-form-mid">满</div>
                                <div class="layui-input-inline" style="width: 100px;">
                                    <select name="minAmount" lay-search></select>
                                </div>
                                <div class="layui-form-mid">减</div>
                                <div class="layui-input-inline" style="width: 100px;">
                                    <select name="amountOffOrder" lay-search></select>
                                </div>
                            </div>
                            <%--满+折扣--%>
                                <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                    <div class="" style="float: left">
                                        <input type="radio" name="orderDiscountType" value="">
                                    </div>
                                    <div class="layui-form-mid">满</div>
                                    <div class="layui-input-inline" style="width: 100px;">
                                        <select name="minAmount" lay-search></select>
                                    </div>
                                    <div class="layui-form-mid">减</div>
                                    <div class="layui-input-inline" style="width: 100px;">
                                        <select name="percentageOffOrder" lay-search></select>
                                    </div>
                                    <div class="layui-form-mid">%</div>
                                </div>
                                <%--每满+减--%>
                                    <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                        <div class="" style="float: left">
                                            <input type="radio" name="orderDiscountType" value="">
                                        </div>
                                        <div class="layui-form-mid">每满</div>
                                        <div class="layui-input-inline" style="width: 100px;">
                                            <select lay-search name="forEachAmount"></select>
                                        </div>
                                        <div class="layui-form-mid">减</div>
                                        <div class="layui-input-inline" style="width: 100px;">
                                            <select name="amountOffOrder" lay-search></select>
                                        </div>
                                    </div>
                    </div>
                    <!--按数量-->
                    <div class="orderDiscountType-quantity" style="display: none">
                        <%--买+减--%>
                            <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                <div class="" style="float: left">
                                    <input type="radio" name="orderDiscountType" value="">
                                </div>
                                <div class="layui-form-mid">买</div>
                                <div class="layui-input-inline" style="width: 100px;">
                                    <select name="minQuantity" lay-search></select>
                                </div>
                                <div class="layui-form-mid">减</div>
                                <div class="layui-input-inline" style="width: 100px;">
                                    <select name="amountOffOrder" lay-search></select>
                                </div>
                            </div>
                            <%--买+折扣--%>
                                <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                    <div class="" style="float: left">
                                        <input type="radio" name="orderDiscountType" value="">
                                    </div>
                                    <div class="layui-form-mid">买</div>
                                    <div class="layui-input-inline" style="width: 100px;">
                                        <select name="minQuantity" lay-search></select>
                                    </div>
                                    <div class="layui-form-mid">减</div>
                                    <div class="layui-input-inline" style="width: 100px;">
                                        <select name="percentageOffOrder" lay-search></select>
                                    </div>
                                    <div class="layui-form-mid">%</div>
                                </div>
                                <%--每买+减--%>
                                    <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                        <div class="" style="float: left">
                                            <input type="radio" name="orderDiscountType" value="">
                                        </div>
                                        <div class="layui-form-mid">每买</div>
                                        <div class="layui-input-inline" style="width: 100px;">
                                            <select lay-search name="forEachQuantity"></select>
                                        </div>
                                        <div class="layui-form-mid">减</div>
                                        <div class="layui-input-inline" style="width: 100px;">
                                            <select name="amountOffOrder" lay-search></select>
                                        </div>
                                    </div>
                    </div>
                    <!--买一赠一-->
                    <div class="orderDiscountType-buyOneGetOne" style="display: none">
                        <%--每买+赠--%>
                            <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                <div class="" style="float: left">
                                    <input type="radio" name="orderDiscountType" value="">
                                </div>
                                <div class="layui-form-mid">每买</div>
                                <div class="layui-input-inline" style="width: 100px;">
                                    <select lay-search name="forEachQuantity"></select>
                                </div>
                                <div class="layui-form-mid">个,赠</div>
                                <div class="layui-input-inline" style="width: 100px;">
                                    <select name="numberOfDiscountedItems" lay-search></select>
                                </div>
                                <div class="layui-form-mid">个</div>
                            </div>
                            <%--每买+获得+优惠--%>
                                <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                    <div class="" style="float: left">
                                        <input type="radio" name="orderDiscountType" value="">
                                    </div>
                                    <div class="layui-form-mid">每买</div>
                                    <div class="layui-input-inline" style="width: 100px;">
                                        <select lay-search name="forEachQuantity"></select>
                                    </div>
                                    <div class="layui-form-mid">个,获得</div>
                                    <div class="layui-input-inline" style="width: 100px;">
                                        <select name="numberOfDiscountedItems" lay-search></select>
                                    </div>
                                    <div class="layui-form-mid">个优惠</div>
                                    <div class="layui-input-inline" style="width: 100px;">
                                        <select name="percentageOffItem" lay-search></select>
                                    </div>
                                    <div class="layui-form-mid">%</div>
                                </div>
                                <%--买+赠--%>
                                    <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                        <div class="" style="float: left">
                                            <input type="radio" name="orderDiscountType" value="">
                                        </div>
                                        <div class="layui-form-mid">买</div>
                                        <div class="layui-input-inline" style="width: 100px;">
                                            <select lay-search name="minQuantity"></select>
                                        </div>
                                        <div class="layui-form-mid">个,赠</div>
                                        <div class="layui-input-inline" style="width: 100px;">
                                            <select name="numberOfDiscountedItems" lay-search></select>
                                        </div>
                                        <div class="layui-form-mid">个（仅一次）</div>
                                    </div>
                                    <%--买+获得+优惠--%>
                                        <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                            <div class="" style="float: left">
                                                <input type="radio" name="orderDiscountType" value="">
                                            </div>
                                            <div class="layui-form-mid">买</div>
                                            <div class="layui-input-inline" style="width: 100px;">
                                                <select lay-search name="minQuantity"></select>
                                            </div>
                                            <div class="layui-form-mid">个,获得</div>
                                            <div class="layui-input-inline" style="width: 100px;">
                                                <select name="numberOfDiscountedItems" lay-search></select>
                                            </div>
                                            <div class="layui-form-mid">个优惠</div>
                                            <div class="layui-input-inline" style="width: 100px;">
                                                <select name="percentageOffItem" lay-search></select>
                                            </div>
                                            <div class="layui-form-mid">%（仅一次）</div>
                                        </div>
                    </div>
                    <%--无门槛优惠--%>
                        <div class="orderDiscountType-any" style="display: none">
                            <%--下单立减金额（买1减金额）--%>
                                <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                    <div class="" style="float: left">
                                        <input type="radio" name="orderDiscountType" value="">
                                    </div>
                                    <div class="layui-form-mid">下单立减</div>
                                    <div class="layui-input-inline" style="width: 100px;">
                                        <select name="amountOffOrder" lay-search></select>
                                    </div>
                                </div>
                                <%--下单立减折扣（买1优惠折扣）--%>
                                    <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                        <div class="" style="float: left">
                                            <input type="radio" name="orderDiscountType" value="">
                                        </div>
                                        <div class="layui-form-mid">下单立减</div>
                                        <div class="layui-input-inline" style="width: 100px;">
                                            <select name="percentageOffOrder" lay-search></select>
                                        </div>
                                        <div class="layui-form-mid">%</div>
                                    </div>
                                    <%--每个产品减（每1减金额）--%>
                                        <div class="layui-col-md12 layui-col-lg12 orderDiscountType-item">
                                            <div class="" style="float: left">
                                                <input type="radio" name="orderDiscountType" value="">
                                            </div>
                                            <div class="layui-form-mid">每个产品减</div>
                                            <div class="layui-input-inline" style="width: 100px;">
                                                <select name="amountOffItem" lay-search></select>
                                            </div>
                                        </div>
                        </div>
                </div>
            </script>

            <script type="text/html" id="ep2_promotionProductItemTpl">
                <!--每一项促销产品-->
                <div class="layui-colla-item">
                    <!--折扣梯度名称-->
                    <h2 class="layui-colla-title">
                        <span>促销规则</span>
                    </h2>
                    <div class="layui-colla-content layui-show">
                        <!--全部商品 可以做排除-->
                        <!--按据规则获取-->
                        <div class="layui-row inventoryByRule" style="display: none">
                            <div class="layui-col-md12 layui-col-lg12 epV2_inventoryByRule">
                                <label class="layui-form-label">分类条件</label>
                                <div class="dis_flex_space layui-input-block">
                                    <select name="categoryScope">
                            <option value="MARKETPLACE">产品分类</option>
                            <option value="STORE">店铺分类(不要选)</option>
                        </select>
                                    <button type="button" class="layui-btn layui-btn-sm categoryChoose">选择分类</button>
                                </div>
                                <div class="dis_flex_space layui-input-block">
                                    <table class="layui-table categoryRuleTable">
                                        <thead>
                                            <tr>
                                                <th>分类名</th>
                                                <th>价格筛选</th>
                                                <th>物品状况</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- #ep2_categoryPriceTrTpl-->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label">排除产品</label>
                                <div class="layui-input-block">
                                    <select name="excludeListingType">
                                        <option value="excludeInventoryItems">店铺SKU</option>
                                        <option value="excludeListingIds">产品ID</option>
                        </select>
                                    <input type="text" name="excludeValue" class="layui-input mtb" placeholder="多个使用逗号分隔">
                                </div>
                            </div>
                        </div>
                        <!--指定产品-->
                        <div class="layui-row inventoryByValue" style="display: none">
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label">指定产品ID</label>
                                <div class="layui-input-block">
                                    <div class="dis_flex mtb">
                                        <button type="button" class="layui-btn layui-btn-sm chooseProduct">选择产品</button>
                                        <span>已选择<span class="listingIdNum"></span>个产品</span>
                                    </div>
                                    <textarea name="listingIds" cols="30" rows="5" placeholder="多个产品使用逗号分隔" class="layui-textarea"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </script>

            <script type="text/html" id="ep2_categoryPriceTrTpl">
                <%--分类-价格设置--%>
                    <tr>
                        <td>
                            <span class="cateName" data-id="">分类名称</span>
                        </td>
                        <td>
                            <div class="layui-input-inline" style="width: 100px;">
                                <input type="number" name="minPrice" step="0.01" placeholder="" autocomplete="off" class="layui-input">
                            </div>
                            <div class="layui-form-mid">-</div>
                            <div class="layui-input-inline" style="width: 100px;">
                                <input type="number" name="maxPrice" step="0.01" placeholder="" autocomplete="off" class="layui-input">
                            </div>
                        </td>
                        <td><span title="此处为固定值">不限</span></td>
                        <td>
                            <button type="button" class="layui-btn layui-btn-danger layui-btn-sm " onclick="javascript:$(this).parents('tr').remove()">移除</button>
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
            <script id="ep2_tableBar" type="text/html">
                <div class="dis_flex_start">
                <button class="layui-btn layui-btn-xs opt_draft opt_running opt_paused opt_scheduled mb_5" lay-event="ep2_edit">编辑</button>
                {{# if(d.promotionType == "ORDER_DISCOUNT" || d.promotionType == "VOLUME_DISCOUNT"){ }}
                <button class="layui-btn layui-btn-xs layui-btn-warm opt_running mb_5" lay-event="ep2_pause">暂停</button>
                <button class="layui-btn layui-btn-xs layui-btn-normal opt_paused mb_5" lay-event="ep2_run">恢复</button>
                {{# }}}
                <button class="layui-btn layui-btn-xs layui-btn-normal opt_running opt_paused opt_ended mb_5" lay-event="ep2_sync">同步商品</button>
                <button class="layui-btn layui-btn-xs layui-btn-danger opt_draft opt_paused opt_scheduled opt_ended mb_5" lay-event="ep2_delete">删除</button>
                <button class="layui-btn layui-btn-xs layui-btn-normal opt_draft opt_running opt_paused opt_scheduled opt_ended mb_5" lay-event="ep2_copy">copy</button>
                </div>
            </script>


            <!-- 上传网络图片 -->
            <script type="text/html" id="ep2_uploadOnline">
                <form class="layui-form">
                    <div class="mg_50">
                        <label class="layui-form-label">网络图片地址</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" required lay-verify="required">
                        </div>
                    </div>
                    <button id="ep2_submitImgurl" type="button" class="hide" lay-submit=""></button>
                </form>
            </script>

            <!-- 选择指定产品 -->
            <script type="text/html" id="pop_specificproduct">
                <div class="mg_50">
                    <form class="layui-form" id="searchOnlineProductForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md5 layui-col-lg5 dis_flex">
                                <input type="text" class="layui-input chooseCategoryInput w_70" id="chooseCategoryInput" placeholder="选择类目" readonly>
                                <input type="hidden" id="chooseCategoryidInput" name="categoryids">
                                <span class="mlr_5 lh_38" id="producttypeSpan"></span>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">价格</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" class="layui-input" name="currentPriceStart">
                                    <span class="middleLine">-</span>
                                    <input type="number" class="layui-input" name="currentPriceEnd">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">标题</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="title">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="fr">
                                    <button class="layui-btn layui-btn-sm" type="button" id="searchOnlineproducts">查询</button>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="isSelected" value="0">
                        <input type="hidden" name="page" value="1">
                        <input type="hidden" name="limit" value="50">
                    </form>
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <div class="layui-tab" lay-filter="" id="selectableproduct">
                                <div class="dis_flex">
                                    <ul class="layui-tab-title">
                                        <li class="layui-this" data-index="0">可选<span><span></li>
                            <li data-index="1">已选<span><span></li>
                        </ul>
                        <div>
                            <button class="layui-btn layui-btn-sm ml" type="button" id="ebaypromotion2_batchremove">批量移除</button>
                            <button class="layui-btn layui-btn-sm" type="button" id="ebaypromotion2_batchadd">批量添加</button>
                        </div>
                    </div>
                    <div class="layui-tab-content">
                        <div class="">
                            <table lay-filter="ebayPromotion2OnlineProductTable" class="layui-table" id="ebayPromotion2OnlineProductTable"></table>
                            <div id="ebaypromotion2chooseproduct"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="pop_productsTree">
    <div class="mg_50">
        <form class="layui-form">
            <div class="layui-form-item">
                <input type="radio" name="catetype" value="eBay catrgories" title="eBay catrgories" lay-filter="catetype" checked>
                <input type="radio" name="catetype" value="Store categories" title="Store categories" lay-filter="catetype" disabled>
                <input type="radio" name="catetype" value="All Inventory" title="All Inventory" lay-filter="catetype">
            </div>
            <div id="productsTree" class="mg_50 ztree"></div>
        </form>
    </div>
</script>

<!-- 表格模板 -->
<script type="text/html" id="ebaypromotion2_product_imageTpl">
    <div>
        <img width="60" height="60" data-original="{{d.firstImage}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<script type="text/html" id="ebaypromotion2_product_Option">
    {{# if(d.isSelected==="0"){ }}
    <button class="layui-btn layui-btn-sm" lay-event="addproducts">添加</button>{{# }else{ }}
    <button class="layui-btn layui-btn-primary layui-btn-sm" lay-event="removeproducts">移除</button>
    {{# }}}
</script>

<script type="text/html" id="ebaypromotion2_product_time">
    <div style="text-align:left"><span>刊登：</span><span>{{Format(d.listingStartTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                                <div style="text-align:left"><span>结束：</span><span>{{Format(d.listingEndTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
            </script>
            <!--script-->
            <script src="/lms/static/js/publishs/ebay/ebayPromotionV2.js "></script>