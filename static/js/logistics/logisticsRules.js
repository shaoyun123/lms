layui.use(['admin','table','form','element','layer','laytpl','upload'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        upload = layui.upload,
        form = layui.form;
    form.render('select');
    //ruleConditionArr
    var ruleConditionArr = [
        {name: '国家/地区', key: 'allConditions',desc:'订单国家/地区为', val: 'country'},
        {name: '州/省', key: 'allConditions',desc:'订单州/省为', val: 'province'},
        {name: '城市', key: 'allConditions',desc:'订单城市为', val: 'city'},
        {name: '金额', key: 'allConditions',desc:'订单金额为', val: 'money'},
        {name: '平台', key: 'allConditions',desc:'订单平台为', val: 'platform'},
        {name: '店铺', key: 'allConditions',desc:'选中店铺为', val: 'store'},
        {name: '重量', key: 'allConditions',desc:'订单重量为', val: 'weight'},
        {name: '邮编(区间)', key: 'allConditions',desc:'订单邮编(区间)为', val: 'zipCode'},
        {name: '邮编(固定值)', key: 'allConditions',desc:'订单邮编(固定值)为', val: 'zipCodeNumber'},
        {name: '商品sku', key: 'allConditions',desc:'商品sku为',val:'goodsSku'},
        {name:'物流属性', key: 'allConditions',desc:'物流属性为',val:'logisticsAttribute'},
        // {name:'订单标签', key: 'allConditions',desc:'订单标签为', val: 'tags'},
        {name:'买家付运费', key: 'allConditions',desc:'订单运费为', val: 'buyerPayFreight'},
        {name:'订单延迟天数', key:'allConditions',desc:'订单延迟天数为', val: 'orderDelayDays'},
        {name:'店铺运输方式', key:'allConditions',desc:'店铺运输方式为', val: 'appointTransport'},
        {name:'商品数量', key:'allConditions',desc:'商品数量为', val: 'goodsNumber'},
        {name:'SKU数量', key:'allConditions',desc:'SKU数量为', val: 'goodsSkuNumber'},
        {name:'商品尺寸', key:'allConditions',desc:'商品尺寸为', val: 'goodsSize'},
        {name:'item_id', key:'allConditions',desc:'item_id为', val: 'itemId'},
        {name:'液体体积', key:'allConditions',desc:'液体体积为', val: 'liquidVolume'}
    ];
    const CompareSymbolObj = {
        1: "小于",
        2: "小于等于",
        3: "大于",
        4: "大于等于",
        5: "等于",
    }
    //define name of rules
    var ztt_logisticsRulesName = {
        newAdd: function(){ //add
            var _this = this;
            $('#logisticsRules_createRule').on('click', $.proxy(_this.createRule, _this));
        },
        newAddData: function(){ //default data for submit
            return this.selectInit().then(function(result){ // new promise and unlike before
                var data = {
                    typeComboBoxes: result.activeTypeComboBoxes,
                    countries: result.countries,
                    platformOptions: result.platformOptions,
                    moneyTypeOptions: result.moneyTypeOptions,
                    currencyOptions: result.currencyOptions,
                    attributeOptions: result.attributeOptions,
                    ruleOptions: result.ruleOptions,
                    warehouseComboBoxes: result.warehouseComboBoxes,
                    warehouseTypeOptions: result.warehouseTypeOptions,
                    ruleConditionArr: ruleConditionArr,
                    priority: '',
                    ruleName: '',
                    status: '',
                    logisticsTypeId: '',
                    warehouseId: '',
                    remark: ''
                };
                return data
            })
                .catch(function(reason){
                    layer.msg(reason);
                });
        },
        //仓库类型和仓库联动[data:仓库信息]
        selectRelated: function(data, layero){
            var _this = this;
            form.on('select(warehouseTypeFilter)', function(obj){
                var val = obj.value;
                var renderData = [];
                var boxesData = data.filter(function(item){
                    return item.warehouseType == val;
                });
                var $selectDom = layero.find('select[name=warehouseId]');
                var optionStr = '<option value>请选择</option>';
                for(var i=0;i<boxesData.length; i++){
                    var item = boxesData[i];
                    optionStr += `<option value="${item.id}">${item.name}</option>`;
                };
                $selectDom.html(optionStr);
                form.render('select');
            })
        },
        createRule: function(){
            var _this = this;
            this.newAddData().then(function(res){
                layer.open({
                    type: 1,
                    title: '新增物流规则',
                    area: ['1100px', '100%'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_createRulesLayer').html(),
                    id: 'logisticsRules_createRulesLayerID',
                    success: function(layero, index){
                        //render and display
                        var tpl = logisticsRules_createRules_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_createRules_container');
                        laytpl(tpl).render(res, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                            form.render('checkbox');
                            _this.watchCks();
                            _this.watchLi();
                            _this.selectRelated(res.warehouseComboBoxes,layero);
                        });
                    },
                    yes: function(index, layero){
                        _this.ruleAdd(layero).then(function(result){
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: '/lms/rule/save',
                                contentType: 'application/json',
                                data: JSON.stringify(result),
                                beforeSend: function(){
                                    if(!result.ruleName || !result.priority || !result.logisticsTypeId  || !result.warehouseType){
                                        layer.msg('规则名称/优先级/物流方式/仓库类型均不能为空!');
                                        return false;
                                    }
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        layer.msg(res.msg);
                                        layer.close(index);
                                        $('[lay-filter=logisticsRules_submit]').click();
                                    }else{
                                        layer.msg(res.msg);
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器出错,请联系开发');
                                }
                            })
                        })
                    }
                });
            });
        },
        ruleAdd: function(layero){ 
            return new Promise(function(resolve, reject){
                var obj = {};
                if(layero.find('[name=id]')){
                    obj.id = layero.find('[name=id]').val();
                }
                obj.ruleName = layero.find('[name=ruleName]').val(); //rule name
                obj.priority = layero.find('[name=priority]').val(); //priority
                obj.logisticsTypeId = layero.find('[name=logisticsTypeId]').val(); //logisticsTypeId
                obj.warehouseId = layero.find('[name=warehouseId]').val(); //warehouseId
                obj.warehouseType = layero.find('[name=warehouseType]').val();
                obj.remark = layero.find('[name=remark]').val(); //remark
                obj.status = true; // default enable when new add
                obj.detail = {};
                var countryAdd = $('[name=ztt-country-code]');
                var moneyAdd = $('[name=ztt-money-code]');
                var platformAdd = $('[name=ztt-platform-code]');
                var storeAdd = $('[name=ztt-store-code]');
                var weightAdd = $('[name=ztt-weight-code]');
                var goodsSkuAdd =$('[name=ztt-goodsSku-code]');
                var itemIdAdd = $('[name=ztt-itemId-code]');
                var attrAdd = $('[name=ztt-logisticsAttribute-code]');
                var buyerAdd = $('[name=ztt-buyerPayFreight-code]');
                var delayAdd = $('[name=ztt-orderDelayDays-code]');
                var transAdd = $('#ztt-appointTransport-code-span');
                var provinceAdd = $('#ztt-province-code-span');
                var cityAdd = $('#ztt-city-code-span');
                var goodsNumberAdd = $('[name=ztt-goodsNumber-code]');
                var goodsSkuNumberAdd = $('[name=ztt-goodsSkuNumber-code]');
                var goodsSizeAdd = $('[name=ztt-goodsSize-code]');
                var zipCodeAdd = $('[name=ztt-zipCode-code]');
                var zipCodeNumberAdd = $('[name=ztt-zipCodeNumber-code]');
                var liquidVolumeAdd = $('[name=ztt-liquidVolume-code]');
                if(zipCodeAdd.length){
                    if(!zipCodeAdd.val()){
                        obj.detail.country = {};
                    }else{
                        obj.detail.zipCode = JSON.parse(zipCodeAdd.val());
                    }
                }
                if(zipCodeNumberAdd.length){
                    if(!zipCodeNumberAdd.val()){
                        obj.detail.zipCodeNumber = {};
                    }else{
                        obj.detail.zipCodeNumber = JSON.parse(zipCodeNumberAdd.val());
                    }
                }
                if(countryAdd.length){
                    if(!countryAdd.val()){
                        obj.detail.country = {};
                    }else{
                        obj.detail.country = JSON.parse(countryAdd.val());
                    }
                }
                if(moneyAdd.length){
                    if(!moneyAdd.val()){
                        obj.detail.money = {};
                    }else{
                        obj.detail.money = JSON.parse(moneyAdd.val())
                    }
                }
                if(platformAdd.length){
                    if(!platformAdd.val()){
                        obj.detail.platform = {};
                    }else{
                        obj.detail.platform = JSON.parse(platformAdd.val());
                    }
                }
                if(storeAdd.length){
                    if(!storeAdd.val()){
                        obj.detail.store = {};
                    }else{
                        obj.detail.store = JSON.parse(storeAdd.val());
                    }
                }
                //液体体积
                if(liquidVolumeAdd.length){
                    if(!liquidVolumeAdd.val()){
                        obj.detail.liquidVolume = {};
                    }else{
                        obj.detail.liquidVolume = JSON.parse(liquidVolumeAdd.val());
                    }
                }
                if(weightAdd.length){
                  if(!weightAdd.val()){
                      obj.detail.weight = {};
                  }else{
                      obj.detail.weight = JSON.parse(weightAdd.val());
                  }
              }
                if(goodsSkuAdd.length){
                    if(!goodsSkuAdd.val()){
                        obj.detail.goodsSku = {};
                    }else{
                        obj.detail.goodsSku = JSON.parse(goodsSkuAdd.val());
                    }
                }
                if(itemIdAdd.length){
                    if(!itemIdAdd.val()){
                        obj.detail.itemId = {};
                    }else{
                        obj.detail.itemId = JSON.parse(itemIdAdd.val());
                    }
                }
                if(attrAdd.length){
                    if(!attrAdd.val()){
                        obj.detail.logisticsAttribute = {};
                    }else{
                        obj.detail.logisticsAttribute = JSON.parse(attrAdd.val());
                    }
                }
                if(buyerAdd.length){
                    if(!buyerAdd.val()){
                        obj.detail.buyerPayFreight = {};
                    }else{
                        obj.detail.buyerPayFreight = JSON.parse(buyerAdd.val());
                    }
                }
                if(delayAdd.length){
                    if(!delayAdd.val()){
                        obj.detail.orderDelayDays = {};
                    }else{
                        obj.detail.orderDelayDays = JSON.parse(delayAdd.val()) || {};
                    }
                }
                if(transAdd.length){
                    if(!transAdd.text()){
                        obj.detail.appointTransport = {};
                    }else{
                        obj.detail.appointTransport = JSON.parse(transAdd.text());
                    }
                }
                if(provinceAdd.length){
                    if(!provinceAdd.text()){
                        obj.detail.province = {};
                    }else{
                        obj.detail.province = JSON.parse(provinceAdd.text());
                    }
                }
                if(cityAdd.length){
                  if(!cityAdd.text()){
                      obj.detail.city = {};
                  }else{
                      obj.detail.city = JSON.parse(cityAdd.text());
                  }
              }
                if(goodsNumberAdd.length){
                    if(!goodsNumberAdd.val()){
                        obj.detail.goodsNumber = {};
                    }else{
                        obj.detail.goodsNumber = JSON.parse(goodsNumberAdd.val());
                    }
                }
                if(goodsSkuNumberAdd.length){
                    if(!goodsSkuNumberAdd.val()){
                        obj.detail.goodsSkuNumber = {};
                    }else{
                        obj.detail.goodsSkuNumber = JSON.parse(goodsSkuNumberAdd.val());
                    }
                }
                if(goodsSizeAdd.length){
                    if(!goodsSizeAdd.val()){
                        obj.detail.goodsSize = {};
                    }else{
                        obj.detail.goodsSize = JSON.parse(goodsSizeAdd.val());
                    }
                }
                resolve(obj);
            })
        },
        watchCks: function(){ // watch checkbox
            var _this = this;
            var $ul = $('#rulesLeftChooseCondition'); //container
            form.on('checkbox(allConditions)', function(obj){
                // console.log(obj);
                var title = obj.elem.title;
                var checked = obj.elem.checked;
                var desc = obj.elem.dataset.desc;
                var name = obj.elem.name;
                if(checked){
                    var str= `<li ztt-name="${name}">
                              <span>${desc}</span>
                              <a href="javascript:;" class="ztt-a">指定${title}</a>
                              <input type="hidden" name="ztt-${name}-code" value="">
                              <span id="ztt-${name}-code-span" class="disN"></span>
                            </li>`;
                    $ul.append(str);
                }else{
                    $ul.find(`li[ztt-name=${name}]`).remove();
                }
            });
        },
        watchLi:function(){ //watch li when click a
            var _this = this;
            var $ul = $('#rulesLeftChooseCondition'); //container
            $ul.on('click', 'a.ztt-a', function(e){
                var zttName= $(this).parent('li').attr('ztt-name');
                var preposition = zttName + 'Frame';
                _this[preposition]();
            });
        },
        //7.2加-商品数量
        goodsNumberFrame: function(){
            layer.open({
                type: 1,
                title: '商品数量',
                area: ['500px', '300px'],
                btn: ['保存', '关闭'],
                content: $('#logisticsRules_goodsNumberLayer').html(),
                id: 'logisticsRules_goodsNumberLayerId',
                success: function(layero, index){
                    var $input = $('[name=ztt-goodsNumber-code]');
                    var $val = $input.val();
                    if($val){
                        var inputObj = JSON.parse($val);
                        var $minNumber = inputObj.minNumber;
                        var $maxNumber = inputObj.maxNumber;
                        layero.find('[name=minNumber]').val($minNumber);
                        layero.find('[name=maxNumber]').val($maxNumber);
                    }
                },
                yes: function(index, layero){
                    var obj = {};
                    var $minNumber = Number(layero.find('[name=minNumber]').val());
                    var $maxNumber = Number(layero.find('[name=maxNumber]').val());
                    obj = {
                        minNumber: $minNumber,
                        maxNumber: $maxNumber,
                        typeCode: 'goodsNumber'
                    }
                    $('[name=ztt-goodsNumber-code]').val(JSON.stringify(obj));
                    var displayContent = `<b>商品数量范围为:</b>${$minNumber}至${$maxNumber}`;
                    $('[ztt-name=goodsNumber]').find('a').html(displayContent);
                    layer.close(index);
                }
            })
        },
        //7.2加-SKU数量
        goodsSkuNumberFrame: function(){
            layer.open({
                type: 1,
                title: 'SKU数量',
                area: ['500px', '300px'],
                btn: ['保存', '关闭'],
                content: $('#logisticsRules_goodsSkuNumberLayer').html(),
                id: 'logisticsRules_goodsSkuNumberLayerId',
                success: function(layero, index){
                    var $input = $('[name=ztt-goodsSkuNumber-code]');
                    var $val = $input.val();
                    if($val){
                        var inputObj = JSON.parse($val);
                        var $minNumber = inputObj.minNumber;
                        var $maxNumber = inputObj.maxNumber;
                        layero.find('[name=minNumber]').val($minNumber);
                        layero.find('[name=maxNumber]').val($maxNumber);
                    }
                },
                yes: function(index, layero){
                    var obj = {};
                    var $minNumber = Number(layero.find('[name=minNumber]').val());
                    var $maxNumber = Number(layero.find('[name=maxNumber]').val());
                    obj = {
                        minNumber: $minNumber,
                        maxNumber: $maxNumber,
                        typeCode: 'goodsSkuNumber'
                    }
                    $('[name=ztt-goodsSkuNumber-code]').val(JSON.stringify(obj));
                    var displayContent = `<b>SKU数量范围为:</b>${$minNumber}至${$maxNumber}`;
                    $('[ztt-name=goodsSkuNumber]').find('a').html(displayContent);
                    layer.close(index);
                }
            })
        },
        //7.2加-商品尺寸
        goodsSizeFrame: function(){
            // logisticsRules_goodsSizeLayer
            layer.open({
                type: 1,
                title: '商品尺寸',
                area: ['850px', '400px'],
                btn: ['保存', '关闭'],
                content: $('#logisticsRules_goodsSizeLayer').html(),
                id: 'logisticsRules_goodsSizeLayerId',
                success: function(layero,index){
                    var $input = $('[name=ztt-goodsSize-code]');
                    var $val = $input.val();
                    if($val){
                        var inputObj = JSON.parse($val);
                        var $region = inputObj.sizeRegionDtoList;
                        if($region.length){
                            for(var i=0; i<$region.length; i++){
                                var item = $region[i];
                                if(item.compareType == 1){
                                    $('#logisticsRules_goodsSize_single').prop('checked', true);
                                    layero.find('[name=width]').val(item.width);
                                    layero.find('[name=length]').val(item.length);
                                    layero.find('[name=height]').val(item.height);
                                    layero.find('[name=compareSymbolSingle]').val(item.compareSymbol);
                                }else if(item.compareType == 2){
                                    $('#logisticsRules_goodsSize_all').prop('checked', true);
                                    layero.find('[name=sum]').val(item.sum);
                                    layero.find('[name=compareSymbolAll]').val(item.compareSymbol);
                                }else if(item.compareType == 3){
                                    $('#logisticsRules_goodsSize_wytsize').prop('checked', true);
                                    layero.find('[name=wytWidth]').val(item.width);
                                    layero.find('[name=wytLength]').val(item.length);
                                    layero.find('[name=wytHeight]').val(item.height);
                                }
                            }
                        }
                    }
                    form.render('select', 'logisticsRules_goodsSizeFilter')
                    form.render('checkbox','logisticsRules_goodsSizeFilter');
                    //监听万邑通是否被选中8-13
                    form.on('checkbox(logisticsRules_goodsSize_wytFilter)', function(obj){
                        var $elem = layero.find(obj.elem);
                        var $wytCked = $elem.is(':checked');
                        var $singleCk = layero.find('#logisticsRules_goodsSize_single');
                        var $allCk = layero.find('#logisticsRules_goodsSize_all');
                        if($wytCked  && ($singleCk.is(':checked') || $allCk.is(':checked'))){
                            layer.msg('万邑通和直邮尺寸不能同时选择!',{icon:7, offset: '100px'});
                            $singleCk.prop('checked', false);
                            $allCk.prop('checked', false);
                            form.render('checkbox');
                        }
                    });
                    //监听直邮是否被选中8-13
                    form.on('checkbox(logisticsRules_goodsSize_filter)', function(obj){
                        var $elem = layero.find(obj.elem);
                        var $ckeds = $elem.is(':checked');
                        var $wytCk = layero.find('#logisticsRules_goodsSize_wytsize');
                        if($ckeds && ($wytCk.is(':checked'))){
                            layer.msg('万邑通和直邮尺寸不能同时选择!',{icon:7, offset: '100px'});
                            $wytCk.prop('checked', false);
                            form.render('checkbox');
                        }
                    });
                    // 直邮 长、宽、高的对比条件
                    form.on("select(logisticsRules_goodsSize_compareSymbol_single)", function (obj) {
                        const { value: val } = obj
                        // 长宽高暂时不允许单独设置
                        layero.find('select[name="compareSymbolSingle"]').each(function () {
                            $(this).val(val)
                        })
                        form.render("select", "logisticsRules_goodsSizeFilter")
                    })
                },
                yes: function(index,layero){
                    var singleCks = $('#logisticsRules_goodsSize_single');
                    var allCks = $('#logisticsRules_goodsSize_all');
                    var wytCks = $('#logisticsRules_goodsSize_wytsize');
                    var sizeRegionArr = [];
                    var singleObj = {};
                    var allObj = {};
                    var wytObj = {};
                    var displayContent = '<b>商品尺寸为:</b>';
                    if(singleCks.is(':checked')){
                        singleObj.compareType = 1;
                        singleObj.width = layero.find('[name=width]').val();
                        singleObj.length = layero.find('[name=length]').val();
                        singleObj.height = layero.find('[name=height]').val();
                        singleObj.compareSymbol = layero.find('[name=compareSymbolSingle]').val();
                        const compareSymbolStr = CompareSymbolObj[singleObj.compareSymbol]
                        sizeRegionArr.push(singleObj);
                        displayContent +=`长${compareSymbolStr}${singleObj.length}cm,宽${compareSymbolStr}${singleObj.width}cm,高${compareSymbolStr}${singleObj.height}cm;`;
                    }
                    if(allCks.is(':checked')){
                        allObj.compareType = 2;
                        allObj.sum = layero.find('[name=sum]').val();
                        allObj.compareSymbol = layero.find('[name=compareSymbolAll]').val();
                        const compareSymbolStr = CompareSymbolObj[allObj.compareSymbol]
                        sizeRegionArr.push(allObj);
                        displayContent += `长宽高之和${compareSymbolStr}${allObj.sum}cm;`
                    }
                    if(wytCks.is(':checked')){
                        wytObj.compareType = 3;
                        wytObj.width = layero.find('[name=wytWidth]').val();
                        wytObj.length = layero.find('[name=wytLength]').val();
                        wytObj.height = layero.find('[name=wytHeight]').val();
                        wytObj.compareSymbol = 1
                        sizeRegionArr.push(wytObj);
                        displayContent +=`万邑通长小于${wytObj.length}cm,万邑通宽小于${wytObj.width}cm,万邑通高小于${wytObj.height}cm;`;
                    }
                    var obj = {
                        sizeRegionDtoList: sizeRegionArr,
                        typeCode: 'goodsSize'
                    }
                    $('[name=ztt-goodsSize-code]').val(JSON.stringify(obj));
                    $('[ztt-name=goodsSize]').find('a').html(displayContent);
                    layer.close(index);
                }
            })
        },
        zipCodeNumberFrame: function(){ // success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '邮编(固定值)',
                    area: ['500px', '400px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_zipCodeNumberLayer').html(),
                    id: 'logisticsRules_zipCodeNumberLayerId',
                    success: function(layero, index){
                        $(layero).find('[name=zipCodeNumberTextarea]').val($('[name=ztt-zipCodeNumber-code]').val()?JSON.parse($('[name=ztt-zipCodeNumber-code]').val()).zipCodeNumberStrList.join(","):'')
                    },
                    yes: function(index, layero){
                        var zipCodeNumberStrList = $(layero).find('[name=zipCodeNumberTextarea]').val().split(",");
                        var zipCodeNumber= {};
                        zipCodeNumber.zipCodeNumberStrList = zipCodeNumberStrList;
                        zipCodeNumber.typeCode = 'zipCodeNumber';
                        var displayContent=`<b>指定邮编(固定值):</b>${zipCodeNumberStrList.join(';')}`;
                        $('[name=ztt-zipCodeNumber-code]').val(JSON.stringify(zipCodeNumber));
                        $('[ztt-name=zipCodeNumber]').find('a').html(displayContent);
                        layer.close(index);
                    }
                })
            });
        },
        //10.12加-邮编
        zipCodeFrame:function(){
            layer.open({
                type: 1,
                title: '邮编',
                area: ['500px', '500px'],
                btn: ['保存', '关闭'],
                content: $('#logisticsRules_zipCodeLayer').html(),
                id: 'logisticsRules_zipCodeLayerId',
                success: function(layero,index){
                    var tpl = logisticsRules_zipCode_containerTpl.innerHTML;
                    var tplContainer= document.getElementById('logisticsRules_zipCode_container');
                    laytpl(tpl).render({}, function(html){
                        tplContainer.innerHTML = html;
                    });
                    var $tbody = $('#zipCodeRulesTable_tbody');
                    var $input = $('[name=ztt-zipCode-code]');
                    if($input.val()){
                        var inputObj = JSON.parse($input.val() || '{}');
                        var datas = inputObj.zipCodeRegionDtoList;
                        for(var i=0; i<datas.length; i++){
                            var item = datas[i];
                            var strInit = `<tr>
                                <td>${item.zipCodeBegin}</td>
                                <td>${item.zipCodeEnd}</td>
                                <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                            </tr>`;
                            $tbody.append(strInit);
                        };
                    };
                    $('#zipCodeRulesTable_tbody_add').on('click', function(){
                        var grt = $('[name=greatThanzipCode]').val();
                        var lt = $('[name=lessThanzipCode]').val();
                        if(!grt || !lt){
                            layer.msg('不能新增空值');
                            return;
                        }else{
                            // var reg = /^\d+(\-*\d*)$/;
                            var reg = /^[0-9|\s|A-Z|-]+$/;
                            if(!reg.test(grt)){
                                return layer.msg('最小值只能包含数字、空格、字母和-!',{icon:7});
                            }
                            if(!reg.test(lt)){
                                return layer.msg('最大值只能包含数字、空格、字母和-!',{icon:7});
                            }
                            var str = `<tr>
                                <td>${grt}</td>
                                <td>${lt}</td>
                                <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                            </tr>`;
                            $tbody.append(str);
                            $('[name=greatThanzipCode]').val('');
                            $('[name=lessThanzipCode]').val('');
                        }
                    });
                },
                yes: function(index,layero){
                    var $trs = $('#zipCodeRulesTable_tbody').find('tr');
                    var zipCodeRegionDtoList= [];
                    var zipCode= {};
                    for(var i=0; i< $trs.length; i++){
                        var tr = $trs[i];
                        var obj= {};
                        obj.zipCodeBegin = $(tr).find('td:first-child').text();
                        obj.zipCodeEnd = $(tr).find('td:nth-child(2)').text();
                        zipCodeRegionDtoList.push(obj);
                    };
                    zipCode.zipCodeRegionDtoList = zipCodeRegionDtoList;
                    zipCode.typeCode = 'zipCode';
                    var rangerStr = '';
                    for(var j=0; j<zipCodeRegionDtoList.length; j++){
                        var td = zipCodeRegionDtoList[j];
                        rangerStr += `${td.zipCodeBegin}至${td.zipCodeEnd};`;
                    }
                    var displayContent=`<b>指定邮编(区间):</b>${rangerStr}`;
                    $('[name=ztt-zipCode-code]').val(JSON.stringify(zipCode));
                    $('[ztt-name=zipCode]').find('a').html(displayContent);
                    layer.close(index);
                }
            });
        },
        //20230920批量添加sku
        importSkuHandle(){
          let _this = this;
          $('#logisticsRules_batchImportSkuBtn').on('click', function(){
            let cks = table.checkStatus('logisticsRules_tableId').data;
            if(!cks.length){
                return layer.msg('请先选中至少一条数据', {icon:7});
            }
            //获取到每条数据详情SKU状态exclude[包含false/排除true]
            let excludesArr = [];
            let emptySkusName = [];
            cks.forEach(item => {
              if(item.detail && item.detail.goodsSku){
                excludesArr.push(item.detail.goodsSku.exclude);
              }else{
                emptySkusName.push(item.ruleName);
                excludesArr.push('');
              }
            });
            if(emptySkusName.length > 0){
              return layer.alert(`${emptySkusName.join(',')},不存在商品SKU规则,请先配置商品SKU规则!`);
            }
            if(new Set(excludesArr).size != 1){
              //获取规则名称
              let rulesName = cks.map(item => item.ruleName).join(',');
              return layer.alert(`${rulesName},排除/包含SKU规则不统一,请先统一规则模板`);
            }
            //弹框操作
            layer.open({
              type: 1,
              title: excludesArr[0] == true ? '排除以下SKU': '包含以下SKU',
              area: ['40%', '60%'],
              btn: ['保存', '关闭'],
              content: $('#logisticsRules_batchImportSkuLayer').html(),
              id: 'logisticsRules_batchImportSkuLayerId',
              yes: function(index,layero){
                let tareaVal =layero.find("textarea[name=sSku]").val().trim();
                if(!tareaVal){
                  layer.msg('请输入SKU', {icon:7});
                }else{
                  let sSkusArry = tareaVal.split('\n');
                  let ruleIdList = cks.map(item => item.id);
                  commonReturnPromise({
                    url: '/lms/rule/batchUpdateSku',
                    type: 'post',
                    contentType: 'application/json',
                    params: JSON.stringify({
                      ruleIdList: ruleIdList,
                      skuList: sSkusArry,
                      excludeFlag: excludesArr[0]
                    })
                  }).then(res => {
                    layer.close(index);
                    layer.msg(res ||'保存成功', {icon:1});
                    $('[lay-filter=logisticsRules_submit]').click();
                  });
                }
              }
            })
          });
        },
        //11.5加-导入邮编
        importZipCode: function(){ //上传功能
            upload.render({
                elem: '#logisticsRules_importZipCode' //绑定元素
                ,url: `${ctx}/type/uploadZipCodeCharging` //上传接口
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
        countryFrame: function(){ //Elastic frame of countries
            var _this = this;
            this.selectInit().then(function(result){
                var countries = result.countries;
                layer.open({
                    type: 1,
                    title: '选择国家或区域',
                    area: ['1100px', '700px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_countryLayer').html(),
                    id: 'logisticsRules_countryLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_country_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_country_container');
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
                        $('[name=ztt-country-code]').val(JSON.stringify({exclude:ckedEx,shippingCountryCode: codeArr}));
                        $('[ztt-name=country]').find('a').html(displayContent);
                        layer.close(index);
                    }
                })
            }).catch(function(reason){
                layer.msg('查询失败,请稍后再试!');
            });
        },
        watchAllCksCountry: function(){ // watch country is  all select
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
        watchSingleCksCountry: function(){ // watch country is single select
            form.on('checkbox(conditionCountriesFilter)', function(obj){
                var cked = obj.elem.checked;
                var title = obj.elem.title;
                var name = obj.elem.name.split('&')[0];
                var $selectCondition = $('.country_countainer_selected_content');
                if(cked){
                    var $input= `<input type="checkbox" title="${title}" name="${name}" lay-skin="primary" lay-filter="selectedCondition" checked>`;
                    // 列表对应的国家也选上
                    $(`input[name='${obj.elem.name}']`).attr("checked", true)
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
            $('#logisticsRules_country_container').on('keydown', '[name=country_search]', function(e){
                var targetForm = $('.allCountrySearchContainer').find('.layui-form');
                var $selectCondition = $(".country_countainer_selected_content")
                // 已选中的值
                let checkedList = []
                $selectCondition.find("input").each(function () {
                    let curName = $(this).attr("name").split("&auto")[0]
                    checkedList.push(curName)
                })
                if(e.keyCode == 13){
                    if(e.target.value){
                        $('.allCountryContainer').addClass('disN');
                        $('.allCountrySearchContainer').removeClass('disN');
                        targetForm.html('');
                        var valArr = e.target.value.replace(/，/g, ",").replace(/\s+/g, "").split(',');
                        for(var j=0; j<valArr.length; j++){
                            var transVal = valArr[j].toUpperCase();
                            console.log(transVal);
                            if(cnArr.indexOf(transVal)>-1 || enArr.indexOf(transVal)>-1){
                                var k = cnArr.indexOf(transVal) >-1 ? cnArr.indexOf(transVal) : enArr.indexOf(transVal)
                                var combinationStr = cnArr[k] + "(" + enArr[k] + ")"
                                // 避免选中的国家 出现相同的国家  判断当前输入的数据是否与选中的国家有相同的数据，相同的话，则需要选上
                                let curCheckedCountry = checkedList.filter((item) => item == enArr[k])
                                var str = `<input type="checkbox" title="${combinationStr}" name="${
                                    enArr[k]
                                }&auto" lay-skin="primary" ${
                                    curCheckedCountry.length ? "checked=checked" : ""
                                }lay-filter="conditionCountriesFilter">`
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
            // 根据输入框的值，全选下面的值
            $("#logisticsRules_country_checkSelect_btn").click(function () {
                var countryList = $("#logisticsRules_country_container")
                    .find("input[name=country_search]")
                    .val().replace(/，/g, ",").replace(/\s+/g, "")
                    .split(",")
                var $selectCondition = $(".country_countainer_selected_content")
                // 已选中的值
                let checkedList = []
                $selectCondition.find("input").each(function () {
                    let curName = $(this).attr("name").split("&auto")[0]
                    checkedList.push(curName)
                })
                for (var j = 0; j < countryList.length; j++) {
                    var transVal = countryList[j].toUpperCase()
                    console.log(transVal)
                    if (cnArr.indexOf(transVal) > -1 || enArr.indexOf(transVal) > -1) {
                        var k =
                            cnArr.indexOf(transVal) > -1
                                ? cnArr.indexOf(transVal)
                                : enArr.indexOf(transVal)
                        let name = enArr[k] + "&auto"
                        let title = cnArr[k]
                        $(`input[name='${name}']`).attr("checked", true)
                        // 避免选中的国家 出现相同的国家  判断当前输入的数据是否与选中的国家有相同的数据，如果相同的话，则不需要加到选中国家的列表中
                        let curCheckedCountry = checkedList.filter(
                            (item) => item == enArr[k]
                        )
                        if (!curCheckedCountry.length) {
                            var $input = `<input type="checkbox" title="${title}" name="${enArr[k]}" lay-skin="primary" lay-filter="selectedCondition" checked>`
                            $selectCondition.append($input)
                        }
                    }
                }
                form.render("checkbox")
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
        moneyFrame: function(){ // success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '金额',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_moneyLayer').html(),
                    id: 'logisticsRules_moneyLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_money_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_money_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                        });
                        var $tbody = $('#moneyRulesTable_tbody');
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
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                </tr>`;
                                $tbody.append(strInit);
                            };
                            $('[name=currency]').val(currency);
                            $('[name=moneyType]').val(moneyType);
                            form.render('select');
                        }
                        $('#moneyRulesTable_tbody_add').on('click', function(){
                            var grt = Number($('[name=greatThanMoney]').val());
                            var lt = Number($('[name=lessThanMoney]').val());
                            if($('[name=greatThanMoney]').val()==='' || $('[name=lessThanMoney]').val()===''){
                                layer.msg('不能新增空值');
                                return;
                            }else if(grt<0 || lt<0){
                                layer.msg('不能新增负值')
                            }else if(grt > lt){
                                layer.msg('后一个输入框的值不应小于前面');
                                return;
                            }else{
                                var str = `<tr>
                                    <td>${grt}</td>
                                    <td>${lt}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
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
                        var $trs = $('#moneyRulesTable_tbody').find('tr');
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
        platformFrame: function(){ // success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '平台',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_platformLayer').html(),
                    id: 'logisticsRules_platformLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_platform_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_platform_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('checkbox');
                        });
                        var $input = $('[name=ztt-platform-code]');
                        if($input.val()){
                            var inputObj = JSON.parse($input.val());
                            var datas = inputObj.platformCode;
                            for(var i=0; i<datas.length; i++){
                                var item = datas[i];
                                $(`input[value=${item}]`).attr('checked', true);
                            };
                            form.render('checkbox');
                        }

                    },
                    yes: function(index, layero){
                        var checkboxes = $('#logisticsRules_platform_container').find('input[type=checkbox]');
                        var ckesArr = [];
                        for(var i=0; i<checkboxes.length; i++){
                            var item = checkboxes[i];
                            if($(item).is(':checked')){
                                ckesArr.push($(item).val());
                            }
                        };
                        var rangerStr='<b>指定平台:</b>';
                        for(var j=0; j<ckesArr.length; j++){
                            var item = ckesArr[j];
                            rangerStr += `${item};`;
                        };
                        $('[name=ztt-platform-code]').val(JSON.stringify({platformCode: ckesArr}));
                        $('[ztt-name=platform]').find('a').html(rangerStr);
                        layer.close(index);
                    }
                })
            });
        },
        storeFrame: function(){
            var _this = this
            this.storeInit().then(function (result) {

                let storeAcctIdList = []
                var $input = $("[name=ztt-store-code]")
                if ($input.val()) {
                    //   选中的数据
                    storeAcctIdList = JSON.parse($input.val()).storeAcctId
                }
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
                layer.open({
                    type: 1,
                    title: "店铺",
                    area: ["580px", "660px"],
                    btn: ["保存", "关闭"],
                    content: $("#logisticsRules_storeLayer").html(),
                    id: "logisticsRules_storeLayerId",
                    success: function (layero, index) {
                        logisticsRuleXmselect = xmSelect.render({
                            el: "#logisticsRuleXTree",
                            toolbar: {
                                show: true,
                            },
                            height: "350px",
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
                    yes: function (index, layero) {
                        var storeContent = "<b>选中的店铺:</b>"
                        var selectArr = logisticsRuleXmselect.getValue()
                        var storesArr = selectArr.map((item) => item.value)
                        var storeContentArr = selectArr.map((item) => item.name)
                        storeContent += storeContentArr.join("、")
                        $("[name=ztt-store-code]").val(
                            JSON.stringify({ storeAcctId: storesArr })
                        )
                        $("[ztt-name=store]").find("a").html(storeContent)
                        layer.close(index)
                    },
                })
            })
        },
        weightFrame: function(){ //success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '重量',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_weightLayer').html(),
                    id: 'logisticsRules_weightLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_weight_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_weight_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                        });
                        var $tbody = $('#weightRulesTable_tbody');
                        var $input = $('[name=ztt-weight-code]');
                        if($input.val()){
                            var inputObj = JSON.parse($input.val());
                            var datas = inputObj.weightRegionList;
                            for(var i=0; i<datas.length; i++){
                                var item = datas[i];
                                var strInit = `<tr>
                                    <td>${item.minimumWeight}</td>
                                    <td>${item.maximumWeight}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                </tr>`;
                                $tbody.append(strInit);
                            };
                        };
                        $('#weightRulesTable_tbody_add').on('click', function(){
                            var grt = Number($('[name=greatThanWeight]').val());
                            var lt = Number($('[name=lessThanWeight]').val());
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
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                </tr>`;
                                $tbody.append(str);
                                $('[name=greatThanWeight]').val('');
                                $('[name=lessThanWeight]').val('');
                            }
                        });
                    },
                    yes: function(index, layero){
                        var $trs = $('#weightRulesTable_tbody').find('tr');
                        var weightRegionList = [];
                        var weight= {};
                        for(var i=0; i< $trs.length; i++){
                            var tr = $trs[i];
                            var obj= {};
                            obj.minimumWeight = Number($(tr).find('td:first-child').text());
                            obj.maximumWeight = Number($(tr).find('td:nth-child(2)').text());
                            weightRegionList.push(obj);
                        };
                        weight.weightRegionList = weightRegionList;
                        var rangerStr = '';
                        for(var j=0; j<weightRegionList.length; j++){
                            var td = weightRegionList[j];
                            rangerStr += `${td.minimumWeight}g至${td.maximumWeight}g;`;
                        }
                        var displayContent=`<b>重量范围:</b>${rangerStr}`;
                        $('[name=ztt-weight-code]').val(JSON.stringify(weight));
                        $('[ztt-name=weight]').find('a').html(displayContent);
                        layer.close(index);
                    }
                })
            }).catch(function(reason){
                layer.msg('查询失败,请稍后再试!');
            });
        },
        goodsSkuFrame: function(){ // success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '商品SKU',
                    area: ['1000px', '800px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_goodsSkuLayer').html(),
                    id: 'logisticsRules_goodsSkuLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_goodsSku_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_goodsSku_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('radio');
                        });
                        var $input = $('[name=ztt-goodsSku-code]');
                        if($input.val()){
                            var inputObj = JSON.parse($input.val());
                            var radioNameCked = inputObj.exclude;
                            var goodsSku = inputObj.goodsSku;
                            $('#logisticsRules_goodsSku_container').find(`input:radio[value=${radioNameCked}]`).prop('checked',true);
                            $('#logisticsRules_goodsSku_container').find('[name=goodsSkuTextarea]').val(goodsSku.join(','));
                            form.render('radio');
                        }
                        _this.skuSearchAndDelete(layero);
                    },
                    yes: function(index, layero){
                        var checkedVal = $('[name=goodsSkuRadio]:checked').val();
                        var areaVal = $('[name=goodsSkuTextarea]').val();
                        if(areaVal.indexOf('，') > -1){
                            layer.msg('仅允许使用英文逗号！', {icon:7});
                            return;
                        }
                        if(areaVal.trim().length ==0){
                          return layer.msg('输入的SKU不能为空', {icon:7})
                        }
                        if(checkedVal== 'true'){
                            var displayContent = `<b>排除已选sku:</b>${areaVal}`;
                        }else if(checkedVal== 'false'){
                            var displayContent = `<b>指定已选sku:</b>${areaVal}`;
                        };
                        $('[ztt-name=goodsSku]').find('a').html(displayContent);
                        $('[name=ztt-goodsSku-code]').val(JSON.stringify({exclude: checkedVal,goodsSku:areaVal.split(',')}));
                        layer.close(index);
                    }
                })
            });
        },
        // 指定itemId
        itemIdFrame: function(){ // success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: 'item_id',
                    area: ['1000px', '800px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_itemIdLayer').html(),
                    // id: 'logisticsRules_goodsSkuLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_itemId_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_itemId_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('radio');
                        });
                        var $input = $('[name=ztt-itemId-code]');
                        if($input.val()){
                            var inputObj = JSON.parse($input.val());
                            var radioNameCked = inputObj.exclude;
                            var itemId = inputObj.itemIdList;
                            $('#logisticsRules_itemId_container').find(`input:radio[value=${radioNameCked}]`).prop('checked',true);
                            $('#logisticsRules_itemId_container').find('[name=itemIdTextarea]').val(itemId.join(','));
                            form.render('radio');
                        }
                        _this.itemIdSearchAndDelete(layero);
                    },
                    yes: function(index, layero){
                        var checkedVal = $('[name=itemIdRadio]:checked').val();
                        var areaVal = $('[name=itemIdTextarea]').val();
                        if(areaVal.indexOf('，') > -1){
                            layer.msg('仅允许使用英文逗号！');
                            return;
                        }
                        // console.log(Object.prototype.toString.call(checkedVal));
                        if(checkedVal== 'true'){
                            var displayContent = `<b>排除已选item_id:</b>${areaVal}`;
                        }else if(checkedVal== 'false'){
                            var displayContent = `<b>指定已选item_id:</b>${areaVal}`;
                        };
                        $('[ztt-name=itemId]').find('a').html(displayContent);
                        $('[name=ztt-itemId-code]').val(JSON.stringify({exclude: checkedVal,itemIdList:areaVal.split(','),typeCode: 'itemId'}));
                        layer.close(index);
                    }
                })
            });
        },
        logisticsAttributeFrame: function(){ //success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '物流属性',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_attrLayer').html(),
                    id: 'logisticsRules_attrLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_attr_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_attr_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('checkbox');
                        });
                        var $input = $('[name=ztt-logisticsAttribute-code]');
                        if($input.val()){
                            var inputObj = JSON.parse($input.val());
                            var datas =inputObj.logisticsAttribute;
                            for(var i=0; i<datas.length; i++){
                                var title= datas[i];
                                $(`input[title="${title}"]`).attr('checked', true);
                            };
                        };
                        form.render('checkbox');
                    },
                    yes: function(index, layero){
                        var checkboxes = $('#logisticsRules_attr_container').find('input[type=checkbox]');
                        var titleArr = [];
                        for(var i=0; i<checkboxes.length; i++){
                            var item = checkboxes[i];
                            if($(item).is(':checked')){
                                var name =$(item).attr('title');
                                titleArr.push(name);
                            }
                        };
                        var rangerStr='<b>指定物流属性:</b>';
                        var str = titleArr.join('、');
                        rangerStr += str;
                        $('[name=ztt-logisticsAttribute-code]').val(JSON.stringify({logisticsAttribute: titleArr}));
                        $('[ztt-name=logisticsAttribute]').find('a').html(rangerStr);
                        layer.close(index);
                    }
                })
            });
        },
        buyerPayFreightFrame: function(){ //success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '买家付运费',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_buyerLayer').html(),
                    id: 'logisticsRules_buyerLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_buyer_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_buyer_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                        });
                        var $tbody = $('#buyerRulesTable_tbody');
                        var $input = $('[name=ztt-buyerPayFreight-code]');
                        if($input.val()){
                            var inputObj = JSON.parse($input.val());
                            var currency = inputObj.currency;
                            var datas = inputObj.buyerPayFreightRegion;
                            for(var i=0; i<datas.length; i++){
                                var item = datas[i];
                                var strInit = `<tr>
                                    <td>${item.minimumCharge}</td>
                                    <td>${item.maximumCharge}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                </tr>`;
                                $tbody.append(strInit);
                            };
                            $('[name=currency]').val(currency);
                            form.render('select');
                        };
                        $('#buyerRulesTable_tbody_add').on('click', function(){
                            var grt = $('[name=greatThanBuyer]').val();
                            var lt = $('[name=lessThanBuyer]').val();
                            if(!grt || !lt){
                                layer.msg('不能新增空值');
                                return;
                            }else{
                                var str = `<tr>
                                    <td>${grt}</td>
                                    <td>${lt}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                </tr>`;
                                $tbody.append(str);
                                $('[name=greatThanBuyer]').val('');
                                $('[name=lessThanBuyer]').val('');
                            }
                        });
                    },
                    yes: function(index, layero){
                        var currencyVal = $('[name=currency] option:selected').val();
                        var currencyTxt = $('[name=currency] option:selected').text();
                        var $trs = $('#buyerRulesTable_tbody').find('tr');
                        var tdsArr = [];
                        for(var i=0; i<$trs.length; i++){
                            var tr = $trs[i];
                            var obj= {};
                            obj.minimumCharge = Number($(tr).find('td:first-child').text());
                            obj.maximumCharge = Number($(tr).find('td:nth-child(2)').text());
                            tdsArr.push(obj);
                        }
                        var buyer = {};
                        buyer.currency = currencyVal;
                        buyer.buyerPayFreightRegion = tdsArr;
                        $('[name=ztt-buyerPayFreight-code]').val(JSON.stringify(buyer));
                        var rangerStr = '';
                        for(var j=0; j< tdsArr.length; j++){
                            var td = tdsArr[j];
                            rangerStr += `${td.minimumCharge}至${td.maximumCharge};`;
                        };
                        var displayContent = `<b>币种:</b>${currencyTxt};<b>范围:</b>${rangerStr}`;
                        $('[ztt-name=buyerPayFreight]').find('a').html(displayContent);
                        layer.close(index);
                    }
                });
            }).catch(function(){
                layer.msg('查询失败,请稍后再试!');
            });
        },
        tagsFrame: function(){ // give up temporarily
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '订单标签',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_tagsLayer').html(),
                    id: 'logisticsRules_tagsLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_tags_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_tags_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                        });
                    },
                    yes: function(index, layero){
                        //   console.log(layero);
                    }
                })
            });
        },
        orderDelayDaysFrame: function(){ //success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '订单延迟天数',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_delayDaysLayer').html(),
                    id: 'logisticsRules_delayDaysLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_delayDays_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_delayDays_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                            $('#logisticsRules_delayDays_container').on('input', '[ztt-verify=delayDays]', function(e){
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
                            var $tody = $('#delayDaysRulesTable_tbody');
                            if($input.val()){
                                var inputObj = JSON.parse($input.val());
                                var datas = inputObj.daysRegionList;
                                for(var i=0; i <datas.length; i++){
                                    var item = datas[i];
                                    var strInit = `<tr>
                                            <td>${item.minimumDay}</td>
                                            <td>${item.maximumDay}</td>
                                            <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                        </tr>`;
                                    $tody.append(strInit);
                                };
                            }
                            $('#delayDaysRulesTable_tbody_add').on('click', function(){
                                var grt = $('[name=greatThanDelayDays]').val();
                                var lt = $('[name=lessThanDelayDays]').val();
                                if(!grt || !lt){
                                    layer.msg('不能新增空值');
                                    return;
                                }else{
                                    var str = `<tr>
                                        <td>${grt}</td>
                                        <td>${lt}</td>
                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                    </tr>`;
                                    $tody.append(str);
                                    $('[name=greatThanDelayDays]').val('');
                                    $('[name=lessThanDelayDays]').val('');
                                }
                            });
                        });
                    },
                    yes: function(index, layero){
                        var $trs = $('#delayDaysRulesTable_tbody').find('tr');
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
                        var displayContent=`<b>延迟范围:</b>${rangerStr}`;
                        $('[name=ztt-orderDelayDays-code]').val(JSON.stringify(delayDays));
                        $('[ztt-name=orderDelayDays]').find('a').html(displayContent);
                        layer.close(index);
                    }
                })
            }).catch(function(){
                layer.msg('查询失败,请稍后再试!');
            });
        },
        //液体体积
        liquidVolumeFrame: function(){ //success
          var _this = this;
          this.selectInit().then(function(result){
              layer.open({
                  type: 1,
                  title: '液体体积',
                  area: ['500px', '500px'],
                  btn: ['保存', '关闭'],
                  content: $('#logisticsRules_liquidVolumeLayer').html(),
                  id: 'logisticsRules_liquidVolumeLayerId',
                  success: function(layero, index){
                      var tpl = logisticsRules_liquidVolume_containerTpl.innerHTML;
                      var tplContainer= document.getElementById('logisticsRules_liquidVolume_container');
                      laytpl(tpl).render(result, function(html){
                          tplContainer.innerHTML = html;
                          form.render('select');
                          $('#logisticsRules_liquidVolume_container').on('input', '[ztt-verify=liquidVolume]', function(e){
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
                          var $input = $('[name=ztt-liquidVolume-code]');
                          var $tody = $('#liquidVolumeRulesTable_tbody');
                          if($input.val()){
                              var inputObj = JSON.parse($input.val());
                              var datas = inputObj.orderRuleSimpleCompareDtoList;
                              for(var i=0; i <datas.length; i++){
                                  var item = datas[i];
                                  var strInit = `<tr>
                                          <td>${item.minNumber}</td>
                                          <td>${item.maxNumber}</td>
                                          <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                      </tr>`;
                                  $tody.append(strInit);
                              };
                          }
                          $('#liquidVolumeRulesTable_tbody_add').on('click', function(){
                              var grt = $('[name=greatThanLiquidVolume]').val();
                              var lt = $('[name=lessThanLiquidVolume]').val();
                              if(!grt || !lt){
                                  layer.msg('不能新增空值');
                                  return;
                              }else{
                                  var str = `<tr>
                                      <td>${grt}</td>
                                      <td>${lt}</td>
                                      <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                  </tr>`;
                                  $tody.append(str);
                                  $('[name=greatThanLiquidVolume]').val('');
                                  $('[name=lessThanLiquidVolume]').val('');
                              }
                          });
                      });
                  },
                  yes: function(index, layero){
                      var $trs = $('#liquidVolumeRulesTable_tbody').find('tr');
                      var tdsArr = [];
                      var liquidVolumes= {};
                      for(var i=0; i< $trs.length; i++){
                          var tr = $trs[i];
                          var obj= {};
                          obj.minNumber = Number($(tr).find('td:first-child').text());
                          obj.maxNumber = Number($(tr).find('td:nth-child(2)').text());
                          tdsArr.push(obj);
                      };
                      liquidVolumes.orderRuleSimpleCompareDtoList = tdsArr;
                      var rangerStr = '';
                      for(var j=0; j<tdsArr.length; j++){
                          var td = tdsArr[j];
                          rangerStr += `${td.minNumber}至${td.maxNumber};`;
                      }
                      var displayContent=`<b>液体体积为:</b>${rangerStr}`;
                      $('[name=ztt-liquidVolume-code]').val(JSON.stringify(liquidVolumes));
                      $('[ztt-name=liquidVolume]').find('a').html(displayContent);
                      layer.close(index);
                  }
              })
          }).catch(function(){
              layer.msg('查询失败,请稍后再试!');
          });
        },
        appointTransportFrame: function(){ // success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '店铺运输方式',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_transportLayer').html(),
                    id: 'logisticsRules_transportLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_transport_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_transport_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                        });
                        var $tbody = $('#transportRulesTable_tbody');
                        var $input = $('#ztt-appointTransport-code-span');
                        if($input.text()){
                            var inputObj = new Function(`return ${$input.text()}`)();
                            var datas = inputObj.transportType;
                            for(var i=0; i<datas.length;i++){
                                var td = datas[i];
                                var strInit = `<tr>
                                        <td>${td}</td>
                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                    </tr>`;
                                $tbody.append(strInit);
                            }
                        };
                        $('#transportRulesTable_tbody_add').on('click', function(){
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
                                            <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
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
                        var $trs = $('#transportRulesTable_tbody').find('tr');
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
                        var displayContent = `<b>运输方式:</b>${rangerStr}`;
                        // $('[name=ztt-appointTransport-code]').val(JSON.stringify({ transportType: tdsArr }));
                        $('#ztt-appointTransport-code-span').text(JSON.stringify({transportType:tdsArr}));
                        $('[ztt-name=appointTransport]').find('a').html(displayContent);
                        layer.close(index);
                    }
                })
            });
        },
        provinceFrame: function(){ // success
            var _this = this;
            this.selectInit().then(function(result){
                layer.open({
                    type: 1,
                    title: '州/省',
                    area: ['500px', '500px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_provinceLayer').html(),
                    id: 'logisticsRules_provinceLayerId',
                    success: function(layero, index){
                        var tpl = logisticsRules_province_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_province_container');
                        laytpl(tpl).render(result, function(html){
                            tplContainer.innerHTML = html;
                        });
                        var $tbody = $('#provinceRulesTable_tbody');
                        var $input = $('#ztt-province-code-span');
                        if($input.text()){
                            var inputObj = new Function(`return ${$input.text()}`)();
                            var datas = inputObj.ruleValueList;
                            for(var i=0; i<datas.length;i++){
                                var td = datas[i];
                                var strInit = `<tr>
                                        <td>${td}</td>
                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                    </tr>`;
                                $tbody.append(strInit);
                            }
                        };
                        $('#provinceRulesTable_tbody_add').on('click', function(){
                            var val = $('[name=greatThanProvince]').val();
                            let temArr = val.replace(/\n/g, ':repeatResult:').split(':repeatResult:').map(v => v.trim()) || [],
                                temStr = $('#provinceRulesTable_tbody tr td').text().replace(/删除/g, ':repeatResult:'),
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
                                    temTipsTwo += `<li>${v}: 相同州/省现在是保存的</li>`
                                    errorCount ++
                                    return
                                }else{
                                    resultCount ++
                                    var str = `<tr>
                                            <td>${v}</td>
                                            <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                        </tr>`;
                                    $tbody.append(str);
                                    $('[name=greatThanProvince]').val('');
                                }
                            })
                            temTipsOne = temTipsOne.replace(':resultCount', resultCount).replace(':errorCount', errorCount)
                            layer.confirm(`<div>${temTipsOne}</div><ul>${temArrSetTipsStr}</ul><ul>${temTipsTwo}</ul>`)
                        });
                    },
                    yes: function(index, layero){
                        var $trs = $('#provinceRulesTable_tbody').find('tr');
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
                        var displayContent = `<b>州/省:</b>${rangerStr}`;
                        $('#ztt-province-code-span').text(JSON.stringify({ruleValueList:tdsArr}));
                        $('[ztt-name=province]').find('a').html(displayContent);
                        layer.close(index);
                    }
                })
            });
        },
        cityFrame: function(){ // success
          let _this = this;
          this.selectInit().then(function(result){
              layer.open({
                  type: 1,
                  title: '城市',
                  area: ['500px', '500px'],
                  btn: ['保存', '关闭'],
                  content: $('#logisticsRules_cityLayer').html(),
                  id: 'logisticsRules_cityLayerId',
                  success: function(layero, index){
                      let tpl = logisticsRules_city_containerTpl.innerHTML;
                      let tplContainer= document.getElementById('logisticsRules_city_container');
                      laytpl(tpl).render(result, function(html){
                          tplContainer.innerHTML = html;
                      });
                      let $tbody = $('#cityRulesTable_tbody');
                      let $input = $('#ztt-city-code-span');
                      if($input.text()){
                          var inputObj = new Function(`return ${$input.text()}`)();
                          var datas = inputObj.ruleValueList;
                          for(var i=0; i<datas.length;i++){
                              var td = datas[i];
                              var strInit = `<tr>
                                      <td>${td}</td>
                                      <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                  </tr>`;
                              $tbody.append(strInit);
                          }
                      };
                      $('#cityRulesTable_tbody_add').on('click', function(){
                          var val = $('[name=greatThanCity]').val();
                          let temArr = val.replace(/\n/g, ':repeatResult:').split(':repeatResult:').map(v => v.trim()) || [],
                              temStr = $('#cityRulesTable_tbody tr td').text().replace(/删除/g, ':repeatResult:'),
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
                                  temTipsTwo += `<li>${v}: 相同城市现在是保存的</li>`
                                  errorCount ++
                                  return
                              }else{
                                  resultCount ++
                                  var str = `<tr>
                                          <td>${v}</td>
                                          <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="logisticsRulesDel(this)">删除</span></td>
                                      </tr>`;
                                  $tbody.append(str);
                                  $('[name=greatThanCity]').val('');
                              }
                          })
                          temTipsOne = temTipsOne.replace(':resultCount', resultCount).replace(':errorCount', errorCount)
                          layer.confirm(`<div>${temTipsOne}</div><ul>${temArrSetTipsStr}</ul><ul>${temTipsTwo}</ul>`)
                      });
                  },
                  yes: function(index, layero){
                      var $trs = $('#cityRulesTable_tbody').find('tr');
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
                      var displayContent = `<b>城市:</b>${rangerStr}`;
                      $('#ztt-city-code-span').text(JSON.stringify({ruleValueList:tdsArr}));
                      $('[ztt-name=city]').find('a').html(displayContent);
                      layer.close(index);
                  }
              })
          });
      },
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#logisticsRules_table',
                method: 'post',
                url: '/lms/rule/logistics/search',
                where: data,
                cols: [
                    [ //表头
                        {type: 'checkbox', width: 22}
                        ,{title: '优先级',templet: '#logisticsRules_priority', width:60}
                        ,{title: '规则名称',field: 'ruleName', width: '11%'}
                        ,{title: '指定仓库', field: 'warehouseName', width: 100}
                        ,{title: '物流方式', field: 'logisticsTypeName', width: '11%'}
                        ,{title: '规则详情<b style="cursor:pointer;color:#428bca;" id="rulesDetail_expand">（+展开）</b>',templet: '#logisticsRules_detail', align: 'left',field: 'detailContent'}
                        ,{title: '备注', field: 'remark',width:'17%'}
                        ,{title: '最后修改',field: 'modifyTime',templet:`<div>
                        {{# if(d.modifier){ }}
                        <p>{{d.modifier || ""}}</p><p>{{Format(d.modifyTime,"yyyy-MM-dd hh:mm:ss")}}</p>
                        {{# }else{ }}
                        <p>{{d.creator || ""}}</p><p>{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</p>
                        {{# } }}
                        </div>`,width: 145}
                        ,{title: '操作', align:'center', toolbar: '#logisticsRules_tableIdBar', width: 100}
                    ]
                ],
                page: true,
                id: "logisticsRules_tableId",
                limits: [50, 100, 300],
                limit: 100,
                created: function (res) {
                    if (res.code == "0000" && res.data && res.data.length) {
                        res.data = res.data.map(item => ({
                            ...item,
                            CompareSymbolObj
                        }))
                    }
                },
                done: function(res){
                    //工具条监听事件
                    _this.watchBar();
                    _this.expandDetail();
                    _this.batchHandle();
                }
            });
        },
        batchHandle: function(){
            var _this = this;
            //批量启用
            $('#logisticsRules_batchEnable').on('click', function(){
                var cks = table.checkStatus('logisticsRules_tableId').data; //
                if(!cks.length){
                    return layer.msg('请先选中至少一条数据');
                }
                var idsArr= [];
                for(var i=0; i< cks.length; i++){
                    var item = cks[i];
                    idsArr.push(item.id);
                };
                layer.confirm('确定批量启用吗?', function(index){
                    $.ajax({
                        type: 'get',
                        dataType:'json',
                        url: '/lms/rule/enable?ids='+idsArr.join(','),
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                layer.msg(res.msg);
                                layer.close(index);
                                $('[lay-filter=logisticsRules_submit]').click();
                            }
                        },
                        error: function(){
                            loading.hide();
                        }
                    })
                });

            });
            //批量禁用
            $('#logisticsRules_batchDisable').on('click', function(){
                var cks = table.checkStatus('logisticsRules_tableId').data;
                if(!cks.length){
                    return layer.msg('请先选中至少一条数据');
                }
                var idsArr= [];
                for(var i=0; i< cks.length; i++){
                    var item = cks[i];
                    idsArr.push(item.id);
                };
                layer.confirm('确定批量禁用吗?', function(index){
                    $.ajax({
                        type: 'get',
                        dataType:'json',
                        url: '/lms/rule/disable?ids='+idsArr.join(','),
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                layer.msg(res.msg);
                                layer.close(index);
                                $('[lay-filter=logisticsRules_submit]').click();
                            }
                        },
                        error: function(){
                            loading.hide();
                        }
                    })
                });
            });
            //批量修改物流方式和仓库
            $('#logisticsRules_batchHandle').on('click', function(){
                var cks = table.checkStatus('logisticsRules_tableId').data;
                if(!cks.length){
                    return layer.msg('请先选中至少一条数据');
                };
                var idsArr= [];
                for(var i=0; i< cks.length; i++){
                    var item = cks[i];
                    idsArr.push(item.id);
                };
                var index = layer.open({
                    type: 1,
                    title: '批量修改物流方式和仓库',
                    area: ['500px', '600px'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_handleContent').html(),
                    id: 'logisticsRules_handleContentID',
                    success: function(layero, index){
                        _this.selectInit().then(function(result){
                            var tpl = logisticsRules_handleContent_formTpl.innerHTML;
                            var tplContainer= document.getElementById('logisticsRules_handleContent_form');
                            laytpl(tpl).render(result, function(html){
                                tplContainer.innerHTML = html;
                                form.render('select');
                                //仓库类型和仓库联动
                                _this.selectRelated(result.warehouseComboBoxes,layero);
                            });
                        });
                    },
                    yes: function(index, layero){
                        var typeId =layero.find('[name=logisticsTypeId]').val();
                        var warehouseId = layero.find('[name=warehouseId]').val();
                        var warehouseTypeCode = layero.find('[name=warehouseTypeCode]').val();
                        // if(!typeId){
                        //     return layer.msg('指定的物流方式不能为空')
                        // }
                        if ((!warehouseTypeCode&&warehouseId)  || (warehouseTypeCode&&!warehouseId)) {
                            return layer.msg('仓库类型和指定仓库需同时存在',{icon: 7});
                        }
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/lms/rule/batch/change',
                            data: {
                                ids: idsArr.join(','),
                                typeId: typeId,
                                warehouseId: warehouseId,
                                warehouseTypeCode: warehouseTypeCode
                            },
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code=='0000'){
                                    layer.msg(res.msg);
                                    layer.close(index);
                                    $('[lay-filter=logisticsRules_submit]').click();
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
                })
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(logisticsRulesFilter)',function(obj){
                var data = obj.data;
                if(obj.event =='edit'){
                    _this.editRule(data);
                }else if(obj.event == 'copy'){
                    _this.copyRule(data);
                }else if(obj.event == 'enable'){
                    _this.enableRule(data.id);
                }else if(obj.event == 'disable'){
                    _this.disableRule(data.id);
                }else if(obj.event == 'delete'){
                    _this.deleteRule(data.id);
                }
            })
        },
        editRule: function(data){
            var _this = this;
            this.newAddData().then(function(result){
                data.attributeOptions = result.attributeOptions;
                data.countries = result.countries;
                data.platformOptions = result.platformOptions;
                data.moneyTypeOptions = result.moneyTypeOptions;
                data.ruleOptions = result.ruleOptions;
                data.warehouseComboBoxes = result.warehouseComboBoxes;
                data.typeComboBoxes = result.typeComboBoxes;
                data.currencyOptions = result.currencyOptions;
                data.ruleConditionArr = ruleConditionArr;
                data.warehouseTypeOptions = result.warehouseTypeOptions;
                layer.open({
                    type: 1,
                    title: '编辑物流规则',
                    area: ['1100px', '100%'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_createRulesLayer').html(),
                    id: 'logisticsRules_createRulesLayerID',
                    success: function(layero, index){
                        //render and display
                        var tpl = logisticsRules_createRules_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_createRules_container');
                        laytpl(tpl).render(data, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                            form.render('checkbox');
                            _this.detailRender(data.detail);
                            _this.watchCks();
                            _this.watchLi();
                            _this.selectRelated(result.warehouseComboBoxes,layero);
                        });
                    },
                    yes: function(index, layero){
                        _this.ruleAdd(layero).then(function (result) {
                            // let status = $('#logisticsRule_searchForm select[name=status]').val();
                            let status = data.status;
                            result.status = status;
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: '/lms/rule/save',
                                contentType: 'application/json',
                                data: JSON.stringify(result),
                                beforeSend: function(){
                                    if(!result.ruleName || !result.priority || !result.logisticsTypeId  || !result.warehouseType){
                                        layer.msg('规则名称/优先级/物流方式/仓库类型均不能为空!');
                                        return false;
                                    }
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        layer.msg(res.msg);
                                        layer.close(index);
                                        $('[lay-filter=logisticsRules_submit]').click();
                                    }else{
                                        layer.msg(res.msg);
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器出错,请联系开发');
                                }
                            })
                        })
                    }
                });
            });
        },
        copyRule: function(data){
            var _this = this;
            this.newAddData().then(function(result){
                data.attributeOptions = result.attributeOptions;
                data.countries = result.countries;
                data.platformOptions = result.platformOptions;
                data.moneyTypeOptions = result.moneyTypeOptions;
                data.ruleOptions = result.ruleOptions;
                data.warehouseComboBoxes = result.warehouseComboBoxes;
                data.typeComboBoxes = result.typeComboBoxes;
                data.currencyOptions = result.currencyOptions;
                data.ruleConditionArr = ruleConditionArr;
                data.warehouseTypeOptions = result.warehouseTypeOptions;
                layer.open({
                    type: 1,
                    title: '复制物流规则',
                    area: ['1100px', '100%'],
                    btn: ['保存', '关闭'],
                    content: $('#logisticsRules_createRulesLayer').html(),
                    id: 'logisticsRules_createRulesLayerID',
                    success: function(layero, index){
                        //render and display
                        var tpl = logisticsRules_createRules_containerTpl.innerHTML;
                        var tplContainer= document.getElementById('logisticsRules_createRules_container');
                        laytpl(tpl).render(data, function(html){
                            tplContainer.innerHTML = html;
                            form.render('select');
                            form.render('checkbox');
                            _this.detailRender(data.detail);
                            _this.watchCks();
                            _this.watchLi();
                            _this.selectRelated(result.warehouseComboBoxes,layero);
                        });
                    },
                    yes: function(index, layero){
                        _this.ruleAdd(layero).then(function(result){
                            delete result.id;
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: '/lms/rule/save',
                                contentType: 'application/json',
                                data: JSON.stringify(result),
                                beforeSend: function(){
                                    if(!result.ruleName || !result.priority || !result.logisticsTypeId || !result.warehouseType){
                                        layer.msg('规则名称/优先级/物流方式/仓库类型均不能为空!');
                                        return false;
                                    }
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        layer.msg(res.msg);
                                        layer.close(index);
                                        $('[lay-filter=logisticsRules_submit]').click();
                                    }else{
                                        layer.msg(res.msg);
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器出错,请联系开发');
                                }
                            })
                        })
                    }
                });
            });
        },
        detailRender: function(data){
            var keys =Object.keys(data);
            var $ul = $('#rulesLeftChooseCondition'); //container
            for(var i=0; i<keys.length; i++){
                var item = keys[i];
                if(data[item]){
                    var val = JSON.stringify(data[item]);
                    var itemData = data[item];
                    var $inp = $('.bottomCondition_right_body').find(`[name=${item}]`);
                    var desc = $inp.data('desc');
                    $inp.next().click();
                    var contentStr = '';
                    if(item == 'country'){
                        var countryStr = '';
                        if(itemData.exclude){
                            countryStr += '<b>排除以下国家/地区:</b>';
                        }else{
                            countryStr += '<b>包含以下国家/地区:</b>';
                        }
                        countryStr += itemData.shippingCountryName.join(';');
                        contentStr += countryStr;
                    }else if(item =='province') {
                        var shippingStateOrProvinceStr = '<b>指定州/省为:</b>';
                        shippingStateOrProvinceStr += itemData.ruleValueList.join(';');
                        contentStr += shippingStateOrProvinceStr;
                    }else if(item =='city') {
                      var shippingStateOrCityStr = '<b>指定城市为:</b>';
                      shippingStateOrCityStr += itemData.ruleValueList.join(';');
                      contentStr += shippingStateOrCityStr;
                    }else if(item =='money'){
                        var moneyStr = '';
                        moneyStr += `<b>币种:</b>${itemData.currencyName};<b>金额类型:</b>${itemData.moneyTypeName};<b>范围:</b>`;
                        for(var k=0; k<itemData.moneyRegionList.length; k++){
                            var moneyRg = itemData.moneyRegionList[k];
                            moneyStr += `${moneyRg.minimumMoney}至${moneyRg.maximumMoney};`;
                        };
                        contentStr += moneyStr;
                    }else if(item =='platform'){
                        var platformStr = '<b>指定平台为:</b>';
                        platformStr += itemData.platformCode.join(';');
                        contentStr += platformStr;
                    }else if(item =='logisticsAttribute'){
                        var logisticsAttributeStr = itemData.logisticsAttribute.join('、');
                        contentStr += `<b>指定物流为:</b>${logisticsAttributeStr}`;
                    }else if(item == 'store'){
                        var storeStr = itemData.storeAcctName.join('、');
                        contentStr += `<b>指定店铺为:</b>${storeStr}`;
                    }else if(item =='goodsSku'){
                        var goodsSkuStr = '';
                        if(itemData.exclude){
                            goodsSkuStr += '<b>排除以下sku:</b>';
                        }else{
                            goodsSkuStr += '<b>包含以下sku:</b>';
                        };
                        goodsSkuStr += itemData.goodsSku.join(',');
                        contentStr += goodsSkuStr;
                    }else if(item =='itemId'){
                        var itemIdStr = '';
                        if(itemData.exclude){
                            itemIdStr += '<b>排除以下item_id:</b>';
                        }else{
                            itemIdStr += '<b>包含以下item_id:</b>';
                        };
                        itemIdStr += itemData.itemIdList.join(',');
                        contentStr += itemIdStr;
                    }else if(item =='orderDelayDays'){
                        var orderDelayDaysStr = '<b>订单延迟天数为:</b>';
                        for(var k=0; k<itemData.daysRegionList.length; k++){
                            var delays = itemData.daysRegionList[k];
                            orderDelayDaysStr += `${delays.minimumDay}至${delays.maximumDay}天;`
                        };
                        contentStr += orderDelayDaysStr;
                    }else if(item =='weight'){
                        var weightStr = '<b>订单重量为:</b>';
                        for(var k=0; k<itemData.weightRegionList.length; k++){
                            var delays = itemData.weightRegionList[k];
                            weightStr += `${delays.minimumWeight}至${delays.maximumWeight}g;`
                        };
                        contentStr += weightStr;
                    }else if(item =='liquidVolume'){
                      var liquidVolumeStr = '<b>液体体积为:</b>';
                      for(var k=0; k<itemData.orderRuleSimpleCompareDtoList.length; k++){
                          var delays = itemData.orderRuleSimpleCompareDtoList[k];
                          liquidVolumeStr += `${delays.minNumber}至${delays.maxNumber};`
                      };
                      contentStr += liquidVolumeStr;
                  }else if(item =='zipCode'){
                        var zipCodeStr = '<b>订单邮编(区间)为:</b>';
                        for(var k=0; k<itemData.zipCodeRegionDtoList.length; k++){
                            var delays = itemData.zipCodeRegionDtoList[k];
                            zipCodeStr += `${delays.zipCodeBegin}至${delays.zipCodeEnd};`
                        };
                        contentStr += zipCodeStr;
                    }else if(item =='zipCodeNumber'){
                        var zipCodeNumberStr =`<b>订单邮编(固定值)为:</b>${itemData.zipCodeNumberStrList.join(';')}`;
                        contentStr += zipCodeNumberStr;
                    }else if(item =='appointTransport'){
                        var appointTransportStr = '<b>指定运输方式为:</b>';
                        appointTransportStr += itemData.transportType.join(';');
                        contentStr += appointTransportStr;
                    }else if(item =='buyerPayFreight'){
                        var buyerPayFreightStr = '';
                        buyerPayFreightStr += `<b>币种:</b>${itemData.currencyName};<b>范围:</b>`;
                        for(var k=0; k<itemData.buyerPayFreightRegion.length; k++){
                            var delays = itemData.buyerPayFreightRegion[k];
                            buyerPayFreightStr += `${delays.minimumCharge}至${delays.maximumCharge};`
                        };
                        contentStr += buyerPayFreightStr;
                    }else if(item == 'goodsNumber'){
                        var goodsNumberStr = '';
                        goodsNumberStr += `<b>商品数量为:</b>${itemData.minNumber}至${itemData.maxNumber}`;
                        contentStr += goodsNumberStr;
                    }else if(item == 'goodsSkuNumber'){
                        var goodsSkuNumberStr = '';
                        goodsSkuNumberStr += `<b>SKU数量为:</b>${itemData.minNumber}至${itemData.maxNumber}`;
                        contentStr += goodsSkuNumberStr;
                    }else if(item == 'goodsSize'){
                        var goodsSizeStr = '<b>商品尺寸为:</b>';
                        if(itemData.sizeRegionDtoList.length){
                            for(var ds=0; ds<itemData.sizeRegionDtoList.length; ds++){
                                var dsItem = itemData.sizeRegionDtoList[ds];
                                const compareSymbolStr = CompareSymbolObj[dsItem.compareSymbol]
                                if(dsItem.compareType == 1){
                                    goodsSizeStr +=`长${compareSymbolStr}${dsItem.length}cm,宽${compareSymbolStr}${dsItem.width}cm,高${compareSymbolStr}${dsItem.height}cm;`
                                }else if(dsItem.compareType == 2){
                                    goodsSizeStr +=`长宽高之和${compareSymbolStr}${dsItem.sum}cm;`
                                }else{
                                    goodsSizeStr +=`万邑通长${compareSymbolStr}${dsItem.length}cm,万邑通宽${compareSymbolStr}${dsItem.width}cm,万邑通高${compareSymbolStr}${dsItem.height}cm;`
                                }
                            }
                            contentStr += goodsSizeStr;
                        }
                    }
                    var str= `<li ztt-name="${item}">
                              <span>${desc}</span>
                              <a href="javascript:;" class="ztt-a">${contentStr}</a>
                              <input type="hidden" name="ztt-${item}-code" value='${val}'>
                              <span id="ztt-${item}-code-span" class="disN">${val}</span>
                            </li>`;
                    $ul.append(str);
                }
            }
        },
        deleteRule: function(id){
            var _this = this;
            layer.confirm('确定删除吗?', function(index){
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
                            $('[lay-filter=logisticsRules_submit]').click();
                        }
                    },
                    error: function(){
                        loading.hide();
                    }
                })
            });
        },
        enableRule: function(id){
            layer.confirm('确定启用吗?', function(index){
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
                            $('[lay-filter=logisticsRules_submit]').click();
                        }
                    },
                    error: function(){
                        loading.hide();
                    }
                })
            });
        },
        disableRule: function(id){
            layer.confirm('确定禁用吗?', function(index){
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
                            $('[lay-filter=logisticsRules_submit]').click();
                        }
                    },
                    error: function(){
                        loading.hide();
                    }
                })
            });
        },
        selectInit: function(){ // country + platform + rule + moneytype + attribute
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
        storeInit: function(){ // init store
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
        expandDetail: function(){
            var tds = $('#logisticsRules_content td[data-field=detailContent]');
            for(var i=0; i<tds.length; i++){
                var $item = $(tds[i]);
                var tdh = $item.find('.detailRuleDiv').height();
                if(tdh > 146) {
                    var expandStr = `<div class="logisticsRule_expand"><b style="cursor:pointer;color:#428bca;"  class="rulesDetail_expand_single">+展开</b></div>`;
                    if (!$item.find('.rulesDetail_expand_single').length) {
                        $item.append(expandStr);
                    }
                }
            };
        },
        expandDetailAll: function(){
          $('#logisticsRules_content').on('click', '#rulesDetail_expand', function () {
                let $thExpand = $(this);
                let tds = $('td[data-field=detailContent]');
                let txt = $thExpand.text();
                if(txt.indexOf('+展开')>-1){
                    $thExpand.text('（-收缩）');
                    for(let i=0; i< tds.length; i++){
                        let $tar = $(tds[i]).find('.rulesDetail_expand_single');
                        console.log($tar.text());
                        if($tar.text().indexOf('+展开')>-1){
                          $tar.parents('.logisticsRule_expand').prev().find('.detailRuleDefault').removeClass('detailRuleHidden').addClass('detailRuleShow');
                          $tar.text('-收缩');
                        }
                    };
                }else{
                    $thExpand.text('（+展开）');
                    for(let i=0; i< tds.length; i++){
                        let $tar = $(tds[i]).find('.rulesDetail_expand_single');
                        if($tar.text().indexOf('-收缩')>-1){
                          $tar.parents('.logisticsRule_expand').prev().find('.detailRuleDefault').addClass('detailRuleHidden').removeClass('detailRuleShow');
                          $tar.text('+展开');
                        }
                    };
                }
          });
          //td内点击展开收缩
          $('#logisticsRules_content').on('click', '.rulesDetail_expand_single', function(){
              let $this = $(this);
              let txt = $this.html();
              let $tar = $(this).parents('td').find('.detailRuleDefault');
              if(txt == '+展开'){
                  $tar.removeClass('detailRuleHidden').addClass('detailRuleShow');
                  $this.html('-收缩');
              }else{
                  $tar.addClass('detailRuleHidden').removeClass('detailRuleShow');
                  $this.html('+展开');
              }
          });
        },
        searchInit: function(){
            return commonReturnPromise({
                url: '/lms/rule/init/logistics'
            })
        },
        //sku搜索和删除功能
        skuSearchAndDelete: function(layero){
            var searchBtn = layero.find('.logisticsRules_goodsSku_search');
            var deleteBtn = layero.find('.logisticsRules_goodsSku_delete');
            var $input = layero.find('[name=logisticsRules_goodsSku_input]');
            searchBtn.on('click', function(){
                var val = $input.val().trim();
                var txtContainer = layero.find('[name=goodsSkuTextarea]');
                var txtContainerArr =txtContainer.val().split(',') || [];
                if(!val){
                    return layer.msg('请先输入需要查询的sku',{icon:7});
                }
                var matchArr = txtContainerArr.filter(function(item){
                    var valArr = val.split(',');
                    return valArr.includes(item.trim());
                });
                layer.msg(`共查询到${matchArr.length}条匹配的SKU`,{icon:1});
            });
            deleteBtn.on('click', function(){
                var val = $input.val().trim();
                var txtContainer = layero.find('[name=goodsSkuTextarea]');
                var txtContainerArr =txtContainer.val().split(',') || [];
                if(!val){
                    return layer.msg('请先输入需要删除的sku',{icon:7});
                }
                var notMatchArr = txtContainerArr.filter(function(item){
                    var valArr = val.split(',');
                    return !valArr.includes(item.trim());
                });
                var matchArr = txtContainerArr.filter(function(item){
                    var valArr = val.split(',');
                    return valArr.includes(item.trim());
                });
                txtContainer.val(notMatchArr.join(','));
                layer.msg(`共删除${matchArr.length}条匹配的SKU`,{icon:1});
            });
        },
        //itemId搜索和删除功能
        itemIdSearchAndDelete: function(layero){
            var searchBtn = layero.find('.logisticsRules_itemId_search');
            var deleteBtn = layero.find('.logisticsRules_itemId_delete');
            var $input = layero.find('[name=logisticsRules_itemId_input]');
            searchBtn.on('click', function(){
                var val = $input.val().trim();
                var txtContainer = layero.find('[name=itemIdTextarea]');
                var txtContainerArr =txtContainer.val().split(',') || [];
                if(!val){
                    return layer.msg('请先输入需要查询的item_id',{icon:7});
                }
                var matchArr = txtContainerArr.filter(function(item){
                    var valArr = val.split(',');
                    return valArr.includes(item.trim());
                });
                layer.msg(`共查询到${matchArr.length}条匹配的item_id`,{icon:1});
            });
            deleteBtn.on('click', function(){
                var val = $input.val().trim();
                var txtContainer = layero.find('[name=itemIdTextarea]');
                var txtContainerArr =txtContainer.val().split(',') || [];
                if(!val){
                    return layer.msg('请先输入需要删除的item_id',{icon:7});
                }
                var notMatchArr = txtContainerArr.filter(function(item){
                    var valArr = val.split(',');
                    return !valArr.includes(item.trim());
                });
                var matchArr = txtContainerArr.filter(function(item){
                    var valArr = val.split(',');
                    return valArr.includes(item.trim());
                });
                txtContainer.val(notMatchArr.join(','));
                layer.msg(`共删除${matchArr.length}条匹配的item_id`,{icon:1});
            });
        }
    }
    //监听点击
    ztt_logisticsRulesName.expandDetailAll();
    //submit
    form.on('submit(logisticsRules_submit)', function(obj){
        var val = $('[lay-filter=logisiticRules_status]').val();
        if(val == 'true'){
            $('#logisticsRules_batchDisable').removeClass('disN');
            $('#logisticsRules_batchEnable').addClass('disN');
        }else if(val == 'false'){
            $('#logisticsRules_batchDisable').addClass('disN');
            $('#logisticsRules_batchEnable').removeClass('disN');
        }else{
            $('#logisticsRules_batchDisable').removeClass('disN');
            $('#logisticsRules_batchEnable').removeClass('disN');
        };
        var data = obj.field;
        ztt_logisticsRulesName.tableRender(data);
    })
    ztt_logisticsRulesName.importZipCode();
    ztt_logisticsRulesName.importSkuHandle();
    // $('[lay-filter=logisticsRules_submit]').click(); //if development, annotation code
    ztt_logisticsRulesName.newAdd();
    //物流规则渲染
    ztt_logisticsRulesName.searchInit().then(function(result){
        var platformOptions = result.platformOptions; //平台
        var attributeOptions = result.attributeOptions; //物流属性
        var warehouseTypeOptions = result.warehouseTypeOptions; //仓库类型
        var warehouseComboBoxes = result.warehouseComboBoxes; //仓库
        var _warehouseTypeOptions = result.warehouseTypeOptions; //仓库类型
        var _warehouseComboBoxes = result.warehouseComboBoxes; //仓库
        commonRenderSelect('logsRules_platform', platformOptions);
        commonRenderSelect('logsRules_attribute', attributeOptions,{
            name: 'name',
            code: 'name'
        });
        commonRenderSelect('logsRules_warehouseType', warehouseTypeOptions, {
            name:'name',
            code: 'code'
        });
        form.on('select(logsRules_warehouseTypeFilter)', function(obj){
            var val = obj.value;
            var renderData = warehouseComboBoxes.filter(function(item){
                return item.warehouseType == val;
            });
            var $selectDom = $('#logisticsRule_searchForm').find('select[name=warehouseId]');
            var optionStr = '';
            if(!val){
                optionStr =  '<option value>请先选择仓库类型</option>'
            }else{
                optionStr = '<option value>请选择</option>';
            }

            for(var i=0;i<renderData.length; i++){
                var item = renderData[i];
                optionStr += `<option value="${item.id}">${item.name}</option>`;
            };
            $selectDom.html(optionStr);
            form.render('select');
        })
        commonRenderSelect('_logsRules_warehouseType', warehouseTypeOptions, {
            name:'name',
            code: 'code'
        });
        form.on('select(_logsRules_warehouseTypeFilter)', function(obj){
            var val = obj.value;
            var renderData = warehouseComboBoxes.filter(function(item){
                return item.warehouseType == val;
            });
            var $selectDom = $('#logisticsRules_modifyRule_Form').find('select[name=_warehouseId]');
            var optionStr = '';
            if(!val){
                optionStr =  '<option value>请先选择仓库类型</option>'
            }else{
                optionStr = '<option value>请选择</option>';
            }

            for(var i=0;i<renderData.length; i++){
                var item = renderData[i];
                optionStr += `<option value="${item.id}">${item.name}</option>`;
            };
            $selectDom.html(optionStr);
            form.render('select');
        })
        form.render('select');
    })

    $("#logisticsRules_modifyRule").click(function(){
        let formData = serializeObject($("#logisticsRules_modifyRule_Form")),ruleIds = [],
            checkData = layui.table.checkStatus("logisticsRules_tableId").data;
        if(checkData.length == 0){
            layer.msg("请选择数据")
            return false;
        }
        if(formData._warehouseType == ''||formData._warehouseId == ''){
            layer.msg("请选择仓库类型和仓库")
            return false;
        }

        checkData.forEach(item =>{
            ruleIds.push(item.id)
        })

        commonReturnPromise({
            url: '/lms/rule/logistics/updateWarehouse',
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify({
                "warehouseType":formData._warehouseType,
                "warehouseId":formData._warehouseId,
                "ruleIds":ruleIds
            })
        }).then(res=>{
            layer.alert(res,{icon:1})
            $('[lay-filter=logisticsRules_submit]').click();
        })
    })

    //window add
    window.logisticsRulesDel = function(obj){
        var tr = $(obj).parents('tr');
        $(tr).remove();
    };
    window.modifyLogisticsRulePriority = function(e,t){
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
                        $('[lay-filter=logisticsRules_submit]').click();
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
    $('#logisticsRules_content').on('input', '[ztt-verify=priority]', function(e){
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

})