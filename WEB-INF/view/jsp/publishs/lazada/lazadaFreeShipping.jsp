<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2021/9/17
  Time: 17:36
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>lazada包邮</title>
</head>
<style>
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .redStar:before {
        content: "*";
        color: red;
        font-size: 20px;
        padding: 5px;
    }

    #lazadaFreeShipping .layui-form-label {
        width: 100px;
    }

    #lazadaFreeShipping .layui-input-block {
        margin-left: 130px;
    }
</style>
<body>
<div class="layui-fluid" id="lazadaFreeShipping">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lazadaFreeShippingSearchForm">
                        <div class="layui-form-item">
                            <!-- 站点和属性的select的id和name自己搞定 -->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="lazadaFreeShippingOrgId" name="orgId"
                                            lay-filter="lazadaFreeShippingOrgId"
                                            class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="lazadaFreeShippingSalesPersonId" name="salesPersonIds"
                                            lay-filter="lazadaFreeShippingSalesPersonId" class="users_hp_custom"
                                            data-rolelist="lazada专员" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="lazadaFreeShippingStoreAcctIdList" name="storeAcctIds"
                                            lay-filter="lazadaFreeShippingStoreAcctIdList"
                                            xm-select="lazadaFreeShippingStoreAcctIdList" class="users_hp_store_multi"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            data-platcode="lazada"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select id="lazadaFreeShippingSiteIdList" name="salesSite"
                                            xm-select="lazadaFreeShippingSiteIdList"
                                            class="lazadaFreeShippingSiteIdList"
                                            xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">剩余预算</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="startBudget" type="number" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input class="layui-input" name="endBudget" type="number" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动名称</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="promotionName" placeholder="模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动ID</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="activityId" placeholder="精确查询">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动时间类型</label>
                                <div class="layui-input-block">
                                    <select name="periodType">
                                        <option value="">全部</option>
                                        <option value="LONG_TERM">长期有效</option>
                                        <option value="SPECIAL_PERIOD">特定时间有效</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">活动结束时间</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" readonly id="lazadaFreeShippingEndTime"
                                           name="lazadaFreeShippingEndTime" placeholder="请选择">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动预算</label>
                                <div class="layui-input-block">
                                    <select name="budgetType">
                                        <option value="">全部</option>
                                        <option value="UNLIMITED_BUDGET">无预算上限</option>
                                        <option value="LIMITED_BUDGET">有限预算</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动状态</label>
                                <div class="layui-input-block">
                                    <select name="activityStatus">
                                        <option value="">全部</option>
                                        <option value="NOT_START">未开始</option>
                                        <option value="ONGOING">进行中</option>
                                        <option value="SUSPEND">暂停中</option>
                                        <option value="FINISH">已过期</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">适用范围</label>
                                <div class="layui-input-block">
                                    <select name="apply">
                                        <option value="">全部</option>
                                        <option value="ENTIRE_SHOP">全部商品</option>
                                        <option value="SPECIFIC_PRODUCTS">部分商品</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">适用地区</label>
                                <div class="layui-input-block">
                                    <select name="regionType">
                                        <option value="">全部</option>
                                        <option value="ALL_REGIONS">全部地区</option>
                                        <option value="SPECIAL_REGIONS">部分地区</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderByActivityId">
                                        <option value="true" selected>按活动ID正序</option>
                                        <option value="false">按活动ID倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动门槛</label>
                                <div class="layui-input-block">
                                    <select name="dealCriteria">
                                        <option value="">全部</option>
                                        <option value="MONEY_VALUE_FROM_X">订单金额达到门槛</option>
                                        <option value="ITEM_QUANTITY_FROM_X">满件</option>
                                        <option value="NO_CONDITION">无门槛</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                    <a type="button" class="layui-btn layui-btn-sm" id="lazadaFreeShippingSearch">查询</a>
                                    <a type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                       id="lazadaFreeShippingReset">清空</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card p10" id="lazadaFreeShippingCard">
                <div class="layui-card-body">
                    <div class="layui-card-header">
                        <form class="layui-form dis_flex">
                            <select lay-filter="lazadaFreeShippingBatchOnOrOff">
                                <option value="on">批量启用</option>
                                <option value="off">批量停用</option>
                            </select>
                            <a class="layui-btn" id="lazadaFreeShippingCreatTemplate">创建包邮活动</a>
                        </form>
                    </div>
                    <!-- 表格你自己渲染 -->
                    <table class="layui-table" id="lazadaFreeShippingTable"
                           lay-filter="lazadaFreeShippingTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<!-- 操作按钮-->
