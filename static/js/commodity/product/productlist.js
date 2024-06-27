/**
 * time: 2018/01/02
 */
var active_productlist, leavedUser_productlist = [],
    leavedUserStr_productlist = ''
var wangEditor_productlist
var productlist_calSupplierQuote
let ifMulSpec = false
let subChooseInfo = []
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'laydate', 'element', 'upload', 'formSelects'], function() {
    var layer = layui.layer,
        admin = layui.admin,
        table = layui.table,
        form = layui.form,
        element = layui.element,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        $ = layui.$,
        laydate = layui.laydate
    formSelects.render('logisAttr_productlist')
    formSelects.render('devType_productlist')
    formSelects.render('productlist_prodAttrList')
    element.render('collapse')

    // 初始化 开发专员查询项为 当前登录人
    initPersonCondition(['开发专员'],['开发组长', '开发主管'],$('#opl_searchForm [name=userId]'), 'id')
    //远程搜索功能
    var dim = new DimSearch('#pl_searchSupplier', 'supplierId')
    dim.init()
        //时间渲染
    laydate.render({
        elem: '#productlistTime',
        range: true
    })

    //查找货源
    $('#productlistCard').on('click', '.searchSupply', function(){
      let $img = $(this).parent('div').parent('div').find('img');
      let imgSrc = $img.attr('src');
      commonSearchGoodsComponents(imgSrc.split("!size=")[0]);
    });

    form.render('select')
    form.render('checkbox')
    $('#cluster').select2()
    $('#test2').select2()
    var updateParentSkuLayerIndex = ''
    // 初始化 组织-人员选择框
    render_hp_orgs_users('#opl_searchForm')
    // 初始化  选择条件form 种的 自定义选择输入框
    initHpSelect('#opl_searchForm')
        // 初始化跳转参数
    initSearchParam('#opl_searchForm')

    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_productlist').click(function() {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContain').hide()
            $('#show_icon_processlist').show()
            $('#hide_icon_processlist').hide()
            $(self).removeClass('showExternal')
        } else {
            $(self).closest('.layui-form').find('.externalContain').show()
            $('#show_icon_processlist').hide()
            $('#hide_icon_processlist').show()
            $(self).addClass('showExternal')
        }
    })

    // 查询离职人员
    function getLeavedUser() {
        $.ajax({
            type: 'post',
            url: ctx + '/sysuser/getLeavedUser.html',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function(res) {
                if (res.code == '0000') {
                    leavedUser_productlist = res.data
                    var leavedUserName = []
                    for (var i = 0; i < leavedUser_productlist.length; ++i) {
                        leavedUserName.push(leavedUser_productlist[i].userName)
                    }
                    leavedUserStr_productlist = '||' + leavedUserName.join('||') + '||'
                } else {
                    layer.msg('初始化离职人员失败e=' + res.msg)
                }
            }
        })
    }

    // 初始化离职人员
    getLeavedUser()

    form.on('select(downTempBtn_productlist)', function(data) {
        var optionNum = data.value
        var Adata = {}
        if (1 == optionNum) {
            window.location.href = ctx + '/static/templet/updateProductListTemplate.xlsx'
        } else if (2 == optionNum) {
            window.location.href = ctx + '/static/templet/addProdSInfoTemplate.xlsx'
        } else if (3 == optionNum) {
            window.location.href = ctx + '/static/templet/updateProductCKGTemplate.xlsx'
        } else if (4 == optionNum) {
            window.location.href = ctx + '/static/templet/updateSupplierTemplate.xlsx'
        }
    })

    // 监听input输入
    $('#opl_searchForm [name=searchValue]').bind('input propertychange', function() {
        var inputLen = $('[name=searchValue]').val()
        if(inputLen.includes(',')){
            $('#opl_searchForm [name=switchSearchValue]').prop('checked',true)
        }
        // else{
        //     $('#opl_searchForm [name=switchSearchValue]').removeAttr('checked')
        // }
        form.render('checkbox')
    })

    // 表格渲染
    function search_productlist(data) {
        // 型号，规格
        if(data.searchValue1 != ''){
            data[data.searchType1] = data.searchValue1
        }
        // sku 精确:true|模糊:false
        let type = $('#opl_searchForm [name=switchSearchValue]').prop('checked')
        if(data.searchValue != '' && type == true){
            data.searchType = data.searchType + '2'
        }
        if(data.searchValue.includes(',') && type == false){
            return layer.msg('多个SKU仅支持精确查询',{icon:7})
        }
        if(data.searchValue.split(",").length > 10000){
            return layer.msg('SKU最多支持10000个',{icon:7})
        }
        table.render({
            elem: '#sProdTable',
            method: 'post',
            url: ctx + '/product/getProds.html',
            where: data,
            cols: [
                [
                    { type: 'checkbox', width: 30 },
                    { field: 'id', templet: '#pl_imageTpl', title: '图片', width: 70 },
                    { field: 'pl_sSku', title: '商品sku', templet: '#pl_sSku' },
                    { field: 'pl_isSale', templet: '#pl_isSale', title: '在售', width: 36 },
                    { field: 'parentBizzOwner', title: '责任人', templet: '#pl_owner', width: 90 },
                    { field: 'pl_title', title: '商品名称', templet: '#pl_title' },
                    { title: '外箱长宽高(cm)', templet: '#pl_WHL', width: 85 },
                    { title: '重量(g)', templet: '#pl_weight', width: 100 },
                    { field: 'purchaseCostPrice', title: '成本(¥)', width: 85, templet: '#pl_totalCost' },
                    { title: '规格', templet: '#pl_specifications', width: 140 },
                    { title: '库存', templet: '#pl_stock', width: 100 },
                    // { title: '<div>昆山仓</div><div>可用/在途/未派</div> ', templet: '#pl_stock_ks', width: 100 },
                    { title: '<div title="该参数，仅用于初始化，以及在商品为定制产品时生效。如非定制产品，请查看库存预警中的采购参数">采购参数<i class="layui-icon layui-icon-about"></i></div>', templet: '#pl_pruchase_param', width: 120 },
                    { title: '销量 7/15/30', templet: '#pl_sales_num', width: 140 },
                    { title: '供应商', templet: '#pl_purchase_url' },
                    { title: '时间', templet: '#pl_timeTpl' }
                ],
            ],
            id: 'sProdTable',
            page: true,
            limits: [50, 200, 500],
            limit: 50,
            done: function(res, curr, count) {
                $('#sSkuNum').html(count)
                    //懒加载
                imageLazyload()
            }
        })
    }

    active_productlist = {
        //搜索
        reload: function(data) {
            if (!data) {
                data = getSerachData_productlist()
            }
            table.reload('sProdTable', {
                page: { curr: 1 },
                where: data,
            })
        }
    }

    $('#pl_searchBtn').click(function() {
        var data = getSerachData_productlist()
        search_productlist(data)
    })

    function getSerachData_productlist() {
        let formElem = $('#opl_searchForm')
        var searchParam = serializeObject(formElem)
        if (searchParam.organize || searchParam.userId) {
            if (searchParam.userId) { // 如果选了人，则只查询这个人的。
                searchParam[searchParam.userType + 'Str'] = searchParam.userId
            } else { // 如果选了部门没选人，则查询整个部门的
                let userIdList = []
                let elem = formElem.find('[name=userId]')
                if (elem.hasClass('xm-hide-input')) {
                    elem = elem.closest('.xm-select-parent').prev('select[xm-select]')
                    userIdList = elem.attr('user_ids').split(',')
                } else {
                    let options = elem.find('option')
                    let value
                    for (let i = 0; i < options.length; ++i) {
                        value = options[i].getAttribute('value')
                        if (value) {
                            userIdList.push(parseInt(value))
                        }
                    }
                }

                searchParam[searchParam.userType + 'Str'] = userIdList.join(',')
            }
        }
        if (searchParam.prodAttrList) {
            searchParam.prodAttrList = searchParam.prodAttrList.split(',')
        }
        console.log(searchParam)
        return searchParam
    }

    $('#downTemplate_updatebyExcel_productlist').click(function() {
        window.location.href = ctx + '/static/templet/updateProductListTemplate.xlsx'
    })

     //oa新类目点击展开
     $('#plat_choose_outside_prodlist').click(function() {
        cateLayerOpen('oa','layer_work_prodlist_pl','prodOnline_pl_search_cate', '#itemCat_input_prodlist')
    })
    $('#prod_clearPlat_outside_prodlist').click(function() {
        $('#plat_chooseid_inp_outside_prodlist').val('')
        $('#prodOnline_pl_search_cate').text('')
    })


    // 通过导入excel 修改商品
    $('#sInfoExcel_productlist').on('change', function() {
        var files = $('#sInfoExcel_productlist')[0].files
            // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf('.')
        var extension = fileName.substring(seat).toLowerCase()
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData()
        formData.append('file', files[0])
        layer.confirm('确认导入这个文件进行批量修改商品信息吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/product/updateByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                        $('#sInfoExcel_productlist').val('')
                        if (data.code == '0000') {
                            // 清空 excel
                            var processData = data.data

                            function succReback(data) {
                                layer.close(updateParentSkuLayerIndex)
                                layer.msg('处理完毕')
                            }

                            if (processData.id) {
                                processBegin(ctx + '/msgProcess/queryProcess', JSON.stringify(processData), '正在处理数据', 5000, succReback)
                            }
                            layer.msg('上传成功')
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#sInfoExcel_productlist').val('')
                    }
                })
            },
            function() {
                layer.closeAll()
            }
        )
    })

    // 通过导入excel 修改商品的长宽高
    $('#sInfoExcelForCKG_productlist').on('change', function() {
        var files = $('#sInfoExcelForCKG_productlist')[0].files
            // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf('.')
        var extension = fileName.substring(seat).toLowerCase()
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData()
        formData.append('file', files[0])
        layer.confirm('确认导入这个文件进行批量修改商品信息吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/product/updateCKGByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                        $('#sInfoExcelForCKG_productlist').val('')
                        if (data.code == '0000') {
                            // 清空 excel
                            var processData = {
                                processId: data.data.processId,
                                total: data.data.total,
                                redisKeyCode: data.data.redisKeyCode
                            }

                            function succReback(data) {
                                layer.close(updateParentSkuLayerIndex)
                                layer.msg('处理完毕')
                            }

                            if (processData.processId) {
                                processBegin(ctx + '/product/queryProcess.html', JSON.stringify(processData), '正在处理数据', 5000, succReback)
                            }
                            layer.msg('上传成功')
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#sInfoExcelForCKG_productlist').val('')
                    }
                })
            },
            function() {
                layer.closeAll()
            }
        )
    })

    // 通过导入excel 修改商品的供应商信息
    $('#updateSupplierByExcel_productlist').on('change', function() {
        var files = $('#updateSupplierByExcel_productlist')[0].files
            // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf('.')
        var extension = fileName.substring(seat).toLowerCase()
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData()
        formData.append('file', files[0])
        layer.confirm('确认导入这个文件进行批量修改商品的供应商信息吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/product/updateSupplierByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                        $('#updateSupplierByExcel_productlist').val('')
                        if (data.code == '0000') {
                            layer.msg('修改成功')
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#updateSupplierByExcel_productlist').val('')
                    }
                })
            },
            function() {
                layer.closeAll()
            }
        )
    })


    // 通过导入excel 新增商品
    $('#sInfoExcel_add_productlist').on('change', function() {
        var files = $('#sInfoExcel_add_productlist')[0].files
            // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf('.')
        var extension = fileName.substring(seat).toLowerCase()
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData()
        formData.append('file', files[0])
        layer.confirm('确认导入这个文件进行批量新增子商品吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/product/addByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                            // 清空 excel
                        $('#sInfoExcel_add_productlist').val('')
                        if (data.code == '0000') {
                            layer.msg('新增成功')
                        } else {
                            layer.alert(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#sInfoExcel_add_productlist').val('')
                    }
                })
            },
            function() {
                layer.closeAll()
            }
        )
    })

    $('#pl_searchReset').click(function() {
        $('#opl_searchForm')[0].reset()
        $('#opl_searchForm input[type=\'hidden\']').val('')
        $('#prodOnline_pl_search_cate').html('')
        $('#prod_clearPlat_outside_prodlist').click()
    })

    form.on('select(packspectag)', function(data) {
        getTotalWeight('#packspectag option:selected', '#addSSkuForm', '#totalWeight')
    })
    form.on('select(packspectag_comb)', function(data) {
        getTotalWeight('#packspectag_comb option:selected', '#addCombForm', '#totalWeight_comb')
    })

    // 初始化图片上传
    function initUploadImg() {
        new UploadImage('image_edit0', ctx + '/product/getProdBase64Img.html').upload(function(xhr) { //上传完成后的回调
            succUploadImg(this, xhr)
        })
    }

    function succUploadImg(self, xhr) {
        let img = new Image('150', '150')
        let returnData = JSON.parse(xhr.responseText)

        if (xhr.responseText === '') {
            layer.msg('上传出错!')
        } else if (returnData !== undefined && returnData.code === '9999') {
            layer.msg('上传出错!' + xhr.responseText)
        } else {
            img.src = returnData.data + '!size=150x150'
            img.className = 'imgCss img_show_hide'
            $('#preProdEditFrom input[name=\'image\']').val(returnData.data)
            $(self).empty().html(img)
        }
    }

    // 图片删除功能
    $('body').on('keyup', '.productlist_imageEditDiv', function(e) {
        var e = e ? e : event
        var k = e.keyCode || e.which
        if (k == 8) {
            this.innerHTML = ''
        }
    })

    // 新增商品弹出框
    $('#productlist_addProduct').click(function() {
        var checkStatus = table.checkStatus('sProdTable'),
            data = checkStatus.data
        if (data.length > 1) {
            layer.msg('复制新增只能勾选1个sku哦')
            return
        }
        if (data[0] && data[0].isCombination == 1) {
            layer.msg('请选择1个非组合品')
            return
        }
        var ifFresh = false
        layer.open({
            title: '新增商品',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['97%', '80%'],
            id: 'addProductId',
            btn: ['保存', '清空', '关闭'],
            content: $('#productlist_addProductLayer').html(),
            yes: function(index, layero) {
                // 检查必填项
                if (!checkNotNull('#addSSkuForm', layer)) {
                    return false
                }
                submitSSku(false)
                ifFresh = true

            },
            btn2: function() {
                var index = layer.confirm('您确认要清空表单？', { icon: 3, title: '提示' }, function() {
                    $('#addSSkuForm')[0].reset()
                    layer.close(index)
                })
                return false
            },
            end: function() {
                if (ifFresh) {
                    refreshTable()
                }
                $(document).off('keydown', this.enterEsc);
            },
            cancel: function() {
                if (ifFresh) {
                    refreshTable()
                }
            },
            success: function(layero, index) {
                // 初始化图片上传
                initUploadImg()

                $('#productlist_sSkuInput').on('blur', function() {
                        getDefAmazonWarehouse($(this).val())
                        return false
                    })
                    // 检查是否有新增供应商权限
                if ($('#ifAddSupplier_produclist').length > 0) {
                    $('.addsupplierBtn_productlist').removeClass('disN')
                }

                // 监听input输入
                $('#productlist_sSkuInput').bind('input propertychange', function() {
                    var inputLen = $('#productlist_sSkuInput').val().length
                    $('#productlist_inputCount').text(inputLen)
                })

                // 初始化必填项
                initNotNull()

                // 初始化自定义选择框
                initHpSelect('#addSSkuForm')

                // 初始化父sku 相关事件
                initPSkuEvent('#addSSkuForm')
                    //8.新增供应商
                newAddSupplier()
                    //9.供应商信息表
                supplierInfoTble()
                    // 弹框底边栏样式
                form.render()

                $('.isCreateHidden').hide()
                $('.showOnlyDetailPop').hide()
                if (data.length == 1) {
                    var sku = data[0].sSku
                    getSubDetail(sku, true, true)
                } else {
                    // 初始化新增一行供应商
                    addsupplierTbody(null, false, true)
                }
                layero.on('click', '.searchSupply', function(){
                    let $img = $(this).parents('.layui-col-lg6').find('.productlist_imageEditDiv>img');
                    if($img.length > 0){
                        let imgSrc = $img.attr('src');
                        commonSearchGoodsComponents(imgSrc.split("!size=")[0]);
                    }else{
                        layer.msg('请先黏贴图片', {icon: 7});
                    }
                });
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        return false; //阻止系统默认回车事件
                    }
                  };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            }
        })
    })

    $('#productlist_updateProdPInfoListBtn').click(function() {
            let popIndex = layer.open({
                title: '批量修改父商品',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['80%', '80%'],
                id: 'productlist_updateProdPInfoListLayer',
                btn: ['保存', '关闭'],
                content: $('#productlist_updateProdPInfoListPop').html(),
                success: function(index, layero) {
                    initNotNull('#productlist_updateProdPInfoListForm')
                    form.render('select', 'productlist_updateProdPInfoListForm')
                    form.render('radio', 'productlist_updateProdPInfoListForm')

                    this.enterEsc = function(event) {
                        if (event.keyCode === 13) {
                            return false; //阻止系统默认回车事件
                        }
                    };
                    $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
                },
                yes: function() {
                    let Adata = serializeObject($('#productlist_updateProdPInfoListForm'))
                    if (!Adata.pSkuListStr) {
                        layer.msg('请填写需要修改的父sku')
                        return
                    }
                    if (!Adata.prodAttr) {
                        layer.msg('请选择商品标签')
                        return
                    }
                    let ajax = new Ajax(false)
                    ajax.post({
                        url: ctx + '/product/updateProdPInfoForList.html',
                        data: JSON.stringify(Adata),
                        success: function(res) {
                            if (res.code === '0000') {
                                layer.msg('修改成功')
                                layer.close(popIndex)
                                refreshTable()
                            } else {
                                layer.alert(res.msg)
                            }
                        },error: function (res, textStatus, errorThrown) {
                            if (textStatus === 'timeout') {
                                layer.alert('传入的pSku较多，后台仍正在处理，请不要重复提交');
                            }
                        }
                    })

                },
                end: function() {
                    $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
                }
            })
        })
        // 批量修改
    $('#productlist_updateList').click(function() {
        var checkStatus = table.checkStatus('sProdTable'),
            data = checkStatus.data
        if (data.length == 0) {
            layer.msg('请至少选择1个商品')
            return
        }
        let pSku = data.map(item => item.pSku)
        pSku = Array.from(new Set(pSku))
        if (pSku?.length > 1) {
        layer.msg('请选择相同父sku的数据进行修改')
        return
        }
        // 检查是否组合品
        for (var i = 0; i < data.length; ++i) {
            if (data[i].isCombination == 1) {
                layer.msg('不可批量修改组合品')
                return
            }
        }
        layer.open({
            title: '批量修改',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['100%', '80%'],
            id: 'updateListPop',
            btn: ['保存', '关闭'],
            content: $('#updateList_productlist').html(),
            success: function() {
                // 检查是否有新增供应商权限
                if ($('#ifAddSupplier_produclist').length > 0) {
                    $('.addsupplierBtn_productlist').removeClass('disN')
                }
                // 初始化自定义选择框
                initHpSelect('#updateListForm_productlist')
                    //8.新增供应商
                newAddSupplier()
                    //9.供应商信息表
                supplierInfoTble(true)
                    // 初始化1个供应商
                form.render('select')
                form.render('checkbox')
                    // 包装规格选择事件
                form.on('select(packspectag_updatelist)', function(data) {
                    $('#updateListForm_productlist [name=packWeight]').val($('#updateListForm_productlist [name=packSpecification] option:selected').attr('weight'))
                })
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        return false; //阻止系统默认回车事件
                    }
                  };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            yes: function(index, layero) {
                layer.confirm('确认对选中的  ' + data.length + '  条数据进行修改？', { icon: 3, title: '提示' }, function(confirmIndex) {
                    // 获取数据
                    let Adata = serializeObject($('#updateListForm_productlist'))
                    if (Adata.packDesc.indexOf('(') > -1 || Adata.packDesc.indexOf(')') > -1 || Adata.packDesc.indexOf('（') > -1 || Adata.packDesc.indexOf('）') > -1) {
                        layer.msg('入库要求中不能包含字符"(" 和 ")" ')
                        return false
                    }

                    checkNull(Adata)
                    let keyCount = 0 // 被修改的字段数量
                    for (let key in Adata) {
                        if (key === 'defaultSupplierNote' || key === 'purBaseNum'
                            || key === 'prodPriceOfDefaultOnline'|| key === 'ifSupplierPackOfDefaultOnline'
                            || key === 'packFeeOfDefaultOnline'
                            || key === 'stockPackFeeOfDefaultOnline' || key === 'purchaseUrl1'
                            || key === 'purchaseUrl2' || key === 'purchaseUrl3') {
                            continue
                        }
                        keyCount++
                    }
                    // 如果供应商，提供包装，则必须填写供应商包装费。仓库包装费需清空
                    if (Adata.ifSupplierPackOfDefaultOnline === 'true' && !Adata.packFeeOfDefaultOnline) {
                        layer.msg('供应商提供包装，请填写供应商包装费')
                        return false
                    }
                    let dataForm = $('#updateListForm_productlist')
                    if (dataForm.find('[name=isSale]').val() === 'true') {
                        Adata.isSale = true
                    } else if (dataForm.find('[name=isSale]').val() === 'false') {
                        Adata.isSale = false
                        if (!dataForm.find('[name=notSaleReason]').val()) {
                            layer.msg('请选择停售原因')
                            return
                        }
                    } else {
                        Adata.isSale = null
                    }
                    if (dataForm.find('[name=isOutOfStock]').val() === 'true') {
                        Adata.isOutOfStock = true
                    } else if (dataForm.find('[name=isOutOfStock]').val() === 'false') {
                        Adata.isOutOfStock = false
                    } else {
                        Adata.isOutOfStock = null
                    }
                    if (Adata.isSpecialMake) {
                        Adata.isSpecialMake = Adata.isSpecialMake === '1'
                    } else {
                        delete Adata.isSpecialMake
                    }
                    // 物流属性
                    var noLogisAttr = $('#ifNullLogisAttrList_productlist').prop('checked')
                    if (noLogisAttr) {
                        Adata.logisAttrList = ''
                        keyCount++
                    } else {
                        var logisAttrList = []
                        $('#logisAttr').find('input[name=\'logisAttrList\']:checked').each(function() {
                            logisAttrList.push(this.value)
                        })
                        var logisAttr = logisAttrList.join(',')
                        if (logisAttr) {
                            Adata.logisAttrList = logisAttr
                        }
                    }
                    if (keyCount === 0) {
                        Adata.ifUpdateBaseInfo = false
                    } else {
                        Adata.ifUpdateBaseInfo = true
                    }
                    Adata.removeOldSupplier = dataForm.find('[name=removeOldSupplier]').prop('checked')
                    console.log(Adata.removeOldSupplier )
                    let idList = []
                    for (let i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                    }
                    Adata.idList = idList


                    let supplier = []
                    let supplierTrs = $('.supplierRefTab_productlist tbody').find('tr')
                    for (let i = 0; i < supplierTrs.length; ++i) {
                        let supplierRef = {}
                        let tdArr = $(supplierTrs[i]).children()
                        supplierRef.supplierName = $(supplierTrs[i]).find('[supplierName]').val().trim() //供应商名称
                        supplierRef.purchaseUrl = $(supplierTrs[i]).find('[purchaseUrl]').val().trim() //采购URL
                        supplierRef.minOrderNum = $(supplierTrs[i]).find('[minOrderNum]').val().trim() //最小订货量
                        supplierRef.quote = $(supplierTrs[i]).find('[quote]').val().trim() //供应商报价
                        supplierRef.articleNo = $(supplierTrs[i]).find('[articleNo]').val().trim() //供应商报价
                        supplierRef.prodPrice = $(supplierTrs[i]).find('[prodPrice]').val().trim() //供应商商品报价
                        supplierRef.stockPackFee = $(supplierTrs[i]).find('[stockPackFee]').val().trim() //仓库包装费
                        supplierRef.purBaseNum = $(supplierTrs[i]).find('[purBaseNum]').val().trim() //采购基数
                        supplierRef.note = $(supplierTrs[i]).find('[note]').val().trim() //说明
                        supplierRef.supplierId = $(supplierTrs[i]).find('[supplierId]').val() //id
                        supplierRef.ifDefault = $(supplierTrs[i]).find('[ifDefault]').prop('checked') // 是否默认
                        supplierRef.ifSupplierPack = $(supplierTrs[i]).find('[ifSupplierPack]').prop('checked') //是否供应商包装
                        supplierRef.supplierPackFee = $(supplierTrs[i]).find('[supplierPackFee]').val().trim() //供应商包装费用
                            // 解析出offerId
                        if (!supplierRef.offerId && supplierRef.purchaseUrl.indexOf("/offer/") > 0) {
                            supplierRef.offerId = (supplierRef.purchaseUrl.substring(supplierRef.purchaseUrl.indexOf("/offer/") + 7, supplierRef.purchaseUrl.indexOf(".html")));
                            supplierRef.specId = null
                        }
                        if (!supplierRef.supplierName) {
                            layer.msg('请填写供应商名称')
                            return false
                        }
                        if (!supplierRef.purchaseUrl) {
                            layer.msg('请填写采购链接')
                            return false
                        }
                        if (!supplierRef.prodPrice || isNaN(supplierRef.prodPrice)) {
                            layer.msg('请填写正确的供应商商品报价')
                            return false
                        }
                        if (supplierRef.ifSupplierPack && !supplierRef.supplierPackFee) {
                            layer.msg('供应商提供包装，请填写供应商包装费用')
                            return false
                        }
                        if (supplierRef.supplierPackFee && isNaN(supplierRef.supplierPackFee)) {
                            layer.msg('请填写正确的供应商包装费用')
                            return false
                        }
                        if (!supplierRef.purBaseNum || isNaN(supplierRef.purBaseNum) || supplierRef.purBaseNum <= 0) {
                            layer.msg('采购基数必填且为正数')
                            return false
                        }
                        supplier.push(supplierRef)
                    }
                    if (supplier.length > 0) {
                        Adata.supplier = supplier
                        Adata.ifUpdateBaseInfo = true
                    } else if (!Adata.ifUpdateBaseInfo && !Adata.defaultSupplierNote
                        && !Adata.purBaseNum && !Adata.prodPriceOfDefaultOnline
                        && !Adata.packFeeOfDefaultOnline && !Adata.stockPackFeeOfDefaultOnline && !Adata.ifSupplierPackOfDefaultOnline
                        && !Adata.purchaseUrl1 && !Adata.purchaseUrl2 && !Adata.purchaseUrl3) {
                        layer.msg('未做任何修改')
                        return
                    }
                    let isEmpty = false
                    if(isEmpty) return false
                    if (Adata.liquidNetContentMl !== '' && Adata.liquidNetContentMl !==  undefined) {
                        let prodSInfoExtends = {
                            liquidNetContentMl: Adata.liquidNetContentMl
                        }
                        Adata.prodSInfoExtends = prodSInfoExtends
                        delete Adata.liquidNetContentMl
                    }
                    loading.show()
                        // 传入被修改的条数，以作为验证
                    Adata.idLength = data.length
                    $.ajax({
                        type: 'post',
                        url: ctx + '/product/updateSSkuByList',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        data: JSON.stringify(Adata),
                        success: function(returnData) {
                            loading.hide()
                            if (returnData.code === '0000') {
                                layer.msg('修改成功')
                                layer.close(confirmIndex);
                                layer.close(index);
                            } else {
                                layer.msg(returnData.msg)
                            }
                        },
                        error: function() {
                            loading.hide()
                            layer.msg('发送请求失败')
                        }
                    })
                })

            },
            end: function() {
                $(document).off('keydown', this.enterEsc);
            }
        })
    })

    // 批量审核
    $('#productlist_auditListBtn').click(function() {
            var checkStatus = table.checkStatus('sProdTable'),
                data = checkStatus.data
            if (data.length == 0) {
                layer.msg('请至少选择1个商品')
                return
            }
            // 检查是否组合品、是否同一父sku
            var pid
            for (var i = 0; i < data.length; ++i) {
                // if (data[i].isCombination == 1) {
                //     layer.msg('不可审核组合品')
                //     return
                // }
                if (!pid) {
                    pid = data[i].pId
                } else {
                    if (pid != data[i].pId) {
                        layer.msg('只能批量审核同一父sku的子sku')
                        return
                    }
                }
            }
            var index = layer.open({
                title: '批量审核',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['600px', '300px'],
                id: 'auditListPop',
                btn: ['审核', '关闭'],
                content: $('#productlist_auditListPop').html(),
                success: function() {
                    initNotNull('#auditListForm_productlist')
                    form.render('select', 'auditListForm_productlist')
                    this.enterEsc = function(event) {
                        if (event.keyCode === 13) {
                            return false; //阻止系统默认回车事件
                        }
                      };
                    $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
                },
                yes: function() {
                    var Adata = {
                        auditStatus: $('#auditListForm_productlist [name=auditStatus]').val(),
                        auditDesc: $('#auditListForm_productlist [name=auditDesc]').val()
                    }
                    var idList = []
                    for (var i in data) {
                        idList.push(data[i].id)
                    }
                    Adata.idList = idList
                    if (!checkNotNull('#auditListForm_productlist')) {
                        return
                    }
                    loading.show()
                    $.ajax({
                        type: 'post',
                        url: ctx + '/product/auditSSkuByList.html',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        data: JSON.stringify(Adata),
                        success: function(returnData) {
                            loading.hide()
                            if (returnData.code == '0000') {
                                layer.msg('审核成功')
                                layer.close(index)
                                refreshTable()
                            } else {
                                layer.msg(returnData.msg)
                            }
                        },
                        error: function() {
                            loading.hide()
                        }
                    })
                },
                end: function() {
                    $(document).off('keydown', this.enterEsc);
                }
            })
        })
        // 导出
    $('#exportSSku_productlist').click(function() {
        var outerIndex = layer.open({
            title: '导出详情',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1266px', '600px'],
            id: 'exportSSkuPop',
            btn: ['确定', '关闭'],
            content: $('#productlist_exportSSkuPop').html(),
            success: function() {
                form.on('checkbox(selectAll_exportySSku_productlist)', function(data) {
                    var checked = data.elem.checked
                    $('#exportSSkuForm_productlist input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var data = serializeObject($('#exportSSkuForm_productlist'))
                var searchParam = getSerachData_productlist()
                if (searchParam.isSale != null) {
                    searchParam.isSale = parseInt(searchParam.isSale)
                }
                if (searchParam.logisAttr) {
                    searchParam.logisAttr = searchParam.logisAttr.split(',')
                }
                checkNull(searchParam)
                    // 获取被选中的sku
                var checkStatus = table.checkStatus('sProdTable'),
                    selectedDtoList = checkStatus.data
                var idList = []
                if (selectedDtoList.length > 0) {
                    for (var i = 0; i < selectedDtoList.length; ++i) {
                        idList.push(selectedDtoList[i].id)
                    }
                    searchParam.idList = idList
                }

                data.searchParam = JSON.stringify(searchParam)

                var tip
                if (idList.length > 0) {
                    tip = '确认导出选择的' + idList.length + '个商品的信息吗?'
                } else {
                    tip = '确认导出当前搜索条件下的商品信息?'
                }
                var Confirmindex = layer.confirm(tip, { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/product/exportSSkuList.html', '_blank')
                    layer.close(outerIndex)
                })
            }
        })
    })

    // 提交组合品
    function submitComb() {
        var data = serializeObject($('#addCombForm'))
        if (!validateSKU(data.sSku)) {
            layer.msg('商品sku仅能包含大写字母和数字以及"-"划线')
            return false
        }
        if (data.packDesc.indexOf('(') > -1 || data.packDesc.indexOf(')') > -1 || data.packDesc.indexOf('（') > -1 || data.packDesc.indexOf('）') > -1) {
            layer.msg('入库要求中不能包含字符"(" 和 ")" ')
            return false
        }
        data.defaultDlvrWh = $('#wareHouseTag_comb').next('.layui-unselect.layui-form-select').find('dd.layui-this').text()
        var logisAttrList = []
        $('#logisAttr_comb').find('input[name=\'logisAttrList\']:checked').each(function() {
            logisAttrList.push(this.value)
        })
        var logisAttr = logisAttrList.join(',')
        var combSubProds = []
        var combTrs = $('#groupTable tbody tr')
        if (!combTrs) {
            layer.msg('请填写组合明细')
            return false
        }
        var combRef, tdArr
        for (var i = 0; i < combTrs.length; ++i) {
            combRef = new Object()
            tdArr = $(combTrs[i]).find('td')
            combRef.id = tdArr.eq(2).find('input[type="hidden"]').val() //id
            combRef.sSku = tdArr.eq(0).find('input:visible').val().trim() //基础商品sku
            combRef.prodId = data.id // 组合子sku
            combRef.prodDetailId = tdArr.eq(0).find('input[type="hidden"]').val() //基础商品id
            combRef.prodDetailNums = tdArr.eq(1).find('input').val() //基础商品数量
            combRef.isSale = JSON.parse(tdArr.eq(0).find('input[type="hidden"]').attr('isSale')) //基础商品是否在售
            combRef.isOutOfStock = JSON.parse(tdArr.eq(0).find('input[type="hidden"]').attr('isOutOfStock')) //基础商品是否缺货
            combRef.stock = tdArr.eq(0).find('input[type="hidden"]').attr('stock') //基础商品库存
            combRef.occupyStock = tdArr.eq(0).find('input[type="hidden"]').attr('occupyStock') //基础商品占用库存
            combRef.availableStock = tdArr.eq(0).find('input[type="hidden"]').attr('availableStock') //基础商品可用库存

            if (!combRef.sSku.trim() || !combRef.prodDetailNums) {
                layer.msg('请填写完整组合明细')
                return false
            }
            if (combRef.prodDetailNums <= 0) {
                layer.msg(combRef.sSku + '的数量请填写正整数')
            }
            if (combRef.prodDetailId) {
                combSubProds.push(combRef)
            } else {
                layer.msg('组合明细中sku:' + combRef.sSku + '不存在或未通过审核')
                return false
            }
        }
        data.combSubProds = combSubProds
        data.logisAttrList = logisAttr
        data.isSale = !$('#addCombForm [name=\'isSale\']').prop('checked')
        data.isOutOfStock = $('#addCombForm [name=\'isOutOfStock\']').prop('checked')
        if (data.sSku.indexOf('+') >= 0) {
            layer.msg('商品sku中不允许含有+')
            return false
        }

        let isEmpty = false
        if (data.logisAttrList?.indexOf('液体(0-15ml)') > -1 || data.logisAttrList?.indexOf('液体(>15ml)') > -1) {
            if (data.liquidNetContentMl === '' || data.liquidNetContentMl === undefined) {
                isEmpty = true
                layer.msg('请填写液体净含量(ml)')
                return false
            }
            if (!/^[1-9]\d*$/.test(data.liquidNetContentMl)) {
                isEmpty = true
                layer.msg('液体净含量(ml)必须是大于0的整数')
                return false
            }
        }
        if (isEmpty) return
        data.innerPackCost = data.innerPackCost ? data.innerPackCost : 0
        data.packDifficulty = data.packDifficulty ? data.packDifficulty : 0
        loading.show()
        $.ajax({
            type: 'post',
            url: ctx + '/product/addOrUpdateComb.html',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(data),
            success: function(returnData) {
                loading.hide()
                if (returnData.code == '0000') {
                    layer.closeAll()
                    refreshTable()
                    if (data.id) {
                        layer.msg('修改成功')
                    } else {
                        layer.msg('新增成功')
                    }
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('发送请求失败')
            }
        })
        return false
    }

    table.on('tool(sProdTable)', function(obj) {
        var layEvent = obj.event //获得 lay-event 对应的值
        var data = obj.data //获得当前行数据
        var btns, fun1
        var updateInp = $('#ifUpdateComb_produclist')
        if (updateInp.length > 0) {
            fun1 = function() {
                // 校验必填项
                if (!checkNotNull('#addCombForm')) {
                    return false
                }
                // 提交数据
                submitComb()
            }
            btns = ['保存', '关闭']
        } else {
            fun1 = function() {
                layer.closeAll()
            }
            btns = ['关闭']
        }

        if (layEvent === 'show_combDetail') {
            layer.open({
                title: '组合品详情',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['1360px', '80%'],
                id: 'show_combDetailId',
                shadeClose: false,
                btn: btns,
                content: $('#addGroupListLayer').html(),
                yes: function(index, layero) {
                    fun1()
                },
                success: function(layero, index) {
                    // 子SKU  不可编辑
                    $('#addCombForm [name=sSku]').attr('readonly','readonly')
                    $('#addCombForm [name=sSku]').addClass('disAbleInp')
                    // 初始化必填项
                    initNotNull()

                    // 监听input输入
                    $('#productlist_sSkuInputBind').bind('input propertychange', function() {
                        var inputLen = $('#productlist_sSkuInputBind').val().length
                        $('#productlist_inputBindCount').text(inputLen)
                    })

                    //1.初始化父sku事件
                    initPSkuEvent('#addCombForm')
                        //2. 表格增删
                    comb_table()

                    // 复现数据
                    getCombDetail(data.id)
                    getProdLog('getProdOperLog', data.id, '#pl_combLogTbody')
                    form.render()
                }
            })
        } else if (layEvent === 'show_subDetail') {
            var btns
            var fun1, fun2
            var updateInp = $('#ifUpdate_produclist')
            if (updateInp.length > 0) {
                if (data.auditStatus == 4) {
                    btns = ['保存并发布', '保存', '关闭']
                    fun1 = function() {
                        if (!checkNotNull('#addSSkuForm')) {
                            return false
                        }
                        submitSSku(true)
                        return false
                    }
                    fun2 = function() {
                        if (!checkNotNull('#addSSkuForm')) {
                            return false
                        }
                        submitSSku(false)
                        return false
                    }
                } else {
                    btns = ['保存', '关闭']
                    fun1 = function() {
                        if (!checkNotNull('#addSSkuForm')) {
                            return false
                        }
                        submitSSku(false)
                        return false
                    }
                    fun2 = function() {
                        return true
                    }
                }
            } else {
                btns = ['关闭']
                fun1 = function() {
                    layer.closeAll()
                }
            }

            layer.open({
                title: '商品详情',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['100%', '80%'],
                id: 'show_subDetailId',
                shadeClose: false,
                btn: btns,
                content: $('#productlist_addProductLayer').html(),
                yes: function(index, layero) {
                    return fun1()
                },
                btn2: function() {
                    return fun2()
                },
                success: function(layero, index) {
                    initUploadImg()

                    // 检查是否有新增供应商权限
                    if ($('#ifAddSupplier_produclist').length > 0) {
                        $('.addsupplierBtn_productlist').removeClass('disN')
                    }
                    // 子SKU  不可编辑
                    $('#addSSkuForm [name=sSku]').attr('readonly','readonly')
                    $('#addSSkuForm [name=sSku]').addClass('disAbleInp')

                    // 初始化必填项
                    initNotNull()

                    // 初始化自定义选择框
                    initHpSelect('#addSSkuForm')

                    //1.初始化父sku事件
                    initPSkuEvent('#addSSkuForm')

                    // 新增供应商按钮点击事件
                    newAddSupplier()
                        //2. 表格增删
                    supplierInfoTble()
                        //6.底部栏的代码和样式
                    if ($('#ifCheck_produclist').length > 0) {
                        var $target = layero.find('.layui-layer-btn.layui-layer-btn-'),
                            $html = `<div class="layui-form-item layui-form" style="position:absolute;bottom:-10px;width: 80%">
                                                <div class="layui-inline" style="float: left;">
                                                    <select type="text" class="layui-input" id="pl_auditResult" placeholder="审核结果" style="height:30px">
                                                    <option value=""></option>
                                                    <option value="3">通过</option>
                                                    <option value="4">失败</option>
                                                    </select>
                                                </div> 
                                                <div class="layui-inline"  style="float: left;">
                                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="auditSub()">审核</button>
                                                </div>
                                                <div class="layui-inline"  style="float: left; width: 60%">
                                                    <input type="text" class="layui-input" placeholder="审核备注" style="height:30px" id="pl_auditDesc">
                                                </div>           
                                        </div>`
                        $target.append($html)
                    }
                    getSubDetail(data.sSku)
                    getProdLog('getProdOperLog', data.id, '#pl_subLogTbody')

                    //ztt20230901查找货源
                    layero.on('click', '.searchSupply', function(){
                      let $img = $(this).parents('.layui-col-lg6').find('.productlist_imageEditDiv>img');
                      if($img.length > 0){
                        let imgSrc = $img.attr('src');
                        commonSearchGoodsComponents(imgSrc);
                      }else{
                        layer.msg('请先黏贴图片', {icon: 7});
                      }
                    });
                }
            })
        } else if (layEvent === 'audit_log') {
            //getProdAuditLog
            var index = layer.open({
                type: 1,
                title: '审核日志',
                area: ['800px', '400px'],
                btn: ['关闭'],
                yes: function(index, layero) {
                    layer.close(index)
                },
                shadeClose: false,
                content: $('#pl_auditLogLayer').html(),
                success: function() {
                    getProdLog('getProdAuditLog', data.id, '#pl_auditLogTbody')
                },
                end: function() {
                    $('#pl_auditLogTbody').html('')
                }
            })
        }

    })
    initCateXtreeForSupplier()

    //新增供应商
    function newAddSupplier() {
        $('.addsupplierBtn_productlist').click(function() {
            var index = layer.open({
                title: '新增供应商',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['800px', '600px'],
                id: 'addsupplierId',
                shadeClose: false,
                content: $('#addsupplierLayer').html(),
                btn: ['保存', '关闭'],
                success: function() {
                    //所属类目渲染
                    alertCateSelect($('#addSuppFrom #xtreeAddBtn'), $('#addSuppFrom [name=supportCateIds]'), $('#addSuppFrom #xtreeAddDiv'))
                        // 初始化必填项
                    initNotNull('#addSuppFrom')
                     // 可选省份初始化
                    initSelectIcon(form,'PROVINCE_CODE','#addSuppFrom [name=province]',true)
                        //常规用法
                    laydate.render({
                            elem: '#pl_UncoopTime' //指定元素
                                ,
                            type: 'datetime'
                        })
                        //所属类目
                        //  layui.formSelects.data('pl_select_add','local',{arr:cateArray});
                    form.render('checkbox')
                    form.render('select')
                },
                yes: function(index, layero) {
                    // 校验有无选择类目
                    var cateLsit = $('#addSuppFrom [name=supportCateIds]').val()
                    if (!cateLsit || cateLsit.length == 0) {
                        layer.msg('请选择所属类目')
                        return false
                    }
                    // 校验必填项
                    if (!checkNotNull('#addSuppFrom')) {
                        return false
                    }

                    //处理数据
                    var data = serializeObject($('#addSuppFrom'))
                    data.isSupportCust = $('#isSupportCust').prop('checked')
                    data.isCooperate = true
                    if ($('#isCooperate').is(':checked')) {
                        data.isCooperate = false
                        data.uncooperativeReason = $('#uncoopReasonTag').val()
                    }
                    var uncooperativeTime = data['uncooperativeTime']
                    if (uncooperativeTime != '') {
                        uncooperativeTime = uncooperativeTime.replace(/-/g, '/')
                        var d = new Date(uncooperativeTime)
                        var uncoopTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
                        data['uncooperativeTime'] = uncoopTime
                    }

                    data.mobile == ''?data.mobile = 'null':'';
                    data.contact == ''?data.contact = 'null':'';

                    loading.show()
                    $.ajax({
                        type: 'post',
                        url: ctx + '/product/addProdSupplier.html',
                        dataType: 'json',
                        data: data,
                        success: function(returnData) {
                            loading.hide()
                            if (returnData.code == '0000') {
                                layer.close(index)
                                layer.msg('添加供应商成功')
                            } else {
                                layer.msg(returnData.msg)
                            }
                        },
                        error: function() {
                            loading.hide()
                            layer.msg('发送请求失败')
                        }
                    })
                },
            })
        })
    }

    // 采集信息回填
    $(document).off('click',"#productList_collectInfo").on('click',"#productList_collectInfo",function(){
        // let url = $("#addSuppFrom [name=1688url]").val()
        // if (url.indexOf('https://detail.1688.com/offer/') < 0) {
        //     layer.msg('请先填写1688链接(1688链接必须要以https://detail开头)')
        //     return
        // }

        // commonReturnPromise({
        //     url: '/lms/prodSupplier/getWangDuoYunCrawlerApiInformation.html',
        //     type:'POST',
        //     contentType:"application/json",
        //     params:JSON.stringify({"Url":url,"categoryForecast":"false"})
        // }).then(res => {
        //     $("#addSuppFrom [name=supplier]").val(res.provider_name)
        //     $("#addSuppFrom [name=aliLoginId]").val(res.shop_id)
        //     $("#addSuppFrom [name=aliLoginId]").attr("readonly",true)
        //     $("#addSuppFrom [name=isCollect]").val(true)
        //     $("#addSuppFrom [name=supplierCode]").val(res.shop_id)
        //     $("#addSuppFrom [name=contact]").val(res.contact)
        //     $("#addSuppFrom [name=mobile]").val(res.mobileNo)
        //     $("#addSuppFrom [name=companySite]").val(res.shop_url)
        //     $("#addSuppFrom [name=companyAddr]").val(res.address)
        // }).catch(err => {
        //     layer.msg(err, { icon: 2 });
        // })
        let url = $("#addSuppFrom [name=1688url]").val() || ''
        if (url.indexOf('https://detail.1688.com/offer/') < 0) {
            layer.msg('请先填写1688链接(1688链接必须要以https://detail开头)')
            return
        }
        if (url.indexOf('.html?') > -1) {
            window.open(url+ '&origin=lms')
        } else {
            window.open(url+ '?origin=lms');
        }
    })

    $(document).off('click',"#productList_copyInfo").on('click',"#productList_copyInfo",function(){
        console.log('粘贴信息')
        navigator.clipboard.readText().then(text => {
            let collectInfo = JSON.parse(text)
            console.log('剪贴板的文本为', collectInfo)
            $("#addSuppFrom [name=supplier]").val(collectInfo.supplierName)

            $("#addSuppFrom [name=aliLoginId]").val(collectInfo.sellerLoginId)
            $("#addSuppFrom [name=aliLoginId]").attr("readonly",true)
            $("#addSuppFrom [name=isCollect]").val(true)
            $("#addSuppFrom [name=supplierCode]").val(collectInfo.sellerLoginId)
            $("#addSuppFrom [name=contact]").val(collectInfo.contactPerson)
            $("#addSuppFrom [name=mobile]").val(collectInfo.telNumber)
            $("#addSuppFrom [name=companySite]").val(collectInfo.storeUrl)
            $("#addSuppFrom [name=companyAddr]").val(collectInfo.address)
        }).catch(err => {
            layer.msg('读取剪贴板中的文本失败', { icon: 2 });
        })
    })

    // 新增万邑通商品
    $('#productlist_addWinitProd').click(function() {
        let checkStatus = table.checkStatus('sProdTable'),
            selectedDtoList = checkStatus.data
        let sSkuList = []
        if (selectedDtoList.length > 0) {
            for (let i = 0; i < selectedDtoList.length; ++i) {
                sSkuList.push(selectedDtoList[i].sSku)
            }
        } else {
            layer.msg('请选择要推送到万邑通新增的商品')
            return
        }
        let sSkuSearch = sSkuList?.join(',')
        winitregist_addOnePop(sSkuSearch)
        // window.sessionStorage.winitregist_addSku = sSkuList.join(',')
        // location.hash = '#/route/wyt/info/winitregist'
    })


    function winitregist_addOnePop(sSkuSearch) {
        let popIndex = layer.open({
            title: '新增商品',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1200px', '80%'],
            id: 'winitregist_addProdPop',
            btn: ['保存', '保存并发布', '关闭'],
            content: $('#productlist_addWinitProdLayer').html(),
            success: function () {
                initNotNull('#productlist_addProdForm');
                // 展现初始化的子商品表格
                winitregist_showProdSInfoForAdd([]);
                // 初始增加1个空白竞品
                winitregist_addCompList([{}]);
                // 查询功能
                $('#winitregist_searchPsku').click(function () {
                    // 清空之前的查询信息
                    let addForm = $('#productlist_addProdForm');
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
                    $('#productlist_addProdForm').find('[name=sSkuSearch]').val(sSkuSearch)
                    $('#winitregist_searchPsku').click()
                }
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        return false; //阻止系统默认回车事件
                    }
                };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            yes: function() {
                winitregist_addProd(false,popIndex)
                return false
            },
            btn2: function () {
                winitregist_addProd(true,popIndex)
                return false
            },
            end: function() {
                $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
            }
        })
    }

    function winitregist_addProd(ifRelease, popIndex) {
        // 获取数据
        let addForm = $('#productlist_addProdForm');
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
                    table.reload('sProdTable');
                    layer.close(popIndex)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }
    // 获取子商品数据
    function winitregist_getProdSInfoData(ifRelease) {
        let winitSInfoDtoList = [];
        let checkStatus = table.checkStatus('sProdTable'),
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
        let suggestInpList = $('#productlist_addProdForm').find('[name=suggestSendAmt]');
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
    // 获取竞品数据
    function winitregist_getCompData() {
        let trList = $('.compTab_addProductLayer tr');
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

    // 清空竞品数据
    function winitregist_clearCompList() {
        $('.winitregist_compTab_addProductLayer').html('')
    }

    // 查询父sku
    function winitregist_searchPsku() {
        let data = {
            pSku: $('#productlist_addProdForm').find('[name=pSkuSearch]').val().trim()
        };
        let sSkuStr = $('#productlist_addProdForm').find('[name=sSkuSearch]').val().trim()
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
                    let addForm = $('#productlist_addProdForm');
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
                    let channelOptionList = $('#product_Form_channelDiv').find("option");
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
            elem: '#productlist_prodSInfoTable',
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
                    {title: "销售渠道", templet: "#product_addProd_channel", width: 120},
                    {templet: "#product_addProd_suggestSendAmt", title: "<div>建议发货数量</div><div><input style='width: 100px' placeholder='ebay美国' type='number'><span class='canClickEl mr10' onclick='setAllSuggestSendAmt(this,`ebay美国`)'>应用</span><input style='width: 100px' placeholder='ebay英国' type='number'><span class='canClickEl mr10' onclick='setAllSuggestSendAmt(this,`ebay英国`)'>应用</span><input style='width: 100px' placeholder='ebay德国' type='number'><span class='canClickEl mr10' onclick='setAllSuggestSendAmt(this,`ebay德国`)'>应用</span></div>"}
                ]
            ],
            height: 300,
            page: true,
            limit: 50,
            limits: [50, 100, 500],
            id: 'productlist_prodSInfoTable',
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
                    $('#productlist_addProdForm [name='+ elemName +']').prop('checked',data.elem.checked)
                    form.render('checkbox','productlist_addProdForm')
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
        let channelHtml = $('#product_Form_channelDiv').html();
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
        $('.compTab_addProductLayer').append(html);
        // 渲染销售渠道
        let selectList = $('.compTab_addProductLayer [name=channel]');
        for (let i = 0; i < selectList.length; ++i) {
            let value = selectList[i].getAttribute('data-value');
            if (value) {
                $(selectList[i]).find('option[value='+ value +']').attr('selected','selected')
            }
        }
        form.render('select','compTab_addProductLayer')
    }

    /*商品父sku相关点击事件-  键入搜索父sku   获取父sku详情   新增父sku  修改父sku*/
    function initPSkuEvent(formSelector) {
        // 获得焦点 键入搜索父sku
        $(formSelector + ' [data-id=prodPSku]').on('focus propertychange input', function() {
                searchSku(this, 'psku')
            })
            // 失去焦点
        $(formSelector + ' [data-id=prodPSku]').on('blur', function() {
                let self = this
                window.setTimeout(function() {
                    $(self).next().hide()
                }, 500)
            })
            // 获取父sku详情
        $(formSelector + ' [data-id=getPskuDetail]').on('click', function() {
            var pSku = $(formSelector + ' [data-id=prodPSku]').val()
            if (pSku == '') {
                layer.msg('请输入正确的父sku')
                return
            }
            $(formSelector + ' [data-id=bizzOwner]').val('')
            $(formSelector + ' [data-id=responsor]').val('')
            $(formSelector + ' [data-id=tags]').val('')
            $(formSelector + ' [data-id=cate]').val('')
            $(formSelector + ' [data-id=devCate]').val('')
            oneAjax.post({
                url: ctx + '/product/getPProd.html',
                data: { 'pSku': pSku },
                success: function(returnData) {
                    if (returnData.code === '0000') {
                        let obj = returnData.data
                        $(formSelector + ' [data-id=bizzOwner]').val(obj.bizzOwner)
                        $(formSelector + ' [data-id=responsor]').val(obj.responsor)
                        $(formSelector + ' [data-id=tags]').val(obj.prodAttrList)
                        $(formSelector + ' [data-id=newCate]').val(obj.prodPInfoCateOaDTO && obj.prodPInfoCateOaDTO.cateName ? obj.prodPInfoCateOaDTO.cateName : '')
                        $(formSelector + ' [data-id=cate]').val(obj.prodCate.cateCnName)
                        $(formSelector + ' [data-id=devCate]').val(obj.prodCate.mgmtName)
                        $(formSelector + ' [data-id=baoguan_cn]').val(obj.prodCate.customsCnName)
                        $(formSelector + ' [data-id=baoguan_en]').val(obj.prodCate.customsEnName)
                        $(formSelector + ' [data-id=baoguan_value]').val(obj.prodCate.customsValue)
                        $(formSelector + ' [name=pId]').val(obj.id)
                        $(formSelector + ' [data-id=isAlonePack]').prop('checked', obj.isAlonePack)
                        $(formSelector + ' [data-id=isSpecialPack]').prop('checked', obj.isSpecialPack)
                        form.render('checkbox')
                    } else {
                        layer.msg(returnData.msg)
                    }
                },
                error: function() {
                    layer.msg('发送请求失败')
                }
            })
        })
        let prodPSkuElem = $(formSelector + ' [data-id=prodPSku]')
        let getPSkuInfoBtnElem = $(formSelector + ' [data-id=getPskuDetail]')

        let reback = function (pSku) {
            prodPSkuElem.val(pSku)
            getPSkuInfoBtnElem.click()
        }

        // 新增父sku
        $(formSelector + ' [data-id=addParentSku]').on('click', function() {
            popToAddOrUpdProdPInfo(null,reback)
        })
        let reback2 = function (pSku) {
            getPSkuInfoBtnElem.click()
        }
        // 修改父sku
        $(formSelector + ' [data-id=editParentSku]').on('click', function() {
            let pSku = $(formSelector + ' [data-id=prodPSku]').val();
            if (!pSku) {
                layer.msg('请先填写父SKU')
                return
            }
            popToAddOrUpdProdPInfo({pSku: pSku},reback2)
        })
    }

    //获取并渲染组合品详情
    function getCombDetail(id) {
        loading.show()
        $.ajax({
            type: 'post',
            url: ctx + '/product/getCombDetail.html',
            dataType: 'json',
            data: { 'id': id },
            success: function(returnData) {
                loading.hide()
                if (returnData.code == '0000') {
                    var comb = returnData.data
                    $('#addCombForm [data-id=prodPSku]').val(comb.parent.pSku)
                    $('#addCombForm [name=pId]').val(comb.parent.id)
                    $('#addCombForm [data-id=bizzOwner]').val(comb.parent.bizzOwner)
                    $('#addCombForm [data-id=responsor]').val(comb.parent.responsor)
                    $('#addCombForm [data-id=tags]').val(comb.parent.prodAttrList)
                    $('#addCombForm [data-id=newCate]').val(comb.newCate && comb.newCate.cateName ? comb.newCate.cateName : '')
                    $('#addCombForm [data-id=cate]').val(comb.cateDto.cateCnName)
                    $('#addCombForm [data-id=devCate]').val(comb.cateDto.mgmtName)
                    $('#addCombForm [name=\'id\']').val(comb.id)
                    $('#addCombForm [name=\'sSku\']').val(comb.sSku)
                    $('#productlist_inputBindCount').text(comb.sSku.length)
                    $('#addCombForm [name=\'title\']').val(comb.title)
                    $('#addCombForm [name=\'suttleWeight\']').val(comb.suttleWeight)
                    $('#addCombForm [name=\'packDifficulty\']').val(comb.packDifficulty)
                    $('#addCombForm [name=\'purchaseCostPrice\']').val(comb.purchaseCostPrice)
                    $('#addCombForm [name=\'defaultDlvrWhId\']').val(comb.defaultDlvrWhId)
                    $('#addCombForm [name=\'isSale\']').prop('checked', !comb.isSale)
                    $('#addCombForm [name=\'packSpecification\']').val(comb.packSpecification)
                    $('#addCombForm [name=\'innerPackCost\']').val(comb.innerPackCost)
                    $('#addCombForm [name=\'packDesc\']').val(comb.packDesc)
                    $('#addCombForm [name=\'outerBoxLength\']').val(comb.outerBoxLength)
                    $('#addCombForm [name=\'outerBoxWidth\']').val(comb.outerBoxWidth)
                    $('#addCombForm [name=\'outerBoxHeight\']').val(comb.outerBoxHeight)
                    $('#addCombForm [name=\'productLength\']').val(comb.productLength)
                    $('#addCombForm [name=\'productWidth\']').val(comb.productWidth)
                    $('#addCombForm [name=\'productHeight\']').val(comb.productHeight)
                    $('#addCombForm [name=\'winitLength\']').val(comb.winitLength)
                    $('#addCombForm [name=\'winitWidth\']').val(comb.winitWidth)
                    $('#addCombForm [name=\'winitHeight\']').val(comb.winitHeight)
                    $('#addCombForm [name=\'liquidNetContentMl\']').val(comb.liquidNetContentMl)
                        // $("#addCombForm [name='compressHeight']").val(comb.compressHeight);
                        // $("#addCombForm [name='superpositionHeight']").val(comb.superpositionHeight);
                    $('#addCombForm [name=\'throwWeight\']').val(comb.throwWeight)
                    $('#addCombForm [name=\'purchaseChannel\']').val(comb.purchaseChannel || '')
                    $('#addCombForm [name=\'customsCode\']').val(comb.customsCode || '')
                    $('#addCombForm [name=\'material\']').val(comb.material || '')
                        //$("#combDetailForm select[name='packSpecification']").find('opiton[value='+comb.packSpecification+']').prop('selected',true);
                    $('#addCombForm select[name=\'packSpecification\']').trigger('select')
                    var combLogisAttrList = comb.logisAttrList.split(',')
                    for (var i = 0; i < combLogisAttrList.length; i++) {
                        if (combLogisAttrList.length > 1 && combLogisAttrList[i] === '普货') {
                            continue
                        }
                        var obj = $('#logisAttr_comb :checkbox[value=\'' + combLogisAttrList[i] + '\']')
                        obj.prop('checked', true)
                    }
                    $('#addCombForm input[name=\'isSale\']').prop('checked', !comb.isSale)
                    if (typeof(comb.isOutOfStock) != undefined) {
                        $('#addCombForm input[name=\'isOutOfStock\']').prop('checked', comb.isOutOfStock)
                    }
                    // 审核详情
                    $('#pl_auditResult_comb').val(comb.auditStatus)
                    $('#pl_auditDesc_comb').val(comb.auditDesc)
                        //组合品列表
                    var compList = comb.combSubProds
                        // 组合品是否在售
                    var combIsSale = true
                    var tr_arr
                    for (var i in compList) {
                        var complist = compList[i]
                        if (!complist.isSale) { // 有1个子商品 停售 则组合品停售
                            combIsSale = false
                        }
                        tr_arr = newCombObj(complist)
                        $('#groupTable tbody').append(tr_arr)
                    }
                    // 设置组合品在售状态
                    $('#addCombForm [name=isSale]')[0].checked = !combIsSale
                        // 初始化组合品-包装重量
                    getTotalWeight('#packspectag_comb option:selected', '#addCombForm', '#totalWeight_comb')
                    form.render('select')
                    form.render('checkbox')
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('发送请求失败')
            }
        })
    }


    /**
     * 获取并渲染子商品详情
     * @param sSku
     * @param ifNotSetId  复制新增时， 查询商品详情，不要渲染id
     * @param ifAdd
     */
    function getSubDetail(sSku, ifNotSetId, ifAdd) {
        loading.show()
        $.ajax({
            type: 'post',
            url: ctx + '/product/getSubDetail.html',
            dataType: 'json',
            data: { 'sSku': sSku },
            success: function(returnData) {
                loading.hide()
                if (returnData.code === '0000') {
                    var obj = returnData.data
                        //图片
                    if (returnData.data?.image) {
                        let imageArr = returnData.data.image.split('||') || []
                        for (let i = 0; i < imageArr.length; ++i) {
                            $('#image_edit' + i).html('<img src=' + tplIVP + imageArr[i] + ' class=\'imgCss img_show_hide\' style=\'width:150px;height:150px;border:1px solid #f2f2f2\' />')
                        }
                    }
    
                    $.each(obj, function(key) {
                        if (key != 'logisAttrList' && key != 'isSale') {
                            $('#addSSkuForm' + ' [name="' + key + '"]').val(obj[key])
                        }
                    })
                    if (obj.discountPrice === undefined || obj.discountPrice === '') {
                        $('#discountPriceFormItem').hide()
                    }
                    $('#addSSkuForm [name=liquidNetContentMl]').val(obj.prodSInfoExtends?.liquidNetContentMl)
                    if (ifNotSetId) {
                        $('#addSSkuForm [name=id]').val('')
                    }
                    // 记录原始值
                    if (obj.buyerId != null) {
                        $('#addSSkuForm [name=buyerId]').attr('originValue', obj['buyerId'])
                    } else {
                        $('#addSSkuForm [name=buyerId]').attr('originValue', '0')
                        $('#addSSkuForm [name=buyerId]').val('0')
                    }
                    $('#addSSkuForm [name=buyer]').attr('originValue', obj['buyer'])
                    $('#addSSkuForm [data-id=prodPSku]').attr('originValue', obj.parent.pSku)
    
                    $('#addSSkuForm [data-id=prodPSku]').val(obj.parent.pSku)
                    $('#addSSkuForm [data-id=bizzOwner]').val(obj.parent.bizzOwner)
                    $('#addSSkuForm [data-id=responsor]').val(obj.parent.responsor)
                    $('#addSSkuForm [data-id=tags]').val(obj.parent.prodAttrList)
                    $('#addSSkuForm [data-id=newCate]').val(obj.newCate && obj.newCate.cateName ? obj.newCate.cateName: '')
                    $('#addSSkuForm [data-id=cate]').val(obj.cateDto.cateCnName)
                    $('#addSSkuForm [data-id=devCate]').val(obj.cateDto.mgmtName)
                    $('#addSSkuForm [data-id=baoguan_cn]').val(obj.cateDto.customsCnName)
                    $('#addSSkuForm [data-id=baoguan_en]').val(obj.cateDto.customsEnName)
                    $('#addSSkuForm [data-id=baoguan_value]').val(obj.cateDto.customsValue)
                    $('#addSSkuForm [name=\'pId\']').val(obj.parent.id)
                    $('#owner,#tags,#cate,#baoguan_cn,#baoguan_en,#baoguan_value,#devCate').attr('disabled', 'disabled')
                    if (!obj.isSale) {
                        $('#addSSkuForm #notSaleTimeStr').val(admin.Format(obj.notSaleTime, 'yyyy-MM-dd hh:mm:ss'))
                    } else {
                        $('#addSSkuForm [name=notSaleReason]').val('')
                    }
                    $('#addSSkuForm input[name=\'isSale\']').prop('checked', !obj.isSale)
                    if (typeof(obj.isOutOfStock) != undefined) {
                        $('#addSSkuForm [name=\'isOutOfStock\']').prop('checked', obj.isOutOfStock)
                    }
                    if (obj.logisAttrList) {
                        var combLogisAttrList = obj.logisAttrList.split(',')
                        for (var i = 0; i < combLogisAttrList.length; i++) {
                            var checkAttr = $('#logisAttr :checkbox[value=\'' + combLogisAttrList[i] + '\']')
                            checkAttr.prop('checked', true)
                        }
                    }
                    // 独立包装
                    if (obj.parent.isAlonePack) {
                        $('#addSSkuForm #isAlonePack_prodsDetail').attr('checked', 'checked')
                    }
                    // 特殊包装
                    if (obj.parent.isSpecialPack) {
                        $('#addSSkuForm #isSpecialPack_prodsDetail').attr('checked', 'checked')
                    }
                    // 是否定制
                    if (obj.isSpecialMake != null && obj.isSpecialMake != undefined) {
                        $('#addSSkuForm [name=isSpecialMake]').val(obj.isSpecialMake ? '1' : '0')
                    }
                    if (typeof(obj.ifWithPlug) != undefined) {
                        $('#addSSkuForm [name=\'ifWithPlug\']').prop('checked', obj.ifWithPlug)
                    }
                    // 审核结果设置
                    $('#pl_auditResult').val(obj.auditStatus)
                    $('#pl_auditDesc').val(obj.auditDesc)
    
                    // 库位
                    if (!ifAdd) {
                        $('#addSSkuForm [name=stockLocation]').val(obj.whStockWarning ? obj.whStockWarning.stockLocation : '')
                        $('#addSSkuForm [name=receiveAddressName]').text(obj.receiveAddressName ? obj.receiveAddressName : '')
    
                    }
                    // 供应商列表
                    var supppliers = obj.supplier
                    for (var i in supppliers) {
                        var sup = supppliers[i]
                        if (ifNotSetId) {
                            sup.offerId = ''
                            sup.specId = ''
                            sup.attrStr = ''
                        }
                        addsupplierTbody(sup, false, ifAdd)
                    }
                    // 初始化包装重量
                    getTotalWeight('#packspectag option:selected', '#addSSkuForm', '#totalWeight')
                    
                    // 详情 是否是多属性sku
                    $('.supplierRefTab_productlist tbody tr').each((index, item) => {
                        if (supppliers[index]?.ifMultiple && supppliers[index]?.subList.length > 0) {
                            $(item).find('[attrStr]').val('多属性组合')
                            $(item).find('[attrStr]').css({'color': 'red'})
                            subChooseInfo[index] = {
                                ifMultiple: true,
                                subList: supppliers[index].subList
                            }
                            let supplierPriceAll = 0
                            supppliers[index].subList?.forEach(item => {
                                supplierPriceAll += Number(item.price * item.purBaseNum)
                            })
                            $(item).find('[prodPrice]').val(supplierPriceAll.toFixed(2))
                        } else {
                            subChooseInfo[index] = {}
                        }
                    })
                    form.render('select')
                    form.render('checkbox')
                } else {
                    layer.msg(returnData.msg,{icon: 2})
                }
            },
            error: function() {
                loading.hide()
                layer.msg('发送请求失败')
            }
        })
    }
    // 获取供应商数据
    function getSupplierList(data){
        let supplier = []
        let supplierTrs = $('.supplierRefTab_productlist tbody').find('tr')
        for (let i = 0; i < supplierTrs.length; ++i) {
            let supplierRef = {}
            let trElem = $(supplierTrs[i])
            supplierRef.id = trElem.find('[refId]').val() //供应商关系id
            supplierRef.supplierName = trElem.find('[suppliername]').val().trim() //供应商名称
            supplierRef.purchaseUrl = trElem.find('[purchaseUrl]').val().trim() //采购URL
            supplierRef.minOrderNum = trElem.find('[minOrderNum]').val().trim() //最小订货量
            supplierRef.quote = trElem.find('[quote]').val().trim() //供应商报价
            supplierRef.note = trElem.find('[note]').val().trim() //说明
            supplierRef.supplierId = trElem.find('[supplierId]').val() //id
            supplierRef.attrStr = trElem.find('[attrstr]').val()
            supplierRef.articleNo = trElem.find('[articleNo]').val()
            supplierRef.offerId = trElem.find('[offerId]').val()
            supplierRef.specId = trElem.find('[specId]').val()
            supplierRef.ifDefault = trElem.find('[ifDefault]').prop('checked')
            supplierRef.ifSupplierPack = trElem.find('[ifSupplierPack]').prop('checked')
            supplierRef.supplierPackFee = trElem.find('[supplierPackFee]').val().trim()//供应商包装费用
            supplierRef.prodPrice = trElem.find('[prodPrice]').val().trim()
            supplierRef.stockPackFee = trElem.find('[stockPackFee]').val().trim()
            supplierRef.purBaseNum = trElem.find('[purBaseNum]').val().trim()
            supplierRef.ifMultiple = subChooseInfo[i]?.ifMultiple || false
            supplierRef.subList = subChooseInfo[i]?.subList || []
            // 解析出offerId
            if (!supplierRef.offerId && supplierRef.purchaseUrl.indexOf("/offer/") > 0) {
                supplierRef.offerId = (supplierRef.purchaseUrl.substring(supplierRef.purchaseUrl.indexOf("/offer/") + 7, supplierRef.purchaseUrl.indexOf(".html")));
            }
            if (!supplierRef.specId && !supplierRef.attrStr) {
                supplierRef.specId = null
            }
            supplier.push(supplierRef)
        }

        return supplier;
    }
    function getEditData(ifPublish){
        let data = serializeObject($('#addSSkuForm'))
        if (ifPublish) {
            data.auditStatus = 1
        }
        // 报关重量等于 带包装重量
        data.customsWeight = accAdd(parseFloat(data.suttleWeight), parseFloat(data.packWeight))

        data.defaultDlvrWh = $('#wareHouseTag').next('.layui-unselect.layui-form-select').find('dd.layui-this').text()
        let logisAttrList = []
        $('#logisAttr').find('input[name=\'logisAttrList\']:checked').each(function() {
            logisAttrList.push(this.value)
        })
        let logisAttr = logisAttrList.join(',')

        data.isSpecialMake = data.isSpecialMake == 1 ? true : false

        data.logisAttrList = logisAttr
        data.isSale = !$('#addSSkuForm input[name=\'isSale\']').prop('checked')
        data.isOutOfStock = $('#addSSkuForm input[name=\'isOutOfStock\']').prop('checked')
        data.ifWithPlug = $('#addSSkuForm input[name=\'ifWithPlug\']').prop('checked')
        //  数字，如果为空， 则保存为0
        data.innerPackCost = data.innerPackCost.trim() ? data.innerPackCost.trim() : 0
        // data.minPackingNums = data.minPackingNums.trim() ? data.minPackingNums.trim() : 0
        // data.sampleNums = data.sampleNums.trim() ? data.sampleNums.trim() : 0
        data.outerBoxLength = data.outerBoxLength.trim() ? parseFloat(data.outerBoxLength.trim()) : 0
        data.outerBoxWidth = data.outerBoxWidth.trim() ? parseFloat(data.outerBoxWidth.trim()) : 0
        data.outerBoxHeight = data.outerBoxHeight.trim() ? parseFloat(data.outerBoxHeight.trim()) : 0
        data.winitLength = data.winitLength.trim() ? parseFloat(data.winitLength.trim()) : 0
        data.winitWidth = data.winitWidth.trim() ? parseFloat(data.winitWidth.trim()) : 0
        data.winitHeight = data.winitHeight.trim() ? parseFloat(data.winitHeight.trim()) : 0

        // 获取图片数据
        let imgEles = $('#productlist_imageDiv').find('img')
        let imgArr = []
        for (let i = 0; i < imgEles.length; ++i) {
            imgArr.push(imgEles[i].src)
        }
        var sImage = imgArr.join('||')
        sImage = sImage.replace(tplIVP,'')
        data.image = sImage.indexOf('!') > -1 ? sImage.split('!')[0] : sImage;
        if (!sImage) {
            layer.msg('请先上传图片', { icon: 0 })
            return false
        }
        // 获取供应商数据
        data.supplier =  getSupplierList(data)
        if (!data.supplier || data.supplier.length === 0) {
            layer.msg('请填写供应商信息')
            return false
        }
        return data
    }
    function validData(data){
        let serializeObj = ''
        data.outerBoxLength <= 0 ? serializeObj = "外箱长":'';
        data.outerBoxWidth <= 0 ? serializeObj = "外箱宽":'';
        data.outerBoxHeight <= 0 ? serializeObj = "外箱高":'';
        data.suttleWeight <= 0 ? serializeObj = "商品净重":'';

        if(serializeObj !== ''){
            layer.msg(`${serializeObj}需要输入大于0的数`)
            return false
        }

        if (!validateSKU(data.sSku)) {
            layer.msg('商品sku仅能包含大写字母和数字以及"-"划线')
            return false
        }

        if (data.packDesc?.indexOf('(') > -1 || data.packDesc?.indexOf(')') > -1 || data.packDesc?.indexOf('（') > -1 || data.packDesc?.indexOf('）') > -1) {
            layer.msg('入库要求中不能包含字符"(" 和 ")" ')
            return false
        }
        let supplier = data.supplier
        let repeatSupplier = [] // 用于校验重复的 供应商
        let supplierJson = {} // 用于校验重复的 供应商
        for (let i = 0; i < supplier.length; ++i ) {
            let supplierRef = supplier[i]
            if (!supplierRef.supplierName) {
                layer.msg('请填写供应商名称')
                return false
            }
            if (!supplierRef.purchaseUrl) {
                layer.msg('请填写采购链接')
                return false
            }
            if (!supplierRef.prodPrice|| isNaN(supplierRef.prodPrice)) {
                layer.msg('请填写正确的供应商商品报价')
                return false
            }
            if (supplierRef.prodPrice*1 <= 0) {
                layer.msg('供应商商品报价需输入大于0的数字')
                return false
            }
            if (supplierRef.ifSupplierPack && !supplierRef.supplierPackFee) {
                layer.msg('供应商提供包装，请填写供应商包装费用')
                return false
            }
            if (supplierRef.supplierPackFee && isNaN(supplierRef.supplierPackFee)) {
                layer.msg('请填写正确的供应商包装费用')
                return false
            }
            if (!supplierRef.purBaseNum === null || isNaN(supplierRef.purBaseNum) || supplierRef.purBaseNum <= 0) {
                layer.msg('采购基数必填且为正数')
                return false
            }
            if (supplierRef.ifSupplierPack && supplierRef.supplierPackFee === '') {
                layer.msg('供应商提供包装的，必须填写供应商包装费用')
                return false
            }
            if (supplierRef.supplierName) {
                if (supplierJson[supplierRef.supplierName]) {
                    repeatSupplier.push(supplierRef.supplierName)
                }
                supplierJson[supplierRef.supplierName] = 1
            }
        }
        if (repeatSupplier.length > 0) {
            layer.msg('存在重复供应商:' + repeatSupplier.join(','))
            return false
        }

        return true
    }
    //提交子sku
    function submitSSku(ifPublish) {
        // 获取商品数据
        let data = getEditData(ifPublish)
        // 校验数据
        if (!validData(data)) {
            return false
        }
        let isEmpty = false
        $('#supplierRefTab_productlist').find('tr')?.each((index, item) => {
            let attrStrDom = $(item).find('.attrStr').find('input')[0]
            let isPack = $(item).find('[ifSupplierPack]').prop('checked')
            let packFee = $(item).find('[supplierpackfee]').val()

            if ($(attrStrDom).val() == '多属性组合' && !isPack) {
                // 没有勾选供应商包装    
                isEmpty = true
                layer.msg('多属性组合商品，请勾选供应商包装')
                return false
            }
            if ($(attrStrDom).val() == '多属性组合' && packFee === '') {
                // 没有勾选供应商包装    
                isEmpty = true
                layer.msg('请填写供应商包装费用')
                return false
            }
        })

        if (data.logisAttrList?.indexOf('液体(0-15ml)') > -1 || data.logisAttrList?.indexOf('液体(>15ml)') > -1) {
            if (data.liquidNetContentMl === '' || data.liquidNetContentMl === undefined) {
                isEmpty = true
                layer.msg('请填写液体净含量(ml)')
                return false
            }
            if (!/^[1-9]\d*$/.test(data.liquidNetContentMl)) {
                isEmpty = true
                layer.msg('液体净含量(ml)必须是大于0的整数')
                return false
            }
        }
        if(isEmpty) return false
        // if (data.liquidNetContentMl !== '' && data.liquidNetContentMl !== undefined) {
        let prodSInfoExtends = {
            liquidNetContentMl: data.liquidNetContentMl
        }
        data.prodSInfoExtends = prodSInfoExtends
        delete data.liquidNetContentMl
        // }
        
        ajaxToaddOrUpdateSSProd(data)
        return false
    }

    function ajaxToaddOrUpdateSSProd(data) {
        loading.show()
        $.ajax({
            type: 'post',
            url: ctx + '/product/addOrUpdateSSProd',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(data),
            success: function(returnData) {
                loading.hide()
                if (returnData.code === '0000') {
                    if (data.id) {
                        layer.closeAll()
                        refreshTable()
                    } else {
                        $('#addSSkuForm [name=sSku]').val('')
                        $('#addSSkuForm [name=style]').val('')
                        var inps = $('#addSSkuForm [name=logisAttrList]')
                        for (var i = 0; i < inps.length; ++i) {
                            inps[i].checked = false
                        }
                        $('#addSSkuForm [name=suttleWeight]').val('')
                        $('#addSSkuForm #totalWeight').val('')
                        form.render('checkbox')
                    }
                    if (returnData.msg) {
                        layer.msg('子商品添加/修改成功,' + returnData.msg,{icon: 7, backgroundColor: 'green'})
                    } else {
                        layer.msg('子商品添加/修改成功,',{icon:1})
                    }
                } else {
                    layer.msg(returnData.msg,{icon: 2})
                }
            },
            error: function() {
                loading.hide()
                layer.msg('发送请求失败')
            }
        })
    }
    //自定义验证规则
    form.verify({
        uniqueOrg: function(value, item) {
            var id = $(item).closest('form').find('input[name=\'id\']').val()
            var isUnique = true
            $.ajax({
                type: 'post',
                url: ctx + '/sys/checkOrgNameUnique.html',
                data: { 'orgName': value, 'id': id },
                dataType: 'json',
                async: false,
                success: function(returnData) {
                    if (returnData.code != '0000') {
                        //此处return不起作用
                        isUnique = false
                    }
                }
            })
            if (!isUnique) {
                return '组织名称已存在'
            }
        },
        unique: function(value, item) {
            var id = $(item).closest('form').find('input[name=\'id\']').val()
            var isUnique = true
            $.ajax({
                type: 'post',
                url: ctx + '/sys/checkLoginNameUnique.html',
                data: { 'loginName': value, 'id': id },
                dataType: 'json',
                async: false,
                success: function(returnData) {
                    if (returnData.code != '0000') {
                        //此处return不起作用
                        isUnique = false
                    }
                }
            })
            if (!isUnique) {
                return '登录名已存在'
            }
        },
        checkPwd: function(value, item) {
            var loginPwd = $(item).closest('form').find('input[name=\'loginPwd\']').val()
            if (loginPwd != value) {
                return '两次输入密码不一致'
            }
        },
        leaderOnly: function(value, item) {
            var id = $(item).closest('form').find('input[name=\'id\']').val()
            var orgId = $(item).closest('form').find('select option:selected').val()
            var isLeader = item.checked
            var isUnique = true
            if (isLeader) {
                $.ajax({
                    type: 'post',
                    url: ctx + '/sys/checkOrgLeader.html',
                    data: { 'id': id, 'orgId': orgId, 'isLeader': isLeader },
                    dataType: 'json',
                    async: false,
                    success: function(returnData) {
                        if (returnData.code != '0000') {
                            //此处return不起作用
                            isUnique = false
                        }
                    }
                })
                if (!isUnique) {
                    return '部门主管已存在，只能有一位'
                }
            }
        }
    })

    /***供应商信息表的增删 */
    function supplierInfoTble(ifList) {
        //点击新增按钮
        $('.addOneLine_productlist').click(function() {
                addsupplierTbody(null, ifList)
            })
            //监听input获取焦点事件
        // $('.supplierRefTab_productlist tbody').on('focus input propertychange', '.supplierInfo', function () {
        //         searchSupplier(this)
        //     })
        //     //监听input失去焦点事件
        // $('.supplierRefTab_productlist tbody').on('blur', '.supplierInfo', function () {
        //     var self = this
        //     // 置空
        //     window.setTimeout(function () {
        //         let supplierIdInp = $(self).closest('tr').find('input[supplierId]')
        //         let originSupplierId = supplierIdInp.attr('origin-data')
        //         supplierIdInp.val('')
        //         // 找到id
        //         var li = $(self).next().find('li')
        //         var value = $(self).val()
        //         if (!value) {
        //             return
        //         }
        //         var id
        //         for (var i = 0; i < li.length; ++i) {
        //             if (li[i].innerText == value) {
        //                 id = li[i].getAttribute('supplierid')
        //             }
        //         }
        //
        //         // 隐藏可选列表
        //         hideSupplierUl(self)
        //         if (!id) {
        //             layer.msg('无该供应商')
        //             return
        //         }
        //         $(self).closest('tr').find('[supplierId]').val(id)
        //
        //         // 若果更换了供应商，清空匹配信息
        //         if (id !== originSupplierId) {
        //             clearMatch_productlist(self)
        //         }
        //     }, 500);
        // });
        // 监听采购url是否变更 offerId
        $('.supplierRefTab_productlist tbody').on('blur', '.supplier_purchaseurl', function () {
            let self = this
            // 获取当前行的匹配情况
            let offerId = $(self).closest('tr').find('[offerId]').val()
            if (!offerId) {
                return
            }
            let url = self.value
            let curOfferId = getOfferIdByPurchaseUrl(url)

            console.log(curOfferId)
            // 若更换了链接，清空匹配信息
            if (curOfferId !== offerId) {
                clearMatch_productlist(self)
            }
        });
    }

    //供应商移除按钮
    var removeBtn_supplier = '<button type="button" class="layui-btn layui-btn-danger layui-btn-sm ml5" onclick="supplierListRemove(this)" title="移除该供应商">移除</button>'

    var matchAli1688SkuInfo = '<button type="button" class="layui-btn layui-btn-normal layui-btn-sm" onclick="toMatch1688_productlist(this)" title="匹配1688信息">匹配</button>'

    var clearMatch = '<button type="button" class="layui-btn layui-btn-warm layui-btn-sm ml5" onclick="clearMatch_productlist(this)" title="清除匹配1688信息">清除</button>'
    var refreshAli1688SkuInfo = '<button type="button" class="layui-btn layui-btn-primary layui-btn-sm ml5" onclick="refreshAli1688SkuInfo_productlist(this)" title="更新可匹配的1688信息">更新</button>'
    var setDefaultBtn_productlistSupplier = '<button type="button" class="layui-btn layui-btn-primary layui-btn-sm ml5" onclick="setDefaultSupplier_productlist(this)" title="将该供应商设为默认供应商">设为默认</button>'

    form.on('checkbox(productlist_supplierRefTab_ifSupplierPack)', function(data){
        var checked = data.elem.checked;
        let elem = data.elem // 获取点击的元素
        // 当前行
        let tr = $(elem).closest('tr')
        // 当前行供应商包装费input
        let supplierPackFeeInp = tr.find('[supplierPackFee]')
        // 当前行仓库包装费input
        let stockPackFeeInp = tr.find('[stockPackFee]')
        if (checked) {
            supplierPackFeeInp.removeClass('disAbleInp')
            supplierPackFeeInp.removeAttr('readonly')
            stockPackFeeInp.addClass('disAbleInp')
            stockPackFeeInp.attr('readonly','readonly')
            stockPackFeeInp.val('')
        } else {
            stockPackFeeInp.removeClass('disAbleInp')
            stockPackFeeInp.removeAttr('readonly')
            supplierPackFeeInp.addClass('disAbleInp')
            supplierPackFeeInp.attr('readonly','readonly')
            supplierPackFeeInp.val('')
        }
        // 计算供应商报价
        productlist_calSupplierQuote(supplierPackFeeInp[0])
    })
    // 计算供应商报价
    productlist_calSupplierQuote = function (self) {
        // 当前行
        let tr = $(self).closest('tr')
        // 当前行供应商包装费input
        let supplierPackFeeInp = tr.find('[supplierPackFee]').val().trim()
        // 当前行供应商商品报价
        let prodPrice = tr.find('[prodPrice]').val().trim()
        let quote = accAdd(supplierPackFeeInp || 0, prodPrice || 0)
        tr.find('[quote]').val(quote)
    }
        /**
     * 新增一行供应商
     * @param sup 旧数据
     * @param ifList 是否批量修改
     * @param ifAdd 是否 新增商品操作
     */
    function addsupplierTbody(sup, ifList, ifAdd) {
        sup = sup || {}
        var tr = '<tr>'
        tr += '<input type="hidden" refId value="' + (sup.id || '') + '"><input type="hidden" url value="' + (sup.purchaseUrl || '') + '">'
        let provideIdentification = (sup.provideIdentification == true) ? "是" : sup.provideIdentification == false ? "否" : "";
        let ifDivision = (sup.ifDivision == true) ? "是" : sup.ifDivision == false ? "否" : "";
        if (ifList) {
            tr += '<td><div style="width:100%;position:relative">\
                <input supplierName readonly placeholder="根据链接自动填充" type="text" class="layui-input supplierInfo disAbleInp" value="' + (sup.supplierName || '') + '">\
                <ul class="supplierUl productlistSearch"></ul>\
                </div></td>\
                <td><input purchaseUrl onblur="getSupplierInfo(this)" type="text" class="layui-input" value="' + (sup.purchaseUrl || '') + '" style="float: left;width: 99%"><span class="relativeContains"><a onclick="redirectTo(this)" target="_blank" style="height: 32px;line-height: 32px; cursor:pointer"><i style="font-size:12px" class="layui-icon layui-icon-lianjie"></i></a></span></td>\
                <td><input minOrderNum type="text" class="layui-input" value="' + (sup.minOrderNum || '') + '"></td>\
                <td><input quote type="text" readonly class="layui-input disAbleInp" value="' + (sup.quote || '') + '"></td>\
                <td><input articleNo type="text" class="layui-input" value="' + (sup.articleNo || '') + '"></td>\
                <td><input purBaseNum type="text" class="layui-input" value="' + (sup.purBaseNum || '') + '"></td>\
                <td><input prodPrice type="text" class="layui-input" value="' + (sup.prodPrice || '') + '" onblur="productlist_calSupplierQuote(this)"></td>\
                <td><input ifSupplierPack type="checkbox" class="layui-input" lay-skin="primary" ' + (sup.ifSupplierPack ? 'checked' : '') + ' lay-filter="productlist_supplierRefTab_ifSupplierPack"></td>\
                <td><input supplierPackFee type="text" onblur="productlist_calSupplierQuote(this)" class="layui-input'+ (sup.ifSupplierPack ? '':' disAbleInp') +'" '+ (sup.ifSupplierPack ? '':'readonly') +' value="' + (sup.supplierPackFee != null ? sup.supplierPackFee : '') + '"></td>\
                <td><input stockPackFee type="text" class="layui-input'+ (sup.ifSupplierPack ? ' disAbleInp':'') +'" '+ (sup.ifSupplierPack ? 'readonly':'') +' value="' + (sup.stockPackFee != null ? sup.stockPackFee : '') + '"></td>\
                <td><input note type="text" class="layui-input" value="' + (sup.note || '') + '"></td>\
                <td><input ifDefault type="checkbox" disabled lay-skin="primary" ' + (sup.ifDefault ? 'checked' : '') + '/></td>\
                <td><input supplierId origin-data="' + (sup.supplierId || '') + '" type="hidden" class="layui-input" value="' + (sup.supplierId || '') + '">' + removeBtn_supplier + setDefaultBtn_productlistSupplier + '</td>'
        } else{
            tr += '<td><div style="width:100%;position:relative">\
                    <input supplierName readonly placeholder="根据链接自动填充" type="text" class="layui-input supplierInfo disAbleInp" value="' + (sup.supplierName || '') + '">\
                    <ul class="supplierUl productlistSearch"></ul>\
                </div>\
            </td>\
            <td><div title="' + ((sup.urlValid != null && sup.urlValid == false) ? '链接已经失效' : '') + '"><input purchaseUrl type="text" maxlength="1000" onblur="getSupplierInfo(this, `#addSSkuForm`)" class="layui-input supplier_purchaseurl ' + ((sup.urlValid != null && sup.urlValid == false) ? 'fRed' : '') + '"  value="' + (sup.purchaseUrl || '') + '" style="float: left;width: 99%"><span class="relativeContains"><a onclick="redirectTo(this)" target="_blank" style="height: 32px;line-height: 32px; cursor:pointer"><i style="font-size:12px" class="layui-icon layui-icon-lianjie"></i></a></span></div></td>\
            <td><input minOrderNum type="text" class="layui-input" value="' + (sup.minOrderNum || '') + '"></td>\
            <td><input quote type="text" readonly class="layui-input disAbleInp" value="' + (sup.quote || '') + '"></td><td class="provideidentification">'+provideIdentification+ '</td><td class="ifDivision">'+ifDivision+'</td>\
            <td><input articleNo type="text" class="layui-input" value="' + (sup.articleNo || '') + '"></td>\
            <td><input purBaseNum type="text" placeholder="正数" class="layui-input" value="' + (sup.purBaseNum || '') + '"></td>\
            <td><input prodPrice type="text" placeholder="正数" class="layui-input" value="' + (sup.prodPrice || '') + '" onblur="productlist_calSupplierQuote(this)"></td>\
            <td><input ifSupplierPack type="checkbox" class="layui-input" lay-skin="primary" ' + (sup.ifSupplierPack ? 'checked' : '') + ' lay-filter="productlist_supplierRefTab_ifSupplierPack"></td>\
            <td><input supplierPackFee type="text" onblur="productlist_calSupplierQuote(this)"  class="layui-input'+ (sup.ifSupplierPack ? '':' disAbleInp') +'" '+ (sup.ifSupplierPack ? '':'readonly') +' value="' + (sup.supplierPackFee != null ? sup.supplierPackFee : '') + '"></td>\
            <td><input stockPackFee type="text" class="layui-input'+ (sup.ifSupplierPack ? ' disAbleInp':'') +'" '+ (sup.ifSupplierPack ? 'readonly':'') +' value="' + (sup.stockPackFee != null ? sup.stockPackFee : '') + '"></td>\
            <td><input note type="text" class="layui-input" maxlength="200" value="' + (sup.note || '') + '"></td>\
            <td class="attrStr"><input attrStr readonly type="text" class="layui-input disAbleInp" onmouseleave="removeTip(this,500)" data-tipId="" onmouseenter="showPurchaseTable(this)" value="' + (sup.attrStr || '') + '"/><input hidden offerId value="' + (sup.offerId || '') + '"/><input hidden specId value="' + (sup.specId || '') + '"/></td>\
            <td><input ifDefault type="checkbox" disabled lay-skin="primary" ' + (sup.ifDefault ? 'checked' : '') + '/></td>\
            <td><input supplierId origin-data="' + (sup.supplierId || '') + '" type="hidden" class="layui-input" value="' + (sup.supplierId || '') + '">' + matchAli1688SkuInfo + refreshAli1688SkuInfo + clearMatch + removeBtn_supplier + setDefaultBtn_productlistSupplier + '</td>'
        }
        tr += '</tr>'
        $('.supplierRefTab_productlist tbody').append(tr)
        form.render('checkbox', 'prodSupplierRef_productlistDetailPop')
    }

    setDefaultSupplier_productlist = function(self) {
        var tbody = $(self).closest('tbody')

        var defaultBox = tbody.find('[ifDefault]') // 所有默认checkbox
        var tr = $(self).closest('tr') // 当前行 的jquery对象

        for (var i = 0; i < defaultBox.length; i++) {
            defaultBox[i].checked = false
        }
        tr.find('[ifDefault]').prop('checked', true)
        form.render('checkbox', 'prodSupplierRef_productlistDetailPop')
    }

    refreshAli1688SkuInfo_productlist = function(self) {
        var tr = $(self).closest('tr')
        var url = tr.find('[purchaseUrl]').val()
        if (!url) {
            layer.msg('请先填写采购URL')
            return
        }
        if (url.indexOf('https://detail.1688.com/offer/') < 0 &&url.indexOf('https://item.taobao.com') < 0 &&url.indexOf('https://detail.tmall.com/item.htm') < 0) {
            layer.msg('请先填写1688或淘宝链接(1688链接必须要以https://detail开头，淘宝链接以https://item.taobao.com 或者 https://detail.tmall.com/item.htm开头)')
            return
        }
        var offerId = url.substring(url.indexOf('/offer/') + 7, url.indexOf('.html'))
        var data = {
            offerIdStr: offerId,
            purchaseUrl: url
        }
        loading.show()
        $.ajax({
            type: 'post',
            url: ctx + '/product/refreshAli1688SkuInfo.html',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    layer.msg('更新成功')
                } else {
                    layer.msg(res.msg)
                }
            },
            complete: function() {
                loading.hide()
            }
        })
    }

    clearMatch_productlist = function(self) {
        var tr = $(self).closest('tr')
        var refId = tr.find('[refId]').val()
        if (refId) {
            loading.show()
            var data = { idList: [refId] }
            $.ajax({
                type: 'post',
                url: ctx + '/product/clear1688Info.html',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function(res) {
                    loading.hide()
                    if (res.code === '0000') {
                        tr.find('[offerId]').val('')
                        tr.find('[attrStr]').val('')
                        tr.find('[specId]').val('')
                        let matchIndex = $(tr).index()
                        subChooseInfo[matchIndex] = {}
                    } else {
                        layer.msg(res.msg)
                    }
                },
                complete: function() {
                    loading.hide()
                }
            })
        } else {
            tr.find('[offerId]').val('')
            tr.find('[attrStr]').val('')
            tr.find('[specId]').val('')
            let matchIndex = $(tr).index()
            subChooseInfo[matchIndex] = {}
        }
    }

    toMatch1688_productlist = function(self, type) {
        var tr = $(self).closest('tr')
        var url = tr.find('[purchaseUrl]').val()
        if (!url) {
            layer.msg('请先填写采购URL')
            return
        }
        if (url.indexOf('https://detail.1688.com/offer/') < 0&&url.indexOf('https://item.taobao.com') < 0 && url.indexOf('https://detail.tmall.com/item.htm') < 0) {
            layer.msg('请先填写1688或淘宝或天猫链接(1688链接必须要以https://detail开头，淘宝链接以https://item.taobao.com开头，天猫链接以https://detail.tmall.com/item.htm 开头)')
            return
        }
        var data = {
            purchaseUrl: url
        }
        loading.show()
        $.ajax({
            type: 'post',
            url: ctx + '/product/getSkuInfoFrom1688.html',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    var aliSkuInfoList = res.data
                    var style = $('#addSSkuForm [name=style]').val()
                        // 单品类商品 自动匹配
                    if (aliSkuInfoList.length == 1) {
                        if (!aliSkuInfoList[0].specId) {
                            layer.msg('检测到该链接为无属性商品，已为您自动匹配')
                            set1688Attr(tr, aliSkuInfoList[0])
                            return
                        }

                        var confirmIndex = layer.confirm('已为你自动匹配到1688属性【' + aliSkuInfoList[0].attrStr + '】,是否匹配该商品', { btn: ['就是他了', '容我三思'] },
                            function() {
                                let matchIndex = $(tr).index()
                                subChooseInfo[matchIndex] = {}
                                if (type === 'update') {
                                    let subChooseInfo1 = JSON.parse(localStorage.getItem('subChooseInfo1'))
                                    subChooseInfo1[matchIndex] = {}
                                    localStorage.setItem('subChooseInfo1', JSON.stringify(subChooseInfo1))
                                }
                                set1688Attr(tr, aliSkuInfoList[0])
                                $(tr).find('[attrStr]').css({'color': 'black'})
                                layer.close(confirmIndex)
                            },
                            function() {
                                showAll1688SkuInfo(type, aliSkuInfoList, tr)
                                layer.close(confirmIndex)
                            }
                        )
                        return
                    }

                    // 多品类商品，先自动匹配款式和1688商品属性相同的商品
                    for (var i = 0; i < aliSkuInfoList.length; ++i) {
                        if (aliSkuInfoList[i].attrStr == style) { // 如果能自动匹配到，confirm 是否选择。如果否  展示所有
                            var confirmIndex = layer.confirm('已为你自动匹配到1688属性【' + aliSkuInfoList[i].attrStr + '】,是否匹配该商品', { btn: ['就是他了', '容我三思'] },
                                function() {
                                    let matchIndex = $(tr).index()
                                    subChooseInfo[matchIndex] = {}
                                    if (type === 'update') {
                                        let subChooseInfo1 = JSON.parse(localStorage.getItem('subChooseInfo1'))
                                        subChooseInfo1[matchIndex] = {}
                                        localStorage.setItem('subChooseInfo1', JSON.stringify(subChooseInfo1))
                                    }
                                    set1688Attr(tr, aliSkuInfoList[i])
                                    $(tr).find('[attrStr]').css({'color': 'black'})
                                    layer.close(confirmIndex)
                                },
                                function() {
                                    showAll1688SkuInfo(type, aliSkuInfoList, tr)
                                    layer.close(confirmIndex)
                                }
                            )
                            return
                        }
                    }
                    // 如果不能自动匹配到，展示所有
                    showAll1688SkuInfo(type, aliSkuInfoList, tr)
                } else {
                    layer.msg(res.msg)
                }
            },
            complete: function() {
                loading.hide()
            }
        })
    }

    /**
     *  设置1688属性
     * @param tr 所选的供应商 行对象
     * @param skuInfo  匹配的1688商品信息
     */
    function set1688Attr(tr, skuInfo) {
        $(tr).find('[minordernum]').val(skuInfo.minOrderQuantity || '')
        $(tr).find('[articleNo]').val(skuInfo.articleNo)
        $(tr).find('[attrStr]').val(skuInfo.attrStr)
        $(tr).find('[offerId]').val(skuInfo.offerId)
        $(tr).find('[specId]').val(skuInfo.specId)
    }

    /**
     * 展示所有1688商品信息，以供选择
     * @param aliSkuInfoList 1688商品信息
     * @param tr  要设置的供应商行对象
     * @param backtodo  点击保存后，进行的回调方法
     */

    function showAll1688SkuInfo(type, aliSkuInfoList, tr, backtodo, origin='') {
        let matchIndex = $(tr).index()
        if (!aliSkuInfoList || aliSkuInfoList.length == 0) {
            layer.msg('未找到该商品的1688信息')
            return false
        }
        var index = layer.open({
            title: '阿里sku信息',
            type: 1, //不加该属性,就会出现[object Object]
            resize: true,
            move: '.layui-layer-title',
            moveOut: true,
            area: ['85%', '95%'],
            id: 'addGroupListId',
            shadeClose: false,
            btn: ['保存', '关闭'],
            content: $('#ali1688SkuInfoShowPop').html(),
            success: function(layero, index) {
                var box = $('#ali1688SkuInfoBox')
                var radio
                ifMulSpec = false
                layui.laytpl($("#ali1688SkuInfoList").html()).render(aliSkuInfoList, function(html){
                    $('#ali1688SkuInfoBox').append(html)
                    layui.form.render()
                    if (origin === 'batchMatch') {
                        $('#mulSpecTips').hide()
                    }else {
                        $('#mulSpecTips').show()
                    }
                    // 阿里sku信息 选择多属性组合下单
                    layui.form.on('checkbox(ifMulSpec)', function(data){
                        if (data.elem.checked) {
                            $('.img-content1').find('[type=checkbox]:checked').prop('checked', false)
                            ifMulSpec = true
                            $('.purchaseCount').show()
                            $('.skuRadio').hide()
                            $('.skuRCheckbox').show()
                            form.render('checkbox')
                        } else {
                            $('.img-content1').find('[type=radio]:checked').prop('checked', false)
                            ifMulSpec = false
                            $('.purchaseCount').hide()
                            $('.skuRadio').show()
                            $('.skuRCheckbox').hide()
                            form.render('radio')
                        }
                    })
                });
                  
            },
            yes: function() {
                if (ifMulSpec) {    
                    let dom = $('#ali1688SkuInfoBox .skuRCheckbox [type=checkbox]:checked')
                    let subList = []
                    let isError = false
                    $(dom).each(function(index, item) {
                        let purBaseNum = $(item).parents('.img-content1').next('.purchaseCount').find('input').val()
                        if (purBaseNum == '') {
                            isError = true
                            layer.msg('请输入已勾选sku的采购基数')
                            return false
                        }
                        if (!isNumber(purBaseNum) || purBaseNum < 1) {
                            isError = true
                            layer.msg('采购基数需要大于0')
                            return false
                        }
                        let subObj = {
                            offerId: $(item).attr('offerId'),
                            specId: $(item).attr('specId'),
                            attrStr: $(item).attr('attrStr'),
                            purBaseNum,
                            price: $(item).attr('price')
                        }
                        subList.push(subObj)
                    })
                    if (isError) {
                        return false
                    }
                    // 当前行的多属性详情
                    let obj = {
                        ifMultiple: true,
                        subList
                    }
                    subChooseInfo[matchIndex] = obj
                    if (obj.subList?.length > 0) {
                        $(tr).find('[attrStr]').val('多属性组合')
                        $(tr).find('[attrStr]').css({'color': 'red'})
                    }
                    // 计算供应商商品报价
                    let supplierPriceAll = 0
                    obj.subList?.forEach(item => {
                        supplierPriceAll += Number(item.price * item.purBaseNum)
                    })
                    $(tr).find('[prodPrice]').val(supplierPriceAll.toFixed(2))
                    localStorage.setItem('ifMulSpec', ifMulSpec)
                    

                    if (type === 'update') {
                        let subChooseInfo1 = JSON.parse(localStorage.getItem('subChooseInfo1'))
                        subChooseInfo1[matchIndex] = obj
                        localStorage.setItem('subChooseInfo1', JSON.stringify(subChooseInfo1))
                    }
                } else {
                    subChooseInfo[matchIndex] = {}
                    if (type === 'update') {
                        let subChooseInfo1 = JSON.parse(localStorage.getItem('subChooseInfo1'))
                        subChooseInfo1[matchIndex] = {}
                        localStorage.setItem('subChooseInfo1', JSON.stringify(subChooseInfo1))
                    }
                    var selectedOne = $('#ali1688SkuInfoBox [type=radio]:checked')
                    var skuInfo = {
                        attrStr: selectedOne.attr('attrStr'),
                        offerId: selectedOne.attr('offerId'),
                        specId: selectedOne.attr('specId'),
                        articleNo: selectedOne.attr('articleNo'),
                        minOrderQuantity: selectedOne.attr('minOrderQuantity')
                    }
                    $(tr).find('[attrStr]').css({'color': 'black'})
                    set1688Attr(tr, skuInfo)
                    if (backtodo && typeof backtodo == 'function') {
                        backtodo(skuInfo)
                    }
                }
                
                layer.close(index)
            }
        })
    }

    //新增组合品弹出框
    $('#productlist_addGroupList').click(function() {
        layer.open({
            title: '新增组合品',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1360px', '90%'],
            id: 'addGroupListId',
            shadeClose: false,
            btn: ['保存', '关闭'],
            content: $('#addGroupListLayer').html(),
            yes: function(index, layero) {
                // 校验必填项
                if (!checkNotNull('#addCombForm')) {
                    return
                }
                submitComb()
            },
            success: function(layero, index) {
                // 初始化必填项
                initNotNull()
                    // 初始化增加1列组合明细
                var tr = newCombObj()
                $('#addCombForm #groupTable tbody').append(tr)
                    //1.获取父sku事件
                initPSkuEvent('#addCombForm')
                    //2. 表格增删
                comb_table()
                form.render()
                $('.isCreateHidden').hide()
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        return false; //阻止系统默认回车事件
                    }
                  };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            end: function() {
                $(document).off('keydown', this.enterEsc);
            }

        })
    })

    // 获取一个组合子sku行  complist为子SKU内容
    function newCombObj(complist) {
        if (!complist) {
            complist = {}
        }
        var prodDetailId = complist.prodDetailId ? complist.prodDetailId : ''
        var suttleWeight = complist.suttleWeight ? complist.suttleWeight : ''
        var purchaseCostPrice = complist.purchaseCostPrice ? complist.purchaseCostPrice : ''
        var isSale = complist.isSale != undefined ? complist.isSale : ''
        var sSku = complist.sSku ? complist.sSku : ''
        var prodDetailNums = complist.prodDetailNums ? complist.prodDetailNums : ''
        var logisAttrList = complist.logisAttrList ? complist.logisAttrList : ''
        var id = complist.id ? complist.id : ''
        var isOutOfStock = complist.isOutOfStock != undefined ? complist.isOutOfStock : ''
        var stock = complist.stock ? complist.stock : ''
        var occupyStock = complist.occupyStock ? complist.occupyStock : ''
        var availableStock = complist.availableStock ? complist.availableStock : ''
        var innerPackCost = complist.innerPackCost ? complist.innerPackCost : ''
        var liquidNetContentMl = complist.liquidNetContentMl || ''

        console.log('complist', complist)
            //html数组处理
        var tr_arr = '<tr>' +
            '<td><input type="hidden" value="' + prodDetailId + '" liquidNetContentMl="' + liquidNetContentMl + '" weight="' + suttleWeight + '" cost="' + purchaseCostPrice + '" isSale="' + isSale + '" logisAttrList="' + logisAttrList + '" isOutOfStock="' + isOutOfStock + '" stock="' + stock + '" occupyStock="' + occupyStock + '" innerPackCost="' + innerPackCost + '" availableStock="' + availableStock + '" class="layui-input">' +
            '<input type="text" oninput=searchSku(this,"ssku","#addCombForm","#groupTable")  onblur=getSSkuId(this,"#addCombForm","#groupTable") value="' + sSku + '" class="layui-input">' +
            '<ul class="supplierUl productlistSearch"></ul></td>' +
            '<td><input type="text" value="' + prodDetailNums + '" onblur="countCombWeightAndCost(\'#groupTable\',\'#addCombForm\');getTotalWeight(\'#packspectag_comb option:selected\', \'#addCombForm\', \'#totalWeight_comb\')" class="layui-input"></td>' +
            '<td><input type="hidden" value="' + id + '" class="layui-input" disabled><button type="button" class="layui-btn layui-btn-sm layui-btn-primary removeNew">移除</button></td>' +
            '</tr>'
        return tr_arr
    }

    /*组合品表格的处理事件:增删*/
    function comb_table() {
        //组合品新增按钮
        $('#addAline').click(function() {
            var $tr = newCombObj()
            $('#groupTable tbody').append($tr)
        })

        //组合品移除按钮
        $('#groupTable').on('click', '.removeNew', function() {
            if ($('#groupTable tbody tr').length === 1) return
            $(this).parents('tr').remove()
                // dealCombWeightAndCost("#addCombForm");
                // 重新计算重量  和成本
            countCombWeightAndCost('#groupTable', '#addCombForm')
            getTotalWeight('#packspectag_comb option:selected', '#addCombForm', '#totalWeight_comb')
            genLogisAttrAndSale()

        })
    }

    // 批量匹配1688信息
    $('#productlist_match1688Info').click(function() {
        var checkStatus = table.checkStatus('sProdTable'),
            data = checkStatus.data
        if (data.length == 0) {
            layer.msg('请至少选择1个商品')
            return
        }
        var supplierList = []
        for (var i = 0; i < data.length; ++i) {
            if (data[i].isCombination == 1) {
                layer.msg('请不要选择组合品')
                return
            }
            supplierList = supplierList.concat(data[i].supplier)
        }
        var popIndex = layer.open({
            title: '批量匹配1688信息',
            type: 1,
            area: ['85%', '90%'],
            id: 'toMatch1688InfoPop',
            btn: ['保存', '关闭'],
            content: $('#match1688InfoForListPop').html(),
            success: function(layero, index) {
                $('#autoMatch_Ali1688Info').click(function() {
                    toAutoMatch1688Info(false)
                })
                $('#autoMatchByLike_Ali1688Info').click(function() {
                    toAutoMatch1688Info(true)
                })
                $('#forceToAutoMatchByLike_Ali1688Info').click(function() {
                    toAutoMatch1688Info(false, true)
                })
                $('#clear1688Info_Ali1688Info').click(function() {
                    clear1688Info_Ali1688Info()
                })
                loading.show()
                $.ajax({
                    type: 'post',
                    url: ctx + '/product/get1688InfoForList.html',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(supplierList),
                    success: function(res) {
                        loading.hide()
                        if (res.code === '0000') {
                            console.log('matchData', data)
                            showMatchListTable(data, res.data)
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        layer.msg('服务出错了，请联系软件开发部解决问题')
                    }
                })
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        return false; //阻止系统默认回车事件
                    }
                  };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            yes: function(index, layero) {
                // 检查提交的数据 有无匹配到同一个offerId 和specId
                // var checkJson = {}
                // var id
                // var repeatArr = []
                //
                // for (var i = 0; i < toUpdateSupplierRefList.length; i++) {
                //     let refOne = toUpdateSupplierRefList[i]
                //     if (!refOne.attrStr) {
                //         continue
                //     }
                //     id = refOne.offerId + '-' + refOne.specId
                //     if (checkJson[id]) {
                //         repeatArr.push(checkJson[id].sSku)
                //         repeatArr.push(refOne.sSku)
                //     } else {
                //         checkJson[id] = refOne
                //     }
                // }
                // if (repeatArr.length > 0) {
                //     layer.alert('提交的数据中。存在重复匹配同一个1688商品的sku:' + repeatArr.join(','))
                //     return
                // }
                loading.show()
                $.ajax({
                    type: 'post',
                    url: ctx + '/product/toMatch1688InfoForList.html',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(toUpdateSupplierRefList),
                    success: function(res) {
                        loading.hide()
                        if (res.code === '0000') {
                            layer.msg('保存成功')
                            layer.close(popIndex)
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        layer.msg('服务出错了')
                    }
                })
            },
            end: function() {
                $(document).off('keydown', this.enterEsc);
              }
        })

    })

    function clear1688Info_Ali1688Info() {
        for (let i = 0; i < toUpdateSupplierRefList.length; ++i) {
            toUpdateSupplierRefList[i].specId = ''
            toUpdateSupplierRefList[i].attrStr = ''
            toUpdateSupplierRefList[i].articleNo = ''
        }
        renderMatchTable(toUpdateSupplierRefList)
    }

    function getOfferIdByPurchaseUrl(purchaseUrl) {
        if (!purchaseUrl) {
            return ''
        }
        if (purchaseUrl.indexOf('https://detail.1688.com/offer/') > -1) {
            return purchaseUrl.substring(purchaseUrl.indexOf('offer/') + 6, purchaseUrl.indexOf('.html'))
        } else if (purchaseUrl.indexOf('https://detail.tmall.com/item.htm') > -1 || purchaseUrl.indexOf('https://item.taobao.com/item.htm') > -1) {  
        return getParamMapFromUrl(purchaseUrl)['id']
        }
    }

    // 展现需匹配的供应商ref
    function showMatchListTable(data, matchData) {
        // 封装数据
        var supplierList = []
        var supplier, subSupplierRefList, j
        for (var i = 0; i < data.length; ++i) {
            subSupplierRefList = data[i].supplier
            for (j = 0; j < subSupplierRefList.length; ++j) {
                supplier = {
                    id: subSupplierRefList[j].id,
                    prodId: data[i].id,
                    supplierId: subSupplierRefList[j].supplierId,
                    supplierName: subSupplierRefList[j].supplierName,
                    sSku: data[i].sSku,
                    style: data[i].style,
                    purchaseUrl: subSupplierRefList[j].purchaseUrl,
                    offerId: getOfferIdByPurchaseUrl(subSupplierRefList[j].purchaseUrl),
                    specId: subSupplierRefList[j].specId,
                    attrStr: subSupplierRefList[j].attrStr,
                    articleNo: subSupplierRefList[j].articleNo,
                }
                supplierList.push(supplier)
            }
        }
        // 保存全局数据 以便后续调用
        Ali1688ProdInfoMatchData = matchData
        toUpdateSupplierRefList = supplierList
            // 渲染匹配表格
        renderMatchTable(supplierList)
    }

    /**
     * 批量匹配
     * @param ifLike 是否模糊匹配
     * @param ifForce 是否强制匹配
     */
    function toAutoMatch1688Info(ifLike, ifForce) {
        loop1: for (var i = 0; i < toUpdateSupplierRefList.length; ++i) {
            // 根据offerId 获取可匹配的1688信息列表
            let syncList = Ali1688ProdInfoMatchData[toUpdateSupplierRefList[i].offerId]
                // 如果不是强制匹配，且当前行已经有属性信息  或者无可匹配的数据。则略过
            if (!ifForce && (toUpdateSupplierRefList[i].attrStr || !syncList || syncList.length == 0)) {
                continue
            }
            loop2: for (var j = 0; j < syncList.length; ++j) {
                let syncInfoMatched = syncList[j]
                // 如果非模糊匹配，则要求商品的款式 === 1688信息的属性
                if (!ifLike && toUpdateSupplierRefList[i].style == syncInfoMatched.attrStr) {
                    toUpdateSupplierRefList[i].offerId = syncInfoMatched.offerId
                    toUpdateSupplierRefList[i].specId = syncInfoMatched.specId
                    toUpdateSupplierRefList[i].attrStr = syncInfoMatched.attrStr
                    toUpdateSupplierRefList[i].minOrderNum = syncInfoMatched.minOrderQuantity                       
                    toUpdateSupplierRefList[i].articleNo = syncInfoMatched.articleNo
                    continue loop1
                } else if (ifLike) {
                    // 如果是模糊匹配， 则用 “-” 分割1688信息的属性。 逐一判断 商品的款式中是否包含 这些属性值。 只要有1个不包含，则判定匹配不上
                    let attrStrList = syncInfoMatched.attrStr.split('-')
                    for (let k = 0; k < attrStrList.length; ++k) {
                        if (toUpdateSupplierRefList[i].style.indexOf(attrStrList[k]) < 0) {
                            continue loop2
                        }
                    }
                    toUpdateSupplierRefList[i].offerId = syncInfoMatched.offerId
                    toUpdateSupplierRefList[i].specId = syncInfoMatched.specId
                    toUpdateSupplierRefList[i].attrStr = syncInfoMatched.attrStr
                    toUpdateSupplierRefList[i].minOrderNum = syncInfoMatched.minOrderQuantity
                    toUpdateSupplierRefList[i].articleNo = syncInfoMatched.articleNo
                    continue loop1
                }
            }
        }
        renderMatchTable(toUpdateSupplierRefList)
        loading.hide()
    }

    // 渲染匹配表格
    function renderMatchTable(supplierList) {
        table.render({
            elem: '#match1688InfoForListTable',
            method: 'post',
            data: supplierList,
            cols: [
                [
                    { field: 'sSku', title: '子Sku', width: 150 },
                    { field: 'style', title: '款式' },
                    { field: 'supplierName', title: '供应商', width: 200 },
                    {
                        title: '采购Url',
                        width: 200,
                        templet: '<div class="notOverShow"><a target="_blank" class="notOverShow" href="{{d.purchaseUrl}}">{{d.purchaseUrl}}</a></div>'
                    },
                    { title: '1688属性', templet: '#ali1688InfoBox' },
                    { title: '操作', align: 'center', toolbar: '#matchAli1688ForListToolBar' }
                ],
            ],
            id: 'match1688InfoForListTable',
            page: false,
            limit: supplierList.length
        })
    }

    table.on('tool(match1688InfoForListTable)', function(obj) {
        var layEvent = obj.event //获得 lay-event 对应的值
        var data = obj.data //获得当前行数据
        var tr = obj.tr // 当前数据行对象
        var index = obj.tr.attr('data-index') // 当前数据的序列号

        if (layEvent === 'match') {
            var syncProdList = Ali1688ProdInfoMatchData[data.offerId]
            var updateDataForGlobal = function(info) {
                toUpdateSupplierRefList[index].offerId = info.offerId
                toUpdateSupplierRefList[index].specId = info.specId
                toUpdateSupplierRefList[index].attrStr = info.attrStr
                toUpdateSupplierRefList[index].minOrderQuantity = info.minOrderQuantity
                toUpdateSupplierRefList[index].articleNo = info.articleNo
            }
            showAll1688SkuInfo('', syncProdList, tr, updateDataForGlobal, 'batchMatch')
        } else if (layEvent === 'del') {
            toUpdateSupplierRefList.splice(index, 1)
            renderMatchTable(toUpdateSupplierRefList)
        }
    })

    //打印功能
    printProductList('productlist_printData')
    var printData

    function printProductList(dom) {
        $('#' + dom).on('click', function() {
            var checkDatas = table.checkStatus('sProdTable').data
            if (!checkDatas.length) {
                return layer.msg('请先选择需要打印的数据!')
            }
            let prodSInfoIds = checkDatas.map(e => e.id)
            request.sendAjax('/product/judgeFineShop.html', JSON.stringify({
                prodSInfoIds
            }), res => {
                let fineShopProdSInfoIds = res.data
                printData = []
                for (let i = 0; i < checkDatas.length; i++) {
                    const item = checkDatas[i]
                    const obj = {}
                    obj.printNumber = 1 //标签打印次数，弹框可修改
                    obj.prodUnit = item.unit //单位
                    obj.prodName = item.title //名称
                    obj.weight = accAdd(item.suttleWeight, (item.packWeight ? item.packWeight : 0)) //毛重
                    obj.develop = item.parent.bizzOwner //开发
                    obj.prodSSku = item.sSku //子SKU
                    obj.prodStyle = item.style //款式
                    obj.prodPSku = item.parent.pSku //父sku
                    obj.inPackType = item.inPackType
                        //商品名称--> 名称+款式
                    if (obj.prodStyle && obj.prodStyle != '') {
                        obj.prodName = obj.prodName + ' (' + obj.prodStyle + ')'
                    }
                    if (item.inPackType == null) {
                        obj.inPackType = ''
                    }
                    if (fineShopProdSInfoIds.length > 0) {
                        if (fineShopProdSInfoIds.find(e => +e === +item.id) !== undefined) {
                            obj.devTypeLabel = '精铺'
                        }
                    }
                    printData.push(obj)
                }

                //modify by zhaoyd 20191011
                //打开打印确认弹框
                var contentHtml
                laytpl($('#pl_printLabelData').html()).render(printData, function(html) {
                    contentHtml = html
                })
                layer.open({
                    title: '打印SKU标签',
                    type: 1,
                    area: '50%',
                    content: contentHtml,
                    success: function(layero, index) {
                        form.verify({
                                printNumber: function(printNumber) {
                                    if (printNumber < 1 || printNumber > 300) {
                                        return '打印数量最小1，最大300'
                                    }
                                }
                            })
                            //监听提交
                        form.on('submit(pl_printLabelDataFormFilter)', function(data) {
                            if (data.elem.id == 'pl_printLabelDataLarge') {
                                epeanPrint_plugin_fun(3, getPrintLabelData(1)) //打印100*40的sku标签 商品大标签
                                //循环请求数据,然后打印
                                // let printReqData = getNewPrintParamsForPdList(checkDatas);
                                // let printResData = commonGetPrintDataByLoopRequest(printReqData);
                                // Promise.all(printResData).then(res => {
                                //   let printParams = [];
                                //   for(let i=0; i<res.length; i++){
                                //     let item = res[i];
                                //     if(typeof(item) == 'string'){
                                //       return layer.msg(item, {icon:7});
                                //     }else{
                                //       let obj = {};
                                //       obj.printType = 19;
                                //       obj.labelUrl = item.labelUrl;
                                //       obj.width = item.width;
                                //       obj.height = item.height;
                                //       obj.printName = item.printName;
                                //       // logistics_label_pdf_print(obj);
                                //       printParams.push(obj);
                                //     }
                                //   }
                                //   commonExecutePrintJobs(printParams);
                                // })
                            } else {
                                // epeanPrint_plugin_fun(4, getPrintLabelData(0)) //打印60*15的sku标签 商品小标签
                                let printReqData = getNewPrintParamsForPdList(checkDatas);
                                let printResData = commonGetPrintDataByLoopRequest(printReqData);
                                Promise.all(printResData).then(res => {
                                  let printParams = [];
                                  for(let i=0; i<res.length; i++){
                                    let item = res[i];
                                    if(typeof(item) == 'string'){
                                      return layer.msg(item, {icon:7});
                                    }else{
                                      let obj = {};
                                      obj.printType = 19;
                                      obj.labelUrl = item.labelUrl;
                                      obj.width = item.width;
                                      obj.height = item.height;
                                      obj.printName = item.printName;
                                      // logistics_label_pdf_print(obj);
                                      printParams.push(obj);
                                    }
                                  }
                                  commonExecutePrintJobs(printParams);
                                })
                            }
                            return false
                        })
                    },
                })
            })

        })
    }

    function getNewPrintParamsForPdList(data) {
      //赋值
      let printParamsList =[];
      $('#pl_printLabelDataForm input[name=printNumber]').each(function() {
          let printNumber = $(this).val()
          let index = $(this).data('index')
          if (printNumber < 1) {
              printNumber = 1
          }
          if (printNumber > 300) {
              printNumber = 300
          }
          let item = data[index];
          let obj = {};
          obj.printNum = printNumber;
          obj.storageNum = printNumber;
          // 这个页面不要仓库id
          // obj.warehouseId = item.defaultDlvrWhId;
          // 加补打标
          obj.addFlag = true
          obj.prodSId = item.id;
          printParamsList.push(obj);
      })
      return printParamsList;
    }


    function getPrintLabelData(printType) {
        var datas = []
            //赋值
        $('#pl_printLabelDataForm input[name=printNumber]').each(function() {
            var printNumber = $(this).val()
            var index = $(this).data('index')
            if (printNumber < 1) {
                printNumber = 1
            }
            if (printNumber > 300) {
                printNumber = 300
            }
            var data = printData[index]
            data.printNumber = printNumber
            if (printType == 0) { //小标签
                data.printerName = '6515' //调用的打印机名称
            } else if (printType == 1) { //大标签
                data.printerName = '10040' //调用的打印机名称
            }
            datas.push(data)
        })
        if (datas.length < 1) {
            return
        }
        return datas
    }

    //移除
    $('body').on('click', '#pl_removeLabelRowData', function() {
            $(this).parents('tr').remove()
        })
        //批量设置
    $('body').on('click', '#pl_editPrintNumberBatchBtn', function() {
        $('#pl_editPrintNumberBatchInput').val('')
        $('#pl_printLabelDataForm .printNumberTh-text').hide()
        $('#pl_printLabelDataForm .printNumberTh-edit').show()
        $('#pl_editPrintNumberBatchInput').focus()
    })
    $('body').on('blur', '#pl_editPrintNumberBatchInput', function() {
        var printNumber = $('#pl_editPrintNumberBatchInput').val()
        if (printNumber != '' && (printNumber < 1 || printNumber > 300)) {
            layer.msg('打印数量必须是1-300', { icon: 0 })
            return
        }
        if (printNumber) {
            $('#pl_printLabelDataForm input[name=printNumber]').val(printNumber)
        }
        $('#pl_printLabelDataForm .printNumberTh-edit').hide()
        $('#pl_printLabelDataForm .printNumberTh-text').show()
    })

    // 导入志愿
    $('#productlist_importValunteer').click(function() {
        $('#productlist_valunteerFile').click()
    })

    $('#productlist_valunteerFile').on('change', function() {
        var files = $('#productlist_valunteerFile')[0].files
            // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf('.')
        var extension = fileName.substring(seat).toLowerCase()
        if (extension != '.xlsx' && extension != '.xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData()
        formData.append('file', files[0])
        layer.confirm('确认导入这个志愿文件吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/salerVolunteer/importExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(res) {
                        $('#productlist_valunteerFile').val('')
                        loading.hide()
                        res = JSON.parse(res)
                        if (res.code == '0000') {
                            var Adata = { batchNo: res.data }
                            layer.msg('导入成功，开始下载结果')
                            window.setTimeout(function() {
                                submitForm(Adata, ctx + '/salerVolunteer/exportEnrollResult.html', '_blank')
                            }, 100)
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#productlist_valunteerFile').val('')
                    }
                })
            },
            function() {
                layer.closeAll()
            }
        )
    })

})

