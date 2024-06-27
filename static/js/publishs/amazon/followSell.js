/***20201112 移除 旧版跟卖***/
/***20201124 恢复 旧版跟卖***/

layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage'], function() {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        element = layui.element,
        layer = layui.layer;
    form.render('select');
    render_hp_orgs_users("#AmazonFollowSellForm"); //渲染部门销售员店铺三级联动
    var AmazonFollowSell_global_siteEnum;
    //赋值
    getInitAmazonSite();

    //获取站点
    function getInitAmazonSite() {
        if (AmazonFollowSell_global_siteEnum == null || AmazonFollowSell_global_siteEnum == undefined) {
            //赋值
            initAjaxSync('/enum/getSiteEnum.html?platCode=amazon', 'POST', {}, function(returnData) {
                var data = returnData.data;

                var map_AmazonFollowSell_global_siteEnum = new Map();
                for (var i in data) {
                    map_AmazonFollowSell_global_siteEnum.set(data[i].code, data[i].name)
                }
                AmazonFollowSell_global_siteEnum = map_AmazonFollowSell_global_siteEnum;
            })
        }
        return AmazonFollowSell_global_siteEnum;
    }

    //根据根据角色请求获取店铺列表
    function getAmazonFollowSellStore(data, func) {
        initAjaxSync('/sys/liststore.html', 'POST', data, function(returnData) {
            if (func) {
                func(returnData)
            } else {
                appendSelectForStoreSite('AmazonFollowSellForm', 'AmazonFollowSell_storeAcct', returnData.data, 'id', 'storeAcct', 'salesSite')
                form.render('select');
            }
        }, 'application/x-www-form-urlencoded');
    }

    //根据根据角色请求获取店铺列表
    function getAddAmazonFollowSellStore(data, func) {
        initAjax('/sys/liststore.html', 'POST', data, function(returnData) {
            if (func) {
                func(returnData)
            } else {
                appendSelectForStoreSite('addAmazonFollowSellForm', 'addAmazonFollowSell_storeAcct', returnData.data, 'id', 'storeAcct', 'salesSite');
                form.render('select');
            }
        }, 'application/x-www-form-urlencoded');
    }

    //监听部门下拉框选择
    form.on('select(AmazonFollowSellorgTree)', function(data) {
        var salePersonId = $('#AmazonFollowSellForm select[name=userList]').val();
        getAmazonFollowSellStore({ roleNames: 'amazon专员', orgId: data.value, salePersonId: salePersonId, platCode: 'amazon' })
    });
    //监听销售员下拉选择
    form.on('select(AmazonFollowSellUserList)', function(data) {
        var orgId = $('#AmazonFollowSellForm select[name=orgTree]').val();
        getAmazonFollowSellStore({ roleNames: 'amazon专员', orgId: orgId, salePersonId: data.value, platCode: 'amazon' })
    });

    //监听店铺下拉选择
    form.on('select(AmazonFollowSell_selAcct)', function(data) {
        var sites = data.elem[data.elem.selectedIndex].dataset.sites;
        AmazonFollowSell_global_siteEnum = getInitAmazonSite();
        var canSelSiteList = [];
        console.log(sites);
        if (!$.isEmptyObject(sites)) {
            var siteList = sites.split(",");
            for (var i = 0; i < siteList.length; i++) {
                var obj = {};
                obj.site = siteList[i];
                obj.siteName = AmazonFollowSell_global_siteEnum.get(siteList[i]);
                canSelSiteList.push(obj);
            }
        }
        appendSelect('AmazonFollowSellForm', 'AmazonFollowSell_amazonSite', canSelSiteList, 'site', 'siteName');
        form.render('select');
    });

    //监听页签
    element.on('tab(AmazonFollowSell_tab)', function(data) {
        form.render();
        var tablename = $(this).attr('data-index');
        $('#AmazonFollowSellForm input[name="tablename"]').val(tablename);
        $('#AmazonFollowSellSearch').click()
    });



    // 表单提交Search
    form.on('submit(AmazonFollowSellSearch)', function(data) {
        var req = data.field;
        if (req.tablename == "draft") {
            // req.boolDraft=true;
        }
        if (req.tablename == "notInFollowSell") {
            // req.boolDraft=false;
            // req.boolInPlantrue;//在计划
            // req.inPublishTiming=false;//刊登时间外
        }
        if (req.tablename == "inFollowSell") {
            // req.boolDraft=false;
            // req.boolInPlan=true;//在计划
            // req.inPublishTiming=true;//刊登时间外内
        }
        if (req.tablename == "fail") {
            // req.boolDraft=false;
            // req.publishStatus=false;//刊登失败
        }
        if (req.tablename == "wait") {
            // req.boolDraft=false;
        }
        if (req.tablename == "online") {
            // req.boolDraft=false;
        }
        getTableList(data.field.tablename, req)
    });

    // 表单提交Search asin搜索
    form.on('submit(addAmazonFollowSell_asinSearch)', function(data) {
        var { salesSite, storeAcctId, asinStr } = data.field;
        //渲染表格
        searchAsinList({ salesSite, storeAcctId, asinStr });

    });

    //修改详情
    form.on('submit(AmazonFollowSellDetail_edit)', function(data) {
        var req = data.field;
        editAmazonFollowSellDetail(req, function(returnData) {
            layer.msg(returnData.msg || '修改成功');
            if (returnData.code == '0000') {
                layer.closeAll();
                $('#AmazonFollowSellSearch').click()
            }

        });
    });

    var tableurl = {
        'draft': '/amazonFollowSell/queryPage.html',
        'notInFollowSell': '/amazonFollowSell/queryPage.html',
        'inFollowSell': '/amazonFollowSell/queryPage.html',
        'fail': '/amazonFollowSell/queryPage.html',
        'succ': '/amazonFollowSell/queryPage.html',
        'wait': '/amazonFollowSell/queryPage.html',
        'online': '/amazonFollowSell/queryPage.html',
    };

    var tablecol = {
        'draft': [
            [ //草稿箱
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#AmazonFollowSell_imageTpl" },
                { title: "标题/ASIN/成色", field: "title", templet: "#AmazonFollowSell_productInfo_tpl" },
                { title: "店铺", field: "storeAcct" },
                { title: "站点", field: "salesSite" },
                { title: "售价", field: "price" },
                { title: "库存", field: "stock" },
                { title: "时间", templet: "#AmazonFollowSell_Time_tpl" },
                { title: '操作', toolbar: "#AmazonFollowSell_draft_op", width: 100 }
            ]
        ],
        'notInFollowSell': [
            [ //跟卖计划
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#AmazonFollowSell_imageTpl" },
                { title: "标题/ASIN/成色", templet: "#AmazonFollowSell_productInfo_tpl" },
                { title: "SKU", field: "sellerSku" },
                { title: "店铺", field: "storeAcct" },
                { title: "站点", field: "salesSite" },
                { title: "售价", field: "price" },
                { title: "库存", field: "stock" },
                { title: "时间", templet: "#AmazonFollowSell_Time_tpl" },
                { title: '操作', toolbar: "#AmazonFollowSell_draft_op", width: 100 }
            ]
        ],
        'inFollowSell': [
            [ //取消跟卖计划
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#AmazonFollowSell_imageTpl" },
                { title: "标题/ASIN/成色", templet: "#AmazonFollowSell_productInfo_tpl" },
                { title: "SKU", field: "sellerSku" },
                { title: "店铺", field: "storeAcct" },
                { title: "站点", field: "salesSite" },
                { title: "售价", field: "price" },
                { title: "库存", field: "stock" },
                { title: "时间", templet: "#AmazonFollowSell_Time_tpl" },
                { title: '操作', toolbar: "#AmazonFollowSell_draft_op", width: 100 }
            ]
        ],
        'wait': [
            [ //发布等待季节
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#AmazonFollowSell_imageTpl" },
                { title: "标题/ASIN/成色", templet: "#AmazonFollowSell_productInfo_tpl" },
                { title: "SKU", field: "sellerSku" },
                { title: "店铺", field: "storeAcct" },
                { title: "站点", field: "salesSite" },
                { title: "售价", field: "price" },
                { title: "库存", field: "stock" },
                { title: "时间", templet: "#AmazonFollowSell_Time_tpl" },
                { title: '操作', toolbar: "#AmazonFollowSell_draft_op", width: 100 }
            ]
        ],

        'fail': [
            [ //发布失败
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#AmazonFollowSell_imageTpl" },
                { title: "标题/ASIN/成色", templet: "#AmazonFollowSell_productInfo_tpl" },
                { title: "SKU", field: "sellerSku" },
                { title: "店铺", field: "storeAcct" },
                { title: "站点", field: "salesSite" },
                { title: "售价", field: "price" },
                { title: "库存", field: "stock" },
                { title: "时间", templet: "#AmazonFollowSell_Time_tpl" },
                { title: '操作', toolbar: "#AmazonFollowSell_draft_op", width: 100 }
            ]
        ],
        'succ': [
            [ //发布成功
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#AmazonFollowSell_imageTpl" },
                { title: "标题/ASIN/成色", templet: "#AmazonFollowSell_productInfo_tpl" },
                { title: "SKU", field: "sellerSku" },
                { title: "店铺", field: "storeAcct" },
                { title: "站点", field: "salesSite" },
                { title: "售价", field: "price" },
                { title: "库存", field: "stock" },
                { title: "时间", templet: "#AmazonFollowSell_Time_tpl" },
                { title: '操作', toolbar: "#AmazonFollowSell_draft_op", width: 100 }
            ]
        ],
        'online': [
            [ //在线商品
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#AmazonFollowSell_imageTpl" },
                { title: "标题/ASIN/成色", templet: "#AmazonFollowSell_productInfo_tpl" },
                { title: "SKU", field: "sellerSku" },
                { title: "店铺", field: "storeAcct" },
                { title: "站点", field: "salesSite" },
                { title: "售价", field: "price" },
                { title: "库存", field: "stock" },
                { title: "时间", templet: "#AmazonFollowSell_Time_tpl" },
                { title: '操作', toolbar: "#AmazonFollowSell_online_op", width: 100 }
            ]
        ],
        'asinTable': [
            [ //添加跟卖产品
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#AmazonFollowSell_imageTpl", width: 90 },
                { title: "产品标题", field: "storeAcct", templet: '#addAmazonFollowSell_productInfo_tpl' },
                { title: "详情", field: "brand", templet: '#addAmazonFollowSell_detailInfo_tpl' },
                { title: "操作", toolbar: "#addAmazonFollowSell_op", width: 100 }
            ]
        ],
    };

    // 弹框-----------------
    //监听工具栏操作
    for (var i in tablecol) {
        table.on('tool(AmazonFollowSell_table_' + i + ')', function(obj) {
            var data = obj.data;
            var layEvent = obj.event;

            if (layEvent === 'AmazonFollowSell_event_startFollowSell') { //开始跟卖
                layer.open({
                    type: 1,
                    title: '开始跟卖产品',
                    btn: ['开始跟卖', '关闭'],
                    area: ['80%', '80%'],
                    content: $('#AmazonFollowSell_layer_startFollowSell').html(),
                    success: function(index, layero) {
                        listAllTimingPlanToSelect({});
                        form.render();
                    },
                    yes: function(index, layero) {
                        // $('#AmazonFollowSellDetail_edit').click();
                        var req = {};
                        req.sellType = $("#startSellAmazonFollowSellForm input[name=sellType]:checked").val();
                        req.planId = $("#startSellAmazonFollowSellForm select[name=planId]").val();
                        var idList = [];
                        idList.push(data.id);
                        req.idList = idList;
                        req.storeAcctId = data.storeAcctId;
                        req.salesSite = data.salesSite;
                        startFollowSell(req, function(returnData) {
                        });

                    }
                })
            } else if (layEvent === 'AmazonFollowSell_event_editDraft') { //编辑
                layer.open({
                    type: 1,
                    title: '编辑跟卖产品',
                    btn: ['保存', '关闭'],
                    area: ['60%', '80%'],
                    content: $('#AmazonFollowSell_editFollowSell_tpl').html(),
                    success: function(index, layero) {
                        var html = template('editFollowSell_tpl_id_tpl', data);
                        $('#editFollowSell_tpl_id').html(html);
                        $("#editAmazonFollowSellForm input[name=detailType]").val('draft');
                        form.render();
                    },
                    yes: function(index, layero) {
                        $('#AmazonFollowSellDetail_edit').click();
                    }
                })
            } else if (layEvent === 'AmazonFollowSell_event_cancleFollowSell') { //取消跟卖
                layer.confirm('确定取消?', function(index) {
                    var req = {};
                    var idList = [];
                    idList.push(data.id);
                    req.storeAcctId = data.storeAcctId;
                    req.salesSite = data.salesSite;

                    cancleFollowSell(req, function(returnData) {

                    })
                })
            } else if (layEvent === 'AmazonFollowSell_event_delete') { //删除跟卖
                layer.confirm('确定取消?', function(index) {
                    deleteDraft(data.id, function(returnData) {
                        layer.msg(returnData.msg || '删除成功');
                        $('#AmazonFollowSellSearch').click();
                        layer.close(index);
                    })
                })
            } else if (layEvent === 'addToDraft') { //添加至
                data.storeAcctId = $("#addAmazonFollowSellForm select[name=storeAcctId]").val();
                data.salesSite = $("#addAmazonFollowSellForm select[name=salesSite]").val();

                addToDraft(data, function(returnData) {
                    layer.msg(returnData.msg || '添加成功');
                    if (returnData.code = '0000') {
                        $('#AmazonFollowSellSearch').click();
                    }
                })
            } else if (layEvent === 'addToDraft') { //添加至
                data.storeAcctId = $("#addAmazonFollowSellForm select[name=storeAcctId]").val();
                data.salesSite = $("#addAmazonFollowSellForm select[name=salesSite]").val();

                addToDraft(data, function(returnData) {
                    layer.msg(returnData.msg || '添加成功');
                    if (returnData.code = '0000') {
                        $('#AmazonFollowSellSearch').click();
                    }
                })
            }
        });
    }

    //最外面的按钮-添加跟卖查询弹框
    $('.AmazonFollowSell_btn_addFollowSell').click(function() {
        layer.open({
            type: 1,
            title: '添加跟卖产品',
            btn: ['关闭'],
            area: ['100%', '100%'],
            content: $('#AmazonFollowSell_layer_addFollowSell').html(),
            success: function(index, layero) {
                //
                getAddAmazonFollowSellStore({ roleNames: 'amazon专员', orgId: null, salePersonId: null, platCode: 'amazon' });
                //监听店铺下拉选择
                form.on('select(addAmazonFollowSell_storeAcct)', function(data) {
                    var sites = data.elem[data.elem.selectedIndex].dataset.sites;
                    AmazonFollowSell_global_siteEnum = getInitAmazonSite();
                    var canSelSiteList = [];
                    console.log(sites);
                    if (!$.isEmptyObject(sites)) {
                        var siteList = sites.split(",");
                        for (var i = 0; i < siteList.length; i++) {
                            var obj = {};
                            obj.site = siteList[i];
                            obj.siteName = AmazonFollowSell_global_siteEnum.get(siteList[i]);
                            canSelSiteList.push(obj);
                        }
                    }
                    appendSelect('addAmazonFollowSellForm', 'addAmazonFollowSell_amazonSite', canSelSiteList, 'site', 'siteName');
                    form.render();
                });

                //添加跟卖产品子页面里的按钮-添加至草稿箱
                $('#addAmazonFollowSell_btn_addListToDraft').click(function() {
                    var data = table.checkStatus('AmazonFollowSell_table_asinTable').data;
                    var storeAcctId = $("#addAmazonFollowSellForm select[name=storeAcctId]").val();
                    var salesSite = $("#addAmazonFollowSellForm select[name=salesSite]").val();
                    if (data.length < 1) {
                        layer.msg('必选一条');
                        return;
                    }
                    for (var i in data) {
                        data[i].storeAcctId = storeAcctId;
                        data[i].salesSite = salesSite
                    }

                    addListToDraft(data, function(returnData) {
                        layer.msg(returnData.msg || '添加成功');
                        $('#AmazonFollowSellSearch').click();
                    })

                });
            },

        })
    });

    //最外面的按钮-批量跟卖弹框
    $('.AmazonFollowSell_btn_batchSell').click(function() {
        var tableName = $('#AmazonFollowSellForm input[name="tablename"]').val();

        var data = table.checkStatus('AmazonFollowSell_table_' + tableName).data;
        console.log(data);
        var idList = [];
        for (var i in data) {
            idList.push(data[i].id)
        }
        console.log(idList);
        if (idList.length > 0) {
            layer.open({
                type: 1,
                title: '开始跟卖产品',
                btn: ['开始跟卖', '关闭'],
                area: ['80%', '80%'],
                content: $('#AmazonFollowSell_layer_startFollowSell').html(),
                success: function(index, layero) {
                    listAllTimingPlanToSelect({});
                    form.render();
                },
                yes: function(index, layero) {
                    // $('#AmazonFollowSellDetail_edit').click();
                    var req = {};
                    req.sellType = $("#startSellAmazonFollowSellForm input[name=sellType]:checked").val();
                    req.planId = $("#startSellAmazonFollowSellForm select[name=planId]").val();

                    req.idList = idList;
                    req.storeAcctId = data[0].storeAcctId;
                    req.salesSite = data[0].salesSite;
                    startFollowSell(req, function(returnData) {
                    });

                }
            })
        } else {
            layer.msg('至少选一条数据')
        }
    });

    //最外面的按钮-取消跟卖弹框
    $('.AmazonFollowSell_btn_batchCancleSell').click(function() {
        var req = {};
        var idList = [];
        var tableName = $('#AmazonFollowSellForm input[name="tablename"]').val();

        var data = table.checkStatus('AmazonFollowSell_table_' + tableName).data;
        for (var i in data) {
            idList.push(data[i].id)
        }
        if (idList.length > 0) {
            layer.confirm('确定取消?', function(index) {
                req.idList = idList;
                req.storeAcctId = data[0].storeAcctId;
                req.salesSite = data[0].salesSite;

                cancleFollowSell(req, function(returnData) {
                    layer.msg(returnData.msg || '取消成功');
                    $('#AmazonFollowSellSearch').click();
                    layer.close(index);
                })
            })
        } else {
            layer.msg('至少选一条数据')
        }
    });

    //开始跟卖
    function startFollowSell(data, fun) {
        initAjax('/amazonFollowSellPlan/startSellList.html', 'POST', JSON.stringify(data), function(returnData) {
            if (fun) {
                fun(returnData);
            }
        })
        layer.msg('正在提交跟卖，约10min...请稍后确认结果!', { icon: 4, time: 3000 })
    }

    //取消跟卖
    function cancleFollowSell(data, fun) {
        initAjax('/amazonFollowSellPlan/cancleSell.html', 'POST', JSON.stringify(data), function(returnData) {
            if (fun) {
                fun(returnData);
            }
        })
        layer.msg('正在取消跟卖，约10min...请稍后确认结果!', { icon: 4, time: 3000 })
    }

    //
    function listAllTimingPlanToSelect(data) {
        initAjax('/amazonFollowSellPlan/listAllOpen.html', 'POST', JSON.stringify(data), function(returnData) {
            appendSelect('startSellAmazonFollowSellForm', 'startSellAmazonFollowSellForm_planId', returnData.data, 'id', 'planName');
            form.render('select');
        })
    }

    //
    function addToDraft(data, fun) {
        loading.show();
        initAjax('/amazonFollowSell/addToDraft.html', 'POST', JSON.stringify(data), function(returnData) {
            if (fun) {
                fun(returnData);
            }
        })
    }

    //批量
    function addListToDraft(data, fun) {
        loading.show();
        initAjax('/amazonFollowSell/addListToDraft.html', 'POST', JSON.stringify(data), function(returnData) {
            if (fun) {
                fun(returnData);
            }
        })
    }

    //获取列表数据
    function getTableList(tablename, data) {
        data[data.searchStrType] = data.searchStr;
        initAjax(tableurl[tablename], 'POST', JSON.stringify(data), function(returnData) {
            $('#AmazonFollowSell_tab').find('.layui-this').find('span').text(returnData.count)
            AmazonFollowSellrenderpage(returnData.count, data.page, data.limit);
            AmazonFollowSellTablerender(returnData.data, tablename)
        })
    }

    //获取列表数据
    function searchAsinList(data) {
        initAjax('/amazonFollowSell/queryAsinProduct.html', 'POST', JSON.stringify(data), function(returnData) {
            table.render({
                elem: '#AmazonFollowSell_table_asinTable',
                method: 'POST',
                data: returnData.data,
                cols: tablecol['asinTable'],
                page: false,
                id: 'AmazonFollowSell_table_asinTable',
                limit: Number.MAX_VALUE,
                done: function(res) {
                    if(res.msg){
                        layer.msg(res.msg);
                    }
                    imageLazyload();
                }
            });
        })
    }

    function AmazonFollowSellTablerender(data, tablename) {
        table.render({
            elem: '#AmazonFollowSell_table_' + tablename,
            method: 'POST',
            data: data,
            cols: tablecol[tablename],
            sortType: 'server',
            page: false,
            id: 'AmazonFollowSell_table_' + tablename,
            limit: Number.MAX_VALUE,
            done: function(res) {
                imageLazyload();
            }
        })
    }

    function AmazonFollowSellrenderpage(count, current, limit) {
        laypage.render({
            elem: 'AmazonFollowSell_page',
            curr: current,
            limit: limit,
            limits: [10, 50, 100],
            layout: ['prev', 'page', 'next','count', 'limit'],
            count: count,
            jump: function(obj, first) {
                $('#AmazonFollowSellForm input[name="limit"]').val(obj.limit);
                $('#AmazonFollowSellForm input[name="page"]').val(obj.curr);
                //首次不执行
                if (!first) {
                    $('#AmazonFollowSellSearch').click();
                }
            }
        });
    }

    //删除
    function deleteDraft(id, func) {
        loading.show();
        initAjax('/amazonFollowSell/delete.html', 'POST', JSON.stringify({ id: id }), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //修改
    function editAmazonFollowSellDetail(data, func) {
        loading.show();
        initAjax('/amazonFollowSell/edit.html', 'POST', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }


    function initAjax(url, method, data, func, contentType) { //初始化ajax请求
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData) //回显
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }

    function initAjaxSync(url, method, data, func, contentType, isLoad) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: false,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData) //回显
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
            }
        })
    }

    //填充下拉框
    function appendSelect(pre, dom, data, id, name) {
        $('#' + pre + ' #' + dom + '').empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            data[i].id = data[i].id || data[i][id];
            data[i].name = data[i].name || data[i][name];
            option += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
        }
        $('#' + pre + ' #' + dom + '').append(option)
    }


    //填充下拉框,特别为店铺绑定站点使用
    function appendSelectForStoreSite(pre, dom, data, id, name, salesSite) {
        $('#' + pre + ' #' + dom + '').empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            data[i].id = data[i].id || data[i][id];
            data[i].name = data[i].name || data[i][name];
            data[i].salesSite = data[i].salesSite || data[i][salesSite];
            option += '<option data-sites="' + data[i].salesSite + '" value="' + data[i].id + '">' + data[i].name + '</option>'
        }
        $('#' + pre + ' #' + dom + '').append(option)
    }
});