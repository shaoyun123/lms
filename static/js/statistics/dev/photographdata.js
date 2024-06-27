layui.use(['admin', 'form', 'table','laydate','upload','layer'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        upload = layui.upload,
        form = layui.form;
    form.render('select');
    //初始化部门人员
    render_hp_orgs_users("#pgh_searchForm");
    var photograph_cols = [[
            {
                field: "photographer",
                title: '摄影专员',
                templet:'<div><span class="statisticsPerson" data-id="{{d.photographerId}}">{{d.photographer || ""}}</span><div>'
            }, {
                field: "finishNum",
                title: "完成数量"
            },{
              field:'ondfinishNum',
              title:'1D完成数量'
            },{
              field:'ondFinishPercent',
              title:'1D完成率',
              templet:'#ondFinishPercent'
            },{
                field:'twdfinishNum',
                title:'2D完成数量'
            },{
                field:'twdFinishPercent',
                title:'2D完成率',
                templet:'#twdFinishPercent'
            },{
                field:'thdfinishNum',
                title:'3D完成数量'
            },{
                field:'thdFinishPercent',
                title:'3D完成率',
                templet:'#thdFinishPercent'
            }
        ]],
        artifical_cols= [[
            {
                field: "artDesigner",
                title: '美工专员',
                templet:'<div><span class="statisticsPerson" data-id="{{d.artDesignerId}}">{{d.artDesigner || ""}}</span><div>'
            }, {
                field: "finishNum",
                title: "完成数量"
            },{
                field:'ondfinishNum',
                title:'1D完成数量'
            },{
                field:'ondFinishPercent',
                title:'1D完成率',
                templet:'#ondFinishPercent'
            },{
                field:'twdfinishNum',
                title:'2D完成数量'
            },{
                field:'twdFinishPercent',
                title:'2D完成率',
                templet:'#twdFinishPercent'
            }
        ]],
        picture_cols = [[
            {
                field: "totalNum",
                title: '需求数量',
            }, {
                field: "reveiveNum",
                title: "收货数量"
            },{
                field:'thdfinishNum',
                title:'3D完成数量'
            },{
                field:'thdfinishPercent',
                title:'3D完成率',
                templet:'#thdfinishPercent'
            },{
                field:'fodfinishNum',
                title:'4D完成数量'
            },{
                field:'fodfinishPercent',
                title:'4D完成率',
                templet:'#fodfinishPercent'
            },{
                field:'fidfinishNum',
                title:'5D完成数量'
            },{
                field:'fidfinishPercent',
                title:'5D完成率',
                templet:'#fidfinishPercent'
            }
        ]],
        artDesignEvaluate_cols= [[
            {
                field: "artDesigner",
                title: '美工专员',
                templet:'<div><span class="statisticsPerson" data-id="{{d.artDesignerId}}">{{d.artDesigner || ""}}</span><div>'
            }, {
                field: "finishPskuNum",
                title: "完成数量"
            },{
                field:'totalScoreNum',
                title:'总评价数量'
            },{
                title:'满意数(占比)',
                templet:'<div>{{d.score5Num}}({{d.totalScoreNum ? (d.score5Num * 100 /d.totalScoreNum).toFixed(2) : 0}}%)</div>'
            }
            // ,{
            //     title:'一般数(占比)',
            //     templet:'<div>{{d.score3Num}}({{d.totalScoreNum ? (d.score3Num * 100 /d.totalScoreNum).toFixed(2) : 0}}%)</div>'
            // }
            ,{
                title:'需要改善数(占比)',
                templet:'<div>{{d.score1Num}}({{d.totalScoreNum ? (d.score1Num * 100 /d.totalScoreNum).toFixed(2) : 0}}%)</div>'
            }
        ]],
        photoEvaluate_cols= [[
            {
                field: "photographer",
                title: '摄影专员',
                templet:'<div><span class="statisticsPerson" data-id="{{d.photographerId}}">{{d.photographer || ""}}</span><div>'
            }, {
                field: "finishPskuNum",
                title: "完成的父sku数量"
            },{
                field:'totalScoreNum',
                title:'总评价数量'
            },{
                title:'满意数(占比)',
                templet:'<div>{{d.score5Num}}({{d.totalScoreNum ? (d.score5Num * 100 /d.totalScoreNum).toFixed(2) : 0}}%)</div>'
            }
            // ,{
            //     title:'一般数(占比)',
            //     templet:'<div>{{d.score3Num}}({{d.totalScoreNum ? (d.score3Num * 100 /d.totalScoreNum).toFixed(2) : 0}}%)</div>'
            // }
            ,{
                title:'需要改善数(占比)',
                templet:'<div>{{d.score1Num}}({{d.totalScoreNum ? (d.score1Num * 100 /d.totalScoreNum).toFixed(2) : 0}}%)</div>'
            }
        ]],
        refineEvaluate_cols= [[
            {
                field: "artDesigner",
                title: '美工专员',
                templet:'<div><span class="statisticsPerson" data-id="{{d.artDesignerId}}">{{d.artDesigner || ""}}</span><div>'
            },{
                field: "totalNum",
                title: '需求数量',
            }, {
                field: "finishPskuNum",
                title: "完成的父sku数量"
            },{
                title:'完成率(占比)',
                templet:'<div>{{d.totalNum ? (d.finishPskuNum * 100 /d.totalNum).toFixed(2) : 0}}%</div>'
            }
        ]]
    ;

    //根据当前tab的index实例化相应表格
    function loadertable(id,cols,data,url){
        table.render({
            elem: "#"+id,
            id: id,
            url: ctx +url, // 数据接口
            page: true,
            limits: [100, 500, 1000], // 每页条数的选择项
            limit: 100, //默认显示20条
            cols: cols,
            where:data,
            created:function(res){
                console.log(111)
                if(res.code=="0000"){
                    if(res.data.inPhNum || res.data.inPhNum == 0){
                        res.num = res.data.inPhNum;
                    }else if(res.data.inAdNum || res.data.inAdNum == 0){
                        res.num = res.data.inAdNum;
                    }else if(res.data.inRfNum || res.data.inRfNum == 0){
                        res.num = res.data.inRfNum;
                    }
                    res.data = res.data.statistics
                }
            },
            done:function(res,count){
                if(res.num){
                    $('#pgh_statisticsType .layui-this').find('span').html('(<span style="color:red">'+res.num+'</span>)');
                }
            }
        });
    }
    //日期范围

    laydate.render({
        elem: '#goodsArrive',
        range:true,
        type: 'datetime'
    });
    laydate.render({
        elem: '#goodsRecive',
        range:true,
        type: 'datetime'
    });
    //20231206-仓库看板
    let warehousePannelHandle = function(){
      //获取到时间
      let arriveTimeStr = $('#goodsArrive').val();
      if(arriveTimeStr==''){
        return layer.msg('请先选择时间', {icon:7});
      }
      let startTime = arriveTimeStr.split(' - ')[0];
      let endTime = arriveTimeStr.split(' - ')[1];
      commonReturnPromise({
        url: '/lms/msgSelfImgOperNoteTime/queryByTime',
        params: {
          startTime: startTime,
          endTime: endTime
        }
      }).then(res => {
        let {processCountDtoList, abnormalCountDto, photographAbnormalDetailDto } = res;
        //产能看板渲染-静态表格
        table.render({
          elem: '#photographdata_capacityTable'
          ,id: 'photographdata_capacityTableId'
          ,height: 400
          ,data: processCountDtoList
          ,page: false //开启分页
          ,limit: 1000
          ,cols: [[ //表头
            {field: 'time', title: '时间', templet: '<div>{{Format(d.time, "yyyy-MM-dd")}}</div>'}
            ,{field: 'creatOrderCount', title: '创建'}
            ,{field: 'auditOrderCount', title: '审核'}
            ,{field: 'dispatchOrderCount', title: '派单'}
            ,{field: 'consigneeOrderCount', title: '配货'}
            ,{field: 'receiverOrderCount', title: '收货'}
            ,{field: 'photographOrderCount', title: '摄影'}
            ,{field: 'artDesignOrderCount', title: '美工'}
            ,{field: 'returnInventoryOrderCount', title: '还库'}
            ,{field: 'damageOrderCount', title: '报损'}
          ]]
        });
        //异常统计看板渲染-静态表格[不适用layui处理]
        //转换数据成数组,传递对象,返回对象数组,数组结构: type: '类型',num: '类型数量', desc: '类型描述'
        let transformData = function(obj){
          let keys = Object.keys(obj);
          let arr = [];
          for(let i=0; i<keys.length; i++){
            let key = keys[i];
            let item = {};
            item.num = obj[key];
            switch (key) {
              case 'auditCount':
                  item.type='审核';
                  item.type1='';
                  item.desc="创建后<font color='red'>3</font>天内还未审核的订单";
                  break;
              case 'dispatchCount':
                item.type='派单';
                item.type1='';
                item.desc="审核后<font color='red'>5</font>天内还未派至仓库的订单";
                break;
              case 'consigneeCount':
                item.type='配货';
                item.type1='';
                item.desc="派单时间超过<font color='red'>1</font>天还未配货的订单";
                break;
              case 'receiverCount':
                item.type='收货';
                item.type1='';
                item.desc="配货完成超过<font color='red'>1</font>天还未收货的订单";
                break;
              case 'photographCount':
                item.type='摄影';
                item.type1='';
                item.desc="收货完成时间超过<font color='red'>3</font>天还未摄影的订单";
                break;
              case 'artDesignCount':
                item.type='美工';
                item.type1='';
                item.desc="摄影时间超过<font color='red'>5</font>天还未完成美工的订单";
                break;
              case 'returnInventoryCount':
                item.type='还库';
                item.type1='';
                item.desc="未标记'寄出'(转寄状态是null),收货超<font color='red'>3</font>天还未还库的订单\n标记'寄出'或 '还回',收货超<font color='red'>10</font>天还未还库的订单";
                break;
            }
            if(item.type!= '摄影'){
              arr.push(item);
            }
          }
          let detailArr = [
            {type: '', type1: '总数', num: photographAbnormalDetailDto.count, desc: `收货完成时间超过<font color='red'>3</font>天还未摄影的订单`},
            {type: '1', type1: '铺货转寄', num: photographAbnormalDetailDto.type1Count, desc: `收货完成时间超过<font color='red'>3</font>天还未摄影的订单`},
            {type: '2', type1: '铺货非转寄', num: photographAbnormalDetailDto.type2Count,desc: `收货完成时间超过<font color='red'>3</font>天还未摄影的订单`},
            {type: '3', type1: '精品精铺直邮', num: photographAbnormalDetailDto.type3Count,desc: `收货完成时间超过<font color='red'>3</font>天还未摄影的订单`},
          ];
          arr.map((item,index)=> {
            if(item.type== '收货'){
              arr.splice(index+1,0, ...detailArr);
            }
          });
          console.log(arr);
          return arr;
        };
        //表格渲染
        let tableData = transformData(abnormalCountDto);
        let trStr = '';
        for(let i=0; i<tableData.length; i++){
          let item = tableData[i];
          if(item.type == ''){
            trStr += `
            <tr>
              <td rowspan="4">摄影</td>
              <td>${item.type1 || ''}</td>
              <td>${item.num || 0}</td>
              <td rowspan="4">${item.desc || ''}</td>
            </tr>
            `;
          }else if(['总数','铺货转寄','铺货非转寄','精品精铺直邮'].includes(item.type1)){
            trStr += `
            <tr>
              <td>${item.type1 || ''}</td>
              <td>${item.num || 0}</td>
            </tr>
            `;
          }else{
            trStr += `
            <tr>
              <td>${item.type || ''}</td>
              <td>${item.type1 || ''}</td>
              <td>${item.num || 0}</td>
              <td>${item.desc || ''}</td>
            </tr>
            `;
          }
        }
        $('#photographdata_abnormalTable_tbody').html(trStr);
      });
    }
    //点击tab重新请求表格
    $('#pgh_statisticsType li').click(function(){
        var index = Number($(this).attr('data-index'));
        if(index !=6){
          $('#pgh_searchForm .org-user-div').show();
          //切换table处理摄影/美工人员信息
          initOrgPerson(index);
          var tables = [{"id":"photograph","cols":photograph_cols,"data":getData(index),"url":"/msgselfimg/phstatistics.html"},
              {"id":"artifical","cols":artifical_cols,"data":getData(index),"url":"/msgselfimg/adstatistics.html"},
              {"id":"picture","cols":picture_cols,"data":getData(index),"url":"/msgselfimg/statistics.html"},
              {"id": "photoEvaluate","cols": photoEvaluate_cols, "data" : getData(index), "url" : "/msgselfimg/phEStatistics.html"},
              {"id": "artDesignEvaluate","cols": artDesignEvaluate_cols, "data" : getData(index), "url" : "/msgselfimg/adEStatistics.html"},
              {"id": "refineEvaluate","cols": refineEvaluate_cols, "data" : getData(index), "url" : "/msgselfimg/refineEStatistics.html"}
          ]
          if(index===2){
              $('.reciveTimeinput').removeClass('hide');
          }else{
              $('.reciveTimeinput').addClass('hide');
          }
          loadertable(tables[index].id,tables[index].cols,tables[index].data,tables[index].url);
          //初始化图表
          $(this).parents('.layui-tab').next('.layui-card').show();
          initChart($(this).attr('data-index'),$("#pgh_statisticsPeriod .layui-this").attr("timeType"));
        }else{
          //ztt20231206仓库看板
          $(this).parents('.layui-tab').next('.layui-card').hide();
          $('#pgh_searchForm .org-user-div').hide();
          //整体逻辑: 请求接口,渲染表格,需要把数据做一个表格数据转换[分成左右两个部分,左侧80%,右侧20%]
          warehousePannelHandle();
        }
    });

    function initOrgPerson(index){
        var roleName;
        if(index == 2){
            //拍图统计，不考虑人员
            $("#pgh_searchForm .org-user-div").hide();
            return;
        }else if(index ==0 || index == 3){
            roleName = "摄影专员";
        }else if(index ==1 || index == 4){
            roleName = "美工专员";
        }
        $("#pgh_searchForm .org-user-div").show();
        var preRoleName = $("#pgh_searchForm select[name=userId]").data("rolelist");
        if(preRoleName != roleName){
            console.log("重新初始化部门人员：%s>%s",preRoleName, roleName);
            $("#pgh_searchForm select[name=userId]").val("");
            $("#pgh_searchForm select[name=orgId]").val("");
            $("#pgh_searchForm select[name=userId]").data("rolelist", roleName);
            render_hp_orgs_users("#pgh_searchForm");
        }
    }
    /**
     * 获取表格查询条件
     * @param index
     * @returns {{}}
     */
    function getData(index){
        var data={}
        var arriveTimeStr = $('#goodsArrive').val(),
            reciveTmeStr = $('#goodsRecive').val();
        data.receiveTime1 = arriveTimeStr==''?'':arriveTimeStr.split(' - ')[0];
        data.receiveTime2 = arriveTimeStr==''?'':arriveTimeStr.split(' - ')[1];
        //拍图统计条件
        if(index==='2'){
            data.createTime1 = reciveTmeStr==''?'':reciveTmeStr.split(' - ')[0];
            data.createTime2 = reciveTmeStr==''?'':reciveTmeStr.split(' - ')[1];
        }
        //部门用户
        data.orgId = $("#pgh_searchForm select[name=orgId]").val();
        data.userId = $("#pgh_searchForm select[name=userId]").val();
        return data;
    }

    //查询
    $('#pgh_searchData').click(function(){
        var data={}
        var index = $('#pgh_statisticsType .layui-this').attr('data-index');
        if(index !=6){
          var tables = [{"id":"photograph","cols":photograph_cols,"data":getData(index),"url":"/msgselfimg/phstatistics.html"},
              {"id":"artifical","cols":artifical_cols,"data":getData(index),"url":"/msgselfimg/adstatistics.html"},
              {"id":"picture","cols":picture_cols,"data":getData(index),"url":"/msgselfimg/statistics.html"},
              {"id": "photoEvaluate","cols": photoEvaluate_cols, "data" : getData(index), "url" : "/msgselfimg/phEStatistics.html"},
              {"id": "artDesignEvaluate","cols": artDesignEvaluate_cols, "data" : getData(index), "url" : "/msgselfimg/adEStatistics.html"},
              {"id": "refineEvaluate","cols": refineEvaluate_cols, "data" : getData(index), "url" : "/msgselfimg/refineEStatistics.html"}
          ]
          loadertable(tables[index].id,tables[index].cols,tables[index].data,tables[index].url);
          //图表搜索
          initChart();
          return false;
        }else{
          //ztt20231206-仓库看板逻辑
          warehousePannelHandle();
        }
    });

    $(".statisticsChart").click(function () {
        initChart($('#pgh_statisticsType .layui-this').attr('data-index'),$(this).attr("timeType"));
    });
    $("body").on('click', ".statisticsPerson", function(){
        var userId = $(this).data("id");
        if(userId && userId != 'undefined'){
            initChart("","",userId);
        }
    });
    function initChart(statisticsIndex,statisticsPeriod,userId){
        //获取统计类型 0摄影统计 1美工统计 2拍图统计 3摄影评分统计 4美工评分统计 5自拍图
        if(!statisticsIndex){
            statisticsIndex = $('#pgh_statisticsType .layui-this').attr('data-index');
        }
        //获取统计日期周期 month、week、day
        if(!statisticsPeriod){
            statisticsPeriod = $("#pgh_statisticsPeriod .layui-this").attr("timeType");
        }
        var orgId = $("#pgh_searchForm select[name=orgId]").val();
        if(!userId){
            userId = $("#pgh_searchForm select[name=userId]").val();
        }
        console.log("获取图表数据，statisticsIndex:%s,statisticsPeriod%s,userId:%s",statisticsIndex,statisticsPeriod,userId);
        //初始化图表
        var url;
        if(statisticsIndex == 0){
            url = "/msgselfimg/phstatisticschart.html";
        }else if(statisticsIndex == 1){
            url = "/msgselfimg/adstatisticschart.html";
        }else if(statisticsIndex == 2){
            url = "/msgselfimg/statisticschart.html";
        }else if(statisticsIndex == 3){
            url = "/msgselfimg/phstorestatisticschart.html"
        }else if(statisticsIndex == 4){
            url = "/msgselfimg/adstorestatisticschart.html"
        }else if(statisticsIndex == 5){
            url = "/msgselfimg/refineStatisticsChart.html"
        }
        $.ajax({
            url:ctx+url,
            type:'post',
            dataType:'json',
            data:{
                statisticsPeriod: statisticsPeriod,
                orgId: orgId,
                userId: userId,
            },
            success:function(res){
                if(res.code=="0000"){
                  showQXChart(statisticsIndex, res.data);
                }else{
                  layer.msg(res.msg, {icon:0});
                }
            },
            error:function(res){
              layer.msg("服务器错误", {icon:2});
            }
        });

    }

    //封装图表数据格式
    function showQXChart(statisticsIndex, data){
        var viewData = getOriginalData();
        if(statisticsIndex == 0 || statisticsIndex == 1){
            //标题
            if(statisticsIndex == 0){
                viewData.title.text = "摄影统计";
            }else{
                viewData.title.text = "美工统计";
            }
            var xAxis = [];
            //完成数量
            var finishNums = [];
            //1D完成数量
            var ondfinishNums = [];
            //2D完成数量
            var twdfinishNums = [];
            data.forEach(function(item){
                xAxis.push(item.statisticsTime);
                finishNums.push(item.finishNum);
                ondfinishNums.push(item.ondfinishNum);
                twdfinishNums.push(item.twdfinishNum);
            });
            //X轴
            viewData.xAxis.categories = xAxis;
            //数据,3项
            viewData.series = viewData.series.slice(0,3);
            viewData.series[0].name = "完成数量";
            viewData.series[0].data = finishNums;
            
            viewData.series[1].name = "1D完成数量";
            viewData.series[1].data = ondfinishNums;
            
            viewData.series[2].name = "2D完成数量";
            viewData.series[2].data = twdfinishNums;
        }else if(statisticsIndex == 2){
            //标题
            viewData.title.text = "拍图统计";
            var xAxis = [];
            //需求数量
            var totalNums = [];
            //收货数量
            var reveiveNums = [];
            //2D完成数量
            var twdfinishNums = [];
            //3D完成数量
            var thdfinishNums = [];
            data.forEach(function(item){
                xAxis.push(item.statisticsTime);
                totalNums.push(item.totalNum);
                reveiveNums.push(item.reveiveNum);
                twdfinishNums.push(item.twdfinishNum);
                thdfinishNums.push(item.thdfinishNum);
            });
            //X轴
            viewData.xAxis.categories = xAxis;
            //数据,4项
            viewData.series = viewData.series.slice(0,4);
            
            viewData.series[0].name = "需求数量";
            viewData.series[0].data = totalNums;
            
            viewData.series[1].name = "收货数量";
            viewData.series[1].data = reveiveNums;
            
            viewData.series[2].name = "2D完成数量";
            viewData.series[2].data = twdfinishNums;
            
            viewData.series[3].name = "3D完成数量";
            viewData.series[3].data = thdfinishNums;
        }else if(statisticsIndex == 3 || statisticsIndex == 4){
            //完成的父SKU数量/总评价数量/满意数量
            //标题
            if(statisticsIndex == 3){
                viewData.title.text = "摄影评分统计";
            }else{
                viewData.title.text = "美工评分统计";
            }
            var xAxis = [];
            //完成数量
            var finishPskuNums = [];
            //总评价数量
            var totalScoreNums = [];
            //满意数量
            var score5Nums = [];
            data.forEach(function(item){
                xAxis.push(item.statisticsTime);
                if(!item.finishPskuNum){
                    item.finishPskuNum = 0;
                }
                if(!item.totalScoreNum){
                    item.totalScoreNum = 0;
                }
                if(!item.score5Num){
                    item.score5Num = 0;
                }
                finishPskuNums.push(item.finishPskuNum);
                totalScoreNums.push(item.totalScoreNum);
                score5Nums.push(item.score5Num);
            });
            //X轴
            viewData.xAxis.categories = xAxis;
            //数据,3项
            viewData.series = viewData.series.slice(0,3);
            viewData.series[0].name = "完成的父SKU数量";
            viewData.series[0].data = finishPskuNums;
            
            viewData.series[1].name = "总评价数量";
            viewData.series[1].data = totalScoreNums;
            
            viewData.series[2].name = "满意数量";
            viewData.series[2].data = score5Nums;
        }else if(statisticsIndex == 5){
            var xAxis = [];
            //完成数量
            var finishPskuNum = [];
            //总数量
            var totalNum = [];
            viewData.title.text = "精修统计";
            data.forEach(function(item){
                xAxis.push(item.statisticsTime);
                finishPskuNum.push(item.finishPskuNum);
                totalNum.push(item.totalNum);
            });
            viewData.xAxis.categories = xAxis;
            viewData.series = viewData.series.slice(0,2);
            viewData.series[0].name = "需求数量";
            viewData.series[0].data = finishPskuNum;

            viewData.series[1].name = "完成数量";
            viewData.series[1].data = totalNum;
        }
        $("#pgd_chartDiv").highcharts(viewData);
    }

    function getOriginalData(){
        var viewData = {
          chart: {
            type: 'spline'
          },
          title: {
            text: ""
          },
          credits:{
            //enabled:false, //是否启用
            href:"http://www.epean.com.cn/",
            text:"http://www.epean.com.cn/",
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          },
          exporting:{
            enabled:true//图表右上角下载功能按键是否显示
          },lang:{
            contextButtonTitle:'导出图片',
            downloadJPEG: '导出JPEG',
            downloadPDF: '导出 PDF',
            downloadPNG: '导出 PNG',
            downloadSVG: '导出 SVG',
            printChart:'打印'
          },
          subtitle: {
            // text: 'Source: WorldClimate.com'
          },
          xAxis: {
            categories: [0,1,3],
            labels: {
              rotation: -45,
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          },
          yAxis: {
            title: {
              text: '子SKU数量'
            }
          },
          legend: {  //图例位置，此为默认配置，可不用设置
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true
              },
              enableMouseTracking: true
            }
          },
          series: [{
            data: [1,2,3],
            name:"1",
            color:"#00A0DC",
            dataLabels: {
              enabled: true,
              rotation: 0,//柱内数字角度
              color: '#FFFFFF',
              align: 'center',
              format: '{point.y}', // one decimal
              y: 10, // 10 pixels down from the top
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          },{
            data: [2,3,3],
            name:"2",
            color:"#009688",
            dataLabels: {
              enabled: true,
              rotation: 0,//柱内数字角度
              color: '#FFFFFF',
              align: 'center',
              format: '{point.y}', // one decimal
              y: 10, // 10 pixels down from the top
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          },{
            data: [3,4,3],
            name:"3",
            color:"#FFB800",
            dataLabels: {
              enabled: true,
              rotation: 0,//柱内数字角度
              color: '#FFFFFF',
              align: 'center',
              format: '{point.y}', // one decimal
              y: 10, // 10 pixels down from the top
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          },{
            data: [3,4,3],
            name:"4",
            color:"#FFB800",
            dataLabels: {
              enabled: true,
              rotation: 0,//柱内数字角度
              color: '#FFFFFF',
              align: 'center',
              format: '{point.y}', // one decimal
              y: 10, // 10 pixels down from the top
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          } ]
        };
        return viewData;
    }
    initChart();
});



function handleDownload() {
  layer.confirm('确认导出异常数据吗?', {icon: 7}, function(index){
    transBlob({
      fileName: `自拍图异常${Format(new Date(), 'yyyy-MM-dd hh:mm:ss')}.xlsx`,
      url: "/lms/msgSelfImgOperNoteTime/exportAbnormalSelfImg",
    }, 'post').then(function (result) {
      layer.msg(result || '导出成功', { icon: 1 });
      layer.close(index);
    }).catch(function (err) {
      layer.alert(err , { icon: 2 })
    });
  });
}