//-layui  end

var warehouseName
var prodSId
var countDate
    
var salesThis;
var gloabalSalceCountList
let platCodeSort = ['全平台', 'aliexpress', 'ebay', 'ebay虚拟仓', 'shopee', 'lazada', 'tiktok', 'AE全托管', 'AE半托管', 'FBA', 'amazon直邮']
let platCodeSortAll = ['全平台','aliexpress', 'ebay', 'ebay虚拟仓', 'shopee', 'lazada', 'tiktok', 'AE全托管', 'AE半托管', 'FBA', 'amazon直邮',
'wish', 'joom', 'walmart', 'mercado', 'fyndiq', 'daraz', 'coupang', 'miravia', 'temu', 'shein自营']

function showSaleCountTab(self,saleCountList) {
    var layer = layui.layer,
        table = layui.table
    salesThis = self;
    var oldId = salesThis.getAttribute('data-tipId')
    prodSId = salesThis.getAttribute('data-prodSId')
    warehouseName = salesThis.getAttribute('data-warehouseName')
    if (oldId) {
        layer.close(oldId)
    }
    saleCountList = saleCountList || ''
    gloabalSalceCountList = JSON.parse(saleCountList)
    countDate = gloabalSalceCountList[0]?.countDate

    renderSalesTable(salesThis, gloabalSalceCountList, platCodeSort)
}

