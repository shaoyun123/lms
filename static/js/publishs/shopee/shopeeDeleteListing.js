layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate', 'upload'], function () {
    var formSelects = layui.formSelects,
        laydate = layui.laydate,
        form = layui.form,
        formSelects = layui.formSelects
    upload = layui.upload;

    form.render()
    laydate.render({
        elem: '#shopeeDeleteListingTime',
        range: true
    });

    var shopeeDel = {
        // 商品状态，当选择在线全部库存为0和在线全部停售时，清空商品状态
        clearGoodsStatus: function () {
            formSelects.value('prodStatuses', [])
        },
        // 当商品状态为被禁或者已暂时下架时，在线全部库存为0和在线全部停售为未选中状态
        clearIsSaleAndAllStockZero: function () {
            $('#shopeeDeleteListingForm').find('input[name="isSale"]').prop('checked', false)
            $('#shopeeDeleteListingForm').find('input[name="allStockZero"]').prop('checked', false)
            form.render()
        }
    }

    //初始化shopee站点下拉框
    shopeeDeleteListing_initShopeeSite();

    function shopeeDeleteListing_initShopeeSite () {
        getDataShopeeDeleteListingSite().then(function (result) {
            commonRenderSelect("shopeeDeleteListingSiteAndStoreSelect", result.siteList, {
                name: 'name',
                code: 'code'
            }).then(() => formSelects.render("shopeeDeleteListingSiteAndStoreSelect"))
        })
    }

    //初始化shopee店铺下拉框
    function shopeeDeleteListing_initShopeeStore () {
        getDataShopeeDeleteListingStore().then(function (result) {
            commonRenderSelect("shopeeDeleteListingSiteAndStoreSelect", result, {
                name: 'storeAcct',
                code: 'id'
            }).then(() => formSelects.render("shopeeDeleteListingSiteAndStoreSelect"))
        })
    }

    // 商品标签
    shopeeDeleteListing_initProductLabelList()
    function shopeeDeleteListing_initProductLabelList(){
        commonReturnPromise({
            url: '/lms/shopee/onlineProductShopee/getShopeeOnlineEnum.html'
        }).then(res=>{
            const arr = (res.productLabelList || []).map(v=>({
                value:v.name,
                name: v.name
            }))
            formSelects.data("shopee_delete_prodAttrList",'local',{arr})
        })
    }

    form.on('select(shopeeDeleteListingSiteAndStoreFilter)', function (data) {
        if (data.value == 1) { // 站点
            shopeeDeleteListing_initShopeeSite()
        } else if (data.value == 2) { // 店铺
            shopeeDeleteListing_initShopeeStore()
        }
    });

    // 商品状态，当选择在线全部库存为0和在线全部停售时，清空商品状态
    form.on('checkbox(shopeeDelListingAllStockZero)', function (data) {
        !!data.value && shopeeDel.clearGoodsStatus()
    })

    form.on('checkbox(shopeeDelListingIsSale)', function (data) {
        !!data.value && shopeeDel.clearGoodsStatus()
    })

    formSelects.on('prodStatuses', function (id, vals, val, isAdd, isDisabled) {
        isAdd && (val.value == 'BANNED' || val.value == 'UNLIST') && shopeeDel.clearIsSaleAndAllStockZero()
    }, true)

    // 导出
    $("#shopeeDeleteListingExportSiteDeleteLimit").click(function () {
        window.location.href = ctx + '/static/excel/shopee_delete_item.xlsx'
    })

    var fileFormData = new FormData();
    // 导入
    //选完文件后不自动上传
    upload.render({
        elem: '#shopeeDeleteListingImportSiteDeleteLimit'
        , url: '' //此处配置你自己的上传接口即可
        , accept: 'file' //允许上传的文件类型
        , exts: 'xlsx',
        auto: false,
        choose: function (obj) {
            //将每次选择的文件追加到文件队列
            var files = obj.pushFile();
            //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
            obj.preview(function (index, file, result) {
                if (file) {
                    fileFormData.append("deleteNumFile", file)
                    $("#shopeeDeleteListingForm span[name=deleteNumFileName]").text(file.name)
                    layer.msg("导入成功", { icon: 1 })
                    $('#shopeeDeleteListingImportSiteDeleteLimit').next().val('')
                }
            });
        }
    });

    // 删除listing
    $("#shopeeDeleteListingImmediatelyBtn").click(function () {
        shopeeDeleteListingDelete_del(false)
    })

    function shopeeDeleteListingDelete_del(confirmTemporarilyOffShelf){
        let formData = serializeObject($('#shopeeDeleteListingForm'))
        formData.isHistorySales = formData.isHistorySales == "true" ? true : false
        formData.isZeroViews = formData.isZeroViews == "true" ? true : false
        formData.isZeroLikes = formData.isZeroLikes == "true" ? true : false
        formData.isBanned = formData.isBanned == "true" ? true : false
        formData.isSale = formData.isSale == "true" ? 0 : ''
        formData.allStockZero = formData.allStockZero == "true" ? 1 : ''
        // 数据校验
        // console.log(fileFormData.deleteNumFile)
        if (!formData.shopeeDeleteListingSiteAndStoreSelect && $("#shopeeDeleteListingForm span[name=deleteNumFileName]").text() == '') {
            layer.alert("你还未选择站点或店铺或文件", { icon: 7 })
            return;
        }
        if (!formData.zeroRecentSales) {
            layer.alert("你还未选择销量筛选条件", { icon: 7 })
            return;
        }
        if(formData.isHistorySales){
            if(formData.historySales==='') return layer.alert("请填写销量", { icon: 7 })
            formData.historySales = Number(formData.historySales)
            if(formData.historySales<0 || formData.historySales>50){
                layer.alert("历史销量≤必须填写0或不大于50的正整数", { icon: 7 })
                return;
            }
        }else{
            delete formData.historySales
        }
        delete formData.isHistorySales
        if (!formData.prodStatuses && formData.isSale === '' && formData.allStockZero === '') {
            layer.alert("商品状态未选择，请选择", { icon: 7 })
            return;
        }
        // 选择在线必须选刊登时间
        if (formData.prodStatuses == 'NORMAL' && formData.shopeeDeleteListingTime == '') {
            layer.alert("商品状态为在线时,需选刊登时间", { icon: 7 })
            return;
        }

        formData.prodAttrList = formSelects.value('shopee_delete_prodAttrList', 'valStr')

        if (formData.shopeeDeleteListingSiteAndStoreFilter == 1) { // 站点
            formData.salesSites = formData.shopeeDeleteListingSiteAndStoreSelect
            // formData.salesSites = JSON.stringify(formData.shopeeDeleteListingSiteAndStoreSelect.split(","))
        } else { // 店铺
            formData.storeAcctIds = formData.shopeeDeleteListingSiteAndStoreSelect
            // formData.storeAcctIds = JSON.stringify(formData.shopeeDeleteListingSiteAndStoreSelect.split(",").map(Number))
        }
        if (formData.shopeeDeleteListingTime) {
            formData.listingTimeUpperBound = formData.shopeeDeleteListingTime.split(' - ')[1] + ' 23:59:59'
            formData.listingTimeLowerBound = formData.shopeeDeleteListingTime.split(' - ')[0] + ' 00:00:00'
        }

        // // 如果选择在线全部库存为0，在线全部停售，，商品状态为在线
        if (formData.isSale === 0 || formData.allStockZero === 1) {
            formData.prodStatuses = 'NORMAL'
        }

        // console.log(formData)

        for (let i in formData) {
            fileFormData.append(i, formData[i])
        }
        // 下架状态
        fileFormData.append('confirmTemporarilyOffShelf', confirmTemporarilyOffShelf)
        // 只选站点，有二次提示
        if (!formData.storeAcctIds&& $("#shopeeDeleteListingForm span[name=deleteNumFileName]").text() == '') {
            layer.confirm('未选中店铺或导入店铺额度，全部（站点内）你有权限的店铺均将执行删除任务，是否继续执行？', {icon: 3, title:'提示'}, function(index){
                layer.close(index);
                shopeeDeleteListingDelete_delApi()
              });
        }else{
            shopeeDeleteListingDelete_delApi()
        }
    }

    // 暂时下架
    $('#shopeeDeleteListingTemporarilyOffBtn').click(function(){
        shopeeDeleteListingDelete_del(true)
    })

    function shopeeDeleteListingDelete_delApi(){
        $.ajax({
            url: ctx + '/shopee/batch/item/delete',
            type: 'POST',
            data: fileFormData,                  // 上传formdata封装的数据
            dataType: 'JSON',
            cache: false,                      // 不缓存
            processData: false,               // jQuery不要去处理发送的数据
            contentType: false,               // jQuery不要去设置Content-Type请求头
            beforeSend: function () {
                loading.show() 
            },
            success: function (data) {
                loading.hide()          //成功回调
                if (data.code == "0000") {
                    layer.alert(data.msg || "执行成功", { icon: 1 });
                  } else {
                    if (data.msg.includes("deletedListing")) {
                      layer.alert(
                        "点击确定，下载excel，查看错误信息" || "操作失败",
                        { icon: 2, btn: ["下载excel"] },
                        function (index, layero) {
                          transBlob(
                            {
                              url: `/lms/shopee/voucher/downloadLog?filePath=${data.msg}&oldFileName=shopee_delete_listing.xlsx`,
                              fileName: "shopee_delete_listing.xlsx",
                            },
                            "get"
                          )
                            .then(function () {
                              layer.msg("下载开始", { icon: 1 });
                            })
                            .catch(function (err) {
                              layer.msg(err, { icon: 2 });
                            });
                        }
                      );
                    } else {
                      layer.alert(data.msg || "操作失败", { icon: 2 });
                    }
                  }
                $("#shopeeDeleteListingForm span[name=deleteNumFileName]").text("")
                fileFormData = new FormData(); // 清空formData的数据
            }, error: function (data) {
                loading.hide()
                fileFormData = new FormData(); // 清空formData的数据
                $("#shopeeDeleteListingForm span[name=deleteNumFileName]").text("")
                layer.alert(data.msg || "操作失败", { icon: 2 })
            }
        })
    }

    // 初始化站点的接口
    function getDataShopeeDeleteListingSite () {
        return commonReturnPromise({
            url: `/lms/shopee/onlineProductShopee/getShopeeOnlineEnum.html`,
            type: 'post'
        })
    }

    // 初始化店铺的接口
    function getDataShopeeDeleteListingStore () {
        return commonReturnPromise({
            url: ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html',
            params: {
                roleNames: 'shopee专员',
                orgId: '',
                salePersonId: '',
                platCode: 'shopee',
            },
        })
    }

    // // 立即执行的接口
    // //formData:
    // function getDataShopeeDeleteListingDelete(formData) {
    //     return commonReturnPromise({
    //         url: `/lms/shopee/batch/item/delete`,
    //         type: 'post',
    //         params: formData,
    //         contentType:false,
    //         processData:false,
    //         cache:false
    //         // enctype:"multipart/form-data"
    //         // contentType:"application/form-data"
    //     })
    // }

    // 下载模板
    function getDataShopeeDeleteListingDownloadTemplate () {
        return commonReturnPromise({
            url: `/lms/shopee/batch/item/delete/template/download`,
            type: 'get'
        })
    }

})
