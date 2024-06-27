console.log("FBAfreight");
//结构
//初始化和数据结构定义
//click事件定义
//表单事件最后
//无业务意义的方法
layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage', 'upload', 'laydate','formSelects'], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        layer = layui.layer,
        formSelects = layui.formSelects,
        upload = layui.upload;
    laydate = layui.laydate;
    form.render('select');
    laydate.render({
        elem: '#FBAfreight_Form_time',
        type: 'date',
        range: true
    });

    var tablecol = {
        'FBAfreight_table': [
            [ //FBA头程运费
                {checkbox: true, width: 30, totalRowText: '合计'},
                {title: "站点-国家", field: "salesSiteName"},
                {title: "物流公司", field: "companyName"},
                {title: "物流方式", field: "logisticsType"},
                {title: "货件编号", field: "shipmentId"},
                {title: "运单号", field: "freightNum"},
                {title: "FBA仓库代码", field: "fnCenterId"},
                {title: "仓库重量(kg)", field: "storageWeight"},
                {title: "仓库发货箱子数量", field: "storageDeliverCartonAmount",totalRow: true},
                {title: "账单重量(kg)", field: "billWeight",totalRow: true},
                {title: "账单箱子数量", field: "billCartonAmount",totalRow: true},
                {title: "重量差(kg)", field: "subtractWeight"},
                {title: "箱子数量差", field: "subtractCartonAmount"},
                {title: "总运费", field: "freightPrice",totalRow: true},
                {title: "SKU种类", field: "skuMulNumber",totalRow: true},
                {title: "SKU数量", field: "totalUnits"},
                {title: "时间", field: "time", templet: '#FBAfreight_time_tpl',width:200},
                {title: "备注", field: "exceptionRemark"},
                {title: '操作', field: "", toolbar: "#FBAfreight_Option",width:100}
            ]
        ],
        'FBAfreight_log_sku_table': [
            [ //FBA头程运费
                {title: "站点", field: "salesSite"},
                {title: "货件", field: "shipmentId"},
                {title: "箱号", field: "indexNum"},
                {title: "SKU", field: "salesSiteName",templet: '#FBAfreight_log_sku_tpl'},
                {title: "数量", field: "quantityShipped"},
                {title: "货品摊分运费", field: "sellerSkuFreightPrice"},
                {title: "商品信息", field: "",templet: '#FBAfreight_log_psi_tpl'},
                {title: "箱子信息", field: "",templet: '#FBAfreight_log_carton_tpl'},
            ]
        ]
    };

    //物流公司枚举接口+渲染
    FBAfirstCompany()
    function FBAfirstCompany(){
      commonReturnPromise({
        url: '/lms/company/specialType?specialType=FBA头程'
      }).then(res => {
        commonRenderSelect("FBAfreight_companyNameList", res, {name: 'cnName', code: 'id'}).then(() => {
          formSelects.render("FBAfreight_companyNameList");
        });
        formSelects.on(
          "FBAfreight_companyNameList",
          function (id, vals, val, isAdd, isDisabled) {
            var idsArr = vals.map(function (item) {
              return item.value;
            });
            FBAfirstLogisType(idsArr.join(',')).then(res => {
              commonRenderSelect("FBAfreight_logisticsTypeList", res, {name: 'name', code: 'id'}).then(() => {
                formSelects.render("FBAfreight_logisticsTypeList");
              });
            });
          },
          true
        );
      });
    }
    //物流方式枚举接口+渲染
    function FBAfirstLogisType(logisticsCompanyIdList){
      return commonReturnPromise({
        url: '/lms/type/list/specialType',
        type: 'post',
        params: {
          page: 1,
          limit: 999,
          specialType: 'FBA头程',
          logisticsCompanyIdList: logisticsCompanyIdList
        }
      });
    }

    //导入
    upload.render({ //允许上传的文件后缀
        elem: '#FBAfreight_importFreight',
        url: ctx + '/amazonFBAFreight/uploadFBAfreightTemp.html',
        accept: 'file' //普通文件
        ,
        exts: 'xls|xlsx' //只允许上传excel文件
        ,
        before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            loading.show();
        },
        done: function (returnData) {
            loading.hide();
            $('#FBAfreight_Search').click();
            if (returnData.code == "0000") {

                if (returnData.msg) {
                    layer.alert(returnData.msg);
                } else {
                    layer.msg('上传成功');
                }
            } else {
                layer.msg(returnData.msg, {icon: 2});
            }
        }
    });
    //下载导出异常SKU运单
    $('#FBAfreight_exportErr_FreightNum').click(function () {
        submitForm(null, ctx + '/amazonFBAFreight/exportErrSkuFreightNum.html');
    });

    //下载导出SKU运单
    $('#FBAfreight_query_FreightNum').click(function () {
        var data = getFormReqObj("FBAfreight_Form");
        data.page = $('#FBAfreight_Form input[name="page"]').val();
        data.limit = $('#FBAfreight_Form input[name="limit"]').val();
        if (data.time) {
            data.startTime = data.time.split(' - ')[0] + ' 00:00:00';
            data.endTime = data.time.split(' - ')[1] + ' 23:59:59';
        }
        let params = {
            requestJson: JSON.stringify(data)
        }
        submitForm(params, ctx + '/amazonFBAFreight/export');
    });


    // 弹框-----------------
    //监听工具栏操作(精简化操作,使用封装方法的形式,使代码简洁,简单ajax无需封装)
    for (var i in tablecol) {
        table.on('tool(' + i + ')', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'edit') {
                layer.open({
                    type: 1,
                    title: '修改运单',
                    btn: ['修改', '关闭'],
                    area: ['65%', '30%'],
                    content: $('#FBAfreight_eidit_tpl').html(),
                    success: function (index, layero) {
                        $('#FBAfreight_edit_Form input[name=freightNum]').attr('disabled',true);
                        $('#FBAfreight_edit_Form input[name=id]').val(data.id);
                        $('#FBAfreight_edit_Form input[name=freightNum]').val(data.freightNum);
                        $('#FBAfreight_edit_Form input[name=freightPrice]').val(data.freightPrice);
                    },
                    yes: function (index, layero) {
                        //触发表单提交任务
                        $('#FBAfreight_createOrEdit').click();
                    }
                })
            }

            if (layEvent === 'auditSucc') {
                layer.confirm('您确认要审核通过吗？', {icon: 3, title: '提示'}, function () {
                    initAjax("/amazonFBAFreight/changeAuditStatus.html","POST",JSON.stringify({id:data.id,auditStatus:1}),function (returnData) {
                        layer.msg(returnData.msg||'已设置审核通过');
                        $('#FBAfreight_Search').click();
                    },null,true,true);
                });
            }
            if (layEvent === 'auditNotSucc') {
                layer.confirm('您确认要修改为审核不通过吗？', {icon: 3, title: '提示'}, function () {
                    initAjax("/amazonFBAFreight/changeAuditStatus.html","POST",JSON.stringify({id:data.id,auditStatus:0}),function (returnData) {
                        layer.msg(returnData.msg||'已修改为审核未通过');
                        $('#FBAfreight_Search').click();
                    },null,true,true);
                });
            }
            if (layEvent === 'auditUnUse') {
                layer.confirm('您确认要作废吗？', {icon: 3, title: '提示'}, function () {
                    initAjax("/amazonFBAFreight/changeAuditStatus.html","POST",JSON.stringify({id:data.id,auditStatus:2}),function (returnData) {
                        layer.msg(returnData.msg||'已修改为作废');
                        $('#FBAfreight_Search').click();
                    },null,true,true);
                });
            }
            if (layEvent === 'auditCancleUnUse') {
                layer.confirm('您确认要取消作废吗？', {icon: 3, title: '提示'}, function () {
                    initAjax("/amazonFBAFreight/changeAuditStatus.html","POST",JSON.stringify({id:data.id,auditStatus:0}),function (returnData) {
                        layer.msg(returnData.msg||'已取消作废');
                        $('#FBAfreight_Search').click();
                    },null,true,true);
                });
            }

            if (layEvent === 'showAuditSuccLog') {

                layer.open({
                    type: 1,
                    title: '运单审核时摊分明细',
                    btn: [ '关闭'],
                    area: ['80%', '80%'],
                    content: $('#FBAfreight_log_tpl').html(),
                    success: function (index, layero) {
                        initAjax("/amazonFBAFreight/listAuditSuccLog.html","POST",JSON.stringify({id:data.id}),function (returnData) {
                            renderTable(returnData.data,'FBAfreight_log_sku_table');
                            // renderTable(returnData.data,'FBAfreight_log_carton_table');
                        },null,true,true);
                    }
                });


            }

            //新增-2020/2/29-ztt
            if(layEvent === 'cancelAbnormal'){ //取消异常
                FBAAbnormalStatus(data.id, 0);
            }else if(layEvent === 'markAbnormal'){ //标记异常
                FBAAbnormalStatus(data.id, 1);
            }


        });
    }

    function FBAAbnormalStatus(id, status){
        var  index = layer.open({
            type: 1,
            title: '异常处理',
            btn: ['保存','关闭'],
            area: ['700px', '400px'],
            content: $('#FBAAbnormalLayer').html(),
            success: function(layero,index){
                // console.log(layero);
            },
            yes: function(index, layero){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    url: '/lms/amazonFBAFreight/updateExceptionStatus.html',
                    data: JSON.stringify({
                        id: id,
                        isException: status,
                        exceptionRemark: $('#FBAAbnormal_textarea').val()
                    }),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code = '0000'){
                           layer.msg('异常处理成功!');
                           layer.close(index);
                           $('#FBAfreight_Search').trigger('click');
                        }
                    }
                })
            }
        })
    }

    function form_search(data) {//初次search的入口
        initAjax('/amazonFBAFreight/queryPage.html', 'POST', JSON.stringify(data), function (returnData) {
            renderPage(returnData.count, data.page, data.limit);
            renderTable(returnData.data, 'FBAfreight_table');
        }, null, true, true);
    }

    function renderTable(data, tablename, func) {//
        var tableIns = table.render({
            elem: '#' + tablename,
            method: 'POST',
            data: data,
            cols: tablecol[tablename],
            page: false,
            totalRow: true,
            limit: Number.MAX_VALUE,
            id: tablename,
            done: function (data) {
                if (func) {
                    func(data);
                }
            }
        })
    }

    function getFormReqObj(formIdName) {//获取表单参数
        var d = {};
        var t = $('#' + formIdName + ' [name]').serializeArray();
        $.each(t, function () {
            d[this.name] = this.value;
        });
        d.companyIdList = d.companyNameList? d.companyNameList.split(','): [];
        d.logisticsTypeIdList = d.logisticsTypeList? d.logisticsTypeList.split(','): [];
        d.shipmentIdList = d.shipmentIdList? d.shipmentIdList.split(','): [];
        delete d.companyNameList;
        delete d.logisticsTypeList;
        return d;
    }

    function renderPage(count, current, limit) {//分页
        laypage.render({
            elem: 'FBAfreight_page',
            curr: current,
            limit: limit,
            limits: [10, 300, 500],
            layout: ['prev', 'page', 'next', 'count','limit'],
            count: count,
            jump: function (obj, first) {
                $('#FBAfreight_Form input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#FBAfreight_Form input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    var data = getFormReqObj("FBAfreight_Form");
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    if (data.time) {
                        data.startTime = data.time.split(' - ')[0] + ' 00:00:00';
                        data.endTime = data.time.split(' - ')[1] + ' 23:59:59';
                    }
                    form_search(data);
                }
            }
        });
    }

    //下载模板
    $('#FBAfreight_exportTemplate').click(function () {
        submitForm(null, ctx + '/amazonFBAFreight/downFreightTemp.html');
    });

    $('#FBAfreight_createFreight').click(function () {
        layer.open({
            type: 1,
            title: '创建运单',
            btn: ['创建', '关闭'],
            area: ['65%', '30%'],
            content: $('#FBAfreight_eidit_tpl').html(),
            success: function (index, layero) {

            },
            yes: function (index, layero) {
                //触发表单提交任务
                $('#FBAfreight_createOrEdit').click();
            }
        })
    });

    //下载模板
    $('#FBAfreight_auditSuccBatch').click(function () {

        var checkStatusList = table.checkStatus('FBAfreight_table');
        var idList = [];
        if (checkStatusList.data.length > 0) {
            for (var i = 0; i < checkStatusList.data.length; i++) {
                idList.push(checkStatusList.data[i].id);
            }
        }else {
            layer.msg("请至少选择一条数据");
            return;
        }
        layer.confirm('您确认要批量审核通过吗？', {icon: 3, title: '提示'}, function () {
            initAjax("/amazonFBAFreight/changeAuditSuccStatusBatch.html", "POST", JSON.stringify({idList:idList}), function (returnData) {
                layer.msg(returnData.msg||'批量审核完成');
                $('#FBAfreight_Search').click();
            }, null, true, true,true)
        });
    });


    //提交
    form.on('submit(FBAfreight_createOrEdit)', function (data) {//作为初次提交
        initAjax("/amazonFBAFreight/createOrEdit.html", "POST",JSON.stringify(data.field), function (returnData) {
            layer.closeAll();
            if (data.field.id) {
                layer.msg(returnData.msg || "修改成功");
            } else {
                layer.msg(returnData.msg || "创建成功");
            }
            $('#FBAfreight_Search').click();
        }, null, true, true);
    });

    //查询未导入运费运单
    $('#FBAfreight_searchNotset_btn').click(function () {
        layer.open({
            type: 1,
            title: '查询已使用未导入的运单',
            btn: ['关闭'],
            area: ['65%', '30%'],
            content: $('#FBAfreight_searchNotset_tpl').html(),
            success: function (index, layero) {
                initAjax("/amazonFBAFreight/listNotImportFreightNum.html", "POST",JSON.stringify({}), function (returnData) {
                    $('#FBAfreight_searchNotset_Form textarea[name=freightNumList]').val(returnData.data);
                });
            }

        })
    });

    // 表单提交
    //验证 //分页效果,从按钮触发是否可以重置//如果不能重置,则改为非表单提交,表单的目的做数据校验
    form.on('submit(FBAfreight_Search)', function (data) {//作为初次提交
        // data.field.page = 1;//保障首次分页请求中带有的值正确,分页首次为第一页,如果页面刷新业务需要保持在原有页,则注释此行
        data.field.page = 1;//保障首次分页请求中带有的值正确,分页首次为第一页,如果页面刷新业务需要保持在原有页,则注释此行
        if (data.field.time) {
            data.field.startTime = data.field.time.split(' - ')[0] + ' 00:00:00';
            data.field.endTime = data.field.time.split(' - ')[1] + ' 23:59:59';
        }
        data.field.companyIdList = data.field.companyNameList? data.field.companyNameList.split(','): [];
        data.field.logisticsTypeIdList = data.field.logisticsTypeList? data.field.logisticsTypeList.split(','): [];
        data.field.shipmentIdList = data.field.shipmentIdList? data.field.shipmentIdList.split(','): [];
        delete data.field.companyNameList;
        delete data.field.logisticsTypeList;
        form_search(data.field);
    });


    function initAjax(url, method, data, succFunc, contentType, loadingShow, laodingHide,needFailAlert) { //初始化ajax请求
        if (loadingShow) {
            loading.show();
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (returnData.code == "0000") {
                    succFunc(returnData)
                } else {
                    if (needFailAlert) {
                        layer.alert(returnData.msg, {icon: 2},function (index) {
                            $('#FBAfreight_Search').click();
                            layer.close(index);
                        });
                    } else {
                        layer.msg(returnData.msg, {icon: 2});
                    }
                }
            },
            error: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }
    //初始动作
    $('#FBAfreight_Search').click();
})
