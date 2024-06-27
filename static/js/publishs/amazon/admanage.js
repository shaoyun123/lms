;(function($,layui,window,document,undefined){

    layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate','selectInput'],function(){
        var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        selectInput = layui.selectInput,
        formSelects = layui.formSelects,
        form = layui.form;
        var orderDirection = "desc";
        var admangeName = {
            //搜索条件处理start
            triggerClick: function(){
                $('[lay-filter=admanage_filter]').trigger('click');
            },
            //渲染时间
            timeRender: function(){
                var date = new Date();
                date.setDate(date.getDate());
                var endTime = format(date, 'yyyy-MM-dd');
                date.setDate(date.getDate() - 7);
                var beginTime = format(date, 'yyyy-MM-dd');
                var timeStr = beginTime + ' - ' + endTime;
                laydate.render({
                    elem: '#admanage_times',
                    type: 'date',
                    value: timeStr,
                    range: true
                    ,min: -61 //61天前
                });
            },
            //部门+销售员+店铺三级联动, 初始化站点,CPC专员
            storeSiteRender: function(){
                //渲染部门销售员店铺三级联动
                render_hp_orgs_users("#admanage_searchForm");
                //站点渲染
                this.siteAjax().then(function(result){
                    commonRenderSelect('admanage_site', result.amzonSiteList, {
                        name: 'siteName',
                        code: 'siteId'
                    }).then(function(){
                        form.render('select');
                    })
                }).catch(function(err){
                    layer.msg(err, {icon:2});
                });
                this.cpcAjax().then(function(result){
                    commonRenderSelect('admanage_cpcPersonId', result, {
                        name: 'userName',
                        code: 'id'
                    }).then(function(){
                        form.render('select');
                    })
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            },
            selectInputFn: function(){
                //渲染广告组合
                // this.selectInputRender('admange_combination', 'advertisingPortfolioName',2);
                selectInput.render({
                    // 容器id，必传参数
                    elem: '#admange_combination',
                    name: 'advertisingPortfolioName', // 渲染的input的name值
                    initValue:'', // 渲染初始化默认值
                    placeholder: '可选可输入', // 渲染的inputplaceholder值
                    focusShow: true,
                    focusMethod: function(value,cb){
                        commonReturnPromise({
                            type: 'post',
                            contentType: 'application/json',
                            url: '/lms/amazonAdvertisingPage/listAmazonportfolioName',
                            params: JSON.stringify({
                                campaignNamePrefix: '',
                            }),
                            isLoading: false
                        }).then(function(result){
                            return cb(result)
                        });
                    },
                    remoteSearch: true,
                    remoteMethod: _.debounce(function(value, cb){
                        if (!value) {
                            return cb([]);
                        }
                        commonReturnPromise({
                            type: 'post',
                            contentType: 'application/json',
                            url: '/lms/amazonAdvertisingPage/listAmazonportfolioName',
                            params: JSON.stringify({
                                portfolioNamePrefix: value,
                            }),
                            isLoading: false
                        }).then(function(result){
                            return cb(result)
                        });
                    }, 300)
                });
                //渲染广告活动
                // this.selectInputRender('admange_activity', 'advertisingCampaign', 1);
                selectInput.render({
                    // 容器id，必传参数
                    elem: '#admange_activity',
                    name: 'advertisingCampaign', // 渲染的input的name值
                    initValue:'', // 渲染初始化默认值
                    placeholder: '可选可输入', // 渲染的inputplaceholder值
                    focusShow: true,
                    focusMethod: function(value,cb){
                        const storeIdList = formSelects.value('admanage_store_sel', 'val');
                        if (!storeIdList.length) {
                            return cb([]);
                        }
                        commonReturnPromise({
                            type: 'post',
                            contentType: 'application/json',
                            url: '/lms/amazonAdvertisingPage/listAmazonCampaignName',
                            params: JSON.stringify({
                                campaignNamePrefix: '',
                                storeIdList
                            }),
                            isLoading: false
                        }).then(function(result){
                            return cb(result)
                        });
                    },
                    remoteSearch: true,
                    remoteMethod:  _.debounce(function(value, cb){
                        const storeIdList = formSelects.value('admanage_store_sel', 'val');
                        if (!storeIdList.length && !value) {
                            return cb([]);
                        }
                        commonReturnPromise({
                            type: 'post',
                            contentType: 'application/json',
                            url: '/lms/amazonAdvertisingPage/listAmazonCampaignName',
                            params: JSON.stringify({
                                campaignNamePrefix: value,
                                storeIdList
                            }),
                            isLoading: false
                        }).then(function(result){
                            return cb(result)
                        });
                    }, 300)
                });
                form.render();
            },
            selectInputRender: function(id, name, type){
                selectInput.render({
                    // 容器id，必传参数
                    elem: '#'+id,
                    name: name, // 渲染的input的name值
                    initValue:'', // 渲染初始化默认值
                    placeholder: '可选可输入', // 渲染的inputplaceholder值
                    remoteSearch: true,
                    remoteMethod: function(value, cb){
                        if (!value) {
                            return cb([]);
                        }
                        commonReturnPromise({
                            type: 'post',
                            contentType: 'application/x-www-form-urlencoded',
                            url: '/lms/amazonAdvertisingPage/queryAmazonCampaignOrAdGroupName.html',
                            params: {
                                name: value,
                                type: type
                            },
                            isLoading: false
                        }).then(function(result){
                            return cb(result)
                        });
                    }
                });
                form.render();
            },
            tabHandle: function(){
                var $hiddenInput = $('#admanage_searchForm').find('[name=pageType]');
                var _this = this;
                element.on('tab(admanage_tabs)', function(obj){
                    var index = obj.index;
                    if(index == 0){ //广告活动
                        $hiddenInput.val(1);
                    }else if(index == 1){ //广告组
                        $hiddenInput.val(2);
                    }
                    _this.triggerClick();
                })
            },
            dataHandle: function(data){
                if(data.times){
                    var timeArr =data.times.split(' - ');
                    data.startDate = timeArr[0].replace(/\-/g, '');
                    data.endDate = timeArr[1].replace(/\-/g, '');
                }else{
                    data.startDate = '';
                    data.endDate='';
                }
                delete data.times;
                return data;
            },
            //搜索条件处理end

            //表格处理start
            tableRender: function(data){
                var _this = this;
                table.render({
                    elem: '#admanage_table',
                    id: 'admanage_tableId',
                    method: 'POST',
                    where: data,
                    url: '/lms/amazonAdvertisingPage/searchAmazonAdvertising.html',
                    cols: _this.colsHandle(data.pageType),
                    page: true,
                    limit:300,
                    limits:[300,500,1000],
                    created: function(res){
                        var data = res.data;
                        if(data != null){
                            for (var temp=0; temp<data.length; temp++){
                                var acosValue = data[temp].acos;
                                var clickConversionValue = data[temp].clickConversion;
                                var orderConversionValue = data[temp].orderConversion;
                                var strAcos=Number(acosValue*100).toFixed(2);
                                var strClick=Number(clickConversionValue*100).toFixed(2);
                                var strOrder=Number(orderConversionValue*100).toFixed(2);
                                strAcos+="%";
                                strClick+="%";
                                strOrder+="%";
                                data[temp].acos = strAcos;
                                data[temp].clickConversion = strClick;
                                data[temp].orderConversion = strOrder;
                            }
                            return {
                                "code": res.code, //解析接口状态
                                "msg": res.msg, //解析提示文本
                                "count": res.count, //解析数据长度
                                "data": data //解析数据列表
                            };
                        }
                    },
                    done: function(res,curr,count){
                        console.log(res);
                        $('td[data-field="dailyBudget"] div').css({
                            color:"#1E9FFF",
                            "text-decoration":"underline"
                        })
                        _this.watchBar();
                        table.on('sort(admanage_tableFilter)', function(obj) {
                            var result = _this.getFormData();
                            if(obj.type != null){
                                if(orderDirection == "asc"){
                                    orderDirection = "desc";
                                }else{
                                    orderDirection = "asc";
                                }
                                result["orderBy"] = obj.field+" "+orderDirection;
                            }
                            var realData = admangeName.dataHandle(result);

                            admangeName.tableRender(realData);
                        });
                    }
                });
            },

            colsHandle: function(type){
                var cols;
                if(type==1){ //广告活动
                    cols = [
                        [
                            { title: "", type: "checkbox"},
                            { field: "status", title: "状态", templet: '#ad_tabletemplet_type' },
                            { title: "广告组合<br>广告活动", field: "adInfo", templet: "#admanage_adInfo",width:225},
                            // { title: "广告活动<br>广告组合", field: "campaignName",width:225},
                            { title: "广告组数量", field: "adGroupNumber",width: 100},
                            { title: "店铺名", field: "storeAcct", width: 100},
                            { title: "站点", field: "siteId", width: 70},
                            { title: "投放时间<br>竞价策略", field: "strategy", templet: "#admanage_strategy"},
                            { title: "每天预算($)", field: "dailyBudget",edit: 'text',sort: true},
                            { title: "广告花费<br>ROAS", field: "cost",sort: true},
                            { title: "销售额", field: "saleAmount",sort: true},
                            { title: "ACOS", field: "acos"},
                            { title: "曝光量", field: "impressions",sort: true},
                            { title: "点击量", field: "clicks",sort: true},
                            { title: "点击率", field: "clickConversion"},
                            { title: "CPC", field: "cpcConversion"},
                            { title: "订单量", field: "orderNumber",sort: true},
                            { title: "销量", field: "saleNumber",sort: true},
                            { title: "订单转化率", field: "orderConversion"},
                            { title: "同步时间<br>CPC会员", field: "syncAndCPC",templet: "#admanage_syncAndCPC",width:135}
                        ]
                    ];
                }else{//广告组
                    cols = [
                        [
                            { title: "广告组", field: "adGroupName"},
                            { title: "所属广告组合<br>所属广告活动", field: "adInfo", templet: "#admanage_adInfo",width:225},
                            { title: "店铺名", field: "storeAcct", width: 100},
                            { title: "关键词数量", field: "keywordNumber"},
                            { title: "商品数量", field: "productNumber"},
                            { title: "广告花费<br>ROAS", field: "cost",sort: true},
                            { title: "销售额", field: "saleAmount",sort: true},
                            { title: "ACOS", field: "acos"},
                            { title: "曝光量", field: "impressions",sort: true},
                            { title: "点击量", field: "clicks",sort: true},
                            { title: "点击率", field: "clickConversion"},
                            { title: "CPC", field: "cpcConversion"},
                            { title: "订单量", field: "orderNumber",sort: true},
                            { title: "销量", field: "saleNumber",sort: true},
                            { title: "订单转化率", field: "orderConversion"},
                            { title: "同步时间<br>CPC会员", field: "syncAndCPC",templet: "#admanage_syncAndCPC",width:135}
                        ]
                    ];
                }
                return cols;
            },

            watchBar: function(){
                var _this = this;
                table.on('tool(admanage_tableFilter)', function(obj){
                    var layEvent = obj.event; //获得 lay-event 对应的值
                    var data = obj.data;
                    if(layEvent == 'setActiCpc' || layEvent == 'setActiHasCpc'){
                        _this.activityCpc(data);
                    }
                });
            },
            /*设置cpc专员*/
            activityCpc: function(data){
                var _this = this;
                var cpcPersonId = data.cpcPersonId || '';
                var type = data.type || 1;
                var trId = type==1 ? data.campaignSysId: data.adGroupSysId;
                var campaignId = data.campaignId || '';
                var adGroupId = data.adGroupId || '';
                layer.open({
                    type: 1,
                    title: '设置cpc专员',
                    btn: ['保存','取消'],
                    area: ['600px', '600px'],
                    content: $('#admanage_CpcActivityLayer').html(),
                    id: 'admanage_CpcActivityLayerId',
                    success: function(){
                        _this.cpcAjax().then(function(result){
                            commonRenderSelect('admanage_CpcActivity_sel', result, {
                                name: 'userName',
                                code: 'id',
                                selected: cpcPersonId
                            }).then(function(){
                                form.render();
                                if(type==1){
                                    $('#admanage_CpcActivityShow').show();
                                }else{
                                    $('#admanage_CpcActivityShow').hide();
                                }
                            })
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        });
                    },
                    yes: function(index,layero){
                        var $selVal = layero.find('#admanage_CpcActivity_sel').val();
                        var $isCks = layero.find('#admanage_CpcActivity_cks').is(':checked');
                        if(!$selVal){
                            return layer.msg('请选择专员',{icon:7});
                        }
                        var obj;
                        if(type==1){
                            obj = {
                                type: type,
                                sysId: trId,
                                cpcPersonId:$selVal,
                                uniqueId: campaignId,
                                useToAdGroup: $isCks ? 1: 0
                            };
                        }else{
                            obj = {
                                type: type,
                                sysId: trId,
                                cpcPersonId:$selVal,
                                uniqueId: adGroupId,
                            };
                        }
                        _this.editCpcAjax(obj).then(function(result){
                            layer.msg(result || '修改成功',{icon:1});
                            layer.close(index);
                            _this.triggerClick();
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }
                })
            },
            //表格处理end

            //公共按钮处理start
            exportExcelHandle: function(){
                var _this = this;
                var $form = $("#admanage_searchForm");
                $('#admanage_ExportExcelBtn').on('click', function(){
                    var times = $form.find('[name=times]').val();
                    if(!times.length){
                        return layer.msg('必须选择一个统计时间',{icon:7});
                    }
                    var timeArr =times.split(' - ');
                    var startDate = timeArr[0].replace(/\-/g, '');
                    var endDate = timeArr[1].replace(/\-/g, '');
                    console.log(startDate+'-------'+startDate);

                    var intStartMonth = parseInt(startDate.substring(4,6));
                    var intEndMonth = parseInt(endDate.substring(4,6));
                    console.log(intStartMonth+'-------'+intEndMonth);
                    if(intEndMonth - intStartMonth > 6){
                        return layer.msg('统计时间必须在六个月之内');
                    }
                    var realData = _this.getFormData();
                    var obj = admangeName.dataHandle(realData);
                    _this.exportExcelAjax(obj)

                });
            },


            syscActivityHandle: function(){
                var _this = this;
                var $form = $("#admanage_searchForm");
                $('#admanage_syscActivityBtn').on('click', function(){
                    var storeId = formSelects.value('admanage_store_sel', 'val');
                    var siteId = $form.find('[name=siteId]').val();
                    if(!storeId.length){
                        return layer.msg('必须选择一个店铺',{icon:7});
                    }
                    if(storeId && storeId.length>1){
                        return layer.msg('只能选择一个店铺',{icon:7});
                    }
                    if(!siteId){
                        return layer.msg('必须选择一个站点',{icon:7});
                    }
                    _this.syncActivityAjax(storeId[0], siteId).then(function(result){
                        layer.msg(result || '同步成功',{icon:1});
                        _this.triggerClick();
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    })
                });
            },
            syscGroupHandle: function(){
                var _this = this;
                var $form = $("#admanage_searchForm");
                $('#admanage_syscGroupBtn').on('click', function(){
                    var storeId = formSelects.value('admanage_store_sel', 'val');
                    var siteId = $form.find('[name=siteId]').val();
                    if(!storeId.length){
                        return layer.msg('必须选择一个店铺',{icon:7});
                    }
                    if(storeId && storeId.length>1){
                        return layer.msg('只能选择一个店铺',{icon:7});
                    }
                    if(!siteId){
                        return layer.msg('必须选择一个站点',{icon:7});
                    }
                    _this.syncGroupAjax(storeId[0], siteId).then(function(result){
                        layer.msg(result || '同步成功',{icon:1});
                        _this.triggerClick();
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    })
                });
            },
            //公共按钮处理end
            //ajax请求
            /*站点*/
            siteAjax: function(){
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/onlineProductAmazon/getAllAmazonSite.html'
                })
            },
            /*cpc专员*/
            cpcAjax: function(){
                return commonReturnPromise({
                    url: '/lms/amazonAdvertisingPage/getCpcPersonList.html'
                });
            },
            /*Excel导出*/
            exportExcelAjax: function(realData){
                var index = layer.load(1);
                console.log(realData);
                axios({
                    method: 'post',
                    url: '/lms/amazonAdvertisingPage/exportExcelByStartDateAndEndDate.html',
                    params: realData
                    ,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    responseType: 'blob'
                }).then((res) => { // 处理返回的文件流
                    layer.close(index);
                    console.log(res);
                    let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
                    let url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a') // 创建a标签
                    link.href = url
                    link.download = '广告管理-'+format(Date.now(),"yyyy-MM-dd")+'.xlsx' // 重命名文件
                    link.click()
                    URL.revokeObjectURL(url);
                })
            },
            /*同步广告活动*/
            syncActivityAjax: function(storeId, siteId){
                return commonReturnPromise({
                    url: '/lms/amazonAdvertisingPage/syncCampaignByStoreIdAndSite.html',
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    params: {
                        storeId: storeId,
                        siteId: siteId
                    }
                });
            },
            /*同步广告组*/
            syncGroupAjax: function(storeId, siteId){
                return commonReturnPromise({
                    url: '/lms/amazonAdvertisingPage/syncAdGroupByStoreIdAndSite.html',
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    params: {
                        storeId: storeId,
                        siteId: siteId
                    }
                });
            },
            /*编辑CPC专员 */
            editCpcAjax: function(obj){
                return commonReturnPromise({
                    url: '/lms/amazonAdvertisingPage/updateCpcPerson.html',
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    params: obj
                })
            },
        //    获取表单元素
            getFormData: function(){
                var result = {};
                var $form = $("#admanage_searchForm");
                var data = $form.serializeArray();
                $.each(data, function() {
                    result[this.name] = this.value;
                });
                return result;
            }
            // 改变广告活动状态
            ,changeCampaignStateAjax: function(obj){
                return commonReturnPromise({
                    url: '/lms/amazonAdvertisingPage/changeCampaignState.html',
                    type: 'post',
                    contentType: 'application/json',
                    params: JSON.stringify(obj)
                })
            }
        };
        //可选可输渲染函数
        admangeName.selectInputFn();
        //渲染部门店铺等
        admangeName.storeSiteRender();
        //渲染时间
        admangeName.timeRender();
        //tab时间
        admangeName.tabHandle();
        //同步
        admangeName.syscActivityHandle();
        admangeName.syscGroupHandle();
        admangeName.exportExcelHandle();

        // 监听单元格编辑
        table.on('edit(admanage_tableFilter)', function(obj){
            let dailyBudget = obj.value,
                salesAcctId = obj.data.salesAcctId,
                campaignId = obj.data.campaignId,
                siteId = obj.data.siteId;
            commonReturnPromise({
                url: '/lms/amazonAdvertisingPage/updateAmazonAdvertisingCampaign',
                type: 'POST',
                contentType: 'application/json',
                params: JSON.stringify({
                    salesAcctId:salesAcctId,
                    campaignId:campaignId,
                    siteId:siteId,
                    dailyBudget:dailyBudget
                })
            }).then(res=>{
                layer.alert(res,{icon:1})
            }).catch(err=>{
                admangeName.triggerClick()
                layer.alert(err,{icon:2})
            })
        });

        // 批量开启暂停归档
        form.on('select(admanage_batch_select)', function(data){
            let tableData = table.checkStatus("admanage_tableId").data,arr = [],state={1:"enabled",2:"paused",3:"archived"};

            tableData.forEach(item => {
                arr.push({
                    'campaignId':item.campaignId,
                    'state':state[data.value],
                    'name':item.campaignName
                })
            })
            let popIndex = layer.confirm("确定要修改此状态吗？", function() {
                admangeName.changeCampaignStateAjax(arr).then(res=>{
                    admangeName.triggerClick()
                    layer.alert(res,{icon:1})
                }).catch(err=>{
                    admangeName.triggerClick()
                    layer.alert(err,{icon:2})
                })
            })
        });

        // 更新规则状态
        form.on('switch(ad_tabletemplet_state)', function(data) {
            let status = data.elem.checked == true ? "enabled" : "paused";
            let checked = data.elem.checked;
            let arr = {
                'campaignId':data.value,
                'state':status,
                'name':$(data.elem).data("name")
            }
            let popIndex = layer.confirm("确定要修改此状态吗？", function() {
                admangeName.changeCampaignStateAjax(arr).then(res=>{
                    layer.alert(res,{icon:1})
                    layer.close(popIndex);
                }).catch(err=>{
                    layer.alert(err,{icon:2})
                    data.elem.checked = !checked;
                    layer.close(popIndex);
                    form.render();
                })
            }, function() {
                data.elem.checked = !checked;
                form.render();
            });
        });

        //表单搜索
        form.on('submit(admanage_filter)', function(data){
            var data = data.field; //获取到表单提交对象
            var obj = admangeName.dataHandle(data);
            admangeName.tableRender(obj);
        });
        UnifiedFixedFn('admanageCard');
    });


})(jQuery, layui, window, document);
