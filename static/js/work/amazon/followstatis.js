;(function(){
    layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate','upload'],function(){
        var admin = layui.admin,
            table = layui.table,
            element = layui.element,
            layer = layui.layer,
            laytpl = layui.laytpl,
            laydate = layui.laydate,
            formSelects = layui.formSelects,
            upload = layui.upload,
            form = layui.form;
        form.render();
        //时间渲染
        var defaultTimes = 31*24*60*60*1000;
        var dateNow = new Date();
        var year = dateNow.getFullYear(); //2020
        var month = dateNow.getMonth(); //月份-1
        var monthArr = [1,3,5,7,8,10,12];
        var startTimeSet = year +'-'+month+'-'+'01';
        if(monthArr.includes(month)){
            var endTimeSet = year +'-'+month+'-'+'31';
        }else{
            var endTimeSet = year +'-'+month+'-'+'30';
        }
        laydate.render({
            elem: '#followstatis_timeRange'
            ,value: startTimeSet +' - '+ endTimeSet
            ,range: true
            ,done: function(value){
                var timeArr =value.split(' - ');
                var diffVal = new Date(timeArr[1]).getTime() - new Date(timeArr[0]).getTime();
                if(diffVal > defaultTimes){
                    return layer.msg('时间限制一个月内!',{icon:7});
                }
            }
        });
        //tab切换
        element.on('tab(followstatis_tabs)', function (data) {
            if(data.index == 0){ //asin维度
                $('#followstatis_queryType').val(1);
                $('.followstatis_store').removeClass('disN');
                $('.followstatis_asin').removeClass('disN');
                $('.followstatis_order_field').removeClass('disN');
                $('.followstatis_export').removeClass('disN');
            }else if(data.index == 1){ //人员维度
                $('#followstatis_queryType').val(2);
                $('.followstatis_store').addClass('disN');
                $('.followstatis_asin').addClass('disN');
                $('.followstatis_order_field').addClass('disN');
                $('.followstatis_export').addClass('disN');
            }else if(data.index == 2){ //分配店铺维度
                $('#followstatis_queryType').val(3);
                $('.followstatis_store').addClass('disN');
                $('.followstatis_asin').addClass('disN');
                $('.followstatis_order_field').addClass('disN');
                $('.followstatis_export').addClass('disN');
            }else if (data.index == 3){
                //首单asin统计
                $('#followstatis_queryType').val(4);
                $('.followstatis_store').removeClass('disN');
                $('.followstatis_asin').removeClass('disN');
                $('.followstatis_order_field').removeClass('disN');
                $('.followstatis_export').removeClass('disN');
            };
            $('[lay-filter=followstatis_submit]').trigger('click');
        });
        var followstatisName = {
            //渲染店铺和创建人
            renderStoreFn: function(creatorArr, storeArr){
                commonRenderSelect('followstatis_creator', creatorArr, {
                    name: 'userName',
                    code: 'createPersonId'
                }).then(function(result){
                    form.render('select');
                });
                //店铺
                commonRenderSelect('followstatis_store', storeArr, {
                    name: 'storeAcct',
                    code: 'storeId'
                }).then(function(result){
                    form.render('select');
                });
            },
            renderStore: function(){
                var _this = this;
                var FOLLOWSTATIS_CREATOR = sessionStorage.getItem('FOLLOWSTATIS_CREATOR');
                var FOLLOWSTATIS_STORE = sessionStorage.getItem('FOLLOWSTATIS_STORE');
                if(!FOLLOWSTATIS_CREATOR || !FOLLOWSTATIS_STORE){
                    Promise.all([_this.creatorAjax(), _this.storeAjax()]).then(function(result){
                        _this.renderStoreFn(result[0], result[1]);
                    });
                }else{
                    _this.renderStoreFn(eval('('+FOLLOWSTATIS_CREATOR+')'), eval('('+FOLLOWSTATIS_STORE+')'));
                }
            },
            //数据缓存
            saveTosession: function(){
                var _this = this;
                var FOLLOWSTATIS_CREATOR = sessionStorage.getItem('FOLLOWSTATIS_CREATOR');
                var FOLLOWSTATIS_STORE = sessionStorage.getItem('FOLLOWSTATIS_STORE');
                if(!FOLLOWSTATIS_CREATOR || !FOLLOWSTATIS_STORE){
                    Promise.all([_this.creatorAjax(), _this.storeAjax()]).then(function(result){
                        sessionStorage.setItem('FOLLOWSTATIS_CREATOR', JSON.stringify(result[0]));
                        sessionStorage.setItem('FOLLOWSTATIS_STORE', JSON.stringify(result[1]));
                    });
                }
            },
            //数据处理
            dataHandle: function(data){
                if(data.times){
                    var timeArr =data.times.split(' - ');
                    data.startTime = timeArr[0] + ' 00:00:00';
                    data.endTime = timeArr[1] + ' 23:59:59';
                }else{
                    data.startTime = '';
                    data.endTime ='';
                }
                if(data.queryType ==2 || data.queryType ==3){
                    data.skuType = 1;
                    data.sku = '';
                    data.storeId = '';
                }
                delete data.times;
                return data;
            },
            //表格渲染
            tableRender: function(data){
                var _this = this;
                table.render({
                    elem: '#followstatis_table',
                    method: 'post',
                    url: '/lms/amazonFsStatistics/queryByPage.html',
                    where: data,
                    page: (data.queryType == 2 || data.queryType == 3) ? false : true,
                    totalRow: (data.queryType == 2 || data.queryType == 3)  ? true: false,
                    totalRowText: '合计',
                    limits: [50, 100, 300],
                    limit: (data.queryType == 2 || data.queryType == 3) ? 100000 : 50,
                    id: "followstatis_tableId",
                    cols: _this.switchCols(data),
                    done: function(res){
                        //展示tab数量
                        $('#followstatis_tabs').find('li>span').html('');
                        $('#followstatis_tabs').find('li.layui-this>span').html(`(${res.count})`);
                        //展示数量
                        var extra = res.extra || {};
                        //设置总计
                        if(data.queryType == 1){
                           $('#asin_totalOrderNumber').html(`(${extra.totalOrderNumber || 0})`);//订单数量
                           $('#asin_totalNumber').html(`(${extra.totalNumber || 0})`);//商品数量
                           $('#asin_saleAmount').html(`(${extra.saleAmount || 0}$)`);//销售额
                        }else if(data.queryType ==2){
                            $('#person_AsinNumber').html(`(${extra.asinNumber || 0})`);
                            $('#person_skuNumber').html(`(${extra.skuNumber || 0})`);
                            $('#person_totalOrderNumber').html(`(${extra.totalOrderNumber || 0})`);
                            $('#person_totalNumber').html(`(${extra.totalNumber || 0})`);
                            $('#person_saleAmount').html(`(${extra.saleAmount || 0}$)`);
                            $('#person_totalFirstNumber').html(`(${extra.totalFirstNumber || 0})`);
                        }else if(data.queryType ==3){
                                //操作
                               $('#store_quantity').html(`(${extra.asinNumber || 0})`);
                                _this.watchBar(data);
                                var $tr = $('#followstatis_table').next().find('.layui-table-total tbody>tr');
                                $tr.find('td:first-child>div').html('总计');
                                var storeArr = res.data.map(function(item){
                                    return item.storeAcct;
                                });
                                var uniqueStoreArr = [...new Set(storeArr)];
                                $tr.find('td:nth-child(2)>div').html(`${uniqueStoreArr.length}`);
                        }else if(data.queryType ==4){
                            $('#first_totalOrderNumber').html(`(${extra.totalOrderNumber || 0})`);
                            $('#first_saleAmount').html(`(${extra.saleAmount || 0}$)`);
                        }
                    }
                });
            },
            switchCols: function(data) {
                var cols = [];
                if(data.queryType == '1'){//asin维度
                    var col = [
                        {title: 'ASIN', field: 'asin'},
                        {title: '站点', field: 'saleSite'},
                        {title: '商品SKU', field: 'sku'},
                        {title: '订单店铺', field: 'orderStoreAcct'},
                        {title: '当前店铺', field: 'storeAcct'},
                        {title: '创建人', field: 'creator'},
                        {title: '订单量<span id="asin_totalOrderNumber"></span>', field: 'orderNumber'},
                        {title: '商品数<span id="asin_totalNumber"></span>', field: 'quantity'},
                        {title: '销售额<span id="asin_saleAmount"></span>', field: 'saleAmount'}
                    ];
                    cols.push(col);
                }else if(data.queryType == '2'){//人员维度
                    var col = [
                        {title: '创建人', field: 'creator' , width : "12.5%"},
                        {title: '站点', field: 'saleSite', width : "12.5%"},
                        {title: '首单ASIN数量<span id="person_totalFirstNumber"></span>', field: 'firstAsinNumber',sort: true, width : "12.5%" },
                        {title: '出单ASIN数量<span id="person_AsinNumber"></span>', field: 'asinNumber',sort: true , width : "12.5%"},
                        {title: '出单SKU数量<span id="person_skuNumber"></span>', field: 'skuNumber',sort: true , width : "12.5%"},
                        {title: '订单量<span id="person_totalOrderNumber"></span>', field: 'orderNumber',sort: true , width : "12.5%"},
                        {title: '商品数量<span id="person_totalNumber"></span>', field: 'quantity',sort: true , width : "12.5%"},
                        {title: '销售额<span id="person_saleAmount"></span>', field: 'saleAmount',sort: true , width : "12.5%"}
                    ];
                    cols.push(col);
                }else if(data.queryType == '3'){//分配店铺维度
                    var col = [
                        {title: '创建人', field: 'creator', templet: '#followstatis_creatorTable'},
                        {title: '店铺', field: 'storeAcct',sort: true },
                        {title: 'ASIN数量<span id="store_quantity"></span>', field: 'quantity',totalRow: true,sort: true }
                    ];
                    cols.push(col);
                }else if (data.queryType === '4'){
                    // console.log("=========================")
                    //首单统计
                    var col = [
                        {title: 'ASIN', field: 'asin'},
                        {title: '站点', field: 'saleSite'},
                        {title: '创建人', field: 'creator'},
                        {title: '创建时间', field: 'createTime', templet    :'#followstatisCreateTime'},
                        {title: '商品SKU', field: 'sku'},
                        {title: '首单店铺', field: 'orderStoreAcct'},
                        {title: '当前店铺', field: 'storeAcct'},
                        {title: '首单单号', field: 'platOrderId'},
                        {title: '订单量<span id="first_totalOrderNumber"></span>', field: 'orderNumber'},
                        {title: '销售额(<span id="first_saleAmount"></span>)', field: 'saleAmount'},
                    ];
                    cols.push(col);
                }
                return cols;
            },
            watchBar: function(searchData){
                table.on('tool(followstatis_tableFilter)',function(obj){
                    var rowData = obj.data;
                    var data = {
                        createPersonId: rowData.createPersonId,
                        creator: rowData.creator,
                        storeAcct: rowData.storeAcct,
                        storeId: rowData.storeId,
                        startTime: searchData.startTime,
                        endTime: searchData.endTime
                    }
                    if(obj.event == 'creator'){
                        layer.open({
                            type:1,
                            title: '明细',
                            area: ['800px','600px'],
                            content: $('#followstatis_detail').html(),
                            id: 'followstatis_detailId',
                            btn: ['关闭'],
                            success: function(layero,index){
                                table.render({
                                    elem: '#followstatis_detailTable',
                                    method: 'post',
                                    url: '/lms/amazonFsStatistics/queryDetail.html',
                                    where: data,
                                    page: false,
                                    limit: 500,
                                    id: "followstatis_detailTableId",
                                    cols:[
                                        [
                                            {title: '创建人', field: 'creator'},
                                            {title: '日期', field: 'date'},
                                            {title: '店铺', field: 'storeAcct'},
                                            {title: 'ASIN数量', field: 'quantity'}
                                        ]
                                    ]
                                });
                            }   
                        })
                    }
                });
            },
            //ajax请求
            //创建人
            creatorAjax: function(){
                return commonReturnPromise({
                    url: '/lms/amazonFsStatistics/queryCreator.html'
                });
            },
            //店铺
            storeAjax: function(){
                return commonReturnPromise({
                    url: '/lms/amazonFsStatistics/queryStore.html'
                });
            },
            //点击创建人查看详情
            viewAjax: function(obj){
                return commonReturnPromise({
                    url: '/lms/amazonFsStatistics/queryDetail.html',
                    type: 'post',
                    contentType: 'application/json',
                    params: JSON.stringify(obj)
                });
            },
            export: function (obj) {
                var confirmindex = layer.confirm('确认导出当前搜索条件下的数据信息？', {btn: ['确认', '取消']}, function (result) {
                    if (result) {
                        layer.close(confirmindex);
                        submitForm(obj, ctx + '/amazonFsStatistics/export.html', "_blank");
                    }
                })
            }
        };
        //创建人和店铺做缓存
        followstatisName.saveTosession();
        followstatisName.renderStore();
        //店铺搜索事件
        form.on('submit(followstatis_submit)', function(data){
            var data = data.field; //获取到表单提交对象
            var obj = followstatisName.dataHandle(data);
            // console.log(obj);
            if(!obj.startTime){
                return layer.msg('请先选择时间!',{icon:7});
            }
            followstatisName.tableRender(obj);
        });
        //导出
        form.on('submit(followstatis_export)', function(data){
            var data = data.field; //获取到表单提交对象
            var obj = followstatisName.dataHandle(data);
            // console.log(obj);
            if(!obj.startTime){
                return layer.msg('请先选择时间!',{icon:7});
            }
            followstatisName.export(obj);
        });
        //固定followstatisCard
        UnifiedFixedFn('followstatisCard');
    });
})();