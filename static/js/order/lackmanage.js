;(function($,layui,window,document,undefined){
    layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','upload','laydate'],function(){
        var admin = layui.admin,
            table = layui.table,
            element = layui.element,
            layer = layui.layer,
            laytpl = layui.laytpl,
            upload = layui.upload,
            laydate = layui.laydate,
            formSelects = layui.formSelects,
            form = layui.form;
        var operatorName = $('#lmsUsername').text();
        form.render();
        //命名空间
        var lackmanageName= {
        //表单搜索start
            //渲染时间
            renderTime: function(){
                var date = Date.now();
                var val = Format(date,'yyyy-MM-dd');
                laydate.render({
                    elem: '#lackmanage_time',
                    value: val
                })
            },
            //渲染仓库，订单状态
            renderWarehouse: function(){
                var _this = this;
                this.warehouseAjax().then(function(result){
                    var prodWarehouses = result.prodWarehouses;//仓库数组
                    var orderProcessStatus = result.orderProcessStatus
                    var newPickStatus = result.newPickStatus
                    var platCodes = result.platCodes
                    let prodWarehousesId = prodWarehouses.filter(item => item.value == '义乌仓')[0]['name'];
                    render_order_build_floor("#lackmanageForm",prodWarehousesId)
                    commonRenderSelect('lackmanageWarehouseId',prodWarehouses,{name:'value', code:'name',selected: prodWarehousesId}).then(function(){
                        form.render('select');
                    });
                    commonRenderSelect('pickStatus',newPickStatus,{name:'value', code:'name'}).then(function(){
                        form.render('select');
                    });
                    commonRenderSelect('lackmanagePlatCode',platCodes,{name:'value', code:'name'}).then(function(){
                      formSelects.render('lackmanagePlatCode');
                    });
                    orderProcessStatus.forEach(item => {
                        let name = item.name
                        item.name = item.value
                        item.value = name
                    })
                    formSelects.data('lackmanageOrderStatusId', 'local', { arr: orderProcessStatus })
                    form.render()

                }).catch(function(err){
                    _this.errHandle(err, '仓库接口请求出错');
                })
            },


            //切换tab
            switchTab: function(){
                var $tabInput = $('#lackmanageForm').find('[name=hasNewPickBatch]');
                var _this = this;
                element.on('tab(lackmanage-tabs)', function(data){
                    var index = data.index;//得到当前Tab的所在下标
                    if(index == 0){ //未生成
                        $tabInput.val('false');
                        $('#lackmanage-generateBtn').removeClass('disN');
                        $('#lackmanage-delBtn').removeClass('disN');
                        $('#lackmanage-pickUser').parents('.layui-form').removeClass('disN');
                        $('#lackmanage-cancelBtn').addClass('disN');
                        $('#lackmanage_judgeDeliveryBtn').addClass('disN');
                    }else if(index ==1){ //已生成
                        $tabInput.val('true');
                        $('#lackmanage-generateBtn').addClass('disN');
                        $('#lackmanage-delBtn').addClass('disN');
                        $('#lackmanage-pickUser').parents('.layui-form').addClass('disN');
                        $('#lackmanage-cancelBtn').removeClass('disN');
                        $('#lackmanage_judgeDeliveryBtn').removeClass('disN');
                    }
                    _this.trigger();
                });
            },
            //触发搜索功能
            trigger: function(){
                $('#lackmanageForm').find('[lay-filter=lackmanageSearch]').trigger('click');
            },
            //渲染拣货人
            pickUserRender: function(){
                this.pickerAjax().then(function(result){
                    commonRenderSelect('lackmanage-pickUser',result,{name:'userName', code:'id'}).then(function(){
                        form.render('select');
                    });
                });
            },
        //表单搜索end

        //表格渲染start
            tableRender: function(data){
                var _this = this;
                table.render({
                    elem: '#lackmanage-table',
                    id: 'lackmanage-tableId',
                    method: 'POST',
                    where: data,
                    url: '/lms/pickshortage/list.html',
                    cols: _this.cols(data.hasNewPickBatch),
                    page: true,
                    limit:300,
                    limits:[300,500,1000],
                    // created(res) { //模拟数据用
                    //   res.data.forEach(item => item.sendable= Math.random()>0.5 ? true : false)
                    // },
                    done: function(res){
                        $('#lackmanage-tabs').find('li>span').html('');
                        $('#lackmanage-tabs').find('li.layui-this>span').html(`(${res.data.length})`);
                    }
                })
            },
            cols: function(type){
                var cols = [];
                if(type===false){//未生成表格
                    var col = [
                        {type: 'checkbox', width:30},
                        {title: 'SKU', field: 'ssku'},
                        {title: '库位', field: 'locationCode'},
                        {title: '楼栋', field: 'buildingNo'},
                        {title: '楼层', field: 'floorNo'},
                        {title: '少货数量', field: 'skuNum'},
                        {title: '库存数量', field: 'stockNum'},
                        {title: '原配货批次', field: 'oldBatchNo'},
                        {title: '平台', field: 'platCode'},
                        {title: '订单号', field: 'orderId'},
                        {title: '订单状态', field: 'processStatusStr'},
                        {title: '篮号', field: 'basketNo'},
                        {title: '原配货人',field: 'oldPickUser'},
                        // {title: "操作", toolbar: '#lackmanage-tool',width: 70}
                    ];
                    cols.push(col);
                }else{//已生成表格
                    var col = [
                        {type: 'checkbox', width:30},
                        {title: 'SKU', field: 'ssku'},
                        {title: '库位', field: 'locationCode'},
                        {title: '楼栋', field: 'buildingNo'},
                        {title: '楼层', field: 'floorNo'},
                        {title: '少货数量', field: 'skuNum'},
                        {title: '库存数量', field: 'stockNum'},
                        {title: '原配货批次', field: 'oldBatchNo'},
                        {title: '平台', field: 'platCode'},
                        {title: '订单号', field: 'orderId'},
                        {title: '订单状态', field: 'processStatusStr'},
                        {title: '篮号', field: 'basketNo'},
                        {title: '原配货人',field: 'oldPickUser'},
                        {title: '新配货批次', field: 'newBatchNo'},
                        {title: '新配货人', field: 'newPickUser'},
                        {title: '新配货数量', field: 'newPickNum'},
                        {title: '新配货状态', field: 'pickStatusStr'},
                        {title: '是否发货', field: 'sendable', templet: "<div><span>{{# if(d.sendable === true){ }} 少货发货 {{# }else if(d.sendable === false){ }} 还库不发{{# } }}</span></div>"}
                    ];
                    cols.push(col);
                };
                return cols;
            },
        //表格渲染end

            //生成配货单
            generateHandle: function(){
                var _this = this;
                $('#lackmanage-generateBtn').on('click', function(){
                    var pickUserName = $('#lackmanage-pickUser').val();
                    // if(!pickUserName){
                    //     return layer.msg('请选择拣货人',{icon:7});
                    // };
                    commonTableCksSelected('lackmanage-tableId').then(function(data){
                        var idsArr = data.map(function(item){
                            return item.id;
                        });
                        var obj = {
                            pickUserName: pickUserName,
                            ids: idsArr.join(',')
                        };
                        _this.generateAjax(obj).then(function(result){
                            layer.alert(`生成配货单成功,单号:${result}`,{icon:1});
                            _this.trigger();
                        }).catch(function(err){
                            // _this.errHandle('生成配货单失败',err);
                            layer.open({
                                title: "信息",
                                area: ['460px', '240px'],
                                btn: ['确定'],
                                content: err || '生成配货单失败',
                                yes: function(index) {
                                    layer.close(index);
                                }
                            });
                        })
                    }).catch(function(dataErr){
                        _this.errHandle('请先选中数据',dataErr);
                    })
                });
            },
            //取消配货单
            cancelHandle: function(){
                var _this = this;
                $('#lackmanage-cancelBtn').on('click', function(){
                    commonTableCksSelected('lackmanage-tableId').then(function(data){
                        var idsArr = data.map(function(item){
                            return item.id;
                        });
                        var obj = {
                            ids: idsArr.join(',')
                        };
                        _this.cancelAjax(obj).then(function(result){
                            layer.msg(`取消配货单成功`,{icon:1});
                            _this.trigger();
                        }).catch(function(err){
                            _this.errHandle('取消配货单失败',err);
                        })
                    }).catch(function(dataErr){
                        _this.errHandle('请先选中数据',dataErr);
                    })
                });
            },
            delAjax (obj) {
                return commonReturnPromise({
                    url: '/lms/pickshortage/deletenotgeneratedorderbyid.html',
                    type: 'post',
                    params: obj
                });
            },
            //删除功能
            delHandle () {
                var _this = this;
                $('#lackmanage-delBtn').on('click', function(){
                    layer.confirm('确认是否要删除少货记录',{icon: 3, title:'提示'},function(){
                        commonTableCksSelected('lackmanage-tableId').then(function(data){
                            var idsArr = data.map(function(item){
                                return item.id;
                            });
                            var obj = {
                                ids: idsArr.join(',')
                            };
                            _this.delAjax(obj).then(function(result){
                                layer.msg(`删除成功`,{icon:1});
                                _this.trigger();
                            }).catch(function(err){
                                _this.errHandle('删除失败',err);
                            })
                        }).catch(function(dataErr){
                            _this.errHandle('请先选中数据',dataErr);
                        })
                    })
                });
            },
              //设置弹框的头部展示登录人名称
            setLayerHeaderShowName: function (layero) {
                layero.find('.layui-layer-title').append(`<div class="waittopack_titleShowName">操作人:${operatorName}</div>`);
            },
            //判断是否可发-20230928
            judgeDeilveryHandle(){
              let _this = this;
              $('#lackmanage_judgeDeliveryBtn').on('click', function(){
                commonTableCksSelected('lackmanage-tableId').then(function(data){
                  let orderIds = data.map(item=>item.id).join();
                  commonReturnPromise({
                    url: '/lms/pickshortage/judgeWhetherAbleSend',
                    type: 'post',
                    params: { ids: orderIds }
                  }).then(function(result){
                      if(result){
                        layer.alert(`少货还库的篮号：<font size='6'>${result}</font>`, { icon: 7 });
                      }else{
                        layer.msg('操作成功', {icon:1});
                      }
                      
                  })
                }).catch(function(dataErr){
                    _this.errHandle('请先选中数据',dataErr);
                })
              });
            },
            //列表页正常发货处理
            multiNoProdHandle: function () {
                var _this = this;
                $('#lackmanag_normalDeliveryBtn').on('click', function () {
                    commonTableCksSelected('lackmanage-tableId').then(function(data){
                        var orderIds = data.map(item=>item.orderId).join();
                        _this.multiNoProdNormalAjax(orderIds).then(function(result){
                            layui.admin.batchResultAlert("正常发货完成:", result, function() {_this.trigger()})
                        }).catch(function(err){
                            layer.msg(err, { icon: 2 });
                        })
                    }).catch(function(dataErr){
                        _this.errHandle('请先选中数据',dataErr);
                    })
                });
            },
             //正常发货接口
            multiNoProdNormalAjax: function (orderIds) {
                return commonReturnPromise({
                    url: '/lms/pickpackorder/stockoutshipments.html',
                    type: 'post',
                    params: { orderIds }
                });
            },
              //正常发货
              multiNoProdNormalHandle: function (layero) {
                var _this = this;
                layero.find('#waittopack_multiNoProdNormal').on('click', function () {
                    var orderId = layero.find('[name=orderOrTrackId]').val();
                    if (!orderId) {
                        return layer.msg('请输入订单号或跟踪号');
                    }
                    layer.open({
                        title: '提示',
                        content: '确认正常发货吗?',
                        btn: ['确认'],
                        success: function (layero1, index) {
                            this.multiPackageEnterEsc = function (event) {
                                if (event.keyCode === 13) {
                                    //要做一个接口操作
                                    _this.multiNoProdNormalAjax(orderId).then(res => {
                                        layer.msg(res || '正常发货操作成功', { icon: 1 });
                                        //关闭弹框
                                        layer.close(index);
                                    }).catch(err => {
                                        layer.msg(err, { icon: 2 });
                                    });
                                    return false; //阻止系统默认回车事件
                                }
                            }
                            $(document).on('keydown', _.throttle(this.multiPackageEnterEsc, 30000)); //监听键盘事件，关闭层
                        },
                        end: function () {
                            $(document).off('keydown', this.multiPackageEnterEsc); //解除键盘关闭事件
                        },
                        yes: function (index) {
                            _this.multiNoProdNormalAjax(orderId).then(res => {
                                layer.msg(res || '正常发货操作成功', { icon: 1 });
                                //关闭弹框
                                layer.close(index);
                            }).catch(err => {
                                layer.msg(err, { icon: 2 });
                            });
                        }
                    });
                });
            },


            //统一错误处理
            errHandle: function(str,err){
                var errHandle = typeof(err) == 'object' ? str: err;
                layer.msg(errHandle, {icon:2});
            },
            //生成配货单
            generateAjax: function(obj){
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/pickshortage/createlackpickbatch.html',
                    params: obj
                });
            },
            //取消配货单
            cancelAjax: function(obj){
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/pickshortage/removepickbatch.html',
                    params: obj
                });
            },
            //获取仓库.prodWarehouses
            warehouseAjax: function(){
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unauditorder/listenum.html'
                });
            },
            //拣货人
            pickerAjax: function(){
                return commonReturnPromise({
                    url: '/lms/sysuser/listUser.html'
                });
            }
        };
        //渲染时间和仓库
        lackmanageName.renderTime();
        lackmanageName.renderWarehouse();
        //切换tab
        lackmanageName.switchTab();
        //渲染拣货人
        // lackmanageName.pickUserRender();
        //生成配货单
        lackmanageName.generateHandle();
        //取消配货单
        lackmanageName.cancelHandle();
        //删除
        lackmanageName.delHandle();
            //点击列表页正常发货按钮
        lackmanageName.multiNoProdHandle();
        //判断是否可发货按钮
        lackmanageName.judgeDeilveryHandle();

        //表单搜索
        form.on('submit(lackmanageSearch)', function(data){
            var data = data.field; //获取到表单提交对象
            if(!data.shortageDate){
                return layer.msg('缺货日期必填',{icon:7});
            }
            data.hasNewPickBatch = data.hasNewPickBatch === 'true';
            lackmanageName.tableRender(data);
        });


    })
})(jQuery, layui, window, document);