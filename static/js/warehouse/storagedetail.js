/**入库明细**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element"],function () {
    var layer = layui.layer,
        table = layui.table,
        element=layui.element,
        form = layui.form,
        laydate = layui.laydate;

    //时间渲染
    laydate.render({elem: '#storageDetail_timerange_input', range: true});
    storageDetail_initPage();//初始化页面

    //查询渲染表格
    $("#storageDetail_search_btn").click(function () {
        storageDetail_count_fun();
    });
    /**监听tab选项卡切换**/
    element.on('tab(storageDetail_tab)', function (data) {
        storageDetail_count_fun();
    });

    /**渲染**/
    function storageDetail_count_fun(){
        var data = storageDetail_getSeacrhData();
        if (data.timerange == null || data.timerange == '') {
            layer.msg("请选择日期", {icon: 0})
            return false;
        }
        table.render({
            elem: '#storageDetail_data_table',
            url: ctx + "/storageDetailCount/getStorageDetailCountInfoByDto.html",
            page: true, //开启分页
            method: 'post',
            where: data,
            cols: [
                [ //表头
                    {field: 'storageNumber', title: '入库单号'},
                    {field: 'processStatus', title: '入库单状态',width:80,templet:'#storageDetail_processStatus_tpl'},
                    {field: 'prodSSku', title: '商品',templet:'#storageDetail_prodSSku_tpl'},
                    {field: 'person', title: '人员',width:95,templet:'#storageDetail_person_tpl'},
                    {field: 'supplyName', title: '供应商',},
                    {field: 'mainBillNumber', title: '采购单号'},
                    {field: 'buyerInfo', title: '采购信息',width:100,templet:'#storageDetail_buyerInfo_tpl'},
                    {field: 'storageInfo', title: '入库信息',width:100,templet:'#storageDetail_storageInfo_tpl'},
                    {field: 'wareHouseName', title: '采购仓库',width:75,},
                    {field: 'dealPerson', title: '处理人',width:95,templet:'#storageDetail_dealPerson_tpl'},
                    {field: 'dealTime', title: '时间',templet:'#storageDetail_dealTime_tpl'},
                    {field: 'storageDiffTimeStr', title: '采购入库时间差',width:80,},
                    {field: 'scanAuditDiffTimeStr', title: '点货到入库时间差',width:80,},
                    {field: 'otherDiffTimeStr', title: '其它时效',templet:'#storageDetail_otherDiffTimeStr_tpl'},
                ]
            ],
            limits: [100, 200, 300],
            limit: 100,
            done: function (res, curr, count) {
                if(res.code=='0000'){
                    $("#storageDetail_total_num").html(count);
                }else{
                    layer.msg(res.msg,{icon:0});
                }
            }
        });
    }
    //导出入库明细统计
    $("#storageDetail_export_btn").click(function () {
        var data = storageDetail_getSeacrhData();
        if (data.timerange == null || data.timerange == '') {
            layer.msg("请选择日期", {icon: 0})
            return false;
        }
        var startDate = data.timerange.substring(0, 10);
        var endDate = data.timerange.substring(13);
        if (!storageDetail_dateCheck_fun(startDate, endDate)) {
            return;
        }
        var confirmindex = layer.confirm('确认导出当前搜索条件下的采购入库明细信息？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/storageDetailCount/exportStorageDetailCountInfoByDto.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    });
    /**获取入库明细页面查询参数**/
    function storageDetail_getSeacrhData(){
        var data = serializeObject($('#storageDetail_search_form'));
        var dateTimeStr = $.trim(data.timerange);
        if (dateTimeStr != null && dateTimeStr != '') {
            if(data.timeType==0){//制单时间
                data.createTimeStart = dateTimeStr.substring(0, 10);
                data.createTimeEnd = dateTimeStr.substring(13) + " 23:59:59";
            }else{
                data.auditTimeStart = dateTimeStr.substring(0, 10);
                data.auditTimeEnd = dateTimeStr.substring(13) + " 23:59:59";
            }
        }
        data.supplyId='';
        return data;
    }
    /**
     * 获取默认当天
     */
    function storageDetail_initPage() {
        var createTimeEnd = Format(new Date(), 'yyyy-MM-dd');
        var createTimeStart = Format(new Date(), 'yyyy-MM-dd');
        $('#storageDetail_timerange_input').val(createTimeStart + ' - ' + createTimeEnd);
        /**供应商远程搜索**/
        new DimSearch('#storageDetail_searchSupplier_input', 'supplyId').init();
        /**初始化下拉框数据**/
        $.ajax({
            url: ctx + "/storageDetailCount/getStorageDetailCountPageEnum.html",
            type: 'post',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var buyerStr = "<option value=''></option>"
                    $(returnData.data.buyerList).each(function () {
                        buyerStr += '<option value="' + this.value + '">' + this.name + '</option>'
                    });
                    $("#storageDetail_buyer_sel").html(buyerStr);

                    var developerStr = "<option value=''></option>"
                    $(returnData.data.developerList).each(function () {
                        developerStr += '<option value="' + this.value + '">' + this.name + '</option>'
                    });
                    $("#storageDetail_developer_sel").html(developerStr);

                    var integratorStr = "<option value=''></option>"
                    $(returnData.data.integratorList).each(function () {
                        integratorStr += '<option value="' + this.value + '">' + this.name + '</option>'
                    });
                    $("#storageDetail_integrator_sel").html(integratorStr);

                    var creatorStr = "<option value=''></option>"
                    $(returnData.data.creatorList).each(function () {
                        creatorStr += '<option value="' + this.value + '">' + this.name + '</option>'
                    });
                    $("#storageDetail_creator_sel").html(creatorStr);

                    var auditStr = "<option value=''></option>"
                    $(returnData.data.auditorList).each(function () {
                        auditStr += '<option value="' + this.value + '">' + this.name + '</option>'
                    });
                    $("#storageDetail_auditor_sel").html(auditStr);

                    form.render('select');
                } else {
                    layer.msg(returnData.msg, {icon: 3});
                }
            }
        });
    };
});
//判断开始日期是否大于结束日期
function storageDetail_dateCheck_fun(t1,t2) {
    var start = new Date(t1).getTime();
    var end = new Date(t2).getTime();
    if(start > end){
        layer.msg("开始日期不能大于结束日期",{icon:0});
        return false;
    }
    var days = parseInt((end-start) / (1000 * 60 * 60 * 24));
    if(days > 180){
        layer.msg("日期范围超过半年",{icon:0});
        return false;
    }
    return true;
}
