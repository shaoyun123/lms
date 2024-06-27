<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>新品开发时效</title>
<style>

    .layui-layer-tips .layui-layer-content{
        position: relative;
        line-height: 22px;
        min-width: 12px;
        padding: 8px 15px;
        font-size: 12px;
        _float: left;
       border-radius: 2px;
       box-shadow: 1px 1px 3px rgba(0,0,0,.2);
       background-color: #fff !important;
       color: #4c4c4c !important;
       border:1px solid #ccc;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">
                    <h2>新品开发时效统计</h2>
                </div>
                <div class="layui-card-body">
                        <div class="layui-form">
                            <div class="layui-form-item" style="margin-bottom: 0">
                                <form id="preprodStats_searchForm">
                                <div class="layui-inline" style="padding-top: 3px;">
                                    <label class="layui-form-label" style="width: 100px;padding-left: 0">创建时间</label>
                                    <div class="layui-input-inline">
                                        <input type="text" class="layui-input" id="ppstats_searchTime" placeholder="请选择" readonly>
                                    </div>
                                </div>
                                    <div class="layui-inline" style="padding-top: 3px;">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-inline">
                                            <select id="ppstats_orgId" lay-filter="orgs_hp_devPerson_newdevelop" name="" class="orgs_hp_custom" data-id="preprodstats_devPerson">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-inline" style="padding-top: 3px;">
                                        <label class="layui-form-label">开发人员</label>
                                        <div class="layui-input-inline">
                                            <select id="ppstats_devId" lay-filter="users_hp_devPerson_newdevelop" name="" lay-search="" class="users_hp_custom" data-id="preprodstats_devPerson" data-roleList="开发专员">
                                            </select>
                                        </div>
                                    </div>
                                <div class="layui-inline" style="padding-top: 3px;">
                                    <label class="layui-form-label">开发类型</label>
                                    <div class="layui-input-inline">
                                        <select id="ppstats_devType" name="devType" xm-select="devType" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                            <c:forEach items="${devTypeEnums}" var="devTypeEnum">
                                                <option value="${devTypeEnum.getCode()}">${devTypeEnum.getName()}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-inline">
                                    <button id="ppstats_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                    <button class="layui-btn layui-btn-sm" type="reset">清空</button>
                                </div>
                                </form>
                            </div>
                        </div>
                </div>
            </div>
            <div class="layui-card">
                <%--<div class="layui-card-header">
                    <!--<span>数量(1234)</span>-->
                    <div style="position: absolute;top:0;right: 10px"></div>
                </div>--%>
                <div class="layui-card-body" id="ppstats_tableDiv">
                    <table id="ppstats_table" lay-filter="ppstats_tablefilter" class="layui-table" lay-data="{ url:'${ctx}/preProdDev/preprodStats.html', page: true, limit: 50, limits:[50,100,200]}">
                        <thead>
                        <tr>
                            <th lay-data="{field:'orgName', width:'5%', sort:true}" rowspan="2">组别</th>
                            <th lay-data="{field:'creator', width:'4%', sort:true}" rowspan="2">开发</th>
                            <th lay-data="{field:'total', width:4%', sort:true}" rowspan="2">创建数量</th>
                            <th lay-data="{align:'center'}" colspan="2">完成</th>
                            <th lay-data="{align:'center'}" colspan="2">失败</th>
                            <th lay-data="{align:'center'}" colspan="2">待发布</th>
                            <th lay-data="{align:'center'}" colspan="2">直邮6天完成</th>
                            <th lay-data="{align:'center'}" colspan="2">直邮超6天未完成</th>
                            <th lay-data="{align:'center'}" colspan="2">FBA6天完成</th>
                            <th lay-data="{align:'center'}" colspan="2">FBA超6天未完成</th>
                            <th lay-data="{align:'center'}" colspan="2">初审1天</th>
                            <th lay-data="{align:'center'}" colspan="2">组长审核1天</th>
                            <th lay-data="{align:'center'}" colspan="2">补充采样1天</th>
                            <th lay-data="{align:'center'}" colspan="2">待采样-已采样1天</th>
                            <th lay-data="{align:'center'}" colspan="2">采样5天</th>
                        </tr>
                        <tr>
                            <th lay-data="{field:'finishNum', width:'3%', sort:true}">数量</th>
                            <th lay-data="{field:'finPrecent', templet:'<div>{{d.finPrecent}}%</div>', width:'5%', sort:true}">比例</th>
                            <th lay-data="{field:'devFailNum', width:'3%', sort:true}">数量</th>
                            <th lay-data="{field:'devFailPrecent', templet:'<div>{{d.devFailPrecent}}%</div>', width:'5%', sort:true}">比例</th>
                            <th lay-data="{field:'notPutlishNum', width:'3%', sort:true}">数量</th>
                            <th lay-data="{field:'notPutlishPrecent', templet:'<div>{{d.notPutlishPrecent}}%</div>', width:'4%', sort:true}">比例</th>
                            <th lay-data="{field:'finish15', width:'3%', sort:true}">数量</th>
                            <th lay-data="{field:'finishPrecent15', templet:'<div>{{d.finishPrecent15}}%</div>', width:'4%', sort:true}">比例</th>
                            <th lay-data="{field:'notFinish15', width:'3%', sort:true}">数量</th>
                            <th lay-data="{field:'notFinPrecent15', templet:'<div>{{d.notFinPrecent15}}%</div>', width:'4%', sort:true}">比例</th>
                            <!--FBA-->
                            <th lay-data="{field:'finishFba15', width:'3%', sort:true}">数量</th>
                            <th lay-data="{field:'finishPrecentFba15', templet:'<div>{{d.finishPrecentFba15}}%</div>', width:'4%', sort:true}">比例</th>
                            <th lay-data="{field:'notFinishFba15', width:'3%', sort:true}">数量</th>
                            <th lay-data="{field:'notFinPrecentFba15', templet:'<div>{{d.notFinPrecentFba15}}%</div>', width:'4%', sort:true}">比例</th>
                            <!--FBA-->
                            <th lay-data="{field:'faLateNum', width:'4%', sort:true}">超时数</th>
                            <th lay-data="{field:'faLatePrecent', templet:'<div>{{d.faLatePrecent}}%</div>', width:'4%', sort:true}">比例</th>
                            <th lay-data="{field:'laLateNum', width:'4%', sort:true}">超时数</th>
                            <th lay-data="{field:'laLatePrecent', templet:'<div>{{d.laLatePrecent}}%</div>', width:'4%', sort:true}">比例</th>
                            <th lay-data="{field:'addPurLateNum', width:'4%', sort:true}">超时数</th>
                            <th lay-data="{field:'addPurLatePrecent', templet:'<div>{{d.addPurLatePrecent}}%</div>', width:'4%', sort:true}">比例</th>
                            <th lay-data="{field:'sampleBeginLateNum', width:'4%', sort:true}">超时数</th>
                            <th lay-data="{field:'sampleBeginLatePrecent', templet:'<div>{{d.sampleBeginLatePrecent}}%</div>', width:'4%', sort:true}">比例</th>
                            <th lay-data="{field:'sampleLateNum', width:'4%', sort:true,templet:'#sampletimeout'}">超时数</th>
                            <th lay-data="{field:'sampleLatePrecent', templet:'<div>{{d.sampleLatePrecent}}%</div>', width:'4%', sort:true}">比例</th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="layui-tab layui-tab-brief" lay-filter="pps_chart">
                    <ul class="layui-tab-title">
                        <li class="layui-this" timeType="month" chartName="月开发统计">月数据</li>
                        <li class="" timeType="week" chartName="周开发统计">周数据</li>
                        <li class="" timeType="day" chartName="日开发统计">日数据</li>
                    </ul>
                    <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show" id="pps_chartMon">
                            000
                        </div>
                       <%-- <div class="layui-tab-item" id="pps_chartWeek">
                            111
                        </div>
                        <div class="layui-tab-item" id="pps_chartDay">
                            222
                        </div>--%>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 模板文件 -->



  <script type="text/html" id="sampletimeout">
    <span data-Skus="{{d.sampleLateSkus}}">{{d.sampleLateNum}}</span>
</script>

<script type="text/html" id="photoLatetimeout">
    <span data-Skus="{{d.photoLateSkus}}">{{d.photoLateNum}}</span>
</script>

<script src="${ctx}/static/highcharts/highcharts.js"></script>
<script>
    layui.use(['admin', 'form', 'table','laydate','upload','layer','formSelects'], function() {
        var $ = layui.$,
            admin = layui.admin,
            element = layui.element,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            upload = layui.upload,
            form = layui.form;
        form.render(null, 'component-form-element');
        form.render(null, 'component-form-group');
        layui.formSelects.render('devType')
        table.init();
        //listAllDevGroup();
        pps_getChart('month','月开发统计');
        form.render('select')
        //日期范围
        laydate.render({
            elem: '#ppstats_searchTime'
            ,range: true
            ,trigger: 'click' //采用click弹出
        });

        // // 初始化 组织-人员选择框
        render_hp_orgs_users("#preprodStats_searchForm")

        $("#ppstats_searchBtn").click(function(){
            var data = {};
            var endTime = $("#ppstats_searchTime").val();
            if(endTime != ""){
                data.createTimeStart = Date.parse(endTime.split(" - ")[0] +" 00:00:00");
                data.createTimeEnd = Date.parse(endTime.split(" - ")[1] +" 23:59:59");
            }else{
                data.createTimeStart = "";
                data.createTimeEnd = "";
            }
            data.orgId = $("#ppstats_orgId").val();
            data.devId = $("#ppstats_devId").val();
            var devTypes = [];
            var devTypesSel = layui.formSelects.value("devType");
            for (var i = 0; i < devTypesSel.length; i++) {
                devTypes.push($.trim(devTypesSel[i].value));
            }
            data.devTypes = devTypes.join(",");
            //执行重载
            table.reload('ppstats_table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: data
            });

        $('body').on('mouseenter mouseleave','.layui-table tr td',function(event){
            var e = event || window.event,
            text='',
            index = $(this).index();
            e.preventDefault();
            if(event.type=="mouseenter"){
                if(index==17||index==19){
                    var skusStr = $(this).find('span').attr('data-Skus');
                    var reg = new RegExp( ',' , "g" )
                    if(skusStr&&skusStr!=='undefined'){
                        var sku = skusStr.replace(reg,'<br/>');
                        layer.tips(sku,$(this),{
                                 tips: [3]});
                }
                }
            }
         });
        });

        function listAllDevGroup(){
            $("#ppstats_orgId option:not(:first)").remove();
            $.ajax({
                type: 'post',
                url: ctx + '/preProdDev/listAllDevGroup.html',
                dataType: 'json',
                success: function (returnData) {
                    var layer = layui.layer;
                    if (returnData.data.length > 0) {
                        var dataList = returnData.data;
                        for(var i in dataList){
                            $("#ppstats_orgId").append("<option value='"+dataList[i].id+"'>"+dataList[i].name+"</option>");
                        }
                    }
                    var form = layui.form;
                    form.render('select');
                },
                error: function () {
                    layer.msg('发送请求失败')
                }
            })
        }

        function pps_getChart(timeType){
            $.ajax({
                type: 'post',
                url: ctx + '/preProdDev/preprodCountStats.html',
                dataType: 'json',
                data:{"timeType":timeType},
                success: function (returnData) {
                    console.log(returnData);
                    showQXChart(returnData.data);
                },
                error: function () {
                    layer.msg('发送请求失败')
                }
            })
        }

        //监听Tab切换
        element.on('tab(pps_chart)', function(data){
            var timeType = $(this).attr('timeType');
            var chartName = $(this).attr('chartName');
            pps_getChart(timeType,chartName);
        });

        //曲线
        function showQXChart(data,chartName){
            $("#pps_chartMon").highcharts({
                chart: {
                    type: 'spline'
                },
                title: {
                    text: chartName
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
                    categories: data.xAxis,
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
                        text: '新品数量(个)'
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
                    data: data.totalList,
                    name:"总新品数",
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
                    data: data.finishList,
                    name:"开发成功数",
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
                    data: data.devFailList,
                    name:"开发失败数",
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
            });
        };

    });
</script>