function expandTable(self) {
    let expandText = $(self).text()
    if (expandText === '>') { // 展开
        setSalesTableCol(gloabalSalceCountList, platCodeSortAll, function(col) {
            var layer = layui.layer,
            table = layui.table
            table.render({
                elem: "#saleCountPop_productListTable",
                id: "saleCountPop_productListTable",
                data: gloabalSalceCountList,
                cols: [
                    col
                ],
                page: false,
            });
        })
        $('.expandIcon').html('<')
    } else {
        setSalesTableCol(gloabalSalceCountList, platCodeSort, function(col) {
            var layer = layui.layer,
            table = layui.table
            table.render({
                elem: "#saleCountPop_productListTable",
                id: "saleCountPop_productListTable",
                data: gloabalSalceCountList,
                cols: [
                    col
                ],
                page: false
            });
        })
        $('.expandIcon').html('>')
    }
}

function setSalesTableCol(saleCountList, platCodeList, callback) {
    let col = [
        { field: "countDay", title: "统计天数", width: 70 },
        { title: "统计时间", templet: '<div>{{format(d.countDate,"yyyy-MM-dd")}}</div>', width: 100 },
    ]
    if (saleCountList.length > 0) {
        for (let i = 0; i < platCodeList.length; ++i) {
            let platCode = platCodeList[i]
            col.push({ field: "saleNum_" + platCode, title: `<span style="cursor: pointer" class="testEl" onclick="showCountrySales(this)">${platCode}</span>`, templet: '<div>{{d.platCodeAndSalesMap["'+ platCode +'"] || 0}}</div>' })
        }
    }
    callback && callback(col)
}

