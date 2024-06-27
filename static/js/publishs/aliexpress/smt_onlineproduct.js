/**smt在线商品的js*/
var smt_arr =  new Array();
var last_smt_arr =  new Array();
var timeUnit;
var smtSkus;
// 仅调整待调价商品价格的定时器
var smtMoCommodPriceTimeUnit = null
// 区域调价定时器
var smtMoAreaPriceTimeUnit = null;
// 调整价格定时器
var smtMopriceTimeUnit;
// 调整备货期定时器
var smtMoDeliverTimeUnit;
// 调整区域调价和运费模板
var smtMoFreightTplTimeUnit = null
// 批量上架
var smtOnlineaeproductUnit = null
// 上传视频
var smtOnlineUploadVideoUnit = null
// 批量调整商品资质
var smtProductQualificationUnit = null
// 弹窗的
var layerArr=[]
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'laydate','formSelects'], function () {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        element = layui.element,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        form = layui.form;
    form.render('checkbox');
    form.render('select'); //刷新select选择框渲染
    formSelects.render('storeAcctGroup')
    
    /**
     * 日期渲染
     */
    laydate.render({
        elem: '#smt_online_listtime',
        range: true
    });
    laydate.render({
        elem: '#smt_online_canListingTime',
        range: true
    });

    render_hp_orgs_users("#smt_online_searchForm");//渲染部门销售员店铺三级联动

    $('#smt_online_search_reset').on('click', function(){
        $('#smt_online_depart_sel').next().find('dd[lay-value=""]').trigger('click');
    });
    
    var bacthMarkArray = [{},{},{},{},{},{},{},{}];

    // 初始化下架原因list
    smtOnline_initWsDisplayList();
    function smtOnline_initWsDisplayList() {
        commonReturnPromise({url: ctx + "/onlineProductSmt/getWsDisplayEnum",}).then(data=>{
            let arr = [];
            for(let key in data){
                arr.push({name:key,value:data[key]})
            }
            formSelects.data('smt_online_wsDisplayList', 'local', {arr: arr});
            formSelects.render('smt_online_wsDisplayList',{ placeholder: '全部' })
        })
    }

    smtOnline_initFreightTemplate();
    /**
     * 速卖通初始化运费模板数据
     */
    function smtOnline_initFreightTemplate(storeAcctId){
        $("#smt_online_freight_template_sel").html("<option value=''></option>");
        $("#smt_online_region_price_template_sel").html("<option value=''></option>");
        $.ajax({
            url: ctx + "/onlineProductSmt/getMsgFreightTemplateSmtList.html",
            dataType: "json",
            data:{'storeAcctId':storeAcctId},
            type: "post",
            success: function (returnData) {
                if (returnData.code == "0000"&&returnData.data != null) {
                    $(returnData.data.freightList).each(function () {
                        $("#smt_online_freight_template_sel").append("<option value='" + this.templateId + "'>" + this.templateName + "</option>");
                    });
                    var regionStr="<option value=''></option><option value='0'>无</option>";
                    $(returnData.data.regionPriceList).each(function () {
                        regionStr+="<option value='" + this.templateId + "'>" + this.templateName + "</option>"
                    });
                    $("#smt_online_region_price_template_sel").html(regionStr);
                    var currentLogisAttr= [];
                    $(returnData.data.logisAttrList).each(function () {
                        var a = {name: this.name, value: this.name};
                        currentLogisAttr.push(a);
                    });
                    var productLabelList=returnData.data.productLabelList;//商品标签
                    var labelStr="<option value=''>请选择</option>";
                    $(productLabelList).each(function () {
                        labelStr+="<option value='"+this.name+"'>"+this.name+"</option>";
                    });
                    $("#smt_online_productLabel_sel").html(labelStr);
                    formSelects.data('smt_online_logistics_sel', 'local', {arr: currentLogisAttr});
                    form.render();
                    formSelects.render('smt_online_logistics_sel')
                    formSelects.render('smt_online_freight_template_sel')
                } else {
                    layer.msg(returnData.msg,{icon:0});
                }
            },
            error: function () {
                layer.msg("服务器异常",{icon:5});
            },
        });
    }

    smtOnline_initDiscount();
    /**
     * 速卖通初始化单品折扣数据
     */
     function smtOnline_initDiscount(storeAcctId=''){
        commonReturnPromise({
            type: "post",
            url: ctx + "/onlineProductSmt/getPromotionInfo.html",
            params: { storeAcctId },
        }).then(data=>{
                commonRenderSelect('smt_online_discount',data,{name:'promotionName',code:'promotionId',})
                .then(()=>form.render('select'))
        })
     }

    smtOnline_initRegionriceCountry();
    /**
     * 速卖通初始化调价国家数据
     */  
    function smtOnline_initRegionriceCountry(){
        commonReturnPromise({
            url:ctx+'/aliexpress/publish/regionPriceCountry'
        }).then(data=>{
            let _data =Array.isArray(data) ? data.map(item=>({name:Object.values(item)[0],value:Object.keys(item)[0]})):[]
            formSelects.data('smt_online_regionPriceCountryList','local',{arr:_data})
        })
    }
  /**
 * 速卖通初始化调诊断结果
 */ smtOnline_initDiagnosisProblemType()
    function smtOnline_initDiagnosisProblemType(){
        commonReturnPromise({
            url: '/lms/onlineProductSmt/getAliexpressDiagnosisProblemType'
        }).then(data=>{
            console.log('data :>> ', data);
            commonRenderSelect('smt_online_diagnosisProblemType',data,{name:'name',code:'code'})
            .then(()=>form.render())
        })
    }
    /**
     * 店铺改变事件
     */
    formSelects.on('smt_online_store_sel', function (id, vals) {
        let _vals = vals.map(item => item.value).join()
        smtOnline_initFreightTemplate(_vals);
        smtOnline_initDiscount(_vals)
            $.ajax({
                url: `${ctx}/batchOperation/getStoreAcctGroup.html`,
                data:{storeAcctId:_vals},
                dataType: "json",
                type: "post",
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code == "0000") {
                        var arr = [{ name: '无分组', value: '-99' }];
                    for (let i = 0; i < returnData.data.length; i++) {
                        var temp = {};
                        temp.name = returnData.data[i].groupName;
                        temp.value = returnData.data[i].groupId;
                        arr.push(temp);
                    }
                    formSelects.data('storeAcctGroup', 'local', {arr: arr})
                    } else {
                        layer.msg(returnData.msg,{icon:5});
                    }
                },
                error: function () {
                    layer.msg("服务器正忙",{icon:5});
                }
            });
    }, true)
    // 导出
    $('#smt_online_online_export').click(function(){
        layer.open({
            title: '导出字段配置',
            content: $('#smt_onlineproducts_exportSetting').html(),
            offset: '100px',
            type: 1,
            area: ['1000px', '700px'],
            btn: ['确认', '关闭'],
            success:function(layero){
                commonReturnPromise({
                    url: '/lms/onlineProductSmt/getExportPropertiesEnum'
                }).then(returnData=>{
                    const arr = [
                        {
                            name:'product信息',
                            key:"productExportProperties",
                            checked: true,
                            list: returnData.product
                        },
                        {
                            name:'variation信息',
                            checked: true,
                            key:"variationExportProperties",
                            list: returnData.variation
                        },
                        // {
                        //     name:'违规信息',
                        //     checked: false,
                        //     key:"violationInfoExportProperties",
                        //     list: returnData.violationInfoExportProperties
                        // },
                    ]
                    laytpl($("#smt_onlineproducts_exportSetting").html()).render(arr, function (html) {
                        $(layero).find('.layui-layer-content').html(html);
                        form.render()
                    })
                    // 模板查询赋值
                    commonSaveSearchTpl({
                        id: "smt_online_exportSetting_save",
                        formId: "smt_online_exportSetting_form",
                        pageName: "smt_onlineproduct_exportSetting",
                        btnText: "保存配置",
                        layerTitleText: '保存自定义配置条件',
                        cb: (param) => {
                            // 赋值
                            arr.forEach(item=>{
                                // switch
                                $(layero).find(`input[name=${item.key}]`).prop('checked',!!param[item.key])
                                // checkbox
                                let checkedList = []
                                if(param['checkbox_'+item.key]){
                                    checkedList = param['checkbox_'+item.key].split(',')
                                }
                                $(layero).find(`input[name=checkbox_${item.key}]`).each(function(){
                                    const isChecked = checkedList.includes($(this).val())
                                    $(this).prop('checked', isChecked)
                                })
                            })
                            form.render()
                        },
                    });
                    arr.forEach(item=>{
                        form.on(`switch(exportSetting_${item.key})`,function(data){
                            const checked = data.elem.checked
                            $(layero).find(`input[name=checkbox_${item.key}]`).each(function(){
                                $(this).prop('checked', checked)
                            })
                            form.render()
                        })
                        // 字段存在手动取消选中时，全选按钮自动改为非全选状态；非全选状态时，若手动选择下方全部复选框，自动改为全选状态；
                        form.on(`checkbox(exportSetting_checkbox_${item.key})`,function(data){
                            const checked = data.elem.checked
                            if(!checked){
                                $(layero).find(`input[name=${item.key}]`).prop('checked',false)
                            }else{
                                const checkedListLength = $(layero).find(`input[name=checkbox_${item.key}]:checked`).length
                                if(checkedListLength == item.list.length){
                                    $(layero).find(`input[name=${item.key}]`).prop('checked',true)
                                }
                            }
                            form.render()
                        })
                    })
                })},
            yes:function(index, layero){
                // product和variation至少选中一个

                const productPropertySelectedCodeList=[]
                const variationPropertySelectCodeList=[]
                // const violationInfoPropertySelectCodeList=[]

                $(layero).find(`input[name=checkbox_productExportProperties]`).each(function(){
                    const checked = $(this).prop('checked')
                    const value = $(this).val()
                    if(checked){
                        productPropertySelectedCodeList.push(value)
                    }
                })
                $(layero).find(`input[name=checkbox_variationExportProperties]`).each(function(){
                    const checked = $(this).prop('checked')
                    const value = $(this).val()
                    if(checked){
                        variationPropertySelectCodeList.push(value)
                    }
                })
                // $(layero).find(`input[name=checkbox_violationInfoExportProperties]`).each(function(){
                //     const checked = $(this).prop('checked')
                //     const value = $(this).val()
                //     if(checked){
                //         violationInfoPropertySelectCodeList.push(value)
                //     }
                // })

                // console.log(productPropertySelectedCodeList)
                // console.log(variationPropertySelectCodeList)
                // if(!productPropertySelectedCodeList.length || !variationPropertySelectCodeList.length){
                //     return layer.msg('product信息和variation信息的导出字段都要至少选中一项')
                // }

        var data = smtOnline_getSerachData()



                var itemData = table.checkStatus('smt_online_data_table').data //获取选择的店铺
                var itemIds = []
                for (var index in itemData) {
                    var obj = itemData[index]
                    itemIds.push(obj.itemId)
                }
                if (itemData != null && itemData.length > 0) {
                    data.itemId = itemIds.join(',')
                }
                console.log(data)



                let layerIndex = layer.open({
            title: '导出提示',
            content: $('#smt_online_online_export_container_script').html(),
            offset: '100px',
            type: 1,
            area: ['400px', '200px'],
            btn: ['确认', '关闭'],
            success: function (layero, index) {
                initAjax('/shopee/onlineProductShopee/searchProcessingExportCount.html',
                'get', { platCode: 'aliexpress' },
                function (returnData) {
                    var checkStoreAcctIds = data.storeAcctId
                    var processingCount = returnData.data
                    var message = '当前正在执行导出的任务数量-->[' + processingCount + '];</br>'
                    if (checkStoreAcctIds) {
                    var split = checkStoreAcctIds.split(',')
                    if (split.length > 20) {
                        message += '<span style=\'color: red\'>当前您勾选的店铺个数过多,或<strong>没有选择任何店铺</strong>!</span></br>'
                    } else {
                        message += '<span>当前您导出数据勾选的店铺数量-->[' + split.length + ']</span></br>'
                    }
                    } else {
                    message += '<span style=\'color: red\'>当前您导出数据没有勾选任何店铺数据信息!</span></br>'
                    }
                    message += '过多的数据导出将会消耗很长时间,请确认是否导出此数据?'
                    $('#smt_online_online_export_container').html(message)
                    $('#smt_online_online_export_container').css('padding', '15px')
                }
                )
            },
            yes: function (index, layero) {
                var itemData = table.checkStatus('smt_online_data_table').data //获取选择的店铺
                var itemIds = []
                for (var index in itemData) {
                var obj = itemData[index]
                itemIds.push(obj.itemId)
                }
                if (itemData != null && itemData.length > 0) {
                data.itemId = itemIds.join(',')
                }

                submitForm({
                    ...data,
                    productExportFields: productPropertySelectedCodeList.join(),
                    variationExportFields: variationPropertySelectCodeList.join(),
                }, ctx + '/onlineProductSmt/exportAliexpressOnlineInfo', '_blank')
                layer.close(layerIndex)
            },
            btn2: function (index, layero) {
                layer.close(layerIndex) //如果设定了yes回调，需进行手工关闭
            },
        })
        }
   })
})
    /**
     * 批量打标签
     */
    form.on('select(smt_online_tagsOperate_sel)', function (data) {
        var marks = $.trim(data.value);
        if (marks == null || marks == '') {
            return false;
        }
        var itemData = table.checkStatus('smt_online_data_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择要打标签的lisiting", {icon: 0});
            return;
        }
        var exmarks="";
        for (var i in bacthMarkArray) {
            var obj = bacthMarkArray[i];
            if(obj.marks==marks){
                exmarks=obj.exmarks;
                break;
            }
        }
        if(marks == 5){//批量备注
            var itemData = table.checkStatus('smt_online_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            var listingRemark="";
            var index= layer.open({
                type: 1,
                title: '批量修改备注',
                offset:'100px',
                area: ["600px", "400px"],
                btn: ["保存", "取消"],
                content: '<div style="padding:20px"><textarea id="smt_online_bactchListingRemark_text" class="layui-textarea"></textarea></div>',
                yes: function (index, layero) {
                    listingRemark= $("#smt_online_bactchListingRemark_text").val();
                    if(listingRemark==null||listingRemark==''){
                        layer.msg("批量修改备注失败，备注不能为空", {icon: 0});
                        return;
                    }
                    layer.close(index);
                    var updateArray=[];
                    for (var index in itemData) {
                        var updateObj={};
                        var obj = itemData[index];
                        updateObj.id=obj.id;
                        updateObj.listingRemark=listingRemark;
                        updateArray.push(updateObj);
                    }
                    smtOnline_bacthUpdateItemRemark(updateArray,"批量修改备注");
                }, end: function () {
                    layer.close(index);
                }
            });
            return;
        }else{
            if(itemData.length >1 ){
                var confirmindex = layer.confirm('确认将<span style="color:blue"> '+itemData.length+' </span>条lisiting打上<span style="color:blue"> '+marks+'</span> 标签',{btn:['确认','取消']},function (result) {
                    if(result){
                        layer.close(confirmindex );
                        smtOnline_bacthMarksSmtItem(itemData,marks,exmarks,"");
                    }
                })
            }else{
                smtOnline_bacthMarksSmtItem(itemData,marks,exmarks,"");
            }
        }
    });
    /**
     * 批量操作(上下架，调价等)
     */
    form.on('select(smt_online_apiOperate_sel)', function (data) {
        var selected = $.trim(data.value);
        if (selected == null || selected == '') {
            return false;
        }
        if (selected == 0) {//批量更新
            var itemData = table.checkStatus('smt_online_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            var itemIds = [];
            for (var index in itemData) {
                var obj = itemData[index];
                itemIds.push(obj.storeAcctId + "&" + obj.itemId);
            }
            smtOnline_syncBacthSmtItem(itemIds.join(","));
            return;
        }else if(selected == 1){ //批量删除
            var itemData = table.checkStatus('smt_online_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            var updateArray=[];
            for (var index in itemData) {
                var updateObj={};
                var obj = itemData[index];
                updateObj.id=obj.id;
                updateArray.push(updateObj);
            }
            smtOnline_deleteBacthSmtItem(updateArray);
            return;
        }else if (selected == 8 || selected == 9){
            // var boo = false;
            var itemData = table.checkStatus('smt_online_data_table').data; //获取选择的店铺
            if(!itemData.length){
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            let storeIds = [...new Set(itemData.map(item => item.storeAcctId))]
            if(storeIds.length != 1){
                layer.msg("请选择同一店铺数据", {icon: 0});
                return;
            }
            // if(smt_arr != null && smt_arr.length > 0) {
            //     $.ajax({
            //         type: "POST",
            //         url: ctx + "/batchOperation/isOneStoreAcct.html",
            //         data: JSON.stringify(itemData.map(item => item.id)),
            //         contentType: 'application/json',
            //         async: false,
            //         dataType: 'json',
            //         success: function (data) {
            //             if (data.code == "0000") {
            //                 if (data.data == false) {
            //                     layer.msg("请选择同一店铺的数据");
            //                     // boo = true;
            //                 }
            //             }
            //         }
            //     });
            // }
            // if(boo){
            //     return
            // }
        // }else if(selected == 11){ //区域调价
        //     var itemData = table.checkStatus('smt_online_data_table').data; //获取选择的店铺
        //     if(!itemData.length){
        //         layer.msg("请选择lisiting", {icon: 0});
        //         return;
        //     }
        }else if(selected == 12){  //仅调整待调价商品价格
            var itemData = table.checkStatus('smt_online_data_table').data; //获取选择的店铺
            if(!itemData.length){
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            // 判断选择的listing是否可以调价，根据页面是否有调的标签
            var isAdjustRows=itemData.filter(item=>item.prodSyncSmtDtos&&item.prodSyncSmtDtos.filter(sonItem=>!!sonItem.isAdjust).length)
            if(isAdjustRows.length!=itemData.length) return layer.msg("选择数据中有无需要调价的商品，请重新选择", { icon: 0 })
            //如果没有活动的id则报错提示，
            if(isAdjustRows.filter(item=>!item.promotionId).length) return layer.msg("选择的商品未同步活动，请重新选择", { icon: 0 })
            // 判断选择的listing是否是同一活动，如果不是报错提示，如果是出现弹窗
            if(isAdjustRows.filter(item=>isAdjustRows[0].promotionId==item.promotionId).length!=isAdjustRows.length) return layer.msg('选中的listing不是同一个活动', { icon: 2 })
            //保存到缓存中
            window.localStorage['smtOnlineproductIsAdjust'] = JSON.stringify(isAdjustRows);
        }else if(selected ==13 || selected == 14 || selected == 15){
            var itemData = table.checkStatus('smt_online_data_table').data; //获取选择的店铺
            if(!itemData.length){
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            if((selected ==13 || selected == 15) && itemData.length >1){
                layer.msg("当前仅支持一条数据修改", {icon: 0});
                return;
            }
        }else if(selected == 16){  //商品上架
            if(currentProductStatusType != '2'){
                layer.msg("请选择下架的商品", {icon: 0});
                return;
            }
        }else if(selected == 17){ // 上传视频
            if (smt_arr.length <= 0) {
                return layer.msg('请选择lisiting')
              }
        }else if(selected == 18){ //删除视频
            if (smt_arr.length <= 0) {
                return layer.msg('请选择lisiting')
              }
            const arr = smt_arr.map(item=>({
                storeAcctId:item.storeAcctId,
                itemId:item.itemId, 
            })) 
            smtOnline_batchDelvideo(arr) 
            return false
        }else if(selected == 19){ // 修改营销图
            if (smt_arr.length <= 0) {
                return layer.msg('请选择lisiting')
            }
        }else if(selected == 20){ // 修改备货期
            if (smt_arr.length <= 0) {
                return layer.msg('请选择lisiting')
            }
        }else if(selected == 21){ // 修改欧盟责任人 仅支持同一店铺批量操作
            if (smt_arr.length <= 0) {
                return layer.msg('请选择lisiting')
            }
            const storeAcctIdList = [...new Set(smt_arr.map(v=>v.storeAcctId))]
            if(storeAcctIdList.length !==1 ){
                return layer.msg('仅支持同一店铺批量操作')
            }
        }else if(selected == 22){ // 修改商品资质 仅支持同一类目最小子集
            if (smt_arr.length <= 0) {
                return layer.msg('请选择lisiting')
            }
            const categoryId = [...new Set(smt_arr.map(v=>v.categoryId))]
            if(categoryId.length !==1 ){
                return layer.msg('仅支持同一叶子节点类目')
            }
        }
        /**
         * 弹窗
         */
        var sobj = $("#smt_online_apiOperate_sel").find("[value=" + selected + "]");
        var title = $(sobj).attr("data-title");
        var link = $(sobj).attr("data-link");
        if(layerArr.some(item=>item==selected)) return layer.msg('请把相同操作类型的弹窗关闭后再打开',{icon:0})
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: title,
            maxmin: selected == 11?true :false,
            area: (selected == 3 || selected == 13 || selected == 14 || selected == 15) ? ['100%', '100%'] : ['80%', '70%'],
            success: function () {
                layerArr.push(selected)
                layui.view(this.id).render(link).done(function () {
                    //渲染完成以后执行的函数
                    if(smtSkus){ 
                        $("input[name='skuList']").val(smtSkus);
                        setTimeout(function () {
                            $('#smtModifyStockSearchBtn').click();
                        },1000);//延迟1s
                    }
                })
            },
            min:function(layero){
                $(`#layui-layer-shade${index}`).length&& $(`#layui-layer-shade${index}`).remove()
            },
            full:function(layero){
                $(`#layui-layer-shade${index}`).length&& $(`#layui-layer-shade${index}`).remove()
            },
            restore:function(layero){
                let shadeDom=`<div class="layui-layer-shade" id="layui-layer-shade${index}" times="${index}" style="z-index: 19891019; background-color: rgb(0, 0, 0); opacity: 0.3;"></div>`
                layero.before(shadeDom)
            },
            end:function () {
                var layerArrIndex = layerArr.indexOf(selected); 
                layerArrIndex > -1 && layerArr.splice(layerArrIndex, 1)
                $(`#layui-layer-shade${index}`).length&& $(`#layui-layer-shade${index}`).remove()
                if(timeUnit != null){
                    clearInterval(timeUnit);//清除定时查询进度
                }
                if(smtMoCommodPriceTimeUnit!=null){
                    clearInterval(smtMoCommodPriceTimeUnit);//清除定时查询进度
                }
                if(smtMoAreaPriceTimeUnit!=null){
                    clearInterval(smtMoAreaPriceTimeUnit)
                }
                if(smtMopriceTimeUnit!=null){
                    clearInterval(smtMopriceTimeUnit)
                }
                if(smtMoFreightTplTimeUnit!=null){
                    clearInterval(smtMoFreightTplTimeUnit)
                }
                if(smtOnlineaeproductUnit!=null){
                    clearInterval(smtOnlineaeproductUnit)
                }
                if(smtOnlineUploadVideoUnit){
                    clearInterval(smtOnlineUploadVideoUnit)
                }
                if(smtMoDeliverTimeUnit){
                    clearInterval(smtMoDeliverTimeUnit)
                }
            }
        });
    });
    /**
     * 产品状态选项卡改变
     */
    var currentProductStatusType = "1";
    element.on('tab(smt_online_tab_filter)', function (data) {
        currentProductStatusType = $(this).attr("product_status_type");
        if(currentProductStatusType == 2){
            $(".smt_online_wsDisplayList").show()
        }else{
            $(".smt_online_wsDisplayList").hide()
        }
        $("#smt_online_search_submit").click();
    });
    //#region 一键复制功能smt_online_copy_list
    new dropButton('smt_online_copy_list');
    $('.smtOnline_copyData').click(function(){
        const type = $(this).data('type');
        const typeStr = $(this).data('typestr');
        const { data } = table.checkStatus("smt_online_data_table");
        const typeObj = {
            itemId: 1,
            prodPSku: 2,
            storeAcct: 3,
            salesPerson: 4,
        }
        // 若复选框选中数据，仅复制复选框选中数据；2.无选中数据，复制查询数据里前1w个数据
        if (data.length) {
            const copyList = data.map((v) => v[type])
            const copyListStr = Array.from(new Set(copyList));
            copyTxtToClipboard(copyListStr, "textarea");
        } else {
            const searchData = smtOnline_getSerachData();
            searchData.batchCopyFieldCode = typeObj[type]
            commonReturnPromise({
                type: "POST",
                url: "/lms/onlineProductSmt/batchCopyList",
                params: searchData,
            }).then((res) => {
                layer.confirm(
                    `查出${typeStr} ${res.split(",").length}条，点击确认复制`,{icon: 3},
                    function () {
                        copyTxtToClipboard(res, "textarea");
                    }
                );
            });
        }
    })
    //#endregion
    /**
     * 标签选择监听
     */
    form.on('checkbox(marksCheck)', function(data){
        var savl = data.value;
        if (savl == "") {//点击了全选
            if (data.elem.checked) {//全部选中
                $("#smt_online_marks_form").children().each(function () {
                    $(this).prop("checked", true);
                })
            } else {//反选
                $("#smt_online_marks_form").children().each(function () {
                    $(this).prop("checked", false);
                })
            }
        } else {
            if (data.elem.checked) {
                var length = $("#smt_online_marks_form").find(".layui-form-checked").length;
                if (length == ($("#smt_online_marks_form").find("input").length - 1)) {
                    $("#smt_online_marks_form").children().first().prop("checked", true);
                }
            }else{
                $("#smt_online_marks_form").children().first().prop("checked", false);
            }
        }
        form.render('checkbox');
    });


    /**
     * 计算table所占高度
     */
    function table_height(){
        var bodyheight = $(window).height();
        var cardheight1 =  $("#LAY_app_body").find('.layui-card').eq(0).outerHeight();
        var cardheight2 =   $("#LAY_app_body").find('.layui-card').eq(1).children('.layui-card-header').outerHeight();
        return bodyheight-cardheight1-cardheight2-120;
    }

    /**
     * 搜索
     */
    $("#smt_online_search_submit").on("click",function(){
        var searchData=smtOnline_getSerachData();
        table.render({
            elem: "#smt_online_data_table",
            method: 'post',
            url: ctx + "/onlineProductSmt/searchSmtProductByDto.html",
            where:searchData,
            unFixedTableHead: true,
            cols: [
                [
                    {checkbox:true,width:25},
                    { field: "firstImage", unresize:true,width:70,title: "图片" , style:"vertical-align: top;",templet:"#smt_online_mainImage_tpl"},
                    { field: 'itemId', title: "标题/产品ID", align: 'left',style:"text-align:left;vertical-align: top;", templet: '#smt_online_itemId_tpl',width: 300 },
                    // { field: "profitMoney",title: "均单利润",width:65},
                    // { field: "profitPercentage",title: "利润率",width:60,templet:'<div>{{d.profitPercentage}}%</div>'},
                    // { field: "smtes",width:70, title: "收藏", style:"vertical-align: top;"},
                    // { field: 'sales', width:65,title: "出售",  align: 'left' ,style:"vertical-align: top;",},
                    // { field: "pSku",width:150, title: "Parent SKU",  style:"vertical-align: top;",templet: '#smt_online_storePSku_tpl'},
                    { field: "storeSubSku",unresize:true,width:500, title: "<div style='width:140px;float: left;'>SKU</div> " +
                        "<div style='width:60px;float: left;'>属性</div> " +
                        "<div style='width:60px;float: left;'>价格($)</div> " +
                        "<div style='width:60px;float: left;'>价格(￥)</div> " +
                        "<div style='width:60px;float: left;'>在线数量</div> "+
                        "<div style='width:100px;float: left;'>预计可用库存含在途/不含在途</div> "
                        , style:"vertical-align: top;",templet:"#smt_online_storeSSku_tpl" ,},
                    { field: "listingRemark",title: "备注",style:"vertical-align: top;", templet: '#smt_online_listingRemark_tpl'},
                    // { field: "quantity",title: "链接库存",width:70},
                    { field: "listingTime",width:100,title: "时间/下架原因", templet: '#smt_online_listingTime_tpl'},
                    // { field: "grossWeight",width:60,title: "重量(kg)"},
                    { field: "sales",width:110,title: "半托管/ID/公司",templet: '#smt_online_sales_tpl'},
                    { field: 'freightTemplateId',width:200,title: "模板", align: 'left',templet: '#smt_online_freightTemplateId_tpl' },
                    { title: '操作',align: 'center',style:"vertical-align: top;",templet: '#smt_online_operate_tpl',width: 80}
                ],
            ],
            done: function(res, curr, count){
                //懒加载
                theadHandle().fixTh({id:'#smt_onlineproductCard',h:200,dv1:'.row_module_js',dv4:'.checkbox-group',i:85});
                imageLazyloadAll();
                if (res.code == '0000') {
                    if(res.data!=null){
                        // var getTpl = smt_online_hide_table_tpl.innerHTML
                        //     ,view = document.getElementById('smt_online_hide_table');
                        // laytpl(getTpl).render(res.data,function(html){
                        //     view.innerHTML = html;
                        // });
                    }
                    if(res.msg!=null){
                        var msgArray=res.msg.split("&");
                        // // 数量大于10000，需要显示为 10000+
                        // $("#smt_online_online_num1_span").html(searchData.productStatusType==1 && Number(msgArray[0])>10000 ? '10000+' : msgArray[0]);//在线
                        // $("#smt_online_online_num2_span").html(searchData.productStatusType==2 && Number(msgArray[1])>10000 ? '10000+' : msgArray[1]);//下线
                        // $("#smt_online_online_num3_span").html(searchData.productStatusType==3 && Number(msgArray[2])>10000 ? '10000+' : msgArray[2]);//下线
                        // $("#smt_online_online_num4_span").html(searchData.productStatusType==4 && Number(msgArray[3])>10000 ? '10000+' : msgArray[3]);//下线
                        $("#smt_online_online_num1_span").html(msgArray[0]);//在线
                        $("#smt_online_online_num2_span").html(msgArray[1]);//下线
                        $("#smt_online_online_num3_span").html(msgArray[2]);//下线
                        $("#smt_online_online_num4_span").html(msgArray[3]);//下线
                        $("#smt_online_marks_import").attr("title","重点维护("+msgArray[4]+")");
                        $("#smt_online_marks_optimize").attr("title","待优化("+msgArray[5]+")");
                        $("#smt_online_marks_adjust").attr("title","待调价("+msgArray[6]+")");
                        form.render('checkbox');
                    }
                    $('.smt_online_listingRemark_tip').on('mouseenter', function(){
                        var that = this;
                        var tips=$(this).attr("listingRemark");
                        if(tips){
                            layer.tips($(this).attr("listingRemark"), that,{tips:[1,'#333'],time: 0}); //在元素的事件回调体中，follow直接赋予this即可
                        }
                    }).on('mouseleave', function(){
                        layer.closeAll("tips");
                    });
                    /**区域定价显示**/
                    // $('.smt_online_region_price_show').parent().hover(function(){
                    //    $(this).find('.smt_online_region_price_showHandle').removeClass('disN');
                    // }, function(){
                    //     $(this).find('.smt_online_region_price_showHandle').addClass('disN');
                    // })
                    $('.smt_online_region_price_show').click(function(){
                        layer.open({
                            type: 1,
                            title: '区域定价',
                            shadeClose: true,
                            area: ['1100px', '600px'],
                            content: $(this).parent().find('.smt_online_region_price_showHandle').html()
                        })
                    });
                    //鼠标放上去显示隐藏
                    // $('.smt_online_operate_handle').hover(function(){
                    //     $(this).find('.smt_online_operate_btn').removeClass('disN')
                    // },function(){
                    //     $(this).find('.smt_online_operate_btn').addClass('disN')
                    // })
                }
            },
            page: true,
            id: "smt_online_data_table",
            limits: [100, 300, 500],
            limit: 100
        });
        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(smt_online_data_table)', function(obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            var itemIds=data.storeAcctId+"&"+data.itemId;
            if (layEvent == "smt_online_updateOneItem") { //更新一条item
                smtOnline_syncBacthSmtItem(itemIds);
            }else if(layEvent == "smt_online_marksOneItem"){
                var itemData=[];
                itemData.push(data);
                var marks=$(this).attr("marks");
                var exmarks=$(this).attr("exmarks");
                var actionType=$(this).attr("actionType");
                smtOnline_bacthMarksSmtItem(itemData,marks,exmarks,actionType);
            }else if(layEvent == 'smt_online_update_listingRemark'){
                var title=$(this).attr("title");
                var oldData=obj.data.listingRemark || '';
                var index= layer.open({
                    type: 1,
                    title: title,
                    area: ["500px", "300px"],
                    btn: ["保存", "取消"],
                    content: '<div style="padding:20px"><textarea id="smt_online_listingRemark_text" class="layui-textarea" rows="50">' +oldData+ '</textarea></div>',
                    yes: function (index, layero) {
                        var listingRemark = $("#smt_online_listingRemark_text").val();
                        var tobj={};
                        tobj.id=data.id;
                        tobj.listingRemark=listingRemark;
                        var updateRemarkJson=[];
                        updateRemarkJson.push(tobj);
                        smtOnline_bacthUpdateItemRemark(updateRemarkJson,title);
                    }, end: function () {
                        layer.close(index);
                    }
                });
            }else if (layEvent == "smt_online_showlog") { //查看日志
                layer.open({
                    type: 1,
                    title: '查看日志',
                    shadeClose: false,
                    area: ['60%', '60%'],
                    content: $('#smt_online_showlog_layer').html(),
                    success: function () {
                        smt_online_showlog(data.itemId,data.storeAcctId);
                    }
                })
            }else if(layEvent=='smt_online_update'){
                smt_online_update(data)
            }
        });
    });
    /**
     * 显示日志
     */
    function smt_online_showlog(itemId,storeAcctId){
        table.render({
            elem: '#smt_online_showlog_table',
            method: 'post',
            url: ctx + '/onlineProductSmt/getSmtOnlineOperateLog.html',
            where:{'itemId':itemId,
                    'storeAcctId':storeAcctId},
            cols: [[ //标题栏
                {field: 'createTime', width:'15%',title: '时间' ,templet:"<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>"}
                ,{field: 'creator', title: '操作人',width:'5%'}
                ,{field: 'prodSSku', width:'10%',title: '商品子SKU'}
                ,{field: 'storeSSku', width:'10%',title: '店铺子SKU'}
                ,{field: 'operateTypeStr', title: '事件',width:'6%'}
                ,{field: 'origData', title: '原值',width:'11%'}
                ,{field: 'newData', title: '调整值',width:'10%'}
                ,{field: 'operDesc', title: '结果',width:'20%'}
            ]],
        })
    }
    /**
     * 修改
     */
    function smt_online_update(data){
        last_smt_arr = JSON.parse(JSON.stringify(smt_arr))
        smt_arr = [data]
        var title = '修改listing'
        var link = 'route/iframe/smt/smtModifyListingInfo'
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: title,
            maxmin: false,
            area: ['100%', '100%'],
            success: function () {
                layui.view(this.id).render(link).done(function () {})
            },
            min:function(layero){
                $(`#layui-layer-shade${index}`).length&& $(`#layui-layer-shade${index}`).remove()
            },
            full:function(layero){
                $(`#layui-layer-shade${index}`).length&& $(`#layui-layer-shade${index}`).remove()
            },
            restore:function(layero){
                let shadeDom=`<div class="layui-layer-shade" id="layui-layer-shade${index}" times="${index}" style="z-index: 19891019; background-color: rgb(0, 0, 0); opacity: 0.3;"></div>`
                layero.before(shadeDom)
            },
            end:function () {
                smt_arr = JSON.parse(JSON.stringify(last_smt_arr))
                // $("#smt_online_search_submit").click();
                $(`#layui-layer-shade${index}`).length&& $(`#layui-layer-shade${index}`).remove()
            }
        });
    }
    /**
     * 批量备注
     */
    function smtOnline_bacthUpdateItemRemark(updateRemarkJson,title){
        loading.show();
        $.ajax({
            url: ctx + '/onlineProductSmt/updateOneSmtItemRemark.html',
            data:{"updateRemarkJson":JSON.stringify(updateRemarkJson)},
            dataType: "json",
            type: "post",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg(title+'成功',{icon:1});
                } else {
                    layer.msg(returnData.msg,{icon:5});
                }
            },
            error: function () {
                layer.msg("服务器正忙",{icon:5});
            }
        });
    }
    /**
     * 批量更新
     * @param itemIds
     */
    function  smtOnline_syncBacthSmtItem(itemIds){
        if(itemIds==null||itemIds==''){
            layer.msg("请选择lisiting",{icon:0});
            return;
        }
        loading.show();
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductSmt/syncBacthSmtItem.html",
            data:{"itemIds":itemIds},
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg,{icon:1});
                } else {
                    layer.open({
                        title: '更新lisiting结果',
                        content:  returnData.msg,
                        offset: '100px',
                        area: '500px',
                        yes: function(index, layero){
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                }
            }
        })
    };

    /**
     * 批量删除视频
    * @param storeAcctId,itemId
    */
    function smtOnline_batchDelvideo(arr){
        commonReturnPromise({
            url: '/lms/aliexpressVideo/batchDeleteAliexpressVideo',
            type: 'post',
            contentType:'application/json',
            params: JSON.stringify(arr)
        }).then((res)=>{
            layer.msg(res||'操作成功',{icon:1})
        })
    }

    /**
     *
     * @param itemIds
     */
    function  smtOnline_deleteBacthSmtItem(deleteArray){
        if (deleteArray == null || deleteArray.length < 1) {
            layer.msg("请选择要删除的lisiting", {icon: 0});
            return;
        } else {
            var Confirmindex = layer.confirm("确认要删除<span style='color: blue'> " + deleteArray.length + "</span> 条listing(只删除OA系统数据)", function (result) {
                if (result) {
                    layer.close(Confirmindex);
                    loading.show();
                    $.ajax({
                        type: "post",
                        url: ctx + "/aliexpressOnlineOperateController/batchDeleteAliexpressLisiting.html",
                        data: {"deleteArray": JSON.stringify(deleteArray)},
                        dataType: "json",
                        success: function (returnData) {
                            loading.hide();
                            if (returnData.code == "0000") {
                                layer.msg(returnData.msg, {icon: 1});
                            } else {
                                layer.msg(returnData.msg, {icon: 2});
                            }
                        }
                    })
                }
            })
        }
    };
    /**
     * 批量打标签
     * @param itemData
     */
    function  smtOnline_bacthMarksSmtItem(itemData,marks,exmarks,actionType){
        var updateJson=[];
        for (var index in itemData) {
            var obj = itemData[index];
            var data={};
            data.id=obj.id;
            data.marks=marks;
            data.exmarks=exmarks;
            data.actionType=actionType;
            updateJson.push(data);
        }
        loading.show();
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductSmt/updateBatchSmtItem.html",
            data:{"updateJson":JSON.stringify(updateJson)},
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg,{icon:1});
                } else {
                    layer.msg(returnData.msg,{icon:2});
                }
            }
        })
        return;
    }
    smtOnline_initBatchMarkArray();//初始化批量标记标签
    /**
     * 批量标价标签初始化
     */
    function smtOnline_initBatchMarkArray() {
        bacthMarkArray[0].marks = "重点维护";
        bacthMarkArray[0].exmarks = "维护完成";
        bacthMarkArray[1].marks = "维护完成";
        bacthMarkArray[1].exmarks = "重点维护";
        bacthMarkArray[2].marks = "待优化";
        bacthMarkArray[2].exmarks = "优化完成";
        bacthMarkArray[3].marks = "优化完成";
        bacthMarkArray[3].exmarks = "待优化";
        bacthMarkArray[4].marks = "调价完成";
        bacthMarkArray[4].exmarks = "需要调价";
        bacthMarkArray[5].marks = "亏损标记";
        bacthMarkArray[5].exmarks = "取消亏损标记";
        bacthMarkArray[6].marks = "滞销品维护中";
        bacthMarkArray[6].exmarks = "滞销品维护结束";
        bacthMarkArray[7].marks = "滞销品维护结束";
        bacthMarkArray[7].exmarks = "滞销品维护中";
        for (var i in bacthMarkArray) {
            var obj = bacthMarkArray[i];
            var str = '<option value="' + obj.marks + '" exmarks="' + obj.exmarks + '" >'+obj.marks+'</option>';
            $("#smt_online_tagsOperate_sel").append(str);
        }
        $("#smt_online_tagsOperate_sel").append('<option value="5"   data-title="批量备注">批量备注</option>');
        if($("#outof_stock_prod_sku_hidden").length==1){
            $("#smt_online_searchtype_sel").val(2);//商品子sku
            smtSkus=$("#outof_stock_prod_sku_hidden").val();
            form.render();setTimeout(function () {$('#smt_online_apiOperate_sel').next().find('dd:nth-child(5)').trigger('click')},500);//延迟2s
        }
    }
    /**
     * 刊登价预估
     */
    $("body").on("click","#smtOnlinePriceBtn", function(){
        var id = $(this).attr("data-id");
        layer.open({
            type: 1,
            title: '刊登价预估',
            btn: ['关闭'],
            area: ["1000px", "500px"],
            content: $("#smtOnline_aep_smtListingPriceTpl").html(),
            success: function (layero,index) {
	        	layui.form.render('select');
                $(layero).find("input[name=prodPId]").val(id);
                $("#smtOnline_aep_smtListingPrice button[type=submit]").trigger("click");
                //openSmtComp(id);
            }
        });
    });
    form.on('submit(smtOnline_aep_smtListingPrice)', function(data) {
        layui.admin.load.show();
        $.ajax({
            type:"post",
            url:ctx+"/aliexpresslisting/listprice.html",
            data:data.field,
            dataType:'json',
            success:function(returnData){
                layui.admin.load.hide();
                if(returnData.code=="0000"){
                    var tr = "";
                    for(var i=0;i<returnData.data.length;i++){
                        tr+=  "<tr><td class='prodSSku'>"
                            +returnData.data[i].sSku+"</td><td>"
                            +"<input class='layui-input' name='cost' value='"
                            +returnData.data[i].cost+"'></td><td>"
                            +"<input class='layui-input' name='weight' value='"
                            +returnData.data[i].weight+"'></td><td class='listingPrice'>"
                            +"$"+returnData.data[i].listingPrice+"</td><td class='finalPrice'>"
                            +"$"+returnData.data[i].finalPrice+"</td><td class='estimateProfit'>"
                            +'&yen;'+returnData.data[i].estimateProfit+"</td>"
                            +"<td><button class='layui-btn layui-btn-sm aep_upSkuPrice'>更新</button></td></tr>"
                    }
                    $("#smtOnline_aep_smtListingPriceTable tbody").html(tr);
                }else{
                    layer.msg(returnData.msg, {icon:5});
                }
            }
        });
        return false;
    });
    form.on('select(smtOnline_aep_smtShippingType)', function(data){
            $("#smtOnline_aep_smtListingPrice button[type=submit]").trigger("click");
	});
    //子SKU更新价格
    $("body").on("click","#smtOnline_aep_smtListingPriceTable .aep_upSkuPrice", function(){
        var reqData = serializeObject($("#smtOnline_aep_smtListingPrice"));
        var trDom = $(this).parents("tr");
        reqData.cost = trDom.find("input[name=cost]").val();
        reqData.weight = trDom.find("input[name=weight]").val();
        reqData.prodSSku = trDom.find(".prodSSku").text();
        layui.admin.load.show();
        $.ajax({
            type:"post",
            url:ctx+"/aliexpresslisting/listprice.html",
            data:reqData,
            dataType:'json',
            success:function(returnData){
                layui.admin.load.hide();
                if(returnData.code=="0000"){
                    trDom.find(".listingPrice").html("$"+returnData.data[0].listingPrice);
                    trDom.find(".finalPrice").html("$"+returnData.data[0].finalPrice);
                    trDom.find(".estimateProfit").html("&yen;"+returnData.data[0].estimateProfit);
                }else{
                    layer.msg(returnData.msg, {icon:5});
                }
            }
        });
    });

      // STM分类
    $("#smt_online_SMTbutton").click(function() {
        cateUrl = "/smtPublishModelProduct/getSmtCateList.html";
        cateSearchUrl = "/smtPublishModelProduct/getSmtCateList.html";
        admin.itemCat_select('smt_online_button_id',
            'smt_online_SMTbutton_hidden', 'smt_online_SMTbutton_div'
        ,cateUrl,cateSearchUrl);
    });
     //清空类目
    $('#smt_online_search_reset').click(function (){
        $('#smt_online_SMTbutton_hidden').val('');
        $('#smt_online_SMTbutton_div').html('');
        // 店铺值变化->单品折扣
        smtOnline_initDiscount()
    });
    /**
     * 获取搜索参数
     */
    function smtOnline_getSerachData() {
        var obj = {};
        var currentStoreAccts = formSelects.value("smt_online_store_sel", "val"); //所选店铺
        if (currentStoreAccts == null || currentStoreAccts.length < 1) { //没有选择店铺
            var acctIds = $("#smt_online_store_sel").attr("acct_ids");
            if (acctIds && acctIds.length > 1) {
                obj.storeAcctId = acctIds;
            } else {
                obj.storeAcctId = 99999;
            }
        } else {
            obj.storeAcctId = currentStoreAccts.join(","); //选择的店铺
        }
        obj.itemId= $.trim($("#smt_online_itemId").val()); //物品号
        // obj.salesStart=$.trim($("#smt_online_salesStart_text").val());//销售数量
        // obj.salesEnd=$.trim($("#smt_online_salesEnd_text").val());
        if($('#smt_online_searchForm').find('select[name=onlineStockStartType]').val() == 1){ // 子SKU在线数量
        obj.stockStart=$.trim($("#smt_online_stockStart_text").val());//在线数量
        obj.stockEnd=$.trim($("#smt_online_stockEnd_text").val());
            obj.quantityStr	='';
            obj.quantityEnd='';//链接库存
        }else{
            obj.stockStart='';//在线数量
            obj.stockEnd='';//在线数量
            obj.quantityStr	=$.trim($("#smt_online_stockStart_text").val());
            obj.quantityEnd=$.trim($("#smt_online_stockEnd_text").val());//链接库存
        }
        obj.haveBrand = $('#smt_online_searchForm').find('select[name=haveBrand]').val()  // 品牌
        obj.priceType = $('#smt_online_searchForm').find('select[name=priceType]').val()  // 刊登差价类型
        obj.priceStart=$.trim($("#smt_online_priceStart_text").val());// 刊登价格
        obj.priceEnd=$.trim($("#smt_online_priceEnd_text").val()); // 刊登价格
        obj.difPriceType = $('#smt_online_searchForm').find('select[name=difPriceType]').val()  // 刊登差价类型
        obj.difPriceStart=$.trim($("#smt_online_difPriceStart_text").val());//刊登差价
        obj.difPriceEnd=$.trim($("#smt_online_difPriceEnd_text").val());
        obj.difRatioStart=$.trim($("#smt_online_difRatioStart_text").val());//刊登差价比率
        obj.difRatioEnd=$.trim($("#smt_online_difRatioEnd_text").val());
        obj.grossWeightStart=$.trim($("#smt_online_grossWeightStart_text").val());//重量
        obj.grossWeightEnd=$.trim($("#smt_online_grossWeightEnd_text").val());
        // obj.quantityEnd=$.trim($("#smt_online_SalesEnd_text").val());//链接库存
        // obj.quantityStr	=$.trim($("#smt_online_SalesStart_text").val());
        obj.categoryId=$("#smt_online_SMTbutton_hidden").val();
        obj.storeAcctGroup=formSelects.value('storeAcctGroup', 'valStr');
        /**产品标题处理**/
        var title=$.trim($("#smt_online_item_title").val()); //产品标题
        if(title != null && title != ''){
            var titleSearchType=$.trim($("#smt_online_title_search_type").val());//标题检索类型
            obj.titleSearchType=titleSearchType;
            if(titleSearchType==0){//标题模糊
                var array=title.split(" ");
                obj.title="";
                for(var i=0;i<array.length;i++){
                    if($.trim(array[i]) !=null && $.trim(array[i]) != ''){
                        obj.title += "+" + $.trim(array[i]);
                        if (i != array.length - 1) {
                            obj.title += " ";
                        }
                    }
                }
            }else if(titleSearchType==1){//标题精准
                obj.title ="%"+title+"%";
            }
        }
        var searchType = $("#smt_online_searchtype_sel").val();
        var searchText = $.trim($("#smt_online_searchtype_text").val());
        obj.skuSearchType=0;//sku检索类型
        if (searchType == 1) {//商品父SKU
            obj.prodPSku = searchText;
        } else if (searchType == 2) {//商品子SKU
            obj.prodSSku = searchText;
        } else if (searchType == 3) {//店铺父SKU
            obj.storePSku = searchText;
        } else if (searchType == 4) {//店铺子SKU
            obj.storeSSku = searchText;
        } else if (searchType == 5) {//商品子SKU模糊
            obj.skuSearchType=1;
            obj.prodSSku = searchText;
        } else if (searchType == 6) {//店铺子SKU精确
            obj.skuSearchType=1;
            obj.storeSSku = searchText;
        }
        obj.orderBy = $.trim($("#smt_online_sortdesc_sel").val());//排序类型
        obj.listingMethod = $("#smt_online_searchForm").find('select[name=listingMethod] option:selected').val()   //刊登类信息
        obj.minPriceType = $('#smt_online_searchForm').find('select[name=minPriceType]').val()  // 最低价格类型
        obj.minPriceFrom = $("#smt_online_searchForm").find('input[name=minPriceFrom]').val()   //最低价格查询起值
        obj.minPriceTo = $("#smt_online_searchForm").find('input[name=minPriceTo]').val()   //最低价格查询终值
        obj.productStatusType = currentProductStatusType;
        obj.isMultiSkuTemp=$.trim($("#smt_online_producttype_sel").val());//是否多属性
        obj.freightTemplateId=formSelects.value('smt_online_freight_template_sel', 'valStr')//运费模板
        var listingTimeType=$.trim($("#smt_online_listtime_sel").val());
        var lisitingTime=$.trim($("#smt_online_listtime").val());
        if(lisitingTime != null && listingTimeType!=null){
            obj.listingTimeType=listingTimeType;
            if(listingTimeType==1){//刊登时间区间
                obj.listingStartTimeFrom=lisitingTime.substring(0,10);
                obj.listingStartTimeEnd=lisitingTime.substring(13);
            }else{//结束时间区间
                obj.listingEndTimeFrom=lisitingTime.substring(0,10);
                obj.listingEndTimeEnd=lisitingTime.substring(13);
            }
        }
        //可刊登时间
        var canListingTime=$.trim($("#smt_online_canListingTime").val());
        if(canListingTime!=null && canListingTime !=''){
            obj.canListingTimeFrom=canListingTime.substring(0,10)+' 00:00:00';
            obj.canListingTimeEnd=canListingTime.substring(13)+' 23:59:59';
        }
        var marks = [];//审核状态
        $("#smt_online_marks_form").find(".layui-form-checked").each(function () {
            var sval=$(this).prev().val();
            if(sval != '' && sval.indexOf("部分停售")==-1&& sval.indexOf("全部停售")==-1 && sval!=='SMT侵权' && sval!=='有平台侵权' && sval!=='有备注'){
                marks.push(sval);
            }
            if( sval.indexOf("部分停售")>-1){
                obj.isDiscontinued="1";// 部分停售
            }
            if(sval && sval.indexOf("全部停售")>-1){
                obj.prodStopSaleStatus=true
            }
        });
        obj.marks=marks.join(",");
        var logisAttrStrObj = formSelects.value("smt_online_logistics_sel");
        var logisAttrArray =[];//选择的多个物流属性
        obj.notLogisAttrStr="";
        if(!$.isEmptyObject(logisAttrStrObj)){
            for (var i = 0; i < logisAttrStrObj.length; i++) {
                var elestr=$.trim(logisAttrStrObj[i].val);
                logisAttrArray.push(elestr);
                if(elestr.indexOf('普货')>-1||elestr.indexOf('无物流属性')>-1){
                    obj.notLogisAttrStr="1";
                }
            }
        }
        // SMT侵权
        if($("#smt_online_marks_form").find("input[name=smtTortStatus]").prop('checked') ){
            obj.smtTortStatus = true
        }
        // 有平台侵权
        if($("#smt_online_marks_form").find("input[name=tortStatus]").prop('checked') ){
            obj.tortStatus = true
        }
        // 有备注
        if($("#smt_online_marks_form").find("input[name=remarkStatus]").prop('checked') ){
            obj.remarkStatus = true
        }
        obj.logisAttrStr=logisAttrArray.join(",");//物流属性
        obj.logisAttrStrType=$.trim($("#smt_online_logistics_search_type").val());
        obj.isRegionalPricing=$.trim($("#smt_online_region_price_sel").val());//区域调价
        obj.regionPriceTemplateId=$.trim($("#smt_online_region_price_template_sel").val());//区域调价模板
        obj.listingType=$.trim($("#smt_online_listingType_sel").val());//刊登类型
        obj.prodAttrs=$.trim($("#smt_online_productLabel_sel").val());
        obj.regionPriceType = $('#smt_online_searchForm').find('select[name=regionPriceType]').val()// 调价国家查询类型
        obj.regionPriceCountryList =formSelects.value('smt_online_regionPriceCountryList', 'valStr');// 调价国家
        currentProductStatusType == 2 ? obj.wsDisplayList = formSelects.value('smt_online_wsDisplayList', 'valStr'):''; // 下架原因
        obj.promotionId=$("#smt_online_searchForm select[name=promotionId] option:selected").val();  //单品折扣
        obj.salesNumType=$("#smt_online_searchForm select[name=salesNumType] option:selected").val()   //销量类型
        obj.salesNumFrom=$("#smt_online_searchForm input[name=salesNumFrom]").val()  //min销量
        obj.salesNumTo=$("#smt_online_searchForm input[name=salesNumTo]").val()  //max销量
        // obj.profitPercentageStart=$("#smt_online_searchForm input[name=profitPercentageStart]").val()  //min利润率
        // obj.profitPercentageEnd=$("#smt_online_searchForm input[name=profitPercentageEnd]").val()  //max利润率
        // obj.profitMoneyStart=$("#smt_online_searchForm input[name=profitMoneyStart]").val()  //min均单利润
        // obj.profitMoneyEnd=$("#smt_online_searchForm input[name=profitMoneyEnd]").val()  //max均单利润
        obj.isAvailableVideo=$("#smt_online_searchForm select[name=isAvailableVideo]").val()  // 可用视频
        obj.isUploadVedio=$("#smt_online_searchForm select[name=isUploadVedio]").val()  // 已上传视频msrEuIdStatus
        obj.msrEuIdStatus=$("#smt_online_searchForm select[name=msrEuIdStatus]").val()  //欧盟责任人
        obj.halfMa=$("#smt_online_searchForm select[name=isHalfMa]").val()  //是否假如半托管
        obj.qualificationKey=$("#smt_online_searchForm select[name=qualificationKey]").val()  //商品资质
        obj.haveQualification=$("#smt_online_searchForm select[name=haveQualification]").val()  //商品资质 有/无
        // obj.marketImageMissing=$("#smt_online_searchForm select[name=marketImageMissing]").val()  // 营销图
        // 预计可用库存含在途/预计可用库存不含在途
        obj.preAvailableStockType  = $('#smt_online_searchForm').find('select[name=preAvailableStockType]').val()
        // 全部属性/部分属性
        obj.preAvailableAllSku  = $('#smt_online_searchForm').find('select[name=preAvailableAllSku]').val()
        obj.preAvailableStockMin = $.trim($('#smt_online_preAvailableStockMin').val())
        obj.preAvailableStockMax  = $.trim($('#smt_online_preAvailableStockMax').val())
        // 备货天数
        obj.deliveryTimeStart = $.trim( $('#smt_online_searchForm').find('input[name=deliveryTimeStart]').val())//备货天数
        obj.deliveryTimeEnd = $.trim( $('#smt_online_searchForm').find('input[name=deliveryTimeEnd]').val())
        obj.diagnosisProblemType=$.trim($('#smt_online_diagnosisProblemType').val()) //诊断结果

        return obj;
    }
    /**
     * 添加选中数据到arr中
     */
    //监听表格复选框选择
    table.on('checkbox(smt_online_data_table)', function(obj){
        var checkStatus = table.checkStatus('smt_online_data_table'),date = checkStatus.data;
        smt_arr = date;
        // console.log(smt_arr)
    });
});
//初始化ajax请求
function initAjax (url, method, data, func, contentType, showLoading) {
    //默认loading
    if (!showLoading) {
      loading.show()
    }
    $.ajax({
      type: method,
      url: ctx + url,
      dataType: 'json',
      async: true,
      data: data,
      contentType: contentType || 'application/json',
      success: function (returnData) {
        loading.hide()
        if (returnData.code == '0000') {
          func(returnData)
        } else if (returnData.code == '0001') {
          layer.alert(returnData.msg, { icon: 2 })
        } else {
          layer.msg(returnData.msg, { icon: 2 })
        }
      },
      error: function (returnData) {
        layui.admin.load.hide()
        if (XMLHttpRequest.status == 200) {
          layer.msg('请重新登录', { icon: 7 })
        } else {
          layer.msg('服务器错误')
        }
      },
      complete: function (returnData) {
        loading.hide()
      }
    })
  }

/**
 * 显示商品详情
 */
function smtOnline_productListShow(obj, itemId) {
    var parent = $("#td_" + itemId).parent().parent().parent();
    var attrId = $(parent).next().attr("id");
    if (attrId != null && attrId.indexOf(itemId) > -1) {
        parent.next().remove();
    } else {
        parent.after($("#detail_" + itemId).clone());
    }
}
/**
 * 展开收起多个子商品
 */
function smtOnline_changeColspantable(obj) {
    $(obj).prev().find(".myj-hide").toggle();
    var str=$(obj).html();
    if(str.indexOf("展开")>-1){
        $(obj).html("- 收起")
    }else{
        $(obj).html("+ 展开")
    }
}
function openSmtComp(pid){
    $.ajax({
        type:"post",
        url: ctx + "/prodTpl/listcompUrl.html",
        dataType:"json",
        data:{
            prodPId:pid,
            platCode:"aliexpress"
        },
        success:function(returnData){
            if(returnData.data.length>=1){
                for(var i=0;i<returnData.data.length;i++){
                  if(returnData.data[i].indexOf("http") < 0){
                    window.open("http://"+returnData.data[i]);
                  }else{
                    window.open(returnData.data[i]);
                  }
                }
            }
        }
    });
}