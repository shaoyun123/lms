;(function($,layui,window,document,undefined){
// 动态列加载
var amazongatherhotCols = [
    [{
        type: "checkbox",
        width: "2%"
    },{
        title: "ID",
        field: "id",
        width: "3%"
    }, {
        title: "操作",
        templet: "#agh_optionTpl",
        width: "6%"
    }, {
        field: "mainImage",
        title: "图片",
        templet: "#agh_imageTpl",
        width: "8%"
    }, {
        field: "title",
        title: "产品信息",
        templet: "#agh_titleTpl",
        width: "30%"
    }, {
        field: "developer",
        title: "站点/类目排名",
        templet: "#agh_developerTpl",
        width: "10%"
    }, {
        field: "listing_data",
        title: "价格/销量",
        templet: "#agh_listing_Tpl",
        width: "10%"
    }, {
        field: "pSku",
        title: "评分/购物车",
        templet: "#agather_hot_title_tpl",

    }, {
        field: "time",
        title: "产品时间",
        templet: "#agh_timeTpl",
    }, {
        field: "productInfo",
        title: "人员",
        templet: "#agather_hot_productInfo_tpl",
    }, {
        field: "salesNum",
        title: "备注",
        templet: "#agh_sales_Tpl",
    }, {
        title: "其他操作",
        toolbar: '#AG_editBar',
        width: "6%"
    }
    ],
];

layui.use(['admin', 'form', 'table', 'laydate', 'laytpl', 'element', 'formSelects', 'upload'], function () {
    var $ = layui.$,
        admin = layui.admin,
        upload = layui.upload,
        tabsPage = admin.tabsPage,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        form = layui.form;


    form.render('select');
    form.render('radio');
    form.render('checkbox');

    // 导入
    upload.render({
        elem: '#import_template_btn' //绑定元素
        , url: `${ctx}/amazon/prodHotSale/upload`//上传接口
        , accept: 'file' //允许上传的文件类型
        , exts: 'xlsx'
        ,before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layui.admin.load.show();
        }
        , done: function (res) {
            layui.admin.load.hide();
            if (res.code == "0000") {
                layer.msg(res.msg, {icon: 1});
            } else {
                layer.msg(res.msg, {icon: 5});
            }
        }
        , error: function () {
            layui.admin.load.hide();
            layer.msg('服务器出现故障!');
        }
    });

    // 批量分配开发
    $('#development_template_btn').click(function () {
        var checkStatus = table.checkStatus('agh_hotTable');
        if (checkStatus.data.length < 1) {
            layer.msg("请选择需要分配开发的产品！");
            return;
        }
        if (checkStatus.data.length > 0) {
            let layerIndex = layer.open({
                type: 1,
                title: "分配开发",
                area: ["300px", "500px"],
                btn: ["保存", "取消"],
                content: $("#allotdeveloperLayer").html(),
                success: function (layero, index) {
                    //初始化开发人员，站点
                    $.ajax({
                        type: 'post',
                        url: ctx + '/amazon/prodHotSale/init',
                        dataType: 'json',
                        success: function (res) {
                            if (res.code == '0000') {
                                var list = res.data
                                for (let j = 0; j < list.development.length; ++j) {
                                    $("select[name='development']").append('<option value="' + list.development[j].id + '">' + list.development[j].name + '</option>')
                                }
                                form.render();
                            }
                        }
                    })
                },
                yes: function (index, layero) {
                    let developmentId = $("#allotdeveloperLayersel select[name=development]").val(),
                        developmentName = $("#allotdeveloperLayersel").find("option:selected").text();

                    if(developmentName == '' || developmentId == ''){
                        layer.alert("请选择开发人员",{icon:2})
                        return false;
                    }
                    let checkStatus_id = checkStatus.data.map(item => item.id)
                    let id = checkStatus_id.join();

                    //保存
                    commonReturnPromise({
                        url: ctx + "/amazon/prodHotSale/update/batch",
                        type: 'post',
                        contentType: 'application/json;charset=utf-8',
                        params: JSON.stringify({
                            "prodIdStr": id,  //产品的id
                            "processStatus": 6,  //操作流程状态
                            "remark": '',  //备注。比如页面上选择的重复，侵权之类的。还有一种就是input框他自己输入的
                            "asin": '',  //子asin
                            "developmentId": developmentId, //这个是开发人员id（select框里面取值渲染）
                            "developmentName": developmentName  //这个是开发人员的名字（select框里面取值渲染）
                        })
                    }).then(function (result) {
                        layer.msg("保存成功", {icon: 1});

                        //layui中找到CheckBox所在的行，并遍历找到行的顺序
                        $("div.layui-table-body table tbody input[name='layTableCheckbox']:checked").each(function () { // 遍历选中的checkbox
                            let n = $(this).parents("tbody tr").index();  // 获取checkbox所在行的顺序
                            //移除行
                            $("div.layui-table-body table tbody ").find("tr:eq(" + n + ")").remove();
                            //如果是全选移除，就将全选CheckBox还原为未选中状态
                            $("div.layui-table-header table thead div.layui-unselect.layui-form-checkbox").removeClass("layui-form-checked");
                        });
                        layer.close(layerIndex);
                    }).catch(function (err) {
                        layer.msg("失败", {icon: 2});
                    })
                },
            });
        }
    });

// 批量预判
    $("#prejudgment_template_btn").click(function(){
        var checkStatus = table.checkStatus('agh_hotTable');
        if (checkStatus.data.length < 1) {
            layer.msg("请选择需要预判的产品！");
            return;
        }
        if (checkStatus.data.length > 0) {
            let layerIndex = layer.open({
                type: 1,
                title: "批量预判",
                area: ["300px", "400px"],
                btn: ["保存", "取消"],
                content: $("#prejudgeOperatingListid").html(),
                success: function (layero, index) {
                    // 初始化
                    $.ajax({
                        type: 'post',
                        url: ctx + '/amazon/prodHotSale/init',
                        dataType: 'json',
                        success: function (res) {
                            if (res.code == '0000') {
                                var list = res.data
                                let html = '';
                                html += '<div id="agh_optionTpl_con" style="text-align: left;">';
                                for (let j = 0; j < list.prejudgeOperatingList.length; ++j) {
                                    html += '<input type="radio" name="prejudgeOperatingList" radioCheckedFlag="0" value="' + list.prejudgeOperatingList[j].value + '" title="' + list.prejudgeOperatingList[j].name + '" lay-filter="prejudgeOperatingList"><br>';
                                }
                                html += '<div class="dis_flex" style="padding: 7px 0;">' +
                                    '<input type="radio" name="prejudgeOperatingList" radioCheckedFlag="1" value="3"  title="" lay-filter="prejudgeOperatingList">' +
                                    '<input name="prejudgeOperatingList_input" style="border: none;border-bottom: 1px solid #bbb;width: 100px;position: absolute;margin-top: 10px;margin-left: 30px;" value="">' +
                                    '</div>' +
                                    '</div>';
                                $("#prejudgeOperatingListform").html(html)
                                form.render();
                            }
                        }
                    })
                },
                yes: function (index, layero) {
                    // 如果没有选中，不能提交；
                    // 如果选中input，没有填写input，不能提交

                    let radioCheckedValue = $("input[name='prejudgeOperatingList']:checked").val(),
                        radioCheckedText = $("input[name='prejudgeOperatingList']:checked").attr("title"),
                        radioCheckedFlag = $("input[name='prejudgeOperatingList']:checked").attr("radioCheckedFlag"),
                        radioCheckedRemark = $("input[name='prejudgeOperatingList_input']").val();
                    if(!radioCheckedValue){
                        layer.alert("请选择原因后提交",{icon:2})
                        return false;
                    }

                    if(radioCheckedFlag == 1 && radioCheckedRemark == ''){
                        layer.alert("请输入原因后提交",{icon:2})
                        return false;
                    }

                    if(radioCheckedFlag == 0){
                        radioCheckedRemark = radioCheckedText
                    }

                    let checkStatus_id = checkStatus.data.map(item => item.id)
                    let id = checkStatus_id.join();
                    //保存
                    commonReturnPromise({
                        url: ctx + "/amazon/prodHotSale/update/batch",
                        type: 'post',
                        contentType: 'application/json;charset=utf-8',
                        params: JSON.stringify({
                            "prodIdStr": id,  //产品的id
                            "processStatus": radioCheckedValue,  //操作流程状态
                            'remark': radioCheckedRemark
                        })
                    }).then(function (result) {
                        layer.msg("保存成功", {icon: 1});
                        //layui中找到CheckBox所在的行，并遍历找到行的顺序
                        $("div.layui-table-body table tbody input[name='layTableCheckbox']:checked").each(function () { // 遍历选中的checkbox
                            let n = $(this).parents("tbody tr").index();  // 获取checkbox所在行的顺序
                            //移除行
                            $("div.layui-table-body table tbody ").find("tr:eq(" + n + ")").remove();
                            //如果是全选移除，就将全选CheckBox还原为未选中状态
                            $("div.layui-table-header table thead div.layui-unselect.layui-form-checkbox").removeClass("layui-form-checked");
                        });
                        layer.close(layerIndex);
                    }).catch(function (err) {
                        layer.msg(err, {icon: 2});
                    })
                },
            });
        }
    })

    //表格渲染结果
    //展示已知数据
    function renderTable() {
        let formData = getAmazongatherhotSearchFormData();
        console.log(formData);
        table.render({
            elem: "#agh_hotTable",
            url: ctx + "/amazon/prodHotSale/search",
            method: 'post',
            contentType: 'application/json;charset=utf-8',
            where: formData,
            page: true,
            limits: [50, 100, 300], // 每页条数的选择项
            limit: 50, //默认显示
            cols: amazongatherhotCols,
            done: function (returnData) {
                imageLazyload();
                load(returnData)
                for (let i = 0; i < returnData.data.length; i++) {
                    form.on("radio(operatingDtoList"+ returnData.data[i].id +")", function(data) {
                        let that = $(this);
                        let id = returnData.data[i].id,
                            // processStatus = $("#amazongatherhot_searchForm input[name=amazonlistingStatus]").val(),
                            processStatus = data.value,
                            remark = $(this).parent().find("input[name=operatingDtoList_input]").val(), // input框
                            radioFlag = $(data.elem).attr("radioFlag"),
                            asin = returnData.data[i].asin,
                            developmentId = '',
                            developmentName = '';
                        if (remark == '' && radioFlag == '1') {
                            layer.alert("请输入内容", {icon: 2})
                            $(this).parent().find("input[name=operatingDtoListname"+ returnData.data[i].id +"][radioFlag='1']").attr("checked", false); // input框前面的radio
                            form.render();
                            return;
                        }

                        if(radioFlag == '1'){
                            remark = $(this).parent().find("input[name=operatingDtoList_input]").val()// input框
                        }else{
                            remark = $(data.elem).attr("title")
                        }

                        commonReturnPromise({
                            url: ctx + "/amazon/prodHotSale/update",
                            type: 'post',
                            contentType: 'application/json;charset=utf-8',
                            params: JSON.stringify({
                                "id": id,  //产品的id
                                "processStatus": processStatus,  //操作流程状态
                                "remark": remark,  //备注。比如页面上选择的重复，侵权之类的。还有一种就是input框他自己输入的
                                "asin": asin,  //子asin
                                "developmentId": developmentId, //这个是开发人员id（select框里面取值渲染）
                                "developmentName": developmentName  //这个是开发人员的名字（select框里面取值渲染）
                            })
                        }).then(function (result) {
                            layer.msg("保存成功", {icon: 1});
                            that.parents("tr").remove();
                        }).catch(function (err) {
                            layer.msg(err, {icon: 2});
                        })
                    });
                }
            }
        });
    }
    //日期范围选择
    laydate.render({
        elem: '#test'
        , range: true //或 range: '~' 来自定义分割字符
    });

    // 处理表单数据
    function getAmazongatherhotSearchFormData() {
        let formData = serializeObject($('#amazongatherhot_searchForm'))
        formData.processStatus = $("#AG_hot_tab_id .layui-this").attr("data-value")

        let launchandupdate = $("#amazongatherhot_searchForm select[name=launchandupdate]").val();
        let launchandupdatetime = $("#amazongatherhot_searchForm input[name='launchandupdatetime']").val();
        if (launchandupdatetime) {
            let starttime = launchandupdatetime.split(" - ")[0];
            let endtime = launchandupdatetime.split(" - ")[1];
            if (launchandupdate == "launchTime") {
                formData.launchTimeStart = starttime
                formData.launchTimeEnd = endtime
            } else if (launchandupdate == "updateTime") {
                formData.lastUpdateTimeStart = starttime
                formData.lastUpdateTimeEnd = endtime
            }
        }

        if (formData.categoryName == "category") {
            formData.category = formData.categoryData
        } else if (formData.categoryName == "title") {
            formData.title = formData.categoryData
        } else if (formData.categoryName == "parentAsin") {
            formData.parentAsin = formData.categoryData
        } else if (formData.categoryName == "brand") {
            formData.brand = formData.categoryData
        }

        if (formData.RemarkName == "prejudgeRemark") {
            formData.prejudgeRemark = formData.RemarkData
        } else if (formData.RemarkName == "firstTrialRemark") {
            formData.firstTrialRemark = formData.RemarkData
        } else if (formData.RemarkName == "developmentRemark") {
            formData.developmentRemark = formData.RemarkData
        }

        let checkboxData = formData.checkbox || [];
        checkboxData.indexOf('bestSellerSign') == -1 ? formData.bestSellerSign = 0 : formData.bestSellerSign = 1;
        checkboxData.indexOf('amazonChoiceSign') == -1 ? formData.amazonChoiceSign = 0 : formData.amazonChoiceSign = 1;
        checkboxData.indexOf('newReleaseSign') == -1 ? formData.newReleaseSign = 0 : formData.newReleaseSign = 1;
        return formData;
    }

    //搜索
    $("#agh_searchBtn").click(function () {
        renderTable()
        // let formData = getAmazongatherhotSearchFormData()
        // //执行重载
        // table.reload('agh_hotTable', {
        //     page: {
        //         curr: 1 //重新从第 1 页开始
        //     },
        //     where: formData,
        // });
    });

    // tab监听
    element.on('tab(agh_hot_tab)', function (data) {
        var listingStatus = $(this).attr("data-value");

        if(listingStatus == 1||listingStatus == 9){
            $('#prejudgment_template_btn').css('display','inline-block');
        }else{
            $('#prejudgment_template_btn').css('display','none');
        }

        if(listingStatus == 4 || listingStatus == 6){
            $('#development_template_btn').css('display','inline-block');
        }else {
            $('#development_template_btn').css('display','none');
        }

        listingCheckStatus = listingStatus;
        $("#amazongatherhot_searchForm input[name=listingStatus]").val(listingStatus);
        $("#agh_searchBtn").trigger("click");
    });

    table.on('tool(agh_table-filter)', function (obj) {
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        let id = data.id,
            asin = data.asin;

        if (layEvent == 'editBarDevBtn') {  // 分配开发
            let layerIndex = layer.open({
                type: 1,
                title: "分配开发",
                area: ["300px", "500px"],
                btn: ["保存", "取消"],
                content: $("#allotdeveloperLayer").html(),
                success: function (layero, index) {
                    //初始化开发人员，站点
                    $.ajax({
                        type: 'post',
                        url: ctx + '/amazon/prodHotSale/init',
                        dataType: 'json',
                        success: function (res) {
                            if (res.code == '0000') {
                                var list = res.data
                                for (let j = 0; j < list.development.length; ++j) {
                                    $("select[name='development']").append('<option value="' + list.development[j].id + '">' + list.development[j].name + '</option>')
                                }
                                form.render();
                            }
                        }
                    })
                },
                yes: function (index, layero) {
                    let developmentId = $("#allotdeveloperLayersel select[name=development]").val(),
                        developmentName = $("#allotdeveloperLayersel").find("option:selected").text();

                    if(developmentName == '' || developmentId == ''){
                        layer.alert("请选择开发人员",{icon:2})
                        return false;
                    }

                    //保存
                    commonReturnPromise({
                        url: ctx + "/amazon/prodHotSale/update",
                        type: 'post',
                        contentType: 'application/json;charset=utf-8',
                        params: JSON.stringify({
                            "id": id,  //产品的id
                            "processStatus": 6,  //操作流程状态
                            "asin": asin,  //子asin
                            "developmentId": developmentId, //这个是开发人员id（select框里面取值渲染）
                            "developmentName": developmentName  //这个是开发人员的名字（select框里面取值渲染）
                        })
                    }).then(function (result) {
                        layer.msg("保存成功", {icon: 1});
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(layerIndex);
                    }).catch(function (err) {
                        layer.msg(err, {icon: 2});
                    })

                },
            });
        } else if (layEvent == 'editBarErrorBtn') {  // 开发失败
            let layerIndex = layer.open({
                type: 1,
                title: '开发失败',
                area: ["500px", "300px"],
                btn: ["提交", "关闭"],
                content: '<div style="padding:20px"><textarea id="amazonEditBarErrorlayer" class="layui-textarea" style="height: 100px;"></textarea></div>',
                yes: function (index, layero) {
                    let developmentId = '',
                        developmentName = '',
                    remark = $("#amazonEditBarErrorlayer").val();
                    if(remark == ''){
                        layer.alert("请输入内容",{icon:2})
                        return false;
                    }

                    //保存
                    commonReturnPromise({
                        url: ctx + "/amazon/prodHotSale/update",
                        type: 'post',
                        contentType: 'application/json;charset=utf-8',
                        params: JSON.stringify({
                            "id": id,  //产品的id
                            "processStatus": 8,  //操作流程状态
                            "asin": asin,  //子asin
                            'remark': $("#amazonEditBarErrorlayer").val(),
                            "developmentId": developmentId, //这个是开发人员id（select框里面取值渲染）
                            "developmentName": developmentName  //这个是开发人员的名字（select框里面取值渲染）
                        })
                    }).then(function (result) {
                        layer.msg("保存成功", {icon: 1});
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(layerIndex);
                    }).catch(function (err) {
                        layer.msg(err, {icon: 2});
                    })
                },
            });
        } else if (layEvent == 'editBarLogBtn') {  // 开发失败
            var groupId = obj.data.id;
            var index = layer.open({
                type: 1,
                title: '操作日志',
                area: ['60%', '60%'],
                id: 'gh_detail_layer_2',
                shadeClose: false,
                btn: ['确定', '关闭'],
                content: $('#agh_detailLayer_2').html(),
                success: function (layero, index) {
                    //渲染问题
                    layui.admin.load.show();
                    log('amazongatherhot_operationLog_new', groupId);
                },
                yes: function (index, layero) {
                    layer.close(index);
                }
            });
        } else if (layEvent == 'resetStatusY'|| layEvent == 'resetStatusC'){ // 重新预判 or 重新初审

            let html = '';
            html += '<form class="layui-form"><div id="agh_resetStatus_con" style="text-align: left;width: 110px;padding-left: 40px;">';
                for(let i=0;i<data.otherOperatingDtoList.length;i++){
                    html += '<input type="radio" name="agh_resetStatus_con" radioCheckedFlag="0" value="'+data.otherOperatingDtoList[i].value+'" title="'+data.otherOperatingDtoList[i].name+'" lay-filter="resetStatusFilter">';
                }
            html += '<div class="dis_flex" style="padding: 2px 0;">';
                if(layEvent == 'resetStatusY'){
                    html += '<input type="radio" value="3" name="agh_resetStatus_con" radioCheckedFlag="1" title="" lay-filter="resetStatusFilter">';
                }else if(layEvent == 'resetStatusC'){
                    html += '<input type="radio" value="5" name="agh_resetStatus_con" radioCheckedFlag="1" title="" lay-filter="resetStatusFilter">';
            }

            html += '<input name="radioCheckedRemark"  style="border: none;border-bottom: 1px solid #bbb;width: 100px;position: absolute;margin-left: 30px;margin-top: 10px;" value="">'+
                '</div>'+
                '</div></form>';

            let layerIndex = layer.open({
                type: 1,
                title: '其他',
                area: ["500px", "300px"],
                btn: ["提交", "关闭"],
                content:html,
                success: function (layero, index) {
                    form.render();
                },
                yes: function (index, layero) {
                    // 如果没有选中，不能提交；
                    // 如果选中input，没有填写input，不能提交

                    let radioCheckedValue = $("input[name='agh_resetStatus_con']:checked").val(),
                        radioCheckedText = $("input[name='agh_resetStatus_con']:checked").attr("title"),
                    radioCheckedFlag = $("input[name='agh_resetStatus_con']:checked").attr("radioCheckedFlag"),
                        radioCheckedRemark = $("input[name='radioCheckedRemark']").val();
                    if(!radioCheckedValue){
                        layer.alert("请选择原因后提交",{icon:2})
                        return false;
                    }

                    if(radioCheckedFlag == 1 && radioCheckedRemark == ''){
                        layer.alert("请输入原因后提交",{icon:2})
                        return false;
                    }
                    
                    if(radioCheckedFlag == 0){
                        radioCheckedRemark = radioCheckedText
                    }

                    //保存
                    commonReturnPromise({
                        url: ctx + "/amazon/prodHotSale/update",
                        type: 'post',
                        contentType: 'application/json;charset=utf-8',
                        params: JSON.stringify({
                            "id": id,  //产品的id
                            "processStatus": radioCheckedValue,  //操作流程状态
                            "asin": asin,  //子asin
                            'remark': radioCheckedRemark
                        })
                    }).then(function (result) {
                        layer.msg("保存成功", {icon: 1});
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(layerIndex);
                    }).catch(function (err) {
                        layer.msg(err, {icon: 2});
                    })
                },
            });
        }
    });

    //监听表格是否固定分类修改
    form.on('switch(isFixedCateFilter)', function (obj) {
        var id = this.value;
        var isFixedCate = obj.elem.checked;
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/prodhotsale/isfixedcate.html",
            data: {
                isFixedCate: isFixedCate,
                id: id
            },
            dataType: "json",
            success: function (returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, {icon: 2});
                    //失败后转换为原来的状态
                    obj.elem.checked = !isFixedCate;
                    form.render();
                } else {
                    layer.msg("修改成功");
                }
            }
        });
    });

    // 操作日志
    function log(logId, groupId) {
        $.ajax({
            type: "get",
            url: ctx + "/amazon/prodHotSale/log/select/" + groupId,
            success: function (returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, {icon: 2});
                } else {
                    laytpl($("#agh_operlogTpl").html()).render(returnData.data, function (html) {
                        $('#' + logId).html(html);
                    });
                }
            }
        });
    }

    //初始化页面数据
    var siteData;

    function initData() {
        //初始化开发人员，站点
        $.ajax({
            type: 'post',
            url: ctx + '/amazon/prodHotSale/init',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0000') {
                    var list = res.data
                    for (let i = 0; i < list.site.length; ++i) {
                        $("select[name='site']").append('<option value="' + list.site[i].code + '">' + list.site[i].name + '</option>')
                    }
                    for (let j = 0; j < list.development.length; ++j) {
                        $("select[name='developmentId']").append('<option value="' + list.development[j].id + '">' + list.development[j].name + '</option>')
                    }
                    form.render();
                }
            }
        })
    }

    initData();

    $('button[type="reset"]').click(function () {
        $("#LAY-work-develop-gatherhot-div1").html('');
    })


    function serializeObject(form) {
        var o = {};
        $.each(form.serializeArray(), function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }
});