function renderSalesTable(salesThis, saleCountList, platCodeList) {
    setSalesTableCol(saleCountList, platCodeList, function(col) {
        var layer = layui.layer,
        table = layui.table
        var tipsIndex = layer.open({
            type: 4,
            shade: 0,
            area: ['1350px', '250px'],
            tips: [1, 'rgba(5,5,5,0.4)'],
            isOutAnim: false,
            content: [$('#saleCountPop_productList').html(), salesThis], //数组第二项即吸附元素选择器或者DOM
            success: function(layero) {
                table.render({
                    elem: "#saleCountPop_productListTable",
                    id: "saleCountPop_productListTable",
                    data: saleCountList,
                    cols: [
                        col
                    ],
                    page: false
                });
            }
        });
        salesThis.setAttribute('data-tipId', tipsIndex)
    })
}

function showCountrySales(self) {
    let plat = $(self).text() || ''
    // 只做直邮  FBA、仓发不需要
    if (['全平台', 'aliexpress', 'ebay'].includes(plat) || !plat) return
    loading.show()
    $.ajax({
        url: ctx + '/product/queryPlatCountrySalesCount',
        type: 'POST',
        data: JSON.stringify({
            platCode: plat,
            warehouseName,
            prodSId
        }),
        contentType:'application/json',
        success: function(res) {
            loading.hide()
            let list = res.data || []
            let tableList = [{
                countDay: 7,
                countrySalesMap: {}
            },{
                countDay: 15,
                countrySalesMap: {}
            },{
                countDay: 30,
                countrySalesMap: {}
            }]
            // 处理数据格式
            let dayList = [7, 15, 30]
            list?.forEach(cItem => {
                tableList.forEach(item => {
                    item.countDate = countDate
                    item.shippingCountryCode = cItem.shippingCountryCode
                    item.countrySalesMap[cItem.shippingCountryCode] = cItem['sales' + item.countDay]
                })
            })
            let col = [
                { field: "countDay", title: "统计天数", width: 70 },
                { title: "统计时间", templet: '<div>{{format(d.countDate,"yyyy-MM-dd")}}</div>', width: 100 },
            ]
            // 处理数据 获取所有的国家列
            for (let i = 0; i < list?.length; ++i) {
                col.push({ title: list[i].countryCnName, templet: "<div>{{d.countrySalesMap[d.shippingCountryCode]}}</div>" })
            }
            list?.forEach(item => item.countDate = countDate)
            var layer = layui.layer,
                table = layui.table
                var tipsIndex = layer.open({
                    type: 4,
                    shade: 0,
                    area: ['1200px', '250px'],
                    tips: [1, 'rgba(5,5,5,0.4)'],
                    isOutAnim: false,
                    content: [$('#countrySaleCountPop_productList').html(), salesThis], //数组第二项即吸附元素选择器或者DOM
                    success: function() {
                        table.render({
                            elem: "#countrySaleCountPop_productListTable",
                            id: "countrySaleCountPop_productListTable",
                            data: tableList,
                            cols: [
                                col
                            ],
                            page: false,
                        });
                    }
                });
                salesThis.setAttribute('data-tipId', tipsIndex)
        },
        error: function() {
            loading.hide()
        }
    })
}

