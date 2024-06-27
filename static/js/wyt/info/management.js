
layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate','upload'],function(){
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        upload = layui.upload,
        form = layui.form;
    form.render();
    // 人员选择
    render_hp_orgs_users("#orgs_hp_devPerson_managementForm", function(){
        formSelects.render('management_devPerson');
    });
    render_hp_orgs_users("#orgs_hp_saler_managementForm", function(){
        form.render('select');
    });
    //时间渲染
    laydate.render({
        elem: '#management_timeRange'
        ,range: true
    });
    //监听tab点击
    element.on('tab(management-tabs)', function (data) {
        if(data.index == 0){ //注册成功
            $('#management_registStatus').val(2);
            $('#management_batchRegister').addClass('disN');
            $('#management_export').removeClass('disN');
            $('#management_synchroResult').addClass('disN');
            $('#management_synchroInfo').addClass('disN');
            $('[lay-filter="management_submit"]').trigger('click');
            $('.toHideForNotSucc').show()

        }
        else if(data.index == 1){ //注册中
            $('#management_registStatus').val(1);
            $('#management_batchRegister').addClass('disN');
            $('#management_export').addClass('disN');
            $('#management_synchroResult').removeClass('disN');
            $('#management_synchroInfo').removeClass('disN');
            $('[lay-filter="management_submit"]').trigger('click');
            $('.toHideForNotSucc').hide()
        }
        else if(data.index == 2){ //注册失败
            $('#management_registStatus').val(3);
            $('#management_export').addClass('disN');
            $('#management_synchroResult').removeClass('disN');
            $('#management_synchroInfo').removeClass('disN');
            $('#management_batchRegister').removeClass('disN');
            $('[lay-filter="management_submit"]').trigger('click');
            $('.toHideForNotSucc').hide()
        }
    })
    //management命名空间
    var managementName = {
        //渲染销售渠道和头程
        renderChannel: function(){
            var channelInit ='';
            var logistListInit = '<option value="">请选择</option>';
            this.channelAjax().then(function(result){
                //这里是ajax请求的结果渲染
                var channelList = result.channelList || [];
                var logistList = result.logistList || [];
                for(var i=0; i< channelList.length; i++){
                    var item = channelList[i];
                    channelInit +=`<option value="${item.channelCode}">${item.channelName}</option>`;
                }
                for(var k=0; k<logistList.length;k++){
                    var logistListOne =logistList[k];
                    logistListInit += `<option value="${logistListOne.logisAttrName}" alias="${logistListOne.logisAttrAlias}">${logistListOne.logisAttrName}</option>`;
                }
                $('#management_channelSelect').append(channelInit);
                $('#management_logisticAttrRender').append(logistListInit);
                form.render('select');
                $('#management_logisAttrList').append(logistListInit);
            }).catch(function(error){
                layer.msg(error);
            })
        },
        //数据处理
        dataHandle: function(data){
            data.registStatus = $('#management_registStatus').val();
            if (data.bizzOwnerOrganize && !data.bizzOwnerIdListStr) {
                data.bizzOwnerIdListStr = $('#orgs_hp_devPerson_managementForm').find('[lay-filter=users_hp_devPerson_management]').attr('user_ids')
            }
            if (data.salerOrganize && !data.salerIdListStr) {
                // data.salerIdListStr 
                var options = $('#orgs_hp_saler_managementForm').find('[lay-filter=users_hp_saler_management]>option');
                var dataArr = [];
                for(var i=0; i<options.length; i++){
                    var item = options[i];
                    var val = $(item).attr('value');
                    if(val){
                            dataArr.push(val);
                    }
                }
                data.salerIdListStr = dataArr.join(',');
            }
            return data;
        },
        //渲染表格
        tableRender: function(data){
            var _this = this;
            var cols =[];
            if(data.registStatus == 2){
                cols = [
                    [
                        {type: 'checkbox', width: 30},
                        {title: '图片',filed: 'image', templet: '#management_img', width: 70},
                        {title: '销售渠道', field: 'channelInfo', templet: '#management_channelInfo',width:88},
                        {title: 'SKU', filed: 'sku', templet: '#management_sku'},
                        {title: '状态', filed: 'status', templet: '#management_status'},
                        {title: '责任人', filed: 'responser', templet: '#management_responser'},
                        {title: '成本(¥)', field: 'cost', templet: '#management_cost'},
                        {title: '销量', field: 'volume', templet: '#management_volume'},
                        { field: "detail",unresize:true,width:390, title: `
                            <div style="display:flex;">
                                <div style="width:130px;text-align:left;">仓库</div>
                                <div style="width:60px;text-align:center;">待发</div>
                                <div style="width:60px;text-align:center;">在途</div>
                                <div style="width:60px;text-align:center;">可用</div>
                                <div style="width:70px;text-align:center;">库龄</div>
                            </div>
                        `, style:"vertical-align: top",templet:"#management_detail",},
                        {title: '时间',field: 'times', templet: '#management_times'},
                        {title: '操作', toolbar: '#management_toolBar', width: 80}
                    ]
                ]
            }else if(data.registStatus == 3){
                cols = [
                    [
                        {type: 'checkbox', width: 30},
                        {title: '图片',filed: 'image', templet: '#management_img', width: 70},
                        {title: '销售渠道', field: 'channelInfo', templet: '#management_channelInfo',width:88},
                        {title: 'SKU', filed: 'sku', templet: '#management_sku'},
                        {title: '在售', filed: 'isSale', templet: '#management_isSale', width: 40},
                        {title: '简称', field: 'simple', templet: '#management_simple'},
                        {title: '状态', filed: 'status', templet: '#management_status'},
                        {title: '责任人', filed: 'responser', templet: '#management_responser'},
                        {title: '成本(¥)', field: 'cost', templet: '#management_cost'},
                        // {title: '销量', field: 'volume', templet: '#management_volume'},
                        {title: '重量(g)', field: 'weight', templet: '#management_weight'},
                        {title: '尺寸(cm)', field: 'size', templet: '#management_size'},
                        {title: '万邑通数据', field: 'data', templet: '#management_data'},
                        {title: '建议备货量'},
                        {title: '失败原因',templet:'<div>{{d.syncProdInfo.registerRemark}}</div>'},
                        {title: '操作', toolbar: '#management_toolBar', width: 80}
                    ]
                ]
            }else if(data.registStatus == 1){
                cols = [
                    [
                        {type: 'checkbox', width: 30},
                        {title: '图片',filed: 'image', templet: '#management_img', width: 70},
                        {title: '销售渠道', field: 'channelInfo', templet: '#management_channelInfo',width:88},
                        {title: 'SKU', filed: 'sku', templet: '#management_sku'},
                        {title: '在售', filed: 'isSale', templet: '#management_isSale', width: 40},
                        {title: '简称', field: 'simple', templet: '#management_simple'},
                        {title: '状态', filed: 'status', templet: '#management_status'},
                        {title: '责任人', filed: 'responser', templet: '#management_responser'},
                        {title: '成本(¥)', field: 'cost', templet: '#management_cost'},
                        {title: '销量', field: 'volume', templet: '#management_volume'},
                        {title: '重量(g)', field: 'weight', templet: '#management_weight'},
                        {title: '尺寸(cm)', field: 'size', templet: '#management_size'},
                        {title: '万邑通数据', field: 'data', templet: '#management_data'},
                        {title: '建议备货量'},
                        {title: '操作', toolbar: '#management_toolBar', width: 80}
                    ]
                ]
            }

            table.render({
                elem: '#management_table',
                method: 'post',
                url: '/lms/winitSalerProductsManage/queryPage.html',
                where:  data,
                page: true,
                limits: [50, 100, 300],
                limit: 300,
                id: "management_tableId",
                cols: cols,
                done: function(){
                    _this.watchBar();
                    imageLazyload();
                    _this.getManagementNumber(data).then(function(result){
                        $('#management-tabs').find('.regist_status1').html(result.regist_status_1);
                        $('#management-tabs').find('.regist_status2').html(result.regist_status_2);
                        $('#management-tabs').find('.regist_status3').html(result.regist_status_3);
                    }).catch(function(err){
                        layer.msg(err);
                    })
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(management_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'showCompList'){ //链接
                    var index = layer.open({
                        type: 1,
                        title: '竞品链接',
                        btn: ['关闭'],
                        area: ['800px', '600px'],
                        id: 'management_linkDetailLayerId',
                        content: $('#management_linkDetailLayer').html(),
                        success: function(layero, index){
                            _this.getLinksAjax(data.prodSInfo.pId).then(function(result){
                                var getTpl = management_linkDetailContainerTpl.innerHTML,
                                view = document.getElementById('management_linkDetailContainer');
                                laytpl(getTpl).render(result, function(html){
                                    view.innerHTML = html;
                                });
                            }).catch(function(err){
                                layer.msg(err);
                            })
                        }
                    });
                }else if(obj.event == 'showPrePublishPrice'){ //成本
                    var Adata = {
                        prodSId: data.prodSId,
                        cost: accAdd(data.prodSInfo.purchaseCostPrice, data.prodSInfo.innerPackCost),
                        weight: accAdd(data.prodSInfo.suttleWeight, data.prodSInfo.packWeight),
                    }
                    tpl_listReferPrice(null,null, Adata)
                }else if(obj.event == 'register'){ //注册
                    layer.confirm('确定要注册该产品吗?', {icon: 6, title:'注册产品'}, function(index){
                        _this.registerAjax(JSON.stringify([data.syncProdInfo.id])).then(function(result){
                            layer.msg(result || '注册成功!');
                            $('[lay-filter="management_submit"]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon: 2});
                        })
                        layer.close(index);
                    });
                }else if(obj.event == 'transfer'){ //转移
                    _this.transferLayer(data.id);
                }else if(obj.event == 'edit'){//修改
                    var index = layer.open({
                        type: 1,
                        title: '修改',
                        area: ['600px', '600px'],
                        btn: ['保存', '关闭'],
                        id: 'management_editLayerId',
                        content: $('#management_editLayer').html(),
                        success: function(layero, index){
                            // console.log(data);
                            layero.find('[name=descCn]').val(data.descCn || '');
                            layero.find('[name=importDeclareValue]').val(data.importDeclareValue || '');
                            layero.find('[name=skuLink]').val(data.skuLink || '');
                            layero.find('[name=winitDescription]').val(data.winitDescription || '');
                        },
                        yes: function(index, layero){
                            var obj = {};
                            obj.id = data.id;
                            obj.descCn = layero.find('[name=descCn]').val();
                            obj.importDeclareValue = layero.find('[name=importDeclareValue]').val();
                            obj.skuLink = layero.find('[name=skuLink]').val();
                            obj.winitDescription = layero.find('[name=winitDescription]').val();
                            if(!obj.descCn){
                                return layer.msg('商品简称不能为空!')
                            }
                            if(!obj.importDeclareValue){
                                return layer.msg('进口申报价值不能为空!')
                            }
                            if(!obj.skuLink){
                                return layer.msg('竞品链接不能为空!')
                            }
                            _this.editAjax(JSON.stringify(obj)).then(function(result){
                                layer.close(index);
                                layer.msg(result || '修改成功!');
                                $('[lay-filter="management_submit"]').trigger('click');
                            }).catch(function(err){
                                layer.msg(err);
                            })
                        }
                    })
                }else if(obj.event == 'print'){ //打印
                    var registerSku = data.registerSku;
                    if(!registerSku){
                        return layer.msg('该数据没有注册sku,无法打印!');
                    };
                    layer.prompt({
                        formType: 0,
                        value: 1,
                        title: '请输入打印数量(必须大于0且是整数)',
                      }, function(value, index){
                        if(Number(value) <=0){
                            return layer.msg('输入的数必须大于0!')
                        }else{
                            _this.printAjax([{
                                registerSku: registerSku,
                                printNum: Number(value)
                            }]).then(function(result){
                                let obj ={};
                                obj.printType = 16;
                                obj.base64 = result.data;
                                obj.width = "60";
                                obj.height = "40";
                                printBase64(obj);
                                layer.close(index);
                                layer.msg('开始打印,请稍后...');
                            }).catch(function(err){
                                layer.msg('打印出错,请刷新,如果还不行,联系开发!');
                            })
                        }
                    });
                }else if(obj.event == 'setprice'){//定价
                    var $spanTxt = $(this).text().trim() == 'NaN' ? 0 : ($(this).text().trim());
                    data.avgCost = Number($spanTxt);
                    commonSetPriceFn(data);
                }else if(obj.event == 'sale'){//售卖
                    layer.confirm('确认修改销售状态为售卖状态吗?',{icon: 3, title:'提示'}, function(index){
                        _this.switchStatusAjax(data.id, true).then(function(result){
                            layer.close(index);
                            layer.msg('修改销售状态成功!',{icon:1});
                            $('[lay-filter="management_submit"]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err, {icon:2});
                        })
                    });
                }else if(obj.event == 'notSale'){ //改为不卖
                    layer.confirm('确认修改销售状态为不卖状态吗?',{icon: 3, title:'提示'}, function(index){
                        _this.switchStatusAjax(data.id, false).then(function(result){
                            layer.close(index);
                            layer.msg('修改销售状态成功!',{icon:1});
                            $('[lay-filter="management_submit"]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err, {icon:2});
                        })
                    });
                }else if(obj.event == 'logs'){ //日志
                    _this.logsAjax(data.channel, data.registerSku).then(function(result){
                        if(!result.length){
                            return layer.msg('暂无日志!', {icon: 7});
                        }
                        layer.open({
                            type: 1,
                            title: '日志',
                            area: ['800px', '600px'],
                            btn: ['关闭'],
                            content: $('#mangement_logsTable').html(),
                            success: function(){
                                var getTpl = mangement_logsTableTpl.innerHTML,
                                view = document.getElementById('mangement_logsTableContainer');
                                laytpl(getTpl).render(result, function(html){
                                    view.innerHTML = html;
                                });
                            }
                        });
                    }).catch(function(err){
                        layer.msg(err, {icon: 2});
                    })
                }else if(obj.event == 'detail'){ //刊登详情
                    _this.publishDetailAjax(data.registerSku,data.channel).then(function(result){
                        if(!result.length){
                            return layer.msg('暂无详情数据!', {icon: 7});
                        }
                        layer.open({
                            type: 1,
                            title: '刊登详情',
                            area: ['95%', '600px'],
                            btn: ['关闭'],
                            content: $('#mangement_publishDetailLayer').html(),
                            id: 'mangement_publishDetailLayerId',
                            success: function(){
                                var getTpl = mangement_publishDetailTpl.innerHTML,
                                view = document.getElementById('mangement_publishDetailContainer');
                                laytpl(getTpl).render(result, function(html){
                                    view.innerHTML = html;
                                });
                            }
                        })
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    })
                }
            })
        },
        //批量注册
        batchRegister: function(){
            var _this = this;
            $('#management_batchRegister').on('click', function(){
                commonTableCksSelected('management_tableId').then(function(result){
                    var idArr = result.map(function(item){
                        return item.syncProdInfo.id;
                    });
                    layer.confirm('确定要注册选中的产品吗?', {icon: 6, title:'注册'}, function(index){
                        _this.registerAjax(JSON.stringify(idArr)).then(function(result){
                            layer.msg(result || '注册成功!');
                            $('[lay-filter="management_submit"]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon: 2});
                        })
                        layer.close(index);
                    });
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            })
        },
        //批量转移
        batchTransfer: function(){
            var _this = this;
            $('#management_batchTransfer').on('click', function(){
                commonTableCksSelected('management_tableId').then(function(result){
                    var idArr = result.map(function(item){
                        return item.id;
                    });
                    _this.transferLayer(idArr);
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            })
        },
        //导出
        exportHandle: function(){
            var _this = this;
            $('#management_export').on('click', function(){
                var data = $('#management_searchForm').serializeObject();
                if (data.bizzOwnerOrganize && !data.bizzOwnerIdListStr) {
                    data.bizzOwnerIdListStr = $('#orgs_hp_devPerson_managementForm').find('[lay-filter=users_hp_devPerson_management]').attr('user_ids')
                }
                if (data.salerOrganize && !data.salerIdListStr) {
                    // data.salerIdListStr
                    var options = $('#orgs_hp_saler_managementForm').find('[lay-filter=users_hp_saler_management]>option');
                    var dataArr = [];
                    for(var i=0; i<options.length; i++){
                        var item = options[i];
                        var val = $(item).attr('value');
                        if(val){
                            dataArr.push(val);
                        }
                    }
                    data.salerIdListStr = dataArr.join(',');
                }
                // var xhr = new XMLHttpRequest(); 
                // xhr.open('POST', '/lms/winitSalerProductsManage/exportData.html', true);
                // xhr.responseType = 'blob';
                // xhr.setRequestHeader('Content-type', 'application/json; application/octet-stream');
                // xhr.onload = function(e){
                //     if (this.status == 200) { 
                //         var blob = new Blob([this.response], {type: 'application/vnd.ms-excel'}); 
                //         var downloadUrl = URL.createObjectURL(blob); 
                //         var a = document.createElement("a"); 
                //         a.href = downloadUrl; 
                //         a.download = "万邑通产品信息.xlsx"; 
                //         document.body.appendChild(a); 
                //         a.click(); 
                //     } else { 
                //     alert('Unable to download excel.') 
                //     } 
                // };
                // xhr.send(JSON.stringify(data));
                submitForm(data, ctx + '/winitSalerProductsManage/exportData.html');
            });
        },
        //汇总
        summaryHandle: function(){
            var _this = this;
            $('#management_summary').on('click', function(){
                var data = $('#management_searchForm').serializeObject();
                if (data.bizzOwnerOrganize && !data.bizzOwnerIdListStr) {
                    data.bizzOwnerIdListStr = $('#orgs_hp_devPerson_managementForm').find('[lay-filter=users_hp_devPerson_management]').attr('user_ids')
                }
                if (data.salerOrganize && !data.salerIdListStr) {
                    // data.salerIdListStr
                    var options = $('#orgs_hp_saler_managementForm').find('[lay-filter=users_hp_saler_management]>option');
                    var dataArr = [];
                    for(var i=0; i<options.length; i++){
                        var item = options[i];
                        var val = $(item).attr('value');
                        if(val){
                            dataArr.push(val);
                        }
                    }
                    data.salerIdListStr = dataArr.join(',');
                }
                // console.log(data);
                layer.open({
                    type: 1,
                    title: '汇总',
                    btn: ['关闭'],
                    area: ['1100px', '700px'],
                    content: $('#mangement_summaryLayer').html(),
                    id: 'mangement_summaryLayerId',
                    success: function(layero,index){
                        table.render({
                            elem: '#mangement_summaryContainer_table',
                            method: 'post',
                            url: '/lms/winitSalerProductsManage/summaryData.html',
                            where:  data,
                            page: false,
                            // totalRow: true, //开启合计行
                            id: "mangement_summaryContainer_tableId",
                            cols: [
                                [
                                    {title: '销售', field: 'saler',templet: `<div>{{d.saler || ''}}</div>`},
                                    {title: '渠道', field: 'channel',templet: `<div>{{d.channel || ''}}</div>`},
                                    {title: '注册SKU总数', field: 'registerSkuNum',templet: `<div>{{d.registerSkuNum || 0}}</div>`},
                                    {title: '总成本', filed: 'totalCost',templet: `<div>{{d.totalCost || 0}}</div>`},
                                    {title: 'SKU平均成本', filed: 'skuAvgCost',templet: `<div>{{d.skuAvgCost || 0}}</div>`},
                                    {title: '可用数量', filed: 'availableQty',templet: `<div>{{d.availableQty || 0}}</div>`},
                                    {title: '0-30', filed: 'merchandiseAge1',templet: `<div>{{d.merchandiseAge1 || 0}}</div>`},
                                    {title: '31-60', filed: 'merchandiseAge2',templet: `<div>{{d.merchandiseAge2 || 0}}</div>`},
                                    {title: '61-90', filed: 'merchandiseAge3',templet: `<div>{{d.merchandiseAge3 || 0}}</div>`},
                                    {title: '>90', filed: 'merchandiseAge4',templet: `<div>{{d.merchandiseAge4 || 0}}</div>`}
                                ]
                            ],
                        });
                    }
                })
            });
        },
        //补货
        replenish: function(){
            var _this = this;
            $('#management_replenishment').on('click', function(){
                commonTableCksSelected('management_tableId').then(function(result){
                    var index = layer.open({
                        type: 1,
                        title: '补货',
                        btn: ['补货','关闭'],
                        area: ['80%', '700px'],
                        id: 'mangement_replenishmentLayerId',
                        content: $('#mangement_replenishmentLayer').html(),
                        success: function(layero, index){
                            Promise.all([_this.getAllHouseAjax(), _this.getAllChannelAjax()]).then(function(resultArr){
                                for(var i=0;i<result.length;i++){
                                    var item = result[i];
                                    item.warehouseArr = resultArr[0];
                                    item.channelArr = resultArr[1];
                                }
                                var getTpl = mangement_replenishmentTpl.innerHTML,
                                view = document.getElementById('mangement_replenishmentContainer');
                                laytpl(getTpl).render(result, function(html){
                                    view.innerHTML = html;
                                    form.render('select');
                                });

                                var getTpl2 = mangement_channelTpl.innerHTML,
                                view2 = document.getElementById('channelSelect');
                                laytpl(getTpl2).render(result[0], function(html){
                                    view2.innerHTML = html;
                                    form.render('select');
                                });
                            }).catch(function(err){
                                layer.msg(err);
                            })
                        },
                        yes: function(index, layero){
                            var $trs = layero.find('tbody>tr');
                            var dataArr = [];
                            for(var j=0; j<$trs.length; j++){
                                var tr = $trs[j];
                                var obj = {};
                                obj.registerSku = $(tr).find('td:nth-child(1)').text();//注册sku
                                obj.winitStoreId = $(tr).find('td:nth-child(3)').find('select').val();//目的仓仓库id
                                obj.saleLogisticsType = $(tr).find('td:nth-child(4)').find('select').val();//头程渠道id
                                obj.planAmount = $(tr).find('td:nth-child(5)').find('input').val(); //发货数量
                                dataArr.push(obj);
                            };
                            _this.replenishAjax(dataArr).then(function(res){
                                layer.close(index);
                                layer.msg('新增补货计划成功!',{icon:1});
                                $('[lay-filter="management_submit"]').trigger('click');
                            }).catch(function(err){
                                layer.msg(err,{icon:2});
                            })
                        }
                    });
                }).catch(function(err){
                    layer.msg(err,{icon:7});
                })
            });
        },
        //同步结果
        synchroResult: function(){
            var _this = this;
            $('#management_synchroResult').on('click', function(){
                commonTableCksSelected('management_tableId').then(function(result){
                    var idArr = result.map(function(item){
                        return item.syncProdInfo.id;
                    });
                    _this.synchroResultAjax(idArr).then(function(result){
                        layer.msg(result || '同步注册结果成功!');
                        $('[lay-filter="management_submit"]').trigger('click');
                    }).catch(function(err){
                        layer.msg('请求失败',{icon: 2});
                    })
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            })
        },
        //同步信息
        synchroInfo: function(){
            var _this = this;
            $('#management_synchroInfo').on('click', function(){
                commonTableCksSelected('management_tableId').then(function(result){
                    var idArr = result.map(function(item){
                        return item.syncProdInfo.id;
                    });
                    _this.synchroInfoAjax(idArr).then(function(result){
                        layer.msg('同步万邑通商品信息成功!');
                        $('[lay-filter="management_submit"]').trigger('click');
                    }).catch(function(err){
                        layer.msg('请求失败',{icon: 2});
                    })
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            })
        },
        //转移产品弹框
        transferLayer: function(ids){
            var _this = this;
            var index = layer.open({
                type: 1,
                title: '转移产品',
                area: ['500px', '600px'],
                btn: ['保存', '关闭'],
                id: 'management_transferLayerId',
                content: $('#management_transferLayer').html(),
                success: function(layero, index){
                    render_hp_orgs_users("#orgs_hp_saler_managementLayerForm", function(){
                        form.render('select');
                    });
                },
                yes: function(index,layero){
                    var obj = {};
                    obj.idList = typeof(ids) === "number" ? [ids] : ids
                    obj.newSalerId = Number(layero.find('select[name=salerIdListLayerStr]').val().trim());
                    obj.newSaler = layero.find('select[name=salerIdListLayerStr] option:selected').text();
                    if(!obj.newSalerId){
                        return layer.msg('请选择新销售');
                    }
                    _this.transferAjax(JSON.stringify(obj)).then(function(result){
                        layer.close(index);
                        layer.msg(result || '转移产品成功');
                        $('[lay-filter="management_submit"]').trigger('click');
                    }).catch(function(err){
                        layer.msg(err);
                    })
                }
            })
        },
        //ajax请求
        //销售渠道和物流属性ajax请求
        channelAjax: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/winitSalerProductsManage/queryParamEnum.html',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data)
                        }else{
                            reject('请求接口失败,请稍后重试')
                        }
                    }
                })
            })
        },
        //获取竞品链接ajax请求(完成)id=data.prodSInfo.pId(76720)
        getLinksAjax: function(id){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/winitSInfo/getOriginCompListAndRecommendReason.html',
                    contentType: 'application/json',
                    data: JSON.stringify({prodPId: id}),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data)
                        }else{
                            reject('获取竞品链接接口请求返回数据出错!')
                        }
                    },
                    error: function(err){
                        reject(err)
                    }
                })
            })
        },
        //转移产品接口
        transferAjax: function(obj){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/winitSalerProductsManage/transferSaleProduct.html',
                params: obj
            })
        },
        //注册产品接口
        registerAjax: function(ids){
            return commonReturnPromise({
                type: 'post',
                url: '/lms/winitSalerProductsManage/registerWinitInfo.html',
                contentType: 'application/json',
                params: ids
            })
        },
        //修改产品接口
        editAjax: function(obj){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/winitSalerProductsManage/updateProduct.html',
                params: obj
            })
        },
        //销售产品管理的数量获取
        getManagementNumber: function(data){
            return commonReturnPromise({
                url: '/lms/winitSalerProductsManage/countStatusForTab.html',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                params: data
            })
        },
        //同步注册结果
        synchroResultAjax: function(ids){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/winitSalerProductsManage/syncWinitRegistResult.html',
                params: JSON.stringify(ids)
            })
        },
        //同步万邑通商品信息
        synchroInfoAjax: function(ids){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/winitSalerProductsManage/syncWinitProduct.html',
                params: JSON.stringify(ids)
            })
        },
        //打印接口
        printAjax: function(obj){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/winitSalerProductsManage/printSkuTag.html',
                params: JSON.stringify(obj)
            })
        },
        //售卖/不卖状态切换
        switchStatusAjax: function(id, ifSale){
            return commonReturnPromise({
                url: '/lms/winitSalerProductsManage/updateSaleStatus.html',
                params: {
                    id: id,
                    ifSale: ifSale
                }
            })
        },
        //日志请求
        logsAjax: function(channel, registerSku){
            return commonReturnPromise({
                url: '/lms/winitSalerProductsManage/getLogs.html',
                params: {
                    channel: channel,
                    registerSku: registerSku
                }
            });
        },
        //刊登详情请求
        publishDetailAjax: function(registerSku,channel){
            return commonReturnPromise({
                url: '/lms/winitSalerProductsManage/getListingDetail.html',
                params: {
                    registerSku: registerSku,
                    channel:channel
                }
            })
        },
        //获取所有的万邑通仓库请求
        getAllHouseAjax: function(){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/winitDeliverGoodsPlan/getWinitStoreList.html'
            })
        },
        //获取所有的万邑通头程渠道请求
        getAllChannelAjax: function(){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/winitDeliverGoodsPlan/getSaleLogisticsType.html'
            })
        },
        //补货请求ajax
        replenishAjax:function(data){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/winitDeliverGoodsPlan/addPlanList.html',
                params: JSON.stringify(data)
            });
        }
    }
    //表单搜索事件
    form.on('submit(management_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var obj = managementName.dataHandle(data);
        // console.log(obj);
        if(!(obj.merchandiseAgeMin || obj.merchandiseAgeMax) && (obj.ageStockMin || obj.ageStockMax)){
            return layer.msg('不能单独只输入库存,请输入库龄!',{icon: 7});
        }
        managementName.tableRender(obj);
    });
    form.on('select(management_channelFilter)', function(obj){
        var val = obj.value;
        if(val){
            $('#management_ifLetter').find('select').attr('disabled', false);
        }else{
            $('#management_ifLetter').find('select').val('');
            $('#management_ifLetter').find('select').attr('disabled', true);
        }
        form.render('select');
    })
    //渠道,头程,物流属性
    managementName.renderChannel();
    //批量注册
    managementName.batchRegister();
    //批量转移
    managementName.batchTransfer();
    //同步结果
    managementName.synchroResult();
    //同步信息
    managementName.synchroInfo();
    //汇总
    managementName.summaryHandle();
    //导出
    managementName.exportHandle();
    //补货
    managementName.replenish();
    //表头固定
    UnifiedFixedFn('managementCard');


    //悬浮显示表格
    $('#managementCard').on('mouseover', '.management_channelHover', function(){
        var data = JSON.parse($(this).next().val());
        var tableStr = `<div><table class="layui-table managementHoverTable">
                        <thead>
                            <tr>
                                <th>销售</th>
                                <th>选品时间</th>
                            </tr>
                        </thead>
                        <tbody>
                    `
        for(var i=0; i<data.length; i++){
            var item= data[i];
            tableStr += `<tr>
                            <td style="">${item.saler}</td>
                            <td>${Format(item.createTime, 'yyyy-MM-dd')}</td>
                        </tr>`
        }
        tableStr +='</tbody></table></div>';
        layer.tips(tableStr,this,{tips: [1,'#fff'],time:10000,area:['250px']})
    });
    $('#managementCard').on('mouseleave', '.management_channelHover', function(){
        layer.close(layer.tips());
    });
    //悬浮显示表格2
    $('#managementCard').on('mouseover', '.management_registerHover', function(){
        var data = JSON.parse($(this).next().val());
        var tableStr = `<div>
                    <table class="layui-table">
                        <thead>
                            <tr>
                                <th>重量(g)</th>
                                <th>尺寸(cm)</th>
                                <th>万邑通数据</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div><span class="secondary">实重: </span>${accAdd(data.prodSInfo.suttleWeight || 0, data.prodSInfo.packWeight || 0).toFixed(2)  }</div>
                                    <div><span class="secondary">抛重(5): </span>${accDiv(accMul(accMul(data.prodSInfo.outerBoxLength || 0, data.prodSInfo.outerBoxWidth || 0), data.prodSInfo.outerBoxHeight || 0),5).toFixed(2) }</div>
                                    <div><span class="secondary">抛重(6): </span>${accDiv(accMul(accMul(data.prodSInfo.outerBoxLength || 0, data.prodSInfo.outerBoxWidth || 0), data.prodSInfo.outerBoxHeight || 0),6).toFixed(2)}</div>
                                    <div><span class="secondary">抛重(8): </span>${accDiv(accMul(accMul(data.prodSInfo.outerBoxLength || 0, data.prodSInfo.outerBoxWidth || 0), data.prodSInfo.outerBoxHeight || 0),8).toFixed(2) }</div>
                                </td>
                                <td>
                                    <div><span class="secondary">包裹长: </span>${data.prodSInfo.outerBoxLength || ''}</div>
                                    <div><span class="secondary">包裹宽: </span>${data.prodSInfo.outerBoxWidth || ''}</div>
                                    <div><span class="secondary">包裹高: </span>${data.prodSInfo.outerBoxHeight || ''}</div>
                                </td>
                                <td>
                                    <div><span class="secondary">申报价值：</span>${data.importDeclareValue || ''}</div>
                                    <div><span class="secondary">进口税率：</span>${data.importRate || ''}</div>
                                    <div><span class="secondary">禁止入库：</span>${data.ifProhibitInStock ? '是' : '否'}</div>
                                    <div><span class="secondary">头程类型：</span>${management_getFirstWayTypeName(data.firstWayType || '') || ''}</div>
                                    <div><span class="secondary">备注：</span>${data.winitDescription || ''}</div>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                        </div>
                    `
        layer.tips(tableStr,this,{tips: [1,'#fff'],time:10000,area:['600px']});
    });
    $('#managementCard').on('mouseleave', '.management_registerHover', function(){
        layer.close(layer.tips());
    });

})


function hanldeSetChannel(obj) {
    var form = layui.form;
    let val = $('#setChannel').val() || ''
    $("#replenishTbale").find("tr").each((index,item) => {
        $(item).find('select[name=channel]').val(val)
    })
    form.render()
}

function hanldeSetCount(obj) {
    var form = layui.form;
    let val = $('#setCount').val() || ''
    $("#replenishTbale").find("tr").each((index,item) => {
        $(item).find('input[name=number]').val(val)
    })
    form.render()
}
