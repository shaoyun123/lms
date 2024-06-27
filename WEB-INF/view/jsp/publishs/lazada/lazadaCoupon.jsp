<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2021/9/3
  Time: 11:18
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>lazada优惠券</title>
</head>
<style>
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    /*.lazadaCoupon_dis_flex {*/
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*margin: 100px;*/
    /*}*/

    .redStar:before {
        content: "*";
        color: red;
        font-size: 20px;
        padding: 5px;
    }

    #lazadaCouponDemoForm .layui-form-label {
        width: 120px;
    }

    #lazadaCouponDemoForm .layui-input-block {
        margin-left: 150px
    }

    #lazadaCoupon .layui-form-label {
        width: 100px;
    }

    #lazadaCoupon .layui-input-block {
        margin-left: 130px;
    }
</style>
<body>
<div class="layui-fluid" id="lazadaCoupon">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lazadaCouponSearchForm">
                        <div class="layui-form-item">
                            <!-- 站点和属性的select的id和name自己搞定 -->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="lazadaCouponOrgId" name="orgId" lay-filter="lazadaCouponOrgId"
                                            class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="lazadaCouponSalesPersonId" name="salesPersonId"
                                            lay-filter="lazadaCouponSalesPersonId" class="users_hp_custom"
                                            data-rolelist="lazada专员" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="lazadaCouponStoreAcctIdList" name="storeAcctIdList"
                                            lay-filter="lazadaCouponStoreAcctIdList"
                                            xm-select="lazadaCouponStoreAcctIdList" class="users_hp_store_multi"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            data-platcode="lazada"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select id="lazadaCouponSiteIdList" name="salesSiteList"
                                            xm-select="lazadaCouponSiteIdList" class="lazadaCouponSiteIdList"
                                            xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">剩余数量</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="leftRestIssued" type="number" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input class="layui-input" name="rightRestIssued" type="number" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">优惠券名称</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="voucherName" placeholder="模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">优惠券ID</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="voucherId" placeholder="精确查询">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">活动结束时间</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" readonly id="lazadaCouponEndTime"
                                           name="lazadaCouponEndTime" placeholder="请选择">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">适用范围</label>
                                <div class="layui-input-block">
                                    <select name="lazadaVoucherApplyEnum">
                                        <option value="">全部</option>
                                        <option value="ENTIRE_SHOP ">全店商品</option>
                                        <option value="SPECIFIC_PRODUCTS">部分商品</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">优惠券展示区域</label>
                                <div class="layui-input-block">
                                    <select name="lazadaVoucherDisplayAreaEnum">
                                        <option value="">全部</option>
                                        <option value="REGULAR_CHANNEL">常规页面</option>
                                        <option value="STORE_FOLLOWER">店铺粉丝</option>
                                        <option value="OFFLINE">线下</option>
                                        <option value="LIVE_STREAM">直播间</option>
                                        <option value="SHARE_VOUCHER">裂变红包券</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">优惠券状态</label>
                                <div class="layui-input-block">
                                    <select name="lazadaVoucherStatusEnum">
                                        <option value="">全部</option>
                                        <option value="NOT_START">未开始</option>
                                        <option value="ONGOING">进行中</option>
                                        <option value="SUSPEND">暂停中</option>
                                        <option value="FINISH">已过期</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动类型</label>
                                <div class="layui-input-block">
                                    <select name="activityType">
                                        <option value="">全部</option>
                                        <option value="1">单次活动</option>
                                        <option value="2">连续活动</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderUsedBudgetAsc">
                                        <option value="false" selected>按已领取数量倒序</option>
                                        <option value="true">按已领取数量正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-input-block">
                                    <a type="button" class="layui-btn layui-btn-sm" id="lazadaCouponSearch">查询</a>
                                    <a type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                       id="lazadaCouponReset">清空</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card p10" id="lazadaCouponCard">
                <div class="layui-card-body">
                    <div class="layui-card-header">
                        <form class="layui-form dis_flex">
                            <select lay-filter="lazadaCouponBatchOnOrOff">
                                <option value="on">批量启用</option>
                                <option value="off">批量停用</option>
                            </select>
                            <a class="layui-btn" id="lazadaCouponCreatTemplate">创建优惠券</a>
                        </form>
                    </div>
                    <!-- 表格你自己渲染 -->
                    <table class="layui-table" id="lazadaCouponTable" lay-filter="lazadaCouponTable"></table>
                </div>
            </div>
            <%--<div class="layui-card p20" id="lazadaCouponCard">--%>
            <%--<div class="layui-card-header">--%>
            <%--<form class="layui-form lazadaCoupon_dis_flex">--%>
            <%--<select lay-filter="lazadaCouponBatchOnOrOff">--%>
            <%--<option value="on">批量启用</option>--%>
            <%--<option value="off">批量停用</option>--%>
            <%--</select>--%>
            <%--<a class="layui-btn" id="lazadaCouponCreatTemplate">创建优惠券</a>--%>
            <%--</form>--%>
            <%--</div>--%>
            <%--<div class="layui-card-body">--%>
            <%--<!-- 表格你自己渲染 -->--%>
            <%--<table class="layui-table" id="lazadaCouponTable" lay-filter="lazadaCouponTable"></table>--%>
            <%--</div>--%>
            <%--</div>--%>
        </div>
    </div>
