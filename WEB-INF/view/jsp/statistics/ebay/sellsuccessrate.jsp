<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>销售成功率统计</title>
<style>
        .label_reset{
        padding: 0 10px !important;
    }
    .w_40{
        width: 40% !important;
    }
    .flex_between{
        display: flex;
        justify-content: space-between;
    }
    .ssr_10{
        padding-left: 10px !important;   
    }
    .fr{
        float: right;
    }
    .mr_10{
        margin-right: 10px;
    }
    .m_20{
        margin: 20px !important;
    }
    .m_5{
        margin: 5px !important;
    }
    .mergerow{
        border:none!important;
    }
    .fr{
        float: right;
    }

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
    .red{
        color:red;
    }
    .standarddefine:hover{
        color:green;
    }
</style>
<div class="layui-fluid" id="LAY-sellsuccessrate">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="ess_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="ess_orgFilter" class="orgs_hp_custom" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId"  class="users_hp_custom" data-rolelist="ebay专员" lay-filter="ess_sellerFilter" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="platAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="ess_search-store" lay-search="" >
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">主站点</label>
                                <div class="layui-input-block">
                                    <select name="mainSite" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">仓库属性</label>
                                <div class="layui-input-block">
                                    <select name="storeWarehouse">
                                        <option value="">全部</option>
                                        <option value="0">国内仓</option>
                                        <option value="1">海外仓</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">查询时间</label>
                                <div class="layui-input-block">
                                    <input name="month" type="text" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md12 layui-col-lg12">
                                <button class="layui-btn layui-btn-primary layui-btn-sm fr" type="reset">清空</button>
                                <button id="ess_searchBtn" class="layui-btn layui-btn-sm fr" type="button">搜索</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="sellsuccessrateCard">
                <div class="layui-card-header">
                    <div class="layui-col-md2 layui-col-lg2 m_5">
                        <label class="layui-form-label">目标增长</label>
                        <div class="layui-input-block">
                            <input name="targetGmvGrowth" type="number" class="layui-input" placeholder="%">
                        </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2 m_5">
                        <label class="layui-form-label">目标GMV</label>
                        <div class="layui-input-block">
                            <input name="targetGmvAmount" type="number" class="layui-input" placeholder="$">
                        </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2 ssr_10">
                        <button id="ess_setTargetBtn" class="layui-btn layui-btn-sm">设置目标</button>
                    </div>
                    <div class="layui-col-md5 layui-col-lg5">
                        <span class="fr standarddefine">指标定义</span>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="ess_table" lay-filter="ess_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 表格渲染模板 -->

<!-- 手动标记跟踪号弹框 -->
<script type="text/html" id="store_detail_layer">
    <form class="layui-form m_20">
        <div class="layui-inline">
            <label class="layui-form-label">刊登时间</label>
            <div class="layui-input-block">
                <input name="publish_time" type="text" class="layui-input" id="publish_time"/>
            </div>
        </div>
        <div class="layui-inline">
            <button class="layui-btn layui-btn-sm" id="mark_btn">搜索</button>
        </div>
    </form>
    <div>
        <div class="m_20">
        <table class="layui-table" id="detail_table" lay-filter="detail_table"></table>
        </div>
    </div>
</script>

