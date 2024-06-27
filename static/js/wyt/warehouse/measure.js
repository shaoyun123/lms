layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate'],function(){
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        form = layui.form;
    form.render();

    //时间渲染
    laydate.render({
        elem: '#measure_timesRange'
        ,range: true
    });

    element.on('tab(measure-tabs)', function (data) {
        if(data.index == 0){ //待测量
            $('#measure_ifMeasure').val(0);
            $('.measurePerson').removeClass('disN');
            $('.measureTimes').addClass('disN');
            $('.measureReason').addClass('disN');
            $('.measureInitBtn').removeClass('disN');
            $('#measure_batchDel').removeClass('disN');
        }else if(data.index == 1){ //已测量
            $('#measure_ifMeasure').val(1);
            $('.measurePerson').removeClass('disN');
            $('.measureTimes').removeClass('disN');
            $('.measureReason').addClass('disN');
            $('.measureInitBtn').addClass('disN');
            $('#measure_batchDel').addClass('disN');
        }else if(data.index == 2){ //无法测量
            $('#measure_ifMeasure').val(2);
            $('.measurePerson').removeClass('disN');
            $('.measureTimes').addClass('disN');
            $('.measureReason').removeClass('disN');
            $('.measureInitBtn').removeClass('disN');
            $('#measure_batchDel').addClass('disN');
        }else if(data.index == 3){ //全部
            $('#measure_ifMeasure').val('');
            $('.measurePerson').removeClass('disN');
            $('.measureTimes').removeClass('disN');
            $('.measureReason').removeClass('disN');
            $('.measureInitBtn').addClass('disN');
            $('#measure_batchDel').addClass('disN');
        }
        // $('.measurePerson').find('input').val('');
        // $('.measureTimes').find('input').val('');
        // $('.measureReason').find('input').val('');
        $('[lay-filter=measure_submit]').trigger('click');
    });

    var measureName = {
        //数据处理
        dataHandle: function(data){
            if(data.measureTimes){
                var timeArr =data.measureTimes.split(' - ');
                data.measureTimeStart = timeArr[0];
                data.measureTimeEnd = timeArr[1];
            }else{
                data.measureTimeStart = '';
                data.measureTimeEnd ='';
            }
            data.measureStatus = $('#measure_ifMeasure').val();
            delete data.measureTimes;
            return data;
        },
        //初始化按钮点击事件
        initBtnHandle: function(){
            var _this = this;
            $('.measureInitBtn').on('click', function(){
                var checkStatus = table.checkStatus('measure_tableId')
                , data = checkStatus.data;
                if(!data.length){
                    return layer.msg('请先选中一条数据');
                };
                var idsArr = data.map(function(item){
                    return item.id;
                })
                var ids = idsArr.join(',');
                _this.initMeasureAjax(ids).then(function(result){
                    layer.msg(result || '初始化数据成功!');
                    $('[lay-filter="measure_submit"]').trigger('click');
                }).catch(function(err){
                    layer.msg(err);
                })
            });
        },
        //根据开发专员渲染表格
        bizzOwnerTable: function(data){
            var cols;
            if(data.measureStatus == 2){
              cols =  [
                    [
                        {type: 'checkbox', width: 32},
                        {title: 'SKU',field: 'sSku', templet: '#measureLayer_sSku', width: 148},
                        {title: '组合品明细', templet: '#measureLayer_combination', width: 128},
                        {title: '中文名称', field: 'cnTitle'},
                        {title: '计划英国信件', field: 'ifUKLetterMeasure', width: 61, templet: '#measure_ifUKLetterMeasure'},
                        {title: '计划德国信件', field: 'ifDELetterMeasure', width: 61, templet: '#measure_ifDELetterMeasure'},
                        {title: '采购成本(¥)', field: 'purchaseCostPrice', width: 90},
                        {title: '重量(g)', field: 'weight', templet: '#measure_weight', width: 110},
                        {title: '尺寸(cm)', field: 'size', templet: '#measure_size', width: 100},
                        {title: '英国信件', field: 'english', templet: '#measure_eng', width: 40},
                        {title: '德国信件', field: 'germany', templet: '#measure_ger', width: 40},
                        {title: '开发专员', field: 'bizzOwner'},
                        {title: '需求时间', field: 'createTime', templet: `<div><div>{{Format(d.createTime,'yyyy-MM-dd')}}</div></div>`},
                        {title: '测量人', field: 'operator'},
                        {title: '无法测量原因', field: 'unmeasureReason'},
                        {title: '备注', field: 'remark'},
                        {title: '测量时间', field: 'measureTime', templet: `<div><div>{{Format(d.measureTime,'yyyy-MM-dd')}}</div></div>`},
                        // {title: '操作', toolbar: '#measure_toolBar', width: 60}
                    ]
                ]
            }else if(data.measureStatus === '0'){
                cols = [
                    [
                        {type: 'checkbox', width: 32},
                        {title: 'SKU',field: 'sSku', templet: '#measureLayer_sSku', width: 148},
                        {title: '组合品明细', templet: '#measureLayer_combination', width: 128},
                        {title: '中文名称', field: 'cnTitle'},
                        {title: '计划英国信件', field: 'ifUKLetterMeasure', width: 61, templet: '#measure_ifUKLetterMeasure'},
                        {title: '计划德国信件', field: 'ifDELetterMeasure', width: 61, templet: '#measure_ifDELetterMeasure'},
                        {title: '采购成本(¥)', field: 'purchaseCostPrice', width: 90},
                        {title: '重量(g)', field: 'weight', templet: '#measure_weight', width: 110},
                        {title: '尺寸(cm)', field: 'size', templet: '#measure_size', width: 100},
                        {title: '英国信件', field: 'english', templet: '#measure_eng', width: 40},
                        {title: '德国信件', field: 'germany', templet: '#measure_ger', width: 40},
                        {title: '开发专员', field: 'bizzOwner'},
                        {title: '需求时间', field: 'createTime', templet: `<div><div>{{Format(d.createTime,'yyyy-MM-dd')}}</div></div>`},
                        {title: '测量人', field: 'operator'},
                        {title: '操作', toolbar: '#measure_toolBar', width: 60}
                    ]
                ]
            }else{
                cols = [
                    [
                        {type: 'checkbox', width: 32},
                        {title: 'SKU',field: 'sSku', templet: '#measureLayer_sSku', width: 148},
                        {title: '组合品明细', templet: '#measureLayer_combination', width: 128},
                        {title: '中文名称', field: 'cnTitle'},
                        {title: '计划英国信件', field: 'ifUKLetterMeasure', width: 61, templet: '#measure_ifUKLetterMeasure'},
                        {title: '计划德国信件', field: 'ifDELetterMeasure', width: 61, templet: '#measure_ifDELetterMeasure'},
                        {title: '采购成本(¥)', field: 'purchaseCostPrice', width: 90},
                        {title: '重量(g)', field: 'weight', templet: '#measure_weight', width: 110},
                        {title: '尺寸(cm)', field: 'size', templet: '#measure_size', width: 100},
                        {title: '英国信件', field: 'english', templet: '#measure_eng', width: 40},
                        {title: '德国信件', field: 'germany', templet: '#measure_ger', width: 40},
                        {title: '开发专员', field: 'bizzOwner'},
                        {title: '需求时间', field: 'createTime', templet: `<div><div>{{Format(d.createTime,'yyyy-MM-dd')}}</div></div>`},
                        {title: '测量人', field: 'operator'},
                        {title: '测量时间', field: 'measureTime', templet: `<div><div>{{Format(d.measureTime,'yyyy-MM-dd')}}</div></div>`},
                        // {title: '操作', toolbar: '#measure_toolBar', width: 60}
                    ]
                ]
            }
            var _this = this;
            table.render({
                elem: '#measure_table',
                method: 'get',
                url: '/lms/winitDimensionMeasure/queryPage.html',
                where:  data,
                page: true,
                limits: [50, 100, 300],
                limit: 50,
                id: "measure_tableId",
                cols: cols,
                done: function(res){                  
                    _this.getMeasureNumber(data).then(function(result){
                        $('#measure-tabs').find('li>span.if_measure_false').text(result.if_measure_false);
                        $('#measure-tabs').find('li>span.if_measure_true').text(result.if_measure_true);
                        $('#measure-tabs').find('li>span.if_measure_all').text(result.if_measure_all);
                        $('#measure-tabs').find('li>span.if_measure_un').text(result.if_measure_un);
                    });
                    _this.measureWatchBar();
                }
            })
        },
        measureWatchBar: function(){
            var _this = this;
            table.on('tool(measure_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'delete'){
                    layer.confirm('确定要删除该测量数据吗?', {icon: 6, title:'测量'}, function(index){
                        _this.deleteAjax(JSON.stringify([data.id])).then(function(result){
                            layer.msg(result || '删除成功!');
                            $('[lay-filter="measure_submit"]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon: 2});
                        })
                        layer.close(index);
                    });
                }
            })
        },
        //批量删除
        batchDelete: function(){
            var _this = this;
            $('#measure_batchDel').on('click', function(){
                commonTableCksSelected('measure_tableId').then(function(result){
                    var idArr = result.map(function(item){
                        return item.id;
                    });
                    layer.confirm('确定要删除该测量数据吗?', {icon: 6, title:'测量'}, function(index){
                        _this.deleteAjax(JSON.stringify(idArr)).then(function(result){
                            layer.msg(result || '删除成功!');
                            $('[lay-filter="measure_submit"]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon: 2});
                        })
                        layer.close(index);
                    });
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            })
        },
        //测量弹框
        measureHandle: function(){
            var _this = this;
            $('#measure_handleBtn').on('click', function(){
                layer.open({
                    type: 1,
                    title: '尺寸测量',
                    btn: ['关闭'],
                    // area: ['1250px', '700px'],
                    area: ['100%', '700px'],
                    content: $('#measureDetail_layer').html(),
                    id: 'measureDetail_layerId',
                    success: function(layero, index){
                        _this.renderWarehouse(layero);
                        _this.renderBuilding(layero);
                        _this.renderFloor(layero);
                        _this.packageAjax().then(function(packages){
                            localStorage.setItem('packages', JSON.stringify(packages));
                        });
                        // 表单搜索事件
                        form.on('submit(measureLayer_submit)', function(data){
                            var data = data.field; //获取到表单提交对象
                            data.showNums = 50;
                            delete data.count;
                            _this.getBatchTable(data, layero);
                        });
                        //监听input输入
                        layero.on('input', '[ztt-verify=priority]', function(e){
                            var val= e.target.value.trim();
                            if(!val || val == 0){
                                if(!$(e.target).hasClass('layui-form-danger')){
                                    $(e.target).addClass('layui-form-danger').focus();
                                    layer.msg('必填项不能为空或0', {
                                        offset: ['70px'],
                                        icon: 2
                                    });
                                }
                            }else{
                                $(e.target).removeClass('layui-form-danger').focus();
                            }
                        });
                    },
                    end: function(){
                        localStorage.removeItem('measureCopy');
                        localStorage.removeItem('packages');
                        $('[lay-filter="measure_submit"]').trigger('click');
                    }
                })
            })
        },
        //获取批次表格
        getBatchTable: function(data,layero){
            var _this = this;
            table.render({
                elem: '#measureLayer_table',
                method: 'post',
                url: '/lms/winitDimensionMeasure/queryDataByBatchNo.html',
                where:  data,
                page: false,
                height: 430,
                limits: [50, 100, 300],
                limit: 50,
                id: "measureLayer_tableId",
                cols: [
                    [
                        {title: '图片',field: 'image', templet: '#measureLayer_img', width: 70},
                        {title: 'SKU',field: 'sSku', templet: '#measureLayer_sSku_batch'},
                        {title: '组合品明细', templet: '#measureLayer_combination_batch'},
                        // {title: '库位', field: 'locationCode', templet: '#measureLayer_locationCode', width: 120},
                        {title: '库位', templet: '#measureLayer_location_batch'},
                        {title: '可用库存', field: 'whStockWarning', templet: '#measureLayer_whStockWarning', width: 45},
                        {title: '楼栋', templet: '#measureLayer_buildingNo', width: 45},
                        {title: '楼层', templet: '#measureLayer_floor', width: 45},
                        {title: '款式',templet: '#measureLayer_style_batch'},
                        // {title: '创建时间', templet: `<div><div>{{Format(d.prodSInfo.createTime,'yyyy-MM-dd')}}</div></div>`},
                        {title: '包装规格', templet: '#measureLayer_package', width:140},
                        {title: '无法测量原因(点击编辑)',field: 'unmeasureReason', edit: 'text', width: 100},
                        {title: '<font color="red">*</font>重量(kg)',templet: '#measureLayer_weight',width: 100},
                        {title: '<font color="red">*</font>包裹长(cm)',templet: '#measureLayer_length',width: 100},
                        {title: '<font color="red">*</font>包裹宽(cm)',templet: '#measureLayer_width',width: 100},
                        {title: '<font color="red">*</font>包裹高(cm)',templet: '#measureLayer_height',width: 100},
                        {title: '备注(点击编辑)',field: 'remark', edit: 'text',width: 100},
                        // {title: '压缩数量',templet: '#measureLayer_compress'},
                        // {title: '压缩整体高(cm)',templet: '#measureLayer_compressHeight'},
                        // {title: '叠加数量',templet: '#measureLayer_superposition'},
                        // {title: '叠加整体高(cm)',templet: '#measureLayer_superpositionHeight'},
                        {title: '操作', toolbar: '#measureLayer_toolBar', width: 60}
                    ]
                ],
                done: function(res){
                    form.render('select');
                    if(res.data.length){
                        _this.watchBar(layero, data.whId);
                        imageLazyload();
                        _this.blurSubmitHandle();
                        var count = res.count;
                        $('#measure_layerTableCount').html(count);
                    }
                }
            })
        },
        //失去焦点提交代码
        blurSubmitHandle: function(){
            var $table = $('#measureLayer_table').next().find('.layui-table-body.layui-table-main>table');
            var anchorPoint = '';
            $table.on('focus', 'tr input', function(){
                var $tr = $(this).parents('tr');
                if(judgeIsEmpty(anchorPoint)){
                    anchorPoint = $tr;
                    console.log('完成赋值')
                }else{
                    if(anchorPoint[0] == $tr[0]){

                    }else{
                        $(anchorPoint[0]).find('[lay-event="submit"]').trigger('click');
                        anchorPoint = $tr;
                    }
                }
            });
            $table.on('blur', 'input.measureLayer_weightInput', function(){
                var $td = $(this).parents('td');
                var $suttleWeight = $td.find('[name=suttleWeight]').val();
                var $packWeight = $td.find('[name=packWeight]').val();
                var $total = Number($suttleWeight) + Number($packWeight);
                var $val = Number($(this).val()) || 0;
                var isOver = ($val - $total)/$total >0.5 ? true : false;
                if(isOver){
                    layer.msg('输入商品重量超过原重量50%,请注意!', {
                        icon: 0
                    })
                }
            })
        },
        //弹框表格工具条
        watchBar: function(layero, whId){
            var _this = this;
            table.on('tool(measureLayer_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event =='copy'){
                    _this.copyFn($(this));
                }else if(obj.event == 'paste'){
                    _this.pasteFn($(this));
                }else if(obj.event == 'submit'){
                    var $tr = $(this).parents('tr');
                    var obj = {};
                    obj.id = data.id;
                    obj.prodSId = data.prodSId;
                    obj.prodWeight = Number(($tr.find('[name=weight]').val().trim())*1000);//产品重量
                    obj.wrapHeight = Number($tr.find('input[name=height]').val().trim()); //包裹高
                    obj.wrapLength = Number($tr.find('input[name=length]').val().trim()); //包裹长
                    obj.wrapWidth = Number($tr.find('input[name=width]').val().trim()); //包裹宽
                    obj.remark = $tr.find('td[data-field=remark]>div').text(); //备注
                    obj.unmeasureReason = $tr.find('td[data-field=unmeasureReason]>div').text(); //无法测量原因
                    obj.winitPackSpecId = $tr.find('select[name=winitPackSpecId]').val();//包装规格
                    if(!obj.unmeasureReason){
                        if(judgeIsEmpty(obj.prodWeight)){
                            $tr.find('[name=weight]').addClass('layui-form-danger').focus();
                            return layer.msg('产品不能为空或0',{
                                offset: ['70px'],
                                icon: 2
                            });
                        }else{
                            $tr.find('[name=weight]').removeClass('layui-form-danger');
                        }
                        if(judgeIsEmpty(obj.wrapLength)){
                            $tr.find('[name=length]').addClass('layui-form-danger').focus();
                            return layer.msg('包裹长不能为空或0',{
                                offset: ['70px'],
                                icon: 2
                            });
                        }else{
                            $tr.find('[name=length]').removeClass('layui-form-danger');
                        }
                        
                        if(judgeIsEmpty(obj.wrapWidth)){
                            $tr.find('[name=width]').addClass('layui-form-danger').focus();
                            return layer.msg('包裹宽不能为空或0',{
                                offset: ['70px'],
                                icon: 2
                            });
                        }else{
                            $tr.find('[name=width]').removeClass('layui-form-danger');
                        }
                        if(judgeIsEmpty(obj.wrapHeight)){
                            $tr.find('[name=height]').addClass('layui-form-danger').focus();
                            return layer.msg('包裹高不能为空或0',{
                                offset: ['70px'],
                                icon: 2
                            });
                        }else{
                            $tr.find('[name=height]').removeClass('layui-form-danger');
                        }
                        //包裹长大大于15
                        if(obj.wrapLength <15){
                            $tr.find('[name=length]').addClass('layui-form-danger').focus();
                            return layer.msg('包裹长不能小于15cm!',{icon:2});
                        }else{
                            $tr.find('[name=length]').removeClass('layui-form-danger');
                        }
                        if(obj.wrapWidth <10){
                            $tr.find('[name=width]').addClass('layui-form-danger').focus();
                            return layer.msg('包裹宽不能小于10cm!',{icon:2});
                        }else{
                            $tr.find('[name=width]').removeClass('layui-form-danger');
                        }
                        
                        if((obj.wrapLength < obj.wrapWidth) || (obj.wrapLength<obj.wrapHeight) || (obj.wrapWidth<obj.wrapHeight)){
                            return layer.msg('包裹长宽高需满足长>=宽>=高!',{icon:2});
                        }
                        //包裹宽大于10
                        //包裹长>=宽>=高
                    }

                    _this.submitMeasureAjax(JSON.stringify(obj)).then(function(result){
                            layer.msg('提交成功',{icon: 1});
                    }).catch(function(err){
                        layer.msg(err);
                    })

                }
            })
        },
        copyFn: function($this){
            var $tr = $this.parents('tr');
            var obj = {};
            obj.prodWeight = Number($tr.find('input[name=weight]').val().trim());//产品重量
            obj.wrapHeight = Number($tr.find('input[name=height]').val().trim()); //包裹高
            obj.wrapLength = Number($tr.find('input[name=length]').val().trim()); //包裹长
            obj.wrapWidth = Number($tr.find('input[name=width]').val().trim()); //包裹宽
            // obj.compress_number = Number($tr.find('input[name=compress_number]').val().trim()); //压缩数量
            // obj.compressHeight = Number($tr.find('input[name=compressHeight]').val().trim()); //压缩整体高
            // obj.superposition_number = Number($tr.find('input[name=superposition_number]').val().trim()); //叠加数量
            // obj.superpositionHeight = Number($tr.find('input[name=superpositionHeight]').val().trim()); //叠加整体高
            if(judgeIsEmpty(obj.prodWeight) || judgeIsEmpty(obj.wrapHeight)|| judgeIsEmpty(obj.wrapLength) || judgeIsEmpty(obj.wrapWidth)){
                return layer.msg('复制的必填项产品重量/包裹长/包过高/包裹宽不能为空',{
                    offset: ['70px'],
                    icon: 2
                });
            }
            localStorage.setItem('measureCopy', JSON.stringify(obj));
            layer.msg('复制成功', {
                offset: ['70px'],
                icon: 1
            });

        },
        pasteFn: function($this){
            var $tr = $this.parents('tr');
            var obj = JSON.parse(localStorage.getItem('measureCopy'));
            $tr.find('input[name=weight]').val(obj.prodWeight);
            $tr.find('input[name=height]').val(obj.wrapHeight);
            $tr.find('input[name=length]').val(obj.wrapLength);
            $tr.find('input[name=width]').val(obj.wrapWidth);
            // $tr.find('input[name=compress_number]').val(obj.compress_number);
            // $tr.find('input[name=compressHeight]').val(obj.compressHeight);
            // $tr.find('input[name=superposition_number]').val(obj.superposition_number);
            // $tr.find('input[name=superpositionHeight]').val(obj.superpositionHeight);
            layer.msg('粘贴成功!',{
                offset: ['70px'],
                icon: 1
            });
        },
        //渲染开发专员
        renderBizzOwner: function(){
            this.getProdOwnerAjax().then(function(result){
                var str = '';
                for(let [index, item] of result.entries()){
                    str += `<option value="${item.id}">${item.userName}</option>`
                }
                $('#measure_bizzOwnerSelect').append(str);
                formSelects.render();
            })
        },
        //渲染仓库
        renderWarehouse: function(layero){
            this.getWarehouseAjax().then(function(result){
                var str = '';
                for(let [index, item] of result.entries()){
                    str += `<option value="${item.id}">${item.warehouseName}</option>`;
                }
                layero.find('select[name=whId]').append(str);
                form.render('select');
            }).catch(function(err){
                layer.msg(err);
            })
        },
        //渲染楼栋
        renderBuilding: function(layero){
            this.getBuildingAjax().then(function(result){
                var str = '<option value="">请选择</option>';
                for(let [index, item] of result.entries()){
                    str += `<option value="${item}">${item}</option>`;
                }
                layero.find('select[name=buildingNo]').append(str);
                form.render('select');
            }).catch(function(err){
                layer.msg(err);
            })
        },
        //渲染楼层
        renderFloor: function(layero){
            this.getFloorAjax().then(function(result){
                var str = '<option value="">请选择</option>';
                for(let [index, item] of result.entries()){
                    str += `<option value="${item}">${item}</option>`;
                }
                layero.find('select[name=floorNo]').append(str);
                form.render('select');
            }).catch(function(err){
                layer.msg(err);
            });
        },
        //ajax请求
        //获取开发专员
        getProdOwnerAjax: function(){
            return commonReturnPromise({
                type: 'post',
                url: '/lms/sys/prodOwnerList.html'
            })
        },
        //获取仓库
        getWarehouseAjax: function(){
            return commonReturnPromise({
                url: '/lms/skuLocationTransfer/getAuthedProdWarehouseList.html'
            })
        },
        //获取楼栋
        getBuildingAjax: function(){
            // return commonReturnPromise({
            //     type: 'post',
            //     contentType: 'application/json',
            //     url: '/lms/skuLocationTransfer/getBuildingNo.html'
            // })
            return new Promise(function(resolve, reject){
                resolve([1,2])
            })
        },
        //获取楼层
        getFloorAjax: function(){
            // return commonReturnPromise({
            //     url: '/lms/winitDimensionMeasure/getFloorNo.html',
            //     params: {
            //         warehouseId: warehouseId,
            //         buildingNo: buildingId
            //     }
            // })
            return new Promise(function(resolve, reject){
                resolve([1,2,3,4,5,6,7]);
            })
        },
        //提交测量数据
        submitMeasureAjax: function(obj){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/winitDimensionMeasure/saveMeasureData.html',
                params: obj
            })
        },
        //尺寸测量的数量获取
        getMeasureNumber: function(data){
            return commonReturnPromise({
                url: '/lms/winitDimensionMeasure/countStatusForTab.html',
                params: data
            })
        },
        //初始化接口
        initMeasureAjax: function(ids){
            return commonReturnPromise({
                type: 'post',
                url: '/lms/winitDimensionMeasure/initMeasureData.html',
                params: {
                    ids: ids
                }
            })
        },
        //删除测量接口
        deleteAjax: function(obj){
            return commonReturnPromise({
                type: 'post',
                url: '/lms/winitDimensionMeasure/deleteMeasureData.html',
                contentType: 'application/json',
                params: obj
            })
        },
        //包装规格接口
        packageAjax: function(){
            return commonReturnPromise({
                url: '/lms/winitDimensionMeasure/getWinitProdPackSpecs.html'
            })
        }
    }


    //表头固定
    UnifiedFixedFn('measureCard');
    //测量弹框
    measureName.measureHandle();
    //渲染开发专员
    measureName.renderBizzOwner();
    //初始化按钮
    measureName.initBtnHandle();
    //批量删除
    measureName.batchDelete();
    
    // 表单搜索事件
    form.on('submit(measure_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var obj = measureName.dataHandle(data);
        measureName.bizzOwnerTable(obj);
    });

})

//判空函数
function judgeIsEmpty(value) {
    return (
        value === undefined ||
        value === null ||
        value === 0 ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
    );
}