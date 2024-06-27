;(function () {
    layui.use(['table', 'form', 'element', 'layer', 'laytpl', 'formSelects'], function () {
        var form = layui.form,
            table = layui.table,
            formSelects = layui.formSelects;

        form.render();
        fillcheckbox();
        render_hp_orgs_users("#accountstatus_search_form");//渲染部门销售员店铺三级联动

        //表单查询
        $('#account_search_btn').click(function () {
            account_tablerender_fun();
        });

        form.on('submit(search_btn)', function (data) {
            var AttrArr = [];
            $("#accountstatus_search_form").find("[name='siteIds']:checked").each(function () {
                AttrArr.push(this.value);
            })
            data.field["siteIds"] = AttrArr.length > 0 ? JSON.stringify(AttrArr) : undefined;
            data.field["salesPersonOrgId"] = data.field.salesPersonOrgId ? data.field.salesPersonOrgId : undefined;
            data.field["salesPersonId"] = data.field.salesPersonId ? data.field.salesPersonId : undefined;
            data.field["storeAcctIds"] = data.field.storeAcctIds ? data.field.storeAcctIds : undefined;
            layui.table.render({
                elem: "#account_table",
                method: "post",
                url: `${ctx}/amazonAccount/queryPage.html`,
                id: 'account_table',
                where: data.field,
                cols: [
                    [
                        {title:  `<p>店铺</p>站点`, templet: '#account_tp1_0', width: 100},
                        {title: `<p>订单缺陷率</p>60天低于1%`, field: 'orderDefectRate', templet: '#account_tp1_1', sort: true},
                        {
                            title: `<p>订单缺陷</p>负面反馈%`,
                            field: 'orderDefectRateNegativeFeedbackRate',
                            templet: '#account_tp1_2',
                            sort: true
                        },
                        {
                            title: `<p>订单缺陷</p>亚马逊商城交易保障索赔`,
                            field: 'orderDefectRateProtectionClaimRate',
                            templet: '#account_tp1_3',
                            sort: true,
                            width: 170
                        },
                        {
                            title: `<p>订单缺陷</p>信用卡拒付索赔`,
                            field: 'orderDefectRateProtestClaimRate',
                            templet: '#account_tp1_4',
                            sort: true
                        },
                        {
                            title: `<p>发票缺陷率</p>7天低于5%`,
                            field: 'invoiceDefectRate',
                            templet: '#account_tp1_5',
                            sort: true
                        },
                        {title: `<p>延迟发货率</p>7天低于4%`, field: 'delayRate10', templet: '#account_tp1_6', sort: true},
                        {title: `<p>延迟发货率</p>30天低于4%`, field: 'delayRate30', templet: '#account_tp1_7', sort: true},
                        {
                            title: `<p>配送取消率</p>7天低于2.5%`,
                            field: 'deliveryCancellationRate',
                            templet: '#account_tp1_8',
                            sort: true
                        },
                        {
                            title: `<p>有效追踪率</p>30天超过95%`,
                            field: 'effectiveTrackingRate',
                            templet: '#account_tp1_9',
                            sort: true
                        },
                        {
                            title: `<p>准时交货率</p>30天超过97%`,
                            field: 'onTimeDeliveryRate',
                            templet: '#account_tp1_10',
                            sort: true
                        },
                        {
                            title: `<p>退货不满意度</p>30天低于10%`,
                            field: 'returnDissatisfactionRate',
                            templet: '#account_tp1_11',
                            sort: true
                        },
                        {
                            title: `<p>账户状况评级</p>200分以上为健康`,
                            field: 'returnDissatisfactionRate',
                            templet: '#account_tp1_13',
                            sort: true
                        },
                        {
                            title: `<p>商品不合规</p>180天0个商品`,
                            field: 'ahrScoreIntValue',
                            templet: '#account_tp1_12',
                            sort: true,
                            width: 170
                        },
                    ]
                ],
                page: true,
                limits: [100, 500, 1000],
                created: function (res) {
                    const policyObj ={
                        'policySuspectedInfringementOfIntellectualPropertyRights':'涉嫌侵犯知识产权',
                        'policyIntellectualPropertyComplaints':'知识产权投诉',
                        'policyBuyerComplaintAboutProductAuthenticity':'商品真实性买家投诉',
                        'policyCommodityConditionBuyerComplaints':'商品状况买家投诉',
                        'policyFoodAndCommoditySafetyIssues':'食品和商品安全问题',
                        'policyListingPolicyViolation':'上架政策违规',
                        'policyViolationOfRestrictedProductsPolicy':'违反受限商品政策',
                        'policyViolationOfBuyerProductReviewPolicy':'违反买家商品评论政策',
                        'policyOtherPolicyViolations':'其他违反政策',
                        'policyViolationWarning':'违反政策警告'
                }
                    if (res.code == "0000") {
                        res.data.forEach(item=>{
                            let hasPolicyList = []
                            Object.keys(item).forEach(v=>{
                               if(item[v] && policyObj[v]) {
                                hasPolicyList.push({value:item[v],label:policyObj[v]})
                               }
                            })
                            item.hasPolicyList=hasPolicyList
                            if(hasPolicyList.length>4){
                                item.wholePolicyStr = hasPolicyList.map(v=>`${v.label}(${v.value})`).join('<br>')
                            }
                        });
                    }
                },
                done: function () {
                    imageLazyload();
                },
                limit: 100,
            });
        })

        // 站点渲染
        function fillcheckbox() {
            var html = '';
            $.ajax({
                url: `${ctx}/amazon/getAmazonCountryByMap`,
                type: 'get',
                dataType: 'json',
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        for (var i = 0; i < returnData.data.length; i++) {
                            var item = returnData.data[i];
                            html += `<input type="checkbox" title ="${item.name}" lay-skin="primary" value="${item.code}" name="siteIds">`;
                        }
                        $("#siteIds").html(html);
                        form.render('checkbox');
                    }
                }
            });
        };

        // 导出功能
        $("#accountstatus_out").click(function () {
            var confirmindex = layer.confirm('确认导出当前搜索条件下的账户状况？', {btn: ['确认', '取消']}, function () {
                var obj = {};
                var AttrArr = [];
                $("#accountstatus_search_form").find("[name='siteIds']:checked").each(function () {
                    AttrArr.push(this.value);
                })
                obj.storeAcctIds = formSelects.value("accountstatus_online_store_sel", "val");//店铺id
                obj.salesPersonOrgId = $("#accountstatus_online_depart_sel ").val();
                obj.salesPersonId = $("#accountstatus_online_salesman_sel ").val();
                obj.siteIds = AttrArr.length > 0 ? JSON.stringify(AttrArr) : '';
                submitForm(obj, ctx + '/amazonAccount/exportQueryData.html')
                layer.close(confirmindex);
            })
        })
    })
})()
