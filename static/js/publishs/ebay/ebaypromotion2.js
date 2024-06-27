var timer = null
var selectedInventoryDiscounts = [];
layui.use(['form', 'layer', 'table', 'laypage', 'laydate', 'element', 'upload'], function() {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        upload = layui.upload,
        $ = layui.$;
    form.render();

    var setting = {
        check: {
            enable: true,
            chkStyle: "checkbox",
            chkDisabledInherit: true,
            chkboxType: { "Y": "s", "N": "s" }
        },
        data: {
            key: {
                children: "children",
                name: "cateName",
            },
            simpleData: {
                enable: true,
                idKey: "cateId",
                pIdKey: "pCateId",
            },
            view: {
                selectedMulti: true,
                showIcon: false
            }
        },
        callback: {
            onCheck: function(treeId, treeNode) {}
        },
    };

    getDepartAndSelByRole2('ebay专员');
    getListStore2({ roleNames: 'ebay专员', orgId: '', salePersonId: '', platCode: 'ebay' })

    laydate.render({
        elem: '#ebaypromotion2StartTime',
        type: 'date',
        range: true
    });

    laydate.render({
        elem: '#ebaypromotion2EndTime',
        type: 'date',
        range: true
    });

    //获取ebay站点数据
    // /ebayMarketingDiscount/getEbaySiteList.html
    function getEbaySite(func) {
        initAjax('/ebayMarketingDiscount/getEbaySiteList.html', 'GET', {}, function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //根据角色请求获取部门和销售人员
    function getDepartAndSelByRole2(role) {
        initAjax('/sys/getPersonAndOrgsByRole.html', 'POST', { roleNames: role }, function(returnData) {
            appendSelect('ebaypromotion2Form', 'orgTree', returnData.data.orgTree);
            appendSelect('ebaypromotion2Form', 'userList', returnData.data.userList, 'id', 'user_name')
            form.render('select');
        }, 'application/x-www-form-urlencoded')
    }
    //监听部门下拉框选择
    form.on('select(orgTree)', function(data) {
        var salePersonId = $('#userList').val()
        getListStore2({ roleNames: 'ebay专员', orgId: data.value, salePersonId: salePersonId, platCode: 'ebay' })
    });
    //监听销售员下拉选择
    form.on('select(userList)', function(data) {
        var orgId = $('#orgTree').val()
        getListStore2({ roleNames: 'ebay专员', orgId: orgId, salePersonId: data.value, platCode: 'ebay' })
    });

    //监听选择创建促销下拉框
    form.on('select(newPromotionSel)', function(data) {
        if (data.value === '1') {
            popNewMarkdown('1');
        } else if (data.value === '2') {
            popNewOrderDiscount('1');
        } else if (data.value === '3') {
            popNewVolumePricing('1');
        }
    });

    //根据根据角色请求获取店铺列表
    function getListStore2(data, func) {
        initAjax('/sys/liststore.html', 'POST', data, function(returnData) {
            if (func) {
                func(returnData)
            } else {
                appendSelect('ebaypromotion2Form', 'storeAcct', returnData.data, 'id', 'storeAcct')
                form.render('select');
            }
        }, 'application/x-www-form-urlencoded');
    }

    //店铺同步
    function ebay2asyncStore(storeId) {
        initAjax('/ebayMarketingDiscount/syncEbayDiscount.html', 'POST', { storeAcctId: storeId }, function(returnData) {
            layer.msg(returnData.data)
            clearprocess();
        }, 'application/x-www-form-urlencoded');
    }

    //删除促销
    function deletePromotion(id, func) {
        loading.show()
        initAjax('/ebayDiscount/deletePromotion.html', 'POST', { id: id }, function(returnData) {
            loading.hide();
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取产品树
    function getCategoryTree(storeAcctId, func) {
        initAjax('/ebayMarketingDiscount/getEbayProdCateList.html', 'GET', { storeAcctId: 604, marketplaceId: 'EBAY_US' }, function(returnData) {
            if (func) {
                func(returnData.data)
            }
        }, 'application/json', true)
    }

    //获取店铺树
    function getStoreTree(storeAcctId, func) {
        initAjax('/ebayMarketingDiscount/getEbayStoreCates.html', 'GET', { storeAcctId: 604, marketplaceId: 'EBAY_US' }, function(returnData) {
            if (func) {
                func(returnData.data)
            }
        })
    }

    //编辑markdown
    function modifyMarkdown(data, func) {
        initAjax('/ebayMarketingDiscount/updateMarkdownPromotion.html', 'POST', data, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //编辑volume price
    function modifyVolumePrice(data, func) {
        initAjax('/ebayMarketingDiscount/updateVolumeOrOrderPromotion.html', 'POST', data, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
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
    //封装ajax请求
    function initAjax(url, method, data, func, contentType, showLoading) { //初始化ajax请求
        if (showLoading) {
            loading.show()
        }
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
                    func(returnData)
                } else {
                    if (timer) {
                        clearprocess();
                    }
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

    form.on('submit(ebayPromotion2Search)', function(data) {
        if (data.field.startTime) {
            data.field.startTimeLeft = data.field.startTime.split(' - ')[0] + ' 00:00:00';
            data.field.startTimeRight = data.field.startTime.split(' - ')[1] + ' 23:59:59';
        }
        if (data.field.endTime) {
            data.field.endTimeLeft = data.field.endTime.split(' - ')[0] + ' 00:00:00';
            data.field.endTimeRight = data.field.endTime.split(' - ')[1] + ' 23:59:59';
        }
        ebaypromotion2Table(data.field)
    });

    //监听tab切换
    element.on('tab(ebaypromotionTab)', function(data) {
        var promotionStatus = $(this).attr('data-index');
        $('#ebaypromotion2Form input[name="promotionStatus"]').val(promotionStatus)
        $('#ebayPromotion2Search').click()
    });

    //渲染表格
    function ebaypromotion2Table(data) {
        table.render({
            elem: '#ebayPromotion2Table',
            method: 'get',
            url: ctx + '/ebayMarketingDiscount/searchPromotion.html',
            where: data,
            cols: [
                [ //表头
                    { checkbox: true, width: 30 },
                    { title: "名称", field: "promotionName" },
                    { title: "店铺", field: "storeAcctName" },
                    { title: "开始时间", field: "promotionStartTime", templet: '<div>{{Format(d.promotionStartTime,"yyyy-MM-dd hh:mm:ss")}}</div>' },
                    { title: "结束时间", field: "promotionEndTime", templet: '<div>{{Format(d.promotionEndTime,"yyyy-MM-dd hh:mm:ss")}}</div>' },
                    { title: "促销类型", field: "promotionType" },
                    { title: "促销内容", field: "discountRules", templet: '<div>待整理</div>' },
                    { title: "状态", field: "promotionStatus", },
                    { title: '操作', toolbar: '<div><button class="layui-btn layui-btn-xs" lay-event="epm2_edit">编辑</button><button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="epm2_delete">删除</button></div>' }
                ]
            ],
            page: true,
            id: "ebayPromotion2Table",
            limits: [50, 100, 300],
            limit: 50,
            done: function(data) {
                $('#ebaypromotionTab').find('ul .layui-this').find('span').text(data.count);
            }
        })
    }

    $('#ebay2asyncStore').click(function() {
        var storeId = $('#ebaypromotion2Form #storeAcct').val();
        if (storeId !== "") {
            ebay2asyncStore(storeId)
            process();
        } else {
            layer.msg('请先选择要同步的店铺')
        }
    })

    //选择指定产品-------------------------------PREPARED------------------------------------------------------------------------------------------------------------------------------------------------

    // 获取在线商品
    function getOnlineProducts(data) {
        const { excludeItemIds, isSelected, currentPriceEnd, currentPriceStart, primaryCateIds, promotionMarketplaceId, storeAcctId, storePrimaryCateIds, title } = data
        initAjax('/ebayMarketingDiscount/searchEbayOnlineProduct.html',
            'POST', { excludeItemIds, isSelected, currentPriceEnd, currentPriceStart, primaryCateIds, promotionMarketplaceId, storeAcctId, storePrimaryCateIds, title },
            function(returnData) {
                $('#selectableproduct li[data-index="0"]').find('span').text('(' + returnData.extra.notSelectedCount + ')')
                $('#selectableproduct li[data-index="1"]').find('span').text('(' + returnData.extra.isSelectedCount + ')')
                for (var i in returnData.data) {
                    returnData.data[i].isSelected = isSelected
                }
                table.render({
                    elem: '#ebayPromotion2OnlineProductTable',
                    data: returnData.data,
                    cols: [
                        [ //表头
                            { checkbox: true, width: 30 },
                            { title: "图片", field: "firstImage", templet: '#ebaypromotion2_product_imageTpl' },
                            { title: "标题", field: "title", width: 200 },
                            { title: "店铺父SKU", field: "storePSku" },
                            { title: "价格", field: "currentPrice" },
                            { title: "在线数量", field: "quantity" },
                            { title: "销量", field: "soldNums" },
                            { title: "浏览量", field: "watchCount" },
                            { title: "时间", field: "listingEndTime", templet: "#ebaypromotion2_product_time", width: 200 },
                            { title: "操作", field: "promotionEndTime", templet: "#ebaypromotion2_product_Option" },
                        ]
                    ],
                    page: false,
                    id: 'ebayPromotion2OnlineProductTable',
                    done: function(res, count) {
                        imageLazyload();
                    }
                })
            },
            'application/x-www-form-urlencoded')
    }
    var selectedProduct = [] //选择添加的商品
    table.on('tool(ebayPromotion2OnlineProductTable)', function(obj) {
        if (obj.event === "addproducts") {
            selectedProduct.push(obj.data.itemId)
            $('#searchOnlineproducts_deprecated').click()
        } else if (obj.event === "removeproducts") {
            var index = selectedProduct.indexOf(obj.data.itemId)
            selectedProduct.splice(index, 1)
            $('#searchOnlineproducts_deprecated').click()
        }
    })
    $('#chooseProduct').click(function() {
            layer.open({
                type: 1,
                title: '选择指定产品',
                btn: ['保存', '关闭'],
                area: ['70%', '80%'],
                content: $('#pop_specificproduct').html(),
                success: function(layero, index) {
                    $(layero).find('.layui-layer-btn0').addClass('hide')
                    $(layero).find('#ebaypromotion2_batchremove').addClass('hide')
                    $('body').on('click', '#chooseCategoryInput', debounce(function(event) {
                        event.stopPropagation()
                        event.preventDefault()
                        var index = $(this).attr('data-index')
                        getProductsTreepop()
                    }, 1000, 2000))
                    $('#searchOnlineproducts_deprecated').click(function() {
                        var data = serializeObject($('#searchOnlineProductForm'))
                        if ($('#producttypeSpan').text() !== "All Inventory") {
                            var treeType = $('#producttypeSpan').text()
                                // treeType === ">>eBay catrgories" ?
                                //     data.primaryCateIds = data.categoryids : data.storePrimaryCateIds = data.categoryids
                            data.primaryCateIds = '147211,18786' //放开注释代码即可
                        }
                        data.excludeItemIds = selectedProduct.length > 0 ? selectedProduct.join(',') : ''
                            //TODO----------------------------
                        data.promotionMarketplaceId = 'EBAY_US' //修改为当前站点
                        data.storeAcctId = 498 //修改为当前店铺
                            //TODO----------------------------
                        getOnlineProducts(data)
                    })
                    $('#selectableproduct li').click(function() {
                        var isSelected = $(this).attr('data-index')
                        $('#searchOnlineProductForm input[name="isSelected"]').val(isSelected)
                        $('#searchOnlineproducts_deprecated').click()
                        if (isSelected === "0") {
                            $(layero).find('.layui-layer-btn0').addClass('hide')
                            $(layero).find('#ebaypromotion2_batchremove').addClass('hide')
                            $(layero).find('#ebaypromotion2_batchadd_deprecated').removeClass('hide')
                        } else {
                            $(layero).find('.layui-layer-btn0').removeClass('hide')
                            $(layero).find('#ebaypromotion2_batchadd_deprecated').addClass('hide')
                            $(layero).find('#ebaypromotion2_batchremove').removeClass('hide')
                        }
                    })
                    $('#ebaypromotion2_batchadd_deprecated').click(function() {
                        var data = table.checkStatus('ebayPromotion2OnlineProductTable').data
                        if (data.length > 0) {
                            for (var i in data) {
                                selectedProduct.push(data[i].itemId)
                            }
                            $('#searchOnlineproducts_deprecated').click()
                        } else {
                            layer.msg('请勾选要添加的商品')
                        }
                    })
                    $('#ebaypromotion2_batchremove').click(function() {
                        var data = table.checkStatus('ebayPromotion2OnlineProductTable').data
                        if (data.length > 0) {
                            for (var i in data) {
                                var index = selectedProduct.indexOf(data[i].itemId)
                                selectedProduct.splice(index, 1)
                            }
                            $('#searchOnlineproducts_deprecated').click()
                        } else {
                            layer.msg('请勾选要移除的商品')
                        }
                    })
                },
                yes: function(layero, index) {
                    //返回选择商品的itemid ----------------------
                    //TODO
                    var data = table.checkStatus('ebayPromotion2OnlineProductTable').data
                    layer.close(index)
                    return false;
                }
            });
        })
        /**
         * 
         * @param {*} data 渲染树数据
         * @param {*} type 选中单选框
         */
        //选择类目弹框
    function getProductsTreepop(siteId) {
        var zTreeObj = {}
        layer.open({
            type: 1,
            title: '选择产品',
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#pop_productsTree').html(),
            success: function(index, layero) {
                form.render('radio');
                getCategoryTree(604, function(returnData) {
                    zTreeObj = $.fn.zTree.init($("#productsTree"), setting, returnData);
                });
                form.on('radio(catetype)', function(obj) {
                    if (obj.value === 'eBay catrgories') {
                        //站点id目前写死604
                        getCategoryTree(604, function(returnData) {
                            zTreeObj = $.fn.zTree.init($("#productsTree"), setting, returnData);
                        });
                    } else if ((obj.value === 'All Inventory')) {
                        zTreeObj = $.fn.zTree.init($("#productsTree"), setting, []);
                    }
                })
            },
            yes: function(index, layero) {
                var nodes = zTreeObj.getCheckedNodes(true);
                var pnodes = []
                for (var i in nodes) {
                    if (nodes[i].children && nodes[i].children.length > 0) {
                        pnodes.push(nodes[i].cateId)
                    }
                }
                nodes = nodes.filter(function(item) {
                    return pnodes.indexOf(item.pCateId) < 0
                })
                var choosename = (nodes || []).map(function(item) {
                    return item.cateName
                }).join('/')
                var chooseid = (nodes || []).map(function(item) {
                    return item.cateId
                }).join(',')
                $('#chooseCategoryidInput').val(chooseid)
                $('#chooseCategoryInput').val(choosename)
                $('#producttypeSpan').text('>>' + $('input[name="catetype"]').val())
                layer.close(index)
            }
        });
    }

    function getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
        for (var i = 0; i < arr.length; i++) {
            if (value == arr[i][id]) {
                return i;
            }
        }
        return -1;
    }

    //选择指定产品----------------------------------------------------------------------------------------------------------------------------------------------------------------

    function renderCategoryTable(data, index) {
        var tableIns = table.render({
            elem: '#categoryTable' + index || "",
            data: data,
            cols: [
                [ //表头
                    { title: "分类名", field: "cateName" },
                    { title: "价格筛选", field: "storeAcctName", templet: '#screenCategorytpl' },
                    { title: "物品状况", templet: "<div>不限</div>" },
                    { title: "操作", field: "promotionEndTime", toolbar: '#Categoryremovetpl' },
                ]
            ],
            page: false,
            id: "categoryTable" + index || "",
            done: function() {}
        })
    }

    form.verify({
        percent: function(value, item) { //value：表单的值、item：表单的DOM对象
            var name = $(item).attr('name');
            var index = Number(name.split('_')[1])
            if (index > 0) {
                var preinput = $('input[name="percentageOffOrder_' + (index - 1) + '"]').val()
            } else {
                var preinput = -1;
            }
            if (value !== "") {
                if (preinput == "") {
                    return '请填写前一项'
                }
                if (Number(value) < Number(preinput)) {
                    return '填写值需大于前一项'
                }
                if (Number(value) < 5 || Number(value) > 80) {
                    return '促销折扣需在5-80之间'
                }
            }
        },
        imgetips: function(value, item) {
            if (value === "") {
                return '请上传图片或填写网络图片链接'
            }
        },
        greatthanpre: function(value, item) {
            var prevalue = $(item).siblings('input').val()
            if (Number(value) <= Number(prevalue)) {
                return '填写值需要大于起始值'
            }
        }
    });

    //监听表格工具栏
    table.on('tool(ebayPromotion2Table)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event;
        if (layEvent === 'epm2_edit') { //编辑对应的普源id
            if (data.promotionType === 'VOLUME_DISCOUNT') {
                popNewVolumePricing('2', data)
            } else if (data.promotionType === 'ORDER_DISCOUNT') {
                popNewOrderDiscount('2', data)
            } else if (data.promotionType === 'MARKDOWN_SALE') {
                popNewMarkdown('2', data)
            }
        } else if (layEvent === 'epm_delete') {
            layer.confirm('确定删除这条促销?', function(index) {
                deletePromotion(data.id, function(returnData) {
                    layer.msg(returnData.msg);
                    var submitdata = serializeObject($('#ebaypromotionForm'))
                    ebaypromotionTable(submitdata)
                    layer.close(index);
                })
            });
        }
    });
    // 创建/编辑markdown弹框
    function popNewMarkdown(type, data) {
        var title = { '1': '新建Markdown', '2': '编辑Markdown' }
        layer.open({
            type: 1,
            title: title[type || '1'],
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#new_Markdown').html(),
            success: function(index, layero) {
                initLayerForm('newMardownForm', function() {
                    if (type === '2' && data) {
                        data.promotionEndTime = Format(data.promotionEndTime, "yyyy-MM-dd hh:mm:ss")
                        data.promotionStartTime = Format(data.promotionStartTime, "yyyy-MM-dd hh:mm:ss")
                        if (data.promotionImageUrl) {
                            $('#imgpre').append('<img src="' + data.promotionImageUrl + '">')
                        }
                        selectedInventoryDiscounts = JSON.parse(data.selectedInventoryDiscounts);
                        for (var i in selectedInventoryDiscounts) {
                            if (selectedInventoryDiscounts[i].discountBenefit.percentageOffItem) {
                                data.promotionType = "0";
                                var html = template('discountSteptpl', {
                                    data: selectedInventoryDiscounts
                                })
                                $('.percentDiscountBox').html(html);
                                var html = template('promotionProducts', {
                                    data: selectedInventoryDiscounts
                                })
                                $('.promotionProductBox').html(html);
                                renderCategoryTable({}, 0)
                            } else {
                                data.promotionType = "1"
                            }
                        }
                        form.val('newMardownForm', data || {});
                    }
                    $('body').on('click', '.epm2chooseCate', debounce(function() {
                        var index = $(this).attr('data-index')
                        getCategoryTree(data.storeAcctId, function(returnData) {
                            getCategoryTreepop(returnData, index)
                        });
                    }, 1000, 2000))
                });
                $('#adddiscountStep').click(function() {
                    selectedInventoryDiscounts.push({ discountBenefit: { percentageOffItem: "" } })
                    var html = template('discountSteptpl', {
                        data: selectedInventoryDiscounts
                    })
                    $('.percentDiscountBox').html(html);
                    var html = template('promotionProducts', {
                        data: selectedInventoryDiscounts
                    })
                    $('.promotionProductBox').html(html);
                    form.render()
                    renderCategoryTable({}, 0)
                });
                form.on('radio(promotionType)', function(data) {
                    if (data.value === "0") {
                        $('#newMardownForm').find('input[name="percentageOffItem"]').attr('disabled', false)
                        $('#newMardownForm').find('input[name="amountOffItem"]').attr('disabled', true)
                        $('#newMardownForm').find('#adddiscountStep').attr('disabled', false)
                    } else {
                        $('#newMardownForm').find('input[name="percentageOffItem"]').attr('disabled', true)
                        $('#newMardownForm').find('input[name="amountOffItem"]').attr('disabled', false)
                        $('#newMardownForm').find('#adddiscountStep').attr('disabled', true)
                    }
                });
            },
            yes: function() {
                form.on('submit(markdownsubmit)', function(callback) {
                    formdata = callback.field
                    formdata.selectedInventoryDiscounts = selectedInventoryDiscounts
                    formdata.selectedInventoryDiscounts.discountBenefit = {}
                    formdata.promotionType === "0" ?
                        formdata.selectedInventoryDiscounts.discountBenefit.percentageOffItem = formdata.percentageOffItem :
                        formdata.selectedInventoryDiscounts.discountBenefit.amountOffItem = formdata.amountOffItem
                    if (type === '2') {
                        formdata.id = data.id
                        console.log(formdata, '123')
                        modifyMarkdown(formdata, function(returnData) {
                            console.log(returnData, 'returnData')
                        })
                    }
                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
                $('#markdownsubmit').click()
                setTimeout(function() {
                    return false;
                }, 0)
            }
        });
    }

    /**
     * 创建/编辑Volume Pricing弹框
     * @param type 1 创建  2编辑
     * @param data 编辑Volume数据
     */
    function popNewVolumePricing(type, data) {
        console.log(data, 'data')
        var title = { '1': '新建Volume Pricing', '2': '编辑Volume Pricing' }
        layer.open({
            type: 1,
            title: title[type || '1'],
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#new_VolumePricing').html(),
            success: function(index, layero) {
                initLayerForm('newVolumePriceForm', function() {
                    if (type === '2' && data) {
                        data.promotionEndTime = Format(data.promotionEndTime, "yyyy-MM-dd hh:mm:ss")
                        data.promotionStartTime = Format(data.promotionStartTime, "yyyy-MM-dd hh:mm:ss")
                        if (data.promotionImageUrl) {
                            $('#imgpre').append('<img src="' + data.promotionImageUrl + '">')
                        }
                        var inventoryCriterion = JSON.parse(data.inventoryCriterion);
                        data.inventoryCriterionType = inventoryCriterion.inventoryCriterionType
                        if (data.inventoryCriterionType === 'INVENTORY_BY_RULE') {
                            $('.getByrules').remove('hide');

                        } else if (data.inventoryCriterionType === 'INVENTORY_BY_VALUE') {
                            $('.getByspcificProduct').remove('hide')
                        }
                        var discountRules = JSON.parse(data.discountRules);
                        data.percentageOffOrder_0 = discountRules[0].discountBenefit.percentageOffOrder
                        data.percentageOffOrder_1 = discountRules[1].discountBenefit.percentageOffOrder
                        data.percentageOffOrder_2 = discountRules[2].discountBenefit.percentageOffOrder

                        form.render()
                        form.val('newVolumePriceForm', data || {});
                    }

                    $('body').on('click', '.epm2chooseCate', debounce(function() {
                        var index = $(this).attr('data-index')
                        var getTreeType = $('#categoryChoose').val()
                        if (getTreeType === '1') {
                            getCategoryTree(data.storeAcctId, function(returnData) {
                                getCategoryTreepop(returnData, index)
                            });
                        } else {
                            getStoreTree(data.storeAcctId, function(returnData) {
                                getCategoryTreepop(returnData, index)
                            })
                        }
                    }, 1000, 2000))
                });

            },
            yes: function(index, layero) {
                //保存Volume Pricing促销
                $('#newVolumePricesubmit').click();
                form.on('submit(newVolumePricesubmit)', function(callback) {
                    var field = callback.field
                    var discountRules = [{ discountBenefit: { percentageOffOrder: '0' }, discountSpecification: { minQuantity: '1' } }]
                    var inventoryCriterion = {}
                    $('input[name^="percentageOffOrder"]').each(function(index, item) {
                        if ($(item).val() !== '') {
                            discountRules.push({ discountBenefit: { percentageOffOrder: $(item).val() }, discountSpecification: { minQuantity: index + 1 } })
                        }
                    })
                    if (field.inventoryCriterionType == "INVENTORY_BY_RULE") {
                        inventoryCriterion.ruleCriteria = {}
                        inventoryCriterion.inventoryCriterionType = field.inventoryCriterionType
                        inventoryCriterion.excludeInventoryItems = field.excludeInventoryItems
                        inventoryCriterion.ruleCriteria[field.chooseType] = field.idList
                    }
                    //编辑Volume Pricing
                    if (type === '2' && data) {
                        field.promotionId = data.promotionId;
                        field.id = data.id;
                        field.promotionType = data.promotionType;
                        field.promotionStatus = data.promotionStatus;
                        field.discountRules = discountRules;
                        //调用编辑volumePrice接口
                        modifyVolumePrice(field, function(returnData) {
                                console.log(returnData)
                            })
                            //新增促销
                    } else if (type === '1') {

                    }

                    return false;
                })
                setTimeout(function() {
                    return false;
                }, 0)
            }
        });
    }

    function getCategoryTreepop(data, index) {
        var zTreeObj = {}
        layer.open({
            type: 1,
            title: '选择产品分类',
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#pop_categoriesTree').html(),
            success: function(index, layero) {
                // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "checkbox",
                        chkDisabledInherit: true,
                        chkboxType: { "Y": "s", "N": "s" }
                    },
                    data: {
                        key: {
                            children: "children",
                            name: "cateName",
                        },
                        simpleData: {
                            enable: true,
                            idKey: "cateId",
                            pIdKey: "pCateId",
                        },
                        view: {
                            selectedMulti: true,
                            showIcon: false
                        }
                    },
                    callback: {
                        onCheck: function(treeId, treeNode) {}
                    },
                };
                // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
                zTreeObj = $.fn.zTree.init($("#categoriesTree"), setting, data);
            },
            yes: function(index, layero) {
                var nodes = zTreeObj.getCheckedNodes(true);
                var pnodes = []
                for (var i in nodes) {
                    if (nodes[i].children.length > 0) {
                        pnodes.push(nodes[i].cateId)
                    }
                }
                nodes = nodes.filter(function(item) {
                    return pnodes.indexOf(item.pCateId) < 0
                })
                renderCategoryTable(nodes, "");
                layer.close(index);
                return false;
            }
        });
    }

    // 创建/编辑Order Discount弹框
    function popNewOrderDiscount(type) {
        var title = { '1': '新建Order Discount', '2': '编辑Order Discount' }
        layer.open({
            type: 1,
            title: title[type || '1'],
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#new_OrderDiscount').html(),
            success: function(index, layero) {
                initLayerForm('newOrderDiscountForm')
            }
        });
    }

    //封装promise ajax   url, method, data, func, contentType
    function ajaxPromise(param) {
        return new Promise(function(resovle, reject) {
            $.ajax({
                "type": param.method || "get",
                "async": true,
                "url": param.url,
                "data": param.data || "",
                "success": function(res) {
                    resovle(res);
                },
                "error": function(err) {
                    reject(err);
                }
            })
        })
    }

    function initLayerForm(formId, func) {
        form.render()
        var Siteparam = { url: ctx + '/ebayMarketingDiscount/getEbaySiteList.html', method: 'GET', data: {} }
        var Storeparam = { url: ctx + '/sys/liststore.html', method: 'POST', data: { roleNames: 'ebay专员', orgId: '', salePersonId: '', platCode: 'ebay' } }
        var p1 = ajaxPromise(Siteparam)
        var p2 = ajaxPromise(Storeparam)

        Promise.all([p1, p2]).then((result) => {
            appendSelect(formId, 'layer_store', JSON.parse(result[1]).data, 'id', 'storeAcct');
            appendSelect(formId, 'layer_site', JSON.parse(result[0]).data.ebaySiteList, 'marketplaceId', 'siteName');
            form.render()
            if (func) {
                func()
            }
        }).catch((error) => {})
        laydate.render({
            elem: '#layer_starttime',
            type: 'datetime',
        });

        laydate.render({
            elem: '#layer_endtime',
            type: 'datetime',
        });
        upload.render({
            elem: '#layer_uploadLocal' //绑定元素
                ,
            url: ctx + '/ebayMarketingDiscount/uploadPic.html' //上传接口
                ,
            done: function(res) {
                $('#imgurl').val(res.data)
                $('#imgpre').append('<img src="' + res.data + '">')
            },
            error: function() {
                //请求异常回调
            }
        });
        $('#layer_uploadOnline').click(function() {
            layer.open({
                type: 1,
                title: '网络图片地址',
                btn: ['保存', '关闭'],
                area: ['40%', '200px'],
                content: $('#pop_uploadOnline').html(),
                success: function(index, layero) {},
                yes: function(index, layero) {
                    $('#submitImgurl').click()
                    var imgurl = $(layero).find('input').val();
                    $('#imgurl').val(imgurl)
                    $('#imgpre').append('<img src="' + imgurl + '">')
                    layer.close(index)
                }
            });
        });
        form.on('select(categoryFact_deprecated)', function(data) {
            if (data.value === "INVENTORY_ANY") {
                $('.getByspcificProduct').addClass('hide')
                $('.getByrules').addClass('hide')
            } else if (data.value === "INVENTORY_BY_RULE") {
                $('.getByspcificProduct').addClass('hide')
                $('.getByrules').removeClass('hide')
            } else if (data.value === "INVENTORY_BY_VALUE") {
                $('.getByspcificProduct').removeClass('hide')
                $('.getByrules').addClass('hide')
            }
        });
    }

    function process() {
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: '同步进度',
            area: ['50%', '200px'],
            content: '<div class="m20"><div class="layui-progress layui-progress-big" lay-filter="demo" lay-showpercent="true"><div class="layui-progress-bar" lay-percent="0%"><span class="layui-progress-text">0%</span></div></div></div>',
            success: function() {
                var pro = 0;
                timer = setInterval(function() {
                    pro += 1;
                    if (pro < 97) {
                        $('.layui-progress-text').text(pro > 100 ? 100 + '%' : pro + '%');
                        layui.element.progress('demo', pro + '%');
                    }
                }, 1000);
            }
        });
    }

    function clearprocess() {
        layui.element.progress('demo', '100%');
        setTimeout(function() {
            clearInterval(timer);
            layer.closeAll();
        }, 1000);
    }
});

function delStep(index, item) {
    $(item).parents('.w_250').remove();
    $('.panel[data-index=' + index + ']').remove()
    selectedInventoryDiscounts.splice(index, 1);
}

//点击防抖函数
function debounce(fn, delay, mustRunDelay) {
    var timer = null;
    var t_start;
    return function() {
        var context = this;
        var args = arguments;
        var t_curr = +new Date();
        clearTimeout(timer);
        if (!t_start) {
            t_start = t_curr;
            fn.apply(context, args);
        }
        if (t_curr - t_start >= mustRunDelay) {
            fn.apply(context, args);
            t_start = t_curr
        }
    }
}