layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage','laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        table=layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        $ = layui.$;
    form.render();
    formSelects.render('storeAcctIdS');
    formSelects.render('siteListS');


    //获取当前时间之前的12个月份时间
    function getfinaldate(number){
        var current = new Date();
        var currentyear = current.getFullYear();
        var currentmonth = current.getMonth()+1;
        if(currentmonth-number>0){
            return currentyear+'-'+(currentmonth-number);
        }else{
            return (currentyear-1)+'-'+(12-(number-currentmonth));
        }
    }
    //初始化表单下拉列表
    $(function(){
        //初始化下拉列表
        $.ajax({
            type:"get",
            url:ctx + "/ebayOperatingOverview/ebayOperOverSelect.html",
            dataType:"json",
            success:function(returnData){
                if(returnData.code == "0000"){
                    for(var i in returnData.data){
                        if(returnData.data[i].length>0){
                        append_op(i,returnData.data[i]);
                        }
                    }
                form.render('select');
                formSelects.render('storeAcctIdS');
                formSelects.render('siteListS');
                }
            }
        });

        //下拉框数据填入
        function append_op(domName,obj){
            var $li = '<option value="">全部</option>';
            for(var i in obj){
                if(obj[i]){
                    switch (domName){
                        case "siteList":
                        $li += '<option value='+obj[i]+'>'+obj[i]+'</option>';
                        break;
                        case "sysBizDictDetailList":
                        $li += '<option value='+obj[i].name+'>'+obj[i].name+'</option>'
                        break;
                        case "sysUserList":
                        $li += '<option value="' + obj[i].id + '" >' + obj[i].userName + '</option>'
                        break;
                        case "sysSalesPlatAcctList":
                        $li += '<option value="' + obj[i].id + '" >' + obj[i].storeAcct + '</option>'
                        break;
                        default:
                        $li += '<option value="">没有数据</option>'

                    }
                }
            }
            $('#' + domName).append($li);
        }
    });
    //店铺下拉列表随销售主管下拉列表联动
    form.on('select(sellLeaderId)', function(data){
        var sellLeaderId = data.value;
        $.ajax({
            type:"post",
            url:ctx + "/ebayOperatingOverview/listAcctBySellLeaderId.html?sellLeaderId="+sellLeaderId,
            dataType:"json",
            success:function(returnData){
                if(returnData.code != "0000"){
                    $('select[name="storeAcctIdS"]').append('<option value="">没有数据</option>');
                }else{
                    $('select[name="storeAcctIdS"]').empty();
                    var $option=returnData.data.length>0?"<option value=''>全部</option>":"";
                    returnData.data.forEach(function(item){
                        $option += '<option value='+item.id+'>'+item.storeAcct+'</option>';
                    });
                    $('select[name="storeAcctIdS"]').append($option);
                }
                form.render('select');
            }
        });
      });
    //渲染日期时间选择
    laydate.render({
        elem: '#registerTime', //指定元素
        range:true,
        type: 'date'
    }); 
    //设置运营总览，销售额度趋势，店铺达标率表头列名称
    //运营总览
    var handle_pandect_col = [[
        {field: "storeAcct",title: "店铺",rowspan:2,sort:true},
        {field: "isStandard",title: "计入考核",rowspan:2,templet:"#pl_isStatistical"},
        {field: "userName",title: "销售主管",rowspan:2,sort:true},
        {field: "acctType",title: "店铺类型",rowspan:2,sort:true},
        {field: "registrationDate",title: "注册时间",rowspan:2,templet:'#pl_registerTime',sort:true},
        {field: "site",title: "主站点",rowspan:2,sort:true},
        {field: "storeWarehouses",title: "仓库属性",rowspan:2,templet:"#pl_storeWarehouses",sort:true},
        {field: "storeis",title: "是否达标",rowspan:2,templet:"#pl_storeis",sort:true},
        {field: "sellamount",title: "销售额($)",colspan:12,sort:true},
        {field: "remark",title: "备注",rowspan:2,templet:"#pl_notice",sort:true},
    ],[
        {field: "salesamount0",title: getfinaldate(1),sort:true},
        {field: "salesamount1",title: getfinaldate(2),sort:true},
        {field: "salesamount2",title: getfinaldate(3),sort:true},
        {field: "salesamount3",title:getfinaldate(4),sort:true},
        {field: "salesamount4",title:getfinaldate(5),sort:true},
        {field: "salesamount5",title:getfinaldate(6),sort:true},
        {field: "salesamount6",title: getfinaldate(7),sort:true},
        {field: "salesamount7",title: getfinaldate(8),sort:true},
        {field: "salesamount8",title: getfinaldate(9),sort:true},
        {field: "salesamount9",title: getfinaldate(10),sort:true},
        {field: "salesamount10",title: getfinaldate(11),sort:true},
        {field: "salesamount11",title: getfinaldate(12),sort:true},
    ]],
    //销售额度趋势
    sell_amount_col=[[
        {field: "storeAcct",title: "店铺",sort:true},
        {field: "userName",title: "销售主管",sort:true},
        {field: "salesNumLimit0",title: getfinaldate(1),sort:true},
        {field: "salesNumLimit1",title: getfinaldate(2),sort:true},
        {field: "salesNumLimit2",title: getfinaldate(3),sort:true},
        {field: "salesNumLimit3",title:getfinaldate(4),sort:true},
        {field: "salesNumLimit4",title:getfinaldate(5),sort:true},
        {field: "salesNumLimit5",title:getfinaldate(6),sort:true},
        {field: "salesNumLimit6",title: getfinaldate(7),sort:true},
        {field: "salesNumLimit7",title: getfinaldate(8),sort:true},
        {field: "salesNumLimit8",title: getfinaldate(9),sort:true},
        {field: "salesNumLimit9",title: getfinaldate(10),sort:true},
        {field: "salesNumLimit10",title: getfinaldate(11),sort:true},
        {field: "salesNumLimit11",title: getfinaldate(12),sort:true},
        {field: "note",title: "备注",templet:"#pl_notice"},
    ]
    ],   
    //店铺达标率 
    store_tostandard_col=[[
        {field: "sellLeader",title: "销售主管"},
        {field: "storeNum",title: "店铺数量"},
        {field: "statisticaslNum",title: "考核店铺数量"},
        {field: "successRateNum",title: "考核店铺达标数"},
        {field: "successRate",title: "达标率",templet:'#pl_successRate'},
    ]];
    //点击table切换表格渲染
    $('.table_tab .layui-tab ul li').click(function(){
        var title = $(this).attr('data-title');
        tablerender(title);
    })
    //封装表格渲染函数
    function tablerender(tablename){
        //不同表名对应表头列数据对象
        var obj={'handle_pandect':handle_pandect_col,'sell_amount':sell_amount_col,'store_tostandard':store_tostandard_col}
        //不同表名对应对应请求url
        var urlbobj={
            "handle_pandect":"/ebayOperatingOverview/selectEbayOperatingOverview.html",
            "sell_amount":"/ebayOperatingOverview/selectEbayOperatingLimit.html",
            "store_tostandard":"/ebayOperatingOverview/storeUpToStandard.html"}
        table.render({
        elem: "#"+tablename,
        method: 'post',
        url:ctx +urlbobj[tablename],
        cols:obj[tablename],
        //totalRow:tablename==='store_tostandard'?true:false,
        created:function(res,count) {
            if(res.code == "0000"){
            //格式化为表格渲染要求数据格式
            if (tablename === "handle_pandect"){
                $('#pandect_num').text(res.count);
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].isStandard = res.data[i].ebayOperationSummarySaleList[0].isStandard;
                    res.data[i].remark = res.data[i].ebayOperationSummarySaleList[0].remark;
                    for (var j = 0; j < res.data[i].ebayOperationSummarySaleList.length; j++) {
                        var property = 'salesamount' + j;
                        res.data[i][property] = res.data[i].ebayOperationSummarySaleList[j].salesAmount;
                    }
                }
            } else if (tablename === "sell_amount") {
                $('#sellamount_num').text(res.count);
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].isStandard = res.data[i].operationSummaryLimitList[0].isStandard;
                    res.data[i].remark = res.data[i].operationSummaryLimitList[0].remark;
                    for (var j = 0; j < res.data[i].operationSummaryLimitList.length; j++) {
                        var property = 'salesNumLimit' + j;
                        res.data[i][property] = res.data[i].operationSummaryLimitList[j].salesNumLimit;
                    }
                }
            } else {
                $('#standardrate_num').text(res.count);
                console.log(res); 
                var totalstoreNum =0,totalcheckstore =0,totalqualifiednum = 0,totalqualifiedrate = 0;
                if(res.data.length>0){
                for(var i=0;i<res.data.length;i++){
                    totalstoreNum+=parseInt(res.data[i].storeNum);
                    totalcheckstore += parseInt(res.data[i].statisticaslNum);
                    totalqualifiednum+=parseInt(res.data[i].successRateNum);
                }  
                totalqualifiedrate = (totalqualifiednum/totalcheckstore*100).toFixed(2);
                res.data.push({"sellLeader":"合计","storeNum":totalstoreNum,"statisticaslNum":totalcheckstore,"successRateNum":totalqualifiednum,"successRate":totalqualifiedrate})  
                }
            }
        }
        },
        done: function(res, curr, count){
            var totalsuccessrate = parseFloat($('.layui-table-total td[data-field="successRateNum"] div').text())/parseFloat($('.layui-table-total td[data-field="statisticaslNum"] div').text());
            $('.layui-table-total td[data-field="successRate"]').find('div').text((totalsuccessrate*100).toFixed(2)+'%');
            $('.layui-icon-edit').click(function(){
            var storeAcctId = $(this).attr('data-id');
            var origintext = $(this).attr('data-text')==="undefined"?"":$(this).attr('data-text');
            //修改备注弹框
             layer.open({
                 type: 1,
                 title: "备注",
                 area: ["50%", "50%"],
                 shadeClose: false,
                 content: $("#store_detail_layer").html(),
                 btn: ['保存', '取消'],
                 success:function (index, layero) {
                     form.render();
                     $("#remark").val(origintext);
                 },
                 yes:function(index, layero){
                     var content=$("#remark").val();
                     var updatetype={"handle_pandect":"0","sell_amount":"1"};
                     var obj={};
                     obj.updateType= updatetype[tablename];
                     obj.remark= content;
                     obj.storeAcctId= storeAcctId;
                        $.ajax({
                            type:"post",
                            url:ctx + "/ebayOperatingOverview/modifyRemark.html",
                            dataType:"json",
                            data:{"obj":JSON.stringify(obj)},
                            success:function(returnData){
                                if(returnData.code==="0000"){
                                    layer.msg("修改备注成功!");
                                    tablerender(tablename);
                                }else{
                                    layer.msg(returnData.msg);
                                }
                            }
                        });
                     layer.close(index);
                 }
             })
            });
            $('.layui-form-checkbox').click(function(){
                var isChecked = $(this).hasClass('layui-form-checked');
                var storeId = $(this).siblings('input').attr('data-store');
                $.ajax({
                    type:'GET',
                    url:ctx + '/ebayOperatingOverview/updateIsStatisticalType.html',
                    dataType:'JSON',
                    async:true,
                    data:{'isStatisticalType':isChecked,'storeAcctId':storeId},
                    success:function (data) {
                        if(data.code == '0000'){
                            layer.msg(data.msg)
                        }else {
                            layer.msg("服务器正忙");
                        }
                    }
                });
            })
        },
        id: tablename,
        page:false,
        limits:[100,200,500,1000],
        limit:100,
        where:getSearchData(),
        });
    }
    //获取表单数据
   function getSearchData(){
       var data = serializeObject($('#pandectForm'));
       data.siteListS=[];
        data.startTime = data.registerTime.split(' - ')[0]?data.registerTime.split(' - ')[0]:"";
        data.endTime = data.registerTime.split(' - ')[1]?data.registerTime.split(' - ')[1] + " 23:59:59":"";
       var logisAttrContents = formSelects.value("ebay_acct_templat");
       for (var i = 0; i < logisAttrContents.length; i++) {
           var logisAttr = logisAttrContents[i].value;
           data.siteListS.push($.trim(logisAttr));
       }
       data.siteListS = $.trim(data.siteListS);
        //data.storeAcctIdS = data.storeAcctIdS;
        return data;
   }
    //表单查询
    $('#pandect_searchBtn').click(function(){
        var title = $('.table_tab .layui-this').attr('data-title');
        tablerender(title);
    });
});

  //表单数据序列化
    function serializeObject(form) {
        var o = {};
        $.each(form.serializeArray(), function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }

    //格式化仓库属性
    function formatWareHouse(str){
        var obj = {'0':'国内仓','1':'海外仓','':'全部'}
        var property = []
        var propertyArray = str.split(',');
        for(var i = 0;i<propertyArray.length;i++){
            property.push(obj[propertyArray[i]]);
        }
        return uniq(property).join('<br/>');
    }
    //数组去重
    function uniq(array){
		var temp = []; //一个新的临时数组
		for(var i = 0; i < array.length; i++){
			if(temp.indexOf(array[i]) == -1){
				temp.push(array[i]);
			}
		}
		return temp;
    }

    //时间相减获得月份函数
    function getmonths(date){
        if(date){
        var currentDate = new Date();
        var registerDate = new Date(date);
        var year1 = currentDate.getFullYear();
        var year2 = registerDate.getFullYear();
        var month2 =  registerDate.getMonth()+1;
        var month1 = currentDate.getMonth()+1;
        return (year1*12+month1-year2*12-month2-1)>0?(year1*12+month1-year2*12-month2-1):0;
        }else{
            return '';
        }
    }

