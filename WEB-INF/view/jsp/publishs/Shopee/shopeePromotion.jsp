<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>促销管理</title>
        <style>
            td[class="colspan_td"]>table>tbody tr:first-child td {
                border-top: none;
            }
            
            td[class="colspan_td"]>table>tbody tr:last-child td {
                border-bottom: none;
            }
            
            td[class="colspan_td"]>table>tbody tr td {
                border-left: none;
                border-right: none;
                white-space: normal;
                word-wrap: break-word;
                word-break: break-all;
            }
            
            th,
            td {
                text-align: center
            }
            
            .layui-row>div {
                margin-bottom: 10px;
            }
            
            .clearfix {
                *zoom: 1;
            }
            /*IE/6/7*/
            
            .clearfix:after {
                content: "\200B";
                display: block;
                height: 0;
                clear: both;
                visibility: hidden;
            }
            
            .fr {
                float: right;
            }
            
            .w_50 {
                width: 50%;
            }
            .m20{
                margin: 20px;
            }

            .dis_flex{
                display: flex;
                justify-content: space-between;
            }
            .pt_5{
                padding-top: 5px;
            }
        </style>
        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form action="" class="layui-form" id="shopeePormotion">
                                <div class="layui-form-item layui-row">
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select name="" id="shopeeHp" lay-filter="orgs_hp_shopeePromotion" lay-search class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                            <%-- <select name="orgId" lay-filter="orgs_hp_wishPersion_pb" class="orgs_hp_custom" >
                                        <option value=""></option>
                                    </select>--%>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">销售员</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" name="" class="users_hp_custom" id="shopee_promotion_salesman" data-rolelist="shopee专员" lay-filter="users_hp_shopeePromotion">
                                    </select>
                                        </div>
                                        <%--<label class="layui-form-label">开发人员</label>
                                <div class="layui-input-block">
                                    <select name="sellerId"  class="users_hp_custom" data-rolelist="wish专员" lay-filter="users_hp_wishPersion_pb" lay-search="">
                                    </select>
                                </div>--%>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select id="shopee_promotion_form_store" name="storeAcctId" lay-filter="shopee_promotion_form_store"
                                                xm-select="shopee_promotion_form_store" class="users_hp_store_multi" xm-select-search 
                                                xm-select-search-type="dl" xm-select-skin="normal" data-platcode="shopee">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">排序</label>
                                        <div class="layui-input-block">
                                            <select lay-search id="orderCode">
                                    <option value="">选择排序</option>
                                        <option value="start_time asc">开始时间升序</option>
                                        <option value="start_time desc">开始时间降序</option>
                                        <option value="end_time asc">结束时间升序</option>
                                        <option value="end_time desc">结束时间降序</option>
                                        <option value="discount_ratio asc">促销比例升序</option>
                                        <option value="discount_ratio desc">促销比例降序</option>
                                </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">促销名称</label>
                                        <div class="layui-input-block">
                                            <input type="text" id="discountName" placeholder="促销" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">开始时间</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="title" placeholder="开始时间" autocomplete="off" class="layui-input" id="start">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">结束时间</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="title" placeholder="结束时间" autocomplete="off" class="layui-input" id="end">
                                        </div>
                                    </div>
                                    <!-- <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">优惠比例</label>
                                        <div class="layui-input-block">
                                            <div class="layui-col-lg6 layui-col-md6">
                                            <select lay-search id="shopee_promotion_sales_type">
                                                <option value="">请选择</option>
                                                <option value="lessthan">小于</option>
                                                <option value="equalto">等于</option>
                                                <option value="greaterthan">大于</option>
                                            </select>
                                            </div>
                                            <div class="layui-col-lg6 layui-col-md6">
                                            <input type="number" name="title" placeholder="优惠比例" autocomplete="off" class="layui-input" id="shopee_promotion_sales">
                                            </div>
                                        </div>
                                    </div> -->
                                    <!-- <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">数据是否完整</label>
                                        <div class="layui-input-block">
                                            <select lay-search id="isFullData" >
                                                <option value="" selected = "selected">全部</option>
                                                <option value="0" >不完整</option>
                                                <option value="1">已完整</option>
                                            </select>
                                        </div>
                                    </div> -->
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">活动类型</label>
                                        <div class="layui-input-block">
                                            <select name="autoRenew" lay-search>
                                                <option value="">请选择</option>
                                                <option value="false">单次活动</option>
                                                <option value="true">连续活动</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                      <label class="layui-form-label">活动数量限制</label>
                                      <div class="layui-input-block disflex">
                                          <input type="number" name="purchaseLimitLeft" placeholder="数量下限" autocomplete="off" class="layui-input">
                                          <input type="number" name="purchaseLimitRight" placeholder="数量上限" autocomplete="off" class="layui-input ml10">
                                      </div>
                                  </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">活动重量限制</label>
                                        <div class="layui-input-block disflex">
                                            <input type="number" name="weightMin" placeholder="重量下限" autocomplete="off" class="layui-input">
                                            <input type="number" name="weightMax" placeholder="重量上限" autocomplete="off" class="layui-input ml10">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">活动指定类目</label>
                                        <div class="layui-input-block">
                                            <input id="shopeePromotion_cnscCateIds">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <div class="layui-input-block clearfix">
                                            <button class="layui-btn layui-btn-sm" type="button" id="searchPromotion">查询</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="shopeePromotionResetBtn">清空</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card" id="shopeePromotionCard">
                        <div class="fixHigh">
                            <div class="layui-card-header">
                                <div class="fixTab">
                                    <div class="layui-tab dis_flex w_100" lay-filter="shopforSell_tab" >
                                        <ul class="layui-tab-title" style="display:inline-block">
                                            <li data-value="0" class="layui-this" discountStatus="0">未开始(<span id="shope_promotion_upcoming_num_span"></span>)</li>
                                            <li data-value="1" discountStatus="1">进行中(<span id="shope_promotion_online_num_span"></span>)</li>
                                            <li data-value="2" discountStatus="2">已结束(<span id="shope_promotion_offline_num_span"></span>)</li>
                                        </ul>
                                        <div class="pt_5">
                                            <div class="layui-input-inline">
                                                <span class="layui-btn layui-btn-sm layui-btn-danger" id="shopee_promotion_end_btn">终止</span>
                                            </div>
                                            <div class="layui-input-inline">
                                                <span class="layui-btn layui-btn-sm" id="shopee_importPromoInfo">导入促销信息</span>
                                            </div>
                                            <div class="layui-input-inline">
                                                <a class="layui-btn layui-btn-sm layui-btn-normal" href="${ctx}/static/templet/shopeeImportPromoTemplate.xlsx">下载导入模板</a>
                                            </div>
                                            <button class="layui-btn layui-btn-normal layui-btn-sm" type="button" id="newActivty">新增活动</button>
                                            <button class="layui-btn layui-btn-normal layui-btn-sm" type="button" id="sync_promotion">同步店铺促销</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-card-body">
                            <table class="layui-table" id="shopeeforSell_table" lay-filter="shopeeforSell_table"></table>
                            <div id="shopeeforSell_pagination" class="customPagination"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'upload', 'laydate','layCascader'], function() {
                var admin = layui.admin,
                    form = layui.form,
                    layer = layui.layer,
                    table = layui.table,
                    formSelects = layui.formSelects,
                    element = layui.element,
                    upload = layui.upload,
                    laydate = layui.laydate,
                    laypage = layui.laypage,
                    upload = layui.upload,
                    layCascader = layui.layCascader,
                    $ = layui.$

                render_hp_orgs_users("#shopeePormotion");

                form.render(null, 'component-form-element');
                element.render('breadcrumb', 'breadcrumb');

                form.render('select');
                form.on('submit(component-form-element)', function(data) {
                    layer.msg(JSON.stringify(data.field));
                    return false;
                });
                // 类目
                let shopeePormotion_cnscCateCascader;
                let shopeePormotion_cateCascader_data;
                commonReturnPromise({
                    url: "/lms/shopee/shopeeCate/cnscCategoryTree",
                }).then(res=>{
                    shopeePormotion_cateCascader_data = res
                    shopeePormotion_cnscCateCascader = layCascader({
                        elem: "#shopeePromotion_cnscCateIds",
                        clearable: true,
                        filterable: true,
                        collapseTags: true,
                        options: shopeePormotion_cateCascader_data,
                        props: {
                            multiple: true,
                            label: "label",
                            value: "value",
                            children: "children",
                            checkStrictly: false,
                        },
                    })
                });
                $('#shopeePromotionResetBtn').on('click', function(){
                  $('#shopeePormotion')[0].reset();
                  shopeePormotion_cnscCateCascader.setValue();
                  render_hp_orgs_users("#shopeePormotion");
                });

                //导入授权信息
                upload.render({
                    elem: '#shopee_importPromoInfo' //绑定元素
                    ,url: `${ctx}/shopee/shopeeDiscount/importShopeePromotion.html` //上传接口
                    ,accept: 'file' //允许上传的文件类型
                    ,exts: 'xlsx'
                    ,done: function(res){
                        if(res.code=="0000"){
                            layer.confirm(res.msg, {icon: 1, title:'提示'}, function(index){
                                layer.close(index);
                            });
                        }else{
                            layer.confirm(res.msg, {icon: 2, title:'提示'}, function(index){
                                layer.close(index);
                            });
                        }
                    }
                    ,error: function(){
                        layer.msg('服务器出现故障!');
                    }
                });

                /**
                 * 在线下线选项卡改变
                 */
                var currentTab = "0"; //在线
                element.on('tab(shopforSell_tab)', function(data) {
                    currentTab = $(this).attr("discountStatus");
                    $("#searchPromotion").click();
                });

                //封装参数
                function getSearchData() {
                    var data = {};
                    data.storeAcctId = "";
                    data.orderCode = "start_time desc";
                    data.discountName = "";
                    data.date1 = null;
                    data.date2 = null;
                    data.date3 = null;
                    data.date4 = null;
                    data.discountStatus = "";
                    data.discountRatioType = "";
                    data.sales = "";
                    var storeList = [];
                    data.storeAcctIdListStr = formSelects.value('shopee_promotion_form_store', 'valStr'); //店铺id
                    data.discountStatus = currentTab; //默认进行中
                    data.storeAcctId = ''
                    // data.isFullData = $("#isFullData").val(); //数据是否完整
                    data.autoRenew = $('#shopeePormotion').find('select[name=autoRenew]').val() //活动类型
                    // console.log(data.isFullData)
                    // console.log(data.storeAcctId)
                    var shopeeHp = $("#shopeeHp").val(); //店铺id
                    // console.log(shopeeHp)
                    //没有选择店铺
                    var acctIds = $("#shopee_promotion_form_store").attr("acct_ids");
                    if(data.storeAcctIdListStr==null || data.storeAcctIdListStr==''){
                        if(acctIds){
                            data.storeAcctIdListStr = acctIds
                        }else{
                            data.storeAcctId = '9999';
                        }
                    }
                    if ($("#orderCode").val().length > 0) {
                        data.orderCode = $("#orderCode").val(); //排序code
                    }
                    if ($("#discountName").val().length > 0) {
                        data.discountName = $("#discountName").val(); //促销名称
                    }
                    //开始时间范围
                    if ($("#start").val().length > 0) {
                        var timeArr = $("#start").val().split(" - ");
                        data.date1 = timeArr[0];
                        data.date2 = timeArr[1];
                    }
                    //结束时间范围
                    if ($("#end").val().length > 0) {
                        var timeArr = $("#end").val().split(" - ");
                        data.date3 = timeArr[0];
                        data.date4 = timeArr[1];
                    }
                    // data.discountRatioType =  $("#shopee_promotion_sales_type option:selected").val();
                    // if(data.discountRatioType != "" && data.discountRatioType != null) {
                    //     data.discountRatio = $("#shopee_promotion_sales").val();
                    // }
                    //活动数量限制
                    data.purchaseLimitLeft = $('#shopeePormotion').find('input[name=purchaseLimitLeft]').val()
                    data.purchaseLimitRight = $('#shopeePormotion').find('input[name=purchaseLimitRight]').val()
                    // 活动重量限制
                    data.weightMin = $('#shopeePormotion').find('input[name=weightMin]').val()
                    data.weightMax = $('#shopeePormotion').find('input[name=weightMax]').val()
                    // CNSC类目
                    data.cnscCateIdList = JSON.parse($("#shopeePromotion_cnscCateIds").val() || "[]").join(',')
                    data.salesmanId = $("#shopee_promotion_salesman").val();
                    return data;
                }

                //执行重载
                $("#searchPromotion").click(function() {
                    table.reload('shopee_promotionTable', {
                        page: {
                            curr: 1 //从第一页开始
                        },
                        url: ctx + "/shopee/shopeeDiscount/searchPromotion.html", //数据接口
                        where: getSearchData()
                    })
                });

                //渲染数据
                table.render({
                    elem: '#shopeeforSell_table',
                    method: 'post',
                    where: getSearchData(),
                    title: 'shopee促销表',
                    page: true //开启分页
                        ,
                    toolbar: false //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        ,
                    totalRow: true //开启合计行
                        ,
                    cols: [[ //表头
                            {type: 'checkbox'},
                            {field: 'discountName', title: '名称',width:200},
                            {field: 'autoRenew', title: '活动类型',templet: "#shopee_promotion_autoRenenw_row"},
                            {field: 'storeAcctName', title: '店铺'},
                            {field: 'salesperson', title: '销售员'},
                            {field: 'startTime', title: '开始时间', templet: "<div>{{layui.util.toDateString(d.startTime,'yyyy-MM-dd HH:mm:ss')}}</div>",width:150},
                            {field: 'endTime', title: '结束时间', templet: "<div>{{layui.util.toDateString(d.endTime,'yyyy-MM-dd HH:mm:ss')}}</div>",width:150},
                            {field: 'purchaseLimit', 
                                title: '数量限制<i class="layui-icon ml5" lay-tips="在listing维度限制每个买家购买活动商品的数量，超过限制数量的部分按原价购买">&#xe60b;</i> ',
                                width:100,
                                templet: "<div>{{d.purchaseLimit!==undefined ? d.purchaseLimit : ''}}</div>"
                            },
                            {field: 'weight', title: '重量限制(g)',width:100,templet: d=>{
                                if(!d.weightMax && !d.weightMin){
                                    return ''
                                }else if(d.weightMax && !d.weightMin){
                                    return '[0, '+d.weightMax+']'
                                }else if(!d.weightMax && d.weightMin){
                                    return '['+d.weightMin+', +&infin;]'
                                }else{
                                    return '['+d.weightMin+', '+d.weightMax+']'
                                }
                            } },
                            {field: 'cnscCateNameList', title: '指定类目',width:250,templet:d=>{
                                let cnscStr = ''
                                if(Array.isArray(d.cnscCateNameList) && d.cnscCateNameList.length){
                                    d.cnscCateNameList.forEach(e=>{
                                        cnscStr += e+'<br>'
                                    })
                                }
                                return cnscStr
                            }},
                            // {field: 'discountRatio', title: '优惠比例',width:150},
                            {field: 'listingCount', title: 'listing数量',width:100},
                            {title: '操作', align: 'center', style: "vertical-align: top;", toolbar: '#shopee_promotion',width:80}
                        ]],
                    id: 'shopee_promotionTable',
                    limits: [20, 50, 100],
                    limit: 20,
                    done: function(res, curr, count) {
                        UnifiedFixedFn('shopeePromotionCard')
                        if (res.code == '0000') {
                            if (res.msg != null) {
                                var msgArray = res.msg.split("&");
                                $("#shope_promotion_upcoming_num_span").html(msgArray[0])  //未开始
                                $("#shope_promotion_online_num_span").html(msgArray[1]); //在线
                                $("#shope_promotion_offline_num_span").html(msgArray[2]); //下线
                            }
                        }
                    }
                });

                var start = laydate.render({
                    elem: '#start',
                    type: 'datetime', //可选择：年月日时分秒
                    trigger: 'click', //采用click弹出
                    range: true,
                    done: function(value, date, endDate) {
                        end.config.min = {
                            year: date.year,
                            month: date.month - 1,
                            date: date.date,
                            hours: date.hours,
                            minutes: date.minutes,
                            seconds: date.seconds
                        }; //开始日选好后，重置结束日的最小日期
                        end.config.value = {
                            year: date.year,
                            month: date.month - 1,
                            date: date.date,
                            hours: date.hours,
                            minutes: date.minutes,
                            seconds: date.seconds
                        }; //将结束日的初始值设定为开始日
                    }
                });

                var end = laydate.render({
                    elem: '#end',
                    type: 'datetime', //可选择：年月日时分秒
                    trigger: 'click', //采用click弹出
                    range: true,
                    done: function(value, date, endDate) {
                        start.config.max = {
                            year: date.year,
                            month: date.month - 1,
                            date: date.date,
                            hours: date.hours,
                            minutes: date.minutes,
                            seconds: date.seconds
                        }; //结束日选好后，重置开始日的最大日期
                    }
                });
                //封装参数
                function appendDate(originObj={},isAdd) {
                    var obj = {};
                    obj.id = $("#promotion_id").val();
                    obj.discountName = $("#promotion_discountName").val();
                    obj.storeAcctId = $("#promotion_saveStoreAcct").val();
                    obj.startTime = $("#promotion_startTime").val();
                    obj.endTime = $("#promotion_endTime").val();
                    let curAutoRenew = $('#shopeePormotion_activty').find('input[name=autoRenew]:checked').val()
                    obj.autoRenew =!!isAdd ?curAutoRenew == 'true' ? true : false : originObj.autoRenew
                    if(isAdd){
                        obj.purchaseLimit = $("#promotion_purchaseLimit").val();
                        obj.weightMax = $('#shopeePormotion_activty').find('input[name=weightMax]').val()
                        obj.weightMin = $('#shopeePormotion_activty').find('input[name=weightMin]').val()
                        obj.cnscCateIdsStr = JSON.parse($("#shopeePormotion_activty_cnscCateIds").val() || "[]").join(',')
                    }
                    // obj.discountRatio = $("#promotion_discount_redio").val();
                    return obj;
                }
                $("#sync_promotion").click(function () {
                    const storeAcctIdList = layui.formSelects.value('shopee_promotion_form_store', 'val'); //店铺id
                    if(!storeAcctIdList.length){
                        layer.msg("请选择店铺");
                        return;
                    }
                    // loading.show();
                    var timer={};
                    process();
                    $.ajax({
                        type:'post',
                        url: ctx + '/shopee/syncItem/getShopeeDiscount.html',
                        data: JSON.stringify(storeAcctIdList) ,
                        dataType: 'json',
                        contentType: 'application/json',
                        success:function (data) {
                            if(data.code == '0000'){
                                clearprocess();
                                layer.msg(JSON.stringify(data.data));
                            }else {
                                clearprocess()
                                layer.msg(JSON.stringify(data.msg));
                            }
                            loading.hide()
                        }
                    })
                })

                //    终止
                $("#shopee_promotion_end_btn").click(function () {
                    const { data } = table.checkStatus("shopee_promotionTable")
                    if (!data.length) return layer.msg("请选择数据", { icon: 7 })
                    // 结束状态不用终止
                    if (currentTab == "2" || currentTab == "0")
                        return layer.msg("该状态下不需要终止", { icon: 7 })
                    const idList = data.map((item) => Number(item.id))
                    commonReturnPromise({
                        url: ctx + "/shopee/shopeeDiscount/terminateBatch",
                        params: JSON.stringify(idList),
                        contentType: "application/json",
                        type: "post",
                    }).then((res) => {
                        layer.msg("操作成功", 0)
                        $("#searchPromotion").click()
                    })
                })

                $('#newActivty').click(function() {
                    let shopeePormotion_newActivty_cnscCateCascader
                    layer.open({
                        title: '新增活动',
                        type: 'post', //不加该属性,就会出现[object Object]
                        area: ['60%', '60%'],
                        id: 'addProductId',
                        btn: ['保存', '清空', '关闭'],
                        content: $('#newActivty_layer').html(),
                        success: function() {
                            commonReturnPromise({
                                url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
                                type: 'post',
                                params: {roleNames: 'shopee专员',platCode: 'shopee'}
                            }).then(res=>{
                                commonRenderSelect('promotion_saveStoreAcct', res, {name: 'storeAcct', code: 'id'}).then(()=>layui.form.render())
                            })
                            $('#shopeePormotion_activty').find('input[name=autoRenew][value=false]').prop('checked',true)
                            form.render();
                            var promotion_startTime = laydate.render({
                                elem: '#promotion_startTime',
                                type: 'datetime', //可选择：年月日时分秒
                                min: -0, //最小日期为当前日期的前一天
                                max: '2099-6-16 23:59:59',
                                trigger: 'click', //采用click弹出
                                done: function(value, date, endDate) {
                                    end.config.min = {
                                        year: date.year,
                                        month: date.month - 1,
                                        date: date.date,
                                        hours: date.hours,
                                        minutes: date.minutes,
                                        seconds: date.seconds
                                    }; //开始日选好后，重置结束日的最小日期
                                    end.config.value = {
                                        year: date.year,
                                        month: date.month - 1,
                                        date: date.date,
                                        hours: date.hours,
                                        minutes: date.minutes,
                                        seconds: date.seconds
                                    }; //将结束日的初始值设定为开始日
                                },
                            });

                            var promotion_endTime = laydate.render({
                                elem: '#promotion_endTime',
                                type: 'datetime', //可选择：年月日时分秒
                                min: -0, //最小日期为当前日期的前一天
                                max: '2099-6-16 23:59:59',
                                trigger: 'click', //采用click弹出
                                done: function(value, date, endDate) {
                                    start.config.max = {
                                        year: date.year,
                                        month: date.month - 1,
                                        date: date.date,
                                        hours: date.hours,
                                        minutes: date.minutes,
                                        seconds: date.seconds
                                    }; //结束日选好后，重置开始日的最大日期
                                }
                            });

                            // cnsc类目
                            shopeePormotion_newActivty_cnscCateCascader = layCascader({
                                elem: "#shopeePormotion_activty_cnscCateIds",
                                clearable: true,
                                filterable: true,
                                collapseTags: true,
                                showAllLevels: false,
                                options: shopeePormotion_cateCascader_data,
                                props: {
                                    multiple: true,
                                    label: "label",
                                    value: "value",
                                    children: "children",
                                    checkStrictly: false,
                                },
                            })
                        },
                        yes: function(index, layero) {
                            /*ar time = new Date($("#promotion_startTime").val()).getTime() - new Date().getTime();
                            if (time < 0 || time / (1000 * 60 * 60 * 24) < 1) {
                                layer.msg("开始时间必须是当前时间24小时之后");
                                return;
                            }*/
                            if ($("#promotion_discountName").val() == "") {
                                layer.msg("促销名称不能为空");
                                return;
                            }
                            if ($("#promotion_saveStoreAcct").val() == "") {
                                layer.msg("店铺权限不能为空");
                                return;
                            }
                            if ($("#promotion_startTime").val() == "") {
                                layer.msg("开始时间不能为空");
                                return;
                            }
                            if ($("#promotion_endTime").val() == "") {
                                layer.msg("结束时间不能为空");
                                return;
                            }
                            // if ($("#promotion_purchaseLimit").val() == "") {
                            //     layer.msg("数量限制不能为空");
                            //     return;
                            // }
                            // if ($("#promotion_purchaseLimit").val() < 0) {
                            //     layer.msg("数量限制不能为负数");
                            //     return;
                            // }
                            // if ($("#promotion_discount_redio").val() == "") {
                            //     layer.msg("优惠明细不能为空");
                            //     return;
                            // }
                            // if ($("#promotion_discount_redio").val() < 0) {
                            //     layer.msg("优惠明细不能为负数");
                            //     return;
                            // }


                            //保存调用api同步数据
                            $.ajax({
                                type: 'post',
                                url: ctx + "/shopee/shopeeDiscount/savePromotion.html", //数据接口
                                data: appendDate('',true),
                                dataType: 'json',
                                success: function(res) {
                                    if(res.code=='0000'){
                                        layer.msg('修改促销成功!',{icon:1});
                                    }else{
                                        layer.msg(res.msg || '修改促销失败!',{icon:2});
                                    }
                                }
                            })
                        },
                        btn2: function(index, layero) {
                            var index = layer.confirm('确定要清空内容吗', {
                                btn: ['确定', '取消'] //按钮
                            }, function() {
                                $("#promotion_discountName").val('');
                                $("#promotion_startTime").val('');
                                $("#promotion_endTime").val('');
                                $("#promotion_purchaseLimit").val('');
                                // $("#promotion_discount_redio").val('');
                                $('#promotion_saveStoreAcct').val('');
                                layer.close(index);
                            });
                            return false;
                        },
                        btn3: function(index, layero) {},
                    })
                });
                //监听工具条
                table.on('tool(shopeeforSell_table)', function(obj) {
                    var data = obj.data;
                    // console.log(data);
                    if (obj.event === 'shopee_edit') {
                        //layer.alert('编辑行：<br>'+ JSON.stringify(data))
                        let shopeePormotion_newActivty_cnscCateCascader
                        layer.open({
                            title: '修改活动',
                            type: 'post',
                            area: ['60%', '60%'],
                            id: 'addProductId',
                            btn: ['修改', '关闭'],
                            content: $('#newActivty_layer').html(),
                            data: JSON.stringify(data),
                            success: function() {
                                $('#promotion_startTime').attr('disabled',true);
                                commonReturnPromise({
                                    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
                                    type: 'post',
                                    params: {roleNames: 'shopee专员',platCode: 'shopee'}
                                }).then(res=>{
                                    commonRenderSelect('promotion_saveStoreAcct', res, {name: 'storeAcct', code: 'id'}).then(()=>{
                                    $("#promotion_saveStoreAcct").val(data.storeAcctId); //默认店铺
                                        layui.form.render()
                                    })
                                })
                                $("#promotion_saveStoreAcct").val(data.storeAcctId); //默认店铺
                                // layui.form.render('select'); //只有执行layui.form.render('select');才能重新渲染select元素，更新select的选中项。
                                // form.render('select'); //不加不显示下拉列表
                                $("#promotion_id").html(data.id);
                                $("#promotion_discountName").val(data.discountName); //促销名称
                                $("#promotion_startTime").val(Format(data.startTime,"yyyy-MM-dd hh:mm:ss"));
                                $("#promotion_endTime").val(Format(data.endTime,"yyyy-MM-dd hh:mm:ss"));
                                $("#promotion_purchaseLimit").val(data.purchaseLimit);
                                $('#shopeePormotion_activty').find('input[name=weightMin]').val(data.weightMin)
                                $('#shopeePormotion_activty').find('input[name=weightMax]').val(data.weightMax)
                                // $("#promotion_discount_redio").val(data.discountRatio);
                                // 修改状态下,活动类型隐藏
                                $('#shopeePormotion_activty').find('input[name=autoRenew]').parent().parent().addClass('hidden')
                                // 仅在未开始可以支持修改
                                if(data.discountStatus !== 'upcoming'){
                                    $("#promotion_discountName").attr('disabled',true)
                                    $("#promotion_saveStoreAcct").attr('disabled',true)
                                    $("#promotion_endTime").attr('disabled',true)
                                }
                                form.render()
                                var promotion_startTime = laydate.render({
                                    elem: '#promotion_startTime',
                                    type: 'datetime', //可选择：年月日时分秒
                                    min: -0, //最小日期为当前日期的前一天
                                    max: '2099-6-16 23:59:59',
                                    trigger: 'click', //采用click弹出
                                    done: function(value, date, endDate) {
                                        end.config.min = {
                                            year: date.year,
                                            month: date.month - 1,
                                            date: date.date,
                                            hours: date.hours,
                                            minutes: date.minutes,
                                            seconds: date.seconds
                                        }; //开始日选好后，重置结束日的最小日期
                                        end.config.value = {
                                            year: date.year,
                                            month: date.month - 1,
                                            date: date.date,
                                            hours: date.hours,
                                            minutes: date.minutes,
                                            seconds: date.seconds
                                        }; //将结束日的初始值设定为开始日
                                    }
                                });
                                var promotion_endTime = laydate.render({
                                    elem: '#promotion_endTime',
                                    type: 'datetime', //可选择：年月日时分秒
                                    min: -0, //最小日期为当前日期的前一天
                                    max: '2099-6-16 23:59:59',
                                    trigger: 'click', //采用click弹出
                                    done: function(value, date, endDate) {
                                        start.config.max = {
                                            year: date.year,
                                            month: date.month - 1,
                                            date: date.date,
                                            hours: date.hours,
                                            minutes: date.minutes,
                                            seconds: date.seconds
                                        }; //结束日选好后，重置开始日的最大日期
                                    }
                                });
                                // cnsc类目
                                shopeePormotion_newActivty_cnscCateCascader = layCascader({
                                    elem: "#shopeePormotion_activty_cnscCateIds",
                                    clearable: true,
                                    filterable: true,
                                    collapseTags: true,
                                    showAllLevels: false,
                                    options: shopeePormotion_cateCascader_data,
                                    props: {
                                        multiple: true,
                                        label: "label",
                                        value: "value",
                                        children: "children",
                                        checkStrictly: false,
                                    },
                                })
                                if(data && data.cnscCateIdList){
                                    shopeePormotion_newActivty_cnscCateCascader.setValue(data.cnscCateIdList)
                                };
                            },
                            yes: function(index, layero) {
                                // if ($("#promotion_purchaseLimit").val() == "") {
                                //     layer.msg("数量限制不能为空");
                                //     return;
                                // }
                                // if ($("#promotion_purchaseLimit").val() < 0) {
                                //     layer.msg("数量限制不能为负数");
                                //     return;
                                // }
                                // if ($("#promotion_discount_redio").val() == "") {
                                //     layer.msg("优惠明细不能为空");
                                //     return;
                                // }
                                // if ($("#promotion_discount_redio").val() < 0) {
                                //     layer.msg("优惠明细不能为负数");
                                //     return;
                                // }
                                //修改调用api同步数据
                                let params ={...data, ...appendDate(data,false)}
                                params.startTime = new Date(params.startTime).getTime()
                                params.endTime = new Date(params.endTime).getTime()
                                params.purchaseLimit = $("#promotion_purchaseLimit").val();
                                params.weightMax = $('#shopeePormotion_activty').find('input[name=weightMax]').val()
                                params.weightMin = $('#shopeePormotion_activty').find('input[name=weightMin]').val()
                                params.cnscCateIdsStr = JSON.parse($("#shopeePormotion_activty_cnscCateIds").val() || "[]").join(',')
                                // 仅在未开始可以支持修改
                                if(data.discountStatus === 'upcoming'){
                                    $.ajax({
                                        type: 'post',
                                        url: ctx + "/shopee/shopeeDiscount/updatePromotion.html", //数据接口
                                        data: appendDate(data,false),
                                        dataType: 'json',
                                        success: function(res) {
                                            if(res.code=="0000"){
                                                layer.msg(res.msg || '修改促销信息成功!',{icon:1});
                                                // 修改促销活动限制条件
                                                commonReturnPromise({
                                                    url: '/lms/shopee/shopeeDiscount/updatePromotionLimit',
                                                    type: 'post',
                                                    contentType: 'application/json',
                                                    params: JSON.stringify(params)
                                                }).then(res=>{
                                                    layer.msg('添加活动限制' + res,{icon:1})
                                                    layer.close(index);
                                                    $("#searchPromotion").click();
                                                })
                                            }else{
                                                layer.msg(res.msg || '修改促销信息失败!',{icon:2});
                                            } 
                                        }
                                    })
                                }else{
                                    // 修改促销活动限制条件
                                    commonReturnPromise({
                                        url: '/lms/shopee/shopeeDiscount/updatePromotionLimit',
                                        type: 'post',
                                        contentType: 'application/json',
                                        params: JSON.stringify(params)
                                    }).then(res=>{
                                        layer.msg('添加活动限制' + res,{icon:1})
                                        layer.close(index);
                                        $("#searchPromotion").click();
                                    })
                                }
                                
                            },
                        });

                    }
                });
                // 修改活动类型
                form.on('switch(shopee_promotion_changeStatus)', function (data) {
                        let curVal = data.elem.checked
                        let autoRenew =!!curVal ?1:0
                        // 获取当前行的id
                        let id = $(data.elem).data('id')
                        var _index=''
                        table.cache.shopee_promotionTable.some((elem, index) => {
                            elem.id == id && (_index = index)
                            return elem.id == id
                        });
                        // 调接口,成功后修改table.cache里的缓存
                        commonReturnPromise({
                            url: ctx + '/shopee/shopeeDiscount/autoRenewSetting',
                            params: { discountId:table.cache.shopee_promotionTable[_index].discountId,autoRenew }
                        }).then(() => {
                                layer.msg('设置成功', { icon: 1 })
                                table.cache.shopee_promotionTable[_index].autoRenew = curVal
                             })
                    })
            });
            function process(){
             var index = layer.open({
              type: 1,
              id: Date.now(),
              title: '同步进度',
              area: ['50%', '200px'],
              content:'<div class="m20"><div class="layui-progress layui-progress-big" lay-filter="demo" lay-showpercent="true"><div class="layui-progress-bar" lay-percent="0%"><span class="layui-progress-text">0%</span></div></div></div>',
              success: function () {
              var pro = 0;
              timer = setInterval(function(){
              pro += 1;
              if(pro<97){
              $('.layui-progress-text').text(pro>100?100+'%':pro+'%');
              layui.element.progress('demo', pro+'%');
             }
             },1000);
           }
        });
        }
        function clearprocess(){
            layui.element.progress('demo', '100%');
            setTimeout(function(){
                clearInterval(timer);
                layer.closeAll();
            },1000);
        }
        </script>
        <!--新增弹框-->
        <script type="text/html" id="newActivty_layer">
            <div class="layui-fluid">
                <div class="layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form action="" class="layui-form" id="shopeePormotion_activty">
                            <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><font class="fRed">*</font>促销名称:</label>
                                    <div class="layui-input-block w_50">
                                        <input id="promotion_discountName" name="discountName" placeholder="促销名称" type="text" class="layui-input">
                                        <textarea class='layui-hide' id="promotion_id"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><font class="fRed">*</font>店铺:
                            </label>
                                    <div class="layui-input-block w_50">
                                        <select name="storeAcctId" lay-search id="promotion_saveStoreAcct">
                                    <option value="">店铺</option>
                            </select>
                                    </div>
                                </div>
                            </div>
                            <div calss="layui-card">
                                <div class="layui-form-item disflex">
                                    <label class="layui-form-label" style="flex: none;">数量限制:</label>
                                    <div class="layui-input-block w_50" style="margin-left: 0;flex: none;">
                                        <input name="purchaseLimit" id="promotion_purchaseLimit" type="number" class="layui-input" onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')" onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"  min="0"/>
                                    </div>
                                    <div class="ml10">
                                        <span class="fRed">在listing维度限制每个买家购买活动商品的数量，超过限制数量的部分按原价购买</span>
                                    </div>
                                </div>
                            </div>
                            <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><font class="fRed">*</font>开始时间</label>
                                    <div class="layui-input-block w_50">
                                        <input type="text" name="startTime" placeholder="开始时间" class="layui-input" id="promotion_startTime">
                                    </div>
                                </div>
                            </div>
                            <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><font class="fRed">*</font>结束时间</label>
                                    <div class="layui-input-block w_50">
                                        <input type="text" data-id="promotion_endTime" name="endTime" placeholder="结束时间" class="layui-input" id="promotion_endTime">
                                    </div>
                                </div>
                            </div>
                            <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">活动类型</label>
                                    <div class="layui-input-block w_50">
                                        <input type="radio" name="autoRenew" value="false" title="单次活动">
                                        <input type="radio" name="autoRenew" value="true" title="连续活动">
                                    </div>
                                </div>
                            </div>
                            <div calss="layui-card">
                                <div class="layui-card-header">添加活动限制</div>
                                <div class="layui-card-body" style="padding: 9px 0;">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">重量限制(g):</label>
                                        <div class="layui-input-block disflex w_50">
                                            <input type="number" class="layui-input" name="weightMin" max="10" step="0.01" onblur="commonFormatBlur(this)">
                                            <span class="ml10 mr10">-</span>
                                            <input type="number" class="layui-input" name="weightMax" max="10" step="0.01" onblur="commonFormatBlur(this)">
                                            <div class="w150 ml10" style="line-height: 36px;">闭区间</div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label w100" style="padding: 9px 5px;">指定CNSC类目:</label>
                                        <div class="layui-input-block w_50">
                                            <input id="shopeePormotion_activty_cnscCateIds">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">优惠明细:</label>
                                    <span>在原价格上给予优惠</span>
                                    <div class="layui-input-block" style="display:inline-block;margin-left:0">
                                        <input name="storePSku" id="promotion_discount_redio" type="number" class="layui-input" style="width:50px;" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')" min="0" />
                                    </div>
                                    <span>%</span>
                                    <span>，(填写整数，如需打八折，此处应写“20”)</span>
                                </div>
                            </div> -->
                        </form>
                    </div>
                </div>
            </div>
        </script>
        <script type="text/html" id="shopee_promotion">
            <a class="layui-btn layui-btn-xs" lay-event="shopee_edit">修改</a>
        </script>
        <script type="text/html" id="shopee_promotion_autoRenenw_row">
            <div class="layui-form-item">
                <input type="checkbox" lay-skin="switch"
                    lay-filter="shopee_promotion_changeStatus" data-id="{{d.id}}" lay-text="连续|单次" value="{{d.autoRenew}}" {{d.autoRenew?'checked':''}}>
            </div>
        </script>