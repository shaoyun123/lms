;(function () {
    layui.use(['admin','table', 'form','laydate','element', 'layer', 'laytpl', 'formSelects','upload'], function () {
        var form = layui.form,
            admin = layui.admin,
            table = layui.table,
            laydate = layui.laydate,
            upload = layui.upload,
            formSelects = layui.formSelects;

        var allProjectschedule = null,
            allStatusOrder_Site = null; 
        form.render();
        fillsite();
        shop();
        Projectschedule();
        fbaProject_listCard();
            // 商品类目
            $("#LAY-amazon-fba-project-manager-btton").click(function() {
                //获取当前站点
                var site = $("#fbaProject_search_form select[name=site] option:selected").val();
                var cateUrl ;
                var cateSearchUrl ;
                //后端是否应该限制 站点必填？？
                if (site && site != '') {
                    cateSearchUrl = '/fbaProduct/getAmazonCateList.html?siteId=' + site;
                    cateUrl = '/fbaProduct/getAmazonCateList.html?siteId=' + site;
                } else {
                    cateSearchUrl = "/fbaProduct/getAmazonCateList.html";
                    cateUrl = "/fbaProduct/getAmazonCateList.html";
                }
                admin.itemCat_select('layer-amazon-fba-project-manager-id',
                    'LAY-fbaProject-hidden1', 'LAY-amazon-fba-project-manager-div'
                ,cateUrl ,cateSearchUrl);
            });

                //清空类目
            $('#amazon_fba_project_manager_reset').click(function (){
                $('#LAY-fbaProject-hidden1').val('');
                $('#LAY-amazon-fba-project-manager-div').html('');
    
            });
        

        laydate.render({
            elem: '#FBAprotimerange',
            range: true
        });
        render_hp_orgs_users("#fbaProject_search_form");//渲染部门销售员店铺三级联动
        //重置的时候处理三级联动
        $('#amazon_fba_project_manager_reset').on('click', function(){
            $('#fbaProject_online_depart_sel').next().find('dd[lay-value=""]').trigger('click');
        })
        
        // 搜索
        $("#fbaProject_searchBtn").click(function() {
            fbaProject_listCard()
        });
         // 表格渲染
    function fbaProject_listCard() {
        var data = serializeObject($('#fbaProject_search_form'));
        if(data.timerange) {
            data.timeFrom = data.timerange.split(" - ")[0] + " 00:00:00";
            data.timeTo = data.timerange.split(" - ")[1] + " 23:59:59";
        };
        table.render({
            elem: "#fbaProjectTable",
            method: 'get',
            url: `${ctx}/fbaProduct/queryPage.html`,
            where: data,
            cols: [
                [
                    { type: "checkbox",},
                    { field: "image", templet: "#fl_imageTpl", title: "图片",width:80},
                    { field: "projectName", title: "项目名称", templet: "#fl_projectName"},
                    { field: "responsor", title: "负责人",width:60},
                    { field: "storeAcctNameList", title: "刊登店铺",},
                    { field: "storeFollowAcctNameList", title: "项目跟卖店铺",},
                    { field: "prodPSkuList", title: "商品父SKU", templet: "#fl_title",width:120 },
                    { title: "平均售价($)", field: "avgPrice",width:60 },
                    { field: "purchaseCostPrice", title: "审批发货", templet: "#f1_Approval",width:100 },
                    // 定义一个 隐藏的 a标签;展示的a标签点击触发隐藏A标签执行跳转
                    { title: "父ASIN",templet : '<div><a href="javascript:void(0);"' +
                            ' lay-event="fbaProjectHistoryClick" class="layui-table-link">{{ d.pAsinList }}' +
                            '<a hidden href="#/route/fba/productInfo/FBAhistory" id="fbaProjectHistoryClick_{{ d.id }}" /></div>'},
                    { title: "货件计划",templet: "#f1_shipmentIdList",width:160},
                    { field: "processStatusName", title: "项目进度", },
                    { field: "remark",  title: "备注",templet: "#fl_remark"},
                    { title: "时间", templet: "#fl_timeTpl" },
                    { title: "操作", templet: "#f1_purchase_url" },
                ],
            ],
            id: "fbaProjectTable",
            page: true,
            limits: [50, 200, 500],
            limit: 50,
            done: function(res, curr, count) {
                //懒加载
                imageLazyload();
                $('#fbaProjectTable').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                var response = res.data;
                //为每个注册上传事件
                if (response && response.length > 0) {
                    response.map(item =>
                        upload.render({
                            elem: '#fbaProject_up_' + item.id,
                            url: `${ctx}/fbaProduct/upExtraFile.html`,
                            data:{id : item.id},
                            accept: 'file',
                            size: 20 * 1024,
                            before: function (obj) {
                                loading.show();
                            },
                            done: function (res) {
                                loading.hide();
                                if (res.code == "0000") {
                                    layer.msg("上传成功!", {icon: 1});
                                    fbaProject_listCard()
                                } else {
                                    layer.msg(res.msg, {icon: 5});
                                }
                            },
                            error: function () {
                                loading.hide();
                                layer.msg('服务器出现故障!');
                            }
                        })
                    );
                }
            }
        });
    }

      // 新增新品页面
    $('#fbaProject_List').click(function () {
        var index = layer.open({
            type: 1,
            title: '创建项目',
            id: 'devSuccess',
            area: ['1000px', '80%'],
            shadeClose: false,
            content: $('#newfbaProject_list').html(),
            btn: ['保存', '关闭'],
            success: function (layero) {
                form.render('select');
                formSelects.render('firstVessel')
                shop();
                render_hp_orgs_users("#fbaProjectAddFrom", function(){
                    form.render('select');
                }); //渲染店铺
                var site = $("#fbaProjectAddFrom select[name=site] option:selected").val();
                appendSelect($('#fbaProjectAddFrom').find('select[name="site"]'), allStatusOrder_Site, 'code', 'name')   
                appendSelect($('#fbaProjectAddFrom').find('select[name="processStatus"]'), allProjectschedule, 'code', 'name')   
                
                 // 商品类目
                $("#LAY-amazon-fba-project-manager-btton2").click(function() {
                    var site = $("#fbaProjectAddFrom select[name=site] option:selected").val();
                    var cateUrl ;
                    var cateSearchUrl ;
                    //后端是否应该限制 站点必填？？
                    if (site && site != '') {
                        cateSearchUrl = '/fbaProduct/getAmazonCateList.html?siteId=' + site;
                        cateUrl = '/fbaProduct/getAmazonCateList.html?siteId=' + site;
                    } else {
                        cateSearchUrl = "/fbaProduct/getAmazonCateList.html";
                        cateUrl = "/fbaProduct/getAmazonCateList.html";
                    }
                        admin.itemCat_select('layer-amazon-fba-project-manager-id',
                        'LAY-fbaProject-hidden2', 'LAY-amazon-fba-project-manager-div1'
                    ,cateUrl ,cateSearchUrl);
                    });
                // 上传图片
                new UploadImage("add_image", ctx + '/fbaProduct/getBase64Img.html').upload(function (xhr) { //上传完成后的回调
                    var img = new Image('300', '300');
                    var returnData;
                    try {
                        returnData = JSON.parse(xhr.responseText);
                    } catch (err) {

                    }
                    if (xhr.responseText == '') {
                        layer.msg("上传出错!");
                    } else if (returnData != undefined && returnData.code == '9999') {
                        layer.msg("上传出错!" + xhr.responseText);
                    } else {
                        img.src = xhr.responseText;
                        $("#fbaProjectAddFrom input[name='image']").val(xhr.responseText);
                        $(this).empty().html(img);
                    }
                });
                $('#delete_pasteImg').click(function () {
                    $("#fbaProjectAddFrom input[name='image']").val("");
                    $('#add_image').html('')
                })
            },
            yes: function (index, layero) {
            var data = serializeObject($('#fbaProjectAddFrom'));
            if(!data.projectName){
                layer.msg('请填写项目名称')
                return
            }
            if(!data.cateId){
                layer.msg('请选择站点类目')
                return
            }
            if(!data.projectType){
                layer.msg('请填写项目类型')
                return
            }
            if(!data.avgPrice){
                layer.msg('请填写平均售价（$）')
                return
            }
            if(!data.image){
                layer.msg('请选择图片')
                return
            }
            if(data.auditProdAmout && !(/(^[0-9]\d*$)/.test(data.auditProdAmout))){
                layer.msg('审批发货数量必须为整数')
                return
            }
            $.ajax({
                url: `${ctx}/fbaProduct/saveFbaProject.html`,
                type: 'post',
                dataType: 'json',
                data:data,
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.msg(returnData.msg)
                        fbaProject_listCard()
                        layer.close(index)
                    }else if(returnData.code == "9999"){
                        layer.msg(returnData.msg)
                    }
                }
            });
            },

        })
    })

    table.on('tool(fbaProjectTable)', function (obj) {
        var layEvent = obj.event; // 获得 lay-event 对应的值
        var data = obj.data; // 获得当前行数据
        if (layEvent === 'fbaProject_edit') {
            var index = layer.open({
                type: 1,
                title: '修改项目',
                area: ['1000px', '80%'],
                shadeClose: false,
                btn: ['保存', '关闭'],
                content: $('#newfbaProject_list').html(),
                success: function (layero) {
                    form.render('select');
                    shop();
                    formSelects.render('firstVessel')
                    render_hp_orgs_users("#fbaProjectAddFrom", function(){
                        form.render('select');
                        var salesPlatAcctIdArr = data.storeIdList ? data.storeIdList : [];
                        var initArr = [];
                        for(let i=0; i<data.storeIdList.length; i++){
                            let item = data.storeIdList[i];
                            if(salesPlatAcctIdArr.includes(String(item))){
                                initArr.push(item);
                            }
                        };
                        layui.formSelects.value('fbaProject_online_store_seladd', initArr);
                        // 数据渲染
                        // 头程类型回显
                        if (data.firstVessel != undefined) {
                            var firstVesselProps = data.firstVessel.split(',')
                            layui.formSelects.value('firstVessel', firstVesselProps)
                        }
                        if(data.storeFollowAcctNameList !=undefined) {
                            var storeFollowAcctIdListProps = data.storeFollowAcctIdList.split(',')
                            layui.formSelects.value('addstoreFollowAcctIdList', storeFollowAcctIdListProps)
                        }
                    }); //渲染店铺
                    var site = $("#fbaProjectAddFrom select[name=site] option:selected").val() ? data.site : $("#fbaProjectAddFrom select[name=site] option:selected").val();
                    appendSelect($('#fbaProjectAddFrom').find('select[name="site"]'), allStatusOrder_Site, 'code', 'name')   
                    appendSelect($('#fbaProjectAddFrom').find('select[name="processStatus"]'), allProjectschedule, 'code', 'name')   

                    // 商品类目
                    $("#LAY-amazon-fba-project-manager-btton2").click(function() {
                        var site = $("#fbaProjectAddFrom select[name=site] option:selected").val() ? data.site : $("#fbaProjectAddFrom select[name=site] option:selected").val();
                        var cateUrl ;
                        var cateSearchUrl ;
                        //后端是否应该限制 站点必填？？
                        if (site && site != '') {
                            cateSearchUrl = '/fbaProduct/getAmazonCateList.html?siteId=' + site;
                            cateUrl = '/fbaProduct/getAmazonCateList.html?siteId=' + site;
                        } else {
                            cateSearchUrl = "/fbaProduct/getAmazonCateList.html";
                            cateUrl = "/fbaProduct/getAmazonCateList.html";
                        }
                        admin.itemCat_select('layer-amazon-fba-project-manager-id',
                        'LAY-fbaProject-hidden2', 'LAY-amazon-fba-project-manager-div1'
                    ,cateUrl ,cateSearchUrl);
                    });

                    // 上传图片
                new UploadImage("add_image", ctx + '/fbaProduct/getBase64Img.html').upload(function (xhr) { //上传完成后的回调
                    var img = new Image('300', '300');
                    var returnData;
                    try {
                        returnData = JSON.parse(xhr.responseText);
                    } catch (err) {

                    }
                    if (xhr.responseText == '') {
                        layer.msg("上传出错!");
                    } else if (returnData != undefined && returnData.code == '9999') {
                        layer.msg("上传出错!" + xhr.responseText);
                    } else {
                        img.src = xhr.responseText;
                        $("#fbaProjectAddFrom input[name='image']").val(xhr.responseText);
                        $(this).empty().html(img);
                    }
                });
                $('#delete_pasteImg').click(function () {
                    $("#fbaProjectAddFrom input[name='image']").val("");
                    $('#add_image').html('')
                })
                // 数据渲染
                    $("#LAY-amazon-fba-project-manager-div1").text(data.cateFullName)
                    $("#fbaProjectAddFrom select[name=site]").val(data.site)
                    $("#fbaProjectAddFrom select[name=processStatus]").val(data.site)
                    renderFormInput('fbaProjectAddFrom', 'projectName', data.projectName)
                    renderFormInput('fbaProjectAddFrom', 'firstVessel', data.firstVessel)
                    renderFormInput('fbaProjectAddFrom', 'processStatus', data.processStatus)
                    renderFormInput('fbaProjectAddFrom', 'projectType', data.projectType)
                    renderFormInput('fbaProjectAddFrom', 'auditMoney', data.auditMoney)
                    renderFormInput('fbaProjectAddFrom', 'auditProdAmout', data.auditProdAmout)
                    renderFormInput('fbaProjectAddFrom', 'avgPrice', data.avgPrice)
                    renderFormInput('fbaProjectAddFrom', 'prodPSkuList', data.prodPSkuList)
                    renderFormInput('fbaProjectAddFrom', 'pAsinList', data.pAsinList)
                    renderFormInput('fbaProjectAddFrom', 'shipmentIdList', data.shipmentIdList)
                    renderFormInput('fbaProjectAddFrom', 'remark', data.remark)
                    $('#add_image').html('<img src='+ data.image + " class='imgCss' style='width:300px;height:300px;border:1px solid #f2f2f2' />")
                },
                yes: function (index, layero) {
                    var newdata = serializeObject($('#fbaProjectAddFrom'));
                     //获取图片
                    var imgDiv = document.getElementById('add_image');
                        if (imgDiv) {
                        var img = imgDiv.getElementsByTagName("img");
                            if (img && img.length > 0) {
                                newdata.image = img[0].src;
                            }
                    }
                    newdata.cateId = newdata.cateId ? newdata.cateId : data.cateId;
                    newdata.id = data.id; 
                    if(!newdata.projectName){
                        layer.msg('请填写项目名称')
                        return
                    }
                    // if(!newdata.cateId && $("#LAY-amazon-fba-project-manager-div1").text() == ""){
                    //     layer.msg('请选择站点类目')
                    //     return
                    // }
                    if(!newdata.projectType){
                        layer.msg('请填写项目类型')
                        return
                    }
                    if(!newdata.avgPrice){
                        layer.msg('请填写平均售价（$）')
                        return
                    }
                    if(newdata.auditProdAmout && !(/(^[0-9]\d*$)/.test(newdata.auditProdAmout))){
                        layer.msg('审批发货数量必须为整数')
                        return
                    }
                    $.ajax({
                        url: `${ctx}/fbaProduct/updateFbaProject.html`,
                        type: 'post',
                        dataType: 'json',
                        data:newdata,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.msg(returnData.msg)
                                fbaProject_listCard()
                                layer.close(index)
                            }else if(returnData.code == "9999"){
                                layer.msg(returnData.msg)
                            }
                        }
                    });
                },

            })
        } else if(layEvent === 'fbaProject_toexamine'){
            var index = layer.open({
                type: 1,
                title: '审核项目',
                area: ['700px', '40%'],
                shadeClose: false,
                btn: ['保存', '关闭'],
                content: $('#newfbaProject_toexaminelist').html(),
                success: function (layero) {
                    form.render()
                    form.render();
                    if (data.auditResult == 1 || data.auditResult == 2) {
                        renderFormInput('fbaProjecttoexaminelFrom', 'auditRemark', data.auditRemark)
                        // 获取所有 radio
                        var radioInput = $('#fbaProjecttoexaminelFrom input[name="auditResult"]');
                        for (let i = 0; i < radioInput.length; i++) {
                            var radio = radioInput[i];
                            //判断值是否一致
                            if (data.auditResult == radio.value) {
                                $(radio).prop('checked', 'checked');
                                break;
                            }
                        }
                        form.render('radio');
                    }
                },
                yes: function (index, layero) {
                    var newdata = serializeObject($('#fbaProjecttoexaminelFrom'));
                    newdata.id = data.id;
                    $.ajax({
                        url: `${ctx}/fbaProduct/auditFbaProject.html`,
                        type: 'post',
                        dataType: 'json',
                        data:newdata,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.msg(returnData.msg)
                                layer.close(index)
                                fbaProject_listCard()
                                return
                            }
                            if(returnData.code == "9999"){
                                layer.msg(returnData.msg)
                                layer.close(index)
                                return
                            }
                        }
                    });
                }
            })
        } else if(layEvent =='fbaProject_modify'){
            var index = layer.open({
                type: 1,
                title: '修改负责人',
                area: ['500px', '30%'],
                shadeClose: false,
                btn: ['保存', '关闭'],
                content: $('#fbaProject_modify').html(),
                success: function (layero) {
                    form.render()
                    fbaProject_responsor();
                },
                yes: function (index, layero) {
                    var newdata = serializeObject($('#fbaProjectmodify'));
                    newdata.id = data.id;
                    $.ajax({
                        url: `${ctx}/fbaProduct/updateResponsor.html`,
                        type: 'post',
                        dataType: 'json',
                        data:newdata,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.msg(returnData.msg)
                                layer.close(index)
                                fbaProject_listCard()
                                return
                            }
                            if(returnData.code == "9999"){
                                layer.msg(returnData.msg)
                                layer.close(index)
                                return
                            }
                        }
                    });
                },
            })
        } else if (layEvent == "fbaProject_del"){
            layer.confirm('确定删除此项目?', function (index) {
                $.ajax({
                    url:`${ctx}/fbaProduct/deleteFbaProjectById.html`,
                    data: {"id": data.id},
                    dataType: "json",
                    success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("删除fba项目信息成功");
                        fbaProject_listCard()
                        layer.closeAll();
                    } else {
                        layer.msg(returnData.msg);
                            }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
        
                })
        } else if (layEvent === 'fbaProjectHistoryClick'){
                //点击假 a标签触发事件
                //获取选项卡当前li的lay-id信息
                var currentLayId = $('#LAY_app_tabsheader>li.layui-this').attr('lay-id');
                //缓存需要的数据
                var temp = {};
                temp.sAsinList = data.sAsinList;
                temp.currentLayId = currentLayId;
                //保存到缓存中
                window.localStorage['fbaProjectToFbaHistory'] = JSON.stringify(temp);
                if ($('#fbaProjectHistoryClick_' + data.id) && $('#fbaProjectHistoryClick_' + data.id).length > 0) {
                    $('#fbaProjectHistoryClick_' + data.id)[0].click();
                }
            }else if (layEvent === 'fbaProjectDeliveryClick'){
                //点击假 a标签触发事件
                //获取选项卡当前li的lay-id信息
                var currentLayId = $('#LAY_app_tabsheader>li.layui-this').attr('lay-id');
                //缓存需要的数据
                var temp = {};
                temp.shipmentIdList = data.shipmentIdList;
                temp.currentLayId = currentLayId;
                //保存到缓存中
                window.localStorage['fbaProjectToFbaDelivery'] = JSON.stringify(temp);
                if ($('#fbaProjectDeliveryClick_' + data.id) && $('#fbaProjectDeliveryClick_' + data.id).length > 0) {
                    $('#fbaProjectDeliveryClick_' + data.id)[0].click();
                }
            }else if (layEvent=== 'fbaProject_download') {
            var fileName =  data.fileName;
            var fileSaveName = data.saveFileName;
            if (!fileName || fileName == '') {
                layer.msg("当前fba项目没有附件可下载" , {icon: 5});
                return;
            }
            if (!fileSaveName || fileSaveName == '') {
                layer.msg("当前fba项目没有附件可下载" , {icon: 5});
                return;
            }
            var data = {
                fileName: fileName,
                fileSaveName: fileSaveName
            };
            submitForm(data,ctx + '/fbaProduct/downExtraFile.html')

        }
    

    })
    // 导出功能
    $("#fbaProject_outList").click(function () {
        var confirmindex = layer.confirm('确认导出当前搜索条件下的FBA项目？', {btn: ['确认', '取消']}, function () {
            var data = serializeObject($('#fbaProject_search_form'));
            if(data.timerange) {
                data.timeFrom = data.timerange.split(" - ")[0] + " 00:00:00";
                data.timeTo = data.timerange.split(" - ")[1] + " 23:59:59";
            };
            submitForm(data, `${ctx}/fbaProduct/exportAllFbaProjectInfo.html`)
            layer.close(confirmindex);
        })
    })

    //  批量修改责任人
    $('#fbaProject_modification').click(function () {
    var checkStatus = table.checkStatus('fbaProjectTable');
    var objData = checkStatus.data;
    if (objData == null || objData.length < 1) {
        layer.msg('请勾选要修改责任人数据', { icon: 0 });
        return false;
    }
    var idList = [];
    objData.map(item => {
        idList.push(item.id);
    })
    var index = layer.open({
        type: 1,
        title: '批量修改负责人',
        area: ['500px', '30%'],
        shadeClose: false,
        btn: ['保存', '关闭'],
        content: $('#fbaProject_modify').html(),
        success: function (layero) {
            form.render()
            fbaProject_responsor();
        },
        yes: function (index, layero) {
            var newdata = {
                responsorId: $("#fbaProjectmodify [name=responsorId]").val(),
                idList: idList,
            }
            if(newdata.responsorId == "") {
                layer.msg('请选择责任人!');
                
            }
            $.ajax({
                url: `${ctx}/fbaProduct/updateResponsorByIdList.html`,
                type: 'post',
                contentType: 'application/json',
                data:JSON.stringify(newdata),
                success: function (returnData) {
                    if (returnData.code === "0000") {
                        layer.msg("修改责任人成功")
                        layer.close(index)
                        fbaProject_listCard()
                        return
                    }
                    if(returnData.code == "9999"){
                        layer.msg(returnData.msg)
                        layer.close(index)
                        return
                    }
                },error: function(rsp){
                    console.log(rsp)
                }
            });
        },
    })

    });

    // 获取表单内容函数start
    function renderFormInput(selector, name, value) {
        $('#' + selector + ' [name="' + name + '"]').val(value)
    }
    // 站点渲染
    function fillsite() {
        $.ajax({
            url: `${ctx}/enum/getSiteEnum.html?platCode=amazon`,
            type: 'POST',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    allStatusOrder_Site =returnData.data;
                    appendSelect($('#fbaProject_search_form').find('select[name="site"]'), allStatusOrder_Site, 'code', 'name')   
                }
            }
        });
    };
    // 店铺渲染
    function shop() {
        $.ajax({
            url: `${ctx}/sys/liststore.html`,
            type: 'POST',
            dataType: 'json',
            data: {
                roleNames: "amazon专员",
                platCode: "amazon"
            },
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var arr = [];
                    for (let i = 0; i < returnData.data.length; i++) {
                        var temp = {};
                        temp.name = returnData.data[i].storeAcct;
                        temp.value = returnData.data[i].id;
                        arr.push(temp);
                    }
                    formSelects.data('storeFollowAcctIdList', 'local', {arr: arr})
                    formSelects.data('addstoreFollowAcctIdList', 'local', {arr: arr})
                    };  
                }
        });
    };

     // 项目进度
    function Projectschedule() {
        $.ajax({
            url: `${ctx}/fbaProduct/getFbaProSysBizDictDetail.html`,
            type: 'get',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    allProjectschedule =returnData.data;
                    appendSelect($('#fbaProject_search_form').find('select[name="processStatus"]'), allProjectschedule, 'code', 'name')   
                    form.render('select');                
                }
            }
        });
    };
      // 新责任人
    function fbaProject_responsor() {
        var html = '';
        $.ajax({
            url: `${ctx}/sysuser/listByRole.html?role=开发专员`,
            type: 'get',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    returnData.data.length>0 && returnData.data.map(item => {
                        html += `<option  value ="${item.id}">${item.userName}</option>`;
                    })
                    $("#fbaProject_responsor").append(html);
                    form.render('select');                    
                }
            }
        });
    };
    
    });


        //填充下拉框
        function appendSelect(aDom, data, code, label, attachment) {
            aDom.empty();
            var option = '<option value="">请选择</option>'
            for (var i in data) {
                if (typeof data[i] !== 'string') {
                    attachment ?
                        data[i].code = data[i][code] + '_' + data[i][attachment] :
                        data[i].code = data[i][code].toString() || data[i].code
                    data[i].label = data[i][label] || data[i].label;
                }
                option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
            }
            aDom.append(option)
        }


})()
