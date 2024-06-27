layui.use(["admin", "form", "table", "layer", "laytpl", 'laydate', 'element', 'formSelects'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        element = layui.element;
    $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");
    laydate.render({
        elem: '#settlementEndDate', //渲染时间
        range: true
    });

    laydate.render({
        elem: '#depositTime', //渲染时间
        range: true
    });

    render_hp_orgs_users("#amazonCollectionStatistics_SearchForm"); //渲染部门销售员店铺三级联动
    amazonOnline_initSite(); //初始化amazon站点下拉框

    /**
     * 初始化amazon站点
     */
    function amazonOnline_initSite() {
        var Sites = [];
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductAmazon/getAllAmazonSite.html",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var str = "<option value=''></option>";
                    $(returnData.data.amzonSiteList).each(function () {
                        // str += "<option value='" + this.siteId + "'>" + this.siteName + "</option>";
                        Sites.push({name: this.siteName, value: this.siteId})
                    });
                    //$("#amazon_online_site_sel").html(str);
                    formSelects.data('amazon_online_site_sel', 'local', {arr: Sites})
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        })
    };

    amazonCollectionStatisticsTable();

    function amazonCollectionStatisticsTable() {
        table.render({
            elem: "#amazonCollectionStatisticsTable",
            method: "post",
            contentType: 'application/json',
            url: ctx + "/amazonSettlementFinal/queryPage.html",
            where: getAmazonProdExtraInfoSearchInfo(),
            cols: [
                [
                    //标题栏
                    {field: "", type: "checkbox"},
                    {field: "storeAcct", title: "店铺名"},
                    {field: "siteCode", title: "站点"},
                    {field: "salesPersonName", title: "销售员"},
                    {field: "settlementGroupId", title: "结算组编号"},
                    {field: "settlementPeriod", title: "结算周期", width: 200},
                    {
                        field: "", title: "结算金额", templet:
                            `<div>{{d.paymentAmountOriginal}} {{d.currency}}
                        <br>{{d.paymentAmountUsd}} USD
                        <br>{{d.paymentAmountCny}} CNY
                        </div>`
                    },
                    {field: "accountBalance", title: "账户余额"},
                    {field: "paymentStatus", title: "结算状态"},
                    {field: "depositTime", title: "转账日期", templet: '<div>{{ Format(d.depositTime,"yyyy-M-d")}}</div>'},
                    {field: "depositStatus", title: "转账状态"},
                    {field: "accountEndingNumber", title: "账户尾号"},
                    {field: "traceId", title: "追踪编码"},
                    {field: "", title: "备注"},
                    //绑定工具条
                    {
                        title: "操作",
                        align: "center",
                        toolbar: "#amazonCollectionStatisticsEditBar",
                    },
                ],
            ],
            id: "amazonCollectionStatisticsTable",
            page: true,
            limits: [10, 50, 100, 200],
            limit: 50
        });
    }

    //搜索
    $("#amazonCollectionStatistics_search").click(function () {
        amazonCollectionStatisticsTable();
    });

    table.on("tool(amazonCollectionStatisticsTable)", function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event;

        if (layEvent === "download") {
            loading.show();
            transBlob({
                url: ctx + "/amazonSettlementFinal/exportSettlementDetail",
                formData: JSON.stringify({
                    "settlementGroupId": data.settlementGroupId,
                    "siteCode": data.siteCode,
                    "storeAcctId": data.storeAcctId
                }),
                fileName: '结算明细',
                contentType: 'application/json'
            }).then(function (result) {
                loading.hide();
            }).catch(function (err) {
                layer.msg(err, {icon: 2});
            });
        }
    });

    $("#amazonCollectionStatistics_export").click(function () {
        loading.show();
        transBlob({
            url: ctx + "/amazonSettlementFinal/exportQueryList",
            formData: JSON.stringify(getAmazonProdExtraInfoSearchInfo()),
            fileName: '查询列表',
            contentType: 'application/json'
        }).then(function (result) {
            loading.hide();
        }).catch(function (err) {
            layer.msg(err, {icon: 2});
        });
    })

    function getAmazonProdExtraInfoSearchInfo() {
        let amazonCollectionStatistics_SearchForm = serializeObject($('#amazonCollectionStatistics_SearchForm'))

        // amazonCollectionStatistics_SearchForm.salesPersonIds = amazonCollectionStatistics_SearchForm.salesPersonIds === ""? []:amazonCollectionStatistics_SearchForm.salesPersonIds.split(",").map(Number)
        amazonCollectionStatistics_SearchForm.siteIdList = amazonCollectionStatistics_SearchForm.siteIdList === "" ? [] : amazonCollectionStatistics_SearchForm.siteIdList.split(",")
        amazonCollectionStatistics_SearchForm.storeAcctIdList = amazonCollectionStatistics_SearchForm.storeAcctIdList === "" ? [] : amazonCollectionStatistics_SearchForm.storeAcctIdList.split(",").map(Number)

        //日期
        var depositTime = amazonCollectionStatistics_SearchForm.depositTime;
        if (depositTime) {
            amazonCollectionStatistics_SearchForm.depositTimeBegin = Date.parse(depositTime.split(" - ")[0] + " 00:00:00");
            amazonCollectionStatistics_SearchForm.depositTimeEnd = Date.parse(depositTime.split(" - ")[1] + " 23:59:59");
        }

        var settlementEndDate = amazonCollectionStatistics_SearchForm.settlementEndDate;
        if (settlementEndDate) {
            amazonCollectionStatistics_SearchForm.settlementEndDateBegin = Date.parse(settlementEndDate.split(" - ")[0] + " 00:00:00");
            amazonCollectionStatistics_SearchForm.settlementEndDateEnd = Date.parse(settlementEndDate.split(" - ")[1] + " 23:59:59");
        }

        delete amazonCollectionStatistics_SearchForm.settlementEndDate;
        delete amazonCollectionStatistics_SearchForm.depositTime;
        return amazonCollectionStatistics_SearchForm;
    }
})