function checkIfLeave(userName) {
    if (leavedUserStr_productlist && leavedUserStr_productlist.indexOf('||' + userName + '||') >= 0) {
        return true
    }
    return false
}

function searchSku(t, type, fSelector, tSelector) {
    var that = t
    if (!($(t).val().trim())) {
        return
    }
    $.ajax({
        url: ctx + '/product/skuLikeSearch.html',
        type: 'post',
        data: { sku: $(t).val(), 'type': type },
        success: function(returnData) {
            var data = returnData.data
            if (t == document.activeElement) { // 判断鼠标是否扔聚焦于该input
                //字符串拼接
                var prodStr = ''
                for (var i = 0; i < data.length; i++) {
                    var prod = data[i]
                    if (type == 'psku') {
                        prodStr += '<li id="' + prod.id + '" class="dimResultDivItem">' + prod.pSku + '</li>'
                    } else {
                        prodStr += '<li id="' + prod.id + '" class="dimResultDivItem">' + prod.sSku + '</li>'
                    }
                }
                var ul = $(that).next('ul')
                ul.empty()
                ul.append(prodStr)
                    //样式设置
                ul.css('display', 'block')
                var lis = $(that).next('ul').find('li')
                lis.mouseenter(function() {
                    $(this).css({ backgroundColor: '#009688', color: '#fff' })
                })
                lis.mouseleave(function() {
                    $(this).css({ backgroundColor: '', color: '' })
                })

                lis.on('click', function() {
                        $(that).val($(this).text())
                        ul.css('display', 'none')
                    })
                    // //li的点击事件
                    // for (var j = 0; j < lis.length; j++) {
                    //     var $li = $(lis[j]);
                    //     $li.on('click',function() {
                    //         $(that).val($(this).text());
                    //         ul.css('display', 'none');
                    //         ul.empty();
                    //     })
                    // }
                    //判断input是否为空
                if ($(that).val() == '') {
                    ul.empty()
                }

            }
        }
    })
}

