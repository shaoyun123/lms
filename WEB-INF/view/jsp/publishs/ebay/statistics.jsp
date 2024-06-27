<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>ebay刊登统计</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="es_searchForm" class="layui-form" lay-filter="component-form-group">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="es_orgIdList" name="orgIdList" lay-search lay-filter="es_org" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="sellerId" lay-filter="es_sellerId" lay-search data-rolelist="ebay专员" class="users_hp_custom">
                                       <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" lay-search class="store_hp_custom" data-platcode="ebay">
                                       <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">刊登时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input ebayPublishStatisticTime">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">账号类型</label>
                                <div class="layui-input-block">
                                    <select name="acctTypeList" xm-select="es_acctType" xm-select-search ></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button id="es_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" id="es_resetBtn">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <!-- 表格渲染 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <table id="es_table" lay-filter="es_tablefilter" class="layui-table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
layui.use(['admin', 'form','table', 'layer','laydate','formSelects'], function() {
    var admin = layui.admin,
        form = layui.form,
        laydate = layui.laydate,
        table = layui.table,
        formSelects = layui.formSelects,
        layer = layui.layer;

    render_hp_orgs_users('#es_searchForm')//渲染部门销售员店铺三级联动
        
    laydate.render({
       elem: '#es_searchForm .ebayPublishStatisticTime'
        ,range: true
    });
    
    form.render();
    es_init()

    function es_init() {
        // 账号类型
        commonReturnPromise({
            url: ctx + "/sys/ebayAcctTypeEnum.html",
            type: "post",
        }).then((res) => {
            formSelects.data("es_acctType", "local", {
            arr: res.map((item) => ({ ...item, value: item.name })),
            })
        })
    }
    
    function getSearchData(){
        var data = {};
        data.platCode = "ebay";
        var time = $("#es_searchForm .ebayPublishStatisticTime").val();
        if(time != ""){
            data.startTime = time.split(" - ")[0] +" 00:00:00";
            data.endTime = time.split(" - ")[1] +" 00:00:00";
        }else{
            data.startTime  ="";
            data.endTime = "";
        }
        data.orgIdList = $("#es_searchForm select[name=orgIdList]").val();
        //人员
        data.sellerId = $("#es_searchForm select[name=sellerId]").val();
        data.storeAcctId = $("#es_searchForm select[name=storeAcctId]").val();
        data.orderField = "listing_day";
        data.orderDirection = "desc";
        data.acctTypeList = formSelects.value('es_acctType','valStr')
        return data;
    }
    //表格渲染
    table.render({
        elem:'#es_table',
        cols: [
            [ //表头
                { field: 'seller', title: '销售', width: '10%', sort:true},
                { field: 'storeAcct', title: '店铺', width: '15%', sort:true},
                { field: 'listingDay', title: '日期', sort: true, width: '15%', sort:true},
                { field: 'fixedPriceItemNum', title: '一口价数量', width: '14%'},
                { field: 'totalFixedPriceItemNum', title: '一口价累计数量', width: '15%'},
                { field: 'chineseNum', title: '拍卖数量', width: '14%'},
                { field: 'totalChineseNum', title: '拍卖累计数量', width: '15%'}
            ]
        ],
        page: false
    });
    
    $("#es_searchBtn").click(function(){
        //执行重载
        table.reload('es_table', {
           url: '${ctx}/listingstatistics/list.html', // 数据接口
           where: getSearchData(),
           
        });
    });
    
    $("#es_resetBtn").click(function(){
        $("#es_orgIdList").next().find('dd[lay-value=""]').trigger('click');
    });
    //监听排序
    table.on('sort(es_tablefilter)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
      console.log(obj.field); //当前排序的字段名
      console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
      console.log(this); //当前排序的 th 对象
      //尽管我们的 table 自带排序功能，但并没有请求服务端。
      //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
      var searchData = getSearchData();
      searchData.orderField = obj.field;
      searchData.orderDirection = obj.type;
      table.reload('es_table', {
          initSort: obj, //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
          where: searchData
      });
    });
    
    //加载销售
    // $(function(){
    //     $.ajax({
    //        type: "post",
    //        url: ctx + "/salesplat/listsalesperson.html",
    //        dataType: "json",
    //        data:{platCode:"ebay"},
    //        success: function(returnData) {
    //            if (returnData.code == "0000") {
    //                $(returnData.data).each(function() {
    //                    $("#es_searchForm select[name=sellerId]").append("<option  value='" + this.salespersonId + "'>" + this.salesperson + "</option>");
    //                });
    //                $("#es_searchForm select[name=sellerId]").next('div').find('dd:first').trigger('click')
    //                form.render('select');
    //            } else {
    //                layer.msg("组织部门加载失败" + returnData.msg);
    //            }
    //        }
    //    });
    // });
    
    // form.on('select(es_sellerId)', function (data) {
    //     var salespersonId=data.value;
    //     $.ajax({
    //         type: "post",
    //         data:{
    //             salespersonId:salespersonId,
    //             platCode : "ebay"
    //         },
    //         url: ctx + "/salesplat/listbysalesperson.html",
    //         dataType: "json",
    //         success: function (returnData) {
    //             if (returnData.code == "0000") {
    //                 var str = "<option value=''></option>";
    //                 currentStoreAccts=[]
    //                 $.each(returnData.data,function (i,v) {
    //                     str += "<option value='" + v.id + "'>" + v.storeAcct + "</option>";
    //                     currentStoreAccts.push(v.id);
    //                 });
    //                 $("#es_searchForm select[name=storeAcctId]").html(str);
    //                 form.render('select');
    //             } else {
    //                 layer.msg(returnData.msg);
    //             }
    //         }
    //     })
    // });

})
</script>