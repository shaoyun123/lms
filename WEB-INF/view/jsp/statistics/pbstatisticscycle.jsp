<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>

<title>PB管理周期统计</title>
<style>
    #LAY-pbstatcycle .layui-table-view .layui-table{
        /* width: 100% !important; */
    }
</style>
<div class="layui-fluid" id="LAY-pbstatcycle">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">
                    <h2>WishPB管理统计  <span style="color: #c2c2c2;font-size: 14px;margin-left: 10px">默认统计30天内活动数据</span></h2>
                </div>
                <div class="layui-card-body">
                        <div class="layui-form">
                            <div class="layui-form-item" style="margin-bottom: 0">
                                <div class="layui-inline" style="padding-top: 3px;">
                                    <label class="layui-form-label" style="width: 100px;padding-left: 0">活动结束时间</label>
                                    <div class="layui-input-inline">
                                        <input type="text" class="layui-input" id="pbsc_pbCycleTime" placeholder="请选择">
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <div class="layui-card" id="pbstaticcycleCard">
                <div class="layui-card-header">
                   <!-- <span id="pbsc_count">数量(1234)</span>-->
                    <div style="position: absolute;top:0;right: 10px">
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <input  type="text" class="layui-input" placeholder="搜索" style="height: 32px">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <button id="pbsc_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body" id="pbsc_tableDiv">
                     <table id="pbsc_table" lay-filter="pbsc_tablefilter" class="layui-table">
                     </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    layui.use(['admin', 'form', 'table','laydate','upload'], function() {
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
        table.init();
        var store_Info_table = table.render({
        elem: '#pbsc_table',
        url: ctx + '/pbstatisticscycle/list.html' //数据接口
        ,
        title: 'WishPB管理统计',
        page: true //开启分页
            ,
        toolbar: false //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,
        totalRow: true //开启合计行
            ,
        cols:[[ //表头
                {
                    field:'seller',
                    title: '销售',
                    rowspan:2
                }, {
                    title: '0-30天',
                    colspan:4
                }, {
                    title: '31-60天',
                    colspan:4
                }, {
                    title: '61-90天',
                    colspan:4
                }, {
                    title: '90天以上',
                    colspan:4
                }
            ],[
                {
                    field:'cost0',
                    title:'费用',
                    sort:true
                },{
                    field:'orderTotalAmt0',
                    title:'订单金额',
                    sort:true
                },
                {
                    field:'orderNum0',
                    title:'订单数量',
                    sort:true
                },
                {
                    field:'proportion0',
                    title:'比例',
                    sort:true
                },
                {
                    field:'cost3',
                    title:'费用',
                    sort:true
                },
                {
                    field:'orderTotalAmt3',
                    title:'订单金额',
                    sort:true
                },
                {
                    field:'orderNum3',
                    title:'订单数量',
                    sort:true
                },
                {
                    field:'proportion3',
                    title:'比例',
                    sort:true
                },
                {
                    field:'cost6',
                    title:'费用',
                    sort:true
                },
                {
                    field:'orderTotalAmt6',
                    title:'订单金额',
                    sort:true
                },
                {
                    field:'orderNum6',
                    title:'订单数量',
                    sort:true
                },
                {
                    field:'proportion6',
                    title:'比例',
                    sort:true
                },
                {
                    field:'cost9',
                    title:'费用',
                    sort:true
                },
                {
                    field:'orderTotalAmt9',
                    title:'订单金额',
                    sort:true
                },
                {
                    field:'orderNum9',
                    title:'订单数量',
                    sort:true
                },
                {
                    field:'proportion9',
                    title:'比例',
                    sort:true
                }
            ]
        ],
        created:function(res,curr,count){
            for(var i = 0;i<res.data.length;i++){
                res.data[i].proportion0 = res.data[i].proportion0+'%';
                res.data[i].proportion3 = res.data[i].proportion3+'%';
                res.data[i].proportion6 = res.data[i].proportion6+'%';
                res.data[i].proportion9 = res.data[i].proportion9+'%';
            }
        },
	    done: function(res, curr, count){
            theadHandle().fixTh({ id:'#pbstaticcycleCard',h:200 })
	  }
    });
        
        //日期范围
        laydate.render({
            elem: '#pbsc_pbCycleTime'
            ,range: true
        });
        $("#pbsc_searchBtn").click(function(){
        		var data = {};
        		var endTime = $("#pbsc_pbCycleTime").val();
     		if(endTime != ""){
     			data.endTimeStart = Date.parse(endTime.split(" - ")[0].replace(/\-/g, "/") +" 00:00:00");
     			data.endTimeEnd = Date.parse(endTime.split(" - ")[1].replace(/\-/g, "/") +" 00:00:00");
     		}else{
                data.endTimeStart = "";
                data.endTimeEnd = "";
            }
     		//执行重载
			var tableIns = table.reload('pbsc_table', {
				page: {
					curr: 1 //重新从第 1 页开始
			   },
			   where: data
			});
        });
        table.on('sort(pbsc_tablefilter)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
            var tr = "";
            $("#pbsc_tableDiv tr").each(function(){
                if($(this).find("td:first").text() == '总计'){
                    tr = $(this).prop("outerHTML");
                    $(this).remove();
                }
            });
            $("#pbsc_tableDiv tr:last").after(tr);
        });     
    });
</script>
