/**上架统计明细**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate","formSelects", "element"], function () {
    var layer = layui.layer,
        table = layui.table,
        element = layui.element,
        form = layui.form,
        formSelects = layui.formSelects,
        laydate = layui.laydate;

    //时间渲染
    laydate.render({ elem: '#shelves_auditTime_input', range: true, type: 'datetime' });
    /**初始化下拉框数据**/
    $.ajax({
        url: ctx + "/shelvesCount/getScanloadPageEnum.html",
        type: 'post',
        dataType: 'json',
        success: function (returnData) {
            if (returnData.code == "0000") {
                var str = "<option value=''></option>"
                $(returnData.data.buyerList).each(function () {
                    str += '<option value="' + this.value + '">' + this.name + '</option>'
                });
                $("#shelves_auditor").html(str);
                form.render('select');
            } else {
                layer.msg(returnData.msg, { icon: 3 });
            }
        }
    });
    /**初始化下拉框仓库数据**/
    shelves_initWarehouse()
    function shelves_initWarehouse() {
        commonReturnPromise({
            url: ctx + '/prodWarehouse/getAuthedProdWarehouse.html',
            type: 'post',
        }).then(data => {
            commonRenderSelect('shelves_warehouse', data, { name: 'warehouseName', code: 'id' }).then(()=>{
              formSelects.render('shelves_warehouse');
            });
        }).then(() =>
            form.render()
        ).catch(err => layer.msg(err || err.msg, { icon: 3 }))
    }

    shelves_setLatestMonth();
    //查询渲染表格
    $("#shelves_search_btn").click(function () {
        shelves_count_fun();
    });
    /**监听tab选项卡切换**/
    element.on('tab(shelves_tab)', function (data) {
        shelves_count_fun();
    });

    /**根据条件统计收货包裹**/
    function shelves_count_fun() {
        var data = shelves_getSeacrhData();
        if (data.startDate == null || data.startDate == '') {
            layer.msg("请选择日期", { icon: 0 })
            return false;
        }
        table.render({
            elem: '#shelves_data_table',
            url: ctx + "/shelvesCount/countShelvesAuditInfoByDto.html",
            page: false, //开启分页
            method: 'post',
            where: data,
            cols: [
                [ //表头
                    { field: 'auditor', title: '审核人员' },
                    { field: 'deptName', title: '审核部门', },
                    { field: 'days', title: '审核日期', },
                    { field: 'dayOfWeek', title: '星期几', },
                    { field: 'auditNum', sort: true, title: '审核入库单数量', },
                    { field: 'auditSkuTimes', sort: true, title: '审核SKU次数' },
                    { field: 'storageNumCount', sort: true, title: '审核入库商品数量' },
                ]
            ],
            done: function (res, curr, count) {
                if (res.code == '0000') {
                    $("#shelves_total_num").html(count);
                } else {
                    layer.msg(res.msg, { icon: 0 });
                }
            }
        });
    }
    //导出收货包裹统计
    $("#shelves_export_btn").click(function () {
        var data = shelves_getSeacrhData();
        if (data.startDate == null || data.startDate == '') {
            layer.msg("请选择日期", { icon: 0 })
            return false;
        }
        if (!shelves_dateCheck_fun(data.startDate, data.endDate)) {
            return;
        }
        var confirmindex = layer.confirm('确认导出当前搜索条件下的上架统计信息？', { btn: ['确认', '取消'] }, function () {
            submitForm(data, ctx + '/shelvesCount/exportShelvesAuditInfo.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    });
    /**获取收货包裹统计页面查询参数**/
    function shelves_getSeacrhData() {
        var data = serializeObject($('#shelves_search_form'));
        var dateTimeStr = $.trim(data.startAndEndTime);
        if (dateTimeStr != null && dateTimeStr != '') {
            data.startDate = dateTimeStr.split(" - ")[0];
            data.endDate = dateTimeStr.split(" - ")[1];
        }
        if(data.storeId && data.storeId.length>0){
          let storeIdArr = layui.formSelects.value('shelves_warehouse');
          let storeIdList = storeIdArr.map(item => item.val);
          data.storeIdList = storeIdList.join(',');
        }else{
          data.storeIdList = '';
        }
        delete data.storeId;
        return data;
    }
    /**
     * 获取当前月份
     */
    function shelves_setLatestMonth() {
        var createTimeEnd = Format(new Date(), 'yyyy-MM-dd hh:mm:ss');
        var createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd hh:mm:ss');
        $('#shelves_auditTime_input').val(createTimeStart + ' - ' + createTimeEnd);
    };
});
//判断开始日期是否大于结束日期
function shelves_dateCheck_fun(t1, t2) {
    var start = new Date(t1).getTime();
    var end = new Date(t2).getTime();
    if (start > end) {
        layer.msg("开始日期不能大于结束日期", { icon: 0 });
        return false;
    }
    var days = parseInt((end - start) / (1000 * 60 * 60 * 24));
    if (days > 180) {
        layer.msg("日期范围超过半年", { icon: 0 });
        return false;
    }
    return true;
}
