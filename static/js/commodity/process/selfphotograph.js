layui.use(['element','form', 'table', 'laydate', 'upload', 'formSelects'], function() {
    var $ = layui.$,
        admin = layui.admin,
        upload = layui.upload,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        formSelects = layui.formSelects,
        form = layui.form;
    laytpl = layui.laytpl;
    formSelects.render('score_selfphotograph');
    form.render(null, 'sphoto_searchForm');
    //时间处理(默认近180天，6个月)
    var inquiry_nowDateString = new Date().getTime();
    var inquiry_dateFiftweenSting = inquiry_nowDateString - 60*72*60*60*1000;
    var inquiry_dateStart = Format(inquiry_dateFiftweenSting, 'yyyy-MM-dd');
    var inquiry_dateEnd = Format(inquiry_nowDateString, 'yyyy-MM-dd');
    //初始化日期控件
    laydate.render({
        elem: '#sphoto_searchForm input[name=time]',
        range: true,
        type: 'date',
        value: inquiry_dateStart +' - '+ inquiry_dateEnd
    });
    //弹出分类框
    alertCateSelect($('#selef_photo_pl_searchCate_btn'), $('#selef_photo_cateId_search_inp'), $('#selef_photo_pl_search_cate'))

    // 初始化跳转参数
    initSearchParam('#sphoto_searchForm')

    // commonReturnPromise({
    //     url: '/lms/msgSelfImg/initParam',
    //     type: 'post',
    //     contentType: 'application/json',
    //     params: JSON.stringify({
    //         skuList: sSkusArry,
    //         sendReturnStatus: 20
    //     })
    // }).then(res => {
    //     layer.close(index);
    //     layui.admin.batchResultObjAlert('转寄:', res, function () { });
    // });
    let sphoto_processStatus = {"全部":''},receiverIdData = [];
    commonReturnPromise({
        url: '/lms/msgSelfImg/initParam',
        type: 'GET'
    }).then(res => {
        if(res.batchNoList){
            let str = '<option></option>';
            res.batchNoList.forEach(item => {
                str += `<option>${item==''?"无批次":item}</option>`
            })
            $("#sphoto_searchForm [name=batchNo]").html(str)
            form.render("select","sphoto_searchForm")
        }
        if(res.processStatus){
            res.processStatus.forEach(item => {
                sphoto_processStatus[item.name] = item.value
            })
        }
        // 收货人数据
        if(res.receiver){
            receiverIdData = res.receiver;
        }
    });

    function handleRes(res){
        const {failResults,successNum,failNum,totalNum} = res
        let str = `共提交${totalNum}条` + '<br/>'
        if(successNum != 0){
            str += `成功${successNum}条`
        }
        if(failNum != 0){
            str += `失败${failNum}条，失败详情如下`+ '<br/>' + failResults.join('<br/>')
        }
        layer.alert(str)
        $("#sphoto_searchBtn").click()
    }
    new dropButton('selfphotograph_batchOperate');
    // $("#selfphotograph_batchOperate button").mouseenter(function(){
    //     $("#selfphotograph_batchOperate ul").removeClass("hidden")
    // })
    // $("#selfphotograph_batchOperate button").mouseenter(function(){
    //     $("#selfphotograph_batchOperate ul").addClass("hidden")
    //
    // })
    function getCheckTableRowId(){
        let checkTableData = layui.table.checkStatus("selfphotographTable");
        if(checkTableData.data.length == 0){
            layer.alert("请选择批量操作的数据", {icon:7})
            return false;
        }
        let idList = checkTableData.data.map(item => item.id)
        return idList
    }
    // 审核
    $("#selfphotograph_opt1").click(function(){
        let idList = getCheckTableRowId()
        if(!idList){
            return
        }
        commonReturnPromise({
            url: '/lms/msgSelfImg/batchAudit',
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify({idList})
        }).then(res => {
            handleRes(res)
        });
    })
    // 派至仓库
    $("#selfphotograph_opt2").click(function(){
        let idList = getCheckTableRowId()
        if(!idList){
            return
        }
        commonReturnPromise({
            url: '/lms/msgSelfImg/batchDispatch',
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify({idList})
        }).then(res => {
            handleRes(res)
        });
    })
    // 生成批次
    $("#selfphotograph_opt3").click(function(){
        let idList = getCheckTableRowId()
        if(!idList){
            return
        }
        commonReturnPromise({
            url: '/lms/msgSelfImg/batchGenerateBatchNo',
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify({idList})
        }).then(res => {
            // handleRes(res)
            layer.alert('生成批次成功，批次号：' + res)
            $("#sphoto_searchBtn").click()
        });
    })
    // 转待派单
    $("#selfphotograph_opt4").click(function(){
        let idList = getCheckTableRowId()
        if(!idList){
            return
        }
        commonReturnPromise({
            url: '/lms/msgSelfImg/batchUpdateDispatch',
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify({idList})
        }).then(res => {
            handleRes(res)
        });
    })
    // 驳回到待审核
    $("#selfphotograph_opt5").click(function(){
        let idList = getCheckTableRowId()
        if(!idList){
            return
        }
        commonReturnPromise({
            url: '/lms/msgSelfImg/batchUpdateAudit',
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify({idList})
        }).then(res => {
            // layer.alert(res, { icon: 1 });
            handleRes(res)
        });
    })
    element.on('tab(selfphotograph_tab)', function(data) {
        // 110待刊登/115待派单/120待配货/135仓库缺货/130待交接/140未还库/141拍图拦截/145已还库/150已报损/500已取消/’‘全部
        let btn1 = $("#sphoto_rePictureMark"), // 新增拍图需求
            btn2 = $("#spg_sendReturnStatusBtn"), // 转寄
            btn3 = $("#query_image_self_photo"), // 拍图
            btn4 = $("#sphoto_add_refine_sku"), // 需要精修
            btn5 = $("#sphoto_cancel_refine_sku"), // 取消精修
            btn6 = $("#sphoto_goodsArrival"), // 收货
            btn7 = $("#sphoto_cameraComplete"), // 摄影完成
            btn8 = $("#sphoto_artComplete"), // 美工完成
            btn9 = $("#selfphotograph_opt1"), // 审核
            btn10 = $("#selfphotograph_opt2"), // 派至仓库
            btn11 = $("#selfphotograph_opt3"), // 生成批次
            btn12 = $("#selfphotograph_opt4"), // 转待派单
            btn14 = $("#selfphotograph_opt5"), // 驳回到待审核
            btn13 = $("#export_params_self_photo"); // 导出
            btn15 = $("#giveTask_camera"); // 分配摄影
            btn16 = $("#giveTask_artists"); // 分配美工

        btn1.addClass("disN");
        btn2.addClass("disN");
        btn3.addClass("disN");
        btn4.addClass("disN");
        btn5.addClass("disN");
        btn6.addClass("disN");
        btn7.addClass("disN");
        btn8.addClass("disN");
        btn9.addClass("disN");
        btn10.addClass("disN");
        btn11.addClass("disN");
        btn12.addClass("disN");
        btn13.addClass("disN");
        btn14.addClass("disN");
        btn15.addClass("disN");
        btn16.addClass("disN");

        let tabKey = $(this).attr("data-value")
        if (tabKey == 110){ // 110待刊登
            btn1.removeClass("disN")
            btn4.removeClass("disN")
            btn5.removeClass("disN")
            btn9.removeClass("disN")
            btn13.removeClass("disN")
        } else if (tabKey == 115){ // 115待派单
            btn10.removeClass("disN")
            btn13.removeClass("disN")
        } else if (tabKey == 120){ // 120待配货
            btn11.removeClass("disN")
            btn13.removeClass("disN")
        } else if (tabKey == 135){ // 135仓库缺货
            btn12.removeClass("disN")
            btn13.removeClass("disN")
        } else if (tabKey == 130){ // 130待交接
            btn6.removeClass("disN")
            btn12.removeClass("disN")
            btn13.removeClass("disN")
        } else if (tabKey == 140){ // 140未还库
            btn2.removeClass("disN")
            btn7.removeClass("disN")
            btn8.removeClass("disN")
            btn3.removeClass("disN")
            btn13.removeClass("disN")
            btn15.removeClass("disN")
            btn16.removeClass("disN")
        } else if (tabKey == 141){ // 141拍图拦截
            btn13.removeClass("disN")
            btn14.removeClass("disN")
        } else if (tabKey == 145){ // 145已还库
            btn7.removeClass("disN")
            btn8.removeClass("disN")
            btn13.removeClass("disN")
            btn15.removeClass("disN")
            btn16.removeClass("disN")
        } else if (tabKey == 150){ // 150已报损
            btn13.removeClass("disN")
        } else if (tabKey == 500){ // 500已取消
            btn13.removeClass("disN")
        } else if (tabKey == ''){ // 全部
            btn13.removeClass("disN")
        }
        $("#sphoto_searchBtn").click();
        // tab页签数量统计
        getAllProcessStatusCountByCondition();
    })
    //切换需求人和开发专员selftphoto_switchPerson
    form.on('select(selftphoto_switchPerson)', function(data) {
        var val = data.value;
        if (val == 'creatorId') { //需求人
            $.ajax({
                type: "post",
                url: ctx + "/msgselfimg/listcreator.html",
                dataType: "json",
                beforeSend: function() {
                    loading.show();
                },
                success: function(returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                        return;
                    }
                    var str = "<option value=''>全部</option>";
                    if (returnData.data) {
                        for (var i = 0; i < returnData.data.length; i++) {
                            str += "<option value='" + returnData.data[i].creatorId + "'>" + returnData.data[i].creator + "</option>";
                        }
                    }
                    $("#sphoto_searchForm #selftphoto_switchPerson_render").empty().html(str);
                    form.render();
                }
            });
            $("#sphoto_searchForm .selftphoto_switchPerson_render").show()
            $("#sphoto_searchForm .photographerId").hide()
            $("#sphoto_searchForm .artDesignerId").hide()
        } else if(val == 'performanceOwner') { //开发专员
            $.ajax({
                type: "post",
                url: ctx + "/msgselfimg/listBizzOwens.html",
                dataType: "json",
                beforeSend: function() {
                    loading.show();
                },
                success: function(returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                        return;
                    }
                    var str = "<option value=''>全部</option>";
                    if (returnData.data) {
                        for (var i = 0; i < returnData.data.length; i++) {
                            str += "<option value='" + returnData.data[i].bizzOwnerId + "'>" + returnData.data[i].bizzOwner + "</option>";
                        }
                    }
                    $("#sphoto_searchForm #selftphoto_switchPerson_render").empty().html(str);
                    form.render();
                }
            });
            $("#sphoto_searchForm .selftphoto_switchPerson_render").show()
            $("#sphoto_searchForm .photographerId").hide()
            $("#sphoto_searchForm .artDesignerId").hide()
        } else if(val == 'photographerId') { // 摄影专员
            $("#sphoto_searchForm .photographerId").show()
            $("#sphoto_searchForm .selftphoto_switchPerson_render").hide()
            $("#sphoto_searchForm .artDesignerId").hide()
        } else if(val == 'artDesignerId') { // 美工专员
            $("#sphoto_searchForm .artDesignerId").show()
            $("#sphoto_searchForm .selftphoto_switchPerson_render").hide()
            $("#sphoto_searchForm .photographerId").hide()
        } else if(val == 'receiverId') { // 美工专员
            var str = "<option value=''>全部</option>";
            for (var i = 0; i < receiverIdData.length; i++) {
                str += "<option value='" + receiverIdData[i].receiverId + "'>" + receiverIdData[i].receiver + "</option>";
            }
            $("#sphoto_searchForm #selftphoto_switchPerson_render").empty().html(str);
            form.render();
            $("#sphoto_searchForm .selftphoto_switchPerson_render").show()
            $("#sphoto_searchForm .photographerId").hide()
            $("#sphoto_searchForm .artDesignerId").hide()
        }
    });
    // //加载需求人
    $(function() {
        $.ajax({
            type: "post",
            url: ctx + "/msgselfimg/listcreator.html",
            dataType: "json",
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.msg(returnData.msg);
                    return;
                }
                var str = "<option value=''>全部</option>";
                if (returnData.data) {
                    for (var i = 0; i < returnData.data.length; i++) {
                        str += "<option value='" + returnData.data[i].creatorId + "'>" + returnData.data[i].creator + "</option>";
                    }
                }
                $("#sphoto_searchForm #selftphoto_switchPerson_render").empty().html(str);
                form.render();
            }
        });
    });
    //表格渲染结果

    table.on('edit(selfphotographTable)', function(obj){
        //  获取单元格编辑之前td的选择器
        let oldValue = $(this).prev('div').text()
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        var Adata = {id: data.id}
        Adata[field] = value

        oneAjax.post({
            url: "/msgselfimg/updateOne",
            data: Adata,
            success: function (data) {
                if (data.code === '0000') {
                    layer.msg('修改成功')
                }
            }
        })
    })
    //展示已知数据
    table.render({
        elem: "#selfphotographTable",
        id: "selfphotographTable",
        url: ctx + '/msgselfimg/list.html', // 数据接口
        toolbar: true,
        where: getSearchData(),
        page: true,
        limits: [200, 300, 500], // 每页条数的选择项
        limit: 200, //默认显示20条
        cols: [
            [
                { type: "checkbox", width: 30 },
                {
                    field: "sSku",
                    title: "子SKU",
                    templet: '#selfpg_sSku'
                }, {
                    field: "pSku",
                    title: "父SKU",
                    templet: "#pSkuTpl_selfphotograph"
                }, {
                    title: "图片",
                    templet: "#imagetpl_selfphotograph"
                }, {
                    field: "cateName",
                    title: "类目",
                    templet: "#cateName_selfphotograph",
                    width: 180
                },  {
                    field: "compSalesNum",
                    title: "商品信息",
                    templet: "#sphoto_selfTypeTpl"
                // }, {
                //     field: "purchaseCostPrice",
                //     title: "成本"
                }, {
                    field: "tplType",
                    title: "类型",
                    templet: "#tplType_selfphotograph"
                },{
                    field: "selfStatus",
                    title: "拍图状态",
                    templet: "#sphotoStatusTpl"
                },{
                    field: "batchNo",
                    title: "批次",
                },{
                  field: "sendReturnStatus",
                  title: "转寄",
                  templet: "#sf_sendReturnStatus",
                  width: 220
                }, {
                    field: "remark",
                    title: "备注(可编辑)",
                    edit: "text",
                    style: 'background-color: #7FFFD4;height:50px;overflow:hidden;'
                }, {
                    field: "creator",
                    title: "人员",
                    templet: "#person_selfphotograph"
                }, {
                    field: "time",
                    title: "时间",
                    templet: "#sf_timeTpl",
                    width: 170
                }, {
                    title: "操作",
                    toolbar: "#toolbarTpl"
                }
            ],
        ],
        done: function(res, curr, count) {
            $("#sphoto_count").html(count);
            //懒加载
            imageLazyload();
            if (res.code == '0000') {
                for (var i in res.data) {
                    if (res.data[i].overtime && res.data[i].selfStatus < 3) {
                        $("#selfphotographTable").parent("div").find('tr[data-index="' + i + '"]').addClass('warn');
                    }
                }
                $(".selfphotograph_tab .layui-this").find("span").text(count)
            }
            // if($(".selfphotograph_tab").find(".layui-this").data("value") == 110){
            //     $("[name=selfp_BatchOption]").next().find("dd[lay-value='派至仓库']").hide()
            //     $("[name=selfp_BatchOption]").next().find("dd[lay-value='生成批次']").hide()
            //     $("[name=selfp_BatchOption]").next().find("dd[lay-value='转待派单']").hide()
            // }
        }
    });
    // tab页签数量统计
    getAllProcessStatusCountByCondition();
    
    $("#sphoto_add_refine_sku").on('click', function() {
        var checkStatus = table.checkStatus('selfphotographTable'),
            date = checkStatus.data;
        mackRefineSku(checkStatus, 1);
    });
    //限制最高2000,超出提示
    $('#selftphotograph_searchText').on('input', function() {
      let maxLength = $(this).attr('maxlength');
      if ($(this).val().length >= maxLength) {
          layer.msg(`输入的最大长度为${maxLength}`,{icon:7});
      }
  });
    $("#sphoto_cancel_refine_sku").on('click', function() {
        var checkStatus = table.checkStatus('selfphotographTable'),
            date = checkStatus.data;
        mackRefineSku(checkStatus, 0);
    });

    // 标记/取消 精修
    function mackRefineSku(checkStatus, type) {
        var data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择需要标记的商品');
            return
        }
        var idList = [];
        var sSku = [];
        var pSku = [];
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id);
            sSku.push(data[i].sSku);
            pSku.push(data[i].pSku);
        }
        var bean = {};
        bean.sSkus = sSku;
        bean.pSkus = pSku;
        bean.type = type;
        var confirmIndex = layer.confirm('确认对这些商品' + (type ? '标记' : '取消') + '精修吗', { btn: ['确认', '取消'] },
            function() {
                loading.show();
                $.ajax({
                    url: ctx + "/msgselfimg/mackRefinementProduct.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(bean),
                    success: function(res) {
                        if (res.code == '0000') {
                            layer.msg("操作成功");
                            //需要修改为刷新
                            table.reload('selfphotographTable', {
                                page: {
                                    curr: 1 //重新从第 1 页开始
                                },
                                where: getSearchData()
                            });
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            })
    }



    // //上传功能
    // //导入计费功能
    // upload.render({
    //     elem: '#sphoto_import_profile_ranking' //绑定元素
    //         ,
    //     url: `${ctx}/msgselfimg/importExcel.html` //上传接口
    //         ,
    //     accept: 'file' //允许上传的文件类型
    //         ,
    //     exts: 'xlsx',
    //     done: function(res) {
    //         if (res.code == "0000") {
    //             layer.open({
    //                 title: "导入结果",
    //                 area: ['380px', '405px'],
    //                 btn: ['确定'],
    //                 content: res.msg,
    //                 yes: function(index) {
    //                     layer.close(index);
    //                 }
    //             });
    //             // layer.msg(res.msg,{icon:1,time:5000});
    //         } else {
    //             layer.open({
    //                 title: "导入结果",
    //                 area: ['260px', '260px'],
    //                 btn: ['确定'],
    //                 content: res.msg,
    //                 yes: function(index) {
    //                     layer.close(index);
    //                 }
    //             });
    //             // layer.msg(res.msg,{icon:5 ,time :5000});
    //         }
    //     },
    //     error: function() {
    //         layer.msg('服务器出现故障!');
    //     }
    // });
    // tab页签数量统计
    function getAllProcessStatusCountByCondition(){
        let params=getSearchData();
        delete params.processStatus;
        commonReturnPromise({
            type: 'GET',
            url: ctx + "/msgselfimg/getAllProcessStatusCountByCondition",
            params: params
        }).then(returnData=>{
            $(".selfphotograph_tab li").each(function(index,li_item){
                let data_val=$(li_item).attr('data-value');
                returnData.filter(function(item){
                    if(data_val){
                        if(data_val==item.process_status){
                            return $(li_item).find('span').text(item.count);
                        }
                    }else{
                        $(li_item).find('span').text(item.count)
                    }
                })
            })
        })
    }

    function getSearchData() {
        var data = {};
        var $personSel = $('[lay-filter="selftphoto_switchPerson"]').val();
        data.processStatus = $(".selfphotograph_tab .layui-this").data("value");
        data.selfType = $("#sphoto_searchForm [name=photoType]").val();
        data.selfStatus = $("#sphoto_searchForm [name=isComplete]").val();
        data.isSale = $("#sphoto_searchForm [name=isSale]").val();
        //0: 需求人1:开发专员
        if ($personSel == 'creatorId') {
            data.creatorId = $("#selftphoto_switchPerson_render").val();
            delete data.performanceOwner;
            delete data.photographerId;
            delete data.artDesignerId;
            delete data.receiverId;
        } else if ($personSel == 'performanceOwner') {
            //业务归属人--开发专员
            data.performanceOwner = $("#selftphoto_switchPerson_render").val();
            delete data.creatorId;
            delete data.photographerId;
            delete data.artDesignerId;
            delete data.receiverId;
        } else if ($personSel == 'photographerId') {
            //摄影专员
            data.photographerId = $("#sphoto_searchForm [name=photographerId]").val();
            delete data.creatorId;
            delete data.performanceOwner;
            delete data.artDesignerId;
            delete data.receiverId;
        } else if ($personSel == 'artDesignerId') {
            //美工专员
            data.artDesignerId = $("#sphoto_searchForm [name=artDesignerId]").val();
            delete data.creatorId;
            delete data.performanceOwner;
            delete data.photographerId;
            delete data.receiverId;
        } else if ($personSel == 'receiverId') {
            data.receiverId = $("#selftphoto_switchPerson_render").val();
            delete data.creatorId;
            delete data.performanceOwner;
            delete data.photographerId;
            delete data.artDesignerId;
        }
        var $allTimeout = $('[name="allTimeout"]').val(),
            $allTimeoutVal = $("#sphoto_searchForm [name=allTimeoutVal]").val();
        //整体超时/摄影超时/美工超时
        if ($allTimeout == 'entireTimeout') {
            data.overtime = $allTimeoutVal;
            delete data.pgOvertime;
            delete data.adOvertime;
        } else if ($allTimeout == 'photographTimeout') {
            data.pgOvertime = $allTimeoutVal;
            delete data.overtime;
            delete data.adOvertime;
        }else if ($allTimeout == 'artTimeout') {
            data.adOvertime = $allTimeoutVal;
            delete data.overtime;
            delete data.pgOvertime;
        }
        searchType = $("#sphoto_searchForm [name=searchType]").val();
        if (searchType) {
            data.isExactQuery = searchType.split('_')[1] === '0' ? false : true;
            if (searchType.split('_')[0] === 'p') {
                data.pSkus = $("#sphoto_searchForm [name=searchText]").val();
                data.sSkus = '';
            } else {
                data.sSkus = $("#sphoto_searchForm [name=searchText]").val();
                data.pSkus = '';
            }
        }
        // data.pgOvertime = $("#sphoto_searchForm [name=photographTimeout]").val();
        // data.adOvertime = $("#sphoto_searchForm [name=artTimeout]").val();
        // data.overtime = $("#sphoto_searchForm [name=entireTimeout]").val();
        //到货时间
        var timeType = $("#sphoto_searchForm [name=timeType]").val();
        var createTimeStr = $('#sphoto_searchForm [name=time]').val();
        var time1 = createTimeStr == '' ? '' : createTimeStr.split(' - ')[0] + ' 00:00:00';
        var time2 = createTimeStr == '' ? '' : createTimeStr.split(' - ')[1] + ' 23:59:59';
        data.createTime1 = "";
        data.createTime2 = "";
        data.receiveTime1 = "";
        data.receiveTime2 = "";
        data.photographTime1 = "";
        data.photographTime2 = "";
        data.artDesignTime1 = "";
        data.artDesignTime2 = "";
        data.consigneeTimeStart = ""; //配货开始时间
        data.consigneeTimeEnd = "";  //配货结束时间
        if(timeType != 'consigneeTime'){
        data[timeType + "1"] = time1;
        data[timeType + "2"] = time2;
        }else{
            data.consigneeTimeStart = time1; //配货开始时间
            data.consigneeTimeEnd = time2;   //配货结束时间
        }

        // 获取评分
        // data.scoreListStr = $('#sphoto_searchForm [name=score]').val();
        // data.scoreType = $('#sphoto_searchForm [name=scoreType]').val();
        //设置 成本
        // data.lessThenPurchaseCost = $("#sphoto_searchForm [name=self_photo_purchase_cost_price_max]").val();
        // data.greatThenPurchaseCost = $("#sphoto_searchForm [name=self_photo_purchase_cost_price_min]").val();
        //设置 竞品销量
        // data.lessThenCompSales = $("#sphoto_searchForm [name=self_photo_com_sale_num_max]").val();
        // data.greatThenCompSales = $("#sphoto_searchForm [name=self_photo_com_sale_num_min]").val();
        //竞品排序
        data.comSalesNumSortType = $("#sphoto_searchForm [name=compSalesSortType]").val();
        //分类树
        data.cateId = $("#sphoto_searchForm [name=cateId]").val();
        //精修
        data.refinementProduct = $("#sphoto_searchForm [name=refinementProduct]").val();
        //转寄状态
        data.sendReturnStatus = $("#sphoto_searchForm [name=sendReturnStatus]").val();
        data.tplType = $("#sphoto_searchForm [name=tplType]").val();
        // console.log(data);
        return data;
    }
    $("#sphoto_searchBtn").on("click", function() {
        //执行重载
        table.reload('selfphotographTable', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: getSearchData()
        });
    });
    //摄影完成
    $('#sphoto_cameraComplete').click(function() {
        layer.open({
            title: '标记已完成自拍图的子sku',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['600px', '400px'],
            shadeClose: false,
            btn: ['提交', '关闭'],
            content: $('#sphoto_cameraCompleteLayer').html(),
            success: function(layero, index) {
                //加载父sku按钮
                initPSkuOperateBtn(layero, 1);
                //渲染
                form.render();
            },
            btn2: function(index, layero) {
                var param = {};
                var sSku = $(layero).find("textarea[name=sSku]").val();
                param.sSkus = sSku.split('\n').join(',').toUpperCase();
                loading.show()
                $.ajax({
                    type: "post",
                    url: ctx + "/msgselfimg/phfinish.html",
                    dataType: "json",
                    data: param,
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code === "5555") {
                            var failSku = returnData.data.failSkus.join('<br/>');
                            layer.alert('摄影完成失败：<br/>' + failSku, { icon: 2 });
                        } else if (returnData.code == '0000') {
                            layer.alert('摄影完成成功', function(index) {
                                //刷新页面
                                table.reload('selfphotographTable', { where: getSearchData() });
                                layer.close(index);
                            }, { icon: 6 });
                        } else {
                            layer.alert(returnData.msg, { icon: 2 });
                        }
                    }
                });
            }
        })
    });

    //美工完成
    $('#sphoto_artComplete').click(function() {
        layer.open({
            title: '标记已完成自拍图的子sku',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['600px', '400px'],
            shadeClose: false,
            btn: ['提交', '关闭'],
            content: $('#sphoto_artCompleteLayer').html(),
            success: function(layero, index) {
                //加载父sku按钮
                initPSkuOperateBtn(layero, 2);
                //渲染
                form.render();
            },
            btn2: function(index, layero) {
                var param = {};
                param.sSkus = $(layero).find("textarea[name=artsSku]").val().split('\n').join(',').toUpperCase();
                loading.show()
                $.ajax({
                    type: "post",
                    url: ctx + "/msgselfimg/adfinish.html",
                    dataType: "json",
                    data: param,
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code === "5555") {
                            var failSku = returnData.data.failSkus.join('<br/>');
                            layer.alert('美工完成失败：<br/>' + failSku, { icon: 2 });
                        } else if (returnData.code == '0000') {
                            layer.alert('美工完成成功', function(index) {
                                //刷新页面
                                table.reload('selfphotographTable', { where: getSearchData() });
                                layer.close(index);
                            }, { icon: 6 });
                        } else {
                            layer.alert(returnData.msg, { icon: 2 });
                        }
                    }
                });
            }
        })
    });
    //新增拍图需求
    $('#sphoto_rePictureMark').click(function() {
        layer.open({
            title: '新增拍图需求',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['800px', '500px'],
            shadeClose: false,
            // btn: ['提交快捷拍图', '提交', '关闭'],
            btn: ['提交', '关闭'],
            content: $('#sphsoto_rePictureMarkLayer').html(),
            success: function(layero, index) {
                $(layero).find(".layui-layer-btn0").before($("#selfphotograph_submitQuickShot").html())
                // $(layero).find(".layui-layer-btn0").css("float","left")
                // $(layero).find(".layui-layer-btn0").after("<span style='float: left;margin-top: 10px;color: #e6a23c;'>说明：使用快捷拍图创建的任务，直接把商品给摄影拍照，无需仓库配货流程</span>")
                // $(layero).find(".layui-layer-btn1").css({
                //     'border-color': '#1E9FFF',
                //     'background-color': '#1E9FFF',
                //     'color': '#fff',
                // })
                form.render('');
                $('body').on('click', '#sphsoto_searchSku', debounce(function() {
                    appendskus(layero);
                }, 1000, 2000))
                $(layero).find(".submitQuickShot").click(function(){
                    selfphotograph_addmsg(layero,true)
                })
            },
            // yes: function(index, layero) { // '提交快捷拍图'
            //     selfphotograph_addmsg(layero,true)
            // },
            btn2: function(index, layero) { //  '提交'
                selfphotograph_addmsg(layero,false)
                return false
            }
        });
    });
    //分配摄影
    $('#giveTask_camera').click(function() {
        var checkStatus = table.checkStatus('selfphotographTable');
        if (!checkStatus.data || checkStatus.data.length == 0) {
            layer.msg('请选择拍图需求');
            return
        }
        commonReturnPromise({
            type: 'GET',
            url: ctx + "/sysuser/listByRole.html?role=摄影专员",
        }).then(returnData=>{
            layer.open({
                title: '分配摄影',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['500px', '40%'],
                shadeClose: false,
                // btn: ['提交快捷拍图', '提交', '关闭'],
                btn: ['提交', '关闭'],
                content: $('#giveTask_camera_div').html(),
                success: function(layero, index) {
                    var camera_option='<option value="">请选择摄影专员</option>'
                    returnData.forEach(function(item,index){
                        camera_option+=`<option value="${item.id}" user_name='${item.userName}'>${item.userName}</option>`
                    })
                    $("#camera_select").html(camera_option);
                    form.render('');
                },
                yes: function(index, layero) { // '提交摄影专员'
                    let idList=getCheckTableRowId();
                    let appointUserId=$("#camera_select").val();
                    let appointUserName=$("#camera_select option:checked").attr('user_name');
                    if(!appointUserId||!appointUserName){
                        layer.msg('请选择摄影专员',{icon:2});
                        return ;
                    }
                    let params={
                        idList,
                        appointUserId,
                        appointUserName
                    }
                    commonReturnPromise({
                        type: 'POST',
                        url: ctx + "/msgSelfImg/batchUpdatePhotographer",
                        params:JSON.stringify(params),
                        contentType: "application/json",
                    }).then(data=>{
                        let msg_str=`分配摄影结果：提交${data.totalNum}条;成功${data.successNum}条,失败${data.failNum}条<br>`
                        if(data.failResults.length!=0){
                            msg_str+='失败的sku:'
                            data.failResults.join(',').split(',').forEach(function(msg){
                                msg_str+='<br>'+msg;
                            })
                        }
                        layer.alert(msg_str);
                        $("#sphoto_searchBtn").trigger('click');
                        layer.close(index)
                    })
                },
               
            });
        })
    });
    //分配美工
    $('#giveTask_artists').click(function() {
        var checkStatus = table.checkStatus('selfphotographTable');
        if (!checkStatus.data || checkStatus.data.length == 0) {
            layer.msg('请选择拍图需求');
            return
        }
        commonReturnPromise({
            type: 'GET',
            url:  ctx + "/sysuser/listByRole.html?role=美工专员",
        }).then(returnData=>{
            layer.open({
                title: '分配美工',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['500px', '40%'],
                shadeClose: false,
                // btn: ['提交快捷拍图', '提交', '关闭'],
                btn: ['提交', '关闭'],
                content: $('#giveTask_artists_div').html(),
                success: function(layero, index) {
                    var camera_option='<option value="">请选择美工专员</option>'
                    returnData.forEach(function(item,index){
                        camera_option+=`<option value="${item.id}" user_name='${item.userName}'>${item.userName}</option>`
                    })
                    $("#artists_select").html(camera_option);
                    form.render('');
                },
                yes: function(index, layero) { // '提交美工专员'
                    let idList=getCheckTableRowId();
                    let appointUserId=$("#artists_select").val();
                    let appointUserName=$("#artists_select option:checked").attr('user_name');
                    if(!appointUserId||!appointUserName){
                        layer.msg('请选择美工专员',{icon:2});
                        return ;
                    }
                    let params={
                        idList,
                        appointUserId,
                        appointUserName
                    }
                    commonReturnPromise({
                        type: 'POST',
                        url: ctx + "/msgSelfImg/batchUpdateArtDesigner",
                        params:JSON.stringify(params),
                        contentType: "application/json",
                    }).then(data=>{
                        let msg_str=`分配美工结果：提交${data.totalNum}条;成功${data.successNum}条,失败${data.failNum}条<br>`
                        if(data.failResults.length!=0){
                            msg_str+='失败的sku:'
                            data.failResults.join(',').split(',').forEach(function(msg){
                                msg_str+='<br>'+msg;
                            })
                        }
                        layer.alert(msg_str);
                        $("#sphoto_searchBtn").trigger('click');
                        layer.close(index)
                    })
                },
               
            });
        })
    });
    function selfphotograph_addmsg(layero,simpleCreatFlag){
        var param = {},
            skusArr = [];
        var skus = $(layero).find('input[name=skus]').siblings('.layui-form-checked');
        for (var i = 0; i < skus.length; i++) {
            skusArr.push($(skus[i]).find('span').text());
        }
        if (skusArr.length > 0) {
            param.sSkus = skusArr.join(',').toUpperCase();
        }
        param.tplType = $(layero).find("[name=tplType]").val();
        param.remark = $(layero).find("textarea[name=remark]").val();

        if (!param.sSkus || !param.sSkus.length) {
            layer.msg('请选择子sku')
            return false
        }
        if (param.tplType == null || param.tplType === '') {
            layer.msg('请选择模版类型')
            return false
        }
        param["simpleCreatFlag"] = simpleCreatFlag
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/msgselfimg/addmsg.html",
            dataType: "json",
            data: param,
            success: function(returnData) {
                loading.hide()
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                    return false
                } else {
                    var data = returnData.data;
                    layer.alert('提交:<span class="red">' + data.totalNum + '</span>条<br/>新拍:<span class="red">' + data.newNum + '</span>条<br/>补拍:<span class="red">' + data.completNum + '</span>条<br/>重拍:<span class="red">' + data.remakeNum + '</span>条', { icon: 6 })
                }
                layer.close();
                table.reload('selfphotographTable', { where: getSearchData() });
            }
        });
    }

    //查询并展示子sku
    function appendskus(layero) {
        $('#sphsoto_skuTable tbody').empty();
         let skuType = $(layero).find("select[name=skuType]").val(),
            skuStr = $(layero).find("textarea[name=skuStr]").val();
        if (skuStr) {
            let _skuStr = skuStr.split('\n').join(',').toUpperCase();
            $.ajax({
                type: "post",
                url: ctx + "/msgselfimg/listsku.html",
                dataType: "json",
                data: { 'skuStr': _skuStr,'skuType': skuType },
                success: function(returnData) {
                    var emptyPsku = []
                    if (returnData.code == '0000' && returnData.data.length > 0) {
                        returnData.data = returnData.data;
                        for (var i in returnData.data) {
                            var $tr = {},
                                skus = osort(returnData.data[i].sSkus);
                            if (JSON.stringify(skus) != "{}") {
                                $tr = $('<tr></tr>');
                                var $td = $('<td data-index="sskus"></td>');
                                for (var j in skus) {
                                    var sku = skus[j].split('@')[0];
                                    let skuList = _skuStr.split(",")
                                    if(skuList.includes(sku)){
                                        var $skus = '<input type="checkbox" name="skus" value="' + sku + '" title="' + sku + '" checked lay-skin="primary">';
                                    }else{
                                        var $skus = '<input type="checkbox" name="skus" value="' + sku + '" title="' + sku + '" lay-skin="primary">';
                                    }
                                    $td.append($skus);
                                }
                                $tr.append('<td><input type="checkbox" lay-skin="primary" name="all_check" title="' + returnData.data[i].pSku + '" value="' + returnData.data[i].pSku + '" layui-filter="all_check"></td>');
                                $tr.append($td);
                            } else {
                                emptyPsku.push(returnData.data[i].pSku);
                            }
                            if ($tr) {
                                $('#sphsoto_skuTable tbody').append($tr);
                            }
                        }
                        form.render('');
                        //全选 取消全选
                        $('input[name="all_check"]').siblings('.layui-form-checkbox').click(function() {
                            var sskuCheckbox = $(this).parents('td').siblings('td[data-index="sskus"]').find('input[name="skus"]').siblings('.layui-form-checkbox');
                            var isChecked = $(this).hasClass('layui-form-checked');
                            if (isChecked) {
                                sskuCheckbox.each(function(index, item) {
                                    $(item).addClass('layui-form-checked');
                                });
                            } else {
                                sskuCheckbox.each(function(index, item) {
                                    $(item).removeClass('layui-form-checked');
                                })
                            }
                        });
                        if (emptyPsku.length > 0) {
                            layer.alert('无效父sku:<br/>' + emptyPsku.join('<br/>'), { icon: 2 });
                        }
                    }
                }
            })
        }
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

    //收货
    $('#sphoto_goodsArrival').click(function() {
        layer.open({
            title: '摄影收货',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['600px', '400px'],
            shadeClose: false,
            btn: ['关闭'],
            content: $('#sphoto_goodsArrivalLayer').html(),
            id: 'sphoto_goodsArrivalLayerId',
            success: function(layero, index) {
                //加载父sku按钮
                // initPSkuOperateBtn(layero, 0);
                // 回车搜索
                $(layero).find(".sphoto_goodsArrivalLayerSku").focus();
                $(layero).find(".sphoto_goodsArrivalLayerSku").keydown(function(e){
                    if(e.keyCode == 13){
                        if(e.target.value){
                            let radioCheck = $(layero).find("[name=sendReturnStatus]:checked").val()
                            if(!radioCheck){
                                return layer.msg("需选择分类")
                            }
                            let sku = e.target.value;

                            commonReturnPromise({
                                url: '/lms/msgSelfImg/receivePreQueryAndCheck?sku=' + sku,
                                type: 'GET'
                            }).then(data => {
                                if(data.skuNumber == 1){
                                    // 收货完成
                                    $(layero).find("[name=skuNumber]").val(data.skuNumber)
                                    takeDeliveryOfGoods(sku,radioCheck,1,layero)
                                }else{
                                    $(layero).find("[name=skuNumber]").val(data.skuNumber)
                                    $(layero).find("[name=skuNumber]").focus();
                                }
                            })
                        }
                    }
                })
                $(layero).find("[name=skuNumber]").keydown(function(e){
                    if(e.keyCode == 13){
                        if(e.target.value){
                            let radioCheck = $(layero).find("[name=sendReturnStatus]:checked").val()
                            if(!radioCheck){
                                return layer.msg("需选择分类")
                            }
                            let sku = $(layero).find("[name=sSku]").val()
                            // 修改后的数量
                            let skuNumber = $(layero).find("[name=skuNumber]").val()
                            takeDeliveryOfGoods(sku,radioCheck,skuNumber,layero)
                        }
                    }
                })
                //渲染
                form.render();
            },
        })
    });
    // 收货完成
    function takeDeliveryOfGoods(sku,radioCheck,skuNumber,layero){
        commonReturnPromiseRes({
            url: '/lms/msgSelfImg/receive?sku=' + sku + '&sendReturnStatus=' + radioCheck + '&skuNumber=' + skuNumber,
            type: 'GET'
        }).then(res => {
            if(res.code == '0000'){
                $(layero).find(".receiveRes").html(res.msg)
                $(layero).find(".receiveRes1").html(res.data.pskuNumber?res.data.pskuNumber:'') // 父sku数
                $(layero).find(".receiveRes2").html(res.data.skuNumber?res.data.skuNumber:'') // 商品数
            }else{
                $(layero).find(".receiveRes").html(`<span style="color:red">${res.msg}</span>`)
            }
            $(layero).find(".sphoto_goodsArrivalLayerSku").focus();
            // 全选
            $(layero).find(".sphoto_goodsArrivalLayerSku").select();

            //播报语音
            if (res.msg) {
                var speechSynthesisUtterance = new SpeechSynthesisUtterance(
                    `${res.msg}`
                );
                speechSynthesisUtterance.rate = 3;
                speechSynthesis.speak(speechSynthesisUtterance);
            }
        }).catch(err => {
            $(layero).find(".receiveRes").html(`<span style="color:red">${err}</span>`)
            $(layero).find(".sphoto_goodsArrivalLayerSku").focus();
            // 全选
            $(layero).find(".sphoto_goodsArrivalLayerSku").select();

            //播报语音
            if (err) {
                var speechSynthesisUtterance = new SpeechSynthesisUtterance(
                    `${err}`
                );
                speechSynthesisUtterance.rate = 3;
                speechSynthesis.speak(speechSynthesisUtterance);
            }
        });

    }
    //ztt20230913--转寄功能弹框
    $('#spg_sendReturnStatusBtn').on('click', function(){
      layer.open({
        title: '转寄状态',
        type: 1, //不加该属性,就会出现[object Object]
        area: ['600px', '400px'],
        shadeClose: false,
        btn: ['转上海', '关闭'],
        content: $('#spg_sendReturnStatusLayer').html(),
        id: 'spg_sendReturnStatusLayerId',
        success: function(layero, index) {
          let returnBtn = '<span class="layui-btn layui-btn-sm returnyiwu" style="float: left;">退义乌</span>'
          layero.find('.layui-layer-btn a:first').before(returnBtn);
          //转义乌按钮点击事件
          layero.find('.returnyiwu').on('click', function(){
            //还义乌20
            let tareaVal =layero.find("textarea[name=sSku]").val().trim();
            if(!tareaVal){
              return layer.msg('请输入SKU', {icon:7});
            }
            let sSkusArry = tareaVal.split('\n');
            commonReturnPromise({
              url: '/lms/msgselfimg/updateSendReturnStatus',
              type: 'post',
              contentType: 'application/json',
              params: JSON.stringify({
                skuList: sSkusArry,
                sendReturnStatus: 20
              })
            }).then(res => {
              layer.close(index);
              layui.admin.batchResultObjAlert('转寄:', res, function () { });
            });
          });
        },
        btn2: function(index, layero){
          //转上海10
          //还义乌20
          let tareaVal =layero.find("textarea[name=sSku]").val().trim();
          if(!tareaVal){
            layer.msg('请输入SKU', {icon:7});
          }else{
            let sSkusArry = tareaVal.split('\n');
            commonReturnPromise({
              url: '/lms/msgselfimg/updateSendReturnStatus',
              type: 'post',
              contentType: 'application/json',
              params: JSON.stringify({
                skuList: sSkusArry,
                sendReturnStatus: 10
              })
            }).then(res => {
              layer.close(index);
              layui.admin.batchResultObjAlert('转寄:', res, function () { });
            });
          }
          return false;
        }
      });
    });

    /**
     * 初始化父SKU操作btn
     * @param layero
     * @param selfImgStatus
     * @param fuc yes回调
     */
    function initPSkuOperateBtn(pLayero, selfImgStatus) {
        //初始化btn参数
        var titles = { "0": "父sku收货", "1": "父sku摄影完成", "2": "父SKU美工完成" };
        var pSkuOperateBtn = '<button id="sphsoto_pSkuOperateBtn" class="layui-btn layui-btn-sm layui-btn-primary" style="float: left;">按父SKU</button>'
        $(pLayero).find('.layui-layer-btn a:first').before(pSkuOperateBtn);
        //绑定点击事件
        $("#sphsoto_pSkuOperateBtn").click(function() {
            layer.open({
                title: titles[selfImgStatus],
                type: 1, //不加该属性,就会出现[object Object]
                area: ['800px', '500px'],
                shadeClose: false,
                btn: ['提交', '关闭'],
                content: $('#sphsoto_pSkuOperateBtnLayer').html(),
                success: function(layero, index) {
                    form.render('');
                    $('body').on('click', '#sphsoto_searchSku', function() {
                        $('#sphsoto_skuTable tbody').empty();
                        let  // skuType = $(layero).find("select[name=skuType]").val(),
                            skuStr = $(layero).find("textarea[name=pSku]").val();
                        if (skuStr) {
                            // let _skuStr = skuStr.split('\n').join(',');
                            $.ajax({
                                type: "post",
                                url: ctx + "/msgselfimg/listsku.html",
                                dataType: "json",
                                data: { 'skuStr': skuStr,'skuType': 1 },
                                success: function(returnData) {
                                    var emptyPsku = []
                                    if (returnData.code == '0000' && returnData.data.length > 0) {
                                        for (var i in returnData.data) {
                                            var $tr = {},
                                                skus = osort(returnData.data[i].sSkus);
                                            if (JSON.stringify(skus) != "{}") {
                                                $tr = $('<tr></tr>');
                                                var $td = $('<td data-index="sskus"></td>');
                                                for (var j in skus) {
                                                    var $skus = "";
                                                    var sku = skus[j].split('@')[0];
                                                    var skuStatus = skus[j].split('@')[1];
                                                    if (skuStatus == selfImgStatus) {
                                                        $skus = '<input type="checkbox" checked name="skus" value="' + sku + '" title="' + sku + '" lay-skin="primary">';
                                                    } else {
                                                        $skus = '<input type="checkbox" name="skus" value="' + sku + '" title="' + sku + '" lay-skin="primary">';
                                                    }
                                                    // let skuList = _skuStr.split(",")
                                                    // if(skuList.includes(sku)){
                                                    //     var $skus = '<input type="checkbox" name="skus" value="' + sku + '" title="' + sku + '" checked lay-skin="primary">';
                                                    // }else{
                                                    //     var $skus = '<input type="checkbox" name="skus" value="' + sku + '" title="' + sku + '" lay-skin="primary">';
                                                    // }
                                                    $td.append($skus);
                                                }
                                                $tr.append('<td><input type="checkbox" lay-skin="primary" name="all_check" title="' + returnData.data[i].pSku + '" value="' + returnData.data[i].pSku + '" layui-filter="all_check"></td>');
                                                $tr.append($td);
                                            } else {
                                                emptyPsku.push(returnData.data[i].pSku);
                                            }
                                            if ($tr) {
                                                $('#sphsoto_skuTable tbody').append($tr);
                                            }
                                        }
                                        form.render('');
                                        //全选 取消全选
                                        $('input[name="all_check"]').siblings('.layui-form-checkbox').click(function() {
                                            var sskuCheckbox = $(this).parents('td').siblings('td[data-index="sskus"]').find('input[name="skus"]').siblings('.layui-form-checkbox');
                                            var isChecked = $(this).hasClass('layui-form-checked');
                                            if (isChecked) {
                                                sskuCheckbox.each(function(index, item) {
                                                    $(item).addClass('layui-form-checked');
                                                });
                                            } else {
                                                sskuCheckbox.each(function(index, item) {
                                                    $(item).removeClass('layui-form-checked');
                                                })
                                            }
                                        });
                                        if (emptyPsku.length > 0) {
                                            layer.alert('无效父sku:<br/>' + emptyPsku.join('<br/>'), { icon: 2 });
                                        }
                                    }
                                }
                            })
                        }
                    })
                },
                yes: function(index, layero) {
                    var skusArr = [];
                    var skus = $(layero).find('input[name=skus]').siblings('.layui-form-checked');
                    for (var i = 0; i < skus.length; i++) {
                        skusArr.push($(skus[i]).find('span').text());
                    }
                    if (skusArr.length > 0) {
                        layer.close(index);
                        //模拟父级layero提交
                        $(pLayero).find("textarea").val(skusArr.join("\n"));
                        $(pLayero).find(".layui-layer-btn0").trigger('click');
                    } else {
                        layer.msg("未选中子sku", { icon: 7 });
                    }

                }
            });
        });
    }

    //删除需求
    table.on('tool(selfphotographTable)', function(obj) {
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent == 'delete') {
            var confirmIndex = layer.confirm('确定删除本条需求？', {
                btn: ['删除', '再想想'] //按钮
            }, function() {
                loading.show()
                $.ajax({
                    type: "post",
                    url: ctx + "/msgselfimg/delete.html",
                    dataType: "json",
                    data: { ids: data.id },
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code == "0000") {
                            layer.msg("删除成功");
                            table.reload('selfphotographTable', { where: getSearchData() });
                        } else {
                            layer.msg(returnData.msg);
                        }
                    }
                });
            }, function() {
                layer.close(confirmIndex)
            });
        } else if (layEvent == 'deleteRequired') {
          console.log('删除拍图要求');
          layer.confirm('确定删除拍图要求吗?', function(index){
            commonReturnPromise({
              url: `/lms/msgselfimg/deleteFileBySku?sku=${data.sSku}`
            }).then(res => {
              layer.msg(res || '操作成功', {icon: 1});
              table.reload('selfphotographTable', { where: getSearchData() });
            })
          })
        }else if (layEvent == 'cancel') { // 取消拍图
            layer.confirm('确定要取消拍图吗?', function(index){
                commonReturnPromise({
                    url: `/lms/msgSelfImg/cancelSelfImg?id=${data.id}`
                }).then(res => {
                    layer.msg(res || '操作成功', {icon: 1});
                    table.reload('selfphotographTable', { where: getSearchData() });
                })
            })
        }else if (layEvent == 'logs') { // 日志
            var layIndex = layer.open({
                title: '操作日志',
                type: 1,
                area: ['1000px', '600px'],
                // id: 'self_photo_graph_logs',
                content: $('#self_photo_graph_logs').html(),
                success: function (layero) {
                    table.render({
                        url: ctx + '/msgSelfImg/getLog?id=' + data.id, // 数据接口
                        elem: "#self_photo_graph_logs_table",
                        id: "self_photo_graph_logs_table",
                        limit: 999999,
                        cols: [[
                            // {type: "checkbox", width: 30},
                            {
                                field: "operTime",
                                title: "时间",
                                width: 150,
                                templet: "<div>{{Format(d.operTime,'yyyy-MM-dd hh:mm:ss')}}</div>"
                            }, {
                                field: "operator",
                                width: 100,
                                title: "操作人",
                            }, {
                                field: "operDesc",
                                width: 690,
                                title: "操作详情",
                            }
                        ]]
                    })
                }
            })
        }
    });
    //导出
    $('#export_params_self_photo').click(function() {
        var outerIndex = layer.open({
            title: '导出详情',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1200px', '600px'],
            id: 'self_photo_export',
            btn: ['确定', '关闭'],
            content: $('#export_params_self_photo_list').html(),
            success: function() {
                form.on('checkbox(select_All_export_params_self_photo_list)', function(data) {
                    var checked = data.elem.checked
                    $('#export_params_select_self_photo_list_form input[type=checkbox]:enabled').prop('checked', checked);
                    form.render('checkbox')
                });
                form.render('checkbox')
            },
            yes: function() {
                var data = serializeObject($('#export_params_select_self_photo_list_form'))
                var searchParam = getSearchData();
                checkNull(searchParam);
                data.searchParam = JSON.stringify(searchParam);
                var Confirmindex = layer.confirm('确认导出当前搜索条件下的商品信息？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件');
                    submitForm(data, ctx + '/msgselfimg/exportExcel.html');
                    layer.close(outerIndex);
                })
            }
        })
    })
    // 拍图
    $('#query_image_self_photo').click(function() {
        const {laytpl,form} = layui
        var outerIndex = layer.open({
            title: '拍图',
            type: 1,
            area: ['1200px', '600px'],
            id: 'self_photo_query',
            content: $('#query_image_self_photo_list').html(),
            success: function(layero) {
                $('#skuInput').focus();
                $('#skuInput').keydown(function(e) {
                    if (e.keyCode == 13) {
                        $.ajax({
                            type: "post",
                            url: ctx + "/msgselfimg/queryImgDetail",
                            dataType: "json",
                             data: {
                                sku: $('#skuInput').val() || ''
                            },
                            success: function(res) {
                                if (res.code == '0000') {
                                    laytpl($("#combination_info").html()).render(res.data, function (html) {
                                        $("#skuInfo").html(html);
                                        form.render();
                                    })
                                    laytpl($("#image_list_container").html()).render(res.data, function (html) {
                                        $("#image-content").html(html);
    
                                        layero.find('.common_image_container-chooseTplImg').click(function(e){
                                            const checkboxDOm = $(e.target).parent().find('input[name=tplUrl]')
                                            if(checkboxDOm.prop('checked')){
                                                checkboxDOm.prop('checked',false)
                                            }else{
                                                checkboxDOm.prop('checked',true)
                                            }
                                            form.render();
                                        })
                                        form.render();
                                    })
                                } else {
                                    $('#skuInput').val('')
                                    layer.alert(res.msg || '请求失败', { icon: 2 });
                                }
                            }
                        });
                        $('#skuInput').select()
                        $('#skuInput').focus()
                    }
                });
                // 摄影完成
                $(layero).find(".photographyCompleted").click(()=>{
                    loading.show()
                    $.ajax({
                        type: "post",
                        url: ctx + "/msgselfimg/phfinish.html",
                        dataType: "json",
                        data: {'sSkus':$('#query_imageForm #skuInput').val() || ''},
                        success: function(returnData) {
                            loading.hide()
                            if (returnData.code === "5555") {
                                var failSku = returnData.data.failSkus.join('<br/>');
                                layer.alert('摄影完成失败：<br/>' + failSku, { icon: 2 });
                            } else if (returnData.code == '0000') {
                                layer.alert('摄影完成成功', function(index) {
                                    //刷新页面
                                    table.reload('selfphotographTable', { where: getSearchData() });
                                    layer.close(index);
                                }, { icon: 6 });
                            } else {
                                layer.alert(returnData.msg, { icon: 2 });
                            }
                        }
                    });
                })
                // 打印SKU标签
                $(layero).find(".printSku").click(()=>{
                    let printParamsList = [];
                    let obj = {};
                    obj.printNum = 1;
                    obj.storageNum = 1;
                    obj.warehouseId = 65;
                    obj.prodSId = $("#query_imageForm .prodSId").val();
                    printParamsList.push(obj);
                    let printResData = commonGetPrintDataByLoopRequest(printParamsList);
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
                                printParams.push(obj);
                            }
                        }
                        commonExecutePrintJobs(printParams);
                    })
                })
                // 报损
                $(layero).find(".reportLosses").click(()=>{
                    let sSkus = $('#query_imageForm #skuInput').val() || '';
                    commonReturnPromise({
                        url: '/lms/msgSelfImg/updateDamage?sku=' + sSkus,
                        type: 'GET'
                    }).then(res => {
                        layer.alert(res, { icon: 1 });
                    });
                })
                // 标记拍图拦截
                $(layero).find(".markCaptureInterception").click(()=>{
                    let selfImgProdInfoDto = $('#query_imageForm .selfImgProdInfoDto').val() || '';
                    commonReturnPromise({
                        url: '/lms/msgSelfImg/updateToPhotoIntercept?id=' + selfImgProdInfoDto,
                        type: 'GET'
                    }).then(res => {
                        layer.alert(res||'操作成功', { icon: 1 });
                    });
                })
            },
            yes: function() {
            }
        })
    })
});

