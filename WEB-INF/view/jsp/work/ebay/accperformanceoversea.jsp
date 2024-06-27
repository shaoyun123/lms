<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>海外仓指标</title>
<style>
    .table_title{
        border:1px solid #e6e6e6;
        display: inline-block;
        line-height:20px;
        padding: 10px;
        background: #fff;
    }
    #accplay_report .layui-table,#accplay_report .layui-table-view{
        margin:0 !important;
    }

    .title{
        font-size: 18px;
        color:#000;
        font-weight:600;
        line-height: 45px;
    }
    .border_b{
        border-bottom:1px solid #e6e6e6;
    }
    .border_all{
        border:1px solid #e6e6e6;
    }

    .ml_20{
        margin-left: 20px;
    }
    td{
        text-align: center;
    }
    .w_95{
        width: 95%!important;
    }

    .fr{
        float: right!important;
    }
    .accRed {
        color: rgb(250, 201, 7);
        font-size: 14px
    }
    .accGreen {
        color: green;
        font-size: 14px
    }

    .point_st{
        cursor: pointer;
    }
    .m_10{
        margin:10px;
    }
    #accplay_report .layui-table-header{
        border-bottom:none;
    }


</style>
<div class="layui-fluid"  id="accplay_report">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="ebay_oversea_table" lay-filter="ebay_oversea_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 表格渲染模板 -->
<script type="text/javascript">
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage','laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        table=layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        $ = layui.$;
        form.render();
        var date='',date1='',date2='';
        $(function(){
            $.ajax({
                beforeSend: function(){
                    loading.show();
                },
                type: "POST",
                url: ctx+"/ebayaccountdata/listOverSea.html",
                async: false,
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        if(returnData.data && returnData.data[0]){
                           if(returnData.data[0].reviewStarDate1){
                               date = '('+returnData.data[0].reviewStarDate1+'-'+returnData.data[0].reviewEndDate1+')';
                           }
                            if(returnData.data[0].reviewStarDate2){
                                date1 = '('+returnData.data[0].reviewStarDate2+'-'+returnData.data[0].reviewEndDate2+')';
                            }
                            if(returnData.data[0].reviewStarDate3){
                                date2 = '('+returnData.data[0].reviewStarDate3+'-'+returnData.data[0].reviewEndDate3+')';
                            }
                        };
                    } else {
                    }
                    loading.hide();
                },
                error: function () {
                    loading.hide();
                    layer.msg("服务器正忙");
                }
            });
        })
           table.render({
               elem: "#ebay_oversea_table",
               method:'post',
               url: ctx+"/ebayaccountdata/listOverSea.html",
               toolbar: false //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
               ,
               totalRow: true //开启合计行
               ,
               cols: [[ //表头
                   {
                       field: 'storeAcctId',
                       title: '账户',
                       templet:'#accountTemOrversea',
                       rowspan:2,
                       sort:true,
                   }, {
                       field: 'mainSite',
                       title: '站点',
                       rowspan:2,
                       sort:true,
                       width:'3%'
                   },{
                       field: 'totalSoldValue',
                       title: '近31天销售额',
                       rowspan:2,
                       templet:'<div>{{# if(d.totalSoldValue){ }}{{d.totalSoldValue}}({{d.totalSoldCurrency}}){{# }else{ }}无数据{{# } }}</div>',
                       sort:true,
                   },{
                       title: '<span style="color:blue;">统计日期'+date+'</span>',
                       field: '#processDate1',
                       colspan:6
                   }, {
                       field: 'processDate2',
                       title: '<span style="color:blue;">统计日期'+date1+'</span>',
                       colspan:6
                   }, {
                       field: 'processDate3',
                       title: '<span style="color:blue;">统计日期'+date2+'</span>',
                       colspan:6
                   }
               ], [
                   {
                       field: 'dater',
                       title: '统计时间',
                       templet:'<div>{{# if(d.checkDate1){ }}{{Format(d.checkDate1,"yyyy-MM-dd")}}{{# }else{ }}无数据{{# } }}</div>'
                   },
                   {
                       field: 'actionStatus',
                       title: '状态',
                       templet:'#actionStatusTemp1',
                       width:'3%'


                   },{
                       field:'correctListRate1',
                       title:'合规刊登率',
                       templet:'#correctListRateTpl1',
                       sort:true,

                   },{
                       field:'ascanHtRate1',
                       title:'及时发货率',
                       templet:'#ascanHtRateSdTpl1',
                       sort:true,

                   },{
                       field:'dscanEddRate1',
                       title:'及时送达率',
                       templet:'#dscanEddRateTpl1',
                       sort:true,
                   },{
                       field:'shipDefectRate1',
                       title:'物流不良交易率',
                       sort:true,
                       templet:'#shipDefectRateTpl1'
                   },{
                       field: 'dater',
                       title: '统计时间',
                       templet:'<div>{{# if(d.checkDate2){ }}{{Format(d.checkDate2,"yyyy-MM-dd")}}{{# }else{ }}无数据{{# } }}</div>'
                   },{
                       field: 'syncStatus',
                       title: '状态',
                       templet:'#actionStatusTemp2',
                       width:'3%'

                   },{
                       field:'correctListRate2',
                       title:'合规刊登率',
                       sort:true,
                       templet:'#correctListRateTpl2'
                   },{
                       field:'ascanHtRate2',
                       title:'及时发货率',
                       templet:'#ascanHtRateSdTpl2',
                       sort:true,
                   },{
                       field:'dscanEddRate2',
                       title:'及时送达率',
                       sort:true,
                       templet:'#dscanEddRateTpl2'
                   },{
                       field:'shipDefectRate2',
                       title:'物流不良交易率',
                       sort:true,
                       templet:'#shipDefectRateTpl2'
                   },{
                       field: 'dater',
                       title: '统计时间',
                       templet:'<div>{{# if(d.checkDate3){ }}{{Format(d.checkDate3,"yyyy-MM-dd")}}{{# }else{ }}无数据{{# } }}</div>'
                   },{
                       field: 'syncStatus',
                       title: '状态',
                       templet:'#actionStatusTemp3',
                       width:'3%'
                   },{
                       field:'correctListRate3',
                       title:'合规刊登率',
                       sort:true,
                       templet:'#correctListRateTpl3'
                   },{
                       field:'ascanHtRate3',
                       title:'及时发货率',
                       templet:'#ascanHtRateSdTpl3',
                       sort:true,
                   },{
                       field:'dscanEddRate3',
                       title:'及时送达率',
                       sort:true,
                       templet:'#dscanEddRateTpl3'
                   },{
                       field:'shipDefectRate3',
                       title:'物流不良交易率',
                       sort:true,
                       templet:'#shipDefectRateTpl3'
                   }
                   ]
               ],

               page:false,
               id:"ebay_oversea_table",
               done:function(res, curr, count){

               }
           });

    //悬浮显示全部错误信息
    $("body").on('mouseover', '.af_storeAcct_oversea', function() {
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
})

