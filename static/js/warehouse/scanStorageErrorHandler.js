layui.use(["admin", "form", "table", "layer", "laytpl", 'laydate', 'upload', 'formSelects', 'element'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        upload = layui.upload,
        laypage = layui.laypage,
        errorTypeEnum = null;
    $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");

    var SCR_errType_ = []; //全局异常类型
    //初始化 异常类型
    // initScanStorageType();

    // function initScanStorageType() {
    //     $.ajax({
    //         type: 'GET',
    //         url: ctx + '/scanErrorHandler/errorRemarkList.html',
    //         dataType: 'json',
    //         async: false,
    //         success: function (res) {
    //             if (res.code == '0000') {
    //                 var errorType = []; //这里用的
    //                 var info = res.data;
    //                 for (var i = 0; i < info.length; i++) {
    //                     var tmp = {};
    //                     tmp.value = info[i];
    //                     tmp.name = info[i];
    //                     errorType.push(tmp);
    //                 }
    //                 formSelects.data('scan_storage_error_type', 'local', {arr: errorType});
    //             } else {
    //                 layer.msg(res.msg)
    //             }
    //         }
    //     });
    // }

    //初始化 点货人员
    initScanStoragePerson();

    function initScanStoragePerson() {
        $.ajax({
            type: 'GET',
            url: ctx + '/scanErrorHandler/scanPersonList.html',
            dataType: 'json',
            async: false,
            success: function (response) {
                if (response.code === '0000') {
                    //定义一个空数组
                    var personArr = [];
                    var info = response.data;
                    for (var i = 0; i < info.length; i++) {
                        var temp = {};
                        temp.value = info[i].id;
                        temp.name = info[i].userName;
                        personArr.push(temp);
                    }
                    //找到这个元素进行渲染
                    formSelects.data('scan_error_scan_person', 'local', {arr: personArr});
                    formSelects.data('scan_error_pur_order_person', 'local', {arr: personArr});
                } else {
                    console.error("初始化点货人员异常-->", response);
                    layer.msg("初始化点货人员服务器内部错误", {icon:"2"});
                }
            },
            error: function (response) {
                console.error("初始化点货人员异常-->", response);
                layer.msg("初始化点货人员服务器内部错误", {icon:"2"});
            }
        });
    }

//渲染时间控件
    laydate.render({
        elem: '#scan_error_checked_time_input',
        range: true
    });
      //每页显示数据条数
      var SCR_limitAllAppoint = 100;
      //当前页数
      var SCR_currentPageAllAppoint = 1;
      //数据总条数
      var SCR_dataLength = 0;

    //监听tab切换来选中不同的tab页
    element.on('tab(scan_storage_error_handler_mark_div)', function (data) {
        //当点击tab切换页签的时候，应该回到第一页
        SCR_currentPageAllAppoint = 1;
        if (data.index === 0) {//待处理
             //修改数据状态
             $("#scan_storage_error_hidden_mark").val(0);
            scan_error_search_button(0);
            $("#batchEnterGoodsDetail").removeClass('disN');
            $("#scan_error_orderRuleName").addClass('disN');
            $("#processStatusList_filter").addClass('disN');
        } else if (data.index === 1) {//已处理
            scan_error_search_button(1);
            //修改数据状态
            $("#scan_storage_error_hidden_mark").val(1);
            $("#batchEnterGoodsDetail").addClass('disN');
            $("#scan_error_orderRuleName").removeClass('disN');
            $("#processStatusList_filter").addClass('disN');
        } else if (data.index === 2) {//作废
            scan_error_search_button(3);
            //修改数据状态
            $("#scan_storage_error_hidden_mark").val(3);
            $("#batchEnterGoodsDetail").addClass('disN');
            $("#scan_error_orderRuleName").addClass('disN');
            $("#processStatusList_filter").addClass('disN');
        }else if(data.index === 3){
            $("#scan_storage_error_hidden_mark").val('');
            $("#batchEnterGoodsDetail").addClass('disN');
            $("#scan_error_orderRuleName").addClass('disN');
            $("#processStatusList_filter").removeClass('disN');
            scan_error_search_button('');
        }
    });

    //搜索触发事件
    $("#scan_error_search_button").click(function () {
        SCR_currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
        SCR_dataLength = 0;
        //获取到当前被选中的页签的下标
        var status = $('#scan_storage_error_hidden_mark').val();
        scan_error_search_button(status);
    });

    scanStoragegetwarehouseData()
    function scanStoragegetwarehouseData(){
        $.ajax({
            type: "POST",
            url: ctx + "/prodWarehouse/getAuthedProdWarehouse.html",
            contentType: 'application/json',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    // var tpl = scanStorageErrorHandlerwarehouse.innerHTML
                    // var warehouseDom = $('#scan_storage_error_form').find('select[name="warehouseId"]')
                    // laytpl(tpl).render(returnData.data, function(html){
                    //     warehouseDom.append(html)
                    //     form.render('select')
                    // });
                    $("#scan_storage_error_form select[name=warehouseId]").html("");
                    $("#scan_storage_error_form select[name=warehouseId]").append('<option value="">请选择</option>');
                    let defaultWarehouseId;
                    $(returnData.data).each(function () {
                        if(this.warehouseName == '义乌仓'){
                            defaultWarehouseId = this.id;
                            $("#scan_storage_error_form select[name=warehouseId]").append("<option value='" + this.id + "' selected >" + this.warehouseName + "</option>");
                        }else {
                            $("#scan_storage_error_form select[name=warehouseId]").append("<option value='" + this.id + "'>" + this.warehouseName + "</option>");
                        }
                    });
                    render_order_build_floor("#scan_storage_error_form",defaultWarehouseId)
                    // $("#stockLocationBindSku_form select[name=warehouseId]").find('option[value=65]').prop('selected', 'true')
                    form.render('select');
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
            complete: function () {
                loading.hide();
            }
        });
    }
    // 获取错货明细选选项
    getErrorGoodsDetail()
    function getErrorGoodsDetail(){
        let params={
            headCode:'ERROR_GOODS_DETAIL',
            cache:true
        }
        commonReturnPromise({
            url: "/lms/sysdict/getBizDictByCode",
            type: "get",
            // contentType: "application/json",
            params: params,
          }).then((res) => {
            console.log(res);
            var tpl = errorGoodsDetailDiv.innerHTML
                var errorDom = $('#scan_storage_error_form').find('select[name="errorGoodsDetail"]')
                laytpl(tpl).render(res, function(html){
                    errorDom.append(html)
                    form.render('select')
                });
          }).catch((res)=>{
            layer.msg(res, { icon: 2 });
          })
    }

    function scan_error_search_button(processStatus) {
        var timeStr = $("#scan_storage_error_form input[name=time]").val();
        var startTime = '';
        var endTime = '';
        if (timeStr) {
            startTime = timeStr.split(" - ")[0] + " 00:00:00";
            endTime = timeStr.split(" - ")[1] + " 23:59:59";
        }
        var dateTypeName = $("#scan_storage_error_form select[name=scan_error_search_type]").val();
        var dateType = 1;
        if (dateTypeName) {
            if (dateTypeName === 'scan_feed_back_time') {
                dateType = 1;
            }
            if (dateTypeName === 'scan_deal_time') {
                dateType = 2;
            }
        }
        var storageNumber = $("#scan_storage_error_form input[name = scan_error_storage_number]").val();
        var scanPersonIds = layui.formSelects.value('scan_error_scan_person', 'valStr') || '';
        var purOrderPersonIds = layui.formSelects.value('scan_error_pur_order_person', 'valStr') || '';
        var errorRemarks = layui.formSelects.value('scan_storage_error_type', 'nameStr')|| '';
        var purErrorFeedbackCode  = $("#scan_storage_error_form select[name = purErrorFeedbackCode]").val();
        // var dealPersonId = $("#scan_storage_error_form input[name = dealPersonId]").val();
        //2020/8/12
        var dealPersonName = $("#scan_storage_error_form input[name = dealPersonName]").val();
        var billNumber = $("#scan_storage_error_form input[name = scan_error_bill_number]").val();
        var skus = $("#scan_storage_error_form input[name = scan_error_sku]").val();
        var warehouseId  = $("#scan_storage_error_form select[name = warehouseId]").val();
        var errorGoodsDetail= $("#scan_storage_error_form select[name = errorGoodsDetail]").val();
        var buildNo= formSelects.value('scan_error_buildNo','valStr');
        var floorNo= formSelects.value('scan_error_floorNo','valStr');
        var orderRuleName= $("#scan_storage_error_form select[name = orderRuleName]").val();
        var processStatusList=layui.formSelects.value('processStatusList', 'valStr').split(',').filter(item=>item!='');
        loading.show();
        let cols=[];
        if(!processStatus&&processStatus!==0){
            cols=[
                {type: 'checkbox', width:30},
                {field: "billNumber", title: "单号",width:"12%",templet:"#bill_storage_number"},//标题栏
                {field: "sku", title: "SKU", templet:'#sku_storage', width:155},
                {field: "skuImgUrl", title: "图片",templet:`<div><img width="60" height="60" data-original="{{ d.skuImgUrl }}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/></div>`},
                {field: "skuName", title: "商品名称",width:"12%"},
                {title: "规格", templet: "#scan_storage_spec"},
                {templet: "#scan_storage_person_pl", title: "人员"},
                {field: "errorTypeName", align: "center", title: "异常",templet:"#error_type_remark",width:'8%'},
                {field: "errorGoodsDetail", align: "center", title: "错货明细",width:'4%'},
                {field: "feedbackNumber", align: "center", title: "累计反馈次数",width:'3%'},
                {field: "teamLeaderRemark", align: "center", title: "备注",edit:'text',event: 'teamLeaderRemarkChange'},
                {field: "remark", align: "center", title: "处理备注"},
                {templet:"#storage_person",align: "center", title: "仓库人员",width:'7%'},
                {templet: "#scan_storage_date_pl", align: "center", title: "时间", width: "10.5%"},
                {title: "状态",align: "center",templet: "#scan_storage_error_handler_status"},
            ];
        }else{
            cols=[
                {type: 'checkbox', width:30},
                {field: "billNumber", title: "单号",width:"12%",templet:"#bill_storage_number"},//标题栏
                {field: "sku", title: "SKU", templet:'#sku_storage', width:155},
                {field: "skuImgUrl", title: "图片",templet:`<div><img width="60" height="60" data-original="{{ d.skuImgUrl }}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/></div>`},
                {field: "skuName", title: "商品名称",width:"12%"},
                {title: "规格", templet: "#scan_storage_spec"},
                {templet: "#scan_storage_person_pl", title: "人员"},
                {field: "errorTypeName", align: "center", title: "异常",templet:"#error_type_remark",width:'8%'},
                {field: "errorGoodsDetail", align: "center", title: "错货明细",width:'4%'},
                {field: "feedbackNumber", align: "center", title: "累计反馈次数",width:'3%'},
                {field: "teamLeaderRemark", align: "center", title: "备注",edit:'text',event: 'teamLeaderRemarkChange'},
                {field: "remark", align: "center", title: "处理备注"},
                {templet:"#storage_person",align: "center", title: "仓库人员",width:'7%'},
                {templet: "#scan_storage_date_pl", align: "center", title: "时间", width: "10.5%"},
                {title: "操作",align: "center",templet: "#scan_storage_error_handler_action"},
            ];
        }
       let params={
                storageNumber: storageNumber,
                scanPersonIds: scanPersonIds,
                errorRemarks: errorRemarks,
                startTime: startTime,
                endTime: endTime,
                dateType: dateType,
                processStatus: processStatus,
                dealPerson: dealPersonName,
                billNumber: billNumber,
                page: SCR_currentPageAllAppoint,
                purOrderPersonIds: purOrderPersonIds,
                skus: skus,
                limit: SCR_limitAllAppoint,
                warehouseId:warehouseId,
                purErrorFeedbackCode:purErrorFeedbackCode,
                errorGoodsDetail:errorGoodsDetail,
                buildNo:buildNo,
                floorNo:floorNo,
                orderRuleName: processStatus=='1'?orderRuleName:null,
            }
        if(processStatus===""){
            params.processStatusList=processStatusList
        }

        $.ajax({
            type: 'post',
            url: ctx + '/errorFeedback/search.html',
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            success: function (res) {
                if(res.code==="0000"){
                    var data = res.data;
                    table.render({
                    elem: '#scan_storage_error_handler_table',
                    id: 'scan_storage_error_handler_table',
                    data: data,
                    limit: data.length,
                    cols: [
                        cols
                    ],
                    done: function () {
                        imageLazyload();
                        const error_numbers = res.extra;
                        let error_need_handle_number=error_numbers[0]||0;
                        let error_handled_number= error_numbers[1]||0;
                        let error_invalid_number= error_numbers[3]||0;
                        let all_status_number=processStatus === "" ? res.count : error_need_handle_number + error_handled_number + error_invalid_number;
                        $('#error_need_handle_number').html(error_need_handle_number);//未处理
                        $('#error_handled_number').html(error_handled_number);//已处理
                        $('#error_invalid_number').html(error_invalid_number);//作废
                        $('#all_status_number').html(all_status_number);//全部
                        table.on("edit(scan_storage_error_handler_table)",
                            function (obj) {
                              const { field, value, data } = obj;
                              if (field === "teamLeaderRemark") {
                                commonReturnPromise({
                                  url: "/lms/errorFeedback/updateTeamLeaderRemark",
                                  type: "post",
                                  contentType: "application/json",
                                  params: JSON.stringify({
                                    bizId: data.purOrderStorageErrorId,
                                    teamLeaderRemark: value,
                                    purErrorFeedbackCode: data.purErrorFeedbackCode,
                                  }),
                                }).then(() => {
                                  layer.msg("操作成功", { icon: 1 });
                                }).catch(()=>{
                                    $("#scan_error_search_button").click()
                                })
                              }
                            }
                        );
                    }
                    });
                    //渲染底部栏
                    laypage.render({
                    elem: 'scan_storage_error_handler_table_div',
                    count: res.count, //数据总数，从服务端得到
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                    limits: [50, 100, 500, 1000],
                    curr: SCR_currentPageAllAppoint,
                    limit: SCR_limitAllAppoint,
                    jump: function (obj, first) {
                        SCR_currentPageAllAppoint = obj.curr;
                        SCR_limitAllAppoint = obj.limit;
                        //首次不执行
                        if (!first) {
                            var type = $("#scan_storage_error_hidden_mark").val();
                            scan_error_search_button(type);
                        }
                    }
                    });
                }else{
                    layer.msg(res.msg,{icon:2});
                }
            },
            error: function (error) {
                layer.msg(error);
            },
            complete: function () {
                loading.hide();
            }
        });
    }

    //ztt20231129-批量打印库位
    $('#scanStorageErrorHandler_printLocationCode').on('click', function(){
      commonTableCksSelected('scan_storage_error_handler_table').then(res => {
        let locationCodeArr = res.map(item => item.locationCode);
        let filteredArr = locationCodeArr.filter(function(ele) {
          return ele && (ele != '' || ele != undefined);
        });
        if(filteredArr.length != locationCodeArr.length){
          return layer.msg('勾选的记录中包含无库位的记录,不执行打印,请检查!', {icon: 7});
        }
        //给打印的数据排序,然后打印
        let sortArr = scehSortArrByFloorAndLocationCode(res);
        //调用库位页面,批量打印库位标签功能
        let printArr = [];
        for(let i=0; i<sortArr.length; i++){
          let item = sortArr[i];
          let obj = {
            locationCode: item.locationCode,
            originalLocationCode: item.originalLocationCode,
            printerName: "10040",
            printNumber: 1,
            onlyPreView: false
          };
          printArr.push(obj);
        }
        //执行打印功能
        epeanPrint_plugin_fun(13,printArr);
      }).catch(err => {
        console.log(err);
        layer.msg(err, {icon:7});
      });
    });
    table.on('checkbox(scan_storage_error_handler_table)', function(obj) {
        // 获取被选中的行数据
        var selectedData = table.checkStatus('scan_storage_error_handler_table').data;
        let ids=selectedData.map(item => item.purOrderStorageErrorId).join(',');
        
        $('#batchEnterGoodsDetail').off('click')
        $('#batchEnterGoodsDetail').on('click', function(){
            if(selectedData.length!=0){
                let error_flag=selectedData.every(function(error_item){
                    return error_item.errorRemark=='错货'
                });
                if(error_flag){
                    let params={
                        headCode:'ERROR_GOODS_DETAIL',
                        cache:true
                    }
                    commonReturnPromise({
                        url: "/lms/sysdict/getBizDictByCode",
                        type: "get",
                        // contentType: "application/json",
                        params: params,
                      }).then((res) => {
                        let option_html="";
                        res.forEach(function(item){
                            option_html+=  `<option value='${item.name}'>${item.name}</option>`;
                        });  
                        // let error_select=`<div style='width:200px;height:60px;color:#000;'>错货明细：<select>${option_html}</select><br><button style='background:#1E9FFF;color:#fff;' id='submitBtn'>提交</button><button id='cancelBtn'>取消</button></div>`;
                        let error_select=`
                        <form class="layui-form">
                            <div class="layui-form-item">
                                <label class="layui-form-label">错货明细</label>
                                <div class="layui-input-block" style="width:300px;">
                                  <select name="errorGoodsDetail" id="batchErrorGoodsSelect">
                                    <option value="">请选择</option>
                                    ${option_html}
                                  </select>
                                </div>
                            </div>
                        </form>
                        `;
                        layer.open({
                            title:'批量录入错货明细',
                            area: ['500px', '40%'],
                            content: error_select,
                            btn: ['提交', '取消'],
                            success: function(layero) {
                                form.render()
                            },
                            yes: function(index, layero){
                                commonReturnPromise({
                                    url: "/lms/errorFeedback/updateErrorGoodsDetail",
                                    type: "post",
                                    contentType: "application/json",
                                    params: JSON.stringify({
                                      id:ids,
                                      errorGoodsDetail:$('#batchErrorGoodsSelect').val()
                                    }),
                                  }).then(() => {
                                    $("#scan_error_search_button").click();
                                    layer.msg("操作成功", { icon: 1 });
                                  }).catch((res)=>{
                                    layer.msg(res, { icon: 2 });
                                  })
                                layer.close(index);
                              }
                        });
                      }).catch((res)=>{
                        layer.msg(res, { icon: 2 });
                      })    
                }else{
                    layer.msg('只有异常明细为错货才能录入！', { icon: 7 });
                }
            }else{
                layer.msg('请勾选数据!', {icon: 7});
            }
          });
      });
      $('#batchEnterGoodsDetail').on('click', function(){
        layer.msg('请勾选数据!', {icon: 7});
      })

    $(document).on('click','.editWarehousing_button',function(){
        let $tr=$(this).parents('tr')
        let prev_storageNumber=$tr.find('.storageNumber_val').text();
        let prev_editWarehousing_html=$(this).parents('.editWarehousing_div').html();
        let editWarehousing_html=`入库：<input type="text" class="editWarehousing_input" value="${prev_storageNumber}" style="width:80%;"> <br>
            <span style='margin-left:38px;color:#1E9FFF;cursor:pointer;' class='submitEditWarehousing_button'>提交</span> <span style='color:#FF5722;cursor:pointer;' class='cancelEditWarehousing_button'>取消</span>`;
        $(this).parents('.editWarehousing_div').html(editWarehousing_html)
        $(".cancelEditWarehousing_button").click(function(){
            $(this).parents('.editWarehousing_div').html(prev_editWarehousing_html);
        });
        $(".submitEditWarehousing_button").click(function(){
            let storageNumber=$(this).parents('.editWarehousing_div').find('.editWarehousing_input').val();
            let params={
                id:$(this).parents('.editWarehousing_div').attr('id_val'),
                sku:$(this).parents('.editWarehousing_div').attr('sku_val'),
                storageNumber:storageNumber
            }
            commonReturnPromise({
                url: "/lms/errorFeedback/updateInStorageOrder",
                type: "post",
                contentType: "application/json",
                params: JSON.stringify(params),
              }).then((res) => {       
                $(this).parents('.editWarehousing_div').html(prev_editWarehousing_html);
                $tr.find('.storageNumber_val').text(storageNumber);
                $tr.find('.billNumber_val').text(res.billNumber);
                $tr.find('.purchaseBuyer_val').text(res.buyer);
                $tr.find('.storageNum_val').text(res.storageNum);
                layer.msg("操作成功", { icon: 1 });
              }).catch((res)=>{
                layer.msg(res, { icon: 2 });
              })
        })
    })
    //ztt20231129-前端根据楼栋(数字)+楼层(数字)+库位(ASCII码)排序{buildingNo, floorNo, locationCode} 
    function scehSortArrByFloorAndLocationCode(arr){
      //步骤一: 根据楼栋排序
      //步骤二: 在楼栋排序的基础上,根据楼层排序
      //步骤三: 在楼栋+楼层的基础上,根据库位排序
      arr.sort(function(a, b) {
        if (a.buildingNo !== b.buildingNo) {
          return a.buildingNo - b.buildingNo;
        } else if (a.floorNo !== b.floorNo) {
          return a.floorNo - b.floorNo;
        } else {
          return a.locationCode.localeCompare(b.locationCode);
        }
      });
      return arr;
    }

    //修改发送状态请求
    function send_ajax(index, layero, changeType, data) {
        var send = {};
        send.purOrderStorageErrorId = data.purOrderStorageErrorId;
        send.changeType = changeType;
        send.currentType = data.processStatus;
        if (data.remark && data.remark.trim() !=='') {
            send.remark = data.remark;
        }
        $.ajax({
            type: "POST",
            url: ctx + "/scanErrorHandler/changeStatus.html",
            data: JSON.stringify(send),
            contentType: 'application/json',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.close(index);
                    layer.msg(returnData.msg);
                    var type = $("#scan_storage_error_hidden_mark").val();
                    scan_error_search_button(type);
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function (returnData) {
                console.error("send change--->", returnData);
                layer.msg("服务器正忙");
            }, complete: function () {
                loading.hide();
            }
        });
    }

    //处理
    function auditErrorHandler(data,func){
        $.ajax({
            type: "POST",
            url: ctx + "/errorFeedback/auditError.html",
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    if(func){
                        func(returnData)
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function (returnData) {
                console.error("send change--->", returnData);
                layer.msg("服务器正忙");
            }, complete: function () {
                loading.hide();
            }
        });
    }

    
    //作废
    function invalidErrorHandler(data,func){
        $.ajax({
            type: "POST",
            url: ctx + "/errorFeedback/invalidError.html",
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    if(func){
                        func(returnData)
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function (returnData) {
                console.error("send change--->", returnData);
                layer.msg("服务器正忙");
            }, complete: function () {
                loading.hide();
            }
        });
    }

    //行事件
    table.on("tool(scan_storage_error_handler_table)", function (obj) {
        var data = obj.data;
        if (obj.event === 'scan_storage_error_handler_deal_event') {
            if(obj.data.errorRemark=='错货'){
                if(obj.data.errorGoodsDetail&&obj.data.errorGoodsDetail!=''){
                    //处理
                    layer.open({
                        type: 1,
                        title: "处理",
                        area: ["600px", "300px"],
                        btn: ["确定", "取消"],
                        content: '<div><div style="padding:20px;"><textarea type="text"  class="layui-textarea" id="handler_deal_text_id"></textarea></div></div>',
                        yes: function (index, layero) {
                            var remark = layero.find("#handler_deal_text_id").val(),
                            changeType=1;
                            const {processStatus,purErrorFeedbackCode,purOrderStorageErrorId,storageNumber} = data
                            var currentType = processStatus
                            auditErrorHandler({currentType,purErrorFeedbackCode,purOrderStorageErrorId,storageNumber,changeType,remark},
                                function(returnData){
                                    layer.close(index);
                                    layer.msg(returnData.msg||'审核成功');
                                    var type = $("#scan_storage_error_hidden_mark").val();
                                    scan_error_search_button(type);
                                });
                        }
                    });
                }else{
                    layer.msg('未填写错货明细暂不处理',{icon:7});
                }
            }else{
                layer.open({
                    type: 1,
                    title: "处理",
                    area: ["600px", "300px"],
                    btn: ["确定", "取消"],
                    content: '<div><div style="padding:20px;"><textarea type="text"  class="layui-textarea" id="handler_deal_text_id"></textarea></div></div>',
                    yes: function (index, layero) {
                        var remark = layero.find("#handler_deal_text_id").val(),
                        changeType=1;
                        const {processStatus,purErrorFeedbackCode,purOrderStorageErrorId,storageNumber} = data
                        var currentType = processStatus
                        auditErrorHandler({currentType,purErrorFeedbackCode,purOrderStorageErrorId,storageNumber,changeType,remark},
                            function(returnData){
                                layer.close(index);
                                layer.msg(returnData.msg||'审核成功');
                                var type = $("#scan_storage_error_hidden_mark").val();
                                scan_error_search_button(type);
                            });
                    }
                });
            }
        } else if (obj.event === 'scan_storage_error_handler_invalid_event') {
            //作废
            layer.open({
                type: 1,
                title: "作废",
                area: ["230px", "210px"],
                btn: ["确定", "取消"],
                content: '<div><div style="width: 100%;height: 100px;display: flex;justify-content: center;align-items: center;line-height: 100%">确定执行作废？</div></div>',
                yes: function (index, layero) {
                    var changeType=3;
                    const {processStatus,purErrorFeedbackCode,purOrderStorageErrorId,storageNumber} = data
                    var currentType = processStatus
                    invalidErrorHandler({currentType,purErrorFeedbackCode,purOrderStorageErrorId,storageNumber,changeType},
                        function(returnData){
                            layer.close(index);
                            layer.msg(returnData.msg||'作废成功');
                            var type = $("#scan_storage_error_hidden_mark").val();
                            scan_error_search_button(type);
                        });
                }
            });
        }else if(obj.event === 'scan_storage_error_batchEnterGoodsDetail_event'){
            if(obj.data.errorRemark=='错货'){     
                let params={
                    headCode:'ERROR_GOODS_DETAIL',
                    cache:true
                }
                commonReturnPromise({
                    url: "/lms/sysdict/getBizDictByCode",
                    type: "get",
                    // contentType: "application/json",
                    params: params,
                  }).then((res) => {
                    let option_html="";
                    res.forEach(function(item){
                        option_html+=  `<option value='${item.name}'>${item.name}</option>`;
                    });  
                    // let error_select=`<div style='width:200px;height:60px;color:#000;'>错货明细：<select>${option_html}</select><br><button style='background:#1E9FFF;color:#fff;' id='submitBtn'>提交</button><button id='cancelBtn'>取消</button></div>`;
                    let error_select=`
                    <form class="layui-form">
                        <div class="layui-form-item">
                            <label class="layui-form-label">错货明细</label>
                            <div class="layui-input-block" style="width:300px;">
                              <select name="errorGoodsDetail" id="batchErrorGoodsSelect">
                                <option value="">请选择</option>
                                ${option_html}
                              </select>
                            </div>
                        </div>
                    </form>
                    `;
                    layer.open({
                        title:'录入错货明细',
                        content: error_select,
                        area: ['500px', '40%'],
                        btn: ['提交', '取消'],
                        success: function(layero) {
                            form.render()
                        },
                        yes: function(index, layero){
                            commonReturnPromise({
                                url: "/lms/errorFeedback/updateErrorGoodsDetail",
                                type: "post",
                                contentType: "application/json",
                                params: JSON.stringify({
                                  id:data.purOrderStorageErrorId,
                                  errorGoodsDetail:$('#batchErrorGoodsSelect').val()
                                }),
                              }).then(() => {
                                $("#scan_error_search_button").click();
                                layer.msg("操作成功", { icon: 1 });
                              }).catch((res)=>{
                                layer.msg(res, { icon: 2 });
                              })
                            layer.close(index);
                          }
                    });
                  }).catch((res)=>{
                    layer.msg(res, { icon: 2 });
                  })    
            }else{
                layer.msg('只有异常明细为错货才能录入！', { icon: 7 });
            }
        }
    });

    getErrorTypeEnum(function(returnData){
        errorTypeEnum = returnData.data
        var errorTypeArr =[]
        for(var i in errorTypeEnum){
            errorTypeArr.push({id:errorTypeEnum[i].purErrorFeedbackCode,name:errorTypeEnum[i].name})
        }
        appendSelect($('#scan_storage_error_form').find('select[name="purErrorFeedbackCode"]'),errorTypeArr,'id','name')
        form.render()
    })

    form.on('select(purErrorFeedbackCode)',function(obj){
        var purErrorFeedbackCodeObj ={'1':'PURCHASE_SCAN_ERROR_TYPE','3':'SCAN_STORAGE_FEED_ERROR_TYPE','2':'SHELF_FEED_ERROR_TYPE' ,'4' : 'WH_INSPECTION_ERROR','5' : 'WAREHOUSE_DELIVERY_PROBLEM'}
        var value = purErrorFeedbackCodeObj[obj.value]
        var data = errorTypeEnum[value]
        appendSelect($('#scan_storage_error_form').find('select[_name="errorRemarks"]'),data.list,'name','name')
        formSelects.render('scan_storage_error_type') 
    })

    function getErrorTypeEnum(func){
        $.ajax({
            type: "GET",
            url: ctx + "/errorFeedback/searchBizDict.html",
            data: {},
            contentType: 'application/json',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    if(func){
                        func(returnData)
                    }
                }
            },
            error: function (returnData) {
                console.error("send change--->", returnData);
                layer.msg("服务器正忙");
            }, complete: function () {
                loading.hide();
            }
        });
    }
    //
    // 远程搜索功能
    var dim_detail_person_Id = new DimSearch('#scan_storage_error_deal_person_Id', 'dealPersonId',
        {
            url: '/skuLocationTransfer/getConsigneeUserList.html',
            type: 'get',
            query: 'search',
            label: 'userName',
            isIncludeData: true,
            name: '.dimResultDivDealPersonName'
        });
    dim_detail_person_Id.init();
        //填充下拉框
        function appendSelect(aDom, data, code, label) {
            aDom.empty();
            var option = '<option value="">请选择</option>'
            for (var i in data) {
                if (typeof data[i] !== 'string') {

                        data[i].code = data[i][code].toString() || data[i].code
                    data[i].label = data[i][label] || data[i].label;
                }
                option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
            }
            aDom.append(option)
        }
    });