layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','upload'],function(){
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        upload = layui.upload,
        formSelects = layui.formSelects,
        form = layui.form;
    form.render('select');
    //字号处理
    var fontSizeArr = [{key: 10,size: 10},{key: 12,size: 12},{key: 14,size: 14},{key: 18,size: 18},{key: 20,size: 20},{key: 24,size: 24},{key: 26,size: 26}];
    var countryArr = [];
    //物流方式命名空间
    var fbalogisName= {
        trigClick: function(){ //触发搜索事件
            $('[lay-filter=fbalogis_submit]').trigger('click');
        },
        //物流公司配置
        companyConfig: function(){
            var _this = this;
            $('#fbalogis_logisticCompany').on('click', function(){
                layer.open({
                    type: 1,
                    title: '物流公司配置',
                    btn: ['保存','关闭'],
                    area: ['800px', '600px'],
                    content: $('#fbalogis_logisticCompanyLayer').html(),
                    success: function(layero,index){
                        _this.addTr(layero, 'fbalogis_logisticCompany_add', 'fbalogis_logisticCompany_tbody', 'logisticCompany');
                    },
                    yes: function(index, layero){
                        var trs = layero.find('#fbalogis_logisticCompany_tbody>tr');
                        var tdArr = [];
                        for(var i=0; i<trs.length; i++){
                            var trItem = trs[i];
                            var tdObj = {};
                            tdObj.logisticsCompanyId = layero.find('[name=id]').val();
                            tdObj.fieldDesc = $(trItem).find('[name= fieldDesc]').val();
                            tdObj.fieldName = $(trItem).find('[name= fieldName]').val();
                            tdObj.remark = $(trItem).find('[name= remark]').val();
                            tdArr.push(tdObj);
                        }
                        var obj = {};
                        obj.id = layero.find('[name=id]').val();
                        obj.cnName = layero.find('[name=cnName]').val();
                        obj.enName = layero.find('[name=enName]').val();
                        obj.prefix = layero.find('[name=prefix]').val();
                        obj.apiCode = layero.find('[name=apiCode]').val();
                        obj.specialType = layero.find('[name=specialType]').val();
                        obj.companyConfigList = tdArr;
                        _this.companyConfigAjax(obj).then(function(result){
                            layer.close(index);
                            layer.msg('配置物流成功!',{icon: 1});
                            console.log(result);
                        }).catch(function(err){
                            layer.msg(err);
                        })
                    }
                })
            });
        },
        //物流方式配置
        wayConfig: function(){
            var _this = this;
            $('#fbalogis_logisticWay').on('click', function(){
                layer.open({
                    type: 1,
                    title: '物流方式配置',
                    btn: ['保存','关闭'],
                    area: ['800px', '600px'],
                    content: $('#fbalogis_logisticWayLayer').html(),
                    success: function(layero,index){
                        _this.addTr(layero, 'fbalogis_logisticWay_add', 'fbalogis_logisticWay_tbody', 'logisticWay');
                    },
                    yes: function(index, layero){
                        var trs = layero.find('#fbalogis_logisticWay_tbody>tr');
                        var tdArr = [];
                        for(var i=0; i<trs.length; i++){
                            var trItem = trs[i];
                            var tdObj = {};
                            tdObj.logisticsCompanyId = layero.find('[name=id]').val();
                            tdObj.fieldDesc = $(trItem).find('[name= fieldDesc]').val();
                            tdObj.fieldName = $(trItem).find('[name= fieldName]').val();
                            tdObj.remark = $(trItem).find('[name= remark]').val();
                            tdObj.required = $(trItem).find('[name= required]').val();
                            tdArr.push(tdObj);
                        }
                        var obj = {};
                        obj.companyTypeConfigList = tdArr;
                        _this.wayConfigAjax(obj).then(function(result){
                            layer.close(index);
                            layer.msg('配置物流方式成功!',{icon: 1});
                            console.log(result);
                        }).catch(function(err){
                            layer.msg(err);
                        })
                    }
                })
            });
        },
        //展示数据按钮
        showDataHandle: function(){
            var _this = this;
            $('#fbalogis_showDataInfo').on('click', function(){
                Promise.all([_this.getDataInfo(), _this.showDataInfo()]).then(function(allResult){
                    var result = allResult[0];//初始化数据
                    var loopResults = allResult[1]; //循环数据
                    var tableData = [];
                    var shippingCountryCode = result.shippingCountryCode ||[];//适用国家
                    var shippingLogisticsType = result.shippingLogisticsType || [];//发货物流方式
                    var shippingType = result.shippingType || []; //发货方式
                    var matchPriceLogisticsType = result.matchPriceLogisticsType || [];//定价物流方式
                    var saleLogisticsTypeArr = result.saleLogisticsType;
                    for(var i=0; i<saleLogisticsTypeArr.length; i++){
                        var item = saleLogisticsTypeArr[i];
                        var obj ={};
                        obj.saleLogisticsType = item;
                        obj.shippingCountryCodes = shippingCountryCode;
                        obj.shippingLogisticsTypes = shippingLogisticsType;
                        obj.shippingTypes = shippingType; 
                        obj.matchPriceLogisticsTypes = matchPriceLogisticsType; 
                        if(loopResults.length> 0){
                            for(var k=0; k<loopResults.length; k++){
                                var loopItem = loopResults[k];
                                if(loopItem.saleLogisticsTypeName == item){
                                    obj.realShippingLogisticsTypeId = loopItem.realShippingLogisticsTypeId || ''; //发货物流方式id
                                    obj.realPriceLogisticsTypeId = loopItem.realPriceLogisticsTypeId || ''; //定价物流方式id
                                    obj.shippingTypeId = loopItem.shippingType || ''; //发货方式Id
                                    obj.countryCodeId = loopItem.countryCode || ''; //适用国家
                                }
                            }
                        }
                        tableData.push(obj);
                    }
                    // console.log(tableData)
                    //弹框
                    layer.open({
                        type: 1,
                        title: '销售头程',
                        btn: ['提交', '取消'],
                        area: ['70%', '80%'],
                        content: $('#fbalogis_showDataInfoLayer').html(),
                        success: function(layero,index){
                            var formTemplate = fbalogis_showDataInfo_tbodyTpl.innerHTML;
                            var formDiv= document.getElementById('fbalogis_showDataInfo_tbody');
                            laytpl(formTemplate).render(tableData, function(html){
                                formDiv.innerHTML = html;
                                form.render();
                            });
                        },
                        yes: function(index,layero){
                            var $trs = layero.find('#fbalogis_showDataInfo_tbody>tr');
                            var submitData = [];
                            for(var j=0;j<$trs.length;j++){
                                var $tr = $($trs[j]);
                                var obj = {};
                                //销售头程
                                obj.saleLogisticsTypeName = $tr.find('td:first-child').text();
                                //发货物流方式
                                obj.realShippingLogisticsTypeId = $tr.find('[name=shippingLogisticsType]').val();
                                //定价物流方式
                                obj.realPriceLogisticsTypeId =$tr.find('[name=matchPriceLogisticsType]').val();
                                //发货方式
                                obj.shippingType = $tr.find('[name=shippingType]').val();
                                //适用国家
                                obj.countryCode = $tr.find('[name=shippingCountryCode]').val();
                                submitData.push(obj);
                            }
                            console.log(submitData);
                            //提交数据
                            _this.submitDataInfo(submitData).then(function(submitResult){
                                layer.msg(submitResult || '保存数据成功',{icon:1});
                                layer.close(index);
                            }).catch(function(submitErr){
                                layer.msg(submitErr.message, {icon:2});
                            })
                        }
                    });
                }).catch(function(err){
                    layer.msg(err.message, {icon:2});
                })
            });
        },
        getDataInfo: function(){ //获取初始化数据
            return commonReturnPromise({
                url: '/lms/fba/sale/logistics/init.html'
            })
        },
        showDataInfo: function(){ //回显数据
            return commonReturnPromise({
                url: '/lms/fba/sale/logistics/query.html'
            })
        },
        submitDataInfo: function(data){ //提交数据
            return commonReturnPromise({
                url: '/lms/fba/sale/logistics/save.html',
                contentType: 'application/json',
                type: 'post',
                params: JSON.stringify(data)
            })
        },
        // 物流公司/方式配置-增加一行功能
        addTr: function(layero,id,tbody, type){
            layero.find('#'+id).on('click', function(){
                var trStr = '';
                if(type=='logisticCompany'){
                    trStr +=`
                        <tr>
                            <td><input class="layui-input" name="fieldName" /></td>
                            <td><input class="layui-input" name="fieldDesc" /></td>
                            <td><input class="layui-input" name="remark" /></td>
                            <td><span class="layui-btn layui-btn-sm layui-btn-danger" onclick="commonDelTr(this)">删除</span></td>
                        </tr>
                    `;
                }else if(type == 'logisticWay'){
                    trStr +=`
                        <tr>
                            <td><input class="layui-input" name="fieldName" /></td>
                            <td><input class="layui-input" name="fieldDesc" /></td>
                            <td><input class="layui-input" name="remark" /></td>
                            <td><input class="layui-input" name="fieldType" /></td>
                            <td><input class="layui-input" name="required" /></td>
                            <td><span class="layui-btn layui-btn-sm layui-btn-danger" onclick="commonDelTr(this)">删除</span></td>
                        </tr>
                    `;
                };
                $('#'+tbody).append(trStr);
            });
        },
        add: function(){ //新增物流方式
            var _this= this;
            var addForm;
            _this.getAllAttr().then(function(result){
                $('#fbalogis_newAdd').on('click', function(){
                    var id = $("input[name=logisticsCompanyId]").val();
                    var index = layer.open({
                        type:1,
                        title: '新增物流方式',
                        btn: ['保存', '关闭'],
                        area: ['1100px', '100%'],
                        content: $('#fbalogis_newAddLayer').html(),
                        success: function(layero, index){
                            /**
                             * 获取到物流公司,然后根据物流公司id获取到物流方式配置信息,动态渲染表单
                             */
                            $.ajax({
                                type: 'get',
                                dataType: 'json',
                                url: '/lms/company/specialType?specialType=FBA头程',
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        var selData = res.data;
                                        var str = '<option value="">请选择物流</option>'
                                        for(var i=0;i<selData.length;i++){
                                            var companyid = selData[i].id;
                                            var companyname = selData[i].cnName;
                                            if(companyid == id){
                                                str+=`<option value="${companyid}" selected>${companyname}</option>`;
                                            }else {
                                                str+=`<option value="${companyid}">${companyname}</option>`;
                                            }
                                            // str+=`<option value="${companyid}">${companyname}</option>`;

                                        }
                                        layero.find('select[name=companyName]').append(str);
                                        form.render('select');
                                        setTimeout(function(){
                                            $('select[name=companyName]').next().find('dd.layui-this').click();
                                        },100);
                                        form.on('select(fbalogis_newAdd_sel)', function(data){
                                            $.ajax({
                                                type: 'get',
                                                dataType: 'json',
                                                url: '/lms/type/get/config/params/'+data.value,
                                                beforeSend: function(){
                                                    loading.show();
                                                },
                                                success: function(res){
                                                    loading.hide();
                                                    if(res.code == '0000'){
                                                        res.attrArr = result;
                                                        var formTemplate = fbalogis_newAddLayerFormTpl.innerHTML;
                                                        var formDiv= document.getElementById('fbalogis_newAddLayerForm');
                                                        laytpl(formTemplate).render(res, function(html){
                                                            formDiv.innerHTML = html;
                                                            getGoodsAgent('.layui-layer-content','fbalogis_goodsAgent')
                                                        });
                                                var logisticsAttrArr = [];
                                                for(var i=0; i<result.logisticsTypeComboBox.logisticsAttributeList.length; i++){
                                                    var item =result.logisticsTypeComboBox.logisticsAttributeList[i]['code'];
                                                    form.on(`checkbox(${item})`,function(obj){
                                                        var dom = obj.elem;
                                                        if(dom.checked){
                                                            logisticsAttrArr.push(dom.title)
                                                        }else{
                                                            function isEque(element) {
                                                                return element == dom.title;
                                                            }
                                                            var xiabiao = logisticsAttrArr.findIndex(isEque);
                                                            logisticsAttrArr.splice(xiabiao, 1);
                                                        }
                                                        layero.find('[name=logisticsAttributeList]').val(logisticsAttrArr.join())
                                                    });
                                                }
                                                        
                                                        form.on('submit(fbalogis_newAddLayerForm_submit)', function(data){
                                                            var data = data.field; //获取到表单提交对象
                                                            addForm = data;
                                                            return false;
                                                        });
                                                    }
                                                }
                                            })
                                        });
                                        form.on('select(throwingWeightStatus_filter)', function(data){
                                            var val = data.value;
                                            if(val == 'true'){
                                                $('.logisticsModeStatus_show').removeClass('disN');
                                            }else{
                                                $('.logisticsModeStatus_show').addClass('disN');
                                            }
                                        })
                                    }; 
                                }
                            });
                        },
                        yes: function(index,layero){
                            var companyId =layero.find('[name="companyName"]').val();
                            var agent =layero.find('[name="goodsAgent"]').val();
                            $('[lay-filter=fbalogis_newAddLayerForm_submit]').trigger('click');
                            var params = [];
                            var $autos = layero.find('.fbalogis_newAddLayerFormAuto');
                            for(var i=0; i<$autos.length; i++){
                                var item = $autos[i];
                                var obj = {};
                                obj.id = $(item).find('input[type=hidden]:first-child').val();
                                obj.logisticsCompanyId = $(item).find('input[type=hidden]:last-child').val();
                                obj.fieldDesc = $(item).find('label').text();
                                obj.fieldName = $(item).find('.layui-input').data('name');
                                obj.fieldValue = $(item).find('.layui-input').val();
                                params.push(obj);
                            }
                            addForm.params = params;
                            addForm.agent = agent;
                            addForm.logisticsCompanyId =companyId;
                            addForm.status = true;
                            addForm.ifSaleLogisticsTypeDefault = false;
                            // console.log('提交的数据', addForm)
                            if(addForm.logisticsAttributeList == '' || addForm.name==''){
                                layer.msg('物流属性和name都是必填项!');
                               return false;
                            };
                            if(addForm.throwingWeightStatus == 'true'){
                                if(!addForm.throwingWeightType){
                                    layer.msg("请选择抛重计算方式")
                                    return false ;
                                }
                                if(!addForm.throwingWeightParam){
                                    layer.msg("请选择抛重参数")
                                    return false;
                                }
                                if(!addForm.weightProportion){
                                    layer.msg("请输入抛/实重比例≥")
                                    return false;
                                }
                                if(!addForm.materialCoefficient){
                                    layer.msg("请输入材积系数")
                                    return false;
                                }
                            }else{
                                addForm.throwingWeightType = '';
                                addForm.throwingWeightParam = '';
                                addForm.weightProportion = '';
                                addForm.materialCoefficient = '';
                            }
                            $.ajax({
                                type: 'post',
                                url: '/lms/type/add',
                                data: JSON.stringify(addForm),
                                dataType: 'json',
                                contentType: 'application/json;charset=UTF-8',
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        layer.close(index);
                                        _this.trigClick();
                                        layer.msg(res.msg);
                                    }else{
                                        layer.msg(res.msg);
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器正忙!');
                                }
                            });
                        }
                    })
                });
            })
        },
        tree: function(){ //事件委托-物流树的渲染和点击事件
            var _this = this;
            function companyRender(){
                var getTpl = fbalogis_provider.innerHTML;
                var getUl= document.getElementById('fbalogis_tree');
                $.ajax({ //物流商渲染
                    type: 'get',
                    url: '/lms/company/specialType?specialType=FBA头程',
                    dataType: 'json',
                    success: function(res){
                        laytpl(getTpl).render(res, function(html){
                            getUl.innerHTML = html;
                        });
                    }
               });
            }
            companyRender();
            //物流商单击事件
            $('#fbalogis_tree').on('click', 'li', function(){
                $(this).siblings('li').removeClass('layui-this');
                $(this).addClass('layui-this');
                var id = $(this).find('a').data('logistics');
                var $id = $("input[name=logisticsCompanyId]");
                $id.val(id);
                if($id.val() == id){
                   _this.trigClick();
                }
            });
            //物流商设置事件
            $('#fbalogis_tree').on('click', 'span.set', function(e){
                e.preventDefault();
                e.stopPropagation();
                var id = $(this).data('provider'); //物流商id
                $.ajax({
                    type: 'get',
                    url: '/lms/company/config/'+id,
                    dataType: 'json',
                    beforeSend: function(){
                         loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            if(res.data.length != 0){
                                var companyData;
                                var index = layer.open({
                                    type: 1,
                                    title: '物流公司配置',
                                    area: ['800px', '600px'],
                                    btn:['保存','关闭'],
                                    id: 'fbalogisCompanyLayerId', // 保证唯一性
                                    content: $('#fbalogisCompanyLayer').html(),
                                    success: function(layero, index){
                                        var formTemplate = fbalogisCompanyLayerFormTpl.innerHTML;
                                        var formDiv= document.getElementById('fbalogisCompanyLayerForm');
                                        laytpl(formTemplate).render(res, function(html){
                                            formDiv.innerHTML = html;
                                            form.render('select');
                                        });
                                    },
                                    yes: function(index, layero){
                                        $('[lay-filter=fbalogisCompanyLayerForm_submit]').trigger('click');
                                        var companyArr = [];
                                        var items = layero.find('form .layui-form-item.companyData');
                                        for(var i=0; i<items.length; i++){
                                            var item =items[i];
                                            var obj = {};
                                            obj.id = $(item).find('input[type=hidden]').val();
                                            obj.fieldDesc = $(item).find('label').text();
                                            obj.fieldName = $(item).find('.layui-input').data('name');
                                            obj.fieldValue = $(item).find('.layui-input').val();
                                            obj.logisticsCompanyId = id;
                                            companyArr.push(obj);
                                        };
                                        //判断不能为空
                                        for(var j=0; j<companyArr.length; j++){
                                            var item= companyArr[j];
                                            for(var key in item){
                                                if(item[key]==''){
                                                    return false;
                                                }
                                            }
                                        };
                                        //配置请求
                                        $.ajax({
                                            type: 'post',
                                            url: '/lms/company/config/update/'+id,
                                            dataType: 'json',
                                            contentType: 'application/json;charset=UTF-8',
                                            data: JSON.stringify(companyArr),
                                            beforeSend: function(){
                                               loading.show();
                                            },
                                            success: function(res){
                                                loading.hide();
                                                if(res.code == '0000'){
                                                    layer.close(index);
                                                    layer.msg('编辑成功');
                                                }else{
                                                    layer.msg(res.msg);
                                                }
                                            },
                                            error: function(){
                                                loading.hide();
                                                layer.msg('服务器有错误,和页面无关联哦!');
                                            }
                                        });
                                    }
                                });
                            }else{
                                layer.msg('无可配置项');
                            }
                        }else{
                            layer.msg('请求错误');
                        }
                    }
                });               
            });
            //物流商排序点击事件
            $('#fbalogis_tree').on('click', 'span.seq',function(e){
                e.preventDefault();
                e.stopPropagation();
                var seq = $(this).data('seq'); //物流公司排序
                var id = $(this).data('provider'); //物流商id
                var index = layer.open({
                    type: 1,
                    title:'排序',
                    id: 'fbalogisCompany_seqId',
                    area: ['300px', '200px'],
                    btn: ['保存', '关闭'],
                    content: $('#fbalogisCompany_seq').html(),
                    success: function(layero,index){
                        layero.find('[name=seq]').val(seq);
                    },
                    yes: function(index, layero){
                        var newSeq = layero.find('[name=seq]').val();
                        if(!newSeq){
                            layer.msg('排序不能为空');
                            return;
                        }
                        //排序请求
                        $.ajax({
                            type: 'get',
                            url: '/lms/company/resort/'+id+'/'+seq+'/'+ newSeq,
                            dataType: 'json',
                            contentType: 'application/json;charset=UTF-8',
                            success: function(res){
                                    if(res.code == '0000'){
                                        layer.msg('排序成功');
                                        layer.close(index);
                                        companyRender();
                                    }else{
                                        layer.msg(res.msg);
                                    }
                            }
                         })
                    }
                })
            });

        },
        tableRender: function(data){ //设置表格渲染
            var _this = this;
            table.render({
                elem: '#fbalogis_table',
                method: 'post',
                url: '/lms/type/list/specialType',
                where:  data,
                cols: [
                    [ //表头
                        {type: 'checkbox',width: 30}
                        ,{title: '物流方式',templet: '#fbalogis_nameAndshopElfTypeName', width: '20%'}
                        ,{title: '服务代码', templet: '#fbalogis_tableCode', width: '20%'}
                        ,{title: '折扣率', field: 'discountRate', width: 110}
                        // ,{title: '自动申请跟踪号',templet: '#fbalogis_tableAuto', width: 110}
                        ,{title: '重量(g)', field: 'packageWeight',width: 140,templet: '#fbalogis_packageWeight'}
                        ,{title: '支持物流属性', field: 'logisticsAttributeList'}
                        ,{title: '状态',templet: '#fbalogis_tableStatus', width: 65}
                        // ,{title: '面单模板编码', templet: '#fbalogis_expressBill', width: 100}
                        ,{title: '备注',field: 'remark', templet: '#fbalogis_remark'}
                        ,{title: '操作', align:'center', toolbar: '#fbalogis_tableIdBar', width: 83}
                    ]
                ],
                page: true,
                id: "fbalogis_tableId",
                limits: [50, 100, 300],
                limit: 50,
                done: function(res){                  
                    //工具条监听事件
                    _this.watchBar();
                    //监听switch变化
                    for(var i=0;i<res.data.length;i++){
                        delete res.data[i].createTime;
                        delete res.data[i].updateTime;
                        _this.watchSwitch(res.data[i]);
                        // _this.watchButton(res.data[i]);
                    };   
                }
            });
        },
        //11-17复制黏贴计费
        copyOrPaste: function(){
            $('#fbalogis_copyCost').on('click', function(){
                var $that = $(this);
                commonTableCksSelected('fbalogis_tableId').then(function(result){
                    var txt = $that.text();
                    if(txt == '复制计费'){
                        if(result.length > 1){
                            return layer.msg('复制的时候只允许选择一条数据!',{icon:7});
                        }
                        sessionStorage.setItem('SOURCETYPEOBJ',JSON.stringify({
                            id: result[0].id,
                            name: result[0].name
                        })); //复制的id
                        layer.msg('复制计费信息成功',{icon:1});
                        $that.text('粘贴计费');
                        $that.removeClass('layui-btn-normal');
                    }else if(txt == '粘贴计费'){
                        var targetTypeIdArr = result.map(function(item){
                            return item.id
                        });
                        var targetTypeNameArr=  result.map(function(item){
                            return item.name
                        });
                        var targetTypeId = targetTypeIdArr.join();
                        var targetTypeName = targetTypeNameArr.join();//物流方式
                        var sourceTypeObj = JSON.parse(sessionStorage.getItem('SOURCETYPEOBJ'));
                        var copyTxt = `从<font color="blue">${sourceTypeObj.name}</font>粘贴到<font color="red">${targetTypeName}</font>`;
                        layer.confirm(`确定执行${copyTxt}操作吗?`, function(index){
                            commonReturnPromise({
                                url: '/lms/areaZipCodeRelation/save/charging.html',
                                params: {
                                    sourceTypeId:sourceTypeObj.id,
                                    targetTypeIdStr:targetTypeId
                                }
                            }).then(function(copySucc){
                                layer.alert(`${copyTxt}执行成功!`,{icon:1});
                                $that.text('复制计费');
                                $that.addClass('layui-btn-normal');
                                layer.close(index);
                            }).catch(function(copyErr){
                                layer.msg(copyErr,{icon:2});
                            })
                        });    
                        
                    }
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            });
        },
        watchButton: function(info){ //监听面单按钮的点击事件
            var id = info.id;
            var upBtn = 'fbalogis_billUpload'+id; //上传按钮
            var downBtn = 'fbalogis_billDown'+id; //下载按钮
            var prevBtn = 'fbalogis_billPreview'+id; //预览按钮
            $('#'+prevBtn).on('click',function(){ //预览
              var urlArr = [ctx+'/ireport/preview/logistics?templateCode=', info.templateCode];
              window.open(urlArr.join(''),'_blank');  
            });
            $('#'+downBtn).on('click',function(){ //下载
                var urlArr = [ctx+'/ireport/download/logistics?templateCode=', info.templateCode];
                window.open(urlArr.join(''),'_blank');  
            });
            //上传
            expressBillUpload(upBtn, info.templateCode);

        },
        watchSwitch: function(info){ // 监听开关的变化
            var id = info.id;
            var filterStatus = 'fbalogis_tableStatus'+id;
            var filterAuto = 'fbalogis_tableAuto'+id;
            var modifyFn = function(dt){
                $.ajax({
                    type: 'post',
                    url: '/lms/type/update/'+id,
                    data: JSON.stringify(dt),
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code== '0000'){
                            fbalogisName.trigClick();
                            layer.msg(res.msg);
                        }else{
                            layer.msg(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                        layer.msg('服务器正忙!');
                    }
                });
            };
            form.on(`switch(${filterStatus})`, function(data){
                info.status = data.elem.checked; //开关是否开启，true或者false
                // console.log(info);
                modifyFn(info);
            }); 
            form.on(`switch(${filterAuto})`, function(data){
                info.autoApplyTrackNum = data.elem.checked; //开关是否开启，true或者false
                // console.log(info);
                modifyFn(info);
            }); 
        },
        watchBar: function(){ // 监听表格工具条的点击事件
            var _this = this;
            table.on('tool(fbalogis_tableFilter)',function(obj){
                var data = obj.data;
                var logisTypeId = data.id; //物流方式的id
                var logisTypeName = data.name; //物流方式名称
                var dataCopy = data;
                var editFormData;
                if (obj.event == 'edit'){ //编辑弹框
                _this.getAllAttr().then(function(result){
                    var index = layer.open({ 
                        type: 1,
                        title: '编辑物流方式',
                        area: ['1100px', '100%'],
                        btn: ['保存', '关闭'],
                        content: $('#fbalogis_editLogisticsWay').html(),
                        success: function(layero,index){
                                data.attrArr = result;
                                var formTemplate = fbalogis_editLogisticsWayFormTemplate.innerHTML;
                                var formDiv= document.getElementById('fbalogis_editLogisticsWayFormDiv');
                                laytpl(formTemplate).render(data, function(html){
                                    getGoodsAgent('#fbalogis_editLogisticsWayForm','fbalogis_editAgent',data.agent)
                                    formDiv.innerHTML = html;
                                    form.render('select');
                                    form.render('checkbox');
                                });
                                //物流属性初始化
                                var logisticsAttrArr = [];
                                for(var i=0; i<result.logisticsTypeComboBox.logisticsAttributeList.length; i++){
                                    var item =result.logisticsTypeComboBox.logisticsAttributeList[i]['code'];
                                    form.on(`checkbox(${item})`,function(obj){
                                        var dom = obj.elem;
                                        if(dom.checked){
                                            logisticsAttrArr.push(dom.title)
                                        }else{
                                            function isEque(element) {
                                                return element == dom.title;
                                            }
                                            var xiabiao = logisticsAttrArr.findIndex(isEque);
                                            logisticsAttrArr.splice(xiabiao, 1);
                                        }
                                        layero.find('[name=logisticsAttributeList]').val(logisticsAttrArr.join())
                                   });
                                }
                                var selNameData = data.logisticsAttributeList.split(',');
                                for(var j=0; j<selNameData.length; j++){
                                    var name = selNameData[j];
                                    layero.find(`[title="${name}"]`).next().click();
                                }
                                form.on('submit(fbalogis_editLogisticsWayForm_submit)', function(data){
                                    var data = data.field; //获取到表单提交对象
                                    editFormData = data;
                                    return false;
                                });
                                form.on('select(throwingWeightStatus_filter)', function(data){
                                    var val = data.value;
                                    if(val == 'true'){
                                        $('.logisticsModeStatus_show').removeClass('disN');
                                    }else{
                                        $('.logisticsModeStatus_show').addClass('disN');
                                    }
                                })
                        },
                        yes: function(index, layero){
                            $('[lay-filter=fbalogis_editLogisticsWayForm_submit]').trigger('click');
                            var autoFormItems = $('.logisticsModeAuto');
                            var params= [];
                            for(var i=0; i<autoFormItems.length; i++){
                                var item = autoFormItems[i];
                                var singInp = $(item).find('input');
                                var lab =  $(item).find('label');
                                var span = $(item).find('span');
                                var obj = {
                                    'fieldName': singInp.data('name'),
                                    'fieldDesc': lab.text(),
                                    'fieldValue': singInp.val(),
                                    'remark': $.trim(span.text())
                                }
                                params.push(obj);
                            }
                            editFormData.params = JSON.stringify(params);
                            Object.assign(dataCopy, editFormData);
                            delete dataCopy.createTime;
                            delete dataCopy.createId;
                            delete dataCopy.createName;
                            delete dataCopy.updateTime;
                            delete dataCopy.updateId;
                            delete dataCopy.updateName;
                            if(dataCopy.logisticsAttributeList == '' || dataCopy.name==''){
                                layer.msg('物流属性和name都是必填项!');
                               return false;
                            };
                            if(dataCopy.throwingWeightStatus == 'true'){
                                if(!dataCopy.throwingWeightType){
                                    layer.msg("请选择抛重计算方式")
                                    return false ;
                                }
                                if(!dataCopy.throwingWeightParam){
                                    layer.msg("请选择抛重参数")
                                    return false;
                                }
                                if(!dataCopy.weightProportion){
                                    layer.msg("请输入抛/实重比例≥")
                                    return false;
                                }
                                if(!dataCopy.materialCoefficient){
                                    layer.msg("请输入材积系数")
                                    return false;
                                }
                            }else{
                                dataCopy.throwingWeightType = '';
                                dataCopy.throwingWeightParam = '';
                                dataCopy.weightProportion = ''
                                dataCopy.materialCoefficient = ''
                            }
                            var id = data.id;
                                $.ajax({
                                type: 'post',
                                url: '/lms/type/update/'+id,
                                data: JSON.stringify(dataCopy),
                                dataType: 'json',
                                contentType: 'application/json;charset=UTF-8',
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code== '0000'){
                                        layer.close(index);
                                        fbalogisName.trigClick();
                                        layer.msg(res.msg);
                                    }else{
                                        layer.msg(res.msg);
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器正忙!');
                                }
                            })
                        }
                    });
                })
                }else if(obj.event =='carries'){ //承运商弹框
                    var index = layer.open({
                        type: 1,
                        title: '承运商信息',
                        area: ['600px', '600px'],
                        btn: ['保存', '关闭'],
                        content: $('#fbalogis_carriersLogistics').html(),
                        success: function(layero,index){
                            var getTpl = fbalogis_carriersLogisticsTbodyTpl.innerHTML;
                            var getUl= document.getElementById('fbalogis_carriersLogisticsTbody');
                            $.ajax({
                                type: 'get',
                                url: '/lms/type/provider/'+data.id,
                                dataType: 'json',
                                success: function(res){
                                    laytpl(getTpl).render(res, function(html){ //渲染到表格
                                        getUl.innerHTML = html;
                                    });
                                }
                            })
                        },
                        yes: function(index, layero){
                            var $trs = $('#fbalogis_carriersLogisticsTbody').find('tr');
                            var carriesArr = [];
                            for(var i=0; i<$trs.length;i++){
                                var $tr = $trs[i];
                                var id = $($tr).find('td:first-child  input').val();
                                var logisticsTypeId = $($tr).find('td:nth-child(2)  input').val();
                                var platCode = $($tr).find('td:nth-child(3)').text();
                                var logisticsProviderName = $($tr).find('td:nth-child(4) input').val();
                                var isNeedSyncTrackingNo = $($tr).find('td:last-child input').is(':checked');
                                var obj = {
                                    id: id,
                                    logisticsTypeId: logisticsTypeId,
                                    platCode: platCode,
                                    logisticsProviderName: logisticsProviderName,
                                    isNeedSyncTrackingNo: isNeedSyncTrackingNo
                                };
                                carriesArr.push(obj);
                            };
                            $.ajax({
                                type: 'post',
                                url: '/lms/type/provider/save',
                                data: JSON.stringify(carriesArr),
                                dataType: 'json',
                                contentType: 'application/json;charset=UTF-8',
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        layer.close(index);
                                        _this.trigClick();
                                        layer.msg(res.msg);
                                    }else{
                                        layer.msg(res.msg);
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器正忙!');
                                }

                            })
                        }
                    });
                }else if(obj.event=='billing'){ //区域计费详情
                    var index = layer.open({
                        type: 1,
                        title: '区域计费信息',
                        area: ['1100px', '800px'],
                        btn: ['保存', '关闭'],
                        content: $('#fbalogis_regionalPrice').html(),
                        success: function(layero,index){
                            upload.render({
                                elem: '#areaZipCodeRelationTempImport' //绑定元素
                                ,url: `${ctx}/areaZipCodeRelation/uploadAreaZipCodeRelation.html` //上传接口
                                ,accept: 'file' //允许上传的文件类型
                                ,exts: 'xls'
                                ,done: function(res){
                                    if(res.code=="0000"){
                                        layer.msg(res.msg,{icon:1});
                                    }else{
                                        layer.msg(res.msg,{icon:5});
                                    }
                                }
                                ,error: function(){
                                    layer.msg('服务器出现故障!');
                                }
                            });
                            // 弹框表格渲染(默认渲染)
                            _this.fbalogis_regionalPriceTableRender({countryAbbr: ''}, logisTypeId);
                            $('#fbalogis_regionalPriceTableSearch').on('click', function(){
                                var val = $('#fbalogis_regionalPriceInput').val();
                                _this.fbalogis_regionalPriceTableRender({countryAbbr: val}, logisTypeId);
                            });
                            $('#fbalogis_regionalPriceTableEmpty').on('click',function(){
                                $('#fbalogis_regionalPriceInput').val('');
                            });
                            //添加功能
                            _this.addDHLClick(logisTypeId);
                            //导出计费
                            _this.exportHandle(layero,logisTypeId);
                        }
                    })
                }else if(obj.event == 'watermark'){ //面单加水印
                   _this.watermarkApi(logisTypeId).then(function(result){
                        result.name = logisTypeName;
                        result.fontSizeArr = fontSizeArr;
                        _this.wmHandle(result, _this);
                   }).catch(function(reason){
                       layer.msg(reason);
                   })
                }else if(obj.event == 'remark'){
                    layer.open({
                        type: 1,
                        title: '编辑备注',
                        area: ['600px', '600px'],
                        btn: ['保存', '关闭'],
                        content: $('#fbalogis_remarkLayer').html(),
                        id: 'fbalogis_remarkLayerId',
                        success: function(layero,index){
                            layero.find('[name=remark]').val(data.remark || '');
                        },
                        yes: function(index,layero){
                            var remarkDom = layero.find('[name=remark]');
                            data.remark = remarkDom.val();
                            _this.detailSaveAjax(data.id, data).then(function(result){
                                layer.msg('修改备注成功!',{icon:1});
                                layer.close(index);
                                _this.trigClick();
                            }).catch(function(err){
                                layer.msg(err,{icon:2});
                            });
                        }
                    })
                }
            })
        },
        detailSaveAjax: function(id, data){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json;charset=UTF-8',
                url: '/lms/type/update/'+id,
                params: encodeURIComponent(JSON.stringify(data))
            })
        },
        //2020-11-17新增区域计费导出功能
        exportHandle: function(layero,logisTypeId){
            layero.find('#exportCostInfo').on('click', function(){
                submitForm({"typeId": logisTypeId}, '/lms/type/export/charging.html');
            });
        },
        wmHandle: function(data, _this){ //面单加水印
            layer.open({
                type: 1,
                title: '面单水印',
                btn: ['保存', '关闭'],
                area: ['100%', '100%'],
                content: $('#fbalogis_watermark').html(),
                success: function(layero, index){
                    /**
                     * 对箱号/分拣码/时间/店铺名称/订单分别进行赋值
                    */
                    data.boxNumber = data.textDtoList[0]; //箱号对象
                    data.pickNumber = data.textDtoList[1]; //分拣码对象
                    data.printDate = data.textDtoList[2]; //打印时间对象
                    data.storeName = data.textDtoList[3]; //店铺名称对象
                    data.orderNumber = data.textDtoList[4]; //订单编号对象
                    var formTemplate = fbalogis_watermark_contentTpl.innerHTML;
                    var formDiv= document.getElementById('fbalogis_watermark_content');
                    laytpl(formTemplate).render(data, function(html){
                        formDiv.innerHTML = html;
                        form.render();
                    });
                    //生成背景模板
                    $('#watermark_containerBox').css({ 
                        'width': data.imgWidth + 'px',
                        'height': data.imgHeight + 'px',
                        'backgroundImage': `url(${data.imgUrl})`,
                        'position': 'relative',
                        'border': '1px solid #ccc'
                    });
                    //渲染初始位置信息
                    (function(){ //箱号
                        var location = data.boxNumber.location; //获取到位置信息
                        var Left = location.x; //左侧距离
                        var $parentHeight = $('#watermark_containerBox').height();
                        var $height = $('#watermark_boxNumberFont').height();
                        var Top = $parentHeight - $height - location.y;
                        $('#watermark_boxNumberFont').css({
                            top: Top+'px',
                            left: Left+'px'
                        });
                    })();
                    (function(){ //分拣码
                        var location = data.pickNumber.location; //获取到位置信息
                        var Left = location.x; //左侧距离
                        var $parentHeight = $('#watermark_containerBox').height();
                        var $height = $('#watermark_pickNumberFont').height();
                        var Top = $parentHeight - $height - location.y;
                        $('#watermark_pickNumberFont').css({
                            top: Top+'px',
                            left: Left+'px'
                        });
                    })();
                    (function(){ //时间-店铺-订单编号
                        var location = data.printDate.location; //获取到位置信息
                        var Left = location.x; //左侧距离
                        var $parentHeight = $('#watermark_containerBox').height();
                        var $height = $('#watermark_date_name_orderFont').height()/2;
                        var Top = $parentHeight - $height - location.y;
                        // console.log('左距离',Left);
                        // console.log('总高',$parentHeight);
                        // console.log('y', location.y);
                        // console.log('元素高', $height);
                        $('#watermark_date_name_orderFont').css({
                            top: Top+'px',
                            left: Left+'px'
                        });
                    })();
                    //文字拖拽函数
                    function fontDragHandle(fontId){
                        var $watermarkFontBox = $('#'+fontId);
                        var mouseDownFont;
                        $watermarkFontBox.children('span').off("mousedown").on("mousedown", function() {
                            $(window).off("mousedown");
                            $watermarkFontBox.on("mousedown", mouseDownFont);
                        });
                        $watermarkFontBox.off('mouseup').on('mouseup',function(e) {
                            $(window).off("mousedown");
                            var Left = Number(e.currentTarget.style.left.replace(/px/, ''));
                            var Top = data.imgHeight - Number(e.currentTarget.style.top.replace(/px/, '')) - e.currentTarget.clientHeight;
                            var ps = {
                                x: Left,
                                y: Top,
                                rotation: 0
                            };
                            $('#'+fontId+'Location').val(JSON.stringify(ps));
                        });
                        mouseDownFont = _this.mouseDragEvent($watermarkFontBox, $('#watermark_containerBox'));
                    }
                    //箱号文字拖拽
                    fontDragHandle('watermark_boxNumberFont');
                    //分拣码文字拖拽
                    fontDragHandle('watermark_pickNumberFont');
                    //时间-店铺名称-订单编号文字拖拽
                    fontDragHandle('watermark_date_name_orderFont');
                    //监听checkbox是否选中
                    form.on('checkbox', function(obj){
                        var dom = obj.elem;
                        if(dom.title=='打印时间' || dom.title=='店铺名称' || dom.title=='订单编号'){
                            var cls = dom.name.replace(/(\_checkbox)/, '');
                            if(dom.checked){
                               $('.'+cls).removeClass('disN');
                            }else{
                               $('.'+cls).addClass('disN');
                            }
                        }else{
                            var id = dom.name.replace(/(\_checkbox)/, '');
                            if(dom.checked){
                                if(dom.name.indexOf('pickNumber')>-1){
                                    $('#'+id).removeClass('disN');
                                    $('[name=watermark_pickNumberFont_input]').parents('.layui-form-item').removeClass('disN');
                                }else{
                                    $('#'+id).removeClass('disN');
                                }
                            }else{
                                if(dom.name.indexOf('pickNumber')>-1){
                                    $('#'+id).addClass('disN');
                                    $('[name=watermark_pickNumberFont_input]').parents('.layui-form-item').addClass('disN');
                                }else{
                                    $('#'+id).addClass('disN');
                                }
                            }
                        }
                       
                    });
                    //监听select选项,调整字体大小
                    form.on('select', function(obj){
                        var name = $(obj.elem).attr('name').replace(/\_select/,'');
                        var value = obj.value + 'px';
                        $('#'+name).find('span').css({
                            'fontSize': value
                        });
                    });
                    //监听input的输入功能
                    $('[name=watermark_pickNumberFont_input]').on('input', function(e){
                       var val = e.target.value;
                       if(!val){
                        $('#watermark_pickNumberFont').addClass('disN');
                       }else{
                        $('#watermark_pickNumberFont').removeClass('disN');  
                       }
                        $('#watermark_pickNumberFont').find('span').text(val);
                    });
                },
                yes: function(index, layero){
                   var typeId = data.typeId; //传递给后台的数据
                   var watermark = {}; //传递给后台的数据
                   watermark.imgHeight = data.imgHeight;
                   watermark.imgWidth = data.imgWidth;
                   watermark.imgUrl = data.imgUrl;
                   watermark.typeId = data.typeId;
                   watermark.opacity = data.opacity; //无用
                   //位置数据
                   watermark.textDtoList = []; //定义一个位置数组
                   //修改对应的boxNumber/pickNumber/printDate/storeName/orderName
                   (function(){ //箱号
                      var ischeck = $('[name=watermark_boxNumberFont_checkbox]').is(':checked');
                      var fontSize = $('[name=watermark_boxNumberFont_select]').val();
                      var location = JSON.parse($('#watermark_boxNumberFontLocation').val());
                      data.boxNumber.selected = ischeck;
                      data.boxNumber.fontSize = Number(fontSize);
                      data.boxNumber.location = location;
                      data.boxNumber.withBrackets = false;
                      watermark.textDtoList.push(data.boxNumber);
                   })();
                   (function(){ //分拣码
                        var ischeck = $('[name=watermark_pickNumberFont_checkbox]').is(':checked');
                        var fontSize = $('[name=watermark_pickNumberFont_select]').val();
                        var location = JSON.parse($('#watermark_pickNumberFontLocation').val());
                        data.pickNumber.selected = ischeck;
                        data.pickNumber.fontSize = Number(fontSize);
                        data.pickNumber.location = location;
                        data.pickNumber.value = $('[name=watermark_pickNumberFont_input]').val();
                        data.pickNumber.withBrackets = false;
                        watermark.textDtoList.push(data.pickNumber);
                    })();
                    (function(){ //日期-店铺名称-订单编号
                        var ischeckP = $('[name=watermark_date_name_orderFont_printDate_checkbox]').is(':checked');
                        var ischeckS = $('[name=watermark_date_name_orderFont_storeName_checkbox]').is(':checked');
                        var ischeckO = $('[name=watermark_date_name_orderFont_orderNumber_checkbox]').is(':checked');
                        var fontSize = $('[name=watermark_date_name_orderFont_select]').val();
                        var location = JSON.parse($('#watermark_date_name_orderFontLocation').val());
                        data.printDate.selected = ischeckP;
                        data.storeName.selected = ischeckS;
                        data.orderNumber.selected = ischeckO;

                        data.printDate.fontSize = Number(fontSize);
                        data.storeName.fontSize = Number(fontSize);
                        data.orderNumber.fontSize = Number(fontSize);

                        data.printDate.location = location;
                        data.storeName.location = location;
                        data.orderNumber.location = location;

                        data.printDate.withBrackets = true;
                        data.storeName.withBrackets = true;
                        data.orderNumber.withBrackets = true;

                        watermark.textDtoList.push(data.printDate);
                        watermark.textDtoList.push(data.storeName);
                        watermark.textDtoList.push(data.orderNumber);
                    })();
                    $.ajax({
                        type: 'post',
                        data:{
                            watermark: JSON.stringify(watermark)
                        },
                        dataType: 'json',
                        url: '/lms/type/watermark/save/'+typeId,
                        // contentType: 'application/json;charset=UTF-8',
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                layer.msg(res.msg);
                                layer.close(index);
                                _this.trigClick();
                            }else{
                                layer.msg(res.msg);
                            }
                        },
                        error: function(){
                            loading.hide();
                            layer.msg('服务器有错误,这锅前端不背');
                        }
                    });
                }
            });
        },
        watermarkApi: function(id){ //水印接口
           return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    url: '/lms/type/watermark/get/'+id,
                    dataType: 'json',
                    beforeSend: function(){
                       loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code=="0000"){
                            resolve(res.data);
                        }else{
                            reject(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器错误');
                    }
                })
           });
        },
        fbalogis_regionalPriceTableRender: function(data,id){
            var _this = this;
            table.render({
                elem: '#fbalogis_regionalPriceTable',
                method: 'post',
                url: '/lms/type/area/charging?logiticsTypeId='+id,
                where: data,
                cols: [
                    [ //表头
                         {type: 'checkbox'}
                        ,{title: '国家',field: 'chName'}
                        ,{title: '首重(g)',field: 'firstWeight'}
                        ,{title: '首费(￥)', field: 'firstCost'}
                        ,{title: '续重(g)',field: 'addedWeight'}
                        ,{title: '续费(￥)', field: 'addedCost'}
                        ,{title: '操作费(不参与折扣)', field: 'operationCost'}
                        ,{title: '上限重量(g)', field: 'maxWeight'}
                        // ,{title: '材积系数', field: 'materialCoefficient'}
                        ,{title: '区域', field: 'area'}
                        ,{title: '操作', align:'center', toolbar: '#fbalogis_regionalPriceTableBar'}
                   ]
                ],
                page: true,
                id: "fbalogis_regionalPriceTable_tableId",
                limits: [50, 100, 300],
                limit: 50,
                done: function(){
                    //工具条监听事件
                    _this.fbalogis_regionalPriceWatchBar(id);
                    //批量删除
                    _this.batchDel(id);
                    _this.areaZipMapping(id);
                    _this.areaCityMapping(id);

                }
            });
        },
        fbalogis_regionalPriceWatchBar: function(id){
            var _this= this;
            var fbalogis_regionalPriceData;
            table.on('tool(fbalogis_regionalPriceTableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'edit'){
                    var index = layer.open({
                        type: 1,
                        title: '设置区域计费',
                        btn: ['保存', '关闭'],
                        area: ['800px', '600px'],
                        content: $('#fbalogis_regionalPriceEdit').html(),
                        success: function(layero, index){
                            data.countryArr = countryArr;
                            var formTemplate = fbalogis_regionalPriceEditFormTpl.innerHTML;
                            var formDiv= document.getElementById('fbalogis_regionalPriceEditForm');
                            laytpl(formTemplate).render(data, function(html){
                                formDiv.innerHTML = html;
                                form.render('select');
                                // formSelects.render();
                            });
                            form.on('submit(fbalogis_regionalPriceEditForm_submit)', function(data){
                                var data = data.field; //获取到表单提交对象
                                fbalogis_regionalPriceData = data;
                                return false;
                            })
                        },
                        yes: function(index, layero){
                            $('[lay-filter=fbalogis_regionalPriceEditForm_submit]').trigger('click');
                            var areaCountry = fbalogis_regionalPriceData.city;
                            delete fbalogis_regionalPriceData.city;
                            fbalogis_regionalPriceData.areaCountry = areaCountry;
                            fbalogis_regionalPriceData.logisTypeId = data.logisTypeId;
                            $.ajax({
                                type: 'post',
                                url: '/lms/type/area/charging/save',
                                dataType: 'json',
                                contentType: 'application/json;charset=UTF-8',
                                data: JSON.stringify(fbalogis_regionalPriceData),
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code=='0000'){
                                        layer.close(index);
                                        layer.msg(res.msg);
                                        _this.fbalogis_regionalPriceTableRender({countryAbbr: ''}, fbalogis_regionalPriceData.logisTypeId);
                                    }else{
                                        layer.msg(res.msg);
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器错误');
                                }
                            });
                        }
                    });
                }else if(obj.event == 'del'){
                    layer.confirm('确定删除？', function(index){
                        $.ajax({
                            type: 'get',
                            url: '/lms/type/area/charging/delete/?ids='+data.id,
                            dataType: 'json',
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                layer.close(index);
                                if(res.code=='0000'){
                                    layer.msg(res.msg);
                                    _this.fbalogis_regionalPriceTableRender({countryAbbr: ''}, id);
                                }
                            }
                        });
                        
                    });
                    
                }
            })
        },
        country: function(){ //国家数据处理
            $.ajax({
                type: 'get',
                url: '/lms/type/area/charging/country',
                dataType: 'json',
                success: function(res){
                    if(res.code == '0000'){
                        var data = res.data;
                        var arr = [];
                        for(var item in data){
                            var sgItem = data[item];
                            for(var i=0; i<sgItem.length; i++){
                                var obj = {
                                   name: sgItem[i].name,
                                   value: sgItem[i].abbr
                                };
                                arr.push(obj)
                            }
                        };
                        countryArr =arr;
                    }else{
                        layer.msg('获取国家列表失败');
                    }
                }
            })
        },
        addDHLData: function(id){ //添加计费信息
            var addData = {
                addedWeight: '',
                addedCost: '',
                area: '',
                firstCost: '',
                firstWeight: '',
                areaNumber: '',
                operationCost: '',
                noDiscountCharges: '',
                areaCountry: '',
                areaDiscount: '',
                // materialCoefficient: '',
                maxWeight: ''
            };
            addData.countryArr = countryArr;
            addData.logisTypeId = id;
            var formTemplate = fbalogis_regionalPriceEditFormTpl.innerHTML;
            var formDiv= document.getElementById('fbalogis_regionalPriceEditForm');
            laytpl(formTemplate).render(addData, function(html){
                formDiv.innerHTML = html;
                form.render('select');
                formSelects.render();
            });
        },
        addDHLClick: function(id){//点击弹框事件
            var _this = this;
            var fbalogis_regionalPriceAddData;
            $('#addNewDHLPrice').on('click',function(){
                var index = layer.open({
                    type: 1,
                    title: '新增区域计费',
                    btn: ['保存', '关闭'],
                    area: ['800px', '600px'],
                    content: $('#fbalogis_regionalPriceEdit').html(),
                    success: function(layero, index){
                       _this.addDHLData(id);
                       form.on('submit(fbalogis_regionalPriceEditForm_submit)', function(data){
                            var data = data.field; //获取到表单提交对象
                            fbalogis_regionalPriceAddData = data;
                            return false;
                       })
                    },
                    yes: function(index,layero){
                      $('[lay-filter=fbalogis_regionalPriceEditForm_submit]').trigger('click');
                      var areaCountry = fbalogis_regionalPriceAddData.city;
                      delete fbalogis_regionalPriceAddData.city;
                      fbalogis_regionalPriceAddData.areaCountry = areaCountry;
                      fbalogis_regionalPriceAddData.logisTypeId = id;
                      $.ajax({
                          type: 'post',
                          url: '/lms/type/area/charging/save',
                          dataType: 'json',
                          contentType: 'application/json;charset=UTF-8',
                          data: JSON.stringify(fbalogis_regionalPriceAddData),
                          beforeSend: function(){
                              loading.show();
                          },
                          success: function(res){
                              loading.hide();
                              if(res.code=='0000'){
                                  layer.close(index);
                                  layer.msg(res.msg);
                                  _this.fbalogis_regionalPriceTableRender({countryAbbr: ''}, id);
                              }else{
                                  layer.msg(res.msg);
                              }
                          },
                          error: function(){
                              loading.hide();
                              layer.msg('服务器错误');
                          }
                      });
                    }
                })
            });
        },
        areaZipMapping: function(){
            var _this = this;
            $('#areaDHLPriceCodeMapping').on('click',function(){
                var checkedArr= table.checkStatus('fbalogis_regionalPriceTable_tableId').data;
                if(checkedArr.length == 0){
                    layer.msg('必须先选中一条数据');
                    return;
                }else if(checkedArr.length > 1){
                    layer.msg('只允许单选');
                    return;
                }else if(checkedArr.length == 1){
                    if(!checkedArr[0].area){
                        layer.msg('区域不能为空');
                        return;
                    };
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        url: '/lms/areaZipCodeRelation/query.html',
                        data: {
                            areaChargingId: checkedArr[0]['id']
                        },
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                layer.open({
                                    type: 1,
                                    title: '区域邮编映射',
                                    btn: ['保存', '关闭'],
                                    area: ['500px', '400px'],
                                    content: $('#fbalogis_areaDHLPriceCodeMappingLayer').html(),
                                    id: 'fbalogis_areaDHLPriceCodeMappingLayerId',
                                    success: function(layero, index){
                                        var data = res.data;
                                        var $tbody = $("#fbalogis_CodeMappingTable_tbody");
                                        if(data.length){
                                            for(var i=0; i<data.length; i++){
                                                var item= data[i];
                                                if(item.zipCodeBegin == null || item.zipCodeBegin == '' ||
                                                    item.zipCodeEnd == null || item.zipCodeEnd == ''){
                                                    continue;
                                                }
                                                var str = `<tr>
                                                    <td>${item.zipCodeBegin}</td>
                                                    <td>${item.zipCodeEnd}</td>
                                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="zipCodeTableDel(this)">删除</span></td>
                                                    </tr>`;
                                                $tbody.append(str);
                                            };
                                        }
                                        $('#fbalogis_CodeMappingTable_tbody_add').on('click', function(){
                                            var grt = $('[name=zipCodeGreatThanAndEqual]').val();
                                            var lt = $('[name=zipCodeLessThan]').val();
                                            if(grt == null || grt == '' || lt == null || lt == ''){
                                                layer.msg("邮编起始值和结束值都需要填写！")
                                                return;
                                            }
                                            var str = `<tr>
                                                    <td>${grt}</td>
                                                    <td>${lt}</td>
                                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="zipCodeTableDel(this)">删除</span></td>
                                                    </tr>`;
                                            $tbody.append(str);
                                            $('[name=zipCodeGreatThanAndEqual]').val('');
                                            $('[name=zipCodeLessThan]').val('');
                                        })
                                    },
                                    yes: function(index, layero){
                                        var putObj = {};
                                        var data = checkedArr[0];
                                        putObj.area = data.area;
                                        putObj.countryCode = data.areaCountry;
                                        putObj.typeId = data.logisTypeId;
                                        var $trs = $('#fbalogis_CodeMappingTable_tbody').find('tr');
                                        var tdsArr = [];
                                        for(var i= 0; i<$trs.length; i++){
                                            var tr = $trs[i];
                                            var obj= {};
                                            obj.zipCodeBegin = $(tr).find('td:first-child').text();
                                            obj.zipCodeEnd = $(tr).find('td:nth-child(2)').text();
                                            tdsArr.push(obj);
                                        }
                                        putObj.list=tdsArr;
                                        $.ajax({
                                            type: 'post',
                                            dataType: 'json',
                                            url: '/lms/areaZipCodeRelation/save.html',
                                            contentType: 'application/json;charset=UTF-8',
                                            data: JSON.stringify(putObj),
                                            beforeSend: function(){
                                                loading.show();
                                            },
                                            success: function(res){
                                                loading.hide();
                                                if(res.code=='0000'){
                                                    layer.close(index);
                                                    layer.msg(res.msg);
                                                }else{
                                                    layer.msg(res.msg);
                                                }
                                            },
                                            error: function(){
                                                loading.hide();
                                                layer.msg('服务器错误');
                                            }                                    
                                        })

                                    }
                                });
                            }else{
                                layer.msg(res.msg);
                            }
                        },
                        error: function(){
                            loading.hide();
                            layer.msg('服务器错误');
                        }
                    });
                }    
            });
        },
        areaCityMapping: function(){
            var _this = this;
            $('#areaCityCodeMapping').on('click',function(){
                var checkedArr= table.checkStatus('fbalogis_regionalPriceTable_tableId').data;
                if(checkedArr.length == 0){
                    layer.msg('必须先选中一条数据');
                    return;
                }else if(checkedArr.length > 1){
                    layer.msg('只允许单选');
                    return;
                }else if(checkedArr.length == 1){
                    if(!checkedArr[0].area){
                        layer.msg('区域不能为空');
                        return;
                    };
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        url: '/lms/areaZipCodeRelation/query.html',
                        data: {
                            areaChargingId: checkedArr[0]['id']
                        },
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                layer.open({
                                    type: 1,
                                    title: '城市区域映射',
                                    btn: ['保存', '关闭'],
                                    area: ['600px', '500px'],
                                    content: $('#fbalogis_areaCityCodeMappingLayer').html(),
                                    id: 'fbalogis_areaDHLPriceCodeMappingLayerId',
                                    success: function(layero, index){
                                        var data = res.data;
                                        var $tbody = $("#areaCityfbalogis_CodeMappingTable_tbody");
                                        if(data.length){
                                            for(var i=0; i<data.length; i++){
                                                var item= data[i];
                                                if((item.logisticsProvince == null || item.logisticsProvince == '') &&
                                                    (item.logisticsCity == null || item.logisticsCity == '')){
                                                    continue;
                                                }
                                                var str = `<tr>
                                                    <td>${item.logisticsProvince}</td>
                                                    <td>${item.logisticsCity}</td>
                                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="zipCodeTableDel(this)">删除</span></td>
                                                    </tr>`;
                                                $tbody.append(str);
                                            };
                                        }
                                        $('#areaCityfbalogis_CodeMappingTable_tbody_add').on('click', function(){
                                            var province = $('[name=logisticsProvince]').val();
                                            var city = $('[name=logisticsCity]').val();
                                            if((province == null || province == '') && (city == null || city == '')){
                                                layer.msg("至少填写一项！")
                                                return;
                                            }
                                            var str = `<tr>
                                                    <td>${province}</td>
                                                    <td>${city}</td>
                                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="zipCodeTableDel(this)">删除</span></td>
                                                    </tr>`;
                                            $tbody.append(str);
                                            $('[name=logisticsProvince]').val('');
                                            $('[name=logisticsCity]').val('');
                                        })
                                    },
                                    yes: function(index, layero){
                                        var putObj = {};
                                        var data = checkedArr[0];
                                        putObj.area = data.area;
                                        putObj.countryCode = data.areaCountry;
                                        putObj.typeId = data.logisTypeId;
                                        var $trs = $('#areaCityfbalogis_CodeMappingTable_tbody').find('tr');
                                        var tdsArr = [];
                                        for(var i= 0; i<$trs.length; i++){
                                            var tr = $trs[i];
                                            var obj= {};
                                            obj.logisticsProvince = $(tr).find('td:first-child').text();
                                            obj.logisticsCity = $(tr).find('td:nth-child(2)').text();
                                            tdsArr.push(obj);
                                        }
                                        putObj.list=tdsArr;
                                        $.ajax({
                                            type: 'post',
                                            dataType: 'json',
                                            url: '/lms/areaZipCodeRelation/save.html',
                                            contentType: 'application/json;charset=UTF-8',
                                            data: JSON.stringify(putObj),
                                            beforeSend: function(){
                                                loading.show();
                                            },
                                            success: function(res){
                                                loading.hide();
                                                if(res.code=='0000'){
                                                    layer.close(index);
                                                    layer.msg(res.msg);
                                                }else{
                                                    layer.msg(res.msg);
                                                }
                                            },
                                            error: function(){
                                                loading.hide();
                                                layer.msg('服务器错误');
                                            }
                                        })

                                    }
                                });
                            }else{
                                layer.msg(res.msg);
                            }
                        },
                        error: function(){
                            loading.hide();
                            layer.msg('服务器错误');
                        }
                    });
                }
            });
        },

        batchDel: function(id){ //批量删除
            var _this= this;
            $('#batchDHLPrice').on('click', function(){
                var checkStatus = table.checkStatus('fbalogis_regionalPriceTable_tableId'),
                selData = checkStatus.data;
                var idsArr = [];
                for(var i=0; i<selData.length; i++){
                    idsArr.push(selData[i].id);
                }
                if(!idsArr.length){
                    layer.msg('请先选中要删除的数据!');
                    return false;
                }
                var ids = idsArr.join();
                layer.confirm('确定删除？', function(index){
                    $.ajax({
                        type: 'get',
                        url: '/lms/type/area/charging/delete/?ids='+ids,
                        dataType: 'json',
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            layer.close(index);
                            if(res.code=='0000'){
                                layer.msg(res.msg);
                                _this.fbalogis_regionalPriceTableRender({countryAbbr: ''}, id);
                            }
                        }
                    });

                })
            })
        },
        importCost: function(){ //上传功能
            //导入计费功能
            upload.render({
                elem: '#fbalogis_importCost' //绑定元素
                ,url: `${ctx}/type/uploadCharging` //上传接口
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
        mouseDragEvent: function($dom, $container){ //鼠标拖拽事件,2个参数鼠标拖拽的元素和元素的父元素
            //禁止选择网页中的文字
            document.onselectstart =function(){
                return false;
            };
            mouseDown = function(e) {
                e = e || window.event;
                var boxW = $dom.width(),
                    boxH = $dom.height(),
                    divW = $container.width(),
                    divH = $container.height(),
                    offsetLeft = e.offsetX, //e.offsetX是相对于父元素box的距离
                    offsetTop = e.offsetY,
                    Left = '',
                    Top = '';
                document.onmousemove=function(evt){
                    evt = evt || window.event;
                    Left = evt.clientX - offsetLeft - $container.offset().left;
                    Top = evt.clientY - offsetTop - $container.offset().top + $(window).scrollTop();
                    $dom.css('left',Left + 'px');
                    $dom.css('top',Top + 'px');
                    $dom.css('right', 'auto');
                    $dom.css('bottom', 'auto');
                    if(Top < 0) $dom.css('top', '0px');
                    if(Left < 0) $dom.css('left', '0px');
                    if(boxW + Left > divW) $dom.css('left',divW - boxW - 2 + 'px');
                    if(boxH + Top > divH) $dom.css('top',divH - boxH - 2 + 'px');
                    evt.preventDefault() ? evt.preventDefault() : evt.returnValue = false;
                };
            };
            $dom.on('mousedown', mouseDown);
            document.onmouseup = function() {
                document.onmousemove = null;
                $dom.off("mousedown");
            };
            return mouseDown;
        },
        //物流公司配置请求
        companyConfigAjax:function(data){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/type/company/config/save',
                params: JSON.stringify(data)
            })
        },
        //物流方式配置请求
        wayConfigAjax:function(data){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/json',
                url: '/lms/type/company/type/config/save',
                params: JSON.stringify(data)
            })
        },
        getAllAttr: function(){ //获取到所有的属性
          return  new Promise(function(resolve, reject){
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/type/init',
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        resolve(res.data);
                    }else{
                        reject(res.data);
                    }
                },
                error: function(){
                    reject('服务器有错误哈');
                }
            });
          })
        }
    };
    fbalogisName.tree();
    fbalogisName.add();
    fbalogisName.country();
    fbalogisName.importCost();
    fbalogisName.showDataHandle();
    //物流方式搜索的表单提交事件
    form.on('submit(fbalogis_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        data.specialType = 'FBA头程';
        fbalogisName.tableRender(data);
        return false;
    });
    //默认即触发点击事件
    fbalogisName.trigClick();
    //上传功能
    function expressBillUpload(id, code){
        upload.render({
            elem: '#'+id //绑定元素
            ,url: '/lms/ireport/upload/logistics?templateCode='+ code //上传接口
            ,accept: 'file' //允许上传的文件类型
            ,exts: 'jrxml|jasper'
            ,done: function(res){
              if(res.code=="0000"){
                  layer.msg(res.msg,{icon:1});
              }else{
                layer.msg(res.msg,{icon:5});
              }
            }
            ,error: function(){
              layer.msg('服务器出现故障!');
            }
        });
    }
    //复制黏贴功能
    fbalogisName.copyOrPaste();

    function getGoodsAgent(pre,dom,selected){//获取货代公司下拉数据
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/lms/type/listByHeadCodeByAgent.html',
            beforeSend: function(){
                loading.show();
            },
            success: function(res){
                loading.hide();
                if(res.code == '0000'){
                    var options = '<option value="">请选择</option>'
                for(var i in res.data){
                    if(selected&&res.data[i].code==selected){
                        options +='<option value="'+res.data[i].code+'" selected>'+res.data[i].name+'</option>'
                    }else{
                        options +='<option value="'+res.data[i].code+'">'+res.data[i].name+'</option>'
                    }
                }
                $(pre+' #'+dom).append(options)
                form.render('select');
                form.render('checkbox');
                }
            },
            error: function(){
                layer.msg('服务器有错误哈');
            }
        });
    }
    window.zipCodeTableDel = function(obj){
        var tr = $(obj).parents('tr');
        $(tr).remove();
    }
    //物流公司配置
    fbalogisName.companyConfig();
    //物流方式配置
    fbalogisName.wayConfig();
})