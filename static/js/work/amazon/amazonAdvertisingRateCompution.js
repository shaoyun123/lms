; (function () {
    layui.use(['table', 'form', 'element', 'layer', 'laytpl', 'formSelects', 'laydate'], function () {
        var form = layui.form,
            table = layui.table,
            laydate = layui.laydate,
            formSelects = layui.formSelects;

        form.render();
        fillsite();
        render_hp_orgs_users("#amazonAdvertisingRateCompution_search_form");//渲染部门销售员店铺三级联动
        //重置的时候处理三级联动
        $('#amazonAdvertisingRateCompution_reset').on('click', function () {
            $('#amazonAdvertisingRateCompution_online_depart_sel').next().find('dd[lay-value=""]').trigger('click');
        });

        //表单查询
        $('#amazonAdvertisingRateCompution_search_btn').click(function () {
            var formData = serializeObject($('#amazonAdvertisingRateCompution_search_form'));
            if (formData.timeCycle) {
                var timeCycle = formData.timeCycle;
                var startTime = Format(Date.now() - timeCycle * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
                var endTime = Format(Date.now() - 2 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
                formData.analysisTimeBegin = startTime;
                formData.analysisTimeEnd = endTime;
            }

            table.render({
                elem: "#amazonAdvertisingRateCompution_table",
                method: "post",
                url: `${ctx}/amazonAdvertisingRateComputionFinalController/queryPage.html`,
                where: formData,
                totalRow: true,
                cols: [
                    [
                        { title: "店铺名", field: 'storeAcct', width: 100, },
                        { title: "站点", field: 'siteCode', width: 100 },
                        { title: "币种", field: 'currencyCode', width: 100 },
                        { title: "销售员", field: 'salesPersonName', width: 100 },
                        { title: "总销售额$", field: 'totalSalesAmount', sort: true },
                        { title: "广告销售额$", field: 'advertisingSalesAmount', sort: true },
                        { title: "广告花费$", field: 'advertisingCostAmount', sort: true },
                        {
                            title: "acos(广告花费/广告销售额)",
                            field: 'acos',
                            templet: '#amazonAdvertisingRateCompution_acosRate',
                            sort: true,
                        },
                        {
                            title: "acoas(广告花费/总销售额)",
                            field: 'acoas',
                            templet: '#amazonAdvertisingRateCompution_acoasRate',
                            sort: true,
                        },
                        { title: '操作', toolbar: "#amazonAdvertisingRateCompution_operation", width: 100 }
                    ]
                ],
                // created: function (res) {
                //     if (res.code == "0000") {
                //         //手动加一条数据到最后一行 - - ;
                //         var summaryRow = {};
                //         summaryRow.salesPersonName = '合计(美元)';
                //         if (res.extra) {
                //             summaryRow.totalSalesAmount = JSON.parse(res.extra).totalSalesAmount;
                //             summaryRow.advertisingSalesAmount = JSON.parse(res.extra).advertisingSalesAmount;
                //             summaryRow.advertisingCostAmount = JSON.parse(res.extra).advertisingCostAmount;
                //             summaryRow.advertisingCostAmount = JSON.parse(res.extra).advertisingCostAmount;
                //             summaryRow.acos = JSON.parse(res.extra).acos;
                //             summaryRow.acoas = JSON.parse(res.extra).acoas;
                //         }
                //         //放到当前行的最后;作为当前行的数据
                //         res.data.push(summaryRow);
                //     }
                // },
                done: function (res, curr, count) {
                    $('.layui-table-total').find('tbody tr td[data-field=salesPersonName]').find('div').text('合计(美元)')
                    $('.layui-table-total').find('tbody tr td[data-field=totalSalesAmount]').find('div').text(JSON.parse(res.extra).totalSalesAmount)
                    $('.layui-table-total').find('tbody tr td[data-field=advertisingSalesAmount]').find('div').text(JSON.parse(res.extra).advertisingSalesAmount)
                    $('.layui-table-total').find('tbody tr td[data-field=advertisingCostAmount]').find('div').text(JSON.parse(res.extra).advertisingCostAmount)
                    $('.layui-table-total').find('tbody tr td[data-field=acos]').find('div').text(JSON.parse(res.extra).acos + '%')
                    $('.layui-table-total').find('tbody tr td[data-field=acoas]').find('div').text(JSON.parse(res.extra).acoas + '%')
                }
            });
        });

        // 站点渲染
        function fillsite() {
            $.ajax({
                url: `${ctx}/enum/getSiteEnum.html?platCode=amazon`,
                type: 'POST',
                dataType: 'json',
                success: function (returnData) {
                    var arr = [];
                    for (let i = 0; i < returnData.data.length; i++) {
                        var temp = {};
                        temp.name = returnData.data[i].name;
                        temp.value = returnData.data[i].code;
                        arr.push(temp);
                    }
                    formSelects.data('amazonAdvertisingRateComputionsiteIdList', 'local', { arr: arr })
                }
            });
        };

        // 导出功能
        $("#amazonAdvertisingRateCompution_out").click(function () {
            var confirmindex = layer.confirm('确认导出当前搜索条件下的数据？', { btn: ['确认', '取消'] }, function () {
                var data = serializeObject($('#amazonAdvertisingRateCompution_search_form'));
                if (data.timeCycle) {
                    var timeCycle = data.timeCycle;
                    var startTime = Format(Date.now() - timeCycle * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
                    var endTime = Format(Date.now() - 2 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
                    data.analysisTimeBegin = startTime;
                    data.analysisTimeEnd = endTime;
                }
                submitForm(data, ctx + '/amazonAdvertisingRateComputionFinalController/exportQueryResult');
                layer.close(confirmindex);
            })
        });
        $("#amazonAdvertisingRateCompution_detail_out").click(function () {
            var confirmindex = layer.confirm('确认导出每日明细？', { btn: ['确认', '取消'] }, function () {
                var data = serializeObject($('#amazonAdvertisingRateCompution_search_form'));
                if (data.timeCycle) {
                    var timeCycle = data.timeCycle;
                    var startTime = Format(Date.now() - timeCycle * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
                    var endTime = Format(Date.now() - 2 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
                    data.analysisTimeBegin = startTime;
                    data.analysisTimeEnd = endTime;
                }
                submitForm(data, ctx + '/amazonAdvertisingRateComputionFinalController/exportItemDetailResult');
                layer.close(confirmindex);
            })
        });

        //表格事件
        table.on('tool(amazonAdvertisingRateCompution_table)', function (obj) {
            var event = obj.event;
            var data = obj.data;

            //详情
            if (event == 'amazonAdvertisingRateCompution_detail') {
                layer.open({
                    type: 1,
                    title: '广告花费占比明细',
                    btn: ['关闭'],
                    area: ['90%', '80%'],
                    shadeClose: false,
                    content: $('#amazonAdvertisingRateCompution_detail_view').html(),
                    success: function (layero) {
                        var info = `(店铺:${data.storeAcct}  站点:${data.siteCode}  货币:${data.currencyCode})`;
                        $("#amazonAdvertisingRateCompution_item_info_sub_title").html(info);

                        var searchData = {
                            "storeAcctIdList": data.storeAcctId,
                            "siteIdList": data.siteCode
                        };

                        var formData = serializeObject($('#amazonAdvertisingRateCompution_search_form'));
                        if (formData.timeCycle) {
                            var timeCycle = formData.timeCycle;
                            var startTime = Format(Date.now() - timeCycle * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
                            var endTime = Format(Date.now() - 2 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
                            searchData.analysisTimeBegin = startTime;
                            searchData.analysisTimeEnd = endTime;

                            $("#amazonAdvertisingRateCompution_item_info_title").html("近" + (timeCycle - 1) + "日明细");
                        }

                        table.render({
                            elem: "#amazonAdvertisingRateCompution_datadetail_table",
                            method: 'get',
                            url: `${ctx}/amazonAdvertisingRateComputionFinalController/getItemDetail`,
                            where: searchData,
                            totalRow: true,
                            cols: [
                                [
                                    {
                                        field: "analysisTime",
                                        title: "日期",
                                        templet: '<div>{{ Format(d.analysisTime, "yyyy-MM-dd")}}</div>'
                                    },
                                    { field: "salesPersonName", title: "销售员" },
                                    { field: "totalSalesAmount", title: "总销售额$", sort: true },
                                    { field: "advertisingSalesAmount", title: "广告销售额$", sort: true },
                                    { field: "advertisingCostAmount", title: "广告花费$", sort: true },
                                    {
                                        field: "acos",
                                        title: "acos(广告花费/广告销售额)",
                                        templet: "#amazonAdvertisingRateCompution_acos",
                                        sort: true
                                    },
                                    {
                                        field: "acoas",
                                        title: "acoas(广告花费/总销售额)",
                                        templet: "#amazonAdvertisingRateCompution_acoas",
                                        sort: true
                                    }
                                ]
                            ]
                        });

                    }
                });
            }
        });
    });
})();