/*组合品处理函数start*/
var combTotalWeight = 0
var combPurchaseCost = 0

function getSSkuId(t, formSelector, tableSelector) {
    // 为了防止其直接以 选中前的值进行查询， 设置延时0.1s
    window.setTimeout(function() {
        $(t).next().hide()
        if (!($(t).val().trim())) {
            return
        }
        $.ajax({
            type: 'post',
            url: ctx + '/product/getSProd.html',
            data: { 'sSku': $(t).val().trim(), 'tempSSku': '' },
            dataType: 'json',
            success: function(returnData) {
                if (returnData.code == '0000' && returnData.data != undefined) {
                    if (typeof(returnData.data.id) == undefined || returnData.data.id == '') {
                        layer.msg('子SKU不存在!')
                        return
                    }

                    $(t).prev().val(returnData.data.id)
                    $(t).prev().attr('weight', returnData.data.suttleWeight)
                    $(t).prev().attr('cost', returnData.data.purchaseCostPrice)
                    $(t).prev().attr('logisAttrList', returnData.data.logisAttrList)
                    $(t).prev().attr('isSale', returnData.data.isSale)
                    $(t).prev().attr('isOutOfStock', returnData.data.isOutOfStock)
                    $(t).prev().attr('stock', returnData.data.stock)
                    $(t).prev().attr('occupyStock', returnData.data.occupyStock)
                    $(t).prev().attr('liquidNetContentMl', returnData.data.liquidNetContentMl)
                    $(t).prev().attr('availableStock', returnData.data.availableStock)
                    $(t).prev().attr('innerPackCost', returnData.data.innerPackCost)

                    genLogisAttrAndSale()
                    countCombWeightAndCost(tableSelector, formSelector)
                    getTotalWeight('#packspectag_comb option:selected', '#addCombForm', '#totalWeight_comb')
                } else {
                    layer.msg(returnData.msg)
                }
            }
        })
    }, 300)
}


