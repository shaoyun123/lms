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
    var fontSizeArr = [{key: 10,size: 10},{key: 12,size: 12},{key: 14,size: 14},{key: 16,size: 16},{key: 18,size: 18},{key: 20,size: 20},{key: 24,size: 24},{key: 26,size: 26}];
    var countryArr = [];
    //物流方式命名空间
    var logisticsModeName= {
        trigClick: function(){ //触发搜索事件
            $('[lay-filter=logisticsMode_submit]').trigger('click');
        },
        //物流公司配置
        companyConfig: function(){
            var _this = this;
            $('#logisticsMode_logisticCompany').on('click', function(){
                layer.open({
                    type: 1,
                    title: '物流公司配置',
                    btn: ['保存','关闭'],
                    area: ['800px', '600px'],
                    content: $('#logisticsMode_logisticCompanyLayer').html(),
                    success: function(layero,index){
                        _this.addTr(layero, 'logisticsMode_logisticCompany_add', 'logisticsMode_logisticCompany_tbody', 'logisticCompany');
                    },
                    yes: function(index, layero){
                        var trs = layero.find('#logisticsMode_logisticCompany_tbody>tr');
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
                            // console.log(result);
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
            $('#logisticsMode_logisticWay').on('click', function(){
                layer.open({
                    type: 1,
                    title: '物流方式配置',
                    btn: ['保存','关闭'],
                    area: ['800px', '600px'],
                    content: $('#logisticsMode_logisticWayLayer').html(),
                    success: function(layero,index){
                        _this.addTr(layero, 'logisticsMode_logisticWay_add', 'logisticsMode_logisticWay_tbody', 'logisticWay');
                    },
                    yes: function(index, layero){
                        var trs = layero.find('#logisticsMode_logisticWay_tbody>tr');
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
                            // console.log(result);
                        }).catch(function(err){
                            layer.msg(err);
                        })
                    }
                })
            });
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
            Promise.all([_this.getAllAttr(), _this.getCurrencyAjax()]).then(function(result){
                //把物流方案存起来
                // var smtLogisticsWarehouse = sessionStorage.getItem('smtLogisticsWarehouse');
                // if(!smtLogisticsWarehouse){
                //     sessionStorage.setItem('smtLogisticsWarehouse', JSON.stringify(result.smtLogisticsWarehouseData.smtLogisticsWarehouse))
                // }
                $('#logisticsMode_newAdd').on('click', function(){
                    var id = $("input[name=logisticsCompanyId]").val();
                    var index = layer.open({
                        type:1,
                        title: '新增物流方式',
                        btn: ['保存', '关闭'],
                        area: ['1100px', '90%'],
                        content: $('#logisticsMode_newAddLayer').html(),
                        id: 'logisticsMode_newAddLayerId',
                        success: function(layero, index){
                            /**
                             * 获取到物流公司,然后根据物流公司id获取到物流方式配置信息,动态渲染表单
                             */
                            $.ajax({
                                type: 'get',
                                dataType: 'json',
                                url: '/lms/company/specialType?specialType=直发物流,海外仓尾程',
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
                                        form.on('select(logisticsMode_newAdd_sel)', function(data){
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
                                                        res.attrArr = result[0];
                                                        res.currencyLists = result[1];
                                                        // var smtLogisticsWarehouseArrStr = sessionStorage.getItem('smtLogisticsWarehouse');
                                                        var smtLogisticsWarehouseArrStr = JSON.stringify(result[0].smtLogisticsWarehouseData.smtLogisticsWarehouse);
                                                        var packPrintProdLabelListArrStr = JSON.stringify(result[0].packPrintProdLabelList.packPrintProdLabelVal);
                                                        res.smtLogisticsWarehouseArr = new Function(`return ${smtLogisticsWarehouseArrStr}`)();
                                                        res.packPrintProdLabelListArr = new Function(`return ${packPrintProdLabelListArrStr}`)();
                                                        var formTemplate = logisticsMode_newAddLayerFormTpl.innerHTML;
                                                        var formDiv= document.getElementById('logisticsMode_newAddLayerForm');
                                                        laytpl(formTemplate).render(res, function(html){
                                                            formDiv.innerHTML = html;
                                                            getGoodsAgent('.layui-layer-content','goodsAgent')
                                                            form.render('select');
                                                            form.render('checkbox');
                                                             //先隐藏
                                                            let showOrHideArr = ['insuranceRangeMin','insuranceRangeMax','insuranceRatio','isAgreeUpgradeReverseParcelInsure'];
                                                            for(let i=0; i<showOrHideArr.length; i++){
                                                              layero.find(`[data-name=${showOrHideArr[i]}]`).parents('div.logisticsMode_newAddLayerFormAuto').addClass('disN');
                                                            }
                                                            //监听select选项变化
                                                            form.on('select(insuranceFilter)', function(obj){
                                                              if(obj.value == '是'){
                                                                for(let i=0; i<showOrHideArr.length; i++){
                                                                  if(showOrHideArr[i] == 'isAgreeUpgradeReverseParcelInsure'){
                                                                    layero.find(`[data-name=${showOrHideArr[i]}]`).val('否');
                                                                  }else{
                                                                    layero.find(`[data-name=${showOrHideArr[i]}]`).val('');
                                                                  }
                                                                  layero.find(`[data-name=${showOrHideArr[i]}]`).parents('div.logisticsMode_newAddLayerFormAuto').removeClass('disN');
                                                                }
                                                              }else{
                                                                console.log('select变化-否');
                                                                for(let i=0; i<showOrHideArr.length; i++){
                                                                  if(showOrHideArr[i] == 'isAgreeUpgradeReverseParcelInsure'){
                                                                    layero.find(`[data-name=${showOrHideArr[i]}]`).val('否');
                                                                  }else{
                                                                    layero.find(`[data-name=${showOrHideArr[i]}]`).val('');
                                                                  }
                                                                  layero.find(`[data-name=${showOrHideArr[i]}]`).parents('div.logisticsMode_newAddLayerFormAuto').addClass('disN');
                                                                }
                                                              }
                                                            });
                                                        });
                                                var logisticsAttrArr = ['普货'];

                                                for(var i=0; i<result[0].logisticsTypeComboBox.logisticsAttributeList.length; i++){
                                                    var item =result[0].logisticsTypeComboBox.logisticsAttributeList[i]['code'];
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
                                                

                                                        form.on('submit(logisticsMode_newAddLayerForm_submit)', function(data){
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
                                        form.on('select(volumeIntercept_filter)', function(data){
                                            var val = data.value;
                                            if(val == 'true'){
                                                $('.logisticsVolumeInfo_show').removeClass('disN');
                                            }else{
                                                $('.logisticsVolumeInfo_show').addClass('disN');
                                            }
                                        })
                                    };
                                }
                            });
                        },
                        yes: function(index,layero){
                            var companyId =layero.find('[name="companyName"]').val();
                            var agent =layero.find('[name="goodsAgent"]').val();
                            $('[lay-filter=logisticsMode_newAddLayerForm_submit]').trigger('click');
                            var params = [];
                            var $autos = layero.find('.logisticsMode_newAddLayerFormAuto');
                            for(var i=0; i<$autos.length; i++){
                                var item = $autos[i];
                                var obj = {};
                                obj.id = $(item).find('input[type=hidden]:first-child').val();
                                obj.logisticsCompanyId = $(item).find('input[type=hidden]:last-child').val();
                                obj.fieldDesc = $(item).find('label>.labelContent').text();
                                obj.fieldName = $(item).find('.markAutoRender').data('name');
                                obj.fieldValue = $(item).find('.markAutoRender').val();
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
                                if(!addForm.materialCoefficient){
                                    layer.msg("请输入材积系数")
                                    return false;
                                }
                            }else{
                                addForm.throwingWeightType = '';
                                addForm.throwingWeightParam = '';
                                addForm.materialCoefficient = ''
                            }
                            if(addForm.volumeIntercept == 'true'){
                                if(!addForm.eitherSideLength){
                                    layer.msg("请输入任意边长cm≥")
                                    return false ;
                                }
                                if(!addForm.lengthWidthHeightSum){
                                    layer.msg("请输入长+宽+高cm≥")
                                    return false;
                                }
                            } else {
                                addForm.eitherSideLength = '';
                                addForm.lengthWidthHeightSum = '';
                            }
                            if (addForm.autoApplyTrackNum == 2) {
                                addForm.autoApplyTrackNum = true;
                                addForm.limitHasHoldStock = true;
                            } else {
                                addForm.limitHasHoldStock = false;
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
                var getTpl = logisticsMode_provider.innerHTML;
                var getUl= document.getElementById('logisticsMode_tree');
                $.ajax({ //物流商渲染
                    type: 'get',
                    url: '/lms/company/specialType?specialType=直发物流,海外仓尾程',
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
            $('#logisticsMode_tree').on('click', 'li', function(){
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
            $('#logisticsMode_tree').on('click', 'span.set', function(e){
                e.preventDefault();
                e.stopPropagation();
                var id = $(this).data('provider'); //物流商id
                let logisticsProvidersName = $(this).parents('li').find('a').text() //物流商名称
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
                                    id: 'logisticsCompanyLayerId', // 保证唯一性
                                    content: $('#logisticsCompanyLayer').html(),
                                    success: function(layero, index){
                                        var formTemplate = logisticsCompanyLayerFormTpl.innerHTML;
                                        var formDiv= document.getElementById('logisticsCompanyLayerForm');
                                        res.logisticsProvidersName = logisticsProvidersName;
                                        laytpl(formTemplate).render(res, function(html){
                                            formDiv.innerHTML = html;
                                            form.render('select');
                                            //如果是橙联操作按钮
                                            if(logisticsProvidersName == '橙联'){
                                              layero.on('click', '.refresh-token', function(){
                                                commonReturnPromise({
                                                  url: '/lms/company/refreshEdisToken'
                                                }).then(res => {
                                                  layer.msg('刷新token成功,请勿点击保存', {icon:1});
                                                })
                                              });
                                            }
                                        });
                                        if (logisticsProvidersName == 'WISH邮') {
                                            // console.log(layero.find('label'));
                                            var clientId;
                                            layero.find('label').each(function () {
                                                let currentProject = $(this).text()
                                                if(currentProject == '客户端ID'){
                                                    clientId = $(this).parents('.layui-form-item.companyData').find('input[data-name]').val();
                                                }else if (currentProject == '访问令牌' || currentProject == '刷新令牌') {
                                                    $(this).parents('.layui-form-item.companyData').hide()
                                                }else if (currentProject == 'access_token有效日' || currentProject == 'refresh_token有效日') {
                                                    let initTime = $(this).parents('.layui-form-item.companyData').find('input[data-name]').val(),
                                                      resultTime = Format(initTime, 'yyyy-MM-dd hh:mm:ss')
                                                    $(this).parents('.layui-form-item.companyData').find('input[data-name]').val(resultTime)
                                                }else if(currentProject == '授权链接'){
                                                    let url = $(this).parents('.layui-form-item.companyData').find('input[data-name]').val();
                                                    url = url + clientId + "&state=all&scope=user.order.write%20user.order.read%20user.order.read%20user.label.read%20user.tracking.read&force_login=false";
                                                    $(this).parents('.layui-form-item.companyData').find('input[data-name]').val(url)
                                                }
                                            })
                                        }
                                    },
                                    yes: function(index, layero){
                                        $('[lay-filter=logisticsCompanyLayerForm_submit]').trigger('click');
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
                                            if (obj.fieldDesc == "refresh_token有效日" || obj.fieldDesc == "access_token有效日") {
                                                let initTime = obj.fieldValue.replace(/-/g, '/')
                                                initTime = new Date(initTime)
                                                let resultTime = String(Date.parse(initTime))
                                                obj.fieldValue = resultTime.substr(0, resultTime.length - 3)
                                            }
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
            $('#logisticsMode_tree').on('click', 'span.seq',function(e){
                e.preventDefault();
                e.stopPropagation();
                var seq = $(this).data('seq'); //物流公司排序
                var id = $(this).data('provider'); //物流商id
                var index = layer.open({
                    type: 1,
                    title:'排序',
                    id: 'logisticsCompany_seqId',
                    area: ['300px', '200px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsCompany_seq').html(),
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
                elem: '#logisticsMode_table',
                method: 'post',
                url: '/lms/type/list/specialType',
                where:  data,
                cols: [
                    [ //表头
                        {type: 'checkbox',width: 30}
                        ,{title: '物流方式(ID)',templet: '#logisticsMode_nameAndshopElfTypeName', width: '20%'}
                        ,{title: '服务代码', templet: '#logisticsMode_tableCode', width: '20%'}
                        ,{title: '修改时间', field: 'updateTime', templet:'<div>{{Format(d.updateTime,"yyyy-MM-dd hh:mm:ss")}}</div>'}
                        ,{title: '折扣率', field: 'discountRate', width: 220}
                        // ,{title: '自动申请跟踪号',field: 'autoApplyTrackNum'}
                        ,{title: '自动申请跟踪号',templet: '#logisticsMode_tableAuto', width: 110}
                        // ,{title: '上限重量(g)', field: 'packageMaxWeight',width: 110}
                        ,{title: '支持物流属性', field: 'logisticsAttributeList'}
                        ,{title: '状态',templet: '#logisticsMode_tableStatus', width: 65}
                        // ,{title: '面单模板编码', templet: '#logisticsMode_expressBill', width: 100}
                        ,{title: '操作', align:'center', toolbar: '#logisticsMode_tableIdBar', width: 146}
                    ]
                ],
                page: true,
                id: "logisticsMode_tableId",
                unFixedTableHead: true,
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
            $('#logisticsMode_copyCost').on('click', function(){
                var $that = $(this);
                commonTableCksSelected('logisticsMode_tableId').then(function(result){
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
        //21-02-22物流方案同步
        syncPlan: function(){
            $('#logisticsMode_syncLogiPlan').on('click',function(){
                commonReturnPromise({
                    url: '/lms/type/sync/smt/warehouse.html'
                }).then(function(result){
                    layer.msg('同步成功',{icon:1});
                }).catch(function(error){
                    layer.msg(error, {icon:2});
                })
            });
        },
        watchButton: function(info){ //监听面单按钮的点击事件
            var id = info.id;
            var upBtn = 'logisticsMode_billUpload'+id; //上传按钮
            var downBtn = 'logisticsMode_billDown'+id; //下载按钮
            var prevBtn = 'logisticsMode_billPreview'+id; //预览按钮
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
            var filterStatus = 'logisticsMode_tableStatus'+id;
            var filterAuto = 'logisticsMode_tableAuto'+id;
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
                            logisticsModeName.trigClick();
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
            table.on('tool(logisticsMode_tableFilter)',function(obj){
                var data = obj.data;
                var logisTypeId = data.id; //物流方式的id
                var logisTypeName = data.name; //物流方式名称
                var throwingWeightStatus = data.throwingWeightStatus; // 计算抛重
                var dataCopy = data;
                var editFormData;
                if (obj.event == 'edit'){ //编辑弹框
                  Promise.all([_this.getAllAttr(), _this.getCurrencyAjax()]).then(function(result){
                    //把物流方案存起来
                    // var smtLogisticsWarehouse = sessionStorage.getItem('smtLogisticsWarehouse');
                    // if(!smtLogisticsWarehouse){
                    //     sessionStorage.setItem('smtLogisticsWarehouse', JSON.stringify(result.smtLogisticsWarehouseData.smtLogisticsWarehouse))
                    // }
                    var index = layer.open({
                        type: 1,
                        title: '编辑物流方式',
                        area: ['1100px', '90%'],
                        btn: ['保存', '关闭'],
                        content: $('#editLogisticsWay').html(),
                        id: 'editLogisticsWayLayerId',
                        success: function(layero,index){
                                data.attrArr = result[0];
                                data.currencyLists = result[1];
                                // console.log('resultfsdf', result)
                                // var smtLogisticsWarehouseArrStr =sessionStorage.getItem('smtLogisticsWarehouse');
                                var smtLogisticsWarehouseArrStr = JSON.stringify(result[0].smtLogisticsWarehouseData.smtLogisticsWarehouse);
                                var packPrintProdLabelListArrStr = JSON.stringify(result[0].packPrintProdLabelList.packPrintProdLabelVal);
                                var logisticsLabelArrStr = JSON.stringify(result[0].logisticsLabelList.logisticsLabelVal);
                                data.smtLogisticsWarehouseArr = new Function(`return ${smtLogisticsWarehouseArrStr}`)();
                                data.packPrintProdLabelListArr = new Function(`return ${packPrintProdLabelListArrStr}`)();
                                data.logisticsLabelArr = new Function(`return ${logisticsLabelArrStr}`)();
                                var formTemplate = editLogisticsWayFormTemplate.innerHTML;
                                var formDiv= document.getElementById('editLogisticsWayFormDiv');
                                laytpl(formTemplate).render(data, function(html){
                                    getGoodsAgent('#editLogisticsWayForm','editAgent',data.agent)
                                    formDiv.innerHTML = html;
                                    form.render('select');
                                    form.render('checkbox');
                                    //动态更新input展示和隐藏
                                    //先判断该隐藏还是展示
                                    let showOrHideArr = ['insuranceRangeMin','insuranceRangeMax','insuranceRatio','isAgreeUpgradeReverseParcelInsure'];
                                    let paramsArr = JSON.parse(data.params);
                                    for(let i=0; i< paramsArr.length; i++){
                                      let item = paramsArr[i];
                                      if(item.fieldName == 'insurance' && item.fieldValue == '否'){
                                        for(let i=0; i<showOrHideArr.length; i++){
                                          layero.find(`[data-name=${showOrHideArr[i]}]`).parents('div.logisticsModeAuto').addClass('disN');
                                        }
                                        break;
                                      }
                                    }
                                    //监听select选项变化
                                    form.on('select(insuranceFilter)', function(obj){
                                      
                                      if(obj.value == '是'){
                                        for(let i=0; i<showOrHideArr.length; i++){
                                          if(showOrHideArr[i] == 'isAgreeUpgradeReverseParcelInsure'){
                                            layero.find(`[data-name=${showOrHideArr[i]}]`).val('否');
                                          }else{
                                            layero.find(`[data-name=${showOrHideArr[i]}]`).val('');
                                          }
                                          layero.find(`[data-name=${showOrHideArr[i]}]`).parents('div.logisticsModeAuto').removeClass('disN');
                                        }
                                      }else{
                                        for(let i=0; i<showOrHideArr.length; i++){
                                          if(showOrHideArr[i] == 'isAgreeUpgradeReverseParcelInsure'){
                                            layero.find(`[data-name=${showOrHideArr[i]}]`).val('否');
                                          }else{
                                            layero.find(`[data-name=${showOrHideArr[i]}]`).val('');
                                          }
                                          layero.find(`[data-name=${showOrHideArr[i]}]`).parents('div.logisticsModeAuto').addClass('disN');
                                        }
                                      }
                                    });
                                });
                                //物流属性初始化
                                var logisticsAttrArr = [];
                                for(var i=0; i<result[0].logisticsTypeComboBox.logisticsAttributeList.length; i++){
                                    var item =result[0].logisticsTypeComboBox.logisticsAttributeList[i]['code'];
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
                                form.on('submit(editLogisticsWayForm_submit)', function(data){
                                    var data = data.field; //获取到表单提交对象
                                    editFormData = data;
                                    return false;
                                });
                                form.on('select(throwingWeightStatus_filter)', function(data){
                                    var val = data.value;
                                    if(val == 'true'){
                                        layero.find('.logisticsModeStatus_show').removeClass('disN');
                                    }else{
                                        layero.find('.logisticsModeStatus_show').addClass('disN');
                                    }
                                })
                                form.on('select(volumeIntercept_filter)', function(data){
                                    var val = data.value;
                                    if(val == 'true'){
                                        layero.find('.logisticsVolumeInfo_show').removeClass('disN');
                                    }else{
                                        layero.find('.logisticsVolumeInfo_show').addClass('disN');
                                    }
                                })
                        },
                        yes: function(index, layero){
                            $('[lay-filter=editLogisticsWayForm_submit]').trigger('click');
                            var autoFormItems = $('.logisticsModeAuto');
                            var params= [];
                            for(var i=0; i<autoFormItems.length; i++){
                                var item = autoFormItems[i];
                                var singInp = $(item).find('.markAutoRender');
                                var lab =  $(item).find('label>.labelContent');
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
                                    layer.msg("请输入抛重参数")
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
                                dataCopy.weightProportion = '';
                                dataCopy.materialCoefficient = '';
                            }
                            if(dataCopy.volumeIntercept == 'true'){
                                if(!dataCopy.eitherSideLength){
                                    layer.msg("请输入任意边长cm≥")
                                    return false;
                                }
                                if(!dataCopy.lengthWidthHeightSum){
                                    layer.msg("请输入长+宽+高cm≥")
                                    return false;
                                }
                            }else{
                                dataCopy.eitherSideLength = '';
                                dataCopy.lengthWidthHeightSum = '';
                            }
                            var id = data.id;
                            if (dataCopy.autoApplyTrackNum == 2) {
                                dataCopy.limitHasHoldStock = true;
                                dataCopy.autoApplyTrackNum = true;
                            } else {
                                dataCopy.limitHasHoldStock = false;
                            }
                            if(isNaN(dataCopy.maxCustomsPrice)||Number(dataCopy.maxCustomsPrice)<0){
                                layer.msg("税费上限应为正数")
                                return false;
                            }
                            if(isNaN(dataCopy.minCustomsPrice)||Number(dataCopy.minCustomsPrice)<0){
                                layer.msg("税费下限应为正数")
                                return false;
                            }
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
                                        logisticsModeName.trigClick();
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
                        content: $('#carriersLogistics').html(),
                        success: function(layero,index){
                            var getTpl = carriersLogisticsTbodyTpl.innerHTML;
                            var getUl= document.getElementById('carriersLogisticsTbody');
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
                            var $trs = $('#carriersLogisticsTbody').find('tr');
                            var carriesArr = [];
                            for(var i=0; i<$trs.length;i++){
                                var $tr = $trs[i];
                                var id = $($tr).find('td:first-child  input').val();
                                var logisticsTypeId = $($tr).find('td:nth-child(2)  input').val();
                                var platCode = $($tr).find('td:nth-child(3)').text();
                                var logisticsProviderName = $($tr).find('td:nth-child(4) input').val();
                                // var isNeedSyncTrackingNo = $($tr).find('td:last-child input').is(':checked');
                                var obj = {
                                    id: id,
                                    logisticsTypeId: logisticsTypeId,
                                    platCode: platCode,
                                    logisticsProviderName: logisticsProviderName
                                    // isNeedSyncTrackingNo: isNeedSyncTrackingNo
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
                        content: $('#regionalPrice').html(),
                        success: function(layero,index){
                            upload.render({
                                elem: '#areaZipCodeRelationTempImport' //绑定元素
                                ,url: `${ctx}/areaZipCodeRelation/uploadAreaZipCodeRelation.html` //上传接口
                                ,accept: 'file' //允许上传的文件类型
                                ,exts: 'xls|xlsx'
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
                            _this.regionalPriceTableRender({countryAbbr: '',currency: data.currency}, logisTypeId);
                            $('#regionalPriceTableSearch').on('click', function(){
                                var val = $('#regionalPriceInput').val();
                                _this.regionalPriceTableRender({countryAbbr: val,currency: data.currency}, logisTypeId);
                            });
                            $('#regionalPriceTableEmpty').on('click',function(){
                                $('#regionalPriceInput').val('');
                            });
                            //添加功能
                            _this.addDHLClick(logisTypeId,throwingWeightStatus, data.currency);
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
                } else if (obj.event == 'import') {//导入面单
                    let $next = $(this).next('input[type=file]');
                    $next.trigger('click');
                    $next.unbind().change(function (e) {
                        let files = e.target.files;
                        if (!files.length) return;
                        let file = files[0];
                        let formData = new FormData();
                        formData.append('label', file);
                        $.ajax({
                            url: ctx + `/type/watermark/importLabel/${logisTypeId}`,
                            data: formData,
                            type: "POST",
                            async: true,
                            cache: false,
                            contentType: false, //不处理contentType
                            processData: false, //不处理参数
                            dataType: 'json',
                            beforeSend: function () {
                                loading.show();
                            },
                            success: function (res) {
                                loading.hide();
                                //传递完成以后清空input的value
                                e.target.value = '';
                                if (res.code == '9999') {
                                    return layer.msg(res.msg || '接口返回出错,请联系开发', { icon: 2 });
                                } else {
                                    return layer.msg('导入成功,请点击面单水印进行后续操作', { icon: 1 });
                                }
                            },
                            error: function (error) {
                                loading.hide();
                                //传递完成以后清空input的value
                                e.target.value = '';
                                layer.msg(`${error.statusText}`, { icon: 2 });
                            }
                        })
                    });
                }else if(obj.event == 'set'){ //设置面单
                  let index = layer.open({
                    type: 1,
                    title: '面单设置',
                    btn: ['保存', '关闭'],
                    area: ['500px', '300px'],
                    content: $('#logisticsMode_tableSetFaceSheetLayer').html(),
                    id: 'logisticsMode_tableSetFaceSheetLayerId',
                    success: function(layero, index){
                      //先请求接口渲染所有的select
                      commonReturnPromise({
                        url: '/lms/printTemplate/list?status=1&page=1&limit=1000'
                      }).then(res => {
                        commonRenderSelect('FaceSheetLayer_printTemplateId', res, {
                          code: 'id',
                          name: 'templateName',
                          selected: data.printTemplateId
                        }).then(()=>{
                          form.render('select');
                        })
                      });
                      //默认展示
                      if(data.printTemplateId == 0){
                        //展示官方面单,面单模板隐藏
                        layero.find('.facesheetType1').prop('checked', true);
                        layero.find('#FaceSheetLayer_printTemplateId').parents('.layui-form-item').addClass('disN');
                      }else{
                        layero.find('.facesheetType2').prop('checked', true);
                        layero.find('#FaceSheetLayer_printTemplateId').parents('.layui-form-item').removeClass('disN');
                      }
                      form.render('radio');
                      //监听选中,然后展示
                      form.on('radio(facesheetTypeFilter)', function(data){
                        layero.find('#FaceSheetLayer_printTemplateId').val('');
                        if(data.value == 1){ //自定义面单
                          layero.find('#FaceSheetLayer_printTemplateId').parents('.layui-form-item').removeClass('disN');
                        }else{//官方面单
                          layero.find('#FaceSheetLayer_printTemplateId').parents('.layui-form-item').addClass('disN');
                        }
                        form.render('select');
                      });
                    },
                    yes: function(index, layero){
                      //获取需要提交的数据
                      let obj = {};
                      if(layero.find('[name="facesheetType"]:checked').val()== 0){
                        obj = {
                          id: data.id,
                          printTemplateId: 0
                        }
                      }else{
                        let val = layero.find('#FaceSheetLayer_printTemplateId').val();
                        if(!val){
                          return layer.msg('请先选择自定义模板', {icon:7});
                        }
                        obj = {
                          id: data.id,
                          printTemplateId: Number(val)
                        }
                      }
                      commonReturnPromise({
                        url: '/lms/type/updatePrintTemplateId',
                        type: 'post',
                        contentType: 'application/json',
                        params: JSON.stringify(obj)
                      }).then(res => {
                        layer.msg(res || '操作成功', {icon:1});
                        layer.close(index);
                        //刷新请求
                        _this.trigClick();
                      })
                    }
                  })
                }
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
                content: $('#logisticsMode_watermark').html(),
                success: function(layero, index){
                    /**
                     * 对箱号/分拣码/时间/店铺名称/订单分别进行赋值
                    */
                     data.boxNumber = {}; //箱号对象
                     data.pickNumber = {}; //分拣码对象
                     data.printDate = {}; //打印时间对象
                     data.storeName = {}; //店铺名称对象
                     data.orderNumber = {}; //订单编号对象
                     data.skuInfoNumberEnName = {}; //SKU对象
                     data.countryName = {}; //国家相关
                     data.storeNameSub = {}; //店铺名称截图
                    for (let i = 0; i < data.textDtoList.length; i++){
                        let item = data.textDtoList[i];
                        if (item.name == "boxNumber") {
                            data.boxNumber = item;
                        } else if (item.name == 'pickNumber') {
                            data.pickNumber = item;
                        }else if (item.name == 'printDate') {
                            data.printDate = item;
                        }else if (item.name == 'storeName') {
                            data.storeName = item;
                        }else if (item.name == 'orderNumber') {
                            data.orderNumber = item;
                        }else if (item.name == 'countryName') {
                            data.countryName = item;
                        } else if (item.name == 'skuInfoNumberEnName') {
                            data.skuInfoNumberEnName = item;
                        } else if (item.name == 'storeNameSub') {
                          data.storeNameSub = item;
                        }
                        
                    }
                    var formTemplate = logisticsMode_watermark_contentTpl.innerHTML;
                    var formDiv= document.getElementById('logisticsMode_watermark_content');
                    laytpl(formTemplate).render(data, function(html){
                        formDiv.innerHTML = html;
                        form.render();
                        //同步最新面单按钮
                        $('#syncLastNewSheetBtn').on('click', function(){
                            commonReturnPromise({
                                url: `/lms/type/watermark/update/${data.typeId}`
                            }).then(function(result){
                                $('#watermark_containerBox').css({
                                    'width': result.imgWidth + 'px',
                                    'height': result.imgHeight + 'px',
                                    'backgroundImage': `url(${result.imgUrl})`,
                                    'position': 'relative',
                                    'border': '1px solid #ccc',
                                    'background-repeat': 'no-repeat',
                                    'box-sizing': 'border-box'
                                });
                                layer.msg('更新最新面单成功',{icon:1});
                            })
                        });
                    });
                    //生成背景模板
                    $('#watermark_containerBox').css({
                        'width': data.imgWidth + 'px',
                        'height': data.imgHeight + 'px',
                        'backgroundImage': `url(${data.imgUrl})`,
                        'position': 'relative',
                        'border': '1px solid #ccc',
                        'background-repeat': 'no-repeat',
                        'box-sizing': 'border-box'
                    });
                    //渲染初始位置信息
                    (function(){ //箱号
                        var location = data.boxNumber.location; //获取到位置信息
                        // var $parentHeight = $('#watermark_containerBox').height();
                        // var $height = $('#watermark_boxNumberFont').height();
                        var Top = -location.y;
                        var Left = location.x; //左侧距离
                        // var Top = 0;
                        $('#watermark_boxNumberFont').css({
                            top: Top+'px',
                            left: Left+'px'
                        });
                    })();
                    (function(){ //店铺名称截取
                      var location = data.storeNameSub.location; //获取到位置信息
                      // var $parentHeight = $('#watermark_containerBox').height();
                      // var $height = $('#watermark_boxNumberFont').height();
                      var Top = -location.y;
                      var Left = location.x; //左侧距离
                      // var Top = 0;
                      $('#watermark_storeNameSubFont').css({
                          top: Top+'px',
                          left: Left+'px'
                      });
                    })();
                    (function(){ //SKU信息
                        var location = data.skuInfoNumberEnName.location; //获取到位置信息
                        // var $parentHeight = $('#watermark_containerBox').height();
                        // var $height = $('#watermark_skuInfoNumberEnNameFont').height();
                        var Left = location.x; //左侧距离
                        var Top = -location.y;
                        $('#watermark_skuInfoNumberEnNameFont').css({
                            top: Top+'px',
                            left: Left+'px'
                        });
                    })();
                    // (function(){ //国家
                    //     var location = data.countryName.location; //获取到位置信息
                    //     // var $parentHeight = $('#watermark_containerBox').height();
                    //     // var $height = $('#watermark_countryNameFont').height();
                    //     var Left = location.x; //左侧距离
                    //     var Top = -location.y;
                    //     $('#watermark_countryNameFont').css({
                    //         top: Top+'px',
                    //         left: Left+'px'
                    //     });
                    // })();
                    (function(){ //分拣码[主动输入]
                        var location = data.pickNumber.location; //获取到位置信息
                        var Left = location.x; //左侧距离
                        // var $parentHeight = $('#watermark_containerBox').height();
                        // var $height = $('#watermark_pickNumberFont').height();
                        var Top = -location.y;
                        $('#watermark_pickNumberFont').css({
                            top: Top+'px',
                            left: Left+'px'
                        });
                    })();
                    (function(){ //时间-店铺-订单编号
                        var location = data.printDate.location; //获取到位置信息
                        var Left = location.x; //左侧距离
                        // var $parentHeight = $('#watermark_containerBox').height();
                        // var $height = $('#watermark_date_name_orderFont').height()/2;
                        var Top = -location.y;
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
                            // console.log(e.currentTarget.style.top.replace(/px/, ''));
                            // var Top = data.imgHeight - Number(e.currentTarget.style.top.replace(/px/, '')) - e.currentTarget.clientHeight;
                            var Top = Number(e.currentTarget.style.top.replace(/px/, ''));
                            var ps = {
                                x: Left,
                                y: -Top,
                                rotation: 0
                            };
                            $('#'+fontId+'Location').val(JSON.stringify(ps));
                        });
                        mouseDownFont = _this.mouseDragEvent($watermarkFontBox, $('#watermark_containerBox'));
                    }
                    //箱号文字拖拽
                    fontDragHandle('watermark_boxNumberFont');
                    //ztt20231123 店铺名称截取拖拽
                    fontDragHandle('watermark_storeNameSubFont');
                    //SKU信息拖拽
                    fontDragHandle('watermark_skuInfoNumberEnNameFont');
                    //国家拖拽
                    // fontDragHandle('watermark_countryNameFont');
                    //分拣码文字拖拽
                    fontDragHandle('watermark_pickNumberFont');
                    //时间-店铺名称-订单编号文字拖拽
                    fontDragHandle('watermark_date_name_orderFont');
                    //监听checkbox是否选中
                    form.on('checkbox', function(obj){
                        var dom = obj.elem;
                        let titleArr = ['打印时间', '店铺名称', '订单编号', 'SKU信息', '国家/地区信息'];
                        if(titleArr.includes(dom.title)){
                            var cls = dom.name.replace(/(\_checkbox)/, '');
                            // console.log(cls, dom.checked);
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
                                }else if(dom.title == '加粗'){
                                  layero.find('#watermark_storeNameSubFont span').css({
                                    fontWeight: 900
                                  });
                                }else{
                                    $('#'+id).removeClass('disN');
                                }
                            }else{
                                if(dom.name.indexOf('pickNumber')>-1){
                                    $('#'+id).addClass('disN');
                                    $('[name=watermark_pickNumberFont_input]').parents('.layui-form-item').addClass('disN');
                                }else if(dom.title == '加粗'){
                                  layero.find('#watermark_storeNameSubFont span').css({
                                    fontWeight: 500
                                  });
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
                        
                        //根据国家信息的选中状态复制
                        let countryCked = $('[name=watermark_date_name_orderFont_countryName_checkbox]').is(':checked');
                        if (countryCked) {
                            $('#watermark_pickNumberFont>span').html(`${val}<span class="watermark_date_name_orderFont_countryName">国家/地区信息</span>`);
                        } else {
                            $('#watermark_pickNumberFont>span').html(`${val}<span class="watermark_date_name_orderFont_countryName disN">国家/地区信息</span>`);;
                        }
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
                   (function(){ //店铺名称截取
                      var ischeck = $('[name=watermark_storeNameSubFont_checkbox]').is(':checked');
                      var fontSize = $('[name=watermark_storeNameSubFont_select]').val();
                      var location = JSON.parse($('#watermark_storeNameSubFontLocation').val());
                      data.storeNameSub.selected = ischeck;
                      data.storeNameSub.fontSize = Number(fontSize);
                      data.storeNameSub.location = location;
                      data.storeNameSub.withBrackets = false;
                      data.storeNameSub.bold = $('[name=storeNameSubFont_isBold]').is(':checked');
                      watermark.textDtoList.push(data.storeNameSub);
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
                        //国家
                        var ischeckCountry = $('[name=watermark_date_name_orderFont_countryName_checkbox]').is(':checked');
                        data.countryName.selected = ischeckCountry;
                        data.countryName.fontSize = Number(fontSize);
                        data.countryName.location = location;
                        data.countryName.withBrackets = false;
                        watermark.textDtoList.push(data.countryName);
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
                    (function(){ //SKU信息
                        var ischeck = $('[name=watermark_date_name_orderFont_skuInfoNumberEnName_checkbox]').is(':checked');
                        var fontSize = $('[name=watermark_date_name_orderFont_select]').val();
                        var location = JSON.parse($('#watermark_skuInfoNumberEnNameFontLocation').val());
                        data.skuInfoNumberEnName.selected = ischeck;
                        data.skuInfoNumberEnName.fontSize = Number(fontSize);
                        data.skuInfoNumberEnName.location = location;
                        data.skuInfoNumberEnName.withBrackets = false;
                        watermark.textDtoList.push(data.skuInfoNumberEnName);
                    })();
                    // (function(){ //国家
                    //     var ischeck = $('[name=watermark_date_name_orderFont_countryName_checkbox]').is(':checked');
                    //     var fontSize = $('[name=watermark_date_name_orderFont_select]').val();
                    //     var location = JSON.parse($('#watermark_countryNameFontLocation').val());
                    //     data.countryName.selected = ischeck;
                    //     data.countryName.fontSize = Number(fontSize);
                    //     data.countryName.location = location;
                    //     data.countryName.withBrackets = false;
                    //     watermark.textDtoList.push(data.countryName);
                    // })();
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
        regionalPriceTableRender: function(data,id){
            var _this = this;
            let currency = data.currency || '';
            table.render({
                elem: '#regionalPriceTable',
                method: 'post',
                url: '/lms/type/area/charging?logiticsTypeId='+id,
                where: data,
                cols: [
                    [ //表头
                         {type: 'checkbox'}
                        ,{title: '国家/地区',field: 'chName', templet:"<div>{{d.chName}}({{d.areaCountry}})</div>"}
                        ,{title: '首重(g)',field: 'firstWeight'}
                        ,{title: `首费(${currency})`, field: 'firstCost'}
                        ,{title: '续重(g)',field: 'addedWeight'}
                        ,{title: `续费(${currency})`, field: 'addedCost'}
                        ,{title: '操作费<i class="layui-icon regionalPriceHeader cost" style="cursor:pointer;">&#xe60b;</i>', field: 'operationCost'}
                        ,{title: '上限重量(g)<i class="layui-icon regionalPriceHeader weight" style="cursor:pointer;">&#xe60b;</i> ', field: 'maxWeight', width: 100}
                        // ,{title: '材积系数', field: 'materialCoefficient'}
                        , { title: '区域', field: 'area' }
                        , { title: '更新时间', field: 'updateTime', templet:"<div>{{Format(d.updateTime || d.createTime,'yyyy-MM-dd hh:mm:ss')}}</div>"}
                        ,{title: '操作', align:'center', toolbar: '#regionalPriceTableBar'}
                   ]
                ],
                page: true,
                id: "regionalPriceTable_tableId",
                limits: [50, 100, 300],
                limit: 50,
                done: function(){
                    //工具条监听事件
                    _this.regionalPriceWatchBar(id);
                    //批量删除
                    _this.batchDel(id);
                    _this.areaZipMapping(id);
                    _this.areaZipCodeMapping(id)
                    _this.areaCityMapping(id);
                    _this.regionalPriceMouseHandle();
                }
            });
        },
        //悬浮鼠标进入和离开事件
        regionalPriceMouseHandle: function () {
            let $thead = $('#regionalPriceTable').next().find('.layui-table-header');
            //鼠标离开
            $thead.on('mouseleave', '.regionalPriceHeader', function () {
                layer.closeAll('tips');
            });
            //鼠标进入
            $thead.on('mouseenter', '.regionalPriceHeader', function () {
                let $this = $(this);
                if ($this.hasClass('cost')) {//费用
                    layer.tips('不参与折扣', this, {
                        tips: [1, '#78BA32']
                    });
                } else {//重量
                    layer.tips('根据国家判断，相同国家取第一个值', this, {
                        tips: [1, '#78BA32']
                    });
                }
            });
        },
        regionalPriceWatchBar: function(id){
            var _this= this;
            var regionalPriceData;
            table.on('tool(regionalPriceTableFilter)',function(obj){
                var data = obj.data;
                let throwingWeightStatus = data.throwingWeightStatus;
                if(obj.event == 'edit'){
                    var index = layer.open({
                        type: 1,
                        title: '设置区域计费',
                        btn: ['保存', '关闭'],
                        area: ['800px', '600px'],
                        content: $('#regionalPriceEdit').html(),
                        success: function(layero, index){
                            data.countryArr = countryArr;
                            var formTemplate = regionalPriceEditFormTpl.innerHTML;
                            var formDiv= document.getElementById('regionalPriceEditForm');
                            laytpl(formTemplate).render(data, function(html){
                                formDiv.innerHTML = html;
                                form.render('select');
                                // formSelects.render();
                            });
                            form.on('submit(regionalPriceEditForm_submit)', function(data){
                                var data = data.field; //获取到表单提交对象
                                regionalPriceData = data;
                                return false;
                            })
                        },
                        yes: function(index, layero){
                            $('[lay-filter=regionalPriceEditForm_submit]').trigger('click');
                            var areaCountry = regionalPriceData.city;
                            delete regionalPriceData.city;
                            regionalPriceData.areaCountry = areaCountry;
                            regionalPriceData.logisTypeId = data.logisTypeId;
                            // if(throwingWeightStatus == true && regionalPriceData.materialCoefficient == ''){
                            //     return layer.msg('请输入材积系数',{icon:2})
                            // }
                            $.ajax({
                                type: 'post',
                                url: '/lms/type/area/charging/save',
                                dataType: 'json',
                                contentType: 'application/json;charset=UTF-8',
                                data: JSON.stringify(regionalPriceData),
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code=='0000'){
                                        layer.close(index);
                                        layer.msg(res.msg);
                                        _this.regionalPriceTableRender({countryAbbr: '',currency: data.currency}, regionalPriceData.logisTypeId);
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
                                    _this.regionalPriceTableRender({countryAbbr: '',currency: data.currency}, id);
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
        addDHLData: function(id, currency){ //添加计费信息
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
                maxWeight: '',
                currency: currency
            };
            addData.countryArr = countryArr;
            addData.logisTypeId = id;
            var formTemplate = regionalPriceEditFormTpl.innerHTML;
            var formDiv= document.getElementById('regionalPriceEditForm');
            laytpl(formTemplate).render(addData, function(html){
                formDiv.innerHTML = html;
                form.render('select');
                formSelects.render();
            });
        },
        addDHLClick: function(id,throwingWeightStatus, currency){//点击弹框事件
            var _this = this;
            var regionalPriceAddData;
            $('#addNewDHLPrice').on('click',function(){
                var index = layer.open({
                    type: 1,
                    title: '新增区域计费',
                    btn: ['保存', '关闭'],
                    area: ['800px', '600px'],
                    content: $('#regionalPriceEdit').html(),
                    success: function(layero, index){
                       _this.addDHLData(id, currency);
                       form.on('submit(regionalPriceEditForm_submit)', function(data){
                            var data = data.field; //获取到表单提交对象
                            regionalPriceAddData = data;
                            return false;
                       })
                    },
                    yes: function(index,layero){
                      $('[lay-filter=regionalPriceEditForm_submit]').trigger('click');
                      var areaCountry = regionalPriceAddData.city;
                      delete regionalPriceAddData.city;
                      regionalPriceAddData.areaCountry = areaCountry;
                      regionalPriceAddData.logisTypeId = id;
                    //   if(throwingWeightStatus == true && regionalPriceAddData.materialCoefficient == ''){
                    //       return layer.msg('请输入材积系数',{icon:2})
                    //   }
                      $.ajax({
                          type: 'post',
                          url: '/lms/type/area/charging/save',
                          dataType: 'json',
                          contentType: 'application/json;charset=UTF-8',
                          data: JSON.stringify(regionalPriceAddData),
                          beforeSend: function(){
                              loading.show();
                          },
                          success: function(res){
                              loading.hide();
                              if(res.code=='0000'){
                                  layer.close(index);
                                  layer.msg(res.msg);
                                  _this.regionalPriceTableRender({countryAbbr: '', currency: currency}, id);
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
                var checkedArr= table.checkStatus('regionalPriceTable_tableId').data;
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
                                    content: $('#areaDHLPriceCodeMappingLayer').html(),
                                    id: 'areaDHLPriceCodeMappingLayerId',
                                    success: function(layero, index){
                                        var data = res.data;
                                        var $tbody = $("#CodeMappingTable_tbody");
                                        if(data.length){
                                            for(var i=0; i<data.length; i++){
                                                var item= data[i];
                                                if(!item.zipCodeBegin|| !item.zipCodeEnd){
                                                    continue;
                                                } else {
                                                    var str = `<tr>
                                                        <td>${item.zipCodeBegin}</td>
                                                        <td>${item.zipCodeEnd}</td>
                                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="zipCodeTableDel(this)">删除</span></td>
                                                        </tr>`;
                                                    $tbody.append(str);
                                                }
                                            };
                                        }
                                        $('#CodeMappingTable_tbody_add').on('click', function(){
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
                                        putObj.isZip = true;
                                        var $trs = $('#CodeMappingTable_tbody').find('tr');
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
        areaZipCodeMapping: function(id){
            var _this = this;
            $('#regionalPrice_areaZipCodeMapping').on('click',function(){
                var checkedArr= table.checkStatus('regionalPriceTable_tableId').data;
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
                    const areaChargingId = checkedArr[0]['id']
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        url: '/lms/areaZipCodeRelation/query.html',
                        data: {
                            areaChargingId,
                        },
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                layer.open({
                                    type: 1,
                                    title: '区域邮编号映射',
                                    btn: ['保存', '关闭'],
                                    area: ['500px', '400px'],
                                    content: $('#regionalPrice_areaZipCodeMappingLayer').html(),
                                    id: 'regionalPrice_areaZipCodeMappingLayerId',
                                    success: function(layero, index){
                                        var data = res.data;
                                        const zipCodeStrDom=$('#regionalPrice_areaZipCodeMappingLayer_zipCodeStr')
                                        if(data.length){
                                            zipCodeStrDom.val(data[0].zipCodeStr)
                                        }
                                        zipCodeStrDom.blur(function(e){
                                            const val = e.target.value
                                            e.target.value = val.replaceAll('，',',')
                                        })
                                    },
                                    yes: function(index, layero){
                                        const zipCodeStrDom=$('#regionalPrice_areaZipCodeMappingLayer_zipCodeStr')
                                        var putObj = {
                                            zipCodeStr:zipCodeStrDom.val(),
                                            areaChargingId
                                        };
                                        $.ajax({
                                            type: 'post',
                                            dataType: 'json',
                                            url: '/lms/areaZipCodeRelation/saveZipCodeStr.html',
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
                var checkedArr= table.checkStatus('regionalPriceTable_tableId').data;
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
                                    content: $('#areaCityCodeMappingLayer').html(),
                                    id: 'areaDHLPriceCodeMappingLayerId',
                                    success: function(layero, index){
                                        var data = res.data;
                                        var $tbody = $("#areaCityCodeMappingTable_tbody");
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
                                        $('#areaCityCodeMappingTable_tbody_add').on('click', function(){
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
                                        var $trs = $('#areaCityCodeMappingTable_tbody').find('tr');
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
                var checkStatus = table.checkStatus('regionalPriceTable_tableId'),
                selData = checkStatus.data;
                var idsArr = [];
                let currency = selData[0]['currency'] || '';
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
                                _this.regionalPriceTableRender({countryAbbr: '',currency: currency}, id);
                            }
                        }
                    });

                })
            })
        },
        importCost: function(){ //上传功能
            //导入计费功能
            upload.render({
                elem: '#logisticsMode_importCost' //绑定元素
                ,url: `${ctx}/type/uploadCharging` //上传接口
                ,accept: 'file' //允许上传的文件类型
                ,exts: 'xlsx'
                ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                    loading.show(); //上传loading
                }
                ,done: function(res){
                    loading.hide()
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
                    loading.hide()
                    layer.msg('服务器出现故障!');
                }
            });
        },
        importChargingPartProperty: function(){ // 导入修改上限重量
            upload.render({
                elem: '#logisticsMode_importChargingPartProperty' //绑定元素
                ,url: `${ctx}/type/uploadChargingPartProperty` //上传接口
                ,accept: 'file' //允许上传的文件类型
                ,exts: 'xlsx'
                ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                    loading.show(); //上传loading
                }
                ,done: function(res){
                    loading.hide()
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
                    loading.hide()
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
        },
        //获取到币种
        getCurrencyAjax: function(){
          return commonReturnPromise({
            url: '/lms/sys/getLogisRates?limit=500'
          })
        }
    };
    logisticsModeName.tree();
    logisticsModeName.add();
    logisticsModeName.country();
    logisticsModeName.importCost();
    logisticsModeName.importChargingPartProperty()
    //物流方式搜索的表单提交事件
    form.on('submit(logisticsMode_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        data.specialType = '直发物流,海外仓尾程';
        logisticsModeName.tableRender(data);
        return false;
    });
    // 下载模板
    form.on('select(logisticsMode_downloadTpl_filter)', function(data){
        const { value } = data
        switch(value){
            // 计费模板
            case "logisticsChargeTmpTpl":
            window.open(`${ctx}/type/logisticsChargeTmpDownload`)
            break;
            // 修改上限重量模板
            case "maxWeightMaterialCoefficientTpl":
                window.open(`${ctx}/type/maxWeightMaterialCoefficientDownload`)
            break;
        }
    })
    //默认即触发点击事件
    logisticsModeName.trigClick();
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
    logisticsModeName.copyOrPaste();
    //SMT物流方案同步
    logisticsModeName.syncPlan();

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
    logisticsModeName.companyConfig();
    //物流方式配置
    logisticsModeName.wayConfig();
})