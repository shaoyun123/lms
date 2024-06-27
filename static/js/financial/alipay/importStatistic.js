layui.use(['admin', 'layer', 'table','laydate'], function() {
            var $ = layui.$,
              admin=layui.admin,
              laydate = layui.laydate
              laydate.render({
                elem: '#alipay_activeEndTime',//指定元素
                type: 'month',
                done: function(value, date, endDate){ //日期选择完毕出发检索事件
                    countAlipayOrderMonthData(date.year,date.month);//统计某月的导入数据
                  },
                 value: new Date()
              })     
             countAlipayOrderMonthData();
            //2-2.函数渲染(需要请求url)
            function countAlipayOrderMonthData(yearStr,monthStr){
                var c_index = layer.load(1, {
                    shade: [0.3,'#ccc']
                });
                $.ajax({
                    type: 'post',
                    url: ctx + "/msgAlipayOrder/countAlipayOrderMonthData.html",
                    dataType: 'json',
                    data: {"yearStr":yearStr,"monthStr":monthStr},
                    success: function(data){
                        layer.close(c_index);
                        var arr = ['<th>支付宝</th>','<th style="min-width:100px;">公司</th>'];
                        var  dayCount=data.data[0].everyData.length;
                        for(var i=1;i<=dayCount;i++){//这月有多少天
                            arr.push('<th>'+i+'号'+data.data[0].everyData[i-1].week+'</th>') 
                        }
                        $('#importStatistic_table thead tr').html(arr.join(''))
                        var html = "";
                        for(var i=0;i<data.count;i++){
                        	html+="<tr>";
                        	var dataI=data.data[i];
                        	html+="<td>"+dataI.alipayAcct+"</td>";
                        	html+="<td >"+dataI.compName+"</td>";
                        	for(var j=0;j<dayCount;j++){
                        		var isImport=dataI.everyData[j].isImport
                        		if(isImport=="N"){
                        			html+="<td>"+dataI.everyData[j].isImport+"</td>";
                        		}else{
                        			html+="<td style='background: #5FB878;'></td>";
                        		}
                        	}
                        	html+="</tr>";
                        }
                        $('#importStatistic_table tbody').html(html);
                    },
                    error:function(){
                        layer.close(c_index);
                        layer.msg("服务器错误",{icon:5});
                    }
                })
            }
})