<script type="text/html" id="lazadaFreeShippingOperateTpl">
    <%--未开始|进行中--%>
    {{# if(d.activityStatus == "NOT_START" || d.activityStatus == "ONGOING"){ }}
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="off">暂停</a><br>
    <%--暂停中--%>
    {{# }else if(d.activityStatus == "SUSPEND") { }}
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="on">开启</a><br>
    <%--已过期--%>
    {{# }else if(d.activityStatus == "FINISH") { }}
    <%--仅支持查看--%>
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    {{# } }}
</script>

<!-- 新增&编辑包邮 -->
<script type="text/html" id="lazadaFreeShippingLayerCreatAndEdit">
    <div id="lazadaFreeShippingView"></div>
</script>

<script type="text/html" id="lazadaFreeShippingDemo">
    <%--<!--新增弹框-->--%>
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-col-lg12 layui-col-md12">
                <form action="" class="layui-form" id="lazadaFreeShippingDemoForm">
                    <input type="hidden" id="lazadaFreeShippingCurrency" value="{{d.currency||''}}">
                    {{# if(!d.id){ }}
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">站点</label>
                        <div class="layui-input-block">
                            <select name="salesSite" id="lazadaFreeShippingSalesSite"
                                    lay-filter="lazadaFreeShippingSalesSite"
                                    lay-verify="required"></select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">店铺</label>
                        <div class="layui-input-block">
                            <select name="storeAcctIds" id="lazadaFreeShippingStoreIdList" lay-verify="required"
                                    xm-select="lazadaFreeShippingStoreIdList"
                                    xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                        </div>
                    </div>
                    {{# }else{ }}
                    <input type="hidden" name="id" value="{{d.id||''}}">
                    <input type="hidden" name="salesSite" value="{{d.salesSite||''}}">
                    <input type="hidden" name="storeAcctIds" value="{{d.storeAcctId||''}}">
                    {{# } }}
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">活动名称</label>
                        <div class="layui-input-block dis_flex">
                            <input class="layui-input" name="promotionName" value="{{d.promotionName||''}}"
                                   placeholder="100个字符以内"
                                   lay-verify="required" {{d.activityStatus== "ONGOING"&&"readonly"}}  oninput="LFSPromotionName()" onpropertychange="LFSPromotionName()" maxlength="100">
                            <div class="layui-form-mid layui-word-aux w100 lazadaFSpromotionName">
                                <span>0</span>/100
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">活动时间</label>
                        <div class="layui-input-block">
                            {{# if(d.activityStatus == "ONGOING"){ }}
                            <input lay-verify="required" type="radio" name="periodType" value="LONG_TERM"
                                   title="长期有效" {{d.periodType=='LONG_TERM'&&'checked'}}
                                   {{d.periodType=='SPECIAL_PERIOD'&&'disabled'}}>
                            <input lay-verify="required" type="radio" name="periodType" value="SPECIAL_PERIOD"
                                   title="特定时间有效" {{d.periodType=='SPECIAL_PERIOD'&&'checked'}}
                                   {{d.periodType=='LONG_TERM'&&'disabled'}}>
                            {{# }else{ }}
                            <input lay-verify="required" type="radio" name="periodType" value="LONG_TERM"
                                   title="长期有效" lay-filter="lazadaFreeshippingTime"
                                   {{d.periodType=='LONG_TERM'&&'checked'}}>
                            <input lay-verify="required" type="radio" name="periodType" value="SPECIAL_PERIOD"
                                   title="特定时间有效" lay-filter="lazadaFreeshippingTime"
                                   {{d.periodType=='SPECIAL_PERIOD'&&'checked'}}>
                            {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item lazadaFreeshippingTimeHide hidden">
                        <label class="layui-form-label"></label>
                        <div class="layui-input-block">
                            <%--<input value="{{d.lazadaFreeShippingPeriodTime||''}}">--%>
                            {{# if(d.activityStatus == "ONGOING"){ }}
                            <input class="layui-input" readonly name="lazadaFreeShippingPeriodTime"
                                   value="{{d.lazadaFreeShippingPeriodTime||''}}">
                            {{# }else{ }}
                            <input class="layui-input" readonly name="lazadaFreeShippingPeriodTime"
                                   id="lazadaFreeShippingPeriodTime" value="{{d.lazadaFreeShippingPeriodTime||''}}">
                            {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">活动预算</label>
                        <div class="layui-input-block dis_flex">
                            <div>
                                <%--未开始--%>
                                {{# if(d.activityStatus == "NOT_START"||d.activityStatus == "ONGOING"){ }}
                                <input lay-verify="required" type="radio" name="budgetType" value="UNLIMITED_BUDGET"
                                       title="无预算上限" {{d.budgetType=='UNLIMITED_BUDGET'&&'checked'}}
                                       {{d.budgetType=='LIMITED_BUDGET' && 'disabled'}}
                                >
                                <input lay-verify="required" type="radio" name="budgetType" value="LIMITED_BUDGET"
                                       title="有限预算" {{d.budgetType=='LIMITED_BUDGET'&&'checked'}}
                                       {{d.budgetType=='UNLIMITED_BUDGET' && 'disabled'}}>
                                {{# }else{ }}
                                <input lay-verify="required" type="radio" name="budgetType" value="UNLIMITED_BUDGET"
                                       title="无预算上限" lay-filter="lazadaFreeshippingBudget"
                                       {{d.budgetType=='UNLIMITED_BUDGET'&&'checked'}}
                                >
                                <input lay-verify="required" type="radio" name="budgetType" value="LIMITED_BUDGET"
                                       title="有限预算" lay-filter="lazadaFreeshippingBudget"
                                       {{d.budgetType=='LIMITED_BUDGET'&&'checked'}}
                                       {{d.budgetType=='UNLIMITED_BUDGET' && 'disabled'}}>
                                {{# } }}
                            </div>
                            <div class="lazadaFreeshippingBudgetHide hidden">
                                <div class="dis_flex">
                                    <input class="layui-input" type="text" name="budgetValue"
                                           value="{{d.budgetValue||''}}" onkeyup="if(this.value && ! /^[0-9]+(.[0-9]{0,2})?$/.test(this.value)){alert('只能输入数字，小数点后只能保留两位');this.value='';}">
                                    <div class="layui-form-mid layui-word-aux w100 lazadaFScurrency">
                                        {{d.currency||''}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">优惠门槛</label>
                        <div class="layui-input-block">
                            <%--进行中--%>
                            {{# if(d.activityStatus == "ONGOING"){ }}
                            <input lay-verify="required" type="radio" name="dealCriteria"
                                   {{d.dealCriteria!='ITEM_QUANTITY_FROM_X' && 'disabled'}}
                            {{d.dealCriteria=='ITEM_QUANTITY_FROM_X'&&'checked'}}
                            value="ITEM_QUANTITY_FROM_X"
                            title="满件">
                            <input lay-verify="required" type="radio" name="dealCriteria"
                                   {{d.dealCriteria!='MONEY_VALUE_FROM_X' &&'disabled'}}
                            {{d.dealCriteria=='MONEY_VALUE_FROM_X'&&'checked'}}
                            value="MONEY_VALUE_FROM_X" title="订单金额达到门槛">
                            <input lay-verify="required" type="radio" name="dealCriteria"
                                   {{d.dealCriteria!='NO_CONDITION' &&'disabled'}}
                            {{d.dealCriteria=='NO_CONDITION'&&'checked'}}
                            value="NO_CONDITION" title="无门槛">
                            {{# }else{ }}
                            <input lay-verify="required" type="radio" name="dealCriteria"
                                   lay-filter="dealCriteriaFilter"
                                   {{d.dealCriteria=='ITEM_QUANTITY_FROM_X'&&'checked'}}
                                   value="ITEM_QUANTITY_FROM_X"
                                   title="满件">
                            <input lay-verify="required" type="radio" name="dealCriteria"
                                   lay-filter="dealCriteriaFilter"
                                   {{d.dealCriteria=='MONEY_VALUE_FROM_X'&&'checked'}}
                                   value="MONEY_VALUE_FROM_X" title="订单金额达到门槛">
                            <input lay-verify="required" type="radio" name="dealCriteria"
                                   lay-filter="dealCriteriaFilter"
                                   {{d.dealCriteria=='NO_CONDITION'&&'checked'}}
                                   value="NO_CONDITION" title="无门槛">
                            {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">优惠类型</label>
                        <div class="layui-input-block">
                            <%--进行中--%>
                            {{# if(d.activityStatus == "ONGOING"){ }}
                            <input lay-verify="required" type="radio" name="discountType"
                                   value="FULL_SUBSIDY"
                                   {{d.discountType=='PARTIAL_SUBSIDY'&&'disabled'}}
                                   {{d.discountType=='FULL_SUBSIDY'&&'checked'}} title="全部包邮">
                            <input lay-verify="required" type="radio" name="discountType"
                                   value="PARTIAL_SUBSIDY"
                                   {{d.discountType=='FULL_SUBSIDY'&&'disabled'}}
                                   {{d.discountType=='PARTIAL_SUBSIDY'&&'checked'}}
                                   title="部分包邮">
                            {{# }else{ }}

                            <input lay-verify="required" type="radio" name="discountType"
                                   lay-filter="discountTypeFilter" value="FULL_SUBSIDY"
                                   {{d.discountType=='FULL_SUBSIDY'&&'checked'}} title="全部包邮">
                            <input lay-verify="required" type="radio" name="discountType"
                                   lay-filter="discountTypeFilter" value="PARTIAL_SUBSIDY"
                                   {{d.discountType=='PARTIAL_SUBSIDY'&&'checked'}}
                                   title="部分包邮">
                            {{# } }}
                        </div>
                    </div>
                    <div id="lazadaFreeShippingRadioView"></div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">适用范围</label>
                        <div class="layui-input-block">
                            <%--未开始--%>
                            {{# if(d.activityStatus == "NOT_START" || d.activityStatus == "ONGOING"){ }}
                            <input lay-verify="required" type="radio" name="apply"
                                   {{d.apply=='ENTIRE_SHOP'&&'checked'}}
                                   {{d.apply=='SPECIFIC_PRODUCTS'&&'disabled'}} value="ENTIRE_SHOP"
                                   title="全店商品">
                            <input lay-verify="required" type="radio" name="apply"
                                   {{d.apply=='SPECIFIC_PRODUCTS'&&'checked'}}
                                   {{d.apply=='ENTIRE_SHOP'&&'disabled'}}
                                   value="SPECIFIC_PRODUCTS"
                                   title="部分商品（请在提交活动后选择商品）">
                            {{# }else{ }}
                            <input lay-verify="required" type="radio" name="apply"
                                   {{d.apply=='ENTIRE_SHOP'&&'checked'}} value="ENTIRE_SHOP"
                                   title="全店商品">
                            <input lay-verify="required" type="radio" name="apply"
                                   {{d.apply=='SPECIFIC_PRODUCTS'&&'checked'}}
                                   value="SPECIFIC_PRODUCTS"
                                   title="部分商品（请在提交活动后选择商品）">
                            {{# } }}
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label redStar">配送方式</label>
                            <div class="layui-input-block">
                                <input lay-verify="required" type="radio" name="deliveryOption" value="STANDARD"
                                       title="STANDARD" checked>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label redStar">适用地区</label>
                            <div class="layui-input-block">
                                <%--进行中--%>
                                {{# if(d.activityStatus == "ONGOING"){ }}
                                <input lay-verify="required" type="radio" name="regionType" value="ALL_REGIONS"
                                       title="所有地区" {{d.regionType=='ALL_REGIONS'&&'checked'}}
                                       {{d.regionType=='SPECIAL_REGIONS'&&'disabled'}}>
                                <input lay-verify="required" type="radio" name="regionType" value="SPECIAL_REGIONS"
                                       title="部分地区" {{d.regionType=='SPECIAL_REGIONS'&&'checked'}}
                                       {{d.regionType=='ALL_REGIONS'&&'disabled'}}>
                                {{# }else{ }}
                                <input lay-verify="required" type="radio" name="regionType" value="ALL_REGIONS"
                                       title="所有地区" lay-filter="lazadaFreeshippingArea"
                                       {{d.regionType=='ALL_REGIONS'&&'checked'}}>
                                <input lay-verify="required" type="radio" name="regionType" value="SPECIAL_REGIONS"
                                       title="部分地区" lay-filter="lazadaFreeshippingArea"
                                       {{d.regionType=='SPECIAL_REGIONS'&&'checked'}}>
                                {{# } }}
                            </div>
                        </div>
                        <div class="layui-form-item hidden lazadaFreeshippingAreaHide">
                            <div class="layui-input-block">
                                <select name="regionValue" id="lazadaFreeShippingRegionValue"
                                        xm-select="lazadaFreeShippingRegionValue"
                                        xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="lazadaFreeShippingRadioDemo">
    <div class="layui-form-item mt10 mb10">
        邮费补贴详情
    </div>
    <div class="layui-form-item">
        {{# if(d.dealCriteria != 'NO_CONDITION'){ }}
        <div class="layui-col-md6">
            {{# if(d.dealCriteria == 'ITEM_QUANTITY_FROM_X'){ }}
            <label class="layui-form-label redStar">当购买数量大于等于</label>
            <div class="layui-input-block dis_flex">
                <input lay-verify="required" class="layui-input" name="filter"
                       onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('请输入正整数');this.value='';}"
                       placeholder="请输入正整数"
                       type="number" min="0"
                       value="{{d.filter||''}}" {{d.activityStatus== "ONGOING"&&"readonly"}}>
                （{{d.currency||''}}）
            </div>
            {{# }else{ }}
            <label class="layui-form-label redStar">当订单金额大于等于</label>
            <div class="layui-input-block dis_flex">
                <input lay-verify="required" class="layui-input" name="filter"
                       onkeyup="if(this.value && ! /^[0-9]+(.[0-9]{0,2})?$/.test(this.value)){alert('请输入正数，小数点后最多保留两位');this.value='';}"
                       placeholder="请输入正数，小数点后最多保留两位"
                       type="number" min="0"
                       value="{{d.filter||''}}" {{d.activityStatus== "ONGOING"&&"readonly"}}>
                （{{d.currency||''}}）
            </div>
            {{# } }}
        </div>
        {{# } }}
        {{# if(d.discountType == 'FULL_SUBSIDY'){ }} <%--全部包邮--%>
        {{# }else{ }} <%--部分包邮--%>
        <div class="layui-col-md5">
            <label class="layui-form-label redStar" style="width: 100px;">单笔订单最多补贴邮费金额</label>
            <div class="layui-input-block dis_flex" style="margin-left: 130px;">
                <input lay-verify="required" class="layui-input" name="result"
                       onkeyup="if(this.value && ! /^[0-9]+(.[0-9]{0,2})?$/.test(this.value)){alert('请输入正数，小数点后最多保留两位');this.value='';}"
                       placeholder="请输入正数，小数点后最多保留两位"
                       type="number" min="0"
                       value="{{d.result||''}}" {{d.activityStatus== 'ONGOING'&&'readonly'}}>

                （{{d.currency||''}}）
            </div>
        </div>
        {{# } }}
    </div>
</script>

<script src="${ctx}/static/js/publishs/lazada/lazadaFreeShipping.js"></script>
