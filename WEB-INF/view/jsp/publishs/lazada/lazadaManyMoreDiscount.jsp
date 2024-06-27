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
    <title>lazada多件多折</title>
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

    #lazadaManyMoreDiscountDemoForm .layui-form-label {
        width: 150px;
    }

    #lazadaManyMoreDiscountDemoForm .layui-input-block {
        margin-left: 180px
    }

    #lazadaManyMoreDiscount .layui-form-label {
        width: 100px;
    }

    #lazadaManyMoreDiscount .layui-input-block {
        margin-left: 130px;
    }

    .lazadaManyMoreDiscountHidden {
        display: none;
    }
</style>
<body>
<div class="layui-fluid" id="lazadaManyMoreDiscount">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lazadaManyMoreDiscountSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="lazadaManyMoreDiscountOrgId" name="departId"
                                            lay-filter="lazadaManyMoreDiscountOrgId"
                                            class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="lazadaManyMoreDiscountSalesPersonId" name="salesmanId"
                                            lay-filter="lazadaManyMoreDiscountSalesPersonId" class="users_hp_custom"
                                            data-rolelist="lazada专员" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="lazadaManyMoreDiscountStoreAcctIdList" name="storeAcctIdList"
                                            lay-filter="lazadaManyMoreDiscountStoreAcctIdList"
                                            xm-select="lazadaManyMoreDiscountStoreAcctIdList"
                                            class="users_hp_store_multi"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            data-platcode="lazada"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select id="lazadaManyMoreDiscountSiteIdList" name="salesSiteList"
                                            xm-select="lazadaManyMoreDiscountSiteIdList"
                                            class="lazadaManyMoreDiscountSiteIdList"
                                            xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">剩余数量</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="minNum" type="number" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input class="layui-input" name="maxNum" type="number" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动名称</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="name" placeholder="模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动ID</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="flexicomboId" placeholder="精确查询">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">活动结束时间</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" readonly id="lazadaManyMoreDiscountEndTime"
                                           name="lazadaManyMoreDiscountEndTime" placeholder="请选择">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">适用范围</label>
                                <div class="layui-input-block">
                                    <select name="apply">
                                        <option value="">全部</option>
                                        <option value="ENTIRE_SHOP">全店商品</option>
                                        <option value="SPECIFIC_PRODUCTS">部分商品</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动类型</label>
                                <div class="layui-input-block">
                                    <select name="activityType">
                                        <option value="">全部</option>
                                        <option value="0">单次活动</option>
                                        <option value="1">连续活动</option>
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
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderUsedNum">
                                        <option value="true">按已下单数量正序</option>
                                        <option value="false" selected>按已下单数量倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-input-block">
                                    <a type="button" class="layui-btn layui-btn-sm"
                                       id="lazadaManyMoreDiscountSearch">查询</a>
                                    <a type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                       id="lazadaManyMoreDiscountReset">清空</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card p10" id="lazadaManyMoreDiscountCard">
                <div class="layui-card-body">
                    <div class="layui-card-header">
                        <form class="layui-form dis_flex">
                            <select lay-filter="lazadaManyMoreDiscountBatchOnOrOff">
                                <option value="on">批量启用</option>
                                <option value="off">批量停用</option>
                            </select>
                            <a class="layui-btn" id="lazadaManyMoreDiscountCreatTemplate">创建多件多折</a>
                        </form>
                    </div>
                    <!-- 表格你自己渲染 -->
                    <table class="layui-table" id="lazadaManyMoreDiscountTable"
                           lay-filter="lazadaManyMoreDiscountTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<!-- 操作按钮-->