</script>

<script type="text/html" id="daterTemp1">
    {{# if (d.reviewStarDate1){ }}
    <span style="color:blue;">(
        {{d.reviewStarDate1}}-{{d.reviewEndDate1 }})</span>
        {{# }else{ }}
    <span>（无数据）</span>
    {{# } }}
</script>
<script type="text/html" id="daterTemp2">
    {{# if (d.reviewStarDate2){ }}
    <span style="color:blue;">(
        {{d.reviewStarDate2}}-{{d.reviewEndDate2 }})</span>
    {{# }else{ }}
    <span>（无数据）</span>
    {{# } }}
</script>
<script type="text/html" id="daterTemp3">
    {{# if (d.reviewStarDate3){ }}
    <span style="color:blue;">(
        {{d.reviewStarDate3}}-{{d.reviewEndDate3 }})</span>
    {{# }else{ }}
    <span>（无数据）</span>
    {{# } }}
</script>



<script type="text/html" id="shipDefectRateTpl1">
    {{# if (d.shipDefectRateFlag1){ }}
    <span {{# if (d.shipDefectRateFlag1 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.shipDefectRate1 > d.shipDefectRateSd1){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.shipDefectRate1)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="shipDefectRateTpl2">
    {{# if (d.shipDefectRateFlag2){ }}
    <span {{# if (d.shipDefectRateFlag2 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.shipDefectRate2 > d.shipDefectRateSd2){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.shipDefectRate2)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>

<script type="text/html" id="shipDefectRateTpl3">
    {{# if (d.shipDefectRateFlag3){ }}
    <span {{# if (d.shipDefectRateFlag3 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.shipDefectRate3 > d.shipDefectRateSd3){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.shipDefectRate3)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>



<script type="text/html" id="dscanEddRateTpl1">
    {{# if (d.dscanEddRateFlag1){ }}
    <span {{# if (d.dscanEddRateFlag1 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.dscanEddRate1 < d.dscanEddRateSd1){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.dscanEddRate1)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="dscanEddRateTpl2">
    {{# if (d.dscanEddRateFlag2){ }}
    <span {{# if (d.dscanEddRateFlag2 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.dscanEddRate2 < d.dscanEddRateSd2){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.dscanEddRate2)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="dscanEddRateTpl3">
    {{# if (d.dscanEddRateFlag3){ }}
    <span {{# if (d.dscanEddRateFlag3 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.dscanEddRate3 < d.dscanEddRateSd3){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.dscanEddRate3)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>


<script type="text/html" id="ascanHtRateSdTpl1">
    {{# if (d.ascanHtRateFlag1){ }}
    <span {{# if (d.ascanHtRateFlag1 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.ascanHtRate1 < d.ascanHtRateSd1){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.ascanHtRate1)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="ascanHtRateSdTpl2">
    {{# if (d.ascanHtRateFlag2){ }}
    <span {{# if (d.ascanHtRateFlag2 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.ascanHtRate2 < d.ascanHtRateSd2){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.ascanHtRate2)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="ascanHtRateSdTpl3">
    {{# if (d.ascanHtRateFlag3){ }}
    <span {{# if (d.ascanHtRateFlag3 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.ascanHtRate3 < d.ascanHtRateSd3){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.ascanHtRate3)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>


<script type="text/html" id="correctListRateTpl1">
    {{# if (d.correctListRateFlag1){ }}
    <div {{# if (d.correctListRateFlag1 == 1){ }}
        class="layui-bg-orange"
        {{# } }}
        {{# if (d.correctListRate1 < d.correctListRateSd1){ }}
        style="color:red !important;"
        {{# } }}>
        {{percentToStr(d.correctListRate1)}}</div>
    {{# }else{ }}
    <div>无数据</div>
    {{# } }}
</script>
<script type="text/html" id="correctListRateTpl2">
    {{# if (d.correctListRateFlag2){ }}
    <span {{# if (d.correctListRateFlag2 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.correctListRate2 < d.correctListRateSd2){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.correctListRate2)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="correctListRateTpl3">
    {{# if (d.correctListRateFlag3){ }}
    <span {{# if (d.correctListRateFlag3 == 1){ }}
          class="layui-bg-orange"
          {{# } }}
          {{# if (d.correctListRate3 < d.correctListRateSd3){ }}
    style="color:red !important;"
    {{# } }}>
    {{percentToStr(d.correctListRate3)}}</span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="actionStatusTemp1">
    {{# if (d.actionStatus1){ }}
    <span class="{{newwarehouseTran(d.actionStatus1).class}}"><b>{{newwarehouseTran(d.actionStatus1).text}}</b></span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="actionStatusTemp2">
    {{# if (d.actionStatus2){ }}
    <span class="{{newwarehouseTran(d.actionStatus2).class}}"><b>{{newwarehouseTran(d.actionStatus2).text}}</b></span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="actionStatusTemp3">
    {{# if (d.actionStatus3){ }}
    <span class="{{newwarehouseTran(d.actionStatus3).class}}"><b>{{newwarehouseTran(d.actionStatus3).text}}</b></span>
    {{# }else{ }}
    <span>无数据</span>
    {{# } }}
</script>
<script type="text/html" id="accountTemOrversea">
    <div data-id="{{d.storeAcctId}}">
        {{# if(d.syncStatus){ }}
        <span class="af_storeAcct_oversea point_st">{{d.storeAcctName}}</span>
        <pre class="layui-hide">同步成功:{{ Format(d.syncTime,"yyyy-MM-dd hh:mm:ss")}}</pre>
        {{# }else{ }}
        <span class="af_storeAcct_oversea point_st" style="color:red">{{d.storeAcctName}}</span>
        <pre class="layui-hide">同步失败:{{d.syncDesc}}</pre>
        {{# } }}
    </div>
</script>

<script>
    //TODO delete
    function timestampToTime(timestamp) {
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
    }

    function percentToStr(percent){
        if(!isNaN(percent) && percent!=null){
            return (percent*100).toFixed(2) + "%"
        }else{
            return "-";
        }
    }
    function newwarehouseTran(str){
        if(typeof(str)=='undefined'){
            str = "-1";
        }
        var obj = {'0':{'imgPath':'${ctx}/static/img/tick.png','text':'正常','class':"accGreen"},
            '1':{'imgPath':'${ctx}/static/img/over.png','text':'超标','class':"accRed"},
            '2':{'imgPath':'${ctx}/static/img/tips.png','text':'警告','class':"accRed"},
            '3':{'imgPath':'${ctx}/static/img/warn.png','text':'限制','class':"accRed"},
            '4':{'imgPath':'${ctx}/static/img/warn.png','text':'限制（历史受限）','class':"accRed"},
            '5':{'imgPath':'${ctx}/static/img/warn.png','text':'账号本周将被额度清零，如有申诉请联系客户经理','class':"accRed"},
            '-1':{'imgPath':'','alter':'无数据','text':'','class':""}
        }
        return obj[str];
    }
    template.defaults.imports.percentToStr = function(percent){
        return percentToStr(percent);
    };
    template.defaults.imports.newwarehouseTran = function(str){
        return newwarehouseTran(str);
    };
    template.defaults.imports.Format = function(time,formatStr){
        return Format(time,formatStr);
    };

</script>