;(function(){
    layui.use(['admin','table','form','element','layer','laytpl', 'laypage','upload'],function(){
        var admin = layui.admin,
            table = layui.table,
            element = layui.element,
            layer = layui.layer,
            laytpl = layui.laytpl,
            upload = layui.upload,
            laypage = layui.laypage,
            form = layui.form;
        form.render();
        var $form = $('#walmartCatemap_searchForm');
        var walmartCatemapName = {
            //类目切换
            switchCate: function(){
                form.on('radio(walmart_cateFilter)', function(obj){
                    var val = obj.value;
                    if(val =='walmart类目'){
                        $form.find('.productCateClass').addClass('disN');
                        $form.find('.walmartCateClass').removeClass('disN');
                        $form.find('.walmart_cateSelect').addClass('disN');
                        $form.find('.walmart_cateSearch').css({
                            paddingLeft: '40px'
                        });
                    }else{
                        $form.find('.productCateClass').removeClass('disN');
                        $form.find('.walmartCateClass').addClass('disN');
                        $form.find('.walmart_cateSelect').removeClass('disN');
                        $form.find('.walmart_cateSearch').css({
                            paddingLeft: 0
                        });
                    }
                    $('[lay-filter=walmartCatemap_submit]').trigger('click');
                });
            },
            //选择产品分类事件
            cate: function(){
                $('#walmartprod_cateBtn').click(function() {
                    admin.itemCat_select('layer-walmartprod-select-layer',
                    'walmartprod_cateId',
                    'walmartprod_cateDiv');
                })
            },
            //沃尔玛类目渲染
            walmartCate:function(){
                var _this = this;
                $('#walmart_cateBtn').on('click', function(){
                    layer.open({
                        type: 1,
                        title: '映射类目',
                        btn: ['保存', '关闭'],
                        area: ['1100px', '700px'],
                        content: $('#walmartCateSelLayer').html(),
                        id: 'walmartCateSelLayerId',
                        success: function(layero,index){
                            var walmart_cateData = eval('('+sessionStorage.getItem('WALMART_CATE')+')');
                            var getTpl = walmartCateSelLayerContainerTpl.innerHTML,
                            view = document.getElementById('walmartCateSelLayerContainer');
                            laytpl(getTpl).render(walmart_cateData, function(html){
                                view.innerHTML = html;
                                form.render();
                                //监听一级类目选择
                                _this.oneLevel(layero);
                            });
                        },
                        yes: function(index, layero){
                            var $firstTr = layero.find('tbody>tr:first-child');
                            var walmartCategoryName = $firstTr.find('[name=twoLevel] option:selected').text();
                            // $('#walmartCatemap_searchForm').find('[name=walmartCategoryName]').val(walmartCategoryName.split('>>')[1]);
                            $('#walmartCatemap_searchForm').find('[name=walmartCategoryName]').val(walmartCategoryName);
                            $('#walmartCatemap_searchForm').find('#walmart_cateDiv').html(walmartCategoryName);
                            layer.close(index);
                        }
                    });
                });
            },
            iconClick: function(){
                $('#walmart_cateIcon').on('click',function(){
                    $('#walmartCatemap_searchForm').find('[name=walmartCategoryName]').val('');
                    $('#walmartCatemap_searchForm').find('#walmart_cateDiv').html('');
                });
            },
            //批量编辑
            batchEdit:function(){
                var _this = this;
                $('#walmart_cateBatch').on('click', function(){
                    commonTableCksSelected('walmartCate_tableId').then(function(result){
                        _this.batchWalmartCateLayer(result);
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    })
                });
            },
            //表格渲染的数据处理
            dataHandle: function(data){
                var obj = {};
                if(data.cate == '产品类目'){
                    obj.mappingSite = data.mappingSite; //映射站点
                    obj.categoryId = data.categoryId || -1; //产品类目
                    obj.mappingType = data.mappingType; //映射类型
                }else if(data.cate=='walmart类目'){
                    obj.walmartSite = data.walmartSite; //沃尔玛站点
                    obj.mappingSite = obj.walmartSite; //和沃尔玛站点一样
                    obj.mappingType = 0 ;//walmart类目下只能选全部映射类型
                    obj.walmartCategoryName = data.walmartCategoryName || -1; //沃尔玛类目
                }
                return obj;
            },
            //表格渲染
            tableRender: function(data){
                var _this = this;
                table.render({
                    elem: '#walmartCate_table',
                    method: 'post',
                    url: '/lms/cate/walmart/query/mapping.html',
                    where:  data,
                    page: true,
                    limits: [50, 100, 300],
                    limit: 50,
                    id: "walmartCate_tableId",
                    cols: [
                        [
                            {type: 'checkbox', width: 30},
                            {title: '产品类目', field: 'categoryName'},
                            {title: 'Walmart类目', field: 'walmartCategoryName'},
                            {title: '颜色',field: 'color'},
                            {title: '尺寸', field: 'size'},
                            {title: '款式', field: 'style'},
                            {title: 'Product Tax Code', field: 'productTaxCode'},
                            {title: '操作', toolbar: '#walmart_toolBar', width: 80}
                        ]
                    ],
                    done: function(){
                        _this.watchBar();
                    }
                });
            },
            //表格操作
            watchBar: function(){
                var _this = this;
                table.on('tool(walmartCate_table)',function(obj){
                    var data = obj.data;
                    if(obj.event == 'mapping'){
                        _this.walmartCateLayer(data, 'edit');
                    }
                });
            },
            //单个沃尔玛类目弹框
            walmartCateLayer: function(data, type){
                var _this = this;
                if(!data){
                    data = {};
                }
                layer.open({
                    type: 1,
                    title: '映射类目',
                    btn: ['保存', '关闭'],
                    area: ['1100px', '700px'],
                    content: $('#walmartCateLayer').html(),
                    id: 'walmartCateLayerId',
                    success: function(layero,index){
                        var walmart_cateData = eval('('+sessionStorage.getItem('WALMART_CATE')+')');
                        walmart_cateData.productTaxCode = data.productTaxCode || ''; //product tax code
                        walmart_cateData.color = data.color || ''; //颜色
                        walmart_cateData.size = data.size || ''; //尺寸
                        walmart_cateData.style = data.style || ''; //款式
                        walmart_cateData.walmartCategoryId = data.walmartCategoryId || ''; //二级类目id
                        walmart_cateData.oneLevel = data.walmartCategoryName ? data.walmartCategoryName.split('>>')[0] : ''; //以及类目名称
                        var getTpl = walmartCateLayerContainerTpl.innerHTML,
                        view = document.getElementById('walmartCateLayerContainer');
                        laytpl(getTpl).render(walmart_cateData, function(html){
                            view.innerHTML = html;
                            form.render();
                            //监听一级类目选择
                            _this.oneLevel(layero);
                            //回显
                            if(type=='edit'){
                                _this.judge(walmart_cateData, layero);
                            }
                        });
                    },
                    yes: function(index,layero){
                        var obj = {};
                        var productTaxCode = layero.find('[name=productTaxCode]').val();
                        var $firstTr = layero.find('tbody>tr:first-child');
                        if(data.id){
                            obj.id = data.id;
                        }
                        obj.categoryId = data.categoryId; //产品类目id
                        obj.categoryName = data.categoryName; //产品类目名称
                        obj.color = $firstTr.find('[name=color]').val() || ''; //颜色
                        obj.size = $firstTr.find('[name=size]').val() || ''; //尺寸
                        obj.style = $firstTr.find('[name=style]').val() || '';//款式
                        obj.site = 'US'; //站点
                        obj.productTaxCode = productTaxCode ? productTaxCode : data.productTaxCode;
                        obj.walmartCategoryId = $firstTr.find('[name=twoLevel]').val();
                        obj.walmartCategoryName = $firstTr.find('[name=twoLevel] option:selected').text();
                        //非等价判断
                        if((obj.color == obj.size) &&obj.color){
                            return layer.msg('颜色和尺寸不能相同!',{icon:7});
                        }
                        if((obj.color == obj.style) && obj.color){
                            return layer.msg('颜色和款式不能相同!',{icon:7});
                        }
                        if((obj.size == obj.style) && obj.size){
                            return layer.msg('尺寸和款式不能相同!',{icon:7});
                        }
                        _this.singeAjax(obj).then(function(result){
                            layer.close(index);
                            layer.msg(result || '保存类目成功!',{icon:1});
                            $('[lay-filter=walmartCatemap_submit]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }
                });
            },
            //批量编辑沃尔玛类目
            batchWalmartCateLayer: function(resultData){
                var _this = this;
                var index =layer.open({
                    type: 1,
                    title: '映射类目',
                    btn: ['保存', '关闭'],
                    area: ['1100px', '700px'],
                    content: $('#walmartCateLayer').html(),
                    id: 'walmartCateLayerIdAdd',
                    success: function(layero,index){
                        var walmart_cateData = eval('('+sessionStorage.getItem('WALMART_CATE')+')');
                        walmart_cateData.productTaxCode = ''; //product tax code
                        walmart_cateData.color = ''; //颜色
                        walmart_cateData.size = ''; //尺寸
                        walmart_cateData.style = ''; //款式
                        walmart_cateData.walmartCategoryId = ''; //二级类目id
                        walmart_cateData.oneLevel = ''; //以及类目名称
                        var getTpl = walmartCateLayerContainerTpl.innerHTML,
                        view = document.getElementById('walmartCateLayerContainer');
                        laytpl(getTpl).render(walmart_cateData, function(html){
                            view.innerHTML = html;
                            form.render();
                            //监听一级类目选择
                            _this.oneLevel(layero);
                        });
                    },
                    yes: function(index,layero){
                        var objArr = [];
                        var productTaxCode = layero.find('[name=productTaxCode]').val();
                        var $firstTr = layero.find('tbody>tr:first-child');
                        var colorVal = $firstTr.find('[name=color]').val() || '';//颜色
                        var sizeVal =  $firstTr.find('[name=size]').val() || ''; //尺寸
                        var styleVal = $firstTr.find('[name=style]').val() || '';//款式
                        //非等价判断
                        if((colorVal == sizeVal) &&colorVal){
                            return layer.msg('颜色和尺寸不能相同!',{icon:7});
                        }
                        if((colorVal == styleVal) && colorVal){
                            return layer.msg('颜色和款式不能相同!',{icon:7});
                        }
                        if((sizeVal == styleVal) && sizeVal){
                            return layer.msg('尺寸和款式不能相同!',{icon:7});
                        }
                        for(var i=0; i<resultData.length; i++){
                            var item = resultData[i];
                            var obj = {};
                            obj.categoryId = item.categoryId; //产品类目id
                            obj.categoryName = item.categoryName; //产品类目名称
                            obj.color = colorVal; //颜色
                            obj.size = sizeVal; //尺寸
                            obj.style = styleVal;//款式
                            obj.site = 'US'; //站点
                            obj.productTaxCode = productTaxCode ? productTaxCode : item.productTaxCode;
                            obj.walmartCategoryId = $firstTr.find('[name=twoLevel]').val();
                            obj.walmartCategoryName = $firstTr.find('[name=twoLevel] option:selected').text();
                            objArr.push(obj);
                        }
                        _this.batchAjax(objArr).then(function(result){
                            layer.close(index);
                            layer.msg(result || '保存类目成功!',{icon:1});
                            $('[lay-filter=walmartCatemap_submit]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }
                });
            },
            //监控沃尔玛以及类目选择
            oneLevel:function(layero){
                form.on('select(us_oneLevelCate_filter)', function(obj){
                    var sel = obj.elem;
                    var $opt = $(sel).find('option:selected').data('original');
                    var twoLevelArr = $opt.walmartList || [];
                    var otherArr = $opt.categoryVarietyAttributeList || [];
                    var $firstTr = layero.find('tbody>tr:first-child'); 
                    var $twoLevel = $firstTr.find('[name=twoLevel]');//二级类目
                    var $color = $firstTr.find('[name=color]');//颜色
                    var $size = $firstTr.find('[name=size]');//尺寸
                    var $style = $firstTr.find('[name=style]');//款式
                    var twoLevelStr = '';
                    var otherStr = '<option value="">请选择</option>';
                    for(var i=0; i<twoLevelArr.length; i++){
                        var itemI = twoLevelArr[i];
                        twoLevelStr +=`<option value="${itemI.id}">${itemI.fullCategoryName}</option>`;
                    }
                    for(var j=0; j<otherArr.length;j++){
                        var itemJ = otherArr[j];
                        otherStr += `<option value="${itemJ}">${itemJ}</option>`;
                    }
                    $twoLevel.html(twoLevelStr);
                    if($color){
                        $color.html(otherStr);
                    }
                    if($size){
                        $size.html(otherStr);
                    }
                    if($style){
                        $style.html(otherStr);
                    }
                    form.render('select');
                });
            },
            //根据type=edit/add判断回显内容
            judge: function(data,layero){
                var $firstTr = layero.find('tbody>tr:first-child');
                var $oneLevel = $firstTr.find('[name=oneLevel]'); //以及类目
                var $twoLevel = $firstTr.find('[name=twoLevel]');//二级类目
                var $color = $firstTr.find('[name=color]');//颜色
                var $size = $firstTr.find('[name=size]');//尺寸
                var $style = $firstTr.find('[name=style]');//款式
                if(data.oneLevel){
                    $oneLevel.val(data.oneLevel);
                }
                var $opt = $oneLevel.find('option:selected').data('original');
                if(!$opt){
                    $opt =  $oneLevel.find('option:first-child').data('original');
                }
                var twoLevelArr = $opt ? $opt.walmartList :[];
                var twoLevelStr = '';
                for(var i=0; i<twoLevelArr.length; i++){
                    var itemI = twoLevelArr[i];
                    if(itemI.id ==data.walmartCategoryId){
                        twoLevelStr +=`<option value="${itemI.id}" selected>${itemI.fullCategoryName}</option>`;
                    }else{
                        twoLevelStr +=`<option value="${itemI.id}">${itemI.fullCategoryName}</option>`;
                    }
                }
                function renderSSC(type,$opt){
                    var otherArr = $opt.categoryVarietyAttributeList || [];
                    var otherStr = '<option value="">请选择</option>';
                    for(var j=0; j<otherArr.length;j++){
                        var itemJ = otherArr[j];
                        if(itemJ == type){
                            otherStr += `<option value="${itemJ}" selected>${itemJ}</option>`;
                        }else{
                            otherStr += `<option value="${itemJ}">${itemJ}</option>`;
                        }
                    }
                    return otherStr;
                }
                if($color){
                    var $colorStr = renderSSC(data.color,$opt);
                    $color.html($colorStr);
                }
                if($size){
                    var $sizeStr = renderSSC(data.size,$opt);
                    $size.html($sizeStr);
                }
                if($style){
                    var $styleStr = renderSSC(data.style,$opt);
                    $style.html($styleStr);
                }
                $twoLevel.html(twoLevelStr);
                form.render('select');
            },
            //数据缓存
            saveTosession: function(){
                var _this = this;
                if(!sessionStorage.getItem('WALMART_CATE')){
                    _this.walmartAllCateAjax().then(function(result){
                        sessionStorage.setItem('WALMART_CATE', JSON.stringify(result));
                    });
                }
            },
            //导入类目映射
            importCate: function(){
                upload.render({
                    elem: '#walmart_import' //绑定元素
                    ,url: `${ctx}/cate/walmart/save/base.html` //上传接口
                    ,accept: 'file' //允许上传的文件类型
                    ,exts: 'xlsx'
                    ,done: function(res){
                        if(res.code=="0000"){
                            layer.confirm(res.msg, {icon: 1, title:'提示'}, function(index){
                                layer.close(index);
                            });
                        }else{
                            layer.confirm(res.msg, {icon: 2, title:'提示'}, function(index){
                                layer.close(index);
                            });
                        }
                    }
                    ,error: function(){
                        layer.msg('服务器出现故障!');
                    }
                });
            },
            //沃尔玛所有类目接口
            walmartAllCateAjax: function(){
                return commonReturnPromise({
                    url: '/lms/cate/walmart/query/base.html'
                });
            },
            //沃尔玛类目映射单个编辑
            singeAjax: function(data){
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/cate/walmart/save/mapping.html',
                    contentType: 'application/json',
                    params: JSON.stringify(data)
                });
            },
            //批量编辑
            batchAjax: function(data){
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/cate/walmart/batch/save/mapping.html',
                    contentType: 'application/json',
                    params: JSON.stringify(data)
                });
            }
        };
        //切换类目
        walmartCatemapName.switchCate();
        //渲染产品类目
        walmartCatemapName.cate();
        //表单搜索事件
        form.on('submit(walmartCatemap_submit)', function(data){
            var data = data.field; //获取到表单提交对象
            // if(data.cate == '产品类目' && !data.categoryId){
            //     return layer.msg('操作失败：请选择产品类目！',{icon:2});
            // }
            if(data.cate=='walmart类目' && !data.walmartSite){
                return layer.msg('操作失败：请选择沃尔玛站点！',{icon:2});
            }
            // if(data.cate=='walmart类目' && !data.walmartCategoryName){
            //     return layer.msg('操作失败：请选择沃尔玛类目！',{icon:2});
            // }
            var obj = walmartCatemapName.dataHandle(data);
            walmartCatemapName.tableRender(obj);
        });
        //数据做缓存
        walmartCatemapName.saveTosession();
        //类目映射-搜索条件
        walmartCatemapName.walmartCate();
        walmartCatemapName.iconClick();
        //批量编辑
        walmartCatemapName.batchEdit();
        //导入
        walmartCatemapName.importCate();
        //固定表头
        UnifiedFixedFn('walmartCatemapCard');
    });
})();