<script type="text/html" id="lazadaManyMoreDiscountOperateTpl">
    <%--未开始--%>
    {{# if(d.activityStatus == "NOT_START"){ }}
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="modify">修改类型</a>
    <%--进行中--%>
    {{# }else if(d.activityStatus == "ONGOING") { }}
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="off">暂停</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="modify">修改类型</a>
    <%--暂停中--%>
    {{# }else if(d.activityStatus == "SUSPEND") { }}
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="on">开启</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="modify">修改类型</a>
    <%--已过期--%>
    {{# }else if(d.activityStatus == "FINISH") { }}
    <%--仅支持查看--%>
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    {{# } }}
</script>
<!-- 修改类型 -->
<script type="text/html" id="lazadaManyMoreDiscountLayerModify">
    <div id="lazadaManyMoreDiscountLayerModifyView"></div>
</script>

<!-- 修改类型 -->
<script type="text/html" id="lazadaManyMoreDiscountLayerModifyDemo">
    <form class="layui-form" id="lazadaManyMoreDiscountLayerModifyForm">
        <input type="text" class="hidden" name="id" value="{{d.id}}">
        <div class="layui-form-item">
            <label class="layui-form-label redStar">活动类型</label>
            <div class="layui-input-block">
                {{# if(d.activityType == false){ }}
                <input type="radio" name="activityType" value="false" title="单次活动" checked>
                <input type="radio" name="activityType" value="true" title="连续活动">
                {{# }else { }}
                <input type="radio" name="activityType" value="false" title="单次活动">
                <input type="radio" name="activityType" value="true" title="连续活动" checked>
                {{# } }}
            </div>
        </div>
    </form>
</script>

<!-- 新增&编辑优惠券 -->
<script type="text/html" id="lazadaManyMoreDiscountLayerCreatAndEdit">
    <div id="lazadaManyMoreDiscountView"></div>
</script>

<script type="text/html" id="lazadaManyMoreDiscountDemo">
    <!--新增弹框-->
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-col-lg12 layui-col-md12">
                <form action="" class="layui-form" id="lazadaManyMoreDiscountDemoForm">
                    <input type="hidden" id="lazadaManyMoreDiscountCurrency">
                    {{# if(!d.id){ }}
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">活动类型</label>
                        <div class="layui-input-block">
                            {{# if(d.activityType == 'false'){ }}
                            <input type="radio" name="activityType" value="false" title="单次活动" checked>
                            <input type="radio" name="activityType" value="true" title="连续活动">
                            {{# }else { }}
                            <input type="radio" name="activityType" value="false" title="单次活动">
                            <input type="radio" name="activityType" value="true" title="连续活动" checked>
                            {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">站点</label>
                        <div class="layui-input-block">
                            <select name="salesSite" id="lazadaManyMoreDiscountSalesSite"
                                    lay-filter="lazadaManyMoreDiscountSalesSite"
                                    lay-verify="required"></select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">店铺</label>
                        <div class="layui-input-block">
                            <select name="storeIdList" id="lazadaManyMoreDiscountStoreIdList" lay-verify="required"
                                    xm-select="lazadaManyMoreDiscountStoreIdList"
                                    xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                        </div>
                    </div>
                    {{# } }}
                    <input type="hidden" name="id" value="{{d.id||''}}">
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">多件多折活动名称</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="name" value="{{d.name||''}}"
                                   lay-verify="required" {{d.activityStatus== "ONGOING"&&"readonly"}}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">活动时间</label>
                        <div class="layui-input-block">
                            {{# if(d.activityStatus == "ONGOING"||d.activityStatus == "SUSPEND"||d.activityStatus == "FINISH"){ }}
                            <input class="layui-input" readonly name="periodTime" value="{{d.periodTime||''}}" lay-verify="required">
                            {{# }else { }}
                            <input class="layui-input" readonly name="periodTime" value="{{d.periodTime||''}}"
                                   id="lazadaManyMoreDiscountPeriodTime" lay-verify="required">
                            {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">Flexi Combo订单总数</label>
                        <div class="layui-input-block">
                            <%--进行中的活动可以修改，且新值要比旧值大--%>
                                {{# if(d.activityStatus == "ONGOING"&&d.discountType != "money"&&d.discountType != "discount"){ }}
                            <input class="layui-input" name="orderNumbers" value="{{d.orderNumbers||''}}" type="number"
                                   min="10"
                                   onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}"
                                   lay-verify="required" readonly>
                                {{# }else{ }}
                                <input class="layui-input" name="orderNumbers" value="{{d.orderNumbers||''}}" type="number"
                                       min="10"
                                       onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}"
                                       lay-verify="required">
                                {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">优惠门槛</label>
                        <div class="layui-input-block">
                            <%--进行中--%>
                            {{# if(d.activityStatus == "ONGOING"){ }}
                            <input lay-verify="required" type="radio" name="criteriaType"
                                   lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'criteriaTypeFilter'}}" value="QUANTITY"
                                   {{d.criteriaType=='AMOUNT' && 'disabled'}}
                            {{d.criteriaType=='QUANTITY'&&'checked'}}
                            title="满件">
                            <input lay-verify="required" type="radio" name="criteriaType"
                                   lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'criteriaTypeFilter'}}" value="AMOUNT"
                                   {{d.criteriaType=='QUANTITY' &&'disabled'}}
                            {{d.criteriaType=='AMOUNT'&&'checked'}}
                            title="订单金额达到门槛">
                            {{# }else{ }}
                            <input lay-verify="required" type="radio" name="criteriaType"
                                   lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'criteriaTypeFilter'}}" value="QUANTITY"
                                   {{d.criteriaType=='QUANTITY'&&'checked'}}
                                   title="满件">
                            <input lay-verify="required" type="radio" name="criteriaType"
                                   lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'criteriaTypeFilter'}}" value="AMOUNT"
                                   {{d.criteriaType=='AMOUNT'&&'checked'}}
                                   title="订单金额达到门槛">
                            {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">优惠类型</label>
                        <div class="layui-input-block">
                            <%--进行中--%>
                            {{# if(d.activityStatus == "ONGOING"){ }}
                            <input lay-verify="required" type="radio" name="discountType" value="money"
                                   {{d.discountType!='money'&&'disabled'}}
                                   {{d.discountType=='money'&&'checked'}} title="减钱">
                            <input lay-verify="required" type="radio" name="discountType" value="discount"
                                   {{d.discountType!='discount'&&'disabled'}}
                                   {{d.discountType=='discount'&&'checked'}}
                                   title="折扣">
                                {{# if(d.discountType != "money"&&d.discountType != "discount"){ }}
                                <input type="radio" name="discountType" value="{{d.discountType}}" title="Other" checked>
                                {{# } }}
                            {{# }else{ }}
                            <input lay-verify="required" type="radio" name="discountType"
                                   lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'discountTypeFilter'}}" value="money"
                                   {{d.discountType=='money'&&'checked'}} title="减钱">
                            <input lay-verify="required" type="radio" name="discountType"
                                   lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'discountTypeFilter'}}" value="discount"
                                   {{d.discountType=='discount'&&'checked'}}
                                   title="折扣">
                            {{# } }}
                        </div>
                    </div>
                    <div id="lazadaManyMoreDiscountRadioView"></div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">适用范围</label>
                        <div class="layui-input-block">
                            <%--进行中--%>
                            {{# if(d.activityStatus){ }}
                            <input lay-verify="required" type="radio" name="apply"
                                   {{d.apply=='ENTIRE_SHOP'&&'checked'}}
                                   {{d.apply!='ENTIRE_SHOP'&&'disabled'}} value="ENTIRE_STORE"
                                   title="全店商品">
                            <input lay-verify="required" type="radio" name="apply"
                                   {{d.apply=='SPECIFIC_PRODUCTS'&&'checked'}}
                                   {{d.apply!='SPECIFIC_PRODUCTS'&&'disabled'}}
                                   value="SPECIFIC_PRODUCTS"
                                   title="部分商品">
                            {{# }else{ }}
                            <input lay-verify="required" type="radio" name="apply"
                                   lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'discountRangeFilter'}}" value="ENTIRE_SHOP"
                                   {{d.apply=='ENTIRE_SHOP'&&'checked'}} value="ENTIRE_STORE"
                                   title="全店商品">
                            <input lay-verify="required" type="radio" name="apply"
                                   lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'discountRangeFilter'}}" value="SPECIFIC_PRODUCTS"
                                   {{d.apply=='SPECIFIC_PRODUCTS'&&'checked'}}
                                   value="SPECIFIC_PRODUCTS"
                                   title="部分商品">
                            {{# } }}
                        </div>
                    </div>
                    {{# if(d.apply == 'SPECIFIC_PRODUCTS'){ }}
                    <div class="layui-form-item discountRange">
                    {{# }else{ }}
                    <div class="layui-form-item discountRange disN">
                    {{# } }}
                        <label class="layui-form-label">item ID</label>
                        <div class="layui-input-block">
                            <%--部分商品--%>
<%--                            {{# if(d.apply == 'SPECIFIC_PRODUCTS'){ }}--%>
                                <textarea class="layui-textarea" name="itemIdList">{{d.itemIdList || ''}}</textarea>
<%--                            {{# }else{ }}--%>
<%--                            {{# } }}--%>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="lazadaManyMoreDiscountRadioDemo">
    <div class="layui-form-item">
        {{#if(d.discountType == 'money'){}}
        <div class="layui-col-md12">
            <div class="layui-input-block">
                {{#if(d.activityStatus == 'ONGOING'){}}
                <input type="hidden" name="stackable" value="{{d.stackable}}">
                    {{#if(d.stackable == true){}}
                    <input type="checkbox" name="stackable" value="true" title="优惠上不封顶" lay-skin="primary" lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'lazadaMMDCheckboxFilter'}}" checked disabled>
                    {{# }else{ }}
                    <input type="checkbox" name="stackable" value="true" title="优惠上不封顶" lay-skin="primary" lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'lazadaMMDCheckboxFilter'}}" disabled>
                    {{# } }}
                {{# }else{ }}
                {{#if(d.stackable == true){}}
                <input type="checkbox" name="stackable" value="true" title="优惠上不封顶" lay-skin="primary" lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'lazadaMMDCheckboxFilter'}}" checked>
                {{# }else{ }}
                <input type="checkbox" name="stackable" value="true" title="优惠上不封顶" lay-skin="primary" lay-filter="{{(d.activityStatus == 'NOT_START' || d.activityStatus == undefined)&&'lazadaMMDCheckboxFilter'}}">
                {{# } }}
                {{# } }}
                <p class="m10">例：满2MYR减1MYR，满4MYR减2MYR，满6MYR减3MYR，如此类推</p>
            </div>
        </div>
        {{# } }}
        {{# layui.each(d.lazadaMangArr||[], function(index, item){ }}
        <div class="layui-col-md6">
            {{# if(d.criteriaType == 'QUANTITY'){ }}
            <label class="layui-form-label redStar">当购买数量大于等于</label><div class="layui-input-block dis_flex">
            <input lay-verify="required" class="layui-input" name="criteriaValue"
                   onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}"
                   type="number" min="0"
                   value="{{item.criteriaValue||''}}" {{d.activityStatus== "ONGOING"&&"readonly"}}>
            {{# if(d.criteriaType != 'QUANTITY'){ }}
            <div class="layui-form-mid layui-word-aux">（{{d.currency||''}}）</div>
            {{# } }}
        </div>
            {{# }else{ }}
            <label class="layui-form-label redStar">当订单金额大于等于</label><div class="layui-input-block dis_flex">
            <input lay-verify="required" class="layui-input" name="criteriaValue"
                   onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                   type="number" min="0"
                   value="{{item.criteriaValue||''}}" {{d.activityStatus== "ONGOING"&&"readonly"}}>
            {{# if(d.criteriaType != 'QUANTITY'){ }}
            <div class="layui-form-mid layui-word-aux">（{{d.currency||''}}）</div>
            {{# } }}
        </div>
            {{# } }}
        </div>
        <div class="layui-col-md5">
            <label class="layui-form-label redStar" style="width: 100px;">优惠为</label>
            <div class="layui-input-block dis_flex" style="margin-left: 130px;">
                {{# if(d.discountType != 'money'){ }}
                <input lay-verify="required" class="layui-input" name="discountValue"
                       onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}"
                       type="number" min="0"
                       value="{{item.discountValue||''}}" {{d.activityStatus== "ONGOING"&&"readonly"}}>
                <div class="layui-form-mid layui-word-aux">%off</div>
                {{# }else{ }}
                <input lay-verify="required" class="layui-input" name="discountValue"
                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                       type="number" min="0"
                       value="{{item.discountValue||''}}" {{d.activityStatus== "ONGOING"&&"readonly"}}>
                <div class="layui-form-mid layui-word-aux">（{{d.currency||''}}）</div>
                {{# } }}
            </div>
        </div>
        <div class="layui-col-md1">
            <a class="layui-btn layui-btn-xs layui-btn-danger lazadaDiscountDelete {{(d.activityStatus == 'ONGOING' || d.activityStatus == 'SUSPEND' || d.activityStatus == 'FINISH')&&'lazadaManyMoreDiscountHidden'}}" deleteIndex="{{index}}">删除</a>
        </div>
        {{# }); }}
        {{#if(d.lazadaMangArr.length <= 2 && d.activityStatus != "ONGOING" && d.activityStatus != "SUSPEND" && d.activityStatus != "FINISH"){}}
        <a class="layui-btn layui-btn-sm {{d.stackable == true &&'lazadaManyMoreDiscountHidden'}}" id="lazadaManyMoreDiscountAddGradient">添加梯度</a>
        {{# } }}
    </div>
</script>

<script src="${ctx}/static/js/publishs/lazada/lazadaManyMoreDiscount.js"></script>
