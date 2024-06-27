layui.use(["admin", "form", "table", "layer", "laytpl", "laydate","formSelects"], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    laydate.render({
        elem: '#ps_searchTime',
        range: true
    })

    function initTime(){
        //初始化日期控件
        laydate.render({
            elem: '#supplierUncooperativeTime',
            type: 'datetime'
        });
    }

     $(function(){
         listSmtSecondCate();
         form.render('select');
     });

    $('#productSupplier_downloadUpdTemplate').click(function (){
        window.open(
            ctx + "/static/templet/supplier_updateTemplate.xlsx",
            "_blank"
        );
    })
    // 导入修改供应商名称
    $('#productSupplier_updateByExcel').click(function () {
        $('#productSupplier_updateFile').click()
    })
    $('#productSupplier_updateFile').on('change', function() {
            var files = $('#productSupplier_updateFile')[0].files
            // 如果没有文件则终止
            if (files.length === 0) {
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
                        url: ctx + '/prodSupplier/updateByExcel',
                        type: 'POST',
                        // async : false,
                        data: formData,
                        // 告诉jQuery不要去处理发送的数据
                        processData: false,
                        // 告诉jQuery不要去设置Content-Type请求头
                        contentType: false,
                        success: function(data) {
                            loading.hide()
                            $('#productSupplier_updateFile').val('')
                            layer.alert(data.msg)
                        },
                        error: function() {
                            loading.hide()
                            $('#productSupplier_updateFile').val('')
                        }
                    })
                },
                function() {
                    layer.closeAll()
                }
            )
    })
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#prodSupplierTable",
        method: "post",
        url: ctx + "/prodSupplier/getProdSuppliers.html",
        cols: [
            [
                //标题栏
                { type: "checkbox" },
                { field: "serverType", title: "供应商来源" },
                { field: "supplier", title: "供应商名称" },
                { field: "supplierCode", title: "供应商编码" },
                { field: "aliLoginId", title: "loginID" },
                { field: "cateCnNameStr", title: "所属类目" },
                { field: "type", title: "类型", templet: '#productSupplierTypeTpl' },
                { field: "isSupportCust", title: "支持定制", templet: '#isSupportCustTpl', width: 63},
                { field: "contact", title: "联系人" },
                { field: "mobile", title: "电话" },
                { field: "score", title: "服务评分" },
                { field: "onSaleSkuNum", title: "在售子SKU数量" ,width:70},
                { field: "companySite", title: "网址", templet: '#isNetworkTpl',width:60 },
                { field: "isCooperate", title: "状态", templet: '#isCooperateTpl', width: 60 },
                { field: "createTime", title: "创建时间", templet: '#ps_timeTpl'},
                //绑定工具条
                { title: '操作', toolbar: '#prodSupplierTableBar' }
            ],
        ],
        id: 'prodSupplierReloadTable',
        page: true,
        limits: [100, 500, 1000],
        limit: 100
    });

    // 搜索
    var active = {
        reload: function() {
            let Adata = serializeObject($('#productSupplierSearchForm'))
            //执行重载
            table.reload('prodSupplierReloadTable', {
                page: { curr: 1 },
                where: Adata
            });
        }
    };
    initCateXtreeForSupplier()
    // 导出
    $("#exportProductSupplier").click(function() {
        let Adata = serializeObject($('#productSupplierSearchForm'))
        submitForm(Adata, ctx + '/prodSupplier/exportProdSuppliers.html', '_blank')
    })
    //增加供应商
    $("#addProductSupplier").click(function() {
        var index = layer.open({
            type: 1,
            title: "新增供应商",
            area: ["800px", "600px"],
            btn: ['保存','关闭'],
            content: $("#addSupplierPop").html(),
            success: function() {
                initComponent()
            },
            end: function() {
                $("#addProductSupplierForm").trigger('reset');
                $("#addProductSupplierForm input[name='id']").val("");
                $("#xtreeDiv").html("");
            },
            yes: function(index,layero){
                if (!checkNotNull('#addProductSupplierForm')) {
                    return false
                }
                layero.find('#addProductSupplierInfo').trigger('click');
            }
        });
    });

    function initComponent(){
        initNotNull('#addProductSupplierForm')
        // 可选省份初始化
        initSelectIcon(form,'PROVINCE_CODE','#addProductSupplierForm [name=province]',true)
        // 不合作原因
        initSelectIcon(form,'uncoop_reason_tag','#ps_uncoopReasonTag',true)

        //所属类目
        alertCateSelect($('#addProductSupplierForm #xtreeBtn'),$('#addProductSupplierForm [name=supportCateIds]'),$('#addProductSupplierForm #xtreeDiv'));

        //$('#ps_supportCateIds').select2();
        //form.render('checkbox');
        form.render('select');
        form.render('checkbox');
        initTime();
    }

    $('#productSupplierSearch').click(function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    form.on('submit(addProductSupplierInfo)', function(data) {
        //处理数据
        //data.field.supportCateIds = layui.formSelects.value('ps_select_add','val').join(",");
        data.field.isSupportCust = false;
        if ($("#isSupportCust").is(":checked")) {
            data.field.isSupportCust = true;
        }
        data.field.isCooperate = true;
        if ($("#isCooperate").is(":checked")) {
            data.field.isCooperate = false;
            data.field.uncooperativeReason = $("#ps_uncoopReasonTag").val();
        }
        var uncooperativeTime = data.field['uncooperativeTime'];
        uncooperativeTime = uncooperativeTime.replace(/-/g, "/");
        data.field['uncooperativeTime'] = admin.Format(uncooperativeTime, "yyyy-MM-hh mm:dd:ss");
        if(data.field['companyAddr'] == ''||data.field['aliLoginId'] == ''){
            layer.msg("数据不全,不能添加")
            return false;
        }
        $.ajax({
            type: "post",
            url: ctx + "/product/addProdSupplier.html",
            dataType: "json",
            data: data.field,
            success: function(returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg("操作成功");
                    table.reload('prodSupplierReloadTable');
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("发送请求失败");
            }
        })
        return false;
    });

    // 采集信息回填
    $(document).off('click',"#productSupplier_collectInfo").on('click',"#productSupplier_collectInfo",function(){
        // let url = $("#addProductSupplierForm [name=1688url]").val()
        // if (url.indexOf('https://detail.1688.com/offer/') < 0) {
        //     layer.msg('请先填写1688链接(协议必须为https)')
        //     return
        // }

        // commonReturnPromise({
        //     url: '/lms/prodSupplier/getWangDuoYunCrawlerApiInformation.html',
        //     type:'POST',
        //     contentType:"application/json",
        //     params:JSON.stringify({"Url":url,"categoryForecast":"false"})
        // }).then(res => {
        //     $("#addProductSupplierForm [name=supplier]").val(res.provider_name)
        //     $("#addProductSupplierForm [name=aliLoginId]").val(res.shop_id)
        //     $("#addProductSupplierForm [name=aliLoginId]").attr("readonly",true)
        //     $("#addProductSupplierForm [name=isCollect]").val(true)
        //     $("#addProductSupplierForm [name=supplierCode]").val(res.shop_id)
        //     $("#addProductSupplierForm [name=contact]").val(res.contact)
        //     $("#addProductSupplierForm [name=mobile]").val(res.mobileNo)
        //     $("#addProductSupplierForm [name=companySite]").val(res.shop_url)
        //     $("#addProductSupplierForm [name=companyAddr]").val(res.address)
        // }).catch(err => {
        //     layer.msg(err, { icon: 2 });
        // })
        let url = $("#addProductSupplierForm [name=1688url]").val() || ''
        if (url.indexOf('https://detail.1688.com/offer/') < 0) {
            layer.msg('请先填写1688链接(协议必须为https)')
            return
        }
        if (url.indexOf('.html?') > -1) {
            window.open(url+ '&origin=lms')
        } else {
            window.open(url+ '?origin=lms');
        }
    })

    $(document).off('click',"#productSupplier_copyInfo").on('click',"#productSupplier_copyInfo",function(){
        console.log('粘贴信息')
        navigator.clipboard.readText().then(text => {
            let collectInfo = JSON.parse(text)
            console.log('剪贴板的文本为', collectInfo)
            $("#addProductSupplierForm [name=supplier]").val(collectInfo.supplierName)

            $("#addProductSupplierForm [name=aliLoginId]").val(collectInfo.sellerLoginId)
            $("#addProductSupplierForm [name=aliLoginId]").attr("readonly",true)
            $("#addProductSupplierForm [name=isCollect]").val(true)
            $("#addProductSupplierForm [name=supplierCode]").val(collectInfo.sellerLoginId)
            $("#addProductSupplierForm [name=contact]").val(collectInfo.contactPerson)
            $("#addProductSupplierForm [name=mobile]").val(collectInfo.telNumber)
            $("#addProductSupplierForm [name=companySite]").val(collectInfo.storeUrl)
            $("#addProductSupplierForm [name=companyAddr]").val(collectInfo.address)
        }).catch(err => {
            layer.msg('读取剪贴板中的文本失败', { icon: 2 });
        })
    })

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(prodSupplierTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            layer.open({
                type: 1,
                title: "编辑供应商信息",
                area: ["800px", "600px"],
                btn: ['保存','关闭'],
                content: $("#addSupplierPop").html(),
                success: function(layero, index) {
                    initComponent()
                    console.log('redata')
                    getProdSupplierInfo(data);
                },
                end: function() {
                    $("#addProductSupplierForm").trigger('reset');
                    $("#addProductSupplierForm input[name='id']").val("");
                    $("#xtreeDiv").html("");
                },
                yes: function(index,layero){
                    if (!checkNotNull('#addProductSupplierForm')) {
                        return false
                    }
                    layero.find('#addProductSupplierInfo').trigger('click');
                }
            });
        } else if (layEvent === 'del') {
            deleteProdSupplier(data.id);
        }
    });

    // 编辑-初始化数据
    function getProdSupplierInfo(data) {
        // $("#addProductSupplierForm input[name='aliLoginId']").val(data.aliLoginId);
        // $("#addProductSupplierForm input[name='supportCateIds']").val(data.supportCateIds);
        // $("#addProductSupplierForm input[name='id']").val(data.id);
        // $("#addProductSupplierForm input[name='supplier']").val(data.supplier);
        // $("#addProductSupplierForm input[name='supplierCode']").val(data.supplierCode);
        // $("#addProductSupplierForm select[name='type']").val(data.type);
        // $("#addProductSupplierForm input[name='contact']").val(data.contact);
        // $("#addProductSupplierForm input[name='mobile']").val(data.mobile);
        // $("#addProductSupplierForm input[name='qq']").val(data.qq);
        // $("#addProductSupplierForm input[name='email']").val(data.email);
        // $("#addProductSupplierForm input[name='companyAcct']").val(data.companyAcct);
        // $("#addProductSupplierForm input[name='companySite']").val(data.companySite);
        // $("#addProductSupplierForm input[name='companyAddr']").val(data.companyAddr);
        // $("#addProductSupplierForm input[name='score']").val(data.score);
        // $("#addProductSupplierForm select[name='serverType']").val(data.serverType);
        // $("#addProductSupplierForm select[name='provideIdentification']").val(String(data.provideIdentification));
        // $("#addProductSupplierForm select[name='ifDivision']").val(String(data.ifDivision));
        // $("#addProductSupplierForm input[name='uncooperativeTime']").val(Format(data.uncooperativeTime, "yyyy-M-d h:m:s"));
        // $("#addProductSupplierForm textarea[name='remark']").val(data.remark)
        let elemForm = $('#addProductSupplierForm')
        reappearance(data, elemForm)

        $("#xtreeDiv").html(data.supportCateNames);
        if(data.isCollect == true){
            $("#addProductSupplierForm [name=aliLoginId]").attr("readonly",true)
            $("#addProductSupplierForm [name=isCollect]").val(true)
        }
        $("#addProductSupplierForm #xtreeDiv").text(data.cateCnNameStr)
        if (data.isSupportCust == true) {
            $("#isSupportCust").prop("checked", true);
        }
        if (data.isCooperate == false) {
            $("#isCooperate").prop("checked", true);
        }

        form.render('select','addProductSupplierForm')
        form.render('checkbox','addProductSupplierForm')
    }

    //删除供应商
    function deleteProdSupplier(id) {
        if (typeof(id) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        layer.confirm('是否停用此供应商？', function(result) {
            if (result) {
                $.ajax({
                    url: ctx + '/prodSupplier/delProdSupplier.html',
                    data: { "id": id },
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            table.reload('prodSupplierReloadTable');
                            layer.msg('操作成功');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function() {
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }
    /*供应商所属类目start*/
    function listSmtSecondCate() {
        $("#addProductSupplierForm #ps_supportCateIds").prop("length", 0);
        $("#ps_searchCateId").prop("length", 2);
        $.ajax({
            type: "post",
            url: ctx + "/tort/listSecondCate.html",
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var data = returnData.data;
                    $(returnData.data).each(function() {
                        $("#addProductSupplierForm #ps_supportCateIds").append("<option value='" + this.id + "'>" + this.cateCnName + "</option>");
                        $("#ps_searchCateId").append("<option value='" + this.id + "'>" + this.cateCnName + "</option>");
                    });
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        })
    }
    /*供应商所属类目end*/
});