function countCombWeightAndCost(tableSelector, formSelector) {
    combTotalWeight = 0
    combPurchaseCost = 0
    combInnerPackCost = 0
    combTotalMl = null
    $(tableSelector + ' tbody').find('tr').each(function() {
        var tdArr = $(this).children()
        var skucost = tdArr.eq(0).find('input[type="hidden"]').attr('cost') //采购成本
        var innerPackCost = tdArr.eq(0).find('input[type="hidden"]').attr('innerPackCost') //内包装成本
        innerPackCost = innerPackCost ? innerPackCost : 0
        var skuweight = tdArr.eq(0).find('input[type="hidden"]').attr('weight') //重量
        var liquidNetContentMl = tdArr.eq(0).find('input[type="hidden"]').attr('liquidNetContentMl') || 0 //重量
        var skuNum = tdArr.eq(1).find('input').val()
        if (skuNum == '' || skuNum == undefined) {
            // layer.msg("请填写数量");
            return
        }
        if (skucost == '' || skuweight == '') {
            layer.msg('数据异常,无法计算重量和成本价')
            return
        }
        combTotalWeight = accAdd(combTotalWeight, accMul(parseFloat(skuweight), skuNum))
        if (liquidNetContentMl) {
            combTotalMl= accAdd(combTotalMl || 0, accMul(parseFloat(liquidNetContentMl), skuNum))
        }
        combPurchaseCost = accAdd(combPurchaseCost, accMul(parseFloat(skucost), skuNum))
        combInnerPackCost = accAdd(combInnerPackCost, accMul(parseFloat(innerPackCost), skuNum))
    })
    $(formSelector + ' input[name=\'suttleWeight\']').val(combTotalWeight)
    $(formSelector + ' input[name=\'liquidNetContentMl\']').val(combTotalMl)
    $(formSelector + ' input[name=\'purchaseCostPrice\']').val(combPurchaseCost)
    $(formSelector + ' input[name=\'innerPackCost\']').val(combInnerPackCost)
}