</div>
</body>
</html>
<!-- 操作按钮-->
<script type="text/html" id="lazadaCouponOperateTpl">
    <%--未开始--%>
    {{# if(d.voucherStatus == "NOT_START"){ }}
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="modify">修改类型</a>
    <%--进行中--%>
    {{# }else if(d.voucherStatus == "ONGOING") { }}
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="off">暂停</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="modify">修改类型</a>
    <%--暂停中--%>
    {{# }else if(d.voucherStatus == "SUSPEND") { }}
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="on">开启</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="modify">修改类型</a>
    <%--已过期--%>
    {{# }else if(d.voucherStatus == "FINISH") { }}
    {{# } }}
</script>
<!-- 修改类型 -->
<script type="text/html" id="lazadaCouponLayerModify">
    <div id="lazadaCouponLayerModifyView"></div>
</script>

<!-- 修改类型 -->
<script type="text/html" id="lazadaCouponLayerModifyDemo">
    <form class="layui-form" id="lazadaCouponLayerModifyForm">
        <input type="text" class="hidden" name="id" value="{{d.id}}">
        <div class="layui-form-item">
            <label class="layui-form-label redStar">活动类型</label>
            <div class="layui-input-block">
                {{# if(d.activityType == 1){ }}
                <input type="radio" name="activityType" value="1" title="单次活动" checked>
                <input type="radio" name="activityType" value="2" title="连续活动">
                {{# }else { }}
                <input type="radio" name="activityType" value="1" title="单次活动">
                <input type="radio" name="activityType" value="2" title="连续活动" checked>
                {{# } }}
            </div>
        </div>
    </form>
</script>

<!-- 新增&编辑优惠券 -->
<script type="text/html" id="lazadaCouponLayerCreatAndEdit">
    <div id="lazadaCouponView"></div>
</script>

<script type="text/html" id="lazadaCouponDemo">
    <!--新增弹框-->
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-col-lg12 layui-col-md12">
                <form action="" class="layui-form" id="lazadaCouponDemoForm">
                    <input type="hidden" id="lazadaCouponCurrency">
                    {{# if(!d.id){ }}
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">活动类型</label>
                        <div class="layui-input-block">
                            {{# if(d.activityType == 1){ }}
                            <input type="radio" name="activityType" value="1" title="单次活动" checked>
                            <input type="radio" name="activityType" value="2" title="连续活动">
                            {{# }else { }}
                            <input type="radio" name="activityType" value="1" title="单次活动">
                            <input type="radio" name="activityType" value="2" title="连续活动" checked>
                            {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">站点</label>
                        <div class="layui-input-block">
                            <select name="salesSite" id="lazadaCouponSalesSite" lay-filter="lazadaCouponSalesSite"
                                    lay-verify="required"></select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">店铺</label>
                        <div class="layui-input-block">
                            <select name="storeIdList" id="lazadaCouponStoreIdList" lay-verify="required"
                                    xm-select="lazadaCouponStoreIdList"
                                    xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                        </div>
                    </div>
                    {{# } }}
                    <input type="hidden" name="id" value="{{d.id||''}}">
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">优惠券名称</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="voucherName" value="{{d.voucherName||''}}"
                                   lay-verify="required" {{d.voucherStatus== "ONGOING"&&"readonly"}}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">优惠券使用时间</label>
                        <div class="layui-input-block">
                            <%--进行中--%>
                            {{# if(d.voucherStatus == "ONGOING"){ }}
                            <input class="layui-input" readonly name="periodTime" value="{{d.periodTime||''}}"
                                   lay-verify="required">
                            {{# }else{ }}
                            <input class="layui-input" readonly name="periodTime" value="{{d.periodTime||''}}"
                                   id="lazadaCouponPeriodTime" lay-verify="required">
                            {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">领取开始时间</label>
                        <div class="layui-input-block">
                            <%--未开始||进行中--%>
                            {{# if(d.voucherStatus == "NOT_START" || d.voucherStatus == "ONGOING"){ }}
                            <input class="layui-input" readonly name="collectStart" value="{{d.collectStart||''}}">
                            {{# }else{ }}
                            <input class="layui-input" readonly name="collectStart" value="{{d.collectStart||''}}"
                                   id="lazadaCouponCollectStart">
                            {{# } }}
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">优惠券发放张数</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="issued" value="{{d.issued||''}}" type="number" min="0"
                                   onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}"
                                   lay-verify="required">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">单个买家领取张数限制</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="limit" value="{{d.limit||''}}" type="number" min="0"
                                   onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}"
                                   {{d.voucherStatus== "ONGOING"&&"readonly"}}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">优惠券展示区域</label>
                        <div class="layui-input-block">
                            <%--进行中--%>
                            {{# if(d.voucherStatus == "ONGOING"){ }}
                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum!='REGULAR_CHANNEL' && 'disabled'}}
                            {{d.lazadaVoucherDisplayAreaEnum=='REGULAR_CHANNEL'&&'checked'}}
                            value="REGULAR_CHANNEL"
                            title="常规页面">
                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum!='STORE_FOLLOWER' &&'disabled'}}
                            {{d.lazadaVoucherDisplayAreaEnum=='STORE_FOLLOWER'&&'checked'}}
                            value="STORE_FOLLOWER" title="店铺粉丝">
                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum!='OFFLINE' &&'disabled'}}
                            {{d.lazadaVoucherDisplayAreaEnum=='OFFLINE'&&'checked'}} value="OFFLINE" title="线下">
                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum!='LIVE_STREAM' &&'disabled'}}
                            {{d.lazadaVoucherDisplayAreaEnum=='LIVE_STREAM'&&'checked'}} value="LIVE_STREAM"
                            title="直播间">
                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum!='SHARE_VOUCHER' &&'disabled'}}
                            {{d.lazadaVoucherDisplayAreaEnum=='SHARE_VOUCHER'&&'checked'}} value="SHARE_VOUCHER"
                            title="裂变红包券">
                            {{# }else{ }}

                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum=='REGULAR_CHANNEL'&&'checked'}}
                                   value="REGULAR_CHANNEL"
                                   title="常规页面">
                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum=='STORE_FOLLOWER'&&'checked'}}
                                   value="STORE_FOLLOWER" title="店铺粉丝">
                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum=='OFFLINE'&&'checked'}} value="OFFLINE" title="线下">
                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum=='LIVE_STREAM'&&'checked'}} value="LIVE_STREAM"
                                   title="直播间">
                            <input lay-verify="required" type="radio" name="lazadaVoucherDisplayAreaEnum"
                                   {{d.lazadaVoucherDisplayAreaEnum=='SHARE_VOUCHER'&&'checked'}} value="SHARE_VOUCHER"
                                   title="裂变红包券">
                            {{# } }}

                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">优惠类型</label>
                        <div class="layui-input-block">
                            <%--进行中--%>
                            {{# if(d.voucherStatus == "ONGOING"){ }}

                            <input lay-verify="required" type="radio" name="ladaVoucherDiscountTypeEnum"
                                   lay-filter="ladaVoucherDiscountTypeEnumFilter" value="MONEY_VALUE_OFF"
                                   {{d.ladaVoucherDiscountTypeEnum=='PERCENTAGE_DISCOUNT_OFF'&&'disabled'}}
                                   {{d.ladaVoucherDiscountTypeEnum=='MONEY_VALUE_OFF'&&'checked'}} title="满减">
                            <input lay-verify="required" type="radio" name="ladaVoucherDiscountTypeEnum"
                                   lay-filter="ladaVoucherDiscountTypeEnumFilter" value="PERCENTAGE_DISCOUNT_OFF"
                                   {{d.ladaVoucherDiscountTypeEnum=='MONEY_VALUE_OFF'&&'disabled'}}
                                   {{d.ladaVoucherDiscountTypeEnum=='PERCENTAGE_DISCOUNT_OFF'&&'checked'}}
                                   title="折扣">
                            {{# }else{ }}

                            <input lay-verify="required" type="radio" name="ladaVoucherDiscountTypeEnum"
                                   lay-filter="ladaVoucherDiscountTypeEnumFilter" value="MONEY_VALUE_OFF"
                                   {{d.ladaVoucherDiscountTypeEnum=='MONEY_VALUE_OFF'&&'checked'}} title="满减">
                            <input lay-verify="required" type="radio" name="ladaVoucherDiscountTypeEnum"
                                   lay-filter="ladaVoucherDiscountTypeEnumFilter" value="PERCENTAGE_DISCOUNT_OFF"
                                   {{d.ladaVoucherDiscountTypeEnum=='PERCENTAGE_DISCOUNT_OFF'&&'checked'}}
                                   title="折扣">
                            {{# } }}
                        </div>
                    </div>
                    <div id="lazadaCouponRadioView"></div>

                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">适用范围</label>
                        <div class="layui-input-block">
                            <%--未开始--%>
                            {{# if(d.voucherStatus == "NOT_START" || d.voucherStatus == "ONGOING"){ }}
                            <input lay-verify="required" type="radio" name="lazadaVoucherApplyEnum"
                                   {{d.lazadaVoucherStatusEnum=='ENTIRE_SHOP'&&'checked'}}
                                   {{d.lazadaVoucherStatusEnum=='SPECIFIC_PRODUCTS'&&'disabled'}} value="ENTIRE_SHOP"
                                   title="全店商品">
                            <input lay-verify="required" type="radio" name="lazadaVoucherApplyEnum"
                                   {{d.lazadaVoucherStatusEnum=='SPECIFIC_PRODUCTS'&&'checked'}}
                                   {{d.lazadaVoucherStatusEnum=='ENTIRE_SHOP'&&'disabled'}}
                                   value="SPECIFIC_PRODUCTS"
                                   title="部分商品（请在提交活动后选择商品）">
                            {{# }else{ }}
                            <input lay-verify="required" type="radio" name="lazadaVoucherApplyEnum"
                                   {{d.lazadaVoucherStatusEnum=='ENTIRE_SHOP'&&'checked'}} value="ENTIRE_SHOP"
                                   title="全店商品">
                            <input lay-verify="required" type="radio" name="lazadaVoucherApplyEnum"
                                   {{d.lazadaVoucherStatusEnum=='SPECIFIC_PRODUCTS'&&'checked'}}
                                   value="SPECIFIC_PRODUCTS"
                                   title="部分商品（请在提交活动后选择商品）">
                            {{# } }}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="lazadaCouponRadioDemo">
    {{# if(d.ladaVoucherDiscountTypeEnum == 'MONEY_VALUE_OFF'){ }}
    <div class="layui-form-item">
        <div class="layui-col-md6">
            <label class="layui-form-label redStar">当订单金额大于等于</label>
            <div class="layui-input-block dis_flex">
                <input lay-verify="required" class="layui-input" name="criteriaOverMoney"
                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                       type="number" min="0"
                       value="{{d.criteriaOverMoney||''}}" {{d.voucherStatus== "ONGOING"&&"readonly"}}>
                （{{d.currency||''}}）
            </div>
        </div>
        <div class="layui-col-md6">
            <label class="layui-form-label redStar">优惠为</label>
            <div class="layui-input-block dis_flex">
                <input lay-verify="required" class="layui-input" name="offeringMoneyValueOff"
                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                       type="number" min="0"
                       value="{{d.offeringMoneyValueOff||''}}" {{d.voucherStatus== "ONGOING"&&"readonly"}}>
                （{{d.currency||''}}）
            </div>
        </div>
    </div>
    {{# }else if(d.ladaVoucherDiscountTypeEnum == 'PERCENTAGE_DISCOUNT_OFF') { }}
    <div class="layui-form-item">
        <div class="layui-col-md6">
            <label class="layui-form-label redStar">当订单金额大于等于</label>
            <div class="layui-input-block dis_flex">
                <input lay-verify="required" class="layui-input" name="criteriaOverMoney"
                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                       type="number" min="0"
                       value="{{d.criteriaOverMoney||''}}" {{d.voucherStatus== "ONGOING"&&"readonly"}}>
                （{{d.currency||''}}）
            </div>
        </div>
        <div class="layui-col-md6">
            <label class="layui-form-label redStar">优惠为</label>
            <div class="layui-input-block dis_flex">
                <input lay-verify="required" class="layui-input" name="offeringPercentageDiscountOff"
                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                       type="number" min="0"
                       value="{{d.offeringPercentageDiscountOff||''}}" {{d.voucherStatus== "ONGOING"&&"readonly"}}>
                （%off）
            </div>
        </div>
        <div class="layui-col-md6">
            <label class="layui-form-label">单笔订单优惠上限</label>
            <div class="layui-input-block dis_flex">
                <input class="layui-input" name="maxDiscountOfferingMoneyValue"
                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                       type="number" min="0"
                       value="{{d.maxDiscountOfferingMoneyValue||''}}" {{d.voucherStatus== "ONGOING"&&"readonly"}}>
                （{{d.currency||''}}）
            </div>
        </div>
    </div>
    {{# } }}
</script>

<script src="${ctx}/static/js/publishs/lazada/lazadaCoupon.js"></script>