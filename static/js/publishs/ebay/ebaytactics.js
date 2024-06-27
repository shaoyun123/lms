console.log('et');
layui.use(['form', 'element', 'table','formSelects'], function() {
     var form = layui.form,
        element = layui.element,
        table = layui.table,
        formSelects = layui.formSelects
        $ = layui.$;
    //ebay非站点运送方式寄送国家
    var ebayShipTo = {};
    initEbayShipTo();

    //渲染多选框
    formSelects.render('currentStatus_newdevelop');
    form.render();
    //点击不同的tab添加类名layui-this
    $('#et_leftSideBar').on('click', '.layui-nav-item', function() {
        var _this = $(this);
        if (_this.find('a').text() != "公共模块") {
            _this.siblings().removeClass('layui-this');
            _this.addClass('layui-this');
            var id = _this.data('id');
            var siteId = $("#ebay_tactics_site_id").val();
            var isOverseasWh = $("#ebay_tactics_site_is_overseas_wh").val();
            initTable(id ,siteId ,isOverseasWh);
        }
    });
    //默认点击
    $("#et_leftSideBar .layui-this").trigger('click');
    //点击不同的tab添加类名layui-this
    $('#et_addBtn').on('click', function() {
        var id = $("#et_leftSideBar .layui-this").data('id');
        if(id=="et_default"){
        	editDefault();
        }else if(id=="et_logistics"){
            editShip();
        }else if(id=="et_goodLocal"){
            editGoodLocal();
        }else if(id=="et_excludeCountries"){
            editExcludeCountries();
        }else if(id=="et_return_policy"){
            editReturnPolicy();
        }else if(id=="et_info"){
            editInfo();
        }
    });
    $("#ebay_tactics_form_submit").on('click' , function () {
        var id = $("#et_leftSideBar .layui-this").data('id');
        var siteId = $("#ebay_tactics_site_id").val();
        var isOverseasWh = $("#ebay_tactics_site_is_overseas_wh").val();
        initTable(id , siteId , isOverseasWh);
    });
    //初始化
    function initEbayShipTo(){
    	console.log("初始化ebay非站点运送方式寄送国家");
    	$.ajax({
    		type:"post",
    		url: ctx + "/assifieldebay/shipto.html",
    		async:true,
    		dataType:'json',
    		success:function(returnData){
    			if(returnData.code == "0000"){
    				ebayShipTo = returnData.data;
    			}else{
    				layer.alert(returnData.msg);
    			}
    		}
    	});
    }
    function initTable(id ,siteId ,isOverseasWh){
        $("#ebay_tactics_search_form").show();
        if(id == 'et_default'){
            table.render({
                elem: '#et_table'
                ,url: ctx + '/assifieldebay/listdefault.html' //数据接口
                ,type:'post',
                where: {siteId: siteId, isOverseasWh: isOverseasWh}
                ,page: false //开启分页
                ,cols: [[ //表头
                   {field: 'name', title: '名称',}
                  ,{field: 'ruleId', title: '规则',width:'20%',
                    templet:'#et_ruleTpl'}
                  ,{field: 'listingDays', title: '刊登天数', width:'5%'}
                  ,{field: 'goodsLocation', title: '物品所在地/国家', width:'10%', templet:'<div>{{d.goodsLocation}}/{{d.goodsCountry}}</div>'}
                  ,{field: 'shipSrv1', title: '站点国家运输方式1', width: '25%'}
                  ,{field: 'intlShipSrv1', title: '非站点国家运输方式1', width: '25%'}
                  ,{field: 'opt', title: '操作', width: '5%',
                  toolbar: '<div><a class="layui-btn layui-btn-xs" lay-event="et_editDefault">修改</a><br><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="et_deleteDefault">删除</a></div>',}
                ]]
            });
        }else if(id == 'et_logistics'){
            table.render({
                elem: '#et_table'
                ,url: ctx + '/assifieldebay/listship.html' //数据接口
                ,type:'post',
                where: {siteId: siteId, isOverseasWh: isOverseasWh}
                ,page: false //开启分页
                ,cols: [[ //表头
                  {field: 'name', title: '名称', }
                  ,{field: 'ruleId', title: '规则',width:'20%',
                    templet:'#et_ruleTpl'}
                  ,{field: 'shipSrv1', title: '站点国家运输方式1', width: '25%'}
                  ,{field: 'intlShipSrv1', title: '非站点国家运输方式1', width: '25%'}
                  ,{field: 'opt', title: '操作',
                  toolbar: '<div><a class="layui-btn layui-btn-xs" lay-event="et_editShip">修改</a><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="et_deleteShip">删除</a></div>',}
                ]]
            });
        }else if(id == 'et_goodLocal'){
            table.render({
                elem: '#et_table'
                ,url: ctx + '/assifieldebay/listgoodlocal.html' //数据接口
                ,type:'post',
                where: {siteId: siteId, isOverseasWh: isOverseasWh}
                ,page: false //开启分页
                ,cols: [[ //表头
                  {field: 'name', title: '名称',}
                  ,{field: 'ruleId', title: '规则',width:'20%',
                    templet:'#et_ruleTpl'}
                  ,{field: 'goodsLocation', title: 'location', }
                  ,{field: 'goodsCountry', title: 'country', }
                  ,{field: 'opt', title: '操作', width: '10%',
                  toolbar: '<div><a class="layui-btn layui-btn-xs" lay-event="et_editGoodLocal">修改</a><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="et_deleteGoodLocal">删除</a></div>',}
                ]]
            });
        }else if(id == 'et_excludeCountries'){
            table.render({
                elem: '#et_table'
                ,url: ctx + '/assifieldebay/listexcludecountries.html' //数据接口
                ,type:'post',
                where: {siteId: siteId, isOverseasWh: isOverseasWh}
                ,page: false //开启分页
                ,cols: [[ //表头
                  {field: 'name', title: '名称'}
                  ,{field: 'ruleId', title: '规则',width:'20%',
                    templet:'#et_ruleTpl'}
                  ,{field: 'notShipToCountries', title: '不寄送国家'}
                  ,{field: 'opt', title: '操作', width: '10%',
                  toolbar: '<div><a class="layui-btn layui-btn-xs" lay-event="et_editExcludeCountries">修改</a><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="et_deleteExcludeCountries">删除</a></div>',}
                ]]
            });
        }else if(id == 'et_return_policy'){
            table.render({
                elem: '#et_table'
                ,url: ctx + '/assifieldebay/listreturnpolicy.html' //数据接口
                ,type:'post',
                where: {siteId: siteId, isOverseasWh: isOverseasWh}
                ,page: false //开启分页
                ,cols: [[ //表头
                  {field: 'name', title: '名称', width:'10%',} 
                  ,{field: 'ruleId', title: '规则',width:'20%',
                    templet:'#et_ruleTpl'}
                  ,{field: 'returnsAcceptedOption', title: '国内退货', width:'8%',}
                  ,{field: 'returnsWithinOption', title: '退货方式', width:'6%',}
                  ,{field: 'refundOption', title: '退货期限', width:'9%',}
                  ,{field: 'shippingCostPaidBy', title: '运费承担', width:'6%',}
                  ,{field: 'internationalReturnsAcceptedOption', title: '国际退货', width:'8%',}
                  ,{field: 'internationalReturnsWithinOption', title: '国际退货期限', width:'9%',}
                  ,{field: 'internationalRefundOption', title: '国际退货方式', width:'8%',}
                  ,{field: 'internationalShippingCostPaidBy', title: '国际退货运费承担', width:'8%',}
                  ,{field: 'opt', title: '操作', width: '8%',
                  toolbar: '<div><a class="layui-btn layui-btn-xs" lay-event="et_editReturnPolicy">修改</a><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="et_deleteReturnPolicy">删除</a></div>',}
                ]]
            });
        }else if(id == 'et_info'){
            $("#ebay_tactics_search_form").hide();
            table.render({
                elem: '#et_table'
                ,url: ctx + '/assifieldebay/listinfo.html' //数据接口
                ,page: false //开启分页
                ,cols: [[ //表头
                  {field: '序号', type: 'numbers',}
                  ,{field: 'remark', title: '站点', width:'10%',}
                  ,{field: 'name', title: '模板名称', width:'75%',}
                  ,{field: 'opt', title: '操作', width: '10%',
                  toolbar: '<div><a class="layui-btn layui-btn-xs" lay-event="et_editInfo">修改</a><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="et_deleteInfo">删除</a></div>',}
                ]]
            });
        }
    }
    table.on('tool(et_table-filter)',function(obj){
        var layEvent = obj.event; //获得 lay-event 对应的值
        if(layEvent == 'et_editDefault'){//修改关键字
            var id = obj.data.id;
            editDefault(id);
        }else if(layEvent == 'et_editShip'){
            //物流
            var id = obj.data.id;
            editShip(id);
        }else if(layEvent == 'et_editGoodLocal'){
            //物品所在地
            var id = obj.data.id;
            editGoodLocal(id);
        }else if(layEvent == 'et_editExcludeCountries'){
            //不寄送国家
            var id = obj.data.id;
            editExcludeCountries(id);
        }else if(layEvent == 'et_editReturnPolicy'){
            //退货政策
            editReturnPolicy(obj.data);
        }else if(layEvent == 'et_editInfo'){
            var id = obj.data.id;
            editInfo(id);
        }else if(layEvent.indexOf("delete") != -1){
            layer.confirm('删除模板', {icon:3},function(index){
                var url = ctx + "/assifieldebay/";
                if(layEvent == "et_deleteDefault"){
                    url += "deletedefault.html";
                }else if(layEvent == "et_deleteShip"){
                    url += "deleteship.html";
                }else if(layEvent == "et_deleteGoodLocal"){
                    url += "deletegoodlocal.html";
                }else if(layEvent == "et_deleteExcludeCountries"){
                    url += "deleteexcludecountries.html";
                }else if(layEvent == "et_deleteReturnPolicy"){
                    url += "deletereturnpolicy.html";
                }else if(layEvent == "et_deleteInfo"){
                    url += "deleteinfo.html";
                }
                $.ajax({
                    type:"post",
                    url: url,
                    dataType:"json",
                    data:{id:obj.data.id} ,
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                        }else{
                            layer.msg("删除成功");
                            table.reload('et_table');
                        }
                    }
                });
            });
        }
      })

    function editDefault(id){
        layer.open({
            type: 1,
            title: '默认刊登数据',
            btn: ['保存', '关闭'],
            area: ['80%', '100%'],
            content: $('#et_defaultEditLayer').html().replace(":rule",$("#et_ruleFormTpl").html()),
            success: function(layero, index) {
            	//为了初始化面板
            	element.init();
                if(!id){
                    form.render();
                    return;
                }
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url:ctx + "/assifieldebay/getdefault.html",
                    data:{id:id},
                    dataType:"json",
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                            layer.close(index);
                        }else{
                            var assiField = returnData.data;
                            //初始化模板规则
                            initRule($(layero).find(".assiFieldRuleForm"), assiField.rule);
                            
                            $(layero).find("form input[name=id]").val(assiField.id);
                            $(layero).find("form input[name=name]").val(assiField.name);
                            $(layero).find("form select[name=listingDays]").val(assiField.listingDays);
                            $(layero).find("form input[name=dispatchTimeMax]").val(assiField.dispatchTimeMax);
                            $(layero).find("form input[name=goodsLocation]").val(assiField.goodsLocation);
                            $(layero).find("form input[name=goodsCountry]").val(assiField.goodsCountry);
                            $(layero).find("form textarea[name=notShipToCountries]").val(assiField.notShipToCountries);
                            //国内运输方式1
                            $(layero).find("form input[name=shipSrv1]").val(assiField.shipSrv1);
                            $(layero).find("form input[name=shipSrv1Cost]").val(assiField.shipSrv1Cost);
                            $(layero).find("form input[name=shipSrv1AddedCost]").val(assiField.shipSrv1AddedCost);
                            //国内运输方式2
                            $(layero).find("form input[name=shipSrv2]").val(assiField.shipSrv2);
                            $(layero).find("form input[name=shipSrv2Cost]").val(assiField.shipSrv2Cost);
                            $(layero).find("form input[name=shipSrv2AddedCost]").val(assiField.shipSrv2AddedCost);
                            //国内运输方式3
                            $(layero).find("form input[name=shipSrv3]").val(assiField.shipSrv3);
                            $(layero).find("form input[name=shipSrv3Cost]").val(assiField.shipSrv3Cost);
                            $(layero).find("form input[name=shipSrv3AddedCost]").val(assiField.shipSrv3AddedCost);
                            //国内运输方式4
                            $(layero).find("form input[name=shipSrv4]").val(assiField.shipSrv4);
                            $(layero).find("form input[name=shipSrv4Cost]").val(assiField.shipSrv4Cost);
                            $(layero).find("form input[name=shipSrv4AddedCost]").val(assiField.shipSrv4AddedCost);
                            //境外运输方式1
                            $(layero).find("form input[name=intlShipSrv1]").val(assiField.intlShipSrv1);
                            $(layero).find("form input[name=intlShipSrv1Cost]").val(assiField.intlShipSrv1Cost);
                            $(layero).find("form input[name=intlShipSrv1AddedCost]").val(assiField.intlShipSrv1AddedCost);
                            if(assiField.intlShip1ToCountries){
                                var intlShip1ToCountries = assiField.intlShip1ToCountries.split(",");
                                for(var i=0; i<intlShip1ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip1ToCountries][value="+intlShip1ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            //境外运输方式2
                            $(layero).find("form input[name=intlShipSrv2]").val(assiField.intlShipSrv2);
                            $(layero).find("form input[name=intlShipSrv2Cost]").val(assiField.intlShipSrv2Cost);
                            $(layero).find("form input[name=intlShipSrv2AddedCost]").val(assiField.intlShipSrv2AddedCost);
                            if(assiField.intlShip2ToCountries){
                                var intlShip2ToCountries = assiField.intlShip2ToCountries.split(",");
                                for(var i=0; i<intlShip2ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip2ToCountries][value="+intlShip2ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            //境外运输方式3
                            $(layero).find("form input[name=intlShipSrv3]").val(assiField.intlShipSrv3);
                            $(layero).find("form input[name=intlShipSrv3Cost]").val(assiField.intlShipSrv3Cost);
                            $(layero).find("form input[name=intlShipSrv3AddedCost]").val(assiField.intlShipSrv3AddedCost);
                            if(assiField.intlShip3ToCountries){
                                var intlShip3ToCountries = assiField.intlShip3ToCountries.split(",");
                                for(var i=0; i<intlShip3ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip3ToCountries][value="+intlShip3ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            //境外运输方式4
                            $(layero).find("form input[name=intlShipSrv4]").val(assiField.intlShipSrv4);
                            $(layero).find("form input[name=intlShipSrv4Cost]").val(assiField.intlShipSrv4Cost);
                            $(layero).find("form input[name=intlShipSrv4AddedCost]").val(assiField.intlShipSrv4AddedCost);
                            if(assiField.intlShip4ToCountries){
                                var intlShip4ToCountries = assiField.intlShip4ToCountries.split(",");
                                for(var i=0; i<intlShip4ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip4ToCountries][value="+intlShip4ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            //境外运输方式5
                            $(layero).find("form input[name=intlShipSrv5]").val(assiField.intlShipSrv5);
                            $(layero).find("form input[name=intlShipSrv5Cost]").val(assiField.intlShipSrv5Cost);
                            $(layero).find("form input[name=intlShipSrv5AddedCost]").val(assiField.intlShipSrv5AddedCost);
                            if(assiField.intlShip5ToCountries){
                                var intlShip5ToCountries = assiField.intlShip5ToCountries.split(",");
                                for(var i=0; i<intlShip5ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip5ToCountries][value="+intlShip5ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            $(layero).find("form select[name=returnsAcceptedOption]").val(assiField.returnsAcceptedOption);
                            $(layero).find("form select[name=refundOption]").val(assiField.refundOption);
                            $(layero).find("form select[name=returnsWithinOption]").val(assiField.returnsWithinOption);
                            $(layero).find("form select[name=shippingCostPaidBy]").val(assiField.shippingCostPaidBy);
                            $(layero).find("form select[name=internationalReturnsAcceptedOption]").val(assiField.internationalReturnsAcceptedOption);
                            $(layero).find("form select[name=internationalRefundOption]").val(assiField.internationalRefundOption);
                            $(layero).find("form select[name=internationalReturnsWithinOption]").val(assiField.internationalReturnsWithinOption);
                            $(layero).find("form select[name=internationalShippingCostPaidBy]").val(assiField.internationalShippingCostPaidBy);
                            $(layero).find("form textarea[name=returnDescription]").val(assiField.returnDescription);
                            
                            form.render();
                            //应用到指定的站点
                            $("#ebay_exclude_country_applay_on_specified_site").on('click', function () {
                                var siteIds = $(layero).find(".assiFieldRuleForm").find('input[name=siteIds]');
                                var textarea = $("#ebay_default_notShipToCountries_textarea").val();
                                var checkedSiteIds = new Array();
                                var checkedSiteCN = new Array();
                                siteIds.each(function (index ,data) {
                                    if (data.checked){
                                        checkedSiteIds.push($(data).val());
                                        checkedSiteCN.push($(data).attr("title"));
                                    }
                                });
                                var s = checkedSiteIds.join(",");
                                //获取选中的标题
                                layer.open({
                                    type: 1,
                                    title: '应用到当前站点',
                                    btn: ['确认', '取消'],
                                    content: '是否将此不寄送国家应用到当前站点--->' + JSON.stringify(checkedSiteCN)+ '?',
                                    yes:function (confirmIndex, confirmLayer) {
                                        layer.close(confirmIndex);
                                        layui.admin.load.show();
                                        $.ajax({
                                            type: "post",
                                            data: {siteIds: s, notShippingCountries: textarea},
                                            url: ctx + "/assifieldebay/notShippingCountriesApplyOnSpecifiedSite.html",
                                            dataType: "json",
                                            success: function (response) {
                                                layui.admin.load.hide();
                                                if (response.code !== "0000") {
                                                    layer.msg(response.data, {icon: 2});
                                                    return
                                                }
                                                layer.msg(response.data, {icon: 1});
                                            },
                                            error: function (XMLHttpRequest) {
                                                layui.admin.load.hide();
                                                if (XMLHttpRequest.status === 200) {
                                                    layer.msg("请重新登录", {icon: 7});
                                                } else {
                                                    layer.msg("服务器错误");
                                                }
                                            }
                                        });
                                    },
                                    btn2: function(cancelIndex, cancelLayer){
                                        //取消的回调
                                        layer.close(cancelIndex);
                                    }
                                });
                            });
                            //应用到全站点
                            $("#ebay_exclude_country_applay_on_all_site").on('click', function () {
                                layer.open({
                                    type: 1,
                                    title: '应用到所有站点',
                                    btn: ['确认', '取消'],
                                    content: '是否将此不寄送国家应用到所有站点?',
                                    yes : function(confirmIndex, confirmLayer){
                                        layer.close(confirmIndex);
                                        layui.admin.load.show();
                                        var textarea = $("#ebay_default_notShipToCountries_textarea").val();
                                        $.ajax({
                                            type : "post" ,
                                            data : {notShippingCountries : textarea},
                                            dataType: "json" ,
                                            url : ctx + "/assifieldebay/notShippingCountriesApplyAllSite.html",
                                            success : function (response) {
                                                console.log(response);
                                                layui.admin.load.hide();
                                                if (response.code !== "0000") {
                                                    layer.msg(response.data, {icon: 2});
                                                    return
                                                }
                                                layer.msg(response.data, {icon: 1});
                                            },
                                            error: function (XMLHttpRequest) {
                                                layui.admin.load.hide();
                                                if (XMLHttpRequest.status === 200) {
                                                    layer.msg("请重新登录", {icon: 7});
                                                } else {
                                                    layer.msg("服务器错误");
                                                }
                                            }
                                        });
                                    },
                                    btn2: function(cancelIndex, cancelLayer){
                                        //取消的回调
                                        layer.close(cancelIndex);
                                    }});
                            });
                        }
                    }
                });
            },
            yes: function(index, layero) {
                var assiField = {};
                assiField.id = $(layero).find("form input[name=id]").val();
                assiField.name = $(layero).find("form input[name=name]").val();
                assiField.listingDays = $(layero).find("form select[name=listingDays]").val();
                assiField.dispatchTimeMax = $(layero).find("form input[name=dispatchTimeMax]").val();
                assiField.goodsLocation = $(layero).find("form input[name=goodsLocation]").val();
                assiField.goodsCountry = $(layero).find("form input[name=goodsCountry]").val();
                //国内运输1
                assiField.shipSrv1 = $(layero).find("form input[name=shipSrv1]").val();
                assiField.shipSrv1Cost = $(layero).find("form input[name=shipSrv1Cost]").val();
                assiField.shipSrv1AddedCost = $(layero).find("form input[name=shipSrv1AddedCost]").val();
                //国内运输2
                assiField.shipSrv2 = $(layero).find("form input[name=shipSrv2]").val();
                assiField.shipSrv2Cost = $(layero).find("form input[name=shipSrv2Cost]").val();
                assiField.shipSrv2AddedCost = $(layero).find("form input[name=shipSrv2AddedCost]").val();
                //国内运输3
                assiField.shipSrv3 = $(layero).find("form input[name=shipSrv3]").val();
                assiField.shipSrv3Cost = $(layero).find("form input[name=shipSrv3Cost]").val();
                assiField.shipSrv3AddedCost = $(layero).find("form input[name=shipSrv3AddedCost]").val();
                //国内运输4
                assiField.shipSrv4 = $(layero).find("form input[name=shipSrv4]").val();
                assiField.shipSrv4Cost = $(layero).find("form input[name=shipSrv4Cost]").val();
                assiField.shipSrv4AddedCost = $(layero).find("form input[name=shipSrv4AddedCost]").val();
                //境外运输1
                assiField.intlShipSrv1 = $(layero).find("form input[name=intlShipSrv1]").val();
                assiField.intlShipSrv1Cost = $(layero).find("form input[name=intlShipSrv1Cost]").val();
                assiField.intlShipSrv1AddedCost = $(layero).find("form input[name=intlShipSrv1AddedCost]").val();
                var intlShip1ToCountries = [];
                $(layero).find("form input[name=intlShip1ToCountries]:checked").each(function(){
                    intlShip1ToCountries.push($(this).val());
                });
                assiField.intlShip1ToCountries = intlShip1ToCountries.join(",");
                //境外运输2
                assiField.intlShipSrv2 = $(layero).find("form input[name=intlShipSrv2]").val();
                assiField.intlShipSrv2Cost = $(layero).find("form input[name=intlShipSrv2Cost]").val();
                assiField.intlShipSrv2AddedCost = $(layero).find("form input[name=intlShipSrv2AddedCost]").val();
                var intlShip2ToCountries = [];
                $(layero).find("form input[name=intlShip2ToCountries]:checked").each(function(){
                    intlShip2ToCountries.push($(this).val());
                });
                assiField.intlShip2ToCountries = intlShip2ToCountries.join(",");
                //境外运输3
                assiField.intlShipSrv3 = $(layero).find("form input[name=intlShipSrv3]").val();
                assiField.intlShipSrv3Cost = $(layero).find("form input[name=intlShipSrv3Cost]").val();
                assiField.intlShipSrv3AddedCost = $(layero).find("form input[name=intlShipSrv3AddedCost]").val();
                var intlShip3ToCountries = [];
                $(layero).find("form input[name=intlShip3ToCountries]:checked").each(function(){
                    intlShip3ToCountries.push($(this).val());
                });
                assiField.intlShip3ToCountries = intlShip3ToCountries.join(",");
                //境外运输4
                assiField.intlShipSrv4 = $(layero).find("form input[name=intlShipSrv4]").val();
                assiField.intlShipSrv4Cost = $(layero).find("form input[name=intlShipSrv4Cost]").val();
                assiField.intlShipSrv4AddedCost = $(layero).find("form input[name=intlShipSrv4AddedCost]").val();
                var intlShip4ToCountries = [];
                $(layero).find("form input[name=intlShip4ToCountries]:checked").each(function(){
                    intlShip4ToCountries.push($(this).val());
                });
                assiField.intlShip4ToCountries = intlShip4ToCountries.join(",");
                //境外运输5
                assiField.intlShipSrv5 = $(layero).find("form input[name=intlShipSrv5]").val();
                assiField.intlShipSrv5Cost = $(layero).find("form input[name=intlShipSrv5Cost]").val();
                assiField.intlShipSrv5AddedCost = $(layero).find("form input[name=intlShipSrv5AddedCost]").val();
                var intlShip5ToCountries = [];
                $(layero).find("form input[name=intlShip5ToCountries]:checked").each(function(){
                    intlShip5ToCountries.push($(this).val());
                });
                assiField.intlShip5ToCountries = intlShip5ToCountries.join(",");
                
                assiField.notShipToCountries = $(layero).find("form textarea[name=notShipToCountries]").val();
                assiField.returnsAcceptedOption = $(layero).find("form select[name=returnsAcceptedOption]").val();
                assiField.refundOption = $(layero).find("form select[name=refundOption]").val();
                assiField.returnsWithinOption = $(layero).find("form select[name=returnsWithinOption]").val();
                assiField.shippingCostPaidBy = $(layero).find("form select[name=shippingCostPaidBy]").val();
                assiField.internationalReturnsAcceptedOption = $(layero).find("form select[name=internationalReturnsAcceptedOption]").val();
                assiField.internationalRefundOption = $(layero).find("form select[name=internationalRefundOption]").val();
                assiField.internationalReturnsWithinOption = $(layero).find("form select[name=internationalReturnsWithinOption]").val();
                assiField.internationalShippingCostPaidBy = $(layero).find("form select[name=internationalShippingCostPaidBy]").val();
                assiField.returnDescription = $(layero).find("form textarea[name=returnDescription]").val();
                //获取物流规则
                assiField.rule = getRule($(layero).find(".assiFieldRuleForm"));
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url:ctx + "/assifieldebay/savedefault.html",
                    dataType:"json",
                    contentType: 'application/json',
                    data:JSON.stringify(assiField),
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                        }else{
                            layer.msg("保存成功");
                            layer.close(index);
                            table.reload('et_table');
                        }
                    }
                });
            }
        })
    }
    
    //初始化
    //初始化模板规则
    function initRule(formElem, rule){
    	if(!rule){
    		return;
    	}
    	formElem.find('input[name=id]').val(rule.id);
    	formElem.find('input[name=priority]').val(rule.priority);
    	//选中站点
    	checkCheckbox(formElem.find('input[name=siteIds]'),rule.siteIds.split(","));
    	formElem.find('input[name=minPrice]').val(rule.minPrice);
    	formElem.find('input[name=maxPrice]').val(rule.maxPrice);
      formElem.find('input[name=minWeight]').val(rule.minWeight);
      formElem.find('input[name=maxWeight]').val(rule.maxWeight);
    	formElem.find('input[name=isOverseasWh][value='+rule.isOverseasWh+']').prop("checked", true);
    	checkCheckbox(formElem.find('input[name=logisAttrList]'),rule.logisAttrList.split(","));
    	checkCheckbox(formElem.find('input[name=storeAcctIds]'),rule.storeAcctIds.split(","));
    	//初始化模板对应的寄送国家
    	selectebayShipTo1(rule.siteIds,formElem.parents(".layui-collapse").find(".ebayShipTo1"))
    	selectebayShipTo2(rule.siteIds,formElem.parents(".layui-collapse").find(".ebayShipTo2"))
    	selectebayShipTo3(rule.siteIds,formElem.parents(".layui-collapse").find(".ebayShipTo3"))
    	selectebayShipTo4(rule.siteIds,formElem.parents(".layui-collapse").find(".ebayShipTo4"))
    	selectebayShipTo5(rule.siteIds,formElem.parents(".layui-collapse").find(".ebayShipTo5"))
    }
    //获取模板规则实体
    function getRule(formElem){
    	var rule = {};
    	rule.id = formElem.find('input[name=id]').val();
    	rule.priority = formElem.find('input[name=priority]').val();
    	//站点
    	var siteIds = [];
    	formElem.find('input[name=siteIds]:checked').each(function(){
    		siteIds.push($(this).val());
    	});
    	rule.siteIds = siteIds.join(",");
    	rule.minPrice = formElem.find('input[name=minPrice]').val();
    	rule.maxPrice = formElem.find('input[name=maxPrice]').val();
      rule.minWeight = formElem.find('input[name=minWeight]').val();
      rule.maxWeight = formElem.find('input[name=maxWeight]').val();
    	rule.isOverseasWh = formElem.find('input[name=isOverseasWh]:checked').val();
    	//物流属性
    	var logisAttrList = [];
    	formElem.find('input[name=logisAttrList]:checked').each(function(){
    		logisAttrList.push($(this).val());
    	});
    	rule.logisAttrList = logisAttrList.join(",");
    	//店铺
    	var storeAcctIds = [];
    	formElem.find('input[name=storeAcctIds]:checked').each(function(){
    		storeAcctIds.push($(this).val());
    	});
    	rule.storeAcctIds = storeAcctIds.join(",");
    	return rule;
    }
    
    
    function editShip(id){
        layer.open({
            type: 1,
            title: '物流',
            content: $('#et_logisticsEditLayer').html().replace(":rule",$("#et_ruleFormTpl").html()),
            area: ['80%', '100%'],
            btn: ['保存', '关闭'],
            success: function(layero, index){
            	//为了初始化面板
            	element.init();
                if(!id){
                    form.render();
                    return;
                }
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url:ctx + "/assifieldebay/getship.html",
                    data:{id:id},
                    dataType:"json",
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                            layer.close(index);
                        }else{
                            var assiFieldShip = returnData.data;
                            //初始化模板规则
                            initRule($(layero).find(".assiFieldRuleForm"), assiFieldShip.rule);
                            $(layero).find("form input[name=id]").val(assiFieldShip.id);
                            $(layero).find("form input[name=name]").val(assiFieldShip.name);
                            //国内1
                            $(layero).find("form input[name=shipSrv1]").val(assiFieldShip.shipSrv1);
                            $(layero).find("form input[name=shipSrv1Cost]").val(assiFieldShip.shipSrv1Cost);
                            $(layero).find("form input[name=shipSrv1AddedCost]").val(assiFieldShip.shipSrv1AddedCost);
                            //国内2
                            $(layero).find("form input[name=shipSrv2]").val(assiFieldShip.shipSrv2);
                            $(layero).find("form input[name=shipSrv2Cost]").val(assiFieldShip.shipSrv2Cost);
                            $(layero).find("form input[name=shipSrv2AddedCost]").val(assiFieldShip.shipSrv2AddedCost);
                            //国内运输方式3
                            $(layero).find("form input[name=shipSrv3]").val(assiFieldShip.shipSrv3);
                            $(layero).find("form input[name=shipSrv3Cost]").val(assiFieldShip.shipSrv3Cost);
                            $(layero).find("form input[name=shipSrv3AddedCost]").val(assiFieldShip.shipSrv3AddedCost);
                            //国内运输方式4
                            $(layero).find("form input[name=shipSrv4]").val(assiFieldShip.shipSrv4);
                            $(layero).find("form input[name=shipSrv4Cost]").val(assiFieldShip.shipSrv4Cost);
                            $(layero).find("form input[name=shipSrv4AddedCost]").val(assiFieldShip.shipSrv4AddedCost);
                            //境外1
                            $(layero).find("form input[name=intlShipSrv1]").val(assiFieldShip.intlShipSrv1);
                            $(layero).find("form input[name=intlShipSrv1Cost]").val(assiFieldShip.intlShipSrv1Cost);
                            $(layero).find("form input[name=intlShipSrv1AddedCost]").val(assiFieldShip.intlShipSrv1AddedCost);
                            if(assiFieldShip.intlShip1ToCountries){
                                var intlShip1ToCountries = assiFieldShip.intlShip1ToCountries.split(",");
                                for(var i=0; i<intlShip1ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip1ToCountries][value="+intlShip1ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            //境外2
                            $(layero).find("form input[name=intlShipSrv2]").val(assiFieldShip.intlShipSrv2);
                            $(layero).find("form input[name=intlShipSrv2Cost]").val(assiFieldShip.intlShipSrv2Cost);
                            $(layero).find("form input[name=intlShipSrv2AddedCost]").val(assiFieldShip.intlShipSrv2AddedCost);
                            if(assiFieldShip.intlShip2ToCountries){
                                var intlShip2ToCountries = assiFieldShip.intlShip2ToCountries.split(",");
                                for(var i=0; i<intlShip2ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip2ToCountries][value="+intlShip2ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            //境外运输方式3
                            $(layero).find("form input[name=intlShipSrv3]").val(assiFieldShip.intlShipSrv3);
                            $(layero).find("form input[name=intlShipSrv3Cost]").val(assiFieldShip.intlShipSrv3Cost);
                            $(layero).find("form input[name=intlShipSrv3AddedCost]").val(assiFieldShip.intlShipSrv3AddedCost);
                            if(assiFieldShip.intlShip3ToCountries){
                                var intlShip3ToCountries = assiFieldShip.intlShip3ToCountries.split(",");
                                for(var i=0; i<intlShip3ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip3ToCountries][value="+intlShip3ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            
                            //境外运输方式4
                            $(layero).find("form input[name=intlShipSrv4]").val(assiFieldShip.intlShipSrv4);
                            $(layero).find("form input[name=intlShipSrv4Cost]").val(assiFieldShip.intlShipSrv4Cost);
                            $(layero).find("form input[name=intlShipSrv4AddedCost]").val(assiFieldShip.intlShipSrv4AddedCost);
                            if(assiFieldShip.intlShip4ToCountries){
                                var intlShip4ToCountries = assiFieldShip.intlShip4ToCountries.split(",");
                                for(var i=0; i<intlShip4ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip4ToCountries][value="+intlShip4ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            
                            //境外运输方式5
                            $(layero).find("form input[name=intlShipSrv5]").val(assiFieldShip.intlShipSrv5);
                            $(layero).find("form input[name=intlShipSrv5Cost]").val(assiFieldShip.intlShipSrv5Cost);
                            $(layero).find("form input[name=intlShipSrv5AddedCost]").val(assiFieldShip.intlShipSrv5AddedCost);
                            if(assiFieldShip.intlShip5ToCountries){
                                var intlShip5ToCountries = assiFieldShip.intlShip5ToCountries.split(",");
                                for(var i=0; i<intlShip5ToCountries.length; i++){
                                    $(layero).find("form input[name=intlShip5ToCountries][value="+intlShip5ToCountries[i]+"]").prop("checked", true);
                                }
                            }
                            $(layero).find("form textarea[name=notShipToCountries]").val(assiFieldShip.notShipToCountries);
                            form.render();
                        }
                    }
                });
            },
            yes: function(index, layero) {
                var assiFieldShip = {};
                assiFieldShip.id = $(layero).find("form input[name=id]").val();
                assiFieldShip.name = $(layero).find("form input[name=name]").val();
                //国内1
                assiFieldShip.shipSrv1 = $(layero).find("form input[name=shipSrv1]").val();
                assiFieldShip.shipSrv1Cost = $(layero).find("form input[name=shipSrv1Cost]").val();
                assiFieldShip.shipSrv1AddedCost = $(layero).find("form input[name=shipSrv1AddedCost]").val();
                //国内2
                assiFieldShip.shipSrv2 = $(layero).find("form input[name=shipSrv2]").val();
                assiFieldShip.shipSrv2Cost = $(layero).find("form input[name=shipSrv2Cost]").val();
                assiFieldShip.shipSrv2AddedCost = $(layero).find("form input[name=shipSrv2AddedCost]").val();
                //国内运输3
                assiFieldShip.shipSrv3 = $(layero).find("form input[name=shipSrv3]").val();
                assiFieldShip.shipSrv3Cost = $(layero).find("form input[name=shipSrv3Cost]").val();
                assiFieldShip.shipSrv3AddedCost = $(layero).find("form input[name=shipSrv3AddedCost]").val();
                //国内运输4
                assiFieldShip.shipSrv4 = $(layero).find("form input[name=shipSrv4]").val();
                assiFieldShip.shipSrv4Cost = $(layero).find("form input[name=shipSrv4Cost]").val();
                assiFieldShip.shipSrv4AddedCost = $(layero).find("form input[name=shipSrv4AddedCost]").val();
                //境外1
                assiFieldShip.intlShipSrv1 = $(layero).find("form input[name=intlShipSrv1]").val();
                assiFieldShip.intlShipSrv1Cost = $(layero).find("form input[name=intlShipSrv1Cost]").val();
                assiFieldShip.intlShipSrv1AddedCost = $(layero).find("form input[name=intlShipSrv1AddedCost]").val();
                var intlShip1ToCountries = [];
                $(layero).find("form input[name=intlShip1ToCountries]:checked").each(function(){
                    intlShip1ToCountries.push($(this).val());
                });
                assiFieldShip.intlShip1ToCountries = intlShip1ToCountries.join(",");
                //境外2
                assiFieldShip.intlShipSrv2 = $(layero).find("form input[name=intlShipSrv2]").val();
                assiFieldShip.intlShipSrv2Cost = $(layero).find("form input[name=intlShipSrv2Cost]").val();
                assiFieldShip.intlShipSrv2AddedCost = $(layero).find("form input[name=intlShipSrv2AddedCost]").val();
                var intlShip2ToCountries = [];
                $(layero).find("form input[name=intlShip2ToCountries]:checked").each(function(){
                    intlShip2ToCountries.push($(this).val());
                });
                assiFieldShip.intlShip2ToCountries = intlShip2ToCountries.join(",");
                //境外运输3
                assiFieldShip.intlShipSrv3 = $(layero).find("form input[name=intlShipSrv3]").val();
                assiFieldShip.intlShipSrv3Cost = $(layero).find("form input[name=intlShipSrv3Cost]").val();
                assiFieldShip.intlShipSrv3AddedCost = $(layero).find("form input[name=intlShipSrv3AddedCost]").val();
                var intlShip3ToCountries = [];
                $(layero).find("form input[name=intlShip3ToCountries]:checked").each(function(){
                    intlShip3ToCountries.push($(this).val());
                });
                assiFieldShip.intlShip3ToCountries = intlShip3ToCountries.join(",");
                //境外运输4
                assiFieldShip.intlShipSrv4 = $(layero).find("form input[name=intlShipSrv4]").val();
                assiFieldShip.intlShipSrv4Cost = $(layero).find("form input[name=intlShipSrv4Cost]").val();
                assiFieldShip.intlShipSrv4AddedCost = $(layero).find("form input[name=intlShipSrv4AddedCost]").val();
                var intlShip4ToCountries = [];
                $(layero).find("form input[name=intlShip4ToCountries]:checked").each(function(){
                    intlShip4ToCountries.push($(this).val());
                });
                assiFieldShip.intlShip4ToCountries = intlShip4ToCountries.join(",");
                //境外运输5
                assiFieldShip.intlShipSrv5 = $(layero).find("form input[name=intlShipSrv5]").val();
                assiFieldShip.intlShipSrv5Cost = $(layero).find("form input[name=intlShipSrv5Cost]").val();
                assiFieldShip.intlShipSrv5AddedCost = $(layero).find("form input[name=intlShipSrv5AddedCost]").val();
                var intlShip5ToCountries = [];
                $(layero).find("form input[name=intlShip5ToCountries]:checked").each(function(){
                    intlShip5ToCountries.push($(this).val());
                });
                assiFieldShip.intlShip5ToCountries = intlShip5ToCountries.join(",");
                //获取物流规则
                assiFieldShip.rule = getRule($(layero).find(".assiFieldRuleForm"));
                
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url:ctx + "/assifieldebay/saveship.html",
                    dataType:"json",
                    contentType: 'application/json',
                    data:JSON.stringify(assiFieldShip),
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                        }else{
                            layer.msg("保存成功");
                            layer.close(index);
                            table.reload('et_table');
                        }
                    }
                });
            }
        });
    }
    function editGoodLocal(id){
        layer.open({
            type: 1,
            title: '商品所在地',
            content: $('#et_goodLocalEditLayer').html().replace(":rule",$("#et_ruleFormTpl").html()),
            area: ['80%', '100%'],
            btn: ['保存', '关闭'],
            success: function(layero, index){
            	//为了初始化面板
            	element.init();
                if(!id){
                    form.render();
                    return;
                }
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url:ctx + "/assifieldebay/getgoodlocal.html",
                    data:{id:id},
                    dataType:"json",
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                            layer.close(index);
                        }else{
                            var assiFieldGoodLocal = returnData.data;
                            //初始化模板规则
                            initRule($(layero).find(".assiFieldRuleForm"), assiFieldGoodLocal.rule);
                            $(layero).find("form input[name=id]").val(assiFieldGoodLocal.id);
                            $(layero).find("form input[name=name]").val(assiFieldGoodLocal.name);
                            $(layero).find("form input[name=goodsLocation]").val(assiFieldGoodLocal.goodsLocation);
                            $(layero).find("form input[name=goodsCountry]").val(assiFieldGoodLocal.goodsCountry);
                            form.render();
                        }
                    }
                });
            },
            yes: function(index, layero) {
                var assiFieldGoodLocal = {};
                assiFieldGoodLocal.id = $(layero).find("form input[name=id]").val();
                assiFieldGoodLocal.name = $(layero).find("form input[name=name]").val();
                assiFieldGoodLocal.goodsLocation = $(layero).find("form input[name=goodsLocation]").val();
                assiFieldGoodLocal.goodsCountry = $(layero).find("form input[name=goodsCountry]").val();
                //获取物流规则
                assiFieldGoodLocal.rule = getRule($(layero).find(".assiFieldRuleForm"));
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url:ctx + "/assifieldebay/savegoodlocal.html",
                    dataType:"json",
                    contentType: 'application/json',
                    data:JSON.stringify(assiFieldGoodLocal),
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                        }else{
                            layer.msg("保存成功");
                            layer.close(index);
                            table.reload('et_table');
                        }
                    }
                });
            }
        });
    }
    
    function editExcludeCountries(id){
        layer.open({
            type: 1,
            title: '不寄送国家',
            content: $('#et_excludeCountriesEditLayer').html().replace(":rule",$("#et_ruleFormTpl").html()),
            area: ['80%', '100%'],
            btn: ['保存', '关闭'],
            success: function(layero, index){
            	//为了初始化面板
            	element.init();
                if(!id){
                    form.render();
                    return;
                }
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url:ctx + "/assifieldebay/getexcludecountries.html",
                    data:{id:id},
                    dataType:"json",
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                            layer.close(index);
                        }else{
                            var assiFieldExcludeCountyies = returnData.data;
                            //初始化模板规则
                            initRule($(layero).find(".assiFieldRuleForm"), assiFieldExcludeCountyies.rule);
                            $(layero).find("form input[name=id]").val(assiFieldExcludeCountyies.id);
                            $(layero).find("form input[name=name]").val(assiFieldExcludeCountyies.name);
                            $(layero).find("form textarea[name=notShipToCountries]").val(assiFieldExcludeCountyies.notShipToCountries);
                            
                            form.render();
                        }
                    }
                });
            },
            yes: function(index, layero) {
                var assiFieldExcludeCountyies = {};
                assiFieldExcludeCountyies.id = $(layero).find("form input[name=id]").val();
                assiFieldExcludeCountyies.name = $(layero).find("form input[name=name]").val();
                assiFieldExcludeCountyies.notShipToCountries = $(layero).find("form textarea[name=notShipToCountries]").val();
                //获取物流规则
                assiFieldExcludeCountyies.rule = getRule($(layero).find(".assiFieldRuleForm"));
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url:ctx + "/assifieldebay/saveexcludecountries.html",
                    dataType:"json",
                    contentType: 'application/json',
                    data:JSON.stringify(assiFieldExcludeCountyies),
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                        }else{
                            layer.msg("保存成功");
                            layer.close(index);
                            table.reload('et_table');
                        }
                    }
                });
            }
        });
    }
    function editReturnPolicy(data){
        layer.open({
            type: 1,
            title: '退货政策',
            content: $('#et_returnPolicyLayer').html().replace(":rule",$("#et_ruleFormTpl").html()),
            area: ['80%', '100%'],
            btn: ['保存', '关闭'],
            success: function(layero, index){
            	//为了初始化面板
            	element.init();
                if(!data){
                    form.render();
                    return;
                }
                //初始化模板规则
                initRule($(layero).find(".assiFieldRuleForm"), data.rule);
                $(layero).find("form input[name=id]").val(data.id);
                $(layero).find("form input[name=name]").val(data.name);
                $(layero).find("form select[name=siteId]").val(data.siteId);
                $(layero).find("form select[name=returnsAcceptedOption]").val(data.returnsAcceptedOption);
                $(layero).find("form select[name=refundOption]").val(data.refundOption);
                $(layero).find("form select[name=returnsWithinOption]").val(data.returnsWithinOption);
                $(layero).find("form select[name=shippingCostPaidBy]").val(data.shippingCostPaidBy);
                $(layero).find("form select[name=internationalReturnsAcceptedOption]").val(data.internationalReturnsAcceptedOption);
                $(layero).find("form select[name=internationalRefundOption]").val(data.internationalRefundOption);
                $(layero).find("form select[name=internationalReturnsWithinOption]").val(data.internationalReturnsWithinOption);
                $(layero).find("form select[name=internationalShippingCostPaidBy]").val(data.internationalShippingCostPaidBy);
                $(layero).find("form textarea[name=returnDescription]").val(data.returnDescription);
                if(data.storeAcctIds){
                    var accts = data.storeAcctIds.split(",");
                    for(var i=0; i<accts.length; i++){
                        $(layero).find("form input[name=storeAcctId][value="+accts[i]+"]").prop("checked",true);
                    }
                    var isStoreAcctAll = $(layero).find("form input[name=storeAcctId]").not("input:checked").length==0;
                	$(layero).find("form input[name=storeAcctAll]").prop("checked",isStoreAcctAll);
                }
                form.render();
            },
            yes: function(index, layero) {
                var returnPolicy = {};
                returnPolicy.id = $(layero).find("form input[name=id]").val();
                returnPolicy.name = $(layero).find("form input[name=name]").val();
                returnPolicy.siteId = $(layero).find("form select[name=siteId]").val();
                returnPolicy.siteName = $(layero).find("form select[name=siteId] option:selected").text();
                returnPolicy.returnsAcceptedOption = $(layero).find("form select[name=returnsAcceptedOption]").val();
                returnPolicy.refundOption = $(layero).find("form select[name=refundOption]").val();
                returnPolicy.returnsWithinOption = $(layero).find("form select[name=returnsWithinOption]").val();
                returnPolicy.shippingCostPaidBy = $(layero).find("form select[name=shippingCostPaidBy]").val();
                returnPolicy.internationalReturnsAcceptedOption = $(layero).find("form select[name=internationalReturnsAcceptedOption]").val();
                returnPolicy.internationalRefundOption = $(layero).find("form select[name=internationalRefundOption]").val();
                returnPolicy.internationalReturnsWithinOption = $(layero).find("form select[name=internationalReturnsWithinOption]").val();
                returnPolicy.internationalShippingCostPaidBy = $(layero).find("form select[name=internationalShippingCostPaidBy]").val();
                returnPolicy.returnDescription = $(layero).find("form textarea[name=returnDescription]").val();
                var storeAcctIds = [];
                $(layero).find("form input[name=storeAcctId]:checked").each(function(){
                    storeAcctIds.push($(this).val());
                });
                returnPolicy.storeAcctIds = storeAcctIds.join(",");
                //获取物流规则
                returnPolicy.rule = getRule($(layero).find(".assiFieldRuleForm"));
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url:ctx + "/assifieldebay/savereturnpolicy.html",
                    dataType:"json",
                    contentType: 'application/json',
                    data:JSON.stringify(returnPolicy),
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                        }else{
                            layer.msg("保存成功");
                            layer.close(index);
                            table.reload('et_table');
                        }
                    }
                });
            }
        });
    }
    function editInfo(id){
        //添加信息的点击事件
        var et_discriptionHeadEditor;
        var et_shippingEditor;
        var et_paymentEditor;
        var et_teamsofsaleEditor;
        var et_returnpolicyEditor;
        var et_feedbackEditor;
        var et_aboutusEditor;
        var et_contactusEditor;
        layer.open({
            type: 1,
            title: '编辑销售信息',
            area:['100%','100%'],
            btn:['保存','关闭'],
            content: $('#et_infoLayer').html(),
            success: function(layero, index){
                et_discriptionHeadEditor = wangEditorRender('et_discriptionHead');
                et_shippingEditor = wangEditorRender('et_shipping');
                et_paymentEditor = wangEditorRender('et_payment');
                et_teamsofsaleEditor = wangEditorRender('et_teamsofsale'); 
                et_returnpolicyEditor = wangEditorRender('et_returnpolicy');
                et_feedbackEditor = wangEditorRender('et_feedback'); 
                et_aboutusEditor = wangEditorRender('et_aboutus');
                et_contactusEditor = wangEditorRender('et_contactus');
                ebayAcct_getAllEbayAcctTypeEnum();
                if(!id){
                    form.render();
                    return;
                }
                layui.admin.load.show();
                $.ajax({
                	type:"post",
                	url:ctx + "/assifieldebay/getinfo.html",
                	data:{id:id},
                	dataType:'json',
                	async:true,
                	success:function(returnData){
                	    layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                            layer.close(index);
                        }else{
                            var assiInfo = returnData.data;
                            var str = (assiInfo.acctTypes !=null && assiInfo.acctTypes !='') ?assiInfo.acctTypes.split(',') : [];
                            $(layero).find("form input[name=id]").val(assiInfo.id);
                            $(layero).find("form input[name=name]").val(assiInfo.name);
                            layui.formSelects.value('ebay-acct-type', str);
                            et_discriptionHeadEditor.txt.html(assiInfo.discriptionHead);
                            et_shippingEditor.txt.html(assiInfo.shipping);
                            et_paymentEditor.txt.html(assiInfo.payment);
                            et_teamsofsaleEditor.txt.html(assiInfo.teamsofsale);
                            et_returnpolicyEditor.txt.html(assiInfo.returnpolicy);
                            et_feedbackEditor.txt.html(assiInfo.feedback);
                            et_aboutusEditor.txt.html(assiInfo.aboutus);
                            et_contactusEditor.txt.html(assiInfo.contactus);
                            //ebaySite
                            //TODO siteIds
                            checkCheckbox($(layero).find("form input[name=siteIds]"),assiInfo.siteIds.split(","));
                            form.render();
                        }
                	}
                });
            },
            yes: function(index, layero){
                var data = {};
                data.id = $(layero).find("form input[name=id]").val();
                data.name = $(layero).find("form input[name=name]").val();
                data.discriptionHead = et_discriptionHeadEditor.txt.html();
                data.shipping = et_shippingEditor.txt.html();
                data.payment = et_paymentEditor.txt.html();
                data.teamsofsale = et_teamsofsaleEditor.txt.html();
                data.returnpolicy = et_returnpolicyEditor.txt.html();
                data.feedback = et_feedbackEditor.txt.html();
                data.aboutus = et_aboutusEditor.txt.html();
                data.contactus = et_contactusEditor.txt.html();

                var siteIds = [];
		    	$(layero).find('form input[name=siteIds]:checked').each(function(){
		    		siteIds.push($(this).val());
		    	});
                data.siteIds = siteIds.join(",");
                //适用账号类型多选取值
                var strs= layui.formSelects.value('ebay-acct-type', 'val');       //取值val数组
                var acctTypes = [];
                for(i = 0;i<strs.length;i++){
                    acctTypes.push(strs[i])
                }
                data.acctTypes = acctTypes.join(",");
                $.ajax({
                	type:"post",
                    url:ctx + "/assifieldebay/saveinfo.html",
                    data:data,
                    dataType:'json',
                    async:true,
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                        }else{
                            layer.msg("保存成功");
                            layer.close(index);
                            table.reload('et_table');
                        }
                    }
                });
            }
        })
    }