function openComp(pSku) {
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/listcompUrl.html",
        dataType: "json",
        data: {
            pSku: pSku
        },
        success: function(returnData) {
            if (returnData.data.length >= 1) {
                for (var i = 0; i < returnData.data.length; i++) {
                    if (returnData.data[i].indexOf("http") < 0) {
                        window.open("http://" + returnData.data[i]);
                    } else {
                        window.open(returnData.data[i]);
                    }

                }
            }
        }
    });
}

function formatStatus(str) {
    var photoType = { "0": "未到货", "1": "摄影未完成", "2": "美工未完成", "3": "拍图完成", "4": "拍图取消" };
    return photoType[str];
}

function formatTypes(str) {
    var photoStatus = { "0": "全部", "1": "新拍", "2": "补拍", "3": "重拍" };
    return '拍图:' + photoStatus[str];
}

//对象字段的排序
function osort(obj) {
    var oarr = [];
    for (var i in obj) {
        oarr.push(i + '@' + obj[i]);
    }
    return oarr.sort();
}

//拍图需求上传图片
function selfphotograph_uploadReqExcel(obj, sku){
  let $obj = $(obj);
  let $fileInput = $obj.next('input');
  $fileInput.trigger('click');
  $fileInput.change(function (e) {
    let files = e.target.files;
    if (!files.length) return;
    let file = files[0];
    let fileExt = file.name.split('.').pop().toLowerCase();
    let fileExtArr = [ 'xls','xlsx'];
    if(!fileExtArr.includes(fileExt)){
      return layer.msg('请上传excel文件', {icon: 7});
    }
    let formData = new FormData();
    formData.append('file', file);
    formData.append('sku', sku);
    $.ajax({
      url: ctx + "/msgselfimg/uploadRequireFile",
      data: formData,
      type: "POST",
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      dataType: 'json',
      beforeSend: function () {
          loading.show();
      },
      success: function (data) {
          loading.hide();
          if (data.code == '0000') {
              layer.msg('上传成功', {icon: 1});
              $("#sphoto_searchBtn").trigger('click');
          } else {
              layer.msg(data.msg, { icon: 2 });
          }
          //传递完成以后清空input的value
          e.target.value = '';
      },
      error: function (error) {
          loading.hide();
          layer.msg(`${error.statusText}`, { icon: 2 });
      }
    })
    //传递完成以后清空input的value
    e.target.value = '';
    e.preventDefault();
    e.stopPropagation();
  });
}