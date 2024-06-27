<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>标记发货规则</title>
<style>
    .dis_flex_wrap{
        display: flex;
        flex-wrap: wrap;
    }
    .dis_flex_around{
        display: flex;
        justify-content:space-around;
    }
    .w_30{
        width: 30%;
    }
</style>

<div class="layui-fluid" id="LAY-markDeliveryRules">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div style="padding:20px 0 0 20px;">
                    <div><strong>说明:</strong></div>
                     <p>1. 最近30天的订单;</p>
                     <p>2. 未标记发货和标记发货失败的订单;</p>
                     <p>3. 已申请跟踪号的订单;</p>
                     <p>4. 已开启标记发货的平台，且订单状态符合下表配置;</p>
                     <p>5. 20分钟执行一次</p>
                 </div>
                <div class="layui-card-body">
                   <table class="layui-table" id="markDeliveryRules_table"  lay-filter="markDeliveryRules_table"></table>
                </div>
            </div>
        </div>
</script>

<!-- 操作栏 -->
<script type="text/html" id="autoAuditRules_Tool">
    {{# if(d.autoAudit){ }}
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="autoAudit_off">停用</button>
    {{# }else{ }}
    <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="autoAudit_on">启用</button>
    {{# } }}
    <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="manageIgnoreCondition">不处理条件</button>
</script>

<!-- 条件2列 -->
<script type="text/html" id="markDeliveryRules_orderStatus">
    {{# if(d.platCode === 'aliexpress'){ }}
    <p>'WAIT_SELLER_SEND_GOODS'</p>
    <p>'SELLER_PART_SEND_GOODS'</p>
    {{# }else{ }}
    {{# } }}
</script>
<script type="text/html" id="markDeliveryRules_condition3">
    <div class="layui-form layui-form-item dis_flex_wrap">
    {{# layui.each(d.optionalStatusList, function(index, item){ }}
    {{# if(d.processStatusList.indexOf(item.name)>-1){ }}
    <input type="checkbox" class="layui-input" lay-filter="processStatusList" name="processStatusList" title="{{item.value}}" value="{{item.name}}" lay-skin="primary" checked>
    {{# }else{ }}
    <input type="checkbox" class="layui-input" lay-filter="processStatusList" name="processStatusList" title="{{item.value}}" value="{{item.name}}" lay-skin="primary">
    {{# } }}
    {{# }) }}
</div>
</script>

<script type="text/html" id="markDeliveryRules_status">
    <div class="layui-form layui-form-item">
    {{# if(d.status){ }}
    <input type="checkbox" class="layui-input" lay-filter="status" name="status" lay-skin="primary" checked>
    {{# }else{ }}
    <input type="checkbox" class="layui-input" lay-filter="status" name="status" lay-skin="primary">
    {{# } }}
</div>
</script>

<script type="text/html" id="markDeliveryRules_condition2">
    <div class="dis_flex_around">
        {{# if(d.orderHoursType == 1){ }}
        <span>距离订单时间</span>
        {{# }else{ }}
        <span>距离最迟标记时间</span>
        {{# } }}
        <input type="number" name="orderHours" value="{{d.orderHours}}" class="layui-input w_30"/>
        <span>小时标记</span>
    </div>
</script>

<script>
    /**
 * 订单操作的详情弹框
 */
layui.use(['form', 'table', 'layer', 'element'], function() {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer;
        var markDeliveryRules = {
            init:function(){
                var _this = this
                _this.rendermarkDeliveryRule()
            },
            rendermarkDeliveryRule:function(){
                var _this = this
                table.render({
                    elem: '#markDeliveryRules_table',
                    method: 'GET',
                    url: ctx + '/order/rule/shipping/query.html',
                    id: 'markDeliveryRules_tableId',
                    cols: [
                        [
                        { title: "平台", field: "platCode", width: 118 },
                        { title: "平台订单状态", templet:'#markDeliveryRules_orderStatus' },
                        { title: "条件2", field: "orderHours",templet:'#markDeliveryRules_condition2' },
                        { title: "条件3", field: "processStatusList",templet: "#markDeliveryRules_condition3"},
                        { title: "启用状态", field: "id",templet:"#markDeliveryRules_status", width: 65},
                        { title: "备注", field: "remark", edit:'text'},
                        ]
                        ],
                    page: false,
                    limit:5000,
                    height: 'full-245',
                    unFixedTableHead: true,
                    id: 'markDeliveryRules_tableId',
                    created:function(res){
                        res.data = res.data.filter(item => item.logisNoStatus);
                        res.data?.forEach(item => {
                          //item.remark = '';
                          if(item.platCode == 'tiktok' && item.orderHoursType ==2){
                            item.remark = '距离rts_sla(平台要求卖家最晚标记发货的时间）的时间小于配置值时才会自动标记发货';
                          }
                        })
                    },
                    done: function(res) {
                        form.render()
                        _this.modifyCondition2()
                        _this.modifyCondition3()
                        _this.modifyStatus()
                        _this.mergeTdFn(res.data);
                        // 监听单元格编辑事件
                        table.on('edit(markDeliveryRules_table)', function(obj) {
                            //var data = obj.data; // 当前行的数据
                            var tr = $(this).parents('tr')
                            var data = _this.getRowData(tr);
                            data.remark=obj.value;
                            updatemarkDeliveryRules(data,function(returnData){
                                layer.msg(returnData.msg||'修改成功')
                            })
                        });
                    }
                })
            },
            //ztt20230913 合并列
            mergeTdFn(data){
              //第一项平台是ebay的开始合并
              let firstEbayIndex = data.findIndex(item => item.platCode =='ebay');
              //获取所有的ebay选项
              let allEbayArr = data.filter(item => item.platCode =='ebay');
              //获取tbody
              let $tbody = $('#markDeliveryRules_table').next().find('.layui-table-body.layui-table-main tbody');
              //获取tbody下的第firstEbayIndex行
              let ebayFirstTr = $tbody.find('tr[data-index='+firstEbayIndex+']');
              //获取最后一列,然后合并allEbayArr.length行
              ebayFirstTr.find('td[data-field=remark]').attr('rowspan', allEbayArr.length);
              ebayFirstTr.find('td[data-field=remark] div').html('<font>拆分订单,优先使用橙联物流标记发货</font>');
              //删除非首行Tr的最后一列td
              console.log(allEbayArr);
              for(let i=0; i< allEbayArr.length; i++){
                if(i >0){
                  let currentIndex = firstEbayIndex+i;
                  $tbody.find('tr[data-index='+currentIndex+']').find('td:last-child').remove();
                }
              }

              //合并tiktok
              //let firstTiktokIndex = data.findIndex(item => item.platCode =='tiktok');
              //获取所有的ebay选项
              //let allTiktokArr = data.filter(item => item.platCode =='tiktok');
              //获取tbody下的第firstEbayIndex行
              //let tiktokFirstTr = $tbody.find('tr[data-index='+firstTiktokIndex+']');
              //获取最后一列,然后合并allEbayArr.length行
              //tiktokFirstTr.find('td[data-field=remark]').attr('rowspan', allTiktokArr.length);
              //tiktokFirstTr.find('td[data-field=remark] div').html('<font>距离rts_sla(平台要求卖家最晚标记发货的时间）的时间小于配置值时才会自动标记发货</font>');
              //删除非首行Tr的最后一列td
              //for(let i=0; i< allTiktokArr.length; i++){
              //  if(i >0){
              //    let currentIndex = firstTiktokIndex+i;
              //     $tbody.find('tr[data-index='+currentIndex+']').find('td:last-child').remove();
              //  }
             // }
            },
            modifyCondition2:function(){
                var _this = this
                $('#LAY-markDeliveryRules').find('input[name="orderHours"]').blur(function(e){
                    var tr = $(this).parents('tr')
                    var data = _this.getRowData(tr)
                    updatemarkDeliveryRules(data,function(returnData){
                        layer.msg(returnData.msg||'修改成功')
                    })
                })
            },
            modifyCondition3:function(){
                var _this = this
                form.on('checkbox(processStatusList)', function(data){
                    var tr = $(data.elem).parents('tr')
                    var data = _this.getRowData(tr)
                    updatemarkDeliveryRules(data,function(returnData){
                        layer.msg(returnData.msg||'修改成功')
                    })
                });        
            },
            modifyStatus:function(){
                var _this = this
                form.on('checkbox(status)', function(data){
                    var tr = $(data.elem).parents('tr')
                    var data = _this.getRowData(tr)
                    updatemarkDeliveryRules(data,function(returnData){
                        layer.msg(returnData.msg||'修改成功')
                    })
                });
            },
            getRowData:function(aTr){
                var orderHours = aTr.find('td[data-field="orderHours"]').find('input[name="orderHours"]').val()
                var processStatusListchecked =aTr.find('td[data-field="processStatusList"]').find('.layui-form-checked').prev();
                var processStatusListArr = []
                processStatusListchecked.each(function(index,item){
                    processStatusListArr.push(item.value)
                })
                var processStatusList = processStatusListArr.join(',')
                var status = aTr.find('td[data-field="id"]').find('.layui-form-checkbox').hasClass('layui-form-checked')
                var id = aTr.find('td[data-field="id"]').attr('data-content')
                return {id,status,processStatusList,orderHours}
            }
        }

        markDeliveryRules.init()

        // 获取条件枚举数据[后端接口已删除--ztt20230802]
        function getmarkDeliveryRulesEnum(func){
            initAjax('/order/rule/shipping/listenum.html', 'get', {}, function(returnData) {
                if(func){
                    func(returnData)
                }
            })
        }

        // 更新标记发货规则
        function updatemarkDeliveryRules(data,func){
            initAjax('/order/rule/shipping/update.html', 'POST', data, function(returnData) {
                if(func){
                    func(returnData)
                }
            },'application/x-www-form-urlencoded')
        }

});

function initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
    if (!isLoad) {
        loading.show()
    }
    $.ajax({
        type: method,
        url: ctx + url,
        dataType: 'json',
        async: true,
        data: data,
        contentType: contentType || 'application/json',
        beforeSend: function(returnData) {
            if (func2) {
                func2(returnData)
            }
        },
        success: function(returnData) {
            loading.hide()
            if (returnData.code == "0000") {
                func(returnData)
            } else {
                layer.msg(returnData.msg, { icon: 2 });
            }
        },
        error: function(returnData) {
            layui.admin.load.hide();
            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        },
        complete: function(returnData) {
            loading.hide()
            if (func3) {
                func3(returnData)
            }
        }
    })
}
</script>