layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laytpl', 'laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laytpl = layui.laytpl,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.$;
    form.render();

    render_hp_orgs_users("#shopeeAbolish_searchForm");//渲染部门销售员店铺三级联动
    //时间处理(默认15天)
    var shopeeAbolish_nowDateString = new Date().getTime();
    var shopeeAbolish_dateFiftweenSting = shopeeAbolish_nowDateString - 15*24*60*60*1000;
    var shopeeAbolish_dateStart = Format(shopeeAbolish_dateFiftweenSting, 'yyyy-MM-dd');
    var shopeeAbolish_dateEnd = Format(shopeeAbolish_nowDateString, 'yyyy-MM-dd');
    //渲染时间
    laydate.render({
        elem: '#shopeeAbolish_times', //渲染时间
        range: true,
        value: shopeeAbolish_dateStart +' - '+ shopeeAbolish_dateEnd
    });
    //监听tab点击事件
    element.on('tab(shopeeAbolish-tabs)', function(data){
        if(data.index == 0) { //未处理
            $('#shopeeAbolish-tabVal').val('0');
        }else if(data.index == 1){ //已处理
            $('#shopeeAbolish-tabVal').val('1');
        }else if(data.index == 2){ //全部
            $('#shopeeAbolish-tabVal').val('');
        }else if(data.index == 3){ //系统拒绝待确认
            $('#shopeeAbolish-tabVal').val('2');
        }
        data.index == 3 ? $('#shopeeAbolish_batchConfirmBtn').show() : $('#shopeeAbolish_batchConfirmBtn').hide()
        const selected =$('#shopeeAbolish_searchForm').find('select[name=handleResults]').val()
        const getTpl = shopeeAbolish_searchForm_handleResultsTpl.innerHTML
        const view = document.getElementById('shopeeAbolish_searchForm_handleResults');
        laytpl(getTpl).render({selected,tabIndex:data.index}, function(html){
            view.innerHTML = html;
            form.render()
        });
        
        $('[lay-filter="shopeeAbolish_submit"]').trigger('click');
    });

    var shopeeAbolishName = {
        dataHandle: function(data){ 
            data.roleNames = 'shopee客服';
            data.handleStatus = $('#shopeeAbolish-tabVal').val();
            if(data.times){
                var timeArr =data.times.split(' - ');
                data.searchTimeStart = timeArr[0];
                data.searchTimeEnd = timeArr[1];
            }else{
                data.searchTimeStart = '';
                data.searchTimeEnd = '';
            }
            if(!data.storeAcctId){
                data.storeAcctId = $('#shopeeAbolish_store_selId').attr('acct_ids');
            }else{
                data.storeAcctId = formSelects.value('shopeeAbolish_store_sel', 'val').join(',');
            }
            if(data.handleStatus == '0' || data.handleStatus=='2' ){
                delete data.handleResults;
            }
            if(shopeeAbolishName_firstAllSearch) {
                data.searchTimeStart = shopeeAbolish_dateStart;
                data.searchTimeEnd = shopeeAbolish_dateEnd;
            }
            delete data.times;
            return data;
        },
        cols: function () {
            const basicCols = [
              [
                { title: "产品信息", templet: "#shopeeAbolish_info", width: 300 },
                { title: "店铺单号", field: "ordersn", width: 190 },
                {
                  title: "店铺",
                  templet:
                    '<div><div style="text-align:left;"><div><strong>店铺:</strong>{{d.storeAcct || ""}}</div><div><strong>客服:</strong>{{d.customServicer || ""}}</div></div></div>',
                },
                { title: "买家", field: "buyerName" },
                { title: "订单金额(￥)", field: "totalAmount", width: 100 },
                { title: "发起原因", field: "cancelReason" },
                { title: "日期", templet: "#shopeeAbolish_date" },
                {
                  title: "处理结果",
                  field: "handleResult",
                  templet: "#shopeeAbolish_handleResult",
                  width: 80,
                },
                { title: "操作", toolbar: "#shopeeAbolish_tableIdBar", width: 80 },
              ],
            ]
            const checkboxCols = [
              [{ type: "checkbox", width: 32 }, ...basicCols[0]],
            ]
            const curTab = $("#shopeeAbolish-tabs")
              .find(".layui-this span")
              .prop("id")
            const tabList = {
              shopeeAbolish_count1: basicCols,
              shopeeAbolish_count2: basicCols,
              shopeeAbolish_count3: basicCols,
              shopeeAbolish_count4: checkboxCols,
            }
            return tabList[curTab]
          },
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#shopeeAbolish_table',
                method: 'post',
                url: ctx + '/shopee/shopeeCancelOrder/queryPage.html',
                where: data,
                page: true,
                id: "shopeeAbolish_tableId",
                limits: [50, 100, 300],
                limit: 50,
                cols: _this.cols(),
                created:function(res){
                    // 未处理  已处理  全部  系统拒绝待确认
                    if(res.code === '0000' && Array.isArray(res.data)){
                        res.data = res.data.map(item=>({...item, handleStatus:data.handleStatus}))
                    }
                },
                done: function(res){
                    shopeeAbolishName_firstAllSearch = false
                    _this.countAjax(data).then(function(result){
                        $('#shopeeAbolish_count1').html(`(${result.handle_status_1})`);
                        $('#shopeeAbolish_count2').html(`(${result.handle_status_2})`);
                        $('#shopeeAbolish_count3').html(`(${result.handle_status_3})`);
                        $('#shopeeAbolish_count4').html(`(${result.handle_status_4 || 0})`);
                    });
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(shopeeAbolish_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'detail'){ //详情
                    _this.detailPageRender(data.id);
                }else if(obj.event == 'auto'){ //同步
                    _this.singleAuto(data);
                }else if(obj.event == 'confirm'){ //确认
                    _this.confirmAjax([data.id]).then(function(res){
                        layer.msg(res, {icon: 1});
                        $('[lay-filter="shopeeAbolish_submit"]').trigger('click');
                    })
                }
            });
        },
        detailPageRender:function(id){
            var _this = this;
            this.detailAjax(id).then(function(result){
                layer.open({
                    type: 1,
                    title: '详情',
                    btn: result.handleResult ==0 ? ['提交', '关闭'] : ['关闭'],
                    area: ['1100px', '700px'],
                    content: $('#shopeeAbolish_detail').html(),
                    id: 'shopeeAbolish_detailId',
                    success: function(layero, index){
                        var getTpl = shopeeAbolish_detailContainerTpl.innerHTML,
                        view = document.getElementById('shopeeAbolish_detailContainer');
                        laytpl(getTpl).render(result, function(html){
                            view.innerHTML = html;
                            form.render();
                        });
                    },
                    yes: function(index,layero){
                        var isHandleResult = layero.find('[name=handleResult]');
                        if(isHandleResult.length){
                            var handleResult = Number(layero.find('[name=handleResult]:checked').val());
                            if(!handleResult){
                                return layer.msg('请选择处理意见!',{icon:2});
                            }
                            _this.orderAjax(handleResult, id).then(function(){
                                layer.close(index);
                                layer.msg('提交成功!', {icon: 1});
                                $('[lay-filter="shopeeAbolish_submit"]').trigger('click');
                            }).catch(function(err){
                                layer.msg(err,{icon:2});
                            });
                        }else{
                            layer.close(index);
                        }
                    }
                })
            }).catch(function(err){
                layer.msg(err,{icon: 2});
            });
        },
        singleAuto: function(data){
            var ordersnList = [];
            ordersnList.push(data.ordersn);
            var storeAcctId = data.storeAcctId;
            this.autoAjax(ordersnList, storeAcctId).then(function(result){
                layer.msg('同步成功!', {icon: 1});
                $('[lay-filter="shopeeAbolish_submit"]').trigger('click');
            }).catch(function(err){
                layer.msg(err, {icon:2});
            })
        },
        batchConfirm: function(){
            const _this=this;
            $('#shopeeAbolish_batchConfirmBtn').on('click', function(){
                const {data} = table.checkStatus('shopeeAbolish_tableId')
                if(!data.length) return layer.msg('请选择数据',{icon:7})
                const idArr = data.map(item=>item.id)
                _this.confirmAjax(idArr).then(function(res){
                    layer.msg(res, {icon: 1});
                    $('[lay-filter="shopeeAbolish_submit"]').trigger('click');
                })
            });
        },
        batchAuto: function(){
            var _this=this;
            $('#shopeeAbolish_batchBtn').on('click', function(){
                var storeAcctId = $('#shopeeAbolish_searchForm').find('[name=storeAcctId]').val();
                if(!storeAcctId){
                    return layer.msg('请先选择店铺',{icon:2});
                }
                _this.batchAjax(storeAcctId).then(function(result){
                    layer.msg('批量同步成功!', {icon: 1});
                    $('[lay-filter="shopeeAbolish_submit"]').trigger('click');
                }).catch(function(err){
                    layer.msg(err, {icon:2});
                })
            });
        },
        //ajax请求
        //tab数量展示
        countAjax: function(data){
            return commonReturnPromise({
                url:ctx + '/shopee/shopeeCancelOrder/countForTab.html',
                type: 'post',
                params: data
            });
        },
        //同步
        autoAjax: function(ordersnList, storeAcctId){
            return commonReturnPromise({
                url:ctx + '/shopee/shopeeCancelOrder/batchSyncCancelOrder.html',
                type: 'post',
                contentType: 'application/json',
                params: JSON.stringify({
                    ordersnList: ordersnList,
                    storeAcctId:　storeAcctId
                })
            });
        },
        //批量同步
        batchAjax: function(storeAcctId){
            return commonReturnPromise({
                url: ctx + '/shopee/shopeeCancelOrder/batchSyncCancelOrderByStore.html',
                params: {
                    storeAcctId:storeAcctId
                }
            })
        },
        // 批量确认
        confirmAjax:function(ids){
            return commonReturnPromise({
                url: ctx + '/shopee/shopeeCancelOrder/confirmSystemReject',
                params: JSON.stringify(ids),
                type:'post',
                contentType:'application/json;charset=UTF-8'
            })
        },
        //详情
        detailAjax: function(id){
            return commonReturnPromise({
                url:ctx + '/shopee/shopeeCancelOrder/selectCancelDetail.html',
                params: {
                    id: id
                }
            });
        },
        //同意/拒绝取消订单
        orderAjax: function(handleResult, id){
            return commonReturnPromise({
                url:ctx + '/shopee/shopeeCancelOrder/handleCancelOrder.html',
                // type: 'post',
                // contentType: 'application/json',
                params: {
                    handleResult: handleResult,
                    id: id
                }
            });
        }
    };
    //表单搜索事件
    form.on('submit(shopeeAbolish_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var dataObj =shopeeAbolishName.dataHandle(data);
        shopeeAbolishName.tableRender(dataObj);
    });
    //表头固定
    UnifiedFixedFn('shopeeAbolish_card');
    //批量同步
    shopeeAbolishName.batchAuto();
    // 批量确认
    shopeeAbolishName.batchConfirm()
    //页面默认查询全部数据
    // 
    let shopeeAbolishName_firstAllSearch = true
    $('[lay-filter="shopeeAbolish_submit"]').trigger('click');
});