//模块引入 类似于 requirejs
layui.use(['admin','form','table','layer','laydate', 'laytpl'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate;
    form.render('select')

    var blacklistName = {
        //表单提交事件
        search: function(){
            var _this = this;
            form.on('submit(blacklist_submit)', function(obj){
                var data = obj.field;
                data.status = eval(data.status) == undefined ?  '' : eval(data.status);
                _this.tableRender(data);
            })
            return _this;
        },
        //地址规则选择条件数组
        conditionArr: function(){
            var data = [
                {key: 'country', value: '国家/地区'},
                {key: 'province', value: '州/省'},
                {key: 'city', value: '城市'},
                {key: 'addressOne', value: '收货地址1'},
                {key: 'addressTwo', value: '收货地址2'},
                {key: 'zip', value: '收货邮编'},
                {key: 'buyer', value: '收件人姓名'},
                {key: 'phone', value: '收件人电话'},
                {key: 'email', value: '付款邮箱'},
            ];
            return data;
        },
        //对应关系
        typeCode: function(){
            var obj = {
                "country": "country",
                "province": "shipping_state_or_province",
                "city":"shipping_city",
                "addressOne": "shipping_street1",
                "addressTwo": "shipping_street2",
                "zip": "shipping_zip",
                "buyer": "shipping_username",
                "phone": "shipping_phone_number",
                "email": "buyer_email"
            };
            return obj;
        },
        //新增data初始化
        newDataOriginal: function(){
          var _this = this;
          var obj = {
            ruleName: '',
            remark: '',
            status: true,
            conditionArr: _this.conditionArr(),
            detail: ''
          };
          return obj;
        },
        //新增黑名单地址
        newAddBlacklist: function(){
            var _this = this;
            var data = _this.newDataOriginal();
            $('#blacklist_newAdd').on('click', function(){
                layer.open({
                    type: 1,
                    title: '新增地址规则',
                    area: ['1100px', '700px'],
                    btn: ['保存', '关闭'],
                    content: $('#blacklist_newAddBlacklist').html(),
                    success: function(layero, index){
                        var getTpl = newAddBlackListContainerTpl.innerHTML,
                        view = document.getElementById('newAddBlackListContainer');
                        laytpl(getTpl).render(data, function(html){
                            view.innerHTML = html;
                            form.render();
                            _this.watchCks();
                        });
                    },
                    yes: function(index, layero){
                        _this.newDataYesHandle(layero).then(function(result){
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: '/lms/rule/blacklist/save',
                                contentType: 'application/json',
                                data: JSON.stringify(result),
                                beforeSend: function(){
                                    console.log(result)
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                      layer.msg(res.msg);
                                      layer.close(index);
                                      $('[lay-filter=blacklist_submit]').trigger('click'); //初始化
                                    }else{
                                      layer.msg(res.msg);
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器错误');
                                }    
                            });
                        });
                    }
                });
            });
            return this;
        },
        newDataYesHandle: function(layero){
            return new Promise(function(resolve,reject){
                //数据处理
                var obj = {};
                var inputId = layero.find('[name=id]');
                var priority = layero.find('[name=priority]');
                if(inputId){
                    obj.id = Number(inputId.val());
                }
                if(priority){
                    obj.priority = Number(priority.val());
                }
                var status = eval(layero.find('[name=status]').val());
                var ruleName = layero.find('[name=ruleName]').val();
                if(!ruleName){
                    return layer.msg('规则名称不能为空');
                }
                var remark = layero.find('[name=remark]').val();
                var $lis = $('#blacklistLeftChooseCondition').find('li');
                var detailObj = {};
                for(var i=0; i<$lis.length; i++){
                    var item = $lis[i];
                    var key =  $(item).attr('ztt-name'); //key值
                    var val = $(item).find(`[name=ztt-${key}-code]`).val()==''? '':JSON.parse($(item).find(`[name=ztt-${key}-code]`).val());
                    if(val){
                        detailObj[key] = val;
                    }
                }
                obj.ruleName = ruleName;
                obj.remark = remark;
                obj.detail = detailObj;
                obj.status = status;
                resolve(obj); 
            })
        },
        //条件选择点击
        watchCks: function(){
            var $ul = $('#blacklistLeftChooseCondition'); //container
            form.on('checkbox(blackListCondition)', function(obj){
                var title = obj.elem.title; //value值
                var checked = obj.elem.checked; //是否选中
                var key =obj.elem.name; //key值
                if(checked){
                    var str= `<li ztt-name="${key}">
                               <strong>${title}是:</strong>
                               <a href="javascript:;" class="ztt-a" ztt-key="${key}">${title}</a>
                               <input type="hidden" name="ztt-${key}-code" value="">
                             </li>`;
                     $ul.append(str);
                 }else{
                     $ul.find(`li[ztt-name=${key}]`).remove();
                 }
            });
            this.seletedClick();
        },
        //已选条件的点击编辑事件
        seletedClick: function(){
            var _this = this;
            $('#blacklistLeftChooseCondition').on('click', '.ztt-a', function(){
                var key = $(this).attr('ztt-key'); //获取到选中项的属性值
                switch (key) {
                    case 'country':
                        _this.frameHandle('国家/地区','country');
                        break;
                    case 'province':
                        _this.frameHandle('州/省', 'province');
                        break;
                    case 'city':
                        _this.frameHandle('城市', 'city');
                        break;
                    case 'addressOne':
                        _this.frameHandle('收货地址1', 'addressOne');
                        break;
                    case 'addressTwo':
                        _this.frameHandle('收货地址2', 'addressTwo');
                        break;
                    case 'buyer':
                        _this.frameHandle('收件人', 'buyer');
                        break;
                    case 'email':
                        _this.frameHandle('付款邮箱', 'email');
                        break;
                    case 'phone':
                        _this.frameHandle('收件人电话', 'phone');
                        break;
                    case 'zip':
                        _this.frameHandle('收货邮编','zip');
                        break;
                };
            });
        },
        //已选条件的弹框处理
        frameHandle: function(title,key){
            var _this = this;
            var typeCode = _this.typeCode();
            var successHandle = `${key}LayerSuccessHandle`;
            var id = `blacklist_${key}Edit`;
            var contId = `blacklist_${key}EditContainer`;
            var inputName = `blacklist_${key}`;
            layer.open({
                type: 1,
                title: title,
                area: key=='country'? ['500px', '500px']:['500px', '250px'],
                btn: ['保存', '关闭'],
                content: $('#'+id).html(),
                success: function(layero,index){
                    var defaultObj = $(`[name=ztt-${key}-code]`).val();
                    var defaultVal = '';
                    if(defaultObj){
                        if(key == 'country'){
                            defaultVal = (JSON.parse(defaultObj).shippingCountryCode)[0];
                        }else{
                            defaultVal = (JSON.parse(defaultObj).ruleValueList)[0];
                        }
                    }else{
                        defaultVal = '';
                    };
                    var obj = {default: defaultVal};
                    _this[successHandle](obj);
                },
                yes: function(index, layero){
                    if(key != 'country'){
                        $val = $('#'+contId).find(`[name=${inputName}]`).val();
                        $(`[ztt-key=${key}]`).html($val);
                        $(`[name=ztt-${key}-code]`).val(`{"exclude": false,"ruleValueList": ["${$val}"],"typeCode": "${typeCode[key]}"}`);
                    }else {
                        var $target = $('#'+contId).find(`[name=${inputName}]>option:selected`),
                            $val = $target.val(),
                            $text = $target.text();
                        $('[ztt-key=country]').html($text);
                        $('[name=ztt-country-code]').val(`{"exclude": false,"shippingCountryCode": ["${$val}"],"typeCode": "country"}`);
                    };
                   layer.close(index);        
                }
            });
        },
        //国家弹框
        countryLayerSuccessHandle: function(obj){
            new Promise(blacklistName.selectInit).then(response=> {
                var data = Object.assign({}, obj);
                data.countries = response;
                this.publicCodeHandle(data, 'country');
            });
        },
        //州省弹框
        provinceLayerSuccessHandle: function(obj){
            var data = Object.assign({}, obj);
            this.publicCodeHandle(data, 'province');        
        },
        //城市弹框
        cityLayerSuccessHandle: function(obj){
            var data = Object.assign({}, obj);
            this.publicCodeHandle(data, 'city');
        },
        //收件人姓名弹框
        buyerLayerSuccessHandle: function(obj){
            var data = Object.assign({}, obj);
            this.publicCodeHandle(data, 'buyer');
        },
        //收货地址1弹框
        addressOneLayerSuccessHandle: function(obj){
            var data = Object.assign({}, obj);
            this.publicCodeHandle(data, 'addressOne');
        },
        //收货地址2弹框
        addressTwoLayerSuccessHandle: function(obj){
            var data = Object.assign({}, obj);
            this.publicCodeHandle(data, 'addressTwo');
        },
        //收货邮编弹框
        zipLayerSuccessHandle: function(obj){
            var data = Object.assign({}, obj);
            this.publicCodeHandle(data, 'zip');
        },
        //收件人电话弹框
        phoneLayerSuccessHandle: function(obj){
            var data = Object.assign({}, obj);
            this.publicCodeHandle(data, 'phone');
        },
        //付款邮箱弹框
        emailLayerSuccessHandle: function(obj){
            var data = Object.assign({}, obj);
            this.publicCodeHandle(data, 'email');
        },
        //公关渲染模板
        publicCodeHandle: function(data, key){
            var tplId = `blacklist_${key}EditContainerTpl`;
            var id = `blacklist_${key}EditContainer`;
            var getTpl = $('#'+tplId).text(),
            view = document.getElementById(id);
            laytpl(getTpl).render(data, function(html){
                view.innerHTML = html;
                form.render();
            }); 
        },
        //渲染表格
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#blacklist_table',
                method: 'post',
                url: '/lms/rule/blacklist/query',
                where: data,
                page: true,
                id: "blacklist_tableId",
                limits: [50, 100, 200],
                limit: 50,
                cols: [
                    [
                      {title: '规则名称', field: 'ruleName', width: 100},
                      {title: '规则详情<b style="cursor:pointer;color:#428bca;" id="blacklist_expand">（+展开）</b>', field: 'ruleDetail',templet: '#blacklist_ruleDetail', field: 'detailContent'},
                      {title: '状态', field: 'status', width: 100, templet: `
                      <div>
                         {{# if(d.status){ }}
                           <span>已启用</span>
                         {{# }else{ }}
                            <span>已禁用</span>
                         {{# } }}
                      </div>
                      `},
                      {title: '备注', field: 'remark'},
                      {title: '最后修改', field: 'modifier',width:150, templet: `
                        <div>
                          <div>{{d.modifier ? d.modifier: d.creator}}</div>
                          <div>{{d.modifyTime? Format(d.modifyTime, 'yyyy-MM-dd hh:mm:ss'): Format(d.createTime, 'yyyy-MM-dd hh:mm:ss')}}</div>
                      </div>
                      `},
                      {title: '操作',toolbar: '#blacklist_tableIdBar', width: 80}
                    ]
                ],
                done: function(res, curr, count){
                    _this.watchBar();
                    _this.expandDetail();
                    _this.expandDetailAll();
                }
            });
        },
        //监听表格工具条
        watchBar: function(){
            var _this = this;
            table.on('tool(blacklist_tableFilter)',function(obj){
                var data = obj.data;
                var id= data.id;
                //删除规则
                if(obj.event =='delete'){
                    _this.deleteRule(id);
                }else if(obj.event== 'enable'){ //启用
                    _this.enableRule(id);
                }else if(obj.event == 'disable'){ //禁用
                    _this.disableRule(id);
                }else if(obj.event == 'edit'){ //编辑
                    _this.editRule(data);
                }else if(obj.event == 'copy'){ //复制
                    _this.copyRule(data);
                }
            });
        },
        //编辑规则
        editRule: function(data){
            var _this = this;
            data.conditionArr = this.conditionArr();
            layer.open({
                type: 1,
                title: '编辑地址规则',
                area: ['1100px', '700px'],
                btn: ['保存', '关闭'],
                content: $('#blacklist_newAddBlacklist').html(),
                success: function(layero, index){
                    var getTpl = newAddBlackListContainerTpl.innerHTML,
                    view = document.getElementById('newAddBlackListContainer');
                    laytpl(getTpl).render(data, function(html){
                        view.innerHTML = html;
                        form.render();
                        _this.watchCks();
                    });
                },
                yes: function(index, layero){
                    _this.newDataYesHandle(layero).then(function(result){
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/lms/rule/blacklist/save',
                            contentType: 'application/json',
                            data: JSON.stringify(result),
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code == '0000'){
                                  layer.msg(res.msg);
                                  layer.close(index);
                                  $('[lay-filter=blacklist_submit]').trigger('click'); //初始化
                                }else{
                                  layer.msg(res.msg);
                                }
                            },
                            error: function(){
                                loading.hide();
                                layer.msg('服务器错误');
                            }
      
                          });
                    })
                }
            });
        },
        //复制规则
        copyRule: function(data){
            var _this = this;
            var obj = data;
            obj.conditionArr = this.conditionArr();
            delete obj.id;
            delete obj.priority;
            layer.open({
                type: 1,
                title: '复制地址规则',
                area: ['1100px', '700px'],
                btn: ['保存', '关闭'],
                content: $('#blacklist_newAddBlacklist').html(),
                success: function(layero, index){
                    var getTpl = newAddBlackListContainerTpl.innerHTML,
                    view = document.getElementById('newAddBlackListContainer');
                    laytpl(getTpl).render(obj, function(html){
                        view.innerHTML = html;
                        form.render();
                        _this.watchCks();
                    });
                },
                yes: function(index, layero){
                    _this.newDataYesHandle(layero).then(function(result){
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/lms/rule/blacklist/save',
                            contentType: 'application/json',
                            data: JSON.stringify(result),
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code == '0000'){
                                  layer.msg(res.msg);
                                  layer.close(index);
                                  $('[lay-filter=blacklist_submit]').trigger('click'); //初始化
                                }else{
                                  layer.msg(res.msg);
                                }
                            },
                            error: function(){
                                loading.hide();
                                layer.msg('服务器错误');
                            }
      
                          });
                    });
                }
            });
        },
        //删除规则
        deleteRule: function(id){
            var _this = this;
            layer.confirm('确定删除吗?', {icon: 3, title:'提示'},function(index){
                $.ajax({
                    type: 'get',
                    dataType:'json',
                    url: '/lms/rule/delete?ids='+id,
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            layer.msg(res.msg);
                            layer.close(index);
                            $('[lay-filter=blacklist_submit]').trigger('click');
                        }
                    },
                    error: function(){
                        loading.hide();
                    }
                })
            });
        },
        //启用规则
        enableRule: function(id){
            layer.confirm('确定启用吗?', {icon: 3, title:'提示'}, function(index){
                $.ajax({
                    type: 'get',
                    dataType:'json',
                    url: '/lms/rule/enable?ids='+id,
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            layer.msg(res.msg);
                            layer.close(index);
                            $('[lay-filter=blacklist_submit]').trigger('click');
                        }
                    },
                    error: function(){
                        loading.hide();
                    }
                })
            });
        },
        //禁用规则
        disableRule: function(id){
            layer.confirm('确定停用吗?', {icon: 3, title:'提示'}, function(index){
                $.ajax({
                    type: 'get',
                    dataType:'json',
                    url: '/lms/rule/disable?ids='+id,
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            layer.msg(res.msg);
                            layer.close(index);
                            $('[lay-filter=blacklist_submit]').trigger('click');
                        }
                    },
                    error: function(){
                        loading.hide();
                    }
                })
            });
        },
        //ajax请求的默认参数
        defaultObj: function(){ 
            var obj = {
                type: 'get',
                dataType: 'json',
                contentType: 'x-www-form-urlencoded',
                beforeSend: function(){
                    loading.show();
                },
                error: function(){
                    loading.hide();
                    reject('服务器错误!');
                }
            }
            return obj
        },
        //初始化选择框
        selectInit: function(resolve, reject){
            var _this = this;
            var params = _this.defaultObj;
            $.ajax(Object.assign({
                url: '/lms/rule/blacklist/init',
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        var countries = res.data.countries;
                        var countriesArr = [];
                        for(let key in countries){
                           var item = countries[key]
                           countriesArr.push(...item);
                        };
                        resolve(countriesArr);
                    }else{
                        reject(res.msg);
                    }
                }
            }, params));
        },
        //展开事件
        expandDetail: function(){
            var tds = $('td[data-field=detailContent]');
            for(var i=0; i<tds.length; i++){
                var $item = $(tds[i]);
                var tdh = $item.find('.blacklistDetailDiv').height();
                if(tdh > 146) {
                   var expandStr = `<div class="blacklist_expand"><b style="cursor:pointer;color:#428bca;"  class="blacklistDetail_expand_single">+展开</b></div>`;
                   $item.append(expandStr);
                }
            };
            var $body = $('#blacklist_table').next().find('.layui-table-body.layui-table-main');
            $body.on('click', '.blacklistDetail_expand_single', function(){
                var $this = $(this);
                var txt = $this.html();
                var $tar = $(this).parents('td').find('.blacklistDetailDefault');
                if(txt == '+展开'){
                    $tar.removeClass('blacklistDetailHidden').addClass('blacklistDetailShow');
                    $this.html('-收缩');
                }else{
                    $tar.addClass('blacklistDetailHidden').removeClass('blacklistDetailShow');
                    $this.html('+展开');
                }
            });
        },
        expandDetailAll: function(){
            var $thExpand = $('#blacklist_expand');
            var tds = $('td[data-field=detailContent]'); 
            $thExpand.on('click', function(){
                var txt = $thExpand.html();
                if(txt == '（+展开）'){
                    $thExpand.html('（-收缩）');
                    for(var i=0; i< tds.length; i++){
                        var $tar = $(tds[i]).find('.blacklistDetail_expand_single');
                        if($tar.html() == '+展开'){
                            $tar.trigger('click');
                        }
                    };
                }else{
                    $thExpand.html('（+展开）');
                    for(var i=0; i< tds.length; i++){
                        var $tar = $(tds[i]).find('.blacklistDetail_expand_single');
                        if($tar.html() == '-收缩'){
                            $tar.trigger('click');
                        }
                    };
                }
            })
        }
    };
    
    blacklistName.search().newAddBlacklist();
    $('[lay-filter=blacklist_submit]').trigger('click'); //初始化

})