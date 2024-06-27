layui.use([ 'admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate' ], function() {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laytpl = layui.laytpl,
        laydate = layui.laydate

    form.render()
    formSelects.render()
    laydate.render({
        elem: '#lazadaManyMoreDiscountEndTime',
        range: true,
        type: 'datetime'
    })

    //渲染部门销售员店铺三级联动
    render_hp_orgs_users('#lazadaManyMoreDiscountSearchForm')

    //lazada站点初始化渲染
    let lazadaSalessiteData = []
    getDatalazadaManyMoreDiscountLazadaAllSite().then(function(result) {
        lazadaSalessiteData = result;
        commonRenderSelect('lazadaManyMoreDiscountSiteIdList', result, {
            name: 'name',
            code: 'salesSite'
        }).then(() => formSelects.render())
    }).catch(err=>layer.msg(err, {icon: 2}))

    // 清空查询条件
    $('#lazadaManyMoreDiscountReset').click(() => {
        $('#lazadaManyMoreDiscountSearchForm')[0].reset()
    })

    // 查询
    $('#lazadaManyMoreDiscountSearch').click(() => {
        lazadaManyMoreDiscountTableRender()
    })

    //时间大小比对
    // date1>date2返回false
    function lazadaManyMoreDiscountCheckDate(date1, date2) {
        let oDate1 = new Date(date1)
        let oDate2 = new Date(date2)
        return oDate1.getTime() > oDate2.getTime()
    }

    // 获取天数差
    function lazadaManyMoreDiscountGetDays(date1, date2) {
        let oDate1 = new Date(date1)
        let oDate2 = new Date(date2)
        let getd = (oDate2.getTime() - oDate1.getTime()) / (3600 * 24 * 1000)
        return Math.abs(getd)
    }



    function lazadaManyMoreDiscountTableRender() {
        let searchData = serializeObject($('#lazadaManyMoreDiscountSearchForm'))

        if (searchData.lazadaManyMoreDiscountEndTime) {
            searchData.startTime = searchData.lazadaManyMoreDiscountEndTime.split(' - ')[0]
            searchData.endTime = searchData.lazadaManyMoreDiscountEndTime.split(' - ')[1]
        }

        table.render({
            elem: '#lazadaManyMoreDiscountTable',
            method: 'GET',
            url: ctx + '/lazada/flexicombo/pageQueryFlexicombo',
            where: searchData,
            cols: [
                [
                    //表头
                    { type: 'checkbox', width: 25, style: 'vertical-align: top;' },
                    {
                        title: '店铺',
                        field: 'id',
                        templet: function(d) {
                            return `
                    <div>${d.storeAcct}</div><div>${d.salesman||''}</div>
                `
                        }
                    },
                    {
                        title: '活动名称',
                        field: '',
                        templet: function(d) {
                            return `<div>${d.name}</div><div>${d.flexicomboId}</div>`
                        }
                    },
                    {
                        title: '活动时间',
                        templet: function(d) {
                            return `
                    <span>从：${Format(d.startTime || '', 'yyyy-MM-dd hh:mm:ss')}</span><br>
                    <span>到：${Format(d.endTime || '', 'yyyy-MM-dd hh:mm:ss')}</span>
                `
                        }
                    },
                    { title: '适用范围', field: '', templet: '<div>{{d.apply == "ENTIRE_SHOP"?"全店商品":"部分商品"}}</div>' },
                    {
                        title: '已下单',
                        field: '',
                        templet: function(d) {
                            return `<span>${d.orderUsedNumbers || 0}</span> / <span> ${d.orderNumbers || ''}</span>`
                        }
                    },
                    {
                        title: '活动详情',
                        field: '',
                        templet: function(d) {
                            let html = '';
                            if(d.stackable)
                            html += `Stackable<br>`

                            if (d.discountType == 'money') {
                                // 满减
                                let criteriaValue = d.criteriaValue.split(","),discountValue = d.discountValue.split(",");
                                discountValue.forEach((item,index)=>{
                                    html += `
                    <span>优惠：${d.currency||''}${item}</span><br>
                    <span>${d.criteriaType == 'QUANTITY'?"当购买数量":"当订单金额"} ≥ ：${d.criteriaType != 'QUANTITY'?d.currency:""}${criteriaValue[index]}</span><br>
                `
                                })
                                return html
                            } else if (d.discountType == 'discount') {
                                // 折扣
                                let criteriaValue = d.criteriaValue.split(","),discountValue = d.discountValue.split(",");
                                discountValue.forEach((item,index)=>{
                                    html += `
                     <span>优惠比例：${item}%</span><br>
                    <span>${d.criteriaType == 'QUANTITY'?"当购买数量":"当订单金额"}  ≥ ：${d.criteriaType != 'QUANTITY'?d.currency:""}${criteriaValue[index]}</span><br>
                `
                                })
                                return html
                            }else{
                                return 'Other'
                            }
                        }
                    },
                    {
                        title: '活动状态',
                        field: '',
                        templet: function(d) {
                            return `
                    <div>${d.activityStatus == 'NOT_START' ? '未开始' : ''}</div>
                    <div>${d.activityStatus == 'ONGOING' ? '进行中' : ''}</div>
                    <div>${d.activityStatus == 'SUSPEND' ? '暂停中' : ''}</div>
                    <div>${d.activityStatus == 'FINISH' ? '已过期' : ''}</div>
                `
                        }
                    },
                    {
                        title: '活动类型',
                        field: 'activityType',
                        templet: '<div>{{d.activityType == 0?"单次活动":"连续活动"}}</div>'
                    },
                    {
                        title: '操作',
                        width: 100,
                        align: 'center',
                        style: 'vertical-align: top;',
                        toolbar: '#lazadaManyMoreDiscountOperateTpl'
                    }
                ]
            ],
            page: true,
            id: 'lazadaManyMoreDiscountTable',
            limits: [ 50, 100, 300, 500, 700 ],
            limit: 50
        })
    }

    table.on('tool(lazadaManyMoreDiscountTable)', function(obj) {
        let data = obj.data

        if (obj.event == 'edit') {
            // 编辑
            lazadaManyMoreDiscountCreatOrEdit(1, data)
        } else if (obj.event == 'modify') {
            // 修改类型
            let popIndex = layer.open({
                title: '修改活动类型',
                type: 1,
                area: [ '600px', '200px' ],
                btn: [ '保存', '关闭' ],
                id: Date.now(),
                content: $('#lazadaManyMoreDiscountLayerModify').html(),
                success: function() {
                    laytpl($('#lazadaManyMoreDiscountLayerModifyDemo').html()).render(data, function(html) {
                        $('#lazadaManyMoreDiscountLayerModifyView').html(html)
                    })
                    form.render()
                },
                yes: function(index, layero) {
                    let formData = serializeObject($('#lazadaManyMoreDiscountLayerModifyForm'))

                    getDatalazadaManyMoreDiscountUpdateActivity(formData.id, formData.activityType)
                        .then(function(res) {
                            layer.close(popIndex)
                            lazadaManyMoreDiscountTableRender()
                            layer.msg(res || '修改成功', { icon: 1 })
                        })
                        .catch(function(err) {
                            layer.msg(err, { icon: 2 })
                        })
                }
            })
        } else if (obj.event == 'on') {
            // 开启
            lazadaManyMoreDiscountOnOrOffFunc('on', data.id)
        } else if (obj.event == 'off') {
            // 暂停
            lazadaManyMoreDiscountOnOrOffFunc('off', data.id)
        }
    })

    // 创建多件多折
    $('#lazadaManyMoreDiscountCreatTemplate').click(function() {
        lazadaManyMoreDiscountCreatOrEdit(0, {})
    })

    function getFunc(){
        //日期时间范围
        laydate.render({
            elem: '#lazadaManyMoreDiscountPeriodTime',
            type: 'datetime',
            range: true
        })

        // 因为在option中新增了一个currency币种的属性，所以没有使用封装好的select方法渲染
        var lazadaManyMoreDiscountSalesSite = $('#lazadaManyMoreDiscountSalesSite')
        lazadaManyMoreDiscountSalesSite.html(`<option></option>`)
        $(lazadaSalessiteData).each(function() {
            lazadaManyMoreDiscountSalesSite.append(
                `<option value='${this.salesSite}' currency='${this.currency}'>${this.name}</option>`
            )
        })

        ladaVoucherRadioChange()
        ladaVoucherDisplayAreaEnumRadioChange()
        ladaVoucherRangeRadioChange()
        formSelects.render()
        form.render()
    }

    // type: 0新建1编辑
    // obj: 多件多折信息，为空时代表是新建多件多折
    // activityStatus ： 多件多折状态 <%--未开始NOT_START--%><%--进行中ONGOING--%><%--暂停中SUSPEND--%><%--已过期FINISH--%>
    function lazadaManyMoreDiscountCreatOrEdit(type, obj) {
        obj.lazadaVoucherStatusEnum = 'ENTIRE_STORE'
        if (type == 1) {
            obj.periodTime =
                Format(obj.startTime || '', 'yyyy-MM-dd hh:mm:ss') +
                ' - ' +
                Format(obj.endTime || '', 'yyyy-MM-dd hh:mm:ss') // 多件多折使用时间
            // obj.criteriaType = obj.criteriaType // 多件多折门槛
            // obj.discountType = obj.discountType // 优惠类型
            obj.lazadaVoucherStatusEnum = obj.apply // 适用范围？？？
        }
        // 未开始的活动：不允许编辑领取开始时间和优惠适用范围，其他字段可以更改。
        // 进行中的活动：只允许修改多件多折发放数量，且新的值要比旧值大。
        // 暂停中，已过期的活动：不允许修改。
        let popIndex = layer.open({
            title: type == 0 ? '创建多件多折活动' : '编辑多件多折活动',
            type: 1,
            area: [ '700px', '700px' ],
            btn: (obj.activityStatus == "NOT_START"&&obj.discountType != "money"&&obj.discountType != "discount")||obj.activityStatus == 'SUSPEND' || obj.activityStatus == 'FINISH' ? [ '关闭' ] : [ '保存', '关闭' ],
            id: Date.now(),
            content: $('#lazadaManyMoreDiscountLayerCreatAndEdit').html(),
            success: function() {
                        if (type == 1) {
                            getDetail(obj.storeAcctId,obj.flexicomboId).then(res=>{
                                obj.itemIdList = res.join(",")
                                laytpl($('#lazadaManyMoreDiscountDemo').html()).render(obj, function(html) {
                                    $('#lazadaManyMoreDiscountView').html(html)
                                })
                                $('#lazadaManyMoreDiscountCurrency').val(obj.currency) // 币种单位
                                let lazadaMangArr = [],criteriaValue = obj.criteriaValue.split(","),discountValue = obj.discountValue.split(",");;
                                criteriaValue.forEach((item,index)=>{
                                    lazadaMangArr.push({"criteriaValue":item,"discountValue":discountValue[index]})
                                })
                                let RadioDemoObj = {
                                    // 优惠类型数据
                                    discountType: obj.discountType || '',
                                    currency: obj.currency,
                                    criteriaOverMoney: obj.criteriaOverMoney,
                                    offeringMoneyValueOff: obj.offeringMoneyValueOff,
                                    offeringPercentageDiscountOff: obj.offeringPercentageDiscountOff,
                                    maxDiscountOfferingMoneyValue: obj.maxDiscountOfferingMoneyValue,
                                    activityStatus: obj.activityStatus,
                                    criteriaType: obj.criteriaType,// 优惠门槛
                                    lazadaMangArr:lazadaMangArr,
                                    stackable:obj.stackable || ''
                                }

                                laytpl($(`#lazadaManyMoreDiscountRadioDemo`).html()).render(RadioDemoObj, function(html) {
                                    $('#lazadaManyMoreDiscountRadioView').html(html)
                                })
                                getFunc()
                            })
                        }else{
                            laytpl($('#lazadaManyMoreDiscountDemo').html()).render(obj, function(html) {
                                $('#lazadaManyMoreDiscountView').html(html)
                            })
                            getFunc()
                        }
            },
            btn1:
                obj.activityStatus == 'SUSPEND' || obj.activityStatus == 'FINISH'
                    ? ''
                    : function(index, layero) {
                          let formData = serializeObject($('#lazadaManyMoreDiscountDemoForm'))

                          // 进行中,只允许修改多件多折发放数量，且新的值要比旧值大，未开始也要
                          if (obj.activityStatus == 'ONGOING'||obj.activityStatus == 'NOT_START') {
                              if (formData.orderNumbers < obj.orderNumbers) {
                                  layer.msg('优惠券发放数量须比修改前大', { icon: 2 })
                                  return false
                              }
                          } else {
                              let flag = checkFormData()
                              if (flag == 0) return false
                          }

                          if (formData.id == '') delete formData.id
                          if (formData.periodTime) {
                              formData.startTime = formData.periodTime.split(' - ')[0]
                              formData.endTime = formData.periodTime.split(' - ')[1]
                          }

                        formData.stackable == "true"?'':formData.stackable = false

                          if (type == 0) {
                              formData.storeIdList == ''
                                  ? (formData.storeIdList = [])
                                  : (formData.storeIdList = formData.storeIdList.split(','))
                              // 批量创建多件多折

                              getDatalazadaManyMoreDiscountBatchCreate(formData)
                                  .then(function(res) {
                                      layer.msg(res || '保存成功', { icon: 1 })
                                      layer.close(popIndex)
                                      lazadaManyMoreDiscountTableRender()
                                  })
                                  .catch(function(err) {
                                      if(err.includes("创建活动成功")){
                                          layer.close(popIndex)
                                      }
                                      layer.alert(err, { icon: 2 })
                                  })
                          } else {
                              formData.storeAcctId = obj.storeAcctId
                              formData.flexicomboId = obj.flexicomboId
                              // 编辑单个多件多折
                              getDatalazadaManyMoreDiscountUpdateSingle(formData)
                                  .then(function(res) {
                                      layer.msg(res || '保存成功', { icon: 1 })
                                      layer.close(popIndex)
                                      lazadaManyMoreDiscountTableRender()
                                  })
                                  .catch(function(err) {
                                      layer.alert(err, { icon: 2 })
                                  })
                          }
                          return false
                      }
        })
    }

    // 验证必填项信息
    function checkFormData() {
        let obj = serializeObject($('#lazadaManyMoreDiscountDemoForm')),
            err = '';

        let nowDate = Format(new Date(), 'yyyy-MM-dd hh:mm:ss'), // 当前时间
            periodStartTime, // 活动开始时间
            periodEndTime // 活动结束时间
        if (obj.periodTime) {
            periodStartTime = obj.periodTime.split(' - ')[0]
            periodEndTime = obj.periodTime.split(' - ')[1]
        }

        if (lazadaManyMoreDiscountCheckDate(periodEndTime, periodStartTime) == false) err = '活动结束时间不能小于等于开始时间'
        if (lazadaManyMoreDiscountGetDays(periodStartTime, periodEndTime) > 120) err = '开始和结束时间不能超过120天'
        if (lazadaManyMoreDiscountCheckDate(periodStartTime, nowDate) == false) err = '开始时间不能早于当前时间'

        let criteriaValue = obj.criteriaValue,discountValue = obj.discountValue;
        for (let key in obj) {
            if(obj.orderNumbers < 10){
                err = 'Flexi Combo订单总数，最低不能少于10个'
            }
            // if(obj.apply == 'SPECIFIC_PRODUCTS'&&obj.itemIdList == ''){
            //     err = '请输入item ID'
            // }
            if (
                (key != 'maxDiscountOfferingMoneyValue' && key != 'id' && key != 'itemIdList' && obj[key] == '') ||
                obj.criteriaType == undefined ||
                obj.discountType == undefined ||
                criteriaValue.charAt(criteriaValue.length-1) == ','||
                discountValue.charAt(discountValue.length-1) == ','
            ) {
                err = '必填项不能为空'
            }
        }
        if (err) {
            layer.alert(err, {
                icon: 2
            })
            return 0
        }
        return 1
    }

    // 批量启用or停用
    form.on(`select(lazadaManyMoreDiscountBatchOnOrOff)`, function(data) {
        let checkedDataId = table.checkStatus('lazadaManyMoreDiscountTable').data.map((item) => item.id) //获取选中的数据
        let checkedStatus = data.value // on off

        if (checkedDataId.length <= 0) {
            return layer.alert('请选择需要修改的数据', { icon: 7 })
        }

        lazadaManyMoreDiscountOnOrOffFunc(checkedStatus, checkedDataId)
    })

    function lazadaManyMoreDiscountOnOrOffFunc(type, ids) {
        getDatalazadaManyMoreDiscountBatchOnOrOff(type, ids)
            .then(function(res) {
                if (res.code == '0000') {
                    layer.alert("操作成功", {icon: 1});
                }else if(res.code == '5555'){
                    layer.alert(res.extra.error, {icon: 7});
                }
                lazadaManyMoreDiscountTableRender()
            })
            .catch(function(err) {
                layer.msg(err, { icon: 2 })
            })
    }

    // 站点--店铺--币种 联动
    form.on(`select(lazadaManyMoreDiscountSalesSite)`, function(data) {
        let site = data.value,
            currency = $(data.elem[data.elem.selectedIndex]).attr('currency') // 单位
        $('#lazadaManyMoreDiscountCurrency').val(currency) // 币种单位

        if (site == '') return
        getDatalazadaManyMoreDiscountLazadaStore(site)
            .then(function(result) {
                commonRenderSelect('lazadaManyMoreDiscountStoreIdList', result, {
                    name: 'storeAcct',
                    code: 'id'
                }).then(() => formSelects.render())
            })
            .catch(function(err) {
                layer.msg(err, { icon: 2 })
            })

        laytpl($(`#lazadaManyMoreDiscountRadioDemo`).html()).render(
            {
                discountType:
                    $('#lazadaManyMoreDiscountDemoForm input[name=discountType]:checked').val() || '',
                currency: currency,
                criteriaType: $("#lazadaManyMoreDiscountDemoForm input[name=criteriaType]:checked").val() || '',// 优惠门槛
                lazadaMangArr:[{}]
            },
            function(html) {
                $('#lazadaManyMoreDiscountRadioView').html(html)
            }
        )

        form.render()
    })

    formSelects.on('lazadaManyMoreDiscountStoreIdList', function (id,vals,val,isAdd) {
        let len = 0;
        if(isAdd){
            len = vals.length + 1;
        }else{
            len = vals.length - 1;
        }
        if(len > 1){
            $("[name=apply][value=SPECIFIC_PRODUCTS]").attr("disabled",true)
        }else{
            $("[name=apply][value=SPECIFIC_PRODUCTS]").removeAttr("disabled")
        }
        form.render("radio")
    })

    // 优惠类型: MONEY_VALUE_OFF满减 \ PERCENTAGE_DISCOUNT_OFF折扣
    function ladaVoucherRadioChange() {
        form.on('radio(discountTypeFilter)', function(data) {
            let radioData = data.value
            laytpl($(`#lazadaManyMoreDiscountRadioDemo`).html()).render(
                {
                    discountType: radioData, // 优惠类型
                    currency: $('#lazadaManyMoreDiscountCurrency').val(),
                    criteriaType: $("#lazadaManyMoreDiscountDemoForm input[name=criteriaType]:checked").val(),// 优惠门槛
                    lazadaMangArr:[{}]
                },
                function(html) {
                    $('#lazadaManyMoreDiscountRadioView').html(html)
                    form.render()
                }
            )
        })
    }

    // 优惠门槛: MONEY_VALUE_OFF满减 \ PERCENTAGE_DISCOUNT_OFF折扣
    function ladaVoucherDisplayAreaEnumRadioChange() {
        form.on('radio(criteriaTypeFilter)', function(data) {
            let radioData = data.value,discountTypeVal = $("#lazadaManyMoreDiscountDemoForm input[name=discountType]:checked").val()

            if(discountTypeVal){
            laytpl($(`#lazadaManyMoreDiscountRadioDemo`).html()).render(
                {
                    discountType: discountTypeVal, // 优惠类型
                    currency: $('#lazadaManyMoreDiscountCurrency').val(),
                    criteriaType: radioData,// 优惠门槛
                    lazadaMangArr:[{}]
                },
                function(html) {
                    $('#lazadaManyMoreDiscountRadioView').html(html)
                    form.render()
                }
            )}
        })
    }

    // 优惠上不封顶
    form.on('checkbox(lazadaMMDCheckboxFilter)', function(data){
        if(data.elem.checked){
            $("#lazadaManyMoreDiscountAddGradient").css("display","none")
            let lazadaMangArr = getLazadaMangArr();
            lazadaMangArr.push({"criteriaValue":'',"discountValue":''})
            lazadaMangArr.splice(1)
            let obj = {
                discountType: $("#lazadaManyMoreDiscountDemoForm input[name=discountType]:checked").val(), // 优惠类型
                currency: $('#lazadaManyMoreDiscountCurrency').val(),
                criteriaType: $("#lazadaManyMoreDiscountDemoForm input[name=criteriaType]:checked").val(),// 优惠门槛
                lazadaMangArr:lazadaMangArr,
                stackable:data.elem.checked
            }

            lazadaManyMoreDiscountRadioDemoRender(obj)
        }else{
            $("#lazadaManyMoreDiscountAddGradient").css("display","inline-block")
        }
    });

    function ladaVoucherRangeRadioChange(){
        // 适用范围
        form.on('radio(discountRangeFilter)', function(data){
            if(data.value == 'SPECIFIC_PRODUCTS'){
                $(".discountRange").show()
            }else{
                $(".discountRange").hide()
            }
        });
    }

    function getLazadaMangArr(){
        let discountValue = [],criteriaValue = [],lazadaMangArr = [];
        $("#lazadaManyMoreDiscountRadioView").find("input[name=criteriaValue]").each((index,item)=>criteriaValue.push($(item).val()));
        $("#lazadaManyMoreDiscountRadioView").find("input[name=discountValue]").each((index,item)=>discountValue.push($(item).val()));

        criteriaValue.forEach((item,index)=>lazadaMangArr.push({"criteriaValue":item,"discountValue":discountValue[index]}))
        return lazadaMangArr;
    }

    // 添加梯度,最多三梯度
     $(document).on("click","#lazadaManyMoreDiscountAddGradient",function(){
         let lazadaMangArr = getLazadaMangArr(),stackable =$('#lazadaManyMoreDiscountDemoForm input[name=stackable]').is(':checked');
         lazadaMangArr.push({"criteriaValue":'',"discountValue":''})
         let obj = {
             discountType: $("#lazadaManyMoreDiscountDemoForm input[name=discountType]:checked").val(), // 优惠类型
             currency: $('#lazadaManyMoreDiscountCurrency').val(),
             criteriaType: $("#lazadaManyMoreDiscountDemoForm input[name=criteriaType]:checked").val(),// 优惠门槛
             lazadaMangArr:lazadaMangArr,
             stackable:stackable
         }
         lazadaManyMoreDiscountRadioDemoRender(obj)
     })

    $(document).on('click',".lazadaDiscountDelete",function(){
        let lazadaMangArr = getLazadaMangArr(),index = $(this).attr("deleteIndex");

        lazadaMangArr.splice(index,1)
        let obj = {
            discountType: $("#lazadaManyMoreDiscountDemoForm input[name=discountType]:checked").val(), // 优惠类型
            currency: $('#lazadaManyMoreDiscountCurrency').val(),
            criteriaType: $("#lazadaManyMoreDiscountDemoForm input[name=criteriaType]:checked").val(),// 优惠门槛
            lazadaMangArr:lazadaMangArr,
            stackable:$('#lazadaManyMoreDiscountDemoForm input[name=stackable]').is(':checked')
    }

        lazadaManyMoreDiscountRadioDemoRender(obj)
    })

    function lazadaManyMoreDiscountRadioDemoRender(obj){
        laytpl($(`#lazadaManyMoreDiscountRadioDemo`).html()).render(obj, function(html) {
                $('#lazadaManyMoreDiscountRadioView').html(html)
                form.render();
            }
        )
    }

    // // 获取lazada站点的接口
    // function getDatalazadaManyMoreDiscountGetAllSite() {
    //     return commonReturnPromise({
    //         url: ctx + `/onlineProductLazada/getAllSite.html`,
    //         type: 'GET'
    //     })
    // }

    /*****
     *  批量启用|停用接口
     *  params{
     *      ids:
     *  }
     * ****/
    function getDatalazadaManyMoreDiscountBatchOnOrOff(type, ids) {
        if (type == 'on') {
            // 批量启用
            url= ctx + `/lazada/flexicombo/batchActivateFlexiCombo/${ids}`
        } else if (type == 'off') {
            url= ctx + `/lazada/flexicombo/batchDeactivateFlexiCombo/${ids}`
        }
        return new Promise(function(resolve, reject){
            $.ajax({
                type: 'POST',
                url: url,
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    resolve(res)
                },
                error: function(err){
                    loading.hide();
                    reject(err.error)
                }
            })
        });
    }

    // 修改活动类型
    function getDatalazadaManyMoreDiscountUpdateActivity(id, type) {
        return commonReturnPromise({
            url: ctx + `/lazada/flexicombo/updateActivityType`,
            type: 'POST',
            params:{
                'id':id,
                'activityType':type
            }
        })
    }

    // 批量创建多件多折
    function getDatalazadaManyMoreDiscountBatchCreate(obj) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: ctx + `/lazada/flexicombo/batchCreate`,
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(obj),
                success: function(res) {
                    if (res.code == '0000') {
                        resolve(res.data || res.msg)
                    } else {
                        reject(res.msg || res.extra.error)
                    }
                },
                error: function(err) {
                    reject(err.responseText)
                }
            })
        })
    }

    // 编辑单个多件多折
    function getDatalazadaManyMoreDiscountUpdateSingle(obj) {
        // return commonReturnPromise({
        //     url: ctx + `/lazada/flexicombo/editActivity`,
        //     type: 'POST',
        //     contentType: 'application/json;charset=utf-8',
        //     params: JSON.stringify(obj)
        // })
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: ctx + `/lazada/flexicombo/editActivity`,
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(obj),
                success: function(res) {
                    if (res.code == '0000') {
                        resolve(res.data || res.msg)
                    } else {
                        reject(res.msg)
                    }
                },
                error: function(err) {
                    console.log(err)
                    reject(err.responseText)
                }
            })
        })
    }

    function getDetail(storeAcctId,flexicomboId) {
        return commonReturnPromise({
            url: ctx + `/lazada/flexicombo/getLazadaFlexicomboProductList/${storeAcctId}/${flexicomboId}`,
            type: 'GET'
        })
    }

    // 获取所有lazada站点
    function getDatalazadaManyMoreDiscountLazadaAllSite() {
        return commonReturnPromise({
            url: ctx + `/lazada/voucher/get/lazada/site/all`,
            type: 'GET'
        })
    }

    // 根据站点查询出所有店铺和单位
    function getDatalazadaManyMoreDiscountLazadaStore(site) {
        return commonReturnPromise({
            url: ctx + `/lazada/voucher/get/lazada/store/site/${site}`,
            type: 'GET'
        })
    }
})
