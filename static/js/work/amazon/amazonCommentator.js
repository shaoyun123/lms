;(function () {
        layui.use(['table', 'form', 'element', 'layer', 'laytpl', 'formSelects','laydate'], function () {
            var form = layui.form,
                table = layui.table,
                laydate = layui.laydate,
                formSelects = layui.formSelects;
    
            form.render();
            fillsite();
            render_hp_orgs_users("#amazonCommentator_search_form");//渲染部门销售员店铺三级联动
            //重置的时候处理三级联动
            $('#amazonCommentator_reset').on('click', function(){
                $('#amazonCommentator_online_depart_sel').next().find('dd[lay-value=""]').trigger('click');
            })
             //年月选择器
            laydate.render({
                elem: '#amazonCommentator_postedDateStr'
                ,type: 'month'
            });
    
            //表单查询
            $('#amazonCommentator_search_btn').click(function () {
               amazonCommentator_tablerender_fun();
            });
    
            amazonCommentator_tablerender_fun=() => {
                var data = serializeObject($('#amazonCommentator_search_form'));
                table.render({
                    elem: "#amazonCommentator_table",
                    method: "post",
                    url: `${ctx}/amazonRevenueAnalysisController/reviewEnrollment/queryPage.html`,
                    where: data,
                    totalRow: true,
                    cols: [
                        [
                            {title: "店铺名", field: 'storeName',},
                            {title: "站点", field: 'siteName',templet:"#amazonCommentator_t1"},
                            {title: "店铺负责人", field: 'salesPersonName',},
                            {title: "费用($)", field: 'totalAmountUsd',},
                            {title: "ParentASIN", field: 'parentAsin',},
                            {title: "入账日期", field: 'postedDatePdt',templet:"#amazonCommentator_data" },
                        ]
                    ],
                    page: true,
                    limits: [100, 500, 1000],
                    created: function (res) {
                        if (res.code == "0000") {
                            //手动加一条数据到最后一行 - - ;
                            var summaryRow = {};
                            summaryRow.storeName = '总计'
                            summaryRow.siteName = ''
                            if (res.msg) {
                                summaryRow.totalAmountUsd = JSON.parse(res.msg).totalAmount;
                            }
                            //放到当前行的最后;作为当前行的数据
                            res.data.push(summaryRow);
                        }
                    },
                    done: function () {
                        imageLazyload();
                    },
                    limit: 100,
                });
            };
            table.on('tool(amazonCommentator_table)', function (obj) {
                var layEvent = obj.event; // 获得 lay-event 对应的值
                var data = obj.data; // 获得当前行数据
                console.log(layEvent,"layEvent")
            if (layEvent === 'anazonseckill_site') {
                var index = layer.open({
                    type: 1,
                    title: '调整站点',
                    area: ['500px', '30%'],
                    shadeClose: false,
                    btn: ['保存', '关闭'],
                    content: $('#amazonCommentator_newsitelist').html(),
                    success: function (layero) {
                        // 站点渲染
                        $("#amazonCommentator_newsitefrom select[name=siteCode]").val(data.siteCode)
                        form.render()
                        $.ajax({
                            url: `${ctx}/amazonRevenueAnalysisController/dealPayment/getRegionAllSitesByOneSite`,
                            type: 'get',
                            dataType: 'json',
                            data:{siteCode: data.siteCode},
                            success: function (returnData) {
                                if (returnData.code == "0000") {
                                    appendSelect($('#amazonCommentator_newsitefrom').find('select[name="siteCode"]'), returnData.data.resultList, 'code', 'name') 
                                    form.render('select');                    
                                }
                            }
                        });
                    },
                    yes: function (index, layero) {
                        var newdata = serializeObject($('#amazonCommentator_newsitefrom'));
                        newdata.id = data.id;
                        $.ajax({
                            url: `${ctx}/amazonRevenueAnalysisController/reviewEnrollment/editReviewEnrollmentDefaultSite`,
                            type: 'post',
                            dataType: "json",
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify(newdata),
                            success: function (returnData) {
                                if (returnData.code == "0000") {
                                   layer.msg(returnData.msg)
                                   layer.close(index)
                                   amazonseckill_tablerender_fun()
                        
                                }
                                 if(returnData.code == "9999"){
                                    layer.msg(returnData.msg)
                                    layer.close(index)
                                   return
                                   }
                            }
                        });
                    },
                })
            }
            })
    
            // 站点渲染
            function fillsite() {
                $.ajax({
                    url: `${ctx}/enum/getSiteEnum.html?platCode=amazon`,
                    type: 'POST',
                    dataType: 'json',
                    success: function (returnData) {
                        var arr = [];
                        for (let i = 0; i < returnData.data.length; i++) {
                            var temp = {};
                            temp.name = returnData.data[i].name;
                            temp.value = returnData.data[i].code;
                            arr.push(temp);
                        }
                        formSelects.data('amazonCommentatorsiteIdList', 'local', {arr: arr})
                    }
                });
            };
    
            // 导出功能
            $("#amazonCommentator_out").click(function () {
                var confirmindex = layer.confirm('确认导出当前搜索条件下的早期评论者统计？', {btn: ['确认', '取消']}, function () {
                    var data = serializeObject($('#amazonCommentator_search_form'));
                    submitForm(data, ctx + '/amazonRevenueAnalysisController/reviewEnrollment/exportData')
                    layer.close(confirmindex);
                })
            })
        })
     //填充下拉框
    function appendSelect(aDom, data, code, label, attachment) {
        aDom.empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                attachment ?
                    data[i].code = data[i][code] + '_' + data[i][attachment] :
                    data[i].code = data[i][code].toString() || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        aDom.append(option)
    }
    
    })()