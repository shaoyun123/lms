<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>PB管理明细统计</title>

<div class="layui-fluid">
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
                                        <input type="text" class="layui-input" id="pbsd_pbDetailTime" placeholder="请选择">
                                    </div>
                                </div>
                                <div class="layui-inline" style="padding-top: 3px;">
                                    <label class="layui-form-label">周期</label>
                                    <div class="layui-input-inline">
                                        <select id="pbsd_pbDetailDay" lay-filter="component-form-element">
                                            <option selected value="0" data-day1="0" data-day2="30">0-30天</option>
                                            <option value="30" data-day1="30" data-day2="60">31-60天</option>
                                            <option value="60" data-day1="60" data-day2="90">61-90天</option>
                                            <option value="90" data-day1="90">91天以上</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-inline" style="padding-top: 3px;">
                                    <label class="layui-form-label">人员</label>
                                   <div class="layui-input-block" id="pbsd_pbDetailType">
								      <input type="radio" name="statisticsType" value="seller" title="按销售人员统计" checked>
								      <input type="radio" name="statisticsType" value="bizzOwner" title="按开发人员统计">
							    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <div class="layui-card" id="pbstaticdetailCard">
                <div class="layui-card-header">
                    <!--<span>数量(1234)</span>-->
                    <div style="position: absolute;top:0;right: 10px">
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <input type="text" class="layui-input" placeholder="搜索" style="height: 32px">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <button id="pbsd_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body" id="pbsd_tableDiv">
                    <table class="layui-table" lay-filter="pbsd_tablefilter" id="pbsd_table"></table>
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
        form.render();
        //日期范围
        laydate.render({
            elem: '#pbsd_pbDetailTime'
            ,range: true
        });
        //表格渲染
        table.render({
            elem:'#pbsd_table',
            url: '${ctx}/pbstatisticsdetail/list.html', // 数据接口
            where: getSearchData(),
            cols: [
                [ //表头
                    { field: 'seller', title: '销售', width: '6%', sort:true},
                    { field: 'cost', title: '费用', width: '6%', sort:true},
                    { field: 'orderTotalAmt', title: '订单金额', sort: true, width: '6%', sort:true},
                    { field: 'orderNum', title: '订单数量', sort: true, width: '5%', sort:true},
                    { field: 'proportion', title: '比例', width: '5%', sort:true},
                    { field: 'pbCount', title: '活动数', width: '6%', sort:true},
                    { field: 'listingCount', title: '产品数', sort: true, width: '5%', sort:true},
                    { field: 'proportion0', templet:'<div>{{d.proportion0}}%</div>', title: '0-10%', sort: true, width: '6%', sort:true},
                    { field: 'proportion1', templet:'<div>{{d.proportion1}}%</div>', title: '11-20%', width: '6%', sort:true},
                    { field: 'proportion2', templet:'<div>{{d.proportion2}}%</div>', title: '21-30%', width: '6%', sort:true},
                    { field: 'proportion3', templet:'<div>{{d.proportion3}}%</div>', title: '31-40%', width: '6%', sort:true},
                    { field: 'proportion4', templet:'<div>{{d.proportion4}}%</div>', title: '41-50%', width: '6%', sort:true},
                    { field: 'proportion5', templet:'<div>{{d.proportion5}}%</div>', title: '51-60%', width: '6%', sort:true},
                    { field: 'proportion6', templet:'<div>{{d.proportion6}}%</div>', title: '61-70%', width: '6%', sort:true},
                    { field: 'proportion7', templet:'<div>{{d.proportion7}}%</div>', title: '71-80%', width: '6%', sort:true},
                    { field: 'proportion8', templet:'<div>{{d.proportion8}}%</div>', title: '81-90%', width: '6%', sort:true},
                    { field: 'proportion9', templet:'<div>{{d.proportion9}}%</div>', title: '91%以上', width: '6%', sort:true},

                ]
            ],
            page: true,
	        limits: [50, 100, 200], // 每页条数的选择项
            limit: 50, //默认显示20条
            done:function(){
                theadHandle().fixTh({ id:'#pbstaticdetailCard',h:200 })
            }
        });
        $("#pbsd_searchBtn").click(function(){
     		//执行重载
			table.reload('pbsd_table', {
				page: {
					curr: 1 //重新从第 1 页开始
			   },
			   where: getSearchData()
               
			});
        });  

        table.on('sort(pbsd_tablefilter)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
            var tr = "";
            $("#pbsd_tableDiv tr").each(function(){
                if($(this).find("td:first").text() == '总计'){
                    tr = $(this).prop("outerHTML");
                    $(this).remove();
                }
            });
            $("#pbsd_tableDiv tr:last").after(tr);
        }); 

        
        function getSearchData(){
        		var data = {};
        		var endTime = $("#pbsd_pbDetailTime").val();
     		if(endTime != ""){
     			data.endTimeStart = Date.parse(endTime.split(" - ")[0].replace(/\-/g, "/") +" 00:00:00");
     			data.endTimeEnd = Date.parse(endTime.split(" - ")[1].replace(/\-/g, "/") +" 00:00:00");
     		}else{
     			data.endTimeStart  ="";
     			data.endTimeEnd = "";
     		}
     		data.day1 = $("#pbsd_pbDetailDay option:selected").attr("data-day1");
     		data.day2= $("#pbsd_pbDetailDay option:selected").attr("data-day2");
     		if(!data.day1){
     		    data.day1 = "";
     		}
     		if(!data.day2){
     		    data.day2 = "";
     		}
     		//人员
     		data.statisticsType = $("#pbsd_pbDetailType input[name=statisticsType]:checked").val();
     		return data;
        }

    });
</script>

