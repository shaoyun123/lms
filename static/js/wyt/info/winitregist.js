
layui.use(['form', 'admin', 'table', 'layer', 'element', 'laypage', 'laydate', 'formSelects'], function() {
    let form = layui.form,
        admin = layui.admin,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        layer = layui.layer;
    formSelects.render('winitregist_searchForm_channelListStr');
    formSelects.render('winitregist_searchForm_serviceTypeListStr');
    form.render('select');
    laydate.render({
        elem: '#winitregist_time',
        type: 'date',
        range: true
    });
    laydate.render({
        elem: '#winitregist_time2',
        type: 'date',
        range: true
    });
    // 检查是否从其他页面跳转，进行新增操作
    function winitregist_urlToInit() {
        let  sSkuListStr = window.sessionStorage.winitregist_addSku
        if (!sSkuListStr) {
            return
        }
        winitregist_addOnePop(sSkuListStr)
        window.sessionStorage.winitregist_addSku = ''
    }
    winitregist_urlToInit()

    // 类目选择
    $("#winitregist_searchCate_btn").click(function() {
        admin.itemCat_select('layer-work-develop-winitregist', 'winitregist_cateId_search_inp', 'winitregist_search_cate');
    });
    // 人员选择
    render_hp_orgs_users("#orgs_hp_devPerson_winitregistForm",function () {
        formSelects.render('winitregist_devPerson');
    });
    render_hp_orgs_users("#orgs_hp_saler_winitregistForm",function () {
        formSelects.render('winitregist_saler');
    });
    // 清空按钮事件
    $("#winitregist_searchReset").click(function() {
        let searchForm = $('#winitregistForm');
        searchForm.find('[name]:not(.hiddenContent)').val('')
        $("#winitregist_search_cate").html('');
        form.render('select','winitregistForm')
        formSelects.value('winitregist_searchForm_channelListStr', ['']);
        formSelects.value('winitregist_searchForm_serviceTypeListStr', ['']);
        formSelects.value('users_hp_devPerson_winitregist', ['']);
        formSelects.value('users_hp_saler_winitregist', ['']);
    });

    // 限制查询sku 条件输入长度
    form.on('select(skuTypeSelect_winitregist)', function(data){
        let value = data.value;
        let searchForm = $('#winitregistForm');
        searchForm.find('[name=searchValue]').attr('maxlength','2000');
        if (value === 'pSku2' || value === 'sSku2') {
            searchForm.find('[name=searchValue]').attr('maxlength','40000')
        }
    });

    // 查询
    $("#winitregist_searchBtn").click(function () {
        let data = serializeObject($('#winitregistForm'));
        if (data.ifNeedCompress) {
            data.ifNeedCompress = data.ifNeedCompress === 'true'
        }
        let formElem = $('#winitregistForm')
        if (data.bizzOwnerOrganize && !data.bizzOwnerIdListStr) {
            data.bizzOwnerIdListStr = formElem.find('[lay-filter=users_hp_devPerson_winitregist]').attr('user_ids')
        }
        if (data.salerOrganize && !data.salerIdListStr) {
            data.salerIdListStr = formElem.find('[lay-filter=users_hp_saler_winitregist]').attr('user_ids')
        }
        winitregistTableorder(data)
    });

    // 页签切换
    element.on('tab(winitregist_Tab)', function (data) {
        let type = data.elem.context.dataset.type;
        let searchForm = $('#winitregistForm');
        searchForm.find('[name="auditStatus"]').val('');
        searchForm.find('[name="registStatus"]').val('');
        let status = data.elem.context.dataset.status;
        searchForm.find('[name='+ type +']').val(status);
        $('#winitregist_searchBtn').click();
        if (type === 'auditStatus') {
            $('#registSearchCondition').hide()
            $('#winitregist_auditBtn').show()
            $('#winitregist_registBtn').hide()
            $('.auditSearchCondition').show()
            switch (status){
                case '0':
                    $('#winitregist_releaseListBtn').show()
                    $('#winitregist_deleteListBtn').show()
                    $('#winitregist_auditListBtn').hide()
                    break
                case '1':
                case '2':
                    $('#winitregist_auditListBtn').show()
                    $('#winitregist_releaseListBtn').hide()
                    $('#winitregist_deleteListBtn').hide()
                    break
                case '3' :
                    $('#winitregist_releaseListBtn').show()
                    $('#winitregist_auditListBtn').show()
                    $('#winitregist_deleteListBtn').hide()
            }
        } else {
            $('#registSearchCondition').show()
            $('#winitregist_registBtn').show()
            $('#winitregist_auditBtn').hide()
            $('.auditSearchCondition').hide()

        }


    });
    // 统计各页签的商品数量
    function winitregist_countForAllTab(data) {
        $.ajax({
            type: "post",
            url: ctx + "/winitSInfo/countForAllTab.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data),
            success: function(res) {
                if (res.code === '0000') {
                    let auditStatusCountMap = res.data.auditStatusCountMap
                    let registerStatusCountMap = res.data.registerStatusCountMap
                    let tabBox = $('#winitregist_Tab')
                    tabBox.find('[data-type] span').text('(0)')
                    for (let i = 0; i < auditStatusCountMap.length; ++i) {
                        tabBox.find('[data-type=auditStatus][data-status='+ auditStatusCountMap[i].audit_status +'] span').text('(' + auditStatusCountMap[i].num+ ')')
                    }
                    for (let i = 0; i < registerStatusCountMap.length; ++i) {
                        tabBox.find('[data-type=registStatus][data-status='+ registerStatusCountMap[i].register_status +'] span').text('(' + registerStatusCountMap[i].num+ ')')
                    }
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    //渲染表格数据
    function winitregistTableorder(data) {
        let col
        if (data.auditStatus != '') {
            if (data.auditStatus === '2' || data.auditStatus === '3') {
                col = [
                    {type: "checkbox", width: 30 },
                    {title: "图片", templet: "#winitregist_tab_image"},
                    {title: "sku", templet: "#winitregist_tab_sku"},
                    {title: "在售", templet: "#winitregist_tab_isSale", width: 40},
                    {title: "简称", templet: "#winitregist_tab_desc"},
                    {title: "责任人", templet: "#winitregist_tab_responsor", align:'left'},
                    {title: "销量", templet: "#winitregist_tab_sales", align:'left'},
                    {title: "成本", templet: "#winitregist_tab_cost",width: 80},
                    {title: "重量(g)", templet: "#winitregist_tab_weight", align:'left'},
                    {title: "尺寸(cm)", templet: "#winitregist_tab_size"},
                    {title: "英国信件", templet: "#winitregist_UKLetterBox",width: 60},
                    {title: "德国信件", templet: "#winitregist_DELetterBox",width: 60},
                    {title: "推荐理由", templet: "#winitregist_tab_recommendReason"},
                    {title: "建议发货量", templet: "#winitregist_tab_suggestSendAmt"},
                    {title: "可用/在途/未派", templet: "#winitregist_tab_stockNum"},
                    {title: "审核备注", templet: "#winitregist_tab_auditRemark"},
                    {title: "时间", templet: "#winitregist_tab_time"},
                    { title: '操作', toolbar: "#winitregist_tab_toolBar_audit", width: 100 }
                ]
            } else {
                col = [
                    {type: "checkbox", width: 30 },
                    {title: "图片", templet: "#winitregist_tab_image"},
                    {title: "sku", templet: "#winitregist_tab_sku"},
                    {title: "在售", templet: "#winitregist_tab_isSale", width: 40},
                    {title: "简称", templet: "#winitregist_tab_desc"},
                    {title: "责任人", templet: "#winitregist_tab_responsor", align:'left'},
                    {title: "销量", templet: "#winitregist_tab_sales", align:'left'},
                    {title: "成本", templet: "#winitregist_tab_cost",width: 80},
                    {title: "重量(g)", templet: "#winitregist_tab_weight", align:'left'},
                    {title: "尺寸(cm)", templet: "#winitregist_tab_size"},
                    {title: "英国信件", templet: "#winitregist_UKLetterBox",width: 60},
                    {title: "德国信件", templet: "#winitregist_DELetterBox",width: 60},
                    {title: "推荐理由", templet: "#winitregist_tab_recommendReason"},
                    {title: "建议发货量", templet: "#winitregist_tab_suggestSendAmt"},
                    {title: "可用/在途/未派", templet: "#winitregist_tab_stockNum"},
                    {title: "时间", templet: "#winitregist_tab_time"},
                    { title: '操作', toolbar: "#winitregist_tab_toolBar_audit", width: 100 }
                ]
            }
        } else {
            if (data.registStatus === '3') {
                col = [
                    {type: "checkbox", width: 30 },
                    {title: "图片", templet: "#winitregist_tab_image"},
                    {title: "销售渠道", templet: "#winitregist_tab_channel"},
                    {title: "sku", templet: "#winitregist_tab_sku"},
                    {title: "在售", templet: "#winitregist_tab_isSale", width: 40},
                    {title: "有效", templet: "#winitregist_tab_ifEffective", width: 40},
                    {title: "简称", templet: "#winitregist_tab_desc_forRegist"},
                    {title: "责任人", templet: "#winitregist_tab_responsor", align:'left'},
                    {title: "销量", templet: "#winitregist_tab_sales", align:'left'},
                    {title: "成本", templet: "#winitregist_tab_cost",width: 80},
                    {title: "重量(g)", templet: "#winitregist_tab_weight", align:'left'},
                    {title: "尺寸(cm)", templet: "#winitregist_tab_size"},
                    {title: "英国信件", templet: "#winitregist_UKLetterBox",width: 60},
                    {title: "德国信件", templet: "#winitregist_DELetterBox",width: 60},
                    {title: "服务商数据", templet: "#winitregist_tab_winitData"},
                    {title: "失败原因", templet: function(res){
                        let html = '<div class="followRemarkBox"  onmouseover="showTip(`' + res.siteInfo.syncProdInfo.registerRemark.replace(/\"/g, "'") + '`, this)" onmouseleave="removeTip(this)" >' + res.siteInfo.syncProdInfo.registerRemark + '</div>'
                        return '<em>'+ html +'</em>'
                    }},
                    {title: "时间", templet: "#winitregist_tab_time"},
                    { title: '操作', toolbar: "#winitregist_tab_toolBar_register", width: 100 }
                ]
            } else {
                col = [
                    {type: "checkbox", width: 30 },
                    {title: "图片", templet: "#winitregist_tab_image"},
                    {title: "销售渠道", templet: "#winitregist_tab_channel"},
                    {title: "sku", templet: "#winitregist_tab_sku"},
                    {title: "在售", templet: "#winitregist_tab_isSale", width: 40},
                    {title: "有效", templet: "#winitregist_tab_ifEffective", width: 40},
                    {title: "简称", templet: "#winitregist_tab_desc_forRegist"},
                    {title: "责任人", templet: "#winitregist_tab_responsor", align:'left'},
                    {title: "销量", templet: "#winitregist_tab_sales", align:'left'},
                    {title: "成本", templet: "#winitregist_tab_cost",width: 80},
                    {title: "重量(g)", templet: "#winitregist_tab_weight", align:'left'},
                    {title: "尺寸(cm)", templet: "#winitregist_tab_size"},
                    {title: "英国信件", templet: "#winitregist_UKLetterBox",width: 60},
                    {title: "德国信件", templet: "#winitregist_DELetterBox",width: 60},
                    {title: "服务商数据", templet: "#winitregist_tab_winitData"},
                    {title: "时间", templet: "#winitregist_tab_time"},
                    { title: '操作', toolbar: "#winitregist_tab_toolBar_register", width: 100 }
                ]
            }
        }

        table.render({
            elem: '#winitregist_table',
            method: 'POST',
            url: ctx + '/winitSInfo/queryPage.html',
            where: data,
            cols: [
                col
            ],
            page: true,
            limit: 50,
            limits: [50, 100, 500],
            id: 'winitregist_table',
            done: function (res) {
                winitregist_countForAllTab(data)
                imageLazyload();
            }
        })
    }

    $('#winitregist_addProdBtn').click(function () {
        winitregist_addOnePop()
    });
    function winitregist_addOnePop(sSkuSearch) {
        let popIndex = layer.open({
            title: '新增商品',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1200px', '80%'],
            id: 'winitregist_addProdPop',
            btn: ['保存', '保存并发布', '关闭'],
            content: $('#winitregist_addProductLayer').html(),
            success: function () {
                initNotNull('#winitregist_addProdForm');
                // 展现初始化的子商品表格
                winitregist_showProdSInfoForAdd([]);
                // 初始增加1个空白竞品
                winitregist_addCompList([{}]);
                // 查询功能
                $('#winitregist_searchPsku').click(function () {
                    // 清空之前的查询信息
                    let addForm = $('#winitregist_addProdForm');
                    addForm.find('[name=prodPId]').val('');
                    addForm.find('[name=pSku]').val('');
                    winitregist_showProdSInfoForAdd([]);
                    winitregist_clearCompList();
                    winitregist_searchPsku()
                });
                // 新增竞品
                $('.winitregist_addMoreCompBtn').click(function () {
                    winitregist_addCompList([{}])
                })

                if (sSkuSearch) {
                    $('#winitregist_addProdForm').find('[name=sSkuSearch]').val(sSkuSearch)
                    $('#winitregist_searchPsku').click()
                }
            },
            yes: function() {
                winitregist_addProd(false,popIndex)
                return false
            },
            btn2: function () {
                winitregist_addProd(true,popIndex)
                return false
            }
        })
    }
    function winitregist_addProd(ifRelease, popIndex) {
        // 获取数据
        let addForm = $('#winitregist_addProdForm');
        let Adata = {
            id : addForm.find('[name=prodPId]').val(),
            pSku : addForm.find('[name=pSku]').val(),
            recommendReason : addForm.find('[name=recommendReason]').val().trim(),
        };
        if (!Adata.id) {
            layer.msg('请输入父sku');
            return false
        }
        if (!Adata.recommendReason) {
            layer.msg('请输入推荐理由');
            return false
        }
        // 获取竞品数据,要求必须要有1个ebay/ amazon 平台的竞品
        let compList = winitregist_getCompData();
        if (!compList) {
            return false
        }
        Adata.compList = compList;

        // 获取子商品数据
        let winitSInfoDtoList = winitregist_getProdSInfoData(ifRelease);
        if (!winitSInfoDtoList) {
            return false
        }
        Adata.winitSInfoDtoList = winitSInfoDtoList;

        $.ajax({
            type: "post",
            url: ctx + "/winitSInfo/addOne.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(Adata),
            success: function(res) {
                if (res.code === '0000') {
                    layer.msg('新增成功');
                    table.reload('winitregist_table');
                    layer.close(popIndex)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 获取竞品数据
    function winitregist_getCompData() {
        let trList = $('.winitregist_compTab_addProductLayer tr');
        if (trList.length === 0) {
            layer.msg('竞品链接不能为空');
            return false
        }
        let compList = [];
        let hasEbayOrAmazon = false;
        for (let i = 0; i < trList.length; ++i) {
            let option = $(trList[i]).find('[name=channel] option:selected');
            if (!option || option.length === 0 || !option.val()) {
                layer.msg('所有竞品链接必须选择销售渠道');
                return false
            }
            let plat = option.attr('data-plat');
            if (plat === 'ebay' || plat === 'amazon') {
                hasEbayOrAmazon = true
            }
            let url = $(trList[i]).find('[name=url]').val().trim();
            if (!url) {
                layer.msg('请填写完整的竞品链接');
                return false
            }
            if (url.length >= 1000) {
                layer.msg('链接长度不可超过1000')
                return
            }
            let id = $(trList[i]).find('[name=id]').val() || null
            compList.push({
                id: id,
                channel: $(trList[i]).find('[name=channel]').val(),
                url: url,
            })
        }
        if (!hasEbayOrAmazon) {
            layer.msg('必须有一个ebay或者amazon平台的竞品链接');
            return false
        }
        return compList
    }

    // 获取子商品数据
    function winitregist_getProdSInfoData(ifRelease) {
        let winitSInfoDtoList = [];
        let checkStatus = table.checkStatus('winitregist_prodSInfoTable'),
            data = checkStatus.data;
        if(!data.length){
            layer.msg('请选择需要生成的子商品数据!');
            return false
        }
        let winitSInfoDtoJson = {};
        for (let i = 0; i < data.length; ++i) {
            let one = {
                prodSId: data[i].id,
                sSku: data[i].sSku,
                ifDELetterMeasure: data[i].ifDELetterMeasure,
                ifUKLetterMeasure: data[i].ifUKLetterMeasure,
            };
            if (ifRelease) {
                one.auditStatus = 1
            } else {
                one.auditStatus = 0
            }
            winitSInfoDtoList.push(one);
            winitSInfoDtoJson[data[i].id] = one
        }
        // 获取各销售渠道的建议发货数量
        let suggestInpList = $('#winitregist_addProdForm').find('[name=suggestSendAmt]');
        for (let i = 0; i < suggestInpList.length; ++i) {
            let prodSId = suggestInpList[i].getAttribute('data-prodSId');
            let channel = suggestInpList[i].getAttribute('data-channel');
            let suggestSendAmt = suggestInpList[i].value || 0;
            if (!isInteger(suggestSendAmt)) {
                layer.msg('建议发货数量必须为非负整数');
                return false
            }
            if (winitSInfoDtoJson[prodSId]) {
                if (!winitSInfoDtoJson[prodSId].suggestAmtInfoList) {
                    winitSInfoDtoJson[prodSId].suggestAmtInfoList = []
                }
                winitSInfoDtoJson[prodSId].suggestAmtInfoList.push({
                    prodSId: winitSInfoDtoJson[prodSId].prodSId,
                    sSku: winitSInfoDtoJson[prodSId].sSku,
                    channel: channel,
                    suggestSendAmt: suggestSendAmt
                })
            }
        }

        return winitSInfoDtoList
    }
    // 查询父sku
    function winitregist_searchPsku() {
        let data = {
            pSku: $('#winitregist_addProdForm').find('[name=pSkuSearch]').val().trim()
        };
        let sSkuStr = $('#winitregist_addProdForm').find('[name=sSkuSearch]').val().trim()
        if (sSkuStr) {
            data.sSkuList = sSkuStr.replace(/，/ig,',').split(',')
        }
        if (!data.pSku && !data.sSkuList) {
            layer.msg('请输入要新增的父sku或者子sku')
            return
        }
        $.ajax({
            type: "post",
            url: ctx + "/winitSInfo/getProdListByPsku.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data),
            success: function(res) {
                if (res.code === '0000') {
                    let list = res.data;
                    // 设置当前父sku信息
                    let addForm = $('#winitregist_addProdForm');
                    addForm.find('[name=prodPId]').val(list[0].pId);
                    addForm.find('[name=pSku]').val(data.pSku);
                    // 如果原来已经保存了竞品链接、推荐原因数据。复现之
                    if (res.extra) {
                        let originCompList = res.extra.compList;
                        winitregist_addCompList(originCompList);
                        addForm.find('[name=recommendReason]').val(res.extra.recommendReason);
                    } else {
                        winitregist_addCompList([{}]);
                    }

                    // 给每个子商品构建注册信息
                    let channelList = [];
                    let channelOptionList = $('#winitregister_Form_channelDiv').find("option");
                    for (let i = 0; i < channelOptionList.length; ++i) {
                        if (channelOptionList[i].value) {
                            channelList.push(channelOptionList[i].value)
                        }
                    }
                    for (let i = 0; i < list.length; ++i) {
                        list[i].suggestAmtInfoList = [];
                        for (let j = 0; j < channelList.length; ++j) {
                            list[i].suggestAmtInfoList.push({
                                prodSId: list[i].id,
                                sSku: list[i].sSku,
                                channel: channelList[j],
                                suggestSendAmt: '',
                            })
                        }
                    }
                    winitregist_showProdSInfoForAdd(list)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 渲染子sku数据
    function winitregist_showProdSInfoForAdd(data) {
        table.render({
            elem: '#winitregist_prodSInfoTable',
            data: data,
            cols: [
                [
                    {type: "checkbox", width: 30 },
                    {title: "子sku", field: "sSku", width: 120},
                    {title: "计划德国信件<input type='checkbox' data-name='ifDELetterMeasure' lay-filter='allLetterMeasureBox'lay-skin='primary'>", width: 100, templet: function(row){
                        var html = "<input type='checkbox' name='ifDELetterMeasure' lay-skin='primary' lay-filter='ifLetterMeasure' table-index='"+row.LAY_TABLE_INDEX+"'" + (row.ifDELetterMeasure ? "checked" : "") + ">";
                        return html;
                        }
                    },
                    {title: "计划英国信件<input type='checkbox' data-name='ifUKLetterMeasure' lay-filter='allLetterMeasureBox'lay-skin='primary'>", width: 100, templet: function(row){
                        var html = "<input type='checkbox' name='ifUKLetterMeasure' lay-skin='primary' lay-filter='ifLetterMeasure' table-index='"+row.LAY_TABLE_INDEX+"'" + (row.ifUKLetterMeasure ? "checked" : "") + ">";
                        return html;
                    }
                    },
                    {title: "销售渠道", templet: "#winitregist_addProd_channel", width: 120},
                    {templet: "#winitregist_addProd_suggestSendAmt", title: "<div>建议发货数量</div><div><input style='width: 100px' placeholder='ebay美国' type='number'><span class='canClickEl mr10' onclick='setAllSuggestSendAmt(this,`ebay美国`)'>应用</span><input style='width: 100px' placeholder='ebay英国' type='number'><span class='canClickEl mr10' onclick='setAllSuggestSendAmt(this,`ebay英国`)'>应用</span><input style='width: 100px' placeholder='ebay德国' type='number'><span class='canClickEl mr10' onclick='setAllSuggestSendAmt(this,`ebay德国`)'>应用</span></div>"}
                ]
            ],
            height: 300,
            page: true,
            limit: 50,
            limits: [50, 100, 500],
            id: 'winitregist_prodSInfoTable',
            done: function (obj) {
                // 单个选择计划信件事件
                form.on('checkbox(ifLetterMeasure)', function(data){
                    var _index = $(data.elem).attr('table-index')||0;
                    let elemName = data.elem.name
                    obj.data[_index][elemName] = data.elem.checked;
                });
                // 全选/全不选计划信件事件
                form.on('checkbox(allLetterMeasureBox)', function(data){
                    if (!obj.data || obj.data.length === 0) {
                        return
                    }
                    // 数据变更
                    let elemName = data.elem.getAttribute('data-name')
                    for (let i = 0; i < obj.data.length; ++i) {
                        obj.data[i][elemName] = data.elem.checked
                    }
                    // 元素变更
                    $('#winitregist_addProdForm [name='+ elemName +']').prop('checked',data.elem.checked)
                    form.render('checkbox','winitregist_addProdForm')
                });
            }
        })
    }

    /**
     * 新增竞品链接
     * @param compList 待新增的竞品链接数据
     * @param ifNotRemoveAble  是否  不允许移除
     */
    function winitregist_addCompList(compList,ifNotRemoveAble) {
        let channelHtml = $('#winitregister_Form_channelDiv').html();
        let html = '';
        let oneTr;
        for (let i = 0; i < compList.length; ++i){
            oneTr = '<tr>';
            oneTr += '<td><input type="hidden" name="id" value="'+ (compList[i].id || null) +'"><select name="channel" data-value="'+ (compList[i].channel || '') +'">' + channelHtml + '</select></td>';
            oneTr += '<td><div class="layui-col-lg10 layui-col-md10"><input class="layui-input" name="url" value="'+ (compList[i].url || '') +'"></div><div class="layui-col-lg2 layui-col-md2 canClickEl clickToUrl" onclick="clickToPreInpUrl(this)">点击跳转</div></td>';
            oneTr += '<td>'
            oneTr +=  !ifNotRemoveAble ? '<div class="layui-btn layui-btn-sm" onclick="removeCurrentTr(this)" >移除</div>' : ''
            oneTr +=  '</td>';
            oneTr += '</tr>';
            html += oneTr;
        }
        $('.winitregist_compTab_addProductLayer').append(html);
        // 渲染销售渠道
        let selectList = $('.winitregist_compTab_addProductLayer [name=channel]');
        for (let i = 0; i < selectList.length; ++i) {
            let value = selectList[i].getAttribute('data-value');
            if (value) {
                $(selectList[i]).find('option[value='+ value +']').attr('selected','selected')
            }
        }
        form.render('select','winitregist_compTab_addProductLayer')
    }

    // 清空竞品数据
    function winitregist_clearCompList() {
        $('.winitregist_compTab_addProductLayer').html('')
    }

    // 修改电池信息
    $('#winitregist_updateBatteryInfoBtn').click(function () {
        popToEditBatteryInfo()
    })
    function popToEditBatteryInfo() {
        let checkStatus = table.checkStatus('winitregist_table'),
            data = checkStatus.data;
        if (!data || !data.length) {
            layer.msg('请选择需要修改的商品')
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }

        let popIndex = layer.open({
            title: '修改电池信息',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['600px', '350px'],
            id: 'winitRegist_updateBatteyInfoLayer',
            btn: ['保存', '关闭'],
            content: $('#winitRegist_updateBatteyInfoPop').html(),
            success: function () {
                initNotNull('#winitRegist_updateBatteyInfoForm')
                form.render('select','winitRegist_updateBatteyInfoForm')
            },
            yes: function () {
                if (!checkNotNull('#winitRegist_updateBatteyInfoForm')) {
                    return false
                }
                let data = serializeObject($('#winitRegist_updateBatteyInfoForm'))
                data.idList = idList
                oneAjax.post({
                    url: '/winitSInfo/updateBatteryInfo',
                    data: data,
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('修改成功')
                            layer.close(popIndex)
                            refreshTable();
                        }
                    }
                })
            }
        })
    }


    $('#winitregist_releaseListBtn').click(function () {
        let checkStatus = table.checkStatus('winitregist_table'),
            data = checkStatus.data;
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let index = layer.confirm('确认发布这些商品吗',{btn: ['确认', '取消']},
            function () {
                winitregist_releaseProd(idList)
                layer.close(index)
            })
    })

    $('#winitregist_deleteListBtn').click(function () {
        let checkStatus = table.checkStatus('winitregist_table'),
            data = checkStatus.data;
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            if (data[i].auditStatus !== 0) {
                layer.msg('子Sku: ' + data[i].prodSInfo.sSku + " 非待发布状态,不可删除")
                return
            }
            idList.push(data[i].id)
        }
        let index = layer.confirm('确认删除这些商品吗',{btn: ['确认', '取消']},
            function () {
                winitregist_deleteProd(idList)
                layer.close(index)
            })
    });

    $('#winitregist_auditListBtn').click(function () {
        let checkStatus = table.checkStatus('winitregist_table'),
            data = checkStatus.data;
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        if (idList.length === 0) {
            layer.msg('请选择需要审核的商品')
            return
        }
        winitregist_auditProd(idList)
    })

    // 发布商品
    function winitregist_releaseProd(idList) {
        if (!idList || idList.length === 0) {
            layer.msg('请选择需要发布的商品')
            return
        }
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/winitSInfo/releaseByIdList.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(idList),
            success: function(res) {
                loading.hide()
                if (res.code === '0000') {
                    layer.msg('发布成功')
                    table.reload('winitregist_table');
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 删除商品
    function winitregist_deleteProd(idList) {
        if (!idList || idList.length === 0) {
            layer.msg('请选择需要删除的商品')
            return
        }
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/winitSInfo/deleteByIdList.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(idList),
            success: function(res) {
                loading.hide()
                if (res.code === '0000') {
                    layer.msg('删除成功')
                    table.reload('winitregist_table');
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 审核商品
    function winitregist_auditProd(idList) {
        let popIndex = layer.open({
            title: '审核商品',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['600px', '350px'],
            id: 'winitregist_addProdPop',
            btn: ['审核', '关闭'],
            content: $('#winitregist_auditPop').html(),
            success: function () {
                initNotNull('#winitregist_auditForm')
                form.render('radio','winitregist_auditForm')
            },
            yes: function () {
                let form = $('#winitregist_auditForm')
                let auditRadio = form.find('[name=auditStatus]:checked')
                if (auditRadio.length === 0) {
                    layer.msg('请选择审核结果')
                    return false
                }
                let Adata = {
                    idList: idList,
                    auditStatus: auditRadio.val() === 'true',
                    remark: form.find('[name=remark]').val().trim()
                }
                if (!Adata.auditStatus && !Adata.remark) {
                    layer.msg('审核失败，必须填写审核备注')
                    return false
                }
                loading.show()

                $.ajax({
                    type: "post",
                    url: ctx + "/winitSInfo/auditByIdList.html",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        loading.hide()
                        if (res.code === '0000') {
                            layer.alert(res.msg + res.traceUUID)
                            layer.close(popIndex)
                            table.reload('winitregist_table');
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
                return false
            }
        })

    }

    // 展示日志
    function winitregist_showLogPop(prodSId) {
        layer.open({
            title: '审核商品',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['800px', '700px'],
            id: 'winitregist_addProdPop',
            btn: ['关闭'],
            content: $('#winitregist_prodLogPop').html(),
            success: function () {
                var data = {
                    prodSId: prodSId
                }
                table.render({
                    elem: '#winitregist_prodLogTable',
                    method: 'POST',
                    url: ctx + '/winitSInfo/queryLog.html',
                    where: data,
                    cols: [
                        [
                            {title: "时间", templet: "<div>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</div>", width: '150'},
                            {title: "销售渠道", field: "channel", width: '100'},
                            {title: "操作人", field: "creator", width: '100'},
                            {title: "操作详情", field: "operDesc"},
                        ]
                    ],
                    page: false,
                    height: 500,
                    id: 'winitregist_prodLogTable',
                    done: function (res) {
                    }
                })
            }
        })
    }

    // 监听表格点击事件
    table.on('tool(winitregist_table)', function(obj) {
        var data = obj.data
        if (obj.event === "release") {
            let index = layer.confirm('确认发布该商品吗',{btn: ['确认', '取消']},
                function () {
                    winitregist_releaseProd([data.id])
                    layer.close(index)
                })
        } else if (obj.event === "delete") {
            let index = layer.confirm('确认删除该商品吗',{btn: ['确认', '取消']},
                function () {
                    winitregist_deleteProd([data.id])
                    layer.close(index)
                })
        } else if (obj.event === "getLogs") {
            winitregist_showLogPop(data.prodSId)
        } else if (obj.event === "audit") {
            winitregist_auditProd([data.id])
        } else if (obj.event === "editCompAndRecommendReason") {
            winitregist_editCompAndRecommendReasonPop(data,false)
        } else if (obj.event === "editCompAndRecommendReasonForRegisterFail") {
            winitregist_editCompAndRecommendReasonPop(data,true)
        } else if (obj.event === "editSuggestSendAmt") {
            winitregist_editSuggestSendAmtPop(data)
        } else if (obj.event === "showPrePublishPrice") {
            var Adata = {
                prodSId: data.prodSId,
                cost: accAdd(data.prodSInfo.purchaseCostPrice, data.prodSInfo.innerPackCost),
                weight: accAdd(data.prodSInfo.suttleWeight, data.prodSInfo.packWeight),
            }
            tpl_listReferPrice(null,null, Adata)
        } else if (obj.event === 'effective') {
            winitregist_editEffctive([data.siteInfo.id],true)
        } else if (obj.event === 'uneffective') {
            winitregist_editEffctive([data.siteInfo.id],false)
        } else if (obj.event === 'register') {
            // if (data.siteInfo.syncProdInfo.channel === 'ebay英国' && data.siteInfo.syncProdInfo.serviceType === 1) {
            //     layer.msg('暂不可注册万邑通英国')
            //     return
            // }
            ajaxToRegisterWinit([data.siteInfo.syncProdInfo.id])
        } else if(obj.event === 'setprice'){
            commonSetPriceFn(data);
        }

    })
    $('#winitregist_initDataBtn').click(function () {
        $.ajax({
            type: "post",
            url: ctx + "/winitSInfo/initData.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (res) {

            }
        })
    })

    $('#winitregist_setUnEffectiveByListBtn').click(function () {
        let checkStatus = table.checkStatus('winitregist_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要变更有效状态的商品')
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].siteInfo.id)
        }
        winitregist_editEffctive(idList)
    })
    
    // 弹窗设置商品状态
    function winitregist_editEffctive(idList,ifEffective) {
        let popIndex = layer.open({
            title: '商品状态',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['600px', '350px'],
            btn: ['保存', '关闭'],
            content: $('#winitregist_effctivePop').html(),
            success: function () {
                initNotNull('#winitregist_effectiveForm')
                $('#winitregist_effectiveForm').find('[name=ifEffective][value='+ ifEffective +']').prop('checked',true)
                form.render('radio','winitregist_effectiveForm')
            },
            yes: function () {
                let form = $('#winitregist_effectiveForm')
                let effctiveRadio = form.find('[name=ifEffective]:checked')
                if (effctiveRadio.length === 0) {
                    layer.msg('请选择')
                    return false
                }
                let Adata = {
                    idList: idList,
                    ifEffective: effctiveRadio.val() === 'true',
                    remark: form.find('[name=remark]').val().trim()
                }
                if (!Adata.ifEffective && !Adata.remark) {
                    layer.msg('失效，必须填写失效原因')
                    return false
                }
                loading.show()

                $.ajax({
                    type: "post",
                    url: ctx + "/winitSInfo/changeIfEffective.html",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        loading.hide()
                        if (res.code === '0000') {
                            layer.msg('操作成功')
                            layer.close(popIndex)
                            table.reload('winitregist_table');
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
                return false
            }
        })
    }

    /**
     * 编辑竞品链接
     * @param data 原数据
     * @param ifCanEdit 是否能编辑
     * @param ifEditDeclareValue    是否能编辑申报价值
     */
    function winitregist_editCompAndRecommendReasonPop(data,ifEditDeclareValue) {
        let ifCanEdit
        if ($('#winitregist_updateProdPower').length) {
            ifCanEdit = true
        } else {
            ifCanEdit = false
        }
        let btn = []
        if (ifCanEdit) {
            btn = ['保存', '关闭']
        } else {
            btn = ['关闭']
        }
        let popIndex = layer.open({
            title: '竞品链接',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '80%'],
            id: 'winitregist_editCompPop',
            btn: btn,
            content: $('#winitregist_editCompLayer').html(),
            success: function () {
                initNotNull('#winitregist_editCompForm')
                if (!ifCanEdit) {
                    $('#winitregist_editCompForm').find('.winitregist_addMoreCompBtn').hide()
                }
                if (ifEditDeclareValue) {
                    $('#declareValueEditDiv').show()
                    $('#winitDescriptionDiv').show()
                    $('#winitregist_editCompForm').find('[name=importDeclareValue]').val(data.siteInfo.importDeclareValue)
                    $('#winitregist_editCompForm').find('[name=winitDescription]').val(data.siteInfo.winitDescription)
                }
                // 新增竞品
                $('.winitregist_addMoreCompBtn').click(function () {
                    winitregist_addCompList([{}],!ifCanEdit)
                })

                let Adata = {
                    prodPId: data.prodSInfo.pId
                }
                loading.show()
                $.ajax({
                    type: "post",
                    url: ctx + "/winitSInfo/getOriginCompListAndRecommendReason.html",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        loading.hide()
                        if (res.code === '0000') {
                            winitregist_addCompList(res.data.compList,!ifCanEdit)
                            $('#winitregist_editCompForm').find("[name=recommendReason]").val(res.data.recommendReason)
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }, yes: function () {
                if (!ifCanEdit) {
                    layer.close(popIndex)
                    return true
                }
                let editForm = $('#winitregist_editCompForm')
                let Adata = {
                    id: data.prodSInfo.pId,
                    recommendReason: editForm.find("[name=recommendReason]").val().trim()
                }
                if (ifEditDeclareValue) {
                    Adata.registerId = data.siteInfo.id
                    Adata.importDeclareValue = editForm.find('[name=importDeclareValue]').val().trim()
                    Adata.winitDescription = editForm.find('[name=winitDescription]').val().trim()
                    if (!isMoney(Adata.importDeclareValue)) {
                        layer.msg('申报价值必须为>0的数字')
                        return
                    }
                }
                if (!Adata.recommendReason) {
                    layer.msg('请填写推荐理由')
                    return false
                }
                let compList = winitregist_getCompData();
                if (!compList) {
                    return false
                }
                Adata.compList = compList

                $.ajax({
                    type: "post",
                    url: ctx + "/winitSInfo/updateOriginCompListAndRecommendReason.html",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        loading.hide()
                        if (res.code === '0000') {
                            layer.msg('修改成功')
                            layer.close(popIndex)
                            table.reload('winitregist_table')
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
                return false;
            }
        })
    }

    // 编辑建议发货数量
    function winitregist_editSuggestSendAmtPop(data) {
        let popIndex = layer.open({
            title: '建议发货数量',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            id: 'winitregist_editSuggestSendAmtPop',
            btn: ['保存','关闭'],
            content: $('#winitregist_editSuggestSendAmtLayer').html(),
            success: function () {
                let Adata = {
                    prodSId: data.prodSId
                }
                loading.show()
                $.ajax({
                    type: "post",
                    url: ctx + "/winitSInfo/getRegistInfoByProdSId.html",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        loading.hide()
                        if (res.code === '0000') {
                            showSuggestSendAmtTable(res.data)
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
                // 复现数据
                let editForm = $('#winitregist_editSuggestSendAmtForm')
                editForm.find('[name=ifDELetterMeasure]').prop('checked',data.ifDELetterMeasure)
                editForm.find('[name=ifUKLetterMeasure]').prop('checked',data.ifUKLetterMeasure)
                form.render('checkbox','winitregist_editSuggestSendAmtForm')
            }, yes: function () {
                let list = []
                let tabData = table.cache.winitregist_suggestSendAmtTable
                for (let i = 0; i < tabData.length; ++i) {
                    if (!tabData[i].suggestSendAmt) {
                        tabData[i].suggestSendAmt = 0
                    }
                    if ( !isInteger(tabData[i].suggestSendAmt)) {
                        layer.msg('建议发货数量必须为非负整数')
                        return
                    }
                    list.push({
                        id: tabData[i].id,
                        suggestSendAmt: tabData[i].suggestSendAmt
                    })
                }
                let editForm = $('#winitregist_editSuggestSendAmtForm')
                let Adata = {
                    id: data.id,
                    ifDELetterMeasure: editForm.find('[name=ifDELetterMeasure]').prop('checked'),
                    ifUKLetterMeasure: editForm.find('[name=ifUKLetterMeasure]').prop('checked'),
                    suggestAmtInfoList: list
                }
                $.ajax({
                    type: "post",
                    url: ctx + "/winitSInfo/updateSSiteInfo.html",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('修改成功')
                            layer.close(popIndex)
                            table.reload('winitregist_table')
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })
    }
    // 渲染建议发货数量表格
    function showSuggestSendAmtTable(data) {
        table.render({
            elem: '#winitregist_suggestSendAmtTable',
            data : data,
            cols: [
                [
                    {title: "销售渠道", field: 'channel'},
                    {title: "<div>建议发货数量(点击可编辑)</div><div><input class='layui-input' style='width: 100px;margin: 0;display: inline' type='number'><span class='canClickEl ml10' onclick='setAllSuggestSendAmtForEdit(this)'>应用</span></div>", field: "suggestSendAmt", edit:'text', style:"background-color: #7FFFD4;"}
                ]
            ],
            page: false,
            id: 'winitregist_suggestSendAmtTable',
            done: function (res) {
            }
        })
    }

    $('#winitregist_registerWinitBtn').click(function () {
        let checkStatus = table.checkStatus('winitregist_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要注册的商品')
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            // if (data[i].siteInfo.syncProdInfo.channel === 'ebay英国' && data[i].siteInfo.syncProdInfo.serviceType === 1) {
            //     layer.msg('暂不可注册万邑通英国')
            //     return
            // }
            idList.push(data[i].siteInfo.syncProdInfo.id)
        }
        ajaxToRegisterWinit(idList)
    })
    function ajaxToRegisterWinit(idList) {
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/winitSInfo/registerWinitInfo.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(idList),
            success: function (res) {
                loading.hide()
                if (res.code === '0000') {
                    layer.msg('发起注册成功，请等待服务商审核结果')
                    table.reload('winitregist_table')
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    $('#winitregist_syncRegisterResultBtn').click(function () {
        let checkStatus = table.checkStatus('winitregist_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要同步的商品')
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].siteInfo.syncProdInfo.id)
        }
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/winitSInfo/syncWinitRegistResult.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(idList),
            success: function (res) {
                loading.hide()
                if (res.code === '0000') {
                    layer.msg('同步成功')
                    table.reload('winitregist_table')
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    })

    setAllSuggestSendAmtForEdit = function (self) {
        let value = $(self).prev().val()
        let tableData = layui.table.cache.winitregist_suggestSendAmtTable
        for (let i = 0; i < tableData.length; ++i) {
            tableData[i].suggestSendAmt = value
        }
        showSuggestSendAmtTable(tableData)
    }

    $('#winitregist_syncWinitProdInfoBtn').click(function () {
        let checkStatus = table.checkStatus('winitregist_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要同步的商品')
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].siteInfo.syncProdInfo.id)
        }
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/winitSInfo/syncWinitProdInfo.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(idList),
            success: function (res) {
                loading.hide()
                if (res.code === '0000') {
                    layer.msg('同步成功')
                    table.reload('winitregist_table')
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    })

    // 导入新增
    $('#winitregist_addProdByExcelBtn').click(function () {
        $('#winitregist_addProdExcel').click()
    })
    $('#winitregist_addProdExcel').on('change', function() {
        var files = $('#winitregist_addProdExcel')[0].files
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != '.xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        layer.confirm('确认导入这个文件进行新增海外仓商品吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/winitSInfo/addByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    dataType: 'json',
                    success: function(res) {
                        loading.hide()
                        $('#winitregist_addProdExcel').val('')
                        if (res.code === '0000') {
                            layer.msg("导入新增成功");
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#winitregist_addProdExcel').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })
});

function removeCurrentTr(self) {
    $(self).closest('tr').remove()
}

function clickToPreInpUrl(self) {
    let url = $(self).closest('tr').find('[name=url]').val().trim();
    if (url) {
        if (url.indexOf('https://') != 0) {
            window.open('https://' + url, '_blank').location
        } else {
            window.open(url, '_blank').location
        }
    }
}

function setAllSuggestSendAmt(self,channel) {
    let value = $(self).prev().val()
    $(self).closest('.layui-table-box').find('[name=suggestSendAmt][data-channel='+ channel +']').val(value)
}


