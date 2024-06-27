/**
 * @date 2020/5/12
 * @author ztt
 */
layui.use(['admin', 'table', 'form', 'element', 'layer', 'laytpl', 'formSelects', 'laydate'], function () {
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        form = layui.form;
    form.render();
    render_hp_orgs_users("#shopifyAcctSearchForm");//渲染部门销售员店铺三级联动

    var shopify_searchType =1;
    //点击事件(切换选项)
    element.on('tab(shopify-tabs)', function (data) {
        if (data.index == 0) { //数量
            shopify_searchType = 1;
            $('#shopify_searchType').val(1); //设置数量tab的值
            $('[lay-filter="shopify_submit"]').trigger('click');
        } else if (data.index == 1) { //查看已到期域名
            shopify_searchType = 2;
            $('#shopify_searchType').val(2);//设置已到期域名tab的值
            $('[lay-filter="shopify_submit"]').trigger('click');
        }
    });

    function batchUpdateAcctStatus(obj) {
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/batchUpdateAcctStatus.html", //请求接口地址
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(obj), //需要post的数据
            success: function (res) {
                loading.hide();
                //后台程序返回数据
                if (res.code == "0000") {
                    $('[lay-filter="shopify_submit"]').trigger('click');
                    layer.closeAll();
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    }

    function getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('shopify_tableId'); //test即为基础参数id对应的值
        var checkAcctNum = checkStatus.data.length;
        if (checkAcctNum == null || checkAcctNum < 1) {
            return acctIds;
        }
        var acctData = checkStatus.data;
        for (var index in acctData) {
            var obj = acctData[index];
            acctIds.push(acctData[index].id);
        }
        return acctIds;
    }

    //命名空间
    var shopifyName = {
        //表格请求前的数据处理
        dataHandle: function (data) {
            data.searchType = shopify_searchType; //切换表格的tab取值
            return data;
        },
        //渲染表格
        tableRender: function (data) {
            var _this = this;
            table.render({
                elem: "#shopify_table",
                method: "post",
                url: ctx + "/salesplat/salesPlatAccountDtoPage.html?platCode=shopify", //接口需要改
                id: 'shopify_tableId',
                where: data,
                cols: [
                    [
                        {type: "checkbox", width: 32},
                        {field: "storeAcct", title: "店铺名称",},
                        // {field: "allrootAliasName", title: "普源别名"},
                        {field: "imgDomain", title: "图片域名",width: 200,
                            templet: `<div>
                    <div class="alignLeft">
                        {{# if(d.expireTime){ }}
                            域名: {{d.imgDomain}}
                        <br>
                           到期时间: {{ Format(d.expireTime,"yyyy-MM-dd")}}
                        {{# }else{ }}
                           {{d.imgDomain}} 
                        {{# } }}
                    </div>
               </div>`
                        },
                        {field: "status", title: "店铺状态", templet: '#shopifyAcctStatusTpl', width: 65},
                        {field: "salesperson", title: "销售员"},
                        {field: "sellLeaderName", title: "销售主管"},
                        // {
                        //     field: "orderDownloadStatus",
                        //     title: "订单下载",
                        //     templet: "#orderDownloadStatusTemplet",
                        //     width: 90
                        // },
                        {field: "syncStatus", title: "同步lisiting状态", templet: "#shopifySyncStatus",},
                        {field: "lastSyncTime", title: "上次同步时间", templet: "#shopifyLastSyncTime",},
                        {field: "syncDesc", title: "同步异常备注", templet: "#syncDesc"},
                        {field: "remark", title: "备注"},
                        {field: "shopifyInventoryLocationName", title: "默认Location"},
                        {title: '操作', toolbar: '#shopify_tableIdBar', width: 80}
                    ]
                ],
                done: function (res) {
                    if(res.code == '0000'){
                        $("#shopify_account_colLen").text(res.extra.mainTab);
                        $("#shopify_acct_domain_overdue_number").text(res.extra.sevenTab);
                    }else{
                        $("#shopify_account_colLen").text(0);
                        $("#shopify_acct_domain_overdue_number").text(0);
                    }

                    theadHandle().fixTh({id: '#shopifyLayuiCard'})
                    _this.watchBar();
                }
            })
        },
        //监听表格事件
        watchBar: function () {
            var _this = this;
            table.on('tool(shopify_tableFilter)', function (obj) {
                var data = obj.data;
                if (obj.event == 'edit') { //编辑
                    _this.editDataAjax(data.id).then(function (result) {
                        result.id = data.id;
                        _this.storeLayer(result);
                    }).catch(function (err) {
                        layer.msg(err);
                    })
                }
            });
        },
        //监听批量操作的选择
        watchSelect: function () {
            var _this = this;
            form.on('select(shopifyAcctBatchOperate)', function (obj) {
                var optionNum = obj.value;
                if (optionNum == 'editInfo') { //修改信息
                    _this.judgeSelted().then(function (result) {
                        _this.editInfoLayer(result);
                    }).catch(function (err) {
                        layer.msg(err, {icon: 5});
                    })
                } else if (1 == optionNum) {//启用店铺
                    layer.confirm('确定批量启用店铺吗？', {
                        btn: ['确定', '取消'], //按钮
                        shade: false //不显示遮罩
                    }, function (index) {
                        var acctIds = getStoreAcctIds();
                        if (acctIds.length < 1) {
                            layer.msg("请至少选择1个店铺");
                            return;
                        }
                        var obj = {
                            acctIdStr: acctIds.toString(),
                            flag: true
                        };
                        form.render("select");
                        batchUpdateAcctStatus(obj);
                    });
                } else if (2 == optionNum) {//批量停用店铺
                    layer.confirm('确定批量停用店铺吗？', {
                        btn: ['确定', '取消'], //按钮
                        shade: false //不显示遮罩
                    }, function (index) {
                        var acctIds = getStoreAcctIds();
                        if (acctIds.length < 1) {
                            layer.msg("请至少选择1个店铺");
                            return;
                        }
                        var obj = {
                            acctIdStr: acctIds.toString(),
                            flag: false
                        };
                        form.render("select");
                        batchUpdateAcctStatus(obj);
                    });
                }else if (3 == optionNum) {
                    var acctIds = getStoreAcctIds();
                    if (acctIds.length < 1) {
                        layer.msg("请至少选择1个店铺");
                        return;
                    }
                    var index = layer.open({
                        type: 1,
                        title: "修改图片域名",
                        area: ["600px", "500px"],
                        btn: ["保存", "关闭"],
                        content: $("#editShopifyDomainLayer").html(),
                        end: function () {
                            $("#editShopifyDomainForm select[name=domainId]").val("");
                        },
                        success: function (layero, index) {
                            shopifyAcct_getDomain();
                            form.render("select");
                        },
                        yes: function () {
                            var imgDomain = $("#editShopifyDomainForm select[name=domainId] option:selected").text();
                            $.ajax({
                                type: "post",
                                url: ctx + "/salesplat/batchUpdateImgDomain.html",
                                dataType: "json",
                                data: {idListStr: acctIds, imgDomain: imgDomain},
                                traditional: true,
                                success: function (returnData) {
                                    if (returnData.code == "0000") {
                                        layer.closeAll();
                                        layer.msg("修改图片域名成功");
                                        table.reload('shopify_tableId');
                                    } else {
                                        layer.msg(returnData.msg);
                                    }
                                }
                            });
                        },
                    });
                }
            });
        },
        //修改信息弹框
        editInfoLayer: function (data) {
            var _this = this;
            layer.open({
                type: 1,
                title: '修改信息',
                area: ['500px', '600px'],
                btn: ['确认', '关闭'],
                id: 'pshopify_editInfoLayerId',
                content: $('#shopify_editInfoLayer').html(),
                success: function (layero, index) {
                    _this.renderSelect(layero);
                },
                yes: function (index, layero) {
                    var salespersonId = layero.find('select[name=salespersonIdLayer]').val();
                    var salesperson = layero.find('select[name=salespersonIdLayer] option:selected').text();
                    var sellLeaderId = layero.find('select[name=sellLeaderIdLayer]').val();
                    var sellLeaderName = layero.find('select[name=sellLeaderIdLayer] option:selected').text();
                    var acctIds = data.map(function (item) {
                        return item.id;
                    });
                    // console.log(acctIds);
                    var obj = {
                        ids: acctIds.join(','),
                        salesperson: salesperson,
                        salespersonId: salespersonId,
                        sellLeaderId: sellLeaderId,
                        sellLeaderName: sellLeaderName
                    };
                    _this.saveEditInfoAjax(obj).then(function (result) {
                        layer.close(index);
                        layer.msg(result, {time: 2000});
                        $('[lay-filter="shopify_submit"]').trigger('click');
                    }).catch(function (err) {
                        layer.msg(err);
                    })
                }
            })
        },
        //渲染销售员和销售主管
        renderSelect: function (layero) {
            var _this = this;
            Promise.all([_this.shopifyAcctAndMangerAjax('shopify专员'), _this.shopifyAcctAndMangerAjax('shopify主管')])
                .then(function (result) {
                    var shopifyAcct = result[0]; //shopify专员
                    var shopifyManger = result[1]; //shopify主管
                    var shopifyAcctSelect = layero.find('select[name=salespersonIdLayer]'); //专员select
                    var shopifyMangerSelect = layero.find('select[name=sellLeaderIdLayer]'); //主管select
                    _this.loopSelect(shopifyAcct, shopifyAcctSelect);
                    _this.loopSelect(shopifyManger, shopifyMangerSelect);
                });
        },
        //新增店铺功能
        addStore: function () {
            var _this = this;
            $('#shopify_addStore').on('click', function () {
                var data = { //需要渲染到页面的字段初始化
                    id: '',
                    storeAcct: '', //店铺名称
                    imgDomain: '', //图片域名
                    accessKey: '', //客户端id
                    secretKey: '', //客户端密钥
                    allrootAliasName: '', //普源别名
                    acctBaseRemark: '', //备注
                    salespersonId: '', //销售员id
                    sellLeaderId: '',//主管id
                    acctBaseId: '',
                    platCode: 'shopify',
                    acctDetailId: ''
                }
                _this.storeLayer(data);
            })
        },
        //新增/编辑店铺弹框
        storeLayer: function (data) {
            var _this = this;
            layer.open({
                type: 1,
                title: '修改信息',
                area: ['1000px', '500px'],
                btn: ['保存', '关闭'],
                id: 'pshopify_editInfoLayerId',
                content: $('#shopify_storeLayer').html(),
                success: function (layero, index) {
                    var getTpl = shopify_storeContainerTpl.innerHTML,
                        view = document.getElementById('shopify_storeContainer');
                    Promise.all([_this.shopifyAcctAndMangerAjax('shopify专员'), _this.shopifyAcctAndMangerAjax('shopify主管')])
                        .then(function (result) {
                            var shopifyAcct = result[0]; //shopify专员
                            var shopifyManger = result[1]; //shopify主管
                            data.shopifyAcct = shopifyAcct;
                            data.shopifyManger = shopifyManger;
                            laytpl(getTpl).render(data, function (html) {
                                view.innerHTML = html;
                                form.render();
                                _this.openStore(data.id);
                                _this.stopStore(data.id);
                            });
                        });
                },
                yes: function (index, layero) {
                    var imgDomain = layero.find('[name=imgDomain]').val();
                    var strRegex = "^http://";
                    var re = new RegExp(strRegex);
                    console.log(imgDomain,"imgDomain")
                    if(!re.test(imgDomain)) {
                        layer.msg("图片域名必须以http://开头");
                            return;
                    }
                    var saveData = _this.storeSaveData(data, layero);
                    // console.log(saveData);
                    _this.saveTableDataAjax(saveData).then(function (result) {
                        layer.closeAll();
                        layer.msg(result, {time: 2000});
                        $('[lay-filter="shopify_submit"]').trigger('click');
                    }).catch(function (err) {
                        layer.msg(err);
                    })
                }
            })
        },
        //新增/编辑中需要保存的数据
        storeSaveData: function (data, layero) {
            var obj = {};
            if (data.id) {
                obj.id = data.id; //区分是新增还是编辑
            }
            obj.platCode = 'shopify'; //平台
            obj.storeAcct = layero.find('[name=storeAcct]').val(); //店铺
            obj.imgDomain = layero.find('[name=imgDomain]').val(); //图片域名
            obj.accessKey = layero.find('[name=accessKey]').val(); //客户端id
            obj.secretKey = layero.find('[name=secretKey]').val(); //客户端密钥
            obj.allrootAliasName = layero.find('[name=allrootAliasName]').val(); //普源别名
            obj.acctBaseRemark = layero.find('[name=acctBaseRemark]').val(); //备注
            obj.salespersonId = layero.find('select[name=salespersonIdLayer]').val(); //销售员id
            obj.salesperson = layero.find('select[name=salespersonIdLayer] option:selected').text(); //销售员
            obj.sellLeaderId = layero.find('select[name=sellLeaderIdLayer]').val(); //主管id
            obj.sellLeaderName = layero.find('select[name=sellLeaderIdLayer] option:selected').text(); //主管
            obj.acctDetailId = layero.find('[name=acctDetailId]').val();
            obj.acctBaseId = layero.find('[name=acctBaseId]').val();
            obj.taxNumber = layero.find('[name=taxNumber]').val();
            obj.eoriNumber = layero.find('[name=eoriNumber]').val();
            return obj;
        },
        //启用店铺
        openStore: function (id) {
            var _this = this;
            $('#shopify_openStore').on('click', function () {
                if (!id) {
                    layer.msg("服务器正忙");
                    return;
                }
                layer.confirm("是否启用此账号？", function (index) {
                    _this.openStoreAjax(id, '/salesplat/openSalesPlatAccount.html').then(function (result) {
                        layer.msg(result);
                        layer.closeAll();
                        $('[lay-filter="shopify_submit"]').trigger('click');
                    }).catch(function (err) {
                        layer.msg(err);
                    })
                });
            });
        },
        // 停用店铺
        stopStore: function (id) {
            var _this = this;
            $('#shopify_stopStore').on('click', function () {
                if (!id) {
                    layer.msg("服务器正忙");
                    return;
                }
                layer.confirm("是否停用此账号？", function (index) {
                    _this.openStoreAjax(id, '/salesplat/deleteSalesPlatAccount.html').then(function (result) {
                        layer.msg(result);
                        layer.closeAll();
                        $('[lay-filter="shopify_submit"]').trigger('click');
                    }).catch(function (err) {
                        layer.msg(err);
                    })
                });
            });
        },

        /**
         * 辅助函数:
         * loopSelect --- 循环
         * judgeSelted --- 表格复选框
         */
        //循环复用
        loopSelect: function (data, dom) {
            var str = '<option value="">请选择</option>';
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                str += `<option value="${item.id}">${item.userName}</option>`
            }
            dom.html(str);
            form.render('select');
        },
        //判断有无选中
        judgeSelted: function () {
            return new Promise(function (resolve, reject) {
                var checkStatus = table.checkStatus('shopify_tableId')
                    , data = checkStatus.data;
                if (!data.length) {
                    reject('请先选中一条表格信息!');
                }
                resolve(data);
            })
        },


        //ajax请求
        /**
         * @desc shopify销售员和销售主管接口
         * @param {string} identity shopify专员/shopify主管
         */
        shopifyAcctAndMangerAjax: function (identity) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "post",
                    url: ctx + "/sys/listuserbyrole.html",
                    data: {role: identity},
                    dataType: "json",
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (res) {
                        loading.hide();
                        if (res.code === '0000') {
                            resolve(res.data);
                        } else {
                            reject(res.msg);
                        }
                    },
                    error: function (err) {
                        reject(err);
                    }
                })
            });
        },
        /**
         * @desc 保存修改的信息
         * @param {object} obj 对象集合,多字段
         */
        saveEditInfoAjax: function (obj) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "post",
                    url: ctx + "/salesplat/editSalesPerson.html",
                    data: obj,
                    dataType: "json",
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (res) {
                        loading.hide();
                        if (res.code === '0000') {
                            resolve(res.data || '批量修改信息成功');
                        } else {
                            reject(res.msg);
                        }
                    },
                    error: function (err) {
                        reject(err);
                    }
                })
            });
        },
        /**
         * @desc 启用/停用店铺请求
         * @param {string} id 当前数据id值
         */
        openStoreAjax: function (id, url) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: ctx + url,
                    data: {"id": id},
                    dataType: "json",
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (res) {
                        loading.hide();
                        if (res.code == "0000") {
                            resolve(res.msg);
                        } else {
                            reject(res.msg);
                        }
                    },
                    error: function () {
                        reject("服务器正忙");
                    }
                });
            })
        },
        /**
         * @desc 编辑时的详情请求
         * @param {string} id 每行数据的id
         */
        editDataAjax: function (id) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "post",
                    url: ctx + "/salesplat/getSalesPlatAccountBaseAndDetailInfo.html",
                    data: {id: id},
                    dataType: "json",
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (res) {
                        loading.hide();
                        resolve(res);
                    },
                    error: function (err) {
                        reject('服务器正忙');
                    }
                })
            })
        },
        /**
         * @desc 表格编辑时的详情保存
         * @param {string}　obj 点击保存按钮提交的数据
         */
        saveTableDataAjax: function (obj) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "post",
                    url: ctx + "/salesplat/addSalesPlatAccountBaseAndDetailInfo.html",  //请求接口地址
                    data: obj,
                    dataType: "json",
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (res) {
                        loading.hide();
                        if (res.code === '0000') {
                            resolve(res.msg || '操作成功');
                        } else {
                            reject(res.msg);
                        }
                    },
                    error: function (err) {
                        reject('服务器正忙');
                    }
                })
            })
        }
    };

    //监听select选中事件
    shopifyName.watchSelect();
    //新增店铺
    shopifyName.addStore();
    //表单提交事件
    form.on('submit(shopify_submit)', function (data) {
        var data = data.field; //获取到表单提交对象
        data.refreshTokenExpiryTime=(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:'');
        data.refreshTokenSevenExpiryTime=(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:'');
        var dataObj = shopifyName.dataHandle(data);
        shopifyName.tableRender(dataObj);
    });
    //固定表头
    UnifiedFixedFn('shopifyLayuiCard');
    //默认触发搜索事件
    $('[lay-filter="shopify_submit"]').trigger('click');


    //同步lisiting
    $("#shopify_syncShopifyListing").click(function () {
        var checkStatus = table.checkStatus('shopify_tableId'); //获取选择的店铺
        var checkAcctNum = checkStatus.data.length;
        if (checkAcctNum == null || checkAcctNum < 1) {
            layer.msg("请选择店铺");
            return;
        }
        var acctData = checkStatus.data;
        var acctIds = [];
        for (var index in acctData) {
            var obj = acctData[index];
            if (obj.status == true) {
                acctIds.push(acctData[index].id);
            }
        }
        if (acctIds.length < 1) {
            layer.msg("请选择启用的店铺");
            return;
        }
        var title = "确定要同步选中的" + checkAcctNum + "个店铺!";
        layer.confirm(title, {icon: 3}, function (index) {
            var platCode = "shopify";
            var showListingPrecent = platCode + "ShowListingPrecent";//显示进度条百分比的元素
            var showListingContent = platCode + "ShowListingContent";//显示进度内容
            var showListingErrorMsg = platCode + "ShowListingErrorMsg";//显示错误的店铺
            var batchNo = new Date().getTime();//本次同步任务流水号
            /**提交同步任务**/
            $.ajax({
                url: ctx + '/syncItem/batchSyncPlatListing.html',
                type: 'post',
                data: {"acctIds": acctIds.join(","), "batchNo": batchNo, "platCode": platCode},
                dataType: 'json',
                success: function (returnData) {
                    element.progress('wishShowListingPrecent', returnData.data.precent);
                    $("#" + showListingContent).html(returnData.data.content);
                    if (returnData.data.errorMsg != null && returnData.data.errorMsg != '') {
                        $("#" + showListingErrorMsg).html("<p>异常店铺：</p>" + returnData.data.errorMsg);
                    }
                }, error: function () {
                    layer.msg("提交店铺listing同步任务失败");
                }
            })
            /**
             * 查询同步进度的定时任务
             */
            var listInterval = setInterval(function () {
                $.ajax({
                    url: ctx + '/syncItem/getSyncProcessByBatchNo.html',
                    type: 'post',
                    data: {batchNo: batchNo, "platCode": platCode},
                    dataType: 'json',
                    success: function (returnData) {
                        var content = returnData.data.content;
                        var errorMsg = returnData.data.errorMsg;//错误信息
                        element.progress(showListingPrecent, returnData.data.precent);
                        $("#" + showListingContent).html(content);
                        if (errorMsg != null && errorMsg != '') {
                            errorMsg = "<p style='padding-left: 10px;'>" + errorMsg + "</p>";
                            $("#" + showListingErrorMsg).html("<p>异常店铺：</p>" + errorMsg);
                        }
                        if (content != null && content.indexOf("完成") > -1) {
                            clearInterval(listInterval);//清除定时任务
                        }
                    }, error: function () {
                        $("#" + showListingContent).html("获取同步lisiting进度失败");
                    }
                })
            }, 2000);
            /**展示同步任务结果*/
            var content = '<div class="layui-progress layui-progress-big" lay-filter="' + showListingPrecent + '">' +
                '<div class="layui-progress-bar layui-bg-blue"  lay-percent="80%"></div>' +
                '</div>' +
                '<p id=\'' + showListingContent + '\'>正在同步中...</p>' +
                '<p id=\'' + showListingErrorMsg + '\'></p>';
            layer.open({
                title: '同步listing结果',
                content: content,
                offset: '100px',
                area: '500px',
                yes: function (index, layero) {
                    clearInterval(listInterval);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            });
        });
    });

    function shopifyAcct_getDomain() {
        $("#editShopifyDomainLayer select[name=domainId]").html('<option value="">选择域名</option>');
        $.ajax({
            type: "post",
            url: ctx + "/domain/listAll.html",
            dataType: "json",
            async: false,
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg);
                } else {
                    var domainList = returnData.data;
                    if (domainList.length > 0) {
                        for (var i = 0; i < domainList.length; i++) {
                            $("#editShopifyDomainForm select[name=domainId]")
                                .append('<option value="' + domainList[i].id + '">' + domainList[i].domain + '</option>')
                        }
                    }
                }
            }
        });
    }

    //同步lisiting
    $("#shopify_syncLocation").click(function () {
        var checkStatus = table.checkStatus('shopify_tableId'); //获取选择的店铺
        var checkAcctNum = checkStatus.data.length;
        if (checkAcctNum == null || checkAcctNum < 1) {
            layer.msg("请选择店铺");
            return;
        }
        if (checkAcctNum !== 1) {
            layer.msg("只支持单个同步");
            return;
        }
        var storeAcctId = checkStatus.data[0].id;

        $.ajax({
            url: ctx + '/salesplat/sync/shopify/location.html',
            type: 'post',
            data: {"storeAcctId": storeAcctId},
            dataType: 'json',
            beforeSend: function () {
                loading.show()
            },
            success: function (returnData) {
                loading.hide()
                if (returnData.code === '0000') {
                    layer.msg("同步成功", {icon: 1});
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            }, error: function () {
                loading.hide()
                layer.msg("同步店铺默认Location失败");
            }
        })

    });

    /**
     * 开启关闭订单下载的功能
     */
    // form.on('switch(orderDownloadStatus)', function (data) {
    //     //取到当前的开启状态和店铺id
    //     var obj = {
    //         id: data.othis.next().text(),
    //         orderDownStatus: data.elem.checked
    //     }
    //     $.ajax({
    //         type: "POST",
    //         url: ctx + "/salesplat/updateOrderStatusById.html", //请求接口地址
    //         dataType: "json",
    //         data: obj, //需要post的数据
    //         success: function (res) {
    //             loading.hide();
    //             //后台程序返回数据
    //             if (res.code == "0000") {
    //                 // active.reload();
    //                 layer.msg("设置成功");
    //             } else {
    //                 layer.msg(res.msg);
    //             }
    //         },
    //     });
    // });


    //监听iframe传参
    window.addEventListener('message', function(event){
      console.log('iframe接收到的数据是', event.data);
      let {searchType} = event.data;
      if(searchType){
        $('#shopify_acct_domain_overdue_number').parents('li').trigger('click');
      }
    });

})
