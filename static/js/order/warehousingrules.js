layui.use(['admin','table','form','element','layer','laytpl'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        form = layui.form;
    form.render('select');
    var pageEnumdata = null

    warehousingRulestableRender()

    function warehousingRulestableRender(){
        table.render({
            elem: '#warehousingrules_table',
            method: 'post',
            url: ctx+'/order/rule/warehousetype/list.html',
            where:  {},
            cols: [
                [ 
                    {title: '优先级',templet: '#warehouseRules_priority',width:100}
                    ,{title: '规则名称',field: 'ruleName'}
                    ,{title: '仓库模式', field: 'warehouseType',templet:'<div>{{formateWarehouse(d.warehouseType)}}<div>'}
                    ,{title: '规则详情',templet: '#warehouseRules_detail', align: 'left',width:'40%', field: 'detailContent'}
                    ,{title: '状态',templet:'#warehouseRules_status', field: 'status'}
                    ,{title: '备注', field: 'ruleRemark'}
                    ,{title: '操作', align:'center', toolbar: '#warehouseRules_tableIdBar'}
               ]
            ],
            page: false,
            id: "warehousingrules_table",
            // limits: [50, 100, 300],
            // limit: 50,
            created:function(res){
                res.data.forEach((item)=>{
                    item.ruleData = JSON.parse(item.ruleData)
                })
            },
            done: function(res){
                listenToolbar()                  
            }
        });
    }

    $('#newWarehousing').click(function(){
        warehousingRulesDetail()
    })
    //获取页面枚举数据
    initAjax('/order/rule/warehousetype/init.html','GET',{},function(returnData){
        pageEnumdata = returnData.data
        })

    // 保存规则
    function saveWarehouseRule(data,func){
        initAjax('/order/rule/warehousetype/save.html','POST',data,function(returnData){
            if(func){
                func(returnData)
            }
            },'application/x-www-form-urlencoded')
    }
    //修改优先级
    function modifyPority(data,func){
        initAjax('/order/rule/warehousetype/updatepriority.html?id='+data.id+'&priority='+data.priority,'POST',{},function(returnData){
            if(func){
                func(returnData)
            }
            })
    }

    // 删除规则
    function deleteRules(id,func){
        initAjax('/order/rule/warehousetype/delete.html?id='+id,'POST',{},function(returnData){
            if(func){
                func(returnData)
            }
            })
    }
    // 停用、启用规则
    function enableRules(data,func){
        initAjax('/order/rule/warehousetype/updatestatus.html?id='+data.id+'&status='+data.status,'POST',{},function(returnData){
            if(func){
                func(returnData)
            }
        })
    }

   //新增/修改分仓规则
    function warehousingRulesDetail(data){
        var isEdit = data?true:false
        title = isEdit?'修改分仓规则':'新增分仓规则'
        layer.open({
            type: 1,
            title: title,
            area: ['1100px', '700px'],
            btn: ['保存', '关闭'],
            content: $('#warehouseRule_createRulesLayer').html(),
            id:'warehouseRule_createRulesLayerID',
            success: function(layero, index){
                var tpl = warehouseRule_createRules_containerTpl.innerHTML;
                var tplContainer= document.getElementById('warehouseRule_createRules_container');
                laytpl(tpl).render(pageEnumdata, function(html){
                    tplContainer.innerHTML = html;
                    form.render('select');
                    form.render('checkbox');
                    listenOnCheck()
                    listenOnLi()
                });
                if(isEdit){
                    form.val("newRulesForm", data);
                    var $ul = $('#warehouserulesLeftChooseCondition')
                    for(var i in data.ruleData){
                        $('.bottomCondition_right_body').find('input[name="'+i+'"]').attr('checked',true)
                        var type = typeMap[i]
                        if(type){
                            if(i=='storeSSku'){
                                var displayContent =  data.ruleData[i].hasOwnProperty('contains')?
                                `<b>指定已选sku:</b>${data.ruleData[i].contains.join(';')}`:
                                `<b>排除已选sku:</b>${data.ruleData[i].nocontains.join(';')}`
                            }else if(i=='storeAcctIds'&&data.ruleData.storeAcctNames){
                                var displayContent = `${data.ruleData.storeAcctNames.join(';')}`
                            }else{
                                var displayContent = `${data.ruleData[i].join(';')}`
                            }
                            var str= `<li data-type="${i}">
                            <a href="javascript:;" class="warehouse_a">指定${type}:</a>
                            <span>${displayContent}</span>
                          </li>`                          
                          $ul.append(str)
                        }
                        $ul.find('li[data-type="'+i+'"]').data('value',data.ruleData[i])
                        $ul.find('li[data-type="storeAcctIds"]').data('name',data.ruleData[i].storeAcctNames)
                    }
                    form.render('checkbox')
                }
            },
            yes: function(index, layero){
                var $lis = $(layero).find('#warehouserulesLeftChooseCondition').find('li')
                var ruleData = {}
                $lis.each(function(index,item){
                    var type = $(item).data('type')
                    var value = $(item).data('value')
                    ruleData[type] = value
                    if(type=='storeAcctIds'){
                        ruleData.storeAcctNames = $(item).data('name')
                    }
                })
                form.on('submit(submit_newWarehouse_btn)',function(obj){
                    var submitdata = obj.field
                    if(data){
                        submitdata.id = data.id
                    }
                    submitdata.ruleData = JSON.stringify(ruleData)
                    saveWarehouseRule(submitdata,function(returnData){
                    warehousingRulestableRender()
                    layer.msg(returnData.msg||'保存成功')
                    layer.close(index)
                    })
                })
                $('#submit_newWarehouse_btn').click()
            }
        });
    }

    function listenOnCheck(){
        var $ul = $('#warehouserulesLeftChooseCondition')
        form.on('checkbox(chooseType)',function(obj){
            if(obj.elem.checked){
            var str= `<li data-type="${obj.value}">
            <a href="javascript:;" class="warehouse_a">指定${obj.elem.title}:</a>
            <span></span>
          </li>`
          $ul.append(str)
            }else{
                $ul.find('li[data-type="'+obj.value+'"]').remove()
            }
        })
    }

    var typeMap = {'platCodes':'平台','storeShippingTypes':'店铺运输方式','storeAcctIds':'店铺','storeSSku':'店铺sku'}

    function listenOnLi(){
        $('body').on('click','#warehouserulesLeftChooseCondition li',function(){
            var type = $(this).data('type')
            var value = $(this).data('value')
            var options = optionsTypeMap[type]
            if(options){
                options(value)
            }else{
                layer.msg("暂时没有相应操作")
            }
        })
    }

    var optionsTypeMap = {
        //指定平台
        'platCodes':function(platCodes){
            layer.open({
                type: 1,
                title: '平台',
                area: ['500px', '500px'],
                btn: ['保存', '关闭'],
                content: $('#warehouse_platformLayer').html(),
                id:'warehouse_platformLayerID',
                success: function(layero, index){
                    var tpl = warehouse_platform_containerTpl.innerHTML;
                    var tplContainer= $(layero).find('#warehouse_platform_container');
                    laytpl(tpl).render(pageEnumdata.platCodes, function(html){
                        tplContainer.html(html);
                    });
                    tplContainer.find('input[type=checkbox]').each(function(index,item){
                        if((platCodes||[]).indexOf(item.value)>-1){
                            $(item).attr('checked',true)
                        }
                    })
                    form.render('checkbox');
                },
                yes: function(index, layero){
                    var checkboxes = $('#warehouse_platform_container').find('input[type=checkbox]');
                    var ckesArr = [];
                    for(var i=0; i<checkboxes.length; i++){
                        var item = checkboxes[i];
                        if($(item).is(':checked')){
                            ckesArr.push($(item).val());
                        }
                    };
                    $('#warehouserulesLeftChooseCondition li[data-type="platCodes"]').data('value',ckesArr)
                    $('#warehouserulesLeftChooseCondition li[data-type="platCodes"]').find('span').text(ckesArr.join(';'))
                    layer.close(index);
                }
            })
        },
        //指定店铺
        'storeAcctIds':function(storeAcctIdList=[]){
            var warehouseRulesXTree;
            //   对接口返回的数据进行处理,使其符合xmselect的data的格式
            function dealDataKey(b) {
                let arr = []
                if (Array.isArray(b)) {
                  b.forEach((item) => {
                    let curChecked = storeAcctIdList.filter(
                      (elem) => elem == item.value
                    )
                    arr.push({
                      name: item.title,
                      value: item.value,
                      selected: curChecked.length ? true : item.checked,
                      children: item.data.length ? dealDataKey(item.data) : [],
                    })
                  })
                  return arr
                }
            }
            let _result = dealDataKey(pageEnumdata.storeTree)
            layer.open({
                type: 1,
                title: '店铺',
                area: ['580px', '650px'],
                btn: ['保存', '关闭'],
                content: $('#warehouseRules_storeLayer').html(),
                id:'warehouseRules_storeLayerID',
                success: function(layero, index){
                    warehouseRulesXTree = xmSelect.render({
                        el: "#warehouseRulesXTree", 
                        toolbar: {
                          show: true,
                        },
                        height: "400px",
                        delay: 1000,
                        paging: true,
                        pageSize: 1000,
                        filterable: true,
                        filterMethod: function (val, item, index, prop) {
                          let _val = val.replace(/，/g, ",").replace(/\s+/g, "") //中文逗号转为英文逗号，空格全部删掉
                        //   输入多个数据
                          if (_val.includes(",")) {
                            let _valArr = _val.split(",")
                            let isSameVal = _valArr.some(
                              (elem) => elem == item.value || item.name == elem
                            )
                            return isSameVal
                          } else if (_val == item.value) {
                            //把value相同的搜索出来
                            return true
                          } else if (item.name.indexOf(_val) != -1) {
                            //名称中包含的搜索出来
                            return true
                          }
                          return false //不知道的就不管了
                        },
                        data: _result,
                        filterDone:function(val, list) {
                        }
                      })
                },
                yes: function(index, layero){
                    var checkboxes = warehouseRulesXTree.getValue()
                    var values = checkboxes.map(function(item){
                        return item.value
                    })
                    var titles = checkboxes.map(function(item){
                        return item.name
                    })
                    $('#warehouserulesLeftChooseCondition li[data-type="storeAcctIds"]').data('value',values)
                    $('#warehouserulesLeftChooseCondition li[data-type="storeAcctIds"]').data('name',titles)
                    $('#warehouserulesLeftChooseCondition li[data-type="storeAcctIds"]').find('span').text(titles.join(';'))
                    layer.close(index);
                }
            })
        },
        'storeShippingTypes':function(storeShippingTypes){
            layer.open({
                type: 1,
                title: '店铺运输方式',
                area: ['500px', '500px'],
                btn: ['保存', '关闭'],
                content: $('#warehouseRules_transportLayer').html(),
                id:'warehouseRules_transportLayerID',
                success: function(layero, index){
                    var $tbody = $('#warehouseRulesTable_tbody');
                    var $input = $(layero).find('input')
                    storeShippingTypes = storeShippingTypes?storeShippingTypes:[]
                    storeShippingTypes.forEach(function(item,index){
                        var str = `<tr data-value="${item}">
                                    <td>${item}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="$(this).parents('tr').remove()">删除</span></td>
                        </tr>`;
                        $tbody.append(str);
                    })
                    $('#warehouseRulesTable_tbody_add').on('click', function(){
                        var val = $input.val();
                        if(!val){
                            layer.msg('不能新增空值');
                            return;
                        }else{
                            var str = `<tr data-value="${val}">
                                    <td>${val}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="$(this).parents('tr').remove()">删除</span></td>
                                </tr>`;
                            $tbody.append(str);
                            $input.val('');
                        }
                    });
                },
                yes: function(index, layero){
                    var $trs = $('#warehouseRulesTable_tbody').find('tr');
                    var tranports = []
                    $trs.each(function(index,item){
                        tranports.push($(item).data('value'))
                    })
                    $('#warehouserulesLeftChooseCondition li[data-type="storeShippingTypes"]').data('value',tranports)
                    $('#warehouserulesLeftChooseCondition li[data-type="storeShippingTypes"]').find('span').text(tranports.join(';'))
                    layer.close(index);
                }
            })
        },
        'storeSSku':function(storeSSku){
            layer.open({
                type: 1,
                title: '商品SKU',
                area: ['500px', '500px'],
                btn: ['保存', '关闭'],
                content: $('#warehouseRules_storeSkuLayer').html(),
                id:'warehouseRules_storeSkuLayerID',
                success: function(layero, index){
                    form.render()
                    if(storeSSku){
                    if(storeSSku.hasOwnProperty('nocontains')){
                        $(layero).find('input[value="true"]').attr('checked',true)
                        form.render('radio')
                        var value = storeSSku.nocontains
                    }else{
                        var value = storeSSku.contains
                    }
                    }
                    $(layero).find('textarea').val((value||[]).join(','))
                },
                yes: function(index, layero){
                    var checkedVal = $('[name=storesSkuRadio]:checked').val();
                    var areaVal = $(layero).find('textarea').val();
                    if(areaVal.indexOf('，') > -1){
                        layer.msg('仅允许使用英文逗号！');
                        return;
                    }
                    if(checkedVal== 'true'){
                        var displayContent = `<b>排除已选sku:</b>${areaVal}`; 
                        var saveContent = {'nocontains':areaVal.split(',')}  
                    }else if(checkedVal== 'false'){
                        var displayContent = `<b>指定已选sku:</b>${areaVal}`;
                        var saveContent = {'contains':areaVal.split(',')}
                    };
                    $('#warehouserulesLeftChooseCondition li[data-type="storeSSku"]').data('value',saveContent)
                    $('#warehouserulesLeftChooseCondition li[data-type="storeSSku"]').find('span').html(displayContent)
                    layer.close(index);
                }
            })
        }
    }

    function listenToolbar(){
        table.on('tool(warehousingrules_table)',function(obj){
            var data = obj.data;
            if(obj.event =='edit'){
                warehousingRulesDetail(data)
            }else if(obj.event == 'enable'){
                enableRules({id:data.id,status:true},function(returnData){
                    warehousingRulestableRender()
                    layer.msg(returnData.msg||'启用成功')
                })
            }else if(obj.event == 'disable'){
                enableRules({id:data.id,status:false},function(returnData){
                    warehousingRulestableRender()
                    layer.msg(returnData.msg||'停用成功')
                })
            }else if(obj.event == 'delete'){
                layer.confirm('确定要删除吗', {icon: 3, title:'提示'}, function(index){
                    deleteRules(data.id,function(returnData){
                        warehousingRulestableRender()
                        layer.msg(returnData.msg||'删除成功')
                        layer.close(index)
                    })                   
                });
            }
        })
    }
    
    function initAjax(url, method,data, func,contentType) { //初始化ajax请求
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType||'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
            }
        })
    }

    window.formateWarehouse = function(str){
        var warehouseModeMap = {'DIRECT': "直邮仓",'WINIT': "万邑通仓"}
        return warehouseModeMap[str]
    }

    window.modifyWarehouseRulePriority = function(e,aDom){
        if(e.keyCode == 13){
            var priority = $(aDom).val();
            var id = $(aDom).data('id');
            modifyPority({priority,id},function(returnData){
                layer.msg(returnData.msg||'修改成功')
            })
        }
    }
})

 