<!-- 表格渲染模板 -->
<script type="text/html" id="ess_createTimeTpl">
    {{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}
</script>

<script type="text/html" id="ess_storeAcctTpl">
    {{d.storeAcct}}
</script>
<script type="text/html" id="ess_targetGmvAmountTpl">
{{# if(d.targetGmvAmount){ }}
    {{d.targetGmvAmount}}
    {{# if(d.targetGmvGrowth && d.targetGmvGrowth!=0){ }}
        ({{(d.targetGmvGrowth*100).toFixed(2) + "%"}})
    {{# } }}
{{# }else{ }}
*
{{# } }}
</script>

<script type="text/html" id="ess_tips">
    {{# if(d.space_row){ }}
    {{d.space_row}}
    {{# }}}
</script>

<!-- 表格渲染模板 -->
<script type="text/javascript">
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage','laydate',"laytpl"], function () {
    var admin = layui.admin,
        form = layui.form,
        table=layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        $ = layui.$;
    form.render();
    laydate.render({
        elem: '#ess_searchForm input[name=month]', //指定元素
        type: 'month'
    });
    //初始化部门人员店铺
    render_hp_orgs_users("#ess_searchForm");
    $(function(){
        var time = new Date(new Date().getFullYear(), new Date().getMonth()-1,1)
        var timeStr = Format(time,"yyyy-MM");
        $('#ess_searchForm input[name=month]').val(timeStr);
    });
    //表单查询
    $('#ess_searchBtn').click(function(){
        tableIns.reload({
            where:getSearchData(),
        })
    });
    
    function getSearchData(){
        var data = {};
        data.orgId = $("#ess_searchForm select[name=orgId]").val();
        data.salePersonId = $("#ess_searchForm select[name=salePersonId]").val();
        data.roleNames = $("#ess_searchForm select[name=salePersonId]").data("rolelist");
        data.storeAcctId = $("#ess_searchForm select[name=platAcctId]").val();
        data.month = $("#ess_searchForm input[name=month]").val();
        data.storeWarehouse = $("#ess_searchForm select[name=storeWarehouse]").val();
        data.mainSite = $("#ess_searchForm select[name=mainSite]").val();
        return data;
    }

    //明细弹框

  laytpl.percentToStr=function (percent) {
    if(!isNaN(percent)){
      return (percent*100).toFixed(2) + "%"
    }else{
      return "无数据";
    }
  }

   var tableIns = table.render({
    elem: "#ess_table",
        method: 'post',
        url: ctx + "/srse/list.html",
        cols: [
            [
            {type: 'checkbox'},
            { field: "storeAcct",title: "店铺",templet:"#ess_storeAcctTpl",sort:true},
            { field: "mainSite",title: "主站点",sort:true},
            { field: "lastGmvAmount",title: "上月GMV($)",sort:true},
            { field: "targetGmvAmount",title: "本月GMV目标($)", width:200, templet:"#ess_targetGmvAmountTpl",sort:true},
            { field: "gmvAmount",title: "本月GMV($)",sort:true},
            { field: "gmvCompletePercent",title: "目标完成率",
              templet:"<div>{{ layui.laytpl.percentToStr(d.gmvCompletePercent) }}</div>",sort:true},
            { field: "quantityLimitPercent",title: "在线数量可用率",
              templet:"<div>{{ layui.laytpl.percentToStr(d.quantityLimitPercent) }}</div>",sort:true},
            { field: "space_row",title: "",templet:'#ess_tips'},
            { field: "manualTotalNum",title: "手动在线总数",sort:true},
            { field: "batchTotalNum",title: "批量在线总数",sort:true},
            { field: "storeSalePercent",title: "店铺售出率",
              templet:"<div>{{ layui.laytpl.percentToStr(d.storeSalePercent) }}</div>",sort:true},
            { field: "manualMonthNum",title: "近31天手动刊登数",sort:true},
            { field: "manualMonthSalePercent",title: "近31天手动刊登售出率",
              templet:"<div>{{ layui.laytpl.percentToStr(d.manualMonthSalePercent) }}</div>",sort:true},
            { field: "batchMonthNum",title: "近31天批量刊登数",sort:true},
            { field: "batchMonthSalePercent",title: "近31天批量刊登售出率",
              templet:"<div>{{ layui.laytpl.percentToStr(d.batchMonthSalePercent) }}</div>",sort:true},
            { field: "unsaleNum",title: "超90天未售出Listing数",sort:true},
            ],
        ],
        created:function(res,curr, count){
             if(res.data.length>0){
               res.data[0].space_row = '右边数据为当前数据，不受查询时间影响。'
             }
         },
        done: function(res, curr, count){
            theadHandle().fixTh({id:'#sellsuccessrateCard'});
            $('td[data-field="space_row"]').addClass('mergerow');
            $('.standarddefine').mouseenter(function(event){
                var e = event || window.event;
                e.preventDefault();
                var index = layer.tips('<b>店铺售出率：</b>售出在线Listing数量(售出数量>=5,且七天前)/店铺在线Listing数量(七天前<br/>)近31天手动刊登售出率 手动刊登售出在线Listing数量(售出数量>=1,且前35天-前4天)/手动刊登在线Listing数量(前35天-前4天)<br/><b>近31天批量刊登售出率</b> 批量刊登售出在线Listing数量(售出数量>=1,且前35天-前4天)/批量刊登在线Listing数量(前35天-前4天)<br/><b>超90天未售出Listing数</b> 刊登时间>90天的累计售出数量=0的在线Listing数量<br/><span class="red">右侧7列数据只统计目前在线的一口价listing，不考虑拍卖和停售</span>。',
                '.standarddefine',
                {
                area :['500px', 'auto'],
                time: 6000});
            })
        },
        id: "ess_table",
        page:false,
        where:getSearchData(),
   });
   $("#ess_setTargetBtn").click(function(){
       var storeAcctIds = [];
       var checkStatus = table.checkStatus('ess_table');
         var data = checkStatus.data;
         if (data.length == 0) {
             layer.msg("未选中店铺", {icon:7});
             return;
        }else {
          for(var i=0; i<data.length; i++){
            storeAcctIds.push(data[i].storeAcctId);
          }
        }
        //查看增长率或者增长金额
        var targetGmvGrowth = $("#sellsuccessrateCard input[name='targetGmvGrowth']").val();
        var targetGmvAmount = $("#sellsuccessrateCard input[name='targetGmvAmount']").val();
        var title = "";
        if(targetGmvGrowth.length>0){
            title = "设置店铺目标GMV增长率:"+targetGmvGrowth+"%";
            $("#sellsuccessrateCard input[name='targetGmvAmount']").val("");
        }else if(targetGmvAmount.length>0){
            title = "设置店铺目标GMV"+targetGmvAmount;
        }else{
            layer.msg("未设置增长率或GMV金额", {icon:7});
            return;
        }
        layer.confirm(title, {icon:3},function(index){
           layer.close(index);
            layui.admin.load.show(); 
            admin.req({
             url: ctx + '/srse/targetgmv.html'
            ,type: 'post'
            ,data: {
                storeAcctIds:storeAcctIds.join(","),
                targetGmvGrowth:targetGmvGrowth,
                targetGmvAmount:targetGmvAmount
            }
            ,done: function(returnData){ 
                
               layui.admin.load.hide(); 
               if(!returnData.data || returnData.data.length==0){
                 layer.msg("GMV设置成功", {icon:1});
              }else{
                layer.alert("以下店铺设置失败:<br>"+returnData.data.join("<br>"), {icon:7});
              }
              $("#ess_searchBtn").trigger("click");
             }
         });
         });
        
    });

    $(function(){
        $.ajax({
            type:"post",
            url:ctx + "/srse/listmainsite.html?platCode=ebay",
            dataType:"json",
            success:function(returnData){
                if(returnData.code != "0000"){
                    layer.msg("主站点初始化失败");
                }else{
                    var $option="<option value=''>全部</option>";
                    returnData.data.forEach(function(item){
                        $option += '<option value='+item+'>'+item+'</option>';
                    });
                    $('#ess_searchForm select[name="mainSite"]').append($option);
                }
                form.render('select');
            }
        });
    });
});


</script>