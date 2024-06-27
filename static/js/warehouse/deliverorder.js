layui.use(['admin','form','table','layer','formSelects','laydate'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    form.render('select');
    //绑定时间
    var nowDate = Format(Date.now(), 'yyyy-MM-dd');
    var nowDate_range = nowDate +' - '+nowDate;
    $('#deliverorder_createTime').val(nowDate_range);
    laydate.render({
        elem: '#deliverorder_createTime', //指定元素
        range: true
    });


    //监听tabs点击事件
    element.on('tab(deliverorder-tabs)', function(data){
       if(data.index === 0){ //未生成
           $('#agentCompany').addClass('disN');
           $('#logisticsCompany').removeClass('disN');
           $('#warehouseInvoiceNo').addClass('disN');
           $('#expressTypeStatus').addClass('disN');
           $('#deliverorder_newAdd').addClass('disN');
           $('#invoice_detail_newAdd').removeClass('disN');
           $('#invoice_main_newAdd').removeClass('disN');
           $('#deliverorder_status').val('not generated');
           $('[lay-filter="deliverorder_submit"]').trigger('click');
       }
        if(data.index === 1){ //正常单
            $('#agentCompany').removeClass('disN');
            $('#logisticsCompany').addClass('disN');
            $('#warehouseInvoiceNo').removeClass('disN');
            $('#expressTypeStatus').removeClass('disN');
            $('#deliverorder_newAdd').removeClass('disN');
            $('#invoice_detail_newAdd').addClass('disN');
            $('#invoice_main_newAdd').addClass('disN');
            $('#deliverorder_status').val('true');
            $('[lay-filter="deliverorder_submit"]').trigger('click');
        }
        if(data.index === 2){ //作废单
            $('#agentCompany').removeClass('disN');
            $('#logisticsCompany').addClass('disN');
            $('#warehouseInvoiceNo').removeClass('disN');
            $('#expressTypeStatus').removeClass('disN');
            $('#deliverorder_newAdd').removeClass('disN');
            $('#invoice_detail_newAdd').addClass('disN');
            $('#invoice_main_newAdd').addClass('disN');
            $('#deliverorder_status').val('false');
            $('[lay-filter="deliverorder_submit"]').trigger('click');
        }
    });
    
    
    //发货单命名空间
    var deliverorderName = {
        getCompany: function(){ //获取货代公司
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/sysdict/searchBizDict.html',
                    data: {
                            headId: 48,
                            limit: 1000
                    },
                    success: function(res){
                        if(res.code === '0000'){
                            resolve(res.data)
                        }else {
                            reject('code!=0000:'+res.data)
                        }
                    },
                    error: function(){
                        reject('error:服务器请求失败')
                    }
                })
            })
        },
        getExpressCompany: function(){ //获取快递公司
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/sysdict/searchBizDict.html',
                    data: {
                        headId: 53,
                        limit: 1000
                    },
                    success: function(res){
                        if(res.code === '0000'){
                            resolve(res.data)
                        }else {
                            reject('code!=0000:'+res.data)
                        }
                    },
                    error: function(){
                        reject('error:服务器请求失败')
                    }
                })
            })
        },
        renderCompany: function(id){ //渲染货代公司
            var defaultSel = '';
            if(localStorage.getItem('cacheData')){
                var cacheData = JSON.parse(localStorage.getItem('cacheData'));
                defaultSel = cacheData.select;
            }
            //渲染货代公司
            let optStr = '<option value="">全部</option>';
            this.getCompany().then(result => {
                for(let [index, value] of result.entries()){
                    if(value.name != defaultSel){
                        optStr +=`<option value="${value.name}">${value.name}</option>`;
                    }else{
                        optStr +=`<option value="${value.name}" selected>${value.name}</option>`;
                    }
                }
                $('#'+id).html(optStr);
                form.render('select');
            });
        },
        renderExpressCompany: function(id){ //渲染快递公司
            var defaultSel = '';
            if(localStorage.getItem('cacheData')){
                var cacheData = JSON.parse(localStorage.getItem('cacheData'));
                defaultSel = cacheData.select;
            }
            //渲染快递公司
            let optStr = '<option value=""></option>';
            this.getExpressCompany().then(result => {
                for(let [index, value] of result.entries()){
                    if(value.name != defaultSel){
                        optStr +=`<option value="${value.code}">${value.name}</option>`;
                    }else{
                        optStr +=`<option value="${value.code}" selected>${value.name}</option>`;
                    }
                }
                $('#'+id).html(optStr);
                form.render('select');
            });
        },
        dataHandle: function(data){ //表单提交前的数据处理
            var orderStatus, startTime, endTime,deliveryType,expressNoStatus;
            if(data.status === 'true'){
                orderStatus = true
            }else{
                orderStatus = false
            }
            if(data.deliverorder_createTime){
                var timeArr =data.deliverorder_createTime.split(' - ');
                startTime = timeArr[0];
                endTime = timeArr[1];
            }else {
                startTime = '';
                endTime = '';
            }
            deliveryType = $('#delivery_type').val();
            expressNoStatus = $("#express_status option:selected").text();
            var obj = Object.assign(data,
                {status: orderStatus,
                startTime: startTime,
                endTime: endTime,
                deliveryType:deliveryType,
                expressNo:data.express_no,
                expressNoStatus:expressNoStatus});
            delete obj.deliverorder_createTime;
            delete obj.express_no;
            return obj;
        },
        tableRender: function(data,status){
            var _this = this;
            if(status === 'not generated'){
                table.render({
                    elem: '#deliverorder_table',
                    method: 'post',
                    url: '/lms/warehouse/invoice/queryNotGenerateInvoice.html',
                    where:  data,
                    page: true,
                    id: "logisticsMode_tableId",
                    limits: [50, 100, 300],
                    limit: 50,
                    cols: [
                        [
                            {type: 'checkbox', width: 30},
                            {title: '包裹号', field: 'packageNo'},
                            {title: '物流方式', field: 'logisticsTypeName'},
                            {title: '物流公司', field: 'logisticsCompany'},
                            {title: '重量', field: 'packageWeight'},
                            {title: '备注', field: 'remark'},
                            {title: '操作',toolbar: '#invoiceDetail_tableIdBar', width: 182}
                        ]
                    ],
                    done: function(res){
                        _this.watchBar();
                        $('#deliverorder-tabs').find('li>span').html('');
                        $('#deliverorder-tabs').find('li.layui-this>span').html(`(${res.count})`);
                    }
                });
            }else {
                table.render({
                    elem: '#deliverorder_table',
                    method: 'post',
                    url: '/lms/warehouse/invoice/queryInvoiceMain.html',
                    where:  data,
                    page: true,
                    id: "logisticsMode_tableId",
                    limits: [50, 100, 300],
                    limit: 50,
                    cols: [
                        [
                            {title: '发货单', field: 'invoiceNo'},
                            {title: '货代公司', field: 'agentCompany'},
                            {title: '包裹数', field: 'totalPackage'},
                            {title: '总重量(kg)', field: 'totalWeight'},
                            {title: '发货方式', field: 'deliveryType',templet:"#deliver_type_templet"},
                            {title: '快递公司', field: 'expressCompany'},
                            {title: '快递单号', field: 'expressNo'},
                            {title: '快递状态', field: 'expressNoStatus',templet:"#deliver_status_templet"},
                            {title: '发货时间', field: 'createtime',sort: true,templet: `<div>{{Format(d.createTime,'yyyy-MM-dd')}}</div>`},
                            {title: '操作',toolbar: '#deliverorder_tableIdBar', width: 182}
                        ]
                    ],
                    done: function(res){
                        _this.watchBar();
                        $('#deliverorder-tabs').find('li>span').html('');
                        $('#deliverorder-tabs').find('li.layui-this>span').html(`(${res.count})`);
                    }
                });
            }
        },
         //表格工具条开始
        watchBar: function(){
          var _this = this;
          table.on('tool(deliverorder_tableFilter)', function(obj){
              var data = obj.data;
              if(obj.event == 'abandon' || obj.event == 'normal'){ //作废订单或者转正常单
                var id = data.id;
                var status = data.status;
               _this.orderProcess(id, !status);
              }else if(obj.event=== 'detail'){
                var id = data.id;
                _this.detailRender(id);
              }else if(obj.event=== 'delete'){
                  var id = data.id;
                  _this.deleteDetail(id);
              }else if(obj.event=== 'export'){
                  var id = data.id;
                  _this.exportInvoiceDetail(id);
              }
          })
        },
        detailRender: function(id){
            var _this = this;
            var index = layer.open({
                type: 1,
                title: '发货单详情',
                btn: ['保存','保存并打印', '关闭'],
                area: ['1100px', '600px'],
                content: $('#deliverorder_newAddLayer').html(),
                success: function(layero,index){
                    var packageNo = layero.find('[name=add_packageNo]');
                    var weig = layero.find('[name=add_weight]');
                    var $sel = layero.find('#add_agentCompany');
                    var $tbody = layero.find('#add_deliverorder_tbody');
                    var $expressCompany = layero.find('#add_expressCompany');
                    var $expressNo = layero.find('#add_expressNo');
                    //货代公司
                    _this.renderCompany('add_agentCompany');
                    //快递公司
                    _this.renderExpressCompany('add_expressCompany');
                    //渲染表格和初始化货代公司
                    _this.getDetailInfo(id).then(function(data){
                        //回显select
                        setTimeout(function(){
                            var company = data[0].agentCompany;
                            $expressCompany.val(data[0].expressCompanyCode);
                            $expressNo.val(data[0].expressNo);
                            $sel.val(company);
                            form.render('select');
                        },200);
                        //循环表格
                        for(var i=0; i<data.length; i++){
                            var item= data[i];
                            var $tr = `<tr>
                                    <td>${(i+1)}</td>
                                    <td>${item.packageNo}</td>
                                    <td>${item.packageWeight}</td>
                                    <td width="50"><a type="button" class="layui-btn layui-btn-sm add_delete">删除</a></td>
                                </tr>`;
                            $tbody.prepend($tr);
                        }
                        //包裹号输入框绑定回车事件
                        packageNo.on('keypress', function(e){
                            e.stopPropagation();
                            if(e.keyCode === 13){
                                if($(this).val().trim()){
                                weig.focus();
                                }else{
                                layer.msg('本地扫描未获取到值,请重新扫描');
                                return;
                                }
                            }
                        });
                        //重量点击事件
                        var count  = localStorage.getItem("tableCount") || data.length;
                        weig.on('keypress', function(e){
                            e.stopPropagation();
                            if(e.keyCode === 13){
                                if($(this).val().trim() && packageNo.val().trim() && $sel.val().trim()){
                                   //给表格插入一条数据
                                   count++;
                                   var $tr = `<tr>
                                                <td>${count}</td>
                                                <td>${packageNo.val()}</td>
                                                <td>${weig.val()}</td>
                                                <td width="50"><a type="button" class="layui-btn layui-btn-sm add_delete">删除</a></td>
                                            </tr>`;
                                    $tbody.prepend($tr); //每一个元素都插入前面
                                    localStorage.setItem("tableCount", count);
                                    packageNo.val('');
                                    weig.val('');
                                    packageNo.focus();
                                }else{
                                   layer.msg('货代公司/重量/包裹号都不能为空');
                                   return;
                                }
                            }
                        });
                        $tbody.on('click', '.add_delete', function(){
                           $(this).parents('tr').remove();
                        })  
                        
                    });
                },
                yes: function(index, layero){
                    _this.detailSave(layero, id).then(function(res){
                       if(res == '请求成功'){
                            layer.msg('保存成功!');
                            layer.close(index);
                            //初始化触发搜索事件
                            $('[lay-filter="deliverorder_submit"]').trigger('click');
                       };
                    }).catch(function(reason){
                        layer.msg(reason);
                    })
                },
                btn2: function(index, layero){
                    _this.detailSave(layero, id).then(function(res){
                        if(res == '请求成功'){
                            window.open(ctx + '/static/html/deliverprint.html?id='+id, '_blank');
                            console.log('保存且打印');
                        }
                    }).catch(function(reason){
                        layer.msg(reason);
                    })
                    return false;
                }

            })
        },
        detailSaveData: function(layero, id){ //详情保存的数据
            // console.log('数据处理');
            var $tbody = layero.find('#add_deliverorder_tbody');
            var $sel = layero.find('#add_agentCompany');
            var $selVal = $sel.val();
            var $trs = $tbody.find('tr');
            var $expressCompanyCode = layero.find('#add_expressCompany').val();
            var $expressCompany = $("#add_expressCompany option:selected").text();
            var $expressNo =  layero.find('#add_expressNo').val();
            if(!$selVal.trim() || !$trs.length){
                return layer.msg('货代公司和发货单列表不能为空!');
            };
            if(($expressCompanyCode.trim() && !$expressNo.trim()) || (!$expressCompanyCode.trim() && $expressNo.trim())){
                return layer.msg('快递公司和快递单号都需要填写!');
            }
            var tableArr = [];
            for(var i=0; i< $trs.length; i++){
                var trObj = {};
                var item = $trs[i];
                trObj.agentCompany = $selVal;
                trObj.invoiceNoId = id;
                trObj.packageNo = $(item).find('td:nth-child(2)').text().trim();
                trObj.packageWeight = $(item).find('td:nth-child(3)').text().trim();
                trObj.expressCompany = $expressCompany;
                trObj.expressCompanyCode = $expressCompanyCode;
                trObj.expressNo = $expressNo;
                tableArr.push(trObj);
            }
            return tableArr;

        },
        detailSave: function(layero, id){
            var _this = this;
            return new Promise(function(resolve, reject){
              var saveData = _this.detailSaveData(layero, id);
              $.ajax({
                type: 'post',
                url: '/lms/warehouse/invoice/updateDetail.html',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(saveData),
                beforeSend: function(){
                  if(Object.prototype.toString.call(saveData) !== '[object Array]'){
                        return false;
                  }
                },
                success: function(res){
                    if(res.code == '0000'){
                        resolve('请求成功');
                    }else{
                        reject('请求失败');
                    }
                },
                error: function(){
                    reject('服务器错误');
                }
              })
           });
        },
        getDetailInfo: function(id){ //查询发货单详情(根据id)
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    url: '/lms/warehouse/invoice/queryInvoiceDetail.html?id='+id,
                    dataType: 'json',
                    success: function(res){
                        if(res.code == '0000'){
                            resolve(res.data);
                        }else{
                            reject(res.msg || '发送请求失败!');
                        }
                    },
                    error: function(){
                        reject('服务器出错');
                    }
                })
            })
        },
        orderProcess: function(id, status){ //正常单和作废单转换
            var processHandle = function(){
                $.ajax({
                    type: 'get',
                    url: '/lms/warehouse/invoice/updateInvoiceStatus.html',
                    dataType: 'json',
                    data: {
                        id: id,
                        status: status
                    },
                    success: function(res){
                        if(res.code== '0000'){
                            layer.msg('操作成功');
                            //初始化触发搜索事件
                            $('[lay-filter="deliverorder_submit"]').trigger('click');
                        }else {
                            layer.msg(res.msg);
                        }
                    }
                })
            };
            if(status){
                layer.confirm('确定将该作废单转正常吗?', {icon: 3, title:'提示'}, function(index){
                    processHandle();
                    layer.close(index);
                });
            }else{
                layer.confirm('确定将该发货单作废吗?', {icon: 3, title:'提示'}, function(index){
                    processHandle();
                    layer.close(index);
                });
            }
            
        },
        //表格工具条结束

        // 新增发货单开始
        newAddHandle: function(){ //新增发货单
            var _this = this;
            $('#deliverorder_newAdd').on('click', function(){
                var index = layer.open({
                    type: 1,
                    title: '新增发货单',
                    btn: ['保存并打印', '关闭'],
                    area: ['1100px', '600px'],
                    content: $('#deliverorder_newAddLayer').html(),
                    success: function(layero,index){
                        //货代公司
                        _this.renderCompany('add_agentCompany');
                        //快递公司
                        _this.renderExpressCompany('add_expressCompany');
                        //逻辑处理
                        _this.addLogicHandle(layero);
                        
                    },
                    yes: function(index, layero){ //保存功能
                        _this.addSubmitHandle(layero).then(function(res){
                            if(res.data){
                                layer.msg('新增发货单成功');
                                layer.close(index);
                                $('[lay-filter="deliverorder_submit"]').trigger('click');
                                window.open(ctx + '/static/html/deliverprint.html?id='+res.data, '_blank');
                                //保存按钮清掉缓存数据
                                localStorage.removeItem('cacheData');
                            }
                        });
                    },
                    end: function(){ //销毁弹框的时候清除localstorage
                        localStorage.removeItem('tableCount');
                    },
                    btn2: function(index, layero){
                        _this.addCache(layero);
                    },
                    cancel: function(index, layero){
                        _this.addCache(layero);
                    }
                })
            })
        },
        //新增弹框的逻辑处理
        addLogicHandle: function(layero){ 
            //写入一个localstorage数据
            localStorage.setItem("tableCount", 0);
            var packageNo = layero.find('[name=add_packageNo]');
            var weig = layero.find('[name=add_weight]');
            var $sel = layero.find('#add_agentCompany');
            var $tbody = layero.find('#add_deliverorder_tbody');
            //判断有没有缓存
            setTimeout(function(){
                if(localStorage.getItem('cacheData')){
                    var cacheData = JSON.parse(localStorage.getItem('cacheData'));
                    for(var j=0; j<cacheData.tbody.length; j++){
                        var itemJ = cacheData.tbody[j];
                        $tbody.append($(itemJ));
                    }
                }
            }, 100);
            //包裹号输入框绑定回车事件
            packageNo.on('keypress', function(e){
                e.stopPropagation();
                if(e.keyCode === 13){
                    if($(this).val().trim()){
                       weig.focus();
                    }else{
                       layer.msg('本地扫描未获取到值,请重新扫描');
                       return;
                    }
                }
            });
            //重量回车事件
            var tableCount = localStorage.getItem("tableCount");
            weig.on('keypress', function(e){
                e.stopPropagation();
                if(e.keyCode === 13){
                    if($(this).val().trim() && packageNo.val().trim() && $sel.val().trim()){
                       //给表格插入一条数据
                       tableCount++;
                       var $tr = `<tr>
                                    <td>${tableCount}</td>
                                    <td>${packageNo.val()}</td>
                                    <td>${weig.val()}</td>
                                    <td width="50"><a type="button" class="layui-btn layui-btn-sm add_delete">删除</a></td>
                                </tr>`;
                        $tbody.prepend($tr); //每一个元素都插入前面
                        localStorage.setItem("tableCount", tableCount);
                        packageNo.val('');
                        weig.val('');
                        packageNo.focus();
                    }else{
                       layer.msg('货代公司/重量/包裹号都不能为空');
                       return;
                    }
                }
            });
            $tbody.on('click', '.add_delete', function(){
               $(this).parents('tr').remove();
            })       
        },
        //新增发货单数据处理
        addSubmitData: function(layero){ 
            var $selVal = layero.find('#add_agentCompany').val();
            var $expressCompanyCode = layero.find('#add_expressCompany').val();
            var $expressCompany = $("#add_expressCompany option:selected").text();
            var $expressNo =  layero.find('#add_expressNo').val();
            var $trs = layero.find('#add_deliverorder_tbody > tr');
            if(!$selVal.trim() || !$trs.length){
                return layer.msg('货代公司和发货单列表不能为空!')
            }
            if(($expressCompanyCode.trim() && !$expressNo.trim()) || (!$expressCompanyCode.trim() && $expressNo.trim())){
                return layer.msg('快递公司和快递单号都需要填写!')
            }
            var tableArr = [];
            for(var i=0; i< $trs.length; i++){
                var trObj = {};
                var item = $trs[i];
                trObj.agentCompany = $selVal;
                trObj.packageNo = $(item).find('td:nth-child(2)').text().trim();
                trObj.packageWeight = $(item).find('td:nth-child(3)').text().trim();
                trObj.expressCompany = $expressCompany;
                trObj.expressCompanyCode = $expressCompanyCode;
                trObj.expressNo = $expressNo;
                tableArr.push(trObj);
            }
            return tableArr;
        },
        addSubmitHandle: function(layero){
            var _this = this;
            return new Promise(function(resolve, reject){
                var dataArr = _this.addSubmitData(layero);
                $.ajax({
                    url: '/lms/warehouse/invoice/insert.html',
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(dataArr),
                    beforeSend: function(){
                        if(Object.prototype.toString.call(dataArr) !== '[object Array]'){
                              return false;
                        }
                      },
                    success: function(res){
                        if(res.code == '0000'){
                            resolve(res);
                        }else {
                            reject(res.msg);
                        }
                    },
                    error: function(){
                        reject('服务器错误...');
                    }
                })
            })
        },
        //新增发货单结束
        //新增发货单的数据缓存
        addCache: function(layero){
            var $selVal = layero.find('#add_agentCompany').val();
            var $trs = layero.find('#add_deliverorder_tbody>tr');
            var tdArr=[];
            for(var i=0; i< $trs.length; i++){
                var item = $($trs[i])[0].outerHTML;
                tdArr.push(item);
            };
            var cacheObj = {
                select: $selVal,
                tbody: tdArr
            };
            localStorage.setItem('cacheData', JSON.stringify(cacheObj));
        },


        //获取物流公司数据
        getLogisticsCompany:function (){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/warehouse/invoice/init.html',
                    success: function(res){
                        if(res.code === '0000'){
                            resolve(res.data)
                        }else {
                            reject('code!=0000:'+res.data)
                        }
                    },
                    error: function(){
                        reject('error:服务器请求失败')
                    }
                })
            })
        },
        //渲染物流公司
        renderLogisticsCompany: function(id){
            //渲染物流公司
            let optStr = '<option value="">全部</option>';
            this.getLogisticsCompany().then(result => {
                for(let [index,value] of result.entries()){
                    optStr +=`<option value="${value}">${value}</option>`;
                }
                $('#'+id).html(optStr);
                formSelects.render('deliverorder_logisticsCompany');
            });
        },
        //删除子表详情数据
        deleteDetail:function (id){
            $.ajax({
                type: 'get',
                url: '/lms/warehouse/invoice/deleteInvoiceDetail.html',
                dataType: 'json',
                data: {
                    id: id
                },
                success: function(res){
                    if(res.code === '0000'){
                        layer.msg("删除成功");
                        $('[lay-filter="deliverorder_submit"]').trigger('click');
                    }else {
                        layer.msg(res.msg);
                    }
                }
            })
        },
        //新增包裹单start
        addInvoiceDetail: function(){ //新增发货单
            var _this = this;
            $('#invoice_detail_newAdd').on('click', function(){
                layer.open({
                    type: 1,
                    title: '新增包裹单',
                    btn: ['确定'],
                    area: ['1100px', '600px'],
                    content: $('#invoice_detail_newAddLayer').html(),
                    success: function(layero,index){
                        //定义缓存数据
                        $.data(layero[0], 'invoiceData', []);
                        //逻辑处理
                        _this.addInvoiceDetailHandle(layero);
                        //备注功能
                        _this.addInvoiceRemarkHandle(layero);
                    },
                    yes: function(index){
                        layer.close(index);
                        $('[lay-filter="deliverorder_submit"]').trigger('click');
                    }
                })
            })
        },
        //新增备注功能处理
        addInvoiceRemarkHandle:function(layero){
            var invoiceData = $.data(layero[0], 'invoiceData');
            var $tbody = layero.find('#invoice_detail_add_tbody');
            var _this = this;
            layero.on('click', '.layui-icon-edit',function(){
                var $id = $(this).parents('tr').data('id');
                var matchArr = invoiceData.filter(function(item){
                    return item.id == $id;
                });
                var matchIndex = invoiceData.findIndex(function(item){
                    return item.id == $id;
                });
                var matchObj = matchArr[0];
                // console.log(matchObj);
                layer.open({
                    type: 1,
                    title: '备注',
                    content:$('#generator_remarkLayer').html(),
                    id: 'generator_remarkLayerId',
                    area: ['600px', '600px'],
                    btn: ['保存', '关闭'],
                    success: function(layero,index){
                        layero.find('[name=remark]').val(matchObj.remark||'');
                    },
                    yes: function(index,layero){
                        var remark = layero.find('[name=remark]').val();
                        // console.log(remark);
                        _this.generaterRemarkAjax({id: $id, remark: remark}).then(function(){
                            layer.close(index);
                            matchObj.remark = remark;
                            invoiceData.splice(matchIndex,1,matchObj);
                            //更新缓存
                            $.data(layero[0], 'invoiceData', invoiceData);
                            //更新表格
                            _this.addInvoiceTable($tbody,invoiceData);
                        }).catch(function(err){
                            layer.msg(err || '设置备注失败',{icon:2});
                        })
                    }
                })
            });
        },
        //新增包裹单弹框的逻辑处理
        addInvoiceDetailHandle: function(layero){
            const packageNo = layero.find('[name=invoice_detail_add_packageNo]');
            const weight = layero.find('[name=invoice_detail_add_weight]');
            const $tbody = layero.find('#invoice_detail_add_tbody');
            const _this = this;
            //包裹号输入框绑定回车事件
            packageNo.on('keypress', function(e){
                e.stopPropagation();
                if(e.keyCode === 13){
                    if($(this).val().trim()){
                        weight.focus();
                    }else{
                        layer.msg('本地扫描未获取到值,请重新扫描');
                    }
                }
            });
            //重量回车事件
            weight.on('keypress', function(e){
                e.stopPropagation();
                if(e.keyCode === 13){
                   _this.addInvoiceAjax({ packageNo: packageNo.val(),weight: weight.val()}).then(function(result){
                       //获取到缓存的数据结构,判断包裹号有无重复,然后添加start
                        let invoiceData =$.data(layero[0], 'invoiceData');
                        let invoiceIndex = invoiceData.findIndex(function(item){
                            return item.id == result.id;
                        });
                        invoiceIndex==-1 ? invoiceData.unshift(result) : invoiceData.splice(invoiceIndex,1, result);
                        _this.addInvoiceTable($tbody, invoiceData);
                       //end

                       //更新缓存start
                       $.data(layero[0], 'invoiceData',invoiceData);
                       //更新缓存end
                        packageNo.val('');
                        weight.val('');
                        packageNo.focus();
                        
                   }).catch(function(err){
                       layer.msg(err || '未找到此包裹号',{icon:2});
                   });
                }
            });
            //移除功能
            $tbody.on('click', '.remove', function(){
                const $id = $(this).parents('tr').data('id');
                let invoiceData =$.data(layero[0], 'invoiceData');
                let invoiceIndex = invoiceData.findIndex(function(item){
                    return item.id == $id;
                });
                if(invoiceIndex == -1){
                    return layer.msg('没有需要移除的数据',{icon:2});
                }else{
                    _this.addInvoiceRemoveAjax($id).then(function(){
                        invoiceData.splice(invoiceIndex,1);
                        $.data(layero[0], 'invoiceData',invoiceData);
                        //重新渲染表格
                        _this.addInvoiceTable($tbody,invoiceData);
                    }).catch(function(err){
                        layer.msg(err|| '移除数据失败',{icon:2});
                    });
                }
            });
        },
        //新增包裹---表格渲染
        addInvoiceTable: function($tbody, data){
            if(data.length >=0){
                var trStr = '';
                data.forEach(function(item,index){
                    trStr += `<tr data-id="${item.id}">
                        <td>${index+1}</td>
                        <td>${item.logisticsCompany}</td>
                        <td>${item.logisticsTypeName}</td>
                        <td>${item.packageNo}</td>
                        <td>${item.packageWeight}</td>
                        <td>
                            <span class="remark">${item.remark || ''}</span>
                            <div><i class="layui-icon layui-icon-edit" style="font-size: 30px; color: #1E9FFF;cursor:pointer;" lay-event="remark">&#xe642;</i></div>
                        </td>
                        <td><span class="layui-btn layui-btn-xs remove">删除</span></td>
                    </tr>`;
                });
                $tbody.html(trStr);
            }else{
                return layer.msg('没有传入表格数据',{icon:2});
            }
        },
        //新增包裹---重量回车接口
        addInvoiceAjax: function(obj){
            return commonReturnPromise({
                url: '/lms/warehouse/invoice/saveInvoiceDetail.html',
                params: obj
            });
        },
        //新增包裹---移除功能
        addInvoiceRemoveAjax: function(id){
            return commonReturnPromise({
                url: '/lms/warehouse/invoice/deleteInvoiceDetail.html',
                params: {
                    id: id
                }
            })
        },
        //新增包裹单end
        //导出发货单功能
        exportInvoiceDetail:function (id){
            submitForm({"id": id}, '/lms/warehouse/invoice/export/detail.html');
        },

        //生成发货单
        generateInvoiceMain: function(){
            var _this = this;
            $('#invoice_main_newAdd').on('click', function(){
                commonTableCksSelected('logisticsMode_tableId').then(function(result){
                    layer.open({
                        type:1,
                        title: '生成发货单',
                        btn: ['生成','生成并打印', '关闭'],
                        area: ['1100px', '600px'],
                        content: $('#deliverorder_generatorLayer').html(),
                        id: 'deliverorder_generatorLayerId',
                        success:function(layero,index){
                            //数据缓存
                            $.data(layero[0], 'dataCache', result);
                            _this.renderCompany('generator_agentCompany');
                            _this.renderExpressCompany('generator_expressCompany');
                            _this.generatorTable('generator_deliverorder_tbody', result);
                            _this.generatorEditHandle(layero);
                            _this.generatorRemoveHandle(layero);
                            form.render(); 
                        },
                        yes: function(index,layero){
                            var dataCache = $.data(layero[0], 'dataCache');
                            var agentCompany = layero.find('[name=generator_agentCompany]').val();
                            var expressCompany = layero.find("#generator_expressCompany option:selected").text();
                            var expressNo = layero.find('[name=generator_expressNo]').val().trim();
                            var expressCompanyCode = layero.find('[name=generator_expressCompany]').val();
                            if(dataCache.length ==0){
                                return layer.msg('表格数据不能为空',{icon:2});
                            }
                            if(!agentCompany){
                                return layer.msg('请选择货代公司',{icon:2})
                            }
                            var idArr =  dataCache.map(function(item){
                                return item.id;
                            });
                            var detailList = [];
                            idArr.forEach(function(item){
                                detailList.push({id: item});
                            });
                            var obj = {
                                detailList: detailList,
                                agentCompany: agentCompany,
                                expressCompany: expressCompany,
                                expressNo: expressNo,
                                expressCompanyCode: expressCompanyCode
                            };
                            _this.generateInvoiceMainAjax(JSON.stringify(obj)).then(function(result){
                                layer.msg('生成发货单成功', {icon:1});
                                layer.close(index);
                                $('[lay-filter=deliverorder_submit]').trigger('click');
                            }).catch(function(err){
                                layer.msg(err|| '生成发货单失败',{icon:2});
                            })
                        },
                        btn2: function(index, layero){
                            var dataCache = $.data(layero[0], 'dataCache');
                            var agentCompany = layero.find('[name=generator_agentCompany]').val();
                            var expressCompany = layero.find("#generator_expressCompany option:selected").text();
                            var expressNo = layero.find('[name=generator_expressNo]').val().trim();
                            var expressCompanyCode = layero.find('[name=generator_expressCompany]').val();
                            if(dataCache.length ===0){
                                return layer.msg('表格数据不能为空',{icon:2});
                            }
                            if(!agentCompany){
                                return layer.msg('请选择货代公司',{icon:2})
                            }
                            var idArr =  dataCache.map(function(item){
                                return item.id;
                            });
                            var detailList = [];
                            idArr.forEach(function(item){
                                detailList.push({id: item});
                            });
                            var obj = {
                                detailList: detailList,
                                agentCompany: agentCompany,
                                expressCompany: expressCompany,
                                expressNo: expressNo,
                                expressCompanyCode: expressCompanyCode
                            };
                            _this.generateInvoiceMainAjax(JSON.stringify(obj)).then(function(result){
                                layer.msg('生成发货单成功', {icon:1});
                                layer.close(index);
                                $('[lay-filter=deliverorder_submit]').trigger('click');
                                window.open(ctx + '/static/html/deliverprint.html?id='+result, '_blank');
                            }).catch(function(err){
                                layer.msg(err|| '生成发货单失败',{icon:2});
                            })
                            return false;
                        }
                    });

                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            })
        },
        //生成发货单移除功能
        generatorRemoveHandle: function(layero){
            var dataCache = $.data(layero[0], 'dataCache');
            var _this = this;
            layero.on('click', '.remove',function(){
                var $id = $(this).parents('tr').data('id');
                var cacheIndex = dataCache.findIndex(function(item){
                    return item.id == $id;
                });
                dataCache.splice(cacheIndex, 1);
                _this.generatorTable('generator_deliverorder_tbody', dataCache);
                $.data(layero[0], 'dataCache', dataCache);
            });
        },
        //生成发货单备注功能
        generatorEditHandle: function(layero){
            var dataCache = $.data(layero[0], 'dataCache');
            var _this = this;
            layero.on('click', '.layui-icon-edit',function(){
                var $id = $(this).parents('tr').data('id');
                var matchArr = dataCache.filter(function(item){
                    return item.id == $id;
                });
                var matchIndex = dataCache.findIndex(function(item){
                    return item.id == $id;
                });
                var matchObj = matchArr[0];
                layer.open({
                    type: 1,
                    title: '备注',
                    content:$('#generator_remarkLayer').html(),
                    id: 'generator_remarkLayerId',
                    area: ['600px', '600px'],
                    btn: ['保存', '关闭'],
                    success: function(layero,index){
                        layero.find('[name=remark]').val(matchObj.remark||'请输入');
                    },
                    yes: function(index,layero){
                        var remark = layero.find('[name=remark]').val();
                        _this.generaterRemarkAjax({id: $id, remark: remark}).then(function(result){
                            layer.close(index);
                            matchObj.remark = remark;
                            dataCache.splice(matchIndex,1,matchObj);
                            //更新缓存
                            $.data(layero[0], 'dataCache', dataCache);
                            //更新表格
                            _this.generatorTable('generator_deliverorder_tbody', dataCache);
                        }).catch(function(err){
                            layer.msg(err || '设置备注失败',{icon:2});
                        })
                    }
                })
            });
        },
        //渲染生产发货单表格
        generatorTable:function(id,data){
            var $tbodyId = $('#'+id);
            var trStr = '';
            data.forEach(function(item,index){
                trStr +=`
                    <tr data-id="${item.id}">
                        <td>${index+1}</td>
                        <td>${item.packageNo}</td>
                        <td>${item.packageWeight}</td>
                        <td>
                            <span class="remark">${item.remark || ''}</span>
                            <div><i class="layui-icon layui-icon-edit" style="font-size: 30px; color: #1E9FFF;cursor:pointer;" lay-event="remark">&#xe642;</i></div>
                        </td>
                        <td><a class="layui-btn layui-btn-xs remove">删除</a></td>
                    </tr>
                `;
            });
            $tbodyId.html(trStr);
        },
        //生成发货单请求接口
        generateInvoiceMainAjax:function (obj){
            return commonReturnPromise({
                type: 'post',
                contentType:"application/json",
                url: '/lms/warehouse/invoice/generateInvoice.html',
                params: obj
            });
        },
        //生成发货单备注功能
        generaterRemarkAjax: function(obj){
            return commonReturnPromise({
                url: '/lms/warehouse/invoice/update/detail.html',
                params: obj
            });
        }

    };

    //货代公司
    deliverorderName.renderCompany('deliveryorder_agentCompany');
    //物流公司
    deliverorderName.renderLogisticsCompany('logistics_company');
    //新增开发单
    deliverorderName.newAddHandle();
    //新增包裹号
    deliverorderName.addInvoiceDetail();
    //生成发货单
    deliverorderName.generateInvoiceMain();

    //表单搜索事件
    form.on('submit(deliverorder_submit)', function(object){
        var status = $('#deliverorder_status').val();
        var data = object.field; //获取到表单提交对象
        var dataH = deliverorderName.dataHandle(data);
        deliverorderName.tableRender(dataH,status);
    });

    //初始化触发搜索事件
    $('[lay-filter="deliverorder_submit"]').trigger('click');
    UnifiedFixedFn('deliverorder_content');
})