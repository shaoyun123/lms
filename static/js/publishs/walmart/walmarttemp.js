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
        //渲染时间walmarttemp_times
        laydate.render({
            elem: '#walmarttemp_times'
            ,range: true
        });
        formSelects.render('walmarttemp_prodIsSaleStatus')
        element.on('tab(walmarttemp_tabs)', function (data) {
            var $searchType = $('#walmarttemp_searchForm').find('[name=searchType]');
            if(data.index == 0){ //普通模板
                $searchType.val('base');
                $('.walmarttemp_creator').addClass('disN');
                $('.walmarttemp_mode').removeClass('disN');
            }else if(data.index == 1){ //walmart模板
                $searchType.val('walmart');
                $('.walmarttemp_creator').removeClass('disN');
                $('.walmarttemp_mode').addClass('disN');
            }
            $('[lay-filter=walmarttemp_submit]').trigger('click');
        });
        var walmarttempName = {
            //选择分类事件
            cate: function(){
                $('#walmarttemp_cateBtn').click(function() {
                    admin.itemCat_select('layer-publishs-select-layer',
                    'walmarttemp_cateId',
                    'walmarttemp_cateDiv');
                });
            },
            //select初始化缓存
            selectCache: function(){
                var _this = this;
                if(!sessionStorage.getItem('WALMART_SELECTINIT')){
                    _this.initAjax().then(function(result){
                        sessionStorage.setItem('WALMART_SELECTINIT', JSON.stringify(result));
                    });
                };
                if(!sessionStorage.getItem('WALMART_CATE')){
                    _this.walmartCateAjax().then(function(result){
                        sessionStorage.setItem('WALMART_CATE', JSON.stringify(result));
                    });
                }
            },
            //渲染搜索select
            renderSelectFn:function(selectInitArr,walmart_cateData){
                //开发专员
                commonRenderSelect('walmarttemp_bizzOwnderIdStr', selectInitArr.bizzOwners, {
                    name: 'userName',
                    code: 'id'
                }).then(function(){
                    formSelects.render('walmarttemp_devPerson');
                });
                //标签
                commonRenderSelect('walmarttemp_tag', selectInitArr.tags, {
                    name: 'name',
                    code: 'name'
                }).then(function(){
                    form.render('select');
                });
                //模板创建人
                commonRenderSelect('walmarttemp_modeCreatId', selectInitArr.walmartCreatMap, {
                    name: 'userName',
                    code: 'id'
                }).then(function(){
                    form.render('select');
                });
                //物流属性
                commonRenderSelect('walmarttemp_logisticsAttrStr', selectInitArr.logisAttrList).then(function(){
                    formSelects.render('walmarttemp_logisticsAttrStr');
                    formSelects.value('walmarttemp_logisticsAttrStr', ["普货"]);
                });
                //开发类型
                commonRenderSelect('walmarttemp_devTypeStr', selectInitArr.devTypes).then(function(){
                    formSelects.render('walmarttemp_devTypeStr');
                });
                //渲染沃尔玛类目
                var optStr = '<option value="">全部</option>';
                for(var i=0;i<walmart_cateData.length; i++){
                    var item = walmart_cateData[i];
                    var sonList = item.walmartList || [];
                    optStr += `<option value="${item.parentCategoryName}">${item.parentCategoryName}<option>`;
                    if(sonList.length >0) {
                        for(var j=0; j<sonList.length;j++){
                            var sonJ = sonList[j];
                            optStr +=`<option value="${sonJ.categoryName}">&nbsp;&nbsp;${sonJ.categoryName}</option>`;
                        }
                    }
                }
                $('#walmarttemp_cateName').html(optStr);
                form.render('select');
            },
            renderSelect: function(){
                var _this = this;
                //创建人和沃尔玛类目
                var selectInitArr = sessionStorage.getItem('WALMART_SELECTINIT');
                var walmart_cateData = sessionStorage.getItem('WALMART_CATE');
                if(!selectInitArr || !walmart_cateData){
                    Promise.all([_this.initAjax(),_this.walmartCateAjax()]).then(function(result){
                        _this.renderSelectFn(result[0], result[1]);
                    });
                }else{
                    _this.renderSelectFn(eval('('+selectInitArr+')'), eval('('+walmart_cateData+')'));
                }
            },
            //数据处理
            dataHandle: function(data){
                if(data.times){
                    var timeArr =data.times.split(' - ');
                    data.skuTimeStart = timeArr[0];
                    data.skuTimeEnd = timeArr[1];
                }else{
                    data.skuTimeStart = '';
                    data.skuTimeEnd ='';
                }
                if(data.searchType == 'walmart'){
                    data.walmartModeStatus = 1;
                }
                delete data.times;
                return data;
            },
            //表格渲染
            tableRender: function(data){
                var _this = this;
                table.render({
                    elem: '#walmarttemp_table',
                    method: 'post',
                    url: '/lms/mode/walmart/query/model.html',
                    where:  data,
                    page: true,
                    limits: [50, 100, 300],
                    limit: 50,
                    id: "walmarttemp_tableId",
                    cols: _this.colsSwitch(data),
                    done: function(res){
                        _this.watchBar();
                        imageLazyload();
                        $('#walmarttemp_tabs').find('li>span').html('');
                        $('#walmarttemp_tabs').find('li.layui-this>span').html(`(${res.count})`);
                    }
                });
            },
            colsSwitch: function(data){
                var cols = [];
                if(data.searchType==='base'){
                    var col = [
                        {type: 'checkbox', width: 30},
                        {title:'图片',field: 'image',templet:'#walmarttemp_img', width: 70},
                        {title: '英文标题', field: 'enTitle'},
                        {title: '商品名', field: 'cnTitle'},
                        {title: '开发专员', field: 'bizzOwner',width:75},
                        {title: '父SKU',field:'pSku', templet: '#walmarttemp_pSku',width:120},
                        {field: "detail",unresize:true,width:400,title: `
                        <div style="display:flex;">
                            <div style="width:130px;text-align:left;">子SKU</div>
                            <div style="width:60px;text-align:center;">颜色</div>
                            <div style="width:60px;text-align:center;">尺寸</div>
                            <div style="width:60px;text-align:center;">在售</div>
                            <div style="width:80px;text-align:center;">有沃尔玛模板</div>
                        </div>
                        `,style:"vertical-align: top",templet:"#walmarttemp_detail"},
                        {title: '公司销量',field: '', templet: function(d){
                                let str = `<div>7日：${d.sevenDaySales|| "0"}</div>
                                    <div>15日：${d.fifteenDaySales||"0"}</div>
                                    <div>30日：${d.thirtyDaySales||"0"}</div>`
                                return str
                            },width:130},
                        {title: '时间',field: 'time', templet: '#walmarttemp_time',width:164},
                        {title: '操作', toolbar: '#walmarttemp_toolBar',width:120}
                    ];
                    cols.push(col);
                }else{
                    var col = [
                        {title:'图片',field: 'image',templet:'#walmarttemp_img', width: 70},
                        {title: '英文标题', field: 'enTitle'},
                        {title: '商品名', field: 'cnTitle'},
                        {title: '开发专员', field: 'bizzOwner',width:75},
                        {title: '父SKU',field:'pSku', templet: '#walmarttemp_pSku',width:120},
                        {field: "detail",unresize:true,width:320,title: `
                        <div style="display:flex;">
                            <div style="width:130px;text-align:left;">子SKU</div>
                            <div style="width:60px;text-align:center;">颜色</div>
                            <div style="width:60px;text-align:center;">尺寸</div>
                            <div style="width:60px;text-align:center;">在售</div>
                        </div>
                        `,style:"vertical-align: top",templet:"#walmarttemp_detail_walmart"},
                        {title: '站点', field: 'site', width:65},
                        {title: '沃尔玛分类', field: 'walmartCategoryName'},
                        {title: '模板创建人', field: 'walmartModeCreat'},
                        {title: '公司销量',field: '', templet: function(d){
                                let str = `<div>7日：${d.sevenDaySales|| "0"}</div>
                                    <div>15日：${d.fifteenDaySales||"0"}</div>
                                    <div>30日：${d.thirtyDaySales||"0"}</div>`
                                return str
                            },width:130},
                        {title: '时间', field: 'timew', templet: '#walmarttemp_time_walmart',width:164},
                        {title: '操作', toolbar: '#walmarttemp_toolBar_walmart',width:90}
                    ];
                    cols.push(col);
                }
                return cols;
            },
            watchBar: function(){
                var _this = this;
                table.on('tool(walmarttemp_tableFilter)',function(objTr){
                    var data = objTr.data;
                    if(objTr.event == 'newBulid'){ //新建
                        var obj = {
                            categoryId: data.cateId,
                            pSku: data.pSku,
                            site: data.site || 'US'
                        };
                        // var obj = {
                        //     categoryId: 353,
                        //     pSku: 'DZYB6B82'
                        // };
                        _this.newBulidOrEditAjax(obj).then(function(result){
                            result.trData = data;
                            _this.renderTemplateDetail(result, '新建', objTr.tr);
                        }).catch(function(err){
                            layer.confirm(err,{icon:2,title: '提示'},function(index1){
                                layer.close(index1);
                            });
                        });
                    }else if(objTr.event == 'delete'){//删除
                        _this.deleteAjax(data.walmartModeId).then(function(result){
                            layer.msg(result || '删除沃尔玛模板成功!',{icon:1});
                            $('[lay-filter=walmarttemp_submit]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }else if(objTr.event == 'edit'){ //修改
                        var obj = {
                            id: data.walmartModeId
                        };
                        _this.newBulidOrEditAjax(obj).then(function(result){
                            result.trData = data;
                            _this.renderTemplateDetail(result, '编辑', objTr.tr);
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }
                });
            },
            //展示tips
            showTips: function(){
                $('#walmarttempCard').on('mouseenter', '.tortPlatList', function(){
                    var platStr = $(this).data('plat') + '侵权';
                    layer.tips(platStr, $(this), {
                        tips: [3, '#0FA6D8'], //还可配置颜色
                        time: 0
                    });
                });
                $('#walmarttempCard').on('mouseleave', '.tortPlatList', function(){
                    layer.closeAll();
                });
            },
            // 批量生成walmart模板
            walmartTempBatchBtn: function(){
                let _this = this
                $("#walmartTempBatchBtn").click(()=>{
                    let checkData = layui.table.checkStatus("walmarttemp_tableId").data,obj = [];
                    checkData.forEach(item=>{
                        obj.push({
                            categoryId:item.cateId,
                            psku:item.pSku,
                            site:'US',
                            pid:item.pId
                        })
                    })

                    _this.saveBatchAjax(obj).then(function(result){
                        if(Object.prototype.toString.call(result) == "[object Array]"){
                            let str = ''
                            result.forEach(item =>{
                                str += item + '<br>'
                            })
                            layer.open({
                                type:1,
                                title: '生成结果'
                                ,content: '<div style="padding:10px;max-height:500px;overflow-y:auto">'+str+"</div>"
                            });
                        }else{
                            layer.msg(result,{icon:1});
                        }
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    })
                })
            },
            //渲染新建/编辑的详情功能
            renderTemplateDetail: function(data, type, dom){
                var _this = this;
                layer.open({
                    type: 1,
                    title: type +'沃尔玛模板',
                    btn: ['保存','取消'],
                    area: ['800px', '90%'],
                    id: 'walmarttemp_newOrEditLayerId',
                    content: $('#walmarttemp_newOrEditLayer').html(),
                    success: function(layero,index){
                        var getTpl = walmarttemp_newOrEdit_containerTpl.innerHTML,
                        view = document.getElementById('walmarttemp_newOrEdit_container');
                        laytpl(getTpl).render(data, function(html){
                            view.innerHTML = html;
                            form.render();
                            formSelects.render();
                            _this.addAndDelete(layero);
                        });
                    },
                    yes: function(index, layero){
                        var $formItem = layero.find('#optional_attr .layui-form-item');
                        var prodTaxCodeVal = $.trim(layero.find('[name=prodTaxCode]').val());
                        // if(!prodTaxCodeVal){
                        //     layero.find('[name=prodTaxCode]').addClass('layui-form-danger').focus();
                        //     return layer.msg('prodTaxCode必填!',{icon:2});
                        // }else{
                        //     layero.find('[name=prodTaxCode]').removeClass('layui-form-danger').blur();
                        // }
                        var submitData = [];
                        //数据处理
                        for(var i=0;i<$formItem.length; i++){
                            var item = $formItem[i];
                            var $item = $(item);
                            var $collection = $item.find('[name=attrCollection]');
                            var $collectionStr = $collection.val() || {};
                            var $collectionObj =JSON.parse($collectionStr);
                            var $inputOrSelect = $item.find(`[name=${$collectionObj.attributeName}]`);
                            var $inputVal = $.trim($inputOrSelect.val());
                            if($collectionObj.required == 'true' && $collectionObj.displayType !='array'){
                                if(!$inputVal){
                                    $inputOrSelect.addClass('layui-form-danger').focus();
                                    return layer.msg(`${$collectionObj.attributeName}为必填项!`,{icon:7});
                                }else{
                                    $inputOrSelect.removeClass('layui-form-danger').blur();
                                }
                            }
                            //独立出array这个结构
                            if($collectionObj.required == 'true' && $collectionObj.displayType =='array'){
                                var $DisplayP = $item.find('.arrayDisplayClass');
                                for(var k=0; k<$DisplayP.length; k++){
                                    var displayP = $DisplayP[k];
                                    var displayPInpt = $(displayP).find('input');
                                    var displayPName = $(displayP).find('span').data('name');
                                    if(!$.trim(displayPInpt.val())){
                                        displayPInpt.addClass('layui-form-danger').focus();
                                        return layer.msg(`${displayPName}为必填项!`,{icon:7});
                                    }else{
                                        displayPInpt.removeClass('layui-form-danger').blur();
                                    }
                                }
                            }
                            //input+select值
                            if($collectionObj.displayType =='inputSelect'){
                                var $selVal = $item.find(`[name=${$collectionObj.attributeName}_unit]`).val();
                                if(!$inputVal){
                                    $collectionObj.attributeValue = '';
                                }else{
                                    $collectionObj.attributeValue = $inputVal +'&'+$selVal;
                                }
                                
                            }
                            //array的值
                            else if($collectionObj.displayType =='array'){
                                var $parentsDisplayP = $item.find('.arrayDisplayP');
                                var parentsDisplayPArr = [];
                                for(var m=0; m<$parentsDisplayP.length; m++){
                                    var parentsDisplayP = $parentsDisplayP[m];
                                    let $DisplayP = $(parentsDisplayP).find('.arrayDisplayClass');
                                    let obj = {}; //组装的数据对象
                                    let displayData = [];
                                    for(let n=0; n<$DisplayP.length; n++){
                                        let displayP = $DisplayP[n];
                                        let displayPInptVal = $(displayP).find('input').val();
                                        let displayPName = $(displayP).find('span').data('name');
                                        let displayTitle = $(displayP).find('span').html();
                                        if($.trim(displayPInptVal)){
                                            obj[displayPName] = $.trim(displayPInptVal);
                                            var displayItem = {
                                                title: displayTitle,
                                                name: displayPName,
                                                value: $.trim(displayPInptVal)
                                            }
                                            displayData.push(displayItem);  
                                        }
                                    }
                                    if(!commonJudgeIsEmpty(obj)){
                                        obj.infos= displayData;
                                    }
                                    if(!commonJudgeIsEmpty(obj)){
                                        parentsDisplayPArr.push(obj);
                                    }
                                }
                                $collectionObj.attributeValue = parentsDisplayPArr;
                            }
                            //select或input的值
                            else{
                                $collectionObj.attributeValue = $inputVal;
                            }
                            if($collectionObj.attributeValue && $collectionObj.attributeValue.length){
                                submitData.push($collectionObj);
                            }
                            
                        }
                        //保存
                        var obj = {};
                        obj.attributeList = submitData;
                        obj.categoryId = data.categoryId;
                        obj.categoryName = data.categoryName;
                        obj.prodTaxCode = prodTaxCodeVal;
                        obj.pSku = data.trData.pSku;
                        obj.pId = data.trData.pId;
                        if(type=='编辑'){
                            obj.id = data.trData.walmartModeId;
                        }
                        obj.site='US';
                        _this.saveAjax(obj).then(function(result){
                           layer.msg(result || '新建沃尔玛模板成功!',{icon:1});
                           layer.close(index);
                            if(type=='编辑'){
                                $(dom).find('td[data-field="timew"] .updateTime').text(Format(new Date().getTime(),'yyyy-MM-dd hh:mm:ss'))
                            }
                        //    $('[lay-filter=walmarttemp_submit]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }
                });
            },
            //增加和删除
            addAndDelete: function(layero){
                $('#walmarttemp_newOrEdit_container').on('click', '.arrayDisplayP_add', function(){
                    var $targetArr = $(this).parent('.arrayDisplayP').find('.arrayDisplayClass');
                    var domStr = '<div class="arrayDisplayP">';
                    for(var i=0; i< $targetArr.length; i++){
                        var item = $targetArr[i];
                        var title = $(item).find('span').html(); //名称
                        var name = $(item).find('span').data('name'); //属性名称
                        domStr +=  `<div class="arrayDisplayClass flexD">
                                        <span data-name="${name}">${title}</span>
                                        <input type="text" class="layui-input" value="">
                                    </div>`;
                    }
                    domStr += `<span class="layui-btn layui-btn-sm layui-btn-normal ml10 arrayDisplayP_add">+</span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal ml10 arrayDisplayP_delete">-</span>
                            </div>`;
                    $(this).parent('.arrayDisplayP').after(domStr);
                });
                $('#walmarttemp_newOrEdit_container').on('click', '.arrayDisplayP_delete', function(){
                    $(this).parents('.arrayDisplayP').remove();   
                });
            },
            //清空按钮
            reset: function(){
                $('#walmarttemp_reset').on('click', function(){
                    $("#walmarttemp_searchForm")[0].reset()
                   $('#walmarttemp_searchForm').find('.layui-icon-delete').trigger('click');
                    formSelects.value('walmarttemp_logisticsAttrStr', ["普货"]);
                    formSelects.value('walmarttemp_devTypeStr',[])
                    setTimeout(() => {
                        formSelects.value('walmarttemp_prodIsSaleStatus',['2', '1'])
                    }, 100);
                });
            },
            //ajax请求
            //初始化请求select
            initAjax: function(){
                return commonReturnPromise({
                    url: '/lms/mode/walmart/init.html'
                });
            },
            walmartCateAjax: function(){
                return commonReturnPromise({
                    url: '/lms/cate/walmart/query/base.html'
                });
            },
            //新建/编辑沃尔玛模板接口
            newBulidOrEditAjax: function(obj){
                return commonReturnPromise({
                    url: '/lms/mode/walmart/query/attribute.html',
                    params: obj
                });
            },
            //保存沃尔玛模板接口
            saveAjax: function(obj){
                return commonReturnPromise({
                    url: '/lms/mode/walmart/save/model.html',
                    contentType: 'application/json',
                    type: 'post',
                    params: JSON.stringify(obj)
                });
            },
            //批量生成沃尔玛模板接口
            saveBatchAjax: function(obj){
                return commonReturnPromise({
                    url: '/lms/mode/walmart/save/batch/model.html',
                    contentType: 'application/json',
                    type: 'post',
                    params: JSON.stringify(obj)
                });
            },
            //删除沃尔玛模板
            deleteAjax: function(id){
                return commonReturnPromise({
                    url: '/lms/mode/walmart/delete/model.html',
                    params: {
                        id: id
                    }
                })
            }
        };
        //数据缓存
        walmarttempName.selectCache();
        //渲染搜索select
        walmarttempName.renderSelect();
        //渲染类目
        walmarttempName.cate();
        //展示tips
        walmarttempName.showTips();
        //清空产品类目
        walmarttempName.reset();
        // 批量生成walmart模板
        walmarttempName.walmartTempBatchBtn();
        //固定表头
        UnifiedFixedFn('walmarttempCard');
        //表单搜索事件
        form.on('submit(walmarttemp_submit)', function(data){
            var data = data.field; //获取到表单提交对象
            var obj = walmarttempName.dataHandle(data);
            walmarttempName.tableRender(obj);
        });
    });//layui结束
})();