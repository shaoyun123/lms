<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>shopee刊登统计</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="ss_searchForm" class="layui-form" lay-filter="component-form-group">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="sellerId" lay-filter="ss_sellerId" lay-search>
                                       <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" lay-search>
                                       <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">刊登时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input shopeePublishStatisticTime">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button id="ss_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <!-- 表格渲染 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <table id="ss_table" lay-filter="ss_tablefilter" class="layui-table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
layui.use(['admin', 'form','table', 'layer','laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        laydate = layui.laydate,
        table = layui.table,
        layer = layui.layer;
        
    laydate.render({
       elem: '#ss_searchForm .shopeePublishStatisticTime'
        ,range: true
    });
    
    form.render();
    
    function getSearchData(){
        var data = {};
        data.platCode = "shopee";
        var time = $("#ss_searchForm .shopeePublishStatisticTime").val();
        if(time != ""){
            data.startTime = Date.parse(time.split(" - ")[0] +" 00:00:00");
            data.endTime = Date.parse(time.split(" - ")[1] +" 00:00:00");
        }else{
            data.startTime  ="";
            data.endTime = "";
        }
        //人员
        data.sellerId = $("#ss_searchForm select[name=sellerId]").val();
        data.storeAcctId = $("#ss_searchForm select[name=storeAcctId]").val();
        data.orderField = "listing_day";
        data.orderDirection = "desc";
        return data;
    }
    //表格渲染
    table.render({
        elem:'#ss_table',
        cols: [
            [ //表头
                { field: 'seller', title: '销售', width: '15%', sort:true},
                { field: 'storeAcct', title: '店铺', width: '20%', sort:true},
                { field: 'listingDay', title: '日期', sort: true, width: '20%', sort:true},
                { field: 'listingNum', title: '刊登数量', width: '20%'},
                { field: 'totalListingNum', title: '累计刊登数量', width: '25%'}
            ]
        ],
        page: false
    });
    
    $("#ss_searchBtn").click(function(){
        //执行重载
        table.reload('ss_table', {
           url: '${ctx}/listingstatistics/list.html', // 数据接口
           where: getSearchData(),
           
        });
    });
    //监听排序
    table.on('sort(ss_tablefilter)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
      console.log(obj.field); //当前排序的字段名
      console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
      console.log(this); //当前排序的 th 对象
      //尽管我们的 table 自带排序功能，但并没有请求服务端。
      //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
      var searchData = getSearchData();
      searchData.orderField = obj.field;
      searchData.orderDirection = obj.type;
      table.reload('ss_table', {
          initSort: obj, //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
          where: searchData
      });
    });
    
    //加载销售
    $(function(){
        $.ajax({
           type: "post",
           url: ctx + "/salesplat/listsalesperson.html",
           dataType: "json",
           data:{platCode:"shopee"},
           success: function(returnData) {
               if (returnData.code == "0000") {
                   $(returnData.data).each(function() {
                       $("#ss_searchForm select[name=sellerId]").append("<option  value='" + this.salespersonId + "'>" + this.salesperson + "</option>");
                   });
                   $("#ss_searchForm select[name=sellerId]").next('div').find('dd:first').trigger('click')
                   form.render('select');
               } else {
                   layer.msg("组织部门加载失败" + returnData.msg);
               }
           }
       });
    });
    
    form.on('select(ss_sellerId)', function (data) {
        var salespersonId=data.value;
        $.ajax({
            type: "post",
            data:{
                salespersonId:salespersonId,
                platCode : "shopee"
            },
            url: ctx + "/salesplat/listbysalesperson.html",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var str = "<option value=''></option>";
                    currentStoreAccts=[]
                    $.each(returnData.data,function (i,v) {
                        str += "<option value='" + v.id + "'>" + v.storeAcct + "</option>";
                        currentStoreAccts.push(v.id);
                    });
                    $("#ss_searchForm select[name=storeAcctId]").html(str);
                    form.render('select');
                } else {
                    layer.msg(returnData.msg);
                }
            }
        })
    });

})
</script>