layui.use(['admin','table','form','layer','formSelects','laytpl'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        form = layui.form;
    //发货地址的命名空间
    var shipAddress_logisiticsArr=[];
    var shipAddressName = {
        trigClick: function(){ //触发表单搜索事件
            form.render('select');
            $('[lay-filter=shipAddress_submit]').trigger('click');
        },
        newAdd: function(){ //添加新的发货地址
            var _this = this;
            $('#shipAddress_newAdd').on('click', function(){
                var addData;
                var index = layer.open({
                    type: 1,
                    title: '新增发货地址',
                    btn: ['保存', '关闭'],
                    area: ['1550px', '700px'],
                    content: $('#shipAddress_addAndEdit').html(),
                    success: function(layero, index){
                        var data = {
                            addressName: '', //地址名称
                            // deliveryMode: '', //交运方式
                            collectContactName: '', //揽收人
                            collectCompany: '', //公司名称
                            collectStreet: '', //街道地址
                            collectPostcode: '', //邮政编码
                            collectContactMobile: '', //手机号码
                            collectContactPhone: '', //固定电话
                            collectContactEmail: '', //电子邮件
                            senderContactName: '', // 寄件人
                            senderCompany: '', //寄件人公司
                            senderStreet: '', //寄件人街道
                            senderPostcode: '', //寄件人邮编
                            senderContactPhone: '', //寄件人固定电话
                            senderContactMobile: '', //寄件人移动电话
                            senderContactEmail: '', //寄件人邮箱
                            returnContactName: '', //退货联系人
                            returnCompany: '', //退货公司
                            returnStreet: '', //退货街道
                            returnPostcode: '', //退货邮编
                            returnContactMobile: '', //退货人手机号
                            returnContactPhone: '', //固定电话
                            returnContactEmail: '' //退货人邮箱
                        };
                        var formTemplate = shipAddress_addAndEditFormTpl.innerHTML;
                        var formDiv= document.getElementById('shipAddress_addAndEditForm');
                        laytpl(formTemplate).render(data, function(html){
                                formDiv.innerHTML = html;
                                //渲染揽收省市区
                                _this.getProvinceCityCode(layero, 'collectCountryCode','collectProvinceCode');//国家
                                _this.getProvinceCityCode(layero, 'collectProvinceCode','collectCityCode');//省
                                _this.getProvinceCityCode(layero, 'collectCityCode', 'collectCountyCode'); // 市
                                _this.getProvinceCityCode(layero, 'collectCountyCode'); // 县/区
                                //渲染寄件人省市区
                                _this.getProvinceCityCode(layero, 'senderCountryCode','senderProvinceCode');//国家
                                _this.getProvinceCityCode(layero, 'senderProvinceCode','senderCityCode');//省
                                _this.getProvinceCityCode(layero, 'senderCityCode', 'senderCountyCode'); // 市
                                _this.getProvinceCityCode(layero, 'senderCountyCode'); // 县/区

                                //渲染退货人省市区
                                _this.getProvinceCityCode(layero, 'returnCountryCode','returnProvinceCode');//国家
                                _this.getProvinceCityCode(layero, 'returnProvinceCode','returnCityCode');//省
                                _this.getProvinceCityCode(layero, 'returnCityCode', 'returnCountyCode'); // 市
                                _this.getProvinceCityCode(layero, 'returnCountyCode'); // 县/区

                                //表单元素初始化渲染
                                form.render('checkbox');
                                form.render('radio');
                                form.render('select');     
                        });
                        form.on('submit(shipAddress_addAndEditForm_submit)', function(data){
                            var data = data.field; //获取到表单提交对象
                            var isDefault = layero.find('input[name=isDefault]').is(':checked');
                            var addressType = layero.find('select[name=addressType]').val();
                            data.isDefault = isDefault;
                            data.addressType = addressType;
                            addData = data;
                            return false;
                        });
                        _this.copyVal(layero);
                    },
                    yes: function(index,layero){
                        $('[lay-filter=shipAddress_addAndEditForm_submit]').trigger('click');
                        for(var key in addData){
                            if(key != 'isDefault'){
                                // if(addData[key] == ''){
                                //     layer.msg('所有项必填,都不能为空!',{icon: 5});
                                //     return false;
                                // }
                            }
                        }
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/lms/address/saveOrUpdate.html',
                            data: JSON.stringify(addData),
                            contentType: 'application/json;charset=UTF-8',
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code == '0000'){
                                    layer.msg(res.msg);
                                    _this.trigClick();
                                    layer.close(index);
                                }else{
                                    layer.msg(res.msg);
                                };
                            },
                            error: function(){
                                loading.hide();
                                layer.msg("服务器有问题,和页面无关哦!");
                            }
                        })
                    }
                })
            });
        },
        tableRender: function(data){  // 表格渲染
            var _this = this;
            table.render({
                elem: '#shipAddress_table',
                method: 'post',
                url: '/lms/address/queryByAddressName.html',
                where:  data,
                cols: [
                    [ //表头
                        {title: '地址名称',field: 'addressName'}
                        // ,{title: '交运方式', field: 'deliveryMode'}
                        // ,{title: '交运方式', templet: '#shipAddress_deliveryMode'}
                        ,{title: '揽收人信息',templet: '#shipAddress_collect'}
                        ,{title: '寄件人信息',templet: '#shipAddress_sender'}
                        // ,{title: '揽收人信息',field: 'collectCity'}
                        // ,{title: '寄件人信息',field: 'senderCountry'}
                        ,{title: '默认',templet: '#shipAddress_default', width: 50}
                        ,{title: '地址类型',templet: '#shipAddress_type',width:100}
                        ,{title: '物流方式',templet: '#shipAddress_logisticsway'}
                        ,{title: '退货地址',templet: '#shipAddress_return', align: 'left'}
                        ,{title: '操作', align:'center', toolbar: '#shipAddress_tableIdBar', width: 177}
                   ]
                ],
                page: true,
                id: "shipAddress_tableId",
                limits: [50, 100, 300],
                limit: 50,
                done: function(){
                    _this.watchBar();
                    
                }
            })
        },
        watchBar: function(){ // 监听表格的工具条
            var _this = this;
            var logisticsData;
            table.on('tool(shipAddress_tableFilter)',function(obj){
                var data = obj.data;
                var id = data.id;
                if(obj.event == 'edit'){
                   _this.edit(data);
                }else if(obj.event=="match"){
                   var index= layer.open({
                        type: 1,
                        title: '匹配物流方式',
                        area: ['800px', '800px'],
                        btn: ['保存', '关闭'],
                        content: $('#shipAddress_match').html(),
                        success: function(layero, index){
                            data.logisticsArr = shipAddress_logisiticsArr;
                            var formTemplate = shipAddress_matchFormTpl.innerHTML;
                            var formDiv= document.getElementById('shipAddress_matchForm');
                            laytpl(formTemplate).render(data, function(html){
                                formDiv.innerHTML = html;
                                form.render('select');
                                formSelects.render();
                            });
                            //物流方式搜索
                            form.on('submit(shipAddress__matchForm_submit)', function(data){
                                var data = data.field; //获取到表单提交对象
                                logisticsData = data;
                                return false;
                            });
                        },
                        yes: function(index, layero){
                            $('[lay-filter=shipAddress__matchForm_submit]').trigger('click');
                            // console.log(logisticsData);
                            var logisticsIdList; //参数2
                            if(logisticsData.logisticsTypeIdList != ''){
                              logisticsIdList = logisticsData.logisticsTypeIdList.split(',');
                            }else{
                              logisticsIdList = [];
                            };
                            $.ajax({
                                type: 'post',
                                url: '/lms/address/updateTypeAddressId.html',
                                dataType: 'json',
                                contentType: 'application/json;charset=UTF-8',
                                data: JSON.stringify({'addressId': id, 'logisticsIdList': logisticsIdList}),
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        layer.msg("设置成功！");
                                        layer.close(index);
                                        _this.trigClick();
                                    }else{
                                        layer.msg(res.msg);
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器报错!');
                                }
                            })
                        }
                   })
                }else if(obj.event == 'del'){
                    layer.confirm('确定删除？', function(index){
                        $.ajax({
                            type: 'get',
                            dataType: 'json',
                            url: '/lms/address/delete.html?addressId='+id,
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code == '0000'){
                                    layer.msg(res.msg);
                                    _this.trigClick();
                                }else {
                                    layer.msg(res.msg);
                                }
                            },
                            error: function(){
                                loading.hide();
                                layer.msg('服务器有问题,前端不背锅');
                            }
                        })
                    });
                }
            })
        },
        edit: function(data){ //发货地址编辑
            // console.log(data);
            var editData;
            var _this = this;
            var index = layer.open({
                type: 1,
                title: '编辑发货地址',
                area: ['1550px', '700px'],
                btn: ['保存', '关闭'],
                content: $('#shipAddress_addAndEdit').html(),
                success: function(layero, index){
                    var formTemplate = shipAddress_addAndEditFormTpl.innerHTML;
                    var formDiv= document.getElementById('shipAddress_addAndEditForm');
                    laytpl(formTemplate).render(data, function(html){
                        formDiv.innerHTML = html;
                        
                            var newPro = new Promise(function(resolve, reject){
                                //渲染揽收省市区
                                _this.getProvinceCityCode(layero, 'collectCountryCode','collectProvinceCode');//国家
                                _this.getProvinceCityCode(layero, 'collectProvinceCode','collectCityCode');//省
                                _this.getProvinceCityCode(layero, 'collectCityCode', 'collectCountyCode'); // 市
                                _this.getProvinceCityCode(layero, 'collectCountyCode'); // 县/区
                                //渲染寄件人省市区
                                _this.getProvinceCityCode(layero, 'senderCountryCode','senderProvinceCode');//国家
                                _this.getProvinceCityCode(layero, 'senderProvinceCode','senderCityCode');//省
                                _this.getProvinceCityCode(layero, 'senderCityCode', 'senderCountyCode'); // 市
                                _this.getProvinceCityCode(layero, 'senderCountyCode'); // 县/区
                                // //渲染退货人省市区
                                _this.getProvinceCityCode(layero, 'returnCountryCode','returnProvinceCode');//国家
                                _this.getProvinceCityCode(layero, 'returnProvinceCode','returnCityCode');//省
                                _this.getProvinceCityCode(layero, 'returnCityCode', 'returnCountyCode'); // 市
                                _this.getProvinceCityCode(layero, 'returnCountyCode'); // 县/区
                                resolve('promise run success!');
                            });
                            newPro.then(function(result){
                                data.senderCountry === 'US' ? data.senderCountryCode = 2 : data.senderCountryCode === ''
                                data.senderCountry === 'CN' || data.senderCountry === 'china' ? data.senderCountryCode = 1 : data.senderCountryCode === ''
                                data.returnCountry === '美国' ? data.returnCountryCode = 2 : data.returnCountryCode === ''
                                data.returnCountry === '中国' ? data.returnCountryCode = 1 : data.returnCountryCode === ''
                                data.collectCountry === '美国' ? data.collectCountryCode = 2 : data.collectCountryCode === ''
                                data.collectCountry === '中国' ? data.collectCountryCode = 1 : data.collectCountryCode === ''
                                //揽收
                                layero.find('[name=collectCountryCode]').next().find(`dd[lay-value=${data.collectCountryCode}]`).trigger('click');
                                layero.find('[name=collectProvinceCode]').next().find(`dd[lay-value=${data.collectProvinceCode}]`).trigger('click');
                                layero.find('[name=collectCityCode]').next().find(`dd[lay-value=${data.collectCityCode}]`).trigger('click');
                                layero.find('[name=collectCountyCode]').next().find(`dd[lay-value=${data.collectCountyCode}]`).trigger('click');
                                //寄件人
                                layero.find('[name=senderCountryCode]').next().find(`dd[lay-value=${data.senderCountryCode}]`).trigger('click');
                                layero.find('[name=senderProvinceCode]').next().find(`dd[lay-value=${data.senderProvinceCode}]`).trigger('click');
                                layero.find('[name=senderCityCode]').next().find(`dd[lay-value=${data.senderCityCode}]`).trigger('click');
                                layero.find('[name=senderCountyCode]').next().find(`dd[lay-value=${data.senderCountyCode}]`).trigger('click');
                                //退货
                                layero.find('[name=returnCountryCode]').next().find(`dd[lay-value=${data.returnCountryCode}]`).trigger('click');
                                layero.find('[name=returnProvinceCode]').next().find(`dd[lay-value=${data.returnProvinceCode}]`).trigger('click');
                                layero.find('[name=returnCityCode]').next().find(`dd[lay-value=${data.returnCityCode}]`).trigger('click');
                                layero.find('[name=returnCountyCode]').next().find(`dd[lay-value=${data.returnCountyCode}]`).trigger('click');
                                layero.find('[name=addressType]').next().find(`dd[lay-value=${data.addressType}]`).trigger('click');

                                $("#senderCountryCode").val(2)
                                $("#senderCountryCode option[text='US(美国)']").attr("selected", true);
                            });
                    });
                    form.on('submit(shipAddress_addAndEditForm_submit)', function(data){
                        var data = data.field; //获取到表单提交对象
                        var isDefault = layero.find('input[name=isDefault]').is(':checked');
                        var addressType = layero.find('select[name=addressType]').val();
                        data.isDefault = isDefault;
                        data.addressType = addressType;
                        editData = data;
                        return false;
                    });
                    _this.copyVal(layero);
                    //表单元素初始化渲染
                    form.render('checkbox');
                    form.render('radio');
                    form.render('select');  
                },
                yes: function(index,layero){
                   $('[lay-filter=shipAddress_addAndEditForm_submit]').trigger('click');
                    for(var key in editData){
                        if(key !='isDefault'){
                            // if(editData[key] == ''){
                            //     layer.msg('所有项必填,都不能为空!',{icon: 5});
                            //     return false;
                            // }
                        }
                    }
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: '/lms/address/saveOrUpdate.html',
                        data: JSON.stringify(editData),
                        contentType: 'application/json;charset=UTF-8',
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                layer.msg(res.msg);
                                _this.trigClick();
                                layer.close(index);
                            }else{
                                layer.msg(res.msg);
                            };
                        },
                        error: function(){
                            loading.hide();
                            layer.msg("服务器有问题,和页面无关哦!");
                        }
                    })
                }
            })
        },
        getProvinceCityCode: function(layero, name, name2){ //获取省市区
            var _this = this;
            var filter = name + 'Filter';
            var code = name.split('Code')[0];
            form.on(`select(${filter})`, function(data){
                //得到select原始DOM对象的内容
                layero.find(`[name=${code}]`).val($(data.elem).find('option:selected').text());
                if(name2){
                    layero.find(`select[name=${name2}]`).empty();
                    $.ajax({
                        type: 'get',
                        url: '/lms/address/queryCity.html?cityCode='+ data.value,
                        dataType: 'json',
                        async: false, //会影响loading
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                _this.cityRender(layero, res.data, name2);
                            }else{
                                layer.msg(res.msg);
                            }
                        },
                        error: function(){
                            loading.hide();
                            layer.msg('服务器有错误,和渲染无关哦');
                        }
                    })  
                }          
            }); 
        },
        cityRender: function(layero,arr, name){
            var str = '<option value="">请选择</option>';
            for (var i=0; i<arr.length; i++){
                var item = arr[i];
                if(name=="senderCountryCode" || name=="senderProvinceCode"|| name == 'senderCityCode' || name == 'senderCountyCode'){
                    str += `<option value="${item.cityCode}">${item.cityAlias}(${item.cityName})</option>`
                }else{
                    str += `<option value="${item.cityCode}">${item.cityName}</option>`
                }
            };
            if(name){
                layero.find(`select[name=${name}]`).append(str);
            }
            form.render('select');
        },
        logistics:function(){ //物流方式数据处理
            var _this = this;
            $.ajax({
                type: 'get',
                url: '/lms/type/list?limit=10000&specialType=直发物流',
                dataType: 'json',
                success: function(res){
                    if(res.code == '0000'){
                        var data = res.data;
                        var arr = [];
                        for(var i=0; i<data.length; i++){
                            var sgItem = data[i];
                            var obj = {
                                name: sgItem.name,
                                value: sgItem.id
                            };
                            arr.push(obj)
                        }
                        shipAddress_logisiticsArr = arr;
                    }else{
                        layer.msg('获取所有物流方式失败');
                    }
                }
            })
        },
        copyVal: function(layero){ //应用揽收信息
            $('#shipAddress_returnCopy').on('click', function(){
                //获取到揽收信息的val
                var contactName = layero.find('[name=collectContactName]').val();//联系人
                var company = layero.find('[name=collectCompany]').val(); //公司
                var countryCode = layero.find('[name=collectCountryCode]').val(); //国家代码
                var provinceCode = layero.find('[name=collectProvinceCode]').val(); //省份代码
                var cityCode = layero.find('[name=collectCityCode]').val(); //城市代码
                var countyCode = layero.find('[name=collectCountyCode]').val(); //区县代码
                var street = layero.find('[name=collectStreet]').val(); //街道地址
                var postcode = layero.find('[name=collectPostcode]').val(); //邮政编码
                var contactMobile = layero.find('[name=collectContactMobile]').val(); //手机
                var contactPhone = layero.find('[name=collectContactPhone]').val(); //固话
                var contactEmail = layero.find('[name=collectContactEmail]').val(); //邮箱
                //赋值给退货信息的val
                layero.find('[name=returnContactName]').val(contactName);//联系人
                layero.find('[name=returnCompany]').val(company);//公司
                layero.find('[name=returnStreet]').val(street);//街道
                layero.find('[name=returnPostcode]').val(postcode);//邮编
                layero.find('[name=returnContactMobile]').val(contactMobile);//手机
                layero.find('[name=returnContactPhone]').val(contactPhone);//固话
                layero.find('[name=returnContactEmail]').val(contactEmail);//邮箱
                /*省市区怎么赋值? */
                // console.log(countryCode, provinceCode, cityCode, countyCode);
                layero.find('[name=returnCountryCode]').next().find(`dd[lay-value=${countryCode}]`).click();
                // layero.find('[name=returnProvinceCode]').val(provinceCode);
                layero.find('[name=returnProvinceCode]').next().find(`dd[lay-value=${provinceCode}]`).click();
                // layero.find('[name=returnCityCode]').val(cityCode);
                layero.find('[name=returnCityCode]').next().find(`dd[lay-value=${cityCode}]`).click();
                // layero.find('[name=returnCountyCode]').val(countyCode);
                layero.find('[name=returnCountyCode]').next().find(`dd[lay-value=${countyCode}]`).click();
            });
        }
    };
    
    //新增发货地址
    shipAddressName.newAdd();
    shipAddressName.logistics();
    //物流方式搜索的表单提交事件
    form.on('submit(shipAddress_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        shipAddressName.tableRender(data);
        return false;
    });
    //默认触发表单搜索事件
    shipAddressName.trigClick();

    form.verify({
      empty: function(value, dom){
          var $dom = $(dom);
          if(value == ''){
            $dom.addClass('layui-form-danger');
            $dom.focus();
          }else{
            $dom.removeClass('layui-form-danger');
          }
      }  
    })
});