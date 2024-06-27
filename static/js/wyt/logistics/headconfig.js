/**
 * @desc 万邑通头程配置
 * @author zhangtt
 * @time 7.3-??
 * @tips 使用自执行匿名函数来实现闭包
 */
;(function(){
    var countryArr = [];
    var wytLogisticsName = '万邑通EB头程';//全局匹配的万邑通头程名称
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
        //头程配置命名空间
        var headconfigName = {
            trigClick: function(){ //触发搜索事件
                $('[lay-filter=headconfig_submit]').trigger('click');
            },
            //渲染物流公司
            companyRender: function(){
                var data = JSON.parse(sessionStorage.getItem('OUTWAREHOURSE'));
                var $select = $('#headconfig_searchForm').find('select[name=logisticsCompanyId]');
                var str='<option value="">请选择</option>';
                for(var i=0; i<data.length; i++){
                    var item = data[i];
                    str += `<option value="${item.id}">${item.cnName}</option>`;
                }
                $select.html(str);
                form.render('select');
            },
            //渲染弹框物流公司
            companyLayerRender: function(layero,id){
                if(!id){
                    id = '';
                }
                var data = JSON.parse(sessionStorage.getItem('OUTWAREHOURSE'));
                var $select = layero.find('select[name=headconfig_logisticsCompany]');
                var str='<option value="">请选择</option>';
                for(var i=0; i<data.length; i++){
                    var item = data[i];
                    if(item.id ==id){
                        str += `<option value="${item.id}" selected>${item.cnName}</option>`;
                    }else{
                        str += `<option value="${item.id}">${item.cnName}</option>`;
                    } 
                }
                $select.html(str);
                form.render('select');
            },
            //销售头程弹框
            saleHead: function($layero){
                var _this = this;
                var clickBtn = $layero.find('#headconfig_addSaleLogisticsType');
                var $select = $layero.find('#headconfig_saleLogisticsType');
                clickBtn.on('click', function(){
                    layer.open({
                        type: 1,
                        title: '销售头程',
                        btn: ['保存', '关闭'],
                        area: ['600px', '660px'],
                        content: $('#addSaleLogisticsTypeLayer').html(),
                        id: 'addSaleLogisticsTypeLayerId',
                        success: function(){
                            _this.getAllSaleHead().then(function(result){
                                var formTemplate = addSaleLogisticsTypeContainerTpl.innerHTML;
                                var formDiv= document.getElementById('addSaleLogisticsTypeContainer');
                                laytpl(formTemplate).render(result, function(html){
                                    formDiv.innerHTML = html;
                                    var $tbody = $('#addSaleLogisticsTypeContainer_tbody');
                                    var addBtn = $('#addSaleLogisticsTypeContainer_row');
                                    var $input = $('[name=addSaleLogisticsTypeContainer_input]');
                                    addBtn.on('click', function(){
                                        var val = $input.val();
                                        if(!val){
                                            return layer.msg('请先输入头程!',{icon:7});
                                        }
                                        var $tr = `<tr>
                                        <td>${val}</td>
                                        <td>
                                            <span class="layui-btn layui-btn-danger layui-btn-xs" onclick="commonDelTr(this)">删除</span>
                                        </td>
                                        </tr>`;
                                        $tbody.append($tr);
                                    });
                                });
                            });
                        },
                        yes: function(index){
                            var $tbody = $('#addSaleLogisticsTypeContainer_tbody');
                            var $trs = $tbody.find('tr');
                            var saleLogisticsNameArr = [];
                            for(var i=0; i<$trs.length; i++){
                                var item = $trs[i];
                                var txt = $(item).find('td:first-child').text();
                                saleLogisticsNameArr.push(txt);
                            }
                            var saleLogisticsNameStr = saleLogisticsNameArr.join(',');
                            _this.saveAllSaleHead(saleLogisticsNameStr).then(function(){
                                layer.msg('保存成功',{icon:1});
                                layer.close(index);
                                _this.getAllSaleHead().then(function(result){
                                    var str = '';
                                    for(var i=0; i<result.length;i++){
                                        var item = result[i];
                                        str += `<option value="${item.saleLogisticsTypeName}">${item.saleLogisticsTypeName}</option>`;
                                    }
                                    $select.html(str);
                                    form.render('select');
                                })
                            }).catch(function(err){
                                layer.confirm(err, {icon:2}, function(index){
                                    layer.close(index);
                                });   
                            })
                        }
                    });
                })
            },
            //新增详情数据
            newAddData: function(){
                var defaultObj = {
                    companyName: '万邑通EB头程',
                    agent: '',
                    name: '',
                    remark: '',
                    shopElfTypeName: '',
                    discountRate: 1,
                    logisticsAttributeList: '',
                    autoApplyTrackNum: true,
                    packageMinWeight: 0,
                    packageMaxWeight: 0,
                    throwingWeightStatus: true,
                    throwingWeightType: 1,
                    throwingWeightParam: 0,
                    wytLogisticsName: wytLogisticsName, //万邑通EB头程的名称
                    company: '', //物流公司
                    trackingNoPrefix: ''   //物流单号前缀
                }
                return defaultObj;
            },
            //新增函数处理
            newAdd: function(){
                var _this = this;
                $('#headconfig_newAdd').on('click', function(){
                    var newAddFormData;
                    var defaultObj = _this.newAddData();
                    var attrArr = JSON.parse(sessionStorage.getItem('LOGISTICSATTR'));//物流属性
                    var agentArr = JSON.parse(sessionStorage.getItem('AGENTCOMPANY'));//货代公司
                    defaultObj.attrArr = attrArr; //设置物流属性
                    defaultObj.agentArr = agentArr; //设置货代公司
                    layer.open({ 
                        type: 1,
                        title: '新增物流方式',
                        area: ['1100px', '100%'],
                        btn: ['保存', '关闭'],
                        content: $('#headconfig_editLogisticsWay').html(),
                        success: function(layero, index){
                            //渲染弹框
                            _this.companyLayerRender(layero);
                            //监听海外仓选择
                            form.on('select(headconfig_logisticsCompanyFilter)', function(obj){
                                var val = obj.value;
                                var selTxt = $(obj.elem).find('option:selected').text();
                                if(val){
                                    Promise.all([_this.getOutConfig(val),_this.getAllSaleHead()]).then(function(result){
                                        defaultObj.params = result[0];
                                        defaultObj.saleLogisticsTypes = result[1];
                                        var formTemplate = headconfig_editLogisticsWayFormTemplate.innerHTML;
                                        var formDiv= document.getElementById('headconfig_editLogisticsWayFormDiv');
                                        laytpl(formTemplate).render(defaultObj, function(html){
                                            formDiv.innerHTML = html;
                                            form.render('select');
                                            form.render('checkbox');
                                            _this.saleHead(layero); //渲染新增销售头程弹框
                                            //初始化联动
                                            _this.relevantNew(layero);
                                            //监听物流属性选择
                                            var logisticsAttrArr = [];
                                            for(var i=0; i<attrArr.length; i++){
                                                var item =attrArr[i]['code'];
                                                form.on(`checkbox(${item})`,function(obj){
                                                    var dom = obj.elem;
                                                    if(dom.checked){
                                                        logisticsAttrArr.push(dom.title);
                                                    }else{
                                                        function isEque(element) {
                                                            return element == dom.title;
                                                        }
                                                        var xiabiao = logisticsAttrArr.findIndex(isEque);
                                                        logisticsAttrArr.splice(xiabiao, 1);
                                                    }
                                                    layero.find('[name=logisticsAttributeList]').val(logisticsAttrArr.join())
                                                });
                                            };
                                            form.on('submit(headconfig_editLogisticsWayForm_submit)', function(data){
                                                var data = data.field; //获取到表单提交对象
                                                newAddFormData = data;
                                                return false;
                                            });
                                            form.on('select(headconfig_throwingWeightStatus_filter)', function(data){
                                                var val = data.value;
                                                if(val == 'true'){
                                                    layero.find('.logisticsModeStatus_show').removeClass('disN');
                                                }else{
                                                    layero.find('.logisticsModeStatus_show').addClass('disN');
                                                }
                                            });
                                        });
                                    })
                                }
                            });   
                        },
                        yes: function(index,layero){
                            layero.find('[lay-filter=headconfig_editLogisticsWayForm_submit]').trigger('click');
                            var params = [];
                            var autoFormItems = layero.find('.logisticsModeAuto');//获取配置参数的表单数据
                            //获取选中的select海外仓文本
                            var selTxt = layero.find('[name=headconfig_logisticsCompany] option:selected').text();
                            var selId = layero.find('[name=headconfig_logisticsCompany]').val();
                            for(var i=0; i<autoFormItems.length; i++){
                                var item = autoFormItems[i];
                                var lab =  $(item).find('label');
                                var span = $(item).find('span');
                                var labTxt = lab.text();
                                var labName = lab.data('label');
                                var formDataObj;
                                if(labName == 'winit_orderType' || labName == 'winit_winitProductCode' || 
                                labName == 'winit_inspectionWarehouseCode' || labName == 'winit_importerCode'){
                                    formDataObj = {
                                        'fieldName': $(item).find('select').data('name'),
                                        'fieldDesc': labTxt,
                                        'fieldValue': $(item).find('select').val(),
                                        'remark': $.trim(span.text())
                                    }
                                }else{
                                    var singInp = $(item).find('input');
                                    formDataObj = {
                                        'fieldName': singInp.data('name'),
                                        'fieldDesc': lab.text(),
                                        'fieldValue': singInp.val(),
                                        'remark': $.trim(span.text())
                                    }
                                }
                                params.push(formDataObj);
                            }
                            newAddFormData.params = params;
                            newAddFormData.logisticsCompanyId = selId;
                            newAddFormData.status = true;
                            if(!newAddFormData.logisticsAttributeList|| !newAddFormData.name){
                                layer.msg('物流属性和name都是必填项!');
                               return false;
                            };
                            if(newAddFormData.throwingWeightStatus == 'true'){
                                if(!newAddFormData.throwingWeightType){
                                    layer.msg("请选择抛重计算方式")
                                    return false ;
                                }
                                if(!newAddFormData.throwingWeightParam){
                                    layer.msg("请选择抛重参数")
                                    return false;
                                }
                            }else{
                                newAddFormData.throwingWeightType = '';
                                newAddFormData.throwingWeightParam = '';
                            }
                            _this.addAjax(newAddFormData).then(function(result){
                                layer.msg('保存数据成功',{icon:1});
                                layer.close(index);
                                _this.trigClick();
                            }).catch(function(err){
                                layer.msg("保存数据失败!", {icon: 5});
                            });
                        }
                    });
                });
            },
            //表格渲染
            tableRender: function(data){ //设置表格渲染
                var _this = this;
                table.render({
                    elem: '#headconfig_table',
                    method: 'post',
                    url: '/lms/type/list/specialType',
                    where:  data,
                    cols: [
                        [ //表头
                            {title: '排序', field: 'orderNo', templet: '#headconfig_sort', width: '5%'}
                            ,{title: '物流方式',templet: '#headconfig_nameAndshopElfTypeName', width: '21%'}
                            ,{title: '销售头程', field: 'saleLogisticsType',width: 75}
                            ,{title: '服务代码', templet: '#headconfig_tableCode', width: '21%'}
                            ,{title: '折扣率', field: 'discountRate', width: '6%'}
                            ,{title: '上限重量(g)', field: 'packageMaxWeight',width: '6%' }
                            ,{title: '支持物流属性', field: 'logisticsAttributeList', width: '6%'}
                            ,{title: '状态',templet: '#headconfig_tableStatus', width: '5%'}
                            ,{title: '默认', templet: '<div>{{d.ifSaleLogisticsTypeDefault? "是": "否"}}</div>',width:60}
                            ,{title: '备注',field: 'remark', templet: '#headconfig_remark'}
                            ,{title: '操作', align:'center', toolbar: '#headconfig_tableIdBar', width: '5%'}
                        ]
                    ],
                    page: true,
                    id: "headconfig_tableId",
                    limits: [50, 100, 300],
                    limit: 50,
                    done: function(res){                  
                        //工具条监听事件
                        _this.watchBar();
                        //监听switch变化
                        if (res && res.data && res.data.length > 0) {
                            for(var i=0;i<res.data.length;i++){
                                delete res.data[i].createTime;
                                delete res.data[i].updateTime;
                                _this.watchSwitch(res.data[i]);
                                // _this.watchButton(res.data[i]);
                            }; 
                        }  
                    }
                });
            },
            sort: function(){
                var _this =this;
                $('body').on('keyup', '.headconfig_sort', function(e){
                    if(e.keyCode ==13){
                        var newSeq = e.target.value;
                        var oldSeq =$(this).next().val();
                        var id = $(this).next().attr('data-id');
                        if(!newSeq){
                            return layer.msg('新的序号不能为空!',{icon:7});
                        }
                        _this.sortAjax(id,oldSeq,newSeq).then(function(result){
                            layer.msg(result || '新序号排列成功',{icon:1});
                            headconfigName.trigClick();
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }
                });
            },
            //监听工具条
            watchBar: function(){
                var _this = this;
                table.on('tool(headconfig_tableFilter)',function(obj){
                    var data = obj.data;
                    var logisTypeId = data.id; //物流方式的id
                    var logisTypeName = data.name; //物流方式名称
                    if (obj.event == 'edit'){ //编辑弹框
                        _this.editWayLayer(data);
                    }else if(obj.event == 'billing'){//物流费用
                        var index = layer.open({
                            type: 1,
                            title: '区域计费信息',
                            area: ['1100px', '800px'],
                            btn: ['保存', '关闭'],
                            content: $('#headconfig_regionalPrice').html(),
                            success: function(layero,index){
                                upload.render({
                                    elem: '#headconfig_areaZipCodeRelationTempImport' //绑定元素
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
                                _this.regionalPriceTableRender({countryAbbr: ''}, logisTypeId);
                                $('#headconfig_regionalPriceTableSearch').on('click', function(){
                                    var val = $('#headconfig_regionalPriceInput').val();
                                    _this.regionalPriceTableRender({countryAbbr: val}, logisTypeId);
                                });
                                $('#headconfig_regionalPriceTableEmpty').on('click',function(){
                                    $('#headconfig_regionalPriceInput').val('');
                                });
                                //添加功能
                                _this.addDHLClick(logisTypeId);
                            }
                        })
                    }else if(obj.event == 'remark'){
                        layer.open({
                            type: 1,
                            title: '编辑备注',
                            area: ['600px', '600px'],
                            btn: ['保存', '关闭'],
                            content: $('#headconfig_remarkLayer').html(),
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
                    }else if(obj.event == 'copy'){//复制新增
                        _this.copyWayLayer(data);
                    }
                });
            },
            addDHLClick: function(id){//点击弹框事件
                var _this = this;
                var regionalPriceAddData;
                $('#headconfig_addNewDHLPrice').on('click',function(){
                    var index = layer.open({
                        type: 1,
                        title: '新增区域计费',
                        btn: ['保存', '关闭'],
                        area: ['800px', '600px'],
                        content: $('#headconfig_regionalPriceEdit').html(),
                        success: function(layero, index){
                           _this.addDHLData(id);
                           form.on('submit(headconfig_regionalPriceEditForm_submit)', function(data){
                                var data = data.field; //获取到表单提交对象
                                regionalPriceAddData = data;
                                return false;
                           })
                        },
                        yes: function(index,layero){
                          layero.find('[lay-filter=headconfig_regionalPriceEditForm_submit]').trigger('click');
                          var areaCountry = regionalPriceAddData.city;
                          delete regionalPriceAddData.city;
                          regionalPriceAddData.areaCountry = areaCountry;
                          regionalPriceAddData.logisTypeId = id;
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
                                      _this.regionalPriceTableRender({countryAbbr: ''}, id);
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
                this.country().then(function(result){
                    addData.countryArr = result;
                    addData.logisTypeId = id;
                    var formTemplate = headconfig_regionalPriceEditFormTpl.innerHTML;
                    var formDiv= document.getElementById('headconfig_regionalPriceEditForm');
                    laytpl(formTemplate).render(addData, function(html){
                        formDiv.innerHTML = html;
                        form.render('select');
                        formSelects.render();
                    });
                })
            },
            //渲染物流费用弹框
            regionalPriceTableRender: function(data,id){
                var _this = this;
                table.render({
                    elem: '#headconfig_regionalPriceTable',
                    method: 'post',
                    url: '/lms/type/area/charging?logiticsTypeId='+id,
                    where: data,
                    cols: [
                        [ //表头
                             {type: 'checkbox'}
                            ,{title: '国家/地区',field: 'chName'}
                            ,{title: '首重(g)',field: 'firstWeight'}
                            ,{title: '首费(￥)', field: 'firstCost'}
                            ,{title: '续重(g)',field: 'addedWeight'}
                            ,{title: '续费(￥)', field: 'addedCost'}
                            ,{title: '操作费(不参与折扣)', field: 'operationCost'}
                            ,{title: '上限重量(g)', field: 'maxWeight'}
                            // ,{title: '材积系数', field: 'materialCoefficient'}
                            ,{title: '区域', field: 'area'}
                            ,{title: '操作', align:'center', toolbar: '#headconfig_regionalPriceTableBar'}
                       ]
                    ],
                    page: true,
                    id: "headconfig_regionalPriceTable_tableId",
                    limits: [100, 300],
                    limit: 100,
                    done: function(){
                        //工具条监听事件
                        _this.regionalPriceWatchBar(id);
                        //批量删除
                        _this.batchDel(id);
                        _this.areaZipMapping(id);
                        _this.areaCityMapping(id);
    
                    }
                });
            },
            regionalPriceWatchBar: function(id){
                var _this= this;
                var regionalPriceData;
                table.on('tool(headconfig_regionalPriceTableFilter)',function(obj){
                    var data = obj.data;
                    if(obj.event == 'edit'){
                        var index = layer.open({
                            type: 1,
                            title: '设置区域计费',
                            btn: ['保存', '关闭'],
                            area: ['800px', '600px'],
                            content: $('#headconfig_regionalPriceEdit').html(),
                            success: function(layero, index){
                                _this.country().then(function(result){
                                    data.countryArr = result;
                                    var formTemplate = headconfig_regionalPriceEditFormTpl.innerHTML;
                                    var formDiv= document.getElementById('headconfig_regionalPriceEditForm');
                                    laytpl(formTemplate).render(data, function(html){
                                        formDiv.innerHTML = html;
                                        form.render('select');
                                        // formSelects.render();
                                    });
                                    form.on('submit(headconfig_regionalPriceEditForm_submit)', function(data){
                                        var data = data.field; //获取到表单提交对象
                                        regionalPriceData = data;
                                        return false;
                                    })
                                })
                            },
                            yes: function(index, layero){
                                layero.find('[lay-filter=headconfig_regionalPriceEditForm_submit]').trigger('click');
                                var areaCountry = regionalPriceData.city;
                                delete regionalPriceData.city;
                                regionalPriceData.areaCountry = areaCountry;
                                regionalPriceData.logisTypeId = data.logisTypeId;
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
                                            _this.regionalPriceTableRender({countryAbbr: ''}, regionalPriceData.logisTypeId);
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
                                        _this.regionalPriceTableRender({countryAbbr: ''}, id);
                                    }
                                }
                            });
                            
                        });
                        
                    }
                })
            },
            batchDel: function(id){ //批量删除
                var _this= this;
                $('#headconfig_batchDHLPrice').on('click', function(){
                    var checkStatus = table.checkStatus('headconfig_regionalPriceTable_tableId'),
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
                                    _this.regionalPriceTableRender({countryAbbr: ''}, id);
                                }
                            }
                        });
    
                    })
                })
            },
            areaZipMapping: function(){
                var _this = this;
                $('#headconfig_areaDHLPriceCodeMapping').on('click',function(){
                    var checkedArr= table.checkStatus('headconfig_regionalPriceTable_tableId').data;
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
                                        content: $('#headconfig_areaDHLPriceCodeMappingLayer').html(),
                                        id: 'headconfig_areaDHLPriceCodeMappingLayerId',
                                        success: function(layero, index){
                                            var data = res.data;
                                            var $tbody = layero.find("#headconfig_CodeMappingTable_tbody");
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
                                            layero.find('#headconfig_CodeMappingTable_tbody_add').on('click', function(){
                                                var grt = layero.find('[name=zipCodeGreatThanAndEqual]').val();
                                                var lt = layero.find('[name=zipCodeLessThan]').val();
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
                                                layero.find('[name=zipCodeGreatThanAndEqual]').val('');
                                                layero.find('[name=zipCodeLessThan]').val('');
                                            })
                                        },
                                        yes: function(index, layero){
                                            var putObj = {};
                                            var data = checkedArr[0];
                                            putObj.area = data.area;
                                            putObj.countryCode = data.areaCountry;
                                            putObj.typeId = data.logisTypeId;
                                            var $trs = layero.find('#headconfig_CodeMappingTable_tbody').find('tr');
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
                $('#headconfig_areaCityCodeMapping').on('click',function(){
                    var checkedArr= table.checkStatus('headconfig_regionalPriceTable_tableId').data;
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
                                        content: $('#headconfig_areaCityCodeMappingLayer').html(),
                                        id: 'headconfig_areaDHLPriceCodeMappingLayerId',
                                        success: function(layero, index){
                                            var data = res.data;
                                            var $tbody = layero.find("#headconfig_areaCityCodeMappingTable_tbody");
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
                                            layero.find('#headconfig_areaCityCodeMappingTable_tbody_add').on('click', function(){
                                                var province = layero.find('[name=logisticsProvince]').val();
                                                var city = layero.find('[name=logisticsCity]').val();
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
                                                layero.find('[name=logisticsProvince]').val('');
                                                layero.find('[name=logisticsCity]').val('');
                                            })
                                        },
                                        yes: function(index, layero){
                                            var putObj = {};
                                            var data = checkedArr[0];
                                            putObj.area = data.area;
                                            putObj.countryCode = data.areaCountry;
                                            putObj.typeId = data.logisTypeId;
                                            var $trs = layero.find('#headconfig_areaCityCodeMappingTable_tbody').find('tr');
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
            //编辑物流方式弹框
            editWayLayer: function(data){
                var _this = this;
                var attrArr = JSON.parse(sessionStorage.getItem('LOGISTICSATTR'));//物流属性
                var agentArr = JSON.parse(sessionStorage.getItem('AGENTCOMPANY'));//货代公司
                var editFormData;
                layer.open({ 
                    type: 1,
                    title: '编辑物流方式',
                    area: ['1100px', '100%'],
                    btn: ['保存', '关闭'],
                    content: $('#headconfig_editLogisticsWay').html(),
                    success: function(layero, index){
                        //渲染弹框
                        var copyData = data;
                        _this.companyLayerRender(layero, data.logisticsCompanyId);
                        var selTxt = layero.find('[name=headconfig_logisticsCompany] option:selected').text();
                        Promise.all([_this.getOutConfig(data.logisticsCompanyId),_this.getAllSaleHead()]).then(function(result){
                            copyData.params = JSON.parse(data.params);
                            copyData.attrArr = attrArr; //设置物流属性
                            copyData.agentArr = agentArr; //设置货代公司
                            copyData.saleLogisticsTypes = result[1];
                            var formTemplate = headconfig_editLogisticsWayFormTemplate.innerHTML;
                            var formDiv= document.getElementById('headconfig_editLogisticsWayFormDiv');
                            laytpl(formTemplate).render(copyData, function(html){
                                formDiv.innerHTML = html;
                                layero.find('[name=headconfig_logisticsCompany]').attr('disabled','disabled');
                                form.render('select');
                                form.render('checkbox');
                                _this.saleHead(layero); //渲染新增销售头程弹框
                                //初始化联动
                                _this.relevant(layero);
                                //监听物流属性选择
                                var logisticsAttrArr = [];
                                for(var i=0; i<attrArr.length; i++){
                                    var item =attrArr[i]['code'];
                                    form.on(`checkbox(${item})`,function(obj){
                                        var dom = obj.elem;
                                        if(dom.checked){
                                            logisticsAttrArr.push(dom.title);
                                        }else{
                                            function isEque(element) {
                                                return element == dom.title;
                                            }
                                            var xiabiao = logisticsAttrArr.findIndex(isEque);
                                            logisticsAttrArr.splice(xiabiao, 1);
                                        }
                                        layero.find('[name=logisticsAttributeList]').val(logisticsAttrArr.join())
                                    });
                                };
                                //默认选中
                                var selNameData = data.logisticsAttributeList.split(',');
                                for(var j=0; j<selNameData.length; j++){
                                    var name = selNameData[j];
                                    layero.find(`[title="${name}"]`).next().click();
                                }
                                //获取到表单提交对象
                                form.on('submit(headconfig_editLogisticsWayForm_submit)', function(FormData){
                                    editFormData = FormData.field;
                                    return false;
                                });
                                //是否计算抛重
                                form.on('select(headconfig_throwingWeightStatus_filter)', function(selectData){
                                    var val = selectData.value;
                                    if(val == 'true'){
                                        layero.find('.logisticsModeStatus_show').removeClass('disN');
                                    }else{
                                        layero.find('.logisticsModeStatus_show').addClass('disN');
                                    }
                                });
                            });
                        });
                    },
                    yes: function(index,layero){
                        layero.find('[lay-filter=headconfig_editLogisticsWayForm_submit]').trigger('click');
                        var dataCopy = data;
                        var params = [];
                        var autoFormItems = layero.find('.logisticsModeAuto');//获取配置参数的表单数据
                        //获取选中的select海外仓文本
                        for(var i=0; i<autoFormItems.length; i++){
                            var item = autoFormItems[i];
                            var lab =  $(item).find('label');
                            var span = $(item).find('span');
                            var labTxt = lab.text();
                            var labName = lab.data('label');
                            var formDataObj;
                            if(labName == 'winit_orderType' || labName == 'winit_winitProductCode' || 
                            labName == 'winit_inspectionWarehouseCode' || labName == 'winit_importerCode'){
                                formDataObj = {
                                    'fieldName': $(item).find('select').data('name'),
                                    'fieldDesc': labTxt,
                                    'fieldValue': $(item).find('select').val(),
                                    'remark': $.trim(span.text())
                                }
                            }else{
                                var singInp = $(item).find('input');
                                formDataObj = {
                                    'fieldName': singInp.data('name'),
                                    'fieldDesc': lab.text(),
                                    'fieldValue': singInp.val(),
                                    'remark': $.trim(span.text())
                                }
                            }
                            params.push(formDataObj);
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
                                layer.msg("请选择抛/实重比例≥")
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
                        var id = data.id;
                        _this.detailSaveAjax(id, dataCopy).then(function(result){
                            layer.msg('编辑详情修改成功');
                            layer.close(index);
                            headconfigName.trigClick();
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        });
                    }
                });
            },
            //复制新增物流方式弹框
            copyWayLayer: function(data){
                var _this = this;
                var attrArr = JSON.parse(sessionStorage.getItem('LOGISTICSATTR'));//物流属性
                var agentArr = JSON.parse(sessionStorage.getItem('AGENTCOMPANY'));//货代公司
                var editFormData;
                layer.open({ 
                    type: 1,
                    title: '复制物流方式',
                    area: ['1100px', '100%'],
                    btn: ['保存', '关闭'],
                    content: $('#headconfig_editLogisticsWay').html(),
                    success: function(layero, index){
                        //渲染弹框
                        var copyData = data;
                        _this.companyLayerRender(layero, data.logisticsCompanyId);
                        var selTxt = layero.find('[name=headconfig_logisticsCompany] option:selected').text();
                        Promise.all([_this.getOutConfig(data.logisticsCompanyId),_this.getAllSaleHead()]).then(function(result){
                            copyData.params = JSON.parse(data.params);
                            copyData.attrArr = attrArr; //设置物流属性
                            copyData.agentArr = agentArr; //设置货代公司
                            copyData.saleLogisticsTypes = result[1];
                            var formTemplate = headconfig_editLogisticsWayFormTemplate.innerHTML;
                            var formDiv= document.getElementById('headconfig_editLogisticsWayFormDiv');
                            laytpl(formTemplate).render(copyData, function(html){
                                formDiv.innerHTML = html;
                                layero.find('[name=headconfig_logisticsCompany]').attr('disabled','disabled');
                                form.render('select');
                                form.render('checkbox');
                                _this.saleHead(layero); //渲染新增销售头程弹框
                                //初始化联动
                                _this.relevant(layero);
                                //监听物流属性选择
                                var logisticsAttrArr = [];
                                for(var i=0; i<attrArr.length; i++){
                                    var item =attrArr[i]['code'];
                                    form.on(`checkbox(${item})`,function(obj){
                                        var dom = obj.elem;
                                        if(dom.checked){
                                            logisticsAttrArr.push(dom.title);
                                        }else{
                                            function isEque(element) {
                                                return element == dom.title;
                                            }
                                            var xiabiao = logisticsAttrArr.findIndex(isEque);
                                            logisticsAttrArr.splice(xiabiao, 1);
                                        }
                                        layero.find('[name=logisticsAttributeList]').val(logisticsAttrArr.join())
                                    });
                                };
                                //默认选中
                                var selNameData = data.logisticsAttributeList.split(',');
                                for(var j=0; j<selNameData.length; j++){
                                    var name = selNameData[j];
                                    layero.find(`[title="${name}"]`).next().click();
                                }
                                //获取到表单提交对象
                                form.on('submit(headconfig_editLogisticsWayForm_submit)', function(FormData){
                                    editFormData = FormData.field;
                                    return false;
                                });
                                //是否计算抛重
                                form.on('select(headconfig_throwingWeightStatus_filter)', function(selectData){
                                    var val = selectData.value;
                                    if(val == 'true'){
                                        layero.find('.logisticsModeStatus_show').removeClass('disN');
                                    }else{
                                        layero.find('.logisticsModeStatus_show').addClass('disN');
                                    }
                                });
                            });
                        });
                    },
                    yes: function(index,layero){
                        layero.find('[lay-filter=headconfig_editLogisticsWayForm_submit]').trigger('click');
                        var dataCopy = data;
                        var params = [];
                        var autoFormItems = layero.find('.logisticsModeAuto');//获取配置参数的表单数据
                        //获取选中的select海外仓文本
                        for(var i=0; i<autoFormItems.length; i++){
                            var item = autoFormItems[i];
                            var lab =  $(item).find('label');
                            var span = $(item).find('span');
                            var labTxt = lab.text();
                            var labName = lab.data('label');
                            var formDataObj;
                            if(labName == 'winit_orderType' || labName == 'winit_winitProductCode' || 
                            labName == 'winit_inspectionWarehouseCode' || labName == 'winit_importerCode'){
                                formDataObj = {
                                    'fieldName': $(item).find('select').data('name'),
                                    'fieldDesc': labTxt,
                                    'fieldValue': $(item).find('select').val(),
                                    'remark': $.trim(span.text())
                                }
                            }else{
                                var singInp = $(item).find('input');
                                formDataObj = {
                                    'fieldName': singInp.data('name'),
                                    'fieldDesc': lab.text(),
                                    'fieldValue': singInp.val(),
                                    'remark': $.trim(span.text())
                                }
                            }
                            params.push(formDataObj);
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
                        }else{
                            dataCopy.throwingWeightType = '';
                            dataCopy.throwingWeightParam = '';
                        }
                        delete dataCopy.id;
                        _this.addAjax(dataCopy).then(function(result){
                            layer.msg('编辑详情修改成功');
                            layer.close(index);
                            headconfigName.trigClick();
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        });
                    }
                });
            },
            //[新增]订单类型,万邑通产品编码,验货仓编码联动
            relevantNew: function(layero){
                var _this = this;
                //订单类型的值
                var orderTypeVal = layero.find('select[data-name=winit_orderType]').val();
                //根据订单类型渲染万邑通编码
                var orderTypeCache = orderTypeVal;
                this.renderWinitSelect(orderTypeCache,'productName');
                form.on('select(headconfig_winit_orderTypeFilter)', function(data){
                    let $val = data.value;
                    if($val != orderTypeCache){
                        _this.renderWinitSelect($val,'productName');
                        orderTypeCache = $val;
                        $('#headconfig_winit_inspectionWarehouseCode').html('');
                        form.render('select');
                    }
                });
                //万邑通编码渲染(参数加上订单类型)
                var winitProductCodeNameDom = layero.find('[data-name=winit_winitProductCodeName]');
                form.on('select(headconfig_winit_winitProductCodeFilter)', function(data){
                    let $val = data.value;
                    //给中文名称输入框赋值
                    let winitProductCodeName = $(data.elem).find('option:selected').text();
                    winitProductCodeNameDom.val(winitProductCodeName);
                    _this.renderInspectionWarehouseSelect(orderTypeCache, $val,'warehouseName');
                });
                //验货仓编码选择
                form.on('select(headconfig_winit_inspectionWarehouseCodeFilter)', function(data){
                    let inspectionWarehouseCodeName = $(data.elem).find('option:selected').text();
                    layero.find('[data-name=winit_inspectionWarehouseCodeName]').val(inspectionWarehouseCodeName);
                });
                //渲染进口商编码
                layero.on('input propertychange', 'input[data-name=countryCode]', function(e){
                    let $val = e.target.value;
                    _this.renderImporterCodeSelect($val, 'vendorName');
                })
                //进口商中文编码选择
                form.on('select(headconfig_winit_importerCodeFilter)', function(data){
                    let importerCodeName = $(data.elem).find('option:selected').text();
                    layero.find('[data-name=winit_importerCodeName]').val(importerCodeName);
                });
            },
            //[编辑]订单类型,万邑通产品编码,验货仓编码联动
            relevant: function(layero){
                var _this = this;
                //订单类型的值
                var orderTypeVal = layero.find('select[data-name=winit_orderType]').val();
                //万邑通产品编码的值
                var winitProductCodeVal = layero.find('select[data-name=winit_winitProductCode]').val() || 0;
                //验货仓编码
                var inspectionWarehouseCodeVal = layero.find('select[data-name=winit_inspectionWarehouseCode]').val() || 0;
                //目的国家的值
                var countryCodeVal = layero.find('input[data-name=countryCode]').val();
                //进口商编码
                var importerCodeVal = layero.find('select[data-name=winit_importerCode]').val() || 0;
                //根据订单类型渲染万邑通编码
                var orderTypeCache = orderTypeVal;
                form.on('select(headconfig_winit_orderTypeFilter)', function(data){
                    let $val = data.value;
                    if($val != orderTypeCache){
                        _this.renderWinitSelect($val,'productName');
                        orderTypeCache = $val;
                    }
                });
                //万邑通编码渲染验货仓编码(参数加上订单类型)
                this.renderWinitSelect(orderTypeCache,'productName',winitProductCodeVal);
                this.renderInspectionWarehouseSelect(orderTypeCache, winitProductCodeVal,'warehouseName',inspectionWarehouseCodeVal);
                var winitProductCodeNameDom = layero.find('[data-name=winit_winitProductCodeName]');
                form.on('select(headconfig_winit_winitProductCodeFilter)', function(data){
                    let $val = data.value;
                    //给中文名称输入框赋值
                    let winitProductCodeName = $(data.elem).find('option:selected').text();
                    winitProductCodeNameDom.val(winitProductCodeName);
                    _this.renderInspectionWarehouseSelect(orderTypeCache, $val,'warehouseName');
                });
                //验货仓编码选择
                form.on('select(headconfig_winit_inspectionWarehouseCodeFilter)', function(data){
                    let inspectionWarehouseCodeName = $(data.elem).find('option:selected').text();
                    layero.find('[data-name=winit_inspectionWarehouseCodeName]').val(inspectionWarehouseCodeName);
                });
                //进口商中文编码选择
                form.on('select(headconfig_winit_importerCodeFilter)', function(data){
                    let importerCodeName = $(data.elem).find('option:selected').text();
                    layero.find('[data-name=winit_importerCodeName]').val(importerCodeName);
                });
                //渲染进口商编码
                this.renderImporterCodeSelect(countryCodeVal, 'vendorName',importerCodeVal);
                layero.on('input propertychange', 'input[data-name=countryCode]', function(e){
                    let $val = e.target.value;
                    _this.renderImporterCodeSelect($val, 'vendorName');
                })
            },
            //渲染万邑通编码选择框
            renderWinitSelect: function(orderTypeVal, name, defaultVal){
                if(!defaultVal){
                    defaultVal = '';
                }
                this.getWytCodeAjax(orderTypeVal).then(function(result){
                    commonRenderSelect('headconfig_winit_winitProductCode', result, {
                        name: name,
                        code: 'productCode',
                        selected: defaultVal
                    });
                    form.render('select');
                });
            },
            //渲染验货仓编码[订单类型,万邑通编码]
            renderInspectionWarehouseSelect: function(orderType, winitProductCode, name, defaultVal){
                if(!defaultVal){
                    defaultVal = '';
                }
                if(!winitProductCode){
                    return layer.msg('请先选择万邑通编码',{icon: 5});
                }
                this.getWytCheckAjax(orderType, winitProductCode).then(function(result){

                    commonRenderSelect('headconfig_winit_inspectionWarehouseCode', result.warehouseList || [], {
                        name: name,
                        code: 'warehouseCode',
                        selected: defaultVal
                    });
                    form.render('select');
                });
            },
            //渲染进口商编码[目的国家]
            renderImporterCodeSelect: function(countryCode, name,defaultVal){
                if(!countryCode){
                    return layer.msg('请先输入国家/地区!',{icon: 5});
                }
                if(!defaultVal){
                    defaultVal = '';
                }
                this.getWytVendorAjax(countryCode).then(function(result){
                    if(typeof(result) == 'string'){
                        result = [];
                    }
                    commonRenderSelect('headconfig_winit_importerCode', result, {
                        name: name,
                        code: 'vendorCode',
                        selected: defaultVal
                    });
                    form.render('select');
                })
            },
            //监听状态切换
            watchSwitch: function(info){ // 监听开关的变化
                var id = info.id;
                var _this = this;
                var filterStatus = 'headconfig_tableStatus'+id;
                var filterAuto = 'headconfig_tableAuto'+id;
                form.on(`switch(${filterStatus})`, function(data){
                    info.status = data.elem.checked; //开关是否开启，true或者false
                    _this.switchStatusAjax(id, info)
                    .then(function(){
                        layer.msg('切换状态成功!',{icon:1});
                        headconfigName.trigClick();
                    })
                    .catch(function(err){
                        layer.msg(err, {icon:2})
                    })
                }); 
                form.on(`switch(${filterAuto})`, function(data){
                    info.autoApplyTrackNum = data.elem.checked; //开关是否开启，true或者false
                    _this.switchStatusAjax(id, info)
                    .then(function(){
                        layer.msg('切换状态成功!',{icon:1});
                        headconfigName.trigClick();
                    })
                    .catch(function(err){
                        layer.msg(err, {icon:2})
                    })
                }); 
            },
            //导入计费
            importCost: function(){
                upload.render({
                    elem: '#headconfig_importCost' //绑定元素
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
            //新增
            //ajax请求
            //国家数据请求
            country: function(){ //国家数据处理
                return new Promise(function(resolve, reject){
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
                                resolve(arr);
                            }else{
                                reject('获取国家/地区列表失败');
                            }
                        }
                    })
                })
            },
            //编辑详情保存请求
            detailSaveAjax: function(id, data){
                for(let key in data){
                    if(key == 'ifSaleLogisticsTypeDefault'&&data[key] == 1){
                        data[key] = true
                    }else if(key == 'ifSaleLogisticsTypeDefault'&&data[key] == 0){
                        data[key] = false
                    }
                }
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json;charset=UTF-8',
                    url: '/lms/type/update/'+id,
                    params: JSON.stringify(data)
                    // params: encodeURIComponent(JSON.stringify(data))
                })
            },
            addAjax: function(data){
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json;charset=UTF-8',
                    url: '/lms/type/add',
                    params: JSON.stringify(data)
                })
            },
            //物流方式排序
            sortAjax:function(id, oldSeq, newSeq){
                return commonReturnPromise({
                    url: `/lms/type/resort/${id}/${oldSeq}/${newSeq}`
                })
            },
            //万邑通配置
            configAjax: function(id){
                return commonReturnPromise({
                    url: '/lms/type/get/config/params/'+id
                })
            },
            //切换物流状态请求
            switchStatusAjax:function(id,data){
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json;charset=UTF-8',
                    url: '/lms/type/update/'+id,
                    params: JSON.stringify(data)
                })
            },
            //获取所有的属性请求
            getAllAttrAjax: function(){
                return commonReturnPromise({
                    url: '/lms/type/init'
                })
            },
            //获取所有的货代公司请求
            getAgentAjax: function(){
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/type/listByHeadCodeByAgent.html'
                });
            },
            //获取所有的海外仓请求
            getAllOutAjax: function(){
                return commonReturnPromise({
                    type: 'get',
                    url: '/lms/company/specialType',
                    params: {
                        specialType: '海外仓头程'
                    }
                })
            },
            //获取万邑通产品编码(订单类型编码获取)
            getWytCodeAjax: function(productType){
                return commonReturnPromise({
                    url: '/lms/type/winit/getWinitProducts.html',
                    params: {
                    productType: productType  
                    }
                })
            },
            //获取万邑通验货仓编码(订单类型和万邑通产品编码同时获取)
            getWytCheckAjax: function(orderType,winitProductCode){
                return commonReturnPromise({
                    url: '/lms/type/winit/getWarehouseList.html',
                    params: {
                        orderType: orderType,
                        winitProductCode: winitProductCode
                    }
                })
            },
            //获取万邑通进口商编码(根据输入的国家code获取)
            getWytVendorAjax:function(countryCode){
                return commonReturnPromise({
                    url: '/lms/type/winit/getVendorInfo.html',
                    params: {
                        countryCode: countryCode
                    },
                    isLoading: false
                })
            },
            //根据选择的海外仓获取仓库配置
            getOutConfig: function(warehouseId){
                return commonReturnPromise({
                    url: '/lms/type/get/config/params/'+warehouseId
                })
            },
            //获取所有的销售头程
            getAllSaleHead: function(){
                return commonReturnPromise({
                    url: '/lms/winit/sale/type/query.html'
                });
            },
            //保存所有的销售头程
            saveAllSaleHead: function(saleLogisticsNameStr){
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/winit/sale/type/save.html',
                    contentType: 'application/x-www-form-urlencoded',
                    params: {
                        saleLogisticsNameStr:saleLogisticsNameStr
                    }
                })
            }
        };
        //物流方式搜索的表单提交事件
        form.on('submit(headconfig_submit)', function(data){
            var data = data.field; //获取到表单提交对象
            data.specialType = '海外仓头程';
            headconfigName.tableRender(data);
        });
        //默认搜索
        headconfigName.trigClick();
        //导入计费
        headconfigName.importCost();
        //新增
        headconfigName.newAdd();
        //排序
        headconfigName.sort();
        //把海外仓数据,物流属性,货代公司缓存到session里面
        if(!sessionStorage.getItem('OUTWAREHOURSE')){
            headconfigName.getAllOutAjax().then(function(result){
                sessionStorage.setItem("OUTWAREHOURSE",JSON.stringify(result || []));
                headconfigName.companyRender();
            }).catch(function(){
                layer.msg('获取海外仓数据失败!',{icon:2});
            });
        }else{
            headconfigName.companyRender();
        }
        //缓存货代公司
        if(!sessionStorage.getItem('AGENTCOMPANY')){
            headconfigName.getAgentAjax().then(function(result){
                sessionStorage.setItem("AGENTCOMPANY",JSON.stringify(result || []));
            }).catch(function(){
                layer.msg('获取货代数据失败!',{icon:2});
            }); 
        }
        //缓存物流属性
        if(!sessionStorage.getItem('LOGISTICSATTR')){
            headconfigName.getAllAttrAjax().then(function(result){
                sessionStorage.setItem("LOGISTICSATTR",JSON.stringify(result.logisticsTypeComboBox.logisticsAttributeList || []));
            }).catch(function(){
                layer.msg('获取物流属性数据失败!',{icon:2});
            });   
        }
    });
})();