function load(returnData) {
    // imageLazyload();
    // imageLazyloadOrigin();

    setCount("amazongatherhotTab1", 0);
    setCount("amazongatherhotTab2", 0);
    setCount("amazongatherhotTab3", 0);
    setCount("amazongatherhotTab4", 0);
    setCount("amazongatherhotTab5", 0);
    setCount("amazongatherhotTab6", 0);
    setCount("amazongatherhotTab7", 0);
    setCount("amazongatherhotTab8", 0);
    setCount("amazongatherhotTab9", 0);
    setCount("amazongatherhotTab0", 0);
    if (returnData.msg) {
        // const jsonMsg = JSON.parse(returnData.msg);
        console.log(JSON.parse(returnData.msg));
        // const jsonMsg = new Function(`return ${returnData.msg}`);
        const jsonMsg = JSON.parse(returnData.msg)
        setCount("amazongatherhotTab1", jsonMsg['count_1']);
        setCount("amazongatherhotTab2", jsonMsg['count_2']);
        setCount("amazongatherhotTab3", jsonMsg['count_3']);
        setCount("amazongatherhotTab4", jsonMsg['count_4']);
        setCount("amazongatherhotTab5", jsonMsg['count_5']);
        setCount("amazongatherhotTab6", jsonMsg['count_6']);
        setCount("amazongatherhotTab7", jsonMsg['count_7']);
        setCount("amazongatherhotTab8", jsonMsg['count_8']);
        setCount("amazongatherhotTab9", jsonMsg['count_9']);
        setCount("amazongatherhotTab0", jsonMsg['countAll']);
    }

    // $(".gatherhotCateShow").on({
    //     mouseenter: function () {
    //         var that = this;
    //         var cateFullName = $(that).attr("cateFullName");
    //         if (cateFullName && cateFullName.indexOf("undefined") === -1) {
    //             tips = layer.tips("<span style='color:#000;'>" + cateFullName + "</span>", that, {
    //                 tips: [3, '#fff'],
    //                 time: 0,
    //                 area: 'auto',
    //                 maxWidth: 500
    //             });
    //         } else {
    //             tips = layer.tips("<span style='color:#000;'>其他</span>", that, {
    //                 tips: [3, '#fff'],
    //                 time: 0,
    //                 area: 'auto',
    //                 maxWidth: 500
    //             });
    //         }
    //     },
    //     mouseleave: function () {
    //         layer.close(tips);
    //     }
    // });

    // theadHandle().fixTh({id: '#layui-card-gatherhot', h: 150, i: 35});
}

function setCount(tabId, count) {
    var tab = $('#' + tabId);
    var text = tab.text();
    var trimHead = text.substr(text.indexOf('ဆ') + 1);
    var title = trimHead.substr(0, text.indexOf("（"));
    tab.text(title + "（" + nullToZero(count) + "）");
}

function nullToZero(number) {
    if (number) {
        return number;
    }
    return 0;
}



})(jQuery, layui, window, document);

function amazonImgConversion(url,size){
    var reg = /(?<=(\_[a-zA-Z]{2}){2}).+(?=\_\.jpg)/g
    return url.replace(reg, size)
}