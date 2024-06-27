/**
 * ebay V2促销 js
 */

layui.use(['form', 'layer', 'table', 'laypage', 'laydate', 'element', 'upload', 'laytpl'], function() {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        upload = layui.upload,
        laytpl = layui.laytpl,
        $ = layui.$;
    //全局信息
    //定时器,ajax error时判断是否关闭
    var timer = null;
    //用户拥有店铺
    var userStores = null;
    //ebay站点
    var ebaySites = null;
    //eBay产品类目
    var ebayProdCateCache = {};
    //eBay店铺类目
    var ebayStoreCateCache = {};
    //tree setting
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
    //选择指定商品---------选择添加的商品
    var selectedProduct = []
        //初始化加载
        //加载部门、人员、店铺
    render_hp_orgs_users("#ep2_searchForm");
    //加载用户拥有的店铺
    initUserStore();
    //加载eBay站点
    initEbaySite();
    //加载
    //初始化日期
    laydate.render({
        elem: '#ep2_searchForm input[name=startTime]',
        type: 'date',
        range: true
    });

    laydate.render({
        elem: '#ep2_searchForm input[name=endTime]',
        type: 'date',
        range: true
    });
    form.render();

    //功能
    //搜索表单提交
    form.on('submit(ep2_searchBtn)', function(formData) {
        var data = formData.field;
        //获取状态查询条件
        data.promotionStatus = getPromotionStatus();
        //日期处理
        if (data.startTime) {
            data.startTimeLeft = data.startTime.split(' - ')[0] + ' 00:00:00';
            data.startTimeRight = data.startTime.split(' - ')[1] + ' 23:59:59';
        }
        if (data.endTime) {
            data.endTimeLeft = data.endTime.split(' - ')[0] + ' 00:00:00';
            data.endTimeRight = data.endTime.split(' - ')[1] + ' 23:59:59';
        }
        //渲染表格
        table.render({
            elem: '#ep2_table',
            method: 'get',
            url: ctx + '/ebayMarketingDiscount/searchPromotion.html',
            where: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "名称", field: "promotionName" },
                    { title: "店铺", field: "storeAcctName" },
                    { title: "开始时间", field: "promotionStartTime", templet: '<div>{{Format(d.promotionStartTime,"yyyy-MM-dd hh:mm:ss")}}</div>' },
                    { title: "结束时间", field: "promotionEndTime", templet: '<div>{{Format(d.promotionEndTime,"yyyy-MM-dd hh:mm:ss")}}</div>' },
                    { title: "促销类型", field: "promotionType" },
                    { title: "促销内容", field: "discountRules", templet: '<div>{{layui.laytpl.getPromotionContent(d)}}</div>' },
                    { title: "状态", field: "promotionStatus" },
                    { title: "Items", field: "itemQuantity" },
                    { title: "Base sale", field: "baseSale", templet: '<div>{{layui.laytpl.getBaseSale(d)}}</div>' },
                    { title: "Promotion sale", field: "promotionSale", templet: '<div>{{layui.laytpl.getPromotionSale(d)}}</div>' },
                    { title: "Total sale", field: "totalSale", templet: '<div>{{layui.laytpl.getTotalSale(d)}}</div>' },
                    { title: "Sales lift (%)", field: "percentageSalesLift" },
                    { title: "Average order size", field: "averageOrderSize", templet: '<div>{{layui.laytpl.getAverageOrderSize(d)}}</div>' },
                    { title: "Display priority", field: "promotionPriority", templet: '<div>{{layui.laytpl.getPromotionPriority(d)}}</div>' },
                    { title: '操作', toolbar: '#ep2_tableBar', width: 80 }
                ]
            ],
            page: true,
            limits: [50, 100, 300],
            limit: 50,
            done: function(returnData) {
                //tab展示count
                // $('#ep2_promotionStatusTab ul .layui-this').find('span').text(returnData.count);
                if (returnData.extra) {
                    $('#ep2_promotionStatusTab li[data-index="DRAFT"]').find('span').text(returnData.extra.draftCount)
                    $('#ep2_promotionStatusTab li[data-index="RUNNING"]').find('span').text(returnData.extra.runningCount)
                    $('#ep2_promotionStatusTab li[data-index="PAUSED"]').find('span').text(returnData.extra.pausedCount)
                    $('#ep2_promotionStatusTab li[data-index="SCHEDULED"]').find('span').text(returnData.extra.scheduledCount)
                    $('#ep2_promotionStatusTab li[data-index="ENDED"]').find('span').text(returnData.extra.endedCount)
                    $('#ep2_promotionStatusTab li[data-index="DELETED"]').find('span').text(returnData.extra.deletedCount)
                    $('#ep2_promotionStatusTab li[data-index="ALL"]').find('span').text(returnData.extra.allCount)
                } else {
                    $('#ep2_promotionStatusTab li[data-index="DRAFT"]').find('span').text(0)
                    $('#ep2_promotionStatusTab li[data-index="RUNNING"]').find('span').text(0)
                    $('#ep2_promotionStatusTab li[data-index="PAUSED"]').find('span').text(0)
                    $('#ep2_promotionStatusTab li[data-index="SCHEDULED"]').find('span').text(0)
                    $('#ep2_promotionStatusTab li[data-index="ENDED"]').find('span').text(0)
                    $('#ep2_promotionStatusTab li[data-index="DELETED"]').find('span').text(0)
                    $('#ep2_promotionStatusTab li[data-index="ALL"]').find('span').text(0)
                }
                //处理编辑按钮展示隐藏
                var showClass = 'opt_' + data.promotionStatus.toLowerCase();
                $("#ep2_promotionStatusTab button[class*='opt_']").hide();
                $("#ep2_promotionStatusTab ." + showClass).show();
            }
        });
    });
    //监听表格工具栏
    table.on('tool(ep2_table)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event;
        if (layEvent === 'ep2_edit') {
            //编辑促销
            if (data.promotionType === 'VOLUME_DISCOUNT') {

            } else if (data.promotionType === 'ORDER_DISCOUNT') {

            } else if (data.promotionType === 'MARKDOWN_SALE') {

            }
            createOrSavePromotion(data.promotionType, data);
        } else if (layEvent === 'ep2_delete') {
            //删除促销
            deletePromotion(data.id);
        } else if (layEvent === 'ep2_pause' || layEvent === 'ep2_run') {
            //暂停
            var id = data.id;
            var promotionStatus;
            if (layEvent === 'ep2_pause') {
                promotionStatus = 'PAUSED'
            } else {
                promotionStatus = 'RUNNING'
            }
            //请求
            initAjax('/ebayMarketingDiscount/pauseOrResumePromotion.html', 'POST', { id: id, promotionStatus: promotionStatus }, function(returnData) {
                $('#ep2_searchBtn').click();
                layer.msg("促销状态修改成功")
            }, 'application/x-www-form-urlencoded', true)

        } else if (layEvent === 'ep2_sync') {
            //同步促销商品
            syncPromotion(data.id);
        } else if (layEvent === 'ep2_copy') {
            //copy促销
            if (data.promotionType === 'VOLUME_DISCOUNT') {

            } else if (data.promotionType === 'ORDER_DISCOUNT') {

            } else if (data.promotionType === 'MARKDOWN_SALE') {

            }
            createOrSavePromotion(data.promotionType, data, 'copy');
        }
    });
    //新建促销
    form.on('select(createPromotion)', function(data) {
        var promotionType = data.value;
        if (promotionType) {
            console.log("create promotion %s", promotionType);
            createOrSavePromotion(promotionType);
        }
    });
    //新增/编辑/copy促销
    function createOrSavePromotion(promotionType, promotionData, isCopy) {
        //弹窗title
        if (isCopy) {
            var title = 'copy ' + promotionType;
        } else {
            var title = promotionData ? "编辑" : "新增" + promotionType;
        }
        //draft促销|创建促销时，三个btn，其他两个
        //弹窗btn
        if (isCopy) {
            var btns = ['保存发布', '保存', '关闭']
        } else {
            var btns = (promotionData && promotionData.promotionStatus != 'DRAFT') ? ['发布', '关闭'] : ['保存发布', '保存', '关闭']
        }
        layer.open({
            title: title,
            type: 1,
            content: 'loading',
            btn: btns,
            area: ['80%', '70%'],
            success: function(layero, index) {
                selectedProduct = []
                //todo 1
                initPromotionDetail(layero, promotionType);
                if (promotionData) {
                    //有数据，新建
                    //todo 2
                    renderPromotionDetail(promotionData, promotionType, isCopy);
                }else{
                    refreshInventoryCriterionType();
                }
                //layui重载
                //日期
                laydate.render({
                    type: 'datetime',
                    elem: '#ep2_editPromotionForm input[name=promotionStartTime]',
                    format: 'yyyy-MM-dd HH:mm:ss'
                });
                laydate.render({
                    type: 'datetime',
                    elem: '#ep2_editPromotionForm input[name=promotionEndTime]',
                    format: 'yyyy-MM-dd HH:mm:ss'
                });
                layui.form.render();
                layui.element.render("collapse");
                //初始化上传本地图片
                initLocalImgUpload();
            },
            yes: function(index, layero) {
                //保存并发布
                savePromotionData(true, promotionData, promotionType, index, isCopy);
            },
            btn2: function(index, layero) {
                if (btns.length > 2) {
                    //draft促销|创建促销时，此项为保存
                    savePromotionData(false, promotionData, promotionType, index, isCopy);
                    return false
                } else {
                    //非draft促销，此项为关闭
                    layer.close(index);
                }
            }
        });
    }

    /**
     *
     * @param isPuhlish 是否发布
     * @param oldPromotionData 旧数据，编辑时非空
     * @param promotionType 促销类型，三种
     */
    function savePromotionData(isPuhlish, oldPromotionData, promotionType, index, isCopy) {
        //data实体
        var promotionData = {};
        promotionData.promotionType = promotionType
            //促销状态处理 1、isPuhlish=true, oldPromotionData=DRAFT||oldPromotionData=null  SCHEDULED，，
            //isPuhlish=true,oldPromotionData为空，
        if (isCopy) {
            if (isPuhlish) {
                //发布
                promotionData.promotionStatus = "SCHEDULED"
            } else {
                //保存
                promotionData.promotionStatus = "DRAFT"
            }
        } else if (isPuhlish && oldPromotionData && oldPromotionData.promotionStatus != 'DRAFT') {
            //编辑促销，且促销不为草稿状态
            promotionData.promotionStatus = oldPromotionData.promotionStatus
        } else if (!oldPromotionData || oldPromotionData.promotionStatus == 'DRAFT') {
            //新增促销或者促销为草稿状态,允许选择发布或者保存
            if (isPuhlish) {
                //发布
                promotionData.promotionStatus = "SCHEDULED"
            } else {
                //保存
                promotionData.promotionStatus = "DRAFT"
            }
        } else {
            layer.msg("保存异常,请联系管理员", { icon: 2 });
            return;
        }
        //币种
        var currency = $("#ep2_editPromotionForm select[name=promotionMarketplaceId] option:selected").data("currency");
        oldPromotionData = oldPromotionData || {};
        //1、促销公共信息
        if (!isCopy) {
            promotionData.id = oldPromotionData.id;
        }
        promotionData.promotionId = oldPromotionData.promotionId;
        if (isCopy) {
            promotionData.editMode = "add";
        } else {
            promotionData.editMode = oldPromotionData.id ? "update" : "add";
        }
        promotionData.storeAcctId = $("#ep2_editPromotionForm select[name=storeAcctId]").val();
        promotionData.promotionMarketplaceId = $("#ep2_editPromotionForm select[name=promotionMarketplaceId]").val();
        promotionData.promotionName = $("#ep2_editPromotionForm input[name=promotionName]").val();
        promotionData.promotionDescription = $("#ep2_editPromotionForm input[name=promotionDescription]").val();
        promotionData.promotionName = $("#ep2_editPromotionForm input[name=promotionName]").val();
        promotionData.promotionStartTime = $("#ep2_editPromotionForm input[name=promotionStartTime]").val();
        promotionData.promotionEndTime = $("#ep2_editPromotionForm input[name=promotionEndTime]").val();
        promotionData.promotionImageUrl = $("#ep2_editPromotionForm input[name=promotionImageUrl]").val();
        //1.1 促销额外的信息
        var url;
        if (promotionType === 'VOLUME_DISCOUNT') {
            buildVolumeDiscountData(promotionData, currency);
            url = "/ebayMarketingDiscount/saveVolumeOrOrderPromotion.html";
            //校验VolumeDiscount
            var errorMsg = validVolumeDiscount(promotionData);
            if (errorMsg) {
                layer.msg(errorMsg, { icon: 0 });
                throw "数据格式错误" + errorMsg;
            }
        } else if (promotionType === 'ORDER_DISCOUNT') {
            buildOrderDiscountData(promotionData, currency);
            url = "/ebayMarketingDiscount/saveVolumeOrOrderPromotion.html";
        } else if (promotionType === 'MARKDOWN_SALE') {
            buildMarkdownSaleData(promotionData, currency);
            //校验markdown
            var errorMsg = validMarkdownSale(promotionData);
            if (errorMsg) {
                layer.msg(errorMsg, { icon: 0 });
                throw "数据格式错误" + errorMsg;
            }
            url = "/ebayMarketingDiscount/saveMarkdownPromotion.html";
        }
        console.log(JSON.stringify(promotionData));
        //封装请求数据
        if (promotionData.discountRules) {
            promotionData.discountRules = JSON.stringify(promotionData.discountRules);
        }
        if (promotionData.inventoryCriterion) {
            promotionData.inventoryCriterion = JSON.stringify(promotionData.inventoryCriterion);
        }
        if (promotionData.selectedInventoryDiscounts) {
            promotionData.selectedInventoryDiscounts = JSON.stringify(promotionData.selectedInventoryDiscounts);
        }
        initAjax(url, 'post', promotionData, function(returnData) {
            layer.msg("保存成功", { icon: 1 });
            layer.close(index);
            $('#ep2_searchBtn').click();
        }, 'application/x-www-form-urlencoded', true)
    }

    /**
     * 校验markdown
     * @param promotionData
     * @returns {boolean}
     */
    function validMarkdownSale(promotionData) {
        var errorMsg = "";
        if (!promotionData.promotionStartTime || !promotionData.promotionEndTime) {
            return "必须设置促销起止时间";
        }
        //校验图片
        if (!promotionData.promotionImageUrl) {
            return "图片必填";
        }
        var discountLength = promotionData.selectedInventoryDiscounts.length;
        //1、梯度最多10个
        if (discountLength > 10) {
            return "最多设置10个折扣梯度";
        }
        //2、第一个梯度小于10，新增梯度需要限制
        var firstPercentageOffItem = promotionData.selectedInventoryDiscounts[0].discountBenefit.percentageOffItem;
        if (firstPercentageOffItem && firstPercentageOffItem < 10) {
            if (discountLength > 1) {
                return "第一个折扣梯度小于10，不允许多个梯度";
            }
        }
        var lastPercentageOffItem = -1;
        for (var i in promotionData.selectedInventoryDiscounts) {
            var selectedInventoryDiscount = promotionData.selectedInventoryDiscounts[i];
            var percentageOffItem = selectedInventoryDiscount.discountBenefit.percentageOffItem;
            if (percentageOffItem) {
                //3、梯度大小在5-80
                if (percentageOffItem < 5 || percentageOffItem > 80) {
                    return "百分比降价折扣范围5-80";
                }
                if (percentageOffItem < lastPercentageOffItem) {
                    return "促销梯度折扣只能越来越大";
                } else {
                    lastPercentageOffItem = parseFloat(percentageOffItem);
                }
            }

        }



        //3、梯度只能越来越大

        return errorMsg;
    }

    function validVolumeDiscount(promotionData) {
        var errorMsg = "";
        if (!promotionData.promotionStartTime || !promotionData.promotionEndTime) {
            return "必须设置促销起止时间";
        }
        var discountRules = promotionData.discountRules;
        if (discountRules && discountRules.length > 0) {
            var lastPercentageOffOrder = -1;
            for (var i in discountRules) {
                var discountRule = discountRules[i];
                var percentageOffOrder = discountRule.discountBenefit.percentageOffOrder;
                if (i >= 1) {
                    if (percentageOffOrder < 1 || percentageOffOrder > 80) {
                        return "折扣限制1-80";
                    }
                }

                if (percentageOffOrder < lastPercentageOffOrder) {
                    return "促销梯度折扣只能越来越大";
                } else {
                    lastPercentageOffOrder = parseFloat(percentageOffOrder);
                }
            }
        }
        return errorMsg;
    }
    /**
     * orderDiscount促销数据
     * @param promotionData
     * @param currency
     * @returns promotionData
     */
    function buildOrderDiscountData(promotionData, currency) {
        //orderDiscount特有设置
        promotionData.promotionPriority = $("#ep2_editPromotionForm select[name=priority]").val();
        //促销类型 单个
        var discountRule = {};
        //促销类型dom
        var orderDiscountRuleType = $("#ep2_editPromotionForm input[name=orderDiscountRuleType]:checked").val();
        //具体促销规则dom
        var orderDiscountTypeItemDom = $("#ep2_editPromotionForm input[name=orderDiscountType]:checked").parents(".orderDiscountType-item");
        //促销规则序号
        var orderDiscountTypeItemIndex = $("#ep2_editPromotionForm .orderDiscountType-" + orderDiscountRuleType)
            .find(".orderDiscountType-item").index(orderDiscountTypeItemDom);
        var minAmount, amountOffOrder, percentageOffOrder, forEachAmount, minQuantity, forEachQuantity,
            percentageOffItem, numberOfDiscountedItems, amountOffItem
        if (orderDiscountRuleType == "amount") {
            //按金额
            if (orderDiscountTypeItemIndex == 0) {
                //满 _减 $_ 
                minAmount = orderDiscountTypeItemDom.find("select[name=minAmount]").val();
                amountOffOrder = orderDiscountTypeItemDom.find("select[name=amountOffOrder]").val();
            } else if (orderDiscountTypeItemIndex == 1) {
                //满 _减 _ %
                minAmount = orderDiscountTypeItemDom.find("select[name=minAmount]").val();
                percentageOffOrder = orderDiscountTypeItemDom.find("select[name=percentageOffOrder]").val();
            } else if (orderDiscountTypeItemIndex == 2) {
                //每满 _减 $_
                forEachAmount = orderDiscountTypeItemDom.find("select[name=forEachAmount]").val();
                amountOffOrder = orderDiscountTypeItemDom.find("select[name=amountOffOrder]").val();
            }
        } else if (orderDiscountRuleType == "quantity") {
            //按数量
            if (orderDiscountTypeItemIndex == 0) {
                //买满_个，减$_
                minQuantity = orderDiscountTypeItemDom.find("select[name=minQuantity]").val();
                amountOffOrder = orderDiscountTypeItemDom.find("select[name=amountOffOrder]").val();
            } else if (orderDiscountTypeItemIndex == 1) {
                //买满_个，减_%
                minQuantity = orderDiscountTypeItemDom.find("select[name=minQuantity]").val();
                percentageOffOrder = orderDiscountTypeItemDom.find("select[name=percentageOffOrder]").val();
            } else if (orderDiscountTypeItemIndex == 2) {
                //每买满_个，减$_
                forEachQuantity = orderDiscountTypeItemDom.find("select[name=forEachQuantity]").val();
                amountOffOrder = orderDiscountTypeItemDom.find("select[name=amountOffOrder]").val();
            }
        } else if (orderDiscountRuleType == "buyOneGetOne") {
            //买一赠一(获得n个折扣，无折扣说明赠送)
            if (orderDiscountTypeItemIndex == 0) {
                //每买_个，赠_个
                forEachQuantity = orderDiscountTypeItemDom.find("select[name=forEachQuantity]").val();
                numberOfDiscountedItems = orderDiscountTypeItemDom.find("select[name=numberOfDiscountedItems]").val();
                percentageOffItem = 100;
            } else if (orderDiscountTypeItemIndex == 1) {
                //每买_个，赠_个
                forEachQuantity = orderDiscountTypeItemDom.find("select[name=forEachQuantity]").val();
                numberOfDiscountedItems = orderDiscountTypeItemDom.find("select[name=numberOfDiscountedItems]").val();
                percentageOffItem = orderDiscountTypeItemDom.find("select[name=percentageOffItem]").val();
            } else if (orderDiscountTypeItemIndex == 2) {
                //买满_个，赠_个
                minQuantity = orderDiscountTypeItemDom.find("select[name=minQuantity]").val();
                numberOfDiscountedItems = orderDiscountTypeItemDom.find("select[name=numberOfDiscountedItems]").val();
                percentageOffItem = 100;
            } else if (orderDiscountTypeItemIndex == 3) {
                //买满_个，获得_个减去_%
                minQuantity = orderDiscountTypeItemDom.find("select[name=minQuantity]").val();
                numberOfDiscountedItems = orderDiscountTypeItemDom.find("select[name=numberOfDiscountedItems]").val();
                percentageOffItem = orderDiscountTypeItemDom.find("select[name=percentageOffItem]").val();
            }
        } else if (orderDiscountRuleType == "any") {
            //无门槛优惠(买1/每1 优惠)
            if (orderDiscountTypeItemIndex == 0) {
                //下单即减$_
                minQuantity = 1;
                amountOffOrder = orderDiscountTypeItemDom.find("select[name=amountOffOrder]").val();
            } else if (orderDiscountTypeItemIndex == 1) {
                //下单即减_%
                minQuantity = 1;
                percentageOffOrder = orderDiscountTypeItemDom.find("select[name=percentageOffOrder]").val();
            } else if (orderDiscountTypeItemIndex == 2) {
                //每个产品减$_
                forEachQuantity = 1;
                amountOffItem = orderDiscountTypeItemDom.find("select[name=amountOffItem]").val();
            }
        }
        //minAmount,amountOffOrder,percentageOffOrder,forEachAmount,minQuantity,forEachQuantity,
        //percentageOffItem,numberOfDiscountedItems,amountOffItem
        var discountSpecification = {};
        var discountBenefit = {};
        //条件
        if (minAmount) {
            discountSpecification.minAmount = { "value": minAmount, "currency": currency };
        }
        if (forEachAmount) {
            discountSpecification.forEachAmount = { "value": forEachAmount, "currency": currency };
        }
        if (minQuantity) {
            discountSpecification.minQuantity = minQuantity;
        }
        if (forEachQuantity) {
            discountSpecification.forEachQuantity = forEachQuantity;
        }
        if (numberOfDiscountedItems) {
            discountSpecification.numberOfDiscountedItems = numberOfDiscountedItems;
        }
        //优惠
        if (amountOffOrder) {
            discountBenefit.amountOffOrder = { "value": amountOffOrder, "currency": currency };
        }
        if (percentageOffOrder) {
            discountBenefit.percentageOffOrder = percentageOffOrder;
        }
        if (percentageOffItem) {
            discountBenefit.percentageOffItem = percentageOffItem;
        }
        if (amountOffItem) {
            discountBenefit.amountOffItem = amountOffItem;
        }
        discountRule.discountSpecification = discountSpecification;
        discountRule.discountBenefit = discountBenefit;
        var discountRules = [];
        discountRules.push(discountRule);
        promotionData.discountRules = discountRules;
        //inventoryCriterion
        var collaItemDom = $("#ep2_editPromotionForm .ruleCriteria .layui-colla-item");
        promotionData.inventoryCriterion = buildIinventoryCriterion(collaItemDom, currency);
        return promotionData;
    }

    /**
     * volumeDiscount促销数据
     * @param promotionData
     * @param currency
     * @returns promotionData
     */
    function buildVolumeDiscountData(promotionData, currency) {
        //促销类型
        var discountRules = [];
        var ruleOrder = 1;
        var doms = $("#ep2_editPromotionForm input[name=percentageOffOrder]");
        for (var i = 0; i < doms.length; i++) {
            var dom = doms.eq(i);
            var percentageOffOrder = dom.val();
            var minQuantity = dom.data("quantity");
            //如果非第一个为0，后面的都丢掉
            if (ruleOrder > 1 && percentageOffOrder < 1) {
                break;
            }
            discountRule = {};
            discountRule.discountSpecification = { "minQuantity": minQuantity };
            discountRule.discountBenefit = { "percentageOffOrder": percentageOffOrder };
            discountRule.ruleOrder = ruleOrder;
            discountRules.push(discountRule);
            ruleOrder++;
        };
        promotionData.discountRules = discountRules;
        promotionData.applyDiscountToSingleItemOnly = $("#ep2_editPromotionForm input[name=applyDiscountToSingleItemOnly]").prop("checked");
        //inventoryCriterion
        var collaItemDom = $("#ep2_editPromotionForm .ruleCriteria .layui-colla-item");
        promotionData.inventoryCriterion = buildIinventoryCriterion(collaItemDom, currency);
        return promotionData;
    }


    /**
     * 封装markdownSale特有数据
     */
    function buildMarkdownSaleData(promotionData, currency) {
        //币种
        //markdown其他设置
        promotionData.autoSelectFutureInventory = $("#ep2_editPromotionForm .promotion-other input[name=autoSelectFutureInventory]").prop("checked");
        promotionData.blockPriceIncreaseInItemRevision = $("#ep2_editPromotionForm .promotion-other input[name=blockPriceIncreaseInItemRevision]").prop("checked");
        //是否免第一运费
        promotionData.applyFreeShipping = $("#ep2_editPromotionForm .promotion-type input[name=applyFreeShipping]").prop("checked");
        //按百分比降价，多个梯度时数组长度>1
        var discountBenefits = [];
        var discountIds = [];
        //促销方式 按百分比降价/按金额降价
        var discountBenefitValue = $("#ep2_editPromotionForm input[name=discountBenefit]:checked").val();
        if (discountBenefitValue == "percentageOffItem") {
            //按百分比降价,处理每个梯度
            $("#ep2_editPromotionForm .discountTypeBox .percentageOffItemDiv").each(function() {
                var percentageOffItem = $(this).find("input[name=percentageOffItem]").val();
                var discountBenefit = { "percentageOffItem": percentageOffItem };
                discountBenefits.push(discountBenefit);
                discountIds.push($(this).find("input[name=percentageOffItem]").data("id"));
            });
        } else if (discountBenefitValue == "amountOffItem") {
            //按金额降价
            var amountOffItem = $("#ep2_editPromotionForm .discountTypeBox input[name=amountOffItem]").val();
            var discountBenefit = { "amountOffItem": { "value": amountOffItem, "currency": currency } };
            discountBenefits.push(discountBenefit);
            discountIds.push($("#ep2_editPromotionForm .discountTypeBox input[name=amountOffItem]").data("id"));
        } else {
            console.error("促销降价方式不正确");
            return;
        }
        //selectedInventoryDiscounts 数据封装,每个折扣一个规则
        var selectedInventoryDiscounts = [];
        for (var i in discountBenefits) {
            var discountBenefit = discountBenefits[i];
            var selectedInventoryDiscount = {};
            selectedInventoryDiscount.discountBenefit = discountBenefit;
            //discountId
            if (discountIds[i]) {
                selectedInventoryDiscount.discountId = discountIds[i];
            }
            selectedInventoryDiscount.ruleOrder = i;
            //inventoryCriterion数据
            //获取促销规则dom
            var collaItemDom = $("#ep2_editPromotionForm .ruleCriteria .layui-colla-item").eq(i);
            selectedInventoryDiscount.inventoryCriterion = buildIinventoryCriterion(collaItemDom, currency);
            selectedInventoryDiscounts.push(selectedInventoryDiscount);
        }
        promotionData.selectedInventoryDiscounts = selectedInventoryDiscounts;
    }

    function buildIinventoryCriterion(collaItemDom, currency) {
        var inventoryCriterion = {};
        //促销产品获取方式 全部、根据规则获取、指定产品
        inventoryCriterion.inventoryCriterionType = $("#ep2_editPromotionForm select[name=inventoryCriterionType]").val();
        if (inventoryCriterion.inventoryCriterionType == "INVENTORY_ANY") {
            //全部
            //根据规则
            var ruleCriteria = {};
            //排除产品
            //排除产品类型
            var excludeListingType = collaItemDom.find("select[name=excludeListingType]").val();
            var excludeValue = collaItemDom.find("input[name=excludeValue]").val().trim();
            if (excludeListingType == "excludeInventoryItems") {
                //按店铺SKU
                if (excludeValue) {
                    ruleCriteria.excludeInventoryItems = [];
                    for (var value of excludeValue.split(",")) {
                        if (value) {
                            ruleCriteria.excludeInventoryItems.push({ "inventoryReferenceId": value });
                        }
                    }
                }
            } else if (excludeListingType == "excludeListingIds") {
                //按产品ID
                if (excludeValue) {
                    ruleCriteria.excludeListingIds = [];
                    for (var value of excludeValue.split(",")) {
                        if (value) {
                            ruleCriteria.excludeListingIds.push(value);
                        }
                    }
                }
            }
            inventoryCriterion.ruleCriteria = ruleCriteria;

        } else if (inventoryCriterion.inventoryCriterionType == "INVENTORY_BY_RULE") {
            //根据规则
            var ruleCriteria = {};
            //选择的规则
            var selectionRules = [];
            var categoryScope = collaItemDom.find("select[name=categoryScope]").val();
            collaItemDom.find(".categoryRuleTable tbody tr").each(function() {
                var selectionRule = {};
                var categoryId = $(this).find(".cateName").data("id") + "";
                var minPriceValue = $(this).find("input[name=minPrice]").val();
                var maxPriceValue = $(this).find("input[name=maxPrice]").val();
                selectionRule.categoryIds = [categoryId];
                selectionRule.categoryScope = categoryScope;
                selectionRule.minPrice = { "value": minPriceValue, "currency": currency };
                selectionRule.maxPrice = { "value": maxPriceValue, "currency": currency };
                selectionRules.push(selectionRule);
            });
            ruleCriteria.selectionRules = selectionRules;
            //排除产品
            //排除产品类型
            var excludeListingType = collaItemDom.find("select[name=excludeListingType]").val();
            var excludeValue = collaItemDom.find("input[name=excludeValue]").val().trim();
            if (excludeListingType == "excludeInventoryItems") {
                //按店铺SKU
                if (excludeValue) {
                    ruleCriteria.excludeInventoryItems = [];
                    for (var value of excludeValue.split(",")) {
                        if (value) {
                            ruleCriteria.excludeInventoryItems.push({ "inventoryReferenceId": value });
                        }
                    }
                }
            } else if (excludeListingType == "excludeListingIds") {
                //按产品ID
                if (excludeValue) {
                    ruleCriteria.excludeListingIds = [];
                    for (var value of excludeValue.split(",")) {
                        if (value) {
                            ruleCriteria.excludeListingIds.push(value);
                        }
                    }
                }
            }
            inventoryCriterion.ruleCriteria = ruleCriteria;
        } else if (inventoryCriterion.inventoryCriterionType == "INVENTORY_BY_VALUE") {
            //指定产品
            var listingIds = collaItemDom.find("textarea[name=listingIds]").val().trim();
            inventoryCriterion.listingIds = listingIds.split(",");
        } else {
            throw "inventoryCriterionType 错误";
        }
        return inventoryCriterion;
    }

    /**
     * 初始化促销详情信息
     */
    function initPromotionDetail(layero, promotionType) {
        //1 渲染促销公共数据(店铺，站点，活动名称，活动描述)
        $(layero).find(".layui-layer-content").html($("#ep2_editPromotionTpl").html());
        //初始化店铺
        var optionDom = '<option value="">全部</option>';
        for (let userStore of userStores) {
            optionDom += '<option value="' + userStore.id + '">' + userStore.storeAcct + '</option>';
        }
        $("#ep2_editPromotionForm select[name=storeAcctId]").html(optionDom);
        //初始化站点
        var optionDom = '<option value="">全部</option>';
        for (let ebaySite of ebaySites) {
            optionDom += '<option value="' + ebaySite.marketplaceId + '" data-currency="' + ebaySite.currency + '">' + ebaySite.siteName + '</option>';
        }
        $("#ep2_editPromotionForm select[name=promotionMarketplaceId]").html(optionDom);
        // 按类型渲染数据
        var promotionTypeDom;
        if (promotionType == "VOLUME_DISCOUNT") {
            //促銷方式
            $("#ep2_editPromotionForm .promotion-type .layui-input-block").html($("#ep2_promotionTypeVolumeDiscountTpl").html());
            //隐藏活动描述
            $("#ep2_editPromotionForm .descriptionItem input[name=promotionDescription]").hide();
            $("#ep2_editPromotionForm .descriptionItem label").hide();
        } else if (promotionType == "ORDER_DISCOUNT") {
            //促销方式
            $("#ep2_editPromotionForm .promotion-type .layui-input-block").html($("#ep2_promotionTypeOrderDiscountTpl").html());
            //优先级
            $("#ep2_editPromotionForm select[name=priority]").parents(".layui-form-item").show();
            //初始化选项option
            initOrderDiscountRuleOption();
        } else if (promotionType == "MARKDOWN_SALE") {
            //促销方式
            $("#ep2_editPromotionForm .promotion-type .layui-input-block").html($("#ep2_promotionTypeMarkdownSaleTpl").html());
            //MARKDOWN_SALE 展示促销其他设置
            $("#ep2_editPromotionForm .promotion-other").show();
        } else {
            console.error("促销类型不支持：" + promotionType);
            return;
        }
        //初始化促销产品
        initPromotionProduct();
    }



    /**
     * 渲染数据
     * @param promotionData
     * @param promotionType
     */
    function renderPromotionDetail(promotionData, promotionType, isCopy) {
        //公共信息
        $("#ep2_editPromotionForm select[name=storeAcctId]").val(promotionData.storeAcctId);
        if (!isCopy) {
            $("#ep2_editPromotionForm select[name=storeAcctId]").prop("disabled", true);
            $("#ep2_editPromotionForm select[name=promotionMarketplaceId]").prop("disabled", true);
        }
        $("#ep2_editPromotionForm select[name=promotionMarketplaceId]").val(promotionData.promotionMarketplaceId);
        refreshOrderDiscountRuleTypeSelect();
        $("#ep2_editPromotionForm input[name=promotionName]").val(promotionData.promotionName);
        $("#ep2_editPromotionForm input[name=promotionDescription]").val(promotionData.promotionDescription);
        $("#ep2_editPromotionForm input[name=promotionStartTime]").val(Format(promotionData.promotionStartTime, "yyyy-MM-dd hh:mm:ss"));
        $("#ep2_editPromotionForm input[name=promotionEndTime]").val(Format(promotionData.promotionEndTime, "yyyy-MM-dd hh:mm:ss"));
        $("#ep2_editPromotionForm #ep2_promotionImgShow").html("<img src='" + promotionData.promotionImageUrl + "'/>");
        $("#ep2_editPromotionForm input[name=promotionImageUrl]").val(promotionData.promotionImageUrl);
        //按照促销类型设置
        if (promotionType == "VOLUME_DISCOUNT") {
            //volume discount促销类型设置
            renderVolumeDiscountPromotionType(promotionData);
        } else if (promotionType == "ORDER_DISCOUNT") {
            //order discount促销设置
            renderOrderDiscountPromotionType(promotionData);
        } else if (promotionType == "MARKDOWN_SALE") {
            //markdown sale促销类型设置
            renderMarkdownSalePromotionType(promotionData);
        } else {
            console.error("促销类型不支持：" + promotionType);
            return;
        }
        //促销产品
        renderPromotionProduct(promotionData);

        //根据不同状态展示是否可以编辑
        if (promotionData && !isCopy) {

            if (promotionData.promotionStatus == "RUNNING" || promotionData.promotionStatus == "PAUSED") {
                //进行中的促销不能修改

                //促销开始时间按不能修改
                $("#ep2_editPromotionForm input[name=promotionStartTime]").attr("disabled", "disabled");
                //禁用促销类型表单
                $("#ep2_editPromotionForm .promotion-type input").attr("disabled", "disabled");
                $("#ep2_editPromotionForm .promotion-type select").attr("disabled", "disabled");
                //禁用促销类型按钮
                $("#ep2_editPromotionForm .promotion-type button").attr("disabled", "disabled");
                $("#ep2_editPromotionForm .promotion-type button").addClass("layui-btn-disabled");
                $("#ep2_editPromotionForm .promotion-type .deleteIcon").remove();
            } else if (promotionData.promotionStatus == "SCHEDULED" && promotionType == "MARKDOWN_SALE") {
                //markdown sale SCHEDULED不能修改促销类型
                //禁用促销类型表单
                $("#ep2_editPromotionForm .promotion-type input").attr("disabled", "disabled");
                $("#ep2_editPromotionForm .promotion-type select").attr("disabled", "disabled");
                //禁用促销类型按钮
                $("#ep2_editPromotionForm .promotion-type button").attr("disabled", "disabled");
                $("#ep2_editPromotionForm .promotion-type button").addClass("layui-btn-disabled");
                $("#ep2_editPromotionForm .promotion-type .deleteIcon").remove();
            }
        }
    }

    /**
     * 渲染VolumeDiscount数据
     * @param promotionData
     */
    function renderVolumeDiscountPromotionType(promotionData) {
        if (promotionData.discountRules) {
            var discountRules = JSON.parse(promotionData.discountRules);
            for (var discountRule of discountRules) {
                var quantity = discountRule.discountSpecification.minQuantity;
                var discountBenefit = discountRule.discountBenefit.percentageOffOrder;
                $("#ep2_editPromotionForm input[name=percentageOffOrder][data-quantity=" + quantity + "]").val(discountBenefit);
            }
        }
        //仅对相同的Item的产品生效
        var applyDiscountToSingleItemOnly = promotionData.applyDiscountToSingleItemOnly;

        $("#ep2_editPromotionForm input[name=applyDiscountToSingleItemOnly]").prop("checked", applyDiscountToSingleItemOnly);
    }

    function renderOrderDiscountPromotionType(promotionData) {
        //优先级设置
        if (promotionData.promotionPriority) {
            $("#ep2_editPromotionForm select[name=priority]").val(promotionData.promotionPriority);
            form.render()
        }
        if (!promotionData.discountRules) {
            return;
        }
        var discountRules = JSON.parse(promotionData.discountRules);
        for (var discountRule of discountRules) {
            //每满金额
            var forEachAmount;
            //每买数量
            var forEachQuantity;
            //满金额
            var minAmount;
            //买数量
            var minQuantity;
            //优惠数量
            var numberOfDiscountedItems;

            //订单减免金额
            var amountOffOrder;
            //订单优惠百分比
            var percentageOffOrder;
            //每个优惠百分比,与numberOfDiscountedItems一起用
            var percentageOffItem;

            var amountOffItem;

            //折扣条件
            var discountSpecification = discountRule.discountSpecification;
            //减免结果
            var discountBenefit = discountRule.discountBenefit;
            //每一项值
            forEachAmount = discountSpecification.forEachAmount;
            forEachQuantity = discountSpecification.forEachQuantity
            minAmount = discountSpecification.minAmount;
            minQuantity = discountSpecification.minQuantity;
            numberOfDiscountedItems = discountSpecification.numberOfDiscountedItems;
            amountOffOrder = discountBenefit.amountOffOrder;
            percentageOffOrder = discountBenefit.percentageOffOrder;
            percentageOffItem = discountBenefit.percentageOffItem;
            amountOffItem = discountBenefit.amountOffItem;

            //判断类型
            //选中的orderDiscountType-item
            var orderDiscountTypeItemDom;
            var orderDiscountRuleType;
            if (minAmount && amountOffOrder) {
                //1.1满 _减 $_ 
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-amount .orderDiscountType-item").eq(0);
                orderDiscountRuleType = "amount";
            } else if (minAmount && percentageOffOrder) {
                //1.2满 _减 _ %
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-amount .orderDiscountType-item").eq(1);
                orderDiscountRuleType = "amount";
            } else if (forEachAmount && amountOffOrder) {
                //1.3每满 _减 _ %
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-amount .orderDiscountType-item").eq(2);
                orderDiscountRuleType = "amount";
            } else if (minQuantity >= 1 && amountOffOrder) {
                //2.1买满_个，减$_
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-quantity .orderDiscountType-item").eq(0);
                orderDiscountRuleType = "quantity";
            } else if (minQuantity >= 1 && percentageOffOrder) {
                //2.2买满_个，减_%
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-quantity .orderDiscountType-item").eq(1);
                orderDiscountRuleType = "quantity";
            } else if (forEachQuantity >= 1 && amountOffOrder) {
                //2.3每买满_个，减$_
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-quantity .orderDiscountType-item").eq(2);
                orderDiscountRuleType = "quantity";
            } else if (forEachQuantity >= 1 && numberOfDiscountedItems >= 1 && percentageOffItem == 100) {
                //3.1每买_个，赠_个
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-buyOneGetOne .orderDiscountType-item").eq(0);
                orderDiscountRuleType = "buyOneGetOne";
            } else if (forEachQuantity >= 1 && numberOfDiscountedItems >= 1 && percentageOffItem < 100) {
                //3.2每买_个，获得_个减去_%
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-buyOneGetOne .orderDiscountType-item").eq(1);
                orderDiscountRuleType = "buyOneGetOne";
            } else if (minQuantity >= 1 && numberOfDiscountedItems >= 1 && percentageOffItem == 100) {
                //3.3每买_个，赠_个（仅一次）
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-buyOneGetOne .orderDiscountType-item").eq(2);
                orderDiscountRuleType = "buyOneGetOne";
            } else if (minQuantity >= 1 && numberOfDiscountedItems >= 1 && percentageOffItem < 100) {
                //3.4买_个，获得_个优惠_%（仅一次）
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-buyOneGetOne .orderDiscountType-item").eq(3);
                orderDiscountRuleType = "buyOneGetOne";
            } else if (minQuantity = 1 && amountOffOrder) {
                //4.1下单即减$_
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-any .orderDiscountType-item").eq(0);
                orderDiscountRuleType = "any";
            } else if (minQuantity = 1 && percentageOffOrder) {
                //4.2下单即减%
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-any .orderDiscountType-item").eq(1);
                orderDiscountRuleType = "any";
            } else if (forEachQuantity = 1 && amountOffItem) {
                //4.3每个产品减$_
                orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-any .orderDiscountType-item").eq(2);
                orderDiscountRuleType = "any";
            }
            //选中checkbox,并刷新
            $("#ep2_editPromotionForm input[name=orderDiscountRuleType][value=" + orderDiscountRuleType + "]").prop("checked", true);
            refreshOrderDiscountRuleTypeRadio();
            if (orderDiscountTypeItemDom) {
                //选中具体的项
                orderDiscountTypeItemDom.find("input[name=orderDiscountType]").prop("checked", true);

                //每一项的值
                if (forEachAmount) {
                    orderDiscountTypeItemDom.find("select[name=forEachAmount]").val(forEachAmount.value);
                }
                orderDiscountTypeItemDom.find("select[name=forEachQuantity]").val(forEachQuantity);
                if (minAmount) {
                    orderDiscountTypeItemDom.find("select[name=minAmount]").val(minAmount.value);
                }
                orderDiscountTypeItemDom.find("select[name=minQuantity]").val(minQuantity);
                orderDiscountTypeItemDom.find("select[name=numberOfDiscountedItems]").val(numberOfDiscountedItems);
                if (amountOffOrder) {
                    orderDiscountTypeItemDom.find("select[name=amountOffOrder]").val(amountOffOrder.value);
                }
                orderDiscountTypeItemDom.find("select[name=percentageOffOrder]").val(percentageOffOrder);
                orderDiscountTypeItemDom.find("select[name=percentageOffItem]").val(percentageOffItem);
            }
        }
    }

    /**
     * 渲染markdown sale数据
     * @param promotionData
     */
    function renderMarkdownSalePromotionType(promotionData) {
        var selectedInventoryDiscounts = JSON.parse(promotionData.selectedInventoryDiscounts);
        console.log(selectedInventoryDiscounts);
        selectedInventoryDiscounts.sort(function sortByRuleOrder1(x, y) {
            return x.ruleOrder - y.ruleOrder;
        });
        //MARKDOWN_SALE 促销其他设置
        $("#ep2_editPromotionForm .promotion-other input[name=autoSelectFutureInventory]").prop("checked", promotionData.autoSelectFutureInventory);
        $("#ep2_editPromotionForm .promotion-other input[name=blockPriceIncreaseInItemRevision]").prop("checked", promotionData.blockPriceIncreaseInItemRevision);
        //是否免第一运费
        $("#ep2_editPromotionForm .promotion-type input[name=applyFreeShipping]").prop("checked", promotionData.applyFreeShipping);
        for (let i in selectedInventoryDiscounts) {
            var selectedInventoryDiscount = selectedInventoryDiscounts[i];
            //促销降价类型
            var discountBenefit = selectedInventoryDiscount.discountBenefit;
            var discountId = selectedInventoryDiscount.discountId;
            if (discountBenefit.percentageOffItem) {
                //百分比降价
                $("#ep2_editPromotionForm input[name=discountBenefit][value=percentageOffItem]").prop("checked", true);
                if (i == 0) {
                    //第一个直接设置
                    setFirstPercentDiscount(discountBenefit.percentageOffItem, discountId);
                } else {
                    addPercentDiscount(discountBenefit.percentageOffItem, discountId)
                }
            } else if (discountBenefit.amountOffItem) {
                //按金额降价
                $("#ep2_editPromotionForm input[name=discountBenefit][value=amountOffItem]").prop("checked", true);
                $("#ep2_editPromotionForm input[name=amountOffItem]").val(discountBenefit.amountOffItem.value);
                $("#ep2_editPromotionForm input[name=amountOffItem]").data("id", discountId || "");

            } else {
                console.warn("未加载到discountBenefit type")
            }
            //刷新促销降价类型radio状态
            refreshMarkdownSaleDiscountBenefitRadio();

        }
    }

    /**
     * 渲染促销产品
     * @param promotionData
     */
    function renderPromotionProduct(promotionData) {
        //1、封装数据， by促销类型
        //促销产品， 每种促销方式封装方法不一样
        var inventoryCriterions = [];
        if (promotionData.promotionType == "MARKDOWN_SALE") {
            //markdown sale 取数组
            var selectedInventoryDiscounts = JSON.parse(promotionData.selectedInventoryDiscounts);
            //对selectedInventoryDiscounts排序
            // debugger;
            selectedInventoryDiscounts.sort(function sortByRuleOrder1(x, y) {
                return x.ruleOrder - y.ruleOrder;
            });
            for (var selectedInventoryDiscount of selectedInventoryDiscounts) {
                var inventoryCriterion = selectedInventoryDiscount.inventoryCriterion;
                if (!inventoryCriterion) {
                    inventoryCriterion = {};
                }
                //规则标题
                if (selectedInventoryDiscount.discountBenefit.percentageOffItem) {
                    if (selectedInventoryDiscount.discountBenefit) {
                        inventoryCriterion.title = "减免" + selectedInventoryDiscount.discountBenefit.percentageOffItem + "%";
                    }
                }
                inventoryCriterions.push(inventoryCriterion);
            }
        } else {
            //volume_discount、order_discount
            if (promotionData.inventoryCriterion) {
                var inventoryCriterion = JSON.parse(promotionData.inventoryCriterion);
                inventoryCriterions.push(inventoryCriterion);
            }

        }
        //2 渲染数据
        //2.1 渲染促销商品选择类型， 取第一个
        if (inventoryCriterions.length > 0) {
            var ruleCriteriaDom = $("#ep2_editPromotionForm .promotionProductBox .ruleCriteria");
            ruleCriteriaDom.empty();
            var inventoryCriterionType = inventoryCriterions[0].inventoryCriterionType;
            if (inventoryCriterionType) {
                $("#ep2_editPromotionForm .promotionProductBox select[name=inventoryCriterionType]").val(inventoryCriterionType);
            }
            var categoryIds = [];
            for (let i in inventoryCriterions) {
                ruleCriteriaDom.append($("#ep2_promotionProductItemTpl").html());
                var inventoryCriterion = inventoryCriterions[i];
                var collaItemDom = ruleCriteriaDom.find(".layui-colla-item:last");
                collaItemDom.find(".layui-colla-title span")
                    .html(inventoryCriterion.title ? inventoryCriterion.title : "");
                if (inventoryCriterionType == "INVENTORY_BY_RULE") {
                    //按规则处理
                    if (inventoryCriterion.ruleCriteria) {
                        //规则
                        var selectionRules = inventoryCriterion.ruleCriteria.selectionRules;
                        if (selectionRules && selectionRules.length > 0) {
                            for (var selectionRule of inventoryCriterion.ruleCriteria.selectionRules) {
                                var categoryId = selectionRule.categoryIds[0];
                                var categoryName = categoryId;
                                var categoryScope = selectionRule.categoryScope;
                                var minPrice = selectionRule.minPrice ? selectionRule.minPrice.value : '';
                                var maxPrice = selectionRule.maxPrice ? selectionRule.maxPrice.value : '';
                                //如果不存在，加一行
                                collaItemDom.find(".categoryRuleTable tbody").append($("#ep2_categoryPriceTrTpl").html());
                                collaItemDom.find(".categoryRuleTable tbody tr:last .cateName").attr('data-id', categoryId);
                                collaItemDom.find(".categoryRuleTable tbody tr:last .cateName").html(categoryName);
                                collaItemDom.find(".categoryRuleTable tbody tr:last input[name=minPrice]").val(minPrice);
                                collaItemDom.find(".categoryRuleTable tbody tr:last input[name=maxPrice]").val(maxPrice);
                                collaItemDom.find("select[name=categoryScope]").val(categoryScope);
                                categoryIds.push(categoryId);
                            }
                        }
                        //排除商品
                        var excludeInventoryItems = inventoryCriterion.ruleCriteria.excludeInventoryItems;
                        if (excludeInventoryItems && excludeInventoryItems.length > 0) {
                            collaItemDom.find("select[name=excludeListingType]").val("excludeInventoryItems");
                            //排除SKU
                            var excludeSkus = []
                            for (var excludeInventoryItem of excludeInventoryItems) {
                                var excludeSku = excludeInventoryItem.inventoryReferenceId;
                                excludeSkus.push(excludeSku);
                            }
                            collaItemDom.find("input[name=excludeValue]").val(excludeSkus.join(","));
                        } else if (inventoryCriterion.ruleCriteria.excludeListingIds) {
                            collaItemDom.find("select[name=excludeListingType]").val("excludeListingIds");
                            //排除ItemID
                            var excludeListingIds = [];
                            for (var excludeListingId of inventoryCriterion.ruleCriteria.excludeListingIds) {
                                excludeListingIds.push(excludeListingId);
                            }
                            collaItemDom.find("input[name=excludeValue]").val(excludeListingIds.join(","));
                        }
                    }
                } else if (inventoryCriterionType == "INVENTORY_BY_VALUE") {
                    //按值获取处理
                    var listingIds = inventoryCriterion.listingIds || [];
                    var listingIdNum = listingIds.length;
                    collaItemDom.find("textarea[name=listingIds]").val(listingIds.join(","));
                    collaItemDom.find(".listingIdNum").html(listingIdNum);
                }else if (inventoryCriterionType == "INVENTORY_ANY") {//全部
                    if (inventoryCriterion.ruleCriteria) {
                        //排除商品
                        var excludeInventoryItems = inventoryCriterion.ruleCriteria.excludeInventoryItems;
                        if (excludeInventoryItems && excludeInventoryItems.length > 0) {
                            collaItemDom.find("select[name=excludeListingType]").val("excludeInventoryItems");
                            //排除SKU
                            var excludeSkus = []
                            for (var excludeInventoryItem of excludeInventoryItems) {
                                var excludeSku = excludeInventoryItem.inventoryReferenceId;
                                excludeSkus.push(excludeSku);
                            }
                            collaItemDom.find("input[name=excludeValue]").val(excludeSkus.join(","));
                        } else if (inventoryCriterion.ruleCriteria.excludeListingIds) {
                            collaItemDom.find("select[name=excludeListingType]").val("excludeListingIds");
                            //排除ItemID
                            var excludeListingIds = [];
                            for (var excludeListingId of inventoryCriterion.ruleCriteria.excludeListingIds) {
                                excludeListingIds.push(excludeListingId);
                            }
                            collaItemDom.find("input[name=excludeValue]").val(excludeListingIds.join(","));
                        }
                    }
                }
            }
            //修正分类名称
            if (categoryIds.length > 0) {
                var marketplaceId = $("#ep2_editPromotionForm select[name=promotionMarketplaceId]").val();
                initAjax('/ebayMarketingDiscount/getCateNameByCateId.html', 'GET', { cateIds: categoryIds.join(","), marketplaceId: marketplaceId }, function(returnData) {
                    $("#ep2_editPromotionForm .layui-colla-item .categoryRuleTable tbody tr .cateName").each(function() {
                        var categoryId = $(this).data("id");
                        if (returnData.data[categoryId]) {
                            $(this).html(returnData.data[categoryId])
                        }
                    });
                }, 'application/x-www-form-urlencoded', false)
            }
        }
        refreshInventoryCriterionType();
    }

    //切换站点，刷新货币，站点类目
    form.on('select(promotionMarketplaceId)', function(data) {
        refreshOrderDiscountRuleTypeSelect();
    });

    function refreshOrderDiscountRuleTypeSelect() {
        var storeAcctId = $("#ep2_editPromotionForm select[name=storeAcctId]").val();
        var promotionMarketplaceId = $("#ep2_editPromotionForm select[name=promotionMarketplaceId]").val();
        if (promotionMarketplaceId) {
            var currency = $("#ep2_editPromotionForm select[name=promotionMarketplaceId] option:selected").data("currency");
            initCategoryTree(storeAcctId, promotionMarketplaceId);
        }
    }
    //order discount促销降价方式切换逻辑，按金额/按数量/买一赠一/无门槛
    form.on('radio(orderDiscountRuleType)', function(data) {
        refreshOrderDiscountRuleTypeRadio();
    });
    //order discount 降价方式切换逻辑,按金额/按数量/买一赠一/无门槛
    function refreshOrderDiscountRuleTypeRadio() {
        var orderDiscountRuleType = $("#ep2_editPromotionForm input[name=orderDiscountRuleType]:checked").val();
        console.log("降价方式切换到：" + orderDiscountRuleType)
            //控制show/hide
        $("#ep2_editPromotionForm div[class^='orderDiscountType-']").hide();
        // if(orderDiscountRuleType == "amount"){
        //
        // }else if(orderDiscountRuleType == "quantity"){
        //
        // }else if(orderDiscountRuleType == "buyOneGetOne"){
        //
        // }else if(orderDiscountRuleType == "any"){
        //
        // }
        $("#ep2_editPromotionForm .orderDiscountType-" + orderDiscountRuleType).show();
        //切换降价方式reload
        layui.form.render();
    }


    //markdown sale 降价方式切换逻辑 按百分比降价/按金额降价
    form.on('radio(markdownSaleDiscountBenefit)', function(data) {
        refreshMarkdownSaleDiscountBenefitRadio();
    });
    //markdown sale 降价方式切换逻辑 按百分比降价/按金额降价
    function refreshMarkdownSaleDiscountBenefitRadio() {
        var discountBenefit = $("#ep2_editPromotionForm input[name=discountBenefit]:checked").val();
        console.log("降价方式切换到：" + discountBenefit)
        $("#ep2_editPromotionForm .discountTypeBox").hide();
        $("#ep2_editPromotionForm input[name=discountBenefit]:checked")
            .parents(".discountType").find(".discountTypeBox").show();
        //刷新促销产品规则
        refreshMarkdownRuleCriteria();
        //切换降价方式reload
        layui.form.render();
    }
    //markdown sale 按百分比降价添加一个折扣梯度
    $(document).on("click", "#ep2_addPercentDiscountBtn", function() {
        addPercentDiscount();
        //刷新促销产品规则
        refreshMarkdownRuleCriteria();

    });
    //markdown sale 按百分比降价移除一个折扣梯度
    $(document).on("click", "#ep2_editPromotionForm .percentageOffItemDiv .deleteIcon", function() {
        //获取是第几位
        var index = $("#ep2_editPromotionForm .percentageOffItemDiv").index($(this).parents(".percentageOffItemDiv"));
        //移除折扣梯度
        $(this).parents('.percentageOffItemDiv').remove();
        //移除关联的促销产品规则
        $("#ep2_editPromotionForm .ruleCriteria .layui-colla-item").eq(index).remove();
    });
    /**
     * markdown sale设置第一个百分比降价折扣梯度
     * @param percentageOffItem
     */
    function setFirstPercentDiscount(percentageOffItem, discountId) {
        percentageOffItem = parseFloat(percentageOffItem);
        $("#ep2_editPromotionForm .percentageOffItemDiv input[name=percentageOffItem]").val(percentageOffItem);
        $("#ep2_editPromotionForm .percentageOffItemDiv input[name=percentageOffItem]").data("id", discountId || "");
    }
    /**
     * markdown sale添加一个百分比降价折扣梯度div
     * @param percentageOffItem 指定折扣梯度
     */
    function addPercentDiscount(percentageOffItem, discountId) {
        var lastDiv = $("#ep2_editPromotionForm .percentageOffItemDiv:last").prop("outerHTML");
        if (!percentageOffItem) {
            var lastPercentageOffItem = $("#ep2_editPromotionForm .percentageOffItemDiv:last input[name=percentageOffItem]").val();
            if (lastPercentageOffItem && !isNaN(lastPercentageOffItem)) {
                percentageOffItem = parseFloat(lastPercentageOffItem) + 1;
            }
        }
        percentageOffItem = parseFloat(percentageOffItem);
        $("#ep2_editPromotionForm .percentageOffItemDiv:last").after(lastDiv);
        $("#ep2_editPromotionForm .percentageOffItemDiv:last input[name=percentageOffItem]").val(percentageOffItem);
        $("#ep2_editPromotionForm .percentageOffItemDiv:last input[name=percentageOffItem]").data("id", discountId || "");
    }

    //促销产品获取方式  全部/按规则/指定产品
    form.on('select(inventoryCriterionType)', function(data) {
        refreshInventoryCriterionType();
    });
    //促销产品获取方式  全部/按规则/指定产品
    function refreshInventoryCriterionType() {
        $("#ep2_editPromotionForm .layui-colla-item").show();

        $("#ep2_editPromotionForm .promotionProductBox .inventoryByRule").hide();
        $("#ep2_editPromotionForm .promotionProductBox .inventoryByValue").hide();
        $("#ep2_editPromotionForm .promotionProductBox .epV2_inventoryByRule").hide();
        var inventoryCriterionType = $("#ep2_editPromotionForm .promotionProductBox select[name=inventoryCriterionType]").val();
        if (inventoryCriterionType == "INVENTORY_BY_RULE") {
            //按规则获取
            $("#ep2_editPromotionForm .promotionProductBox .inventoryByRule").show();
            $("#ep2_editPromotionForm .promotionProductBox .epV2_inventoryByRule").show();
        } else if (inventoryCriterionType == "INVENTORY_BY_VALUE") {
            //按指定产品
            $("#ep2_editPromotionForm .promotionProductBox .inventoryByValue").show();
        } else {
            //全部产品
            //只展示第一个item
            $("#ep2_editPromotionForm .promotionProductBox .inventoryByRule").show();
            $("#ep2_editPromotionForm .promotionProductBox .epV2_inventoryByRule").hide();
        }
        layui.form.render();
    }

    /**
     * 初始化促销产品
     */
    function initPromotionProduct() {
        $("#ep2_editPromotionForm .promotionProductBox .ruleCriteria").append($("#ep2_promotionProductItemTpl").html());

    }

    function initOrderDiscountRuleOption() {
        var minQuantityRules = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 50, 75, 100]
        var forEachQuantityRules = minQuantityRules;
        var minAmountRules = [5, 10, 15, 20, 25, 35, 40, 45, 49, 50, 55, 59, 60, 65, 69, 70, 75, 79, 80, 85, 89, 90, 95, 99, 100, 110, 120, 125, 149, 150, 175, 199, 200, 249, 250, 299, 300, 350, 399, 400, 450, 499, 500];
        var forEachAmountRules = minAmountRules;
        var amountOffOrderRules = [5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 125, 150, 200, 250]
        var amountOffItemRules = amountOffOrderRules;
        var percentageOffOrderRuleMin = 5,
            percentageOffOrderRuleMax = 80;
        var percentageOffItemRuleMin = 5,
            percentageOffItemRuleMax = 80;
        var numberOfDiscountedItemsRules = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        var orderDiscountTypeItemDom = $("#ep2_editPromotionForm .orderDiscountType-item")
        initArrayOption(orderDiscountTypeItemDom.find("select[name=minQuantity]"), minQuantityRules);
        initArrayOption(orderDiscountTypeItemDom.find("select[name=forEachQuantity]"), forEachQuantityRules);
        initArrayOption(orderDiscountTypeItemDom.find("select[name=minAmount]"), minAmountRules);
        initArrayOption(orderDiscountTypeItemDom.find("select[name=forEachAmount]"), forEachAmountRules);
        initArrayOption(orderDiscountTypeItemDom.find("select[name=amountOffOrder]"), amountOffOrderRules);
        initArrayOption(orderDiscountTypeItemDom.find("select[name=amountOffItem]"), amountOffItemRules);
        initArrayOption(orderDiscountTypeItemDom.find("select[name=numberOfDiscountedItems]"), numberOfDiscountedItemsRules);
        initRangeOption(orderDiscountTypeItemDom.find("select[name=percentageOffOrder]"), percentageOffOrderRuleMin, percentageOffOrderRuleMax);
        initRangeOption(orderDiscountTypeItemDom.find("select[name=percentageOffItem]"), percentageOffItemRuleMin, percentageOffItemRuleMax);
    }

    function initArrayOption(selectDom, rules) {
        selectDom.empty();
        for (let rule of rules) {
            selectDom.append('<option>' + rule + '</option>');
        }
    }

    function initRangeOption(selectDom, ruleMin, ruleMax) {
        selectDom.empty();
        for (var i = ruleMin; i <= ruleMax; i++) {
            selectDom.append('<option>' + i + '</option>');
        }
    }

    //markdown sale重新初始化促销选择商品项目
    function refreshMarkdownRuleCriteria() {
        //根据降价类型判断
        var discountBenefit = $("#ep2_editPromotionForm  input[name=discountBenefit]:checked").val();
        if (discountBenefit == "percentageOffItem") {
            //按照百分比降价，根据折扣梯度设置多个规则
            var percentageOffItemDivDoms = $("#ep2_editPromotionForm .percentageOffItemDiv");
            //删除多余的规则
            $("#ep2_editPromotionForm  .ruleCriteria .layui-colla-item").eq(percentageOffItemDivDoms.length - 1).nextAll().remove();
            // 重新命名规则名称
            percentageOffItemDivDoms.each(function() {
                var percentageOffItem = $(this).find("input[name=percentageOffItem]").val();
                //获取index
                var index = $("#ep2_editPromotionForm .percentageOffItemDiv").index(this);
                var title = percentageOffItem ? "减免" + percentageOffItem + "%" : "";
                //如果促销产品规则不够，新增一项促销产品规则
                if ($("#ep2_editPromotionForm .ruleCriteria .layui-colla-title span").eq(index).length == 0) {
                    $("#ep2_editPromotionForm .ruleCriteria").append($("#ep2_promotionProductItemTpl").html());
                }
                $("#ep2_editPromotionForm .ruleCriteria .layui-colla-title span").eq(index).html(title);
            });
        } else {
            //其他，单个规则
            //删除多余的规则
            $("#ep2_editPromotionForm  .ruleCriteria .layui-colla-item").eq(0).nextAll().remove();
            //清除规则名称
            $("#ep2_editPromotionForm  .ruleCriteria .layui-colla-item .layui-colla-title span").html("");
        }
        //刷新规则内 全部/按规则/指定产品
        refreshInventoryCriterionType();
        layui.element.render("collapse");
        layui.form.render();
    }


    //markdown sale修改百分比折扣值，更新下面对应促销项名称
    $(document).on('input', '#ep2_editPromotionForm input[name=percentageOffItem]', function() {
        refreshMarkdownRuleCriteria();
    });
    //删除促销
    function deletePromotion(id) {
        layer.confirm('确定删除这条促销?', function(index) {
            initAjax('/ebayMarketingDiscount/deletePromotion.html', 'POST', { id: id }, function(returnData) {
                //删除后重新搜索
                $('#ep2_searchBtn').click();
                layer.msg("促销删除成功")
            }, 'application/x-www-form-urlencoded', true)
        });
    }
    //同步促销
    function syncPromotion(id) {
        layer.confirm('确定同步这条促销活动下的商品?', function(index) {
            initAjax('/ebayMarketingDiscount/syncEbayOnlineProductDiscount.html', 'POST', { eventId: id }, function(returnData) {
                layer.msg("促销商品同步成功")
            }, 'application/x-www-form-urlencoded', true)
        });
    }

    //同步店铺促销
    $("#ep2_asyncStore").click(function() {
        var storeId = $('#ep2_searchForm select[name=storeAcctId]').val();
        if (!storeId) {
            layer.msg('请先选择要同步的店铺', { icon: 0 });
            return;
        }
        //打开进度条
        showProcessBar();
        //ajax请求
        initAjax('/ebayMarketingDiscount/syncEbayDiscount.html',
            'POST', { storeAcctId: storeId },
            function(returnData) {
                layer.msg(returnData.data)
                clearProcessBar();
            },
            'application/x-www-form-urlencoded');
    });

    //促销状态tab切换重新查询
    element.on('tab(ep2_promotionStatusTab)', function(data) {
        $('#ep2_searchBtn').click();
    });
    //获取促销tab状态
    function getPromotionStatus() {
        var promotionStatus = $("#ep2_promotionStatusTab ul .layui-this").attr('data-index');
        console.log("促销状态:", promotionStatus);
        return promotionStatus;
    }

    //促销商品选择分类触发
    $(document).on('click', '#ep2_editPromotionForm .inventoryByRule .categoryChoose', function() {
        var storeAcctId = $('#ep2_editPromotionForm select[name=storeAcctId]').val();
        var marketplaceId = $('#ep2_editPromotionForm select[name=promotionMarketplaceId]').val();
        if (!(storeAcctId && marketplaceId)) {
            layer.msg("请选选择店铺和站点", { icon: 0 });
            return;
        }
        var ruleItemDom = $(this).parents('.layui-colla-item');
        //获取分类类型
        var categoryScope = ruleItemDom.find('select[name=categoryScope]').val();
        //获取类目
        var categoryData;
        if (categoryScope == 'MARKETPLACE') {
            //产品分类
            categoryData = loadEbayProdCate(storeAcctId, marketplaceId);
        } else if (categoryScope == 'STORE') {
            //店铺分类
            layer.msg("暂不支持店铺分类", { icon: 2 });
            return;
        } else {
            console.error("分类类型不正确：%s", categoryScope);
            return;
        }
        //选择分类
        var zTreeObj = {}
        layer.open({
            type: 1,
            title: '选择产品分类',
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#ep2_categoryTreeTpl').html(),
            success: function(index, layero) {
                // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "checkbox",
                        chkDisabledInherit: true,
                        chkboxType: { Y: "s", N: "s" }
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
                        onCheck: function(event, treeId, treeNode) {
                            //禁用所有子类
                            if (treeNode.isParent) {
                                var childrenNodes = treeNode.children;
                                try {
                                    for (var i = 0; i <= childrenNodes.length; i++) {
                                        zTreeObj.setChkDisabled(
                                            childrenNodes[i],
                                            treeNode.checked,
                                            false,
                                            true
                                        );
                                    }
                                } catch (e) {
                                    console.log(e)
                                }
                                var childrenIds = getChildren([], treeNode);
                                for (var i = 0; i < childrenIds.length; i++) {
                                    var node = zTreeObj.getNodeByParam("cateId", childrenIds[i]);
                                    zTreeObj.checkNode(node, treeNode.checked, false, true);
                                }
                            }
                        }
                    },
                };
                // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
                zTreeObj = $.fn.zTree.init($("#ep2_categoryTree"), setting, categoryData);
                //回显已选中的值
                var selectedCateIds = [];
                ruleItemDom.find(".categoryRuleTable tbody .cateName").each(function() {
                    var selectedCateId = $(this).data("id");
                    var selectedNode = zTreeObj.getNodeByParam("cateId", selectedCateId);
                    zTreeObj.checkNode(selectedNode, true, true, true);
                });
            },
            yes: function(index, layero) {
                //获取非禁用、选中节点
                var selectNodes = zTreeObj.getCheckedNodes(true);
                // debugger;
                for (var selectNode of selectNodes) {
                    //操作dom
                    var cateId = selectNode.cateId;
                    var cateName = selectNode.cateName;
                    if (ruleItemDom.find(".categoryRuleTable tbody .cateName[data-id=" + cateId + "]").length == 0) {
                        //如果不存在，加一行
                        ruleItemDom.find(".categoryRuleTable tbody").append($("#ep2_categoryPriceTrTpl").html());
                        //最后一行赋值
                        ruleItemDom.find(".categoryRuleTable tbody tr:last .cateName").attr('data-id', cateId);
                        ruleItemDom.find(".categoryRuleTable tbody tr:last .cateName").html(cateName);
                    }
                }
                layer.close(index);
            }
        });

    });


    //上传图片
    function initLocalImgUpload() {
        upload.render({
            elem: '#ep2_localImgUpload', //绑定元素
            url: ctx + '/ebayMarketingDiscount/uploadPic.html', //上传接口
            done: function(res) {
                if (res.code == "0000") {
                    $("#ep2_editPromotionForm input[name=promotionImageUrl]").val(res.data)
                    $('#ep2_promotionImgShow').html('<img src="' + res.data + '">')
                } else {
                    layer.msg(res.msg, { icon: 0 });
                }

            },
            error: function(res) {
                //请求异常回调
                //debugger;
            }
        });
    }

    $(document).on('click', "#ep2_onlineImgUpload", function() {
        layer.open({
            type: 1,
            title: '网络图片地址',
            btn: ['保存', '关闭'],
            area: ['40%', '200px'],
            content: $('#ep2_uploadOnline').html(),
            success: function(index, layero) {},
            yes: function(index, layero) {
                $('#ep2_submitImgurl').click()
                var imgurl = $(layero).find('input').val();
                $("#ep2_editPromotionForm input[name=promotionImageUrl]").val(imgurl)
                $('#ep2_promotionImgShow').html('<img src="' + imgurl + '">')
                layer.close(index)
            }
        });
    });


    //公共和辅助方法
    //初始化店铺
    function initUserStore() {
        initAjax('/sys/liststore.html',
            'POST', { roleNames: 'ebay专员', platCode: 'ebay' },
            function(returnData) {
                userStores = returnData.data;
            },
            'application/x-www-form-urlencoded'
        );
    }
    //初始化站点
    function initEbaySite() {
        initAjax('/ebayMarketingDiscount/getEbaySiteList.html',
            'GET', {},
            function(returnData) {
                ebaySites = returnData.data.ebaySiteList;
                console.log("init ebaySites:" + ebaySites.ebaySiteList);
            },
            'application/x-www-form-urlencoded'
        );
    }


    //获取产品树
    function initCategoryTree(storeAcctId, marketplaceId) {
        initAjax('/ebayMarketingDiscount/getEbayProdCateList.html', 'GET', { storeAcctId: storeAcctId, marketplaceId: marketplaceId }, function(returnData) {
            //加入到缓存里
            var cacheKey = /*storeAcctId + */ marketplaceId;
            if (returnData.code == '0000') {
                ebayProdCateCache[cacheKey] = returnData.data;
            }
        }, 'application/json', false)
    }
    /**
     * 加载eBay类目
     * @param storeAcctId
     * @param marketplaceId
     */
    function loadEbayProdCate(storeAcctId, marketplaceId, callback) {
        var cacheKey = /*storeAcctId + */ marketplaceId;
        if (!ebayProdCateCache[cacheKey]) {
            //如果缓存中没有，ajax同步方法加载
            layer.msg("初始化eBay商品类目,稍等一会");
            loading.show()
            $.ajax({
                url: ctx + '/ebayMarketingDiscount/getEbayProdCateList.html',
                type: 'get',
                dataType: 'json',
                async: false,
                data: {
                    "storeAcctId": storeAcctId,
                    "marketplaceId": marketplaceId
                },
                success: function(returnData) {
                    loading.hide()
                    if (returnData.code == '0000') {
                        ebayProdCateCache[cacheKey] = returnData.data;
                    } else {
                        layer.msg("加载eBay产品类目失败" + returnData.msg, { icon: 2 });
                    }
                },
                error: function() {
                    loading.hide();
                    layer.msg('网络错误，请联系管理员');
                }
            })
        }
        console.log("加载eBay产品类目树,%s,%s", storeAcctId, marketplaceId);
        if (callback) {
            callback(ebayProdCateCache[cacheKey]);
        }
        return ebayProdCateCache[cacheKey];
    }

    /**
     * 加载eBay店铺类目
     * @param storeAcctId
     * @param marketplaceId
     * @returns {*}
     */
    function loadEbayStoreCate(storeAcctId, marketplaceId) {
        var cacheKey = storeAcctId /* + marketplaceId*/ ;
        if (!ebayStoreCateCache[cacheKey]) {
            //如果缓存中没有，ajax同步方法加载
            loading.show()
            $.ajax({
                url: ctx + '/ebayMarketingDiscount/getEbayStoreCates.html',
                type: 'get',
                dataType: 'json',
                async: false,
                data: {
                    "storeAcctId": storeAcctId,
                    "marketplaceId": marketplaceId
                },
                success: function(returnData) {
                    loading.hide()
                    if (returnData.code == '0000') {
                        ebayStoreCateCache[cacheKey] = returnData.data;
                    } else {
                        layer.msg("加载eBay店铺类目失败" + returnData.msg, { icon: 2 });
                    }
                },
                error: function() {
                    loading.hide();
                    layer.msg('网络错误，请联系管理员');
                }
            })
        }
        console.log("加载eBay店铺类目树,%s,%s", storeAcctId, marketplaceId);
        return ebayStoreCateCache[cacheKey];
    }


    //初始化ajax请求
    function initAjax(url, method, data, func, contentType, showLoading) {
        //默认不loading
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
                        clearProcessBar();
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
        });
    }
    //展示进度条
    function showProcessBar() {
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: '同步进度',
            area: ['50%', '200px'],
            content: '<div class="m20"><div class="layui-progress layui-progress-big" lay-filter="processBar" lay-showpercent="true"><div class="layui-progress-bar" lay-percent="0%"><span class="layui-progress-text">0%</span></div></div></div>',
            success: function() {
                var pro = 0;
                timer = setInterval(function() {
                    pro += 1;
                    if (pro < 97) {
                        $('.layui-progress-text').text(pro > 100 ? 100 + '%' : pro + '%');
                        layui.element.progress('processBar', pro + '%');
                    }
                }, 1000);
            }
        });
    }
    //关闭进度条
    function clearProcessBar() {
        layui.element.progress('processBar', '100%');
        setTimeout(function() {
            clearInterval(timer);
            layer.closeAll();
        }, 1000);
    }
    //获取ztree所有字节点id
    function getChildren(ids, treeNode) {
        ids.push(treeNode.cateId);
        if (treeNode.isParent) {
            for (var obj in treeNode.children) {
                getChildren(ids, treeNode.children[obj]);
            }
        }
        return ids;
    }

    //选择指定产品-------------------------------PREPARED------------------------------------------------------------------------------------------------------------------------------------------------
    // 获取在线商品
    function getOnlineProducts(data) {
        const { limit, page, excludeItemIds, isSelected, currentPriceEnd, currentPriceStart, primaryCateIds, promotionMarketplaceId, storeAcctId, storePrimaryCateIds, title } = data
        initAjax('/ebayMarketingDiscount/searchEbayOnlineProduct.html',
            'POST', { limit, page, excludeItemIds, isSelected, currentPriceEnd, currentPriceStart, primaryCateIds, promotionMarketplaceId, storeAcctId, storePrimaryCateIds, title },
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
                    limit: 300,
                    id: 'ebayPromotion2OnlineProductTable',
                    done: function(res, count) {
                        imageLazyload();
                    }
                })
                layui.laypage.render({
                    elem: 'ebaypromotion2chooseproduct',
                    count: returnData.count, //数据总数，从服务端得到
                    limit: limit,
                    limits: [50, 100, 300],
                    curr: page,
                    jump: function(obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        $('#searchOnlineProductForm input[name="limit"]').val(obj.limit)
                        $('#searchOnlineProductForm input[name="page"]').val(obj.curr)
                            //首次不执行
                        if (!first) {
                            $('#searchOnlineproducts').click()
                        }
                    }
                });
            },
            'application/x-www-form-urlencoded')
    }

    table.on('tool(ebayPromotion2OnlineProductTable)', function(obj) {
        if (obj.event === "addproducts") {
            selectedProduct.push(obj.data.itemId)
            $('#searchOnlineproducts').click()
        } else if (obj.event === "removeproducts") {
            var index = selectedProduct.indexOf(obj.data.itemId)
            selectedProduct.splice(index, 1)
            $('#searchOnlineproducts').click()
        }
    })
    $(document).on('click', '.chooseProduct', function() {
            var storeAcctId = $('#ep2_editPromotionForm select[name=storeAcctId]').val();
            var promotionMarketplaceId = $('#ep2_editPromotionForm select[name=promotionMarketplaceId]').val();
            var collaItemDom = $(this).parents(".layui-colla-item");
            layer.open({
                type: 1,
                title: '选择指定产品',
                btn: ['保存', '关闭'],
                area: ['70%', '80%'],
                content: $('#pop_specificproduct').html(),
                success: function(layero, index) {
                    $(layero).find('.layui-layer-btn0').addClass('hide')
                    $(layero).find('#ebaypromotion2_batchremove').addClass('hide')
                    $("#chooseCategoryInput").click(debounce(function(event) {
                        event.stopPropagation()
                        event.preventDefault()
                        var index = $(this).attr('data-index')
                        getProductsTreepop(storeAcctId, promotionMarketplaceId)
                    }, 1000, 2000))
                    $('#searchOnlineproducts').click(function() {
                        var data = serializeObject($('#searchOnlineProductForm'))
                        if ($('#producttypeSpan').text() !== "All Inventory") {
                            var treeType = $('#producttypeSpan').text()
                            treeType === ">>eBay catrgories" ?
                                data.primaryCateIds = data.categoryids : data.storePrimaryCateIds = data.categoryids
                        }
                        data.excludeItemIds = selectedProduct.length > 0 ? selectedProduct.join(',') : ''
                        data.promotionMarketplaceId = promotionMarketplaceId //修改为当前站点
                        data.storeAcctId = storeAcctId //修改为当前店铺
                        getOnlineProducts(data)
                    })
                    $('#selectableproduct li').click(function() {
                        var isSelected = $(this).attr('data-index')
                        $('#searchOnlineProductForm input[name="isSelected"]').val(isSelected)
                        $('#searchOnlineproducts').click()
                        if (isSelected === "0") {
                            $(layero).find('.layui-layer-btn0').addClass('hide')
                            $(layero).find('#ebaypromotion2_batchremove').addClass('hide')
                            $(layero).find('#ebaypromotion2_batchadd').removeClass('hide')
                        } else {
                            $(layero).find('.layui-layer-btn0').removeClass('hide')
                            $(layero).find('#ebaypromotion2_batchadd').addClass('hide')
                            $(layero).find('#ebaypromotion2_batchremove').removeClass('hide')
                        }
                    })
                    $('#ebaypromotion2_batchadd').click(function() {
                        var data = table.checkStatus('ebayPromotion2OnlineProductTable').data
                        if (data.length > 0) {
                            for (var i in data) {
                                selectedProduct.push(data[i].itemId)
                            }
                            $('#searchOnlineproducts').click()
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
                            $('#searchOnlineproducts').click()
                        } else {
                            layer.msg('请勾选要移除的商品')
                        }
                    })
                },
                yes: function(index, layero) {
                    //返回选择商品的itemid ----------------------
                    var datas = table.checkStatus('ebayPromotion2OnlineProductTable').data;
                    var itemIds = [];
                    for (var data of datas) {
                        itemIds.push(data.itemId);
                    }
                    collaItemDom.find("textarea[name=listingIds]").val(itemIds.join(","));
                    collaItemDom.find(".listingIdNum").html(itemIds.length);
                    layer.close(index);
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
    function getProductsTreepop(storeAcctId, promotionMarketplaceId) {
        var zTreeObj = {}
        layer.open({
            type: 1,
            title: '选择产品',
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#pop_productsTree').html(),
            success: function(index, layero) {
                form.render('radio');
                zTreeObj = $.fn.zTree.init($("#productsTree"), setting, loadEbayProdCate(storeAcctId, promotionMarketplaceId));
                form.on('radio(catetype)', function(obj) {
                    if (obj.value === 'eBay catrgories') {
                        //站点id
                        zTreeObj = $.fn.zTree.init($("#productsTree"), setting, loadEbayProdCate(storeAcctId, promotionMarketplaceId));
                    } else if ((obj.value === 'All Inventory')) {
                        zTreeObj = $.fn.zTree.init($("#productsTree"), setting, []);
                    }
                })
            },
            yes: function(index, layero) {
                var nodes = zTreeObj.getCheckedNodes(true);
                // var pnodes = []
                // for (var i in nodes) {
                //     if (nodes[i].children && nodes[i].children.length > 0) {
                //         pnodes.push(nodes[i].cateId)
                //     }
                // }
                // nodes = nodes.filter(function(item) {
                //     return pnodes.indexOf(item.pCateId) < 0
                // })
                // console.log(nodes,'sdfd')
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

    laytpl.getBaseSale = function(promotionData) {
        try {
            var baseSaleJson = promotionData.baseSale;
            if (baseSaleJson) {
                var baseSaleObject = JSON.parse(baseSaleJson);
                var baseSale = baseSaleObject.value;
                return baseSale;
            }
            return "";
        } catch (err) {
            console.error(err);
            return "Base sale解析失败";
        }
    }

    laytpl.getPromotionSale = function(promotionData) {
        try {
            var promotionSaleJson = promotionData.promotionSale;
            if (promotionSaleJson) {
                var promotionSaleObject = JSON.parse(promotionSaleJson);
                var promotionSale = promotionSaleObject.value;
                return promotionSale;
            }
            return "";
        } catch (err) {
            console.error(err);
            return "Promotion sale解析失败";
        }
    }

    laytpl.getTotalSale = function(promotionData) {
        try {
            var totalSaleJson = promotionData.totalSale;
            if (totalSaleJson) {
                var totalSaleObject = JSON.parse(totalSaleJson);
                var totalSale = totalSaleObject.value;
                return totalSale;
            }
            return "";
        } catch (err) {
            console.error(err);
            return "Total sale解析失败";
        }
    }

    laytpl.getAverageOrderSize = function(promotionData) {
        try {
            var averageOrderSize = promotionData.averageOrderSize;
            if (averageOrderSize) {
                averageOrderSize = Math.floor(averageOrderSize);
                return averageOrderSize;
            } else {
                return 0;
            }
        } catch (err) {
            console.error(err);
            return "AverageOrderSize解析失败";
        }
    }

    //促销优先级摘要
    laytpl.getPromotionPriority = function(promotionData) {
        try {
            var priority = promotionData.promotionPriority;
            if (priority) {
                if (priority.indexOf('_') > 1) {
                    priority = priority.substr(priority.indexOf('_') + 1)
                }
                return priority;
            }
            return '';
        } catch (err) {
            console.error(err);
            return "Display priority解析失败";
        }
    }

    //促销内容摘要
    laytpl.getPromotionContent = function(promotionData) {
        try {
            var promotionContents = buildPromotionContent(promotionData);

            return promotionContents.join("<br>");
        } catch (err) {
            console.error(err);
            return "促销内容解析失败";
        }
    }

    function buildPromotionContent(promotionData) {
        var promotionContents = [];
        var promotionType = promotionData.promotionType;
        if (promotionType === 'VOLUME_DISCOUNT') {
            if (!promotionData.discountRules) {
                return promotionContents;
            }
            var discountRules = JSON.parse(promotionData.discountRules);
            if (discountRules) {
                for (var discountRule of discountRules) {
                    var minQuantity = discountRule.discountSpecification.minQuantity;
                    var percentageOffOrder = discountRule.discountBenefit.percentageOffOrder;
                    if (percentageOffOrder == 0) {
                        promotionContents.push("买" + minQuantity + "个,不打折");
                    } else {
                        promotionContents.push("买" + minQuantity + "个, 每个减" + percentageOffOrder + "%");
                    }
                }
            }

        } else if (promotionType === 'ORDER_DISCOUNT') {
            if (!promotionData.discountRules) {
                return promotionContents;
            }
            var discountRules = JSON.parse(promotionData.discountRules);
            if (discountRules) {
                for (var discountRule of discountRules) {
                    //每满金额
                    var forEachAmount;
                    //每买数量
                    var forEachQuantity;
                    //满金额
                    var minAmount;
                    //买数量
                    var minQuantity;
                    //优惠数量
                    var numberOfDiscountedItems;

                    //订单减免金额
                    var amountOffOrder;
                    //订单优惠百分比
                    var percentageOffOrder;
                    //每个优惠百分比,与numberOfDiscountedItems一起用
                    var percentageOffItem;

                    var amountOffItem;

                    //折扣条件
                    var discountSpecification = discountRule.discountSpecification;
                    //减免结果
                    var discountBenefit = discountRule.discountBenefit;
                    //每一项值
                    forEachAmount = discountSpecification.forEachAmount;
                    forEachQuantity = discountSpecification.forEachQuantity
                    minAmount = discountSpecification.minAmount;
                    minQuantity = discountSpecification.minQuantity;
                    numberOfDiscountedItems = discountSpecification.numberOfDiscountedItems;
                    amountOffOrder = discountBenefit.amountOffOrder;
                    percentageOffOrder = discountBenefit.percentageOffOrder;
                    percentageOffItem = discountBenefit.percentageOffItem;
                    amountOffItem = discountBenefit.amountOffItem;
                    var promotionContent;
                    if (minAmount && amountOffOrder) {
                        //1.1满 _减 $_ 
                        promotionContent = "满" + minAmount.value + "(" + minAmount.currency + ")" + "减" + amountOffOrder;
                    } else if (minAmount && percentageOffOrder) {
                        //1.2满 _减 _ %
                        promotionContent = "满" + minAmount.value + "(" + minAmount.currency + ")" + "减" + percentageOffOrder + "%";
                    } else if (forEachAmount && amountOffOrder) {
                        //1.3每满 _减 _ %
                        promotionContent = "每满" + forEachAmount.value + "(" + forEachAmount.currency + ")" + "个,减" + amountOffOrder;
                    } else if (minQuantity >= 1 && amountOffOrder) {
                        //2.1买满_个，减$_
                        promotionContent = "买满" + minQuantity + "个,减" + amountOffOrder.value + "(" + amountOffOrder.currency + ")";
                    } else if (minQuantity >= 1 && percentageOffOrder) {
                        //2.2买满_个，减_%
                        promotionContent = "买满" + minQuantity + "个,减" + percentageOffOrder + "%";
                    } else if (forEachQuantity >= 1 && amountOffOrder) {
                        //2.3每买满_个，减$_
                        promotionContent = "每买满" + forEachQuantity + "个,减" + amountOffOrder.value + "(" + amountOffOrder.currency + ")";
                    } else if (forEachQuantity >= 1 && numberOfDiscountedItems >= 1 && percentageOffItem == 100) {
                        //3.1每买_个，赠_个
                        promotionContent = "每买" + forEachQuantity + "个,赠" + numberOfDiscountedItems + "个";
                    } else if (forEachQuantity >= 1 && numberOfDiscountedItems >= 1 && percentageOffItem < 100) {
                        //3.2每买_个，获得_个优惠_%
                        promotionContent = "每买" + forEachQuantity + "个,获得" + numberOfDiscountedItems + "个优惠" + percentageOffItem + "%";
                    } else if (minQuantity >= 1 && numberOfDiscountedItems >= 1 && percentageOffItem == 100) {
                        //3.3每买_个，赠_个（仅一次）
                        promotionContent = "每买" + forEachQuantity + "个,赠" + numberOfDiscountedItems + "个（仅一次）";
                    } else if (minQuantity >= 1 && numberOfDiscountedItems >= 1 && percentageOffItem < 100) {
                        //3.4买_个，获得_个优惠_%（仅一次）
                        promotionContent = "每买" + forEachQuantity + "个,获得" + numberOfDiscountedItems + "个优惠" + percentageOffItem + "（仅一次）";
                    } else if (minQuantity = 1 && amountOffOrder) {
                        //4.1下单即减$_
                        promotionContent = "下单立减" + amountOffOrder.value + "(" + amountOffOrder.currency + ")";
                    } else if (minQuantity = 1 && percentageOffOrder) {
                        //4.2下单即减%
                        promotionContent = "下单立减" + percentageOffOrder + "%";
                    } else if (forEachQuantity = 1 && amountOffItem) {
                        //4.3每个产品减$_
                        promotionContent = "每个产品减" + amountOffItem.value + "(" + amountOffItem.currency + ")";
                    }
                    if (promotionContent) {
                        promotionContents.push(promotionContent);
                    }
                }
            }

        } else if (promotionType === 'MARKDOWN_SALE') {
            if (!promotionData.selectedInventoryDiscounts) {
                return promotionContents;
            }
            var selectedInventoryDiscounts = JSON.parse(promotionData.selectedInventoryDiscounts);
            if (selectedInventoryDiscounts) {
                for (var selectedInventoryDiscount of selectedInventoryDiscounts) {
                    var percentageOffItem = selectedInventoryDiscount.discountBenefit.percentageOffItem;
                    var amountOffItem = selectedInventoryDiscount.discountBenefit.amountOffItem;
                    if (percentageOffItem) {
                        //按百分比降价
                        promotionContents.push("每个产品减" + percentageOffItem + "%");
                    } else {
                        //按金额降价
                        promotionContents.push("每个产品减" + amountOffItem.value + "(" + amountOffItem.currency + ")");
                    }
                }
            }
        }
        return promotionContents;
    }

    //选择指定产品----------------------------------------------------------------------------------------------------------------------------------------------------------------

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
});