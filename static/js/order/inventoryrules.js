//模块引入 类似于 requirejs
layui.use(['admin','form','table','layer','laydate', 'laytpl','formSelects'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    form.render('select');
    var inventoryrulesName = {
        //弹框数据初始化
        conditionData: function(){
            var data = [
                {key: 'country', value: '国家/地区'},
                {key: 'money', value: '金额'},
                {key: 'logisticsType', value: '物流'},
                {key: 'platform', value: '平台'},
                {key: 'store', value: '店铺'},
                {key: 'orderDelayDays', value: '延迟天数'},
                {key: 'orderShipByDate', value: '截止发货天数'},
                {key: 'appointTransport', value:'店铺运输方式'},
            ];
            return data;
        },
        initWareHouse: function(selectedStr){
            this.getWarehouseAjax()
            .then(res=>{
                const selectedArr = !!selectedStr ?selectedStr.split(',') : []
                const arr = res.map(item=>({value:item.id, name:item.warehouseName, selected: selectedArr.find(elem=>elem==item.id)!==undefined ? 'select':'' }))
                formSelects.data('newAddInventoryrulesContainerTpl_warehouse','local',{arr})
            })
        },
        newAddDataOriginal: function(obj){
            var _this = this;
            if(!obj){
                obj= {}
            };
            var defaultData = {
                ruleName: '',
                priority: 1,
                status: true,
                detail: '',
                conditionArr:_this.conditionData(),
                remark: ''
            };
            var data = Object.assign(defaultData, obj);
           return data;
        },
        //新增/复制/编辑弹框的保存数据预处理
        yesDataHandle: function(layero){
            return new Promise(function(resolve, reject){
                var obj = {};
                var inp = layero.find('[name=id]');
                var priority = layero.find('[name=priority]');
                var ruleName = layero.find('[name=ruleName]');
                var status = layero.find('[name=status]');
                var remark = layero.find('[name=remark]');
                if(inp){
                    obj.id = Number(inp.val());
                }
                obj.priority = Number(priority.val());
                obj.ruleName = ruleName.val();
                obj.status = eval(status.val());
                obj.remark = remark.val();
                obj.alternativeWarehouseIds = formSelects.value('newAddInventoryrulesContainerTpl_warehouse', 'valStr')
                var $lis = $('#inventoryrulesLeftChooseCondition').find('li');
                var detailObj = {};
                for(var i=0; i<$lis.length; i++){
                    var item = $lis[i];
                    var key =  $(item).attr('ztt-name'); //key值
                    var val = $(item).find(`[name=ztt-${key}-code]`).val()==''? '':JSON.parse($(item).find(`[name=ztt-${key}-code]`).val());
                    if(val){
                        detailObj[key] = val;
                    }
                };
                obj.detail = detailObj;
                if(!ruleName.val() || !priority.val()){
                    return layer.msg('规则名称和优先级不能为空');
                }
                resolve(obj);
            });
        },
        //新增规则
        newAddInventoryrules: function(){
            var data = {};
            var _this = this;
            var data = _this.newAddDataOriginal();
            $('#inventoryrules_newAdd').on('click', function(){
                _this.commonLayerRender('新增库存占用规则', data);
            });
        },
        //新增/编辑/复制的复选框点击事件
        watchCks: function(){
            var $ul = $('#inventoryrulesLeftChooseCondition'); //container
            form.on('checkbox(inventoryrulesCondition)', function(obj){
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
            $('#inventoryrulesLeftChooseCondition').on('click', '.ztt-a', function(){
                var key = $(this).attr('ztt-key'); //获取到选中项的属性值
                var preposition = key + 'Frame';
                _this[preposition]();
            });
        },
        //国家弹框处理
        countryFrame: function(){
            var _this = this;
            this.selectInit().then(function(result){
                var countries = result.countries;
                layer.open({
                    type: 1,
                    title: '选择国家或区域',
                    area: ['1100px', '700px'],
                    btn: ['保存', '关闭'],
                    content: $('#inventoryrules_countryEdit').html(),
                    id: 'inventoryrules_countryEditId',
                    success: function(layero, index){
                        var tpl = inventoryrules_countryEditContainerTpl.innerHTML;
                        var tplContainer= document.getElementById('inventoryrules_countryEditContainer');
                        laytpl(tpl).render(countries, function(html){
                            tplContainer.innerHTML = html;
                            form.render('checkbox');
                            _this.watchAllCksCountry();
                            _this.watchSingleCksCountry();
                            _this.countrySearch(countries);
                            _this.watchSelectedCountry();
                        });
                        var $input = $('[name=ztt-country-code]');
                        var $selted= $('.country_countainer_selected_content');
                        var $body =  $('.country_countainer_content');
                        if($input.val()){
                            var inputObj = JSON.parse($input.val());
                            var exclude = inputObj.exclude;
                            var datas = inputObj.shippingCountryCode;
                            if(exclude){
                                $('.country_countainer_selected_title').find('[name=excludeCountry]').attr('checked', true);
                            };
                            for(var i=0; i<datas.length; i++){
                               var item = datas[i];
                               $body.find(`input[name="${item}&auto"]`).attr('checked', true);
                               var title = $body.find(`input[name="${item}&auto"]`).attr('title');
                               var str = `<input type="checkbox" title="${title}" name="${item}" lay-skin="primary" lay-filter="selectedCondition" checked>`;
                               $selted.append(str);
                            };
                            form.render('checkbox');
                        };
                    },
                    yes: function(index, layero){
                        var ckes = $('.country_countainer_selected_content').find('input[type=checkbox]');
                        var ckedEx= $('.country_countainer_selected_title').find('[name=excludeCountry]').is(':checked');
                        if(!ckes.length){
                            layer.msg('保存前请先选择国家或区域');
                            return;
                        };
                        var codeArr = [];
                        var countryStr = '';
                        for(var i=0; i < ckes.length; i++){
                            var item = ckes[i];
                            var name = $(item).attr('name');
                            var title = $(item).attr('title');
                            codeArr.push(name);
                            countryStr += `${title};`
                        };
                        if(ckedEx){
                            var displayContent = `<b>排除以下国家/地区:</b>${countryStr}`;
                        }else{
                            var displayContent = `<b>包含以下国家/地区:</b>${countryStr}`;
                        }
                        $('[name=ztt-country-code]').val(JSON.stringify({"exclude":ckedEx,"shippingCountryCode": codeArr, "typeCode": "country"}));
                        $('[ztt-name=country]').find('a').html(displayContent);
                        layer.close(index);
                    }
                })
            }).catch(function(reason){
                layer.msg('查询失败,请稍后再试!');
            });
        },
        watchAllCksCountry: function(){
            var allLetters = ['aeCountries','fjCountries','koCountries','ptCountries','uzCountries'];
            var $selectCondition = $('.country_countainer_selected_content');
            for(var i=0; i<allLetters.length; i++){
                var item = allLetters[i];
                form.on(`checkbox(${item})`, function(obj){
                    var cked = obj.elem.checked;
                    var $tar = $(obj.elem).parents('.layui-tab-item.layui-show').find('.layui-form')[1];
                    var ckes =$($tar).find('input[type=checkbox]');
                    if(cked){
                        for(var i=0 ; i<ckes.length; i++){
                           var item = ckes[i];
                           if(!$(item).is(':checked')){
                               $(item).next().trigger('click');
                           }
                        }
                    }else{
                         for(var i=0 ; i<ckes.length; i++){
                            var item = ckes[i];
                            if($(item).is(':checked')){
                                $(item).next().trigger('click');
                            }
                        }
                    }
                });
            };
        },
        watchSingleCksCountry: function(){
            form.on('checkbox(conditionCountriesFilter)', function(obj){
                var cked = obj.elem.checked;
                var title = obj.elem.title;
                var name = obj.elem.name.split('&')[0];
                var $selectCondition = $('.country_countainer_selected_content');
                if(cked){
                    var $input= `<input type="checkbox" title="${title}" name="${name}" lay-skin="primary" lay-filter="selectedCondition" checked>`;
                    $selectCondition.append($input);
                }else{
                    var $removeTarget = $selectCondition.find(`input[name=${name}]`);
                    $removeTarget.next().remove();
                    $removeTarget.remove();
                }
                form.render('checkbox');
            });
        },
        countrySearch: function(countries){ // get all and compare, if true render new checkbox
            var cnArr = [];
            var enArr = [];
            for(var obj in countries){
                var item = countries[obj];
                for(var i=0; i<item.length; i++){
                    cnArr.push(item[i]['name']);
                    enArr.push(item[i]['abbr']);
                }
            };
            $('#inventoryrules_countryEditContainer').on('keydown', '[name=country_search]', function(e){
                var targetForm = $('.allCountrySearchContainer').find('.layui-form');
                if(e.keyCode == 13){
                    if(e.target.value){
                        $('.allCountryContainer').addClass('disN');
                        $('.allCountrySearchContainer').removeClass('disN');
                        targetForm.html('');
                        var valArr = e.target.value.split(',');
                        for(var j=0; j<valArr.length; j++){
                            var transVal = valArr[j].toUpperCase();
                            console.log(transVal);
                            if(cnArr.indexOf(transVal)>-1 || enArr.indexOf(transVal)>-1){
                                var k = cnArr.indexOf(transVal) >-1 ? cnArr.indexOf(transVal) : enArr.indexOf(transVal)
                                var combinationStr = cnArr[k]+'('+enArr[k]+')';
                                var str =`<input type="checkbox" title="${combinationStr}" name="${enArr[k]}&auto" lay-skin="primary" lay-filter="conditionCountriesFilter">`;
                                targetForm.append(str);
                            }else{
                                targetForm.append('');
                            }
                        };
                        form.render('checkbox');
                    }else{
                        $('.allCountryContainer').removeClass('disN');
                        $('.allCountrySearchContainer').addClass('disN');
                        targetForm.html('');
                    }
                }
            })
        },
        watchSelectedCountry: function(){ // watch selected country click
            form.on('checkbox(selectedCondition)', function(obj){
                var elem = obj.elem;
                var name = elem.name + '&auto';
                var cked = elem.checked;
                if(!cked){
                    $(elem).next().remove();
                    $(elem).remove();
                    $(`[name="${name}"]`).removeAttr('checked');
                    form.render('checkbox');
                };
            });
        },
        //金额弹框处理
        moneyFrame: function(){
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '金额<font color="red">(订单利润的币种只能是人民币)</font>',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#inventoryrules_moneyEdit').html(),
                    id: 'inventoryrules_moneyEditId',
                    success: function(layero, index){
                        var tpl = inventoryrules_moneyEditContainerTpl.innerHTML;
                        var tplContainer= document.getElementById('inventoryrules_moneyEditContainer');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                            //做事件监听,设置订单利润的币种只能是人民币
                            form.on('select(inventoryrules_moneyTypeFilter)', function(data){
                                if (data.value == 4) {
                                    layero.find('select[name=currency]').val(1);
                                    layero.find('select[name=currency]').attr('disabled', true);
                                } else {
                                    layero.find('select[name=currency]').attr('disabled', false);
                                }
                                form.render('select');
                            });
                        });
                        var $tbody = $('#in_moneyRulesTable_tbody');
                        var $input = $('[name=ztt-money-code]');
                        if($input.val()){
                            var inputObj = JSON.parse($input.val());
                            var currency = inputObj.currency;
                            var moneyType = inputObj.moneyType;
                            var datas = inputObj.moneyRegionList;
                            for(var i=0; i<datas.length; i++){
                                var item = datas[i];
                                var strInit = `<tr>
                                    <td>${item.minimumMoney}</td>
                                    <td>${item.maximumMoney}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="inventoryrulesDel(this)">删除</span></td>
                                </tr>`;
                                $tbody.append(strInit);
                            };
                            $('[name=currency]').val(currency);
                            $('[name=moneyType]').val(moneyType);
                            form.render('select');
                        }
                        $('#in_moneyRulesTable_tbody_add').on('click', function(){
                            var grt = Number($('[name=greatThanMoney]').val());
                            var lt = Number($('[name=lessThanMoney]').val());
                            if(!grt || !lt){
                                layer.msg('不能新增空值');
                                return;
                            }else if(grt > lt){
                                layer.msg('后一个输入框的值不应小于前面');
                                return;
                            }else{
                                var str = `<tr>
                                    <td>${grt}</td>
                                    <td>${lt}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="inventoryrulesDel(this)">删除</span></td>
                                </tr>`;
                                $tbody.append(str);
                                $('[name=greatThanMoney]').val('');
                                $('[name=lessThanMoney]').val('');
                            }
                        });
                    },
                    yes: function(index, layero){
                        var currency = {};
                        currency.code = $('[name=currency] option:selected').val(); //pass it
                        currency.name = $('[name=currency] option:selected').text(); // display in page
                        var moneyType = {};
                        moneyType.code = $('[name=moneyType] option:selected').val(); //pass it
                        moneyType.name = $('[name=moneyType] option:selected').text(); //display in page
                        var $trs = $('#in_moneyRulesTable_tbody').find('tr');
                        var tdsArr = [];
                        for(var i= 0; i<$trs.length; i++){
                            var tr = $trs[i];
                            var obj= {};
                            obj.minimumMoney = Number($(tr).find('td:first-child').text());
                            obj.maximumMoney = Number($(tr).find('td:nth-child(2)').text());
                            tdsArr.push(obj);
                        };
                        var rangerStr = '';
                        for(var j=0; j<tdsArr.length;j++){
                            var td = tdsArr[j];
                            rangerStr += `${td.minimumMoney}至${td.maximumMoney};`;
                        }
                        var money = {};
                        money.currency = currency.code;
                        money.moneyType = moneyType.code;
                        money.moneyRegionList = tdsArr;
                        money.typeCode = "money";
                        $('[ztt-name=money]').find('[name=ztt-money-code]').val(JSON.stringify(money));
                        var displayContent = `<b>金额类型:</b>${moneyType.name};<b>币种:</b>${currency.name};<b>范围:</b>${rangerStr}`;
                        $('[ztt-name=money]').find('a').html(displayContent);
                        layer.close(index);
                    }
                });
            }).catch(function(reason){
                layer.msg('查询失败,请稍后再试!');
            });
        },
        //物流弹框处理
        logisticsTypeFrame: function(){
            this.logisticInit().then(function(result){
                var inventoryrulesLogisticXTrees;
                 layer.open({
                     type: 1,
                     title: '物流',
                     area: ['580px', '650px'],
                     btn: ['保存', '关闭'],
                     content: $('#inventoryrules_logisticsTypeEdit').html(),
                     id: 'inventoryrules_logisticsTypeEditId',
                     success: function(layero, index){
                         inventoryrulesLogisticXTrees = new layuiXtree({
                             elem: 'inventoryrulesLogisticXTree'   //(必填) 放置xtree的容器id，不要带#号
                             , form: form     //(必填) layui 的 from
                             , data: result     //(必填) json数组（数据格式在下面）
                             , isopen: true //加载完毕后的展开状态，默认值：true,
                             ,isParentChangeCheck: false
                             , ckall: true //启用全选功能
                             , color: { //三种图标颜色，独立配色，更改几个都可以
                                 open: "#EE9A00", //节点图标打开的颜色
                                 close: "#EEC591", //节点图标关闭的颜色
                                 end: "#828282", //末级节点图标的颜色
                             }
                         });
                         var $input = $('[name=ztt-logisticsType-code]');
                         if($input.val()){
                             var inputObj = JSON.parse($input.val());
                             var datas = inputObj.ruleValueList;
                             for(var i=0; i<datas.length; i++){
                                 var item = datas[i];
                                 $(`input[value=${item}]`).attr('checked', true);
                                 $(`input[value=${item}]`).next().addClass('layui-form-checked');
                             }
                         }
                     },
                     yes: function(index, layero){
                         var ckes = inventoryrulesLogisticXTrees.GetChecked();
                         var storeContent = '';
                         var storesArr = [];
                         var storeContentArr = [];
                         for(var i=0; i<ckes.length; i++){
                             var item = ckes[i];
                             var title = $(item).attr('title');
                             var val = $(item).val();
                             storesArr.push(Number(val));
                             storeContentArr.push(title);
                         };
                         if(!storeContent){
                             storeContent = '物流';
                         }
                         storeContent += storeContentArr.join('、');
                         $('[name=ztt-logisticsType-code]').val(JSON.stringify({"ruleValueList":storesArr,"typeCode":"logisticsType"}));
                         $('[ztt-name=logisticsType]').find('a').html(storeContent);
                         layer.close(index);
                     }
                 })
             });
        },
        //平台弹框处理
        platformFrame: function(){
            var _this = this;
            var $input = $('[name=ztt-platform-code]');
            var initCks =[];
            if($input.val()){
                initCks = JSON.parse($input.val()).platformCode;
            }else{
                initCks = [];
            }
            _this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '平台',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#inventoryrules_platformEdit').html(),
                    id: 'inventoryrules_platformEditId',
                    success: function(layero, index){
                        result.initCks = initCks;
                        var tpl = inventoryrules_platformEditContainerTpl.innerHTML;
                        var tplContainer= document.getElementById('inventoryrules_platformEditContainer');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('checkbox');
                        });
                    },
                    yes: function(index, layero){
                        var checkboxes = $('#inventoryrules_platformEditContainer').find('input[type=checkbox]');
                        var ckesArr = [];
                        for(var i=0; i<checkboxes.length; i++){
                            var item = checkboxes[i];
                            if($(item).is(':checked')){
                                ckesArr.push($(item).val());
                            }
                        };
                        var rangerStr='';
                        for(var j=0; j<ckesArr.length; j++){
                            var item = ckesArr[j];
                            rangerStr += `${item};`;
                        };
                        if(!rangerStr){
                            rangerStr = '平台';
                        }
                        $('[name=ztt-platform-code]').val(JSON.stringify({"platformCode": ckesArr,"typeCode": "platform"}));
                        $('[ztt-name=platform]').find('a').html(rangerStr);
                        layer.close(index);
                    }
                })
            });
        },
        //店铺弹框处理
        storeFrame: function(){
            let $input = $('[name=ztt-store-code]');
            let storeAcctIdList = [];
            if($input.val()){
                let inputObj = JSON.parse($input.val());
                storeAcctIdList = inputObj.storeAcctId;
            }
            this.storeInit().then(function(result){
                let inventoryrulesStoreXTrees;
                 layer.open({
                     type: 1,
                     title: '店铺',
                     area: ['580px', '90%'],
                     btn: ['保存', '关闭'],
                     content: $('#inventoryrules_storeEdit').html(),
                     id: 'inventoryrules_storeEditId',
                     success: function(layero, index){
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
                        let _result = dealDataKey(result)
                        inventoryrulesStoreXTrees = xmSelect.render({
                          el: "#inventoryrulesStoreXTree", 
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
                      });
                     },
                     yes: function(index, layero){
                         let storeContent = '';
                         let checkboxes = inventoryrulesStoreXTrees.getValue()
                         let storesArr = checkboxes.map(function(item){
                              return item.value
                          })
                         let storeContentArr = checkboxes.map(function(item){
                              return item.name
                          })
                         if(!storeContent){
                             storeContent = '店铺';
                         }
                         storeContent += storeContentArr.join('、');
                         $('[name=ztt-store-code]').val(JSON.stringify({"storeAcctId":storesArr,"typeCode":"store"}));
                         $('[ztt-name=store]').find('a').html(storeContent);
                         layer.close(index);
                     }
                 })
             });
        },
        // 截止发货天数弹窗处理
        orderShipByDateFrame: function(){
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '订单截止发货天数',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#inventoryrules_orderShipByDateEdit').html(),
                    id: 'inventoryrules_orderShipByDateEditId',
                    success: function(layero, index){
                        var tpl = inventoryrules_orderShipByDateEditContainerTpl.innerHTML;
                        var tplContainer= document.getElementById('inventoryrules_orderShipByDateEditContainer');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                            $('#inventoryrules_orderShipByDateEditContainer').on('input', '[ztt-verify=shipByDate]', function(e){
                                var val= e.target.value;
                                var reg = /^(\-)?\d+(\.[0-9]{0,1})?$/;
                                if(!reg.test(val)&&val != '-'){
                                    if(!$(e.target).hasClass('layui-form-danger')){
                                        $(e.target).addClass('layui-form-danger').focus();
                                        layer.msg('输入的内容保留1位小数,请重新输入');
                                    }
                                }else{
                                    $(e.target).removeClass('layui-form-danger').focus();
                                }
                            });
                            var $input = $('[name=ztt-orderShipByDate-code]');
                            var $tody = $('#in_shipByDateRulesTable_tbody');
                            if($input.val()){
                                var inputObj = JSON.parse($input.val());
                                var datas = inputObj.timeRegionList;
                                for(var i=0; i <datas.length; i++){
                                    var item = datas[i];
                                    var strInit = `<tr>
                                            <td>${item.minimumTime}</td>
                                            <td>${item.maximumTime}</td>
                                            <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="inventoryrulesDel(this)">删除</span></td>
                                        </tr>`;
                                    $tody.append(strInit);
                                };
                            }
                            $('#in_shipByDateRulesTable_tbody_add').on('click', function(){
                                var grt = $('[name=greatThanShipByDate]').val();
                                var lt = $('[name=lessThanShipByDate]').val();
                                if(!grt || !lt){
                                    layer.msg('不能新增空值');
                                    return;
                                }else{
                                    var str = `<tr>
                                        <td>${grt}</td>
                                        <td>${lt}</td>
                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="inventoryrulesDel(this)">删除</span></td>
                                    </tr>`;
                                    $tody.append(str);
                                    $('[name=greatThanShipByDate]').val('');
                                    $('[name=lessThanShipByDate]').val('');
                                }
                            });
                        });
                    },
                    yes: function(index, layero){
                        var $trs = $('#in_shipByDateRulesTable_tbody').find('tr');
                        var tdsArr = [];
                        var shipByDate= {};
                        for(var i=0; i< $trs.length; i++){
                            var tr = $trs[i];
                            var obj= {};
                            obj.minimumTime = Number($(tr).find('td:first-child').text());
                            obj.maximumTime = Number($(tr).find('td:nth-child(2)').text());
                            tdsArr.push(obj);
                        };
                        shipByDate.timeRegionList = tdsArr;
                        var rangerStr = '';
                        for(var j=0; j<tdsArr.length; j++){
                            var td = tdsArr[j];
                            rangerStr += `${td.minimumTime}至${td.maximumTime}天;`;
                        }
                        if(!rangerStr){
                            rangerStr = '截止发货天数';
                        }
                        var displayContent=`${rangerStr}`;
                        $('[name=ztt-orderShipByDate-code]').val(JSON.stringify(shipByDate));
                        $('[ztt-name=orderShipByDate]').find('a').html(displayContent);
                        layer.close(index);
                    }
                })
            }).catch(function(){
                layer.msg('查询失败,请稍后再试!');
            });
        },
        //店铺运输方式弹框
        appointTransportFrame: function(){ // success
          var _this = this;
          this.selectInit().then(function(result){
              layer.open({
                  type: 1,
                  title: '店铺运输方式',
                  area: ['500px', '500px'],
                  btn: ['保存', '关闭'],
                  content: $('#inventoryrules_transportLayer').html(),
                  id: 'inventoryrules_transportLayerId',
                  success: function(layero, index){
                      var tpl = inventoryrules_transport_containerTpl.innerHTML;
                      var tplContainer= document.getElementById('inventoryrules_transport_container');
                      laytpl(tpl).render(result, function(html){
                          tplContainer.innerHTML = html;
                      });
                      var $tbody = $('#in_transportRulesTable_tbody');
                      var $input = $('[name=ztt-appointTransport-code]');
                      if($input.val()){
                          var inputObj = new Function(`return ${$input.val()}`)();
                          var datas = inputObj.transportType;
                          for(var i=0; i<datas.length;i++){
                              var td = datas[i];
                              var strInit = `<tr>
                                      <td>${td}</td>
                                      <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="inventoryrulesDel(this)">删除</span></td>
                                  </tr>`;
                              $tbody.append(strInit);
                          }
                      };
                      $('#in_transportRulesTable_tbody_add').on('click', function(){
                          var val = $('[name=greatThanTransport]').val();
                          let temArr = val.replace(/\n/g, ':repeatResult:').split(':repeatResult:').map(v => v.trim()) || [],
                              temStr = $('#transportRulesTable_tbody tr td').text().replace(/删除/g, ':repeatResult:'),
                              temTipsOne = '共计完成了:resultCount个新增，:errorCount个失败',
                              temTipsTwo = '',
                              resultCount = 0,errorCount = 0,
                              temStrChangeArr = temStr.split(':repeatResult:'),
                              temArrSet = [], temArrSetTips = [],temArrSetTipsStr = ''
                          temArr.forEach(v => {
                              let temFilter = temArrSet.filter(value => value == v.trim())
                              if (temFilter.length) {
                                  let temObj = {}
                                  temObj.value = v.trim()
                                  temObj.count = 1
                                  temArrSetTips.push(temObj)
                              }else if(v !== '') {
                                  temArrSet.push(v.trim())
                              }
                          })
                          if (!temArrSet.length) {
                              layer.msg('无新增内容')
                              return
                          }
                          temArrSet.forEach(v => {
                              let arr = temArrSetTips.filter(value => value.value == v)
                              if (arr.length) {
                                  temArrSetTipsStr += `<li>{${arr[0].value}}有${arr.length + 1}笔重复，只保存1笔。</li>`
                              }
                              let temFilter = temStrChangeArr.filter(value => value == v.trim())
                              if(temFilter.length) {
                                  temTipsTwo += `<li>${v}: 相同运输方式现在是保存的</li>`
                                  errorCount ++
                                  return
                              }else{
                                  resultCount ++
                                  var str = `<tr>
                                          <td>${v}</td>
                                          <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="inventoryrulesDel(this)">删除</span></td>
                                      </tr>`;
                                  $tbody.append(str);
                                  $('[name=greatThanTransport]').val('');
                              }
                          })
                          temTipsOne = temTipsOne.replace(':resultCount', resultCount).replace(':errorCount', errorCount)
                          layer.confirm(`<div>${temTipsOne}</div><ul>${temArrSetTipsStr}</ul><ul>${temTipsTwo}</ul>`)
                      });
                  },
                  yes: function(index, layero){
                      var $trs = $('#in_transportRulesTable_tbody').find('tr');
                      var tdsArr = [];
                      for(var i=0; i< $trs.length; i++){
                          var tr = $trs[i];
                          var tdVal = $(tr).find('td:first-child').text();
                          tdsArr.push(tdVal);
                      }
                      var rangerStr = '';
                      for(var j=0; j<tdsArr.length; j++){
                          var td = tdsArr[j];
                          rangerStr += `${td};`;
                      };
                      if(!rangerStr){
                        rangerStr = '运输方式';
                      }
                      $('[name=ztt-appointTransport-code]').val(JSON.stringify({ transportType: tdsArr }));
                      // $('#ztt-appointTransport-code-span').text(JSON.stringify({transportType:tdsArr}));
                      $('[ztt-name=appointTransport]').find('a').html(rangerStr);
                      layer.close(index);
                  }
              })
          });
        },
        //延迟天数弹框处理
        orderDelayDaysFrame: function(){
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '订单延迟天数',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#inventoryrules_orderDelayDaysEdit').html(),
                    id: 'inventoryrules_orderDelayDaysEditId',
                    success: function(layero, index){
                        var tpl = inventoryrules_orderDelayDaysEditContainerTpl.innerHTML;
                        var tplContainer= document.getElementById('inventoryrules_orderDelayDaysEditContainer');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                            $('#inventoryrules_orderDelayDaysEditContainer').on('input', '[ztt-verify=delayDays]', function(e){
                                var val= e.target.value;
                                var reg = /^\d+$/;
                                if(!reg.test(val)){
                                   if(!$(e.target).hasClass('layui-form-danger')){
                                    $(e.target).addClass('layui-form-danger').focus();
                                    layer.msg('输入的内容不是整数,请重新输入');
                                   }
                                }else{
                                    $(e.target).removeClass('layui-form-danger').focus();
                                }
                            });
                            var $input = $('[name=ztt-orderDelayDays-code]');
                            var $tody = $('#in_delayDaysRulesTable_tbody');
                            if($input.val()){
                                var inputObj = JSON.parse($input.val());
                                var datas = inputObj.daysRegionList;
                                for(var i=0; i <datas.length; i++){
                                    var item = datas[i];
                                    var strInit = `<tr>
                                            <td>${item.minimumDay}</td>
                                            <td>${item.maximumDay}</td>
                                            <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="inventoryrulesDel(this)">删除</span></td>
                                        </tr>`;
                                    $tody.append(strInit);
                                };
                            }
                            $('#in_delayDaysRulesTable_tbody_add').on('click', function(){
                                var grt = $('[name=greatThanDelayDays]').val();
                                var lt = $('[name=lessThanDelayDays]').val();
                                if(!grt || !lt){
                                    layer.msg('不能新增空值');
                                    return;
                                }else{
                                    var str = `<tr>
                                        <td>${grt}</td>
                                        <td>${lt}</td>
                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="inventoryrulesDel(this)">删除</span></td>
                                    </tr>`;
                                    $tody.append(str);
                                    $('[name=greatThanDelayDays]').val('');
                                    $('[name=lessThanDelayDays]').val('');
                                }
                            });
                        });
                    },
                    yes: function(index, layero){
                        var $trs = $('#in_delayDaysRulesTable_tbody').find('tr');
                        var tdsArr = [];
                        var delayDays= {};
                        for(var i=0; i< $trs.length; i++){
                            var tr = $trs[i];
                            var obj= {};
                            obj.minimumDay = Number($(tr).find('td:first-child').text());
                            obj.maximumDay = Number($(tr).find('td:nth-child(2)').text());
                            tdsArr.push(obj);
                        };
                        delayDays.daysRegionList = tdsArr;
                        var rangerStr = '';
                        for(var j=0; j<tdsArr.length; j++){
                           var td = tdsArr[j];
                           rangerStr += `${td.minimumDay}至${td.maximumDay}天;`;
                        }
                        if(!rangerStr){
                            rangerStr = '延迟天数';
                        }
                        var displayContent=`${rangerStr}`;
                        $('[name=ztt-orderDelayDays-code]').val(JSON.stringify(delayDays));
                        $('[ztt-name=orderDelayDays]').find('a').html(displayContent);
                        layer.close(index);
                    }
                })
            }).catch(function(){
                layer.msg('查询失败,请稍后再试!');
            });
        },
        //表单提交事件
        search: function(){
            var _this = this;
            form.on('submit(inventoryrules_submit)', function(obj){
                var data = obj.field;
                data.status = eval(data.status) == undefined ?  '' : eval(data.status);
                _this.tableRender(data);
            })
            return _this;
        },
        //渲染表格
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#inventoryrules_table',
                method: 'post',
                url: '/lms/rule/inventory/occupation/query',
                where: data,
                page: true,
                id: "inventoryrules_tableId",
                limits: [50, 100, 200],
                limit: 50,
                cols: [
                    [
                        {title: '优先级',templet: '#inventoryrules_priority', width:60},
                        {title: '规则名称', field: 'ruleName', width: 100},
                        {title: '规则详情<b style="cursor:pointer;color:#428bca;" id="inventoryrules_expand">（+展开）</b>', field: 'ruleDetail',templet: '#inventoryrules_ruleDetail', field: 'inventoryrulesDetailContent'},
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
                        {title: '操作',toolbar: '#inventoryrules_tableIdBar', width: 80}
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
            table.on('tool(inventoryrules_tableFilter)',function(obj){
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
            var obj = data;
            obj.conditionArr = this.conditionData();
            this.commonLayerRender('编辑库存占用规则', obj);
        },
        //复制规则
        copyRule: function(data){
            var obj = data;
            obj.conditionArr = this.conditionData();
            delete obj.id;
            this.commonLayerRender('复制库存占用规则', obj);
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
                            $('[lay-filter=inventoryrules_submit]').trigger('click');
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
            layer.confirm('确定启用吗?',{icon: 3, title:'提示'}, function(index){
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
                            $('[lay-filter=inventoryrules_submit]').trigger('click');
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
            layer.confirm('确定停用吗?', {icon: 3, title:'提示'},function(index){
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
                            $('[lay-filter=inventoryrules_submit]').trigger('click');
                        }
                    },
                    error: function(){
                        loading.hide();
                    }
                })
            });
        },
        //展开事件
        expandDetail: function(){
            var tds = $('td[data-field=inventoryrulesDetailContent]');
            for(var i=0; i<tds.length; i++){
                var $item = $(tds[i]);
                var tdh = $item.find('.inventoryrulesDetailDiv').height();
                if(tdh > 146) {
                    var expandStr = `<div class="inventoryrules_expand"><b style="cursor:pointer;color:#428bca;"  class="inventoryrulesDetail_expand_single">+展开</b></div>`;
                    $item.append(expandStr);
                }
            };
            var $body = $('#inventoryrules_table').next().find('.layui-table-body.layui-table-main');
            $body.on('click', '.inventoryrulesDetail_expand_single', function(){
                var $this = $(this);
                var txt = $this.html();
                var $tar = $(this).parents('td').find('.inventoryrulesDetailDefault');
                if(txt == '+展开'){
                    $tar.removeClass('inventoryrulesDetailHidden').addClass('inventoryrulesDetailShow');
                    $this.html('-收缩');
                }else{
                    $tar.addClass('inventoryrulesDetailHidden').removeClass('inventoryrulesDetailShow');
                    $this.html('+展开');
                }
            });
        },
        expandDetailAll: function(){
            var $thExpand = $('#inventoryrules_expand');
            var tds = $('td[data-field=inventoryrulesDetailContent]'); 
            $thExpand.on('click', function(){
                var txt = $thExpand.html();
                if(txt == '（+展开）'){
                    $thExpand.html('（-收缩）');
                    for(var i=0; i< tds.length; i++){
                        var $tar = $(tds[i]).find('.inventoryrulesDetail_expand_single');
                        if($tar.html() == '+展开'){
                            $tar.trigger('click');
                        }
                    };
                }else{
                    $thExpand.html('（+展开）');
                    for(var i=0; i< tds.length; i++){
                        var $tar = $(tds[i]).find('.inventoryrulesDetail_expand_single');
                        if($tar.html() == '-收缩'){
                            $tar.trigger('click');
                        }
                    };
                }
            })
        },
        //公共弹框渲染(新增/编辑/复制)
        commonLayerRender: function(title, data){
            var _this = this;
            layer.open({
                type: 1,
                title: title,
                area: ['1100px', '700px'],
                btn: ['保存', '关闭'],
                content: $('#inventoryrules_newAddInventoryrules').html(),
                success: function(layero, index){
                    var getTpl = newAddInventoryrulesContainerTpl.innerHTML,
                    view = document.getElementById('newAddInventoryrulesContainer');
                    laytpl(getTpl).render(data, function(html){
                        view.innerHTML = html;
                        form.render();
                        _this.watchCks();
                    });
                    _this.initWareHouse(data.alternativeWarehouseIds)
                },
                yes: function(index, layero){
                    _this.yesDataHandle(layero).then(function(result){
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/lms/rule/inventory/occupation/save',
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
                                  $('[lay-filter=inventoryrules_submit]').trigger('click'); //初始化
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
        //弹框条件的初始化
        selectInit: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/rule/init',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data);
                        }else{
                            reject(res.msg);
                        };
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器出错');
                    }
                });
            });
        },
        //店铺初始化
        storeInit: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/sys/listAllPlatAccByRoleOrUser.html',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        resolve(res);
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器出错');
                    }
                });
            })
        },
        // 物流初始化
        logisticInit: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/rule/type/tree',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        resolve(res);
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器出错');
                    }
                });
            })
        },
        // 备用仓库
        getWarehouseAjax:function(){
            return commonReturnPromise({
                url: ctx + '/prodWarehouse/getAuthedProdWarehouse.html'
            })
        }
    };

    inventoryrulesName.search().newAddInventoryrules();
    $('[lay-filter=inventoryrules_submit]').trigger('click'); //初始化

    //优先级处理
    window.modifyInventoryrulesPriority = function(e,t){
        if(e.keyCode == 13){
            var val = $(t).val();
            var id = $(t).data('id');
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/rule/change/priority',
                data: {
                    id: id,
                    priorityLevel: val
                },
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        layer.msg(res.msg);
                    }else{
                        layer.msg(res.msg);
                    }
                },
                error: function(){
                    loading.hide();
                    layer.msg('服务器出错，请联系开发');
                }
            })
        }
    };
    //type verify
    $('#inventoryrules_content').on('input', '[ztt-verify=priority]', function(e){
        var val= e.target.value;
        var reg = /^\d+$/;
        if(!reg.test(val)){
            if(!$(e.target).hasClass('layui-form-danger')){
                $(e.target).addClass('layui-form-danger').focus();
                layer.msg('输入的内容不是正整数,请重新输入');
            }
        }else{
            $(e.target).removeClass('layui-form-danger').focus();
        }
    });

    window.inventoryrulesDel = function(obj){
        var tr = $(obj).parents('tr');
        $(tr).remove();
    };
})