// 生成组合品的物流属性和在售状态
function genLogisAttrAndSale() {
    var form = layui.form
    $('#logisAttr_comb [name=\'logisAttrList\']').prop('checked', false)
    $('#addCombForm [name=\'isSale\']').prop('checked', false)
    var combLogisAttr = {}
    var combIsSale = true
    var combIsOutOfStock = false
    var combSkuTrs = $('#groupTable tbody tr')
    if (!combSkuTrs) {
        return
    }
    var currentTds // 当前行的 列
    var currentLogisAttrStr // 当前行的物流属性
    var currentLogisAttrArr
    var currentIsSale // 当前行的在售状态
    var currentIsOutOfStock // 当前行的在售状态
    for (var i = 0; i < combSkuTrs.length; ++i) {
        currentTds = combSkuTrs.eq(i).find('td')
        currentLogisAttrStr = currentTds.eq(0).find('input[type="hidden"]').attr('logisAttrList') //物流属性
        currentIsSale = currentTds.eq(0).find('input[type="hidden"]').attr('isSale')
        currentIsOutOfStock = currentTds.eq(0).find('input[type="hidden"]').attr('isOutOfStock')
        if (!currentIsSale || currentIsSale == 'false') {
            combIsSale = false
        }
        if (currentIsOutOfStock == 'true') {
            combIsOutOfStock = true
        }
        if (!currentLogisAttrStr) {
            continue
        }
        currentLogisAttrArr = currentLogisAttrStr.split(',')
        for (var j = 0; j < currentLogisAttrArr.length; ++j) {
            combLogisAttr[currentLogisAttrArr[j]] = true
        }
    }

    var logisAttrCheckboxs = $('#logisAttr_comb [name=\'logisAttrList\']')

    let logisAttrNum = 0;
    for (let logistAttr in combLogisAttr) {
        logisAttrNum++
    }
    for (let logistAttr in combLogisAttr) {
        if (logisAttrNum > 1 && logistAttr === '普货') {
            continue
        }
        let attrName = logistAttr.replace(/[()>≤]/g, function(match) {
            switch (match) {
                case '(' : return '\\('
                case ')' : return '\\)'
                case '>' : return '\\>'
                case '≤' : return '\\≤'
            }
        })
        $('#logisAttr_comb [name=logisAttrList][value='+ attrName +']')[0].checked = true
    }

    if (!combIsSale) {
        $('#addCombForm input[name=\'isSale\']').prop('checked', true)
    }
    if (combIsOutOfStock) {
        $('#addCombForm input[name=\'isOutOfStock\']').prop('checked', true)
    }
    form.render('checkbox')
}

/*组合品处理函数end*/

//新增新品供应商信息表格移除按钮事件
function supplierListRemove(obj) {
    let index = $(obj).parents('tr').index()
    $(obj).parents('tr').remove()
    subChooseInfo?.splice(index, 1)
}

//审核
function auditSub() {
    var layer = layui.layer
    var prodId = $('#addSSkuForm input[name=\'id\']').val()
    var pass = $('#pl_auditResult').val()
    var auditDesc = $('#pl_auditDesc').val()
    if (!pass) {
        layer.msg('请选择审核结果')
        return
    }
    sendAudit(prodId, pass, auditDesc)
}

function auditComb() {
    var layer = layui.layer
    var prodId = $('#addCombForm input[name=\'id\']').val()
    var pass = $('#pl_auditResult_comb').val()
    var auditDesc = $('#pl_auditDesc_comb').val()
    if (!pass) {
        layer.msg('请选择审核结果')
        return
    }
    sendAudit(prodId, pass, auditDesc)
}

function sendAudit(prodId, pass, auditDesc) {
    if (typeof(prodId) == undefined || pass.trim() == '') {
        layer.msg('参数错误!')
        return
    }
    if (!pass) {
        layer.msg('请选择审核结果')
        return
    }
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/product/auditSub.html',
        type: 'post',
        dataType: 'json',
        data: { 'id': prodId, 'pass': pass == '3', 'auditDesc': auditDesc },
        success: function(returnData) {
            loading.hide()
            if (returnData.code == '0000') {
                layer.closeAll()
                refreshTable()
                layer.msg('审核成功')
            } else {
                layer.msg(returnData.msg)
            }
        },
        error: function() {
            loading.hide()
            layer.msg('发送请求失败')
        }
    })
}

// 跳转页面
function redirectTo(obj) {
    var layer = layui.layer
    var url = $(obj).parent().prev().val()
    var reg = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
    var re = new RegExp(reg)
    if (url) {
        if (re.test(url)) {
            window.open(url)
            return
        } else {
            layer.msg('请输入正确的网址 例如:http://baidu.com')
        }
    }
}

// 计算含包装重量和 包装价格
function getTotalWeight(selectedOption, formSelector, id) {
    var mm = selectedOption

    // var unitCost = $(mm).attr('cost');
    var packWeight = $(mm).attr('weight')
    if (!packWeight) { // 如果未选择包装规格，则不继续计算
        return
    }
    // $(formSelector + " input[name='innerPackCost']").val(unitCost);
    $(formSelector + ' input[name=\'packWeight\']').val(packWeight)
    var skuWeight = $(formSelector + ' input[name=\'suttleWeight\']').val()
    var totalWeight
    if (skuWeight != '') {
        totalWeight = accAdd(parseFloat(skuWeight), parseFloat(packWeight))
        $(id).val(totalWeight)
    }
}

function searchSupplier(t) {
    var that = t
    if (!that.value) {
        return
    }
    $.ajax({
        url: ctx + '/prodSupplier/searchSupplier.html',
        type: 'post',
        data: { name: $(t).val() },
        success: function(data) {
            $(that).next('ul').empty()
                //字符串拼接
            var suppliers = ''
            for (var i = 0; i < data.length; i++) {
                var supplieri = data[i].supplier;
                suppliers += `<li supplierId="${data[i].id}" class="dimResultDivItem"  data-provideidentification="${(data[i].provideIdentification == true) ? "是" : data[i].provideIdentification == false ? "否" : ""}" data-ifdivision="${(data[i].ifDivision == true) ? "是" : data[i].ifDivision == false ? "否" : ""}">${supplieri}</li>`;
            }
            var ul = $(that).next('ul');
            ul.empty();
            ul.append(suppliers);

            //样式设置
            ul.css('display', 'block');
            var lis = $(that).next('ul').find('li');
            lis.mouseover(function () {
                $(this).css({ background: '#009688', color: '#fff' });
            });
            lis.mouseout(function () {
                $(this).css({ background: '', color: '' })
            });
                //li的点击事件
            lis.click(function () {
                let provideIdentification = $(this).attr('data-provideidentification');
                let ifDivision = $(this).attr('data-ifdivision');
                $(that).val($(this).text());
                $(that).closest('tr').find('[supplierId]').val($(this).attr('supplierId'))
                // $(that).attr('data-provideIdentification', $(this).attr('data-provideIdentification'));
                // $(that).attr('data-ifDivision', $(this).attr('data-ifDivision'));
                $(that).closest('tr').find('.provideidentification').text(provideIdentification);
                $(that).closest('tr').find('.ifDivision').text(ifDivision);
                ul.css('display', 'none')
            });
                //判断input是否为空
            if ($(that).val() == '') {
                $(that).next('ul').empty();
                $(that).closest('tr').find('.ifDivision').text('');
                $(that).closest('tr').find('.provideidentification').text('');
            }


        }
    })
}

function hideSupplierUl(t) {
    window.setTimeout(function() {
        $(t).next().hide()
    }, 500)
}

// 展示商品日志
function getProdLog(url, id, selector) { //url getProdAuditLog getProdOperLog
    if (typeof(id) == undefined) {
        return
    }
    $.ajax({
        type: 'post',
        url: ctx + '/product/' + url + '.html',
        data: { 'sid': id },
        // async: false,
        dataType: 'json',
        success: function(returnData) {
            if (returnData.code != '0000') {
                layer.msg(returnData.msg, { icon: 5 })
            } else {
                var prodLogs = returnData.data
                for (var i in prodLogs) {
                    var tr = '<tr>'
                    prodLogs[i].operDesc = prodLogs[i].operDesc.replace(/\n/g, '<br/>')
                    if (typeof(prodLogs[i].operNote) == 'undefined') {
                        prodLogs[i].operNote = ''
                    }
                    tr += '<td>' + layui.admin.Format(prodLogs[i].operTime, 'yyyy-MM-dd hh:mm:ss') + '</td><td>' + prodLogs[i].operator + '</td><td>' + prodLogs[i].operDesc + '</td>'
                    if (selector == '#pl_auditLogTbody') {
                        tr += '<td>' + prodLogs[i].operNote + '</td>'
                    }
                    tr += '</tr>'
                    $(selector).append(tr)
                }
            }
        },
        error: function() {
            layer.msg('发送请求失败')
        }
    })
}

/**
 * 计算抛重
 */
function countThrowWeight(self) {
    var layer = layui.layer
    var dataForm = $(self).closest('form')
    var length = dataForm.find('[name=outerBoxLength]').val()
    var width = dataForm.find('[name=outerBoxWidth]').val()
    var height = dataForm.find('[name=outerBoxHeight]').val()

    if (!length || !width || !height) {
        dataForm.find('[name=throwWeight]').val(0)
        return
    }
    try {
        length = parseFloat(length)
        width = parseFloat(width)
        height = parseFloat(height)
    } catch (e) {
        layer.msg('请输入数字')
    }
    var throwWeight = accDiv(accMul(accMul(length, width), height), 6).toFixed(2)
    dataForm.find('[name=throwWeight]').val(throwWeight)
}

/**
 * 绑定采购成本-第一供应商采购成本
 * @param self
 */
function bind2Value(self) {
    var selfval = $(self).val()
    var dataForm = $(self).closest('form')
    dataForm.find('.supplierRefTab_productlist tbody tr:eq(0) [quote]').val(selfval)
}

function toSetImg(self) {
    $(self).next().click()
}

function ajaxToUpdateImg(self) {
    var self = $(self)
    var files = self[0].files
    var formData = new FormData()
    if (files.length > 0) {
        formData.append('file', files[0])
    } else {
        return
    }
    formData.append('id', self.attr('data-id'))
    loading.show()
    $.ajax({
        url: ctx + '/product/updateImg.html',
        type: 'POST',
        // async : false,
        data: formData,
        // 告诉jQuery不要去处理发送的数据
        processData: false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType: false,
        success: function(data) {
            self.val('')
            loading.hide()
            if (data.code == '0000') {
                self.prev().attr('src', data.data)
                self.prev().addClass('img_show_hide')
                layer.msg('图片设置成功')
            } else {
                layer.msg(data.msg)
            }
        },
        error: function() {
            loading.hide()
        }
    })
}

//根据屏幕尺寸决定是否添加类名productlist_header_button
(function() {
    var screenWidth = window.screen.width
    if (screenWidth < 1600) {
        $('#LAY-work-develop-pl').find('.productlist_header_button').addClass('productlist_header_button_smallScreen')
    } else {
        $('#LAY-work-develop-pl').find('.productlist_header_button').removeClass('productlist_header_button_smallScreen')
    }
})()

function productlist_getCustomCode(self) {
    self.value = self.value.replace(new RegExp(/( )/g), '')
    let desc = self.value.trim()
    $.ajax({
        type: 'post',
        url: ctx + '/product/getCustomCode.html',
        data: { desc: desc },
        // async: false,
        dataType: 'json',
        success: function(res) {
            if (res.code === '0000') {
                $(self).closest('form').find('[name=customsCode]').val(res.data)
            }
        }
    })
}

// 如果子SKU开头是FAMZ，默认发货仓库改为  亚马逊跟卖仓
function getDefAmazonWarehouse(data) {
    var form = layui.form
    var _list = $('#wareHouseTag option').map(function() {
        return $(this).text()
    }).get()
    if (data.indexOf('FAMZ') == 0 && _list.indexOf('亚马逊跟卖仓') != '-1') {
        $('#wareHouseTag').find('option:contains("亚马逊跟卖仓")').prop('selected', true)
        form.render()
    }
}


function setChooseRadio(obj) {
    let checkDom = $(obj).parent('.img-content1').find('[name=skuCheck]')
    let isChecked = $(checkDom).prop('checked')
    $(obj).parent('.img-content1').find('[name=skuCheck]').prop('checked', !isChecked)
    layui.form.render('radio')
    layui.form.render('checkbox')
}

function getSupplierInfo(self,addSkuFormId) { //https://detail.1688.com/offer/637018304717.html
    // 非1688链接不查询
    let purchaseUrl = self.value || $(self).val()
    
    // 清空供应商的一些数据
    // 最小订货量，供应商报价，采购基数，供应商商品报价，1688属性，下单备注
    // 如果原先是供应商包装的，需要再移除供应商包装和供应商包装费用
    let tr = $(self).parents('tr')
    let url = $(tr).find('[url]').val()
    if ((purchaseUrl && url !== purchaseUrl)) {
      $(tr).find('[minOrderNum]').val('')
      $(tr).find('[quote]').val('')
      $(tr).find('[purBaseNum]').val('')
      $(tr).find('[prodPrice]').val('')
      $(tr).find('[attrstr]').val('')
      $(tr).find('[note]').val('')
      if ($(tr).find('[ifsupplierpack]').prop('checked')) {
        $(tr).find('[ifsupplierpack]').prop('checked', false)
        // 供应商包装false 供应商包装费用disabled
        $(tr).find('[supplierpackfee]').val('')
        $(tr).find('[supplierpackfee]').attr('readonly', true)
        $(tr).find('[supplierpackfee]').addClass('disAbleInp')
        $(tr).find('[stockpackfee]').attr('readonly', false)
        $(tr).find('[stockpackfee]').removeClass('disAbleInp')
      }
      layui.form.render()
    }

    if (!purchaseUrl.trim() || (purchaseUrl.indexOf('https://detail.1688.com/offer/') < 0
        && purchaseUrl.indexOf('https://item.taobao.com/item.htm') < 0 && purchaseUrl.indexOf('https://detail.tmall.com/item.htm') < 0
        )) {
        return
    }
    // 判断是否有采购员
    let buyerElem
    if (addSkuFormId) {
        let addSkuForm = $(addSkuFormId)
        buyerElem = addSkuForm.find('[name=buyer]')
    }
    try {
        oneAjax.post({
            url: '/product/getSupplierByPurchaseUrl'
            ,data: purchaseUrl
            ,success: function (res) {
                if (res.code === '0000') {
                    // 渲染采购员
                    if (buyerElem) {
                        buyerElem.val(res.data.buyer)
                    }
                    // 渲染供应商id、名称
                    let trElm = $(self).closest('tr')
                    trElm.find('[supplierName]').val(res.data.supplier)
                    trElm.find('[supplierId]').val(res.data.id)
                } else {
                    layui.layer.msg('根据链接查询采购员失败:' + res.msg)
                }
            }
        },null,true)
    } catch (e){
        console.log(e)
    }
}

function changePurchaseNum(obj) {
    $(obj).attr("value",$(obj).val())
}

function showPurchaseTable(self, type = '') {
    let list = JSON.parse(localStorage.getItem('subChooseInfo1'))
    let curIndex = $(self).parents('tr').index()
    let tableData = type === 'update' ? list[curIndex]?.subList : subChooseInfo[curIndex]?.subList
    let ifMultipleSku = type === 'update' ? list[curIndex]?.ifMultiple : subChooseInfo[curIndex]?.ifMultiple

    if (!ifMultipleSku || tableData?.length === 0) return
    let layer = layui.layer,
        table = layui.table
    let col = [
        { field: "attrStr", title: "1688属性", width: 300 },
        { field: "purBaseNum", title: "采购基数", width: 150 },
        { field: "price", title: "采购单价", width: 150 },
    ]
    var tipsIndex = layer.open({
        type: 4,
        shade: 0,
        area: ['700px', '250px'],
        tips: [1, 'rgba(5,5,5,0.4)'],
        isOutAnim: false,
        content: [$('#subSkuPop_product').html(), self], //数组第二项即吸附元素选择器或者DOM
        success: function() {
            table.render({
                elem: "#subSkuPop_productTable",
                id: "subSkuPop_productTable",
                data: tableData,
                cols: [
                    col
                ],
                limit: Number.MAX_SAFE_INTEGER,
                page: false,
            });
        }
    });
    self.setAttribute('data-tipId', tipsIndex)
}

function checktNumPositive(self) {
    let value = $(self).val()
    if(value && !/^\d+(\.\d+)?$/.test(value)){
        layer.msg('只能输入正数');
        $(self).val('')
    }
}