//  //控制运送国家
//  form.on('checkbox(et_worldwilde)', function(data){
//    $(data.elem).parent("div").next("div").find("input").prop("checked", false);
//    $(data.elem).parent("div").next("div").find("input").prop("disabled", data.elem.checked);
//    form.render();
//  });  
    
    
    //店铺与全部店铺全选
    form.on('checkbox(et_storeAcctAll)', function(data){
      $(data.elem).parent(".layui-inline").next(".layui-inline").find("input").prop("checked", data.elem.checked);
      form.render();
    });  
    form.on('checkbox(et_storeAcctOne)', function(data){
      var checkNum = $(data.elem).parent(".layui-inline").find("input[name=storeAcctIds]:checked").length;
      var totalNum = $(data.elem).parent(".layui-inline").find("input[name=storeAcctIds]").length;
      $(data.elem).parent(".layui-inline").prev(".layui-inline").find("input[name=storeAcctIds]").prop("checked",checkNum==totalNum);
      form.render();
    });  
    
    //选择店铺
    form.on('radio(et_siteIdFilter)', function(data){
        selectebayShipTo1(data.value, $(data.elem).parents(".layui-collapse").find("form .ebayShipTo1"));
        selectebayShipTo2(data.value, $(data.elem).parents(".layui-collapse").find("form .ebayShipTo2"));
        selectebayShipTo3(data.value, $(data.elem).parents(".layui-collapse").find("form .ebayShipTo3"));
        selectebayShipTo4(data.value, $(data.elem).parents(".layui-collapse").find("form .ebayShipTo4"));
        selectebayShipTo5(data.value, $(data.elem).parents(".layui-collapse").find("form .ebayShipTo5"));
        form.render();
    });
    //初始化站点运送国家
    function selectebayShipTo1(siteId,ebayShipToDom){
    	var countryCodes = ebayShipTo[siteId];
    	//封装html
    	var str = "";
    	for(var i in countryCodes){
    		str += '<input name="intlShip1ToCountries" type="checkbox" title="'+countryCodes[i]+'" value="'+countryCodes[i]+'" lay-skin="primary">';
    	}
    	//初始化
    	ebayShipToDom.html(str);
      	form.render();
    }
    function selectebayShipTo2(siteId,ebayShipToDom){
    	var countryCodes = ebayShipTo[siteId];
    	//封装html
    	var str = "";
    	for(var i in countryCodes){
    		str += '<input name="intlShip2ToCountries" type="checkbox" title="'+countryCodes[i]+'" value="'+countryCodes[i]+'" lay-skin="primary">';
    	}
    	//初始化
    	ebayShipToDom.html(str);
      	form.render();
    }
    function selectebayShipTo3(siteId,ebayShipToDom){
    	var countryCodes = ebayShipTo[siteId];
    	//封装html
    	var str = "";
    	for(var i in countryCodes){
    		str += '<input name="intlShip3ToCountries" type="checkbox" title="'+countryCodes[i]+'" value="'+countryCodes[i]+'" lay-skin="primary">';
    	}
    	//初始化
    	ebayShipToDom.html(str);
      	form.render();
    }
    function selectebayShipTo4(siteId,ebayShipToDom){
    	var countryCodes = ebayShipTo[siteId];
    	//封装html
    	var str = "";
    	for(var i in countryCodes){
    		str += '<input name="intlShip4ToCountries" type="checkbox" title="'+countryCodes[i]+'" value="'+countryCodes[i]+'" lay-skin="primary">';
    	}
    	//初始化
    	ebayShipToDom.html(str);
      	form.render();
    }
    function selectebayShipTo5(siteId,ebayShipToDom){
    	var countryCodes = ebayShipTo[siteId];
    	//封装html
    	var str = "";
    	for(var i in countryCodes){
    		str += '<input name="intlShip5ToCountries" type="checkbox" title="'+countryCodes[i]+'" value="'+countryCodes[i]+'" lay-skin="primary">';
    	}
    	//初始化
    	ebayShipToDom.html(str);
      	form.render();
    }
    //账户选择
    function ebayAcct_getAllEbayAcctTypeEnum() {
        $.ajax({
            type: "post",
            url: ctx + "/sys/ebayAcctTypeEnum.html",
            dataType: "json",
            async: false,
            success: function(returnData) {
                if (returnData.code == "0000") {
                    $(returnData.data).each(function() {
                        $("#ebayAcctType select[name=acctType]").append("<option value='" + this.name + "'>" + this.name + "</option>");
                    });
                    formSelects.render('ebay-acct-type');
                } else {
                    layer.msg(returnData.msg);
                }
            }
        })
    }

})