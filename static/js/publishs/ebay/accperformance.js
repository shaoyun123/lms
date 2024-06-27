layui.use(['admin', 'form', 'laydate', 'formSelects', 'table','element'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        table = layui.table,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        layer = layui.layer,在线数量
        form = layui.form;

    form.render('select'); //刷新select选择框渲染
    form.render(null, 'component-form-element');
    element.render('breadcrumb', 'breadcrumb');

    form.on('submit(component-form-element)', function(data) {
        layer.msg(JSON.stringify(data.field));
        return false;
    });
    render_hp_orgs_users("#ebay_accperformance_searchForm", function(){
        formSelects.render('ebay_accperformance_depart_sel1');
    }); //渲染部门销售员店铺三级联动
    getAccountType();

    $('#storeAcctStatus').val('1')

    var columes = {
        'sel_Panect':[[ //表头
            {
                field: 'storeAcctId',
                title: '账户',
                rowspan:2,
                templet:'#accountTem',
                sort:true,
            }, {
                field: 'globalEvaluationStartDate',
                title: '全球',
                colspan:5
            }, {
                field: 'usEvaluationStartDate',
                title: '美国',
                colspan:5
            }, {
                field: 'ukEvaluationStartDate',
                title: '英国',
                colspan:5
            }, {
                field: 'deEvaluationStartDate',
                title: '德国',
                colspan:5
            }
        ],
        [
            {
                field: 'globalEvaluationStartDate',
                title: '对应时间',
                templet:'#gloMatchTimeTem',
                width:'6%'
            },{
                field:'globalCurrentLevel',
                title:'当前等级',
                sort:true,
                templet:'#gloCurrLevel'
            },{
                field:'globalProjectedLevel',
                title:'预测等级',
                sort:true,
                templet:'#gloPreLevel'
            },{
                field:'globalDefectivePercent',
                title:'不良交易率',
                templet:'<div>{{# if (d.globalDefectivePercent != null) { }}{{percentToStr(d.globalDefectivePercent)}}({{d.globalDefectiveNum}}/{{d.globalDefectiveTotalNum}}) {{#  } else if(d.globalDefectiveNum != null) { }} {{d.globalDefectiveNum}}笔  {{# } }}</div>',
                sort:true
            },{
                field:'globalClaimsSafPercent',
                title:'升级case',
                templet:'<div>{{# if (d.globalClaimsSafPercent != null) { }}{{percentToStr(d.globalClaimsSafPercent)}}({{d.globalClaimsSafNum}}/{{d.globalClaimsSafTotalNum}}) {{#  } else if(d.globalClaimsSafNum != null) { }} {{d.globalClaimsSafNum}}笔  {{# } }}</div>',
                sort:true
            },{
                field: 'usEvaluationStartDate',
                title: '对应时间',
                templet:'#usMatchTimeTem',
                width:'6%'
            },{
                field:'usCurrentLevel',
                title:'当前等级',
                sort:true,
                templet:'#usCurrLevel'
            },{
                field:'usProjectedLevel',
                title:'预测等级',
                sort:true,
                templet:'#usPreLevel'
            },{
                field:'usDefectivePercent',
                title:'不良交易率',
                templet:'<div>{{# if (d.usDefectivePercent != null) { }}{{percentToStr(d.usDefectivePercent)}}({{d.usDefectiveNum}}/{{d.usDefectiveTotalNum}}) {{#  } else if(d.usDefectiveNum != null) { }} {{d.usDefectiveNum}}笔  {{# } }}</div>',
                sort:true
            },{
                field:'usClaimsSafPercent',
                title:'升级case',
                templet:'<div>{{# if (d.usClaimsSafPercent != null) { }}{{percentToStr(d.usClaimsSafPercent)}}({{d.usClaimsSafNum}}/{{d.usClaimsSafTotalNum}}) {{#  } else if(d.usClaimsSafNum != null) { }} {{d.usClaimsSafNum}}笔  {{# } }}</div>',
                sort:true,
            },{
                field: 'ukEvaluationStartDate',
                title: '对应时间',
                templet:'#ukMatchTimeTem',
                width:'6%'
            },{
                field:'ukCurrentLevel',
                title:'当前等级',
                sort:true,
                templet:'#ukCurrLevel'
            },{
                field:'ukProjectedLevel',
                title:'预测等级',
                sort:true,
                templet:'#ukPreLevel'
            },{
                field:'ukDefectivePercent',
                title:'不良交易率',
                templet:'<div>{{# if (d.ukDefectivePercent != null) { }}{{percentToStr(d.ukDefectivePercent)}}({{d.ukDefectiveNum}}/{{d.ukDefectiveTotalNum}}) {{#  } else if(d.ukDefectiveNum != null) { }} {{d.ukDefectiveNum}}笔  {{# } }}</div>',
                sort:true
            },{
                field:'ukClaimsSafPercent',
                title:'升级case',
                templet:'<div>{{# if (d.ukClaimsSafPercent != null) { }}{{percentToStr(d.ukClaimsSafPercent)}}({{d.ukClaimsSafNum}}/{{d.ukClaimsSafTotalNum}}) {{#  } else if(d.ukClaimsSafNum != null) { }} {{d.ukClaimsSafNum}}笔  {{# } }}</div>',
                sort:true
            },{
                field: 'deEvaluationStartDate',
                title: '对应时间',
                templet:'#deMatchTimeTem',
                width:'6%'
            },{
                field:'deCurrentLevel',
                title:'当前等级',
                sort:true,
                templet:'#germCurrLevel'
            },{
                field:'deProjectedLevel',
                title:'预测等级',
                sort:true,
                templet:'#germPreLevel'
            },{
                field:'deDefectivePercent',
                title:'不良交易率',
                templet:'<div>{{# if (d.deDefectivePercent != null) { }}{{percentToStr(d.deDefectivePercent)}}({{d.deDefectiveNum}}/{{d.deDefectiveTotalNum}}) {{#  } else if(d.deDefectiveNum != null) { }} {{d.deDefectiveNum}}笔  {{# } }}</div>',
                sort:true
            },{
                field:'deClaimsSafPercent',
                title:'升级case',
                templet:'<div>{{# if (d.deClaimsSafPercent != null) { }}{{percentToStr(d.deClaimsSafPercent)}}({{d.deClaimsSafNum}}/{{d.deClaimsSafTotalNum}}) {{#  } else if(d.deClaimsSafNum != null) { }} {{d.deClaimsSafNum}}笔 {{# } }}</div>',
                sort:true
            }

        ]
],
        'policy_Performance':[[ //表头
            {
                field: 'storeAcctName',
                title: '账户',
                templet:'#accountTem',
                sort:true,
            }, {
                field: 'longTermStatus',
                title: '综合表现',
                templet:'#longTermStatus',
                sort:true,
            }, {
                field: 'newwarehouseStatus',
                title: '海外仓服务(新)',
                templet:'#newwarehouseStatus',
                sort:true,
            }, {
                field: 'shippingStatus1',
                title: '货运(1-8周)',
                templet:'#shippingStatus1',
                sort:true,
            }, {
                field: 'shippingStatus2',
                title: '货运(5-12周)',
                templet:'#shippingStatus2',
                sort:true,
            },  {
                field: 'speedPakStatus',
                title: 'SPEED PAK',
                templet:'#speedPakStatus',
                sort:true,
            },{
                field:'pgcStatus',
                title: '商业计划追踪',
                templet:'#pgcStatus',
                sort:true,
            },  {
                field: 'prodDescStatus',
                title: '物品与描述不符',
                templet:'#prodDescStatus',
                sort:true,
            },  {
                field: 'directPostStatus',
                title: '直邮合规物流比例',
                templet:'#directPostStatus',
                sort:true,
            }
        ]
],
        'sel_Limit':[[ //表头
            {
                type: "checkbox" 
            },
            {
                field: 'storeAcctName',
                title: '账户',
                templet:'#accountTem',
                sort:true,
            }, {
                field: 'amountLimitPercent',
                title: '可刊登商品金额可用率',
                templet:'<div>{{# if(d.amountLimitPercent){ }}{{percentToStr(d.amountLimitPercent)}}{{# }else{ }}无数据{{# } }}</div>',
                sort:true,
            }, {
                field: 'quantityLimitPercent',
                title: '可刊登商品数量可用率',
                templet:'<div>{{# if(d.quantityLimitPercent){ }}{{percentToStr(d.quantityLimitPercent)}}{{# }else{ }}无数据{{# } }}</div>',
                sort:true,
            }, {
                field: 'amountHistoryValue',
                title: '可刊登商品金额额度',
                templet:'#amountHistoryValue',
                sort:true,
            }, {
                field: 'quantityHistoryCount',
                title: '可刊登商品数量额度',
                sort:true,
            }, {
                field: 'amountLimitRemaining',
                title: '可刊登商品金额剩余',
                templet:'#amountLimitRemaining',
                sort:true,
            }, {
                field: 'quantityLimitRemaining',
                title: '可刊登商品数量剩余',
                sort:true,
            }, {
                field: 'listedAndSold',
                title: 'listed and sold',
                sort:true,
            }, {
                field: 'quantityListingCount',
                title: '在线数量',
                sort:true,
            }, {
                field: 'totalSoldCount',
                title: '近31天订单数',
                sort:true,
            }, {
                field:'totalSoldValue',
                title: '近31天销售额',
                templet:'#totalSoldValue',
                sort:true,
            }, {
                title:'操作',
                toolbar: '#ebay_accountTem_toolbar'
            }
        ]
],
        'log_Index':[[ //表头
            {
                field: 'storeAcctName',
                title: '账户',
                rowspan:2,
                templet:'#accountTem',
                sort:true,
            }, {
                field: 'eubStatus',
                title: 'EUB(时间范围)',
                colspan:3
            }, {
                field: 'edsStatus',
                title: 'EDS(时间范围)',
                colspan:3
            }, {
                field: 'speedpakStatus',
                title: 'SpeedPAK物流指标(时间范围)',
                colspan:6
            }, {
                field: 'speedpakExpeditedPercent',
                title: 'SpeedPAK买家选择',
                colspan:6
            }
        ],
        [
            {
                field: 'eubStatus',
                title: '表现',
                templet:'#eubStatus',
                sort:true,
            },{
                field:'eubCbtAdoptionPercent',
                title:'直邮交易比例',
                templet:'<div>{{# if (d.eubCbtNum != null) { }} {{percentToStr(d.eubCbtAdoptionPercent)}}({{d.eubCbtNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field:'eubWhAdoptionPercent',
                title:'海外仓交易比例',
                templet:'<div>{{# if (d.eubWhNum != null) { }} {{percentToStr(d.eubWhAdoptionPercent)}}({{d.eubWhNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field:'edsStatus',
                title:'表现',
                templet:'#edsStatus',
                sort:true,
            },{
                field:'edsStdComplyPercent',
                title:'标准型',
                templet:'<div>{{# if (d.edsStdNum != null) { }} {{percentToStr(d.edsStdComplyPercent)}}({{d.edsStdNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field: 'edsEconComplyPercent',
                title: '经济型',
                templet:'<div>{{# if (d.edsEconNum != null) { }} {{percentToStr(d.edsEconComplyPercent)}}({{d.edsEconNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field:'speedpakStatus',
                title:'表现',
                templet:'#speedpakStatus',
                sort:true,
            },{
                field:'speedpakUsPercent',
                title:'美国>$5 (最低要求40%)',
                width:'8%',
                templet:'<div>{{# if (d.speedpakUsPercent != null) { }} {{percentToStr(d.speedpakUsPercent)}}({{d.speedpakUsNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field:'speedpakUkPercent',
                title:'英国>£5(最低要求30%)',
                width:'8%',
                templet:'<div>{{# if (d.speedpakUkPercent != null) { }} {{percentToStr(d.speedpakUkPercent)}}({{d.speedpakUkNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field:'speedpakDePercent',
                title:'德國>€5(最低要求30%)',
                width:'8%',
                templet:'<div>{{# if (d.speedpakDePercent != null) { }} {{percentToStr(d.speedpakDePercent)}}({{d.speedpakDeNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field: 'speedpakAuPercent',
                title: '澳洲>A$8(最低要求20%)',
                width:'8%',
                templet:'<div>{{# if (d.speedpakAuPercent != null) { }} {{percentToStr(d.speedpakAuPercent)}}({{d.speedpakAuNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field:'speedpakCaPercent',
                title:'加拿大>C$8(最低要求20%)',
                width:'8%',
                templet:'<div>{{# if (d.speedpakCaPercent != null) { }} {{percentToStr(d.speedpakCaPercent)}}({{d.speedpakCaNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field:'speedpakExpeditedPercent',
                title:'加快型',
                templet:'<div>{{# if (d.speedpakExpeditedPercent != null) { }} {{percentToStr(d.speedpakExpeditedPercent)}}({{d.speedpakExpeditedNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field:'speedpakStandardPercent',
                title:'标准型',
                templet:'<div>{{# if (d.speedpakStandardPercent != null) { }} {{percentToStr(d.speedpakStandardPercent)}}({{d.speedpakStandardNum}}笔) {{# } }}</div>',
                sort:true,
            },{
                field:'speedpakEconomyPercent',
                title:'经济型',
                templet:'<div>{{# if (d.speedpakEconomyPercent != null) { }} {{percentToStr(d.speedpakEconomyPercent)}}({{d.speedpakEconomyNum}}笔) {{# } }}</div>',
                sort:true,
            }

        ]
    ],
        'withdrawal_Index':[
            [
              {
                field: "storeAcct",
                title: "账号",
                templet:
                  '<div><span class="af_storeAcct">{{d.storeAcct}}</span><pre class="layui-hide">刷新时间:{{Format(d.weeklyDataRefreshDate,"yyyy-MM-dd hh:mm:ss")}}</pre><input hidden name="id" value="{{d.id}}"></div>',
              },
              {
                field: "summaryStatus",
                title: "总体状态",
                sort: true,
                templet: d => showIcon(d.summaryStatus),
              },
              {
                field: "scenarioIdStatus",
                title: "受限状态",
                templet: d => showIcon(d.scenarioIdStatus),
              },
              {
                field: "accountStatus",
                title: "账号状态",
                templet: d => showIcon(d.accountStatus),
              },
              {
                field: "daysToLastAdjCurrentValue",
                title: "距离上次调额天数",
                templet: d => showValColor(d.daysToLastAdjStatus, d.daysToLastAdjCurrentValue),
              },
              {
                field: "daysToFirstTransCurrentValue",
                title: "距离第一次销售天数",
                templet: d => showValColor(d.daysToFirstTransStatus, d.daysToFirstTransCurrentValue),
              },
              {
                field: "beforeSellerStandardStatus",
                title: "先前卖家级别",
                templet: d => showIcon(d.beforeSellerStandardStatus),
              },
              {
                field: "currentSellerStandardStatus",
                title: "当前卖家级别",
                templet: d => showIcon(d.currentSellerStandardStatus),
              },
              {
                field: "qtyUtilizationCurrentValue",
                title: "额度使用率",
                templet: d => showValColor(d.qtyUtilizationStatus, d.qtyUtilizationCurrentValue),
              },
              {
                field: "gmsUtilizationCurrentValue",
                title: "销售额度使用率",
                templet: d => showValColor(d.gmsUtilizationStatus, d.gmsUtilizationCurrentValue),
              },
              {
                field: "qtyConversionRtCurrentValue",
                title: "额度转化率",
                templet: d => showValColor(d.qtyConversionRtStatus, d.qtyConversionRtCurrentValue),
              },
              {
                field: "gmsConversionRtCurrentValue",
                title: "销售额度转化率",
                templet: d => showValColor(d.gmsConversionRtStatus, d.gmsConversionRtCurrentValue),
              },
              {
                field: "lateShpRateStatus",
                title: "延迟送达率",
                templet: d => showIcon(d.lateShpRateStatus),
              },
              {
                field: "openClaimRateStatus",
                title: "未解决纠纷率",
                templet: d => showIcon(d.openClaimRateStatus),
              },
              {
                field: "veroIndCurrentValue",
                title: "是否涉及侵权",
                templet: d => showValColor(d.veroIndStatus, d.veroIndCurrentValue),
              },
              {
                field: "dfRtCurrentValue",
                title: "近12周不良交易率",
                templet: d => showValColor(d.dfRtStatus, d.dfRtCurrentValue),
              },
            ],
          ]
    }

    function showIcon(val) {
        if (val !== undefined) {
          if (val === "VALID") {
            return `<i class="layui-icon iconfont fGreen">&#xe60d;</i>`
          }
          return `<i class="layui-icon iconfont fRed">&#xe710;</i>`
        }
        return ""
      }

    function getAccountType() {
        commonReturnPromise({
            url: '/lms/sys/ebayAcctTypeEnum.html',
            type: 'post',
        }).then((res)=> {
            commonRenderSelect('ebay_accperformance_Account_type', res, {code: 'name', name: 'name'})
            formSelects.render('ebay_accperformance_Account_type');
        }).catch((err)=>{
            layer.msg(err, {icon:2});
        })
    }

    $("#ebay_accperformance_search_submit").on("click", function() {
        const tableId = $('#tabList .layui-this').data('index')
        tablerender(tableId);
    });
      
    function showValColor(status, val) {
    let str = `<div>${val}</div>`
    if(status!==undefined){
        str = `<div class="${status === "VALID" ? "fGreen" : "fRed"}">${val}</div>`
    }
    return val !== undefined ? str : ""
    }
      

    urls={
        'sel_Panect':'/ebayaccountdata/liststandards.html',
        'policy_Performance':'/ebayaccountdata/listperformance.html',
        'sel_Limit':'/ebayaccountdata/listselling.html',
        'log_Index':'/ebayaccountdata/listshipping.html',
        'withdrawal_Index': '/ebayaccountdata/listEbaylimitAdjustmentCheck'
    }
    /**
     * 获取搜索参数
     */
    function getSerachData() {
        var obj = {};
        var currentStoreAccts = formSelects.value("ebay_accperformance_store_sel", "val"); // 所选账户
        if (currentStoreAccts == null || currentStoreAccts.length == 0) {
            var currentDepartAccts = formSelects.value("ebay_accperformance_depart_sel1", "val"); 
            var currentSaleAccts = formSelects.value("ebay_accperformance_salesman_sel", "val"); 
            // 如果选择部门和销售 
            if (currentDepartAccts.length > 0 || currentSaleAccts.length > 0) {
                let storeAcctIdList = storeOptionData && storeOptionData.map(item => item.id)
                obj.storeAcctIdList = storeAcctIdList.length ? storeAcctIdList : [-1]
            } else {
                obj.storeAcctIdList = [];
            }
        } else {
            obj.storeAcctIdList = currentStoreAccts;
        }
        var currentAccountAccts = formSelects.value("ebay_accperformance_Account_type", "val"); 
        if (currentAccountAccts == null || currentAccountAccts.length == 0) { 
            obj.acctTypeList = [];
        } else {
            obj.acctTypeList = currentAccountAccts;
        }

        obj.storeAcctStatus = $('#storeAcctStatus').val();
        return obj;
    }
    function tablerender(tablename){
        let data = getSerachData();
        table.render({
            elem: '#'+tablename,
            height: 'full-180',
            url: ctx + urls[tablename], //数据接口
            method: 'post',
            contentType: 'application/json; charset=UTF-8',
            page: false, //开启分页
            toolbar: false, //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            totalRow: true, //开启合计行
            cols: columes[tablename],
            where: data,
	        done: function(res, curr, count){
            if(tablename==='log_Index'){
	    	    if(res.code == "0000"){
	    		var eubStartTime = 0;
	    		var edsStartTime = 0;
	    		var speedpakStartTime = 0;
	    		var eubEndTime = 0;
	    		var edsEndTime = 0;
	    		var speedpakEndTime = 0;
	    		for(var i=0; i<res.data.length; i++){
	    			var data = res.data[i];
	    			if(data.syncStatus == true && data.eubStartTime>eubStartTime){
	    				eubStartTime = data.eubStartTime;
	    				eubEndTime = data.eubEndTime;
	    			}
	    			if(data.syncStatus == true && data.edsStartTime>edsStartTime){
	    				edsStartTime = data.edsStartTime;
	    				edsEndTime = data.edsEndTime;
	    			}
	    			if(data.syncStatus == true && data.speedpakStartTime>speedpakStartTime){
	    				speedpakStartTime = data.speedpakStartTime;
	    				speedpakEndTime = data.speedpakEndTime;
	    			}
	    		}
    		    var eubTime = Format(eubStartTime,"yyyy-MM-dd")+"-"+Format(eubEndTime,"yyyy-MM-dd");
				var edsTime = Format(edsStartTime,"yyyy-MM-dd")+"-"+Format(edsEndTime,"yyyy-MM-dd");
				var speedpakTime = Format(speedpakStartTime,"yyyy-MM-dd")+"-"+Format(speedpakEndTime,"yyyy-MM-dd");
				$("#log_Index").next('div').find('table th[data-field=EUB] span').html("EUB("+eubTime+")");
				$("#log_Index").next('div').find('table th[data-field=eds] span').html("EDS("+edsTime+")");
				$("#log_Index").next('div').find('table th[data-field=speedpak_log] span').html("SpeedPAK物流指标("+speedpakTime+")");
                }
                }
            if(tablename==='withdrawal_Index'){
                $('#withdrawal_Index').next().find('.layui-table-body').find("table" ).find("tbody").on('click','tr',function(){
                    const id = $(this).find('input[name=id]').val()
                    // 当前行数据
                    const curObj = res.data.filter(item=>item.id==id)[0];
                    withdrawalInfo(curObj)
                });
            }
	        }
        });
    }
    $('#tabList li').click(function(){
        var index = $(this).attr('data-index');
        tablerender(index);
        let displayStyle=index === 'sel_Limit' ? 'block' : 'none'
        $('#ebay_accountTem_selSync').css('display', displayStyle)
    })

    $('#ebay_accountTem_selSync').click(function(){
        const tableId = $('#tabList .layui-this').data('index')
        const { data } = table.checkStatus(tableId)
        if(!data.length) return layer.msg('请选择数据',{icon: 7})
        const storeAcctIdList = data.map(item=>item.storeAcctId)
        selSync(storeAcctIdList)
    })

    table.on('tool(sel_Limit)',function(obj){
        const {data, event} = obj
        if(event === 'sync'){
            selSync([data.storeAcctId])
        }
    })

    // 额度指标具体内容
    function withdrawalInfo(obj) {
        const data = [
          { title: "受限状态", key: "scenarioId", standardVal: "", curVal: "", status: "" },
          { title: "账号状态", key: "accountStatus", standardVal: "", curVal: "", status: "" },
          { title: "距离上次调额天数", key: "daysToLastAdj", standardVal: "", curVal: "", status: "" },
          { title: "距离第一次销售天数", key: "daysToFirstTrans", standardVal: "", curVal: "", status: "" },
          { title: "先前卖家级别", key: "beforeSellerStandard", standardVal: "", curVal: "", status: "" },
          { title: "当前卖家级别", key: "currentSellerStandard", standardVal: "", curVal: "", status: "" },
          { title: "卖家级别预估", key: "sellerStandardFuture", standardVal: "", curVal: "", status: "" },
          { title: "额度使用率", key: "qtyUtilization", standardVal: "", curVal: "", status: "" },
          { title: "销售额度使用率", key: "gmsUtilization", standardVal: "", curVal: "", status: "" },
          { title: "额度转化率", key: "qtyConversionRt", standardVal: "", curVal: "", status: "" },
          { title: "销售额度转化率", key: "gmsConversionRt", standardVal: "", curVal: "", status: "" },
          { title: "延迟送达率", key: "lateShpRate", standardVal: "", curVal: "", status: "" },
          { title: "未解决纠纷率", key: "openClaimRate", standardVal: "", curVal: "", status: "" },
          { title: "是否涉及侵权", key: "veroInd", standardVal: "", curVal: "", status: "" },
          { title: "近12周纠纷率", key: "claimRt", standardVal: "", curVal: "", status: "" },
          { title: "近12周不良交易率", key: "dfRt", standardVal: "", curVal: "", status: "" },
        ]
        data.forEach((item, index) => {
          data[index].standardVal = obj[item.key + "StandardValue"]
          data[index].curVal = obj[item.key + "CurrentValue"]
          if (["beforeSellerStandard", "currentSellerStandard", "sellerStandardFuture"].includes(item.key)) {
            data[index].standardVal && (data[index].standardVal = data[index].standardVal.replaceAll(",", "\n"))
            data[index].curVal && (data[index].curVal = data[index].curVal.replaceAll(",", "\n"))
          }
          if (item.key === "accountStatus") {
            data[index].status = obj[item.key]
          } else {
            data[index].status = obj[item.key + "Status"]
          }
        })
        layer.open({
          type: 1,
          area: ["800px", "650px"],
          title: "详情",
          content: $("#ebay_accountTem_withdrawal_Index_tpl").html(),
          success: function (layero, index) {
            table.render({
              elem: "#ebay_accountTem_withdrawal_Index_table",
              height: "550px",
              data,
              page: false, //开启分页
              limit: 100,
              toolbar: false, //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
              cols: [
                [
                  {
                    field: "title",
                    title: "指标",
                  },
                  {
                    field: "standardVal",
                    title: "标准值",
                  },
                  {
                    field: "curVal",
                    title: "当前值",
                    templet: d => showValColor(d.status, d.curVal),
                  },
                  {
                    field: "status",
                    title: "状态",
                    templet: d => showIcon(d.status),
                  },
                ],
              ],
            })
          },
        })
      }

    function selSync(storeAcctIdList){
        commonReturnPromise({
            url:ctx + `/ebayaccountdata/syncselling`,
            type:'post',
            contentType: 'application/json;charset=UTF-8',
            params: JSON.stringify(storeAcctIdList)
        }).then(res=>{
            layer.msg(res,{icon:1})
            const tableId = $('#tabList .layui-this').data('index')
            tablerender(tableId)
        })
    }


//悬浮显示全部错误信息
$("body").on('mouseover', '.af_storeAcct', function() {
    var content = "<pre>" + $(this).next("pre").text() + "</pre>";
    var color = 'green';
    if(content.indexOf("同步成功")==-1){
    	color = 'red';
    }
    layer.tips(content, $(this),{
      tips: [2, color],
      time: 0
    });
});
$("body").on('mouseout', '.af_storeAcct', function() {
    layer.closeAll('tips');
});

$(".af_syncBtn").click(function(){
	layui.admin.load.show();
    layer.msg("正在同步所有店铺账号数据，这需要几分钟。。。");
    $.ajax({
        type: "post",
        url: ctx + "/ebayaccountdata/syncall.html",
        async: true,
        dataType: "json",
        success: function(returnData) {
            layui.admin.load.hide();
            if (returnData.code != "0000") {
                layer.msg(returnData.msg);
            } else {
                layer.msg("同步完成");
                $("a[layadmin-event='refresh']").trigger("click");
            }
        }
    });
})





});
function afDetail(storeAcctId){
    layer.open({
        type: 1,
        area: ['100%', '100%'],
        title:'详情',
        content: "loading",
        success: function(layero, index) {
            
            $.ajax({
            	type:"post",
            	url:ctx+"/ebayaccountdata/detail.html",
            	data:{storeAcctId:storeAcctId},
            	dataType:"json",
            	success:function(returnData){
            		if(returnData.code != "0000"){
            			layer.msg(returnData.msg, {icon:5});
            			layer.close(index);
            		}else{
            			var data = returnData.data;
            			if(data.accountData && data.accountData.data){
            				data.accountData.data = eval('(' + data.accountData.data + ')');
            			}
            			var content = template('detail_Template', data);
            			$(layero).find(".layui-layer-content").html(content);
            			//下载海外仓服务交易数据
                        $("#af_downloadWhDataBtn").click(function(){
                            layer.msg("正在导出海外仓相关交易数据。。。");
                            var url = ctx + "/ebayaccountdata/exportwhdata.html";
                            var data = {storeAcctId : $(this).data("id")};
                            submitForm(data,url,"_blank");
                        })
            		}
            	}
            });
        }
    })
}