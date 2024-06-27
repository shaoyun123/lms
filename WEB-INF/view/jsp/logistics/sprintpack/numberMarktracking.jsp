<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>标记跟踪号</title>
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
    .pl_10{
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
</style>
<div class="layui-fluid" id="LAY-numberMarktracking">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="order_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcct" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单时间</label>
                                <div class="layui-input-block">
                                    <input name="ordertime" type="text" class="layui-input" id="ordertime"/>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">标记状态</label>
                                <div class="layui-input-block">
                                    <select name="markStatus" lay-search="">
                                        <option value="">全部</option>
                                        <option value="0" selected>未标记</option>
                                        <option value="2">标记失败</option>
                                        <option value="1">欧速通已标记</option>
                                        <option value="11">标记完成(妥投)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">普源标记</label>
                                <div class="layui-input-block">
                                    <select name="isAllrootMark" lay-search="">
                                        <option value="">全部</option>
                                        <option value="true" selected>普源已标</option>
                                        <option value="false">普源未标</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单状态</label>
                                <div class="layui-input-block">
                                    <select name="orderStatus" lay-search="">
                                        <option value="">全部</option>
                                        <option value="5">待派单</option>
                                        <option value="6">已派单</option>
                                        <option value="20">未拣货</option>
                                        <option value="22">未核单</option>
                                        <option value="24">未包装</option>
                                        <option value="40">待发货</option>
                                        <option value="26">订单缺货(仓库)</option>
                                        <option value="28">缺货待包装</option>
                                        <option value="100">已发货</option>
                                        <option value="200">已归档</option>
                                        <option value="0">等待付款</option>
                                        <option value="1">订单缺货</option>
                                        <option value="2">订单退货</option>
                                        <option value="3">订单取消</option>
                                        <option value="4">其他异常订单</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-form-label label_reset">
                                    <select name="orderType">
                                        <option value="0" selected>普源订单编号</option>
                                        <option value="1">申请跟踪号</option>
                                        <option value="2">标记跟踪号</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="supplier" type="text" class="layui-input" placeholder="支持多个精确查询,英文逗号分隔"/>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl_10">
                                <button id="nmt_searchBtn" class="layui-btn layui-btn-sm" type="button">查询</button>
                                <button type="reset" id="nmt_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="numberMarktrackingCard">
                <div class="layui-card-header">
                  <%--<permTag:perm funcCode="numberMarktracking_markauto">--%>
                    <%--<button type="button" class="layui-btn layui-btn-sm" id="matchmark">匹配标记跟踪号</button>--%>
                  <%--</permTag:perm>--%>
                  <%--<permTag:lacksPerm funcCode="numberMarktracking_markauto">--%>
                      <%--<button type="button" class="layui-btn layui-btn-sm layui-btn-disabled">匹配标记跟踪号</button>--%>
                  <%--</permTag:lacksPerm>--%>
                  <button type="button" class="layui-btn layui-btn-sm" id="matchtrack_batch">批量重标</button>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="marktrack_table" lay-filter="marktrack_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 表格渲染模板 -->
    <script type="text/html" id="pl_responsible">
      <permTag:perm funcCode="numberMarktracking_markone">
        <button class="layui-btn layui-btn-sm" lay-event="mark">手动标记</button>
      </permTag:perm>
      <permTag:lacksPerm funcCode="numberMarktracking_markone">
          <button class="layui-btn layui-btn-sm layui-btn-disabled">手动标记</button>
      </permTag:lacksPerm>
        
    </script>
<!-- 手动标记跟踪号弹框 -->
<script type="text/html" id="manually_track_layer">
    <form class="layui-form m_20">
        <div class="layui-inline">
            <label class="layui-form-label">跟踪号</label>
                <div class="layui-input-block">
                    <input name="trackNo_input" type="text" class="layui-input" id="trackNo_input"/>
                </div>
        </div>
        <div class="layui-inline">
            <button class="layui-btn layui-btn-sm" id="mark_btn">标记</button>
        </div>
    </form>
    <div>
        <div class="m_20">订单时间-42小时至+18小时内未使用过的跟踪号明细:</div>
        <div class="m_20">
        <table class="layui-table" id="mark_table" lay-filter="mark_table"></table>
        </div>
    </div>
</script>

<!-- 表格渲染模板 -->

<script type="text/html" id="pl_allrootNid">
    <span title="店铺单号:{{d.transactionId}}">
        {{d.allrootNid}}(
        {{#  if(d.orderStatus==5){ }}
            <span style="color: grey;">待派单</span>
        {{#  } else if(d.orderStatus==6) { }}
           <span style="color: grey;">已派单</span>
        {{#  } else if(d.orderStatus==20) { }}
            <span style="color: green;">未拣货</span>
        {{#  } else if(d.orderStatus==22) { }}
            <span style="color: green;">未核单</span>
        {{#  } else if(d.orderStatus==24) { }}
            <span style="color: green;">未包装</span>
        {{#  } else if(d.orderStatus==40) { }}
            <span style="color: green;">待发货</span>
        {{#  } else if(d.orderStatus==26) { }}
            <span style="color: green;">订单缺货(仓库)</span>
        {{#  } else if(d.orderStatus==28) { }}
            <span style="color: green;">缺货待包装</span>
        {{#  } else if(d.orderStatus==100) { }}
            <span style="color: green;">已发货</span>
        {{#  } else if(d.orderStatus==200) { }}
            <span style="color: grey;">已归档</span>
        {{#  } else if(d.orderStatus==0) { }}
            <span style="color: grey;">等待付款</span>
        {{#  } else if(d.orderStatus==1) { }}
            <span style="color: grey;">订单缺货</span>
        {{#  } else if(d.orderStatus==2) { }}
            <span style="color: grey;">订单退货</span>
        {{#  } else if(d.orderStatus==3) { }}
            <span style="color: grey;">订单取消</span>
        {{#  } else if(d.orderStatus==4) { }}
            <span style="color: grey;">其他异常订单</span>
        {{#  }else{ }}
                                未知状态
        {{#  } }}
        )
        </span>
</script>

<script type="text/html" id="pl_ordertime">
    {{Format(d.orderTimeCn,'yyyy-MM-dd hh:mm:ss')}}
</script>

<script type="text/html" id="pl_markTime">
    {{Format(d.markTime,'yyyy-MM-dd hh:mm:ss')}}
</script>

<script type="text/html" id="pl_processedTime">
    {{Format(d.processedTime,'yyyy-MM-dd hh:mm:ss')}}
</script>

<script type="text/html" id="pl_createTime">
    {{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}
</script>

<script type="text/html" id="pl_markStatus">
    {{#  if(d.markStatus==0){ }}
        <span style="color: red;" title="{{d.markMsg}}">未标记</span>
    {{#  } else if(d.markStatus==2) { }}
        <span style="color: orange;" title="{{d.markMsg}}">标记失败</span>
    {{#  } else if(d.markStatus==1) { }}
    <span style="color: greenyellow;" title="{{d.markMsg}}">欧速通成功</span>
    {{#  } else if(d.markStatus==11) { }}
    <span style="color: green;" title="{{d.markMsg}}">标记成功(妥投)</span>
    {{#  }else{ }}
        未知状态
    {{#  } }}
    (
    {{#  if(d.isAllrootMark){ }}
        <span>普源已标</span>
    {{#  }else{ }}
        <span style="color: darkgrey;">普源未标</span>
    {{#  } }}
    )
    {{#  if(d.markStatus==2){ }}
    <br><span>{{d.markMsg}}</span>
    {{#  } }}
</script>

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
        laydate.render({
            elem: '#ordertime', //指定元素
            range:true,
            type: 'date'
        });
        //表单查询
        $('#nmt_searchBtn').click(function(){
            tableIns.reload({
                where:getSearchData(),
            })
        });
        function getSearchData(){
            var data = serializeObject($('#order_searchForm'));
            var orderTypeobj = {'0':'allrootNids','1':'trackNos','2':'markTrackNos'}
            var orderType = orderTypeobj[data.orderType];
            data[orderType] = data.supplier;
            data.startTime = data.ordertime.split(' - ')[0]?data.ordertime.split(' - ')[0]:"";
            data.endTime = data.ordertime.split(' - ')[1]?data.ordertime.split(' - ')[1] + " 23:59:59":"";
            delete data.supplier;
            delete data.orderType;
            delete data.ordertime;
            return data;
        }
        //表单清空
//      $('#nmt_searchReset').click(function(){
//          $("#order_searchForm input").each(function(index,item){
//              $(item).val("");
//          });
//          return false
//     });

       var tableIns = table.render({
        elem: "#marktrack_table",
            method: 'post',
            url: ctx + "/ebayostorder/list.html",
            cols: [
                [
                    {checkbox:true,width:30},
                    { field: "allrootNid",title: "普源订单编号",templet:'#pl_allrootNid'},
                    { field: "storeAcct",title: "店铺"},
                    { field: "orderTimeCn",title: "订单时间",templet:'#pl_ordertime'},
                    { field: "trackNo",title: '发货跟踪号'},
                    { field: "markTrackNo",title: '标记跟踪号'},
                    { field: "markStatus",title: '标记状态',templet:"#pl_markStatus"},
                    { field: "markTime",title: '标记时间',templet:'#pl_markTime'},
                    { field: "processedTime",title: 'processed时间',templet:'#pl_processedTime'},
                    { field: "allrootMemo",title: '内部便签'},
                    { title: '操作',templet:'#pl_responsible'}
                ],
            ],
            created:function(res,curr, count){
                res.data = res.data.list;
            },
            done: function(res, curr, count){
                console.log(res);
            },
            id: "marktrack_table",
            page:true,
            limits:[100,200,500,1000],
            limit:100,
            where:getSearchData()
       });
      //手动标记弹框
       table.on('tool(marktrack_table)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        console.log(obj.data);
        layer.open({
        type: 1,
        title: "处理",
        area: ["60%", "50%"],
        shadeClose: false,
        content: $("#manually_track_layer").html(),
        success:function (index, layero) {
            form.render();
            table.render({
            elem: "#mark_table",
            method: 'post',
            url: ctx + "/ebayostorder/listtrackno.html?id="+data.id,
            cols: [
                [
                    { field: "trackNo",title: "跟踪号"},
                    { field: "createTime",title: "订单时间",templet:'#pl_createTime'},
                    { field: "processedTime",title: "processed时间",templet:'#pl_processedTime'},
                ],
            ],
            done: function(res, curr, count){
                console.log(res);
            },
            id: "mark_table",  
            })
           
            $('#mark_btn').click(function(){
                var trackno = $('#trackNo_input').val();
                if(trackno!==""){
                    layer.confirm('您确定要标记吗', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        $.ajax({
                       type:"post",
                       url:ctx + "/ebayostorder/markone.html?id="+data.id+"&&trackNo="+trackno,
                       dataType:"json",
                       success:function(returnData){
                           console.log(returnData)
                           if(returnData.code=="0000"){
                               layer.msg("标记成功！")
                               layer.close(index);
                           }else{
                            layer.msg(returnData.msg);
                           }
                       }
                });
                    }, function(){
                    });
                }else{
                    layer.msg("请输入跟踪号");
                }
                return false;
            })
        }
        })
    });

    $(function(){
    var ebayPublishStoreList = [];
    $.ajax({
        type:"post",
        url:ctx + "/sys/listuserstore.html?platCode=ebay",
        dataType:"json",
        success:function(returnData){
            console.log(returnData);
            if(returnData.code != "0000"){
                $('select[name="storeAcct"]').append('<option value="-1">没有数据</option>');
            }else{
                var $option="<option value=''>全部</option>";
                returnData.data.forEach(function(item){
                    $option += '<option value='+item.storeAcct+'>'+item.storeAcct+'</option>';
                });
                $('select[name="storeAcct"]').append($option);
            }
            form.render('select');
        }
    });
    });

    $('#matchtrack_batch').click(function(){
        var checkStatus = table.checkStatus('marktrack_table'); //获取选择的店铺
        var checkAcctNum=checkStatus.data.length;
        if(checkAcctNum==null||checkAcctNum<1){
            layer.msg("请选择需要重新标记的订单",{icon:0});
            return;
        }
          var orderIds = []
          for (var i = 0; i < checkStatus.data.length; ++i) {
            orderIds.push(checkStatus.data[i].id)
          }
        layer.confirm('重新标记选中订单？', {
             btn: ['确定','取消']
        }, function(){
            layui.admin.load.show();
            $.ajax({
                type:"post",
                url:ctx + "/ebayostorder/batchmark.html",
                dataType:"json",
                data:{orderIds : orderIds.join(",")},
                success:function(returnData){
                    layui.admin.load.hide();
                    if(returnData.code!=="0000"){
                        layer.msg(returnData.msg);
                    }else{
                        layer.msg("标记完成，共标记"+returnData.data+"条");
                    }
                }
            });
        }, function(){
        });
    });
    
    //悬浮显示全部错误信息
    $("#ebayPublish_tab").on('mouseover', '.ebayPublish-respMsg pre', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        layer.tips(content, $(this),{
          tips: [2, 'red'],
          area: ['40%', 'auto'],
          time: 0
        });
    });
    $("#ebayPublish_tab").on('mouseout', '.ebayPublish-respMsg pre', function() {
        layer.closeAll();
    });
});

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

function formatStatus(str){
    var obj = {"0":"未标记","1":"已标记","2":"标记失败"}
    return obj[str];
}
</script>